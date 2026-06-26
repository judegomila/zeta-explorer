import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * HonestCeilingBanner — a compact, dismissable top-of-page callout that surfaces
 * the canonical honest ceiling ABOVE THE FOLD on pages most prone to over-reading.
 *
 * Distinct from the inline VizCeilingNote (which is a footnote-style guardrail for
 * exploratory visualizations): this is a banner placed at the very top of a page so
 * a reader cannot over-read a single partial page before scrolling. The wording is
 * kept in lockstep with the StateOfProgramPage TRUTHS array — no new claims here,
 * just the guardrail surfaced and a link to the one canonical /state-of-program page.
 *
 * Props:
 *   variant  one of VARIANTS keys (RIGOROUS-SOTA | ESTIMATE | RH-EQUIVALENT |
 *            REFUTED | OPEN-HARD). Default RIGOROUS-SOTA.
 *   title    optional override for the headline line.
 *   body     optional override for the body text.
 */

// Preset variants mirror the StateOfProgramPage TRUTHS badges/wording so this
// banner cannot drift from the canonical honest-status page.
const VARIANTS = {
  'RIGOROUS-SOTA': {
    color: '#34d399',
    title: 'The rigorous floor is Platt-Trudgian Λ ≤ 0.2 — this program did NOT produce it',
    body:
      'The best unconditional de Bruijn-Newman upper bound the field has is Platt-Trudgian (Λ ≤ 0.2), ' +
      'with Rodgers-Tao (Λ ≥ 0) on the lower side. Both are cited results, not outputs of this program.',
  },
  ESTIMATE: {
    color: '#fbbf24',
    title: 'The finite-N*=1e4 "beat" is an ESTIMATE, gated on the undischargeable C_H',
    body:
      'The headline finite-N* = 1e4 beat is numerical, not a rigorous bound. It rests on a collision-energy ' +
      'constant C_H whose discharge is open (the Gronwall attack is refuted). Read it as rigorous-modulo-C_H, ' +
      'never as an unconditional finite-N beat.',
  },
  'RH-EQUIVALENT': {
    color: '#a78bfa',
    title: 'The Volterra ‖V‖ ≤ 1 collapse is RH-EQUIVALENT, not a reduction',
    body:
      'The §15-27 collapse to a single statement ‖V‖ ≤ 1 is a faithful reformulation of RH — it renames RH, it ' +
      'does not reduce it. Proving it would be proving RH; the same is true of Beurling-Nyman, de Branges and ' +
      'Connes-Weil.',
  },
  REFUTED: {
    color: '#f87171',
    title: 'Honesty audit withdrew six caught overclaims',
    body:
      'The honesty audit (route map, 2026-06-19) caught and withdrew six overclaims. This page is exploratory or a ' +
      'faithful reformulation — not a shortcut below RH.',
  },
  'OPEN-HARD': {
    color: '#22d3ee',
    title: 'C_H / G6a is the #1 genuine wall',
    body:
      'Every route that could deliver an actual Λ number short of RH funnels into one object: the C_H / G6a ' +
      'Hölder-½ shock modulus. It is RH-hard at the modulus and the naive Gronwall discharge is refuted.',
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
        color: '#cbd5e1',
        padding: '12px 40px 12px 14px',
        borderRadius: 8,
        margin: '0 0 18px 0',
        background: 'rgba(15,23,42,0.55)',
        border: `1px solid ${v.color}`,
        borderLeft: `4px solid ${v.color}`,
      }}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss honest-ceiling banner"
        title="Dismiss"
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
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
        HONEST CEILING · {badge}
      </span>
      <strong style={{ color: '#e2e8f0' }}>{headline}</strong>
      <div style={{ marginTop: 6 }}>
        {text}{' '}
        <Link to="/state-of-program" style={{ color: v.color, fontWeight: 600 }}>
          See the State of the Program
        </Link>{' '}
        for the one canonical honest summary.
      </div>
    </div>
  );
}
