# Cross-project RH synthesis and a directional residual repair

Research session: 8–9 October 2026. **No RH proof, improved zero-free region, or new unconditional Newman bound is claimed.** The new analytic transfers below explicitly assume the imported `openai/math` 7/8 theorem. The new finite matrix certificate does not use that theorem.

The broader review found useful work that the moment-transfer audit had not used: the stable Möbius packets, the SELF positive-measure construction and its zero-width reduction, the twistor single-response criterion, the discrete-curvature continuum-tail analysis, and the current conditional route-P calculation. They improve the research target and one finite certificate. None of the reviewed sources supplies the remaining uniform signed arithmetic inequality.

**Coverage limitation:** prior-conversation search failed twice. This is a review of accessible saved research and selected repository sources, not a claim to have read every previous chat or validated every repository result. See [the coverage ledger](../../research-inputs/rh-cross-project-2026-10-09/COVERAGE.md) and machine-readable source hashes. Older papers, current branch records, and unmerged PRs are distinguished there.

## 1. What the broader work changes

| Workstream | Reusable result found | What it does not supply |
|---|---|---|
| Twin-ladder/permutation architecture; arithmetic–archimedean addendum | Exact completed bridge; signed coboundary/Weil factorization; keep correlated channels together | The contraction or spectral comparison needed at every support |
| Twistor causality v6–v7 and PR #10 | A single explicit causal response has total energy either 1/2 or infinity; any finite bound at each width in a sequence tending to zero suffices | Boundary unitarity, small leakage, or finite-time energy does not establish global causal stability |
| Möbius cancellation v8 | Exact divisor compensation produces a decaying seed and stable finite Möbius-prefix approximants; total diagonal packet energy is finite | Uniform control of the signed cross terms; fixed positive-delay truncations remain invalid globally |
| Vaughan v9 and the two PR #11 notes | Small-divisor removal, exact principal-sector centering, polynomial grouped diagonal and short-shift bounds | A saving in the signed large-shift energy; the Eisenstein lift retains its coupled cutoff |
| SELF v0.4–v0.7 | Inherited Schur residual identity; a preserved Stieltjes class; finite positive measures matching 32 coefficients at three widths | Positive starting measure at every degree; finite approximants are not the full xi response |
| SELF zero-width audit; earlier Krein–Stieltjes note | For the exact xi function, one unshifted Hankel tower is already an RH-equivalent target | The all-degree positivity of that tower; finite successful tests can coexist with off-axis zeros in controls |
| Discrete curvature v3 | Rigorous residual Schur bound; an entire 64-cell repair class is excluded for one scalar inverse penalty; explicit continuum residual tail | A directional inverse estimate, or a successful continuum certificate using that tail |
| Weil positivity PR #9 | Reported full-space pole-free certificate on support (-1,1); signed energy and centered-recovery reductions | Uniformity in support; the large certificate was not replayed in this synthesis |
| Xi/prolate PR #6 | Detailed normalization and proof-obligation history; terminal state `P0_INVALIDATED` | An admissible completed P0 theorem; successful numerical subchecks cannot override that state |
| Freeze–thaw / Newman / route P | Exact phase-preserving finite reductions; current branch records conditional value 0.116091488672439 | An unconditional bound: the module explicitly retains the 003, G0, PT, and route-P premises |
| Function-field ladder | A concrete positive intersection form supplies the missing square for actual curves | A characteristic-zero geometric positivity theorem for the zeta ladder |
| Fluid, Fisher, random-twist, uncertainty, Nyman–Beurling routes | Useful reformulations, scoped controls, and finite tools in the saved avenue audit | A separately established global arithmetic estimate; these are not independent completed proofs |

In particular, the older 0.14 checkpoint is not the only quantitative result in the repository. The current route-P module contains a smaller **conditional** value. Its detailed producer chain and external premises were not independently replayed here. No number from that lane is promoted by this note.

## 2. A concrete finite improvement from the residual work

The v3 discrete-curvature failure was specifically the replacement of a positive detail inverse by a scalar multiple of the identity. Preserve the directions of the residual instead.

Let a self-adjoint block operator have detail block D >= b I, b>0. With a fixed trial map L, define

\[
R=B^*-DL,\qquad F=A-BL-L^*B^*+L^*DL.
\]

Its exact Schur complement is S=F-R^*D^{-1}R. The old sufficient certificate was

\[
C_0=F-b^{-1}R^*R.
\]

### Directional inverse bound

Put K=D-bI >=0. Choose finitely many detail trial columns Z in the operator domain, and suppose

\[
A_Z=Z^*KZ>0,\qquad V=KZ,\qquad M=A_Z+b^{-1}V^*V.
\]

Then

\[
K\succeq V A_Z^{-1}V^*,
\]

because the positive block Gram of K on an arbitrary vector and Z has positive Schur complement. Equivalently, minimize the nonnegative form of K on f-Zc. Adding bI, reversing the positive inverse order, and applying the finite-rank inverse formula gives

\[
D^{-1}\preceq b^{-1}I-b^{-2}VM^{-1}V^*.
\]

Consequently the improved sufficient certificate is

\[
\boxed{C_Z=C_0+b^{-2}(V^*R)^*M^{-1}(V^*R)\preceq S.}
\]

The improvement is positive semidefinite. These are standard positive-operator and Schur identities; no novelty is claimed. They are valid in the infinite-dimensional setting with the stated positive lower bound and operator-domain hypotheses. If A_Z is singular, discard dependent capture columns with justified range handling; do not divide by an unresolved pivot.

For an arbitrary finite matrix T, a convenient sufficient version is

\[
\boxed{S\succeq F-b^{-1}(R-VT)^*(R-VT)-T^*A_ZT.}
\]

Its optimum is T=M^{-1}V^*R/b, giving C_Z. This follows by completing the square, so an approximate solve remains usable without pretending to have the exact inverse.

### Executed arithmetic certificate

We used the completed arithmetic matrix from discrete-curvature v3, including its pole, gamma, and prime terms. Its support is T=log(4), with 16 coarse cells, the **same original 64-cell trial**, and 128 observed cells. The detail floor is b=5569/10000. Sixteen capture columns are obtained by rational rounding of the observed residual followed by exact projection to the detail space. They have components beyond the old 64-cell trial space.

| Check | Certified outcome |
|---|---|
| Old sufficient matrix, in the inherited test direction | Rayleigh quotient < -0.1060; enclosed near -0.10604765986167548 |
| Directional sufficient matrix, all 16 coarse directions | C_Z/8 > (29/100000) I = 0.00029 I |
| Inherited analytic infinite-detail floor | > 0.55694411288624 > b |
| Arithmetic input | All 128 coefficient intervals freshly regenerated, with identical endpoints |
| Sign checking | 384-bit Arb interval LDL; finite detail block, A_Z, M, and C_Z minus the stated margin all pass |
| Negative controls | Negated matrix and reversed correction rejected |

The factor eight comes from the rational coarse basis U with U^*U=8I. The displayed 0.00029 is a spectral lower bound for the **corrected 16-dimensional sufficient matrix in normalized coarse coordinates**. It is not a gap for the full continuum Weil operator, nor a gap for the full 128-dimensional matrix in its original norm.

This does not contradict the v3 exclusion of all 64-cell correctors under its old penalty. Algebraically, directional capture is equivalent to allowing an additional correction in the range of Z. Those residual directions lie in the 128-cell space. It repairs the approximation to the inverse, rather than proving that an excluded 64-cell correction had worked after all. The underlying finite arithmetic matrix was already known positive; this is a more effective sufficient certificate, not first positivity at a new support.

### The continuum attempt was also made

Let P_h be the coarse projection, P_N the observation projection, and Q=I-P_h. Let the trial G satisfy P_h G=I in coarse coordinates; assume Z is in the detail space and both G and Z lie in the observed step space. Write the completed operator as W. Then

\[
R=QWG,\quad V=(D-bI)Z,\quad
(I-P_N)(R-VT)=(I-P_N)W(G-ZT).
\]

Thus the v3 analytic residual-tail bound should be applied to the **combined** trial G-ZT, preserving the cancellation. If E_delta(G-ZT) bounds the squared omitted operator tail, a fully justified sufficient test is

\[
F-T^*A_ZT-b^{-1}\left[
(R_N-V_NT)^*(R_N-V_NT)+E_\delta(G-ZT)
\right]\succeq0.
\]

All matrices and the tail must use the same observation grid. Applying the existing conservative v3 tail at the actual 128-cell grid gives a negative test direction near **-5269.60516**. Therefore this continuation does **not** certify the continuum operator through this method. The negative number is a value of a sufficient lower bound, not a negative Weil energy.

This is a concrete remaining task: keep the directional correction but improve the regularity of the trial/capture functions and control the full omitted tail. Merely optimizing the already excluded 64-cell class, or attaching a fine-grid tail to a coarse-grid residual, cannot close it. Even a successful local continuum test would still need an all-support argument for RH.

## 3. Transfer the imported 7/8 result to the twistor energy

Set X(w)=xi(1/2+w) and R_a(w)=X(w-a)/X(w+a). Write B_0=3/8. The imported zero-free region, together with the functional equation, places all zeros of X in |Re w|<=B_0.

For the actual xi canonical product, a strip |Re w|<=B_0 implies that R_c is Schur on Re w>0 whenever c>=B_0. One direct proof groups zeros in conjugate/even quartets. A quartet at +/-b +/-i gamma contributes factors with widths c-b and c+b; both are nonnegative when c>=|b|. Each factor (w-d-i gamma)/(w+d-i gamma), d>=0, has modulus at most one in the right half-plane. The paired canonical product converges locally; xi's even order-one product has no surviving nonconstant exponential factor. Boundary zeros are treated by removable continuation.

Moreover, for x>=B_0 and a>0, evenness and conjugation give

\[
|R_a(x+it)|=|R_x(a+it)|\le1.
\]

The function w -> R_a(w+B_0) is holomorphic on Re w>0 because its denominator is evaluated strictly to the right of the zero strip. It is therefore a Schur multiplier there, **for every a>0**.

Let y_a be the causal arithmetic response of twistor v7 to e^{-t}1_{t>=0}, defined by the locally finite arithmetic sum, with initial Laplace transform R_a(w)/(w+1). Multiplying both input and output by e^{-B_0 t}, then using Hardy-space contraction and Laplace uniqueness on the initial convergence half-plane, yields

\[
\boxed{\int_0^\infty e^{-3t/4}|y_a(t)|^2dt\le\frac4{11}.}
\]

Thus

\[
\int_0^T|y_a(t)|^2dt\le\frac4{11}e^{3T/4}.
\]

For the exact finite-window Hankel operator from PR #10, the same damping gives

\[
\boxed{\|H_{a,L}\|\le L^{3/4}\qquad(a>0,L>1).}
\]

Indeed, in logarithmic coordinates on [-log L,log L], the damped Hankel operator is a contraction and undoing the damping on its two sides costs L^{B_0} each. This improves the earlier bound L. For a>=3/8, the stronger undamped norm bound 1 and response energy 1/2 already follow from the strip input.

These are consequences of the imported result, not a further contraction of its zero strip. The old classical strip would give B_0=1/2, weight e^{-t}, response constant 1/3, and operator bound L. The new exponent 3/4 agrees with the baseline in the moment-transfer energy, but the two energies are different objects and their kernels are not identified by this numerical agreement.

In particular, exponential damping cannot be dropped. The reviewed v7/v8 criterion still requires finite **unweighted** energy separately at widths tending to zero. No uniform constant in width and no fixed positive margin below one are required, but the infinite-time bound itself remains unproved.

## 4. What the same input gives SELF, and why it stops

Take real nodes x_i>B_0 and y_i=R_a(x_i). Schur positivity of w -> R_a(w+B_0) proves

\[
P^{(B_0)}_{ij}=\frac{1-y_i y_j}{x_i+x_j-2B_0}\succeq0.
\]

The original SELF matrix is P^(0)_{ij}=(1-y_i y_j)/(x_i+x_j). With C_{ij}=1/(x_i+x_j), the exact identity is

\[
\boxed{P^{(0)}=P^{(B_0)}-2B_0(C\circ P^{(B_0)}).}
\]

Here the circle denotes entrywise product. Both matrices on the right before subtraction are positive semidefinite. The sign of their **difference** is the remaining comparison; positivity of the shifted matrix does not prove the original SELF condition.

The exact rational control

\[
X_*(w)=((w-3/10)^2+4)((w+3/10)^2+4)
\]

has all zeros within the stricter strip |Re w|<=3/10<3/8. At a=1/10 and nodes (9,17/2,25/3), P^(3/8) is positive definite, while the third pivot of P^(0) equals

\[
-\frac{100524667776910903125}{22083581478306370241011846411414}<0.
\]

The checker verifies the signed matrix identity and both signs with exact rationals. This control is not zeta and does not preserve its Euler product. It refutes only the attempted deduction from strip confinement, symmetry, and shifted positivity. It demonstrates why the imported strip cannot initialize the thin SELF invariant class for free.

## 5. Corrections to the combined research picture

1. **Use the latest stable arithmetic representation.** Möbius v8's centered prefixes fix v7's unstable fixed-delay approximation. The repair does not prove bounded signed prefix energies. Vaughan grouping is a different representation; its coupled cutoff must remain when comparing it to the Eisenstein source.
2. **Do not spend effort demanding a global strict gap.** PR #10's all-window criterion needs only boundedness, separately for a sequence of widths. Its limiting norm is one in the inner case. That does not forbid positive margins on finite windows.
3. **Do not assume fixed-width ratio holomorphy excludes every denominator zero.** Numerator/denominator cancellations can occur. The reviewed sequence-to-zero argument uses isolation of a zero to rule them out for sufficiently small widths. Older broad fixed-width equivalence slogans require their exact no-common-zero/characteristic hypotheses.
4. **Use the zero-width SELF reduction already in the saved work.** For the actual xi function the generator X'(sqrt z)/(sqrt z X(sqrt z)) needs one all-degree unshifted Hankel tower. The earlier two-tower and positive-shift tests remain useful finite diagnostics; they are not separate missing infinite induction theorems.
5. **Scope each obstruction.** A failed majorant, scalar inverse, finite-dimensional truncation, or flow-blind class does not exclude every positivity, geometric, or arithmetic approach. The present directional repair is a concrete example of an improvement left open by the earlier exclusion.
6. **Keep the Newman lane's conditions visible.** The current 0.116091488672439 route-P record incorporates the imported 7/8 start and remains conditional on named analytic and computational premises. Neither this value nor the older 0.14 contracts is RH.

## 6. Next proof obligations, in executable order

| Objective | Exact deliverable | Present state |
|---|---|---|
| Improve the residual certificate beyond the finite grid | Construct smoother residual capture columns; rigorously enclose the combined omitted tail and pass the displayed continuum test on the same grid | New finite directional repair passes; inherited continuum tail fails |
| Improve the 7/8 zero boundary through the moment route | A one-sided signed far-correlation upper bound with exponent 3/4-delta, delta>0, retaining actual coefficients and cutoffs | Unproved; the diagonal and short shifts are already controlled |
| Complete the twistor/Möbius route | Unweighted finite energy of the exact centered response for each width in a sequence tending to zero | Imported result gives only the displayed weighted bound at thin widths |
| Complete SELF | Prove the exact arithmetic zero-width moment functional is nonnegative on every polynomial square | Finite measures and invariant propagation are available; all-degree arithmetic sign is open |
| Advance the Newman result | Close/review the actual route-P producer and analytic dependencies, or complete the older mantle coverage in its own lane | Separate conditional programme; not replayed here |

These are related formulations and tools, not independent missing lemmas whose finite successes can simply be added into a proof. The continuum certificate is the most concrete new computational follow-up from this synthesis. The signed global arithmetic estimate remains the direct RH-strength task.

## 7. Verification and sources

[Research package](../../research-inputs/rh-cross-project-2026-10-09/README.md): interval checker and receipt; exact rational checker and receipt; inherited arithmetic row and unchanged coefficient generator; fresh regeneration receipt; coverage/source ledger; hash manifest. No app code is changed. No external Lean project, full application build, or full historical certificate suite was run.

The strip source is [openai/math, family 003](https://github.com/openai/math/blob/main/lean/docs/003.md), opened during this audit. It describes the 7/8 theorem and its scope; this continuation does not independently establish its Lean correctness. Classical context: [Suzuki, arXiv:1204.1827v2](https://arxiv.org/pdf/1204.1827), Theorem 2.2 and Appendix A, and [Lagarias, arXiv:math/0601653v2](https://arxiv.org/pdf/math/0601653). The analytic transfer arguments are given explicitly above and require mathematical review; neither finite checker is a proof-assistant formalization of those arguments.

Source-specific versions, inspected sections, unreviewed material, and hashes are recorded in the coverage files. Original saved papers and historical repository claims are not silently overwritten.
