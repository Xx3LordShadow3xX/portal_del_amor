/* ========================================
   MUSIC PLAYER MODULE
   Handles playlist, playback, shuffle/sequence modes
   ======================================== */

// Music Player State
const MusicPlayer = {
  // DOM Elements (will be set in main.js)
  playBtn: null,
  prevBtn: null,
  nextBtn: null,
  rewindBtn: null,
  forwardBtn: null,
  shuffleBtn: null,
  sequenceBtn: null,
  bgMusic: null,
  songTitle: null,
  
  // State
  musicPlaying: false,
  currentSongIndex: 0,
  isShuffleMode: false,
  playedSongs: [],
  
  // Playlist
  playlist: [
    { title: "A Donde Vamos - Morat", src: "songs/A_Donde_Vamos_-_Morat.mp3" },
    { title: "Niña Bonita - Dstance", src: "songs/Niña_Bonita_-_Dstance.mp3" },
    { title: "Bésame Sin Sentir - Micro TDH", src: "songs/Besame_sin_sentir_-_MicroTDH.mp3" },
    { title: "De Cero - Morat", src: "songs/De_Cero_-_Morat.mp3" },
    { title: "El Embrujo - Morat", src: "songs/El_Embrujo_-_Morat.mp3" },
    { title: "La Mitad - Camilo", src: "songs/La_Mitad_-_Camilo.mp3" },
    { title: "Me Rehúso - Danny Ocean", src: "songs/Me_Rehuso_-_Danny_Ocean.mp3" },
    { title: "Medialuna - Camilo", src: "songs/Medialuna_-_Camilo.mp3" },
    { title: "Mi Bendición - Juan Luis Guerra", src: "songs/Mi_Bendicion_-_Juan_Luis_Guerra.mp3" },
    { title: "Mi Cuarto - Tiago PZK", src: "songs/Mi_Cuarto_-_TiagoPZK.mp3" },
    { title: "Mi Suerte - Morat", src: "songs/Mi_Suerte_-_Morat.mp3" },
    { title: "Mi Vida Entera - Morat", src: "songs/Mi_vida_entera_-_Morat.mp3" },
    { title: "Por Primera Vez - Camilo", src: "songs/Por_Primera_Vez_-_Camilo.mp3" },
    { title: "Primeras Veces - Morat", src: "songs/Primeras_Veces_-_Morat.mp3" },
    { title: "Si Estoy Contigo - Camilo", src: "songs/Si_estoy_contigo_-_Camilo.mp3" }
  ],
  
  // Initialize music player
  init: function(elements) {
    this.playBtn = elements.playBtn;
    this.prevBtn = elements.prevBtn;
    this.nextBtn = elements.nextBtn;
    this.rewindBtn = elements.rewindBtn;
    this.forwardBtn = elements.forwardBtn;
    this.shuffleBtn = elements.shuffleBtn;
    this.sequenceBtn = elements.sequenceBtn;
    this.bgMusic = elements.bgMusic;
    this.songTitle = elements.songTitle;
    
    this.updateSongTitle();
    this.attachEventListeners();
  },
  
  // Update song title display
  updateSongTitle: function() {
    this.songTitle.textContent = this.playlist[this.currentSongIndex].title;
  },
  
  // Get next song based on mode
  getNextSong: function() {
    if (this.isShuffleMode) {
      if (this.playedSongs.length >= this.playlist.length) {
        this.playedSongs = [];
      }
      
      let availableSongs = [];
      for (let i = 0; i < this.playlist.length; i++) {
        if (!this.playedSongs.includes(i)) {
          availableSongs.push(i);
        }
      }
      
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      this.currentSongIndex = availableSongs[randomIndex];
      this.playedSongs.push(this.currentSongIndex);
    } else {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    }
  },
  
  // Get previous song based on mode
  getPreviousSong: function() {
    if (this.isShuffleMode) {
      if (this.playedSongs.length > 1) {
        this.playedSongs.pop();
        this.currentSongIndex = this.playedSongs[this.playedSongs.length - 1];
      }
    } else {
      this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    }
  },
  
  // Play current song
  playSong: function() {
    this.playBtn.textContent = '⏸';
    this.musicPlaying = true;
    
    if (!this.bgMusic.src || !this.bgMusic.src.includes(this.playlist[this.currentSongIndex].src)) {
      this.bgMusic.src = this.playlist[this.currentSongIndex].src;
    }
    
    this.bgMusic.play().then(() => {
      console.log('Music started playing successfully');
    }).catch(error => {
      console.error('Error playing music:', error);
      alert('Error playing music: ' + error.message);
      this.playBtn.textContent = '▶︎';
      this.musicPlaying = false;
    });
  },
  
  // Pause current song
  pauseSong: function() {
    const fadeOut = setInterval(() => {
      if (this.bgMusic.volume > 0.05) {
        this.bgMusic.volume -= 0.05;
      } else {
        this.bgMusic.volume = 0;
        this.bgMusic.pause();
        this.bgMusic.volume = 1;
        clearInterval(fadeOut);
      }
    }, 20);
    
    this.playBtn.textContent = '▶︎';
    this.musicPlaying = false;
  },
  
  // Attach event listeners
  attachEventListeners: function() {
    // Play/Pause button
    this.playBtn.addEventListener('click', () => {
      if (this.musicPlaying) {
        this.pauseSong();
      } else {
        this.playSong();
      }
    });
    
    // Previous button
    this.prevBtn.addEventListener('click', () => {
      this.getPreviousSong();
      this.updateSongTitle();
      this.bgMusic.src = this.playlist[this.currentSongIndex].src;
      this.bgMusic.play().then(() => {
        this.playBtn.textContent = '⏸';
        this.musicPlaying = true;
      }).catch(error => {
        console.error('Error playing music:', error);
      });
    });
    
    // Next button
    this.nextBtn.addEventListener('click', () => {
      this.getNextSong();
      this.updateSongTitle();
      this.bgMusic.src = this.playlist[this.currentSongIndex].src;
      this.bgMusic.play().then(() => {
        this.playBtn.textContent = '⏸';
        this.musicPlaying = true;
      }).catch(error => {
        console.error('Error playing music:', error);
      });
    });
    
    // Shuffle button
    this.shuffleBtn.addEventListener('click', () => {
      if (!this.isShuffleMode) {
        this.isShuffleMode = true;
        this.playedSongs = [this.currentSongIndex];
        this.shuffleBtn.classList.add('active');
        this.sequenceBtn.classList.remove('active');
      }
    });
    
    // Sequence button
    this.sequenceBtn.addEventListener('click', () => {
      if (this.isShuffleMode) {
        this.isShuffleMode = false;
        this.playedSongs = [];
        this.shuffleBtn.classList.remove('active');
        this.sequenceBtn.classList.add('active');
      }
    });
    
    // Rewind 15 seconds
    this.rewindBtn.addEventListener('click', () => {
      this.bgMusic.currentTime = Math.max(0, this.bgMusic.currentTime - 15);
    });
    
    // Forward 15 seconds
    this.forwardBtn.addEventListener('click', () => {
      this.bgMusic.currentTime = Math.min(this.bgMusic.duration, this.bgMusic.currentTime + 15);
    });
    
    // Auto-play next song when current song ends
    this.bgMusic.addEventListener('ended', () => {
      this.getNextSong();
      this.updateSongTitle();
      this.bgMusic.src = this.playlist[this.currentSongIndex].src;
      this.bgMusic.play().catch(error => {
        console.error('Error playing next song:', error);
      });
    });
  }
};
