/**
 * Services.js
 * Manages the services section content and interactions
 */

export const servicesData = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Custom web applications built with cutting-edge technologies for optimal performance and user experience.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>`,
  },
  {
    id: 'cloud-solutions',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure design and implementation using AWS, Azure, and Google Cloud Platform.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>`,
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by advanced machine learning algorithms and artificial intelligence.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>`,
  },
  {
    id: 'mobile-apps',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications that deliver seamless experiences on iOS and Android.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>`,
  },
  {
    id: 'devops',
    title: 'DevOps & CI/CD',
    description: 'Streamlined development workflows with automated testing, deployment, and continuous integration.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>`,
  },
  {
    id: 'consulting',
    title: 'IT Consulting',
    description: 'Strategic technology guidance to help your business navigate digital transformation and growth.',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>`,
  },
];

export function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;
  
  container.innerHTML = servicesData.map(service => `
    <div class="service-card" data-tilt tabindex="0">
      <div class="service-icon">
        ${service.icon}
      </div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
    </div>
  `).join('');
  
  // Add 3D tilt effect on hover for desktop
  if (!isMobileDevice()) {
    initTiltEffect();
  }
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });
}

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  
  // Calculate mouse position relative to card center
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Calculate rotation angles
  const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
  const rotateY = ((x - centerX) / centerX) * 10;
  
  // Apply transform
  card.style.transform = `
    perspective(1000px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateY(-8px)
    scale3d(1.02, 1.02, 1.02)
  `;
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform = '';
}

