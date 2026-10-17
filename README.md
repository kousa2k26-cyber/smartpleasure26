# smartpleasure

A simple static online store for smartpleasure, made with plain HTML, CSS, and JavaScript. It has no build step or package installation.

## Preview the site

Open `index.html` in a web browser to view the home page. For a live store, choose a static website host whose terms allow commercial and e-commerce sites. GitHub Pages should not be used to run an online business or e-commerce site.

## Pages

- `index.html` — home page
- `shop.html` — product list
- `product.html` — product details, selected with a URL such as `product.html?id=1`
- `cart.html` and `checkout.html` — shopping bag and WhatsApp order form
- `about.html` and `contact.html` — store information and contact options

## Edit store details

- Product names, descriptions, prices, and image paths are in `js/products.js`.
- WhatsApp, Telegram, and UPI placeholders are near the top of `js/main.js` in `STORE_CONFIG`.
- Replace the sample artwork in `images/` with your own product photos when they are ready.
- Update the domain and social sharing details in the page metadata when the domain is live.

## Important before launch

Replace all sample products and contact/payment placeholders with verified store information. The checkout creates an order message for WhatsApp; this static site does not include an online payment gateway.
