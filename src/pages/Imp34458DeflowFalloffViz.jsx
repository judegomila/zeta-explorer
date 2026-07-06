import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP34458_POLE_APPROACH_TABLE,
  IMP34458_CROSSING,
  IMP34458_SUMMARY,
} from '../data/imp-34458-deflow-falloff-viz-data.js';

// Log-scale line chart: |deflow(kEnd(thr))| falling off ~76000x as the balance point approaches
// the pole k* -- the E_flow additive contribution to the residual.
function DeflowFalloffLog() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34458_POLE_APPROACH_TABLE;
  const xMin = 15.5;
  const xMax = 21.5;
  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;

  // log10(|contrib|) axis: from ~1e-9 down to ~1e-14
  const logMin = -14;
  const logMax = -9;
  const yAt = (v) => padT + ((Math.log10(Math.abs(v)) - logMax) / (logMin - logMax)) * cH;

  const yTicks = [-9, -10, -11, -12, -13, -14];
  const kStar = IMP34458_CROSSING.kStar;

  const points = rows.map((r) => `${xAt(r.kEnd)},${yAt(r.eflowContribToResid)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(Math.pow(10, v))} x2={padL + cW} y2={yAt(Math.pow(10, v))} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(Math.pow(10, v)) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {`1e${v}`}
          </text>
        </g>
      ))}

      <line
        x1={xAt(kStar)}
        y1={padT}
        x2={xAt(kStar)}
        y2={padT + cH}
        stroke="#f472b6"
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={xAt(kStar) - 4} y={padT + 10} textAnchor="end" fill="#f472b6" fontSize={9.5}>
        k* &asymp; {kStar}
      </text>

      <polyline points={points} fill="none" stroke="#38bdf8" strokeWidth={2} />

      {rows.map((r) => (
        <circle
          key={r.thr}
          cx={xAt(r.kEnd)}
          cy={yAt(r.eflowContribToResid)}
          r={3.5}
          fill="#38bdf8"
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}

      <text x={padL + cW / 2} y={padT + cH + 38} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
        kEnd(thr) &mdash; balance point approaching the pole
      </text>
    </svg>
  );
}

// Log-scale line chart: the E_flow root-shift share of the imp-34211 gap, strictly decreasing
// toward the crossing floor (pink dashed line), which reproduces imp-34285's ~2.2e-7.
function ShareFalloffLog() {
  const svgW = 640;
  const svgH = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 50;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const rows = IMP34458_POLE_APPROACH_TABLE;
  const xMin = 15.5;
  const xMax = 21.5;
  const xAt = (k) => padL + ((k - xMin) / (xMax - xMin)) * cW;

  const logMin = -7;
  const logMax = -4;
  const yAt = (v) => padT + ((Math.log10(Math.abs(v)) - logMax) / (logMin - logMax)) * cH;

  const yTicks = [-4, -5, -6, -7];
  const kStar = IMP34458_CROSSING.kStar;
  const crossingShare = IMP34458_CROSSING.crossingShare;

  const points = rows.map((r) => `${xAt(r.kEnd)},${yAt(r.eflowShareOfGap)}`).join(' ');

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />
      <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#334155" strokeWidth={1.5} />

      {yTicks.map((v) => (
        <g key={'y' + v}>
          <line x1={padL - 4} y1={yAt(Math.pow(10, v))} x2={padL + cW} y2={yAt(Math.pow(10, v))} stroke="#1e293b" strokeWidth={1} />
          <text x={padL - 8} y={yAt(Math.pow(10, v)) + 3} textAnchor="end" fill="#64748b" fontSize={9}>
            {`1e${v}`}
          </text>
        </g>
      ))}

      <line
        x1={padL}
        y1={yAt(crossingShare)}
        x2={padL + cW}
        y2={yAt(crossingShare)}
        stroke="#f472b6"
        strokeWidth={1.25}
        strokeDasharray="5,4"
      />
      <text x={padL + 6} y={yAt(crossingShare) - 6} fill="#f472b6" fontSize={9.5}>
        crossing floor &asymp; {crossingShare.toExponential(2)} (reproduces imp-34285)
      </text>

      <line
        x1={xAt(kStar)}
        y1={padT}
        x2={xAt(kStar)}
        y2={padT + cH}
        stroke="#f472b6"
        strokeWidth={1}
        strokeDasharray="2,3"
        opacity={0.6}
      />

      <polyline points={points} fill="none" stroke="#34d399" strokeWidth={2} />

      {rows.map((r) => (
        <circle
          key={r.thr}
          cx={xAt(r.kEnd)}
          cy={yAt(r.eflowShareOfGap)}
          r={3.5}
          fill="#34d399"
          stroke="#0a0f1a"
          strokeWidth={0.75}
        />
      ))}

      <text x={padL + cW / 2} y={padT + cH + 38} textAnchor="middle" fill="#cbd5e1" fontSize={9.5}>
        kEnd(thr) &mdash; balance point approaching the pole
      </text>
    </svg>
  );
}

export default function Imp34458DeflowFalloffViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="deflow(k) Monotone Falloff Toward the Pole (imp-34373)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34373 pushed the M2-residual balance point toward the imp-34169 resid_exp pole
        k*&asymp;{IMP34458_CROSSING.kStar} via a threshold family resid(kEnd)=thr, thr&rarr;0+, and
        recomputed at each step both deflow(kEnd)=resid_full&minus;resid_noflow (the E_flow additive
        contribution to the residual) and its share of the imp-34211 kEnd gap. Both fall off
        monotonically toward the pole &mdash; the crossing value is the MINIMUM of the family, not
        a maximum, so the "E_flow negligible" assumption STRENGTHENS rather than degrades near k*.
      </p>

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        deflow(kEnd(thr)) &mdash; the E_flow additive contribution to the residual, falling off
        &asymp;{(IMP34458_SUMMARY.farContrib / IMP34458_SUMMARY.nearContrib).toExponential(1)}x
        across the sweep (log scale)
      </p>
      <DeflowFalloffLog />

      <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.82rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        E_flow root-shift share of the imp-34211 gap, shrinking
        &asymp;{IMP34458_SUMMARY.farOverNearShareRatio.toFixed(1)}x toward the crossing floor
        (log scale)
      </p>
      <ShareFalloffLog />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '0.4rem 0.5rem' }}>thr</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>kEnd(thr)</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>dist to k*</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>E_flow share of gap</th>
            <th style={{ padding: '0.4rem 0.5rem' }}>deflow(kEnd)</th>
          </tr>
        </thead>
        <tbody>
          {IMP34458_POLE_APPROACH_TABLE.map((r) => (
            <tr key={r.thr} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.thr.toExponential(0)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.kEnd.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.distToPole.toFixed(4)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.eflowShareOfGap.toExponential(3)}</td>
              <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{r.eflowContribToResid.toExponential(3)}</td>
            </tr>
          ))}
          <tr style={{ color: '#f472b6' }}>
            <td style={{ padding: '0.4rem 0.5rem' }}>0 (crossing)</td>
            <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{IMP34458_CROSSING.kStar}</td>
            <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>0</td>
            <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>{IMP34458_CROSSING.crossingShare.toExponential(3)}</td>
            <td style={{ padding: '0.4rem 0.5rem', fontFamily: 'monospace' }}>0 (by construction)</td>
          </tr>
        </tbody>
      </table>

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
        <strong style={{ color: '#94a3b8' }}>Summary:</strong> both deflow(k) and its share of the
        imp-34211 gap fall off monotonically as the balance point kEnd(thr) approaches the pole
        k*, bottoming at the &asymp;{IMP34458_CROSSING.crossingShare.toExponential(2)} crossing
        floor (which reproduces imp-34285). The pole sits at very large N (&asymp;10^21.28), and
        E_flow=C_F&middot;log(T0)/T0&middot;Gronwall decays with N, so this additive contribution
        to the residual shrinks &mdash; the E_flow-negligible-for-the-root assumption is at its
        STRONGEST exactly at the pole, not degraded there.
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
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> Viz-data only, baked literals
        reproducing the imp-34373 measurement; no new derivation, no bound changed. Component
        model is the inherited surrogate diagnostic, NOT a rigorous asymptotic; C_mb GUE-conditional
        per imp-486 UNTOUCHED; imp-3066 K_a&ge;0 untouched; NO QED; Platt-Trudgian Lambda&le;0.2
        remains the SOTA unconditional bound.
      </div>
    </div>
  );
}
