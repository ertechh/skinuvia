/* ============================================
   SKINUVIA — All JavaScript
   ============================================ */

console.log('🌿 SKINUVIA initialising');

// ===== DEFAULT PRODUCTS =====
var defaultProducts = [
    { id: 1, name: "Gentle Foaming Cleanser", price: 24.00, category: "cleansers", routine: "Step 1 · Morning & Night", description: "Removes makeup and grime without stripping.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop" },
    { id: 2, name: "Hydrating Serum", price: 32.00, category: "serums", routine: "Step 2 · Morning & Night", description: "Hyaluronic acid + niacinamide. Plumps and calms.", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop" },
    { id: 3, name: "Barrier Repair Moisturiser", price: 28.00, category: "moisturisers", routine: "Step 3 · Morning & Night", description: "Ceramides and squalane for a healthy barrier.", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop" },
    { id: 4, name: "Daily SPF 50", price: 26.00, category: "spf", routine: "Step 4 · Morning only", description: "Lightweight, no white cast, non-greasy.", image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop" },
    { id: 5, name: "Overnight Repair Mask", price: 38.00, category: "treatments", routine: "Step 3 · 2–3 nights a week", description: "Wake up to softer, smoother skin.", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop" },
    { id: 6, name: "Vitamin C Brightening Serum", price: 36.00, category: "serums", routine: "Step 2 · Morning", description: "Fades dark spots, brightens dull skin.", image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop" },
    { id: 7, name: "Calming Toner", price: 20.00, category: "cleansers", routine: "Step 1.5 · After cleansing", description: "Rose water and chamomile to soothe.", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop" },
    { id: 8, name: "Retinol Night Serum", price: 42.00, category: "treatments", routine: "Step 3 · 2–3 nights a week", description: "Gentle encapsulated retinol for fine lines.", image: "https://images.unsplash.com/photo-1611930021592-a8cfd5319e18?w=600&h=600&fit=crop" }
];

// ===== CATEGORIES =====
var categories = [
    { slug: 'skincare',         name: 'Skincare',          icon: 'fa-wand-magic-sparkles' },
    { slug: 'body-scrubs',      name: 'Body Scrubs',       icon: 'fa-hand-sparkles' },
    { slug: 'cleansing-toners', name: 'Cleansing Toners',  icon: 'fa-droplet' },
    { slug: 'hydrating-toners', name: 'Hydrating Toners',  icon: 'fa-droplet' },
    { slug: 'treatments',       name: 'Treatments',        icon: 'fa-star' },
    { slug: 'moisturisers',     name: 'Moisturizers',      icon: 'fa-flask' },
    { slug: 'serums',           name: 'Serums',            icon: 'fa-prescription-bottle' },
    { slug: 'facial-toners',    name: 'Facial Toners',     icon: 'fa-spray-can-sparkles' },
    { slug: 'body-lotions',     name: 'Body Lotions',      icon: 'fa-hand-holding-droplet' },
    { slug: 'bath-body',        name: 'Bath & Body',       icon: 'fa-bath' }
];

// ===== LOAD =====
function loadProducts() {
    try {
        var stored = localStorage.getItem('skinuvia_products');
        if (stored) {
            var parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                console.log('✅ Loaded ' + parsed.length + ' products from storage');
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Load error:', e);
    }
    console.log('ℹ️ Using default products');
    return defaultProducts;
}

function saveProducts() {
    localStorage.setItem('skinuvia_products', JSON.stringify(products));
    console.log('💾 Saved ' + products.length + ' products');
}

var products = loadProducts();
var cart = JSON.parse(localStorage.getItem('skinuvia_cart')) || [];

// ===== TOAST =====
var toastTimer;
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) { console.log(msg); return; }
    var m = document.getElementById('toastMsg');
    if (m) m.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2400);
}

// ===== HERO BACKGROUND SLIDER =====
function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var texts = document.querySelectorAll('.hero-text-slide');
    var dots = document.querySelectorAll('.hero-dot');
    if (slides.length === 0) return;

    console.log('🌿 Hero slider: ' + slides.length + ' slides');

    var currentSlide = 0;
    var slideInterval = 5000;
    var timer;

    function goToSlide(index) {
        slides.forEach(function(s, i) { s.classList.toggle('active', i === index); });
        texts.forEach(function(t, i) { t.classList.toggle('active', i === index); });
        dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
        currentSlide = index;
    }

    function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
    function startAutoPlay() { stopAutoPlay(); timer = setInterval(nextSlide, slideInterval); }
    function stopAutoPlay() { if (timer) clearInterval(timer); }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.slide));
            startAutoPlay();
        });
    });

    var heroEl = document.querySelector('.hero-slider');
    if (heroEl) {
        heroEl.addEventListener('mouseenter', stopAutoPlay);
        heroEl.addEventListener('mouseleave', startAutoPlay);
    }

    startAutoPlay();
    console.log('✅ Hero slider started');
}

// ===== RENDER CATEGORIES =====
function renderCategories() {
    var grid = document.getElementById('categoriesGrid');
    if (!grid) return;

    var counts = {};
    categories.forEach(function(c) { counts[c.slug] = 0; });
    products.forEach(function(p) {
        if (counts.hasOwnProperty(p.category)) counts[p.category]++;
    });

    grid.innerHTML = categories.map(function(c) {
        var count = counts[c.slug] || 0;
        var label = count === 1 ? '1 product' : count + ' products';
        return '<a href="shop.html?cat=' + c.slug + '" class="category-card">' +
            '<div class="category-icon"><i class="fas ' + c.icon + '"></i></div>' +
            '<h3>' + c.name + '</h3>' +
            '<p class="category-count">' + label + '</p>' +
        '</a>';
    }).join('');
}

// ===== RENDER PRODUCT CARD =====
function cardHTML(p) {
    var img = (p.image && p.image.indexOf('data:image') === 0) ? p.image : (p.image || '');
    return '<a href="product.html?id=' + p.id + '" class="product-card">' +
        '<div class="product-img"><img src="' + img + '" alt="' + p.name + '" /></div>' +
        '<p class="product-routine">' + (p.routine || '') + '</p>' +
        '<h3>' + p.name + '</h3>' +
        '<p class="product-desc">' + (p.description || '') + '</p>' +
        '<p class="product-price">£' + parseFloat(p.price).toFixed(2) + '</p>' +
        '<button type="button" class="add-btn" onclick="event.preventDefault(); event.stopPropagation(); quickAdd(' + p.id + ');">Add to bag</button>' +
    '</a>';
}

function renderHome() {
    var best = document.getElementById('bestSellers');
    var newA = document.getElementById('newArrivals');
    if (best) best.innerHTML = products.slice(0, 4).map(cardHTML).join('');
    if (newA) newA.innerHTML = products.slice().reverse().slice(0, 4).map(cardHTML).join('');
}

// ===== RENDER SHOP =====
function renderShop() {
    var grid = document.getElementById('shopGrid');
    if (!grid) return;

    var searchEl = document.getElementById('searchInput');
    var priceEl = document.getElementById('priceRange');
    var sortEl = document.getElementById('sortSelect');

    var term = (searchEl ? searchEl.value : '').toLowerCase().trim();
    var maxPrice = priceEl ? parseFloat(priceEl.value) : 100;
    var catEl = document.querySelector('input[name="category"]:checked');
    var cat = catEl ? catEl.value : 'all';
    var sort = sortEl ? sortEl.value : 'default';

    var filtered = products.filter(function(p) {
        var matchTerm = !term || p.name.toLowerCase().indexOf(term) !== -1 || (p.description || '').toLowerCase().indexOf(term) !== -1;
        var matchPrice = p.price <= maxPrice;
        var matchCat = cat === 'all' || p.category === cat;
        return matchTerm && matchPrice && matchCat;
    });

    if (sort === 'price-low') filtered.sort(function(a, b) { return a.price - b.price; });
    else if (sort === 'price-high') filtered.sort(function(a, b) { return b.price - a.price; });
    else if (sort === 'name') filtered.sort(function(a, b) { return a.name.localeCompare(b.name); });

    var countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">No products match your filters.</p>';
        return;
    }
    grid.innerHTML = filtered.map(cardHTML).join('');
}

function resetFilters() {
    var s = document.getElementById('searchInput');
    var p = document.getElementById('priceRange');
    var pd = document.getElementById('priceDisplay');
    var sort = document.getElementById('sortSelect');
    if (s) s.value = '';
    if (p) p.value = '100';
    if (pd) pd.textContent = '£100';
    if (sort) sort.value = 'default';
    var all = document.querySelector('input[name="category"][value="all"]');
    if (all) all.checked = true;
    renderShop();
}

// ===== CART =====
function quickAdd(id, qty) {
    qty = qty || 1;
    var p = products.find(function(x) { return x.id === id; });
    if (!p) return;
    var existing = cart.find(function(x) { return x.id === id; });
    if (existing) existing.quantity += qty;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: qty });
    updateCart();
    showToast(p.name + ' added to bag');
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(function(x) { return x.id !== id; });
    updateCart();
}

function updateCart() {
    localStorage.setItem('skinuvia_cart', JSON.stringify(cart));

    var count = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    var countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = count;

    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total.toFixed(2);

    var items = document.getElementById('cartItems');
    if (!items) return;
    if (cart.length === 0) {
        items.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
        return;
    }
    items.innerHTML = cart.map(function(i) {
        return '<div class="cart-item">' +
            '<div class="cart-item-info"><h4>' + i.name + '</h4><span>£' + i.price.toFixed(2) + ' × ' + i.quantity + '</span></div>' +
            '<button class="remove-btn" onclick="removeFromCart(' + i.id + ')">Remove</button>' +
        '</div>';
    }).join('');
}

function openCart() {
    var s = document.getElementById('cartSidebar');
    var o = document.getElementById('overlay');
    if (s) s.classList.add('open');
    if (o) o.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    var s = document.getElementById('cartSidebar');
    var o = document.getElementById('overlay');
    if (s) s.classList.remove('open');
    if (o) o.classList.remove('show');
    document.body.style.overflow = '';
}

function checkout() {
    if (cart.length === 0) { showToast('Your bag is empty'); return; }
    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    if (confirm('Total: £' + total.toFixed(2) + '\n\nProceed to checkout?')) {
        showToast('Thank you — order placed (demo)');
        cart = [];
        updateCart();
        closeCart();
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) { showToast('Your bag is empty'); return; }
    var WHATSAPP = '447000000000';
    var message = 'Hi SKINUVIA! I\'d like to place an order:\n\n';
    var total = 0;
    cart.forEach(function(item, index) {
        var lineTotal = item.price * item.quantity;
        total += lineTotal;
        message += (index + 1) + '. ' + item.name + '\n   Qty: ' + item.quantity + ' × £' + item.price.toFixed(2) + ' = £' + lineTotal.toFixed(2) + '\n\n';
    });
    message += 'Total: £' + total.toFixed(2) + '\n\nPlease confirm availability. Thank you!';
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message), '_blank');
}

// ===== PRODUCT DETAIL PAGE =====
function initProductDetail() {
    var nameEl = document.getElementById('productName');
    if (!nameEl) return;

    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));
    var product = products.find(function(p) { return p.id === id; }) || products[0];

    if (!product) {
        nameEl.textContent = 'Product not found';
        return;
    }

    document.getElementById('breadcrumbName').textContent = product.name;
    nameEl.textContent = product.name;
    document.getElementById('productRoutine').textContent = product.routine || '';
    document.getElementById('productDescription').textContent = product.description || '';
    document.getElementById('productPrice').textContent = '£' + parseFloat(product.price).toFixed(2);

    var imgEl = document.getElementById('productImage');
    if (imgEl) {
        imgEl.src = (product.image && product.image.indexOf('data:image') === 0)
            ? product.image
            : (product.image || 'https://picsum.photos/seed/product/600/600');
        imgEl.alt = product.name;
    }

    var qty = 1;
    var qtyEl = document.getElementById('qtyValue');
    var minusBtn = document.getElementById('qtyMinus');
    var plusBtn = document.getElementById('qtyPlus');

    if (minusBtn) minusBtn.onclick = function() {
        if (qty > 1) { qty--; if (qtyEl) qtyEl.textContent = qty; }
    };
    if (plusBtn) plusBtn.onclick = function() {
        qty++; if (qtyEl) qtyEl.textContent = qty;
    };

    var addBtn = document.getElementById('addToCartBtn');
    if (addBtn) {
        addBtn.onclick = function() {
            for (var i = 0; i < qty; i++) {
                var existing = cart.find(function(x) { return x.id === product.id; });
                if (existing) existing.quantity += 1;
                else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
            }
            updateCart();
            showToast('Added — ' + product.name);
            openCart();
        };
    }

    var related = document.getElementById('relatedProducts');
    if (related) {
        var others = products.filter(function(p) { return p.id !== product.id; }).slice(0, 4);
        related.innerHTML = others.map(cardHTML).join('');
    }

    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            var target = document.getElementById('tab-' + this.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ===== MOBILE NAVIGATION =====
function initMobileNav() {
    var menuBtn = document.getElementById('mobileMenuBtn');
    var closeBtn = document.getElementById('closeNavBtn');
    var nav = document.getElementById('mainNav');
    var overlay = document.getElementById('mobileNavOverlay');

    if (!menuBtn || !nav) return;

    // Prevent double-binding
    if (menuBtn.dataset.navBound === 'true') return;
    menuBtn.dataset.navBound = 'true';

    console.log('✅ Mobile nav ready');

    function openMenu() {
        nav.classList.add('open');
        if (overlay) overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Hamburger toggle
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (nav.classList.contains('open')) closeMenu();
        else openMenu();
    });

    // ✕ close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Overlay click closes
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Escape key closes
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
    });
}

// ===== EVENT BINDING =====
function bindEvents() {
    var fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.addEventListener('change', function(e) { handleFile(e.target.files[0]); });

    var uz = document.getElementById('uploadZone');
    if (uz) {
        uz.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
        uz.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
        uz.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
    }

    var searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', renderShop);

    var priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            var pd = document.getElementById('priceDisplay');
            if (pd) pd.textContent = '£' + this.value;
            renderShop();
        });
    }

    var sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', renderShop);

    document.querySelectorAll('input[name="category"]').forEach(function(r) {
        r.addEventListener('change', renderShop);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCart();
            closeProductForm();
            closeAdminLogin();
        }
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM ready');
    bindEvents();
    initHeroSlider();
    initProductDetail();
    initMobileNav();
    renderHome();
    renderShop();
    renderCategories();
    updateCart();
    console.log('✅ SKINUVIA ready — ' + products.length + ' products');
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        bindEvents();
        initHeroSlider();
        initProductDetail();
        initMobileNav();
        renderHome();
        renderShop();
        renderCategories();
        updateCart();
    }, 100);
}

// Safety nets for bfcache (browser back/forward)
window.addEventListener('load', initMobileNav);
window.addEventListener('pageshow', function(e) {
    if (e.persisted) initMobileNav();
});

// ===== EXPOSE GLOBALLY =====
window.showToast = showToast;
window.openCart = openCart;
window.closeCart = closeCart;
window.quickAdd = quickAdd;
window.updateCart = updateCart;
window.checkout = checkout;
window.checkoutWhatsApp = checkoutWhatsApp;
window.resetFilters = resetFilters;
window.removeFromCart = removeFromCart;