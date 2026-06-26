import React from 'react';
import { Link } from 'react-router-dom';

/**
 * DownstreamVerdictCallout — a shared honest "downstream verdict" banner for the
 * §17 / Apps B–G program pages (/blaschke-ghosts, /reciprocal-program).
 *
 * These no-ghost / restricted-lift constructions feed a chain whose TERMINAL
 * reduction (the §27 Volterra-contraction target) was refuted-as-a-reduction on
 * 2026-06-18: it is KILLED AS A REDUCTION, and the residual open sub-problem is
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
      background: 'rgba(220,38,38,0.08)',
      border: '1px solid rgba(220,38,38,0.4)',
      borderLeft: '4px solid #dc2626',
      borderRadius: 8,
    }}>
      <div style={{
        color: '#fca5a5',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'var(--font-mono, monospace)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        Downstream verdict — §27 reduction refuted (2026-06-18)
      </div>
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        The constructions on this page feed a chain whose terminal target — the §27
        Volterra-contraction reduction — is <strong style={{ color: '#fca5a5' }}>KILLED AS A
        REDUCTION</strong>: it is provably impossible to revive by any scalar normalization.
        The surviving open sub-problem (<InlineCode>{'||R|| <= 1 <=> K_a >= 0'}</InlineCode>) is a
        faithful restatement of positivity — <strong style={{ color: '#e2e8f0' }}>RH-equivalent,
        not a shortcut</strong>. See the full chain and its honest status on{' '}
        <Link to="/collapse-chain" style={{ color: '#60a5fa' }}>/collapse-chain</Link>.
      </p>
    </div>
  );
}

function InlineCode({ children }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 12,
      color: '#fbbf24',
      background: 'rgba(148,163,184,0.12)',
      padding: '1px 5px',
      borderRadius: 4,
    }}>{children}</code>
  );
}
