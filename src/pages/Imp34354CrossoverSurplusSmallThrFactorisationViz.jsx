import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34354_FACTORISED_LADDER,
  IMP34354_LOCAL_EXPONENTS,
  IMP34354_OLS_FITS,
} from '../data/imp-34354-crossover-surplus-small-thr-factorisation-viz-data.js';
import { ED } from '../styles/tokens.js';

// F1: bar chart of surplus/(thr.r) climbing monotonically toward 1 across the threshold family
// -- shows the prefactor P(thr) contributes exactly one power of thr.
function PrefactorLinearityBars() {
  const svgW = 640;
  const svgH = 260;
  const padL = 50;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yAt = (v) => padT + cH - v * cH;
  const n = IMP34354_FACTORISED_LADDER.length;
  const slot = cW / n;
  const barW = slot * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}

      {IMP34354_FACTORISED_LADDER.map((row, i) => {
        const xCenter = padL + slot * i + slot / 2;
        const x = xCenter - barW / 2;
        const top = yAt(row.surplus_over_thr_r);
        const bottom = padT + cH;
        return (
          <g key={row.thr}>
            <rect x={x} y={top} width={barW} height={bottom - top} fill={ED.series3} stroke={ED.paper} strokeWidth={0.75} />
            <text x={xCenter} y={top - 6} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
              {row.surplus_over_thr_r.toFixed(4)}
            </text>
            <text x={xCenter} y={padT + cH + 16} textAnchor="middle" fill={ED.ink} fontSize={10}>
              thr={row.thr}
            </text>
          </g>
        );
      })}

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        surplus/(thr&middot;r)
      </text>
    </svg>
  );
}

// F2/F3: grouped line chart of the local composite exponent vs the r-exponent across windows,
// with reference lines at 1 (linear), 2 (quadratic), and 3 (cubic) -- shows the composite sits
// strictly between 2 and 3 while the r-exponent drops below 2.
function ExponentConvergenceLines() {
  const svgW = 640;
  const svgH = 300;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const yMin = 1.5;
  const yMax = 3.5;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;
  const n = IMP34354_LOCAL_EXPONENTS.length;
  const xAt = (i) => padL + (cW * i) / (n - 1);

  const refLines = [2, 3];

  const compositePts = IMP34354_LOCAL_EXPONENTS.map((row, i) => `${xAt(i)},${yAt(row.composite)}`).join(' ');
  const rPts = IMP34354_LOCAL_EXPONENTS.map((row, i) => `${xAt(i)},${yAt(row.r_exponent)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[1.5, 2, 2.5, 3, 3.5].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {refLines.map((v) => (
        <line
          key={'ref' + v}
          x1={padL}
          y1={yAt(v)}
          x2={padL + cW}
          y2={yAt(v)}
          stroke={ED.rule}
          strokeWidth={1}
          strokeDasharray="4,3"
        />
      ))}

      <polyline points={compositePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={rPts} fill="none" stroke={ED.series7} strokeWidth={2} />

      {IMP34354_LOCAL_EXPONENTS.map((row, i) => (
        <g key={row.window}>
          <circle cx={xAt(i)} cy={yAt(row.composite)} r={3.5} fill={ED.series1} />
          <circle cx={xAt(i)} cy={yAt(row.r_exponent)} r={3.5} fill={ED.series7} />
          <text x={xAt(i)} y={padT + cH + 16} textAnchor="middle" fill={ED.ink} fontSize={9.5}>
            {row.window}
          </text>
        </g>
      ))}

      <g>
        <rect x={padL + cW - 150} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + cW - 136} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          composite (surplus)
        </text>
        <rect x={padL + cW - 150} y={padT + 16} width={10} height={10} fill={ED.series7} />
        <text x={padL + cW - 136} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          r-exponent
        </text>
      </g>
    </svg>
  );
}

export default function Imp34354CrossoverSurplusSmallThrFactorisationViz() {
  const first = IMP34354_FACTORISED_LADDER[0];
  const last = IMP34354_FACTORISED_LADDER[IMP34354_FACTORISED_LADDER.length - 1];
  const deepest = IMP34354_LOCAL_EXPONENTS[IMP34354_LOCAL_EXPONENTS.length - 1];

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Surplus Small-thr Factorisation (imp-34354 / imp-34248)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34174 gave the crossover surplus in closed form, surplus(thr) = thr(1&minus;thr)r/(1+(1&minus;thr)r)
        with r = E_flow(N_cross)/E_trunc, collapsing {first.surplus.toExponential(4)} (thr={first.thr}) to{' '}
        {last.surplus.toExponential(4)} (thr={last.thr}) &mdash; but never separated the two vanishing factors.
        imp-34248 writes surplus(thr) = P(thr)&middot;r(thr): the target-share prefactor P(thr) is
        asymptotically <em>linear</em> in thr (F1), while r(thr) vanishes as a log-softened{' '}
        <em>~thr<sup>{IMP34354_OLS_FITS.deep_tail_r_slope.toFixed(2)}</sup></em> (F2, below the naive thr
        <sup>2</sup>), giving a <em>super-linear</em> composite collapse
        ~thr<sup>{IMP34354_OLS_FITS.deep_tail_composite_slope.toFixed(2)}</sup> (F3) &mdash; strictly faster
        than thr, strictly slower than the naive thr<sup>3</sup>.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        F1: surplus/(thr&middot;r) climbs monotonically toward 1 &mdash; the prefactor contributes exactly one power of thr
      </p>
      <PrefactorLinearityBars />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        F2/F3: local composite exponent (d log surplus / d log thr) vs r-exponent (d log r / d log thr), per window
      </p>
      <ExponentConvergenceLines />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N_cross(thr)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r = E_flow/E_trunc</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>prefactor P(thr)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>surplus</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>surplus/(thr&middot;r)</th>
          </tr>
        </thead>
        <tbody>
          {IMP34354_FACTORISED_LADDER.map((row) => (
            <tr key={row.thr} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.thr}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.N_cross.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.r.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.prefactor_P.toFixed(5)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.surplus.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.surplus_over_thr_r.toFixed(5)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table
        style={{
          width: '100%',
          marginTop: '1.25rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>composite exponent</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>r-exponent</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>prefactor share (composite &minus; r)</th>
          </tr>
        </thead>
        <tbody>
          {IMP34354_LOCAL_EXPONENTS.map((row) => (
            <tr key={row.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.window}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.composite.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.r_exponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.prefactor_share.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>OLS fits:</strong> deep-tail (thr&isin;{'{'}0.1,0.05,0.01{'}'}) composite
        slope {IMP34354_OLS_FITS.deep_tail_composite_slope} = 1 (linear prefactor) +{' '}
        {IMP34354_OLS_FITS.deep_tail_r_slope} (log-softened r-exponent); the deepest window ({deepest.window})
        prefactor share is {deepest.prefactor_share.toFixed(4)}, within ~0.03 of 1. All-rung composite slope{' '}
        {IMP34354_OLS_FITS.all_rungs_composite_slope}.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked literals
        reproducing the imp-34248 measurement; no new derivation, no bound changed. Derivation/measurement
        only within the inherited imp-34174/imp-33743 extrapolation component model, which is NOT a rigorous
        asymptotic; E_flow is the benign mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT
        touch the divergent C_Lip collision-Gronwall; C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8
        ansatz untouched; imp-3066 K_a&ge;0 untouched; NO QED.
      </div>
    </div>
  );
}
