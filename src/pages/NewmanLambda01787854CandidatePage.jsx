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

function Metric({ label, value, color = '#67e8f9', fontSize = 18 }) {
  return (
    <div style={card}>
      <div style={{ color: '#64748b', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ color, fontFamily: mono, fontWeight: 750, fontSize, marginTop: 6, overflowWrap: 'anywhere' }}>
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
  const {
    identity,
    refereePaper,
    verification,
    exactTarget,
    certifiedRegions,
    finiteEvidence,
    tailEvidence,
    verifiedHeight,
    barrierEvidence,
    closedAuditItems,
    implementationReviewItems,
    reviewBoundary,
    replay,
    environment,
  } = CANDIDATE;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Λ ≤ 0.1787854 — Unreviewed Proof Candidate</h1>
        <p className="page-subtitle" style={{ maxWidth: 880 }}>
          A sealed computer-assisted package proposing an unconditional proof. Its intended
          argument assumes no unproved conjecture, but the mathematical reductions and
          proof-to-code correspondence have not been independently validated. The proposed
          bound is therefore not an established theorem.
        </p>
      </div>

      <HonestCeilingBanner
        variant="PROOF-CANDIDATE"
        title="Candidate for an unconditional proof — bound not established"
        body={
          'The immutable v3 release supplies proposed compact-slab, final-time half-strip, verified-height, ' +
          'finite, tail, and criterion-weld interfaces, and its exact-commit replay jobs are green. Those ' +
          'facts establish artifact integrity and encoded predicates, not independent mathematical validity. ' +
          'The candidate is positive; RH would require Λ ≤ 0.'
        }
      />

      <div
        style={{
          ...card,
          borderColor: '#22d3ee88',
          borderLeft: '4px solid #22d3ee',
          marginBottom: 20,
        }}
      >
        <div style={{ color: '#67e8f9', fontFamily: mono, fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
          UNREVIEWED CANDIDATE · INTENDED UNCONDITIONAL FORM · EXTERNAL REVIEW OPEN
        </div>
        <BlockMath tex="\boxed{\Lambda\le\frac{893927}{5000000}=0.1787854}" />
        <BlockMath tex={exactTarget.identityTex} />
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: '8px 0 0' }}>
          Exact candidate row: <InlineMath tex={`X=${exactTarget.X}`} />,{' '}
          <InlineMath tex="t_0=129/800" />, and{' '}
          <InlineMath tex="y_0^2=87677/2500000" />. If the three proposed criterion
          suppliers and their weld survive independent review, Theorem 1.2 would yield
          the displayed bound. The package does not presently establish it.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 14 }}>
          <a
            href={refereePaper.publicPath}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fbbf24', fontFamily: mono, fontSize: 12 }}
          >
            Read the v3 referee PDF ({refereePaper.pages} pages) ↗
          </a>
          <a
            href={identity.releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#7dd3fc', fontFamily: mono, fontSize: 12 }}
          >
            Open immutable {identity.releaseTag} ↗
          </a>
        </div>
      </div>

      <div
        className="card-grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          marginBottom: 28,
        }}
      >
        <Metric label="finite rows" value={finiteEvidence.rowCount.toLocaleString()} />
        <Metric
          label="finite N range"
          value={`${finiteEvidence.firstN.toLocaleString()}–${finiteEvidence.lastN.toLocaleString()}`}
          fontSize={16}
        />
        <Metric label="encoded finite slack ≥" value="5.57871094787×10⁻⁷" color="#86efac" fontSize={16} />
        <Metric label="tail slack >" value="1.735209373337×10⁻⁴" color="#86efac" fontSize={16} />
        <Metric
          label="barrier error <"
          value={barrierEvidence.effectiveErrorUpperBoundLiteral}
          color="#86efac"
          fontSize={14}
        />
        <Metric label="immutable release" value={identity.releaseTag} fontSize={16} />
      </div>

      <h2>Proposed zero-free regions</h2>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        <div style={{ ...card, borderTop: '2px solid #22d3ee' }}>
          <h3 style={{ color: '#67e8f9', fontSize: 15, marginTop: 0 }}>Candidate compact slab</h3>
          <BlockMath tex={certifiedRegions.compactSlab.theoremTex} />
          <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, marginBottom: 0 }}>
            The encoded domain includes all space and time endpoints. The repaired Arb barrier covers{' '}
            {certifiedRegions.compactSlab.prismCount} closed prisms; its minimum strict-margin
            lower endpoint is {certifiedRegions.compactSlab.minimumStrictMargin}. A referee must
            still validate the derivative, interpolation, winding, and continuity arguments.
          </p>
        </div>
        <div style={{ ...card, borderTop: '2px solid #10b981' }}>
          <h3 style={{ color: '#86efac', fontSize: 15, marginTop: 0 }}>Candidate final-time half-strip</h3>
          <BlockMath tex={certifiedRegions.finalTimeHalfStrip.theoremTex} />
          <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, marginBottom: 0 }}>
            Here <InlineMath tex={`x_0=${certifiedRegions.finalTimeHalfStrip.x0Tex}`} />. Symmetry gives{' '}
            <InlineMath tex={certifiedRegions.finalTimeHalfStrip.symmetricTex} />. No claim is made
            below <InlineMath tex="|\Im z|<y_0" />. This is a proposed theorem supplier,
            not an independently accepted zero-free theorem.
          </p>
        </div>
      </div>

      <h2>Certificate evidence</h2>
      <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.75, maxWidth: 900 }}>
        The v3 full replay reproduced every integer in the closed range with no gaps,
        duplicates, nonpositive rows, or <code>UNCERT</code> rows. A direct Arb
        upper-Dini calculation covers all active divisor patterns at 180 and 256
        bits and controls the exact Triangle mass across the full height interval.
        Separate 256- and 512-bit Arb certificates apply the conservative
        coefficient 10.50 = 3.58 + 6.92 to the finite and tail errors. These are
        verified execution facts relative to the released code and libraries.
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
            <li>
              Worst Dini ratio: {finiteEvidence.dini.worstCertifiedRatioLiteral} &lt; 1
            </li>
            <li>Correction log-rate: ≤ {finiteEvidence.correctionLogRateUpperBound} &lt; 0</li>
            <li>Raw floor: {finiteEvidence.rawFloorLiteral}</li>
            <li>Effective error: ≤ {finiteEvidence.effectiveErrorUpperBoundLiteral}</li>
            <li>Post-error margin: ≥ {finiteEvidence.finiteMarginLowerBoundLiteral}</li>
            <li>
              {finiteEvidence.errorCertificate.checksPassed}/{finiteEvidence.errorCertificate.checksTotal}{' '}
              finite-error checks at {finiteEvidence.errorCertificate.precisionsBits.join(' and ')} bits
            </li>
          </ul>
        </div>
        <div style={{ ...card, borderTop: '2px solid #10b981' }}>
          <h3 style={{ color: '#86efac', fontSize: 15, marginTop: 0 }}>Tail and height gate</h3>
          <ul style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 20, marginBottom: 0 }}>
            <li>{tailEvidence.checksPassed}/{tailEvidence.checksTotal} checks per precision at {tailEvidence.precisionsBits.join(' and ')} bits</li>
            <li>D ≤ {tailEvidence.contractionUpperBoundLiteral} &lt; 1</li>
            <li>flow ≥ {tailEvidence.flowLowerBound}</li>
            <li>error ≤ {tailEvidence.errorUpperBound}</li>
            <li><InlineMath tex="X/2\le T_{\rm PT}" /> with T<sub>PT</sub> = {verifiedHeight.TPT}</li>
          </ul>
        </div>
      </div>

      <h2>Eight supplied interfaces — mathematical review still open</h2>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, maxWidth: 880 }}>
        The package now supplies an explicit artifact for each formerly missing interface.
        “Supplied and sealed” does not mean “independently proved”: the external reviewer
        must check the mathematical reductions and their implementation separately.
      </p>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        {closedAuditItems.map((item, index) => (
          <div key={item.title} style={{ ...card, borderLeft: '3px solid #22d3ee' }}>
            <div style={{ color: '#67e8f9', fontFamily: mono, fontSize: 11, marginBottom: 6 }}>
              V3 INTERFACE {index + 1} · {item.status}
            </div>
            <h3 style={{ color: '#e2e8f0', fontSize: 14, margin: '0 0 7px' }}>{item.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{item.detail}</p>
          </div>
        ))}
      </div>

      <h2>Highest-priority review boundary</h2>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        <div style={{ ...card, borderTop: '2px solid #f59e0b' }}>
          <h3 style={{ color: '#fbbf24', fontSize: 15, marginTop: 0 }}>What green replay does not decide</h3>
          <ol style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.75, paddingLeft: 22, marginBottom: 0 }}>
            {reviewBoundary.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
        <div style={{ ...card, borderTop: '2px solid #ef4444' }}>
          <h3 style={{ color: '#fca5a5', fontSize: 15, marginTop: 0 }}>Implementation scope notes</h3>
          {implementationReviewItems.map((item) => (
            <div key={item.title} style={{ marginBottom: 14 }}>
              <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{item.title}</div>
              <div style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65 }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <h2>Reproducibility boundary</h2>
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7, maxWidth: 900 }}>
        The standalone v3 candidate is pinned by tag <code>{identity.releaseTag}</code>, commit{' '}
        <code>{identity.packageCommit}</code>, tree <code>{identity.releaseTree}</code>, and
        SHA256SUMS hash <code>{identity.sealSha256}</code>. Its exact tested image is{' '}
        <code>{identity.containerImage}</code>. The recorded environment is {environment.base}{' '}
        ({environment.architecture}), FLINT {environment.flint},
        Python {environment.python}, mpmath {environment.mpmath}, and SymPy {environment.sympy}.
        The release seal contains {verification.sealEntryCount} stable entries. The bundled
        referee PDF is {refereePaper.pages} pages, {refereePaper.bytes.toLocaleString()} bytes,
        SHA-256 <code>{refereePaper.sha256}</code>.
      </p>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        <ReplayBlock commands={replay.release} expected={replay.releaseExpected} />
        <ReplayBlock commands={replay.material} expected={replay.materialExpected} />
      </div>
      <div className="card-grid" style={{ marginBottom: 28 }}>
        <a href={verification.mainReplay.url} target="_blank" rel="noopener noreferrer" style={{ ...card, color: '#7dd3fc' }}>
          Main exact-commit replay #{verification.mainReplay.runId}: full review and all 3,149,013 rows passed ↗
        </a>
        <a href={verification.tagImageReplay.url} target="_blank" rel="noopener noreferrer" style={{ ...card, color: '#7dd3fc' }}>
          Tag/image replay #{verification.tagImageReplay.runId}: exact image, critical lanes, and complete replay passed ↗
        </a>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <Link to="/lambda-bounds" style={{ color: '#38bdf8' }}>← Λ Bounds &amp; RH Roadmap</Link>
        <a
          href={identity.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7dd3fc' }}
        >
          Private v3 candidate repository ↗
        </a>
        <a
          href={refereePaper.releaseAssetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fbbf24' }}
        >
          Immutable release PDF ↗
        </a>
        <a
          href={refereePaper.provenancePath}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#7dd3fc' }}
        >
          PDF provenance sidecar ↗
        </a>
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
