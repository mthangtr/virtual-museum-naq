/**
 * Room Manager Component
 * Manages room visibility, transitions, and state for the virtual museum
 *
 * Usage:
 * <a-entity room-manager="currentRoom: home; rooms: home, room1, room2, room3, room4, ending"></a-entity>
 */

AFRAME.registerComponent('room-manager', {
  schema: {
    currentRoom: { type: 'string', default: 'home' },
    rooms: { type: 'array', default: ['home', 'room1', 'room2', 'room3', 'room4', 'ending'] },
    transitionDuration: { type: 'number', default: 1500 }, // milliseconds
    preloadDistance: { type: 'number', default: 1 } // preload N rooms ahead
  },

  init: function () {
    this.roomStates = new Map();
    this.isTransitioning = false;
    this.loadedRooms = new Set();

    // Initialize room states
    this.data.rooms.forEach(roomId => {
      this.roomStates.set(roomId, {
        id: roomId,
        visible: roomId === this.data.currentRoom,
        loaded: false,
        entity: null
      });
    });

    // Event listeners
    this.onSwitchRoom = this.onSwitchRoom.bind(this);
    this.el.sceneEl.addEventListener('switch-room', this.onSwitchRoom);

    console.log('[Room Manager] Initialized with rooms:', this.data.rooms);
    console.log('[Room Manager] Current room:', this.data.currentRoom);

    // Initialize rooms after scene is loaded
    this.el.sceneEl.addEventListener('loaded', () => {
      this.initializeRooms();
      this.showRoom(this.data.currentRoom);
    });
  },

  initializeRooms: function () {
    // Find and register all room entities
    this.data.rooms.forEach(roomId => {
      const roomEntity = document.querySelector(`#${roomId}`);
      if (roomEntity) {
        const state = this.roomStates.get(roomId);
        state.entity = roomEntity;
        state.loaded = true;

        // Hide all rooms except current
        if (roomId !== this.data.currentRoom) {
          roomEntity.setAttribute('visible', false);
        }

        console.log(`[Room Manager] Registered room: ${roomId}`);
      } else {
        console.warn(`[Room Manager] Room entity not found: #${roomId}`);
      }
    });
  },

  onSwitchRoom: function (evt) {
    const targetRoom = evt.detail.targetRoom;
    const sourceRoom = this.data.currentRoom;

    if (!targetRoom) {
      console.error('[Room Manager] No target room specified');
      return;
    }

    if (targetRoom === sourceRoom) {
      console.log('[Room Manager] Already in target room:', targetRoom);
      return;
    }

    if (this.isTransitioning) {
      console.log('[Room Manager] Transition already in progress');
      return;
    }

    if (!this.roomStates.has(targetRoom)) {
      console.error('[Room Manager] Target room does not exist:', targetRoom);
      return;
    }

    console.log(`[Room Manager] Switching from ${sourceRoom} to ${targetRoom}`);
    this.switchRoom(sourceRoom, targetRoom);
  },

  switchRoom: function (fromRoom, toRoom) {
    this.isTransitioning = true;

    // Emit transition start event
    this.el.sceneEl.emit('room-transition-start', {
      from: fromRoom,
      to: toRoom
    });

    // Exit current room
    const fromState = this.roomStates.get(fromRoom);
    if (fromState && fromState.entity) {
      this.el.sceneEl.emit('room-exit', { roomId: fromRoom });
    }

    // Transition delay (for fade effects, etc.)
    setTimeout(() => {
      this.hideRoom(fromRoom);
      this.showRoom(toRoom);

      // Update current room
      this.data.currentRoom = toRoom;

      // Emit enter event
      this.el.sceneEl.emit('room-enter', { roomId: toRoom });

      // Preload next rooms
      this.preloadNextRooms(toRoom);

      // Transition complete
      setTimeout(() => {
        this.isTransitioning = false;
        this.el.sceneEl.emit('room-transition-complete', {
          from: fromRoom,
          to: toRoom
        });
      }, 500);

    }, this.data.transitionDuration);
  },

  showRoom: function (roomId) {
    const state = this.roomStates.get(roomId);
    if (!state) {
      console.error('[Room Manager] Room state not found:', roomId);
      return;
    }

    if (!state.entity) {
      console.error('[Room Manager] Room entity not found:', roomId);
      return;
    }

    state.visible = true;
    state.entity.setAttribute('visible', true);

    console.log(`[Room Manager] Showing room: ${roomId}`);
  },

  hideRoom: function (roomId) {
    const state = this.roomStates.get(roomId);
    if (!state || !state.entity) return;

    state.visible = false;
    state.entity.setAttribute('visible', false);

    console.log(`[Room Manager] Hiding room: ${roomId}`);
  },

  preloadNextRooms: function (currentRoom) {
    const currentIndex = this.data.rooms.indexOf(currentRoom);
    if (currentIndex === -1) return;

    // Preload next N rooms
    for (let i = 1; i <= this.data.preloadDistance; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < this.data.rooms.length) {
        const nextRoomId = this.data.rooms[nextIndex];
        if (!this.loadedRooms.has(nextRoomId)) {
          this.loadRoom(nextRoomId);
        }
      }
    }
  },

  loadRoom: function (roomId) {
    // Placeholder for lazy loading assets
    // In future sprints, this will load models, textures, audio
    this.loadedRooms.add(roomId);
    console.log(`[Room Manager] Preloaded room: ${roomId}`);
  },

  getCurrentRoom: function () {
    return this.data.currentRoom;
  },

  isRoomVisible: function (roomId) {
    const state = this.roomStates.get(roomId);
    return state ? state.visible : false;
  },

  remove: function () {
    this.el.sceneEl.removeEventListener('switch-room', this.onSwitchRoom);
  }
});

console.log('[Room Manager] Component registered');
