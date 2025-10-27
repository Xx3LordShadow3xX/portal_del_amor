# Para Mi Cati Hermosa 💗

A beautiful, romantic interactive website with music player and dynamic weather effects.

## 📁 Project Structure

```
/ (root)
├─ index.html              # Main HTML structure
├─ README.md               # This file
│
├─ /css/
│   ├─ styles.css         # General page layout, typography, buttons, UI components
│   └─ themes.css         # Weather themes, backgrounds, particle effects, animations
│
├─ /js/
│   ├─ main.js            # Main application initialization and UI event handlers
│   ├─ music.js           # Music player system (playlist, controls, shuffle/sequence)
│   └─ weather.js         # Weather system (heart rain, love snow, clouds, particles)
│
├─ /songs/
│   └─ (MP3 files)        # Music playlist files
│
└─ /assets/ (optional)
    └─ (Images, icons)    # Additional media resources
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
Edit the gradient backgrounds in `css/themes.css`:

```css
body.bg-your-theme {
  background: linear-gradient(-45deg, #color1, #color2, #color3, #color4, #color1);
  background-size: 400% 400%;
}
```

### Adjusting Weather Effects
Modify particle settings in `js/weather.js`:
- `maxParticles`: Maximum number of particles on screen
- Particle sizes, speeds, and colors in respective weather functions

## 🔧 Technical Details

### Module Structure

**main.js** - Entry point
- Initializes all systems
- Handles DOM element references
- Sets up UI interactions (heart button, mouse trail)

**music.js** - Music player module
- Manages playlist and playback state
- Handles all music controls
- Implements shuffle/sequence logic
- Auto-advances to next track

**weather.js** - Weather system module
- Controls weather effects and animations
- Manages particle systems
- Handles wind simulation
- Controls background layers (clouds, rain, mountains)

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
- `WeatherSystem.startHeartRain()` - Heart rain effect
- `WeatherSystem.startLoveSnow()` - Love snow effect
- `WeatherSystem.stopAllWeather()` - Clean up all effects
- `WeatherSystem.createClouds()` - Generate cloud layer
- `WeatherSystem.startWindGustSystem()` - Wind simulation

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

Potential additions for remaining weather effects:
- **Rose Petals**: Falling rose petals with romantic pink theme
- **Cherry Blossoms**: Sakura petals with spring aesthetic
- **Starry Romance**: Night sky with shooting stars
- **Sunny Bliss**: Warm sunshine with lens flare effects

Additional features to consider:
- Volume control slider
- Progress bar for current song
- Playlist display panel
- Save weather preference to localStorage (if deployed outside Claude.ai)
- Additional particle effects
- Sound effects for weather changes

## 💡 Tips

1. **Music Files**: Ensure all MP3 files are in the correct folder with exact filenames
2. **Performance**: Reduce `maxParticles` if experiencing lag
3. **Weather Menu**: Click weather button to open/close menu
4. **Mobile**: Touch interactions work the same as mouse clicks

## 🐛 Troubleshooting

**Music won't play:**
- Check browser console for errors
- Verify MP3 file paths are correct
- Ensure browser allows audio autoplay (user interaction required)

**Weather effects not showing:**
- Check browser console for JavaScript errors
- Ensure all JS files are loaded in correct order
- Verify CSS files are properly linked

**Performance issues:**
- Reduce particle count in weather.js
- Close other browser tabs
- Disable weather effects temporarily

## 📄 License

This is a personal romantic project. Feel free to use and modify for personal purposes! 💕

## 🙏 Credits

- Font: Google Fonts (Dancing Script, Poppins)
- Design: Custom glassmorphism and gradient animations
- Music: Personal playlist selection

---

Made with 💗 for Cati

**Enjoy the music and the weather of love! 🎵☁️💕**
