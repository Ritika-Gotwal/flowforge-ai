/* =========================================
   TESTIMONIALS — Hero testimonial carousel
   ========================================= */

(function () {
  'use strict';

  var root = document.querySelector('.hero-testimonial');
  if (!root) { return; }

  var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-testimonial__slide'));
  if (slides.length < 2) { return; }

  var prevBtn = root.querySelector('.hero-testimonial__nav--prev');
  var nextBtn = root.querySelector('.hero-testimonial__nav--next');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AUTO_MS = 6000;
  var timer = null;

  var index = slides.findIndex(function (slide) {
    return slide.classList.contains('is-active');
  });
  if (index < 0) { index = 0; }

  function show(nextIndex) {
    slides[index].classList.remove('is-active');
    slides[index].setAttribute('aria-hidden', 'true');
    index = (nextIndex + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    slides[index].removeAttribute('aria-hidden');
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function start() {
    if (prefersReducedMotion) { return; }
    stop();
    timer = window.setInterval(next, AUTO_MS);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      next();
      start();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prev();
      start();
    });
  }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) { start(); }
  });

  start();
})();
