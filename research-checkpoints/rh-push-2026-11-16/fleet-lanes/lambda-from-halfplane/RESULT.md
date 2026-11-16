# lambda-from-halfplane: converting a zero-free half-plane Re s > theta into a bound on Lambda

Date 2026-11-16. Angle: find a conversion theta -> Lambda strictly better than the one in
`papers/lambda-qrh-0.116091/paper/main.tex`, or show that conversion is optimal for the information it uses.
Labels: PROVED / CLASSICAL / MEASURED / HEURISTIC / OPEN. Every Lambda value below is conditional on unrefereed
inputs (the half-plane, Raymond's construction, project certificates). The accepted bound is Lambda <= 0.2. RH is open.

## 0. Verdict

**Precise obstruction, plus one conditional number.**

1. No strictly better proved formula Lambda(theta) was obtained.
2. The value at theta = 0.874886647 is **Lambda <= 0.116060107834762** (PROVED given the half-plane at that theta and
   (H2)-(H4) of the paper; exact rational run, section 2). On Raymond's chain alone ((H2),(H3)): 0.118473587983093.
   The gain over theta = 7/8 is 3.14e-5.
3. Near 7/8 the conversion is affine in q0 = (2 theta - 1)^2 with an explicit slope (section 2):
   Lambda(theta) <= 0.116091488672439 - A * (9/16 - (2 theta - 1)^2) / (2 + 19.3 * (9/16 - (2 theta - 1)^2)),
   A = 0.184532 (MEASURED constant of the F2 run; the inequality itself is PROVED by monotonicity). dLambda/dtheta = 0.2768.
4. The existing chain already combines the three inputs the angle names (heat-flow zero attraction, verified height,
   half-plane). What it does not have is information on S = d/dy log|H_t| below the height where Dirichlet-series
   bounds work. Section 3 proves the rate ceiling of the method class and section 4 measures the remaining headroom:
   - kernels: lambda -> 2 on the floors F2 selected gives 0.115784 (headroom 3.1e-4) (MEASURED model);
   - positive probe measures at freely chosen heights, t = 0: start rate 11.95 against F2's 11.01 (+8.6%) (MEASURED LP);
   - signed probe measures with two-sided bounds, t = 0: 12.5 (+13%) (MEASURED LP, ill-conditioned);
   - single-probe positive chains at t = 0 cannot exceed c = 13.34 (PROVED ceiling, section 3);
   - mean-field pull (uniform real zeros of density D): c*q = 26.9*y, time 0.0425 for y0 = 3/4 (HEURISTIC benchmark).
   If a +13% rate held on every cell the value would be about 0.1096 (HEURISTIC model, not a claim).

## 1. Plan: what is new against the atlas and the walls

- Atlas section 12 (Newman Lambda) forbids silently claiming Lambda results from the spectral routes; nothing here does.
  This angle is an upper bound on Lambda, not an RH route. It gives no zero information.
- Walls: the argument is conditional on (H1); it fails for Davenport-Heilbronn (section 5). Flow-blindness and MV-CAP
  do not apply: the output is a positive-time statement and the floors are every-x statements obtained from absolute
  values of Dirichlet sums, not mean values. Verified height enters only through the wall (W).
- Not attempted again: improving theta itself (paper section 7, attempts A/B), re-tuning heights inside Raymond's
  producer (paper table 1).
- New here: (a) fixed-mode replay lemma and the exact value at 0.874886647; (b) far-field ceiling for the rate;
  (c) LP formulation of the conversion as a dual certificate, including signed probe measures with two-sided bounds.

## 2. Value at theta = 0.874886647

**Lemma R (fixed-mode replay). PROVED.** Let (q_k, c_k) be a run satisfying (C1)-(C6) of paper Theorem 4.2 for
abscissa theta, with no window floor. Let theta' <= theta and q0' = (2 theta' - 1)^2 + eps <= q0. Define q'_k by the
same enclosure recursion with the same modes and rates c_k. Then q'_k <= q_k for all k (the one-step map is increasing
in q, and upward rounding is monotone). Hence (C1) holds (v'_k <= v_k <= rho_k^2), the caps remain valid (a cap is a
supremum over [0, v]), (C3) holds by construction, and the floor entries and kernel rows are the same ones. If (S1)
holds at q0' and the terminal conditions (C5) hold at the first substep where the recursion drops to q_e, Theorem 4.2
applies and gives Lambda <= U'.

**Run. MEASURED (exact rational arithmetic), `replay.py`.** Input: the archived F2 per-substep dump
`tmp/qrh-tune-out/F2_final.steps.jsonl.gz` (59439 substeps; 0 window steps checked). Enclosures as in the consumer:
degree-18 Taylor bound for exp(-x), upward rounding to 2^-96, degree-11 alternating log bound, ceiling to 1e-15.

| theta | q0 - (2theta-1)^2 | U | terminal k | q'_k <= q_k all k | S1 margin |
|---|---|---|---|---|---|
| 7/8 (control) | 1e-7 | 116091488672439/10^15 = 0.116091488672439 (reproduces F2) | 59438 | yes | 1.8082e-8 |
| 874886647/10^9 | 1e-7 | 58030053917381/(5*10^14) = **0.116060107834762** | 59422 | yes | 1.8120e-8 |
| 87488665/10^8 (B = 0.87488665) | 1e-7 | 29015027166353/(2.5*10^14) = 0.116060108665412 | 59422 | yes | 1.8120e-8 |
| 8748866/10^7 | 1e-7 | 29015023705309/(2.5*10^14) = 0.116060094821236 | 59422 | yes | 1.8120e-8 |

Raymond's chain (his floors and kernels, start offset 2e-6; `tmp/oai-lambda-raymond.py`, output `raymond_theta.json`):
theta = 874886647/10^9 gives U = 118473587983093/10^15 = 0.118473587983093 (60659 substeps, end cell 473);
control 7/8 gives 0.118505710922701 (matches the paper).

**Affine sensitivity. PROVED form, MEASURED constants.** With fixed rates the barrier for start q0 - Delta is
beta(t) - Delta * E(t), E(t) = exp(-int_0^t c). For the F2 run int c dt = 1.689931, A = E(T) = 0.184532, mean rate
14.557, first rate 11.008, last rate 19.257. The terminal time moves earlier by at least
Delta * A / (2 + c_max * (Delta + q_e)). Check: Delta = 3.4000760e-4 gives 3.135e-5 from the formula, 3.138e-5 from
the exact run. dU/dtheta = 4(2theta-1)A/2 = 0.2768.

Status of the hypothesis: the abscissa 0.874886647 is the figure quoted in the brief for the follow-up preprints
(Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835). Those were not read or checked in this task.

Not used: a fresh run of `qrh-tune-consume.py` at this theta was started and came out mis-configured (the shell passed
the `--extra` list as one argument, so the extra height sets were dropped; value 0.117674). Its files were deleted.
A correctly configured re-optimised run can only be <= the replay value; the expected difference is below 1e-7.

## 3. What the conversion can and cannot use (proved statements)

Notation as in the paper: q = y^2 for the top zero, q' = -2 - 4y * sum' K_y(d_j, b_j) over the other conjugate pairs,
S(x,h,t) = sum_pairs K_h(x - x_j, b_j).

**P1 (half-plane alone is exactly de Bruijn). CLASSICAL.** For H(z) = z^2 + y0^2 the flow gives y(t)^2 = y0^2 - 2t.
So from "all zeros of H_0 lie in |Im z| <= 2theta-1" and nothing else, (2theta-1)^2/2 is sharp. Any gain needs a lower
bound on sum' K_y, that is, information on the other zeros.

**P2 (the half-plane enters only through q0). PROVED in the paper (Theorem 4.2, Remark 4.3).** The floors (J) and
kernels (K) read no zero locations at time 0. I looked for a second entry point and found none at this height:
- Harnack: u = Re xi'/xi is positive harmonic in Re s > theta, so u(sigma) >= ((sigma-theta)/(sigma1-theta)) u(sigma1)
  for theta < sigma < sigma1. This is the kernel inequality (K) with r = 0 and the worst zero on the boundary; it is
  not new information.
- Explicit-formula floors inside theta < sigma <= 1: a smoothed prime sum of length N approximates zeta'/zeta with
  error of order N^{-(sigma-theta)} log t, so N >= (log t)^{1/(sigma-theta)}, and the trivial bound on the prime sum
  is N^{1-sigma}/(1-sigma). This is below (1/2) log t only if sigma > (1+theta)/2 and log t is large. At
  t = 3e12 (log t = 28.7), sigma = 0.95, theta = 7/8: N ~ 1e19 and the prime sum bound is ~178 against a main term
  13.4. HEURISTIC order count; no floor below h = 1 results at the Platt-Trudgian height. Asymptotically in x the
  half-plane does give floors for h > theta (i.e. sigma > (1+theta)/2 = 15/16), but the chain needs x >= X uniformly.

**P3 (far-field ceiling). PROVED.** Let w_i >= 0 and suppose 2 K_y(d,b) >= sum_i w_i K_{h_i}(d - x_i, b) for all real d
and 0 <= b <= y (this is (K) for a general positive probe measure; Raymond's rows are w = lambda*y/h on two points).
Multiply by d^2 and let d -> infinity: K_y(d,b) d^2 -> 2y and K_h(d - x, b) d^2 -> 2h. Hence sum_i w_i h_i <= 2y.
The certified inequality is q' <= -2 - 2y sum_i w_i (l_i - own_i), so
  c = (2/y) sum_i w_i (l_i - own_i) <= 4 max_i (l_i - own_i)/h_i.
In Raymond's form this is lambda <= 2; the F2 run has lambda in [1.96, 2.0], so kernel work is exhausted:
replacing every lambda by 2 on the selected floors moves 0.116091 to 0.115784 (MEASURED float model).

**P4 (single-probe ceiling at t = 0). PROVED given CLASSICAL facts.** At t = 0, S(x,h,0) = (1/2) Re xi'/xi(sigma + ix/2),
sigma = (1+h)/2, and Re xi'/xi = (1/2) log(gamma/2pi) + Re zeta'/zeta + O(1/gamma). By almost periodicity
inf over gamma >= G of Re zeta'/zeta(sigma + i gamma) = zeta'/zeta(sigma) for every G (sigma > 1). So any floor valid for
all x >= X has l(h) <= L + (1/2) zeta'/zeta((1+h)/2) + o(1), L = (1/4) log(X/4pi) = 6.72294. With P3,
  c_0 <= 4 sup_{h>1} l(h)/h = 13.34 (attained at h = 1.54),
before the own-pair subtraction. F2 has c_0 = 11.008 at h = 1.88 with a two-probe joint floor l = 6.0012 (the
single-probe trivial floor at h = 1.88 is 5.8384).

**P5 (LP form of the conversion). PROVED as a statement; values MEASURED.** For any signed finite measure
w = sum w_i delta_{(x_i,h_i)} (symmetric in x) with pointwise domination 2K_y >= w*K on {b <= y} and w(1) >= 0,
  2 sum' K_y >= sum_i w_i (S(x*+x_i, h_i) - own_i) >= L w(1) - sum w_i own_i - (1/2) sum_n Lambda(n) |w^(n)|,
  w^(n) = sum_i w_i n^{-sigma_i} cos((x_i/2) log n)   (t = 0, sigma_i = (1+h_i)/2 > 1).
The second step is the triangle inequality on the Dirichlet series of zeta'/zeta; it is valid for signed w and uses
Lambda(n) >= 0 only through |Lambda(n)| = Lambda(n). The best conversion in this information class is the supremum of
the right side over w. The existing chain is the special case w >= 0 on two points. Signed w removes the far-field
constraint (sum w_i h_i <= 2y becomes a constraint on the net first moment) at the price of upper bounds on S.

## 4. Measured headroom (t = 0, y = 3/4, x = X)

`lp_joint.py` (probe grid 15 heights in [1.1, 9] x 17 offsets in [0, 6]; domination enforced on a (d,b) grid;
n <= 400 exact, tail by triangle inequality) and `lp_signed.py` (single-probe two-sided trivial bounds).
Rates are c = 2*OBJ/y. Not certified: the domination is checked on a grid only.

| class | start rate c_0 | note |
|---|---|---|
| F2 run (certified) | 11.008 | h = 1.88, r = 3/5, lambda = 1.9826 |
| positive, single-probe trivial floors, LP | 10.95 | optimum h = 2.46, x = 0 |
| positive, joint floors, LP | 11.95 | h = 1.55-1.70, x = 0.75-1.1 |
| signed, single-probe two-sided trivial bounds, LP | 11.96 | one positive probe h = 2.46, negative probes h = 1.8-8 |
| signed, joint, LP | 12.48 | weights of size 1e7 at h = 9: ill-conditioned, grid-exploiting |
| single-probe positive ceiling (P4) | 13.34 | proved |
| mean-field (uniform density) | 35.9 (c*q = 26.9 y) | not a bound |

Reading: at t = 0 the class {Dirichlet-series absolute-value bounds on sigma > 1} x {pointwise kernel domination}
is capped near c_0 = 12-13.3. F2 is at 11.0. The mean-field pull is three times larger and is out of reach of this
class, because S is controlled only at h > 1 and downward continuation of a positive measure's Poisson integral from
height h to height y < h loses the factor y/h in the worst case (far field) or (h^2 - y^2)/(2y^2) (cluster at the
same height, r = 0).

Uniform rate-scaling model on the F2 dump (HEURISTIC; assumes the t = 0 gain persists on all 465 cells):
x1.04 -> 0.11406, x1.086 -> 0.11183, x1.134 -> 0.10962, x1.21 (P4 ceiling ratio) -> 0.10634, x2 -> 0.08255, x3 -> 0.06585.
Mean-field ODE y' = -1/y - 2 pi D with 2 pi D = 13.446: time 0.04247 for y0 = 0.75, 0.04246 for y0 = 0.749773.

Along the F2 path the certified pull c*y falls from 8.26 (t = 0) to 0.80 (t = 0.115) against the constant mean-field
26.9: the method loses most at small y, where y/h is 0.05-0.2 because floors need h >= 0.9.

## 5. Davenport-Heilbronn control

The chain fails for the DH function at two places, both Euler-product inputs.
1. (H1): DH has zeros with Re s > 1, so there is no zero-free half-plane and no start below the classical strip;
   in fact its H_0 analogue is not confined to |Im z| <= 1.
2. Floors (J): at t = 0 the floor is L - (1/2) sum Lambda(n) n^{-sigma}. This is the Dirichlet series of the
   logarithmic derivative, which exists with nonnegative coefficients Lambda(n) because of the Euler product. For DH
   the logarithmic derivative has poles in sigma > 1, so S has no positive floor at the heights used
   (sigma = 1.44-1.59). The same holds for P5: the step "triangle inequality on zeta'/zeta" needs the Euler product.
P1 and P3 are statements about pair configurations and kernels and hold for any function.

## 6. Obstruction, stated precisely

To beat the LP optimum of section 4 one needs a lower bound for sum' K_y(d_j, b_j) at the top zero that is not a
consequence of bounds on S at heights h > 1 (t = 0) or h >= ~0.9 (t > 0). Equivalent forms:
- a lower bound for Re xi'/xi(sigma + i gamma) with sigma - 1/2 comparable to beta_0 - 1/2 at ordinates near an
  off-line zero; or
- an upper bound on gaps between consecutive zeros near an off-line zero at scale ~ 1/log gamma (no far-field or
  same-height cluster configuration).
The half-plane does not supply either at gamma ~ 3e12 (P2). Both are every-window statements inside the critical
strip, the type MV-CAP excludes from mean-value inputs.

## 7. Three weakest steps

1. The value 0.116060107834762 inherits every hypothesis of paper Theorem 1.1(ii) and adds the half-plane at
   0.874886647, which rests on preprints not read here. Lemma R itself is elementary, but my replay is a single
   implementation (it reproduces F2 exactly at 7/8, which checks the arithmetic, not the lemma).
2. The LP values (11.95, 11.96, 12.48) enforce kernel domination on a finite grid and are not certificates. The signed
   joint optimum has huge alternating weights and its value is not reliable beyond "between 12 and 13". No t > 0 LP was
   run; upper bounds on S(x,h,t) for t > 0 (needed for signed measures) do not exist as certified tables.
3. P4 uses inf Re zeta'/zeta = zeta'/zeta(sigma) on gamma >= G (classical almost periodicity) and ignores the joint
   (multi-probe) floors; it is a ceiling for single-probe positive chains only. The x-uniform model and the mean-field
   benchmark are heuristics.

## 8. Next step

The only lead with a proved framework is P5: a certified (interval, Bernstein-type) signed or lower-height positive
probe measure at small t, where the floors are classical. Expected gain if it extends to all cells: 0.002-0.006 in
Lambda (HEURISTIC). It needs (a) Raymond-type upper bounds on S(x,h,t) for t > 0, (b) certified domination for signed
kernels, (c) joint floors at h = 1.55-1.70, currently blocked by the producer's moment cap (paper section 5.2).

## Files

- `replay.py` fixed-mode replay and sensitivity (reads the F2 dump).
- `raymond_theta.json` Raymond's chain at theta = 874886647/10^9 and 7/8.
- `lp_joint.py`, `lp_signed.py` probe-measure LPs at t = 0 (need numpy/scipy/mpmath).
- `dump_scan.py` dump structure scan.
