// Archivo de scripts para la página
console.log('Página cargada correctamente');

document.addEventListener('DOMContentLoaded', function() {
    // Soporte para múltiples menús desplegables si se agregan más en el futuro
    document.querySelectorAll('.futbol-dropdown').forEach(function(card) {
        const btn = card.querySelector('.futbol-dropdown-btn');
        const menu = card.querySelector('.futbol-dropdown-menu');
        if (btn && menu) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Cerrar otros menús abiertos y quitar estilos activos
                document.querySelectorAll('.futbol-dropdown-menu').forEach(function(m) {
                    if (m !== menu) m.style.display = 'none';
                });
                document.querySelectorAll('.futbol-dropdown-btn').forEach(function(b) {
                    b.classList.remove('activo');
                    const icon = b.querySelector('i.fas');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                });
                // Toggle menú y estilos activos
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                    btn.classList.remove('activo');
                    const icon = btn.querySelector('i.fas');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                } else {
                    menu.style.display = 'block';
                    btn.classList.add('activo');
                    const icon = btn.querySelector('i.fas');
                    if (icon) icon.classList.remove('fa-chevron-down');
                    if (icon) icon.classList.add('fa-chevron-up');
                }
            });
        }
    });
    // Eliminamos el cierre automático al hacer clic fuera
    // Carrusel de clientes satisfechos
    function inicializarCarruselClientes() {
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img'));
        // Filtrar imágenes que realmente existen (no están ocultas por error de carga)
        const imagenesValidas = imagenes.filter(img => img.complete && img.naturalWidth !== 0);
        const prevBtn = document.getElementById('carrusel-prev');
        const nextBtn = document.getElementById('carrusel-next');
        if (!imagenesValidas.length || !prevBtn || !nextBtn) return;
        let actual = 0;
        function mostrarImagen(idx) {
            imagenesValidas.forEach((img, i) => {
                img.classList.toggle('activa', i === idx);
                img.style.display = i === idx ? 'block' : 'none';
            });
        }
        prevBtn.onclick = function() {
            actual = (actual - 1 + imagenesValidas.length) % imagenesValidas.length;
            mostrarImagen(actual);
        };
        nextBtn.onclick = function() {
            actual = (actual + 1) % imagenesValidas.length;
            mostrarImagen(actual);
        };
        // Ampliar imagen al hacer click
        imagenesValidas.forEach(img => {
            img.onclick = function() {
                mostrarModalImagen(this.src, this.alt);
            };
        });
        mostrarImagen(actual);
    }
    // Modal para zoom
    function mostrarModalImagen(src, alt) {
        let modal = document.getElementById('modal-imagen-clientes');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-imagen-clientes';
            modal.innerHTML = `
                <div class="modal-fondo"></div>
                <div class="modal-contenido" style="position:relative;display:flex;align-items:center;justify-content:center;gap:0;">
                    <button class="modal-arrow modal-arrow-left" aria-label="Anterior" style="position:absolute;left:-60px;top:50%;transform:translateY(-50%);width:48px;height:48px;background:var(--azul-acento,#2a5ba8);border:none;border-radius:50%;color:#fff;font-size:2rem;box-shadow:0 2px 8px rgba(42,91,168,0.10);display:flex;align-items:center;justify-content:center;z-index:10;cursor:pointer;transition:background 0.2s;outline:none;">
                        <span style="display:inline-block;transform:translateX(-2px);">&#8592;</span>
                    </button>
                    <div style="position:relative;display:inline-block;">
                        <canvas id="modal-canvas-clientes" width="500" height="500" style="max-width:90vw;max-height:70vh;border-radius:14px;"></canvas>
                        <div id="watermark-text" style="position:absolute;bottom:18px;right:18px;color:#fff;font-size:1.5rem;font-weight:bold;opacity:0.7;text-shadow:1px 1px 4px #000;pointer-events:none;user-select:none;">@camisetazo._</div>
                    </div>
                    <button class="modal-arrow modal-arrow-right" aria-label="Siguiente" style="position:absolute;right:-60px;top:50%;transform:translateY(-50%);width:48px;height:48px;background:var(--azul-acento,#2a5ba8);border:none;border-radius:50%;color:#fff;font-size:2rem;box-shadow:0 2px 8px rgba(42,91,168,0.10);display:flex;align-items:center;justify-content:center;z-index:10;cursor:pointer;transition:background 0.2s;outline:none;">
                        <span style="display:inline-block;transform:translateX(2px);">&#8594;</span>
                    </button>
                    <button class="modal-cerrar" aria-label="Cerrar">&times;</button>
                </div>
            `;
            document.body.appendChild(modal);
            modal.querySelector('.modal-fondo').onclick = cerrarModal;
            modal.querySelector('.modal-cerrar').onclick = cerrarModal;
        }
        // Obtener imágenes válidas y el índice actual
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img')).filter(img => img.complete && img.naturalWidth !== 0);
        let actual = imagenes.findIndex(img => img.src === src || img.currentSrc === src);
        if (actual === -1) actual = 0;
        // Función para mostrar imagen en el modal
        function mostrarEnModal(idx) {
            const img = imagenes[idx];
            if (!img) return;
            const canvas = modal.querySelector('#modal-canvas-clientes');
            const ctx = canvas.getContext('2d');
            const tempImg = new window.Image();
            tempImg.onload = function() {
                canvas.width = tempImg.width;
                canvas.height = tempImg.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
                // Marca de agua en blanco, trazo negro fino, parte inferior central, opacidad media y más arriba
                const watermark = '@CAMISETAZO._';
                const fontSize = Math.floor(canvas.height/18);
                ctx.font = `bold ${fontSize}px Impact, Arial Black, Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                const y = canvas.height - 2 * fontSize;
                ctx.globalAlpha = 0.48;
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#000';
                ctx.strokeText(watermark, canvas.width/2, y);
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.62;
                ctx.fillText(watermark, canvas.width/2, y);
                ctx.globalAlpha = 1;
            };
            tempImg.src = img.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        // Asignar eventos a las flechas
        modal.querySelector('.modal-arrow-left').onclick = function(e) {
            e.stopPropagation();
            actual = (actual - 1 + imagenes.length) % imagenes.length;
            mostrarEnModal(actual);
        };
        modal.querySelector('.modal-arrow-right').onclick = function(e) {
            e.stopPropagation();
            actual = (actual + 1) % imagenes.length;
            mostrarEnModal(actual);
        };
        // Ocultar el watermark HTML (solo canvas)
        modal.querySelector('#watermark-text').style.display = 'none';
        mostrarEnModal(actual);
    }
    function cerrarModal() {
        const modal = document.getElementById('modal-imagen-clientes');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    inicializarCarruselClientes();
    document.querySelectorAll('.boton-seccion').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.seccion === 'quienes-somos') {
                setTimeout(inicializarCarruselClientes, 100); // Espera a que se muestre
            }
        });
    });
    // Proteger imágenes del carrusel de clientes satisfechos sin afectar el click
    document.querySelectorAll('.carrusel-img').forEach(function(img) {
        img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        img.addEventListener('dragstart', function(e) { e.preventDefault(); });
    });
});
