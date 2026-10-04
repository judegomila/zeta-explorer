import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP3627_FLOW_GAP_GRID,
  IMP3627_EXACT_IDENTITY_FLOOR,
  IMP3627_MIN_RESID_SHRINK,
  IMP3627_MAX_RESID_SHRINK,
} from '../data/imp-3627-flow-gap-nextorder-viz-data.js';
import { ED } from '../styles/tokens.js';

const MEASURED_COLOR = ED.series2;
const LEADING_COLOR = ED.series4;
const NEXTORDER_COLOR = ED.series3;
const RESID_LEADING_COLOR = ED.series2;
const RESID_NEXTORDER_COLOR = ED.series3;

function GapChart() {
  const svgW = 640;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const fMin = 0.4;
  const fMax = 2.1;
  const gMin = 0.15;
  const gMax = 0.75;

  const xS = (f) => padL + ((f - fMin) / (fMax - fMin)) * cW;
  const yS = (g) => padT + cH * (1 - (g - gMin) / (gMax - gMin));

  const line = (key) =>
    IMP3627_FLOW_GAP_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r[key]).toFixed(1)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {[0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toFixed(1)}%
          </text>
        </g>
      ))}

      <path d={line('leading_pct')} fill="none" stroke={LEADING_COLOR} strokeWidth={2} strokeDasharray="4,3" />
      <path d={line('nextorder_pct')} fill="none" stroke={NEXTORDER_COLOR} strokeWidth={2} strokeDasharray="1,3" />
      <path d={line('measured_pct')} fill="none" stroke={MEASURED_COLOR} strokeWidth={2} />
      {IMP3627_FLOW_GAP_GRID.map((r) => (
        <circle key={r.factor} cx={xS(r.factor)} cy={yS(r.measured_pct)} r={3.6} fill={MEASURED_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {IMP3627_FLOW_GAP_GRID.map((r) => (
        <g key={'x' + r.factor}>
          <line x1={xS(r.factor)} y1={padT + cH} x2={xS(r.factor)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(r.factor)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {r.factor}x
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        E_trunc floor factor f (0.5x .. 2x baseline)
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={'rotate(-90,14,' + (padT + cH / 2) + ')'}>
        flow gap = 1 - N_half/N_x (%)
      </text>

      <g fontSize={9}>
        <line x1={padL + 2} y1={padT + 12} x2={padL + 10} y2={padT + 12} stroke={MEASURED_COLOR} strokeWidth={2} />
        <text x={padL + 14} y={padT + 15} fill={ED.series2}>measured gap (root-solved)</text>
        <line x1={padL + 2} y1={padT + 26} x2={padL + 10} y2={padT + 26} stroke={LEADING_COLOR} strokeWidth={2} strokeDasharray="4,3" />
        <text x={padL + 14} y={padT + 29} fill={ED.brass}>leading law: 2 E_flow(N_x)/E_trunc</text>
        <line x1={padL + 2} y1={padT + 40} x2={padL + 10} y2={padT + 40} stroke={NEXTORDER_COLOR} strokeWidth={2} strokeDasharray="1,3" />
        <text x={padL + 14} y={padT + 43} fill={ED.series3}>next-order: 2 eps(1+lambda) - (4mu+4lambda+3) eps^2</text>
      </g>
    </svg>
  );
}

function ResidualChart() {
  const svgW = 640;
  const padL = 68;
  const padR = 24;
  const padT = 24;
  const padB = 44;
  const cW = svgW - padL - padR;
  const cH = 260;
  const svgH = padT + cH + padB;

  const factors = IMP3627_FLOW_GAP_GRID.map((r) => r.factor);
  const allVals = IMP3627_FLOW_GAP_GRID.flatMap((r) => [r.resid_leading_pp, r.resid_nextorder_pp]).concat([IMP3627_EXACT_IDENTITY_FLOOR]);
  const logMin = Math.floor(Math.log10(Math.min(...allVals)));
  const logMax = Math.ceil(Math.log10(Math.max(...allVals)));

  const xMin = Math.log10(factors[0]);
  const xMax = Math.log10(factors[factors.length - 1]);
  const xS = (f) => padL + ((Math.log10(f) - xMin) / (xMax - xMin)) * cW;
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - logMin) / (logMax - logMin));

  const yTicks = [];
  for (let e = logMin; e <= logMax; e += 1) yTicks.push(Math.pow(10, e));

  const line = (key) =>
    IMP3627_FLOW_GAP_GRID.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.factor).toFixed(1) + ',' + yS(r[key]).toFixed(2)).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.6} />
          <text x={padL - 6} y={yS(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v.toExponential(0)}
          </text>
        </g>
      ))}

      <path d={line('resid_leading_pp')} fill="none" stroke={RESID_LEADING_COLOR} strokeWidth={2} strokeDasharray="1 3" />
      <path d={line('resid_nextorder_pp')} fill="none" stroke={RESID_NEXTORDER_COLOR} strokeWidth={2} />

      {IMP3627_FLOW_GAP_GRID.map((r) => (
        <g key={'d' + r.factor}>
          <circle cx={xS(r.factor)} cy={yS(r.resid_leading_pp)} r={2.6} fill={RESID_LEADING_COLOR} />
          <circle cx={xS(r.factor)} cy={yS(r.resid_nextorder_pp)} r={2.6} fill={RESID_NEXTORDER_COLOR} />
        </g>
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {factors.map((f) => (
        <text key={f} x={xS(f)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10}>
          f={f}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
        E_trunc floor factor f (E_trunc = f &times; 3.06e-5)
      </text>
    </svg>
  );
}

export default function Imp3627FlowGapNextorderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Flow-Gap Next-Order Correction Across the E_trunc Floor Grid (imp-3599)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-3580 found the root-solved flow gap 1-N<sub>half</sub>/N<sub>x</sub> tracks the leading law
        gap &asymp; 2 E<sub>flow</sub>(N<sub>x</sub>)/E<sub>trunc</sub> within a sqrt/log linearization,
        but with an unexplained residual of ~0.01-0.03 percentage points across the imp-3443
        half-to-double E<sub>trunc</sub> floor grid f &isin; {'{'}0.5, 0.75, 1.0, 1.5, 2.0{'}'}. imp-3599
        derived the next-order O(eps<sup>2</sup>) correction, dominated by the sqrt(N) log-drift term
        2&nbsp;&lambda;&nbsp;eps, and re-root-solved both crossings to measure how much of that residual
        it closes.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Measured gap vs the leading law vs the next-order model
      </p>
      <GapChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        Residual (log scale): the next-order model shrinks the leading-law residual by ~
        {IMP3627_MIN_RESID_SHRINK.toFixed(0)}-{IMP3627_MAX_RESID_SHRINK.toFixed(0)}&times; uniformly across the grid
      </p>
      <ResidualChart />
      <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--ink-faint)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span><span style={{ color: RESID_LEADING_COLOR }}>&#9644;</span> leading-law residual (imp-3580)</span>
        <span><span style={{ color: RESID_NEXTORDER_COLOR }}>&#9644;</span> next-order residual (imp-3599)</span>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> the top chart plots the
        root-solved gap against the two models -- the leading law (dashed) under-predicts at every
        floor, while the next-order model (dotted) tracks the measured curve so closely the two are
        nearly indistinguishable at this scale. The bottom chart makes the difference visible: on a
        log axis, the next-order residual sits ~
        {IMP3627_MIN_RESID_SHRINK.toFixed(0)}-{IMP3627_MAX_RESID_SHRINK.toFixed(0)}&times; below the
        leading-law residual at every floor, i.e. it closes ~94-95% of the ~0.01-0.03pp gap left by
        the leading law. imp-3599's closed identity gap = 1-(L<sub>half</sub>/L<sub>x</sub>)/(1+&eta;)<sup>2</sup>
        {' '}reproduces the root-solved gap to ~{IMP3627_EXACT_IDENTITY_FLOOR.toExponential(0)} at every
        floor -- the ~5% tail left by the next-order truncation (the named sub-gap
        imp-3599-nextorder-residual-tail) comes from the neglected O(eps<sup>3</sup>) term and slope
        curvature, not from the exact identity itself.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> derivation/measurement only &mdash;
        a conditional-share diagnostic, NOT an RH bound. No positivity, no bridge closure, NO QED. The
        imp-3066 off-diagonal endpoint-Hankel K<sub>a</sub> &ge; 0 positivity remains untouched.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink-faint)' }}>
        <strong>Related:</strong>{' '}
        <Link to="/viz-imp3655-flow-gap-residual-ladder" style={{ color: 'var(--series-5)' }}>
          Self-Consistent Flow-Gap Residual Ladder (imp-3617/imp-3655)
        </Link>
        {' | '}
        <Link to="/viz-imp3614-sigma-crossover-floor-invariance" style={{ color: 'var(--series-5)' }}>
          Sigma-Crossover Floor Invariance (imp-3580/imp-3614)
        </Link>
      </div>
    </div>
  );
}
