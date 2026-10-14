/**
 * =======================================================================
 * DATA STORE, CART & ORDER STATE MANAGEMENT
 * =======================================================================
 */

const Store = {
  get(key, storage = localStorage) {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Storage read error:", e);
      return null;
    }
  },

  set(key, val, storage = localStorage) {
    try {
      storage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error("Storage write error:", e);
    }
  }
};

// Global Helpers
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const money = (amount) => {
  if (window.BRAND_CONFIG && window.BRAND_CONFIG.currency && typeof window.BRAND_CONFIG.currency.format === "function") {
    return window.BRAND_CONFIG.currency.format(amount);
  }
  return "PKR " + Number(amount || 0).toLocaleString("en-US");
};

const MAXQ = 20;
const clampQ = (q) => Math.min(Math.max(parseInt(q) || 1, 1), MAXQ);

function getProducts() {
  const deletedIds = Store.get("app_deleted_products") || [];
  let stored = Store.get("app_products");
  if (stored && Array.isArray(stored) && stored.length > 0) {
    // Filter out temporary test products and deleted products
    stored = stored.filter(p => !p.id.startsWith("test-") && p.slug !== "kashmiri-raw-walnut-delight" && p.name !== "Kashmiri Raw Walnut Delight" && !deletedIds.includes(p.id));

    // Ensure official default 3 products exist (if not deleted) and are ordered 500g first, 1kg second, 250g third
    if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
      const defaultIds = ["msr-500", "msr-1kg", "msr-250"].filter(id => !deletedIds.includes(id));
      const officialMap = new Map();
      window.PRODUCTS.forEach(p => officialMap.set(p.id, p));

      const orderedDefaults = defaultIds.map(id => {
        const fromStored = stored.find(s => s.id === id);
        return fromStored || officialMap.get(id);
      }).filter(Boolean);

      const customProds = stored.filter(p => !defaultIds.includes(p.id));
      stored = [...orderedDefaults, ...customProds];
      Store.set("app_products", stored);
    }

    window.PRODUCTS = stored;
    return stored;
  }
  if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
    const initial = window.PRODUCTS.filter(p => !deletedIds.includes(p.id));
    Store.set("app_products", initial);
    return initial;
  }
  return [];
}

function saveProducts(prods) {
  window.PRODUCTS = prods;
  Store.set("app_products", prods);
}

const getP = (id) => getProducts().find((p) => p.id === id);
const getPBySlug = (slug) => getProducts().find((p) => p.slug === slug);
const canBuy = (p) => p && p.price != null && (p.stock == null || p.stock > 0);
const priceTxt = (p) => {
  if (!p) return "";
  if (p.stock !== undefined && p.stock <= 0) return "Out of Stock";
  return p.price != null ? money(p.price) : "Price on Request";
};

// Cart State
let cart = { items: {} };

function initCart() {
  const prods = getProducts();
  const savedCart = Store.get("app_cart") || Store.get("msr_cart") || {};
  const src = savedCart.items || {};
  prods.forEach((p) => {
    const q = Math.min(Math.max(parseInt(src[p.id]) || 0, 0), MAXQ);
    if (q && canBuy(p)) {
      cart.items[p.id] = q;
    }
  });
}

function saveCart() {
  Store.set("app_cart", cart);
  Store.set("msr_cart", cart); // Backward compatibility
  if (typeof updateBadge === "function") {
    updateBadge();
  }
}

function lines() {
  return (window.PRODUCTS || [])
    .map((p) => ({ p, qty: cart.items[p.id] || 0 }))
    .filter((l) => l.qty > 0 && canBuy(l.p));
}

function itemCount() {
  return lines().reduce((sum, line) => sum + line.qty, 0);
}

function totals() {
  const sub = lines().reduce((s, l) => s + l.qty * l.p.price, 0);
  const deliveryCfg = (window.BRAND_CONFIG && window.BRAND_CONFIG.delivery) || { fee: 200, freeShippingThreshold: 5000 };
  const freeThreshold = deliveryCfg.freeShippingThreshold || 999999;
  const isFree = sub >= freeThreshold;
  const ship = sub === 0 ? 0 : (isFree ? 0 : (deliveryCfg.fee || 200));
  return { sub, ship, total: sub + ship, isFree };
}

// Order Management & Tracking DB Helpers
let lastOrder = Store.get("app_last_order", sessionStorage) || Store.get("msr_order", sessionStorage);

function formatOrderDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getAllOrders() {
  return Store.get("app_orders") || [];
}

function findOrder(query) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  const cleanQ = q.replace(/[^0-9a-z]/gi, "");
  const orders = getAllOrders();
  return orders.find(o => {
    const cust = o.customer || {};
    const oId = String(o.id || "").toLowerCase();
    const phone = String(cust.phone || o.phone || "").replace(/[^0-9]/g, "");
    const email = String(cust.email || o.email || "").toLowerCase();
    return oId.includes(q) || (cleanQ.length >= 4 && phone.includes(cleanQ)) || email === q;
  });
}

function saveOrder(order) {
  const orders = getAllOrders();
  const now = new Date();
  const timeFormatted = formatOrderDate(now);

  order.createdAt = order.createdAt || now.toISOString();
  order.dateFormatted = formatOrderDate(order.createdAt);
  order.status = order.status || "Pending";
  
  if (!order.tracking) {
    order.tracking = {
      courier: "",
      trackingNumber: "",
      dispatchedAt: null,
      deliveredAt: null
    };
  }

  if (!order.timeline || !order.timeline.length) {
    order.timeline = [
      {
        status: "Pending",
        title: "Order Placed",
        time: timeFormatted,
        note: "Order placed online via storefront checkout"
      }
    ];
  }

  orders.unshift(order);
  Store.set("app_orders", orders);
  Store.set("app_last_order", order, sessionStorage);
  Store.set("msr_order", order, sessionStorage);
  lastOrder = order;
  return order;
}

function updateOrderStatusInDb(orderId, newStatus, note = "", trackingInfo = null) {
  const orders = getAllOrders();
  const target = orders.find(o => o.id === orderId);
  if (!target) return null;

  target.status = newStatus;
  target.updatedAt = new Date().toISOString();
  const timeFormatted = formatOrderDate(new Date());

  if (!target.timeline) target.timeline = [];

  let title = `Status updated to ${newStatus}`;
  if (newStatus === "Approved") title = "Order Approved & Confirmed";
  else if (newStatus === "Processing") title = "Packed & Ready for Dispatch";
  else if (newStatus === "Dispatched") title = "Dispatched with Courier Partner";
  else if (newStatus === "Delivered") title = "Delivered to Customer";
  else if (newStatus === "Cancelled") title = "Order Cancelled";

  if (trackingInfo) {
    target.tracking = { ...target.tracking, ...trackingInfo };
    if (newStatus === "Dispatched") target.tracking.dispatchedAt = target.updatedAt;
    if (newStatus === "Delivered") target.tracking.deliveredAt = target.updatedAt;
  }

  target.timeline.push({
    status: newStatus,
    title,
    time: timeFormatted,
    note: note || (trackingInfo ? `Courier: ${trackingInfo.courier} (Tracking #${trackingInfo.trackingNumber})` : `Order marked as ${newStatus}`)
  });

  Store.set("app_orders", orders);
  if (lastOrder && lastOrder.id === orderId) {
    lastOrder = target;
    Store.set("app_last_order", target, sessionStorage);
  }
  return target;
}

// Generate luxury WhatsApp confirmation receipt
function generateOrderWhatsAppMessage(order) {
  const brand = (window.BRAND_CONFIG && window.BRAND_CONFIG.brand) || { name: "MSR Foods" };
  const cust = order.customer || { name: order.name, phone: order.phone, address: order.addr, city: order.city };
  const itemsText = (order.items || []).map(i => `• ${i.name} (${i.weight || "Standard"}) × ${i.qty} = PKR ${(i.qty * i.price).toLocaleString()}`).join("\n");
  const trackUrl = `${window.location.origin}${window.location.pathname}#/track/${order.id}`;

  return `🌟 *ORDER CONFIRMATION — ${brand.name.toUpperCase()}* 🌟
-----------------------------------------
📋 *Order ID:* #${order.id}
📅 *Date:* ${order.dateFormatted || formatOrderDate(order.createdAt)}
🚦 *Current Status:* ${order.status.toUpperCase()}

👤 *Customer:* ${cust.name || "Customer"}
📞 *Phone:* ${cust.phone || ""}
📍 *Delivery Address:* ${cust.address || ""}, ${cust.city || ""}

📦 *Items Ordered:*
${itemsText}

🚚 *Delivery Fee:* ${order.shipping === 0 ? "FREE SHIPPING" : `PKR ${order.shipping}`}
💰 *TOTAL AMOUNT:* PKR ${(order.total || 0).toLocaleString()} (${order.paymentMethod || "Cash on Delivery"})
-----------------------------------------
🔍 *Live Order Tracking:*
${trackUrl}

Thank you for trusting ${brand.name}! Your order is being freshly packed with pure natural goodness.`;
}

if (typeof window !== "undefined") {
  window.Store = Store;
  window.money = money;
  window.cart = cart;
  window.initCart = initCart;
  window.saveCart = saveCart;
  window.lines = lines;
  window.itemCount = itemCount;
  window.totals = totals;
  window.getP = getP;
  window.getPBySlug = getPBySlug;
  window.canBuy = canBuy;
  window.priceTxt = priceTxt;
  window.clampQ = clampQ;
  window.getAllOrders = getAllOrders;
  window.findOrder = findOrder;
  window.saveOrder = saveOrder;
  window.updateOrderStatusInDb = updateOrderStatusInDb;
  window.formatOrderDate = formatOrderDate;
  window.generateOrderWhatsAppMessage = generateOrderWhatsAppMessage;
}
