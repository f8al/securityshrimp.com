// Matrix Rain Effect — canvas-based, hero section only
class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]=/\\';
    this.running = false;
    this.animFrame = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = Array.from({ length: colCount }, () => Math.random() * -50);
  }

  draw() {
    this.ctx.fillStyle = 'rgba(8, 8, 8, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#00E5CC';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;

      this.ctx.globalAlpha = Math.random() * 0.5 + 0.1;
      this.ctx.fillText(char, x, y);
      this.ctx.globalAlpha = 1;

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.draw();
      this.animFrame = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// Initialize matrix rain on hero canvas
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const rain = new MatrixRain(canvas);
  rain.start();

  // Pause when hero is not visible
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) rain.start();
    else rain.stop();
  }, { threshold: 0.1 });

  observer.observe(canvas.parentElement);

  // Auto-apply glitch effect to all h1s
  document.querySelectorAll('h1').forEach(el => {
    if (el.querySelector('.glitch')) return;
    const text = el.textContent;
    el.innerHTML = `<span class="glitch" data-text="${text}">${text}</span>`;
  });
});
