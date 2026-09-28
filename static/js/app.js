/* app.js - VoltCart Global Logic */

document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Active Nav State
    const currentUrl = new URL(window.location.href);
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkUrl = new URL(href, window.location.origin);
        const isDealsLink = linkUrl.searchParams.get('category') === 'Deals';
        const isDealsPage = currentUrl.searchParams.get('category') === 'Deals';
        const isMatchingRoute = linkUrl.pathname === currentUrl.pathname;
        const isMatchingCategory = isDealsLink ? isDealsPage : !(linkUrl.pathname === '/shop.html' && isDealsPage);
        if (isMatchingRoute && isMatchingCategory) {
            link.classList.add('active');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Search Form Handler
    const searchForm = document.getElementById('nav-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchForm.querySelector('input').value;
            if (query.trim()) {
                window.location.href = `/shop.html?q=${encodeURIComponent(query.trim())}`;
            }
        });
    }
});

// Toast Notification System
window.showToast = function(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    const icon = type === 'success' ? '<i class="fas fa-check-circle text-spark"></i>' : '<i class="fas fa-exclamation-circle text-coral"></i>';
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
};

// Utility: Format Currency for international storefront pricing
window.formatCurrency = function(amount) {
    const value = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};
