/* ========================================
   CLEAR SKY WEATHER MODULE
   Twinkling stars on animated gradient
   ======================================== */

const ClearSky = {
  starSpawnInterval: null,
  shared: null,
  
  // Start clear sky weather
  start: function(sharedState) {
    this.shared = sharedState;
    console.log('Starting Clear Sky weather');
    
    // Initial stars
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createBackgroundStar(), i * 500);
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
