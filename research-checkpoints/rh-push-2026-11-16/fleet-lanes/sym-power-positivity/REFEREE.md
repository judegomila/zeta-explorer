# REFEREE: sym-power-positivity (2026-11-16)

Verdict on the write-up: **holds = false as written; holds after three one-line repairs.** The obstruction itself is
real for the class it describes (linear log-derivative positivity with pointwise non-negative prime coefficients).
No RH assumption found. No use of verified height. No zero-free region claimed.

## Errors and gaps in PROVED steps

**E1. Theorem A item 1 is false as stated (missing normalisation).** Setup allows any non-trivial unitary cuspidal pi
on GL(d)/Q and lists Hecke characters. pi = |.|^{i gamma} on GL(1) is unitary, cuspidal, non-trivial, and
L(s, pi) = zeta(s + i gamma) is not entire. Counterexample: PI = {pi, pi~}, w_{pi,-1} = w_{pi~,+1} = 1/2,
w_{1,+-1} = 1/2. Then c_w(n) = 1 + cos(gamma log n) >= 0 (admissible), but psi_w(theta) = cos(theta), not >= 0.
The proof step "L(s, pi) is entire" fails here. Repair: require central character trivial on R_{>0} (equivalently
exclude pi = |.|^{it}); then every step of the proof re-derives correctly:
- expansion of c_w(n) h(gamma log n): correct;
- residue sum_k h_{-k} w_{1,k} = (1/2pi) int h psi_w: correct;
- prime powers r >= 2 via Luo-Rudnick-Sarnak: sum_p log p * p^{-2(1/2 + 1/(d^2+1))} converges, correct;
- Jacquet-Shalika non-vanishing on Re s = 1 and Fejer localisation: correct.
The intended companions (Sym^m f non-CM, finite-order-normalised Hecke characters, Grossencharacters induced to GL(2))
satisfy the normalisation.

**E2. Item 3 / section 3 use an unproved cost rule for negative weights.** "For w < 0 ... costs at least as much" is
asserted, not proved, and is false for sigma - 1 >> 1/log gamma: the bound
Re zeta'/zeta(sigma + it) <= -zeta'/zeta(sigma) ~ 1/(sigma - 1) is cheaper than (1/2) log gamma there. Item 3 says
the supremum is over all non-negative cosine polynomials; section 3 then restricts to a_k >= 0 without justification.
Non-negative polynomials with a_1 > a_0 and only negative higher coefficients exist:
1 + 1.1 cos(theta) - 0.1 cos(3 theta) = 1 + 1.4 c - 0.4 c^3 >= 0 on [-1,1].
Repair (referee): bounding -|a_k| cos(k theta) by the trivial bound is the same as using
psi' = psi + |a_k|(1 + cos k theta) >= 0 with a_0' = a_0 + |a_k| and that coefficient removed, so negative
coefficients give nothing beyond the a_k >= 0 class under the trivial bound. Any non-trivial upper bound for
sum_rho Re 1/(s - rho) is outside the model. With this, R_inf over a_k >= 0 is the right quantity.

**E3. Section 6 PROVED line: the stated justification is wrong, the conclusion is right.** The claim
Cost(w) >= (1/2) sum_{k>=2} |a_k| log gamma depends on E2 and fails for negative a_k at sigma away from 1. The
detour is unnecessary: Cost(w) already contains the k = 1 term (a_1/2) log gamma with a_1 > 0, which tends to
infinity, so (1) is vacuous for 1 - beta >= 1/8 (indeed for 1 - beta >> 1/log gamma). The statement is true and
trivial.

**E4. Theorem B, "Theorem A ... applies to zeta_B, any Satake data may be attached".** Not supported. Theorem A's
proof uses entire continuation and non-vanishing on Re s = 1 of the companion L-functions; a Beurling system with
attached Satake data has neither. Theorem B is confirmed only for zeta-only arguments. The one PROVED line
(zeta_B(s) = kappa s/(s-1) + s int (N - kappa x) x^{-s-1} dx, bound C|s|/(sigma - theta) away from s = 1) is correct.
DMV statement matches my recollection of the abstract; not independently fetched.

## Numerics rerun (different cases; /tmp/ref-sympow/t.py, grid 20001, polynomial minimum checked on 400001 nodes)

| K | R(K) rerun | 2R | RESULT.md |
|---|---|---|---|
| 2 | 34.82051 (r = 4/3) | 69.641 | "34.82" stated; lp-results.json has Infinity |
| 4 | 17.449610 | 34.89922 | 17.4496 |
| 8 | 17.269957 | 34.53991 | 17.2700 |
| 16 | 17.248531 | 34.49706 | 17.2485 |
| 40 | 17.244224 | 34.48845 | 17.2442 |

- Minimum of the LP polynomials on the fine grid: about -4e-8 to -1e-7 (grid LP is a relaxation; values are lower
  bounds for V_K up to that slack). Uncertified, as the write-up says.
- K = 2 in lp-results.json is Infinity (bounded search started in the infeasible range r > 4/3). The 34.82 in the
  text is the hand value, not the run. Reporting defect only.
- Arestov-Kondrat'ev interval 34.468305 < V < 34.5035864 confirmed against Mossinghoff-Trudgian arXiv:1410.3926
  p.3 (1.3). Their Theorem 2: V < 34.4889920009. 2R(40) = 34.48845 is consistent with both. Kondrat'ev's degree-8
  polynomial gives 34.5445; LP K = 8 gives 34.5399, consistent.
- Projection test with new cases: signed companion weights at zero cost, groups T x SU(2) and T x T (unitary
  character chi^m, cos and sin parts), (K,M,r) = (6,5,1.6), (10,3,1.7), (5,7,1.55). Minimum equals the circle
  minimum to 3e-14 in all six runs (2.5755395474405, 3.2071514708472, 2.3714836247322).

## Controls

- DH: fails at step 1 (no Euler product, -L'/L coefficients not non-negative; also no pole at 1). Correct.
- RH not assumed. Verified height not used. No claim beyond de la Vallee Poussin.

## Minor inaccuracies

- "No bound better than convexity order near Re s = 1 for Sym^m" is loose: t-aspect subconvexity exists for GL(2),
  GL(3); what is missing is a Vinogradov-Korobov type bound. Does not affect the conclusion.
- de la Vallee Poussin's own constant was 30.4679 (MT Table 1); 34.82 is the plain 3-4-1 value in model (1).

## Is the obstruction an artifact of a weak attempt?

For the stated angle, no: Theorem A (repaired) kills every linear combination with pointwise non-negative prime
coefficients, at any companion cost >= 0. It does not cover:
1. Quadratic positivity over integers (|sum a_n n^{-s}|^2 mean values, mollified second moments, large-sieve /
   Halasz-Montgomery with companion coefficients). The 7/8 half-plane is of this type, not of type (1).
2. A proved link between zeta(rho_0) = 0 and companion zeros or small values near 1 + ik gamma (write-up's weakest
   step 1, ARGUED only). The pretentious heuristic L(s + i gamma, pi) ~ 1/L(s, pi) is not a proof.
3. Growth input: a Vinogradov-Korobov type bound enters through Landau's local method, outside model (1).
Route 1 is the one way around I would name.

## Surviving claim

With pi normalised (central character trivial on R_{>0}) and negative zeta weights bounded trivially: the zeta part
of any admissible combination is a non-negative cosine polynomial with the same a_0, a_1, so companions do not
change the constant R_inf (2R_inf in (34.468305, 34.4889920009]) or the shape c/log t obtainable from inequality
(1). Theorem B holds for zeta-only positivity arguments. Section 6 holds via the a_1 cost term.
