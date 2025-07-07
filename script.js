const locationText = document.getElementById("locationText");

async function fetchLocation(lat, lon) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    const city = data.address.city || data.address.town || data.address.village || "Unknown";
    locationText.textContent = city;
  } catch {
    locationText.textContent = "Unknown";
  }
}

function detectUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        locationText.textContent = "Unknown";
      }
    );
  } else {
    locationText.textContent = "Not supported";
  }
}

detectUserLocation();
// Run feather icon replacement after page load
  document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
  });

// card-1

document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselContainer = document.getElementById('partnerCarousel');
    let originalPartnerCards = Array.from(document.querySelectorAll('#carouselTrack > a'));

    let currentIndex = 0;
    let cardWidthWithMargin = 0;
    let resizeTimer;

    // Function to calculate card width and update transform
    function updateCardDimensions() {
        if (originalPartnerCards.length > 0) {
            const computedStyle = getComputedStyle(originalPartnerCards[0]);
            const marginRight = parseFloat(computedStyle.marginRight);
            cardWidthWithMargin = originalPartnerCards[0].offsetWidth + marginRight;
        }
        // Recalculate transform based on new dimensions
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidthWithMargin}px)`;
    }

    // Function to clone cards for seamless looping
    function cloneCards() {
        // Clear existing clones before re-cloning on resize
        const existingClones = document.querySelectorAll('#carouselTrack > a.cloned');
        existingClones.forEach(clone => clone.remove());

        originalPartnerCards.forEach(card => {
            const clonedCard = card.cloneNode(true);
            clonedCard.classList.add('cloned'); // Add a class to identify clones
            carouselTrack.appendChild(clonedCard);
        });
    }

    // Initial setup
    cloneCards();
    updateCardDimensions();

    // Function to slide to the next card
    function slideNext() {
        currentIndex++;
        carouselTrack.style.transform = `translateX(-${currentIndex * cardWidthWithMargin}px)`;

        if (currentIndex >= originalPartnerCards.length) {
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(0px)`;
                currentIndex = 0;
                void carouselTrack.offsetWidth; // Force reflow
                carouselTrack.style.transition = 'transform 0.8s ease-in-out';
            }, 800); // Matches CSS transition duration
        }
    }

    // Start auto-slide
    let slideInterval = setInterval(slideNext, 5000);

    // Handle window resize for responsiveness
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-calculate dimensions and re-clone cards on resize
            originalPartnerCards = Array.from(document.querySelectorAll('#carouselTrack > a:not(.cloned)')); // Get original cards again
            cloneCards();
            updateCardDimensions();
            // Reset interval to prevent weird jumps during resize
            clearInterval(slideInterval);
            slideInterval = setInterval(slideNext, 5000);
        }, 250); // Debounce resize event
    });
});


