# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bảo tàng Ảo Nguyễn Ái Quốc** (The Virtual Museum of Nguyễn Ái Quốc) is a web-based 3D interactive educational experience that guides users through the historical journey of Nguyễn Ái Quốc (later known as Hồ Chí Minh) from 1911 to 1930, leading to the founding of the Communist Party of Vietnam.

- **Platform**: Web-based (browser)
- **Technology**: A-Frame 1.4.0 (WebXR/Three.js wrapper)
- **Genre**: 3D Virtual Museum Explorer
- **Duration**: 8-12 minutes
- **Language**: Vietnamese (primary)

## Development Commands

### Local Development Server

Choose one of these options to run the development server:

```bash
# Option 1: Python SimpleHTTPServer
python -m http.server 8000

# Option 2: Node.js http-server (if installed)
npx http-server -p 8000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8000` in your browser.

### Package Management

If using npm for build tools:

```bash
# Install dependencies
npm install

# Run development server (if configured)
npm run dev
```

### Testing

- **Browser testing**: Chrome, Firefox, Safari, Edge
- **Device testing**: Desktop, tablet, mobile
- **Performance monitoring**: Use `<a-scene stats>` for FPS counter
- **Performance targets**:
  - FPS: ≥60 (desktop), ≥30 (mobile)
  - Load time: <8 seconds
  - File size: <50MB total

## Code Architecture

### Multi-Room Navigation System

The museum consists of 5 sequential rooms that users navigate through:

1. **Home Screen** - Entry lobby with welcome message
2. **Room 1 (1911-1919)** - "Khởi hành" (Departure) - Blue/sea themed
3. **Room 2 (1920-1923)** - "Ánh sáng Lênin" (Lenin's Light) - Library themed
4. **Room 3 (1924-1927)** - "Quảng Châu" (Canton) - Classroom themed
5. **Room 4 (1930)** - "Hội nghị Hương Cảng" (Hong Kong Conference) - Meeting room
6. **Ending Room** - "Kỷ nguyên mới" (New Era) - Celebration space

**Navigation Flow**:
- Users must interact with 3/3 objects in each room to unlock the next door
- Doors use visual cues (glowing, arrows) when unlocked
- Room transitions use fade animations (1.5-2 seconds)

### Core Component System

The project uses **A-Frame's component architecture**. Key custom components:

**`room-manager.js`**
- Manages room visibility and state
- Handles preloading of room assets
- Emits events: `room-enter`, `room-exit`, `room-transition-start`, `room-transition-complete`

**`interactive-object.js`**
- Handles hover states (highlight, tooltip)
- Click interactions trigger popups with historical content
- Tracks completion state (3/3 objects per room)
- Audio playback for some interactions

**`door-portal.js`**
- Detects player proximity
- Visual states: locked (gray), unlocked (glowing)
- Keyboard activation (E key)
- Triggers room transitions

**`progress-tracker.js`**
- Tracks objects interacted with per room
- Updates HUD display (e.g., "2/3")
- Emits events when room is complete

**`transition-effect.js`**
- Camera animations between rooms
- Fade effects (fade-to-black, fade-to-color)
- Locks player input during transitions

### File Structure

```
/
├── index.html              # Main entry point
├── src/
│   ├── components/         # A-Frame custom components
│   │   ├── room-manager.js
│   │   ├── interactive-object.js
│   │   ├── door-portal.js
│   │   ├── progress-tracker.js
│   │   └── transition-effect.js
│   ├── scenes/            # Scene configurations per room
│   │   ├── home.js
│   │   ├── room1.js       # 1911-1919 period
│   │   ├── room2.js       # 1920-1923 period
│   │   ├── room3.js       # 1924-1927 period
│   │   ├── room4.js       # 1930 conference
│   │   └── ending.js
│   ├── utils/             # Utility modules
│   │   ├── audio-manager.js
│   │   ├── ui-controller.js
│   │   └── storage.js
│   └── main.js            # Main application logic
├── assets/
│   ├── models/            # 3D models (.glb, .gltf)
│   ├── textures/          # Texture images
│   ├── images/            # UI images, historical photos
│   ├── audio/             # Background music, SFX, voice-over
│   │   ├── bgm/          # Background music per room
│   │   ├── sfx/          # Sound effects (click, door, etc.)
│   │   └── voice/        # Narrator voice-over
│   └── fonts/            # Web fonts (Montserrat, Noto Sans Vietnamese)
├── styles/
│   ├── main.css          # Global styles
│   ├── popup.css         # Modal/popup styles
│   └── hud.css           # HUD overlay styles
└── docs/
    ├── game-concept-design.md    # Complete design document
    └── implementation-plan.md     # 5-week development roadmap
```

### Interactive Object Pattern

All interactive museum objects follow this pattern:

```javascript
AFRAME.registerComponent('interactive-object', {
  schema: {
    objectId: {type: 'string'},       // Unique identifier
    title: {type: 'string'},          // Display name
    description: {type: 'string'},    // Historical content
    image: {type: 'string'},          // Popup image path
    audioFile: {type: 'string'},      // Optional audio
    completed: {type: 'boolean'}      // Interaction state
  },

  // Hover → Highlight + Tooltip + SFX
  // Click → Popup + Mark Complete + Update Progress
  // Auto-unlock door when 3/3 complete
});
```

### UI/UX System

**HUD (Head-Up Display)**:
- Header: Museum name, audio toggle, home button, help icon
- Footer: Current room name, progress (e.g., "2/3"), control hints
- Crosshair: Center screen, changes to yellow when hovering interactive objects

**Popup/Modal System**:
- Semi-transparent background with blur
- White/cream popup box with golden border
- Contains: image, title, description text, quotes, close button
- Fade-in animation (0.3s)
- Locks player movement while open

**Color Scheme**:
- Red (`#C62828`): Communist Party theme, Room 4, CTAs
- Yellow (`#FFD54F`): Highlights, star, light effects
- Cream (`#FFF9E6`): Popup backgrounds
- Blue (`#1976D2`): Room 1 (sea/departure theme)
- Indigo (`#283593`): Room 2 (library/knowledge)
- Orange (`#EF6C00`): Room 3 (training/classroom)

## Asset Optimization

**3D Models**:
- Format: GLB (binary GLTF with Draco compression)
- Polygon count: <5000 tris per model
- Texture size: 512x512 or 1024x1024 max

**Images**:
- Format: WebP (fallback to JPG)
- Quality: 80% compression
- Historical photos in popup modals

**Audio**:
- Background music: MP3, 128kbps, loops per room
- Sound effects: MP3/OGG, 64kbps
- Preload only current room's audio (lazy loading)

**Performance Budget**:
- Total bundle: <50MB
- First room load: <5 seconds
- Frame rate: 60fps (desktop), 30fps minimum (mobile)

## Development Workflow

### Adding a New Interactive Object

1. Create or source the 3D model (`.glb` format)
2. Add model to `/assets/models/`
3. In appropriate room scene file (e.g., `room1.js`):
   - Add `<a-entity>` with model
   - Attach `interactive-object` component
   - Configure schema: `objectId`, `title`, `description`, `image`
4. Create popup image in `/assets/images/`
5. Write historical content (Vietnamese text)
6. Update progress tracker to expect the new object
7. Test interaction flow: hover → click → popup → complete → progress

### Adding a New Room

1. Create scene configuration in `/src/scenes/roomN.js`
2. Define room layout (20m × 15m × 5m standard size)
3. Add 3 interactive objects minimum
4. Configure lighting specific to room theme
5. Set background music in `audio-manager.js`
6. Add door portal to next room
7. Update `room-manager.js` to include new room
8. Create transition effect from previous room

### Modifying UI Popups

Popup templates are in `/styles/popup.css`. Key properties:
- Font: Noto Sans Vietnamese (body), Montserrat (headings)
- Max width: 600px
- Padding: 30px
- Border radius: 10px
- Shadow: `0 10px 40px rgba(0,0,0,0.3)`

## Historical Content Guidelines

All historical content must be:
- **Accurate**: Cross-referenced with official sources (Viện Hồ Chí Minh, Bảo tàng Hồ Chí Minh)
- **Appropriate**: Suitable for educational use (students, general public)
- **Concise**: 2-4 sentences per object description
- **Engaging**: Use quotes from Nguyễn Ái Quốc when possible
- **Vietnamese**: Primary language, with proper diacritics

Key historical periods covered:
- **1911-1919**: Departure from Vietnam, world travels, Versailles petition
- **1920-1923**: Discovery of Leninism, founding of colonial union in France
- **1924-1927**: Canton training center, "Đường Kách mệnh" publication
- **1930**: Hong Kong Conference, founding of Communist Party of Vietnam

## Team Structure (5-Week Development)

Reference `implementation-plan.md` for detailed sprint breakdown:

- **Week 1**: Foundation & Setup (scaffolding, basic 3D, navigation)
- **Week 2**: Core Engine (interactive objects, UI/UX overlay)
- **Week 3**: Content Integration (rooms 1-4, ending)
- **Week 4**: Polish (VFX, audio, transitions)
- **Week 5**: Optimization & Deployment (testing, bug fixes, deployment)

## Deployment

**Recommended platforms**:

1. **GitHub Pages** (free, easy)
   - Push to GitHub repository
   - Enable Pages in Settings
   - Access at `username.github.io/vnr202`

2. **Netlify** (drag-and-drop)
   - Upload folder to Netlify
   - Auto-deploy with custom domain

3. **Vercel** (optimized for modern frameworks)
   - Good analytics and edge functions

## A-Frame Specifics

**Component Registration Pattern**:
```javascript
AFRAME.registerComponent('component-name', {
  schema: { /* properties */ },
  init: function() { /* on creation */ },
  update: function() { /* on property change */ },
  tick: function() { /* every frame */ },
  remove: function() { /* on removal */ }
});
```

**Event System**:
```javascript
// Emit event
this.el.emit('event-name', {data: value});

// Listen to event
this.el.addEventListener('event-name', (evt) => {
  console.log(evt.detail.data);
});
```

**Scene Reference**:
```javascript
// Get scene element
const sceneEl = document.querySelector('a-scene');

// Get camera
const camera = document.querySelector('[camera]');
```

## Common Development Tasks

### Run Tests
Currently manual testing. Checklist:
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Device testing (desktop, tablet, mobile)
- Performance profiling (Chrome DevTools)
- User testing (3-5 people)

### Build for Production
```bash
# Minify assets (if using build tools)
npm run build

# Optimize models
# Use gltf-pipeline or Blender export settings
```

### Debug Performance Issues
1. Enable stats panel: `<a-scene stats>`
2. Check FPS counter (target: 60fps desktop, 30fps mobile)
3. Use Chrome DevTools Performance profiler
4. Check polygon counts (should be <5000 per model)
5. Verify texture sizes (should be power of 2, max 1024x1024)
6. Check audio file sizes (compress to 128kbps or lower)

## Important Notes

- All text content is in **Vietnamese** - maintain proper diacritics and grammar
- Historical accuracy is critical - verify all dates, names, and events
- Mobile support is important but desktop is primary experience
- Accessibility: Ensure text is readable, controls are intuitive
- The game must work offline after initial load (consider service workers)
- Credit historical sources: Viện Hồ Chí Minh, Bảo tàng Hồ Chí Minh

## Resources

- **Design Document**: `game-concept-design.md` - Complete visual, audio, and interaction specifications
- **Implementation Plan**: `implementation-plan.md` - 5-week sprint-based development roadmap
- **A-Frame Docs**: https://aframe.io/docs/
- **Three.js Manual**: https://threejs.org/manual/
- **Historical Reference**: Viện Hồ Chí Minh, Bảo tàng Hồ Chí Minh official materials
