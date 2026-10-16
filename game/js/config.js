// Constantes globais. Física em "pixels por frame" a 60 FPS (passo fixo).
window.CFG = {
  W: 960, H: 544, TILE: 32, FPS: 60,
  START_LIVES: 3,

  // Ajuste fino da "sensação" de Mario: mexa só aqui.
  PHYS: {
    gravity: 0.50,
    lowJumpMult: 2.2,      // gravidade extra ao soltar o pulo (pulo variável)
    maxFall: 12,
    jumpVel: 10.6,
    jumpSpeedBonus: 0.30,  // correr mais rápido pula um pouco mais alto
    coyoteFrames: 6,       // tolerância para pular logo após sair da borda
    bufferFrames: 6,       // tolerância para apertar pulo antes de pousar

    maxWalk: 3.0,
    maxRun: 5.0,           // segurando Shift
    walkAccel: 0.20,
    runAccel: 0.28,
    airAccel: 0.16,
    friction: 0.24,        // desaceleração no chão sem input
    skidDecel: 0.55,       // frenagem ao inverter direção
    airDrag: 0.02
  },

  PLAYER: { w: 26, h: 44, sprite: 'assets/player.png' }
};
