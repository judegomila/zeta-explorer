import React from 'react';
import { MathText } from '../KaTeXMath.jsx';

const STATUS_LABELS = Object.freeze({
  'proved-identity': 'proved identity',
  'proved-estimate': 'proved estimate',
  'proved-analytic': 'proved analytic theorem',
  'certified-finite': 'certified finite result',
  'conditional-reduction': 'conditional reduction',
  'failed-surrogate': 'failed surrogate',
  superseded: 'superseded route',
  open: 'open route',
});

export function researchStatusLabel(status) {
  return STATUS_LABELS[status] || status || 'research record';
}
/**
 * Permanent scope boundary for every RH research module.
 *
 * This is intentionally not dismissible: a reader should not be able to reach
 * a theorem, certificate, or failed route without also seeing that RH remains
 * open and exactly what the module does not establish.
 */
export default function ClaimBoundary({ claimBoundary, status, rhStatus }) {
  const doesNotClaim = claimBoundary?.doesNotClaim || [];

  return (
    <aside
      aria-label="Claim boundary"
      className="card"
      style={{
        border: '1px solid var(--hairline)',
        borderLeft: '4px solid var(--terra-dk)',
        borderRadius: 8,
        background: 'var(--paper2)',
        padding: '18px 20px',
        margin: '22px 0 28px',
      }}
    >
      <div
        className="ed-mono"
        style={{
          color: 'var(--terra-dk)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
        }}
      >
        RH remains {rhStatus || 'open'} · {researchStatusLabel(status)}
      </div>
      <h2 style={{ fontSize: 20, margin: '8px 0 6px' }}>
        {claimBoundary?.title || 'What this module establishes'}
      </h2>
      {claimBoundary?.statement && (
        <p style={{ color: 'var(--ink)', lineHeight: 1.7, margin: '0 0 10px' }}>
          <MathText>{claimBoundary.statement}</MathText>
        </p>
      )}
      {doesNotClaim.length > 0 && (
        <div>
          <strong style={{ color: 'var(--terra-dk)' }}>This does not claim:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            {doesNotClaim.map((item, index) => (
              <li key={`${index}-${item}`}><MathText>{item}</MathText></li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
