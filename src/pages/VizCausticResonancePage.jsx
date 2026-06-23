// VizCausticResonancePage.jsx -- imp-2724
// Resonance-condition overlay: for each t on the x-axis, plot the number of
// coherent primes (|(t*log p) mod 2pi| < eps) as a waveform, then overlay
// vertical tick-marks at every t satisfying log(p_i/p_j) = 2*pi*k/t, i.e.
// t = 2*pi*k / log(p_j/p_i), for prime pairs (p_i, p_j) with i < j and small k.
//
// These resonance t-values are exactly where two primes "beat together" -- their
// phases simultaneously align -- amplifying the caustic. The overlay lets us
// read off which prime pairs are responsible for each coherent spike.

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPrimes } from '../math/primes.js';

const TWO_PI = 2 * Math.PI;
const mono = 'var(--font-mono)';

const CANVAS_W = 700;
const CANVAS_H = 200;

// Pre-compute first 200 primes once.
const ALL_PRIMES = getPrimes(200);
const ALL_LOG_PRIMES = ALL_PRIMES.map(p => Math.log(p));

// Build resonance-t list for prime pairs (i<j) from the first nPrimes primes,
// k=1..kMax, filtering to [tMin, tMax].
function buildResonanceTicks(nPrimes, kMax, tMin, tMax) {
  const ticks = [];
  for (let j = 1; j < nPrimes; j++) {
    for (let i = 0; i < j; i++) {
      const logRatio = ALL_LOG_PRIMES[j] - ALL_LOG_PRIMES[i]; // log(p_j/p_i) > 0
      for (let k = 1; k <= kMax; k++) {
        const t = (TWO_PI * k) / logRatio;
        if (t >= tMin && t <= tMax) {
          ticks.push({ t, pi: ALL_PRIMES[i], pj: ALL_PRIMES[j], k });
        }
      }
    }
  }
  return ticks;
}

export default function VizCausticResonancePage() {
  const canvasRef = useRef(null);

  const [nPrimes, setNPrimes]   = useState(30);
  const [nPairsShow, setNPairsShow] = useState(10); // pairs used for overlay
  const [eps, setEps]           = useState(0.25);
  const [kMax, setKMax]         = useState(3);
  const [tMin]                  = useState(10);
  const [tMax]                  = useState(50);
  const [showResonance, setShowResonance] = useState(true);
  const [hovered, setHovered]   = useState(null); // nearest resonance tick

  const profileN  = Math.min(nPrimes, ALL_PRIMES.length);
  const pairsN    = Math.min(nPairsShow, profileN);
  const logSlice  = ALL_LOG_PRIMES.slice(0, profileN);

  // Resonance ticks for the overlay (using first pairsN primes).
  const ticks = useMemo(
    () => buildResonanceTicks(pairsN, kMax, tMin, tMax),
    [pairsN, kMax, tMin, tMax]
  );

  // Draw whenever inputs change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background.
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const tRange = tMax - tMin;
    const toX = t => ((t - tMin) / tRange) * CANVAS_W;

    // Compute coherent count at each pixel column.
    const profile = new Float32Array(CANVAS_W);
    let maxCount = 1;
    for (let px = 0; px < CANVAS_W; px++) {
      const t = tMin + (px / (CANVAS_W - 1)) * tRange;
      let c = 0;
      for (let i = 0; i < profileN; i++) {
        let phase = t * logSlice[i];
        phase = phase - TWO_PI * Math.round(phase / TWO_PI);
        if (Math.abs(phase) < eps) c++;
      }
      profile[px] = c;
      if (c > maxCount) maxCount = c;
    }

    // Draw the waveform as a filled curve.
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_H);
    for (let px = 0; px < CANVAS_W; px++) {
      const y = CANVAS_H - (profile[px] / maxCount) * (CANVAS_H - 20);
      ctx.lineTo(px, y);
    }
    ctx.lineTo(CANVAS_W, CANVAS_H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(99,102,241,0.35)';
    ctx.fill();

    ctx.beginPath();
    for (let px = 0; px < CANVAS_W; px++) {
      const y = CANVAS_H - (profile[px] / maxCount) * (CANVAS_H - 20);
      if (px === 0) ctx.moveTo(px, y); else ctx.lineTo(px, y);
    }
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Resonance tick overlay.
    if (showResonance) {
      for (const tick of ticks) {
        const x = toX(tick.t);
        ctx.strokeStyle = tick.k === 1 ? 'rgba(251,191,36,0.70)' :
                          tick.k === 2 ? 'rgba(251,146,60,0.45)' :
                                         'rgba(248,113,113,0.30)';
        ctx.lineWidth = tick.k === 1 ? 1.5 : 1;
        ctx.setLineDash(tick.k === 1 ? [] : [3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Hovered resonance tick highlight.
    if (hovered) {
      const x = toX(hovered.t);
      ctx.strokeStyle = '#f0abfc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }

    // Axis labels.
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(148,163,184,0.8)';
    ctx.textAlign = 'left';
    ctx.fillText('t = ' + tMin, 4, CANVAS_H - 4);
    ctx.textAlign = 'right';
    ctx.fillText('t = ' + tMax, CANVAS_W - 4, CANVAS_H - 4);
    ctx.textAlign = 'center';
    ctx.fillText('coherent count (eps = ' + eps.toFixed(2) + ')', CANVAS_W / 2, 14);

  }, [profileN, logSlice, eps, tMin, tMax, ticks, showResonance, hovered, kMax]);

  // Mouse move: find nearest resonance tick.
  function handleMouseMove(e) {
    if (!showResonance || ticks.length === 0) { setHovered(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const tHit = tMin + xRatio * (tMax - tMin);
    let best = null, bestDist = Infinity;
    for (const tick of ticks) {
      const d = Math.abs(tick.t - tHit);
      if (d < bestDist) { bestDist = d; best = tick; }
    }
    // Only highlight if within ~1 unit of t.
    setHovered(bestDist < 1.0 ? best : null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Caustic Resonance-Condition Overlay (imp-2724)</h1>
        <p className="page-subtitle">
          The waveform shows how many of the first N primes satisfy
          |t&thinsp;log p mod 2&pi;| &lt; &epsilon; at each imaginary height t.
          Vertical lines mark the exact resonance values t&thinsp;=&thinsp;2&pi;k/log(p<sub>j</sub>/p<sub>i</sub>)
          where two primes beat together (solid gold = k=1, dashed orange = k=2, red = k=3).
          Hover the canvas to identify which prime pair a line belongs to.
        </p>
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/viz-prime-caustic" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            &larr; Prime Caustic heatmap
          </Link>
          <Link to="/viz-prime-density-caustic" style={{ color: '#a855f7', fontFamily: mono, fontSize: 12 }}>
            Prime Density on Caustics &rarr;
          </Link>
          <Link to="/explorations" style={{ color: '#64748b', fontFamily: mono, fontSize: 12 }}>
            Explorations
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
      }}>
        <Stat label="N primes (profile)" value={String(profileN)} />
        <Stat label="N primes (overlay)"  value={String(pairsN)} />
        <Stat label="resonance ticks"     value={String(ticks.length)} />
        <Stat label="eps (rad)"            value={eps.toFixed(2)} />
        <Stat label="k-max"               value={String(kMax)} />
        {hovered && (
          <Stat
            label="hovered tick"
            value={"p" + hovered.pi + "/p" + hovered.pj + " k=" + hovered.k}
            accent="#f0abfc"
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>N primes (profile)</label>
          <input type="range" min="10" max={ALL_PRIMES.length} step="10"
                 value={nPrimes} onChange={e => setNPrimes(+e.target.value)} />
          <span className="control-value">{nPrimes}</span>
        </div>
        <div className="control-group">
          <label>N primes (overlay)</label>
          <input type="range" min="2" max={Math.min(30, profileN)} step="1"
                 value={nPairsShow} onChange={e => setNPairsShow(+e.target.value)} />
          <span className="control-value">{nPairsShow}</span>
        </div>
        <div className="control-group">
          <label>eps (rad)</label>
          <input type="range" min="0.05" max="0.6" step="0.05"
                 value={eps} onChange={e => setEps(+e.target.value)} />
          <span className="control-value">{eps.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>k-max</label>
          <input type="range" min="1" max="6" step="1"
                 value={kMax} onChange={e => setKMax(+e.target.value)} />
          <span className="control-value">{kMax}</span>
        </div>
        <div className="control-group" style={{ justifyContent: 'center', gap: 8 }}>
          <label>resonance overlay</label>
          <input type="checkbox" checked={showResonance}
                 onChange={e => setShowResonance(e.target.checked)}
                 style={{ width: 16, height: 16, cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{
        marginTop: 16,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: 12,
        display: 'flex',
        justifyContent: 'center',
        cursor: 'crosshair',
      }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: '100%', maxWidth: CANVAS_W, height: 'auto',
            border: '1px solid #1e293b', borderRadius: 4,
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {hovered && (
        <div className="card" style={{ marginTop: 10, padding: 12 }}>
          <span style={{ fontFamily: mono, fontSize: 12, color: '#f0abfc' }}>
            Resonance: p<sub>i</sub> = {hovered.pi}, p<sub>j</sub> = {hovered.pj},
            k = {hovered.k},
            t = {hovered.t.toFixed(4)},
            log(p<sub>j</sub>/p<sub>i</sub>) = {(Math.log(hovered.pj / hovered.pi)).toFixed(6)},
            2&pi;k / log(p<sub>j</sub>/p<sub>i</sub>) = {((TWO_PI * hovered.k) / Math.log(hovered.pj / hovered.pi)).toFixed(4)}
          </span>
        </div>
      )}

      <div className="card" style={{ marginTop: 14, padding: 14 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: 0.5, marginBottom: 8 }}>
          Top resonance ticks (k = 1, first pairs)
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: mono }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                <th style={{ textAlign: 'right', padding: 6 }}>p_i</th>
                <th style={{ textAlign: 'right', padding: 6 }}>p_j</th>
                <th style={{ textAlign: 'right', padding: 6 }}>k</th>
                <th style={{ textAlign: 'right', padding: 6 }}>t = 2pk/log(pj/pi)</th>
                <th style={{ textAlign: 'right', padding: 6 }}>log(pj/pi)</th>
              </tr>
            </thead>
            <tbody>
              {ticks.filter(r => r.k === 1).slice(0, 20).map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.pi}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#a855f7' }}>{r.pj}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#fbbf24' }}>{r.k}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#86efac' }}>{r.t.toFixed(4)}</td>
                  <td style={{ padding: 6, textAlign: 'right', color: '#94a3b8' }}>
                    {Math.log(r.pj / r.pi).toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.8 }}>
        <strong style={{ color: '#cbd5e1' }}>Reading the chart.</strong>{' '}
        Each spike in the waveform is a coherence event: many primes
        simultaneously have phase close to 0 at this t. The resonance-condition
        ticks (vertical lines) land exactly where two primes beat together,
        creating a forced constructive-interference event. Solid gold ticks
        (k = 1) are the strongest; dashed orange/red are higher harmonics.
        Increase k-max to see how the caustic structure is built up from
        overlapping resonance lattices. The critical insight is that each
        spike can be decomposed into contributions from a small number of
        nearby resonance ticks -- the primes are not truly random at these t.
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
      <div style={{ marginTop: 4, fontSize: 16, fontFamily: mono, color: accent || '#e2e8f0' }}>
        {value}
      </div>
    </div>
  );
}
