import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION } from '../data/imp-95445-total-offlattice-onset-blaschke-composition.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION;
const ROWS = DATA.rows;
const DELTA_PCT = ROWS.map((r) => r.delta * 100);

// Line chart: x = log10(delta), y = onset depth. Three series -- the
// imp-95253 SPLIT-LOO Blaschke leg (blue), the imp-95429 RZ-PEN total
// (red), and the combined min (thick gold, overlapping SPLIT-LOO
// throughout since it binds at every delta in this band).
function OnsetLadderChart() {
  const svgW = 720;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 260;
  const svgH = padT + plotH + padB;

  const xVals = ROWS.map((r) => Math.log10(r.delta));
  const xMin = Math.min(...xVals) - 0.15;
  const xMax = Math.max(...xVals) + 0.15;
  const xOf = (v) => padL + ((v - xMin) / (xMax - xMin)) * plotW;

  const allY = ROWS.flatMap((r) => [r.splitLooOnset, r.rzpenTotalOnset]);
  const top = Math.max(...allY) + 1;
  const bot = Math.min(...allY) - 1;
  const yOf = (v) => padT + ((top - v) / (top - bot)) * plotH;

  const pathOf = (key) =>
    ROWS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(xVals[i])} ${yOf(r[key])}`).join(' ');

  const yTicks = [12, 14, 16, 18, 20, 22, 24].filter((v) => v >= bot && v <= top);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line key={`g${v}`} x1={padL} y1={yOf(v)} x2={padL + plotW} y2={yOf(v)} stroke={ED.ruleSoft} strokeWidth={1} />
      ))}
      <path d={pathOf('rzpenTotalOnset')} fill="none" stroke={ED.series2} strokeWidth={2} strokeDasharray="6 3" />
      <path d={pathOf('combinedOnset')} fill="none" stroke={ED.brassDeco} strokeWidth={3.5} opacity={0.55} />
      <path d={pathOf('splitLooOnset')} fill="none" stroke={ED.series1} strokeWidth={2} />
      {ROWS.map((r, i) => (
        <g key={r.delta}>
          <circle cx={xOf(xVals[i])} cy={yOf(r.rzpenTotalOnset)} r={4} fill={ED.series2} />
          <circle cx={xOf(xVals[i])} cy={yOf(r.splitLooOnset)} r={4} fill={ED.series1} />
          <text x={xOf(xVals[i])} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
            &plusmn;{DELTA_PCT[i].toFixed(2)}%
          </text>
        </g>
      ))}
      {yTicks.map((v) => (
        <text key={`t${v}`} x={padL - 8} y={yOf(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log-rate jitter magnitude delta (percent)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        firing-depth onset
      </text>
    </svg>
  );
}

// Bar chart: the RZ-PEN over-estimate (rzpenTotalOnset - combinedOnset)
// vs delta, showing the gap widening from ~2% to ~32% of onset depth.
function OverEstimateChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 20;
  const padT = 20;
  const padB = 46;
  const plotW = svgW - padL - padR;
  const plotH = 180;
  const svgH = padT + plotH + padB;

  const maxOver = Math.max(...ROWS.map((r) => r.rzpenOverEstimate));
  const yOf = (v) => padT + plotH - (v / maxOver) * plotH;
  const slot = plotW / ROWS.length;
  const barW = slot * 0.5;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {ROWS.map((r, i) => {
        const cx = padL + slot * (i + 0.5);
        const h = plotH - (yOf(r.rzpenOverEstimate) - padT);
        return (
          <g key={r.delta}>
            <rect x={cx - barW / 2} y={yOf(r.rzpenOverEstimate)} width={barW} height={h} fill={ED.series2} />
            <text x={cx} y={yOf(r.rzpenOverEstimate) - 6} textAnchor="middle" fill={ED.ink} fontSize={9}>
              +{r.rzpenOverEstimate.toFixed(2)}
            </text>
            <text x={cx} y={padT + plotH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
              &plusmn;{DELTA_PCT[i].toFixed(2)}%
            </text>
          </g>
        );
      })}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={ED.rule} strokeWidth={1.5} />
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        log-rate jitter magnitude delta (percent)
      </text>
      <text
        x={12}
        y={padT + plotH / 2}
        textAnchor="middle"
        fill={ED.inkSoft}
        fontSize={9.5}
        transform={`rotate(-90 12 ${padT + plotH / 2})`}
      >
        RZ-PEN over-estimate (depth units)
      </text>
    </svg>
  );
}

export default function Imp95491CombinedOfflatticeOnsetLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Combined Off-Lattice Onset: SPLIT-LOO vs RZ-PEN Total (imp-95445)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> a measurement-only
        page tabulating the imp-95445 record. It compares two independent valid
        every-octave certificates on a common off-lattice draw and changes no bound.
        Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        Two valid off-lattice every-octave certificates coexist on the same model
        &Lambda;: the imp-95374/imp-95429 RZ-PEN symbol-pencil floor, and the imp-95253
        SPLIT-LOO closed certificate priced through the leave-one-out Blaschke fence
        &Phi;<sub>k</sub>. Since the frontier may use whichever certificate fires
        shallower, the true combined onset is the <em>min</em> of the two firing
        depths. imp-95445 composed both legs on the identical m&nbsp;=&nbsp;8
        mulberry32 draw (seed 0xc0ffee, worst-of-400) used by imp-95429.
      </p>

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Firing-depth onset vs jitter magnitude &mdash; SPLIT-LOO Blaschke leg (blue),
        RZ-PEN total (red dashed), combined min (gold, overlapping SPLIT-LOO throughout)
      </h3>
      <OnsetLadderChart />

      <h3 style={{ color: 'var(--ink)', fontSize: '0.95rem', margin: '1.5rem 0 0.5rem' }}>
        RZ-PEN over-estimate of the true combined onset (depth units)
      </h3>
      <OverEstimateChart />

      <table style={{ width: '100%', fontSize: '0.78rem', color: 'var(--ink)', borderCollapse: 'collapse', marginTop: '1.25rem' }}>
        <thead>
          <tr style={{ color: 'var(--ink-faint)' }}>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>delta</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>SPLIT-LOO onset</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>RZ-PEN total onset</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>combined (min)</th>
            <th style={{ textAlign: 'left', paddingBottom: 4 }}>binds</th>
            <th style={{ textAlign: 'right', paddingBottom: 4 }}>RZ-PEN over-est.</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={r.delta} style={{ borderTop: '1px solid color-mix(in srgb, var(--rule) 15%, transparent)' }}>
              <td style={{ padding: '3px 0' }}>&plusmn;{DELTA_PCT[i].toFixed(2)}%</td>
              <td style={{ textAlign: 'right' }}>{r.splitLooOnset.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.rzpenTotalOnset.toFixed(4)}</td>
              <td style={{ textAlign: 'right' }}>{r.combinedOnset.toFixed(4)}</td>
              <td style={{ color: 'var(--series-1)' }}>{r.binds}</td>
              <td style={{ textAlign: 'right', color: 'var(--series-2)' }}>+{r.rzpenOverEstimate.toFixed(4)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the SPLIT-LOO
        Blaschke leg (blue) fires strictly shallower than the RZ-PEN total (red) at
        every jitter magnitude in this band, so the combined onset (gold) tracks
        SPLIT-LOO exactly and the RZ-PEN column is a genuine over-estimate throughout
        &plusmn;1.56%&ndash;&plusmn;25%. The gap between the two curves widens from
        about 2% of onset depth at mild jitter to about 32% (7.5 depth units) at
        &plusmn;25%, because the RZ-PEN floor collapses in a near-collision draw while
        the SPLIT-LOO Blaschke fence, sharing that same draw, degrades far more gently.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page consuming the
        frozen imp-95445 record (recomputed SPLIT-LOO column, baked imp-95429 RZ-PEN
        column; no re-derivation). Distinct from the imp-95435/imp-95455 pages, which
        chart the imp-95374 floor-degradation ladder alone (holding the numerator
        fixed); this page charts the two-certificate composition and its combined
        firing depth. The two legs use different model Gram conventions, so "min" is a
        firing-depth comparison of two independent valid upper bounds, not a unified
        single certificate. Changes no bound, establishes no operator positivity, no RH
        claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA. NO QED.
      </div>
    </div>
  );
}
