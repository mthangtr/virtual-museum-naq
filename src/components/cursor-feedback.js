/**
 * cursor-feedback.js
 * 
 * Visual feedback for the 3D cursor in the scene.
 * Changes cursor appearance when hovering over interactive objects.
 * 
 * Created: October 15, 2025
 */

AFRAME.registerComponent('cursor-feedback', {
  schema: {},

  init: function() {
    this.originalColor = '#FFFFFF';
    this.hoverColor = '#FFD700';
    this.isHovering = false;
    
    // Listen for cursor-hover events from scene
    this.onCursorHover = this.onCursorHover.bind(this);
    this.el.sceneEl.addEventListener('cursor-hover', this.onCursorHover);
    
    console.log('[CursorFeedback] Initialized');
  },

  onCursorHover: function(evt) {
    const hovering = evt.detail.hovering;
    
    if (hovering && !this.isHovering) {
      // Start hovering - change to gold
      this.isHovering = true;
      this.el.setAttribute('material', 'color', this.hoverColor);
      
      // Add pulsing animation
      this.el.setAttribute('animation__pulse', {
        property: 'scale',
        to: '1.3 1.3 1.3',
        dur: 500,
        easing: 'easeInOutQuad',
        loop: true,
        dir: 'alternate'
      });
      
    } else if (!hovering && this.isHovering) {
      // Stop hovering - change back to white
      this.isHovering = false;
      this.el.setAttribute('material', 'color', this.originalColor);
      
      // Remove animation
      this.el.removeAttribute('animation__pulse');
      this.el.setAttribute('scale', '1 1 1');
    }
  },

  remove: function() {
    this.el.sceneEl.removeEventListener('cursor-hover', this.onCursorHover);
  }
});

console.log('[CursorFeedback] Component registered');
