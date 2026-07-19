document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initSideDrawer();
  initHeaderScroll();
  initScrollReveal();
  initSmoothScroll();
  initLazyLoading();
  initQuickView();
  initStatsCounter();
  initParallax();
});

/**
 * Announcement Bar Close Behavior with localStorage persistence
 */
function initAnnouncementBar() {
  const bar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-close');
  
  if (!bar || !closeBtn) return;
  
  // Check if user previously closed it
  const isClosed = localStorage.getItem('announcement-closed');
  if (isClosed === 'true') {
    bar.classList.add('hidden');
    document.body.classList.add('announcement-closed');
  }
  
  closeBtn.addEventListener('click', () => {
    bar.classList.add('hidden');
    document.body.classList.add('announcement-closed');
    localStorage.setItem('announcement-closed', 'true');
  });
}

/**
 * Side Drawer Navigation Toggle with Body Scroll-Lock
 */
function initSideDrawer() {
  const hamburger = document.querySelector('.hamburger-btn');
  const drawer = document.querySelector('.side-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close');
  
  if (!hamburger || !drawer || !overlay || !closeBtn) return;
  
  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Scroll lock
  };
  
  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };
  
  hamburger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  
  // Close drawer on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });
}

/**
 * Header shadow on scroll down past 100px
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  // Run on load in case the page is already scrolled
  handleScroll();
}

/**
 * Scroll Reveal Animation with Grid Staggering
 */
function initScrollReveal() {
  // Setup stagger delay for grid children if parent has data-stagger
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const reveals = container.querySelectorAll('.reveal');
    reveals.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.12}s`;
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, no need to watch it anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }
}

/**
 * Smooth Scroll to anchor links with Sticky Header offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      e.preventDefault();
      
      const header = document.querySelector('.main-header');
      const headerOffset = header ? header.offsetHeight : 72;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/**
 * Image Lazy Loading with CSS Fade-In
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.onload = () => {
            image.classList.add('loaded');
          };
          imageObserver.unobserve(image);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px'
    });
    
    lazyImages.forEach(img => {
      img.classList.add('lazy-image-transition');
      imageObserver.observe(img);
    });
  } else {
    // Fallback
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

/**
 * Quick View Product Modal Skeleton Logic
 */
function initQuickView() {
  const modal = document.querySelector('.quick-view-modal');
  const closeBtn = document.querySelector('.quick-view-close');
  const overlay = document.querySelector('.quick-view-overlay');
  
  if (!modal || !closeBtn || !overlay) return;
  
  const openModal = (productData) => {
    // Populate modal elements if elements are present
    const modalTitle = modal.querySelector('.quick-view-title');
    const modalPrice = modal.querySelector('.quick-view-price');
    const modalImg = modal.querySelector('.quick-view-img');
    const modalMaterial = modal.querySelector('.quick-view-material');
    
    if (modalTitle && productData.name) modalTitle.textContent = productData.name;
    if (modalPrice && productData.price) modalPrice.textContent = productData.price;
    if (modalMaterial && productData.material) modalMaterial.textContent = productData.material;
    if (modalImg && productData.image) {
      modalImg.src = productData.image;
      modalImg.alt = productData.name || 'Product Image';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Scroll lock
  };
  
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Close modal on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  
  // Expose function globally so individual product cards can trigger it
  window.openQuickView = openModal;
}

/**
 * Scroll triggered number counter animation
 */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-to') || el.textContent);
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const steps = duration / stepTime;
        const stepVal = target / steps;
        let current = 0;
        
        const counter = setInterval(() => {
          current += stepVal;
          if (current >= target) {
            el.textContent = target;
            clearInterval(counter);
          } else {
            el.textContent = Math.floor(current);
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => {
    if (!stat.getAttribute('data-count-to')) {
      stat.setAttribute('data-count-to', stat.textContent.trim());
    }
    stat.textContent = '0';
    observer.observe(stat);
  });
}

/**
 * Subtle parallax scroll tracking for lookbook and craftsmanship images
 */
function initParallax() {
  const elements = document.querySelectorAll('.lookbook-img, .editorial-img, .hero-img');
  if (elements.length === 0) return;

  window.addEventListener('scroll', () => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.04;
        const shift = (rect.top - window.innerHeight / 2) * speed;
        // Clamp translation between -20px and +20px
        const clampedShift = Math.max(-20, Math.min(20, shift));
        el.style.transform = `scale(1.05) translateY(${clampedShift}px)`;
      }
    });
  });
}
