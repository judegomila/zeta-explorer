# b-codex-energy-lanes: Codex PRs 39, 41-46, 49 — proved statements, three independent checks, and the strongest combination with the 7/8 half-plane

Date: 2026-11-16. Scope: read-only audit of `refs/pr/{39,41,42,43,44,45,46,49}` (fetched with
`git fetch origin pull/N/head:refs/pr/N`; nothing pushed, no PR touched). Nothing here proves or
refutes RH. Labels: PROVED (argument written here or re-derived by hand from the PR),
CLASSICAL, CERTIFIED (interval arithmetic in the PR, not re-run as intervals here), MEASURED
(floating/multiprecision numerics, no enclosure), CONDITIONAL (on the openai/math 7/8 theorem,
Lean-checked locally, not refereed), OPEN.

## Verdict

**Precise obstruction, with three small proved by-products and one new measurement.**

1. PR 44's separated-tail bound and PR 45's all-order identities are both correct (re-derived
   and checked numerically to 1e-21 or better). Neither uses the Euler product, and neither
   contains zero-location information: an explicit kernel `kappa_sharp = P(d/du) kappa`, whose
   transform `P(z/2) xi(1/2+z)` has off-line zeros placed anywhere, satisfies the separated-tail
   theorem (same limit kernel `sech((U-V)/2)`, same `ell_delta`) and every all-order identity
   (Proposition Z, PROVED). The Davenport-Heilbronn (DH) kernel does too.
2. Therefore the triple {separated tail, all-order identities, zero-free Re s > 7/8} has a
   common counter-model with zeros anywhere in 1/2 < Re s <= 7/8. **No statement about zeros
   beyond the 7/8 input follows from the combination.**
3. What the combination does give (Theorem C, CONDITIONAL, elementary): the all-order positivity
   that is RH-strength at a fixed cutoff becomes a theorem after exponential averaging in the
   cutoff with any weight exponent x >= 3/8 (the PRs use 1/2); every right-half-plane pole of the
   PR 43-46 bridge multiplier lies in a disc `|p - i gamma| < beta <= 3/8` around the ordinate of
   an off-line zero. Both are restatements of the 7/8 input in the PR language (atlas section 2,
   `a >= Delta`, with `Delta <= 3/8`).
4. PR 44's certified leakage bound `< 0.124030166` is vacuous as a pole (zero) exclusion: the
   largest value the PR's own single-pole lower bound can take at any pole not already excluded
   by the verified height is `< 7.1e-25` (PROVED, section 4.3).
5. New measurement: the PR 45 derivative-jet hierarchy at the origin is PSD for the DH kernel
   through order 200 (off-line DH zero at height 85.70), while it turns negative at order
   about `pi*gamma/4 + 2N(gamma)` for a zero quadruple inserted at `0.3 + i gamma`, gamma = 12..50
   (`N(gamma)` = number of on-line zeros below gamma; section 5). Jet orders up to 200 do not
   separate DH from zeta, as finite Pick orders do not (euler/RESULT.md).

## 0. Plan: what is new relative to the atlas and the walls

- Atlas section 2 (shifted bridge `|X(w-a)| < |X(w+a)|` iff `a >= Delta`) and section 11 already
  record that kernel positivity for every shift is RH restated. PRs 43-46 work with the
  derivative form (`F +- alpha F'` in place of `F(z +- a)`); eq48/RESULT.md showed the later
  residual target (PR 47-50) is Weil positivity on one-sided tests. Not re-run here.
- New here: (i) an independent check of three PR 44/45 statements; (ii) the explicit zero-blind
  counter-model for the separated-tail theorem; (iii) the quantified vacuity of the leakage
  bound; (iv) the 7/8 port of the weighted energy statements; (v) the jet-order detection scan
  with a DH control.
- Walls respected. DH: section 5 says which statements hold for DH (all PR 44/45 positives
  tested) and that the only Euler-product step in the combination is the imported 7/8 theorem.
  Flow-blindness / MV-CAP / verified height: the obstruction in section 4 is of the every-window
  and verified-height type; nothing here claims to pass it.

Normalisation (PR 43-46): `F(z) = xi(1/2+z) = int kappa(u) e^{zu/2} du`,
`kappa(u) = sum_{n>=1} (2 t^2 - 3 t) e^{u/4} e^{-t}`, `t = pi n^2 e^u` (even, positive, Schwartz);
`h_pm = (1 pm alpha u/2) kappa`, `A = h_+ *`, `A^* = h_- *`, `D = F + alpha F'`, `N = F - alpha F'`,
`S = N/D`, `C_0` = Fourier multiplier `S(it)` (unitary), `Q_c = 1_(c,inf)`,
`H_c(u,v) = alpha int_c^inf (2r-u-v) kappa(r-u) kappa(r-v) dr`,
`||Q_c A^* a||^2 - ||Q_c A a||^2 = -<a, H_c a>`.
For each fixed alpha > 0: `H_0` PSD iff `S` is a Schur function on Re z > 0 iff RH (PR 43 section 4 and
PR 46: at an off-line zero the continued `S` takes the interior value -1).

## 1. Table of proved statements (PRs 39, 41-46, 49)

"Zero info" = what the statement says about zeros of zeta beyond what was known before it.
"Check" = what was done here.

| # | PR, file | Statement | Grade in PR | Check here | Zero info |
|---|---|---|---|---|---|
| 1 | 43 `theta_boundary_energy.md` (2.1)-(2.4) | Cutoff identity above; `H_c(u,v) = 2 alpha int_{|c-m|}^inf t kappa(t-d) kappa(t+d) dt > 0` entrywise (`m=(u+v)/2`, `d=(u-v)/2`) | PROVED | re-derived (kernel difference `h_-h_- - h_+h_+ = -alpha(2r-u-v) kappa kappa`) | none (holds for any even positive Schwartz kernel) |
| 2 | 43 (3.2),(3.5) | Every 2x2 principal matrix of `H_c` is PD; `||Q_c g|| <= ||Q_c f||` for two-feature inputs | PROVED from Csordas Thm 4.2(b) (`log kappa(sqrt t)` concave) | read; the concavity integrand `(-b') kappa'^2 >= 0` checked on a grid (section 3.2) | none; same inequality holds numerically for DH |
| 3 | 43 (4.9) | `tr H_c = 4 alpha int_0^inf t^2 kappa^2 dt > 0`, `H_c` trace class | PROVED | read | none |
| 4 | 43 (5.1) | `x int e^{xc} H_c(u,v) dc = 2 alpha e^{x(u+v)/2} M_x((u-v)/2)`, `M_x(b) = int a e^{xa} kappa(a+b) kappa(a-b) da` | PROVED | re-derived; Fourier transform of `M_x` is `Re(F' conj F)(x + i omega)` (section 4.2) | this is where 7/8 enters (Theorem C) |
| 5 | 44 `theta_pulse_leakage_bound` | `0 <= ||1_(1,inf) C_0 1_[0,1]||^2 < 0.124030166` (alpha = 1) | CERTIFIED | MEASURED: direct Fourier inversion to T = 300 gives energy beyond u = 1.1 of 1.1e-9 for the Gaussian-smoothed box (section 3.3) | none: vacuous as pole exclusion by a factor > 1e23 (section 4.3) |
| 6 | 44 `theta_pulse_hardy_defect` (2.1)-(2.3) | Tikhonov preimages of the box: `||a_eps||_1, ||a_eps||_2 -> inf`, `int a_eps -> 1/F(0)`; positive and negative masses diverge | PROVED | read | none (inverse smoothing; independent of zeros) |
| 7 | 44 (3.1) | `S = B_+/B_-`, coprime Blaschke products, no exponential factor; poles of `S` in `0 < Re p < 1/2` | PROVED | read; pole strip improved to a disc statement in Theorem C(a) | restates critical strip |
| 8 | 44 (4.2),(5.1),(5.3) | leakage `= ||P_{K_{B_-}}(B_+ V~)||^2 >= v^* G^{-1} v >= sigma |B_+(p) V~(p)|^2` for poles `p` | PROVED | re-derived the one-pole case | diagnostic only (needs `B_+`) |
| 9 | 44 (6.1) | `H_0(u,v) > H_0(u,-v) > 0` for `u,v > 0` | PROVED from concavity | read | none |
| 10 | 44 `theta_separated_tail.md` | **Separated-tail theorem**: if `E_{R,delta} < ell_delta` then for all N, all `U_j >= R` with gaps `>= delta`: `sum conj(a_i) a_j H(U_i,U_j) >= (ell_delta - E_{R,delta}) sum |a_i|^2 H(U_i,U_i)` | PROVED + CERTIFIED constants | **CHECK 1**: every step re-derived; (2.1), (3.2), (4.1), table and direct Gram matrices verified numerically | **none** (Proposition Z) |
| 11 | 44 `theta_flux_analytic_localization` Thm 2, Cor 3 | PSD of `H_alpha` on any open interval, or of all jets at one point, is equivalent to global PSD (hence RH) | PROVED | read (Hilbert-valued holomorphy on `|Im z| < pi/2`) | equivalence only |
| 12 | 44 (9),(10) | `J_2(0) = alpha [[2I_0, 0, -2I_1],[0, 2I_1-k_0^2, 0],[-2I_1, 0, 2I_2]]` is PD | CERTIFIED | **CHECK 2**: all six enclosures reproduced (section 3.2) | none; DH jet of the same order is also PD |
| 13 | 45 `theta_all_order_jet_structure` (2.1),(3.1),(3.2),(3.4),(3.5),(4.2) | **All-order structure**: `(d_u + d_v) H = -alpha (u+v) kappa(u) kappa(v)`; `J_{m+1,n} + J_{m,n+1} = -alpha[m k_{m-1} k_n + n k_m k_{n-1}]`; `O_pq = E_{p,q+1} - (2q+1) a_p a_q`; `E_pq = 2 I_{p+q} + sum |p+q-1-2j| a_j a_{p+q-1-j}` | PROVED | **CHECK 2**: (3.1) re-derived; (3.2), (3.4), (4.2) verified to 3e-26 (zeta), 2e-21 (kappa_sharp), 4e-16 (DH) for all orders <= 14 | none (identities for any even Schwartz kernel) |
| 14 | 45 (7.1) | No constant C with `|sum c_p a_p|^2 <= C sum conj(c_p) E_pq c_q` | PROVED | read; the tail bound (7.4) it uses is the envelope checked in CHECK 1 | none |
| 15 | 45 `theta_jet_commutator` (6),(10),(11b) | `Q(P) = alpha b(0)|f(0)|^2 + alpha int b'|f|^2 - 2 alpha Re int conj(f)[P(D),b] kappa'`; `J_11 = alpha ||sqrt(-b') kappa'||^2 > 0`; energy contraction for the pulse `h_+'` | PROVED (uses Csordas) | **CHECK 2**: `J_11 = int (-b') kappa'^2` re-derived (`(-b') kappa'^2 = kappa kappa' + u kappa'^2 - u kappa kappa''`) and verified to 1.5e-45 | none; holds numerically for DH |
| 16 | 45 (15),(19) | Auxiliary kernel `e^{-u^2}(3/2 + cosh u)`: both concavity properties hold, `Q(D + D^3/5) < 0` | CERTIFIED | read | shows concavity is not enough |
| 17 | 45 Gaussian obstruction | Exactly one zero of `F + F'` in `|z - (-0.74626947 + 14.61606607 i)| < 0.001`; `D(-1) > 0.48526023`; no nonnegative preimage of a Gaussian | CERTIFIED | MEASURED: root at `-0.746269471848 + 14.6160660701 i` (distance 1.9e-9 from the centre), `D(-1) = 0.485260260122` | none (left half-plane zero of `F + F'`) |
| 18 | 46 `theta_modular_system` | `U' = -beta V`, `V' = -gamma U`, `U(0)V(0) = int_0^inf (gamma U^2 + beta V^2) du > 0` | PROVED | read | none (Weyl response of this system is not the xi response) |
| 19 | 46 endpoint / operator / contour notes | Modular canonical lift has the wrong Weyl coefficient; exact realisation needs a rank-one endpoint; `T_0` closable iff RH; weighted-energy threshold of the Gaussian response `= inf Re(poles)`; outer-line solution has all weights with exponent >= 1/2 | PROVED | read; exponent 1/2 becomes 3/8 under 7/8 (Theorem C(c)) | restatements |
| 20 | 42 `sign_switching_energy` | `P_a` PSD for `a >= 1/2`; inward shear `= E_+ - E_-` (exact reconstruction from the boundary kernel) | CLASSICAL + PROVED identity | read | restates critical strip |
| 21 | 49 `analytic_continuation`, `verify_freezing_obstruction.py` | Leading model `M(p,q) = (p+q)/(e^p+e^q)` has an exact 3-point negative packet above p = 1 and negative Taylor directions in every interval; `K_tau` PSD on an interval iff `tau >= Lambda` (Neeb-Olafsson) | PROVED / exact rational | read; consistent with CHECK 1 (the leading model is not PSD; the sech limit applies only at fixed spacing) | equivalence only |
| 22 | 49 `collective_certificate` | `U' <= -2 - 2U/(x^2+U)` (Polymath Prop. 3.3); `U' <= -2 - 4 y A(z)` with contour-measured clusters; conditional slab bound for Lambda | PROVED interface, hypotheses not certified | read | none yet (no certified input) |
| 23 | 41 `REPORT.md`, `verify_reserve.py` | `Psi(t) > 0` for `0 < t <= log 10^6` (Suzuki scalar; reserve >= 0.0275); `W_1(t) > 0.0431381`; `D_h(w_0 - h) = -|F(w_0 - 2h)|^2 < 0` at an off-line zero; Cauchy-Fisher lower bound for `Re F'/F` | CERTIFIED finite / PROVED | read | finite scalar positivity (verified-height class) |
| 24 | 41 `MOBIUS_INTERVAL.md` | Centered Vaughan/Mobius identity with exact tail correction; 22 certified sign reversals if the tail is dropped | CERTIFIED finite | read | none |
| 25 | 39 `energy/GLOBAL_BOUND.md` (1)-(5) | `lim_{r->0} G_r(u) = (pi/8) sum_{beta>1/2} m_rho/(1+(gamma-u)^2)`; tail bound `4 pi log(16H)/(H log 2)`; `r^4 G_r(0) < 2e-10 r^4`; `G(u) <= (3 pi/32) R_L(u)` | PROVED (uses Platt-Trudgian for (4)) | read; the pair-sign fact used there is Lemma D below | (4) is verified height; (1) is an RH-equivalent |
| 26 | 39 `energy/SMALL_VALUE_ENERGY.md` (2),(3) | `E_eta(D) = (pi/2) M_D log(1/eta) + O(1)`; `V_D(r) = (pi/8) M_D r^4 + O(r^{4+a})` | PROVED (local factorisation) | read | equivalence only |
| 27 | 39 `energy/MOVING_WINDOW.md` (1)-(5) | Guinand-Weil with `sech(pi v/2)`; pair contribution `>= 2 sech(pi/8)` on the half-unit grid; tail `<= 300 e^{-aH}(log(6+|u|+H)+1)`; `sum_{|gamma-u|<9} k >= A(u) - 0.0063` for `1e11 <= |u| <= 1e12` | PROVED (uses Platt-Trudgian) | read | verified height |
| 28 | 39 README, `cluster/THETA_*` | Phase-independent capacity bound `|x R_{10^6}(x,t)| < 1/3` at `x = 3/1000`, `t >= 14`; `-(B_0/J)' > 0` for all positive kernel coordinates; first-pair ratio signs for `0 < a <= 64`, `t >= 4` and for small and large anchors | PROVED + CERTIFIED cells | read | none (finite-stage Pick/ratio signs; all-order preservation open) |

Summary of the column "zero info": every proved inequality in these eight PRs is one of
(a) an identity or inequality valid for a class of kernels that contains kernels with off-line
zeros (rows 1-4, 6, 9, 10, 12-16, 18), (b) a restatement of the critical strip or of the verified
height (rows 7, 19, 20, 23, 25, 27), or (c) an RH-equivalence (rows 11, 21, 26). None is an
unconditional statement about zeros that was not known.

## 2. Proof audit of the two statements in the task

### 2.1 Separated-tail theorem (PR 44) — PROVED

Hand re-derivation of every step of `theta_separated_tail.md`:

- (2.1) `1 - 3e^{-t}/(2 pi) <= L(t) <= 1`, `kappa = 2 pi^2 e^{9t/4 - pi e^t} L`:
  `L = sum_n [n^4 - 3n^2/(2 pi q)] e^{-pi(n^2-1)q}`, `q = e^t >= 1`; lower bound = first term;
  upper bound needs `sum_{n>=2} n^4 e^{-pi(n^2-1)q} <= 3/(2 pi q)`, which follows from
  `(2+j)^4 <= 16 e^{2j}`, `n^2 - 1 >= 3 + 4j`. Correct.
- (3.1): with `q = Lambda(e^s - 1)`, `Lambda = pi(e^U + e^V)`:
  `kappa(U+s) kappa(V+s)/(kappa(U) kappa(V)) = e^{9s/2} e^{-q} x (L ratio)` and
  `ds = dq/(Lambda(1+q/Lambda))`, giving the exponent 7/2. Upper bound via
  `(1+q/Lambda)^{7/2} <= e^{7q/(2 Lambda)}` and `log(1+x) <= x`. Correct.
- (3.2): `C = (U+V)/(2 sqrt(UV)) sech((U-V)/2) J(U,V)/sqrt(J(U,U) J(V,V))`;
  `(U+V)/(2 sqrt(UV)) = sqrt(1 + d^2/(4UV)) <= 1 + d^2/(8R^2)`; the J ratio lies in
  `[1/(1+eta_R), 1+eta_R]`. Correct.
- (4.1): `sech(x/2) = int sech(pi t) e^{ixt} dt`; `sech(pi t) >= sech(pi T) (1-|t|/T)_+`;
  Fejer kernel off-diagonal `<= 4/(T d^2)`; row sum `<= 4 pi^2/(3 T delta^2)`; `T = 4/delta` gives
  `ell_delta = (4 - pi^2/3)/delta x sech(4 pi/delta)`. Correct.
- Section 5 row sums: `sech(d/2) <= 2 e^{-d/2}`, `d^2 sech(d/2) <= (128/e^2) e^{-d/4}`. Correct;
  they give exactly `E_{R,delta}`.

No gap found. The theorem is a statement about the first theta term: the limit kernel
`sech((U-V)/2) = 2 e^{(U+V)/2}/(e^U + e^V)` is the normalised Gram kernel of the functions
`s -> e^{-pi e^{U+s}}`, and the only property of kappa used is
`kappa(t) = C e^{at - pi e^t}(1 + O(e^{-t}))`.

### 2.2 All-order structure (PR 45) — PROVED

- (3.1): differentiate `H = alpha int_0^inf (2r+u+v) kappa(r+u) kappa(r+v) dr` along the diagonal:
  `(d_u + d_v)[...] = 2 kappa kappa + (2r+u+v) d_r[kappa kappa]`, and integration by parts leaves the
  boundary term `-alpha(u+v) kappa(u) kappa(v)`. Correct.
- (3.2) is `d_u^m d_v^n` of (3.1) at 0. (3.4), (3.5), (4.2) follow by parity and iteration.
- `J_11`: with `b = -u kappa/kappa'`, `(-b') kappa'^2 = kappa kappa' + u kappa'^2 - u kappa kappa''`, whose
  integral is `-k_0^2/2 + I_1 + (I_1 - k_0^2/2) = 2 I_1 - k_0^2 = J_11/alpha`. Correct; positivity
  is exactly Csordas' concavity `b' <= 0`.

These identities use evenness and decay of kappa only.

## 3. Three independent checks (scripts in `work/`, outputs `check1.out`, `check2.out`, `check3.out`)

Own implementation of kappa, its derivatives (`p_{j+1} = t p_j' + (1/4 - t) p_j`), the DH kernel and
`kappa_sharp`; nothing imported from the PR scripts. Sanity: `int kappa e^{zu/2} = xi(1/2+z)` to 15
digits at `z = 0.2` and `0.1+5i`; `F_sharp(rho) = 3e-32`; DH kernel even and its transform vanishes
at the known off-line DH zero (`s = 0.808517182457 + 85.6993484854 i`).

### 3.1 CHECK 1 — separated tail (PR 44 row 10). PASS

| Item | Result |
|---|---|
| (2.1) on t in [0,8], step 0.02 | `L - (1 - 3e^{-t}/2pi) >= -1e-37` (working precision), `L - 1 <= -1.6e-4` |
| (3.2), 60 random pairs, R in {1, 1.5, 2, 3, 5}, H by direct quadrature | max lhs/rhs = 0.395 (bound holds) |
| (4.1), lambda_min of 14-point sech Gram vs `ell_delta` | delta 0.5/1/2/4/8: holds (e.g. delta = 8: 0.9296 vs 0.0354) |
| Table margins | 1.1958e-11, 1.14103e-6, 6.58547e-4, 9.01423e-3, 2.47144e-2: match the PR |
| Direct normalised Gram of H, 8 points, zeta | delta=8,R=8: lambda_min 0.95517 (sech: 0.95548); delta=4,R=20: 0.64717 (0.64780); delta=2,R=6: 0.16420 (0.16560); delta=1,R=6: 0.0075597 (0.0076594) |

The last two rows are outside the certified range of the theorem (margin negative) and are still
positive; the theorem's `R(delta)` is conservative, as the PR says.

### 3.2 CHECK 2 — all-order identities and the order-two jet (PR 45 row 13, PR 44 row 12, PR 45 row 15). PASS

Jets computed from `J_mn = int_0^inf [2u k^(m) k^(n) + m k^(m-1) k^(n) + n k^(m) k^(n-1)] du`
(alpha = 1) by double-exponential quadrature at two step sizes (agreement 7e-25).

| Quantity | Here | PR 44 enclosure |
|---|---|---|
| `2 I_0 = J_00` | 0.040242710071759 | [0.04024267831, 0.04024274183] |
| `2 I_1 - k_0^2 = J_11` | 0.010882302182086 | [0.01088075336, 0.01088385100] |
| `-2 I_1 = J_02` | -0.21042042306902 | [-0.21042197189, -0.21041887425] |
| `2 I_2 = J_22` | 1.1233540359652 | [1.12324289095, 1.12346518102] |
| even-block determinant | 0.000930056332743 | [0.00092489608, 0.00093521659] |
| det `J_2(0)` | 1.01211540593e-5 | [1.006356616e-5, 1.017875801e-5] |

Identities, maximal relative deviation over all orders <= 14: (3.2) 3.3e-26, (3.4) 1.7e-26,
(4.2) 2.2e-26; `J_11 - int(-b') kappa'^2`: 1.5e-45 relative; odd-total-order entries: 1.6e-25.
`(-b') kappa'^2 >= 0` at all 159 grid points u in (0, 4).

### 3.3 CHECK 3 — leakage bound and the denominator zero (PR 44 row 5, PR 45 row 17). CONSISTENT (MEASURED)

`S(it) = (Xi + i alpha Xi')/(Xi - i alpha Xi')` from `siegelz` and its derivative on `0 < t < 300`
(step 0.02), box transform tapered by `exp(-t^2/(2*60^2))` (a Gaussian smoothing of the box of
u-width 0.033). Energy of the response beyond u = 1.1: 1.09e-9 (the smoothed input itself has
1.4e-8 there); beyond u = 1.2: 1.1e-17. This is the value RH below height 300 predicts (zero up
to smoothing) and is consistent with `0 <= leakage < 0.124030166`. It is not an enclosure.
Root of `F + F'`: `-0.746269471848 + 14.6160660701 i`; `D(-1) = 0.485260260122`.

## 4. The combination with the 7/8 half-plane

### 4.1 Proposition Z (zero-blindness of PR 44 + PR 45) — PROVED

Let `P(w) = sum_{j<=k} c_{2j} w^{2j}` be a real even polynomial with `c_{2k} > 0`, `c_0 != 0`, and put
`kappa_sharp = P(d/du) kappa`. Then:

1. `kappa_sharp` is real, even, Schwartz, and `F_sharp(z) := int kappa_sharp e^{zu/2} du = P(z/2) F(z)`
   (`d/du` corresponds to `-z/2`; P is even).
2. `kappa_sharp(t) = 2 c_{2k} pi^{2k+2} e^{(2k+9/4)t - pi e^t} L_sharp(t)` with `|L_sharp(t) - 1| <= C_P e^{-t}`
   for `t >= R_P`. (The n-th theta term of `kappa^(j)` is `e^{u/4} p_j(t) e^{-t}` with `deg p_j = j+2`,
   leading coefficient `2(-1)^j`; terms n >= 2 are `O(e^{-3 pi e^t})` relative.)
3. Hence the separated-tail theorem holds for `H_sharp` with the same `ell_delta`: for each delta > 0
   there is `R_sharp(delta)` such that for all N and all delta-separated `U_j >= R_sharp(delta)`,
   `sum conj(a_i) a_j H_sharp(U_i,U_j) >= (ell_delta/2) sum |a_i|^2 H_sharp(U_i,U_i)`.
   (Sections 3-5 of the PR proof verbatim: the exponent 7/2 becomes `7/2 + 4k`, `eta_R` becomes an
   `O(e^{-R})` quantity `eta_sharp_R`, the factor `(U+V)/(2 sqrt(UV)) sech((U-V)/2)` is unchanged.)
4. All PR 45 identities (2.1), (3.1), (3.2), (3.4), (4.2) hold for `kappa_sharp` (they use evenness and
   decay only).
5. If P has a zero `w_0` with `Re w_0 != 0`, then `F_sharp` has the off-axis zero `2 w_0`, and for every
   alpha > 0 the kernel `H_sharp,alpha` is not PSD (the PR 43/46 argument: PSD implies `S_sharp` Schur
   on Re z > 0, but `S_sharp = -1` at the zero and `S_sharp(0) = 1`).

Take `P(w) = (1 - 4w^2/rho^2)(1 - 4w^2/conj(rho)^2)`: `F_sharp(z) = F(z)(1 - z^2/rho^2)(1 - z^2/conj(rho)^2)`
with the off-line quadruple `pm rho, pm conj(rho)` at any chosen `rho` with `0 < Re rho <= 3/8`.
Given the 7/8 theorem for F, `F_sharp` is zero-free in `Re z > 3/8` as well.

Numerical confirmation (CHECK 1, part e; `rho = 0.3 + 3i`): the normalised 8-point Gram matrices
of `H_sharp` agree with the sech Gram to 2e-3 (delta=8,R=8: lambda_min 0.95459 vs 0.95508;
delta=4,R=20: 0.61504 vs 0.61561; delta=2,R=6: 0.16403 vs 0.16580), and identities (3.2), (3.4),
(4.2) hold to 2e-21, while the jet `J_6(0)` of the same kernel already has a negative eigenvalue
(section 5).

**Corollary (obstruction).** Any deduction that uses only (i) the separated-tail theorem in the
form proved in PR 44, (ii) the PR 45 all-order identities, and (iii) the absence of zeros of the
transform in `Re z > 3/8`, is valid for `F_sharp`, which has zeros at arbitrary prescribed points of
`0 < Re z <= 3/8`. So no such deduction can exclude a zero of zeta in `1/2 < Re s <= 7/8`, and none
can produce a zero-density or zero-spacing statement there either. A proof that moves the
boundary must use a property of kappa that `kappa_sharp` does not have. PR 45 reaches the same
conclusion for the concavity inputs ("the actual theta arithmetic remains an additional, unused
requirement"); Proposition Z extends it to the separated-tail bound and to the 7/8 input.

The finite strict certificates (rows 5, 12, 15, 17) are open conditions in the kernel, so they
also survive insertion of a quadruple at large height (`P -> 1` locally uniformly as
`|rho| -> inf`); measured: the jet of `kappa_sharp` with `rho = 0.3 + 30i` is PD through order 14 with
`J_2` entries within 2e-2 relative of those of zeta. The for-all-(u,v) two-point statement (row 2)
was not tested for `kappa_sharp`.

### 4.2 Theorem C (what the combination gives) — CONDITIONAL on the 7/8 theorem; elementary

**Lemma D (pair sign; CLASSICAL, used in PR 39).** For `z = x + it`, `x > 0`, and a mirror pair of
zeros `pm beta + i gamma` of F (`0 < beta`):
`Re[1/(z - beta - i gamma) + 1/(z + beta - i gamma)] = 2x (x^2 + (t-gamma)^2 - beta^2)/(|z-rho|^2 |z+conj(rho)|^2)`.
On-line zeros contribute `x/(x^2 + (t-gamma)^2) > 0`. Hence `Re F'/F(z) < 0` forces
`|z - i gamma| < beta` for some off-line zero `1/2 + beta + i gamma`.

**Theorem C.** Assume zeta has no zero in Re s > 7/8. Then for every alpha > 0:

(a) *Pole localisation.* Every pole p of `S = (F - alpha F')/(F + alpha F')` in Re z > 0 satisfies
`|p - i gamma| < beta <= 3/8` for some zero `1/2 + beta + i gamma` of zeta with `beta > 0`. In particular
`0 < Re p < 3/8` and, by Platt-Trudgian, `|Im p| > 3.0001753e12 - 3/8`. (Poles are solutions of
`F'/F = -1/alpha`, where `Re F'/F < 0`; apply Lemma D. Unconditionally the same holds with 1/2.)

(b) *Weighted all-order energy.* For every `x >= 3/8` the kernel
`K_x(u,v) := x int e^{xc} H_c(u,v) dc = 2 alpha e^{x(u+v)/2} M_x((u-v)/2)` is positive semidefinite on
R x R: all finite configurations, all coincidence limits, all derivative jets. Equivalently, for
all `a in C_c(R)`, with `f = h_+ * a`, `g = h_- * a = C_0 f`:
`int e^{xu} |g(u)|^2 du <= int e^{xu} |f(u)|^2 du`.
Proof: `int M_x(b) e^{i omega b} db = (1/2) d_x |F(x + i omega)|^2 = Re(F' conj F)(x + i omega)`
(substitute `p = a+b`, `q = a-b`); by Bochner `M_x` is positive definite iff `Re(F' conj F) >= 0` on the
line `Re z = x`; every zero has `|Re rho| <= 3/8 <= x`, so every term of `Re F'/F = sum (x - Re rho)/|z - rho|^2`
is `>= 0`. The energy form is `int x e^{xc} ||Q_c g||^2 dc = int e^{xu} |g|^2 du`.
For `x >= 1/2` this is unconditional (CLASSICAL; PR 42/43 use `a = 1/2`). The statement for all
`x > 0` is RH (horizontal monotonicity of `|xi|`).

(c) *Endpoint (PR 46 contour note, item 2).* The outer-line solution has finite weighted norms
`int e^{Xu} |g_out|^2 du` for all weight exponents `X >= 3/8` instead of `>= 1/2`, and the threshold
`d = inf Re(poles)` of the actual Gaussian response satisfies `d < 3/8` whenever a pole exists.

Relation to the fixed-cutoff hierarchy: `K_x` is the Laplace average over the cutoff of the PR 45
kernel. PSD of `H_c` at one cutoff (equivalently all jets at one point) is RH; PSD of the
average `K_x` is the single-line statement `Re(F' conj F) >= 0` on `Re z = x`. The 7/8 theorem gives
the second for `x >= 3/8` and nothing for the first, by Proposition Z.

What is new in Theorem C: only the range `3/8 <= x < 1/2` (and the disc in (a)), and only as a
transcription of the 7/8 input; atlas section 2 already has `|X(w-a)| < |X(w+a)|` iff `a >= Delta`.
**It is not a new statement about zeros.**

### 4.3 The leakage bound cannot exclude a pole — PROVED

PR 44 (5.1): a pole `p = sigma + i tau` of S forces leakage
`>= sigma |B_+(p)|^2 |V~(p)|^2`, `|V~(p)|^2 = 4(1 + e^{-sigma} - 2 e^{-sigma/2} cos(tau/2))/(sigma^2 + tau^2)`.
With `|B_+| <= 1`, `sigma < 1/2`: the right side is `<= 4 sigma (1 + e^{-sigma/2})^2/tau^2 <= 2(1 + e^{-1/4})^2/tau^2 < 6.33/tau^2`
(`sigma (1 + e^{-sigma/2})^2` is increasing).
By Theorem C(a) (unconditional form) `|tau| > 3e12 - 1/2`, so the right side is `< 7.1e-25`
(script: 7.02e-25). The certified bound 0.124030166 is larger by a factor `> 1e23`. Even for a
hypothetical pole at the height of the first zero (`tau = 14.13`) the single-pole bound is at most
0.0316 < 0.124. So no improvement of the constant 0.124 at this probe, short of exactly 0, says
anything about zeros; PR 44 states that no zero-free height is claimed, and this is the
quantitative reason.

What would be needed instead (a reformulation, not a route). The same inequality for the
modulated box `e^{i tau' u/2} 1_[0,1]` reads
`L_alpha(tau') >= sigma |B_+(p)|^2 |2(1 - e^{-(p - i tau')/2})/(p - i tau')|^2` (PROVED: (5.1) with the
shifted pulse transform, which is still zero-free in Re z > 0). At `tau' = Im p` the right side is
`sigma |B_+(p)|^2 (2(1 - e^{-sigma/2})/sigma)^2 <= sigma |B_+(p)|^2`. For an off-line zero
`rho = beta + i gamma` and small alpha the pole is at `rho - alpha + O(alpha^2)`, and `B_+` contains
the factor `b_{rho+alpha}(rho - alpha)` of modulus `alpha/beta + O(alpha^2)` (zero of `F - alpha F'`
next to rho), so this lower bound is at most about `(beta - alpha) alpha^2/beta^2`, with maximum
`4 beta/27` at `alpha = 2 beta/3` (0.056 for `beta = 3/8`; HEURISTIC beyond first order in alpha).
Excluding zeros with `beta > c` through (5.1) therefore needs an upper bound
`L_alpha(tau') < 4c/27` (times the remaining Blaschke factors) for **every** modulation `tau'`: an
every-window statement (MV-CAP wall), with finite certificates covering only the verified
height. PR 44's 0.124 is one point (`tau' = 0`, `alpha = 1`) of this family.

## 5. DH control and the jet-order scan (MEASURED)

Kernels: `kappa_DH(u) = e^{3u/4} sum_n a(n) n e^{-pi n^2 e^u/5}`, `a` = period-5 DH coefficients
(`1, kappa, -kappa, -1, 0`); transform `(5/pi)^{..} Gamma((s+1)/2) f_DH(s)` at `s = 1/2 + z`, even, with
off-line zeros (first at `0.808517 + 85.699348 i`, i.e. `beta = 0.3085`).

| Statement | zeta | DH | kappa_sharp (rho = 0.3+3i) |
|---|---|---|---|
| Separated-tail Gram, 8 points (delta=8,R=8 / 4,20 / 2,6 / 1,6): lambda_min | 0.9552 / 0.6472 / 0.1642 / 0.00756 | 0.9527 / 0.6508 / 0.2030 / 0.00384 | 0.9546 / 0.6150 / 0.1640 / 0.00766 |
| max entry deviation from sech Gram | 1.4e-3 / 1.1e-3 / 8.1e-3 / 8.7e-3 | 1.8e-3 / 1.1e-3 / 8.0e-3 / 8.7e-3 | 2.0e-3 / 1.1e-3 / 7.9e-3 / 8.2e-3 |
| Identities (3.2), (3.4), (4.2) | hold (3e-26) | hold (4e-16) | hold (2e-21) |
| `J_2(0)` PD, `J_11 > 0`, `(-b') kappa'^2 >= 0` on grid | yes | yes (lambda_min of normalised `J_2`: 0.140) | yes |
| Jet `J_N(0)`: first order with a negative pivot (even / odd block) | none through 120 | none through 200 | 6 / 13 |
| `Re F'/F` on `Re z = x` near the first off-line zero | > 0 | < 0 for x = 0.05, 0.2, 0.3 (-1.04, -7.08, -115.5 at omega = gamma) | — |

Jet-order scan for an inserted quadruple at `0.3 + i gamma` (LDL pivots of the diagonally
normalised parity blocks; exactly one negative pivot per parity block in every inserted case):

| Kernel | height gamma of the off-line zero | first order with a negative pivot (even / odd block) | negative pivot (normalised) | `pi gamma/4 + 2 N(gamma)` |
|---|---|---|---|---|
| kappa_sharp | 3 | 6 / 13 | -1.0e-3 / -2.2e-4 | 2.4 |
| kappa_sharp | 5 | 10 / 9 | | 3.9 |
| kappa_sharp | 8 | 8 / 9 | | 6.3 |
| kappa_sharp | 12 | 10 / 13 | | 9.4 |
| kappa_sharp | 16 | 14 / 15 | | 14.6 |
| kappa_sharp | 20 | 18 / 19 | -1.0e-5 / -2.4e-6 | 17.7 |
| kappa_sharp | 30 | 30 / 27 | -1.6e-8 / -1.4e-8 | 29.6 |
| kappa_sharp | 50 | 60 / 65 | -1.6e-17 / -3.2e-17 | 59.3 |
| zeta | (none known) | none through 120 (least pivot 5.7e-30) | — | — |
| DH | 85.70 (beta = 0.3085) | none through 200 (least pivot 2.5e-42) | — | 153.3 |

`N(gamma)` = number of on-line zeros of the base function with ordinate in (0, gamma): 0, 1, 1, 3, 10
for zeta at gamma = 12, 16, 20, 30, 50; 43 for DH at 85.70 (sign changes of `xi_DH(1/2+it)`,
`work/dh_count.py`). Runs: orders <= 44 locally (dps 120, two steps, agreement 4e-152); order 120
on the motherbox for gamma = 20, 30, 50, zeta and DH (dps 200, two steps, agreement <= 5e-109);
DH order 200 (dps 200 + 320 guard digits, steps 1/100 and 1/200, agreement 9.9e-99, 45 min on 4
cores); an independent single-step DH run to order 172 reproduces the order-171 pivot 1.7213e-36.

For the inserted quadruples with gamma >= 12 the detection order is within 3 of
`pi gamma/4 + 2 N(gamma)` (HEURISTIC reading: a test vector of order N has transform
`P(z) D(z)` with `deg P <= N`; `|t^N D(it)|^2` peaks at `t = 4N/pi`, and P must also be small at the
`2 N(gamma)` mirrored zeros below the pole, which span the positive model space `K_{B_+}`). The same
formula predicts order 153 for DH; **DH is still PSD at order 200, so the fitted law does not
transfer to DH** and the DH detection order is only known to be finite (PROVED: PR 44 Corollary 3
applies to the DH kernel, whose features are holomorphic on the same strip, and `H_DH` is not PSD
because DH has off-line zeros) and larger than 200 (MEASURED). The size of the negative pivot
falls from 1e-3 (gamma = 3) to 1.6e-17 (gamma = 50).

Reading: (i) every PR 44/45 positive statement that was tested holds for DH, so none of them is
an Euler-product statement; the separated-tail theorem holds for DH by the same proof (leading
term `e^{3u/4 - (pi/5) e^u}`, relative correction `O(e^{-3 pi e^u/5})`, limit kernel
`sech((U-V)/2)`). (ii) The all-order hierarchy does see off-line zeros, at an order that grows
with their height; for DH it has not turned negative by order 200. A proof of all-order
positivity for zeta therefore has to use, at every order, an input that fails for DH; nothing in
PR 44/45 is such an input. (iii) In the combination of section 4 the only step that uses the
Euler product is the imported 7/8 theorem. The single-line positivity `Re(F' conj F) >= 0` behind
Theorem C(b) is false for DH at `x = 0.05, 0.2, 0.3` (computed above; at `x = 3/8` it holds near this
particular zero, whose beta is 0.3085), and the proof of C(b) fails for DH exactly at the step
"every zero has `|Re rho| <= 3/8`".

## 6. Why the obstruction is the known walls

- The separated-tail regime probes `H(U,V)` where it is of size `e^{-2 pi e^R}`; there the kernel is
  its first theta term up to `O(e^{-R})`. Zero information sits in coalescing configurations
  (PR 44 Theorem 2: all derivative orders at a point), where the PR 49 leading model is itself
  not PSD. A fixed spacing delta and all-order control are separated by the loss
  `ell_delta ~ e^{-4 pi/delta}`; the PR states this.
- All-order control at a point is RH for each alpha (rows 11, 13). Finite orders are blind to
  zeros above a height that grows with the order (section 5): the verified-height wall in jet
  form.
- The 7/8 input enters only through `Re F'/F >= 0` on `Re z >= 3/8`, i.e. through the averaged kernel
  `K_x`. Passing from `K_x` (a Laplace average in the cutoff) back to a fixed cutoff is the same
  step as passing from a zero-free half-plane to the line: it needs the arithmetic input that
  is missing (TRO6-natural for the next step below 7/8).

## 7. Three weakest steps

1. Proposition Z part 3 is proved with non-explicit constants (`R_sharp(delta)` not computed); the
   numerical confirmation is at `rho = 0.3 + 3i` and four (delta, R) pairs only. The statement
   "the separated-tail theorem holds for DH" is likewise an asymptotic argument plus four
   numerical Gram matrices, not a certified table.
2. The jet scan (section 5) is multiprecision floating point with two quadrature steps and
   LDL pivot signs; no interval enclosure. "DH is PSD through order 200" and the
   detection orders are MEASURED. The fitted law `N* ~ pi gamma/4 + 2N(gamma)` rests on five inserted
   heights, has no proof, and already fails to predict DH.
3. CHECK 3 is not an independent enclosure of `0.124030166`; it shows the true leakage is
   numerically ~0 for the smoothed box below height 300. The PR's interval certificate itself
   was read but not re-run. Theorem C inherits the status of the 7/8 theorem (Lean-checked
   locally, unrefereed).

## 8. Files

- `RESULT.md` (this file).
- `work/kern.py` (kernels), `work/check1_septail.py` -> `check1.out`, `work/check2_jets.py` ->
  `check2.out`, `work/check3_leakage.py` -> `check3.out`, `work/dh_shear.py`,
  `work/dh_count.py`, `work/jets_big.py` -> `work/local44.log`, `motherbox/{val40,jobA,big120_DH,jobB,jobC}.log`
  (motherbox runs: at most 8 cores, < 2 GB, longest 45 min).
- `src/pr{39,41,43,44,45,46,49}/`: read-only extracts of the PR research directories (PR 42's note
  `formalization/paper/sign_switching_energy_2026-11-07.md` was read from `refs/pr/42`).
- Python environment: `mpmath`, `numpy` (local venv removed after the runs; motherbox venv with
  `gmpy2` in `~/rh-push/b-codex-energy-lanes/venv`).
