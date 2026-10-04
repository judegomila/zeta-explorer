import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP96059_NDET_RANGE_BY_ZERO,
  IMP96059_RESOLVED_FIRST_40,
  IMP96059_A,
  IMP96059_NMAX,
  IMP96059_LAW,
  IMP96059_REACH,
} from '../data/imp-96059-detector-reach-ladder-viz-data.js';
import { IMP96149_DETECTOR_FIT, IMP96149_EXTRAPOLATION } from '../data/imp-96149-route-l-detector-reach-law-fit.js';
import { IMP96287_REACH_BAND } from '../data/imp-96287-route-l-reach-band-reconciliation.js';
import { IMP96273_MEASURED_LOWER_BOUND } from '../data/imp-96273-detector-zero40-extrapolation.js';
import { IMP96347_CURVATURE_CORRECTION } from '../data/imp-96347-detector-reach-curvature-correction.js';
import { ED } from '../styles/tokens.js';

const BAR_COLOR = ED.series1;
const UNDETECTED_COLOR = ED.series2;
const RESOLVED_COLOR = ED.series3;

function DetectorReachChart() {
  const svgW = 680;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 46;
  const cW = svgW - padL - padR;
  const cH = 300;
  const svgH = padT + cH + padB;

  const xMin = 0;
  const xMax = 130;
  const yMin = 5;
  const yMax = 500;

  const xS = (gamma) => padL + ((gamma - xMin) / (xMax - xMin)) * cW;
  const yS = (n) => padT + cH * (1 - (Math.log(n) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin)));

  const yTicks = [10, 20, 50, 100, 200, 400];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <rect x={padL} y={padT} width={cW} height={cH} fill={ED.paper} rx={2} />

      {yTicks.map((v) => (
        <g key={v}>
          <line x1={padL} y1={yS(v)} x2={padL + cW} y2={yS(v)} stroke={ED.ruleSoft} strokeWidth={0.7} />
          <text x={padL - 6} y={yS(v) + 3.5} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
            {v}
          </text>
        </g>
      ))}

      {/* NMAX = 400 horizontal reference (the height of the detector run) */}
      <line x1={padL} y1={yS(IMP96059_NMAX)} x2={padL + cW} y2={yS(IMP96059_NMAX)} stroke={ED.rule} strokeWidth={1} strokeDasharray="2,2" />
      <text x={padL + cW - 4} y={yS(IMP96059_NMAX) - 6} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        NMAX = {IMP96059_NMAX}
      </text>

      {IMP96059_NDET_RANGE_BY_ZERO.map((z) => {
        const x = xS(z.gamma0);
        if (z.detected) {
          const yTop = yS(z.nDetMax);
          const yBot = yS(z.nDetMin);
          return (
            <g key={z.k}>
              <line x1={x} y1={yTop} x2={x} y2={yBot} stroke={BAR_COLOR} strokeWidth={3} />
              <circle cx={x} cy={yTop} r={3} fill={BAR_COLOR} />
              <circle cx={x} cy={yBot} r={3} fill={BAR_COLOR} />
              <text x={x} y={yBot + 13} textAnchor="middle" fill={ED.inkSoft} fontSize={9}>
                k={z.k}
              </text>
            </g>
          );
        }
        // k = 40: undetected through N = 400 -- draw an upward-open arrow from N = 400.
        const yTop = yS(IMP96059_NMAX);
        return (
          <g key={z.k}>
            <line x1={x} y1={yTop} x2={x} y2={padT + 8} stroke={UNDETECTED_COLOR} strokeWidth={2} strokeDasharray="4,3" />
            <path d={`M ${x - 4},${padT + 14} L ${x},${padT + 4} L ${x + 4},${padT + 14} Z`} fill={UNDETECTED_COLOR} />
            <text x={x} y={yTop + 13} textAnchor="middle" fill={UNDETECTED_COLOR} fontSize={9}>
              k={z.k} undetected
            </text>
          </g>
        );
      })}

      <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke={ED.rule} strokeWidth={1} />

      {[0, 20, 40, 60, 80, 100, 120].map((g) => (
        <g key={'x' + g}>
          <line x1={xS(g)} y1={padT + cH} x2={xS(g)} y2={padT + cH + 5} stroke={ED.rule} strokeWidth={1} />
          <text x={xS(g)} y={padT + cH + 17} textAnchor="middle" fill={ED.inkFaint} fontSize={9}>
            {g}
          </text>
        </g>
      ))}
      <text x={padL + cW / 2} y={padT + cH + 36} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        zero height gamma_0
      </text>
      <text x={14} y={padT + cH / 2} textAnchor="middle" fill={ED.inkFaint} fontSize={10} transform={`rotate(-90,14,${padT + cH / 2})`}>
        N_det (log scale)
      </text>
    </svg>
  );
}

function DetectorRangeTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>zero k</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>gamma_0</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>N_det range (delta = 0.4 .. 0.025)</th>
        </tr>
      </thead>
      <tbody>
        {IMP96059_NDET_RANGE_BY_ZERO.map((z) => (
          <tr key={z.k} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{z.k}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{z.gamma0}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: z.detected ? BAR_COLOR : UNDETECTED_COLOR }}>
              {z.detected ? `${z.nDetMin} - ${z.nDetMax}` : `undetected by N = ${IMP96059_NMAX}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ResolvedCountTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>CMV order N</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>resolved (of first 40)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>resolved / N</th>
        </tr>
      </thead>
      <tbody>
        {IMP96059_RESOLVED_FIRST_40.map(([n, resolved]) => (
          <tr key={n} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>{n}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: RESOLVED_COLOR }}>{resolved}</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{(resolved / n).toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PowerLawComparisonTable() {
  const { A, b } = IMP96149_DETECTOR_FIT;
  const { a0, a1, a2 } = IMP96347_CURVATURE_CORRECTION;
  const quadPredicted = (gamma0) => {
    const L = Math.log(gamma0);
    return Math.exp(a0 + a1 * L + a2 * L * L);
  };
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--rule)' }}>
          <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>zero k</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>gamma_0</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>measured N_det range</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>power-law N_det = {A} * gamma_0^{b}</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>quadratic-in-log N_det (imp-96347)</th>
          <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>in range?</th>
        </tr>
      </thead>
      <tbody>
        {IMP96059_NDET_RANGE_BY_ZERO.map((z) => {
          const predicted = A * Math.pow(z.gamma0, b);
          const quadPred = quadPredicted(z.gamma0);
          const inRange = z.detected && predicted >= z.nDetMin && predicted <= z.nDetMax;
          return (
            <tr key={z.k} style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <td style={{ padding: '0.35rem 0.5rem' }}>{z.k}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{z.gamma0}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: z.detected ? BAR_COLOR : UNDETECTED_COLOR }}>
                {z.detected ? `${z.nDetMin} - ${z.nDetMax}` : `undetected, >= ${IMP96059_NMAX}`}
              </td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{predicted.toFixed(1)}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>{quadPred.toFixed(1)}</td>
              <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: z.detected ? (inRange ? RESOLVED_COLOR : UNDETECTED_COLOR) : UNDETECTED_COLOR }}>
                {z.detected ? (inRange ? 'yes' : 'no') : 'both below floor'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Imp96059DetectorReachLadderViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 940, margin: '0 auto' }}>
      <PageHeader title="Route L CMV Detector Reach Law (imp-96059)" />

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 760 }}>
        The Route L a = {IMP96059_A} CMV truncation is probed with a displaced off-line quadruple
        1/2 &plusmn; delta &plusmn; i*gamma_0 spliced into the exact Herglotz moments in place of a
        true on-line pair. N_det is the first Levinson order at which the finite Toeplitz form goes
        indefinite (detects the displacement). Below, each zero&apos;s N_det range spans delta =
        0.4 down to 0.025 (nearly delta-independent): zero 1 (gamma_0 = 14.13) detected at N = 9-14,
        zero 20 (gamma_0 = 77.14) at N = 96-115, zero 40 (gamma_0 = 122.95) still UNDETECTED at the
        run ceiling N = {IMP96059_NMAX}.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        N_det vs zero height gamma_0, range bars over delta = 0.4 .. 0.025
      </p>
      <DetectorReachChart />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Per-zero detection range (verbatim from ROUTE_L.detector.rows)
      </p>
      <DetectorRangeTable />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Measured N_det range vs the imp-96149 canonical (delta = 0.1) power-law fit N_det = A *
        gamma_0^b, alongside the imp-96347 quadratic-in-log-gamma curvature correction. At zero 40
        (gamma_0 = 122.95) the curvature correction lifts the reach estimate from 165.6 (power law)
        to 278.4 (quadratic) -- still below the measured floor N_det &gt;= 400, halving but not
        closing the shortfall.
      </p>
      <PowerLawComparisonTable />

      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', margin: '0.5rem 0 0' }}>
        Honest status (imp-96273): this power law under-predicts the first-detection order for
        zero {IMP96273_MEASURED_LOWER_BOUND.zeroIndex} -- it forecasts N_det ~ 144-166 but the zero
        is measured UNDETECTED through N = {IMP96273_MEASURED_LOWER_BOUND.nDetLowerBound} (&ge;
        {IMP96273_MEASURED_LOWER_BOUND.pointOverMeasuredRatio.toFixed(2)}x the point estimate).
        The reach law is super-power at this height; the verified-zero route stays cheaper.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        The linear-in-N reach: resolved count among the first 40 zeros vs CMV order N
        (ROUTE_L.a20.resolvedFirst40)
      </p>
      <ResolvedCountTable />

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', margin: '1.75rem 0 0.5rem' }}>
        Extrapolated N needed at the Platt-Trudgian height T0 = {IMP96149_EXTRAPOLATION.T0.toExponential(4)}
        (imp-96149 power-law point estimate) alongside the imp-96287 covariance-propagated
        statistical reach band
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--rule)' }}>
            <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>estimate</th>
            <th style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>N range</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>point extrapolation (detector power law)</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem', color: BAR_COLOR }}>
              {IMP96149_EXTRAPOLATION.nNeeded.detectorPowerLaw.toExponential(4)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>1-sigma covariance-propagated band</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>
              [{IMP96287_REACH_BAND.band1sigma.detector.lo.toExponential(2)}, {IMP96287_REACH_BAND.band1sigma.detector.hi.toExponential(2)}]
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)' }}>
            <td style={{ padding: '0.35rem 0.5rem' }}>95% covariance-propagated band</td>
            <td style={{ textAlign: 'right', padding: '0.35rem 0.5rem' }}>
              [{IMP96287_REACH_BAND.band95.detector.lo.toExponential(2)}, {IMP96287_REACH_BAND.band95.detector.hi.toExponential(2)}]
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: 'var(--ink-faint)', fontSize: '0.78rem', margin: '0.5rem 0 0' }}>
        The band widens ~14-16 orders of magnitude around the point estimate because the fit
        extrapolates ~10.4 decades of gamma from only n = 5 measured points (imp-96287); the full
        multi-column reconciliation and chart live on the imp-96320 reach-band page.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Law:</strong> {IMP96059_LAW}
        <br />
        <strong style={{ color: 'var(--ink-soft)' }}>Reach:</strong> {IMP96059_REACH}
        <br />
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> presentation only -- charts the
        ROUTE_L.detector rows already baked in
        rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js. Changes no bound; Route L
        stays NOT-A-LEVER (RH content = resolved zeros, completeness = Weil positivity, no
        external arithmetic input). RH open; NO QED.
      </div>
    </div>
  );
}
