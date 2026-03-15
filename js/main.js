// 1. CONFIGURACIÓN DEL INTERSECTION OBSERVER
const observerOptions = {
    threshold: 0.1 
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Una vez visible, dejamos de observar para ahorrar recursos
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// MEJORA: Función para refrescar los elementos observados
// La llamaremos cada vez que inyectemos un HTML dinámico
function refrescarObservadores() {
    const elementosParaAnimar = document.querySelectorAll('.card, #contacto, .info-column, section, #form-contacto');
    elementosParaAnimar.forEach(el => {
        observer.observe(el);
    });
}

// 2. CONFIGURACIÓN DEL SLIDER HERO (Encapsulado para evitar colisiones)
(function() {
    const slides = document.querySelectorAll('.slide-bg');
    if (slides.length === 0) return;

    let currentSlide = 0;
    function startSlider() {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6000);
    }
    startSlider();
})();

// Escuchar un evento personalizado que lanzaremos desde components.js
window.addEventListener('componenteCargado', () => {
    refrescarObservadores();
});
