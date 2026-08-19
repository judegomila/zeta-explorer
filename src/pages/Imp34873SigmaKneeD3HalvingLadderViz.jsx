import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR } from '../data/imp-34846-sigma-knee-third-order-closed-form-locator.js';

const D = IMP34846_SIGMA_KNEE_THIRD_ORDER_CLOSED_FORM_LOCATOR;
const RUNGS = D.scaling.table; // [{h, relResid}] descending h, quartering each halving
const RATIOS = D.scaling.halvingRatios;
const KNEE = D.landmarks.sigmaKneeClosed;
const SIGMA3 = D.landmarks.sigmaThirdDerivRoot;
const GAP_DEX = D.landmarks.kneeMinusSigmaThirdDerivDex;

// O(h^2) halving ladder: each rung quarters the pointwise closed-form-vs-FD residual as h halves
// (mean ratio ~4), plotted on a log10 scale so the ladder reads as evenly-stepped rungs.
function HalvingLadderChart() {
  const svgW = 680;
  const padL = 110;
  const padR = 90;
  const padT = 30;
  const padB = 44;
  const rowH = 44;
  const plotW = svgW - padL - padR;
  const svgH = padT + RUNGS.length * rowH + padB;

  const logs = RUNGS.map((r) => Math.log10(r.relResid));
  const scaleMin = Math.min(...logs) - 0.3;
  const scaleMax = Math.max(...logs) + 0.3;
  const xOf = (v) => ((Math.log10(v) - scaleMin) / (scaleMax - scaleMin)) * plotW;

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 10} fill="#94a3b8" fontSize={11} fontWeight={700}>
        Pointwise closed-form vs FD d3(ln sigma) residual at x={D.scaling.xFixed} &mdash; O(h&sup2;) halving ladder
      </text>
      {RUNGS.map((r, i) => {
        const y = padT + i * rowH;
        const barW = Math.max(xOf(r.relResid), 2);
        return (
          <g key={r.h}>
            <text x={padL - 10} y={y + rowH / 2 + 4} textAnchor="end" fill="#94a3b8" fontSize={11} fontFamily="monospace">
              h = {r.h.toExponential(0)}
            </text>
            <rect x={padL} y={y + 8} width={plotW} height={rowH - 20} fill="none" stroke="#334155" strokeWidth={1} />
            <rect x={padL} y={y + 8} width={barW} height={rowH - 20} fill="#38bdf8" opacity={0.85} />
            <text x={padL + barW + 8} y={y + rowH / 2 + 4} fill="#38bdf8" fontSize={11} fontFamily="monospace">
              {r.relResid.toExponential(2)}
            </text>
            {i + 1 < RUNGS.length && (
              <text x={padL + plotW + 6} y={y + rowH} textAnchor="start" fill="#fbbf24" fontSize={10}>
                &divide;{RATIOS[i].toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
      <text x={padL} y={padT + RUNGS.length * rowH + 20} fill="#64748b" fontSize={10}>
        mean halving ratio &asymp; {D.scaling.meanHalvingRatio.toFixed(2)} &mdash; clean O(h&sup2;) truncation, no h-independent floor above roundoff
      </text>
    </svg>
  );
}

// Two DISTINCT landmarks on the same log10 N axis: the g_thirdDeriv=0 sigma-KNEE (closed form, lands
// on the FD knee to ~6e-8) versus the sigma_thirdDeriv=0 root, ~1.21 dex below -- the wrong object.
function LandmarkSeparationChart() {
  const svgW = 680;
  const padL = 60;
  const padR = 60;
  const padT = 40;
  const padB = 40;
  const plotW = svgW - padL - padR;
  const svgH = padT + 80 + padB;
  const y = padT + 40;

  const lo = SIGMA3.log10Nstar - 0.5;
  const hi = KNEE.log10Nstar + 0.5;
  const xOf = (v) => padL + ((v - lo) / (hi - lo)) * plotW;

  const xSigma3 = xOf(SIGMA3.log10Nstar);
  const xKnee = xOf(KNEE.log10Nstar);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="#64748b" strokeWidth={1.5} />

      <line x1={xSigma3} y1={y - 14} x2={xSigma3} y2={y + 14} stroke="#f87171" strokeWidth={2} />
      <circle cx={xSigma3} cy={y} r={4} fill="#f87171" />
      <text x={xSigma3} y={y - 20} textAnchor="middle" fill="#f87171" fontSize={11} fontWeight={700}>
        sigma_thirdDeriv=0
      </text>
      <text x={xSigma3} y={y + 30} textAnchor="middle" fill="#f87171" fontSize={10} fontFamily="monospace">
        log10 N* &asymp; {SIGMA3.log10Nstar}
      </text>

      <line x1={xKnee} y1={y - 14} x2={xKnee} y2={y + 14} stroke="#4ade80" strokeWidth={2} />
      <circle cx={xKnee} cy={y} r={4} fill="#4ade80" />
      <text x={xKnee} y={y - 20} textAnchor="middle" fill="#4ade80" fontSize={11} fontWeight={700}>
        sigma-KNEE (g_thirdDeriv=0)
      </text>
      <text x={xKnee} y={y + 30} textAnchor="middle" fill="#4ade80" fontSize={10} fontFamily="monospace">
        log10 N* &asymp; {KNEE.log10Nstar}
      </text>

      <line x1={xSigma3} y1={y - 26} x2={xKnee} y2={y - 26} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 2" />
      <text x={(xSigma3 + xKnee) / 2} y={y - 32} textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={700}>
        {GAP_DEX} dex apart &mdash; DISTINCT landmarks
      </text>
    </svg>
  );
}

export default function Imp34873SigmaKneeD3HalvingLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="Sigma-Knee D3 Closed-Form Halving Ladder (imp-34873 / imp-34846)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-34846 derived a closed-form locator for the sigma-KNEE (the g_thirdDeriv&nbsp;=&nbsp;0 root,
        g&nbsp;=&nbsp;ln&nbsp;sigma) and measured that it matches the independent finite-difference
        third difference d3(ln&nbsp;sigma) pointwise to {D.pointwiseIdentity.maxRelResid.toExponential(1)}
        {' '}relative, with the residual quartering as h halves (mean ratio&nbsp;
        {D.scaling.meanHalvingRatio.toFixed(2)}) &mdash; the signature of exact algebra, not a fitted
        approximation. The closed-form root also lands on the FD knee to&nbsp;
        {D.landmarks.closedFormVsFiniteDifferenceKneeSep} in x, while the DIFFERENT object
        sigma_thirdDeriv&nbsp;=&nbsp;0 (the third derivative of sigma itself) roots at a distinct
        landmark {GAP_DEX} dex below.
      </p>

      <HalvingLadderChart />
      <div style={{ marginTop: '2rem' }}>
        <LandmarkSeparationChart />
      </div>

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
            <th style={{ padding: '0.4rem 0.6rem' }}>x</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>FD d3(ln sigma)</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>closed-form identity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>rel. residual</th>
          </tr>
        </thead>
        <tbody>
          {D.pointwiseIdentity.samples.map((r) => (
            <tr key={r.x} style={{ borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
              <td style={{ padding: '0.4rem 0.6rem' }}>{r.x}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.gThirdDerivFD}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.identityClosedForm}</td>
              <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{r.relResid}</td>
            </tr>
          ))}
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
        <strong style={{ color: '#94a3b8' }}>Status:</strong> Viz-only page rendering the
        imp-34846 scaling/pointwiseIdentity/landmarks literals verbatim (no new computation).
        Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT an RH
        bound. C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a&nbsp;&ge;&nbsp;0 untouched;
        far-tail exponent stays 1/2 (imp-3463); establishes no operator positivity; the
        E_flow-reinstatement sub-gap (imp-34796/imp-34820/imp-34837) is inherited UNCHANGED; no RH
        verdict, NO QED. Platt-Trudgian Lambda&nbsp;&le;&nbsp;0.2 remains SOTA.
      </div>
    </div>
  );
}
