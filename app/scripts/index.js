document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initHeroGrid();
  initThemeCards();
  initFeatureSlider();
  initMarquee();
  initLightbox();
  initAccordions();
  initMobileMenu();
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
 * 3. Draggable Card Stack for Themes
 */
function initThemeCards() {
  const themeCards = Array.from(document.querySelectorAll('.theme-card'));
  const themesStack = document.getElementById('themes-stack');
  if (themeCards.length === 0 || !themesStack) return;

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

  function setupDragEvents() {
    themeCards.forEach(card => {
      card.removeEventListener('mousedown', onDragStart);
      card.removeEventListener('touchstart', onDragStart);
      
      if (card.classList.contains('card-pos-0')) {
        card.addEventListener('mousedown', onDragStart);
        card.addEventListener('touchstart', onDragStart);
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
  
  // Clones and appends standard list elements to make the scroll seamless
  const children = Array.from(marqueeTrack.children);
  children.forEach(child => {
    marqueeTrack.appendChild(child.cloneNode(true));
  });
}

/**
 * 6. Photo Lightbox Dialog Modal
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const marqueeImages = document.querySelectorAll('.marquee-item img');
  
  if (!lightbox || !lightboxImg || !lightboxClose || marqueeImages.length === 0) return;

  marqueeImages.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
    });
  });

  const closeLightbox = () => lightbox.classList.remove('show');

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Accessibility improvement: Close on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      closeLightbox();
    }
  });
}

/**
 * 7. Unified Accordion trigger system (Schedule & FAQs)
 */
function initAccordions() {
  const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
  
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
            const siblingContent = sibling.querySelector('[data-accordion-content]');
            if (siblingContent) {
              siblingContent.style.maxHeight = null;
            }
          }
        });
      }
      
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
      } else {
        item.classList.remove('active');
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
    
    // Toggle navigation symbol visuals
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
