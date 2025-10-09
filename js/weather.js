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
      if (progress < 0.1) {
        currentOpacity = opacity * (progress / 0.1);
      } else if (progress > 0.85) {
        currentOpacity = opacity * ((1 - progress) / 0.15);
      }
      
      element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      element.style.opacity = currentOpacity;
      
      requestAnimationFrame(updateParticle);
    }
    
    updateParticle();
  },
  
  createSplashEffect: function(x, y, color, shape) {
    const splashCount = 4 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < splashCount; i++) {
      const splash = document.createElement('div');
      splash.classList.add('splash-particle');
      splash.textContent = shape;
      splash.style.fontSize = (8 + Math.random() * 8) + 'px';
      splash.style.color = color;
      splash.style.left = x + 'px';
      splash.style.top = y + 'px';
      splash.style.filter = `blur(0.5px)`;
      
      const angle = (Math.PI / 3) + (Math.random() * Math.PI / 3);
      const distance = 30 + Math.random() * 40;
      const splashX = Math.cos(angle) * distance * (Math.random() > 0.5 ? 1 : -1);
      const splashY = -Math.sin(angle) * distance;
      
      splash.style.setProperty('--splash-x', splashX + 'px');
      splash.style.setProperty('--splash-y', splashY + 'px');
      
      document.body.appendChild(splash);
      
      setTimeout(() => {
        if (splash && splash.parentNode) {
          splash.parentNode.removeChild(splash);
        }
      }, 600);
    }
  },
  
  // === LOVE SNOW SYSTEM ===
  startLoveSnow: function() {
    this.alpineScene.classList.add('active');
    this.createAlpineScene();
    
    this.cloudLayer.style.display = 'block';
    this.createSnowClouds();
    
    this.rainBackground.style.display = 'block';
    this.createSnowBackground();
    
    this.startSantaSleighSystem();
    this.startSnowWindSystem();
    this.startSnowWindInterpolation();
    
    const self = this;
    const snowColors = [
      '#ffffff', '#f0f8ff', '#e6f2ff', '#f5f5ff',
      '#e8e8ff', '#fafafa', '#f0f0ff', '#ffffff'
    ];
    const snowShapes = ['❄️', '❅', '❆', '✻', '✼'];
    
    function createSnowParticle() {
      if (self.activeWeatherParticles.length >= self.maxParticles) return;
      
      const particle = document.createElement('div');
      particle.classList.add('weather-particle');
      
      const layerRandom = Math.random();
      let layer, size, blur, speed, opacity;
      
      if (layerRandom < 0.35) {
        layer = 'far';
        size = 8 + Math.random() * 8;
        blur = 3 + Math.random() * 2;
        speed = 8000 + Math.random() * 4000;
        opacity = 0.3 + Math.random() * 0.2;
      } else if (layerRandom < 0.7) {
        layer = 'mid';
        size = 16 + Math.random() * 12;
        blur = 1 + Math.random() * 1;
        speed = 5000 + Math.random() * 3000;
        opacity = 0.5 + Math.random() * 0.25;
      } else {
        layer = 'close';
        size = 28 + Math.random() * 20;
        blur = 0;
        speed = 4000 + Math.random() * 2000;
        opacity = 0.75 + Math.random() * 0.25;
      }
      
      particle.classList.add(layer);
      
      const snowShape = snowShapes[Math.floor(Math.random() * snowShapes.length)];
      const color = snowColors[Math.floor(Math.random() * snowColors.length)];
      
      particle.textContent = snowShape;
      particle.style.fontSize = size + 'px';
      particle.style.color = color;
      particle.style.filter = `blur(${blur}px) drop-shadow(0 0 ${blur * 2}px rgba(255, 255, 255, 0.8))`;
      particle.style.opacity = opacity;
      
      const startX = Math.random() * window.innerWidth;
      particle.style.left = startX + 'px';
      particle.style.top = '-100px';
      
      let baseDrift = (Math.random() - 0.5) * 250;
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + (Math.random() * 180 - 90);
      
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
      
      self.animateSnowParticle(particleData, rotationStart, rotationEnd, opacity, size);
    }
    
    function spawnLoop() {
      if (self.currentWeather === 'love-snow') {
        createSnowParticle();
        
        const nextSpawn = 200 + Math.random() * 200;
        const timeoutId = setTimeout(spawnLoop, nextSpawn);
        self.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    spawnLoop();
  },
  
  animateSnowParticle: function(particleData, rotationStart, rotationEnd, opacity, size) {
    const self = this;
    const { element, startX, baseDrift, speed, startTime, layer } = particleData;
    let animationComplete = false;
    
    function updateParticle() {
      if (animationComplete || self.currentWeather !== 'love-snow') return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        animationComplete = true;
        
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        const index = self.activeWeatherParticles.indexOf(element);
        if (index > -1) {
          self.activeWeatherParticles.splice(index, 1);
        }
        return;
      }
      
      const windInfluence = layer === 'far' ? 0.4 : (layer === 'mid' ? 0.7 : 1.0);
      const totalDrift = baseDrift + (self.currentWindForce.x * windInfluence * 300);
      
      const easedProgress = progress * (2 - progress);
      
      const swayFrequency = 2 + (layer === 'close' ? 1 : 0);
      const swayAmplitude = layer === 'far' ? 10 : (layer === 'mid' ? 20 : 30);
      const sway = Math.sin(progress * Math.PI * swayFrequency) * swayAmplitude * (1 - progress * 0.5);
      
      const currentY = easedProgress * (window.innerHeight + 100);
      const currentX = progress * totalDrift + sway;
      const currentRotation = rotationStart + (rotationEnd - rotationStart) * progress;
      
      let currentOpacity = opacity;
      if (progress < 0.15) {
        currentOpacity = opacity * (progress / 0.15);
      } else if (progress > 0.9) {
        currentOpacity = opacity * ((1 - progress) / 0.1);
      }
      
      element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      element.style.opacity = currentOpacity;
      
      requestAnimationFrame(updateParticle);
    }
    
    updateParticle();
  },
  
  // === CLOUD SYSTEMS ===
  createClouds: function() {
    this.cloudLayer.innerHTML = '';
    
    const cloudCount = 5 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.classList.add('weather-cloud');
      
      const sizeType = Math.random();
      if (sizeType < 0.3) {
        cloud.classList.add('small');
      } else if (sizeType < 0.7) {
        cloud.classList.add('medium');
      } else {
        cloud.classList.add('large');
      }
      
      cloud.style.top = (Math.random() * 120) + 'px';
      cloud.style.left = (Math.random() * window.innerWidth) + 'px';
      
      const duration = 15 + Math.random() * 15;
      cloud.style.animationDuration = duration + 's';
      cloud.style.animationDelay = -(Math.random() * duration) + 's';
      
      this.cloudLayer.appendChild(cloud);
    }
  },
  
  createSnowClouds: function() {
    this.cloudLayer.innerHTML = '';
    
    const cloudCount = 6 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.classList.add('weather-cloud');
      
      const sizeType = Math.random();
      if (sizeType < 0.2) {
        cloud.classList.add('small');
      } else if (sizeType < 0.5) {
        cloud.classList.add('medium');
      } else {
        cloud.classList.add('large');
      }
      
      cloud.style.top = (Math.random() * 140) + 'px';
      cloud.style.left = (Math.random() * window.innerWidth) + 'px';
      
      const duration = 20 + Math.random() * 20;
      cloud.style.animationDuration = duration + 's';
      cloud.style.animationDelay = -(Math.random() * duration) + 's';
      cloud.style.opacity = 0.5 + Math.random() * 0.2;
      
      this.cloudLayer.appendChild(cloud);
    }
  },
  
  // === RAIN BACKGROUND ===
  createRainBackground: function() {
    this.rainBackground.innerHTML = '';
    this.rainStreaks = [];
    
    const streakCount = 150;
    
    for (let i = 0; i < streakCount; i++) {
      const streak = document.createElement('div');
      streak.classList.add('rain-streak');
      
      const height = 30 + Math.random() * 50;
      streak.style.height = height + 'px';
      streak.style.left = Math.random() * 100 + '%';
      
      const duration = 0.3 + Math.random() * 0.5;
      streak.style.animationDuration = duration + 's';
      streak.style.animationDelay = -(Math.random() * duration) + 's';
      streak.style.transform = 'rotate(8deg)';
      
      this.rainBackground.appendChild(streak);
      this.rainStreaks.push(streak);
    }
  },
  
  createSnowBackground: function() {
    this.rainBackground.innerHTML = '';
    this.rainStreaks = [];
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('snow-bg-particle');
      
      particle.style.left = Math.random() * 100 + '%';
      
      const duration = 4 + Math.random() * 6;
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = -(Math.random() * duration) + 's';
      
      const size = 2 + Math.random() * 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      this.rainBackground.appendChild(particle);
    }
  },
  
  // === WIND SYSTEMS ===
  startWindInterpolation: function() {
    const self = this;
    
    function interpolateWind() {
      if (self.currentWeather !== 'heart-rain') return;
      
      const lerpFactor = 0.05;
      self.currentWindForce.x += (self.targetWindForce.x - self.currentWindForce.x) * lerpFactor;
      self.currentWindForce.y += (self.targetWindForce.y - self.currentWindForce.y) * lerpFactor;
      
      self.updateRainAngles();
      
      requestAnimationFrame(interpolateWind);
    }
    
    interpolateWind();
  },
  
  updateRainAngles: function() {
    this.rainStreaks.forEach(streak => {
      const baseAngle = 8;
      const windAngle = this.currentWindForce.x * 15;
      const totalAngle = baseAngle + windAngle;
      
      streak.style.transform = `rotate(${totalAngle}deg)`;
    });
  },
  
  startWindGustSystem: function() {
    const self = this;
    
    function createGust() {
      if (self.currentWeather !== 'heart-rain') return;
      
      const minGust = 0.2;
      const maxGust = 1.5;
      const gustStrength = minGust + Math.random() * (maxGust - minGust);
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.targetWindForce.x = gustStrength * gustDirection;
      
      const gustDuration = 2000 + Math.random() * 2000;
      
      setTimeout(() => {
        self.targetWindForce.x = 0;
      }, gustDuration);
      
      const nextGust = 3000 + Math.random() * 5000;
      self.windGustInterval = setTimeout(createGust, nextGust);
    }
    
    self.windGustInterval = setTimeout(createGust, 2000);
  },
  
  startSnowWindInterpolation: function() {
    const self = this;
    
    function interpolateWind() {
      if (self.currentWeather !== 'love-snow') return;
      
      const lerpFactor = 0.03;
      self.currentWindForce.x += (self.targetWindForce.x - self.currentWindForce.x) * lerpFactor;
      self.currentWindForce.y += (self.targetWindForce.y - self.currentWindForce.y) * lerpFactor;
      
      requestAnimationFrame(interpolateWind);
    }
    
    interpolateWind();
  },
  
  startSnowWindSystem: function() {
    const self = this;
    
    function createGust() {
      if (self.currentWeather !== 'love-snow') return;
      
      const minGust = 0.1;
      const maxGust = 0.8;
      const gustStrength = minGust + Math.random() * (maxGust - minGust);
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.targetWindForce.x = gustStrength * gustDirection;
      
      const gustDuration = 3000 + Math.random() * 3000;
      
      setTimeout(() => {
        self.targetWindForce.x = 0;
      }, gustDuration);
      
      const nextGust = 4000 + Math.random() * 6000;
      self.windGustInterval = setTimeout(createGust, nextGust);
    }
    
    self.windGustInterval = setTimeout(createGust, 3000);
  },
  
  // === ALPINE SCENE ===
  createAlpineScene: function() {
    this.alpineScene.innerHTML = '';
    
    console.log('Creating Alpine Scene');
    
    const mountainPositions = [
      { type: 'back', left: '5%' },
      { type: 'back', left: '25%' },
      { type: 'mid', left: '15%' },
      { type: 'back', left: '50%' },
      { type: 'mid', left: '40%' },
      { type: 'front', left: '30%' },
      { type: 'back', left: '70%' },
      { type: 'mid', left: '65%' },
      { type: 'front', left: '75%' },
      { type: 'back', left: '85%' }
    ];
    
    mountainPositions.forEach((pos, index) => {
      const mountain = document.createElement('div');
      mountain.classList.add('mountain', `mountain-${pos.type}`);
      mountain.style.left = pos.left;
      
      if (pos.type === 'back' || pos.type === 'mid') {
        const snowCap = document.createElement('div');
        snowCap.classList.add('snow-cap');
        mountain.appendChild(snowCap);
      }
      
      this.alpineScene.appendChild(mountain);
    });
    
    const fogCount = 8;
    for (let i = 0; i < fogCount; i++) {
      const fog = document.createElement('div');
      fog.classList.add('mountain-fog');
      
      const width = 200 + Math.random() * 150;
      const height = 60 + Math.random() * 40;
      fog.style.width = width + 'px';
      fog.style.height = height + 'px';
      fog.style.bottom = (20 + Math.random() * 200) + 'px';
      fog.style.left = (Math.random() * 100) + '%';
      
      const duration = 40 + Math.random() * 30;
      fog.style.animationDuration = duration + 's';
      fog.style.animationDelay = -(Math.random() * duration) + 's';
      
      this.alpineScene.appendChild(fog);
    }
  },
  
  // === SANTA SLEIGH SYSTEM ===
  startSantaSleighSystem: function() {
    const self = this;
    
    function spawnSleigh() {
      if (self.currentWeather !== 'love-snow') return;
      
      console.log('Spawning Santa sleigh!');
      
      const sleigh = document.createElement('div');
      sleigh.classList.add('santa-sleigh');
      
      sleigh.innerHTML = `
        <div class="reindeer" style="left: -60px;">
          <div class="reindeer-body">
            <div class="reindeer-head">
              <div class="reindeer-antler left"></div>
              <div class="reindeer-antler right"></div>
            </div>
            <div class="reindeer-leg" style="left: 5px;"></div>
            <div class="reindeer-leg" style="right: 5px;"></div>
          </div>
        </div>
        <div class="reindeer" style="left: -90px; top: -10px;">
          <div class="reindeer-body">
            <div class="reindeer-head">
              <div class="reindeer-antler left"></div>
              <div class="reindeer-antler right"></div>
            </div>
            <div class="reindeer-leg" style="left: 5px;"></div>
            <div class="reindeer-leg" style="right: 5px;"></div>
          </div>
        </div>
        <div class="reindeer" style="left: -120px; top: -5px;">
          <div class="reindeer-body">
            <div class="reindeer-head">
              <div class="reindeer-antler left"></div>
              <div class="reindeer-antler right"></div>
            </div>
            <div class="reindeer-leg" style="left: 5px;"></div>
            <div class="reindeer-leg" style="right: 5px;"></div>
          </div>
        </div>
        <div class="sleigh-body">
          <div class="sleigh-runner"></div>
          <div class="santa-figure">
            <div class="santa-hat"></div>
          </div>
        </div>
      `;
      
      document.body.appendChild(sleigh);
      
      setTimeout(() => {
        sleigh.classList.add('active');
      }, 100);
      
      let giftDropCount = 0;
      const giftInterval = setInterval(() => {
        if (giftDropCount < 5 && self.currentWeather === 'love-snow') {
          self.dropGift(sleigh);
          giftDropCount++;
        } else {
          clearInterval(giftInterval);
        }
      }, 4000);
      
      setTimeout(() => {
        sleigh.remove();
      }, 25000);
      
      const nextSpawn = 60000 + Math.random() * 60000;
      self.santaSleighInterval = setTimeout(spawnSleigh, nextSpawn);
    }
    
    self.santaSleighInterval = setTimeout(spawnSleigh, 5000);
  },
  
  dropGift: function(sleigh) {
    const gift = document.createElement('div');
    gift.classList.add('gift-particle');
    
    gift.innerHTML = `
      <div class="gift-box">
        <div class="gift-ribbon"></div>
      </div>
    `;
    
    const sleighRect = sleigh.getBoundingClientRect();
    gift.style.left = (sleighRect.left + 40) + 'px';
    gift.style.top = (sleighRect.top + 20) + 'px';
    
    const driftX = (Math.random() - 0.5) * 100;
    gift.style.setProperty('--fall-x', driftX + 'px');
    
    document.body.appendChild(gift);
    
    gift.style.animation = 'giftFall 4s ease-in forwards';
    
    setTimeout(() => {
      gift.remove();
    }, 4000);
  }
};
