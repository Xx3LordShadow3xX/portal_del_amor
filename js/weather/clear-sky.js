/* ========================================
   CLEAR SKY WEATHER
   Twinkling stars animation
   ======================================== */

const ClearSkyWeather = {
  starSpawnInterval: null,
  
  start: function() {
    console.log('☁️ Clear sky weather started');
    this.startStarSpawning();
    
    // Create initial stars
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.createStar(), i * 500);
    }
  },
  
  stop: function() {
    if (this.starSpawnInterval) {
      clearInterval(this.starSpawnInterval);
      this.starSpawnInterval = null;
    }
    document.querySelectorAll('.bg-star').forEach(star => star.remove());
  },
  
  createStar: function() {
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
      if (Math.random() > 0.7) {
        this.createStar();
      }
    }, 2000);
  }
};
