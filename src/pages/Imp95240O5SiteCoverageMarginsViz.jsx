import React from 'react';
import PageHeader from '../components/PageHeader.jsx';
import { O5_SITE_COVERAGE } from '../data/imp-95212-ythaw-o5-o3.js';
import { ED, alpha } from '../styles/tokens.js';

// Baked literals imported verbatim from the imp-95212 data module; no new
// computation is performed here (viz/UX only).
const { X, N0, leftMargin, rightMargin } = O5_SITE_COVERAGE;
const windowWidth = leftMargin + rightMargin;
const siteFrac = leftMargin / windowWidth;

function MarginBracketChart() {
  const svgW = 700;
  const padL = 40;
  const padR = 40;
  const padT = 56;
  const padB = 44;
  const plotW = svgW - padL - padR;
  const barY = 90;
  const barH = 20;
  const svgH = padT + barH + padB + 20;

  const xOf = (frac) => padL + frac * plotW;
  const siteX = xOf(siteFrac);

  return (
    <svg width={svgW} height={svgH} style={{ display: 'block', maxWidth: '100%' }}>
      <text x={padL} y={padT - 30} fill={ED.inkSoft} fontSize={11} fontWeight={700}>
        Window W_{N0}: x_*(0.1808) strict-interior margins (proportional to margin size)
      </text>

      <rect
        x={padL}
        y={barY}
        width={plotW}
        height={barH}
        fill={alpha(ED.inkSoft, 0.08)}
        stroke={ED.rule}
        strokeWidth={1}
      />

      {/* left margin segment */}
      <rect x={padL} y={barY} width={siteX - padL} height={barH} fill={alpha(ED.series1, 0.35)} />
      {/* right margin segment */}
      <rect x={siteX} y={barY} width={padL + plotW - siteX} height={barH} fill={alpha(ED.series5, 0.35)} />

      {/* left bracket endpoint: x_N0 */}
      <line x1={padL} y1={barY - 8} x2={padL} y2={barY + barH + 8} stroke={ED.series1} strokeWidth={2} />
      <text x={padL} y={barY - 14} textAnchor="start" fill={ED.series1} fontSize={10}>
        x_{N0}
      </text>

      {/* right bracket endpoint: x_(N0+1) */}
      <line
        x1={padL + plotW}
        y1={barY - 8}
        x2={padL + plotW}
        y2={barY + barH + 8}
        stroke={ED.series5}
        strokeWidth={2}
      />
      <text x={padL + plotW} y={barY - 14} textAnchor="end" fill={ED.series5} fontSize={10}>
        x_{N0 + 1}
      </text>

      {/* the site x_*(0.1808) */}
      <line x1={siteX} y1={barY - 16} x2={siteX} y2={barY + barH + 16} stroke={ED.series2} strokeWidth={2} />
      <circle cx={siteX} cy={barY + barH / 2} r={4} fill={ED.series2} />
      <text x={siteX} y={barY + barH + 30} textAnchor="middle" fill={ED.series2} fontSize={10}>
        x_*(0.1808)
      </text>

      {/* margin labels */}
      <text x={(padL + siteX) / 2} y={barY + barH + 30} textAnchor="middle" fill={ED.series1} fontSize={9}>
        leftMargin {leftMargin.toFixed(2)}
      </text>
      <text x={(siteX + padL + plotW) / 2} y={barY + barH + 30} textAnchor="middle" fill={ED.series5} fontSize={9}>
        rightMargin {rightMargin.toFixed(2)}
      </text>
    </svg>
  );
}

export default function Imp95240O5SiteCoverageMarginsViz() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <PageHeader title="O5 Site-Coverage Margins: x_*(0.1808) in W_690988 (imp-95240)" />

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
        <strong style={{ color: 'var(--series-2)' }}>Honest status:</strong> 0.17759432 is a package
        value, not a proven bound. It is conditional on obligations O1, O2, O4, O6 of the
        six-obligation y-thaw package, all of which remain OPEN (only O3 and O5 are certified).
        No refereed bound is changed. RH does not follow from
        anything on this page.
      </div>

      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 700 }}>
        imp-95212 certifies (exact-rational + 400-bit interval + Arb/FLINT confirmation,
        three-way agreement) that the site x_*(0.1808) at height X = {X.toLocaleString('en-US')}
        {' '}sits strictly interior to window W_{N0}, bracketed by zeros x_{N0} and x_{N0 + 1}.
        The bracket below is drawn proportionally to the two certified margins (not to the true
        window scale, which spans ~{windowWidth.toExponential(2)} at height ~6e12).
      </p>

      <MarginBracketChart />

      <div
        style={{
          marginTop: '1.75rem',
          padding: '0.75rem 1rem',
          background: 'color-mix(in srgb, var(--ink-soft) 4%, transparent)',
          borderLeft: '3px solid var(--rule)',
          borderRadius: '0 4px 4px 0',
          fontSize: '0.8rem',
          color: 'var(--ink-faint)',
        }}
      >
        <strong style={{ color: 'var(--ink-soft)' }}>Reading the chart:</strong> leftMargin =
        x_*(0.1808) &minus; x_{N0} = {leftMargin.toFixed(12)} and rightMargin = x_{N0 + 1} &minus;
        x_*(0.1808) = {rightMargin.toFixed(12)} (floor-truncated 12dp certified lower bounds).
        Both are strictly positive, so x_*(0.1808) is strictly interior to W_{N0} under all three
        independently-computed lanes (exact-rational, mpmath.iv 400-bit, Arb/FLINT 400-bit).
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
        <strong style={{ color: 'var(--ink-soft)' }}>Status:</strong> viz-only page reusing the imp-95212
        O5_SITE_COVERAGE baked literals verbatim (no new computation). This closes obligation O5 of
        the six-obligation y-thaw package; O1, O2, O4, O6 remain OPEN and 0.17759432 stays a package
        value, not a proven bound. No QED.
      </div>
    </div>
  );
}
