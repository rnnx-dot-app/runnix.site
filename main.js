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

  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

function openMenu(){
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.getElementById("mobileMenu");
  const overlay = document.querySelector("[data-menu-overlay]");
  if(!toggle || !drawer || !overlay) return;

  drawer.hidden = false;
  overlay.hidden = false;

  document.body.classList.add("menu-open");
  toggle.setAttribute("aria-expanded", "true");

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function closeMenu(){
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.getElementById("mobileMenu");
  const overlay = document.querySelector("[data-menu-overlay]");
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
  // ✅ Event delegation: funziona anche con header caricato via partial
  document.addEventListener("click", (e)=>{
    const toggleBtn = e.target.closest(".nav-toggle");
    if(toggleBtn){
      e.preventDefault();
      e.stopPropagation();
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

    // click su link del drawer -> chiude
    const inDrawerLink = e.target.closest("#mobileMenu a");
    if(inDrawerLink){
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

document.addEventListener("DOMContentLoaded", async ()=>{
  bootMenuEvents();     // ✅ metto listener SUBITO (delegation)
  await bootPartials(); // ✅ poi includo header/footer
});
