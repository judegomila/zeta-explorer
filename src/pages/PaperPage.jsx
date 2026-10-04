import React from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import HonestCeilingBanner from '../components/HonestCeilingBanner.jsx';
import { NEWMAN_LAMBDA_01787854_CANDIDATE } from '../data/newman-lambda-01787854-candidate.js';
import { ED, alpha } from '../styles/tokens.js';

// The Twin-Ladder Bridge Programme — expository note + twin-ladder review overlay.
// Editorial (warm) re-theme: full-width ed-root/ed-full shell, identical
// structure, claims, and every InlineMath/BlockMath expression verbatim.

const TONE = {
  brass: { c: 'var(--brass)', bg: alpha(ED.brass, 0.08) },
  brassDk: { c: 'var(--brass-dk)', bg: alpha(ED.brassDeco, 0.1) },
  blue: { c: 'var(--blue)', bg: alpha(ED.series1, 0.1) },
  green: { c: 'var(--green)', bg: alpha(ED.series3, 0.1) },
  terra: { c: 'var(--terra-dk)', bg: alpha(ED.series2, 0.1) },
};

function Section({ number, title, children }) {
  return (
    <section style={{ marginTop: 44 }}>
      <h2
        className="ed-h2"
        style={{
          fontSize: 22,
          borderBottom: '1px solid var(--hairline)',
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
  return <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.82 }}>{children}</p>;
}

function Callout({ tone = 'brass', label, children }) {
  const t = TONE[tone] || TONE.brass;
  return (
    <div
      style={{
        margin: '16px 0',
        padding: '14px 17px',
        borderLeft: `3px solid ${t.c}`,
        background: t.bg,
        borderRadius: '0 8px 8px 0',
        color: 'var(--ink-soft)',
        fontSize: 14,
        lineHeight: 1.72,
      }}
    >
      <strong
        style={{
          color: t.c,
          display: 'block',
          fontFamily: 'var(--ed-mono, var(--font-mono))',
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
        borderTop: '1px solid var(--hairline)',
        alignItems: 'start',
      }}
    >
      <strong style={{ color, fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 12 }}>{label}</strong>
      <span style={{ color: 'var(--ink)', fontFamily: 'var(--ed-mono, var(--font-mono))', fontSize: 13 }}>{value}</span>
      <span style={{ color: 'var(--faint)', fontSize: 13 }}>{status}</span>
    </div>
  );
}

export default function PaperPage() {
  const candidate = NEWMAN_LAMBDA_01787854_CANDIDATE;

  return (
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <HonestCeilingBanner />

        <div style={{ textAlign: 'center', padding: '20px 12px 8px' }}>
          <div
            style={{
              color: 'var(--brass-dk)',
              fontFamily: 'var(--ed-mono, var(--font-mono))',
              fontSize: 11,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            Corrected expository note · twin-ladder review overlay
          </div>
          <h1 className="ed-h1" style={{ margin: '12px 0' }}>
            The Twin-Ladder Bridge Programme
          </h1>
          <p className="ed-lbl">Related: <Link to="/papers">Saved papers</Link></p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.7, margin: '0 auto', maxWidth: 760 }}>
            Exact arithmetic identities, model interpretations, audited reductions, and the boundary
            between reproducible computation and theorem.
          </p>
        </div>

        <Callout tone="brassDk" label="Standing">
          This page does not claim a proof of RH. The peer-reviewed benchmark used by the app is
          <InlineMath tex="\Lambda\le0.2" />. The public <InlineMath tex="0.1875" /> package is
          unrefereed. The standalone repository presents the stronger{' '}
          <InlineMath tex="\Lambda\le0.1787854" /> value as a computer-assisted candidate
          for an unconditional proof. The bound is not established, has been reviewed by Dan Romik, and is not RH.
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
          <Callout tone="brass" label="Embedding A · exact algebra">
            <BlockMath tex="M_p(s)=\begin{pmatrix}1&p^{-s}\\p^{-s}&1\end{pmatrix},\qquad S_{21}^{(A)}(s)=\prod_p\frac1{1+p^{-s}}=\frac{\zeta(2s)}{\zeta(s)}\quad(\Re s>1)." />
            Finite-product induction proves this identity. Generic zeros of
            <InlineMath tex="\zeta(s)" /> are poles of the ratio; its transmission zeros come from
            uncancelled zeros of <InlineMath tex="\zeta(2s)" />. The matrix is an algebraic embedding,
            not an established passive LC realization.
          </Callout>
          <Callout tone="blue" label="Embedding B · physical proxy">
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

        <Section number={4} title="The Shift-Bridge Reduction">
          <BlockMath tex="X(w)=\xi\!\left(\tfrac12+w\right),\qquad \Delta=\sup_{X(\lambda)=0}|\Re\lambda|." />
          <P>
            The corrected twin-ladder draft derives the fixed-shift strict interior threshold
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
          <Callout tone="green" label="Proved scalar sublemma">
            The explicit Riemann kernel satisfies
            <InlineMath tex="\;(\log\Phi)''<-68" /> on <InlineMath tex="[0,\infty)" />. Its even
            bilateral extension and every exponential tilt are therefore
            <InlineMath tex="\;PF_2" />. Under Newman heat flow the curvature bound becomes
            <InlineMath tex="\;(\log\Phi_t)''<-68+2t" />. This proves the midpoint scalar inequality,
            but it does not imply a Newman bound, shifted Hermite–Biehler positivity, or RH.
          </Callout>
          <Callout tone="terra" label="Total-positivity route ruled out at order five">
            An independently reproduced negative <InlineMath tex="5\times5" /> Toeplitz minor,
            checked in a separate 384-bit Arb implementation, proves that the actual Riemann kernel
            and every exponential tilt fail <InlineMath tex="PF_5" />, hence fail
            <InlineMath tex="PF_\infty" />. This witness does not decide global
            <InlineMath tex="PF_3" /> or <InlineMath tex="PF_4" />.
          </Callout>
          <Callout tone="brassDk" label="Off-diagonal reduction remains open">
            The proposed scalar measure-domination step controls only one of two indefinite channels.
            Its positive “diagonal comparison” is not an actual summand of the bridge kernel. The
            two-channel, cancellation-sensitive operator inequality therefore remains unproved.
          </Callout>
        </Section>

        <Section number={6} title="Current Λ evidence ledger">
          <div style={{ border: '1px solid var(--hairline)', borderRadius: 10, overflow: 'hidden' }}>
            <StatusRow
              label="peer reviewed"
              value="Λ ≤ 0.2"
              status="Published Platt–Trudgian benchmark."
              color="var(--green)"
            />
            <StatusRow
              label="public package"
              value="claim: Λ ≤ 0.1875"
              status="Unrefereed; a local audit reconstructed one omitted finite tile."
              color="var(--brass-dk)"
            />
            <StatusRow
              label="candidate"
              value="Λ ≤ 0.1787854"
              status={`${candidate.finiteEvidence.rowCount.toLocaleString()} freshly replayed finite rows; corrected tail reports ${candidate.tailEvidence.checksPassed}/${candidate.tailEvidence.checksTotal} gates per precision. Computer-assisted candidate for an unconditional proof; reviewed by Dan Romik, publicly posted (judegomila.com/posts/riemann-lambda-0.1787854); unrefereed; bound not established; not RH.`}
              color="var(--blue)"
            />
            <StatusRow
              label="candidate"
              value="Λ ≤ 0.1758354"
              status={<>Four Arb interval gates; Lean-checked y-transfer reduction and Lemma B3. Unrefereed; bound not established; not RH. See the <Link to="/lambda-01758354-candidate" style={{ color: 'var(--blue)' }}>candidate page</Link>.</>}
              color="var(--blue)"
            />
            <StatusRow
              label="contract — not a bound"
              value="Λ ≤ 0.14 (conditional)"
              status={<>Conditional completion contract, not a bound: one open family |C_E,17| &lt; 0.2796881955526147 on 690988 ≤ N ≤ 54799999 remains. See the <Link to="/permutation-architecture" style={{ color: 'var(--brass-dk)' }}>permutation architecture</Link>.</>}
              color="var(--brass-dk)"
            />
          </div>
          <P>
            The standalone package checks the producer functional, normalization, analytic error estimates,
            claimed compact-slab and final-time-half-strip closures, verified height, endpoints, and final
            criterion together. The candidate page records those claims and their external-review boundary.
          </P>
        </Section>

        <Section number={7} title="Research conclusion">
          <P>
            The twin-ladder program has produced useful coordinates, explicit algebraic
            self-corrections, a strict <InlineMath tex="PF_2" /> kernel result, a rigorous
            <InlineMath tex="PF_5" /> obstruction, and a computer-assisted candidate for an
            unconditional proof of <InlineMath tex="\Lambda\le0.1787854" />. That candidate bound is not
            established, has been reviewed by Dan Romik, and is not RH. A sharper candidate{' '}
            <InlineMath tex="\Lambda\le0.1758354" /> (four Arb gates, Lean-checked y-transfer reduction and Lemma B3, unrefereed)
            and the conditional <InlineMath tex="\Lambda\le0.14" /> completion contract — a contract,
            not a bound, with one open family — extend the same ledger. The program has
            not supplied the non-circular all-shifts positivity theorem or the complete
            global residual inequality needed for RH; the surviving frontier is equivalent to RH.
          </P>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18 }}>
            <Link to="/full-story" style={{ color: 'var(--brass-dk)' }}>
              Corrected full story
            </Link>
            <Link to="/paper-audit-dashboard" style={{ color: 'var(--brass-dk)' }}>
              correction audit
            </Link>
            <Link to="/newman-lambda-01787854-candidate" style={{ color: 'var(--brass)' }}>
              0.1787854 candidate package
            </Link>
            <Link to="/lambda-bounds" style={{ color: 'var(--brass-dk)' }}>
              Bounds and evidence grades
            </Link>
            <Link to="/">← the atlas</Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
