/* ========================================
   MUSIC PLAYER MODULE
   Handles playlist, playback, shuffle/sequence modes
   ======================================== */

const MusicPlayer = {
  playBtn: null,
  prevBtn: null,
  nextBtn: null,
  rewindBtn: null,
  forwardBtn: null,
  shuffleBtn: null,
  sequenceBtn: null,
  bgMusic: null,
  songTitle: null,
  
  musicPlaying: false,
  currentSongIndex: 0,
  isShuffleMode: false,
  playedSongs: [],
  
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
  
  updateSongTitle: function() {
    this.songTitle.textContent = this.playlist[this.currentSongIndex].title;
  },
  
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
  
  playSong: function() {
    const self = this;
    
    this.playBtn.textContent = '⏸';
    this.musicPlaying = true;
    
    const currentSrc = this.playlist[this.currentSongIndex].src;
    const needsNewSource = !this.bgMusic.src || !this.bgMusic.src.includes(currentSrc);
    
    if (needsNewSource) {
      this.bgMusic.src = currentSrc;
      this.bgMusic.load();
    }
    
    const playPromise = this.bgMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('✅ Music playing');
      }).catch(error => {
        console.error('❌ Play error:', error);
        self.playBtn.textContent = '▶︎';
        self.musicPlaying = false;
      });
    }
  },
  
  pauseSong: function() {
    this.bgMusic.pause();
    this.playBtn.textContent = '▶︎';
    this.musicPlaying = false;
  },
  
  attachEventListeners: function() {
    const self = this;
    
    this.playBtn.addEventListener('click', () => {
      if (self.musicPlaying) {
        self.pauseSong();
      } else {
        self.playSong();
      }
    });
    
    this.prevBtn.addEventListener('click', () => {
      self.getPreviousSong();
      self.updateSongTitle();
      self.bgMusic.src = self.playlist[self.currentSongIndex].src;
      self.bgMusic.load();
      self.bgMusic.play().then(() => {
        self.playBtn.textContent = '⏸';
        self.musicPlaying = true;
      });
    });
    
    this.nextBtn.addEventListener('click', () => {
      self.getNextSong();
      self.updateSongTitle();
      self.bgMusic.src = self.playlist[self.currentSongIndex].src;
      self.bgMusic.load();
      self.bgMusic.play().then(() => {
        self.playBtn.textContent = '⏸';
        self.musicPlaying = true;
      });
    });
    
    this.shuffleBtn.addEventListener('click', () => {
      if (!self.isShuffleMode) {
        self.isShuffleMode = true;
        self.playedSongs = [self.currentSongIndex];
        self.shuffleBtn.classList.add('active');
        self.sequenceBtn.classList.remove('active');
      }
    });
    
    this.sequenceBtn.addEventListener('click', () => {
      if (self.isShuffleMode) {
        self.isShuffleMode = false;
        self.playedSongs = [];
        self.shuffleBtn.classList.remove('active');
        self.sequenceBtn.classList.add('active');
      }
    });
    
    this.rewindBtn.addEventListener('click', () => {
      self.bgMusic.currentTime = Math.max(0, self.bgMusic.currentTime - 15);
    });
    
    this.forwardBtn.addEventListener('click', () => {
      self.bgMusic.currentTime = Math.min(self.bgMusic.duration, self.bgMusic.currentTime + 15);
    });
    
    this.bgMusic.addEventListener('ended', () => {
      self.getNextSong();
      self.updateSongTitle();
      self.bgMusic.src = self.playlist[self.currentSongIndex].src;
      self.bgMusic.load();
      self.bgMusic.play();
    });
  }
};
