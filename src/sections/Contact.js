/**
 * Contact.js
 * Handles contact form validation and submission
 */

const API_ENDPOINT = '/api/contact';

export function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleSubmit);
  
  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      // Clear error on input
      if (input.classList.contains('error')) {
        clearFieldError(input);
      }
    });
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('.btn-submit');
  const successMessage = form.querySelector('.form-success');
  
  // Validate all fields
  const isValid = validateForm(form);
  if (!isValid) return;
  
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Show loading state
  submitButton.classList.add('loading');
  submitButton.disabled = true;
  
  try {
    // Submit to API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit form');
    }
    
    const result = await response.json();
    
    if (result.ok) {
      // Show success message
      successMessage.classList.add('visible');
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.classList.remove('visible');
      }, 5000);
    } else {
      throw new Error(result.error || 'Failed to submit form');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert('There was an error submitting the form. Please try again later.');
  } finally {
    // Reset button state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
  }
}

function validateForm(form) {
  const inputs = form.querySelectorAll('[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;
  let errorMessage = '';
  
  // Required validation
  if (input.hasAttribute('required') && !value) {
    errorMessage = `${capitalize(fieldName)} is required`;
  }
  
  // Email validation
  if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Message length validation
  if (fieldName === 'message' && value && value.length < 10) {
    errorMessage = 'Message must be at least 10 characters long';
  }
  
  if (errorMessage) {
    showFieldError(input, errorMessage);
    return false;
  } else {
    clearFieldError(input);
    return true;
  }
}

function showFieldError(input, message) {
  input.classList.add('error');
  
  const errorElement = input.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
  
  // Set aria-invalid for accessibility
  input.setAttribute('aria-invalid', 'true');
}

function clearFieldError(input) {
  input.classList.remove('error');
  
  const errorElement = input.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
  
  input.removeAttribute('aria-invalid');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Timeline data for About section
export const timelineData = [
  {
    year: '2025',
    title: 'AI Integration',
    description: 'Launched advanced AI-powered solutions for enterprise clients.',
  },
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Expanded operations to serve clients across 15 countries.',
  },
  {
    year: '2023',
    title: 'Cloud Excellence',
    description: 'Achieved cloud partner certifications with major providers.',
  },
  {
    year: '2022',
    title: 'Innovation Award',
    description: 'Recognized for outstanding innovation in software development.',
  },
  {
    year: '2021',
    title: 'Founded',
    description: 'Started Lukeforge with a vision to transform digital experiences.',
  },
];

export function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;
  
  container.innerHTML = timelineData.map(item => `
    <div class="timeline-item">
      <div class="timeline-year">${item.year}</div>
      <h4>${item.title}</h4>
      <p class="timeline-content">${item.description}</p>
    </div>
  `).join('');
}

