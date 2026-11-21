import React, { useRef, useCallback, useEffect } from 'react';
import { ED } from '../styles/tokens.js';

/**
 * Shareable research status card — generates a canvas image
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
    ctx.strokeStyle = ED.ruleSoft;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Title
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.ink;
    ctx.textAlign = 'center';
    ctx.fillText('RIEMANN HYPOTHESIS RESEARCH', w / 2, 36);
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.fillText('Twin-Ladder Evidence & Open-Gap Report', w / 2, 56);

    // Evidence-graded sections. "Exact" applies only to the stated
    // mathematical identity/domain; it is not a claim that RH is proved.
    const sections = [
      { id: 'S1', name: 'Euler Product', status: 'EXACT: RE S > 1', color: ED.series3 },
      { id: 'S2', name: 'Zeta Ratio', status: 'EXACT / ALGEBRAIC', color: ED.series3 },
      { id: 'S3', name: 'LC Cascade', status: 'MODEL ONLY', color: ED.brass },
      { id: 'S4', name: 'Continuation', status: 'CIRCUIT OPEN', color: ED.brass },
      { id: 'S5', name: 'Operator', status: 'OPEN', color: ED.series2 },
      { id: 'S6', name: 'Energy Proxy', status: 'FINITE ONLY', color: ED.series1 },
      { id: 'S7', name: 'Realization', status: 'BLOCKED', color: ED.series2 },
      { id: 'S8', name: 'RH', status: 'OPEN', color: ED.series2 },
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
      ctx.fillStyle = ED.series8;
      ctx.fillText(sec.name, x + 32, y + 18);
      ctx.fillStyle = sec.color;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(sec.status.toUpperCase(), x + 8, y + 34);
    });

    // Stats
    const statsY = 195;
    const stats = [
      { label: 'Accepted RH Proofs', value: '0', color: ED.series2 },
      { label: 'Peer-Reviewed Λ Cap', value: '0.2', color: ED.series3 },
      { label: 'Public Λ Claim', value: '0.1875', color: ED.brass },
      { label: 'Private Candidate*', value: '0.1787854', color: ED.series6 },
    ];

    stats.forEach((s, i) => {
      const x = 20 + i * ((w - 40) / 4);
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.fillText(s.value, x + (w - 40) / 8, statsY + 20);
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = ED.series8;
      ctx.fillText(s.label, x + (w - 40) / 8, statsY + 36);
    });

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'right';
    ctx.fillText('* computer-assisted candidate; bound not established; not RH', w - 20, statsY + 52);

    // Key result
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(20, 248, w - 40, 40, 6);
    ctx.fill();
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series4;
    ctx.textAlign = 'center';
    ctx.fillText('ζ zeros are generic poles of ζ(2s)/ζ(s)', w / 2, 265);
    ctx.fillStyle = ED.series8;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Realization + an exact divisor theorem remain open', w / 2, 280);

    // Footer
    ctx.fillStyle = '#334155';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Twin-Ladder research • exploreriemann.com', w / 2, h - 8);
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
    link.download = 'rh-research-status.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: 600, borderRadius: 8, border: '1px solid var(--rule-soft)' }}
        onClick={draw} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { draw(); handleSave(); }}
          style={{ padding: '6px 14px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-1) 15%, transparent)',
            color: 'var(--series-1)', border: '1px solid color-mix(in srgb, var(--series-1) 30%, transparent)', cursor: 'pointer', fontSize: 12 }}>
          Save as PNG
        </button>
        <button onClick={draw}
          style={{ padding: '6px 14px', borderRadius: 6, background: 'color-mix(in srgb, var(--series-3) 15%, transparent)',
            color: 'var(--series-3)', border: '1px solid color-mix(in srgb, var(--series-3) 30%, transparent)', cursor: 'pointer', fontSize: 12 }}>
          Refresh
        </button>
      </div>
    </div>
  );
}
