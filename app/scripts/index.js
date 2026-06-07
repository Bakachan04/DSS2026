document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Loading Screen Fade-out & Text Animations
  const animateTextElements = () => {
    const elements = document.querySelectorAll('.animate-text');
    elements.forEach((el) => {
      const text = el.innerText;
      el.innerHTML = '';
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
      elements.forEach(el => el.classList.add('start-anim'));
    }, 100);
  };

  window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    setTimeout(() => {
      if (loader) {
        loader.classList.add('fade-out');
      }
      animateTextElements();
    }, 1500); // Show loading screen for 1.5 seconds for visual effect
  });

  // 2. Interactive Background Grid in Hero Section
  const gridContainer = document.getElementById('hero-grid');
  
  function generateGrid() {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    
    // Grid box size is approximately 75px
    const squareSize = 75;
    const cols = Math.floor(window.innerWidth / squareSize);
    const rows = Math.floor(window.innerHeight / squareSize);
    
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    const totalSquares = cols * rows;
    for (let i = 0; i < totalSquares; i++) {
      const square = document.createElement('div');
      square.className = 'grid-square';
      square.id = `square-${i}`;
      
      // Add hover lights up effect
      square.addEventListener('mouseenter', () => {
        square.classList.add('active');
      });
      
      square.addEventListener('mouseleave', () => {
        // Delay removal for smooth trail effect
        setTimeout(() => {
          square.classList.remove('active');
        }, 850);
      });
      
      gridContainer.appendChild(square);
    }
  }
  
  generateGrid();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(generateGrid, 250);
  });

  // 3. Stacked Theme Cards Drag & Swipe Cycling
  const themeCards = Array.from(document.querySelectorAll('.theme-card'));
  const themesStack = document.getElementById('themes-stack');
  let cardPositions = themeCards.map((_, idx) => idx); // Dynamically set positions array

  function cycleThemeCards() {
    if (themeCards.length === 0) return;
    
    // Cycle: pop last position and put it at the start
    const lastPos = cardPositions.pop();
    cardPositions.unshift(lastPos);
    
    themeCards.forEach((card, index) => {
      // Convert classList to static array before removing items to avoid live collection mutation bugs
      Array.from(card.classList).forEach(cls => {
        if (cls.startsWith('card-pos-')) {
          card.classList.remove(cls);
        }
      });
      const pos = cardPositions[index];
      card.classList.add(`card-pos-${pos}`);
      
      // Inline style cleanup
      card.style.transform = '';
      card.style.transition = '';
      
      // Indigo background card gets white text
      if (card.classList.contains('bg-indigo-500')) {
        card.classList.add('text-white');
      } else {
        card.classList.remove('text-white');
      }
    });
    
    setupDragEvents();
  }

  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let activeCard = null;
  let dragThresholdPassed = false;

  function onDragStart(e) {
    const card = e.currentTarget;
    if (!card.classList.contains('card-pos-0')) return;
    
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
      dragThresholdPassed = true;
    }
    
    if (e.cancelable) e.preventDefault();
    
    const rotate = -6 + (deltaX * 0.05);
    activeCard.style.transform = `translate3d(${deltaX}px, 0, 0) rotate(${rotate}deg)`;
  }

  function onDragEnd(e) {
    if (!isDragging || !activeCard) return;
    isDragging = false;
    
    const deltaX = currentX - startX;
    
    activeCard.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    if (Math.abs(deltaX) > 120) {
      cycleThemeCards();
    } else {
      activeCard.style.transform = '';
    }
    
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    
    // Tiny timeout to prevent triggering standard click immediately after drag
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

  if (themesStack) {
    setupDragEvents();
    
    // Fallback click on active card to cycle it
    themesStack.addEventListener('click', (e) => {
      const card = e.target.closest('.theme-card');
      if (card && card.classList.contains('card-pos-0') && !dragThresholdPassed) {
        cycleThemeCards();
      }
    });
  }

  // 4. Features Slider Controls
  const featureTrack = document.getElementById('feature-track');
  const btnPrevFeature = document.getElementById('btn-prev-feature');
  const btnNextFeature = document.getElementById('btn-next-feature');
  let currentFeatureIndex = 0;
  const totalFeatures = document.querySelectorAll('.feature-card').length;

  function updateFeatureSlider() {
    if (!featureTrack) return;
    const cards = document.querySelectorAll('.feature-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].clientWidth;
    const gap = 24; // 1.5rem gap matches CSS gap-6
    
    featureTrack.style.transform = `translate3d(-${currentFeatureIndex * (cardWidth + gap)}px, 0, 0)`;
  }

  if (btnPrevFeature && btnNextFeature) {
    btnPrevFeature.addEventListener('click', () => {
      if (currentFeatureIndex > 0) {
        currentFeatureIndex--;
        updateFeatureSlider();
      }
    });

    btnNextFeature.addEventListener('click', () => {
      // Determine visible cards based on screen size
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

  // 5. Infinite Marquee Clone for Classroom Photos
  const marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack) {
    // Clone all items in track to make the marquee loop infinitely and seamlessly
    const items = marqueeTrack.innerHTML;
    marqueeTrack.innerHTML = items + items;
  }

  // 6. Lightbox Modal
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const carouselImages = document.querySelectorAll('.marquee-item img');

  carouselImages.forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('show');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('show');
    });
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('show');
      }
    });
  }

  // 7. Accordion system for Schedule and FAQs (Unified data-attribute logic)
  const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('[data-accordion-item]');
      if (!item) return;
      
      const content = item.querySelector('[data-accordion-content]');
      if (!content) return;
      
      const isActive = item.classList.contains('active');
      
      // Optional: Close sibling items within the same accordion group
      const group = item.closest('[data-accordion-group]');
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
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });

  // 8. Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      
      // Toggle menu icon between bars and times (close)
      if (navLinks.classList.contains('mobile-active')) {
        menuToggle.innerHTML = '&#x2715;'; // Close multiplication symbol
      } else {
        menuToggle.innerHTML = '&#9776;'; // Hamburger symbol
      }
    });
    
    // Close mobile menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        menuToggle.innerHTML = '&#9776;';
      });
    });
  }
});
