# Source-compatible mixed-cofactor deformation barrier

## 0. Exact outcome and claim boundary

This note tests whether the checkpoint-1.26 mixed odd cofactor

\[
 C_\mu(r):=
 \langle\chi_r^-,\operatorname {adj}(O_\mu)\beta\rangle,
 \qquad O_\mu=Q_--\mu I>0,                       \tag{0.1}
\]

can be recovered from a genuine Hermitian deformation of the
source-Cauchy matrix and then bounded by interlacing, determinant
convexity, or a log-determinant identity.  The answer is negative at the
level of the exact source algebra.

For real `r`, the formal Hermitian polarization

\[
 H_r={1\over2}
 \bigl(|\beta\rangle\langle\chi_r^-|
      +|\chi_r^-\rangle\langle\beta|\bigr)       \tag{0.2}
\]

does satisfy

\[
 \left.{d\over dt}\det(O_\mu+tH_r)\right|_{t=0}=C_\mu(r).     \tag{0.3}
\]

But (0.2), embedded as a pure odd-sector direction, is never a nonzero
tangent to the full inversion-symmetric source-Cauchy family.  More
strongly, an exact strict-sign `N=3` source fixture shows that its odd block
need not be the odd restriction of any source tangent.  The obstruction is
an additive three-cycle condition on its off-diagonal entries.

There is one canonical genuine Hermitian source construction: adjoin a
real symmetric pair of source nodes `+/-r` with free odd source coefficient
`b_r`.  Its odd bordered determinant is a concave quadratic in `b_r`, but
its derivative opens the weighted row

\[
 4r\langle\chi_r^-,\operatorname {adj}(O_\mu)
                  (D_+^2-r^2I)^{-1}\beta\rangle,              \tag{0.4}
\]

not (0.1).  The exact relation leaves an independent row:

\[
 \boxed{
 C_\mu(r)=
 \langle\chi_r^-,\operatorname {adj}(O_\mu)
                   D_+^2(D_+^2-r^2I)^{-1}\beta\rangle
 -{r\over4}\,\Delta_r'(0).}                    \tag{0.5}
\]

The first term in (0.5) is not a small remainder on the locked schedule
`N>>|r|`.  Schur-complement positivity and the quadratic discriminant give
exactly Cauchy--Schwarz for the two independent rows.  The new diagonal is
free, so interlacing supplies no sign for the derivative.

Finally, the favorable strict-sign family
`I-|eta><eta|/(2N+1)` has

\[
 {C_0(0)\over p_0}=-2N,
 \qquad
 {\mathcal A_0(0)\over p_0}=1.                  \tag{0.6}
\]

Thus the normalized cofactor itself diverges even in the best Herglotz
case.  The second equality is an essential cancellation caveat: this
family does not prove growth of the complete normalized response.

The results below are finite structural theorems and countermodels.  They
do not assert that an accidental or deliberately engineered scalar source
path can never have derivative numerically equal to (0.1) at one point.
Such a path can be made circular by putting the unknown cofactor into a
free diagonal.  What fails is a canonical identity forced by the source
displacement and capable of transferring Hermitian positivity to the
mixed row.

The countermodels are not matrices assembled from the actual prime-power
inventory.  This note proves no failure of an actual arithmetic matrix, no
failure of either checkpoint strict sign, no sign of the actual mixed
cofactor, no response decay or nondecay, no determinant convergence, no
zero statement, and no Riemann-hypothesis conclusion.  The formal state
remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following current repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md` | `ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3` |
| `tests/test_capture_free_actual_ground_parity_response_barrier.py` | `477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772` |
| `notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md` | `9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13` |
| `tests/test_source_quotient_pick_herglotz_interlacing_barrier.py` | `86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658` |
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `tests/test_source_boundary.py` | `a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808` |
| `notes/RELATIVE_ODD_GAP_ENDPOINT_SCHUR_GATE.md` | `81bc4055b644a409c10d9d06f145040e822452dc5fc9a0fc4888c63fb535f3ab` |
| `tests/test_relative_odd_gap_endpoint_schur.py` | `cee76e8a21c3406b49bd123832a4e47bacd41ebf16622cf91c69fd48ba130127` |
| `notes/PAIRED_TRACE_ODD_RESOLVENT_GATE.md` | `1c4568a142779f0d7cab023bfb41811d10c2ccac37a505cbe7f079b972761755` |

The checkpoint-1.26 pair fixes the complete capture-free ground response,
the cofactor (0.1), and the normalization `p_mu`.  The checkpoint-1.27 pair
fixes the exact source quotient and residue classifications.  The source
proof fixes the Cauchy/displacement structure.  The remaining files fix the
strict shifted-sector hypotheses and the favorable paired-trace family.

No zero table, RH premise, zero-simplicity premise, unsigned-prime
replacement, cached arithmetic matrix, or stored arithmetic ground vector
is imported.

## 2. Formal determinant derivative

Use the normalized positive odd basis

\[
 e_n^-={V_n-V_{-n}\over\sqrt2},\qquad 1\leq n\leq N,           \tag{2.1}
\]

and put

\[
 D_+=\operatorname {diag}(1,\ldots,N),
 \qquad
 (\beta)_n=\sqrt2 b_n,
 \qquad
 (\chi_r^-)_n={\sqrt2 n\over n^2-(\overline r)^2}.             \tag{2.2}
\]

The conjugate in (2.2) is required because the inner product is antilinear
in the first entry; it makes `C_mu(r)` meromorphic in `r`.  Jacobi's
formula gives, for every Hermitian direction `H`,

\[
 \left.{d\over dt}\det(O_\mu+tH)\right|_{t=0}
 =\operatorname {tr}\{\operatorname {adj}(O_\mu)H\}.          \tag{2.3}
\]

For real `r` and real source data, (0.2)--(0.3) follow because
`adj(O_mu)` is real symmetric.  For nonreal `r`, a Hermitian determinant
has a real derivative.  The two Hermitian directions

\[
 H_r^{\rm Re}={\beta(\chi_r^-)^*+\chi_r^-\beta^*\over2},
 \qquad
 H_r^{\rm Im}={\beta(\chi_r^-)^*-\chi_r^-\beta^*\over2i}       \tag{2.4}
\]

recover `Re C_mu(r)` and `Im C_mu(r)` separately.  Neither direction is
therefore an analytic Hermitian deformation in complex `r`.

If the formal path stays positive, then

\[
 \left.{d\over dt}\log\det(O_\mu+tH_r)\right|_{t=0}
 ={C_\mu(r)\over\det(O_\mu)},
 \qquad
 {d^2\over dt^2}\log\det(O_\mu+tH_r)
 =-\operatorname {tr}\{(O_t^{-1}H_r)^2\}\leq0.                \tag{2.5}
\]

Concavity alone does not sign the first derivative.  More importantly,
the next section shows that the direction in (2.5) is not a full
source-compatible tangent.

## 3. Exact source tangent and odd-lift criterion

Let `S_N` be the real affine space of inversion-symmetric source-Cauchy
matrices on the modes `-N,...,N`:

\[
 Q_{nm}=\begin{cases}
 a_{|n|},&n=m,\\[1mm]
 \dfrac{b_n-b_m}{n-m},&n\ne m,
 \end{cases}
 \qquad b_{-n}=-b_n,\quad b_0=0.                \tag{3.1}
\]

The shift by a moving ground eigenvalue only changes the arbitrary
diagonal parameters below, so it does not enlarge the tangent space.

### Theorem 3.1 (source tangent and pure-odd obstruction)

Every tangent `X` to `S_N` is uniquely parameterized by real numbers
`dot a_0,...,dot a_N` and `c_n=dot b_n`, with `c_-n=-c_n`, by

\[
 X_{nn}=\dot a_{|n|},
 \qquad
 X_{nm}={c_n-c_m\over n-m}\quad(n\ne m).         \tag{3.2}
\]

Equivalently,

\[
 [D,X]=|\dot\beta\rangle\langle\eta|
       -|\eta\rangle\langle\dot\beta|.          \tag{3.3}
\]

In the normalized even basis `V_0,e_1^+,...,e_N^+` and odd basis
(2.1), its parity blocks obey

\[
\begin{aligned}
 E_{00}&=\dot a_0,&
 E_{0n}&={\sqrt2 c_n\over n},&
 E_{nn}&=\dot a_n+{c_n\over n},\\
 O_{nn}&=\dot a_n-{c_n\over n},&
 E_{nm}&={2(nc_n-mc_m)\over n^2-m^2},&
 O_{nm}&={2(mc_n-nc_m)\over n^2-m^2}
 \quad(n\ne m).
\end{aligned}                                                    \tag{3.4}
\]

Consequently,

\[
 \boxed{T_QS_N\cap\{X:P_+XP_+=0,\ X=P_-XP_-\}=\{0\}.}         \tag{3.5}
\]

**Proof.**  Differentiating (3.1) gives (3.2), and taking commutator
entries gives (3.3).  Direct parity projection gives (3.4).  If the even
block vanishes, `E_0n=0` forces every `c_n=0`; then the remaining even
diagonal entries force every `dot a_n=0`.  This proves (3.5). \(\square\)

Thus a nonzero direction (0.2) cannot be embedded into the full matrix by
putting zeros on the even sector.  Allowing an even-sector contamination is
still constrained.

### Theorem 3.2 (odd-block lift criterion)

A real symmetric `N` by `N` matrix `H` is the odd restriction of a source
tangent if and only if

\[
 G_{nm}:={n^2-m^2\over2mn}H_{nm}                 \tag{3.6}
\]

satisfies the additive cocycle identities

\[
 \boxed{G_{nm}+G_{mk}+G_{kn}=0}                  \tag{3.7}
\]

for every triple of distinct positive indices.  The odd restrictions have
dimension `2N-1` and codimension `(N-1)(N-2)/2` in the real symmetric
`N` by `N` matrices, whose ambient dimension is `N(N+1)/2`.

**Proof.**  Put `u_n=c_n/n` in the last entry of (3.4).  Then

\[
 G_{nm}=u_n-u_m,                                 \tag{3.8}
\]

which proves necessity.  Conversely, (3.7) integrates `G` to numbers
`u_n`, unique up to a common constant.  Choose `c_n=nu_n` and
`dot a_n=H_nn+u_n`.  Formula (3.4) then gives the prescribed odd block.
There are `N` free diagonal entries and `N-1` independent differences in
(3.8), proving the dimension count. \(\square\)

The actual arithmetic direction could satisfy (3.7) accidentally.  The
source displacement does not force it, as the following strict-sign model
shows.

## 4. Exact strict-sign no-lift fixture

Take `N=3`, let `eta=(1,...,1)^T` on the seven modes `-3,...,3`, and put

\[
 Q=I-{1\over7}|\eta\rangle\langle\eta|,
 \qquad
 b_n=-{n\over7},
 \qquad
 a_n={6\over7}.                                  \tag{4.1}
\]

Every off-diagonal entry is `-1/7`, so (4.1) is exactly of the source form
(3.1).  It is positive semidefinite with simple even ground

\[
 \mu=0,
 \qquad
 \Phi={\eta\over7},
 \qquad
 \langle\eta,\Phi\rangle=1.                     \tag{4.2}
\]

Its odd block is `O_0=I_3`.  With anchor `kappa=V_0`, the two-dimensional
lower-Ritz plane contains the ground, so `u=mu=0`; the anchor-complement
compression is strictly positive and `O_0>0`.  Thus both checkpoint-1.25
strict signs hold.

At `r=0`, (2.2) gives

\[
 (\beta)_n=-{\sqrt2 n\over7},
 \qquad
 (\chi_0^-)_n={\sqrt2\over n}.                  \tag{4.3}
\]

The formal direction (0.2) is

\[
 (H_0)_{nm}=-{1\over7}\left({n\over m}+{m\over n}\right).    \tag{4.4}
\]

For the triple `(1,2,3)`, (3.6) gives

\[
 G_{12}={15\over56},
 \qquad
 G_{23}={65\over504},
 \qquad
 G_{31}=-{40\over63},                            \tag{4.5}
\]

and hence

\[
 \boxed{G_{12}+G_{23}+G_{31}=-{5\over21}\ne0.}  \tag{4.6}
\]

By Theorem 3.2, even the odd block `H_0` has no source-Cauchy lift.  At the
same time,

\[
 C_0(0)=\operatorname {tr}H_0=-{6\over7},         \tag{4.7}
\]

so the forbidden formal derivative is nonzero.  This fixture disproves a
universal source-algebraic identification of (0.1) with the canonical
Hermitian polarization derivative while preserving both strict signs.

## 5. The genuine symmetric-node extension

Fix a real `r>0` distinct from the old positive nodes.  Adjoin source
nodes `+r` and `-r`, source coefficients `+b_r` and `-b_r`, and a common
diagonal `a_r`.  The border from the old odd mode `e_n^-` to the new odd
mode is

\[
 (y_r)_n
 ={2(rb_n-nb_r)\over n^2-r^2}
 =\sqrt2\{r(R_r\beta)_n-b_r(\chi_r^-)_n\},
 \qquad
 R_r=(D_+^2-r^2I)^{-1}.                          \tag{5.1}
\]

The new shifted odd diagonal is

\[
 d_r=a_r-{b_r\over r}-\mu.                       \tag{5.2}
\]

Equations (5.1)--(5.2) follow directly from the same source quotient
`(b_x-b_y)/(x-y)`; no arbitrary border has been inserted.

Hold `d_r=d` fixed by choosing `a_r(b_r)=d+mu+b_r/r`, and define

\[
 q_r=\sqrt2 rR_r\beta,
 \qquad
 \Delta_r(b_r)=
 \det\begin{pmatrix}O_\mu&q_r-\sqrt2b_r\chi_r^-\\
 (q_r-\sqrt2b_r\chi_r^-)^*&d
 \end{pmatrix}.                                  \tag{5.3}
\]

The Schur determinant formula gives the exact quadratic

\[
\begin{aligned}
 \Delta_r(b_r)
 &=d\det(O_\mu)-q_r^*\operatorname {adj}(O_\mu)q_r\\
 &\quad+2\sqrt2b_r
   \operatorname {Re}\langle\chi_r^-,
                  \operatorname {adj}(O_\mu)q_r\rangle
 -2b_r^2\langle\chi_r^-,
                  \operatorname {adj}(O_\mu)\chi_r^-\rangle.
\end{aligned}                                                    \tag{5.4}
\]

For the real source data under consideration, the middle pairing is real,
and therefore

\[
 \boxed{
 \Delta_r'(0)=4r\langle\chi_r^-,
            \operatorname {adj}(O_\mu)R_r\beta\rangle.}        \tag{5.5}
\]

Since `D_+^2R_r=I+r^2R_r`, equations (0.1) and (5.5) give (0.5).  If the
raw diagonal `a_r`, rather than the shifted diagonal `d_r`, is held fixed,
then the exact derivative is instead

\[
 \boxed{
 \left.{d\over db_r}\Delta_r(b_r)\right|_{b_r=0,\ \dot a_r=0}
 =-{\det(O_\mu)\over r}
  +4r\langle\chi_r^-,
      \operatorname {adj}(O_\mu)R_r\beta\rangle.}              \tag{5.6}
\]

Thus neither natural diagonal convention produces `C_mu(r)` directly.

For `|r|>N`, one may expand

\[
 R_r=-{1\over r^2}
 \sum_{k\geq0}\left({D_+^2\over r^2}\right)^k,                \tag{5.7}
\]

and (5.5) then has leading relation `r Delta_r'(0)=-4C_mu(r)`.
But (5.7) requires `N^2/|r|^2<1`.  In the locked response regime
`N>>|r|`, it is unavailable, and indeed

\[
 \|D_+^2R_r\|
 \geq {N^2\over|N^2-r^2|},                      \tag{5.8}
\]

which tends to one rather than zero when `N/|r|` tends to infinity.
Consequently the first row in (0.5) cannot be discarded by a uniform
large-node expansion.

The extension is Hermitian only for real `r`.  Analytic continuation of
(5.4) to complex `r` does not retain Hermitian interlacing.

## 6. What positivity and interlacing actually give

Because `O_mu>0`, the extended odd block in (5.3) is positive definite
exactly when

\[
 d>(q_r-\sqrt2b_r\chi_r^-)^*
        O_\mu^{-1}(q_r-\sqrt2b_r\chi_r^-).        \tag{6.1}
\]

The cross coefficient in this quadratic obeys

\[
 \boxed{
 |(\chi_r^-)^*O_\mu^{-1}q_r|^2
 \leq
 \{(\chi_r^-)^*O_\mu^{-1}\chi_r^-\}
 \{q_r^*O_\mu^{-1}q_r\}.}                       \tag{6.2}
\]

This is precisely the discriminant information available from the
positive Schur complement.  It is Cauchy--Schwarz and loses the sign of the
mixed row.  Conversely, the free source diagonal `a_r` makes `d` arbitrary,
so it can enforce (6.1) without restricting that sign.

Cauchy interlacing compares the eigenvalues of `O_mu` with those of every
fixed Hermitian extension in (5.3).  The same interlacing inequalities hold
on both sides of `b_r=0`; by themselves they do not order the determinant
as `b_r` crosses zero.  Hence they see neither the orientation of
`Delta_r'(0)` nor the independent row in (0.5).  Log-determinant concavity
likewise reduces to (6.2).  These tools do not turn the source extension
into a signed estimate for (0.1).

## 7. Normalization by the ground--anchor overlap

For every `N>=1`, let `d=2N+1` and put on modes `-N,...,N`

\[
 Q_N=I-{1\over d}|\eta\rangle\langle\eta|,
 \qquad
 b_n=-{n\over d},
 \qquad
 \Phi={\eta\over d},
 \qquad
 \kappa=V_0.                                     \tag{7.1}
\]

This is the favorable source-Cauchy family from the paired-trace audit.  It
has a simple even ground at `mu=0`, `O_0=I_N`, a genuine Herglotz source
quotient, and both strict Ritz signs.  Its ground--anchor overlap is

\[
 p_0=\langle\kappa,\Phi\rangle={1\over d}.        \tag{7.2}
\]

At the origin,

\[
 C_0(0)=
 \sum_{n=1}^{N}{\sqrt2\over n}
                  \left(-{\sqrt2n\over d}\right)
 =-{2N\over d}.                                  \tag{7.3}
\]

Therefore

\[
 \boxed{{C_0(0)\over p_0}=-2N.}                  \tag{7.4}
\]

No estimate for the normalized mixed cofactor follows from the strict
signs, Herglotz structure, or interlacing alone.  However, the complete
profile has the exact cancellation

\[
 \mathcal A_0(0)=1+{C_0(0)\over\det(O_0)}
 ={1\over d}=p_0,
 \qquad
 {\mathcal A_0(0)\over p_0}=1.                  \tag{7.5}
\]

Thus (7.4) is not a response-growth counterexample.  It shows instead that
any successful normalized argument must preserve the cancellation between
the constant term and the mixed cofactor and must separately control
`p_mu`; bounding the cofactor magnitude cannot do that.

## 8. Audit of the proposed natural deformations

The preceding theorems leave the following exact ledger.

1. **Ground shift.**  Differentiating in `mu` gives

   \[
    {d\over d\mu}\det(Q_--\mu I)
    =-\operatorname {tr}\operatorname {adj}(O_\mu),            \tag{8.1}
   \]

   a trace, not the mixed row (0.1).

2. **Interval scale or prime-weight scale.**  Wherever such a parameter is
   differentiable, source compatibility gives a tangent of the form
   (3.2), and

   \[
    {d\over dt}\det O_t
    =\operatorname {tr}\{\operatorname {adj}(O_t)
       (\dot Q_{t,-}-\dot\mu_t I)\}.             \tag{8.2}
   \]

   Its diagonal and source row are independent arithmetic data.  Equating
   (8.2) with (0.1) would be a new actual-matrix identity, not a consequence
   of the displacement law.

3. **Interval center.**  Translation is the diagonal-unitary transport
   `U_theta=exp(i theta D)`.  Transporting `Q,eta,beta`, and inversion
   together is a gauge and leaves every characteristic determinant
   constant.  In a fixed parity frame its tangent `i[D,Q]` mixes parities
   and has zero odd--odd block; keeping the old inversion loses the parity
   determinant.

4. **Boundary twist.**  A scalar node shift `D -> D+rho I` leaves all source
   differences and `Q` unchanged and only translates the spectral
   coordinate.  A general quasiperiodic twist breaks the old inversion
   pairing unless the center and parity structure are transported, in which
   case it is again a gauge.

5. **Source phase.**  Multiplying a real source row by a nonreal phase does
   not preserve the real Hermitian quotient (3.1).  Diagonal-unitary phase
   transport preserves Hermiticity but is the center gauge just described.

6. **Observation parameter.**  Varying `r` differentiates `chi_r^-`; it
   does not deform `O_mu`.  The symmetric-node construction is the genuine
   source lift, and equations (5.5)--(5.6) are its exact stopping point.

7. **Engineered source direction.**  For `N=2`, every symmetric odd block
   has some source lift, but (3.5) forces a simultaneous even deformation.
   For `N>=3`, the cocycle obstruction is genuine.  An arbitrary free
   diagonal can always be scaled using the unknown value of `C_mu(r)` so
   that one scalar derivative matches it.  That construction is circular
   and transfers no positivity estimate.

## 9. Strict gate

The source-compatible determinant route can advance only with at least one
new input of the following kind:

1. an actual arithmetic identity proving the cocycle (3.7) for the mixed
   direction and controlling its unavoidable even-sector contamination;
2. a locked-schedule bound for the independent weighted row in (0.5),
   strong enough to survive `N>>|r|`;
3. a signed source estimate beyond Cauchy--Schwarz for the symmetric-node
   quadratic; or
4. a joint cancellation theorem for `1+C_mu/det(O_mu)` and the independent
   normalization `p_mu`.

None of these inputs is supplied by the two strict sector signs, the source
displacement identity, Hermitian interlacing, determinant concavity, the
PNT resolvent alone, or the checkpoint-1.27 Herglotz classification.

This is a barrier to the proposed proof mechanism, not a theorem that the
actual mixed cofactor is large or has the wrong sign.  All actual arithmetic
sign, response, convergence, zero, and RH questions remain open here.
