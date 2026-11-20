# REFEREE (lens: general) for c1-pd-log-strip/RESULT.md

Verdict of the referee: **holds** as stated (precise-obstruction, restatement, score 0, no zero statement).
The mathematical core (Theorems 1-3) was re-derived and one identity was rerun on different cases with
independent code. Errors found are in wording, in one piece of shared code (latent, did not change a
reported number that I could detect), and in the strength of two labels. None reverses the verdict.
Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. Re-derivation of the PROVED steps

**Theorem 1 (Fourier transform on the line).** Confirmed.
- Laplace forms: Frullani gives int_0^inf (e^{-(w-b)x} - e^{-wx})/x dx = log(w/(w-b)) for Re w > b, hence
  log((w-b)/w) = -int_0^inf e^{-wx} D_b dx; the substitution x -> -x gives +int_{-inf}^0 e^{-wx} D_b dx for
  Re w < 0. Both as stated.
- Pole term, independent route: split log zeta = log(zeta(s)(s-1)/(s-p)) + log((s-p)/(s-1)) with p < sigma;
  the first factor is causal with measure dA - (e^x - e^{px})/x on x > 0; differentiating the second in s gives
  1/(s-p) (causal) and -1/(s-1) (anticausal) on Re s = sigma. This yields A_sigma - PV e^{ax}/x on all of R for
  the branch that is continuous in u. The horizontal branch of RESULT differs from it by a step of height 2 pi
  at u = 0, whose transform is PV 1/x plus a multiple of delta_0, giving -D_a = -(e^{ax} - 1)/x. Consistency
  checks: jump -2 pi i at u = 0 corresponds to a density tail +1/x at both ends (matches -D_a); the density is
  smooth at x = 0 because the horizontal branch has no sgn(u) limit at infinity. Sign and shape agree.
- The zero term is the same computation with opposite sign and a shift by gamma. Each zero term is rapidly
  decreasing in gamma for a smooth compactly supported test (stronger than the O(gamma^-2) stated).
- Still a sketch, as RESULT says: horizontal edges and the exchange of the zero sum with the pairing are not
  written out. This is the integrated Guinand-Weil explicit formula; I see no gap in substance.

**Theorem 2 (raw property fails).** Confirmed. |phi(u)| <= phi(0) for positive-definite functions and
phi(0) - Re phi(u) >= 0 for conditionally positive-definite functions of order 1 (coefficients (1,-1));
log|zeta(sigma+it)| is unbounded above for 1/2 <= sigma < 1 (Titchmarsh 8.12). Note: phi has a jump at u = 0,
so "phi(0)" is a convention; the argument does not depend on it.

**Theorem 3 (CP(sigma) <=> ZF(sigma)).** Confirmed, including the limit that RESULT gives in outline.
- int kappa dT_- = sum m b/((1+b+i gamma)(1+i gamma)); real part of a conjugate pair
  b(1+b-gamma^2)/(((1+b)^2+gamma^2)(1+gamma^2)) < 0 since gamma^2 > 1+b. Checked by hand and by quadrature
  (b = 0.3, gamma = 17: agreement to 1e-16).
- Lemma S: the e^x test gives log((1+b+i gamma)/(1+i gamma)), real part > 0. Checked the same way.
- Cutoff limit: with chi_n rising from 0 to 1 on [-2/n, -1/n], h(x) = e^x(e^{bx}-1) = O(b/n) there, so
  int |chi_n'' h| and int |chi_n' h'| are O(b) uniformly in n; two integrations by parts give O(b gamma^-2)
  per zero uniformly, and sum b gamma^-2 converges. Dominated convergence applies. The step is sound.
- The proof depends on Theorem 1 for the form of T_-.

**Proposition 4.** Integration by parts reproduced: -b/gamma^2 + b^3/gamma^4 + O(b C_tau/gamma^4). Correct, but
the conclusion needs gamma^2 > b^2 + C_tau with C_tau a fourth-derivative norm of a cutoff on an interval of
length log 2 (plausibly 1e3 to 1e5), so |gamma| > 14 is not enough and the statement as written rests on the
verified height 3e12. It is a restatement step inside an obstruction, so nothing is gained from it, but the
label should read "PROVED given verified height and a finite uncomputed constant", not "PROVED up to one
constant".

**Proposition 5.** (i) and the Pringsheim-Landau remark are correct and elementary. The heading
"no transport in sigma: PROVED" is too strong. What is shown: three named mechanisms (monotonicity of
lambda_min, continuation of the kernel log zeta(s + conj w), three-lines with CP on the left line) do not cross
sigma = 1. That is not a proof that no transport exists. (ii) is nearly empty: the kernel being
positive-definite on Re s > 1/2 is the sigma > 1 statement in other variables.

## 2. Numeric rerun (different cases, independent code)

Own script (own branch tracking, Gauss-Legendre piecewise quadrature, closed form
C_b(delta) = int_0^b (sqrt(pi)/w) exp((beta - i delta)^2/(4 w^2)) d beta for the compensator, primes to 4e5),
run locally through scripts/memcap.sh 8. Gaussian width w = 0.6 and 0.8 (RESULT used 0.5).

| F | sigma | Delta | error of the Theorem 1 identity |
|---|---|---|---|
| zeta | 0.7 | 0.3 | 2.9e-7 (pole term size 0.85) |
| zeta | 0.7 | 30 | 7.4e-7 |
| zeta | 0.55 | -3.7 (w = 0.8) | 2.3e-7 |
| zeta | 0.7 | 2000 | 4.3e-7 |
| E_a, a = 0.2 | 0.65 | 14.0 | 0.146 without zero terms; 8.7e-7 with +zero terms; 0.292 with the opposite sign |
| E_a | 0.65 | 21.5 | 0.126 without; 1.3e-6 with +; 0.252 with - |
| E_a | 0.65 | 1.0 | 6.2e-7 (two pole terms) |
| E_a | 0.75 | 0.5, 14.0 | 5.7e-7, 8.2e-7 |

The identity, the sign of the zero terms and the two-pole case are confirmed at a sigma, widths and heights not
used in RESULT. The floor of about 5e-7 is my quadrature truncation.

Raw Gram (Theorem 2 illustration), own node sets: sigma = 0.8, 30 nodes spacing 0.7: min eig -1.85, 13/30
negative. sigma = 1.2: +0.16, none negative. **sigma = 0.95: 30 nodes spacing 0.7 gives min eig +0.47 and no
negative eigenvalue; 80 nodes spacing 0.5 gives 4/80 negative; 120 nodes spacing 0.9 gives 1/120.**

## 3. Errors and overstatements

1. **"About half of the Gram eigenvalues negative for every sigma < 1" is not what the data support.** It is
   measured at sigma = 0.6, 0.75, 0.9 only; the fraction already falls to 29/80 at 0.9 and to 0 to 5 percent
   at 0.95 with comparable node sets (a 30-node matrix at 0.95 is positive-definite). Theorem 2 is unaffected
   (it is an unboundedness argument), but the sentence "MEASURED: about half of the eigenvalues of every Gram
   matrix are negative for sigma < 1" and "Raw positive-definiteness holds for zeta exactly on sigma >= 1" must
   be restricted to the tested lines and node sets. Finite Gram matrices near sigma = 1 do not detect the failure.
2. **Latent branch defect in lib.py logF.** The step rule (halve until |phase| < 0.7, then double up to 0.5)
   can take one step across two real poles: for E_a (poles 1.2 and 0.8) at |u| below about 0.02 the step
   1.25 -> 0.75 changes the argument by nearly -2 pi and is accepted as nearly 0. I reproduced this with the
   same rule (threshold 0.5): the value of Im log E_a(0.65 + iu) is off by exactly 2 pi for u = 0.01 down to
   1e-4, correct for u >= 0.03. The reported runs use u = +-0.025 as the smallest node (grid 0.05, offset
   half a step) and nodes at multiples of 0.5 in test A, where I compute that the rule still halves correctly,
   and the reported E_a identity error 9.9e-8 is consistent with correct values. So no reported number is shown
   wrong, but the code is not safe for other grids. Tracking each zeta factor separately removes it.
3. **Attribution of the 5.3e-5 error (E_a, sigma = 0.75).** RESULT attributes it to "zeros 0.05 from the line,
   grid 0.05". The nearer feature on the right is the pole of zeta(s+a) at 0.8. With a finer quadrature I get
   5.7e-7 and 8.2e-7 on that line, so it is a quadrature error and not a defect of the identity; the row should
   say so with a rerun rather than a guess.
4. **Novelty wording.** Theorem 1 is the explicit formula for log zeta on a vertical line (integrated
   Guinand-Weil) and Theorem 3 is Paley-Wiener causality of log(zeta(s)(s-1)/(s-sigma)) plus a sign test. The
   plan says the lane "settles" the extension and section 6 calls Theorem 1 a "usable by-product: exact
   formula". Both are classical in substance; they should be labelled CLASSICAL (written out here), not new.
   The claim under review does call it a restatement with score 0, which is the correct reading.
5. **"Unique compensator"** is asserted, not proved (any compensator differing by a positive measure on x > 0
   also gives a positive measure under ZF). Harmless; delete "unique".
6. **Proposition 5 label** (see above): shows three mechanisms fail; "No sigma-transport exists" in the verdict
   paragraph is stronger than what is proved.
7. **Proposition 4** uses verified height as an input (see above).
8. Controls: backward heat, unimodular twist, T-NR, Beurling, phase-rotated transfer operator and theta^w were
   not run. Since no zeta-only mechanism is claimed (three controls are reported as passing), this does not
   affect the verdict. The E_a control was rerun here: CP-type identity holds with pole terms only for
   sigma > 0.7 and needs the zero terms at sigma = 0.65, as RESULT states.

## 4. Checks requested by the assignment

- Assumes RH: no. Theorem 3 is an equivalence; nothing is assumed about Z(sigma).
- Restates verified height: only inside Proposition 4 (used as input) and in the by-product "windowed
  detector", which RESULT itself classes as a verification computation.
- Known theorem presented as new: partly (item 4); the scored claim does not depend on novelty.
- Statement about zeros of zeta: none claimed.

## 5. Requirement flags (strict)

- R1 = false. Multiplicativity enters only as non-negativity of log-coefficients in the trivial direction;
  CP => ZF uses the half-line with no atoms. TW+, Beurling and E_a satisfy the same equivalence.
- R2 = false. CP(sigma) is not established for zeta on any line sigma < 1; numerics reach height 1e5.
- R3 = false. E_a (confirmed here), TW+ and Beurling pass.
- R4 = false. No passage across sigma = 1; on a line left of 1 the property is the zero-free statement.

## 6. What survives

For 1/2 < sigma < 1 the Fourier transform of the horizontal-branch log zeta(sigma+iu) is
A_sigma - D_{1-sigma} dx + sum over zeros right of sigma of m e^{i gamma x} D_{beta-sigma} dx (explicit formula;
confirmed numerically to about 5e-7 on new cases including a control with zero terms). Raw
positive-definiteness fails on every such line (Theorem 2), though small Gram matrices near sigma = 1 can be
positive. Positivity of the compensated transform is equivalent to zero-freeness right of sigma, and the
implication to zero-freeness uses no prime. The lane is a restatement with no progress on R1-R4.
