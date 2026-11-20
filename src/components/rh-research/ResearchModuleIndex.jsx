import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout from '../editorial/PostLayout.jsx';
import ClaimBoundary, { researchStatusLabel } from './ClaimBoundary.jsx';
import { reproducibilityLabel } from './VerificationPanel.jsx';

const INDEX_BOUNDARY = Object.freeze({
  title: 'A research ledger, not a proof announcement',
  statement: 'Each entry states its exact scope, assumptions, evidence, and unresolved blocker. RH remains open.',
  doesNotClaim: [
    'that a finite certificate proves an all-scale statement',
    'that a failed lower-bound surrogate makes the underlying operator negative',
    'that a numerical experiment is a theorem without its stated certificate',
  ],
});

/** Index renderer. Registration and route wiring remain separate data concerns. */
export default function ResearchModuleIndex({ modules = [] }) {
  return (
    <PostLayout
      grade="MAP"
      meta={[`${modules.length} scope-graded records`]}
      title="RH research modules"
      dek="Exact mathematics, explicit evidence status, open blockers, and routes that failed."
      byline={['exploreriemann', 'research ledger']}
      ticker={<span>RH open · evidence graded</span>}
      footer={<>← <Link to="/">the atlas</Link></>}
    >
      <ClaimBoundary claimBoundary={INDEX_BOUNDARY} status="open" rhStatus="open" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 19rem), 1fr))', gap: 14 }}>
        {modules.map((module) => (
          <article key={module.id} className="card" style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: 18, background: 'var(--paper2)' }}>
            <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, textTransform: 'uppercase' }}>
              {researchStatusLabel(module.status)}
            </div>
            <h2 style={{ fontSize: 21, margin: '8px 0' }}><Link to={module.route}>{module.title}</Link></h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.65 }}>{module.summary}</p>
            {module.reviewStatus && (
              <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 6 }}>
                repository review: {module.reviewStatus}{module.reviewScope ? ` (${module.reviewScope} only)` : ''}
              </div>
            )}
            <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginBottom: 6 }}>
              evidence: {reproducibilityLabel(module.verification?.reproducibilityStatus)}
            </div>
            <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11 }}>updated {module.updatedAt}</div>
          </article>
        ))}
      </div>
    </PostLayout>
  );
}
