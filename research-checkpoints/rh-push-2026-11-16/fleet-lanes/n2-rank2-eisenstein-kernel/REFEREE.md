# REFEREE: n2-rank2-eisenstein-kernel

Adversarial referee (general), 2026-11-17. No ssh. Every run through `scripts/memcap.sh 8`, single process, longest run 5.6 min.
Referee code is independent of `r2lib.py` (own kernel implementation, root-system form) and lives outside the repo in `/tmp/n2ref/` (ref1..ref5b.py); it is not part of the record.

**Outcome: holds, with corrections.** Theorem A and Theorem B are confirmed (algebra re-derived by hand, then checked with independent code). The corner measurements reproduce on new cases. The verdict "precise obstruction" stands, but its load-bearing step is MEASURED, and three statements in RESULT.md are wrong or overstated (items E1-E5). Nothing assumes RH, nothing restates verified height.

## 1. PROVED steps re-derived

**Lemma 1.** Checked: `c~ = Xi(z)/Xi(z+1)`; cancellation of the exponential factor (`B = -sum Re 1/rho`); re-indexing of denominators by `rho -> 1 - conj rho` (valid: the two partial products over a window symmetric in `Im` have the same denominator set); `c~(0) = B(0) = 1`; `theta(1) = 1/(2 xi(2)) = 3/pi = 0.9549`; residue `6/pi`. Correct. CLASSICAL in substance.

**Theorem A.** Re-derived by hand:
- (3.1): `(z-1)(w~-1) K1_0 = (z w~ + 1) k + (z w~ - 1) h - (1 - theta(z))(1 - conj theta(w))`. Correct.
- (3.2): `(z + w~) k + (z - w~) h = (1 - theta(z))(1 + conj theta(w))`. Correct.
- `U = C J` with `C f = theta conj f`, `J f = conj f(conj .)`; they commute because `theta` is real; `U k_w = h_w` uses `theta(z) theta(-z) = 1`. Correct. `A = k + h`, `B = k - h` are twice the kernels of the `U`-even/odd subspaces; `z w~ A` is positive; `G(.,1) = (1 + theta(1)) v`; `||v||^2 = (1 - theta(1))/(1 + theta(1))`. Correct.
- `d/dt K1_t = f_z conj f_w`. Correct. Green form in (iii). Correct.
- Numerics (ref1.py, 200 digits, 16 nodes incl. two near `z = 1`): five Blaschke sets; `theta(1) > 0` gives 0 negative eigenvalues, `theta(1) < 0` gives exactly 1, at `t = 0, 0.5, 3`.

**Theorem B.** Re-derived: the derivative cancels `L1 - L2`; `M(s v, lambda) = c(z_v) M(v, lambda)` for the three minimal representatives needs only the product-over-inversions definition (no functional equation); the four `(s, s')` terms give (2.2) with `t = alpha_2(T)/2`. The right side of (3.3) is a positive kernel because it is the Gram kernel of `sum_v a_v(lambda) phi_{z_v(lambda)}`. Segment argument inside the convex chamber is correct. Independent finite-difference check (ref1.py, different `c` (quadruple + unpartnered pair), `T = 0.7 varpi_1 + 0.4 varpi_2`, both coroots): relative error 8e-81.

## 2. Errors and overstatements

**E1 (gap in Theorem A, repairable; repaired here).** "The same holds for every t >= 0" is proved in RESULT.md only in the direction `theta(1) >= 0 => K1_t >= 0`. The converse for `t > 0` is not argued. It is true: as `z, w -> 1`, `(z-1)(w~-1) K1_t(z,w) -> 2 theta(1) (1 - theta(1) e^{-2t})`, negative for `theta(1) < 0` at every `t`. Confirmed numerically (one negative eigenvalue at `t = 0.5` and `t = 3`).
Consequence for section 5.1 / 6.3: the same limit at a pole `p` with residue `r` gives the diagonal value `r - r^2 e^{-2pt}/(2p)`, negative for every `t` when `r < 0`. So `E_a` (residue -7.43 at 0.8) fails at every `T`, and "passes at `T = (0.3, 0.3)` on the sampled nodes" is a sampling artifact (no node near the pole), not a threshold in `T`.

**E2 (corollary overstated).** "Rank-2 positivity on the chamber is equivalent to: rank-1 positivity, and `K2_0 >= 0`." Only `<=` is proved. That `K2_T >= 0` on the chamber forces rank-1 positivity is not shown. Also "all rank-2 content sits in the corner" means: the corner is the strongest test given rank 1; `K2_T >= 0` for a fixed `T != 0` can hold when `K2_0` fails (their own 5.3 note about `T = (0.1, 0, -0.1)` is outside the chamber and does not address this).

**E3 (interpretation contradicts the table).** Verdict item 4 and section 7 say the corner "tests `c = xi(z)/xi(z+1)` with `xi(s) = xi(1-s)`, even sign". The measured rule in 5.2 is one-sided: unpartnered zeros of `theta` with `Re rho > 1/2` pass (their rows x = 0.55, 1.0, 2.5; referee: pair `0.8 +- 6i` added to a quadruple, pair `3 +- i`, real zeros `0.6, 0.9`, all PSD). Such `theta` are not `Xi(z)/Xi(z+1)` for any finite symmetric `Xi`. Also `c(z) c(-z) = 1` holds for every real inner `theta`, failing fakes included, so "functional-equation-level" cannot mean that identity. The accurate statement is: MEASURED, `K2_0 >= 0` iff every zero of `theta` with `Re rho < 1/2` has its partner `1 - conj rho` and `theta(0) = +1`; the coboundary explanation covers only the fully symmetric case; the one-sided half has no explanation. For objects whose zero sets are closed under `rho -> 1 - conj rho` (zeta, Dirichlet L, DH) every zero is partnered, so the obstruction is unaffected.

**E4 (backward heat: prediction not confirmed).** RESULT 6.5 did not run it and predicted "passes while zeros stay in the strip". Referee run (ref3/ref5/ref5b.py; `Xi_tau(s) = int e^{tau u^2} Phi(u) cosh((2s-1)u) du`, `c = Xi_tau(z)(z+1)/(Xi_tau(z+1)(z-1))`, `tau = -10`): `c(z)c(-z) = 1` to 2e-47; argument-principle count in `0 < Re x < 80` gives 3 zeros in `|Im x| < 1` and 3 in `|Im x| < 3`, with 3 real sign changes, so no off-line zero below height 40 (zeros moved outward: 6 real zeros at `tau = 0`, 3 at `tau = -10`); `max |c~| = 0.997` at 20 nodes; rank-1 Gram (20 nodes, heights 3-30) minimum eigenvalue **-6.82e-7**, identical at 25 and 45 digits and two quadrature grids; corner `K2_0` on 10 nodes: minimum 1.92e-5 (positive). By Theorem A a negative rank-1 eigenvalue with `theta(1) > 0` means `theta_tau` is not inner, i.e. zeros outside the closed strip at some height. So at `tau = -10` backward heat is rejected at rank 1 (Lemma 1 level), not passed. One node set only; zeros outside the strip were not located. This does not change the verdict (the Blaschke fakes remain the decisive control), but the backward-heat row should read "fails rank 1 at tau = -10 (measured); corner uninformative", not "expected pass".

**E5 (wording: Euler product).** "Nothing in ranks 1-2 uses an Euler product" should read "nothing beyond `zeta != 0` on `Re s > 1`". Lemma 1 uses exactly that, it is where DH fails, and it is an Euler-product fact. The content beyond Lemma 1 is not Euler-sensitive (measured).

**E6 (novelty).** Theorem B is the `T`-derivative of Langlands' formula; that the derivative along a coroot is the truncated inner product of constant terms along the opposite maximal parabolic is standard (Langlands' combinatorial lemma / Arthur's (G,M)-families). It should be labelled CLASSICAL in substance with an explicit check, not as a new theorem. Theorem A is an elementary model-space computation; RESULT.md does not claim priority and no literature search was done by either side (citations in 2.1 remain "from memory", validity of (2.1) at `T = 0` remains ASSUMED as stated).

## 3. Numerics rerun with different cases (ref2.py, own code, 40 nodes `Re in (0.05, 4)`, `|Im| in (0.05, 25)`, 200 digits, tolerance 1e-120, floor 1e-189..1e-197)

| zero set of theta over c0 | inertia (+, 0, -) | rule |
|---|---|---|
| quad(0.2, 2) (reproduction) | (6, 34, 0) | agrees |
| quad(0.499, 0.01) | (6, 34, 0) | agrees |
| quad(0.31, 7.3) with multiplicity 2 | (28, 12, 0) | agrees |
| quad(0.45, 40) + quad(0.1, 41) | (28, 12, 0) | agrees |
| pair 0.45 +- 3i | (1, 37, 2) | agrees |
| pair 0.55 +- 3i | (3, 37, 0) | agrees |
| quad(0.3, 2) + unpartnered pair 0.8 +- 6i | (17, 23, 0) | agrees (see E3) |
| pair 3 +- i | (3, 37, 0) | agrees |
| real 0.5, 0.2, 0.8 (odd count) | (6, 33, 1) | agrees |
| real 0.5, 0.5, 0.7 (odd count) | (7, 32, 1) | agrees |
| real 0.7 | (2, 37, 1) | agrees |
| real 0.6, 0.9 | (3, 37, 0) | agrees |
| real 0.3, 0.4 | (1, 37, 2) | agrees |
| d = 12: quad(0.24,16.94) + quad(0.45,12.95) + quad(0.3,18.86), 80 nodes, 260 digits | (66, 14, 0), floor 1e-259 | resolves the case RESULT.md left open; rank C(12,2) = 66, PSD |

No counterexample to the measured rule was found. Rank for symmetric sets is `C(d,2)` also with multiplicity.

## 4. Controls run by the referee

- **Davenport-Heilbronn (ref4.py, 40 digits).** `c_DH(z) c_DH(-z) = 1` to 3e-41. Off-line zero located: `0.808517182457 + 85.6993484854 i`. Three node sets placed at that height (`z1` there; `z1, z2` there; `z1 + z2` there), 12 rank-2 nodes / 24 rank-1 nodes each: corner `K2_0` minimum eigenvalue 4.4e-5, 2.3e-3, 9.8e-3 (all positive); rank-1 minimum at the noise floor (-3e-41 .. -5e-41 at 40 digits, a rank-deficient Gram matrix, no resolved negative). DH is not detected by the corner at the height of its off-line quadruple. Its Lemma 1 failure (zeros with `Re > 1`) was not located by either side.
- **Backward heat.** See E4.
- **Sign twist.** Not rerun; RESULT 6.4 is consistent with Theorem B's proof (the minimal-representative identity does not need `c(z)c(-z) = 1`; the Gram interpretation does).

## 5. What survives

1. Theorem A, strengthened: for `c = theta (z+1)/(z-1)`, `theta` real inner, `K1_t >= 0` iff `theta(1) >= 0`, for each `t >= 0`. PROVED.
2. Theorem B identity (3.3) and `K2_T >= K2_{T'}` for `T - T'` in the coroot cone, both in the closed chamber, given rank-1 positivity. PROVED; classical in substance.
3. MEASURED (exact inertia for d <= 12 over the pole model, two independent implementations; sampled over zeta by the author only; DH sampled at its off-line zero by the referee): the corner kernel is PSD whenever the zero set is closed under `rho -> 1 - conj rho` with `theta(0) = 1`; it is negative when a zero with `Re < 1/2` is unpartnered or `theta(0) = -1`; unpartnered zeros with `Re > 1/2` pass.
4. Obstruction: no dependence on the distance of a symmetric quadruple from the line was found, so rank-2 Maass-Selberg positivity does not separate zeta from symmetric fakes. This is measured, not proved: "symmetric implies `K2_0 >= 0`" is OPEN (weakest step 1 of RESULT.md stands), and (2.1) at `T = 0` is assumed.

Not checked by the referee: the zeta rows of 5.3 (22 nodes), `t6` residues, the sources for (2.1).
