import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW } from '../data/imp-34607-deflow-second-order-identifiability-window.js';
import { ED } from '../styles/tokens.js';

const DATA = IMP34607_DEFLOW_SECOND_ORDER_IDENTIFIABILITY_WINDOW;
const { observedWindow: OBSERVED, sweepTable: SWEEP, requiredWindow: REQUIRED, secondaryWindow: SECONDARY, finding: FINDING } = DATA;

// Combined observed + sweep rows, sorted by span, for the VIF/condition-number curves.
const ROWS = [
  { spanLogN: OBSERVED.spanLogN, vif: OBSERVED.vif, condNumber: OBSERVED.condNumber, isObserved: true },
  ...SWEEP.map((r) => ({ spanLogN: r.spanLogN, vif: r.vif, condNumber: r.condNumber, isObserved: false })),
].sort((a, b) => a.spanLogN - b.spanLogN);

// VIF and condition number vs synthetic log N span, both on a shared log10-y axis, with the
// observed six-rung point and the VIF<10 / cond<100 identifiability floors marked.
function VifConditionChart() {
  const svgW = 640;
  const svgH = 340;
  const padL = 56;
  const padR = 24;
  const padT = 16;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const log10 = (v) => Math.log(v) / Math.LN10;
  const minX = 6;
  const maxX = 45;
  const minY = log10(8);
  const maxY = log10(6000);

  const xAt = (span) => padL + ((span - minX) / (maxX - minX)) * cW;
  const yAt = (v) => padT + cH - ((log10(v) - minY) / (maxY - minY)) * cH;

  const vifPoints = ROWS.map((r) => `${xAt(r.spanLogN)},${yAt(r.vif)}`).join(' ');
  const condPoints = ROWS.map((r) => `${xAt(r.spanLogN)},${yAt(r.condNumber)}`).join(' ');
  const xThreshold = xAt(REQUIRED.spanLogN);
  const yTicks = [10, 100, 1000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {yTicks.map((v) => (
        <line
          key={`grid-${v}`}
          x1={padL}
          y1={yAt(v)}
          x2={padL + cW}
          y2={yAt(v)}
          stroke={ED.ruleSoft}
          strokeWidth={1}
        />
      ))}
      <line
        x1={xThreshold}
        y1={padT}
        x2={xThreshold}
        y2={padT + cH}
        stroke={ED.series1}
        strokeWidth={1.25}
        strokeDasharray="4,3"
      />
      <text x={xThreshold + 4} y={padT + 12} fill={ED.series1} fontSize={9.5}>
        VIF&lt;10 floor: span~{REQUIRED.spanLogN.toFixed(1)} (N~{REQUIRED.Nlo.toFixed(0)})
      </text>
      <polyline points={condPoints} fill="none" stroke={ED.series5} strokeWidth={1.5} />
      <polyline points={vifPoints} fill="none" stroke={ED.series7} strokeWidth={1.75} />
      {ROWS.map((r, i) => (
        <circle
          key={`vif-${i}`}
          cx={xAt(r.spanLogN)}
          cy={yAt(r.vif)}
          r={r.isObserved ? 5.5 : 3.5}
          fill={r.isObserved ? ED.series2 : ED.series7}
          stroke={ED.paper}
          strokeWidth={0.75}
        />
      ))}
      {ROWS.map((r, i) => (
        <circle key={`cond-${i}`} cx={xAt(r.spanLogN)} cy={yAt(r.condNumber)} r={r.isObserved ? 5 : 3} fill={ED.series5} />
      ))}
      <text x={xAt(OBSERVED.spanLogN) + 6} y={yAt(OBSERVED.vif) - 8} fill={ED.series2} fontSize={9.5}>
        observed 6-rung window (VIF~{OBSERVED.vif.toFixed(0)})
      </text>
      {yTicks.map((v) => (
        <text key={`ytick-${v}`} x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}
      {[10, 20, 30, 40].map((x) => (
        <text key={`xtick-${x}`} x={xAt(x)} y={svgH - padB + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        synthetic log N span (high anchor fixed at kEnd=20)
      </text>
      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 16 ${padT + cH / 2})`}
      >
        log10(VIF / condition number)
      </text>
      <text x={padL + 4} y={padT + 12} fill={ED.series7} fontSize={9.5}>
        &#9679; VIF = 1/(1-r^2)
      </text>
      <text x={padL + 4} y={padT + 26} fill={ED.series5} fontSize={9.5}>
        &#9679; cond = (1+|r|)/(1-|r|)
      </text>
    </svg>
  );
}

export default function Imp34641DeflowIdentifiabilityWindowViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Deflow Second-Order Term: Identifiability Window (imp-34607)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34584 found the predictors u = 1/log(N) and u^2 in the deflow second-order refit
        p = pInf - c/log(N) + d/log^2(N) have Pearson correlation ~0.9995 over the six observed rungs, so
        the coefficient d is not identifiable. imp-34607 quantified how much wider a synthetic log N span
        would be needed to break that collinearity, as a pure design-matrix geometry property (holding the
        high anchor fixed at kEnd=20). The chart below plots the variance-inflation factor VIF and the
        correlation-matrix condition number against the extended span, marking the observed six-rung
        point (VIF~{OBSERVED.vif.toFixed(0)}) and the VIF&lt;10 identifiability floor
        (span~{REQUIRED.spanLogN.toFixed(1)}, N~{REQUIRED.Nlo.toFixed(0)}).
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        VIF and condition number vs synthetic log N span (log10-y axis)
      </p>
      <VifConditionChart />

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
        <strong style={{ color: 'var(--ink-soft)' }}>Finding:</strong> {FINDING.B_required_span_is_physically_inaccessible}{' '}
        A milder cond&lt;100 floor sits at span~{(20 - SECONDARY.kEndLo).toFixed(1)} log N
        (N~{SECONDARY.Nlo.toFixed(0)}), still far below the deep-N surrogate regime.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> measurement only, isRigorous false. The
        inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic E_flow slope
        is a surrogate property, not the true residual; changes no bound; establishes no operator
        positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&gt;=0 untouched; NO QED.
      </div>
    </div>
  );
}
