# REFEREE: hidden-square (second pass, 2026-11-21)

Verdict under review: first reviewer's "refuted / withdrawn or wrong", arbitrariness 5, importance 1.
Outcome: **the verdict stands.** I could not fault its numbers. I add one sharper witness, one tighter threshold figure, three corrections of emphasis, one extra app error, and two literature items the first pass missed.

## What I ran (own scripts in referee/, all under memcap 8 GB, about 2 minutes total)

Different code paths from the first reviewer on purpose: substitution x = e^{4u} for the moments, uniform midpoint grid plus power iteration for the operator norm (they used Gauss-Legendre Nystrom plus dense SVD), 1-D mpmath transforms at 30 digits for the kernel pieces (they used a 2-D float sum), Hurwitz-zeta root finding for the DH zero (they used the theta kernel).

| quantity | mine | first reviewer |
|---|---|---|
| G(0.5) | 4.673660097732962e-4 | 4.67366009773e-4 |
| G(31.6213) | 0.9999866068890327 | 0.999986606889032721 |
| G(31.6214) | 1.000014309651534 | 1.000014309651534 |
| G(34.05578) | 1.999997519205024 | 1.9999975 |
| root of G(a) = 1 | 31.6213483461 | not given |
| op-norm a = 0.5 (n = 48000) | 4.575677e-4 | 4.5756e-4 |
| op-norm 31.6213 | 0.9999814050 | 0.99998158 |
| op-norm 31.6214 | 1.0000091079 | 1.00000928 |
| op-norm 33 | 1.4740031 | 1.474 |
| op-norm crossing 1 (uncertified) | a = 31.621367 | lane float 31.621366 |
| scaling c = 7 | ratio 49.000000 | 9, 100, 2209 at c = 3, 10, 47 |
| DH zero | s0 = 0.808517182456637 + 85.6993484853776 i | same, mirrored |
| op-norm DH, a = 0.1, 0.3, 0.5, 0.6, 1, 5, 10 | 0.012296, 0.036919, 0.061633, 0.074044, 0.124228, 0.805695, 4.01213 | same to 5-6 digits |
| sign flip beyond 0.3 | norm identical to 17 digits | identical to 12 digits |

Decomposition (referee/ref2.py, 18 points of my own choosing, mpmath 30 digits, K = (K + K2)/2 + (K - K2)/2 with K2 the Wronskian kernel of int Phi sinh(au) cos(zu), int Phi cosh(au) sin(zu)):

- a = 0.3: K eig min -8e-37 (roundoff), main eig min -2.26e-7 against max 3.78e-5.
- a = 1: main eig min -7.43e-7 against max 1.27e-4.
- a = 3: main eig min -1.94e-6 against max 4.18e-4.
- K - K_diag: all eigenvalues <= 0 (max -3e-33 to -7e-32) at all three a. K_diag: PSD.
- **Single-point witness:** main(z, z) = -9.04e-8 at z = 26.5 + 5i, a = 0.5. A negative diagonal entry needs no eigenvalue computation and cannot be a conditioning artefact.

So error 5 of the first verdict is confirmed, by a different method and at 30 digits. The negative part of `main` is 30 orders above the working roundoff.

## (b) Is the first pass independent?

Partly. The scripts are their own, but the design (G bracket, test pair, DH control, sign gauge, homogeneity, factor-2 normalisation) repeats the 2026-11-16 lane and its REFEREE.md item for item. On those points the first pass is a third replay of one argument, not an independent attack. The only new content is the main / K_diag decomposition test. That one I re-derived separately and it holds.

The Arb certificate was not rerun by either of us. The bracket 31.6213 < a* < 31.6214 therefore rests on the lane's Arb run plus two float/mpmath replays; margins are 1.3e-5 and 4.4e-6, far above any quadrature error seen (my grids agree with theirs to 2e-7).

## Corrections and additions to the first verdict

1. **"||V|| <= 1 holds exactly for a <= a*" needs its hypothesis stated.** It uses monotonicity of the norm in a, which needs Phi >= 0 (kernel pointwise nonnegative and increasing in a). True for this Phi; should be said. Also G(a) = 1 at a = 31.6213483 and the float norm crosses 1 at about 31.621367, so the true a* is very likely in (31.62134, 31.62137); only the wider bracket is certified.
2. **Error 5 can be stated more strongly.** If `main` is not PSD, no positive measure mu with <c, main c> >= int P dmu exists at all, because P >= 0. So the measure-domination scheme of 26.3 cannot work with `main` as the passive part, whatever mu^pass is chosen; any passive core must be extracted differently. The draft itself (25.3) does not claim K = K_diag + shear; that false identity is only in the app data file (lines 13, 64-66, 155).
3. **A further app error not listed.** CollapseChainPage.jsx (route /collapse-chain) and the HonestCeilingBanner say the program "is RH-equivalent to one operator-norm statement: ||V_{a,Phi}|| <= 1 for every a > 0". That statement is false (fails for a >= 31.6214), so it is not RH-equivalent; read literally the sentence would assert RH is false. What is RH-equivalent is K_a >= 0 for all a (or the degree-0 replacement ||R|| <= 1, which is a restatement of it). The "refuted as a reduction" banner does not fix this wording.
4. **The seven-plus conjectures.** I read 15.1, 16.4, 16.6, 17.3, 18.1, 25.2, 25.3 in the draft. Each is stated there as RH-equivalent via Theorem 15.1, and the draft says so itself. 25.2 is the Kolmogorov factorisation of a PSD kernel (Moore-Aronszajn) and 25.3 with a residual L is satisfied trivially by T = 0 once K_a >= 0; the clause "constructed directly from Phi" is not a mathematical condition. So "reduction of seven conjectures to one" was never more than "seven phrasings of RH"; the first verdict lists four, the count is at least seven.
5. **Scope of "carries no zero information".** As the lane referee already noted, for Phi >= 0 the family of operators determines Phi^2, hence Phi. The correct statement is that the inequality ||V|| <= 1 does not separate zeta from DH and is not implied by or implying K_a >= 0; not that the operator family forgets Phi.

## (c) Literature (6 searches, 1 abstract fetch; still not exhaustive)

- Confirmed: Lagarias (Hermite-Biehler / de Branges structure functions from xi); Suzuki, canonical systems for xi(1/2 - omega - iz)/xi(1/2 + omega - iz), proven omega > 1, all omega > 0 an RH criterion (arXiv:1204.1827; also arXiv:1606.05726 for a Selberg-class version).
- Missed by the first pass: M. Suzuki, "Integral operators arising from the Riemann zeta function", arXiv:1907.07302 (Adv. Stud. Pure Math. 84, 2020), which introduces Volterra-type integral operators tied to the same shifted family. This is the nearest published analogue of "a Volterra operator attached to E_a".
- Missed by the first pass: M. B. Freedman, "Finite-core Volterra reductions for a Weyl-positive Riemann phase kernel", arXiv:2606.29555 (June 2026, unrefereed, abstract only read). It starts from the same Phi, reports that several natural factorisations fail, and states that it does not prove RH. A search summary attributed to it a contraction target of the form ||A^{-1/2} B A^{-1/2}|| <= 1; I did not confirm that in the text. If so, it is the same degree-0 shape as the repo's replacement target.
- Hermite / Krein Bezoutian criteria for the Hermite-Biehler class: classical, found only as background.
- Not found: the specific L^2 operator with kernel Phi(t)Phi(s) sinh(a(t-s)) or the number 31.62. Nothing in Weil / Li / Nyman-Beurling / Connes / Polymath 15 literature corresponds to it; I did not expect any, since the statement is false as a criterion.

## (d) Scores

- **Arbitrariness 5: agreed.** Attack in the other direction: the RH-equivalent core (K_a >= 0 for all a) is canonical (would be 1), and the homogeneity / gauge obstruction is choice-free. But neither is the listed claim; the listed claim's truth value is set by the scale of Phi and the choice of L^2. 5 stands.
- **Importance 1: agreed.** A specialist would shrug: the positive content is de Branges plus Lagarias, and the refutation is one line (degree 2 against degree 0). The only residual value is internal: the route is closed and the page text should say so.

## (e) One-line

The first reviewer's line is accurate. I add "in the repository's normalisation" because 31.62 has no meaning outside it, and replace "carries no information about zeta zeros" by the narrower established statement.

## Files

referee/ref1.py, ref1.out (moments, operator norm, crossing); referee/ref2.py, ref2.out (decomposition, single-point witness); referee/ref3.py, ref3.out (DH, sign flip).
