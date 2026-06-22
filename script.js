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
        const normalize = (p) => (p || '/').replace(/\/$/, '') || '/';
        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (normalize(href) === normalize(path)) {
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
    }, { passive: true });

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

    // Scroll progress indicator
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('is-visible');
            } else {
                backToTop.classList.remove('is-visible');
            }
        };
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
    }

    // Gallery Lightbox
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    if (galleryGrid && lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightboxCounter = document.getElementById('lightboxCounter');
        const images = Array.from(galleryGrid.querySelectorAll('img'));
        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = (index + images.length) % images.length;
            const img = images[currentIndex];
            const fullSrc = img.src.replace(/w_800,h_600/, 'w_1400,h_1050');
            lightboxImg.src = fullSrc;
            lightboxImg.alt = img.alt;
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            lightboxImg.src = '';
        };

        images.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

});
