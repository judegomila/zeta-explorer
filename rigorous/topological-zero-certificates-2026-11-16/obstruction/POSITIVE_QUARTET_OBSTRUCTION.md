# A positive theta-kernel deformation that defeats every fixed finite contour test

Research audit, 16 November 2026. This is an exact auxiliary construction. It is **not** the Riemann xi function, does not retain its Euler product or arithmetic identities, and is not a counterexample to RH. Its purpose is to test whether finite winding data, symmetry, positive rapid-decay kernels, and finitely many positive Taylor blocks can by themselves force the unbounded-order inequality in PR #56.

## 1. Frozen source and normalization

The actual source read was `judegomila/mathexplorer`:

| Ref | Path | Relevant content |
|---|---|---|
| `29d8f6f88250d976d4a45f6e0df0b6698bf46a16` (PR #56) | `rigorous/klein-annulus-coupling-2026-11-14/odd-sector-followup/operator-duality.md` | Fourier convention, actual theta kernel, complete odd/even positivity criterion |
| same | `rigorous/klein-annulus-coupling-2026-11-14/odd-sector-extension/local-global/local-to-global.md` | Odd Taylor blocks and the all-degree differential-polynomial target |
| same | `rigorous/klein-annulus-coupling-2026-11-14/odd-sector-extension/README.md` | Certified fourth block; strict local results only |
| `146ce77aa8407e912ed54c73e30664d86936c253` (PR #50) | `rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md` | Finite-head nullspace and residual Schur condition |
| `1de63e68375adb60b39ea7fdbe7d7b048b30ceea` (PR #49) | `rigorous/torus-heat-antibridge-2026-11-09/collective_certificate.md` | Contour transfer and finite theta approximation, with an unresolved global zero envelope |

The frozen source inventory and immutable repository links are in [SOURCES.md](../SOURCES.md). Three source notes are reproduced under `../reference/` for review; their original relative links refer to their original repository locations. The Fourier convention is

\[
f(t)=\xi(1/2+it)=\int_{\mathbb R}\kappa(u)e^{itu/2}\,du,
\qquad
\kappa(u)=\Phi(u/4).
\]

For `u>=0`, write

\[
\kappa(u)=e^{u/4}\sum_{n\ge1}P_0(v_n)e^{-v_n},
\quad P_0(v)=2v^2-3v,
\quad v_n=\pi n^2e^u.
\tag{1}
\]

The actual theta kernel is even. It and every fixed derivative have double-exponential decay at both ends of the real line. Differentiation term by term on compact subsets is justified by the theta exponential. The fixed-order derivatives on the positive half-line are again exponentially summable; evenness supplies the negative half-line. In particular all integrations by parts below have vanishing endpoint terms.

## 2. Exact global derivative bounds

Define rational polynomials by

\[
P_{j+1}(v)=vP_j'(v)+(1/4-v)P_j(v).
\tag{2}
\]

Then

\[
\kappa^{(j)}(u)=e^{u/4}\sum_{n\ge1}P_j(v_n)e^{-v_n}
\qquad (u\ge0).
\]

The two relevant polynomials are

\[
P_2(v)=2v^4-14v^3+\frac{165}{8}v^2-\frac{75}{16}v,
\]

\[
P_4(v)=2v^6-33v^5+\frac{647}{4}v^4-266v^3
 +\frac{15465}{128}v^2-\frac{1875}{256}v.
\tag{3}
\]

We claim the explicit global bounds

\[
\boxed{\kappa''(u)\ge-8\kappa(u),\qquad
\kappa^{(4)}(u)\ge-256\kappa(u)\quad (u\in\mathbb R).}
\tag{4}
\]

It suffices to prove `P2+8P0>0` and `P4+256P0>0` for `v>=3`, since every `v_n>=pi>3` in (1), all remaining weights are positive, and the even derivatives extend the bounds to negative `u`.

### Second derivative

Put `v=3+x`. Direct expansion gives

\[
\frac{P_2(v)+8P_0(v)}v
=2x^3+4x^2+\frac{53}{8}x+\frac{147}{16}>0
\quad(x\ge0).
\tag{5}
\]

### Fourth derivative

Set

\[
R_4(v)=\frac{P_4(v)+256P_0(v)}v
=2v^5-33v^4+\frac{647}{4}v^3-266v^2
 +\frac{81001}{128}v-\frac{198483}{256}.
\]

For each interval `[a,a+1]`, `a=3,4,5,6,7`, express

\[
R_4(a+x)=\sum_{i=0}^5 b_{a,i}\binom5i x^i(1-x)^{5-i}.
\]

All these rational Bernstein coefficients are positive. The following table lists the exact **minimum coefficient** for each interval; the full vectors and polynomial identities are in `positive_quartet_certificate.json` and are reproduced by the script.

| Interval | Minimum of the six Bernstein coefficients |
|---|---:|
| `[3,4]` | `232803/256` |
| `[4,5]` | `371701/256` |
| `[5,6]` | `298905/256` |
| `[6,7]` | `123307/256` |
| `[7,8]` | `309901/1280` |

The Bernstein basis is nonnegative and sums to one on `[0,1]`. This proves positivity on `[3,8]`. On the remaining half-line, set `v=8+x` and use

\[
R_4(8+x)=2x^5+47x^4+\frac{1543}{4}x^3+1184x^2
 +\frac{103529}{128}x+\frac{114493}{256}>0
\quad(x\ge0).
\tag{6}
\]

This proves (4) by exact rational polynomial inequalities, without numerical root finding or a truncated theta sum.

## 3. Insert an off-line quartet while retaining a positive kernel

Choose

\[
T\ge16,\qquad 0<\eta<1/2,
\]

and define

\[
a=\frac{8(T^2-\eta^2)}{(T^2+\eta^2)^2},\qquad
b=\frac{16}{(T^2+\eta^2)^2},\qquad
\widetilde\kappa=\kappa+a\kappa''+b\kappa^{(4)}.
\tag{7}
\]

Both coefficients are positive. By (4),

\[
\widetilde\kappa\ge(1-8a-256b)\kappa.
\]

Since `a<=8/T^2`, `b<=16/T^4`, and `T>=16`,

\[
8a+256b\le\frac{64}{T^2}+\frac{4096}{T^4}
\le\frac14+\frac1{16}=\frac5{16}.
\]

Consequently

\[
\boxed{\widetilde\kappa(u)\ge\frac{11}{16}\kappa(u)>0
\quad\text{for every real }u.}
\tag{8}
\]

The new kernel remains real, even and smooth, with double-exponential decay. Its Fourier trace is, by integration by parts in the fixed convention,

\[
\begin{aligned}
\widetilde f(t)
&=\int_{\mathbb R}\widetilde\kappa(u)e^{itu/2}\,du\\
&=\left(1-\frac a4t^2+\frac b{16}t^4\right)f(t)\\
&=Q_{T,\eta}(t)f(t),
\end{aligned}
\]

where

\[
\boxed{
Q_{T,\eta}(t)=
\frac{((t-T)^2+\eta^2)((t+T)^2+\eta^2)}{(T^2+\eta^2)^2}.
}
\tag{9}
\]

The multipliers `-t^2/4` and `t^4/16` are essential: the source uses `exp(itu/2)`, not `exp(itu)`.

The factor `Q` is real and even, equals one at zero, and is strictly positive on the real axis. It has exactly the four nonreal zeros

\[
t=\pm T\pm i\eta.
\tag{10}
\]

Thus the transform retains all original zeros with their multiplicities and adds an explicit off-real quartet, counting any coincident multiplicities. In the original `s=1/2+it` variable these are

\[
s=1/2\pm\eta\pm iT,
\]

inside the classical critical strip. Multiplication by a polynomial preserves the entire-function order one and the reflection/conjugation symmetries. The real-axis zero set and signs are unchanged because `Q(t)>0` for real `t`.

The exhibited quartet, by itself, proves that `f_tilde` does not have only real zeros. This conclusion does not require the source's Löwner equivalence. The next calculation also gives a direct negative energy witness when `eta` is sufficiently small.

### A direct negative odd-sector diagonal

Take `alpha>0`, as in the source's cutoff-energy normalization.

Choose `T` with `f(T)!=0`, which is possible arbitrarily far out because the zeros are discrete. Define the finite real quantity

\[
A(T)=-\bigl(\log|f|\bigr)''(T)
 +\frac1T\bigl(\log|f|\bigr)'(T).
\]

The Fourier calculation in the frozen source is an identity for any real even Schwartz convolution kernel, independently of RH or its arithmetic origin. Its odd spectral diagonal is

\[
C_-(t,t)=\frac\alpha\pi f(t)^2
\left[-(\log|f|)''(t)+\frac{(\log|f|)'(t)}t\right].
\]

For the positive multiplier (9), direct differentiation gives

\[
-\bigl(\log Q\bigr)''(T)+\frac1T\bigl(\log Q\bigr)'(T)
=-\frac2{\eta^2}
 +\frac{24T^2+2\eta^2}{(4T^2+\eta^2)^2}
\le-\frac2{\eta^2}+\frac3{2T^2}.
\tag{10a}
\]

The last inequality follows from the exact nonnegative difference

\[
\frac3{2T^2}-\frac{24T^2+2\eta^2}{(4T^2+\eta^2)^2}
=\frac{\eta^2(20T^2+3\eta^2)}{2T^2(4T^2+\eta^2)^2}.
\]

Consequently, if in addition

\[
0<\eta<1/2,\qquad
\eta^2<\frac2{\max(A(T),0)+3/(2T^2)+1},
\tag{10b}
\]

the normalized odd diagonal of `f_tilde` at `T` is less than `-1`. In particular,

\[
\boxed{\widetilde C_-(T,T)<0.}
\tag{10c}
\]

By continuity, normalized smooth bumps in a sufficiently small positive spectral window around `T` have negative quadratic energy. Their odd extensions give an odd operator test; a constant phase makes its inverse Fourier transform real, odd and Schwartz. This proves failure of complete odd-sector positivity directly. It uses the exact Fourier identity, not the all-order Löwner theorem. Its window may be far beyond every prescribed finite contour.

The extra smallness requirement on `eta` is compatible with every earlier estimate. In particular the bounds `a<=8/T^2`, `b<=16/T^4` are uniform in `0<eta<1/2`, so choosing `eta` after `T` does not invalidate finite-block stability below.

## 4. Why every fixed finite contour test survives

Let a finite set of contours and their interiors lie in `|t|<R`. Choose `T>R`. All four zeros (10) lie outside that disk. Hence `Q` has a holomorphic logarithm there and

\[
\frac1{2\pi i}\oint_C\frac{\widetilde f'(t)}{\widetilde f(t)}dt
=\frac1{2\pi i}\oint_C\frac{f'(t)}{f(t)}dt
\tag{11}
\]

for every contour on which `f` is nonzero. These are **exactly identical zero counts**, not only approximately equal numerical windings.

There is also uniform approximation on any fixed disk:

\[
\sup_{|t|\le R}|\widetilde f(t)-f(t)|
\le\sup_{|t|\le R}|f(t)|
\left(\frac{2R^2}{T^2}+\frac{R^4}{T^4}\right).
\tag{12}
\]

All fixed orders of complex derivatives converge locally uniformly as `T` tends to infinity. Thus any finite collection of strict numerical boundary inequalities or fixed approximation tolerances is preserved for sufficiently large `T`. The complete boundary functions are not identical; only the counts are identical, while function and derivative values can be made arbitrarily close. This distinction matters for any proposed exact reconstruction claim.

## 5. Every fixed strictly positive Taylor block also survives

Fix any `N` for which the actual-theta block `J_N` is strictly positive definite. This includes the certified `J_4` from PR #56. Uniformly for `0<eta<1/2`, as `T` tends to infinity,

\[
a=O(T^{-2}),\qquad b=O(T^{-4}),
\]

and, for each fixed derivative order `j`,

\[
\widetilde\kappa^{(j)}-\kappa^{(j)}
=a\kappa^{(j+2)}+b\kappa^{(j+4)}.
\tag{13}
\]

Every derivative on the right has finite unweighted and linearly weighted squared integral. The exact Taylor-entry formula therefore gives entrywise, and hence matrix-norm, convergence

\[
J_N(\widetilde\kappa)\longrightarrow J_N(\kappa).
\]

If the original minimum eigenvalue is `lambda_N>0`, choose `T` large enough that the perturbation norm is less than `lambda_N/2`. Then

\[
J_N(\widetilde\kappa)\succeq(\lambda_N/2)I>0.
\tag{14}
\]

The same choice can preserve any finite list of strict block/contour certificates. No uniformity in `N` is claimed. The required `T` may grow without bound with `N`; there is no single deformation shown to preserve every positive block at once. For each chosen deformation the added quartet forces failure at some finite order under the all-order equivalence.

## 6. Consequence for the proof attack

This gives a source-specific obstruction to the proposed finite-data shortcut. Even starting with the actual theta kernel, the following properties can coexist with an off-line quartet arbitrarily high up:

- real even symmetry and an entire transform of order one;
- a strictly positive double-exponentially decaying physical kernel, with the explicit lower bound (8);
- the classical zero strip and all actual real zeros;
- exactly the same winding/zero counts on every member of a prescribed finite collection of bounded contours;
- arbitrarily accurate agreement of values and fixed derivatives on a prescribed compact set;
- every member of a prescribed finite collection of strict odd Taylor-block certificates.

What is not preserved is the exact arithmetic structure of xi. A successful all-order argument must exploit information excluded by this deformation, or supply a genuine uniform infinite-tail sign/zero-exclusion theorem. The construction does not refute the actual theta inequality; it shows why the finite contour and finite-block information alone cannot prove it.

The finite-head Schur issue in PR #50 remains distinct and equally necessary. Once the verified head has a nullspace, an absolute small tail bound does not imply positivity on that nullspace. A determinant/winding proof would have to certify the full residual there, including its coupling to the head range. The positive-kernel deformation makes this obstruction compatible with the other finite geometric data rather than leaving it as an abstract matrix perturbation.

## 7. Reproduction

Run `python verify_positive_quartet_deformation.py` in this directory. The script uses exact SymPy rational identities to check the recurrence, all Bernstein expansions, both unbounded half-line coefficient proofs, Fourier normalization, quartet roots, the negative-diagonal correction, and the uniform lower factor. It writes `positive_quartet_certificate.json` and exits successfully only if every exact assertion passes.

The script checks the displayed finite algebra. Analytic decay, termwise differentiation, integration by parts, contour homotopy, and finite-dimensional continuity are justified in the text. This is an elementary exact proof with a symbolic audit, not a proof-assistant formalization.
