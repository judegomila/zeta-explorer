import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DownstreamVerdictCallout — a shared "downstream verdict" banner for the
 * §17 / Apps B–G program pages (/blaschke-ghosts, /reciprocal-program).
 *
 * These no-ghost / restricted-lift constructions feed a chain whose TERMINAL
 * reduction (the §27 Volterra-contraction target) was refuted-as-a-reduction on
 * 2026-06-18: it is ELIMINATED AS A REDUCTION, and the residual open sub-problem is
 * RH-EQUIVALENT, not a shortcut. Readers of the program pages need that verdict
 * so they do not mistake a live reduction for a proven shortcut to RH.
 *
 * See src/data/section26-verdict-volterra-not-a-reduction-2026-06-18.js.
 */
export default function DownstreamVerdictCallout() {
  return (
    <div style={{
      margin: '16px 0',
      padding: '14px 18px',
      background: 'color-mix(in srgb, var(--series-2) 8%, transparent)',
      border: '1px solid color-mix(in srgb, var(--series-2) 40%, transparent)',
      borderLeft: '4px solid var(--series-2)',
      borderRadius: 8,
    }}>
      <div style={{
        color: 'var(--series-2)',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'var(--font-mono, monospace)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        Downstream verdict — §27 reduction refuted (2026-06-18)
      </div>
      <p style={{ color: 'var(--ink)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        The constructions on this page feed a chain whose terminal target — the §27
        Volterra-contraction reduction — is <strong style={{ color: 'var(--series-2)' }}>ELIMINATED AS A
        REDUCTION</strong>: it is provably impossible to revive by any scalar normalization.
        The surviving open sub-problem (<InlineCode>{'||R|| <= 1 <=> K_a >= 0'}</InlineCode>) is a
        faithful restatement of positivity — <strong style={{ color: 'var(--ink)' }}>RH-equivalent,
        not a shortcut</strong>. See the full chain and its status on{' '}
        <Link to="/collapse-chain" style={{ color: 'var(--series-1)' }}>/collapse-chain</Link>.
      </p>
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 12,
      color: 'var(--brass)',
      background: 'color-mix(in srgb, var(--ink-soft) 12%, transparent)',
      padding: '1px 5px',
      borderRadius: 4,
    }}>{children}</code>
  );
}
