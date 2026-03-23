/* ========================================
   3D Print Shop - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ========================================
  // Mobile Menu Toggle
  // ========================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  const header = document.querySelector('.header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ========================================
  // Search Overlay
  // ========================================
  const searchBtn = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      searchOverlay.classList.add('active');
      const input = searchOverlay.querySelector('input');
      if (input) setTimeout(function () { input.focus(); }, 300);
    });

    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', function () {
        searchOverlay.classList.remove('active');
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
      }
    });
  }

  // ========================================
  // FAQ Accordion
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ========================================
  // Smooth Scrolling for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // Cart Functionality (localStorage)
  // ========================================
  var cart = JSON.parse(localStorage.getItem('cart3d') || '[]');

  var cartToggle = document.querySelector('.cart-toggle');
  var cartOverlay = document.querySelector('.cart-overlay');
  var cartDrawer = document.querySelector('.cart-drawer');
  var cartClose = document.querySelector('.cart-close');
  var cartItemsContainer = document.querySelector('.cart-items');
  var cartCountElements = document.querySelectorAll('.cart-count');
  var cartTotalPrice = document.querySelector('.cart-total-price');
  var cartWhatsAppBtn = document.querySelector('.cart-footer .btn-whatsapp');

  function saveCart() {
    localStorage.setItem('cart3d', JSON.stringify(cart));
  }

  function updateCartUI() {
    var totalQty = 0;
    var total = 0;
    cart.forEach(function (item) {
      totalQty += item.qty;
      total += item.price * item.qty;
    });

    // Update count badges
    cartCountElements.forEach(function (el) {
      el.textContent = totalQty;
      el.style.display = totalQty > 0 ? 'flex' : 'none';
    });

    // Update drawer content
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Seu carrinho está vazio</p></div>';
      } else {
        var html = '';
        cart.forEach(function (item, index) {
          var imgHtml = '<div class="product-image-placeholder ' + (item.gradient || 'gradient-1') + '" style="width:64px;height:64px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:rgba(255,255,255,0.8)"><i class="' + (item.icon || 'fas fa-cube') + '"></i></div>';
          if (item.image) {
            imgHtml = '<img src="images/' + item.image + '" alt="' + item.name + '" style="width:64px;height:64px;border-radius:8px;object-fit:cover" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
              '<div class="product-image-placeholder ' + (item.gradient || 'gradient-1') + '" style="width:64px;height:64px;border-radius:8px;display:none;align-items:center;justify-content:center;font-size:1.25rem;color:rgba(255,255,255,0.8)"><i class="' + (item.icon || 'fas fa-cube') + '"></i></div>';
          }
          html += '<div class="cart-item" style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid #eee">' +
            '<div class="cart-item-image" style="flex-shrink:0">' + imgHtml + '</div>' +
            '<div class="cart-item-info" style="flex:1;min-width:0">' +
              '<div class="cart-item-name" style="font-weight:600;font-size:0.9rem;margin-bottom:4px">' + item.name + '</div>' +
              '<div class="cart-item-price" style="color:var(--primary);font-weight:700;font-size:0.9rem">R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '</div>' +
              '<div style="display:flex;align-items:center;gap:8px;margin-top:6px">' +
                '<div style="display:flex;align-items:center;border:1px solid #ddd;border-radius:6px;overflow:hidden">' +
                  '<button class="cart-qty-btn" data-index="' + index + '" data-action="minus" style="width:28px;height:28px;border:none;background:#f5f5f5;cursor:pointer;font-size:0.9rem">−</button>' +
                  '<span style="width:28px;text-align:center;font-size:0.85rem;font-weight:600">' + item.qty + '</span>' +
                  '<button class="cart-qty-btn" data-index="' + index + '" data-action="plus" style="width:28px;height:28px;border:none;background:#f5f5f5;cursor:pointer;font-size:0.9rem">+</button>' +
                '</div>' +
                '<button class="cart-item-remove" data-index="' + index + '" style="color:#e74c3c;font-size:0.8rem;border:none;background:none;cursor:pointer;margin-left:auto"><i class="fas fa-trash"></i></button>' +
              '</div>' +
            '</div>' +
          '</div>';
        });
        cartItemsContainer.innerHTML = html;

        // Bind quantity buttons
        cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(this.dataset.index);
            if (this.dataset.action === 'plus') {
              cart[idx].qty++;
            } else {
              cart[idx].qty--;
              if (cart[idx].qty <= 0) cart.splice(idx, 1);
            }
            saveCart();
            updateCartUI();
          });
        });

        // Bind remove buttons
        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            cart.splice(parseInt(this.dataset.index), 1);
            saveCart();
            updateCartUI();
          });
        });
      }

      // Update total
      if (cartTotalPrice) {
        cartTotalPrice.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
      }

      // Update WhatsApp checkout link
      if (cartWhatsAppBtn && cart.length > 0) {
        var msg = 'Olá! Gostaria de finalizar meu pedido:\n\n';
        cart.forEach(function (item) {
          msg += '• ' + item.name + ' (x' + item.qty + ') - R$ ' + (item.price * item.qty).toFixed(2).replace('.', ',') + '\n';
        });
        msg += '\n*Total: R$ ' + total.toFixed(2).replace('.', ',') + '*\n\nAguardo confirmação!';
        cartWhatsAppBtn.href = 'https://wa.me/5511999999999?text=' + encodeURIComponent(msg);
      }
    }
  }

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('active');
    if (cartDrawer) cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('active');
    if (cartDrawer) cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', function (e) {
      e.preventDefault();
      openCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
  }

  // Global function to add item to cart (used by loja.js and produto.html)
  window.addToCart = function (product) {
    // Check if already in cart
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === product.id) {
        existing = cart[i];
        break;
      }
    }
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        gradient: product.gradient || 'gradient-1',
        icon: product.icon || 'fas fa-cube',
        qty: 1
      });
    }
    saveCart();
    updateCartUI();
    openCart();
  };

  // Fallback: add-to-cart buttons already in HTML (index.html hardcoded cards)
  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var card = this.closest('.product-card');
      if (!card) return;

      var nameEl = card.querySelector('.product-name') || card.querySelector('h3');
      var name = nameEl ? nameEl.textContent.trim() : 'Produto';

      var priceEl = card.querySelector('.product-price');
      var price = 29.90;
      if (priceEl) {
        var priceMatch = priceEl.textContent.match(/R\$\s*([\d.,]+)/);
        if (priceMatch) price = parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) || 29.90;
      }

      var link = card.querySelector('a[href*="produto.html?id="]');
      var id = 0;
      if (link) {
        var idMatch = link.href.match(/id=(\d+)/);
        if (idMatch) id = parseInt(idMatch[1]);
      }

      var imgEl = card.querySelector('.product-img');
      var image = imgEl ? imgEl.getAttribute('src').replace('images/', '') : '';

      var placeholder = card.querySelector('.product-image-placeholder');
      var gradient = 'gradient-1';
      var icon = 'fas fa-cube';
      if (placeholder) {
        var classes = placeholder.className.split(' ');
        for (var i = 0; i < classes.length; i++) {
          if (classes[i].indexOf('gradient-') === 0) gradient = classes[i];
        }
        var iconEl = placeholder.querySelector('i');
        if (iconEl) icon = iconEl.className;
      }

      window.addToCart({ id: id, name: name, price: price, image: image, gradient: gradient, icon: icon });

      // Animation feedback
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
      this.style.background = '#00b894';
      var self = this;
      setTimeout(function () {
        self.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar';
        self.style.background = '';
      }, 1500);
    });
  });

  // Initialize cart UI
  updateCartUI();

  // ========================================
  // Product Image Gallery (Product Page)
  // ========================================
  const galleryThumbs = document.querySelectorAll('.product-thumb');
  const galleryMain = document.querySelector('.product-gallery-main .product-image-placeholder');

  if (galleryThumbs.length > 0 && galleryMain) {
    galleryThumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        galleryThumbs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        var newGradient = this.dataset.gradient;
        var newIcon = this.dataset.icon;

        galleryMain.className = 'product-image-placeholder ' + newGradient;
        var iconEl = galleryMain.querySelector('i');
        if (iconEl && newIcon) {
          iconEl.className = newIcon;
        }
      });
    });
  }

  // ========================================
  // Product Tabs (Product Page)
  // ========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });

      this.classList.add('active');
      var target = document.querySelector(this.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // ========================================
  // Color Option Selector (Product Page)
  // ========================================
  document.querySelectorAll('.color-option').forEach(function (option) {
    option.addEventListener('click', function () {
      this.closest('.color-options').querySelectorAll('.color-option').forEach(function (o) {
        o.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  // ========================================
  // Filter Sidebar Mobile Toggle
  // ========================================
  const filterToggle = document.querySelector('.filter-toggle-mobile');
  const filterSidebar = document.querySelector('.filter-sidebar');

  if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', function () {
      filterSidebar.classList.toggle('filter-sidebar-mobile-hidden');
      filterSidebar.classList.toggle('filter-sidebar-mobile-visible');
    });
  }

  // ========================================
  // Scroll Animations (Fade In)
  // ========================================
  const fadeElements = document.querySelectorAll('.fade-in');
  const staggerItems = document.querySelectorAll('.stagger-item');

  function checkVisibility() {
    var windowHeight = window.innerHeight;

    fadeElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });

    staggerItems.forEach(function (el, index) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        setTimeout(function () {
          el.classList.add('visible');
        }, index * 100);
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  checkVisibility(); // Run on load

  // ========================================
  // Counter Animation
  // ========================================
  const counters = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    counters.forEach(function (counter) {
      var rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        countersAnimated = true;
        var target = parseInt(counter.dataset.target) || 0;
        var current = 0;
        var increment = Math.ceil(target / 60);
        var timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = current.toLocaleString('pt-BR') + '+';
        }, 30);
      }
    });
  }

  if (counters.length > 0) {
    window.addEventListener('scroll', animateCounters);
    animateCounters();
  }

  // ========================================
  // Mobile Submenu Toggle
  // ========================================
  const mobileSubmenus = document.querySelectorAll('.mobile-submenu-toggle');
  mobileSubmenus.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var submenu = this.nextElementSibling;
      if (submenu) {
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
        var icon = this.querySelector('i.fa-chevron-down, i.fa-chevron-up');
        if (icon) {
          icon.classList.toggle('fa-chevron-down');
          icon.classList.toggle('fa-chevron-up');
        }
      }
    });
  });

  // ========================================
  // Contact Form Handler
  // ========================================
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var subject = document.getElementById('subject');
      var assunto = subject.options[subject.selectedIndex].text;
      var message = document.getElementById('message').value.trim();

      var msg = 'Olá! Vim pelo site e gostaria de entrar em contato.\n\n';
      msg += '*Nome:* ' + nome + '\n';
      if (email) msg += '*E-mail:* ' + email + '\n';
      if (phone) msg += '*WhatsApp:* ' + phone + '\n';
      msg += '*Assunto:* ' + assunto + '\n';
      msg += '*Mensagem:* ' + message;

      window.open('https://wa.me/5511999999999?text=' + encodeURIComponent(msg), '_blank');

      var submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Redirecionado ao WhatsApp!';
      submitBtn.style.background = '#00b894';
      setTimeout(function () {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        submitBtn.style.background = '';
      }, 3000);
    });
  }

});
