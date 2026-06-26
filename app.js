document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DEVICE CAPABILITY DETECTION & CUSTOM CURSOR
  // ==========================================================================
  const customCursor = document.getElementById('customCursor');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (customCursor) {
    if (!isTouchDevice && window.innerWidth >= 1024) {
      document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
      });

      // Hover expansion on interactive components
      const interactives = document.querySelectorAll('a, button, select, input, textarea, .project-card, .service-card, .faq-header, .slider-handle');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
      });
    } else {
      // Completely hide it on mobile/tablet or touch laptops
      customCursor.style.display = 'none';
    }
  }

  // ==========================================================================
  // 2. STICKY HEADER & SCROLL EFFECTS
  // ==========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const heroParallax = document.getElementById('heroParallax');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header class scroll toggle
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Hero slow parallax image movement
    if (heroParallax && window.innerWidth >= 768) {
      const limit = window.innerHeight;
      if (scrollY <= limit) {
        const translateVal = scrollY * 0.15;
        heroParallax.style.transform = `translateY(${translateVal}px)`;
      }
    }
  });

  // ==========================================================================
  // 3. MOBILE MENU NAVIGATION & SCROLL LOCK
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNavigation');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (menuToggle && mobileNav) {
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.setAttribute('aria-hidden', isExpanded);
      mobileNav.classList.toggle('open');
      
      // Prevent body scrolling when nav overlay is visible
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link inside is clicked
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
  // 4. INTERSECTION OBSERVER - SCROLL REVEALS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-text, .reveal-fade-delay');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to optimize performance
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering viewport
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // 5. INTERACTIVE BEFORE/AFTER SLIDER (Touch & Drag)
  // ==========================================================================
  const slider = document.getElementById('comparisonSlider');
  const beforeImg = document.querySelector('.img-before');
  const handle = document.getElementById('sliderHandle');

  if (slider && beforeImg && handle) {
    let isDragging = false;

    const setSliderPosition = (xPos) => {
      const rect = slider.getBoundingClientRect();
      let percentage = ((xPos - rect.left) / rect.width) * 100;

      // Restrict range between 0% and 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      // Apply widths and positions
      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    };

    // Mouse events
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

    // Touch events for mobile thumb operation
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

    // Keyboard support for accessibility
    handle.addEventListener('keydown', (e) => {
      let percentage = parseFloat(handle.style.left) || 50;
      if (e.key === 'ArrowLeft') {
        percentage = Math.max(0, percentage - 2);
      } else if (e.key === 'ArrowRight') {
        percentage = Math.min(100, percentage + 2);
      } else {
        return;
      }
      beforeImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
      handle.setAttribute('aria-valuenow', Math.round(percentage));
    });
  }

  // ==========================================================================
  // 6. PROCESS TIMELINE PROGRESSION
  // ==========================================================================
  const processSteps = document.querySelectorAll('.timeline-step');
  const progressLine = document.getElementById('timelineProgress');

  if (processSteps.length > 0 && progressLine) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.getAttribute('data-step'));
          
          // Set active state on steps up to current step
          processSteps.forEach((step, idx) => {
            if (idx < stepIndex) {
              step.classList.add('active');
            } else {
              step.classList.remove('active');
            }
          });

          // Calculate and set timeline line fill percentage
          const percent = ((stepIndex - 1) / (processSteps.length - 1)) * 100;
          progressLine.style.width = `${percent}%`;
        }
      });
    }, {
      threshold: 0.6, // Step must be mostly visible to activate
      rootMargin: '0px'
    });

    processSteps.forEach(step => processObserver.observe(step));
  }

  // ==========================================================================
  // 7. VIDEO WALKTHROUGH MUTE TOGGLE
  // ==========================================================================
  const soundBtn = document.getElementById('videoSoundBtn');
  const showcaseVideo = document.querySelector('.showcase-video');

  if (soundBtn && showcaseVideo) {
    soundBtn.addEventListener('click', () => {
      showcaseVideo.muted = !showcaseVideo.muted;
      
      // Update SVG icon inside the button
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
  // 8. FAQ ACCORDION LOGIC (Dynamic Height transitions)
  // ==========================================================================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const contentId = header.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      // Close all other accordion tabs
      faqHeaders.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.setAttribute('aria-expanded', 'false');
          const otherContent = document.getElementById(otherHeader.getAttribute('aria-controls'));
          if (otherContent) {
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current tab
      header.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.setAttribute('aria-hidden', isExpanded);
      }
    });
  });

  // ==========================================================================
  // 9. FORM VALIDATION & SUBMISSION
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
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
      // 10 digits standard check (allowing spaces, dashes, +91 prefixes)
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

      // Validate name
      if (!nameInput.value.trim()) {
        setInvalid(nameInput, nameInput.parentElement);
        isValid = false;
      } else {
        setValid(nameInput, nameInput.parentElement);
      }

      // Validate phone
      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value)) {
        setInvalid(phoneInput, phoneInput.parentElement);
        isValid = false;
      } else {
        setValid(phoneInput, phoneInput.parentElement);
      }

      // Validate email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        setInvalid(emailInput, emailInput.parentElement);
        isValid = false;
      } else {
        setValid(emailInput, emailInput.parentElement);
      }

      // Validate project type selection
      if (!projectInput.value) {
        setInvalid(projectInput, projectInput.parentElement.parentElement);
        isValid = false;
      } else {
        setValid(projectInput, projectInput.parentElement.parentElement);
      }

      // Validate budget selection
      if (!budgetInput.value) {
        setInvalid(budgetInput, budgetInput.parentElement.parentElement);
        isValid = false;
      } else {
        setValid(budgetInput, budgetInput.parentElement.parentElement);
      }

      // Validate message
      if (!messageInput.value.trim()) {
        setInvalid(messageInput, messageInput.parentElement);
        isValid = false;
      } else {
        setValid(messageInput, messageInput.parentElement);
      }

      if (isValid) {
        // Submit action
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing Booking...</span>`;
        
        // Simulating premium server post delay
        setTimeout(() => {
          formStatus.className = 'form-status-msg success';
          formStatus.innerHTML = 'Thank you for your enquiry. Our senior design associate will contact you on WhatsApp or phone within 24 hours.';
          
          form.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Scroll status message into view smoothly
          formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1500);
      } else {
        // Show general error message
        formStatus.className = 'form-status-msg error';
        formStatus.innerHTML = 'Kindly check the highlighted fields for errors and try again.';
      }
    });

    // Remove invalid indicators as user types/interacts
    const inputs = [nameInput, phoneInput, emailInput, messageInput];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          setValid(input, input.parentElement);
        }
      });
    });

    projectInput.addEventListener('change', () => {
      setValid(projectInput, projectInput.parentElement.parentElement);
    });

    budgetInput.addEventListener('change', () => {
      setValid(budgetInput, budgetInput.parentElement.parentElement);
    });
  }
});
