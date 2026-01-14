(function(){
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const yearEl = document.getElementById('year');
  const form = document.getElementById('contact-form');
  const mailBtn = document.getElementById('mailto-fallback');
  const status = document.getElementById('form-status');

  // set year
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // initial theme from prefers-color-scheme or saved
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  function applyTheme(theme){
    if(theme === 'light') root.classList.add('light'); else root.classList.remove('light');
    localStorage.setItem('theme', theme);
  }
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  // toggle
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      const isLight = root.classList.contains('light');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // basic form validation + fake submit
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      status.textContent = '';
      const data = new FormData(form);
      const name = data.get('name')?.trim();
      const email = data.get('email')?.trim();
      const message = data.get('message')?.trim();
      if(!name || !email || !message){
        status.textContent = 'Please complete all fields.';
        return;
      }
      // pretend to send
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Sending...';
      setTimeout(()=>{
        btn.disabled = false; btn.textContent = 'Send message';
        status.textContent = 'Message sent — we will reply shortly.';
        form.reset();
      }, 900);
    });
  }

  if(mailBtn){
    mailBtn.addEventListener('click', ()=>{
      const subject = encodeURIComponent('Project inquiry');
      const body = encodeURIComponent('Hi,\n\nI would like to talk about a project.');
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    });
  }

  // Live background: canvas particle wallpaper
  function initLiveBackground(){
    const container = document.getElementById('live-bg');
    if(!container) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = 0, h = 0;
    function resize(){
      dpr = Math.max(1, window.devicePixelRatio || 1);
      w = Math.floor(container.clientWidth);
      h = Math.floor(container.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    const particles = [];
    const PARTICLE_COUNT = Math.max(8, Math.floor((window.innerWidth * window.innerHeight) / 90000));

    function rand(min,max){ return Math.random()*(max-min)+min }

    function createParticle(){
      return {
        x: rand(0,w),
        y: rand(0,h),
        r: rand(20,120),
        vx: rand(-0.05,0.05),
        vy: rand(-0.02,0.02),
        hue: rand(180,260),
        alpha: rand(0.06,0.18)
      };
    }

    function initParticles(){
      particles.length = 0;
      for(let i=0;i<PARTICLE_COUNT;i++) particles.push(createParticle());
    }

    let rafId = null;
    function draw(){
      ctx.clearRect(0,0,w,h);
      // subtle base gradient
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0,'rgba(123,97,255,0.06)');
      g.addColorStop(1,'rgba(0,212,255,0.04)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

      for(const p of particles){
        p.x += p.vx * (w/800);
        p.y += p.vy * (h/600);
        // wrap
        if(p.x < -p.r) p.x = w + p.r;
        if(p.x > w + p.r) p.x = -p.r;
        if(p.y < -p.r) p.y = h + p.r;
        if(p.y > h + p.r) p.y = -p.r;

        const rad = ctx.createRadialGradient(p.x, p.y, p.r*0.15, p.x, p.y, p.r);
        rad.addColorStop(0, `hsla(${p.hue},90%,66%, ${p.alpha})`);
        rad.addColorStop(1, `hsla(${p.hue+30},100%,50%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = rad;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    }

    const onResize = () => { resize(); initParticles(); };
    window.addEventListener('resize', onResize);
    resize(); initParticles(); draw();

    // return cleanup
    return ()=>{
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }

  // start live background unless prefers-reduced-motion
  if(!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    const stopBg = initLiveBackground();
  }
  
  /* Showcase: sample entries, rendering, filters, and modal viewer */
  const sampleEntries = [
    {id:1,title:'Aurora Interface',category:'interactive',desc:'Micro-interactions and delight.',thumb:'assets/thumb1.svg',video:'',author:'Lena Park'},
    {id:2,title:'Motion System',category:'motion',desc:'Design system with motion tokens.',thumb:'assets/thumb2.svg',video:'',author:'Orbit Studio'},
    {id:3,title:'Brand Refresh',category:'branding',desc:'Identity and visual language.',thumb:'assets/thumb3.svg',video:'',author:'Craft Co.'},
    {id:4,title:'Playable Prototype',category:'interactive',desc:'Playable demo built in Framer.',thumb:'assets/thumb4.svg',video:'',author:'Team X'}
  ];

  function renderShowcase(items){
    const grid = document.getElementById('showcase-grid');
    if(!grid) return;
    grid.innerHTML = '';
    for(const it of items){
      const card = document.createElement('button');
      card.className = 'showcase-card';
      card.setAttribute('role','listitem');
      card.dataset.id = it.id;

      const thumb = document.createElement('div'); thumb.className='thumb';
      if(it.thumb){
        thumb.innerHTML = `<img src="${it.thumb}" alt="${it.title} thumbnail">`;
      } else {
        // fallback placeholder
        thumb.innerHTML = `<svg width="320" height="160" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a${it.id}" x1="0" x2="1"><stop offset="0" stop-color="#7b61ff"/><stop offset="1" stop-color="#00d4ff"/></linearGradient></defs><rect width="320" height="160" rx="10" fill="url(#a${it.id})"/><text x="16" y="28" fill="rgba(255,255,255,0.95)" font-size="16" font-family="sans-serif">${it.title}</text></svg>`;
      }

      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `<h3>${it.title}</h3><p>${it.desc}</p><div class="muted">${it.author} · ${it.category}</div>`;

      card.appendChild(thumb);
      card.appendChild(meta);
      grid.appendChild(card);
    }
  }

  function applyFilters(){
    const q = (document.getElementById('search')?.value || '').toLowerCase();
    const cat = document.getElementById('category-filter')?.value || 'all';
    const filtered = sampleEntries.filter(e=>{
      if(cat!=='all' && e.category!==cat) return false;
      if(q && !(e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.author.toLowerCase().includes(q))) return false;
      return true;
    });
    renderShowcase(filtered);
  }

  // wire controls
  const searchEl = document.getElementById('search');
  const catEl = document.getElementById('category-filter');
  if(searchEl) searchEl.addEventListener('input', () => applyFilters());
  if(catEl) catEl.addEventListener('change', () => applyFilters());

  // initial render
  applyFilters();

  // modal viewer
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  function openModal(id){
    const e = sampleEntries.find(s=>s.id==id); if(!e) return;
    modalContent.innerHTML = `<div><h3>${e.title}</h3><p class="muted">${e.author} · ${e.category}</p><div style="margin-top:12px"><div class=\"modal-video\">Preview placeholder — add a video URL in the data for playback.</div></div><p style=\"margin-top:12px\">${e.desc}</p></div>`;
    modal.hidden = false; modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){ if(!modal) return; modal.hidden = true; modal.setAttribute('aria-hidden','true'); modalContent.innerHTML=''; }
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', (ev)=>{ if(ev.target===modal) closeModal(); });

  // delegate clicks from grid to modal open
  const grid = document.getElementById('showcase-grid');
  if(grid){
    grid.addEventListener('click', (ev)=>{
      const btn = ev.target.closest('.showcase-card');
      if(!btn) return;
      openModal(btn.dataset.id);
    });
  }
})();