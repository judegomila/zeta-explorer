
## 5. Lorentzian test (CERTIFIED signs; `lor.py`, `lor.out`)

The generating polynomial of the form on classes C_1..C_N is `f(x) = sum_{a,b} <C_a,C_b> x_a x_b`, of degree 2. The
Brändén-Huh definition for degree d asks for non-negative coefficients, M-convex support, and at most one positive
eigenvalue for the Hessian of every partial derivative of order d-2. For d = 2 the only such derivative is f itself, so
the test is: (i) all entries >= 0, (ii) M-convex support, (iii) at most one positive eigenvalue. (iii) is the inertia
already certified; (i) and (ii) depend on the basis. A higher-degree polynomial attached to the form (powers or products
of f with linear forms) is Lorentzian whenever f is, by closure under products, so it tests nothing more. The sibling
lane tested the Euler-product polynomials in variables z_p (Lorentzian for zeta and equally for E_a, T-NR, TW+).

48 cases, full Gram matrix including the fibre classes, entry signs and inertia certified at 50 digits: uniform
h = 0.1 (n = 8, 14) and h = 0.03 (n = 10, 40); prime powers <= 16 and <= 50 with s = 0.05; objects zeta, DH, tw-_2,
tw+_2, liouville, drop2, EA_0.2, EA_0.01.

| Case | (i) coefficients | (ii) support | (iii) positive eigenvalues | Lorentzian |
|---|---|---|---|---|
| zeta, h = 0.1, n = 8 and 14 | all >= 0 (two exact zeros: H.H, V.V) | M-convex | 1 | yes, as given |
| zeta, h = 0.03 (n = 10, 40); prime powers <= 16, <= 50 | negative: the diagonal D_j.D_j and near neighbours (19, 79, 11, 25 entries) | M-convex | 1 | not as given; yes after D_j -> D_j + 0.1(H+V) |
| tw-_2, tw+_2, liouville, drop2 at h = 0.03, n = 10 (cutoff 0.27, below their first failure at 0.66) | as zeta | M-convex | 1 | yes after the same shift |
| the same controls at every larger size tested | as zeta or with more negative entries | M-convex | 3 to 10 | no |
| EA_0.2, EA_0.01 | >= 0 at h = 0.1 | not M-convex (8 exact zeros among the four fibre classes) | 2 to 9 (baseline 2) | no |
| DH | negative entries, no fibre class to shift by | M-convex | 0 (below its first failure) | no (the statement for DH is "no positive eigenvalue") |

Outcome. The shift D_j -> D_j + a(H+V) is a change of basis, so it does not change (iii); it always repairs (i) for
large a. Hence "Lorentzian in some nef-shifted basis" is equivalent to the inertia statement, for zeta and for every
control. The Lorentzian property of the quadratic polynomial carries no information beyond the certified inertia.
Function field: the same holds; the self-intersections G_k.G_k = q^k(2-2g) are negative for g = 2 and the shift
G_k + a(H+V) repairs the signs.

## 6. Is this more than verified height in another form?

No. Reasons, each tied to a table.

1. **Each table is a finite set of strict inequalities in Gaussian-weighted zero sums.** `Z(d) = sum c0 e^{-v t^2/2} e^{itd}`;
   a zero at height gamma enters every entry with weight at most `c0 e^{-v(gamma^2 - 1/4)/2} e^{c/2}`. With the smallest
   certified pivot of a table this gives a height T beyond which no zero, on or off the line, can change any certified
   sign (column "height horizon" of section 3.1; ARGUED from the weight bound, not enclosed as a perturbation theorem).
   The largest value is about __ZT__ (h = 0.0025, n = 4000). Verified height is 3e12. The tables are implied by RH below
   that height and say nothing above it.
2. **Finite stages are open conditions.** Backward heat with -0.1 <= t < 0 passes every stage up to cutoff 12.6
   (MEASURED, section 3.4); at t = -0.15, -0.2 the first failure moves in to 11.8 and 9.4. For every size there is a
   t < 0 that passes, and the conclusion is false for every t < 0. So no statement of the form "inertia (1, n+1) at
   size n" for any fixed n, or any family of sizes reached here, is specific to zeta.
3. **The first-failure law is a bandwidth count.** DH fails at window length c* = 3.53 to 3.57 on every grid with
   pi/h > 85.7 and r = 0.75, at dimension n* = c*/h + 1 from 120 (h = 0.03) to 1427 (h = 0.0025). The dimension is not an
   invariant; the window is. A window of length c and band [-T, T] has about cT/pi degrees of freedom; at c* and
   T = 85.7 that is 97, against 86 real points (43 on-line ordinates and their negatives; count from the sibling lane)
   in front of the first off-line zero. On under-resolving grids (pi/h < 85.7) failures still occur through aliasing,
   at smaller dimension and longer window: the smallest dimension found is 68 (h = 0.075, r = 0.4, c* = 5.02), against
   Pick order 149. So "order of first failure" depends on the test family by more than a factor of 20 (68 to 1427),
   and the comparison with 149 has no intrinsic content. ARGUED for the count, CERTIFIED for the table.
4. **Arithmetic changes are seen exactly where they are, and nowhere earlier.** A change of Lambda at the prime p is
   detected at cutoff log p up to the width of the bumps (section 3.3), for p from 2 to 100003. A finite table with
   cutoff c is blind to every prime above e^{c+R}. This is the locality of the explicit formula, not a constraint on
   the primes.
5. **No structural reason appeared.** In the function-field calibration the signature is forced by a finite rank
   (2g+2) and by Riemann-Roch on the surface; the zeta matrices have full rank at every size, their smallest pivots
   decay without a visible floor (1e-7 to 1e-170 in section 3.1; the sibling lane's margin table and row P2 give the
   infimum 0), and nothing in the computation distinguishes the zeta table from the heat tables with small |t|
   except the sign pattern itself.

What would count as structural, and was not found: a rank bound, a recursion that terminates, or a lower bound on
pivots uniform in the cutoff. None is present in the data; the pivot sequences are stored in the JSON files
(`log10_abs_pivot`) for anyone who wants to look for a law.

## 7. What ran on the box

All launches through `~/rh-push/bin/rhrun`, in `~/rh-push/box-hodge-signature/`, CPU only (no GPU job). Stops only with
`systemctl --user stop <own unit>`. No pkill/kill by name, no process outside these units touched.

__UNITS__

Incident (own unit only). `rh-bhs-q3` was terminated by its own cgroup memory limit (45 GB) at 10:51:58 UTC, 9 min 39 s
after launch. Cause: I had set the scheduler's memory estimates of the DH grid-scan tasks to 0.01 GB to unblock the
queue; ten scan tasks with width ratio 1.25 and h >= 0.145 then each built a dense DH weight table of 1e7 or more
entries (the proved tail exponent g = 2 with wide bumps makes the table limit large). The limit contained it: slice
memory after the kill was 4 GB, machine available memory 211 GB, no other unit affected. Response, following rule 5:
the problem was reduced, not the limit raised. `bh.py` now computes the planned table size before allocating and
refuses above 3e6 entries; the affected scan cells (r = 1.25, h >= 0.145) are reported as not run; the relaunched
queue carried real estimates and a 40 GB cap.

Local runs (Mac): development and validation only, all through `scripts/memcap.sh` with caps 2 to 7 GB, each under
2 minutes: `test_validate.py`, `test_cert.py`, `ff.py 12`, `lor.py`, small `run_u.py`, `run_pp.py`, `heat.py`,
`run_big.py` checks.

## 8. Three weakest steps

1. **Backward heat entries are not enclosed.** The contour quadrature has no proved error bound; the radius is 100
   times the difference of two contours plus 10^-digits. The t = 0 table agrees with the certified prime side
   (__HEATCHK__), which tests the code, not the t < 0 tables. A zero of H_t to the right of both contours with
   non-negligible Gaussian weight would be missed; the two-contour agreement at the 1e-55 level makes that unlikely
   for the listed t, but it is not excluded by proof.
2. **The height horizon is an estimate.** It bounds the size of a single zero's contribution to the entries and
   compares it with the smallest pivot. The Gram matrices are ill-conditioned, so a perturbation of that size is not
   proved to leave the signs unchanged. The qualitative statement (tables see only heights of order 1e3) does not
   depend on the constant.
3. **Coverage of the claim "every control fails at a size set by where it differs".** It is a summary of the tables,
   for the controls and grids run. E_a with a <= 0.002 at h = 0.1 fails only at cutoff 2.8, and DH on grids with
   h >= 0.13 did not fail within cutoff 9; for those cells the first failure lies beyond what was computed or does
   not exist on that grid. T-NR and Beurling were not run here.

Also: one wrong "certified" line was produced before the rounding defect of section 2.3 was fixed. It was caught
because zeta appeared to fail at low height, which contradicts verified height. A defect of the same kind that
produced a plausible answer would not have been caught that way. Mitigation: the uniform family passes no data
through strings; `run_big.py` adds the rounding to the radius; at n = 134 three independent routes (ball LDL, ball
Levinson, the certificate) agree; the calibration returns the known signature.

## 9. Files

- `bh.py` library (entries with radii, Levinson/LDL midpoints, `certify`); `run_u.py` uniform family; `run_big.py`
  uniform family with parallel prime sum and segment checkpoints; `run_pp.py` prime-power family; `heat.py`
  backward heat; `ff.py` function-field calibration; `lor.py` Lorentzian test; `runq.py` memory-aware queue;
  `genq.py`, `queue*.txt`, `tasks_*.txt` task lists; `tables.py` table builder.
- `box/out_u`, `box/out_big`, `box/out_dh`, `box/out_scan`, `box/out_pp2`, `box/out_heat`, `box/out_heat_chk`:
  one JSON per run (inertia, positive stages, log10 of every pivot, entry radius, timings, peak RSS).
  `box/ff_box.out`, `ff.out`, `lor.out`: calibration and Lorentzian outputs.
