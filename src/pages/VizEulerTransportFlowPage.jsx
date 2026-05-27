import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import {
  VIZ_EULER_TRANSPORT_FLOW,
  computeEulerLogDerivative,
} from '../data/viz-euler-transport-flow.js';

/**
 * VizEulerTransportFlowPage — imp-1224.
 *
 * Visualizes the negative log-derivative vector field
 *   v(s) = -zeta'(s)/zeta(s) = sum_p (log p) / (p^s - 1)
 * by integrating the streamlines of -v on a (sigma, t) viewport that
 * straddles the critical strip. Zeros of zeta appear as SINKS of -v;
 * the first five known zeros are marked as red dots on sigma = 1/2.
 *
 * Honest scope: inside the critical strip the truncated prime sum is a
 * numerical proxy (does not converge absolutely). Streamlines there are
 * qualitative, not quantitative.
 */

const V = VIZ_EULER_TRANSPORT_FLOW;
const { gridDomain, canvasSize } = V.vectorField;
const CW = canvasSize.width;
const CH = canvasSize.height;

// Linear mappings between (sigma, t) and (px, py).
function sigmaToX(sigma) {
  return ((sigma - gridDomain.sigmaMin) / (gridDomain.sigmaMax - gridDomain.sigmaMin)) * CW;
}
function tToY(t) {
  // Invert y: bigger t at the top of the canvas.
  return CH - ((t - gridDomain.tMin) / (gridDomain.tMax - gridDomain.tMin)) * CH;
}

// RK2 midpoint integrator for d/dtau (sigma, t) = -v_unit(sigma, t).
function integrateStreamline(seedSigma, seedT, primeCount, steps, ds) {
  const path = [{ sigma: seedSigma, t: seedT }];
  let sigma = seedSigma;
  let t = seedT;
  for (let i = 0; i < steps; i++) {
    const v1 = computeEulerLogDerivative(sigma, t, primeCount);
    const mag1 = Math.hypot(v1.re, v1.im);
    if (!Number.isFinite(mag1) || mag1 < 1e-12) break;
    const dx1 = -v1.re / mag1;
    const dy1 = -v1.im / mag1;
    // RK2 midpoint
    const sigmaMid = sigma + 0.5 * ds * dx1;
    const tMid = t + 0.5 * ds * dy1;
    const v2 = computeEulerLogDerivative(sigmaMid, tMid, primeCount);
    const mag2 = Math.hypot(v2.re, v2.im);
    if (!Number.isFinite(mag2) || mag2 < 1e-12) break;
    const dx = -v2.re / mag2;
    const dy = -v2.im / mag2;
    sigma += ds * dx;
    t += ds * dy;
    if (
      sigma < gridDomain.sigmaMin ||
      sigma > gridDomain.sigmaMax ||
      t < gridDomain.tMin ||
      t > gridDomain.tMax ||
      !Number.isFinite(sigma) ||
      !Number.isFinite(t)
    ) {
      break;
    }
    path.push({ sigma, t });
  }
  return path;
}

// Build the seed grid: deterministic, well-spread fan of points avoiding the boundary.
function buildSeeds() {
  const seeds = [];
  const cols = 10;
  const rows = 10;
  const sigmaPad = 0.05 * (gridDomain.sigmaMax - gridDomain.sigmaMin);
  const tPad = 0.04 * (gridDomain.tMax - gridDomain.tMin);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const sigma =
        gridDomain.sigmaMin + sigmaPad +
        ((i + 0.5) / cols) * (gridDomain.sigmaMax - gridDomain.sigmaMin - 2 * sigmaPad);
      const t =
        gridDomain.tMin + tPad +
        ((j + 0.5) / rows) * (gridDomain.tMax - gridDomain.tMin - 2 * tPad);
      seeds.push({ sigma, t });
    }
  }
  return seeds; // exactly 100
}

function Card({ children, accent = '#1e293b' }) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.7)',
        border: `1px solid ${accent}`,
        borderRadius: 10,
        padding: '18px 22px',
        margin: '16px 0',
      }}
    >
      {children}
    </div>
  );
}

function FlowCanvas({ primeCount, showGrid, showDensity }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState({ done: 0, total: 100 });
  const [streamlines, setStreamlines] = useState([]);

  // Recompute streamlines when prime count changes.
  useEffect(() => {
    let cancelled = false;
    setStreamlines([]);
    setProgress({ done: 0, total: 100 });
    const seeds = buildSeeds();
    const all = [];

    // Defer work so the spinner can render before the loop blocks the main thread.
    const work = async () => {
      for (let i = 0; i < seeds.length; i++) {
        if (cancelled) return;
        const path = integrateStreamline(seeds[i].sigma, seeds[i].t, primeCount, 200, 0.05);
        all.push(path);
        if (i % 10 === 9) {
          setProgress({ done: i + 1, total: seeds.length });
          // Yield to the event loop so React can repaint.
          await new Promise((res) => setTimeout(res, 0));
        }
      }
      if (cancelled) return;
      setProgress({ done: seeds.length, total: seeds.length });
      setStreamlines(all);
    };
    work();

    return () => {
      cancelled = true;
    };
  }, [primeCount]);

  // Draw whenever streamlines / toggles change.
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, CW, CH);

    // Background.
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, CW, CH);

    // Optional grid background.
    if (showGrid) {
      ctx.strokeStyle = 'rgba(100,116,139,0.18)';
      ctx.lineWidth = 1;
      // Vertical grid every 0.1 in sigma.
      for (let s = Math.ceil(gridDomain.sigmaMin * 10) / 10; s < gridDomain.sigmaMax; s += 0.1) {
        const x = sigmaToX(s);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CH);
        ctx.stroke();
      }
      // Horizontal grid every 5 in t.
      for (let t = 5; t < gridDomain.tMax; t += 5) {
        const y = tToY(t);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CW, y);
        ctx.stroke();
      }
      // Critical line sigma = 1/2 highlighted.
      ctx.strokeStyle = 'rgba(96,165,250,0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sigmaToX(0.5), 0);
      ctx.lineTo(sigmaToX(0.5), CH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Build density map (cells of ~8px) if requested.
    let density = null;
    const cellPx = 8;
    const dCols = Math.ceil(CW / cellPx);
    const dRows = Math.ceil(CH / cellPx);
    if (showDensity) {
      density = new Uint16Array(dCols * dRows);
      for (const path of streamlines) {
        for (const pt of path) {
          const x = sigmaToX(pt.sigma);
          const y = tToY(pt.t);
          const ci = Math.max(0, Math.min(dCols - 1, Math.floor(x / cellPx)));
          const ri = Math.max(0, Math.min(dRows - 1, Math.floor(y / cellPx)));
          density[ri * dCols + ci]++;
        }
      }
      // Find max for normalization.
      let maxD = 1;
      for (let k = 0; k < density.length; k++) if (density[k] > maxD) maxD = density[k];
      // Paint cells as a translucent magma-like ramp.
      for (let ri = 0; ri < dRows; ri++) {
        for (let ci = 0; ci < dCols; ci++) {
          const d = density[ri * dCols + ci];
          if (d === 0) continue;
          const u = d / maxD; // [0, 1]
          // Simple magenta-orange ramp.
          const r = Math.round(40 + 215 * u);
          const g = Math.round(20 + 80 * u);
          const b = Math.round(80 - 60 * u);
          ctx.fillStyle = `rgba(${r},${g},${b},${0.18 + 0.45 * u})`;
          ctx.fillRect(ci * cellPx, ri * cellPx, cellPx, cellPx);
        }
      }
    }

    // Draw streamlines.
    ctx.lineWidth = 1.1;
    for (const path of streamlines) {
      if (path.length < 2) continue;
      ctx.strokeStyle = showDensity ? 'rgba(226,232,240,0.55)' : 'rgba(56,189,248,0.65)';
      ctx.beginPath();
      ctx.moveTo(sigmaToX(path[0].sigma), tToY(path[0].t));
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(sigmaToX(path[i].sigma), tToY(path[i].t));
      }
      ctx.stroke();
      // Mark endpoint to show sink convergence.
      const end = path[path.length - 1];
      ctx.fillStyle = 'rgba(250,204,21,0.85)';
      ctx.beginPath();
      ctx.arc(sigmaToX(end.sigma), tToY(end.t), 1.4, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Mark first 5 known zeros on critical line as red dots.
    for (const gamma of V.knownZeros) {
      const x = sigmaToX(0.5);
      const y = tToY(gamma);
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#fef2f2';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      // Label.
      ctx.fillStyle = '#fecaca';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`γ ≈ ${gamma.toFixed(2)}`, x + 8, y + 3);
    }

    // Axes labels.
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`σ ∈ [${gridDomain.sigmaMin}, ${gridDomain.sigmaMax}]`, 8, CH - 10);
    ctx.textAlign = 'right';
    ctx.fillText(`t ∈ [${gridDomain.tMin}, ${gridDomain.tMax}]`, CW - 8, CH - 10);
  }, [streamlines, showGrid, showDensity]);

  const pct = Math.round((progress.done / progress.total) * 100);
  const computing = progress.done < progress.total;

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{
          width: '100%',
          maxWidth: CW,
          height: 'auto',
          borderRadius: 8,
          background: '#0b1220',
          display: 'block',
        }}
      />
      {computing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(2,6,23,0.45)',
            borderRadius: 8,
            color: '#cbd5e1',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
          }}
        >
          integrating streamlines… {pct}%
        </div>
      )}
    </div>
  );
}

export default function VizEulerTransportFlowPage() {
  const [primeCount, setPrimeCount] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showDensity, setShowDensity] = useState(false);

  const choices = useMemo(() => V.vectorField.primeCountChoices, []);

  return (
    <main style={{ maxWidth: 980, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: 18, marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: '#64748b',
            fontFamily: 'var(--font-mono, monospace)',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {V.route} · {V.ticket} · viz
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', margin: '8px 0 4px 0' }}>
          {V.title}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '8px 0 0 0', lineHeight: 1.6 }}>
          {V.oneLine}
        </p>
      </header>

      <Card>
        <h3 style={{ color: '#60a5fa', fontSize: 17, margin: '0 0 10px 0' }}>The vector field</h3>
        <BlockMath math="v(s) \;=\; -\frac{\zeta'(s)}{\zeta(s)} \;=\; \sum_{p} \frac{\log p}{p^{\,s} - 1}, \qquad \mathfrak{R}(s) > 1." />
        <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.65 }}>
          Read <InlineMath math="v(\sigma+it) = u + iw" /> as a planar vector field on{' '}
          <InlineMath math="(\sigma, t)" />. Streamlines below integrate the NEGATIVE flow{' '}
          <InlineMath math="\dot{(\sigma,t)} = -v" />, for which the nontrivial zeros of{' '}
          <InlineMath math="\zeta" /> are <strong style={{ color: '#fca5a5' }}>simple sinks</strong>{' '}
          (residue +1 of <InlineMath math="v" /> ⇒ residue −1 of <InlineMath math="-v" />).
        </p>
      </Card>

      <Card>
        <div
          style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            alignItems: 'end',
            marginBottom: 14,
          }}
        >
          <label
            style={{
              color: '#94a3b8',
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            prime count: {primeCount}
            <input
              type="range"
              min={0}
              max={choices.length - 1}
              step={1}
              value={choices.indexOf(primeCount)}
              onChange={(e) => setPrimeCount(choices[parseInt(e.target.value, 10)])}
              style={{ width: '100%' }}
            />
            <span style={{ color: '#64748b', fontSize: 11 }}>
              choices: {choices.join(' / ')}
            </span>
          </label>
          <label
            style={{
              color: '#94a3b8',
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            grid background + critical line
          </label>
          <label
            style={{
              color: '#94a3b8',
              fontSize: 13,
              fontFamily: 'var(--font-mono, monospace)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              checked={showDensity}
              onChange={(e) => setShowDensity(e.target.checked)}
            />
            streamline-density colormap
          </label>
        </div>
        <FlowCanvas
          primeCount={primeCount}
          showGrid={showGrid}
          showDensity={showDensity}
        />
        <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 10, lineHeight: 1.55 }}>
          100 seed points · RK2 step Δs = 0.05 · 200 steps each · yellow dots mark streamline
          endpoints (accumulation toward sinks) · red dots are the first 5 known nontrivial zeros on
          the critical line σ = 1/2.
        </p>
      </Card>

      <Card accent="#7c3aed">
        <h3 style={{ color: '#a78bfa', fontSize: 17, margin: '0 0 10px 0' }}>Why zeros are sinks</h3>
        <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.65 }}>
          Near a simple zero <InlineMath math="\rho" /> of <InlineMath math="\zeta" /> we have{' '}
          <InlineMath math="\zeta(s) = c(s-\rho) + O((s-\rho)^2)" />, so{' '}
          <InlineMath math="v(s) = -\zeta'(s)/\zeta(s) = -\tfrac{1}{s-\rho} + O(1)" />.
          In the local complex coordinate <InlineMath math="z = s - \rho" />,{' '}
          <InlineMath math="-v(s) \approx +1/\bar{z}" /> (after the standard identification of{' '}
          <InlineMath math="\mathbb{C}" /> with <InlineMath math="\mathbb{R}^2" />), which is a
          radial inward flow. So <em>every nontrivial zero is a sink of <InlineMath math="-v" /></em>;
          conversely the simple pole of <InlineMath math="\zeta" /> at{' '}
          <InlineMath math="s=1" /> appears as a source.
        </p>
      </Card>

      <Card accent="#fbbf24">
        <h3 style={{ color: '#fbbf24', fontSize: 17, margin: '0 0 10px 0' }}>Honest scope</h3>
        <ul
          style={{
            color: '#cbd5e1',
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
            paddingLeft: 22,
          }}
        >
          {V.caveats.map((c, i) => (
            <li key={i} style={{ marginBottom: 6 }}>
              {c}
            </li>
          ))}
        </ul>
      </Card>

      <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
          Related visualizations:
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/zeta" style={{ color: '#60a5fa', fontSize: 13 }}>/zeta</Link>
          <Link to="/gram-points" style={{ color: '#60a5fa', fontSize: 13 }}>/gram-points</Link>
          <Link to="/hardy-z" style={{ color: '#60a5fa', fontSize: 13 }}>/hardy-z</Link>
          <Link to="/fourier" style={{ color: '#60a5fa', fontSize: 13 }}>/fourier</Link>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: '#475569',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          source: src/data/viz-euler-transport-flow.js · ticket {V.ticket}
        </div>
      </footer>
    </main>
  );
}
