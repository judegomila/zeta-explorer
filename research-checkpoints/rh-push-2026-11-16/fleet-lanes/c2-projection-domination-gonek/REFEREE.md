# REFEREE (adversarial, lens: general) for c2-projection-domination-gonek

Referee verdict: **holds = false as worded; the obstruction survives after three corrections.** No statement about zeta zeros is at stake. Flags: R1 = false, R2 = false, R3 = false, R4 = false.

Scratch scripts (not part of the lane): `/tmp/ref_c2/chk.py`, `/tmp/ref_c2/chkB.py`, run under `scripts/memcap.sh 8` with `.venv-arb/bin/python`. The server was not used.

## 1. Re-derivation of each step

**Lemma 1 (CLASSICAL). Confirmed with a correction to the remainder.**
With g(t) = w((t-T)/H) e^{iut}, g^(x) = H e^{-i(x-u)T} w^(H(x-u)). The term at x = log n is the displayed one; the term at x = -log n vanishes for u > 0, n >= 2. Single-term condition: log(1 + 1/n0) > 1/(n0+1) > 1/H iff n0 + 1 < H. Correct. Lemma 1(b) (disjoint supports, value (H/4pi^2) ||w^||_2^2 sum Lambda^2/n) re-derived; correct up to endpoint effects at u = log 2 and u = log N.

Error E1 (wording, affects the headline claim). The identity is not "exact with no H-dependent error". R is nonzero and depends on H/T. Because w = sinc^8 decays only like x^-8 on the real axis, the mirrored zeros and the archimedean singularity near t = 0 contribute about H (8H/T)^7 log T (upper bound; the description "O(sup |w| on lines Im = const at distance T/H)" in RESULT.md is not the right size statement). Consequences:
- R -> 0 needs H = o(T^{7/8}) up to logs for this window, not merely "T/H large".
- The rows H = T^1 of the table in `testC.json`, and the quoted figure 925 (delta = 0.05, T = 1e100, H = T), are outside the range where Lemma 1 holds. They must be removed or the window replaced by one with faster decay.
- "Holds in every window, at every height, for any H >= 3" must read "for 3 <= H <= T^{7/8 - eps}, with remainder O(H (8H/T)^7 log T)". No explicit constant for R is derived (RESULT.md weak step 3 admits this).
Measured confirmation of the size: my runs give error 7e-4 at T = 3000, H = 150 ((8H/T)^8 = 6.6e-4) against 8e-6 to 6e-5 for H/T <= 0.005; the lane's own T = 1e3, H = 100 row has error 2.4 to 3.4.

Error E2 (constant). RESULT.md states w^(0) = 12.33 and M_on ~ 1.96 H log(T/2pi). The exact value is 8 * 151 pi / 315 = 12.04776 (my quadrature: 12.0477585; the lane's own `testA.json` and `testC.json` store 12.0477585). The constant is 1.917, not 1.96. No conclusion depends on it.

**Lemma 2 (labelled PROVED). Not confirmed as stated.**
The pair computation is correct: contribution e^{iut0}[W e^{delta u} + conj(W) e^{-delta u}], modulus >= 2|W| sinh(delta u) (w real on R gives the conjugate).
Error E3. The displayed inequality `|prime side| >= g - M_on` with M_on = on-line mass is false when any other off-line zero exists:
- Two pairs of the same depth at t0 = T - a and t1 = T + a have W1 = conj(W0) (w even and real). For u with e^{2iua} = -W0/W1 the growing terms cancel exactly. Such u exist in every interval of length pi/a. So "the deepest pair in the window has depth delta" does not give the lower bound.
- The window is not compact. An off-line pair of depth delta' > delta at distance x H from T contributes (8/x)^8 e^{delta' u}, which exceeds g for large u.
- The parenthetical in RESULT.md ("otherwise they enter M_on with e^{delta' u}") changes the definition of M_on and is not carried into the inequality.
The inequality is proved only under the hypothesis: exactly one off-line pair among all zeros (plus its mirror). Also |W| <= 1 is used and is slightly false (w(iy) = (sinh(y/8)/(y/8))^8 > 1; excess < 1e-3 for H >= 3).
E3 does not damage the obstruction: the obstruction says that even the most favourable form of the inequality cannot be used.

**Decisive comparison. Confirmed; it is elementary.**
- N < H: g <= 2|W| sinh(delta log H) < 1.001 H^{1/2} < 1.917 H log(T/2pi). Also sum of w over zeros equals (H w^(0)/2pi) log(T/2pi) plus remainder exactly, for H > 1/log 2, because w >= 0 and no prime term falls in |log n| <= 1/H; so the M_on value is correct for bounded H as well.
- N > H: Brun-Titchmarsh on an interval of length 2N/H gives B = (2/pi) w^(0) sqrt(N) log N / log(2N/H), re-derived. Since (2/pi) w^(0) > 1 and delta < 1/2, g < N^delta < sqrt(N) < B.
- So g < B + M_on for all H, N, delta < 1/2. This is the classical fact that the explicit formula with the trivial prime bound returns only the trivial strip. It is not new and should not be listed under "new relative to the atlas".
- "Closing the deficit is the zero-free statement itself" is asserted, not proved (RESULT.md weak step 2 says so). It stays OPEN/heuristic in the record.

## 2. Numeric rerun with different cases

Test A, independent window code, new cases (zeros from the lane's `zeros40000.npy`, monotone, 14.1347 to 33190.0):

| T | H | zeros used | max err, n0+1 < H | max err, n0+1 >= H | sample |
|---|---|---|---|---|---|
| 5000 | 20 | 3393 | 2.9e-5 | 4.0e-5 | S(log 7) = 28.205262 (predicted 28.205262); S(log 6, 10, 12, 15) = 0 to 6 digits |
| 2500 | 12 | 1821 | 7.8e-6 | 2.9e-5 | S(log 9) = 8.426182 (predicted 8.426182) |
| 20000 | 50 | 10261 | 6.3e-5 | 1.1e-4 | S(log 7) = 70.513155 (predicted 70.513156) |
| 3000 | 150 | 16182 | 7.2e-4 | 7.0e-4 | remainder visible, (8H/T)^8 = 6.6e-4 |

I also evaluated at off-integer points u = log(n0 + 0.37): same errors. Lemma 1 is confirmed numerically in its valid range.

Test B, new cases (T = 2e4, H = 4, delta = 0.1; T = 5e3, H = 10, delta = 0.1; theta in 0.25..0.60):
- residual 5e-12 to 2e-10 for theta <= 0.45, 3e-2 at theta = 0.50, 0.3 to 0.6 at theta = 0.60. Reproduced.
- Note on the lane's own data: its only sub-threshold point is theta = 0.30, where the linear system has unknowns >= rows (135 vs 132, 195 vs 190, 226 vs 218). On that grid a residual of 1e-11 is close to automatic. My points theta = 0.35 to 0.45 have rows > unknowns and numerical rank below the unknown count (118 to 142 of 143), and a twice finer u-grid gives the same residuals, so the effect is real and not a grid artefact.
- The lane's test never runs in the single-term regime (H = 2, 6 with N = T^theta >> H). The statement about "every H < T^{1/2} in the single-term regime" is an extrapolation by the counting argument, not a measurement.
- For delta = 0.3 the fitted shifts reach 17 delta^2 = 1.5, larger than the mean zero gap (0.85 at T = 1e4). "Linearisation consistent" holds for delta = 0.05 only.
- "In any window" rests on T <= 3e4 and H <= 10.

## 3. Controls run by the referee

- Point-set controls for Test B (same density as zeros near T = 2e4): a shifted lattice gives residual 4e-12 to 4e-11 for theta <= 0.45 and 0.21 at theta = 0.50; Poisson points give 1e-11 to 2e-5 for theta <= 0.45 and 0.10 at theta = 0.50 (with very large shifts). The threshold theta = 1/2 is a sampling-density fact (Beurling-Landau) valid for any point set of density log(T/2pi)/2pi. It carries no zeta content. RESULT.md reads it this way; the record must not cite it as a property of zeta.
- DH: b(6) re-derived by hand: b(6) = a(6) log 6 - b(2)a(3) - b(3)a(2) = (1 + xi^2) log 6 = 1.0807009 * 1.7917595 = 1.93636. Confirmed. The DH identity itself was not checked on DH zeros by the lane or by me; it follows from the same contour argument (finite prime side; the zero sum must include the DH zeros with Re s > 1).
- Liouville twist: coefficients of -(d/ds) log(zeta(2s)/zeta(s)) at p^k are (-1)^k log p. Confirmed. This control passes every step of the route.
- E_a: coefficients Lambda(n)(n^a + n^-a). Confirmed.
- The vanishing S_w(log n0) = 0 at non-prime-powers is a property of every Euler product (all Dirichlet L-functions, T-NR, sign-twisted products where the zero sum exists). It separates DH from Euler products; it is not a zeta-only mechanism and it uses support of Lambda only.

## 4. Other checks

- RH is not assumed. Test B keeps the other zeros on the line; at T <= 3e4 that is the verified data, used only as input to a numerical experiment.
- No verified-height restatement is presented as a result.
- Known theorem presented as new: the "no error term" form of the smoothed explicit formula is the standard Weil formula with compactly supported transform (labelled CLASSICAL in section 2 but listed as new in section 1). The comparison g < B is the classical trivial-strip statement.

## 5. Requirement flags (set by the referee)

- R1 = false. Only prime-power support and size of Lambda are used; the sign twist keeps every prime-side input.
- R2 = false. The identity holds per window only for H <= T^{7/8 - eps} with a nonzero remainder; no conclusion about zeros is reached in any window.
- R3 = false. No conclusion exists for a control to break; the Liouville twist passes all steps.
- R4 = false. No mechanism; the prime bound used is the Re s = 1 bound.

## 6. Surviving claim

For w = sinc(x/8)^8 and 3 <= H <= T^{7/8 - eps}: S_w(u) equals the finite prime sum of Lemma 1 up to a remainder of size about H (8H/T)^7 log T (no explicit constant); for n0 + 1 < H it is the single term -(H w^(0)/2pi) Lambda(n0)/sqrt(n0) with w^(0) = 12.0478; checked on zeta zeros to 1e-5 relative to values 8 to 70 at T in {2.5e3, 5e3, 2e4} in addition to the lane's cases. It vanishes at non-prime-powers for every Euler product and not for DH (b(6) = 1.936). If exactly one off-line pair exists, |prime side| >= 2|W| sinh(delta u) - M_on; this lower bound is below the trivial upper bound (Brun-Titchmarsh) for every H, N and delta < 1/2 by the elementary inequality N^delta < sqrt(N), so the route excludes nothing. Measured, first order, T <= 3e4, H <= 10: the change in S_w on u <= theta log(T/2pi) caused by one off-line pair is reproduced by real displacements of neighbouring points for theta <= 0.45 (residual <= 2e-10) and not for theta >= 0.5; the same holds for lattice and Poisson point sets, so this is a sampling-density statement.

## 7. Required corrections to RESULT.md

1. Replace "no error term" / "exact in every window" by the statement with remainder and the range H <= T^{7/8 - eps}; drop the H = T^1 table rows.
2. Restate Lemma 2 with the hypothesis "exactly one off-line pair" or with all off-line zeros on the left side; relabel the general form OPEN.
3. Correct w^(0) = 12.0478 and the constant 1.917.
4. State that Test B's threshold is generic for point sets of the same density, that theta = 0.30 was the only sub-threshold point and had rows <= unknowns, and that the single-term-regime reading is an extrapolation.
5. Remove the "new" label from the exactness statement and from the comparison g < B.
