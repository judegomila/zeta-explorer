# An exact-orbit, all-degree Morse energy inequality

2026-11-03. Independent analytic audit PASS; exact symbolic replay PASS. This is AI-assisted review, not peer review or a machine-formalized proof. Proven auxiliary inequality, not a positivity theorem for the complete theta paired form. The orbit is unchanged. No zero-location assertion or selected-pivot hypothesis is used.

## Result

Put x=π exp(2u), D=d/du and retain exactly

f(u)=4 exp(u/2)(2x²−3x)exp(−x).

The endpoint tilt, not a replacement orbit, is

φ(u)=exp(−u/2)f(u)=4x(2x−3)exp(−x).

Define g(u)=x² exp(−x). For every complex v in the quadratic-form domain {v in H¹(R): xv in L²(R)},

E[v] := ∫ (|v′|²+(4x²−20x)|v|²) du

satisfies BOTH

E[v]+4||v||²+64|〈v,g〉|² ≥ 0,                                  (1)

E[v]+(256/3)|〈v,g〉|²+(2/3)|〈v,φ〉|² ≥ 0.                     (2)

Constants are sharp. Equality in (1) and (2) holds for every v in span{g,φ}; there are no other equality cases. (For (1), both g and φ have zero in the corrected quadratic form.) Here 〈v,w〉=∫v conjugate(w)du.

These are exact degree-uniform estimates, including explicit finite-rank adverse terms. In particular they apply, with their actual coefficients unchanged, to

v=q(iD)[exp(−au)f(u)], 0<a<1/2,

for EVERY finite real polynomial q of either parity and arbitrary degree. They do not require real-rootedness, bounded coefficients, or an old positive block. The constants do not change with a or the degree. They also apply to any particular inverse-selected polynomial, but they estimate this orbit energy, not its original complete-theta selected form.

## Proof by three first-order factorizations

All identities initially hold on compactly supported smooth functions; use their closed form realizations on L²(du). Set

B=D+2x−4, C=D+2x−2, J=D+2x,
H=−D²+4x²−20x.

Since Dx=2x, direct multiplication gives

H+16=B*B,
BB*=C*C+12,
CC*=J*J+4.

The kernels of B and C are respectively span{x²e^(−x)} and span{xe^(−x)}. Also ker B*=ker C*={0}: their formal zero solutions grow at +infinity. The polar decomposition, or the usual nonzero-spectrum correspondence of T*T and TT*, therefore gives:

- B*B has the simple eigenvalue 0, with eigenvector g.
- C*C has eigenvalue 0, with eigenvector xe^(−x), and is ≥4 on its orthogonal complement, since CC*≥4.
- Consequently B*B has eigenvalue 12, with eigenvector B*(xe^(−x))=φ/2, and is ≥16 on the complement of g and φ.

Subtracting 16 proves (2). Using only BB*≥12 proves (1). These are quadratic-form statements, so no assumption that v lies in the operator domain is needed. The domains may equivalently be obtained by closure from the smooth compactly supported core; the negative part of the potential is bounded.

Direct integration with du=dx/(2x) gives

||g||²=3/16, ||φ||²=6, 〈g,φ〉=0,
Hg=−16g, Hφ=−4φ.

Thus the normalized projection costs in (2) are 16/(3/16)=256/3 and 4/6=2/3. The cost in (1) is 12/(3/16)=64.

For completeness, no extra zero equality state appears in (2). A zero state on the complementary subspace would descend through the two polar correspondences to a zero state of J*J. But Jv=0 has the solution v=e^(−x), which is not in L²(du) at −infinity. This also proves the asserted equality cases.

## Spectral version with the exact archimedean transform

Use V(t)=∫v(u)e^(itu)du, and

A(s)=s(s−1)π^(−s/2)Γ(s/2)=∫f(u)e^((s−1/2)u)du, Re s>−2.

The integral has that precise half-plane; the formula elsewhere means meromorphic continuation. Fix 0<a<1/2 and s=1/2−a+it. For v=q(iD)(e^(−au)f),

V(t)=q(t)A(s),
Fourier[e^(bu)v](t)=q(t−ib)A(s+b), b=1,2.

All these functions are square integrable, and v belongs to the energy domain: its left tail and each fixed derivative are O(exp((5/2−a)u)), possibly with faster decay if q cancels the leading term; its exact form is a polynomial in x times exp(−x) times an exponential, which also controls the right tail.

Hence 2π E[v] equals the explicit spectral integral

∫ [t²q(t)²|A(s)|²
   +4π²|q(t−2i)|²|A(s+2)|²
   −20π|q(t−i)|²|A(s+1)|²] dt.                              (3)

Multiplying (1) or (2) by 2π gives a proven all-degree inequality for (3) with exactly the displayed projection debits. No unknown sign has been dropped. The projections are explicit convergent original-orbit integrals; no full theta, zeros, or prime inverse is hidden in their definition.

The precise original shift equation

2π(s−1)A(s+2)=(s+2)(s+1)A(s)

can replace the second term of (3) by

|(s+2)(s+1)/(s−1)|² |q(t−2i)|² |A(s)|².

This quotient is safe on the stated line 0<Re s<1/2, which never meets s=1. It is not asserted indiscriminately at poles or zeros. Equation (3) and the factorization use the actual degree-two orbit, and do not automatically survive an inserted remote-quartet factor.

## Exact scope and remaining gap

This supplies a sharp, original-orbit, degree-independent energy reserve with finite-rank debit. It is stronger than merely restating an unknown positivity question, because the factorization proves its signs independently for the whole energy form domain.

It does NOT compare the energy on the left to

h_a[q]=∫q²[−Im(F′(t+ia)conjugate(F(t+ia)))/a]dt,
F=2ξ(1/2+iz).

In particular no claim is made that the full signed divisor/prime correction is bounded by the rank-one or rank-two terms. Translating the orbit, summing, or changing to a positive reflected orbit would change the operator or discard cross terms. Therefore (1)–(3) cannot be substituted for the signed complete-theta form. Any proposed closure still has to supply a valid comparison retaining the full arithmetic cancellation and actual selected coefficients. RH remains open.

Verification: direct symbolic differentiation independently checked Hg=−16g and Hφ=−4φ; exact integration checked both norms and their zero inner product. The proof above is analytic and needs no numerical certificate. No external state was modified.

## Explicit finite Taylor jets for every polynomial test

The two debit projections need not be left as unevaluated integrals. The following generators were suggested by the parent researcher and independently verified by direct integration and symbolic replay.

Put h_a=e^(−au)f, r=1/4−a/2 and c(z)=1+e^(2z). Define

B_g(z)=2π^(−r)e^(4z)[2Γ(r+4)c(z)^(−r−4)−3Γ(r+3)c(z)^(−r−3)],

B_φ(z)=8π^(−r)[4e^(4z)Γ(r+4)c(z)^(−r−4)
              −6(e^(2z)+e^(4z))Γ(r+3)c(z)^(−r−3)
              +9e^(2z)Γ(r+2)c(z)^(−r−2)].

For real z near zero these equal, respectively,

B_g(z)=∫h_a(u)g(u+z)du,
B_φ(z)=∫h_a(u)φ(u+z)du.

They are analytic near zero using the branch of log c(z) real at z=0. For the present interval r∈(0,1/4), all displayed integrals and all of their derivatives converge absolutely near z=0. Indeed the substitution du=dx/(2x) reduces them to finite sums of Γ(r+k)c(z)^(−r−k). This also gives an independent direct verification of the formulas.

If q(t)=Σ_(k=0)^n q_k t^k, integration by parts gives exactly

〈q(iD)h_a,g〉 = Σ_(k=0)^n q_k(−i)^k B_g^(k)(0),
〈q(iD)h_a,φ〉 = Σ_(k=0)^n q_k(−i)^k B_φ^(k)(0).              (4)

No boundary term survives: the left tails are exponentially decreasing, and the right tails are dominated by e^(−c x). Thus (1)–(3) together with (4) form an explicit all-degree source lemma with entirely known finite Taylor jets and the actual q coefficients.

At the endpoint a=1/2, r=0, one checks B_g(0)=0 and B_φ(0)=6, in agreement with h_(1/2)=φ and the norms above. These endpoint checks do not change the strictly interior domain of the spectral quotient used earlier.

The number of Taylor coefficients required in (4) is n+1. We do not claim that the projections reduce to a degree-independent finite collection of q point evaluations, or that these two bound modes equal the two pole residues in the full zeta contour identity. No such arithmetic identification has been proved. These are explicit original-orbit projections, and all the complete theta cross terms remain to be controlled separately.

Executable exact verification: verify_exact_orbit_morse.py, in this same directory. Its successful output is: “PASS: all three factorizations, eigenfunctions, norms, orthogonality, and both projection generators.” All assertions are exact SymPy equalities, with no floating-point tolerance.
