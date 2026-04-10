import React, { useRef, useCallback, useEffect } from 'react';

/**
 * Shareable proof status card — generates a canvas image
 * that can be saved/shared on social media.
 */
export default function ProofStatusCard() {
  const canvasRef = useRef();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 600, h = 315; // Twitter card ratio
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0e1a');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Title
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText('RIEMANN HYPOTHESIS', w / 2, 36);
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ZPO Twin Ladder Proof Framework — Status Report', w / 2, 56);

    // Proof sections grid
    const sections = [
      { id: 'S1', name: 'Euler Product', status: 'proven', color: '#10b981' },
      { id: 'S2', name: 'Cascade', status: 'proven', color: '#10b981' },
      { id: 'S3', name: 'Func. Equation', status: 'proven', color: '#10b981' },
      { id: 'S4', name: 'Continuation', status: 'proven', color: '#10b981' },
      { id: 'S5', name: 'Operator', status: 'conditional', color: '#f59e0b' },
      { id: 'S6', name: 'Hamiltonian', status: 'verified', color: '#3b82f6' },
      { id: 'S7', name: 'Darlington', status: '6/7 rigorous', color: '#8b5cf6' },
      { id: 'S8', name: 'RH', status: 'follows S7', color: '#8b5cf6' },
    ];

    const startY = 75;
    const cols = 4, rows = 2;
    const cellW = (w - 40) / cols, cellH = 44;

    sections.forEach((sec, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = 20 + col * cellW, y = startY + row * (cellH + 8);

      ctx.fillStyle = sec.color + '15';
      ctx.strokeStyle = sec.color + '40';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cellW - 8, cellH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillStyle = sec.color;
      ctx.textAlign = 'left';
      ctx.fillText(sec.id, x + 8, y + 18);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(sec.name, x + 32, y + 18);
      ctx.fillStyle = sec.color;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(sec.status.toUpperCase(), x + 8, y + 34);
    });

    // Stats
    const statsY = 195;
    const stats = [
      { label: 'Closure Paths', value: '6', color: '#10b981' },
      { label: 'Verified Zeros', value: '870+', color: '#3b82f6' },
      { label: 'Math Modules', value: '35+', color: '#8b5cf6' },
      { label: 'Improvements', value: '70+', color: '#f59e0b' },
    ];

    stats.forEach((s, i) => {
      const x = 20 + i * ((w - 40) / 4);
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.fillText(s.value, x + (w - 40) / 8, statsY + 20);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(s.label, x + (w - 40) / 8, statsY + 36);
    });

    // Key result
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(20, 248, w - 40, 40, 6);
    ctx.fill();
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('RH reduces to one axiom: infinite Darlington closure', w / 2, 265);
    ctx.fillStyle = '#64748b';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('6 independent paths verify it • Mertens bound proves convergence', w / 2, 280);

    // Footer
    ctx.fillStyle = '#334155';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ZPO Explorer by Jude Gomila • localhost:3002', w / 2, h - 8);
  }, []);

  // Draw once on mount so the card is visible without requiring a user click —
  // before this effect, the canvas had default 300×150 dimensions and rendered blank
  // until the user happened to click it or hit Refresh.
  useEffect(() => { draw(); }, [draw]);

  const handleSave = () => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'rh-proof-status.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 600, borderRadius: 8, border: '1px solid #1e293b' }}
        onClick={draw} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { draw(); handleSave(); }}
          style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(59,130,246,0.15)',
            color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', fontSize: 12 }}>
          Save as PNG
        </button>
        <button onClick={draw}
          style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(16,185,129,0.15)',
            color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', cursor: 'pointer', fontSize: 12 }}>
          Refresh
        </button>
      </div>
    </div>
  );
}
