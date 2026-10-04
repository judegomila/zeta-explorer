import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT } from '../data/imp-35240-rho-prefactor-finer-grid-remeasurement.js';
import { ED } from '../styles/tokens.js';

const D = IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT;

// Log-x chart: K(eps) = (rho - 2/3) / eps^{3/2} climbing toward the closed form as eps shrinks,
// with the derived 8 sqrt(2)/(9 pi) line and the refuted 2/5 line for contrast.
function PrefactorLadderChart() {
  const svgW = 680;
  const padL = 62;
  const padR = 20;
  const padT = 44;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const logEps = D.ladder.map((r) => Math.log10(r.eps));
  const xMin = Math.min(...logEps);
  const xMax = Math.max(...logEps);
  const yMin = D.candidateTwoFifths - 0.00005;
  const yMax = D.kClosedFormValue + 0.00005;
  const xOf = (lx) => padL + ((lx - xMin) / (xMax - xMin)) * plotW;
  const yOf = (k) => padT + plotH - ((k - yMin) / (yMax - yMin)) * plotH;

  const kPath = D.ladder
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(Math.log10(r.eps))} ${yOf(r.K)}`)
    .join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        K(eps) = (rho(eps) - 2/3) / eps^1.5 vs log10 eps, eps = 1e-4 .. 1e-6
      </text>
      <line
        x1={padL}
        y1={yOf(D.kClosedFormValue)}
        x2={padL + plotW}
        y2={yOf(D.kClosedFormValue)}
        stroke={ED.series3}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + 4} y={yOf(D.kClosedFormValue) - 6} fill={ED.series3} fontSize={9}>
        8&radic;2/(9&pi;) = {D.kClosedFormValue.toFixed(5)}
      </text>
      <line
        x1={padL}
        y1={yOf(D.candidateTwoFifths)}
        x2={padL + plotW}
        y2={yOf(D.candidateTwoFifths)}
        stroke={ED.series2}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <text x={padL + 4} y={yOf(D.candidateTwoFifths) + 12} fill={ED.series2} fontSize={9}>
        refuted 2/5 = {D.candidateTwoFifths.toFixed(4)}
      </text>
      <path d={kPath} fill="none" stroke={ED.series5} strokeWidth={2.25} />
      {D.ladder.map((r) => (
        <circle key={r.eps} cx={xOf(Math.log10(r.eps))} cy={yOf(r.K)} r={3.5} fill={ED.brassDeco} />
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 8} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
        log10(eps), descending left-to-right as N grows (N = 2&pi;/eps^2)
      </text>
      {[yMin, D.candidateTwoFifths, D.kClosedFormValue, yMax].map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v.toFixed(5)}
        </text>
      ))}
      <g>
        <circle cx={padL + 4} cy={padT - 12} r={3} fill={ED.brassDeco} />
        <text x={padL + 12} y={padT - 8} fill={ED.brass} fontSize={8.5}>
          measured K(eps)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35272PrefactorLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="rho(eps) Prefactor Ladder: K(eps) &rarr; 8&radic;2/(9&pi;) (imp-35272 / imp-35240)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-35240 pushed the model-cusp deviation modulus dev(eps)&nbsp;=&nbsp;|rho(eps)&nbsp;&minus;&nbsp;2/3|
        a further &sim;3 decades below the imp-35193 floor (eps down to 1e-6, N&nbsp;&sim;&nbsp;6.3e12) using a
        compensated finite-cutoff quadrature. The prefactor K(eps)&nbsp;=&nbsp;dev/eps^1.5 climbs monotonically
        toward the imp-35216 derived closed form 8&radic;2/(9&pi;)&nbsp;=&nbsp;{D.kClosedFormValue.toFixed(5)},
        landing {D.distToClosedForm.toExponential(2)} away at the smallest rung &mdash;
        {' '}{D.discriminationRatio.toFixed(0)}x closer than to the near-miss candidate 2/5&nbsp;=&nbsp;
        {D.candidateTwoFifths.toFixed(4)}, which this ladder decisively refutes.
      </p>

      <PrefactorLadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>eps</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>N = 2&pi;/eps&sup2;</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rho(eps)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>K(eps) = dev/eps^1.5</th>
          </tr>
        </thead>
        <tbody>
          {D.ladder.map((r) => (
            <tr key={r.eps} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.eps.toExponential(1)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.rho.toFixed(10)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.K.toFixed(8)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.8rem', marginTop: '1rem' }}>
        At the smallest rung (eps&nbsp;=&nbsp;{D.bestEps.toExponential(0)}, N&nbsp;&sim;&nbsp;
        {D.bestN.toExponential(2)}) the measured K&nbsp;=&nbsp;{D.bestK.toFixed(8)} sits
        {' '}{D.distToClosedForm.toExponential(2)} from 8&radic;2/(9&pi;) but {D.distToTwoFifths.toExponential(2)}{' '}
        from 2/5 &mdash; the residual to the closed form shrinks like O(eps) as the ladder deepens, the
        signature of a genuine next-order term rather than a numerical coincidence.
      </p>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-35240
        measurement literals verbatim (no new computation). A finer eps ladder discriminating a prefactor
        to &sim;3e-7 is MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate;
        does NOT certify a uniform modulus, does NOT discharge O3 or G6a_shock_lipschitz (both stay OPEN);
        establishes no operator positivity; imp-3066 off-diagonal endpoint-Hankel K_a&nbsp;&ge;&nbsp;0
        UNTOUCHED; C_mb GUE-conditional per imp-486; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
