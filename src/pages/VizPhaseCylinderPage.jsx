// VizPhaseCylinderPage.jsx -- imp-2725
// Unwrap the log-phase field theta = t*log(n) mod 2pi onto a flat rectangle
// or back onto a cylinder. Each prime traces a straight diagonal ray in the
// unrolled picture; caustics appear as vertical alignment columns. The
// cylinder toggle wraps the rectangle back onto the cylinder surface, turning
// the diagonal rays into parallel helices.
//
// Ceiling: geometric re-parameterization, descriptive/exploratory,
// NO claim about Lambda or a new bound on RH.
//
// Editorial (warm) re-theme: chrome only. The unrolled view's counts-heatmap
// (hotmap()) and the cylinder view's per-prime hue ramp (hsla rainbow, one
// hue per prime index) are DATA COLORMAPS and are left untouched. The scene
// chrome drawn around/on top of them (background fill, cylinder gradient,
// ellipse/edge strokes, axis labels) is recolored to literal warm hex --
// ctx.fillStyle/strokeStyle can't resolve CSS var(), so those calls use the
// literal palette below. Math and claims/caveats verbatim.

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrimes } from '../math/primes.js';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

const TWO_PI = 2 * Math.PI;
const mono = 'var(--ed-mono)';

const CANVAS_W = 640;
const CANVAS_H_FLAT = 280;
const CANVAS_H_CYL  = 380;

const ALL_PRIMES  = getPrimes(200);
const ALL_LOG_P   = ALL_PRIMES.map(p => Math.log(p));

// Map v in [0,1] to [r,g,b] using a blue->purple->yellow gradient.
// DATA COLORMAP -- untouched by the warm re-theme (encodes coherent-count
// density, not chrome).
function hotmap(v) {
  const c = Math.max(0, Math.min(1, v));
  if (c < 0.5) {
    const t = c * 2;
    return [
      Math.round(15  + t * (124 - 15)),
      Math.round(23  + t * (58  - 23)),
      Math.round(42  + t * (237 - 42)),
    ];
  }
  const t = (c - 0.5) * 2;
  return [
    Math.round(124 + t * (251 - 124)),
    Math.round(58  + t * (191 - 58)),
    Math.round(237 + t * (36  - 237)),
  ];
}

function drawUnrolled(ctx, logP, eps, tMin, tMax) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  const img = ctx.createImageData(W, H);
  let maxCount = 1;
  const counts = new Uint16Array(W * H);

  for (let py = 0; py < H; py++) {
    const t = tMax - (py / (H - 1)) * (tMax - tMin);
    for (let px = 0; px < W; px++) {
      const theta = (px / W) * TWO_PI;
      let c = 0;
      for (let i = 0; i < logP.length; i++) {
        let phase = (t * logP[i]) % TWO_PI;
        if (phase < 0) phase += TWO_PI;
        let d = Math.abs(phase - theta);
        if (d > Math.PI) d = TWO_PI - d;
        if (d < eps) c++;
      }
      counts[py * W + px] = c;
      if (c > maxCount) maxCount = c;
    }
  }

  for (let idx = 0; idx < W * H; idx++) {
    const [r, g, b] = hotmap(counts[idx] / maxCount);
    const base = idx * 4;
    img.data[base]     = r;
    img.data[base + 1] = g;
    img.data[base + 2] = b;
    img.data[base + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  // Axis labels -- literal warm off-white (paper2 #f6f1e7) for contrast
  // against the (unmodified) counts colormap. ctx.fillStyle can't read var().
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = TK_ALPHA(ED.paper2, 0.85);
  ctx.textAlign = 'left';
  ctx.fillText('th=0',    4,     H - 4);
  ctx.textAlign = 'center';
  ctx.fillText('th=pi',   W / 2, H - 4);
  ctx.textAlign = 'right';
  ctx.fillText('th=2pi',  W - 4, H - 4);
  ctx.textAlign = 'right';
  ctx.fillText('t=' + tMax.toFixed(0), W - 4, 12);
  ctx.fillText('t=' + tMin.toFixed(0), W - 4, H - 14);
  ctx.textAlign = 'left';
  ctx.fillText('theta (phase mod 2pi) ->', 4, 12);
}

function drawCylinder(ctx, logP, tMin, tMax) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  // Scene background -- literal warm paper2 (#f6f1e7). ctx.fillStyle can't
  // read var().
  ctx.fillStyle = ED.paper2;
  ctx.fillRect(0, 0, W, H);

  const CX   = W / 2;
  const CY   = H * 0.5;
  const R    = 130;
  const cylH = H * 0.72;
  const TILT = 0.32;  // vertical squash for depth illusion

  // Draw cylinder silhouette -- literal warm ink (#1c1814) tint gradient.
  const grad = ctx.createLinearGradient(CX - R, 0, CX + R, 0);
  grad.addColorStop(0,    TK_ALPHA(ED.ink, 0));
  grad.addColorStop(0.35, TK_ALPHA(ED.ink, 0.1));
  grad.addColorStop(0.65, TK_ALPHA(ED.ink, 0.1));
  grad.addColorStop(1,    TK_ALPHA(ED.ink, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(CX - R, CY - cylH / 2, R * 2, cylH);

  // Bottom ellipse (back) -- literal warm ink-soft (#4a4238).
  ctx.beginPath();
  ctx.ellipse(CX, CY + cylH / 2, R, R * TILT, 0, 0, TWO_PI);
  ctx.strokeStyle = TK_ALPHA(ED.inkSoft, 0.55);
  ctx.lineWidth = 1;
  ctx.stroke();

  // Side edges -- literal warm ink-soft (#4a4238).
  ctx.strokeStyle = TK_ALPHA(ED.inkSoft, 0.75);
  ctx.lineWidth   = 1.2;
  ctx.beginPath(); ctx.moveTo(CX - R, CY - cylH / 2); ctx.lineTo(CX - R, CY + cylH / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX + R, CY - cylH / 2); ctx.lineTo(CX + R, CY + cylH / 2); ctx.stroke();

  // Prime helices -- DATA COLORMAP (hsla rainbow ramp, one hue per prime
  // index) -- untouched by the warm re-theme.
  const nT = 500;
  const N  = logP.length;
  for (let i = 0; i < N; i++) {
    const hue = Math.round((i / N) * 280);
    let prevX = null, prevY = null, prevCos = null;

    for (let k = 0; k <= nT; k++) {
      const t = tMin + (k / nT) * (tMax - tMin);
      let theta = (t * logP[i]) % TWO_PI;
      if (theta < 0) theta += TWO_PI;

      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const tNorm = (t - (tMin + tMax) / 2) / (tMax - tMin);
      const x = CX + R * cosT;
      const y = CY - tNorm * cylH + R * sinT * TILT;

      if (prevX !== null) {
        // Skip segments that wrap around the cylinder
        let dtheta = (t - tMin + (k - 1) / nT * (tMax - tMin)) / nT;
        const prevTheta = ((t - (tMax - tMin) / nT) * logP[i]) % TWO_PI;
        const rawDelta  = theta - (prevTheta < 0 ? prevTheta + TWO_PI : prevTheta);
        if (Math.abs(rawDelta) < Math.PI) {
          const avgCos = (cosT + prevCos) / 2;
          const alpha  = avgCos > 0 ? 0.55 + 0.35 * avgCos : 0.15 * (1 + avgCos);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = "hsla(" + hue + ",68%,62%," + alpha.toFixed(2) + ")";
          ctx.lineWidth = avgCos > 0 ? 1.2 : 0.6;
          ctx.stroke();
        }
      }
      prevX = x; prevY = y; prevCos = cosT;
    }
  }

  // Top ellipse (front, drawn last so it caps the helices) -- literal warm
  // ink (#1c1814).
  ctx.beginPath();
  ctx.ellipse(CX, CY - cylH / 2, R, R * TILT, 0, 0, TWO_PI);
  ctx.strokeStyle = TK_ALPHA(ED.ink, 0.75);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Labels -- literal warm ink-soft (#4a4238).
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = TK_ALPHA(ED.inkSoft, 0.85);
  ctx.textAlign = 'center';
  ctx.fillText('theta axis (0..2pi around circumference)', CX, CY + cylH / 2 + 18);
  ctx.textAlign = 'right';
  ctx.fillText('t=' + tMax.toFixed(0), CX + R + 4, CY - cylH / 2 - 4);
  ctx.fillText('t=' + tMin.toFixed(0), CX + R + 4, CY + cylH / 2 + 4);
}

export default function VizPhaseCylinderPage() {
  const canvasRef = useRef(null);

  const [nPrimes,  setNPrimes]  = useState(40);
  const [eps,      setEps]      = useState(0.18);
  const [tMin,     setTMin]     = useState(10);
  const [tMax,     setTMax]     = useState(60);
  const [viewMode, setViewMode] = useState('unrolled'); // 'unrolled' | 'cylinder'

  const N        = Math.min(nPrimes, ALL_PRIMES.length);
  const logSlice = ALL_LOG_P.slice(0, N);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (viewMode === 'unrolled') {
      canvas.width  = CANVAS_W;
      canvas.height = CANVAS_H_FLAT;
      drawUnrolled(canvas.getContext('2d'), logSlice, eps, tMin, tMax);
    } else {
      canvas.width  = CANVAS_W;
      canvas.height = CANVAS_H_CYL;
      drawCylinder(canvas.getContext('2d'), logSlice, tMin, tMax);
    }
  }, [N, logSlice, eps, tMin, tMax, viewMode]);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>viz &middot; phase cylinder</span>} />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <header style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: 18, marginBottom: 24 }}>
          <div className="ed-lbl">/viz-phase-cylinder &middot; visualizations</div>
          <h1 className="ed-h1" style={{ margin: '8px 0 4px 0' }}>Phase Cylinder: Unwrapped Rays (imp-2725)</h1>
          <p className="ed-lbl">Related: <Link to="/viz-unwrapped-rays">Unwrapped phase rays</Link></p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
            Each prime p maps t to phase theta = t&thinsp;&middot;&thinsp;log(p) mod 2&pi;.
            In the <strong>unrolled view</strong> (theta on x, t on y) each prime traces a
            straight diagonal ray; multiple primes aligning at the same theta creates the
            bright vertical columns (caustics). The <strong>cylinder view</strong> wraps
            that flat picture back onto the cylinder surface, revealing the parallel helices.
          </p>
          <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/viz-log-phase-spiral" style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>
              &larr; Log-Phase Spiral
            </Link>
            <Link to="/viz-unwrapped-rays" style={{ color: 'var(--blue)', fontFamily: mono, fontSize: 12 }}>
              &#x21C4; Unwrapped Rays (unfolded view)
            </Link>
            <Link to="/viz-prime-caustic" style={{ color: 'var(--brass-dk)', fontFamily: mono, fontSize: 12 }}>
              Prime Caustic &rarr;
            </Link>
            <Link to="/visualizations" style={{ color: 'var(--ink-soft)', fontFamily: mono, fontSize: 12 }}>
              All Visualizations
            </Link>
          </div>
        </header>

        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
        }}>
          <Stat label="primes used"  value={String(N)} />
          <Stat label="t range"      value={tMin + " .. " + tMax} />
          <Stat label="eps (rad)"    value={eps.toFixed(2)} />
          <Stat label="view"         value={viewMode} accent="var(--blue)" />
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="card" style={{ padding: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', fontFamily: mono }}>
              N primes
            </label>
            <div style={{ marginTop: 4 }}>
              <input type="range" min="10" max="80" step="5"
                     value={nPrimes} onChange={e => setNPrimes(+e.target.value)} style={{ width: 180 }} />
              <span style={{ marginLeft: 8, fontSize: 13, fontFamily: mono, color: 'var(--brass-dk)' }}>{nPrimes}</span>
            </div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', fontFamily: mono }}>
              eps (rad) &mdash; unrolled only
            </label>
            <div style={{ marginTop: 4 }}>
              <input type="range" min="0.05" max="0.4" step="0.01"
                     value={eps} onChange={e => setEps(+e.target.value)} style={{ width: 180 }} />
              <span style={{ marginLeft: 8, fontSize: 13, fontFamily: mono, color: 'var(--brass-dk)' }}>{eps.toFixed(2)}</span>
            </div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', fontFamily: mono }}>
              t-min
            </label>
            <div style={{ marginTop: 4 }}>
              <input type="range" min="1" max="50" step="1"
                     value={tMin} onChange={e => setTMin(Math.min(+e.target.value, tMax - 5))} style={{ width: 180 }} />
              <span style={{ marginLeft: 8, fontSize: 13, fontFamily: mono, color: 'var(--brass-dk)' }}>{tMin}</span>
            </div>
          </div>
          <div className="card" style={{ padding: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', fontFamily: mono }}>
              t-max
            </label>
            <div style={{ marginTop: 4 }}>
              <input type="range" min="15" max="200" step="5"
                     value={tMax} onChange={e => setTMax(Math.max(+e.target.value, tMin + 5))} style={{ width: 180 }} />
              <span style={{ marginLeft: 8, fontSize: 13, fontFamily: mono, color: 'var(--brass-dk)' }}>{tMax}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['unrolled', 'cylinder'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: '1px solid var(--hairline)',
                  background: viewMode === mode ? 'var(--brass-dk)' : 'var(--paper2)',
                  color: viewMode === mode ? '#fff' : 'var(--text-muted)',
                  fontFamily: mono, fontSize: 12, cursor: 'pointer',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{
          marginTop: 14,
          padding: 12,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%', maxWidth: CANVAS_W, height: 'auto',
              border: '1px solid var(--hairline)', borderRadius: 4,
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.85 }}>
          <strong style={{ color: 'var(--ink)' }}>Unrolled view.</strong>{' '}
          The x-axis is phase theta = t&thinsp;&middot;&thinsp;log(p) mod 2&pi; and the y-axis is t.
          Each prime contributes a straight diagonal ray with slope proportional to log(p).
          When many rays pass through the same column, the pixel brightens (a caustic).
          The eps slider controls how wide the phase window for counting is.
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.85 }}>
          <strong style={{ color: 'var(--ink)' }}>Cylinder view.</strong>{' '}
          The same rays are plotted as helices on a cylinder surface viewed from a 3/4 angle.
          Each helix represents one prime; the colors cycle through the prime list.
          Front-facing portions are bright; rear-facing portions are dimmed.
          A caustic on the cylinder is a vertical column of helix crossings.
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.85 }}>
          <strong style={{ color: 'var(--blue)' }}>Relationship to Unwrapped Rays.</strong>{' '}
          This cylinder is the mod-2&pi; fold of the flat{' '}
          <Link to="/viz-unwrapped-rays" style={{ color: 'var(--blue)' }}>unwrapped-rays</Link>{' '}
          strip: rolling that flat strip into a tube produces exactly this cylinder.
          Set N&thinsp;=&thinsp;{N} on both pages to align the two views and compare caustic columns
          to caustic-crossing ticks directly.
        </div>
        <div className="card" style={{ marginTop: 10, padding: 12, borderLeft: '3px solid var(--terra-dk)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)',
                        letterSpacing: 0.5, marginBottom: 6, fontFamily: mono }}>
            Ceiling
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            This is a geometric re-parameterization of the log-phase field. It is purely
            exploratory and descriptive. It does NOT produce a new bound on Lambda,
            does NOT prove RH, and does NOT beat the Platt-Trudgian Lambda &le; 0.2 result.
            The caustic structure is an observed pattern in the phase statistics of primes.
          </div>
        </div>

        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: mono }}>Sibling visualizations:</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/viz-unwrapped-rays" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/viz-unwrapped-rays</Link>
            <Link to="/viz-prime-caustic" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/viz-prime-caustic</Link>
            <Link to="/visualizations" style={{ color: 'var(--terra-dk)', fontSize: 13 }}>/visualizations</Link>
          </div>
          <div style={{ marginTop: 16 }}>
            <Link to="/">&larr; the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="card" style={{ padding: 10 }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--faint)', letterSpacing: 0.5, fontFamily: mono }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontFamily: mono, color: accent || 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
