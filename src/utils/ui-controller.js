/**
 * ui-controller.js
 * 
 * Utility module for managing UI elements (popups, modals, notifications, HUD).
 * Handles popup display for interactive objects, notification system, and HUD updates.
 * 
 * Sprint 3: Interactive Object System
 * Created: October 15, 2025
 * 
 * Features:
 * - Popup/modal system for object details
 * - Notification banner system
 * - HUD state management
 * - Cursor appearance control
 * - Loading screen management
 * - Vietnamese text support
 * 
 * Usage:
 * UIController.showPopup({
 *   title: 'Tàu Ba Son',
 *   description: '...',
 *   image: 'assets/images/ship.jpg'
 * });
 */

const UIController = (function() {
  'use strict';

  // Private state
  let isPopupOpen = false;
  let isLoading = false;
  let hudVisible = true;
  let currentNotification = null;

  /**
   * Initialize UI controller
   */
  function init() {
    console.log('[UIController] Initializing...');
    
    // Create UI elements if they don't exist
    createPopupElement();
    createNotificationElement();
    createLoadingScreen();
    createTooltipElement();
    initializeHUD();
    
    // Setup event listeners
    setupEventListeners();
    setupHUDButtonListeners();
    
    console.log('[UIController] Initialized successfully');
  }

  /**
   * Create popup modal element
   */
  function createPopupElement() {
    if (document.getElementById('popup-modal')) return;

    const popup = document.createElement('div');
    popup.id = 'popup-modal';
    popup.className = 'popup-modal hidden';
    popup.innerHTML = `
      <div class="popup-overlay"></div>
      <div class="popup-content">
        <button class="popup-close" aria-label="Close popup">
          <span>&times;</span>
        </button>
        <div class="popup-image-container">
          <img id="popup-image" src="" alt="" class="popup-image">
        </div>
        <div class="popup-body">
          <h2 id="popup-title" class="popup-title"></h2>
          <p id="popup-description" class="popup-description"></p>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);

    // Close button handler
    popup.querySelector('.popup-close').addEventListener('click', closePopup);
    popup.querySelector('.popup-overlay').addEventListener('click', closePopup);
  }

  /**
   * Create notification banner element
   */
  function createNotificationElement() {
    if (document.getElementById('notification-banner')) return;

    const notification = document.createElement('div');
    notification.id = 'notification-banner';
    notification.className = 'notification-banner hidden';
    notification.innerHTML = `
      <div class="notification-content">
        <h3 id="notification-title" class="notification-title"></h3>
        <p id="notification-message" class="notification-message"></p>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  /**
   * Create loading screen element
   */
  function createLoadingScreen() {
    if (document.getElementById('loading-screen')) return;

    const loading = document.createElement('div');
    loading.id = 'loading-screen';
    loading.className = 'loading-screen hidden';
    loading.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h2 class="loading-title">Đang tải...</h2>
        <p id="loading-message" class="loading-message">Loading museum assets</p>
      </div>
    `;
    
    document.body.appendChild(loading);
  }

  /**
   * Create tooltip element
   */
  function createTooltipElement() {
    if (document.getElementById('tooltip')) return;

    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.className = 'tooltip hidden';
    tooltip.innerHTML = `
      <span class="tooltip-text"></span>
    `;
    
    document.body.appendChild(tooltip);
  }

  /**
   * Initialize HUD elements
   */
  function initializeHUD() {
    const hud = document.getElementById('hud');
    if (!hud) {
      console.warn('[UIController] HUD element not found in HTML');
      return;
    }

    // Show HUD
    hud.style.display = 'block';
    
    // Set initial values
    updateRoomName('Phòng Khởi đầu');
    updateProgress(0, 3);
  }

  /**
   * Setup global event listeners
   */
  function setupEventListeners() {
    const sceneEl = document.querySelector('a-scene');
    if (!sceneEl) return;

    // Listen for object-click events (show popup)
    sceneEl.addEventListener('object-click', (evt) => {
      showPopup({
        title: evt.detail.title,
        description: evt.detail.description,
        image: evt.detail.image
      });
    });

    // Listen for room-enter events (update HUD)
    sceneEl.addEventListener('room-enter', (evt) => {
      updateRoomName(getRoomDisplayName(evt.detail.roomId));
    });

    // Listen for show-notification events
    sceneEl.addEventListener('show-notification', (evt) => {
      showNotification(evt.detail);
    });

    // Listen for cursor-hover events (change cursor appearance)
    sceneEl.addEventListener('cursor-hover', (evt) => {
      setCursorHover(evt.detail.hovering);
    });

    // ESC key to close popup
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && isPopupOpen) {
        closePopup();
      }
    });
  }

  /**
   * Show popup modal with object details
   */
  function showPopup(data) {
    const popup = document.getElementById('popup-modal');
    if (!popup) return;

    // Populate content
    document.getElementById('popup-title').textContent = data.title || '';
    document.getElementById('popup-description').textContent = data.description || '';
    
    const img = document.getElementById('popup-image');
    if (data.image) {
      img.src = data.image;
      img.alt = data.title || 'Museum object';
      img.style.display = 'block';
    } else {
      img.style.display = 'none';
    }

    // Show popup
    popup.classList.remove('hidden');
    popup.classList.add('visible');
    isPopupOpen = true;

    // Pause game (lock player controls)
    pauseGame();

    console.log('[UIController] Popup opened:', data.title);
  }

  /**
   * Close popup modal
   */
  function closePopup() {
    const popup = document.getElementById('popup-modal');
    if (!popup) return;

    popup.classList.remove('visible');
    popup.classList.add('hidden');
    isPopupOpen = false;

    // Resume game
    resumeGame();

    console.log('[UIController] Popup closed');
  }

  /**
   * Show notification banner
   */
  function showNotification(data) {
    const notification = document.getElementById('notification-banner');
    if (!notification) return;

    // Clear existing notification
    if (currentNotification) {
      clearTimeout(currentNotification);
    }

    // Populate content
    document.getElementById('notification-title').textContent = data.title || '';
    document.getElementById('notification-message').textContent = data.message || '';

    // Apply type-specific styling
    notification.className = 'notification-banner visible';
    if (data.type) {
      notification.classList.add(`notification-${data.type}`);
    }

    // Auto-hide after duration
    const duration = data.duration || 3000;
    currentNotification = setTimeout(() => {
      hideNotification();
    }, duration);

    console.log('[UIController] Notification shown:', data.title);
  }

  /**
   * Hide notification banner
   */
  function hideNotification() {
    const notification = document.getElementById('notification-banner');
    if (!notification) return;

    notification.classList.remove('visible');
    notification.classList.add('hidden');
    currentNotification = null;
  }

  /**
   * Show loading screen
   */
  function showLoading(message = 'Đang tải...') {
    const loading = document.getElementById('loading-screen');
    if (!loading) return;

    document.getElementById('loading-message').textContent = message;
    loading.classList.remove('hidden');
    loading.classList.add('visible');
    isLoading = true;

    console.log('[UIController] Loading screen shown');
  }

  /**
   * Hide loading screen
   */
  function hideLoading() {
    const loading = document.getElementById('loading-screen');
    if (!loading) return;

    loading.classList.remove('visible');
    loading.classList.add('hidden');
    isLoading = false;

    console.log('[UIController] Loading screen hidden');
  }

  /**
   * Update HUD room name
   */
  function updateRoomName(roomName) {
    const roomNameEl = document.getElementById('room-name');
    if (roomNameEl) {
      roomNameEl.textContent = roomName;
    }
  }

  /**
   * Update HUD progress display
   */
  function updateProgress(current, total) {
    const progressEl = document.getElementById('progress');
    if (progressEl) {
      progressEl.textContent = `${current}/${total}`;
      
      // Add completion styling
      if (current >= total) {
        progressEl.style.color = '#4CAF50';
      } else {
        progressEl.style.color = '#FFFFFF';
      }
    }
  }

  /**
   * Toggle HUD visibility
   */
  function toggleHUD(visible) {
    const hud = document.getElementById('hud');
    if (hud) {
      hud.style.display = visible ? 'block' : 'none';
      hudVisible = visible;
    }
  }

  /**
   * Set cursor hover appearance
   */
  function setCursorHover(hovering) {
    const crosshair = document.getElementById('crosshair');
    if (crosshair) {
      if (hovering) {
        crosshair.classList.add('hover');
      } else {
        crosshair.classList.remove('hover');
      }
    }
  }

  /**
   * Pause game (lock player controls)
   */
  function pauseGame() {
    const rig = document.getElementById('rig');
    if (rig) {
      // Disable movement controls
      rig.setAttribute('movement-controls', 'enabled', false);
    }

    const camera = document.getElementById('camera');
    if (camera) {
      // Disable look controls
      camera.setAttribute('look-controls', 'enabled', false);
    }

    // Disable teleport navigation
    const teleport = document.querySelector('[teleport-navigation]');
    if (teleport) {
      teleport.setAttribute('teleport-navigation', 'enabled', false);
    }

    console.log('[UIController] Game paused');
  }

  /**
   * Resume game (unlock player controls)
   */
  function resumeGame() {
    const rig = document.getElementById('rig');
    if (rig) {
      rig.setAttribute('movement-controls', 'enabled', true);
    }

    const camera = document.getElementById('camera');
    if (camera) {
      camera.setAttribute('look-controls', 'enabled', true);
      
      // Request pointer lock again to keep cursor in game
      const canvas = document.querySelector('a-scene').canvas;
      if (canvas && canvas.requestPointerLock) {
        // Small delay to ensure controls are ready
        setTimeout(() => {
          canvas.requestPointerLock();
        }, 100);
      }
    }

    const teleport = document.querySelector('[teleport-navigation]');
    if (teleport) {
      teleport.setAttribute('teleport-navigation', 'enabled', true);
    }

    console.log('[UIController] Game resumed');
  }

  /**
   * Show tooltip at cursor position
   */
  function showTooltip(text, x, y) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    const tooltipText = tooltip.querySelector('.tooltip-text');
    tooltipText.textContent = text;
    
    // Position tooltip near cursor with offset
    tooltip.style.left = (x + 15) + 'px';
    tooltip.style.top = (y + 15) + 'px';
    
    tooltip.classList.remove('hidden');
  }

  /**
   * Hide tooltip
   */
  function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.classList.add('hidden');
  }

  /**
   * Setup HUD button event listeners
   */
  function setupHUDButtonListeners() {
    // Audio toggle button
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
      let audioEnabled = true;
      audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggle.textContent = audioEnabled ? '🔊' : '🔇';
        audioToggle.title = audioEnabled ? 'Tắt âm thanh' : 'Bật âm thanh';
        
        // Emit event for audio manager
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
          sceneEl.emit('audio-toggle', { enabled: audioEnabled });
        }
        
        showNotification({
          title: audioEnabled ? 'Âm thanh đã bật' : 'Âm thanh đã tắt',
          message: audioEnabled ? 'Audio enabled' : 'Audio muted',
          type: 'info',
          duration: 2000
        });
      });
    }

    // Help button
    const helpButton = document.getElementById('help-button');
    if (helpButton) {
      helpButton.addEventListener('click', () => {
        showHelpModal();
      });
    }

    // Home button (if exists)
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
      homeButton.addEventListener('click', () => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
          sceneEl.emit('request-room-change', { targetRoom: 'home' });
        }
      });
    }
  }

  /**
   * Show help modal with controls guide
   */
  function showHelpModal() {
    const helpContent = `
      <div class="help-modal-content">
        <h2>Hướng dẫn điều khiển</h2>
        <div class="help-section">
          <h3>Di chuyển</h3>
          <ul>
            <li><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> hoặc <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> - Di chuyển</li>
            <li><kbd>Shift</kbd> - Chạy nhanh</li>
            <li><kbd>C</kbd> - Cúi xuống</li>
          </ul>
        </div>
        <div class="help-section">
          <h3>Tương tác</h3>
          <ul>
            <li><strong>Chuột</strong> - Xoay camera</li>
            <li><strong>Click chuột trái</strong> - Tương tác với vật thể</li>
            <li><kbd>E</kbd> - Mở cửa (khi ở gần)</li>
            <li><kbd>T</kbd> - Giữ để dịch chuyển nhanh</li>
          </ul>
        </div>
        <div class="help-section">
          <h3>Cách chơi</h3>
          <ul>
            <li>Nhìn vào các vật thể phát sáng vàng</li>
            <li>Click để tìm hiểu thông tin lịch sử</li>
            <li>Hoàn thành 3/3 vật thể để mở cửa tiếp theo</li>
          </ul>
        </div>
        <div class="help-section">
          <h3>Di động</h3>
          <ul>
            <li><strong>Joystick ảo</strong> (góc dưới trái) - Di chuyển</li>
            <li><strong>Vuốt màn hình</strong> - Xoay camera</li>
            <li><strong>Chạm vào vật thể</strong> - Tương tác</li>
          </ul>
        </div>
      </div>
    `;

    showPopup({
      title: '❓ Trợ giúp',
      description: helpContent,
      image: null
    });
  }

  /**
   * Get display name for room ID
   */
  function getRoomDisplayName(roomId) {
    const roomNames = {
      'home': 'Phòng Khởi đầu',
      'room1': 'Phòng 1: Khởi hành (1911-1919)',
      'room2': 'Phòng 2: Ánh sáng Lênin (1920-1923)',
      'room3': 'Phòng 3: Quảng Châu (1924-1927)',
      'room4': 'Phòng 4: Hội nghị Hương Cảng (1930)',
      'ending': 'Kỷ nguyên mới'
    };
    
    return roomNames[roomId] || roomId;
  }

  /**
   * Get UI state
   */
  function getState() {
    return {
      isPopupOpen,
      isLoading,
      hudVisible,
      hasNotification: currentNotification !== null
    };
  }

  // Public API
  return {
    init,
    showPopup,
    closePopup,
    showNotification,
    hideNotification,
    showLoading,
    hideLoading,
    showTooltip,
    hideTooltip,
    updateRoomName,
    updateProgress,
    toggleHUD,
    setCursorHover,
    pauseGame,
    resumeGame,
    getState
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    UIController.init();
  });
} else {
  UIController.init();
}

// Export for use in other scripts
window.UIController = UIController;

console.log('[UIController] Module loaded successfully');
