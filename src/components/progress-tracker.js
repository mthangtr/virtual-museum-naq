/**
 * progress-tracker.js
 * 
 * Custom A-Frame component for tracking interactive object completion per room.
 * Manages room completion state, updates HUD display, and unlocks doors.
 * 
 * Sprint 3: Interactive Object System
 * Created: October 15, 2025
 * 
 * Features:
 * - Tracks object interactions per room
 * - Updates HUD progress display (e.g., "2/3")
 * - Emits room-complete event when all objects are interacted
 * - Integrates with door-portal to unlock progression
 * - LocalStorage persistence (save progress)
 * 
 * Usage:
 * <a-entity
 *   progress-tracker="
 *     roomId: room1;
 *     requiredObjects: 3;
 *     objects: obj-room1-01, obj-room1-02, obj-room1-03;
 *   ">
 * </a-entity>
 */

AFRAME.registerComponent('progress-tracker', {
  schema: {
    // Room identifier
    roomId: {
      type: 'string',
      default: ''
    },
    
    // Number of objects required to complete room
    requiredObjects: {
      type: 'number',
      default: 3
    },
    
    // Comma-separated list of object IDs in this room
    objects: {
      type: 'array',
      default: []
    },
    
    // Enable localStorage persistence
    enablePersistence: {
      type: 'boolean',
      default: true
    },
    
    // Auto-unlock door when complete
    autoUnlockDoor: {
      type: 'boolean',
      default: true
    },
    
    // Door entity selector to unlock
    doorSelector: {
      type: 'string',
      default: '[door-portal]'
    }
  },

  /**
   * Component initialization
   */
  init: function() {
    // Completion tracking
    this.completedObjects = new Set();
    this.totalObjects = this.data.requiredObjects;
    this.isRoomComplete = false;
    
    // DEBUG: Log the objects array to verify parsing
    console.log(`[ProgressTracker] Raw objects config for ${this.data.roomId}:`, this.data.objects);
    console.log(`[ProgressTracker] Objects type:`, typeof this.data.objects);
    console.log(`[ProgressTracker] Objects is array:`, Array.isArray(this.data.objects));
    if (Array.isArray(this.data.objects)) {
      console.log(`[ProgressTracker] Objects length:`, this.data.objects.length);
      this.data.objects.forEach((obj, idx) => {
        console.log(`[ProgressTracker]   [${idx}]: "${obj}" (type: ${typeof obj})`);
      });
    }
    
    // Bind event handlers
    this.onObjectCompleted = this.onObjectCompleted.bind(this);
    this.onRoomEnter = this.onRoomEnter.bind(this);
    
    // Listen for object completion events
    this.el.sceneEl.addEventListener('object-completed', this.onObjectCompleted);
    
    // Listen for room enter events
    this.el.sceneEl.addEventListener('room-enter', this.onRoomEnter);
    
    // Load saved progress
    if (this.data.enablePersistence) {
      this.loadProgress();
    }
    
    // Initialize HUD display
    this.updateHUDDisplay();
    
    console.log(`[ProgressTracker] Initialized for ${this.data.roomId} - ${this.totalObjects} objects required`);
    console.log(`[ProgressTracker] Current progress: ${this.completedObjects.size}/${this.totalObjects}, completed objects:`, Array.from(this.completedObjects));
  },

  /**
   * Handle object completion event
   */
  onObjectCompleted: function(evt) {
    const objectId = evt.detail.objectId;
    
    console.log(`[ProgressTracker] ${this.data.roomId} received object-completed event for: "${objectId}"`);
    
    // Atomic check: If already completed, return immediately (defense against race condition)
    if (this.completedObjects.has(objectId)) {
      console.warn(`[ProgressTracker] ${this.data.roomId}: Duplicate completion ignored for: ${objectId}`);
      return;
    }
    
    // Check if this object belongs to current room
    const belongsToThisRoom = this.data.objects.includes(objectId);
    console.log(`[ProgressTracker] ${this.data.roomId}: Does "${objectId}" belong to this room? ${belongsToThisRoom}`);
    console.log(`[ProgressTracker] ${this.data.roomId}: Current objects list:`, this.data.objects);
    
    if (!belongsToThisRoom) {
      console.log(`[ProgressTracker] ${this.data.roomId}: Object "${objectId}" not in our list, ignoring`);
      return; // Not our room's object
    }
    
    // Add to completed set (atomic operation)
    this.completedObjects.add(objectId);
    
    console.log(`[ProgressTracker] ✅ ${this.data.roomId}: Object completed: ${objectId} (${this.completedObjects.size}/${this.totalObjects})`);
    
    // Update HUD
    this.updateHUDDisplay();
    
    // Save progress
    if (this.data.enablePersistence) {
      this.saveProgress();
    }
    
    // Check room completion
    this.checkRoomCompletion();
  },

  /**
   * Check if room is complete
   */
  checkRoomCompletion: function() {
    if (this.completedObjects.size >= this.totalObjects && !this.isRoomComplete) {
      this.isRoomComplete = true;
      
      console.log(`[ProgressTracker] Room ${this.data.roomId} complete!`);
      
      // Emit room-complete event
      this.el.sceneEl.emit('room-complete', {
        roomId: this.data.roomId,
        objectsCompleted: this.completedObjects.size,
        totalObjects: this.totalObjects
      });
      
      // Auto-unlock door
      if (this.data.autoUnlockDoor) {
        this.unlockDoor();
      }
      
      // Show completion notification
      this.showCompletionNotification();
    }
  },

  /**
   * Unlock the door to next room
   */
  unlockDoor: function() {
    // Find door in current room
    const roomEntity = document.getElementById(this.data.roomId);
    if (!roomEntity) {
      console.warn(`[ProgressTracker] Room entity not found: ${this.data.roomId}`);
      return;
    }
    
    // Find all doors in this room
    const doors = roomEntity.querySelectorAll('[door-portal]');
    console.log(`[ProgressTracker] Found ${doors.length} doors in ${this.data.roomId}`);
    
    if (doors.length === 0) {
      console.warn(`[ProgressTracker] No doors found in ${this.data.roomId}`);
      return;
    }
    
    // Unlock all forward-facing doors (not back to previous room)
    let unlockedCount = 0;
    doors.forEach(door => {
      const doorComponent = door.components['door-portal'];
      if (!doorComponent) {
        console.warn('[ProgressTracker] Door has no door-portal component');
        return;
      }
      
      const isLocked = doorComponent.data.locked;
      const targetRoom = doorComponent.data.targetRoom;
      
      console.log(`[ProgressTracker] Door to ${targetRoom}, locked: ${isLocked}`);
      
      // Only unlock locked doors (don't touch already unlocked back doors)
      if (isLocked) {
        // Use component's unlock method instead of setAttribute to preserve all properties
        if (doorComponent.unlock) {
          doorComponent.unlock();
          console.log(`[ProgressTracker] Unlocked door to ${targetRoom}`);
          unlockedCount++;
        }
      }
    });
    
    if (unlockedCount > 0) {
      // Play unlock sound effect
      this.el.sceneEl.emit('play-sound', {
        soundId: 'door-unlock',
        volume: 0.5
      });
      
      // Show notification
      this.el.sceneEl.emit('show-notification', {
        message: 'Cửa đã mở khóa! Nhấn E để tiến vào phòng tiếp theo.',
        duration: 4000,
        type: 'success'
      });
    }
  },

  /**
   * Show completion notification
   */
  showCompletionNotification: function() {
    // Emit UI event for notification banner
    this.el.sceneEl.emit('show-notification', {
      title: 'Hoàn thành!',
      message: `Bạn đã khám phá tất cả ${this.totalObjects} hiện vật trong phòng này.`,
      duration: 3000,
      type: 'success'
    });
  },

  /**
   * Update HUD progress display
   */
  updateHUDDisplay: function() {
    // Get the room manager to check current room
    const roomManager = document.querySelector('[room-manager]');
    if (roomManager && roomManager.components['room-manager']) {
      const currentRoom = roomManager.components['room-manager'].data.currentRoom;
      
      // Only update HUD if this is the current room's tracker
      if (currentRoom !== this.data.roomId) {
        console.log(`[ProgressTracker] Skipping HUD update - not current room (current: ${currentRoom}, this: ${this.data.roomId})`);
        return;
      }
    }
    
    const progressElement = document.getElementById('progress');
    if (progressElement) {
      // Show progress element
      progressElement.style.display = 'inline-block';
      progressElement.textContent = `${this.completedObjects.size}/${this.totalObjects}`;
      
      console.log(`[ProgressTracker] HUD updated: ${this.completedObjects.size}/${this.totalObjects} for ${this.data.roomId}`);
      
      // Add completion styling
      if (this.isRoomComplete) {
        progressElement.classList.add('complete');
        progressElement.style.color = '#4CAF50';
      } else {
        progressElement.classList.remove('complete');
        progressElement.style.color = '#FFFFFF';
      }
    }
  },

  /**
   * Handle room enter event (update HUD for new room)
   */
  onRoomEnter: function(evt) {
    const newRoomId = evt.detail.roomId;
    
    // Only update if entering our tracked room
    if (newRoomId === this.data.roomId) {
      // Update room name in HUD
      const roomNames = {
        'home': 'Sảnh chính',
        'room1': 'Phòng 1: Khởi hành (1911-1919)',
        'room2': 'Phòng 2: Ánh sáng Lênin (1920-1923)',
        'room3': 'Phòng 3: Quảng Châu (1924-1927)',
        'room4': 'Phòng 4: Hương Cảng (1930)',
        'ending': 'Kỷ nguyên mới'
      };
      
      const roomNameEl = document.getElementById('room-name');
      if (roomNameEl && roomNames[this.data.roomId]) {
        roomNameEl.textContent = roomNames[this.data.roomId];
      }
      
      // Update progress display
      this.updateHUDDisplay();
      console.log(`[ProgressTracker] Entered ${this.data.roomId}, progress: ${this.completedObjects.size}/${this.totalObjects}`);
    }
  },

  /**
   * Save progress to localStorage
   */
  saveProgress: function() {
    const progressData = {
      roomId: this.data.roomId,
      completedObjects: Array.from(this.completedObjects),
      totalObjects: this.totalObjects, // Save total for reference
      isComplete: this.isRoomComplete,
      timestamp: Date.now()
    };
    
    const storageKey = `museum-progress-${this.data.roomId}`;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      console.log(`[ProgressTracker] Progress saved for ${this.data.roomId}: ${this.completedObjects.size}/${this.totalObjects}`, Array.from(this.completedObjects));
    } catch (err) {
      console.warn('[ProgressTracker] Failed to save progress:', err);
    }
  },

  /**
   * Load progress from localStorage
   */
  loadProgress: function() {
    const storageKey = `museum-progress-${this.data.roomId}`;
    
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const progressData = JSON.parse(savedData);
        
        // Restore completed objects
        this.completedObjects = new Set(progressData.completedObjects);
        this.isRoomComplete = progressData.isComplete || false;
        
        console.log(`[ProgressTracker] Loaded progress for ${this.data.roomId}: ${this.completedObjects.size}/${this.totalObjects}`);
        
        // Restore interactive object states
        this.restoreObjectStates();
        
        // Check if door should be unlocked
        if (this.isRoomComplete && this.data.autoUnlockDoor) {
          this.unlockDoor();
        }
      }
    } catch (err) {
      console.warn('[ProgressTracker] Failed to load progress:', err);
    }
  },

  /**
   * Restore interactive object states from saved progress
   */
  restoreObjectStates: function() {
    // Find all interactive objects in the scene
    const interactiveObjects = document.querySelectorAll('[interactive-object]');
    
    this.completedObjects.forEach(objectId => {
      let found = false;
      
      // Iterate through all interactive objects
      interactiveObjects.forEach(objEl => {
        const component = objEl.components['interactive-object'];
        
        // Check if this object matches the saved objectId
        if (component && component.data.objectId === objectId) {
          found = true;
          
          // Mark as completed via component
          component.data.completed = true;
          component.markAsCompleted();
          
          console.log(`[ProgressTracker] Restored completed state for: ${objectId}`);
        }
      });
      
      if (!found) {
        console.warn(`[ProgressTracker] Could not find object to restore: ${objectId}`);
      }
    });
  },

  /**
   * Get current progress data
   */
  getProgress: function() {
    return {
      roomId: this.data.roomId,
      completedObjects: Array.from(this.completedObjects),
      totalObjects: this.totalObjects,
      isComplete: this.isRoomComplete,
      percentage: Math.round((this.completedObjects.size / this.totalObjects) * 100)
    };
  },

  /**
   * Reset room progress (for replay)
   */
  reset: function() {
    this.completedObjects.clear();
    this.isRoomComplete = false;
    
    // Clear saved progress
    if (this.data.enablePersistence) {
      const storageKey = `museum-progress-${this.data.roomId}`;
      localStorage.removeItem(storageKey);
    }
    
    // Update HUD
    this.updateHUDDisplay();
    
    // Reset all interactive objects
    this.data.objects.forEach(objectId => {
      const objectEl = document.querySelector(`[interactive-object="objectId: ${objectId}"]`);
      if (objectEl && objectEl.components['interactive-object']) {
        objectEl.components['interactive-object'].reset();
      }
    });
    
    // Lock door again
    const roomEntity = document.getElementById(this.data.roomId);
    if (roomEntity) {
      const door = roomEntity.querySelector(this.data.doorSelector);
      if (door) {
        door.setAttribute('door-portal', 'locked', true);
      }
    }
    
    console.log(`[ProgressTracker] Reset progress for ${this.data.roomId}`);
  },

  /**
   * Component removal cleanup
   */
  remove: function() {
    // Remove event listeners
    this.el.sceneEl.removeEventListener('object-completed', this.onObjectCompleted);
    this.el.sceneEl.removeEventListener('room-enter', this.onRoomEnter);
    
    console.log(`[ProgressTracker] Removed for ${this.data.roomId}`);
  }
});

/**
 * Global progress manager utility
 * Manages progress across all rooms
 */
window.ProgressManager = {
  /**
   * Get overall museum completion percentage
   */
  getOverallProgress: function() {
    const rooms = ['room1', 'room2', 'room3', 'room4'];
    let totalCompleted = 0;
    let totalRequired = 0;
    
    rooms.forEach(roomId => {
      const storageKey = `museum-progress-${roomId}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        const progress = JSON.parse(savedData);
        totalCompleted += progress.completedObjects.length;
      }
      
      // Default 3 objects per room
      totalRequired += 3;
    });
    
    return {
      completed: totalCompleted,
      total: totalRequired,
      percentage: Math.round((totalCompleted / totalRequired) * 100)
    };
  },

  /**
   * Reset all progress
   */
  resetAll: function() {
    const rooms = ['home', 'room1', 'room2', 'room3', 'room4', 'ending'];
    
    rooms.forEach(roomId => {
      const storageKey = `museum-progress-${roomId}`;
      localStorage.removeItem(storageKey);
    });
    
    console.log('[ProgressManager] All progress reset');
  },

  /**
   * Export progress data (for debugging/analytics)
   */
  exportProgress: function() {
    const rooms = ['home', 'room1', 'room2', 'room3', 'room4', 'ending'];
    const allProgress = {};
    
    rooms.forEach(roomId => {
      const storageKey = `museum-progress-${roomId}`;
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        allProgress[roomId] = JSON.parse(savedData);
      }
    });
    
    return allProgress;
  }
};

console.log('[ProgressTracker] Component registered successfully');
console.log('[ProgressManager] Global utility initialized');
