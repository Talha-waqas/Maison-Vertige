document.addEventListener('DOMContentLoaded', () => {
  initStockistTabs();
});

/**
 * Filter stockists by region tabs
 */
function initStockistTabs() {
  const tabs = document.querySelectorAll('.stockist-tab-btn');
  const regions = document.querySelectorAll('.stockist-region-content');

  if (tabs.length === 0 || regions.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const regionVal = tab.dataset.region;

      // Remove active states
      tabs.forEach(t => t.classList.remove('active'));
      regions.forEach(r => r.classList.remove('active'));

      // Add active state to current tab
      tab.classList.add('active');

      // Add active state to corresponding content block
      const targetRegion = document.getElementById(`region-${regionVal}`);
      if (targetRegion) {
        targetRegion.classList.add('active');
      }
    });
  });
}
