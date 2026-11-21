import React from 'react';
import { MathText } from '../KaTeXMath.jsx';

function FailureEvidence({ evidence }) {
  if (typeof evidence === 'string') return <MathText>{evidence}</MathText>;
  return (
    <>
      <strong>{evidence.label}</strong>
      {evidence.kind && <span className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11 }}> · {evidence.kind}</span>}
      {evidence.location && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, overflowWrap: 'anywhere' }}>{evidence.location}</div>}
      {evidence.note && <div style={{ color: 'var(--ink-soft)', marginTop: 3 }}><MathText>{evidence.note}</MathText></div>}
    </>
  );
}
/**
 * A failed proof surrogate is first-class research evidence, but never evidence
 * that RH is false or that the underlying operator/form itself is negative.
 */
export default function FailureCard({ failure }) {
  return (
    <article
      className="card"
      style={{
        border: '1px solid var(--hairline)',
        borderLeft: '4px solid var(--terra-dk)',
        borderRadius: 8,
        background: 'var(--paper2)',
        padding: '18px 20px',
        margin: '14px 0',
      }}
    >
      <div className="ed-mono" style={{ color: 'var(--terra-dk)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
        failed surrogate
      </div>
      <h3 style={{ margin: '7px 0 10px' }}>{failure.title}</h3>
      <dl style={{ margin: 0 }}>
        <dt style={{ fontWeight: 700 }}>Surrogate tested</dt>
        <dd style={{ margin: '4px 0 12px' }}><MathText>{failure.surrogate}</MathText></dd>
        <dt style={{ fontWeight: 700 }}>Failure stage</dt>
        <dd style={{ margin: '4px 0 12px' }}><MathText>{failure.failureStage}</MathText></dd>
        {failure.evidence?.length > 0 && (
          <>
            <dt style={{ fontWeight: 700 }}>Evidence</dt>
            <dd style={{ margin: '4px 0 12px' }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {failure.evidence.map((evidence, index) => <li key={index}><FailureEvidence evidence={evidence} /></li>)}
              </ul>
            </dd>
          </>
        )}
        <dt style={{ fontWeight: 700 }}>What follows</dt>
        <dd style={{ margin: '4px 0 12px' }}><MathText>{failure.implication}</MathText></dd>
      </dl>
      <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 12 }}>
        <strong style={{ color: 'var(--terra-dk)' }}>What does not follow</strong>
        <ul style={{ margin: '7px 0 0', paddingLeft: 20, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
          {(failure.nonImplications || []).map((item, index) => <li key={index}><MathText>{item}</MathText></li>)}
        </ul>
      </div>
    </article>
  );
}
