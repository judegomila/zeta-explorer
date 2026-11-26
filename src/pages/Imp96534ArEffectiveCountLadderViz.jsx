import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96534_LADDER_ROWS,
  IMP96534_LANDMARKS,
  IMP96534_CORRELATIONS,
} from '../data/imp-96534-ar-effective-count-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

// Renders the imp-96489/imp-96509 AR effective-count ladder verbatim (no new computation):
// n_eff and z_eff climbing AR-0 (naive) -> AR-1 -> AR-2 -> AR-3 as successive negative
// higher-lag corrections are folded in, with the z_cons=1.9234 conservative floor marked on
// the bar chart and the fitted correlations plotted against the rho_crit=+0.5744 flip line.
const ROWS = IMP96534_LADDER_ROWS;
const Z_CONS = IMP96534_LANDMARKS.zConservativeFloor; // 1.923422
const Z_TARGET = IMP96534_LANDMARKS.zTarget; // 2.0
const RHO_CRIT = IMP96534_LANDMARKS.rhoCrit; // 0.57443

function ZEffLadderChart() {
  const svgW = 720;
  const svgH = 300;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const zMax = Math.max(...ROWS.map((r) => r.zEff)) * 1.12;
  const yAt = (v) => padT + cH - (v / zMax) * cH;
  const barW = 90;
  const gap = (cW - ROWS.length * barW) / (ROWS.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      {[0, zMax / 2, zMax].map((t) => (
        <g key={t}>
          <line x1={padL - 4} y1={yAt(t)} x2={padL} y2={yAt(t)} stroke={ED.rule} strokeWidth={1} />
          <text x={padL - 8} y={yAt(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toFixed(2)}
          </text>
        </g>
      ))}

      {/* z_cons conservative floor line */}
      <line
        x1={padL}
        y1={yAt(Z_CONS)}
        x2={padL + cW}
        y2={yAt(Z_CONS)}
        stroke={ED.brassDeco}
        strokeWidth={1.4}
        strokeDasharray="5 3"
      />
      <text x={padL + cW - 4} y={yAt(Z_CONS) - 5} textAnchor="end" fill={ED.brass} fontSize={9} fontWeight={700}>
        z_cons = {Z_CONS.toFixed(4)} (conservative floor, strict lower bound)
      </text>

      {/* 2-sigma target line */}
      <line
        x1={padL}
        y1={yAt(Z_TARGET)}
        x2={padL + cW}
        y2={yAt(Z_TARGET)}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      <text x={padL + 4} y={yAt(Z_TARGET) - 5} textAnchor="start" fill={ED.inkSoft} fontSize={9}>
        2-sigma target
      </text>

      {ROWS.map((r, i) => {
        const x = padL + gap + i * (barW + gap);
        return (
          <g key={r.stage}>
            <rect x={x} y={yAt(r.zEff)} width={barW} height={cH - (yAt(r.zEff) - padT)} fill={ED.series1} opacity={0.85} />
            <text x={x + barW / 2} y={yAt(r.zEff) - 6} textAnchor="middle" fill={ED.ink} fontSize={10} fontWeight={700}>
              {r.zEff.toFixed(3)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              {r.stage}
            </text>
            <text x={x + barW / 2} y={padT + cH + 29} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              n_eff={r.nEff.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Fitted correlations rho_1/rho_2/rho_3 (all negative) against the positive rho_crit flip line.
function CorrelationSignChart() {
  const svgW = 720;
  const svgH = 200;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 34;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const vMax = RHO_CRIT * 1.15;
  const vMin = -0.55;
  const yAt = (v) => padT + cH - ((v - vMin) / (vMax - vMin)) * cH;
  const zeroY = yAt(0);
  const barW = 90;
  const gap = (cW - IMP96534_CORRELATIONS.length * barW) / (IMP96534_CORRELATIONS.length + 1);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke={ED.rule} strokeWidth={1} />

      {/* rho_crit positive flip threshold */}
      <line
        x1={padL}
        y1={yAt(RHO_CRIT)}
        x2={padL + cW}
        y2={yAt(RHO_CRIT)}
        stroke={ED.series2}
        strokeWidth={1.4}
        strokeDasharray="5 3"
      />
      <text x={padL + cW - 4} y={yAt(RHO_CRIT) - 5} textAnchor="end" fill={ED.series2} fontSize={9} fontWeight={700}>
        rho_crit = +{RHO_CRIT.toFixed(4)} (flip threshold)
      </text>

      {IMP96534_CORRELATIONS.map((c, i) => {
        const x = padL + gap + i * (barW + gap);
        const top = Math.min(zeroY, yAt(c.rho));
        const h = Math.abs(yAt(c.rho) - zeroY);
        return (
          <g key={c.lag}>
            <rect x={x} y={top} width={barW} height={h} fill={ED.series5} opacity={0.85} />
            <text x={x + barW / 2} y={yAt(c.rho) + (c.rho < 0 ? 14 : -6)} textAnchor="middle" fill={ED.ink} fontSize={9.5} fontWeight={700}>
              {c.rho.toFixed(4)}
            </text>
            <text x={x + barW / 2} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={700}>
              rho_{c.lag}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Imp96534ArEffectiveCountLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="AR Effective-Count Ladder (imp-96489 / imp-96509)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The excursion effective significance z_eff climbs AR-0 (naive, no correlation credit) &rarr;
        AR-1 (imp-96489, lag-1 only) &rarr; AR-2 &rarr; AR-3 (imp-96509, folding in the small
        negative higher-lag sine-process box correlations). The dashed amber line marks the
        conservative z_cons = {Z_CONS.toFixed(4)} floor, which stays the quoted headline figure and a
        strict lower bound regardless of how far the AR(p) refinement climbs.
      </p>
      <ZEffLadderChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.25rem 0 0.5rem' }}>
        Every fitted lag correlation feeding the ladder is negative, sign-forbidden from the
        rho_crit = +{RHO_CRIT.toFixed(4)} threshold that would flip the dip to noise.
      </p>
      <CorrelationSignChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-only page rendering the imp-96509
        AR(p) resummation literals verbatim (no new computation). The lag-2/lag-3 inputs are
        theoretical GUE sine-process box correlations, not empirical zero covariances, so the
        AR-2/AR-3 figures are indicative, not precise; the headline z_cons floor is untouched.
        Derivation/measurement diagnostic only, not rigorous; changes no bound; establishes no
        operator positivity; no RH verdict, NO QED.
      </div>
    </div>
  );
}
