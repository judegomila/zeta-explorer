# REFEREE: screw-canonical/RESULT.md

Date: 2026-11-16. Adversarial referee. Verdict under review: precise-obstruction, no new T.

## Outcome

Both PROVED lemmas survive re-derivation and an independent numeric test. The MEASURED numbers
reproduce on different test cases. The DH control is consistent. Nothing assumes RH in a
load-bearing step and no verified-height statement is presented as new. The obstruction is real
but its headline wording is stronger than what Lemma 2 gives (items E1, E2). holds = true, with
the surviving claim narrowed as in the last section.

## Checks performed (referee scratch in /tmp/ref-screw, not in the repo)

1. **Normalization of the form (independent).** For f = x(T-x) on [0,T] the prime-side value from
   `screw.py` was compared with 2*sum |fhat(gamma)|^2 over zeros computed separately in mpmath.
   - zeta, 250 zeros: T=1.5 prime 2.924563e-5, zeros 2.924281e-5, tail estimate 2.8e-9;
     T=2.0 prime 6.724617e-6, zeros 6.723443e-6, tail 1.2e-9.
   - DH, 40 zeros on the line below height 80 found from the completed function via Hurwitz zeta
     (count matches the main term 40.15; first zeros 5.094, 8.940, 12.134, 14.404):
     T=1.5 prime 1.744981e-3, zeros 1.744446e-3, tail 5.5e-7; T=2.0 6.532323e-4 vs 6.530110e-4,
     tail 2.3e-7; T=2.5 7.761933e-4 vs 7.760543e-4, tail 1.2e-7.
   The differences equal the tail estimates. The DH prime side (a0, k with beta=3/2, Lambda_f, no
   pole term) was not checked numerically in RESULT.md; it is now. CONFIRMED.
2. **Gamma-symbol identity** a(t)-a0 = sum (2/b_m) t^2/(b_m^2+t^2), b_m = 2m+5/2, and its real-space
   form 2 int k(r)(R(0)-R(r)) dr with k = e^{-5r/2}/(1-e^{-2r}): re-derived by hand. The absorbed
   pole at s=0 is consistent (psi(5/4)-psi(1/4) = 4 accounts for the e^{-r/2} half of the pole term). CONFIRMED.
3. **Lemma 1** (lam1 nonincreasing). Re-derived: every term of q_T is a functional of R_f; R_f is
   unchanged by zero extension; the cutoffs n <= e^T and r <= T are automatic because R_f vanishes
   beyond T. CONFIRMED. All logged data are monotone in T and in N as the lemma and Cauchy
   interlacing require.
4. **Lemma 2** (pencil window, Ritz gives outer bounds). Re-derived; needs P_n indefinite (true) and
   q > 0 only on the subspace used, so the "only if" direction does not depend on RH. Direct test
   at a new point (zeta, T=1.3, N=70), changing the weight inside `weights()` rather than using the
   pencil: n=2 window eps+ = 7.096e-10, eps- = 3.958e-8; lam1 = +3.98e-12 at 0.9 eps+, -3.98e-12 at
   1.1 eps+, +1.85e-9 at -0.9 eps-, -1.85e-9 at -1.1 eps-. Same sign flips for n=3. CONFIRMED.
5. **Margin table, new points.** zeta T=1.5: 3.7189e-15 (N=70), 3.6598e-15 (N=120, 1.3x precision);
   interpolation of the table predicts 3.5e-15. zeta T=2.3, N=150: 2.35e-43; table interpolation
   2.1e-43 (N=240). Consistent.
6. **Ball radii**, which RESULT.md never prints: max radius of a Q entry is 4e-130 (N=70, 276 digits),
   6e-183 (N=150, 500 digits), 9e-203 (N=180, 584 digits), 2e-319 (N=180, 700 digits). All far below
   the eigenvalues quoted. Gauss-Legendre truncation: the integrand's nearest singularity is at
   rho = i pi/T, Bernstein parameter about 4.2 at T=3.5; with nq=894 and degree <= 541 the error is
   about 1e-780 before conditioning and below 1e-340 after. Weakest step 1 of RESULT.md is therefore
   less weak than stated; what is missing for a certificate is only an enclosed eigenvalue sign.
7. **DH control.** Reproduced T=3.4 N=180: +1.03e-28 (positive). T=3.5 N=180 at 700 digits:
   -6.7876e-21, -2.0458e-23, identical to the log. New: T=3.6 N=190: -2.48e-7, -6.9e-9.
   T=4.0 N=180: -0.7512, -0.6877, and the two negative eigenvectors have |fhat|^2 peaked at
   84.5 to 87, i.e. at the off-line zero 85.70. The prime side locates the off-line zero from the
   coefficients alone, which is the strongest confirmation that the DH form is assembled correctly.
8. **Levinson data.** `lev_zeta_3_384.json`: max |alpha_k| = 0.19974 at t = 2.39, min E_k = 1.171.
   Matches the text. (`lev_zeta_6_768.json` stops at t = 4.64 from precision loss; not relied on.)
9. Atlas line 314 does record Q_{6/5} >= 1e-55 with an analytic complement; normalization against
   lam1(2.4) was not re-derived by me. The consistency remark is plausible, not checked.

## Errors and gaps

E1. **Overstated corollary.** "Any estimate-based primes-only proof is excluded for T >= 1.4" does not
follow. Lemma 2 excludes exactly this: an argument that remains valid when one coefficient w_n is
moved by more than the window with everything else fixed. It does not exclude
(a) interval arithmetic carrying about 5.2 e^T digits, which is an estimate with slack below the
window (the atlas certificate at support 2.4 is of this type);
(b) arguments whose estimates live on the zero side or in a factorization q_T = ||A f||^2, where
the coefficients enter exactly and the inequalities are elsewhere;
(c) coherent deformations (another L-function, zeros moved along the line) that change all
coefficients and the archimedean term together and keep positivity. The positive cone is thin in
the single direction R_f(log 2), not small.
Correct statement: no proof can treat an individual w_n as known only to within the window.

E2. The corollary is labelled "PROVED from Lemma 2 given the table", but its last sentence ("shrinks
faster than any fixed power of e^{-T}, so no later range repairs this") is an extrapolation of a
fit. Monotone shrinking is proved (same argument as Lemma 1); the rate is MEASURED on T <= 2.4.

E3. **Rate law not pinned down.** Local slopes against e^T drift from -4.6 to -5.3 and are still
moving. The note's own heuristic (time-bandwidth product pi T e^T) predicts growth like T e^T, not
e^T; the data on 1 <= T <= 2.6 do not separate the two. The figure "1e-160 at T=3.5" has no support
beyond the fit. Also, N=150 at T=2.3 has minimizer mass 3e-43 in degrees 120 to 140, the same size
as the eigenvalue, so the single-N values at T >= 2.2 are converged to tens of percent at best.
They remain upper bounds.

E4. **Scope of "DH passes to T=3.4".** Degree < 200 on [0,3.4] resolves frequencies up to about
2N/T = 118, so only the off-line zero at 85.70 is tested; the next ones (114.2, 166.5, 176.7, ...)
are not. A negative direction for T <= 3.4 living at higher frequency is not excluded.
Unconditionally only T_DH > ln 2 is clear (no n >= 2 term). The sentence "for T <= 3.4 kernel
positivity is not an Euler-product statement" is MEASURED at this resolution.

E5. **Mechanism of the DH failure at 3.5 is not described and matters for reading it.** The
eigenvector for -6.8e-21 is a low-frequency near-null vector (|fhat|^2 peak near 7) with
Legendre mass about 1e-19 spread over degrees 100 to 160, where frequency 85.7 sits (degree 150).
With N=100 the value is +2.6e-30. So the negativity is a cross term between a sub-Nyquist null
direction and the off-line zero, not an independent low-frequency failure. At T=3.6 the same
happens with a null vector at height 20 to 25. The statement "the failure appears before that zero
is inside the band" is correct but the failure is still produced by that zero.

E6. Section 2 "Why the collapse" writes q_T[f] = sum |fhat(gamma)|^2, which is the RH form of the
zero side. It is used only in an ARGUED paragraph and in `zerocheck.py` on the first 150 (verified)
zeros, so nothing depends on it; it should read fhat(gamma) conj fhat(conj gamma).

E7. Section 5 does not compute a Hamiltonian or string mass; it computes a discrete Krein system on
a mesh that the note itself says does not resolve the small eigenvalue (E_k >= 1.17 against
lam1 = 1e-60). The "no sign structure" finding is about the mesh proxy only. Labelled "limited" in
the note; the summary line should carry the same qualifier.

## Is the obstruction an artifact of a weak attempt?

Partly normalization, partly intrinsic. The L^2 margin lam1 is small because functions of support T
can vanish at all zeros below height 2 pi e^T; that is a sampling fact about any zero set of this
density and has no arithmetic content. The coefficient window of Lemma 2 is norm-independent and is
the intrinsic part. One way around that the note does not rule out: prove positivity through a
structure in which exactness is automatic (a factorization or a de Branges-space isometry on the
sub-Nyquist band) and use estimates only on the complement of the near-null directions, where the
second and third eigenvalue gaps (factors 1e3 to 1e8) leave room. The DH control then requires
that structure to use the Euler product, and E5 shows where DH breaks it: the cross term between
the null band and an off-line zero.

## Surviving claim

No new T. PROVED: Lemma 1; Lemma 2 with Ritz outer bounds. MEASURED and reproduced: the margin
table (upper bounds), the single-coefficient windows, DH positive on degree < 200 up to T=3.4 and
negative at T=3.5, 3.6, 4.0, with the T=4 direction located at the off-line zero 85.70. The
obstruction holds in the form "no proof may treat an individual w_n as uncertain by more than the
window (2.5e-26 at T=2)", not in the form "no estimate-based proof exists".
