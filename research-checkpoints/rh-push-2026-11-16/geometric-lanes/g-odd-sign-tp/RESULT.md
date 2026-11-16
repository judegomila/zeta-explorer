# g-odd-sign-tp: total positivity and the odd-sector sign Delta_- <= 0

Date 2026-11-16. Scope: the odd half-line kernel (D) of PR 56 `annulus_theta_coupling.md`,
`H_-(x,y) = H_0(x,y) - H_0(x,-y)`, `H_0(u,v) = alpha int_0^inf (2w-u-v) kappa(w-u) kappa(w-v) dw`,
`kappa(u) = Phi(u/4)`, `alpha = 1`. On odd inputs `H_c = -Delta_c`, so the target "Delta_- <= 0" is
"`H_-` is positive semidefinite on L^2(0,inf)". Nothing here proves or refutes RH.

## Verdict

**Precise obstruction.** The total-positivity route to the odd sign is closed:

1. `H_-` is **not** totally positive. Its sign-regularity order on `(0,4]^2` is exactly **4**
   (MEASURED): all contiguous minors of orders 1-4 are positive on two grids, and there is an explicit
   negative 5x5 minor. The failing minor is non-principal, so it says nothing against the odd sign.
2. Sign-regularity order is invariant under diagonal congruence and monotone change of the
   half-line variable, so no reweighting or reparametrization of the Mellin coordinate repairs it.
3. In the spectral coordinate the statement is true but empty: the Loewner kernel `L_phi` is strictly
   totally positive of all orders on `(0, gamma_1^2)^2` **iff RH** (PROVED below, short). Total
   positivity there is the same statement as positive semidefiniteness, i.e. the Pick/Loewner lane.
4. The measured orders (odd kernel, translation kernel, Hankel feature kernel) do not separate
   Davenport-Heilbronn from Euler-product L-functions: `L(s, chi_-4)` has orders <= those of DH.
   They track conductor / low-zero geometry.

Answer to "RH-equivalent, weaker or stronger": the full odd sign is RH-equivalent (PR 56
`odd-sector-followup/operator-duality.md`, re-read and accepted). `TP_inf` of `H_-` in the Mellin
coordinate would be stronger than RH and is false. `STP_4` of `H_-` (measured) is weaker than RH and
unproved.

## What is new versus the atlas and PR 56

PR 56 already has: entrywise positivity (G) from convexity of `V`; a convexity-only counterexample
`k0`; the Loewner reduction (odd sign <=> RH); positive leading Taylor blocks `J_1..J_4`; node radii
1/200 (2 nodes) and 1e-5 (<= 4 nodes). Not in PR 56 or the atlas: any non-principal minor of `H_-`,
the sign-regularity order of `H_-`, of `kappa(x-y)`, of the Gram feature `kappa(sqrt(s+x^2))`, the
DH and Dirichlet-character controls for these, and statement 3.

## 1. Facts and lemmas

**L1 (CLASSICAL).** A symmetric kernel that is TP of all orders has all principal minors >= 0, hence
is PSD. So `TP_inf(H_-)` => odd sign => RH. `TP_k` gives PSD of every Gram with <= k nodes.

**L2 (CLASSICAL, Karlin).** If `K` is TP_k then so is `a(x) K(m(x), m(y)) b(y)` for positive `a, b`
and increasing `m`. The order of `H_-` is therefore a property of the Mellin coordinate itself.

**L3 (PROVED from PR 56 certificate).** `H_-(x,y) = xy G(x^2,y^2)`; a k x k minor with nodes
tending to 0 equals `Vandermonde(X) Vandermonde(Y) (det J_k + o(1))`. PR 56 certifies
`det J_k > 0`, k <= 4, so `H_-` is strictly TP_4 in a neighbourhood of the origin, non-principal
minors included.

**T-S (PROVED; uses PR 56 Loewner theorem for <=).** Let `phi = -G'/G`, `f(t) = xi(1/2+it) = G(t^2)`,
`I = (0, gamma_1^2)`. Then RH <=> `L_phi(x,y) = (phi(x)-phi(y))/(x-y)` is strictly TP of every order
on `I x I`.
Proof. (=>) Under RH `L_phi(x,y) = sum_n mu_n / ((lambda_n - x)(lambda_n - y))`, `lambda_n = gamma_n^2 > x,y`.
Cauchy-Binet: `det[L(x_i,y_j)] = sum_{n_1<..<n_k} prod mu * det[1/(lambda_{n_b}-x_a)] det[1/(lambda_{n_b}-y_a)]`.
Each Cauchy determinant equals `prod_{a<a'} (x_a-x_a')(lambda_{n_a'}-lambda_{n_a}) / prod (lambda_{n_b}-x_a)`
and has sign `(-1)^{k(k-1)/2}` for increasing nodes; the two signs multiply to +. Infinitely many zeros
give at least one term. The series converges absolutely since `sum mu_n/lambda_n < inf`.
(<=) Principal minors >= 0 is Loewner positivity on `I`, which gives RH by the PR 56 theorem.
Consequence: in the spectral coordinate the non-principal minors carry no information beyond PSD.
The finite-order unconditional version of this is the Pick lane (`tmp/research-2026-11-16/pick/`)
and is bounded by verified height; not repeated here.

**T-PF (PROVED by ball arithmetic, `moments.py`).** With `m_j = (-1)^j kappa^{(2j)}(0)`
(positive multiples of `int t^{2j} xi(1/2+it) dt`): `m_0..m_4 > 0`, `m_5, m_6 < 0`,
`det[m_{a+b}]_{a,b<=2} = -19653.775 < 0`, and `det[kappa^{(i+j)}(0)]_{i,j<=4} = -3631834.0 < 0`.
A smooth PF_5 function needs `(-1)^{k(k-1)/2} det[kappa^{(i+j)}(u)] >= 0` for k = 5 (coalescing limit of
5x5 minors of `kappa(x-y)`). Hence **`kappa = Phi(./4)` is not a Polya frequency function of order 5.**
The cause is the sign change of `xi(1/2+it)`: its measure in `t^2` is not positive, and the third
Hankel moment determinant is the first to see it. (11 theta terms; truncation below 1e-190. No novelty
claim; I did not find it stated.)

## 2. Measurements

Method (`tp_order.py`): `H_-(x,y) = 2 int_0^inf kappa(r+x)[(m+r)kappa(r+y) - (d+r)kappa(r-y)] dr`,
`x >= y`, `m=(x+y)/2`, `d=(x-y)/2`; Gauss-Legendre panels of width 1/8; python-flint balls at
600-1200 bits for function values and determinants. By Fekete's criterion, positivity of all contiguous
minors of order <= k makes the grid matrix strictly TP_k. Quadrature error is not enclosed, so every
entry of this section is MEASURED.

Odd kernel `H_-`, grid `x_i = i h`:

| kernel | grid | contiguous minors positive through order | first failing order (count neg / total) | LDL pivots of full grid Gram |
|---|---|---|---|---|
| zeta | h=0.1, n=40 | 4 | 5 (12/1296); 6 all +; 7 (36/1156); 8 (106/1089) | 40 of 40 positive |
| zeta | h=0.05, n=80 | 4 | 5 (170/5776); 6 all + | not run |
| DH | h=0.1, n=40 | 3 | 4 (32/1369) | 40 of 40 positive |
| L(chi_-4) | h=0.1, n=40 | 3 | 4 (142/1369) | 40 of 40 positive |
| exp(-u^4/8) (positive class) | h=0.1, n=30 | 7 (all tested) | none | - |
| k0 (PR 56 control) | h=0.1, n=20 | 1 | 2 (361/361) | - |

**Minimal counterexample to total positivity of the zeta odd kernel.** Rows `x = 0.1,...,0.5`,
columns `y = 3.1,...,3.5`: `det = -3.10578223195232e-211`. Reproduced to 15 digits by a second formula
(`H_0` in the `(2w-u-v)` form), different panel width (0.1), order (120) and range (`check_minor.py`);
three quadrature settings of `tp_order.py` agree to the 8 digits printed. Leading minors of this block
of orders 1-4 are positive (`1.07e-29, 3.11e-65, 4.46e-107, 1.99e-155`). On the h = 0.1 grid all twelve negative order-5 minors have one index block starting at the first
node (`x = 0.1..0.5`) and the other starting at `y = 3.1..3.6` (positions for the h = 0.05 run were not
recorded; its first negative block starts at `x = 0.05`, `y = 2.85`). The failure is far off the
diagonal, where principal-minor (PSD) information does not reach.

Feature kernels (`feature_sr.py`, exact series, signs certified by balls up to series truncation),
grid step 0.1:

| kernel | `kappa(x-y)` TP through order | Hankel `g(s+t)`, `g(t)=kappa(sqrt t)`, reverse-regular through order |
|---|---|---|
| zeta | 4 (fails at 5, at the diagonal: T-PF) | 6 (fails at 7) |
| DH | 2 (fails at 3) | 3 (fails at 4) |
| L(chi_-4) | 2 (fails at 3) | 2 (fails at 3) |
| L(chi_-3) | 3 (fails at 4) | 4 (fails at 5) |

Order 2 of the Hankel column is convexity of `V` (the PR 56 input). It holds on the grid for DH and
both characters, so the entrywise theorem (G) and the odd-cone inequality (H) of PR 56 also hold
for DH (MEASURED on the grid; not certified for all `t`).

## 3. Davenport-Heilbronn control

DH kernel used: `kappa_DH(u) = e^{3|u|/4} sum_n n c(n) exp(-pi n^2 e^{|u|}/5)`,
`c = (0,1,tau,-tau,-1)` mod 5 (evenness checked to 1e-239). It is positive and has convex `V` on the grid.

- The full odd sign is **false** for DH: the Loewner direction "odd PSD => all zeros of `G` real" of
  PR 56 uses analyticity only, and DH has off-line zeros (CLASSICAL). Positivity of `kappa` is used only
  to exclude real-axis zeros and is not needed for this direction.
- Every finite test run here passes for DH: positive entries, strict TP_3, and a positive-definite
  40-node odd Gram (smallest LDL pivot 5.9e-48). So finite-node principal tests in the Mellin
  coordinate at this resolution are Euler-blind, the same pattern as the Pick-order-100 result in
  `tmp/research-2026-11-16/euler/`.
- No step of the sign-regularity analysis uses `Lambda(n) >= 0`, multiplicativity or Hecke structure.
  The Euler-product function `L(s,chi_-4)` scores the same as DH or lower in every column. The orders
  are not an arithmetic detector.
- T-S fails for DH at some finite order (some principal Loewner minor is negative); the order is not
  determined here.

Walls: strict TP_4 on a compact grid is an open condition, hence stable under small backward heat
flow (`kappa_tau = e^{tau u^2/16} kappa` keeps convexity), consistent with flow-blindness: it cannot
imply RH. T-S is the Weil/Pick target of `eq48/` in another coordinate.

## 4. Pivot (once)

After the Mellin-coordinate route failed at order 5, the adjacent idea was the spectral coordinate.
Result: T-S above. It is an equivalence, not a lever.

## 5. Three weakest steps

1. Gauss-Legendre quadrature error for `H_-` is not interval-enclosed. The negative 5x5 minor rests on
   agreement of two formulas and four quadrature settings to 8-15 digits, not on a certified bound.
2. "Order exactly 4" is a grid statement on `(0,4]^2` (h = 0.1 and 0.05) plus L3 at the origin.
   A failure of order <= 4 between grid nodes or for `y > 4` is not excluded.
3. T-S (<=) and the DH falsity statement rely on the PR 56 Loewner theorem (Agler-McCarthy-Young
   Thm 1.5), which I read but did not re-derive; the infinite Cauchy-Binet step in (=>) uses
   absolute convergence without a written tail estimate.

## Files

- `tp_order.py`, `tp_*.json`, `entries_*.json`, `run_zeta_h005.log` - odd-kernel minors and LDL.
- `check_minor.py` - independent evaluation of the negative minor.
- `feature_sr.py`, `feature_sr.log` - translation and Hankel feature kernels, four L-functions.
- `moments.py` - T-PF.
- Environment: `/tmp/g-odd-tp-venv` (python-flint 0.9.0), local single process, each run < 4 min.
