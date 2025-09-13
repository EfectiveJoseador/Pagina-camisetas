# Implementación de Google Analytics en Camisetazo

## Resumen de la implementación

Se ha implementado Google Analytics 4 (GA4) en el sitio web con las siguientes características:

- **ID de medición**: G-GS53GWE2Z0
- **Integración con consentimiento de cookies**: GA solo se inicializa después de que el usuario acepte las cookies
- **Compatibilidad con CSP**: Se ha actualizado la Content Security Policy para permitir los dominios de Google Analytics
- **Coexistencia con Vercel Analytics**: Se mantiene la analítica de Vercel junto con GA4

## Archivos modificados

1. **index.html**:
   - Actualizada la política CSP para permitir dominios de Google Analytics
   - Implementada la función gtag() correcta
   - Añadido el script de Google Tag Manager
   - Incluido script de prueba para verificar la integración

2. **scripts/cookie-consent.js**:
   - Modificado para inicializar GA4 solo después del consentimiento
   - Añadida lógica para inicializar GA4 si ya existe consentimiento previo

3. **scripts/ga-test.js** (nuevo):
   - Herramienta de diagnóstico para verificar la correcta implementación
   - Incluye botón para probar eventos de GA4

## Cómo verificar la implementación

1. Abre la consola del navegador (F12)
2. Carga la página principal
3. Observa los mensajes de diagnóstico en la consola
4. Si no has aceptado cookies anteriormente, verás que GA está disponible pero no inicializado
5. Acepta las cookies y verás un mensaje confirmando la inicialización
6. Usa el botón "Probar evento GA" que aparece en la esquina inferior derecha para enviar un evento de prueba

## Notas importantes

- La implementación respeta la privacidad del usuario al no inicializar GA hasta obtener consentimiento
- Se mantiene compatibilidad con Vercel Analytics como sistema de respaldo
- El script de prueba (ga-test.js) puede eliminarse en producción una vez verificada la implementación

## Próximos pasos recomendados

1. Verificar en Google Analytics que los datos se están recibiendo correctamente
2. Configurar eventos personalizados para seguimiento de conversiones
3. Implementar enhanced e-commerce para seguimiento de productos
4. Considerar la implementación de Google Tag Manager para mayor flexibilidad