

document.addEventListener('DOMContentLoaded', function() {

    function mostrarPedidoStep(id) {
        document.querySelectorAll('.pedido-flujo-step').forEach(s => s.style.display = 'none');
        document.getElementById(id).style.display = '';
    }

    document.querySelectorAll('#pedido-detalle .thumb-img').forEach(img => {
        img.addEventListener('click', function() {
            document.getElementById('pedido-detalle-img').src = this.dataset.img;
            document.querySelectorAll('#pedido-detalle .thumb-img').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('pedido-ver-detalle-btn').addEventListener('click', function() {
        mostrarPedidoStep('pedido-detalle');
    });
    document.getElementById('pedido-volver-catalogo').addEventListener('click', function() {
        mostrarPedidoStep('pedido-catalogo');
    });

    let pedidoCarrito = [];
    function renderPedidoCarrito() {
        const items = document.getElementById('pedido-carrito-items');
        items.innerHTML = '';
        if (pedidoCarrito.length === 0) {
            items.innerHTML = '<p>El carrito está vacío.</p>';
            document.getElementById('pedido-carrito-total').innerHTML = '';
            return;
        }
        pedidoCarrito.forEach((prod, idx) => {
            items.innerHTML += `
                <div class="carrito-item">
                    <img src="assets/productos/Barcelona2526L/1.jpg" class="carrito-img" alt="Camiseta Barcelona 25-26 Local" loading="lazy" width="1512" height="1512" style="width:100%;height:100%;object-fit:cover;border-radius:8px;display:block;">
                    <div>
                        <b>Camiseta Barcelona 25-26 Local</b><br>
                        Talla: ${prod.talla}<br>
                        <span class="cantidad-label">Cantidad:</span>
                        <span class="cantidad-controls">
                            <button class="cantidad-decrease" data-idx="${idx}" aria-label="Disminuir">−</button>
                            <input type="number" min="1" value="${prod.cantidad}" data-idx="${idx}" class="carrito-cantidad-input" style="width:54px; text-align:center;">
                            <button class="cantidad-increase" data-idx="${idx}" aria-label="Aumentar">+</button>
                        </span>
                        <button class="eliminar-item-btn" data-idx="${idx}"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="carrito-precio">${(prod.cantidad * 29.90).toFixed(2)}€</div>
                </div>
            `;
        });
        const totalQtyPedido = pedidoCarrito.reduce((a, p) => a + p.cantidad, 0);

        const PACKS = [
            { size: 5, price: 86.90 },
            { size: 4, price: 74.90 },
            { size: 3, price: 56.90 },
            { size: 2, price: 39.80 },
            { size: 1, price: 19.90 }
        ];

        function bestPackTotal(count){
            if (count <= 0) return 0;
            const dp = Array(count+1).fill(Infinity);
            dp[0] = 0;
            for (let i=1;i<=count;i++){
                for (const pk of PACKS){
                    if (i - pk.size < 0) continue;
                    dp[i] = Math.min(dp[i], dp[i-pk.size] + pk.price);
                }
            }
            return dp[count];
        }

        const camisetasCosteBase = pedidoCarrito.reduce((s,p) => s + (p.cantidad * 29.90), 0);
        let total = camisetasCosteBase;
        let extraHtml = '';
        if (totalQtyPedido > 1) {

            extraHtml = `<div class="badge-envio">Envío gratis</div>`;
        }
        if (totalQtyPedido >= 2) {

            const costByPacks = bestPackTotal(totalQtyPedido);
            if (isFinite(costByPacks)) {

                total = costByPacks;
            }
        }

        document.getElementById('pedido-carrito-total').innerHTML = `<h3>Total: ${total.toFixed(2)}€</h3>${extraHtml}`;
    }

    document.getElementById('pedido-agregar-carrito-btn').addEventListener('click', function() {
        const talla = document.getElementById('pedido-talla-select').value;
        const cantidad = parseInt(document.getElementById('pedido-cantidad-select').value);
        let found = false;
        pedidoCarrito.forEach(item => {
            if (item.talla === talla) {
                item.cantidad += cantidad;
                found = true;
            }
        });
        if (!found) pedidoCarrito.push({ talla, cantidad });
        mostrarPedidoStep('pedido-carrito');
        renderPedidoCarrito();

        try {
            const totalQtyPedido = pedidoCarrito.reduce((a, p) => a + p.cantidad, 0);
            let totalPedido = pedidoCarrito.reduce((s, p) => s + (p.cantidad * 29.90), 0);
            if (totalQtyPedido >= 2) {
                const PACKS = [
                    { size: 5, price: 86.90 },
                    { size: 4, price: 74.90 },
                    { size: 3, price: 56.90 },
                    { size: 2, price: 39.80 },
                    { size: 1, price: 19.90 }
                ];
                const dp = Array(totalQtyPedido + 1).fill(Infinity);
                dp[0] = 0;
                for (let i = 1; i <= totalQtyPedido; i++) {
                    for (const pk of PACKS) {
                        if (i - pk.size < 0) continue;
                        dp[i] = Math.min(dp[i], dp[i - pk.size] + pk.price);
                    }
                }
                totalPedido = dp[totalQtyPedido];
            }
            if (window.showCartTotalToast) window.showCartTotalToast(totalPedido);

        } catch (err) {  }
    });

    document.getElementById('pedido-volver-detalle').addEventListener('click', function() {
        mostrarPedidoStep('pedido-detalle');
    });

    document.getElementById('pedido-carrito-items').addEventListener('input', function(e) {
        if (e.target.classList.contains('carrito-cantidad-input')) {
            const idx = e.target.dataset.idx;
            pedidoCarrito[idx].cantidad = Math.max(1, parseInt(e.target.value));
            renderPedidoCarrito();
        }
    });
    document.getElementById('pedido-carrito-items').addEventListener('click', function(e) {
        if (e.target.closest('.eliminar-item-btn')) {
            const idx = e.target.closest('.eliminar-item-btn').dataset.idx;
            pedidoCarrito.splice(idx, 1);
            renderPedidoCarrito();
            return;
        }
        if (e.target.closest('.cantidad-increase')) {
            const idx = e.target.closest('.cantidad-increase').dataset.idx;
            pedidoCarrito[idx].cantidad = (pedidoCarrito[idx].cantidad || 0) + 1;
            renderPedidoCarrito();
            return;
        }
        if (e.target.closest('.cantidad-decrease')) {
            const idx = e.target.closest('.cantidad-decrease').dataset.idx;
            pedidoCarrito[idx].cantidad = Math.max(1, (pedidoCarrito[idx].cantidad || 1) - 1);
            renderPedidoCarrito();
            return;
        }
    });

    document.getElementById('pedido-ir-checkout-btn').addEventListener('click', function() {
        if (pedidoCarrito.length === 0) return;
        mostrarPedidoStep('pedido-checkout');
        renderPedidoResumenCheckout();
    });

    document.getElementById('pedido-volver-carrito').addEventListener('click', function() {
        mostrarPedidoStep('pedido-carrito');
        renderPedidoCarrito();
    });

    function renderPedidoResumenCheckout() {
        const resumen = document.getElementById('pedido-checkout-resumen');
        if (pedidoCarrito.length === 0) {
            resumen.innerHTML = '<p>No hay productos en el carrito.</p>';
            return;
        }
        let html = '<h3>Resumen de compra</h3>';
        let total = 0;
        pedidoCarrito.forEach(item => {
            html += `<div>${item.cantidad} × Camiseta Barcelona 25-26 (Talla: ${item.talla}) = ${(item.cantidad * 29.90).toFixed(2)}€</div>`;
            total += item.cantidad * 29.90;
        });
        html += `<div style="margin-top:1em;font-weight:bold;">Total: ${total.toFixed(2)}€</div>`;
        resumen.innerHTML = html;
    }

    document.getElementById('pedido-checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();

        pedidoCarrito = [];
        mostrarPedidoStep('pedido-confirmacion');
    });

    document.getElementById('pedido-volver-inicio').addEventListener('click', function() {
        mostrarPedidoStep('pedido-catalogo');
    });

    mostrarPedidoStep('pedido-catalogo');
});

document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.pedido-mini-card').forEach(card => {
        const imagesData = card.dataset.images;
        let imgs = [];
        try { imgs = imagesData ? JSON.parse(imagesData) : []; } catch(e) { imgs = []; }
        if (!imgs || !imgs.length) return;
        let idx = 0;
        const imgEl = card.querySelector('img.pedido-carrusel-img');
        function setImg(i){
            idx = (i + imgs.length) % imgs.length;
            if (imgEl) imgEl.src = imgs[idx];
        }

        setImg(0);
    });

    function mostrarDetallePedido(images){
        document.getElementById('pedido-catalogo-mini').style.display = 'none';
        document.getElementById('pedido-detalle-page').style.display = '';

        if (images && images.length) {
            document.getElementById('pedido-detalle-img').src = images[0];

            document.querySelectorAll('#pedido-detalle-page .thumb-img').forEach((img, i) => {
                img.classList.toggle('active', i === 0);
                if (images[i]) img.dataset.img = images[i];
            });
        }
    }

    document.querySelectorAll('.pedido-mini-card').forEach(card => {
        card.addEventListener('click', function(e) {

            if (e.target.closest('#pedido-ver-detalle-btn')) return;
            const imagesData = card.dataset.images;
            let imgs = [];
            try { imgs = imagesData ? JSON.parse(imagesData) : []; } catch(err){ imgs = []; }
            mostrarDetallePedido(imgs);
        });
    });
    document.getElementById('pedido-ver-detalle-btn').addEventListener('click', function(e) {
        e.stopPropagation();

        const visibleCard = document.querySelector('.pedido-mini-card');
        const imagesData = visibleCard ? visibleCard.dataset.images : null;
        let imgs = [];
        try { imgs = imagesData ? JSON.parse(imagesData) : []; } catch(err){ imgs = []; }
        mostrarDetallePedido(imgs);
    });

    document.getElementById('pedido-volver-catalogo').addEventListener('click', function() {
        document.getElementById('pedido-catalogo-mini').style.display = '';
        document.getElementById('pedido-detalle-page').style.display = 'none';
    });

    document.querySelectorAll('#pedido-detalle-page .thumb-img').forEach((img, idx) => {
        img.addEventListener('click', function() {
            document.getElementById('pedido-detalle-img').src = this.dataset.img;
            document.querySelectorAll('#pedido-detalle-page .thumb-img').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('pedido-comprar-btn').addEventListener('click', function() {
        alert('¡Producto añadido al carrito! (Aquí puedes implementar el flujo de compra completo)');
    });
});

(function() {
    let carrito = [];

    function renderCarrito() {
        const lista = document.getElementById('carrito-lista-productos');
        const vacio = document.getElementById('carrito-lista-vacia');
        const totalDiv = document.getElementById('carrito-total');
        const btnComprar = document.getElementById('carrito-comprar-btn');
        if (!lista || !vacio || !totalDiv || !btnComprar) return;
        lista.innerHTML = '';
        if (carrito.length === 0) {
            vacio.style.display = '';
            totalDiv.textContent = '';
            btnComprar.style.display = 'none';
            return;
        }
        vacio.style.display = 'none';
        let total = 0;
        carrito.forEach((item, idx) => {
            const subtotal = item.cantidad * item.precio;
            total += subtotal;
            lista.innerHTML += `
                <div class="carrito-item" style="display:flex;align-items:center;gap:1em;margin-bottom:1em;background:rgba(20,40,80,0.7);border-radius:12px;padding:1em;">
                    <img src="${item.img}" alt="${item.nombre}" loading="lazy" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
                    <div style="flex:1;">
                        <b style="color:#fff;">${item.nombre}</b><br>
                        <span style="color:#b8c6e0;">Talla: ${item.talla}</span><br>
                        <span style="color:#b8c6e0;">Cantidad: </span>
                        <input type="number" min="1" value="${item.cantidad}" data-idx="${idx}" class="carrito-cantidad-input" style="width:50px;">
                        <button class="eliminar-item-btn" data-idx="${idx}" style="background:none;border:none;color:#e74c3c;font-size:1.2em;cursor:pointer;margin-left:0.5em;"><i class="fas fa-trash"></i></button>
                    </div>
                    <div style="color:#fff;font-weight:600;">${subtotal.toFixed(2)}€</div>
                </div>
            `;
        });
        totalDiv.textContent = `Total: ${total.toFixed(2)}€`;
        btnComprar.style.display = '';
    }

    const btnAdd = document.getElementById('pedido-comprar-btn');
    if (btnAdd) {
        btnAdd.addEventListener('click', function(e) {
            e.preventDefault();
            const talla = document.getElementById('pedido-talla-select').value;
            const cantidad = parseInt(document.getElementById('pedido-cantidad-select').value);
            const nombre = 'Camiseta Barcelona 25-26 Local';
            const precio = 29.90;
            const img = document.getElementById('pedido-detalle-img').src;

            let found = false;
            for (let item of carrito) {
                if (item.nombre === nombre && item.talla === talla) {
                    item.cantidad += cantidad;
                    found = true;
                    break;
                }
            }
            if (!found) {
                carrito.push({ nombre, talla, cantidad, precio, img });
            }

            renderCarrito();

            try {
                const totalActual = carrito.reduce((s, i) => s + i.cantidad * i.precio, 0);
                if (window.showCartTotalToast) window.showCartTotalToast(totalActual);

            } catch (e) {  }

            document.querySelectorAll('.boton-seccion').forEach(b => b.classList.remove('activo'));
            document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
            document.querySelector('[data-seccion="carrito"]').classList.add('activo');
            document.getElementById('carrito').classList.add('activa');
        });
    }

    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('carrito-cantidad-input')) {
            const idx = e.target.dataset.idx;
            carrito[idx].cantidad = Math.max(1, parseInt(e.target.value));

            renderCarrito();
        }
    });
    document.addEventListener('click', function(e) {
        if (e.target.closest('.eliminar-item-btn')) {
            const idx = e.target.closest('.eliminar-item-btn').dataset.idx;
            carrito.splice(idx, 1);

            renderCarrito();
        }
    });

    document.querySelectorAll('.boton-seccion').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.dataset.seccion === 'carrito') {
                renderCarrito();
            }
        });
    });

    const btnComprar = document.getElementById('carrito-comprar-btn');
    if (btnComprar) {
        btnComprar.addEventListener('click', function() {
            if (carrito.length === 0) return;
            alert('¡Gracias por tu compra! (Aquí puedes implementar el pago real)');
            carrito = [];

            renderCarrito();
        });
    }

    if (document.getElementById('carrito').classList.contains('activa')) {
        renderCarrito();
    }
})();

