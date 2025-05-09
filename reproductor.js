
  const songs = [
    { title: "Neon Dreams", artist: "Synthwave Aeon", src: "https://cdn.pixabay.com/download/audio/2022/02/28/audio_7e9230f788.mp3?filename=retro-wave-80s-13082.mp3" },
    { title: "Electric Night", artist: "Pulse Rider", src: "https://cdn.pixabay.com/download/audio/2021/11/10/audio_89f53b8282.mp3?filename=cyberpunk-rock-12356.mp3" },
    { title: "Midnight Voyager", artist: "Echo Drift", src: "https://cdn.pixabay.com/download/audio/2022/01/11/audio_c8f105101d.mp3?filename=fighting-the-system-11188.mp3" },
    { title: "Stellar Journey", artist: "Cosmic Flux", src: "https://cdn.pixabay.com/download/audio/2022/06/03/audio_12d9247296.mp3?filename=synthwave-retro-13707.mp3" },
    { title: "Electric Pulse", artist: "Night Stalker", src: "https://cdn.pixabay.com/download/audio/2022/11/09/audio_1714149e1e.mp3?filename=retro-wave-17844.mp3" }
  ];

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

  function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist;
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

  function populatePlaylist() {
    songs.forEach( (song, index) => {
      const songEl = document.createElement('div');
      songEl.classList.add('song');
      songEl.setAttribute('tabindex', '0');
      songEl.setAttribute('role', 'button');
      songEl.setAttribute('aria-pressed', 'false');
      songEl.setAttribute('aria-label', `${song.title} by ${song.artist}`);
      songEl.innerHTML = `
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      `;
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
  populatePlaylist();
  loadSong(currentSongIndex);
