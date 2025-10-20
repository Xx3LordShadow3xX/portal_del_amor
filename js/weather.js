// === LOVE SNOW SYSTEM ===
  startLoveSnow: function() {
    this.alpineScene.classList.add('active');
    this.createAlpineScene();
    
    this.cloudLayer.style.display = 'block';
    this.createSnowClouds();
    
    this.rainBackground.style.display = 'block';
    this.createSnowBackground();
    
    // Start all snow-specific systems
    this.startSantaSleighSystem();
    this.startSnowWindSystem();
    this.startSnowWindInterpolation();
    this.startDayNightCycle();
    this.createPineTrees();
    this.createCabin();
    this.scheduleBlizzard();
    
    const self = this;
    const snowColors = [
      '#ffffff', '#f0f8ff', '#e6f2ff', '#f5f5ff',
      '#e8e8ff', '#fafafa', '#f0f0ff', '#ffffff',
      '#fdfeff', '#f8fbff', '#ffffff', '#fcfeff'
    ];
    const snowShapes = ['❄️', '❅', '❆', '✻', '✼', '❄', '❋'];
    
    function createSnowParticle() {
      if (self.activeWeatherParticles.length >= self.maxParticles) return;
      
      const particle = document.createElement('div');
      particle.classList.add('weather-particle');
      
      const layerRandom = Math.random();
      let layer, size, blur, speed, opacity;
      
      if (layerRandom < 0.35) {
        layer = 'far';
        size = 8 + Math.random() * 8;
        blur = 4 + Math.random() * 2;
        speed = 10000 + Math.random() * 5000;
        opacity = 0.25 + Math.random() * 0.2;
      } else if (layerRandom < 0.7) {
        layer = 'mid';
        size = 16 + Math.random() * 12;
        blur = 1.5 + Math.random() * 1.5;
        speed = 6000 + Math.random() * 3000;
        opacity = 0.45 + Math.random() * 0.25;
      } else {
        layer = 'close';
        size = 28 + Math.random() * 22;
        blur = 0;
        speed = 4000 + Math.random() * 2000;
        opacity = 0.7 + Math.random() * 0.3;
      }
      
      particle.classList.add(layer);
      
      const snowShape = snowShapes[Math.floor(Math.random() * snowShapes.length)];
      const color = snowColors[Math.floor(Math.random() * snowColors.length)];
      
      particle.textContent = snowShape;
      particle.style.fontSize = size + 'px';
      particle.style.color = color;
      particle.style.filter = `blur(${blur}px) drop-shadow(0 0 ${blur * 3}px rgba(200, 220, 255, 0.8))`;
      particle.style.opacity = opacity;
      
      const startX = Math.random() * window.innerWidth;
      particle.style.left = startX + 'px';
      particle.style.top = '-100px';
      
      let baseDrift = (Math.random() - 0.5) * 300;
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + (Math.random() * 240 - 120);
      
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
        
        const nextSpawn = 150 + Math.random() * 250;
        const timeoutId = setTimeout(spawnLoop, nextSpawn);
        self.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    spawnLoop();
  },
  
  // === DAY/NIGHT CYCLE SYSTEM ===
  startDayNightCycle: function() {
    const self = this;
    const cycleTime = 300000; // 5 minutes total cycle
    const phases = ['sunrise', 'day', 'sunset', 'night'];
    let currentPhaseIndex = 1; // Start at day
    
    function changePhase() {
      if (self.currentWeather !== 'love-snow') return;
      
      const phase = phases[currentPhaseIndex];
      self.currentTimeOfDay = phase;
      
      // Remove all time classes
      document.body.classList.remove('time-sunrise', 'time-day', 'time-sunset', 'time-night');
      
      // Add current phase class
      document.body.classList.add(`time-${phase}`);
      
      console.log(`🌅 Time changed to: ${phase}`);
      
      // Handle aurora (only at night)
      if (phase === 'night') {
        self.showAurora();
      } else if (phase === 'sunrise') {
        self.hideAurora();
      }
      
      // Move to next phase
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    }
    
    // Set initial phase
    document.body.classList.add('time-day');
    
    // Change phase every 75 seconds (5 minutes / 4 phases)
    self.dayNightCycleInterval = setInterval(changePhase, 75000);
  },
  
  // === AURORA BOREALIS SYSTEM ===
  showAurora: function() {
    if (this.auroraContainer) return;
    
    console.log('✨ Northern Lights appearing...');
    
    this.auroraContainer = document.createElement('div');
    this.auroraContainer.className = 'aurora-container';
    
    // Create 3 aurora wave layers
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.className = 'aurora-wave';
      this.auroraContainer.appendChild(wave);
    }
    
    document.body.appendChild(this.auroraContainer);
    
    // Fade in aurora
    setTimeout(() => {
      this.auroraContainer.classList.add('active');
    }, 100);
  },
  
  hideAurora: function() {
    if (!this.auroraContainer) return;
    
    console.log('✨ Northern Lights fading...');
    
    this.auroraContainer.classList.remove('active');
    
    setTimeout(() => {
      if (this.auroraContainer && this.auroraContainer.parentNode) {
        this.auroraContainer.remove();
        this.auroraContainer = null;
      }
    }, 5000);
  },
  
  // === BLIZZARD SYSTEM ===
  scheduleBlizzard: function() {
    const self = this;
    
    function scheduleNext() {
      if (self.currentWeather !== 'love-snow') return;
      
      // Random time between 2-5 minutes
      const nextBlizzard = 120000 + Math.random() * 180000;
      console.log(`❄️ Next blizzard in ${Math.round(nextBlizzard/1000)} seconds`);
      
      self.blizzardInterval = setTimeout(() => {
        self.startBlizzard();
        scheduleNext();
      }, nextBlizzard);
    }
    
    scheduleNext();
  },
  
  startBlizzard: function() {
    if (this.isBlizzardActive) return;
    
    console.log('🌨️ BLIZZARD STARTING!');
    this.isBlizzardActive = true;
    
    const overlay = document.createElement('div');
    overlay.className = 'blizzard-overlay active';
    overlay.id = 'blizzard-overlay';
    document.body.appendChild(overlay);
    
    // Screen shake
    document.body.classList.add('blizzard-active');
    
    // Create intense snow particles
    const particleCount = 300;
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createBlizzardParticle(overlay);
      }, i * 10);
    }
    
    // Check if Santa is on screen during blizzard
    if (this.currentSantaSleigh) {
      setTimeout(() => {
        if (this.currentSantaSleigh && this.currentSantaSleigh.parentNode) {
          console.log('🎅 Santa getting blown away by blizzard!');
          this.currentSantaSleigh.classList.remove('active');
          this.currentSantaSleigh.classList.add('blown-away');
          
          setTimeout(() => {
            if (this.currentSantaSleigh && this.currentSantaSleigh.parentNode) {
              this.currentSantaSleigh.remove();
              this.currentSantaSleigh = null;
            }
          }, 2000);
        }
      }, 1000);
    }
    
    // Remove Christmas tree lights
    if (this.currentChristmasTree) {
      this.currentChristmasTree.classList.remove('christmas-tree');
      this.currentChristmasTree.querySelectorAll('.tree-light').forEach(light => light.remove());
      this.currentChristmasTree = null;
    }
    
    // Blizzard lasts 8-12 seconds
    const duration = 8000 + Math.random() * 4000;
    setTimeout(() => {
      this.stopBlizzard();
      
      // Select new Christmas tree after blizzard
      setTimeout(() => {
        this.selectChristmasTree();
      }, 2000);
    }, duration);
  },
  
  stopBlizzard: function() {
    if (!this.isBlizzardActive) return;
    
    console.log('🌨️ Blizzard ending...');
    this.isBlizzardActive = false;
    
    const overlay = document.getElementById('blizzard-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
      }, 500);
    }
    
    document.body.classList.remove('blizzard-active');
  },
  
  createBlizzardParticle: function(container) {
    const particle = document.createElement('div');
    particle.className = 'blizzard-particle';
    
    const size = 3 + Math.random() * 6;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Start from left side, moving right
    particle.style.left = '-20px';
    particle.style.top = Math.random() * 100 + '%';
    
    const duration = 0.8 + Math.random() * 1.2;
    const endX = window.innerWidth + Math.random() * 200;
    const endY = (Math.random() - 0.5) * 100;
    
    particle.style.transition = `all ${duration}s linear`;
    container.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.left = endX + 'px';
      particle.style.top = `calc(${particle.style.top} + ${endY}px)`;
      particle.style.opacity = '0';
    });
    
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  },
  
  // === PINE TREES SYSTEM ===
  createPineTrees: function() {
    const treeCount = 15 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < treeCount; i++) {
      const tree = this.createPineTree();
      
      // Position on mountains
      const leftPos = Math.random() * 100;
      const bottomPos = 5 + Math.random() * 25;
      const scale = 0.6 + Math.random() * 0.8;
      
      tree.style.left = leftPos + '%';
      tree.style.bottom = bottomPos + '%';
      tree.style.transform = `scale(${scale})`;
      tree.style.zIndex = Math.floor(bottomPos);
      
      // Add slight blur for depth
      if (bottomPos > 20) {
        tree.style.filter = 'blur(0px)';
      } else if (bottomPos > 15) {
        tree.style.filter = 'blur(1px)';
      } else {
        tree.style.filter = 'blur(2px)';
      }
      
      this.alpineScene.appendChild(tree);
      this.pineTrees.push(tree);
    }
    
    // Select one tree to be Christmas tree
    setTimeout(() => {
      this.selectChristmasTree();
    }, 3000);
  },
  
  createPineTree: function() {
    const tree = document.createElement('div');
    tree.className = 'pine-tree sway';
    
    const trunk = document.createElement('div');
    trunk.className = 'tree-trunk';
    
    const foliage = document.createElement('div');
    foliage.className = 'tree-foliage';
    
    // Create 3 layers of foliage
    for (let i = 0; i < 3; i++) {
      const layer = document.createElement('div');
      layer.className = 'tree-layer';
      foliage.appendChild(layer);
    }
    
    tree.appendChild(foliage);
    tree.appendChild(trunk);
    
    return tree;
  },
  
  selectChristmasTree: function() {
    if (this.pineTrees.length === 0) return;
    if (this.currentChristmasTree) return;
    
    // Select random tree
    const randomIndex = Math.floor(Math.random() * this.pineTrees.length);
    const selectedTree = this.pineTrees[randomIndex];
    
    selectedTree.classList.add('christmas-tree');
    this.currentChristmasTree = selectedTree;
    
    console.log('🎄 Christmas tree selected!');
    
    // Add lights
    const lightPositions = [
      { top: '10px', left: '20px' },
      { top: '25px', left: '15px' },
      { top: '25px', left: '35px' },
      { top: '40px', left: '10px' },
      { top: '40px', left: '30px' },
      { top: '40px', left: '45px' },
      { top: '55px', left: '5px' },
      { top: '55px', left: '25px' },
      { top: '55px', left: '50px' }
    ];
    
    lightPositions.forEach(pos => {
      const light = document.createElement('div');
      light.className = 'tree-light';
      light.style.top = pos.top;
      light.style.left = pos.left;
      selectedTree.querySelector('.tree-foliage').appendChild(light);
    });
  },
  
  // === CABIN SYSTEM ===
  createCabin: function() {
    this.cabinContainer = document.createElement('div');
    this.cabinContainer.className = 'cabin-container';
    
    // Create cabin image
    const cabinImg = document.createElement('img');
    cabinImg.src = 'assets/cabin.png';
    cabinImg.alt = 'Mountain Cabin';
    cabinImg.className = 'cabin-img';
    cabinImg.style.imageRendering = 'crisp-edges';
    
    // Window glow
    const windowGlow = document.createElement('div');
    windowGlow.className = 'cabin-window-glow';
    
    // Chimney smoke (3 puffs)
    for (let i = 0; i < 3; i++) {
      const smoke = document.createElement('div');
      smoke.className = 'cabin-smoke';
      this.cabinContainer.appendChild(smoke);
    }
    
    this.cabinContainer.appendChild(cabinImg);
    this.cabinContainer.appendChild(windowGlow);
    
    this.alpineScene.appendChild(this.cabinContainer);
    
    console.log('🏠 Cozy cabin created!');
  },/* ========================================
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
    this.currentSantaSleigh = null;
    
    // Stop day/night cycle
    if (this.dayNightCycleInterval) {
      clearInterval(this.dayNightCycleInterval);
      this.dayNightCycleInterval = null;
    }
    
    // Remove aurora
    if (this.auroraContainer) {
      this.auroraContainer.remove();
      this.auroraContainer = null;
    }
    
    // Stop blizzards
    if (this.blizzardInterval) {
      clearTimeout(this.blizzardInterval);
      this.blizzardInterval = null;
    }
    this.stopBlizzard();
    
    // Remove pine trees
    this.pineTrees.forEach(tree => tree.remove());
    this.pineTrees = [];
    this.currentChristmasTree = null;
    
    // Remove cabin
    if (this.cabinContainer) {
      this.cabinContainer.remove();
      this.cabinContainer = null;
    }
    
    document.body.classList.remove('blizzard-active');
    
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
      '#e8e8ff', '#fafafa', '#f0f0ff', '#ffffff',
      '#fdfeff', '#f8fbff', '#ffffff', '#fcfeff'
    ];
    const snowShapes = ['❄️', '❅', '❆', '✻', '✼', '❄', '❋'];
    
    function createSnowParticle() {
      if (self.activeWeatherParticles.length >= self.maxParticles) return;
      
      const particle = document.createElement('div');
      particle.classList.add('weather-particle');
      
      const layerRandom = Math.random();
      let layer, size, blur, speed, opacity;
      
      if (layerRandom < 0.35) {
        // Far layer - smallest, slowest, most blurred
        layer = 'far';
        size = 8 + Math.random() * 8;
        blur = 4 + Math.random() * 2;
        speed = 10000 + Math.random() * 5000;
        opacity = 0.25 + Math.random() * 0.2;
      } else if (layerRandom < 0.7) {
        // Mid layer
        layer = 'mid';
        size = 16 + Math.random() * 12;
        blur = 1.5 + Math.random() * 1.5;
        speed = 6000 + Math.random() * 3000;
        opacity = 0.45 + Math.random() * 0.25;
      } else {
        // Close layer - largest, fastest, sharpest
        layer = 'close';
        size = 28 + Math.random() * 22;
        blur = 0;
        speed = 4000 + Math.random() * 2000;
        opacity = 0.7 + Math.random() * 0.3;
      }
      
      particle.classList.add(layer);
      
      const snowShape = snowShapes[Math.floor(Math.random() * snowShapes.length)];
      const color = snowColors[Math.floor(Math.random() * snowColors.length)];
      
      particle.textContent = snowShape;
      particle.style.fontSize = size + 'px';
      particle.style.color = color;
      particle.style.filter = `blur(${blur}px) drop-shadow(0 0 ${blur * 3}px rgba(200, 220, 255, 0.8))`;
      particle.style.opacity = opacity;
      
      const startX = Math.random() * window.innerWidth;
      particle.style.left = startX + 'px';
      particle.style.top = '-100px';
      
      // Snow drifts more than rain
      let baseDrift = (Math.random() - 0.5) * 300;
      
      const rotationStart = Math.random() * 360;
      const rotationEnd = rotationStart + (Math.random() * 240 - 120);
      
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
        
        // Varied spawn rate for more natural effect
        const nextSpawn = 150 + Math.random() * 250;
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
      
      // Snow is highly affected by wind
      const windInfluence = layer === 'far' ? 0.5 : (layer === 'mid' ? 0.8 : 1.2);
      const totalDrift = baseDrift + (self.currentWindForce.x * windInfluence * 350);
      
      // Gentle floating easing
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      
      // Complex swaying motion - snow swirls more naturally
      const swayFrequency1 = 2 + (layer === 'close' ? 1 : 0);
      const swayFrequency2 = 3.5;
      const swayAmplitude = layer === 'far' ? 15 : (layer === 'mid' ? 30 : 45);
      const sway = (
        Math.sin(progress * Math.PI * swayFrequency1) * swayAmplitude * (1 - progress * 0.3) +
        Math.cos(progress * Math.PI * swayFrequency2) * (swayAmplitude * 0.4)
      );
      
      const currentY = easedProgress * (window.innerHeight + 120);
      const currentX = progress * totalDrift + sway;
      const currentRotation = rotationStart + (rotationEnd - rotationStart) * progress;
      
      // Fade in/out more gradually
      let currentOpacity = opacity;
      if (progress < 0.2) {
        currentOpacity = opacity * (progress / 0.2);
      } else if (progress > 0.85) {
        currentOpacity = opacity * ((1 - progress) / 0.15);
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
    
    // Get sleigh position - gifts drop from the SLEIGH, not reindeers
    const sleighRect = sleigh.getBoundingClientRect();
    const sleighImg = sleigh.querySelector('.sleigh-img');
    const sleighImgRect = sleighImg ? sleighImg.getBoundingClientRect() : sleighRect;
    
    // Drop from center of sleigh
    gift.style.left = (sleighImgRect.left + sleighImgRect.width / 2) + 'px';
    gift.style.top = (sleighImgRect.bottom) + 'px';
    
    const driftX = (Math.random() - 0.5) * 100;
    gift.style.setProperty('--fall-x', driftX + 'px');
    
    document.body.appendChild(gift);
    
    gift.style.animation = 'giftFall 4s ease-in forwards';
    
    setTimeout(() => {
      gift.remove();
    }, 4000);
  }
};
