/**
 * main.js
 * Entry point for the Lukeforge website
 * Initializes all components, handles routing, and manages interactions
 */

import './styles/main.css';
import { SceneManager } from './components/SceneManager.js';
import { Hero3DText } from './components/Hero3DText.js';
import { ParticleField } from './components/ParticleField.js';
import { CursorGlow } from './components/CursorGlow.js';
import { renderServices } from './sections/Services.js';
import { renderPortfolio, setupModalListeners } from './sections/Portfolio.js';
import { setupContactForm, renderTimeline } from './sections/Contact.js';

// ===================================
// Global State
// ===================================

let sceneManager = null;
let hero3DText = null;
let particleField = null;
let cursorGlow = null;

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Lukeforge...');
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Initialize Three.js scene (skip on low-end devices or if reduced motion is preferred)
  if (!prefersReducedMotion && !isLowEndDevice()) {
    initHeroScene();
  } else {
    // Use static fallback
    showHeroFallback();
  }
  
  // Initialize sections
  renderServices();
  renderPortfolio();
  renderTimeline();
  
  // Setup interactions
  setupNavigation();
  setupSmoothScroll();
  setupThemeToggle();
  setupContactForm();
  setupModalListeners();
  setupHeroInteractions();
  setupScrollAnimations();
  setupParallaxEffects();
  
  // Setup hash routing
  setupHashRouting();
  
  // Initialize cursor glow (desktop only)
  if (!isMobileDevice()) {
    cursorGlow = new CursorGlow();
  }
  
  console.log('✅ Lukeforge initialized successfully!');
});

// ===================================
// Three.js Hero Scene
// ===================================

function initHeroScene() {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;
  
  try {
    // Initialize scene manager
    sceneManager = new SceneManager(container);
    
    // Create 3D text
    hero3DText = new Hero3DText(sceneManager);
    
    // Create particle field (fewer particles on mobile)
    const particleCount = isMobileDevice() ? 300 : 1000;
    particleField = new ParticleField(sceneManager, particleCount);
    
    // Add rotating forge/gear-inspired object
    addForgeObject();
    
    // Start rendering
    sceneManager.startRendering();
    
    // Hide fallback once scene is ready
    setTimeout(() => {
      const fallback = document.querySelector('.hero-fallback');
      if (fallback) {
        fallback.style.opacity = '0';
        setTimeout(() => fallback.remove(), 500);
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to initialize 3D scene:', error);
    showHeroFallback();
  }
}

function addForgeObject() {
  if (!sceneManager) return;
  
  const { TorusKnotGeometry, MeshStandardMaterial, Mesh } = window.THREE || {};
  
  // Lazy load THREE if needed
  import('three').then(THREE => {
    // Create a low-poly forge/gear-inspired object
    const geometry = new THREE.TorusKnotGeometry(0.8, 0.3, 64, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.3,
    });
    
    const forgeMesh = new THREE.Mesh(geometry, material);
    forgeMesh.position.set(3, -1, -2);
    forgeMesh.scale.setScalar(0.6);
    
    sceneManager.add(forgeMesh);
    
    // Animate forge object
    sceneManager.onAnimate((deltaTime, elapsedTime) => {
      forgeMesh.rotation.x = elapsedTime * 0.2;
      forgeMesh.rotation.y = elapsedTime * 0.3;
      forgeMesh.position.y = -1 + Math.sin(elapsedTime * 0.5) * 0.2;
    });
  });
}

function showHeroFallback() {
  const fallback = document.querySelector('.hero-fallback');
  if (fallback) {
    fallback.style.opacity = '1';
  }
}

// ===================================
// Hero Interactions
// ===================================

function setupHeroInteractions() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const heroDescription = hero.querySelector('.hero-description');
  const robotContainer = hero.querySelector('.robot-container');
  
  // Parallax on mouse move
  hero.addEventListener('mousemove', (e) => {
    if (!hero3DText || !sceneManager) return;
    
    // Normalize mouse position to -1 to 1
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Apply parallax to 3D text
    hero3DText.reactToPointer(x, y);
    
    // Move camera slightly
    if (sceneManager.getCamera()) {
      const camera = sceneManager.getCamera();
      camera.position.x += (x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (y * 0.3 - camera.position.y) * 0.05;
    }
    
    // Move description text based on cursor
    if (heroDescription) {
      const rect = hero.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (mouseX - centerX) / centerX * 15; // Max 15px movement
      const moveY = (mouseY - centerY) / centerY * 15;
      
      heroDescription.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    // Move robot based on cursor (opposite direction for depth)
    if (robotContainer) {
      const rect = hero.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (mouseX - centerX) / centerX * -30; // Opposite direction
      const moveY = (mouseY - centerY) / centerY * -30;
      const rotation = (mouseX - centerX) / centerX * 10; // Rotate based on X
      
      robotContainer.style.transform = `translate(${moveX}px, calc(-50% + ${moveY}px)) rotate(${rotation}deg)`;
    }
  });
  
  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    if (heroDescription) {
      heroDescription.style.transform = 'translate(0, 0)';
    }
    if (robotContainer) {
      robotContainer.style.transform = 'translate(0, -50%) rotate(0deg)';
    }
  });
  
  // Hover effect on CTA button
  const ctaButton = hero.querySelector('.btn-cta');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
      if (hero3DText) hero3DText.setHovered(true);
    });
    
    ctaButton.addEventListener('mouseleave', () => {
      if (hero3DText) hero3DText.setHovered(false);
    });
  }
}

// ===================================
// Navigation
// ===================================

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ===================================
// Smooth Scrolling
// ===================================

function setupSmoothScroll() {
  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash
        history.pushState(null, null, href);
        
        // Focus target for accessibility
        targetElement.focus({ preventScroll: true });
      }
    });
  });
  
  // Handle scroll-to buttons
  document.querySelectorAll('[data-scroll-to]').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.scrollTo;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

// ===================================
// Hash Routing
// ===================================

function setupHashRouting() {
  // Handle initial hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
      const targetPosition = targetElement.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// ===================================
// Theme Toggle
// ===================================

function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add transition class for smooth theme change
    document.documentElement.classList.add('theme-transitioning');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  });
}

// ===================================
// Scroll Animations
// ===================================

function setupScrollAnimations() {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay based on index
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all service cards
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    observer.observe(card);
  });
  
  // Observe all portfolio items
  document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    observer.observe(item);
  });
  
  // Observe section headers
  document.querySelectorAll('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    observer.observe(header);
  });
  
  // Observe timeline items
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    observer.observe(item);
  });
}

// ===================================
// Parallax Effects
// ===================================

function setupParallaxEffects() {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
          const heroContent = hero.querySelector('.hero-content');
          if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
          }
        }
        
        // Parallax for section backgrounds
        document.querySelectorAll('.section').forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (rect.top - window.innerHeight / 2) * 0.05;
            section.style.backgroundPositionY = `${offset}px`;
          }
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ===================================
// Utility Functions
// ===================================

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isLowEndDevice() {
  // Check for low-end device indicators
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    // If on slow connection, treat as low-end
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return true;
    }
  }
  
  // Check for low memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return true;
  }
  
  // Check for low CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return true;
  }
  
  return false;
}

// ===================================
// Performance Monitoring
// ===================================

// Log performance metrics
window.addEventListener('load', () => {
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;
    
    console.log('⚡ Performance Metrics:');
    console.log(`  Page Load Time: ${pageLoadTime}ms`);
    console.log(`  Connect Time: ${connectTime}ms`);
    console.log(`  Render Time: ${renderTime}ms`);
  }
  
  // Log LCP if available
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`  LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Observer not supported
    }
  }
});

// ===================================
// Cleanup on page unload
// ===================================

window.addEventListener('beforeunload', () => {
  if (sceneManager) {
    sceneManager.dispose();
  }
  if (hero3DText) {
    hero3DText.dispose();
  }
  if (particleField) {
    particleField.dispose();
  }
  if (cursorGlow) {
    cursorGlow.dispose();
  }
});

