# g-renderer-learnings: what the zeta-view renderer observed, tested on zeta and on Davenport-Heilbronn

Date: 2026-11-16. Lane: mine the renderer (`~/Documents/GitHub/zeta-view`, read-only) and PR 42 for
empirical regularities, state each precisely, test on zeta and on the Davenport-Heilbronn (DH) control, rank the
zeta-only ones, prove what can be proved for the top two.

Nothing here proves or refutes RH. Labels: PROVED / CLASSICAL / MEASURED / MODEL / OPEN.

## 0. Verdict

**Partial result plus a precise obstruction.**

1. Every regularity the renderer shows falls in one of three classes (table in §2):
   - **G (generic):** an identity or a local/topological fact that follows from the functional equation and
     analyticity. Holds for DH as well. 12 of 20 items. No RH content.
   - **E (Euler-proved boundary fact):** true for zeta by the Euler product (no zeros in Re s >= 1), false for DH.
     Already proved; restates the zero-free region. 2 items.
   - **R (RH restatement or RH-necessary):** holds for zeta on every sample, fails for DH exactly at its off-line
     zeros. 6 items. All six reduce to one set being empty (Theorem A).
2. **Theorem A (PROVED, half-disk confinement).** For any order-1 entire F with the xi symmetries, the
   negative-shear set in the right half-strip is contained in the union of the open half-disks whose diameters join
   the two members of each off-line zero pair. The finite bridge `B_a` is negative only inside the concentric
   disks of radius `sqrt(b^2 - a^2)`. This is the global form of the PR 42 quadratic "modal collision" picture.
   Measured on DH: 126 negative grid samples of 79,840, all inside the four known half-disks, none outside.
   Measured on zeta: 0 negative samples of 79,840.
3. **Theorem B (PROVED, axis witness is screened).** The renderer's "first modal witness" `L_1(t) < 0` on the
   critical line is the Laguerre expression. It fires at the foot of an off-line pair iff `2/b^2` exceeds the
   screening sum of all other zeros. An explicit entire control with all the symmetries, an off-line quartet, and
   `L_1 > 0` on the whole axis is given. So `L_1 >= 0` on the line is strictly weaker than "zeros on the line".
   On DH the criterion matches measurement to three digits at all four known off-line pairs.
4. **Obstruction.** No renderer regularity is both zeta-only and outside classes E and R. The Euler product enters
   only through the zero-free region that bounds the disk radii (`b < 1/2` proved; `b <= 3/8` conditional on the
   unrefereed 7/8 half-plane). The geometry (torus, sphere, Klein quotient, spinor, twistor, channels) reorganizes
   the same sign condition and adds no constraint. The renderer's own control `Q_{a,T}` (KLEIN-ANNULUS §8)
   already states this for topology; Theorem A states it for the shear sign, Theorem B for the axis witness.

## 1. Plan: what is new relative to the atlas and the walls

Read first: BRIEF, atlas (PR 27 `historical-routes.md` §2 twin ladder and shifted bridge), eq48 RESULT (residual
target == Weil form), renderer docs (`BRIDGE-RESEARCH`, `ZERO-CHANNELS-MATH`, `KLEIN-ANNULUS`, `SPINORS-TWISTORS`,
`NO-ESCAPE`, `ZERO-CONFINEMENT-COMPARISON`, `INFINITY-ENDS-DUAL`, `DYNAMICS`, `ROADMAP`, README), PR 42
`sign_switching_energy_2026-11-07.md`.

- Atlas §2 has the single-packet identity
  `|Q(w+a)|^2 - |Q(w-a)|^2 = 8a Re(w) ((Re w)^2 + (Im w - gamma)^2 + a^2 - delta^2)` and the threshold `a >= Delta`.
  New here: the global differential form summed over all zeros of the actual function (Theorem A), its test on
  DH, and the statement that the axis witness is not equivalent to zeros being on the line, with the exact
  firing criterion and a control (Theorem B).
- PR 42 §1 proves the diameter/half-disk statement for the quadratic model `w^2 + 2 eps` only. Theorems A and B
  give the corresponding statement for the full function, where equality becomes inclusion.
- Not attempted: any new positivity proof. By eq48 the interior inequality `E_+ >= E_-` is the Weil form.

Walls: DH is tested on every item. Flow-blindness and MV-CAP are not challenged: Theorem A is pointwise and
generic. Verified height enters Corollary A2 only as an input.

## 2. Catalogue of renderer regularities

`F` is completed xi or the completed DH function
`xi_DH(s) = (pi/5)^{-s/2} Gamma((s+1)/2) f(s)`, `f = (1-i kappa)/2 L(s,chi) + (1+i kappa)/2 L(s,chi-bar)`,
`chi` mod 5 with `chi(2) = i`, `kappa = (sqrt(10-2 sqrt 5) - 2)/(sqrt 5 - 1)`. Checked: functional equation
relative error 3.7e-47 (160-bit Arb), real on the critical line to 1e-27, known off-line zero
`0.808517182456637 + 85.699348485377592 i` reproduced.

| # | Renderer view (source) | Precise statement | zeta | DH | Class |
|---|---|---|---|---|---|
| 1 | Bridge / Bloch equator (BRIDGE §1, SPINORS §1, ROADMAP) | `|F(s+a)| = |F(s-a)|` on Re s = 1/2; `n_3 = 0`; `W = 0` on the axis | holds | holds (FE 3.7e-47) | G, identity |
| 2 | Klein seam (KLEIN §4) | F real on the line: `Im F` Dirichlet, `Re F` Neumann on the critical boundary | holds | holds (1e-27) | G, identity |
| 3 | Anti-bridge saddle (README) | `F'(1/2) = 0`, `F(1/2) != 0` | `xi(1/2) = 0.49712` | `xi_DH(1/2) = 1.13604` | G |
| 4 | Winding (README, NO-ESCAPE) | both lifts of a zero have the same winding; total winding conserved; zero/pole of `R_a` cancel in contour counts | holds | holds | G, topological |
| 5 | Newton guidance (CHANNELS §6) | `F(s(l)) = e^{-l} F(s(0))`; phase constant along flow lines | holds | holds; off-line zeros attract too | G, identity |
| 6 | One-zero channel (CHANNELS §2, CONFINEMENT) | Taylor-Rouche margin `E + B r^2/2 < A r` in a reflection-symmetric disk gives one simple on-line zero | certified at gamma_1 | applies to each simple on-line DH zero; cannot hold on a disk containing an off-line zero (count >= 2) | G, local |
| 7 | Inverse-gap coupling (CHANNELS §1) | `gamma_i' = (1/2) sum 1/(gamma_i - gamma_j)`; linearization is a graph Laplacian; `q' = 2 - qS`, `S > 0` | holds | holds for any real configuration | G |
| 8 | Heat direction (NO-ESCAPE, DYNAMICS) | forward heat preserves real zeros; reverse heat can collide them | holds | holds (de Bruijn) | G, CLASSICAL |
| 9 | Even/odd energy identity (BRIDGE §3, PR 42 §3-4) | `E_+ - E_- = W_h(t)/h` | renderer test 2e-15 | identity, any F | G, identity |
| 10 | Bridge/Pick congruence, Schur inertia (BRIDGE §4) | `K^b`, `K^P` share inertia; `ind_-(Q) = ind_-(C) + ind_-(Q_eff)` | holds | holds | G, linear algebra |
| 11 | Divisor blocks (BRIDGE §5) | `D_N(xi) = sum_{d|N} cos((xi/2) log(d/sqrt N))` factors over prime powers | identity | identity of integers; not a property of F | G (arithmetic identity, no sign) |
| 12 | Seven-point layer (BRIDGE §5, PR 43) | one vector with `Q(1/20) < 0` and positive integrated direction | one vector | not tested (object is the theta kernel) | no universal content |
| 13 | **Shear sign** (BRIDGE §1) | `W = Re(F' conj F) > 0` for Re s > 1/2 | 0 of 79,840 samples negative | 126 of 79,840 negative | **R** (RH-equivalent, Theorem A) |
| 14 | Derivative disk (ROADMAP) | `|C| < 1`, `C = (G - l G')/(G + l G')`, in the right half-plane | same as 13 | same as 13 | R (identical to 13) |
| 15 | Interior energy order (PR 42 §5) | `E_+ >= E_-` for `0 < h < a` | same as 13 | same as 13 | R (identical to 13 by item 9) |
| 16 | Shifted ratio / finite bridge (BRIDGE §6) | `B_a > 0`, `|R_a| < 1` for Re s > 1/2 | holds on samples | negative inside radius `sqrt(b^2-a^2)`; none for `a > b` | R for small a; E for a >= 1/2 |
| 17 | **Axis modal witness** (BRIDGE §2, PR 42 §1) | `L_1(t) = Xi'(t)^2 - Xi(t) Xi''(t) >= 0` | min 0.0464 Xi^2 on [1,200] | negative on 4 intervals | **R-necessary only** (Theorem B) |
| 18 | Complete count (README) | `N(T)` equals the number of sign changes of Z | holds to tested height | fails (off-line zeros) | R, verified-height wall |
| 19 | Starting boundary PSD at a = 1/2 (BRIDGE §3) | `P_{1/2}` kernel PSD (Hermite-Biehler for `xi(1 - iz)`) | PROVED (no zeros in Re s >= 1) | fails (DH has zeros in Re s > 1, CLASSICAL) | E |
| 20 | Real-node logPick (BRIDGE §4) | `(L(x_i)+L(x_j))/(x_i+x_j)` PSD | measured PSD | passes to order 100 (sibling `euler` lane) | R globally; DH-blind at finite order |

Ranking of the zeta-only items by content:

1. Item 13 (with 14, 15, 16): the shear sign. RH-equivalent. Top item.
2. Item 17: the axis witness. Zeta-only on the tested range, but only necessary for RH.
3. Item 19: proved, Euler product, equal to the classical zero-free region.
4. Item 18: verified height.
5. Item 20: Euler-blind at every tested finite order.

## 3. Theorem A: negative shear is confined to half-disks

**Setting.** F entire of order 1, `F(1 - s) = F(s)`, `F(conj s) = conj F(s)`, `F(0) != 0`. Zeros: on-line
`1/2 + i gamma`, and off-line pairs `{1/2 + b + i gamma, 1/2 - b + i gamma}` with `b > 0` (the reflection
`s -> 1 - conj s` pairs them). Write `s = 1/2 + x + it`.

**Step 1 (CLASSICAL).** `F'/F(s) = B + sum_rho (1/(s-rho) + 1/rho)` and the functional equation gives
`Re B = - sum_rho Re(1/rho)`, so `Re F'/F(s) = sum_rho Re 1/(s - rho)`, absolutely convergent (Davenport,
Multiplicative Number Theory, ch. 12; the derivation uses only order 1 and the functional equation, so it
applies to `xi_DH`).

**Step 2 (PROVED, algebra).** An on-line zero contributes `x/(x^2 + d^2)`, `d = t - gamma`. An off-line pair
contributes

    (x-b)/((x-b)^2+d^2) + (x+b)/((x+b)^2+d^2) = 2x (d^2 + x^2 - b^2) / ( ((x-b)^2+d^2) ((x+b)^2+d^2) ).

Check: the numerator is `(x-b)((x+b)^2+d^2) + (x+b)((x-b)^2+d^2) = 2x(x^2-b^2) + 2x d^2`.

**Theorem A (PROVED).** For `x > 0`,

    Re F'/F(s) = sum_on x/(x^2+d^2) + sum_pairs 2x (d^2 + x^2 - b^2) / ( ((x-b)^2+d^2)((x+b)^2+d^2) ).

Hence `{ s : Re s > 1/2, W(s) <= 0 }` is contained in the union over off-line pairs of the open half-disks
`D_rho = { |s - (1/2 + i gamma)| < b, Re s > 1/2 }`. If there are no off-line zeros, `W > 0` on Re s > 1/2.

**Theorem A' (PROVED, finite bridge).** Integrating Theorem A over the horizontal segment `[s-a, s+a]`
(the terms are locally integrable and the sum converges locally uniformly away from zeros):

    log|F(s+a)| - log|F(s-a)| = (1/2) sum_on log( ((x+a)^2+d^2)/((x-a)^2+d^2) )
                               + (1/2) sum_pairs log( |Q(w+a)|^2/|Q(w-a)|^2 ),

and by the atlas §2 identity each pair term is negative only if `x^2 + d^2 < b^2 - a^2`. So for `x > 0`,
`B_a(s) <= 0` implies `s` lies in a disk of radius `sqrt(b^2 - a^2)` about the foot `1/2 + i gamma` of a pair
with `b > a`. A bridge of width `a` does not see pairs with `b <= a`.

**Corollary A1 (PROVED for zeta; this is where the Euler product is used).** The Euler product gives
`zeta(s) != 0` for Re s >= 1, so every zeta pair has `b < 1/2`. Therefore `W > 0` on Re s >= 1, `B_a > 0` on the
right half-plane for every `a >= 1/2`, and negative shear at height t requires an off-line zero with
`|gamma - t| < 1/2`. With RH verified to height H (Platt-Trudgian, 3e12): `W > 0` on `1/2 < Re s`, `|t| <= H - 1/2`.
Conditional on the unrefereed 7/8 half-plane: `b <= 3/8`, `W > 0` on Re s >= 7/8, `B_a > 0` for `a >= 3/8`.

**Corollary A2 (PROVED).** RH is equivalent to the union of half-disks being empty, and each of items 13-16
equals that statement. The torus, sphere, Klein, spinor and twistor coordinates are bijective reparametrizations
of `(x, t)` or of the pair `(F(s+a), F(s-a))` and leave the set unchanged.

**DH control (MEASURED).** Grid `sigma = 0.51 (0.02) 1.29`, `t = 0.5 (0.1) 200`, 160-bit Arb, `F'/F` by central
difference with step 1e-12.

| | samples | negative | negative outside the four half-disks | min Re F'/F |
|---|---|---|---|---|
| zeta | 79,840 | 0 | 0 | +0.00046 |
| DH | 79,840 | 126 | 0 | -52.0 |

DH negatives per pair (gamma, b): (85.699, 0.3085): 65; (114.163, 0.1508): 19; (166.479, 0.0744): 4;
(176.702, 0.2243): 38. Radial profiles from each foot change sign between r = 0.90 b and r = 1.01 b at every
tested angle (`t3f.out`); the negative set is slightly smaller than the half-disk, as Theorem A allows.
Finite bridge near the first pair (`b^2 = 0.0952`): a = 0.10, 0.20, 0.30 give 1198, 756, 62 negative samples, all
inside radius `sqrt(b^2 - a^2)`; a = 0.31 and 0.40 (`a > b`) give none.

**Where DH fails.** Theorem A holds for DH. Corollary A1 fails: DH has no Euler product, has zeros in Re s > 1
(Davenport-Heilbronn 1936, CLASSICAL, not recomputed here), so there is no bound `b < 1/2` and the disks are
nonempty.

## 4. Theorem B: the axis witness and its screening

On the line `F(1/2 + it) = Xi(t)` is real. Differentiating Step 1 in `s` and restricting to the line:

**Theorem B (PROVED).**

    L_1(t)/Xi(t)^2 = (Xi'^2 - Xi Xi'')/Xi^2 = sum_on 1/(t-gamma)^2 + sum_pairs 2 (d^2 - b^2)/(d^2 + b^2)^2.

(i) `L_1(t) < 0` implies `|t - gamma| < b` for some off-line pair: the witness set lies in the union of the open
diameters of the half-disks. (ii) At the foot `t = gamma_0` of a pair,
`L_1/Xi^2 = -2/b_0^2 + S(gamma_0)`, where `S` is the sum over all other zeros; the witness fires at the foot iff
`2/b_0^2 > S(gamma_0)`. (iii) The implication in (i) cannot be reversed: for

    Xi_c(z) = cos(pi rho z) ((z - g)^2 + b^2) ((z + g)^2 + b^2),   g > b > 0,   pi^2 rho^2 > 2/b^2,

`F(s) = Xi_c(-i(s - 1/2))` is entire of order 1, satisfies both symmetries, has the off-line quartet
`1/2 +- b +- i g`, and `L_1 > 0` on the whole critical line.

Proof of (iii): the cosine contributes `pi^2 rho^2 / cos^2(pi rho z) >= pi^2 rho^2`; a pair term is at least
`-2/b^2` (minimum at `d = 0`) and is negative only for `|d| < b`; since `g > b` the two pairs are never negative
at the same real z. So `L_1/Xi^2 >= pi^2 rho^2 - 2/b^2 > 0`. Numerical check (`t4.out`): with `b = 0.5`,
`g = 10.3`, `rho = 0.5` gives min -4.94 (witness fires), `rho = 1.2` gives min +10.89 on [-40, 40], and the direct
evaluation of `Xi'^2 - Xi Xi''` is positive on [9, 11.5].

**Consequences.**
- PR 42 §1 (the negative interval equals the open diameter) is exact only for an isolated pair. In general the
  witness interval is a subset of the diameter and can be empty.
- `L_1 >= 0` on the line is the `h -> 0` limit of `E_+ - E_-` (PR 42 §2, BRIDGE §3). So the boundary-energy
  inequality restricted to `h = 0` is strictly weaker than the interior inequality. Any argument that only
  establishes the `h -> 0` sign has not excluded off-line zeros.

**DH (MEASURED, `t3f.out`, `t3g.out`).**

| gamma | b | -2/b^2 | measured L_1/Xi^2 at foot | screening S | witness interval / b | vacancy model 1.870 rho-bar^2 |
|---|---|---|---|---|---|---|
| 85.6993 | 0.30852 | -21.012 | -20.159 | 0.853 | [-0.92, 0.92] | 0.844 |
| 114.1633 | 0.15083 | -87.913 | -86.935 | 0.978 | [-0.97, 0.97] | 0.964 |
| 166.4793 | 0.07436 | -361.741 | -360.649 | 1.092 | [-0.99, 0.99] | 1.13 |
| 176.7025 | 0.22426 | -39.768 | -38.483 | 1.285 | [-0.94, 0.93] | 1.16 |

Scan of the line, `t` in [1, 200], step 0.02: zeta has no negative sample (minimum 0.0464 at t = 1); DH is
negative exactly on four clusters [85.42, 85.98], [114.02, 114.30], [166.42, 166.54], [176.50, 176.90], each inside
`(gamma - b, gamma + b)`.

**Screening size (MODEL, not proved).** If the off-line pair replaces two on-line zeros of a locally equally
spaced sequence of density `rho-bar` (a vacancy), then `S = 2 rho-bar^2 sum_{k>=0} (k + 3/2)^{-2}
= (pi^2 - 8) rho-bar^2 = 1.870 rho-bar^2`. With the DH density `rho-bar = log(5T/2 pi)/(2 pi)` this reproduces the
four measured screening sums to within 1-10% (last column). Under the same model for zeta,
`rho-bar = log(T/2 pi)/(2 pi)`, the witness fires at the foot only if `b < 1.034/rho-bar`. At the verified height
T = 3e12, `rho-bar = 4.28`, so only pairs with `b < 0.24` would show on the axis; a pair with `0.24 < b < 1/2`
would leave `L_1 > 0`. The model is a heuristic; the unconditional content is Theorem B (ii) and (iii).

## 5. Channel guidance, torus/Klein loading, antibridge: what each adds

- **Zero channels (item 6).** A one-zero symmetric disk is a certificate, not a force. It exists around every
  simple on-line zero of DH as well. In the language of Theorem A, a channel certifies that no half-disk foot lies
  in its height range; it is verified height, cell by cell. The global statement needs a complete count
  (item 18), which is the wall.
- **Inverse-gap coupling (item 7).** `S > 0` and the Laplacian damping hold for every real-rooted
  configuration. They describe on-line dynamics once zeros are on the line and do not exclude off-line pairs.
  The screening sum `S` of Theorem B is the same quantity: neighbours hide an off-line pair from the axis; they
  do not prevent it.
- **Torus / Klein / sphere (items 1-4).** These are symmetry identities. The renderer's control `Q_{a,T}` keeps
  its off-line quartet on every quotient. Theorem A adds that the quartet's half-disk is carried along unchanged.
- **Antibridge (item 3).** `F'(1/2) = 0` and `F(1/2) != 0` hold for both functions.
- **Twin ladder (items 11, 19).** The only place the prime ladder enters a sign statement is item 19: the
  Euler product gives non-vanishing on Re s >= 1, which bounds every disk radius by 1/2. A second bound of the
  same type, the 7/8 half-plane, shrinks the radius to 3/8. Shrinking the radius to 0 is RH.

## 6. Verdict and next step

- Theorem A, A', B: PROVED (elementary given the classical Hadamard formula). They are global forms of the
  atlas §2 packet identity and PR 42 §1; no prior statement of B(iii) or of the firing criterion B(ii) was found
  in the atlas, PR 42, or the renderer docs. No literature search for prior publication was done.
- All renderer regularities are classified; none gives RH content beyond the zero-free region.
- Useful output for the program: a quantitative dictionary. Any zero-free improvement `Re rho <= 1/2 + b_0`
  becomes "the bridge of width `a >= b_0` is positive on the whole right half-plane" and "negative shear lives
  in disks of radius `b_0`". The PR 56 Schur/coupling norm for the bridge block at width `a` can therefore only
  exceed 1 because of pairs with `b > a`.
- Suggested next step: in the PR 56 block form, restrict tests to those supported at distance greater than
  `sqrt(b_0^2 - a^2)` from the line of feet and check whether the coupling norm bound `||T|| <= 1` follows from
  Theorem A' alone on that class; this would give an unconditional partial Schur inequality for `a` in (3/8, 1/2)
  conditional on the 7/8 input, and for `a >= 1/2` unconditionally.

## 7. Three weakest steps

1. **Step 1 for DH.** The Hadamard identity `Re F'/F = sum Re 1/(s - rho)` for `xi_DH` is taken from the
   standard order-1 argument, not re-derived line by line. The measured table (0 of 126 negatives outside the
   disks; foot values equal to `-2/b^2 + O(1)`) is consistent with it.
2. **Completeness of the DH off-line list below t = 200.** The four pairs are the published ones; I did not run
   an independent complete zero count. The grid found no negative sample outside their disks, which would be the
   signature of a missed pair with `b > 0.02` near a grid row, but a pair with very small `b` between grid rows
   would be missed.
3. **Screening model.** The `1.870 rho-bar^2` law and the `b < 0.24` visibility threshold at T = 3e12 are a
   lattice-with-vacancy heuristic fitted against four DH data points. They are not theorems. Numerical
   derivatives are finite differences in 160-bit Arb midpoints, not interval enclosures.

## 8. Files

- `lib.py`, `t1.py`: mpmath DH definition, functional equation and off-line zero check.
- `fl.py`: python-flint DH and xi evaluators, shear and axis Laguerre.
- `t2f.py`, `t2f_z.out`, `t2f_dh_a.out`, `t2f_dh_b.out`: shear grid, zeta and DH.
- `t3f.py`, `t3f.out`, `t3g.py`, `t3g.out`: axis witness, radial profiles, finite bridge, line scans. The last
  block of `t3f.out` contains three spurious negatives at t = 1, 64, 128 caused by asymmetric float rounding of
  `t +- h` at binade edges; `t3g.out` is the corrected scan with exact Arb offsets and supersedes it.
- `t4.py`, `t4.out`: screening control of Theorem B(iii).
