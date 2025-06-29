console.log('Página cargada correctamente');

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.futbol-dropdown').forEach(function(card) {
        const btn = card.querySelector('.futbol-dropdown-btn');
        const menu = card.querySelector('.futbol-dropdown-menu');
        if (btn && menu) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.querySelectorAll('.futbol-dropdown-menu').forEach(function(m) {
                    if (m !== menu) m.style.display = 'none';
                });
                document.querySelectorAll('.futbol-dropdown-btn').forEach(function(b) {
                    b.classList.remove('activo');
                    const icon = b.querySelector('i.fas');
                    if (icon) icon.classList.remove('fa-chevron-up');
                    if (icon) icon.classList.add('fa-chevron-down');
                });
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

    let carruselActual = 0;
    let carruselExistentes = [];
    let carruselMostrarImagen = function(idx) {};
    function inicializarCarruselClientes() {
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img-bg'));
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
            if (window.innerWidth <= 600) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            } else {
                if (prevBtn) prevBtn.style.display = '';
                if (nextBtn) nextBtn.style.display = '';
            }
            if (!existentes.length || !prevBtn || !nextBtn) return;
            carruselExistentes = existentes;
            carruselActual = 0;
            carruselMostrarImagen = function(idx) {
                carruselExistentes.forEach((div, i) => {
                    div.classList.toggle('activa', i === idx);
                });
            };
            prevBtn.onclick = function() {
                carruselActual = (carruselActual - 1 + carruselExistentes.length) % carruselExistentes.length;
                carruselMostrarImagen(carruselActual);
            };
            nextBtn.onclick = function() {
                carruselActual = (carruselActual + 1) % carruselExistentes.length;
                carruselMostrarImagen(carruselActual);
            };
            existentes.forEach(div => {
                div.onclick = function() {
                    mostrarModalImagen(div.getAttribute('data-img'), div.getAttribute('aria-label'));
                };
            });
            carruselMostrarImagen(carruselActual);
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
                        <div id="modal-mensaje-desliza" style="display:none;position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(42,91,168,0.92);color:#fff;padding:0.4em 1em;border-radius:10px;font-size:1rem;z-index:30;">Desliza para ver más imágenes</div>
                    </div>
                    <button class="modal-arrow modal-arrow-right" aria-label="Siguiente" style="position:absolute;right:-60px;top:50%;transform:translateY(-50%);width:48px;height:48px;background:var(--azul-acento,#2a5ba8);border:none;border-radius:50%;color:#fff;font-size:2rem;box-shadow:0 2px 8px rgba(42,91,168,0.10);display:flex;align-items:center;justify-content:center;z-index:10;cursor:pointer;transition:background 0.2s;outline:none;">
                        <span style="display:inline-block;transform:translateX(2px);">&#8594;</span>
                    </button>
                    <button class="modal-cerrar" aria-label="Cerrar">&times;</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        const imagenes = Array.from(document.querySelectorAll('.carrusel-img-bg'));
        const existentes = imagenes.filter(div => {
            const imgUrl = div.getAttribute('data-img');
            return [
                'assets/clientes/cliente1.jpg','assets/clientes/cliente2.jpg','assets/clientes/cliente3.jpg','assets/clientes/cliente4.jpg',
                'assets/clientes/cliente5.jpg','assets/clientes/cliente6.jpg','assets/clientes/cliente7.jpg','assets/clientes/cliente8.jpg',
                'assets/clientes/cliente9.jpg','assets/clientes/cliente10.jpg','assets/clientes/cliente11.jpg','assets/clientes/cliente12.jpg'
            ].includes(imgUrl);
        });
        let actual = existentes.findIndex(div => div.getAttribute('data-img') === src);
        if (actual === -1) actual = 0;
        const canvas = modal.querySelector('#modal-canvas-clientes');
        let zoomActivo = false;
        let imgOriginal = null;
        let zoomHandlers = [];
        function limpiarZoomHandlers() {
            if (!canvas) return;
            zoomHandlers.forEach(({event, handler}) => {
                canvas.removeEventListener(event, handler);
            });
            zoomHandlers = [];
        }
        function dibujarImagen(idx) {
            limpiarZoomHandlers();
            zoomActivo = false;
            if (!canvas) return;
            const div = existentes[idx];
            if (!div) return;
            const imgUrl = div.getAttribute('data-img');
            imgOriginal = new window.Image();
            imgOriginal.onload = function() {
                canvas.width = imgOriginal.width;
                canvas.height = imgOriginal.height;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(imgOriginal, 0, 0, canvas.width, canvas.height);
                const fontSize = Math.floor(canvas.height/18);
                ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                const y = canvas.height - 2 * fontSize;
                ctx.globalAlpha = 0.48;
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#000';
                ctx.strokeText('@CAMISETAZO._', canvas.width/2, y);
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.62;
                ctx.fillText('@CAMISETAZO._', canvas.width/2, y);
                ctx.globalAlpha = 1;
            };
            imgOriginal.src = imgUrl;
            canvas.style.cursor = (!esMovil() && !("ontouchstart" in window && navigator.maxTouchPoints > 0)) ? 'zoom-in' : 'default';
            function esMovil() {
                return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|webOS|BlackBerry/i.test(navigator.userAgent);
            }
            if (!esMovil() && !("ontouchstart" in window && navigator.maxTouchPoints > 0)) {
                const clickHandler = function(e) {
                    zoomActivo = !zoomActivo;
                    if (zoomActivo) {
                        canvas.style.cursor = 'zoom-out';
                        const rect = canvas.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        dibujarZoom(x, y);
                    } else {
                        canvas.style.cursor = 'zoom-in';
                        dibujarImagen(actual);
                    }
                };
                const moveHandler = function(e) {
                    if (!zoomActivo) return;
                    const rect = canvas.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    dibujarZoom(x, y);
                };
                canvas.addEventListener('click', clickHandler);
                canvas.addEventListener('mousemove', moveHandler);
                zoomHandlers.push({event:'click', handler:clickHandler});
                zoomHandlers.push({event:'mousemove', handler:moveHandler});
            } else {
                const blockZoom = function(e) { e.stopPropagation(); e.preventDefault(); };
                canvas.addEventListener('click', blockZoom);
                zoomHandlers.push({event:'click', handler:blockZoom});
            }
        }
        function dibujarZoom(x, y) {
            if (!imgOriginal || !imgOriginal.complete) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width, h = canvas.height;
            const zoomScale = 2;
            ctx.clearRect(0, 0, w, h);
            const zoomW = w / zoomScale;
            const zoomH = h / zoomScale;
            let sx = x * w - zoomW / 2;
            let sy = y * h - zoomH / 2;
            sx = Math.max(0, Math.min(sx, w - zoomW));
            sy = Math.max(0, Math.min(sy, h - zoomH));
            ctx.drawImage(imgOriginal, sx, sy, zoomW, zoomH, 0, 0, w, h);
            const fontSize = Math.floor(h/18);
            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const yText = h - 2 * fontSize;
            ctx.globalAlpha = 0.48;
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#000';
            ctx.strokeText('@CAMISETAZO._', w/2, yText);
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.62;
            ctx.fillText('@CAMISETAZO._', w/2, yText);
            ctx.globalAlpha = 1;
        }
        const leftArrow = modal.querySelector('.modal-arrow-left');
        const rightArrow = modal.querySelector('.modal-arrow-right');
        if (window.innerWidth > 600) {
            if (leftArrow) leftArrow.onclick = function(e) {
                e.stopPropagation();
                actual = (actual - 1 + existentes.length) % existentes.length;
                dibujarImagen(actual);
            };
            if (rightArrow) rightArrow.onclick = function(e) {
                e.stopPropagation();
                actual = (actual + 1) % existentes.length;
                dibujarImagen(actual);
            };
        }
        const watermarkDiv = modal.querySelector('#watermark-text');
        if (watermarkDiv) watermarkDiv.style.display = 'none';
        if (window.innerWidth <= 600) {
            if (leftArrow) leftArrow.style.display = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
        } else {
            if (leftArrow) leftArrow.style.display = '';
            if (rightArrow) rightArrow.style.display = '';
        }
        function esMovil() {
            return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|webOS|BlackBerry/i.test(navigator.userAgent);
        }
        function cerrarModalSeguro() {
            limpiarZoomHandlers();
            zoomActivo = false;
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => { modal.style.display = 'none'; }, 250);
            }
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDownModal);
        }
        modal.querySelector('.modal-fondo').onclick = cerrarModalSeguro;
        modal.querySelector('.modal-cerrar').onclick = cerrarModalSeguro;
        function onKeyDownModal(e) {
            if (e.key === 'Escape') cerrarModalSeguro();
        }
        document.addEventListener('keydown', onKeyDownModal);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.25s';
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
        }
        dibujarImagen(actual);
        if (window.innerWidth <= 600) {
            const mensajeDesliza = modal.querySelector('#modal-mensaje-desliza');
            if (mensajeDesliza) {
                mensajeDesliza.textContent = 'Desliza para ver más imágenes';
                mensajeDesliza.style.display = 'block';
                mensajeDesliza.style.opacity = '1';
                mensajeDesliza.style.transition = 'opacity 0.7s';
                setTimeout(() => {
                    mensajeDesliza.style.opacity = '0';
                }, 1800);
                setTimeout(() => {
                    mensajeDesliza.style.display = 'none';
                }, 2500);
            }
        }
        let modalStartX = null;
        let modalMoved = false;
        if (canvas) {
            canvas.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    modalStartX = e.touches[0].clientX;
                    modalMoved = false;
                }
            });
            canvas.addEventListener('touchmove', function(e) {
                if (modalStartX !== null && e.touches.length === 1) {
                    const deltaX = e.touches[0].clientX - modalStartX;
                    if (Math.abs(deltaX) > 30) {
                        modalMoved = true;
                        if (deltaX > 0) {
                            actual = (actual - 1 + existentes.length) % existentes.length;
                            dibujarImagen(actual);
                        } else {
                            actual = (actual + 1) % existentes.length;
                            dibujarImagen(actual);
                        }
                        modalStartX = null;
                    }
                }
            });
            canvas.addEventListener('touchend', function() {
                modalStartX = null;
            });
        }
    }
    inicializarCarruselClientes();
    document.querySelectorAll('.boton-seccion').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.seccion === 'quienes-somos') {
                setTimeout(inicializarCarruselClientes, 100);
            }
        });
    });
    document.querySelectorAll('.carrusel-img-bg').forEach(function(div) {
        div.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        div.addEventListener('dragstart', function(e) { e.preventDefault(); });
    });
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
        overlay.style.pointerEvents = 'none';
        carruselImagenes.style.position = 'relative';
        carruselImagenes.appendChild(overlay);
    }
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
                        carruselActual = (carruselActual - 1 + carruselExistentes.length) % carruselExistentes.length;
                        carruselMostrarImagen(carruselActual);
                    } else {
                        carruselActual = (carruselActual + 1) % carruselExistentes.length;
                        carruselMostrarImagen(carruselActual);
                    }
                    startX = null;
                }
            }
        });
        imagenesContainer.addEventListener('touchend', function() {
            startX = null;
        });
    }
    function mostrarIndicadorClickCarrusel() {
        const primeraImg = document.querySelector('.carrusel-img-bg');
        if (!primeraImg) return;
        if (!localStorage.getItem('carruselClickHintShown')) {
            primeraImg.classList.add('clickable-hint');
            setTimeout(() => {
                primeraImg.classList.remove('clickable-hint');
                localStorage.setItem('carruselClickHintShown', '1');
            }, 2400);
        }
        if (!primeraImg.querySelector('.zoom-icon')) {
            const icon = document.createElement('span');
            icon.className = 'zoom-icon';
            icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" stroke="#ffd700" stroke-width="2"/><line x1="14.2" y1="14.2" x2="18" y2="18" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/></svg>`;
            primeraImg.appendChild(icon);
        }
        primeraImg.setAttribute('data-tooltip', 'Haz clic para ampliar');
    }
    mostrarIndicadorClickCarrusel();
});
