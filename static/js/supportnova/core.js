/**
 * supportnova/core.js — SupportNova Core Utilities
 *
 * Shared utility functions used across all SupportNova pages.
 * Does NOT contain business logic — only UI helpers.
 */

(function (SN) {
  'use strict';

  // ── Status & Badge Helpers ───────────────────────────────────

  /**
   * Returns CSS class for a given complaint status string.
   * BACKEND INTEGRATION: status values must match SRS vocabulary.
   */
  SN.statusClass = function (status) {
    const map = {
      'New':               'sn-status-new',
      'Analyzed':          'sn-status-analyzed',
      'Assigned':          'sn-status-assigned',
      'In Progress':       'sn-status-inprogress',
      'Awaiting Customer': 'sn-status-awaiting',
      'Escalated':         'sn-status-escalated',
      'Resolved':          'sn-status-resolved',
      'Closed':            'sn-status-closed',
      'Reopened':          'sn-status-reopened',
    };
    return map[status] || 'sn-status-new';
  };

  SN.statusBadge = function (status) {
    return `<span class="sn-badge ${SN.statusClass(status)}">${status || '—'}</span>`;
  };

  SN.priorityClass = function (priority) {
    const map = {
      'Critical': 'sn-priority-critical',
      'High':     'sn-priority-high',
      'Medium':   'sn-priority-medium',
      'Low':      'sn-priority-low',
    };
    return map[priority] || 'sn-priority-low';
  };

  SN.priorityBadge = function (priority) {
    const icons = {
      'Critical': 'fa-triangle-exclamation',
      'High':     'fa-arrow-up',
      'Medium':   'fa-minus',
      'Low':      'fa-arrow-down',
    };
    const icon = icons[priority] || 'fa-minus';
    return `<span class="sn-badge ${SN.priorityClass(priority)}"><i class="fas ${icon}"></i> ${priority || '—'}</span>`;
  };

  SN.sentimentClass = function (sentiment) {
    const map = {
      'Positive': 'sn-sentiment-positive',
      'Neutral':  'sn-sentiment-neutral',
      'Negative': 'sn-sentiment-negative',
      'Furious':  'sn-sentiment-furious',
    };
    return map[sentiment] || 'sn-sentiment-neutral';
  };

  SN.sentimentBadge = function (sentiment) {
    const icons = {
      'Positive': 'fa-smile',
      'Neutral':  'fa-meh',
      'Negative': 'fa-frown',
      'Furious':  'fa-angry',
    };
    const icon = icons[sentiment] || 'fa-meh';
    return `<span class="sn-badge ${SN.sentimentClass(sentiment)}"><i class="fas ${icon}"></i> ${sentiment || '—'}</span>`;
  };

  SN.validationBadge = function (status) {
    const map = {
      'PASS':    { cls: 'sn-badge-pass',    icon: 'fa-check-circle',     label: 'Pass' },
      'FAIL':    { cls: 'sn-badge-fail',    icon: 'fa-times-circle',     label: 'Fail' },
      'WARNING': { cls: 'sn-badge-warning', icon: 'fa-exclamation-triangle', label: 'Warning' },
    };
    const v = map[status] || { cls: 'sn-badge-warning', icon: 'fa-question-circle', label: status || '—' };
    return `<span class="sn-badge ${v.cls}"><i class="fas ${v.icon}"></i> ${v.label}</span>`;
  };

  SN.verificationBadge = function (status) {
    const map = {
      'Verified':                { cls: 'sn-badge-pass',   icon: 'fa-shield-check',     label: 'Verified' },
      'Manual Review Required':  { cls: 'sn-badge-review', icon: 'fa-user-check',       label: 'Manual Review' },
      'Partial Match':           { cls: 'sn-badge-warning',icon: 'fa-exclamation-triangle', label: 'Partial Match' },
      'Mismatch':                { cls: 'sn-badge-fail',   icon: 'fa-times-circle',     label: 'Mismatch' },
    };
    const v = map[status] || { cls: 'sn-badge-warning', icon: 'fa-question-circle', label: status || '—' };
    return `<span class="sn-badge ${v.cls}"><i class="fas ${v.icon}"></i> ${v.label}</span>`;
  };

  // ── Date Formatting ──────────────────────────────────────────

  SN.formatDate = function (isoStr) {
    if (!isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch (e) { return '—'; }
  };

  SN.formatDateTime = function (isoStr) {
    if (!isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) { return '—'; }
  };

  SN.timeAgo = function (isoStr) {
    if (!isoStr) return '—';
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)   return 'just now';
    if (mins < 60)  return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)   return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  // ── DOM Helpers ──────────────────────────────────────────────

  SN.$ = function (selector, parent) {
    return (parent || document).querySelector(selector);
  };

  SN.$$ = function (selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  };

  SN.el = function (tag, attrs, inner) {
    const e = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => { if (k === 'class') e.className = v; else e.setAttribute(k, v); });
    if (inner !== undefined) e.innerHTML = inner;
    return e;
  };

  // ── Toast System ─────────────────────────────────────────────

  SN.toast = function (message, type) {
    type = type || 'info';
    let container = document.getElementById('sn-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sn-toast-container';
      container.className = 'sn-toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `sn-toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // ── Modal System ─────────────────────────────────────────────

  SN.openModal = function (id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  SN.closeModal = function (id) {
    const overlay = document.getElementById(id);
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close on overlay click
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('sn-modal-overlay')) {
      e.target.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (e.target.dataset.snClose) {
      SN.closeModal(e.target.dataset.snClose);
    }
  });

  // ── Sidebar Mobile Toggle ────────────────────────────────────

  SN.initSidebar = function () {
    const toggle = document.getElementById('sn-menu-toggle');
    const sidebar = document.getElementById('sn-sidebar');
    const overlay = document.getElementById('sn-sidebar-overlay');

    if (!toggle || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (overlay) overlay.addEventListener('click', closeSidebar);
  };

  // ── Tab System ───────────────────────────────────────────────

  SN.initTabs = function (containerSelector) {
    const containers = containerSelector
      ? document.querySelectorAll(containerSelector)
      : document.querySelectorAll('[data-sn-tabs]');

    containers.forEach(function (container) {
      const tabs = container.querySelectorAll('.sn-tab');
      const contents = container.querySelectorAll('.sn-tab-content');

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          const target = tab.dataset.tab;
          if (target) {
            const content = container.querySelector(`[data-tab-content="${target}"]`);
            if (content) content.classList.add('active');
          }
        });
      });
    });
  };

  // ── Comparison Table Builder ─────────────────────────────────

  /**
   * Builds an AI vs Rule Engine comparison table row.
   * BACKEND INTEGRATION: fields come from AI recommendation + validation result.
   */
  SN.buildComparisonRow = function (field, aiVal, ruleVal) {
    const match = (aiVal || '').toLowerCase() === (ruleVal || '').toLowerCase();
    const matchIcon = match
      ? '<span class="sn-cmp-match"><i class="fas fa-check"></i></span>'
      : '<span class="sn-cmp-mismatch"><i class="fas fa-times"></i></span>';
    return `
      <tr>
        <td class="sn-cmp-field">${field}</td>
        <td class="sn-cmp-ai">${aiVal || '—'}</td>
        <td class="sn-cmp-rule">${ruleVal || '—'}</td>
        <td>${matchIcon}</td>
      </tr>
    `;
  };

  // ── Filter System ────────────────────────────────────────────

  /**
   * Generic client-side filter for any array of objects.
   * BACKEND INTEGRATION: replace with API call when backend filtering is ready.
   * Accepts a predicate function (item) => boolean.
   */
  SN.filterItems = function (items, predicate) {
    return items.filter(predicate);
  };

  SN.searchItems = function (items, query, fields) {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      fields.some(f => String(item[f] || '').toLowerCase().includes(q))
    );
  };

  // ── Pagination ───────────────────────────────────────────────

  SN.paginate = function (items, page, perPage) {
    page = page || 1;
    perPage = perPage || 20;
    const start = (page - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      total: items.length,
      page: page,
      perPage: perPage,
      totalPages: Math.ceil(items.length / perPage),
    };
  };

  // ── Chart Placeholder Renderer ───────────────────────────────
  /**
   * Renders a visual bar chart using pure CSS/SVG-like approach.
   * BACKEND INTEGRATION: Replace with a real chart library (Chart.js, etc.)
   * once confirmed by the team. This keeps the UI functional without deps.
   */
  SN.renderBarChart = function (containerId, data, options) {
    const container = document.getElementById(containerId);
    if (!container) return;
    options = options || {};

    const max = Math.max(...data.map(d => d.count || d.value || 0));
    const barColor = options.color || '#4F7FFF';

    let html = '<div style="display:flex;align-items:flex-end;gap:8px;height:160px;width:100%;padding:0 8px;">';
    data.forEach(function (d) {
      const val = d.count || d.value || 0;
      const pct = max > 0 ? Math.round((val / max) * 100) : 0;
      html += `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end;">
          <span style="font-size:0.65rem;color:#6B7280;font-weight:600;">${val}</span>
          <div style="width:100%;background:${d.color || barColor};border-radius:4px 4px 0 0;height:${pct}%;min-height:4px;transition:height 0.4s ease;"></div>
          <span style="font-size:0.6rem;color:#6B7280;text-align:center;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${d.label}</span>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  };

  SN.renderLineChart = function (containerId, data, options) {
    const container = document.getElementById(containerId);
    if (!container) return;
    options = options || {};

    const vals = data.map(d => d.total || d.value || 0);
    const max = Math.max(...vals) || 1;
    const w = 400, h = 140, pad = 20;
    const step = (w - pad * 2) / Math.max(vals.length - 1, 1);

    const points = vals.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v / max) * (h - pad * 2));
      return `${x},${y}`;
    }).join(' ');

    const fill = vals.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v / max) * (h - pad * 2));
      return `${x},${y}`;
    });
    fill.push(`${pad + (vals.length - 1) * step},${h - pad}`, `${pad},${h - pad}`);

    const svg = `
      <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:140px;">
        <defs>
          <linearGradient id="lg-${containerId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4F7FFF" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#4F7FFF" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <polygon points="${fill.join(' ')}" fill="url(#lg-${containerId})"/>
        <polyline points="${points}" fill="none" stroke="#4F7FFF" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        ${vals.map((v, i) => {
          const x = pad + i * step;
          const y = h - pad - ((v / max) * (h - pad * 2));
          return `<circle cx="${x}" cy="${y}" r="3.5" fill="#4F7FFF"/>`;
        }).join('')}
        ${data.map((d, i) => {
          const x = pad + i * step;
          return `<text x="${x}" y="${h - 4}" text-anchor="middle" font-size="8" fill="#9CA3AF">${d.period || d.label || ''}</text>`;
        }).join('')}
      </svg>`;
    container.innerHTML = svg;
  };

  SN.renderDonutChart = function (containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = data.reduce((s, d) => s + (d.count || 0), 0) || 1;
    const r = 60, cx = 80, cy = 70, strokeW = 22;
    const circ = 2 * Math.PI * r;

    let offset = 0;
    const arcs = data.map(function (d) {
      const pct = (d.count || 0) / total;
      const arc = `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
          stroke="${d.color || '#4F7FFF'}"
          stroke-width="${strokeW}"
          stroke-dasharray="${pct * circ} ${circ}"
          stroke-dashoffset="${-offset * circ}"
          transform="rotate(-90 ${cx} ${cy})"
          opacity="0.9"/>
      `;
      offset += pct;
      return arc;
    });

    const legend = data.slice(0, 5).map(d =>
      `<div style="display:flex;align-items:center;gap:6px;font-size:0.7rem;color:#374151;">
         <span style="width:10px;height:10px;border-radius:50%;background:${d.color || '#4F7FFF'};flex-shrink:0;"></span>
         <span>${d.label}</span>
         <span style="margin-left:auto;font-weight:700;color:#111827;">${d.count}</span>
       </div>`
    ).join('');

    container.innerHTML = `
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <svg viewBox="0 0 160 140" style="width:160px;height:140px;flex-shrink:0;">
          ${arcs.join('')}
          <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="18" font-weight="800" fill="#111827">${total.toLocaleString()}</text>
          <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-size="8" fill="#6B7280">Total</text>
        </svg>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">${legend}</div>
      </div>`;
  };

  // ── Auto-init on DOM ready ───────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    SN.initSidebar();
    SN.initTabs();
  });

})(window.SN = window.SN || {});
