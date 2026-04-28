/* ============================================================
   ALIANÇA PÃES E DOCES — Main Script
   ============================================================ */

(function () {
    'use strict';

    // ==================== DOM REFS (declare all up front) ====================
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const sections  = Array.from(document.querySelectorAll('section[id]'));
    const floatBtn  = document.querySelector('.whatsapp-float');
    const heroSection = document.querySelector('.hero');

    // ==================== ACTIVE NAV LINK ====================
    function updateActiveNavLink() {
        const scrollMid = window.scrollY + window.innerHeight * 0.38;
        let activeId = null;

        for (const section of sections) {
            if (scrollMid >= section.offsetTop) {
                activeId = section.id;
            }
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            const matches = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', matches);
        });
    }

    // ==================== NAVBAR SCROLL STATE ====================
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        updateActiveNavLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load (sections is now defined above)

    // ==================== MOBILE MENU ====================
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-label', 'Abrir menu');
        });
    });

    document.addEventListener('click', e => {
        if (!navbar.contains(e.target)) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
        }
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 8;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ==================== INTERSECTION OBSERVER (FADE-IN) ====================
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        if (!el.closest('.hero')) {
            animObserver.observe(el);
        }
    });

    // ==================== FLOATING BUTTON HIDE ON HERO ====================
    if (floatBtn && heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            const heroVisible = entries[0].isIntersecting;
            floatBtn.style.opacity       = heroVisible ? '0' : '1';
            floatBtn.style.pointerEvents = heroVisible ? 'none' : 'auto';
        }, { threshold: 0.4 });
        heroObserver.observe(heroSection);
    }

})();
