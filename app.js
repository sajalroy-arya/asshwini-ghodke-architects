document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DYNAMIC COLOR-THEMING & SCROLL TRACKER
  // ==========================================================================
  const sections = document.querySelectorAll('.showroom-room');
  const bodyEl = document.body;
  const orbIcy = document.getElementById('orbIcy');
  const orbRoyal = document.getElementById('orbRoyal');
  const orbGreen = document.getElementById('orbGreen');
  const coveBeam = document.getElementById('coveBeam');

  const themeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const themeName = entry.target.getAttribute('data-theme');
        
        // Remove existing theme classes
        bodyEl.classList.remove('theme-icy', 'theme-slate', 'theme-green', 'theme-blue');
        // Add current theme class
        bodyEl.classList.add(themeName);

        // Adjust background ambient orbs dynamically to change color values per room
        if (themeName === 'theme-icy') {
          if (orbIcy) { orbIcy.style.transform = 'scale(1) translate(0, 0)'; orbIcy.style.opacity = '0.3'; }
          if (orbRoyal) { orbRoyal.style.opacity = '0.15'; }
          if (orbGreen) { orbGreen.style.opacity = '0.05'; }
        } else if (themeName === 'theme-slate') {
          if (orbIcy) { orbIcy.style.transform = 'scale(0.8) translate(-100px, 50px)'; orbIcy.style.opacity = '0.05'; }
          if (orbRoyal) { orbRoyal.style.opacity = '0.08'; }
          if (orbGreen) { orbGreen.style.opacity = '0.05'; }
        } else if (themeName === 'theme-green') {
          if (orbIcy) { orbIcy.style.opacity = '0.05'; }
          if (orbRoyal) { orbRoyal.style.opacity = '0.05'; }
          if (orbGreen) { orbGreen.style.transform = 'scale(1.2) translate(-50px, -50px)'; orbGreen.style.opacity = '0.28'; }
        } else if (themeName === 'theme-blue') {
          if (orbIcy) { orbIcy.style.opacity = '0.1'; }
          if (orbRoyal) { orbRoyal.style.transform = 'scale(1.2) translate(100px, -100px)'; orbRoyal.style.opacity = '0.3'; }
          if (orbGreen) { orbGreen.style.opacity = '0.05'; }
        }
      }
    });
  }, {
    threshold: 0.25 // Trigger when a quarter of the section is visible
  });

  sections.forEach(sec => themeObserver.observe(sec));

  // ==========================================================================
  // 2. SPOTLIGHT CURSOR (Desktop Only)
  // ==========================================================================
  const spotlightCursor = document.getElementById('spotlightCursor');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (spotlightCursor) {
    if (!isTouchDevice && window.innerWidth >= 1024) {
      document.addEventListener('mousemove', (e) => {
        spotlightCursor.style.left = `${e.clientX}px`;
        spotlightCursor.style.top = `${e.clientY}px`;

        // Interactive subtle drifting lights on mouse move
        if (orbIcy) {
          const moveX = (e.clientX - window.innerWidth / 2) * 0.04;
          const moveY = (e.clientY - window.innerHeight / 2) * 0.04;
          orbIcy.style.marginLeft = `${moveX}px`;
          orbIcy.style.marginTop = `${moveY}px`;
        }
        if (coveBeam) {
          const beamX = (e.clientX - window.innerWidth / 2) * 0.02;
          coveBeam.style.left = `calc(30% + ${beamX}px)`;
        }
      });

      // Grow spotlight cursor on hover
      const interactives = document.querySelectorAll('a, button, select, input, textarea, .project-glass-card, .service-glass-card, .faq-trigger, .slider-handle, .insta-image-box');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => spotlightCursor.classList.add('active-glow'));
        el.addEventListener('mouseleave', () => spotlightCursor.classList.remove('active-glow'));
      });
    } else {
      spotlightCursor.style.display = 'none';
    }
  }

  // ==========================================================================
  // 3. STICKY GLASS HEADER & PARALLAX SCROLL
  // ==========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const heroParallax = document.getElementById('heroParallax');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header scrolled state
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Parallax background movement
    if (heroParallax && window.innerWidth >= 768) {
      const limit = window.innerHeight;
      if (scrollY <= limit) {
        const translateVal = scrollY * 0.12;
        heroParallax.style.transform = `translateY(${translateVal}px)`;
      }
    }

    // Scroll-based orb drift (Mobile + Desktop)
    if (orbRoyal) {
      orbRoyal.style.bottom = `${10 + scrollY * 0.03}%`;
    }
  });

  // ==========================================================================
  // 4. MOBILE MENU OVERLAY & BODY SCROLL LOCK
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNavigation');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      mobileNav.classList.toggle('open');
      
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 5. INTERSECTION OBSERVER - SCROLL REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-text, .reveal-fade-delay');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 6. INTERACTIVE BEFORE/AFTER SLIDER (Touch & Drag)
  // ==========================================================================
  const slider = document.getElementById('comparisonSlider');
  const beforeImg = document.querySelector('.img-before');
  const handle = document.getElementById('sliderHandle');

  if (slider && beforeImg && handle) {
    let isDragging = false;

    const setSliderPosition = (xPos) => {
      const rect = slider.getBoundingClientRect();
      let percentage = ((xPos - rect.left) / rect.width) * 100;

      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile thumb navigation
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Accessibility keys
    handle.addEventListener('keydown', (e) => {
      let percentage = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') {
        percentage = Math.max(0, percentage - 3);
      } else if (e.key === 'ArrowRight') {
        percentage = Math.min(100, percentage + 3);
      } else {
        return;
      }
      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    });
  }

  // ==========================================================================
  // 7. TIMELINE PROGRESSION
  // ==========================================================================
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const progressLine = document.getElementById('timelineProgress');

  if (timelineNodes.length > 0 && progressLine) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute('data-step'));
          
          timelineNodes.forEach((node, idx) => {
            if (idx < stepIndex) {
              node.classList.add('active');
            } else {
              node.classList.remove('active');
            }
          });

          const fillPercentage = ((stepIndex - 1) / (timelineNodes.length - 1)) * 100;
          progressLine.style.width = `${fillPercentage}%`;
        }
      });
    }, {
      threshold: 0.6,
      rootMargin: '0px'
    });

    timelineNodes.forEach(node => timelineObserver.observe(node));
  }

  // ==========================================================================
  // 8. WALKTHROUGH SOUND TOGGLE
  // ==========================================================================
  const soundBtn = document.getElementById('videoSoundBtn');
  const showcaseVideo = document.querySelector('.showcase-video-newage');

  if (soundBtn && showcaseVideo) {
    soundBtn.addEventListener('click', () => {
      showcaseVideo.muted = !showcaseVideo.muted;
      
      if (showcaseVideo.muted) {
        soundBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
          </svg>
        `;
        soundBtn.setAttribute('aria-label', 'Unmute walkthrough video');
      } else {
        soundBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        `;
        soundBtn.setAttribute('aria-label', 'Mute walkthrough video');
      }
    });
  }

  // ==========================================================================
  // 9. FAQ GRID ACCORDION
  // ==========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const ansId = trigger.getAttribute('aria-controls');
      const ansBody = document.getElementById(ansId);

      // Accordion mode: collapse others
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherBody = document.getElementById(otherTrigger.getAttribute('aria-controls'));
          if (otherBody) otherBody.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current tab
      trigger.setAttribute('aria-expanded', !isExpanded);
      if (ansBody) ansBody.setAttribute('aria-hidden', isExpanded);
    });
  });

  // ==========================================================================
  // 10. FORM ENVELOPE VALIDATION & SUBMISSION
  // ==========================================================================
  const form = document.getElementById('bookingForm');
  const formStatus = document.getElementById('formStatus');
  const nameInput = document.getElementById('clientName');
  const phoneInput = document.getElementById('clientPhone');
  const emailInput = document.getElementById('clientEmail');
  const projectInput = document.getElementById('projectType');
  const budgetInput = document.getElementById('projectBudget');
  const messageInput = document.getElementById('projectMessage');

  if (form) {
    const validateEmail = (email) => {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
      const digits = phone.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 13;
    };

    const setInvalid = (element, parent) => {
      parent.classList.add('invalid');
      element.setAttribute('aria-invalid', 'true');
    };

    const setValid = (element, parent) => {
      parent.classList.remove('invalid');
      element.setAttribute('aria-invalid', 'false');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value.trim()) { setInvalid(nameInput, nameInput.parentElement); isValid = false; }
      else { setValid(nameInput, nameInput.parentElement); }

      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) { setInvalid(phoneInput, phoneInput.parentElement); isValid = false; }
      else { setValid(phoneInput, phoneInput.parentElement); }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) { setInvalid(emailInput, emailInput.parentElement); isValid = false; }
      else { setValid(emailInput, emailInput.parentElement); }

      if (!projectInput.value) { setInvalid(projectInput, projectInput.parentElement.parentElement); isValid = false; }
      else { setValid(projectInput, projectInput.parentElement.parentElement); }

      if (!budgetInput.value) { setInvalid(budgetInput, budgetInput.parentElement.parentElement); isValid = false; }
      else { setValid(budgetInput, budgetInput.parentElement.parentElement); }

      if (!messageInput.value.trim()) { setInvalid(messageInput, messageInput.parentElement); isValid = false; }
      else { setValid(messageInput, messageInput.parentElement); }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing Tour Request...</span>`;
        
        setTimeout(() => {
          formStatus.className = 'form-status-msg success';
          formStatus.innerHTML = 'Booking confirmed. A gallery docent or design associate will message you on WhatsApp shortly.';
          
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
      } else {
        formStatus.className = 'form-status-msg error';
        formStatus.innerHTML = 'Please check the highlighted fields and try again.';
      }
    });

    // Remove errors as inputs get populated
    const textInputs = [nameInput, phoneInput, emailInput, messageInput];
    textInputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) setValid(input, input.parentElement);
      });
    });

    projectInput.addEventListener('change', () => setValid(projectInput, projectInput.parentElement.parentElement));
    budgetInput.addEventListener('change', () => setValid(budgetInput, budgetInput.parentElement.parentElement));
  }
});
