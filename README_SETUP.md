# Virtual Museum of Nguyễn Ái Quốc - Setup Guide

## Sprint 1 Complete! 🎉

This document provides instructions for running the development server and testing the Phase 1, Sprint 1 deliverables.

---

## Quick Start

### Prerequisites
- Node.js v18+ installed
- Modern web browser (Chrome, Firefox, Edge recommended)

### Installation

1. **Navigate to project directory:**
   ```bash
   cd D:\Workspace\other\virtual-museum-naq
   ```

2. **Dependencies are already installed via CDN** (no npm install needed for core A-Frame)
   - But http-server is available locally if needed

---

## Running the Development Server

### Option 1: http-server (Recommended)
```bash
npm run dev
```
This will start the server at `http://localhost:8000`

### Option 2: Python SimpleHTTPServer
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## Accessing the Application

Once the server is running, open your browser and navigate to:
```
http://localhost:8000
```

---

## Sprint 1 Features ✅

### T1.1: Project Setup
- ✅ Complete folder structure created
- ✅ npm initialized with proper package.json
- ✅ .gitignore configured
- ✅ LICENSE file (MIT)

### T1.2: Core Dependencies
- ✅ A-Frame 1.4.0 (via CDN)
- ✅ A-Frame Extras (movement controls)
- ✅ A-Frame Environment Component
- ✅ A-Frame Particle System
- ✅ GSAP 3.12.2 (animations)
- ✅ http-server (local dev server)

### T1.3: Basic HTML Structure
- ✅ Proper HTML5 structure
- ✅ A-Frame scene with sky and ground
- ✅ Test objects (boxes, sphere) for verification
- ✅ CSS styling foundation

### T1.4: WASD Movement Controls
- ✅ movement-controls component integrated
- ✅ Speed: 0.15 (adjust as needed)
- ✅ Ground-based movement (no flying)
- ✅ Works with keyboard WASD keys

### T1.5: Camera & Look Controls
- ✅ First-person camera setup
- ✅ FOV: 75°
- ✅ Mouse look controls (360° rotation)
- ✅ Pointer lock enabled
- ✅ Touch/mobile support enabled

### T1.6: Lighting System
- ✅ Ambient light (intensity: 0.6)
- ✅ Directional light with shadows (intensity: 0.8)
- ✅ Hemisphere light (sky/ground gradient)
- ✅ Lighting config JSON for future rooms

### T1.7: Development Server
- ✅ http-server configured
- ✅ npm script: `npm run dev`
- ✅ Setup documentation (this file)

---

## Testing the Sprint 1 Deliverable

### Expected Behavior:
1. **Scene loads** with blue sky and green ground
2. **Three test objects** visible:
   - Red box (rotated 45°) at center
   - Cyan box to the right
   - Yellow sphere to the left
3. **WASD movement** works:
   - W: Forward
   - A: Left
   - S: Backward
   - D: Right
4. **Mouse look** works:
   - Move mouse to look around 360°
   - Click to enable pointer lock
5. **FPS counter** visible (stats panel in top-left)
6. **Shadows** visible under objects

### Performance Targets:
- **Desktop:** 60 FPS
- **Mobile:** 30 FPS minimum
- **Load time:** < 3 seconds (for this simple scene)

---

## Folder Structure

```
virtual-museum-naq/
├── assets/
│   ├── audio/
│   │   ├── bgm/
│   │   ├── sfx/
│   │   └── voice/
│   ├── fonts/
│   ├── images/
│   ├── models/
│   └── textures/
├── docs/
│   ├── game-concept-design.md
│   └── implementation-plan.md
├── src/
│   ├── components/      # A-Frame custom components (Sprint 2+)
│   ├── scenes/          # Room configurations (Sprint 3+)
│   └── utils/
│       └── lighting-config.json
├── styles/
│   └── main.css
├── .gitignore
├── CLAUDE.md
├── index.html           # Main entry point
├── LICENSE
├── package.json
├── README.md
└── README_SETUP.md      # This file
```

---

## Troubleshooting

### Issue: Scene not loading
- **Solution:** Check browser console for errors. Ensure CDN links are accessible.

### Issue: Movement not working
- **Solution:** Click inside the scene to enable pointer lock. Check that WASD keys aren't being captured by browser.

### Issue: FPS is low
- **Solution:** Close other tabs/applications. Check browser hardware acceleration is enabled.

### Issue: http-server command not found
- **Solution:** Run `npm install` to install local dependencies, or use Python/VS Code alternatives.

### Issue: CDN scripts not loading
- **Solution:** Check internet connection. CDN URLs should be accessible.

---

## Browser Compatibility

### Fully Supported:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+ (macOS/iOS)

### Mobile:
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ⚠️ Performance may be limited on older devices

---

## Next Steps (Sprint 2)

Sprint 2 will focus on:
1. **T2.1:** Room Manager Component
2. **T2.2:** Door/Portal System
3. **T2.3:** Camera Transition Animations
4. **T2.4:** Mobile Touch Controls
5. **T2.5:** Performance Profiling
6. **T2.6:** Input System Refactor

---

## Resources

- **A-Frame Documentation:** https://aframe.io/docs/
- **A-Frame School:** https://aframe.io/aframe-school/
- **Three.js Docs:** https://threejs.org/docs/
- **Project Design Doc:** `docs/game-concept-design.md`
- **Implementation Plan:** `docs/implementation-plan.md`

---

## Team

**Project:** Virtual Museum of Nguyễn Ái Quốc
**Sprint:** Phase 1, Sprint 1
**Status:** ✅ Complete
**Date:** October 2025

---

## Controls Reference

### Keyboard:
- **W** - Move forward
- **A** - Move left
- **S** - Move backward
- **D** - Move right
- **Mouse** - Look around (click to lock pointer)
- **ESC** - Release pointer lock

### Mobile:
- **Touch drag** - Look around
- **On-screen joystick** - Move (Sprint 2)

---

**Happy developing! 🚀**
