const domain_railway = "https://musicfy-musicfy.up.railway.app";

// 💡 URL del backend dinámico (localhost o producción)
const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000' // 🚧 Desarrollo local
    : domain_railway; // ✅ Producción en Railway (cambia esto)

const appEl = document.getElementById('app');
let isLoggedIn = false;

const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const videoPlayer = document.getElementById('video-player');
let currentSongIndex = 0;
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playlistEl = document.getElementById('playlist');
const likedListEl = document.getElementById('liked-list');
const artistas = document.getElementById('ARTISTAS');
 
let songs = [];
let likedSongs = [];
let isPlaying = false;
let currentEmbedUrl = '';

async function fetchSession() {
  try {
    const response = await fetch(`${API_URL}/api/session`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Error fetching session');
    }
    const data = await response.json();
    isLoggedIn = data.loggedIn;
    appEl.setAttribute('data-logged-in', isLoggedIn ? 'true' : 'false');
  } catch (error) {
    console.error(error);
    isLoggedIn = false;
    appEl.setAttribute('data-logged-in', 'false');
  }
}

async function fetchSongs() {
  try {
    const response = await fetch(`${API_URL}/api/canciones`);
    if (!response.ok) {
      throw new Error('Error fetching songs');
    }
    songs = await response.json();
    populatePlaylist();
    loadSong(currentSongIndex);
    renderLikedSongs();
  } catch (error) {
    console.error(error);
  }
}

function getYouTubeEmbedUrl(youtubeUrl) {
  // Extract video ID from YouTube URL with improved regex
  const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}?enablejsapi=1`;
  }
  return '';
}

function loadSong(index) {
  const song = songs[index];
  currentEmbedUrl = getYouTubeEmbedUrl(song.youtube_url);
  videoPlayer.src = currentEmbedUrl + '&autoplay=1';
  trackTitle.textContent = song.titulo;
  trackArtist.textContent = song.artista;
  updateActiveSong();
  isPlaying = true;
  playBtn.innerHTML = '&#10073;&#10073;'; // Pause icon
  playBtn.title = 'Pause';
  playBtn.setAttribute('aria-label', 'Pause');
}

//Barra de naveagcion-----------------------------------

// Botón de guardar música
document.getElementById("Guardar").addEventListener("click", function () {
  const artistas = document.getElementById("ARTISTAS");
  const guardarDiv = document.getElementById("contenido");
  const musicaDiv = document.getElementById("MUSICAS");

  // Mostrar u ocultar "contenido"
  if (guardarDiv.style.display === "none" || guardarDiv.style.display === "") {
    guardarDiv.style.display = "block";
    artistas.style.display = "none";
    musicaDiv.style.display = "none"; // Oculta la otra
  } else {
    artistas.style.display = "none";
    guardarDiv.style.display = "none";
  }
});

// Botón de ver toda la música
document.getElementById("MUSICA").addEventListener("click", function () {
  const artistas = document.getElementById("ARTISTAS");
  const guardarDiv = document.getElementById("contenido");
  const musicaDiv = document.getElementById("MUSICAS");

  // Mostrar u ocultar "MUSICAS"
  if (musicaDiv.style.display === "none" || musicaDiv.style.display === "") {
    musicaDiv.style.display = "block";
    artistas.style.display = "none";
    guardarDiv.style.display = "none"; // Oculta la otra
  } else {  
    artistas.style.display = "none";
    musicaDiv.style.display = "none";
  }
});

// Botón de ver artistas
  document.getElementById("Artistas").addEventListener("click", function() {
    const artistas = document.getElementById("ARTISTAS");
    const guardarDiv = document.getElementById("contenido");
    const musicaDiv = document.getElementById("MUSICAS");

    if(artistas.style.display === "none" || artistas.style.display === "") {
    artistas.style.display="block";
    musicaDiv.style.display = "none";
    guardarDiv.style.display = "none"; // Oculta la otra
    }else{
      musicaDiv.style.display = "none";
      guardarDiv.style.display = "none"; // Oculta la otra
        
    }
    

  });

// FIN barra de naveagcion-----------------------------------



function playSong() {
  // Play video by setting src with autoplay
  if (currentEmbedUrl) {
    videoPlayer.src = currentEmbedUrl + '&autoplay=1';
    isPlaying = true;
    playBtn.innerHTML = '&#10073;&#10073;'; // Pause icon
    playBtn.title = 'Pause';
    playBtn.setAttribute('aria-label', 'Pause');
  }
}


function pauseSong() {
  // Pause video by setting src without autoplay
  if (currentEmbedUrl) {
    videoPlayer.src = currentEmbedUrl;
  }
  isPlaying = false;
  playBtn.innerHTML = '&#9658;'; // Play icon
  playBtn.title = 'Play';
  playBtn.setAttribute('aria-label', 'Play');
}

function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
}

function updateActiveSong() {
  const songElements = playlistEl.querySelectorAll('.song');
  songElements.forEach((el, idx) => {
    if (idx === currentSongIndex) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'true');
    } else {
      el.classList.remove('active');
      el.removeAttribute('aria-current');
    }
  });
}

function toggleLikeSong(index, button) {
  if (!isLoggedIn) {
    alert('Debes iniciar sesión para guardar canciones.');
    return;
  }
  const song = songs[index];
  const likedIndex = likedSongs.findIndex(s => s.titulo === song.titulo && s.artista === song.artista);
  if (likedIndex === -1) {
    likedSongs.push(song);
    button.textContent = '💖';
    button.setAttribute('aria-pressed', 'true');
  } else {
    likedSongs.splice(likedIndex, 1);
    button.textContent = '🤍';
    button.setAttribute('aria-pressed', 'false');
  }
  renderLikedSongs();
}

function renderLikedSongs() {
  likedListEl.innerHTML = '';
  if (likedSongs.length === 0) {
    likedListEl.innerHTML = '<p>No tienes canciones guardadas.</p>';
    return;
  }
  likedSongs.forEach((song, index) => {
    const songEl = document.createElement('div');
    songEl.classList.add('song');
    songEl.innerHTML = `
      <div class="song-title">${song.titulo}</div>
      <div class="song-artist">${song.artista}</div>
    `;
    songEl.addEventListener('click', () => {
      currentSongIndex = songs.findIndex(s => s.titulo === song.titulo && s.artista === song.artista);
      loadSong(currentSongIndex);
    });
    likedListEl.appendChild(songEl);
  });
}

function obtenerIdYoutube(url) {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function populatePlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const songEl = document.createElement('div');
    songEl.classList.add('song');
    songEl.setAttribute('tabindex', '0');
    songEl.setAttribute('role', 'button');
    songEl.setAttribute('aria-pressed', 'false');
    songEl.setAttribute('aria-label', `${song.titulo} by ${song.artista}`);
   
    const id = obtenerIdYoutube(song.youtube_url);
    const thumbnailUrl = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';

    
    songEl.innerHTML = `
  <img src="${thumbnailUrl}" alt="Miniatura de ${song.titulo}" class="thumbnail" />
  <div class="song-info">
    <div class="song-title">${song.titulo}</div>
    <div class="song-artist">${song.artista}</div>
  </div>
  <button class="like-btn" aria-label="Like or save song" aria-pressed="false">🤍</button>
  `;
    const likeBtn = songEl.querySelector('.like-btn');
    if (!isLoggedIn) {
      likeBtn.disabled = true;
      likeBtn.title = 'Debes iniciar sesión para guardar canciones';
      likeBtn.style.cursor = 'not-allowed';
    }
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLikeSong(index, likeBtn);
    });
    songEl.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
    });
    songEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        songEl.click();
      }
    });
    playlistEl.appendChild(songEl);
  });
}


// Función para mostrar artistas únicos
function artis() {
  const artistas = document.getElementById('ARTISTAS');
  artistas.innerHTML = '';

  // Obtener una lista única de artistas
  const artistasUnicos = [...new Set(songs.map(song => song.artista))];

  artistasUnicos.forEach((artista) => {
    const songAr = document.createElement('div');
    songAr.classList.add('song-artista'); // Clase directa para aplicar grid
    songAr.setAttribute('tabindex', '0');
    songAr.setAttribute('role', 'button');
    songAr.setAttribute('aria-pressed', 'false');
    songAr.setAttribute('aria-label', `Artista: ${artista}`);

    // Buscar una canción de ese artista
    const algunaCancion = songs.find(song => song.artista === artista);
    const id = algunaCancion ? obtenerIdYoutube(algunaCancion.youtube_url) : null;
    const thumbnailUrl = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
    const titulo = algunaCancion ? algunaCancion.titulo : '';

    songAr.innerHTML = `
      ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="Miniatura de ${titulo}" class="thumbnail" />` : ''}
      <div class="song-artista">${artista}</div>
    `;

    artistas.appendChild(songAr);
  });
}




playBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

document.getElementById('url').addEventListener('click', async () => {
  const url = document.getElementById('guaurl').value.trim();

  if (!url) {
    alert('Por favor, ingresa una URL de YouTube.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/youtube-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      let errorMsg = 'No se pudo obtener la información';
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (jsonError) {
        console.warn('La respuesta no fue un JSON válido.');
      }
      alert('Error: ' + errorMsg);
      return;
    }

    const data = await response.json();

    songs.push({
      titulo: data.nombre,
      artista: data.artista,
      youtube_url: data.youtube_url
    });

    populatePlaylist();
    alert('Cancion o video guardado correctamente.');

  } catch (error) {
    console.error('Error al obtener información de YouTube:', error);
    alert('Error al obtener información de YouTube.');
  }
});

// Initialize UI
(async () => {
  await fetchSession();
  await fetchSongs();
  artis();  
})();
