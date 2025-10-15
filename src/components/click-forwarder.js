/**
 * click-forwarder.js
 * 
 * Forwards click events from invisible collision boxes to their parent interactive objects.
 * Makes objects easier to click by providing larger click targets.
 * 
 * Created: October 15, 2025
 * 
 * Usage:
 * <a-entity position="0 1 -6">
 *   <a-cylinder class="interactive" interactive-object="..."></a-cylinder>
 *   <a-box class="clickable" data-interactive-target="obj-id" click-forwarder></a-box>
 * </a-entity>
 */

AFRAME.registerComponent('click-forwarder', {
  schema: {},

  init: function() {
    // Get the target object ID from data attribute
    this.targetId = this.el.getAttribute('data-interactive-target');
    
    // Bind event handlers
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
    
    // Add event listeners
    this.el.addEventListener('mouseenter', this.onMouseEnter);
    this.el.addEventListener('mouseleave', this.onMouseLeave);
    this.el.addEventListener('click', this.onClick);
    
    console.log(`[ClickForwarder] Initialized for target: ${this.targetId}`);
  },

  /**
   * Find the target interactive object
   */
  getTargetObject: function() {
    // Look for sibling with matching objectId
    const parent = this.el.parentNode;
    if (!parent) return null;
    
    // Find child with interactive-object component
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const interactiveComponent = child.components['interactive-object'];
      if (interactiveComponent && interactiveComponent.data.objectId === this.targetId) {
        return child;
      }
    }
    
    return null;
  },

  /**
   * Extract room ID from target object ID
   * Example: "obj-room1-map" -> "room1"
   */
  extractRoomIdFromObjectId: function() {
    const objectId = this.targetId;
    
    // Format: obj-{roomId}-{name}
    const parts = objectId.split('-');
    if (parts.length >= 3 && parts[0] === 'obj') {
      return parts[1]; // returns "room1", "room2", etc.
    }
    
    return null;
  },

  /**
   * Check if target object belongs to the currently visible room
   * SIMPLE APPROACH: Extract roomId from objectId and compare with currentRoom
   */
  isInCurrentRoom: function() {
    // Get room ID from target object's ID
    const myRoomId = this.extractRoomIdFromObjectId();
    
    // If we couldn't extract room ID, allow interaction
    if (!myRoomId) {
      return true;
    }
    
    // Get current room from room-manager
    const roomManager = document.querySelector('[room-manager]');
    if (!roomManager || !roomManager.components['room-manager']) {
      return true; // Allow if room-manager not available
    }
    
    const currentRoom = roomManager.components['room-manager'].data.currentRoom;
    const isInCurrentRoom = myRoomId === currentRoom;
    
    // Log blocking for debugging
    if (!isInCurrentRoom) {
      console.log(`[ClickForwarder] ${this.targetId}: Blocked - belongs to ${myRoomId}, but current room is ${currentRoom}`);
    }
    
    return isInCurrentRoom;
  },

  /**
   * Forward mouse enter event
   */
  onMouseEnter: function(evt) {
    // CRITICAL: Check if target belongs to current room first!
    if (!this.isInCurrentRoom()) {
      return;
    }
    
    const target = this.getTargetObject();
    if (target) {
      // Emit the event on the target object
      target.emit('mouseenter', evt);
      
      // Change cursor to indicate clickable
      document.body.style.cursor = 'pointer';
      
      console.log(`[ClickForwarder] Hover forwarded to: ${this.targetId}`);
    }
  },

  /**
   * Forward mouse leave event
   */
  onMouseLeave: function(evt) {
    if (!this.isInCurrentRoom()) return;
    
    const target = this.getTargetObject();
    if (target) {
      target.emit('mouseleave', evt);
      
      // Reset cursor
      document.body.style.cursor = 'default';
    }
  },

  /**
   * Forward click event
   */
  onClick: function(evt) {
    // CRITICAL: Check if target belongs to current room first!
    if (!this.isInCurrentRoom()) {
      console.warn(`[ClickForwarder] ${this.targetId}: Click blocked - not in current room`);
      return;
    }
    
    const target = this.getTargetObject();
    if (target) {
      // Emit click on the target object
      target.emit('click', evt);
      
      console.log(`[ClickForwarder] Click forwarded to: ${this.targetId}`);
    }
  },

  /**
   * Cleanup
   */
  remove: function() {
    this.el.removeEventListener('mouseenter', this.onMouseEnter);
    this.el.removeEventListener('mouseleave', this.onMouseLeave);
    this.el.removeEventListener('click', this.onClick);
  }
});

console.log('[ClickForwarder] Component registered');
