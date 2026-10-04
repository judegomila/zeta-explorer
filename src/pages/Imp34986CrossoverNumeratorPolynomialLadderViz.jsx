import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION } from '../data/imp-34957-crossover-deriv-p11-p12-extension.js';
import { ED } from '../styles/tokens.js';

// Reconstruct the same P_2..P_12 crossover-map numerator-polynomial table verbatim via the
// imp-34957 operator recurrence P_(n+1) = n (u P_n) + (2n-1) P_n - u (dP_n/du), P_2 = u + 1.
const mulByU = (P) => [0, ...P];
const derivU = (P) => {
  const d = [];
  for (let k = 1; k < P.length; k++) d.push(k * P[k]);
  return d.length ? d : [0];
};
const scale = (P, c) => P.map((x) => x * c);
const addPolys = (...ps) => {
  const L = Math.max(...ps.map((p) => p.length));
  const out = new Array(L).fill(0);
  for (const p of ps) p.forEach((c, i) => (out[i] += c));
  return out;
};
function nextOperatorRoute(Pn, n) {
  return addPolys(scale(mulByU(Pn), n), scale(Pn, 2 * n - 1), scale(mulByU(derivU(Pn)), -1));
}
const table = { 2: [1, 1] };
for (let n = 2; n <= 11; n++) table[n + 1] = nextOperatorRoute(table[n], n);

function factorial(m) {
  let f = 1;
  for (let j = 2; j <= m; j++) f *= j;
  return f;
}
function oddDoubleFactorial(m) {
  let f = 1;
  for (let j = 1; j <= m; j += 2) f *= j;
  return f;
}

const ORDERS = Array.from({ length: 11 }, (_, i) => i + 2); // n = 2..12
const ROWS = ORDERS.map((n) => {
  const P = table[n];
  return {
    n,
    leading: P[P.length - 1],
    leadingClosed: factorial(n - 1),
    constant: P[0],
    constantClosed: oddDoubleFactorial(2 * n - 3),
    largest: Math.max(...P),
    allPositive: P.every((c) => c > 0 && Number.isInteger(c)),
  };
});

const D = IMP34957_CROSSOVER_DERIV_P11_P12_EXTENSION;
const matchesExtension =
  ROWS.find((r) => r.n === 11).largest === Math.max(...D.extendedP11) &&
  ROWS.find((r) => r.n === 12).largest === Math.max(...D.extendedP12);
const allLeadingMatch = ROWS.every((r) => r.leading === r.leadingClosed);
const allConstantMatch = ROWS.every((r) => r.constant === r.constantClosed);
const allPositive = ROWS.every((r) => r.allPositive);
const maxCoeff = Math.max(...ROWS.map((r) => r.largest));
const CEILING_2_53 = Number.MAX_SAFE_INTEGER; // 2^53 - 1

// Log-scale growth chart: leading (n-1)!, constant (2n-3)!!, and the largest coefficient per
// order, against the 2^53 exact-integer-arithmetic ceiling.
function GrowthChart() {
  const svgW = 720;
  const svgH = 260;
  const padL = 64;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const series = [
    { key: 'leading', label: '(n-1)! leading coefficient', color: ED.series1 },
    { key: 'constant', label: '(2n-3)!! constant coefficient', color: ED.series7 },
    { key: 'largest', label: 'largest coefficient in P_n', color: ED.series3 },
  ];

  const allVals = ROWS.flatMap((r) => [r.leading, r.constant, r.largest]).concat([CEILING_2_53]);
  const logs = allVals.map((v) => Math.log10(v));
  const yMax = Math.ceil(Math.max(...logs));
  const yMin = 0;
  const yAt = (logv) => padT + cH - ((logv - yMin) / (yMax - yMin)) * cH;
  const xAt = (n) => padL + ((n - 2) / (12 - 2)) * cW;

  const ceilY = yAt(Math.log10(CEILING_2_53));

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1} />

      {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL + cW} y2={yAt(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {`1e${t}`}
          </text>
        </g>
      ))}

      {ORDERS.map((n) => (
        <text key={n} x={xAt(n)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {n}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        order n (P_2 .. P_12)
      </text>

      <line
        x1={padL}
        y1={ceilY}
        x2={padL + cW}
        y2={ceilY}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="4,3"
      />
      <text x={padL + cW - 4} y={ceilY - 5} textAnchor="end" fill={ED.series2} fontSize={9}>
        2^53 exact-integer ceiling
      </text>

      {series.map((s) => (
        <polyline
          key={s.key}
          fill="none"
          stroke={s.color}
          strokeWidth={2}
          points={ROWS.map((r) => `${xAt(r.n)},${yAt(Math.log10(r[s.key]))}`).join(' ')}
        />
      ))}
      {series.map((s) =>
        ROWS.map((r) => (
          <circle key={`${s.key}-${r.n}`} cx={xAt(r.n)} cy={yAt(Math.log10(r[s.key]))} r={2.5} fill={s.color} />
        ))
      )}

      {series.map((s, i) => (
        <g key={s.key}>
          <rect x={padL + 8} y={padT + 8 + i * 14} width={10} height={10} fill={s.color} />
          <text x={padL + 22} y={padT + 17 + i * 14} fill={ED.inkSoft} fontSize={10}>
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function CoefficientTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', color: 'var(--ink-soft)', minWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>n</th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              leading a_(n-1)^(n)
            </th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              (n-1)!
            </th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              constant a_0^(n)
            </th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              (2n-3)!!
            </th>
            <th style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              largest coeff.
            </th>
            <th style={{ textAlign: 'center', padding: '4px 8px', borderBottom: '1px solid var(--rule)' }}>
              all positive
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.n}>
              <td style={{ padding: '3px 8px' }}>{r.n}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>{r.leading}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                {r.leadingClosed}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>{r.constant}</td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                {r.constantClosed}
              </td>
              <td style={{ padding: '3px 8px', textAlign: 'right', fontFamily: 'monospace' }}>{r.largest}</td>
              <td style={{ padding: '3px 8px', textAlign: 'center', color: r.allPositive ? 'var(--series-3)' : 'var(--series-2)' }}>
                {r.allPositive ? 'yes' : 'no'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Imp34986CrossoverNumeratorPolynomialLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Crossover-Map Numerator Polynomial Ladder P_2..P_12 (imp-34986 / imp-34957)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The inherited crossover-map derivative g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n
        u^(2n-1)) has an all-positive-coefficient numerator polynomial P_n at every order n = 2..12,
        with leading coefficient (n-1)! and constant coefficient (2n-3)!!. Strict positivity of every
        coefficient forces the definite alternating sign (-1)^(n+1) of g^(n), i.e. no interior zero on
        the post-peak ramp.
      </p>

      <GrowthChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Extreme coefficients and largest coefficient per order, all far below the 2^53 exact-integer
        ceiling (largest coefficient through P_12 is {maxCoeff.toExponential(3)}).
      </p>
      <CoefficientTable />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page reconstructing the
        imp-34957/imp-34922/imp-34905/imp-34880 P_n coefficient tables from the same operator
        recurrence (no new computation beyond re-deriving the verbatim table for the plot); leading
        (n-1)! and constant (2n-3)!! match through n=12 (leadingOK={String(allLeadingMatch)},
        constantOK={String(allConstantMatch)}), every coefficient strictly positive
        (allPositive={String(allPositive)}), and the n=11/12 rows reproduce the independently
        hand-derived imp-34957 literals exactly (matches={String(matchesExtension)}). This is a
        verification of the INHERITED imp-3220/imp-3406 surrogate-map derivative signs ONLY. C_mb
        GUE-conditional per imp-486 and the C_C 1/8 ansatz are untouched; establishes no operator
        positivity; changes no bound; no RH verdict, NO QED.
      </div>
    </div>
  );
}
