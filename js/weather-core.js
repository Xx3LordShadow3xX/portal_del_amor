/* ========================================
   WEATHER SYSTEM CORE
   Main coordinator for all weather effects
   ======================================== */

const WeatherSystem = {
  // DOM Elements (will be set in main.js)
  weatherBtn: null,
  weatherMenu: null,
  cloudLayer: null,
  rainBackground: null,
  alpineScene: null,
  
  // State
  currentWeather: 'clear-sky',
  isWeatherMenuOpen: false,
  
  // Shared resources for weather modules
  shared: {
    activeWeatherParticles: [],
    weatherAnimationFrames: [],
    maxParticles: 50,
    currentWindForce: { x: 0, y: 0 },
    targetWindForce: { x: 0, y: 0 },
    windGustInterval: null
  },
  
  // Initialize weather system
  init: function(elements) {
    this.weatherBtn = elements.weatherBtn;
    this.weatherMenu = elements.weatherMenu;
    this.cloudLayer = elements.cloudLayer;
    this.rainBackground = elements.rainBackground;
    this.alpineScene = elements.alpineScene;
    
    this.attachEventListeners();
    
    // Start with clear sky
    ClearSky.start(this.shared);
  },
  
  // Attach event listeners
  attachEventListeners: function() {
    // Weather button click
    this.weatherBtn.addEventListener('click', () => {
      this.isWeatherMenuOpen = !this.isWeatherMenuOpen;
      
      if (this.isWeatherMenuOpen) {
        this.weatherMenu.classList.add('active');
      } else {
        this.weatherMenu.classList.remove('active');
      }
      
      this.weatherBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.weatherBtn.style.transform = '';
      }, 150);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isWeatherMenuOpen && 
          !this.weatherMenu.contains(e.target) && 
          !this.weatherBtn.contains(e.target)) {
        this.weatherMenu.classList.remove('active');
        this.isWeatherMenuOpen = false;
      }
    });
    
    // Weather option selection
    const weatherOptions = document.querySelectorAll('.weather-option');
    weatherOptions.forEach(option => {
      option.addEventListener('click', () => {
        const weatherType = option.dataset.weather;
        
        // Update selection
        weatherOptions.forEach(opt => {
          opt.classList.remove('selected');
          if (weatherType === 'clear-sky') {
            opt.classList.add('dimmed');
          } else {
            opt.classList.remove('dimmed');
          }
        });
        
        option.classList.add('selected');
        option.classList.remove('dimmed');
        
        // Update current weather
        this.currentWeather = weatherType;
        
        // Update button icon
        const icon = option.querySelector('.weather-icon').textContent;
        this.weatherBtn.textContent = icon;
        
        console.log('Weather changed to:', weatherType);
        
        // Apply weather effect
        this.applyWeatherEffect(weatherType);
      });
    });
  },
  
  // Stop all weather animations
  stopAllWeather: function() {
    // Stop all active weather systems
    ClearSky.stop();
    HeartRain.stop(this.shared, this.cloudLayer, this.rainBackground);
    LoveSnow.stop(this.shared, this.cloudLayer, this.rainBackground, this.alpineScene);
    RosePetals.stop(this.shared, this.cloudLayer, this.rainBackground);
    
    // Clear shared state
    this.shared.weatherAnimationFrames.forEach(id => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.shared.weatherAnimationFrames = [];
    
    if (this.shared.windGustInterval) {
      clearInterval(this.shared.windGustInterval);
      this.shared.windGustInterval = null;
    }
    this.shared.currentWindForce = { x: 0, y: 0 };
    this.shared.targetWindForce = { x: 0, y: 0 };
    
    this.shared.activeWeatherParticles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.shared.activeWeatherParticles = [];
    
    // Clean up any remaining particles
    document.querySelectorAll('.splash-particle').forEach(p => p.remove());
    document.querySelectorAll('.gift-particle').forEach(g => g.remove());
  },
  
  // Apply weather effect
  applyWeatherEffect: function(weatherType) {
    this.stopAllWeather();
    
    // Update body background class
    document.body.classList.remove(
      'bg-heart-rain', 'bg-love-snow', 'bg-rose-petals', 
      'bg-cherry-blossoms', 'bg-starry-romance', 'bg-sunny-bliss', 'bg-clear-sky'
    );
    
    document.body.classList.add(`bg-${weatherType}`);
    
    // Start appropriate weather
    switch(weatherType) {
      case 'heart-rain':
        HeartRain.start(this.shared, this.cloudLayer, this.rainBackground);
        break;
      case 'love-snow':
        LoveSnow.start(this.shared, this.cloudLayer, this.rainBackground, this.alpineScene);
        break;
      case 'rose-petals':
        RosePetals.start(this.shared, this.cloudLayer, this.rainBackground);
        break;
      case 'clear-sky':
        ClearSky.start(this.shared);
        break;
      default:
        console.log(`Weather type "${weatherType}" not yet implemented`);
    }
  }
};
