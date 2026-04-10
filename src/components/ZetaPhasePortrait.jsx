import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { InlineMath } from './KaTeXMath.jsx';
import { zetaCriticalStrip, cAbs, ZETA_ZEROS } from '../math/zeta.js';

/**
 * Phase portrait of ζ(s) in the critical strip using domain coloring.
 * Hue = arg(ζ(s)), brightness = log|ζ(s)|.
 * Zeros appear as points where all colors meet (phase singularities).
 */
export default function ZetaPhasePortrait() {
  const canvasRef = useRef();
  const [sigmaRange, setSigmaRange] = useState([0.0, 1.0]);
  const [tCenter, setTCenter] = useState(20);
  const [tSpan, setTSpan] = useState(20);
  const [resolution, setResolution] = useState(2); // pixel skip for speed

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const sigMin = sigmaRange[0], sigMax = sigmaRange[1];
    const tMin = tCenter - tSpan / 2, tMax = tCenter + tSpan / 2;
    // putImageData ignores ctx transforms — it writes raw backing-store pixels.
    // Previously this loop and createImageData used CSS pixel dimensions (w, h),
    // so on retina (dpr=2) only the top-left w×h quadrant of the dpr*w × dpr*h
    // backing store got the phase portrait while overlays (which DO see the
    // ctx.scale(dpr,dpr) transform) covered the full canvas. Now we iterate
    // over the actual backing-store dimensions and scale step by dpr so the
    // user-facing block size is unchanged.
    const bw = canvas.width, bh = canvas.height;
    const step = resolution * dpr;

    const imgData = ctx.createImageData(bw, bh);
    const data = imgData.data;

    for (let px = 0; px < bw; px += step) {
      for (let py = 0; py < bh; py += step) {
        const sigma = sigMin + (px / bw) * (sigMax - sigMin);
        const t = tMax - (py / bh) * (tMax - tMin); // y-axis inverted

        const z = zetaCriticalStrip([sigma, t]);
        const mag = Math.sqrt(z[0] * z[0] + z[1] * z[1]);
        const phase = Math.atan2(z[1], z[0]); // −π to π

        // Domain coloring: hue from phase, brightness from magnitude
        const hue = (phase + Math.PI) / (2 * Math.PI); // 0 to 1
        const brightness = Math.min(1, 0.15 + 0.85 * (1 - Math.exp(-mag * 0.5)));
        const saturation = 0.85;

        // HSL to RGB
        const [r, g, b] = hslToRgb(hue, saturation, brightness * 0.5);

        // Fill the step×step block
        for (let dx = 0; dx < step && px + dx < bw; dx++) {
          for (let dy = 0; dy < step && py + dy < bh; dy++) {
            const idx = ((py + dy) * bw + (px + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay: critical line at σ = ½
    const critX = ((0.5 - sigMin) / (sigMax - sigMin)) * w;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(critX, 0);
    ctx.lineTo(critX, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mark known zeros
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 1;
    for (const gamma of ZETA_ZEROS) {
      if (gamma < tMin || gamma > tMax) continue;
      const zx = critX;
      const zy = ((tMax - gamma) / (tMax - tMin)) * h;
      ctx.beginPath();
      ctx.arc(zx, zy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(`σ = ${sigMin.toFixed(1)}`, 4, h - 6);
    ctx.textAlign = 'right';
    ctx.fillText(`σ = ${sigMax.toFixed(1)}`, w - 4, h - 6);
    ctx.textAlign = 'center';
    ctx.fillText('σ = ½', critX, h - 6);

    ctx.textAlign = 'left';
    ctx.fillText(`t = ${tMax.toFixed(1)}`, 4, 14);
    ctx.fillText(`t = ${tMin.toFixed(1)}`, 4, h - 18);
  }, [sigmaRange, tCenter, tSpan, resolution]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-purple" style={{ marginBottom: 12 }}>
        <p>
          <strong>Phase portrait</strong> of <InlineMath tex="\zeta(s)" /> using domain coloring:
          hue encodes <InlineMath tex="\arg(\zeta)" />, brightness encodes{' '}
          <InlineMath tex="|\zeta|" />. Zeros appear as <strong>phase singularities</strong> where
          all colors converge — white dots mark known zeros on the critical line{' '}
          <InlineMath tex="\sigma = \tfrac{1}{2}" />.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>t center</label>
          <input type="range" min="15" max="300" step="1" value={tCenter}
            onChange={e => setTCenter(+e.target.value)} />
          <span className="control-value">{tCenter}</span>
        </div>
        <div className="control-group">
          <label>t span</label>
          <input type="range" min="5" max="60" step="1" value={tSpan}
            onChange={e => setTSpan(+e.target.value)} />
          <span className="control-value">{tSpan}</span>
        </div>
        <div className="control-group">
          <label>σ window</label>
          <input
            type="range" min="-2" max="1" step="0.1"
            value={sigmaRange[0]}
            title="Pan the σ (real-axis) window while keeping its width fixed at 1.0 — use this to zoom out of the critical strip and see the trivial-zeros region (σ < 0) or the convergent region (σ > 1)."
            onChange={e => { const lo = +e.target.value; setSigmaRange([lo, lo + 1]); }}
          />
          <span className="control-value" style={{ fontFamily: 'var(--font-mono)' }}>
            [{sigmaRange[0].toFixed(1)}, {sigmaRange[1].toFixed(1)}]
          </span>
        </div>
        <div className="control-group">
          <label>Resolution</label>
          <input type="range" min="1" max="4" step="1" value={resolution}
            onChange={e => setResolution(+e.target.value)} />
          <span className="control-value">{resolution === 1 ? 'High' : resolution === 2 ? 'Medium' : resolution === 3 ? 'Fast' : 'Fastest'}</span>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 400, borderRadius: 8,
                 border: '1px solid #1e293b', cursor: 'crosshair' }} />

      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: '#94a3b8' }}>
          <strong style={{ color: '#c4b5fd' }}>Phase singularities</strong> — zeros are points
          where all hues meet, creating a characteristic "pinwheel" pattern.
          Only found on σ = ½ (critical line) if RH is true.
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 6, fontSize: 12,
                      background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)',
                      color: '#94a3b8' }}>
          <strong style={{ color: '#93c5fd' }}>Color key</strong> —
          Red → Yellow → Green → Cyan → Blue → Magenta = arg(ζ) from 0 to 2π.
          Dark = |ζ| small (near zeros). Bright = |ζ| large.
        </div>
      </div>
    </div>
  );
}

/** Convert HSL (0-1 range) to RGB (0-255 range) */
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}
