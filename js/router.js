/**
 * =======================================================================
 * SPA ROUTER & VIEW TEMPLATES
 * =======================================================================
 */

const views = {};

// View Helper Builders
function qtyCtl(id, val, extra = "") {
  return `
    <div class="qty" ${extra}>
      <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
      <input id="${id}" type="text" inputmode="numeric" value="${val}" aria-label="Quantity" readonly>
      <button type="button" data-act="inc" aria-label="Increase quantity">+</button>
    </div>
  `;
}

function accordion(id, title, body, open = false) {
  return `
    <details id="acc-${id}" ${open ? "open" : ""}>
      <summary>${title}</summary>
      <div class="acc-body">${body}</div>
    </details>
  `;
}

function secHero() {
  const B = window.BRAND_CONFIG.brand;
  const P = window.PRODUCTS[0];
  return `
    <section class="hero hex" aria-label="Introduction">
      <div class="hex-layer"></div>
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <h1>
            <span>Pure Taste.</span>
            <span class="g">Natural Goodness.</span>
          </h1>
          <p class="sub">${B.description || "A premium blend of raw mountain honey and golden-roasted dry fruits. Hand-selected nuts crafted for clean, everyday vitality."}</p>
          <div class="hero-cta">
            <a class="btn btn-gold" href="#/shop">Shop Now</a>
            <a class="btn btn-line" href="#/product/${P ? P.slug : 'honey-nut-mix-500g'}">Explore Product</a>
          </div>
        </div>
        <div class="hero-art">
          <svg class="ring" viewBox="0 0 560 560" aria-hidden="true">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f7de8f"/>
                <stop offset="50%" stop-color="#d6a736"/>
                <stop offset="100%" stop-color="#9a6f1c"/>
              </linearGradient>
            </defs>
            <circle cx="280" cy="280" r="230"/>
            <circle class="c2" cx="280" cy="280" r="270"/>
          </svg>
          <img class="hero-jar" id="heroJar" src="${P ? P.img.front : 'assets/images/products/front.webp'}" alt="${B.name} Honey Nut Mix 500g" width="460" height="600">
        </div>
      </div>
    </section>
  `;
}

function secTrustStrip() {
  const D = window.BRAND_CONFIG.delivery;
  return `
    <div class="strip">
      <div class="wrap strip-in">
        <div>${ICON.truck}<div><b>Fast Pakistan Delivery</b><span>${D.area} (${D.eta})</span></div></div>
        <div>${ICON.leaf}<div><b>100% Pure Honey</b><span>Zero artificial sugars or preservatives</span></div></div>
        <div>${ICON.shield}<div><b>Double Freshness Seal</b><span>Hygienically sealed in clear premium jars</span></div></div>
      </div>
    </div>
  `;
}

function secWelcome() {
  const B = window.BRAND_CONFIG.brand;
  const P = window.PRODUCTS[0];
  return `
    <section class="sec sec-sand" aria-label="Welcome">
      <div class="wrap welcome">
        <div class="reveal">
          <span class="pill">Artisanal Excellence</span>
          <h2 class="h2" style="margin-top:14px">Welcome to ${B.fullName || B.name}</h2>
          <div class="rule"></div>
          <p class="lead">${B.name} was born out of a commitment to honest, pure food. We combine 100% natural, unadulterated honey with carefully sourced, crunchy dry fruits so that every spoon provides authentic nourishment.</p>
          <p class="lead" style="margin-top:14px">Whether energizing your mornings, fueling your workouts, or enjoying a mindful late-afternoon snack, our blend delivers complete satisfaction without compromise.</p>
          <div class="sign">Handcrafted for quality & purity</div>
          <div><a class="link" href="#/about">Our Brand Story ${ICON.arrow}</a></div>
        </div>
        <figure class="panel-sand reveal" style="--d:.2s">
          <img src="${P ? P.img.pair : 'assets/images/products/pair.webp'}" alt="${B.name} Product Jar Display">
          <figcaption>Available in 500g and 1kg family sizes.</figcaption>
        </figure>
      </div>
    </section>
  `;
}

function prodCard(p) {
  const buy = canBuy(p);
  const isOutOfStock = p.stock !== undefined && p.stock <= 0;
  const qid = "q-pc-" + p.id;
  const imgSrc = (p.img && (p.img.front || p.img.pair)) || "assets/images/products/front.webp";
  return `
    <article class="pc reveal ${isOutOfStock ? 'pc-out' : ''}">
      <div class="pc-img">
        <span class="pill pc-size">${isOutOfStock ? 'Out of Stock' : (p.badge || p.weight)}</span>
        <img src="${imgSrc}" alt="${p.name} ${p.weight}" loading="lazy">
      </div>
      <div class="pc-body">
        <h3>${p.title}<span class="pc-w">(${p.weight})</span></h3>
        <p>${p.shortDesc}</p>
        <div class="price">
          <span>${priceTxt(p)}</span>
          ${p.comparePrice ? `<small style="text-decoration:line-through;opacity:0.6">${money(p.comparePrice)}</small>` : ""}
          <small>${p.netWeight}</small>
        </div>
        ${p.note ? `<p class="pc-note">${p.note}</p>` : ""}
        <div class="buy-row">
          ${qtyCtl(qid, 1)}
          <button class="btn btn-gold btn-sm" data-act="add" data-q="${qid}" data-pid="${p.id}" ${buy ? "" : "disabled"}>
            ${buy ? `${ICON.bag} Add to Cart` : "Out of Stock"}
          </button>
          <button class="btn btn-line btn-sm" data-act="buy" data-q="${qid}" data-pid="${p.id}" ${buy ? "" : "disabled"}>
            ${buy ? "Buy Now" : "Unavailable"}
          </button>
        </div>
        <a class="pc-more" href="#/product/${p.slug}">View full product details →</a>
      </div>
    </article>
  `;
}

function secFeatured() {
  const prods = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  return `
    <section class="sec sec-black" id="featured" aria-label="Featured Collection">
      <div class="wrap">
        <div class="sec-head center reveal">
          <span class="pill">Our Collection</span>
          <h2 class="h2" style="margin-top:14px">Pure Honey Nut Blends</h2>
          <div class="rule"></div>
          <p class="lead">Select your preferred jar size. Same gold standard recipe in each package.</p>
        </div>
        <div class="pgrid">
          ${prods.map(p => prodCard(p)).join("")}
        </div>
      </div>
    </section>
  `;
}

function secWhy() {
  const features = window.BRAND_CONFIG.features || [];
  return `
    <section class="sec sec-cream" aria-label="Why Choose Us">
      <div class="wrap">
        <div class="sec-head center reveal">
          <span class="pill">The Standard</span>
          <h2 class="h2" style="margin-top:14px">Why Choose Our Blend</h2>
          <div class="rule"></div>
          <p class="lead">We believe in transparent ingredients, uncompromising freshness, and direct courier dispatch.</p>
        </div>
        <div class="grid4">
          ${features.map((f, i) => `
            <div class="card-w reveal" style="--d:${i * 0.1}s">
              <div class="ico-ring">${ICON[f.icon] || ICON.leaf}</div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function secIngredients() {
  const items = window.INGREDIENTS || [];
  return `
    <section class="sec sec-coal" aria-label="Ingredients">
      <div class="wrap">
        <div class="sec-head center reveal">
          <span class="pill">Wholesome Formula</span>
          <h2 class="h2" style="margin-top:14px">6 Powerhouse Ingredients</h2>
          <div class="rule"></div>
          <p class="lead">Every single jar contains only these six wholesome elements — nothing more, nothing less.</p>
        </div>
        <div class="grid3">
          ${items.map((ing, i) => `
            <div class="ing reveal" style="--d:${i * 0.08}s">
              <div class="ing-img"><img src="${ing.img}" alt="${ing.name}" loading="lazy"></div>
              <h3>${ing.name}</h3>
              <p>${ing.desc}</p>
            </div>
          `).join("")}
        </div>
        <p class="ing-note">Contains whole almonds, walnuts, cashews, pistachios, peanuts, and raw natural honey.</p>
      </div>
    </section>
  `;
}

function secMoments() {
  return `
    <section class="sec sec-sand" aria-label="Daily Use">
      <div class="wrap moments">
        <div class="reveal">
          <span class="pill">Lifestyle & Nutrition</span>
          <h2 class="h2" style="margin-top:14px">Crafted For Your Daily Rhythm</h2>
          <div class="rule"></div>
          <p class="lead">Enjoy by the spoonful, drizzle over Greek yogurt or morning oats, or pair with post-workout protein.</p>
        </div>
        <div class="moments-list">
          <div class="moment reveal">
            <div class="ico-ring">${ICON.sun}</div>
            <div><h3>Morning Fuel</h3><p>Start your dawn with sustained energy, essential healthy fats, and high-quality micronutrients.</p></div>
          </div>
          <div class="moment reveal" style="--d:.1s">
            <div class="ico-ring">${ICON.zap}</div>
            <div><h3>Pre / Post Workout</h3><p>Natural glycogen replenishment combined with plant protein for cellular recovery and stamina.</p></div>
          </div>
          <div class="moment reveal" style="--d:.2s">
            <div class="ico-ring">${ICON.heart}</div>
            <div><h3>Mindful Snacking</h3><p>Satisfies your sweet tooth cleanly without refined white sugar crashes or artificial additives.</p></div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function secShowcase() {
  const P = window.PRODUCTS[0];
  const B = window.BRAND_CONFIG.brand;
  return `
    <section class="show hex" aria-label="Visual Showcase">
      <div class="hex-layer"></div>
      <div class="show-bg" aria-hidden="true">${B.name} · PURE BLEND</div>
      <div class="wrap">
        <div class="sec-head center reveal">
          <span class="pill">Visual Showcase</span>
          <h2>The Gold Standard In Every Jar</h2>
          <p class="lead">Look through the clear jar: packed to the brim with rich, crunchy dry fruits drenched in viscous golden honey.</p>
        </div>
        <div class="show-stage" id="stage">
          <img class="pair" src="${P ? P.img.pair : 'assets/images/products/pair.webp'}" alt="MSR Showcase Display" loading="lazy">
          <div class="orb" data-p="18" style="top:10%;left:8%"><img src="assets/images/ingredients/honey.webp" alt="Honey"></div>
          <div class="orb" data-p="-22" style="top:18%;right:10%"><img src="assets/images/ingredients/almonds.webp" alt="Almonds"></div>
          <div class="orb" data-p="26" style="bottom:12%;left:12%"><img src="assets/images/ingredients/walnuts.webp" alt="Walnuts"></div>
          <div class="orb" data-p="-16" style="bottom:16%;right:14%"><img src="assets/images/ingredients/cashews.webp" alt="Cashews"></div>
        </div>
      </div>
    </section>
  `;
}

function secAbout(full = false) {
  const B = window.BRAND_CONFIG.brand;
  const C = window.BRAND_CONFIG.contact;
  return `
    <section class="sec sec-coal" aria-label="About Us">
      <div class="wrap about">
        <div class="reveal">
          <span class="pill">Our Story</span>
          <h2 class="h2" style="margin-top:14px">Honest Food, Made For Life</h2>
          <div class="rule"></div>
          <p class="lead">${B.name} was established with one purpose: to replace hyper-processed, artificial snacks with genuine, nutrient-dense nutrition crafted from nature's purest treasures.</p>
          <p class="lead" style="margin-top:14px">We work directly with reliable suppliers, roast nuts carefully to maintain their wholesome micronutrient profile, and seal each batch fresh in Pakistan.</p>
          <ul class="checks">
            <li>${ICON.check} No synthetic colors, flavorings, or high-fructose corn syrups</li>
            <li>${ICON.check} 100% natural Pakistan & international nuts selected for freshness</li>
            <li>${ICON.check} Fast, verified courier dispatch to your doorstep</li>
          </ul>
        </div>
        <div class="brand-tile reveal" style="--d:.2s">
          <img src="${window.BRAND_CONFIG.logo.src}" alt="${B.name} Logo">
          <p style="margin-top:20px;font-size:15px;color:var(--mute-dark);text-align:center">Headquartered in ${C.address[2] || "Pakistan"} · Delivering Nationwide</p>
        </div>
      </div>
    </section>
  `;
}

function secReviews() {
  const reviews = window.BRAND_CONFIG.reviews || [];
  return `
    <section class="sec sec-sand" aria-label="Customer Reviews">
      <div class="wrap">
        <div class="sec-head center reveal">
          <span class="pill">Customer Love</span>
          <h2 class="h2" style="margin-top:14px">Verified Experiences</h2>
          <div class="rule"></div>
          <p class="lead">Discover why families and fitness enthusiasts choose our Honey Nut Mix.</p>
        </div>
        <div class="grid3">
          ${reviews.map((r, i) => `
            <div class="rev reveal" style="--d:${i * 0.1}s">
              <div class="q">“</div>
              <h3>${r.title}</h3>
              <p>${r.text}</p>
              <div class="who">
                <b>${r.name}</b> · ${r.city} (${r.date})
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function secCTA() {
  const B = window.BRAND_CONFIG.brand;
  return `
    <section class="cta hex" aria-label="Call to Action">
      <div class="hex-layer"></div>
      <div class="wrap reveal">
        <h2>Taste The Difference Today</h2>
        <p>Order fresh ${B.name} Honey Nut Mix now. Delivered straight to your home with Cash on Delivery or digital payment.</p>
        <div style="display:flex;justify-content:center;gap:14px;flex-wrap:wrap">
          <a class="btn btn-gold" href="#/shop">Order Your Jar</a>
          <a class="btn btn-line" href="#/contact">Speak With Us</a>
        </div>
      </div>
    </section>
  `;
}

// ==========================================
// VIEWS
// ==========================================

views.home = () => ({
  title: `${window.BRAND_CONFIG.brand.fullName} | ${window.BRAND_CONFIG.brand.tagline}`,
  html: secHero() + secTrustStrip() + secWelcome() + secFeatured() + secWhy() + secIngredients() + secMoments() + secShowcase() + secAbout() + secReviews() + secCTA()
});

views.shop = () => {
  const prods = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  return {
    title: `Shop | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <span>Shop</span></nav>
          <h1>Our Pure Honey Nut Collection</h1>
          <p>Choose from our convenient jar sizes or order our artisanal blends.</p>
        </div>
      </header>
      <section class="page-dark sec" style="padding-top:40px">
        <div class="wrap">
          <div class="pgrid">
            ${prods.map(p => prodCard(p)).join("")}
          </div>
        </div>
      </section>
      ${secTrustStrip()}
      ${secWhy()}
      ${secCTA()}
    `
  };
};

views.products = views.shop;

views.product = (slug) => {
  const allProds = (typeof getProducts === "function") ? getProducts() : (window.PRODUCTS || []);
  const p = getPBySlug(slug) || allProds[0];
  if (!p) return views.shop();
  const buy = canBuy(p);
  const isOutOfStock = p.stock !== undefined && p.stock <= 0;
  const qid = "q-pdp";
  const D = window.BRAND_CONFIG.delivery;
  const C = window.BRAND_CONFIG.contact;
  const sameGroup = allProds.filter(x => x.group && x.group === p.group);
  const imgSrc = (p.img && (p.img.front || p.img.pair)) || "assets/images/products/front.webp";

  return {
    title: `${p.name} (${p.weight}) | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <span>${p.title}</span></nav>
          <h1>${p.title}</h1>
          <p>${p.subtitle || p.shortDesc}</p>
        </div>
      </header>
      <section class="page light">
        <div class="wrap">
          <div class="pdp">
            <div>
              <div class="gal-main">
                <img class="main" id="galMain" src="${imgSrc}" alt="${p.name} ${p.weight}">
                <img class="wm" src="${window.BRAND_CONFIG.logo.src}" alt="${window.BRAND_CONFIG.brand.name}">
              </div>
              <div class="thumbs">
                <button class="thumb" aria-pressed="true" data-act="thumb" data-pid="${p.id}" data-src="front" data-alt="front jar view">
                  <img src="${(p.img && p.img.front) || imgSrc}" alt="Front">
                </button>
                <button class="thumb" aria-pressed="false" data-act="thumb" data-pid="${p.id}" data-src="back" data-alt="back label view">
                  <img src="${(p.img && p.img.back) || imgSrc}" alt="Back">
                </button>
                <button class="thumb" aria-pressed="false" data-act="thumb" data-pid="${p.id}" data-src="pair" data-alt="product collection view">
                  <img src="${(p.img && p.img.pair) || imgSrc}" alt="Pair">
                </button>
              </div>
            </div>
            <div class="pdp-info">
              <span class="pill">${isOutOfStock ? "Out of Stock" : (p.badge || "Signature Selection")}</span>
              <h1 style="margin-top:14px">${p.title}</h1>
              <div class="price">
                <span>${priceTxt(p)}</span>
                ${p.comparePrice ? `<small style="text-decoration:line-through;opacity:0.6">${money(p.comparePrice)}</small>` : ""}
                <small>${p.netWeight}</small>
              </div>
              <p class="ing-line">Contains: Pure Honey, Almonds, Walnuts, Cashews, Pistachios & Peanuts.</p>
              ${sameGroup.length > 1 ? `
                <div class="sizes">
                  <span>Size:</span>
                  ${sameGroup.map(g => `<a href="#/product/${g.slug}" class="${g.id === p.id ? 'on' : ''}">${g.weight}</a>`).join("")}
                </div>
              ` : ""}
              <p style="margin-top:18px;color:var(--mute-light);line-height:1.7">${p.fullDesc}</p>
              ${p.note ? `<p class="soon" style="margin-top:18px">${p.note}</p>` : ""}
              <div class="buy-row" style="margin-top:24px">
                ${qtyCtl(qid, 1)}
                <button class="btn btn-gold" data-act="add" data-q="${qid}" data-pid="${p.id}" ${buy ? "" : "disabled"}>
                  ${buy ? `${ICON.bag} Add to Cart` : "Out of Stock"}
                </button>
                <button class="btn btn-line" data-act="buy" data-q="${qid}" data-pid="${p.id}" ${buy ? "" : "disabled"}>
                  ${buy ? "Buy Now" : "Unavailable"}
                </button>
              </div>
              <div class="info-box">
                <div>${ICON.truck}<div><b>Pakistan Delivery: Flat ${money(D.fee)}</b><span>${D.area} · Estimated ${D.eta}</span></div></div>
                <div>${ICON.shield}<div><b>Double Freshness Seal</b><span>${p.packaging}</span></div></div>
                <div>${ICON.bag}<div><b>Payment Methods</b><span>Cash on Delivery, Bank Transfer, Easypaisa, JazzCash</span></div></div>
              </div>
            </div>
          </div>
          <div class="acc-wrap">
            ${accordion("desc", "Detailed Description", `<p>${p.fullDesc}</p><p>Packed in a clear ${p.netWeight} jar so you can inspect the pristine dry fruit fusion with your own eyes.</p>`, true)}
            ${accordion("ing", "Ingredients & Allergens", `<p>100% Pure Natural Mountain Honey, Selected California Almonds, Kashmiri Walnuts, Roasted Cashews, Iranian Pistachios, Crunchy Peanuts.</p><p><b>Allergen Notice:</b> Contains tree nuts and peanuts.</p>`)}
            ${accordion("info", "Product Specs & Nutrition", `
              <table class="tbl">
                <tr><td>Net Weight</td><td>${p.netWeight}</td></tr>
                <tr><td>Packaging</td><td>${p.packaging}</td></tr>
                <tr><td>Shelf Life</td><td>${p.shelfLife}</td></tr>
              </table>
              <h4 style="margin-top:18px;color:var(--gold-lo)">Nutrition Facts (per 100g)</h4>
              <table class="tbl">
                ${(window.NUTRITION_FACTS || []).map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}
              </table>
            `)}
            ${accordion("faq", "Frequently Asked Questions", `
              ${(window.FAQS || []).map(f => `<div style="margin-bottom:14px"><b style="color:var(--gold-lo)">${f[0]}</b><p style="margin-top:4px">${f[1]}</p></div>`).join("")}
            `)}
          </div>
        </div>
      </section>
      <div class="mbar">
        <div><b>${priceTxt(p)}</b><small>${p.netWeight} · Delivery ${money(D.fee)}</small></div>
        <button class="btn btn-gold btn-sm" data-act="add" data-q="${qid}" data-pid="${p.id}" ${buy ? "" : "disabled"}>
          ${buy ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    `,
    mbar: true
  };
};

views.cart = () => {
  const L = lines();
  const D = window.BRAND_CONFIG.delivery;
  if (!L.length) {
    return {
      title: `Your Cart | ${window.BRAND_CONFIG.brand.name}`,
      html: `
        <header class="page-head"><div class="wrap"><h1>Your Cart</h1></div></header>
        <section class="page light">
          <div class="wrap">
            <div class="box empty">
              <h2>Your cart is currently empty</h2>
              <p>Add our delicious Honey Nut Mix to begin your healthy snacking journey.</p>
              <a class="btn btn-gold" href="#/shop">Browse Products</a>
            </div>
          </div>
        </section>
      `
    };
  }
  const t = totals();
  return {
    title: `Your Cart | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <span>Cart</span></nav>
          <h1>Shopping Cart</h1>
        </div>
      </header>
      <section class="page light">
        <div class="wrap cart-grid">
          <div class="box">
            ${L.map(l => `
              <div class="li">
                <a class="li-img" href="#/product/${l.p.slug}"><img src="${l.p.img.front}" alt="${l.p.name}"></a>
                <div>
                  <h3>${l.p.name}</h3>
                  <small>${l.p.netWeight} · ${money(l.p.price)} each</small>
                  ${qtyCtl("q-cart-" + l.p.id, l.qty, `data-cart="1" data-pid="${l.p.id}"`)}
                </div>
                <div class="li-r">
                  <b>${money(l.qty * l.p.price)}</b>
                  <button class="rm" data-act="remove" data-pid="${l.p.id}">${ICON.trash} Remove</button>
                </div>
              </div>
            `).join("")}
          </div>
          <aside class="box sticky">
            <h2>Order Summary</h2>
            <div class="sum">
              <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
              <div><span>Delivery</span><span>${t.isFree ? '<span class="tag tag-emerald">FREE SHIPPING</span>' : money(t.ship)}</span></div>
              <div class="tot"><span>Total</span><span>${money(t.total)}</span></div>
              <small>${D.area} · Estimated ${D.eta}<br>${t.isFree ? '🎉 You qualified for FREE delivery!' : `Flat ${money(D.fee)} courier delivery.`}</small>
            </div>
            <a class="btn btn-gold btn-block" style="margin-top:22px" href="#/checkout">Proceed to Checkout</a>
            <a class="btn btn-ink-line btn-block" style="margin-top:10px" href="#/shop">Continue Shopping</a>
          </aside>
        </div>
      </section>
    `
  };
};

views.checkout = () => {
  const L = lines();
  if (!L.length) {
    location.hash = "#/cart";
    return null;
  }
  const t = totals();
  const D = window.BRAND_CONFIG.delivery;
  const prov = [
    "Khyber Pakhtunkhwa", "Punjab", "Sindh", "Balochistan",
    "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir"
  ];

  return {
    title: `Checkout | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/cart">Cart</a> / <span>Checkout</span></nav>
          <h1>Complete Your Order</h1>
        </div>
      </header>
      <section class="page light">
        <form class="wrap co-grid" id="coForm" novalidate>
          <div class="box">
            <fieldset class="fs">
              <legend>1. Contact Information</legend>
              <div class="fgrid">
                <div class="f"><label for="f-name">Full Name</label><input id="f-name" autocomplete="name" required><span class="err">Please enter your full name.</span></div>
                <div class="f"><label for="f-phone">Mobile Number</label><input id="f-phone" autocomplete="tel" inputmode="tel" placeholder="03XXXXXXXXX" required><span class="err">Enter a valid mobile like 03001234567.</span></div>
                <div class="f full"><label for="f-email">Email Address <i>(optional)</i></label><input id="f-email" type="email" autocomplete="email"><span class="err">Enter a valid email address.</span></div>
              </div>
            </fieldset>

            <fieldset class="fs">
              <legend>2. Shipping Address</legend>
              <div class="fgrid">
                <div class="f full"><label for="f-addr">Street Address / House No.</label><input id="f-addr" autocomplete="street-address" placeholder="House/Apartment #, Street, Area landmark" required><span class="err">Enter your delivery address.</span></div>
                <div class="f"><label for="f-city">City</label><input id="f-city" autocomplete="address-level2" required><span class="err">Enter your city.</span></div>
                <div class="f"><label for="f-prov">Province</label><select id="f-prov">${prov.map(p => `<option>${p}</option>`).join("")}</select></div>
                <div class="f"><label for="f-zip">Postal Code <i>(optional)</i></label><input id="f-zip" inputmode="numeric"></div>
                <div class="f full"><label for="f-note">Delivery Notes / Special Instructions <i>(optional)</i></label><textarea id="f-note" placeholder="Nearest landmark, preferred delivery timing, etc."></textarea></div>
              </div>
            </fieldset>

            <fieldset class="fs" style="margin:0">
              <legend>3. Payment Method</legend>
              ${window.BRAND_CONFIG.payments.map((m, i) => `
                <label class="opt">
                  <input type="radio" name="pay" value="${m.id}" ${i === 0 ? "checked" : ""}>
                  <span>
                    <b>${m.name} ${m.badge ? `<span class="tag tag-gold" style="margin-left:8px">${m.badge}</span>` : ""}</b>
                    <span>${m.short}</span>
                  </span>
                </label>
              `).join("")}
              <div class="notice" id="payDetail" style="margin-top:16px;background:var(--coal);color:var(--cream);border-color:var(--gold)" aria-live="polite"></div>
            </fieldset>
          </div>

          <aside class="box sticky">
            <h2>Order Summary</h2>
            <div class="co-items">
              ${L.map(l => `
                <div class="li">
                  <div class="li-img"><img src="${l.p.img.front}" alt="${l.p.name}"></div>
                  <div><h3>${l.p.name}</h3><small>${l.p.netWeight} × ${l.qty}</small></div>
                  <b>${money(l.qty * l.p.price)}</b>
                </div>
              `).join("")}
            </div>
            <div class="sum" style="margin-top:16px">
              <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
              <div><span>Delivery Fee</span><span>${t.isFree ? '<span class="tag tag-emerald">FREE SHIPPING</span>' : money(t.ship)}</span></div>
              <div class="tot"><span>Total Amount</span><span>${money(t.total)}</span></div>
            </div>
            <button class="btn btn-gold btn-block" style="margin-top:22px" type="submit">Place Order Now</button>
            <div class="secure">${ICON.lock} Safe & secure checkout. Your details are private.</div>
          </aside>
        </form>
      </section>
    `
  };
};

views.confirmation = () => {
  const o = lastOrder;
  if (!o || !o.items) {
    location.hash = "#/";
    return null;
  }
  const C = window.BRAND_CONFIG.contact;
  const payMethod = (window.BRAND_CONFIG.payments || []).find(p => p.id === o.pay) || { name: o.pay };
  const msg = orderMessage(o);
  const wa = C.whatsapp ? `<a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}">Confirm via WhatsApp</a>` : "";
  const em = `<a class="btn btn-line btn-sm" href="mailto:${C.email}?subject=${encodeURIComponent("Order " + o.id + " Confirmation")}&body=${encodeURIComponent(msg)}">Confirm via Email</a>`;

  return {
    title: `Order Placed | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <section class="page light">
        <div class="wrap done">
          <div class="tick">${ICON.check}</div>
          <h1>Thank you, ${esc(o.name.split(" ")[0])}!</h1>
          <p class="lead">Your order has been recorded successfully. Order reference: <span class="oid">${o.id}</span></p>
          <div class="notice">
            <h3>Quick Order Confirmation</h3>
            <p>To expedite packing and dispatch, tap below to notify our operations team with one click:</p>
            <div class="row">${wa}${em}</div>
          </div>
          <div class="notice">
            <h3>Payment Method: ${payMethod.name}</h3>
            <p>${payMethod.detail || "Please keep payment ready upon delivery."}</p>
            <p style="margin:0">Total Amount: <b style="color:var(--gold-hi)">${money(o.total)}</b></p>
          </div>
          <div class="box">
            <h2>Order Receipt</h2>
            <div class="sum">
              ${o.items.map(i => `<div><span>${esc(i.name)} (${esc(i.weight)}) × ${i.qty}</span><span>${money(i.qty * i.price)}</span></div>`).join("")}
              <div><span>Shipping</span><span>${money(o.ship)}</span></div>
              <div class="tot"><span>Total</span><span>${money(o.total)}</span></div>
            </div>
            <hr style="border:0;border-top:1px solid rgba(27,21,12,.12);margin:22px 0">
            <p><b>Delivery To:</b><br>${esc(o.name)} · ${esc(o.phone)}<br>${esc(o.addr)}, ${esc(o.city)}, ${esc(o.prov)}${o.zip ? " " + esc(o.zip) : ""}</p>
            <p style="margin-top:12px"><b>Payment:</b> ${payMethod.name}</p>
          </div>
          <div style="text-align:center;margin-top:28px">
            <a class="btn btn-ink-line" href="#/shop">Continue Shopping</a>
          </div>
        </div>
      </section>
    `
  };
};

function orderMessage(o) {
  const payMethod = (window.BRAND_CONFIG.payments || []).find(p => p.id === o.pay) || { name: o.pay };
  return [
    `New Order from ${window.BRAND_CONFIG.brand.name}`,
    `Order ID: ${o.id}`,
    `-------------------------`,
    ...o.items.map(i => `• ${i.name} (${i.weight}) x ${i.qty} = ${money(i.qty * i.price)}`),
    `Delivery: ${money(o.ship)}`,
    `Total: ${money(o.total)}`,
    `Payment: ${payMethod.name}`,
    `-------------------------`,
    `Customer: ${o.name}`,
    `Phone: ${o.phone}`,
    o.email ? `Email: ${o.email}` : null,
    `Address: ${o.addr}, ${o.city}, ${o.prov}${o.zip ? ' ' + o.zip : ''}`,
    o.note ? `Notes: ${o.note}` : null
  ].filter(Boolean).join("\n");
}

views.about = () => ({
  title: `About Us | ${window.BRAND_CONFIG.brand.fullName}`,
  html: `
    <header class="page-head">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <span>About Us</span></nav>
        <h1>About ${window.BRAND_CONFIG.brand.fullName}</h1>
        <p>${window.BRAND_CONFIG.brand.slogan}</p>
      </div>
    </header>
    ${secAbout(true)}
    ${secWelcome()}
    ${secWhy()}
    ${secCTA()}
  `
});

views.contact = () => {
  const C = window.BRAND_CONFIG.contact;
  return {
    title: `Contact | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <span>Contact</span></nav>
          <h1>Get In Touch</h1>
          <p>Questions regarding products, bulk orders, or shipping? We are here to assist.</p>
        </div>
      </header>
      <section class="page light">
        <div class="wrap contact-grid">
          <div class="cinfo">
            <a href="tel:${C.phoneIntl}">${ICON.phone}<div><b>Phone / Support</b><span>${C.phone}</span><small style="color:var(--mute-light)">${C.supportHours}</small></div></a>
            ${C.whatsapp ? `<a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">${ICON.zap}<div><b>WhatsApp Direct</b><span>Chat with our team instantly</span></div></a>` : ""}
            <a href="mailto:${C.email}">${ICON.mail}<div><b>Email Us</b><span>${C.email}</span></div></a>
            <div>${ICON.pin}<div><b>Location</b><span>${C.address.join("<br>")}</span></div></div>
          </div>
          <form class="box" id="contactForm" novalidate>
            <h2>Send us a Message</h2>
            <div class="fgrid">
              <div class="f"><label for="c-name">Your Name</label><input id="c-name" required><span class="err">Enter your name.</span></div>
              <div class="f"><label for="c-phone">Phone Number <i>(optional)</i></label><input id="c-phone" inputmode="tel"></div>
              <div class="f full"><label for="c-msg">Message</label><textarea id="c-msg" placeholder="How can we help you?" required></textarea><span class="err">Enter your message.</span></div>
            </div>
            <button class="btn btn-gold" style="margin-top:22px" type="submit">Send Message via Email</button>
          </form>
        </div>
      </section>
    `
  };
};

views.policy = (key) => {
  const D = window.BRAND_CONFIG.delivery;
  const C = window.BRAND_CONFIG.contact;
  const policies = {
    shipping: {
      title: "Shipping & Delivery Policy",
      body: `<h2>Nationwide Coverage</h2><p>We deliver across all cities, towns, and sectors in Pakistan through reputable couriers.</p><h2>Delivery Timelines</h2><p>Orders typically arrive within <b>${D.eta}</b> of dispatch.</p><h2>Delivery Charges</h2><p>Standard flat shipping fee of <b>${money(D.fee)}</b> per order across Pakistan.</p>`
    },
    returns: {
      title: "Returns & Refund Policy",
      body: `<h2>Freshness Guarantee</h2><p>If your jar arrives damaged or unsealed, notify us within 48 hours for an instant replacement.</p><h2>Customer Support</h2><p>Contact us at ${C.email} or call ${C.phone} with your order reference number.</p>`
    },
    privacy: {
      title: "Privacy Policy",
      body: `<h2>Data Protection</h2><p>Your address, phone number, and contact info are strictly utilized to fulfill your orders. We never sell, rent, or share customer data with third parties.</p>`
    },
    terms: {
      title: "Terms & Conditions",
      body: `<h2>Acceptance of Terms</h2><p>By purchasing from ${window.BRAND_CONFIG.brand.name}, you agree to our standard customer delivery and payment terms.</p>`
    }
  };
  const p = policies[key] || policies.shipping;
  return {
    title: `${p.title} | ${window.BRAND_CONFIG.brand.name}`,
    html: `
      <header class="page-head"><div class="wrap"><nav class="crumbs"><a href="#/">Home</a> / <span>${p.title}</span></nav><h1>${p.title}</h1></div></header>
      <section class="page light"><div class="wrap prose">${p.body}</div></section>
    `
  };
};

if (typeof window !== "undefined") {
  window.views = views;
}
