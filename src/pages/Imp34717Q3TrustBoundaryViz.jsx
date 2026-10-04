import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY } from '../data/imp-34691-q3-cancellation-floor-trust-boundary.js';
import { ED } from '../styles/tokens.js';

const M = IMP34691_Q3_CANCELLATION_FLOOR_TRUST_BOUNDARY;
const log10 = (x) => Math.log(x) / Math.LN10;

// C(N=1e13) recovered from the exported Frel_at_dp_1e_minus_3 = C/(1e-3)^3 (module keeps the raw
// prefactorC/relFloor helpers internal; this reconstructs the reference-N curve from public fields).
const C_REF = M.Frel_at_dp_1e_minus_3 * Math.pow(1e-3, 3);
const DP_STAR_REF = Math.cbrt(C_REF);
const relFloorRef = (dp) => C_REF / Math.pow(dp, 3);

// Full dp*(N) ladder: the 1e13 reference point (~5.7e-4) plus the imp-33620 deep-tail table (~6.1e-4..6.9e-4).
const LADDER_POINTS = [
  { N: M.reference_point.N, dp_star: DP_STAR_REF, label: '1e13 (ref)' },
  ...M.dp_star_table.map((r) => ({ N: r.N, dp_star: r.dp_star, label: r.N.toExponential(2) })),
];

function FloorCurveChart() {
  const svgW = 640;
  const svgH = 300;
  const padL = 60;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = log10(2e-4);
  const xMax = log10(3e-2);
  const markers = [
    { dp: M.reference_point.dp, Frel: M.ref_Frel_closed, label: 'dp=1e-2' },
    { dp: 1e-3, Frel: M.Frel_at_dp_1e_minus_3, label: 'dp=1e-3 (edge)' },
    { dp: 1e-4, Frel: M.Frel_at_dp_1e_minus_4, label: 'dp=1e-4 (lost)' },
  ];
  const yVals = [
    log10(relFloorRef(Math.pow(10, xMin))),
    log10(relFloorRef(Math.pow(10, xMax))),
    ...markers.map((m) => log10(m.Frel)),
    0,
  ];
  const yMin = Math.min(...yVals) - 0.4;
  const yMax = Math.max(...yVals) + 0.4;

  const xAt = (dp) => padL + ((log10(dp) - xMin) / (xMax - xMin)) * cW;
  const yAt = (Frel) => padT + cH - ((log10(Frel) - yMin) / (yMax - yMin)) * cH;

  const curvePath = `M${xAt(Math.pow(10, xMin))},${yAt(relFloorRef(Math.pow(10, xMin)))} ` +
    `L${xAt(Math.pow(10, xMax))},${yAt(relFloorRef(Math.pow(10, xMax)))}`;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {/* F_rel = 1 crossover line -- roundoff floor equals the physical q3 signal */}
      <line
        x1={padL}
        y1={yAt(1)}
        x2={padL + cW}
        y2={yAt(1)}
        stroke={ED.series2}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={padL + cW - 4} y={yAt(1) - 5} textAnchor="end" fill={ED.series2} fontSize={10}>
        F_rel = 1 (noise = signal)
      </text>

      {/* dp*(N=1e13) vertical marker */}
      <line
        x1={xAt(DP_STAR_REF)}
        y1={padT}
        x2={xAt(DP_STAR_REF)}
        y2={padT + cH}
        stroke={ED.brassDeco}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={xAt(DP_STAR_REF) + 4} y={padT + 10} fill={ED.brass} fontSize={10}>
        dp* &asymp; {DP_STAR_REF.toExponential(2)}
      </text>

      <path d={curvePath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {markers.map((m) => (
        <circle key={m.label} cx={xAt(m.dp)} cy={yAt(m.Frel)} r={5} fill="#cbd5e1" stroke={ED.paper} strokeWidth={1} />
      ))}
      {markers.map((m) => (
        <text key={`lbl-${m.label}`} x={xAt(m.dp) + 6} y={yAt(m.Frel) - 6} fill={ED.inkSoft} fontSize={9}>
          {m.label}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        step dp (log scale)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        log10 F_rel(dp, N=1e13)
      </text>
    </svg>
  );
}

function DpStarLadderChart() {
  const svgW = 640;
  const svgH = 260;
  const padL = 60;
  const padR = 24;
  const padT = 22;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = log10(LADDER_POINTS[0].N) - 0.1;
  const xMax = log10(LADDER_POINTS[LADDER_POINTS.length - 1].N) + 0.1;
  const yMin = Math.min(...LADDER_POINTS.map((p) => p.dp_star)) * 0.9;
  const yMax = Math.max(...LADDER_POINTS.map((p) => p.dp_star)) * 1.1;

  const xAt = (N) => padL + ((log10(N) - xMin) / (xMax - xMin)) * cW;
  const yAt = (dp) => padT + cH - ((dp - yMin) / (yMax - yMin)) * cH;

  const linePath = LADDER_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(p.N)},${yAt(p.dp_star)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      <path d={linePath} fill="none" stroke={ED.series1} strokeWidth={2} />
      {LADDER_POINTS.map((p) => (
        <circle key={p.N} cx={xAt(p.N)} cy={yAt(p.dp_star)} r={5} fill={ED.brassDeco} stroke={ED.paper} strokeWidth={1} />
      ))}
      {LADDER_POINTS.map((p) => (
        <text key={`lbl-${p.N}`} x={xAt(p.N)} y={yAt(p.dp_star) - 10} textAnchor="middle" fill={ED.ink} fontSize={9}>
          {p.dp_star.toExponential(2)}
        </text>
      ))}

      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale, imp-33620 deep-tail ladder + 1e13 reference)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90, 14, ${padT + cH / 2})`}
      >
        dp*(N)
      </text>
    </svg>
  );
}

export default function Imp34717Q3TrustBoundaryViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="q3 Trust Boundary: Smallest-Usable Step dp*(N) (imp-34717 / imp-34691)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The tiny-q3 numerator's catastrophic-cancellation input-roundoff floor is an explicit closed
        function of the finite-difference step dp and depth N: F_rel(dp,N) = C(N)/dp&sup3;, with the
        depth-only prefactor C(N) = W_max&middot;&epsilon;&middot;|q(p)| / (240&middot;|q3(p)|). Below
        the crossover step dp*(N) = C(N)<sup>1/3</sup> the floor exceeds the physical q3 signal and the
        numerator is pure roundoff. dp* sits at &asymp;{M.dp_star_min}&ndash;{M.dp_star_max} across the
        imp-33620 deep-tail ladder, rising slowly (&asymp;20% over two decades of N) as |q| grows and
        |q3| shrinks.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        F_rel(dp, N=1e13) vs dp: the closed-form cubic (blue), the three reference points at
        dp=1e-2/1e-3/1e-4, the F_rel=1 crossover (red dashed), and dp* (yellow dashed)
      </p>
      <FloorCurveChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        dp*(N): smallest usable q-derivative step across the deep-tail ladder
      </p>
      <DpStarLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>dp*(N)</th>
          </tr>
        </thead>
        <tbody>
          {LADDER_POINTS.map((p) => (
            <tr key={p.N} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.N.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{p.dp_star.toExponential(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
        }}
      >
        The crossover dp* sits between the parents' operating step dp=1e-3 (F_rel &asymp;{' '}
        {M.Frel_at_dp_1e_minus_3}, edge of trust) and dp=1e-4 (F_rel &asymp; {M.Frel_at_dp_1e_minus_4},
        q3 fully lost) &mdash; one 1/dp&sup3; law explains both, with exponent m3=3 matching imp-34606
        and amplitude W_max&middot;&epsilon;&middot;|q| matching imp-34633.
      </div>

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, plotting the
        already-derived imp-34691 closed-form floor F_rel(dp,N) = C(N)/dp&sup3; and its crossover
        dp*(N); establishes no new numerical claim. q1..q3 are inherited central differences, NOT fresh
        analytic closed forms, so the sigma&nbsp;-&gt;&nbsp;1 deep-tail regime (imp-3220/imp-3406
        component model least trustworthy) is inherited as-is. The -2 asymptote and
        C_C&nbsp;=&nbsp;(1/8)sqrt(3&nbsp;pi) (imp-2714) ansatz are UNTOUCHED; C_mb GUE-conditional per
        imp-486 UNTOUCHED; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
