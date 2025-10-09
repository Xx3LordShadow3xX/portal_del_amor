/* ========================================
   WEATHER SYSTEM MODULE
   Handles all weather effects: heart rain, love snow, etc.
   ======================================== */

const WeatherSystem = {
  // DOM Elements (will be set in main.js)
  weatherBtn: null,
  weatherMenu: null,
  cloudLayer: null,
  rainBackground: null,
  alpineScene: null,
  
  // State
  currentWeather: 'clear-sky',
  isWeatherMenuOpen: false,
  activeWeatherParticles: [],
  weatherAnimationFrames: [],
  maxParticles: 50,
  currentWindForce: { x: 0, y: 0 },
  targetWindForce: { x: 0, y: 0 },
  windGustInterval: null,
  starSpawnInterval: null,
  rainStreaks: [],
  santaSleighInterval: null,
  
  // Constants
  heartTypes: ['❤️', '💕', '💞', '💓', '💗', '💖', '💘', '💙', '💜', '🧡'],
  
  // Initialize weather system
  init: function(elements) {
    this.weatherBtn = elements.weatherBtn;
    this.weatherMenu = elements.weatherMenu;
    this.cloudLayer = elements.cloudLayer;
    this.rainBackground = elements.rainBackground;
    this.alpineScene = elements.alpineScene;
    
    this.attachEventListeners();
    this.startStarSpawning();
    
    // Initial stars for clear-sky
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createBackgroundStar(), i * 500);
    }
  },
  
  // Attach event listeners
  attachEventListeners: function() {
    // Weather button click
    this.weatherBtn.addEventListener('click', () => {
      this.isWeatherMenuOpen = !this.isWeatherMenuOpen;
      
      if (this.isWeatherMenuOpen) {
        this.weatherMenu.classList.add('active');
      } else {
        this.weatherMenu.classList.remove('active');
      }
      
      this.weatherBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.weatherBtn.style.transform = '';
      }, 150);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isWeatherMenuOpen && 
          !this.weatherMenu.contains(e.target) && 
          !this.weatherBtn.contains(e.target)) {
        this.weatherMenu.classList.remove('active');
        this.isWeatherMenuOpen = false;
      }
    });
    
    // Weather option selection
    const weatherOptions = document.querySelectorAll('.weather-option');
    weatherOptions.forEach(option => {
      option.addEventListener('click', () => {
        const weatherType = option.dataset.weather;
        
        // Update selection
        weatherOptions.forEach(opt => {
          opt.classList.remove('selected');
          if (weatherType === 'clear-sky') {
            opt.classList.add('dimmed');
          } else {
            opt.classList.remove('dimmed');
          }
        });
        
        option.classList.add('selected');
        option.classList.remove('dimmed');
        
        // Update current weather
        this.currentWeather = weatherType;
        
        // Update button icon
        const icon = option.querySelector('.weather-icon').textContent;
        this.weatherBtn.textContent = icon;
        
        console.log('Weather changed to:', weatherType);
        
        // Apply weather effect
        this.applyWeatherEffect(weatherType);
      });
    });
  },
  
  // Create background stars (for clear-sky mode)
  createBackgroundStar: function() {
    if (this.currentWeather !== 'clear-sky') return;
    
    const star = document.createElement('div');
    star.classList.add('bg-star');
    star.textContent = '✨';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    document.body.appendChild(star);
    
    setTimeout(() => {
      star.remove();
    }, 6000);
  },
  
  startStarSpawning: function() {
    if (this.starSpawnInterval) {
      clearInterval(this.starSpawnInterval);
    }
    
    this.starSpawnInterval = setInterval(() => {
      if (this.currentWeather === 'clear-sky' && Math.random() > 0.7) {
        this.createBackgroundStar();
      }
    }, 2000);
  },
  
  stopStarSpawning: function() {
    if (this.starSpawnInterval) {
      clearInterval(this.starSpawnInterval);
      this.starSpawnInterval = null;
    }
    document.querySelectorAll('.bg-star').forEach(star => star.remove());
  },
  
  // Stop all weather animations
  stopAllWeather: function() {
    this.weatherAnimationFrames.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.weatherAnimationFrames = [];
    
    if (this.windGustInterval) {
      clearInterval(this.windGustInterval);
      this.windGustInterval = null;
    }
    this.currentWindForce = { x: 0, y: 0 };
    this.targetWindForce = { x: 0, y: 0 };
    
    if (this.santaSleighInterval) {
      clearTimeout(this.santaSleighInterval);
      this.santaSleighInterval = null;
    }
    document.querySelectorAll('.santa-sleigh').forEach(s => s.remove());
    document.querySelectorAll('.gift-particle').forEach(g => g.remove());
    
    this.activeWeatherParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.activeWeatherParticles = [];
    
    document.querySelectorAll('.splash-particle').forEach(p => p.remove());
    
    this.cloudLayer.innerHTML = '';
    this.cloudLayer.style.display = 'none';
    
    this.rainBackground.innerHTML = '';
    this.rainBackground.style.display = 'none';
    this.rainStreaks = [];
    
    this.alpineScene.innerHTML = '';
    this.alpineScene.classList.remove('active');
  },
  
  // Apply weather effect
  applyWeatherEffect: function(weatherType) {
    this.stopAllWeather();
    
    document.body.classList.remove(
      'bg-heart-rain', 'bg-love-snow', 'bg-rose-petals', 
      'bg-cherry-blossoms', 'bg-starry-romance', 'bg-sunny-bliss', 'bg-clear-sky'
    );
    
    document.body.classList.add(`bg-${weatherType}`);
    
    if (weatherType === 'clear-sky') {
      this.startStarSpawning();
    } else {
      this.stopStarSpawning();
    }
    
    switch(weatherType) {
      case 'heart-rain':
        this.startHeartRain();
        break;
      case 'love-snow':
        this.startLoveSnow();
        break;
      case 'clear-sky':
        // No particles for clear sky
        break;
    }
  },
  
  // === HEART RAIN SYSTEM ===
  startHeartRain: function() {
    this.cloudLayer.style.display = 'block';
    this.createClouds();
    
    this.rainBackground.style.display = 'block';
    this.createRainBackground();
    
    this.startWindGustSystem();
    this.startWindInterpolation();
    
    const self = this;
    const colors = [
      '#ff0066', '#ff1a75', '#ff3385', '#ff4d94', 
      '#ff66a3', '#ff80b3', '#e6005c', '#cc0052',
      '#ff007f', '#ff1f8f', '#ff4da6', '#d946a6'
    ];
    const heartShapes = ['❤️', '💕', '💗', '💖', '💓', '💞'];
    
    function createHeartRainParticle() {
      if (self.activeWeatherParticles.length >= self.maxParticles) return;
      
      const particle = document.createElement('div');
      particle.classList.add('weather-particle');
      
      const layerRandom = Math.random();
      let layer, size, blur, speed, opacity;
      
      if (layerRandom < 0.3) {
        layer = 'far';
        size = 15 + Math.random() * 10;
        blur = 4 + Math.random() * 2;
        speed = 3000 + Math.random() * 2000;
        opacity = 0.4 + Math.random() * 0.2;
      } else if (layerRandom < 0.65) {
        layer = 'mid';
        size = 25 + Math.random() * 15;
        blur = 1.5 + Math.random() * 1;
        speed = 2000 + Math.random() * 1500;
        opacity = 0.6 + Math.random() * 0.2;
      } else {
        layer = 'close';
        size = 35 + Math.random() * 25;
        blur = 0;
        speed = 1500 + Math.random() * 1000;
        opacity = 0.85 + Math.random() * 0.15;
      }
      
      particle.classList.add(layer);
      
      const heartShape = heartShapes[Math.floor(Math.random() * heartShapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.textContent = heartShape;
      particle.style.fontSize = size + 'px';
      particle.style.color = color;
      particle.style.filter = `blur(${blur}px) drop-shadow(0 ${blur}px ${blur * 2}px rgba(255, 0, 100, 0.5))`;
      particle.style.opacity = opacity;
      
      const startX = Math.random() * window.innerWidth;
      particle.style.left = startX + 'px';
      particle.style.top = '-100px';
      
      let baseDrift = (Math.random() - 0.5) * 150;
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + (Math.random() * 720 - 360);
      
      document.body.appendChild(particle);
      self.activeWeatherParticles.push(particle);
      
      const particleData = {
        element: particle,
        startX: startX,
        baseDrift: baseDrift,
        speed: speed,
        startTime: Date.now(),
        layer: layer
      };
      
      self.animateParticleWithWind(particleData, rotationStart, rotationEnd, opacity, size, color, heartShape);
    }
    
    function spawnLoop() {
      if (self.currentWeather === 'heart-rain') {
        createHeartRainParticle();
        
        const nextSpawn = 100 + Math.random() * 200;
        const timeoutId = setTimeout(spawnLoop, nextSpawn);
        self.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    spawnLoop();
  },
  
  animateParticleWithWind: function(particleData, rotationStart, rotationEnd, opacity, size, color, heartShape) {
    const self = this;
    const { element, startX, baseDrift, speed, startTime, layer } = particleData;
    let animationComplete = false;
    
    function updateParticle() {
      if (animationComplete || self.currentWeather !== 'heart-rain') return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        animationComplete = true;
        
        if (layer === 'close' && Math.random() > 0.5) {
          const rect = element.getBoundingClientRect();
          self.createSplashEffect(rect.left + rect.width / 2, window.innerHeight - 20, color, heartShape);
        }
        
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        const index = self.activeWeatherParticles.indexOf(element);
        if (index > -1) {
          self.activeWeatherParticles.splice(index, 1);
        }
        return;
      }
      
      const windInfluence = layer === 'far' ? 0.3 : (layer === 'mid' ? 0.6 : 1.0);
      const totalDrift = baseDrift + (self.currentWindForce.x * windInfluence * 200);
      
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const wobble = Math.sin(progress * Math.PI * 3) * 15 * (1 - progress);
      const currentY = easedProgress * (window.innerHeight + 150);
      const currentX = progress * totalDrift + wobble;
      const currentRotation = rotationStart + (rotationEnd - rotationStart) * progress;
      
      let currentOpacity = opacity;
