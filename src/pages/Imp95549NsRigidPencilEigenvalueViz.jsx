import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  NS_RIGID_PENCIL_EIGENVALUE_ROWS,
  NS_RIGID_PENCIL_EIGENVALUE_SUMMARY,
} from '../data/imp-95549-ns-rigid-pencil-eigenvalue-viz-data.js';

function NsRigidPencilEigenvalueChart() {
  const rows = NS_RIGID_PENCIL_EIGENVALUE_ROWS;
  const { lehmerCollisionEps } = NS_RIGID_PENCIL_EIGENVALUE_SUMMARY;
  const svgW = 760;
  const svgH = 400;
  const padL = 56;
  const padR = 24;
  const padT = 20;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  // x-axis: log10(eps), from -12 to 2
  const xMin = -12;
  const xMax = 2;
  const xOf = (eps) => padL + ((Math.log10(eps) - xMin) / (xMax - xMin)) * plotW;

  // y-axis: log10(lam), from -9 (below the smallest plotted lam) to -4
  const yMin = -9;
  const yMax = -4;
  const yOf = (lam) => padT + plotH - ((Math.log10(lam) - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [-12, -10, -8, -6, -4, -2, 0, 2];
  const yTicks = [-9, -8, -7, -6, -5, -4];

  const linePath = rows
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${xOf(r.eps)} ${yOf(r.lam)}`)
    .join(' ');

  const lehmerX = xOf(lehmerCollisionEps);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="#64748b" strokeWidth={1.5} />
      <line
        x1={padL}
        y1={padT + plotH}
        x2={padL + plotW}
        y2={padT + plotH}
        stroke="#64748b"
        strokeWidth={1.5}
      />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={padL - 4} y1={yOf(Math.pow(10, v))} x2={padL} y2={yOf(Math.pow(10, v))} stroke="#334155" strokeWidth={1} />
          <line
            x1={padL}
            y1={yOf(Math.pow(10, v))}
            x2={padL + plotW}
            y2={yOf(Math.pow(10, v))}
            stroke="#1e293b"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <text x={padL - 8} y={yOf(Math.pow(10, v)) + 3} textAnchor="end" fill="#64748b" fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={xOf(Math.pow(10, v))} y1={padT + plotH} x2={xOf(Math.pow(10, v))} y2={padT + plotH + 4} stroke="#334155" strokeWidth={1} />
          <text x={xOf(Math.pow(10, v))} y={padT + plotH + 16} textAnchor="middle" fill="#64748b" fontSize={8}>
            {`1e${v}`}
          </text>
        </g>
      ))}

      {/* Lehmer-pair collision threshold eps = 1.15e-11 */}
      <line
        x1={lehmerX}
        y1={padT}
        x2={lehmerX}
        y2={padT + plotH}
        stroke="#f87171"
        strokeWidth={1.75}
        strokeDasharray="6 3"
      />
      <text x={lehmerX + 4} y={padT + 10} fill="#f87171" fontSize={9}>
        eps = 1.15e-11 (Lehmer collision)
      </text>

      {/* lam_min(P_S(eps); G) curve */}
      <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth={2} />
      {rows.map((r, i) => (
        <circle key={`pt-${i}`} cx={xOf(r.eps)} cy={yOf(r.lam)} r={2} fill="#38bdf8" />
      ))}

      <text x={padL + plotW - 4} y={padT + 10} textAnchor="end" fill="#38bdf8" fontSize={9}>
        lam_min(P_S(eps); G), S = {'{'}1.5,2.5,4.5{'}'}
      </text>

      <text x={(padL + padL + plotW) / 2} y={svgH - 4} textAnchor="middle" fill="#94a3b8" fontSize={9}>
        eps (backward-flow time, log scale)
      </text>
      <text
        x={14}
        y={(padT + padT + plotH) / 2}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={9}
        transform={`rotate(-90 14 ${(padT + padT + plotH) / 2})`}
      >
        lam_min (log scale)
      </text>
    </svg>
  );
}

export default function Imp95549NsRigidPencilEigenvalueViz() {
  const s = NS_RIGID_PENCIL_EIGENVALUE_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="NS-RIGID Dichotomy: P_S(eps) Smallest Eigenvalue vs Backward-Flow eps" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'rgba(248,113,113,0.06)',
          borderLeft: '3px solid #f87171',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: '#94a3b8',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: '#f87171' }}>Honest status:</strong> a reader-facing chart of the
        imp-95530 THEOREM NS-RIGID (A4)(i) witness on one finite node set, not a new theorem. It
        changes no Lambda bound and establishes no operator positivity beyond what imp-95530
        already recorded. Platt&ndash;Trudgian &Lambda; &le; 0.2 remains state of the art. RH does
        not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The blue curve is the smallest generalized eigenvalue of the Caratheodory&ndash;Pick pencil
        P<sub>S</sub>(eps) against the Cauchy Gram G, for the backward-flowed function
        Xi<sub>eps</sub> = H<sub>&minus;eps</sub> on the node set S = {'{'}1.5, 2.5, 4.5{'}'}
        {' '}(nu = {'{'}1, 2, 4{'}'}). Under RH, P<sub>S</sub>(0) is strictly positive definite
        (THEOREM NS-RIGID A3); real-analyticity (A2) gives a PD-persistence window
        [0, eps<sub>0</sub>(S)) where the smallest eigenvalue stays positive. The dashed red line
        marks the unconditional Lehmer-pair collision threshold eps = 1.15e-11 (Saouter&ndash;
        Gourdon&ndash;Demichel), past which Xi<sub>eps</sub> is known to carry a non-real zero
        (Rodgers&ndash;Tao) for every eps &gt; 0.
      </p>

      <h3 style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        lam_min(P_S(eps); G) vs eps (log&ndash;log)
      </h3>
      <NsRigidPencilEigenvalueChart />

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
        <strong style={{ color: '#94a3b8' }}>Reading the chart:</strong> the curve stays strictly
        positive across the entire measured grid, from eps = 1e&minus;12 up to eps = 100 &mdash;
        {' '}{s.ordersOfMagnitudePastThreshold.toFixed(1)} orders of magnitude past the Lehmer
        collision threshold. So on this node set the PD-persistence window eps<sub>0</sub>(S) is
        (at least) far beyond the Lehmer threshold, which is exactly the THEOREM NS-RIGID A4(i)
        witness: "P<sub>S</sub> &ge; 0" survives the flow long after Xi<sub>eps</sub> is known to
        have acquired a non-real zero, so this finite-S positivity statement is flow-stable
        (soft) and cannot itself be the missing arithmetic input for RH &mdash; consistent with
        the dichotomy's corollary that only the full family over all finite S (equivalently RH
        itself) is flow-critical.
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> viz-only page recomputing
        flowedPickPencilMin from src/data/imp-95530-native-span-arithmetic-input-rigidity.js on a
        log-spaced eps grid and baking the result as literals
        (src/data/imp-95549-ns-rigid-pencil-eigenvalue-viz-data.js). Changes no bound, establishes
        no operator positivity, no RH claim; Platt&ndash;Trudgian &Lambda; &le; 0.2 remains SOTA.
        NO QED.
      </div>
    </div>
  );
}
