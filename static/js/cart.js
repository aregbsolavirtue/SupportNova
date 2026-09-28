/* cart.js - VoltCart Shopping Cart Logic */

class Cart {
    constructor() {
        this.items = [];
        this.wishlist = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.loadWishlist();
        this.setupEventListeners();
        this.updateUI();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem('voltcart_cart');
            this.items = savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            this.items = [];
        }
    }

    loadWishlist() {
        try {
            const saved = localStorage.getItem('voltcart_wishlist');
            this.wishlist = saved ? JSON.parse(saved) : [];
        } catch (error) {
            this.wishlist = [];
        }
    }

    saveCart() {
        localStorage.setItem('voltcart_cart', JSON.stringify(this.items));
        this.updateUI();
    }

    saveWishlist() {
        localStorage.setItem('voltcart_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistUI();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        if (window.showToast) {
            window.showToast(`${product.name} added to your cart.`);
        }
        this.openDrawer();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.saveCart();
            }
        }
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    isWishlisted(productId) {
        return this.wishlist.includes(productId);
    }

    toggleWishlist(productId) {
        if (this.isWishlisted(productId)) {
            this.wishlist = this.wishlist.filter(id => id !== productId);
            if (window.showToast) window.showToast('Removed from wishlist.');
        } else {
            this.wishlist.push(productId);
            if (window.showToast) window.showToast('Saved to your wishlist.');
        }
        this.saveWishlist();
    }

    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTotalCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    setupEventListeners() {
        const toggleBtn = document.getElementById('cart-toggle-btn');
        const closeBtn = document.getElementById('cart-close-btn');
        const overlay = document.getElementById('cart-overlay');

        if (toggleBtn) toggleBtn.addEventListener('click', () => this.openDrawer());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
        if (overlay) overlay.addEventListener('click', () => this.closeDrawer());

        window.cart = this;
    }

    openDrawer() {
        document.getElementById('cart-drawer')?.classList.add('active');
        document.getElementById('cart-overlay')?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeDrawer() {
        document.getElementById('cart-drawer')?.classList.remove('active');
        document.getElementById('cart-overlay')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateWishlistUI() {
        document.querySelectorAll('.wishlist-btn').forEach(button => {
            const productId = Number(button.dataset.productId);
            const isActive = this.isWishlisted(productId);
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-label', isActive ? 'Remove from wishlist' : 'Add to wishlist');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.toggle('fas', isActive);
                icon.classList.toggle('far', !isActive);
            }
        });
    }

    updateUI() {
        const countEls = document.querySelectorAll('#cart-count');
        const totalCount = this.getTotalCount();
        countEls.forEach(el => el.textContent = totalCount);

        const container = document.getElementById('cart-items-container');
        if (container) {
            if (this.items.length === 0) {
                container.innerHTML = `
                    <div class="empty-state" style="box-shadow:none; background:transparent;">
                        <i class="fas fa-shopping-cart icon"></i>
                        <h4>Your cart is empty</h4>
                        <p>Looks like you haven't added any items yet.</p>
                        <a href="/shop.html" class="btn btn-primary" onclick="window.cart.closeDrawer()">Start Shopping</a>
                    </div>
                `;
            } else {
                container.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${window.formatCurrency(item.price)}</div>
                            <div class="cart-item-actions">
                                <div class="quantity-selector" style="transform: scale(0.8); transform-origin: left center;">
                                    <button onclick="window.cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                    <input type="text" value="${item.quantity}" readonly>
                                    <button onclick="window.cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                                <button class="cart-item-remove" onclick="window.cart.removeItem(${item.id})">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        const subtotalEl = document.getElementById('cart-subtotal-price');
        if (subtotalEl) {
            subtotalEl.textContent = window.formatCurrency(this.getSubtotal());
        }

        this.updateWishlistUI();
        window.dispatchEvent(new Event('cartUpdated'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Cart();
});
