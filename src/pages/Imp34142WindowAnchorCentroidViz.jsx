import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34142_ESTIMATOR_CURVE,
  IMP34142_WITHIN_1PCT_CROSSINGS,
  IMP34142_WITHIN_0_1PCT_CROSSINGS_FROM_MODULE,
  IMP34142_LEADS_AND_RESIDUALS,
} from '../data/imp-34142-window-anchor-centroid-viz-data.js';

function CentroidChart() {
  const svgW = 680;
  const svgH = 340;
  const padL = 48;
  const padR = 20;
  const padT = 16;
  const padB = 36;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34142_ESTIMATOR_CURVE;
  const minX = 10;
  const maxX = 70;
  const minY = 0.28;
  const maxY = 0.5;

  const xAt = (x) => padL + ((x - minX) / (maxX - minX)) * cW;
  const yAt = (y) => padT + cH - ((y - minY) / (maxY - minY)) * cH;

  const pointPath = rows.map((r) => `${xAt(r.log10N)},${yAt(r.p)}`).join(' ');
  const startPath = rows.map((r) => `${xAt(r.log10N)},${yAt(r.s)}`).join(' ');
  const centrePath = rows
    .filter((r) => r.c !== null)
    .map((r) => `${xAt(r.log10N)},${yAt(r.c)}`)
    .join(' ');

  const thresholdY = yAt(IMP34142_WITHIN_1PCT_CROSSINGS.threshold);
  const asymptoteY = yAt(0.5);
  const pointX = xAt(IMP34142_WITHIN_1PCT_CROSSINGS.point.log10N);
  const startX = xAt(IMP34142_WITHIN_1PCT_CROSSINGS.start.log10N);
  const centreX = xAt(IMP34142_WITHIN_1PCT_CROSSINGS.centre.log10N);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={asymptoteY} x2={padL + cW} y2={asymptoteY} stroke="#334155" strokeWidth={1} strokeDasharray="2,3" />
      <line x1={padL} y1={thresholdY} x2={padL + cW} y2={thresholdY} stroke="#64748b" strokeWidth={1.25} strokeDasharray="5,3" />

      <line x1={startX} y1={padT} x2={startX} y2={padT + cH} stroke="#facc15" strokeWidth={1.25} strokeDasharray="3,3" />
      <line x1={pointX} y1={padT} x2={pointX} y2={padT + cH} stroke="#38bdf8" strokeWidth={1.25} strokeDasharray="3,3" />
      <line x1={centreX} y1={padT} x2={centreX} y2={padT + cH} stroke="#f472b6" strokeWidth={1.25} strokeDasharray="3,3" />

      <polyline points={startPath} fill="none" stroke="#facc15" strokeWidth={2} />
      <polyline points={pointPath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      <polyline points={centrePath} fill="none" stroke="#f472b6" strokeWidth={2} strokeDasharray="6,3" />

      {[10, 20, 30, 40, 50, 60, 70].map((t) => (
        <text key={`xt-${t}`} x={xAt(t)} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={8.5}>
          {t}
        </text>
      ))}
      {[0.3, 0.35, 0.4, 0.45, 0.5].map((y) => (
        <text key={`yt-${y}`} x={padL - 8} y={yAt(y) + 3} textAnchor="end" fill="#64748b" fontSize={8.5}>
          {y}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill="#64748b" fontSize={10}>
        log10(N)
      </text>

      <text x={padL + 6} y={padT + 12} fill="#facc15" fontSize={9.5}>
        START-anchored p_eff (leads pointwise)
      </text>
      <text x={padL + 6} y={padT + 24} fill="#38bdf8" fontSize={9.5}>
        pointwise p(N)
      </text>
      <text x={padL + 6} y={padT + 36} fill="#f472b6" fontSize={9.5}>
        CENTRE-anchored p_eff (collapses onto pointwise)
      </text>
      <text x={startX - 4} y={padT + cH - 6} fill="#facc15" fontSize={8.5} textAnchor="end">
        START ~{IMP34142_WITHIN_1PCT_CROSSINGS.start.log10N}
      </text>
      <text x={centreX + 4} y={padT + cH - 18} fill="#f472b6" fontSize={8.5}>
        CENTRE ~{IMP34142_WITHIN_1PCT_CROSSINGS.centre.log10N}
      </text>
      <text x={pointX + 4} y={padT + cH - 6} fill="#38bdf8" fontSize={8.5}>
        pointwise ~{IMP34142_WITHIN_1PCT_CROSSINGS.point.log10N}
      </text>
    </svg>
  );
}

export default function Imp34142WindowAnchorCentroidViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Window-Anchor Centroid Mechanism: START vs CENTRE (imp-34066)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34006 (F3) found that the fixed 12-decade OLS effective-exponent
        window, anchored at its START N, crosses the within-1% threshold
        (p &gt;= 0.495) roughly {IMP34142_LEADS_AND_RESIDUALS.startLeadOverPoint1pctDecades}
        {' '}decades BEFORE the pointwise estimator p(N) does, and explained the
        lead as the OLS reading the pointwise exponent near its window CENTRE.
        imp-34066 tested that directly by re-anchoring the same window at its
        CENTRE instead of its start: the chart below shows the START-anchored
        curve (yellow) running well ahead of pointwise p(N) (cyan), while the
        CENTRE-anchored curve (pink, dashed) sits almost exactly on top of
        pointwise -- the window-crossing vertical markers for pointwise and
        CENTRE are nearly indistinguishable, while START sits ~6 decades to
        the left.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        p(N) / p_eff^start(N) / p_eff^centre(N) vs log10(N), within-1% crossings marked
      </p>
      <CentroidChart />

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>The collapse, in numbers:</strong> at
        the within-1% crossing the START-anchored lead over pointwise is
        +{IMP34142_LEADS_AND_RESIDUALS.startLeadOverPoint1pctDecades} decades, while the
        CENTRE-anchored residual is only +{IMP34142_LEADS_AND_RESIDUALS.centreResidVsPoint1pctDecades}
        {' '}decades -- a {(IMP34142_LEADS_AND_RESIDUALS.collapseFraction1pct * 100).toFixed(1)}%
        collapse of the lead. One threshold deeper (within-0.1%, off this
        chart's domain at log10(N) ~ {IMP34142_WITHIN_0_1PCT_CROSSINGS_FROM_MODULE.point}),
        the START lead is +{IMP34142_LEADS_AND_RESIDUALS.startLeadOverPoint0_1pctDecades} decades
        but the CENTRE residual shrinks further to +{IMP34142_LEADS_AND_RESIDUALS.centreResidVsPoint0_1pctDecades}
        {' '}decades (a {(IMP34142_LEADS_AND_RESIDUALS.collapseFraction0_1pct * 100).toFixed(1)}% collapse) --
        the surviving residual is a sub-leading curvature term that shrinks
        deeper into the tail, not a fixed offset.
      </div>

      <div
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(148,163,184,0.04)',
          borderLeft: '3px solid #334155',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#64748b',
        }}
      >
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> measurement
        only, confirming that a fixed-span OLS window reads the pointwise
        exponent at its centroid rather than its start. The inherited
        imp-3220/imp-3406 component model is NOT a rigorous asymptotic;
        changes no bound; imp-3066 K_a&gt;=0 untouched; C_mb GUE-conditional
        per imp-486 untouched; NO QED; Platt-Trudgian Lambda&lt;=0.2 remains
        SOTA.
      </div>
    </div>
  );
}
