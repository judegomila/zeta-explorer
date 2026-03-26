import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  liCoefficients, hamiltonianConvexityTest, sMatrixZeroConfinement,
  deBruijnNewmanScan, weilPositivityTest, proofGapAnalysis, zeroDeviationScan,
} from '../math/rh-attack.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';

const TABS = ['Li Coefficients', 'Hamiltonian', 'S-Matrix', 'Heat Flow', 'Proof Map'];

// ─── Tab 1: Li Coefficients ──────────────────────────────────────────────────

function LiCoefficientsTab() {
  const [maxN, setMaxN] = useState(20);
  const [numZeros, setNumZeros] = useState(100);
  const canvasRef = useRef();

  const data = useMemo(() => liCoefficients(maxN, numZeros), [maxN, numZeros]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const lambdas = data.lambdas;
    if (lambdas.length === 0) return;

    // Use log scale for y
    const logValues = lambdas.map(l => l.logLambda !== null ? l.logLambda : -10);
    const minLog = Math.min(...logValues) - 1;
    const maxLog = Math.max(...logValues) + 1;
    const yRange = maxLog - minLog;

    // Zero line
    const zeroY = h - margin.bottom - (0 - minLog) / yRange * plotH;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(w - margin.right, zeroY);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText('λ = 1 (log₁₀ λ = 0)', margin.left + 4, zeroY - 4);

    // Bars
    const barW = Math.min(plotW / lambdas.length * 0.7, 30);
    lambdas.forEach((l, i) => {
      const x = margin.left + (i + 0.5) / lambdas.length * plotW;
      const logVal = l.logLambda !== null ? l.logLambda : -10;
      const valueY = h - margin.bottom - (logVal - minLog) / yRange * plotH;
      const barTop = Math.min(valueY, zeroY);
      const barHeight = Math.abs(valueY - zeroY);

      ctx.fillStyle = l.positive ? '#10b981' : '#ef4444';
      ctx.fillRect(x - barW / 2, barTop, barW, barHeight);

      // Label every few bars
      if (i % Math.max(1, Math.floor(lambdas.length / 15)) === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(`${l.n}`, x, h - margin.bottom + 12);
      }
    });

    // Y-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = minLog + (i / yTicks) * yRange;
      const y = h - margin.bottom - (i / yTicks) * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('n', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('log₁₀(λ_n)', 0, 0);
    ctx.restore();

  }, [data]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        <p style={{ margin: '0 0 8px' }}>
          Li's criterion: RH is equivalent to all <InlineMath tex={"\\lambda_n \\geq 0"} />, where:
        </p>
        <BlockMath tex={"\\lambda_n = \\sum_{\\rho} \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^{\\!n}\\right]"} />
        <p style={{ margin: '8px 0' }}>
          Using the first <em>N</em> known zeros gives a finite approximation.
          On a log scale, positive <InlineMath tex={"\\lambda_n"} /> appear above the red zero-line;
          all bars above = consistent with RH.
        </p>
        <p style={{ margin: '4px 0 0' }}>
          <strong>Look for:</strong> all bars above the zero-line, growing roughly linearly in log scale.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
        <div className="control-group">
          <label>Max n</label>
          <input type="range" min="5" max="40" step="1" value={maxN}
            onChange={e => setMaxN(+e.target.value)} />
          <span className="control-value">{maxN}</span>
        </div>
        <div className="control-group">
          <label>Zeros used</label>
          <input type="range" min="20" max="650" step="10" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
          <span style={{ color: '#64748b', fontSize: 11, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
            (γ<sub>max</sub> ≈ {ZETA_ZEROS[Math.min(numZeros, ZETA_ZEROS.length) - 1]?.toFixed(1) ?? '?'})
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.allPositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${data.allPositive ? '#10b981' : '#ef4444'}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.allPositive ? '#10b981' : '#ef4444' }}>
          {data.verdict}
        </strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          Using {data.numZerosUsed} known zeros. Li's criterion: λ_n {'>'} 0 for all n ≥ 1 ⟺ RH.
          Computing from finitely many zeros only verifies consistency, not proof.
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Hamiltonian Convexity ────────────────────────────────────────────

function HamiltonianTab() {
  const [numPrimes, setNumPrimes] = useState(10);
  const canvasRef = useRef();

  const tValues = useMemo(() => {
    // Test at known zeros and midpoints
    const vals = [];
    for (let i = 0; i < 8; i++) vals.push(ZETA_ZEROS[i]);
    for (let i = 0; i < 4; i++) vals.push((ZETA_ZEROS[i] + ZETA_ZEROS[i + 1]) / 2);
    return vals.sort((a, b) => a - b);
  }, []);

  const data = useMemo(() => hamiltonianConvexityTest(tValues, numPrimes), [tValues, numPrimes]);

  const scales = useMemo(() => {
    const results = data.results;
    const maxD2H = Math.max(...results.map(r => Math.abs(r.d2H_dSigma2)), 1);
    const tMin = Math.min(...results.map(r => r.t));
    const tMax = Math.max(...results.map(r => r.t));
    const maxDH = Math.max(...results.map(r => Math.abs(r.dH_dSigma)), 0.1);
    return { maxD2H, tMin, tMax, maxDH };
  }, [data]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;
    const results = data.results;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Plot d²H/dσ² vs t
    const { maxD2H, tMin, tMax, maxDH } = scales;

    // Zero line
    const zeroY = h - margin.bottom - plotH / 2;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(w - margin.right, zeroY);
    ctx.strokeStyle = '#475569';
    ctx.stroke();
    ctx.setLineDash([]);

    // d²H/dσ² curve
    ctx.beginPath();
    results.forEach((r, i) => {
      const x = margin.left + ((r.t - tMin) / (tMax - tMin)) * plotW;
      const y = zeroY - (r.d2H_dSigma2 / maxD2H) * plotH * 0.4;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points colored by convexity
    results.forEach(r => {
      const x = margin.left + ((r.t - tMin) / (tMax - tMin)) * plotW;
      const y = zeroY - (r.d2H_dSigma2 / maxD2H) * plotH * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = r.isMinimum ? '#10b981' : r.isConvex ? '#f59e0b' : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#0a0e1a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // dH/dσ curve (should be near zero)
    ctx.beginPath();
    results.forEach((r, i) => {
      const x = margin.left + ((r.t - tMin) / (tMax - tMin)) * plotW;
      const y = zeroY - (r.dH_dSigma / maxDH) * plotH * 0.15;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mark known zeros on t-axis
    for (let i = 0; i < 8; i++) {
      const gamma = ZETA_ZEROS[i];
      if (gamma >= tMin && gamma <= tMax) {
        const x = margin.left + ((gamma - tMin) / (tMax - tMin)) * plotW;
        ctx.beginPath();
        ctx.setLineDash([2, 2]);
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, h - margin.bottom);
        ctx.strokeStyle = '#ef444440';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Y-axis tick labels for ∂²H/∂σ²
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTickCount = 4;
    for (let i = -yTickCount; i <= yTickCount; i++) {
      const frac = i / yTickCount;
      const val = frac * maxD2H;
      const y = zeroY - frac * plotH * 0.4;
      if (y < margin.top || y > h - margin.bottom) continue;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      if (i !== 0) {
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + 4, y);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('t', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.fillText('∂²H/∂σ²', 0, 0);
    ctx.restore();

    // Legend
    [
      { color: '#3b82f6', label: '∂²H/∂σ² (convexity)' },
      { color: '#f59e0b', label: '∂H/∂σ (stationarity)' },
    ].forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(margin.left + 8, margin.top + 4 + i * 14, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, margin.left + 24, margin.top + 8 + i * 14);
    });

  }, [data, scales]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        Tests whether the oscillator Hamiltonian <InlineMath tex={"\\mathcal{H}(\\sigma, t)"} /> has a genuine
        minimum at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for each <InlineMath tex="t" />. The blue curve
        shows <InlineMath tex={"\\partial^2 \\mathcal{H}/\\partial\\sigma^2"} /> (convexity) and the amber curve shows{' '}
        <InlineMath tex={"\\partial \\mathcal{H}/\\partial\\sigma"} /> (stationarity). Green dots = confirmed minimum
        (convex + stationary), amber = convex but not stationary, red = not convex. Vertical dashed lines mark
        known zeta zeros <InlineMath tex={"\\gamma_n"} />.
        <strong> Look for:</strong> all dots green, confirming <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> is a minimum at every tested <InlineMath tex="t" />.
      </div>
      <div className="control-group" style={{ marginBottom: 12 }}>
        <label>Primes</label>
        <input type="range" min="4" max="20" step="1" value={numPrimes}
          onChange={e => setNumPrimes(+e.target.value)} />
        <span className="control-value">{numPrimes} <span style={{ color: '#64748b', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.allMinima ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
        border: `1px solid ${data.allMinima ? '#10b981' : '#f59e0b'}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.allMinima ? '#10b981' : '#f59e0b' }}>
          {data.verdict}
        </strong>
        <div style={{ color: '#ef4444', marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          GAP: {data.gap}
        </div>
      </div>
      {/* Results table */}
      <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', fontSize: 11, color: '#94a3b8', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>t</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>∂H/∂σ</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>∂²H/∂σ²</th>
              <th style={{ textAlign: 'center', padding: '4px 8px' }}>Minimum?</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map(r => (
              <tr key={r.t} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)' }}>{r.t.toFixed(2)}</td>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                  color: Math.abs(r.dH_dSigma) < 0.1 ? '#10b981' : '#f59e0b' }}>
                  {r.dH_dSigma.toFixed(4)}
                </td>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                  color: r.isConvex ? '#10b981' : '#ef4444' }}>
                  {r.d2H_dSigma2.toFixed(2)}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  {r.isMinimum
                    ? <span style={{ color: '#10b981' }}>Yes</span>
                    : <span style={{ color: '#ef4444' }}>No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 3: S-Matrix Zeros ───────────────────────────────────────────────────

function SMatrixTab() {
  const canvasRef = useRef();

  const tValues = useMemo(() => {
    const vals = [];
    for (let i = 0; i < 6; i++) vals.push(ZETA_ZEROS[i]);
    vals.push(17.5, 23, 28, 35); // non-zero points
    return vals.sort((a, b) => a - b);
  }, []);

  const data = useMemo(() => sMatrixZeroConfinement(tValues, 15), [tValues]);
  const zeroData = useMemo(() => zeroDeviationScan(20, 12), []);

  const sMatrixScales = useMemo(() => {
    const results = data.results;
    const maxT = Math.max(...results.map(r => r.t));
    const minT = Math.min(...results.map(r => r.t));
    const maxMag = Math.max(...results.map(r => r.transmission), 5);
    return { maxT, minT, maxMag };
  }, [data]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Plot |ζ| at σ=0.5 for each t, and bridge magnitude
    const { maxT, minT, maxMag } = sMatrixScales;

    // Bar for each t
    const barW = plotW / data.results.length * 0.6;
    data.results.forEach((r, i) => {
      const x = margin.left + (i + 0.5) / data.results.length * plotW;
      const barH = (r.transmission / maxMag) * plotH * 0.8;
      const barY = h - margin.bottom - barH;

      // Transmission bar
      ctx.fillStyle = r.nearZero ? '#ef4444' : '#3b82f6';
      ctx.fillRect(x - barW / 2, barY, barW * 0.5, barH);

      // Bridge magnitude indicator
      const bridgeH = (r.bridgeMagnitude / 2) * plotH * 0.8;
      ctx.fillStyle = r.bridgeUnitary ? '#10b98180' : '#f59e0b80';
      ctx.fillRect(x + 2, h - margin.bottom - bridgeH, barW * 0.3, bridgeH);

      // Label
      ctx.fillStyle = '#64748b';
      ctx.font = '8px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(r.t.toFixed(1), x, h - margin.bottom + 12);

      if (r.nearZero) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('ZERO', x, barY - 4);
      }
    });

    // Y-axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (i / yTicks) * maxMag;
      const y = h - margin.bottom - (val / maxMag) * plotH * 0.8;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      if (i > 0) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(margin.left, y);
        ctx.lineTo(w - margin.right, y);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('t (imaginary part)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude', 0, 0);
    ctx.restore();

    // Legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(margin.left + 8, margin.top + 4, 12, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('|ζ(½+it)| (transmission)', margin.left + 24, margin.top + 12);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(margin.left + 8, margin.top + 18, 12, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('|χ| (bridge unitarity)', margin.left + 24, margin.top + 26);

  }, [data, sMatrixScales]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        The S-matrix / Darlington synthesis models <InlineMath tex={"\zeta(s)"} /> as the transmission coefficient of
        a lossless scattering network. At known zeros (red bars), <InlineMath tex={"|\zeta(\tfrac{1}{2}+it)| \to 0"} /> (no
        transmission), while the bridge function <InlineMath tex={"|\chi| = 1"} /> (fully unitary). At non-zero
        frequencies (blue bars), transmission is nonzero. The zero deviation table below cross-checks each
        known <InlineMath tex={"\gamma_n"} /> against the Riemann&ndash;Siegel formula.
        <strong> Look for:</strong> red "ZERO" labels only at known <InlineMath tex={"\gamma_n"} />;
        green bridge bars reaching full height (unitarity).
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: 'rgba(59,130,246,0.08)',
        border: '1px solid #3b82f640',
        fontSize: 12,
      }}>
        <strong style={{ color: '#3b82f6' }}>Darlington Zero Confinement</strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          At known zeros (red bars), the transmission coefficient |ζ(½+it)| vanishes while the
          bridge |χ| = 1 (unitary). At non-zeros (blue bars), transmission is non-zero.
          The bridge is always unitary at σ = ½ regardless of t.
        </div>
        <div style={{ color: '#ef4444', marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          GAP: {data.gap}
        </div>
      </div>
      {/* Zero deviation table */}
      <div style={{ marginTop: 12 }}>
        <h4 style={{ fontSize: 12, color: '#f59e0b', marginBottom: 8 }}>Zero Consistency Check</h4>
        <div style={{ maxHeight: 180, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 10, color: '#94a3b8', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ textAlign: 'left', padding: '3px 6px' }}>γ</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>|ζ|</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>|χ|</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>Z mismatch</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>E balance</th>
              </tr>
            </thead>
            <tbody>
              {zeroData.slice(0, 15).map(r => (
                <tr key={r.gamma} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)' }}>{r.gamma.toFixed(2)}</td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.zetaMagnitude < 0.1 ? '#10b981' : '#f59e0b' }}>
                    {r.zetaMagnitude.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.bridgeUnitary ? '#10b981' : '#f59e0b' }}>
                    {r.bridgeMagnitude.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {r.impedanceMismatch.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.energyBalance < 0.01 ? '#10b981' : '#f59e0b' }}>
                    {r.energyBalance.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: de Bruijn–Newman Heat Flow ───────────────────────────────────────

function HeatFlowTab() {
  const canvasRef = useRef();
  const [tauIdx, setTauIdx] = useState(2); // index into tauValues, default τ = 0

  const tauValues = [-0.1, -0.01, 0, 0.01, 0.1];
  const data = useMemo(() => deBruijnNewmanScan([12, 50], 300, tauValues), []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const margin = { left: 50, right: 20, top: 30, bottom: 40 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const tauColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    // Compute shared y-scale across all tau curves so amplitude differences are visible
    let globalMaxVal = 1;
    tauValues.forEach((tau) => {
      const curveData = data.results[tau];
      if (!curveData) return;
      const m = Math.max(...curveData.curve.map(p => Math.abs(p.value)));
      if (m > globalMaxVal) globalMaxVal = m;
    });

    // Draw each tau curve
    tauValues.forEach((tau, tIdx) => {
      const curveData = data.results[tau];
      if (!curveData) return;
      const curve = curveData.curve;
      const tMin = curve[0].t;
      const tMax = curve[curve.length - 1].t;

      const isActive = tIdx === tauIdx;
      const midY = margin.top + plotH / 2;

      ctx.beginPath();
      curve.forEach((p, i) => {
        const x = margin.left + ((p.t - tMin) / (tMax - tMin)) * plotW;
        const y = midY - (p.value / globalMaxVal) * plotH * 0.4;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = tauColors[tIdx];
      ctx.lineWidth = isActive ? 2.5 : 0.8;
      ctx.globalAlpha = isActive ? 1 : 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Zero line
    const midY = margin.top + plotH / 2;
    ctx.beginPath();
    ctx.setLineDash([4, 3]);
    ctx.moveTo(margin.left, midY);
    ctx.lineTo(w - margin.right, midY);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Mark known zeros
    const curve0 = data.results[0]?.curve;
    if (curve0) {
      const tMin = curve0[0].t;
      const tMax = curve0[curve0.length - 1].t;
      ZETA_ZEROS.slice(0, 10).forEach(gamma => {
        if (gamma >= tMin && gamma <= tMax) {
          const x = margin.left + ((gamma - tMin) / (tMax - tMin)) * plotW;
          ctx.beginPath();
          ctx.arc(x, midY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        }
      });
    }

    // Legend
    tauValues.forEach((tau, i) => {
      const y = margin.top + 4 + i * 14;
      ctx.fillStyle = tauColors[i];
      ctx.fillRect(w - margin.right - 140, y, 12, 3);
      ctx.fillStyle = i === tauIdx ? '#e2e8f0' : '#64748b';
      ctx.font = `${i === tauIdx ? 'bold ' : ''}9px var(--font-mono)`;
      ctx.textAlign = 'left';
      ctx.fillText(`τ = ${tau}`, w - margin.right - 124, y + 4);
    });

    // Y-axis tick labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const frac = i / yTicks;
      const val = globalMaxVal * (1 - 2 * frac); // from +max to -max
      const y = margin.top + frac * plotH;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      // Gridline
      if (i > 0 && i < yTicks) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(margin.left, y);
        ctx.lineTo(w - margin.right, y);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Y-axis label
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Hτ(t)', 0, 0);
    ctx.restore();

    // X-axis tick labels
    if (curve0) {
      const tMin = curve0[0].t;
      const tMax = curve0[curve0.length - 1].t;
      const xTicks = 5;
      for (let i = 0; i <= xTicks; i++) {
        const tVal = tMin + (i / xTicks) * (tMax - tMin);
        const x = margin.left + (i / xTicks) * plotW;
        ctx.fillStyle = '#64748b';
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(tVal.toFixed(0), x, h - margin.bottom + 14);
      }
    }

    // X-axis label
    ctx.fillStyle = '#64748b';
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('t', w / 2, h - 4);

  }, [data, tauIdx]);

  useEffect(() => {
    draw();
    const onResize = () => draw();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [draw]);

  const activeTau = tauValues[tauIdx];
  const activeData = data.results[activeTau];

  return (
    <div>
      <div className="tab-explainer accent-yellow">
        The de Bruijn&ndash;Newman constant <InlineMath tex={"\Lambda"} /> controls how the <InlineMath tex={"\Xi"} /> function
        behaves under heat flow: <InlineMath tex={"H_\tau(t)"} /> has only real zeros for{' '}
        <InlineMath tex={"\tau \geq \Lambda"} />. Rodgers&ndash;Tao (2020) proved <InlineMath tex={"\Lambda \geq 0"} />;
        RH is equivalent to <InlineMath tex={"\Lambda \leq 0"} />, hence <InlineMath tex={"\Lambda = 0"} />. Each curve
        shows <InlineMath tex={"H_\tau(t)"} /> for a different heat time <InlineMath tex={"\tau"} />. Red dots mark
        known zeta zeros on the <InlineMath tex={"\tau = 0"} /> curve.
        <strong> Look for:</strong> zero crossings aligning with known zeros at <InlineMath tex={"\tau = 0"} />;
        zeros coalescing as <InlineMath tex={"\tau"} /> increases.
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {tauValues.map((tau, i) => (
          <button key={tau}
            className={`filter-btn ${tauIdx === i ? 'active' : ''}`}
            onClick={() => setTauIdx(i)}
            style={{
              fontSize: 11,
              borderColor: tauIdx === i ? ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i] : undefined,
            }}
          >τ = {tau}</button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a', border: '1px solid #1e293b' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: '#10b981', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {activeData?.zeroCrossings || 0}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>Zero crossings (τ = {activeTau})</div>
        </div>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {activeData?.expectedZeros || 0}
          </div>
          <div style={{ color: '#64748b', fontSize: 10 }}>Expected zeros (Riemann–von Mangoldt)</div>
        </div>
      </div>
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid #10b98140',
        fontSize: 12,
      }}>
        <strong style={{ color: '#10b981' }}>Λ ≥ 0 (Rodgers–Tao, 2020)</strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 11 }}>
          {data.gap}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Proof Map ────────────────────────────────────────────────────────

function ProofMapTab() {
  const gaps = useMemo(() => proofGapAnalysis(), []);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        A structured overview of the logical status of each RH attack vector. <strong>Established</strong> results
        are rigorously proven theorems or verified identities. <strong>Critical Gaps</strong> highlight where
        each proof strategy breaks down &mdash; including known-false claims (flagged red) that would, if true,
        over-prove RH. The <strong>Most Promising Attack</strong> section identifies the strategy with the
        fewest remaining gaps and strongest supporting evidence.
        <strong> Look for:</strong> which claims are rigorous vs. which have critical gaps; any "KNOWN FALSE" flags.
      </div>
      {/* Established */}
      <h4 style={{ color: '#10b981', fontSize: 13, marginBottom: 12 }}>What Is Established</h4>
      {gaps.established.map((item, i) => (
        <div key={i} className="card" style={{
          marginBottom: 8, padding: '10px 14px', borderLeftWidth: 3,
          borderLeftColor: item.status === 'rigorous' ? '#10b981' : item.status === 'theorem' ? '#3b82f6' : '#f59e0b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: item.status === 'rigorous' ? '#10b98120' : item.status === 'theorem' ? '#3b82f620' : '#f59e0b20',
              color: item.status === 'rigorous' ? '#10b981' : item.status === 'theorem' ? '#3b82f6' : '#f59e0b',
              textTransform: 'uppercase',
            }}>{item.status}</span>
            <strong style={{ fontSize: 12, color: '#e2e8f0' }}>{item.claim}</strong>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>{item.detail}</div>
        </div>
      ))}

      {/* Gaps */}
      <h4 style={{ color: '#ef4444', fontSize: 13, marginTop: 24, marginBottom: 12 }}>Critical Gaps</h4>
      {gaps.gaps.map((item, i) => (
        <div key={i} className="card" style={{
          marginBottom: 8, padding: '10px 14px', borderLeftWidth: 3,
          borderLeftColor: item.severity === 'critical' ? '#ef4444' : item.severity === 'known-false' ? '#dc2626' : '#f59e0b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: item.severity === 'critical' ? '#ef444420' : item.severity === 'known-false' ? '#dc262620' : '#f59e0b20',
              color: item.severity === 'critical' ? '#ef4444' : item.severity === 'known-false' ? '#dc2626' : '#f59e0b',
              textTransform: 'uppercase',
            }}>{item.status}</span>
            {item.severity === 'known-false' && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                background: '#dc262620', color: '#dc2626' }}>KNOWN FALSE</span>
            )}
            <strong style={{ fontSize: 12, color: '#e2e8f0' }}>{item.claim}</strong>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>{item.detail}</div>
        </div>
      ))}

      {/* Most promising attack */}
      <div className="card" style={{ marginTop: 24, borderColor: '#8b5cf6', borderWidth: 2 }}>
        <h4 style={{ color: '#8b5cf6', fontSize: 14, marginBottom: 8 }}>
          Most Promising Attack Vector: {gaps.mostPromisingAttack.name}
        </h4>
        <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
          {gaps.mostPromisingAttack.reason}
        </p>
        <div style={{ marginTop: 8, fontSize: 11, color: '#64748b' }}>
          Key references: {gaps.mostPromisingAttack.references.join(', ')}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RHAttackViz() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        {TABS.map((label, i) => (
          <button key={label}
            className={`tab-btn ${tab === i ? 'active' : ''}`}
            onClick={() => setTab(i)}
          >{label}</button>
        ))}
      </div>

      {tab === 0 && <LiCoefficientsTab />}
      {tab === 1 && <HamiltonianTab />}
      {tab === 2 && <SMatrixTab />}
      {tab === 3 && <HeatFlowTab />}
      {tab === 4 && <ProofMapTab />}
    </div>
  );
}
