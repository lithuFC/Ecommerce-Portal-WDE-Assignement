// products.js — fetch products.json (simulated API), render and filter, render wishlist
(async function(){
  const PRODUCTS_JSON = 'assets/products.json';
  const gridSelector = '#product-grid';
  let products = [];

  async function fetchProducts(){
    const grid = document.querySelector(gridSelector) || document.getElementById('featured');
    if(grid) window.__EC.showLoaderIn(grid);
    try{
      await new Promise(r=>setTimeout(r,700)); // simulate delay
      const res = await fetch(PRODUCTS_JSON);
      const data = await res.json();
      products = Array.isArray(data) ? data : (data.products || []);
      renderProducts(products);
      renderFeatured();
    }catch(err){
      console.error(err);
      const g = document.querySelector(gridSelector);
      if(g) g.innerHTML = '<div class="card"><p class="muted">Failed to load products.</p></div>';
    }
  }

  function money(n){ return '₹'+n; }

  function renderProducts(list){
    const html = (list||products).map(p=>`
      <div class="product-card card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <div class="small muted">${p.description}</div>
        <div class="product-meta"><div class="muted">${p.category||'General'}</div><div class="muted">${money(p.price)}</div></div>
        <div class="row" style="margin-top:10px"><button class="btn add-wish">Wishlist</button><button class="btn btn-primary add-cart">Add to Cart</button></div>
      </div>`).join('');
    window.__EC.renderProductGrid(html);
    attachProductButtons();
  }

  function attachProductButtons(){
    document.querySelectorAll('.add-wish').forEach(b=>{
      if (!b._boundWish) {
        b.addEventListener('click', addWishHandler);
        b._boundWish = true;
      }
    });
    document.querySelectorAll('.add-cart').forEach(b=>{
      if (!b._boundCart) {
        b.addEventListener('click', addCartHandler);
        b._boundCart = true;
      }
    });
  }

  function addWishHandler(){
    const id = this.closest('.product-card').dataset.id;
    const cur = JSON.parse(localStorage.getItem('ec_wishlist')||'[]');
    if(!cur.includes(id)) cur.push(id);
    localStorage.setItem('ec_wishlist', JSON.stringify(cur));
    alert('Added to wishlist');
    if(document.getElementById('wish-list')) renderWishlist();
  }
  function addCartHandler(){
    const id = this.closest('.product-card').dataset.id;
    const cur = JSON.parse(localStorage.getItem('ec_cart')||'[]');
    cur.push(id); localStorage.setItem('ec_cart', JSON.stringify(cur)); alert('Added to cart');
  }

  function renderFeatured(){
    const top = products.slice(0,3).map(p=>`
      <div class="product-card card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <div class="small muted">${p.description}</div>
        <div style="margin-top:8px" class="row"><div class="muted">${money(p.price)}</div><a href="products.html" class="btn">View</a></div>
      </div>`).join('');
    window.__EC.addFeatured(top);
  }

  function renderWishlist(){
    const wishRoot = document.getElementById('wish-list');
    if(!wishRoot) return;
    if(products.length === 0){
      fetchProducts().then(()=> renderWishlist());
      return;
    }
    const ids = JSON.parse(localStorage.getItem('ec_wishlist')||'[]');
    if(ids.length === 0){ wishRoot.innerHTML = '<p class="muted">Your wishlist is empty</p>'; return; }
    const items = ids.map(id => products.find(p=>p.id===id)).filter(Boolean);
    const html = items.map(p=>`
      <div class="product-card card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <div class="small muted">${p.description}</div>
        <div class="product-meta"><div class="muted">${p.category||'General'}</div><div class="muted"> ${money(p.price)}</div></div>
        <div class="row" style="margin-top:10px"><button class="btn remove-wish">Remove</button><button class="btn btn-primary add-cart">Add to Cart</button></div>
      </div>`).join('');
    wishRoot.innerHTML = html;
    document.querySelectorAll('.remove-wish').forEach(b=> b.addEventListener('click', function(){
      const id = this.closest('.product-card').dataset.id;
      let cur = JSON.parse(localStorage.getItem('ec_wishlist')||'[]');
      cur = cur.filter(x=> x!==id);
      localStorage.setItem('ec_wishlist', JSON.stringify(cur));
      renderWishlist();
    }));
    attachProductButtons();
  }

  // controls
  const loadBtn = document.getElementById('load-btn');
  const search = document.getElementById('search');
  const cat = document.getElementById('category');
  const sort = document.getElementById('sort');

  if(loadBtn) loadBtn.addEventListener('click', fetchProducts);

  function applyFilters(){
    let out = products.slice();
    const q = search? search.value.trim().toLowerCase():'';
    if(q) out = out.filter(p=> p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    if(cat && cat.value) out = out.filter(p=> p.category === cat.value);
    if(sort){
      if(sort.value==='price-asc') out.sort((a,b)=>a.price-b.price);
      if(sort.value==='price-desc') out.sort((a,b)=>b.price-a.price);
    }
    renderProducts(out);
  }

  if(search) search.addEventListener('input', applyFilters);
  if(cat) cat.addEventListener('change', applyFilters);
  if(sort) sort.addEventListener('change', applyFilters);

  // auto-load if grid present
  if(document.querySelector(gridSelector)) try{ await fetchProducts(); }catch(e){console.error(e);}

  // if wishlist page, render wishlist on load
  if(document.getElementById('wish-list')) renderWishlist();

  window.__EC.getProducts = ()=>products;
  window.__EC.renderWishlist = renderWishlist;
})();
