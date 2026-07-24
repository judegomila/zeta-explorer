import React from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { NEWMAN_LAMBDA_01787854_CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';

function Section({ number, title, children }) {
  return (
    <section style={{ marginTop: 44 }}>
      <h2
        style={{
          color: '#e2e8f0',
          fontSize: 22,
          borderBottom: '1px solid #1e293b',
          paddingBottom: 9,
        }}
      >
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }) {
  return <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.82 }}>{children}</p>;
}

function Callout({ color = '#8b5cf6', label, children }) {
  return (
    <div
      style={{
        margin: '16px 0',
        padding: '14px 17px',
        borderLeft: `3px solid ${color}`,
        background: `${color}10`,
        borderRadius: '0 8px 8px 0',
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 1.72,
      }}
    >
      <strong
        style={{
          color,
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: 0.7,
          marginBottom: 7,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </strong>
      {children}
    </div>
  );
}

function StatusRow({ label, value, status, color }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        padding: '11px 12px',
        borderTop: '1px solid #1e293b',
        alignItems: 'start',
      }}
    >
      <strong style={{ color, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{label}</strong>
      <span style={{ color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{value}</span>
      <span style={{ color: '#94a3b8', fontSize: 13 }}>{status}</span>
    </div>
  );
}

export default function PaperPage() {
  const candidate = NEWMAN_LAMBDA_01787854_CANDIDATE;

  return (
    <div className="page" style={{ maxWidth: 940, margin: '0 auto', paddingBottom: 80 }}>
      <HonestCeilingBanner />

      <header style={{ textAlign: 'center', padding: '28px 12px 8px' }}>
        <div
          style={{
            color: '#a5b4fc',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          Corrected expository note · v70 review overlay
        </div>
        <h1 style={{ color: '#f1f5f9', fontSize: 31, lineHeight: 1.3, margin: '12px 0' }}>
          The Twin-Ladder Bridge Programme
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, margin: '0 auto', maxWidth: 760 }}>
          Exact arithmetic identities, model interpretations, audited reductions, and the boundary
          between reproducible computation and theorem.
        </p>
      </header>

      <Callout color="#f59e0b" label="Standing">
        This page does not claim a proof of RH or an accepted improvement of the
        de Bruijn–Newman upper bound. The peer-reviewed benchmark used by the app is
        <InlineMath tex="\Lambda\le0.2" />. The public <InlineMath tex="0.1875" /> package is
        unrefereed, and the local <InlineMath tex="0.1787854" /> package remains an unpublished
        review candidate.
      </Callout>

      <Section number={1} title="Classical foundation">
        <P>
          In its half-plane of absolute convergence,
        </P>
        <BlockMath tex="\zeta(s)=\sum_{n\ge1}n^{-s}=\prod_p(1-p^{-s})^{-1},\qquad \Re s>1." />
        <P>
          The completed function
          <InlineMath tex="\;\xi(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)\;" />
          satisfies <InlineMath tex="\xi(s)=\xi(1-s)" />. The associated functional-equation
          factor obeys the linewise identity
          <InlineMath tex="\;|\chi(\tfrac12+it)|=1" /> for every real
          <InlineMath tex="\;t" />. This does not mean that isolated off-line points can never have
          unit modulus, and it does not construct a normalized lossless network.
        </P>
        <BlockMath tex="H_t(z)=\int_0^\infty e^{t u^2}\Phi(u)\cos(zu)\,du,\qquad \partial_tH_t=-\partial_z^2H_t." />
        <P>
          With this standard sign convention, the de Bruijn–Newman constant is the threshold for
          real zeros at larger <InlineMath tex="t" />. RH is equivalent to
          <InlineMath tex="\Lambda\le0" />, and Rodgers–Tao proved
          <InlineMath tex="\Lambda\ge0" />.
        </P>
      </Section>

      <Section number={2} title="The arithmetic ladder—and the convergence boundary">
        <P>
          The exact prime-power ladder is
        </P>
        <BlockMath tex="\log\zeta(s)=\sum_p\sum_{m\ge1}\frac{p^{-ms}}m,\qquad -\frac{\zeta'}{\zeta}(s)=\sum_{n\ge2}\frac{\Lambda(n)}{n^s},\qquad \Re s>1." />
        <P>
          Each fixed-prime geometric series converges for <InlineMath tex="\Re s>0" />, but the
          sum over all primes is absolutely convergent only for <InlineMath tex="\Re s>1" />.
          Critical-line phase and impulse plots therefore require a named truncation,
          smoothing, or analytic-continuation prescription; the raw Euler sums cannot be used there
          as convergent identities.
        </P>
        <P>
          Unique factorization makes the prime logarithms linearly independent over the rationals.
          Prime-power rungs <InlineMath tex="m\log p" /> intentionally contain integer multiples.
          This delay-coordinate structure is exact and motivates the “ladder” language.
        </P>
      </Section>

      <Section number={3} title="Two different cascade embeddings">
        <P>
          The project originally conflated a physical circuit proxy with a separate algebraic
          Euler-product construction. They must remain distinct.
        </P>
        <Callout color="#a78bfa" label="Embedding A · exact algebra">
          <BlockMath tex="M_p(s)=\begin{pmatrix}1&p^{-s}\\p^{-s}&1\end{pmatrix},\qquad S_{21}^{(A)}(s)=\prod_p\frac1{1+p^{-s}}=\frac{\zeta(2s)}{\zeta(s)}\quad(\Re s>1)." />
          Finite-product induction proves this identity. Generic zeros of
          <InlineMath tex="\zeta(s)" /> are poles of the ratio; its transmission zeros come from
          uncancelled zeros of <InlineMath tex="\zeta(2s)" />. The matrix is an algebraic embedding,
          not an established passive LC realization.
        </Callout>
        <Callout color="#22d3ee" label="Embedding B · physical proxy">
          A series/shunt ABCD cell
          <BlockMath tex="A_p(s)=\begin{pmatrix}1&Z_p\\Y_p&1+Z_pY_p\end{pmatrix}" />
          has <InlineMath tex="S_{21}=2/(A+B+C+D)" /> after its stages are multiplied. The alternative
          undamped LC rotation model yields a different primorial-phase transmission. Neither physical
          proxy equals <InlineMath tex="\zeta(2s)/\zeta(s)" /> without a new realization theorem.
        </Callout>
        <P>
          Consequently, Darlington or Lax–Phillips statements about a physical scattering system
          cannot be applied to the algebraic zeta ratio merely by analogy. Even for a genuine
          reciprocal lossless two-port, transmission-zero confinement needs the precise synthesis
          hypotheses; losslessness alone is insufficient.
        </P>
      </Section>

      <Section number={4} title="The v70 shift-bridge reduction">
        <BlockMath tex="X(w)=\xi\!\left(\tfrac12+w\right),\qquad \Delta=\sup_{X(\lambda)=0}|\Re\lambda|." />
        <P>
          The corrected v70 draft derives the fixed-shift strict interior threshold
        </P>
        <BlockMath tex="\bigl[|X(w-a)|<|X(w+a)|\ \forall\,\Re w>0\bigr]\Longleftrightarrow a\ge\Delta." />
        <P>
          This includes <InlineMath tex="a=\Delta" />. At a fixed shift, however, positive
          semidefiniteness of the full kernel is weaker than strict diagonal positivity: common
          shifted zeros can cancel in the quotient and leave a zero row. The all-shifts statement
          remains
        </P>
        <BlockMath tex="\bigl[K_a\succeq0\ \forall a>0\bigr]\Longleftrightarrow\Delta=0\Longleftrightarrow\mathrm{RH}." />
        <P>
          For the ratio <InlineMath tex="R_a(w)=X(w-a)/X(w+a)" />, negative-index counts must use
          residual pole multiplicity
        </P>
        <BlockMath tex="\operatorname{ord}^{\rm pole}_{\lambda-a}R_a=\bigl[m(\lambda)-m(\lambda-2a)\bigr]_+," />
        <P>
          together with the needed analyticity, bounded-type, and finite-window hypotheses—not the
          raw number of denominator zeros.
        </P>
      </Section>

      <Section number={5} title="What the correction audit adds">
        <Callout color="#34d399" label="Proved scalar sublemma">
          The explicit Riemann kernel satisfies
          <InlineMath tex="\;(\log\Phi)''<-68" /> on <InlineMath tex="[0,\infty)" />. Its even
          bilateral extension and every exponential tilt are therefore
          <InlineMath tex="\;PF_2" />. Under Newman heat flow the curvature bound becomes
          <InlineMath tex="\;(\log\Phi_t)''<-68+2t" />. This proves the midpoint scalar inequality,
          but it does not imply a Newman bound, shifted Hermite–Biehler positivity, or RH.
        </Callout>
        <Callout color="#ef4444" label="Total-positivity route ruled out at order five">
          An independently reproduced negative <InlineMath tex="5\times5" /> Toeplitz minor,
          checked in a separate 384-bit Arb implementation, proves that the actual Riemann kernel
          and every exponential tilt fail <InlineMath tex="PF_5" />, hence fail
          <InlineMath tex="PF_\infty" />. This witness does not decide global
          <InlineMath tex="PF_3" /> or <InlineMath tex="PF_4" />.
        </Callout>
        <Callout color="#f97316" label="Off-diagonal reduction remains open">
          The proposed scalar measure-domination step controls only one of two indefinite channels.
          Its positive “diagonal comparison” is not an actual summand of the bridge kernel. The
          two-channel, cancellation-sensitive operator inequality therefore remains unproved.
        </Callout>
      </Section>

      <Section number={6} title="Current Λ evidence ledger">
        <div style={{ border: '1px solid #1e293b', borderRadius: 10, overflow: 'hidden' }}>
          <StatusRow
            label="peer reviewed"
            value="Λ ≤ 0.2"
            status="Published Platt–Trudgian benchmark."
            color="#86efac"
          />
          <StatusRow
            label="public package"
            value="claim: Λ ≤ 0.1875"
            status="Unrefereed; a local audit reconstructed one omitted finite tile."
            color="#facc15"
          />
          <StatusRow
            label="local candidate"
            value="candidate: Λ ≤ 0.1787854"
            status={`${candidate.finiteEvidence.rowCount.toLocaleString()} stored finite rows and ${candidate.tailEvidence.checksPassed}/${candidate.tailEvidence.checksTotal} tail gates pass; eight theorem interfaces remain open.`}
            color="#f59e0b"
          />
        </div>
        <P>
          A passing finite sweep is not a theorem until its producer functional, normalization,
          analytic error estimates, winding/endpoint conditions, and final criterion are shown to
          match exactly. That is the purpose of the candidate review page.
        </P>
      </Section>

      <Section number={7} title="Research conclusion">
        <P>
          The twin-ladder program has produced useful coordinates, explicit algebraic
          self-corrections, a strict <InlineMath tex="PF_2" /> kernel result, a rigorous
          <InlineMath tex="PF_5" /> obstruction, and reproducible candidate computations. It has
          not supplied the non-circular all-shifts positivity theorem or the complete
          de Bruijn–Newman criterion weld needed for RH.
        </P>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18 }}>
          <Link to="/full-story" style={{ color: '#a5b4fc' }}>
            Corrected full story
          </Link>
          <Link to="/paper-audit-dashboard" style={{ color: '#a5b4fc' }}>
            v52 ledger + v70 correction audit
          </Link>
          <Link to="/newman-lambda-01787854-candidate" style={{ color: '#fbbf24' }}>
            0.1787854 candidate audit
          </Link>
          <Link to="/lambda-bounds" style={{ color: '#a5b4fc' }}>
            Bounds and evidence grades
          </Link>
        </div>
      </Section>
    </div>
  );
}
