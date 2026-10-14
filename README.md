# 🛡️ Admin Portal & White-Label Customizer

> Merchant operations dashboard, order lifecycle tracker, and live white-label UI Kit customizer for the Product Selling E-Commerce platform.

---

## 🚀 Key Capabilities

### 1. 🎨 White-Label UI Kit Playground & Theme Engine
- **Live Theme Presets**: Switch between Luxury Gold, Emerald Forest, Royal Sapphire, Crimson Velvet, and Nordic Minimalist styles.
- **Dynamic CSS Variables**: Directly controls the same tokens used by the customer-facing storefront.
- **One-Click Export**: Generates copy-pasteable `config/brand.config.js` code ready to deploy for any client.

### 2. 📦 Order Lifecycle Management
- **Real-Time Order Tracking**: Customer orders placed on the storefront automatically populate here via synchronized storage.
- **Status Workflow**: Update orders through `Pending`, `Processing`, `Shipped`, `Delivered`, and `Cancelled`.
- **Customer Direct Links**: 1-click WhatsApp chat link with pre-filled order ID and customer greetings.
- **Order Breakdown Modal**: Full customer details, delivery address, ordered quantities, delivery charges, and notes.

### 3. 🍯 Product & Inventory Management
- Live product catalog with weight variants (`500g`, `1kg`).
- Stock status badges and inline pricing editor.

### 4. 📊 Sales Performance & Analytics
- Gross Revenue calculation.
- Total Active Orders count.
- Units sold tracker.
- Average Order Value (AOV) metrics.

---

## 🛠️ Running Locally

Serve the admin portal locally using any static web server:

```bash
# Using Python
python3 -m http.server 3002

# Or using npx serve
npx serve -l 3002
```

Then visit:
**`http://localhost:3002/`**
