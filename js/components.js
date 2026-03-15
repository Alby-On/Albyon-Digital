/**
 * Albyon Digital - Cargador de Componentes Resiliente
 * Jaime, con este ajuste los errores en un componente no detendrán a los demás.
 */
async function cargarComponente(id, archivo) {
    const contenedor = document.getElementById(id);
    
    if (!contenedor) {
        console.warn(`[Albyon] Ojo: El contenedor con ID "${id}" no existe en el index.`);
        return; 
    }

    try {
        const respuesta = await fetch(archivo);
        
        if (!respuesta.ok) {
            // Lanzamos error para que lo atrape el 'catch' local de esta función
            throw new Error(`Status ${respuesta.status}: ${respuesta.statusText}`);
        }

        const contenido = await respuesta.text();
        contenedor.innerHTML = contenido;
        
        // Log de éxito para trackeo en consola
        console.log(`[Albyon] ✓ Cargado con éxito: ${id} (${archivo})`);

    } catch (error) {
        // Aquí es donde evitamos que el error "rompa" el resto del sitio
        console.error(`[Albyon] ✘ Falló la carga de [${archivo}] para el contenedor [#${id}]:`, error.message);
        
        // Opcional: Mostrar un mensaje visual en el lugar donde iba el componente
        contenedor.innerHTML = `<p style="color: grey; font-size: 12px; padding: 20px;">Componente ${id} no disponible momentáneamente.</p>`;
    }
}

// Llamada organizada - Ejecución en paralelo
document.addEventListener("DOMContentLoaded", () => {
    // Al no usar 'await' aquí, todas las peticiones salen al mismo tiempo.
    // Si 'nosotros' tarda o falla, 'contacto' cargará apenas reciba su respuesta.
    
    cargarComponente('header', 'components/header.html');
    cargarComponente('nosotros', 'pages/nosotros.html');
    cargarComponente('contenedor-contacto', 'pages/contacto.html'); // Tu nuevo ID corregido
    cargarComponente('proyectos', 'pages/proyectos.html');
    cargarComponente('planes', 'pages/planes.html');
    cargarComponente('servicios', 'pages/servicios.html');
    cargarComponente('footer', 'components/footer.html');
    cargarComponente('wsp-button', 'components/wsp-button.html');
});
