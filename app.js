/**
 * Enhanced JavaScript for nlp-myprocessor website
 * Tauri-inspired design with advanced interactions - Final Version
 */
class NLPProcessorWebsite {
    constructor() {
        // Command configurations for different package managers
        this.commands = {
            pip: "pip install nlp-myprocessor",
            conda: "conda install -c conda-forge nlp-myprocessor",
            poetry: "poetry add nlp-myprocessor",
            prereqs: "python -m nltk.downloader stopwords && python -m spacy download en_core_web_sm"
        };
        
        // State management
        this.currentTab = 'pip';
        this.isLoading = false;
        this.animationObserver = null;
        this.particles = [];
        this.isInitialized = false;
        
        // Particle system configuration
        this.particleConfig = {
            colors: ['#8B5CF6', '#3B82F6', '#06B6D4'],
            count: 20,
            maxSize: 4,
            minSize: 2
        };
        
        // Bind methods for proper event cleanup
        this.boundScrollHandler = this.handleAllScrollEffects.bind(this);
        this.boundResizeHandler = this.debounce(this.handleResize.bind(this), 250);
        this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
        
        // Initialize after DOM is ready
        this.init();
    }

    /**
     * Initialize all website functionality
     */
    init() {
        try {
            this.setupEventListeners();
            this.setupTabSwitching();
            this.setupCopyFunctionality();
            this.setupHeaderBehavior();
            this.setupMobileNavigation();
            this.setupParticleSystem();
            this.initializeIntersectionObserver();
            this.setupKeyboardShortcuts();
            this.addMobileStyles();
            
            this.isInitialized = true;
            console.log('🚀 nlp-myprocessor website loaded successfully with all enhancements!');
            
        } catch (error) {
            console.error('Failed to initialize nlp-myprocessor website:', error);
        }
    }

    /**
     * Setup consolidated event listeners
     */
    setupEventListeners() {
        // Smooth scroll for anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.smoothScrollToElement(link.getAttribute('href'));
            }
        });

        // Consolidated scroll handler
        window.addEventListener('scroll', this.boundScrollHandler);
        
        // Window resize events
        window.addEventListener('resize', this.boundResizeHandler);

        // Page visibility changes
        document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }

    /**
     * Consolidated scroll effects handler
     */
    handleAllScrollEffects() {
        if (!this.isInitialized) return;
        
        const scrollY = window.pageYOffset;
        
        // Update navigation active states
        this.updateActiveNavigation(scrollY);
        
        // Update header behavior
        this.updateHeaderOnScroll(scrollY);
        
        // Update parallax effects
        this.updateParallaxEffects(scrollY);
        
        // Update hero parallax
        this.updateHeroParallax(scrollY);
    }

    /**
     * Setup tab switching functionality
     */
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const codeContent = document.getElementById('codeContent');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(button, codeContent);
            });
        });
    }

    /**
     * Switch active tab and update command display
     */
    switchTab(activeButton, codeElement) {
        if (this.isLoading) return;
        
        const tabName = activeButton.getAttribute('data-tab');
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked tab
        activeButton.classList.add('active');
        
        // Update current tab and command
        this.currentTab = tabName;
        this.updateCommand(codeElement, this.commands[tabName]);
        
        // Track analytics
        this.trackEvent('tab_switch', { tab: tabName });
    }

    /**
     * Update command display with smooth animation
     */
    updateCommand(element, command) {
        if (!element) return;
        
        this.isLoading = true;
        element.style.opacity = '0.5';
        element.style.transform = 'translateY(5px)';
        
        setTimeout(() => {
            element.textContent = command;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            this.isLoading = false;
        }, 150);
    }

    /**
     * Setup copy to clipboard functionality
     */
    setupCopyFunctionality() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleCopyClick(button);
            });
        });
    }

    /**
     * Handle copy button click
     */
    async handleCopyClick(button) {
        try {
            const codeBlock = button.closest('.code-block');
            const codeContent = codeBlock.querySelector('code, pre');
            let text = codeContent.textContent.trim();
            
            // Use current tab command for installation section
            if (button.id === 'copyBtn') {
                text = this.commands[this.currentTab];
            }
            
            await this.copyToClipboard(text);
            this.showToast('Code copied successfully! ✨', 'success');
            this.animateCopyButton(button);
            
            // Track copy event
            this.trackEvent('code_copy', { 
                content_type: this.currentTab,
                content_length: text.length 
            });
            
        } catch (error) {
            console.warn('Copy failed:', error);
            this.showToast('Failed to copy. Please try again.', 'error');
        }
    }

    /**
     * Copy text to clipboard with fallback
     */
    async copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            textArea.style.pointerEvents = 'none';
            textArea.style.left = '-9999px';
            
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
            } finally {
                document.body.removeChild(textArea);
            }
        }
    }

    /**
     * Animate copy button feedback
     */
    animateCopyButton(button) {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (icon && text) {
            const originalIcon = icon.className;
            const originalText = text.textContent;
            
            // Change to success state
            icon.className = 'fas fa-check';
            text.textContent = 'Copied!';
            button.style.color = 'var(--tauri-blue)';
            button.style.borderColor = 'var(--tauri-blue)';
            button.style.transform = 'scale(0.95)';
            
            // Reset after delay
            setTimeout(() => {
                icon.className = originalIcon;
                text.textContent = originalText;
                button.style.color = '';
                button.style.borderColor = '';
                button.style.transform = '';
            }, 2000);
        }
    }

    /**
     * Show enhanced toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toastMessage');
        
        if (!toast || !messageEl) return;
        
        const icon = toast.querySelector('i');
        messageEl.textContent = message;
        
        // Set appropriate styles and icon based on type
        const toastStyles = {
            success: { icon: 'fas fa-check-circle', bg: 'var(--tauri-blue)' },
            error: { icon: 'fas fa-exclamation-circle', bg: '#e74c3c' },
            warning: { icon: 'fas fa-exclamation-triangle', bg: 'var(--tauri-orange)' },
            info: { icon: 'fas fa-info-circle', bg: 'var(--tauri-blue)' }
        };
        
        const style = toastStyles[type] || toastStyles.success;
        icon.className = style.icon;
        toast.style.background = style.bg;
        
        toast.classList.add('show');
        
        // Auto-hide after delay
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /**
     * Setup enhanced header behavior
     */
    setupHeaderBehavior() {
        this.lastScrollTop = 0;
        this.scrollThreshold = 200;
    }

    /**
     * Update header on scroll
     */
    updateHeaderOnScroll(scrollY) {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Add backdrop blur based on scroll position
        if (scrollY > 50) {
            header.style.background = 'rgba(15, 15, 15, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(15, 15, 15, 0.9)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show header on scroll
        if (scrollY > this.lastScrollTop && scrollY > this.scrollThreshold) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        this.lastScrollTop = scrollY <= 0 ? 0 : scrollY;
    }

    /**
     * Setup particle system
     */
    setupParticleSystem() {
        const heroParticles = document.getElementById('heroParticles');
        if (!heroParticles) return;
        
        this.createFloatingParticles(heroParticles, this.particleConfig.count);
    }

    /**
     * Create floating particles
     */
    createFloatingParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * (this.particleConfig.maxSize - this.particleConfig.minSize) + this.particleConfig.minSize;
            const color = this.particleConfig.colors[Math.floor(Math.random() * this.particleConfig.colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * 20}s;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    /**
     * Update parallax effects
     */
    updateParallaxEffects(scrollY) {
        // Enhanced parallax for floating shapes
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrollY * speed);
            shape.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    /**
     * Update hero parallax effect
     */
    updateHeroParallax(scrollY) {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const parallaxElements = hero.querySelectorAll('.hero-content > *');
        const rate = scrollY * -0.3;
        
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.1;
            el.style.transform = `translateY(${rate * speed}px)`;
        });
    }

    /**
     * Setup mobile navigation
     */
    setupMobileNavigation() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            const isOpen = mobileToggle.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        
        mobileToggle.classList.add('active');
        nav.classList.add('mobile-open');
        document.body.classList.add('mobile-menu-open');
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.classList.remove('active');
            nav.classList.remove('mobile-open');
            document.body.classList.remove('mobile-menu-open');
        }
    }

    /**
     * Initialize intersection observer for animations
     */
    initializeIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for feature cards
                    if (entry.target.classList.contains('feature-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        setTimeout(() => {
                            entry.target.style.transitionDelay = '0ms';
                        }, delay);
                    }
                }
            });
        }, options);

        // Observe elements
        document.querySelectorAll('.feature-card, .developer-card, .code-block').forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search (placeholder)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showToast('Search functionality coming soon! 🔍', 'info');
            }
            
            // Escape key to close mobile menu
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Smooth scroll to element
     */
    smoothScrollToElement(selector) {
        const target = document.querySelector(selector);
        if (!target) return;
        
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Update active navigation based on scroll position
     */
    updateActiveNavigation(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Reset mobile navigation on resize
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Reinitialize particles if needed
        if (this.particles.length === 0) {
            this.setupParticleSystem();
        }
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause expensive animations
            console.log('Page hidden - optimizing performance');
        } else {
            // Page is visible - resume normal operation
            console.log('Page visible - resuming normal operation');
        }
    }

    /**
     * Add mobile navigation styles
     */
    addMobileStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Mobile navigation styles */
            @media (max-width: 768px) {
                .nav {
                    position: fixed;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(15, 15, 15, 0.98);
                    backdrop-filter: blur(20px);
                    flex-direction: column;
                    padding: var(--space-xl);
                    gap: var(--space-lg);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--transition-normal);
                    z-index: 999;
                    border-top: 1px solid var(--border-primary);
                }
                
                .nav.mobile-open {
                    transform: translateY(-100%);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-link {
                    padding: var(--space-md) 0;
                    font-size: 1.125rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }
                
                .nav-link:last-child {
                    border-bottom: none;
                }
                
                body.mobile-menu-open {
                    overflow: hidden;
                }
            }
            
            /* Enhanced animation for active nav links */
            .nav-link.active {
                color: var(--tauri-blue);
            }
            
            .nav-link.active::after {
                width: 100%;
            }
            
            /* Staggered animation for feature cards */
            .feature-card {
                transition: all 0.6s ease-out;
                opacity: 0;
                transform: translateY(20px);
            }
            
            .feature-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .feature-card:nth-child(1) { transition-delay: 0ms; }
            .feature-card:nth-child(2) { transition-delay: 100ms; }
            .feature-card:nth-child(3) { transition-delay: 200ms; }
            .feature-card:nth-child(4) { transition-delay: 300ms; }
            
            /* Enhanced code block styling */
            .code-content pre {
                scrollbar-width: thin;
                scrollbar-color: var(--tauri-blue) var(--bg-tertiary);
            }
            
            .code-content pre::-webkit-scrollbar {
                height: 8px;
            }
            
            .code-content pre::-webkit-scrollbar-track {
                background: var(--bg-tertiary);
                border-radius: 4px;
            }
            
            .code-content pre::-webkit-scrollbar-thumb {
                background: var(--tauri-blue);
                border-radius: 4px;
            }
            
            .code-content pre::-webkit-scrollbar-thumb:hover {
                background: var(--tauri-blue-hover);
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Track analytics events (placeholder)
     */
    trackEvent(eventName, properties = {}) {
        console.log(`📊 Event: ${eventName}`, properties);
        
        // Add your analytics tracking here:
        // gtag('event', eventName, properties);
        // mixpanel.track(eventName, properties);
        // etc.
    }

    /**
     * Utility function for debouncing
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.call(this, ...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Clean up resources when page unloads
     */
    destroy() {
        try {
            // Disconnect intersection observer
            if (this.animationObserver) {
                this.animationObserver.disconnect();
                this.animationObserver = null;
            }
            
            // Remove event listeners properly
            window.removeEventListener('scroll', this.boundScrollHandler);
            window.removeEventListener('resize', this.boundResizeHandler);
            document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
            
            // Clean up particles
            this.particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
            this.particles = [];
            
            // Reset state
            this.isInitialized = false;
            
            console.log('🧹 Website resources cleaned up successfully');
            
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
}

/**
 * Initialize the website
 */
function initializeWebsite() {
    try {
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            // DOM still loading, wait for it
            document.addEventListener('DOMContentLoaded', () => {
                window.nlpProcessorSite = new NLPProcessorWebsite();
            });
        } else {
            // DOM already loaded, initialize immediately
            window.nlpProcessorSite = new NLPProcessorWebsite();
        }
        
    } catch (error) {
        console.error('Failed to initialize website:', error);
        
        // Retry after a short delay
        setTimeout(() => {
            if (!window.nlpProcessorSite) {
                try {
                    window.nlpProcessorSite = new NLPProcessorWebsite();
                } catch (retryError) {
                    console.error('Retry failed:', retryError);
                }
            }
        }, 1000);
    }
}

// Initialize the website
initializeWebsite();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.nlpProcessorSite && typeof window.nlpProcessorSite.destroy === 'function') {
        window.nlpProcessorSite.destroy();
    }
});

// Handle page show/hide for better performance
window.addEventListener('pageshow', (event) => {
    if (event.persisted && window.nlpProcessorSite) {
        // Page was restored from cache
        console.log('Page restored from cache');
    }
});

window.addEventListener('pagehide', () => {
    if (window.nlpProcessorSite && typeof window.nlpProcessorSite.destroy === 'function') {
        window.nlpProcessorSite.destroy();
    }
});
