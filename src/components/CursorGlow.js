/**
 * CursorGlow.js
 * Creates a glowing cursor effect that follows the mouse
 */

export class CursorGlow {
  constructor() {
    this.cursorGlow = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    // Create cursor glow element
    this.cursorGlow = document.createElement('div');
    this.cursorGlow.className = 'cursor-glow';
    document.body.appendChild(this.cursorGlow);
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    // Start animation
    this.animate();
  }
  
  animate = () => {
    // Smooth follow with easing
    const speed = 0.15;
    this.currentX += (this.mouseX - this.currentX) * speed;
    this.currentY += (this.mouseY - this.currentY) * speed;
    
    // Update position
    this.cursorGlow.style.left = `${this.currentX}px`;
    this.cursorGlow.style.top = `${this.currentY}px`;
    
    this.animationId = requestAnimationFrame(this.animate);
  };
  
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.cursorGlow) {
      this.cursorGlow.remove();
    }
  }
}

