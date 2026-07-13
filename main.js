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

// Drink Matcher Database (ordered from Bold in Black to Dessert Sweet)
const DRINK_DATABASE = [
  {
    name: "Black Espresso",
    desc: "A bold, intense double shot of our premium signature house espresso blend. Straight and strong.",
    img: "assets/espresso_shot.jpg"
  },
  {
    name: "Drip Coffee",
    desc: "Our premium signature house blend, locally roasted and brewed fresh all day long. Classic and unpretentious.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Nitro Coffee",
    desc: "Creamy, smooth cold brew coffee infused with nitrogen and served draft-cold for an ultra-smooth finish.",
    img: "assets/nitro_coffee.jpg"
  },
  {
    name: "Americano",
    desc: "A bold double shot of our premium house espresso blend lengthened with hot water. Clean and robust.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Cafe Latte",
    desc: "Double shot of espresso blended with silky steamed milk and finished with a thin layer of velvety foam.",
    img: "assets/cafe_latte.jpg"
  },
  {
    name: "Cappuccino",
    desc: "Double espresso topped with equal parts steamed milk and thick, luxurious warm milk foam.",
    img: "assets/cappuccino.jpg"
  },
  {
    name: "Italian Macchiato",
    desc: "A bold, concentrated double shot of espresso marked with a single dollop of warm milk foam.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Cafe Mocha",
    desc: "Espresso combined with dark cocoa syrup, steamed milk, and a light dusting of chocolate powder.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Cafe Con leche",
    desc: "Traditional, strongly brewed espresso mixed with sweetened steamed milk for a smooth, balanced kick.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Cubano Nitro",
    desc: "Rich espresso combined with nitrogen cold brew, sweetened condensed milk, and topped with fresh whipped cream.",
    img: "assets/cubano_nitro.jpeg"
  },
  {
    name: "Honey Haze",
    desc: "A comforting blend of double espresso, vanilla, natural sweet honey, and creamy oat milk.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Cinnamon Toast Latte",
    desc: "Espresso with brown sugar, sweet vanilla, warm cinnamon, and textured whole milk. Tastes like childhood comfort.",
    img: "https://assets.zyrosite.com/kKuMz4O3W0xbbwAe/8vs8e7-EMsYqQtOTAsHGOFr.png"
  },
  {
    name: "Matcha",
    desc: "Premium, finely ground green tea matcha prepared with steamed milk and a touch of sweetness.",
    img: "assets/matcha_latte.jpg"
  },
  {
    name: "Chai",
    desc: "Steamed black tea infused with warm, aromatic spices (cinnamon, cardamom, ginger), milk, and honey.",
    img: "assets/chai_latte.jpg"
  },
  {
    name: "Double Dark Mocha",
    desc: "For the dark chocolate lover. Bold double espresso blended with rich dark cocoa and topped with chocolate-dusted whipped cream.",
    img: "assets/dark_chocolate_dream.jpg"
  },
  {
    name: "Caramel Dream",
    desc: "Our signature best-seller. Double espresso layered with sweet caramel, steamed milk, and a generous crown of whipped cream.",
    img: "assets/caramel_dream.jpg"
  },
  {
    name: "White Chocolate Dream",
    desc: "Indulgent white chocolate melted slowly into hot espresso, finished with warm milk and fresh whipped cream.",
    img: "assets/white_chocolate_dream.jpg"
  },
  {
    name: "Tuxedo Dream Cubano",
    desc: "The ultimate dessert treat. Iced coffee featuring a decadent swirl of white and dark chocolate drizzles, marshmallow, milk, and whipped cream.",
    img: "assets/toasted_tuxedo_dream.jpeg"
  }
];

function initDrinkMatcher() {
  const slider = document.getElementById('drink-slider');
  const resultContainer = document.getElementById('matcher-result-display');

  if (!slider || !resultContainer) return;

  let currentDrinkName = '';

  const calculateMatch = () => {
    // Convert slider value (1-18) to array index (0-17)
    const val = parseInt(slider.value);
    const index = Math.min(Math.max(val - 1, 0), DRINK_DATABASE.length - 1);
    const drink = DRINK_DATABASE[index];

    // Only update if the selected drink changes to prevent constant blinking
    if (drink.name === currentDrinkName) return;
    currentDrinkName = drink.name;

    // Fade transition out/in
    resultContainer.style.opacity = 0;
    setTimeout(() => {
      resultContainer.innerHTML = `
        <div class="match-display">
          <img src="${drink.img}" alt="${drink.name}" class="match-img">
          <div class="match-info-box">
            <span class="drink-meta">Your Perfect Cup</span>
            <h4>${drink.name}</h4>
            <p>${drink.desc}</p>
            <div style="margin-top: 15px;">
              <a href="menu.html" class="btn btn-accent" style="padding: 8px 16px; font-size: 0.85rem;">Order Now</a>
            </div>
          </div>
        </div>
      `;
      resultContainer.style.opacity = 1;
    }, 150);
  };

  slider.addEventListener('input', calculateMatch);
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
