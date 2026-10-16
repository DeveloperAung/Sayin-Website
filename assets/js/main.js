/**
 * Sayin Marketing Site – Vanilla JavaScript
 * Features: Bilingual Toggle (EN / မြန်မာ), Dark/Light Theme Switcher,
 * Interactive Phone Mockups, Touch-enabled Carousel, Mobile Menu.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Language Toggle (EN / မြန်မာ)
  // --------------------------------------------------------------------------
  const STORAGE_KEY_LANG = 'sayin_lang';
  const STORAGE_KEY_THEME = 'sayin_theme';

  function getInitialLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'my' || saved === 'en') return saved;
    // Default to browser language
    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return navLang.startsWith('my') ? 'my' : 'en';
  }

  function setLanguage(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);

    // Update segmented buttons
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const targetLang = btn.getAttribute('data-lang-btn');
      if (targetLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Dispatch event
    window.dispatchEvent(new CustomEvent('sayin:languagechange', { detail: { lang } }));
  }

  // --------------------------------------------------------------------------
  // 2. Dark / Light Theme Toggle
  // --------------------------------------------------------------------------
  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to system preference; dark private banking feel is default fallback
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      const sunIcon = themeToggleBtn.querySelector('.icon-sun');
      const moonIcon = themeToggleBtn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        } else {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. Carousel Component
  // --------------------------------------------------------------------------
  function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!track) return;

    const slides = Array.from(track.children);
    const totalSlides = slides.length;
    let currentIndex = 0;

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function goToSlide(idx) {
      currentIndex = (idx + totalSlides) % totalSlides;
      updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        goToSlide(currentIndex + 1); // Swipe left -> next
      } else if (touchEndX > touchStartX + threshold) {
        goToSlide(currentIndex - 1); // Swipe right -> prev
      }
    }

    // Keyboard navigation when carousel in viewport
    document.addEventListener('keydown', (e) => {
      const carouselSec = document.getElementById('screenshots');
      if (!carouselSec) return;
      const rect = carouselSec.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Hero Screen Switcher (Bilingual)
  // --------------------------------------------------------------------------
  function updateHeroMockupScreen() {
    const heroMockupImg = document.getElementById('hero-mockup-img');
    const activePill = document.querySelector('.mockup-pill-btn.active');
    if (!heroMockupImg || !activePill) return;

    const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
    const screenName = currentLang === 'my'
      ? (activePill.getAttribute('data-screen-my') || activePill.getAttribute('data-screen'))
      : (activePill.getAttribute('data-screen-en') || activePill.getAttribute('data-screen'));

    if (screenName) {
      heroMockupImg.src = `/assets/screens/${screenName}`;
    }
  }

  function initHeroScreenSwitcher() {
    const heroMockupImg = document.getElementById('hero-mockup-img');
    const heroPills = document.querySelectorAll('.mockup-pill-btn');
    if (!heroMockupImg || !heroPills.length) return;

    heroPills.forEach(pill => {
      pill.addEventListener('click', () => {
        heroPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        const currentLang = document.documentElement.getAttribute('data-lang') || 'en';
        const screenName = currentLang === 'my'
          ? (pill.getAttribute('data-screen-my') || pill.getAttribute('data-screen'))
          : (pill.getAttribute('data-screen-en') || pill.getAttribute('data-screen'));

        // Smooth subtle fade
        heroMockupImg.style.opacity = '0.4';
        setTimeout(() => {
          if (screenName) heroMockupImg.src = `/assets/screens/${screenName}`;
          heroMockupImg.style.opacity = '1';
        }, 100);
      });
    });

    // Listen to language switch event to refresh active mockup image
    window.addEventListener('sayin:languagechange', () => {
      updateHeroMockupScreen();
    });
  }

  // --------------------------------------------------------------------------
  // 5. Mobile Navigation Menu
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Init on DOM Ready
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Language init
    setLanguage(getInitialLanguage());
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang-btn'));
      });
    });

    // 2. Theme init
    setTheme(getInitialTheme());
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Listen for OS theme preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY_THEME)) {
          setTheme(e.matches ? 'light' : 'dark');
        }
      });
    }

    // 3. Components
    initCarousel();
    initHeroScreenSwitcher();
    initMobileMenu();

    // 4. Handle Hash scroll jump (especially /privacy-policy#my)
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          if (window.location.hash === '#my') {
            setLanguage('my');
          }
        }
      }, 150);
    }
  });
})();
