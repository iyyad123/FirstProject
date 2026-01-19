// ===================================
// SNACK AL YAQOUT - JAVASCRIPT
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    }
    
    // ===================================
    // ENHANCED SMOOTH SCROLL NAVIGATION
    // ===================================
    const navLinks = document.querySelectorAll('.nav-link');
    let isScrolling = false;
    
    // Custom smooth scroll function with easing
    function smoothScrollTo(target, duration = 1000) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        // Easing function for smooth animation
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
            }
        }
        
        isScrolling = true;
        requestAnimationFrame(animation);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Add fade-out effect to current section
                const currentSection = document.querySelector('section.active-section');
                if (currentSection) {
                    currentSection.classList.remove('active-section');
                }
                
                // Smooth scroll with custom easing
                smoothScrollTo(targetSection, 1200);
                
                // Add fade-in effect to target section
                setTimeout(() => {
                    targetSection.classList.add('active-section');
                }, 100);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // ===================================
    // ENHANCED ACTIVE SECTION HIGHLIGHTING ON SCROLL
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        if (isScrolling) return; // Don't update during programmatic scroll
        
        const scrollY = window.pageYOffset;
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentSection = section;
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
                
                // Add active class to current section
                sections.forEach(s => s.classList.remove('active-section'));
                section.classList.add('active-section');
            }
        });
    }
    
    // Use throttled scroll for better performance
    const throttledScroll = throttle(highlightNavOnScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    
    // ===================================
    // MENU CATEGORY FILTERING
    // ===================================
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuCards = document.querySelectorAll('.menu-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter menu cards
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    // Add fade-in animation
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // ===================================
    // ADD TO CART BUTTONS
    // ===================================
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuCard = this.closest('.menu-card');
            const itemName = menuCard.querySelector('h3').textContent;
            const itemPrice = menuCard.querySelector('.price').textContent;
            
            // Create notification
            showNotification(`${itemName} added to cart! (${itemPrice})`);
            
            // Add animation to button
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // ===================================
    // NOTIFICATION SYSTEM
    // ===================================
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #C92A2A 0%, #F76707 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add notification animations to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ===================================
    // CONTACT FORM SUBMISSION
    // ===================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all required fields!');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address!');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Success
                showNotification('Message sent successfully! We\'ll get back to you soon.');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Log form data (for demonstration)
                console.log('Form submitted:', formData);
            }, 2000);
        });
    }
    
    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================
    const scrollTopButton = document.getElementById('scrollTop');
    
    if (scrollTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top on click
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===================================
    // GALLERY ITEM CLICK (LIGHTBOX EFFECT)
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageName = this.querySelector('.gallery-placeholder p').textContent;
            showNotification(`Viewing: ${imageName}`);
            
            // Add scale animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // ===================================
    // ENHANCED HERO BUTTONS FUNCTIONALITY
    // ===================================
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's an anchor link, handle smooth scroll
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Use custom smooth scroll
                    smoothScrollTo(targetSection, 1200);
                    
                    // Update active nav link
                    navLinks.forEach(link => link.classList.remove('active'));
                    const correspondingNavLink = document.querySelector(`.nav-link[href="${href}"]`);
                    if (correspondingNavLink) {
                        correspondingNavLink.classList.add('active');
                    }
                    
                    // Add active section class
                    setTimeout(() => {
                        sections.forEach(s => s.classList.remove('active-section'));
                        targetSection.classList.add('active-section');
                    }, 100);
                }
            }
        });
    });
    
    // ===================================
    // ENHANCED SCROLL ANIMATIONS (STAGGERED FADE IN)
    // ===================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element index
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, delay);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation with stagger effect
    const animatedElements = document.querySelectorAll('.menu-card, .gallery-item, .contact-info-card, .section-header');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px) scale(0.95)';
        element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add stagger delay
        element.dataset.delay = (index % 3) * 150;
        
        observer.observe(element);
    });
    
    // Special animation for about content
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '0';
        aboutContent.style.transform = 'translateX(-50px)';
        aboutContent.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(aboutContent);
    }
    
    // ===================================
    // PARALLAX EFFECT ON SCROLL
    // ===================================
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-icons i');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    window.addEventListener('scroll', throttle(parallaxEffect, 50));
    
    // ===================================
    // SECTION TRANSITION EFFECTS
    // ===================================
    function addSectionTransitions() {
        sections.forEach(section => {
            section.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
        });
    }
    
    addSectionTransitions();
    
    // ===================================
    // SOCIAL MEDIA LINKS
    // ===================================
    const socialLinks = document.querySelectorAll('.footer-social a, .social-icon');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's a mailto or tel link, let it work normally
            if (href && (href.startsWith('mailto:') || href.startsWith('tel:'))) {
                return;
            }
            
            // For social media links, show notification
            if (href && (href.includes('facebook') || href.includes('instagram') || href.includes('twitter') || href.includes('youtube'))) {
                e.preventDefault();
                const platform = href.includes('facebook') ? 'Facebook' : 
                               href.includes('instagram') ? 'Instagram' : 
                               href.includes('twitter') ? 'Twitter' : 'YouTube';
                showNotification(`Opening ${platform}...`);
                
                // Open in new tab after short delay
                setTimeout(() => {
                    window.open(href, '_blank');
                }, 500);
            }
        });
    });
    
    // ===================================
    // WHATSAPP BUTTON CLICK TRACKING
    // ===================================
    const whatsappButton = document.querySelector('.whatsapp-float');
    
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function() {
            console.log('WhatsApp button clicked');
            showNotification('Opening WhatsApp...');
        });
    }
    
    // ===================================
    // RESPONSIVE MENU ADJUSTMENTS
    // ===================================
    function handleResize() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
    
    // ===================================
    // PERFORMANCE: LAZY LOADING IMAGES
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // INITIALIZE: SET FIRST NAV LINK AS ACTIVE
    // ===================================
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }
    
    // ===================================
    // CONSOLE MESSAGE
    // ===================================
    console.log('%c🍔 Snack Al Yaqout Website Loaded Successfully! 🍔', 'color: #C92A2A; font-size: 16px; font-weight: bold;');
    console.log('%cAll interactive features are now active.', 'color: #F76707; font-size: 12px;');
    
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format price
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
