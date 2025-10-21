/* ========================================
   MAIN APPLICATION
   Handles initialization, event listeners, and UI interactions
   ======================================== */

// Wait for DOM to load
window.addEventListener('load', () => {
  // Hide loading screen after 2 seconds
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
  
  // Initialize all systems
  initializeApp();
});

// Initialize application
function initializeApp() {
  // Get all DOM elements
  const elements = {
    // Music player elements
    playBtn: document.getElementById('playBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    rewindBtn: document.getElementById('rewindBtn'),
    forwardBtn: document.getElementById('forwardBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    sequenceBtn: document.getElementById('sequenceBtn'),
    bgMusic: document.getElementById('bgMusic'),
    songTitle: document.getElementById('songTitle'),
    
    // Weather system elements
    weatherBtn: document.getElementById('weatherBtn'),
    weatherMenu: document.getElementById('weatherMenu'),
    cloudLayer: document.getElementById('cloudLayer'),
    rainBackground: document.getElementById('rainBackground'),
    alpineScene: document.getElementById('alpineScene'),
    
    // Other elements
    heartButton: document.getElementById('heartButton')
  };
  
  // Initialize music player
  MusicPlayer.init({
    playBtn: elements.playBtn,
    prevBtn: elements.prevBtn,
    nextBtn: elements.nextBtn,
    rewindBtn: elements.rewindBtn,
    forwardBtn: elements.forwardBtn,
    shuffleBtn: elements.shuffleBtn,
    sequenceBtn: elements.sequenceBtn,
    bgMusic: elements.bgMusic,
    songTitle: elements.songTitle
  });
  
  // Initialize weather system
  WeatherCore.init({
    weatherBtn: elements.weatherBtn,
    weatherMenu: elements.weatherMenu,
    cloudLayer: elements.cloudLayer,
    rainBackground: elements.rainBackground,
    alpineScene: elements.alpineScene
  });
  
  // Start with clear sky by default
  ClearSkyWeather.start();
  
  // Setup heart button
  setupHeartButton(elements.heartButton);
  
  // Setup mouse trail
  setupMouseTrail();
}

// Setup heart button functionality
function setupHeartButton(heartButton) {
  const heartTypes = ['❤️', '💕', '💞', '💓', '💗', '💖', '💘', '💙', '💜', '🧡'];
  
  heartButton.addEventListener('click', () => {
    // Create falling hearts
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createHeart(heartTypes), i * 80);
    }
    
    // Button feedback animation
    heartButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      heartButton.style.transform = '';
    }, 150);
  });
}

// Create falling heart
function createHeart(heartTypes) {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.top = '-100px';
  heart.style.fontSize = (20 + Math.random() * 40) + 'px';
  
  const hueShift = Math.random() > 0.5 ? Math.random() * 30 : 280 + Math.random() * 80;
  heart.style.filter = `hue-rotate(${hueShift}deg)`;
  
  document.body.appendChild(heart);
  
  setTimeout(() => {
    heart.remove();
  }, 4000);
}

// Setup mouse trail hearts
function setupMouseTrail() {
  document.addEventListener('mousemove', (e) => {
    const trailHeart = document.createElement('div');
    trailHeart.classList.add('trail-heart');
    trailHeart.textContent = '💗';
    trailHeart.style.left = (e.clientX - 10 + Math.random() * 20) + 'px';
    trailHeart.style.top = (e.clientY - 10 + Math.random() * 20) + 'px';
    document.body.appendChild(trailHeart);
    
    setTimeout(() => {
      trailHeart.remove();
    }, 800);
  });
}
