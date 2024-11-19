const CLIENT_ID = 'wstcP1uva1xCFUniI_FQcFzqBywFysFbiSiQiF6IkkQ';
const CLIENT_SECRET = 'GEatidYddFc6SE4Rnv5_3lwIcYnb2MajmeuK_RrQvjY';
const REDIRECT_URI = 'http://localhost:5500/src/layout.html';
const AUTH_URL = `https://unsplash.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=public`;

// Botón de inicio de sesión
document.getElementById('login-btn').addEventListener('click', () => {
    console.log(AUTH_URL);
    window.location.href = AUTH_URL;
});

// Obtener el código de autorización
const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get('code');

if (authCode) {
    fetch('https://unsplash.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: authCode,
            grant_type: 'authorization_code',
        }),
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            alert('Login successful!');
            window.location.href = 'http://localhost:5500/src/layout.html';
        } else {
			alert('Error: No access token received');
			console.error('No access token received:', data);
		}
    })
    .catch(error => console.error('Error during authentication:', error));
}

