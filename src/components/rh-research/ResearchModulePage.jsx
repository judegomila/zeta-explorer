import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { BlockMath, Pull, TheoremBox } from '../editorial/PostLayout.jsx';
import { MathText } from '../KaTeXMath.jsx';
import ClaimBoundary, { researchStatusLabel } from './ClaimBoundary.jsx';
import CanonicalResearchBody from './CanonicalResearchBody.jsx';
import FailureCard from './FailureCard.jsx';
import VerificationPanel, { reproducibilityLabel } from './VerificationPanel.jsx';

const GRADE_BY_STATUS = Object.freeze({
  'proved-identity': 'THEOREM',
  'proved-analytic': 'THEOREM',
  'certified-finite': 'VERIFIED',
  'conditional-reduction': 'CANDIDATE',
  'failed-surrogate': 'NO-GO',
  superseded: 'NO-GO',
  open: 'MAP',
});

function gradeForModule(module) {
  if (module.status === 'certified-finite' &&
      module.verification?.reproducibilityStatus !== 'current-replay') return 'AUDIT';
  return GRADE_BY_STATUS[module.status] || 'MAP';
}
function Equation({ equation }) {
  const tex = typeof equation === 'string' ? equation : equation.tex;
  const id = typeof equation === 'string' ? null : equation.id;
  const label = typeof equation === 'string' ? null : equation.label;
  const description = typeof equation === 'string' ? null : equation.explanation;

  return (
    <figure
      data-research-equation-id={id || undefined}
      data-research-equation-tex={tex}
      style={{ margin: '18px 0' }}
    >
      {label && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11 }}>{label}</div>}
      <BlockMath tex={tex} />
      {description && <figcaption style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}><MathText>{description}</MathText></figcaption>}
    </figure>
  );
}

function DerivationStep({ step, index }) {
  return (
    <section aria-labelledby={`derivation-${index}`} style={{ margin: '22px 0' }}>
      <h3 id={`derivation-${index}`}>{step.title || `Step ${index + 1}`}</h3>
      {step.body && <p><MathText>{step.body}</MathText></p>}
      {(step.equations || []).map((equation, equationIndex) => <Equation key={equationIndex} equation={equation} />)}
      {(step.notes || []).map((note, noteIndex) => (
        <Pull key={noteIndex}><MathText>{note}</MathText></Pull>
      ))}
    </section>
  );
}

function Blocker({ blocker, index }) {
  return (
    <article className="card" style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: '16px 18px', background: 'var(--paper2)' }}>
      <h3 style={{ marginTop: 0 }}>{blocker.title}</h3>
      <p><MathText>{blocker.statement}</MathText></p>
      {blocker.physicsAnalogy && (
        <p style={{ color: 'var(--ink-soft)' }}><strong>Physics picture.</strong> <MathText>{blocker.physicsAnalogy}</MathText></p>
      )}
      {blocker.nextTest && (
        <p style={{ marginBottom: 0 }}><strong>Next falsifiable test.</strong> <MathText>{blocker.nextTest}</MathText></p>
      )}
    </article>
  );
}

function Provenance({ provenance, bodyPath }) {
  if (!provenance) return null;
  const refs = provenance.sourceRefs || [];

  return (
    <section aria-labelledby="research-provenance">
      <h2 id="research-provenance">Source lineage</h2>
      {refs.length > 0 && (
        <ul style={{ paddingLeft: 20 }}>{refs.map((ref, index) => {
          if (typeof ref === 'string') return <li key={index}>{ref}</li>;
          const prIsUrl = /^https:\/\//.test(ref.pullRequest || '');
          return (
            <li key={index} style={{ marginBottom: 12 }}>
              <strong>{ref.repository}</strong>
              <dl className="ed-mono" style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: '3px 10px', fontSize: 11, margin: '5px 0' }}>
                <dt>branch</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{ref.branch}</dd>
                <dt>commit</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{ref.commit}</dd>
                <dt>access</dt><dd style={{ margin: 0 }}>{ref.access === 'private-repository' ? 'private repository access required' : 'public'}</dd>
                {ref.pullRequest && <><dt>pull request</dt><dd style={{ margin: 0 }}>{prIsUrl ? <a href={ref.pullRequest} target="_blank" rel="noreferrer">{ref.pullRequest}</a> : ref.pullRequest}</dd></>}
              </dl>
              {ref.paths?.length > 0 && <ul className="ed-mono" style={{ paddingLeft: 18, fontSize: 11 }}>{ref.paths.map((file) => <li key={file}>{file}</li>)}</ul>}
              {ref.note && <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}><MathText>{ref.note}</MathText></p>}
            </li>
          );
        })}</ul>
      )}
      {(bodyPath || provenance.sourceManifestPath || provenance.evidenceManifestPath) && (
        <dl className="ed-mono" style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: '4px 10px', fontSize: 11 }}>
          {bodyPath && <><dt>body</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{bodyPath}</dd></>}
          {provenance.sourceManifestPath && <><dt>source manifest</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{provenance.sourceManifestPath}</dd></>}
          {provenance.evidenceManifestPath && <><dt>evidence manifest</dt><dd style={{ margin: 0, overflowWrap: 'anywhere' }}>{provenance.evidenceManifestPath}</dd></>}
        </dl>
      )}
      {provenance.curatorNote && <p><strong>Curator note.</strong> <MathText>{provenance.curatorNote}</MathText></p>}
    </section>
  );
}

/** Generic, data-driven renderer. It contains no mathematical claims itself. */
export default function ResearchModulePage({ module, indexRoute }) {
  const theorem = module.theorem;
  const derivation = module.derivation || [];
  const failures = module.failures || [];
  const blockers = module.blockers || [];
  const references = module.references || [];
  const reviewLabel = module.reviewStatus
    ? `repository review: ${module.reviewStatus}${module.reviewScope ? ` (${module.reviewScope} only)` : ''}`
    : null;

  return (
    <PostLayout
      grade={gradeForModule(module)}
      meta={[
        researchStatusLabel(module.status),
        reproducibilityLabel(module.verification?.reproducibilityStatus),
        reviewLabel,
        `updated ${module.updatedAt}`,
      ].filter(Boolean)}
      title={module.title}
      dek={module.summary}
      byline={['RH research record', 'scope-graded evidence']}
      ticker={<span>RH open · {researchStatusLabel(module.status)}</span>}
      footer={indexRoute
        ? <>← <Link to={indexRoute}>all RH research modules</Link></>
        : <>← <Link to="/">the atlas</Link></>}
    >
      <ClaimBoundary claimBoundary={module.claimBoundary} status={module.status} rhStatus={module.rhStatus} />

      <h2>Theorem or certified statement</h2>
      <TheoremBox label={theorem.label || 'Statement'}>
        <p><MathText>{theorem.statement}</MathText></p>
        {(theorem.equations || []).map((equation, index) => <Equation key={index} equation={equation} />)}
      </TheoremBox>

      <h3>Hypotheses and domain</h3>
      <ul style={{ paddingLeft: 20, lineHeight: 1.65 }}>
        {(theorem.hypotheses || []).map((hypothesis, index) => <li key={index}><MathText>{hypothesis}</MathText></li>)}
      </ul>

      {derivation.length > 0 && (
        <section aria-labelledby="research-derivation">
          <h2 id="research-derivation">Derivation</h2>
          {derivation.map((step, index) => <DerivationStep key={step.id || index} step={step} index={index} />)}
        </section>
      )}

      <CanonicalResearchBody bodyPath={module.bodyPath} />

      <VerificationPanel verification={module.verification} />

      {failures.length > 0 && (
        <section aria-labelledby="research-failures">
          <h2 id="research-failures">Failed surrogate records</h2>
          <p>These records preserve useful negative results without upgrading a failed bound into a statement about RH or the underlying operator.</p>
          {failures.map((failure, index) => <FailureCard key={failure.id || index} failure={failure} />)}
        </section>
      )}

      {blockers.length > 0 && (
        <section aria-labelledby="research-blockers">
          <h2 id="research-blockers">Open blockers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))', gap: 12 }}>
            {blockers.map((blocker, index) => <Blocker key={blocker.id || index} blocker={blocker} index={index} />)}
          </div>
        </section>
      )}

      <Provenance provenance={module.provenance} bodyPath={module.bodyPath} />

      {references.length > 0 && (
        <section aria-labelledby="research-references">
          <h2 id="research-references">References</h2>
          <ol style={{ paddingLeft: 20, lineHeight: 1.65 }}>{references.map((reference, index) => (
            <li key={index}>{reference}</li>
          ))}</ol>
        </section>
      )}
    </PostLayout>
  );
}
