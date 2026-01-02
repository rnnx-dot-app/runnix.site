// =========================
// Runnix — main.js (global)
// =========================

async function includePartial(targetId, url){
  const el = document.getElementById(targetId);
  if(!el) return;

  try{
    const r = await fetch(url, { cache: "no-cache" });
    if(!r.ok) throw new Error(`Fetch failed: ${url} (${r.status})`);
    el.innerHTML = await r.text();
  }catch(e){
    console.error("Include failed:", e);
  }
}

async function bootPartials(){
  await includePartial("site-header", "/partials/header.html");
  await includePartial("site-footer", "/partials/footer.html");
}

/* =========================
   Mobile Menu (delegation)
   ========================= */
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

function bootMenuEvents(){
  // Delegation: funziona anche se header viene inserito dopo (via fetch)
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

  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && document.body.classList.contains("menu-open")){
      closeMenu();
    }
  });

  // Se passi a desktop, chiude
  const mq = window.matchMedia("(min-width: 981px)");
  const onChange = ()=>{
    if(mq.matches && document.body.classList.contains("menu-open")){
      closeMenu();
    }
  };
  if(mq.addEventListener) mq.addEventListener("change", onChange);
  else mq.addListener(onChange);
}

/* =========================
   Parallax hero (come avevi)
   ========================= */
function bootHeroParallax(){
  const heroImg = document.querySelector(".hero-img");
  if(!heroImg) return;

  const onScroll = ()=>{
    const y = window.scrollY * 0.12;
    heroImg.style.transform = `translateY(${Math.min(80, y)}px) scale(1.02)`;
  };

  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
}

/* =========================
   Pricing toggle (come avevi)
   ========================= */
function bootPricingToggle(){
  const toggle = document.getElementById("billingToggle");
  const priceEls = document.querySelectorAll(".amount[data-monthly][data-annual]");

  function applyBilling(isAnnual){
    priceEls.forEach(el=>{
      el.innerHTML = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
  }

  if(toggle){
    toggle.addEventListener("change", (e)=>{
      applyBilling(e.target.checked);
    });
    applyBilling(toggle.checked);
  }
}

document.addEventListener("DOMContentLoaded", async ()=>{
  bootMenuEvents();        // listener subito
  await bootPartials();    // poi carica header/footer
  bootHeroParallax();      // come prima
  bootPricingToggle();     // come prima
});
