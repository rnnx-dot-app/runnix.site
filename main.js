// ========================================
// Runnix — main.js (COMPLETO)
// ========================================

// ========================================
// INCLUDE PARTIALS
// ========================================
async function include(id, url){
  const el = document.getElementById(id);
  if(!el) return;
  try{
    const r = await fetch(url, { cache: "no-cache" });
    if(!r.ok) throw new Error(`Fetch failed: ${url} (${r.status})`);
    el.innerHTML = await r.text();
  }catch(e){ 
    console.error("Include failed:", e); 
  }
}

// ========================================
// MENU MOBILE
// ========================================
function getMenuEls(){
  return {
    toggle: document.querySelector(".nav-toggle"),
    drawer: document.getElementById("mobileMenu"),
    overlay: document.querySelector("[data-menu-overlay]"),
  };
}

function openMenu(){
  const { toggle, drawer, overlay } = getMenuEls();
  if(!toggle || !drawer || !overlay) return;

  drawer.hidden = false;
  overlay.hidden = false;

  document.body.classList.add("menu-open");
  toggle.setAttribute("aria-expanded", "true");

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function closeMenu(){
  const { toggle, drawer, overlay } = getMenuEls();
  if(!toggle || !drawer || !overlay) return;

  document.body.classList.remove("menu-open");
  toggle.setAttribute("aria-expanded", "false");

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  window.setTimeout(()=>{
    drawer.hidden = true;
    overlay.hidden = true;
  }, 220);
}

function toggleMenu(){
  if(document.body.classList.contains("menu-open")) closeMenu();
  else openMenu();
}

function initMobileMenu(){
  // Event delegation per menu mobile
  document.addEventListener("click", (e)=>{
    const toggleBtn = e.target.closest(".nav-toggle");
    if(toggleBtn){
      e.preventDefault();
      toggleMenu();
      return;
    }

    const closeBtn = e.target.closest(".mobile-menu__close");
    if(closeBtn){
      e.preventDefault();
      closeMenu();
      return;
    }

    const overlay = e.target.closest("[data-menu-overlay]");
    if(overlay){
      e.preventDefault();
      closeMenu();
      return;
    }

    const drawerLink = e.target.closest("#mobileMenu a");
    if(drawerLink){
      closeMenu();
      return;
    }
  });

  // Chiudi con ESC
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && document.body.classList.contains("menu-open")){
      closeMenu();
    }
  });

  // Chiudi se passi a desktop
  const mq = window.matchMedia("(min-width: 981px)");
  const onChange = ()=>{
    if(mq.matches && document.body.classList.contains("menu-open")){
      closeMenu();
    }
  };
  if(mq.addEventListener) mq.addEventListener("change", onChange);
  else mq.addListener(onChange);
}

// ========================================
// PARALLAX HERO
// ========================================
function initHeroParallax(){
  const heroImg = document.querySelector('.hero-img');
  if(!heroImg) return;

  const onScroll = ()=>{
    const y = window.scrollY * 0.12;
    heroImg.style.transform = `translateY(${Math.min(80, y)}px) scale(1.02)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ========================================
// PRICING TOGGLE
// ========================================
function initPricingToggle(){
  const toggle = document.getElementById('billingToggle');
  const priceEls = document.querySelectorAll('.amount[data-monthly][data-annual]');

  if(!toggle || priceEls.length === 0) return;

  function applyBilling(isAnnual){
    priceEls.forEach(el => {
      el.innerHTML = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
  }

  toggle.addEventListener('change', (e) => {
    applyBilling(e.target.checked);
  });
  
  applyBilling(toggle.checked);
}

// ========================================
// INIT: carica tutto in ordine
// ========================================
async function init(){
  // 1. Carica header e footer
  await include('site-header', '/partials/header.html');
  await include('site-footer', '/partials/footer.html');

  // 2. Inizializza menu mobile (DOPO che header è caricato)
  initMobileMenu();

  // 3. Parallax hero (se esiste nella pagina)
  initHeroParallax();

  // 4. Toggle pricing (se esiste nella pagina)
  initPricingToggle();
}

// ========================================
// AVVIO AUTOMATICO
// ========================================
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}