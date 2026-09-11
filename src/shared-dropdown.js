/* Shared custom select replacement component.
   Used by Settings, Support and the Generate New API Key modal.
   Renders a styled trigger button + dropdown panel and keeps a hidden native
   <select> in sync so existing form/value logic keeps working. */
(function () {
  'use strict';

  function syncSelect(wrap) {
    var select = wrap.querySelector('select.custom-select-hidden');
    var label = wrap.querySelector('.cs-label');
    if (!select || !label) return;
    var selected = select.options[select.selectedIndex];
    label.textContent = selected ? selected.textContent : '';
    wrap.querySelectorAll('.custom-select-option').forEach(function (opt) {
      opt.classList.toggle('selected', opt.dataset.value === select.value);
    });
  }

  function closeAll() {
    document.querySelectorAll('.custom-select.open').forEach(function (wrap) {
      wrap.classList.remove('open');
      var trigger = wrap.querySelector('.custom-select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('.custom-select').forEach(function (wrap) {
    var trigger = wrap.querySelector('.custom-select-trigger');
    var menu = wrap.querySelector('.custom-select-menu');
    var select = wrap.querySelector('select.custom-select-hidden');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = wrap.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        wrap.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    menu.addEventListener('click', function (e) {
      var opt = e.target.closest('.custom-select-option');
      if (!opt) return;
      if (select) {
        select.value = opt.dataset.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      syncSelect(wrap);
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    });

    if (select) {
      select.addEventListener('change', function () { syncSelect(wrap); });
      var form = select.form;
      if (form) {
        form.addEventListener('reset', function () {
          setTimeout(function () { syncSelect(wrap); }, 0);
        });
      }
    }

    syncSelect(wrap);
  });

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });
})();