/**
 * Utilidad para verificar la integración de Google Analytics
 */
(function() {
    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        // Verificar si GA está cargado correctamente
        function checkGALoaded() {
            if (typeof gtag === 'function') {
                console.log('%c✓ Google Analytics (gtag) está disponible', 'color: green; font-weight: bold');
                
                // Verificar si el ID de GA está configurado
                if (window.dataLayer && window.dataLayer.length > 0) {
                    const configFound = window.dataLayer.some(item => 
                        item && item[0] === 'config' && item[1] === 'G-GS53GWE2Z0'
                    );
                    
                    if (configFound) {
                        console.log('%c✓ Google Analytics está configurado con ID: G-GS53GWE2Z0', 'color: green; font-weight: bold');
                    } else {
                        console.log('%c✗ Google Analytics no está configurado con el ID correcto', 'color: orange; font-weight: bold');
                        console.log('Esperando consentimiento de cookies para inicializar GA...');
                    }
                } else {
                    console.log('%c✗ dataLayer no contiene configuración de GA', 'color: orange; font-weight: bold');
                    console.log('Esperando consentimiento de cookies para inicializar GA...');
                }
            } else {
                console.log('%c✗ Google Analytics (gtag) no está disponible', 'color: red; font-weight: bold');
                console.log('Posibles causas: script no cargado, bloqueado por CSP o adblocker');
            }
            
            // Verificar consentimiento de cookies
            const hasConsent = localStorage.getItem('camisetazo_cookie_consent') === 'true';
            console.log(`%c${hasConsent ? '✓' : '✗'} Consentimiento de cookies: ${hasConsent ? 'Aceptado' : 'Pendiente'}`, 
                        `color: ${hasConsent ? 'green' : 'orange'}; font-weight: bold`);
        }
        
        // Ejecutar verificación después de un tiempo para asegurar que los scripts se han cargado
        setTimeout(checkGALoaded, 1000);
        
        // Añadir botón para probar eventos de GA
        const testButton = document.createElement('button');
        testButton.textContent = 'Probar evento GA';
        testButton.style.cssText = 'position: fixed; bottom: 80px; right: 20px; z-index: 9999; ' +
                                  'background: #2e7bed; color: white; border: none; padding: 10px 15px; ' +
                                  'border-radius: 5px; cursor: pointer; font-weight: bold;';
        
        testButton.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                // Enviar evento de prueba
                gtag('event', 'test_event', {
                    'event_category': 'testing',
                    'event_label': 'GA Test Button Click',
                    'value': 1
                });
                console.log('%c✓ Evento de prueba enviado a GA', 'color: green; font-weight: bold');
                alert('Evento de prueba enviado a Google Analytics. Revisa la consola para más detalles.');
            } else {
                console.log('%c✗ No se pudo enviar el evento de prueba - gtag no disponible', 'color: red; font-weight: bold');
                alert('No se pudo enviar el evento de prueba. Google Analytics no está disponible.');
            }
        });
        
        document.body.appendChild(testButton);
    });
})();