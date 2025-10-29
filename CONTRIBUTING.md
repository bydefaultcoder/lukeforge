# Contributing to Lukeforge

Thank you for considering contributing to Lukeforge! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/lukeforge.git
   cd lukeforge
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Make your changes**:
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   - Test on multiple browsers
   - Test mobile responsiveness
   - Check accessibility with keyboard navigation
   - Verify no console errors

4. **Format code**:
   ```bash
   npm run format
   npm run lint
   ```

5. **Build and test**:
   ```bash
   npm run build
   npm run preview
   ```

## Code Style

### JavaScript

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Add JSDoc comments for functions
- Keep functions small and focused

Example:
```javascript
/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### CSS

- Use CSS custom properties for colors/spacing
- Follow BEM naming for new components
- Group related properties
- Add comments for non-obvious styles

Example:
```css
/* Component: Service Card */
.service-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: var(--spacing-xl);
  gap: var(--spacing-md);
  
  /* Visual */
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  
  /* Interaction */
  transition: all var(--transition-base);
}
```

### Three.js

- Dispose of geometries and materials when done
- Use BufferGeometry for performance
- Cap particle counts for mobile
- Pause rendering when page hidden

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(hero): add parallax effect to 3D text
fix(contact): validate email format correctly
docs(readme): update deployment instructions
perf(particles): reduce count on mobile devices
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add description** explaining your changes
3. **Link related issues** if applicable
4. **Request review** from maintainers
5. **Address feedback** if changes requested

### PR Checklist

- [ ] Code follows project style
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation works)
- [ ] Build succeeds (`npm run build`)
- [ ] Lighthouse scores maintained (Performance 80+, Accessibility 90+)

## Reporting Bugs

### Before Submitting

- Check existing issues
- Test on latest version
- Verify it's reproducible

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Device: [e.g., Desktop, iPhone 12]

**Additional context**
Any other relevant information.
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Describe the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Screenshots, mockups, or examples.
```

## Areas for Contribution

### High Priority

- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Browser compatibility fixes
- [ ] Documentation improvements

### Medium Priority

- [ ] New sections or features
- [ ] Animation enhancements
- [ ] Code refactoring
- [ ] Test coverage

### Low Priority

- [ ] Visual polish
- [ ] Easter eggs
- [ ] Experimental features

## Development Tips

### Three.js Performance

```javascript
// Good: Dispose when done
const geometry = new THREE.BoxGeometry(1, 1, 1);
// ... use geometry ...
geometry.dispose();

// Good: Reuse materials
const material = new THREE.MeshStandardMaterial({ color: 0xFF7A00 });
const mesh1 = new THREE.Mesh(geo1, material);
const mesh2 = new THREE.Mesh(geo2, material);

// Bad: Creating new material each time
const mesh1 = new THREE.Mesh(geo1, new THREE.MeshStandardMaterial({ color: 0xFF7A00 }));
const mesh2 = new THREE.Mesh(geo2, new THREE.MeshStandardMaterial({ color: 0xFF7A00 }));
```

### Accessibility

```html
<!-- Good: Descriptive alt text -->
<img src="project.jpg" alt="E-commerce dashboard showing analytics">

<!-- Bad: Generic alt text -->
<img src="project.jpg" alt="Image">

<!-- Good: ARIA labels -->
<button aria-label="Close modal" data-close-modal>
  <svg>...</svg>
</button>

<!-- Bad: No label -->
<button data-close-modal>
  <svg>...</svg>
</button>
```

### Responsive Design

```css
/* Mobile-first approach */
.card {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    padding: 2rem;
  }
}
```

## Questions?

- Open a discussion on GitHub
- Contact: hello@lukeforge.com
- Join our Discord: [link]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Lukeforge! 🚀

