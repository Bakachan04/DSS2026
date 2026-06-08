document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initHeroGrid();
  initThemeCards();
  initFeatureSlider();
  initMarquee();
  initLightbox();
  initAccordions();
  initMobileMenu();
  initCountdown();
  initThemeToggle();
});

/**
 * 1. Loading Screen & Text Stagger Animations
 */
function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  const animateTextElements = () => {
    const textContainers = document.querySelectorAll('.animate-text');
    textContainers.forEach((el) => {
      const text = el.innerText;
      el.textContent = '';
      const words = text.split(' ');
      
      words.forEach((word, idx) => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.className = 'stagger-word';
        span.style.transitionDelay = `${idx * 0.05}s`;
        el.appendChild(span);
      });
    });
    
    setTimeout(() => {
      textContainers.forEach(el => el.classList.add('start-anim'));
    }, 100);
  };

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      animateTextElements();
    }, 1500); // 1.5 second loading screen delay for premium impact
  });
}

/**
 * 2. Interactive Background Hover Grid in Hero Section
 */
function initHeroGrid() {
  const gridContainer = document.getElementById('hero-grid');
  if (!gridContainer) return;
  
  const squareSize = 75; // Approximates width/height of grid cells

  function generateGrid() {
    gridContainer.textContent = '';
    
    const cols = Math.floor(window.innerWidth / squareSize);
    const rows = Math.floor(window.innerHeight / squareSize);
    
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    const totalSquares = cols * rows;
    const fragment = document.createDocumentFragment(); // Performance optimization: batch DOM appends
    
    for (let i = 0; i < totalSquares; i++) {
      const square = document.createElement('div');
      square.className = 'grid-square';
      square.id = `square-${i}`;
      
      square.addEventListener('mouseenter', () => {
        square.classList.add('active');
      });
      
      square.addEventListener('mouseleave', () => {
        setTimeout(() => {
          square.classList.remove('active');
        }, 850); // Decay delay creates smooth hover trails
      });
      
      fragment.appendChild(square);
    }
    gridContainer.appendChild(fragment);
  }
  
  generateGrid();
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(generateGrid, 250); // Debounce resize checks
  });
}

/**
 * 3. Draggable Card Stack for Themes (with Keyboard Cycling support)
 */
function initThemeCards() {
  const themeCards = Array.from(document.querySelectorAll('.theme-card'));
  const themesStack = document.getElementById('themes-stack');
  if (themeCards.length === 0 || !themesStack) return;
  if (themesStack.closest('.hidden-section')) return;

  let cardPositions = themeCards.map((_, idx) => idx); // Tracks position indexes (0 to 4)
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let activeCard = null;
  let dragThresholdPassed = false;

  function cycleThemeCards() {
    // Moves the active top card (position 0) to the bottom stack position
    const lastPos = cardPositions.pop();
    cardPositions.unshift(lastPos);
    
    themeCards.forEach((card, index) => {
      // Clear position classes dynamically
      Array.from(card.classList).forEach(cls => {
        if (cls.startsWith('card-pos-')) {
          card.classList.remove(cls);
        }
      });
      
      const pos = cardPositions[index];
      card.classList.add(`card-pos-${pos}`);
      
      // Reset layout offsets applied during drag interaction
      card.style.transform = '';
      card.style.transition = '';
    });
    
    setupDragEvents();
  }

  function onDragStart(e) {
    const card = e.currentTarget;
    if (!card.classList.contains('card-pos-0')) return; // Allow drag only on active top card
    
    isDragging = true;
    dragThresholdPassed = false;
    activeCard = card;
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentX = startX;
    
    card.style.transition = 'none';
    
    if (e.type === 'mousedown') {
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
    } else {
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('touchend', onDragEnd);
    }
  }

  function onDragMove(e) {
    if (!isDragging || !activeCard) return;
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    currentX = clientX;
    
    if (Math.abs(deltaX) > 10) {
      dragThresholdPassed = true; // Prevents triggering click actions on slight drag release
    }
    
    if (e.cancelable) e.preventDefault();
    
    const rotate = -6 + (deltaX * 0.05); // Standard card tilt rotation
    activeCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
  }

  function onDragEnd() {
    if (!isDragging || !activeCard) return;
    isDragging = false;
    
    const deltaX = currentX - startX;
    activeCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    if (Math.abs(deltaX) > 120) {
      cycleThemeCards();
    } else {
      activeCard.style.transform = ''; // Snaps back if swiped insufficiently
    }
    
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    
    setTimeout(() => {
      activeCard = null;
    }, 50);
  }

  // Accessibility: Keyboard swipe trigger handler (Space or Enter keys)
  function onCardKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cycleThemeCards();
      
      // Auto-focus the new active top card so user can continue tab-triggering cycles
      setTimeout(() => {
        const newTopCard = themesStack.querySelector('.theme-card.card-pos-0');
        if (newTopCard) {
          newTopCard.focus();
        }
      }, 100);
    }
  }

  function setupDragEvents() {
    themeCards.forEach(card => {
      card.removeEventListener('mousedown', onDragStart);
      card.removeEventListener('touchstart', onDragStart);
      card.removeEventListener('keydown', onCardKeydown);
      
      if (card.classList.contains('card-pos-0')) {
        card.addEventListener('mousedown', onDragStart);
        card.addEventListener('touchstart', onDragStart);
        card.addEventListener('keydown', onCardKeydown);
      }
    });
  }

  setupDragEvents();

  // Fallback card click behavior for keyboard/click navigation
  themesStack.addEventListener('click', (e) => {
    const card = e.target.closest('.theme-card');
    if (card && card.classList.contains('card-pos-0') && !dragThresholdPassed) {
      cycleThemeCards();
    }
  });
}

/**
 * 4. Features horizontal carousel slider
 */
function initFeatureSlider() {
  const featureTrack = document.getElementById('feature-track');
  const btnPrevFeature = document.getElementById('btn-prev-feature');
  const btnNextFeature = document.getElementById('btn-next-feature');
  const featureCards = document.querySelectorAll('.feature-card'); // Cached query collection
  
  if (!featureTrack || !btnPrevFeature || !btnNextFeature || featureCards.length === 0) return;
  if (featureTrack.closest('.hidden-section')) return;
  
  let currentFeatureIndex = 0;
  const totalFeatures = featureCards.length;
  const gap = 24; // Equivalent to gap-6 (1.5rem / 24px) in layout

  function updateFeatureSlider() {
    const cardWidth = featureCards[0].clientWidth;
    featureTrack.style.transform = `translate3d(-${currentFeatureIndex * (cardWidth + gap)}px, 0, 0)`;
  }

  btnPrevFeature.addEventListener('click', () => {
    if (currentFeatureIndex > 0) {
      currentFeatureIndex--;
      updateFeatureSlider();
    }
  });

  btnNextFeature.addEventListener('click', () => {
    let visibleCards = 3;
    if (window.innerWidth <= 768) visibleCards = 1;
    else if (window.innerWidth <= 1024) visibleCards = 2;
    
    if (currentFeatureIndex < totalFeatures - visibleCards) {
      currentFeatureIndex++;
      updateFeatureSlider();
    }
  });
  
  window.addEventListener('resize', updateFeatureSlider);
}

/**
 * 5. Infinite Photo Marquee Loop Cloner
 */
function initMarquee() {
  const marqueeTrack = document.getElementById('marquee-track');
  if (!marqueeTrack) return;
  if (marqueeTrack.closest('.hidden-section')) return;
  
  // Clones and appends standard list elements to make the scroll seamless
  const children = Array.from(marqueeTrack.children);
  children.forEach(child => {
    marqueeTrack.appendChild(child.cloneNode(true));
  });
}

/**
 * 6. Photo Lightbox Dialog Modal (with Focus Shifting and Alt sync support)
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const marqueeTriggers = document.querySelectorAll('.lightbox-trigger'); // Accessible button triggers
  
  if (!lightbox || !lightboxImg || !lightboxClose || marqueeTriggers.length === 0) return;
  if (lightbox.closest('.hidden-section')) return;

  let lastActiveTrigger = null; // Caches the button focused before modal launch

  marqueeTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const img = trigger.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Classroom expanded view';
        lightbox.classList.add('show');
        lastActiveTrigger = trigger;
        
        // Accessibility: Move focus to Close control inside modal dialog
        setTimeout(() => {
          lightboxClose.focus();
        }, 100);
      }
    });
  });

  const closeLightbox = () => {
    if (lightbox.classList.contains('show')) {
      lightbox.classList.remove('show');
      
      // Accessibility: Return focus back to original trigger button
      if (lastActiveTrigger) {
        lastActiveTrigger.focus();
      }
    }
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

/**
 * 7. Unified Accordion trigger system (Schedule & FAQs with ARIA attributes)
 */
function initAccordions() {
  const accordionTriggers = Array.from(document.querySelectorAll('[data-accordion-trigger]')).filter(trigger => !trigger.closest('.hidden-section'));
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('[data-accordion-item]');
      if (!item) return;
      
      const content = item.querySelector('[data-accordion-content]');
      if (!content) return;
      
      const isActive = item.classList.contains('active');
      const group = item.closest('[data-accordion-group]');
      
      // Close all sister items inside the same section tabs
      if (group) {
        const siblingItems = group.querySelectorAll('[data-accordion-item]');
        siblingItems.forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            
            const siblingTrigger = sibling.querySelector('[data-accordion-trigger]');
            if (siblingTrigger) {
              siblingTrigger.setAttribute('aria-expanded', 'false'); // Sync ARIA collapsed state
            }
            
            const siblingContent = sibling.querySelector('[data-accordion-content]');
            if (siblingContent) {
              siblingContent.style.maxHeight = null;
            }
          }
        });
      }
      
      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true'); // Sync ARIA expanded state
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false'); // Sync ARIA collapsed state
        content.style.maxHeight = null;
      }
    });
  });
}

/**
 * 8. Mobile Navigation Toggle Menu
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  const toggleMenu = () => {
    const isExpanded = navLinks.classList.toggle('mobile-active');
    
    // Toggle navigation symbol visuals and sync ARIA attributes
    menuToggle.textContent = isExpanded ? '\u2715' : '\u2630';
    menuToggle.setAttribute('aria-expanded', isExpanded);
  };
  
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu and restore toggler when standard link item is selected
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
      menuToggle.textContent = '\u2630';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 9. DSS 2026 Countdown Timer
 */
function initCountdown() {
  const countdownContainer = document.getElementById('countdown');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (!countdownContainer || !daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  
  // Set tentative target date: July 1, 2026 at 09:30:00 AM
  const targetDate = new Date('July 1, 2026 09:30:00').getTime();
  
  function updateTimer() {
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }
  
  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 10. Light/Dark Mode (Canvas/Obsidian) Theme Toggle
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleBtn.textContent = '[ CANVAS ]';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggleBtn.textContent = '[ OBSIDIAN ]';
      localStorage.setItem('theme', 'light');
    }
  };

  // Set initial theme
  setTheme(getPreferredTheme());

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  });
}

