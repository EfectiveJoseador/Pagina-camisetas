/**
 * Mobile Touch Scroll Fix for Personalization Modal
 * Fixes scroll behavior and touch interactions on mobile devices
 */

(function() {
    'use strict';

    // Configuration
    const SCROLL_CONFIG = {
        touchSensitivity: 0.8,
        scrollThreshold: 10,
        momentumDamping: 0.95,
        maxMomentum: 30,
        scrollAnimationDuration: 300,
        preventDefaultDelay: 150
    };

    // State management
    let scrollState = {
        isScrolling: false,
        startY: 0,
        startX: 0,
        currentY: 0,
        currentX: 0,
        velocityY: 0,
        velocityX: 0,
        lastTime: 0,
        momentumId: null,
        touchStartTime: 0,
        isDragging: false,
        scrollTop: 0,
        scrollLeft: 0
    };

    // Utility functions
    function isMobileDevice() {
        return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|webOS|BlackBerry/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768) ||
               ('ontouchstart' in window && navigator.maxTouchPoints > 0);
    }

    function getScrollableElement(element) {
        // Find the closest scrollable parent
        let current = element;
        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            const overflow = style.overflow + style.overflowY;
            if (overflow.includes('auto') || overflow.includes('scroll')) {
                return current;
            }
            current = current.parentElement;
        }
        return element;
    }

    function preventBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${scrollState.scrollTop}px`;
    }

    function restoreBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollState.scrollTop);
    }

    function smoothScrollTo(element, targetY, duration = SCROLL_CONFIG.scrollAnimationDuration) {
        const startY = element.scrollTop;
        const distance = targetY - startY;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            element.scrollTop = startY + (distance * easeOut);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    }

    function handleTouchStart(e) {
        if (!isMobileDevice()) return;

        const modal = e.target.closest('#modal-tienda-carrusel, .modal-personalizacion');
        if (!modal) return;

        const touch = e.touches[0];
        scrollState.startY = touch.clientY;
        scrollState.startX = touch.clientX;
        scrollState.currentY = touch.clientY;
        scrollState.currentX = touch.clientX;
        scrollState.velocityY = 0;
        scrollState.velocityX = 0;
        scrollState.lastTime = performance.now();
        scrollState.touchStartTime = performance.now();
        scrollState.isDragging = false;
        scrollState.isScrolling = false;
        scrollState.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollableElement = getScrollableElement(e.target);
        scrollState.scrollTop = scrollableElement.scrollTop;
        scrollState.scrollLeft = scrollableElement.scrollLeft;

        // Cancel any ongoing momentum
        if (scrollState.momentumId) {
            cancelAnimationFrame(scrollState.momentumId);
            scrollState.momentumId = null;
        }
    }

    function handleTouchMove(e) {
        if (!isMobileDevice()) return;

        const modal = e.target.closest('#modal-tienda-carrusel, .modal-personalizacion');
        if (!modal) return;

        const touch = e.touches[0];
        const currentTime = performance.now();
        const deltaTime = currentTime - scrollState.lastTime;
        
        if (deltaTime === 0) return;

        const deltaY = touch.clientY - scrollState.currentY;
        const deltaX = touch.clientX - scrollState.currentX;
        const absDeltaY = Math.abs(deltaY);
        const absDeltaX = Math.abs(deltaX);

        // Determine if this is a scroll gesture
        if (!scrollState.isDragging && !scrollState.isScrolling) {
            if (absDeltaY > SCROLL_CONFIG.scrollThreshold || absDeltaX > SCROLL_CONFIG.scrollThreshold) {
                scrollState.isDragging = true;
                // Determine primary direction
                if (absDeltaY > absDeltaX) {
                    scrollState.isScrolling = true;
                }
            }
        }

        if (scrollState.isScrolling) {
            e.preventDefault(); // Prevent default scroll behavior
            
            const scrollableElement = getScrollableElement(e.target);
            const maxScroll = scrollableElement.scrollHeight - scrollableElement.clientHeight;
            const currentScroll = scrollableElement.scrollTop;
            
            // Calculate velocity for momentum
            scrollState.velocityY = deltaY / deltaTime * 1000;
            
            // Apply scroll with boundary resistance
            let newScroll = currentScroll - deltaY;
            
            // Add resistance at boundaries
            if (newScroll < 0) {
                newScroll = newScroll * 0.5; // Resistance at top
            } else if (newScroll > maxScroll) {
                newScroll = maxScroll + (newScroll - maxScroll) * 0.5; // Resistance at bottom
            }
            
            scrollableElement.scrollTop = newScroll;
        }

        scrollState.currentY = touch.clientY;
        scrollState.currentX = touch.clientX;
        scrollState.lastTime = currentTime;
    }

    function handleTouchEnd(e) {
        if (!isMobileDevice()) return;

        const modal = e.target.closest('#modal-tienda-carrusel, .modal-personalizacion');
        if (!modal) return;

        if (scrollState.isScrolling && Math.abs(scrollState.velocityY) > 5) {
            // Apply momentum scrolling
            applyMomentumScroll(getScrollableElement(e.target));
        }

        // Reset state
        scrollState.isScrolling = false;
        scrollState.isDragging = false;
    }

    function applyMomentumScroll(element) {
        function animate() {
            if (Math.abs(scrollState.velocityY) < 1) {
                scrollState.momentumId = null;
                return;
            }

            const maxScroll = element.scrollHeight - element.clientHeight;
            const currentScroll = element.scrollTop;
            
            let newScroll = currentScroll - scrollState.velocityY * 0.016; // 60fps
            
            // Boundary resistance for momentum
            if (newScroll < 0) {
                newScroll = 0;
                scrollState.velocityY = 0;
            } else if (newScroll > maxScroll) {
                newScroll = maxScroll;
                scrollState.velocityY = 0;
            } else {
                element.scrollTop = newScroll;
                scrollState.velocityY *= SCROLL_CONFIG.momentumDamping;
                scrollState.momentumId = requestAnimationFrame(animate);
            }
        }
        
        scrollState.momentumId = requestAnimationFrame(animate);
    }

    function handleInputFocus(e) {
        if (!isMobileDevice()) return;

        const input = e.target.closest('input, select, textarea');
        if (!input) return;

        const modal = input.closest('#modal-tienda-carrusel, .modal-personalizacion');
        if (!modal) return;

        // Prevent body scroll when input is focused
        setTimeout(() => {
            scrollState.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            preventBodyScroll();
            
            // Smooth scroll to input
            const inputRect = input.getBoundingClientRect();
            const modalRect = modal.getBoundingClientRect();
            const targetScroll = inputRect.top - modalRect.top - (modal.clientHeight / 3);
            
            smoothScrollTo(modal, targetScroll);
        }, 100);
    }

    function handleInputBlur(e) {
        if (!isMobileDevice()) return;

        const input = e.target.closest('input, select, textarea');
        if (!input) return;

        const modal = input.closest('#modal-tienda-carrusel, .modal-personalizacion');
        if (!modal) return;

        // Restore body scroll
        setTimeout(() => {
            restoreBodyScroll();
        }, 100);
    }

    function enhanceModalScroll() {
        const modals = document.querySelectorAll('#modal-tienda-carrusel, .modal-personalizacion');
        
        modals.forEach(modal => {
            // Add smooth scrolling class
            modal.classList.add('mobile-scroll-enhanced');
            
            // Ensure proper overflow settings
            modal.style.overflowY = 'auto';
            modal.style.webkitOverflowScrolling = 'touch';
            modal.style.overscrollBehavior = 'contain';
            
            // Add scroll event listener for performance optimization
            let scrollTimeout;
            modal.addEventListener('scroll', () => {
                modal.classList.add('scrolling');
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    modal.classList.remove('scrolling');
                }, 150);
            }, { passive: true });
        });
    }

    function init() {
        if (!isMobileDevice()) return;

        // Add CSS for enhanced scrolling
        const style = document.createElement('style');
        style.textContent = `
            .mobile-scroll-enhanced {
                -webkit-overflow-scrolling: touch !important;
                overscroll-behavior: contain !important;
                scroll-behavior: smooth !important;
            }
            
            .mobile-scroll-enhanced.scrolling * {
                pointer-events: none !important;
            }
            
            .mobile-scroll-enhanced input,
            .mobile-scroll-enhanced select,
            .mobile-scroll-enhanced textarea {
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
                user-select: none !important;
            }
            
            /* Prevent rubber band effect on iOS */
            .mobile-scroll-enhanced {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: contain;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
        document.addEventListener('focus', handleInputFocus, { passive: true, capture: true });
        document.addEventListener('blur', handleInputBlur, { passive: true, capture: true });

        // Enhance existing modals
        enhanceModalScroll();

        // Watch for dynamically added modals
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && (node.matches('#modal-tienda-carrusel, .modal-personalizacion'))) {
                            enhanceModalScroll();
                        }
                        
                        // Check for modals within added containers
                        const modals = node.querySelectorAll ? node.querySelectorAll('#modal-tienda-carrusel, .modal-personalizacion') : [];
                        if (modals.length > 0) {
                            enhanceModalScroll();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✅ Mobile scroll enhancement initialized for personalization modals');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize on window resize (orientation change)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobileDevice()) {
                enhanceModalScroll();
            }
        }, 250);
    }, { passive: true });

})();