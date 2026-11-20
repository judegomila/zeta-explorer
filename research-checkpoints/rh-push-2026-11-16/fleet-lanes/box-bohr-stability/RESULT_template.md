# box-bohr-stability: Bohr lifts of finite zeta-type objects and multivariate stability tests

Lane: compute arm of the stable-polynomial (multivariate Lee-Yang) line. Date: 2026-11-17.
Status labels: PROVED (argument given here), CLASSICAL, CERTIFIED (python-flint/Arb interval arithmetic), SCREENED (float64, GPU or CPU; never a verdict), OPEN.

## 0. Verdict

@@VERDICT@@

## 0.1 Plan, and what is new relative to the atlas and the obstruction map

Plan: lift every finite zeta-type object to the polydisc, test one-variable sections on the diagonal and multivariate stability-type properties off it, on zeta and on the controls, with a float64 GPU screen and an Arb stage for every verdict; report the first size at which each property fails for each input.

Relation to earlier material. The atlas (PR 27, `historical-routes.md`) closes a Gibbs-weight Lee-Yang route and records as unresolved "ferromagnetic finite partition functions converging locally uniformly to the theta transform". The obstruction map has the prime chain on the Bohr torus (items 16-18: l^1/l^2 thresholds, coverage Q* = (log(t_0/2 pi))^2/16) but no multivariate stability test of lifted objects. New here: (i) the equivalence T9 between polydisc stability of the lifted Dirichlet factor (S1) and eventual real-rootedness of the completed section, with the explicit threshold; (ii) the translation statement T3, which removes every torus-uniform property as a separator from sign twists; (iii) the exact first failure P = 7 for Davenport-Heilbronn with its closed form (T5); (iv) certified first-failure sizes for zeta itself in each finite scheme; (v) the additive twin ladder passes S1 (T4 ii). Not new: T2 restricted to the diagonal is the coverage theorem of `sq-causal-cascade`; T6 is Grace-Walsh-Szego; the DH supremum 1.1203625 is known. On the atlas condition: the Euler K = 1 sections are exactly "ferromagnetic" finite objects (products of factors 1 + a_p w_p with a_p > 0), they are real-rooted only above t*(P), and at a fixed height the family leaves the real-rooted regime once P exceeds about (log t)^2/16 (certified examples: P = 11 at t < 103, P = 17 at t < 2253); so this family does not supply the missing convergent ferromagnetic approximants.

## 1. Definitions

**Inputs.** zeta; DH (Davenport-Heilbronn, a_n = (1, kappa, -kappa, -1, 0) mod 5, gamma factor (5/pi)^{s/2} Gamma((s+1)/2)); completely multiplicative twists of zeta with zeta's gamma factor: tw2m (eps_2 = -1), tw2h (eps_2 = 1/2), liou (eps_p = -1 for all p); EA = zeta(s+a) zeta(s-a) (a = 0.25, also 0.1, 0.4); NR = xi(s)(2 cosh((s-1/2) log q) + c) ((q,c) = (3,2.2) and four others); arbitrary unimodular completely multiplicative twists omega (torus translates, see T3). Backward heat is not a Dirichlet object and has no Bohr lift in the sense used here; it is not run (not formulable).

**Lift.** s = 1/2 + x + it. Each p^{-s} is replaced by z_p = p^{-1/2} w_p with w_p an independent complex variable; the critical polydisc is |w_p| <= 1, its distinguished boundary the torus |w_p| = 1; the point of the actual function is w_p = p^{-x-it} ("the diagonal"; radii p^{-x}, phases th_p = t log p). A finite Dirichlet object D(s) = sum_j c_j n_j^{-s} lifts to D(w) = sum_j c_j n_j^{-1/2} prod_p w_p^{v_p(n_j)}. The reflected factor D(1-s) lifts to D#(w) = D(1/w) (real coefficients); on the torus D#(w) = conj D(w).

**Lifted completed object.** M(u, w) = u D(w) + u^{-1} D#(w), where u stands for the archimedean phase (G(s)/G(1-s))^{1/2}; on the line |u| = 1, and for x > 0, |u|^2 = |G(s)/G(1-s)| = (t/2 pi)^x (1 + O(1/t)) for the zeta gamma factor ((5t/2 pi)^x for DH). The section along the diagonal is the completed finite object G(s) D(s) + G(1-s) D(1-s).

**Finite objects.**
- (a) AFE, size N: D = sum_{n<=N} a_n n^{-s} (sharp), or with Riesz weights (1 - log n/log(N+1)). "Matched window" of size N: 2 pi N^2/q < t < 2 pi (N+1)^2/q, q = conductor (1, or 5 for DH): the range of t where N is the Riemann-Siegel length.
- (b) Theta form, size N: F(z) = 2 int_0^oo Phi_N(u) cos(zu) du, Phi_N = N-term theta kernel with coefficients a_n (closed form by incomplete gamma functions; lylib `thalf`). The lift multiplies the n-th term by omega(n) in the direct part and conj omega(n) in the reflected part.
- (c) Euler, size P, depth K: D = prod_{p<=P} sum_{k<=K} (eps_p p^{-s})^k; K = oo is the full local factor. DH: c_1 prod_chi + c_2 prod_chibar (a sum of two products).
- (d) Twin ladder of PR 13 (`research-checkpoints/twin-ladder-physics-2026-10-19/sources/twin-ladder.js`, thermodynamic weights off): D = sum_{p<=P} sum_{m<=M} p^{-ms}: an additive sum over primes of one-variable ladders, not a product (the source file states this itself).

**Properties tested.**
- R (one-variable section, real-rootedness): in a window T1 < t < T2, |Re s - 1/2| < Y: n_tot zeros (argument principle), n_real sign changes on the line; PASS iff every zero in the window is on the line; the count n_tot is compared with the expected count from the gamma phase.
- S1 (zero-freeness of the lifted Dirichlet factor on the closed critical polydisc): D(w) != 0 for all |w_p| <= 1. Quantified by x_sup = sup{x : D has a zero on the polytorus |w_p| = p^{-x}}; S1 holds iff x_sup < 0 (Lemma L1).
- HB (torus-uniform Hermite-Biehler / Lee-Yang property with the archimedean variable): M has no zero with |w_p| = p^{-x}, 0 < x <= X, |u|^2 = |G(s)/G(1-s)| at height t, for every torus phase. Quantified by the threshold t*(X) above which it holds.
- C (Lee-Yang circle property in each variable separately): with u and all w_p (p != q) on their circles, all zeros of w_q -> M lie on |w_q| = 1.
- MA (multi-affine symmetrisation, then S1 for the symmetrised polynomial).
- Q(x0) (diagonal restriction of S1): the sharp main sum D_N(s) has no zero with Re s > 1/2 + x0 in its matched window.
- TR (torus translates): R for the section through a translated torus point omega instead of the diagonal.

## 2. Structural statements

@@THEORY@@

## 3. Table

@@TABLE@@

## 4. Data

@@DATA@@

## 5. Controls, by step

@@CONTROLS@@

## 6. What ran

@@RAN@@

## 7. Three weakest points

@@WEAK@@
