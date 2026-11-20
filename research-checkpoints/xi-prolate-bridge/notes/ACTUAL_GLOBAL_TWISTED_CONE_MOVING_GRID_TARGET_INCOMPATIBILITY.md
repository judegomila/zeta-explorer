# Actual global twisted-cone moving-grid target incompatibility

## 0. Exact outcome and claim boundary

Let

\[
 L_k=2\log\lambda_k,\qquad \lambda_k\longrightarrow\infty,
 \qquad {N_k\over L_k}\longrightarrow\infty,
 \qquad
 \Phi_k=\sum_{|n|\leq N_k}\xi_{n,k}V_{n,k},             \tag{0.1}
\]

where the centered modes are

\[
 V_{n,k}(t)={(-1)^n\over\sqrt {L_k}}\,
             e^{2\pi int/L_k}.                         \tag{0.2}
\]

In particular, \(\lambda_k\to\infty\) forces \(L_k\to\infty\), as used
by the moving-grid limit below.

Put \(w_{n,k}=(-1)^n\xi_{n,k}\).  The exact lattice identity is

\[
 \boxed{\widehat\Phi_k(2\pi n/L_k)=\sqrt {L_k}\,w_{n,k}.}
                                                               \tag{0.3}
\]

Suppose that nonzero real projective scales \(a_k\) give the still-unproved
target convergence

\[
 a_k\widehat\Phi_k(z)\longrightarrow{\Xi(z)\over4}       \tag{0.4}
\]

locally uniformly on the open physical strip.  A direct 256-bit FLINT/Arb
completed-zeta calculation and an independent 512-bit Hardy-Z calculation
certify

\[
 {2905\over10^6}<\Xi(13)<{2906\over10^6},\qquad
 {-706\over10^6}<\Xi(15)<{-705\over10^6}.                \tag{0.5}
\]

Consequently, for the nearest lattice indices

\[
 n_x(k)=\left\lfloor{xL_k\over2\pi}+{1\over2}\right\rfloor,
                                                               \tag{0.6}
\]

\[
 a_k w_{n_{13}(k),k}>0,\qquad
a_k w_{n_{15}(k),k}<0                                  \tag{0.7}
\]

for all sufficiently large \(k\); the positive factor \(\sqrt {L_k}\) in
(2.4) is the only factor dropped when passing to these sign statements.  In
the literal determinant orientation
\(a_k=\sqrt {L_k}>0\), this says

\[
 \boxed{w_{n_{13}(k),k}>0>w_{n_{15}(k),k}.}              \tag{0.8}
\]

Thus the global twisted nonnegative cone, its opposite orientation, and
indeed every one-sign orientation are incompatible with (0.4).  Only modes
\(n=O(L_k)\) are needed, far inside the locked exponential cutoff.

Continuity strengthens the two-point statement.  Fixed open intervals about
13 and 15 have opposite target signs.  Their retained grids contain
\(\Omega(L_k)\) points, so the twisted weights have both signs
\(\Omega(L_k)\) times.  The exact Cauchy-kernel inertia formula then gives
negative index \(\Omega(L_k)\), even if the projective orientation varies.
No fixed-index Pontryagin replacement of the twisted Herglotz cone can
survive (0.4).

This is a conditional target-incompatibility theorem.  It does not prove
that the actual ground exists simply and evenly on the schedule, that
(0.4) holds, or that the actual global twisted cone fails without (0.4).
The certified finite signs and the elementary intermediate-value
consequence give at least one real zero of \(\Xi\) in \((13,15)\), but no
numerical zero isolation beyond that interval, enumeration, uniqueness,
simplicity, global zero theorem, off-line exclusion, Riemann hypothesis,
converse from the Riemann hypothesis, or Lambda bound.  The formal state remains
\(P0\_INVALIDATED\), and the checkpoint-1.32 standard eight are unchanged.

## 1. Frozen inputs and finite sign certificates

The proof imports only the following frozen repository bytes.

| Dependency | SHA-256 |
|---|---|
| notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md | 39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329 |
| tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py | 4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3 |
| notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md | 3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce |
| tests/test_actual_ground_fixed_mode_residue_sign_barrier.py | 5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216 |
| notes/OPPOSITE_BOUNDARY_TWISTED_WEYL_SOURCE_QUOTIENT_BARRIER.md | a6b21ec0048f632d67ff32f116291e011f66b5c1a168df12442cac19d33c2258 |
| tests/test_opposite_boundary_twisted_weyl_source_quotient_barrier.py | 5b368373194720eb8a332475c21425dace632678975127c7bbfdb94f863382d2 |
| notes/DETERMINANT_LIMIT_AUDIT.md | 1a77a7b6e7b9573c0f9f6656481af24962280959d867177fa232e8f2cfa006b0 |
| tests/test_determinant_bridge.py | d2fee5eb81291b8dbd2bb2e229a89c52cf36704f76d0873f4cdf4e505bb2c69d |
| notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md | d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0 |

The checkpoint-1.32 pair fixes the locked schedule and its fail-closed actual
source boundary.  The fixed-mode pair proves (0.3) and identifies
\(a_k=\sqrt {L_k}\) in the literal determinant normalization.  The
opposite-boundary pair fixes the twisted weights and the exact Cauchy-kernel
inertia classification.  The determinant and source notes fix the target
and centered-mode conventions.

The new finite certificates are:

| Artifact | SHA-256 |
|---|---|
| artifacts/xi_real_sign_13_15/xi_real_sign_producer.c | 1e98148b44eb11d2496a2f9fe6c0de2eddf4f4d727d1b13047755bc2f037c465 |
| artifacts/xi_real_sign_13_15/producer_256bits.txt | 03cef82f8adb24b6c7b35e2e97c2c9e7363ced079245a1b56be531bdd1f937a6 |
| artifacts/xi_real_sign_13_15/xi_real_sign_verifier.c | 6667cf135408fa1d76cef8615d3bab196872062fc60e410de11ca7baa3849334 |
| artifacts/xi_real_sign_13_15/verifier_512bits.txt | 02707035c10c098eecea659ac0459ef43ca550d3eaee0abf7f1bc93af520b08f |

Both programs were compiled against the repository-consistent native
FLINT 3.6.0 library, which contains Arb.  The producer evaluates the
completed-zeta formula directly:

\[
 \Xi(t)={1\over2}s(s-1)\pi^{-s/2}
              \Gamma(s/2)\zeta(s),\qquad s={1\over2}+it. \tag{1.1}
\]

The verifier does not call the direct zeta evaluator.  It calls the
independent Hardy-Z routine at twice the precision and uses

\[
 \boxed{
 \Xi(t)=-c(t)Z(t),\qquad
 c(t)={t^2+1/4\over2}\pi^{-1/4}
       \left|\Gamma\!\left({1\over4}+{it\over2}\right)\right|>0.}
                                                               \tag{1.2}
\]

Indeed \(s(s-1)=-(t^2+1/4)\), while the Hardy phase makes
\(\pi^{-s/2}\Gamma(s/2)\zeta(s)
=\pi^{-1/4}|\Gamma(s/2)|Z(t)\).  The verifier encloses

\[
 {-792\over1000}<Z(13)<{-791\over1000},\qquad
 {719\over1000}<Z(15)<{721\over1000},                  \tag{1.3}
\]

checks \(c(13),c(15)>0\), and reproduces the two enclosures in (0.5).
The two paths share FLINT/Arb transcendental primitives but use logically
different zeta and Hardy-Z formula trees.

## 2. Exact sampling and moving indices

Use

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.       \tag{2.1}
\]

For a retained lattice index \(n\), orthogonality gives

\[
\begin{aligned}
 \widehat f(2\pi n/L)
 &=\sum_{|j|\leq N}{(-1)^jc_j\over\sqrt L}
   \int_{-L/2}^{L/2}e^{2\pi i(j-n)t/L}\,dt\\
 &=(-1)^n\sqrt L\,c_n.
\end{aligned}                                           \tag{2.2}
\]

Applying (2.2) to \(f=\Phi_k\) proves (0.3).  For every fixed real \(x\),
(0.6) satisfies

\[
 \left|{2\pi n_x(k)\over L_k}-x\right|
 \leq{\pi\over L_k}\longrightarrow0,\qquad
 |n_x(k)|\leq{|x|L_k\over2\pi}+1.                      \tag{2.3}
\]

The hypothesis \(N_k/L_k\to\infty\) makes \(n_x(k)\) retained eventually.
Local uniform convergence on a compact neighborhood of \(x\), followed by
continuity of \(\Xi\), yields

\[
 a_k\sqrt {L_k}\,w_{n_x(k),k}
 =a_k\widehat\Phi_k(2\pi n_x(k)/L_k)
 \longrightarrow{\Xi(x)\over4}.                       \tag{2.4}
\]

Taking \(x=13,15\) and using (0.5) proves (0.7).  Notice that this is a
moving-index theorem: the fixed-prefix result near zero does not by itself
reach either sign-changing target interval.

## 3. Linear-many opposite signs

By (0.5) and continuity, choose a fixed \(\delta>0\) small enough that

\[
 \Xi(x)>0\quad(x\in I_+=(13-\delta,13+\delta)),\qquad
 \Xi(x)<0\quad(x\in I_-=(15-\delta,15+\delta)).          \tag{3.1}
\]

Shrink \(\delta\) if needed so that the closed intervals are disjoint and
the inequalities hold on their closures.  Local uniform convergence on
their union gives, for all sufficiently large \(k\),

\[
 a_kw_{n,k}>0\quad\left({2\pi n\over L_k}\in I_+\right),
 \qquad
 a_kw_{n,k}<0\quad\left({2\pi n\over L_k}\in I_-\right). \tag{3.2}
\]

For either interval the number of grid points obeys

\[
 \#\left\{n:{2\pi n\over L_k}\in I_\pm\right\}
 \geq{\delta L_k\over\pi}-2.                            \tag{3.3}
\]

All these indices are \(O(L_k)\) and are retained.  If \(a_k>0\), the
first interval supplies positive twisted weights and the second negative
ones.  If \(a_k<0\), their roles reverse.  Thus each sign occurs at least
\(\delta L_k/\pi-2\) times, independent of projective orientation.

Define the twisted Weyl function and its Pick kernel by

\[
 g_k(z)=\sum_{|n|\leq N_k}{w_{n,k}\over n-z},\qquad
 K_k(z,u)={g_k(z)-\overline{g_k(u)}\over z-\overline u}
 =\sum_{|n|\leq N_k}
 {w_{n,k}\over(n-z)(n-\overline u)}.                   \tag{3.4}
\]

After zero weights are deleted, evaluation at as many distinct
upper-half-plane nodes as there are poles gives an invertible Cauchy
matrix.  Congruence therefore proves

\[
 \kappa_-(K_k)=\#\{n:w_{n,k}<0\},\qquad
 \kappa_+(K_k)=\#\{n:w_{n,k}>0\}.                       \tag{3.5}
\]

Equations (3.2)--(3.5) imply

\[
 \boxed{\kappa_-(K_k)\geq{\delta L_k\over\pi}-2
        =\Omega(L_k),\qquad
        \kappa_+(K_k)=\Omega(L_k).}                     \tag{3.6}
\]

Hence target convergence excludes not only the global twisted Herglotz
cone but every fixed-negative-index Pontryagin substitute.

## 4. Reproduction and stopping line

The producer and verifier are standalone C11 programs.  On the pinned
native setup they are reproduced by compiling each source with

\[
 \text{\rm clang -O2 -std=c11 -Wall -Wextra -Werror}
                                                               \tag{4.1}
\]

against the include and library directories returned by the Homebrew
FLINT, GMP, and MPFR prefixes, followed by the link libraries
\(-lflint-lmpfr-lgmp-lm\).  Their standard output must equal the frozen
256-bit and 512-bit text files byte for byte.  The companion regression
performs this compilation when native FLINT is present and always validates
the frozen raw bytes, rational enclosures, distinct formula trees, hashes,
and mutation gates.

The theorem closes the global twisted-cone route under the target
hypothesis before any mass/anchor comparison, quotient-root clearance, or
large-index source-row estimate is needed.  It does not close the bridge:
one must still prove or replace the actual-ground target convergence and
the finite strict-sign inputs without assuming the now-incompatible global
twisted cone.  No actual-arithmetic failure follows from the conditional
incompatibility alone.
