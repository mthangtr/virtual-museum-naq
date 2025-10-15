/**
 * Mobile Touch Controls Component
 * Provides virtual joystick and touch-based camera controls for mobile devices
 *
 * Features:
 * - Virtual joystick for movement (left side)
 * - Touch drag for camera look (right side)
 * - Auto-hide on desktop
 * - Responsive UI
 *
 * Usage:
 * <a-entity mobile-touch-controls></a-entity>
 */

AFRAME.registerComponent('mobile-touch-controls', {
  schema: {
    enabled: { type: 'boolean', default: true },
    movementSpeed: { type: 'number', default: 3.5 },
    lookSensitivity: { type: 'number', default: 0.003 },
    joystickSize: { type: 'number', default: 100 }, // pixels
    autoHideDesktop: { type: 'boolean', default: true }
  },

  init: function () {
    // Check if mobile device
    this.isMobile = this.checkMobile();

    if (this.data.autoHideDesktop && !this.isMobile) {
      console.log('[Mobile Touch] Desktop detected - disabling mobile controls');
      return;
    }

    this.camera = null;
    this.rig = null;

    // Touch state
    this.touches = {
      movement: null,
      look: null
    };

    // Movement state
    this.moveVector = new THREE.Vector2(0, 0);
    this.lookDelta = new THREE.Vector2(0, 0);

    // Bind event handlers
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    // Create UI elements
    this.createUI();

    // Setup event listeners
    this.setupEventListeners();

    console.log('[Mobile Touch] Controls initialized');
  },

  checkMobile: function () {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for mobile devices
    if (/android/i.test(userAgent)) return true;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return true;

    // Check for touch capability
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      // Also check screen size
      return window.innerWidth <= 1024;
    }

    return false;
  },

  createUI: function () {
    // Create UI container
    this.uiContainer = document.createElement('div');
    this.uiContainer.id = 'mobile-controls-ui';
    this.uiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1000;
    `;

    // Create left joystick container
    this.joystickContainer = document.createElement('div');
    this.joystickContainer.id = 'joystick-container';
    this.joystickContainer.style.cssText = `
      position: absolute;
      bottom: 50px;
      left: 50px;
      width: ${this.data.joystickSize}px;
      height: ${this.data.joystickSize}px;
      pointer-events: auto;
      opacity: 0.6;
    `;

    // Create joystick base
    this.joystickBase = document.createElement('div');
    this.joystickBase.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.5);
    `;

    // Create joystick stick
    this.joystickStick = document.createElement('div');
    this.joystickStick.style.cssText = `
      position: absolute;
      width: 40%;
      height: 40%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      border: 2px solid rgba(255, 255, 255, 0.9);
      top: 30%;
      left: 30%;
      transition: all 0.1s;
    `;

    // Create look area (right side)
    this.lookArea = document.createElement('div');
    this.lookArea.id = 'look-area';
    this.lookArea.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      pointer-events: auto;
    `;

    // Add hint text
    this.hintText = document.createElement('div');
    this.hintText.style.cssText = `
      position: absolute;
      bottom: 30px;
      right: 30px;
      color: rgba(255, 255, 255, 0.7);
      font-family: Arial, sans-serif;
      font-size: 14px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      pointer-events: none;
    `;
    this.hintText.textContent = 'Drag to look around';

    // Assemble joystick
    this.joystickContainer.appendChild(this.joystickBase);
    this.joystickContainer.appendChild(this.joystickStick);

    // Assemble UI
    this.uiContainer.appendChild(this.joystickContainer);
    this.uiContainer.appendChild(this.lookArea);
    this.uiContainer.appendChild(this.hintText);

    // Add to DOM
    document.body.appendChild(this.uiContainer);
  },

  setupEventListeners: function () {
    // Joystick events
    this.joystickContainer.addEventListener('touchstart', this.onTouchStart);
    this.joystickContainer.addEventListener('touchmove', this.onTouchMove);
    this.joystickContainer.addEventListener('touchend', this.onTouchEnd);

    // Look area events
    this.lookArea.addEventListener('touchstart', this.onTouchStart);
    this.lookArea.addEventListener('touchmove', this.onTouchMove);
    this.lookArea.addEventListener('touchend', this.onTouchEnd);

    // Get camera and rig after scene loads
    this.el.sceneEl.addEventListener('loaded', () => {
      this.camera = document.querySelector('[camera]') || document.querySelector('#camera');
      this.rig = document.querySelector('#rig') || this.camera?.parentNode;

      if (!this.camera) {
        console.warn('[Mobile Touch] Camera not found');
      }
      if (!this.rig) {
        console.warn('[Mobile Touch] Rig not found');
      }
    });
  },

  onTouchStart: function (evt) {
    evt.preventDefault();

    const touch = evt.touches[0];
    const rect = evt.target.getBoundingClientRect();

    if (evt.target.closest('#joystick-container')) {
      // Movement touch
      this.touches.movement = {
        id: touch.identifier,
        startX: touch.clientX - rect.left,
        startY: touch.clientY - rect.top,
        currentX: touch.clientX - rect.left,
        currentY: touch.clientY - rect.top
      };
    } else if (evt.target.closest('#look-area')) {
      // Look touch
      this.touches.look = {
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        previousX: touch.clientX,
        previousY: touch.clientY
      };
    }
  },

  onTouchMove: function (evt) {
    evt.preventDefault();

    for (let i = 0; i < evt.touches.length; i++) {
      const touch = evt.touches[i];

      // Update movement touch
      if (this.touches.movement && touch.identifier === this.touches.movement.id) {
        const rect = this.joystickContainer.getBoundingClientRect();
        this.touches.movement.currentX = touch.clientX - rect.left;
        this.touches.movement.currentY = touch.clientY - rect.top;

        this.updateJoystickVisual();
      }

      // Update look touch
      if (this.touches.look && touch.identifier === this.touches.look.id) {
        this.touches.look.previousX = this.touches.look.currentX;
        this.touches.look.previousY = this.touches.look.currentY;
        this.touches.look.currentX = touch.clientX;
        this.touches.look.currentY = touch.clientY;
      }
    }
  },

  onTouchEnd: function (evt) {
    evt.preventDefault();

    const touches = evt.changedTouches;

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];

      // Clear movement touch
      if (this.touches.movement && touch.identifier === this.touches.movement.id) {
        this.touches.movement = null;
        this.moveVector.set(0, 0);
        this.resetJoystickVisual();
      }

      // Clear look touch
      if (this.touches.look && touch.identifier === this.touches.look.id) {
        this.touches.look = null;
        this.lookDelta.set(0, 0);
      }
    }
  },

  updateJoystickVisual: function () {
    if (!this.touches.movement) return;

    const centerX = this.data.joystickSize / 2;
    const centerY = this.data.joystickSize / 2;

    const deltaX = this.touches.movement.currentX - centerX;
    const deltaY = this.touches.movement.currentY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = this.data.joystickSize / 2;

    let normalizedX = deltaX / maxDistance;
    let normalizedY = deltaY / maxDistance;

    // Clamp to max distance
    if (distance > maxDistance) {
      normalizedX = (deltaX / distance) * (maxDistance / maxDistance);
      normalizedY = (deltaY / distance) * (maxDistance / maxDistance);
    }

    // Update stick position
    const stickX = centerX + (normalizedX * maxDistance * 0.6);
    const stickY = centerY + (normalizedY * maxDistance * 0.6);

    this.joystickStick.style.left = `${stickX - (this.data.joystickSize * 0.2)}px`;
    this.joystickStick.style.top = `${stickY - (this.data.joystickSize * 0.2)}px`;

    // Update move vector
    this.moveVector.x = normalizedX;
    this.moveVector.y = -normalizedY; // Invert Y for forward/backward
  },

  resetJoystickVisual: function () {
    this.joystickStick.style.left = '30%';
    this.joystickStick.style.top = '30%';
  },

  tick: function (time, timeDelta) {
    if (!this.data.enabled) return;
    if (!this.camera || !this.rig) return;

    const delta = timeDelta / 1000;

    // Apply movement
    if (this.touches.movement) {
      this.applyMovement(delta);
    }

    // Apply look
    if (this.touches.look) {
      this.applyLook(delta);
    }
  },

  applyMovement: function (delta) {
    if (!this.rig) return;

    // Get camera direction
    const direction = new THREE.Vector3();
    this.camera.object3D.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // Get right vector
    const right = new THREE.Vector3();
    right.crossVectors(direction, this.rig.object3D.up).normalize();

    // Calculate movement
    const speed = this.data.movementSpeed;
    const movement = new THREE.Vector3();

    movement.addScaledVector(direction, -this.moveVector.y * speed * delta);
    movement.addScaledVector(right, this.moveVector.x * speed * delta);

    // Apply movement
    this.rig.object3D.position.add(movement);
  },

  applyLook: function (delta) {
    if (!this.camera || !this.rig) return;

    // Calculate delta
    const deltaX = this.touches.look.currentX - this.touches.look.previousX;
    const deltaY = this.touches.look.currentY - this.touches.look.previousY;

    // Apply horizontal rotation (yaw) to rig
    this.rig.object3D.rotation.y -= deltaX * this.data.lookSensitivity;

    // Apply vertical rotation (pitch) to camera
    const currentPitch = this.camera.object3D.rotation.x;
    const newPitch = currentPitch - deltaY * this.data.lookSensitivity;

    // Clamp pitch to prevent over-rotation
    this.camera.object3D.rotation.x = THREE.MathUtils.clamp(
      newPitch,
      -Math.PI / 2,
      Math.PI / 2
    );

    // Reset previous values
    this.touches.look.previousX = this.touches.look.currentX;
    this.touches.look.previousY = this.touches.look.currentY;
  },

  remove: function () {
    // Remove UI
    if (this.uiContainer && this.uiContainer.parentNode) {
      this.uiContainer.parentNode.removeChild(this.uiContainer);
    }

    // Remove event listeners
    if (this.joystickContainer) {
      this.joystickContainer.removeEventListener('touchstart', this.onTouchStart);
      this.joystickContainer.removeEventListener('touchmove', this.onTouchMove);
      this.joystickContainer.removeEventListener('touchend', this.onTouchEnd);
    }

    if (this.lookArea) {
      this.lookArea.removeEventListener('touchstart', this.onTouchStart);
      this.lookArea.removeEventListener('touchmove', this.onTouchMove);
      this.lookArea.removeEventListener('touchend', this.onTouchEnd);
    }
  }
});

console.log('[Mobile Touch] Component registered');
