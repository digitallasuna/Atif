/**
 * Atif Website - Core Application Logic
 * Clean ES6+ Vanilla JavaScript
 */

// Global QA simulation state (can be modified by QA runner)
window.QA_CONFIG = {
  simulateServerError: false,
  networkLatencyMs: 600
};

// Project Case Study Details
const PROJECT_DETAILS = {
  1: {
    title: "Aether Enterprise Telemetry & Analytics",
    subtitle: "High-throughput operational telemetry dashboard processing 14M+ daily data points.",
    metrics: "99.98% availability • <45ms query rendering • Zero third-party dependencies",
    architecture: "Constructed with native SVG line graphs, pure CSS grid orchestration, and binary WebSocket streaming for real-time sensor updates without layout thrashing.",
    tags: ["WebSockets", "SVG Analytics", "Vanilla JS", "Zero Framework Overhead"]
  },
  2: {
    title: "NeuralForge Generative AI Canvas",
    subtitle: "Hardware-accelerated mobile studio for generative text-to-image and local neural filters.",
    metrics: "120k+ Active Creators • 60 FPS Canvas Rendering • Offline Shader Support",
    architecture: "Implements WebGL shader acceleration, touch gesture decoders, and deterministic state undo/redo buffers for fluid creator workflows.",
    tags: ["WebGL", "Gesture Engine", "Neural Shaders", "Fluid UI"]
  },
  3: {
    title: "Quantum Bench Static Test Suite",
    subtitle: "Lightweight client-side test automation harness designed for static deployments.",
    metrics: "100% Deterministic Pass Rate • 12ms Full Smoke Cycle • Native DOM Assertions",
    architecture: "Runs automated browser smoke suites directly inside client memory without requiring heavy server runtimes or external testing containers.",
    tags: ["QA Engine", "DOM Assertions", "Accessibility Audit", "ES2024"]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollNav();
  initProjectFilters();
  initProjectModals();
  initContactForm();
  initMetricsCounter();
});

/* ==========================================================================
   THEME TOGGLING (DARK / LIGHT)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  // Retrieve saved theme or prefer dark
  const savedTheme = localStorage.getItem('atif_theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('atif_theme', newTheme);
    
    // Log to QA if present
    if (window.qaLog) {
      window.qaLog(`Theme changed to: ${newTheme}`);
    }
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
}

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.textContent = isOpen ? '✕' : '☰';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.textContent = '☰';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   SCROLL SPY & ACTIVE NAV
   ========================================================================== */
function initScrollNav() {
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header shadow styling
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });

      if (window.qaLog) {
        window.qaLog(`Project filter applied: "${filterValue}"`);
      }
    });
  });
}

/* ==========================================================================
   MODAL COMPONENT
   ========================================================================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close-btn');
  const footerCloseBtn = document.getElementById('modal-close-btn-footer');
  const openButtons = document.querySelectorAll('.open-modal-btn');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      const details = PROJECT_DETAILS[projectId];

      if (details) {
        modalTitle.textContent = details.title;
        modalBody.innerHTML = `
          <p style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text-primary);">${details.subtitle}</p>
          <div style="background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: var(--radius-sm); padding: 0.85rem; margin-bottom: 1.25rem;">
            <strong style="color: var(--accent-cyan); display:block; font-size: 0.8rem; text-transform: uppercase;">Benchmark Metrics</strong>
            <span style="font-family: var(--font-mono); font-size: 0.88rem;">${details.metrics}</span>
          </div>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">${details.architecture}</p>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
            ${details.tags.map(t => `<span class="tech-tag" style="color: var(--accent-cyan);">${t}</span>`).join('')}
          </div>
        `;
        openModal();
      }
    });
  });

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  window.closeModal = function() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', window.closeModal);
  if (footerCloseBtn) footerCloseBtn.addEventListener('click', window.closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      window.closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      window.closeModal();
    }
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & INTERACTIVE TESTING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const charCount = document.getElementById('char-count');
  const submitBtn = document.getElementById('submit-btn');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitText = document.getElementById('submit-text');

  if (!form) return;

  // Real-time character counter
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      charCount.textContent = messageInput.value.length;
    });
  }

  // Live input validation listeners
  nameInput.addEventListener('blur', () => validateField(nameInput, 'name-error', val => val.trim().length >= 2));
  nameInput.addEventListener('input', () => clearFieldValidation(nameInput, 'name-error'));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailInput.addEventListener('blur', () => validateField(emailInput, 'email-error', val => emailRegex.test(val.trim())));
  emailInput.addEventListener('input', () => clearFieldValidation(emailInput, 'email-error'));

  messageInput.addEventListener('blur', () => validateField(messageInput, 'message-error', val => val.trim().length >= 10));
  messageInput.addEventListener('input', () => clearFieldValidation(messageInput, 'message-error'));

  function validateField(inputEl, errorId, validatorFn) {
    const errorEl = document.getElementById(errorId);
    const isValid = validatorFn(inputEl.value);

    if (isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (errorEl) errorEl.classList.remove('visible');
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (errorEl) errorEl.classList.add('visible');
    }
    return isValid;
  }

  function clearFieldValidation(inputEl, errorId) {
    inputEl.classList.remove('is-invalid');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.remove('visible');
  }

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, 'name-error', val => val.trim().length >= 2);
    const isEmailValid = validateField(emailInput, 'email-error', val => emailRegex.test(val.trim()));
    const isMsgValid = validateField(messageInput, 'message-error', val => val.trim().length >= 10);

    if (!isNameValid || !isEmailValid || !isMsgValid) {
      showToast('⚠️ Please fix the highlighted errors in the form.', 'error');
      if (window.qaLog) window.qaLog('[FORM QA] Submission blocked by validation errors.');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    if (submitSpinner) submitSpinner.style.display = 'inline-block';
    if (submitText) submitText.textContent = 'Processing...';

    // Simulate network submission with configurable QA parameters
    await new Promise(res => setTimeout(res, window.QA_CONFIG.networkLatencyMs));

    submitBtn.disabled = false;
    if (submitSpinner) submitSpinner.style.display = 'none';
    if (submitText) submitText.textContent = 'Send Message 🚀';

    if (window.QA_CONFIG.simulateServerError) {
      showToast('❌ Server error 500: Failed to submit inquiry (QA Simulated)', 'error');
      if (window.qaLog) window.qaLog('[FORM QA] Simulated 500 HTTP Server Error triggered.');
    } else {
      showToast('✅ Message sent successfully! I will reply shortly.', 'success');
      form.reset();
      nameInput.classList.remove('is-valid');
      emailInput.classList.remove('is-valid');
      messageInput.classList.remove('is-valid');
      if (charCount) charCount.textContent = '0';
      if (window.qaLog) window.qaLog('[FORM QA] Form submitted successfully with HTTP 200 OK.');
    }
  });
}

/* ==========================================================================
   METRICS COUNTER ANIMATION
   ========================================================================== */
function initMetricsCounter() {
  const metrics = document.querySelectorAll('.metric-number[data-count]');
  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasRun) {
      hasRun = true;
      metrics.forEach(metric => {
        const target = parseInt(metric.getAttribute('data-count'), 10);
        const duration = 1200;
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            metric.textContent = target;
            clearInterval(timer);
          } else {
            metric.textContent = Math.floor(current);
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.3 });

  const metricsSection = document.getElementById('hero-metrics');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   TOAST NOTIFICATION COMPONENT
   ========================================================================== */
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
};
