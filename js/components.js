async function cargarComponente(id, archivo) {
    const contenedor = document.getElementById(id);
    
    // VALIDACIÓN: Si el ID no existe en el HTML, no intentes cargar nada
    if (!contenedor) {
        console.warn(`Ojo Jaime: El contenedor con ID "${id}" no existe en tu index.html`);
        return; 
    }

    try {
        const respuesta = await fetch(archivo);
        if (respuesta.ok) {
            const contenido = await respuesta.text();
            contenedor.innerHTML = contenido;
        } else {
            console.error(`Error 404: No se encontró el archivo ${archivo}`);
        }
    } catch (error) {
        console.error(`Error de red al cargar ${archivo}:`, error);
    }
}

// Llamada organizada
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente('header', 'components/header.html');
    cargarComponente('nosotros', 'pages/nosotros.html');
    cargarComponente('contenedor-contacto', 'pages/contacto.html');
    cargarComponente('proyectos', 'pages/proyectos.html');
    cargarComponente('planes', 'pages/planes.html');
    cargarComponente('servicios', 'pages/servicios.html');
    cargarComponente('footer', 'components/footer.html');
    cargarComponente('wsp-button', 'components/wsp-button.html');
});
