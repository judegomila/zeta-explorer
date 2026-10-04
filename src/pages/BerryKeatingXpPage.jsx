// BerryKeatingXpPage -- imp-1101
//
// Three-panel exploration of the Berry-Keating (1999) conjecture that the
// Riemann zero ordinates are the eigenvalues of a self-adjoint quantization
// of the classical Hamiltonian H = x * p:
//
//   Panel A: classical phase portrait -- level sets x * p = E for E in
//            {0.5, 1, 2, 5, 10} drawn as hyperbolas in the (x, p) plane.
//   Panel B: scatter plot of computed eigenvalues of the symmetrized
//            H_sym = (xp + px)/2 in the truncated Hermite basis at N = 50,
//            100, 200, against the first 30 Odlyzko zero ordinates, with a
//            y = x reference line. Scope: the truncated naive
//            spectrum does NOT match the zeros -- the page exposes the gap.
//   Panel C: per-N RMS residual on the first 15 eigenvalues.
//
// Data source: src/data/berry-keating-xp-spectral.js (BERRY_KEATING_XP).
// All computation happens at import / build time (no runtime ODE solves).
// Pure inline SVG -- no d3 needed for these small static plots, which keeps
// the per-page bundle minimal.
//
// Editorial (warm) re-theme: full-width post shell, identical structure/data.

import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { BERRY_KEATING_XP } from '../data/berry-keating-xp-spectral.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED } from '../styles/tokens.js';

// ── SVG geometry shared by the panels. ────────────────────────────────

const PANEL_W = 460;
const PANEL_H = 320;
const PAD = { top: 28, right: 16, bottom: 42, left: 52 };
const IW = PANEL_W - PAD.left - PAD.right;
const IH = PANEL_H - PAD.top - PAD.bottom;

const N_COLOURS = {
  50: 'var(--blue)',
  100: 'var(--brass-dk)',
  200: 'var(--terra-dk)',
};

const ZERO_COLOUR = 'var(--green)';

const labelStyle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 10,
  fill: 'var(--ink-soft)',
};

const tickStyle = {
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 9,
  fill: 'var(--faint)',
};

// Linear scale helper -- avoids pulling in d3 for these tiny static plots.
function linearScale(domainLo, domainHi, rangeLo, rangeHi) {
  return (v) => rangeLo + ((v - domainLo) / (domainHi - domainLo)) * (rangeHi - rangeLo);
}

// ── Panel A: classical phase portrait, hyperbolas xp = E. ─────────────

function PhasePortrait() {
  const X_HI = 6;
  const X_LO = -6;
  const P_HI = 8;
  const P_LO = -8;
  const x = linearScale(X_LO, X_HI, 0, IW);
  const p = linearScale(P_LO, P_HI, IH, 0);

  // Build a clipped polyline for each level set: drop points outside the
  // (X, P) plotting window.
  function clippedSegments(points) {
    // Split on consecutive in-range runs.
    const runs = [];
    let cur = [];
    for (const pt of points) {
      const inX = pt.x >= X_LO && pt.x <= X_HI;
      const inP = pt.p >= P_LO && pt.p <= P_HI;
      if (inX && inP) {
        cur.push(pt);
      } else if (cur.length > 0) {
        runs.push(cur);
        cur = [];
      }
    }
    if (cur.length > 0) runs.push(cur);
    return runs;
  }

  return (
    <svg width={PANEL_W} height={PANEL_H} role="img" aria-label="phase portrait of H = x*p">
      <g transform={'translate(' + PAD.left + ',' + PAD.top + ')'}>
        {/* Background. */}
        <rect x={0} y={0} width={IW} height={IH} fill={ED.paper} stroke={ED.rule} />

        {/* Axes. */}
        <line x1={x(X_LO)} y1={p(0)} x2={x(X_HI)} y2={p(0)} stroke={ED.inkSoft} strokeWidth={1} />
        <line x1={x(0)} y1={p(P_LO)} x2={x(0)} y2={p(P_HI)} stroke={ED.inkSoft} strokeWidth={1} />

        {/* X ticks. */}
        {[-6, -4, -2, 0, 2, 4, 6].map((tx) => (
          <g key={'xt-' + tx}>
            <line x1={x(tx)} y1={p(0) - 3} x2={x(tx)} y2={p(0) + 3} stroke={ED.rule} />
            <text x={x(tx)} y={p(0) + 14} textAnchor="middle" style={tickStyle}>{tx}</text>
          </g>
        ))}
        {/* P ticks. */}
        {[-8, -4, 0, 4, 8].map((tp) => (
          <g key={'pt-' + tp}>
            <line x1={x(0) - 3} y1={p(tp)} x2={x(0) + 3} y2={p(tp)} stroke={ED.rule} />
            <text x={x(0) - 6} y={p(tp) + 3} textAnchor="end" style={tickStyle}>{tp}</text>
          </g>
        ))}

        {/* Level sets. */}
        {BERRY_KEATING_XP.phasePortraitLevelSets.map((set, idx) => {
          const hue = 200 + idx * 30;
          const stroke = 'hsl(' + hue + ', 58%, 40%)';
          const runs = clippedSegments(set.points);
          return (
            <g key={'set-' + set.energy}>
              {runs.map((run, ri) => {
                const d = run.map((pt, j) => (j === 0 ? 'M' : 'L') + x(pt.x).toFixed(2) + ' ' + p(pt.p).toFixed(2)).join(' ');
                return <path key={ri} d={d} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.9} />;
              })}
              <text x={IW - 4} y={14 + idx * 12} textAnchor="end" style={{ ...labelStyle, fill: stroke }}>
                E = {set.energy}
              </text>
            </g>
          );
        })}

        {/* Axis titles. */}
        <text x={IW / 2} y={IH + 26} textAnchor="middle" style={labelStyle}>position x</text>
        <text x={-IH / 2} y={-36} textAnchor="middle" transform={'rotate(-90)'} style={labelStyle}>momentum p</text>
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: 'var(--ink)', fontWeight: 700 }}>
          Panel A: classical level sets x * p = E
        </text>
      </g>
    </svg>
  );
}

// ── Panel B: eigenvalue-vs-Riemann-zero scatter with y = x reference. ──

function EigenvalueScatter() {
  const zeros = BERRY_KEATING_XP.riemannZerosFirstK;
  const dataByN = {
    50: BERRY_KEATING_XP.eigenvaluesAtN50,
    100: BERRY_KEATING_XP.eigenvaluesAtN100,
    200: BERRY_KEATING_XP.eigenvaluesAtN200,
  };
  // K = the number of overlapped indices = min(30, smallest eigenvalue list).
  const K = Math.min(
    zeros.length,
    dataByN[50].length,
    dataByN[100].length,
    dataByN[200].length,
  );

  // Find ranges: x = Riemann zero, y = computed eigenvalue. The Berry-Keating
  // truncated-Hermite eigenvalues are MUCH smaller than the zero ordinates,
  // so the plot domain covers the full union to keep the gap visually obvious.
  let lo = 0;
  let hi = zeros[K - 1];
  for (const N of [50, 100, 200]) {
    for (let i = 0; i < K; i++) {
      if (dataByN[N][i] > hi) hi = dataByN[N][i];
    }
  }
  hi = Math.ceil(hi / 10) * 10;

  const x = linearScale(lo, hi, 0, IW);
  const y = linearScale(lo, hi, IH, 0);

  // Reference y = x line.
  const refLine = 'M' + x(lo) + ' ' + y(lo) + ' L' + x(hi) + ' ' + y(hi);

  // Tick choice: 0, 25, 50, 75, 100 if hi >= 100; else round-friendly.
  const ticks = [0, 25, 50, 75, 100, 125].filter((t) => t <= hi);

  return (
    <svg width={PANEL_W} height={PANEL_H} role="img" aria-label="eigenvalues vs Riemann zeros scatter">
      <g transform={'translate(' + PAD.left + ',' + PAD.top + ')'}>
        <rect x={0} y={0} width={IW} height={IH} fill={ED.paper} stroke={ED.rule} />

        {/* Grid lines. */}
        {ticks.map((t) => (
          <g key={'gx-' + t}>
            <line x1={x(t)} y1={0} x2={x(t)} y2={IH} stroke={ED.ruleSoft} strokeWidth={0.5} />
            <line x1={0} y1={y(t)} x2={IW} y2={y(t)} stroke={ED.ruleSoft} strokeWidth={0.5} />
          </g>
        ))}

        {/* Reference y = x line. */}
        <path d={refLine} stroke={ED.inkSoft} strokeDasharray="4,3" strokeWidth={1.2} fill="none" />
        <text x={x(hi) - 4} y={y(hi) + 10} textAnchor="end" style={{ ...labelStyle, fill: 'var(--faint)' }}>
          y = x (perfect match)
        </text>

        {/* Plot Odlyzko zeros on the x = zero axis baseline (just diagonal markers). */}
        {/* But the requirement is: scatter of computed eigenvalues vs Riemann zeros.
            For each N and each k in 0..K-1, plot point (zero_k, eig_N[k]). */}
        {[50, 100, 200].map((N) => (
          <g key={'pts-' + N}>
            {dataByN[N].slice(0, K).map((eig, k) => (
              <circle
                key={'pt-' + N + '-' + k}
                cx={x(zeros[k])}
                cy={y(eig)}
                r={3.2}
                fill={N_COLOURS[N]}
                stroke={ED.ink}
                strokeWidth={0.8}
                opacity={0.92}
              />
            ))}
          </g>
        ))}

        {/* Axes. */}
        {ticks.map((t) => (
          <g key={'ax-' + t}>
            <line x1={x(t)} y1={IH} x2={x(t)} y2={IH + 3} stroke={ED.rule} />
            <text x={x(t)} y={IH + 14} textAnchor="middle" style={tickStyle}>{t}</text>
            <line x1={0} y1={y(t)} x2={-3} y2={y(t)} stroke={ED.rule} />
            <text x={-6} y={y(t) + 3} textAnchor="end" style={tickStyle}>{t}</text>
          </g>
        ))}

        <text x={IW / 2} y={IH + 30} textAnchor="middle" style={labelStyle}>Riemann zero ordinate gamma_k</text>
        <text x={-IH / 2} y={-36} textAnchor="middle" transform={'rotate(-90)'} style={labelStyle}>computed eigenvalue E_k(N)</text>
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: 'var(--ink)', fontWeight: 700 }}>
          Panel B: eigenvalues vs zeros (first {K} indices)
        </text>

        {/* Legend. */}
        {[50, 100, 200].map((N, i) => (
          <g key={'leg-' + N}>
            <circle cx={12} cy={14 + i * 14} r={4} fill={N_COLOURS[N]} stroke={ED.ink} strokeWidth={0.8} />
            <text x={20} y={17 + i * 14} style={{ ...labelStyle, fill: N_COLOURS[N] }}>N = {N}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── Panel C: per-N RMS residual on the first 15 eigenvalues. ───────────

function RmsResidual() {
  const Ns = BERRY_KEATING_XP.matrixDimensions;
  const rmsByN = BERRY_KEATING_XP.fitQuality;
  let hi = 0;
  for (const N of Ns) if (rmsByN[N] > hi) hi = rmsByN[N];
  hi = Math.ceil(hi / 10) * 10;
  const x = linearScale(0, Ns.length, 0, IW);
  const y = linearScale(0, hi, IH, 0);

  return (
    <svg width={PANEL_W} height={PANEL_H} role="img" aria-label="RMS residual vs N">
      <g transform={'translate(' + PAD.left + ',' + PAD.top + ')'}>
        <rect x={0} y={0} width={IW} height={IH} fill={ED.paper} stroke={ED.rule} />

        {/* Y ticks. */}
        {[0, hi / 4, hi / 2, (3 * hi) / 4, hi].map((t, i) => (
          <g key={'rt-' + i}>
            <line x1={0} y1={y(t)} x2={IW} y2={y(t)} stroke={ED.ruleSoft} strokeWidth={0.5} />
            <text x={-6} y={y(t) + 3} textAnchor="end" style={tickStyle}>{t.toFixed(1)}</text>
          </g>
        ))}

        {/* Bars + value labels. */}
        {Ns.map((N, i) => {
          const cx = x(i + 0.5);
          const barW = (IW / Ns.length) * 0.6;
          const yTop = y(rmsByN[N]);
          return (
            <g key={'bar-' + N}>
              <rect x={cx - barW / 2} y={yTop} width={barW} height={IH - yTop} fill={N_COLOURS[N]} opacity={0.85} stroke={ED.ink} />
              <text x={cx} y={yTop - 6} textAnchor="middle" style={{ ...labelStyle, fill: N_COLOURS[N], fontWeight: 700 }}>
                {rmsByN[N].toFixed(2)}
              </text>
              <text x={cx} y={IH + 14} textAnchor="middle" style={tickStyle}>N = {N}</text>
            </g>
          );
        })}

        <text x={IW / 2} y={IH + 30} textAnchor="middle" style={labelStyle}>truncation dimension N</text>
        <text x={-IH / 2} y={-36} textAnchor="middle" transform={'rotate(-90)'} style={labelStyle}>
          RMS residual over first {BERRY_KEATING_XP.kFit} eigenvalues
        </text>
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: 'var(--ink)', fontWeight: 700 }}>
          Panel C: RMS residual vs truncation N
        </text>
      </g>
    </svg>
  );
}

// ── Panel D: sigma=1/2 counting-function comparison (interactive). ─────

function CountingFunctionDemo() {
  const zeros = BERRY_KEATING_XP.riemannZerosFirstK;
  const E_CHART_MIN = zeros[0] - 2;
  const E_CHART_MAX = zeros[zeros.length - 1] + 2;
  const [eVal, setEVal] = React.useState(Math.round((E_CHART_MIN + E_CHART_MAX) / 2));

  function nSmooth(E) {
    if (E < 2) return 0;
    const t = E / (2 * Math.PI);
    if (t <= 0) return 0;
    return Math.max(0, t * (Math.log(t) - 1) + 7 / 8);
  }

  function nActual(E) {
    let count = 0;
    for (const z of zeros) if (z <= E) count++;
    return count;
  }

  const ns = nSmooth(eVal);
  const na = nActual(eVal);
  const residual = na - ns;

  const N_SAMP = 100;
  const pts = [];
  for (let i = 0; i <= N_SAMP; i++) {
    const E = E_CHART_MIN + (E_CHART_MAX - E_CHART_MIN) * i / N_SAMP;
    pts.push({ E, smooth: nSmooth(E), actual: nActual(E) });
  }

  let maxN = 1;
  for (const p of pts) {
    if (p.smooth > maxN) maxN = p.smooth;
    if (p.actual > maxN) maxN = p.actual;
  }
  maxN = Math.ceil(maxN) + 2;

  const xS = linearScale(E_CHART_MIN, E_CHART_MAX, 0, IW);
  const yS = linearScale(0, maxN, IH, 0);

  const smoothPath = pts.map((p, i) =>
    (i === 0 ? 'M' : 'L') + xS(p.E).toFixed(2) + ' ' + yS(p.smooth).toFixed(2)
  ).join(' ');
  const actualPath = pts.map((p, i) =>
    (i === 0 ? 'M' : 'L') + xS(p.E).toFixed(2) + ' ' + yS(p.actual).toFixed(2)
  ).join(' ');

  const xCur = xS(eVal);
  const eTicks = [20, 30, 40, 50, 60, 70, 80, 90, 100].filter(
    (t) => t >= Math.ceil(E_CHART_MIN) && t <= Math.floor(E_CHART_MAX)
  );
  const nTicks = [];
  for (let t = 0; t <= maxN; t += 5) nTicks.push(t);

  return (
    <div>
      <svg width={PANEL_W} height={PANEL_H} role="img" aria-label="counting function N(E) comparison">
        <g transform={'translate(' + PAD.left + ',' + PAD.top + ')'}>
          <rect x={0} y={0} width={IW} height={IH} fill={ED.paper} stroke={ED.rule} />
          {nTicks.map((t) => (
            <g key={'yt-' + t}>
              <line x1={0} y1={yS(t)} x2={IW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={0.5} />
              <text x={-6} y={yS(t) + 3} textAnchor="end" style={tickStyle}>{t}</text>
            </g>
          ))}
          {eTicks.map((t) => (
            <g key={'xt-' + t}>
              <line x1={xS(t)} y1={IH} x2={xS(t)} y2={IH + 3} stroke={ED.rule} />
              <text x={xS(t)} y={IH + 14} textAnchor="middle" style={tickStyle}>{t}</text>
            </g>
          ))}
          <path d={smoothPath} fill="none" stroke={ED.series1} strokeWidth={2} />
          <path d={actualPath} fill="none" stroke={ED.series3} strokeWidth={1.5} />
          <line x1={xCur} y1={0} x2={xCur} y2={IH} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="3,2" />
          <text x={IW / 2} y={IH + 30} textAnchor="middle" style={labelStyle}>E (imaginary part)</text>
          <text x={-IH / 2} y={-36} textAnchor="middle" transform={'rotate(-90)'} style={labelStyle}>N(E)</text>
          <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: 'var(--ink)', fontWeight: 700 }}>
            sigma = 1/2 counting function
          </text>
          <line x1={6} y1={16} x2={26} y2={16} stroke={ED.series1} strokeWidth={2} />
          <text x={30} y={19} style={{ ...labelStyle, fill: 'var(--blue)' }}>N_smooth</text>
          <line x1={6} y1={30} x2={26} y2={30} stroke={ED.series3} strokeWidth={1.5} />
          <text x={30} y={33} style={{ ...labelStyle, fill: 'var(--green)' }}>N_actual</text>
        </g>
      </svg>
      <div style={{ marginTop: 10, fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}>
        <label style={{ color: 'var(--ink-soft)' }}>
          {'E = '}
          <strong style={{ color: 'var(--brass-dk)' }}>{eVal.toFixed(1)}</strong>
          <input
            type="range"
            min={Math.ceil(E_CHART_MIN)}
            max={Math.floor(E_CHART_MAX)}
            step={1}
            value={eVal}
            onChange={(ev) => setEVal(parseFloat(ev.target.value))}
            style={{ marginLeft: 10, verticalAlign: 'middle', width: 200 }}
          />
        </label>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <div style={{ padding: '6px 8px', background: 'color-mix(in srgb, var(--series-1) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 35%, transparent)', borderRadius: 4 }}>
            <div style={{ color: 'var(--blue)', fontSize: 10 }}>N_smooth(E)</div>
            <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 700 }}>{ns.toFixed(3)}</div>
            <div style={{ color: 'var(--faint)', fontSize: 9, marginTop: 2 }}>(E/2pi)(ln(E/2pi)-1)+7/8</div>
          </div>
          <div style={{ padding: '6px 8px', background: 'color-mix(in srgb, var(--series-3) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--series-3) 35%, transparent)', borderRadius: 4 }}>
            <div style={{ color: 'var(--green)', fontSize: 10 }}>N_actual(E)</div>
            <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 700 }}>{na}</div>
            <div style={{ color: 'var(--faint)', fontSize: 9, marginTop: 2 }}>counted from Odlyzko data</div>
          </div>
          <div style={{ padding: '6px 8px', background: 'color-mix(in srgb, var(--brass-deco) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 40%, transparent)', borderRadius: 4 }}>
            <div style={{ color: 'var(--brass-dk)', fontSize: 10 }}>residual S(E)</div>
            <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 700 }}>{(residual >= 0 ? '+' : '') + residual.toFixed(3)}</div>
            <div style={{ color: 'var(--faint)', fontSize: 9, marginTop: 2 }}>N_actual - N_smooth</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page shell. ────────────────────────────────────────────────────────

export default function BerryKeatingXpPage() {
  const Ns = BERRY_KEATING_XP.matrixDimensions;
  const rmsByN = BERRY_KEATING_XP.fitQuality;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Berry-Keating xp Hamiltonian -- spectral conjecture (imp-1101)</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, maxWidth: 780 }}>
            Berry &amp; Keating (1999) conjectured that the imaginary parts of the
            nontrivial Riemann zeros are eigenvalues of a self-adjoint quantization
            of the classical Hamiltonian H = x * p, regularized on a phase-space
            cell. This page renders the classical phase portrait (level sets of xp
            are hyperbolas), the numerically computed eigenvalues of the symmetrized
            quantum operator H_sym = (xp + px)/2 in the truncated harmonic
            oscillator basis at N in {'{50, 100, 200}'}, and the per-N RMS residual
            on the first {BERRY_KEATING_XP.kFit} eigenvalues against the first 30
            Odlyzko Riemann-zero ordinates.
          </p>
      <AnimationEmbed id="berry-keating" />

        </div>

        <div style={{
          marginTop: 16,
          padding: 12,
          background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
          borderRadius: 8,
          color: 'var(--terra-dk)',
          fontFamily: 'var(--ed-mono, var(--font-mono))',
          fontSize: 12,
          lineHeight: 1.55,
        }}>
          <strong>Scope -- this page exhibits a GAP, not a success.</strong>{' '}
          Berry-Keating is a <em>conjecture</em>. The eigenvalues of the truncated
          symmetrized H = (xp + px)/2 on the Hermite basis do NOT reproduce the
          Riemann zero ordinates, and the per-N RMS residual does NOT shrink toward
          zero as N grows (~{rmsByN[50].toFixed(0)} at N=50, ~{rmsByN[200].toFixed(0)} at
          N=200) -- so the scatter below is a <em>failure-to-match</em> exhibit, not a
          Hilbert-Polya realization. The true Hilbert-Polya operator -- if it exists
          -- would require a still-unknown prime-dependent boundary condition /
          regularization (Connes adelic / Sierra-Rodriguez-Lagares). The point of
          this page is to make the <em>scale</em> and <em>density</em> of the naive
          spectrum visible and to report the RMS residual without obfuscation; the
          values stay bounded by the order-of-magnitude tripwire (RMS &lt; 150)
          rather than being driven to zero. See{' '}
          <Link to="/hamiltonian" style={{ color: 'var(--terra-dk)', fontWeight: 700 }}>/hamiltonian</Link>
          {' '}for the operator-construction context and{' '}
          <Link to="/gap-closing" style={{ color: 'var(--terra-dk)', fontWeight: 700 }}>/gap-closing</Link>
          {' '}for the open Gap S5 (self-adjoint operator) this failure illustrates.
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 16,
          marginTop: 20,
        }}>
          <div style={panelStyle}>
            <PhasePortrait />
          </div>
          <div style={panelStyle}>
            <EigenvalueScatter />
          </div>
          <div style={panelStyle}>
            <RmsResidual />
          </div>
        </div>

        <div style={{ marginTop: 28, ...sectionStyle }}>
          <h2 style={h2Style}>Per-N RMS residual table</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>N</th>
                <th style={thStyle}>even block size</th>
                <th style={thStyle}>odd block size</th>
                <th style={thStyle}>RMS residual (k = 1..{BERRY_KEATING_XP.kFit})</th>
                <th style={thStyle}>1st eigenvalue</th>
                <th style={thStyle}>15th eigenvalue</th>
              </tr>
            </thead>
            <tbody>
              {Ns.map((N) => {
                const eigs = N === 50 ? BERRY_KEATING_XP.eigenvaluesAtN50
                            : N === 100 ? BERRY_KEATING_XP.eigenvaluesAtN100
                            : BERRY_KEATING_XP.eigenvaluesAtN200;
                return (
                  <tr key={'row-' + N}>
                    <td style={{ ...tdStyle, color: N_COLOURS[N], fontWeight: 700 }}>{N}</td>
                    <td style={tdStyle}>{Math.ceil(N / 2)}</td>
                    <td style={tdStyle}>{Math.floor(N / 2)}</td>
                    <td style={{ ...tdStyle, color: 'var(--brass-dk)' }}>{rmsByN[N].toFixed(3)}</td>
                    <td style={tdStyle}>{eigs[0].toFixed(4)}</td>
                    <td style={tdStyle}>{eigs[14].toFixed(4)}</td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ ...tdStyle, color: ZERO_COLOUR, fontWeight: 700 }}>zeros</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={tdStyle}>-</td>
                <td style={{ ...tdStyle, color: ZERO_COLOUR }}>{BERRY_KEATING_XP.riemannZerosFirstK[0].toFixed(4)}</td>
                <td style={{ ...tdStyle, color: ZERO_COLOUR }}>{BERRY_KEATING_XP.riemannZerosFirstK[14].toFixed(4)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 28, ...sectionStyle }}>
          <h2 style={h2Style}>sigma = 1/2 counting-function comparison (interactive)</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6, marginTop: 0, marginBottom: 16 }}>
            The semiclassical smooth counting formula N_smooth(E) = (E/2pi)(ln(E/2pi)-1)+7/8
            assumes all nontrivial zeros lie on sigma = 1/2. It captures the average growth
            rate but misses the oscillating residual S(E) = N_actual - N_smooth, which encodes
            prime-number fluctuations. The Berry-Keating xp operator only reproduces N_smooth;
            the oscillating part is the unresolved gap (see{' '}
            <Link to="/gap-closing" style={{ color: 'var(--brass-dk)' }}>/gap-closing</Link>).
          </p>
          <div style={{ maxWidth: PANEL_W + 60 }}>
            <CountingFunctionDemo />
          </div>
          <div style={{
            marginTop: 12,
            padding: 10,
            background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            borderRadius: 6,
            color: 'var(--terra-dk)',
            fontSize: 11,
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            lineHeight: 1.5,
          }}>
            The sigma = 1/2 input: the smooth formula is derived under the assumption that zeros
            are on the critical line. This is self-referential -- it assumes RH to count the zeros.
            The Berry-Keating conjecture suggests the xp Hamiltonian explains WHY sigma = 1/2,
            but as shown above the naive truncated operator does not reproduce the zero ordinates.
            N_smooth is an output of RH-assumed asymptotics, not a proof of it.
          </div>
        </div>

        <div style={{ marginTop: 28, ...sectionStyle }}>
          <h2 style={h2Style}>Construction (math)</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7, paddingLeft: 20 }}>
            <li>Classical Hamiltonian: H(x, p) = x * p. Level sets H = E are hyperbolas in the (x, p) plane.</li>
            <li>Quantum symmetric ordering: H_sym = (xp + px) / 2. Manifestly self-adjoint on a suitable domain.</li>
            <li>In the harmonic-oscillator number basis with a = (x + i*p)/sqrt(2), the algebra yields
                H_sym = (i / 2) * ((a^)^2 - a^2), so the matrix in |0&gt;, |1&gt;, ..., |N-1&gt; is purely imaginary
                with nonzero entries only at indices |m - n| = 2.</li>
            <li>The matrix decouples into EVEN-n and ODD-n parity blocks. Each block reduces to a real antisymmetric
                tridiagonal A; the positive eigenvalues of H_sym are the singular values of A, i.e. the square roots
                of the eigenvalues of the symmetric tridiagonal -A^2, solved by implicit-shift QL in src/data/berry-keating-xp-spectral.js.</li>
            <li>What this captures: the scaling and density of the naive truncated spectrum. What it MISSES: prime-dependent
                boundary conditions (Connes' adelic completion or Sierra-Rodriguez-Lagares' regularization on the half-line)
                that are needed to recover GUE-correlated zero spacings. See src/math/berry-keating-xp-operator.js (imp-266)
                and src/math/berry-keating-connes.js for the wider context.</li>
          </ul>
        </div>

        <div style={{ marginTop: 20, ...sectionStyle }}>
          <h2 style={h2Style}>References</h2>
          <ul style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.6, paddingLeft: 20, fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            {BERRY_KEATING_XP.references.map((ref, i) => (
              <li key={'ref-' + i}>{ref}</li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/hamiltonian" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Hamiltonian construction
            </Link>
            <Link to="/gap-closing" style={{ fontSize: 12, color: 'var(--terra-dk)', textDecoration: 'none' }}>
              → Gap-closing (Gap S5)
            </Link>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Style helpers. ─────────────────────────────────────────────────────

const panelStyle = {
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: 12,
  overflowX: 'auto',
};

const sectionStyle = {
  background: 'var(--paper2)',
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: 16,
};

const h2Style = {
  fontSize: 16,
  color: 'var(--ink)',
  marginTop: 0,
  marginBottom: 12,
  fontFamily: 'var(--ed-mono, var(--font-mono))',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--ed-mono, var(--font-mono))',
  fontSize: 12,
};

const thStyle = {
  textAlign: 'left',
  padding: '6px 8px',
  borderBottom: '1px solid var(--hairline)',
  color: 'var(--ink-soft)',
  fontWeight: 600,
};

const tdStyle = {
  padding: '6px 8px',
  borderBottom: '1px solid var(--hair2)',
  color: 'var(--ink)',
};
