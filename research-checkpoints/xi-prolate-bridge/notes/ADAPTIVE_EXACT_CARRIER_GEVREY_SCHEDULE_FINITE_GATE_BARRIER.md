# Adaptive exact-carrier Gevrey schedule and finite-gate barrier

## 0. Exact outcome and claim boundary

Put

\[
 X(L)=e^{L/2}L^3,
 \qquad G(L)=2\pi e^{L/2}L^2.                       \tag{0.1}
\]

For every sufficiently large real target height `t`, there are an integer
`N`, a real `L`, and `lambda=e^(L/2)` such that

\[
 \boxed{t={2\pi(N+1)\over L},\qquad
 N=\lambda L^3+O(L).}                               \tag{0.2}
\]

The construction is explicit.  Solve one monotone scalar equation, round
one real number to the nearest integer, and then define `L` from the exact
carrier identity.  If `epsilon` is the rounding error, the schedule error
has an exact closed formula and the expansion

\[
 N-\lambda L^3
 =-\left({L\over2}+2\right)\epsilon+o(1),
 \qquad |\epsilon|\leq {1\over2}.                    \tag{0.3}
\]

In particular its absolute size is at most `L/4+1+o(1)`.

There is a stronger local form.  After matching the target, keep `N` fixed
while `L` varies through a micro interval of length `A/t`.  The cutoff
remains `X(L)+O_A(L)`, whereas its physical first-omitted edge moves by only
`O_A(1/L)`.  Thus an adaptive constant-`N` plateau removes the `A/2` edge
drift of the literal ceiling schedule from the common-window calculation.

The all-order and Gevrey prolate projection estimates are analytically
stable under every fixed-width perturbation `|N-X(L)|<=C L`.  So are the
ordinary derivative, endpoint-flatness, compact-BV, and fixed-index
conditional capture estimates described below.  This is a proof-level
generalization in this new note.  It does not alter the literal hypotheses,
hashes, or tests of the frozen dependencies, which state
`N=ceil(X(L))`.

At the same `L`, the adjacent cutoff `N+1` is analytically admissible and
has first-omitted edge `t+2*pi/L`.  However, neither adjacency nor absolute
Gevrey closeness preserves the finite simple-even, boundary-normalized, or
strict shifted-sector hypotheses needed by the selector route.  A positive
principal-extension model below proves that interlacing alone cannot do so.
Those hypotheses must be proved or assumed separately at whichever cutoff
is selected.

This is an unbound post-checkpoint-1.44 theorem/barrier note/test pair.  It
changes no standard eight file and adds no serialized numerical artifact.
It proves no actual finite strict gate, no actual endpoint-amplitude or
Hardy--Cauchy transfer, no decay of `eta_N^pr`, no actual-arithmetic sign,
no new zeta-zero theorem, no RH implication or converse, and no
de Bruijn--Newman `Lambda` bound.  The formal state remains
`P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three frozen theorem/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md | 384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c |
| tests/test_gevrey_prolate_remainder.py | 93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058 |
| notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md | fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2 |
| tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py | 696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0 |
| notes/RH_CONDITIONAL_FIXED_ZERO_SELECTOR_CAPTURE_THEOREM.md | 07345bdb6278cd2914c7edaaa711351f4b8aa020038dca7a19b8c406e4a0f84c |
| tests/test_rh_conditional_fixed_zero_selector_capture_theorem.py | 9de65e4fd61a71736c4df484a6b3f7ce0dd54a659b681baab0e6dd2bd0c36730 |

The Gevrey pair supplies the analytic-strip projection estimate and its
polynomial losses.  The ideal Stokes pair supplies the first-omitted edge,
the exact ceiling enclosure, and the `A/t` micro-window.  The conditional
capture pair records exactly which finite ground and shifted-sign
hypotheses are assumptions rather than consequences of the analytic
projection bound.  No zero table, external theorem, or producer artifact is
added.

## 2. The monotone continuous carrier inverse

For `L>=1`, define

\[
 \Psi(L)={2\pi\{X(L)+1\}\over L}
 =2\pi\left(e^{L/2}L^2+{1\over L}\right).            \tag{2.1}
\]

Its derivative is

\[
 \Psi'(L)=2\pi\left\{
 e^{L/2}\left({L^2\over2}+2L\right)-{1\over L^2}
 \right\}>0\qquad(L\geq1).                        \tag{2.2}
\]

Hence for every `t>=Psi(1)` there is a unique `ell>=1` such that

\[
 \Psi(\ell)=t,
 \qquad m_*={t\ell\over2\pi}=X(\ell)+1.             \tag{2.3}
\]

The `+1` is chosen because the edge of a cutoff `N` is carrier number
`m=N+1`.  Equation (2.3) is a continuous schedule only; `m_*` need not be
an integer.

## 3. Nearest-integer exact-carrier theorem

Choose any nearest integer `m=nint(m_*)`, with either choice allowed at a
tie, and put

\[
 \epsilon=m-m_*,\qquad
 L={2\pi m\over t},\qquad
 \lambda=e^{L/2},\qquad N=m-1.                       \tag{3.1}
\]

Then `|epsilon|<=1/2`, `N` is an integer, and by construction

\[
 \boxed{{2\pi(N+1)\over L}=t.}                       \tag{3.2}
\]

Set

\[
 a={2\pi\over t}={\ell\over X(\ell)+1}.
 \qquad L=\ell+a\epsilon.                            \tag{3.3}
\]

Since

\[
 {X(\ell+a\epsilon)\over X(\ell)}
 =e^{a\epsilon/2}
 \left(1+{a\epsilon\over\ell}\right)^3,            \tag{3.4}
\]

direct substitution gives the exact schedule-error formula

\[
 \boxed{
 N-X(L)=\epsilon+X(\ell)\left\{
 1-e^{a\epsilon/2}
 \left(1+{a\epsilon\over\ell}\right)^3
 \right\}.}                                         \tag{3.5}
\]

No asymptotic estimate and no unrounded floating-point carrier enters
(3.5).

For the expansion, note

\[
 X'(u)=X(u)\left({1\over2}+{3\over u}\right),
 \qquad
 X''(u)=X(u)\left({1\over4}+{3\over u}+{6\over u^2}\right).
                                                               \tag{3.6}
\]

Taylor's theorem, uniformly for `|epsilon|<=1/2`, gives

\[
 N-X(L)=\epsilon\left\{
 1-{X(\ell)\over X(\ell)+1}
 \left({\ell\over2}+3\right)\right\}
 +O\left({\epsilon^2\ell^2\over X(\ell)}\right).   \tag{3.7}
\]

Therefore

\[
 \boxed{
 N-X(L)=-\left({\ell\over2}+2\right)\epsilon
 +O\left({\ell^2\over X(\ell)}\right).}            \tag{3.8}
\]

Also `|L-ell|<=pi/t` and `L-ell=o(1)`, so (3.8) may use `L` in place of
`ell`.  In particular,

\[
 \boxed{|N-\lambda L^3|
 \leq {L\over4}+1+o(1).}                             \tag{3.9}
\]

This is the asserted fixed-constant `O(L)` schedule, not merely an
unspecified relative asymptotic.

## 4. Scale of the adaptive parameters

Taking logarithms in (2.3) yields

\[
 \ell=2\log t-4\log\log t+O(1),
 \qquad {L\over\log t}\longrightarrow2.             \tag{4.1}
\]

Equations (3.2), (3.9), and (4.1) then give

\[
 \lambda={t\over2\pi L^2}\{1+o(1)\},
 \qquad N={tL\over2\pi}+O(1),
 \qquad N\sim\lambda L^3.                            \tag{4.2}
\]

Thus an arbitrary cofinal target sequence gives a cofinal adaptive
`lambda` sequence.  No target-height density assertion is needed for the
arithmetic construction itself.

## 5. Constant-`N` micro-plateau

Fix `A>0` and retain the integer `N` constructed at the anchor `L`.  For
`0<=u<=A`, put

\[
 L_u=L+{u\over t},
 \qquad \lambda_u=e^{L_u/2},
 \qquad T_u={2\pi(N+1)\over L_u}.                    \tag{5.1}
\]

The edge motion is exact:

\[
 T_u={tL\over L+u/t},
 \qquad
 \boxed{t-T_u={u\over L+u/t}.}                       \tag{5.2}
\]

Consequently

\[
 0\leq t-T_u\leq {A\over L},
 \qquad
 {\lambda_u\over\lambda}=e^{u/(2t)}=1+O_A(t^{-1}). \tag{5.3}
\]

The cutoff remains in the same admissible band.  Taylor expansion at the
anchor, using (3.6), (3.9), and `t=2*pi*(N+1)/L`, gives uniformly for
`0<=u<=A`,

\[
 X(L_u)-X(L)={uL\over4\pi}+O_A(1).                   \tag{5.4}
\]

Hence

\[
 N-X(L_u)=N-X(L)-{uL\over4\pi}+O_A(1),              \tag{5.5}
\]

and in particular

\[
 \boxed{
 |N-X(L_u)|
 \leq\left({1\over4}+{A\over4\pi}\right)L+O_A(1).} \tag{5.6}
\]

This plateau has the full `A/t` length used for microscopic phase
averaging, but its carrier edge has width at most `A/L`, not a fixed
positive constant.

## 6. Uniform analytic-estimate audit

Consider the whole perturbation class

\[
 \mathcal S_C=\{(L,N):L\longrightarrow\infty,
 \ N\in\mathbb Z_{\geq0},\ |N-X(L)|\leq C L\},       \tag{6.1}
\]

where `C` is fixed.  Write `N=X(L)+theta_L L`, so `|theta_L|<=C`.
For the first omitted frequency,

\[
 \boxed{
 \Omega_N={2\pi(N+1)\over L}
 =G(L)+2\pi\theta_L+{2\pi\over L}.}                 \tag{6.2}
\]

Uniformly on `mathcal S_C`,

\[
 {N\over X(L)}=1+O_C\left({1\over\lambda L^2}\right),
 \quad
 \log N={L\over2}+3\log L+o(1),
 \quad
 \Omega_N=2\pi\lambda L^2+O_C(1).                  \tag{6.3}
\]

These identities are enough for the following proof-level extensions.

### 6.1 All-order and Gevrey projection

The all-order periodic tail has the form

\[
 C_rL^{r-1/2}N^{-r+1/2}+O_{r,B}(\lambda^{-B}).       \tag{6.4}
\]

Replacing `ceil(X)` by any member of `mathcal S_C` changes the first term
by a factor `1+o_C(1)`.  The growing-order analytic-strip term is

\[
 \exp\{C_\sigma K\log(K+2)-\sigma\Omega_N\}
 +\operatorname {poly}(\lambda,K,N)e^{-c\lambda^2}. \tag{6.5}
\]

On the polynomial Gevrey diagonal, `K=O(lambda*L)` while
`Omega_N=2*pi*lambda*L^2+O_C(1)`.  The bounded additive change in the
negative exponent only changes a multiplicative constant.  After the same
choice of the formal truncation constant, uniformly on `mathcal S_C`,

\[
 e_{\lambda,N}=O_C\{e^{-c_C\lambda L^2}\},
 \qquad
 U_Z=O_C\{e^{-c_C'\lambda L^2}\}                    \tag{6.6}
\]

for some positive, non-effective constants.  As in the frozen theorem,
these are absolute upper bounds, not relative sector estimates.

### 6.2 Derivatives, endpoints, and sampling

Every occurrence of the bandlimit in the admitted derivative arguments is
bounded by

\[
 {2\pi N\over L}=O_C(\lambda L^2),
 \qquad \sqrt{2N+1}=X(L)^{1/2}\{\sqrt2+o_C(1)\}.     \tag{6.7}
\]

Thus the ordinary second-derivative convergence, all-order endpoint
flatness, polynomial total-variation bound, and compact-BV conversion keep
their stated asymptotic classes uniformly for fixed `C`.  Fixed-index
carrier windows remain inside the cutoff because `N` still tends to
infinity exponentially in `L`.

Under RH, the schedule-free min--max estimate also remains valid at each
individual cutoff:

\[
 0\leq\mu_N\leq q_N={U_Z\over2}.                     \tag{6.8}
\]

Equation (6.8) transfers the absolute upper scale only.  It gives no
simple-ground, boundary-pairing, parity-gap, or shifted-sign theorem.

## 7. Literal ceiling scope and the generalized micro-window

For the frozen literal rule `N=ceil(X(L))`, its first omitted edge satisfies

\[
 G(L)+{2\pi\over L}
 \leq {2\pi(N+1)\over L}
 <G(L)+{4\pi\over L}.                                \tag{7.1}
\]

That exact enclosure is false for a general member of `mathcal S_C`.
Equation (6.2) gives instead

\[
 \left|{2\pi(N+1)\over L}-G(L)\right|
 \leq2\pi C+{2\pi\over L}.                          \tag{7.2}
\]

If an arbitrary `mathcal S_C` schedule is followed across an `A/T`
micro-window, its perturbation may swing between both extremes.  The
ceiling proof's edge-width bound is then replaced by

\[
 T_+-T_-\leq {A\over2}+4\pi C+o(1).                 \tag{7.3}
\]

Accordingly, the old common-window constant cannot be copied unchanged.
One would have to replace its positive margin by

\[
 q_{0,C}=B-\delta-{A\over2}-4\pi C-B_{\rm HSW}.      \tag{7.4}
\]

For the structured constant-`N` plateau, (5.2) improves (7.3) to

\[
 T_+-T_-\leq {A\over L}=o(1),                       \tag{7.5}
\]

so the limiting loss `A/2+4*pi*C` disappears.  This is a new corollary in
the present pair.  It does not rewrite the frozen ideal-Stokes bytes or
their exact ceiling theorem.  Any standard-file use must cite this new
pair rather than silently treating a frozen hash as if its literal
schedule had changed.

## 8. Adjacent-cutoff analytic stability

At the matched anchor, pass from `N` to `N+1` without changing `L`.  Then

\[
 {2\pi\{(N+1)+1\}\over L}
 =t+{2\pi\over L},
 \qquad
 (N+1)-X(L)=\{N-X(L)\}+1.                            \tag{8.1}
\]

Thus both cutoffs lie in one fixed `mathcal S_C` class.  Every estimate in
Section 6 applies to both.  For an arbitrary source `F`, nested orthogonal
projection also gives the exact monotonicity

\[
 \|(I-P_{N+1})F\|_2\leq\|(I-P_N)F\|_2,
 \qquad \|P_NF\|_2\leq\|P_{N+1}F\|_2.               \tag{8.2}
\]

Neither endpoint evaluation nor a signed finite matrix eigenvalue is
monotone under (8.2).  Absolute projection stability must not be promoted
to finite-gate stability.

## 9. Finite strict hypotheses are not inherited

Let `E_N` and `O_N` denote abstract even and odd positive principal blocks.
Their least values obey separate interlacing inequalities,

\[
 \lambda_{\min}(E_{N+1})\leq\lambda_{\min}(E_N),
 \qquad
 \lambda_{\min}(O_{N+1})\leq\lambda_{\min}(O_N),    \tag{9.1}
\]

but (9.1) contains no cross-parity ordering.  The exact positive principal
extension

\[
 E_N=(1),\quad O_N=(2),\qquad
 E_{N+1}=\begin{pmatrix}1&0\\0&3/4\end{pmatrix},
 \quad
 O_{N+1}=\begin{pmatrix}2&0\\0&1/2\end{pmatrix}    \tag{9.2}
\]

has a simple even ground and a strict odd gap at level `N`, but its level
`N+1` ground is odd.  Every displayed block is strictly positive.  Thus
positivity and principal nesting do not preserve the strict shifted odd
gate.

Boundary normalization is independent as well.  With endpoint functionals
`delta_N=(1)` and `delta_(N+1)=(1,1)`, take

\[
 E_N=(1),\qquad
 E_{N+1}=\begin{pmatrix}1&1/2\\1/2&1\end{pmatrix}.   \tag{9.3}
\]

The old ground has nonzero endpoint value.  The new simple ground is
proportional to `(1,-1)` and has zero endpoint value.  This is again a
strictly positive principal extension.

These are structural countermodels, not the actual Weil matrices.  Their
role is only to prove noninheritance from the available abstract data.  In
particular, adjacency does not establish any of the following:

1. a simple inversion-even actual ground;
2. nonzero actual boundary normalization;
3. strict lower-Ritz shifted odd or even signs;
4. the strict endpoint quotient branch `D_N>0`;
5. a quantitative even reserve, response normalization, or determinant
   transfer.

Strict inequalities are stable under a sufficiently small perturbation at
fixed dimension when a quantitative margin is known.  Here the dimension
changes and no relative margin for the new parity rows is frozen.  The
Gevrey theorem controls the projected prolate anchor absolutely; it does
not control the new Weil block relative to its possibly much smaller
spectral gaps.

Therefore an argument that proves one of two adjacent endpoint energies is
large cannot choose the favorable cutoff and silently carry the selector
hypotheses with it.  Those hypotheses must hold at both cutoffs, or a new
theorem must synchronize the favorable cutoff with the finite gates.

## 10. Exact phase relation at the matched edge

The target itself is an exact carrier, so its raw boundary phase vanishes.
For a row at `gamma=t-Delta`, however, (3.2) gives

\[
 \boxed{
 \sin^2\left({\gamma L\over2}\right)
 =\sin^2\left({\Delta L\over2}\right).}             \tag{10.1}
\]

If the offset is microscopic,

\[
 \Delta={2\pi x\over\log t},
 \qquad
 \sin^2\left({\gamma L\over2}\right)
 \longrightarrow\sin^2(2\pi x),                    \tag{10.2}
\]

because `L/log(t)->2`.  Thus exact edge matching is compatible with a
nonzero nearby-row phase whenever the limiting offset avoids its discrete
zero set.  It does not turn the target `t` itself into a phase-good row.
Nor does (10.1) prove that a weighted one-level-density amplitude is the
actual finite-prolate endpoint energy; that transfer remains a separate
arithmetic and Stokes obligation.

## 11. Stopping line

The scalar arithmetic schedule problem is closed: every sufficiently large
real target can be made an exact first-omitted carrier with only an `O(L)`
cutoff perturbation, and a constant-`N` micro-plateau keeps the physical
edge fixed to `o(1)` while preserving the Gevrey scale.  The absolute
analytic estimates and both adjacent cutoffs are stable.

The project does not close because the required finite actual gates are
not analytic projection estimates and are not inherited under adjacent
principal extension.  A successful continuation needs both an actual
endpoint/row transfer and a theorem placing the simple-even,
boundary-normalized, shifted-strict finite matrix on the same adaptive
cutoff selected by that transfer.  No such synchronization theorem is
proved here.
