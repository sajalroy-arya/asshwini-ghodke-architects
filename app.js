document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = menuToggle.querySelector('span');
        icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.querySelector('span').textContent = 'menu';
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const mobileCta = document.getElementById('mobile-cta');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Show fixed mobile CTA after scrolling past hero
        if (window.scrollY > 500) {
            mobileCta.classList.add('visible');
        } else {
            mobileCta.classList.remove('visible');
        }
    });

    // --- Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Portfolio Horizontal Slider ---
    const slider = document.getElementById('work-slider');
    const nextBtn = document.getElementById('slider-next');
    const prevBtn = document.getElementById('slider-prev');

    if (slider && nextBtn && prevBtn) {
        const scrollAmount = window.innerWidth > 768 ? 632 : window.innerWidth * 0.85 + 32;

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- Consultation Form Submission ---
    const form = document.getElementById('consultation-form');
    const successMsg = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                // Hide form grid
                form.querySelector('.form-grid').style.display = 'none';
                btn.style.display = 'none';
                
                // Show success message
                successMsg.classList.add('show');
            }, 1500);
        });
    }
});
