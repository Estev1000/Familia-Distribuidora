// Variables para almacenar datos
let clientes = [];
let productos = [];
let pedidos = [];
let preventistaActual = ''; // Nombre del preventista que está usando la app

// Referencias a elementos del DOM
const formCliente = document.getElementById('form-cliente');
const listaClientes = document.getElementById('lista-clientes');
const clientePedido = document.getElementById('cliente-pedido');
const exportarJSON = document.getElementById('exportar-json');
const importarJSON = document.getElementById('importar-json');
const exportarExcel = document.getElementById('exportar-excel');
const imprimirPedidos = document.getElementById('imprimir-pedidos');

const formProducto = document.getElementById('form-producto');
const listaProductos = document.getElementById('lista-productos');
const productoPedido = document.getElementById('producto-pedido');

const formPedido = document.getElementById('form-pedido');
const listaPedidos = document.getElementById('lista-pedidos');

// Referencias para el preventista
const nombrePreventista = document.getElementById('nombre-preventista');
const guardarPreventistaBtn = document.getElementById('guardar-preventista');
const preventistaConectado = document.getElementById('preventista-conectado');

// Botón borrar todo
const botonBorrarTodo = document.getElementById('borrar-todo');

// Claves de almacenamiento
const STORAGE_KEYS = {
    clientes: 'familia_clientes',
    productos: 'familia_productos',
    pedidos: 'familia_pedidos',
    preventista: 'familia_preventista_actual',
};

// Persistencia
function saveAll() {
    try {
        localStorage.setItem(STORAGE_KEYS.clientes, JSON.stringify(clientes));
        localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(productos));
        localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(pedidos));
        localStorage.setItem(STORAGE_KEYS.preventista, preventistaActual);
    } catch (e) {
        console.error('Error guardando en localStorage', e);
    }
}

function loadAll() {
    try {
        const c = JSON.parse(localStorage.getItem(STORAGE_KEYS.clientes) || '[]');
        const p = JSON.parse(localStorage.getItem(STORAGE_KEYS.productos) || '[]');
        const o = JSON.parse(localStorage.getItem(STORAGE_KEYS.pedidos) || '[]');
        const prev = localStorage.getItem(STORAGE_KEYS.preventista) || '';
        if (Array.isArray(c)) clientes = c;
        if (Array.isArray(p)) productos = p;
        if (Array.isArray(o)) pedidos = o;
        preventistaActual = prev;
    } catch (e) {
        console.warn('No se pudo cargar desde localStorage, usando valores por defecto');
    }
    actualizarPreventista();
    renderAll();
}

// Renderizado
function renderClientes() {
    // Lista
    listaClientes.innerHTML = '';
    clientes.forEach(({ nombre, direccion }) => {
        const li = document.createElement('li');
        li.dataset.nombre = nombre;
        li.innerHTML = `${nombre} - ${direccion} <button onclick="eliminarCliente('${nombre}')">Eliminar</button>`;
        listaClientes.appendChild(li);
    });
    // Select pedidos
    clientePedido.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Seleccionar Cliente';
    clientePedido.appendChild(opt);
    clientes.forEach(({ nombre }) => {
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = nombre;
        clientePedido.appendChild(option);
    });
}

function renderProductos() {
    // Lista
    listaProductos.innerHTML = '';
    productos.forEach(({ nombre, precio }) => {
        const li = document.createElement('li');
        li.dataset.nombre = nombre;
        li.innerHTML = `${nombre} - $${precio} <button onclick="eliminarProducto('${nombre}')">Eliminar</button>`;
        listaProductos.appendChild(li);
    });
    // Select pedidos
    productoPedido.innerHTML = '';
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Seleccionar Producto';
    productoPedido.appendChild(opt);
    productos.forEach(({ nombre }) => {
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = nombre;
        productoPedido.appendChild(option);
    });
}

function renderPedidos() {
    listaPedidos.innerHTML = '';
    pedidos.forEach((pedido, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        const preventista = pedido.preventista ? ` <span class="preventista-badge">[${pedido.preventista}]</span>` : '';
        li.innerHTML = `Cliente: ${pedido.cliente}, Producto: ${pedido.producto}, Cantidad: ${pedido.cantidad}${preventista} <button onclick="eliminarPedido(${index})">Eliminar</button>`;
        listaPedidos.appendChild(li);
    });
}

function renderAll() {
    renderClientes();
    renderProductos();
    renderPedidos();
}

// Función para agregar cliente
formCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-cliente').value;
    const direccion = document.getElementById('direccion-cliente').value;

    const cliente = { nombre, direccion };
    clientes.push(cliente);
    saveAll();
    renderClientes();
    formCliente.reset();
});

// Función para agregar producto
formProducto.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-producto').value;
    const precio = document.getElementById('precio-producto').value;

    const producto = { nombre, precio };
    productos.push(producto);
    saveAll();
    renderProductos();
    formProducto.reset();
});

// Función para registrar pedido
formPedido.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!preventistaActual) {
        alert('⚠️ Primero debes registrarte como preventista');
        return;
    }
    
    const cliente = clientePedido.value;
    const producto = productoPedido.value;
    const cantidad = document.getElementById('cantidad-pedido').value;

    const pedido = { 
        cliente, 
        producto, 
        cantidad,
        preventista: preventistaActual
    };
    pedidos.push(pedido);
    saveAll();
    renderPedidos();
    formPedido.reset();
});

// Función para eliminar cliente
function eliminarCliente(nombre) {
    const index = clientes.findIndex(cliente => cliente.nombre === nombre);
    if (index !== -1) {
        clientes.splice(index, 1);
        saveAll();
        renderClientes();
    }
}

// Función para eliminar producto
function eliminarProducto(nombre) {
    const index = productos.findIndex(producto => producto.nombre === nombre);
    if (index !== -1) {
        productos.splice(index, 1);
        saveAll();
        renderProductos();
    }
}

// Función para eliminar pedido
function eliminarPedido(index) {
    pedidos.splice(index, 1);
    saveAll();
    renderPedidos();
}

// Función para imprimir la lista de pedidos

imprimirPedidos.addEventListener('click', () => {
    let contenido = 'Lista de Pedidos:\n';
    pedidos.forEach((pedido, index) => {
        contenido += `${index + 1}. Cliente: ${pedido.cliente}, Producto: ${pedido.producto}, Cantidad: ${pedido.cantidad}\n`;
    });

    const ventanaImpresion = window.open('', '', 'width=600,height=400');
    ventanaImpresion.document.write('<pre>' + contenido + '</pre>');
    ventanaImpresion.document.close();
    ventanaImpresion.print();
});

// Referencias a los botones del pie de página
const botonExportarJSON = document.getElementById('exportar-json');
const botonImportarJSON = document.getElementById('importar-json');
const botonExportarExcel = document.getElementById('exportar-excel');
const botonImprimirPedidos = imprimirPedidos;

// Función para exportar pedidos a JSON
botonExportarJSON.addEventListener('click', () => {
    const dataStr = JSON.stringify(pedidos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Función para importar múltiples archivos JSON
botonImportarJSON.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.multiple = true; // Permitir múltiples archivos
    input.addEventListener('change', (event) => {
        const files = event.target.files;
        let archivosProcessados = 0;
        let totalImportados = 0;
        
        if (files.length === 0) return;
        
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    const pedidosArray = Array.isArray(importedData) ? importedData : [];
                    
                    // Extraer nombre del preventista del nombre del archivo (ej: "preventista_Juan.json" -> "Juan")
                    let nombrePreventista = file.name
                        .replace(/\.json$/i, '')
                        .replace(/^preventista_/i, '')
                        .replace(/_/g, ' ');
                    
                    // Agregar el campo preventista a cada pedido si no lo tiene
                    pedidosArray.forEach((pedido) => {
                        if (!pedido.preventista) {
                            pedido.preventista = nombrePreventista;
                        }
                    });
                    
                    // Unificar los pedidos importados con los existentes
                    pedidos = [...pedidos, ...pedidosArray];
                    totalImportados += pedidosArray.length;
                    
                } catch (error) {
                    alert(`Error al procesar ${file.name}: ${error.message}`);
                }
                
                archivosProcessados++;
                
                // Si es el último archivo, guardar y renderizar
                if (archivosProcessados === files.length) {
                    saveAll();
                    renderPedidos();
                    if (totalImportados > 0) {
                        alert(`✓ Se importaron exitosamente ${totalImportados} pedidos de ${files.length} archivo(s)`);
                    }
                }
            };
            reader.readAsText(file);
        });
    });
    input.click();
});

// Función para exportar pedidos a Excel (CSV)
botonExportarExcel.addEventListener('click', () => {
    let csvContent = 'data:text/csv;charset=utf-8,Cliente,Producto,Cantidad\n';
    pedidos.forEach((pedido) => {
        csvContent += `${pedido.cliente},${pedido.producto},${pedido.cantidad}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'pedidos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Función para imprimir pedidos

// Menú hamburguesa para móviles
document.addEventListener('DOMContentLoaded', function() {
    const menuHamburguesa = document.getElementById('menu-hamburguesa');
    const menu = document.getElementById('menu');
    const html = document.documentElement;

    if (menuHamburguesa && menu) {
        // Mostrar/ocultar menú al hacer clic en el botón hamburguesa
        menuHamburguesa.addEventListener('click', function(event) {
            event.stopPropagation();
            menu.classList.toggle('active');
            menuHamburguesa.classList.toggle('active');
            html.classList.toggle('menu-open');
        });

        // Cerrar menú al hacer clic en un enlace
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuHamburguesa.classList.remove('active');
                html.classList.remove('menu-open');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(event) {
            if (!menu.contains(event.target) && !menuHamburguesa.contains(event.target)) {
                menu.classList.remove('active');
                menuHamburguesa.classList.remove('active');
                html.classList.remove('menu-open');
            }
        });
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            });
        });
    }
});

// Borrar todo
if (botonBorrarTodo) {
    botonBorrarTodo.addEventListener('click', () => {
        const ok = window.confirm('¿Seguro que deseas borrar todos los datos (clientes, productos y pedidos)?');
        if (!ok) return;
        clientes = [];
        productos = [];
        pedidos = [];
        saveAll();
        renderAll();
    });
}

// Función para actualizar la UI del preventista
function actualizarPreventista() {
    if (preventistaActual) {
        nombrePreventista.value = '';
        nombrePreventista.style.display = 'none';
        guardarPreventistaBtn.style.display = 'none';
        preventistaConectado.innerHTML = `✓ Registrado como: <strong>${preventistaActual}</strong>`;
        preventistaConectado.style.display = 'inline-block';
    } else {
        nombrePreventista.style.display = 'inline-block';
        guardarPreventistaBtn.style.display = 'inline-block';
        preventistaConectado.innerHTML = '';
        preventistaConectado.style.display = 'none';
    }
}

// Función para registrar el preventista
guardarPreventistaBtn.addEventListener('click', () => {
    const nombre = nombrePreventista.value.trim();
    if (!nombre) {
        alert('⚠️ Ingresa tu nombre');
        return;
    }
    preventistaActual = nombre;
    saveAll();
    actualizarPreventista();
    alert(`✓ ¡Bienvenido ${nombre}! Ahora tus pedidos estarán identificados contigo.`);
});

// Permitir Enter en el input del preventista
nombrePreventista.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        guardarPreventistaBtn.click();
    }
});

// Cargar estado inicial desde localStorage
loadAll();
