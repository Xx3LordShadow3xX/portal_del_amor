/* ========================================
   LOVE SNOW WEATHER (MAIN COORDINATOR)
   Manages all snow subsystems
   ======================================== */

const LoveSnowWeather = {
  activeParticles: [],
  animationFrames: [],
  maxParticles: 50,
  currentWindForce: { x: 0, y: 0 },
  targetWindForce: { x: 0, y: 0 },
  windGustInterval: null,
  
  start: function() {
    console.log('❄️ Love snow weather started');
    const elements = WeatherCore.getElements();
    
    // Setup scene
    elements.alpineScene.classList.add('active');
    this.createAlpineScene(elements.alpineScene);
    
    elements.cloudLayer.style.display = 'block';
    this.createSnowClouds(elements.cloudLayer);
    
    elements.rainBackground.style.display = 'block';
    this.createSnowBackground(elements.rainBackground);
    
    // Start wind system
    this.startSnowWindSystem();
    this.startWindInterpolation();
    
    // Start snowfall
    this.startSnowfall();
    
    // Start all subsystems
    if (typeof SnowDayNight !== 'undefined') SnowDayNight.start();
    if (typeof SnowAurora !== 'undefined') SnowAurora.init();
    if (typeof SnowBlizzard !== 'undefined') SnowBlizzard.start();
    if (typeof SnowSantaSleigh !== 'undefined') SnowSantaSleigh.start();
    if (typeof SnowPineTrees !== 'undefined') SnowPineTrees.create(elements.alpineScene);
    if (typeof SnowCabin !== 'undefined') SnowCabin.create(elements.alpineScene);
  },
  
  stop: function() {
    this.animationFrames.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.animationFrames = [];
    
    if (this.windGustInterval) {
      clearInterval(this.windGustInterval);
      this.windGustInterval = null;
    }
    
    this.currentWindForce = { x: 0, y: 0 };
    this.targetWindForce = { x: 0, y: 0 };
    
    this.activeParticles.forEach(particle => {
      if (particle && particle.parentNode) particle.parentNode.removeChild(particle);
    });
    this.activeParticles = [];
    
    // Stop all subsystems
    if (typeof SnowDayNight !== 'undefined') SnowDayNight.stop();
    if (typeof SnowAurora !== 'undefined') SnowAurora.hide();
    if (typeof SnowBlizzard !== 'undefined') SnowBlizzard.stop();
    if (typeof SnowSantaSleigh !== 'undefined') SnowSantaSleigh.stop();
    if (typeof SnowPineTrees !== 'undefined') SnowPineTrees.clear();
    if (typeof SnowCabin !== 'undefined') SnowCabin.remove();
  },
  
  createAlpineScene: function(container) {
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
    
    mountainPositions.forEach(pos => {
      const mountain = document.createElement('div');
      mountain.classList.add('mountain', `mountain-${pos.type}`);
      mountain.style.left = pos.left;
      
      if (pos.type === 'back' || pos.type === 'mid') {
        const snowCap = document.createElement('div');
        snowCap.classList.add('snow-cap');
        mountain.appendChild(snowCap);
      }
      
      container.appendChild(mountain);
    });
    
    // Mountain fog
    for (let i = 0; i < 8; i++) {
      const fog = document.createElement('div');
      fog.className = 'mountain-fog';
      fog.style.width = (200 + Math.random() * 150) + 'px';
      fog.style.height = (60 + Math.random() * 40) + 'px';
      fog.style.bottom = (20 + Math.random() * 200) + 'px';
      fog.style.left = (Math.random() * 100) + '%';
      fog.style.background = 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)';
      fog.style.borderRadius = '100%';
      fog.style.filter = 'blur(25px)';
      fog.style.animation = 'cloudDrift linear infinite';
      fog.style.position = 'absolute';
      const duration = 40 + Math.random() * 30;
      fog.style.animationDuration = duration + 's';
      fog.style.animationDelay = -(Math.random() * duration) + 's';
      container.appendChild(fog);
    }
  },
  
  createSnowClouds: function(container) {
    const cloudCount = 6 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.classList.add('weather-cloud');
      
      const sizeType = Math.random();
      if (sizeType < 0.2) cloud.classList.add('small');
      else if (sizeType < 0.5) cloud.classList.add('medium');
      else cloud.classList.add('large');
      
      cloud.style.top = (Math.random() * 140) + 'px';
      cloud.style.left = (Math.random() * window.innerWidth) + 'px';
      
      const duration = 20 + Math.random() * 20;
      cloud.style.animationDuration = duration + 's';
      cloud.style.animationDelay = -(Math.random() * duration) + 's';
      cloud.style.opacity = 0.5 + Math.random() * 0.2;
      
      container.appendChild(cloud);
    }
  },
  
  createSnowBackground: function(container) {
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
      
      container.appendChild(particle);
    }
  },
  
  startSnowfall: function() {
    const self = this;
    const snowColors = ['#ffffff', '#f0f8ff', '#e6f2ff', '#f5f5ff', '#e8e8ff', '#fafafa', '#f0f0ff', '#ffffff', '#fdfeff', '#f8fbff', '#ffffff', '#fcfeff'];
    const snowShapes = ['❄️', '❅', '❆', '✻', '✼', '❄', '❋'];
    
    function createSnowflake() {
      if (self.activeParticles.length >= self.maxParticles) return;
      
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
      
      document.body.appendChild(particle);
      self.activeParticles.push(particle);
      
      self.animateSnowflake(particle, startX, (Math.random() - 0.5) * 300, speed, layer, opacity);
    }
    
    function spawnLoop() {
      if (WeatherCore.currentWeather === 'love-snow') {
        createSnowflake();
        const timeoutId = setTimeout(spawnLoop, 150 + Math.random() * 250);
        self.animationFrames.push(timeoutId);
      }
    }
    
    spawnLoop();
  },
  
  animateSnowflake: function(element, startX, baseDrift, speed, layer, opacity) {
    const self = this;
    const startTime = Date.now();
    const rotationStart = Math.random() * 360;
    const rotationEnd = rotationStart + (Math.random() * 240 - 120);
    
    function update() {
      if (WeatherCore.currentWeather !== 'love-snow') return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        if (element && element.parentNode) element.parentNode.removeChild(element);
        const index = self.activeParticles.indexOf(element);
        if (index > -1) self.activeParticles.splice(index, 1);
        return;
      }
      
      const windInfluence = layer === 'far' ? 0.5 : (layer === 'mid' ? 0.8 : 1.2);
      const totalDrift = baseDrift + (self.currentWindForce.x * windInfluence * 350);
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      
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
      
      let currentOpacity = opacity;
      if (progress < 0.2) currentOpacity = opacity * (progress / 0.2);
      else if (progress > 0.85) currentOpacity = opacity * ((1 - progress) / 0.15);
      
      element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      element.style.opacity = currentOpacity;
      
      requestAnimationFrame(update);
    }
    
    update();
  },
  
  startWindInterpolation: function() {
    const self = this;
    
    function interpolate() {
      if (WeatherCore.currentWeather !== 'love-snow') return;
      self.currentWindForce.x += (self.targetWindForce.x - self.currentWindForce.x) * 0.03;
      self.currentWindForce.y += (self.targetWindForce.y - self.currentWindForce.y) * 0.03;
      requestAnimationFrame(interpolate);
    }
    
    interpolate();
  },
  
  startSnowWindSystem: function() {
    const self = this;
    
    function createGust() {
      if (WeatherCore.currentWeather !== 'love-snow') return;
      
      const gustStrength = 0.1 + Math.random() * 0.7;
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.targetWindForce.x = gustStrength * gustDirection;
      
      setTimeout(() => {
        self.targetWindForce.x = 0;
      }, 3000 + Math.random() * 3000);
      
      self.windGustInterval = setTimeout(createGust, 4000 + Math.random() * 6000);
    }
    
    self.windGustInterval = setTimeout(createGust, 3000);
  }
};
