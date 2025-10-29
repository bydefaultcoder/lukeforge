/**
 * ParticleField.js
 * Creates and manages a GPU-friendly particle system
 * Provides volumetric particles with subtle animation
 */

import * as THREE from 'three';

export class ParticleField {
  constructor(sceneManager, count = 1000) {
    this.sceneManager = sceneManager;
    this.particleCount = this.getOptimalParticleCount(count);
    this.particles = null;
    this.useGPUParticles = this.checkWebGL2Support();
    
    this.init();
  }
  
  checkWebGL2Support() {
    // Check if WebGL2 is available for better performance
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  }
  
  getOptimalParticleCount(requestedCount) {
    // Reduce particle count on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Reduce count on low-end devices
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    if (isMobile) {
      return Math.floor(requestedCount * 0.3);
    } else if (devicePixelRatio > 2) {
      return Math.floor(requestedCount * 0.7);
    }
    
    return requestedCount;
  }
  
  init() {
    if (this.useGPUParticles) {
      this.createGPUParticles();
    } else {
      this.createBasicParticles();
    }
    
    // Register animation callback
    this.sceneManager.onAnimate((deltaTime, elapsedTime) => this.animate(deltaTime, elapsedTime));
  }
  
  createGPUParticles() {
    // Create buffer geometry for better performance
    const geometry = new THREE.BufferGeometry();
    
    // Create position, color, and size attributes
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    const velocities = new Float32Array(this.particleCount * 3);
    
    // Particle color palette
    const color1 = new THREE.Color(0x00d4ff); // Electric Blue
    const color2 = new THREE.Color(0xffffff); // Pure White
    const color3 = new THREE.Color(0x000000); // Pure Black
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Random position in a sphere
      const radius = 10 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random velocity for subtle movement
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      // Random color interpolation
      const mixFactor = Math.random();
      const color = new THREE.Color();
      
      if (mixFactor < 0.7) {
        color.copy(color2);
      } else if (mixFactor < 0.9) {
        color.lerpColors(color1, color2, Math.random());
      } else {
        color.copy(color1);
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Random size
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Store velocities for animation
    this.velocities = velocities;
    
    // Create shader material for custom particle rendering
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.6 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Pulsing effect
          float pulse = sin(time * 2.0 + position.x * 0.5) * 0.3 + 1.0;
          gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float opacity;
        
        void main() {
          // Create circular particles
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft edges
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          alpha *= opacity;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.sceneManager.add(this.particles);
  }
  
  createBasicParticles() {
    // Fallback for devices without WebGL2
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Simple point material
    const material = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.sceneManager.add(this.particles);
  }
  
  animate(deltaTime, elapsedTime) {
    if (!this.particles) return;
    
    // Rotate entire particle field slowly with varied speeds
    this.particles.rotation.y += deltaTime * 0.08;
    this.particles.rotation.x = Math.sin(elapsedTime * 0.15) * 0.15;
    
    // Update shader uniforms if using GPU particles
    if (this.useGPUParticles && this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = elapsedTime;
    }
    
    // Animate individual particles
    if (this.velocities) {
      const positions = this.particles.geometry.attributes.position.array;
      
      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        
        // Apply velocity
        positions[i3] += this.velocities[i3] * deltaTime * 10;
        positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime * 10;
        positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime * 10;
        
        // Boundary check - wrap around
        const maxDistance = 20;
        const distance = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        );
        
        if (distance > maxDistance) {
          // Reset to opposite side
          const scale = 10 / distance;
          positions[i3] *= -scale;
          positions[i3 + 1] *= -scale;
          positions[i3 + 2] *= -scale;
        }
      }
      
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
  }
  
  /**
   * Update particle opacity
   * @param {number} opacity - Target opacity (0-1)
   */
  setOpacity(opacity) {
    if (!this.particles) return;
    
    if (this.particles.material.uniforms) {
      this.particles.material.uniforms.opacity.value = opacity;
    } else {
      this.particles.material.opacity = opacity;
    }
  }
  
  dispose() {
    if (this.particles) {
      this.sceneManager.remove(this.particles);
      
      if (this.particles.geometry) {
        this.particles.geometry.dispose();
      }
      
      if (this.particles.material) {
        this.particles.material.dispose();
      }
    }
  }
}

