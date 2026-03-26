import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import {
  hodgeDiamond, CY_EXAMPLES, picardFuchsPeriods, mirrorPrepotential,
  localZetaFermat, calabiYauSpectrum, modularityCheck, spectralZeroCorrelation,
} from '../math/calabi-yau.js';

const TABS = ['Hodge Diamond', 'Periods', 'Mirror Map', 'Local Zeta', 'Spectral'];

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
        const isMirrorPair = (row === 2 && col === 1) || (row === 3 && col === 1);
        ctx.fillStyle = isHighlight ? 'rgba(139, 92, 246, 0.25)' :
                        isMirrorPair ? 'rgba(59, 130, 246, 0.15)' :
                        'rgba(30, 41, 59, 0.5)';
        ctx.beginPath();
        ctx.roundRect(x - 20, y - 12, 40, 24, 4);
        ctx.fill();
        ctx.strokeStyle = isHighlight ? '#8b5cf6' : '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Value
        ctx.fillStyle = isHighlight ? '#c4b5fd' : val > 0 ? '#e2e8f0' : '#475569';
        ctx.fillText(val.toString(), x, y);
      }
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText(`χ = ${data.euler}`, 16, 20);
    ctx.fillText(`h¹¹ = ${data.h11}`, 16, 36);
    ctx.fillText(`h²¹ = ${data.h21}`, 16, 52);

    // Betti numbers
    ctx.textAlign = 'right';
    ctx.fillText('Betti: [' + data.betti.join(', ') + ']', w - 16, 20);

    // Draw mirror symmetry axis
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#f59e0b40';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 110);
    ctx.lineTo(cx, cy + 110);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b';
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
            style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {CY_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.name} (h¹¹={ex.h11}, h²¹={ex.h21})</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 280, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
        <strong style={{ color: '#c4b5fd' }}>{ex.name}</strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 13 }}>
          Euler characteristic χ = {data.euler} | Betti: [{data.betti.join(', ')}]
          {data.h11 === data.h21 && <span style={{ color: '#f59e0b' }}> — Self-mirror!</span>}
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
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    if (valid.length < 2) return;

    // ω₀ curve
    ctx.strokeStyle = '#3b82f6';
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

      ctx.strokeStyle = '#f59e0b';
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
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'left';
    ctx.fillText('ω₀(z) — fundamental period', margin.left + 8, margin.top + 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('t(z) = ω₁/ω₀ — mirror map', margin.left + 8, margin.top + 30);

    ctx.fillStyle = '#64748b';
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
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <strong style={{ color: '#93c5fd' }}>Picard-Fuchs Monodromy</strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 13 }}>
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
    ctx.strokeStyle = '#334155';
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
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = margin.left + (d.t / maxT) * plotW;
      const y = h - margin.bottom - ((d.total - minVal) / range) * plotH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Classical part
    ctx.strokeStyle = '#64748b';
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
    ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
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
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'left';
    ctx.fillText('F(t) total prepotential', margin.left + 8, margin.top + 14);
    ctx.fillStyle = '#64748b';
    ctx.fillText('Classical: -κt³/6', margin.left + 8, margin.top + 30);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('Shaded: instanton corrections', margin.left + 8, margin.top + 46);

    ctx.fillStyle = '#64748b';
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
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <strong style={{ color: '#6ee7b7', fontSize: 13 }}>GW Invariants (Quintic)</strong>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            n₁ = 2,875 | n₂ = 609,250<br />
            n₃ = 317,206,375 | n₄ = 242,467,530,000
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <strong style={{ color: '#fbbf24', fontSize: 13 }}>Zeta Connection</strong>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 12 }}>
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
      ctx.fillStyle = c.ap >= 0 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(239, 68, 68, 0.7)';
      ctx.fillRect(x, y, barW, barH);

      // Ramanujan bound line
      const boundY = h - margin.bottom - boundH;
      ctx.strokeStyle = '#f59e0b50';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 2, boundY);
      ctx.lineTo(x + barW + 2, boundY);
      ctx.stroke();

      // Prime label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText(c.p.toString(), x + barW / 2, h - margin.bottom + 12);
    });

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#3b82f6';
    ctx.textAlign = 'left';
    ctx.fillText('a_p coefficients (blue \u2265 0, red < 0)', margin.left + 8, margin.top + 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('— Ramanujan bound: 2p^(3/2)', margin.left + 8, margin.top + 30);

    ctx.fillStyle = '#64748b';
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
            style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {primeOptions.map(p => (
              <option key={p} value={p}>p = {p} {p % 5 === 1 ? '(≡1 mod 5)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 300, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          <strong style={{ color: '#fbbf24', fontSize: 13 }}>Point Counts (Fermat quintic / 𝔽<sub>{prime}</sub>)</strong>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            {data.counts.map((c, i) => (
              <div key={i}>#X(F_{'{'}p^{i + 1}{'}'}) = {c.toLocaleString()}</div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 14px', borderRadius: 6,
                      background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <strong style={{ color: '#6ee7b7', fontSize: 13 }}>Weil → Riemann Analogy</strong>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 12 }}>
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
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
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
    ctx.strokeStyle = '#8b5cf6';
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
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.fillRect(x, h - margin.bottom - barH, barW * 0.4, barH);
    });

    // Zeta zeros bars
    dist.forEach((d, i) => {
      const x = margin.left + i * barW + barW * 0.45;
      const barH = (d.zeta / maxY) * plotH;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.fillRect(x, h - margin.bottom - barH, barW * 0.4, barH);
    });

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, h - margin.bottom);
    ctx.lineTo(w - margin.right, h - margin.bottom);
    ctx.stroke();

    // Legend
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#8b5cf6';
    ctx.textAlign = 'left';
    ctx.fillText('GUE Wigner surmise', margin.left + 8, margin.top + 14);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('CY Laplacian spacings', margin.left + 8, margin.top + 30);
    ctx.fillStyle = '#10b981';
    ctx.fillText('ζ(s) zero spacings', margin.left + 8, margin.top + 46);

    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Normalized spacing s', w / 2, h - 6);

    // KL divergence
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
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
            style={{ background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
                     borderRadius: 6, padding: '4px 8px', fontSize: 13 }}>
            {CY_EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>{ex.name}</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef}
        style={{ width: '100%', height: 320, borderRadius: 8, background: '#0a0e1a',
                 border: '1px solid #1e293b' }} />

      <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 6,
                    background: correlation.klCY < 0.5
                      ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                    border: `1px solid ${correlation.klCY < 0.5
                      ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}` }}>
        <strong style={{ color: correlation.klCY < 0.5 ? '#6ee7b7' : '#fbbf24' }}>
          {correlation.verdict}
        </strong>
        <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 13 }}>
          Heat kernel coefficients: a₀ = {spectrum.heatCoeffs[0].value} (volume),{' '}
          a₁ = {spectrum.heatCoeffs[1].value} (Ricci-flat),{' '}
          a₂ = {spectrum.heatCoeffs[2].value.toFixed(5)} (∝ χ/{720})
        </div>
      </div>

      <div style={{ marginTop: 12, maxHeight: 180, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#64748b', borderBottom: '1px solid #1e293b' }}>
              <th style={{ textAlign: 'left', padding: 4 }}>s</th>
              <th style={{ textAlign: 'right', padding: 4 }}>ζ_Δ(s)</th>
              <th style={{ textAlign: 'left', padding: 4 }}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {spectrum.spectralZeta.map(({ s, value }) => (
              <tr key={s} style={{ color: '#94a3b8', borderBottom: '1px solid #0f172a' }}>
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
    </div>
  );
}
