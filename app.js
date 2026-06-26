document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. Intersection Observer for Scroll Reveals
     ----------------------------------------------------------- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find if this is a wrapper that contains reveal elements, or the element itself
        if (entry.target.classList.contains('reveal-text')) {
          entry.target.classList.add('is-inview');
        } else if (entry.target.classList.contains('reveal-fade')) {
          entry.target.classList.add('is-inview');
        } else if (entry.target.classList.contains('reveal-clip')) {
          entry.target.classList.add('is-inview');
        } else {
          // Check children
          const children = entry.target.querySelectorAll('.reveal-text, .reveal-fade, .reveal-clip');
          children.forEach(el => el.classList.add('is-inview'));
          entry.target.classList.add('is-inview');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // We observe the elements directly, or their parents if we want grouped reveals
  document.querySelectorAll('.reveal-fade, .reveal-clip, .hero-title').forEach(el => {
    revealObserver.observe(el);
  });

  // Specifically trigger hero elements immediately if they are in view
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-text').forEach(el => el.classList.add('is-inview'));
    document.querySelectorAll('.hero .reveal-fade').forEach(el => el.classList.add('is-inview'));
    document.querySelectorAll('.hero .reveal-clip').forEach(el => el.classList.add('is-inview'));
  }, 100);

  /* -----------------------------------------------------------
     2. Mobile Menu Toggle
     ----------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
      link.addEventListener('click', toggleMenu);
    });
  }

  /* -----------------------------------------------------------
     3. Subtle Hero Parallax
     ----------------------------------------------------------- */
  const parallaxImg = document.querySelector('.parallax-img');
  
  if (parallaxImg && window.innerWidth >= 1024) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        // Move image down slightly as we scroll down to create depth
        parallaxImg.style.transform = `translateY(calc(-10% + ${scrolled * 0.15}px))`;
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------------
     4. Expertise Hover Image Reveal (Desktop)
     ----------------------------------------------------------- */
  const expItems = document.querySelectorAll('.exp-item');
  const hoverReveal = document.getElementById('hoverReveal');
  
  if (hoverReveal && expItems.length > 0 && window.innerWidth >= 1024) {
    const hoverImg = hoverReveal.querySelector('img');
    let isHovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    // Linear interpolation for smooth cursor following
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      if (isHovering) {
        currentX = lerp(currentX, targetX, 0.1);
        currentY = lerp(currentY, targetY, 0.1);
        // Center the image on the cursor
        const xPos = currentX - hoverReveal.offsetWidth / 2;
        const yPos = currentY - hoverReveal.offsetHeight / 2;
        hoverReveal.style.left = `${xPos}px`;
        hoverReveal.style.top = `${yPos}px`;
        requestAnimationFrame(animate);
      }
    };

    expItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        isHovering = true;
        hoverReveal.classList.add('is-active');
        const imgSrc = item.getAttribute('data-img');
        if (hoverImg.src !== imgSrc) {
          hoverImg.src = imgSrc;
        }
        
        // Initial set to avoid flying in from 0,0
        currentX = e.clientX;
        currentY = e.clientY;
        targetX = e.clientX;
        targetY = e.clientY;
        animate();
      });

      item.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      });

      item.addEventListener('mouseleave', () => {
        isHovering = false;
        hoverReveal.classList.remove('is-active');
      });
    });
  }

  /* -----------------------------------------------------------
     5. Before/After Transformation Slider
     ----------------------------------------------------------- */
  const compareBox = document.getElementById('compareBox');
  
  if (compareBox) {
    const beforeWrapper = compareBox.querySelector('.img-before-wrapper');
    const dragHandle = document.getElementById('dragHandle');
    let isSliding = false;

    const slide = (xPos) => {
      const rect = compareBox.getBoundingClientRect();
      // Calculate percentage
      let percent = ((xPos - rect.left) / rect.width) * 100;
      // Clamp between 0 and 100
      percent = Math.max(0, Math.min(percent, 100));
      
      beforeWrapper.style.width = `${percent}%`;
      dragHandle.style.left = `${percent}%`;
    };

    const onMove = (e) => {
      if (!isSliding) return;
      const xPos = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
      slide(xPos);
    };

    const startSlide = (e) => {
      isSliding = true;
      document.body.style.userSelect = 'none'; // prevent text selection
    };

    const stopSlide = () => {
      isSliding = false;
      document.body.style.userSelect = '';
    };

    compareBox.addEventListener('mousedown', startSlide);
    compareBox.addEventListener('touchstart', startSlide, {passive: true});
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, {passive: false});
    
    window.addEventListener('mouseup', stopSlide);
    window.addEventListener('touchend', stopSlide);
  }

});
