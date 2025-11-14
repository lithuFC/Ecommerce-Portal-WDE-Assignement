
// validation.js — simple client validation for forms (register, login, contact)
(function(){
  function show(id,msg){ const el=document.getElementById(id); if(el) el.textContent = msg; }

  const reg = document.getElementById('registerForm');
  if(reg){
    reg.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const pass = document.getElementById('password').value;
      const conf = document.getElementById('confirm').value;
      if(!name||!email||!pass){ show('reg-feedback','Please fill all fields'); return; }
      if(!/.+@.+\..+/.test(email)){ show('reg-feedback','Invalid email'); return; }
      if(pass.length < 6){ show('reg-feedback','Password must be 6+ chars'); return; }
      if(pass !== conf){ show('reg-feedback','Passwords do not match'); return; }
      const users = JSON.parse(localStorage.getItem('ec_users')||'[]');
      if(users.find(u=>u.email===email)){ show('reg-feedback','Email already registered'); return; }
      users.push({id:'u_'+Math.random().toString(36).slice(2,8),name,email,password:pass});
      localStorage.setItem('ec_users', JSON.stringify(users));
      show('reg-feedback','Registered. You can login now.');
      reg.reset();
    });
  }

  const login = document.getElementById('loginForm');
  if(login){
    login.addEventListener('submit', function(e){
      e.preventDefault();
      const em = document.getElementById('loginEmail').value.trim();
      const pw = document.getElementById('loginPass').value;
      const users = JSON.parse(localStorage.getItem('ec_users')||'[]');
      const u = users.find(x=>x.email===em && x.password===pw);
      if(!u){ show('login-feedback','Invalid credentials'); return; }
      localStorage.setItem('ec_current', JSON.stringify(u));
      show('login-feedback','Logged in — Welcome '+u.name);
      login.reset();
    });
  }

  const contact = document.getElementById('contactForm');
  if(contact){
    contact.addEventListener('submit', function(e){
      e.preventDefault();
      const n = document.getElementById('c-name').value.trim();
      const em = document.getElementById('c-email').value.trim();
      const m = document.getElementById('c-msg').value.trim();
      if(!n||!em||!m){ show('contact-feedback','Please fill all fields'); return; }
      show('contact-feedback','Message sent — we will contact you soon.');
      contact.reset();
    });
  }
})();
