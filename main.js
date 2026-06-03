// ========================================
// Runnix — main.js
// ========================================

// ========================================
// INCLUDE PARTIALS
// ========================================
async function include(id, url){
  const el = document.getElementById(id);
  if(!el) return;

  if(el.dataset.includeLoaded === "true") return;

  try{
    el.dataset.includeLoading = "true";
    const r = await fetch(url, { cache: "no-cache" });
    if(!r.ok) throw new Error(`Fetch failed: ${url} (${r.status})`);
    el.innerHTML = await r.text();
    el.dataset.includeLoaded = "true";
  }catch(e){ 
    console.error("Include failed:", e); 
  }finally{
    delete el.dataset.includeLoading;
  }
}

// ========================================
// ACTIVE NAV
// ========================================
function normalizePath(path){
  return path
    .replace(/\/index\.html$/, "/")
    .replace(/\/boost\.html$/, "/")
    .replace(/\/$/, "/");
}

function getActiveNavPath(){
  const path = normalizePath(window.location.pathname);

  if(path === "/home/" || path === "/") return "/home/";
  if(path === "/team/") return "/team/";
  if(path.startsWith("/blog/")) return "/blog/";
  if(path.startsWith("/sala-stampa/")) return "/sala-stampa/";
  if(path === "/contatti/") return "/contatti/";

  return "";
}

function setActiveNavLink(){
  const activePath = getActiveNavPath();

  document
    .querySelectorAll(".center-links a, .mobile-menu__links a")
    .forEach(link => {
      const href = normalizePath(new URL(link.getAttribute("href"), window.location.origin).pathname);
      const isActive = href === activePath;

      link.classList.toggle("is-active", isActive);
      if(isActive){
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
}

// ========================================
// MENU MOBILE
// ========================================
let menuCloseTimer = null;

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

  if(menuCloseTimer){
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = null;
  }

  drawer.hidden = false;
  overlay.hidden = false;

  document.body.classList.add("menu-open");
  toggle.setAttribute("aria-expanded", "true");

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function closeMenu(){
  const { toggle, drawer, overlay } = getMenuEls();

  document.body.classList.remove("menu-open");
  if(toggle) toggle.setAttribute("aria-expanded", "false");

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";

  if(menuCloseTimer) window.clearTimeout(menuCloseTimer);
  menuCloseTimer = window.setTimeout(()=>{
    if(document.body.classList.contains("menu-open")) return;
    if(drawer) drawer.hidden = true;
    if(overlay) overlay.hidden = true;
    menuCloseTimer = null;
  }, 220);
}

function toggleMenu(){
  if(document.body.classList.contains("menu-open")) closeMenu();
  else openMenu();
}

function initMobileMenu(){
  if(document.documentElement.dataset.mobileMenuInit === "true") return;
  document.documentElement.dataset.mobileMenuInit = "true";

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
// FOOTER EMAIL FORM
// ========================================
function initFooterSignup(){
  if(document.documentElement.dataset.footerSignupInit === "true") return;
  document.documentElement.dataset.footerSignupInit = "true";

  document.addEventListener("submit", (e)=>{
    const form = e.target.closest("[data-footer-signup]");
    if(!form) return;

    e.preventDefault();

    const input = form.querySelector('input[type="email"]');
    const status = form.querySelector("[data-footer-signup-status]");

    if(input && !input.checkValidity()){
      input.reportValidity();
      return;
    }

    if(status){
      status.textContent = "Grazie, ti terremo aggiornato.";
    }

    form.reset();
  });
}

function initFooterYear(){
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

// ========================================
// PARALLAX HERO
// ========================================
function initHeroParallax(){
  const heroImg = document.querySelector('.hero-img');
  if(!heroImg) return;

  let ticking = false;

  const update = ()=>{
    const y = window.scrollY * 0.12;
    heroImg.style.transform = `translateY(${Math.min(80, y)}px) scale(1.02)`;
    ticking = false;
  };

  const onScroll = ()=>{
    if(ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
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

  // 2. Inizializza header e menu mobile (DOPO che header è caricato)
  setActiveNavLink();
  initMobileMenu();
  initFooterSignup();
  initFooterYear();

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
