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
  const stored = Store.get("app_products");
  if (stored && Array.isArray(stored) && stored.length > 0) {
    window.PRODUCTS = stored;
    return stored;
  }
  if (window.PRODUCTS && Array.isArray(window.PRODUCTS)) {
    Store.set("app_products", window.PRODUCTS);
    return window.PRODUCTS;
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

// Order Management Helpers
let lastOrder = Store.get("app_last_order", sessionStorage) || Store.get("msr_order", sessionStorage);

function getAllOrders() {
  return Store.get("app_orders") || [];
}

function saveOrder(order) {
  const orders = getAllOrders();
  orders.unshift(order);
  Store.set("app_orders", orders);
  Store.set("app_last_order", order, sessionStorage);
  Store.set("msr_order", order, sessionStorage);
  lastOrder = order;
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
  window.getProducts = getProducts;
  window.saveProducts = saveProducts;
  window.getAllOrders = getAllOrders;
  window.saveOrder = saveOrder;
}
