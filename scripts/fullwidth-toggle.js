/**
 * Sistema de Vista Expandida para Tienda
 * Permite ocultar el sidebar y expandir las tarjetas de productos
 */

(function() {
    'use strict';
    
    // Crear el botón de toggle
    function createToggleButton() {
        // Verificar si ya existe
        if (document.querySelector('.view-expand-toggle')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'view-expand-toggle';
        button.setAttribute('aria-label', 'Expandir vista');
        button.innerHTML = `
            <i class="fas fa-expand"></i>
            <span class="toggle-text">Vista Expandida</span>
        `;
        
        // Añadir a la página (visible en todas las secciones)
        document.body.appendChild(button);
        
        // Event listener
        button.addEventListener('click', toggleFullwidthView);
        
        // El botón siempre está visible
        button.style.display = 'flex';
    }
    
    // Toggle de vista completa
    function toggleFullwidthView() {
        const body = document.body;
        const button = document.querySelector('.view-expand-toggle');
        const icon = button.querySelector('i');
        const text = button.querySelector('.toggle-text');
        
        body.classList.toggle('fullwidth-view');
        
        if (body.classList.contains('fullwidth-view')) {
            icon.className = 'fas fa-compress';
            text.textContent = 'Vista Normal';
            button.setAttribute('aria-label', 'Contraer vista');
            
            // Guardar preferencia
            localStorage.setItem('tiendaFullwidthView', 'true');
        } else {
            icon.className = 'fas fa-expand';
            text.textContent = 'Vista Expandida';
            button.setAttribute('aria-label', 'Expandir vista');
            
            // Guardar preferencia
            localStorage.setItem('tiendaFullwidthView', 'false');
        }
    }
    
    // Restaurar preferencia guardada
    function restoreSavedPreference() {
        const savedPreference = localStorage.getItem('tiendaFullwidthView');
        const button = document.querySelector('.view-expand-toggle');
        
        if (savedPreference === 'true') {
            document.body.classList.add('fullwidth-view');
            
            if (button) {
                const icon = button.querySelector('i');
                const text = button.querySelector('.toggle-text');
                icon.className = 'fas fa-compress';
                text.textContent = 'Vista Normal';
                button.setAttribute('aria-label', 'Contraer vista');
            }
        }
    }
    
    
    // Inicialización
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createToggleButton();
                restoreSavedPreference();
            });
        } else {
            createToggleButton();
            restoreSavedPreference();
        }
    }
    
    // Ejecutar
    init();
})();

