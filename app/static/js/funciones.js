// Carousel functionality for index page
document.addEventListener('DOMContentLoaded', function() {
    cargarCarouselDestacados();
});

function cargarCarouselDestacados() {
    const slidesContainer = document.getElementById('hero-slides');
    const dotsContainer = document.getElementById('hero-dots');

    if (!slidesContainer || !dotsContainer) return;

    fetch('/api/productos/destacados')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || 'Error cargando destacados');
            }

            const productos = data.productos || [];
            if (productos.length === 0) {
                slidesContainer.innerHTML = '<div class="carousel-empty">No hay productos destacados</div>';
                dotsContainer.innerHTML = '';
                return;
            }

            const clases = ['slide-purple', 'slide-red', 'slide-blue'];

            slidesContainer.innerHTML = `
                <div class="carousel-track">
                    ${productos.map((producto, index) => {
                        const imagen = normalizarImagen(producto.imagen);
                        const clase = clases[index % clases.length];
                        const descripcion = producto.descripcion || 'Producto destacado de Game Store.';

                        return `
                            <div class="carousel-slide ${clase} ${index === 0 ? 'active' : ''}">
                                <div class="slide-content">
                                    <h2>${producto.nombre}</h2>
                                    <p>${descripcion}</p>
                                    <button class="btn-comprar" data-product-id="${producto.id}">Comprar ahora</button>
                                </div>
                                <div class="slide-image">
                                    <img src="${imagen}" alt="${producto.nombre}">
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            dotsContainer.innerHTML = productos.map((_, index) => (
                `<span class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`
            )).join('');

            initializeCarousel();
        })
        .catch(error => {
            console.error('Error cargando destacados:', error);
            slidesContainer.innerHTML = '<div class="carousel-empty">No se pudo cargar el carrusel</div>';
            dotsContainer.innerHTML = '';
        });
}

function normalizarImagen(imagen) {
    if (!imagen) return '/static/img/placeholder.jpg';
    if (imagen.startsWith('http://') || imagen.startsWith('https://')) return imagen;
    if (imagen.startsWith('/')) return imagen;
    return `/static/img/Imagenes/${imagen}`;
}

function initializeCarousel() {
    const slidesContainer = document.getElementById('hero-slides');
    const track = slidesContainer ? slidesContainer.querySelector('.carousel-track') : null;
    const slides = track ? track.querySelectorAll('.carousel-slide') : [];
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    if (!track || slides.length === 0) return;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;

        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    if (window.carouselIntervalId) {
        clearInterval(window.carouselIntervalId);
    }

    window.carouselIntervalId = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 7000);

    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function() {
            const productoId = this.getAttribute('data-product-id');
            if (productoId && window.ProductosController) {
                window.ProductosController.agregarAlCarrito(productoId);
                return;
            }

            if (productoId && window.agregarAlCarritoGlobal) {
                window.agregarAlCarritoGlobal(productoId);
                return;
            }

            console.warn('No se pudo agregar al carrito desde el carrusel');
        });
    });

    showSlide(0);
}