/* ========================================
   MAIN APPLICATION
   ======================================== */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2000);
  
  initializeApp();
});

function initializeApp() {
  const elements = {
    playBtn: document.getElementById('playBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    rewindBtn: document.getElementById('rewindBtn'),
    forwardBtn: document.getElementById('forwardBtn'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    sequenceBtn: document.getElementById('sequenceBtn'),
    bgMusic: document.getElementById('bgMusic'),
    songTitle: document.getElementById('songTitle'),
    weatherBtn: document.getElementById('weatherBtn'),
    weatherMenu: document.getElementById('weatherMenu'),
    cloudLayer: document.getElementById('cloudLayer'),
    rainBackground: document.getElementById('rainBackground'),
    alpineScene: document.getElementById('alpineScene'),
    heartButton: document.getElementById('heartButton')
  };
  
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
  
  WeatherSystem.init({
    weatherBtn: elements.weatherBtn,
    weatherMenu: elements.weatherMenu,
    cloudLayer: elements.cloudLayer,
    rainBackground: elements.rainBackground,
    alpineScene: elements.alpineScene
  });
  
  setupHeartButton(elements.heartButton);
  setupMouseTrail();
}

function setupHeartButton(heartButton) {
  const heartTypes = ['❤️', '💕', '💞', '💓', '💗', '💖', '💘', '💙', '💜', '🧡'];
  
  heartButton.addEventListener('click', () => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createHeart(heartTypes), i * 80);
    }
    
    heartButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
      heartButton.style.transform = '';
    }, 150);
  });
}

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
