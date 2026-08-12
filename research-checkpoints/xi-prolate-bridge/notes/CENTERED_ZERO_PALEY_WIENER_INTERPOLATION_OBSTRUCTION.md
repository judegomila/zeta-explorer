# Centered-zero Paley--Wiener uniqueness and interpolation obstruction

## 0. Claim boundary and outcome

This note audits whether the complete centered zero set can turn the
projected-anchor divisor and the all-vector radical lifts into a lower frame
bound for the retained even coframe.

There are three exact conclusions.

1. With algebraic multiplicities represented by derivative jets, the
   centered nontrivial-zero multiset is a uniqueness set for every compact
   Paley--Wiener space.
2. The same multiplicity density makes it impossible to perform cardinal or
   Hermite interpolation at that complete multiset inside any finite
   exponential type.  In particular, the exact global radical divisor cannot
   be replaced by a compact Paley--Wiener divisor or by a Paley--Wiener
   Lagrange family.
3. The projected anchor gives the opposite of a full-space lower sampling
   bound: on the locked diagonal, the least ordinary paired-sampling frame
   constant on the complete finite even space is at most the already proved
   normalized remainder shift `U_Z=o(d_6)`.

These statements do not decide the retained signed coframe
`beta_lambda`.  Its domain has the distinguished anchor direction removed,
its argument is the harmonic graph lift, and its numerator is a signed
operator rather than the positive sampling norm.  A restricted second
singular-value theorem would still not by itself supply the missing signed
orientation.

No zero is assumed real or simple, and no zero table is used.  The only zero
count used below is the multiplicity-aware HSW theorem already pinned in
`ZERO_SAMPLING_SOURCE_LOCK.json`.  This note proves no shifted sector sign,
no instance of equation (5.2) of `DIRECT_RH_ATTACK.md`, no locally uniform
determinant convergence, and no Riemann-hypothesis conclusion.  The formal
project state remains `P0_INVALIDATED`.

## 1. The compact transform and the centered multiset

For `a>0`, let

\[
 PW_a^2=\left\{A_f(z)=\int_{-a}^a f(y)e^{-zy}\,dy:
                    f\in L^2([-a,a])\right\}.             \tag{1.1}
\]

This is the bilateral-Laplace version of the compact Paley--Wiener space.
The angular transform used by the paired zero-sampling map is obtained by
the rotation `z mapsto i*z`; this rotation changes neither exponential type
nor zero multiplicity.

Let

\[
 \mathcal Z_c^\sharp
 =\{z:\xi(1/2+z)=0\}                                   \tag{1.2}
\]

denote the set of distinct centered zero locations, and let `m(z)` be the
algebraic multiplicity at `z`.  Thus the multiset used in the centered
Hadamard product is

\[
 \mathcal Z_c=\{(z,j):z\in\mathcal Z_c^\sharp,
                         0\leq j<m(z)\}.                   \tag{1.3}
\]

It is invariant under `z mapsto -z` and `z mapsto conjugate(z)`, and every
member has `|Re(z)|<1/2`.  Nothing in the argument puts these locations on
the imaginary axis.

The distinction between (1.2) and (1.3) is essential.  Repeating a value
evaluation `m(z)` times is not the same as evaluating the jets
`A^(j)(z)`, `0<=j<m(z)`.  The finite Weil sampling sum repeats values with
algebraic multiplicity; the exact source divisor, by contrast, vanishes to
at least the algebraic multiplicity and therefore has the jet property.

## 2. Finite exponential type has only linearly many zeros

### Lemma 2.1 (Jensen bound)

If `A in PW_a^2` is not identically zero and `n_A(R)` counts its zeros in
`|z|<=R` with multiplicity, then

\[
 \boxed{n_A(R)=O_A(1+aR).}                              \tag{2.1}
\]

**Proof.**  Cauchy--Schwarz gives

\[
 |A(z)|\leq\sqrt{2a}\,\|f\|_2 e^{a|z|}.                 \tag{2.2}
\]

Choose `w` with `A(w)!=0` and apply Jensen's formula to
`G(ζ)=A(w+ζ)`, after factoring the finite order of a possible zero at
`ζ=0`.  Equation (2.2) gives

\[
 {1\over2\pi}\int_0^{2\pi}
       \log|G(Re^{i\theta})|\,d\theta\leq aR+O_A(1).
                                                               \tag{2.3}
\]

Jensen's formula first bounds the zero count in `|ζ|<=R/2` by
`(aR+O_A(1))/log(2)`.  Translating the disk center changes only its radius by
the fixed number `|w|`, proving (2.1).  \(\square\)

The same proof applies to compactly supported distributions: their
Paley--Wiener transforms acquire only a polynomial factor in (2.2), which
adds `O(log R)` rather than an `R log R` term to Jensen's bound.

The pinned HSW theorem gives, with algebraic multiplicity,

\[
 N(T)={T\over2\pi}\log {T\over2\pi e}+O(\log T),        \tag{2.4}
\]

for the positive-height nontrivial zeros.  If `rho=beta+i*gamma` and
`z=rho-1/2`, then

\[
 |z|^2=\gamma^2+(\beta-1/2)^2<\gamma^2+1/4.             \tag{2.5}
\]

Consequently the number of members of the centered multiset in a disk of
radius `R`, counted with algebraic multiplicity, is

\[
 \Omega(R\log R).                                      \tag{2.6}
\]

This use of multiplicity is unconditional and avoids any simplicity or
distinct-zero-density premise.

## 3. Uniqueness, but no Hermite interpolation

### Theorem 3.1 (multiplicity-aware Paley--Wiener uniqueness)

Let `A in PW_a^2`.  If

\[
 A^{(j)}(z)=0
 \quad\left(z\in\mathcal Z_c^\sharp,
             0\leq j<m(z)\right),                       \tag{3.1}
\]

then `A` is identically zero and hence `f=0` in `L2([-a,a])`.

**Proof.**  If `A` were nonzero, (3.1) and (2.6) would give
`n_A(R)=Omega(R*log R)`, contradicting Lemma 2.1.  Injectivity of the compact
Fourier transform then gives `f=0`.  \(\square\)

The theorem remains true in the inversion-even space.  There `A` is even,
and the conditions at `z` and `-z` are related by

\[
 A^{(j)}(-z)=(-1)^jA^{(j)}(z),                          \tag{3.2}
\]

but the zero count with multiplicity is unchanged.

### Theorem 3.2 (no cardinal or Hermite interpolation)

There is no Paley--Wiener function of finite exponential type whose
multiplicity-aware jet data vanish at every centered zero orbit except one
and are nonzero at that remaining orbit.  Therefore the complete
multiplicity-aware evaluation map has

1. no cardinal family;
2. no right inverse, bounded or unbounded, on any sequence space containing
   the finitely supported compatible jet data; and
3. no Hermite interpolation theorem onto all finitely supported compatible
   data.

The same conclusion holds after restricting to even functions and imposing
the compatibility (3.2).

**Proof.**  Suppose `A` realized data supported on one orbit.  At every
other centered location it would have a zero of order at least `m(z)`.
Removing the finitely many multiplicities belonging to the selected orbit
does not change the `Omega(R*log R)` lower count.  Lemma 2.1 forces `A=0`,
contradicting the prescribed nonzero datum.  \(\square\)

This is not a statement that the value-only map on the set of distinct zero
locations is a uniqueness map.  Proving that statement from zero density
would require an appropriate distinct-zero count, which is neither assumed
nor supplied here.  If repeated zeros are retained as repeated value rows,
arbitrary interpolation already fails because those rows are identical;
they do not become derivative rows automatically.

### Corollary 3.3 (an exact radical divisor cannot be compact)

Let `K` be a nonzero global state whose transform has the centered xi divisor
with at least the multiplicities in (3.1).  Then `K` cannot have compact
support, even as a compactly supported distribution.

In particular, take a nonzero finite vector `v` and any multiplicity-
preserving global radical lift `K_v` with compact restriction `C_a K_v=v`.
Its exterior part

\[
 R_v=(1-C_a)K_v                                      \tag{3.3}
\]

cannot vanish for any finite `a` for which `C_aK_v=v`.  Thus the
exterior tail in the canonical radical lift is structurally unavoidable; it
is not an artifact of the explicit Mobius representative.

**Proof.**  Compact support would put the transform in a finite-type
Paley--Wiener class (with a polynomial growth factor for a distribution),
and Theorem 3.1 and the distributional extension of Lemma 2.1 would force
`K=0`.  If `R_v=0`, then `K_v` would be compact and nonzero because its
restriction is `v`, giving the same contradiction.  \(\square\)

This explains exactly how the full source anchor evades Theorem 3.1.  Its
zeta factor supplies the complete divisor, but the state is global.  Once it
is restricted and Fourier projected, the exterior and projection defects in
equation (4.4) of
`notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` are mandatory.

## 4. The projected anchor collapses the full sampling floor

Let `mathsf Z` be the ordinary positive paired-sampling analysis used in the
graph reductions:

\[
 \|v\|_{\mathfrak Z}^2
 =\sum_\rho\left(
     |F_v(s_\rho)|^2+|F_v(\overline{s_\rho})|^2\right).
                                                               \tag{4.1}
\]

Zeros are counted with algebraic multiplicity in this sum.  No sign is
assigned to (4.1), and it is not the Weil form.

For the corrected global radical anchor `K_lambda`, put

\[
 p_{\lambda,N}=P_NC_aK_\lambda,
 \qquad R_{\lambda,N}=K_\lambda-p_{\lambda,N},
 \qquad a_{\lambda,N}=\|p_{\lambda,N}\|_2.             \tag{4.2}
\]

Exact radicality gives, at both evaluations belonging to every zero,

\[
 \mathsf Zp_{\lambda,N}=-\mathsf ZR_{\lambda,N}.        \tag{4.3}
\]

On the locked exponential diagonal the admitted hybrid theorem and projected
norm theorem give

\[
 \epsilon_\lambda:=\|R_{\lambda,N}\|_{\mathfrak Z}^2
   =o(d_6),
 \qquad
 a_{\lambda,N}\longrightarrow a_\infty>0,
 \qquad
 U_Z={\epsilon_\lambda\over a_{\lambda,N}^2}=o(d_6).
                                                               \tag{4.4}
\]

Define the full finite-even lower sampling constant by

\[
 \gamma_{\lambda,N}^{\rm samp}
 =\inf_{0\ne v\in E_N^+}
       {\|v\|_{\mathfrak Z}^2\over\|v\|_2^2}.           \tag{4.5}
\]

### Theorem 4.1 (full-space frame degeneration)

For every sufficiently large locked parameter,

\[
 \boxed{
  0\leq\gamma_{\lambda,N}^{\rm samp}
  \leq {\|p_{\lambda,N}\|_{\mathfrak Z}^2
             \over a_{\lambda,N}^2}
  ={\epsilon_\lambda\over a_{\lambda,N}^2}
  =U_Z=o(d_6).}                                          \tag{4.6}
\]

**Proof.**  Insert the nonzero vector `p_(lambda,N)` into (4.5), use (4.3),
and then use (4.4).  \(\square\)

Thus the projected-anchor divisor does not furnish a matrix-wide lower
frame bound on `E_N^+`.  It furnishes an explicit near-null sampling
direction.  In Loewner form, no estimate

\[
 \mathsf Z^*\mathsf Z\succeq c_\lambda I_{E_N^+}       \tag{4.7}
\]

can hold with `c_lambda` asymptotically larger than `U_Z`.

There is also a value-supremum version which uses the uniform divisor theorem
directly.  Put

\[
 \gamma_{\lambda,N}^{\infty}
 =\inf_{0\ne v\in E_N^+}
 {\sup_{z\in\mathcal Z_c^\sharp}|A_v(z)|\over\|v\|_2}.
                                                               \tag{4.8}
\]

Equation (4.17) of the centered-zero note and the projected norm theorem give

\[
 \boxed{
 \gamma_{\lambda,N}^{\infty}
 \leq{\sup_{z\in\mathcal Z_c^\sharp}|A_{p_{\lambda,N}}(z)|
          \over a_{\lambda,N}}
 \longrightarrow0.}                                      \tag{4.9}
\]

Uniqueness of a jet evaluation map and stability of a value evaluation map
are therefore sharply different assertions here.

## 5. Why this does not decide the signed exterior coframe

The retained quantity in the rotated-high reduction is

\[
 \beta_\lambda=
 \inf_{\substack{\sigma\geq0\\y\ne0}}
 {\|(\sigma-U)y-T_{\rm ext}\mathsf E_\sigma y\|
  \over\|\Delta\mathsf E_\sigma y\|},
 \qquad y\in\mathcal L_0.                              \tag{5.1}
\]

Theorems 3.1--4.1 do not bound (5.1), for three separate reasons.

1. `mathcal L_0` removes the distinguished low anchor direction.  Equation
   (4.6) controls the first full-space sampling singular value; it says
   nothing about the restricted next singular value.
2. The vector sampled in (5.1) is the harmonic graph lift
   `mathsf E_sigma y`, not `y` alone.  A lower bound on compact value samples
   would not control the high component created by that lift.
3. The canonical tail is the signed operator identity
   `T_ext=-P_(mathcal L_0)Q_+|_V`.  Positive paired sampling controls only
   `mathsf Z^*mathsf Z`; it does not orient the signed pairing that defines
   `T_ext`.  Reinterpreting the Mobius restriction right inverse as a
   zero-sampling right inverse would merely rewrite the original matrix and
   assume the missing sign.

Accordingly, interpolation at the complete centered multiset is not a route
from the source divisor to the lower bound

\[
 \beta_\lambda\gg
 {1\over\sqrt\lambda\operatorname{polylog}(\lambda)}.    \tag{5.2}
\]

The exact remaining zero-side alternatives are narrower:

- prove a quantitative restricted singular-value and range-orientation
  theorem for `mathsf Z mathsf E_sigma` uniformly in `sigma`, strong enough
  to control the signed pairing; or
- prove (5.1) directly from the cancellation-preserving weighted-PNT
  discrepancy formula.

The compact divisor, cardinal interpolation, and unrestricted positive-frame
routes are excluded by the theorems above.  The signed retained theorem
itself remains open.
