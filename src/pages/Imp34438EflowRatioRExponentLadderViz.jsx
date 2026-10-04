import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT } from '../data/imp-34349-eflow-ratio-r-exponent-limit.js';
import { ED } from '../styles/tokens.js';

// Align the analytic point-exponent (indexed by thr) with the measured local secant
// (indexed by the window's lower thr) on a shared -log10(thr) x-axis.
const { rLadder, localExponents } = IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT;
const POINT_SERIES = rLadder.map((row) => ({
  negLogThr: -Math.log10(row.thr),
  value: row.point_exponent,
}));
const MEASURED_SERIES = localExponents.map((row) => ({
  negLogThr: -Math.log10(Number(row.window.split('->')[1])),
  value: row.measured_r_exponent,
}));
const MIN_INDEX = MEASURED_SERIES.reduce(
  (best, row, i) => (row.value < MEASURED_SERIES[best].value ? i : best),
  0
);

// Point exponent e_pt(thr) = 2 - 4/logT0 rising toward 2, vs the measured local secant
// dipping to a shallow minimum then climbing back toward the same asymptote.
function RExponentLadderChart() {
  const svgW = 680;
  const svgH = 320;
  const padL = 46;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xMin = 0;
  const xMax = 4.1;
  const yMin = 1.75;
  const yMax = 2.05;
  const xAt = (v) => padL + ((v - xMin) / (xMax - xMin)) * cW;
  const yAt = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

  const pointPts = POINT_SERIES.map((row) => `${xAt(row.negLogThr)},${yAt(row.value)}`).join(' ');
  const measuredPts = MEASURED_SERIES.map((row) => `${xAt(row.negLogThr)},${yAt(row.value)}`).join(' ');
  const minRow = MEASURED_SERIES[MIN_INDEX];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke={ED.rule} strokeWidth={1.5} />

      {[1.75, 1.8, 1.85, 1.9, 1.95, 2].map((v) => (
        <g key={v}>
          <line x1={padL - 4} y1={yAt(v)} x2={padL + cW} y2={yAt(v)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yAt(v) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((v) => (
        <text key={'x' + v} x={xAt(v)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {v}
        </text>
      ))}

      {/* limiting exponent asymptote: r-exponent -> 2, approached from below, never reached */}
      <line
        x1={padL}
        y1={yAt(2)}
        x2={padL + cW}
        y2={yAt(2)}
        stroke={ED.brassDeco}
        strokeWidth={1.25}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yAt(2) - 5} textAnchor="end" fill={ED.brass} fontSize={9.5}>
        limiting exponent (r-exponent&nbsp;&rarr;&nbsp;2)
      </text>

      <polyline points={pointPts} fill="none" stroke={ED.series1} strokeWidth={2} />
      <polyline points={measuredPts} fill="none" stroke={ED.series7} strokeWidth={2} />

      {POINT_SERIES.map((row) => (
        <circle key={'p' + row.negLogThr} cx={xAt(row.negLogThr)} cy={yAt(row.value)} r={3} fill={ED.series1} />
      ))}
      {MEASURED_SERIES.map((row, i) => (
        <circle
          key={'m' + row.negLogThr}
          cx={xAt(row.negLogThr)}
          cy={yAt(row.value)}
          r={i === MIN_INDEX ? 5 : 3}
          fill={ED.series7}
        />
      ))}

      {/* the shallow minimum of the measured local secant */}
      <line
        x1={xAt(minRow.negLogThr)}
        y1={padT}
        x2={xAt(minRow.negLogThr)}
        y2={padT + cH}
        stroke={ED.series3}
        strokeWidth={1}
        strokeDasharray="2,3"
      />
      <text x={xAt(minRow.negLogThr)} y={padT - 6} textAnchor="middle" fill={ED.series3} fontSize={9.5}>
        shallow min&nbsp;{minRow.value.toFixed(4)}
      </text>

      <text
        x={12}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 12 ${padT + cH / 2})`}
      >
        r-exponent
      </text>
      <text x={padL + cW / 2} y={svgH - 6} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        &minus;log10(thr)
      </text>

      <g>
        <rect x={padL + 8} y={padT} width={10} height={10} fill={ED.series1} />
        <text x={padL + 22} y={padT + 9} fill={ED.inkSoft} fontSize={10}>
          analytic e_pt(thr) = 2 &minus; 4/logT0
        </text>
        <rect x={padL + 8} y={padT + 16} width={10} height={10} fill={ED.series7} />
        <text x={padL + 22} y={padT + 25} fill={ED.inkSoft} fontSize={10}>
          measured local d&nbsp;log&nbsp;r / d&nbsp;log&nbsp;thr
        </text>
      </g>
    </svg>
  );
}

export default function Imp34438EflowRatioRExponentLadderViz() {
  const { finding } = IMP34349_EFLOW_RATIO_R_EXPONENT_LIMIT;
  const minVal = MEASURED_SERIES[MIN_INDEX].value.toFixed(4);
  const lastMeasured = MEASURED_SERIES[MEASURED_SERIES.length - 1].value.toFixed(4);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Isolated E_flow-Ratio r-Exponent: Approach to 2 From Below (imp-34438 / imp-34349)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34248 factorised the crossover surplus and measured the isolated E_flow-ratio
        r(thr) log-log slope DROPPING below 2 across its ladder, down to a deep-tail OLS
        reading of ~1.917, without deriving whether it settles at a sub-2 limit or approaches
        2 itself. imp-34349 derived the point exponent e_pt(thr) = 2 &minus; 4/logT0 in closed form and
        extended the measured ladder to thr = 1e-4: the analytic curve rises monotonically
        toward 2, while the measured local secant dips to a shallow minimum ~{minVal} near
        thr ~ 0.005-0.01 and then climbs back toward 2 (reaching ~{lastMeasured} at thr = 1e-4),
        confirming the approach is from below rather than a settled sub-2 constant.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        analytic point-exponent vs measured local secant, both vs &minus;log10(thr): the shallow minimum and the asymptote at 2
      </p>
      <RExponentLadderChart />

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
            <th style={{ padding: '0.4rem 0.6rem' }}>window</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>measured r-exponent</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>point exponent at lower thr</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>gap &middot; logT0</th>
          </tr>
        </thead>
        <tbody>
          {localExponents.map((row) => (
            <tr key={row.window} style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{row.window}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.measured_r_exponent.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.point_exponent_at_lower_thr.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{row.gap_times_logT0.toFixed(3)}</td>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the minimum:</strong> {finding.M2_measured_non_monotone_climbs_back}
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> Derivation/measurement only within the
        inherited imp-34174/imp-33743 extrapolation component model, which is NOT a rigorous asymptotic. E_flow
        is the benign mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent
        C_Lip collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C
        1/8 ansatz (imp-2642/imp-2643) is untouched; imp-3066 K_a&ge;0 untouched; changes no bound; NO QED.
      </div>
    </div>
  );
}
