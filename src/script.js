const CLIENT_ID = 'wstcP1uva1xCFUniI_FQcFzqBywFysFbiSiQiF6IkkQ';
let currentSearchQuery = ''; // Variable global para almacenar la consulta actual
let favoritePhotos = JSON.parse(localStorage.getItem('favoritePhotos')) || []; // Obtener favoritos desde localStorage

// Mostrar fotos de Unsplash
function fetchPhotos(query = '') {
    const perPage = 30; // Definir cuántas fotos quieres obtener
    const endpoint = query
        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`
        : `https://api.unsplash.com/photos?per_page=${perPage}`; // Asegúrate de incluir `per_page` también para obtener 30 fotos por defecto
    
    const accessToken = localStorage.getItem('accessToken');
    const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : { Authorization: `Client-ID ${CLIENT_ID}` };

    fetch(endpoint, { headers })
        .then(response => response.json())
        .then(data => {
            const photos = query ? data.results : data; // Si es búsqueda, usar `results`
            renderGallery(photos);
        })
        .catch(error => console.error('Error fetching photos:', error));
}


// Renderizar la galería de fotos
function renderGallery(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Limpia la galería antes de mostrar nuevas fotos

    if (photos.length === 0) {
        gallery.innerHTML = '<p>No photos found.</p>';
        return;
    }

    photos.forEach(photo => {
        const isFavorite = favoritePhotos.includes(photo.id); // Verifica si está en favoritos
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

// Alternar estado de favoritos
function toggleFavorite(photoId) {
    if (favoritePhotos.includes(photoId)) {
        favoritePhotos = favoritePhotos.filter(id => id !== photoId);
    } else {
        favoritePhotos.push(photoId);
    }

    localStorage.setItem('favoritePhotos', JSON.stringify(favoritePhotos));
    fetchPhotos(currentSearchQuery);
}

// Manejo del formulario de búsqueda
document.getElementById('search-query').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el comportamiento predeterminado del Enter
        const query = event.target.value.trim(); // Obtiene el valor del input
        if (query) {
            currentSearchQuery = query; // Guardar la búsqueda actual
            fetchPhotos(query); // Llama a la función de búsqueda
        }
    }
});

document.getElementById('favorites-button').addEventListener('click', function () {
    window.location.href = 'http://localhost:5500/src/fav.html'; // Redirige a la página de favoritos
});

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'http://localhost:5500/src/layout.html';  // Redirige a layout.html
});

// Inicializa la galería con fotos destacadas de Unsplash
fetchPhotos();
