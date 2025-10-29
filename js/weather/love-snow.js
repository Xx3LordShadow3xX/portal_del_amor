/* ========================================
   LOVE SNOW WEATHER MODULE
   Snowfall with alpine scene and Santa sleigh
   ======================================== */

const LoveSnow = {
  shared: null,
  cloudLayer: null,
  rainBackground: null,
  alpineScene: null,
  santaSleighInterval: null,
  
  snowColors: [
    '#ffffff', '#f0f8ff', '#e6f2ff', '#f5f5ff',
    '#e8e8ff', '#fafafa', '#f0f0ff', '#ffffff',
    '#fdfeff', '#f8fbff', '#ffffff', '#fcfeff'
  ],
  snowShapes: ['❄️', '❅', '❆', '✻', '✼', '❄', '❋'],
  
  // Start love snow weather
  start: function(sharedState, cloudLayer, rainBackground, alpineScene) {
    this.shared = sharedState;
    this.cloudLayer = cloudLayer;
    this.rainBackground = rainBackground;
    this.alpineScene = alpineScene;
    
    console.log('Starting Love Snow weather');
    
    // Setup alpine scene
    this.alpineScene.classList.add('active');
    this.createAlpineScene();
    
    // Setup clouds
    this.cloudLayer.style.display = 'block';
    this.createSnowClouds();
    
    // Setup snow background
    this.rainBackground.style.display = 'block';
    this.createSnowBackground();
    
    // Start Santa sleigh system
    this.startSantaSleighSystem();
    
    // Start wind system
    this.startSnowWindSystem();
    this.startSnowWindInterpolation();
    
    // Start particle spawning
    this.spawnLoop();
  },
  
  // Stop love snow weather
  stop: function(sharedState, cloudLayer, rainBackground, alpineScene) {
    console.log('Love Snow weather stopped');
    
    if (this.santaSleighInterval) {
      clearTimeout(this.santaSleighInterval);
      this.santaSleighInterval = null;
    }
    document.querySelectorAll('.santa-sleigh').forEach(s => s.remove());
    document.querySelectorAll('.gift-particle').forEach(g => g.remove());
    
    this.cloudLayer = cloudLayer;
    this.rainBackground = rainBackground;
    this.alpineScene = alpineScene;
    
    if (this.cloudLayer) {
      this.cloudLayer.innerHTML = '';
      this.cloudLayer.style.display = 'none';
    }
    
    if (this.rainBackground) {
      this.rainBackground.innerHTML = '';
      this.rainBackground.style.display = 'none';
    }
    
    if (this.alpineScene) {
      this.alpineScene.innerHTML = '';
      this.alpineScene.classList.remove('active');
    }
  },
  
  // Create snow clouds
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
  
  // Create snow background particles
  createSnowBackground: function() {
    this.rainBackground.innerHTML = '';
    
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
  
  // Create alpine scene
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
  
  // Spawn loop for snow particles
  spawnLoop: function() {
    const self = this;
    
    function loop() {
      if (document.body.classList.contains('bg-love-snow')) {
        self.createSnowParticle();
        
        const nextSpawn = 150 + Math.random() * 250;
        const timeoutId = setTimeout(loop, nextSpawn);
        self.shared.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    loop();
  },
  
  // Create snow particle
  createSnowParticle: function() {
    if (this.shared.activeWeatherParticles.length >= this.shared.maxParticles) return;
    
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
    
    const snowShape = this.snowShapes[Math.floor(Math.random() * this.snowShapes.length)];
    const color = this.snowColors[Math.floor(Math.random() * this.snowColors.length)];
    
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
    this.shared.activeWeatherParticles.push(particle);
    
    const particleData = {
      element: particle,
      startX: startX,
      baseDrift: baseDrift,
      speed: speed,
      startTime: Date.now(),
      layer: layer
    };
    
    this.animateSnowParticle(particleData, rotationStart, rotationEnd, opacity, size);
  },
  
  // Animate snow particle
  animateSnowParticle: function(particleData, rotationStart, rotationEnd, opacity, size) {
    const self = this;
    const { element, startX, baseDrift, speed, startTime, layer } = particleData;
    let animationComplete = false;
    
    function updateParticle() {
      if (animationComplete || !document.body.classList.contains('bg-love-snow')) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        animationComplete = true;
        
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
        const index = self.shared.activeWeatherParticles.indexOf(element);
        if (index > -1) {
          self.shared.activeWeatherParticles.splice(index, 1);
        }
        return;
      }
      
      const windInfluence = layer === 'far' ? 0.5 : (layer === 'mid' ? 0.8 : 1.2);
      const totalDrift = baseDrift + (self.shared.currentWindForce.x * windInfluence * 350);
      
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
  
  // Snow wind interpolation
  startSnowWindInterpolation: function() {
    const self = this;
    
    function interpolateWind() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      
      const lerpFactor = 0.03;
      self.shared.currentWindForce.x += (self.shared.targetWindForce.x - self.shared.currentWindForce.x) * lerpFactor;
      self.shared.currentWindForce.y += (self.shared.targetWindForce.y - self.shared.currentWindForce.y) * lerpFactor;
      
      requestAnimationFrame(interpolateWind);
    }
    
    interpolateWind();
  },
  
  // Snow wind system
  startSnowWindSystem: function() {
    const self = this;
    
    function createGust() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      
      const minGust = 0.1;
      const maxGust = 0.8;
      const gustStrength = minGust + Math.random() * (maxGust - minGust);
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.shared.targetWindForce.x = gustStrength * gustDirection;
      
      const gustDuration = 3000 + Math.random() * 3000;
      
      setTimeout(() => {
        self.shared.targetWindForce.x = 0;
      }, gustDuration);
      
      const nextGust = 4000 + Math.random() * 6000;
      self.shared.windGustInterval = setTimeout(createGust, nextGust);
    }
    
    self.shared.windGustInterval = setTimeout(createGust, 3000);
  },
  
  // Santa sleigh system
  startSantaSleighSystem: function() {
    const self = this;
    
    function spawnSleigh() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      
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
        if (giftDropCount < 5 && document.body.classList.contains('bg-love-snow')) {
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
  
  // Drop gift from sleigh
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
