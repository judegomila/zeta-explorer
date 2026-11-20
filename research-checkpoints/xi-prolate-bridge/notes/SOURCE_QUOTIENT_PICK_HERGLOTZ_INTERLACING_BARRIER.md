# Source-quotient Pick, Herglotz, and interlacing barrier

## 0. Exact outcome and claim boundary

This note tests whether the checkpoint-1.26 capture-free odd profile acquires
a positive-measure structure from the checkpoint-1.25 strict signs.  The
answer is negative at the level of the exact source algebra.

Let `Phi_mu` be the real, inversion-even, boundary-normalized actual ground,
and write

\[
 \Phi_\mu=\sum_{j=-N}^{N}\xi_jV_j,
 \qquad \xi_{-j}=\xi_j,
 \qquad \sum_{j=-N}^{N}\xi_j=1.                 \tag{0.1}
\]

The source secular function, quotient polynomial, and capture-free odd
profile satisfy

\[
 \boxed{
 h(s)=\sum_{j=-N}^{N}{\xi_j\over j-s},
 \qquad
 \mathcal A_\mu(r)=-r h(r),
 \qquad
 P(s)=\det(D-sI)h(s).}                           \tag{0.2}
\]

The exact residue classification is as follows.

1. `h` is a Pick--Herglotz rational function if and only if every `xi_j` is
   nonnegative.
2. A nonconstant `mathcal A_mu` is neither Herglotz nor anti-Herglotz in
   `r`, because its residues at `+n` and `-n` are opposite.
3. In the Stieltjes variable `t=-r^2`, the rational function

   \[
    F_\mu(t):=\mathcal A_\mu(i\sqrt t)
    =1+\sum_{n=1}^{N}{-2n^2\xi_n\over t+n^2}    \tag{0.3}
   \]

   is Stieltjes exactly when every noncentral `xi_n` is nonpositive.

Thus the Herglotz condition for `h` and the Stieltjes condition for `F_mu`
can coexist only on the exceptional branch `D Phi_mu=0`.  Positivity of the
shifted odd block proves real quotient roots and positivity of (0.3) on the
positive axis; it does not sign the partial-fraction residues.

An exact `N=2` source-Cauchy matrix below satisfies both abstract
checkpoint-1.25 strict Ritz signs.  Its quotient roots are all real, but two
lie outside the source lattice and the roots do not interlace the integer
poles.  Both `h` and (0.3) have mixed residues.  Therefore the quotient
self-adjointness is not an orthogonal-compression theorem for `D`, and the
natural polynomial pair is not Hermite--Biehler.

The favorable one-sign family from the paired-trace reduction gives the
complementary quantitative obstruction.  It has a genuine Herglotz secular
function and strict integer interlacing, yet its first quotient trace grows
linearly in `L` on the locked regime.  Hence even an added Herglotz or
de Branges hypothesis would not supply the exponential odd-response
compensation.

The countermodels are structural source-Cauchy matrices, not matrices
assembled from the actual prime-power inventory.  This note proves no
failure of an actual arithmetic matrix, no failure of either checkpoint
strict sign, no dangerous-response lower bound, no response decay or
nondecay for the actual ground, no determinant convergence, no zero
statement, and no Riemann-hypothesis conclusion.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following current repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md` | `ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3` |
| `tests/test_capture_free_actual_ground_parity_response_barrier.py` | `477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772` |
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `notes/DETERMINANT_LIMIT_AUDIT.md` | `1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0` |
| `tests/test_determinant_bridge.py` | `d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d` |
| `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` | `1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755` |
| `notes/PARITY_PENCIL_TRACE_REDUCTION.md` | `4840232a94c75021ff60b08b89ccb0e4be240d54b9a5e4a550353e7049ed260b` |
| `notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md` | `8599690f41785c7317c2f3627ef992dba4f3b1576e2fa3ce0ab6e204514ecc94` |

The first pair fixes the complete capture-free response and its unresolved
mixed odd cofactor.  The source proof fixes the displacement identity and
the quotient metric.  The determinant pair fixes the source characteristic
identity and its normalization.  The last three notes fix the imaginary-axis
response, the positive parity pencil, the forced exponential compensation,
and the distinction between positivity of the numerator polynomial and
signs of its residues.

No zero table, RH premise, zero-simplicity premise, unsigned-prime
replacement, cached arithmetic matrix, or stored arithmetic ground vector
is imported.

## 2. Exact residue classification

Put

\[
 T=Q-\mu I,
 \qquad O_\mu=Q_--\mu I>0,
 \qquad v_\mu=O_\mu^{-1}\beta.                  \tag{2.1}
\]

The source commutator and boundary normalization give

\[
 D\Phi_\mu=-v_\mu.                               \tag{2.2}
\]

In the normalized odd basis, the coefficient of `e_n^-` in (2.2) is
`sqrt(2)n xi_n`.  Consequently

\[
 (v_\mu)_n=-\sqrt2\,n\xi_n.                     \tag{2.3}
\]

Substitution in the checkpoint-1.26 profile gives

\[
 \boxed{
 \mathcal A_\mu(r)
 =1-2\sum_{n=1}^{N}{n^2\xi_n\over n^2-r^2}.}    \tag{2.4}
\]

Pairing the `+n` and `-n` terms in `h` gives

\[
 h(r)=-{\xi_0\over r}
      +2r\sum_{n=1}^{N}{\xi_n\over n^2-r^2}.     \tag{2.5}
\]

Using `xi_0+2 sum xi_n=1` in (2.4)--(2.5) proves

\[
 \boxed{\mathcal A_\mu(r)=-r h(r).}              \tag{2.6}
\]

The apparent poles in the complete ground transform remain canceled by the
lattice zeros in `K_L`; equations (2.4)--(2.6) concern the meromorphic
factor before that entire continuation.

### Proposition 2.1 (Pick residue criterion)

The rational function `h` maps the upper half-plane into its closure if and
only if

\[
 \boxed{\xi_j\geq0\quad(-N\leq j\leq N).}        \tag{2.7}
\]

If every inequality is strict, the zeros of `P` strictly interlace the
integer poles.  If some coefficient vanishes, the corresponding pole may
cancel and only the reduced weak statement remains.

**Proof.**  For `z` in the upper half-plane,

\[
 \operatorname {Im}h(z)
 =\operatorname {Im}z
  \sum_{j=-N}^{N}{\xi_j\over|j-z|^2}.            \tag{2.8}
\]

Thus (2.7) is sufficient.  At the real pole `j`,

\[
 \operatorname {Res}_{s=j}h(s)=-\xi_j.           \tag{2.9}
\]

A rational Herglotz function has a nonpositive residue at every real simple
pole.  This proves necessity after deleting any removable pole.  Strictly
positive residues in the measure make `h` strictly increasing from
`-infinity` to `+infinity` between consecutive poles, which proves strict
interlacing. \(\square\)

The Pick kernel displays the exact indefinite fallback:

\[
 \boxed{
 {h(z)-\overline{h(w)}\over z-\overline w}
 =\sum_{j=-N}^{N}
 {\xi_j\over(j-z)(j-\overline w)}.}              \tag{2.10}
\]

For nonzero coefficients, its number of negative squares is exactly the
number of negative `xi_j`: a square Cauchy evaluation matrix at distinct
off-real points is invertible and makes (2.10) congruent to
`diag(xi_j)`.  This is a generalized Nevanlinna--Pontryagin structure, not a
positive de Branges kernel.

### Proposition 2.2 (odd-profile residue criterion)

At every retained nonzero lattice pole,

\[
 \boxed{
 \operatorname {Res}_{r=n}\mathcal A_\mu(r)=n\xi_n,
 \qquad
 \operatorname {Res}_{r=-n}\mathcal A_\mu(r)=-n\xi_n.}       \tag{2.11}
\]

Hence a nonconstant `mathcal A_mu` is neither Herglotz nor anti-Herglotz in
the `r` plane.

**Proof.**  Equation (2.11) follows directly from (2.4).  Real simple poles
of a Herglotz function must all have nonpositive residues, while those of an
anti-Herglotz function must all have nonnegative residues.  The paired
residues in (2.11) have opposite signs unless `xi_n=0`. \(\square\)

In the imaginary-axis variable `t=-r^2`, (2.4) becomes

\[
 \boxed{
 F_\mu(t)=\mathcal A_\mu(i\sqrt t)
 =1+\sum_{n=1}^{N}{c_n\over t+n^2},
 \qquad c_n=-2n^2\xi_n.}                         \tag{2.12}
\]

The partial-fraction expansion is unique.  Therefore `F_mu` is a rational
Stieltjes function exactly when `c_n>=0` for every `n`, equivalently

\[
 \boxed{\xi_n\leq0\quad(1\leq n\leq N).}         \tag{2.13}
\]

Equations (2.7) and (2.13) are compatible only when every noncentral
coefficient vanishes.  By (2.2), that is the exceptional branch
`D Phi_mu=0`.

## 3. Why quotient self-adjointness is not compression interlacing

The source rank-one correction is

\[
 D'=D-|D\Phi_\mu\rangle\langle\eta|.             \tag{3.1}
\]

It kills the ground and obeys

\[
 TD'=D'^*T.                                      \tag{3.2}
\]

Thus it descends to the self-adjoint `D''` on the quotient by the ground,
with the positive metric induced by `T`.  This proves that the roots of `P`
are real.  In particular, `D''` is not an orthogonal compression of the diagonal
operator `D` in the source Euclidean metric:

1. `D'`, rather than `D`, descends;
2. the correction in (3.1) is oblique;
3. `D` is not self-adjoint in the `T` metric; and
4. the ambient `T` metric is singular on the ground line.

Accordingly, the ordinary Cauchy interlacing theorem does not compare the
spectrum of `D''` with the integer spectrum of `D`.  The source metric does
produce Herglotz diagonal resolvent entries

\[
 \langle u,(D''-sI)^{-1}u\rangle_T,              \tag{3.3}
\]

but `h` is the characteristic ratio in (0.2), not a diagonal entry of
(3.3).  Likewise `mathcal A_mu-1` is the cross response
`<chi_r^-,O_mu^{-1}beta>`, not a positive diagonal odd resolvent.

Squaring the parity correction gives the positive generalized pencil

\[
 C^*T_+C\,y=s_k^2T_-y.                            \tag{3.4}
\]

This proves `s_k^2>=0`.  It supplies no comparison between `s_k` and the
integer `k`; the exact fixture in the next section has `s_2>2`.

## 4. Exact strict-sign source-Cauchy countermodel

Use modes `(-2,-1,0,1,2)` and put

\[
 (b_{-2},b_{-1},b_0,b_1,b_2)=(-2,1,0,-1,2),      \tag{4.1}
\]

\[
 (a_{-2},a_{-1},a_0,a_1,a_2)
 =\left({10\over3},{16\over3},4,{16\over3},{10\over3}\right). \tag{4.2}
\]

With `Q_nn=a_n` and `Q_nm=(b_n-b_m)/(n-m)`, the complete matrix is

\[
 Q=\begin{pmatrix}
 {10\over3}&3&1&{1\over3}&1\\
 3&{16\over3}&-1&-1&{1\over3}\\
 1&-1&4&-1&1\\
 {1\over3}&-1&-1&{16\over3}&3\\
 1&{1\over3}&1&3&{10\over3}
 \end{pmatrix}.                                  \tag{4.3}
\]

It has the exact source displacement (with `beta=sum b_nV_n`) and kills

\[
 \boxed{\Phi=(-1,1,1,1,-1)^T,\qquad
 \langle\eta,\Phi\rangle=1.}                    \tag{4.4}
\]

In the normalized parity bases its two blocks are

\[
 Q_+=\begin{pmatrix}
 4&-\sqrt2&\sqrt2\\
 -\sqrt2&{13\over3}&{10\over3}\\
 \sqrt2&{10\over3}&{13\over3}
 \end{pmatrix},
 \qquad
 Q_-={1\over3}\begin{pmatrix}19&8\\8&7\end{pmatrix}.        \tag{4.5}
\]

Their spectra are

\[
 \boxed{
 \operatorname {spec}(Q_+)=\left\{0,5,{23\over3}\right\},
 \qquad
 \operatorname {spec}(Q_-)=\left\{1,{23\over3}\right\}.}   \tag{4.6}
\]

Take the anchor `kappa=V_0`.  The complement block and coupling are

\[
 A={1\over3}\begin{pmatrix}13&10\\10&13\end{pmatrix},
 \qquad b_{\rm blk}=(-\sqrt2,\sqrt2)^T.           \tag{4.7}
\]

The genuine two-vector Ritz matrix on the anchor and normalized coupling
direction is

\[
 \begin{pmatrix}4&2\\2&1\end{pmatrix},           \tag{4.8}
\]

with eigenvalues `0` and `5`.  Thus `u=mu=0` and both checkpoint-1.25
strict signs hold exactly:

\[
 \boxed{B_u=A\succ0,\qquad Q_--uI\succ0.}         \tag{4.9}
\]

Both checkpoint-1.25 strict Ritz signs hold exactly in this fixture.

This is stronger than merely assuming a simple even ground and an odd gap.
It is still a structural source-Cauchy fixture, not an actual arithmetic
matrix.

### 4.1 Real quotient roots without interlacing

Let `Ce_n^-=n e_n^+`; its noncentral matrix is `diag(1,2)`.  Then

\[
 C^*Q_+C={1\over3}\begin{pmatrix}13&20\\20&52\end{pmatrix}.  \tag{4.10}
\]

The generalized determinant is

\[
 \det(C^*Q_+C-s^2Q_-)
 ={23\over3}\left(s^4-11s^2+4\right).            \tag{4.11}
\]

Hence

\[
 \boxed{P(s)=s^4-11s^2+4,\qquad
 s^2={11\mathbin\pm\sqrt{105}\over2}.}           \tag{4.12}
\]

All four quotient roots are real.  The smaller positive root lies in
`(0,1)`, while the larger is greater than `2`.  Thus the roots do not
interlace `-2,-1,0,1,2`; in particular, the spectrum of `D''` is not even
contained in the convex hull of the spectrum of `D`.

### 4.2 Mixed Pick and Stieltjes residues

For (4.4),

\[
 \boxed{
 h(s)={P(s)\over-s(s^2-1)(s^2-4)},
 \qquad
 \operatorname {Res}_{(-2,-1,0,1,2)}h
 =(1,-1,-1,-1,1).}                               \tag{4.13}
\]

The odd source vector is an eigenvector of `Q_-` at eigenvalue `1`, and
(2.4) becomes

\[
 \boxed{
 \mathcal A(r)
 =1-{2\over1-r^2}+{8\over4-r^2}
 ={P(r)\over(1-r^2)(4-r^2)}.}                    \tag{4.14}
\]

Its residues at `(-2,-1,1,2)` are

\[
 (2,-1,1,-2).                                    \tag{4.15}
\]

On the imaginary axis,

\[
 F(t)=1-{2\over1+t}+{8\over4+t}
 ={t^2+11t+4\over(t+1)(t+4)}>0\qquad(t\geq0).    \tag{4.16}
\]

The numerator has the strictly positive coefficients required by the odd
sign, but the two Stieltjes atoms are `-2` and `8`.  Moreover,

\[
 F'(t)={2\over(t+1)^2}-{8\over(t+4)^2},           \tag{4.17}
\]

which is positive for `0<=t<2` and negative for `t>2`.  Positivity of
(4.16) therefore cannot be upgraded to either residue orientation or
complete monotonicity.

## 5. Hermite--Biehler and de Branges stopping line

Put

\[
 B(s)=\det(D-sI)=-s(s^2-1)(s^2-4).               \tag{5.1}
\]

A classical Hermite--Biehler construction from the natural real pair
`(P,B)` requires strict alternation of their simple real zeros and one fixed
Wronskian orientation.  Equivalently, the residues

\[
 {P(j)\over B'(j)}=-\xi_j                         \tag{5.2}
\]

must have one sign.  The fixture has consecutive `B` zeros in each of the
intervals `(-2,-1)` and `(1,2)`, and it has a `P` zero beyond each exterior
lattice pole.  No global sign or choice between `P+iB` and `P-iB` repairs
that failure.

One may manufacture an unrelated Hermite--Biehler polynomial from a
real-rooted `P` and its derivative.  That construction does not recover the
source ratio `P/B`, the capture-free profile, its mixed cofactor, or the
anchor normalization `p_mu`.  A generalized de Branges--Pontryagin model
for (2.10) retains its negative squares and supplies no positive lower frame.

## 6. Favorable Herglotz structure still misses compensation

For every `N>=1`, the frozen paired-trace note uses

\[
 T_N=I-{1\over2N+1}|\eta\rangle\langle\eta|.      \tag{6.1}
\]

This is exact source Cauchy form with

\[
 b_n=-{n\over2N+1},
 \qquad
 \Phi_N={\eta\over2N+1}.                         \tag{6.2}
\]

Every ground coefficient is positive.  Therefore `h_N` is genuinely
Herglotz and its quotient roots strictly interlace the integer lattice.  For
the anchor `V_0`, the lower Ritz plane contains the ground, `u=mu=0`, the
even complement is positive, and the odd block is the identity.  Thus this
family also satisfies the two abstract strict signs.

Nevertheless its anchor overlap is

\[
 p_\mu=\langle V_0,\Phi_N\rangle={1\over2N+1},    \tag{6.3}
\]

and its imaginary-axis profile is increasing:

\[
 F_N(t)
 ={1+2t\displaystyle\sum_{n=1}^{N}(n^2+t)^{-1}
   \over2N+1}.                                    \tag{6.4}
\]

For fixed `0<gamma<alpha`, this gives

\[
 0<{F_N(\gamma^2)\over F_N(\alpha^2)}<1.          \tag{6.5}
\]

By contrast, on a schedule with `N/L^2` tending to infinity, the uniform
first-trace gate requires

\[
 {F_N(\gamma^2)\over F_N(\alpha^2)}
 \asymp {\tau\over\sigma}
 \exp\left({(\sigma-\tau)L\over2}\right),
 \quad
 \gamma={\tau L\over2\pi},
 \quad
 \alpha={\sigma L\over2\pi}.                    \tag{6.6}
\]

Indeed the exact trace lower bound in the frozen note is

\[
 S^{\rm q}_{1;\lambda,N}(\sigma)
 \geq {L\over4\sigma}-{1\over2\sigma^2}-o(1).   \tag{6.7}
\]

Thus even genuine Herglotz residues, strict interlacing, both abstract
strict signs, and an exact source-Cauchy displacement do not imply the
exponential compensation, a uniform first quotient trace, or locally
uniform determinant convergence.  They also supply no estimate for
capture-free dangerous-response decay.

## 7. Fail-closed theorem/barrier pair

The strict content is the following.

1. **Classification theorem.**  Equations (2.7), (2.11), and (2.13) give
   necessary and sufficient residue criteria for the three proposed
   positive-measure structures.  Quotient self-adjointness proves real
   roots but not those criteria.
2. **Strict-sign barrier.**  The exact matrix (4.3) satisfies source Cauchy
   displacement, inversion symmetry, boundary normalization, a simple even
   ground, both checkpoint-1.25 strict Ritz signs, and the real-rooted
   quotient determinant theorem, while failing Herglotz residues,
   Stieltjes residues, lattice interlacing, and the natural
   Hermite--Biehler condition.
3. **Quantitative barrier.**  The family (6.1) has the favorable Herglotz and
   interlacing structure but fails the exponential paired-trace
   compensation.

Any use of this note must reject a claimed pass if it

1. treats source-quotient self-adjointness as Euclidean compression of `D`;
2. replaces real-rootedness or positivity of `F_mu(t)` by a residue sign;
3. treats the cross response as a diagonal positive resolvent entry;
4. infers a classical de Branges space from a generalized
   Nevanlinna--Pontryagin kernel;
5. infers a quantitative frame, response limit, or determinant limit from
   finite interlacing; or
6. promotes either structural countermodel to a statement about failure of
   an actual arithmetic matrix, either strict sign, RH, a converse from RH,
   or a de Bruijn--Newman `Lambda` bound.

The first still-missing assertion remains the source-specific estimate for
the actual mixed cofactor and `p_mu` in the checkpoint-1.26 capture-free
formula.  No estimate for either quantity is proved here.

## 8. Reproduction and self-audit

Run

    python3 -B -m unittest \
      tests.test_source_quotient_pick_herglotz_interlacing_barrier -v

The focused regression checks every frozen hash, the exact source
displacement, both strict Ritz signs, the parity spectra, the quotient
polynomial, all residue signs, noninterlacing, the Stieltjes classification,
the favorable Herglotz family, the fail-closed claim boundary, displayed
TeX, ASCII and whitespace hygiene, and its own Python AST.

This package adds only this note and its focused regression.  It changes no
standard-eight file, manifest, lock, source module, artifact, or project
status.
