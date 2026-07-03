// Chill Cawfee - Interactivity & Custom Animations

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Scroll Effect
  const navbar = document.querySelector('.navbar');
  const checkScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll();

  // 2. Intersection Observer for Scroll Animations
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once animated, we don't need to observe it anymore
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animElements = document.querySelectorAll('.animate-on-scroll');
  animElements.forEach(el => animationObserver.observe(el));

  // 3. Aroma Floating Background Canvas Animation
  initAromaCanvas();

  // 4. Drink Matcher Widget Logic
  initDrinkMatcher();

  // 5. Interactive Event Tabs
  initEventTabs();
});

// Canvas Particle System: Coffee Aroma
function initAromaCanvas() {
  const canvas = document.getElementById('aroma-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 28;
  const colors = [
    'rgba(140, 67, 39, 0.22)',  // Terracotta tint
    'rgba(217, 130, 54, 0.18)', // Caramel tint
    'rgba(236, 196, 160, 0.25)', // Warm sand tint
    'rgba(11, 25, 95, 0.20)'     // Logo Blue tint (#0B195F)
  ];

  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + Math.random() * 100;
      this.size = Math.random() * 80 + 40; // Large, soft particles
      this.speedY = -(Math.random() * 0.5 + 0.3);
      this.speedX = Math.random() * 0.4 - 0.2;
      this.wobbleSpeed = Math.random() * 0.01 + 0.005;
      this.wobbleVal = Math.random() * Math.PI * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.y += this.speedY;
      this.wobbleVal += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobbleVal) * 0.3;

      // Mouse interactive push
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 4;
          this.y += Math.sin(angle) * force * 4;
        }
      }

      // Check boundary
      if (this.y < -this.size || this.x < -this.size || this.x > width + this.size) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'rgba(253, 251, 247, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// Drink Matcher Database
const DRINK_DATABASE = [
  {
    name: "Caramel Dream",
    desc: "A rich, velvety espresso blend layered with thick caramel sauce, steamed milk, and topped with fresh whipped cream.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/carameldream-qRxZ2Y3XVr5d1qdP.jpg",
    sweet: 8,
    bold: 6
  },
  {
    name: "White Chocolate Dream",
    desc: "Creamy white chocolate melted into freshly pulled espresso, finished with a delicate dusting of cocoa.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/whitechocolatedream-1-AmNLtSajddpM2S3U.jpg",
    sweet: 9,
    bold: 4
  },
  {
    name: "Double Dark Mocha",
    desc: "For the true chocolate lover, featuring two shots of espresso drowned in rich, dark cocoa and steamed milk.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/dark-mocha-chocolate-dream-tngiOvc1iSBiEBly.webp",
    sweet: 4,
    bold: 9
  },
  {
    name: "Signature Classic",
    desc: "Coffee should be comforting, rich, and completely unpretentious. Hunter pours each of our signature custom creations daily with real whipped cream and decadent drizzles.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png",
    sweet: 5,
    bold: 6
  }
];

function initDrinkMatcher() {
  const sweetSlider = document.getElementById('sweetness-slider');
  const boldSlider = document.getElementById('boldness-slider');
  const resultContainer = document.getElementById('matcher-result-display');

  if (!sweetSlider || !boldSlider || !resultContainer) return;

  const calculateMatch = () => {
    const userSweet = parseInt(sweetSlider.value);
    const userBold = parseInt(boldSlider.value);

    let bestMatch = null;
    let minDiff = Infinity;

    DRINK_DATABASE.forEach(drink => {
      // Euclidean distance in 2D preference space
      const diffSweet = drink.sweet - userSweet;
      const diffBold = drink.bold - userBold;
      const totalDiff = Math.sqrt(diffSweet * diffSweet + diffBold * diffBold);

      if (totalDiff < minDiff) {
        minDiff = totalDiff;
        bestMatch = drink;
      }
    });

    if (bestMatch) {
      // Add a fade transition out/in
      resultContainer.style.opacity = 0;
      setTimeout(() => {
        resultContainer.innerHTML = `
          <div class="match-display">
            <img src="${bestMatch.img}" alt="${bestMatch.name}" class="match-img">
            <div class="match-info-box">
              <span class="drink-meta">Your Perfect Cup</span>
              <h4>${bestMatch.name}</h4>
              <p>${bestMatch.desc}</p>
              <div style="margin-top: 15px;">
                <a href="menu.html" class="btn btn-accent" style="padding: 8px 16px; font-size: 0.85rem;">Order Now</a>
              </div>
            </div>
          </div>
        `;
        resultContainer.style.opacity = 1;
      }, 200);
    }
  };

  sweetSlider.addEventListener('input', calculateMatch);
  boldSlider.addEventListener('input', calculateMatch);
  calculateMatch(); // Initial run
}

// Interactive event tab details
function initEventTabs() {
  const scheduleCards = document.querySelectorAll('.schedule-card');
  scheduleCards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle current card active state
      const wasActive = card.classList.contains('active');
      scheduleCards.forEach(c => c.classList.remove('active'));
      if (!wasActive) {
        card.classList.add('active');
      }
    });
  });
}
