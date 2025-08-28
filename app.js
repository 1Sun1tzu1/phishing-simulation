// Tabs
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const box = btn.dataset.box;
    document.querySelectorAll('.box').forEach(b=>b.classList.remove('active'));
    document.getElementById('box-'+box).classList.add('active');
  });
});

// Elements
const overlay = document.getElementById('overlay');
const sheetTitle = document.getElementById('sheetTitle');
const sheetBody  = document.getElementById('sheetBody');
const impactPanel= document.getElementById('impactPanel');
document.getElementById('closeOverlay').onclick = ()=> overlay.classList.remove('show');

// Open message
document.querySelectorAll('.row').forEach(r=>{
  r.addEventListener('click', ()=> openMessage(r));
  r.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); openMessage(r); }});
});

function openMessage(row){
  row.classList.remove('unread');
  const tpl = row.dataset.tpl;
  const attack = row.dataset.attack === '1';
  renderMessage(tpl);
  // Only show/calc impact for attack messages (NOT the TOAD promo)
  impactPanel.hidden = !attack;
  overlay.classList.add('show');
  if (attack) fetchImpact();
}

// Render the brand-specific message content
function renderMessage(tpl){
  if(tpl === 'invoice'){
    sheetTitle.textContent = 'Microsoft 365 Billing';
    sheetBody.innerHTML = `
      <article class="card">
        <div class="head ms">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" style="height:20px">
          <strong>Microsoft account</strong>
        </div>
        <div class="body">
          <div style="font-size:13px;color:#555;margin:2px 0 10px">Ref: INV-A41297 • Amount: £39.99 • Status: <strong>Payment failed</strong></div>
          <p>We couldn’t process your latest payment for Microsoft 365. To prevent service disruption, please review your billing details.</p>
          <p><a href="#" id="ctaInvoice" class="btn primary">View invoice</a></p>
        </div>
      </article>
      <p class="note">This button often leads to a look-alike portal that steals credentials (simulation only).</p>
    `;
    document.getElementById('ctaInvoice').onclick = (e)=>{ e.preventDefault(); openLogin('microsoft'); };
  }
  else if(tpl === 'cv'){
    sheetTitle.textContent = 'OneDrive file share';
    sheetBody.innerHTML = `
      <article class="card">
        <div class="head od">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_Office_OneDrive_%282019%29.svg" alt="OneDrive" style="height:20px">
         <strong>OneDrive</strong>
        </div>
        <div class="body">
          <p><strong>Anna McLean</strong> shared a file with you:</p>
          <div style="display:flex;align-items:center;gap:10px;margin:8px 0 10px">
            <div style="width:44px;height:44px;border-radius:8px;background:#e8f3ff;color:#0078d4;display:grid;place-items:center;font-weight:800">DOCM</div>
            <div><div style="font-weight:800">CV_Anna_McLean.docm</div><div class="note">Word Macro-Enabled Document • 128 KB</div></div>
          </div>
          <div class="note" style="background:#fff2cc;border:1px solid #ffe58f;color:#805400;padding:8px;border-radius:8px">
            Protected View: This file came from the Internet. <strong>Enable Editing</strong> and <strong>Enable Content</strong> to view.
          </div>
          <p style="margin-top:10px"><a href="#" id="ctaCV" class="btn primary">Sign in to OneDrive to view</a></p>
        </div>
      </article>
      <p class="note">“Enable Content” is a classic macro lure. One click can run code on your machine (simulation only).</p>
    `;
    document.getElementById('ctaCV').onclick = (e)=>{ e.preventDefault(); openLogin('onedrive'); };
  }
  else if(tpl === 'promo'){
    sheetTitle.textContent = 'The Art of D3fense';
    sheetBody.innerHTML = `
      <article class="card">
        <div class="head toad">
          <img src="assets/toad-logo.svg" alt="TOAD" style="height:24px">
          <strong>TOAD — The Art of D3fense</strong>
        </div>
        <div class="body">
          <p><span class="chip">Phishing simulations</span> <span class="chip">Red teaming</span> <span class="chip">Manual-first pentesting</span></p>
          <p>Run a safe, high-impact phishing simulation tailored to your business. We mirror real attacker tradecraft and deliver a clear, prioritized action plan.</p>
          <ul style="margin:8px 0 12px;padding-left:18px">
            <li>Microsoft/Google/OneDrive lookalikes (ethical & sandboxed)</li>
            <li>Web & mobile app tests (deep manual work)</li>
            <li>Assume-breach red team exercises</li>
            <li>Plain-English reporting with quick wins</li>
          </ul>
          <p>
            <a class="btn" style="border:1px solid #00ff84;color:#00ff84;background:#fff" href="mailto:contact@theartofd3fense.co.uk?subject=Phishing%20Simulation%20Request">Email us</a>
            <a class="btn" style="background:#00ff84;border:1px solid #00ff84;color:#001b0f" href="https://theartofd3fense.co.uk/start-your-defense/?utm_source=demo&utm_medium=promo&utm_campaign=phish-sim" target="_blank" rel="noopener">Book a free consult</a>
          </p>
          <p class="note">Training message — not an attack. No tracking panel shown for TOAD emails.</p>
        </div>
      </article>
    `;
  }
  else {
    sheetTitle.textContent = 'HR Team';
    sheetBody.innerHTML = `
      <article class="card">
        <div class="body">
          <p>Internal policy update. No credential request.</p>
        </div>
      </article>
    `;
  }
}

/* ---------- Impact (only called for attack messages) ---------- */
async function fetchImpact(){
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scr = `${screen.width}×${screen.height}`;
  const ua  = navigator.userAgent;
  const dev = /Windows|Mac|Linux|Android|iPhone|iPad/.exec(ua)?.[0] || 'Unknown';
  const br  = /Edg|Chrome|Firefox|Safari/.exec(ua)?.[0] || 'Browser';

  let ip='(blocked)', loc='(unknown)', isp='(unknown)';
  const sources = ['https://api.ipify.org?format=json','https://api64.ipify.org?format=json','https://ifconfig.co/json'];
  for (const u of sources){
    try{ const r=await fetch(u,{cache:'no-store'}); if(!r.ok) continue; const j=await r.json(); ip=j.ip||j.client_ip||ip; break; }catch{}
  }
  try{
    const r=await fetch('https://ipapi.co/json',{cache:'no-store'}); if(r.ok){
      const j=await r.json(); if(j.city && j.country_name) loc = `${j.city}, ${j.country_name}`; isp = j.org || isp;
    }
  }catch{}

  set('v_ip',ip); set('v_loc',loc); set('v_isp',isp); set('v_dev',dev); set('v_br',br); set('v_tz',tz); set('v_scr',scr);

  const pixel = document.getElementById('demoPixel');
  const res   = document.getElementById('pixelResult');
  const btn   = document.getElementById('loadPixel');
  if(btn && pixel && res){
    btn.onclick = ()=>{
      pixel.src='assets/pixel.png?'+Date.now();
      pixel.style.display='block';
      res.textContent = 'Remote image requested (client-side). In real emails this notifies the sender you opened.';
    };
  }
}

/* ---------- Login modal ---------- */
const login = document.getElementById('login');
const loginLogo = document.getElementById('loginLogo');
const loginTitle= document.getElementById('loginTitle');
const loginBtn  = document.getElementById('loginBtn');
const lEmail    = document.getElementById('lemail');
const lPass     = document.getElementById('lpass');
const capBox    = document.getElementById('captureBox');
const notice    = document.getElementById('loginNotice');
document.getElementById('closeLogin').onclick = ()=> login.classList.remove('show');

function openLogin(origin='microsoft'){
  login.classList.add('show');
  if(origin==='onedrive'){
    loginLogo.src = 'https://upload.wikimedia.org/wikipedia/commons/5/57/Microsoft_Office_OneDrive_%282019–present%29.svg';
    loginLogo.alt = 'OneDrive';
    loginBtn.textContent = 'Sign in to OneDrive';
  } else {
    loginLogo.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg';
    loginLogo.alt = 'Microsoft';
    loginBtn.textContent = 'Sign in';
  }
  lEmail.value=''; lPass.value=''; capBox.textContent='Start typing…'; notice.hidden = true;
}
loginBtn.onclick = ()=>{ notice.hidden = false; };
[lEmail,lPass].forEach(el=> el.addEventListener('input', ()=>{ capBox.textContent = `${lEmail.value}\n${lPass.value}`; }));
document.getElementById('clipBtn').onclick = ()=>{ document.getElementById('clipResult').textContent = "Clipboard contents: 'Company_Invoice_2025.docx' (simulated)"; };

/* ---------- How-to modal ---------- */
const how = document.getElementById('howto');
document.getElementById('helpBtn').onclick = ()=> how.classList.add('show');
document.getElementById('closeHowto').onclick = ()=> how.classList.remove('show');
how.addEventListener('click', e=>{ if(e.target===how) how.classList.remove('show'); });

/* overlay dismiss on outside click */
overlay.addEventListener('click', e=>{ if(e.target===overlay) overlay.classList.remove('show'); });
