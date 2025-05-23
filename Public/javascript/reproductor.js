

const domain_railway = "https://musicfy-musicfy.up.railway.app";

// 💡 URL del backend dinámico (localhost o producción)
const API_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000' // 🚧 Desarrollo local
    : domain_railway // ✅ Producción en Railway (cambia esto)


const appEl = document.getElementById('app');
const isLoggedIn = appEl.getAttribute('data-logged-in') === 'true';

const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const audio = new Audio();
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

let songs = [];
let likedSongs = [];

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

function loadSong(index) {
  const song = songs[index];
  audio.src = song.youtube_url;
  trackTitle.textContent = song.titulo;
  trackArtist.textContent = song.artista;
  updateActiveSong();
}

function playSong() {
  audio.play();
  playBtn.innerHTML = '&#10073;&#10073;'; // Pause icon
  playBtn.title = 'Pause';
  playBtn.setAttribute('aria-label', 'Pause');
}

function pauseSong() {
  audio.pause();
  playBtn.innerHTML = '&#9658;'; // Play icon
  playBtn.title = 'Play';
  playBtn.setAttribute('aria-label', 'Play');
}

function togglePlayPause() {
  if(audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

function updateProgress(e) {
  if(audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
    progressContainer.setAttribute('aria-valuenow', Math.round(percent));
  }
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if(duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return mins + ':' + (secs < 10 ? '0' + secs : secs);
}

function updateActiveSong() {
  const songElements = playlistEl.querySelectorAll('.song');
  songElements.forEach((el, idx) => {
    if(idx === currentSongIndex) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'true');
    } else {
      el.classList.remove('active');
      el.removeAttribute('aria-current');
    }
  });
}

function toggleLikeSong(index, button) {
  if(!isLoggedIn) {
    alert('Debes iniciar sesión para guardar canciones.');
    return;
  }
  const song = songs[index];
  const likedIndex = likedSongs.findIndex(s => s.titulo === song.titulo && s.artista === song.artista);
  if(likedIndex === -1) {
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
  if(likedSongs.length === 0) {
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
      playSong();
    });
    likedListEl.appendChild(songEl);
  });
}

function populatePlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach( (song, index) => {
    const songEl = document.createElement('div');
    songEl.classList.add('song');
    songEl.setAttribute('tabindex', '0');
    songEl.setAttribute('role', 'button');
    songEl.setAttribute('aria-pressed', 'false');
    songEl.setAttribute('aria-label', `${song.titulo} by ${song.artista}`);
    songEl.innerHTML = `
      <div class="song-title">${song.titulo}</div>
      <div class="song-artist">${song.artista}</div>
      <button class="like-btn" aria-label="Like or save song" aria-pressed="false">🤍</button>
    `;
    const likeBtn = songEl.querySelector('.like-btn');
    if(!isLoggedIn) {
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
      playSong();
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

playBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

// Keyboard accessibility for progress bar to seek time with arrows
progressContainer.addEventListener('keydown', (e) => {
  if(audio.duration) {
    const step = audio.duration * 0.05; // 5% step
    if(e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      audio.currentTime = Math.min(audio.currentTime + step, audio.duration);
    } else if(e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - step, 0);
    }
  }
});

// Initialize UI
fetchSongs();
