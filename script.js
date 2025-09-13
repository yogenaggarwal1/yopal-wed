// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initializeCountdown();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeHeaderScroll();
    initializeMobileMenu();
    initializeParallaxEffects();
    initializeImageLazyLoading();
});

// Countdown Timer
function initializeCountdown() {
    const weddingDate = new Date('2024-06-15T09:00:00+05:30').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            // Update countdown display with animation
            animateCountdownNumber('days', days);
            animateCountdownNumber('hours', hours);
            animateCountdownNumber('minutes', minutes);
        } else {
            // Wedding day has arrived
            document.getElementById('countdown').innerHTML = `
                <div class="wedding-arrived">
                    <div class="celebration-text">We're Married! 🎉</div>
                    <div class="celebration-subtext">Thank you for being part of our special day</div>
                </div>
            `;
        }
    }

    function animateCountdownNumber(id, newValue) {
        const element = document.getElementById(id);
        if (element && element.textContent !== newValue.toString().padStart(2, '0')) {
            element.style.transform = 'scale(1.2)';
            element.style.color = '#ffd700';
            
            setTimeout(() => {
                element.textContent = newValue.toString().padStart(2, '0');
                element.style.transform = 'scale(1)';
                element.style.color = 'inherit';
            }, 150);
        }
    }

    // Update countdown every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Smooth Scrolling Navigation
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 200;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
                
                // Add staggered animation for event
