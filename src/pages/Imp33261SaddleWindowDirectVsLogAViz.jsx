import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP33261_OVERLAP_TABLE,
  IMP33261_CONVERGENCE_TABLE,
  IMP33261_TAU_WINDOW_LO,
  IMP33261_TAU_WINDOW_HI,
  IMP33261_WORST_REL_DIFF,
  IMP33261_SUB_MICRO_LINE,
} from '../data/imp-33261-saddle-window-direct-vs-log-a-viz-data.js';
import { ED } from '../styles/tokens.js';

const REL_DIFF_COLOR = ED.series7;
const LADDER_COLOR = ED.series1;
const LINE_COLOR = ED.series4;

function RelDiffChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 48;
  const cW = svgW - padL - padR;
  const cH = 240;
  const svgH = padT + cH + padB;

  const yMin = Math.log10(1e-9);
  const yMax = Math.log10(1e-5);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const rows = IMP33261_OVERLAP_TABLE;
  const n = rows.length;
  const slot = cW / n;
  const barW = slot * 0.42;

  const yTicks = [1e-9, 1e-8, 1e-7, 1e-6, 1e-5];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toExponential(0)}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yS(IMP33261_SUB_MICRO_LINE)}
        x2={padL + cW}
        y2={yS(IMP33261_SUB_MICRO_LINE)}
        stroke={LINE_COLOR}
        strokeWidth={1.5}
        strokeDasharray="5,3"
      />
      <text x={padL + cW - 4} y={yS(IMP33261_SUB_MICRO_LINE) - 5} textAnchor="end" fill={LINE_COLOR} fontSize={9}>
        1e-6 sub-micro line
      </text>

      {rows.map((row, i) => {
        const cx = padL + slot * (i + 0.5);
        return (
          <g key={'row' + row.n}>
            <rect
              x={cx - barW / 2}
              y={yS(row.relDiff)}
              width={barW}
              height={padT + cH - yS(row.relDiff)}
              fill={REL_DIFF_COLOR}
              opacity={0.85}
            />
            <text x={cx} y={padT + cH + 16} textAnchor="middle" fill={ED.inkSoft} fontSize={10} fontWeight={600}>
              n={row.n}
            </text>
            <text x={cx} y={padT + cH + 29} textAnchor="middle" fill={ED.inkFaint} fontSize={8.5}>
              {'τ*=' + row.tauStar.toFixed(3)}
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        |A_direct - A_log| / A_direct (log scale)
      </text>
    </svg>
  );
}

function ConvergenceLadderChart() {
  const svgW = 700;
  const padL = 60;
  const padR = 24;
  const padT = 24;
  const padB = 40;
  const cW = svgW - padL - padR;
  const cH = 220;
  const svgH = padT + cH + padB;

  const xMin = Math.log10(1000);
  const xMax = Math.log10(24000);
  const yMin = Math.log10(1e-8);
  const yMax = Math.log10(3e-3);
  const xS = (v) => padL + cW * (Math.log10(v) - xMin) / (xMax - xMin);
  const yS = (v) => padT + cH * (1 - (Math.log10(v) - yMin) / (yMax - yMin));

  const rows = IMP33261_CONVERGENCE_TABLE;
  const path = rows.map((r, i) => (i === 0 ? 'M' : 'L') + xS(r.innerN) + ',' + yS(r.relToLog)).join(' ');

  const xTicks = [1200, 2400, 4800, 9600, 19200];
  const yTicks = [1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((t) => (
        <g key={'yt' + t}>
          <line x1={padL} y1={yS(t)} x2={padL + cW} y2={yS(t)} stroke={ED.ruleSoft} strokeWidth={1} />
          <text x={padL - 8} y={yS(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {t.toExponential(0)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={'xt' + t} x={xS(t)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
          {t.toLocaleString()}
        </text>
      ))}

      <path d={path} fill="none" stroke={LADDER_COLOR} strokeWidth={2} />
      {rows.map((r) => (
        <circle key={'pt' + r.innerN} cx={xS(r.innerN)} cy={yS(r.relToLog)} r={4} fill={LADDER_COLOR} />
      ))}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      <text
        x={16}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={'rotate(-90,16,' + (padT + cH / 2) + ')'}
      >
        |A_direct - A_log| / A_log (log)
      </text>
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        inner Simpson N (log scale) at n=80, {'τ*=0.5933'}
      </text>
    </svg>
  );
}

function OverlapTable() {
  const th = { textAlign: 'right', padding: '0.35rem 0.6rem', color: ED.inkSoft, fontWeight: 600, borderBottom: '1px solid var(--rule)' };
  const td = { textAlign: 'right', padding: '0.3rem 0.6rem', color: ED.ink, fontVariantNumeric: 'tabular-nums' };
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', width: '100%', maxWidth: 760 }}>
      <thead>
        <tr>
          <th style={{ ...th, textAlign: 'left' }}>n</th>
          <th style={th}>{'τ*(n)'}</th>
          <th style={th}>A_direct</th>
          <th style={th}>A_log</th>
          <th style={th}>relative diff</th>
        </tr>
      </thead>
      <tbody>
        {IMP33261_OVERLAP_TABLE.map((row) => (
          <tr key={row.n}>
            <td style={{ ...td, textAlign: 'left', color: 'var(--ink-soft)' }}>{row.n}</td>
            <td style={td}>{row.tauStar.toFixed(4)}</td>
            <td style={td}>{row.aDirect.toExponential(4)}</td>
            <td style={td}>{row.aLog.toExponential(4)}</td>
            <td style={td}>{row.relDiff.toExponential(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ConvergenceTable() {
  const th = { textAlign: 'right', padding: '0.35rem 0.6rem', color: ED.inkSoft, fontWeight: 600, borderBottom: '1px solid var(--rule)' };
  const td = { textAlign: 'right', padding: '0.3rem 0.6rem', color: ED.ink, fontVariantNumeric: 'tabular-nums' };
  return (
    <table style={{ borderCollapse: 'collapse', fontSize: '0.78rem', width: '100%', maxWidth: 520 }}>
      <thead>
        <tr>
          <th style={{ ...th, textAlign: 'left' }}>inner N</th>
          <th style={th}>|A_direct - A_log| / A_log</th>
          <th style={th}>ratio vs previous</th>
        </tr>
      </thead>
      <tbody>
        {IMP33261_CONVERGENCE_TABLE.map((row) => (
          <tr key={row.innerN}>
            <td style={{ ...td, textAlign: 'left', color: 'var(--ink-soft)' }}>{row.innerN.toLocaleString()}</td>
            <td style={td}>{row.relToLog.toExponential(2)}</td>
            <td style={td}>{row.ratioVsPrev === null ? '—' : '~' + row.ratioVsPrev.toFixed(1) + 'x'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Imp33261SaddleWindowDirectVsLogAViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Saddle-Window Direct-vs-Log A(tau) Convergence (imp-33234/imp-33261)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 720 }}>
        imp-33213 could cross-tabulate the imp-3893 direct Phi(s)Phi(s+tau) autocorrelation kernel against the
        imp-3850 log-domain graded-GL A(tau) only at tau in {'{1.5,2,2.5,3}'}, because the direct double-precision
        kernel underflows to exactly 0 once pi&middot;e^(4u) exceeds ~709 (tau &gt; ~1.37). imp-33234 filled the gap
        the moments actually sample: the saddle-support window tau*(n) in [{IMP33261_TAU_WINDOW_LO.toFixed(4)},{' '}
        {IMP33261_TAU_WINDOW_HI.toFixed(4)}] for n=10..80 (root of n = 4&pi;&middot;tau*&middot;e^(4&middot;tau*)),
        where BOTH machineries are representable.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        per-rung relative difference |A_direct - A_log| / A_direct across tau*(10..80)
      </p>
      <RelDiffChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        overlap table
      </p>
      <OverlapTable />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.5rem 0 0.5rem' }}>
        n=80 direct-Simpson O(h^4) convergence to the log-domain value (log-log)
      </p>
      <ConvergenceLadderChart />
      <div style={{ marginTop: '0.75rem' }}>
        <ConvergenceTable />
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the charts:</strong> every rung n=10..80 sits below the
        1e-6 sub-micro line, worst at n=80 ({IMP33261_WORST_REL_DIFF.toExponential(2)}, A~1.3e-15) and tightening to
        ~2.5e-9 at n=10. The n=80 ladder shows the residual falling ~15.3x, ~15.8x, ~16.0x, ~16.0x per inner-N
        doubling (1200&#8594;19200) &#8212; the textbook Simpson O(h^4) signature &#8212; so the gap is finite DIRECT-Simpson
        quadrature resolution, not a kernel mismatch, and it converges to the SAME A(tau) the log-domain
        machinery computes.
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only; measures nothing new
        beyond what imp-33234 already established. Cross-validation/consistency only, RH-equivalent,
        necessary-but-not-sufficient. Operator positivity (imp-3066 off-diagonal endpoint-Hankel K_a &ge; 0) is
        UNTOUCHED. NO QED; imp-33234 assertions left
        intact.
      </div>
    </div>
  );
}
