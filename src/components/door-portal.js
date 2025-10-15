/**
 * Door Portal Component
 * Handles door interactions and room transitions for the virtual museum
 *
 * Features:
 * - Proximity detection
 * - Visual states (locked/unlocked)
 * - Keyboard activation (E key)
 * - Glow effects when unlocked
 * - Room switching on activation
 *
 * Usage:
 * <a-entity door-portal="targetRoom: room1; locked: false"></a-entity>
 */

AFRAME.registerComponent('door-portal', {
  schema: {
    targetRoom: { type: 'string', default: '' },
    locked: { type: 'boolean', default: true },
    activationDistance: { type: 'number', default: 2.5 }, // meters
    activationKey: { type: 'string', default: 'KeyE' },
    lockedColor: { type: 'color', default: '#808080' }, // gray
    unlockedColor: { type: 'color', default: '#FFD700' }, // gold
    glowIntensity: { type: 'number', default: 1.5 }
  },

  init: function () {
    this.camera = null;
    this.isPlayerNear = false;
    this.isActivating = false;

    // Bind event handlers
    this.onKeyDown = this.onKeyDown.bind(this);

    // Setup event listeners
    document.addEventListener('keydown', this.onKeyDown);

    // Listen for unlock events
    this.el.addEventListener('unlock-door', () => {
      this.unlock();
    });

    this.el.addEventListener('lock-door', () => {
      this.lock();
    });

    // Find camera after scene loads
    this.el.sceneEl.addEventListener('loaded', () => {
      this.camera = document.querySelector('[camera]') || document.querySelector('#camera');
      if (!this.camera) {
        console.warn('[Door Portal] Camera not found');
      }
    });

    // Create visual indicator
    this.createVisualIndicator();

    // Update initial state
    this.updateVisualState();

    console.log('[Door Portal] Initialized - Target:', this.data.targetRoom, '- Locked:', this.data.locked);
  },

  createVisualIndicator: function () {
    // Create glowing frame/outline for the door
    this.glowIndicator = document.createElement('a-ring');
    this.glowIndicator.setAttribute('radius-inner', '0.8');
    this.glowIndicator.setAttribute('radius-outer', '1.0');
    this.glowIndicator.setAttribute('position', '0 1.5 0');
    this.glowIndicator.setAttribute('rotation', '0 0 0');
    this.glowIndicator.setAttribute('material', {
      color: this.data.lockedColor,
      shader: 'flat',
      side: 'double',
      opacity: 0.8,
      transparent: true
    });

    this.el.appendChild(this.glowIndicator);

    // Create activation prompt (E key hint) with Vietnamese support
    this.promptText = document.createElement('a-entity');
    this.promptText.setAttribute('position', '0 2.2 0.1');
    this.promptText.setAttribute('vietnamese-text', {
      value: 'Nhấn E để vào',
      color: '#FFFFFF',
      fontSize: 0.15,
      align: 'center',
      width: 2
    });
    this.promptText.setAttribute('visible', 'false');

    this.el.appendChild(this.promptText);
  },

  updateVisualState: function () {
    if (!this.glowIndicator) return;

    if (this.data.locked) {
      // Locked state - gray, no glow
      this.glowIndicator.setAttribute('material', {
        color: this.data.lockedColor,
        shader: 'flat',
        opacity: 0.5,
        transparent: true
      });

      // Remove glow animation if exists
      this.glowIndicator.removeAttribute('animation__glow');

    } else {
      // Unlocked state - gold, glowing
      this.glowIndicator.setAttribute('material', {
        color: this.data.unlockedColor,
        shader: 'flat',
        opacity: 0.9,
        transparent: true
      });

      // Add pulsing glow animation
      this.glowIndicator.setAttribute('animation__glow', {
        property: 'material.opacity',
        from: 0.5,
        to: 1.0,
        dur: 1000,
        dir: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });

      // Add scale pulse
      this.glowIndicator.setAttribute('animation__scale', {
        property: 'scale',
        from: '1 1 1',
        to: '1.1 1.1 1.1',
        dur: 1000,
        dir: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  },

  onKeyDown: function (evt) {
    if (evt.code !== this.data.activationKey) return;
    if (!this.isPlayerNear) return;
    if (this.data.locked) {
      console.log('[Door Portal] Door is locked');
      this.showLockedMessage();
      return;
    }

    this.activate();
  },

  activate: function () {
    if (this.isActivating) return;
    if (!this.data.targetRoom) {
      console.error('[Door Portal] No target room specified');
      return;
    }

    this.isActivating = true;

    console.log('[Door Portal] Activating - Switching to room:', this.data.targetRoom);

    // Emit room switch event
    this.el.sceneEl.emit('switch-room', {
      targetRoom: this.data.targetRoom,
      portal: this.el
    });

    // Play activation sound (if audio system is available)
    this.el.sceneEl.emit('play-sfx', { sound: 'door-open' });

    // Reset activation flag after transition
    setTimeout(() => {
      this.isActivating = false;
    }, 2000);
  },

  showLockedMessage: function () {
    // Visual feedback for locked door
    this.el.sceneEl.emit('show-message', {
      message: 'Cửa đang khóa. Hãy khám phá 3 hiện vật để mở khóa.',
      duration: 3000
    });

    // Shake animation
    this.glowIndicator.setAttribute('animation__shake', {
      property: 'rotation',
      from: '0 0 -5',
      to: '0 0 5',
      dur: 100,
      dir: 'alternate',
      loop: 3,
      easing: 'linear'
    });

    // Play locked sound
    this.el.sceneEl.emit('play-sfx', { sound: 'door-locked' });
  },

  tick: function (time, timeDelta) {
    if (!this.camera) return;

    // Check distance to camera/player
    const cameraPos = new THREE.Vector3();
    this.camera.object3D.getWorldPosition(cameraPos);

    const doorPos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(doorPos);

    const distance = cameraPos.distanceTo(doorPos);

    // Update near state
    const wasNear = this.isPlayerNear;
    this.isPlayerNear = distance <= this.data.activationDistance;

    // Show/hide prompt text
    if (this.promptText) {
      if (this.isPlayerNear && !this.data.locked) {
        this.promptText.setAttribute('visible', true);
        // Make prompt face camera
        this.promptText.object3D.lookAt(cameraPos);
      } else {
        this.promptText.setAttribute('visible', false);
      }
    }

    // Emit proximity events
    if (this.isPlayerNear && !wasNear) {
      this.el.emit('player-near', { distance: distance });
    } else if (!this.isPlayerNear && wasNear) {
      this.el.emit('player-far', { distance: distance });
    }
  },

  unlock: function () {
    if (!this.data.locked) return;

    console.log('[Door Portal] Unlocking door to:', this.data.targetRoom);

    this.data.locked = false;
    this.updateVisualState();

    // Emit unlock event
    this.el.emit('door-unlocked', { targetRoom: this.data.targetRoom });
    this.el.sceneEl.emit('door-unlocked', { targetRoom: this.data.targetRoom });

    // Play unlock sound
    this.el.sceneEl.emit('play-sfx', { sound: 'door-unlock' });

    // Show message
    this.el.sceneEl.emit('show-message', {
      message: 'Cửa đã mở khóa! Nhấn E để tiến vào phòng tiếp theo.',
      duration: 4000
    });
  },

  lock: function () {
    if (this.data.locked) return;

    console.log('[Door Portal] Locking door to:', this.data.targetRoom);

    this.data.locked = true;
    this.updateVisualState();

    this.el.emit('door-locked', { targetRoom: this.data.targetRoom });
  },

  update: function (oldData) {
    // Handle schema property updates
    if (oldData.locked !== undefined && oldData.locked !== this.data.locked) {
      this.updateVisualState();
    }
  },

  remove: function () {
    document.removeEventListener('keydown', this.onKeyDown);
  }
});

console.log('[Door Portal] Component registered');
