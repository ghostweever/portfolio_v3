// ===== Portfolio Site JavaScript =====
// No frameworks, pure vanilla JS

// ===== Data =====
const projects = [
  {
    id: 1,
    title: 'Alien Motion Tracker',
    category: 'Sci-Fi Device',
    description: 'High-fidelity motion tracker inspired by Alien Isolation. A complex hard-surface modeling project featuring intricate mechanical details and functional design elements.',
    workflow: 'Exclusively modeled in Maya with advanced hard-surface techniques. PBR texturing in Substance Painter with baked normals, emissive glows, and functional deformation for lens flexibility.',
    learnings: [
      'Mastered connecting multiple object components',
      'Advanced beveling and edge flow techniques',
      'Vertex-level deformation for mechanical parts',
      'Emissive material creation for sci-fi glows'
    ],
    images: [
      './images/motion_1.jpg',
      './images/motion_2.jpg',
      './images/motion_3.jpg',
      './images/motion_4.png',
      './images/motion_5.png'
    ],
    tools: ['Maya', 'Substance Painter'],
    color: '#06b6d4'
  },
  {
    id: 2,
    title: 'Yoru Sword',
    category: 'Fantasy Weapon',
    description: 'A regal fantasy sword with ornate gold detailing and embedded gemstones. Reverse-engineered from reference to achieve authentic medieval aesthetics with game-ready topology.',
    workflow: 'Modeled in Maya with clean topology, color design and texturing in Substance Painter, then retextured and refined in Unreal Engine for real-time rendering optimization.',
    learnings: [
      'Reverse-engineering from visual references',
      'Clean topology for game-ready assets',
      'High-detail sculpting workflows',
      'Real-time engine integration'
    ],
    images: [
      './images/sword_1.jpg',
      './images/sword_2.jpg',
      './images/sword_3.jpg'
    ],
    tools: ['Maya', 'Substance Painter', 'Unreal Engine'],
    color: '#a855f7'
  },
  {
    id: 3,
    title: 'Fantasy Chair',
    category: 'Fantasy Prop',
    description: 'An elegant wooden chair with plush green upholstery, designed for fantasy game environments. Features organic wood grain textures and detailed fabric materials.',
    workflow: 'Modeled in Maya focusing on cuts and vertex manipulation for organic shapes. Quick texturing pass in Substance Painter to establish material definition and color palette.',
    learnings: [
      'Organic modeling through vertex manipulation',
      'Wood grain texture creation',
      'Fabric material definition',
      'Efficient UV layout for props'
    ],
    images: [
      './images/chair_1.png',
      './images/chair_2.png',
      './images/chair_3.jpg'
    ],
    tools: ['Maya', 'Substance Painter'],
    color: '#22c55e'
  },
  {
    id: 4,
    title: 'Fantasy Table',
    category: 'Fantasy Prop',
    description: 'A sturdy wooden table with decorative magenta crystal accents, perfect for fantasy tavern or castle interior scenes. Balances functionality with visual appeal.',
    workflow: 'Substance Painter-focused workflow with full color capture and custom painting techniques. Emphasis on material layering and crystal/gemstone material creation.',
    learnings: [
      'Full color capture techniques',
      'Custom hand-painting in Substance',
      'Crystal and gemstone materials',
      'Material layering for depth'
    ],
    images: [
      './images/table_1.jpg',
      './images/table_2.jpg',
      './images/table_3.jpg',
      './images/table_4.jpg'
    ],
    tools: ['Maya', 'Substance Painter'],
    color: '#ec4899'
  },
  {
    id: 5,
    title: 'Stone Gate',
    category: 'Environment Asset',
    description: 'A weathered stone archway with iron gates and period-appropriate lanterns. Legacy project demonstrating foundational skills in architectural modeling and environmental storytelling.',
    workflow: 'Modeled in Maya as an early learning project. Heavily utilized Substance Painter for UV maneuvering, texturing, and adding wear/tear layers for realistic aging.',
    learnings: [
      'UV maneuvering and optimization',
      'Wear and tear layer systems',
      'Architectural modeling basics',
      'Environmental storytelling through detail'
    ],
    images: [
      './images/gate_1.png',
      './images/gate_2.jpg'
    ],
    tools: ['Maya', 'Substance Painter'],
    color: '#f59e0b'
  }
];

// ===== DOM Elements =====
const navbar = document.querySelector('.navbar');
const leftPupil = document.querySelector('.eye-left .pupil');
const rightPupil = document.querySelector('.eye-right .pupil');
const leftEye = document.querySelector('.eye-left');
const rightEye = document.querySelector('.eye-right');
const portfolioGrid = document.querySelector('.portfolio-grid');
const lightbox = document.querySelector('.lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxClose = document.querySelector('.lightbox-close');
const skillBars = document.querySelectorAll('.skill-bar-fill');

// ===== State =====
let slideshowIntervals = {};
let currentLightboxProject = null;

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll);

// ===== Eye Tracking =====
function handleEyeTracking(e) {
  if (!leftPupil || !rightPupil) return;
  
  const eyesContainer = document.querySelector('.eyes-container');
  if (!eyesContainer) return;
  
  const rect = eyesContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  const distance = Math.min(
    Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)),
    15
  );
  
  const pupilX = Math.cos(angle) * distance * 0.4;
  const pupilY = Math.sin(angle) * distance * 0.4;
  
  leftPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
  rightPupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
}

document.addEventListener('mousemove', handleEyeTracking);

// ===== Eye Blinking =====
function blinkEyes() {
  if (!leftEye || !rightEye) return;
  
  leftEye.classList.add('blinking');
  rightEye.classList.add('blinking');
  
  setTimeout(() => {
    leftEye.classList.remove('blinking');
    rightEye.classList.remove('blinking');
  }, 150);
  
  // Random next blink
  setTimeout(blinkEyes, 3000 + Math.random() * 2000);
}

setTimeout(blinkEyes, 3000);

// ===== Slideshow Component =====
function createSlideshow(images, container, projectId) {
  if (images.length === 0) return;
  
  let currentIndex = 0;
  let isPaused = false;
  
  // Create slideshow HTML
  container.innerHTML = `
    <div class="slideshow" data-project-id="${projectId}">
      ${images.map((src, i) => `
        <div class="slideshow-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
          <img src="${src}" alt="Angle ${i + 1}" loading="lazy">
        </div>
      `).join('')}
      ${images.length > 1 ? `
        <div class="slideshow-dots">
          ${images.map((_, i) => `
            <button class="slideshow-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to image ${i + 1}"></button>
          `).join('')}
        </div>
        <div class="slideshow-progress">
          <div class="slideshow-progress-bar"></div>
        </div>
      ` : ''}
    </div>
  `;
  
  if (images.length <= 1) return;
  
  const slideshow = container.querySelector('.slideshow');
  const slides = slideshow.querySelectorAll('.slideshow-slide');
  const dots = slideshow.querySelectorAll('.slideshow-dot');
  const progressBar = slideshow.querySelector('.slideshow-progress-bar');
  
  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    currentIndex = index;
    
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
    
    // Reset progress bar
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.transition = 'width 4s linear';
        progressBar.style.width = '100%';
      }, 50);
    }
  }
  
  function nextSlide() {
    goToSlide((currentIndex + 1) % images.length);
  }
  
  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(i);
    });
  });
  
  // Pause on hover
  slideshow.addEventListener('mouseenter', () => {
    isPaused = true;
    if (progressBar) {
      progressBar.style.transition = 'none';
      const computedStyle = window.getComputedStyle(progressBar);
      const width = computedStyle.width;
      progressBar.style.width = width;
    }
  });
  
  slideshow.addEventListener('mouseleave', () => {
    isPaused = false;
    if (progressBar) {
      progressBar.style.transition = 'width 4s linear';
      progressBar.style.width = '100%';
    }
  });
  
  // Auto-play
  let interval = setInterval(() => {
    if (!isPaused) {
      nextSlide();
    }
  }, 4000);
  
  // Start progress bar
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.transition = 'width 4s linear';
      progressBar.style.width = '100%';
    }, 100);
  }
  
  // Store interval for cleanup
  slideshowIntervals[projectId] = interval;
}

// ===== Render Portfolio =====
function renderPortfolio() {
  if (!portfolioGrid) return;
  
  portfolioGrid.innerHTML = projects.map(project => `
    <div class="portfolio-card" data-project-id="${project.id}">
      <div class="card-image-container slideshow-container" data-project-id="${project.id}"></div>
      <div class="card-overlay"></div>
      <div class="card-badge" style="color: ${project.color}; border-color: ${project.color}40">${project.category}</div>
      <div class="card-view-btn" style="background: ${project.color}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </div>
      <div class="card-content">
        <h3 class="card-title">${project.title}</h3>
        <p class="card-desc">${project.description}</p>
        <div class="card-tools">
          ${project.tools.map(tool => `<span class="card-tool">${tool}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  // Initialize slideshows
  projects.forEach(project => {
    const container = portfolioGrid.querySelector(`.slideshow-container[data-project-id="${project.id}"]`);
    if (container) {
      createSlideshow(project.images, container, project.id);
    }
  });
  
  // Add click handlers
  portfolioGrid.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.dataset.projectId);
      openLightbox(projectId);
    });
  });
}

// ===== Lightbox =====
function openLightbox(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project || !lightbox) return;
  
  currentLightboxProject = project;
  
  // Create lightbox content
  lightboxContent.innerHTML = `
    <button class="lightbox-close" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="lightbox-image-container slideshow-container-lightbox"></div>
    <div class="lightbox-body">
      <span class="lightbox-category" style="background: ${project.color}20; color: ${project.color}">${project.category}</span>
      <h3 class="lightbox-title">${project.title}</h3>
      <p class="lightbox-desc">${project.description}</p>
      
      <div class="lightbox-section">
        <h4 class="lightbox-section-title purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          Workflow
        </h4>
        <p class="lightbox-text">${project.workflow}</p>
      </div>
      
      <div class="lightbox-section">
        <h4 class="lightbox-section-title cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Key Learnings
        </h4>
        <ul class="lightbox-list">
          ${project.learnings.map(learning => `<li>${learning}</li>`).join('')}
        </ul>
      </div>
      
      <div class="lightbox-section">
        <h4 class="lightbox-section-title pink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Tools Used
        </h4>
        <div class="lightbox-tools">
          ${project.tools.map(tool => `<span class="lightbox-tool">${tool}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  // Initialize lightbox slideshow
  const lightboxSlideshowContainer = lightboxContent.querySelector('.slideshow-container-lightbox');
  if (lightboxSlideshowContainer) {
    createSlideshow(project.images, lightboxSlideshowContainer, `lightbox-${project.id}`);
  }
  
  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Close handler
  lightboxContent.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
}

function closeLightbox() {
  if (!lightbox) return;
  
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  
  // Clear lightbox slideshow interval
  if (currentLightboxProject) {
    const intervalKey = `lightbox-${currentLightboxProject.id}`;
    if (slideshowIntervals[intervalKey]) {
      clearInterval(slideshowIntervals[intervalKey]);
      delete slideshowIntervals[intervalKey];
    }
  }
  
  currentLightboxProject = null;
}

// Lightbox backdrop click
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });
}

// Lightbox close button
if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

// Escape key to close lightbox
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// ===== Skill Bars Animation =====
function animateSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.dataset.width;
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== Form Handling =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"></circle>
      </svg>
      Sending...
    `;
    
    // Simulate sending
    setTimeout(() => {
      submitBtn.innerHTML = 'Message Sent!';
      submitBtn.style.background = '#22c55e';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        this.reset();
      }, 2000);
    }, 1500);
  });
}

// ===== Back to Top =====
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
  animateSkillBars();
});

// ===== Reveal on Scroll =====
const revealElements = document.querySelectorAll('.section-header, .about-content, .experience-list, .skills-grid, .leadership-grid, .contact-grid');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});
