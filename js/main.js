/* =========================================
   MAIN — Nav, Reveal, FAQ, Form
   ========================================= */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle     = document.querySelector('.nav__toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      var opening = !isOpen;

      toggle.setAttribute('aria-expanded', opening ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', opening ? 'false' : 'true');
      mobileMenu.classList.toggle('open', opening);

      /* Move focus to first focusable item when opening */
      if (opening) {
        var firstLink = mobileMenu.querySelector('a, button');
        if (firstLink) { firstLink.focus(); }
      }
    });

    /* Close mobile menu when any link inside is clicked */
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.closest('.btn')) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
        toggle.focus();
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.classList.remove('open');
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    /* Show everything immediately — respect user's motion preference */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  } else if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Hero visual: chip/arrow/card sequence ----------
     Runs separately from the generic reveal above — it watches the
     screen/frame itself (not the neck+base below it), so the sequence
     starts as soon as the top of the screen scrolls into view rather
     than waiting for the whole laptop to be on screen. It replays
     every time the screen re-enters the viewport (class is removed
     on exit), rather than firing once and staying done. Since the
     frame is near the top of the page, this typically plays right on
     load. */
  var heroVisual = document.querySelector('.hero-visual');
  var heroVisualFrame = document.querySelector('.hero-visual__frame');

  if (heroVisual && heroVisualFrame) {
    if (prefersReducedMotion) {
      heroVisual.classList.add('hero-visual--in-view');
    } else if ('IntersectionObserver' in window) {
      /* Longest chip/arrow/card transition-delay (1.15s) + its own
         transition duration (450ms), rounded up. A fast scroll-through
         must not cut the sequence off before this elapses. */
      var SEQUENCE_MS = 1700;

      var exitTimer = null;

      var showSequence = function () {
        if (exitTimer) { clearTimeout(exitTimer); exitTimer = null; }
        heroVisual.classList.add('hero-visual--in-view');
      };

      var scheduleHideSequence = function () {
        if (exitTimer) { clearTimeout(exitTimer); }
        exitTimer = setTimeout(function () {
          heroVisual.classList.remove('hero-visual--in-view');
          exitTimer = null;
        }, SEQUENCE_MS);
      };

      var sequenceObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showSequence();
          } else {
            scheduleHideSequence();
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      sequenceObserver.observe(heroVisualFrame);
    } else {
      heroVisual.classList.add('hero-visual--in-view');
    }
  }

  /* ---------- Process steps: number pop-in + connecting line draw ----------
     Replays every time the row scrolls into view, from either direction.
     Like the hero sequence, class removal on exit is delayed so a fast
     scroll-through doesn't cut the pop-in/line-draw off mid-way. */
  var processSteps = document.querySelector('.process-steps');

  if (processSteps) {
    if (prefersReducedMotion) {
      processSteps.classList.add('process-steps--active');
    } else if ('IntersectionObserver' in window) {
      var PROCESS_SEQUENCE_MS = 1600; // longest nth-child delay (1s) + its transition (500ms), rounded up
      var processExitTimer = null;

      var showProcessSteps = function () {
        if (processExitTimer) { clearTimeout(processExitTimer); processExitTimer = null; }
        processSteps.classList.add('process-steps--active');
      };

      var scheduleHideProcessSteps = function () {
        if (processExitTimer) { clearTimeout(processExitTimer); }
        processExitTimer = setTimeout(function () {
          processSteps.classList.remove('process-steps--active');
          processExitTimer = null;
        }, PROCESS_SEQUENCE_MS);
      };

      var processObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            showProcessSteps();
          } else {
            scheduleHideProcessSteps();
          }
        });
      }, { threshold: 0.3 });

      processObserver.observe(processSteps);
    } else {
      processSteps.classList.add('process-steps--active');
    }
  }

  /* ---------- Horizontal drag-to-scroll rows (testimonials + logo bar) ---------- */
  var dragScrollRows = document.querySelectorAll('.testimonials-row, .logo-bar__row');

  dragScrollRows.forEach(function (row) {
    var isDown = false;
    var moved = false;
    var startX = 0;
    var startScrollLeft = 0;

    function endDrag() {
      if (!isDown) { return; }
      isDown = false;
      row.classList.remove('is-dragging');
    }

    row.addEventListener('mousedown', function (e) {
      isDown = true;
      moved = false;
      startX = e.pageX;
      startScrollLeft = row.scrollLeft;
      row.classList.add('is-dragging');
    });

    row.addEventListener('mousemove', function (e) {
      if (!isDown) { return; }
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 3) { moved = true; }
      row.scrollLeft = startScrollLeft - dx;
      e.preventDefault();
    });

    row.addEventListener('mouseup', endDrag);
    row.addEventListener('mouseleave', endDrag);

    row.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });

    /* Suppress the click that follows a drag so it doesn't act like a tap */
    row.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  });

  /* ---------- Logo bar: prev/next arrows ----------
     Step the row one item at a time in either direction. Each arrow
     hides itself when there's nothing left that way to scroll to. */
  var logoBarRow = document.querySelector('.logo-bar__row');
  var logoBarNext = document.querySelector('[data-logo-row-next]');
  var logoBarPrev = document.querySelector('[data-logo-row-prev]');

  if (logoBarRow && logoBarNext && logoBarPrev) {
    var logoBarStep = function () {
      var item = logoBarRow.querySelector('.logo-bar__item');
      var itemWidth = item ? item.getBoundingClientRect().width : logoBarRow.clientWidth * 0.85;
      var gap = parseFloat(window.getComputedStyle(logoBarRow).columnGap) || 24;
      return itemWidth + gap;
    };

    var updateLogoBarArrows = function () {
      var atStart = logoBarRow.scrollLeft <= 2;
      var atEnd = logoBarRow.scrollLeft + logoBarRow.clientWidth >= logoBarRow.scrollWidth - 2;
      logoBarPrev.hidden = atStart;
      logoBarNext.hidden = atEnd;
    };

    logoBarNext.addEventListener('click', function () {
      logoBarRow.scrollBy({ left: logoBarStep(), behavior: 'smooth' });
    });

    logoBarPrev.addEventListener('click', function () {
      logoBarRow.scrollBy({ left: -logoBarStep(), behavior: 'smooth' });
    });

    logoBarRow.addEventListener('scroll', updateLogoBarArrows, { passive: true });
    window.addEventListener('resize', updateLogoBarArrows);
    updateLogoBarArrows();
  }

  /* ---------- FAQ accordion ---------- */
  var faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(function (question) {
    question.addEventListener('click', function () {
      var isExpanded = question.getAttribute('aria-expanded') === 'true';
      var answer     = question.nextElementSibling;

      /* Collapse all others first */
      faqQuestions.forEach(function (q) {
        if (q !== question) {
          q.setAttribute('aria-expanded', 'false');
          var a = q.nextElementSibling;
          if (a) { a.hidden = true; }
        }
      });

      question.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (answer) { answer.hidden = isExpanded; }
    });
  });

  /* ---------- Success modal ---------- */
  var modalOverlay    = document.getElementById('success-modal');
  var modalClose      = document.getElementById('modal-close');
  var modalDone       = modalOverlay ? modalOverlay.querySelector('.modal__done') : null;
  var modalLastFocus  = null;

  function onModalKeydown(e) {
    if (e.key === 'Escape') { closeModal(); }
  }

  function openModal() {
    if (!modalOverlay) { return; }
    modalLastFocus = document.activeElement;
    modalOverlay.hidden = false;
    if (modalClose) { modalClose.focus(); }
    document.addEventListener('keydown', onModalKeydown);
  }

  function closeModal() {
    if (!modalOverlay) { return; }
    modalOverlay.hidden = true;
    document.removeEventListener('keydown', onModalKeydown);
    if (modalLastFocus) { modalLastFocus.focus(); }
  }

  if (modalOverlay) {
    if (modalClose) { modalClose.addEventListener('click', closeModal); }
    if (modalDone) { modalDone.addEventListener('click', closeModal); }
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) { closeModal(); }
    });
  }

  /* ---------- Form submission ---------- */
  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('submit-btn');
  var formStatus = document.getElementById('form-status');

  function setFieldError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (!input || !error) { return; }
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('is-error');
    error.textContent = message;
    error.hidden = false;
    var group = input.closest('.form-group');
    if (group) { group.classList.add('form-group--error'); }
  }

  function clearFieldError(input) {
    var errorId = input.getAttribute('aria-describedby');
    var error   = errorId ? document.getElementById(errorId) : null;
    input.removeAttribute('aria-invalid');
    input.classList.remove('is-error');
    if (error) { error.hidden = true; }
    var group = input.closest('.form-group');
    if (group) { group.classList.remove('form-group--error'); }
  }

  function clearAllErrors() {
    form.querySelectorAll('.form-input').forEach(clearFieldError);
    if (formStatus) { formStatus.textContent = ''; }
  }

  if (form && submitBtn) {
    var originalBtnHTML = submitBtn.innerHTML;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      var nameInput    = form.querySelector('#name');
      var emailInput   = form.querySelector('#email');
      var companyInput = form.querySelector('#company');
      var name         = nameInput.value.trim();
      var email        = emailInput.value.trim();
      var company      = companyInput.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      var errors = [];

      if (!name) {
        setFieldError('name', 'name-error', 'Please enter your full name.');
        errors.push(nameInput);
      }
      if (!email || !emailPattern.test(email)) {
        setFieldError('email', 'email-error', 'Please enter a valid work email.');
        errors.push(emailInput);
      }
      if (!company) {
        setFieldError('company', 'company-error', 'Please enter your company name.');
        errors.push(companyInput);
      }

      if (errors.length) {
        /* Announce error count and move focus to first invalid field */
        if (formStatus) {
          formStatus.textContent = errors.length + ' field' + (errors.length > 1 ? 's' : '') + ' need attention. Please review the form.';
        }
        errors[0].focus();
        return;
      }

      /* Loading state */
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style="animation:spin 0.75s linear infinite">' +
        '<circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>' +
        '<path d="M8 2a6 6 0 016 6" stroke="white" stroke-width="2" stroke-linecap="round"/>' +
        '</svg> Sending…';
      if (formStatus) { formStatus.textContent = 'Submitting your request…'; }

      /* Simulate network request */
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.innerHTML = originalBtnHTML;
        if (formStatus) { formStatus.textContent = 'Success! You\'re booked. We\'ll reach out within 24 hours.'; }
        form.reset();
        openModal();
      }, 1400);
    });

    /* Clear error styling on input */
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input);
      });
    });
  }

})();
