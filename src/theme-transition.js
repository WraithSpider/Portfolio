/**
 * Circular Theme Reveal — View Transitions API
 * Wraps a theme-toggle click with a circular clip-path animation
 * on ::view-transition-new(root) that reveals the new theme snapshot.
 * Falls back to instant swap when the API is unavailable.
 */
(function () {
  'use strict';

  window.themeTransition = function (button, applyFn) {
    if (!document.startViewTransition) {
      applyFn();
      return;
    }

    var rect = button.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    var transition = document.startViewTransition(function () {
      applyFn();
    });

    transition.ready.then(function () {
      document.documentElement.animate(
        {
          clipPath: [
            'circle(0px at ' + x + 'px ' + y + 'px)',
            'circle(' + endRadius + 'px at ' + x + 'px ' + y + 'px)'
          ]
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };
})();
