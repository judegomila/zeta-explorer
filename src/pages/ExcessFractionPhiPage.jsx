import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { IMP3106_EXCESS_FRACTION_INTEGRABILITY } from '../data/imp-3106-excess-fraction-integrability.js';

const D = IMP3106_EXCESS_FRACTION_INTEGRABILITY;
const S0 = Math.asinh(1);
const SQRT2 = Math.SQRT2;
const C_POLE = D.onsetDivergence.onsetConstant;
const K_TAIL = D.convergentTail.tailConstant;
const REG_MASS = D.convergentTail.regularMass;

function phiFn(s) {
  const F = Math.cosh(s) - SQRT2 - s + S0;
  const G = SQRT2 - S0 - Math.exp(-s);
  return G / F;
}
function onsetApprox(s) { return C_POLE / ((s - S0) * (s - S0)); }
function tailApprox(s) { return K_TAIL * Math.exp(-s); }

const S_END = 8.0;
const LOG_Y_MIN = -4.5;
const LOG_Y_MAX = 2.4;
const LOG_Y_RANGE = LOG_Y_MAX - LOG_Y_MIN;

function PhiChart() {
  const svgW = 560;
  const padL = 52;
  const padR = 22;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 290;
  const svgH = padT + cH + padB;

  const xS = (s) => padL + ((s - S0) / (S_END - S0)) * cW;
  const yLog = (v) => {
    if (v <= 0 || !isFinite(v)) return padT - 15;
    const ly = Math.log10(v);
    return padT + cH * (1 - (ly - LOG_Y_MIN) / LOG_Y_RANGE);
  };

  // Sample phi(s): log-spaced in (s-s0) so the steep onset is well-resolved
  const phiPts = [];
  for (let i = 0; i <= 180; i++) {
    const logDelta = -3.5 + i * (3.5 / 180);
    const delta = Math.pow(10, logDelta);
    const s = S0 + delta;
    if (s > S_END) break;
    const v = phiFn(s);
    if (v > 0 && isFinite(v)) phiPts.push({ s, v });
  }
  // Extra samples in [s0+1, 8]
  for (let i = 1; i <= 80; i++) {
    const s = S0 + 1 + i * (S_END - S0 - 1) / 80;
    const v = phiFn(s);
    if (v > 0 && isFinite(v)) phiPts.push({ s, v });
  }
  phiPts.sort((a, b) => a.s - b.s);
  const phiPath = phiPts
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.s).toFixed(1) + ',' + yLog(p.v).toFixed(1))
    .join(' ');

  // Onset pole approximation over [s0+delta, s0+1]
  const onsetPts = [];
  for (let i = 0; i <= 80; i++) {
    const logDelta = -3.5 + i * (3.5 / 80);
    const delta = Math.pow(10, logDelta);
    const s = S0 + delta;
    if (s > S0 + 1.02) break;
    const v = onsetApprox(s);
    if (v > 0 && isFinite(v)) onsetPts.push({ s, v });
  }
  const onsetPath = onsetPts
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.s).toFixed(1) + ',' + yLog(p.v).toFixed(1))
    .join(' ');

  // Tail approximation over [2, 8]
  const tailPts = [];
  for (let i = 0; i <= 60; i++) {
    const s = 2 + i * (S_END - 2) / 60;
    const v = tailApprox(s);
    if (v > 0 && isFinite(v)) tailPts.push({ s, v });
  }
  const tailPath = tailPts
    .map((p, i) => (i === 0 ? 'M' : 'L') + xS(p.s).toFixed(1) + ',' + yLog(p.v).toFixed(1))
    .join(' ');

  const xOnsetEnd = xS(S0 + 1);
  const xChartEnd = xS(S_END);
  const yGridVals = [-4, -3, -2, -1, 0, 1, 2];

  // X-axis ticks
  const xTicks = [
    { s: S0, label: 's₀' },
    { s: S0 + 1, label: 's₀+1' },
    { s: 3, label: '3' },
    { s: 5, label: '5' },
    { s: 7, label: '7' },
  ];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <defs>
        <clipPath id="phi3106-clip">
          <rect x={padL} y={padT} width={cW} height={cH} />
        </clipPath>
      </defs>

      {/* Chart background */}
      <rect x={padL} y={padT} width={cW} height={cH} fill="#0a0f1a" rx={2} />

      {/* Onset window shading [s0, s0+1] */}
      <rect x={padL} y={padT} width={xOnsetEnd - padL} height={cH}
        fill="rgba(239,68,68,0.10)" />

      {/* Regular + tail region shading [s0+1, 8] */}
      <rect x={xOnsetEnd} y={padT} width={xChartEnd - xOnsetEnd} height={cH}
        fill="rgba(16,185,129,0.05)" />

      {/* Y-axis gridlines */}
      {yGridVals.map(ly => {
        const y = padT + cH * (1 - (ly - LOG_Y_MIN) / LOG_Y_RANGE);
        if (y < padT - 2 || y > padT + cH + 2) return null;
        return (
          <g key={ly}>
            <line x1={padL} y1={y} x2={padL + cW} y2={y}
              stroke="#1e293b" strokeWidth={0.8} />
            <text x={padL - 4} y={y + 3.5} textAnchor="end" fill="#475569" fontSize={9}>
              {ly >= 0 ? '10^' + ly : '10^(' + ly + ')'}
            </text>
          </g>
        );
      })}

      {/* Vertical divider at s0+1 */}
      <line x1={xOnsetEnd} y1={padT} x2={xOnsetEnd} y2={padT + cH}
        stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />

      {/* Region labels inside chart */}
      <text x={padL + (xOnsetEnd - padL) / 2} y={padT + 14}
        textAnchor="middle" fill="#ef4444" fontSize={9} fontWeight="700">
        ONSET WINDOW
      </text>
      <text x={padL + (xOnsetEnd - padL) / 2} y={padT + 25}
        textAnchor="middle" fill="#f97316" fontSize={8.5}>
        [s₀, s₀+1]
      </text>
      <text x={xOnsetEnd + 8} y={padT + 14}
        fill="#10b981" fontSize={9} fontWeight="700">
        REGULAR + TAIL
      </text>
      <text x={xOnsetEnd + 8} y={padT + 25} fill="#10b981" fontSize={8.5}>
        mass = {REG_MASS.toFixed(4)} (finite)
      </text>

      {/* Onset pole approximation */}
      <path d={onsetPath} fill="none" stroke="#f97316" strokeWidth={1.7}
        strokeDasharray="6 3" clipPath="url(#phi3106-clip)" />

      {/* Tail approximation */}
      <path d={tailPath} fill="none" stroke="#22d3ee" strokeWidth={1.7}
        strokeDasharray="6 3" clipPath="url(#phi3106-clip)" />

      {/* Actual phi(s) curve */}
      <path d={phiPath} fill="none" stroke="#a78bfa" strokeWidth={2.2}
        clipPath="url(#phi3106-clip)" />

      {/* Divergence upward arrow at left edge of onset window */}
      <line x1={padL + 10} y1={padT + 44} x2={padL + 10} y2={padT + 6}
        stroke="#ef4444" strokeWidth={1.5} />
      <polygon
        points={
          (padL + 10 - 4) + ',' + (padT + 10) + ' ' +
          (padL + 10 + 4) + ',' + (padT + 10) + ' ' +
          (padL + 10) + ',' + (padT + 2)
        }
        fill="#ef4444"
      />
      <text x={padL + 17} y={padT + 42} fill="#ef4444" fontSize={9.5} fontWeight="700">
        DIVERGES as s→s₀+
      </text>

      {/* Chart border */}
      <rect x={padL} y={padT} width={cW} height={cH}
        fill="none" stroke="#334155" strokeWidth={1} />

      {/* Legend */}
      <g transform={'translate(' + (padL + cW - 168) + ',' + (padT + cH - 68) + ')'}>
        <rect x={0} y={0} width={162} height={62} fill="rgba(10,15,26,0.92)" rx={4}
          stroke="#334155" strokeWidth={0.8} />
        <line x1={8} y1={13} x2={24} y2={13} stroke="#a78bfa" strokeWidth={2.2} />
        <text x={30} y={17} fill="#a78bfa" fontSize={9.5}>
          φ(s) = G(s)/F(s)
        </text>
        <line x1={8} y1={28} x2={24} y2={28} stroke="#f97316" strokeWidth={1.7}
          strokeDasharray="5 3" />
        <text x={30} y={32} fill="#f97316" fontSize={9.5}>
          C/(s-s₀)^2  C={C_POLE.toFixed(5)}
        </text>
        <line x1={8} y1={43} x2={24} y2={43} stroke="#22d3ee" strokeWidth={1.7}
          strokeDasharray="5 3" />
        <text x={30} y={47} fill="#22d3ee" fontSize={9.5}>
          K e^(-s)  K={K_TAIL.toFixed(5)}
        </text>
        <text x={8} y={59} fill="#64748b" fontSize={8.5}>
          s₀ = arcsinh(1) ≈ {S0.toFixed(5)}
        </text>
      </g>

      {/* X-axis ticks and labels */}
      {xTicks.map(({ s, label }) => {
        const x = xS(s);
        return (
          <g key={s}>
            <line x1={x} y1={padT + cH} x2={x} y2={padT + cH + 5}
              stroke="#334155" strokeWidth={1} />
            <text x={x} y={padT + cH + 16} textAnchor="middle" fill="#64748b" fontSize={9.5}>
              {label}
            </text>
          </g>
        );
      })}
      <text x={padL + cW / 2} y={padT + cH + 33} textAnchor="middle"
        fill="#64748b" fontSize={10}>
        s = a · U  (product of shear weight and half-window)
      </text>

      {/* Y-axis label */}
      <text
        x={11}
        y={padT + cH / 2}
        textAnchor="middle"
        fill="#64748b"
        fontSize={10}
        transform={'rotate(-90,11,' + (padT + cH / 2) + ')'}
      >
        log₁₀(φ)
      </text>
    </svg>
  );
}

export default function ExcessFractionPhiPage() {
  const onsetRungs = D.onsetRungs;
  const tailRungs = D.tailRungs;
  const overrunFactor = Math.round(D.whereDivergenceDominates.onsetToRegularRatioAtFinestEps);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="φ(s) = G(s)/F(s): Onset Pole and Tail Decay (imp-3106)" />

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 680 }}>
        The imp-3064 excess fraction &phi;(s) = G(s)/F(s), where F = a&middot;D<sub>raw</sub> and G = a&middot;E,
        depends only on s = a&middot;U. It governs the area-weighted mean price of the forced even
        cosh-completion over the overflow range (s<sub>0</sub>, &infin;), s<sub>0</sub> = arcsinh(1)
        &asymp; {S0.toFixed(5)}.
        The integral DIVERGES at the onset (non-integrable inverse-square pole) but CONVERGES
        in the tail (exponential K e<sup>-s</sup> decay, finite regular mass).
      </p>

      <PhiChart />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
        <div style={{
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.22)',
          borderRadius: 6, padding: '0.9rem',
        }}>
          <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
            ONSET: NON-INTEGRABLE (DIVERGENT MEAN PRICE)
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
            As s &rarr; s<sub>0</sub>+, &phi; ~ C/(s&minus;s<sub>0</sub>)<sup>2</sup> with
            C = sqrt(2)&middot;(1&minus;arcsinh(1)) = {C_POLE.toFixed(5)}.
            The integral from s<sub>0</sub>+&epsilon; diverges as C/&epsilon; &rarr; +&infin;.
            The decade-growth factor is ~10&times; per decade (the 1/&epsilon; power law, not the
            1/&epsilon;<sup>2</sup> of the integrand itself), confirming the pole is exactly
            inverse-square.
          </p>
          <table style={{ width: '100%', marginTop: '0.6rem', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                {['eps', 'I(eps)', 'eps·I(eps)', 'ratio to C'].map(h => (
                  <th key={h} style={{ color: '#64748b', textAlign: 'right', paddingBottom: 3, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {onsetRungs.map(r => (
                <tr key={r.eps}>
                  <td style={{ color: '#94a3b8', textAlign: 'right', paddingRight: 6 }}>
                    1e{Math.round(Math.log10(r.eps))}
                  </td>
                  <td style={{ color: '#f97316', textAlign: 'right', paddingRight: 6 }}>
                    {r.mass.toFixed(1)}
                  </td>
                  <td style={{ color: '#fbbf24', textAlign: 'right', paddingRight: 6 }}>
                    {r.epsTimesMass.toFixed(5)}
                  </td>
                  <td style={{ color: '#a78bfa', textAlign: 'right' }}>
                    {r.ratioToPrincipal.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.22)',
          borderRadius: 6, padding: '0.9rem',
        }}>
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
            TAIL: CONVERGENT, REGULAR MASS = {REG_MASS.toFixed(4)}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
            As s &rarr; +&infin;, &phi; ~ K e<sup>&minus;s</sup> with
            K = 2&middot;(sqrt(2)&minus;arcsinh(1)) = {K_TAIL.toFixed(5)}.
            The regular mass &int;<sub>s<sub>0</sub>+1</sub><sup>&infin;</sup> &phi; ds = {REG_MASS.toFixed(4)} is a fixed finite number.
            At &epsilon;=10<sup>&minus;4</sup> the divergent onset mass overruns the regular mass
            by ~{overrunFactor.toLocaleString()}&times;.
          </p>
          <table style={{ width: '100%', marginTop: '0.6rem', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                {['S', 'tail mass', 'K·e^(-S)', 'ratio'].map(h => (
                  <th key={h} style={{ color: '#64748b', textAlign: 'right', paddingBottom: 3, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tailRungs.filter(r => r.S <= 10).map(r => (
                <tr key={r.S}>
                  <td style={{ color: '#94a3b8', textAlign: 'right', paddingRight: 6 }}>{r.S}</td>
                  <td style={{ color: '#22d3ee', textAlign: 'right', paddingRight: 6 }}>
                    {r.mass.toExponential(4)}
                  </td>
                  <td style={{ color: '#10b981', textAlign: 'right', paddingRight: 6 }}>
                    {r.predicted.toExponential(4)}
                  </td>
                  <td style={{ color: '#a78bfa', textAlign: 'right' }}>
                    {r.ratio.toFixed(5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem',
        background: 'rgba(148,163,184,0.04)', borderLeft: '3px solid #334155',
        borderRadius: '0 4px 4px 0', fontSize: '0.8rem', color: '#64748b',
      }}>
        <strong style={{ color: '#94a3b8' }}>Honest status:</strong> This is a{' '}
        <em>divergence characterisation</em> of the degree-0 scalar ratio, not a proof.
        The area-weighted mean price of the forced even cosh-completion has no finite value.
        The off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction
        and is untouched here. Platt-Trudgian &Lambda; &le; 0.2 remains the rigorous SOTA.
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
        <strong>Related:</strong>{' '}
        <Link to="/hidden-square-program" style={{ color: '#7c3aed' }}>
          Hidden-Square Program (&sect;25&ndash;27)
        </Link>,{' '}
        <Link to="/section26-conditioning-artifact" style={{ color: '#7c3aed' }}>
          Section-26 Conditioning Artifact
        </Link>
      </div>
    </div>
  );
}
