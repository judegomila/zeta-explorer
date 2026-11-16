# REFEREE: r2-lowpass-cone/RESULT.md

Date: 2026-11-16. Adversarial referee. Verdict on the claim as stated: **holds = false** (one headline statement
labelled PROVED is not proved and is false as worded; one MEASURED threshold is off by one; two proof gaps in
Theorem 4, both repairable). The core mathematics (Theorem 1, Lemmas 2.1, 2.2, 5.1, Theorems 2, 3, 4(i)(ii),
Proposition 5.2) survives. Referee scripts: `/tmp/ref_lowpass/{a,b,d,d2,e}.py` (mpmath / python-flint, own code).

## 1. Steps re-derived and confirmed

| step | status | note |
|---|---|---|
| Theorem F (1.1) | CONFIRMED | quartet term `4 e^{(b^2-g^2)t} cos(2 b g t)`; ratio bound and tail re-derived. Input: on-line zeros to a finite height (verified height, stated). |
| Theorem 1(a) | CONFIRMED | the hypothesis `sum < 1` forces `gamma^2 > gamma_1^2 + b^2` for every quartet, which the ratio bound needs; `T_0` is otherwise unused. |
| Theorem 1(b) | CONFIRMED | gap `mu' > mu` exists because `Re(-rho^2) -> inf` in a strip. |
| T-NR `c > 2` fails Theorem F | CONFIRMED, new cases | `q=5, c=2.2`: `Theta(2) = -1.25e-3`, `Theta(3) = -5.4e-5`; product tests (Pick form from `L` only, Chebyshev nodes in `[0.6,1.2]`) `+6.7e-5` at `M=6`, `-4.7e-6` at `M=8`, `-5.2e-7` at `M=10`. `q=7, c=2.5`: `Theta(2) = -1.9e-2`. |
| T-NR `c < -2` satisfies Theorem F | TRUE, but the stated reason is not general | see 2.4 |
| Lemma 2.1, Lemma 2.2, extreme rays | CONFIRMED | residues, Polya-Szego, degree-deficient rays are extreme (leading-coefficient argument). |
| Theorem 2, Theorem 3, Lemma 3.1 | CONFIRMED | exchange in Theorem 2 is fine although `E_m(0) = (sum b_j)^2 != 0` (`t^{-1/2} log` is integrable). `F_c` is a positive cone only for `c = 1/2` (zeros not known in a narrower strip); that is the case used. |
| Theorem 4(i), (ii) | CONFIRMED | |
| Lemma 5.1 | CONFIRMED | Cayley-map algebra re-derived. |
| Proposition 5.2 | CONFIRMED, new witness | quartet `0.46 + 937.7i`, pair `937.2i`: `<m,d> = [-1.6041980e-488 +/- 3.2e-496] < 0`, heat ratio 0.363 (Arb, 3000 bits). Explicit zero-free constant checked (`1/2 - 1/(5.573 log 937.8) = 0.4738`). `Re H > 0` at heights 938, 939, 950, 2000, 5e4 for `beta = 0.5, 0.3, 0.1, 0.01`; `H(i tau) >= 0` on a 3000-point grid. |

## 2. Errors and gaps

### 2.1 "All known positive tests form K_0" is not proved and is false as worded (main error)

What is proved: the generators *listed* (Theorem F mixtures, termwise zero location, the `dh-separator`
generators) lie in `K_0 = K_F + K_Om_T`. The step from "listed generators" to "all known positive tests" is not
an argument. Two classes of known positive tests are outside `K_0`:

* **Direct evaluation.** On a fixed node set `l(m) = sum_j m_j Phi(u_j)` is a finite computation of `xi'/xi` at
  `N` real points. Its sign is certifiable for any single `m`, wherever the transform vanishes.
* **Dominance.** `l(m) >= sum over verified zeros of H_m(i gamma_n) - (explicit zero count) * sup (Re H_m)^-` above `T`.
  This is the mechanism of Theorem F itself (not termwise), and `K_F` contains only one instance of it.

Counterexample to the Section 6 sentence "a proof of `l >= 0` on one extreme ray with a root above verified height
would be new information; nothing here supplies it": nodes `0.7, 1.3, 2.9`, `N = 3`, `K = 1`, extreme ray
`H(w) = (w^2 + tau^2)^2 / prod (u_j - w^2)`.

| root `tau` | `l(m)` (from `L` at 3 points) | first-zero term | `min Re H` in the lens | ratio |
|---|---|---|---|---|
| 101 (`T = 100`) | 27.19 | 23.81 | -9.6e-9 | 2.8e9 |
| 1000 | 2.747e5 | 2.380e5 | -1.0e-12 | 2.7e17 |
| 3e12 + 7 | 2.2265e43 | 1.928e43 | -1.2e-50 | 1.8e93 |

`Re H < 0` only for `|gamma - tau| < 0.53`, where `|H| <= 2.3/gamma^4`; with `N(T+1.1) - N(T) = O(log T)` the
negative part is below `1e-6` against 27. So by Theorem 4(iii) this ray is outside `K_0`, yet its positivity is
unconditional from verified height 100 plus a zero count. It carries no information about zeros near `tau`.

Consequence: Theorem 4 classifies `K_0` as defined; it does not classify what is known. The correct obstruction
is narrower than "any test vanishing above verified height is OPEN": the uncovered tests are those whose
low-height mass is suppressed enough that a lens above `T` is not dominated (the order-149 vector is of this
kind: it removes the on-line mass below 200), and the open statement is uniformity over all orders and node
sets, not any single ray. Way around the stated obstruction: replace `K_Om_T` by the dominance cone
`{ m in C_Pick : sum_{gamma_n < T} H_m(i gamma_n) >= int_T^inf sup_beta (Re H_m)^- dN(gamma) }`. This is still
verified-height bound and gives no zero location, so the verdict "no new information" stands, but the
"iff" description in the claim does not.

### 2.2 `K_F` inside `K_Om_T` "for N < 88" is off by one (MEASURED)

`p2b.py` scans `N` in steps of 4 above 60, so 88 is the first failing *grid* value. Independent
truncated-Hausdorff test (mpmath, 600 and 2000 digits, same nodes): at `beta = 1/2`, `gamma = 100`
membership holds for `N = 84, 85, 86` and fails for `N = 87, 88, 89, 90`. Correct statement: `N <= 86`.
The entries 72, 92, 132, 88 (`gamma = 50, beta = 0.25`), 172 are also multiples of 4 and may be up to 3 too
high. Entries below 60 reproduced (17, 21; new cases `gamma = 40, beta = 0.5`: 38; `gamma = 25, beta = 0.4`: 31).
At `N = 87` the points `(0.5, 110)`, `(0.5, 300)`, `(0.3, 100)`, `(0.05, 100)` are inside the moment cone, consistent
with the corner being worst. The conclusion "nothing added at orders up to 40" is unaffected. Note the corner
`beta = 1/2` at height 100 is outside `Om_T` with the explicit zero-free width (max `beta` 0.461), so the
threshold for the cone actually defined is somewhat higher; not computed.

### 2.3 Theorem 4(iii) and (iv): proofs incomplete, statements true

* (iii) The proof picks `arg(tau_1^2 + rho^2) = pi/(2r)`. For `r >= 2` this forces `gamma < tau_1`
  (`gamma = 99.90` for `tau_1 = 100`, `beta = 0.1`, `r = 2`), so for `tau_1 = T` exactly the point is outside `Om_T`.
  Repair: use an odd multiple `(2j+1) pi/(2r)` in `[pi/2, pi)`; then `gamma > tau_1` and the `2r`-th power is
  still negative real (checked: `r = 2`, angle `3 pi/4`, `gamma = 100.10`).
* (iv) The factor `(-rho^2)^e` of the numerator is omitted. It contributes up to `-arctan(gamma/(gamma^2 - 1/4))`
  (about `-0.01` at `T = 100`). With the written bound `1/(d - 1/(4T))` per root the total for `e = 1` exceeds
  `pi/2` from `K = 10` (`1.5767 > 1.5708`). Repair: `gamma^2 - tau^2 >= d(2 gamma - d)`, which gives total
  `<= (pi/2)/(2 - d/T) + 0.01 <= 1.52` under `N <= 1.5 T`. True worst numerator argument at `T = 100`: `-0.85`
  (`K = 10`), `-1.43` (`K = 70`). Also `0.0025` in the proof is `1/(4T)` at `T = 100` only.

### 2.4 Smaller points

* T-NR `c < -2`: "(a) applies" is false for large `q` (criterion sum exceeds 1 once `log q` is about 9, e.g.
  `q = 20011`, `delta = 0.49995`). Theorem F still holds for every `q`: the cosh-factor heat trace is a Poisson sum
  of positive Gaussians (checked numerically at `q = 20011`: positive at 10 values of `t`). For `c > 2` the same
  Poisson sum alternates.
* Theorem F for DH rests on the measured zero list below 200 and on no off-line quartet below 85.7; it is
  MEASURED-conditional, not PROVED. Labelled so in Section 7.
* Membership of the order-149 vector in `K_Om_T` for `T >= 937.934` is a grid statement (labelled).
* The claim summary says "iff ... no critical-line zero above T (margin <= 1.28K)": the band
  `(T - 1.28K, T)` is undecided by Theorem 4; the measured margin is about a third of it.

## 3. Controls

* DH: every element of `K_0` examined passes for DH; `K_F` holds for DH; the only Euler input is the classical
  zero-free region. The result claims no RH-relevant positivity, so there is nothing that must fail for DH
  beyond the strip bound. Consistent.
* RH is not assumed. Verified height is named as the input, not presented as new. The dominance tests of 2.1
  are also verified-height statements.
* The zeta value `+5.64e-262` on the order-149 vector was not recomputed here.

## 4. Surviving claim

Theorem F is a low-height zero-location statement: true for zeta and (on measured zeros) DH, false for the
Euler-product twin T-NR with `c > 2`. On a real node set the listed generators lie in `K_0 = K_F + K_Om_T`
inside the Pick cone; an extreme Pick ray lies in `K_0` iff it is the divided-difference ray or (up to a margin
below `T`) has no root at or above `T`. With `T = 100`, `K_F` is inside `K_Om_T` at the tested corner for
`N <= 86`. The order-149 DH vector is outside `K_F + K_Om_T` for `T <= 937.8`. Not surviving: that `K_0` is the
set of all known positive tests, and that positivity on any ray with a root above verified height is open.
