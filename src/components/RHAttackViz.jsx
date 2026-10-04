import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  liCoefficients, hamiltonianConvexityTest, sMatrixZeroConfinement,
  deBruijnNewmanScan, weilPositivityTest, proofGapAnalysis, zeroDeviationScan,
  berryKeatingSpectrum, berryKeatingComparison,
} from '../math/rh-attack.js';
import { ZETA_ZEROS } from '../math/zeta.js';
import { getPrimes } from '../math/primes.js';
import { ED, alpha } from '../styles/tokens.js';

const TABS = ['Li Coefficients', 'Hamiltonian', 'S-Matrix', 'Heat Flow', 'Berry-Keating', 'Proof Map'];

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
    ctx.strokeStyle = ED.rule;
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
    ctx.strokeStyle = ED.series2;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ED.series2;
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

      ctx.fillStyle = l.positive ? ED.series3 : ED.series2;
      ctx.fillRect(x - barW / 2, barTop, barW, barHeight);

      // Label every few bars
      if (i % Math.max(1, Math.floor(lambdas.length / 15)) === 0) {
        ctx.fillStyle = ED.series8;
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(`${l.n}`, x, h - margin.bottom + 12);
      }
    });

    // Y-axis labels
    ctx.fillStyle = ED.series8;
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
      ctx.strokeStyle = ED.ruleSoft;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Axis labels
    ctx.fillStyle = ED.series8;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('n', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
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
          <span style={{ color: 'var(--ink-faint)', fontSize: 11, marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
            (γ<sub>max</sub> ≈ {ZETA_ZEROS[Math.min(numZeros, ZETA_ZEROS.length) - 1]?.toFixed(1) ?? '?'})
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)', border: '1px solid var(--rule-soft)' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.allPositive ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--series-2) 8%, transparent)',
        border: `1px solid ${data.allPositive ? ED.series3 : ED.series2}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.allPositive ? 'var(--series-3)' : 'var(--series-2)' }}>
          {data.verdict}
        </strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 11 }}>
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
    ctx.strokeStyle = ED.rule;
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
    ctx.strokeStyle = ED.rule;
    ctx.stroke();
    ctx.setLineDash([]);

    // d²H/dσ² curve
    ctx.beginPath();
    results.forEach((r, i) => {
      const x = margin.left + ((r.t - tMin) / (tMax - tMin)) * plotW;
      const y = zeroY - (r.d2H_dSigma2 / maxD2H) * plotH * 0.4;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Points colored by convexity
    results.forEach(r => {
      const x = margin.left + ((r.t - tMin) / (tMax - tMin)) * plotW;
      const y = zeroY - (r.d2H_dSigma2 / maxD2H) * plotH * 0.4;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = r.isMinimum ? ED.series3 : r.isConvex ? ED.series4 : ED.series2;
      ctx.fill();
      ctx.strokeStyle = ED.paper;
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
    ctx.strokeStyle = ED.brassDeco;
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
        ctx.strokeStyle = alpha(ED.series2, 0.25);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Y-axis tick labels for ∂²H/∂σ²
    ctx.fillStyle = ED.series8;
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
        ctx.strokeStyle = ED.rule;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = ED.series8;
    ctx.font = '10px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText('t', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
    ctx.font = '10px sans-serif';
    ctx.fillText('∂²H/∂σ²', 0, 0);
    ctx.restore();

    // Legend — curves
    [
      { color: ED.series1, label: '∂²H/∂σ² (convexity)' },
      { color: ED.brass, label: '∂H/∂σ (stationarity)' },
    ].forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(margin.left + 8, margin.top + 4 + i * 14, 12, 3);
      ctx.fillStyle = ED.series8;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, margin.left + 24, margin.top + 8 + i * 14);
    });

    // Legend — dot classification
    const dotLegendTop = margin.top + 4 + 2 * 14 + 4;
    [
      { color: ED.series3, label: 'Minimum (convex + stationary)' },
      { color: ED.brass, label: 'Convex but not stationary' },
      { color: ED.series2, label: 'Not convex' },
    ].forEach((item, i) => {
      const y = dotLegendTop + i * 14;
      ctx.beginPath();
      ctx.arc(margin.left + 14, y + 1, 4, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.fillStyle = ED.series8;
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, margin.left + 24, y + 4);
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
        <span className="control-value">{numPrimes} <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>(up to p={getPrimes(numPrimes)[numPrimes - 1]})</span></span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)', border: '1px solid var(--rule-soft)' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: data.allMinima ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
        border: `1px solid ${data.allMinima ? ED.series3 : ED.series4}40`,
        fontSize: 12,
      }}>
        <strong style={{ color: data.allMinima ? 'var(--series-3)' : 'var(--brass)' }}>
          {data.verdict}
        </strong>
        <div style={{ color: 'var(--series-2)', marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          GAP: {data.gap}
        </div>
      </div>
      {/* Results table */}
      <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', fontSize: 11, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--rule)' }}>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>t</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>∂H/∂σ</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>∂²H/∂σ²</th>
              <th style={{ textAlign: 'center', padding: '4px 8px' }}>Minimum?</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map(r => (
              <tr key={r.t} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)' }}>{r.t.toFixed(2)}</td>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                  color: Math.abs(r.dH_dSigma) < 0.1 ? 'var(--series-3)' : 'var(--brass)' }}>
                  {r.dH_dSigma.toFixed(4)}
                </td>
                <td style={{ padding: '4px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                  color: r.isConvex ? 'var(--series-3)' : 'var(--series-2)' }}>
                  {r.d2H_dSigma2.toFixed(2)}
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  {r.isMinimum
                    ? <span style={{ color: 'var(--series-3)' }}>Yes</span>
                    : <span style={{ color: 'var(--series-2)' }}>No</span>}
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
    ctx.strokeStyle = ED.rule;
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
      ctx.fillStyle = r.nearZero ? ED.series2 : ED.series1;
      ctx.fillRect(x - barW / 2, barY, barW * 0.5, barH);

      // Bridge magnitude indicator
      const bridgeH = (r.bridgeMagnitude / 2) * plotH * 0.8;
      ctx.fillStyle = r.bridgeUnitary ? alpha(ED.series3, 0.5) : alpha(ED.series4, 0.5);
      ctx.fillRect(x + 2, h - margin.bottom - bridgeH, barW * 0.3, bridgeH);

      // Label
      ctx.fillStyle = ED.series8;
      ctx.font = '8px var(--font-mono)';
      ctx.textAlign = 'center';
      ctx.fillText(r.t.toFixed(1), x, h - margin.bottom + 12);

      if (r.nearZero) {
        ctx.fillStyle = ED.series2;
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('ZERO', x, barY - 4);
      }
    });

    // Y-axis tick labels
    ctx.fillStyle = ED.series8;
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
        ctx.strokeStyle = ED.ruleSoft;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Axis labels
    ctx.fillStyle = ED.series8;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('t (imaginary part)', w / 2, h - 4);
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude', 0, 0);
    ctx.restore();

    // Legend
    ctx.fillStyle = ED.series1;
    ctx.fillRect(margin.left + 8, margin.top + 4, 12, 8);
    ctx.fillStyle = ED.series8;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('|ζ(½+it)| (scalar zero diagnostic)', margin.left + 24, margin.top + 12);

    ctx.fillStyle = ED.series3;
    ctx.fillRect(margin.left + 8, margin.top + 18, 12, 8);
    ctx.fillStyle = ED.series8;
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
        This panel compares the scalar diagnostic <InlineMath tex={"|\\zeta(\\tfrac{1}{2}+it)|"} />
        with the bridge symmetry <InlineMath tex={"|\\chi|=1"} />; it is not plotting
        <InlineMath tex={"|S_{21}|"} />. At a zeta zero the blue diagnostic vanishes, while
        <InlineMath tex={"S_{21}=\\zeta(2s)/\\zeta(s)"} /> generically has a pole. The zero
        deviation table below cross-checks each known <InlineMath tex={"\\gamma_n"} /> against the
        Riemann&ndash;Siegel formula.
        <strong> Look for:</strong> red "ZERO" labels only at known <InlineMath tex={"\\gamma_n"} />;
        green bridge bars reaching full height (unitarity).
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)', border: '1px solid var(--rule-soft)' }}
      />
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: 'color-mix(in srgb, var(--series-1) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--series-1) 25%, transparent)',
        fontSize: 12,
      }}>
        <strong style={{ color: 'var(--series-1)' }}>Zero/pole bookkeeping</strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 11 }}>
          At known zeros, |ζ(½+it)| vanishes while the bridge factor retains unit modulus.
          This is a zero/symmetry diagnostic, not Darlington transmission-zero confinement.
        </div>
        <div style={{ color: 'var(--series-2)', marginTop: 6, fontSize: 11, fontWeight: 600 }}>
          GAP: {data.gap}
        </div>
      </div>
      {/* Zero deviation table */}
      <div style={{ marginTop: 12 }}>
        <h4 style={{ fontSize: 12, color: 'var(--brass)', marginBottom: 8 }}>Zero Consistency Check</h4>
        <div style={{ maxHeight: 180, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 10, color: 'var(--ink-soft)', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '3px 6px' }}>γ</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>|ζ|</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>|χ|</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>Z mismatch</th>
                <th style={{ textAlign: 'right', padding: '3px 6px' }}>E balance</th>
              </tr>
            </thead>
            <tbody>
              {zeroData.slice(0, 15).map(r => (
                <tr key={r.gamma} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)' }}>{r.gamma.toFixed(2)}</td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.zetaMagnitude < 0.1 ? 'var(--series-3)' : 'var(--brass)' }}>
                    {r.zetaMagnitude.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.bridgeUnitary ? 'var(--series-3)' : 'var(--brass)' }}>
                    {r.bridgeMagnitude.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {r.impedanceMismatch.toFixed(4)}
                  </td>
                  <td style={{ padding: '3px 6px', fontFamily: 'var(--font-mono)', textAlign: 'right',
                    color: r.energyBalance < 0.01 ? 'var(--series-3)' : 'var(--brass)' }}>
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
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const tauColors = [ED.series2, ED.series4, ED.series3, ED.series1, ED.series5];

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
    ctx.strokeStyle = ED.rule;
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
          ctx.fillStyle = ED.series2;
          ctx.fill();
        }
      });
    }

    // Legend
    tauValues.forEach((tau, i) => {
      const y = margin.top + 4 + i * 14;
      ctx.fillStyle = tauColors[i];
      ctx.fillRect(w - margin.right - 140, y, 12, 3);
      ctx.fillStyle = i === tauIdx ? ED.ink : ED.series8;
      ctx.font = `${i === tauIdx ? 'bold ' : ''}9px var(--font-mono)`;
      ctx.textAlign = 'left';
      ctx.fillText(`τ = ${tau}`, w - margin.right - 124, y + 4);
    });

    // Y-axis tick labels
    ctx.fillStyle = ED.series8;
    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const frac = i / yTicks;
      const val = globalMaxVal * (1 - 2 * frac); // from +max to -max
      const y = midY - (1 - 2 * frac) * plotH * 0.4;
      ctx.fillText(val.toFixed(1), margin.left - 6, y + 3);
      // Gridline
      if (i > 0 && i < yTicks) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(margin.left, y);
        ctx.lineTo(w - margin.right, y);
        ctx.strokeStyle = ED.ruleSoft;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Y-axis label
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
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
        ctx.fillStyle = ED.series8;
        ctx.font = '9px var(--font-mono)';
        ctx.textAlign = 'center';
        ctx.fillText(tVal.toFixed(0), x, h - margin.bottom + 14);
      }
    }

    // X-axis label
    ctx.fillStyle = ED.series8;
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
        The de Bruijn&ndash;Newman constant <InlineMath tex={"\\Lambda"} /> controls how the <InlineMath tex={"\\Xi"} /> function
        behaves under heat flow: <InlineMath tex={"H_\\tau(t)"} /> has only real zeros for{' '}
        <InlineMath tex={"\\tau \\geq \\Lambda"} />. Rodgers&ndash;Tao (2020) proved <InlineMath tex={"\\Lambda \\geq 0"} />;
        RH is equivalent to <InlineMath tex={"\\Lambda \\leq 0"} />, hence <InlineMath tex={"\\Lambda = 0"} />. Each curve
        shows <InlineMath tex={"H_\\tau(t)"} /> for a different heat time <InlineMath tex={"\\tau"} />. Red dots mark
        known zeta zeros on the <InlineMath tex={"\\tau = 0"} /> curve.
        <strong> Look for:</strong> zero crossings aligning with known zeros at <InlineMath tex={"\\tau = 0"} />;
        zeros coalescing as <InlineMath tex={"\\tau"} /> increases.
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {tauValues.map((tau, i) => (
          <button key={tau}
            className={`filter-btn ${tauIdx === i ? 'active' : ''}`}
            onClick={() => setTauIdx(i)}
            style={{
              fontSize: 11,
              borderColor: tauIdx === i ? [ED.series2, ED.series4, ED.series3, ED.series1, ED.series5][i] : undefined,
            }}
          >τ = {tau}</button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)', border: '1px solid var(--rule-soft)' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: 'var(--series-3)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {activeData?.zeroCrossings || 0}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: 10 }}>Zero crossings (τ = {activeTau})</div>
        </div>
        <div className="stat-box" style={{ padding: '8px 12px' }}>
          <div style={{ color: 'var(--series-1)', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-mono)' }}>
            {activeData?.expectedZeros || 0}
          </div>
          <div style={{ color: 'var(--ink-faint)', fontSize: 10 }}>Expected zeros (Riemann–von Mangoldt)</div>
        </div>
      </div>
      <div style={{
        marginTop: 12, padding: '10px 14px', borderRadius: 6,
        background: 'color-mix(in srgb, var(--series-3) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--series-3) 25%, transparent)',
        fontSize: 12,
      }}>
        <strong style={{ color: 'var(--series-3)' }}>Λ ≥ 0 (Rodgers–Tao, 2020)</strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 11 }}>
          {data.gap}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Berry-Keating xp+px Operator ────────────────────────────────────

function BerryKeatingTab() {
  const [matrixSize, setMatrixSize] = useState(30);
  const canvasRef = useRef();

  const comparison = useMemo(() => berryKeatingComparison([20, matrixSize, Math.min(matrixSize + 20, 50)]), [matrixSize]);
  const mainResult = useMemo(() => berryKeatingSpectrum(matrixSize, 100, true), [matrixSize]);

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

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    const margin = { top: 30, right: 20, bottom: 40, left: 55 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Axes
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const m = mainResult.matchCount;
    if (m < 2) return;

    const maxVal = Math.max(
      ...mainResult.rescaledEigenvalues.slice(0, m),
      ...mainResult.targetZeros
    );
    const minVal = Math.min(
      ...mainResult.rescaledEigenvalues.slice(0, m),
      ...mainResult.targetZeros
    );
    const range = maxVal - minVal || 1;

    // Perfect match line (diagonal)
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, margin.top);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot eigenvalues vs zeta zeros
    for (let i = 0; i < m; i++) {
      const x = margin.left + ((mainResult.targetZeros[i] - minVal) / range) * plotW;
      const y = h - margin.bottom - ((mainResult.rescaledEigenvalues[i] - minVal) / range) * plotH;

      const err = mainResult.errors[i].error;
      const errNorm = Math.min(err / 5, 1); // normalize for color
      const r = Math.round(59 + (239 - 59) * errNorm);
      const g = Math.round(130 + (68 - 130) * errNorm);
      const b = Math.round(246 + (68 - 246) * errNorm);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series1;
    ctx.textAlign = 'left';
    ctx.fillText(`BK+Twin-Ladder Bridge eigenvalues (n=${matrixSize})`, margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series8;
    ctx.fillText('— perfect match line', margin.left + 8, margin.top + 30);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('ζ zeros (actual)', w / 2, h - 6);
    ctx.save();
    ctx.translate(14, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('BK eigenvalues (rescaled)', 0, 0);
    ctx.restore();
  }, [mainResult, matrixSize]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        <p>
          The <strong>Berry-Keating conjecture</strong> proposes that ζ-zeros are eigenvalues of the
          quantized Hamiltonian <InlineMath tex="H = \\tfrac{1}{2}(xp + px)" />. We discretize this
          operator on a log-uniform grid, then apply the <strong>Twin-Ladder Bridge correction</strong>: prime-indexed
          coupling terms <InlineMath tex="V_{jk} = \\sum_p \\frac{\\log p}{p} \\cos((E_j - E_k)\\log p)" /> that
          shift eigenvalues toward the actual zeros.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Matrix size n</label>
          <input type="range" min="10" max="50" step="5" value={matrixSize}
            onChange={e => setMatrixSize(+e.target.value)} />
          <span className="control-value">{matrixSize}</span>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'color-mix(in srgb, var(--series-5) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-5) 20%, transparent)' }}>
        <strong style={{ color: 'var(--series-5)' }}>{mainResult.verdict}</strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
          Scale: γ ≈ {mainResult.scaleFactor.toFixed(3)}·λ + {mainResult.shiftFactor.toFixed(3)}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ marginTop: 16 }}>
        <div style={{ color: 'var(--ink-soft)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Twin-Ladder Bridge Correction Impact
        </div>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--rule-soft)' }}>
              <th style={{ textAlign: 'left', padding: 4 }}>n</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Bare BK avg err</th>
              <th style={{ textAlign: 'right', padding: 4 }}>+Twin-Ladder Bridge avg err</th>
              <th style={{ textAlign: 'right', padding: 4 }}>Improvement</th>
            </tr>
          </thead>
          <tbody>
            {comparison.results.map(r => (
              <tr key={r.n} style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--paper)' }}>
                <td style={{ padding: 4 }}>{r.n}</td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {r.bareAvgError.toFixed(4)}
                </td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--font-mono)',
                             color: r.correctedAvgError < r.bareAvgError ? 'var(--series-3)' : 'var(--series-2)' }}>
                  {r.correctedAvgError.toFixed(4)}
                </td>
                <td style={{ padding: 4, textAlign: 'right', fontFamily: 'var(--font-mono)',
                             color: r.improvement > 0 ? 'var(--series-3)' : 'var(--series-2)' }}>
                  {r.improvement > 0 ? '+' : ''}{r.improvement.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Per-zero error table */}
      <div style={{ marginTop: 16, maxHeight: 200, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--rule-soft)' }}>
              <th style={{ textAlign: 'left', padding: 3 }}>#</th>
              <th style={{ textAlign: 'right', padding: 3 }}>BK+Twin-Ladder Bridge eigenvalue</th>
              <th style={{ textAlign: 'right', padding: 3 }}>ζ zero</th>
              <th style={{ textAlign: 'right', padding: 3 }}>Error</th>
            </tr>
          </thead>
          <tbody>
            {mainResult.errors.slice(0, 20).map(e => (
              <tr key={e.index} style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--paper)' }}>
                <td style={{ padding: 3 }}>{e.index}</td>
                <td style={{ padding: 3, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {e.eigenvalue.toFixed(4)}
                </td>
                <td style={{ padding: 3, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                  {e.zetaZero.toFixed(4)}
                </td>
                <td style={{ padding: 3, textAlign: 'right', fontFamily: 'var(--font-mono)',
                             color: e.error < 1 ? 'var(--series-3)' : e.error < 3 ? 'var(--brass)' : 'var(--series-2)' }}>
                  {e.error.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Proof Map ────────────────────────────────────────────────────────

function ProofMapTab() {
  const gaps = useMemo(() => proofGapAnalysis(), []);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        A structured overview of the logical status of each RH approach vector. <strong>Established</strong> results
        are rigorously proven theorems or verified identities. <strong>Critical Gaps</strong> highlight where
        each proof strategy breaks down &mdash; including known-false claims (flagged red) that would, if true,
        over-prove RH. The <strong>Most Promising Approach</strong> section identifies the strategy with the
        fewest remaining gaps and strongest supporting evidence.
        <strong> Look for:</strong> which claims are rigorous vs. which have critical gaps; any "KNOWN FALSE" flags.
      </div>
      {/* Established */}
      <h4 style={{ color: 'var(--series-3)', fontSize: 13, marginBottom: 12 }}>What Is Established</h4>
      {gaps.established.map((item, i) => (
        <div key={i} className="card" style={{
          marginBottom: 8, padding: '10px 14px', borderLeftWidth: 3,
          borderLeftColor: item.status === 'rigorous' ? 'var(--series-3)' : item.status === 'theorem' ? 'var(--series-1)' : 'var(--brass-deco)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: item.status === 'rigorous' ? 'color-mix(in srgb, var(--series-3) 13%, transparent)' : item.status === 'theorem' ? 'color-mix(in srgb, var(--series-1) 13%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 13%, transparent)',
              color: item.status === 'rigorous' ? 'var(--series-3)' : item.status === 'theorem' ? 'var(--series-1)' : 'var(--brass)',
              textTransform: 'uppercase',
            }}>{item.status}</span>
            <strong style={{ fontSize: 12, color: 'var(--ink)' }}>{item.claim}</strong>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.detail}</div>
        </div>
      ))}

      {/* Gaps */}
      <h4 style={{ color: 'var(--series-2)', fontSize: 13, marginTop: 24, marginBottom: 12 }}>Critical Gaps</h4>
      {gaps.gaps.map((item, i) => (
        <div key={i} className="card" style={{
          marginBottom: 8, padding: '10px 14px', borderLeftWidth: 3,
          borderLeftColor: item.severity === 'critical' ? 'var(--series-2)' : item.severity === 'known-false' ? 'var(--series-2)' : 'var(--brass-deco)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: item.severity === 'critical' ? 'color-mix(in srgb, var(--series-2) 13%, transparent)' : item.severity === 'known-false' ? 'color-mix(in srgb, var(--series-2) 13%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 13%, transparent)',
              color: item.severity === 'critical' ? 'var(--series-2)' : item.severity === 'known-false' ? 'var(--series-2)' : 'var(--brass)',
              textTransform: 'uppercase',
            }}>{item.status}</span>
            {item.severity === 'known-false' && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
                background: 'color-mix(in srgb, var(--series-2) 13%, transparent)', color: 'var(--series-2)' }}>KNOWN FALSE</span>
            )}
            <strong style={{ fontSize: 12, color: 'var(--ink)' }}>{item.claim}</strong>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{item.detail}</div>
        </div>
      ))}

      {/* Most promising approach */}
      <div className="card" style={{ marginTop: 24, borderColor: 'var(--series-5)', borderWidth: 2 }}>
        <h4 style={{ color: 'var(--series-5)', fontSize: 14, marginBottom: 8 }}>
          Most Promising Approach Vector: {gaps.mostPromisingAttack.name}
        </h4>
        <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
          {gaps.mostPromisingAttack.reason}
        </p>
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink-faint)' }}>
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
      {tab === 4 && <BerryKeatingTab />}
      {tab === 5 && <ProofMapTab />}
    </div>
  );
}
