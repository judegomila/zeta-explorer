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
//            y = x reference line. Honest scope: the truncated naive
//            spectrum does NOT match the zeros -- the page exposes the gap.
//   Panel C: per-N RMS residual on the first 15 eigenvalues.
//
// Data source: src/data/berry-keating-xp-spectral.js (BERRY_KEATING_XP).
// All computation happens at import / build time (no runtime ODE solves).
// Pure inline SVG -- no d3 needed for these small static plots, which keeps
// the per-page bundle minimal.

import React from 'react';
import { Link } from 'react-router-dom';
import { BERRY_KEATING_XP } from '../data/berry-keating-xp-spectral.js';

// ── SVG geometry shared by the panels. ────────────────────────────────

const PANEL_W = 460;
const PANEL_H = 320;
const PAD = { top: 28, right: 16, bottom: 42, left: 52 };
const IW = PANEL_W - PAD.left - PAD.right;
const IH = PANEL_H - PAD.top - PAD.bottom;

const N_COLOURS = {
  50: '#60a5fa',  // blue
  100: '#a855f7', // purple
  200: '#f97316', // orange
};

const ZERO_COLOUR = '#22c55e';

const labelStyle = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 10,
  fill: 'var(--text-secondary, #94a3b8)',
};

const tickStyle = {
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 9,
  fill: '#94a3b8',
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
        <rect x={0} y={0} width={IW} height={IH} fill="rgba(15, 23, 42, 0.55)" stroke="#1e293b" />

        {/* Axes. */}
        <line x1={x(X_LO)} y1={p(0)} x2={x(X_HI)} y2={p(0)} stroke="#475569" strokeWidth={1} />
        <line x1={x(0)} y1={p(P_LO)} x2={x(0)} y2={p(P_HI)} stroke="#475569" strokeWidth={1} />

        {/* X ticks. */}
        {[-6, -4, -2, 0, 2, 4, 6].map((tx) => (
          <g key={'xt-' + tx}>
            <line x1={x(tx)} y1={p(0) - 3} x2={x(tx)} y2={p(0) + 3} stroke="#64748b" />
            <text x={x(tx)} y={p(0) + 14} textAnchor="middle" style={tickStyle}>{tx}</text>
          </g>
        ))}
        {/* P ticks. */}
        {[-8, -4, 0, 4, 8].map((tp) => (
          <g key={'pt-' + tp}>
            <line x1={x(0) - 3} y1={p(tp)} x2={x(0) + 3} y2={p(tp)} stroke="#64748b" />
            <text x={x(0) - 6} y={p(tp) + 3} textAnchor="end" style={tickStyle}>{tp}</text>
          </g>
        ))}

        {/* Level sets. */}
        {BERRY_KEATING_XP.phasePortraitLevelSets.map((set, idx) => {
          const hue = 200 + idx * 30;
          const stroke = 'hsl(' + hue + ', 80%, 65%)';
          const runs = clippedSegments(set.points);
          return (
            <g key={'set-' + set.energy}>
              {runs.map((run, ri) => {
                const d = run.map((pt, j) => (j === 0 ? 'M' : 'L') + x(pt.x).toFixed(2) + ' ' + p(pt.p).toFixed(2)).join(' ');
                return <path key={ri} d={d} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.85} />;
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
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: '#cbd5e1', fontWeight: 700 }}>
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
        <rect x={0} y={0} width={IW} height={IH} fill="rgba(15, 23, 42, 0.55)" stroke="#1e293b" />

        {/* Grid lines. */}
        {ticks.map((t) => (
          <g key={'gx-' + t}>
            <line x1={x(t)} y1={0} x2={x(t)} y2={IH} stroke="#1e293b" strokeWidth={0.5} />
            <line x1={0} y1={y(t)} x2={IW} y2={y(t)} stroke="#1e293b" strokeWidth={0.5} />
          </g>
        ))}

        {/* Reference y = x line. */}
        <path d={refLine} stroke="#475569" strokeDasharray="4,3" strokeWidth={1.2} fill="none" />
        <text x={x(hi) - 4} y={y(hi) + 10} textAnchor="end" style={{ ...labelStyle, fill: '#94a3b8' }}>
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
                stroke="#0f172a"
                strokeWidth={0.8}
                opacity={0.92}
              />
            ))}
          </g>
        ))}

        {/* Axes. */}
        {ticks.map((t) => (
          <g key={'ax-' + t}>
            <line x1={x(t)} y1={IH} x2={x(t)} y2={IH + 3} stroke="#64748b" />
            <text x={x(t)} y={IH + 14} textAnchor="middle" style={tickStyle}>{t}</text>
            <line x1={0} y1={y(t)} x2={-3} y2={y(t)} stroke="#64748b" />
            <text x={-6} y={y(t) + 3} textAnchor="end" style={tickStyle}>{t}</text>
          </g>
        ))}

        <text x={IW / 2} y={IH + 30} textAnchor="middle" style={labelStyle}>Riemann zero ordinate gamma_k</text>
        <text x={-IH / 2} y={-36} textAnchor="middle" transform={'rotate(-90)'} style={labelStyle}>computed eigenvalue E_k(N)</text>
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: '#cbd5e1', fontWeight: 700 }}>
          Panel B: eigenvalues vs zeros (first {K} indices)
        </text>

        {/* Legend. */}
        {[50, 100, 200].map((N, i) => (
          <g key={'leg-' + N}>
            <circle cx={12} cy={14 + i * 14} r={4} fill={N_COLOURS[N]} stroke="#0f172a" strokeWidth={0.8} />
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
        <rect x={0} y={0} width={IW} height={IH} fill="rgba(15, 23, 42, 0.55)" stroke="#1e293b" />

        {/* Y ticks. */}
        {[0, hi / 4, hi / 2, (3 * hi) / 4, hi].map((t, i) => (
          <g key={'rt-' + i}>
            <line x1={0} y1={y(t)} x2={IW} y2={y(t)} stroke="#1e293b" strokeWidth={0.5} />
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
              <rect x={cx - barW / 2} y={yTop} width={barW} height={IH - yTop} fill={N_COLOURS[N]} opacity={0.85} stroke="#0f172a" />
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
        <text x={IW / 2} y={-10} textAnchor="middle" style={{ ...labelStyle, fill: '#cbd5e1', fontWeight: 700 }}>
          Panel C: RMS residual vs truncation N
        </text>
      </g>
    </svg>
  );
}

// ── Page shell. ────────────────────────────────────────────────────────

export default function BerryKeatingXpPage() {
  const Ns = BERRY_KEATING_XP.matrixDimensions;
  const rmsByN = BERRY_KEATING_XP.fitQuality;

  return (
    <div className="page" style={{ maxWidth: 1480, margin: '0 auto', padding: '16px 24px 48px' }}>
      <div className="page-header">
        <h1>Berry-Keating xp Hamiltonian -- spectral conjecture (imp-1101)</h1>
        <p className="page-subtitle">
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
        <div style={{ marginTop: 10 }}>
          <Link to="/" style={{ color: '#a855f7', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            &larr; home
          </Link>
        </div>
      </div>

      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: 8,
        color: '#fecaca',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 12,
        lineHeight: 1.55,
      }}>
        <strong>Honest scope -- this page exhibits a GAP, not a success.</strong>{' '}
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
        <Link to="/hamiltonian" style={{ color: '#fca5a5', fontWeight: 700 }}>/hamiltonian</Link>
        {' '}for the operator-construction context and{' '}
        <Link to="/gap-closing" style={{ color: '#fca5a5', fontWeight: 700 }}>/gap-closing</Link>
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
                  <td style={{ ...tdStyle, color: '#facc15' }}>{rmsByN[N].toFixed(3)}</td>
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
        <h2 style={h2Style}>Construction (math)</h2>
        <ul style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 13, lineHeight: 1.7, paddingLeft: 20 }}>
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
        <ul style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 12, lineHeight: 1.6, paddingLeft: 20, fontFamily: 'var(--font-mono, monospace)' }}>
          {BERRY_KEATING_XP.references.map((ref, i) => (
            <li key={'ref-' + i}>{ref}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Style helpers. ─────────────────────────────────────────────────────

const panelStyle = {
  background: 'var(--bg-panel, #0b1220)',
  border: '1px solid var(--border, #1e293b)',
  borderRadius: 8,
  padding: 12,
  overflowX: 'auto',
};

const sectionStyle = {
  background: 'var(--bg-panel, #0b1220)',
  border: '1px solid var(--border, #1e293b)',
  borderRadius: 8,
  padding: 16,
};

const h2Style = {
  fontSize: 16,
  color: 'var(--text-primary, #e2e8f0)',
  marginTop: 0,
  marginBottom: 12,
  fontFamily: 'var(--font-mono, monospace)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: 12,
};

const thStyle = {
  textAlign: 'left',
  padding: '6px 8px',
  borderBottom: '1px solid var(--border, #1e293b)',
  color: 'var(--text-secondary, #94a3b8)',
  fontWeight: 600,
};

const tdStyle = {
  padding: '6px 8px',
  borderBottom: '1px solid rgba(30, 41, 59, 0.6)',
  color: 'var(--text-primary, #cbd5e1)',
};
