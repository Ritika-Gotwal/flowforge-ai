/* =========================================
   MAIN — Nav, Reveal, FAQ, Form
   ========================================= */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll + mobile toggle ---------- */
  var nav        = document.getElementById('nav');
  var toggle     = document.querySelector('.nav__toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function updateNav() {
    if (window.scrollY > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

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
        submitBtn.removeAttribute('aria-busy');
        submitBtn.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
          '<path d="M3 8l3.2 3.2L13 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
          '</svg> You\'re booked! We\'ll reach out within 24 hours.';
        submitBtn.style.background = '#059669';
        submitBtn.style.boxShadow  = '0 0 24px rgba(16, 185, 129, 0.3)';
        if (formStatus) { formStatus.textContent = 'Success! You\'re booked. We\'ll reach out within 24 hours.'; }
        form.reset();

        /* Reset button after 6 seconds */
        setTimeout(function () {
          submitBtn.disabled        = false;
          submitBtn.innerHTML       = originalBtnHTML;
          submitBtn.style.background = '';
          submitBtn.style.boxShadow  = '';
          if (formStatus) { formStatus.textContent = ''; }
        }, 6000);
      }, 1400);
    });

    /* Clear error styling on input */
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input);
      });
    });
  }

  /* ---------- Workflow card animation ---------- */
  function workflowAnimation() {
    var card = document.getElementById('workflow-demo');
    if (!card) { return; }

    var steps      = Array.from(card.querySelectorAll('.workflow-step'));
    var connectors = Array.from(card.querySelectorAll('.ws-connector'));
    var footer     = card.querySelector('.workflow-card__footer');

    var stepData = [
      { processingText: 'Receiving…',  doneText: '2s ago'    },
      { processingText: 'Extracting…', doneText: '1s ago'    },
      { processingText: 'Syncing…',    doneText: 'Updated'   },
      { processingText: 'Sending…',    doneText: 'Delivered' },
    ];
    /* ms each step spends in "processing" before completing */
    var durations = [800, 1000, 1300, 700];

    function setState(step, state, timeText) {
      step.classList.remove('ws--pending', 'ws--processing', 'ws--done');
      step.classList.add('ws--' + state);
      var t = step.querySelector('.ws-time');
      if (t && timeText !== undefined) { t.textContent = timeText; }
    }

    function reset() {
      card.classList.add('wf-no-transition');
      steps.forEach(function (s, i) { setState(s, 'pending', 'Queued'); });
      connectors.forEach(function (c) { c.classList.remove('ws-connector--done'); });
      if (footer) { footer.classList.remove('wf-footer--visible'); }
      /* Let the DOM repaint with no-transition active, then re-enable */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          card.classList.remove('wf-no-transition');
        });
      });
    }

    function runStep(i) {
      if (i >= steps.length) {
        /* All steps done — show footer, pause, then restart */
        if (footer) { footer.classList.add('wf-footer--visible'); }
        setTimeout(function () {
          reset();
          setTimeout(function () { runStep(0); }, 600);
        }, 2200);
        return;
      }

      setState(steps[i], 'processing', stepData[i].processingText);

      setTimeout(function () {
        setState(steps[i], 'done', stepData[i].doneText);
        if (connectors[i]) { connectors[i].classList.add('ws-connector--done'); }
        /* Short pause before advancing to next step */
        setTimeout(function () { runStep(i + 1); }, 220);
      }, durations[i]);
    }

    if (prefersReducedMotion) {
      /* Skip animation — jump straight to completed state */
      steps.forEach(function (s, i) { setState(s, 'done', stepData[i].doneText); });
      connectors.forEach(function (c) { c.classList.add('ws-connector--done'); });
      if (footer) { footer.classList.add('wf-footer--visible'); }
      return;
    }

    reset();
    setTimeout(function () { runStep(0); }, 500);
  }

  workflowAnimation();

})();
