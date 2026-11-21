import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Pull, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import { NEWMAN_LAMBDA_01787854_CANDIDATE as CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

/* Editorial (post reading-view) presentation of the Λ ≤ 0.1787854 unrefereed
   proof candidate (reviewed by Dan Romik, publicly posted (judegomila.com/posts/riemann-lambda-0.1787854)).
   All numbers, bounds, and caveats are sourced verbatim from
   src/data/newman-lambda-01787854-candidate.js and the prior page; this file
   only restyles them. It makes no mathematical claim of its own — the bound
   is a computer-assisted candidate, not an established theorem. */

const cell = {
  border: '1px solid var(--hairline)',
  borderRadius: 8,
  padding: '13px 15px',
  background: 'var(--paper)',
};

function Stat({ label, value }) {
  return (
    <div style={cell}>
      <div className="ed-lbl">{label}</div>
      <div className="ed-mono" style={{ marginTop: 6, fontWeight: 700, fontSize: 15, overflowWrap: 'anywhere' }}>
        {value}
      </div>
    </div>
  );
}

function ReplayBlock({ commands, expected }) {
  return (
    <div style={{ ...cell, overflowX: 'auto' }}>
      <pre className="ed-mono" style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, whiteSpace: 'pre' }}>
        {commands.join('\n')}
      </pre>
      <div className="ed-mono" style={{ fontSize: 12, marginTop: 10, color: 'var(--brass)' }}>
        expected: {expected}
      </div>
    </div>
  );
}

const grid = (min = 220) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap: 14,
  margin: '18px 0 26px',
});

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
    <PostLayout
      grade="CANDIDATE"
      meta={['proof candidate', 'intended unconditional form', 'reviewed by Dan Romik · unrefereed']}
      title="Λ ≤ 0.1787854 — Unrefereed Proof Candidate"
      dek={
        'A sealed computer-assisted package proposing an unconditional proof. Its intended ' +
        'argument assumes no unproved conjecture. The package has been reviewed by Dan Romik ' +
        'and is publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); it has not been peer-reviewed, so the ' +
        'proposed bound is not an established theorem.'
      }
      byline={['de Bruijn–Newman · exploreriemann', 'computer-assisted · unrefereed']}
      footer={<>
        <a href={refereePaper.publicPath} target="_blank" rel="noreferrer">Read the v3 referee PDF ({refereePaper.pages} pages)</a>
        {' · '}<a href={refereePaper.releaseAssetUrl} target="_blank" rel="noreferrer">Immutable release PDF</a>
        {' · '}<a href={refereePaper.provenancePath} target="_blank" rel="noreferrer">PDF provenance sidecar</a>
        {' · '}<a href={identity.repositoryUrl} target="_blank" rel="noreferrer">v3 candidate repository</a>
        <br /><br />
        Related: <Link to="/lambda-01758354-candidate">Λ ≤ 0.1758354 candidate</Link>
        {' · '}<Link to="/lambda-bounds">Λ Bounds &amp; RH Roadmap</Link>
        {' · '}<Link to="/state-of-program">State of the Program</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)' }}>
        <div className="tlab">Candidate for an unconditional proof — bound not established</div>
        <p>
          The immutable v3 release supplies proposed compact-slab, final-time half-strip, verified-height,
          finite, tail, and criterion-weld interfaces, and its exact-commit replay jobs are green. Those
          facts establish artifact integrity and encoded predicates, not independent mathematical validity.
          The candidate is positive; RH would require Λ ≤ 0.
        </p>
      </div>

      <p className="lead">
        This page restyles the sealed v3 review package. Two axes are kept separate: the proposed proof
        has an unconditional logical form, and the package is still a proof candidate.
      </p>

      <AnimationEmbed id="zetasota" />
      <AnimationEmbed id="certificate-anatomy" />

      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)' }}>
        <div className="tlab">Unrefereed candidate · reviewed by Dan Romik · publicly posted (judegomila.com/posts/riemann-lambda-0.1787854)</div>
        <BlockMath tex="\boxed{\Lambda\le\frac{893927}{5000000}=0.1787854}" />
        <BlockMath tex={exactTarget.identityTex} />
        <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
          Exact candidate row: <InlineMath tex={`X=${exactTarget.X}`} />,{' '}
          <InlineMath tex="t_0=129/800" />, and{' '}
          <InlineMath tex="y_0^2=87677/2500000" />. If the three proposed criterion
          suppliers and their weld survive independent review, Theorem 1.2 would yield
          the displayed bound. The package does not presently establish it.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
          <a href={refereePaper.publicPath} target="_blank" rel="noreferrer">Read the v3 referee PDF ({refereePaper.pages} pages)</a>
          <a href={identity.releaseUrl} target="_blank" rel="noreferrer">Open immutable {identity.releaseTag}</a>
        </div>
      </div>

      <div style={grid(180)}>
        <Stat label="finite rows" value={finiteEvidence.rowCount.toLocaleString()} />
        <Stat label="finite N range" value={`${finiteEvidence.firstN.toLocaleString()}–${finiteEvidence.lastN.toLocaleString()}`} />
        <Stat label="encoded finite slack ≥" value="5.57871094787×10⁻⁷" />
        <Stat label="tail slack >" value="1.735209373337×10⁻⁴" />
        <Stat label="barrier error <" value={barrierEvidence.effectiveErrorUpperBoundLiteral} />
        <Stat label="immutable release" value={identity.releaseTag} />
      </div>

      <h2>Proposed zero-free regions</h2>
      <div style={grid(300)}>
        <div style={{ ...cell, borderTop: '2px solid var(--brass)' }}>
          <h3 style={{ marginTop: 0 }}>Candidate compact slab</h3>
          <BlockMath tex={certifiedRegions.compactSlab.theoremTex} />
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 0 }}>
            The encoded domain includes all space and time endpoints. The repaired Arb barrier covers{' '}
            {certifiedRegions.compactSlab.prismCount} closed prisms; its minimum strict-margin
            lower endpoint is {certifiedRegions.compactSlab.minimumStrictMargin}. A referee must
            still validate the derivative, interpolation, winding, and continuity arguments.
          </p>
        </div>
        <div style={{ ...cell, borderTop: '2px solid var(--terra-dk)' }}>
          <h3 style={{ marginTop: 0 }}>Candidate final-time half-strip</h3>
          <BlockMath tex={certifiedRegions.finalTimeHalfStrip.theoremTex} />
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 0 }}>
            Here <InlineMath tex={`x_0=${certifiedRegions.finalTimeHalfStrip.x0Tex}`} />. Symmetry gives{' '}
            <InlineMath tex={certifiedRegions.finalTimeHalfStrip.symmetricTex} />. No claim is made
            below <InlineMath tex="|\Im z|<y_0" />. This is a proposed theorem supplier,
            not an independently accepted zero-free theorem.
          </p>
        </div>
      </div>

      <h2>Certificate evidence</h2>
      <p>
        The v3 full replay reproduced every integer in the closed range with no gaps,
        duplicates, nonpositive rows, or <code>UNCERT</code> rows. A direct Arb
        upper-Dini calculation covers all active divisor patterns at 180 and 256
        bits and controls the exact Triangle mass across the full height interval.
        Separate 256- and 512-bit Arb certificates apply the conservative
        coefficient 10.50 = 3.58 + 6.92 to the finite and tail errors. These are
        verified execution facts relative to the released code and libraries.
      </p>

      <div style={{ overflowX: 'auto', margin: '14px 0 24px' }}>
        <table className="ed-mono" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 800, fontSize: 13 }}>
          <thead>
            <tr style={{ color: 'var(--faint)', textAlign: 'left', borderBottom: '1px solid var(--hairline)' }}>
              <th style={{ padding: '8px 12px' }}>N range</th>
              <th style={{ padding: '8px 12px' }}>Auxiliary primes</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>min T<sub>N</sub></th>
            </tr>
          </thead>
          <tbody>
            {finiteEvidence.primeSetBands.map((band) => (
              <tr key={band.range} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '8px 12px', color: 'var(--ink)' }}>{band.range}</td>
                <td style={{ padding: '8px 12px', color: 'var(--brass)' }}>{band.primes}</td>
                <td style={{ padding: '8px 12px', color: 'var(--ink)', textAlign: 'right' }}>
                  {band.minTriangle}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={grid(300)}>
        <div style={{ ...cell, borderTop: '2px solid var(--brass)' }}>
          <h3 style={{ marginTop: 0 }}>Direct all-height gate</h3>
          <ul style={{ fontSize: 13.5, lineHeight: 1.75, paddingLeft: 20, marginBottom: 0, color: 'var(--ink-soft)' }}>
            <li>Arb precision: {finiteEvidence.dini.precisionsBits.join(' and ')} bits</li>
            <li>Pattern counts: {finiteEvidence.dini.divisorPatternCounts.join(', ')}</li>
            <li>Worst Dini ratio: {finiteEvidence.dini.worstCertifiedRatioLiteral} &lt; 1</li>
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
        <div style={{ ...cell, borderTop: '2px solid var(--terra-dk)' }}>
          <h3 style={{ marginTop: 0 }}>Tail and height gate</h3>
          <ul style={{ fontSize: 13.5, lineHeight: 1.75, paddingLeft: 20, marginBottom: 0, color: 'var(--ink-soft)' }}>
            <li>{tailEvidence.checksPassed}/{tailEvidence.checksTotal} checks per precision at {tailEvidence.precisionsBits.join(' and ')} bits</li>
            <li>D ≤ {tailEvidence.contractionUpperBoundLiteral} &lt; 1</li>
            <li>flow ≥ {tailEvidence.flowLowerBound}</li>
            <li>error ≤ {tailEvidence.errorUpperBound}</li>
            <li><InlineMath tex="X/2\le T_{\rm PT}" /> with T<sub>PT</sub> = {verifiedHeight.TPT}</li>
          </ul>
        </div>
      </div>

      <h2>Eight supplied interfaces — mathematical review still open</h2>
      <p>
        The package now supplies an explicit artifact for each formerly missing interface.
        “Supplied and sealed” does not mean “independently proved”: the external reviewer
        must check the mathematical reductions and their implementation separately.
      </p>
      <div style={grid(260)}>
        {closedAuditItems.map((item, index) => (
          <div key={item.title} style={{ ...cell, borderLeft: '3px solid var(--brass)' }}>
            <div className="ed-mono" style={{ color: 'var(--brass)', fontSize: 11, marginBottom: 6 }}>
              V3 INTERFACE {index + 1} · {item.status}
            </div>
            <h3 style={{ fontSize: 15, margin: '0 0 7px' }}>{item.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.65, margin: 0, color: 'var(--ink-soft)' }}>{item.detail}</p>
          </div>
        ))}
      </div>

      <h2>Highest-priority review boundary</h2>
      <div style={grid(300)}>
        <div style={{ ...cell, borderTop: '2px solid var(--brass)' }}>
          <h3 style={{ marginTop: 0 }}>What green replay does not decide</h3>
          <ol style={{ fontSize: 13.5, lineHeight: 1.75, paddingLeft: 22, marginBottom: 0, color: 'var(--ink-soft)' }}>
            {reviewBoundary.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
        <div style={{ ...cell, borderTop: '2px solid var(--terra-dk)' }}>
          <h3 style={{ marginTop: 0 }}>Implementation scope notes</h3>
          {implementationReviewItems.map((item) => (
            <div key={item.title} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{item.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <Pull>The candidate is positive; RH would require Λ ≤ 0.</Pull>

      <h2>Reproducibility boundary</h2>
      <p>
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
      <div style={grid(320)}>
        <ReplayBlock commands={replay.release} expected={replay.releaseExpected} />
        <ReplayBlock commands={replay.material} expected={replay.materialExpected} />
      </div>
      <div style={grid(320)}>
        <a href={verification.mainReplay.url} target="_blank" rel="noreferrer" style={cell}>
          Main exact-commit replay #{verification.mainReplay.runId}: full review and all 3,149,013 rows passed ↗
        </a>
        <a href={verification.tagImageReplay.url} target="_blank" rel="noreferrer" style={cell}>
          Tag/image replay #{verification.tagImageReplay.runId}: exact image, critical lanes, and complete replay passed ↗
        </a>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 24 }}>
        <a href={identity.repositoryUrl} target="_blank" rel="noreferrer">v3 candidate repository ↗</a>
        <a href={refereePaper.releaseAssetUrl} target="_blank" rel="noreferrer">Immutable release PDF ↗</a>
        <a href={refereePaper.provenancePath} target="_blank" rel="noreferrer">PDF provenance sidecar ↗</a>
        <a href="https://doi.org/10.5281/zenodo.21175533" target="_blank" rel="noreferrer">Public 0.1875 certificate package ↗</a>
      </div>
    </PostLayout>
  );
}
