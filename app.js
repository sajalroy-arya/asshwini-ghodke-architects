/* ============================================================
   app.js — Luxury Architecture Website
   Clean, minimal vanilla JS. Refined, subtle interactions.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. STICKY HEADER
     ---------------------------------------------------------- */
  const siteHeader = document.getElementById('siteHeader');

  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     2. HERO PARALLAX
     ---------------------------------------------------------- */
  const heroImg = document.getElementById('heroImg');

  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth >= 768 && window.scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     3. MOBILE MENU TOGGLE
     ---------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    const closeMobileMenu = () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        closeMobileMenu();
      } else {
        menuBtn.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });

    /* Close menu when any nav link or CTA button is clicked */
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }


  /* ----------------------------------------------------------
     4. SCROLL REVEAL (IntersectionObserver)
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ----------------------------------------------------------
     5. BEFORE / AFTER COMPARISON SLIDER
     ---------------------------------------------------------- */
  const compareBox = document.getElementById('compareBox');

  if (compareBox) {
    const imgBefore = compareBox.querySelector('.img-before');
    const dragHandle = document.getElementById('dragHandle');
    let dragging = false;

    const updateSlider = (percentage) => {
      /* Clamp between 0 and 100 */
      const clamped = Math.min(100, Math.max(0, percentage));
      if (imgBefore) imgBefore.style.width = `${clamped}%`;
      if (dragHandle) dragHandle.style.left = `${clamped}%`;
    };

    const getPercentage = (clientX) => {
      const rect = compareBox.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    /* Mouse events */
    compareBox.addEventListener('mousedown', () => { dragging = true; });

    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      updateSlider(getPercentage(e.clientX));
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    /* Touch events */
    compareBox.addEventListener('touchstart', () => { dragging = true; }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      updateSlider(getPercentage(touch.clientX));
    }, { passive: true });

    window.addEventListener('touchend', () => { dragging = false; });

    /* Keyboard accessibility */
    if (dragHandle) {
      dragHandle.addEventListener('keydown', (e) => {
        const currentLeft = parseFloat(dragHandle.style.left) || 50;

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          updateSlider(currentLeft - 2);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          updateSlider(currentLeft + 2);
        }
      });
    }
  }


  /* ----------------------------------------------------------
     6. FAQ ACCORDION
     ---------------------------------------------------------- */
  const faqBtns = document.querySelectorAll('.faq-btn');

  if (faqBtns.length) {
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;

        /* Close all other open panels first (accordion behavior) */
        faqBtns.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            const otherPanelId = otherBtn.getAttribute('aria-controls');
            const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
            if (otherPanel) otherPanel.setAttribute('aria-hidden', 'true');
          }
        });

        /* Toggle the clicked panel */
        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          if (panel) panel.setAttribute('aria-hidden', 'true');
        } else {
          btn.setAttribute('aria-expanded', 'true');
          if (panel) panel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }


  /* ----------------------------------------------------------
     7. VIDEO SOUND TOGGLE
     ---------------------------------------------------------- */
  const muteBtn = document.getElementById('muteBtn');
  const showcaseVid = document.querySelector('.showcase-vid');

  const mutedIconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z"/></svg>';

  const unmutedIconSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>';

  if (muteBtn && showcaseVid) {
    muteBtn.addEventListener('click', () => {
      showcaseVid.muted = !showcaseVid.muted;
      muteBtn.innerHTML = showcaseVid.muted ? mutedIconSVG : unmutedIconSVG;
    });
  }


  /* ----------------------------------------------------------
     8. CONTACT FORM VALIDATION
     ---------------------------------------------------------- */
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    const nameField = document.getElementById('nameField');
    const phoneField = document.getElementById('phoneField');
    const emailField = document.getElementById('emailField');
    const typeField = document.getElementById('typeField');
    const budgetField = document.getElementById('budgetField');
    const msgField = document.getElementById('msgField');
    const formMsg = document.getElementById('formMsg');
    const submitBtn = bookingForm.querySelector('[type="submit"]');

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    /** Mark a field as invalid */
    const setInvalid = (field) => {
      if (!field) return;
      const parent = field.closest('.field');
      if (parent) parent.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
    };

    /** Clear invalid state from a field */
    const clearInvalid = (field) => {
      if (!field) return;
      const parent = field.closest('.field');
      if (parent) parent.classList.remove('invalid');
      field.setAttribute('aria-invalid', 'false');
    };

    /** Live clearing of invalid state on input / change */
    const fields = [nameField, phoneField, emailField, typeField, budgetField, msgField];

    fields.forEach(field => {
      if (!field) return;

      const eventType = (field.tagName === 'SELECT') ? 'change' : 'input';

      field.addEventListener(eventType, () => {
        if (field.value.trim() !== '') {
          clearInvalid(field);
        }
      });

      /* Also listen to 'change' for non-select fields (covers edge cases) */
      if (eventType !== 'change') {
        field.addEventListener('change', () => {
          if (field.value.trim() !== '') {
            clearInvalid(field);
          }
        });
      }
    });

    /** Form submission handler */
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      /* Validate name — required, trim */
      if (!nameField || nameField.value.trim() === '') {
        setInvalid(nameField);
        isValid = false;
      } else {
        clearInvalid(nameField);
      }

      /* Validate phone — required, 10-13 digits after stripping non-digits */
      if (phoneField) {
        const digits = phoneField.value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 13) {
          setInvalid(phoneField);
          isValid = false;
        } else {
          clearInvalid(phoneField);
        }
      }

      /* Validate email — basic regex */
      if (!emailField || !emailRegex.test(emailField.value.trim())) {
        setInvalid(emailField);
        isValid = false;
      } else {
        clearInvalid(emailField);
      }

      /* Validate typeField — required (not empty string) */
      if (!typeField || typeField.value === '') {
        setInvalid(typeField);
        isValid = false;
      } else {
        clearInvalid(typeField);
      }

      /* Validate budgetField — required (not empty string) */
      if (!budgetField || budgetField.value === '') {
        setInvalid(budgetField);
        isValid = false;
      } else {
        clearInvalid(budgetField);
      }

      /* Validate msgField — required, trim */
      if (!msgField || msgField.value.trim() === '') {
        setInvalid(msgField);
        isValid = false;
      } else {
        clearInvalid(msgField);
      }

      /* Handle result */
      if (isValid) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        setTimeout(() => {
          if (formMsg) {
            formMsg.className = 'ok';
            formMsg.textContent = 'Thank you! Your consultation request has been sent successfully.';
          }
          bookingForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
          }
        }, 1500);
      } else {
        if (formMsg) {
          formMsg.className = 'err';
          formMsg.textContent = 'Please fill in all required fields correctly.';
        }
      }
    });

    /* Store original button text for restoration after submit */
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
    }
  }


  /* ----------------------------------------------------------
     9. PROCESS TIMELINE (optional desktop)
     ---------------------------------------------------------- */
  const processSteps = document.querySelectorAll('.process-step');
  const processBar = document.getElementById('processBar');

  if (processSteps.length && processBar) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentStep = entry.target;
          const stepIndex = Array.from(processSteps).indexOf(currentStep);

          /* Activate this step and all previous ones */
          processSteps.forEach((step, i) => {
            if (i <= stepIndex) {
              step.classList.add('active');
            }
          });

          /* Calculate fill percentage for the progress bar */
          const fillPercent = ((stepIndex + 1) / processSteps.length) * 100;
          processBar.style.width = `${fillPercent}%`;
        }
      });
    }, {
      threshold: 0.6
    });

    processSteps.forEach(step => timelineObserver.observe(step));
  }

});
