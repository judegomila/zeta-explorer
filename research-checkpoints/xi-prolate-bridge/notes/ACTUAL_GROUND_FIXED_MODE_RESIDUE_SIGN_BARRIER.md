# Actual-ground fixed-mode residue-sign barrier

## 0. Exact outcome and claim boundary

This note tests whether the actual arithmetic even ground can enter the
positive-residue cone proposed in the checkpoint-1.27 Pick--Herglotz route.
There is a sharp conditional obstruction.  Let `Phi_lambda` be the real,
inversion-even, boundary-normalized actual ground of the complete pinned
finite Weil matrix, and write

\[
 \Phi_\lambda=\sum_{|j|\leq N_\lambda}\xi_{j,\lambda}V_{j,\lambda},
 \qquad \xi_{-j,\lambda}=\xi_{j,\lambda},
 \qquad \sum_{|j|\leq N_\lambda}\xi_{j,\lambda}=1.       \tag{0.1}
\]

For every retained mode there is an exact sampling identity

\[
 \boxed{
 \sqrt L\,\xi_{n,\lambda}
 =(-1)^n\widehat\Phi_\lambda(2\pi n/L).}                 \tag{0.2}
\]

Consequently, on any unbounded schedule on which the **desired but still
unproved** projectively scaled actual-ground limit

\[
 s_\lambda\widehat\Phi_\lambda(z)
 \longrightarrow {\Xi(z)\over4},
 \qquad s_\lambda\in\mathbb R\setminus\{0\},         \tag{0.3}
\]

holds locally uniformly near zero, every fixed coefficient prefix is
eventually alternating:

\[
 \boxed{
 s_\lambda\sqrt L\,\xi_{n,\lambda}
 \longrightarrow(-1)^n{\Xi(0)\over4}.}                  \tag{0.4}
\]

For the literal source determinant normalization,
`delta_N=L^(-1/2)*eta` and `delta_N(xi_delta)=1`, whereas (0.1) has
`<eta,Phi_lambda>=1`.  Hence `xi_delta=sqrt(L)*Phi_lambda` and
`s_lambda=sqrt(L)`; in that normalization (0.4) reads

\[
 \boxed{L\xi_{n,\lambda}
 \longrightarrow(-1)^n{\Xi(0)\over4}.}                 \tag{0.5}
\]

Since `Xi(0)>0`, the actual source secular function cannot then be
Herglotz, and its squared-variable odd profile cannot be Stieltjes.  In the
positive determinant orientation this is already witnessed by
`xi_(1,lambda)<0<xi_(2,lambda)`.  More strongly, for each fixed `M`, its
Pick kernel eventually has at least `2*ceil(M/2)` negative squares in that
orientation.  If a global projective sign is left unspecified, at least
`2*floor(M/2)` negative squares remain.
Thus the negative index diverges along any target-convergent schedule with
`N_lambda -> infinity`.

This conclusion is about the actual ground line, conditional on the very
projectively normalized ground-transform limit required by the bridge.  It is stronger in that
direction than an abstract source-Cauchy countermodel: an eventual
all-positive coefficient/Herglotz theorem, or an eventual all-nonpositive
noncentral coefficient/Stieltjes theorem, would contradict the target
rather than prove it.

Nothing here proves (0.3), an arithmetic sector sign, a coefficient-cone
inequality, dangerous-response decay, determinant convergence, a zero
statement, or the Riemann hypothesis.  Mixed residues remain compatible
with positivity of the checkpoint-0.46 coefficient polynomial and with the
checkpoint-1.25 strict signs.  The formal project state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following current repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md` | `9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13` |
| `tests/test_source_quotient_pick_herglotz_interlacing_barrier.py` | `86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658` |
| `notes/DETERMINANT_LIMIT_AUDIT.md` | `1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0` |
| `tests/test_determinant_bridge.py` | `d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d` |
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `notes/POLYLOG_GROUND_TRANSFER_SOURCE_AUDIT.md` | `dde2e190005409e28cce0e675982c46898f1c1ecb46f9cbf13b7b7def78ec988` |
| `tests/test_polylog_ground_transfer_source_audit.py` | `fde8fbe174fecd8b5bf3c761ff2bde83983d1e66d5177dae84ae07b294ba4539` |

The first pair fixes the checkpoint-1.27 residue criteria.  The determinant
pair fixes `s_lambda=sqrt(L)` for the literal characteristic normalization
and identifies locally uniform ground-transform convergence as an open
bridge input.  The source proof
fixes the complete pole--archimedean--minus-prime matrix and its actual
ground line.  The final pair keeps a real-axis ground-transform hypothesis
distinct from a theorem already proved for the actual source.

No zero table, RH premise, unsigned-prime replacement, stored arithmetic
ground vector, or numerical arithmetic matrix is imported.

## 2. Actual arithmetic ground and centered modes

Fix `lambda>1`, put

\[
 L=2\log\lambda,
 \qquad I_\lambda=[-L/2,L/2],
 \qquad
 V_{j,\lambda}(t)={(-1)^j\over\sqrt L}e^{2\pi ijt/L}.
                                                               \tag{2.1}
\]

The actual finite source matrix is assembled before any ground operation:

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),             \tag{2.2}
\]

where `a_n` and `b_n` contain the complete pole minus corrected
archimedean minus inclusive prime-power source.  In particular, the
von-Mangoldt contribution is not replaced by an absolute majorant.  Let
`Phi_lambda` in (0.1) denote a real inversion-even lowest eigenvector when
that line is simple, normalized by the source boundary vector

\[
 \eta_\lambda=\sum_{|j|\leq N_\lambda}V_{j,\lambda},
 \qquad
 \langle\eta_\lambda,\Phi_\lambda\rangle=1.          \tag{2.3}
\]

Equation (2.3) is exactly the last identity in (0.1).  It fixes the scalar
but does not assert that the ground is simple and even on an unbounded
schedule.  Those remain separate arithmetic obligations.

The literal determinant ground `xi_delta` instead obeys

\[
 \delta_N=L^{-1/2}\eta_\lambda,
 \qquad \delta_N(\xi_\delta)=1,
 \qquad \xi_\delta=\sqrt L\,\Phi_\lambda.             \tag{2.4}
\]

Thus a locally uniform determinant-normalized limit for `xi_delta` is
exactly (0.3) with `s_lambda=sqrt(L)`.  Allowing a general nonzero real
`s_lambda` states the projective consequence without silently identifying
a unit, source-boundary, or determinant normalization.

Use the zero-extended transform

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.     \tag{2.5}
\]

The source-centered phase in (2.1), not the detailed signs of `a_n` or
`b_n`, supplies the first obstruction.

## 3. Exact moving-lattice sampling theorem

### Theorem 3.1 (coefficient samples)

For every finite state

\[
 f=\sum_{|j|\leq N}c_jV_{j,\lambda}
\]

and every retained integer `n`,

\[
 \boxed{
 \widehat f(2\pi n/L)=(-1)^n\sqrt L\,c_n.}           \tag{3.1}
\]

**Proof.**  At the lattice point `omega_n=2*pi*n/L`, orthogonality on the
full interval gives

\[
\begin{aligned}
 \widehat f(\omega_n)
 &=\sum_{|j|\leq N}{(-1)^jc_j\over\sqrt L}
   \int_{-L/2}^{L/2}e^{2\pi i(j-n)t/L}\,dt\\
 &=(-1)^n\sqrt L\,c_n.
\end{aligned}                                                   \tag{3.2}
\]

Applying (3.1) to the actual ground gives (0.2).  No eigenvalue equation,
PNT estimate, or asymptotic approximation is used.  \(\square\)

### Theorem 3.2 (target convergence forces fixed-prefix alternation)

Let `lambda_k -> infinity`, `L_k=2*log(lambda_k)`, and
`N_(lambda_k) -> infinity`.  Suppose actual grounds satisfying (0.1)--(2.3)
exist and there are nonzero real scalars `s_(lambda_k)` for which (0.3) holds
locally uniformly on one fixed neighborhood of zero.  Then for every fixed
integer `n`, (0.4) holds.  In particular, for
every fixed `M>=1`, all sufficiently large `k` satisfy

\[
 \boxed{
 \operatorname {sgn}\xi_{n,\lambda_k}
 =\operatorname {sgn}(s_{\lambda_k})(-1)^n
 \quad(|n|\leq M).}                                  \tag{3.3}
\]

**Proof.**  For fixed `n`, the moving point
`omega_(n,k)=2*pi*n/L_k` tends to zero and remains in the fixed
neighborhood.  Local uniform convergence and continuity of `Xi` give

\[
 s_{\lambda_k}\widehat\Phi_{\lambda_k}(\omega_{n,k})
 \longrightarrow {\Xi(0)\over4}.                    \tag{3.4}
\]

Multiply (0.2) by `s_(lambda_k)` and combine with (3.4).  The limit is
nonzero, so its sign is stable; division by a real nonzero scale gives
(3.3).
There are only finitely many indices in a fixed prefix, giving one common
threshold and (3.3).  \(\square\)

For clarity, the value `Xi(0)>0` is elementary from the completed-zeta
formula at the center; it imports no information about a nontrivial zero.

## 4. Diverging Pick index and failure of both residue cones

For the boundary-normalized ground, checkpoint 1.27 gives

\[
 h_\lambda(s)=\sum_{j=-N_\lambda}^{N_\lambda}
                  {\xi_{j,\lambda}\over j-s},        \tag{4.1}
\]

\[
 {h_\lambda(z)-\overline{h_\lambda(w)}
  \over z-\overline w}
 =\sum_{j=-N_\lambda}^{N_\lambda}
 {\xi_{j,\lambda}\over
  (j-z)(j-\overline w)}.                             \tag{4.2}
\]

The negative-square index of (4.2) is exactly the number of negative
nonzero `xi_(j,lambda)`.  In the positive determinant orientation
`s_(lambda_k)>0`, Theorem 3.2 says that among the raw indices `-M,...,M`
the negative coefficients are precisely the two copies `+/-n` for odd
`1<=n<=M`.  Therefore

\[
 \boxed{
 \kappa_-(h_{\lambda_k})
 \geq 2\left\lceil {M\over2}\right\rceil}            \tag{4.3}
\]

for all sufficiently large `k`.  Since `M` is arbitrary,

\[
 \boxed{\kappa_-(h_{\lambda_k})\longrightarrow\infty.} \tag{4.4}
\]

This divergence does not depend on declaring the global sign of a
projective comparator.  If a convention yields the fixed-prefix pattern
`sigma*(-1)^n`, `sigma` in `{+1,-1}`, then among `1<=n<=M` at least
`floor(M/2)` symmetric pairs carry negative Pick weights.  Therefore the
orientation-free bound

\[
 \boxed{
 \kappa_-(h_{\lambda_k})
 \geq2\left\lfloor {M\over2}\right\rfloor}           \tag{4.5}
\]

still implies (4.4).

The residues of `h_lambda` itself are `-xi_(j,lambda)`; equation (4.3)
counts the negative weights in the Pick kernel, not the signs of those
meromorphic residues.

The exact checkpoint-1.27 classifications now give two immediate
corollaries.

1. `h_lambda` is Herglotz exactly when every `xi_(j,lambda)>=0`.  If
   `s_(lambda_k)>0`, then `xi_(1,lambda_k)<0`; if
   `s_(lambda_k)<0`, then `xi_(0,lambda_k)<0`.  Thus every sufficiently
   large member fails the Herglotz condition, independent of global
   orientation.
2. The squared-variable profile

   \[
    F_\lambda(t)=1+\sum_{n=1}^{N_\lambda}
       {-2n^2\xi_{n,\lambda}\over t+n^2}             \tag{4.6}
   \]

   is Stieltjes exactly when every noncentral `xi_(n,lambda)<=0`.  If
   `s_(lambda_k)>0`, then `xi_(2,lambda_k)>0`; if
   `s_(lambda_k)<0`, then `xi_(1,lambda_k)>0`.  Thus every sufficiently
   large member also fails the Stieltjes condition.  Its fixed atoms
   alternate as well.

The same argument rules out any fixed finite Pontryagin index for the
natural source quotient.  It does **not** rule out a real-rooted quotient,
positive `F_lambda(t)` on `t>=0`, or the checkpoint-0.46 coefficient cone;
all three can hold with mixed residues.

## 5. Gauge invariance of the characteristic-ratio weights

The centered phase can be moved from the basis into the boundary vector,
but that does not change a characteristic-ratio residue.  More generally,
make the diagonal real basis change

\[
 W_j=s_jV_j,
 \qquad s_j\in\{+1,-1\}.                            \tag{5.1}
\]

If the coordinates of `Phi_lambda` and `eta_lambda` in the `V` basis are
`xi_j` and `1`, then their coordinates in the `W` basis are

\[
 \widetilde\xi_j=s_j\xi_j,
 \qquad \widetilde\eta_j=s_j.                     \tag{5.2}
\]

The source characteristic ratio has the invariant form

\[
 h_\lambda(s)
 ={\langle\eta_\lambda,(D-sI)^{-1}\Phi_\lambda\rangle
   \over\langle\eta_\lambda,\Phi_\lambda\rangle}
 =\sum_j{w_j\over j-s},
 \qquad
 w_j={\overline{\eta_j}(\Phi_\lambda)_j
       \over\langle\eta_\lambda,\Phi_\lambda\rangle}. \tag{5.3}
\]

Consequently

\[
 \boxed{
 \widetilde w_j
 ={s_j(s_j\xi_j)\over1}=\xi_j=w_j.}                \tag{5.4}
\]

For the uncentered modes
`W_j=L^(-1/2)*exp(2*pi*i*j*t/L)`, one has `s_j=(-1)^j`.
The ground coordinates can then become one-signed on a fixed prefix, but
the boundary coordinates acquire the same alternating phase.  Their
products, the weights in (4.1), and the residues `-w_j` do not change.
Thus the centered phase in Theorem 3.2 is not a removable sign convention
for the source quotient.

If instead a diagonal operator is required to preserve the boundary line,
`S eta_lambda=sigma eta_lambda`, linear independence forces
`s_j=sigma` for every `j`; only a global sign is allowed.  Either viewpoint
gives the same conclusion: a diagonal gauge cannot turn the original
source characteristic ratio into a positive-residue quotient.

This statement is deliberately narrow.  It does not claim that no
non-diagonal transformation of the arithmetic matrix is useful, nor that
the complete source matrix can never have another form of sign regularity.
The earlier positivity-improving and total-positivity audits contain the
separate obstructions to those broader formal routes.

## 6. Fail-closed route boundary

The theorem/barrier pair is:

1. the exact source-mode sample formula (3.1); and
2. the conditional consequence that the required projectively normalized
   actual-ground limit
   forces fixed-prefix alternation and the diverging index (4.4).

Any use of this note must reject a claimed pass if it

1. treats (0.3) as proved rather than as the open projective target
   hypothesis;
2. transfers an admitted projected-anchor coefficient asymptotic to the
   actual ground without assuming actual-ground convergence;
3. drops the centered phase `(-1)^n`;
4. confuses negative Pick weights `xi_j` with residues `-xi_j`;
5. drops or changes the normalization scale `s_lambda` without tracking
   its sign;
6. treats the uncentered-basis ground coordinates as the invariant
   characteristic-ratio weights; or
7. infers failure of the mixed coefficient cone, either strict Ritz sign,
   dangerous-response decay, RH, or a converse from RH.

The arithmetic conclusion is therefore a route selection, not a negative
ground theorem.  The actual von-Mangoldt and archimedean structure would
have to prove the mixed-residue coefficient cone or the checkpoint-1.26
mixed cofactor directly.  It cannot consistently prove an eventual
one-sign residue measure while retaining the desired `Xi/4` ground limit.
