import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3631_FOLD_LADDER,
  IMP3631_RUNGS,
  IMP3631_BAND,
} from '../data/imp-3631-mfold-aliasing-threshold-ladder-viz-data.js';
import { ED } from '../styles/tokens.js';

const FOLD_COLOR = ED.series4;
const RUNG_COLOR = ED.series1;
const BINDING_COLOR = ED.series5;

function FoldLadderVsRungsChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const nMin = 150;
  const nMax = 11000;
  const yS = (n) =>
    padT + cH * (1 - (Math.log10(n) - Math.log10(nMin)) / (Math.log10(nMax) - Math.log10(nMin)));

  const barW = 44;
  const items = [
    ...IMP3631_FOLD_LADDER.map((f) => ({ x: f.m, label: 'm=' + f.m, value: f.nThresholdExact, color: FOLD_COLOR })),
  ];
  const foldGap = (cW * 0.45 - items.length * barW) / (items.length + 1);
  const rungGap = (cW * 0.45 - IMP3631_RUNGS.length * barW) / (IMP3631_RUNGS.length + 1);
  const rungGroupX = padL + cW * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[200, 400, 764, 1200, 2400, 4800, 9600].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP3631_BAND.bindingFloor)}
        x2={padL + cW}
        y2={yS(IMP3631_BAND.bindingFloor)}
        stroke={BINDING_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + 4} y={yS(IMP3631_BAND.bindingFloor) - 4} fill={ED.series5} fontSize={9}>
        binding floor N_replica ~ {IMP3631_BAND.bindingFloor.toFixed(0)} (m = 1)
      </text>

      {IMP3631_FOLD_LADDER.map((f, i) => {
        const bx = padL + foldGap * (i + 1) + barW * i;
        const by = yS(f.nThresholdExact);
        return (
          <g key={'fold' + f.m}>
            <rect x={bx} y={by} width={barW} height={padT + cH - by} fill={FOLD_COLOR} opacity={0.85} />
            <text x={bx + barW / 2} y={by - 6} textAnchor="middle" fill={ED.brass} fontSize={9}>
              {f.nThreshold}
            </text>
            <text x={bx + barW / 2} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              m={f.m}
            </text>
          </g>
        );
      })}

      {IMP3631_RUNGS.map((N, i) => {
        const bx = rungGroupX + rungGap * (i + 1) + barW * i;
        const by = yS(N);
        return (
          <g key={'rung' + N}>
            <rect x={bx} y={by} width={barW} height={padT + cH - by} fill={RUNG_COLOR} opacity={0.85} />
            <text x={bx + barW / 2} y={by - 6} textAnchor="middle" fill={ED.series1} fontSize={9}>
              {N}
            </text>
            <text x={bx + barW / 2} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
              N={N}
            </text>
          </g>
        );
      })}

      <line
        x1={rungGroupX - foldGap / 2}
        y1={padT}
        x2={rungGroupX - foldGap / 2}
        y2={padT + cH}
        stroke={ED.rule}
        strokeWidth={1}
        strokeDasharray="2,4"
      />

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        fold thresholds N_m (amber) vs imp-3558 rungs N (blue) -- log scale
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}
      >
        panel count N (log scale)
      </text>

      <g fontSize={9}>
        <rect x={padL + 6} y={padT + 8} width={10} height={10} fill={FOLD_COLOR} opacity={0.85} />
        <text x={padL + 20} y={padT + 17} fill={ED.brass}>m-fold threshold N_m = N_replica/m</text>
        <rect x={padL + 6} y={padT + 22} width={10} height={10} fill={RUNG_COLOR} opacity={0.85} />
        <text x={padL + 20} y={padT + 31} fill={ED.series1}>imp-3558 empirical rung</text>
      </g>
    </svg>
  );
}

export default function Imp3631MfoldAliasingThresholdLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="m-Fold Aliasing Threshold Ladder vs the imp-3558 Rungs (imp-3601 / imp-3631)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3601 derived the m-fold aliasing replica fold-in ladder N_m =
        N_replica/m: the threshold panel count below which an m-th-order
        midpoint-quadrature alias image of an in-band feature could fold
        into the scanned band (0, 400]. The floors decrease monotonically in
        m -- 764, 382, 255, 191 for m = 1..4 -- so the first replica (m = 1)
        is the binding one, and sup_m N_m = N_1 = N_replica &asymp; 764. The
        chart below plots all four fold thresholds against the four
        imp-3558 rungs N in &#123;1200, 2400, 4800, 9600&#125;: every rung
        sits strictly above every fold floor, so the band is provably free
        of first- AND higher-order aliasing replicas at each rung.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Fold thresholds N_m (decreasing in m) vs the imp-3558 rungs, all replica-free
      </p>
      <FoldLadderVsRungsChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the
        left group of four amber bars is the m-fold threshold ladder N_m =
        N_replica/m (m = 1..4), strictly decreasing on a log axis; the
        dashed purple line marks the binding floor N_replica &asymp; 764,
        attained at m = 1. The right group of four blue bars is the
        imp-3558 rung ladder N in &#123;1200, 2400, 4800, 9600&#125;: every
        rung clears every fold threshold, with the smallest rung N = 1200
        clearing the binding floor by a factor &asymp;
        {IMP3631_BAND.smallestRungMarginOverBindingFloor.toFixed(2)} and the
        second-fold floor by &asymp;
        {IMP3631_BAND.smallestRungMarginOverSecondFold.toFixed(2)}.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong>{' '}
        derivation/certification only -- confirms that no higher-order fold
        raises the imp-3582 replica-free floor N_replica &asymp; 764. It does
        NOT give xi* or the sup a closed form (the imp-3470 stationarity
        equation stays transcendental) and does not extend the finite-domain
        (0, 400] measurement. The imp-3066 off-diagonal endpoint-Hankel
        K_a &ge; 0 positivity remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3658-planted-replica-argmax-drift" style={{ color: 'var(--series-5)' }}>
          Planted-Replica Argmax-Drift Discriminator (imp-3622 / imp-3658)
        </Link>
      </div>
    </div>
  );
}
