import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34078_ESTIMATOR_CURVE,
  IMP34078_CROSSINGS,
  IMP34078_SPAN_BOUND,
} from '../data/imp-34078-pointwise-vs-window-exponent-viz-data.js';
import { ED } from '../styles/tokens.js';

function EstimatorChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 48;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34078_ESTIMATOR_CURVE;
  const minX = 10;
  const maxX = 70;
  const minY = 0.28;
  const maxY = 0.5;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const pointPath = rows.map((r) => `${xAt(r.log10N)},${yAt(r.p)}`).join(' ');
  const windowPath = rows.map((r) => `${xAt(r.log10N)},${yAt(r.w)}`).join(' ');

  const thresholdY = yAt(IMP34078_CROSSINGS.within1pct.threshold);
  const asymptoteY = yAt(0.5);
  const pointX = xAt(IMP34078_CROSSINGS.within1pct.point_log10N);
  const windowX = xAt(IMP34078_CROSSINGS.within1pct.window_start_log10N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={asymptoteY} x2={padL + cW} y2={asymptoteY} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,3" />
      <line x1={padL} y1={thresholdY} x2={padL + cW} y2={thresholdY} stroke={ED.rule} strokeWidth={1.25} strokeDasharray="5,3" />

      <line x1={windowX} y1={padT} x2={windowX} y2={padT + cH} stroke={ED.brassDeco} strokeWidth={1.25} strokeDasharray="3,3" />
      <line x1={pointX} y1={padT} x2={pointX} y2={padT + cH} stroke={ED.series1} strokeWidth={1.25} strokeDasharray="3,3" />

      <polyline points={windowPath} fill="none" stroke={ED.brassDeco} strokeWidth={2} />
      <polyline points={pointPath} fill="none" stroke={ED.series1} strokeWidth={2} />

      {[10, 20, 30, 40, 50, 60, 70].map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {t}
        </text>
      ))}
      {[0.3, 0.35, 0.4, 0.45, 0.5].map((y) => (
        <text key={`yt-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N)
      </text>

      <text x={padL + 6} y={padT + 12} fill={ED.brass} fontSize={9.5}>
        windowed p_eff(N), 12-decade OLS (leads pointwise)
      </text>
      <text x={padL + 6} y={padT + 24} fill={ED.series1} fontSize={9.5}>
        pointwise p(N)
      </text>
      <text x={windowX - 4} y={padT + cH - 6} fill={ED.brass} fontSize={8.5} textAnchor="end">
        window ~{IMP34078_CROSSINGS.within1pct.window_start_log10N}
      </text>
      <text x={pointX + 4} y={padT + cH - 18} fill={ED.series1} fontSize={8.5}>
        pointwise ~{IMP34078_CROSSINGS.within1pct.point_log10N}
      </text>
    </svg>
  );
}

function DeltaDecayChart() {
  const svgW = 680;
  const svgH = 260;
  const padL = 48;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34078_ESTIMATOR_CURVE;
  const minX = 10;
  const maxX = 70;
  const minY = 0;
  const maxY = 10;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  // Skip the log10N=10 ramp point (deltaTimesLsq=85, off this chart's scale
  // -- the O(1) bound only kicks in once E_coll dominates E_flow).
  const tailRows = rows.filter((r) => r.log10N >= 12);
  const path = tailRows.map((r) => `${xAt(r.log10N)},${yAt(r.deltaTimesLsq)}`).join(' ');
  const boundY = yAt(IMP34078_SPAN_BOUND.analyticSOverFour);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={boundY} x2={padL + cW} y2={boundY} stroke={ED.series7} strokeWidth={1.25} strokeDasharray="5,3" />
      <polyline points={path} fill="none" stroke={ED.series3} strokeWidth={2} />

      {[10, 20, 30, 40, 50, 60, 70].map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
          {t}
        </text>
      ))}
      {[0, 2, 4, 6, 8, 10].map((y) => (
        <text key={`yt-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={8.5}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        log10(N)
      </text>
      <text x={padL + 6} y={padT + 12} fill={ED.series3} fontSize={9.5}>
        delta(N) * (log T0)^2, delta = p_eff - p
      </text>
      <text x={padL + cW - 4} y={boundY - 4} fill={ED.series7} fontSize={9.5} textAnchor="end">
        analytic S/4 = {IMP34078_SPAN_BOUND.analyticSOverFour.toFixed(3)} (S = 12 ln10)
      </text>
    </svg>
  );
}

export default function Imp34078PointwiseVsWindowExponentViz() {
  const c1 = IMP34078_CROSSINGS.within1pct;
  const c01 = IMP34078_CROSSINGS.within0_1pct;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Pointwise vs Windowed Exponent Estimators (imp-34006)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34006 co-tabulated two estimators of the imp-3463 far-tail decay
        exponent on a shared N ladder: the imp-33816 POINTWISE local exponent
        p(N) (cyan) and the imp-33274 WINDOWED effective exponent p_eff(N)
        (yellow), a fixed 12-decade OLS slope anchored at its START N. Because
        p(N) rises monotonely toward 1/2, the 12-decade window averages in
        higher-N/higher-p contributions, so p_eff(N) &gt; p(N) at every shared
        rung -- the window curve sits consistently above and to the left of
        the pointwise curve, reaching the within-1% threshold (p &gt;= 0.495,
        dashed grey) roughly {c1.leadDecades} decades earlier.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p(N) and p_eff(N) vs log10(N), within-1% crossings marked
      </p>
      <EstimatorChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        delta(N) * (log T0)^2 vs log10(N) -- the offset decay, one log-power faster than the shared gap
      </p>
      <DeltaDecayChart />
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginTop: '0.5rem', maxWidth: 700 }}>
        The pointwise gap 1/2 - p(N) decays as ~1/(2 log T0), but the offset
        delta(N) = p_eff(N) - p(N) decays one log-power faster, as
        ~const/(log T0)^2: the product delta(N)*(log T0)^2 stays O(1)-bounded
        on the ladder tail, rising toward but staying below the analytic S/4
        span bound (pink dashed line, S = 12 ln10 for the 12-decade window).
        The two estimators therefore converge onto the same 1/2 law -- their
        disagreement is sub-leading and vanishes relative to the shared gap.
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
        <strong style={{ color: 'var(--ink-soft)' }}>The two thresholds:</strong> within-1%
        (p &gt;= 0.495) the pointwise crossing sits at log10(N) ~ {c1.point_log10N}
        {' '}while the window-START crossing leads by {c1.leadDecades} decades, at
        {' '}~{c1.window_start_log10N}. One threshold deeper, within-0.1%
        (p &gt;= 0.4995, off this chart's domain), the pointwise crossing sits at
        {' '}log10(N) ~ {c01.point_log10N} and the window-START crossing leads by
        {' '}{c01.leadDecades} decades, at ~{c01.window_start_log10N} -- in both cases
        the lead is essentially half the 12-decade window span, because the
        fixed-span OLS reads the pointwise exponent near its window centroid.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement
        only, co-tabulating two inherited exponent estimators on a shared N
        ladder. The component model is the inherited imp-3220/imp-3406
        extrapolation, NOT a rigorous asymptotic; changes no bound; imp-3066
        K_a&gt;=0 untouched; C_mb GUE-conditional per imp-486 untouched; NO QED.
      </div>
    </div>
  );
}
