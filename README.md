# portal_del_amor

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
playlist
