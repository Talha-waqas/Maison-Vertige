document.addEventListener('DOMContentLoaded', () => {
  initThumbnailSwap();
  initAccordions();
  initSizeGuideModal();
  initZoomModal();
  initColorSelector();
  initAddToBag();
});

/**
 * Thumbnail swap with crossfade
 */
function initThumbnailSwap() {
  const mainImg = document.querySelector('.pdp-main-img');
  const thumbs = document.querySelectorAll('.pdp-thumbnail');

  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remove active from all thumbs
      thumbs.forEach(t => t.classList.remove('active'));
      
      // Add active to current
      thumb.classList.add('active');

      const newSrc = thumb.dataset.large;
      
      // Crossfade effect
      mainImg.style.opacity = '0.3';
      
      setTimeout(() => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
      }, 150);
    });
  });
}

/**
 * Accordion Expand/Collapse Logic
 */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      
      if (!content) return;

      const isOpen = item.classList.contains('active');

      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        // Set max-height to scroll height to expand dynamically
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });
}

/**
 * Size Guide Modal Toggles
 */
function initSizeGuideModal() {
  const trigger = document.querySelector('.size-guide-trigger');
  const modal = document.querySelector('.size-guide-modal');
  const closeBtn = document.querySelector('.size-guide-close');
  const overlay = document.querySelector('.size-guide-overlay');

  if (!trigger || !modal || !closeBtn || !overlay) return;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/**
 * Fullscreen image zoom on hover
 */
function initZoomModal() {
  const trigger = document.querySelector('.pdp-main-img-wrapper');
  const overlay = document.querySelector('.photo-zoom-overlay');
  const closeBtn = document.querySelector('.photo-zoom-close');
  const viewer = document.querySelector('.photo-zoom-viewer');
  const zoomImg = document.querySelector('.photo-zoom-img');
  const mainImg = document.querySelector('.pdp-main-img');

  if (!trigger || !overlay || !closeBtn || !viewer || !zoomImg || !mainImg) return;

  trigger.addEventListener('click', () => {
    // Sync image source
    zoomImg.src = mainImg.src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  const closeZoom = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset transform
    zoomImg.style.transform = 'scale(1)';
  };

  closeBtn.addEventListener('click', closeZoom);
  viewer.addEventListener('click', closeZoom);

  // Zoom on hover / move logic (scale 2x and follow cursor)
  viewer.addEventListener('mousemove', (e) => {
    const rect = viewer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element

    // Calculate percentages
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoomImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    zoomImg.style.transform = 'scale(2)';
  });

  viewer.addEventListener('mouseleave', () => {
    zoomImg.style.transform = 'scale(1)';
  });
}

/**
 * Color swatch selector swaps images and labels
 */
function initColorSelector() {
  const swatches = document.querySelectorAll('.pdp-swatches-container .color-swatch-wrapper');
  const colorLabel = document.querySelector('.swatch-selected-name');
  const mainImg = document.querySelector('.pdp-main-img');
  const thumbs = document.querySelectorAll('.pdp-thumbnail');

  // Hardcoded image sets for Daphne colorways
  const colorwayImages = {
    black: [
      'assets/images/product_daphne.png',
      'assets/images/category_pumps.png',
      'assets/images/editorial_craftsmanship.png',
      'assets/images/campaign_hero.png'
    ],
    nude: [
      'assets/images/category_pumps.png',
      'assets/images/product_riviera.png',
      'assets/images/category_mules.png',
      'assets/images/product_aurelia.png'
    ],
    red: [
      'assets/images/product_daphne.png', // Filtered red in css or markup
      'assets/images/category_sandals.png',
      'assets/images/product_celeste.png',
      'assets/images/campaign_hero.png'
    ]
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const colorVal = swatch.dataset.value;
      const colorName = swatch.getAttribute('data-tooltip');
      
      // Update swatch active classes
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Update name text
      if (colorLabel) colorLabel.textContent = colorName;

      // Update images if colorway exists
      const images = colorwayImages[colorVal];
      if (images && images.length === 4) {
        // Swap main image
        if (mainImg) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = images[0];
            mainImg.style.opacity = '1';
          }, 150);
        }

        // Swap thumbnails and reset dataset sources
        thumbs.forEach((thumb, index) => {
          thumb.classList.remove('active');
          if (index === 0) thumb.classList.add('active');
          
          const imgNode = thumb.querySelector('img');
          if (imgNode) imgNode.src = images[index];
          
          thumb.dataset.large = images[index];
        });

        // Apply visual tint styling filter for Red colorway on main image
        if (colorVal === 'red') {
          mainImg.style.filter = 'sepia(0.2) hue-rotate(320deg) saturate(1.5)';
          thumbs.forEach(t => {
            const img = t.querySelector('img');
            if (img) img.style.filter = 'sepia(0.2) hue-rotate(320deg) saturate(1.5)';
          });
        } else {
          mainImg.style.filter = '';
          thumbs.forEach(t => {
            const img = t.querySelector('img');
            if (img) img.style.filter = '';
          });
        }
      }
    });
  });
}

/**
 * Add To Bag Button visual micro-animation
 */
function initAddToBag() {
  const btn = document.getElementById('addToBagBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const originalText = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.style.backgroundColor = 'var(--accent)';
    
    // Disable temporarily
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = '';
      btn.disabled = false;
    }, 2000);
  });
}
