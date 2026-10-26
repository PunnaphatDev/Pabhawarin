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

    // Close mobile menu on clicking any link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('max-h-0');
        mobileMenu.classList.remove('max-h-screen');
      });
    });
  }

  // ==========================================================================
  // Projects Carousel (4 cards per slide)
  // ==========================================================================
  let currentProjectSlide = 0;
  const totalProjectSlides = 2;
  const projectTrack = document.getElementById('project-carousel-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const indicatorText = document.getElementById('carousel-indicator-text');
  const subText = document.getElementById('carousel-subtext');
  const dot0 = document.getElementById('carousel-dot-0');
  const dot1 = document.getElementById('carousel-dot-1');

  function updateCarouselUI() {
    if (!projectTrack) return;

    // Slide transform
    projectTrack.style.transform = `translateX(-${currentProjectSlide * 100}%)`;

    // Update Header Text & Indicators
    if (indicatorText) {
      indicatorText.textContent = `${currentProjectSlide + 1} / ${totalProjectSlides}`;
    }
    if (subText) {
      subText.textContent = currentProjectSlide === 0 ? 'โครงการ 1 - 4' : 'โครงการ 5 - 8';
    }

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

    // Update Pagination Dots
    if (dot0 && dot1) {
      if (currentProjectSlide === 0) {
        dot0.className = 'h-3 w-8 rounded-full bg-[#404E3F] transition-all cursor-pointer shadow-sm';
        dot1.className = 'h-3 w-3 rounded-full bg-[#D6CEBC] hover:bg-[#b8ae98] transition-all cursor-pointer';
      } else {
        dot0.className = 'h-3 w-3 rounded-full bg-[#D6CEBC] hover:bg-[#b8ae98] transition-all cursor-pointer';
        dot1.className = 'h-3 w-8 rounded-full bg-[#404E3F] transition-all cursor-pointer shadow-sm';
      }
    }
  }

  function goToProjectSlide(index) {
    currentProjectSlide = index;
    updateCarouselUI();
  }

  function nextProjectSlide() {
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

  // Expose carousel functions to global scope for HTML onclick attributes
  window.nextProjectSlide = nextProjectSlide;
  window.prevProjectSlide = prevProjectSlide;
  window.goToProjectSlide = goToProjectSlide;

  // Touch Swipe Gesture Support
  if (projectTrack) {
    let touchStartX = 0;
    let touchEndX = 0;

    projectTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    projectTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextProjectSlide();
        } else {
          prevProjectSlide();
        }
      }
    }, { passive: true });
  }

  // Initialize Carousel
  updateCarouselUI();
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

// Expose popup functions to global scope
window.openPhonePopup = openPhonePopup;
window.closePhonePopup = closePhonePopup;
