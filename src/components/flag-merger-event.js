/**
 * flag-merger-event.js
 *
 * Special event system for Room 4 flag merger animation.
 * Triggers dramatic visual event when all 3 flags are explored.
 *
 * Sprint 6: Room 4 Special Event Implementation
 * Created: October 15, 2025
 *
 * Features:
 * - Listens for room4 completion
 * - Animates 3 individual flags merging together
 * - Reveals unified Communist Party flag
 * - Particle effects and dramatic lighting
 * - Sound effects (celebration)
 *
 * Usage:
 * <a-entity flag-merger-event></a-entity>
 */

AFRAME.registerComponent('flag-merger-event', {
  schema: {
    // Room ID to monitor
    roomId: {
      type: 'string',
      default: 'room4'
    },

    // Enable/disable the event
    enabled: {
      type: 'boolean',
      default: true
    },

    // Animation duration in milliseconds
    animationDuration: {
      type: 'number',
      default: 3000
    }
  },

  /**
   * Component initialization
   */
  init: function() {
    this.hasTriggered = false;
    this.isAnimating = false;

    // Bind event handlers
    this.onRoomComplete = this.onRoomComplete.bind(this);

    // Listen for room-complete events
    this.el.sceneEl.addEventListener('room-complete', this.onRoomComplete);

    console.log('[FlagMergerEvent] Initialized - monitoring room4 completion');
  },

  /**
   * Handle room completion event
   */
  onRoomComplete: function(evt) {
    if (!this.data.enabled) return;
    if (this.hasTriggered) return;
    if (this.isAnimating) return;

    const completedRoomId = evt.detail.roomId;

    // Only trigger for room4
    if (completedRoomId !== this.data.roomId) return;

    console.log('[FlagMergerEvent] Room 4 complete! Triggering flag merger animation...');

    this.hasTriggered = true;
    this.isAnimating = true;

    // Start the merger sequence
    this.startMergerAnimation();
  },

  /**
   * Start the flag merger animation sequence
   */
  startMergerAnimation: function() {
    // Phase 1: Hide individual flags (0-1s)
    setTimeout(() => {
      this.hideIndividualFlags();
    }, 500);

    // Phase 2: Show unified flag (1-2s)
    setTimeout(() => {
      this.showUnifiedFlag();
    }, 1500);

    // Phase 3: Play celebration effects (2-5s)
    setTimeout(() => {
      this.playCelebrationEffects();
    }, 2500);

    // Phase 4: Complete animation (5s)
    setTimeout(() => {
      this.completeAnimation();
    }, 5000);
  },

  /**
   * Phase 1: Hide individual flags with fade animation
   */
  hideIndividualFlags: function() {
    console.log('[FlagMergerEvent] Phase 1: Hiding individual flags...');

    const flag1 = document.getElementById('flag1-entity');
    const flag2 = document.getElementById('flag2-entity');
    const flag3 = document.getElementById('flag3-entity');

    if (!flag1 || !flag2 || !flag3) {
      console.warn('[FlagMergerEvent] Flag entities not found!');
      return;
    }

    // Animate flags moving toward center
    flag1.setAttribute('animation__move', {
      property: 'position',
      to: '0 1.5 -8',
      dur: 1000,
      easing: 'easeInOutQuad'
    });

    flag2.setAttribute('animation__move', {
      property: 'position',
      to: '0 1.5 -8',
      dur: 1000,
      easing: 'easeInOutQuad'
    });

    flag3.setAttribute('animation__move', {
      property: 'position',
      to: '0 1.5 -8',
      dur: 1000,
      easing: 'easeInOutQuad'
    });

    // Fade out flags
    setTimeout(() => {
      flag1.setAttribute('animation__fade', {
        property: 'opacity',
        to: 0,
        dur: 500,
        easing: 'easeOutQuad'
      });

      flag2.setAttribute('animation__fade', {
        property: 'opacity',
        to: 0,
        dur: 500,
        easing: 'easeOutQuad'
      });

      flag3.setAttribute('animation__fade', {
        property: 'opacity',
        to: 0,
        dur: 500,
        easing: 'easeOutQuad'
      });

      // Hide flags completely after fade
      setTimeout(() => {
        flag1.setAttribute('visible', false);
        flag2.setAttribute('visible', false);
        flag3.setAttribute('visible', false);
      }, 600);
    }, 800);
  },

  /**
   * Phase 2: Show unified Communist Party flag
   */
  showUnifiedFlag: function() {
    console.log('[FlagMergerEvent] Phase 2: Showing unified flag...');

    const unifiedFlag = document.getElementById('unified-flag');

    if (!unifiedFlag) {
      console.warn('[FlagMergerEvent] Unified flag entity not found!');
      return;
    }

    // Make flag visible
    unifiedFlag.setAttribute('visible', true);

    // Trigger appear animation
    unifiedFlag.emit('show-unified-flag');

    // Show notification
    this.el.sceneEl.emit('show-notification', {
      title: 'Đảng Cộng sản Việt Nam',
      message: 'Thành lập ngày 3 tháng 2 năm 1930 tại Hương Cảng (Hong Kong)',
      type: 'success',
      duration: 5000
    });
  },

  /**
   * Phase 3: Play celebration particle effects and sound
   */
  playCelebrationEffects: function() {
    console.log('[FlagMergerEvent] Phase 3: Playing celebration effects...');

    // Play celebration sound
    this.el.sceneEl.emit('play-sound', {
      soundId: 'celebration',
      volume: 0.7
    });

    // Emit light burst
    const spotlight = document.querySelector('#room4 [light="type: spot"]');
    if (spotlight) {
      spotlight.setAttribute('animation__burst', {
        property: 'light.intensity',
        from: 1.5,
        to: 3.0,
        dur: 500,
        dir: 'alternate',
        loop: 3,
        easing: 'easeInOutQuad'
      });
    }
  },

  /**
   * Phase 4: Complete animation sequence
   */
  completeAnimation: function() {
    console.log('[FlagMergerEvent] Animation complete!');

    this.isAnimating = false;

    // Emit completion event
    this.el.sceneEl.emit('flag-merger-complete', {
      roomId: this.data.roomId
    });

    // Show final message
    this.el.sceneEl.emit('show-notification', {
      title: 'Thời khắc lịch sử',
      message: 'Ba tổ chức cộng sản đã hợp nhất thành Đảng Cộng sản Việt Nam, mở ra kỷ nguyên mới cho cách mạng Việt Nam.',
      type: 'success',
      duration: 6000
    });
  },

  /**
   * Reset the event (for replay/testing)
   */
  reset: function() {
    this.hasTriggered = false;
    this.isAnimating = false;

    // Reset flag visibility
    const flag1 = document.getElementById('flag1-entity');
    const flag2 = document.getElementById('flag2-entity');
    const flag3 = document.getElementById('flag3-entity');
    const unifiedFlag = document.getElementById('unified-flag');

    if (flag1) {
      flag1.setAttribute('visible', true);
      flag1.setAttribute('opacity', 1);
      flag1.setAttribute('position', '-3 1.5 -8');
    }

    if (flag2) {
      flag2.setAttribute('visible', true);
      flag2.setAttribute('opacity', 1);
      flag2.setAttribute('position', '0 1.5 -8');
    }

    if (flag3) {
      flag3.setAttribute('visible', true);
      flag3.setAttribute('opacity', 1);
      flag3.setAttribute('position', '3 1.5 -8');
    }

    if (unifiedFlag) {
      unifiedFlag.setAttribute('visible', false);
    }

    console.log('[FlagMergerEvent] Reset complete');
  },

  /**
   * Component removal cleanup
   */
  remove: function() {
    this.el.sceneEl.removeEventListener('room-complete', this.onRoomComplete);
    console.log('[FlagMergerEvent] Removed');
  }
});

console.log('[FlagMergerEvent] Component registered successfully');
