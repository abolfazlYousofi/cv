// Professional About Page Script

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all features
        this.initLanguage();
        this.initTheme();
        this.initTabs();
        this.initParticles();
        this.initCurrentYear();
        this.initContactButton();
        this.initAnimations();
        this.initSmoothScroll();
        this.initBackToTop();
    }

    // Language Management
    initLanguage() {
        this.html = document.documentElement;
        this.langToggle = document.getElementById('langToggle');
        
        // Load saved language or default to 'en'
        const savedLang = localStorage.getItem('portfolioLang') || 'en';
        this.applyLanguage(savedLang);
        
        // Toggle language on button click
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    applyLanguage(lang) {
        const isRTL = lang === 'fa';
        
        // Update HTML attributes
        this.html.setAttribute('lang', lang);
        this.html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        this.html.setAttribute('data-lang', lang);
        
        // Update button text
        if (this.langToggle) {
            const langText = this.langToggle.querySelector('.lang-text');
            if (langText) {
                langText.textContent = lang === 'en' ? 'FA' : 'EN';
            }
        }
        
        // Show/hide language specific elements
        document.querySelectorAll('.en').forEach(el => {
            el.style.display = lang === 'en' ? '' : 'none';
        });
        
        document.querySelectorAll('.fa').forEach(el => {
            el.style.display = lang === 'fa' ? '' : 'none';
        });
        
        // Save preference
        localStorage.setItem('portfolioLang', lang);
    }

    toggleLanguage() {
        const currentLang = this.html.getAttribute('data-lang') || 'en';
        const newLang = currentLang === 'en' ? 'fa' : 'en';
        this.applyLanguage(newLang);
        
        // Add transition effect
        this.html.classList.add('language-changing');
        setTimeout(() => {
            this.html.classList.remove('language-changing');
        }, 300);
    }

    // Theme Management
    initTheme() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) return;
        
        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
        this.applyTheme(savedTheme);
        
        // Toggle theme on button click
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme(theme) {
        const isLight = theme === 'light';
        
        if (isLight) {
            document.body.classList.add('light-theme');
            this.themeToggle.querySelector('i').classList.remove('fa-moon');
            this.themeToggle.querySelector('i').classList.add('fa-sun');
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            document.body.classList.remove('light-theme');
            this.themeToggle.querySelector('i').classList.remove('fa-sun');
            this.themeToggle.querySelector('i').classList.add('fa-moon');
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
        
        // Save preference
        localStorage.setItem('portfolioTheme', theme);
    }

    toggleTheme() {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Add transition effect
        document.body.classList.add('theme-changing');
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 300);
    }

    // Tab Management
    initTabs() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });
        
        // Set initial active tab
        const activeTab = localStorage.getItem('activeTab') || 'about';
        this.switchToTab(activeTab);
    }

    switchTab(e) {
        e.preventDefault();
        const targetTab = e.currentTarget.getAttribute('data-tab');
        this.switchToTab(targetTab);
    }

    switchToTab(tabName) {
        // Update tab buttons
        this.tabButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-tab') === tabName);
        });
        
        // Update tab panels
        this.tabPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === tabName);
        });
        
        // Save active tab
        localStorage.setItem('activeTab', tabName);
        
        // Add animation
        const activePanel = document.getElementById(tabName);
        if (activePanel) {
            activePanel.style.animation = 'none';
            setTimeout(() => {
                activePanel.style.animation = 'fadeIn 0.4s ease';
            }, 10);
        }
    }

    // Particles Background
    initParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        const particleCount = 30;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.3 + 0.1;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${posX}%;
                top: ${posY}%;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                border-radius: 50%;
                opacity: ${opacity};
                animation: float ${duration}s infinite ease-in-out;
                animation-delay: ${delay}s;
                pointer-events: none;
            `;
            
            particlesContainer.appendChild(particle);
            particles.push(particle);
        }
        
        // Add CSS for animation
        if (!document.querySelector('#particles-animation')) {
            const style = document.createElement('style');
            style.id = 'particles-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    33% {
                        transform: translate(20px, -20px) rotate(120deg);
                    }
                    66% {
                        transform: translate(-15px, 15px) rotate(240deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Current Year
    initCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Contact Button
    initContactButton() {
        const contactBtn = document.getElementById('contactBtn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                // Animation
                contactBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    contactBtn.style.transform = '';
                }, 150);
                
                // Open email client
                setTimeout(() => {
                    window.location.href = 'mailto:abolfazlyousefi@gmail.com?subject=Portfolio%20Collaboration&body=Hello%20Abolfazl,%0A%0AI%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20potential%20collaboration.';
                }, 200);
            });
        }
    }

    // Animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.timeline-item, .contact-item, .skill-tag'
        );
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
        
        // Add CSS for animations
        if (!document.querySelector('#animations-styles')) {
            const style = document.createElement('style');
            style.id = 'animations-styles';
            style.textContent = `
                .animate-in {
                    animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .language-changing,
                .theme-changing {
                    animation: fadeTransition 0.3s ease;
                }
                
                @keyframes fadeTransition {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Back to Top (for longer content)
    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
        
        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .back-to-top {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                border: none;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                z-index: 1000;
                box-shadow: var(--shadow-md);
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                transform: translateY(-3px);
                box-shadow: var(--shadow-lg);
            }
        `;
        document.head.appendChild(style);
        
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        // Scroll to top
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Utility: Debounce function
    debounce(func, wait) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}