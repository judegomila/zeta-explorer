# Fifty experimental routes (2026-10-06)

Built from the project's results to date. Each route says what it tries and why it is not one of the
closed classes (flow-blindness, NS-RIGID, Theorem U, T3 = strip, the 2026-09-23 stat-mech routes A–H,
Route I as a road past the verified-height crossover 2a = 7.76, mirror descent, local Levinson, paid
verification). Status vocabulary: PT Λ ≤ 0.2 is the accepted benchmark; project results are internal
only; RH open; no QED.

Tag: [Λ] moves the de Bruijn–Newman bound; [RH] RH-level input; [map] sharpens what is possible;
[tool] infrastructure.

## A. Λ upper bound, no money
1. [Λ] Finish route P: certify the remaining P47 late cells at margin ≤ 0.050 (round 7 full run, then referee) for a sub-0.145 value at PT height.
2. [Λ] Feed the lowered barrier floor (certified to 0.025 on 2026-10-06) into the Raymond/route-P architecture at early times; measure how much Λ drops when the band argument can start lower.
3. [Λ] Three-point correlated probes: Raymond's surplus terms cannot hit worst cases at two translations at once; extend to three or more translations.
4. [Λ] Sum-of-squares (Fejér–Riesz) certificate for the weak outer lemma on the outer torus, replacing box/cone bounds on P47.
5. [Λ] Many barriers: certify compact-slab barriers at several abscissas X_k (10-minute runs) and use them to split the band argument into more bands.
6. [Λ] Sparse verification theorem: which minimal set of local RH windows (62 CPU-s each with FLINT) can stand in for contiguous verification in Lemma B-type band arguments?
7. [Λ] Time-dependent mollifiers in the barrier and source floors (mollifier that changes with t).
8. [Λ] Hybrid schedule: Polymath fixed-time on one height band, Raymond decreasing barrier on another, joined by a certified barrier.
9. [Λ] Optimise the barrier schedule y(t) as a piecewise function with the exact consumer in the loop (gradient-free search, then certify the winner).
10. [tool] Formalise the core of Raymond's chain (G0) in Lean, starting with the C_g identity and Lemma R, to reduce dependence on external referees.

## B. Weil positivity and the Connes programme
11. [map] Multi-prime Toeplitz–Krein certificate past ln 3 (to ln 4, ln 5): a zero-free method that keeps working when the prime 3 enters.
12. [RH] Exact semilocal trace identity for S = {∞, 2, 3}; measure whether the remainder share falls as primes are added.
13. [RH] Positivity on lacunary or Müntz-incomplete test-function cones: the one loophole NS-RIGID leaves inside the native span (its A6 remark).
14. [map] Family Weil positivity: average over twists by Dirichlet characters, where symmetry-type averaging may make positivity provable at larger support.
15. [map] Euler-blindness radius for other same-gamma-factor twins (Epstein zeta functions with class number > 1), mapping at what support the Euler product is first detected.

## C. Proportion and mollifiers (the input NS-RIGID leaves open)
16. [RH] Reproduce the Alpöge–Furman ≥ 2/3 argument numerically and translate it into twin-ladder terms.
17. [map] Numerical sanity of longer mollifier lengths beyond θ = 4/7 (twisted second moments), at heights we can compute.
18. [map] Local Levinson conditional on pair correlation: how short a window becomes certifiable if Montgomery's conjecture is assumed.
19. [RH] Mollified Weil forms: combine a Levinson mollifier with Weil test functions in one quadratic form.

## D. Heat flow and the fluid picture
20. [Λ] Effective Ki–Kim–Lee: make "all but finitely many zeros of H_t are real" explicit with constants, to replace part of the verified-height input.
21. [map] Entropy-type Lyapunov functional for the zero flow (Burgers entropy inequality) beyond the pair law.
22. [Λ] Lehmer-pair hunt at large height to push the lower bound side (Λ ≥ −ε records).
23. [map] Compare H_t zero dynamics with Dyson Brownian motion on Odlyzko's high zeros, looking for arithmetic deviations.
24. [Λ] Mean-field descent with an improved local zero-count bound at t > 0, where the effective approximation controls the argument.

## E. Twin ladder and bridge model
25. [map] Bridge as scattering: Lax–Phillips / Pavlov–Faddeev picture for the modular surface; compute resonance motion under bridge deformations.
26. [map] Twin ladder for GL(2) L-functions where Ramanujan is known: find which ladder statements become provable there.
27. [RH] Function-field twin ladder: build the ladder for curves over F_q (RH proved) and identify the ladder property that encodes the Weil-conjecture proof; attempt the lift.
28. [map] Freeze calculus on the Selberg zeta function as a sandbox where an RH analogue holds.
29. [map] Interferometer visibility functional: test whether a finite-height visibility bound gives an RH-equivalent or a genuinely weaker statement.
30. [RH] Finite-support Euler detector: a ladder-native quantity that separates ζ from Davenport–Heilbronn at support below 3.44.

## F. Spectral and Hilbert–Pólya
31. [map] Berry–Keating xp with Connes or Sierra regularisations, tested against the first 10^5 zeros.
32. [map] Inverse spectral potential reproducing the zeros (Wu–Sprung type) and its regularity.
33. [map] Arithmetic corrections to random-matrix statistics (Bogomolny–Keating) on high zeros: detect the prime signal.
34. [map] de Branges canonical-system Hamiltonian for ξ computed numerically (Lagarias); study its mass positivity.
35. [map] Certified Li coefficients to large n, compared with Keiper–Li asymptotics.

## G. Cheap local computation
36. [map] Random local windows at heights 10^13–10^20 with FLINT's Platt code: exploratory search for anomalies.
37. [map] Gram-law violation statistics as a model of barrier difficulty at large height.
38. [Λ] Certify the barrier slab at higher X to test how the floor-lowering result scales with height.

## H. Formalisation and AI-assisted proof
39. [tool] Lean: Weil explicit formula plus small-support positivity (Yoshida).
40. [tool] Aristotle runs on the weak outer lemma and the band barriers BB1/BB2.
41. [tool] Lean checking of Arb certificates via certificate replay.

## I. Structural no-gos
42. [map] Formal MV-CAP theorem: mean-value inputs cannot certify every-window statements.
43. [map] Classify inputs by degree of flow-criticality; look for an intermediate class between soft and RH.
44. [map] Euler-detection depth against support across many conductors.

## J. Creative
45. [map] Multiplicative-chaos models of ζ on the line (Saksman–Webb) to predict source-floor tails.
46. [Λ] Kronecker floors as exact Bohr–Jessen extrema: for finitely many primes the torus supremum is deterministic, so compute it exactly instead of bounding it.
47. [Λ] Learned adversaries: train a surrogate to search for weak-outer-lemma violations and hard cells, guiding where certificates must be tight.
48. [map] Phase retrieval: how much of ζ is determined by |ζ| on vertical lines (the Hilbert-transform wall made quantitative).
49. [Λ] Unconditional S(T) constants via extremal (Beurling–Selberg) functions computed with our engines; better constants feed local zero counting and descent arguments.
50. [Λ] Verified-height-free Λ curve: Λ as a function of the constants in an effective Ki–Kim–Lee theorem.

## First picks
- Route 2 (barrier floor into route P): new lever found today, cheap to test.
- Route 1 (finish route P): closest to a sub-0.145 value.
- Route 46 (exact Kronecker floors): could close much of the 0.75 vs 0.53 gap in certified source floors.
- Route 27 (function-field ladder): the clearest RH-level experiment.
- Route 49 (unconditional S(T) constants): improves an input many routes use.
