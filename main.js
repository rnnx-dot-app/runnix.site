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

  // year in footer
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

function bootMenu(){
  // Event delegation: funziona anche se header viene incluso dopo
  document.addEventListener("click", (e)=>{
    const t = e.target;
    if(t && t.id === "menuBtn"){
      alert("Menu mobile in arrivo");
    }
  });
}

document.addEventListener("DOMContentLoaded", async ()=>{
  bootMenu();
  await bootPartials();
});
