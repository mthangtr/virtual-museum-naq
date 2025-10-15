/**
 * interactive-object.js
 * 
 * Custom A-Frame component for interactive museum objects.
 * Handles hover states, click interactions, visual feedback, and completion tracking.
 * 
 * Sprint 3: Interactive Object System
 * Created: October 15, 2025
 * 
 * Features:
 * - Hover detection with highlight effect
 * - Click interaction with popup trigger
 * - Visual states (idle, hover, active, completed)
 * - Event emission for UI layer integration
 * - Audio feedback support
 * - Completion state persistence
 * 
 * Usage:
 * <a-entity 
 *   interactive-object="
 *     objectId: obj-room1-01;
 *     title: Tàu Ba Son;
 *     description: Nguyễn Ái Quốc rời cảng Sài Gòn...;
 *     image: assets/images/room1/ship.jpg;
 *     audioFile: assets/audio/sfx/click.mp3;
 *   "
 *   geometry="primitive: box"
 *   material="color: #FFD700">
 * </a-entity>
 */

AFRAME.registerComponent('interactive-object', {
  schema: {
    // Unique identifier for this object
    objectId: { 
      type: 'string', 
      default: '' 
    },
    
    // Display title (Vietnamese)
    title: { 
      type: 'string', 
      default: 'Interactive Object' 
    },
    
    // Historical description text
    description: { 
      type: 'string', 
      default: '' 
    },
    
    // Path to popup image
    image: { 
      type: 'string', 
      default: '' 
    },
    
    // Optional audio file to play on click
    audioFile: { 
      type: 'string', 
      default: '' 
    },
    
    // Whether this object has been interacted with
    completed: { 
      type: 'boolean', 
      default: false 
    },
    
    // Highlight color on hover
    highlightColor: { 
      type: 'color', 
      default: '#FFD700' 
    },
    
    // Highlight intensity multiplier
    highlightIntensity: { 
      type: 'number', 
      default: 1.5 
    },
    
    // Enable/disable interaction
    enabled: { 
      type: 'boolean', 
      default: true 
    },
    
    // Enable audio feedback
    enableAudio: {
      type: 'boolean',
      default: true
    }
  },

  /**
   * Component initialization
   */
  init: function() {
    this.el.classList.add('interactive');
    
    // State management
    this.isHovered = false;
    this.isActive = false;
    this.isProcessing = false; // Lock to prevent double-click race condition
    this.originalMaterial = null;
    this.originalEmissive = null;
    this.originalEmissiveIntensity = 0;
    this.audio = null;
    
    // Bind event handlers
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    
    // Setup interaction
    this.setupInteraction();
    
    // Load audio if specified
    if (this.data.audioFile && this.data.enableAudio) {
      this.loadAudio();
    }
    
    // Apply completed state if already interacted
    if (this.data.completed) {
      this.markAsCompleted();
    }
    
    console.log(`[InteractiveObject] Initialized: ${this.data.objectId}`);
  },

  /**
   * Setup interaction listeners
   */
  setupInteraction: function() {
    // Store original material properties
    const material = this.el.getAttribute('material');
    if (material) {
      this.originalMaterial = {
        color: material.color || '#FFFFFF',
        emissive: material.emissive || '#000000',
        emissiveIntensity: material.emissiveIntensity || 0
      };
    }
    
    // Add event listeners
    this.el.addEventListener('mouseenter', this.onMouseEnter);
    this.el.addEventListener('mouseleave', this.onMouseLeave);
    this.el.addEventListener('click', this.onClick);
  },

  /**
   * Handle mouse enter (hover start)
   */
  onMouseEnter: function(evt) {
    if (!this.data.enabled) return;
    
    // CRITICAL: Only allow interaction if object belongs to current room
    if (!this.isInCurrentRoom()) return;
    
    this.isHovered = true;
    
    // Apply highlight effect (always, even if completed)
    this.applyHighlight();
    
    // Emit hover event for UI (tooltip)
    this.el.emit('object-hover', {
      objectId: this.data.objectId,
      title: this.data.title,
      position: this.el.object3D.position
    });
    
    // Change cursor appearance (via scene-level event)
    this.el.sceneEl.emit('cursor-hover', { hovering: true });
    
    console.log(`[InteractiveObject] Hover: ${this.data.objectId}`);
  },

  /**
   * Handle mouse leave (hover end)
   */
  onMouseLeave: function(evt) {
    if (!this.data.enabled) return;
    
    this.isHovered = false;
    
    // Remove highlight effect
    this.removeHighlight();
    
    // Emit hover-end event
    this.el.emit('object-hover-end', {
      objectId: this.data.objectId
    });
    
    // Reset cursor appearance
    this.el.sceneEl.emit('cursor-hover', { hovering: false });
  },

  /**
   * Handle click interaction
   */
  onClick: function(evt) {
    if (!this.data.enabled) return;
    
    // CRITICAL: Only allow interaction if object belongs to current room
    if (!this.isInCurrentRoom()) {
      console.warn(`[InteractiveObject] Click ignored - ${this.data.objectId} not in current room`);
      return;
    }
    
    // Prevent double-click race condition
    if (this.isProcessing) {
      console.log(`[InteractiveObject] Click ignored - already processing: ${this.data.objectId}`);
      return;
    }
    
    this.isProcessing = true; // Lock
    this.isActive = true;
    
    // Play click audio
    if (this.audio && this.data.enableAudio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(err => {
        console.warn('[InteractiveObject] Audio play failed:', err);
      });
    }
    
    // Always emit click event for UI (popup) - allow re-opening
    this.el.emit('object-click', {
      objectId: this.data.objectId,
      title: this.data.title,
      description: this.data.description,
      image: this.data.image
    });
    
    // Mark as completed (only first time)
    if (!this.data.completed) {
      this.markAsCompleted();
      
      // Notify progress tracker (only first time)
      this.el.sceneEl.emit('object-completed', {
        objectId: this.data.objectId
      });
    }
    
    console.log(`[InteractiveObject] Clicked: ${this.data.objectId} (completed: ${this.data.completed})`);
    
    // Unlock after short delay to prevent rapid re-clicks
    setTimeout(() => {
      this.isProcessing = false;
    }, 300);
  },

  /**
   * Apply highlight visual effect
   */
  applyHighlight: function() {
    const material = this.el.getAttribute('material') || {};
    
    // Store original if not already stored
    if (!this.originalEmissive) {
      this.originalEmissive = material.emissive || '#000000';
      this.originalEmissiveIntensity = material.emissiveIntensity || 0;
    }
    
    // Apply glow effect
    this.el.setAttribute('material', {
      emissive: this.data.highlightColor,
      emissiveIntensity: this.data.highlightIntensity
    });
    
    // Add pulsing animation
    this.el.setAttribute('animation__pulse', {
      property: 'scale',
      to: '1.1 1.1 1.1',
      dur: 500,
      easing: 'easeInOutSine',
      loop: true,
      dir: 'alternate'
    });
  },

  /**
   * Remove highlight visual effect
   */
  removeHighlight: function() {
    // If completed, restore the completed green glow instead of original
    if (this.data.completed) {
      this.el.setAttribute('material', {
        emissive: '#4CAF50', // Green glow for completed
        emissiveIntensity: 0.3
      });
    } else {
      // Restore original material for non-completed objects
      if (this.originalEmissive !== null) {
        this.el.setAttribute('material', {
          emissive: this.originalEmissive,
          emissiveIntensity: this.originalEmissiveIntensity
        });
      }
    }
    
    // Remove pulsing animation
    this.el.removeAttribute('animation__pulse');
  },

  /**
   * Mark object as completed (already interacted)
   */
  markAsCompleted: function() {
    this.data.completed = true;
    
    // Apply completed visual state (subtle green glow)
    this.el.setAttribute('material', {
      emissive: '#4CAF50', // Green glow
      emissiveIntensity: 0.3
    });
    
    // Add checkmark indicator (optional visual feedback)
    this.addCompletedIndicator();
    
    // Keep enabled = true to allow re-clicking
    // this.data.enabled remains true so users can re-open popup
  },

  /**
   * Add visual indicator for completed state
   */
  addCompletedIndicator: function() {
    // Create floating checkmark above object
    const indicator = document.createElement('a-entity');
    indicator.setAttribute('geometry', {
      primitive: 'plane',
      width: 0.3,
      height: 0.3
    });
    indicator.setAttribute('material', {
      color: '#4CAF50',
      opacity: 0.8,
      transparent: true,
      shader: 'flat'
    });
    indicator.setAttribute('position', '0 1.5 0');
    indicator.setAttribute('billboard', ''); // Always face camera
    
    // Add text (✓)
    indicator.setAttribute('text', {
      value: '✓',
      color: '#FFFFFF',
      align: 'center',
      width: 1
    });
    
    // Animate appearance
    indicator.setAttribute('animation__fadein', {
      property: 'material.opacity',
      from: 0,
      to: 0.8,
      dur: 500,
      easing: 'easeOutQuad'
    });
    
    this.el.appendChild(indicator);
  },

  /**
   * Load audio file
   */
  loadAudio: function() {
    this.audio = new Audio(this.data.audioFile);
    this.audio.volume = 0.5;
    this.audio.preload = 'auto';
    
    this.audio.addEventListener('error', (err) => {
      console.warn(`[InteractiveObject] Failed to load audio: ${this.data.audioFile}`, err);
    });
  },

  /**
   * Update component (when properties change)
   */
  update: function(oldData) {
    // Handle enabled state change
    if (oldData.enabled !== this.data.enabled) {
      if (!this.data.enabled) {
        this.removeHighlight();
      }
    }
    
    // Handle completed state change
    if (oldData.completed !== this.data.completed) {
      if (this.data.completed) {
        this.markAsCompleted();
      }
    }
    
    // Handle audio file change
    if (oldData.audioFile !== this.data.audioFile && this.data.enableAudio) {
      this.loadAudio();
    }
  },

  /**
   * Extract room ID from object ID
   * Example: "obj-room1-map" -> "room1"
   *          "obj-room4-flag1" -> "room4"
   */
  extractRoomIdFromObjectId: function() {
    const objectId = this.data.objectId;
    
    // Format: obj-{roomId}-{name}
    // Split by '-' and get the second part
    const parts = objectId.split('-');
    if (parts.length >= 3 && parts[0] === 'obj') {
      return parts[1]; // returns "room1", "room2", etc.
    }
    
    // Fallback: couldn't parse room ID
    console.warn(`[InteractiveObject] ${objectId}: Could not extract room ID from object ID`);
    return null;
  },

  /**
   * Check if this object belongs to the currently visible room
   * SIMPLE APPROACH: Extract roomId from objectId and compare with currentRoom
   */
  isInCurrentRoom: function() {
    // Get room ID from this object's ID
    const myRoomId = this.extractRoomIdFromObjectId();
    
    // If we couldn't extract room ID, allow interaction (for special objects)
    if (!myRoomId) {
      return true;
    }
    
    // Get current room from room-manager
    const roomManager = document.querySelector('[room-manager]');
    if (!roomManager || !roomManager.components['room-manager']) {
      console.warn(`[InteractiveObject] ${this.data.objectId}: room-manager not found`);
      return true; // Allow if room-manager not available
    }
    
    const currentRoom = roomManager.components['room-manager'].data.currentRoom;
    const isInCurrentRoom = myRoomId === currentRoom;
    
    // Log blocking for debugging
    if (!isInCurrentRoom) {
      console.log(`[InteractiveObject] ${this.data.objectId}: Blocked - belongs to ${myRoomId}, but current room is ${currentRoom}`);
    }
    
    return isInCurrentRoom;
  },

  /**
   * Component removal cleanup
   */
  remove: function() {
    // Remove event listeners
    this.el.removeEventListener('mouseenter', this.onMouseEnter);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);
    this.el.removeEventListener('click', this.onClick);
    
    // Cleanup audio
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    
    console.log(`[InteractiveObject] Removed: ${this.data.objectId}`);
  },

  /**
   * Get interaction state
   */
  getState: function() {
    return {
      objectId: this.data.objectId,
      title: this.data.title,
      completed: this.data.completed,
      enabled: this.data.enabled,
      isHovered: this.isHovered,
      isActive: this.isActive
    };
  },

  /**
   * Reset object state (for replay/reset functionality)
   */
  reset: function() {
    this.data.completed = false;
    this.data.enabled = true;
    this.isActive = false;
    
    // Remove completed indicator
    const indicator = this.el.querySelector('[billboard]');
    if (indicator) {
      this.el.removeChild(indicator);
    }
    
    // Restore original material
    if (this.originalMaterial) {
      this.el.setAttribute('material', this.originalMaterial);
    }
    
    console.log(`[InteractiveObject] Reset: ${this.data.objectId}`);
  }
});

console.log('[InteractiveObject] Component registered successfully');
