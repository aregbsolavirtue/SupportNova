/* shop.js - VoltCart Shop Page Logic */

document.addEventListener('DOMContentLoaded', () => {
    const catalog = globalThis.products || window.products || [];
    if (!catalog.length) return;

    const container = document.getElementById('shop-products-container');
    const countEl = document.getElementById('results-count');
    const emptyState = document.getElementById('empty-state');
    const sortSelect = document.getElementById('sort-select');
    let currentProducts = [...catalog];

    const urlParams = new URLSearchParams(window.location.search);
    let activeSearch = urlParams.get('q') || '';
    const initialCategory = urlParams.get('category');
    let activeCategories = initialCategory ? [initialCategory] : [];

    const categories = [...new Set(catalog.map(p => p.category))].sort();
    const categoryFilterWrap = document.getElementById('category-filters');
    if (categoryFilterWrap) {
        categoryFilterWrap.innerHTML = categories.map(category => `
            <label>
                <input type="checkbox" value="${category}" class="cat-filter" ${activeCategories.includes(category) ? 'checked' : ''}> 
                ${category}
            </label>
        `).join('');
    }

    const mobileBtn = document.getElementById('mobile-filter-btn');
    const sidebar = document.getElementById('filter-sidebar');
    const closeFilters = document.getElementById('close-filters');
    const mobileHeader = document.getElementById('mobile-filter-header');

    if (window.innerWidth <= 768 && mobileBtn && sidebar) {
        mobileBtn.style.display = 'block';
        if (mobileHeader) {
            mobileHeader.classList.remove('hidden');
            mobileHeader.style.display = 'flex';
        }

        mobileBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeFilters?.addEventListener('click', () => {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    function renderCard(product) {
        const hasDiscount = Number(product.discount || 0) > 0;
        const badgeClass = product.badge === 'Sale' ? 'badge-sale' : product.badge === 'New' ? 'badge-new' : product.badge === 'Best Seller' ? 'badge-best' : 'badge';
        const wishlistOn = window.cart && window.cart.isWishlisted(product.id);

        return `
            <div class="card product-card">
                <div class="badge-container">
                    ${product.badge ? `<span class="badge ${badgeClass}">${product.badge}</span>` : ''}
                    <button class="wishlist-btn btn-icon ${wishlistOn ? 'active' : ''}" data-product-id="${product.id}" aria-label="${wishlistOn ? 'Remove from wishlist' : 'Add to wishlist'}" onclick="window.toggleWishlist(${product.id})">
                        <i class="${wishlistOn ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <a href="/product.html?id=${product.id}" style="display:block;">
                    <div class="card-img-wrap">
                        <img src="${product.image}" loading="lazy" alt="${product.name}">
                    </div>
                </a>
                <div class="card-body">
                    <span class="product-category">${product.subcategory}</span>
                    <a href="/product.html?id=${product.id}" class="product-title">${product.name}</a>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating}</span>
                        <span class="rating-count">(${product.reviewCount || product.reviews || 0})</span>
                    </div>
                    <div class="product-price-row">
                        <span class="price-current">${window.formatCurrency(product.price)}</span>
                        ${hasDiscount ? `<span class="price-old">${window.formatCurrency(product.originalPrice || product.oldPrice || product.price)}</span>` : ''}
                    </div>
                    <button class="btn btn-outline btn-add-cart" onclick="window.addToCartEvent(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    function updateProducts() {
        let filtered = [...catalog];

        if (activeSearch) {
            const q = activeSearch.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(q) ||
                product.category.toLowerCase().includes(q) ||
                product.subcategory.toLowerCase().includes(q) ||
                (product.tags || []).some(tag => tag.toLowerCase().includes(q))
            );
        }

        const checkedCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
        if (checkedCats.length > 0) {
            filtered = filtered.filter(product => checkedCats.includes(product.category));
        }

        const checkedCompat = Array.from(document.querySelectorAll('#compat-filters input:checked')).map(cb => cb.value);
        if (checkedCompat.length > 0) {
            filtered = filtered.filter(product => (product.compatibility || []).some(item => checkedCompat.includes(item)));
        }

        const priceVal = document.querySelector('input[name="price"]:checked')?.value;
        if (priceVal && priceVal !== 'all') {
            const [min, max] = priceVal.split('-').map(Number);
            filtered = filtered.filter(product => product.price >= min && product.price <= max);
        }

        const ratingVal = document.querySelector('input[name="rating-filter"]:checked')?.value;
        if (ratingVal && ratingVal !== 'all') {
            const minRating = Number(ratingVal);
            filtered = filtered.filter(product => product.rating >= minRating);
        }

        const stockOnly = document.getElementById('in-stock-only')?.checked;
        if (stockOnly) {
            filtered = filtered.filter(product => Number(product.stock) > 0);
        }

        const sortVal = sortSelect?.value || 'featured';
        if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sortVal === 'rating') filtered.sort((a, b) => b.rating - a.rating);
        else if (sortVal === 'discount') filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        else if (sortVal === 'newest') filtered.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));

        currentProducts = filtered;
        renderGrid();
    }

    function renderGrid() {
        if (!container) return;

        countEl.textContent = currentProducts.length
            ? `Showing ${currentProducts.length} products`
            : 'No products match your search';

        if (!currentProducts.length) {
            container.innerHTML = '';
            emptyState?.classList.remove('hidden');
            return;
        }

        emptyState?.classList.add('hidden');
        container.innerHTML = currentProducts.map(renderCard).join('');
        if (window.cart) window.cart.updateWishlistUI();
    }

    window.addToCartEvent = function(id) {
        const product = catalog.find(p => p.id === id);
        if (product && window.cart) {
            window.cart.addItem(product, 1);
        }
    };

    window.toggleWishlist = function(id) {
        if (window.cart) {
            window.cart.toggleWishlist(id);
            renderGrid();
        }
    };

    document.querySelectorAll('.cat-filter, #compat-filters input, input[name="price"], input[name="rating-filter"], #in-stock-only').forEach(el => {
        el.addEventListener('change', updateProducts);
    });

    sortSelect?.addEventListener('change', updateProducts);

    document.getElementById('clear-filters-btn')?.addEventListener('click', () => {
        document.querySelectorAll('.cat-filter').forEach(cb => cb.checked = false);
        document.querySelectorAll('#compat-filters input').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[name="price"]').forEach(cb => cb.checked = cb.value === 'all');
        document.querySelectorAll('input[name="rating-filter"]').forEach(cb => cb.checked = cb.value === 'all');
        const stockCheckbox = document.getElementById('in-stock-only');
        if (stockCheckbox) stockCheckbox.checked = false;
        activeSearch = '';
        activeCategories = [];
        window.history.replaceState({}, '', '/shop.html');
        updateProducts();
    });

    if (initialCategory) {
        const matching = document.querySelector(`.cat-filter[value="${CSS.escape(initialCategory)}"]`);
        if (matching) matching.checked = true;
    }

    updateProducts();
});
