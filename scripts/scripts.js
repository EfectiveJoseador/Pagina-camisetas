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
    // Carrusel de clientes satisfechos con imágenes como fondo
    function inicializarCarruselClientes() {
        // Solo incluir los divs que tengan imagen realmente existente
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img-bg'));
        // Filtrar solo los divs cuya imagen realmente existe usando una petición HEAD
        const existentes = [];
        let pendientes = imagenes.length;
        if (!imagenes.length) return;
        imagenes.forEach(div => {
            const imgUrl = div.getAttribute('data-img');
            fetch(imgUrl, { method: 'HEAD' })
                .then(resp => {
                    if (resp.ok) existentes.push(div);
                })
                .catch(() => {})
                .finally(() => {
                    pendientes--;
                    if (pendientes === 0) inicializarCarruselConExistentes(existentes);
                });
        });
        function inicializarCarruselConExistentes(existentes) {
            existentes.forEach(div => {
                const imgUrl = div.getAttribute('data-img');
                div.style.backgroundImage = `url('${imgUrl}')`;
            });
            const prevBtn = document.getElementById('carrusel-prev');
            const nextBtn = document.getElementById('carrusel-next');
            if (!existentes.length || !prevBtn || !nextBtn) return;
            let actual = 0;
            function mostrarImagen(idx) {
                existentes.forEach((div, i) => {
                    div.classList.toggle('activa', i === idx);
                });
            }
            prevBtn.onclick = function() {
                actual = (actual - 1 + existentes.length) % existentes.length;
                mostrarImagen(actual);
            };
            nextBtn.onclick = function() {
                actual = (actual + 1) % existentes.length;
                mostrarImagen(actual);
            };
            existentes.forEach(div => {
                div.onclick = function() {
                    mostrarModalImagen(div.getAttribute('data-img'), div.getAttribute('aria-label'));
                };
            });
            mostrarImagen(actual);
        }
        return;
        existentes.forEach(div => {
            const imgUrl = div.getAttribute('data-img');
            div.style.backgroundImage = `url('${imgUrl}')`;
        });
        const prevBtn = document.getElementById('carrusel-prev');
        const nextBtn = document.getElementById('carrusel-next');
        if (!existentes.length || !prevBtn || !nextBtn) return;
        let actual = 0;
        function mostrarImagen(idx) {
            existentes.forEach((div, i) => {
                div.classList.toggle('activa', i === idx);
            });
        }
        prevBtn.onclick = function() {
            actual = (actual - 1 + existentes.length) % existentes.length;
            mostrarImagen(actual);
        };
        nextBtn.onclick = function() {
            actual = (actual + 1) % existentes.length;
            mostrarImagen(actual);
        };
        existentes.forEach(div => {
            div.onclick = function() {
                mostrarModalImagen(div.getAttribute('data-img'), div.getAttribute('aria-label'));
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
        // Obtener solo los divs de imágenes existentes
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img-bg'));
        const existentes = imagenes.filter(div => {
            const imgUrl = div.getAttribute('data-img');
            return [
                'assets/clientes/cliente1.jpg',
                'assets/clientes/cliente2.jpg',
                'assets/clientes/cliente3.jpg',
                'assets/clientes/cliente4.jpg',
                'assets/clientes/cliente5.jpg',
                'assets/clientes/cliente6.jpg',
                'assets/clientes/cliente7.jpg',
                'assets/clientes/cliente8.jpg',
                'assets/clientes/cliente9.jpg',
                'assets/clientes/cliente10.jpg',
                'assets/clientes/cliente11.jpg',
                'assets/clientes/cliente12.jpg'
            ].includes(imgUrl);
        });
        let actual = existentes.findIndex(div => div.getAttribute('data-img') === src);
        if (actual === -1) actual = 0;
        // Función para mostrar imagen en el modal
        function mostrarEnModal(idx) {
            const div = existentes[idx];
            if (!div) return;
            const imgUrl = div.getAttribute('data-img');
            const canvas = modal.querySelector('#modal-canvas-clientes');
            const ctx = canvas.getContext('2d');
            const tempImg = new window.Image();
            tempImg.onload = function() {
                canvas.width = tempImg.width;
                canvas.height = tempImg.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
                // Marca de agua universal en mayúsculas
                const watermark = '@CAMISETAZO._';
                const fontSize = Math.floor(canvas.height/18);
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
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
            tempImg.src = imgUrl;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // 1. Animación de transición suave al abrir/cerrar el modal
            if (modal) {
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.25s';
                setTimeout(() => { modal.style.opacity = '1'; }, 10);
            }
            // 2. Cerrar modal con tecla Escape
            function onKeyDownModal(e) {
                if (e.key === 'Escape') cerrarModal();
            }
            document.addEventListener('keydown', onKeyDownModal);
            // Limpiar listener al cerrar
            const oldCerrarModal = cerrarModal;
            cerrarModal = function() {
                if (modal) {
                    modal.style.opacity = '0';
                    setTimeout(() => { modal.style.display = 'none'; }, 250);
                }
                document.body.style.overflow = '';
                document.removeEventListener('keydown', onKeyDownModal);
            }
        }
        // Soporte táctil para deslizar en el modal ampliado
        let modalStartX = null;
        let modalActual = actual;
        const modalCanvas = () => modal.querySelector('#modal-canvas-clientes');
        const modalContenido = modal.querySelector('.modal-contenido');
        if (modalContenido) {
            modalContenido.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    modalStartX = e.touches[0].clientX;
                }
            });
            modalContenido.addEventListener('touchmove', function(e) {
                if (modalStartX !== null && e.touches.length === 1) {
                    const deltaX = e.touches[0].clientX - modalStartX;
                    if (Math.abs(deltaX) > 30) {
                        if (deltaX > 0) {
                            actual = (actual - 1 + existentes.length) % existentes.length;
                        } else {
                            actual = (actual + 1) % existentes.length;
                        }
                        mostrarEnModal(actual);
                        modalStartX = null;
                    }
                }
            });
            modalContenido.addEventListener('touchend', function() {
                modalStartX = null;
            });
        }
        // Asignar eventos a las flechas
        modal.querySelector('.modal-arrow-left').onclick = function(e) {
            e.stopPropagation();
            actual = (actual - 1 + existentes.length) % existentes.length;
            mostrarEnModal(actual);
        };
        modal.querySelector('.modal-arrow-right').onclick = function(e) {
            e.stopPropagation();
            actual = (actual + 1) % existentes.length;
            mostrarEnModal(actual);
        };
        // Ocultar el watermark HTML (solo canvas)
        modal.querySelector('#watermark-text').style.display = 'none';
        mostrarEnModal(actual);
        // Soporte de zoom tipo lupa en el modal
        let zoomActivo = false;
        let zoomScale = 2;
        let zoomX = 0, zoomY = 0;
        const canvas = modal.querySelector('#modal-canvas-clientes');
        if (canvas) {
            // Eliminar icono de lupa si existe
            const lupaIcon = canvas.parentElement.querySelector('#lupa-zoom-icon');
            if (lupaIcon) lupaIcon.remove();
            let zoomActivo = false;
            let zoomX = 0, zoomY = 0;
            canvas.style.cursor = 'zoom-in';
            canvas.addEventListener('click', function(e) {
                zoomActivo = !zoomActivo;
                if (zoomActivo) {
                    canvas.style.cursor = 'zoom-out';
                    const rect = canvas.getBoundingClientRect();
                    zoomX = (e.clientX - rect.left) / rect.width;
                    zoomY = (e.clientY - rect.top) / rect.height;
                    dibujarZoomDinamico(zoomX, zoomY);
                } else {
                    canvas.style.cursor = 'zoom-in';
                    mostrarEnModal(actual);
                }
            });
            canvas.addEventListener('mousemove', function(e) {
                if (!zoomActivo) return;
                const rect = canvas.getBoundingClientRect();
                zoomX = (e.clientX - rect.left) / rect.width;
                zoomY = (e.clientY - rect.top) / rect.height;
                dibujarZoomDinamico(zoomX, zoomY);
            });
            function dibujarZoomDinamico(x, y) {
                const div = existentes[actual];
                if (!div) return;
                const imgUrl = div.getAttribute('data-img');
                const tempImg = new window.Image();
                tempImg.onload = function() {
                    canvas.width = tempImg.width;
                    canvas.height = tempImg.height;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // Zoom x2 centrado en el punto
                    const zoomScale = 2;
                    const zoomW = canvas.width / zoomScale;
                    const zoomH = canvas.height / zoomScale;
                    let sx = canvas.width * x - zoomW / 2;
                    let sy = canvas.height * y - zoomH / 2;
                    sx = Math.max(0, Math.min(sx, canvas.width - zoomW));
                    sy = Math.max(0, Math.min(sy, canvas.height - zoomH));
                    ctx.drawImage(tempImg, sx, sy, zoomW, zoomH, 0, 0, canvas.width, canvas.height);
                    // Marca de agua
                    const watermark = '@CAMISETAZO._';
                    const fontSize = Math.floor(canvas.height/18);
                    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    const yText = canvas.height - 2 * fontSize;
                    ctx.globalAlpha = 0.48;
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#000';
                    ctx.strokeText(watermark, canvas.width/2, yText);
                    ctx.fillStyle = '#fff';
                    ctx.globalAlpha = 0.62;
                    ctx.fillText(watermark, canvas.width/2, yText);
                    ctx.globalAlpha = 1;
                };
                tempImg.src = imgUrl;
            }
        }
    }
    function cerrarModal() {
        const modal = document.getElementById('modal-imagen-clientes');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => { modal.style.display = 'none'; }, 250);
        }
        document.body.style.overflow = '';
    }
    inicializarCarruselClientes();
    document.querySelectorAll('.boton-seccion').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.seccion === 'quienes-somos') {
                setTimeout(inicializarCarruselClientes, 100); // Espera a que se muestre
            }
        });
    });
    // Protección máxima: bloquear clic derecho y arrastre en los divs de fondo
    document.querySelectorAll('.carrusel-img-bg').forEach(function(div) {
        div.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        div.addEventListener('dragstart', function(e) { e.preventDefault(); });
    });
    // Protección adicional: superponer capa invisible sobre imágenes del carrusel
    const carruselImagenes = document.querySelector('.carrusel-imagenes');
    if (carruselImagenes) {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = 10;
        overlay.style.background = 'transparent';
        overlay.style.pointerEvents = 'none'; // Permite clicks en imágenes
        carruselImagenes.style.position = 'relative';
        carruselImagenes.appendChild(overlay);
    }
    // Soporte táctil para deslizar en móvil
    let startX = null;
    let moved = false;
    const imagenesContainer = document.querySelector('.carrusel-imagenes');
    if (imagenesContainer) {
        imagenesContainer.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                moved = false;
            }
        });
        imagenesContainer.addEventListener('touchmove', function(e) {
            if (startX !== null && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - startX;
                if (Math.abs(deltaX) > 30) {
                    moved = true;
                    if (deltaX > 0) {
                        actual = (actual - 1 + existentes.length) % existentes.length;
                        mostrarImagen(actual);
                    } else {
                        actual = (actual + 1) % existentes.length;
                        mostrarImagen(actual);
                    }
                    startX = null;
                }
            }
        });
        imagenesContainer.addEventListener('touchend', function() {
            startX = null;
        });
    }
});
