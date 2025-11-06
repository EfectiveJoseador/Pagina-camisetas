// Script para manejar el sidebar en dispositivos móviles

(function() {
    'use strict';
    
    // Solo ejecutar en dispositivos móviles
    function initMobileSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        // Crear botón hamburguesa para móvil (solo si no existe)
        if (!document.querySelector('.mobile-menu-toggle') && window.innerWidth <= 768) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.setAttribute('aria-label', 'Abrir menú');
            
            // Insertar el botón en el main-content
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.insertBefore(toggleBtn, mainContent.firstChild);
                
                // Event listener para abrir/cerrar sidebar
                toggleBtn.addEventListener('click', function() {
                    sidebar.classList.toggle('mobile-open');
                    document.body.classList.toggle('sidebar-open');
                    
                    // Cambiar icono
                    const icon = this.querySelector('i');
                    if (sidebar.classList.contains('mobile-open')) {
                        icon.className = 'fas fa-times';
                        this.setAttribute('aria-label', 'Cerrar menú');
                    } else {
                        icon.className = 'fas fa-bars';
                        this.setAttribute('aria-label', 'Abrir menú');
                    }
                });
            }
            
            // Crear overlay para cerrar al hacer click fuera
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-open');
                const icon = toggleBtn.querySelector('i');
                icon.className = 'fas fa-bars';
                toggleBtn.setAttribute('aria-label', 'Abrir menú');
            });
        }
        
        // Cerrar sidebar al hacer click en un enlace de navegación (móvil)
        const navButtons = sidebar.querySelectorAll('.boton-seccion');
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('mobile-open');
                    document.body.classList.remove('sidebar-open');
                    const toggleBtn = document.querySelector('.mobile-menu-toggle');
                    if (toggleBtn) {
                        const icon = toggleBtn.querySelector('i');
                        icon.className = 'fas fa-bars';
                        toggleBtn.setAttribute('aria-label', 'Abrir menú');
                    }
                }
            });
        });
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileSidebar);
    } else {
        initMobileSidebar();
    }
    
    // Reinicializar en resize (con debounce)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Remover elementos si pasamos a desktop
            if (window.innerWidth > 768) {
                const toggleBtn = document.querySelector('.mobile-menu-toggle');
                const overlay = document.querySelector('.sidebar-overlay');
                if (toggleBtn) toggleBtn.remove();
                if (overlay) overlay.remove();
                document.body.classList.remove('sidebar-open');
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.remove('mobile-open');
            } else {
                initMobileSidebar();
            }
        }, 250);
    });
})();

