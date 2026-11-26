# REFEREE pass: c-glob (2026-11-20)

Outcome: the first reviewer's verdict stands (confirmed; arbitrariness 3; importance 1). Three small corrections to wording, listed at the end.

## What I ran (referee/ref.py, via memcap.sh 8, .venv-arb python; output referee/ref_out.json)
Code written from scratch; it does not import the reviewer's scripts or the repo module. Parts A, D do not use the digamma formula at all.
- A. Finite half-lattice onsets from the direct N-body force (float64), L = 500..8000, then Richardson extrapolation in 1/L^2:
  0.8980208890676, 0.8980208882006, 0.8980208880918, 0.8980208880782. Differences from the digamma root: 9.9e-10, 1.2e-10, 1.6e-11, 1.9e-12.
  The limit of the direct-force onsets agrees with the claimed root to 11-12 digits without using the closed form.
- B. Direct rate of the half-lattice minus R(rho) at rho = 0.2, 0.5, 0.8, 0.898, 0.95: L=1000: -3.0e-5 .. -2.2e-6; L=8000: -4.7e-7 .. -3.4e-8
  (factor 64 for factor 8 in L, i.e. 1/L^2, always from below).
- C. Adversarial search with the hypothesis built into the parametrisation (every gap = g + exp(t), L-BFGS-B, up to 26 points, 6 values of rho,
  5 shapes x 3 starts): largest (rate - R) found -4.4e-3 .. -2.4e-2, never positive. 100000 random admissible configurations: 0 violations, max -1.6e-2.
- D. Actual ODE integration (solve_ivp, rtol 1e-11) of the L=200 half-lattice: rho0 = 0.890 -> 0.889958, 0.889914, 0.889870, 0.889824 (falls);
  rho0 = 0.905 -> 0.905036, 0.905071, 0.905106, 0.905140 (rises). Consistent with onset_200 = c_half + 0.226/200^2 = 0.898027.
- Root by mpmath findroot at 40 dps: 0.8980208880762338427581307899493526407962.
- By hand: re-derived the lone-neighbour core Phi0, the per-particle left and right contributions, the partial-fraction telescope
  (2/r_k - 2/r_{k+1} telescopes to 2; the remainder is -2[psi(1+2/rho) - psi(1+1/rho)]), and R' >= (4 - 2 psi'(2))/rho^2 = 2.71/rho^2. All agree with the module.

## Is "confirmed" deserved
Yes. The reviewer did not replay the repo's JS assertions: they used mpmath/Arb, a hand derivation and their own N-body code. My pass adds a
third code path and a digamma-free route to the constant (A) plus a time-integration check (D). The proof is four elementary steps and I found no gap.
The thing confirmed is the statement WITH the minimal-gap hypothesis; the listed claim text omits it, so strictly the popular wording is stronger than what holds.

## Literature (4 searches of my own)
Queries: Lehmer pair / backward heat flow / gap ratio / digamma / arithmetic progression; Calogero-Moser and log-gas deterministic flow minimal-gap lemma;
the decimal string 0.89802088 with digamma; Csordas-Smith-Varga 4/5 criterion, Stopple, Dobner.
Found: Csordas-Smith-Varga (Constr. Approx. 10, 1994) and Csordas-Odlyzko-Smith-Varga (ETNA 1, 1993), Lehmer-pair criterion Delta^2 g < 4/5 with an
inverse-square environment sum, same ODE; Stopple, Lehmer pairs revisited (arXiv:1508.05870); Rodgers-Tao (Forum Math. Pi 2020), local relaxation to
arithmetic progressions; OEIS digamma-root entries (none equal to this number). No source has the ratio g/d_1, the bound R, or the number.
"Not found" is the correct label; the search was shallow (8 queries across both passes), and the result is a short exercise that would not normally be published,
so absence is weak evidence. The classical-name list in the brief (Weil, Li, Nyman-Beurling, Connes, Pick, Toeplitz, Krein) is not relevant: the statement has no zeta content.

## Scores
- Arbitrariness 3 (unchanged). Downward pressure: once (rho = g/d_1, all gaps >= g) is fixed the constant is forced, sharp, parameter-free. Upward pressure:
  the definition is a project choice and the reviewer's kappa-family (0.748..0.932) and hypothesis-dropped test (infimum 0) show the number is specific to it;
  the Lehmer-pair literature uses a different isolation measure. 3 is the right middle.
- Importance 1 (unchanged). No arithmetic input, no bound on Lambda, not a restatement of RH or of any classical equivalence; it constrains only an internal
  basin hypothesis, and the hard part (pair losing minimality, R1) is untouched. An expert would shrug.

## Corrections to the first verdict
1. Sharpness range: "for each rho > c_half" should read "for each rho in (c_half, 1)"; rho > 1 is excluded by the hypothesis.
2. At the extremiser the two neighbours tie at distance d_1, so "d rho/ds > 0" there means the forward (upper Dini) derivative; perturbing the lattice
   outward by epsilon removes the tie and gives an ordinary derivative (my D run does this with 1e-9).
3. "Strict for finite configurations" is correct, but the statement is instantaneous: it is a sign law at one time, not a persistence theorem.
   The one-line should say "at that instant" or "while the pair remains the smallest gap".
Site wording issues (a)-(d) raised by the reviewer are confirmed: OpenFrontierPage.jsx line 2660 defines c_glob with no minimal-gap hypothesis;
"transcendental" and "EXACT closed form" appear in the module header without proof of transcendence.
