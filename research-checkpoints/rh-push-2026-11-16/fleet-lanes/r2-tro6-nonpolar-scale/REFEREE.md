# REFEREE: r2-tro6-nonpolar-scale

Adversarial referee, 2026-11-16. Read: BRIEF.md, RESULT.md, ident.py/ident.log, scale.py (row construction),
analysis.json/analysis.log, round-1 REFEREE files. Reruns: refits from analysis.json (local); two new scripts run
read-only against the motherbox data (`out/rows_*.npz`, `sextic/data/sf_1e7.npz`), nothing written there.

**Outcome: the one PROVED step holds. All quoted numbers reproduce. Two interpretive statements about the aligned
row do not follow from the data (E1, E2). Verdict "partial result, no eta claim, TRO6-natural OPEN" stands.**

## 1. PROVED step: re-derived and rechecked on a different formulation

* Algebra. With |gamma_1| = |alpha G| = 1 and mu^2 = 1: mu conj(alpha G) gamma_2 = mu conj(alpha G) mu alpha G / gamma_1
  = conj(gamma_1). Hence conj(B_m) = sum_c w(N c) gamma_1(c) conj chi_c(-e0 m). Correct. For squarefree c and
  gcd(m, c) > 1 both sides vanish, so "= g~_1(-e0 m, c)" is also correct.
* Independent table check (not the note's code path; G taken as gamma_1/gamma_2^2 instead of conj(chi_c(4)) gamma_3),
  2,822,619 nodes: ||gamma_1| - 1| <= 2.0e-9; gamma_2^3 = mu alpha to 7.7e-9 (with conj alpha: off by 2.0);
  gamma_1/gamma_2^2 is constant on each class mod 4 to 5.8e-9 and is a 12th root of unity; mu conj(alpha G) gamma_2 =
  conj gamma_1 to 6.6e-9. Confirmed.
* Constant. (2/3) * integral exp(u/6 - 2u^2) du = (2/3) sqrt(pi/2) e^{1/288} = 0.8384. Confirmed. The window is cut
  at |u| <= 1.6; that changes C by about 0.1%, below the quoted agreement.
* Remark (not an error). Since alpha G = mu gamma_1 gamma_2, the row is beta = conj(gamma_1 gamma_2) chi(-e0) by
  definition: the identity is an unwinding of how round 1 built the aligned row. The content from (4.7) is only that
  this beta is mu x Hecke character x a function of c mod 4. "PROVED-rel (4.7)" is the right label for the
  identity; the asymptotic B_m ~ C R^{1/6} conj(rho_str) is not proved (the note says so in section 4.2 but the
  one-line claim merges the two). Per row the agreement is partial: ident.log has an unreported column,
  corr(conj B, rho_str_blk) = 0.65-0.72 at Q = 938 and 0.83-0.88 at Q = 30000.

## 2. Numbers reproduced

From analysis.json, own least-squares fits: aligned row delta = -0.0247 / -0.0286 / -0.0241 (all Q) and +0.0012 /
-0.0123 / -0.0033 (Q >= 3750), upper bounds as quoted (max +0.0111). Additional ranges not in the note: Q >= 7500:
+0.0025 / -0.0055 / -0.0021; Q >= 10607: -0.0065 / -0.0046 / -0.0058. Fixed R: 0.0435 / 0.0377 / 0.0397.
Mean (r/null)^2 over 14 types x 11 Q: loo 0.981 / 0.895 / 0.965, band 0.899 / 0.852 / 0.877; max r/null 1.94.
Ratios and r in section 4.2 match ident.log.

## 3. Errors and gaps

### E1. The delta of the aligned row is a sum of three trends, each larger than the 0.0125 threshold

r = cos(rho_nat, rho_str_blk) x sqrt(theta share) x ratio. Over Q >= 3750 (from ident.log): sqrt(share) contributes
-0.072 (prime to 6) and -0.057 (not prime to 6) to delta; the ratio drift contributes +0.042 and +0.020; the cosine
contributes +0.026 and +0.022. They sum to the measured +0.001 and -0.012. "delta <= 0.0111, so 0.0125 is excluded"
is a true statement about the statistic r on Q <= 30000, where the theta share is 0.25-0.66 and still rising. It is
not a statement about the row once saturated (share -> 1), which is the regime the dictionary refers to. The block
bootstrap resamples rows and does not see these systematics.

### E2. Noise share of rho-hat depends on Q and on the stratum; the saturation-free cosine is not shown non-decaying

The note quotes one noise share, 0.242. Recomputed by Q (motherbox, rows_*.npz):

| Q | prime to 6: noise share, cosine raw, cosine noise-corrected | not prime to 6: same |
|---|---|---|
| 938 | 0.255, 0.5091, 0.5864 | 0.126, 0.3222, 0.3440 |
| 3750 | 0.295, 0.4989, 0.5898 | 0.146, 0.3187, 0.3444 |
| 7500 | 0.320, 0.4915, 0.5914 | 0.156, 0.3157, 0.3433 |
| 15000 | 0.346, 0.4817, 0.5912 | 0.168, 0.3105, 0.3402 |
| 30000 | 0.373, 0.4730, 0.5926 | 0.179, 0.3050, 0.3365 |

(cosine = rms over sigma of |G_sigma| / (||rho_nat_sigma|| sqrt(sum |rho_str_blk|^2 - noise)); "noise-corrected"
also subtracts sum se^2 from ||rho_nat_sigma||^2.)

* The uncorrected norm in the denominator of r adds a spurious +0.024 to +0.028 (prime to 6) and +0.009 (not prime
  to 6) to every delta in the note. This is 1-2 times the threshold under test and is absent from the error budget.
  Its sign makes the measured r decay faster than the true one, so it does not rescue a decay claim.
* Noise-corrected cosine, delta: prime to 6: -0.004 (all Q), -0.002 (Q >= 3750). Not prime to 6: +0.007 (all Q),
  +0.012 (Q >= 3750), monotone decline 0.3444 -> 0.3365 over the last seven points. No interval computed. On the
  stratum not prime to 6 the saturation-free quantity therefore does not exclude delta = 0.0125.
* Consequently section 0 item 1 ("Its non-decay is not a numerical question") and section 5 item 4 ("by section 4.2
  the true value is delta <= 0 on this path") are unsupported. The note's own OPEN list contains "a lower bound for
  <rho_nat, rho_str>", which is exactly this non-decay. Correct statement: non-decay of the aligned row is
  equivalent to a lower bound on the normalised inner product of rho_nat_sigma with the parity-block sum of
  rho_str; MEASURED flat on rows prime to 6, MEASURED slowly declining (nominal 0.007-0.012) on rows not prime to 6.

### E3. Unreported structure of the inner product (affects what "rms over sigma" means)

On rows prime to 6 the parity-0 block sum of rho_str is noise: sum |blk_0|^2 = 13.8 against noise 13.0 at Q = 30000
(parity 1: 99.8 against 13.1). G_sigma is 14.8-15.5 on six classes and -0.6 to +1.1 on the other six, although the
diagonal terms <rho_sigma, rho_sigma> - noise are 2.7-3.8 on all twelve: on six classes the cross-class terms cancel
the diagonal. The rms over sigma on this stratum is carried by six classes. This is consistent with the "six class
shifts" of section 4.1 but is a linear relation among the rho_str_s that the note does not state; it should be
identified (unit relation) before any lower bound for the inner product is attempted.

### E4. Section 4.5, minor

* "For the Moebius-phased rows with a non-trivial target the cell sums ... vanish": they are character sums over
  (class, shell) cells and are small, not zero; analysis.json gives r_pol/null = 2.7 / 3.5 / 4.6 / 3.5 for res*x13,
  res*x13c, res*a6, res*dh at Q = 30000.
* res*rnd is omitted from the table; its polar part is 13.6x null, like a*rnd (20.0x). Expected (random signs give
  square-root cell sums) and consistent with the note's reading.

### E5. Section 6 inference is conditional

"attains Cauchy-Schwarz up to the constant 0.25-0.35 with no decay, because it is the theta function" and "A proof
must therefore use complete multiplicativity of the target" depend on the OPEN lower bound of E2. As stated they
are MEASURED/HEURISTIC, not consequences of the identity. Also G is a function of c mod 4 (checked above), so
"mu x Hecke character x finite-order factors" is accurate.

## 4. DH control, RH, verified height

* No statement about zeros; no step has to fail for DH. Nothing assumes RH; verified height is not used.
* The DH-type rows are computed as a fixed linear combination of the chi_13 and conj chi_13 rows (analysis.py), with
  the mod-5 Davenport-Heilbronn constant kappa applied to a quartic pair mod pi_13. Both components are at the null,
  so the combination being at the null is implied by linearity and carries no independent information. The note
  says this. The claim "the DH control is indistinguishable from Hecke targets" should be read as "the statistic has
  no power here": every target row equals its null, sensitivity about 0.003-0.005 in r, against a required
  resolution of Q^{-0.0125}.

## 5. Is the "no decay" obstruction real?

It is plausible and not an artifact of a weak attempt: the aligned row is a smoothed theta partial sum by
construction, and the diagonal term of the inner product is positive. It is not established: the cross-class terms
are of the same size as the diagonal (|G - D|/|D| = 2.2 on rows prime to 6, 0.36-0.44 on the others) and cancel it
completely on half the classes of one stratum (E3). One way to settle it without more data: use the unit relations
rho_s(u y) to write the parity-block sum as a fixed unitary combination of a single class, which would turn the
cosine into an explicit constant; if that works, non-decay becomes PROVED-rel the X^{2/3} asymptotic.

## 6. Surviving claim

PROVED-rel (4.7): for beta = mu conj(alpha G) chi(-e0), conj(B_m) = sum_c w(N c) g~_1(-e0 m, c) (exact; checked on
2,822,619 moduli by two formulations). MEASURED: the form equals C R^{1/6} <rho_nat, rho_str_blk> to 0.0-0.9% (rows
not prime to 6) and 2.4-8.5% (prime to 6) for Q >= 7500; r = 0.257 (0.345 / 0.249) at Q = 30000 and r does not
decay on Q <= 30000 along R = Q^1.4. NOT established: that delta = 0.0125 is excluded for the saturated row (the
noise-corrected cosine has nominal delta -0.002 on rows prime to 6 and +0.012 on rows not prime to 6, no interval).
MEASURED: all rows with a target are at the random-phase null (no power to resolve eta; the DH-type control adds no
information). Polar-part and law-phase measurements as stated, with E4. No eta claim. TRO6-natural OPEN.
