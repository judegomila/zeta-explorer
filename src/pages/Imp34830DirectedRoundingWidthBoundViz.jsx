import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND } from '../data/imp-34799-krawczyk-directed-rounding-width-bound.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND;
const B = DATA.bound;
const FP_LO = DATA.constants.FP_LO_quotient_denominator; // ~0.954568
const AMPLIFICATION = DATA.constants.contraction_amplification_one_over_FP_LO; // ~1.0476
const MARGIN = DATA.constants.bracket_margin_each_side; // ~6.5606e5

// residual half-width r_F = image half-width * FP_LO (imageHalfWidth = residualHalfWidth / FP_LO).
const ROWS = B.width_table.map((r) => ({
  nOp: r.n_op,
  residual: r.image_half_width * FP_LO,
  image: r.image_half_width,
}));

// -- log-log chart: residual half-width r_F(n_op) and image half-width r_image(n_op) against n_op,
// with the (H2) bracket margin drawn as a dashed ceiling far above both curves -- the visual gap IS
// the ~10-order head-room the finding reports. --
function WidthBoundChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 74;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const xMin = Math.log10(5);
  const xMax = Math.log10(500);
  const yMin = Math.log10(1e-6);
  const yMax = Math.log10(1e6);

  const sx = (nOp) => padL + ((Math.log10(nOp) - xMin) / (xMax - xMin)) * plotW;
  const sy = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const yTicks = [1e-6, 1e-4, 1e-2, 1, 1e2, 1e4, 1e6];
  const xTicks = [10, 100];

  const imagePts = ROWS.map((r) => `${sx(r.nOp)},${sy(r.image)}`).join(' ');
  const residualPts = ROWS.map((r) => `${sx(r.nOp)},${sy(r.residual)}`).join(' ');

  const rep = ROWS.find((r) => r.nOp === B.representative_n_op) || ROWS[1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={plotH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={padL} y1={sy(t)} x2={padL + plotW} y2={sy(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={sy(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toExponential(0)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={padT} x2={sx(t)} y2={padT + plotH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={sx(t)} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {t}
          </text>
        </g>
      ))}
      <text x={padL + plotW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkSoft} fontSize={11}>
        n_op (directed-rounding operation count)
      </text>
      <text
        x={14}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={11}
        transform={`rotate(-90 14 ${padT + plotH / 2})`}
      >
        half-width (absolute, log scale)
      </text>

      {/* (H2) bracket margin ceiling */}
      <line
        x1={padL}
        y1={sy(MARGIN)}
        x2={padL + plotW}
        y2={sy(MARGIN)}
        stroke={ED.brassDeco}
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />
      <text x={padL + plotW - 4} y={sy(MARGIN) - 6} textAnchor="end" fill={ED.brass} fontSize={10} fontWeight={700}>
        (H2) margin &delta;N_cross &asymp; {MARGIN.toExponential(2)}
      </text>

      {/* head-room bracket at the representative n_op */}
      <line
        x1={sx(rep.nOp) + 14}
        y1={sy(MARGIN)}
        x2={sx(rep.nOp) + 14}
        y2={sy(rep.image)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text
        x={sx(rep.nOp) + 20}
        y={(sy(MARGIN) + sy(rep.image)) / 2}
        fill={ED.inkSoft}
        fontSize={9}
      >
        ~{B.headroom_orders_below_margin} orders
      </text>

      {/* image half-width curve */}
      <polyline points={imagePts} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r) => (
        <circle key={`img-${r.nOp}`} cx={sx(r.nOp)} cy={sy(r.image)} r={3.5} fill={ED.series1} />
      ))}
      {/* residual half-width curve (raw, pre-amplification) */}
      <polyline points={residualPts} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="6 3" />
      {ROWS.map((r) => (
        <circle key={`res-${r.nOp}`} cx={sx(r.nOp)} cy={sy(r.residual)} r={3} fill={ED.series2} />
      ))}

      <text x={sx(rep.nOp) - 8} y={sy(rep.image) - 10} textAnchor="end" fill={ED.series1} fontSize={9} fontWeight={700}>
        r_image
      </text>
      <text x={sx(rep.nOp) - 8} y={sy(rep.residual) + 14} textAnchor="end" fill={ED.series2} fontSize={9} fontWeight={700}>
        r_F (raw)
      </text>
      <text x={sx(rep.nOp)} y={sy(rep.image) + 22} textAnchor="middle" fill={ED.brass} fontSize={9}>
        amplification 1/FP_LO &asymp; {AMPLIFICATION.toFixed(4)}&times;
      </text>

      <g transform={`translate(${padL + 8},${padT + 10})`}>
        <line x1={0} y1={0} x2={16} y2={0} stroke={ED.series1} strokeWidth={2} />
        <text x={20} y={3} fill={ED.inkSoft} fontSize={9}>
          image half-width r_image(n_op) = r_F(n_op)/FP_LO
        </text>
        <line x1={0} y1={14} x2={16} y2={14} stroke={ED.series2} strokeWidth={2} strokeDasharray="6 3" />
        <text x={20} y={17} fill={ED.inkSoft} fontSize={9}>
          residual half-width r_F(n_op) = gamma(n_op)|g(m)|
        </text>
      </g>
    </svg>
  );
}

export default function Imp34830DirectedRoundingWidthBoundViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Directed-Rounding Width Bound: r_F and r_image vs n_op (imp-34830 / imp-34799)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34799 bounds how wide the Krawczyk image at N_cross would become once the surrogate
        F(m)&nbsp;=&nbsp;0 is replaced by a genuine directed-rounding evaluation: the residual half-width
        r_F(n_op)&nbsp;&le;&nbsp;&gamma;(n_op)|g(m)|, and the interval-Newton quotient by [F&prime;] amplifies
        it to the image half-width r_image(n_op)&nbsp;=&nbsp;r_F(n_op)/FP_LO. Both grow linearly in the
        directed-rounding operation count n_op, separated by the constant contraction-gap amplification
        1/FP_LO&nbsp;&asymp;&nbsp;{AMPLIFICATION.toFixed(4)}. The dashed yellow ceiling is the a-priori
        (H2) bracket margin &delta;N_cross&nbsp;&asymp;&nbsp;{MARGIN.toExponential(2)}: at the
        representative n_op&nbsp;=&nbsp;{B.representative_n_op}, both curves sit
        ~{B.headroom_orders_below_margin} orders below it &mdash; the enclosure would widen from zero to a
        nonzero-but-negligible amount.
      </p>

      <WidthBoundChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>n_op</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>residual half-width r_F</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>image half-width r_image</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>ratio to (H2) margin</th>
          </tr>
        </thead>
        <tbody>
          {B.width_table.map((r, i) => (
            <tr key={r.n_op} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.n_op}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{ROWS[i].residual.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.image_half_width.toExponential(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.ratio_to_margin.toExponential(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-34799
        width-bound table (imported literals, no new computation); establishes no new numerical claim. The
        bound is a derivation/assessment that ASSUMES a well-behaved n_op-operation directed-rounding
        evaluation (standard &gamma;(n) IA propagation) rather than instantiating one; it does NOT close the
        imp-34714a machine certificate, which REMAINS OPEN. Inherited imp-3220/imp-3406 surrogate crossover
        map; C_C&nbsp;=&nbsp;(1/8)&radic;(3&pi;) (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486
        untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched; changes no bound; establishes no operator
        positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
