# Even-ground coefficient-cone audit

## 0. Claim boundary and outcome

This note gives a finite, exact reformulation of the odd-sign criterion in
`notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md`. Under that note's
simple-even-ground and two nonvanishing hypotheses, the numerator of the
imaginary-axis response is a monic real-rooted polynomial. The shifted odd
block is positive definite if and only if **every coefficient of that
polynomial is strictly positive**. The coefficients are displayed below as
explicit affine expressions, and equivalently homogeneous linear
expressions, in the boundary-normalized even-ground Fourier coefficients.

This coefficient cone is necessary and sufficient for the finite odd sign at
the even-ground level `epsilon`. Pointwise nonnegativity of the even-ground trigonometric polynomial
is only a stronger sufficient condition. The coefficient theorem does not
prove that the arithmetic ground vector lies in the cone on any unbounded
schedule. It also does not provide the additional Ritz reserve needed to
compare the odd block with a value `U>epsilon`.

The same source formulas expose obstructions to obtaining the coefficient
signs from a generic diagonal conjugation, Perron--Frobenius, `M`-matrix,
total-positivity, or variation-diminishing argument. These obstructions do
not disprove a new source-specific arithmetic inequality. They show that
such an inequality cannot be replaced by a formal sign property of the
Cauchy matrix class.

No zeta-zero table, global Weil positivity, stored eigenvector, or matrix from
a diagnostic preprint is used in the theorem. This note proves no
arithmetic unbounded-schedule sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or Riemann-hypothesis
conclusion. The formal project state remains `P0_INVALIDATED`.

## 1. Locked finite source setup

Fix `lambda>1`, put `L=2 log(lambda)`, and use the source modes `V_n`,
`-N<=n<=N`. The binding source is Connes--Consani--Moscovici, *Zeta
Spectral Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The finite Cauchy matrix and commutator are source equations (5.2)--(5.3),
reproduced in `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`:

\[
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                                  \tag{1.1}
\]

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \qquad
 DV_n=nV_n,
 \quad \eta=\sum_{|n|\leq N}V_n.                    \tag{1.2}
\]

The complete matrix is assembled with the locked convention

\[
 Q=Q^{\rm pole}-Q^{\rm arch}-Q^{\rm prime},          \tag{1.3}
\]

where the last minus sign is the one in source equation (3.19), every prime
power `1<k<=lambda^2` is included, and the printed duplicated `c(L)` in
source (4.14) is removed as required by `P0_SOURCE_LOCK.json`. The Fourier
sign is the locked sign and inversion is `JV_n=V_{-n}`.

In the normalized even basis

\[
 e_0^+=V_0,
 \qquad e_n^+=\frac{V_n+V_{-n}}{\sqrt2}\quad(1\leq n\leq N), \tag{1.4}
\]

write `Q_+` for the even compression. Let `epsilon` be its simple lowest
eigenvalue and let `x` be a real eigenvector. Assume

\[
 c=\langle\eta,x\rangle\ne0,
 \qquad x_0=\langle e_0^+,x\rangle\ne0.             \tag{1.5}
\]

These are exactly the hypotheses used for the positive symmetrizer in the
0.46 note. They do not assume the odd sign.

## 2. Exact even-block entries and source sign obstructions

### 2.1 The complete even block is controlled off the diagonal by `b_n`

Let `a_n=Q_{nn}`. Direct substitution of (1.1) into (1.4) gives

\[
 \boxed{(Q_+)_{00}=a_0,\qquad
 (Q_+)_{0n}=\sqrt2\,\frac{b_n}{n},\qquad
 (Q_+)_{nn}=a_n+\frac{b_n}{n}.}                    \tag{2.1}
\]

For distinct positive `n,m`,

\[
\begin{aligned}
 (Q_+)_{nm}
 &=Q_{nm}+Q_{n,-m}\\
 &=\frac{b_n-b_m}{n-m}+\frac{b_n+b_m}{n+m}\\
 &=\boxed{\frac{2(nb_n-mb_m)}{n^2-m^2}}.
                                                               \tag{2.2}
\end{aligned}
\]

Thus no eigenvector information is needed to audit the off-diagonal sign
graph.

For `n>=1`, inserting `m=0` into the locked pole, corrected archimedean, and
inclusive prime-power formulas gives the exact identity

\[
\boxed{\begin{aligned}
 b_n={}&\frac{32Ln\sinh^2(L/4)}{L^2+16\pi^2n^2}\\
 &+\frac1\pi\int_0^L
 \frac{e^{x/2}}{e^x-e^{-x}}
       \sin\!\left(\frac{2\pi nx}{L}\right)dx\\
 &+\frac1\pi\sum_{1<k\leq\lambda^2}
 \frac{\Lambda(k)}{\sqrt k}
       \sin\!\left(\frac{2\pi n\log k}{L}\right).
\end{aligned}}                                               \tag{2.3}
\]

There is no diagonal archimedean constant in (2.3): the off-diagonal kernel
has `omega_(n,0)(0)=0`. Formula (2.3) also makes the source minus-prime sign
auditable. The unsigned prime matrix has a negative sine in its `(n,0)`
entry; subtracting that block gives the final plus sign on the last line of
(2.3).

For one prime power `k`, put

\[
 w_k=\frac{\Lambda(k)}{\sqrt k},
 \qquad \theta_k=\frac{2\pi\log k}{L}.
\]

Its signed contribution to the Cauchy sequence and even entries is

\[
 b_n^{(k)}=\frac{w_k}{\pi}\sin(n\theta_k),          \tag{2.4}
\]

\[
 (Q_+^{(k)})_{0n}
 =\frac{\sqrt2w_k}{\pi n}\sin(n\theta_k),          \tag{2.5}
\]

\[
 (Q_+^{(k)})_{nm}
 =\frac{2w_k}{\pi}
 \frac{n\sin(n\theta_k)-m\sin(m\theta_k)}{n^2-m^2}.
                                                               \tag{2.6}
\]

This is an exact Loewner divided-difference form, but it has no sign fixed by
parity: the sine factors change sign as the mode or arithmetic phase changes.
Consequently operator monotonicity or an entrywise sign law does not follow
from the divided-difference representation.

### 2.2 The even pole is a positive rank-one obstruction to a formal
`M`-matrix argument

Let

\[
 C_L=32L\sinh^2(L/4),
 \qquad v_0=\frac1L,
 \qquad v_n=\frac{\sqrt2L}{L^2+16\pi^2n^2}\quad(n\geq1).
                                                               \tag{2.7}
\]

Adding the `m` and `-m` entries of the closed pole formula gives

\[
 \boxed{Q_+^{\rm pole}=C_L|v\rangle\langle v|.}     \tag{2.8}
\]

Every component of `v` is strictly positive. Hence every three-edge pole
triangle has positive product. If `S=diag(s_0,...,s_N)` with
`s_j in {+1,-1}`, then a triangle product is invariant under diagonal
conjugation:

\[
 (s_is_jq_{ij})(s_js_kq_{jk})(s_ks_iq_{ki})
 =q_{ij}q_{jk}q_{ki}.                               \tag{2.9}
\]

Three nonzero off-diagonal entries of a `Z`-matrix have negative product.
Thus, as soon as `N>=2`, no diagonal sign conjugation turns the even pole
block into a `Z`-matrix. The pole block is rank one, so it is not strictly
totally positive either. The archimedean and prime blocks can cancel it, and
(2.8) alone says nothing about the sign of the complete matrix. It does rule
out treating the complete source formula as a sum of pieces which each
preserve the Perron cone needed for the **lowest** eigenvector.

For the complete matrix, a diagonal-sign Perron route to the lowest
eigenvector would require `S Q_+ S` to have nonpositive off-diagonal entries,
so that a sufficiently large scalar multiple of the identity minus that
matrix is entrywise nonnegative. Equations (2.3)--(2.6) show that this is a
new arithmetic sign condition, not a consequence of Cauchy form, parity, or
the prime weights being positive. A scalar diagonal shift cannot change any
of these off-diagonal signs.

## 3. Boundary-normalized rational response

Normalize the ground line by `c` and write

\[
 \frac{x}{c}=\sum_{n=-N}^N\xi_nV_n,
 \qquad \xi_{-n}=\xi_n.                             \tag{3.1}
\]

Then

\[
 \xi_0+2\sum_{n=1}^N\xi_n=1,
 \qquad \xi_0=\frac{x_0}{c}\ne0.                  \tag{3.2}
\]

With

\[
 D_-^2=\operatorname{diag}(1^2,2^2,\ldots,N^2),
 \quad d=\mathcal D\eta,
 \quad u=\frac{\mathcal D x}{c},
\]

the 0.46 source factorization uses

\[
 X=D_-^2-|u\rangle\langle d|.                       \tag{3.3}
\]

Its scalar response is

\[
 A_x(\alpha)
 =1-2\sum_{n=1}^N\frac{n^2\xi_n}{n^2+\alpha^2},    \tag{3.4}
\]

and the determinant lemma gives

\[
 \det(X+\alpha^2I)
 =\prod_{n=1}^N(n^2+\alpha^2)A_x(\alpha).           \tag{3.5}
\]

Under (1.5), the positive symmetrizer theorem in the 0.46 note proves that
all eigenvalues of `X` are real and nonzero and that

\[
 \operatorname{signcount}(X)
 =\operatorname{inertia}(Q_- -\epsilon I).          \tag{3.6}
\]

Here `signcount(X)` means the signs of the real eigenvalues of `X`,
equivalently the inertia of its similar Hermitian matrix. No odd positivity
is used to obtain real-rootedness.

## 4. Exact coefficient-cone theorem

Put `s=alpha^2` and define the monic degree-`N` polynomial

\[
 \boxed{
 P_x(s)=\prod_{n=1}^N(s+n^2)A_x(\sqrt s)
       =\det(X+sI)
       =\sum_{j=0}^N p_j s^j.}                     \tag{4.1}
\]

For a finite set `E`, write `e_r(E)` for its `r`th elementary symmetric
polynomial, with `e_0(E)=1` and `e_r(E)=0` for `r>|E|`. Let

\[
 E_N=\{1^2,2^2,\ldots,N^2\},
 \qquad E_N^{\widehat n}=E_N\setminus\{n^2\}.       \tag{4.2}
\]

Expanding (4.1) and using (3.4) gives

\[
 \boxed{p_N=1,}                                      \tag{4.3}
\]

and, for `0<=j<=N-1`,

\[
 \boxed{
 p_j=e_{N-j}(E_N)
 -2\sum_{n=1}^N n^2\xi_n
 e_{N-1-j}(E_N^{\widehat n}).}                     \tag{4.4}
\]

Using the boundary identity (3.2) and

\[
 e_r(E_N)=e_r(E_N^{\widehat n})
          +n^2e_{r-1}(E_N^{\widehat n}),
\]

the same coefficient has the homogeneous linear form

\[
 \boxed{
 p_j=e_{N-j}(E_N)\xi_0
 +2\sum_{n=1}^N e_{N-j}(E_N^{\widehat n})\xi_n.}   \tag{4.4a}
\]

In particular, (3.2) gives

\[
 \boxed{p_0=(N!)^2\xi_0=(N!)^2\frac{x_0}{c}\ne0.} \tag{4.5}
\]

### Theorem 4.1 (coefficient cone equals the odd-positive cone)

Under the simple even-compression ground hypothesis and (1.5), the following
conditions are equivalent:

1. `Q_- - epsilon I` is positive definite;
2. every eigenvalue of `X` is positive;
3. `A_x(alpha)>0` for every `alpha>=0`;
4. every coefficient in (4.1) is strictly positive:

   \[
    \boxed{p_j>0\qquad(0\leq j\leq N).}             \tag{4.6}
   \]

**Proof.** Equivalence of 1 and 2 is (3.6). Equivalence of 1 and 3 is the
0.46 imaginary-axis inertia criterion.

Let `gamma_1,...,gamma_N` be the eigenvalues of `X`. They are real and
nonzero by the positive symmetrizer, and

\[
 P_x(s)=\prod_{r=1}^N(s+\gamma_r).                  \tag{4.7}
\]

If every `gamma_r>0`, all coefficients in (4.7) are strictly positive.
Conversely, if all `p_j>0`, then `P_x(s)>0` for every `s>=0`. A negative
eigenvalue `gamma_r` would give the positive root `s=-gamma_r`, a
contradiction. Since zero eigenvalues have already been excluded, every
`gamma_r` is positive. This proves equivalence of 2 and 4 and completes the
proof. \(\square\)

The real-rooted input is essential for the converse from absence of a
positive root to positivity of every eigenvalue of `X`. It comes from the
source factorization and the `x_0!=0` symmetrizer argument, not from a
numerical root calculation.

### Corollary 4.2 (scale invariance)

Replacing `x` by any nonzero scalar multiple `rho*x` replaces `c` and `x_0`
by `rho*c` and `rho*x_0`. Therefore `x/c`, every `xi_n`, `u`, `X`, `A_x`,
`P_x`, and every `p_j` are unchanged. The coefficient-cone test is a test of
the ground line, not of a chosen unit or boundary-normalized representative.
This scale invariance does not permit the source-normalized prolate
comparison state to be replaced by a unit-normalized one.

## 5. Alternating signs do not imply pointwise nonnegativity

Variation-diminishing or oscillatory-matrix arguments usually control the
number of coefficient sign changes. That information alone is insufficient
for the pointwise condition used as a sufficient certificate in the 0.46
note.

For an exact rational example, take `N=2` and

\[
 \xi_0=3,
 \qquad \xi_1=-11,
 \qquad \xi_2=10.                                   \tag{5.1}
\]

These coefficients have alternating signs and satisfy the exact boundary
normalization

\[
 \xi_0+2\xi_1+2\xi_2=1.                            \tag{5.2}
\]

Ignoring only the positive common factor `L^(-1/2)`, the corresponding even
trigonometric polynomial is

\[
 F(\theta)=3-22\cos\theta+20\cos(2\theta).          \tag{5.3}
\]

At the admissible point `cos(theta)=11/40`,

\[
 \boxed{F(\theta)=-\frac{801}{40}<0.}               \tag{5.4}
\]

Thus even exact alternation together with the correct boundary sum does not
prove pointwise nonnegativity. Total positivity, if it were available, would
need additional quantitative coefficient inequalities before it could imply
the desired function-space cone. The actual source formulas do not provide
strict total positivity as a formal consequence of Cauchy form or positive
prime weights, by Section 2.

The rational vector (5.1) is a function-space counterexample only; it is not
asserted to be an eigenvector of an arithmetic finite Weil matrix.

## 6. Narrowest remaining source-specific theorem target

For one explicit unbounded arithmetic schedule, a coefficient-cone route
would still have to prove all of the following from the combined source
formula:

1. the simple lowest even-compression eigenpair and the two nonvanishing
   conditions `c!=0` and `x_0!=0`;
2. the exact finite inequalities (4.6), using the coefficients (4.4) of the
   actual boundary-normalized even ground line;
3. the separate shifted comparison, for example, with `g_e` denoting the
   gap from `epsilon` to the second even eigenvalue,

   \[
    U-\epsilon
    <\frac{g_e}{\lambda_{\max}(X)}
      \frac{|x_0|^2}{\|x\|^2},                     \tag{6.1}
   \]

   or a sharper direct lower bound for `Q_- - U I`;
4. the remaining residual and locally uniform determinant estimates required
   by equation (5.2) of `DIRECT_RH_ATTACK.md`.

Item 2 is exactly equivalent to the finite odd sign at `epsilon` under item 1;
it is not an asymptotic proof hidden behind a sufficient condition.
Pointwise nonnegativity may still be used as a stronger source-specific
certificate, but the alternating-sign example and the source entry formulas
show why neither coefficient alternation nor a generic Perron slogan proves
it. No item in this list is established here on an unbounded schedule.
