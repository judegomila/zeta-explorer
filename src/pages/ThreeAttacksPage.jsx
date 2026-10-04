import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';
import { ED, alpha } from '../styles/tokens.js';

// Three Closure Attempts: Corrected Audit — editorial (warm) re-theme.
// Structure, data, and every claim/number/caveat are unchanged from the
// original dark build; only presentation (layout, color tokens, copy
// framing) has been ported to the warm editorial shell.

const mono = 'var(--ed-mono, var(--font-mono))';

const ATTACKS = [
  {
    id: 'kernel-passivity',
    label: 'I. Kernel / passivity',
    color: 'var(--blue)',
    status: 'rejected',
    statusLabel: 'REJECTED AS STATED',
    headline: 'The original prime-wise kernel is automatically positive and therefore cannot detect RH.',
    summary: [
      'Write F_p(s) for the prime-power sum in the displayed kernel. Wherever the series converges, ' +
      'K(s,s′) = Σ_p F_p(s) overline(F_p(s′)) is a Gram kernel. Its positive semidefiniteness is ' +
      'tautological and holds without any information about the locations of zeta zeros.',
      'The KYP or bounded-real lemma constrains poles only after a state-space realization, its domain, ' +
      'minimality, and the identification of the relevant transfer-function divisor have been proved. ' +
      'No such theorem currently identifies zeta zeros with the poles of this kernel. Generic KYP ' +
      'positivity cannot supply that missing arithmetic map.',
      'A replacement route remains conceivable: construct a completed, signed kernel whose positivity is ' +
      'already known to be RH-equivalent, and then realize that exact kernel passively. That construction, ' +
      'rather than positivity of the unsigned Gram sum, is the open problem.',
    ],
    formulas: [
      {
        label: 'Unsigned kernel factorization',
        tex: "K(s,s')=\\sum_p F_p(s)\\overline{F_p(s')},\\qquad F_p(s)=\\sum_{m\\ge1}\\Lambda(p^m)(p^m)^{-s}",
      },
      {
        label: 'Automatic finite Gram positivity',
        tex: '\\sum_{j,k}c_j\\overline{c_k}K(s_j,s_k)=\\sum_p\\left|\\sum_jc_jF_p(s_j)\\right|^2\\ge0',
      },
      {
        label: 'Missing implication',
        tex: 'K\\succeq0\\;\\not\\Longrightarrow\\;\\operatorname{Re}\\rho=\\tfrac12',
      },
    ],
    openGap:
      'Define and prove an RH-equivalent completed kernel/realization, including convergence, the archimedean term, and the exact zero-to-pole divisor map.',
  },
  {
    id: 'prime-delay',
    label: 'II. Prime-delay domination',
    color: 'var(--green)',
    status: 'numerical',
    statusLabel: 'FINITE MODEL',
    headline: 'Finite prime-phase experiments are useful diagnostics, but no uniform domination theorem is known.',
    summary: [
      'For distinct primes, the base frequencies log p are linearly independent over the rationals. ' +
      'Prime powers k log p are harmonics, however, so the full delay family is not independent. ' +
      'Kronecker-Weyl and Baker-type results control fixed finite collections; they do not automatically ' +
      'give an estimate uniform in height, prime cutoff, and harmonic cutoff.',
      'The finite-N experiments reported by the project can therefore be shown as model evidence only. ' +
      'They cannot be extrapolated to an infinite Euler product on the critical line, where the raw ' +
      'product is not convergent.',
      'A successful theorem would need a precisely regularized prime-side quantity and a bound that ' +
      'survives both limits with explicit constants. That remains a research problem.',
    ],
    formulas: [
      {
        label: 'Finite diagnostic',
        tex: 'D_{N,K}(\\sigma,T)=\\sum_{p\\le p_N}\\sum_{k=1}^{K}p^{-k\\sigma}e^{ikT\\log p}',
      },
      {
        label: 'Fixed-prime independence',
        tex: '\\sum_{j=1}^{r}b_j\\log p_j=0,\\ b_j\\in\\mathbb Z\\quad\\Longrightarrow\\quad b_1=\\cdots=b_r=0',
      },
      {
        label: 'Still-required uniform statement',
        tex: '\\text{bound independent of }N,K,T\\quad\\text{before taking }N,K,T\\to\\infty',
      },
    ],
    openGap:
      'Produce a regularized, uniform-in-height and uniform-in-truncation estimate; finite torus equidistribution does not provide it.',
  },
  {
    id: 'weil-pontryagin',
    label: 'III. Weil / Pontryagin',
    color: 'var(--brass)',
    status: 'open',
    statusLabel: 'RH-EQUIVALENT TARGET',
    headline: 'Weil positivity is a legitimate RH criterion, but self-duality alone does not prove its sign.',
    summary: [
      'The Weil explicit formula relates a completed zero-side distribution to prime-power and ' +
      'archimedean terms. Positivity is RH-equivalent only for the exact admissible test-function ' +
      'class and with the completion, sign convention, convergence, and archimedean contribution intact.',
      'Pontryagin self-duality of the adele group supplies a Fourier transform and an identity; it does ' +
      'not turn each local prime contribution positive and does not imply a de Bruijn-Newman bound. ' +
      'The earlier chain "local positivity ⇔ Λ ≤ 0" skipped the essential Weil criterion.',
      'This remains a valuable target: derive the exact completed Weil form from a twin-ladder operator ' +
      'without dropping terms, and prove its positivity on the full test class. Doing so would be an ' +
      'RH-strength achievement, not a short consequence of duality.',
    ],
    formulas: [
      {
        label: 'Schematic completed explicit formula',
        tex: 'W(h)=W_{\\infty}(h)+\\sum_{p,k}W_{p,k}(h)=\\sum_{\\rho}H(\\rho)',
      },
      {
        label: 'Pontryagin self-duality',
        tex: '\\widehat{\\mathbb A_{\\mathbb Q}}\\cong\\mathbb A_{\\mathbb Q}',
      },
      {
        label: 'Logical boundary',
        tex: '\\text{self-duality}\\;\\not\\Longrightarrow\\;W(h)\\ge0',
      },
    ],
    openGap:
      'Identify the precise Weil test space and prove the completed quadratic form positive, including every local and archimedean term.',
  },
];

const STATUS_STYLE = {
  rejected: { color: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1), border: alpha(ED.accent, 0.4) },
  numerical: { color: 'var(--blue)', bg: alpha(ED.series1, 0.1), border: alpha(ED.series1, 0.4) },
  open: { color: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.12), border: alpha(ED.brassDeco, 0.4) },
};

function StatusChip({ status, label }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.open;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      fontSize: 11,
      fontWeight: 700,
      fontFamily: mono,
      color: style.color,
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 99,
    }}>
      {label}
    </span>
  );
}

function AttackCard({ attack, open, onToggle }) {
  return (
    <div className="card" style={{ borderColor: open ? attack.color : undefined, marginBottom: 0 }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: 0,
          border: 0,
          background: 'transparent',
          color: 'inherit',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span style={{ flex: 1 }}>
          <span style={{ color: attack.color, fontFamily: mono, fontSize: 14, fontWeight: 700 }}>
            {attack.label}
          </span>
          <span style={{ marginLeft: 12 }}>
            <StatusChip status={attack.status} label={attack.statusLabel} />
          </span>
          <span style={{ display: 'block', marginTop: 7, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            {attack.headline}
          </span>
        </span>
        <span aria-hidden="true" style={{ color: attack.color, fontSize: 18 }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: 16 }}>
          {attack.summary.map((paragraph) => (
            <p key={paragraph} style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75, margin: '10px 0 0' }}>
              {paragraph}
            </p>
          ))}

          <div style={{ marginTop: 16, borderTop: '1px solid var(--hairline)', paddingTop: 14 }}>
            {attack.formulas.map((formula) => (
              <div key={formula.label} style={{ marginBottom: 12 }}>
                <div style={{ color: attack.color, fontSize: 11, fontFamily: mono }}>{formula.label}</div>
                <BlockMath tex={formula.tex} />
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            borderLeft: '3px solid var(--brass-dk)',
            background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
            color: 'var(--ink-soft)',
            fontSize: 12.5,
            lineHeight: 1.65,
          }}>
            <strong style={{ color: 'var(--brass-dk)' }}>Open obligation:</strong> {attack.openGap}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreeAttacksPage() {
  const [openId, setOpenId] = useState('kernel-passivity');

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '70rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Three Closure Attempts: Corrected Audit</h1>
          <AnimationEmbed id="three-attacks" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            These are research programs around the twin-ladder model, not three proofs of RH.
            The twin-ladder review separates identities, finite experiments, rejected implications, and
            genuinely RH-equivalent targets.
          </p>
        </div>

        <div className="card" style={{ borderLeft: '3px solid var(--terra-dk)', marginBottom: 20 }}>
          <strong style={{ color: 'var(--terra-dk)' }}>Bottom line:</strong>
          <span style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.7 }}>
            {' '}the unsigned kernel is PSD by construction, finite prime-delay plots do not control
            the infinite critical-line object, and adelic self-duality does not prove Weil positivity.
            No approach on this page currently proves <InlineMath tex="\Lambda\le0" /> or RH.
          </span>
        </div>

        <h2 className="ed-h2" style={{ marginTop: 8, marginBottom: 12 }}>The three approaches</h2>
        <div style={{ display: 'grid', gap: 14 }}>
          {ATTACKS.map((attack) => (
            <AttackCard
              key={attack.id}
              attack={attack}
              open={openId === attack.id}
              onToggle={() => setOpenId(openId === attack.id ? null : attack.id)}
            />
          ))}
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--blue)' }}>
          <h3 style={{ color: 'var(--faint)', marginTop: 0 }}>Where the standalone review candidate lives</h3>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.75 }}>
            The standalone repository presents <InlineMath tex="\Lambda\le0.1787854" /> as a
            computer-assisted candidate for an unconditional proof. Its package claims compact-slab and
            final-time-half-strip closures, a material replay, corrected error bounds, and an exact criterion
            weld. The bound is not established, has been reviewed by Dan Romik, and is not RH.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/newman-lambda-01787854-candidate" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Open the candidate package
            </Link>
            <Link to="/proof-overview" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Read the evidence-graded proof overview
            </Link>
            <Link to="/closure-routes" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Inspect the corrected closure routes
            </Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: 24, borderLeft: '3px solid var(--brass)' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--faint)', marginBottom: 6 }}>
            Related pages
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <Link to="/lambda-bounds" style={{ fontSize: 12, color: 'var(--brass-dk)', textDecoration: 'none' }}>
              → Λ Bounds &amp; RH Roadmap
            </Link>
            <Link to="/closure-routes" style={{ fontSize: 12, color: 'var(--brass)', textDecoration: 'none' }}>
              → Closure routes
            </Link>
            <Link to="/proof-overview" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              → Proof overview
            </Link>
            <Link to="/flow-blindness-no-go" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
              → Flow-blindness no-go
            </Link>
          </div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
            <Link to="/">← the atlas</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
