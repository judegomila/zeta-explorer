import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  hodgeDiamond, CY_EXAMPLES, picardFuchsPeriods, mirrorPrepotential,
  localZetaFermat, calabiYauSpectrum, modularityCheck, spectralZeroCorrelation,
  threefoldLiftAnalysis, etaleCohomologyTest, deligneExtensionGap,
  calabiYauFisherInfo, cyZetaCrossCheck,
} from '../math/calabi-yau.js';
import { ED, alpha as TK_ALPHA } from '../styles/tokens.js';

const TABS = ['Hodge Diamond', 'Periods', 'Mirror Map', 'Local Zeta', 'Spectral', 'Threefold Lift', 'Fisher Bridge'];

// ─── Tab 1: Hodge Diamond ───────────────────────────────────────────────────

function HodgeDiamondTab() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const ex = CY_EXAMPLES[exampleIdx];
  const data = useMemo(() => hodgeDiamond(ex.h11, ex.h21), [ex.h11, ex.h21]);
  const canvasRef = useRef();

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

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    // Draw Hodge diamond
    const cx = w / 2;
    const cy = h / 2;
    const cellW = 52, cellH = 32;
    const rows = data.diamond;

    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < rows.length; row++) {
      const cols = rows[row];
      const yOff = (row - 3) * cellH;
      const startX = -(cols.length - 1) * cellW / 2;

      for (let col = 0; col < cols.length; col++) {
        const x = cx + startX + col * cellW;
        const y = cy + yOff;
        const val = cols[col];

        // Cell background
        const isHighlight = val > 1;
        const isMirrorPair = (row === 2 && col === 1) || (row === 3 && (col === 1 || col === 2)) || (row === 4 && col === 1);
        ctx.fillStyle = isHighlight ? TK_ALPHA(ED.series5, 0.25) :
                        isMirrorPair ? TK_ALPHA(ED.series1, 0.15) :
                        'rgba(30, 41, 59, 0.5)';
        ctx.beginPath();
        ctx.roundRect(x - 20, y - 12, 40, 24, 4);
        ctx.fill();
        ctx.strokeStyle = isHighlight ? ED.series5 : ED.rule;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Value
        ctx.fillStyle = isHighlight ? ED.series5 : val > 0 ? ED.ink : ED.series8;
        ctx.fillText(val.toString(), x, y);
      }
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'left';
    ctx.fillText(`χ = ${data.euler}`, 16, 20);
    ctx.fillText(`h¹¹ = ${data.h11}`, 16, 36);
    ctx.fillText(`h²¹ = ${data.h21}`, 16, 52);

    // Betti numbers
    ctx.textAlign = 'right';
    ctx.fillText('Betti: [' + data.betti.join(', ') + ']', w - 16, 20);

    // Draw mirror symmetry axis
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = TK_ALPHA(ED.brassDeco, 0.25);
    ctx.beginPath();
    ctx.moveTo(cx, cy - 110);
    ctx.lineTo(cx, cy + 110);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series4;
    ctx.textAlign = 'center';
    ctx.fillText('mirror axis', cx, cy + 125);
  }, [data]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-purple">
        <p>
          The <strong>Hodge diamond</strong> of a Calabi-Yau 3-fold encodes the cohomological
          structure of the manifold. For CY3, the independent parameters are{' '}
          <InlineMath tex="h^{1,1}" /> (Kähler moduli) and <InlineMath tex="h^{2,1}" /> (complex
          structure moduli). Mirror symmetry exchanges these:{' '}
          <InlineMath tex="h^{1,1}(X) = h^{2,1}(\tilde{X})" />.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>CY3-fold example</label>
          <select value={exampleIdx} onChange={e => setExampleIdx(+e.target.value)}
            style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {CY_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.name} (h¹¹={ex.h11}, h²¹={ex.h21})</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'color-mix(in srgb, var(--series-5) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-5) 20%, transparent)' }}>
        <strong style={{ color: 'var(--series-5)' }}>{ex.name}</strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 13 }}>
          Euler characteristic χ = {data.euler} | Betti: [{data.betti.join(', ')}]
          {data.h11 === data.h21 && <span style={{ color: 'var(--brass)' }}> — Self-mirror!</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Periods ─────────────────────────────────────────────────────────

function PeriodsTab() {
  const canvasRef = useRef();
  const data = useMemo(() => picardFuchsPeriods(300), []);

  // Pre-filter and compute data-dependent bounds once, not on every resize
  const { valid, maxOmega, maxZ, validMirror, minM, maxM, rangeM } = useMemo(() => {
    const v = data.filter(d => isFinite(d.omega0) && d.omega0 > 0 && d.omega0 < 1e6);
    if (v.length < 2) return { valid: v, maxOmega: 1, maxZ: 1, validMirror: [], minM: 0, maxM: 1, rangeM: 1 };
    const mOmega = Math.max(...v.map(d => d.omega0));
    const mZ = v[v.length - 1].z;
    const vm = v.filter(d => isFinite(d.mirrorMap));
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < vm.length; i++) {
      if (vm[i].mirrorMap < lo) lo = vm[i].mirrorMap;
      if (vm[i].mirrorMap > hi) hi = vm[i].mirrorMap;
    }
    return { valid: v, maxOmega: mOmega, maxZ: mZ, validMirror: vm, minM: lo, maxM: hi, rangeM: (hi - lo) || 1 };
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

    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, w, h);

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
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

    if (valid.length < 2) return;

    // ω₀ curve
    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    valid.forEach((d, i) => {
      const x = margin.left + (d.z / maxZ) * plotW;
      const y = h - margin.bottom - (d.omega0 / maxOmega) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Mirror map curve (scaled)
    if (validMirror.length > 2) {

      ctx.strokeStyle = ED.brassDeco;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      validMirror.forEach((d, i) => {
        const x = margin.left + (d.z / maxZ) * plotW;
        const y = h - margin.bottom - ((d.mirrorMap - minM) / rangeM) * plotH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series1;
    ctx.textAlign = 'left';
    ctx.fillText('ω₀(z) — fundamental period', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series4;
    ctx.fillText('t(z) = ω₁/ω₀ — mirror map', margin.left + 8, margin.top + 30);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('z (complex structure parameter)', w / 2, h - 6);
    ctx.save();
    ctx.translate(14, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Period', 0, 0);
    ctx.restore();
  }, [valid, maxOmega, maxZ, validMirror, minM, rangeM]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-blue">
        <p>
          The <strong>periods</strong> of a CY3-fold satisfy the <strong>Picard-Fuchs equation</strong>,
          a system of ODEs that governs how the holomorphic 3-form <InlineMath tex="\Omega" /> varies
          with the complex structure. For the quintic, this is a 4th-order ODE whose solutions
          encode the mirror map <InlineMath tex="t(z) = \omega_1/\omega_0" />.
        </p>
      </div>

      <BlockMath tex="\omega_0(z) = \sum_{n=0}^{\infty} \frac{(5n)!}{(n!)^5} z^n, \qquad \left[\theta^4 - 5z(5\theta{+}1)(5\theta{+}2)(5\theta{+}3)(5\theta{+}4)\right]\omega_0 = 0" />

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 20%, transparent)' }}>
        <strong style={{ color: 'var(--series-1)' }}>Picard-Fuchs Monodromy</strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 13 }}>
          As z encircles the conifold singularity at z = 1/3125, the periods undergo monodromy
          transformations in Sp(4,ℤ). This monodromy group encodes arithmetic data
          that constrains the Hasse-Weil L-function.
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Mirror Map & Prepotential ───────────────────────────────────────

function MirrorMapTab() {
  const [kappa, setKappa] = useState(5);
  const canvasRef = useRef();

  const tVals = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 200; i++) arr.push(i * 0.02);
    return arr;
  }, []);

  const data = useMemo(() => mirrorPrepotential(tVals, { kappa }), [tVals, kappa]);

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

    const margin = { top: 30, right: 20, bottom: 40, left: 70 };
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

    const maxT = tVals[tVals.length - 1];
    const vals = data.map(d => d.total);
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const range = maxVal - minVal || 1;

    // Total prepotential
    ctx.strokeStyle = ED.series3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = margin.left + (d.t / maxT) * plotW;
      const y = h - margin.bottom - ((d.total - minVal) / range) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Classical part
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = margin.left + (d.t / maxT) * plotW;
      const y = h - margin.bottom - ((d.classical - minVal) / range) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Instanton correction region
    ctx.fillStyle = TK_ALPHA(ED.series4, 0.1);
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = margin.left + (d.t / maxT) * plotW;
      const yClass = h - margin.bottom - ((d.classical - minVal) / range) * plotH;
      const yTotal = h - margin.bottom - ((d.total - minVal) / range) * plotH;
      if (i === 0) { ctx.moveTo(x, yClass); }
      ctx.lineTo(x, yTotal);
    });
    for (let i = data.length - 1; i >= 0; i--) {
      const x = margin.left + (data[i].t / maxT) * plotW;
      const yClass = h - margin.bottom - ((data[i].classical - minVal) / range) * plotH;
      ctx.lineTo(x, yClass);
    }
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series3;
    ctx.textAlign = 'left';
    ctx.fillText('F(t) total prepotential', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series8;
    ctx.fillText('Classical: -κt³/6', margin.left + 8, margin.top + 30);
    ctx.fillStyle = ED.series4;
    ctx.fillText('Shaded: instanton corrections', margin.left + 8, margin.top + 46);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('t (Kähler parameter)', w / 2, h - 6);
  }, [data, tVals, kappa]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-green">
        <p>
          <strong>Mirror symmetry</strong> maps the Kähler moduli space of X to the complex structure
          moduli of X̃. The <strong>prepotential</strong>{' '}
          <InlineMath tex="F(t)" /> encodes genus-0 Gromov-Witten invariants as instanton corrections
          to the classical cubic intersection form.
        </p>
      </div>

      <BlockMath tex="F(t) = -\frac{\kappa}{6}\,t^3 + \sum_{d \geq 1} n_d \,\mathrm{Li}_3(e^{2\pi i\, d\, t})" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>κ (intersection number)</label>
          <input type="range" min="1" max="20" step="1" value={kappa}
            onChange={e => setKappa(+e.target.value)} />
          <span className="control-value">{kappa}</span>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 20%, transparent)' }}>
          <strong style={{ color: 'var(--series-3)', fontSize: 13 }}>GW Invariants (Quintic)</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            n₁ = 2,875 | n₂ = 609,250<br />
            n₃ = 317,206,375 | n₄ = 242,467,530,000
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 20%, transparent)' }}>
          <strong style={{ color: 'var(--brass)', fontSize: 13 }}>Zeta Connection</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
            Instanton numbers n_d arise from counting rational curves on X —
            the same enumerative data that builds the Hasse-Weil L-function.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Local Zeta Functions ────────────────────────────────────────────

function LocalZetaTab() {
  const [prime, setPrime] = useState(11);
  const canvasRef = useRef();

  const primeOptions = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 41];
  const data = useMemo(() => localZetaFermat(prime, 8), [prime]);
  const modData = useMemo(() => modularityCheck(60), []);

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

    const margin = { top: 30, right: 20, bottom: 40, left: 70 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Draw Ramanujan bound test
    const coeffs = modData.coefficients.slice(0, 20);
    const maxBound = Math.max(...coeffs.map(c => c.bound));

    // Bars: a_p values
    const barW = plotW / coeffs.length * 0.7;
    const gap = plotW / coeffs.length * 0.3;

    coeffs.forEach((c, i) => {
      const x = margin.left + i * (barW + gap);
      const barH = (Math.abs(c.ap) / maxBound) * plotH;
      const boundH = (c.bound / maxBound) * plotH;
      const y = h - margin.bottom - barH;

      // a_p bar
      ctx.fillStyle = c.ap >= 0 ? TK_ALPHA(ED.series1, 0.7) : TK_ALPHA(ED.series2, 0.7);
      ctx.fillRect(x, y, barW, barH);

      // Ramanujan bound line
      const boundY = h - margin.bottom - boundH;
      ctx.strokeStyle = TK_ALPHA(ED.brassDeco, 0.31);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 2, boundY);
      ctx.lineTo(x + barW + 2, boundY);
      ctx.stroke();

      // Prime label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'center';
      ctx.fillText(c.p.toString(), x + barW / 2, h - margin.bottom + 12);
    });

    // Y-axis tick labels and horizontal gridlines
    const numTicks = 5;
    ctx.font = '10px "JetBrains Mono", monospace';
    for (let i = 0; i <= numTicks; i++) {
      const frac = i / numTicks;
      const val = frac * maxBound;
      const yPos = h - margin.bottom - frac * plotH;

      // Gridline
      ctx.strokeStyle = TK_ALPHA(ED.rule, 0.5);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(w - margin.right, yPos);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tick label
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(val).toString(), margin.left - 6, yPos + 3);
    }

    // Rotated y-axis label
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('|a_p|', 0, 0);
    ctx.restore();

    // Axes
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series1;
    ctx.textAlign = 'left';
    ctx.fillText('a_p coefficients (blue \u2265 0, red < 0)', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series4;
    ctx.fillText('— Ramanujan bound: 2p^(3/2)', margin.left + 8, margin.top + 30);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('prime p', w / 2, h - 6);
  }, [modData]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-orange">
        <p>
          The <strong>Hasse-Weil zeta function</strong> of a CY3 over <InlineMath tex="\mathbb{F}_p" /> is
          built from point counts <InlineMath tex="\#X(\mathbb{F}_{p^n})" />. The{' '}
          <strong>Weil conjectures</strong> (proved by Deligne) guarantee that reciprocal roots of{' '}
          <InlineMath tex="P_3(T)" /> satisfy <InlineMath tex="|\alpha| = p^{3/2}" /> — this is
          <em> exactly</em> the finite-field analog of the Riemann Hypothesis.
        </p>
      </div>

      <BlockMath tex="Z(X/\mathbb{F}_p, T) = \frac{P_1(T)\, P_3(T)\, P_5(T)}{P_0(T)\, P_2(T)\, P_4(T)\, P_6(T)}, \quad |a_p| \leq 2p^{3/2}" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Focus prime p</label>
          <select value={prime} onChange={e => setPrime(+e.target.value)}
            style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {primeOptions.map(p => (
              <option key={p} value={p}>p = {p} {p % 5 === 1 ? '(≡1 mod 5)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 20%, transparent)' }}>
          <strong style={{ color: 'var(--brass)', fontSize: 13 }}>Point Counts (Fermat quintic / 𝔽<sub>{prime}</sub>)</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            {data.counts.map((c, i) => (
              <div key={i}>#X(F_{'{'}p^{i + 1}{'}'}) = {c.toLocaleString()}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 20%, transparent)' }}>
          <strong style={{ color: 'var(--series-3)', fontSize: 13 }}>Weil → Riemann Analogy</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
            {data.analogy}<br /><br />
            <strong>Deligne's proof</strong> (1974) of the Weil conjectures IS a proof of RH
            for varieties over finite fields. The strategy: use étale cohomology and
            the Lefschetz trace formula — the same tools that might crack ζ(s).
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 5: Spectral Geometry ───────────────────────────────────────────────

function SpectralTab() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const canvasRef = useRef();
  const ex = CY_EXAMPLES[exampleIdx];

  const spectrum = useMemo(() => calabiYauSpectrum(ex.h11, ex.h21, 200), [ex.h11, ex.h21]);
  const correlation = useMemo(() => spectralZeroCorrelation(ex.h11, ex.h21, 50),
    [ex.h11, ex.h21]);

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

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    // Draw spacing distribution
    const dist = correlation.distribution;
    const maxY = Math.max(...dist.map(d => Math.max(d.cy, d.zeta, d.gue)));
    const maxS = dist[dist.length - 1].s;
    const barW = plotW / dist.length;

    // GUE curve (filled)
    ctx.fillStyle = TK_ALPHA(ED.series5, 0.15);
    ctx.beginPath();
    ctx.moveTo(margin.left, h - margin.bottom);
    dist.forEach((d, i) => {
      const x = margin.left + (i + 0.5) * barW;
      const y = h - margin.bottom - (d.gue / maxY) * plotH;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.closePath();
    ctx.fill();

    // GUE line
    ctx.strokeStyle = ED.series5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    dist.forEach((d, i) => {
      const x = margin.left + (i + 0.5) * barW;
      const y = h - margin.bottom - (d.gue / maxY) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // CY spectrum bars
    dist.forEach((d, i) => {
      const x = margin.left + i * barW + 2;
      const barH = (d.cy / maxY) * plotH;
      ctx.fillStyle = TK_ALPHA(ED.series1, 0.5);
      ctx.fillRect(x, h - margin.bottom - barH, barW * 0.4, barH);
    });

    // Zeta zeros bars
    dist.forEach((d, i) => {
      const x = margin.left + i * barW + barW * 0.45;
      const barH = (d.zeta / maxY) * plotH;
      ctx.fillStyle = TK_ALPHA(ED.series3, 0.5);
      ctx.fillRect(x, h - margin.bottom - barH, barW * 0.4, barH);
    });

    // Axes
    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Y-axis tick labels
    const numYTicks = 4;
    ctx.font = '10px "JetBrains Mono", monospace';
    for (let i = 0; i <= numYTicks; i++) {
      const frac = i / numYTicks;
      const val = frac * maxY;
      const yPos = h - margin.bottom - frac * plotH;
      ctx.strokeStyle = TK_ALPHA(ED.rule, 0.4);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(w - margin.right, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), margin.left - 6, yPos + 3);
    }

    // Legend
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series5;
    ctx.textAlign = 'left';
    ctx.fillText('GUE Wigner surmise', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series1;
    ctx.fillText('CY Laplacian spacings', margin.left + 8, margin.top + 30);
    ctx.fillStyle = ED.series3;
    ctx.fillText('ζ(s) zero spacings', margin.left + 8, margin.top + 46);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('Normalized spacing s', w / 2, h - 6);

    // Y-axis label
    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('P(s)', 0, 0);
    ctx.restore();

    // KL divergence
    ctx.textAlign = 'right';
    ctx.fillStyle = ED.series8;
    ctx.fillText(`D_KL(CY||GUE) = ${correlation.klCY.toFixed(3)}`, w - margin.right, margin.top + 14);
    ctx.fillText(`D_KL(ζ||GUE) = ${correlation.klZeta.toFixed(3)}`, w - margin.right, margin.top + 30);
  }, [spectrum, correlation]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        <p>
          The <strong>spectral geometry</strong> of a CY3 connects to the Riemann zeta via universality:
          both the Laplacian eigenvalues of a "generic" CY and the nontrivial zeros of ζ(s) exhibit{' '}
          <strong>GUE random matrix statistics</strong>. This shared statistical signature suggests a
          deep structural connection — the <em>same</em> symmetry class governs both spectra.
        </p>
      </div>

      <BlockMath tex="\zeta_\Delta(s) = \sum_n \lambda_n^{-s}, \qquad K(t) = \sum_n e^{-\lambda_n t} \sim (4\pi t)^{-3} \sum_{k \geq 0} a_k\, t^k" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>CY3 geometry</label>
          <select value={exampleIdx} onChange={e => setExampleIdx(+e.target.value)}
            style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {CY_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.name}</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, background: 'var(--paper)',
                 border: '1px solid var(--rule-soft)' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: correlation.klCY < 0.5
                      ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                    border: `1px solid ${correlation.klCY < 0.5
                      ? TK_ALPHA(ED.series3, 0.2) : TK_ALPHA(ED.series4, 0.2)}` }}>
        <strong style={{ color: correlation.klCY < 0.5 ? 'var(--series-3)' : 'var(--brass)' }}>
          {correlation.verdict}
        </strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 13 }}>
          Heat kernel coefficients: a₀ = {spectrum.heatCoeffs[0].value} (volume),{' '}
          a₁ = {spectrum.heatCoeffs[1].value} (Ricci-flat),{' '}
          a₂ = {spectrum.heatCoeffs[2].value.toFixed(5)} (∝ χ/{720})
        </div>
      </div>

      <div style={{ marginTop: 12, maxHeight: 180, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--ink-faint)', borderBottom: '1px solid var(--rule-soft)' }}>
              <th style={{ textAlign: 'left', padding: 4 }}>s</th>
              <th style={{ textAlign: 'right', padding: 4 }}>ζ_Δ(s)</th>
              <th style={{ textAlign: 'left', padding: 4 }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {spectrum.spectralZeta.map(({ s, value }) => (
              <tr key={s} style={{ color: 'var(--ink-soft)', borderBottom: '1px solid var(--paper)' }}>
                <td style={{ padding: 4 }}>{s}</td>
                <td style={{ textAlign: 'right', padding: 4, fontFamily: 'var(--font-mono)' }}>
                  {value.toExponential(4)}
                </td>
                <td style={{ padding: 4 }}>
                  {s === 3 ? 'Related to Ray-Singer torsion' :
                   s === 4 ? 'Heat kernel a₂ coefficient' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab 6: Threefold Lift ───────────────────────────────────────────────────

function ThreefoldLiftTab() {
  const [numPrimes, setNumPrimes] = useState(60);
  const [numZeros, setNumZeros] = useState(40);
  const liftCanvasRef = useRef();
  const etaleCanvasRef = useRef();

  const liftData = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const sigma = 0.05 + i * 0.019;
      points.push(threefoldLiftAnalysis(sigma, numZeros));
    }
    return points;
  }, [numZeros]);

  const etaleData = useMemo(() => etaleCohomologyTest(numPrimes), [numPrimes]);
  const gapData = useMemo(() => deligneExtensionGap(), []);

  const drawLift = useCallback(() => {
    const canvas = liftCanvasRef.current;
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

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    if (liftData.length < 2) return;

    const scores = liftData.map(d => d.liftScore);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const range = maxScore - minScore || 1;
    const minSigma = liftData[0].sigma;
    const maxSigma = liftData[liftData.length - 1].sigma;
    const sigmaRange = maxSigma - minSigma || 1;

    ctx.font = '10px "JetBrains Mono", monospace';
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const yPos = h - margin.bottom - frac * plotH;
      ctx.strokeStyle = TK_ALPHA(ED.rule, 0.4);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(w - margin.right, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'right';
      ctx.fillText((minScore + frac * range).toFixed(2), margin.left - 6, yPos + 3);
    }

    // sigma = 1/2 vertical line
    const halfX = margin.left + ((0.5 - minSigma) / sigmaRange) * plotW;
    ctx.strokeStyle = TK_ALPHA(ED.series2, 0.6);
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(halfX, margin.top);
    ctx.lineTo(halfX, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = ED.series2;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = 1/2', halfX, margin.top - 6);

    // Lift score curve with gradient
    const gradient = ctx.createLinearGradient(margin.left, 0, w - margin.right, 0);
    gradient.addColorStop(0, ED.series4);
    gradient.addColorStop(0.25, ED.series3);
    gradient.addColorStop(0.5, ED.series1);
    gradient.addColorStop(1, ED.series5);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    liftData.forEach((d, i) => {
      const x = margin.left + ((d.sigma - minSigma) / sigmaRange) * plotW;
      const y = h - margin.bottom - ((d.liftScore - minScore) / range) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Mark minimum point
    let minIdx = 0;
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] < scores[minIdx]) minIdx = i;
    }
    const minX = margin.left + ((liftData[minIdx].sigma - minSigma) / sigmaRange) * plotW;
    const minY = h - margin.bottom - ((scores[minIdx] - minScore) / range) * plotH;
    ctx.beginPath();
    ctx.arc(minX, minY, 5, 0, Math.PI * 2);
    ctx.fillStyle = ED.series3;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = ED.series3;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('min at \u03C3=' + liftData[minIdx].sigma.toFixed(2), minX + 8, minY - 4);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series1;
    ctx.textAlign = 'left';
    ctx.fillText('Motivic lift score vs \u03C3 (lower = better fit)', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3 = Re(s)', w / 2, h - 6);

    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('Lift score', 0, 0);
    ctx.restore();
  }, [liftData]);

  const drawEtale = useCallback(() => {
    const canvas = etaleCanvasRef.current;
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

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    const results = etaleData.results.slice(0, 25);
    if (results.length === 0) return;

    const maxAbs = Math.max(...results.map(r => Math.max(Math.abs(r.cyNormalized), Math.abs(r.zetaAp))));
    const yRange = Math.max(maxAbs, 2.5);

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const zeroY = margin.top + plotH / 2;
    ctx.strokeStyle = TK_ALPHA(ED.rule, 0.4);
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(margin.left, zeroY);
    ctx.lineTo(w - margin.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    const barW = plotW / results.length;

    // zeta coefficients line (constant at 1)
    ctx.strokeStyle = ED.series3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    results.forEach((r, i) => {
      const x = margin.left + (i + 0.5) * barW;
      const y = zeroY - (r.zetaAp / yRange) * (plotH / 2);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // CY etale trace bars (normalized)
    results.forEach((r, i) => {
      const x = margin.left + i * barW + barW * 0.15;
      const val = r.cyNormalized;
      const barH = (Math.abs(val) / yRange) * (plotH / 2);
      const y = val >= 0 ? zeroY - barH : zeroY;
      ctx.fillStyle = val >= 0 ? TK_ALPHA(ED.series1, 0.6) : TK_ALPHA(ED.series2, 0.6);
      ctx.fillRect(x, y, barW * 0.7, barH);
    });

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    results.forEach((r, i) => {
      ctx.fillText(r.p.toString(), margin.left + (i + 0.5) * barW, h - margin.bottom + 12);
    });

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'right';
    ctx.fillText(yRange.toFixed(1), margin.left - 6, margin.top + 4);
    ctx.fillText('0', margin.left - 6, zeroY + 3);
    ctx.fillText((-yRange).toFixed(1), margin.left - 6, h - margin.bottom + 3);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = ED.series3;
    ctx.fillText('\u03B6(s) a_p = 1 (constant)', margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series1;
    ctx.fillText('CY3 Tr(Frob_p|H\u00B3) / p^{3/2}', margin.left + 8, margin.top + 30);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('prime p', w / 2, h - 6);
  }, [etaleData]);

  useEffect(() => {
    drawLift();
    drawEtale();
    const handler = () => { drawLift(); drawEtale(); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [drawLift, drawEtale]);

  return (
    <div>
      <div className="tab-explainer" style={{ borderLeftColor: 'var(--series-2)', background: 'color-mix(in srgb, var(--series-2) 5%, transparent)' }}>
        <p>
          <strong>The Threefold Lift Strategy:</strong> If we could find a Calabi-Yau 3-fold X such that{' '}
          <InlineMath tex="L(H^3(X),\, s) = \zeta(s)" />, then Deligne{"'"}s theorem would immediately
          prove RH. The charts below quantify <em>why</em> this direct identification fails and
          where the obstruction lies.
        </p>
      </div>

      <BlockMath tex="\text{Goal: } \prod_p \det\!\bigl(1 - \mathrm{Frob}_p\, p^{-s} \mid H^3_{\text{et}}(X)\bigr)^{-1} \stackrel{?}{=} \prod_p (1 - p^{-s})^{-1}" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>Number of zeros</label>
          <input type="range" min="10" max="80" step="5" value={numZeros}
            onChange={e => setNumZeros(+e.target.value)} />
          <span className="control-value">{numZeros}</span>
        </div>
        <div className="control-group">
          <label>Prime limit</label>
          <select value={numPrimes} onChange={e => setNumPrimes(+e.target.value)}
            style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {[30, 60, 100, 150, 200].map(n => (
              <option key={n} value={n}>primes up to {n}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 4, fontWeight: 600 }}>
          Motivic Lift Score vs. {'\u03C3'}
        </div>
        <canvas ref={liftCanvasRef}
          style={{ width: '100%', height: 260, borderRadius: 8, background: 'var(--paper)',
                   border: '1px solid var(--rule-soft)' }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 4, fontWeight: 600 }}>
          {'\u00C9'}tale Trace Comparison: CY3 vs. {'\u03B6'}(s)
        </div>
        <canvas ref={etaleCanvasRef}
          style={{ width: '100%', height: 240, borderRadius: 8, background: 'var(--paper)',
                   border: '1px solid var(--rule-soft)' }} />
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-2) 20%, transparent)' }}>
        <strong style={{ color: 'var(--series-2)', fontSize: 13 }}>
          {'\u00C9'}tale Fit Score: {etaleData.fitScore.toFixed(3)} {'\u2014'} {etaleData.verdict}
        </strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
          {etaleData.explanation}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--series-5)', fontWeight: 600, marginBottom: 8 }}>
          Deligne Extension Gap Analysis (overall gap: {(gapData.overallGap * 100).toFixed(0)}%)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: '10px 14px', borderRadius: 6,
                        background: 'color-mix(in srgb, var(--series-3) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 20%, transparent)' }}>
            <strong style={{ color: 'var(--series-3)', fontSize: 12 }}>What IS Proved</strong>
            {gapData.proved.map((item, i) => (
              <div key={i} style={{ color: 'var(--ink-soft)', fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--series-3)' }}>{'\u2713'}</span>{' '}
                <strong>{item.name}</strong> ({item.author})<br />
                <span style={{ marginLeft: 16 }}>{item.statement}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 6,
                        background: 'color-mix(in srgb, var(--series-2) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-2) 20%, transparent)' }}>
            <strong style={{ color: 'var(--series-2)', fontSize: 12 }}>Key Obstructions</strong>
            {gapData.missing.map((item, i) => (
              <div key={i} style={{ color: 'var(--ink-soft)', fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--series-2)' }}>{'\u2717'}</span>{' '}
                <strong>{item.name}</strong><br />
                <span style={{ marginLeft: 16 }}>{item.obstruction.slice(0, 120)}...</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-5) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-5) 20%, transparent)' }}>
          <strong style={{ color: 'var(--series-5)', fontSize: 12 }}>Summary</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12, lineHeight: 1.6 }}>
            {gapData.summary}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 7: Fisher Bridge ────────────────────────────────────────────────────

function FisherBridgeTab() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [numEigenvalues, setNumEigenvalues] = useState(200);
  const topCanvasRef = useRef();
  const bottomCanvasRef = useRef();
  const ex = CY_EXAMPLES[exampleIdx];

  const fisherData = useMemo(
    () => calabiYauFisherInfo(ex.h11, ex.h21, [0.1, 6], 120),
    [ex.h11, ex.h21]
  );
  const crossCheck = useMemo(
    () => cyZetaCrossCheck(ex.h11, ex.h21, Math.min(numEigenvalues, 50)),
    [ex.h11, ex.h21, numEigenvalues]
  );

  const drawTop = useCallback(() => {
    const canvas = topCanvasRef.current;
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

    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const cyData = fisherData.cyNormalized;
    const rData = fisherData.riemannNormalized;
    const snMax = 2.5;

    // CY Fisher fill + line (purple)
    ctx.fillStyle = TK_ALPHA(ED.series5, 0.12);
    ctx.beginPath();
    ctx.moveTo(margin.left, h - margin.bottom);
    for (const pt of cyData) {
      if (pt.sigmaNorm > snMax) break;
      const x = margin.left + (pt.sigmaNorm / snMax) * plotW;
      const y = h - margin.bottom - Math.min(pt.fisherNorm, 1.2) / 1.2 * plotH;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(margin.left + plotW, h - margin.bottom);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ED.series5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (const pt of cyData) {
      if (pt.sigmaNorm > snMax) break;
      const x = margin.left + (pt.sigmaNorm / snMax) * plotW;
      const y = h - margin.bottom - Math.min(pt.fisherNorm, 1.2) / 1.2 * plotH;
      first ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      first = false;
    }
    ctx.stroke();

    // Riemann Fisher fill + line (blue)
    ctx.fillStyle = TK_ALPHA(ED.series1, 0.12);
    ctx.beginPath();
    ctx.moveTo(margin.left, h - margin.bottom);
    for (const pt of rData) {
      if (pt.sigmaNorm > snMax) break;
      const x = margin.left + (pt.sigmaNorm / snMax) * plotW;
      const y = h - margin.bottom - Math.min(pt.fisherNorm, 1.2) / 1.2 * plotH;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(margin.left + plotW, h - margin.bottom);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = ED.series1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    first = true;
    for (const pt of rData) {
      if (pt.sigmaNorm > snMax) break;
      const x = margin.left + (pt.sigmaNorm / snMax) * plotW;
      const y = h - margin.bottom - Math.min(pt.fisherNorm, 1.2) / 1.2 * plotH;
      first ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      first = false;
    }
    ctx.stroke();

    // Peak line at sigma-tilde = 1
    const peakX = margin.left + (1 / snMax) * plotW;
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = TK_ALPHA(ED.series2, 0.63);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(peakX, margin.top);
    ctx.lineTo(peakX, h - margin.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series2;
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3\u0303 = 1 (critical point)', peakX, margin.top - 6);

    // Y gridlines
    for (let i = 1; i <= 4; i++) {
      const frac = i / 4;
      const yPos = h - margin.bottom - frac * plotH;
      ctx.strokeStyle = TK_ALPHA(ED.rule, 0.4);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(w - margin.right, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'right';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(frac.toFixed(1), margin.left - 6, yPos + 3);
    }

    // X ticks
    for (let i = 0; i <= 5; i++) {
      const sn = i * 0.5;
      const x = margin.left + (sn / snMax) * plotW;
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'center';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(sn.toFixed(1), x, h - margin.bottom + 14);
    }

    // Legend
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = ED.series1;
    ctx.fillText('F(\u03C3) Riemann \u03B6(s) \u2014 peak at \u03C3=' + fisherData.peakRiemann.toFixed(3), margin.left + 8, margin.top + 14);
    ctx.fillStyle = ED.series5;
    ctx.fillText('F(\u03C3) CY \u03B6\u2206(s) \u2014 peak at \u03C3=' + fisherData.peakCY.toFixed(2), margin.left + 8, margin.top + 30);

    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'center';
    ctx.fillText('\u03C3\u0303 = \u03C3/\u03C3c (normalized)', w / 2, h - 4);

    ctx.save();
    ctx.translate(12, margin.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('F(\u03C3) normalized', 0, 0);
    ctx.restore();
  }, [fisherData]);

  const drawBottom = useCallback(() => {
    const canvas = bottomCanvasRef.current;
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

    const margin = { top: 30, right: 20, bottom: 50, left: 60 };
    const plotW = w - margin.left - margin.right;
    const plotH = h - margin.top - margin.bottom;

    ctx.strokeStyle = ED.rule;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    const metrics = [
      crossCheck.gueMatch,
      crossCheck.fisherMatch,
      crossCheck.pairCorrelation,
    ];

    const barColors = [ED.series1, ED.series5, ED.series3];
    const barW = plotW / (metrics.length * 2);
    const gap = barW;

    metrics.forEach((m, i) => {
      const x = margin.left + i * (barW + gap) + gap / 2;
      const barH = m.score * plotH;
      const y = h - margin.bottom - barH;

      const grad = ctx.createLinearGradient(x, y, x, h - margin.bottom);
      grad.addColorStop(0, barColors[i]);
      grad.addColorStop(1, barColors[i] + '40');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.strokeStyle = barColors[i];
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.stroke();

      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = ED.ink;
      ctx.textAlign = 'center';
      ctx.fillText((m.score * 100).toFixed(0) + '%', x + barW / 2, y - 8);

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = ED.series8;
      const words = m.label.split(' ');
      ctx.fillText(words.slice(0, 2).join(' '), x + barW / 2, h - margin.bottom + 12);
      if (words.length > 2) {
        ctx.fillText(words.slice(2).join(' '), x + barW / 2, h - margin.bottom + 24);
      }
    });

    // Y gridlines
    for (let i = 1; i <= 4; i++) {
      const frac = i / 4;
      const yPos = h - margin.bottom - frac * plotH;
      ctx.strokeStyle = TK_ALPHA(ED.rule, 0.4);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(w - margin.right, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ED.series8;
      ctx.textAlign = 'right';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText((frac * 100).toFixed(0) + '%', margin.left - 6, yPos + 3);
    }

    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = crossCheck.overallScore > 0.5 ? ED.series3 : ED.series4;
    ctx.textAlign = 'right';
    ctx.fillText('Overall: ' + (crossCheck.overallScore * 100).toFixed(1) + '%', w - margin.right, margin.top + 14);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = ED.series8;
    ctx.textAlign = 'left';
    ctx.fillText('CY \u2194 \u03B6 Cross-Check Scores', margin.left + 8, margin.top + 14);
  }, [crossCheck]);

  useEffect(() => {
    drawTop();
    drawBottom();
    const handler = () => { drawTop(); drawBottom(); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [drawTop, drawBottom]);

  return (
    <div>
      <div className="tab-explainer accent-cyan">
        <p>
          The <strong>Fisher efficiency bridge</strong> connects Calabi-Yau spectral geometry with
          the Riemann zeta through information theory. Both the spectral zeta{' '}
          <InlineMath tex="\zeta_\Delta(s) = \sum \lambda_n^{-s}" /> and the Riemann{' '}
          <InlineMath tex="\zeta(s)" /> exhibit a <strong>Fisher information peak</strong> at their
          respective critical points. When normalized to{' '}
          <InlineMath tex="\tilde\sigma = \sigma/\sigma_c" />, the profiles align — revealing a
          <strong> universal information-theoretic optimum</strong> at the critical line.
        </p>
      </div>

      <BlockMath tex="F(\sigma) = \mathrm{Var}_{p_n(\sigma)}\!\left[\frac{\partial}{\partial\sigma}\log p_n(\sigma)\right], \quad p_n(\sigma) = \frac{\lambda_n^{-\sigma}}{\zeta_\Delta(\sigma)}" />

      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <div className="control-group">
          <label>CY3 example</label>
          <select value={exampleIdx} onChange={e => setExampleIdx(+e.target.value)}
            style={{ background: 'var(--paper-3)', color: 'var(--ink)', border: '1px solid var(--rule)',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {CY_EXAMPLES.map((cyEx, i) => (
              <option key={i} value={i}>{cyEx.name} (h{'\u00B9\u00B9'}={cyEx.h11}, h{'\u00B2\u00B9'}={cyEx.h21})</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>Eigenvalue count</label>
          <input type="range" min="50" max="300" step="50" value={numEigenvalues}
            onChange={e => setNumEigenvalues(+e.target.value)} />
          <span className="control-value">{numEigenvalues}</span>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 4 }}>
          Fisher Information F({'\u03C3'}) — normalized profiles
        </div>
        <canvas ref={topCanvasRef}
          style={{ width: '100%', height: 280, borderRadius: 8, background: 'var(--paper)',
                   border: '1px solid var(--rule-soft)' }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 4 }}>
          Cross-Check Scores: CY vs Riemann universality
        </div>
        <canvas ref={bottomCanvasRef}
          style={{ width: '100%', height: 220, borderRadius: 8, background: 'var(--paper)',
                   border: '1px solid var(--rule-soft)' }} />
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-1) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 20%, transparent)' }}>
          <strong style={{ color: 'var(--series-1)', fontSize: 13 }}>Riemann {'\u03B6'}(s) Fisher Peak</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
            Peak at {'\u03C3'} = {fisherData.peakRiemann.toFixed(4)} (expected: 0.5000)<br />
            The Euler product density is maximally sensitive to perturbations
            at the critical line — the information-theoretic signature of RH.
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'color-mix(in srgb, var(--series-5) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--series-5) 20%, transparent)' }}>
          <strong style={{ color: 'var(--series-5)', fontSize: 13 }}>CY Spectral {'\u03B6\u2206'}(s) Fisher Peak</strong>
          <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
            Peak at {'\u03C3'} = {fisherData.peakCY.toFixed(2)} for {ex.name}<br />
            The CY spectral density exhibits an analogous critical point
            determined by Weyl asymptotics and Hodge structure.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: crossCheck.overallScore > 0.5
                      ? 'color-mix(in srgb, var(--series-3) 8%, transparent)' : 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                    border: '1px solid ' + (crossCheck.overallScore > 0.5
                      ? TK_ALPHA(ED.series3, 0.2) : TK_ALPHA(ED.brassDeco, 0.2)) }}>
        <strong style={{ color: crossCheck.overallScore > 0.5 ? 'var(--series-3)' : 'var(--brass)', fontSize: 13 }}>
          Universality Verdict
        </strong>
        <div style={{ color: 'var(--ink-soft)', marginTop: 4, fontSize: 12 }}>
          {crossCheck.details}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function CalabiYauViz() {
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

      {tab === 0 && <HodgeDiamondTab />}
      {tab === 1 && <PeriodsTab />}
      {tab === 2 && <MirrorMapTab />}
      {tab === 3 && <LocalZetaTab />}
      {tab === 4 && <SpectralTab />}
      {tab === 5 && <ThreefoldLiftTab />}
      {tab === 6 && <FisherBridgeTab />}
    </div>
  );
}
