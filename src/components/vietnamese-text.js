/**
 * Vietnamese Text Component
 * A-Frame component for rendering Vietnamese text with proper diacritics
 * Uses troika-three-text for better Unicode support
 *
 * Usage:
 * <a-entity vietnamese-text="value: Bảo tàng Ảo Nguyễn Ái Quốc; color: #FFFFFF"></a-entity>
 */

AFRAME.registerComponent('vietnamese-text', {
  schema: {
    value: { type: 'string', default: '' },
    color: { type: 'color', default: '#FFFFFF' },
    fontSize: { type: 'number', default: 0.5 },
    align: { type: 'string', default: 'center' }, // left, center, right
    width: { type: 'number', default: 4 },
    position: { type: 'vec3', default: { x: 0, y: 0, z: 0 } },
    lineHeight: { type: 'number', default: 1.2 }
  },

  init: function () {
    this.mesh = null;

    // Parse value to handle escaped newlines
    // Replace literal '\n' string with actual newline character
    if (this.data.value) {
      this.data.value = this.data.value.replace(/\\n/g, '\n');
    }

    // Check if troika is available
    if (typeof THREE.TextMesh === 'undefined') {
      console.warn('[Vietnamese Text] Troika-three-text not loaded, falling back to canvas-based text');
      this.useCanvasText();
    } else {
      this.useTroikaText();
    }
  },

  useCanvasText: function () {
    // Fallback: Create text using canvas texture (supports Vietnamese)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 2048;
    canvas.height = 1024;

    // Clear canvas with transparent background
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Configure font with Vietnamese support
    const fontSize = Math.floor(this.data.fontSize * 200);
    context.font = `${fontSize}px "Noto Sans", "Roboto", Arial, sans-serif`;
    context.fillStyle = this.data.color;
    context.textAlign = this.data.align;
    context.textBaseline = 'middle';  // Important for vertical alignment

    // Handle multi-line text
    const lines = this.data.value.split('\n');
    const lineHeight = fontSize * this.data.lineHeight;

    // Calculate starting Y position for center alignment
    const totalHeight = lines.length * lineHeight;
    let startY = (canvas.height - totalHeight) / 2 + (lineHeight / 2);

    // Draw each line
    lines.forEach((line, index) => {
      const x = this.data.align === 'center' ? canvas.width / 2 :
                this.data.align === 'right' ? canvas.width - 100 : 100;
      const y = startY + (index * lineHeight);
      context.fillText(line, x, y);
    });

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create material with texture
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });

    // Create plane geometry
    const width = this.data.width;
    const height = width * (canvas.height / canvas.width);
    const geometry = new THREE.PlaneGeometry(width, height);

    // Create mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.el.setObject3D('mesh', this.mesh);

    console.log('[Vietnamese Text] Canvas-based text rendered:', this.data.value);
  },

  useTroikaText: function () {
    // Future implementation with troika-three-text
    // For now, fall back to canvas
    this.useCanvasText();
  },

  update: function (oldData) {
    // Re-render if value or color changes
    if (oldData.value !== this.data.value ||
        oldData.color !== this.data.color ||
        oldData.fontSize !== this.data.fontSize) {
      this.remove();
      this.init();
    }
  },

  remove: function () {
    if (this.mesh) {
      this.el.removeObject3D('mesh');

      // Dispose geometry and material
      if (this.mesh.geometry) this.mesh.geometry.dispose();
      if (this.mesh.material) {
        if (this.mesh.material.map) this.mesh.material.map.dispose();
        this.mesh.material.dispose();
      }

      this.mesh = null;
    }
  }
});

console.log('[Vietnamese Text] Component registered');
