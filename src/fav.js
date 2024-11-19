document.getElementById('favorites-button')?.addEventListener('click', () => {
    //window.location.href = 'http://localhost:5500/src/fav.html'; // Redirige a la página de favoritos
    window.location.href = '/src/fav.html'; 
});

// Redirección a home
document.getElementById('home-button')?.addEventListener('click', () => {
    //window.location.href = 'http://localhost:5500/src/layout.html'; // Redirige a layout.html
    window.location.href = '/src/layout.html'; 
});

// Inicializar la galería con fotos destacadas de Unsplash
fetchPhotos();

// Manejo del botón de Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
	console.log("Logout button clicked"); // Para depuración
	//window.location.href = 'http://localhost:5500/src/index.html';
    window.location.href = '/src/index.html'; 
});

document.getElementById('profile-img').addEventListener('click', function () {
	document.getElementById("dropdown").classList.toggle("show");
});

// Asegúrate de usar un CLIENT_ID válido de Unsplash
const CLIENT_ID = 'wstcP1uva1xCFUniI_FQcFzqBywFysFbiSiQiF6IkkQ';

// Obtener favoritos desde localStorage
let favoritePhotos = JSON.parse(localStorage.getItem('favoritePhotos')) || [];

// Renderizar favoritos
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


