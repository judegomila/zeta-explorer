/**
 * @see imp-34302-m2-ceiling-cohort-canonical-value-gate.js (build-time gate keeping this page's canonical
 *   kEnd*~21.281 ceiling distinct from the imp-34127 closed-form estimate)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form.js (the distinct, lower closed-form estimate)
 * @see imp-34247-widening-slope-pole-divergence.js (the dy/dk simple-pole characterization of this same k*)
 */
import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34237_FIXED_BAND_PEAK_ROWS,
  IMP34237_PEAK_INCREMENTS,
  IMP34237_PEAK_SECOND_DIFFERENCE,
  IMP34237_RESID_EXP_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
  IMP34237_EFLOW_OVER_RESID_ROWS,
  IMP34237_FIRST_BREAKDOWN_KEND,
  IMP34237_COMPUTABLE_WINDOW_COUNT,
  IMP34237_TOTAL_WINDOW_COUNT,
} from '../data/imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import { IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE } from '../data/imp-34247-widening-slope-pole-divergence.js';
import { ED } from '../styles/tokens.js';

// Panel 1: the fixed-band (k<=10) peak over the three computable windows,
// climbing +0.865303 -> +0.915942 -> +0.996333 with re-accelerating increments.
function PeakReaccelChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 54;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 19.5;
  const maxX = 21.5;
  const minY = 0.8;
  const maxY = 1.05;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const path = IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => `${xAt(r.kEnd)},${yAt(r.peak)}`).join(' ');
  const xTicks = [20.0, 20.5, 21.0];
  const yTicks = [0.8, 0.85, 0.9, 0.95, 1.0, 1.05];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT + cH - 4} x2={xAt(k)} y2={padT + cH + 4} stroke={ED.rule} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k.toFixed(1)}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        kEnd (window right edge)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        fixed-band (k&le;10) peak
      </text>

      <polyline points={path} fill="none" stroke={ED.series1} strokeWidth={2} />
      {IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => (
        <circle key={'pt' + r.kEnd} cx={xAt(r.kEnd)} cy={yAt(r.peak)} r={3.5} fill="#c4b5fd" stroke={ED.paper} strokeWidth={0.75} />
      ))}
    </svg>
  );
}

// Panel 2: resid_exp(k) decaying through the deep tail and crossing zero at
// k*~21.28095 -- the hard right edge past which eflow_over_resid has a pole.
function ResidExpZeroCrossingChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 18.7;
  const maxX = 21.8;
  // signed-log-ish axis: plot resid_exp directly, it spans ~3e-6 down to -5e-8, so
  // scale by sign(resid) * log10(1 + |resid|/1e-8) to keep both the decade decay
  // and the small negative tail rung visible on one linear pixel axis.
  const scale = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v) / 1e-8);
  const minY = scale(-6e-8);
  const maxY = scale(4e-6);

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((scale(y) - minY) / (maxY - minY)) * cH;

  const path = IMP34237_RESID_EXP_ROWS.map((r) => `${xAt(r.k)},${yAt(r.residExp)}`).join(' ');
  const zeroY = yAt(0);
  const xTicks = [19, 19.5, 20, 20.5, 21, 21.5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={zeroY - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        resid_exp = 0
      </text>

      {xTicks.map((k) => (
        <g key={'x' + k}>
          <line x1={xAt(k)} y1={padT} x2={xAt(k)} y2={padT + cH} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={xAt(k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {k}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        resid_exp(k) (signed-log scale)
      </text>

      <line x1={xAt(IMP34237_RESID_ZERO_KSTAR)} y1={padT} x2={xAt(IMP34237_RESID_ZERO_KSTAR)} y2={padT + cH} stroke={ED.series2} strokeWidth={1.25} strokeDasharray="5,3" />
      <text x={xAt(IMP34237_RESID_ZERO_KSTAR) + 4} y={padT + 12} fill={ED.series2} fontSize={9}>
        k* &asymp; {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} (pole)
      </text>

      <polyline points={path} fill="none" stroke={ED.series3} strokeWidth={1.75} />
      {IMP34237_RESID_EXP_ROWS.map((r) => (
        <circle
          key={'pt' + r.k}
          cx={xAt(r.k)}
          cy={yAt(r.residExp)}
          r={3}
          fill={r.residExp > 0 ? ED.series3 : ED.series2}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
    </svg>
  );
}

// Panel 3: eflow_over_resid = eflow_attr / resid_exp -- the log argument the fit
// takes -- flips sign across the k* pole, matching only the two flanking rungs
// that stay computable (21.25 positive, 21.5 negative).
function EflowOverResidPoleChart() {
  const svgW = 680;
  const svgH = 200;
  const padL = 60;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const minX = 20.9;
  const maxX = 21.8;
  const scale = (v) => Math.sign(v) * Math.log10(1 + Math.abs(v) / 1e-9);
  const maxAbs = Math.max(...IMP34237_EFLOW_OVER_RESID_ROWS.map((r) => Math.abs(scale(r.ratio))));

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH / 2 - (scale(y) / maxAbs) * (cH / 2 - 8);
  const zeroY = padT + cH / 2;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={zeroY} x2={padL + cW} y2={zeroY} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />
      <text x={padL + cW - 4} y={zeroY - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        eflow_over_resid = 0
      </text>

      <line x1={xAt(IMP34237_RESID_ZERO_KSTAR)} y1={padT} x2={xAt(IMP34237_RESID_ZERO_KSTAR)} y2={padT + cH} stroke={ED.series2} strokeWidth={1.25} strokeDasharray="5,3" />
      <text x={xAt(IMP34237_RESID_ZERO_KSTAR) + 4} y={padT + 12} fill={ED.series2} fontSize={9}>
        k* &asymp; {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} (pole)
      </text>

      {IMP34237_EFLOW_OVER_RESID_ROWS.map((r) => (
        <g key={'bar' + r.k}>
          <line x1={xAt(r.k)} y1={zeroY} x2={xAt(r.k)} y2={yAt(r.ratio)} stroke={r.ratio > 0 ? ED.series3 : ED.series2} strokeWidth={4} />
          <circle cx={xAt(r.k)} cy={yAt(r.ratio)} r={3.5} fill={r.ratio > 0 ? ED.series3 : ED.series2} stroke={ED.paper} strokeWidth={0.75} />
          <text x={xAt(r.k)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.k}
          </text>
          <text x={xAt(r.k)} y={yAt(r.ratio) + (r.ratio > 0 ? -8 : 14)} textAnchor="middle" fill={ED.inkSoft} fontSize={9} fontFamily="monospace">
            {r.ratio.toExponential(2)}
          </text>
        </g>
      ))}

      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        k
      </text>
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        eflow_over_resid (signed-log scale)
      </text>
    </svg>
  );
}

// Coverage strip: the ticket's full kEnd=20..26 grid (13 windows, step 0.5) with only
// the first IMP34237_COMPUTABLE_WINDOW_COUNT defined -- makes the gap visible instead of
// letting the 2-bar pole chart above imply the ladder simply ends where it is drawn.
function CoverageIndicator() {
  const cellSize = 24;
  const gap = 4;
  const n = IMP34237_TOTAL_WINDOW_COUNT;
  const computable = IMP34237_COMPUTABLE_WINDOW_COUNT;
  const svgW = n * (cellSize + gap) - gap;
  const svgH = cellSize + 18;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
        {Array.from({ length: n }, (_, i) => {
          const x = i * (cellSize + gap);
          const isComputable = i < computable;
          const kEnd = 20 + i * 0.5;
          return (
            <g key={kEnd}>
              <rect
                x={x}
                y={0}
                width={cellSize}
                height={cellSize}
                rx={3}
                fill={isComputable ? ED.series3 : ED.paper3}
                stroke={isComputable ? '#166534' : ED.rule}
                strokeWidth={1}
              />
              <text x={x + cellSize / 2} y={cellSize + 13} textAnchor="middle" fill={ED.inkFaint} fontSize={8}>
                {kEnd.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
        kEnd window coverage: {computable} of {n} defined (green). The remaining{' '}
        {n - computable} sit past the k* &asymp; {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} pole
        and are UNDEFINED, not merely unswept.
      </p>
    </div>
  );
}

export default function Imp34237FixedBandPeakReaccelAndSurrogatePoleViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Fixed-Band Peak Re-Acceleration & Surrogate Pole (imp-34237 / imp-34169)" />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-faint)' }}>
          &larr; back to the M2-ceiling cohort index
        </Link>
      </p>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34169 pushed the imp-34109 fixed-band (k&le;10) peak sweep one further decade.
        Over the three windows that stay computable (kEnd = 20.0, 20.5, 21.0) the peak keeps
        climbing {IMP34237_FIXED_BAND_PEAK_ROWS[0].peak.toFixed(6)} &rarr;{' '}
        {IMP34237_FIXED_BAND_PEAK_ROWS[1].peak.toFixed(6)} &rarr;{' '}
        {IMP34237_FIXED_BAND_PEAK_ROWS[2].peak.toFixed(6)}, and its increments{' '}
        {IMP34237_PEAK_INCREMENTS[0].toFixed(6)} &rarr; {IMP34237_PEAK_INCREMENTS[1].toFixed(6)}{' '}
        RE-ACCELERATE (second difference +{IMP34237_PEAK_SECOND_DIFFERENCE.toFixed(6)}). The sweep
        cannot continue past kEnd = {IMP34237_FIRST_BREAKDOWN_KEND.toFixed(1)}: the imp-33810/imp-33843
        surrogate resid_exp(k) decays through the deep tail and crosses zero at k* &asymp;{' '}
        {IMP34237_RESID_ZERO_KSTAR.toFixed(5)}, putting a pole in eflow_over_resid so only{' '}
        {IMP34237_COMPUTABLE_WINDOW_COUNT} of the ticket's {IMP34237_TOTAL_WINDOW_COUNT} windows compute.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        fixed-band (k&le;10) peak over the three computable windows -- climbing, not settling
      </p>
      <PeakReaccelChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        surrogate resid_exp(k) decaying through the deep tail and crossing zero at k* (the hard right edge)
      </p>
      <ResidExpZeroCrossingChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        eflow_over_resid = eflow_attr / resid_exp -- the log argument the fit takes -- flips sign across the pole
      </p>
      <CoverageIndicator />
      <EflowOverResidPoleChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>kEnd</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>fixed-band peak</th>
          </tr>
        </thead>
        <tbody>
          {IMP34237_FIXED_BAND_PEAK_ROWS.map((r) => (
            <tr key={r.kEnd} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(2)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.peak.toFixed(6)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Viz-data only, baked
        literals reproducing the imp-34169 measurement; no new derivation, no bound changed.
        Only {IMP34237_COMPUTABLE_WINDOW_COUNT} of the ticket's {IMP34237_TOTAL_WINDOW_COUNT} kEnd
        windows compute -- the surrogate resid_exp(k) hits a pole at k* &asymp;{' '}
        {IMP34237_RESID_ZERO_KSTAR.toFixed(5)}, so windows past kEnd ={' '}
        {IMP34237_FIRST_BREAKDOWN_KEND.toFixed(1)} are undefined, not merely unswept. Descriptive
        surrogate/fit, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED;
        imp-3066 K_a&ge;0 untouched; NO QED.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Same ceiling, closed-form cohort:</strong> this k*
        &asymp; {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} pole is the imp-34023 M2-residual
        sign-change ceiling. imp-34127 derived it in closed form and found the CONTINUOUS
        residual vanishes identically -- the crossing is a pure 2-point-secant-vs-5-point-OLS
        discretization artifact, giving a leading closed-form kEnd* &asymp; 21.00 (~0.28 below the
        bisected value). imp-34189 then formed the next-order term and found it does NOT close
        that gap -- it moves kEnd* FURTHER away (to &asymp; 20.72) because the expansion parameter
        e&middot;D is O(1) at a full-decade window, so the Taylor-in-D series does not converge and
        the true crossing has no window-width limit. Cross-linked here for context only; no bound
        or claim on this page changes. See the{' '}
        <Link to="/viz-imp34281-m2-ceiling-cohort-index" style={{ color: 'var(--ink-soft)' }}>
          full M2-ceiling cohort index
        </Link>{' '}
        for the other viz surfaces sharing this ceiling.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Same k*, a fitted local slope pole (imp-34247):</strong>{' '}
        the eflow_over_resid pole plotted above also drives a divergence in the imp-34188 local tail
        slope dy/dk of y(k) = ln(eflow_over_resid_k): imp-34247 fits it as a SIMPLE POLE dy/dk ={' '}
        B(k) + 1/(k* - k) with residue exactly{' '}
        {IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.residueNearPole.toFixed(3)} (order p &asymp;{' '}
        {IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.poleOrder.toFixed(2)}), the smooth background B(k) a
        slowly-varying negative drift, and the far-field plateau dy/dk &asymp;{' '}
        {IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.farFieldPlateau.toFixed(3)}. From this independent
        local-slope angle the widening-slope ladder rungs are clean only through k &asymp; 18 and
        become ceiling-contaminated from k ={' '}
        {IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.contaminationOnsetK} onward -- the same k* &asymp;{' '}
        {IMP34237_RESID_ZERO_KSTAR.toFixed(5)} ceiling visualized above, now characterized as a
        residue-1 simple pole rather than merely located. Cross-linked here for context only; no
        bound or claim on this page changes.
      </div>
    </div>
  );
}
