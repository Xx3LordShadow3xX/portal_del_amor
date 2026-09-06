/* ========================================
   CLEAR SKY WEATHER MODULE
   Twinkling stars on animated gradient
   ======================================== */

const ClearSky = {
  starSpawnInterval: null,
  initialStarTimeouts: [],
  shared: null,

  // Start clear sky weather
  start: function(sharedState) {
    this.shared = sharedState;
    console.log('Starting Clear Sky weather');

    // Initial stars, staggered up to 4s out. Timeout ids are tracked and
    // cleared in stop() — otherwise switching away from Clear Sky within
    // that window leaves them to fire later and drop stray .bg-star
    // elements onto <body> regardless of whatever weather is now active.
    for (let i = 0; i < 8; i++) {
      const id = setTimeout(() => {
        // Defense in depth: stop() clears these on switch-away, but also
        // guard here in case one was already queued to run.
        if (!document.body.classList.contains('bg-clear-sky')) return;
        this.createBackgroundStar();
      }, i * 500);
      this.initialStarTimeouts.push(id);
    }

    // Start continuous star spawning
    this.startStarSpawning();
  },

  // Stop clear sky weather
  stop: function() {
    if (this.starSpawnInterval) {
      clearInterval(this.starSpawnInterval);
      this.starSpawnInterval = null;
    }
    this.initialStarTimeouts.forEach(id => clearTimeout(id));
    this.initialStarTimeouts = [];
    document.querySelectorAll('.bg-star').forEach(star => star.remove());
    console.log('Clear Sky weather stopped');
  },
  
  // Create background stars
  createBackgroundStar: function() {
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
  
  // Start star spawning interval
  startStarSpawning: function() {
    if (this.starSpawnInterval) {
      clearInterval(this.starSpawnInterval);
    }
    
    this.starSpawnInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        this.createBackgroundStar();
      }
    }, 2000);
  }
};
