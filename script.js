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
    initializeDynamicHero(); // New function for hero fitting
});

// Simplified Hero Content Fitting - Always 100vh, just shrink content
function initializeDynamicHero() {
    function adjustHeroContent() {
        const hero = document.querySelector('.hero');
        const heroContainer = document.querySelector('.hero-container');
        const navbar = document.querySelector('.header');
        
        if (!hero || !heroContainer || !navbar) return;

        const viewportHeight = window.innerHeight;
        const navbarHeight = navbar.offsetHeight;
        
        // Always use 100vh, just adjust content size
        hero.style.height = '100vh';
        heroContainer.style.height = `calc(100vh - ${navbarHeight + 20}px)`; // 20px extra safety margin
        
        // Set safe distances as CSS variables
        document.documentElement.style.setProperty('--safe-top-distance', `${navbarHeight + 20}px`);
        document.documentElement.style.setProperty('--available-hero-height', `${viewportHeight - navbarHeight - 20}px`);
        
        console.log(`Hero adjusted: Navbar ${navbarHeight}px, Available ${viewportHeight - navbarHeight - 20}px`);
    }

    // Initial adjustment
    adjustHeroContent();
    
    // Adjust on resize and orientation change
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustHeroContent, 100);
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(adjustHeroContent, 200);
    });
}

// Countdown Timer
function initializeCountdown() {
    const weddingDate = new Date('2025-11-12T20:00:00+05:30').getTime();
    
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
                
                // Add staggered animation for event cards
                if (entry.target.classList.contains('event-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
                
                // Add staggered animation for gallery items
                if (entry.target.classList.contains('gallery-item')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.timeline-item, .event-card, .gallery-item, .contact-card, .venue-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Header Scroll Effect
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(220, 20, 60, 0.15)';
        } else {
            header.classList.remove('scrolled');
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 30px rgba(220, 20, 60, 0.1)';
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    navLinks.classList.toggle('mobile-open');
    mobileMenuBtn.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenuBtn.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (navLinks && mobileMenuBtn) {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
        
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Parallax Effects
function initializeParallaxEffects() {
    const mandalas = document.querySelectorAll('.mandala');
    const heroPattern = document.querySelector('.hero-pattern');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Animate floating mandalas
        mandalas.forEach((mandala, index) => {
            const speed = (index + 1) * 0.3;
            mandala.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        // Animate hero pattern
        if (heroPattern) {
            heroPattern.style.transform = `translateX(${rate}px) translateY(${rate * 0.5}px)`;
        }
    });
}

// Image Lazy Loading with Fade In Effect
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img[src*="placeholder"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading effect
                img.style.opacity = '0.7';
                img.style.filter = 'blur(5px)';
                
                // Simulate loading completion
                setTimeout(() => {
                    img.style.opacity = '1';
                    img.style.filter = 'none';
                    img.style.transition = 'all 0.5s ease';
                }, 500);
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Contact Card Interactions
function initializeContactInteractions() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.background = 'rgba(255, 255, 255, 0.25)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.background = 'rgba(255, 255, 255, 0.15)';
        });
    });
}

// Gallery Hover Effects
function initializeGalleryEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.gallery-overlay');
            const img = this.querySelector('img');
            
            img.style.transform = 'scale(1.1) rotate(2deg)';
            overlay.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.gallery-overlay');
            const img = this.querySelector('img');
            
            img.style.transform = 'scale(1) rotate(0deg)';
            overlay.style.opacity = '0';
        });
    });
}

// Timeline Interactions
function initializeTimelineEffects() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const image = this.querySelector('.timeline-image');
            const text = this.querySelector('.timeline-text');
            
            if (image) {
                image.style.transform = 'scale(1.05) rotate(1deg)';
                image.querySelector('.image-overlay').style.opacity = '0.3';
            }
            
            if (text) {
                text.style.transform = 'translateX(5px)';
                text.style.boxShadow = '0 20px 40px rgba(220, 20, 60, 0.15)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const image = this.querySelector('.timeline-image');
            const text = this.querySelector('.timeline-text');
            
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
                image.querySelector('.image-overlay').style.opacity = '0';
            }
            
            if (text) {
                text.style.transform = 'translateX(0)';
                text.style.boxShadow = '0 15px 35px rgba(220, 20, 60, 0.1)';
            }
        });
    });
}

// Add CSS for mobile menu
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 80px;
            right: -100%;
            width: 300px;
            height: calc(100vh - 80px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 2rem 0;
            transition: right 0.3s ease;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
            border-left: 1px solid rgba(220, 20, 60, 0.1);
        }
        
        .nav-links.mobile-open {
            right: 0;
        }
        
        .nav-links li {
            margin: 1rem 0;
            opacity: 0;
            transform: translateX(50px);
            animation: slideInRight 0.3s ease forwards;
        }
        
        .nav-links.mobile-open li:nth-child(1) { animation-delay: 0.1s; }
        .nav-links.mobile-open li:nth-child(2) { animation-delay: 0.2s; }
        .nav-links.mobile-open li:nth-child(3) { animation-delay: 0.3s; }
        .nav-links.mobile-open li:nth-child(4) { animation-delay: 0.4s; }
        .nav-links.mobile-open li:nth-child(5) { animation-delay: 0.5s; }
        .nav-links.mobile-open li:nth-child(6) { animation-delay: 0.6s; }
        
        .nav-links a {
            font-size: 1.3rem;
            padding: 0.5rem 1rem;
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .nav-links a:hover {
            background: rgba(220, 20, 60, 0.1);
            transform: translateY(0);
        }
        
        @keyframes slideInRight {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Additional event card animations
function initializeEventCardAnimations() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.addEventListener('click', function() {
            // Add click ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.6);
                width: 20px;
                height: 20px;
                animation: ripple 0.6s linear;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const rippleStyles = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(10);
            opacity: 0;
        }
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Initialize additional effects after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeContactInteractions();
        initializeGalleryEffects();
        initializeTimelineEffects();
        initializeEventCardAnimations();
    }, 500);
});

// Preloader (optional)
function initializePreloader() {
    const preloader = document.createElement('div');
    preloader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #dc143c 0%, #8b0000 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-family: 'Playfair Display', serif;
        ">
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 2s infinite;">❋</div>
                <div style="font-size: 1.5rem;">Loading...</div>
                <div style="font-size: 1rem; opacity: 0.8; margin-top: 0.5rem;">Yogen & Palak</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Add pulse animation for preloader
const pulseStyles = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.7; }
    }
`;

const pulseStyleSheet = document.createElement('style');
pulseStyleSheet.textContent = pulseStyles;
document.head.appendChild(pulseStyleSheet);

// Initialize preloader
initializePreloader();

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy functions
const debouncedParallax = debounce(initializeParallaxEffects, 10);
window.addEventListener('scroll', debouncedParallax);

// Add custom cursor effect (optional enhancement)
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #ffd700, #dc143c);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.7';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Enhance cursor on hover over interactive elements
    document.querySelectorAll('a, button, .event-card, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'linear-gradient(135deg, #dc143c, #ffd700)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'linear-gradient(135deg, #ffd700, #dc143c)';
        });
    });
}

// Initialize custom cursor on desktop only
if (window.innerWidth > 768) {
    initializeCustomCursor();
}
