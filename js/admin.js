// ========================================
// SKINUVIA - Main JavaScript
// ========================================

console.log('✅ SKINUVIA loaded');

// ===== DEFAULT PRODUCTS =====
var defaultProducts = [
    { id: 1, name: "Gentle Foaming Cleanser", price: 24.00, category: "cleansers", routine: "Step 1 · Morning & Night", description: "Removes makeup and grime without stripping.", image: "https://picsum.photos/seed/cleanser/600/600" },
    { id: 2, name: "Hydrating Serum", price: 32.00, category: "serums", routine: "Step 2 · Morning & Night", description: "Hyaluronic acid + niacinamide. Plumps and calms.", image: "https://picsum.photos/seed/serum/600/600" },
    { id: 3, name: "Barrier Repair Moisturiser", price: 28.00, category: "moisturisers", routine: "Step 3 · Morning & Night", description: "Ceramides and squalane for a healthy barrier.", image: "https://picsum.photos/seed/moisturiser/600/600" },
    { id: 4, name: "Daily SPF 50", price: 26.00, category: "spf", routine: "Step 4 · Morning only", description: "Lightweight, no white cast, non-greasy.", image: "https://picsum.photos/seed/spf/600/600" },
    { id: 5, name: "Overnight Repair Mask", price: 38.00, category: "treatments", routine: "Step 3 · 2–3 nights a week", description: "Wake up to softer, smoother skin.", image: "https://picsum.photos/seed/mask/600/600" },
    { id: 6, name: "Vitamin C Brightening Serum", price: 36.00, category: "serums", routine: "Step 2 · Morning", description: "Fades dark spots, brightens dull skin.", image: "https://picsum.photos/seed/vitc/600/600" },
    { id: 7, name: "Calming Toner", price: 20.00, category: "cleansers", routine: "Step 1.5 · After cleansing", description: "Rose water and chamomile to soothe.", image: "https://picsum.photos/seed/toner/600/600" },
    { id: 8, name: "Retinol Night Serum", price: 42.00, category: "treatments", routine: "Step 3 · 2–3 nights a week", description: "Gentle encapsulated retinol for fine lines.", image: "https://picsum.photos/seed/retinol/600/600" }
];

// ===== LOAD PRODUCTS =====
function loadProductsFromAdmin() {
    var stored = localStorage.getItem('adminProducts');
    if (stored) {
        try {
            var products = JSON.parse(stored);
            if (products && products.length > 0) {
                return products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    category: p.category || 'serums',
                    routine: p.routine || 'Step 1 · Morning & Night',
                    description: p.description || 'A skincare essential.',
                    image: p.image || 'https://picsum.photos/seed/product/600/600'
                }));
            }
        } catch (e) {}
    }
    return defaultProducts;
}

var products = loadProductsFromAdmin();
window.products = products;

// ===== CART =====
var cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== HELPERS =====
function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 400);
    }, 2500);
}

function productCardHTML(p) {
    var img = p.image && p.image.startsWith('data:image') ? p.image : (p.image || 'https://picsum.photos/seed/product/600/600');
    return `
        <a href="product.html?id=${p.id}" class="product-card">
            <div class="product-img">
                <img src="${img}" alt="${p.name}" loading="lazy" />
            </div>
            <div class="product-info">
                <p class="product-routine">${p.routine || ''}</p>
                <h3>${p.name}</h3>
                <p class="product-desc">${p.description || ''}</p>
                <p class="product-price">£${p.price.toFixed(2)}</p>
                <button class="add-btn" data-id="${p.id}">Add to bag</button>
            </div>
        </a>
    `;
}

// ===== CART LOGIC =====
function addToCart(id) {
    var p = products.find(x => x.id === id);
    if (!p) return;
    var existing = cart.find(x => x.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, quantity: 1 });
    updateCart();
    showToast('Added — ' + p.name);
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    var count = cart.reduce((s, i) => s + i.quantity, 0);
    var cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = count;

    var total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    var cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = total.toFixed(2);

    var items = document.getElementById('cartItems');
    if (!items) return;

    if (cart.length === 0) {
        items.innerHTML = '<p class="cart-empty">Your bag is empty.</p>';
        return;
    }

    items.innerHTML = cart.map(i => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${i.name}</h4>
                <span>£${i.price.toFixed(2)} × ${i.quantity}</span>
            </div>
            <button class="remove-btn" data-id="${i.id}">Remove</button>
        </div>
    `).join('');

    items.querySelectorAll('.remove-btn').forEach(b => {
        b.addEventListener('click', function() {
            removeFromCart(parseInt(this.dataset.id));
        });
    });
}

// ===== CART UI =====
function openCart() {
    var s = document.getElementById('cartSidebar');
    var o = document.getElementById('overlay');
    if (s) s.classList.add('open');
    if (o) o.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    var s = document.getElementById('cartSidebar');
    var o = document.getElementById('overlay');
    if (s) s.classList.remove('open');
    if (o) o.classList.remove('show');
    document.body.style.overflow = '';
}

// ===== PAGE HANDLERS =====

// Homepage
function initHomepage() {
    var best = document.getElementById('bestSellers');
    var newA = document.getElementById('newArrivals');
    if (best) best.innerHTML = products.slice(0, 4).map(productCardHTML).join('');
    if (newA) newA.innerHTML = [...products].reverse().slice(0, 4).map(productCardHTML).join('');
}

// Shop page
function initShop() {
    var grid = document.getElementById('shopGrid');
    if (!grid) return;

    var searchInput = document.getElementById('searchInput');
    var priceRange = document.getElementById('priceRange');
    var priceDisplay = document.getElementById('priceDisplay');
    var sortSelect = document.getElementById('sortSelect');
    var productCount = document.getElementById('productCount');
    var clearFilters = document.getElementById('clearFilters');

    var filtered = [...products];

    function render() {
        var term = (searchInput.value || '').toLowerCase().trim();
        var maxPrice = parseFloat(priceRange.value);
        var cat = document.querySelector('input[name="category"]:checked').value;

        filtered = products.filter(p => {
            var matchTerm = !term || p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term);
            var matchPrice = p.price <= maxPrice;
            var matchCat = cat === 'all' || p.category === cat;
            return matchTerm && matchPrice && matchCat;
        });

        var sort = sortSelect.value;
        if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

        productCount.textContent = filtered.length;

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:#6e6a63;">No products match your filters.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(productCardHTML).join('');
    }

    searchInput.addEventListener('input', render);
    priceRange.addEventListener('input', () => {
        priceDisplay.textContent = '£' + priceRange.value;
        render();
    });
    sortSelect.addEventListener('change', render);
    document.querySelectorAll('input[name="category"]').forEach(r => r.addEventListener('change', render));

    clearFilters.addEventListener('click', () => {
        searchInput.value = '';
        priceRange.value = '100';
        priceDisplay.textContent = '£100';
        sortSelect.value = 'default';
        document.querySelector('input[name="category"][value="all"]').checked = true;
        render();
    });

    // Pre-select category from URL
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get('cat');
    if (catParam) {
        var radio = document.querySelector(`input[name="category"][value="${catParam}"]`);
        if (radio) radio.checked = true;
    }

    render();
}

// Product detail page
function initProductDetail() {
    var nameEl = document.getElementById('productName');
    if (!nameEl) return;

    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id')) || 1;
    var product = products.find(p => p.id === id) || products[0];

    document.getElementById('breadcrumbName').textContent = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productRoutine').textContent = product.routine || '';
    document.getElementById('productDescription').textContent = product.description || '';
    document.getElementById('productPrice').textContent = '£' + product.price.toFixed(2);

    var imgEl = document.getElementById('productImage');
    imgEl.src = product.image && product.image.startsWith('data:image') ? product.image : (product.image || 'https://picsum.photos/seed/product/600/600');

    var qty = 1;
    var qtyEl = document.getElementById('qtyValue');
    document.getElementById('qtyMinus').onclick = () => { if (qty > 1) { qty--; qtyEl.textContent = qty; } };
    document.getElementById('qtyPlus').onclick = () => { qty++; qtyEl.textContent = qty; };

    document.getElementById('addToCartBtn').onclick = () => {
        for (var i = 0; i < qty; i++) {
            var existing = cart.find(x => x.id === product.id);
            if (existing) existing.quantity += 1;
            else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
        }
        updateCart();
        showToast('Added — ' + product.name);
        openCart();
    };

    // Related
    var related = document.getElementById('relatedProducts');
    if (related) {
        var others = products.filter(p => p.id !== product.id).slice(0, 4);
        related.innerHTML = others.map(productCardHTML).join('');
    }

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            var target = document.getElementById('tab-' + this.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ===== EVENT DELEGATION =====
document.addEventListener('click', function(e) {
    var addBtn = e.target.closest('.add-btn');
    if (addBtn) {
        e.preventDefault();
        addToCart(parseInt(addBtn.dataset.id));
    }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    initHomepage();
    initShop();
    initProductDetail();

    var cartToggle = document.getElementById('cartToggle');
    var closeCart = document.getElementById('closeCart');
    var overlay = document.getElementById('overlay');
    var checkoutBtn = document.getElementById('checkoutBtn');

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
    if (overlay) overlay.addEventListener('click', closeCartSidebar);

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) { showToast('Your bag is empty.'); return; }
            var total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            if (confirm('Total: £' + total.toFixed(2) + '\n\nProceed to checkout?')) {
                showToast('Thank you — order placed (demo)');
                cart = [];
                updateCart();
                closeCartSidebar();
            }
        });
    }

    // Mobile filters
    var filterToggle = document.getElementById('filterToggle');
    var filtersSidebar = document.getElementById('filtersSidebar');
    var filtersClose = document.getElementById('filtersClose');

    if (filterToggle && filtersSidebar) {
        filterToggle.addEventListener('click', () => filtersSidebar.classList.add('open'));
    }
    if (filtersClose && filtersSidebar) {
        filtersClose.addEventListener('click', () => filtersSidebar.classList.remove('open'));
    }

    // Storage sync
    window.addEventListener('storage', function(e) {
        if (e.key === 'adminProducts') {
            products = loadProductsFromAdmin();
            window.products = products;
            initHomepage();
        }
    });

    updateCart();
});

window.addToCart = addToCart;
window.updateCart = updateCart;
window.showToast = showToast;