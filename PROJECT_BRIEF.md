# Project Brief

## Store concept

- Products: massagers and pleasure devices for adults aged 18 and over.
- The exact massager range is still to be decided.
- Launch with about 5–6 products. Most should be priced below ₹1,000, with 1–2 products around ₹1,000–₹3,000.
- Store name: smartpleasure.
- Target domain: smartpleasure.shop (provided as http://smartpleasure.shop; not live yet).

## Brand and design

- Personality: modern and reassuring.
- Selected homepage direction: Quiet modern.
- Recommended palette: warm cream, deep sage green and muted rose.
- Recommended typography: DM Sans for body text and Lora for headings, loaded from Google Fonts with system fallbacks.
- Product photography is not ready. Use clearly identified, abstract placeholders until real product photos are supplied.

## Pages and shopping experience

- Home, shop, product detail, cart, checkout, about and contact pages.
- Product details should load from a product ID in the URL.
- Cart should support add, quantity changes, removal, totals and browser local storage.
- Checkout should collect name, phone and address, then open a prepared WhatsApp message. Include a UPI section with clearly marked UPI ID and QR placeholders.
- Contact options: WhatsApp and Telegram. The current implementation request specifically requires WhatsApp for checkout and a floating button.
- Include an offers banner and a customer review area. Do not invent customer reviews.

## Configuration needed before launch

- Publish smartpleasure.shop and confirm HTTPS availability before launch.
- WhatsApp number with country code, Telegram username/link, UPI ID and a real UPI QR image.
- Final product names, descriptions, photos and prices.
- Confirm delivery charges, shipping details, return policy and any real offers before publishing those claims.
- A live online payment gateway is not connected in this static-site version. WhatsApp checkout and a configured UPI deep link are the available order/payment paths.
