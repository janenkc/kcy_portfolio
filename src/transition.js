/* ══════════════════════════════════
   PRELOADER
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('done'), 1200);
});

/* ══════════════════════════════════
   DARK MODE TOGGLE
   (init is handled inline in <head> to prevent FOUC)
══════════════════════════════════ */
document.getElementById('dToggle').addEventListener('click', () => {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-dark') === '1';
  html.setAttribute('data-dark', isDark ? '0' : '1');
  localStorage.setItem('dark', isDark ? '0' : '1');
});

/* ══════════════════════════════════
   CURSOR
══════════════════════════════════ */
const cdot  = document.getElementById('cdot');
const cring = document.getElementById('cring');
let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
  cx += (mx - cx) * .13;
  cy += (my - cy) * .13;
  cdot.style.left  = mx + 'px'; cdot.style.top  = my + 'px';
  cring.style.left = cx + 'px'; cring.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, .pcard, .flip-wrap, .spill').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ══════════════════════════════════
   SCROLL PROGRESS + NAV
══════════════════════════════════ */
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('prog').style.width = p + '%';
  document.getElementById('nav').classList.toggle('sc', window.scrollY > 40);
});

/* ══════════════════════════════════
   CANVAS PARTICLE NETWORK
══════════════════════════════════ */
(function () {
  const cv  = document.getElementById('heroCanvas');
  const ctx = cv.getContext('2d');
  let W, H, pts = [];
  function resize() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 70; i++) {
    pts.push({
      x: Math.random() * 1600, y: Math.random() * 900,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 2 + 1
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const dark = document.documentElement.getAttribute('data-dark') === '1';
    const c = dark ? '255,255,255' : '91,74,232';
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},.5)`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${c},${.15 * (1 - dist / 120)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════
   TERMINAL TYPEWRITER
══════════════════════════════════ */
(function () {
  const lines = [
    { t: 'comment', s: '# Hello, World! 👋' },
    { t: 'blank',   s: '' },
    { t: 'code',    s: '<span class="t-kw">class</span> <span class="t-fn">JanenRosales</span>:' },
    { t: 'code',    s: '&nbsp;&nbsp;<span class="t-var">name</span> <span class="t-op">=</span> <span class="t-str">"Janen Kaye Rosales"</span>' },
    { t: 'code',    s: '&nbsp;&nbsp;<span class="t-var">role</span> <span class="t-op">=</span> <span class="t-str">"CS Graduate"</span>' },
    { t: 'code',    s: '&nbsp;&nbsp;<span class="t-var">skills</span> <span class="t-op">=</span> [<span class="t-str">"Python"</span>, <span class="t-str">"React"</span>, <span class="t-str">"Laravel"</span>]' },
    { t: 'blank',   s: '' },
    { t: 'code',    s: '&nbsp;&nbsp;<span class="t-kw">def</span> <span class="t-fn">hire_me</span>(<span class="t-var">self</span>):' },
    { t: 'code',    s: '&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-kw">return</span> <span class="t-str">"Let\'s build something great! 🚀"</span>' },
  ];
  const el = document.getElementById('termBody');
  let li = 0, delay = 400;
  function nextLine() {
    if (li >= lines.length) return;
    const row = lines[li++];
    const div = document.createElement('div');
    if (row.t === 'comment') div.className = 't-comment';
    div.innerHTML = row.s + ' ';
    if (li === lines.length) {
      const cur = document.createElement('span');
      cur.className = 't-cursor'; div.appendChild(cur);
    }
    el.appendChild(div);
    setTimeout(nextLine, li === lines.length ? 0 : delay + (Math.random() * 200));
  }
  setTimeout(nextLine, 1600);
})();

/* ══════════════════════════════════
   TYPING HERO SUBTITLE
══════════════════════════════════ */
const lines2 = ['Full Stack Developer', 'CS Graduate & Aspiring Dev', 'UI/UX Enthusiast', 'Problem Solver 🚀', 'Open to Opportunities ✨'];
let li2 = 0, ci2 = 0, del2 = false;
const tel = document.getElementById('ttext');
function tick() {
  const cur = lines2[li2], shown = del2 ? cur.slice(0, ci2--) : cur.slice(0, ci2++);
  tel.innerHTML = shown + '<span class="cblink"></span>';
  if (!del2 && ci2 > cur.length) { del2 = true; setTimeout(tick, 1600); return; }
  if (del2 && ci2 < 0) { del2 = false; li2 = (li2 + 1) % lines2.length; ci2 = 0; }
  setTimeout(tick, del2 ? 40 : 85);
}
tick();

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); rObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.rv').forEach(el => rObs.observe(el));

/* ══════════════════════════════════
   COUNTERS
══════════════════════════════════ */
function countUp(el) {
  const t = +el.dataset.target; let c = 0;
  const s = () => { if (c < t) { el.textContent = ++c; setTimeout(s, 220 / t); } };
  s();
}
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(countUp);
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hstats').forEach(el => cObs.observe(el));

/* ══════════════════════════════════
   TEXT SCRAMBLE on ABOUT heading
══════════════════════════════════ */
(function () {
  const el = document.getElementById('aboutHead');
  if (!el) return;
  const original = el.innerHTML;
  const chars = '!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      obs.disconnect();
      const plain = el.innerText;
      const queue = plain.split('').map(char => ({
        from: chars[Math.floor(Math.random() * chars.length)],
        to: char,
        start: Math.floor(Math.random() * 30),
        end:   Math.floor(Math.random() * 30) + 30,
        char:  chars[Math.floor(Math.random() * chars.length)]
      }));
      el.classList.add('scramble-done');
      let f = 0;
      (function update() {
        let complete = 0;
        const result = queue.map(item => {
          if (f >= item.end) { complete++; return item.to; }
          if (f >= item.start) {
            item.char = chars[Math.floor(Math.random() * chars.length)];
            return `<span class="hi">${item.char}</span>`;
          }
          return item.from;
        });
        el.innerHTML = result.join('');
        if (complete < queue.length) { f++; requestAnimationFrame(update); }
        else { el.innerHTML = original; }
      })();
    }
  }, { threshold: .5 });
  obs.observe(el);
})();
