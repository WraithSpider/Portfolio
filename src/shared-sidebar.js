/**
 * Sidebar Profile Dropdown
 * Toggles the profile popover menu and handles click-outside closing
 */
(function () {
  'use strict';

  function initProfileDropdown() {
    var trigger = document.getElementById('profileDropdown');
    var popover = document.getElementById('profilePopover');
    if (!trigger || !popover) return;

    // Toggle popover on click
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = popover.classList.contains('open');
      popover.classList.toggle('open', !isOpen);
    });

    // Close popover when clicking outside
    document.addEventListener('click', function (e) {
      if (!trigger.contains(e.target)) {
        popover.classList.remove('open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        popover.classList.remove('open');
      }
    });
  }

  function initMobileSidebar() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // Support becomes a regular nav item right after Documentation.
    function syncSupportPosition() {
      var nav = sidebar.querySelector('.sidebar-nav');
      if (!nav) return;
      var inNav = nav.querySelector('.support-link');
      var supportLink = sidebar.querySelector('.support-link');

      if (!supportLink || inNav) return;

      nav.appendChild(supportLink);
    }

    syncSupportPosition();

    var header = document.querySelector('.mobile-header');
    var overlay = document.querySelector('.sidebar-overlay');

    // Create mobile header: logo icon + down-arrow
    if (!header) {
      header = document.createElement('div');
      header.className = 'mobile-header';
      header.innerHTML =
        '<a href="saas_dashboard.html" class="mobile-brand" aria-label="GridNode home">' +
          '<img src="brand-logo-icon.svg" alt="GridNode icon" class="brand-logo-icon" />' +
          '<svg class="logo-arrow" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</a>';
      document.body.insertBefore(header, document.body.firstChild);
    }

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.id = 'sidebarOverlay';
      document.body.appendChild(overlay);
    }

    var brand = header.querySelector('.mobile-brand');

    // Close button in the top-right of the sidebar
    var closeBtn = sidebar.querySelector('.sidebar-close');
    if (!closeBtn) {
      closeBtn = document.createElement('button');
      closeBtn.className = 'sidebar-close';
      closeBtn.id = 'sidebarClose';
      closeBtn.type = 'button';
      closeBtn.setAttribute('aria-label', 'Close menu');
      closeBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<line x1="18" y1="6" x2="6" y2="18"/>' +
          '<line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>';
      sidebar.appendChild(closeBtn);
    }

    function openSidebar() {
      brand.classList.add('open');
      sidebar.classList.add('open');
      overlay.classList.add('show');
    }

    function closeSidebar() {
      brand.classList.remove('open');
      overlay.classList.remove('show');
      sidebar.classList.add('closing');
      requestAnimationFrame(function () {
        sidebar.classList.remove('open');
      });
      setTimeout(function () {
        sidebar.classList.remove('closing');
      }, 240);
    }

    brand.addEventListener('click', function (e) {
      e.preventDefault();
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    closeBtn.addEventListener('click', closeSidebar);

    overlay.addEventListener('click', closeSidebar);

    sidebar.querySelectorAll('.nav-item').forEach(function (el) {
      el.addEventListener('click', closeSidebar);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });
  }

  function addDocumentationLink() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav || nav.querySelector('a[href="docs.html"]')) return;

    var link = document.createElement('a');
    link.className = 'nav-item';
    link.href = 'docs.html';
    link.innerHTML =
      '<span class="nav-icon">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M5 3h10l4 4v14H5z"></path>' +
          '<path d="M15 3v5h4M8 12h8M8 16h6"></path>' +
        '</svg>' +
      '</span>' +
      '<span>Documentation</span>';
    nav.appendChild(link);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initProfileDropdown();
      addDocumentationLink();
      initMobileSidebar();
    });
  } else {
    initProfileDropdown();
    addDocumentationLink();
    initMobileSidebar();
  }
})();
