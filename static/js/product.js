/* product.js - VoltCart Product Detail Logic */

document.addEventListener('DOMContentLoaded', () => {
    if (!window.products) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = window.products.find(p => p.id === productId);

    const content = document.getElementById('product-content');
    const loading = document.getElementById('product-loading');

    if (!product) {
        const container = document.getElementById('product-container');
        if (container) {
            container.innerHTML = `
                <div class="empty-state" style="margin-top: 4rem;">
                    <i class="fas fa-box-open icon"></i>
                    <h3>Product Not Found</h3>
                    <p>The product you are looking for does not exist or has been removed.</p>
                    <a href="/shop.html" class="btn btn-primary">Back to Shop</a>
                </div>
            `;
        }
        return;
    }

    document.title = `${product.name} - VoltCart`;

    const hasDiscount = Number(product.discount || 0) > 0;
    const galleryImages = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
    const thumbnailMarkup = galleryImages.map((image, index) => `
        <button class="product-thumb ${index === 0 ? 'active' : ''}" data-image="${image}" type="button" aria-label="View product image ${index + 1}">
            <img src="${image}" alt="${product.name} image ${index + 1}">
        </button>
    `).join('');

    const currentPrice = window.formatCurrency(product.price);
    const originalPrice = hasDiscount ? window.formatCurrency(product.originalPrice || product.oldPrice || product.price) : '';
    const stockText = Number(product.stock) > 0 ? `In Stock (${product.stock})` : 'Out of Stock';

    content.innerHTML = `
        <div class="product-layout">
            <div class="product-gallery">
                <img src="${galleryImages[0]}" alt="${product.name}" class="main-image" id="main-product-image">
                ${galleryImages.length > 1 ? `<div class="product-gallery-thumbs">${thumbnailMarkup}</div>` : ''}
            </div>

            <div class="product-info">
                <div style="text-transform: uppercase; color: var(--color-text-muted); font-size: 0.875rem; letter-spacing: 1px; margin-bottom: 0.5rem;">
                    ${product.category} > ${product.subcategory}
                </div>
                <h1>${product.name}</h1>

                <div class="product-meta">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span style="color: var(--color-text-main); font-weight: 600; margin-left: 4px;">${product.rating}</span>
                    </div>
                    <span>(${product.reviewCount || product.reviews || 0} reviews)</span>
                    <span class="stock-badge"><i class="fas fa-check-circle"></i> ${stockText}</span>
                </div>

                <div class="product-price">
                    <span>${currentPrice}</span>
                    ${hasDiscount ? `<span class="old-price">${originalPrice}</span> <span class="discount-badge">-${product.discount}%</span>` : ''}
                </div>

                <p class="product-description">${product.description}</p>

                ${(product.colors && product.colors.length) ? `
                    <div class="variant-block">
                        <div class="variant-label">Color</div>
                        <div class="compat-list">
                            ${product.colors.map(color => `<button type="button" class="variant-button">${color}</button>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${(product.sizes && product.sizes.length) ? `
                    <div class="variant-block">
                        <div class="variant-label">Size</div>
                        <div class="compat-list">
                            ${product.sizes.map(size => `<button type="button" class="variant-button">${size}</button>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="compat-block">
                    <div class="variant-label">Compatibility</div>
                    <div class="compat-list">
                        ${(product.compatibility || []).map(c => `<span class="compat-badge">${c}</span>`).join('')}
                    </div>
                </div>

                <div class="action-row">
                    <div class="quantity-selector" style="height: 48px; border-color: var(--color-navy);">
                        <button id="qty-minus" style="padding: 0 1rem; font-size: 1.25rem;" type="button">-</button>
                        <input type="text" id="qty-input" value="1" readonly style="width: 3rem; font-size: 1.125rem;">
                        <button id="qty-plus" style="padding: 0 1rem; font-size: 1.25rem;" type="button">+</button>
                    </div>
                    <button class="btn btn-primary btn-buy-now" id="add-to-cart-btn" style="height: 48px; font-size: 1.125rem;" type="button">
                        Add to Cart
                    </button>
                    <button class="btn btn-outline" id="wishlist-btn" type="button">
                        <i class="${window.cart && window.cart.isWishlisted(product.id) ? 'fas' : 'far'} fa-heart"></i> Save
                    </button>
                </div>

                <div class="features-list">
                    <h4 style="margin-bottom: 0.5rem;">Why choose this?</h4>
                    <ul>
                        <li><i class="fas fa-check"></i> Premium materials and finish</li>
                        <li><i class="fas fa-check"></i> Easy returns within 30 days</li>
                        <li><i class="fas fa-check"></i> Complimentary delivery over $50</li>
                        <li><i class="fas fa-check"></i> Carefully selected for everyday use</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.product-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const nextImage = thumb.dataset.image;
            const mainImage = document.getElementById('main-product-image');
            if (mainImage && nextImage) mainImage.src = nextImage;
            document.querySelectorAll('.product-thumb').forEach(item => item.classList.toggle('active', item === thumb));
        });
    });

    document.querySelectorAll('.variant-button').forEach(button => {
        button.addEventListener('click', () => {
            const siblings = button.parentElement.querySelectorAll('.variant-button');
            siblings.forEach(item => item.classList.toggle('selected', item === button));
        });
    });

    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    qtyMinus?.addEventListener('click', () => {
        const current = parseInt(qtyInput.value || '1');
        if (current > 1) qtyInput.value = current - 1;
    });

    qtyPlus?.addEventListener('click', () => {
        const current = parseInt(qtyInput.value || '1');
        if (current < product.stock) qtyInput.value = current + 1;
    });

    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
        if (window.cart) {
            window.cart.addItem(product, parseInt(qtyInput.value || '1'));
        }
    });

    document.getElementById('wishlist-btn')?.addEventListener('click', () => {
        if (window.cart) {
            window.cart.toggleWishlist(product.id);
            const icon = document.querySelector('#wishlist-btn i');
            if (icon) {
                const isActive = window.cart.isWishlisted(product.id);
                icon.classList.toggle('fas', isActive);
                icon.classList.toggle('far', !isActive);
            }
        }
    });

    loading.style.display = 'none';
    content.classList.remove('hidden');

    const relatedContainer = document.getElementById('related-container');
    const relatedGrid = document.getElementById('related-grid');
    if (relatedContainer && relatedGrid) {
        const related = window.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        if (related.length > 0) {
            relatedGrid.innerHTML = related.map(p => `
                <div class="card product-card">
                    <a href="/product.html?id=${p.id}" style="display:block;">
                        <div class="card-img-wrap">
                            <img src="${p.image}" loading="lazy" alt="${p.name}">
                        </div>
                    </a>
                    <div class="card-body">
                        <span class="product-category">${p.subcategory}</span>
                        <a href="/product.html?id=${p.id}" class="product-title">${p.name}</a>
                        <div class="product-price-row">
                            <span class="price-current">${window.formatCurrency(p.price)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            relatedContainer.classList.remove('hidden');
        }
    }
});
