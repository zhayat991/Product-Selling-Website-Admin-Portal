/**
 * =======================================================================
 * ADMIN PORTAL CONTROLLER & DATA MANAGEMENT
 * =======================================================================
 */

const ICON = {
  phone: '<svg class="i" style="width:14px;height:14px;display:inline" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  x: '<svg class="i" style="width:18px;height:18px" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg class="i" style="width:16px;height:16px" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
};

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerHTML = `<span>${msg}</span>`;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

// Seed initial orders if empty so dashboard is active immediately
function seedDefaultOrders() {
  const existing = Store.get("app_orders");
  if (!existing || existing.length === 0) {
    const demoOrders = [
      {
        id: "MSR-261014-9124",
        createdAt: "2026-10-14T11:42:00Z",
        status: "Pending",
        items: [{ id: "msr-500", name: "MSR Honey Nut Mix", weight: "500g", qty: 2, price: 1599 }],
        subtotal: 3198,
        shipping: 200,
        total: 3398,
        paymentMethod: "cod",
        customer: {
          name: "Muhammad Usman",
          phone: "03001234567",
          email: "usman.pk@gmail.com",
          address: "House 14-B, Street 5, F-7/2",
          city: "Islamabad",
          province: "Islamabad Capital Territory",
          zip: "44000",
          notes: "Please call before arrival"
        }
      },
      {
        id: "MSR-261013-8412",
        createdAt: "2026-10-13T16:15:00Z",
        status: "Processing",
        items: [{ id: "msr-1kg", name: "MSR Honey Nut Mix", weight: "1kg (1000g)", qty: 1, price: 2999 }],
        subtotal: 2999,
        shipping: 200,
        total: 3199,
        paymentMethod: "easypaisa",
        customer: {
          name: "Dr. Ayesha Tariq",
          phone: "03335558899",
          email: "ayesha.t@outlook.com",
          address: "Apartment 402, Royal Heights, Gulberg III",
          city: "Lahore",
          province: "Punjab",
          zip: "54000",
          notes: "Hand over to building security if not home"
        }
      },
      {
        id: "MSR-261012-7319",
        createdAt: "2026-10-12T10:05:00Z",
        status: "Shipped",
        items: [
          { id: "msr-500", name: "MSR Honey Nut Mix", weight: "500g", qty: 1, price: 1599 },
          { id: "msr-1kg", name: "MSR Honey Nut Mix", weight: "1kg (1000g)", qty: 1, price: 2999 }
        ],
        subtotal: 4598,
        shipping: 200,
        total: 4798,
        paymentMethod: "bank",
        customer: {
          name: "Hamza Shafiq",
          phone: "03214447788",
          email: "hamza.s@yahoo.com",
          address: "B-24, Phase 6, DHA",
          city: "Karachi",
          province: "Sindh",
          zip: "75500",
          notes: "TCS tracking # 771829031"
        }
      },
      {
        id: "MSR-261010-5201",
        createdAt: "2026-10-10T14:30:00Z",
        status: "Delivered",
        items: [{ id: "msr-500", name: "MSR Honey Nut Mix", weight: "500g", qty: 3, price: 1599 }],
        subtotal: 4797,
        shipping: 200,
        total: 4997,
        paymentMethod: "jazzcash",
        customer: {
          name: "Sarmad Ali",
          phone: "03459992211",
          email: "sarmad.ali@gmail.com",
          address: "Sector B-1, Hayatabad",
          city: "Peshawar",
          province: "KPK",
          zip: "25000",
          notes: "Satisfied customer - reorder"
        }
      }
    ];
    Store.set("app_orders", demoOrders);
  }
}

// Current Filter State
let currentOrderFilter = "all";

// Tab Navigation
function initTabs() {
  const navItems = $$(".sidebar-nav .nav-item");
  const panels = $$(".tab-panel");
  const titleEl = $("#topbarTitle");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tabId = item.dataset.tab;
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      panels.forEach(p => {
        p.classList.toggle("active", p.id === `tab-${tabId}`);
      });

      if (titleEl) {
        titleEl.textContent = item.querySelector("span").textContent;
      }

      if (tabId === "orders") renderOrdersTable();
      if (tabId === "products") renderProductsGrid();
      if (tabId === "dashboard") renderDashboard();
    });
  });
}

// Render Dashboard Overview
function renderDashboard() {
  const orders = Store.get("app_orders") || [];
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const totalUnits = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.qty || 0), 0), 0);
  const aov = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  $("#kpiRevenue").textContent = money(totalRevenue);
  $("#kpiOrders").textContent = orders.length;
  $("#kpiUnits").textContent = totalUnits;
  $("#kpiAov").textContent = money(aov);

  // Render Recent Orders in Dashboard
  const recentTbody = $("#recentOrdersTable");
  if (!recentTbody) return;

  const recent = orders.slice(0, 5);
  recentTbody.innerHTML = recent.map(o => `
    <tr>
      <td><b style="color:var(--gold-hi)">${o.id}</b></td>
      <td>${esc((o.customer && o.customer.name) || o.name || "Customer")}</td>
      <td>${new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
      <td><b>${money(o.total)}</b></td>
      <td><span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <button class="btn btn-xs btn-line" onclick="openOrderModal('${o.id}')">View</button>
      </td>
    </tr>
  `).join("");
}

// Render Full Orders Tab
function renderOrdersTable() {
  const tbody = $("#ordersTableBody");
  if (!tbody) return;

  let orders = Store.get("app_orders") || [];
  if (currentOrderFilter !== "all") {
    orders = orders.filter(o => o.status.toLowerCase() === currentOrderFilter);
  }

  const query = $("#orderSearchInput") ? $("#orderSearchInput").value.trim().toLowerCase() : "";
  if (query) {
    orders = orders.filter(o => {
      const cust = o.customer || {};
      return (
        o.id.toLowerCase().includes(query) ||
        (cust.name || o.name || "").toLowerCase().includes(query) ||
        (cust.phone || o.phone || "").includes(query) ||
        (cust.city || o.city || "").toLowerCase().includes(query)
      );
    });
  }

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:36px;color:var(--mute-dark)">No orders found for this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => {
    const cust = o.customer || { name: o.name, phone: o.phone, city: o.city };
    const dateFormatted = new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const waLink = cust.phone ? `https://wa.me/92${cust.phone.replace(/^0/, "")}` : "#";

    return `
      <tr>
        <td><b style="color:var(--gold-hi);font-family:monospace">${o.id}</b></td>
        <td>
          <b>${esc(cust.name || "Customer")}</b>
          <br><small style="color:var(--mute-dark)">${esc(cust.city || "Pakistan")}</small>
        </td>
        <td>
          <a href="${waLink}" target="_blank" rel="noopener" style="color:var(--gold-hi);display:inline-flex;align-items:center;gap:4px">
            ${esc(cust.phone)} ${ICON.phone}
          </a>
        </td>
        <td><small>${dateFormatted}</small></td>
        <td><b>${money(o.total)}</b><br><small style="text-transform:uppercase">${o.paymentMethod || o.pay || "cod"}</small></td>
        <td>
          <select class="f" style="padding:6px 10px;font-size:13px;border-radius:6px;width:auto" onchange="updateOrderStatus('${o.id}', this.value)">
            <option value="Pending" ${o.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Processing" ${o.status === "Processing" ? "selected" : ""}>Processing</option>
            <option value="Shipped" ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
            <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
            <option value="Cancelled" ${o.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn btn-xs btn-line" onclick="openOrderModal('${o.id}')">Details</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
  const orders = Store.get("app_orders") || [];
  const target = orders.find(o => o.id === orderId);
  if (target) {
    target.status = newStatus;
    Store.set("app_orders", orders);
    toast(`Order ${orderId} updated to ${newStatus}`);
    renderDashboard();
    renderOrdersTable();
  }
}

// Order Details Modal
function openOrderModal(orderId) {
  const orders = Store.get("app_orders") || [];
  const o = orders.find(x => x.id === orderId);
  if (!o) return;

  const cust = o.customer || { name: o.name, phone: o.phone, email: o.email, address: o.addr, city: o.city, province: o.prov, notes: o.note };
  const modal = $("#dlg-order-details");
  if (!modal) return;

  modal.innerHTML = `
    <div class="dlg" style="width:min(640px,94vw)">
      <button class="ic dlg-x" onclick="document.getElementById('dlg-order-details').close()">${ICON.x}</button>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px">
        <h3 style="font-size:22px;margin:0">Order ${o.id}</h3>
        <span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span>
      </div>
      <p style="font-size:14px;color:var(--mute-dark);margin-bottom:20px">Placed on ${new Date(o.createdAt).toLocaleString()}</p>
      
      <div style="background:rgba(255,255,255,0.02);border:1px solid var(--hair);border-radius:var(--r-sm);padding:18px;margin-bottom:20px">
        <h4 style="color:var(--gold-hi);margin-bottom:8px">Customer & Delivery Info</h4>
        <p><b>Name:</b> ${esc(cust.name)}</p>
        <p><b>Phone:</b> <a href="tel:${cust.phone}" style="color:var(--gold-hi)">${esc(cust.phone)}</a></p>
        ${cust.email ? `<p><b>Email:</b> ${esc(cust.email)}</p>` : ""}
        <p><b>Address:</b> ${esc(cust.address)}, ${esc(cust.city)}, ${esc(cust.province || "")}</p>
        ${cust.notes ? `<p><b>Special Notes:</b> <i>${esc(cust.notes)}</i></p>` : ""}
      </div>

      <div style="background:rgba(255,255,255,0.02);border:1px solid var(--hair);border-radius:var(--r-sm);padding:18px;margin-bottom:24px">
        <h4 style="color:var(--gold-hi);margin-bottom:12px">Ordered Items</h4>
        <table class="admin-table">
          ${(o.items || []).map(i => `
            <tr>
              <td><b>${esc(i.name)}</b> (${esc(i.weight || "")})</td>
              <td style="text-align:center">× ${i.qty}</td>
              <td style="text-align:right"><b>${money(i.qty * i.price)}</b></td>
            </tr>
          `).join("")}
          <tr><td colspan="2">Shipping Courier</td><td style="text-align:right">${money(o.shipping || 200)}</td></tr>
          <tr style="border-top:1.5px solid var(--gold)"><td colspan="2"><b style="font-size:16px">Total Order Value</b></td><td style="text-align:right"><b style="font-size:18px;color:var(--gold-hi)">${money(o.total)}</b></td></tr>
        </table>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:12px">
        <a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="https://wa.me/92${(cust.phone || '').replace(/^0/, '')}?text=${encodeURIComponent('Hello ' + cust.name + ', regarding your ' + window.BRAND_CONFIG.brand.name + ' order ' + o.id + '...') }">
          WhatsApp Customer
        </a>
        <button class="btn btn-line btn-sm" onclick="document.getElementById('dlg-order-details').close()">Close</button>
      </div>
    </div>
  `;

  modal.showModal();
}

// Product Catalog & Inventory State
let currentProdFilter = "all";
let tempUploadedImage = null;

// Render Products & Inventory Grid
function renderProductsGrid() {
  const container = $("#inventoryGridContainer");
  if (!container) return;

  const allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);

  // Update counts
  const inStockCount = allProducts.filter(p => (p.stock == null || p.stock > 0)).length;
  const outOfStockCount = allProducts.filter(p => p.stock !== undefined && p.stock <= 0).length;

  if ($("#countAllProds")) $("#countAllProds").textContent = allProducts.length;
  if ($("#countInStock")) $("#countInStock").textContent = inStockCount;
  if ($("#countOutOfStock")) $("#countOutOfStock").textContent = outOfStockCount;

  let filtered = allProducts;
  if (currentProdFilter === "instock") {
    filtered = allProducts.filter(p => p.stock == null || p.stock > 0);
  } else if (currentProdFilter === "outofstock") {
    filtered = allProducts.filter(p => p.stock !== undefined && p.stock <= 0);
  }

  const query = $("#productSearchInput") ? $("#productSearchInput").value.trim().toLowerCase() : "";
  if (query) {
    filtered = filtered.filter(p =>
      (p.title || p.name || "").toLowerCase().includes(query) ||
      (p.weight || "").toLowerCase().includes(query) ||
      (p.shortDesc || "").toLowerCase().includes(query)
    );
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border: 1px solid var(--hair); border-radius: var(--r-md); color: var(--mute-dark);">
        <p style="font-size: 16px; margin-bottom: 12px;">No products found matching your current filter.</p>
        <button class="btn btn-gold btn-sm" onclick="openAddProductModal()">+ Add New Product</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isOutOfStock = p.stock !== undefined && p.stock <= 0;
    const stockQty = p.stock !== undefined ? p.stock : 25;
    const stockPillClass = isOutOfStock ? "rose" : (stockQty <= 5 ? "amber" : "emerald");
    const stockText = isOutOfStock ? "Out of Stock" : (stockQty <= 5 ? `Low Stock (${stockQty})` : `In Stock (${stockQty})`);
    const imgSrc = (p.img && (p.img.front || p.img.pair)) || "assets/images/products/front.webp";

    return `
      <div class="inventory-card ${isOutOfStock ? 'out-of-stock' : ''}">
        <div class="inventory-card-img">
          <span class="pill" style="position:absolute;top:12px;left:12px;z-index:3">${esc(p.weight || "Standard")}</span>
          ${p.badge ? `<span class="tag tag-gold" style="position:absolute;top:12px;right:12px;z-index:3">${esc(p.badge)}</span>` : ""}
          ${isOutOfStock ? `<div class="out-of-stock-overlay">OUT OF STOCK</div>` : ""}
          <img src="${imgSrc}" alt="${esc(p.name || p.title)}" loading="lazy">
        </div>

        <div class="inventory-card-body">
          <h3 style="font-size:18px;margin:0;color:var(--cream)">${esc(p.title || p.name)}</h3>
          <p style="font-size:13.5px;color:var(--mute-dark);margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(p.shortDesc || p.subtitle || "")}</p>
          
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:auto;padding-top:12px;border-top:1px solid var(--hair)">
            <div>
              <b style="font-size:18px;color:var(--gold-hi)">${money(p.price)}</b>
              ${p.comparePrice ? `<small style="text-decoration:line-through;color:var(--mute-dark);margin-left:6px">${money(p.comparePrice)}</small>` : ""}
            </div>
            <span class="tag tag-${stockPillClass}">
              ${stockText}
            </span>
          </div>

          <div class="prod-actions">
            <button class="btn btn-xs btn-line" onclick="openEditProductModal('${p.id}')">
              ✏️ Edit
            </button>
            ${isOutOfStock ? `
              <button class="btn btn-xs btn-success" onclick="restockProduct('${p.id}')">
                📦 Restock
              </button>
            ` : `
              <button class="btn btn-xs btn-warning" onclick="markOutOfStock('${p.id}')">
                ⚠️ Out of Stock
              </button>
            `}
            <button class="btn btn-xs btn-danger" style="grid-column: 1 / -1" onclick="deleteProduct('${p.id}')">
              🗑️ Remove Product
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Open Modal to Add New Product
function openAddProductModal() {
  tempUploadedImage = null;
  const modal = $("#dlg-product-modal");
  if (!modal) return;

  modal.innerHTML = `
    <div class="dlg" style="width:min(720px,94vw)">
      <button class="ic dlg-x" onclick="document.getElementById('dlg-product-modal').close()">${ICON.x}</button>
      <h3 style="font-size:22px;margin-bottom:6px">Add New Product</h3>
      <p style="font-size:14px;color:var(--mute-dark);margin-bottom:20px">Create a new item in your store catalog with images, pricing, and initial stock.</p>

      <form id="productForm" onsubmit="event.preventDefault(); saveProductForm(null);">
        <div class="fgrid">
          <div class="f full">
            <label for="prodTitle">Product Title / Name *</label>
            <input id="prodTitle" placeholder="e.g. Pure Honey Walnut Crunch" required>
          </div>

          <div class="f">
            <label for="prodWeight">Weight / Size *</label>
            <input id="prodWeight" placeholder="e.g. 500g, 1kg, 250g" required>
          </div>

          <div class="f">
            <label for="prodBadge">Product Badge</label>
            <input id="prodBadge" placeholder="e.g. Best Seller, New, Organic">
          </div>

          <div class="f">
            <label for="prodPrice">Selling Price (PKR) *</label>
            <input id="prodPrice" type="number" min="1" placeholder="1599" required>
          </div>

          <div class="f">
            <label for="prodComparePrice">Original / Compare Price (PKR)</label>
            <input id="prodComparePrice" type="number" min="0" placeholder="1850">
          </div>

          <div class="f">
            <label for="prodStock">Initial Stock Units *</label>
            <input id="prodStock" type="number" min="0" value="50" required>
          </div>

          <div class="f">
            <label for="prodCategory">Category / Group</label>
            <input id="prodCategory" placeholder="e.g. honey-nut-mix">
          </div>

          <!-- Featured Image Section -->
          <div class="f full" style="margin-top:10px">
            <label>Featured Image Upload & Preview *</label>
            <div class="dropzone-box" onclick="document.getElementById('prodImgFileInput').click()">
              <input type="file" id="prodImgFileInput" accept="image/*" style="display:none" onchange="handleProductImageUpload(event)">
              <p style="margin:0;font-size:14.5px;color:var(--gold-hi)"><b>Click or Drop to Upload Image File</b></p>
              <p style="margin-top:4px;font-size:12.5px;color:var(--mute-dark)">Supports PNG, WebP, JPG up to 5MB</p>
            </div>

            <div style="margin-top:12px">
              <label for="prodImgUrlInput" style="font-size:13px;color:var(--mute-dark)">Or Enter Image URL / Asset Path</label>
              <input id="prodImgUrlInput" placeholder="assets/images/products/front.webp or https://..." oninput="previewImageFromUrl(this.value)">
            </div>

            <div style="margin-top:10px">
              <span style="font-size:12.5px;color:var(--mute-dark)">Quick Preset Jars:</span>
              <div class="preset-img-chips">
                <span class="preset-chip active" onclick="selectPresetImage('assets/images/products/front.webp', this)">Front View Jar</span>
                <span class="preset-chip" onclick="selectPresetImage('assets/images/products/back.webp', this)">Back Label Jar</span>
                <span class="preset-chip" onclick="selectPresetImage('assets/images/products/pair.webp', this)">Pair Collection</span>
              </div>
            </div>

            <div style="text-align:center;margin-top:12px" id="imagePreviewContainer">
              <img id="prodImagePreview" class="image-preview-thumb" src="assets/images/products/front.webp" alt="Preview">
            </div>
          </div>

          <div class="f full">
            <label for="prodShortDesc">Short Summary / Subtitle</label>
            <input id="prodShortDesc" placeholder="Brief 1-line hook displayed on product cards">
          </div>

          <div class="f full">
            <label for="prodFullDesc">Full Detailed Description</label>
            <textarea id="prodFullDesc" placeholder="Describe the health benefits, taste profile, and packaging..." rows="3"></textarea>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px">
          <button type="button" class="btn btn-line btn-sm" onclick="document.getElementById('dlg-product-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-gold btn-sm">Add Product</button>
        </div>
      </form>
    </div>
  `;

  modal.showModal();
}

// Open Modal to Edit Existing Product
function openEditProductModal(productId) {
  tempUploadedImage = null;
  const allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  const p = allProducts.find(x => x.id === productId);
  if (!p) return;

  const modal = $("#dlg-product-modal");
  if (!modal) return;

  const currentImg = (p.img && (p.img.front || p.img.pair)) || "assets/images/products/front.webp";

  modal.innerHTML = `
    <div class="dlg" style="width:min(720px,94vw)">
      <button class="ic dlg-x" onclick="document.getElementById('dlg-product-modal').close()">${ICON.x}</button>
      <h3 style="font-size:22px;margin-bottom:6px">Edit Product: ${esc(p.title || p.name)}</h3>
      <p style="font-size:14px;color:var(--mute-dark);margin-bottom:20px">Update pricing, description, stock units, or product photography.</p>

      <form id="productForm" onsubmit="event.preventDefault(); saveProductForm('${p.id}');">
        <div class="fgrid">
          <div class="f full">
            <label for="prodTitle">Product Title / Name *</label>
            <input id="prodTitle" value="${esc(p.title || p.name)}" required>
          </div>

          <div class="f">
            <label for="prodWeight">Weight / Size *</label>
            <input id="prodWeight" value="${esc(p.weight || '500g')}" required>
          </div>

          <div class="f">
            <label for="prodBadge">Product Badge</label>
            <input id="prodBadge" value="${esc(p.badge || '')}">
          </div>

          <div class="f">
            <label for="prodPrice">Selling Price (PKR) *</label>
            <input id="prodPrice" type="number" min="1" value="${p.price || ''}" required>
          </div>

          <div class="f">
            <label for="prodComparePrice">Original / Compare Price (PKR)</label>
            <input id="prodComparePrice" type="number" min="0" value="${p.comparePrice || ''}">
          </div>

          <div class="f">
            <label for="prodStock">Current Stock Units *</label>
            <input id="prodStock" type="number" min="0" value="${p.stock !== undefined ? p.stock : 25}" required>
          </div>

          <div class="f">
            <label for="prodCategory">Category / Group</label>
            <input id="prodCategory" value="${esc(p.group || 'honey-nut-mix')}">
          </div>

          <!-- Featured Image Section -->
          <div class="f full" style="margin-top:10px">
            <label>Featured Image Upload & Preview *</label>
            <div class="dropzone-box" onclick="document.getElementById('prodImgFileInput').click()">
              <input type="file" id="prodImgFileInput" accept="image/*" style="display:none" onchange="handleProductImageUpload(event)">
              <p style="margin:0;font-size:14.5px;color:var(--gold-hi)"><b>Click or Drop to Upload New Image</b></p>
              <p style="margin-top:4px;font-size:12.5px;color:var(--mute-dark)">Leave unchanged to keep existing image</p>
            </div>

            <div style="margin-top:12px">
              <label for="prodImgUrlInput" style="font-size:13px;color:var(--mute-dark)">Or Edit Image URL Path</label>
              <input id="prodImgUrlInput" value="${currentImg}" oninput="previewImageFromUrl(this.value)">
            </div>

            <div style="margin-top:10px">
              <span style="font-size:12.5px;color:var(--mute-dark)">Quick Preset Jars:</span>
              <div class="preset-img-chips">
                <span class="preset-chip" onclick="selectPresetImage('assets/images/products/front.webp', this)">Front View Jar</span>
                <span class="preset-chip" onclick="selectPresetImage('assets/images/products/back.webp', this)">Back Label Jar</span>
                <span class="preset-chip" onclick="selectPresetImage('assets/images/products/pair.webp', this)">Pair Collection</span>
              </div>
            </div>

            <div style="text-align:center;margin-top:12px" id="imagePreviewContainer">
              <img id="prodImagePreview" class="image-preview-thumb" src="${currentImg}" alt="Preview">
            </div>
          </div>

          <div class="f full">
            <label for="prodShortDesc">Short Summary / Subtitle</label>
            <input id="prodShortDesc" value="${esc(p.shortDesc || p.subtitle || '')}">
          </div>

          <div class="f full">
            <label for="prodFullDesc">Full Detailed Description</label>
            <textarea id="prodFullDesc" rows="3">${esc(p.fullDesc || '')}</textarea>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px">
          <button type="button" class="btn btn-line btn-sm" onclick="document.getElementById('dlg-product-modal').close()">Cancel</button>
          <button type="submit" class="btn btn-gold btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  `;

  modal.showModal();
}

// Image handling helpers for product modal
function handleProductImageUpload(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    tempUploadedImage = evt.target.result;
    const preview = $("#prodImagePreview");
    if (preview) preview.src = tempUploadedImage;
    if ($("#prodImgUrlInput")) $("#prodImgUrlInput").value = "Uploaded Image (Data)";
    toast("Image uploaded successfully!");
  };
  reader.readAsDataURL(file);
}

function selectPresetImage(url, chip) {
  tempUploadedImage = null;
  const preview = $("#prodImagePreview");
  if (preview) preview.src = url;
  if ($("#prodImgUrlInput")) $("#prodImgUrlInput").value = url;
  $$(".preset-chip").forEach(c => c.classList.remove("active"));
  if (chip) chip.classList.add("active");
}

function previewImageFromUrl(url) {
  tempUploadedImage = null;
  const preview = $("#prodImagePreview");
  if (preview && url) preview.src = url;
}

// Save Product Form (Add or Edit)
function saveProductForm(editingId) {
  const title = $("#prodTitle").value.trim();
  const weight = $("#prodWeight").value.trim();
  const price = +$("#prodPrice").value;
  const comparePrice = $("#prodComparePrice").value ? +$("#prodComparePrice").value : null;
  const stock = +$("#prodStock").value;
  const badge = $("#prodBadge").value.trim();
  const group = $("#prodCategory").value.trim() || "honey-nut-mix";
  const shortDesc = $("#prodShortDesc").value.trim() || `${title} in ${weight} packaging.`;
  const fullDesc = $("#prodFullDesc").value.trim() || shortDesc;

  let imagePath = tempUploadedImage || ($("#prodImgUrlInput") ? $("#prodImgUrlInput").value.trim() : "") || "assets/images/products/front.webp";

  if (!title || isNaN(price) || price <= 0) {
    alert("Please provide a valid product title and price.");
    return;
  }

  const allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);

  if (editingId) {
    // Edit existing product
    const target = allProducts.find(p => p.id === editingId);
    if (target) {
      target.title = title;
      target.name = title;
      target.weight = weight;
      target.netWeight = weight;
      target.price = price;
      target.comparePrice = comparePrice;
      target.stock = stock;
      target.badge = badge;
      target.group = group;
      target.shortDesc = shortDesc;
      target.subtitle = shortDesc;
      target.fullDesc = fullDesc;
      if (imagePath && imagePath !== "Uploaded Image (Data)") {
        target.img = target.img || {};
        target.img.front = imagePath;
        if (!target.img.pair) target.img.pair = imagePath;
        if (!target.img.back) target.img.back = imagePath;
      }
      toast(`Product "${title}" updated successfully!`);
    }
  } else {
    // Create new product
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + weight.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const id = "prod-" + Date.now();

    const newProd = {
      id,
      slug,
      group,
      name: title,
      title,
      subtitle: shortDesc,
      weight,
      netWeight: weight,
      price,
      comparePrice,
      stock,
      featured: true,
      badge: badge || "New",
      maxQty: 20,
      img: {
        front: imagePath,
        back: imagePath,
        pair: imagePath
      },
      shortDesc,
      fullDesc,
      packaging: "Airtight clear jar with double freshness seal",
      shelfLife: "12 months from packing date",
      note: ""
    };

    allProducts.unshift(newProd);
    toast(`Product "${title}" created successfully!`);
  }

  if (typeof saveProducts === "function") {
    saveProducts(allProducts);
  } else {
    Store.set("app_products", allProducts);
    window.PRODUCTS = allProducts;
  }

  const modal = $("#dlg-product-modal");
  if (modal) modal.close();

  renderProductsGrid();
}

// Mark Product Out of Stock
function markOutOfStock(productId) {
  const allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  const target = allProducts.find(p => p.id === productId);
  if (!target) return;

  target.stock = 0;
  if (typeof saveProducts === "function") {
    saveProducts(allProducts);
  } else {
    Store.set("app_products", allProducts);
    window.PRODUCTS = allProducts;
  }

  toast(`"${target.title || target.name}" marked Out of Stock`);
  renderProductsGrid();
}

// Restock Product
function restockProduct(productId) {
  const allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  const target = allProducts.find(p => p.id === productId);
  if (!target) return;

  const current = target.stock || 0;
  const qtyStr = prompt(`Enter restock units to add for "${target.title || target.name}":`, "25");
  if (qtyStr === null) return;
  const qty = parseInt(qtyStr);
  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid positive quantity.");
    return;
  }

  target.stock = current + qty;
  if (typeof saveProducts === "function") {
    saveProducts(allProducts);
  } else {
    Store.set("app_products", allProducts);
    window.PRODUCTS = allProducts;
  }

  toast(`"${target.title || target.name}" restocked with +${qty} units!`);
  renderProductsGrid();
}

// Delete Product
function deleteProduct(productId) {
  let allProducts = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  const target = allProducts.find(p => p.id === productId);
  if (!target) return;

  const confirmDelete = confirm(`Are you sure you want to permanently remove "${target.title || target.name}" from your store?`);
  if (!confirmDelete) return;

  allProducts = allProducts.filter(p => p.id !== productId);
  if (typeof saveProducts === "function") {
    saveProducts(allProducts);
  } else {
    Store.set("app_products", allProducts);
    window.PRODUCTS = allProducts;
  }

  toast(`Product removed successfully`);
  renderProductsGrid();
}

// White-Label Theme Customizer Controller
function initCustomizer() {
  const presetSelect = $("#themePresetSelect");
  const brandNameInput = $("#customBrandName");
  const taglineInput = $("#customTagline");
  const primaryColorInput = $("#customPrimaryColor");
  const hexLabel = $("#primaryHexLabel");

  // Load current values
  if (brandNameInput) brandNameInput.value = window.BRAND_CONFIG.brand.name;
  if (taglineInput) taglineInput.value = window.BRAND_CONFIG.brand.tagline;

  // Preset Switcher
  if (presetSelect) {
    presetSelect.addEventListener("change", e => {
      const presetId = e.target.value;
      applyTheme(presetId);
      updateCustomizerInputsFromTheme(presetId);
      toast(`Switched theme to ${THEME_PRESETS[presetId].name}`);
    });
  }

  // Live Brand Name input
  if (brandNameInput) {
    brandNameInput.addEventListener("input", e => {
      const newName = e.target.value.trim() || "Brand Name";
      window.BRAND_CONFIG.brand.name = newName;
      $$(".brand-name-dynamic").forEach(el => el.textContent = newName);
      $("#previewBrandName").textContent = newName;
    });
  }

  // Primary Color input
  if (primaryColorInput) {
    primaryColorInput.addEventListener("input", e => {
      const hex = e.target.value;
      if (hexLabel) hexLabel.textContent = hex.toUpperCase();
      applyTheme("custom", {
        "--gold": hex,
        "--gold-hi": hex,
        "--gold-grad": `linear-gradient(135deg, ${hex} 0%, ${hex} 60%, #000 100%)`
      });
    });
  }
}

function updateCustomizerInputsFromTheme(presetId) {
  const preset = THEME_PRESETS[presetId];
  if (!preset) return;
  const primary = preset.colors["--gold"];
  const colorInput = $("#customPrimaryColor");
  const hexLabel = $("#primaryHexLabel");
  if (colorInput && primary.startsWith("#")) colorInput.value = primary;
  if (hexLabel) hexLabel.textContent = primary.toUpperCase();
}

function exportBrandConfig() {
  const currentBrand = window.BRAND_CONFIG.brand;
  const currentDelivery = window.BRAND_CONFIG.delivery;
  const currentContact = window.BRAND_CONFIG.contact;

  const exportCode = `// Generated White-Label Configuration
const BRAND_CONFIG = {
  brand: {
    name: "${currentBrand.name}",
    fullName: "${currentBrand.fullName || currentBrand.name}",
    tagline: "${currentBrand.tagline}",
    slogan: "${currentBrand.slogan || ''}",
    description: "${currentBrand.description || ''}",
    defaultTheme: "${localStorage.getItem('app_active_theme') || 'luxury-gold'}"
  },
  logo: {
    type: "image",
    src: "assets/images/logo.webp",
    alt: "${currentBrand.name} Logo"
  },
  currency: {
    symbol: "PKR",
    code: "PKR",
    format: (amount) => "PKR " + Number(amount || 0).toLocaleString("en-US")
  },
  delivery: ${JSON.stringify(currentDelivery, null, 2)},
  contact: ${JSON.stringify(currentContact, null, 2)}
};`;

  const modal = $("#dlg-export-config");
  if (!modal) return;
  modal.innerHTML = `
    <div class="dlg" style="width:min(680px,94vw)">
      <button class="ic dlg-x" onclick="document.getElementById('dlg-export-config').close()">${ICON.x}</button>
      <h3 style="font-size:22px;margin-bottom:12px">Exported brand.config.js</h3>
      <p style="font-size:14px;color:var(--mute-dark);margin-bottom:16px">Copy this code into <code>config/brand.config.js</code> to instantly brand the website and admin portal for your new client.</p>
      <textarea class="f" style="width:100%;height:280px;font-family:monospace;font-size:13px;line-height:1.5;background:#000;color:#34d399;border-color:var(--hair)" readonly>${exportCode}</textarea>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:18px">
        <button class="btn btn-gold btn-sm" onclick="navigator.clipboard.writeText(\`${exportCode.replace(/`/g, '\\`')}\`); toast('Configuration copied to clipboard!')">Copy Code</button>
        <button class="btn btn-line btn-sm" onclick="document.getElementById('dlg-export-config').close()">Close</button>
      </div>
    </div>
  `;
  modal.showModal();
}

// Initialize Admin Portal
function initAdmin() {
  initTheme();
  seedDefaultOrders();
  initTabs();
  renderDashboard();
  initCustomizer();

  // Order Search
  const searchInput = $("#orderSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", renderOrdersTable);
  }

  // Order Filter Pills
  $$("#tab-orders .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$("#tab-orders .filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentOrderFilter = pill.dataset.filter;
      renderOrdersTable();
    });
  });

  // Product Search
  const prodSearchInput = $("#productSearchInput");
  if (prodSearchInput) {
    prodSearchInput.addEventListener("input", renderProductsGrid);
  }

  // Product Filter Pills
  $$("#productFilterPills .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      $$("#productFilterPills .filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentProdFilter = pill.dataset.prodFilter;
      renderProductsGrid();
    });
  });
}

window.addEventListener("DOMContentLoaded", initAdmin);
