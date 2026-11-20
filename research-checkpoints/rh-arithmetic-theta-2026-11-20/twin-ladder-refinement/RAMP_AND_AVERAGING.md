# Twin-ladder refinement: ramp traces, parity, and arithmetic averaging

20 November 2026. Research continuation. This note does not claim RH or a new zero-free region. Finite Heisenberg averaging is standard elementary matrix algebra. The two-involution structure is the standard decomposition into invariant blocks of dimension at most two. Complete proofs are included for clarity; no novelty is claimed for these facts or their elementary consequences.

## Outcome

There is an exact transport from the user's actual prime ladder to the arithmetic observable in the announced route:

\[
G_\zeta(X)=\operatorname{Tr}\!\left[\mathsf D\,(Xe^{-\mathsf A}-I)_+\right]
 -X\log X+(1+\gamma_E)X.
\]

Here \(\mathsf A e_{p,m}=m\log p\,e_{p,m}\) and \(\mathsf D e_{p,m}=\log p\,e_{p,m}\). This is a literal identity of the model with the weighted Mangoldt quantity, not a claim that a visual analogy supplies an estimate. The centered trace still needs arithmetic cancellation.

A second exact calculation identifies the dimension factor required in a lift cross-correlation bound. Complete finite Heisenberg averaging gives

\[
\frac1{D^2}\sum_{a,b\bmod D}
 \|A^*X^aZ^bB\|_{\rm HS}^2
 =\frac{\|A\|_{\rm HS}^2\|B\|_{\rm HS}^2}{D}.
\]

For isometries with source dimensions \(d_A,d_B\), this is exactly \(d_Ad_B/D\), the normalization appearing in the source `LinkS` condition. It is an **averaged** identity. It is not an estimate for every pair of selected arithmetic lift images, and the relevant arithmetic realization has not been constructed.

The two ladder legs alone cannot provide that averaging. A fixed leg involution only separates parity blocks. More strongly, any two unitary involutions on a complex Hilbert space of dimension \(D>2\) have a nontrivial common reducing subspace. Consequently, conjugation averages over the group they generate retain a nonzero traceless matrix exactly and cannot converge to the scalar trace projection on all matrices. This obstruction has specific hypotheses; it does not exclude additional arithmetic operators or a genuine lift construction.

## 1. The actual prime ladder and the exact ramp transport

The August permutation manuscript defines

\[
\mathcal H_{\rm ar}=\ell^2\{(p,m):p\text{ prime},\ m\ge1\},
\quad \mathsf A e_{p,m}=m\log p\,e_{p,m},
\quad \mathsf D e_{p,m}=\log p\,e_{p,m}.
\]

Its trace identity, valid for \(\Re s>1\), is

\[
\operatorname{Tr}(\mathsf D e^{-s\mathsf A})
 =\sum_{p,m}\log p\,p^{-ms}=-\zeta'(s)/\zeta(s).
\]

The same source explicitly distinguishes the completed functional equation from an individual pairing of prime-power basis vectors. In particular, no unitary operator on this Hilbert space implementing \(s\mapsto1-s\) is supplied by writing the functional equation.

**Proposition 1 (ramp trace).** For \(X\ge1\), let

\[
R_X=(Xe^{-\mathsf A}-I)_+
\]

by diagonal functional calculus. Then \(R_X\) has finite rank, and

\[
\operatorname{Tr}(\mathsf D R_X)
 =\sum_{n\le X}\Lambda(n)(X/n-1).
\]

Thus the displayed formula for \(G_\zeta\) above is exact. Also,

\[
\int_1^\infty \operatorname{Tr}(\mathsf D R_X)X^{-s-1}\,dX
 =\frac{\operatorname{Tr}(\mathsf D e^{-s\mathsf A})}{s(s-1)}
 \qquad(\Re s>1).
\]

**Proof.** The diagonal entry of \(R_X\) at \((p,m)\) is \((X/p^m-1)_+\); only the finitely many prime powers \(p^m<X\) contribute. Prime powers have von Mangoldt weight \(\log p\). For \(n\ge2\),

\[
\int_n^\infty (X/n-1)X^{-s-1}\,dX
 =\frac{n^{-s}}{s(s-1)}.
\]

Absolute convergence for \(\Re s>1\) permits summation and integration to be exchanged. This proves the result.

**Character version.** For a Dirichlet character \(\chi\), define the bounded diagonal operator

\[
U_\chi e_{p,m}=\chi(p)^m e_{p,m}.
\]

It is a contraction; at ramified primes its entries vanish, so it is not generally a unitary on the full ladder. Then

\[
\operatorname{Tr}(\mathsf D U_\chi R_X)
 =\sum_{n\le X}\Lambda(n)\chi(n)(X/n-1),
\]

and the corresponding Mellin transform is

\[
\frac{-L'(s,\chi)/L(s,\chi)}{s(s-1)}.
\]

For a nonprincipal character, the source's \(g_\chi\) adds \(X L'(1,\chi)/L(1,\chi)\); the modulus-one character uses the zeta centering above. The full source hypotheses on character families and nonvanishing at one remain necessary.

**What this achieves.** It identifies the exact observable which a proposed lift must estimate directly from the prime model. It is more concrete than asking for an unspecified Gram representation. Positivity of \(R_X\) supplies only positivity of the uncentered sum; subtracting \(X\log X-(1+\gamma_E)X\) creates the signed error whose square-root size is unproved. A positive functional-calculus formula for the uncentered sum does not estimate that error.

## 2. What a two-leg change of coordinates preserves

Let \(A,B:E\to H\) satisfy \(A^*A=B^*B=R\), and put \(C=A^*B\). Their joint Gram matrix is

\[
G=\begin{pmatrix}R&C\\C^*&R\end{pmatrix}.
\]

If \(C=C^*\), the unitary Hadamard change of variables gives

\[
\frac1{\sqrt2}\begin{pmatrix}I&I\\I&-I\end{pmatrix}
G
\frac1{\sqrt2}\begin{pmatrix}I&I\\I&-I\end{pmatrix}
=\begin{pmatrix}R+C&0\\0&R-C\end{pmatrix}.
\]

Without the self-adjointness of \(C\), an off-diagonal block containing \((C-C^*)/2\) remains. In either case,

\[
\|G-I\|_{\rm HS}^2
=2\|R-I\|_{\rm HS}^2+2\|C\|_{\rm HS}^2.
\]

These formulas follow by block multiplication and summing the squared norms of the blocks. Cancellation of the signed cross term in the sum of the two channel energies is real algebraic cancellation. It does not cancel \(\|C\|_{\rm HS}^2\), which is the nonnegative quantity in the correlation estimate.

Similarly, a normalized theta lift which is an isometry on the same source module preserves inner products. If \(T_j^*T_j=c_jI\) on the required images, the normalized composite \((\prod_j c_j)^{-1/2}T_m\cdots T_1\) is an isometry. Repeating such lifts does not itself decrease correlations between two vectors carried through the same sequence. Different embeddings, intermediate projections, or arithmetic averaging require additional analysis; their costs cannot be discarded.

**Parity normalization.** Even granting ideal mixing independently in two parity spaces of dimensions \(D_+=\alpha D\), \(D_-=(1-\alpha)D\), with \(d_u^+=p_ud_u\), \(d_u^-=(1-p_u)d_u\), the combined normalization is

\[
\frac{d_u^+d_v^+}{D_+}+\frac{d_u^-d_v^-}{D_-}
=\frac{d_ud_v}{D}\left(1+
\frac{(p_u-\alpha)(p_v-\alpha)}{\alpha(1-\alpha)}\right).
\]

Balanced proportions \(p_u=p_v=\alpha\) reproduce the original scale exactly. Splitting into two equal channels does not yield an extra factor of two after dimensions are accounted for. This formula does not assume, or prove, that the actual arithmetic images satisfy those ideal mixing hypotheses.

## 3. An exact obstruction for two involutions

**Theorem 2.** Let \(H\) be a complex Hilbert space of finite dimension \(D>2\), and let \(U,V\) be unitary operators with \(U^2=V^2=I\). There is a nonzero self-adjoint traceless operator \(Q_0\) such that

\[
gQ_0g^*=Q_0
\]

for every \(g\) in the group generated by \(U,V\), and also for every \(g\) in its closure. Therefore every probability average of these conjugations fixes \(Q_0\). Such averages, and any repeated compositions of them, cannot contract every traceless Hilbert–Schmidt operator by a factor strictly less than one or converge to \(Q\mapsto(\operatorname{Tr}Q/D)I\) on all matrices.

**Proof.** Set \(W=UV\). It is unitary and \(UWU=W^*\). Choose a unit eigenvector \(v\) with \(Wv=\lambda v\), \(|\lambda|=1\). Then

\[
W(Uv)=U(W^*v)=\overline\lambda Uv.
\]

The space \(E=\operatorname{span}\{v,Uv\}\) has dimension one or two and is invariant under \(U\) and \(W\), hence under \(V=UW\). Since the operators are unitary and \(E\) is finite dimensional, \(E\) is reducing. Because \(D>2\), it is nonzero and proper. Its orthogonal projection \(P\) commutes with \(U,V\). With \(r=\dim E\), take

\[
Q_0=P-\frac rD I.
\]

This is nonzero, self-adjoint and traceless. It commutes with every word, and by continuity with the closure, proving every assertion.

**Scope.** The theorem applies to two fixed unitary involutions on one finite-dimensional complex Hilbert space. It does not apply to an arbitrary growing family of distinct involutions, to additional shift/phase operators, or automatically to an analytic functional-equation reflection for which a unitary realization has not been given. Dimension two is deliberately excluded: the Pauli involutions generate a conjugation average which does depolarize two-by-two matrices.

For the raw prime ladder, the available diagonal prime operators and a purely formal leg swap have an even more visible limitation: they preserve each fixed rung's subspace. Their algebra cannot mix different prime-power rungs. A proposed arithmetic bridge must add an actual operator that connects those spaces with the required norm and error control.

## 4. The finite Heisenberg calculation that does supply the dimension factor

Let \(H=\mathbb C^D\), with orthonormal basis \(e_r\), \(r\in\mathbb Z/D\mathbb Z\), and \(\omega=e^{2\pi i/D}\). Define

\[
Xe_r=e_{r+1},\qquad Ze_r=\omega^r e_r,
\qquad ZX=\omega XZ.
\]

**Theorem 3 (complete shift-and-phase average).** For every operator \(Q:H\to H\),

\[
\mathcal T(Q):=\frac1{D^2}\sum_{a,b\bmod D}
X^aZ^bQZ^{-b}X^{-a}
=\frac{\operatorname{Tr}Q}{D}I.
\]

**Proof.** In the basis \(e_r\), averaging over \(b\) multiplies \(Q_{rs}\) by

\[
\frac1D\sum_{b=0}^{D-1}\omega^{b(r-s)}=\mathbf1_{r=s}.
\]

It therefore keeps exactly the diagonal. Averaging over \(a\) cyclically translates that diagonal; each final diagonal entry becomes its mean, \(\operatorname{Tr}Q/D\).

**Corollary 4 (cross-term moment).** For arbitrary linear maps \(A:\mathbb C^{d_A}\to H\), \(B:\mathbb C^{d_B}\to H\),

\[
\frac1{D^2}\sum_{a,b}\|A^*X^aZ^bB\|_{\rm HS}^2
=\frac{\|A\|_{\rm HS}^2\|B\|_{\rm HS}^2}{D}.
\]

If \(A,B\) are isometries, the right side is \(d_Ad_B/D\).

**Proof.** Set \(P=AA^*\), \(Q=BB^*\), and \(W=X^aZ^b\). Cyclicity of the finite trace gives

\[
\|A^*WB\|_{\rm HS}^2=\operatorname{Tr}(PWQW^*).
\]

Apply Theorem 3 and \(\operatorname{Tr}P=\|A\|_{\rm HS}^2\), \(\operatorname{Tr}Q=\|B\|_{\rm HS}^2\).

**A necessary distinction.** For \(A=B\) an isometry of rank \(d<D\), the selected word \(W=I\) gives \(\|A^*WB\|_{\rm HS}^2=d\), while the complete average equals \(d^2/D<d\). Thus an averaged bound cannot be silently applied to every selected word or pair. Markov's inequality yields only a proportion statement, not the source's near-optimal uniform correlation estimate.

Applying a common unitary to every image also changes nothing: \((WA)^*(WB)=A^*B\). The averaging above concerns relative transformations. Enlarging the ambient space with independent labels can manufacture orthogonality, but then the ambient dimension and the source's dimension budget must be recomputed.

## 5. Quantifying what an approximate averaging theorem would need

Let \(\mathcal T_\mu(Q)=\mathbb E_\mu[WQW^*]\) be a probability average of unitary conjugations. Suppose it has the independently proved bound

\[
\|\mathcal T_\mu(Q_0)\|_{\rm HS}\le\delta\|Q_0\|_{\rm HS}
\quad\text{for all traceless }Q_0.
\]

For orthogonal projections \(P,Q\) of ranks \(d,e\), respectively, trace centering and Cauchy–Schwarz give

\[
\left|\operatorname{Tr}(P\mathcal T_\mu(Q))-\frac{de}{D}\right|
\le\delta\sqrt{d(1-d/D)e(1-e/D)}.
\]

Indeed, use \(P_0=P-(d/D)I\), \(Q_0=Q-(e/D)I\); their squared Hilbert–Schmidt norms are \(d-d^2/D\), \(e-e^2/D\), and a unitary conjugation average is unital and trace preserving.

If \(d=e=D/\Gamma^2<D\), the sufficient condition delivered by this bound for relative error at most \(\eta\) is

\[
\delta\le\frac{\eta}{\Gamma^2-1}.
\]

This is a concrete quantitative target, not a proven arithmetic estimate. The source uses comparability \(d_u\Gamma^2/D_*\asymp1\), exponentially small error parameters, diagonal defects, and a total-dimension condition. A bounded parity change provides no such contraction. Theorem 2 gives a traceless direction with contraction factor exactly one for averages generated by two fixed involutions.

Even establishing this approximate **average** would not by itself establish the source's **every distinct pair** version. One must identify the actual correlation operators and either show that the arithmetic expression already contains the controlled average or supply a separate uniform/concentration argument with its dimension and family-size costs.

## 6. Does the existing theta/Hecke/metaplectic work realize the required action?

The inspected sources do not construct the finite shift-and-phase action on the relevant lift images.

1. **The raw twin ladder.** Its prime-power trace formulas are exact. Its reflection joins completed analytic outputs, not individual prime basis vectors. The source's own permutation/no-gain lemma explains that an isometric coordinate change needs a further compression or estimate to improve a bound.

2. **PR61 `h-metaplectic-spin`.** The corrected Hecke eigencondition is local multiplicativity \(a(p^km)=a(p^k)a(m)\) for \((p,m)=1\), with a specific recursion on prime powers. The operator is a weighted sum of shears and rescalings of theta sections. This is useful arithmetic structure, and it separates the Davenport–Heilbronn mixture in the stated sense. It is not a finite-dimensional pair of unitary operators satisfying \(ZX=\omega XZ\) on the lift image with uniform averaging weights. The source's internal referee also distinguishes the defined use of the imaginary geodesic from information loss: holomorphic theta is determined by its restriction to that geodesic. One must not overstate a symmetry-only obstruction as saying the rest of theta is unknowable.

3. **PR61 `c14-theta-orthogonal-metaplectic-eigenobject`.** At \(s_\rho=1/4+\rho/2\), the Hecke eigenvalue is \(p^{\rho-1/2}+p^{1/2-\rho}\). The square-index row vanishes at the zeta zero, with the 2-adic qualification handled separately in the audit. This is a first-moment/row cancellation. The second-moment constant-term exponents remain, with the claimed rightmost pole \(1+|\beta-1/2|\) and gamma threshold \(|\beta-1/2|\); their difference stays one. The regularized Rankin–Selberg dependency is explicitly not opened in that lane. Nothing constructs the finite Hilbert space, relative shift/phase orbit or uniform cross-correlation bound needed above. The one-dimensional span of a single specified eigenform cannot itself carry a nontrivial Weyl pair: two invertible scalar operators commute, contradicting \(ZX=\omega XZ\) when \(\omega\ne1\). An enlarged representation is possible in principle, but it is additional construction.

4. **PR61 `c20-u6ab-rank2-metaplectic-eigenobject-verdict`.** The degenerate \(GL_3\) constant term has coefficients \(\xi^*(2u),\xi^*(2u-1),\xi^*(2u-2)\). At \(2u=1+\rho\) the middle term disappears; the surviving exponents do not jointly become square integrable. The required truncated norm was not derived, and the double-cover case remains argued from recalled formulas. These are exactly the places where an actual norm computation could add information; there is currently no norm/Heisenberg identification to import. The internal audit corrects the Rankin–Selberg product and retains a shift-independent, nonrestrictive conclusion.

5. **PR61 `ap-squares-rallis`.** The mixing-flow obstruction does not exclude a definite target, source-side insertion, appropriate Hecke/Casimir evolution, or truncated/noncovariant constructions. Hence the present analysis does not declare an arithmetic theta-lift completion impossible. It identifies what an additional construction would need to do. A Rallis norm formula, a Hecke eigenrelation, and the required relative second-moment estimate are different statements.

The finite Heisenberg representation is related in general to Weil/metaplectic constructions, but that shared terminology is not an intertwining identity. To apply Corollary 4 here one must specify the finite space, its positive inner product, both unitary actions, the maps representing the tests, and the actual averaging measure, then account for the diagonal defects and ambient dimension. None of these identifications follows merely from the word “metaplectic.”

## 7. Concrete next theorem, with no hidden RH endpoint

A nontrivial completion attempt can now be posed more precisely: construct arithmetic maps \(A_u\) into a specified finite positive Hilbert space, and prove an identity expressing the source correlation operator, or its squared norm, through an explicitly controlled shift-and-phase average. Preserve the prime/character ramp observable of Proposition 1 and keep the lift costs, diagonal errors and dimension budget in the same statement.

This would materially use the model. It would provide a proved quantitative arithmetic averaging estimate rather than another assertion that the final Weil form is positive. It must also survive the selected-word counterexample: an average over the full Weyl group is insufficient if the proof uses individual relative words.

No such arithmetic identification or estimate was established in this analysis. The actual progress is the exact ramp transport, the exact average yielding the required dimension scale, and the rigorous explanation of why two-leg parity alone cannot supply it. These results make the unresolved construction substantially more specific without treating it as solved.

## 8. Verification and sources

[check_ramp_averaging.py](check_ramp_averaging.py) and [RAMP_AVERAGING_CHECKS.json](RAMP_AVERAGING_CHECKS.json) record nine exact finite SymPy checks. They include the arbitrary symbolic four-by-four twirl, a selected-word counterexample, a nonzero traceless fixed direction for two involutions, the two-channel Gram identity and dimension normalization, and the prime-ramp trace at \(X=12\). They do not certify an arithmetic estimate or RH. The general statements above are proved in prose.

Source identities and content newly inspected for this continuation:

- [Permutation architecture manuscript](https://chatgpt.com/library?file_id=libfile_ce8fb8b39cbc819186e35affea68e3a1&account_id=personal): extracted lines 217–251 and 355–424, including the actual prime operators, reflection boundary, permutation defect and modulus/no-gain discussion.
- [Kramers–Wannier stage audit](https://chatgpt.com/library?file_id=libfile_1da8ef9fde088191afd4ba91e49be666&account_id=personal): extracted lines 435–567. Its exact supertrace cancellation and transported Dirichlet product do not give pointwise inversion or a zero-free estimate.
- [PR61 metaplectic-spin result](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/h-metaplectic-spin/RESULT.md) and [internal audit](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/h-metaplectic-spin/REFEREE.md).
- [PR61 c14 result](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/c14-theta-orthogonal-metaplectic-eigenobject/RESULT.md) and [internal audit](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/c14-theta-orthogonal-metaplectic-eigenobject/REFEREE.md).
- [PR61 c20 result](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/c20-u6ab-rank2-metaplectic-eigenobject-verdict/RESULT.md) and [internal audit](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/c20-u6ab-rank2-metaplectic-eigenobject-verdict/REFEREE.md).
- [PR61 Rallis result](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/ap-squares-rallis/RESULT.md) and [internal audit](https://github.com/judegomila/mathexplorer/blob/753fdc475c85ce347b6994d561919ffdf7b6815a/research-checkpoints/rh-push-2026-11-16/fleet-lanes/ap-squares-rallis/REFEREE.md).
- [External `GlobalTheoremInputs.lean`](https://github.com/Deicyde/riemann-hypothesis/blob/40e56bab026552e089d7afcfeff08d2defb9c005/src/Formalism/SharpRestriction/GlobalTheoremInputs.lean): exact `LinkS_at` and `LinkS` definitions; off-diagonal squared norms, diagonal Hilbert–Schmidt defect, dimension control and comparability hypotheses. These are source propositions, not proof instances validated here.
- [External character/ramp definitions](https://github.com/Deicyde/riemann-hypothesis/blob/40e56bab026552e089d7afcfeff08d2defb9c005/src/Formalism/SharpRestriction/GlobalSchurBounds/GeneralLinearActions/FiltrationCocycleLiftCriterion.lean): `G`, `sumLamChi`, `gChi`, and the exact identification with `Gfun`.

All historical status statements above refer to these pinned sources and their internal review, not an independent rerun of the full historical computational or external Lean development.


## 9. OPEN_THEOREM: arithmetic realization, uniform correlations, and ramp extraction

The following is an explicit **open construction target**, not a theorem established by this note. The analytic implication from its stated estimates is elementary; finding arithmetic data which satisfy them is the substantive missing work.

For each sufficiently large arithmetic scale \(X\), construct from specified prime, character, local-theta and completion data:

- a finite family of actual arithmetic lift words \(\mathcal W_X\), a positive Hilbert space \(H_X\) of dimension \(D_X\), spaces \(E_{X,u}\) of dimensions \(0<d_{X,u}<D_X\), and isometries \(A_{X,u}:E_{X,u}\to H_X\);
- the actual relative correlation maps \(K_{X;u,v}:E_{X,v}\to E_{X,u}\) which occur in the lift argument;
- for **each** distinct pair \(u,v\), an arithmetically specified probability family of unitaries \(W_{X;u,v,\omega}\) on \(H_X\), with conjugation average \(\mathcal T_{X;u,v}\), and an explicit nonnegative error \(r_{X;u,v}\).

These objects must be defined independently of RH and of an assumed positive realization of the final Weil form. Prove the following identities or estimates with the actual source normalizations.

**(A) Relative arithmetic moment comparison, for every distinct pair.**

\[
\|K_{X;u,v}\|_{\rm HS}^2
\le
\mathbb E_\omega\|A_{X,u}^*W_{X;u,v,\omega}A_{X,v}\|_{\rm HS}^2
+r_{X;u,v}.
\]

**(B) Arithmetic contraction and full error allocation, again for every distinct pair.** Prove for every traceless operator \(Q_0\) on \(H_X\),

\[
\|\mathcal T_{X;u,v}(Q_0)\|_{\rm HS}
\le\delta_{X;u,v}\|Q_0\|_{\rm HS},
\]

and prove the quantitative budget

\[
\delta_{X;u,v}
\sqrt{d_{X,u}(1-d_{X,u}/D_X)d_{X,v}(1-d_{X,v}/D_X)}
+r_{X;u,v}
\le
\eta_X\frac{d_{X,u}d_{X,v}}{D_X}.
\]

The preceding lemma then gives, for every distinct pair,

\[
\|K_{X;u,v}\|_{\rm HS}^2
\le(1+\eta_X)\frac{d_{X,u}d_{X,v}}{D_X}.
\]

In the exactly balanced, zero-comparison-error case
\(d_{X,u}=D_X/\Gamma_X^2\), \(\Gamma_X>1\), and \(r_{X;u,v}=0\), the contraction requirement is precisely

\[
\boxed{\delta_{X;u,v}\le\eta_X/(\Gamma_X^2-1).}
\]

If the comparison has nonzero errors, they consume part of the same budget. If the dimensions are merely comparable, use the full displayed inequality rather than silently replacing it by the balanced formula. Match \(D_X\), \(\Gamma_X\) and \(\eta_X\) to the actual `LinkS` quantities and decay requirements. The diagonal defect and total-dimension estimates in `LinkS` remain additional obligations; they do not follow from the off-diagonal moment identity.

A bound averaged over \(u,v\), or a complete Heisenberg average with no arithmetic comparison (A), does **not** fulfill this target. The every-pair quantifier belongs to (A) and (B), not just to a subsequently chosen abstract averaging model. Additional concentration, selection or enlargement arguments must explicitly account for their losses and ambient dimensions.

**(C) Centered-ramp extraction and complete cost.** Independently prove how these maps and their arithmetic multiplicity/divisibility information control the signed centered trace

\[
G_\zeta(X)=\operatorname{Tr}\!\left[\mathsf D(Xe^{-\mathsf A}-I)_+\right]
-X\log X+(1+\gamma_E)X.
\]

In particular, a sufficient full-ray endpoint is a fixed sign \(\varepsilon_0\in\{1,-1\}\) and, for every \(\varepsilon>0\), a derived bound

\[
\varepsilon_0G_\zeta(X)\le\mathcal C_\varepsilon(X)
\le C_\varepsilon X^{1/2+\varepsilon}
\quad\text{for all sufficiently large }X.
\]

Here \(\mathcal C_\varepsilon\) must be an explicit cost expression derived from the constructed arithmetic objects. It must include all lift/rank growth, local and archimedean terms, comparison errors, exceptional contributions, diagonal defects, dimension inflation and truncation tails that arise. Merely declaring \(\mathcal C_\varepsilon\) to be the desired bound supplies no proof. A multiplicative-window endpoint is a different option with its own source hypotheses and unverified dependency chain; it must not be silently substituted for the full-ray endpoint.

Parts (A) and (B) isolate a specific arithmetic second-moment mechanism. Part (C), the construction of the families, and the complete cost bound are still open. The finite-dimensional identities in this note establish none of those arithmetic existence or saving claims.
