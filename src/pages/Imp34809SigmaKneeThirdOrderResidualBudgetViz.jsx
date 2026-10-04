import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION } from '../data/imp-34770-sigma-knee-third-order-v-expansion.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34770_SIGMA_KNEE_THIRD_ORDER_V_EXPANSION;
const RB = DATA.residualBudget;
const FD_FLOOR = DATA.expansion.fdFloorDex; // 9.2e-5 (imp-34756 F3)
const SECOND = RB.secondOrderSelfConsistentToExactFLog10; // ~-1.1e-5
const THIRD = RB.thirdOrderSelfConsistentToExactFLog10; // ~+4.9e-5

// Stacked/waterfall view: the second- and third-order self-consistent-to-exactF residuals plotted
// against the shared FD floor, showing delta_3 OVERSHOOTS the match rather than tightening it --
// the residual is discretization-dominated, not a missing physical v-order (imp-34756 F3 / imp-34770 F3).
function ResidualBudgetChart() {
  const svgW = 680;
  const panelH = 220;
  const padL = 90;
  const padR = 24;
  const padT = 30;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const svgH = padT + panelH + padB;

  const maxAbs = Math.max(Math.abs(SECOND), Math.abs(THIRD), FD_FLOOR) * 1.15;
  const zeroY = padT + panelH / 2;
  const sy = (v) => zeroY - (v / maxAbs) * (panelH / 2);

  const barW = 130;
  const gapX = 220;
  const x1 = padL + 100;
  const x2 = x1 + gapX;

  const y0Second = sy(0);
  const ySecond = sy(SECOND);
  const y0Third = sy(0);
  const yThird = sy(THIRD);

  const yFloorPos = sy(FD_FLOOR);
  const yFloorNeg = sy(-FD_FLOOR);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={plotW} height={panelH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL} y={padT - 10} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Self-consistent-to-exactF residual (dex) &mdash; 2nd vs 3rd order, against the &plusmn;FD floor band
      </text>

      {/* FD floor band */}
      <rect
        x={padL}
        y={Math.min(yFloorPos, yFloorNeg)}
        width={plotW}
        height={Math.abs(yFloorNeg - yFloorPos)}
        fill={ED.brassDeco}
        opacity={0.08}
      />
      <line x1={padL} y1={yFloorPos} x2={padL + plotW} y2={yFloorPos} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={padL} y1={yFloorNeg} x2={padL + plotW} y2={yFloorNeg} stroke={ED.brassDeco} strokeWidth={1} strokeDasharray="4 3" />
      <text x={padL + plotW - 4} y={yFloorPos - 4} textAnchor="end" fill={ED.brass} fontSize={9}>
        +FD floor &asymp; {FD_FLOOR.toExponential(2)}
      </text>
      <text x={padL + plotW - 4} y={yFloorNeg + 12} textAnchor="end" fill={ED.brass} fontSize={9}>
        -FD floor
      </text>

      {/* zero line */}
      <line x1={padL} y1={zeroY} x2={padL + plotW} y2={zeroY} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL - 8} y={zeroY + 4} textAnchor="end" fill={ED.inkFaint} fontSize={10}>
        0
      </text>

      {/* second-order bar */}
      <rect
        x={x1 - barW / 2}
        y={Math.min(y0Second, ySecond)}
        width={barW}
        height={Math.abs(ySecond - y0Second) || 1.5}
        fill={ED.series1}
        opacity={0.85}
      />
      <text x={x1} y={SECOND >= 0 ? ySecond - 8 : ySecond + 16} textAnchor="middle" fill={ED.series1} fontSize={11} fontWeight={700}>
        {SECOND.toExponential(2)}
      </text>
      <text x={x1} y={padT + panelH + 18} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        2nd order (imp-34756)
      </text>

      {/* third-order bar */}
      <rect
        x={x2 - barW / 2}
        y={Math.min(y0Third, yThird)}
        width={barW}
        height={Math.abs(yThird - y0Third) || 1.5}
        fill={ED.series2}
        opacity={0.85}
      />
      <text x={x2} y={THIRD >= 0 ? yThird - 8 : yThird + 16} textAnchor="middle" fill={ED.series2} fontSize={11} fontWeight={700}>
        {THIRD.toExponential(2)}
      </text>
      <text x={x2} y={padT + panelH + 18} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
        3rd order (imp-34770, this data)
      </text>

      <text x={(x1 + x2) / 2} y={padT + 14} textAnchor="middle" fill={ED.brass} fontSize={10} fontWeight={700}>
        delta_3 OVERSHOOTS the match &mdash; both stay inside the &plusmn;FD-floor band
      </text>
    </svg>
  );
}

export default function Imp34809SigmaKneeThirdOrderResidualBudgetViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee Third-Order Residual Budget (imp-34809 / imp-34770)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34770 restored the THIRD-order term delta_3 of the slowly-varying-v sigma-knee expansion
        and tracked how the self-consistent knee's residual against the all-orders analytic
        exactF knee moves order by order. The second-order residual is
        {' '}{SECOND.toExponential(2)} dex (imp-34756), tightened toward zero; the third-order
        residual is {' '}{THIRD.toExponential(2)} dex &mdash; LARGER in magnitude and moving AWAY
        from exactF, not toward it. Both residuals sit well inside the &plusmn;{FD_FLOOR.toExponential(1)}
        {' '}dex finite-difference floor (imp-34756 F3), so the overshoot is discretization/roundoff
        noise in the near-marginal self-consistent map, not evidence of a missing physical v-order
        (imp-34770 F3).
      </p>

      <ResidualBudgetChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value (dex)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['raw 3rd-order minus 2nd-order knee shift', RB.rawThirdMinusSecondLog10],
            ['2nd-order self-consistent to exactF', SECOND],
            ['3rd-order self-consistent to exactF', THIRD],
            ['source finite-difference floor (imp-34756 F3)', RB.thirdSourceFiniteDifferenceLog10],
            ['FD floor magnitude bound against', FD_FLOOR],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{label}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{value}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the
        imp-34770 residualBudget table (imported literals, no new computation); establishes no new
        numerical claim. Conditional-share diagnostic on the inherited imp-3220/imp-3406
        extrapolation, NOT an RH bound. C_mb GUE-conditional per imp-486 untouched; imp-3066
        K_a&nbsp;&ge;&nbsp;0 untouched; far-tail exponent stays 1/2 (imp-3463); establishes no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
