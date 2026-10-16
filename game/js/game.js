// Loop principal, cenários, inimigos, progressão e renderização.
(() => {
  const T=CFG.TILE,canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
  const game={state:'title',levelIndex:0,level:null,player:null,lives:CFG.START_LIVES,score:0,collected:0,cam:{x:0},questionQueue:[],
    refillQuestions(){this.questionQueue=Levels.QUESTIONS.slice();for(let i=this.questionQueue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[this.questionQueue[i],this.questionQueue[j]]=[this.questionQueue[j],this.questionQueue[i]];}},
    loadLevel(i){this.levelIndex=i;if(!this.questionQueue.length)this.refillQuestions();this.level=new Levels.Level(Levels.LEVEL_DEFS[i],this.questionQueue);
      this.level.onTerminal=(c,r,quiz)=>this.openTerminal(quiz);const s=this.level.spawn;if(!this.player)this.player=new Player(s.x,s.y);else this.player.spawn(s.x,s.y);
      this.cam.x=0;this.collected=0;this.state='playing';UI.hideMenu();},
    openTerminal(quiz){this.state='quiz';UI.openQuiz(quiz,right=>{if(right){this.score+=100;this.collected++;}else this.loseLife(false);if(this.state==='quiz')this.state='playing';Input.clearEdges();});},
    loseLife(respawn=true){this.lives--;UI.sfx('hurt');if(this.lives<=0){this.state='gameover';return;}if(respawn){const s=this.level.spawn;this.player.spawn(s.x,s.y);this.cam.x=0;}},
    update(){
      if(this.state==='title'||this.state==='select')return;
      if(this.state==='gameover'||this.state==='complete'){if(Input.consumeJump()){this.lives=CFG.START_LIVES;this.score=0;this.refillQuestions();this.state='title';UI.showMenu('title',Levels.LEVEL_DEFS,i=>this.loadLevel(i));}return;}
      if(Input.consumePause()){if(this.state==='playing')this.state='paused';else if(this.state==='paused')this.state='playing';}
      if(this.state!=='playing')return;
      const p=this.player;p.update(Input,this.level);if(p.dead){this.loseLife(true);return;}
      for(const e of this.level.enemies){e.x+=e.vx;e.phase+=.12;if(e.x<e.left||e.x>e.right)e.vx*=-1;
        if(p.x<e.x+e.w&&p.x+p.w>e.x&&p.y<e.y+e.h&&p.y+p.h>e.y){
          if(p.vy>0&&p.y+p.h-e.y<18){p.y=e.y-p.h;p.stomp();UI.sfx('coin');this.score+=50;e.x=-1000;}
          else if(p.invuln<=0){this.loseLife(true);return;}
        }
      }
      if(this.level.touches(p.x,p.y,p.w,p.h,'G')){
        UI.sfx('win');if(this.levelIndex+1<Levels.LEVEL_DEFS.length)this.loadLevel(this.levelIndex+1);else{this.state='complete';UI.sfx('win');}
      }
      const target=p.x+p.w/2-CFG.W*.42;this.cam.x+= (target-this.cam.x)*.12;this.cam.x=Math.max(0,Math.min(this.level.width-CFG.W,this.cam.x));
    },
    drawBackground(){const th=this.level.def.theme,g=ctx.createLinearGradient(0,0,0,CFG.H);g.addColorStop(0,th.top);g.addColorStop(1,th.bg);ctx.fillStyle=g;ctx.fillRect(0,0,CFG.W,CFG.H);
      // Sol, nuvens e colinas em camadas dão profundidade ao percurso.
      ctx.fillStyle=th.sun;ctx.beginPath();ctx.arc(790,107,48,0,Math.PI*2);ctx.fill();
      for(let i=-1;i<5;i++){const x=((i*250-this.cam.x*.14)%(CFG.W+320)+(CFG.W+320))%(CFG.W+320)-100,y=100+(i%3)*45;ctx.fillStyle='#ffffff8c';
        ctx.beginPath();ctx.ellipse(x,y,37,13,0,0,Math.PI*2);ctx.ellipse(x+25,y-8,25,18,0,0,Math.PI*2);ctx.ellipse(x+48,y,32,12,0,0,Math.PI*2);ctx.fill();}
      for(let layer=0;layer<2;layer++){const shift=this.cam.x*(layer?.3:.18),color=layer?th.far:th.mount,base=layer?CFG.H-105:CFG.H-65;ctx.fillStyle=color;
        ctx.beginPath();ctx.moveTo(0,CFG.H);ctx.lineTo(0,base);for(let x=-100;x<=CFG.W+100;x+=50){const wx=x+shift;ctx.lineTo(x,base-28-Math.sin(wx*.008+layer)*24-Math.sin(wx*.019)*12);}ctx.lineTo(CFG.W,CFG.H);ctx.closePath();ctx.fill();}
      for(let i=0;i<9;i++){const wx=i*155+35,x=((wx-this.cam.x*.48)%(CFG.W+160)+(CFG.W+160))%(CFG.W+160)-50,y=CFG.H-126-(i%3)*20;
        ctx.fillStyle='#507e59';ctx.fillRect(x+12,y+15,8,22);ctx.fillStyle=th.accent;ctx.beginPath();ctx.arc(x+16,y+12,19+(i%2)*4,0,Math.PI*2);ctx.fill();}
    },
    drawTiles(){const L=this.level,th=L.def.theme,camX=Math.round(this.cam.x),c0=Math.floor(camX/T),c1=Math.ceil((camX+CFG.W)/T);
      for(let r=0;r<L.rows;r++)for(let c=c0;c<=c1;c++){const ch=L.tile(c,r);if(ch==='.')continue;const x=c*T-camX,y=r*T;
        if(ch==='#'){ctx.fillStyle=th.solid;ctx.fillRect(x,y,T,T);ctx.fillStyle=th.ground;ctx.fillRect(x,y,T,7);ctx.fillStyle='#ffffff25';ctx.fillRect(x+3,y+9,3,3);ctx.fillRect(x+20,y+20,3,3);}
        else if(ch==='B'){ctx.fillStyle=th.brick;ctx.fillRect(x+1,y+1,T-2,T-2);ctx.strokeStyle='#ffffff75';ctx.lineWidth=2;ctx.strokeRect(x+3,y+3,T-6,T-6);ctx.fillStyle='#ffffff5c';ctx.fillRect(x+8,y+9,5,4);}
        else if(ch==='?'||ch==='U'){ctx.fillStyle=ch==='?'?th.terminal:'#71958b';ctx.beginPath();ctx.roundRect(x+2,y+2,T-4,T-4,7);ctx.fill();ctx.fillStyle='#fff9dc';ctx.font='bold 21px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ch==='?'?'?':'✓',x+T/2,y+T/2+1);}
        else if(ch==='G'){ctx.fillStyle='#fff1a4';ctx.fillRect(x+15,y,4,T);ctx.fillStyle='#ee8258';ctx.beginPath();ctx.moveTo(x+19,y+2);ctx.lineTo(x+31,y+8);ctx.lineTo(x+19,y+14);ctx.fill();}
      }
    },
    draw(){this.drawBackground();this.drawTiles();for(const e of this.level.enemies)if(e.x>-100&&e.x<this.level.width)UI.drawEnemy(ctx,e,Math.round(this.cam.x));
      this.player.draw(ctx,Math.round(this.cam.x));UI.drawHUD(ctx,this);
      if(this.state==='paused')UI.banner(ctx,'PAUSADO','Pressione P ou Esc para continuar');
      if(this.state==='gameover')UI.banner(ctx,'FIM DE JOGO','Pressione Espaço para voltar ao início');
      if(this.state==='complete')UI.banner(ctx,'VOCÊ VENCEU!','A aventura terminou · Espaço para jogar novamente');
    }
  };
  function fit(){const s=Math.min(innerWidth/CFG.W,innerHeight/CFG.H),w=Math.floor(CFG.W*s),h=Math.floor(CFG.H*s);canvas.style.width=w+'px';canvas.style.height=h+'px';document.getElementById('wrap').style.width=w+'px';document.getElementById('wrap').style.height=h+'px';}
  addEventListener('resize',fit);fit();let last=performance.now(),acc=0;const STEP=1000/CFG.FPS;
  function frame(now){acc+=Math.min(100,now-last);last=now;while(acc>=STEP){game.update();acc-=STEP;}game.draw();requestAnimationFrame(frame);}
  game.level=new Levels.Level(Levels.LEVEL_DEFS[0],Levels.QUESTIONS.slice(0,12));game.player=new Player(game.level.spawn.x,game.level.spawn.y);
  UI.showMenu('title',Levels.LEVEL_DEFS,i=>{game.refillQuestions();game.lives=CFG.START_LIVES;game.score=0;game.loadLevel(i);});
  window.game=game;requestAnimationFrame(frame);
})();
