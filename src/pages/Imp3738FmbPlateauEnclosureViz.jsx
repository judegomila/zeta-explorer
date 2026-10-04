import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3738_PLATEAU_ROWS,
  IMP3738_K_PAPER_MAX,
  IMP3738_CARRYFORWARD_K,
  IMP3738_MARGIN_FACTOR,
} from '../data/imp-3738-fmb-plateau-enclosure-viz-data.js';
import { ED } from '../styles/tokens.js';

const BAND_COLOR = ED.series1;
const K_COLOR = ED.series3;
const RETIRED_COLOR = ED.series2;

function PlateauEnclosureChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 20;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nMin = 1e4;
  const nMax = 1e6;
  const logNMin = Math.log10(nMin);
  const logNMax = Math.log10(nMax);
  const yMin = 1e-10;
  const yMax = 1e-6;
  const logYMin = Math.log10(yMin);
  const logYMax = Math.log10(yMax);

  const xS = (n) => padL + ((Math.log10(n) - logNMin) / (logNMax - logNMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logYMin) / (logYMax - logYMin));
  const floorY = padT + cH;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[1e-10, 1e-9, 1e-8, 1e-7, 1e-6].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      {IMP3738_PLATEAU_ROWS.map((r) => {
        const x1 = xS(r.startN);
        const x2 = xS(r.endN);
        const y = yS(r.FmbUpper);
        return (
          <g key={r.plateauIndex}>
            <rect x={x1} y={y} width={Math.max(x2 - x1, 0.5)} height={floorY - y} fill={BAND_COLOR} opacity={0.16} />
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={BAND_COLOR} strokeWidth={2} />
            <line x1={x1} y1={y} x2={x1} y2={floorY} stroke={BAND_COLOR} strokeWidth={0.6} opacity={0.4} />
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[1e4, 1e5, 1e6].map((n) => (
        <g key={'x' + n}>
          <line x1={xS(n)} y1={padT + cH} x2={xS(n)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(n)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            N={n.toExponential(0)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        N (log scale)
      </text>
      <text x={16} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}>
        F_mb upper bound (log scale)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={BAND_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series1}>
          (H^2/8)(1/theta_N2 - 1) per plateau -- certified upper edge of F_mb(N)
        </text>
      </g>
    </svg>
  );
}

function KComparisonChart() {
  const svgW = 680;
  const padL = 78;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const barH = 34;
  const gap = 26;
  const cH = barH * 2 + gap;
  const svgH = padT + cH + padB;

  const xMin = 1e-7;
  const xMax = 1;
  const logXMin = Math.log10(xMin);
  const logXMax = Math.log10(xMax);
  const xS = (v) => padL + ((Math.log10(v) - logXMin) / (logXMax - logXMin)) * cW;

  const ticks = [1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ticks.map((v) => (
        <line
          key={v}
          x1={xS(v)}
          y1={padT}
          x2={xS(v)}
          y2={padT + cH}
          stroke={ED.ruleSoft}
          strokeWidth={0.7}
        />
      ))}

      <rect x={padL} y={padT} width={xS(IMP3738_K_PAPER_MAX) - padL} height={barH} fill={K_COLOR} opacity={0.75} />
      <text x={padL + 4} y={padT + barH / 2 + 4} fill="#022c22" fontSize={10} fontWeight={700}>
        K_paper &le; {IMP3738_K_PAPER_MAX.toExponential(4)} (imp-3725 certified sup)
      </text>

      <rect
        x={padL}
        y={padT + barH + gap}
        width={xS(IMP3738_CARRYFORWARD_K) - padL}
        height={barH}
        fill={RETIRED_COLOR}
        opacity={0.55}
      />
      <text x={padL + 4} y={padT + barH + gap + barH / 2 + 4} fill="#450a0a" fontSize={10} fontWeight={700}>
        K = {IMP3738_CARRYFORWARD_K} (imp-963 retired carryforward)
      </text>

      {ticks.map((v) => (
        <text key={'t' + v} x={xS(v)} y={padT + cH + 14} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v.toExponential(0)}
        </text>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 32} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        K (log scale)
      </text>
    </svg>
  );
}

export default function Imp3738FmbPlateauEnclosureViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="F_mb Per-Plateau Two-Sided Enclosure (imp-3725)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3725 proved a rigorous, true-flow two-sided enclosure of the backward-Dyson gap-domination
        margin F_mb(N) = t_c(N) - H_raw(N)^2/8, uniform over every N in [1e4, 1e6]:
        0 &le; F_mb(N) &le; (H^2/8)(1/theta_N2 - 1), where theta_N2 is evaluated once at the END of each
        of the 10 H_raw-plateaus and dominates every N inside it (Psi_N is a monotone partial sum). The
        certified sup K_paper on the whole range is {IMP3738_K_PAPER_MAX.toExponential(4)}, a margin of{' '}
        {IMP3738_MARGIN_FACTOR.toExponential(2)}&times; below the imp-963 carryforward K ={' '}
        {IMP3738_CARRYFORWARD_K} it retires.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Certified F_mb upper edge across the 10 plateaus, N in [1e4, 1e6]
      </p>
      <PlateauEnclosureChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Certified K_paper vs the retired heuristic carryforward
      </p>
      <KComparisonChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each horizontal segment is one
        H_raw-plateau's certified upper edge of F_mb, flat across the whole plateau because the bound is
        derived once at the plateau's end index N2 and dominates every smaller N in the plateau
        (plateau-monotonicity of Psi_N). The true lower edge F_mb(N) &ge; 0 holds at every N but cannot
        be drawn on a log axis; only the certified upper edge is plotted. The second chart shows why this
        matters: the retired imp-963 K = 0.2014 heuristic carryforward sat more than four orders of
        magnitude above the value imp-3725 actually certifies.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> rigorous real-analysis enclosure
        given the Odlyzko zero table as input (no RH, no GUE, no local law); discharges the
        cond-fmb-nonregression-above-1e4 hypothesis and retires the maxSmoothScaleRatio = 2.15 heuristic
        slack. It does NOT touch cond-CH or the other conditional legs of bound-imp-1088-finite-1e6, and. NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3377-rescue-budget-height-map" style={{ color: 'var(--series-5)' }}>
          Rescue-Budget K-to-Height Map (imp-3275)
        </Link>
      </div>
    </div>
  );
}
