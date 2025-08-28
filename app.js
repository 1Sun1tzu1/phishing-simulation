// Tabs (Inbox/Junk)
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const which = btn.dataset.box;
    document.querySelectorAll('.box').forEach(b=>b.classList.remove('active'));
    document.getElementById('box-'+which).classList.add('active');
  });
});

// Open message sheet
const sheet = document.getElementById('sheet');
const sheetTitle = document.getElementById('sheetTitle');
const sheetBody  = document.getElementById('sheetBody');
document.querySelectorAll('.msg').forEach(row=>{
  row.addEventListener('click', ()=>{ openMessage(row); });
  row.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); openMessage(row); }});
});
function openMessage(row){
  row.classList.remove('unread');
  const tpl = row.dataset.tpl || 'hr';
  renderMessage(tpl);
  sheet.classList.add('show');
  fetchImpact();
}
document.getElementById('closeSheet').addEventListener('click', ()=> sheet.classList.remove('show'));

// Manual modal
const manual = document.getElementById('manual');
document.getElementById('openManual').addEventListener('click', ()=> manual.classList.add('show'));
document.getElementById('closeManual').addEventListener('click', ()=> manual.classList.remove('show'));
manual.addEventListener('click', e=>{ if(e.target===manual) manual.classList.remove('show'); });

// Bottom sign-in sheet
const login = document.getElementById('login');
const loginLogo = document.getElementById('loginLogo');
const loginTitle= document.getElementById('loginTitle');
const loginBtn  = document.getElementById('loginBtn');
const lEmail    = document.getElementById('lemail');
const lPass     = document.getElementById('lpass');
const capBox    = document.getElementById('captureBox');
const notice    = document.getElementById('loginNotice');
const clipBtn   = document.getElementById('clipBtn');
const clipRes   = document.getElementById('clipResult');

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
login.addEventListener('click', e=>{ if(e.target===login) login.classList.remove('show'); });
loginBtn.addEventListener('click', ()=>{ notice.hidden = false; });

// live keystroke capture (simulated)
[lEmail,lPass].forEach(el=> el.addEventListener('input', ()=>{ capBox.textContent = `${lEmail.value}\n${lPass.value}`; }));
clipBtn.addEventListener('click', ()=>{ clipRes.textContent = "Clipboard contents: 'Company_Invoice_2025.docx' (simulated)"; });

// Render messages (brand-accurate, ethical)
function renderMessage(tpl){
  if(tpl==='invoice'){
    sheetTitle.textContent = 'Microsoft 365 Billing';
    sheetBody.innerHTML = `
      <article class="card">
        <header class="ms-head">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft">
          <strong>Microsoft account</strong>
        </header>
        <div class="body">
          <div style="font-size:13px;color:#555;margin:2px 0 10px">Ref: INV-A41297 • Amount: £39.99 • Status: <strong>Payment failed</strong></div>
          <p>We couldn’t process your latest payment for Microsoft 365. To prevent service disruption, please review your billing details.</p>
          <p><a class="ms-cta" href="#" id="ctaInvoice">View invoice</a></p>
        </div>
      </article>
      <p class="note">In real attacks this button often leads to a look-alike portal that steals credentials.</p>
    `;
    document.getElementById('ctaInvoice').addEventListener('click', (e)=>{ e.preventDefault(); openLogin('microsoft'); });
  }
  else if(tpl==='cv'){
    sheetTitle.textContent = 'OneDrive file share';
    sheetBody.innerHTML = `
      <article class="card">
        <header class="od-head">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Microsoft_Office_OneDrive_%282019–present%29.svg" alt="OneDrive">
          <strong>OneDrive</strong>
        </header>
        <div class="body">
          <p><strong>Anna McLean</strong> shared a file with you:</p>
          <div style="display:flex;align-items:center;gap:10px;margin:8px 0 10px">
            <div style="width:44px;height:44px;border-radius:8px;background:#e8f3ff;color:#0078d4;display:grid;place-items:center;font-weight:800">DOCM</div>
            <div><div style="font-weight:800">CV_Anna_McLean.docm</div><div class="note">Word Macro-Enabled Document • 128 KB</div></div>
          </div>
          <div class="note" style="background:#fff2cc;border:1px solid #ffe58f;color:#805400;padding:8px;border-radius:8px">
            Protected View: This file came from the Internet. <strong>Enable Editing</strong> and <strong>Enable Content</strong> to view.
          </div>
          <p style="margin-top:10px"><a class="od-cta" href="#" id="ctaCV">Sign in to OneDrive to view</a></p>
        </div>
      </article>
      <p class="note">“Enable Content” is a classic macro lure. One click can run code on your machine.</p>
    `;
    document.getElementById('ctaCV').addEventListener('click', (e)=>{ e.preventDefault(); openLogin('onedrive'); });
  }
  else if(tpl==='promo'){
    sheetTitle.textContent = 'The Art of D3fense';
    sheetBody.innerHTML = `
      <article class="card">
        <header class="toad-head">
          <img src="assets/toad-logo.svg" alt="TOAD">
          <div><strong>TOAD — The Art of D3fense</strong><div class="note" style="color:#9fb3bd">Offensive security with an attacker’s mindset</div></div>
        </header>
        <div class="body">
          <span class="toad-pill">Phishing simulations</span>
          <span class="toad-pill">Red teaming</span>
          <span class="toad-pill">Manual-first pentesting</span>
          <p style="margin-top:6px">Run a safe, high-impact phishing simulation tailored to your business. We mirror real attacker tradecraft and deliver a clear, prioritized action plan.</p>
          <ul style="margin:8px 0 12px;padding-left:18px">
            <li>Microsoft/Google/OneDrive lookalikes (ethical & sandboxed)</li>
            <li>Web & mobile app tests (deep manual work)</li>
            <li>Assume-breach red team exercises</li>
            <li>Plain-English reporting with quick wins</li>
          </ul>
          <a class="toad-primary" href="mailto:contact@theartofd3fense.co.uk?subject=Phishing%20Simulation%20Request">Email us</a>
          <a class="toad-outline" href="https://theartofd3fense.co.uk/start-your-defense/?utm_source=demo&utm_medium=promo&utm_campaign=phish-sim" target="_blank" rel="noopener">Book a free consult</a>
          <p class="note" style="margin-top:8px">This message is part of the TOAD simulation demo. No data is stored.</p>
        </div>
      </article>
    `;
  }
  else { // hr/other
    sheetTitle.textContent = 'HR Team';
    sheetBody.innerHTML = `
      <article class="card">
        <div class="body">
          <p>Internal policy update. No credential request.</p>
        </div>
      </article>`;
  }
}

// Impact panel: IP, location, ISP, device, pixel
async function fetchImpact(){
  const ipChip = document.getElementById('ipBadge');
  const set = (id,val)=>{ const el=document.getElementById(id); if(el) el.textContent=val; };
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scr = `${screen.width}×${screen.height}`;
  const ua  = navigator.userAgent;
  const dev = /Windows|Mac|Linux|Android|iPhone|iPad/.exec(ua)?.[0] || 'Unknown';
  const br  = /Edg|Chrome|Firefox|Safari/.exec(ua)?.[0] || 'Browser';

  let ip='(blocked)', loc='(unknown)', isp='(unknown)';

  const sources = ['https://api.ipify.org?format=json','https://api64.ipify.org?format=json','https://ifconfig.co/json'];
  for (const u of sources){
    try{ const r=await fetch(u,{cache:'no-store'}); if(!r.ok) continue;
      const j=await r.json(); ip=j.ip||j.client_ip||ip; break; }catch{}
  }
  try{
    const r=await fetch('https://ipapi.co/json',{cache:'no-store'}); if(r.ok){
      const j=await r.json();
      if(j.city && j.country_name) loc = `${j.city}, ${j.country_name}`;
      isp = j.org || isp;
    }
  }catch{}

  if(ipChip) ipChip.textContent = `IP: ${ip}`;
  set('v_ip',ip); set('v_loc',loc); set('v_isp',isp);
  set('v_dev',dev); set('v_br',br); set('v_tz',tz); set('v_scr',scr);

  const pixel = document.getElementById('demoPixel');
  const res   = document.getElementById('pixelResult');
  const btn   = document.getElementById('loadPixel');
  if(btn && pixel && res){
    btn.onclick = ()=>{
      pixel.src='assets/pixel.png?'+Date.now(); pixel.style.display='block';
      res.textContent = 'Remote image requested (client-side). In real emails this would notify the sender you opened.';
    };
  }
}
