const WHATSAPP_LINK = "https://wa.me/201014709207";
const FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfQ1BIQzUzxga6NhiYrvbY4R4UqhJyTKQXUB1jPU0nGpbbkgw/viewform?usp=dialog";

function toggleTheme(){
  document.body.classList.toggle("dark");
  try{
    localStorage.setItem('site_theme_dark', document.body.classList.contains('dark') ? '1' : '0');
  }catch(e){}
  try{
    document.dispatchEvent(new CustomEvent('themechange'));
  }catch(e){}
}

(function(){
  try{
    const t = localStorage.getItem('site_theme_dark');
    if(t === '1') {
      document.body.classList.add('dark');
      try{ document.dispatchEvent(new CustomEvent('themechange')); }catch(e){}
    }
  }catch(e){}
})();

const menu = document.getElementById("menu");
const burgerNodes = document.querySelectorAll('.burger');
burgerNodes.forEach(b => {
  if(b) b.addEventListener('click', function(){
    if(menu) menu.classList.toggle("open");
  });
});
function closeMenu(){ if(menu) menu.classList.remove("open"); }

const pages = [...document.querySelectorAll(".page")];
function go(hash){
  if(!hash) hash = "#home";
  window.location.hash = hash;
}
function show(hash){
  const id = (hash || "#home").replace("#","");
  pages.forEach(p=>p.classList.remove("active"));
  const el = document.getElementById(id) || document.getElementById("home");
  if(el) el.classList.add("active");
  closeMenu();
}
window.addEventListener("hashchange", ()=>show(location.hash));
show(location.hash);

function openWhatsApp() {
  window.open(WHATSAPP_LINK, "_blank");
}
function openForm(){
  if(!FORM_LINK || FORM_LINK.includes("PUT_YOUR_GOOGLE_FORM_LINK_HERE")){
    alert("ضع رابط جوجل فورم داخل ملف script.js في المتغير FORM_LINK.");
    return;
  }
  window.open(FORM_LINK, "_blank");
}

const TEST_KEY = "lg_testimonials";
function getTestimonials(){ return JSON.parse(localStorage.getItem(TEST_KEY) || "[]"); }
function setTestimonials(arr){ localStorage.setItem(TEST_KEY, JSON.stringify(arr)); }
function defaultTestimonials(){
  return [
    {name:"أحمد م.", rate:5, text:"بدل القطعة بسرعة والشغل كان ممتاز جداً، أنصح بيهم."},
    {name:"سارة ج.", rate:5, text:"خدمة محترفة وموظفين مهذبين. الجهاز بقى زي الجديد."},
    {name:"محمود ع.", rate:4, text:"وصلوا في المعاد، والسعر كان مناسب."}
  ];
}

function computeRatingSummary(list){
  if(!list || list.length===0) return {avg:5,count:0,breakdown:[0,0,0,0,0]};
  const count = list.length;
  const sum = list.reduce((s,r)=> s + (r.rate||0), 0);
  const avg = Math.round((sum/count)*10)/10;
  const breakdown = [5,4,3,2,1].map(st => list.filter(r=>r.rate===st).length);
  return {avg, count, breakdown};
}

function renderTestimonials(){
  let arr = getTestimonials();
  if(arr.length===0){ arr = defaultTestimonials(); setTestimonials(arr); }
  const summary = computeRatingSummary(arr);
  const forcedBreakdown = [2580, 1543, 87, 0, 0];
  const forcedTotal = forcedBreakdown.reduce((s,n)=>s+n,0);
  const weightedSum = 5*forcedBreakdown[0] + 4*forcedBreakdown[1] + 3*forcedBreakdown[2] + 2*forcedBreakdown[3] + 1*forcedBreakdown[4];
  const forcedAvg = forcedTotal > 0 ? Math.round((weightedSum/forcedTotal)*10)/10 : 0;
  summary.breakdown = forcedBreakdown.slice();
  summary.count = forcedTotal;
  summary.avg = forcedAvg;
  
  const avgNumEl = document.getElementById('avgRatingNum');
  const avgStarsEl = document.getElementById('avgStars');
  const countEl = document.getElementById('reviewsCount');
  const barsEl = document.getElementById('ratingBars');
  const grid = document.getElementById('reviewsGrid');

  if(avgNumEl) avgNumEl.textContent = summary.avg;
  if(avgStarsEl) avgStarsEl.textContent = '★'.repeat(Math.round(summary.avg)) + '☆'.repeat(5 - Math.round(summary.avg));
  if(countEl) countEl.textContent = `من ${summary.count} تقييم`;

  if(barsEl){
    barsEl.innerHTML = '';
    const total = summary.count || 1;
 
    [5,4,3,2,1].forEach((s,i)=>{
      const pct = Math.round((summary.breakdown[i]/total)*100);
      const row = document.createElement('div');
      row.className = 'rating-bar';
      row.innerHTML = `<div style="width:40px;text-align:right">${s}★</div><div class="bar"><i style="width:${pct}%"></i></div><div style="width:40px">${summary.breakdown[i]}</div>`;
      barsEl.appendChild(row);
    });
  }

  if(grid){
    
    grid.innerHTML = '';
    arr.forEach(r=>{
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `<div class="r-name">${r.name || 'عميل'}</div>
                        <div class="r-stars">${'★'.repeat(r.rate) + '☆'.repeat(5-r.rate)}</div>
                        <div class="r-text">${r.text}</div>`;
      grid.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderTestimonials();

  const img = document.getElementById('heroImagePlaceholder');
  if(img && !img.src.includes('PUT_IMAGE_LINK_HERE')){
    const note = img.nextElementSibling;
    if(note) note.style.display = 'none';
  }

  document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      const h = this.getAttribute('data-hash') || '#home';
      go(h);
      show(h);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.nav-order').forEach(a=>{
    a.addEventListener('click', function(e){
      e.preventDefault();
      openForm();
    });
  });

  const logoText = document.querySelector('.navbar-logo-text') || document.querySelector('.logo-text');
  if(logoText) {
    logoText.addEventListener('click', function(){ go('#home'); show('#home'); window.scrollTo({ top:0, behavior:'smooth' }); });
    logoText.style.cursor = 'pointer';
  }

  const navThemeToggle = document.getElementById('navThemeToggle');
  if(navThemeToggle){
    if(!navThemeToggle.dataset.originalText) navThemeToggle.dataset.originalText = navThemeToggle.textContent.trim();
    navThemeToggle.addEventListener('click', function(e){
      e.preventDefault();
      toggleTheme();
    });
  }

  handleHeaderScroll();
});

(function servicesTabs(){
  document.addEventListener('click', function(e){
    const t = e.target.closest('.service-tabs .tab');
    if(!t) return;
    const parent = t.parentElement;
    parent.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    t.classList.add('active');

    const target = t.getAttribute('data-tab');
    document.querySelectorAll('.service-pane').forEach(p=>{
      if(p.id === target){
        p.classList.add('active');
        p.hidden = false;
      } else {
        p.classList.remove('active');
        p.hidden = true;
      }
    });

    const el = document.getElementById('services');
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();

(function accordions(){
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.acc-trigger');
    if(!btn) return;
    const panel = btn.nextElementSibling;
    if(!panel) return;
    const open = panel.style.display === 'block';
    const acc = btn.closest('.accordion');
    if(acc){
      acc.querySelectorAll('.acc-panel').forEach(p=>p.style.display='none');
    }
    panel.style.display = open ? 'none' : 'block';
  });
})();

(function runKpis(){
  const kpis = document.querySelectorAll('.kpi-num');
  if(!kpis || kpis.length===0) return;
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        if(el.dataset.animated) return;
        el.dataset.animated = '1';
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        let start = 0;
        const dur = 1400;
        const step = Math.max(20, Math.floor(dur / Math.max(1,target)));
        const startTime = performance.now();
        function tick(now){
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / dur);
          const cur = Math.floor(progress * target);
          el.textContent = cur.toLocaleString('ar-EG');
          if(progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('ar-EG');
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, {threshold:0.4});
  kpis.forEach(k=>io.observe(k));
})();

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.service-pane').forEach(p=>{
    if(!p.classList.contains('active')) p.hidden = true;
  });
});

const siteNavbar = document.getElementById('siteNavbar') || document.querySelector('.navbar');
function handleHeaderScroll(){
  if(!siteNavbar) return;
  const scrolled = window.scrollY > 20;
  if(scrolled) siteNavbar.classList.add('scrolled');
  else siteNavbar.classList.remove('scrolled');
}
window.addEventListener('scroll', handleHeaderScroll);

(function ensureLogoText(){
  const img = document.querySelector('.navbar-logo-img') || document.getElementById('siteLogoImg');
  const text = document.querySelector('.navbar-logo-text') || document.querySelector('.logo-text');
  if(img && text){
    if(!img.src || img.src.trim() === ""){
      img.style.display = 'none';
      text.style.display = 'block';
    } else {
      img.addEventListener('error', function(){ img.style.display = 'none'; text.style.display = 'block'; });
    }
  }
})();
