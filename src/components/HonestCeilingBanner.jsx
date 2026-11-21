import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ED } from '../styles/tokens.js';

/**
 * HonestCeilingBanner — a compact, dismissable top-of-page callout that surfaces
 * the canonical ceiling ABOVE THE FOLD on pages most prone to over-reading.
 *
 * Distinct from the inline VizCeilingNote (which is a footnote-style guardrail for
 * exploratory visualizations): this is a banner placed at the very top of a page so
 * a reader cannot over-read a single partial page before scrolling. The wording is
 * kept in lockstep with the StateOfProgramPage TRUTHS array — no new claims here,
 * just the guardrail surfaced and a link to the one canonical /state-of-program page.
 *
 * Props:
 *   variant  one of VARIANTS keys (RIGOROUS-SOTA | PROOF-CANDIDATE |
 *            ESTIMATE | RH-EQUIVALENT | REFUTED | OPEN-HARD).
 *            Default RIGOROUS-SOTA.
 *   title    optional override for the headline line.
 *   body     optional override for the body text.
 */

// Preset variants mirror the StateOfProgramPage TRUTHS badges/wording so this
// banner cannot drift from the canonical status page.
const VARIANTS = {
  'RIGOROUS-SOTA': {
    color: ED.series3,
    title: 'Peer-reviewed benchmark: Platt-Trudgian Λ ≤ 0.2 — this program did NOT produce it',
    body:
      'A public unrefereed package claims Λ ≤ 0.1875 and is listed in the Optimization Problems ledger; a local ' +
      'audit repaired an omitted finite sweep. The standalone repository presents Λ ≤ 0.1787854 as a ' +
      'computer-assisted candidate for an unconditional proof, reviewed by Dan Romik and publicly posted; it is not refereed ' +
      'and is not itself RH. The peer-reviewed bounds are Platt-Trudgian Λ ≤ 0.2 and Rodgers-Tao Λ ≥ 0.',
  },
  'PROOF-CANDIDATE': {
    color: ED.series1,
    title: 'Candidate: Λ ≤ 0.1787854 — reviewed by Dan Romik, publicly posted (judegomila.com/posts/riemann-lambda-0.1787854)',
    body:
      'The package presents a computer-assisted candidate for an unconditional proof using a compact slab, a ' +
      'final-time zero-free half-strip, a fresh 3,149,013-row material replay, corrected 10.50 error bounds, and ' +
      'an exact Polymath criterion weld. It has been reviewed by Dan Romik and is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); ' +
      'it is not yet a peer-reviewed publication and is not itself RH — RH still requires Λ ≤ 0.',
  },
  ESTIMATE: {
    color: ED.brass,
    title: 'The finite-N*=1e4 "beat" is an ESTIMATE, gated on the undischargeable C_H',
    body:
      'The headline finite-N* = 1e4 beat is numerical, not a rigorous bound. It rests on a collision-energy ' +
      'constant C_H whose discharge is open (the Gronwall approach is refuted). Read it as rigorous-modulo-C_H, ' +
      'never as an unconditional finite-N beat.',
  },
  'RH-EQUIVALENT': {
    color: ED.series5,
    title: 'The Volterra ‖V‖ ≤ 1 collapse is RH-EQUIVALENT, not a reduction',
    body:
      'The §15-27 collapse to a single statement ‖V‖ ≤ 1 is a faithful reformulation of RH — it renames RH, it ' +
      'does not reduce it. Proving it would be proving RH; the same is true of Beurling-Nyman, de Branges and ' +
      'Connes-Weil.',
  },
  REFUTED: {
    color: ED.accent,
    title: 'Exploratory / refuted route — not a shortcut below RH',
    body:
      'This page is an exploratory attempt or a faithful reformulation of RH — not a proof and not a shortcut ' +
      'below it. Any bound it discusses is an estimate unless separately certified; Platt-Trudgian Λ ≤ 0.2 is ' +
      'the peer-reviewed benchmark and the public 0.1875 package remains unrefereed.',
  },
  'OPEN-HARD': {
    color: ED.series1,
    title: 'C_H / G6a is the main wall for the Dyson/collision route family',
    body:
      'The inherited Dyson/collision routes funnel into the C_H / G6a Hölder-½ shock modulus. ' +
      'The separate fixed-height Λ ≤ 0.1787854 package does not consume C_H and does not close the older Dyson route. ' +
      'It is a computer-assisted candidate for an unconditional proof, reviewed by Dan Romik and publicly posted; ' +
      'it is not refereed and is not itself RH. The naive C_H Gronwall discharge is refuted.',
  },
};

export default function HonestCeilingBanner({ variant = 'RIGOROUS-SOTA', title, body }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const v = VARIANTS[variant] || VARIANTS['RIGOROUS-SOTA'];
  const badge = variant;
  const headline = title || v.title;
  const text = body || v.body;

  return (
    <div
      role="note"
      style={{
        position: 'relative',
        fontSize: 13,
        lineHeight: 1.6,
        color: 'var(--ink-soft)',
        padding: '12px 40px 12px 14px',
        borderRadius: 8,
        margin: '0 0 18px 0',
        background: 'var(--paper-2)',
        border: `1px solid ${v.color}`,
        borderLeft: `4px solid ${v.color}`,
      }}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss ceiling banner"
        title="Dismiss"
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          background: 'transparent',
          border: 'none',
          color: 'var(--ink-faint)',
          fontSize: 16,
          lineHeight: 1,
          cursor: 'pointer',
          padding: 4,
        }}
      >
        ×
      </button>
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: v.color,
          border: `1px solid ${v.color}`,
          borderRadius: 4,
          padding: '1px 6px',
          marginRight: 8,
        }}
      >
        CEILING · {badge}
      </span>
      <strong style={{ color: 'var(--ink)' }}>{headline}</strong>
      <div style={{ marginTop: 6 }}>
        {text}{' '}
        <Link to="/state-of-program" style={{ color: v.color, fontWeight: 600 }}>
          See the State of the Program
        </Link>{' '}
        for the canonical summary.
      </div>
    </div>
  );
}
