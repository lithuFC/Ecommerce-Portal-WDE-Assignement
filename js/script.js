// script.js — theme toggle, improved toy svg injection and eye control, small helpers
(function(){
  const body = document.body;
  const saved = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', saved);

  function applyTheme(t){ body.setAttribute('data-theme', t); localStorage.setItem('theme', t); }
  document.querySelectorAll('#theme-toggle, #theme-toggle-2, #theme-toggle-3').forEach(btn=>{
    if(btn) btn.addEventListener('click', ()=> applyTheme(body.getAttribute('data-theme')==='dark'?'light':'dark'));
  });

  // improved toy svg markup with eyelids for nicer animation
  const toySvg = `
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Toy">
      <rect width="80" height="80" rx="12" fill="#0f1720"/>
      <circle cx="40" cy="30" r="14" fill="#ffd97a"/>
      <!-- eyes group -->
      <g id="eyes">
        <ellipse class="eye left" cx="32" cy="28" rx="3.8" ry="3.8" fill="#0b0f17"/>
        <ellipse class="eye right" cx="48" cy="28" rx="3.8" ry="3.8" fill="#0b0f17"/>
        <!-- eyelids (rectangles) that scale to close the eyes -->
        <rect class="eyelid left-lid" x="28" y="24" width="8" height="8" rx="2" fill="#0f1720" transform="scale(1,0)" />
        <rect class="eyelid right-lid" x="44" y="24" width="8" height="8" rx="2" fill="#0f1720" transform="scale(1,0)" />
      </g>
      <path d="M28 46c3 3 22 3 26 0" stroke="#0b0f17" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>`;

  document.querySelectorAll('.toy').forEach(n=>{ n.innerHTML = toySvg; });

  // functions to close/open eyelids more robustly
  function setToyClosedState(closed){
    document.querySelectorAll('.eyelid').forEach(el=>{
      if(!el) return;
      if(closed){
        el.setAttribute('transform','scale(1,1)');
        el.style.transition = 'transform 0.12s ease';
      } else {
        el.setAttribute('transform','scale(1,0)');
      }
    });
    // shrink eyes slightly to match closed effect
    document.querySelectorAll('.eye').forEach(e=>{ if(closed) e.style.transform='scaleY(0.2)'; else e.style.transform='scaleY(1)'; });
  }

  // attach to password inputs (works for fields added after script by re-checking on focus)
  function bindToyToPasswords(){
    document.querySelectorAll('input[type="password"]').forEach(pw=>{
      if(pw._toyBound) return;
      pw.addEventListener('focus', ()=> setToyClosedState(true));
      pw.addEventListener('blur', ()=> setToyClosedState(false));
      pw.addEventListener('input', ()=> { if(pw.value.length>0) setToyClosedState(true); else setToyClosedState(false); });
      pw._toyBound = true;
    });
  }
  bindToyToPasswords();
  // also re-run bind when new nodes are focused (use focusin global)
  document.addEventListener('focusin', bindToyToPasswords);

  // small global API for products module
  window.__EC = window.__EC || {};
  window.__EC.addFeatured = function(html){
    const f = document.getElementById('featured');
    if(f) f.innerHTML = html;
  };
  window.__EC.renderProductGrid = function(html){
    const g = document.getElementById('product-grid') || document.getElementById('featured-grid') || document.getElementById('featured');
    if(g) g.innerHTML = html;
  };
  window.__EC.showLoaderIn = function(el){
    if(!el) return;
    el.innerHTML = '<div class="card centered"><div class="loader" aria-hidden="true"></div></div>';
  };
})();
