# REFEREE pass: bridge-shear (2026-11-20)

Scripts and logs: `referee/` (a1_arb.py/a1.log first attempt with too-loose absolute tolerance, a2_arb.py/a2.log final,
a3_paired.py/a3.log, a4_misc.py/a4.log). All runs through `scripts/memcap.sh 8`, one process at a time (two briefly), total
compute about 15 minutes (one 10-minute Arb run with over-tight tolerances was killed and rerun).

## 1. What I re-ran (own code, different library or different points; not the first reviewer's scripts)

| check | method | result |
|---|---|---|
| omega_{a,h} moments 1 and a^2-h^2 | Arb `acb.integral`, 128 bits, (a,h) = (.5,.3), (.35,.2), (1,.9), cut at 30a | 0 within 5e-37 |
| Poisson reconstruction, zeta | Arb; W_h/h computed as i u'(ih)/(2h), u(z)=f(t-z)f(t+z), derivative by power-series arithmetic (no finite differences); new points (a,h,t) = (.5,.3,25.0109), (.35,.2,48), (1,.9,0), (.5,.45,100) | difference/|value| is a ball containing 0 of radius 3e-27 to 5e-27 (integral cut at 30a, tail ~e^{-94}, tail not enclosed) |
| same identity, Davenport-Heilbronn | Arb `dirichlet_char(5,2)`, zero 1 (b=.308517, g=85.6993) and a second zero not used by the first reviewer (b=.150830, g=114.1633); h = .6b, b-.01, b+.01, b+.12 | identity holds to 2e-23 relative at all 8 points; W_h < 0 for h < b and > 0 for h > b at both zeros (e.g. -3.2796e-58 / +3.4410e-58 either side of zero 1; -8.3122e-78 / +8.9608e-78 either side of zero 2) |
| smoke certificate 2x2 Gram (a=1/8, nodes i/4, 1/2+i/3) | own kernel formula in Arb | zeta: G11 = 0.000455967147516476, G12 = 0.000454000780473259 - 3.34625230807076e-6 i, eigenvalues 9.45606427443e-8 and 9.08128369775e-4. DH: eigenvalues 2.33713054027e-5 and 2.01329190815e-2. Matches the stored ball and the first reviewer |
| paired-coordinate formula for K_a | mpmath 22 digits, own psi series, three NEW node pairs (a=.25: .7+.4i, -1.2+.9i; a=.6: 9+.1i, 11.5+.05i; a=.05: 21+.3i, 21.1+.3i) | rel diff 5.7e-22, 5.2e-23, 7.6e-21 |
| retracted diagonal channel K_cmp vs K_a | same three pairs | ratio 1.375, 133.3, 5.10e7 |
| single-node (1x1) kernel value K_a(w,w), a=1/8 | mpmath; zeta vs DH | at w = i/4 both positive; at w = 85.6993+0.1i, 85.6993+0.15i, 114.1633+0.02i: zeta positive, DH negative (K/|E|^2 = -2.64, -11.1, -178) |
| theta pair product formula | by hand (algebra) | correct: with phi_n(u) = (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) the product is e^{2r} c^2 [4c^2 - 12 c cosh 4(s+delta) + 9] e^{-2c cosh 4(s+delta)} |
| half-disk statement | by hand | Re(F' conj F) = 2x(x^2+y^2+2 eps); correct and elementary |

Not re-run: the certifier package itself, verify-sign-switching.mjs, the observatory tests, the Lean build (no `.lake`
directory; toolchain v4.28.0; Mathlib not downloaded). I read the Lean statement list (grep: no sorry/axiom/native_decide).

## 2. Is "confirmed-weaker-statement" deserved?
Yes. The first reviewer's identity checks were written independently of the project code (their r1..r9 scripts), so they
are real verification, not a replay. Three items in their replay list ARE same-code-path replays and carry no independent
weight: the certifier re-run, `verify-sign-switching.mjs` (920 checks) and the 15 observatory tests. Their numbers for the
certificate, though, I reproduced with a separate formula in Arb.
I found no error in any identity. Every identity that I tested at new points held.

## 3. Where the first verdict should be corrected or sharpened
1. **Size of the retracted error.** "Up to four orders of magnitude / 1.4e4" is only the maximum over their four node pairs.
   At (a=.05, height 21) the ratio K_cmp/K_a is 5.1e7. The ratio is unbounded with height; the retracted reduction was not an
   approximation of the kernel in any sense.
2. **A finite Gram certificate with J > 1 nodes carries no information beyond the diagonal.** By de Branges' theorem the
   kernel K_E is positive semidefinite on the upper half-plane iff |E(z)| >= |E#(z)| there, i.e. iff every 1x1 value
   K(w,w) >= 0. So the RH-relevant content of any Gram test is the pointwise modulus inequality at the nodes (the
   Sondow-Dumitrescu monotonicity again). My 1x1 test shows this directly: one node placed under the DH zero is negative for
   DH; the shipped nodes near the origin are positive for both. The first reviewer observed the DH positivity of the smoke
   certificate but did not state this structural redundancy. It lowers the value of the "certifier" further.
3. **Literature attribution.** The theta-pair product with divisor phase N^{-ix/4} sigma_{ix/2}(N) and a K-Bessel transform is
   the Fourier expansion of the completed real-analytic Eisenstein series, i.e. the Mellin pair for xi(s+nu/2) xi(s-nu/2)
   (Koshliakov/Guinand-type formulas). The first reviewer labelled only the sine-product as classical. My search returned the
   Koshliakov-kernel literature (arXiv:1505.01552) but not a page stating the exact formula; I attribute it from standard
   knowledge, not from a located citation. Also relevant and not cited: P. R. Taylor (1945) for the a=1/2 case
   (xi(s+1/2) +- xi(s-1/2) has zeros on the line), Suzuki's shifted family E(z) = xi(1/2+omega-iz) with Hamiltonians indexed
   by omega, and Conrey-Li arXiv:math/9812166 (de Branges positivity conditions fail for zeta).
4. **Lagarias citation.** arXiv:math/0601653 exists and treats xi(s+a) +- xi(s-a) through a de Branges lemma; my search snippets
   did not show the sentence "for all a>0 iff RH". The unconditional a >= 1/2 statement and the RH-conditional 0<a<1/2
   statement are in that paper as I recall its abstract; the converse direction is immediate from the definition. Treat the
   "iff" as standard, not as a quoted theorem.
5. **Importance.** I lower it from 2 to 1. Nothing here constrains zeros, Lambda, or any constant; the positive content is
   classical in other variables, the negative content (retraction, rank-2 skewness, no blockwise positivity) corrects or
   closes project-internal lines. An expert would not need to know any of it.
6. **Arbitrariness.** Kept at 3, argued in both directions: the identities themselves are parameter-free (would score 1-2);
   the only numeric artifact, the 2x2 certificate, is entirely a choice of nodes and its verdict would be unchanged for a
   function violating RH (would score 5); the bundle, the "shear"/"bridge energy" names and the E_+/E_- split are framing.
7. **Not checked by either of us:** that the app route /sign-switching is present on the working branch (I found no reference
   in the working tree; the sources are on branch origin/codex/sign-switching-energy-2026-11-07), and that the Lean file
   compiles.

## 4. Literature searches I ran (6 general queries, web search only, no MathSciNet/zbMATH)
- de Branges structure function xi(s+a), Hermite-Biehler, Lagarias: found arXiv:math/0601653, Suzuki arXiv:2301.00421 and
  ar5iv 1907.07302 (shifted family, RH as positivity of Hamiltonians), Conrey-Li.
- modulus monotonicity: found Sondow-Dumitrescu arXiv:1005.1104, Matiyasevich-Saidak-Zvengrowski arXiv:1205.2773,
  arXiv:2201.08599, arXiv:2509.18963.
- strip Poisson kernel applied to f(x+ia)f(y-ia) for xi: nothing matching; related Poisson-kernel positivity criteria
  (arXiv:1804.10043) only.
- HB kernel positivity vs diagonal: standard definitions; Conrey-Li.
- Koshliakov / sigma_nu K-Bessel Mellin pair: Koshliakov-kernel papers, no exact match of the product formula.
- differenced L-functions: Lagarias paper located; P. R. Taylor's case mentioned in a secondary source.
Not found written down: the half-line weight omega_{a,h} with its moments, and the paired-coordinate double integral for K_a.
Both are a few lines from textbook objects (strip Poisson kernel; change of variables r=(u+v)/2, s=(v-u)/2). No novelty claim.

## 5. One-line statement
The first reviewer's line is accurate. I shortened it and removed nothing of substance.

## 6. Final scores
verification: confirmed-weaker-statement; novelty: known-in-different-form; arbitrariness 3; importance 1;
status: proved in notes, unrefereed.
