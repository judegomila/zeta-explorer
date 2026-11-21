// CollapseChainPage.jsx — imp-1293 (WAVE 19)
//
// Interactive visualization of the imp-1258 two-way collapse chain.
//
// The entire §15-27 program (7+ named conjectures) reduces to ONE operator-norm statement:
// ‖V_{a,Φ}‖ ≤ 1 for every a > 0.
//
// This page displays:
// - 7-step forward chain: ||V|| ≤ 1 ⇒ CDB-Exist
// - 5-step reverse chain: CDB-Exist ⇒ ||V|| ≤ 1
// - Load-bearing §27 identity highlighted: block-positivity ⇔ K_a ⪰ 0
//
// Editorial (warm) re-theme: full-width shell, identical structure/data/behavior.
// The §26 verdict — ‖V_{a,Φ}‖ ≤ 1 is RH-EQUIVALENT, NOT a reduction below RH — and
// the "margin >5000× is a homogeneity artifact, not evidence" caveat are preserved verbatim.

import React, { useState } from 'react';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { Link } from 'react-router-dom';
import '../styles/collapse-chain.css';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { SECTION26_VERDICT } from '../data/section26-verdict-volterra-not-a-reduction-2026-06-18.js';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import EquivalenceVsReductionCallout from '../components/EquivalenceVsReductionCallout.jsx';
import RelatedLinks from '../components/RelatedLinks.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import StatusNote from '../components/StatusNote.jsx';

// ── Warm palette for chain-node coloring ────────────────────────────────────
// Forward steps: blue. Reverse steps: brass. Load-bearing §27 identity: terra
// (kept visually distinct, as it is the one place the chain can break). Center
// claim: ink (neutral, since it is the RH-equivalent statement itself, not a
// "safe" or "risky" step).
const WARM = {
  forward: 'var(--blue)',
  reverse: 'var(--brass-dk)',
  loadBearing: 'var(--terra-dk)',
  center: 'var(--ink)',
};

// var(...) references can't be alpha-suffixed like hex strings can; keep a
// small hex shadow table so ChainNode can still derive translucent shadows/
// rings per node without hardcoding a shadow per chain step.
const SHADOW_HEX = {
  [WARM.forward]: '63,107,134',
  [WARM.reverse]: '181,138,46',
  [WARM.loadBearing]: '194,58,28',
  [WARM.center]: '28,24,20',
};

function alpha(colorVar, a) {
  const rgb = SHADOW_HEX[colorVar] || '140,110,29';
  return `rgba(${rgb},${a})`;
}

const collapseChain = [
  {
    id: 'forward-1',
    direction: 'forward',
    step: 1,
    title: '‖V‖ ≤ 1 ⇔ Block Positivity',
    statement: String.raw`\begin{bmatrix} I & V \\ V^* & I \end{bmatrix} \succeq 0`,
    reference: 'Schur Complement (Bhatia 1997)',
    description: 'The operator norm bound is equivalent to the Schur complement of the block matrix being positive semidefinite.',
    color: WARM.forward
  },
  {
    id: 'forward-2',
    direction: 'forward',
    step: 2,
    title: 'Block Positivity ⇔ K_a ⪰ 0',
    statement: String.raw`K_a \succeq 0`,
    reference: '§27 Paper Construct (ESSENTIAL)',
    description: 'The unique essential step internal to the paper. Block positivity is equivalent to the kernel operator K_a being positive semidefinite.',
    color: WARM.loadBearing,
    isLoadBearing: true
  },
  {
    id: 'forward-3',
    direction: 'forward',
    step: 3,
    title: 'K_a ⪰ 0 ⇔ E_a Hermite-Biehler',
    statement: String.raw`E_a \text{ is Hermite-Biehler}`,
    reference: 'de Branges 1968, Thm 23',
    description: 'If K_a is positive semidefinite, then the entire function E_a satisfies the Hermite-Biehler property (non-real zeros in upper half-plane only).',
    color: WARM.forward
  },
  {
    id: 'forward-4',
    direction: 'forward',
    step: 4,
    title: 'E_a Hermite-Biehler ⇒ H(E_a) de Branges Space',
    statement: String.raw`H(E_a) \text{ is a de Branges space}`,
    reference: 'de Branges 1968, Thm 19',
    description: 'Every Hermite-Biehler entire function generates a unique de Branges reproducing kernel Hilbert space with kernel K_E(z,w) = (E_a(z)E_a(w)^* - E_a(w)E_a(z)^*) / (2πi(w^* - z)).',
    color: WARM.forward
  },
  {
    id: 'forward-5',
    direction: 'forward',
    step: 5,
    title: 'H(E_a) ⇒ Canonical-System dm_a with Cayley(Θ_a)',
    statement: String.raw`\exists \text{ canonical-system } dm_a, \quad \Theta_a = \text{Cayley}(m_a)`,
    reference: 'de Branges 1968, Thm 40 / Krein 1955 / Romanov 2010',
    description: 'The de Branges space determines a canonical (Hamiltonian) system with Weyl m-function m_a. The Cayley transform of m_a yields the Schur function Θ_a in the unit disk.',
    color: WARM.forward
  },
  {
    id: 'forward-6',
    direction: 'forward',
    step: 6,
    title: 'canonical-system ⇒ CDB-Exist (Non-Circularity Check)',
    statement: String.raw`\exists \text{ de Branges-Krein canonical system with } \Phi\text{-built } dm_a`,
    reference: 'Non-Circularity Audit (imp-1258)',
    description: 'The canonical system dm_a and all intermediate objects (V, K_a, E_a, H(E_a)) are constructed entirely from Φ via integrals. None reference the zero set of ξ. The chain is non-circular.',
    color: WARM.forward
  },
  {
    id: 'midpoint',
    direction: 'center',
    step: 0,
    title: '‖V_{a,Φ}‖ ≤ 1',
    statement: String.raw`\|V_{a,\Phi}\|_{L^2([0,\infty))} \le 1 \quad \forall a > 0`,
    reference: 'Conj 27.2 — RH-Equivalent (NOT a reduction, §26 verdict)',
    description: 'The §15-27 program (7+ conjectures: 16.4, 16.6, 17.3, 18.1, 25.2, 25.3, 26.3, 26.4, 27.2) restates as a single operator-norm statement — but per the §26 verdict this is RH-EQUIVALENT, not a shortcut below RH. The imp-1240 "25 norms all >5000× below 1" margin is a homogeneity artifact (scale-miscalibrated bare operator), NOT evidence for Conj 27.2.',
    color: WARM.center
  },
  {
    id: 'reverse-1',
    direction: 'reverse',
    step: 1,
    title: 'CDB-Exist ⇒ canonical-system dm_a exists',
    statement: String.raw`\text{de Branges-Krein: } \Theta_a = m_a \text{ Cayley}^{-1}`,
    reference: 'de Branges–Krein Bijection (Reverse)',
    description: 'Starting from the de Branges–Krein canonical system with Φ-built measure dm_a, the bijection runs backward.',
    color: WARM.reverse
  },
  {
    id: 'reverse-2',
    direction: 'reverse',
    step: 2,
    title: 'canonical-system ⇒ H(E_a) de Branges Space',
    statement: String.raw`H(E_a) = \text{Image of de Branges-Krein bijection}`,
    reference: 'Krein 1955 / Romanov 2010',
    description: 'The reverse of the de Branges space construction yields the Hermite-Biehler entire function E_a.',
    color: WARM.reverse
  },
  {
    id: 'reverse-3',
    direction: 'reverse',
    step: 3,
    title: 'H(E_a) ⇒ E_a Hermite-Biehler',
    statement: String.raw`E_a \text{ is Hermite-Biehler}`,
    reference: 'de Branges 1968, Thm 19 (Reverse)',
    description: 'Every de Branges space is generated by exactly one Hermite-Biehler entire function.',
    color: WARM.reverse
  },
  {
    id: 'reverse-4',
    direction: 'reverse',
    step: 4,
    title: 'E_a Hermite-Biehler ⇔ K_a ⪰ 0',
    statement: String.raw`K_a \succeq 0`,
    reference: '§27 Paper Construct (ESSENTIAL)',
    description: 'Reverse direction: if E_a is Hermite-Biehler, the kernel K_a is positive semidefinite. This is the same essential §27 identity.',
    color: WARM.loadBearing,
    isLoadBearing: true
  },
  {
    id: 'reverse-5',
    direction: 'reverse',
    step: 5,
    title: 'K_a ⪰ 0 ⇒ ‖V‖ ≤ 1 (Complete Reverse)',
    statement: String.raw`\|V_{a,\Phi}\| \le 1`,
    reference: 'Schur Complement (Bhatia 1997, Reverse)',
    description: 'Positive semidefiniteness of K_a implies block positivity, which is equivalent to ‖V‖ ≤ 1, completing the reverse chain.',
    color: WARM.reverse
  }
];

function ChainNode({ node, isExpanded, onToggle }) {
  const getNodeStyle = () => {
    const baseStyle = {
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: `2px solid ${node.color}`,
      backgroundColor: node.direction === 'center' ? alpha(WARM.center, 0.06) : 'var(--paper2)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative'
    };

    if (node.isLoadBearing) {
      baseStyle.borderWidth = '3px';
      baseStyle.boxShadow = `0 0 0 3px ${alpha(node.color, 0.20)}`;
      baseStyle.backgroundColor = alpha(node.color, 0.07);
    }

    if (isExpanded) {
      baseStyle.boxShadow = `0 4px 12px ${alpha(node.color, 0.28)}`;
    }

    return baseStyle;
  };

  return (
    <div
      className="collapse-chain-node"
      style={getNodeStyle()}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          {node.direction === 'forward' && (
            <div style={{ fontSize: '12px', color: 'var(--faint)', marginBottom: '6px' }}>↓ FORWARD {node.step}/6</div>
          )}
          {node.direction === 'reverse' && (
            <div style={{ fontSize: '12px', color: 'var(--faint)', marginBottom: '6px' }}>↑ REVERSE {node.step}/5</div>
          )}
          {node.direction === 'center' && (
            <div style={{ fontSize: '12px', color: 'var(--faint)', marginBottom: '6px', fontWeight: 'bold' }}>⇔ CENTRAL CLAIM</div>
          )}
          <h3 style={{ margin: '0 0 8px 0', color: node.color, fontSize: '16px', fontWeight: 600 }}>
            {node.title}
          </h3>
        </div>
        <div style={{ marginLeft: '16px', fontSize: '20px', color: 'var(--faint)' }}>
          {isExpanded ? '−' : '+'}
        </div>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'var(--paper)', borderRadius: '4px', fontSize: '13px', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            <BlockMath math={node.statement} />
          </div>
          <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
            <strong style={{ color: node.color }}>Reference:</strong> {node.reference}
            {node.isLoadBearing && <span style={{ color: 'var(--terra-dk)', fontWeight: 'bold' }}> ★ ESSENTIAL</span>}
          </p>
          <p style={{ margin: '8px 0', fontSize: '13px', color: 'var(--faint)', fontStyle: 'italic' }}>
            {node.description}
          </p>
        </div>
      )}
    </div>
  );
}

function Arrow({ direction }) {
  const arrowStyle = {
    textAlign: 'center',
    fontSize: '24px',
    color: 'var(--faint)',
    margin: '8px 0',
    fontWeight: 'bold',
    height: '24px',
    lineHeight: '24px'
  };

  if (direction === 'forward') return <div style={arrowStyle}>↓</div>;
  if (direction === 'reverse') return <div style={arrowStyle}>↑</div>;
  return null;
}

export default function CollapseChainPage() {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['midpoint']));

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const forwardChain = collapseChain.filter(n => n.direction === 'forward');
  const reverseChain = collapseChain.filter(n => n.direction === 'reverse');
  const midpoint = collapseChain.find(n => n.direction === 'center');

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <StatusNote item="hidden-square" recordsFormulation>
          The statement ‖V_{'{'}a,Φ{'}'}‖ ≤ 1 for every a &gt; 0 is false: in the repository’s normalisation it holds
          for a ≤ a* and fails for a ≥ 31.6214, with 31.6213 &lt; a* &lt; 31.6214. It is not equivalent to K_a ≥ 0 in
          either direction (‖V‖ scales as c² under Φ → cΦ; K_a ≥ 0 is scale-invariant), and it holds for the
          Davenport-Heilbronn kernel (‖V‖ = 0.012 to 0.074) on the band of a where that kernel’s K_a is indefinite.
          The §15-27 conjectures are not reduced to it; at least seven of them (15.1, 16.4, 16.6, 17.3, 18.1, 25.2,
          25.3) are separate phrasings of the Hermite-Biehler form of RH, K_a ≥ 0 for every a &gt; 0. The
          RH-equivalent statement is K_a ≥ 0, not ‖V‖ ≤ 1.
        </StatusNote>
        <HonestCeilingBanner variant="RH-EQUIVALENT" />
        <h1 className="ed-h1" style={{ marginBottom: 10 }}>{'The imp-1258 Collapse Chain: ‖V_{a,Φ}‖ ≤ 1 ⇔ CDB-Exist'}</h1>
        <p className="ed-lbl">Related: <Link to="/volterra-bound">Volterra norm bound ‖V‖ ≤ 1</Link></p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, maxWidth: 720, marginBottom: 16, lineHeight: 1.6 }}>
          The entire §15-27 program (7+ named conjectures) is RH-equivalent to one operator-norm
          statement: <strong>‖V&#x200B;_{'{'}a,Φ{'}'}</strong> &le; 1 for every a &gt; 0.
          Interactive forward (7-step) and reverse (5-step) chains shown below.
        </p>

        <AnimationEmbed id="collapse-chain" />

        <div style={{ backgroundColor: 'color-mix(in srgb, var(--series-2) 8%, transparent)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid var(--terra-dk)' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold', color: 'var(--terra-dk)' }}>
            ⚠ REFUTED AS A REDUCTION (§26 verdict, {SECTION26_VERDICT.date})
          </p>
          <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
            The bare-Volterra biconditional <InlineMath math="\|V_{a,\Phi}\| \le 1 \Leftrightarrow K_a \succeq 0" /> is
            {' '}<strong>{SECTION26_VERDICT.bareBiconditional}</strong>. The chain below is <strong>RH-equivalent, not a shortcut</strong>:
            the surviving sub-problem faithfully restates <InlineMath math="K_a \succeq 0" /> and does not collapse the difficulty below RH.
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--faint)' }}>
            The historical &ldquo;5000× below 1&rdquo; margin (imp-1240) is a homogeneity artifact measuring the scale-miscalibrated bare operator — NOT evidence for Conj 27.2.
            See the full §26 verdict at the foot of this page.
          </p>
        </div>

        <EquivalenceVsReductionCallout />

        <div style={{ backgroundColor: 'var(--paper2)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--hairline)', borderLeft: '4px solid var(--blue)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--ink)' }}>
            <strong>Summary (pre-refutation framing — see red banner above):</strong> The §15-27 program of the Twin-Ladder paper
            restates as a single operator-norm statement. Seven conjectures (16.4, 16.6, 17.3, 18.1, 25.2, 25.3, 26.3, 26.4, 27.2)
            collapse into the claim that
            {' '}<InlineMath math="\|V_{a,\Phi}\|_{L^2([0,\infty))} \le 1" /> for every <InlineMath math="a > 0" />.
            {' '}<strong>Per the §26 verdict this restatement is RH-equivalent, not a reduction below RH.</strong>
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
            The imp-1240 figure — 25 truncated operator norms all &gt;5000× below the threshold 1 — is a
            {' '}<strong>homogeneity artifact</strong> measuring the scale-miscalibrated bare operator, NOT empirical support for Conj 27.2.
            The chain is non-circular (every object is constructed from <InlineMath math="\Phi" /> via integrals, with no reference to the zero set of <InlineMath math="\xi" />), but non-circularity does not make it a shortcut.
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 className="ed-h2" style={{ fontSize: '18px', color: 'var(--blue)', marginBottom: '12px' }}>Forward Chain: ‖V‖ ≤ 1 ⇒ CDB-Exist</h2>
          {forwardChain.map((node, idx) => (
            <div key={node.id}>
              <ChainNode
                node={node}
                isExpanded={expandedNodes.has(node.id)}
                onToggle={() => toggleNode(node.id)}
              />
              {idx < forwardChain.length - 1 && <Arrow direction="forward" />}
            </div>
          ))}
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: alpha(WARM.reverse, 0.10),
          borderRadius: '8px',
          marginBottom: '30px',
          border: '2px solid var(--brass)',
          textAlign: 'center'
        }}>
          <ChainNode
            node={midpoint}
            isExpanded={expandedNodes.has('midpoint')}
            onToggle={() => toggleNode('midpoint')}
          />
        </div>

        <div>
          <h2 className="ed-h2" style={{ fontSize: '18px', color: 'var(--brass-dk)', marginBottom: '12px' }}>Reverse Chain: CDB-Exist ⇒ ‖V‖ ≤ 1</h2>
          {reverseChain.map((node, idx) => (
            <div key={node.id}>
              <ChainNode
                node={node}
                isExpanded={expandedNodes.has(node.id)}
                onToggle={() => toggleNode(node.id)}
              />
              {idx < reverseChain.length - 1 && <Arrow direction="reverse" />}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: alpha(WARM.reverse, 0.08), borderRadius: '8px', border: '1px solid var(--brass)' }}>
          <h3 style={{ fontSize: '14px', marginTop: '0', color: 'var(--brass-dk)' }}>§26 Verdict ({SECTION26_VERDICT.date}): Route Ruled Out as a Reduction</h3>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '4px 0' }}>
            <strong>{SECTION26_VERDICT.verdict}</strong>
          </p>
          <p style={{ fontSize: '12px', color: 'var(--brass-dk)', margin: '8px 0 0 0' }}>
            The &ldquo;5000x from saturation&rdquo; result was a homogeneity artifact — imp-1240 measured the wrong (scale-miscalibrated) operator.
            The surviving target (normalized relative operator R) is RH-equivalent, not a shortcut.
          </p>
        </div>

        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--paper2)', borderRadius: '8px', border: '1px solid var(--hairline)' }}>
          <h3 style={{ fontSize: '14px', marginTop: '0', color: 'var(--ink)' }}>Scope &amp; Risk</h3>
          <ul style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '8px 0' }}>
            <li>
              <strong>§27 construct identity is essential.</strong> If §25-26-27 has a gap in the identity
              {' '}<InlineMath math="\text{block positivity} \Leftrightarrow K_a \succeq 0" />, one direction loses.
            </li>
            <li>
              <strong>⚠ Superseded — the ‖V‖ ≤ 1 collapse is RH-equivalent, and the PCC caveat was a mis-attribution.</strong>{' '}
              The §26 verdict found the ‖V‖ ≤ 1 biconditional to be <em>RH-equivalent / tautological</em> (an information-preserving
              restatement, not a reduction to a cheaper problem; the 5000× empirical margin was a scale-homogeneity artifact). And the
              strategic PCC-free severance showed the Volterra/de&nbsp;Branges strand does <strong>not</strong> factor through Montgomery
              pair correlation — the earlier "still requires Montgomery PCC at 2-point" (imp-1184) was mis-attributed to this strand.
              The strand's true residual is the operator positivity <InlineMath math="K_a \succeq 0" />, itself RH-equivalent.
            </li>
            <li>
              <strong>Empirical pilot at finite window.</strong> imp-1240's data (U ≤ 20, a ≥ 0.025) measured the
              scale-miscalibrated bare operator; its below-1 norms are a homogeneity artifact and carry no evidentiary
              weight for Conjecture 27.2.
            </li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', fontSize: '13px', color: 'var(--ink-soft)', borderTop: '1px solid var(--hairline)', paddingTop: '20px' }}>
          <p>
            <strong>References:</strong>{' '}
            <Link to="/viz-volterra-norm-curve" style={{ color: 'var(--brass-dk)' }}>Volterra Norm Curve</Link> (imp-1292) •
            {' '}<Link to="/paper-audit-dashboard" style={{ color: 'var(--brass-dk)' }}>Paper Audit Dashboard</Link> (imp-1265) •
            {' '}<Link to="/twin-ladder" style={{ color: 'var(--brass-dk)' }}>Twin-Ladder Paper Roadmap</Link>
          </p>
          <p style={{ margin: '8px 0 0 0' }}>
            Decision doc: <code>/thinking/decisions/2026-05-28-volterra-cdb-two-way-collapse.md</code> (imp-1258)
          </p>
          <p style={{ margin: '12px 0 0 0' }}>
            <Link to="/">← the atlas</Link>
          </p>
        </div>

        <RelatedLinks links={[
          { to: '/volterra-bound', label: 'Volterra Bound Hub', color: 'var(--brass)' },
          { to: '/route-map', label: 'Route Map', color: 'var(--blue)' },
          { to: '/twin-ladder', label: 'Twin-Ladder Roadmap', color: 'var(--brass-dk)' },
          { to: '/paper-audit-dashboard', label: 'Paper Audit Dashboard', color: 'var(--terra-dk)' },
          { to: '/hidden-square-program', label: 'Hidden Square Program', color: 'var(--green)' },
          { to: '/section26-conditioning-artifact', label: '§26 Conditioning Artifact', color: 'var(--terra)' },
          { to: '/permutation-architecture', label: 'Permutation Architecture', color: 'var(--blue)' },
        ]} />
      </div>
    </div>
  );
}
