# REFEREE: b-codex-energy-lanes/RESULT.md

Date 2026-11-16. Claimed verdict: precise-obstruction. Referee verdict: **holds, with four
narrowings** (section 3). No PROVED step failed re-derivation. Nothing assumes RH; verified
height is cited as an input (Platt-Trudgian), not presented as new.

Referee code (own implementation, nothing imported from `work/` or the PRs) is in
`/tmp/ref-bcel/code/` (`k.py`, `t1.py` .. `t5.py`); mpmath 1.4.1, python-flint 0.9.0, local,
single process, each run under 1 minute.

## 1. PROVED steps re-derived by hand

| Step | Result |
|---|---|
| PR 44 (2.1) envelope `1 - 3e^{-t}/(2 pi) <= L <= 1` | confirmed (n>=2 terms positive; `16 e^{-3 pi q}/(1-e^{2-4 pi q}) <= 3/(2 pi q)` for q>=1) |
| PR 44 (3.1) substitution, exponent 7/2, bounds `c_R`, `b_R`, `d_R` | confirmed |
| PR 44 (3.2) `C = (U+V)/(2 sqrt(UV)) sech((U-V)/2) x J-ratio` | confirmed (`sqrt(2 pi e^U 2 pi e^V)/(pi(e^U+e^V)) = sech`) |
| PR 44 (4.1) `ell_delta` via Fejer window, T = 4/delta | confirmed |
| PR 44 section 5 row sums giving `E_{R,delta}` | confirmed |
| PR 45 (3.1), (3.2) | confirmed (integration by parts; boundary term `-alpha(u+v) kappa(u) kappa(v)`) |
| Row 1 / row 3 (entrywise form of `H_c`, trace) | confirmed |
| Prop. Z parts 1, 2, 4 | confirmed (`d/du <-> -z/2`; leading coefficient of `p_j` is `2(-1)^j`; exponent `2k+9/4`) |
| Prop. Z part 3 | confirmed as a qualitative statement with P-dependent `R_sharp(delta)` (see 3.2) |
| Prop. Z part 5 (PSD => S Schur => no off-axis zero) | confirmed independently: density of Ran A, unitarity of `C_0`, `S(rho) = -1` at a zero of any multiplicity (`(z-rho-m alpha)/(z-rho+m alpha)`), `S(0)=1`. The argument uses only: kernel real, even, Schwartz. It applies to `kappa_sharp` and to DH |
| Lemma D | confirmed: numerator `2x(x^2 + (t-gamma)^2 - beta^2)`; the sum of real parts converges absolutely |
| Thm C(a) | confirmed (poles solve `F'/F = -1/alpha`; double zeros of F are not poles) |
| Thm C(b) | confirmed: `x int e^{xc} H_c dc = 2 alpha e^{x(u+v)/2} M_x((u-v)/2)`; `FT(M_x) = Re(F' conj F)(x+i omega)`; Bochner |
| Thm C(c) | confirmed: PR 46 section 2 argument verbatim with 3/8 |
| 4.3 single-pole bound | confirmed; `sigma(1+e^{-sigma/2})^2` increasing on (0,1/2) |

## 2. Numerical reruns (different cases from the author's)

- **4.3 in ball arithmetic (Arb, 200 bits).** `4 sigma (1+e^{-sigma/2})^2` at 1/2 =
  6.32826445...; bound above verified height = `[7.0305831e-25 +/- 1e-33]`; ratio to
  0.124030166 = 1.764e23. Claim `< 7.1e-25`, factor `> 1e23`: certified.
- **Separated-tail table margins in ball arithmetic (300 bits).** 1.19580e-11, 1.14103e-6,
  6.58547e-4, 9.01423e-3, 2.47144e-2, all certified positive. Matches the PR table.
- **Separated-tail Gram, new configurations** (7 irregularly spaced points; delta=8,R=9;
  delta=4,R=25; delta=3,R=5) for zeta, DH, and `kappa_sharp` with rho = 0.2+7i, 0.3+3000i,
  0.37 (real), 0.3+3e12 i. lambda_min of the normalised H Gram: 0.95230 / 0.59783 / 0.4255
  for all six kernels (sech Gram: 0.95334 / 0.59826 / 0.42792); max entry deviation
  1.5e-3 / 7.3e-4 / 1.1e-2. Every kernel is above the zeta margin `ell - E` in the two certified
  cases. MEASURED (40-digit quadrature, no enclosure).
- **Jets and identity (3.2), order <= 16, dps 60, two tanh-sinh steps (1/64, 1/96).**
  zeta: `J_00, J_11, J_02, J_22` = 0.040242710071759, 0.010882302182086, -0.21042042306902,
  1.1233540359652 (identical to RESULT section 3.2); (3.2) deviation 4e-57; PD through 16.
  `kappa_sharp` rho = 0.3+12i: first negative pivot at even order 10, odd order 13 (matches
  the table). New case rho = 0.25+9i: negative pivot at even order 10, odd order 11; (3.2)
  holds to 7e-51. DH: PD through order 16, (3.2) holds to 8e-40.
- **Fourier identity behind C(b)**: `int M_x(b) e^{i w b} db` vs `Re(F' conj F)(x+iw)` at
  z = 0.375+3i: both 0.0029657548679630355816751974762; at z = 0.2+14.5i: agree to relative 1.6e-28.
  `F` vs mpmath `xi(1/2+z)`: 30 digits.
- **DH control**: own DH kernel is even; `|F_DH(rho)|/|F_DH(rho+0.05)| = 1.3e-6` at
  rho = 0.308517182457 + 85.6993484854 i; `Re F'/F` at omega = gamma: -1.036, -7.079,
  -115.5 at x = 0.05, 0.2, 0.3 and +16.8 at x = 0.375. Matches RESULT section 5.

## 3. Errors and narrowings

### 3.1 The Corollary overstates what Proposition Z excludes (zero-density)
P is a polynomial, so `F_sharp` has finitely many inserted zeros. This refutes any deduction of
a zero-free region inside `1/2 < Re s <= 7/8`, and any *effective* count or spacing bound for a
finite configuration (insert more quadruples than the bound allows). It does **not** refute an
asymptotic zero-density statement with unspecified constants: every `F_sharp` satisfies every
such statement that zeta satisfies. The sentence "none can produce a zero-density or
zero-spacing statement there either" is not proved. An infinite insertion would change the
leading tail term and break Prop. Z part 2.

### 3.2 "In the form proved in PR 44" is not what Prop. Z part 3 gives
The PR 44 theorem has explicit thresholds `E_{R,delta}`. Prop. Z gives the same limit kernel and
the same `ell_delta`, but with a non-explicit `R_sharp(delta)` that depends on P, and the factor
`ell_delta/2` instead of `ell_delta - E_{R,delta}`. A deduction that used the explicit table is
not formally covered. The referee's Gram runs (section 2) show the zeta margin is met by
`kappa_sharp` in every case tried, including rho at height 3e12; that is MEASURED, not proved.
The author lists this as weakest step 1; the Corollary text should carry the qualifier.

### 3.3 The counter-model is not a positive kernel at low height
`kappa_sharp` changes sign for rho = 0.3+3i (negative from u = 0.38, 32 of 150 grid points on
[0,3)) and for rho = 0.37 real. It is positive on the same grid for rho = 0.25+9i and
0.3+30i. So the numerical example used in RESULT sections 4.1 and 5 violates PR 43 row 1
(entrywise positivity) and is outside the Csordas class (rows 2, 9, 15). The obstruction is
correctly stated for inputs (i), (ii), (iii) only; it says nothing about deductions that also use
`kappa > 0` or log-concavity. RESULT records "row 2 was not tested for kappa_sharp" but does
not record the sign change.

### 3.4 The jet-order fit is weaker than stated
"Within 3 of `pi gamma/4 + 2N(gamma)`" holds only for the earlier of the two parity blocks. Odd
block at gamma = 12: 13 vs 9.4; odd block at gamma = 50: 65 vs 59.3. The fit excludes
gamma = 3, 5, 8, where it fails (6 vs 2.4; 9 vs 3.9), and detection order is not monotone
(gamma = 5: 10/9; gamma = 8: 8/9). The referee's new point (gamma = 9, beta = 0.25: 10/11
vs 7.1) is 2.9 above the formula. Five post-hoc points; the formula fails for DH. The RESULT
labels this HEURISTIC and MEASURED, which is the correct grade; the phrase "within 3" needs
the block qualifier.

### 3.5 Minor
- 4.3: "at most 0.0316" at tau = 14.13 comes from the script (`4 sigma(1+e^{-sigma/2})^2/(sigma^2+tau^2)`
  sup); the inequality written in the text (`6.33/tau^2`) gives 0.0317. Both are < 0.124.
- All PSD and pivot-sign statements (zeta to 120, DH to 200, inserted cases) are multiprecision
  floats with two-step agreement, not enclosures. They are labelled MEASURED and no proved
  step depends on them. The logs in `motherbox/` match the table.
- The PR 44 interval certificate for 0.124030166 was not re-run by the author or by the
  referee. The 1e23 statement needs only the lower-bound side and is unaffected.
- Theorem C contains no information beyond the 7/8 input; RESULT says so.

## 4. Walls
- DH: every PR 44/45 positive tested holds for DH (reproduced at small scale). The only
  Euler-product step is the imported 7/8 theorem; C(b) fails for DH at x = 0.05, 0.2, 0.3
  (reproduced).
- RH: not assumed anywhere. Verified height: used explicitly in 4.3 and C(a), not relabelled.
- Interval rigor: the two certified numbers in the claim (7.1e-25, factor 1e23) were
  re-certified in Arb. No float comparison decides a sign in a PROVED step.

## 5. Surviving claim
Inputs (i) separated-tail limit theorem (qualitative form, P-dependent start R), (ii) PR 45
all-order identities, (iii) no zeros of the transform in Re z > 3/8, hold simultaneously for
`kappa_sharp = P(d/du) kappa`, whose transform has prescribed zeros in `0 < Re z <= 3/8` and whose
energy kernel is not PSD. Hence these three inputs do not exclude any zero of zeta in
`1/2 < Re s <= 7/8` and give no effective finite-configuration bound there. Theorem C
(conditional on 7/8) and the leakage vacuity (`< 7.1e-25` vs 0.124) are correct. The jet scan
is a measurement. Not established: exclusion of asymptotic density statements; the explicit
PR 44 thresholds for the counter-model; coverage of deductions using `kappa > 0` or
log-concavity.
