import React from 'react';
import PageHeader from '../components/PageHeader.jsx';

// Baked literals from the imp-35150 / imp-35190 / imp-35221 / imp-35235 data
// modules (src/data/imp-35150-r2-ladder-assessment.js,
// src/data/imp-35190-r2-n500-flow-reference.js,
// src/data/imp-35221-r2-n1000-flow-reference.js,
// src/data/imp-35235-r2-n2000-flow-reference.js). Reused verbatim; no new
// computation.
const RUNGS = [
  { N: 50, t_c_flow: 0.096, t_c_hi: 0.096, status: 'met', note: 'structural (gate == t_c_hi)' },
  { N: 100, t_c_flow: 0.0705, t_c_hi: 0.076, status: 'met', note: 'clean slack' },
  { N: 200, t_c_flow: 0.033, t_c_hi: 0.033, status: 'met', note: 'structural (gate == t_c_hi)' },
  { N: 500, t_c_flow: 0.012396301260, t_c_hi: 0.0124, status: 'met', note: 'worst-case cross-family/cross-grid' },
  { N: 1000, t_c_flow: 0.0033027720310, t_c_hi: 0.0034, status: 'met', note: 'last robustly-certified rung' },
  {
    N: 2000,
    t_c_flow: 0.0013238241280,
    t_c_hi: 0.0012,
    status: 'gate-skip',
    note: 'DP45 dt/2 gate-skip; 3-of-4 clean references land at 0.0011931054080 (slack 6.895e-6)',
    cleanMax: 0.0011931054080,
  },
].map((r) => ({ ...r, slack: r.t_c_hi - r.t_c_flow }));

function LadderChart() {
  const svgW = 700;
  const padL = 70;
  const padR = 24;
  const padT = 44;
  const padB = 48;
  const plotW = svgW - padL - padR;
  const plotH = 280;
  const svgH = padT + plotH + padB;

  // Log-x across N (50..2000), log-y across t_c (values span ~0.001 to 0.1).
  const xMin = Math.log10(40);
  const xMax = Math.log10(2400);
  const yMin = Math.log10(0.0009);
  const yMax = Math.log10(0.12);

  const xOf = (N) => padL + ((Math.log10(N) - xMin) / (xMax - xMin)) * plotW;
  const yOf = (v) => padT + plotH - ((Math.log10(v) - yMin) / (yMax - yMin)) * plotH;

  const flowPath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.t_c_flow)}`).join(' ');
  const hiPath = RUNGS.map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.N)} ${yOf(r.t_c_hi)}`).join(' ');

  const yTicks = [0.001, 0.003, 0.01, 0.03, 0.1];
  const xTicks = [50, 100, 200, 500, 1000, 2000];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 26} fill="#94a3b8" fontSize={11} fontWeight={700}>
        R2 one-sided true-flow bound: t_c_flow(N) vs t_c_hi(N) across the tested ladder
      </text>

      {hiPath && <path d={hiPath} fill="none" stroke="#f87171" strokeWidth={2} strokeDasharray="4 3" />}
      {flowPath && <path d={flowPath} fill="none" stroke="#a78bfa" strokeWidth={2.25} />}

      {RUNGS.map((r) => (
        <circle
          key={`flow-${r.N}`}
          cx={xOf(r.N)}
          cy={yOf(r.t_c_flow)}
          r={r.status === 'gate-skip' ? 5.5 : 4}
          fill={r.status === 'gate-skip' ? '#fb923c' : '#facc15'}
        />
      ))}
      {/* imp-35235 clean 3-of-4 max, shown as an open marker below the gate-skip point */}
      <circle cx={xOf(2000)} cy={yOf(RUNGS[5].cleanMax)} r={4} fill="none" stroke="#4ade80" strokeWidth={1.75} />
      <text x={xOf(2000) + 8} y={yOf(RUNGS[5].cleanMax) + 3} fill="#4ade80" fontSize={8.5}>
        clean 3-of-4 max
      </text>

      <text
        x={xOf(1000)}
        y={yOf(RUNGS[4].t_c_flow) - 12}
        textAnchor="middle"
        fill="#facc15"
        fontSize={9}
      >
        N=1000: last certified
      </text>
      <text
        x={xOf(2000)}
        y={yOf(RUNGS[5].t_c_flow) - 12}
        textAnchor="middle"
        fill="#fb923c"
        fontSize={9}
      >
        N=2000: gate-skip
      </text>

      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />

      {xTicks.map((N) => (
        <text key={N} x={xOf(N)} y={svgH - padB + 16} textAnchor="middle" fill="#64748b" fontSize={9}>
          {N}
        </text>
      ))}
      <text x={padL + plotW / 2} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize={9}>
        N (log scale)
      </text>

      {yTicks.map((v) => (
        <text key={v} x={padL - 6} y={yOf(v) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
          {v}
        </text>
      ))}

      <g>
        <line x1={padL + 4} y1={padT - 12} x2={padL + 24} y2={padT - 12} stroke="#a78bfa" strokeWidth={2.25} />
        <text x={padL + 30} y={padT - 8} fill="#a78bfa" fontSize={8.5}>
          t_c_flow (worst-case)
        </text>
        <line x1={padL + 150} y1={padT - 12} x2={padL + 170} y2={padT - 12} stroke="#f87171" strokeWidth={2} strokeDasharray="4 3" />
        <text x={padL + 176} y={padT - 8} fill="#f87171" fontSize={8.5}>
          t_c_hi (map bracket)
        </text>
      </g>
    </svg>
  );
}

export default function Imp35288R2FlowLadderSlackViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="R2 One-Sided True-Flow Ladder: t_c_flow vs t_c_hi Slack (imp-35288)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-35104 R2 requirement (t_c_flow(N) &le; t_c_hi(N), the one-sided map-to-flow bound
        from imp-2528) has been tested rung by rung across N = 50, 100, 200 (imp-35150), 500
        (imp-35190), 1000 (imp-35221), and 2000 (imp-35235). The worst-case order-robust flow
        collision stays below the imp-857 map-bracket upper endpoint through N = 1000. At N = 2000
        the DP45 dt/2 refinement steps through the collision singularity in one stage (a
        gate-skip), producing a spurious t_c = 1.3238e-3 that exceeds t_c_hi = 1.2e-3 &mdash; the
        three non-skipping references still land cleanly at t_c &asymp; 1.1925e-3&ndash;1.1931e-3.
      </p>

      <LadderChart />

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
          marginTop: '1.5rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>N</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c_flow (worst-case)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>t_c_hi (map bracket)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>slack</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>status</th>
          </tr>
        </thead>
        <tbody>
          {RUNGS.map((r) => (
            <tr key={r.N} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.N}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.t_c_flow.toExponential(6)}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.t_c_hi.toExponential(6)}</td>
              <td
                style={{
                  padding: '0.4rem 0.6rem',
                  fontFamily: 'monospace',
                  color: r.slack >= 0 ? '#4ade80' : '#f87171',
                }}
              >
                {r.slack.toExponential(3)}
              </td>
              <td style={{ padding: '0.4rem 0.6rem', color: r.status === 'gate-skip' ? '#fb923c' : '#4ade80' }}>
                {r.status === 'gate-skip' ? 'FAILS (gate-skip)' : 'MET'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '1rem' }}>
        The R2 ladder&apos;s largest robustly-certified rung is N = 1000 (worst-case slack{' '}
        {RUNGS[4].slack.toExponential(3)}). At N = 2000 the honest worst-case envelope fails
        (slack {RUNGS[5].slack.toExponential(3)}) purely because of the DP45 dt/2 gate-skip
        artifact; the clean 3-of-4 references clear t_c_hi with slack{' '}
        {(RUNGS[5].t_c_hi - RUNGS[5].cleanMax).toExponential(3)}, so N = 2000 is PROVISIONAL, not
        certified.
      </p>

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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-only page reusing the
        imp-35150/imp-35190/imp-35221/imp-35235 baked t_c literals verbatim (no new computation).
        Measurement/certification only; C_mb stays GUE-conditional (imp-486); changes no bound;
        establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian Lambda &le; 0.2
        remains SOTA.
      </div>
    </div>
  );
}
