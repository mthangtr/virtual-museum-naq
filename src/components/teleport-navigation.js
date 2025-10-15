/**
 * Teleport Navigation Component
 * Provides accessible point-and-click teleportation for navigation
 * Useful for users who prefer or require non-continuous movement
 *
 * Features:
 * - Raycasting to detect valid teleport targets
 * - Visual arc/trajectory preview
 * - Ground markers for target location
 * - Smooth camera transition to target
 * - Accessibility-friendly
 *
 * Usage:
 * <a-entity teleport-navigation="enabled: true"></a-entity>
 */

AFRAME.registerComponent('teleport-navigation', {
  schema: {
    enabled: { type: 'boolean', default: false },
    activationKey: { type: 'string', default: 'KeyT' }, // T for teleport
    maxDistance: { type: 'number', default: 10 }, // meters
    transitionDuration: { type: 'number', default: 800 }, // milliseconds
    curveHeight: { type: 'number', default: 2 }, // arc height
    showCursor: { type: 'boolean', default: true },
    validColor: { type: 'color', default: '#4ECDC4' },
    invalidColor: { type: 'color', default: '#FF6B6B' }
  },

  init: function () {
    this.camera = null;
    this.rig = null;
    this.isActive = false;
    this.isTeleporting = false;
    this.targetPosition = null;
    this.isValidTarget = false;

    // Raycaster for ground detection
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = this.data.maxDistance;

    // Bind event handlers
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);

    // Setup event listeners
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('click', this.onClick);

    // Create visual elements
    this.createVisualElements();

    // Get camera and rig after scene loads
    this.el.sceneEl.addEventListener('loaded', () => {
      this.camera = document.querySelector('[camera]') || document.querySelector('#camera');
      this.rig = document.querySelector('#rig') || this.camera?.parentNode;

      if (!this.camera) {
        console.warn('[Teleport Nav] Camera not found');
      }
      if (!this.rig) {
        console.warn('[Teleport Nav] Rig not found');
      }
    });

    console.log('[Teleport Nav] Component initialized');
  },

  createVisualElements: function () {
    // Create cursor marker (target location indicator)
    this.cursorMarker = document.createElement('a-entity');
    this.cursorMarker.setAttribute('geometry', {
      primitive: 'circle',
      radius: 0.5
    });
    this.cursorMarker.setAttribute('material', {
      color: this.data.validColor,
      shader: 'flat',
      opacity: 0.7,
      transparent: true
    });
    this.cursorMarker.setAttribute('rotation', '-90 0 0');
    this.cursorMarker.setAttribute('visible', 'false');

    // Add pulsing animation
    this.cursorMarker.setAttribute('animation', {
      property: 'scale',
      from: '1 1 1',
      to: '1.2 1.2 1.2',
      dur: 1000,
      dir: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Create arc line (trajectory indicator)
    this.arcLine = document.createElement('a-entity');
    this.arcLine.setAttribute('line', {
      start: '0 0 0',
      end: '0 0 -5',
      color: this.data.validColor,
      opacity: 0.6
    });
    this.arcLine.setAttribute('visible', 'false');

    // Add to scene
    this.el.sceneEl.appendChild(this.cursorMarker);
    this.el.sceneEl.appendChild(this.arcLine);

    // Create UI hint
    this.createUIHint();
  },

  createUIHint: function () {
    this.uiHint = document.createElement('div');
    this.uiHint.id = 'teleport-hint';
    this.uiHint.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      background: rgba(78, 205, 196, 0.9);
      color: white;
      border-radius: 5px;
      font-family: 'Noto Sans', Arial, sans-serif;
      font-size: 16px;
      font-weight: bold;
      display: none;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    this.uiHint.textContent = 'Click to teleport';

    document.body.appendChild(this.uiHint);
  },

  onKeyDown: function (evt) {
    if (!this.data.enabled) return;
    if (this.isTeleporting) return;

    if (evt.code === this.data.activationKey) {
      this.activateTeleportMode();
    }
  },

  onKeyUp: function (evt) {
    if (evt.code === this.data.activationKey) {
      this.deactivateTeleportMode();
    }
  },

  onMouseMove: function (evt) {
    if (!this.isActive) return;
    if (!this.camera) return;

    this.updateTeleportTarget(evt);
  },

  onClick: function (evt) {
    if (!this.isActive) return;
    if (!this.isValidTarget) return;
    if (this.isTeleporting) return;

    this.executeTeleport();
  },

  activateTeleportMode: function () {
    if (this.isActive) return;

    this.isActive = true;

    // Show visual elements
    if (this.data.showCursor && this.cursorMarker) {
      this.cursorMarker.setAttribute('visible', 'true');
    }

    if (this.arcLine) {
      this.arcLine.setAttribute('visible', 'true');
    }

    if (this.uiHint) {
      this.uiHint.style.display = 'block';
    }

    // Emit event
    this.el.sceneEl.emit('teleport-mode-active');

    console.log('[Teleport Nav] Teleport mode activated');
  },

  deactivateTeleportMode: function () {
    if (!this.isActive) return;

    this.isActive = false;

    // Hide visual elements
    if (this.cursorMarker) {
      this.cursorMarker.setAttribute('visible', 'false');
    }

    if (this.arcLine) {
      this.arcLine.setAttribute('visible', 'false');
    }

    if (this.uiHint) {
      this.uiHint.style.display = 'none';
    }

    // Emit event
    this.el.sceneEl.emit('teleport-mode-inactive');

    console.log('[Teleport Nav] Teleport mode deactivated');
  },

  updateTeleportTarget: function (evt) {
    if (!this.camera) return;

    // Get mouse position in normalized device coordinates
    const canvas = this.el.sceneEl.canvas;
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2();

    mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(mouse, this.camera.object3DMap.camera);

    // Check for intersections with ground/floor
    const intersects = this.raycaster.intersectObjects(
      this.el.sceneEl.object3D.children,
      true
    );

    if (intersects.length > 0) {
      // Find first valid ground intersection
      for (let i = 0; i < intersects.length; i++) {
        const intersect = intersects[i];

        // Check if it's a ground/floor object (has specific component or tag)
        const el = intersect.object.el;
        if (el && (el.hasAttribute('ground') || el.hasAttribute('floor') ||
                   intersect.object.name === 'ground' ||
                   intersect.object.geometry.type === 'PlaneGeometry')) {

          this.targetPosition = intersect.point;
          this.isValidTarget = true;

          // Check distance
          const distance = this.camera.object3D.position.distanceTo(this.targetPosition);
          if (distance > this.data.maxDistance) {
            this.isValidTarget = false;
          }

          break;
        }
      }
    } else {
      this.isValidTarget = false;
    }

    // Update visuals
    this.updateVisuals();
  },

  updateVisuals: function () {
    if (!this.targetPosition) return;

    const color = this.isValidTarget ? this.data.validColor : this.data.invalidColor;

    // Update cursor position and color
    if (this.cursorMarker) {
      this.cursorMarker.object3D.position.copy(this.targetPosition);
      this.cursorMarker.setAttribute('material', 'color', color);
    }

    // Update arc line
    if (this.arcLine && this.camera) {
      const start = this.camera.object3D.position.clone();
      const end = this.targetPosition.clone();

      // Create arc curve
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      midPoint.y += this.data.curveHeight;

      this.arcLine.setAttribute('line', {
        start: `${start.x} ${start.y} ${start.z}`,
        end: `${end.x} ${end.y} ${end.z}`,
        color: color
      });
    }

    // Update UI hint
    if (this.uiHint) {
      if (this.isValidTarget) {
        this.uiHint.textContent = 'Click to teleport';
        this.uiHint.style.background = 'rgba(78, 205, 196, 0.9)';
      } else {
        this.uiHint.textContent = 'Invalid location';
        this.uiHint.style.background = 'rgba(255, 107, 107, 0.9)';
      }
    }
  },

  executeTeleport: function () {
    if (!this.targetPosition || !this.rig) return;

    this.isTeleporting = true;

    console.log('[Teleport Nav] Teleporting to:', this.targetPosition);

    // Get current and target positions
    const startPos = this.rig.object3D.position.clone();
    const endPos = this.targetPosition.clone();
    endPos.y = this.rig.object3D.position.y; // Maintain height

    // Emit event
    this.el.sceneEl.emit('teleport-start', {
      from: startPos,
      to: endPos
    });

    // Animate transition using GSAP (if available) or manual lerp
    if (window.gsap) {
      gsap.to(this.rig.object3D.position, {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration: this.data.transitionDuration / 1000,
        ease: 'power2.inOut',
        onComplete: () => {
          this.onTeleportComplete();
        }
      });
    } else {
      // Fallback: instant teleport
      this.rig.object3D.position.copy(endPos);
      this.onTeleportComplete();
    }

    // Play teleport sound
    this.el.sceneEl.emit('play-sfx', { sound: 'teleport' });

    // Deactivate teleport mode
    this.deactivateTeleportMode();
  },

  onTeleportComplete: function () {
    this.isTeleporting = false;

    // Emit event
    this.el.sceneEl.emit('teleport-complete', {
      position: this.rig.object3D.position.clone()
    });

    console.log('[Teleport Nav] Teleport complete');
  },

  toggle: function () {
    this.data.enabled = !this.data.enabled;

    if (!this.data.enabled) {
      this.deactivateTeleportMode();
    }

    console.log('[Teleport Nav] Toggled:', this.data.enabled);
  },

  remove: function () {
    // Remove event listeners
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('click', this.onClick);

    // Remove visual elements
    if (this.cursorMarker && this.cursorMarker.parentNode) {
      this.cursorMarker.parentNode.removeChild(this.cursorMarker);
    }

    if (this.arcLine && this.arcLine.parentNode) {
      this.arcLine.parentNode.removeChild(this.arcLine);
    }

    if (this.uiHint && this.uiHint.parentNode) {
      this.uiHint.parentNode.removeChild(this.uiHint);
    }
  }
});

console.log('[Teleport Nav] Component registered');
