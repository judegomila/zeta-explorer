import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { ED } from '../styles/tokens.js';

/**
 * Interactive Proof Explorer (imp-091)
 *
 * Each of the 10 proof steps is a clickable card. Clicking expands to show:
 * - The mathematical claim
 * - The theorem/reference used
 * - A live computation verifying the step
 * - Confidence level
 * - Gap assessment (if any)
 *
 * Editorial (warm) re-theme: full-width layout, identical structure/data/logic.
 */

// ── Lazy computation runners ─────────────────────────────────────────────────

function useAsyncComputation(computeFn, deps) {
  const [state, setState] = useState({ loading: false, result: null, error: null });

  const run = useCallback(() => {
    setState({ loading: true, result: null, error: null });
    Promise.resolve().then(async () => {
      try {
        const result = await computeFn();
        setState({ loading: false, result, error: null });
      } catch (err) {
        setState({ loading: false, result: null, error: err.message });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, run };
}

// ── Proof step definitions ───────────────────────────────────────────────────

const PROOF_STEPS = [
  {
    id: 'S1',
    title: 'Physical-proxy matrix structure',
    claim: 'Each displayed trigonometric LC proxy T_p has determinant one; it is not the Euler-factor embedding.',
    formula: '\\det(T_p) = \\cos^2(\\omega\\log p) + \\sin^2(\\omega\\log p) = 1',
    theorem: 'Pythagorean identity',
    reference: 'Elementary trigonometry',
    confidence: 1.0,
    status: 'proven',
    gap: null,
    color: ED.series3,
    computeLabel: 'Verify det(T_p) = 1 for first 20 primes',
    compute: async () => {
      const { getPrimes } = await import('../math/primes.js');
      const primes = getPrimes(20);
      const results = primes.map(p => {
        const logP = Math.log(p);
        const omega = 14.13;
        const arg = omega * logP;
        const det = Math.cos(arg) ** 2 + Math.sin(arg) ** 2;
        return { p, det: +det.toFixed(12), pass: Math.abs(det - 1) < 1e-10 };
      });
      return { allPass: results.every(r => r.pass), results };
    },
  },
  {
    id: 'S2',
    title: 'Physical-proxy product determinant',
    claim: 'For finite products of those LC proxy matrices, det(S_N) = Π det(T_{p_k}) = 1.',
    formula: '\\det(S_N) = \\prod_{k=1}^N \\det(T_{p_k}) = 1^N = 1',
    theorem: 'Multiplicativity of determinant',
    reference: 'Linear algebra: det(AB) = det(A)·det(B)',
    confidence: 1.0,
    status: 'proven',
    gap: null,
    color: ED.series3,
    computeLabel: 'Verify det(S_N) = 1 for N = 10, 50, 100, 200',
    compute: async () => {
      const { getPrimes } = await import('../math/primes.js');
      const results = [10, 50, 100, 200].map(N => {
        const primes = getPrimes(N);
        let S = [[1, 0], [0, 1]];
        for (const p of primes) {
          const logP = Math.log(p);
          const arg = 14.13 * logP;
          const c = Math.cos(arg), s = Math.sin(arg), Zp = 1 / logP;
          const T = [[c, Zp * s], [-s / Zp, c]];
          S = [[S[0][0]*T[0][0]+S[0][1]*T[1][0], S[0][0]*T[0][1]+S[0][1]*T[1][1]],
               [S[1][0]*T[0][0]+S[1][1]*T[1][0], S[1][0]*T[0][1]+S[1][1]*T[1][1]]];
        }
        const det = S[0][0] * S[1][1] - S[0][1] * S[1][0];
        return { N, det: +det.toFixed(10), pass: Math.abs(det - 1) < 1e-6 };
      });
      return { allPass: results.every(r => r.pass), results };
    },
  },
  {
    id: 'S3',
    title: 'Physical-cascade convergence claim (refuted)',
    claim: 'The displayed undamped physical factors do not support a Cauchy limit for their partial products.',
    formula: 'S_{N+1}=S_NT_{p_{N+1}},\\quad S_N\\to S_\\infty\\in GL_2\\Longrightarrow T_{p_{N+1}}\\to I',
    theorem: 'Necessary condition for convergence of products to an invertible limit',
    reference: 'Direct factor-limit audit of the physical LC proxy',
    confidence: 0,
    status: 'refuted',
    gap:
      'Here T_p has entries cos(log p), sin(log p)/log p, and −log p·sin(log p); it does not approach the identity. The former 200-step tail-sum test used the vacuous condition tailSum < 1e6 and has been removed.',
    color: ED.accent,
  },
  {
    id: 'S4',
    title: 'SL(2,ℝ) Closure',
    claim: 'If the matrix sequence converges, det(S_∞) = 1 because SL(2,ℝ) is closed.',
    formula: '\\operatorname{SL}(2,\\mathbb{R}) = \\det^{-1}(\\{1\\}) \\text{ is closed}',
    theorem: 'Preimage of closed set under continuous map is closed',
    reference: 'sl2r-closure.js (imp-093)',
    confidence: 0.75,
    status: 'conditional',
    gap: 'The closure theorem is exact, but it cannot be applied to the displayed physical factors because the S3 convergence premise is refuted.',
    color: ED.series3,
    computeLabel: 'Verify det continuity (Lipschitz bound)',
    compute: async () => {
      const { sl2rClosureProof } = await import('../math/sl2r-closure.js');
      const result = sl2rClosureProof();
      return {
        lipschitzHolds: result.detContinuity.allBoundsHold,
        limitsInSL2R: result.sl2rClosed.allLimitsInSL2R,
        steps: result.proofChain.filter(s => s.verified).length + '/' + result.proofChain.length,
      };
    },
  },
  {
    id: 'S5',
    title: 'Model Mertens Deficit Bound',
    claim: 'A selected model deficit obeys an O(1/log P) upper bound.',
    formula: '\\delta(P) \\leq \\frac{4}{\\gamma_1^2 \\log^2 P} + \\frac{1}{\\log P} + \\frac{2.51}{\\sqrt{P}\\log P} + \\frac{1}{P}',
    theorem: 'Mertens (1874) + Rosser-Schoenfeld (1962)',
    reference: 'rigorous-mertens.js (imp-084)',
    confidence: 0.45,
    status: 'model-only',
    gap: 'The bound has not been shown to equal the unitarity deficit of a realizable analytic continuation of the cascade.',
    color: ED.series3,
    computeLabel: 'Compute δ(P) at P = 100, 10⁴, 10⁶, 10⁸',
    compute: async () => {
      const gamma1 = 14.134725141734693;
      const M3 = 2.51012;
      return [100, 10000, 1e6, 1e8].map(P => {
        const logP = Math.log(P);
        const delta = 4/(gamma1**2*logP**2) + 1/logP + M3/(Math.sqrt(P)*logP) + 1/P;
        return { P, delta: +delta.toExponential(4), logP: +logP.toFixed(2) };
      });
    },
  },
  {
    id: 'S6',
    title: 'Conditional Inherited Unitarity',
    claim: 'If S_N → S_∞ and the actual deficits tend to zero, sequential continuity gives δ(S_∞) = 0.',
    formula: 'S \\mapsto \\|S^\\top S - I\\| \\text{ is continuous; } \\delta(S_N) \\to 0 \\Rightarrow \\delta(S_\\infty) = 0',
    theorem: 'Sequential continuity',
    reference: 'inherited-unitarity.js (imp-096)',
    confidence: 0.6,
    status: 'conditional',
    gap: 'Both convergence and identification of the model deficit with the cascade deficit are required premises.',
    color: ED.series3,
    computeLabel: 'Verify orthogonality SᵀS ≈ I for cascade',
    compute: async () => {
      const { inheritedUnitarityProof } = await import('../math/inherited-unitarity.js');
      const r = inheritedUnitarityProof();
      return {
        allOrthogonal: r.unitarityClosure.allOrthogonal,
        allSO2: r.unitarityClosure.allInSO2,
        samples: r.cascadeResults.slice(0, 2).map(c => ({
          omega: c.omega, deficitsDecay: c.deficitsDecay,
        })),
      };
    },
  },
  {
    id: 'S7',
    title: 'S_∞ ∈ SO(2)',
    claim: 'Conditionally, det = 1 plus orthogonality would place a matrix limit in SO(2).',
    formula: 'S_\\infty \\in O(2) \\cap \\operatorname{SL}(2,\\mathbb{R}) = \\operatorname{SO}(2)',
    theorem: 'Definition of SO(2)',
    reference: 'Combination of Steps 4 + 6',
    confidence: 0.55,
    status: 'conditional',
    gap: 'A matrix in SO(2) is not by itself a proved causal, analytic, physically realizable two-port transfer function.',
    color: ED.series3,
    computeLabel: null,
    compute: null,
  },
  {
    id: 'S8',
    title: 'Separate algebraic embedding',
    claim: 'For M_p=[[1,p^{-s}],[p^{-s},1]], finite-product induction gives S₂₁^(A)(s) = ζ(2s)/ζ(s); this is not the physical LC product in S1–S3.',
    formula: 'S_{21}(s)\\,\\zeta(s)=\\zeta(2s)',
    theorem: 'Finite-product induction plus the Euler product',
    reference: 's21-euler-induction.js (imp-121); physical-cascade-induction.js (imp-134)',
    confidence: 1.0,
    status: 'proven',
    gap: 'Common numerator/denominator zeros require residual multiplicity. No realization theorem identifies this algebraic embedding with the physical proxy.',
    color: ED.series3,
    computeLabel: null,
    compute: null,
  },
  {
    id: 'S9',
    title: 'Darlington Zero/Pole Obstruction',
    claim: 'Darlington addresses transmission zeros, whereas RH zeros occur as poles of this S₂₁.',
    formula: '\\zeta(s_0)=0,\\ \\zeta(2s_0)\\ne0 \\;\\Longrightarrow\\; S_{21}\\text{ has a pole at }s_0',
    theorem: 'Darlington synthesis theorem (1939)',
    reference: 'S. Darlington, J. Math. Phys. 18 (1939), 257–353',
    confidence: 1.0,
    status: 'blocked',
    gap: 'A valid pole-confinement or reciprocal-transfer theorem is missing, in addition to infinite-network realizability.',
    color: ED.accent,
    computeLabel: null,
    compute: null,
  },
  {
    id: 'ALT',
    title: 'Alternative: Trotter-Kato / Lax-Phillips',
    claim: 'A possible operator route requires generator/domain control, resolvent convergence, and a separate identification of the resulting scattering divisor with ζ.',
    formula: '(H_N - z)^{-1} \\to (H_\\infty - z)^{-1} \\;\\Longrightarrow\\; e^{iH_N t} \\to e^{iH_\\infty t}',
    theorem: 'Trotter-Kato (1958) + Lax-Phillips (1967)',
    reference: 'gronwall-semigroup.js (imp-094)',
    confidence: 0.3,
    status: 'conditional',
    gap: 'Finite numerical resolvent diagnostics do not verify the Trotter-Kato hypotheses, construct Lax-Phillips incoming/outgoing spaces, or identify/constrain the ζ divisor.',
    color: ED.series5,
    computeLabel: null,
    compute: null,
  },
];

// ── Step card component ──────────────────────────────────────────────────────

function ProofStepCard({ step }) {
  const [expanded, setExpanded] = useState(false);
  const computation = useAsyncComputation(step.compute || (() => null), []);

  return (
    <div style={{
      marginBottom: 12,
      borderRadius: 8,
      border: `1px solid ${step.color}30`,
      background: expanded ? `${step.color}10` : 'var(--paper2)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}>
      {/* Header — always visible */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); }}}
        onClick={() => setExpanded(!expanded)} style={{
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: '50%',
          background: `${step.color}20`, color: step.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0,
        }}>{step.id}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 600 }}>
            {step.title}
          </div>
          <div style={{ color: 'var(--ink-soft)', fontSize: 12, marginTop: 2 }}>
            {step.claim}
          </div>
        </div>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
          background: step.status === 'proven' || step.status === 'proven (classical)'
            ? 'color-mix(in srgb, var(--series-3) 15%, transparent)' : step.status === 'numerical'
              ? 'color-mix(in srgb, var(--brass-deco) 15%, transparent)' : step.status === 'refuted'
                ? 'color-mix(in srgb, var(--series-2) 15%, transparent)' : 'color-mix(in srgb, var(--series-1) 15%, transparent)',
          color: step.status === 'proven' || step.status === 'proven (classical)'
            ? 'var(--green)' : step.status === 'numerical' ? 'var(--brass-dk)'
              : step.status === 'refuted' ? 'var(--terra-dk)' : 'var(--blue)',
        }}>
          {step.status.toUpperCase()}
        </span>
        <span style={{ color: 'var(--faint)', fontSize: 18 }}>{expanded ? '▾' : '▸'}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ padding: '0 16px 16px 56px', fontSize: 13 }}>
          <div style={{ marginBottom: 12 }}>
            <BlockMath tex={step.formula} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ color: 'var(--faint)', fontSize: 11, marginBottom: 4 }}>THEOREM</div>
              <div style={{ color: 'var(--ink-soft)' }}>{step.theorem}</div>
            </div>
            <div>
              <div style={{ color: 'var(--faint)', fontSize: 11, marginBottom: 4 }}>REFERENCE</div>
              <div style={{ color: 'var(--ink-soft)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 11 }}>{step.reference}</div>
            </div>
          </div>

          {step.gap && (
            <div style={{
              padding: '8px 12px', borderRadius: 6, marginBottom: 12,
              background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--brass-deco) 30%, transparent)',
            }}>
              <div style={{ color: 'var(--brass-dk)', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>GAP</div>
              <div style={{ color: 'var(--brass-dk)', fontSize: 12, lineHeight: 1.6 }}>{step.gap}</div>
            </div>
          )}

          {/* Live computation */}
          {step.compute && (
            <div style={{
              padding: '8px 12px', borderRadius: 6,
              background: 'color-mix(in srgb, var(--series-1) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--series-1) 15%, transparent)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ color: 'var(--blue)', fontSize: 11, fontWeight: 600 }}>LIVE VERIFICATION</div>
                <button onClick={(e) => { e.stopPropagation(); computation.run(); }}
                  disabled={computation.loading}
                  style={{
                    padding: '2px 10px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
                    background: 'color-mix(in srgb, var(--series-1) 16%, transparent)', color: 'var(--blue)',
                    border: '1px solid color-mix(in srgb, var(--series-1) 35%, transparent)',
                  }}>
                  {computation.loading ? 'Running...' : 'Run'}
                </button>
              </div>
              <div style={{ color: 'var(--faint)', fontSize: 11, marginBottom: 4 }}>{step.computeLabel}</div>
              {computation.result && (
                <pre style={{
                  color: 'var(--green)', fontSize: 10, lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', margin: 0,
                  fontFamily: 'var(--ed-mono, var(--font-mono))',
                }}>
                  {JSON.stringify(computation.result, null, 2)}
                </pre>
              )}
              {computation.error && (
                <div style={{ color: 'var(--terra-dk)', fontSize: 11 }}>Error: {computation.error}</div>
              )}
            </div>
          )}

          {/* Confidence bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ color: 'var(--faint)', fontSize: 11, marginBottom: 4 }}>
              INTERNAL EVIDENCE SCORE: {(step.confidence * 100).toFixed(0)}%
            </div>
            <div style={{
              height: 4, borderRadius: 2, background: 'var(--hair2)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${step.confidence * 100}%`,
                background: step.confidence >= 0.95 ? 'var(--green)' : step.confidence >= 0.8 ? 'var(--brass-dk)' : 'var(--terra-dk)',
                borderRadius: 2,
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ProofExplorerPage() {
  const mainSteps = PROOF_STEPS.filter(s => s.id !== 'ALT');
  const altStep = PROOF_STEPS.find(s => s.id === 'ALT');

  const provenCount = mainSteps.filter(s => s.status === 'proven' || s.status === 'proven (classical)').length;
  const avgConfidence = mainSteps.reduce((s, step) => s + step.confidence, 0) / mainSteps.length;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Interactive Proof Explorer</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            Click any step to expand: see the claim, theorem, reference, live computation, and gap assessment.
            {' '}{provenCount}/{mainSteps.length} entries are finite or classical identities; the chain is blocked
            and does not prove RH. The displayed {(avgConfidence * 100).toFixed(0)}% is an internal evidence
            score, not a mathematical confidence level.
          </p>
        </div>

        {/* Summary bar */}
        <div style={{
          display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Steps', value: `${provenCount}/${mainSteps.length}`, color: ED.series3 },
            { label: 'Evidence score', value: `${(avgConfidence * 100).toFixed(0)}%`, color: ED.series1 },
            { label: 'Gaps', value: mainSteps.filter(s => s.gap).length, color: ED.brass },
            { label: 'Theorems', value: new Set(mainSteps.map(s => s.theorem)).size, color: ED.series5 },
          ].map(m => (
            <div key={m.label} style={{
              padding: '8px 16px', borderRadius: 8, background: `${m.color}10`,
              border: `1px solid ${m.color}30`, textAlign: 'center', minWidth: 80,
            }}>
              <div style={{ color: m.color, fontSize: 20, fontWeight: 700 }}>{m.value}</div>
              <div style={{ color: 'var(--faint)', fontSize: 10 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--terra-dk)', marginBottom: 24 }}>
          <strong style={{ color: 'var(--terra-dk)' }}>Legacy proof downloads withdrawn.</strong>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.7, marginBottom: 0 }}>
            The former LaTeX and JSON generators asserted that the Darlington chain proved RH.
            They depended on the refuted physical-cascade convergence claim and confused poles of
            <InlineMath tex="S_{21}(s)=\zeta(2s)/\zeta(s)" /> with transmission zeros.
            Passing finite computations below verifies only their named finite identities.
          </p>
        </div>

        {/* Main proof chain */}
        <div className="card" style={{ borderLeft: '3px solid var(--green)', marginBottom: 24 }}>
          <h3 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 16 }}>
            Audited Chain: Finite Identities → Conditional Limit → Zero/Pole Obstruction
          </h3>
          {mainSteps.map(step => <ProofStepCard key={step.id} step={step} />)}
        </div>

        {/* Alternative path */}
        <div className="card" style={{ borderLeft: '3px solid var(--series-5)' }}>
          <h3 style={{ color: 'var(--series-5)', fontSize: 14, marginBottom: 16 }}>
            Alternative Path (bypasses Step S3)
          </h3>
          <ProofStepCard step={altStep} />
          <p style={{ color: 'var(--ink-soft)', fontSize: 12, lineHeight: 1.7, marginTop: 12 }}>
            Trotter–Kato could bypass the refuted matrix-product limit only after its
            generator, domain, and resolvent hypotheses are proved. A further theorem must then
            identify the operator scattering divisor with the algebraic zeta ratio; contraction
            alone does not confine zeta zeros.
          </p>
        </div>

        {/* Related pages */}
        <footer style={{ marginTop: 32, padding: '16px 0', borderTop: '1px solid var(--hairline)' }}>
          <div style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--ed-mono, var(--font-mono))' }}>
            Related pages:
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/formal-proof" style={{ color: 'var(--blue)', fontSize: 13 }}>/formal-proof</Link>
            <Link to="/proof-checker" style={{ color: 'var(--blue)', fontSize: 13 }}>/proof-checker</Link>
            <Link to="/proof-overview" style={{ color: 'var(--blue)', fontSize: 13 }}>/proof-overview</Link>
            <Link to="/rh-attack" style={{ color: 'var(--blue)', fontSize: 13 }}>/rh-attack</Link>
            <Link to="/lambda-bounds" style={{ color: 'var(--blue)', fontSize: 13 }}>/lambda-bounds</Link>
          </div>
          <div style={{ marginTop: 12 }}>
            <Link to="/">← the atlas</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
