// VizUnwrappedRaysPage.jsx -- imp-2914
// Flat (log p on x, t on y) strip showing prime phase rays theta = t * log(p)
// "unwrapped" (no mod 2pi). The horizontal caustic-crossing ticks mark heights
// t = 2*pi*k / log(p_i/p_j) where adjacent prime rays are in phase mod 2pi.
// A "fold mod 2pi" toggle shows how the flat strip wraps onto the phase cylinder.
//
// Honest ceiling: exploratory geometric re-parameterization. Re-derives only
// the resonance condition. Does NOT beat Platt-Trudgian Lambda <= 0.2.

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrimes } from '../math/primes.js';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

const TWO_PI = 2 * Math.PI;
const CANVAS_W = 640;
const CANVAS_H = 360;
const mono = 'var(--font-mono)';

const ALL_PRIMES = getPrimes(350);
const ALL_LOG_P  = ALL_PRIMES.map(p => Math.log(p));

// HSL to RGB
function hslToRgb(h, s, l) {
  const c  = (1 - Math.abs(2 * l - 1)) * s;
  const hh = h / 60;
  const x  = c * (1 - Math.abs(hh % 2 - 1));
  const m  = l - c / 2;
  let r, g, b;
  if      (hh < 1) { r = c; g = x; b = 0; }
  else if (hh < 2) { r = x; g = c; b = 0; }
  else if (hh < 3) { r = 0; g = c; b = x; }
  else if (hh < 4) { r = 0; g = x; b = c; }
  else if (hh < 5) { r = x; g = 0; b = c; }
  else             { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function phaseToColorUnwrapped(theta) {
  // Linear viridis-like: dark-blue -> cyan -> green -> yellow
  // Normalize over one 2pi cycle for the gradient, then cycle with brightness reduction
  const cycle = Math.floor(theta / TWO_PI);
  const frac  = (theta % TWO_PI + TWO_PI) % TWO_PI;
  const t = frac / TWO_PI;
  // Brightness dims with each cycle so you can see wrapping history
  const l = 0.55 - 0.04 * Math.min(cycle, 8);
  const hue = t * 300; // 0 (red) -> 300 (magenta) over one cycle
  return hslToRgb(hue, 0.85, Math.max(0.2, l));
}

function phaseToColorFolded(theta) {
  // Pure cycling rainbow — same hue map but no brightness drift
  const frac = (theta % TWO_PI + TWO_PI) % TWO_PI;
  const hue  = (frac / TWO_PI) * 300;
  return hslToRgb(hue, 0.85, 0.50);
}

function drawStrip(ctx, logP, tMin, tMax, folded, showCaustics) {
  const W = CANVAS_W;
  const H = CANVAS_H;
  const N = logP.length;
  if (N === 0) return;

  const PAD  = 0.25;
  const xMin = logP[0]     - PAD;
  const xMax = logP[N - 1] + PAD;
  const xSpan = xMax - xMin;
  const tSpan = tMax - tMin;

  // Pixel image for background phase field
  const img = ctx.createImageData(W, H);
  for (let py = 0; py < H; py++) {
    const t = tMax - (py / (H - 1)) * tSpan;
    for (let px = 0; px < W; px++) {
      const x     = xMin + (px / (W - 1)) * xSpan;
      const theta = t * x;
      const [r, g, b] = folded
        ? phaseToColorFolded(theta)
        : phaseToColorUnwrapped(theta);
      const base = (py * W + px) * 4;
      img.data[base]     = r;
      img.data[base + 1] = g;
      img.data[base + 2] = b;
      img.data[base + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // Prime ray vertical guide lines
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  for (let i = 0; i < N; i++) {
    const px = (logP[i] - xMin) / xSpan * W;
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Caustic-crossing marks: t = 2*pi*k / log(p_j/p_i) for adjacent pairs
  if (showCaustics) {
    ctx.strokeStyle = 'rgba(251,191,36,0.92)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < N - 1; i++) {
      const dLogP = logP[i + 1] - logP[i];
      const x1 = (logP[i]     - xMin) / xSpan * W;
      const x2 = (logP[i + 1] - xMin) / xSpan * W;
      for (let k = 1; ; k++) {
        const tc = k * TWO_PI / dLogP;
        if (tc > tMax) break;
        if (tc < tMin) continue;
        const py = Math.round((tMax - tc) / tSpan * H);
        ctx.beginPath();
        ctx.moveTo(x1, py);
        ctx.lineTo(x2, py);
        ctx.stroke();
      }
    }
  }

  // Prime labels along the top
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  const labelStep = N <= 20 ? 1 : N <= 40 ? 2 : 4;
  for (let i = 0; i < N; i += labelStep) {
    const px = (logP[i] - xMin) / xSpan * W;
    ctx.fillStyle = 'rgba(203,213,225,0.8)';
    ctx.fillText(String(ALL_PRIMES[i]), px, 10);
  }

  // Axis annotations
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.85)';
  ctx.textAlign = 'left';
  ctx.fillText('log p →', 4, H - 5);
  ctx.textAlign = 'right';
  ctx.fillText('t=' + tMax.toFixed(0), W - 4, 22);
  ctx.fillText('t=' + tMin.toFixed(0), W - 4, H - 5);
}

export default function VizUnwrappedRaysPage() {
  const canvasRef = useRef(null);

  const [nPrimes,     setNPrimes]     = useState(30);
  const [tMin,        setTMin]        = useState(5);
  const [tMax,        setTMax]        = useState(60);
  const [folded,      setFolded]      = useState(false);
  const [showCaustics, setShowCaustics] = useState(true);

  const N       = Math.min(nPrimes, ALL_LOG_P.length);
  const logSlice = ALL_LOG_P.slice(0, N);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    drawStrip(canvas.getContext('2d'), logSlice, tMin, tMax, folded, showCaustics);
  }, [N, logSlice, tMin, tMax, folded, showCaustics]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Unwrapped Prime Phase Rays (imp-2914)</h1>
        <p className="page-subtitle">
          Each prime p sits at x&thinsp;=&thinsp;log&thinsp;p on the horizontal axis.
          The color at height t encodes the phase &theta;&thinsp;=&thinsp;t&thinsp;&middot;&thinsp;log&thinsp;p{' '}
          {folded ? '(mod 2π — folded)' : '(unwrapped, cycling hue darkens with each 2π wrap)'}.
          Yellow ticks mark heights t&thinsp;=&thinsp;2&pi;k/log(p&#x2071;/p&#x2070;) where adjacent prime
          rays are in phase mod 2&pi; (caustic resonance crossings).
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/viz-phase-cylinder" style={{ color: '#a855f7', fontFamily: mono, fontSize: 12 }}>
            Phase Cylinder &rarr;
          </Link>
          <Link to="/viz-caustic-resonance" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            Caustic Resonance Overlay
          </Link>
          <Link to="/visualizations" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            All Visualizations
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
      }}>
        <Stat label="primes used" value={String(N)} />
        <Stat label="t range"     value={tMin + " .. " + tMax} />
        <Stat label="mode"        value={folded ? "folded" : "unwrapped"} accent="#818cf8" />
        <Stat label="caustics"    value={showCaustics ? "on" : "off"} accent="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="control-group">
          <label>N primes</label>
          <input type="range" min="5" max="80" step="5"
                 value={nPrimes} onChange={e => setNPrimes(+e.target.value)} />
          <span className="control-value">{nPrimes}</span>
        </div>
        <div className="control-group">
          <label>t-min</label>
          <input type="range" min="0" max="50" step="1"
                 value={tMin} onChange={e => setTMin(Math.min(+e.target.value, tMax - 5))} />
          <span className="control-value">{tMin}</span>
        </div>
        <div className="control-group">
          <label>t-max</label>
          <input type="range" min="10" max="200" step="5"
                 value={tMax} onChange={e => setTMax(Math.max(+e.target.value, tMin + 5))} />
          <span className="control-value">{tMax}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[false, true].map(f => (
            <button
              key={String(f)}
              onClick={() => setFolded(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: folded === f ? '#4f46e5' : 'var(--bg-panel)',
                color: folded === f ? '#fff' : 'var(--text-muted)',
                fontFamily: mono, fontSize: 12, cursor: 'pointer',
              }}
            >
              {f ? 'fold mod 2π' : 'unwrapped'}
            </button>
          ))}
          <button
            onClick={() => setShowCaustics(c => !c)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: showCaustics ? '#92400e' : 'var(--bg-panel)',
              color: showCaustics ? '#fde68a' : 'var(--text-muted)',
              fontFamily: mono, fontSize: 12, cursor: 'pointer',
            }}
          >
            crossings {showCaustics ? 'on' : 'off'}
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%', maxWidth: CANVAS_W, height: 'auto',
            border: '1px solid #1e293b', borderRadius: 4,
            imageRendering: 'pixelated',
          }}
        />
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.85 }}>
        <strong style={{ color: '#cbd5e1' }}>Unwrapped mode.</strong>{' '}
        The hue encodes phase &theta;&thinsp;=&thinsp;t&thinsp;&middot;&thinsp;log&thinsp;p cycling through 0&rarr;2&pi;&rarr;4&pi;&rarr;&hellip;
        Each prime column cycles at its own rate (proportional to log&thinsp;p). Brighter primes (larger p)
        cycle faster. The diagonal color bands show constant-phase-rate contours: &theta;&thinsp;=&thinsp;const means t&thinsp;&middot;&thinsp;x&thinsp;=&thinsp;const, a hyperbola.
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.85 }}>
        <strong style={{ color: '#cbd5e1' }}>Fold mod 2&pi; mode.</strong>{' '}
        The phase is taken mod 2&pi; and shown with a pure cycling rainbow. This is the same modular
        structure that wraps onto the phase cylinder: each prime column in this flat view becomes a helix
        on the cylinder. A caustic on the cylinder (vertical alignment column) corresponds to many
        prime columns being the same color at the same height t.
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.85 }}>
        <strong style={{ color: '#fbbf24' }}>Yellow crossing ticks.</strong>{' '}
        For each adjacent prime pair (p&#x2071;,&thinsp;p&#x2070;), a tick at height t&thinsp;=&thinsp;2&pi;k/log(p&#x2071;/p&#x2070;)
        marks where those two rays share the same phase mod 2&pi; — a resonance. These are the
        building blocks of the caustic structure seen in the cylinder and prime-caustic visualizations.
      </div>

      <ul style={{ marginTop: 10, paddingLeft: 18, fontSize: 11, lineHeight: 1.9 }}>
        <VizCeilingNote
          claim="the resonance condition t·log(pᴵ/p⁰)=2πk"
          as="li"
        />
      </ul>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 10,
    }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ marginTop: 4, fontSize: 16, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}
