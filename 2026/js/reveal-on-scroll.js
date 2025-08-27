document.addEventListener('DOMContentLoaded', function () {
  var elements = document.querySelectorAll('[data-animate]');

  if (!('IntersectionObserver' in window)) {
    // Fallback: play animations immediately
    elements.forEach(function (el) {
      var anim = el.getAttribute('data-animate') || 'fadeIn';
      var duration = el.getAttribute('data-animate-duration') || '0.8s';
      var delay = el.getAttribute('data-animate-delay') || '0s';
      el.style.animation = anim + ' ' + duration + ' ease both';
      el.style.animationDelay = delay;
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var anim = el.getAttribute('data-animate') || 'fadeIn';
        var duration = el.getAttribute('data-animate-duration') || '0.8s';
        var delay = el.getAttribute('data-animate-delay') || '0s';
        el.style.animation = anim + ' ' + duration + ' ease both';
        el.style.animationDelay = delay;
        var once = el.getAttribute('data-animate-once');
        if (once === null || once === 'true') {
          obs.unobserve(el);
        }
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(function (el) {
    // Ensure initial hidden state if not already present
    var anim = el.getAttribute('data-animate');
    if (!el.style.opacity) {
      el.style.opacity = '0';
    }
    if (!el.style.transform) {
      if (anim === 'slideUp') {
        el.style.transform = 'translateY(20px)';
      } else {
        el.style.transform = 'translateY(8px)';
      }
    }
    observer.observe(el);
  });
});





