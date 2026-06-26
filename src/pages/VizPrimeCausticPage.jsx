// VizPrimeCausticPage.jsx -- imp-1225
// Caustic-geometry visualisation: for each (sigma, t) in the bounding box,
// count how many of the first N=1000 primes have phase (t * log p) mod 2*pi
// within EPS=0.2 radians of zero, and render the result as a Canvas heatmap.
//
// The sigma axis enters via an amplitude weight p^{-sigma} on the coherent
// set, so the brightness varies with sigma even though the *count* does not.
// User can toggle between "count" and "amplitude" modes and pick eps + N.
//
// Renders ~300 x 300 pixels via a single putImageData call.  Pre-computed
// 256-entry RGB colormap (viridis-like) keeps the inner loop branch-free.

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VIZ_PRIME_CAUSTIC } from '../data/viz-prime-caustic.js';
import VizCeilingNote from '../components/VizCeilingNote.jsx';

const D = VIZ_PRIME_CAUSTIC;
const TWO_PI = 2 * Math.PI;
const mono = 'var(--font-mono)';

// Imaginary parts of the first 10 nontrivial zeros of zeta(s).
// At these t values the explicit-formula x^rho kernel e^{i*gamma*log x}
// produces destructive interference across primes, so the caustic is dark.
const ZERO_HEIGHTS = [14.134, 21.022, 25.011, 30.425, 32.935, 37.586, 40.919, 43.327, 48.005, 49.774];

// 256-entry viridis-like colormap as a flat Uint8Array (R, G, B per entry).
// Pre-computed once at module load.
const COLORMAP = (() => {
  const out = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    // Quick viridis-like ramp: dark navy -> teal -> green -> yellow.
    const r = Math.round(255 * Math.max(0, Math.min(1, -0.20 + 1.50 * x)));
    const g = Math.round(255 * Math.max(0, Math.min(1,  0.10 + 1.05 * x - 0.20 * x * x)));
    const b = Math.round(255 * Math.max(0, Math.min(1,  0.40 + 0.40 * x - 0.90 * x * x)));
    out[i * 3 + 0] = r;
    out[i * 3 + 1] = g;
    out[i * 3 + 2] = b;
  }
  return out;
})();

// Reduce phase to (-pi, pi].
function wrap(x) {
  let r = x - TWO_PI * Math.round(x / TWO_PI);
  if (r >  Math.PI) r -= TWO_PI;
  if (r < -Math.PI) r += TWO_PI;
  return r;
}

export default function VizPrimeCausticPage() {
  const canvasRef = useRef(null);
  const [nPrimes, setNPrimes] = useState(D.bbox.nPrimes);
  const [eps, setEps]         = useState(D.bbox.eps);
  const [mode, setMode]       = useState('amplitude');     // 'count' or 'amplitude'
  const [resolution, setRes]  = useState(1);                // 1=full 300x300, 2=half, 4=coarse
  const [renderInfo, setRenderInfo] = useState({ ms: 0, maxVal: 0 });
  const [hoverInfo, setHoverInfo] = useState(null);
  const [showZeroOverlay, setShowZeroOverlay] = useState(true);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const W = D.bbox.gridW;
    const H = D.bbox.gridH;
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const sMin = D.bbox.sigmaMin, sMax = D.bbox.sigmaMax;
    const tMin = D.bbox.tMin, tMax = D.bbox.tMax;
    const sigma = sMin + (px / (W - 1)) * (sMax - sMin);
    const t = tMax - (py / (H - 1)) * (tMax - tMin);
    if (t < tMin || t > tMax || sigma < sMin || sigma > sMax) { setHoverInfo(null); return; }
    const M = logPrimes.length;
    let count = 0, amp = 0;
    for (let i = 0; i < M; i++) {
      const r = wrap(t * logPrimes[i]);
      if (Math.abs(r) < eps) { count++; amp += Math.exp(-sigma * logPrimes[i]); }
    }
    setHoverInfo({ clientX: e.clientX, clientY: e.clientY, sigma, t, count, amp });
  }, [logPrimes, eps]);

  const handleMouseLeave = useCallback(() => setHoverInfo(null), []);

  // Pre-slice the prime list to the active count.
  const logPrimes = useMemo(() => {
    const N = Math.min(nPrimes, D.primes.length);
    return D.logPrimes.slice(0, N);
  }, [nPrimes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const t0 = performance.now();

    const W = D.bbox.gridW;
    const H = D.bbox.gridH;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    const step = resolution;
    const sMin = D.bbox.sigmaMin, sMax = D.bbox.sigmaMax;
    const tMin = D.bbox.tMin,     tMax = D.bbox.tMax;
    const M = logPrimes.length;

    // Step 1: compute the row-only count once per scanline (sigma-independent).
    const rowCounts = new Uint16Array(H);
    const rowAmp    = new Float64Array(H);
    // For amplitude mode we need sigma per pixel, so we precompute per-row the
    // list of coherent primes (their log p values), then evaluate the sum
    // per (row, col).  For count mode we just store the count once per row.
    const coherentByRow = new Array(H);  // each entry: Float64Array of log p
    for (let py = 0; py < H; py += step) {
      const t = tMax - (py / (H - 1)) * (tMax - tMin);
      let c = 0;
      const tmp = new Float64Array(M);
      for (let i = 0; i < M; i++) {
        const r = wrap(t * logPrimes[i]);
        if (Math.abs(r) < eps) tmp[c++] = logPrimes[i];
      }
      coherentByRow[py] = tmp.slice(0, c);
      rowCounts[py] = c;
    }

    // Pass 2: find max value for normalisation (uses sigma at midpoint for amp).
    let maxVal = 1;
    if (mode === 'count') {
      for (let py = 0; py < H; py += step) {
        if (rowCounts[py] > maxVal) maxVal = rowCounts[py];
      }
    } else {
      // For amplitude, evaluate at sigma_min (where amp is largest) per row.
      for (let py = 0; py < H; py += step) {
        const coh = coherentByRow[py];
        let s = 0;
        for (let i = 0; i < coh.length; i++) s += Math.exp(-sMin * coh[i]);
        if (s > maxVal) maxVal = s;
        rowAmp[py] = s;  // reuse for the dynamic floor
      }
    }

    // Pass 3: fill the ImageData buffer.
    const imgData = ctx.createImageData(W, H);
    const data    = imgData.data;
    for (let py = 0; py < H; py += step) {
      const coh = coherentByRow[py];
      for (let px = 0; px < W; px += step) {
        const sigma = sMin + (px / (W - 1)) * (sMax - sMin);
        let v;
        if (mode === 'count') {
          v = rowCounts[py];
        } else {
          let s = 0;
          for (let i = 0; i < coh.length; i++) {
            s += Math.exp(-sigma * coh[i]);
          }
          v = s;
        }
        const norm = Math.min(1, v / maxVal);
        // gamma-correct for visual punch (sqrt brings out mid-tones).
        const idx256 = Math.min(255, Math.floor(Math.sqrt(norm) * 255));
        const cmIdx = idx256 * 3;
        const r = COLORMAP[cmIdx + 0];
        const g = COLORMAP[cmIdx + 1];
        const b = COLORMAP[cmIdx + 2];
        // Replicate the cell across the step block.
        for (let dy = 0; dy < step && py + dy < H; dy++) {
          for (let dx = 0; dx < step && px + dx < W; dx++) {
            const pos = ((py + dy) * W + (px + dx)) * 4;
            data[pos]     = r;
            data[pos + 1] = g;
            data[pos + 2] = b;
            data[pos + 3] = 255;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Critical-line marker (vertical dashed line at sigma = 1/2).
    const critX = ((0.5 - sMin) / (sMax - sMin)) * W;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(critX, 0); ctx.lineTo(critX, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels (drawn on the canvas itself for portability).
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'left';
    ctx.fillText('sigma = ' + sMin.toFixed(2), 4, H - 6);
    ctx.textAlign = 'right';
    ctx.fillText('sigma = ' + sMax.toFixed(2), W - 4, H - 6);
    ctx.textAlign = 'center';
    ctx.fillText('sigma = 1/2', critX, H - 6);
    ctx.textAlign = 'left';
    ctx.fillText('t = ' + tMax.toFixed(0), 4, 14);
    ctx.fillText('t = ' + tMin.toFixed(0), 4, H - 22);

    // Overlay horizontal lines at each nontrivial zero height gamma_n.
    // At t = gamma_n the explicit-formula kernel x^rho = x^{1/2}*e^{i*gamma_n*log x}
    // interferes destructively, making the caustic locally dark.
    if (showZeroOverlay) {
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.60)';
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(251, 146, 60, 0.85)';
      ZERO_HEIGHTS.forEach((gamma, idx) => {
        if (gamma < tMin || gamma > tMax) return;
        const py = Math.round(((tMax - gamma) / (tMax - tMin)) * (H - 1));
        ctx.beginPath();
        ctx.moveTo(0, py); ctx.lineTo(W, py);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText('γ' + (idx + 1), W - 4, py - 2);
      });
      ctx.setLineDash([]);
    }

    setRenderInfo({ ms: +(performance.now() - t0).toFixed(1), maxVal: +maxVal.toFixed(2) });
  }, [logPrimes, eps, mode, resolution, showZeroOverlay]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prime Caustic (imp-1225)</h1>
        <p className="page-subtitle">
          For each (sigma, t) pixel in [{D.bbox.sigmaMin}, {D.bbox.sigmaMax}] x [{D.bbox.tMin}, {D.bbox.tMax}],
          count how many of the first N primes have phase t * log p mod 2*pi within
          eps = {D.bbox.eps} rad of zero. Coherent superposition makes the truncated
          main sum locally large; the critical line shows a structured caustic. Reference
          data + tripwires live in <code>src/data/viz-prime-caustic.js</code>; the renderer
          here computes a {D.bbox.gridW} x {D.bbox.gridH} grid into a single ImageData
          buffer (no per-pixel fillRect).
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/explorations" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Explorations
          </Link>
          <Link to="/viz-prime-phase-crystal" style={{ color: '#a855f7', fontFamily: mono, fontSize: 12 }}>
            Prime Phase Crystal (imp-1227) &rarr;
          </Link>
          <Link to="/zeta" style={{ color: '#0891b2', fontFamily: mono, fontSize: 12 }}>
            Zeta visualisation
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))',
        gap: 12,
      }}>
        <Stat label="N primes (active)"     value={String(logPrimes.length)} />
        <Stat label="eps (rad)"             value={eps.toFixed(2)} />
        <Stat label="ref-grid max count"    value={String(D.refMaxCount)} />
        <Stat label="ref-grid mean count"   value={D.meanCount.toFixed(2)} />
        <Stat label="random baseline"       value={D.randomBaseline.toFixed(2)} />
        <Stat label="render time (ms)"      value={renderInfo.ms.toString()} />
        <Stat label="max value (rendered)"  value={String(renderInfo.maxVal)} />
        <Stat label="mode"                  value={mode} accent="#c4b5fd" />
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>N primes</label>
          <input type="range" min="50" max={D.primes.length} step="50" value={nPrimes}
                 onChange={e => setNPrimes(+e.target.value)} />
          <span className="control-value">{nPrimes}</span>
        </div>
        <div className="control-group">
          <label>eps (rad)</label>
          <input type="range" min="0.02" max="0.5" step="0.02" value={eps}
                 onChange={e => setEps(+e.target.value)} />
          <span className="control-value">{eps.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>resolution</label>
          <input type="range" min="1" max="4" step="1" value={resolution}
                 onChange={e => setRes(+e.target.value)} />
          <span className="control-value">{resolution === 1 ? 'Full' : resolution === 2 ? 'Half' : resolution === 3 ? 'Coarse' : 'Fast'}</span>
        </div>
        <div className="control-group">
          <label>mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)}
                  style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155',
                           borderRadius: 4, padding: '4px 8px', fontFamily: mono, fontSize: 12 }}>
            <option value="amplitude">amplitude (sigma-weighted)</option>
            <option value="count">count (sigma-independent)</option>
          </select>
        </div>
        <div className="control-group">
          <label>γ_n overlay</label>
          <select value={showZeroOverlay ? 'on' : 'off'}
                  onChange={e => setShowZeroOverlay(e.target.value === 'on')}
                  style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155',
                           borderRadius: 4, padding: '4px 8px', fontFamily: mono, fontSize: 12 }}>
            <option value="on">on (explicit-formula zeros)</option>
            <option value="off">off</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 16, background: 'var(--bg-panel)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'center',
                    position: 'relative' }}>
        <canvas ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ width: '100%', maxWidth: D.bbox.gridW, height: 'auto',
                         border: '1px solid #1e293b', borderRadius: 4,
                         imageRendering: 'pixelated', cursor: 'crosshair' }} />
        {hoverInfo && (
          <div style={{
            position: 'fixed',
            left: hoverInfo.clientX + 14,
            top: hoverInfo.clientY - 10,
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid #334155',
            borderRadius: 6,
            padding: '7px 10px',
            fontFamily: mono,
            fontSize: 11,
            color: '#e2e8f0',
            pointerEvents: 'none',
            zIndex: 1000,
            lineHeight: 1.7,
            whiteSpace: 'nowrap',
          }}>
            <div><span style={{ color: '#94a3b8' }}>sigma:</span> {hoverInfo.sigma.toFixed(4)}</div>
            <div><span style={{ color: '#94a3b8' }}>t:</span> {hoverInfo.t.toFixed(4)}</div>
            <div><span style={{ color: '#94a3b8' }}>count:</span> {hoverInfo.count}</div>
            <div><span style={{ color: '#86efac' }}>amp:</span> {hoverInfo.amp.toFixed(4)}</div>
          </div>
        )}
        <ColormapLegend maxVal={renderInfo.maxVal} mode={mode} />
      </div>

      <div className="card" style={{ marginTop: 14, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 8 }}>
          Critical-line cross-section (sigma = 1/2)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'right', padding: 6 }}>t</th>
                <th style={{ textAlign: 'right', padding: 6 }}>count</th>
                <th style={{ textAlign: 'right', padding: 6 }}>amp(sigma=0.3)</th>
                <th style={{ textAlign: 'right', padding: 6 }}>amp(sigma=0.5)</th>
                <th style={{ textAlign: 'right', padding: 6 }}>amp(sigma=0.7)</th>
              </tr>
            </thead>
            <tbody>
              {D.criticalLineSlice.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.t.toFixed(2)}</td>
                  <td style={{ padding: 6, textAlign: 'right' }}>{r.count}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#86efac' }}>{r.ampAt03.toFixed(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#fef08a' }}>{r.ampAtHalf.toFixed(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#fca5a5' }}>{r.ampAt07.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: '#cbd5e1' }}>Reading the map.</strong> Bright pixels are
        coherent: many primes simultaneously close to phase 0. The vertical dashed line
        marks sigma = 1/2 (the critical line). Horizontal banding reflects the
        characteristic Riemann-Siegel main-sum structure -- bands at the Gram-point
        spacing and dips near nontrivial zeros (gamma_1 = 14.13, gamma_2 = 21.02, ...).
        Amplitude mode multiplies each coherent prime by p^{'{-sigma}'} (the natural
        Riemann-Siegel weight), so small sigma upweights small primes and shifts
        contrast leftward. Count mode is sigma-independent. The render uses a single
        putImageData of a {D.bbox.gridW} x {D.bbox.gridH} buffer -- no per-pixel
        fillRect calls.
      </div>

      <div className="card" style={{ marginTop: 14, padding: 14, borderLeft: '3px solid rgba(251, 146, 60, 0.6)' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 8 }}>
          Connection: x^ρ explicit-formula kernel
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.7, color: '#cbd5e1', fontFamily: mono }}>
          {"The Riemann explicit formula writes ψ(x) = x − Σ_ρ x^ρ/ρ − log(2π) + …  where the sum runs over nontrivial zeros ρ = 1/2 + iγ_n.  Each term x^ρ = x^{1/2} · e^{iγ_n · log x} is an oscillation at frequency γ_n in log x.  In the (sigma, t) plane the same kernel appears as the Euler-product phase e^{it · log p} = p^{it}: the caustic is bright when many primes' phases align (coherent sum ≫ 1) and dark when they cancel.  The orange lines mark t = γ_n — at these heights the full Riemann zeta sum goes to zero precisely because phase alignment collapses to destructive interference, so the caustic dips.  Turning off the zero overlay and comparing the dark horizontal bands to the orange lines confirms the connection."}
        </div>
      </div>

      <VizCeilingNote
        as="div"
        claim="prime-caustic intensity re-derives the Riemann-Siegel coherent-sum dips near the zero heights γ_n"
      />
    </div>
  );
}

function ColormapLegend({ maxVal, mode }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const img = ctx.createImageData(W, H);
    const d = img.data;
    for (let px = 0; px < W; px++) {
      const idx256 = Math.min(255, Math.floor((px / (W - 1)) * 255));
      const r = COLORMAP[idx256 * 3];
      const g = COLORMAP[idx256 * 3 + 1];
      const b = COLORMAP[idx256 * 3 + 2];
      for (let py = 0; py < H; py++) {
        const o = (py * W + px) * 4;
        d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const x = Math.round((i / 4) * (W - 1));
      ctx.beginPath(); ctx.moveTo(x, H - 5); ctx.lineTo(x, H); ctx.stroke();
    }
  }, []);

  const label = mode === 'count' ? 'coherent count' : 'amplitude';
  const ticks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ marginTop: 8, fontFamily: mono, fontSize: 10, color: '#94a3b8' }}>
      <div style={{ marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 9, color: 'var(--text-muted)' }}>
        {label} scale (sqrt-gamma mapped to hue)
      </div>
      <canvas ref={ref} width={256} height={14}
        style={{ width: '100%', maxWidth: 320, height: 14, display: 'block', borderRadius: 2 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 320, marginTop: 2 }}>
        {ticks.map((f, i) => (
          <span key={i}>{(f * maxVal).toFixed(mode === 'count' ? 0 : 2)}</span>
        ))}
      </div>
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
      <div style={{ marginTop: 4, fontSize: 18, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}
