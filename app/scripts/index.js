document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initHeroGrid();
  initThemeCards();
  initFeatureSlider();
  initMarquee();
  initLightbox();
  initMobileMenu();
  initThemeToggle();
  initLegacyCarousel();
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
      toggleBtn.setAttribute('aria-pressed', 'true');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      toggleBtn.setAttribute('aria-pressed', 'false');
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

/**
 * 11. DSS Legacy horizontal carousel storytelling interactions
 */
function initLegacyCarousel() {
  const track = document.getElementById('legacy-carousel-track');
  const prevBtn = document.getElementById('legacy-prev');
  const nextBtn = document.getElementById('legacy-next');
  const progressBar = document.getElementById('legacy-progress-bar');
  
  if (!track) return;

  // 1. Dynamic Cloning
  const originalPanels = Array.from(track.querySelectorAll('.legacy-story-panel'));
  const N = originalPanels.length;
  if (N === 0) return;

  // Clone first panel and append to end
  const firstClone = originalPanels[0].cloneNode(true);
  firstClone.classList.add('is-clone');
  track.appendChild(firstClone);

  // Clone last panel and prepend to start
  const lastClone = originalPanels[N - 1].cloneNode(true);
  lastClone.classList.add('is-clone');
  track.insertBefore(lastClone, originalPanels[0]);

  // Helper function to get target scrollLeft to center a panel
  const getPanelScrollPosition = (panel) => {
    return panel.offsetLeft - (track.clientWidth - panel.clientWidth) / 2;
  };

  // Helper to get scroll position of first and last real panels
  const getFirstRealScroll = () => getPanelScrollPosition(track.children[1]);
  const getLastRealScroll = () => getPanelScrollPosition(track.children[track.children.length - 2]);

  // 2. Progress Bar update
  const updateProgress = () => {
    if (!progressBar) return;
    const firstRealScroll = getFirstRealScroll();
    const lastRealScroll = getLastRealScroll();
    const range = lastRealScroll - firstRealScroll;
    
    if (range <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    
    let percent = ((track.scrollLeft - firstRealScroll) / range) * 100;
    percent = Math.max(0, Math.min(100, percent));
    progressBar.style.width = `${percent}%`;
  };

  // 3. Scroll End Handler (Infinite Loop jump)
  let scrollTimeout;
  const handleScrollEnd = () => {
    if (isDown) return; // Do not jump during active mouse drag

    const children = Array.from(track.children);
    let closestIdx = 1;
    let minDiff = Infinity;

    children.forEach((panel, idx) => {
      const targetScroll = getPanelScrollPosition(panel);
      const diff = Math.abs(track.scrollLeft - targetScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (closestIdx === 0) {
      // Snapped to first clone (clone of last panel) -> jump to real last panel
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = getPanelScrollPosition(children[children.length - 2]);
      
      // Force layout recalculation and restore snap in next frame/tick
      track.getBoundingClientRect();
      setTimeout(() => {
        track.style.scrollSnapType = 'x mandatory';
        track.style.scrollBehavior = 'smooth';
      }, 50);
    } else if (closestIdx === children.length - 1) {
      // Snapped to last clone (clone of first panel) -> jump to real first panel
      track.style.scrollSnapType = 'none';
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = getPanelScrollPosition(children[1]);
      
      // Force layout recalculation and restore snap in next frame/tick
      track.getBoundingClientRect();
      setTimeout(() => {
        track.style.scrollSnapType = 'x mandatory';
        track.style.scrollBehavior = 'smooth';
      }, 50);
    }
    
    updateProgress();
  };

  // Scroll event listener
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScrollEnd, 100);
    updateProgress();
  });

  window.addEventListener('scroll', updateProgress); // backup refresh
  
  // Handle viewport resizing gracefully
  window.addEventListener('resize', () => {
    const children = Array.from(track.children);
    let closestIdx = 1;
    let minDiff = Infinity;
    
    // Find closest panel before resize adjustment
    children.forEach((panel, idx) => {
      const targetScroll = getPanelScrollPosition(panel);
      const diff = Math.abs(track.scrollLeft - targetScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    // Snap exactly to that panel in the resized container
    track.style.scrollSnapType = 'none';
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = getPanelScrollPosition(children[closestIdx]);
    
    track.getBoundingClientRect();
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollBehavior = 'smooth';

    updateProgress();
  });

  // 4. Drag to scroll interactivity
  let isDown = false;
  let startX;
  let scrollLeft;
  
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('active');
    // Temporarily disable scroll-snap during dragging for buttery fluidity
    track.style.scrollSnapType = 'none';
    track.style.scrollBehavior = 'auto';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  
  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('active');
    // Restore snap behavior
    track.style.scrollSnapType = 'x mandatory';
    track.style.scrollBehavior = 'smooth';
    
    // Trigger scroll end check with delay to allow snap animation to finish
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScrollEnd, 150);
  };

  track.addEventListener('mouseleave', endDrag);
  track.addEventListener('mouseup', endDrag);
  
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    track.scrollLeft = scrollLeft - walk;
    updateProgress();
  });
  
  // Helper to find the closest panel index
  const getClosestIdx = () => {
    const children = Array.from(track.children);
    let closestIdx = 1;
    let minDiff = Infinity;
    children.forEach((panel, idx) => {
      const targetScroll = getPanelScrollPosition(panel);
      const diff = Math.abs(track.scrollLeft - targetScroll);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return closestIdx;
  };

  // 5. Navigation arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const children = Array.from(track.children);
      const currentIdx = getClosestIdx();
      const targetIdx = currentIdx - 1;
      if (targetIdx < 0) return;
      
      const targetScroll = getPanelScrollPosition(children[targetIdx]);
      track.style.scrollBehavior = 'smooth';
      track.scrollLeft = targetScroll;
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const children = Array.from(track.children);
      const currentIdx = getClosestIdx();
      const targetIdx = currentIdx + 1;
      if (targetIdx >= children.length) return;
      
      const targetScroll = getPanelScrollPosition(children[targetIdx]);
      track.style.scrollBehavior = 'smooth';
      track.scrollLeft = targetScroll;
    });
  }
  
  // Initialize to show the first real card (index 1) centered
  const initializePosition = () => {
    const firstRealPanel = track.children[1];
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = getPanelScrollPosition(firstRealPanel);
    updateProgress();
  };
  
  // Delay initialization slightly to ensure offsetLayout calculations are correct
  setTimeout(initializePosition, 100);
}

