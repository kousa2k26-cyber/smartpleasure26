/* Shared storefront behaviour. Contact and payment placeholders are configured at the top. */
(function () {
  "use strict";

  // Replace these values with your real store details before launch.
  var STORE_CONFIG = {
    storeName: "smartpleasure",
    whatsappNumber: "91XXXXXXXXXX", // Country code + number, digits only. Example format: 919876543210
    telegramUrl: "https://t.me/yourusername",
    upiId: "yourname@upi"
  };

  var CART_KEY = "your-brand-cart-v1";
  var products = Array.isArray(window.STORE_PRODUCTS) ? window.STORE_PRODUCTS : [];
  var money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }

  function formatPrice(amount) {
    return money.format(Number(amount) || 0);
  }

  function findProduct(id) {
    return products.find(function (product) { return String(product.id) === String(id); });
  }

  function getCart() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.map(function (item) {
        var product = findProduct(item.id);
        return product ? { id: String(product.id), quantity: Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1)) } : null;
      }).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      window.alert("Your browser could not save the bag. Please enable local storage and try again.");
    }
    refreshCartViews();
  }

  function cartLines() {
    return getCart().map(function (item) {
      return { product: findProduct(item.id), quantity: item.quantity };
    }).filter(function (line) { return Boolean(line.product); });
  }

  function cartTotal(lines) {
    return lines.reduce(function (total, line) { return total + line.product.price * line.quantity; }, 0);
  }

  function productCard(product) {
    var id = escapeHTML(product.id);
    var name = escapeHTML(product.name);
    var category = escapeHTML(product.categoryLabel);
    var image = escapeHTML(product.image);
    var alt = escapeHTML(product.imageAlt);
    var url = "product.html?id=" + encodeURIComponent(product.id);
    return '<article class="product-card">' +
      '<a class="product-image-link" href="' + url + '" aria-label="View ' + name + '"><img src="' + image + '" alt="' + alt + '" loading="lazy"></a>' +
      '<div class="product-info"><p class="product-category">' + category + '</p>' +
      '<h3 class="product-title"><a href="' + url + '">' + name + '</a></h3>' +
      '<p class="product-price">' + formatPrice(product.price) + ' <span class="sample-label">sample price</span></p>' +
      '<button class="button button-outline button-small" type="button" data-add-to-cart="' + id + '">Add to bag</button></div></article>';
  }

  function renderProductGrid(element, list) {
    if (!element) return;
    if (!list.length) {
      element.innerHTML = '<p class="empty-products">No items in this category yet.</p>';
      return;
    }
    element.innerHTML = list.map(productCard).join("");
  }

  function renderProductGrids() {
    document.querySelectorAll("[data-featured-products]").forEach(function (element) {
      renderProductGrid(element, products.filter(function (product) { return product.featured; }).slice(0, 4));
    });
    document.querySelectorAll("[data-product-grid]").forEach(function (element) {
      renderProductGrid(element, products);
      var count = document.querySelector("[data-product-count]");
      if (count) count.textContent = products.length + " sample products";
    });
  }

  function renderProductDetail() {
    var root = document.querySelector("[data-product-detail]");
    if (!root) return;
    var id = new URLSearchParams(window.location.search).get("id");
    var product = findProduct(id);
    var breadcrumb = document.querySelector("[data-product-breadcrumb]");
    if (!product) {
      root.innerHTML = '<div class="not-found"><h1>We could not find that product.</h1><p>It may have moved or the link may be incomplete.</p><a class="button button-primary" href="shop.html">Back to the collection</a></div>';
      if (breadcrumb) breadcrumb.textContent = "Product not found";
      document.title = "Product not found | smartpleasure";
      return;
    }
    var safeName = escapeHTML(product.name);
    if (breadcrumb) breadcrumb.textContent = product.name;
    document.title = product.name + " | smartpleasure";
    var description = "Explore " + product.name + " from the smartpleasure wellness collection for adults 18+.";
    var descriptionMeta = document.querySelector('meta[name="description"]');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDescription = document.querySelector('meta[property="og:description"]');
    var ogUrl = document.querySelector('meta[property="og:url"]');
    var ogImage = document.querySelector('meta[property="og:image"]');
    var ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (descriptionMeta) descriptionMeta.setAttribute("content", description);
    if (ogTitle) ogTitle.setAttribute("content", document.title);
    if (ogDescription) ogDescription.setAttribute("content", description);
    if (ogUrl) ogUrl.setAttribute("content", "http://smartpleasure.shop/product.html?id=" + encodeURIComponent(product.id));
    if (ogImage) ogImage.setAttribute("content", "http://smartpleasure.shop/" + product.image);
    if (ogImageAlt) ogImageAlt.setAttribute("content", product.imageAlt);
    var points = product.details.map(function (detail) { return "<span>" + escapeHTML(detail) + "</span>"; }).join("");
    root.innerHTML = '<div class="product-detail-layout">' +
      '<img class="product-detail-image" src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.imageAlt) + '">' +
      '<div class="product-detail-copy"><p class="product-category">' + escapeHTML(product.categoryLabel) + '</p>' +
      '<h1>' + safeName + '</h1><p class="product-detail-price">' + formatPrice(product.price) + ' <span class="sample-label">sample price</span></p>' +
      '<p class="product-description">' + escapeHTML(product.description) + '</p>' +
      '<button class="button button-primary" type="button" data-add-to-cart="' + escapeHTML(product.id) + '">Add to bag</button>' +
      '<div class="product-detail-meta">' + points + '</div>' +
      '<a class="continue-link" href="shop.html">← Back to all products</a></div></div>';
  }

  function renderCartPage() {
    var itemsRoot = document.querySelector("[data-cart-items]");
    var summaryRoot = document.querySelector("[data-cart-summary]");
    if (!itemsRoot || !summaryRoot) return;
    var lines = cartLines();
    if (!lines.length) {
      itemsRoot.innerHTML = '<div class="empty-cart"><h2>Your bag is waiting.</h2><p>Choose something from the collection to get started.</p><a class="button button-primary" href="shop.html">Browse products</a></div>';
      summaryRoot.innerHTML = '<a class="continue-link" href="shop.html">← Continue shopping</a>';
      return;
    }
    itemsRoot.innerHTML = lines.map(function (line) {
      var product = line.product;
      var id = escapeHTML(product.id);
      return '<article class="cart-line">' +
        '<img class="cart-line-image" src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.imageAlt) + '">' +
        '<div class="cart-line-main"><h2 class="cart-line-title"><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + escapeHTML(product.name) + '</a></h2>' +
        '<p class="cart-line-price">' + formatPrice(product.price) + ' each</p>' +
        '<div class="cart-line-controls"><div class="quantity-control" aria-label="Quantity for ' + escapeHTML(product.name) + '">' +
        '<button type="button" data-quantity-step="-1" data-product-id="' + id + '" aria-label="Decrease quantity of ' + escapeHTML(product.name) + '">−</button>' +
        '<input type="number" min="1" max="99" value="' + line.quantity + '" data-cart-quantity="' + id + '" aria-label="Quantity of ' + escapeHTML(product.name) + '">' +
        '<button type="button" data-quantity-step="1" data-product-id="' + id + '" aria-label="Increase quantity of ' + escapeHTML(product.name) + '">+</button></div>' +
        '<button type="button" class="remove-button" data-remove-from-cart="' + id + '">Remove</button></div></div>' +
        '<p class="line-total">' + formatPrice(product.price * line.quantity) + '</p></article>';
    }).join("");
    var total = cartTotal(lines);
    summaryRoot.innerHTML = '<h2>Order total</h2><div class="summary-row"><span>Items subtotal</span><strong>' + formatPrice(total) + '</strong></div>' +
      '<div class="summary-row summary-total"><span>Total before delivery</span><strong>' + formatPrice(total) + '</strong></div>' +
      '<p class="summary-note">Delivery charges and availability can be confirmed on WhatsApp before payment.</p>' +
      '<a class="button button-primary" href="checkout.html">Continue to checkout</a><a class="continue-link" href="shop.html">← Continue shopping</a>';
  }

  function renderCheckout() {
    var content = document.querySelector("[data-checkout-content]");
    if (!content) return;
    var empty = document.querySelector("[data-checkout-empty]");
    var lines = cartLines();
    if (!lines.length) {
      content.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    content.hidden = false;
    if (empty) empty.hidden = true;
    var summary = document.querySelector("[data-checkout-summary]");
    if (summary) {
      summary.innerHTML = lines.map(function (line) {
        return '<div class="checkout-summary-item"><span>' + escapeHTML(line.product.name) + ' × ' + line.quantity + '</span><strong>' + formatPrice(line.product.price * line.quantity) + '</strong></div>';
      }).join("") + '<div class="summary-row summary-total"><span>Items subtotal</span><strong>' + formatPrice(cartTotal(lines)) + '</strong></div><p class="form-note">Delivery charges are not included and can be confirmed on WhatsApp.</p>';
    }
    var upiText = document.querySelector("[data-upi-id]");
    if (upiText) upiText.textContent = STORE_CONFIG.upiId;
  }

  function updateCartCounts() {
    var count = getCart().reduce(function (total, item) { return total + item.quantity; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (element) { element.textContent = String(count); });
  }

  function refreshCartViews() {
    updateCartCounts();
    renderCartPage();
    renderCheckout();
  }

  function addToCart(id) {
    var product = findProduct(id);
    if (!product) return;
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === String(product.id); });
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else cart.push({ id: String(product.id), quantity: 1 });
    saveCart(cart);
    var status = document.querySelector("[data-cart-feedback]");
    if (status) status.textContent = product.name + " added to your bag.";
  }

  function setQuantity(id, quantity) {
    var cart = getCart();
    var item = cart.find(function (entry) { return entry.id === String(id); });
    if (!item) return;
    item.quantity = Math.max(1, Math.min(99, parseInt(quantity, 10) || 1));
    saveCart(cart);
  }

  function removeFromCart(id) {
    saveCart(getCart().filter(function (item) { return item.id !== String(id); }));
  }

  function configuredWhatsAppNumber() {
    var number = String(STORE_CONFIG.whatsappNumber || "").replace(/\D/g, "");
    return number.length >= 10 && number.length <= 15 ? number : "";
  }

  function applyContactLinks() {
    var number = configuredWhatsAppNumber();
    document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
      link.href = number ? "https://wa.me/" + number : "#";
    });
    document.querySelectorAll("[data-telegram]").forEach(function (link) {
      link.href = STORE_CONFIG.telegramUrl;
    });
  }

  function orderMessage(lines, name, phone, address) {
    var items = lines.map(function (line) {
      return "• " + line.product.name + " × " + line.quantity + " — " + formatPrice(line.product.price * line.quantity);
    });
    return "Hello " + STORE_CONFIG.storeName + ", I would like to place an order.\n\n" +
      items.join("\n") + "\n\nItems subtotal: " + formatPrice(cartTotal(lines)) +
      "\nDelivery: please confirm\n\nName: " + name + "\nPhone: " + phone + "\nAddress: " + address +
      "\n\nPlease confirm availability and delivery charges before payment.";
  }

  function showStatus(selector, message) {
    var status = document.querySelector(selector);
    if (status) status.textContent = message;
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    var number = configuredWhatsAppNumber();
    if (!number) {
      showStatus("[data-checkout-status]", "Add your WhatsApp number in js/main.js before using checkout.");
      return;
    }
    var form = event.currentTarget;
    var values = new FormData(form);
    var lines = cartLines();
    if (!lines.length) {
      showStatus("[data-checkout-status]", "Your bag is empty. Add a product before checking out.");
      return;
    }
    var message = orderMessage(lines, values.get("name"), values.get("phone"), values.get("address"));
    var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
    showStatus("[data-checkout-status]", "WhatsApp opened with your order. Review the details and tap Send there.");
  }

  function handleContactSubmit(event) {
    event.preventDefault();
    var number = configuredWhatsAppNumber();
    if (!number) {
      showStatus("[data-contact-status]", "Add your WhatsApp number in js/main.js before sending an enquiry.");
      return;
    }
    var values = new FormData(event.currentTarget);
    var message = "Hello " + STORE_CONFIG.storeName + ".\n\nName: " + values.get("name") + "\nPhone: " + values.get("phone") + "\nQuestion: " + values.get("message");
    window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
    showStatus("[data-contact-status]", "WhatsApp opened with your enquiry. Review it and tap Send there.");
  }

  function handleUpiPayment() {
    var upi = String(STORE_CONFIG.upiId || "");
    if (!upi || upi === "yourname@upi") {
      window.alert("Replace the sample UPI ID in js/main.js before accepting UPI payments.");
      return;
    }
    var total = cartTotal(cartLines());
    var link = "upi://pay?pa=" + encodeURIComponent(upi) + "&pn=" + encodeURIComponent(STORE_CONFIG.storeName) + "&am=" + encodeURIComponent(total) + "&cu=INR&tn=" + encodeURIComponent("smartpleasure order");
    window.location.href = link;
  }

  function copyUpiId() {
    var upi = String(STORE_CONFIG.upiId || "");
    if (!upi || upi === "yourname@upi") {
      window.alert("Replace the sample UPI ID in js/main.js before accepting UPI payments.");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(upi).then(function () {
        window.alert("UPI ID copied.");
      }).catch(function () {
        window.prompt("Copy this UPI ID:", upi);
      });
    } else {
      window.prompt("Copy this UPI ID:", upi);
    }
  }

  function setupFilters() {
    var grid = document.querySelector("[data-product-grid]");
    if (!grid) return;
    document.querySelectorAll("[data-product-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        var category = button.getAttribute("data-product-filter");
        document.querySelectorAll("[data-product-filter]").forEach(function (other) {
          var active = other === button;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", active ? "true" : "false");
        });
        var filtered = category === "all" ? products : products.filter(function (product) { return product.category === category; });
        renderProductGrid(grid, filtered);
        var count = document.querySelector("[data-product-count]");
        if (count) count.textContent = filtered.length + (filtered.length === 1 ? " product" : " products");
      });
    });
  }

  function setupMenus() {
    document.querySelectorAll(".menu-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var nav = document.getElementById(button.getAttribute("aria-controls"));
        if (!nav) return;
        var isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", isOpen ? "false" : "true");
        button.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
        nav.classList.toggle("is-open", !isOpen);
      });
    });
  }

  function setupInteractions() {
    document.addEventListener("click", function (event) {
      var addButton = event.target.closest("[data-add-to-cart]");
      if (addButton) {
        addToCart(addButton.getAttribute("data-add-to-cart"));
        return;
      }
      var removeButton = event.target.closest("[data-remove-from-cart]");
      if (removeButton) {
        removeFromCart(removeButton.getAttribute("data-remove-from-cart"));
        return;
      }
      var stepButton = event.target.closest("[data-quantity-step]");
      if (stepButton) {
        var current = getCart().find(function (item) { return item.id === stepButton.getAttribute("data-product-id"); });
        if (current) setQuantity(current.id, current.quantity + Number(stepButton.getAttribute("data-quantity-step")));
        return;
      }
      var whatsappLink = event.target.closest("[data-whatsapp]");
      if (whatsappLink && !configuredWhatsAppNumber()) {
        event.preventDefault();
        window.alert("Add your WhatsApp number in js/main.js before launch.");
        return;
      }
      if (event.target.closest("[data-upi-pay]")) handleUpiPayment();
      if (event.target.closest("[data-copy-upi]")) copyUpiId();
    });

    document.addEventListener("change", function (event) {
      var quantityInput = event.target.closest("[data-cart-quantity]");
      if (quantityInput) setQuantity(quantityInput.getAttribute("data-cart-quantity"), quantityInput.value);
    });
    var checkoutForm = document.querySelector("[data-checkout-form]");
    if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    var contactForm = document.querySelector("[data-contact-form]");
    if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);
  }

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (element) { element.textContent = String(new Date().getFullYear()); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderProductGrids();
    renderProductDetail();
    refreshCartViews();
    applyContactLinks();
    setupFilters();
    setupMenus();
    setupInteractions();
    setCurrentYear();
  });
}());
