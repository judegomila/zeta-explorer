import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3635_FLOOR_GRID,
  IMP3635_FLOW_FACTORS,
  IMP3635_BAND,
} from '../data/imp-3635-flow-factor-band-viz-data.js';
import { ED } from '../styles/tokens.js';

const SERIES_COLORS = [ED.series1, ED.series4, ED.series5];

function FlowFactorBandChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 280;
  const svgH = padT + cH + padB;

  const yMin = 0.992;
  const yMax = 0.999;
  const yS = (v) => padT + cH * (1 - (v - yMin) / (yMax - yMin));

  const xMin = 0.5;
  const xMax = 2.0;
  const xS = (f) => padL + cW * ((f - xMin) / (xMax - xMin));

  const yTicks = [0.992, 0.993, 0.994, 0.995, 0.996, 0.997, 0.998, 0.999];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(3)}
          </text>
        </g>
      ))}

      <rect
        x={padL}
        y={yS(IMP3635_BAND.max)}
        width={cW}
        height={yS(IMP3635_BAND.min) - yS(IMP3635_BAND.max)}
        fill={ED.series5}
        opacity={0.08}
      />
      <text x={padL + 6} y={yS(IMP3635_BAND.max) - 5} fill={ED.series5} fontSize={9}>
        band [{IMP3635_BAND.min.toFixed(5)}, {IMP3635_BAND.max.toFixed(5)}] ~ {IMP3635_BAND.around}
      </text>

      {IMP3635_FLOW_FACTORS.map((ff, si) => {
        const pts = IMP3635_FLOOR_GRID.map((row) => ({
          x: xS(row.factor),
          y: yS(row.ratios[si]),
        }));
        const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
        return (
          <g key={ff.name}>
            <path d={path} fill="none" stroke={SERIES_COLORS[si]} strokeWidth={1.5} opacity={0.85} />
            {pts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={SERIES_COLORS[si]} opacity={0.9} />
            ))}
          </g>
        );
      })}

      {IMP3635_FLOOR_GRID.map((row) => (
        <text
          key={row.factor}
          x={xS(row.factor)}
          y={padT + cH + 17}
          textAnchor="middle"
          fill={ED.inkFaint}
          fontSize={9}
        >
          f={row.factor}
        </text>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_trunc floor factor f (0.5x .. 2.0x baseline)
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}
      >
        N_half / N_x ratio
      </text>

      <g fontSize={9}>
        {IMP3635_FLOW_FACTORS.map((ff, si) => (
          <g key={ff.name}>
            <circle cx={padL + 6} cy={padT + 8 + si * 14} r={3.5} fill={SERIES_COLORS[si]} opacity={0.9} />
            <text x={padL + 16} y={padT + 11 + si * 14} fill={ED.inkSoft}>
              {ff.label} ({ff.note})
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Imp3635FlowFactorBandViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Crossover Flow-Factor Band Invariance (imp-3604 / imp-3635)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3580 froze the Gronwall amplification at exp(2.37e-4) while
        root-solving the sigma = 1/2 half-decay crossing N_half and the
        E_coll = E_trunc crossover N_x across the imp-3443 half-to-double
        E_trunc floor grid, finding the ratio N_half/N_x sitting in a tight
        band ~ 0.996. imp-3604 re-solves both crossings sweeping the
        Gronwall multiplier over the rigorous imp-2644 A1-trap bracket
        [1, exp(4.74e-4)] = [1, 1.000474]. The chart below plots the ratio
        at every floor under all three flow factors: the curves sit on top
        of each other, all three collapsing onto the same
        [{IMP3635_BAND.min.toFixed(5)}, {IMP3635_BAND.max.toFixed(5)}]
        band -- the frozen-Gronwall choice moves the ratio by at most
        &asymp; {IMP3635_BAND.maxRatioSwing.toExponential(0)}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        N_half/N_x ratio per E_trunc floor, under the three bracket flow factors
      </p>
      <FlowFactorBandChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> each
        of the five E_trunc floors (f = 0.5 .. 2.0) carries three points --
        blue for Gronwall = 1 (the large-N vanishing limit), amber for the
        imp-3580 frozen node exp(2.37e-4), and purple for the imp-2644 C_G=2
        upper endpoint exp(4.74e-4). All three are visually indistinguishable
        at every floor: the ratio only moves in the sixth decimal place
        across the whole bracket, so the three lines overlap into what looks
        like a single monotone-decreasing curve. The frozen node at f = 1.0
        reproduces the imp-3580 baseline exactly (ratio{' '}
        {IMP3635_BAND.frozenBaselineRatio.toFixed(6)}, N_x ={' '}
        {IMP3635_BAND.frozenBaselineNx.toExponential(6)}).
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
        measurement/certification only -- confirms the imp-3580
        floor-invariance and ~0.996 band are Gronwall-insensitive, not a
        frozen-constant artifact. It does not establish a bridge closure or
        touch imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0 positivity,
        which remains untouched. NO QED.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3614-sigma-crossover-floor-invariance" style={{ color: 'var(--series-5)' }}>
          Sigma-Crossover Floor Invariance (imp-3580 / imp-3614)
        </Link>
      </div>
    </div>
  );
}
