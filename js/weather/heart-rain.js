/* ========================================
   HEART RAIN WEATHER
   Falling hearts with wind and rain effects
   ======================================== */

const HeartRainWeather = {
  activeParticles: [],
  animationFrames: [],
  maxParticles: 50,
  currentWindForce: { x: 0, y: 0 },
  targetWindForce: { x: 0, y: 0 },
  windGustInterval: null,
  rainStreaks: [],
  
  start: function() {
    console.log('💗 Heart rain weather started');
    const elements = WeatherCore.getElements();
    
    elements.cloudLayer.style.display = 'block';
    this.createClouds(elements.cloudLayer);
    
    elements.rainBackground.style.display = 'block';
    this.createRainBackground(elements.rainBackground);
    
    this.startWindGustSystem();
    this.startWindInterpolation();
    this.startHeartRain();
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
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.activeParticles = [];
    this.rainStreaks = [];
  },
  
  createClouds: function(container) {
    const cloudCount = 5 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.classList.add('weather-cloud');
      
      const sizeType = Math.random();
      if (sizeType < 0.3) cloud.classList.add('small');
      else if (sizeType < 0.7) cloud.classList.add('medium');
      else cloud.classList.add('large');
      
      cloud.style.top = (Math.random() * 120) + 'px';
      cloud.style.left = (Math.random() * window.innerWidth) + 'px';
      
      const duration = 15 + Math.random() * 15;
      cloud.style.animationDuration = duration + 's';
      cloud.style.animationDelay = -(Math.random() * duration) + 's';
      
      container.appendChild(cloud);
    }
  },
  
  createRainBackground: function(container) {
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
      
      container.appendChild(streak);
      this.rainStreaks.push(streak);
    }
  },
  
  startHeartRain: function() {
    const self = this;
    const colors = ['#ff0066', '#ff1a75', '#ff3385', '#ff4d94', '#ff66a3', '#ff80b3', '#e6005c', '#cc0052', '#ff007f', '#ff1f8f', '#ff4da6', '#d946a6'];
    const heartShapes = ['❤️', '💕', '💗', '💖', '💓', '💞'];
    
    function createHeart() {
      if (self.activeParticles.length >= self.maxParticles) return;
      
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
      
      document.body.appendChild(particle);
      self.activeParticles.push(particle);
      
      self.animateHeart(particle, startX, (Math.random() - 0.5) * 150, speed, layer, opacity, color, heartShape);
    }
    
    function spawnLoop() {
      if (WeatherCore.currentWeather === 'heart-rain') {
        createHeart();
        const timeoutId = setTimeout(spawnLoop, 100 + Math.random() * 200);
        self.animationFrames.push(timeoutId);
      }
    }
    
    spawnLoop();
  },
  
  animateHeart: function(element, startX, baseDrift, speed, layer, opacity, color, shape) {
    const self = this;
    const startTime = Date.now();
    const rotationStart = Math.random() * 360;
    const rotationEnd = rotationStart + (Math.random() * 720 - 360);
    
    function update() {
      if (WeatherCore.currentWeather !== 'heart-rain') return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        if (element && element.parentNode) element.parentNode.removeChild(element);
        const index = self.activeParticles.indexOf(element);
        if (index > -1) self.activeParticles.splice(index, 1);
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
      if (progress < 0.1) currentOpacity = opacity * (progress / 0.1);
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
      if (WeatherCore.currentWeather !== 'heart-rain') return;
      
      self.currentWindForce.x += (self.targetWindForce.x - self.currentWindForce.x) * 0.05;
      self.rainStreaks.forEach(streak => {
        const totalAngle = 8 + self.currentWindForce.x * 15;
        streak.style.transform = `rotate(${totalAngle}deg)`;
      });
      
      requestAnimationFrame(interpolate);
    }
    
    interpolate();
  },
  
  startWindGustSystem: function() {
    const self = this;
    
    function createGust() {
      if (WeatherCore.currentWeather !== 'heart-rain') return;
      
      const gustStrength = 0.2 + Math.random() * 1.3;
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.targetWindForce.x = gustStrength * gustDirection;
      
      setTimeout(() => {
        self.targetWindForce.x = 0;
      }, 2000 + Math.random() * 2000);
      
      self.windGustInterval = setTimeout(createGust, 3000 + Math.random() * 5000);
    }
    
    self.windGustInterval = setTimeout(createGust, 2000);
  }
};
