// Motor de movimentação e física do jogador (estilo Super Mario Bros.).
// Depende apenas de: CFG, e de um "world" com isSolid(col,row) e onHeadBump(col,row,player).
(() => {
  const P = CFG.PHYS;
  const T = CFG.TILE;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const approach = (v, target, step) => v < target ? Math.min(v + step, target) : Math.max(v - step, target);

  // Recortes do sprite sheet (linha 2 = olhando p/ esquerda, linha 3 = direita; 4 quadros cada).
  const SHEET = {
    x: [3, 65, 120, 179], w: [52, 49, 52, 48],
    rowY: { left: 189, right: 277 }, rowH: { left: 63, right: 63 },
    scale: 0.70
  };

  class Player {
    constructor(x, y) {
      this.w = CFG.PLAYER.w; this.h = CFG.PLAYER.h;
      this.spawn(x, y);
      this.img = new Image();
      this.imgReady = false;
      this.img.onload = () => { this.imgReady = true; };
      this.img.src = CFG.PLAYER.sprite;
    }

    spawn(x, y) {
      this.x = x; this.y = y; this.vx = 0; this.vy = 0;
      this.facing = 1; this.onGround = false; this.skidding = false;
      this.coyote = 0; this.jumpBuffer = 0; this.bumpedFrames = 0;
      this.animT = 0; this.dead = false; this.invuln = 0;
    }

    // Um passo de física (chamar a 60 Hz).
    update(input, world) {
      const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
      const maxSpeed = input.run ? P.maxRun : P.maxWalk;

      // ---- Horizontal: aceleração progressiva, atrito e derrapagem ----
      this.skidding = false;
      if (dir !== 0) {
        this.facing = dir;
        if (this.onGround) {
          if (Math.sign(this.vx) === -dir && Math.abs(this.vx) > 0.6) {
            this.vx += dir * P.skidDecel; this.skidding = true;
          } else if (Math.abs(this.vx) > maxSpeed && Math.sign(this.vx) === dir) {
            this.vx = approach(this.vx, dir * maxSpeed, P.friction);   // soltou o Shift
          } else {
            this.vx = approach(this.vx, dir * maxSpeed, input.run ? P.runAccel : P.walkAccel);
          }
        } else {
          this.vx = approach(this.vx, dir * Math.max(maxSpeed, Math.abs(this.vx)), P.airAccel);
        }
      } else {
        this.vx = approach(this.vx, 0, this.onGround ? P.friction : P.airDrag);
      }
      this.vx = clamp(this.vx, -P.maxRun, P.maxRun);

      // ---- Pulo: buffer + coyote time + altura variável ----
      if (input.consumeJump()) this.jumpBuffer = P.bufferFrames;
      else if (this.jumpBuffer > 0) this.jumpBuffer--;
      this.coyote = this.onGround ? P.coyoteFrames : Math.max(0, this.coyote - 1);

      if (this.jumpBuffer > 0 && this.coyote > 0) {
        this.vy = -(P.jumpVel + Math.abs(this.vx) * P.jumpSpeedBonus);
        this.jumpBuffer = 0; this.coyote = 0; this.onGround = false;
        if (window.UI) UI.sfx('jump');
      }

      let g = P.gravity;
      if (this.vy < 0 && !input.jump) g *= P.lowJumpMult;   // soltou o botão: corta o pulo
      this.vy = Math.min(this.vy + g, P.maxFall);

      // ---- Movimento + colisão, eixo por eixo ----
      this.x += this.vx;
      this._collideX(world);
      this.onGround = false;
      this.y += this.vy;
      this._collideY(world);

      if (this.x < 0) { this.x = 0; this.vx = 0; }
      if (this.bumpedFrames > 0) this.bumpedFrames--;
      if (this.invuln > 0) this.invuln--;
      if (this.y > world.height + 96) this.dead = true;     // caiu no buraco

      this.animT += Math.abs(this.vx) * 0.07;
    }

    _collideX(world) {
      const top = Math.floor(this.y / T), bot = Math.floor((this.y + this.h - 0.01) / T);
      if (this.vx > 0) {
        const c = Math.floor((this.x + this.w) / T);
        for (let r = top; r <= bot; r++) if (world.isSolid(c, r)) { this.x = c * T - this.w; this.vx = 0; return; }
      } else if (this.vx < 0) {
        const c = Math.floor(this.x / T);
        for (let r = top; r <= bot; r++) if (world.isSolid(c, r)) { this.x = (c + 1) * T; this.vx = 0; return; }
      }
    }

    _collideY(world) {
      const left = Math.floor((this.x + 1) / T), right = Math.floor((this.x + this.w - 1) / T);
      if (this.vy > 0) {
        const r = Math.floor((this.y + this.h) / T);
        for (let c = left; c <= right; c++) if (world.isSolid(c, r)) {
          this.y = r * T - this.h; this.vy = 0; this.onGround = true; return;
        }
      } else if (this.vy < 0) {
        const r = Math.floor(this.y / T);
        let best = -1, bestDist = Infinity;                  // coluna mais próxima do centro
        for (let c = left; c <= right; c++) if (world.isSolid(c, r)) {
          const d = Math.abs((c + 0.5) * T - (this.x + this.w / 2));
          if (d < bestDist) { bestDist = d; best = c; }
        }
        if (best >= 0) {
          this.y = (r + 1) * T; this.vy = 0;
          world.onHeadBump(best, r, this);                    // blocos "?" reagem aqui
        }
      }
    }

    // Quique ao pisar em inimigo (usado nas próximas fases).
    stomp() { this.vy = -8.5; this.onGround = false; }

    draw(ctx, camX) {
      if (this.invuln > 0 && (this.invuln >> 2) % 2) return;   // pisca ao tomar dano
      const dx = Math.round(this.x - camX), dy = Math.round(this.y);
      if (!this.imgReady) {                                    // placeholder: quadrado vermelho
        ctx.fillStyle = '#e03131'; ctx.fillRect(dx, dy, this.w, this.h); return;
      }
      const side = this.facing < 0 ? 'left' : 'right';
      let f = 0;
      if (!this.onGround) f = 1;
      else if (!this.skidding && Math.abs(this.vx) > 0.3) f = Math.floor(this.animT) % 4;
      const sw = SHEET.w[f], sh = SHEET.rowH[side];
      const dw = sw * SHEET.scale, dh = sh * SHEET.scale;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.img, SHEET.x[f], SHEET.rowY[side], sw, sh,
        Math.round(dx + this.w / 2 - dw / 2), Math.round(dy + this.h - dh), dw, dh);
    }
  }

  window.Player = Player;
})();
