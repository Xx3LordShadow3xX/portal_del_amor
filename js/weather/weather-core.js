/* ========================================
   WEATHER CORE SYSTEM
   Manages weather switching and common utilities
   ======================================== */

const WeatherCore = {
  // DOM Elements
  weatherBtn: null,
  weatherMenu: null,
  cloudLayer: null,
  rainBackground: null,
  alpineScene: null,
  
  // State
  currentWeather: 'clear-sky',
  isWeatherMenuOpen: false,
  
  // Initialize
  init: function(elements) {
    this.weatherBtn = elements.weatherBtn;
    this.weatherMenu = elements.weatherMenu;
    this.cloudLayer = elements.cloudLayer;
    this.rainBackground = elements.rainBackground;
    this.alpineScene = elements.alpineScene;
    
    this.attachEventListeners();
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
        
        // Update selection UI
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
        
        // Update button icon
        const icon = option.querySelector('.weather-icon').textContent;
        this.weatherBtn.textContent = icon;
        
        // Apply weather
        this.changeWeather(weatherType);
      });
    });
  },
  
  // Change weather
  changeWeather: function(weatherType) {
    console.log(`🌈 Changing weather to: ${weatherType}`);
    
    // Stop current weather
    this.stopAllWeather();
    
    // Update current weather
    this.currentWeather = weatherType;
    
    // Remove all background classes
    document.body.classList.remove(
      'bg-heart-rain', 'bg-love-snow', 'bg-rose-petals', 
      'bg-cherry-blossoms', 'bg-starry-romance', 'bg-sunny-bliss', 'bg-clear-sky',
      'time-sunrise', 'time-day', 'time-sunset', 'time-night'
    );
    
    // Add new background class
    document.body.classList.add(`bg-${weatherType}`);
    
    // Start new weather
    switch(weatherType) {
      case 'clear-sky':
        if (typeof ClearSkyWeather !== 'undefined') {
          ClearSkyWeather.start();
        }
        break;
      case 'heart-rain':
        if (typeof HeartRainWeather !== 'undefined') {
          HeartRainWeather.start();
        }
        break;
      case 'love-snow':
        if (typeof LoveSnowWeather !== 'undefined') {
          LoveSnowWeather.start();
        }
        break;
    }
  },
  
  // Stop all weather
  stopAllWeather: function() {
    // Stop all weather modules
    if (typeof ClearSkyWeather !== 'undefined') {
      ClearSkyWeather.stop();
    }
    if (typeof HeartRainWeather !== 'undefined') {
      HeartRainWeather.stop();
    }
    if (typeof LoveSnowWeather !== 'undefined') {
      LoveSnowWeather.stop();
    }
    
    // Clean up DOM
    this.cloudLayer.innerHTML = '';
    this.cloudLayer.style.display = 'none';
    
    this.rainBackground.innerHTML = '';
    this.rainBackground.style.display = 'none';
    
    this.alpineScene.innerHTML = '';
    this.alpineScene.classList.remove('active');
    
    // Remove all particles
    document.querySelectorAll('.weather-particle, .splash-particle, .trail-heart, .bg-star').forEach(el => el.remove());
    document.querySelectorAll('.santa-sleigh, .gift-particle').forEach(el => el.remove());
    document.querySelectorAll('.aurora-container, .blizzard-overlay').forEach(el => el.remove());
    document.querySelectorAll('.pine-tree, .cabin-container').forEach(el => el.remove());
    
    document.body.classList.remove('blizzard-active');
  },
  
  // Get DOM elements for weather modules
  getElements: function() {
    return {
      cloudLayer: this.cloudLayer,
      rainBackground: this.rainBackground,
      alpineScene: this.alpineScene
    };
  }
};
