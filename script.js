const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
let shootingStars = [];

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

/* STAR CLASS */
class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.5;
    this.baseOpacity = this.opacity;
    this.twinkleSpeed = Math.random() * 0.02 + 0.01;
    this.vx = (Math.random() - 0.5) * 0.5; // velocity x
    this.vy = (Math.random() - 0.5) * 0.5; // velocity y
    this.mouseInfluence = Math.random() * 100 + 80; // larger force field
  }

  update(time) {
    // basic movement
    this.x += this.vx;
    this.y += this.vy;

    // wrap around edges
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    // mouse reactivity - attraction/repulsion
    if (mouse.x) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouseInfluence) {
        const force = (this.mouseInfluence - distance) / this.mouseInfluence;
        this.x -= (dx / distance) * force * 8;
        this.y -= (dy / distance) * force * 8;
      }
    }

    // twinkle
    this.opacity += (Math.random() - 0.5) * this.twinkleSpeed;
    this.opacity = Math.max(0.2, Math.min(this.baseOpacity, this.opacity));
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.fill();
  }
}

/* SHOOTING STAR */
class ShootingStar {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.len = Math.random() * 80 + 20;
    this.speed = Math.random() * 10 + 6;
    this.angle = Math.PI / 4;
    this.life = 0;
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.life++;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - this.len * Math.cos(this.angle),
      this.y - this.len * Math.sin(this.angle)
    );
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function init() {
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push(new Star());
  }
}

function drawConnections() {
  // draw lines between nearby stars
  const connectionDistance = 100;

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = (1 - distance / connectionDistance) * 0.3;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.strokeStyle = `rgba(128,128,128,${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

let animationFrame = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    s.update(animationFrame);
    s.draw();
  });

  // draw connections between nearby stars
  drawConnections();

  // shooting stars occasionally
  if (Math.random() < 0.01) {
    shootingStars.push(new ShootingStar());
  }

  shootingStars.forEach((s, i) => {
    s.update();
    s.draw();

    if (s.life > 60) {
      shootingStars.splice(i, 1);
    }
  });

  animationFrame++;
  requestAnimationFrame(animate);
}

init();
animate();