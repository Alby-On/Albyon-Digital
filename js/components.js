/**
 * Albyon Digital - Cargador de Componentes Resiliente (V2)
 * Jaime: Ahora emite un evento cada vez que inyecta HTML para que el Observer lo detecte.
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
            throw new Error(`Status ${respuesta.status}: ${respuesta.statusText}`);
        }

        const contenido = await respuesta.text();
        contenedor.innerHTML = contenido;
        
        // --- LA CLAVE DEL ÉXITO ---
        // Lanzamos un evento personalizado para avisar al Observer en main.js
        window.dispatchEvent(new CustomEvent('componenteCargado', { 
            detail: { id: id, archivo: archivo } 
        }));
        
        console.log(`[Albyon] ✓ Cargado con éxito: ${id} (${archivo})`);

    } catch (error) {
        console.error(`[Albyon] ✘ Falló la carga de [${archivo}] para el contenedor [#${id}]:`, error.message);
        
        // Mensaje de respaldo amigable para el usuario
        contenedor.innerHTML = `<p style="color: #64748b; font-size: 0.8rem; padding: 20px; text-align: center;">Módulo ${id} en mantenimiento.</p>`;
    }
}

// Llamada organizada - Ejecución en paralelo
document.addEventListener("DOMContentLoaded", () => {
    // Definimos los componentes en un array para facilitar el mantenimiento futuro
    const componentes = [
        { id: 'header', path: 'components/header.html' },
        { id: 'contenedor-hero', path: 'components/hero.html' },
        { id: 'contenedor-servicios', path: 'pages/servicios.html' },
        { id: 'contenedor-porque-elegirnos', path: 'pages/porque-elegirnos.html' },
        { id: 'contenedor-proyectos', path: 'pages/proyectos.html' },
        { id: 'contenedor-contacto', path: 'pages/contacto.html' },
        { id: 'contenedor-planes', path: 'pages/planes.html' },
        { id: 'footer', path: 'components/footer.html' },
        { id: 'wsp-button', path: 'components/wsp-button.html' }
    ];

    // Ejecutamos todas las cargas simultáneamente
    componentes.forEach(comp => cargarComponente(comp.id, comp.path));
});
