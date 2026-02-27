// Advanced Animations

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallaxEffect();
    initTypewriterEffect();
    initProgressBars();
    initSkillBarsAnimation();
});

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animate');
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('animate__animated', `animate__${animation}`);
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax Effect
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            const yPos = -(scrollTop * speed);
            
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// Typewriter Effect
function initTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const speed = parseInt(element.getAttribute('data-speed')) || 50;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Progress Bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset width for animation
                progressBar.style.width = '0%';
                
                // Animate to actual width
                setTimeout(() => {
                    progressBar.style.transition = 'width 1.5s ease-out';
                    progressBar.style.width = width;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.5
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Skill Bars Animation
function initSkillBarsAnimation() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const progress = bar.querySelector('.skill-progress');
        const percent = progress.style.width;
        
        // Store original width
        progress.setAttribute('data-original-width', percent);
        progress.style.width = '0%';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const originalWidth = progress.getAttribute('data-original-width');
                    
                    // Animate to original width
                    setTimeout(() => {
                        progress.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        progress.style.width = originalWidth;
                    }, 200);
                    
                    observer.unobserve(bar);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(bar);
    });
}

// Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    initHoverEffects();
    initTiltEffect();
});

function initHoverEffects() {
    // Card hover effects
    const cards = document.querySelectorAll('.info-card, .category-card, .project-card, .soft-skill-card, .certification-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Tilt Effect
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Page Load Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add CSS for load animation
    const style = document.createElement('style');
    style.textContent = `
        body.loaded .preloader {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .fade-in {
            animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

// Staggered Animations
function initStaggeredAnimations() {
    const staggeredElements = document.querySelectorAll('[data-stagger]');
    
    staggeredElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Smooth Page Transitions
function initPageTransitions() {
    // Add CSS for page transitions
    const style = document.createElement('style');
    style.textContent = `
        .page-transition-enter {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .page-transition-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .page-transition-exit {
            opacity: 1;
        }
        
        .page-transition-exit-active {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add CSS for lazy loading
    const style = document.createElement('style');
    style.textContent = `
        img[data-src] {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        img.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Cursor Effects
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Add CSS for custom cursor
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease;
            mix-blend-mode: difference;
        }
        
        .custom-cursor.hover {
            width: 40px;
            height: 40px;
            background: var(--primary);
            opacity: 0.5;
        }
        
        .custom-cursor.click {
            transform: translate(-50%, -50%) scale(0.8);
        }
    `;
    document.head.appendChild(style);
    
    // Update cursor position
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .nav-link');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
        });
    });
    
    // Click effect
    document.addEventListener('mousedown', function() {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', function() {
        cursor.classList.remove('click');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
}

// Initialize animations based on user preference
function initAnimationsBasedOnPreference() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        initScrollAnimations();
        initParallaxEffect();
        initTypewriterEffect();
        initProgressBars();
        initSkillBarsAnimation();
        initHoverEffects();
        initTiltEffect();
        initStaggeredAnimations();
        initPageTransitions();
        initLazyLoading();
        initCursorEffects();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initScrollAnimations,
        initParallaxEffect,
        initTypewriterEffect,
        initProgressBars,
        initSkillBarsAnimation,
        initHoverEffects,
        initTiltEffect,
        initStaggeredAnimations,
        initPageTransitions,
        initLazyLoading,
        initCursorEffects,
        initAnimationsBasedOnPreference
    };
}