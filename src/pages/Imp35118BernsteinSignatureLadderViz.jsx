import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT } from '../data/imp-35012-crossover-complete-monotonicity-bernstein-assessment.js';
import { ED } from '../styles/tokens.js';

// n = 1..12 derivative order on the post-peak ramp. Three sign traces, all pure sign arithmetic:
//   actual:     sign(g^(n))            = (-1)^(n+1)   (imp-34957/imp-34880 inherited data)
//   cmOfG:      sign CM of g requires  = (-1)^n       (g nonnegative, decreasing, convex, ...)
//   bernstein:  sign Bernstein requires = (-1)^(n-1)  (g_prime completely monotone)
const ORDERS = Array.from({ length: 12 }, (_, i) => i + 1);
const ROWS = ORDERS.map((n) => {
  const actual = Math.pow(-1, n + 1);
  const cmOfG = Math.pow(-1, n);
  const bernstein = Math.pow(-1, n - 1);
  return { n, actual, cmOfG, bernstein, matchesCm: actual === cmOfG, matchesBernstein: actual === bernstein };
});
const everyOrderOpposesCm = ROWS.every((r) => !r.matchesCm);
const everyOrderMatchesBernstein = ROWS.every((r) => r.matchesBernstein);

function SignLadderChart() {
  const svgW = 720;
  const svgH = 220;
  const padL = 56;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xAt = (n) => padL + ((n - 1) / (ORDERS.length - 1)) * cW;
  const yAt = (s) => padT + cH / 2 - s * (cH / 2 - 10);

  const pathFor = (key) => ROWS.map((r) => `${xAt(r.n)},${yAt(r[key])}`).join(' L ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={yAt(0)} x2={padL + cW} y2={yAt(0)} stroke={ED.rule} strokeWidth={1} />
      <text x={padL - 8} y={yAt(1) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        +1
      </text>
      <text x={padL - 8} y={yAt(-1) + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        -1
      </text>
      {ORDERS.map((n) => (
        <text key={n} x={xAt(n)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        derivative order n
      </text>

      {/* CM-of-g required sign: exact mirror of the actual data at every single order */}
      <path d={`M ${pathFor('cmOfG')}`} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="5,4" />
      {/* Actual g^(n) sign, identical to the Bernstein-required trace */}
      <path d={`M ${pathFor('actual')}`} fill="none" stroke={ED.series3} strokeWidth={2.5} />

      {ROWS.map((r) => (
        <g key={r.n}>
          <circle cx={xAt(r.n)} cy={yAt(r.actual)} r={4} fill={ED.series3} />
          <circle cx={xAt(r.n)} cy={yAt(r.cmOfG)} r={3} fill={ED.series2} />
        </g>
      ))}

      <g>
        <rect x={padL + 8} y={padT} width={10} height={10} fill={ED.series3} />
        <text x={padL + 22} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          actual sign(g^(n)) = Bernstein-required sign (match at every n)
        </text>
        <rect x={padL + 8} y={padT + 16} width={10} height={10} fill={ED.series2} />
        <text x={padL + 22} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          sign complete-monotonicity of g would require (opposite at every n)
        </text>
      </g>
    </svg>
  );
}

function SignTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)', minWidth: 620 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>n</th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              sign(g^(n)) actual
            </th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              CM of g requires
            </th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              matches CM?
            </th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              Bernstein requires
            </th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              matches Bernstein?
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.n}>
              <td style={{ padding: '3px 8px' }}>{r.n}</td>
              <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {r.actual > 0 ? '+' : '-'}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-2)' }}>
                {r.cmOfG > 0 ? '+' : '-'}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'center', color: r.matchesCm ? 'var(--series-3)' : 'var(--series-2)' }}>
                {r.matchesCm ? 'yes' : 'no'}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'center', fontFamily: 'monospace', color: 'var(--series-3)' }}>
                {r.bernstein > 0 ? '+' : '-'}
              </td>
              <td
                style={{ padding: '3px 8px', textAlign: 'center', color: r.matchesBernstein ? 'var(--series-3)' : 'var(--series-2)' }}
              >
                {r.matchesBernstein ? 'yes' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const A = IMP35012_CROSSOVER_COMPLETE_MONOTONICITY_BERNSTEIN_ASSESSMENT;

export default function Imp35118BernsteinSignatureLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Bernstein-Signature Derivative Sign Ladder (imp-35118 / imp-35012)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        On the post-peak ramp the inherited surrogate crossover-map derivative has definite sign
        sign(g^(n)) = (-1)^(n+1). That is exactly the sign a BERNSTEIN function requires of its
        derivatives ((-1)^(n-1) g^(n) &ge; 0, i.e. g_prime completely monotone) -- and, since
        (-1)^(n+1) is the exact opposite of (-1)^n at every single order, it is exactly NOT the
        sign a completely-monotone g would require. The two dashed/solid traces below never touch:
        one full sign-flip, at every n, not just the first two orders.
      </p>

      <SignLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Sign ladder through n=12: the actual data coincides with the Bernstein-required signature at
        every order (matchesBernsteinAllOrders={String(everyOrderMatchesBernstein)}) and opposes the
        complete-monotonicity-of-g signature at every order
        (opposesCmAllOrders={String(everyOrderOpposesCm)}).
      </p>
      <SignTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page plotting pure sign
        arithmetic ((-1)^(n+1) vs (-1)^n vs (-1)^(n-1)) against the imp-35012 classification
        (completeMonotonicityOfGRefuted={String(A.completeMonotonicityOfGRefuted)},
        bernsteinSignatureMatchesInheritedSign={String(A.bernsteinSignatureMatchesInheritedSign)}). This
        is a re-derivation of the INHERITED imp-3220/imp-3406/imp-34957/imp-34880 surrogate-map
        derivative signs ONLY: it establishes no operator positivity, no Bernstein/Levy-Khintchine
        representation is constructed here (that follows from, but is not shown by, this sign chart),
        and it changes no bound. C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz
        (imp-2642/imp-2643) are untouched; no RH verdict, NO QED.
      </div>
    </div>
  );
}
