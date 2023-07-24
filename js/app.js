var carritoVisible = false;

if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}


function ready(){
    // FUNCIONALIDAD DE LOS BOTONES PARA ELIMINAR PRODUCTOS
    var botonEliminarProducto = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonEliminarProducto.length; i++) {
        var button = botonEliminarProducto[i];
        button.addEventListener('click', eliminarProductoCarrito);
    }

    // FUNCIONALIDAD DE LOS BOTONES PARA SUMAR CANTIDAD
    var botonSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for( var i=0; i < botonSumarCantidad.length; i++){
        var button = botonSumarCantidad[i];
        button.addEventListener('click', sumarCantidad)
    }

    // FUNCIONALIDAD DE LOS BOTONES PARA RESTAR CANTIDAD
    var botonRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for( var i=0; i < botonRestarCantidad.length; i++){
        var button = botonRestarCantidad[i];
        button.addEventListener('click', restarCantidad)
    }

    // FUNCIONALIDAD DE LOS BOTONES AGREGAR AL CARRITO
    var contenedorProductos = document.querySelector('.container-productos');
    contenedorProductos.addEventListener('click', function (event) {
    var button = event.target;
    if (button.classList.contains('boton-producto')) {
        agregarAlCarritoClicked(event);
    }
});


    // FUNCIONALIDAD DEL BOTON PAGAR
    var btnPagar = document.getElementsByClassName('btn-pagar');
    if (btnPagar.length > 0) {
        btnPagar[0].addEventListener('click', pagarClicked);
    }
    
    // RECUPERAR DATOS DEL CARRITO DEL LocalStorage
    var carritoData = localStorage.getItem('carrito');
    if (carritoData) {
        var productosCarrito = JSON.parse(carritoData);
        for (var i = 0; i < productosCarrito.length; i++) {
            var producto = productosCarrito[i];
            agregarProductoAlCarrito(producto.titulo, producto.precio, producto.imagenSrc);
        }
    }

    cargarProductosDesdeJSON();
}

function cargarProductosDesdeJSON() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
        mostrarProductosEnPagina(data.productos);
    })
        .catch(error => {
        console.error('Error al cargar los productos:', error);
    });
}

function mostrarProductosEnPagina(productos) {
    var contenedorProductos = document.querySelector('.container-productos');
    productos.forEach(producto => {
        var productoHTML = `
        <div class="producto">
            <span class="titulo-producto">${producto.titulo}</span>
            <img src="${producto.imagenSrc}" alt="" class="img-producto">
            <span class="precio-producto">$${producto.precio}</span>
            <button class="boton-producto">Agregar al carrito</button>
        </div>
    `;
    contenedorProductos.innerHTML += productoHTML;
    });
}

// FUNCION PARA ELIMINAR PRODUCTO
function eliminarProductoCarrito(event) {
    var buttonClicked = event.target;
    var producto = buttonClicked.parentElement;
    producto.remove();

    
    var tituloProductoEliminado = producto.getElementsByClassName('carrito-producto-titulo')[0].innerText;

    // OBTENER LA LISTA DE PRODUCTOS DEL CARRITO DEL LocalStorage
    var carritoData = localStorage.getItem('carrito');
    if (carritoData) {
        var productosCarrito = JSON.parse(carritoData);

        // FILTRAR LA LISTA DE PRODUCTOS
        productosCarrito = productosCarrito.filter(function (producto) {
            return producto.titulo !== tituloProductoEliminado;
        });

        // GUARDAR LA LISTA ACTUALIZADA EN EL LocalStorage
        localStorage.setItem('carrito', JSON.stringify(productosCarrito));
    }

    actualizarTotalCarrito();
}

// FUNCION PARA ACTUALIZAR EL TOTAL DEL CARRITO
function actualizarTotalCarrito(){
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoProductos = carritoContenedor.getElementsByClassName('carrito-producto');
    var total = 0;

    for(var i=0; i < carritoProductos.length; i++){
        var producto = carritoProductos[i];
        var precioElemento = producto.getElementsByClassName('carrito-producto-precio')[0];
        var precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        var cantidadProducto = producto.getElementsByClassName('carrito-producto-cantidad')[0];
        var cantidad = cantidadProducto.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total*100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

// AUMENTAR EN UNO LA CANTIDAD DEL CARRITO
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-producto-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-producto-cantidad')[0].value = cantidadActual;

    actualizarTotalCarrito();
}

// RESTAR EN UNO LA CANTIDAD DEL CARRITO
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-producto-cantidad')[0].value;
    cantidadActual--;

    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-producto-cantidad')[0].value = cantidadActual;

        actualizarTotalCarrito();
    }

}

function agregarAlCarritoClicked(event){
    var button = event.target;
    var producto = button.parentElement;
    var titulo = producto.getElementsByClassName('titulo-producto')[0].innerText;
    var precio = producto.getElementsByClassName('precio-producto')[0].innerText;
    var imagenSrc = producto.getElementsByClassName('img-producto')[0].src;

    if (!productoExisteEnCarrito(titulo)) {
        agregarProductoAlCarrito(titulo, precio, imagenSrc);
    } else {
        Swal.fire({
            icon: 'info',
            text: 'El producto ya se encuentra en el carrito.',
            timer: 2000, 
            timerProgressBar: true,
        });
    } 
}

function productoExisteEnCarrito(titulo) {
    var carritoProductos = document.getElementsByClassName('carrito-producto-titulo');
    for (var i = 0; i < carritoProductos.length; i++) {
        if (carritoProductos[i].innerText === titulo) {
        return true;
    }
    }
    return false;
}

function agregarProductoAlCarrito(titulo, precio, imagenSrc) {
    var productoCarrito = document.querySelector('.carrito-productos');
    if (productoCarrito !== null && productoCarrito !== undefined) {
        var producto = document.createElement('div');
        producto.classList.add('producto');
        var productoCarrito = document.getElementsByClassName('carrito-productos')[0];

        var nombresProductosCarrito = productoCarrito.getElementsByClassName('carrito-producto-titulo');
        for (var i = 0; i < nombresProductosCarrito.length; i++) {
            if (nombresProductosCarrito[i].innerText == titulo) {
                Swal.fire({
                    icon: 'info',
                    text: 'El producto ya se encuentra en el carrito.',
                    timer: 2000, 
                    timerProgressBar: true,
                });
                return;
            }
        }

        var precioNumerico = parseFloat(precio.replace('$', '').replace(',', ''));

        // OBTENES LA CANTIDAD DE PRODUCTO SELECCIONADA POR EL USUARIO
        var cantidadProducto = 1; // Valor predeterminado
        var cantidadInput = producto.getElementsByClassName('carrito-producto-cantidad')[0];
        if (cantidadInput !== null && cantidadInput !== undefined) {
            cantidadProducto = parseInt(cantidadInput.value);
        }

        // OBTENER EL CARRITO ACTUAL DEL LocalStorage
        var carritoData = localStorage.getItem('carrito');
        var productosCarrito = [];
        if (carritoData) {
            productosCarrito = JSON.parse(carritoData);
        }

        // VERIFICAR SI EL PRODUCTO YA EXISTE EN EL CARRITO
        var productoExistente = productosCarrito.find(function (producto) {
            return producto.titulo === titulo;
        });

        if (productoExistente) {
            productoExistente.cantidad += cantidadProducto;
        } else {
            var nuevoProducto = {
                titulo: titulo,
                precio: precio,
                imagenSrc: imagenSrc,
                cantidad: cantidadProducto
            };
            productosCarrito.push(nuevoProducto);
        }

        // GUARDAR EL CARRITO ACTUALIZADO EN EL LocalStorage
        localStorage.setItem('carrito', JSON.stringify(productosCarrito));

        actualizarTotalCarrito();

        var productoCarritoContenido = `
            <div class="carrito-producto">
                <img src="${imagenSrc}" alt="">
                <div class="carrito-producto-detalles">
                    <span class="carrito-producto-titulo">${titulo}</span>
                    <div class="selector-cantidad">
                        <i class="fa-solid fa-minus restar-cantidad"></i>
                        <input type="text" value="${cantidadProducto}" class="carrito-producto-cantidad" disabled>
                        <i class="fa-solid fa-plus sumar-cantidad"></i>
                    </div>
                    <span class="carrito-producto-precio">${precio}</span>
                </div>
                <span class="btn-eliminar">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </div>
        `;

        producto.innerHTML = productoCarritoContenido;
        productoCarrito.append(producto);

        // FUNCIONALIDAD DE ELIMINAR DEL NUEVO PRODUCTO
        producto.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarProductoCarrito);

        // FUNCIONALIDAD DE SUMAR DEL NUEVO PRODUCTO
        var botonSumarCantidad = producto.getElementsByClassName('sumar-cantidad')[0];
        botonSumarCantidad.addEventListener('click', sumarCantidad);

        // FUNCIONALIDAD DE RESTAR DEL NUEVO PRODUCTO
        var botonRestarCantidad = producto.getElementsByClassName('restar-cantidad')[0];
        botonRestarCantidad.addEventListener('click', restarCantidad);

        actualizarTotalCarrito();
    }
}



function pagarClicked(event) {
    Swal.fire({
        icon: 'success',
        text: 'Gracias por tu compra',
        timer: 2000, 
        timerProgressBar: true,
    })
    var carritoProductos = document.getElementsByClassName('carrito-productos')[0];
    while (carritoProductos.hasChildNodes()) {
        carritoProductos.removeChild(carritoProductos.firstChild);
    }
    actualizarTotalCarrito();
    localStorage.removeItem('carrito');
}


