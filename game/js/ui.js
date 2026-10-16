// Interface, telas de menu, perguntas e música gerada no navegador.
window.UI = (() => {
  const $ = id => document.getElementById(id);
  let quizKeyHandler = null, audio = null, musicTimer = null, musicStep = 0;
  const notes = [261.63,329.63,392,329.63,293.66,349.23,440,349.23,261.63,329.63,392,523.25,440,392,349.23,329.63];
  function startAudio() {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      if (!musicTimer) musicTimer = setInterval(() => {
        const t=audio.currentTime, n=notes[musicStep++ % notes.length];
        tone(n,t,.22,.032,'triangle'); if (musicStep%4===0) tone(n/2,t,.36,.022,'sine');
      },260);
    } catch (_) { /* áudio indisponível: o jogo continua normalmente */ }
  }
  function tone(freq,at,duration,volume,type='sine') {
    if(!audio)return; const osc=audio.createOscillator(), gain=audio.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(volume,at);gain.gain.exponentialRampToValueAtTime(.001,at+duration);
    osc.connect(gain);gain.connect(audio.destination);osc.start(at);osc.stop(at+duration+.02);
  }
  function sfx(kind) {
    startAudio(); if(!audio)return; const t=audio.currentTime;
    if(kind==='jump') tone(420,t,.12,.045,'square');
    if(kind==='correct'){tone(660,t,.18,.05);tone(880,t+.1,.22,.05);}
    if(kind==='wrong'||kind==='hurt'){tone(kind==='hurt'?130:185,t,.32,.07,'sawtooth');}
    if(kind==='coin'){tone(880,t,.12,.05);tone(1175,t+.08,.16,.045);}
    if(kind==='win'){[523,659,784,1047].forEach((n,i)=>tone(n,t+i*.14,.32,.045));}
  }
  function drawHUD(ctx,g) {
    ctx.save();ctx.fillStyle='#173a42d9';ctx.fillRect(0,0,CFG.W,38);
    ctx.fillStyle='#fff';ctx.font='bold 15px "Segoe UI",sans-serif';ctx.textBaseline='middle';const L=g.level.def;
    ctx.textAlign='left';ctx.fillText(`FASE ${g.levelIndex+1} · ${L.name}`,16,19);
    ctx.textAlign='right';ctx.fillText(`♥ ${g.lives}     ★ ${String(g.score).padStart(4,'0')}     ✦ ${g.collected}`,CFG.W-16,19);ctx.restore();
  }
  function banner(ctx,text,sub) {
    ctx.save();ctx.fillStyle='#102b35c9';ctx.fillRect(0,0,CFG.W,CFG.H);ctx.textAlign='center';
    ctx.fillStyle='#fff';ctx.font='bold 42px "Segoe UI",sans-serif';ctx.fillText(text,CFG.W/2,CFG.H/2-8);
    if(sub){ctx.font='18px "Segoe UI",sans-serif';ctx.fillStyle='#dcf6f2';ctx.fillText(sub,CFG.W/2,CFG.H/2+30);}ctx.restore();
  }
  function hideMenu(){ $('menu').classList.remove('open'); }
  function showMenu(mode, defs, onStart) {
    const menu=$('menu'), content=$('menuContent');content.innerHTML='';
    if(mode==='title'){
      content.innerHTML='<div class="eyebrow">UMA AVENTURA DE PLATAFORMA</div><h1>Jornada da <span>Inteligência</span></h1><p>Explore mundos, vença desafios e descubra como a inteligência artificial evoluiu.</p><div class="menu-actions"><button class="primary" id="playBtn">▶ &nbsp; JOGAR</button><button class="secondary" id="levelsBtn">✦ &nbsp; ESCOLHER FASE</button></div><div class="controls">← → mover &nbsp; · &nbsp; Espaço pular &nbsp; · &nbsp; Shift correr</div>';
      $('playBtn').onclick=()=>{startAudio();onStart(0);}; $('levelsBtn').onclick=()=>showMenu('levels',defs,onStart);
    } else {
      const cards=defs.map((d,i)=>`<button class="level-card" data-level="${i}"><span class="level-number">0${i+1}</span><span class="level-name">${d.name}</span><span class="level-era">${d.era}</span><span class="level-arrow">→</span></button>`).join('');
      content.innerHTML=`<button class="back-btn" id="backBtn">← VOLTAR</button><div class="eyebrow">SUA PRÓXIMA AVENTURA</div><h1>Escolha uma <span>fase</span></h1><div class="level-list">${cards}</div>`;
      $('backBtn').onclick=()=>showMenu('title',defs,onStart);content.querySelectorAll('[data-level]').forEach(btn=>btn.onclick=()=>{startAudio();onStart(Number(btn.dataset.level));});
    }
    menu.classList.add('open');
  }
  function openQuiz(q,onDone) {
    $('quizQ').textContent=q.q;$('quizFb').textContent='';const box=$('quizOpts');box.innerHTML='';let answered=false;
    const order=q.options.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    const choose=i=>{if(answered)return;answered=true;const right=i===q.answer;sfx(right?'correct':'wrong');
      [...box.children].forEach((b,k)=>{b.disabled=true;if(order[k]===q.answer)b.classList.add('ok');else if(order[k]===i)b.classList.add('bad');});
      $('quizFb').textContent=(right?'Muito bem! ':'Quase! ')+q.why;setTimeout(()=>{close();onDone(right);},right?1350:2100);};
    order.forEach((originalIndex,i)=>{const b=document.createElement('button');b.textContent=`${String.fromCharCode(65+i)}) ${q.options[originalIndex]}`;b.onclick=()=>choose(originalIndex);box.appendChild(b);});
    quizKeyHandler=e=>{const n=parseInt(e.key,10);if(n>=1&&n<=order.length)choose(order[n-1]);};addEventListener('keydown',quizKeyHandler);$('quiz').classList.add('open');box.firstChild.focus();
  }
  function close(){ $('quiz').classList.remove('open');if(quizKeyHandler)removeEventListener('keydown',quizKeyHandler);quizKeyHandler=null; }
  function drawEnemy(ctx,e,camX){
    const x=Math.round(e.x-camX), y=Math.round(e.y+Math.sin(e.phase)*2);
    ctx.save();ctx.fillStyle='#173a42';ctx.beginPath();ctx.ellipse(x+e.w/2,y+e.h-2,e.w/2,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ed705d';ctx.beginPath();ctx.arc(x+e.w/2,y+12,12,Math.PI,0);ctx.lineTo(x+e.w,y+e.h);ctx.lineTo(x,y+e.h);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff8dc';ctx.beginPath();ctx.arc(x+8,y+13,3,0,Math.PI*2);ctx.arc(x+17,y+13,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#254358';ctx.fillRect(x+8,y+13,2,3);ctx.fillRect(x+17,y+13,2,3);ctx.restore();
  }
  return {drawHUD,banner,openQuiz,close,showMenu,hideMenu,sfx,startAudio,drawEnemy};
})();
