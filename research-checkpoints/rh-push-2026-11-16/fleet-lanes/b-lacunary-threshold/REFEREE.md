# REFEREE: b-lacunary-threshold (adversarial pass, 2026-11-16)

Verdict: holds, with corrections. No PROVED step in the claimed list failed. Four statements need rewording; the
measured law survives three new heights but is narrower in evidence than stated. No RH assumption found; verified
height is not restated as new; nothing proves positivity for xi.

Scratch scripts for this pass: /tmp/ref-blt/{t.py,u.py,v.py,dh2.py} (not part of the deliverable).

## 1. PROVED steps, re-derived

- Lemma 1/2, Theorem BT: confirmed. Z_- = -conj Z_+ makes the Z_- and Z_+ sums of L_C equal, so
  Re L_C >= 2 sum_{Z_+} Re 1/(w + conj rho). B/((w-rho)(w+conj rho)) = (B/b_rho)/(w+conj rho)^2, hence
  |B D| <= Re L_C and in fact |B L| <= 2|L_C|; the stated constant 3 is valid, not sharp. xi(1/2+w) is even of
  order 1, so genus 0 in w^2 and F'/F = sum 1/(w-rho) with no linear term: class E membership holds.
- Theorem M: confirmed (Pick + Harnack normal family; phi = B(G - L) in N(Pi); Blaschke condition for N(Pi) is
  sum Re w/(1+|w|^2) via the Cayley map). Uncountable Lambda: pass to a countable non-Blaschke subset.
- M2: confirmed. Note it does not need BT: the union of the cones is dense in [1, inf), so the identity theorem
  suffices. Route 13 already had the interval version (its A5); the new part is the continuity limit only.
- M4: Blaschke product identity confirmed (it equals sinh((w-a)c/2)/sinh((w+a)c/2), c = log p, exactly). The
  equivalence is correct but for a simpler reason than stated: node spacing 2 pi/log p -> 0, so the union over any
  infinite set of primes is dense on the line Re w = a and has accumulation points inside Pi. The identity theorem
  gives the result; divergence of sum log p is not the operative fact, and "all primes" can be replaced by any
  infinite set of primes. The statement carries no arithmetic content (consistent with the note's own conclusion).
- Proposition S: confirmed given the route-13 certificate. Re-derived: gamma^2 - lambda = delta^2 + 2 i gamma delta;
  max nu/(nu^2+gamma^2)^2 = 0.32476/gamma^3 at nu = gamma/sqrt 3; sup|E| <= 2.5987e-6; S = 4.532372 and
  c(1) = 0.04613593 recomputed (mpmath, 30 digits); ||N_E|| <= 2.5527e-4 < 3.6346e-4. Monotone c follows from
  log-convexity of xi on the real axis (unconditional). Float inputs S and c(1) are not interval-certified; the
  margin is 30 percent, so this is benign but should be listed.

## 2. Errors and overstatements

1. M1, last clause: "any real sequence with sum 1/nu_k = infinity" is false as written. nu_k = k^{-2} has
   sum 1/nu_k = infinity but sum nu/(1+nu^2) < infinity (Blaschke; nodes accumulate at the boundary point 0), so
   Theorem M does not apply. Same for "k^p with p <= 1" when p < -1. Repair: require nu_k >= 1 (or bounded away
   from 0), or state the hypothesis as sum nu_k/(1+nu_k^2) = infinity.
2. Table rows "< 1.7e-5 (bisection floor)" (gamma = 30, m = 6, 7, 8): the reported number is the midpoint of the
   last bracket [0, 3.4e-5], not an upper bound. Interval LDL at 900 digits gives delta* = 2.203e-5 for m = 6
   (truncation nu_K = gamma e^12), which is above 1.7e-5. Correct statement: delta* < 3.4e-5 (m = 6), < 2.9e-5,
   < 2.5e-5.
3. Section 5 reading 3: the unconditional Schwarz-Pick inequality has denominator Re w - 1/2 = sigma - 1, but the
   displayed inequality and "(1/2a) log t" use a = Re w. With the correct denominator the unconditional inequality
   is automatic once log t >~ 4/(sigma - 1), not C/(sigma - 1)^2; the (sigma - 1)^2 log t region belongs to the
   RH-conditional version (denominator Re w). The two were conflated. ARGUED text only; no theorem depends on it.
4. "MEASURED (gamma <= 300)": no row at gamma = 300 has r < 2.9, so gamma = 300 gives no information on r_c. The
   bracket rests on gamma = 30 and 100 only (plus my rows below).
5. Reading 1 ("delta* is a function of r to first approximation") is not supported: at r ~ 0.54, delta* = 0.541
   (gamma = 30), 0.191 (40.9), 0.151 (50, r = 0.52), 9.4e-5 (100). Four orders of magnitude at fixed r. Only the
   crossing of delta* = 1/2 is confined to a band.
6. Route 13's own horizon for m = 6 (T = 60.1) corresponds to r = 0.79, outside [0.5, 0.7]. Route 13 used a
   different model (existing zero displaced), so r_c is model-dependent; the note says its law "replaces" T h ~ 7
   without recording this.
7. "Prime-side certificate costs more than T^3" is a cost estimate for one scheme (dense matrix, full-precision
   entries), not a lower bound over certificates. Keep the label ARGUED and name the scheme.
8. detect.py and section 3 say c(nu) is computed "from the prime side"; the code calls mp.zeta. The LDL is midpoint
   arithmetic (stated). Neither changes a number.
9. "DH fails a two-node test at its zero" is true for the zero at 0.8085 + 85.699i only. Same test (a = 0.55,
   spacing 0.2 centred on the ordinate) at other DH off-line zeros: 114.163 (delta = 0.151): +2.9e-3, not
   detected; 166.479 (delta = 0.074): +6.7e-3, not detected; 176.702 (delta = 0.224): -2.2e-3, detected.

## 3. Independent reruns (different cases)

Fully interval LDL in Arb (no midpoint replacement; 700 to 900 digits so the balls stay tight), nodes 2^{k/m},
nu_K = gamma e^12, delta scanned on 23 points from 1e-6 to 400 before bisection. Inputs c(nu) are mpmath values
rounded at working precision, so still MEASURED.

| gamma | m | r | delta* | note |
|---|---|---|---|---|
| 30 | 2, 3, 4, 5 | 0.82, 0.55, 0.41, 0.33 | 4.116, 0.5413, 0.1608, 0.01219 | reproduces the note |
| 30 | 6 | 0.27 | 2.203e-5 | note says < 1.7e-5 |
| 40.9 (on a zero) | 2, 3, 4, 5, 6 | 1.35, 0.90, 0.67, 0.54, 0.45 | 9.44, 3.21, 1.29, 0.191, 0.0115 | new |
| 50 | 2, 3, 4, 5, 6, 7 | 1.82, 1.21, 0.91, 0.73, 0.61, 0.52 | 13.5, 5.78, 3.18, 1.92, 0.692, 0.151 | new |
| 60 | 7 | 0.68 | 0.739 | new |
| 70 | 2, 3, 4, 5, 6 | 2.96, 1.98, 1.48, 1.19, 0.99 | 24.6, 13.3, 8.04, 5.07, 3.42 | new |

- Pass/fail was monotone in delta in every scan; the twin at delta = 0 is positive in every case (as it must be).
- Crossing of delta* = 1/2: gamma = 40.9 in (0.54, 0.67); 50 in (0.52, 0.61); 60 below 0.68. All inside [0.5, 0.7].
- gamma = 100, m = 18 (the row with the abrupt drop): rerun with midpoint LDL at 500 and 700 digits, identical to
  all printed digits: positive at delta = 0, 2e-5, 7e-5; negative at 1.2e-4 and above. The row stands.
- DH: ctrl2.py, ctrl.py, dh_real.py had no saved output; rerun, all table values reproduce. New sparse real cones:
  1.5^k (k <= 30) DH 4.1e-12 > 0, 1.25^k (k <= 45) DH 8.1e-27 > 0 (xi 7.2e-18, 1.3e-37). DH passes; finite
  sections only.

## 4. Walls

- DH: BT and M apply to DH (even, real, order 1, zeros in a strip wider than 1/2); they are equivalences, so they
  are DH-consistent. No step claims an Euler-product input.
- RH is not assumed anywhere. Proposition S depends on the route-13 certificate, which is unconditional.
- Extrapolation from gamma <= 100 to 3e12 remains the weakest link, as the note says.

## 5. What survives

BT, M, M2, M4, S as stated (M4 and M2 via the identity theorem alone; BT is needed only for discrete non-Blaschke
sets such as the integers). The band r_c in [0.5, 0.7] for the added-quadruple model at gamma = 30, 40.9, 50, 60,
100. The horizon and cost figures are extrapolations. No bound changes; RH open.
