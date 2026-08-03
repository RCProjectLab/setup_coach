
const T=window.RC_TOPICS,D=window.RC_DIAGNOSTICS;
const views=[...document.querySelectorAll('.view')],content=document.getElementById('detailContent');
let last='home',fav=new Set(JSON.parse(localStorage.getItem('rcv3fav')||'[]'));
function show(id){views.forEach(v=>v.classList.toggle('active',v.id===id));if(id!=='detail')last=id;if(id==='favorites')renderFav();scrollTo(0,0)}
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>show(b.dataset.nav));document.querySelector('.back').onclick=()=>show(last);
function card(t){const b=document.createElement('button');b.className='topic';b.innerHTML=`<em>${t.category}</em><b>${t.title}</b><span>${t.summary}</span>`;b.onclick=()=>topic(t);return b}
const cats=[...new Set(T.map(x=>x.category))].sort(),cat=document.getElementById('category');cats.forEach(x=>cat.add(new Option(x,x)));
function render(){const q=document.getElementById('search').value.toLowerCase(),c=cat.value,host=document.getElementById('topics');host.innerHTML='';T.filter(t=>(c==='Alle'||t.category===c)&&JSON.stringify(t).toLowerCase().includes(q)).forEach(t=>host.appendChild(card(t)))}
document.getElementById('search').oninput=render;cat.onchange=render;
function renderFav(){const h=document.getElementById('favList');h.innerHTML='';T.filter(t=>fav.has(t.id)).forEach(t=>h.appendChild(card(t)));if(!h.children.length)h.innerHTML='<div class="card">Noch keine Favoriten.</div>'}
function topic(t){let h=`<div class="card"><button class="fav ${fav.has(t.id)?'active':''}" id="fv">${fav.has(t.id)?'★':'☆'}</button><div class="label">${t.category}</div><h2>${t.title}</h2><p>${t.summary}</p></div>`;
h+=`<div class="block"><div class="label">WAS IST DAS?</div><h3>${t.title} verstehen</h3><p>${t.what||''}</p></div>`;
h+=`<div class="block"><div class="label">WIE STELLE ICH ES EIN?</div><pre>${t.how||''}</pre></div>`;
if(t.sections)h+=t.sections.map(s=>`<div class="block"><h3>${s.heading}</h3><ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('');
if(t.steps)h+=`<div class="block">${t.steps.map((s,i)=>`<h3>${i+1}. ${s.title}</h3><p>${s.text}</p>`).join('')}</div>`;
if(t.when)h+=`<div class="block"><div class="label">WANN ÄNDERN?</div>${t.when.map(w=>`<p><b>${w.symptom}</b><br>${w.change}</p>`).join('')}</div>`;
if(t.mistakes)h+=`<div class="block"><div class="label">TYPISCHE FEHLER</div><ul>${t.mistakes.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
if(t.note)h+=`<div class="block">${t.note}</div>`;content.innerHTML=h;document.getElementById('fv').onclick=()=>{fav.has(t.id)?fav.delete(t.id):fav.add(t.id);localStorage.setItem('rcv3fav',JSON.stringify([...fav]));topic(t)};show('detail')}
function diag(id){const d=D[id],surface=document.getElementById('surface').value,grip=document.getElementById('grip').value,temp=document.getElementById('temp').value;
content.innerHTML=`<div class="card"><div class="label">RC SETUP COACH 3</div><h2>${d.title}</h2><p>${d.intro}</p><div class="hint">${surface} · Grip ${grip} · Temperatur ${temp}</div></div><div class="block"><h3>Wo tritt es auf?</h3><div class="phase-grid">${Object.keys(d.phases).map((p,i)=>`<button data-p="${i}">${p}</button>`).join('')}</div><div id="result"></div></div><div class="block warning">${d.warning}</div>`;
const entries=Object.entries(d.phases);document.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>phase(entries[+b.dataset.p][0],entries[+b.dataset.p][1],surface,grip,temp));show('detail')}
function phase(name,steps,surface,grip,temp){let i=0,host=document.getElementById('result');function draw(){const s=steps[i],surfaceHint=surface==='Asphalt'?'Auf Asphalt Grip-Schwankungen und Reifentemperatur besonders beachten.':'Auf ETS-Teppich kleine Schritte wählen, da das Auto meist direkt reagiert.',gripHint=grip==='hoch'?'Bei hohem Grip Nervosität als Nebenwirkung beachten.':grip==='niedrig'?'Bei wenig Grip mechanischen Grip priorisieren.':'Bei mittlerem Grip neutral beurteilen.',tempHint=temp==='kalt'?'Kalte Reifen zuerst ausschließen.':temp==='heiß'?'Überhitzung der Reifen ausschließen.':'Temperatur normal.';
host.innerHTML=`<div class="step-card"><div class="label">${name.toUpperCase()}</div><div class="hint">${surfaceHint} ${gripHint} ${tempHint}</div><h3>Schritt ${i+1} von ${steps.length}: ${s[0]}</h3><div class="step-boxes"><div class="box"><b>Warum?</b>${s[1]}</div><div class="box"><b>Wie genau?</b>${s[2]}</div><div class="box"><b>So testen</b>${s[3]}</div><div class="box"><b>Nebenwirkung</b>${s[4]}</div></div><div class="actions"><button class="primary" id="ok">Problem besser</button><button id="next">${i<steps.length-1?'Keine Verbesserung – nächster Schritt':'Keine Verbesserung – neu prüfen'}</button>${i?'<button id="prev">Zurück</button>':''}</div></div>`;
document.getElementById('ok').onclick=()=>host.innerHTML='<div class="block"><b>Änderung beibehalten.</b><p>Setup-Wert notieren und mehrere Runden bestätigen. Keine weiteren Schritte automatisch durchführen.</p></div>';
document.getElementById('next').onclick=()=>{if(i<steps.length-1){i++;draw()}else host.innerHTML='<div class="block warning"><b>Problem nicht gelöst.</b><p>Reifen, Mechanik, links/rechts gleiche Werte und die gewählte Kurvenphase erneut prüfen.</p></div>'};
if(i)document.getElementById('prev').onclick=()=>{i--;draw()}}draw()}
document.querySelectorAll('[data-diag]').forEach(b=>b.onclick=()=>diag(b.dataset.diag));
document.getElementById('theme').onclick=()=>{document.documentElement.classList.toggle('dark');localStorage.setItem('rcv3theme',document.documentElement.classList.contains('dark')?'dark':'light')};
if(localStorage.getItem('rcv3theme')==='dark'||(!localStorage.getItem('rcv3theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));render();
