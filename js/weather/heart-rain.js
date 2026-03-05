/* ========================================
   HEART RAIN WEATHER MODULE
   Falling hearts with wind, clouds, rain streaks, and splash effects
   ======================================== */

const HeartRain = {
  shared: null,
  cloudLayer: null,
  rainBackground: null,
  rainStreaks: [],
  
  heartTypes: ['❤️', '💕', '💞', '💓', '💗', '💖', '💘', '💙', '💜', '🧡'],
  colors: [
    '#ff0066', '#ff1a75', '#ff3385', '#ff4d94', 
    '#ff66a3', '#ff80b3', '#e6005c', '#cc0052',
    '#ff007f', '#ff1f8f', '#ff4da6', '#d946a6'
  ],
  heartShapes: ['❤️', '💕', '💗', '💖', '💓', '💞'],
  
  // Start heart rain weather
  start: function(sharedState, cloudLayer, rainBackground) {
    this.shared = sharedState;
    this.cloudLayer = cloudLayer;
    this.rainBackground = rainBackground;
    
    console.log('Starting Heart Rain weather');
    
    // Setup cloud layer
    this.cloudLayer.style.display = 'block';
    this.createClouds();
    
    // Setup rain background
    this.rainBackground.style.display = 'block';
    this.createRainBackground();
    
    // Start wind system
    this.startWindGustSystem();
    this.startWindInterpolation();
    
    // Start particle spawning
    this.spawnLoop();
  },
  
  // Stop heart rain weather
  stop: function(sharedState, cloudLayer, rainBackground) {
    console.log('Heart Rain weather stopped');
    
    this.cloudLayer = cloudLayer;
    this.rainBackground = rainBackground;
    
    if (this.cloudLayer) {
      this.cloudLayer.innerHTML = '';
      this.cloudLayer.style.display = 'none';
    }
    
    if (this.rainBackground) {
      this.rainBackground.innerHTML = '';
      this.rainBackground.style.display = 'none';
    }
    
    this.rainStreaks = [];
  },
  
  // Create clouds
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
  
  // Create rain background
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
  
  // Spawn loop for heart particles
  spawnLoop: function() {
    const self = this;
    
    function loop() {
      if (document.body.classList.contains('bg-heart-rain')) {
        self.createHeartRainParticle();
        
        const nextSpawn = 100 + Math.random() * 200;
        const timeoutId = setTimeout(loop, nextSpawn);
        self.shared.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    loop();
  },
  
  // Create heart rain particle
  createHeartRainParticle: function() {
    if (this.shared.activeWeatherParticles.length >= this.shared.maxParticles) return;
    
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
    
    const heartShape = this.heartShapes[Math.floor(Math.random() * this.heartShapes.length)];
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    
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
    this.shared.activeWeatherParticles.push(particle);
    
    const particleData = {
      element: particle,
      startX: startX,
      baseDrift: baseDrift,
      speed: speed,
      startTime: Date.now(),
      layer: layer
    };
    
    this.animateParticleWithWind(particleData, rotationStart, rotationEnd, opacity, size, color, heartShape);
  },
  
  // Animate particle with wind
  animateParticleWithWind: function(particleData, rotationStart, rotationEnd, opacity, size, color, heartShape) {
    const self = this;
    const { element, startX, baseDrift, speed, startTime, layer } = particleData;
    let animationComplete = false;
    
    function updateParticle() {
      if (animationComplete || !document.body.classList.contains('bg-heart-rain')) return;
      
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
        const index = self.shared.activeWeatherParticles.indexOf(element);
        if (index > -1) {
          self.shared.activeWeatherParticles.splice(index, 1);
        }
        return;
      }
      
      const windInfluence = layer === 'far' ? 0.3 : (layer === 'mid' ? 0.6 : 1.0);
      const totalDrift = baseDrift + (self.shared.currentWindForce.x * windInfluence * 200);
      
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
  
  // Create splash effect
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
  
  // Wind interpolation
  startWindInterpolation: function() {
    const self = this;
    
    function interpolateWind() {
      if (!document.body.classList.contains('bg-heart-rain')) return;
      
      const lerpFactor = 0.05;
      self.shared.currentWindForce.x += (self.shared.targetWindForce.x - self.shared.currentWindForce.x) * lerpFactor;
      self.shared.currentWindForce.y += (self.shared.targetWindForce.y - self.shared.currentWindForce.y) * lerpFactor;
      
      self.updateRainAngles();
      
      requestAnimationFrame(interpolateWind);
    }
    
    interpolateWind();
  },
  
  // Update rain streak angles based on wind
  updateRainAngles: function() {
    this.rainStreaks.forEach(streak => {
      const baseAngle = 8;
      const windAngle = this.shared.currentWindForce.x * 15;
      const totalAngle = baseAngle + windAngle;
      
      streak.style.transform = `rotate(${totalAngle}deg)`;
    });
  },
  
  // Wind gust system
  startWindGustSystem: function() {
    const self = this;
    
    function createGust() {
      if (!document.body.classList.contains('bg-heart-rain')) return;
      
      const minGust = 0.2;
      const maxGust = 1.5;
      const gustStrength = minGust + Math.random() * (maxGust - minGust);
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.shared.targetWindForce.x = gustStrength * gustDirection;
      
      const gustDuration = 2000 + Math.random() * 2000;
      
      setTimeout(() => {
        self.shared.targetWindForce.x = 0;
      }, gustDuration);
      
      const nextGust = 3000 + Math.random() * 5000;
      self.shared.windGustInterval = setTimeout(createGust, nextGust);
    }
    
    self.shared.windGustInterval = setTimeout(createGust, 2000);
  }
};
