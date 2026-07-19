document.addEventListener('DOMContentLoaded', () => {
  initDropdowns();
  initFilters();
  initSorting();
  initRecentlyViewed();
});

// State for active filters
const activeFilters = {
  collection: 'all',
  category: 'all',
  height: 'all',
  color: 'all'
};

/**
 * Handle filter dropdown toggles and click outside closure
 */
function initDropdowns() {
  const containers = document.querySelectorAll('.filter-dropdown-container');

  containers.forEach(container => {
    const btn = container.querySelector('.filter-btn');
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other dropdowns
      containers.forEach(c => {
        if (c !== container) c.classList.remove('active');
      });
      
      container.classList.toggle('active');
    });
  });

  // Click outside closes dropdowns
  document.addEventListener('click', () => {
    containers.forEach(c => c.classList.remove('active'));
  });

  // Prevent closing when clicking inside dropdown content
  const contents = document.querySelectorAll('.filter-dropdown-content');
  contents.forEach(content => {
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

/**
 * Main Filtering Engine
 */
function initFilters() {
  const optionItems = document.querySelectorAll('.filter-option-item');
  const cards = document.querySelectorAll('.shop-grid-section .product-card');
  const tagsContainer = document.querySelector('.active-tags-section');
  const countEl = document.querySelector('.product-count');

  if (!tagsContainer) return;

  const filterProducts = () => {
    // 1. Fade out products
    cards.forEach(card => {
      card.classList.add('filtering');
    });

    setTimeout(() => {
      let visibleCount = 0;

      // 2. Evaluate visibility
      cards.forEach(card => {
        const col = card.dataset.collection;
        const cat = card.dataset.category;
        const hgt = card.dataset.height;
        const clr = card.dataset.color; // Color can be a comma-separated list or single string

        const matchesCollection = activeFilters.collection === 'all' || col === activeFilters.collection;
        const matchesCategory = activeFilters.category === 'all' || cat === activeFilters.category;
        const matchesHeight = activeFilters.height === 'all' || hgt === activeFilters.height;
        const matchesColor = activeFilters.color === 'all' || clr.split(',').includes(activeFilters.color);

        if (matchesCollection && matchesCategory && matchesHeight && matchesColor) {
          card.style.display = 'flex';
          card.classList.remove('filtering');
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // 3. Update count
      if (countEl) {
        countEl.textContent = `(${visibleCount} Styles)`;
      }

      // 4. Render Active Tags
      renderTags();
    }, 300);
  };

  const renderTags = () => {
    // Clear current tags except "CLEAR ALL"
    const existingTags = tagsContainer.querySelectorAll('.active-tag');
    existingTags.forEach(tag => tag.remove());

    let activeCount = 0;
    
    // Add tag for each filter not set to 'all'
    Object.keys(activeFilters).forEach(key => {
      const val = activeFilters[key];
      if (val !== 'all') {
        activeCount++;
        const tag = document.createElement('span');
        tag.className = 'active-tag';
        tag.innerHTML = `
          ${key}: ${val}
          <button class="active-tag-remove" data-filter="${key}">&times;</button>
        `;
        
        // Wire up remove button
        tag.querySelector('.active-tag-remove').addEventListener('click', (e) => {
          const filterKey = e.target.dataset.filter;
          resetFilterGroup(filterKey);
        });

        // Insert before the Clear All button
        const clearBtn = tagsContainer.querySelector('.clear-all-filters');
        if (clearBtn) {
          tagsContainer.insertBefore(tag, clearBtn);
        } else {
          tagsContainer.appendChild(tag);
        }
      }
    });

    // Toggle Clear All button visibility
    const clearBtn = tagsContainer.querySelector('.clear-all-filters');
    if (clearBtn) {
      clearBtn.style.display = activeCount > 0 ? 'inline-block' : 'none';
    }
  };

  const resetFilterGroup = (groupKey) => {
    activeFilters[groupKey] = 'all';
    
    // Update active visual state in dropdown list
    const options = document.querySelectorAll(`.filter-dropdown-container[data-filter-type="${groupKey}"] .filter-option-item`);
    options.forEach(opt => {
      const optVal = opt.dataset.value;
      if (optVal === 'all') {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    filterProducts();
  };

  // Attach click listener to dropdown options
  optionItems.forEach(item => {
    item.addEventListener('click', () => {
      const parentDropdown = item.closest('.filter-dropdown-container');
      if (!parentDropdown) return;

      const filterType = parentDropdown.dataset.filterType;
      const value = item.dataset.value;

      // Update state
      activeFilters[filterType] = value;

      // Toggle active states in this specific dropdown
      parentDropdown.querySelectorAll('.filter-option-item').forEach(opt => {
        opt.classList.remove('active');
      });
      item.classList.add('active');

      // Run filter engine
      filterProducts();
      
      // Close dropdown
      parentDropdown.classList.remove('active');
    });
  });

  // Clear All Button Click Handler
  const clearAllBtn = tagsContainer.querySelector('.clear-all-filters');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      Object.keys(activeFilters).forEach(key => {
        activeFilters[key] = 'all';
      });

      // Reset options styling
      optionItems.forEach(opt => {
        if (opt.dataset.value === 'all') {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });

      filterProducts();
    });
  }
}

/**
 * Sorting Engine
 */
function initSorting() {
  const sortItems = document.querySelectorAll('.filter-dropdown-container[data-filter-type="sort"] .filter-option-item');
  const grid = document.querySelector('.shop-grid-section .grid-4');

  if (!sortItems || !grid) return;

  sortItems.forEach(item => {
    item.addEventListener('click', () => {
      const sortValue = item.dataset.value;
      const cards = Array.from(grid.querySelectorAll('.product-card'));
      
      // Toggle dropdown visual states
      sortItems.forEach(opt => opt.classList.remove('active'));
      item.classList.add('active');
      
      // Sort logic
      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const idA = parseInt(a.dataset.id) || 0;
        const idB = parseInt(b.dataset.id) || 0;

        if (sortValue === 'low-high') {
          return priceA - priceB;
        } else if (sortValue === 'high-low') {
          return priceB - priceA;
        } else {
          // Default: Newest / ID based
          return idB - idA;
        }
      });

      // Animate transition by fading out, appending, and fading in
      grid.style.opacity = '0';
      
      setTimeout(() => {
        cards.forEach(card => grid.appendChild(card));
        grid.style.opacity = '1';
      }, 200);

      // Close dropdown
      item.closest('.filter-dropdown-container').classList.remove('active');
    });
  });
}

/**
 * Recently Viewed Storage & Carousel Rendering
 */
function initRecentlyViewed() {
  const section = document.querySelector('.recently-viewed-section');
  const scrollContainer = document.querySelector('.recently-viewed-scroll');
  
  if (!section || !scrollContainer) return;

  const updateRecentlyViewedUI = () => {
    const list = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
    
    if (list.length === 0) {
      section.classList.remove('active');
      return;
    }

    section.classList.add('active');
    scrollContainer.innerHTML = '';

    list.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.style.cursor = 'pointer';
      
      // Construct structure
      card.innerHTML = `
        <div class="product-card-image-wrapper">
          <img src="${prod.image}" alt="${prod.name}" class="product-card-image">
        </div>
        <div class="product-card-info">
          <span class="product-card-title">${prod.name}</span>
          <span class="product-card-material">${prod.material}</span>
          <span class="product-card-price">${prod.price}</span>
        </div>
      `;

      // Click opens quick-view
      card.addEventListener('click', () => {
        if (typeof window.openQuickView === 'function') {
          window.openQuickView(prod);
        }
      });

      scrollContainer.appendChild(card);
    });
  };

  // Wire up quick-view triggers across the shop page to save clicked product to local storage
  const shopCards = document.querySelectorAll('.shop-grid-section .product-card');
  shopCards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.product-card-title').textContent;
      const material = card.querySelector('.product-card-material').textContent;
      const price = card.querySelector('.product-card-price').textContent;
      const image = card.querySelector('.product-card-image').src;
      
      const product = { name, material, price, image };

      // Get current list
      let list = JSON.parse(localStorage.getItem('recently-viewed') || '[]');
      
      // Filter out duplicate
      list = list.filter(p => p.name !== product.name);
      
      // Prepend
      list.unshift(product);
      
      // Cap at 6 items
      if (list.length > 6) list.pop();
      
      // Save
      localStorage.setItem('recently-viewed', JSON.stringify(list));
      
      // Update UI
      updateRecentlyViewedUI();
    });
  });

  // Render on load
  updateRecentlyViewedUI();
}
