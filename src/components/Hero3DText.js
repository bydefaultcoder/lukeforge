/**
 * Hero3DText.js
 * Creates and manages the 3D "Lukeforge" text in the hero section
 * Handles text geometry, materials, and interactive effects
 */

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class Hero3DText {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.textMesh = null;
    this.targetRotation = { x: 0, y: 0 };
    this.currentRotation = { x: 0, y: 0 };
    this.targetScale = 1;
    this.currentScale = 1;
    this.isHovered = false;
    
    this.init();
  }
  
  async init() {
    try {
      // Try to load custom font, fallback to creating geometric text
      await this.createText();
      
      // Register animation callback
      this.sceneManager.onAnimate((deltaTime) => this.animate(deltaTime));
    } catch (error) {
      console.error('Error creating 3D text:', error);
      // Fallback to simple geometric representation
      this.createFallbackText();
    }
  }
  
  async createText() {
    // Create font loader
    const fontLoader = new FontLoader();
    
    // Load font (using Three.js built-in font as fallback)
    return new Promise((resolve, reject) => {
      // Use a CDN for the font JSON
      const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';
      
      fontLoader.load(
        fontUrl,
        (font) => {
          // Create text geometry
          const textGeometry = new TextGeometry('LUKEFORGE', {
            font: font,
            size: 0.8,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
          });
          
          // Center the text
          textGeometry.center();
          
          // Create material with gradient-like effect using vertex colors
          const material = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            metalness: 0.2,
            roughness: 0.5,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.2,
          });
          
          // Create mesh
          this.textMesh = new THREE.Mesh(textGeometry, material);
          this.textMesh.position.set(0, 0, 0);
          
          // Add to scene
          this.sceneManager.add(this.textMesh);
          
          // Add subtle glow
          this.addGlow();
          
          resolve();
        },
        undefined,
        (error) => {
          console.warn('Font loading failed, using fallback:', error);
          this.createFallbackText();
          resolve();
        }
      );
    });
  }
  
  createFallbackText() {
    // Create a group of geometric shapes to represent "LUKEFORGE"
    const group = new THREE.Group();
    
    // Create extruded rectangular shapes to form a stylized logo
    const shapes = [
      { width: 1.5, height: 0.3, x: -2.5, y: 0 },
      { width: 1.2, height: 0.3, x: -0.8, y: 0 },
      { width: 1.8, height: 0.3, x: 1.2, y: 0 },
    ];
    
    shapes.forEach(({ width, height, x, y }) => {
      const geometry = new THREE.BoxGeometry(width, height, 0.2);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        metalness: 0.2,
        roughness: 0.5,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.2,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      group.add(mesh);
    });
    
    // Add accent bars
    const accentGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.5,
    });
    
    const accent1 = new THREE.Mesh(accentGeometry, accentMaterial);
    accent1.position.set(-3.5, 0, 0);
    group.add(accent1);
    
    const accent2 = new THREE.Mesh(accentGeometry, accentMaterial);
    accent2.position.set(3.2, 0, 0);
    group.add(accent2);
    
    this.textMesh = group;
    this.sceneManager.add(this.textMesh);
    
    // Add glow
    this.addGlow();
  }
  
  addGlow() {
    // Create a soft glow using a larger, semi-transparent copy
    if (!this.textMesh) return;
    
    const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.05,
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.scale.set(1.5, 0.8, 1);
    this.textMesh.add(glowMesh);
  }
  
  /**
   * React to pointer movement for parallax effect
   * @param {number} x - Normalized x position (-1 to 1)
   * @param {number} y - Normalized y position (-1 to 1)
   */
  reactToPointer(x, y) {
    if (!this.textMesh) return;
    
    // Create subtle rotation based on mouse position
    this.targetRotation.y = x * 0.3;
    this.targetRotation.x = -y * 0.2;
  }
  
  /**
   * Set hover state for interactive effects
   * @param {boolean} hovered
   */
  setHovered(hovered) {
    this.isHovered = hovered;
    this.targetScale = hovered ? 1.05 : 1;
    
    // Update emissive intensity on hover
    if (this.textMesh) {
      const material = this.textMesh.material || this.textMesh.children[0]?.material;
      if (material) {
        const targetEmissive = hovered ? 0.4 : 0.2;
        this.animateProperty(material, 'emissiveIntensity', targetEmissive, 0.3);
      }
    }
  }
  
  animate(deltaTime) {
    if (!this.textMesh) return;
    
    // Smooth rotation interpolation
    const rotationSpeed = 3;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * rotationSpeed * deltaTime;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * rotationSpeed * deltaTime;
    
    this.textMesh.rotation.x = this.currentRotation.x;
    this.textMesh.rotation.y = this.currentRotation.y;
    
    // Smooth scale interpolation
    const scaleSpeed = 4;
    this.currentScale += (this.targetScale - this.currentScale) * scaleSpeed * deltaTime;
    this.textMesh.scale.setScalar(this.currentScale);
    
    // Subtle floating animation
    const time = Date.now() * 0.001;
    this.textMesh.position.y = Math.sin(time * 0.5) * 0.1;
    
    // Gentle rotation when not interacting
    if (!this.isHovered) {
      this.textMesh.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  }
  
  animateProperty(object, property, targetValue, duration) {
    const startValue = object[property];
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      object[property] = startValue + (targetValue - startValue) * eased;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  dispose() {
    if (this.textMesh) {
      this.sceneManager.remove(this.textMesh);
      
      // Dispose geometries and materials
      this.textMesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
  }
}

