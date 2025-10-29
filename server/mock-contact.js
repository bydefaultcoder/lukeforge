/**
 * mock-contact.js
 * Mock API server for testing contact form submissions locally
 * Run with: node server/mock-contact.js
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, company, message } = req.body;
  
  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: name, email, and message are required.'
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid email address.'
    });
  }
  
  // Log the submission
  console.log('\n📧 New contact form submission:');
  console.log('━'.repeat(50));
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Company: ${company || 'N/A'}`);
  console.log(`Message: ${message}`);
  console.log('━'.repeat(50));
  console.log('\n✅ Form processed successfully!\n');
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      ok: true,
      message: 'Thank you for your message! We will get back to you soon.',
      timestamp: new Date().toISOString()
    });
  }, 500);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    ok: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Mock Contact API Server');
  console.log('━'.repeat(50));
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📮 POST to http://localhost:${PORT}/api/contact`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('━'.repeat(50));
  console.log('\nPress Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down mock server...');
  process.exit(0);
});

