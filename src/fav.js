//--------- REDIRECCIONES -------------
document.getElementById('favorites-button')?.addEventListener('click', () => {
    window.location.href = 'http://localhost:5500/src/fav.html';
});

document.getElementById('home-button')?.addEventListener('click', () => {
    window.location.href = 'http://localhost:5500/src/layout.html';
});


//--------- LOG OUT -----------------
document.getElementById('logoutButton')?.addEventListener('click', () => {
	window.location.href = 'http://localhost:5500/src/index.html';
});

document.getElementById('profile-img').addEventListener('click', function () {
	document.getElementById("dropdown").classList.toggle("show");
});



//---------- MOSTRAR Y QUITAR FAV -----------------
const CLIENT_ID = 'wstcP1uva1xCFUniI_FQcFzqBywFysFbiSiQiF6IkkQ';

let favoritePhotos = JSON.parse(localStorage.getItem('favoritePhotos')) || [];

function renderFavorites() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Limpia el contenido actual

    // Mostrar mensaje si no hay favoritos
    if (favoritePhotos.length === 0) {
        gallery.innerHTML = '<p>No favorites yet. Add some!</p>';
        return;
    }

    // Renderizar cada foto favorita
    favoritePhotos.forEach(photoId => {
        // Llama a la API de Unsplash para obtener detalles de la foto
        fetch(`https://api.unsplash.com/photos/${photoId}`, {
            headers: { Authorization: `Client-ID ${CLIENT_ID}` },
        })
            .then(response => response.json())
            .then(photo => {
                // Crear un contenedor para la foto
                const photoItem = document.createElement('div');
                photoItem.classList.add('photo-item');
                photoItem.innerHTML = `
                    <div class="photo-wrapper">
                        <img src="${photo.urls.small}" alt="${photo.alt_description || 'Photo'}">
                        <button class="favorite-btn liked" onclick="removeFavorite('${photo.id}')">❤</button>
                    </div>
                `;
                gallery.appendChild(photoItem);
            })
            .catch(error => console.error('Error fetching favorite photo:', error));
    });
}

// Eliminar una foto de favoritos
function removeFavorite(photoId) {
    // Elimina el ID de la lista de favoritos
    favoritePhotos = favoritePhotos.filter(id => id !== photoId);
    // Actualiza localStorage
    localStorage.setItem('favoritePhotos', JSON.stringify(favoritePhotos));
    // Re-renderiza la galería
    renderFavorites();
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();

    // Manejar el botón de home para redirigir
    document.getElementById('home-button').addEventListener('click', () => {
        window.location.href = 'http://localhost:5500/src/layout.html';
    });
});


//---------- BARRA DE BUSQUEDA ----------------
function fetchPhotos(query = '') {
    const perPage = 30;
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
            const photos = query ? data.results : data;
            renderGallery(photos);
        })
        .catch(error => console.error('Error fetching photos:', error));
}

function renderGallery(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (photos.length === 0) {
        gallery.innerHTML = '<p>No photos found.</p>';
        return;
    }

    photos.forEach(photo => {
        const isFavorite = favoritePhotos.includes(photo.id);
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

document.getElementById('search-query')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const query = event.target.value.trim();
        if (query) {
            currentSearchQuery = query;
            fetchPhotos(query);
        }
    }
});

// Función para alternar estado de favoritos
function toggleFavorite(photoId) {
    if (favoritePhotos.includes(photoId)) {
        favoritePhotos = favoritePhotos.filter(id => id !== photoId);
    } else {
        favoritePhotos.push(photoId);
    }

    localStorage.setItem('favoritePhotos', JSON.stringify(favoritePhotos));
    fetchPhotos(currentSearchQuery);
}