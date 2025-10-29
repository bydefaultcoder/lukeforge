/**
 * Portfolio.js
 * Manages the portfolio section with project showcases and modal interactions
 */

import * as THREE from 'three';

export const portfolioData = [
  {
    id: 'fintech-platform',
    title: 'FinTech Platform',
    description: 'A comprehensive financial technology platform with real-time analytics, secure transactions, and AI-powered insights for modern banking.',
    tags: ['React', 'Node.js', 'MongoDB', 'AI'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    color: 0x4F46E5,
  },
  {
    id: 'ecommerce-solution',
    title: 'E-Commerce Solution',
    description: 'Scalable e-commerce platform with advanced inventory management, personalized recommendations, and seamless checkout experience.',
    tags: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&auto=format&fit=crop',
    color: 0xEC4899,
  },
  {
    id: 'healthcare-app',
    title: 'Healthcare App',
    description: 'HIPAA-compliant healthcare application enabling telemedicine, patient records management, and appointment scheduling.',
    tags: ['React Native', 'Firebase', 'ML Kit'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    color: 0x10B981,
  },
  {
    id: 'iot-dashboard',
    title: 'IoT Dashboard',
    description: 'Real-time IoT monitoring and control dashboard for smart buildings with predictive maintenance and energy optimization.',
    tags: ['Vue.js', 'Python', 'InfluxDB', 'MQTT'],
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop',
    color: 0xF59E0B,
  },
  {
    id: 'social-platform',
    title: 'Social Platform',
    description: 'Enterprise social networking platform with advanced collaboration tools, video conferencing, and content management.',
    tags: ['Angular', 'GraphQL', 'Redis', 'WebRTC'],
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&auto=format&fit=crop',
    color: 0x06B6D4,
  },
  {
    id: 'logistics-system',
    title: 'Logistics System',
    description: 'End-to-end logistics and supply chain management system with route optimization and real-time tracking.',
    tags: ['Django', 'React', 'PostgreSQL', 'Maps API'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
    color: 0x8B5CF6,
  },
];

let modalScene = null;
let modalRenderer = null;
let modalCamera = null;
let modal3DObject = null;
let modalAnimationId = null;

export function renderPortfolio() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  
  container.innerHTML = portfolioData.map(project => `
    <article class="portfolio-item" data-project="${project.id}" tabindex="0" role="button" aria-label="View ${project.title} details">
      <img 
        src="${project.image}" 
        alt="${project.title}" 
        class="portfolio-image"
        loading="lazy"
      >
      <div class="portfolio-overlay">
        <h3>${project.title}</h3>
        <div class="portfolio-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
  
  // Add click listeners
  const items = container.querySelectorAll('.portfolio-item');
  items.forEach(item => {
    item.addEventListener('click', () => openModal(item.dataset.project));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(item.dataset.project);
      }
    });
  });
}

export function setupModalListeners() {
  const modal = document.getElementById('portfolio-modal');
  const closeButtons = modal.querySelectorAll('[data-close-modal]');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function openModal(projectId) {
  const project = portfolioData.find(p => p.id === projectId);
  if (!project) return;
  
  const modal = document.getElementById('portfolio-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTags = document.getElementById('modal-tags');
  
  // Update modal content
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalTags.innerHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  // Show modal
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  
  // Initialize 3D preview
  init3DPreview(project);
  
  // Focus management for accessibility
  setTimeout(() => {
    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) closeButton.focus();
  }, 100);
}

function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.hidden = true;
  document.body.style.overflow = '';
  
  // Clean up 3D preview
  dispose3DPreview();
}

function init3DPreview(project) {
  const container = document.getElementById('modal-3d-preview');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  // Create scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  // Create camera
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.z = 5;
  
  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Create 3D object - rotating abstract shape representing the project
  const geometry = new THREE.IcosahedronGeometry(1.5, 1);
  const material = new THREE.MeshStandardMaterial({
    color: project.color,
    metalness: 0.7,
    roughness: 0.2,
    emissive: project.color,
    emissiveIntensity: 0.3,
    wireframe: false,
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  
  // Add wireframe overlay
  const wireframeGeometry = new THREE.IcosahedronGeometry(1.52, 1);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0EA5E9,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  scene.add(wireframeMesh);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(project.color, 2, 20);
  pointLight.position.set(3, 3, 3);
  scene.add(pointLight);
  
  const accentLight = new THREE.PointLight(0x0EA5E9, 1.5, 15);
  accentLight.position.set(-3, -2, 2);
  scene.add(accentLight);
  
  // Store references
  modalScene = scene;
  modalCamera = camera;
  modalRenderer = renderer;
  modal3DObject = { mesh, wireframeMesh };
  
  // Start animation
  animate3DPreview();
  
  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    if (!modalRenderer || !modalCamera) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    modalCamera.aspect = width / height;
    modalCamera.updateProjectionMatrix();
    modalRenderer.setSize(width, height);
  });
  
  resizeObserver.observe(container);
  
  // Store observer for cleanup
  container._resizeObserver = resizeObserver;
}

function animate3DPreview() {
  if (!modalScene || !modalCamera || !modalRenderer || !modal3DObject) return;
  
  modalAnimationId = requestAnimationFrame(animate3DPreview);
  
  // Rotate objects
  const time = Date.now() * 0.001;
  modal3DObject.mesh.rotation.x = time * 0.3;
  modal3DObject.mesh.rotation.y = time * 0.5;
  
  modal3DObject.wireframeMesh.rotation.x = time * -0.2;
  modal3DObject.wireframeMesh.rotation.y = time * -0.4;
  
  // Pulsing scale
  const scale = 1 + Math.sin(time * 2) * 0.05;
  modal3DObject.mesh.scale.setScalar(scale);
  
  modalRenderer.render(modalScene, modalCamera);
}

function dispose3DPreview() {
  // Stop animation
  if (modalAnimationId) {
    cancelAnimationFrame(modalAnimationId);
    modalAnimationId = null;
  }
  
  // Dispose scene
  if (modalScene) {
    modalScene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
  
  // Dispose renderer
  if (modalRenderer) {
    modalRenderer.dispose();
    const container = document.getElementById('modal-3d-preview');
    if (container && container._resizeObserver) {
      container._resizeObserver.disconnect();
    }
  }
  
  modalScene = null;
  modalCamera = null;
  modalRenderer = null;
  modal3DObject = null;
}

