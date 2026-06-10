document.addEventListener('DOMContentLoaded', () => {

    // Show success message if redirected back after form submission
    if (window.location.search.includes('sent=true')) {
        const form = document.querySelector('.luxury-form');
        const success = document.getElementById('form-success');
        if (form && success) {
            form.style.display = 'none';
            success.style.display = 'block';
            // Scroll to the contact section smoothly
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                setTimeout(() => contactSection.scrollIntoView({ behavior: 'smooth' }), 200);
            }
            // Clean URL without reload
            window.history.replaceState(null, '', window.location.pathname);
        }
    }


    // Path routing map
    const pathToSectionMap = {
        '/about': 'about',
        '/process': 'process',
        '/experience': 'experience',
        '/gallery': 'gallery',
        '/testimonials': 'testimonials',
        '/faq': 'faq',
        '/contact': 'contact'
    };

    function getSectionIdFromPath(path) {
        const cleanPath = path.toLowerCase().replace(/\/$/, '');
        if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
            return 'home';
        }
        return pathToSectionMap[cleanPath] || null;
    }

    function updateActiveNavLink(path) {
        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Scroll to section based on current path on page load
    const initialPath = window.location.pathname;
    const initialSectionId = getSectionIdFromPath(initialPath);
    if (initialSectionId && initialSectionId !== 'home') {
        const targetElement = document.getElementById(initialSectionId);
        if (targetElement) {
            // Wait slightly for fonts and layout to settle before scrolling
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'auto' });
                updateActiveNavLink(initialPath);
            }, 150);
        }
    } else {
        updateActiveNavLink('/');
    }

    // Intercept navigation link clicks
    let isScrollingToTarget = false;
    document.querySelectorAll('.desktop-nav a, .btn-outline, .hero-content a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
            const sectionId = getSectionIdFromPath(href);
            if (sectionId) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Close mobile menu if active
                    const desktopNav = document.querySelector('.desktop-nav');
                    const mobileBtn = document.querySelector('.mobile-menu-btn');
                    if (desktopNav && desktopNav.classList.contains('active')) {
                        desktopNav.classList.remove('active');
                        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
                    }

                    isScrollingToTarget = true;
                    if (sectionId === 'home') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        const target = document.getElementById(sectionId);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    window.history.pushState(null, '', href);
                    updateActiveNavLink(href);
                    
                    setTimeout(() => {
                        isScrollingToTarget = false;
                    }, 800);
                });
            }
        }
    });

    // Handle browser Back/Forward buttons
    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        const sectionId = getSectionIdFromPath(path);
        if (sectionId) {
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.getElementById(sectionId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            updateActiveNavLink(path);
        }
    });

    // Highlight active section on scroll using IntersectionObserver
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        if (isScrollingToTarget) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                let path = '/';
                for (const [p, sId] of Object.entries(pathToSectionMap)) {
                    if (sId === sectionId) {
                        path = p;
                        break;
                    }
                }
                
                if (window.location.pathname !== path) {
                    window.history.replaceState(null, '', path);
                }
                updateActiveNavLink(path);
            }
        });
    }, sectionObserverOptions);

    Object.values(pathToSectionMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });
    const homeEl = document.getElementById('home');
    if (homeEl) sectionObserver.observe(homeEl);

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
