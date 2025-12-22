// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '65px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(3,0,20,0.98)';
    navLinks.style.padding = '16px';
    navLinks.style.gap = '12px';
  });
}

// Smooth anchor scrolling + close mobile menu on link click (fixes Home not reacting)
// Handles all in-page anchor links and offsets for the fixed navbar height.
function handleAnchorClick(e) {
  const a = e.currentTarget;
  const href = a.getAttribute('href') || '';
  if (!href.startsWith('#')) return; // not an in-page anchor

  const targetId = href.slice(1);
  // special-case empty id ("#" or href="#") -> scroll to top
  if (!targetId) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth < 1024 && navLinks) setTimeout(() => { navLinks.style.display = 'none'; }, 300);
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) return; // allow default behavior if element not found

  e.preventDefault();
  const header = document.querySelector('.navbar');
  const headerHeight = header ? header.offsetHeight : 65;
  const rect = target.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.top - headerHeight - 8; // small gap
  window.scrollTo({ top: scrollTop, behavior: 'smooth' });

  // close mobile nav after a short delay so user can see the scroll
  if (window.innerWidth < 1024 && navLinks) setTimeout(() => { navLinks.style.display = 'none'; }, 300);
}

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', handleAnchorClick));

// Hero role typing animation (per-letter)
const roles = ["Software Developer", "Problem Solver"];
const roleEl = document.getElementById('roleRotator');
function typeRoles(list, el, opts = {}) {
  if (!el) return;
  const typingSpeed = opts.typingSpeed || 70;
  const deleteSpeed = opts.deleteSpeed || 35;
  const pauseDelay = opts.pauseDelay || 1200;
  let i = 0; // role index
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = list[i];
    if (!deleting) {
      // type next character
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        // pause then delete
        deleting = true;
        setTimeout(tick, pauseDelay);
        return;
      }
      setTimeout(tick, typingSpeed + Math.random() * 40);
    } else {
      // deleting
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        i = (i + 1) % list.length;
        setTimeout(tick, 200);
        return;
      }
      setTimeout(tick, deleteSpeed + Math.random() * 30);
    }
  }

  tick();
}

if (roleEl) {
  typeRoles(roles, roleEl, { typingSpeed: 70, deleteSpeed: 35, pauseDelay: 1200 });
}

// Skills bars animation on intersection
const skillSection = document.getElementById('skills');
if (skillSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill .fill').forEach((el, i) => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          el.style.width = target + '%';
        });
        // Update label percentages smoothly
        const labels = [
          ['skill-c', 85], ['skill-cpp', 80], ['skill-java', 83], ['skill-python', 60],
          ['skill-html', 60], ['skill-mysql', 40], ['skill-html-prog', 60], ['skill-node', 75], ['skill-flask', 60],
          ['skill-tensorflow', 75], ['skill-deeplearning', 80], ['skill-scripting', 85],
          ['skill-databases', 85], ['skill-github', 81], ['skill-embedded', 83]
        ];
        labels.forEach(([id, target]) => {
          const label = document.getElementById(id);
          if (!label) return;
          let val = 0;
          const step = () => {
            val += 3;
            if (val >= target) val = target;
            label.textContent = val + '%';
            if (val < target) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(skillSection);
}

// Contact form handler
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = form.querySelector('button');
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending...';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = original;
      form.reset();
      alert("Message sent successfully! I'll get back to you soon.");
    }, 1500);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll reveal for cards and sections
const revealables = document.querySelectorAll('.card, .section-title, .lead, .contact-item, .form, .hero-illustration, .welcome-box, .edu-item');
revealables.forEach(el => el.classList.add('reveal'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealables.forEach(el => revealObserver.observe(el));

// Parallax effect for hero illustration
const hero = document.querySelector('.hero');
const illo = document.querySelector('.hero-illustration');
if (hero && illo) {
  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
    if (illo) illo.style.transform = `translateY(${progress * -20}px)`;
  }, { passive: true });
}

// ============================================
// ABOUT ME ORBITAL ANIMATION - FIXED (ONLY THIS FUNCTION MODIFIED)
// Smooth circular motion with no glitches
// ============================================
function initAboutOrbital() {
  const orbitRotor = document.querySelector('.about-orbital .orbit-rotor');
  if (!orbitRotor) return;
  
  const badges = orbitRotor.querySelectorAll('.badge');
  const photoContainer = document.querySelector('.about-photo');
  
  if (badges.length === 0) return;
  
  // Get container dimensions
  let containerSize = photoContainer ? photoContainer.offsetWidth : 500;
  let centerX = containerSize / 2;
  let centerY = containerSize / 2;
  
  // Define 3 orbits with different radii and rotation speeds
  const orbits = [
    { radius: containerSize * 0.40, speed: 0.18 },  // Outer orbit
    { radius: containerSize * 0.30, speed: 0.22 },  // Middle orbit
    { radius: containerSize * 0.20, speed: 0.28 }   // Inner orbit
  ];
  
  // Map each badge to its orbit and starting angle
  const badgeConfig = [
    // OUTER ORBIT - 6 web technology badges
    { class: 'html',    orbit: 0, startAngle: 0 },
    { class: 'css',     orbit: 0, startAngle: 60 },
    { class: 'js',      orbit: 0, startAngle: 120 },
    { class: 'react',   orbit: 0, startAngle: 180 },
    { class: 'sql',     orbit: 0, startAngle: 300 },
    
    // MIDDLE ORBIT - 4 programming language badges
    { class: 'c',      orbit: 1, startAngle: 0 },
    { class: 'java',   orbit: 1, startAngle: 90 },
    { class: 'python', orbit: 1, startAngle: 180 },
    { class: 'cpp',    orbit: 1, startAngle: 270 }
  ];
  
  let currentRotation = 0;
  let animationId = null;
  
  // Animation function - runs every frame
  function animate() {
    currentRotation += 0.25; // Rotation speed
    
    badges.forEach((badge, index) => {
      const config = badgeConfig[index];
      if (!config) return;
      
      const orbit = orbits[config.orbit];
      if (!orbit) return;
      
      // Calculate the current angle for this badge
      const angle = config.startAngle + (currentRotation * orbit.speed);
      const angleRad = (angle * Math.PI) / 180;
      
      // Calculate X and Y position on the circular orbit
      const x = centerX + orbit.radius * Math.cos(angleRad);
      const y = centerY + orbit.radius * Math.sin(angleRad);
      
      // Apply position
      badge.style.left = `${x}px`;
      badge.style.top = `${y}px`;
      badge.style.transform = 'translate(-50%, -50%)';
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Handle window resize
  function handleResize() {
    containerSize = photoContainer ? photoContainer.offsetWidth : 500;
    centerX = containerSize / 2;
    centerY = containerSize / 2;
    orbits[0].radius = containerSize * 0.40;
    orbits[1].radius = containerSize * 0.30;
    orbits[2].radius = containerSize * 0.20;
  }
  
  window.addEventListener('resize', handleResize);
  animate();
  
  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
  };
}

// Initialize orbital animation when About section becomes visible
const aboutSection = document.getElementById('about');
if (aboutSection) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initAboutOrbital();
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });
  
  aboutObserver.observe(aboutSection);
}

// Two-layer starfield: background (slow) and foreground (faster, brighter)
const backCanvas = document.createElement('canvas');
backCanvas.className = 'starfield back';
const frontCanvas = document.createElement('canvas');
frontCanvas.className = 'starfield front';
document.body.appendChild(backCanvas);
document.body.appendChild(frontCanvas);
const backCtx = backCanvas.getContext('2d');
const frontCtx = frontCanvas.getContext('2d');

let backStars = [];
let frontStars = [];
const BACK_COUNT = 180;
const FRONT_COUNT = 60;

let mouseX = 0, mouseY = 0;
let lastTime = performance.now();

function rand(min, max) { return Math.random() * (max - min) + min; }

function initStars() {
  backCanvas.width = frontCanvas.width = window.innerWidth;
  backCanvas.height = frontCanvas.height = window.innerHeight;

  backStars = Array.from({ length: BACK_COUNT }, () => ({
    x: Math.random() * backCanvas.width,
    y: Math.random() * backCanvas.height,
    z: Math.random() * 0.6 + 0.1, // deeper/back
    s: Math.random() * 1.1 + 0.2,
    vx: rand(-0.02, 0.02), vy: rand(-0.01, 0.01),
    tw: Math.random() * Math.PI * 2, baseAlpha: rand(0.08, 0.35)
  }));

  frontStars = Array.from({ length: FRONT_COUNT }, () => ({
    x: Math.random() * frontCanvas.width,
    y: Math.random() * frontCanvas.height,
    z: Math.random() * 0.45 + 0.55, // closer to viewer
    s: Math.random() * 2.2 + 0.6,
    vx: rand(-0.12, 0.12), vy: rand(-0.04, 0.04),
    tw: Math.random() * Math.PI * 2, baseAlpha: rand(0.4, 0.95)
  }));
}

initStars();
window.addEventListener('resize', initStars);

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

function drawStars(time) {
  const dt = Math.min(0.05, (time - lastTime) / 1000);
  lastTime = time;

  // Background layer
  backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
  for (const star of backStars) {
    star.tw += dt * (0.8 + star.z);
    const tw = 0.6 + 0.4 * Math.sin(star.tw * 2.0);
    const alpha = Math.min(1, star.baseAlpha * tw);
    const r = Math.round(150 + 30 * star.z);
    const g = Math.round(140 + 20 * star.z);
    const b = Math.round(220 - 20 * star.z);
    const size = star.s * (1 + 0.25 * Math.sin(star.tw));

    backCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    backCtx.beginPath();
    backCtx.arc(star.x + mouseX * 10 * (star.z - 0.5), star.y + mouseY * 8 * (star.z - 0.5), size, 0, Math.PI * 2);
    backCtx.fill();

    // motion scaled by depth (closer moves faster)
    star.x += (star.vx + 0.01 * star.z) * (1 + dt);
    star.y += star.vy * (1 + dt);

    if (star.x > backCanvas.width + 6) star.x = -6;
    if (star.x < -6) star.x = backCanvas.width + 6;
    if (star.y > backCanvas.height + 6) star.y = -6;
    if (star.y < -6) star.y = backCanvas.height + 6;
  }

  // Foreground layer (faster, brighter)
  frontCtx.clearRect(0, 0, frontCanvas.width, frontCanvas.height);
  for (const star of frontStars) {
    star.tw += dt * (1.2 + star.z * 1.5);
    const tw = 0.7 + 0.35 * Math.sin(star.tw * 2.4);
    const alpha = Math.min(1, star.baseAlpha * tw);
    const r = Math.round(220 + 35 * star.z);
    const g = Math.round(190 + 25 * star.z);
    const b = Math.round(255 - 20 * star.z);
    const size = star.s * (1 + 0.45 * Math.sin(star.tw));

    frontCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    frontCtx.beginPath();
    frontCtx.arc(star.x + mouseX * 24 * (star.z - 0.5), star.y + mouseY * 16 * (star.z - 0.5), size, 0, Math.PI * 2);
    frontCtx.fill();

    // glow for brightest
    if (size > 1.8) {
      frontCtx.globalAlpha = 0.08 * alpha;
      frontCtx.fillStyle = `rgba(${r},${g},${b},1)`;
      frontCtx.beginPath();
      frontCtx.arc(star.x + mouseX * 10 * (star.z - 0.5), star.y + mouseY * 6 * (star.z - 0.5), size * 4.5, 0, Math.PI * 2);
      frontCtx.fill();
      frontCtx.globalAlpha = 1.0;
    }

    // front stars move noticeably faster
    star.x += (star.vx * 1.5 + 0.08 * star.z) * (1 + dt * 0.5);
    star.y += star.vy * (1 + dt);

    if (star.x > frontCanvas.width + 8) star.x = -8;
    if (star.x < -8) star.x = frontCanvas.width + 8;
    if (star.y > frontCanvas.height + 8) star.y = -8;
    if (star.y < -8) star.y = frontCanvas.height + 8;
  }

  requestAnimationFrame(drawStars);
}

requestAnimationFrame(drawStars);