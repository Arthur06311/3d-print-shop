/* ========================================
   Loja - Search, Filter & Render Engine
   ======================================== */

(function () {
  'use strict';

  // State
  let allProducts = [];
  let filteredProducts = [];
  let currentAudience = 'all';
  let currentCategory = 'all';
  let currentPrice = 'all';
  let currentSort = 'popular';
  let searchQuery = '';

  // DOM elements
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const noResults = document.getElementById('noResults');
  const totalCount = document.getElementById('totalCount');
  const categoryFilters = document.getElementById('categoryFilters');
  const sortSelect = document.getElementById('sortSelect');
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const filtersPanel = document.getElementById('filtersPanel');
  const clearFiltersBtn = document.getElementById('clearFilters');

  // ========================================
  // Initialize
  // ========================================
  function init() {
    if (typeof PRODUTOS === 'undefined') return;
    allProducts = PRODUTOS;

    // Check if a category was pre-selected from categoria.html
    var savedCat = localStorage.getItem('filterCat');
    if (savedCat) {
      currentCategory = savedCat;
      localStorage.removeItem('filterCat');
    }

    buildCategoryFilters();
    applyFilters();
    bindEvents();
  }

  // ========================================
  // Build category filter chips
  // ========================================
  function buildCategoryFilters() {
    const cats = {};
    allProducts.forEach(p => {
      if (!cats[p.category]) cats[p.category] = 0;
      cats[p.category]++;
    });

    let html = '<button class="filter-chip' + (currentCategory === 'all' ? ' active' : '') + '" data-filter="all">Todas <span class="chip-count">' + allProducts.length + '</span></button>';
    Object.keys(cats).sort().forEach(cat => {
      html += '<button class="filter-chip' + (currentCategory === cat ? ' active' : '') + '" data-filter="' + cat + '">' + cat + ' <span class="chip-count">' + cats[cat] + '</span></button>';
    });
    categoryFilters.innerHTML = html;

    // Bind clicks
    categoryFilters.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', function () {
        categoryFilters.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.filter;
        applyFilters();
      });
    });
  }

  // ========================================
  // Bind Events
  // ========================================
  function bindEvents() {
    // Search
    let debounce;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
        applyFilters();
      }, 200);
    });

    clearSearchBtn.addEventListener('click', function () {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });

    // Audience filters
    document.getElementById('audienceFilters').querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', function () {
        document.getElementById('audienceFilters').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentAudience = this.dataset.filter;
        applyFilters();
      });
    });

    // Price filters
    document.getElementById('priceFilters').querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', function () {
        document.getElementById('priceFilters').querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentPrice = this.dataset.filter;
        applyFilters();
      });
    });

    // Sort
    sortSelect.addEventListener('change', function () {
      currentSort = this.value;
      applyFilters();
    });

    // Mobile filter toggle
    if (mobileFilterBtn) {
      mobileFilterBtn.addEventListener('click', function () {
        filtersPanel.classList.toggle('active');
        document.body.style.overflow = filtersPanel.classList.contains('active') ? 'hidden' : '';
      });
    }

    // Clear all filters
    clearFiltersBtn.addEventListener('click', function () {
      clearAllFilters();
    });

    // Keyboard shortcut: Ctrl/Cmd + K to focus search
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      // Escape to close mobile filters
      if (e.key === 'Escape' && filtersPanel.classList.contains('active')) {
        filtersPanel.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ========================================
  // Apply all filters
  // ========================================
  function applyFilters() {
    filteredProducts = allProducts.filter(function (p) {
      // Audience
      if (currentAudience !== 'all' && p.audience !== currentAudience) return false;

      // Category
      if (currentCategory !== 'all' && p.category !== currentCategory) return false;

      // Price
      if (currentPrice !== 'all') {
        var price = p.price;
        if (currentPrice === '0-30' && price > 30) return false;
        if (currentPrice === '30-60' && (price < 30 || price > 60)) return false;
        if (currentPrice === '60-100' && (price < 60 || price > 100)) return false;
        if (currentPrice === '100+' && price < 100) return false;
      }

      // Search
      if (searchQuery) {
        var q = searchQuery;
        var searchable = (p.name + ' ' + p.category + ' ' + p.description + ' ' + p.creator + ' ' + p.audience + ' ' + (p.tags || []).join(' ')).toLowerCase();
        // Support multiple terms
        var terms = q.split(/\s+/);
        for (var i = 0; i < terms.length; i++) {
          if (searchable.indexOf(terms[i]) === -1) return false;
        }
      }

      return true;
    });

    // Sort
    filteredProducts.sort(function (a, b) {
      switch (currentSort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'popular': return (b.popular || 0) - (a.popular || 0);
        default: return a.name.localeCompare(b.name, 'pt-BR');
      }
    });

    render();
  }

  // ========================================
  // Render products
  // ========================================
  function render() {
    totalCount.textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
      grid.innerHTML = '';
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    var html = '';
    filteredProducts.forEach(function (p) {
      var badgeHtml = '';
      if (p.badge) {
        var badgeClass = p.badge === 'Mais Vendido' ? 'badge-bestseller' : p.badge === 'Novo' ? 'badge-new' : p.badge === 'Personalizável' ? 'badge-custom' : 'badge-order';
        badgeHtml = '<span class="product-badge ' + badgeClass + '">' + p.badge + '</span>';
      }
      var prodLink = 'produto.html?id=' + p.id;

      html += '<div class="product-card">' +
        '<a href="' + prodLink + '" class="product-image">' +
          '<img src="images/' + p.image + '" alt="' + p.name + '" class="product-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
          '<div class="product-image-placeholder ' + (p.gradient || 'gradient-1') + '" style="display:none"><i class="' + (p.icon || 'fas fa-cube') + '"></i></div>' +
          badgeHtml +
        '</a>' +
        '<div class="product-info">' +
          '<a href="' + prodLink + '"><h3 class="product-name">' + p.name + '</h3></a>' +
          '<div class="product-price">R$ ' + p.price.toFixed(2).replace('.', ',') + '</div>' +
          '<button class="btn btn-primary btn-sm btn-block add-to-cart"><i class="fas fa-shopping-cart"></i> Comprar</button>' +
        '</div>' +
      '</div>';
    });

    grid.innerHTML = html;

    // Re-bind add-to-cart buttons
    grid.querySelectorAll('.add-to-cart').forEach(function (btn, index) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var product = filteredProducts[index];
        if (product && window.addToCart) {
          window.addToCart(product);
        }
        this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        this.style.background = '#00b894';
        var self = this;
        setTimeout(function () {
          self.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar';
          self.style.background = '';
        }, 1500);
      });
    });
  }

  // ========================================
  // Clear all filters (global)
  // ========================================
  window.clearAllFilters = function () {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    currentAudience = 'all';
    currentCategory = 'all';
    currentPrice = 'all';
    currentSort = 'name';
    sortSelect.value = 'name';

    // Reset all chips
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.classList.remove('active');
    });
    document.querySelectorAll('.filter-chip[data-filter="all"]').forEach(function (chip) {
      chip.classList.add('active');
    });

    // Close mobile filters
    filtersPanel.classList.remove('active');
    document.body.style.overflow = '';

    applyFilters();
  };

  // Run
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
