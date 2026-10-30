import React from 'react';
import { MathText } from '../KaTeXMath.jsx';

const tagStyle = {
  display: 'inline-block',
  border: '1px solid var(--hairline)',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 11,
  lineHeight: 1.5,
  color: 'var(--ink-soft)',
  background: 'var(--paper)',
};

const REPRODUCIBILITY_LABELS = Object.freeze({
  'current-replay': 'current independent replay',
  'historical-unavailable': 'historical record · certificate unavailable',
  partial: 'partial reproducibility',
  'not-applicable': 'reproducibility not applicable',
});

export function reproducibilityLabel(status) {
  return REPRODUCIBILITY_LABELS[status] || status || 'evidence status not recorded';
}
function EvidenceLink({ item }) {
  if (typeof item === 'string') return <MathText>{item}</MathText>;
  const label = item.label || item.location;
  const href = item.href;
  const external = href?.startsWith('https://');

  return (
    <>
      {href ? (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{label}</a>
      ) : <strong>{label}</strong>}
      {item.kind && <span style={{ ...tagStyle, marginLeft: 7 }}>{item.kind}</span>}
      {item.location && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, overflowWrap: 'anywhere' }}>{item.location}</div>}
      {item.note && <div style={{ color: 'var(--ink-soft)', marginTop: 3 }}><MathText>{item.note}</MathText></div>}
    </>
  );
}

function Command({ item }) {
  const command = typeof item === 'string' ? item : item.command;
  const label = typeof item === 'string' ? null : item.label;
  const cwd = typeof item === 'string' ? null : item.cwd;

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <strong style={{ display: 'block', marginBottom: 5 }}>{label}</strong>}
      {cwd && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11 }}>cwd: {cwd}</div>}
      <pre style={{ overflowX: 'auto', margin: '5px 0 0', padding: 12, background: 'var(--paper)', border: '1px solid var(--hairline)', borderRadius: 6 }}>
        <code>{command}</code>
      </pre>
      {typeof item !== 'string' && item.expected && (
        <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 5 }}>
          <strong>Expected:</strong> <MathText>{item.expected}</MathText>
        </div>
      )}
    </div>
  );
}

function Artifact({ artifact }) {
  const href = artifact.href;
  const external = href?.startsWith('https://');
  const label = artifact.label || artifact.path || 'artifact';

  return (
    <li style={{ marginBottom: 10 }}>
      <span style={{ ...tagStyle, marginRight: 7 }}>{artifact.availability}</span>
      {href && artifact.availability === 'available'
        ? <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{label}</a>
        : <strong>{label}</strong>}
      {artifact.path && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, overflowWrap: 'anywhere', marginTop: 3 }}>{artifact.path}</div>}
      <div style={{ color: 'var(--faint)', fontSize: 11, marginTop: 3 }}>
        {artifact.requiredForClaim ? 'load-bearing for this claim' : 'supporting evidence'}
      </div>
      {artifact.note && <div style={{ color: 'var(--ink-soft)', marginTop: 3 }}><MathText>{artifact.note}</MathText></div>}
      {artifact.sha256 && (
        <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, overflowWrap: 'anywhere', marginTop: 3 }}>
          sha256: {artifact.sha256}
        </div>
      )}
    </li>
  );
}

function Replay({ replay }) {
  if (typeof replay === 'string') return <MathText>{replay}</MathText>;
  return (
    <>
      <strong>{replay.label}</strong>
      {replay.outcome && <> — <MathText>{replay.outcome}</MathText></>}
      {replay.method && <div style={{ color: 'var(--ink-soft)', marginTop: 3 }}><MathText>{replay.method}</MathText></div>}
      {replay.command && <div className="ed-mono" style={{ color: 'var(--faint)', fontSize: 11, marginTop: 3 }}>{replay.command}</div>}
      {replay.evidence?.length > 0 && (
        <ul style={{ margin: '5px 0 0', paddingLeft: 18 }}>{replay.evidence.map((item, index) => <li key={index}>{item}</li>)}</ul>
      )}
    </>
  );
}

/** Render reproducibility details without interpreting or upgrading their status. */
export default function VerificationPanel({ verification }) {
  const commands = verification?.commands || [];
  const artifacts = verification?.artifacts || [];
  const replays = verification?.replays || [];
  const evidence = verification?.evidence || [];
  const scope = verification?.scope;

  return (
    <section aria-labelledby="research-verification" style={{ marginTop: 30 }}>
      <h2 id="research-verification">Verification and provenance</h2>
      <p>
        <span style={tagStyle}>{reproducibilityLabel(verification?.reproducibilityStatus)}</span>
      </p>
      {verification?.result && <p><MathText>{verification.result}</MathText></p>}

      {scope && (
        <>
          <h3>Verification scope</h3>
          {Array.isArray(scope) ? (
            <ul style={{ paddingLeft: 20, lineHeight: 1.65 }}>
              {scope.map((item, index) => <li key={index}><MathText>{item}</MathText></li>)}
            </ul>
          ) : <p><MathText>{scope}</MathText></p>}
        </>
      )}

      {commands.length > 0 && (
        <>
          <h3>Reproduce</h3>
          {commands.map((item, index) => <Command key={index} item={item} />)}
        </>
      )}

      {artifacts.length > 0 && (
        <>
          <h3>Artifacts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>{artifacts.map((artifact, index) => <Artifact key={index} artifact={artifact} />)}</ul>
        </>
      )}

      {replays.length > 0 && (
        <>
          <h3>Independent replays</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 1.65 }}>{replays.map((replay, index) => <li key={index}><Replay replay={replay} /></li>)}</ul>
        </>
      )}

      {evidence.length > 0 && (
        <>
          <h3>Evidence</h3>
          <ul style={{ paddingLeft: 20, lineHeight: 1.65 }}>{evidence.map((item, index) => <li key={index}><EvidenceLink item={item} /></li>)}</ul>
        </>
      )}
    </section>
  );
}
