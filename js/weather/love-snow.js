/* ========================================
   LOVE SNOW WEATHER MODULE
   Snowfall · Alpine scene · Santa sleigh · Pine forest · Cabin
   Day/Night cycle · Aurora Borealis · Blizzard system
   ======================================== */

const LoveSnow = {

  // Core references
  shared:       null,
  cloudLayer:   null,
  rainBackground: null,
  alpineScene:  null,

  // Santa
  santaSleighInterval: null,

  // Forest & Christmas lights
  forestTrees:  [],
  litTreeEl:    null,
  lightInterval: null,

  // Cabin
  cabinEl:      null,

  // Day/Night cycle
  skyA:             null,
  skyB:             null,
  currentSkyPhase:  0,       // 0=sunrise, 1=day, 2=sunset, 3=night
  dayNightTimeout:  null,

  // Aurora
  auroraEl: null,

  // Blizzard
  blizzardTimeout:       null,
  blizzardActive:        false,
  blizzardShakeInterval: null,

  // ---- Snow data ----
  snowColors: [
    '#ffffff','#f0f8ff','#e6f2ff','#f5f5ff',
    '#e8e8ff','#fafafa','#f0f0ff','#fdfeff',
    '#f8fbff','#fcfeff'
  ],
  snowShapes: ['❄️','❅','❆','✻','✼','❄','❋'],

  // ---- Sky gradients (sunrise → day → sunset → night) ----
  skyGradients: [
    'linear-gradient(to bottom, #1a0a2e, #a0522d, #e8965a, #ffc17a)',
    'linear-gradient(to bottom, #1565c0, #42a5f5, #81d4fa, #b3e5fc)',
    'linear-gradient(to bottom, #0d0221, #6b1a3a, #bf4040, #e87040)',
    'linear-gradient(to bottom, #020210, #080828, #12124a, #1e1860)'
  ],

  /* ==========================================
     LIFECYCLE
     ========================================== */

  start: function(sharedState, cloudLayer, rainBackground, alpineScene) {
    this.shared        = sharedState;
    this.cloudLayer    = cloudLayer;
    this.rainBackground = rainBackground;
    this.alpineScene   = alpineScene;

    console.log('❄️ Starting Love Snow weather');

    // Sky layers first (they sit behind everything at z-index -1)
    this.createSkyLayers();

    // Alpine scene (mountains, forest, cabin)
    this.alpineScene.classList.add('active');
    this.createAlpineScene();

    // Atmosphere
    this.cloudLayer.style.display = 'block';
    this.createSnowClouds();

    this.rainBackground.style.display = 'block';
    this.createSnowBackground();

    // Systems
    this.startSantaSleighSystem();
    this.startSnowWindSystem();
    this.startSnowWindInterpolation();
    this.startDayNightCycle();
    this.startBlizzardScheduler();

    // Snowfall
    this.spawnLoop();
  },

  stop: function(sharedState, cloudLayer, rainBackground, alpineScene) {
    console.log('❄️ Love Snow weather stopped');

    // Accept passed references so stop() works even if called before start()
    this.cloudLayer     = cloudLayer;
    this.rainBackground = rainBackground;
    this.alpineScene    = alpineScene;

    // Santa
    if (this.santaSleighInterval) { clearTimeout(this.santaSleighInterval); this.santaSleighInterval = null; }
    document.querySelectorAll('.santa-sleigh').forEach(s => s.remove());
    document.querySelectorAll('.gift-particle').forEach(g => g.remove());

    // Lights
    if (this.lightInterval) { clearInterval(this.lightInterval); this.lightInterval = null; }
    this.forestTrees = [];
    this.litTreeEl   = null;

    // Day/Night
    if (this.dayNightTimeout) { clearTimeout(this.dayNightTimeout); this.dayNightTimeout = null; }

    // Aurora
    if (this.auroraEl) { this.auroraEl.remove(); this.auroraEl = null; }

    // Blizzard
    if (this.blizzardTimeout)       { clearTimeout(this.blizzardTimeout);       this.blizzardTimeout = null; }
    if (this.blizzardShakeInterval) { clearInterval(this.blizzardShakeInterval); this.blizzardShakeInterval = null; }
    this.blizzardActive = false;
    document.querySelectorAll('.blizzard-particle').forEach(p => p.remove());
    document.querySelectorAll('.blizzard-overlay').forEach(o => o.remove());

    // Sky layers
    if (this.skyA) { this.skyA.remove(); this.skyA = null; }
    if (this.skyB) { this.skyB.remove(); this.skyB = null; }
    this.currentSkyPhase = 0;

    // DOM layers
    if (this.cloudLayer)     { this.cloudLayer.innerHTML = '';     this.cloudLayer.style.display = 'none'; }
    if (this.rainBackground) { this.rainBackground.innerHTML = ''; this.rainBackground.style.display = 'none'; }
    if (this.alpineScene)    {
      this.alpineScene.innerHTML = '';
      this.alpineScene.style.transform = '';
      this.alpineScene.classList.remove('active');
    }
  },

  /* ==========================================
     SKY LAYERS — Day/Night cross-fade
     Two fixed divs behind everything (z-index: -1).
     We swap which one is opaque to produce smooth gradient transitions.
     ========================================== */

  createSkyLayers: function() {
    this.skyA = document.createElement('div');
    this.skyA.className    = 'ls-sky-layer';
    this.skyA.style.background = this.skyGradients[0];
    this.skyA.style.opacity    = '1';
    document.body.appendChild(this.skyA);

    this.skyB = document.createElement('div');
    this.skyB.className    = 'ls-sky-layer';
    this.skyB.style.background = this.skyGradients[1];
    this.skyB.style.opacity    = '0';
    document.body.appendChild(this.skyB);

    this.currentSkyPhase = 0;
    console.log('🌅 Sky layers created — Sunrise');
  },

  startDayNightCycle: function() {
    const self         = this;
    const PHASE_DUR    = 75000;  // 75 s per phase
    const FADE_DUR     = 3000;   // 3 s cross-fade
    const phaseNames   = ['Sunrise','Day','Sunset','Night'];

    function transitionTo(nextPhase) {
      if (!document.body.classList.contains('bg-love-snow')) return;

      console.log(`🌤️ ${phaseNames[self.currentSkyPhase]} → ${phaseNames[nextPhase]}`);

      const aIsActive   = parseFloat(self.skyA.style.opacity) > 0.5;
      const intoLayer   = aIsActive ? self.skyB : self.skyA;
      const outofLayer  = aIsActive ? self.skyA : self.skyB;

      // Load new gradient into hidden layer, then fade it in
      intoLayer.style.background = self.skyGradients[nextPhase];
      intoLayer.style.opacity    = '1';

      // Fade out old layer once transition completes
      setTimeout(() => { outofLayer.style.opacity = '0'; }, FADE_DUR);

      self.currentSkyPhase = nextPhase;

      // Aurora: show during Night, hide otherwise
      if (nextPhase === 3) {
        setTimeout(() => self.showAurora(), FADE_DUR + 500);
      } else {
        self.hideAurora();
      }

      // Queue next phase
      const next = (nextPhase + 1) % 4;
      self.dayNightTimeout = setTimeout(() => transitionTo(next), PHASE_DUR);
    }

    // First transition after initial phase duration
    self.dayNightTimeout = setTimeout(() => transitionTo(1), PHASE_DUR);
  },

  /* ==========================================
     AURORA BOREALIS
     ========================================== */

  showAurora: function() {
    if (!document.body.classList.contains('bg-love-snow')) return;
    if (this.auroraEl) return;

    console.log('🌌 Aurora Borealis appearing...');
    const aurora = document.createElement('div');
    aurora.className = 'aurora-container';
    aurora.innerHTML = `
      <div class="aurora-wave aurora-wave-1"></div>
      <div class="aurora-wave aurora-wave-2"></div>
      <div class="aurora-wave aurora-wave-3"></div>
    `;
    document.body.appendChild(aurora);
    this.auroraEl = aurora;

    // Double-rAF ensures the element is in the DOM before the transition fires
    requestAnimationFrame(() => requestAnimationFrame(() => aurora.classList.add('visible')));
  },

  hideAurora: function() {
    if (!this.auroraEl) return;
    console.log('🌌 Aurora fading out...');
    const aurora = this.auroraEl;
    aurora.classList.remove('visible');
    this.auroraEl = null;
    setTimeout(() => { if (aurora.parentNode) aurora.remove(); }, 5500);
  },

  /* ==========================================
     ALPINE SCENE
     ========================================== */

  createAlpineScene: function() {
    this.alpineScene.innerHTML = '';
    this.forestTrees = [];

    console.log('🏔️ Creating Alpine Scene');

    // Mountains
    const mountainDefs = [
      { type: 'back',  left: '5%'  }, { type: 'back',  left: '25%' },
      { type: 'mid',   left: '15%' }, { type: 'back',  left: '50%' },
      { type: 'mid',   left: '40%' }, { type: 'front', left: '30%' },
      { type: 'back',  left: '70%' }, { type: 'mid',   left: '65%' },
      { type: 'front', left: '75%' }, { type: 'back',  left: '85%' }
    ];

    mountainDefs.forEach(def => {
      const mountain = document.createElement('div');
      mountain.classList.add('mountain', `mountain-${def.type}`);
      mountain.style.left = def.left;
      const cap = document.createElement('div');
      cap.classList.add('snow-cap');
      mountain.appendChild(cap);
      this.alpineScene.appendChild(mountain);
    });

    // Fog (z-index 10 so it floats above trees)
    for (let i = 0; i < 8; i++) {
      const fog = document.createElement('div');
      fog.classList.add('mountain-fog');
      fog.style.width  = (200 + Math.random() * 150) + 'px';
      fog.style.height = (60  + Math.random() * 40)  + 'px';
      fog.style.bottom = (20  + Math.random() * 200) + 'px';
      fog.style.left   = (Math.random() * 100) + '%';
      fog.style.zIndex = '10';
      const dur = 40 + Math.random() * 30;
      fog.style.animationDuration = dur + 's';
      fog.style.animationDelay   = -(Math.random() * dur) + 's';
      this.alpineScene.appendChild(fog);
    }

    // Pine forest
    this.createPineForest();

    // Cabin (rendered after trees so it appears in front)
    this.createCabin();

    // Light a Christmas tree 3 seconds after scene builds
    const self = this;
    setTimeout(() => self.startChristmasTreeLights(), 3000);
  },

  /* ==========================================
     PINE FOREST
     ========================================== */

  createPineForest: function() {
    const count = 16 + Math.floor(Math.random() * 9); // 16-24 trees
    console.log(`🌲 Generating ${count} pine trees`);

    for (let i = 0; i < count; i++) {
      // Spread across screen with a small random jitter per slot
      const slotPct = 2 + (i / count) * 95;
      const leftPct = slotPct + (Math.random() - 0.5) * 7;
      this.createPineTree(Math.max(1, Math.min(98, leftPct)));
    }
  },

  createPineTree: function(leftPct) {
    const depth    = Math.random();               // 0=far, 1=near
    const scale    = 0.38 + depth * 0.9;          // 0.38 – 1.28
    const blur     = (1 - depth) * 5;             // far trees blurred
    const zIdx     = Math.floor(depth * 6);        // 0–5
    const swayDur  = (3 + Math.random() * 4).toFixed(1) + 's';
    const swayOff  = -(Math.random() * 8).toFixed(1) + 's';

    // Atmospheric perspective: distant trees are darker/muted
    const l1 = Math.round(12 + depth * 18);
    const l2 = Math.round(16 + depth * 18);
    const l3 = Math.round(22 + depth * 18);

    const tree = document.createElement('div');
    tree.className = 'pine-tree';
    tree.style.left   = leftPct + '%';
    tree.style.zIndex = zIdx;
    tree.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
    tree.style.setProperty('--tree-scale', scale);
    tree.style.setProperty('--sway-dur',   swayDur);
    tree.style.setProperty('--sway-off',   swayOff);
    tree.style.setProperty('--f-dark',  `hsl(140,45%,${l1}%)`);
    tree.style.setProperty('--f-mid',   `hsl(140,50%,${l2}%)`);
    tree.style.setProperty('--f-light', `hsl(140,55%,${l3}%)`);

    tree.innerHTML = `
      <div class="pine-trunk"></div>
      <div class="pine-layer pine-layer-3"></div>
      <div class="pine-layer pine-layer-2"></div>
      <div class="pine-layer pine-layer-1"></div>
    `;

    this.alpineScene.appendChild(tree);
    this.forestTrees.push(tree);
  },

  /* ==========================================
     CHRISTMAS TREE LIGHTS
     ========================================== */

  startChristmasTreeLights: function() {
    if (this.forestTrees.length === 0) return;

    // Remove lights from previous tree
    if (this.litTreeEl) {
      this.litTreeEl.querySelectorAll('.christmas-light').forEach(l => l.remove());
      this.litTreeEl = null;
    }
    if (this.lightInterval) { clearInterval(this.lightInterval); this.lightInterval = null; }

    // Pick a random tree
    const tree = this.forestTrees[Math.floor(Math.random() * this.forestTrees.length)];
    this.litTreeEl = tree;

    // 9 light positions relative to tree container (110px wide, centered at x=55)
    // Distributed across 3 foliage layers
    const positions = [
      { x: 18, b: 50 }, { x: 55, b: 42 }, { x: 92, b: 50 },   // layer-3
      { x: 26, b: 84 }, { x: 55, b: 77 }, { x: 84, b: 84 },   // layer-2
      { x: 36, b: 112 },{ x: 74, b: 112 },                     // layer-1
      { x: 55, b: 145 }                                          // tip
    ];
    const palette = ['#ff2200','#00cc00','#1166ff','#ffcc00','#ff00bb'];

    positions.forEach((pos, i) => {
      const light = document.createElement('div');
      light.className = 'christmas-light';
      light.style.left   = pos.x + 'px';
      light.style.bottom = pos.b + 'px';
      light.style.background  = palette[i % palette.length];
      light.style.boxShadow   = `0 0 6px 3px ${palette[i % palette.length]}99`;
      light.style.animationDelay = (i * 0.3) + 's';
      light.dataset.ci = i % palette.length;
      tree.appendChild(light);
    });

    console.log('🎄 Christmas lights lit');

    // Cycle colors every 2.5 s
    let cycle = 0;
    const self = this;
    this.lightInterval = setInterval(() => {
      if (!self.litTreeEl) return;
      cycle++;
      self.litTreeEl.querySelectorAll('.christmas-light').forEach(light => {
        const ci = (parseInt(light.dataset.ci) + cycle) % palette.length;
        light.style.background = palette[ci];
        light.style.boxShadow  = `0 0 6px 3px ${palette[ci]}99, 0 0 14px 5px ${palette[ci]}44`;
      });
    }, 2500);
  },

  /* ==========================================
     CABIN
     ========================================== */

  createCabin: function() {
    const cabin = document.createElement('div');
    cabin.className  = 'snow-cabin';
    cabin.style.left   = '23%';
    cabin.style.bottom = '14%';

    cabin.innerHTML = `
      <img src="assets/cabin.png" alt="Cozy Cabin" class="cabin-img">
      <div class="cabin-smoke-stack">
        <div class="smoke-puff" style="--smoke-delay:0s"></div>
        <div class="smoke-puff" style="--smoke-delay:1s"></div>
        <div class="smoke-puff" style="--smoke-delay:2s"></div>
      </div>
      <div class="cabin-window-glow"></div>
    `;

    this.alpineScene.appendChild(cabin);
    this.cabinEl = cabin;
    console.log('🏡 Cabin placed');
  },

  /* ==========================================
     SNOW CLOUDS
     ========================================== */

  createSnowClouds: function() {
    this.cloudLayer.innerHTML = '';
    const count = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const cloud = document.createElement('div');
      cloud.classList.add('weather-cloud');
      const sz = Math.random();
      cloud.classList.add(sz < 0.2 ? 'small' : sz < 0.5 ? 'medium' : 'large');
      cloud.style.top  = (Math.random() * 140) + 'px';
      cloud.style.left = (Math.random() * window.innerWidth) + 'px';
      const dur = 20 + Math.random() * 20;
      cloud.style.animationDuration = dur + 's';
      cloud.style.animationDelay   = -(Math.random() * dur) + 's';
      cloud.style.opacity = 0.5 + Math.random() * 0.2;
      this.cloudLayer.appendChild(cloud);
    }
  },

  /* ==========================================
     SNOW BACKGROUND
     ========================================== */

  createSnowBackground: function() {
    this.rainBackground.innerHTML = '';
    for (let i = 0; i < 100; i++) {
      const p = document.createElement('div');
      p.classList.add('snow-bg-particle');
      p.style.left = Math.random() * 100 + '%';
      const dur  = 4 + Math.random() * 6;
      const size = 2 + Math.random() * 2;
      p.style.animationDuration = dur + 's';
      p.style.animationDelay   = -(Math.random() * dur) + 's';
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      this.rainBackground.appendChild(p);
    }
  },

  /* ==========================================
     SNOW PARTICLE SPAWN LOOP
     ========================================== */

  spawnLoop: function() {
    const self = this;
    function loop() {
      if (document.body.classList.contains('bg-love-snow')) {
        if (!self.blizzardActive) self.createSnowParticle();
        const id = setTimeout(loop, 150 + Math.random() * 250);
        self.shared.weatherAnimationFrames.push(id);
      }
    }
    loop();
  },

  createSnowParticle: function() {
    if (this.shared.activeWeatherParticles.length >= this.shared.maxParticles) return;

    const p = document.createElement('div');
    p.classList.add('weather-particle');

    const r = Math.random();
    let layer, size, blur, speed, opacity;
    if (r < 0.35) {
      layer = 'far';   size = 8  + Math.random() * 8;  blur = 4 + Math.random() * 2;
      speed = 10000 + Math.random() * 5000; opacity = 0.25 + Math.random() * 0.2;
    } else if (r < 0.7) {
      layer = 'mid';   size = 16 + Math.random() * 12; blur = 1.5 + Math.random() * 1.5;
      speed = 6000  + Math.random() * 3000; opacity = 0.45 + Math.random() * 0.25;
    } else {
      layer = 'close'; size = 28 + Math.random() * 22; blur = 0;
      speed = 4000  + Math.random() * 2000; opacity = 0.7  + Math.random() * 0.3;
    }

    p.classList.add(layer);
    const shape = this.snowShapes[Math.floor(Math.random() * this.snowShapes.length)];
    const color = this.snowColors[Math.floor(Math.random() * this.snowColors.length)];
    p.textContent  = shape;
    p.style.fontSize = size + 'px';
    p.style.color    = color;
    p.style.filter   = `blur(${blur}px) drop-shadow(0 0 ${blur * 3}px rgba(200,220,255,0.8))`;
    p.style.opacity  = opacity;

    const startX = Math.random() * window.innerWidth;
    p.style.left = startX + 'px';
    p.style.top  = '-100px';

    const baseDrift    = (Math.random() - 0.5) * 300;
    const rotStart     = Math.random() * 360;
    const rotEnd       = rotStart + (Math.random() * 240 - 120);

    document.body.appendChild(p);
    this.shared.activeWeatherParticles.push(p);
    this.animateSnowParticle({ element: p, startX, baseDrift, speed, startTime: Date.now(), layer },
                              rotStart, rotEnd, opacity);
  },

  animateSnowParticle: function(data, rotStart, rotEnd, opacity) {
    const self = this;
    const { element, baseDrift, speed, startTime, layer } = data;
    let done = false;

    function tick() {
      if (done || !document.body.classList.contains('bg-love-snow')) return;
      const progress = Math.min((Date.now() - startTime) / speed, 1);

      if (progress >= 1) {
        done = true;
        if (element.parentNode) element.parentNode.removeChild(element);
        const idx = self.shared.activeWeatherParticles.indexOf(element);
        if (idx > -1) self.shared.activeWeatherParticles.splice(idx, 1);
        return;
      }

      const wi      = layer === 'far' ? 0.5 : layer === 'mid' ? 0.8 : 1.2;
      const drift   = baseDrift + self.shared.currentWindForce.x * wi * 350;
      const eased   = 1 - Math.pow(1 - progress, 2);
      const amp     = layer === 'far' ? 15 : layer === 'mid' ? 30 : 45;
      const sway    = Math.sin(progress * Math.PI * (2 + (layer === 'close' ? 1 : 0))) * amp * (1 - progress * 0.3)
                    + Math.cos(progress * Math.PI * 3.5) * amp * 0.4;

      const y   = eased * (window.innerHeight + 120);
      const x   = progress * drift + sway;
      const rot = rotStart + (rotEnd - rotStart) * progress;
      let   op  = opacity;
      if      (progress < 0.2)  op = opacity * (progress / 0.2);
      else if (progress > 0.85) op = opacity * ((1 - progress) / 0.15);

      element.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
      element.style.opacity   = op;
      requestAnimationFrame(tick);
    }
    tick();
  },

  /* ==========================================
     WIND SYSTEM
     ========================================== */

  startSnowWindInterpolation: function() {
    const self = this;
    function lerp() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      self.shared.currentWindForce.x += (self.shared.targetWindForce.x - self.shared.currentWindForce.x) * 0.03;
      self.shared.currentWindForce.y += (self.shared.targetWindForce.y - self.shared.currentWindForce.y) * 0.03;
      requestAnimationFrame(lerp);
    }
    lerp();
  },

  startSnowWindSystem: function() {
    const self = this;
    function gust() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      const strength = 0.1 + Math.random() * 0.7;
      const dir      = Math.random() > 0.5 ? 1 : -1;
      self.shared.targetWindForce.x = strength * dir;
      setTimeout(() => { self.shared.targetWindForce.x = 0; }, 3000 + Math.random() * 3000);
      self.shared.windGustInterval = setTimeout(gust, 4000 + Math.random() * 6000);
    }
    self.shared.windGustInterval = setTimeout(gust, 3000);
  },

  /* ==========================================
     SANTA SLEIGH
     ========================================== */

  startSantaSleighSystem: function() {
    const self = this;
    function spawn() {
      if (!document.body.classList.contains('bg-love-snow')) return;
      if (self.blizzardActive) { self.santaSleighInterval = setTimeout(spawn, 20000); return; }

      console.log('🎅 Santa inbound!');
      const sleigh = document.createElement('div');
      sleigh.classList.add('santa-sleigh');
      sleigh.innerHTML = `
        <img src="assets/santa-sleigh.png" alt="Santa Sleigh" class="sleigh-img">
        <img src="assets/reindeer.png" alt="Reindeer" class="reindeer-img">
        <img src="assets/reindeer.png" alt="Reindeer" class="reindeer-img">
        <img src="assets/reindeer.png" alt="Reindeer" class="reindeer-img">
      `;
      document.body.appendChild(sleigh);
      setTimeout(() => sleigh.classList.add('active'), 100);

      let drops = 0;
      const gi = setInterval(() => {
        if (drops < 6 && document.body.classList.contains('bg-love-snow')) { self.dropGift(sleigh); drops++; }
        else clearInterval(gi);
      }, 5000);

      setTimeout(() => sleigh.remove(), 36000);
      self.santaSleighInterval = setTimeout(spawn, 60000 + Math.random() * 60000);
    }
    self.santaSleighInterval = setTimeout(spawn, 12000);
  },

  dropGift: function(sleigh) {
    const gift = document.createElement('div');
    gift.classList.add('gift-particle');
    gift.innerHTML = `<div class="gift-box"><div class="gift-ribbon"></div></div>`;
    const img  = sleigh.querySelector('.sleigh-img');
    const rect = img.getBoundingClientRect();
    gift.style.left = (rect.left + rect.width / 2) + 'px';
    gift.style.top  = (rect.top  + rect.height)    + 'px';
    gift.style.setProperty('--fall-x', ((Math.random() - 0.5) * 100) + 'px');
    document.body.appendChild(gift);
    gift.style.animation = 'giftFall 4s ease-in forwards';
    setTimeout(() => gift.remove(), 4000);
  },

  /* ==========================================
     BLIZZARD SYSTEM
     ========================================== */

  startBlizzardScheduler: function() {
    const self  = this;
    const delay = 120000 + Math.random() * 180000; // 2–5 min first blizzard
    console.log(`🌨️ First blizzard in ${Math.round(delay / 1000)}s`);
    self.blizzardTimeout = setTimeout(() => self.triggerBlizzard(), delay);
  },

  triggerBlizzard: function() {
    if (!document.body.classList.contains('bg-love-snow')) return;
    if (this.blizzardActive) return;

    const self     = this;
    const duration = 8000 + Math.random() * 4000;
    this.blizzardActive = true;
    console.log(`🌨️ BLIZZARD! (${Math.round(duration / 1000)}s)`);

    // 1 — White overlay
    const overlay = document.createElement('div');
    overlay.className = 'blizzard-overlay';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('active')));

    // 2 — 300 horizontal particles
    for (let i = 0; i < 300; i++) {
      const bp = document.createElement('div');
      bp.className = 'blizzard-particle';
      bp.style.setProperty('--by',      (Math.random() * 110 - 5)       + 'vh');
      bp.style.setProperty('--dur',     (0.35 + Math.random() * 0.85)   + 's');
      bp.style.setProperty('--del',     (Math.random() * 2.5)            + 's');
      bp.style.setProperty('--drift-y', ((Math.random() - 0.5) * 70)    + 'px');
      bp.style.setProperty('--op',      (0.35 + Math.random() * 0.65).toFixed(2));
      bp.style.width  = (1 + Math.random() * 4) + 'px';
      bp.style.height = (1 + Math.random() * 1.5) + 'px';
      document.body.appendChild(bp);
    }

    // 3 — Alpine scene shake
    this.blizzardShakeInterval = setInterval(() => {
      if (!self.alpineScene) return;
      const dx = (Math.random() - 0.5) * 5;
      const dy = (Math.random() - 0.5) * 3;
      const dr = (Math.random() - 0.5) * 0.8;
      self.alpineScene.style.transform = `translate(${dx}px,${dy}px) rotate(${dr}deg)`;
    }, 80);

    // 4 — Blow Santa away
    const santa = document.querySelector('.santa-sleigh.active');
    if (santa) {
      santa.style.transition = 'transform 1.5s cubic-bezier(0.55,0,1,0.45), opacity 1.5s ease';
      santa.style.transform  = 'translateX(130vw) rotate(720deg) scale(0.05)';
      santa.style.opacity    = '0';
      setTimeout(() => santa.remove(), 1600);
    }

    // 5 — Remove Christmas tree lights
    if (this.litTreeEl)  this.litTreeEl.querySelectorAll('.christmas-light').forEach(l => l.remove());
    if (this.lightInterval) { clearInterval(this.lightInterval); this.lightInterval = null; }
    this.litTreeEl = null;

    // 6 — Hide aurora temporarily
    const hadAurora = !!this.auroraEl;
    if (hadAurora) this.hideAurora();

    // 7 — End blizzard
    setTimeout(() => self.endBlizzard(overlay, hadAurora), duration);
  },

  endBlizzard: function(overlay, restoreAurora) {
    const self = this;
    console.log('🌨️ Blizzard clearing...');

    if (this.blizzardShakeInterval) { clearInterval(this.blizzardShakeInterval); this.blizzardShakeInterval = null; }
    if (this.alpineScene) this.alpineScene.style.transform = '';

    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 1500);

    document.querySelectorAll('.blizzard-particle').forEach(p => p.remove());
    this.blizzardActive = false;

    // Restore aurora if still in night phase
    if (restoreAurora && this.currentSkyPhase === 3) {
      setTimeout(() => self.showAurora(), 2000);
    }

    // Re-light a Christmas tree
    setTimeout(() => {
      if (document.body.classList.contains('bg-love-snow')) self.startChristmasTreeLights();
    }, 2000);

    // Schedule next blizzard
    const next = 120000 + Math.random() * 180000;
    console.log(`⏰ Next blizzard in ${Math.round(next / 1000)}s`);
    this.blizzardTimeout = setTimeout(() => self.triggerBlizzard(), next);
  }
};
