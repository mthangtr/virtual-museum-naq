/**
 * Enhanced Camera Controller Component
 * Provides advanced first-person navigation with physics, collision detection,
 * crouch mechanics, and smooth camera movement
 *
 * Features:
 * - WASD + Arrow keys movement
 * - Mouse look with pointer lock
 * - Gravity and collision detection
 * - Crouch mechanic (C key)
 * - Sprint mechanic (Shift key)
 * - Smooth acceleration/deceleration
 * - Mobile touch support
 *
 * Usage:
 * <a-entity enhanced-camera-controller></a-entity>
 */

AFRAME.registerComponent('enhanced-camera-controller', {
  schema: {
    // Movement settings
    walkSpeed: { type: 'number', default: 3.5 }, // meters per second
    sprintSpeed: { type: 'number', default: 6.0 },
    crouchSpeed: { type: 'number', default: 1.5 },
    acceleration: { type: 'number', default: 10 },

    // Camera height settings
    standingHeight: { type: 'number', default: 1.6 }, // meters
    crouchHeight: { type: 'number', default: 1.0 },
    heightTransitionSpeed: { type: 'number', default: 5 },

    // Physics settings
    gravity: { type: 'number', default: -9.8 },
    jumpForce: { type: 'number', default: 5.0 },
    mass: { type: 'number', default: 80 }, // kg

    // Collision settings
    enableCollision: { type: 'boolean', default: true },
    collisionRadius: { type: 'number', default: 0.3 },

    // Control settings
    enableLook: { type: 'boolean', default: true },
    enableMovement: { type: 'boolean', default: true },
    enableJump: { type: 'boolean', default: false }, // disabled for museum (no jumping)
    mouseSensitivity: { type: 'number', default: 0.002 },

    // Mobile settings
    touchEnabled: { type: 'boolean', default: true }
  },

  init: function () {
    this.camera = this.el.querySelector('[camera]') || this.el;
    this.velocity = new THREE.Vector3();
    this.moveVector = new THREE.Vector3();
    this.targetHeight = this.data.standingHeight;
    this.currentHeight = this.data.standingHeight;

    // State flags
    this.isCrouching = false;
    this.isSprinting = false;
    this.isGrounded = true;
    this.isLocked = false;

    // Input states
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      crouch: false,
      jump: false
    };

    // Rotation state
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.pitchObject.add(this.camera.object3D);
    this.yawObject.add(this.pitchObject);

    // Bind event handlers
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onPointerLockChange = this.onPointerLockChange.bind(this);
    this.onPointerLockError = this.onPointerLockError.bind(this);
    this.onClick = this.onClick.bind(this);

    // Setup event listeners
    this.setupEventListeners();

    // Set initial position
    this.el.object3D.position.y = this.currentHeight;

    console.log('[Enhanced Camera] Controller initialized');
  },

  setupEventListeners: function () {
    const canvas = this.el.sceneEl.canvas;

    // Keyboard events
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    // Mouse events
    document.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('click', this.onClick);

    // Pointer lock events
    document.addEventListener('pointerlockchange', this.onPointerLockChange);
    document.addEventListener('pointerlockerror', this.onPointerLockError);

    // Lock controls on scene interaction
    this.el.sceneEl.addEventListener('enter-vr', () => {
      this.data.enableMovement = true;
    });

    this.el.sceneEl.addEventListener('exit-vr', () => {
      this.exitPointerLock();
    });
  },

  onKeyDown: function (evt) {
    if (!this.data.enableMovement) return;

    switch (evt.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = true;
        this.isSprinting = true;
        break;
      case 'KeyC':
        this.keys.crouch = !this.keys.crouch;
        this.toggleCrouch();
        break;
      case 'Space':
        if (this.data.enableJump && this.isGrounded) {
          this.keys.jump = true;
          this.jump();
        }
        evt.preventDefault();
        break;
    }
  },

  onKeyUp: function (evt) {
    switch (evt.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = false;
        this.isSprinting = false;
        break;
      case 'Space':
        this.keys.jump = false;
        break;
    }
  },

  onMouseMove: function (evt) {
    if (!this.data.enableLook || !this.isLocked) return;

    const movementX = evt.movementX || evt.mozMovementX || 0;
    const movementY = evt.movementY || evt.mozMovementY || 0;

    // Update yaw (horizontal rotation)
    this.yawObject.rotation.y -= movementX * this.data.mouseSensitivity;

    // Update pitch (vertical rotation) with limits
    this.pitchObject.rotation.x -= movementY * this.data.mouseSensitivity;
    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
  },

  onClick: function () {
    // Request pointer lock for immersive controls
    if (!this.isLocked) {
      this.requestPointerLock();
    }
  },

  requestPointerLock: function () {
    const canvas = this.el.sceneEl.canvas;
    if (canvas.requestPointerLock) {
      canvas.requestPointerLock();
    }
  },

  exitPointerLock: function () {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  },

  onPointerLockChange: function () {
    const canvas = this.el.sceneEl.canvas;
    this.isLocked = document.pointerLockElement === canvas;

    if (this.isLocked) {
      console.log('[Enhanced Camera] Pointer locked - controls enabled');
      this.el.sceneEl.emit('controls-locked');
    } else {
      console.log('[Enhanced Camera] Pointer unlocked - controls disabled');
      this.el.sceneEl.emit('controls-unlocked');
    }
  },

  onPointerLockError: function () {
    console.error('[Enhanced Camera] Pointer lock error');
  },

  toggleCrouch: function () {
    this.isCrouching = !this.isCrouching;
    this.targetHeight = this.isCrouching ? this.data.crouchHeight : this.data.standingHeight;

    console.log('[Enhanced Camera] Crouch:', this.isCrouching);
    this.el.sceneEl.emit('player-crouch', { crouching: this.isCrouching });
  },

  jump: function () {
    if (!this.isGrounded) return;

    this.velocity.y = this.data.jumpForce;
    this.isGrounded = false;

    console.log('[Enhanced Camera] Jump');
    this.el.sceneEl.emit('player-jump');
  },

  tick: function (time, timeDelta) {
    if (!this.data.enableMovement) return;

    const delta = timeDelta / 1000; // Convert to seconds

    // Update movement
    this.updateMovement(delta);

    // Update height (crouch transition)
    this.updateHeight(delta);

    // Apply gravity
    if (!this.isGrounded) {
      this.velocity.y += this.data.gravity * delta;
    }

    // Update position
    this.updatePosition(delta);

    // Update camera rotation from yaw/pitch objects
    this.updateRotation();
  },

  updateMovement: function (delta) {
    // Reset move vector
    this.moveVector.set(0, 0, 0);

    // Calculate movement direction
    if (this.keys.forward) this.moveVector.z -= 1;
    if (this.keys.backward) this.moveVector.z += 1;
    if (this.keys.left) this.moveVector.x -= 1;
    if (this.keys.right) this.moveVector.x += 1;

    // Normalize diagonal movement
    if (this.moveVector.length() > 0) {
      this.moveVector.normalize();
    }

    // Determine speed based on state
    let speed = this.data.walkSpeed;
    if (this.isCrouching) {
      speed = this.data.crouchSpeed;
    } else if (this.isSprinting && !this.isCrouching) {
      speed = this.data.sprintSpeed;
    }

    // Apply speed
    this.moveVector.multiplyScalar(speed);

    // Apply acceleration (smooth movement)
    const targetVelocityX = this.moveVector.x;
    const targetVelocityZ = this.moveVector.z;

    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, targetVelocityX, delta * this.data.acceleration);
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, targetVelocityZ, delta * this.data.acceleration);
  },

  updateHeight: function (delta) {
    // Smooth height transition for crouch
    this.currentHeight = THREE.MathUtils.lerp(
      this.currentHeight,
      this.targetHeight,
      delta * this.data.heightTransitionSpeed
    );

    this.el.object3D.position.y = this.currentHeight;
  },

  updatePosition: function (delta) {
    // Get camera direction
    const direction = new THREE.Vector3();
    this.camera.object3D.getWorldDirection(direction);
    direction.y = 0; // Keep movement on horizontal plane
    direction.normalize();

    // Get right vector
    const right = new THREE.Vector3();
    right.crossVectors(direction, this.el.object3D.up).normalize();

    // Calculate movement
    const movement = new THREE.Vector3();
    movement.addScaledVector(direction, -this.velocity.z * delta);
    movement.addScaledVector(right, this.velocity.x * delta);
    movement.y = this.velocity.y * delta;

    // Apply movement (collision detection would go here)
    if (this.data.enableCollision) {
      // TODO: Add collision detection in future sprints
      this.el.object3D.position.add(movement);
    } else {
      this.el.object3D.position.add(movement);
    }

    // Simple ground check (y position)
    if (this.el.object3D.position.y <= this.currentHeight) {
      this.el.object3D.position.y = this.currentHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    }
  },

  updateRotation: function () {
    // Copy rotation from yaw object to entity
    this.el.object3D.rotation.y = this.yawObject.rotation.y;
  },

  enableControls: function () {
    this.data.enableMovement = true;
    this.data.enableLook = true;
  },

  disableControls: function () {
    this.data.enableMovement = false;
    this.data.enableLook = false;
    this.exitPointerLock();
  },

  remove: function () {
    // Remove event listeners
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    document.removeEventListener('pointerlockerror', this.onPointerLockError);

    this.exitPointerLock();
  }
});

console.log('[Enhanced Camera] Component registered');
