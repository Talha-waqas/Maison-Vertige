document.addEventListener('DOMContentLoaded', () => {
  initLightbox();
});

/**
 * Lightbox campaign viewer logic
 */
function initLightbox() {
  const images = Array.from(document.querySelectorAll('.lookbook-grid-section .lookbook-img-wrapper img'));
  const overlay = document.getElementById('lightboxOverlay');
  const lightboxImg = overlay?.querySelector('.lightbox-img');
  const lightboxCaption = overlay?.querySelector('.lightbox-caption');
  
  const closeBtn = overlay?.querySelector('.lightbox-close');
  const prevBtn = overlay?.querySelector('.lightbox-prev');
  const nextBtn = overlay?.querySelector('.lightbox-next');

  if (images.length === 0 || !overlay || !lightboxImg || !lightboxCaption || !closeBtn || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    updateLightboxContent();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Scroll lock
    
    // Focus container to capture key events
    const container = overlay.querySelector('.lightbox-container');
    if (container) container.focus();
  };

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Release scroll lock
  };

  const updateLightboxContent = () => {
    const currentImg = images[currentIndex];
    if (!currentImg) return;
    
    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt || 'Campaign Image';
    lightboxCaption.textContent = currentImg.getAttribute('data-caption') || currentImg.alt || '';
  };

  const showNext = (e) => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxContent();
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxContent();
  };

  // Attach click to all lookbook images
  images.forEach((img, index) => {
    const wrapper = img.closest('.lookbook-img-wrapper');
    if (wrapper) {
      wrapper.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  // Action listeners
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);
  
  // Close when clicking background overlay (which is the parent wrapper)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });
}
