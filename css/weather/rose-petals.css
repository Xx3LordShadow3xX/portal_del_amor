/* ========================================
   ROSE PETALS WEATHER MODULE
   Falling rose petals with flutter motion and ground accumulation
   ======================================== */

const RosePetals = {
  shared: null,
  cloudLayer: null,
  rainBackground: null,
  windGustInterval: null,
  groundPetals: [],
  maxGroundPetals: 25,
  
  // Rose colors - reds, pinks, whites
  petalColors: [
    '#DC143C', '#C71585', '#FF1493', // Deep reds/magentas
    '#FF69B4', '#FFB6C1', '#FFC0CB', // Pinks
    '#FFF5F7', '#FFE4E9', '#FFEEF2', // Whites with pink tint
    '#8B0000', '#A52A2A', '#B22222'  // Dark reds
  ],
  
  petalShapes: ['🌹'],
  
  // Start rose petals weather
  start: function(sharedState, cloudLayer, rainBackground) {
    this.shared = sharedState;
    this.cloudLayer = cloudLayer;
    this.rainBackground = rainBackground;
    
    console.log('🌹 Starting Rose Petals weather');
    
    // Setup sparkle layer using cloudLayer
    this.cloudLayer.style.display = 'block';
    this.createSparkles();
    
    // Setup ground layer using rainBackground
    this.rainBackground.style.display = 'block';
    this.createInitialGroundPetals();
    
    // Start wind system
    this.startWindSystem();
    this.startWindInterpolation();
    
    // Start petal spawning
    this.spawnLoop();
  },
  
  // Stop rose petals weather
  stop: function(sharedState, cloudLayer, rainBackground) {
    console.log('🌹 Rose Petals weather stopped');
    
    // Clean up wind
    if (this.windGustInterval) {
      clearInterval(this.windGustInterval);
      this.windGustInterval = null;
    }
    
    // Clean up layers
    if (this.cloudLayer) {
      this.cloudLayer.innerHTML = '';
      this.cloudLayer.style.display = 'none';
    }
    
    if (this.rainBackground) {
      this.rainBackground.innerHTML = '';
      this.rainBackground.style.display = 'none';
    }
    
    // Clear ground petals
    document.querySelectorAll('.ground-petal').forEach(p => p.remove());
    this.groundPetals = [];
  },
  
  // Create sparkle particles
  createSparkles: function() {
    this.cloudLayer.innerHTML = '';
    
    const sparkleCount = 12;
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('sparkle-particle');
      
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.bottom = '0';
      
      const duration = 8 + Math.random() * 6;
      sparkle.style.animationDuration = duration + 's';
      sparkle.style.animationDelay = -(Math.random() * duration) + 's';
      
      const drift = (Math.random() - 0.5) * 100;
      sparkle.style.setProperty('--sparkle-drift', drift + 'px');
      
      this.cloudLayer.appendChild(sparkle);
    }
  },
  
  // Create initial ground petals
  createInitialGroundPetals: function() {
    const initialCount = 15;
    
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => {
        this.addGroundPetal(
          Math.random() * window.innerWidth,
          Math.random() * 360,
          this.petalColors[Math.floor(Math.random() * this.petalColors.length)]
        );
      }, i * 150);
    }
  },
  
  // Add petal to ground layer
  addGroundPetal: function(x, rotation, color) {
    // Remove oldest if at max
    if (this.groundPetals.length >= this.maxGroundPetals) {
      const oldest = this.groundPetals.shift();
      if (oldest && oldest.parentNode) {
        oldest.remove();
      }
    }
    
    const petal = document.createElement('div');
    petal.classList.add('ground-petal');
    petal.textContent = '🌹';
    petal.style.left = x + 'px';
    petal.style.fontSize = (15 + Math.random() * 15) + 'px';
    petal.style.color = color;
    petal.style.setProperty('--rotation', rotation + 'deg');
    
    this.rainBackground.appendChild(petal);
    this.groundPetals.push(petal);
    
    // Add settled animation after fade in
    setTimeout(() => {
      petal.classList.add('settled');
    }, 2000);
  },
  
  // Spawn loop for falling petals
  spawnLoop: function() {
    const self = this;
    
    function loop() {
      if (document.body.classList.contains('bg-rose-petals')) {
        self.createPetal();
        
        const nextSpawn = 150 + Math.random() * 200;
        const timeoutId = setTimeout(loop, nextSpawn);
        self.shared.weatherAnimationFrames.push(timeoutId);
      }
    }
    
    loop();
  },
  
  // Create falling rose petal
  createPetal: function() {
    if (this.shared.activeWeatherParticles.length >= this.shared.maxParticles) return;
    
    const petal = document.createElement('div');
    petal.classList.add('rose-petal');
    
    // Determine layer and properties
    const layerRandom = Math.random();
    let layer, size, speed, opacity;
    
    if (layerRandom < 0.3) {
      // Far layer
      layer = 'far';
      size = 12 + Math.random() * 8;
      speed = 8000 + Math.random() * 4000;
      opacity = 0.5 + Math.random() * 0.2;
    } else if (layerRandom < 0.65) {
      // Mid layer
      layer = 'mid';
      size = 20 + Math.random() * 15;
      speed = 6000 + Math.random() * 3000;
      opacity = 0.7 + Math.random() * 0.2;
    } else {
      // Close layer
      layer = 'close';
      size = 35 + Math.random() * 20;
      speed = 5000 + Math.random() * 2000;
      opacity = 0.85 + Math.random() * 0.15;
    }
    
    petal.classList.add(layer);
    
    const color = this.petalColors[Math.floor(Math.random() * this.petalColors.length)];
    const shape = this.petalShapes[Math.floor(Math.random() * this.petalShapes.length)];
    
    petal.textContent = shape;
    petal.style.fontSize = size + 'px';
    petal.style.color = color;
    petal.style.opacity = opacity;
    
    const startX = Math.random() * window.innerWidth;
    petal.style.left = startX + 'px';
    petal.style.top = '-100px';
    
    // Base horizontal drift
    const baseDrift = (Math.random() - 0.5) * 200;
    
    // Rotation
    const rotationStart = Math.random() * 360;
    const rotationEnd = rotationStart + (Math.random() * 360);
    
    document.body.appendChild(petal);
    this.shared.activeWeatherParticles.push(petal);
    
    const petalData = {
      element: petal,
      startX: startX,
      baseDrift: baseDrift,
      speed: speed,
      startTime: Date.now(),
      layer: layer,
      color: color
    };
    
    this.animatePetal(petalData, rotationStart, rotationEnd, opacity, size);
  },
  
  // Animate petal with flutter motion
  animatePetal: function(petalData, rotationStart, rotationEnd, opacity, size) {
    const self = this;
    const { element, startX, baseDrift, speed, startTime, layer, color } = petalData;
    let animationComplete = false;
    
    function updatePetal() {
      if (animationComplete || !document.body.classList.contains('bg-rose-petals')) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / speed, 1);
      
      if (progress >= 1) {
        animationComplete = true;
        
        // 30% chance to add to ground if close layer
        if (layer === 'close' && Math.random() > 0.7) {
          const rect = element.getBoundingClientRect();
          self.addGroundPetal(rect.left + rect.width / 2, rotationEnd % 360, color);
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
      
      // Wind influence based on layer
      const windInfluence = layer === 'far' ? 0.4 : (layer === 'mid' ? 0.7 : 1.0);
      const totalDrift = baseDrift + (self.shared.currentWindForce.x * windInfluence * 250);
      
      // Gentle fall easing
      const easedProgress = 1 - Math.pow(1 - progress, 1.5);
      
      // FLUTTER MOTION - Key feature!
      // Dual sine waves for realistic side-to-side wobble
      const flutterFreq1 = 2.5;
      const flutterFreq2 = 4;
      const flutterAmp = layer === 'far' ? 20 : (layer === 'mid' ? 35 : 50);
      const flutter = 
        Math.sin(progress * Math.PI * flutterFreq1) * flutterAmp +
        Math.sin(progress * Math.PI * flutterFreq2) * (flutterAmp * 0.3);
      
      // Calculate position
      const currentY = easedProgress * (window.innerHeight + 150);
      const currentX = progress * totalDrift + flutter;
      const currentRotation = rotationStart + (rotationEnd - rotationStart) * progress;
      
      // Fade in/out
      let currentOpacity = opacity;
      if (progress < 0.1) {
        currentOpacity = opacity * (progress / 0.1);
      } else if (progress > 0.85) {
        currentOpacity = opacity * ((1 - progress) / 0.15);
      }
      
      element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg)`;
      element.style.opacity = currentOpacity;
      
      requestAnimationFrame(updatePetal);
    }
    
    updatePetal();
  },
  
  // Wind interpolation
  startWindInterpolation: function() {
    const self = this;
    
    function interpolateWind() {
      if (!document.body.classList.contains('bg-rose-petals')) return;
      
      const lerpFactor = 0.04;
      self.shared.currentWindForce.x += (self.shared.targetWindForce.x - self.shared.currentWindForce.x) * lerpFactor;
      
      requestAnimationFrame(interpolateWind);
    }
    
    interpolateWind();
  },
  
  // Wind gust system - gentle breeze
  startWindSystem: function() {
    const self = this;
    
    function createGust() {
      if (!document.body.classList.contains('bg-rose-petals')) return;
      
      const minGust = 0.1;
      const maxGust = 0.6;
      const gustStrength = minGust + Math.random() * (maxGust - minGust);
      const gustDirection = Math.random() > 0.5 ? 1 : -1;
      
      self.shared.targetWindForce.x = gustStrength * gustDirection;
      
      const gustDuration = 2500 + Math.random() * 2500;
      
      setTimeout(() => {
        self.shared.targetWindForce.x = 0;
      }, gustDuration);
      
      const nextGust = 5000 + Math.random() * 5000;
      self.windGustInterval = setTimeout(createGust, nextGust);
    }
    
    self.windGustInterval = setTimeout(createGust, 3000);
  }
};
