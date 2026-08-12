# Suzuki screw-function source candidate audit

## 0. Status and scope

This is a read-only candidate-source audit of Masatoshi Suzuki,
*Weil's quadratic form via the screw function*,
[arXiv:2606.09096v1](https://arxiv.org/abs/2606.09096v1), submitted
2026-06-08.  The theorem statements and displayed formulas below were checked
against the official arXiv v1 HTML.  The source is **not admitted**, is **not
in a source lock**, and is not used by any producer, verifier, artifact, or
status claim in this repository.

The useful outcome is narrow.  Theorem 1.5 proposes a continuum
self-adjoint-extension characteristic function whose zeros are real without a
ground-state simplicity or parity hypothesis.  It does not prove the
large-interval limit needed for a direct RH argument, and it does not prove
the existing finite Weil-matrix ground gate.  Moreover, the v1 text has an
analytic problem in Corollary 1.6 and two proof/formula passages that require
resolution before this paper could be admitted as a binding source.

## 1. Convention map

To avoid a collision of notation, write `Lambda=e^a` for the dilation
parameter used by this project and write `tau` for Suzuki's spectral shift,
which the paper denotes by `lambda`.

| Item | Suzuki v1 | This project | Map |
|---|---|---|---|
| localized interval | `[-a,a]` | centered logarithmic interval `[-log Lambda,log Lambda]` | `a=log Lambda` |
| interval length | `2a` | `L=2 log Lambda` | `L=2a` |
| measure | Lebesgue `dx` | multiplicative `du/u`, hence Lebesgue after `x=log u` | identical after centering |
| extension | zero outside `[-a,a]` | zero outside the logarithmic interval | identical |
| Fourier transform | `hat f_S(z)=int f(x)e^(+izx) dx`, equation (1.2) | `hat f_P(z)=int f(x)e^(-izx) dx` in centered log coordinates | `hat f_S(z)=hat f_P(-z)` |
| arithmetic cutoff | `n<=exp(2a)`, equation (2.7) | `n<=Lambda^2` | identical |
| prime sign | minus | minus | identical |
| completed function | `xi_S(s)=s(s-1)pi^(-s/2)Gamma(s/2)zeta(s)` | `xi_P(s)=xi_S(s)/2` | zeros agree; `xi/xi'` is scale invariant |

Thus Suzuki's `xi_S(1/2-iz)` is twice the project's
`Xi(-z)=Xi(z)`.  The sign change is harmless for this even target but is not a
license to change the pinned Fourier sign in the finite matrix code.  A
Suzuki characteristic function would have to be reflected as `z -> -z`
before being compared entrywise with project formulas.

The paper's explicit screw kernel, equation (1.3), contains the finite sum

\[
 \sum_{n\leq e^{|t|}}{\Lambda(n)\over\sqrt n}(|t|-\log n),
\]

and its Fourier quadratic-form formula (2.7) has the prime contribution

\[
 -{1\over2\pi}\int |\widehat v(z)|^2
   \left(2\sum_{n\leq e^{2a}}{\Lambda(n)\over\sqrt n}
   \cos(z\log n)\right)dz.
\]

This independently agrees with the inclusive `Lambda^2` cutoff and the minus
sign already pinned here.  It is corroboration, not a replacement source for
the finite entries of `Q_(Lambda,N)`.

## 2. Exact scope of the stated results

### Theorem 1.1

Let `G_a=P_a G P_a` on the mean-zero subspace of `L2(-a,a)`, let
`D=i d/dx` with Dirichlet domain `H_0^1(-a,a)`, and put

\[
 B_a=D^*G_aD.
\]

The theorem identifies the canonical self-adjoint operator `A_a`
representing the localized closed Weil form with the Friedrichs extension of
`B_a`.  This is a useful continuum representation, but it is not a finite
matrix theorem and supplies no large-`a` ground gap.

### Theorem 1.3

The bottom eigenvalue

\[
 \lambda_a=\inf_{v\ne0}{Q_W^a(v)\over\|v\|_2^2}
\]

is continuous in `a`.  Together with positivity for sufficiently small `a`,
this recovers the zero-crossing consequence if RH fails.  Continuity does not
give positivity, simplicity, parity, or a quantitative spectral gap as
`a -> infinity`.

### Theorem 1.4

For sufficiently small `a`, the bottom eigenvalue is positive and simple,
its eigenfunction is even, and

\[
 \lambda_a=\log(1/a)+\mu_1-\log(2\pi)+\psi(2)-1+O(a),
 \qquad \mu_1>0.
\]

This is the opposite asymptotic regime from the project target
`a=log Lambda -> infinity`.  It concerns the continuum operator, not every
finite Galerkin compression.  It therefore does not remove the project's
large-`Lambda`, finite-`N` simple-even gate.

### Theorem 1.5

Choose a real shift `tau<lambda_a` and set `T_a=A_a-tau I>0`.  Complete
`C_c^\infty(-a,a)` in the `T_a` form norm and consider `i d/dx` in that
Hilbert space.  The paper states deficiency indices `(1,1)`.  If `v_+` and
`v_-` are equal-norm deficiency vectors for `+i` and `-i`, respectively, it
defines

\[
 W(a,\theta;z)
 =(z-i)\int_{-a}^a v_+(a,x)e^{izx}\,dx
 +e^{i\theta}(z+i)\int_{-a}^a v_-(a,x)e^{izx}\,dx .
\]

The theorem states that `W` is entire, its zeros are precisely the
eigenvalues of a self-adjoint extension, and all those zeros are real.
Unlike the CCM finite determinant theorem, this statement does not assume a
simple even ground state.

The price is that `W` is a different object.  It is built from continuum
resolvent/deficiency vectors, depends a priori on the shift `tau`, and is not
the Fourier transform of the prolate comparison state or of the finite ground
vector.  No theorem in v1 identifies it with the existing finite determinant
or controls it as `a -> infinity`.

### Corollary 1.6

The printed conditional target is

\[
 e^{\phi(a,z)}W(a,\theta(a);z)
 \longrightarrow
 z^2{\xi_S(1/2-iz)\over\xi_S'(1/2-iz)}             \tag{2.1}
\]

uniformly on every compact subset of `C`.  The paper then says this would
imply RH.  The source itself calls the limit conjectural; Section 7 assumes RH,
and Section 8.3 again assumes RH when it sets `tau=0` and derives the heuristic
Fourier relation.  The text explicitly says that controlling `tau<lambda_a`
for a proof is expected to require detailed arithmetic analysis beyond
Theorem 1.5.

## 3. Does Theorem 1.5 remove the simple-even gate?

There are two different answers.

1. **For the current finite Xi--prolate--Weil route: no.**  Nothing in this
   source proves that the lowest eigenvalue of `Q_(Lambda,N)` is simple and
   inversion even on an unbounded schedule, nor does it prove the residual,
   complementary floor, or projective low-mode estimate.  Theorem 1.4 is only
   a small-`a` continuum statement.
2. **For a different continuum characteristic-function route: formally
   yes.**  If Theorem 1.5 and its proof are accepted, every fixed `a` has a
   real-zero entire `W` without selecting a ground vector.  This replaces the
   old gate by three new ones: an unconditional controlled choice
   `tau(a)<lambda_a`, a controlled phase `theta(a)` and nonvanishing
   holomorphic normalization, and a corrected locally uniform meromorphic
   limit theorem.

That substitution could be relevant to future work because the deficiency
vectors are resolvent responses, schematically

\[
 v_\pm=(A_a-\tau I)^{-1}e^{\pm x},
\]

rather than ground states.  It suggests a possible finite resolvent lane, but
the paper provides neither a source-normalized finite discretization theorem
nor asymptotic estimates connecting these vectors to the prolate state.

## 4. Compact-uniform limit obstruction in Corollary 1.6

Put

\[
 X(z)=\xi_S(1/2-iz).
\]

Then `X'(z)=-i xi_S'(1/2-iz)`, so the proposed target is

\[
 R(z)=-i z^2{X(z)\over X'(z)}.                     \tag{4.1}
\]

This is meromorphic, not entire.  At a zero `rho != 0` of `X` of
multiplicity `m`, the quotient `X/X'` has a removable continuation with a
simple zero:

\[
 {X(z)\over X'(z)}={z-\rho\over m}+O((z-\rho)^2).
\]

But at every critical point `c` with `X'(c)=0` and `X(c)!=0`, `R` has a
pole.  Such points are unavoidable: `X` is real on the real axis and has
infinitely many distinct real zeros unconditionally, so Rolle's theorem
places a derivative zero with nonzero `X` between consecutive zeros.  The
factor `z^2` addresses the symmetry-forced derivative zero at the origin; it
does not cancel these other poles.

Consequences:

- Ordinary finite-valued uniform convergence on **every** compact subset of
  `C` cannot be stated at a compact containing one of these poles.
- If each `phi(a,.)` is entire, then `exp(phi)W` is entire and nonvanishing
  normalization preserves the real zero set.  Ordinary compact convergence
  would force a finite entire limit by the Weierstrass theorem, contradicting
  (4.1).
- The paper only requires `phi(a,z) != infinity`; it does not state that
  `phi(a,.)` is holomorphic.  Without holomorphy, the Hurwitz/Rouche transfer
  from real-zero approximants is not justified.

A coherent replacement would have to specify the meromorphic target and its
removable values, require `exp(phi(a,.))` to be holomorphic and nowhere zero,
and state convergence on pole-free compacta (with the additional local
control needed near each zero of `X`) or in an explicitly defined
meromorphic topology.  Near any nonreal zero of `X`, the continued target is
holomorphic with a simple zero, so a suitable local Euclidean convergence
statement would still support a Hurwitz argument.  That corrected statement
is not proved in v1.

Therefore Corollary 1.6, read with the usual meaning of uniform convergence
on compact subsets of `C`, is at best underspecified and at worst has an
inconsistent hypothesis.  It cannot presently serve as an admitted
determinant-limit theorem.

## 5. Two additional v1 audit flags

These are source-confidence flags, not claims that the underlying ideas are
irreparable.

### 5.1 Adjoint-domain norm implication

Section 6.2 says that continuity of
`u -> <D_a u,v>_(T_a)` in the `T_a` norm implies continuity in the `L2`
norm, and uses this to require `v'` and `(A_a v)'` to lie in `L2`.  But, for
`tau<lambda_a`,

\[
 \|u\|_{T_a}^2\geq(\lambda_a-\tau)\|u\|_2^2.
\]

This inequality makes `L2`-continuity imply `T_a`-continuity, not conversely.
The form norm is strictly stronger for the unbounded operator.  Thus the
displayed inclusion for the adjoint domain and the subsequent identity

\[
 T_a(D_a^*v)=i(T_av)'
\]

need a separate Hilbert-scale or distribution/dual-space proof.  A repair via
`T_a^{-1}` may well exist, but the printed implication does not supply it.
Because the deficiency-index computation and the characteristic function use
this passage, Theorem 1.5 should be independently repaired before admission.

### 5.2 Section 8.3 substitution

Section 8.3 obtains

\[
 \widehat v_{a,\pm}=\widehat h_{a,\pm}/\widehat g,
 \qquad
 {1\over\widehat g(z)}
 =z^2{\xi_S(1/2-iz)\over\xi_S'(1/2-iz)}.
\]

Substitution into the definition of `W` gives algebraically

\[
 W={1\over\widehat g}
 \left((z-i)\widehat h_{a,+}
 +e^{i\theta}(z+i)\widehat h_{a,-}\right).          \tag{5.1}
\]

The printed next display instead leaves `widehat v_(a,+/-)` inside the
parentheses while also multiplying by `1/hat g`.  That would introduce the
factor twice and is not the stated substitution.  Formula (5.1), presumably
the intended identity, changes the exact object whose convergence to one
must be proved in order to motivate (2.1).

## 6. Admission verdict and possible use

Do not add arXiv:2606.09096v1 to `P0_SOURCE_LOCK.json` on the basis of this
audit.  In particular, do not replace the present finite simple-even gate by
the assertion that Suzuki has solved it.

The source is nevertheless a useful research candidate after repair because
it points to a genuinely different object: a real-zero continuum
characteristic function driven by two resolvent vectors rather than a ground
state.  A disciplined follow-up would require, in this order:

1. repair and independently prove the Hilbert-scale adjoint/deficiency
   argument;
2. correct the Section 8.3 `h`/`v` substitution and state a precise
   meromorphic convergence theorem;
3. derive an explicit unconditional lower shift `tau(a)<lambda_a` and track
   its effect on `W`;
4. construct a finite source-normalized resolvent approximation with two
   independent assembly paths; and
5. prove local convergence near zeros, rather than compare only real-axis
   eigenvalues.

Until those steps are complete, the source supplies an alternative attack
blueprint, not a theorem that advances the formal project state.
