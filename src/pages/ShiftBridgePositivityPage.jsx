// ShiftBridgePositivityPage.jsx -- imp-1196
// Editorial (warm post reading-view) presentation of Section 15
// ("Shift-Bridge Reflection Positivity and a Godelian Witness Principle")
// of the user's paper "Twin-Ladder Deformations of xi", carried forward in v70.
// Historic audit provenance remains the v52 PDF pages 22-26; endpoint/common-zero
// corrections come from the v70 audit.
//
// Restyle only. Every claim, number, TeX identity, and caveat is preserved
// verbatim from src/data/shift-bridge-positivity-section.js and the prior page.
// All tripwires live in that data file; this file is pure rendering.

import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import { SHIFT_BRIDGE_POSITIVITY } from '../data/shift-bridge-positivity-section.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';

const S = SHIFT_BRIDGE_POSITIVITY;

function SectionHead({ tag, children }) {
  return (
    <h2>
      <span className="ed-mono" style={{ color: 'var(--faint)', marginRight: 10, fontSize: '0.72em' }}>
        {tag}
      </span>
      {children}
    </h2>
  );
}

function MathStack({ children }) {
  return <div style={{ overflowX: 'auto', margin: '12px 0' }}>{children}</div>;
}

function ConjectureCard({ c, accent }) {
  return (
    <div className="ed-thm" style={{ borderLeftColor: accent, marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="tlab" style={{ color: accent }}>{c.label}</span>
        <span style={{ color: 'var(--ink-soft)', fontSize: 14, fontStyle: 'italic' }}>
          {c.shortName}
        </span>
        {c.equivalentToRH && (
          <span
            className="ed-mono"
            style={{
              marginLeft: 'auto',
              color: 'var(--terra-dk)',
              fontSize: 11,
              border: '1px solid var(--faint)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            equivalent to RH
          </span>
        )}
      </div>
      <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>{c.statement}</p>
      <MathStack>
        <BlockMath tex={c.statementLaTeX} />
      </MathStack>
    </div>
  );
}

export default function ShiftBridgePositivityPage() {
  return (
    <PostLayout
      grade="MAP"
      meta={[
        `§${S.paperSection} · twin-ladder consolidated ${S.paperVersion}`,
        `source lines ${S.paperLineRange[0]}–${S.paperLineRange[1]}`,
        S.ticketId,
      ]}
      title={S.title}
      dek="An RH-equivalent positivity criterion: recenter xi on the critical line, run a one-parameter shift a > 0, and read RH off strict de Branges kernel positivity for every bridge thickness. The a-dial / shift-bridge positivity geometry, with the corrected v70 endpoint and common-zero caveat."
      byline={[
        `Historic audit provenance: ${S.historicalPaperSource}, pages ${S.historicalPaperPageRange[0]}–${S.historicalPaperPageRange[1]}`,
        'shift-bridge positivity',
      ]}
      ticker={<span>reformulation · RH-equivalent conjectures · not a new bound</span>}
      footer={<>
        Related: <Link to="/closure-routes">§16 Closure routes</Link>
        {' · '}<Link to="/sign-switching">Sign switching & bridge energy</Link>
        {' · '}<Link to="/blaschke-ghosts">§17 Blaschke ghosts</Link>
        {' · '}<Link to="/three-attacks">§18 Three attacks</Link>
        {' · '}<Link to="/selberg-trace">Selberg trace</Link>
        {' · '}<Link to="/rh-equivalents">RH equivalents</Link>
        {' · '}<Link to="/literature">Literature</Link>
        <br /><br />← <Link to="/">the atlas</Link>
      </>}
    >
      {/* Verdict (imp-2987): the finite-N* "beat" infrastructure invoked on
          this page is an ESTIMATE gated on the undischargeable C_H, never an
          unconditional finite-N rigorous beat. */}
      <HonestCeilingBanner variant="ESTIMATE" />

      {/* 15.1 — Purpose */}
      <SectionHead tag="15.1">Purpose of this section</SectionHead>
      <p>{S.summary}</p>
      <p>
        <Link to="/sign-switching">Explore the sign geometrically and as an energy balance →</Link>{' '}
        The linked view shows the exact local half-disk / modal-diameter relation and reconstructs the full inward shear as even energy minus odd energy from a known positive boundary kernel. The all-height inequality remains open.
      </p>

      {/* 15.2 — Centered completed function */}
      <SectionHead tag="15.2">
        The centered completed function <InlineMath tex="X(w) := \xi(\tfrac{1}{2} + w)" />
      </SectionHead>
      <p>{S.centeredCompletedFunction.description}</p>
      <MathStack>
        <BlockMath tex={S.centeredCompletedFunction.definitionLaTeX} />
        <BlockMath tex={S.centeredCompletedFunction.evennessLaTeX} />
        <BlockMath tex={S.centeredCompletedFunction.zeroCorrespondenceLaTeX} />
      </MathStack>
      <p>
        The <strong style={{ color: 'var(--terra-dk)' }}>horizontal zero-displacement</strong>{' '}
        parameter:
      </p>
      <MathStack>
        <BlockMath tex={S.centeredCompletedFunction.displacementLaTeX} />
        <BlockMath tex={S.centeredCompletedFunction.classicalStripLaTeX} />
        <BlockMath tex={S.centeredCompletedFunction.rhRestatementLaTeX} />
      </MathStack>

      {/* 15.3 — Shifted bridge */}
      <SectionHead tag="15.3">
        The shifted bridge <InlineMath tex="(E_a, E_a^{\#}, \Theta_a, K_a)" />
      </SectionHead>
      <p>{S.shiftedBridge.description}</p>
      <MathStack>
        <BlockMath tex={S.shiftedBridge.EaLaTeX} />
        <BlockMath tex={S.shiftedBridge.EaSharpLaTeX} />
        <BlockMath tex={S.shiftedBridge.thetaRatioLaTeX} />
        <BlockMath tex={S.shiftedBridge.afterSubstitutionLaTeX} />
        <BlockMath tex={S.shiftedBridge.contractivityLaTeX} />
      </MathStack>
      <p>
        In the original variable <InlineMath tex="s = 1/2 + w" />:
      </p>
      <MathStack>
        <BlockMath tex={S.shiftedBridge.inXiVariableLaTeX} />
      </MathStack>
      <p>
        The de Branges reproducing kernel attached to <InlineMath tex="(E_a, E_a^{\#})" />:
      </p>
      <MathStack>
        <BlockMath tex={S.shiftedBridge.kernelLaTeX} />
      </MathStack>

      {/* 15.4 — Threshold theorem */}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--brass)', marginTop: 24 }}>
        <div className="tlab" style={{ color: 'var(--brass)' }}>{S.thresholdTheorem.label}</div>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>{S.thresholdTheorem.statement}</p>
        <MathStack>
          <BlockMath tex={S.thresholdTheorem.statementLaTeX} />
        </MathStack>
        <div className="ed-lbl" style={{ marginTop: 18, color: 'var(--brass)' }}>Proof sketch</div>
        <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.7 }}>
          {S.thresholdTheorem.proofSketch}
        </p>
        <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>
          Key identity for a same-height pair <InlineMath tex="\delta \pm i\gamma" /> with{' '}
          <InlineMath tex="Q_{\delta,\gamma}(w) = (w - i\gamma)^2 - \delta^2" />,{' '}
          <InlineMath tex="w = x + iy" />, <InlineMath tex="Y = y - \gamma" />:
        </p>
        <MathStack>
          <BlockMath tex={S.thresholdTheorem.keyIdentityLaTeX} />
        </MathStack>
      </div>

      {/* v70 endpoint / common-zero correction */}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--terra-dk)', marginTop: 16 }}>
        <div className="tlab" style={{ color: 'var(--terra-dk)' }}>
          v70 audit · {S.endpointAndCoprimalityCaveat.title}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>{S.endpointAndCoprimalityCaveat.statement}</p>
        <MathStack>
          <BlockMath tex={S.endpointAndCoprimalityCaveat.endpointLaTeX} />
          <BlockMath tex={S.endpointAndCoprimalityCaveat.poleOrderLaTeX} />
        </MathStack>
      </div>

      {/* 15.5 — Godelian witness */}
      <SectionHead tag="15.5">The Godelian witness</SectionHead>
      <p>{S.godelianWitness}</p>
      <MathStack>
        <BlockMath tex={S.godelianWitnessPointLaTeX} />
      </MathStack>

      {/* 15.7 — Prime-delay interpretation */}
      <SectionHead tag="15.7">Prime-delay interpretation</SectionHead>
      <p>{S.primeDelayInterpretation}</p>
      <p>
        Infinitesimal drift form (the <InlineMath tex="a \to 0^+" /> limit of the shift-bridge
        inequality):
      </p>
      <MathStack>
        <BlockMath tex={S.primeDelayDriftLaTeX} />
      </MathStack>
      <p className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>
        domination principle: <em>completed gamma/kernel drift &gt; coherent prime-delay pull</em>
      </p>

      {/* 15.9 — Conjectures 15.2 / 15.3 / 15.4 */}
      <SectionHead tag="15.9">Suggested additions to the conjecture list</SectionHead>
      <p>
        The shift-bridge threshold theorem is unconditional; the three conjectures below are the
        precise RH-equivalent positivity statements it enables.
      </p>
      {S.conjectures.map((c, i) => (
        <ConjectureCard
          key={c.id}
          c={c}
          accent={['var(--brass)', 'var(--terra-dk)', 'var(--ink-soft)'][i % 3]}
        />
      ))}

      {/* Principle 15.5 */}
      <div className="ed-thm" style={{ borderLeftColor: 'var(--ink-soft)', marginTop: 24 }}>
        <div className="tlab" style={{ color: 'var(--ink-soft)' }}>15.5 · {S.principle155.label}</div>
        <p style={{ fontSize: 15, lineHeight: 1.65 }}>{S.principle155.statement}</p>
      </div>

      {/* Why it matters */}
      <h2>Why this section matters for the Λ project</h2>
      {S.whyItMatters.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {/* References */}
      <h2>References</h2>
      <ul style={{ lineHeight: 1.7 }}>
        {S.references.map((ref, i) => (
          <li key={i} style={{ marginBottom: 12 }}>
            <strong>{ref.authors.join(', ')} ({ref.year}).</strong>{' '}
            <em>{ref.title}.</em> {ref.venue}.
            <br />
            <span style={{ color: 'var(--faint)', fontSize: 13 }}>
              role: <code className="ed-mono">{ref.role}</code> — {ref.note}
            </span>
          </li>
        ))}
      </ul>

      {/* Project relevance */}
      <h2>Project tickets touching this material</h2>
      <ul style={{ lineHeight: 1.7 }}>
        {S.projectRelevance.map((p, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <strong className="ed-mono">{p.ticket}</strong> — <em>{p.title}.</em> {p.relation}
          </li>
        ))}
      </ul>

      {/* Sibling sections (16 / 17 / 18) */}
      <h2>Continue to sibling sections carried into v70</h2>
      <ul style={{ lineHeight: 1.7 }}>
        {S.relatedSections.map((r) => (
          <li key={r.ticket} style={{ marginBottom: 10 }}>
            <Link to={r.route}>§{r.paperSection} — {r.label}</Link>{' '}
            <span style={{ color: 'var(--faint)', fontSize: 13 }}>
              (ticket <code className="ed-mono">{r.ticket}</code>)
            </span>
            <br />
            <span style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{r.description}</span>
          </li>
        ))}
      </ul>

      {/* Source footer */}
      <p className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 24 }}>
        Current source: <code>{S.paperSource}</code>, §{S.paperSection} ({S.paperSectionTitle}),
        lines {S.paperLineRange[0]}–{S.paperLineRange[1]}. Historic audit source:{' '}
        <code>{S.historicalPaperSource}</code>, pages {S.historicalPaperPageRange[0]}–
        {S.historicalPaperPageRange[1]}. Correction audit:{' '}
        <code>{S.correctionAuditSource}</code>. Rendered by{' '}
        <code>src/pages/ShiftBridgePositivityPage.jsx</code>; tripwires in{' '}
        <code>src/data/shift-bridge-positivity-section.js</code>.
      </p>
    </PostLayout>
  );
}

