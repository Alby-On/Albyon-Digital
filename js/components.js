async function cargarComponentes() {
    const componentes = [
        { id: 'main-header', url: 'components/header.html' },
        { id: 'main-footer', url: 'components/footer.html' },
        { id: 'main-wsp-button', url: 'components/wsp-button.html' },
        { id: 'nosotros', url: 'pages/nosotros.html' },
        { id: 'contacto', url: 'pages/contacto.html' },
        { id: 'proyectos', url: 'pages/proyectos.html' },
        { id: 'porque-elegirnos', url: 'pages/porque-elegirnos.html' },
        { id: 'planes', url: 'pages/planes.html' },
        { id: 'servicios', url: 'pages/servicios.html' },
    ];

    for (const comp of componentes) {
        try {
            const response = await fetch(comp.url);
            if (response.ok) {
                const html = await response.text();
                document.getElementById(comp.id).innerHTML = html;
            }
        } catch (error) {
            console.error(`Error cargando el componente ${comp.id}:`, error);
        }
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarComponentes);
