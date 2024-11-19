const CLIENT_ID = 'wstcP1uva1xCFUniI_FQcFzqBywFysFbiSiQiF6IkkQ';
let currentSearchQuery = ''; // Variable global para almacenar la consulta actual
let favoritePhotos = JSON.parse(localStorage.getItem('favoritePhotos')) || []; // Obtener favoritos desde localStorage

// Función para obtener fotos de Unsplash
function fetchPhotos(query = '') {
    const perPage = 30; // Número de fotos por página
    const endpoint = query
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`
        : `https://api.unsplash.com/photos?per_page=${perPage}`;
    
    const accessToken = localStorage.getItem('accessToken');
    const headers = {
        Authorization: accessToken
            ? `Bearer ${accessToken}`
            : `Client-ID ${CLIENT_ID}`
    };

    fetch(endpoint, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching photos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const photos = query ? data.results : data; // Usar `results` solo si es búsqueda
            renderGallery(photos);
        })
        .catch(error => console.error('Error fetching photos:', error));
}

// Función para renderizar la galería de fotos
function renderGallery(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Limpiar la galería antes de renderizar nuevas fotos

    if (photos.length === 0) {
        gallery.innerHTML = '<p>No photos found.</p>';
        return;
    }

    photos.forEach(photo => {
        const isFavorite = favoritePhotos.includes(photo.id); // Verifica si es favorito
        const photoItem = document.createElement('div');
        photoItem.classList.add('photo-item');
        photoItem.innerHTML = `
            <div class="photo-wrapper">
                <img src="${photo.urls.small}" alt="${photo.alt_description || 'Photo'}">
                <button class="favorite-btn ${isFavorite ? 'liked' : ''}" 
                        onclick="toggleFavorite('${photo.id}')">
                    ❤
                </button>
            </div>
        `;
        gallery.appendChild(photoItem);
    });
}

// Función para alternar estado de favoritos
function toggleFavorite(photoId) {
    if (favoritePhotos.includes(photoId)) {
        favoritePhotos = favoritePhotos.filter(id => id !== photoId);
    } else {
        favoritePhotos.push(photoId);
    }

    localStorage.setItem('favoritePhotos', JSON.stringify(favoritePhotos));
    fetchPhotos(currentSearchQuery); // Actualizar la galería para reflejar los cambios
}

// Manejo del formulario de búsqueda
document.getElementById('search-query')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevenir comportamiento predeterminado
        const query = event.target.value.trim(); // Obtener valor del input
        if (query) {
            currentSearchQuery = query; // Guardar la búsqueda actual
            fetchPhotos(query); // Llamar a la función de búsqueda
        }
    }
});

// Redirección a favoritos
document.getElementById('favorites-button')?.addEventListener('click', () => {
    window.location.href = 'http://localhost:5500/src/fav.html';
});

// Redirección a home
document.getElementById('home-button')?.addEventListener('click', () => {
    window.location.href = 'http://localhost:5500/src/layout.html';
});

// Inicializar la galería con fotos destacadas de Unsplash
fetchPhotos();

// Manejo del botón de Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
	console.log("Logout button clicked"); // Para depuración
	window.location.href = 'http://localhost:5500/src/index.html';
});

document.getElementById('profile-img').addEventListener('click', function () {
	document.getElementById("dropdown").classList.toggle("show");
});

