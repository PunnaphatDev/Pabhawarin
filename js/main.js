/**
 * Main Interactive Scripts for Pabhawarin Website
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Mobile Menu Dropdown
  // ==========================================================================
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('max-h-0');
      mobileMenu.classList.toggle('max-h-screen');
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('max-h-0');
        mobileMenu.classList.remove('max-h-screen');
      });
    });
  }

  // ==========================================================================
  // Projects Carousel (Mobile: 1 card per slide [8 slides], Desktop: 4 cards per slide [2 slides])
  // ==========================================================================
  let currentProjectSlide = 0;
  const projectTrack = document.getElementById('project-carousel-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const dotsWrapper = document.getElementById('project-carousel-dots');

  function isMobileSingleCardMode() {
    return window.innerWidth < 640;
  }

  function getTotalProjectSlides() {
    return isMobileSingleCardMode() ? 8 : 2;
  }

  let lastTotalSlides = 0;

  function renderCarouselDots(totalSlides) {
    if (!dotsWrapper) return;
    if (lastTotalSlides === totalSlides && dotsWrapper.children.length === totalSlides) return;
    lastTotalSlides = totalSlides;

    dotsWrapper.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', totalSlides === 8 ? `โครงการที่ ${i + 1}` : `หน้า ${i + 1}`);
      btn.addEventListener('click', () => goToProjectSlide(i));
      dotsWrapper.appendChild(btn);
    }
  }

  function updateCarouselUI() {
    if (!projectTrack) return;

    const totalProjectSlides = getTotalProjectSlides();
    if (currentProjectSlide >= totalProjectSlides) {
      currentProjectSlide = totalProjectSlides - 1;
    }

    renderCarouselDots(totalProjectSlides);

    // Slide transform
    projectTrack.style.transform = `translateX(-${currentProjectSlide * 100}%)`;

    // Update Button states
    if (prevBtn) {
      prevBtn.disabled = currentProjectSlide === 0;
      if (currentProjectSlide === 0) {
        prevBtn.classList.add('opacity-30', 'pointer-events-none');
      } else {
        prevBtn.classList.remove('opacity-30', 'pointer-events-none');
      }
    }

    if (nextBtn) {
      nextBtn.disabled = currentProjectSlide === totalProjectSlides - 1;
      if (currentProjectSlide === totalProjectSlides - 1) {
        nextBtn.classList.add('opacity-30', 'pointer-events-none');
      } else {
        nextBtn.classList.remove('opacity-30', 'pointer-events-none');
      }
    }

    // Update Pagination Dots active state
    if (dotsWrapper) {
      Array.from(dotsWrapper.children).forEach((dot, idx) => {
        dot.className = idx === currentProjectSlide
          ? 'h-3 w-8 rounded-full bg-[#404E3F] transition-all cursor-pointer shadow-sm'
          : 'h-3 w-3 rounded-full bg-[#D6CEBC] hover:bg-[#b8ae98] transition-all cursor-pointer';
      });
    }
  }

  function goToProjectSlide(index) {
    const totalProjectSlides = getTotalProjectSlides();
    currentProjectSlide = Math.max(0, Math.min(index, totalProjectSlides - 1));
    updateCarouselUI();
  }

  function nextProjectSlide() {
    const totalProjectSlides = getTotalProjectSlides();
    if (currentProjectSlide < totalProjectSlides - 1) {
      currentProjectSlide++;
      updateCarouselUI();
    }
  }

  function prevProjectSlide() {
    if (currentProjectSlide > 0) {
      currentProjectSlide--;
      updateCarouselUI();
    }
  }

  // Handle switching between mobile (8 slides) and desktop (2 slides) on resize
  let wasMobileMode = isMobileSingleCardMode();
  window.addEventListener('resize', () => {
    const nowMobileMode = isMobileSingleCardMode();
    if (nowMobileMode !== wasMobileMode) {
      if (nowMobileMode) {
        currentProjectSlide = currentProjectSlide * 4;
      } else {
        currentProjectSlide = Math.floor(currentProjectSlide / 4);
      }
      wasMobileMode = nowMobileMode;
      updateCarouselUI();
    }
  });

  // Expose carousel functions to global scope for HTML onclick attributes
  window.nextProjectSlide = nextProjectSlide;
  window.prevProjectSlide = prevProjectSlide;
  window.goToProjectSlide = goToProjectSlide;

  // Touch Swipe Gesture Support on Project Track
  let didSwipeProjectTrack = false;
  if (projectTrack) {
    let touchStartX = 0;
    let touchStartY = 0;

    projectTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      didSwipeProjectTrack = false;
    }, { passive: true });

    projectTrack.addEventListener('touchend', (e) => {
      const diffX = touchStartX - e.changedTouches[0].screenX;
      const diffY = touchStartY - e.changedTouches[0].screenY;
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        didSwipeProjectTrack = true;
        if (diffX > 0) {
          nextProjectSlide();
        } else {
          prevProjectSlide();
        }
      }
    }, { passive: true });
  }

  // Initialize Carousel
  updateCarouselUI();

  // ==========================================================================
  // Responsive Lightbox Modal (Desktop + Mobile Touch Swipe)
  // ==========================================================================
  const lightboxModal = document.createElement('div');
  lightboxModal.id = 'project-lightbox-modal';
  lightboxModal.className = 'fixed inset-0 z-[9999] hidden bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 select-none opacity-0 transition-opacity duration-300';
  lightboxModal.innerHTML = `
    <div class="relative w-full max-w-4xl flex flex-col items-center">
      <!-- Top Bar: Title, Counter & Close -->
      <div class="w-full flex items-center justify-between text-white mb-3 px-1">
        <div>
          <h3 id="lightbox-title" class="font-77-bdcond text-[26px] sm:text-[32px] font-bold tracking-wide leading-none"></h3>
          <span id="lightbox-counter" class="text-[18px] sm:text-[20px] text-white/75"></span>
        </div>
        <button id="lightbox-close" class="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-xl cursor-pointer transition" aria-label="ปิด">
          ✕
        </button>
      </div>

      <!-- Main Image Viewport -->
      <div id="lightbox-viewport" class="relative w-full aspect-[4/3] max-h-[68vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
        <img id="lightbox-main-img" src="" alt="" class="w-full h-full object-contain transition-opacity duration-300">
        
        <button id="lightbox-prev" class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center cursor-pointer transition shadow-md" aria-label="รูปก่อนหน้า">
          <svg class="w-6 h-6 fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button id="lightbox-next" class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center cursor-pointer transition shadow-md" aria-label="รูปถัดไป">
          <svg class="w-6 h-6 fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Thumbnails Strip -->
      <div id="lightbox-thumbs" class="flex items-center justify-center gap-2.5 mt-4 overflow-x-auto max-w-full py-1 px-2"></div>
    </div>
  `;
  document.body.appendChild(lightboxModal);

  let lbImages = [];
  let lbIndex = 0;
  let lbTitle = '';

  const lbMainImg = document.getElementById('lightbox-main-img');
  const lbTitleEl = document.getElementById('lightbox-title');
  const lbCounterEl = document.getElementById('lightbox-counter');
  const lbThumbsEl = document.getElementById('lightbox-thumbs');
  const lbPrevBtn = document.getElementById('lightbox-prev');
  const lbNextBtn = document.getElementById('lightbox-next');
  const lbCloseBtn = document.getElementById('lightbox-close');
  const lbViewport = document.getElementById('lightbox-viewport');

  function renderLightbox() {
    if (!lbImages.length) return;
    lbMainImg.src = lbImages[lbIndex];
    lbTitleEl.textContent = lbTitle;
    lbCounterEl.textContent = `ภาพที่ ${lbIndex + 1} จาก ${lbImages.length}`;

    if (lbImages.length <= 1) {
      lbPrevBtn.classList.add('hidden');
      lbNextBtn.classList.add('hidden');
      lbThumbsEl.classList.add('hidden');
    } else {
      lbPrevBtn.classList.remove('hidden');
      lbNextBtn.classList.remove('hidden');
      lbThumbsEl.classList.remove('hidden');
    }

    lbThumbsEl.innerHTML = '';
    lbImages.forEach((src, idx) => {
      const thumb = document.createElement('button');
      thumb.className = idx === lbIndex
        ? 'w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 border-white scale-105 transition cursor-pointer shrink-0 shadow'
        : 'w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 border-transparent opacity-55 hover:opacity-90 transition cursor-pointer shrink-0';
      thumb.innerHTML = `<img src="${src}" alt="" class="w-full h-full object-cover">`;
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = idx;
        renderLightbox();
      });
      lbThumbsEl.appendChild(thumb);
    });
  }

  function openLightbox(imagesArr, startIndex, title) {
    lbImages = imagesArr;
    lbIndex = startIndex;
    lbTitle = title;
    renderLightbox();
    lightboxModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      lightboxModal.classList.remove('opacity-0');
      lightboxModal.classList.add('opacity-100');
    });
  }

  function closeLightbox() {
    lightboxModal.classList.remove('opacity-100');
    lightboxModal.classList.add('opacity-0');
    setTimeout(() => {
      lightboxModal.classList.add('hidden');
    }, 250);
  }

  lbCloseBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  lbPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    renderLightbox();
  });

  lbNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    lbIndex = (lbIndex + 1) % lbImages.length;
    renderLightbox();
  });

  // Keyboard support for Lightbox
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
      lbIndex = (lbIndex + 1) % lbImages.length;
      renderLightbox();
    }
    if (e.key === 'ArrowLeft') {
      lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      renderLightbox();
    }
  });

  // Touch Swipe inside Lightbox
  let lbTouchStartX = 0;
  lbViewport.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lbViewport.addEventListener('touchend', (e) => {
    const diff = lbTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40 && lbImages.length > 1) {
      if (diff > 0) {
        lbIndex = (lbIndex + 1) % lbImages.length;
      } else {
        lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
      }
      renderLightbox();
    }
  }, { passive: true });

  // ==========================================================================
  // Project Card Gallery (Desktop Hover + Tap Arrows/Dots + Lightbox Trigger)
  // ==========================================================================
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    const gallery = card.querySelector('.project-image-gallery');
    if (!gallery) return;

    const images = gallery.querySelectorAll('.gallery-img');
    const cardTitleEl = card.querySelector('h4');
    const cardTitle = cardTitleEl ? cardTitleEl.textContent.trim() : '';
    const imgSrcList = Array.from(images).map(img => img.getAttribute('src'));

    gallery.classList.add('cursor-pointer');

    let currentImgIndex = 0;
    let hoverInterval = null;

    gallery.addEventListener('click', () => {
      if (didSwipeProjectTrack) {
        didSwipeProjectTrack = false;
        return;
      }
      openLightbox(imgSrcList, currentImgIndex, cardTitle);
    });

    if (images.length <= 1) return;

    // Prev/Next Tap Arrows on Card Image
    const cardPrevBtn = document.createElement('button');
    cardPrevBtn.type = 'button';
    cardPrevBtn.className = 'absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow';
    cardPrevBtn.setAttribute('aria-label', 'รูปก่อนหน้า');
    cardPrevBtn.innerHTML = `<svg class="w-4 h-4 fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>`;

    const cardNextBtn = document.createElement('button');
    cardNextBtn.type = 'button';
    cardNextBtn.className = 'absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow';
    cardNextBtn.setAttribute('aria-label', 'รูปถัดไป');
    cardNextBtn.innerHTML = `<svg class="w-4 h-4 fill-none stroke-current" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`;

    cardPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(hoverInterval);
      showImage((currentImgIndex - 1 + images.length) % images.length);
    });

    cardNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(hoverInterval);
      showImage((currentImgIndex + 1) % images.length);
    });

    gallery.appendChild(cardPrevBtn);
    gallery.appendChild(cardNextBtn);

    // Indicator Dots at bottom of image
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-sm pointer-events-auto';

    const dots = [];
    images.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = idx === 0
        ? 'w-4 h-1.5 rounded-full bg-white transition-all duration-300 cursor-pointer'
        : 'w-1.5 h-1.5 rounded-full bg-white/55 hover:bg-white/80 transition-all duration-300 cursor-pointer';
      dot.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        clearInterval(hoverInterval);
        showImage(idx);
      });
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        clearInterval(hoverInterval);
        showImage(idx);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
    gallery.appendChild(dotsContainer);

    function showImage(index) {
      currentImgIndex = index;
      images.forEach((img, idx) => {
        if (idx === currentImgIndex) {
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
        } else {
          img.classList.remove('opacity-100');
          img.classList.add('opacity-0');
        }
      });
      dots.forEach((dot, idx) => {
        dot.className = idx === currentImgIndex
          ? 'w-4 h-1.5 rounded-full bg-white transition-all duration-300 cursor-pointer'
          : 'w-1.5 h-1.5 rounded-full bg-white/55 hover:bg-white/80 transition-all duration-300 cursor-pointer';
      });
    }

    // Desktop Hover Behavior
    card.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        showImage((currentImgIndex + 1) % images.length);
        clearInterval(hoverInterval);
        hoverInterval = setInterval(() => {
          showImage((currentImgIndex + 1) % images.length);
        }, 1500);
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        clearInterval(hoverInterval);
        hoverInterval = null;
        showImage(0);
      }
    });
  });
});

// ==========================================================================
// Phone Popup Modal
// ==========================================================================
function openPhonePopup() {
  const phonePopup = document.getElementById('phone-popup');
  if (!phonePopup) return;
  phonePopup.classList.remove('hidden');
  phonePopup.classList.remove('animate-slide-up');
  void phonePopup.offsetWidth; // trigger reflow
  phonePopup.classList.add('animate-slide-up');
}

function closePhonePopup() {
  const phonePopup = document.getElementById('phone-popup');
  if (!phonePopup) return;
  phonePopup.classList.add('hidden');
  phonePopup.classList.remove('animate-slide-up');
}

window.openPhonePopup = openPhonePopup;
window.closePhonePopup = closePhonePopup;
