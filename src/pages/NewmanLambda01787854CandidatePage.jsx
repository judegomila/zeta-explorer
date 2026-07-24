import React from 'react';
import { Link } from 'react-router-dom';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { NEWMAN_LAMBDA_01787854_CANDIDATE as CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const card = {
  background: 'rgba(15,23,42,0.55)',
  border: '1px solid #334155',
  borderRadius: 10,
  padding: '16px 18px',
};

function Metric({ label, value, color = '#67e8f9' }) {
  return (
    <div style={card}>
      <div style={{ color: '#64748b', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ color, fontFamily: mono, fontWeight: 750, fontSize: 18, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}

function ReplayBlock({ commands, expected }) {
  return (
    <div style={{ ...card, overflowX: 'auto' }}>
      <pre style={{ margin: 0, color: '#cbd5e1', fontFamily: mono, fontSize: 12.5, lineHeight: 1.65 }}>
        {commands.join('\n')}
      </pre>
      <div style={{ color: '#86efac', fontFamily: mono, fontSize: 12, marginTop: 10 }}>
        expected: {expected}
      </div>
    </div>
  );
}

export default function NewmanLambda01787854CandidatePage() {
  const { identity, exactTarget, finiteEvidence, tailEvidence, verifiedHeight, reviewObligations, replay, environment } =
    CANDIDATE;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Λ ≤ 0.1787854 — Local Review Candidate</h1>
        <p className="page-subtitle" style={{ maxWidth: 880 }}>
          A replayable fixed-height computer-assisted package below the published{' '}
          <InlineMath tex="\\Lambda\\le 0.2" /> benchmark. Its numerical gates pass locally,
          but theorem-level interfaces remain open. This page records evidence and review
          boundaries; it does not announce a new theorem.
        </p>
      </div>

      <HonestCeilingBanner
        variant="ESTIMATE"
        title="Review-open candidate — not rigorous, published, peer reviewed, or SOTA"
        body={
          'The package conditionally assembles Λ ≤ 0.1787854 and its stored checks pass, but the native ' +
          'Triangle-to-|f_t| identification and inherited winding/criterion interfaces require independent ' +
          'mathematical review. The strongest located public preprint claim is Λ ≤ 0.1875; Platt–Trudgian ' +
          'Λ ≤ 0.2 remains the peer-reviewed literature benchmark.'
        }
      />

      <div
        style={{
          ...card,
          borderColor: '#f59e0b88',
          borderLeft: '4px solid #f59e0b',
          marginBottom: 20,
        }}
      >
        <div style={{ color: '#fbbf24', fontFamily: mono, fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
          CANDIDATE · INDEPENDENT REVIEW OPEN
        </div>
        <BlockMath tex="\\boxed{\\Lambda\\le\\frac{893927}{5000000}=0.1787854}" />
        <BlockMath tex={exactTarget.identityTex} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '8px 0 0' }}>
          Exact row: <InlineMath tex={`X=${exactTarget.X}`} />,{' '}
          <InlineMath tex="t_0=129/800" />, and{' '}
          <InlineMath tex="y_0^2=87677/2500000" />. The positive result does not
          imply RH; RH would require an accepted upper bound <InlineMath tex="\\Lambda\\le 0" />.
        </p>
      </div>

      <div
        className="card-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: 28,
        }}
      >
        <Metric label="finite rows" value={finiteEvidence.rowCount.toLocaleString()} />
        <Metric label="finite N range" value={`${finiteEvidence.firstN}–${finiteEvidence.lastN}`} />
        <Metric label="finite slack ≥" value="5.57871094787×10⁻⁷" color="#86efac" />
        <Metric label="tail slack ≥" value="1.73520942813×10⁻⁴" color="#86efac" />
      </div>

      <h2>What the local package checks</h2>
      <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.75, maxWidth: 900 }}>
        The finite sweep stores every integer in the closed range with no gaps,
        duplicates, nonpositive rows, or <code>UNCERT</code> rows. A direct Arb
        upper-Dini calculation covers all active divisor patterns at 180 and 256
        bits and supports monotonicity of the exact Triangle mass. A separate
        interval gate controls the native normalizer and correction. Subject to the
        open functional-identification review, this transfers the fixed-height
        lower bound across the full height interval.
      </p>

      <div style={{ overflowX: 'auto', margin: '14px 0 24px' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 800, fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '8px 12px' }}>N range</th>
              <th style={{ padding: '8px 12px' }}>Auxiliary primes</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>min T<sub>N</sub></th>
            </tr>
          </thead>
          <tbody>
            {finiteEvidence.primeSetBands.map((band) => (
              <tr key={band.range} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 12px', color: '#cbd5e1', fontFamily: mono }}>{band.range}</td>
                <td style={{ padding: '8px 12px', color: '#67e8f9', fontFamily: mono }}>{band.primes}</td>
                <td style={{ padding: '8px 12px', color: '#e2e8f0', fontFamily: mono, textAlign: 'right' }}>
                  {band.minTriangle}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-grid" style={{ marginBottom: 28 }}>
        <div style={{ ...card, borderTop: '2px solid #06b6d4' }}>
          <h3 style={{ color: '#67e8f9', fontSize: 15, marginTop: 0 }}>Direct all-height gate</h3>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 20, marginBottom: 0 }}>
            <li>Arb precision: {finiteEvidence.dini.precisionsBits.join(' and ')} bits</li>
            <li>Pattern counts: {finiteEvidence.dini.divisorPatternCounts.join(', ')}</li>
            <li>Worst Dini ratio: {finiteEvidence.dini.worstCertifiedRatio} &lt; 1</li>
            <li>Correction log-rate: ≤ {finiteEvidence.correctionLogRateUpperBound} &lt; 0</li>
            <li>Effective error: ≤ {finiteEvidence.effectiveErrorUpperBound}</li>
          </ul>
        </div>
        <div style={{ ...card, borderTop: '2px solid #10b981' }}>
          <h3 style={{ color: '#86efac', fontSize: 15, marginTop: 0 }}>Tail and height gate</h3>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 20, marginBottom: 0 }}>
            <li>{tailEvidence.checksPassed}/{tailEvidence.checksTotal} checks at {tailEvidence.precisionsBits.join(' and ')} bits</li>
            <li>D ≤ {tailEvidence.contractionUpperBound} &lt; 1</li>
            <li>flow ≥ {tailEvidence.flowLowerBound}</li>
            <li>error ≤ {tailEvidence.errorUpperBound}</li>
            <li><InlineMath tex="X/2\\le T_{\\rm PT}" /> with T<sub>PT</sub> = {verifiedHeight.TPT}</li>
          </ul>
        </div>
      </div>

      <h2>The eight open referee obligations</h2>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, maxWidth: 880 }}>
        These are load-bearing mathematical questions, not editorial cleanup. A green
        replay does not discharge them.
      </p>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        {reviewObligations.map((item, index) => (
          <div key={item.title} style={{ ...card, borderLeft: '3px solid #f59e0b' }}>
            <div style={{ color: '#fbbf24', fontFamily: mono, fontSize: 11, marginBottom: 6 }}>
              REVIEW {index + 1}
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, margin: '0 0 7px' }}>{item.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>

      <h2>Reproducibility boundary</h2>
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, maxWidth: 900 }}>
        The private review snapshot is pinned by commit{' '}
        <code>{identity.packageCommit}</code> and seal <code>{identity.sealSha256}</code>.
        Its recorded environment is {environment.base}, FLINT {environment.flint},
        Python {environment.python}, mpmath {environment.mpmath}, and SymPy {environment.sympy}.
        Reviewers with the package can replay either path below.
      </p>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        <ReplayBlock commands={replay.stored} expected={replay.storedExpected} />
        <ReplayBlock commands={replay.container} expected={replay.containerExpected} />
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <Link to="/lambda-bounds" style={{ color: '#38bdf8' }}>← Λ Bounds &amp; RH Roadmap</Link>
        <a
          href="https://doi.org/10.5281/zenodo.21175533"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7dd3fc' }}
        >
          Public 0.1875 certificate package ↗
        </a>
        <Link to="/state-of-program" style={{ color: '#38bdf8' }}>State of the Program →</Link>
      </div>
    </div>
  );
}
