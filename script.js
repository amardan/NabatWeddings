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


    // Path routing map for homepage sections
    const pathToSectionMap = {
        '/about': 'about',
        '/process': 'process',
        '/experience': 'experience',
        '/collections': 'collections',
        '/packages': 'collections',
        '/locations': 'locations-preview',
        '/gallery': 'gallery',
        '/love-stories': 'testimonials',
        '/testimonials': 'testimonials',
        '/reviews': 'testimonials',
        '/blog': 'blog',
        '/faq': 'faq',
        '/contact': 'contact'
    };

    // Standalone hub pages have their own distinct HTML documents.
    // On the homepage, scrolling/clicking to their preview sections uses hash URLs
    // so that CTA links (like /collections/#local) and page refreshes work properly.
    const standaloneSectionIds = new Set(['collections', 'locations-preview', 'blog']);

    const hashToNavPath = {
        '#about': '/about',
        '#process': '/process',
        '#experience': '/experience',
        '#collections': '/collections',
        '#locations-preview': '/locations',
        '#gallery': '/gallery',
        '#testimonials': '/love-stories',
        '#blog': '/blog',
        '#faq': '/faq',
        '#contact': '/contact'
    };

    function getSectionIdFromPath(path, hash = '') {
        if (hash && hashToNavPath[hash]) {
            return hash.slice(1);
        }
        if (path === '/#locations-preview') {
            return 'locations-preview';
        }
        if (path && path.startsWith('/#')) {
            const h = path.slice(1);
            if (hashToNavPath[h]) return h.slice(1);
        }
        const cleanPath = (path || '').split('#')[0].split('?')[0].toLowerCase().replace(/\/$/, '');
        if (cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html') {
            return 'home';
        }
        return pathToSectionMap[cleanPath] || null;
    }

    function getHistoryUrlForSection(sectionId, fallbackHref) {
        if (sectionId === 'home') return '/';
        if (standaloneSectionIds.has(sectionId)) {
            return '/#' + sectionId;
        }
        return fallbackHref || '/';
    }

    function getCanonicalNavPath(path, hash = '') {
        if (path === '/#locations-preview' || hash === '#locations-preview') {
            return '/locations';
        }
        if (path && path.startsWith('/#')) {
            const h = path.slice(1);
            if (hashToNavPath[h]) return hashToNavPath[h];
        }
        if (hash && hashToNavPath[hash]) {
            return hashToNavPath[hash];
        }
        const cleanPath = (path || '/').split('#')[0].split('?')[0].toLowerCase().replace(/\/$/, '') || '/';
        if (cleanPath === '/index.html') return '/';
        if (cleanPath === '/packages') return '/collections';
        if (cleanPath === '/testimonials' || cleanPath === '/reviews') return '/love-stories';
        if (cleanPath.startsWith('/blog/')) return '/blog';
        if (cleanPath.startsWith('/locations/')) return '/locations';
        return cleanPath;
    }

    function updateActiveNavLink(path, hash = '') {
        const activeTarget = getCanonicalNavPath(path, hash);
        const navLinks = document.querySelectorAll('.desktop-nav a');
        navLinks.forEach(link => {
            const linkTarget = getCanonicalNavPath(link.getAttribute('href') || '');
            if (linkTarget === activeTarget && activeTarget !== '/') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Scroll to section based on current path/hash on page load
    const isHomePage = !!document.getElementById('home');
    const initialPath = window.location.pathname;
    const initialHash = window.location.hash;
    const initialSectionId = getSectionIdFromPath(initialPath, initialHash);
    if (isHomePage && initialSectionId && initialSectionId !== 'home') {
        const targetElement = document.getElementById(initialSectionId);
        if (targetElement) {
            // Wait slightly for fonts and layout to settle before scrolling
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'auto' });
                updateActiveNavLink(initialPath, initialHash);
            }, 150);
        }
    } else {
        updateActiveNavLink(initialPath, initialHash);
    }

    // Intercept navigation link clicks on the homepage experience
    let isScrollingToTarget = false;
    document.querySelectorAll('.desktop-nav a, .btn-outline, .hero-content a').forEach(link => {
        const rawHref = link.getAttribute('href');
        if (rawHref && rawHref.startsWith('/')) {
            const sectionId = getSectionIdFromPath(rawHref);
            if (sectionId) {
                link.addEventListener('click', (e) => {
                    const targetExists = sectionId === 'home' ? isHomePage : (isHomePage && !!document.getElementById(sectionId));
                    if (!targetExists) {
                        return; // Let standard browser navigation happen on standalone pages
                    }
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
                    const historyUrl = getHistoryUrlForSection(sectionId, rawHref);
                    window.history.pushState(null, '', historyUrl);
                    updateActiveNavLink(rawHref);
                    
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
        const hash = window.location.hash;
        const sectionId = getSectionIdFromPath(path, hash);
        if (isHomePage && sectionId) {
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.getElementById(sectionId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
            updateActiveNavLink(path, hash);
        } else {
            updateActiveNavLink(path, hash);
        }
    });

    // Highlight active section on scroll using IntersectionObserver (homepage only)
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
                let navPath = '/';
                for (const [p, sId] of Object.entries(pathToSectionMap)) {
                    if (sId === sectionId) {
                        navPath = p + '/';
                        break;
                    }
                }
                const historyUrl = getHistoryUrlForSection(sectionId, navPath);
                const currentUrl = window.location.pathname + window.location.hash;
                if (currentUrl !== historyUrl) {
                    window.history.replaceState(null, '', historyUrl);
                }
                updateActiveNavLink(navPath);
            }
        });
    }, sectionObserverOptions);

    if (isHomePage) {
        Object.values(pathToSectionMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) sectionObserver.observe(el);
        });
        const homeEl = document.getElementById('home');
        if (homeEl) sectionObserver.observe(homeEl);
    }

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

    // Scroll progress indicator and vertical diamond timeline
    const scrollProgress = document.getElementById('scrollProgress');
    const timelineDiamond = document.getElementById('timelineDiamond');
    if (scrollProgress || timelineDiamond) {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            
            if (scrollProgress) {
                scrollProgress.style.width = pct + '%';
            }
            if (timelineDiamond) {
                // JS fallback for browsers that don't support native CSS scroll-driven animations
                if (!CSS.supports('animation-timeline: scroll()')) {
                    timelineDiamond.style.top = pct + '%';
                }
            }
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

    // Respect prefers-reduced-motion for background hero video
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo && window.matchMedia) {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionPreference = (mq) => {
            if (mq.matches) {
                heroVideo.pause();
                heroVideo.removeAttribute('autoplay');
            }
        };
        handleMotionPreference(motionQuery);
        if (typeof motionQuery.addEventListener === 'function') {
            motionQuery.addEventListener('change', handleMotionPreference);
        }
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
        const focusableControls = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
        let currentIndex = 0;
        let lastFocusedElement = null;

        const showImage = (index) => {
            currentIndex = (index + images.length) % images.length;
            const img = images[currentIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
        };

        const openLightbox = (index) => {
            lastFocusedElement = document.activeElement;
            showImage(index);
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (lightboxClose) {
                setTimeout(() => lightboxClose.focus(), 50);
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            lightboxImg.src = '';
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            } else if (images[currentIndex]) {
                images[currentIndex].focus();
            }
        };

        images.forEach((img, index) => {
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.addEventListener('click', () => openLightbox(index));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            } else if (e.key === 'Tab' && focusableControls.length > 0) {
                const first = focusableControls[0];
                const last = focusableControls[focusableControls.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }

});
