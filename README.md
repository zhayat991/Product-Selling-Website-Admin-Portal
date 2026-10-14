# 🍯 Product Selling Storefront (White-Label E-Commerce Platform)

> A high-performance, modular, plug-and-play e-commerce storefront designed for fast white-label re-branding. Built with vanilla JavaScript, modern CSS custom properties, and a dedicated UI Kit.

---

## ⚡ 2-Minute Re-Branding Quickstart

To launch this store for any client or new brand:

### 1. Update Brand Identity & Information
Open [`config/brand.config.js`](file:///config/brand.config.js) and update:
- **Brand Details**: `name`, `tagline`, `description`, `slogan`
- **Logo**: Set `logo.src` to your logo image path (e.g. `assets/images/logo.webp`) or choose `type: "text"`
- **Currency & Locale**: Symbol (`PKR`, `$`, `AED`, `£`), code, and number formatting
- **Contact & WhatsApp**: Phone, WhatsApp number for 1-click order notifications, email, and pickup address
- **Delivery Rules**: Flat shipping fee, estimated timeline (`3–5 working days`), and free shipping thresholds
- **Payment Options**: Cash on Delivery, Bank Transfer, Easypaisa, JazzCash, or custom accounts

### 2. Choose or Customize the UI Kit Theme
Open [`config/theme.config.js`](file:///config/theme.config.js) to pick from 5 included luxury presets:
- `luxury-gold` *(Default: Deep Obsidian & Warm Gold)*
- `emerald-forest` *(Deep Forest Green & Emerald)*
- `royal-sapphire` *(Midnight Slate & Cobalt)*
- `crimson-velvet` *(Dark Plum & Rose Gold)*
- `nordic-minimal` *(Contemporary Monochrome Slate)*

You can also pass custom color hex codes directly to `--primary`, `--gold`, and background tokens.

### 3. Update the Product Catalog
Open [`data/products.js`](file:///data/products.js) to add, edit, or remove products:
- `id`, `slug`, `title`, `price`, `comparePrice`, `weight`, `stock`
- Image gallery paths (`assets/images/products/...`)
- Nutritional specs, ingredient highlights, and FAQ items

---

## 📁 Project Architecture

```
Product-Selling-Website-Admin-Portal/
├── assets/
│   └── images/
│       ├── logo.webp                 # Brand logo
│       ├── products/                 # Product jar photography
│       └── ingredients/              # Raw ingredient photography
├── config/
│   ├── brand.config.js               # White-label brand metadata & policies
│   └── theme.config.js               # Theme presets & CSS variable engine
├── data/
│   └── products.js                   # Product catalog & specifications
├── styles/
│   ├── theme.css                     # CSS tokens, color palettes & fonts
│   ├── ui-kit.css                    # Reusable buttons, inputs, modals, toasts
│   └── storefront.css                # Hero, PDP, cart, checkout, responsive styles
├── js/
│   ├── store.js                      # Persistent cart & order synchronizer
│   ├── router.js                     # Client-side hash SPA router
│   └── app.js                        # App bootstrap, search engine & events
├── index.html                        # Lightweight semantic HTML entry point
└── README.md                         # Documentation
```

---

## 🛒 Features
- **Client-Side SPA Router**: Instant zero-reload transitions between Home, Shop, Product Details, Cart, Checkout, and Confirmation.
- **Persistent Cart**: Automatically synchronized with `localStorage` across tabs and the Admin Portal.
- **WhatsApp Order Confirmation**: Generates a pre-filled, formatted WhatsApp text for instant merchant confirmation.
- **Mobile Optimized**: Bottom mobile checkout bar, drawer navigation, and responsive touch gestures.
- **Accessibility & SEO**: Semantic tags, focus indicators, and meta descriptions included.
