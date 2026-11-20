# REFEREE: n2-kloss-sdp-certificate

Adversarial referee (general), 2026-11-17. No ssh. Every run through `scripts/memcap.sh 8`, single process, each
under 10 s (one planned at 7.66 GB was refused by the lane's own 4 GB guard and not run). Scratch copies of
`gram.py`, `sdp.py` and my check scripts are in `/tmp/ref-n2-kloss/`; nothing else in the repo was written.

**Verdict: the claimed verdict (partial result) holds, with one attribution error (E1) and four label/presentation
corrections (E2 to E5).** Both PROVED steps are confirmed. All headline numbers are reproduced from the stored
files and on four new cases. No statement about zeros is made, no RH/GRH in a PROVED line, verified height is not
used, no abscissa moves. Conjecture WLS is OPEN and nothing in the note is evidence for it beyond fixed-scale
float64 measurements in a reduced model. RH open.

## Errors

**E1 (attribution, sections 6.1 and 8; measured by me). "WLS is a statement about the quadratic twist" is not
supported by the lane's controls.** A' differs from the pole control K in two factors: the quadratic twist
(chi^1 instead of chi^4) and the angular factor conj-alpha(c). The lane never separated them. I added three
variants to a copy of `gram.py` (same rows, columns, marks): K4a = gamma_2 conj-alpha chi^4 (Kubota row, NO
quadratic twist, with conj-alpha), K4p = gamma_2 alpha chi^4, A = gamma_2 chi (quadratic twist, no alpha).
n lambda_max / tr G (upper bound for SDP/tr) and a = (1,...,1) value / tr G:

| Z, M, l | n | A' | K | K4a | K4p | A | random |
|---|---|---|---|---|---|---|---|
| 2000, 1, 1/2 | 8 | 1.27 | 2.76 | 1.26 | 1.35 | 1.23 | 1.25 |
| 8000, 1, 1/2 | 17 | 1.40 | 7.14 | 1.38 | 1.31 | 1.38 | 1.37 |
| 16000, 1, 1/2 | 24 | 1.45 | 10.42 | 1.44 | 1.39 | 1.48 | 1.44 |
| 8000, 1, 3/4 | 115 | 1.78 | 25.80 | 1.75 | 1.79 | 1.75 | 1.74 |

The Kubota row with the angular factor and without the quadratic twist is as flat as A' and as the random
control. Either factor alone removes the growth at these scales. So: (i) item 3 of 6.1 ("the quadratic twist ...
separates A' from K: it removes the theta residue") names one of two sufficient causes as the cause;
(ii) "WLS is false for K ... so it is a statement about the quadratic twist" should read: WLS fails for the one
tested coefficient system with a theta pole in the marked direction (K-type trivial, no twist) and holds
numerically for every other tested system, including random coefficients; (iii) section 7's requirement that a
proof "use the quadratic twist" is not forced by the data; absence of the residue through the angular type is an
equally consistent mechanism. Correct label for the K control: positive control for the functional
(the Dunn-Radziwill sharpness mechanism of the cubic large sieve, as n1 already recalled), not an identification
of which structure of A' matters.

**E2 (framing of the headline exponent comparison).** "Flat against K-loss exponent 0.33 to 1.0, excluded by 20
to 110 standard errors" compares against Z^(M+l-1), but SDP/tr <= n always (Cauchy-Schwarz; the note's own
Lemma 1). In all 23 configurations with M = 1, Kfac = Z^l exceeds the mark count n (4 against 10, 1575 against
16000), so the K-loss allowance is weaker than the trivial bound and the only content of "flat" there is that the
mark vectors are not all parallel. The relevant comparison is with the exponent of n (the note's last column:
0.11, 0.49, 0.66, 0.88). At the model point (M, l) = (1, 1/3) that is -0.028 +- 0.018 against 0.11 on n = 4 to 6
marks: about 8 standard errors, with a 4-to-6-dimensional Gram matrix. The note says the lever arm is absent at
l = 1/3 (weakest step 1); the claim line and verdict item 1 do not. The same point was made by the n1 referee
(E4) and is repeated here. The measurement is not wrong; its strength at the model point is close to nil.
I tried to extend that row to Z = 64000 (n = 10): planned allocation 7.66 GB, not run.

**E3 (label, 6.3 "EXACT for the model").** The moment route leaves a residual Z^(l/k). n1's threshold th* = 1/18
is for a residual th (M + l - 1). These agree only at M = 1. For M < 1, l/k > (M + l - 1)/k, so the n1 table is not
the LP for the moment route. Monotonicity saves one half: a larger loss cannot lower the infimum, so "k < 18 does
not move 13/15" stands (model). "k >= 18 gives about 31/36 + 1/(10k)" is correct only if the re-optimised point
stays at M = 1; that LP was not run. Label: ARGUED, lower estimate.

**E4 (small overstatements in section 5; recomputed from the stored files).**
- "mean of u_p equals SDP/tr within 2%": 4.1% at (0.75, 0.75, Z = 1000), 3.4% at (0.6, 0.9, Z = 1000);
  within 2.2% elsewhere.
- Slope s of log D_p against log N(p) "0.78 to 0.92 at l = 3/4": true for M = 1; for (M, l) = (0.75, 0.75) I get
  0.66 to 1.29. The claim line's "N(p)^-0.8 to -1.0" holds for n >= 191 only (0.79 to 0.91; overall 0.63 to 1.29).
- Conjugate-pair ratio "about 1.4": in my new cases 1.07 (12 pairs), 1.12 (21 pairs), 0.65 (3 pairs); the
  random control gives 1.21 and 1.05 in the same runs. Consistent with sqrt 2 within sampling error
  (about +-0.22 at 21 pairs) but these small samples do not confirm it. The lane's 785-pair value 1.42 is the
  evidence; it is ARGUED/MEASURED, no effect on exponents either way.

**E5 (title of 6.2 and the claim line).** What is PROVED is the implication PAIR(l) => K-loss removal, for every
l. "For l <= M/2" is where PAIR(l) is numerically plausible (measured pair size R^-1/2); that restriction is
MEASURED, not part of the proof. The implication is Gershgorin plus Cauchy-Schwarz and is not new mathematics;
the note calls it small, which is accurate.

## Confirmed

- **Lemma 1** [CLASSICAL] re-derived. Phase averaging gives tr G <= mu; X = aa* gives mu <= P; weak duality uses
  D - G >= 0, X >= 0, D_p >= G_pp >= 0; Slater points X = I/2 and D = (lambda_max + 1) I; complex rounding constant
  pi/4 (So-Zhang-Ye; Ben-Tal-Nemirovski-Roos), RECALLED by me as well, not re-read. The certificate logic
  tr(GVV*) <= SDP <= tr D + n delta is correct for any V with unit rows and any real diagonal D.
- **Lemma 2** [PROVED] re-derived. chi_cbar(mbar) = conj chi_c(m) for the power-residue symbol; gamma_2 is built
  in `gram.py` from normalised cubic Gauss sums at primes and cubic-symbol pair factors, both conjugation
  equivariant (chi3(-1) = 1 is what makes g(cbar) = conj g(c)); alpha(c) = c/|c|; the weight depends on the norm.
  Row set (primary, not divisible by 2, norm window), mark set (norm window) and cofactor set are closed under
  conjugation (checked in the code: a + b omega -> (a - b) - b omega preserves a = 1, b = 0 mod 3 and the parity
  condition). Hence x_pbar(mbar) = conj x_p(m) and G[pbar, qbar] = conj G[p, q]. Numerically 2e-16 to 7e-15 for
  A' and K on all 29 stored Gram files and on my three new cases; 0.02 to 0.55 for the random control.
- **6.2 reduction** [PROVED] re-derived. D_p = sum_p' |G[p,p']| makes D - G Hermitian diagonally dominant with
  non-negative diagonal, hence PSD (checked: lambda_min > 0 for all 29 stored files x 3 variants and the new
  cases). Then sum_{p != p'} |G[p,p']| <= C Z^(eps-l) (sum_p sqrt G_pp)^2 <= C Z^(eps-l) n tr G, and n <= Z^l
  (primes of norm in [Z^l, 2Z^l], about Z^l / (l log Z)).
- **Stored data** (my script over the 35 `sdp_*.json` and 29 `gram_*.npz`): 35 configurations; n from 4 to 1575;
  largest relative gap 7.16e-9; my own eigenvalue of D - G: lambda_min / tr D >= -2.4e-10; SDP/tr for marks <= rows
  in [1.075, 3.072]; A'/MP at most 1.052 (minimum 0.84 for marks <= rows); SDP/mu_lower <= 1.1254. Fitted exponents recomputed by my own least
  squares: identical to the table to three decimals for A', random and K in all six (M, l) families;
  Gershgorin-sum exponents +0.12, +0.36, +0.25, +0.49 confirmed. Closed-form dual t R D_p: excess over the
  optimal dual 0.1% to 10.8% (marks <= rows), up to 16.5% (marks > rows). Confirmed.
- **New cases** (seed 7 for the random control, seed 5 for the solver; none in the lane's batch):

| Z, M, l, slot | n | R | MP | SDP/tr A' | random | K | gap |
|---|---|---|---|---|---|---|---|
| 3000, 1, 0.6, [Z^l, 2Z^l] | 24 | 683 | 1.410 | 1.324 | 1.327 | 6.58 | <= 9e-10 |
| 6000, 0.8, 0.4, [Z^l, 2Z^l] (l = M/2) | 6 | 236 | 1.344 | 1.225 | 1.293 | 3.56 | <= 1e-10 |
| 8000, 1, 0.5, shifted slot [3Z^l, 6Z^l] | 44 | 1813 | 1.336 | 1.277 | 1.294 | 8.95 | <= 1e-9 |

  A' at or below MP and equal to the random control within 6%; K large; Lemma 2 symmetry 1e-15; off-diagonal
  root mean square 1.00 to 1.09 R^-1/2. The shifted slot shows the result is not tied to the slot [Z^l, 2Z^l].
- **Model point of the LP**: n1's table gives (lx, ly, l) = (1/2, 1/2, 1/3) with M + l - 1 = 1/3, i.e. M = 1,
  l = 1/3, as the note says. 13/15 and 31/36 are MODEL values of the r3-method-limit system (confirmed by the n1
  referee; not rerun here).

## Controls

- Davenport-Heilbronn, backward heat, sign twist: not applicable. The note makes no zero statement, no positivity
  statement and no zeta-only claim; I confirm there is nothing to run them against. The nearest analogue is the
  coefficient control: the random-coefficient system passes exactly as A' does (the note says so), and by E1 so do
  K4a, K4p and A. The flatness is therefore not a property of the theta coefficients of the manuscript row; only
  the single system K is distinguished. The functional equation / Euler-product content of the 7/8 method is on
  the signal side and untouched.
- RH/GRH: not used in any PROVED line. Section 7 mentions GRH for the sextic family only to say it would not
  suffice pointwise; that is ARGUED and not used.
- Verified height: not used.
- Novelty: none claimed for Lemma 1 (classical), Lemma 2 or 6.2 (elementary). The pole control reproduces the
  known Dunn-Radziwill mechanism. The reformulation of K-loss removal as an infinity-to-one norm is the n1
  referee's E1. Conjecture WLS as stated (rows + marks, diagonal weights) is a conjecture about a reduced model
  (no cube completion, one slot, sharp squarefree columns); I did not find it in the literature and did not
  search beyond the works already recalled in n1; it is not presented as a theorem.

## What stands

MEASURED (float64, reduced model, Z <= 32000): the infinity-to-one norm of the mark Gram matrix, through its SDP
with a posteriori dual check, is within 5% of the independent-vector value for marks <= rows and scales like
rows + marks beyond; the K-type-trivial Kubota row without twist is the only tested system that grows.
PROVED (elementary): conjugation symmetry; PAIR(l) implies K-loss removal.
OPEN: WLS, PAIR(l). 13/15 stays; 31/36 is a model value conditional on WLS at (1, 1/3), where the numerical
support is weakest (E2). 7/8 (unrefereed) stands. RH open.

## Three weakest points after this review

1. Evidence at the model point (1, 1/3): 4 to 6 marks, K-loss allowance above the trivial bound (E2).
2. No coefficient system other than K fails, so the measurement does not locate the arithmetic input a proof of
   WLS would use (E1); the note's section 7 obstruction (a signed dual sum needing a power-saving asymptotic) is
   a size count, not a theorem.
3. Model reductions (no cube completion, one slot, no cusp sectors or ray characters): a loss carried by any of
   these is invisible; the note states this.
