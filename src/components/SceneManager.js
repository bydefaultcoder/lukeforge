/**
 * SceneManager.js
 * Manages the Three.js scene, renderer, camera, and animation loop
 * Handles performance optimization and page visibility
 */

import * as THREE from 'three';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
    this.isRendering = false;
    this.clock = new THREE.Clock();
    this.animateCallbacks = [];
    
    this.init();
    this.setupEventListeners();
  }
  
  init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 10, 50);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer with performance optimizations
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    this.container.appendChild(this.renderer.domElement);
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x0EA5E9, 1.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    // Add accent light
    const accentLight = new THREE.PointLight(0x0EA5E9, 2, 20);
    accentLight.position.set(-3, 2, 3);
    this.scene.add(accentLight);
    
    // Add soft fill light
    const fillLight = new THREE.PointLight(0xF0F9FF, 0.5, 15);
    fillLight.position.set(0, -2, 2);
    this.scene.add(fillLight);
  }
  
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    // Handle page visibility to pause rendering when hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopRendering();
      } else {
        this.startRendering();
      }
    });
    
    // Handle focus/blur for additional performance optimization
    window.addEventListener('blur', () => this.stopRendering());
    window.addEventListener('focus', () => this.startRendering());
  }
  
  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  /**
   * Register a callback to be called on each animation frame
   * @param {Function} callback - Function to call with (deltaTime, elapsedTime)
   */
  onAnimate(callback) {
    this.animateCallbacks.push(callback);
  }
  
  /**
   * Main animation loop using requestAnimationFrame
   */
  animate = () => {
    if (!this.isRendering) return;
    
    this.animationId = requestAnimationFrame(this.animate);
    
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Call all registered animation callbacks
    this.animateCallbacks.forEach(callback => {
      callback(deltaTime, elapsedTime);
    });
    
    // Render the scene
    this.renderer.render(this.scene, this.camera);
  };
  
  startRendering() {
    if (this.isRendering) return;
    
    this.isRendering = true;
    this.clock.start();
    this.animate();
  }
  
  stopRendering() {
    if (!this.isRendering) return;
    
    this.isRendering = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  /**
   * Add an object to the scene
   * @param {THREE.Object3D} object - Object to add
   */
  add(object) {
    this.scene.add(object);
  }
  
  /**
   * Remove an object from the scene
   * @param {THREE.Object3D} object - Object to remove
   */
  remove(object) {
    this.scene.remove(object);
  }
  
  /**
   * Clean up resources
   */
  dispose() {
    this.stopRendering();
    
    // Dispose of geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
    
    // Clear scene
    if (this.scene) {
      this.scene.clear();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('visibilitychange', this.stopRendering);
    window.removeEventListener('blur', this.stopRendering);
    window.removeEventListener('focus', this.startRendering);
  }
  
  /**
   * Get the current camera
   * @returns {THREE.Camera}
   */
  getCamera() {
    return this.camera;
  }
  
  /**
   * Get the current scene
   * @returns {THREE.Scene}
   */
  getScene() {
    return this.scene;
  }
  
  /**
   * Get the current renderer
   * @returns {THREE.WebGLRenderer}
   */
  getRenderer() {
    return this.renderer;
  }
}

