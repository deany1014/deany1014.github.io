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
  constructor(layer) {
    this.layer = layer;
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * this.layer;
    this.speed = this.layer * 0.2;
    this.opacity = Math.random();
  }

  update() {
    this.y += this.speed;

    // twinkle
    this.opacity += (Math.random() - 0.5) * 0.05;
    this.opacity = Math.max(0.2, Math.min(1, this.opacity));

    if (this.y > canvas.height) {
      this.reset();
      this.y = 0;
    }

    // mouse parallax
    if (mouse.x) {
      this.x += (mouse.x - canvas.width / 2) * 0.0003 * this.layer;
    }
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
    stars.push(new Star(Math.random() * 3 + 1));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    s.update();
    s.draw();
  });

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

  requestAnimationFrame(animate);
}

init();
animate();