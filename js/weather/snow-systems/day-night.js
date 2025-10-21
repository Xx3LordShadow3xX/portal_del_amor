/* ========================================
   SNOW - DAY/NIGHT CYCLE SYSTEM
   5-minute cycle: sunrise → day → sunset → night
   ======================================== */

const SnowDayNight = {
  cycleInterval: null,
  currentPhase: 'day',
  phases: ['sunrise', 'day', 'sunset', 'night'],
  currentPhaseIndex: 1,
  
  start: function() {
    console.log('🌅 Day/Night cycle started');
    
    // Set initial phase
    document.body.classList.add('time-day');
    this.currentPhase = 'day';
    
    // Change phase every 75 seconds (5 min / 4 phases)
    this.cycleInterval = setInterval(() => {
      this.changePhase();
    }, 75000);
  },
  
  stop: function() {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
    }
    
    document.body.classList.remove('time-sunrise', 'time-day', 'time-sunset', 'time-night');
  },
  
  changePhase: function() {
    if (WeatherCore.currentWeather !== 'love-snow') return;
    
    const phase = this.phases[this.currentPhaseIndex];
    this.currentPhase = phase;
    
    // Remove all time classes
    document.body.classList.remove('time-sunrise', 'time-day', 'time-sunset', 'time-night');
    
    // Add current phase class
    document.body.classList.add(`time-${phase}`);
    
    console.log(`🌅 Time changed to: ${phase}`);
    
    // Notify aurora system
    if (phase === 'night') {
      if (typeof SnowAurora !== 'undefined') SnowAurora.show();
    } else if (phase === 'sunrise') {
      if (typeof SnowAurora !== 'undefined') SnowAurora.hide();
    }
    
    // Move to next phase
    this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phases.length;
  },
  
  getCurrentPhase: function() {
    return this.currentPhase;
  }
};
