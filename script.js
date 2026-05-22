document.addEventListener('DOMContentLoaded', () => {
    
    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for smooth reveal-on-scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once it's visible if we only want it to animate once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileBtn && desktopNav) {
        mobileBtn.addEventListener('click', () => {
            const isActive = desktopNav.classList.toggle('active');
            mobileBtn.setAttribute('aria-expanded', isActive);
        });
        
        // Close menu when a link is clicked
        const navLinks = desktopNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                desktopNav.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


    // Async form submission feedback
    const luxuryForm = document.querySelector('.luxury-form');
    if (luxuryForm) {
        luxuryForm.addEventListener('submit', (e) => {
            const submitBtn = luxuryForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'not-allowed';
            }
        });
    }

});
