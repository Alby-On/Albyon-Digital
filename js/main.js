// 1. CONFIGURACIÓN DEL INTERSECTION OBSERVER
    const observerOptions = {
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Activamos la observación para todos los elementos con animación
    document.querySelectorAll('.card, #contacto, .info-column').forEach(el => {
        observer.observe(el);
    });

    // 2. CONFIGURACIÓN DEL SLIDER HERO (Lógica de capas activas)
    (function() {
        const slides = document.querySelectorAll('.slide-bg');
        if (slides.length === 0) return;

        let currentSlide = 0;

        function startSlider() {
            setInterval(() => {
                // 1. Quitar clase active al slide actual
                slides[currentSlide].classList.remove('active');
                
                // 2. Calcular el índice del siguiente slide
                currentSlide = (currentSlide + 1) % slides.length;
                
                // 3. Añadir clase active al nuevo slide
                slides[currentSlide].classList.add('active');
            }, 6000); // Cambia cada 6 segundos para coincidir con la suavidad del fundido
        }

        // Iniciar el ciclo
        startSlider();
    })();
