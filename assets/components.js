/* Praful Singru Lab – Shared Components + Neural Animation */

const NAV = `
<nav id="nav">
  <div class="nav-wrap">
    <a href="index.html" class="nav-logo">
      <span class="nav-logo-name">Praful Singru Lab</span>
      <span class="nav-logo-sub">NISER Bhubaneswar &ensp;·&ensp; Neuroscience</span>
    </a>
    <div class="nav-links" id="navLinks">
      <a href="index.html">Home</a>
      <a href="research.html">Research</a>
      <a href="people.html">People</a>
      <a href="publications.html">Publications</a>
      <a href="join.html">Join Us</a>
    </div>
    <div class="ham" id="ham" role="button" aria-label="Menu" tabindex="0">
      <span></span><span></span><span></span>
    </div>
  </div>
  <div class="mob-nav" id="mobNav">
    <a href="index.html">Home</a>
    <a href="research.html">Research</a>
    <a href="people.html">People</a>
    <a href="publications.html">Publications</a>
    <a href="join.html">Join Us</a>
  </div>
</nav>`;

const FOOTER = `
<footer>
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <div class="footer-brand-name">Praful Singru Lab</div>
        <div class="footer-gold-line"></div>
        <div class="footer-brand-inst">
          School of Biological Sciences<br>
          National Institute of Science Education and Research<br>
          P.O. Jatni, Bhubaneswar, Odisha 752050, India
        </div>
      </div>
      <div>
        <div class="footer-col-head">Navigate</div>
        <div class="footer-col">
          <a href="index.html">Home</a>
          <a href="research.html">Research</a>
          <a href="people.html">People</a>
          <a href="publications.html">Publications</a>
          <a href="join.html">Join Us</a>
        </div>
      </div>
      <div>
        <div class="footer-col-head">Research</div>
        <div class="footer-col">
          <a href="research.html#maternal-aggression">Maternal Aggression</a>
          <a href="research.html#energy-homeostasis">Energy Homeostasis</a>
          <a href="research.html#neuroendocrine-integration">Neuroendocrine Integration</a>
          <a href="research.html#comparative-evolutionary">Comparative Neurobiology</a>
        </div>
      </div>
      <div>
        <div class="footer-col-head">Connect</div>
        <div class="footer-col">
          <a href="mailto:praful@niser.ac.in">praful@niser.ac.in</a>
          <a href="https://www.researchgate.net/scientific-contributions/Praful-S-Singru-38752175" target="_blank" rel="noopener">ResearchGate</a>
          <a href="https://orcid.org" target="_blank" rel="noopener">ORCID</a>
          <a href="https://www.niser.ac.in/profile/pssingru" target="_blank" rel="noopener">NISER Profile</a>
          <a href="join.html">Open Positions</a>
        </div>
      </div>
    </div>
    <div class="footer-base">
      <span>© 2025 Praful Singru Lab — NISER Bhubaneswar</span>
      <span>School of Biological Sciences</span>
    </div>
  </div>
</footer>`;

document.addEventListener('DOMContentLoaded', () => {
  const np = document.getElementById('nav-ph');
  if (np) np.outerHTML = NAV;
  const fp = document.getElementById('footer-ph');
  if (fp) fp.outerHTML = FOOTER;

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a, .mob-nav a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  document.addEventListener('click', e => {
    if (e.target.closest('#ham')) {
      document.getElementById('mobNav')?.classList.toggle('open');
    } else if (!e.target.closest('#nav')) {
      document.getElementById('mobNav')?.classList.remove('open');
    }
  });

  const nav = document.getElementById('nav');
  if (nav) {
    const tick = () => nav.classList.toggle('solid', scrollY > 30);
    addEventListener('scroll', tick, { passive: true });
    tick();
  }

  const canvas = document.getElementById('neuralCanvas');
  if (canvas) initNeuralCanvas(canvas);

  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const yr = btn.dataset.yr;
      document.querySelectorAll('.pub-year-block').forEach(b => {
        b.style.display = (yr === 'all' || b.dataset.yr === yr) ? '' : 'none';
      });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
});

/* ═══════════════════════════════════════════════════════════
   NEURAL CANVAS — Immersive full-viewport neuroscience scene
   ═══════════════════════════════════════════════════════════
   Three layers:
   1. Faint background starfield of micro-nodes
   2. Large hero neuron on the right — soma + sweeping dendrites
   3. Network of 28 drifting neurons across the full canvas
      with action potentials firing in cascades
═══════════════════════════════════════════════════════════ */
function initNeuralCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, nodes, signals, heroNeuron, microField, lastFire = 0, raf;

  /* ── Palette ── */
  const C = {
    gold:   (a) => `rgba(184,146,42,${a})`,
    pale:   (a) => `rgba(232,213,163,${a})`,
    bright: (a) => `rgba(255,248,210,${a})`,
    blue:   (a) => `rgba(60,100,160,${a})`,
  };

  /* ══════════════════════════════════════
     MICRO FIELD  — tiny static background dots
  ══════════════════════════════════════ */
  function makeMicroField() {
    const n = Math.floor(W * H / 6000);
    return Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 0.9 + 0.2,
      a: Math.random() * 0.07 + 0.02,
    }));
  }

  function drawMicroField() {
    microField.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = C.gold(p.a);
      ctx.fill();
    });
  }

  /* ══════════════════════════════════════
     HERO NEURON  — large decorative neuron
     positioned in right half of canvas
  ══════════════════════════════════════ */
  class HeroNeuron {
    constructor() { this.build(); }

    build() {
      // Anchor at roughly 72% x, 42% y
      this.cx = W * 0.72;
      this.cy = H * 0.42;
      this.r  = 9;
      this.glow = 0;
      this.pulse = 0;
      this.t = 0;

      // 10 long primary dendrites radiating from soma
      const count = 10;
      this.dendrites = Array.from({ length: count }, (_, i) => {
        const baseAngle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const len = Math.random() * 180 + 100;
        // 2-3 secondary branches per dendrite
        const secCount = Math.floor(Math.random() * 2) + 2;
        const secondaries = Array.from({ length: secCount }, (_, j) => {
          const t = 0.45 + j * 0.22 + (Math.random() - 0.5) * 0.08;
          const splitAngle = baseAngle + (Math.random() - 0.5) * 0.9;
          const splitLen = len * (0.35 + Math.random() * 0.25);
          // Tertiary tips
          const tertiaries = Math.random() > 0.5
            ? [{ angle: splitAngle + (Math.random()-0.5)*0.7, len: splitLen*0.45, t: 0.6 }]
            : [];
          return { t, angle: splitAngle, len: splitLen, tertiaries };
        });
        return { angle: baseAngle, len, secondaries };
      });

      // One long axon going left-downward
      this.axon = {
        angle: Math.PI * 1.15,
        len: W * 0.38,
        kink: { t: 0.55, da: 0.25 }, // slight bend
      };
      // Axon terminal branches
      this.axonTerminals = Array.from({ length: 4 }, (_, i) => ({
        angle: this.axon.angle + 0.15 + (i - 1.5) * 0.22,
        len: 60 + Math.random() * 40,
      }));
    }

    fire() { this.glow = 1.0; }

    _dendritePt(d, t) {
      return {
        x: this.cx + Math.cos(d.angle) * d.len * t,
        y: this.cy + Math.sin(d.angle) * d.len * t,
      };
    }

    _drawBranch(x1, y1, x2, y2, alpha, width) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = C.gold(alpha);
      ctx.lineWidth = width;
      ctx.stroke();
    }

    draw(t) {
      this.t = t;
      this.glow = Math.max(0, this.glow - 0.012);
      const pulse = Math.sin(t * 0.0006) * 0.5 + 0.5;
      const g = this.glow;
      const base = 0.08 + pulse * 0.03;

      /* ── Draw dendrites ── */
      this.dendrites.forEach(d => {
        const ex = this.cx + Math.cos(d.angle) * d.len;
        const ey = this.cy + Math.sin(d.angle) * d.len;

        // Primary shaft
        this._drawBranch(this.cx, this.cy, ex, ey, base + g * 0.12, 0.8 + g * 0.5);

        // Secondaries
        d.secondaries.forEach(s => {
          const sp = this._dendritePt(d, s.t);
          const se = {
            x: sp.x + Math.cos(s.angle) * s.len,
            y: sp.y + Math.sin(s.angle) * s.len,
          };
          this._drawBranch(sp.x, sp.y, se.x, se.y, (base * 0.7) + g * 0.08, 0.5);

          // Tertiaries
          s.tertiaries.forEach(ter => {
            const tp = {
              x: sp.x + Math.cos(s.angle) * s.len * ter.t,
              y: sp.y + Math.sin(s.angle) * s.len * ter.t,
            };
            const te = {
              x: tp.x + Math.cos(ter.angle) * ter.len,
              y: tp.y + Math.sin(ter.angle) * ter.len,
            };
            this._drawBranch(tp.x, tp.y, te.x, te.y, base * 0.45, 0.35);
          });

          // Spine-like bumps on secondary
          for (let i = 0; i < 3; i++) {
            const bt = 0.25 + i * 0.3;
            const bx = sp.x + (se.x - sp.x) * bt;
            const by = sp.y + (se.y - sp.y) * bt;
            const spineAngle = s.angle + Math.PI * 0.5 * (Math.random() > 0.5 ? 1 : -1);
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(spineAngle) * 8, by + Math.sin(spineAngle) * 8);
            ctx.strokeStyle = C.gold(base * 0.5);
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });
      });

      /* ── Draw axon ── */
      {
        const kx = this.cx + Math.cos(this.axon.angle) * this.axon.len * this.axon.kink.t;
        const ky = this.cy + Math.sin(this.axon.angle) * this.axon.len * this.axon.kink.t;
        const kAngle = this.axon.angle + this.axon.kink.da;
        const remLen = this.axon.len * (1 - this.axon.kink.t);
        const ex = kx + Math.cos(kAngle) * remLen;
        const ey = ky + Math.sin(kAngle) * remLen;

        this._drawBranch(this.cx, this.cy, kx, ky, base * 1.2 + g * 0.15, 1.0 + g * 0.6);
        this._drawBranch(kx, ky, ex, ey, base * 1.1 + g * 0.12, 0.9 + g * 0.5);

        // Axon terminals
        this.axonTerminals.forEach(at => {
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(at.angle) * at.len, ey + Math.sin(at.angle) * at.len);
          ctx.strokeStyle = C.gold(base * 0.8 + g * 0.1);
          ctx.lineWidth = 0.55;
          ctx.stroke();
        });
      }

      /* ── Soma glow ── */
      if (g > 0.02) {
        const gr = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.r * 6 + g * 35);
        gr.addColorStop(0,   C.pale(g * 0.6));
        gr.addColorStop(0.4, C.gold(g * 0.2));
        gr.addColorStop(1,   C.gold(0));
        ctx.beginPath();
        ctx.arc(this.cx, this.cy, this.r * 6 + g * 35, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      /* ── Ambient soma halo (always present) ── */
      const halo = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, 30 + pulse * 8);
      halo.addColorStop(0,   C.gold(0.06 + pulse * 0.03));
      halo.addColorStop(1,   C.gold(0));
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, 30 + pulse * 8, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      /* ── Soma ── */
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2);
      ctx.fillStyle = C.pale(0.35 + g * 0.55 + pulse * 0.08);
      ctx.fill();

      // Inner bright core
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = C.bright(0.5 + g * 0.4);
      ctx.fill();
    }
  }

  /* ══════════════════════════════════════
     NETWORK NEURON  — small drifting nodes
  ══════════════════════════════════════ */
  class NetNeuron {
    constructor(forceX, forceY) {
      this.x  = forceX !== undefined ? forceX : Math.random() * W;
      this.y  = forceY !== undefined ? forceY : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.r  = Math.random() * 2 + 1.5;
      this.glow     = 0;
      this.base     = Math.random() * 0.06 + 0.04;
      this.phase    = Math.random() * Math.PI * 2;
      this.dendrites = this._mkDend();
      this.axonAngle = Math.random() * Math.PI * 2;
      this.axonLen   = Math.random() * 45 + 22;
    }

    _mkDend() {
      const n = Math.floor(Math.random() * 3) + 4;
      return Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const l = Math.random() * 38 + 14;
        return {
          angle: a, len: l,
          branches: Math.random() > 0.5
            ? [{ angle: a + (Math.random()-0.5)*1.0, len: l*(0.35+Math.random()*0.25) }]
            : [],
        };
      });
    }

    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -60) this.x = W + 60;
      if (this.x > W+60) this.x = -60;
      if (this.y < -60) this.y = H + 60;
      if (this.y > H+60) this.y = -60;
      this.glow = Math.max(0, this.glow - 0.018);
    }

    fire() { this.glow = 1.0; }

    draw(t) {
      const pulse = Math.sin(t * 0.0009 + this.phase) * 0.5 + 0.5;
      const ba = this.base + pulse * 0.02;
      const g  = this.glow;

      this.dendrites.forEach(d => {
        const ex = this.x + Math.cos(d.angle) * d.len;
        const ey = this.y + Math.sin(d.angle) * d.len;
        ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(ex, ey);
        ctx.strokeStyle = C.gold(ba + g * 0.18);
        ctx.lineWidth = 0.5 + g * 0.35; ctx.stroke();
        d.branches.forEach(b => {
          ctx.beginPath(); ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(b.angle)*b.len, ey + Math.sin(b.angle)*b.len);
          ctx.strokeStyle = C.gold(ba * 0.6 + g * 0.08);
          ctx.lineWidth = 0.3; ctx.stroke();
        });
      });

      // Axon
      ctx.beginPath(); ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(this.axonAngle)*this.axonLen,
                 this.y + Math.sin(this.axonAngle)*this.axonLen);
      ctx.strokeStyle = C.gold(ba * 0.9 + g * 0.2);
      ctx.lineWidth = 0.7 + g * 0.4; ctx.stroke();

      // Soma glow
      if (g > 0.02) {
        const gr = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r*6 + g*18);
        gr.addColorStop(0, C.gold(g * 0.45));
        gr.addColorStop(1, C.gold(0));
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r*6+g*18, 0, Math.PI*2);
        ctx.fillStyle = gr; ctx.fill();
      }

      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = C.pale(0.2 + g * 0.6 + pulse * 0.06);
      ctx.fill();
    }
  }

  /* ══════════════════════════════════════
     ACTION POTENTIAL
  ══════════════════════════════════════ */
  class AP {
    constructor(src, tgt) {
      this.sx = typeof src.x !== 'undefined' ? src.x : src.cx;
      this.sy = typeof src.y !== 'undefined' ? src.y : src.cy;
      this.tx = typeof tgt.x !== 'undefined' ? tgt.x : tgt.cx;
      this.ty = typeof tgt.y !== 'undefined' ? tgt.y : tgt.cy;
      this.tgt  = tgt;
      this.t    = 0;
      this.spd  = 0.0055 + Math.random() * 0.004;
      this.done = false;
      this.trail = [];
    }

    update() {
      this.t = Math.min(1, this.t + this.spd);
      const x = this.sx + (this.tx - this.sx) * this.t;
      const y = this.sy + (this.ty - this.sy) * this.t;
      this.trail.push({ x, y, a: 1 });
      if (this.trail.length > 16) this.trail.shift();
      this.trail.forEach(p => p.a *= 0.8);
      if (this.t >= 1) {
        this.done = true;
        this.tgt.fire();
        // synaptic burst
        const gr = ctx.createRadialGradient(x, y, 0, x, y, 18);
        gr.addColorStop(0, C.bright(0.9));
        gr.addColorStop(0.4, C.gold(0.3));
        gr.addColorStop(1, C.gold(0));
        ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fillStyle = gr; ctx.fill();
      }
    }

    draw() {
      // Axon path
      ctx.beginPath(); ctx.moveTo(this.sx, this.sy); ctx.lineTo(this.tx, this.ty);
      ctx.strokeStyle = C.gold(0.08); ctx.lineWidth = 0.5; ctx.stroke();

      // Trail
      this.trail.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 2*p.a, 0, Math.PI*2);
        ctx.fillStyle = C.pale(p.a * 0.5); ctx.fill();
      });

      // Head
      const hx = this.sx + (this.tx - this.sx) * this.t;
      const hy = this.sy + (this.ty - this.sy) * this.t;
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12);
      hg.addColorStop(0,    C.bright(0.98));
      hg.addColorStop(0.3,  C.pale(0.6));
      hg.addColorStop(1,    C.gold(0));
      ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI*2);
      ctx.fillStyle = hg; ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI*2);
      ctx.fillStyle = C.bright(1); ctx.fill();
    }
  }

  /* ══════════════════════════════════════
     SPARK — trigger cascade firing
  ══════════════════════════════════════ */
  function spark(src) {
    const source = src || nodes[Math.floor(Math.random() * nodes.length)];
    source.fire();
    nodes.forEach(n => {
      if (n === source) return;
      const dx = n.x - (source.x||source.cx);
      const dy = n.y - (source.y||source.cy);
      if (Math.sqrt(dx*dx+dy*dy) < 260 && Math.random() > 0.44) {
        setTimeout(() => {
          if (signals.length < 60) signals.push(new AP(source, n));
        }, Math.random() * 350 + 50);
      }
    });
    // occasionally fire hero neuron
    if (Math.random() > 0.6) {
      setTimeout(() => heroNeuron.fire(), Math.random() * 600 + 200);
    }
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    if (raf) cancelAnimationFrame(raf);
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;

    heroNeuron = new HeroNeuron();
    microField = makeMicroField();
    signals    = [];
    lastFire   = 0;

    // Distribute 30 nodes across FULL canvas — ensure coverage on right side
    nodes = [];
    // Divide canvas into a grid and place 1+ node per cell for even spread
    const cols = 6, rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / cols) * W + (Math.random() * 0.7 + 0.15) * (W / cols);
        const y = (r / rows) * H + (Math.random() * 0.7 + 0.15) * (H / rows);
        nodes.push(new NetNeuron(x, y));
      }
    }

    // Initial fires
    setTimeout(() => spark(), 800);
    setTimeout(() => { heroNeuron.fire(); spark(); }, 2200);
  }

  /* ══════════════════════════════════════
     RENDER LOOP
  ══════════════════════════════════════ */
  function frame(t) {
    ctx.clearRect(0, 0, W, H);

    /* ── Atmospheric background glows ── */
    // Right-side glow (near hero neuron)
    const atm1 = ctx.createRadialGradient(W*0.72, H*0.42, 0, W*0.72, H*0.42, W*0.45);
    atm1.addColorStop(0,   'rgba(120,80,10,0.09)');
    atm1.addColorStop(0.4, 'rgba(60,40,5,0.04)');
    atm1.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = atm1; ctx.fillRect(0,0,W,H);

    // Left-center cool glow
    const atm2 = ctx.createRadialGradient(W*0.25, H*0.55, 0, W*0.25, H*0.55, W*0.5);
    atm2.addColorStop(0,   'rgba(20,50,100,0.07)');
    atm2.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = atm2; ctx.fillRect(0,0,W,H);

    // Bottom ambient
    const atm3 = ctx.createRadialGradient(W*0.5, H, 0, W*0.5, H, H*0.6);
    atm3.addColorStop(0,   'rgba(184,146,42,0.04)');
    atm3.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = atm3; ctx.fillRect(0,0,W,H);

    /* ── Layer 1: micro field ── */
    drawMicroField();

    /* ── Layer 2: resting axon mesh between all nodes ── */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 200) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = C.gold((1 - d/200) * 0.045);
          ctx.lineWidth = 0.4; ctx.stroke();
        }
      }
    }

    /* ── Layer 3: signals ── */
    signals = signals.filter(s => !s.done);
    signals.forEach(s => { s.update(); s.draw(); });

    /* ── Layer 4: network nodes ── */
    nodes.forEach(n => { n.update(); n.draw(t); });

    /* ── Layer 5: hero neuron (drawn on top) ── */
    heroNeuron.draw(t);

    /* ── Periodic cascade ── */
    if (t - lastFire > 2600 + Math.random() * 1200) {
      spark();
      lastFire = t;
    }

    raf = requestAnimationFrame(frame);
  }

  init();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
  raf = requestAnimationFrame(frame);
}
