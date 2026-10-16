// Teclado: estado contínuo (left/right/run/jump) + borda de apertar (jumpPressed).
window.Input = (() => {
  const down = new Set();
  let jumpEdge = false, pauseEdge = false;
  const L = ['ArrowLeft', 'KeyA'], R = ['ArrowRight', 'KeyD'];
  const J = ['Space', 'ArrowUp', 'KeyW'];
  const any = (codes) => codes.some(c => down.has(c));

  addEventListener('keydown', (e) => {
    if ([...L, ...R, ...J, 'ArrowDown'].includes(e.code)) e.preventDefault();
    if (!e.repeat) {
      if (J.includes(e.code)) jumpEdge = true;
      if (e.code === 'KeyP' || e.code === 'Escape') pauseEdge = true;
    }
    down.add(e.code);
  });
  addEventListener('keyup', (e) => down.delete(e.code));
  addEventListener('blur', () => down.clear());

  return {
    get left()  { return any(L); },
    get right() { return any(R); },
    get jump()  { return any(J); },                       // segurado
    get run()   { return down.has('ShiftLeft') || down.has('ShiftRight'); },
    consumeJump()  { const v = jumpEdge;  jumpEdge = false;  return v; },
    consumePause() { const v = pauseEdge; pauseEdge = false; return v; },
    clearEdges()   { jumpEdge = false; pauseEdge = false; }
  };
})();
