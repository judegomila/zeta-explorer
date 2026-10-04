import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import {
  IMP95493_CURVE,
  IMP95493_LAMBERT_CROSSOVER_X,
  IMP95493_EDGE_CROSSOVER_X,
  IMP95493_SUMMARY,
} from '../data/imp-95493-rstar-two-end-accuracy-data.js';
import { ED, alpha } from '../styles/tokens.js';

const X_MIN = IMP95493_CURVE[0].x;
const X_MAX = IMP95493_CURVE[IMP95493_CURVE.length - 1].x;
const Y_MIN = 1e-8;
const Y_MAX = 10;

function AccuracyChart() {
  const svgW = 720;
  const padL = 60;
  const padR = 24;
  const padT = 16;
  const padB = 44;
  const svgH = 380;
  const cW = svgW - padL - padR;
  const cH = svgH - padT - padB;

  const xOf = (x) => padL + ((x - X_MIN) / (X_MAX - X_MIN)) * cW;
  const yOf = (err) => {
    const clamped = Math.max(Y_MIN, Math.min(Y_MAX, err));
    const logY = (Math.log10(clamped) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN));
    return padT + cH - logY * cH;
  };

  const lambertPts = IMP95493_CURVE.filter((p) => p.lambertErr !== null);
  const edgePts = IMP95493_CURVE.filter((p) => Number.isFinite(p.edgeErr) && p.edgeErr > 0);

  const gapX0 = xOf(IMP95493_LAMBERT_CROSSOVER_X);
  const gapX1 = xOf(IMP95493_EDGE_CROSSOVER_X);
  const thresholdY = yOf(0.01);

  const yTicks = [1e-7, 1e-5, 1e-3, 1e-1, 1];

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      {/* mid-band gap shading: neither closed form within 1% relative error */}
      <rect x={gapX0} y={padT} width={gapX1 - gapX0} height={cH} fill={alpha(ED.series2, 0.08)} />
      <text x={(gapX0 + gapX1) / 2} y={padT + 14} textAnchor="middle" fill={ED.series2} fontSize={9.5}>
        mid-band gap
      </text>

      {/* 1% threshold reference line */}
      <line x1={padL} y1={thresholdY} x2={padL + cW} y2={thresholdY} stroke={ED.rule} strokeDasharray="4,3" strokeWidth={1} />
      <text x={padL + cW - 4} y={thresholdY - 4} textAnchor="end" fill={ED.inkFaint} fontSize={9}>
        1% threshold
      </text>

      {/* Lambert-W small-x form error curve */}
      <polyline
        points={lambertPts.map((p) => `${xOf(p.x)},${yOf(p.lambertErr)}`).join(' ')}
        fill="none"
        stroke={ED.series1}
        strokeWidth={2.25}
      />
      {/* x -> 1 edge series error curve */}
      <polyline
        points={edgePts.map((p) => `${xOf(p.x)},${yOf(p.edgeErr)}`).join(' ')}
        fill="none"
        stroke={ED.brassDeco}
        strokeWidth={2.25}
      />

      {[0.02, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 0.99].map((x) => (
        <text key={`xt-${x}`} x={xOf(x)} y={padT + cH + 16} textAnchor="middle" fill={ED.inkFaint} fontSize={9.5}>
          {x}
        </text>
      ))}
      <text x={padL + cW / 2} y={svgH - 4} textAnchor="middle" fill={ED.inkFaint} fontSize={10}>
        x
      </text>

      {yTicks.map((t) => (
        <text key={`yt-${t}`} x={padL - 8} y={yOf(t) + 3} textAnchor="end" fill={ED.inkFaint} fontSize={9.5}>
          {t.toExponential(0)}
        </text>
      ))}
      <text
        x={14}
        y={padT + cH / 2}
        textAnchor="middle"
        fill={ED.inkFaint}
        fontSize={10}
        transform={`rotate(-90 14 ${padT + cH / 2})`}
      >
        relative error vs exact root (log scale)
      </text>

      <text x={padL + 6} y={padT + 12} textAnchor="start" fill={ED.series1} fontSize={9}>
        Lambert-W small-x form (imp-95377)
      </text>
      <text x={padL + 6} y={padT + 24} textAnchor="start" fill={ED.brass} fontSize={9}>
        x-&gt;1 edge series (imp-95447)
      </text>
    </svg>
  );
}

export default function Imp95493RstarTwoEndAccuracyViz() {
  const s = IMP95493_SUMMARY;
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="r_star(x) Two-End Asymptotic Accuracy: Lambert-W vs Edge Series (imp-95447 / imp-95493)" />

      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--series-2) 6%, transparent)',
          borderLeft: '3px solid var(--series-2)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          maxWidth: 700,
        }}
      >
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> derivation/measurement only. It
        changes no Lambda bound and establishes no operator positivity. Platt&ndash;Trudgian &Lambda;
        &le; 0.2 remains state of the art. RH does not follow from anything on this page. NO QED.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        The imp-95271 bump-wedge boundary r_star(x) (root of h_r(x, r) = 0) has two complementary
        closed-form leading asymptotics: the imp-95377 small-x Lambert-W form, valid only for
        x &le; 2/e&sup2; &asymp; 0.2707, and the imp-95447 x&nbsp;&rarr;&nbsp;1 edge series. This
        page plots each form&apos;s relative error against the exact RSTAR-EQ root (found by
        bisection) across x &isin; [{X_MIN}, {X_MAX}], shading the mid-band region where
        <em> neither</em> form is within 1% &mdash; the SUB-GAP imp-95447 left open.
      </p>

      <p style={{ color: 'var(--ink-faint)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        Relative error vs x (log-y), 150-point grid
      </p>
      <AccuracyChart />

      <table
        style={{
          width: '100%',
          marginTop: '1.5rem',
          borderCollapse: 'collapse',
          fontSize: '0.78rem',
        }}
      >
        <thead>
          <tr style={{ color: 'var(--ink-soft)', textAlign: 'left', borderBottom: '1px solid var(--rule)' }}>
            <th style={{ padding: '0.4rem 0.6rem' }}>quantity</th>
            <th style={{ padding: '0.4rem 0.6rem' }}>value</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>Lambert-W domain ceiling</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              x &le; {s.lambertDomainMax.toFixed(6)} (= 2/e&sup2;)
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>Lambert form crosses 1% error at</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              x = {IMP95493_LAMBERT_CROSSOVER_X.toFixed(6)}
            </td>
          </tr>
          <tr style={{ borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>edge series crosses 1% error at</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>
              x = {IMP95493_EDGE_CROSSOVER_X.toFixed(6)}
            </td>
          </tr>
          <tr style={{ color: 'var(--ink)' }}>
            <td style={{ padding: '0.4rem 0.6rem' }}>mid-band gap (neither form within 1%)</td>
            <td style={{ padding: '0.4rem 0.6rem', fontFamily: 'monospace' }}>{s.gapDescription}</td>
          </tr>
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
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> the blue Lambert-W curve
        only exists left of x &asymp; 0.271 (its branch-domain ceiling) and is accurate near x = 0;
        the yellow edge-series curve exists everywhere on (0, 1) but is only accurate near x = 1.
        The shaded band is where both curves sit above the 1% dashed line &mdash; wider than the
        informal ~[0.3, 0.6] window imp-95447 named, but that window sits well inside it. No single
        closed form covers the shaded band; it is reached only by numeric root-finding (imp-95427)
        or the imp-95482 Pad&eacute; re-summation.
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> {s.verdict}
      </div>
    </div>
  );
}
