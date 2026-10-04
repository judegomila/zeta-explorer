import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95225_SIGNED_COUNT_PRICED_SHIFT_CERTIFICATE } from '../data/imp-95225-signed-count-priced-shift-certificate.js';
import { ED, alpha } from '../styles/tokens.js';

const D = IMP95225_SIGNED_COUNT_PRICED_SHIFT_CERTIFICATE;
const VAC_SLOPE = D.constants.vacuitySlope; // 1/ln2, per-x growth of the certificate (vacuity) frontier
const SAT_SLOPE = D.constants.satSlope; // imp-95224 saturation frontier slope

// N vs. x chart: the SGN-C certificate frontier N = 1 + VAC_SLOPE*x (below which the count-priced
// signed bound bites) against the SGN-SAT saturation frontier N = SAT_SLOPE*x (above which sup R = 1/2
// is already known), shading the wedge between them where sup R is OPEN on both sides. Straight lines,
// so the "corridor" region is a single quadrilateral -- no curve-fitting needed to draw it.
function CorridorChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 34;
  const padB = 42;
  const plotW = svgW - padL - padR;
  const plotH = 300;
  const svgH = padT + plotH + padB;

  const xMax = 15;
  const nMax = SAT_SLOPE * xMax;
  const xOf = (x) => padL + (x / xMax) * plotW;
  const yOf = (n) => padT + plotH - (n / nMax) * plotH;
  const vac = (x) => 1 + VAC_SLOPE * x;
  const sat = (x) => SAT_SLOPE * x;

  const xTicks = [0, 3, 6, 9, 12, 15];
  const nTicks = [0, 40, 80, 120, 160];

  const corridorPoints = [
    `${xOf(0)},${yOf(vac(0))}`,
    `${xOf(xMax)},${yOf(vac(xMax))}`,
    `${xOf(xMax)},${yOf(sat(xMax))}`,
    `${xOf(0)},${yOf(sat(0))}`,
  ].join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 14} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        N vs. x: SGN-C certificate frontier vs. SGN-SAT saturation frontier
      </text>

      {/* open corridor: 1.4427x < N-1 < 11.6893x, sup R unknown on both sides */}
      <polygon points={corridorPoints} fill={alpha(ED.brassDeco, 0.1)} />

      {nTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={yOf(t)} x2={padL + plotW} y2={yOf(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 6} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      {xTicks.map((t) => (
        <text key={t} x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t}
        </text>
      ))}
      <text x={padL + plotW - 12} y={padT + plotH + 32} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
        x = m&middot;d (min rate &times; min depth)
      </text>

      {/* saturation frontier N = 11.6893 x: above it, sup R = 1/2 is already known (imp-95224 SGN-SAT) */}
      <line
        x1={xOf(0)}
        y1={yOf(sat(0))}
        x2={xOf(xMax)}
        y2={yOf(sat(xMax))}
        stroke={ED.series2}
        strokeWidth={2}
      />
      <text x={xOf(xMax) - 180} y={yOf(sat(xMax * 0.86)) - 6} fill={ED.series2} fontSize={9}>
        saturation: N &asymp; {SAT_SLOPE}x (sup R = 1/2 known above)
      </text>

      {/* vacuity / certificate frontier N = 1 + 1.4427 x: below it, SGN-C bites (bound < 1) */}
      <line
        x1={xOf(0)}
        y1={yOf(vac(0))}
        x2={xOf(xMax)}
        y2={yOf(vac(xMax))}
        stroke={ED.series1}
        strokeWidth={2.25}
      />
      <text x={xOf(xMax) - 210} y={yOf(vac(xMax)) + 16} fill={ED.series1} fontSize={9}>
        certificate: N = 1 + {VAC_SLOPE.toFixed(4)}x (SGN-C bites below)
      </text>

      {/* N = 1 SGN-EQ sharp anchor point, on the vacuity line at x = 0 */}
      <circle cx={xOf(0)} cy={yOf(1)} r={4} fill={ED.series3} />
      <text x={xOf(0) + 8} y={yOf(1) - 6} fill={ED.series3} fontSize={9} fontWeight={700}>
        N = 1: SGN-EQ (sharp)
      </text>

      <text x={xOf(6.2)} y={yOf(0.55 * (vac(6.2) + sat(6.2)))} fill={ED.brass} fontSize={10} fontWeight={700}>
        open corridor (factor &asymp; 8.1)
      </text>
      <text x={xOf(1.4)} y={yOf(vac(1.4)) + 26} fill={ED.inkFaint} fontSize={8.5}>
        width-law packets (N&sim;pD, x=&Theta;(1)): here, inside the vacuity zone
      </text>
    </svg>
  );
}

export default function Imp95143VacuitySaturationCorridorViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="SGN-C Count-Vacuity vs. SGN-SAT Saturation Corridor (imp-95143 / imp-95225)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        {D.propCVAC} The chart plots the two straight-line frontiers in the (x, N) plane over the
        SGN-C model family: N = distinct rates, x = m&middot;d (min rate times min center depth).
        Below the certificate frontier the count-priced signed bound R &le; B(N,x,K)^2 is non-vacuous;
        above the saturation frontier sup R = 1/2 is already established by imp-95224 THEOREM SGN-SAT.
        The shaded wedge between them is the open corridor -- sup R is unknown on both its edges.
      </p>

      <CorridorChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Anchor and scope
      </p>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', maxWidth: 700 }}>
        The N = 1 point sits exactly on the certificate frontier and is proven sharp: {D.corollaryCEQ}
        The corridor factor (saturation slope / vacuity slope) is {(SAT_SLOPE / VAC_SLOPE).toFixed(2)},
        matching the "factor &asymp; 8.1" recorded in imp-95225 PROP C-VAC. The width-law paper packets
        (N &sim; pD at x = &Theta;(1), per imp-95220) sit well inside the vacuity zone below the
        certificate frontier -- they are not certified by SGN-C, consistent with every imp-95220 no-go.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Qualitative viz-only page baking the
        imp-95225 IMP95225_SIGNED_COUNT_PRICED_SHIFT_CERTIFICATE constants.vacuitySlope /
        constants.satSlope literals verbatim (no new computation, no bound claim). The open corridor
        between the two frontiers is recorded, not resolved, on both sides; the weight-priced and
        modulus/phase signed legs remain open; the paper packets stay uncertified. Changes no bound,
        establishes no operator positivity, no RH claim; Platt-Trudgian Lambda &le; 0.2 remains SOTA;
        NO QED.
      </div>
    </div>
  );
}
