import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { FLOW_BLINDNESS_NO_GO as D } from '../data/flow-blindness-no-go.js';

const card = {
  background: '#0b1220',
  border: '1px solid #1e293b',
  borderRadius: 10,
  padding: '16px 18px',
  margin: '14px 0',
};
const label = { color: '#7dd3fc', fontWeight: 600, fontSize: 13, letterSpacing: 0.3 };
const mono = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  background: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 6,
  padding: '10px 12px',
  display: 'block',
  color: '#e2e8f0',
  fontSize: 14,
  overflowX: 'auto',
};

export default function FlowBlindnessNoGoPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px', color: '#cbd5e1' }}>
      <PageHeader title="Flow-Blindness: Soft Hypotheses Cannot Prove RH" />

      <div style={{ ...card, borderColor: '#3b3b1e', background: '#141405' }}>
        <span style={{ ...label, color: '#fbbf24' }}>{D.status}</span>
        <p style={{ marginTop: 8 }}>{D.oneLine}</p>
        <a href={D.paperPdf} target="_blank" rel="noreferrer"
           style={{ color: '#7dd3fc', fontWeight: 600 }}>
          → Read the rigorous note (PDF)
        </a>
      </div>

      <div style={card}>
        <span style={label}>{D.dictionary.heading}</span>
        <code style={{ ...mono, marginTop: 8 }}>{D.dictionary.identity}</code>
        <p style={{ marginTop: 10 }}><b>Verified.</b> {D.dictionary.verified}</p>
        <p><b>Consequence.</b> {D.dictionary.consequence}</p>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>{D.dictionary.factorTwo}</p>
      </div>

      <div style={{ ...card, borderColor: '#1e3a5f' }}>
        <span style={{ ...label, color: '#93c5fd' }}>{D.theorem.heading}</span>
        <p style={{ marginTop: 8 }}><b>Theorem.</b> {D.theorem.statement}</p>
        <p><b>Corollary (no soft proof).</b> {D.theorem.corollary}</p>
        <p><b>What a proof must add.</b> {D.theorem.mustAdd}</p>
      </div>

      <div style={card}>
        <span style={label}>Where it sits</span>
        <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
          {D.ties.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>

      <div style={{ ...card, background: '#0a1a0a', borderColor: '#1e3a1e' }}>
        <span style={{ ...label, color: '#86efac' }}>Honest scope</span>
        <p style={{ marginTop: 8 }}>{D.scope}</p>
      </div>

      <div style={card}>
        <span style={label}>References</span>
        <ol style={{ marginTop: 8, lineHeight: 1.6, color: '#94a3b8', fontSize: 14 }}>
          {D.references.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
        <p style={{ marginTop: 10 }}>
          Related: <Link to="/frozen-rung-pt-equivalence" style={{ color: '#7dd3fc' }}>
          Freezing Rungs = Platt–Trudgian</Link>{' · '}
          <Link to="/open-frontier" style={{ color: '#7dd3fc' }}>Open Frontier (T-series)</Link>{' · '}
          <Link to="/pt-floor-audit" style={{ color: '#7dd3fc' }}>What Binds the Λ≤0.2 Floor?</Link>
        </p>
      </div>
    </div>
  );
}
