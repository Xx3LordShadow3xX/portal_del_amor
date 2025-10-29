# Para Mi Cati Hermosa 💗

A beautiful, romantic interactive website with music player and dynamic weather effects.

## 📁 Project Structure

```
/ (root)
├─ index.html              # Main HTML structure
├─ README.md               # This file
│
├─ /css/
│   ├─ styles.css          # General page layout, typography, buttons, UI components
│   ├─ weather-base.css    # Base weather styles (shared particles, clouds, animations)
│   ├─ themes.css          # Placeholder weather theme backgrounds
│   └─ /weather/           # Individual weather-specific styles
│       ├─ clear-sky.css   # Clear sky styles (stars)
│       ├─ heart-rain.css  # Heart rain styles (rain streaks, splash effects)
│       └─ love-snow.css   # Love snow styles (alpine scene, Santa, gifts)
│
├─ /js/
│   ├─ main.js             # Main application initialization and UI event handlers
│   ├─ music.js            # Music player system (playlist, controls, shuffle/sequence)
│   ├─ weather-core.js     # Weather system coordinator (manages all weather modules)
│   └─ /weather/           # Individual weather modules
│       ├─ clear-sky.js    # Clear sky weather logic (twinkling stars)
│       ├─ heart-rain.js   # Heart rain weather logic (falling hearts, wind, splash)
│       └─ love-snow.js    # Love snow weather logic (snowfall, alpine scene, Santa)
│
├─ /songs/
│   └─ (MP3 files)         # Music playlist files
│
└─ /assets/ (optional)
    └─ (Images, icons)     # Additional media resources
```

## 🎵 Features

### Music Player
- 15-song romantic playlist
- Play/Pause with smooth fade effects
- Previous/Next track navigation
- Shuffle and Sequence modes
- Skip forward/backward 15 seconds
- Auto-play next song when current ends
- Visual feedback on all controls

### Weather System
Choose from 7 romantic weather effects:
1. **Clear Sky** ☁️ - Default animated gradient with twinkling stars
2. **Heart Rain** 💗 - Falling hearts with wind gusts, rain streaks, and splash effects
3. **Love Snow** ❄️ - Gentle snowflakes with alpine mountain scene and Santa sleigh
4. **Rose Petals** 🌹 - (Placeholder for future implementation)
5. **Cherry Blossoms** 🌸 - (Placeholder for future implementation)
6. **Starry Romance** ✨ - (Placeholder for future implementation)
7. **Sunny Bliss** ☀️ - (Placeholder for future implementation)

### Interactive Elements
- Mouse trail hearts following cursor
- Falling hearts on button click
- Glassmorphism UI design
- Smooth animations and transitions
- Fully responsive design

## 🚀 Setup Instructions

1. **Clone or download** this project
2. **Organize your files** according to the structure above
3. **Add your music files** to the `/songs/` folder
4. **Update file paths** in `music.js` if your song filenames differ
5. **Open `index.html`** in a modern web browser

## 🎨 Customization

### Adding New Songs
Edit the `playlist` array in `js/music.js`:

```javascript
playlist: [
  { title: "Song Name - Artist", src: "songs/filename.mp3" },
  // Add more songs here
]
```

### Changing Colors
Edit the gradient backgrounds in individual weather CSS files:
- Clear Sky: `css/weather/clear-sky.css`
- Heart Rain: `css/weather/heart-rain.css`
- Love Snow: `css/weather/love-snow.css`

### Adjusting Weather Effects
Modify particle settings in individual weather JS modules:
- Clear Sky: `js/weather/clear-sky.js`
- Heart Rain: `js/weather/heart-rain.js`
- Love Snow: `js/weather/love-snow.js`

Each module has its own `start()` and `stop()` functions for clean weather transitions.

## 🔧 Technical Details

### Module Structure

**main.js** - Entry point
- Initializes all systems
- Handles DOM element references
- Sets up UI interactions (heart button, mouse trail)

**music.js** - Music player module (standalone)
- Manages playlist and playback state
- Handles all music controls
- Implements shuffle/sequence logic
- Auto-advances to next track

**weather-core.js** - Weather system coordinator
- Manages weather menu and button interactions
- Coordinates weather transitions
- Maintains shared state (particles, wind, etc.)
- Delegates to individual weather modules

**weather/clear-sky.js** - Clear sky weather module
- Spawns twinkling stars
- Manages star animation lifecycle

**weather/heart-rain.js** - Heart rain weather module
- Creates falling heart particles with 3 depth layers
- Implements wind gust system
- Generates rain streak background
- Creates cloud layer
- Handles splash effects on landing

**weather/love-snow.js** - Love snow weather module
- Creates snowfall particles with 3 depth layers
- Builds alpine mountain scene
- Spawns Santa sleigh with reindeers
- Handles gift dropping from sleigh
- Manages snow clouds and fog

### Key Functions

#### Music Player
- `MusicPlayer.init()` - Initialize player with DOM elements
- `MusicPlayer.playSong()` - Play current song
- `MusicPlayer.pauseSong()` - Pause with fade out
- `MusicPlayer.getNextSong()` - Calculate next song (shuffle/sequence)
- `MusicPlayer.updateSongTitle()` - Update display

#### Weather System
- `WeatherSystem.init()` - Initialize weather system
- `WeatherSystem.applyWeatherEffect()` - Switch weather themes
- `WeatherSystem.stopAllWeather()` - Clean up all effects
- `ClearSky.start()` / `ClearSky.stop()` - Start/stop clear sky
- `HeartRain.start()` / `HeartRain.stop()` - Start/stop heart rain
- `LoveSnow.start()` / `LoveSnow.stop()` - Start/stop love snow

### Modular Design Benefits

✅ **Separation of Concerns**: Each weather effect is self-contained  
✅ **Easy to Extend**: Add new weather types by creating new modules  
✅ **Maintainable**: Small, focused files instead of one large file  
✅ **Clean Transitions**: Each module handles its own cleanup  
✅ **Shared Resources**: Common state managed by weather-core

## 🌐 Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Note:** Requires JavaScript enabled and audio autoplay permissions.

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- Desktop: > 768px
- Mobile: ≤ 768px

Mobile optimizations include:
- Smaller button sizes
- Adjusted font sizes
- Repositioned floating weather button
- Compact weather menu

## 🎯 Future Enhancements

### Remaining Weather Effects
To implement new weather types, create:
1. New CSS file in `css/weather/[name].css`
2. New JS module in `js/weather/[name].js`
3. Add background gradient to `css/themes.css`
4. Update `weather-core.js` to call new module

Potential weather effects:
- **Rose Petals**: Falling rose petals with romantic pink theme
- **Cherry Blossoms**: Sakura petals with spring aesthetic
- **Starry Romance**: Night sky with shooting stars
- **Sunny Bliss**: Warm sunshine with lens flare effects

### Additional Features
- Volume control slider
- Progress bar for current song
- Playlist display panel
- Additional particle effects
- Sound effects for weather changes
- Day/night cycle for Love Snow (aurora borealis, blizzards)

## 💡 Tips

1. **Music Files**: Ensure all MP3 files are in the correct folder with exact filenames
2. **Performance**: Weather modules automatically limit particles to 50 max
3. **Weather Menu**: Click weather button to open/close menu
4. **Mobile**: Touch interactions work the same as mouse clicks
5. **Module Loading**: Script order in `index.html` is critical - don't rearrange!

## 🐛 Troubleshooting

**Music won't play:**
- Check browser console for errors
- Verify MP3 file paths are correct
- Ensure browser allows audio autoplay (user interaction required)

**Weather effects not showing:**
- Check browser console for JavaScript errors
- Verify all JS files are loaded in correct order
- Ensure CSS files are properly linked
- Check that weather modules are in correct folders

**Performance issues:**
- Each weather module has built-in particle limits
- Close other browser tabs
- Temporarily switch to Clear Sky weather

**Module errors:**
- Ensure folder structure matches exactly: `js/weather/` and `css/weather/`
- Verify all files are uploaded to correct locations
- Check that old `js/weather.js` file is deleted

## 📄 License

This is a personal romantic project. Feel free to use and modify for personal purposes! 💕

## 🙏 Credits

- Font: Google Fonts (Dancing Script, Poppins)
- Design: Custom glassmorphism and gradient animations
- Music: Personal playlist selection
- Architecture: Modular weather system for scalability

---

Made with 💗 for Cati

**Enjoy the music and the weather of love! 🎵☁️💕**
