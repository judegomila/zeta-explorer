# REFEREE (lens: general) for c8-hecke-entropy-resonance-rigidity/RESULT.md

Date: 2026-11-18. Referee run: one local script (26 s, through `scripts/memcap.sh 8`, mpmath 20
digits + fixed Gauss-Legendre nodes; not interval-certified). Server not used.

## Verdict of the referee

**holds = false as written: one step labelled PROVED (Lemma G2 (i), the DH-type control) is about
the zero function. Everything the obstruction itself rests on (Lemmas 1, 2, 3, G1, 5 and
Proposition 4) was re-derived and confirmed, with three small repairs listed below.** The result
makes no statement about zeros of zeta, does not assume RH, does not restate verified height, and
labels the classical inputs (Maass-Selberg, Zagier 1981, Luo-Sarnak, Bourgain-Lindenstrauss) as
classical. Requirement flags set by the referee: R1 = R2 = R3 = R4 = false (same as claimed).

## Error 1 (substantive): Lemma G2 is vacuous

`G_chi(z, w) = sum_{(c,d)=1, 5|c} chi(d) y^w/|cz+d|^(2w)` with chi a complex character mod 5.
The two complex characters mod 5 have order 4 and chi(-1) = chi(4) = chi(2)^2 = -1: they are odd.
The terms (c, d) and (-c, -d) cancel, so G_chi = 0 identically, and so is G_conj(chi) and
D = a G_chi + b G_conj(chi). (Equivalently: -I acts trivially on H, so a weight-0 function with
nebentypus psi satisfies f = psi(-1) f.) Referee numeric check: truncated sum over |c|, |d| <= 60
at z = 0.13 + 0.9i, w = 1.7: |sum| = 4.8e-17 against sum of absolute values 1.75.

Consequences:
- The displayed relation `T_p D - lambda D = b (conj(chi)(p) - chi(p)) p^(w-1/2) G_conj(chi)` reads
  0 = 0; the assertion "non-zero for p = 2, 3 mod 5" is false; D is (trivially) a T_p-eigenfunction.
- The only non-trivial even character mod 5 is the real quadratic one, for which chi = conj(chi)
  and no DH-type combination exists. The Davenport-Heilbronn function is built from the odd pair,
  so its Eisenstein object lives in weight 1 (K-type 1 on Gamma_1(5)\G) or as a different object,
  not as a weight-0 function on Gamma_1(5)\H. The device's steps (Maass-Selberg mass, balls on the
  surface, Lemma 3) were not written for that setting.
- The DH row of the controls table and the sentence "the DH-type combination on Gamma_1(5) fails
  at the T_p eigen-relation" are therefore NOT established. The underlying algebra (a sum of two
  non-zero joint eigenfunctions with different T_p-eigenvalues is not an eigenfunction) is
  trivially valid once two non-zero objects are constructed; that construction is missing.
  Status of the DH control: not run.
- The gate condition as the result states it ("a step fails for U or THIN") rests on Lemma G1
  only and is unaffected.

## Repairs needed in steps that otherwise hold

1. Lemma G1, scope. (i), (ii), (iii) are correct as stated (algebra of (ii) re-derived and checked
   numerically to 2e-16; the Hecke relation for tau^eps has trivial central character because
   eps(p) conj(eps(p)) = 1; Im w(1-w) = t(1 - 2 sigma)). But (iii) only shows that the specific
   function f_eps with zero constant term is not Gamma-invariant; the hypothesis eps(p0) != 1 is
   not used there (eps = 1 gives E minus its constant term, also not invariant). To conclude "no
   Gamma-invariant function carries the coefficients tau^eps" one more line is needed: if
   g = a y^w + b y^(1-w) + f_eps were Gamma-invariant, then T_{p0} g - tau^eps(p0) g =
   c (a y^w + b y^(1-w)) with c != 0 by (ii) is Gamma-invariant, hence a = b = 0, then (iii).
   The line closes; the lemma's use in the table (U, THIN, sign twists fail at (a)) stands.
2. Lemma 3, definition of m. m is defined as the number of pairs (p, j) whose images of B in
   Gamma\H share a point. The folding step needs the count with Gamma-multiplicity:
   m = max over points q of #{(p, j, gamma): q in gamma g_{p,j} B}. A single image can cover a
   point of Gamma\H several times (ball of radius r at height y0 with r y0 > 1 wraps the cusp;
   elliptic points). With that definition the proof is correct ((p+1)/p <= 3/2 <= 2; the height
   bound p ht(z) via min over non-zero integer rows of |cz+d|^2 = y/ht(z) was re-derived;
   ht(z) <= e^r ht(z0) on B). The displayed consequence, exponent of P equal to -1 for every
   sigma, follows from the algebra and was re-derived.
3. Lemma 5, sign. With (a_s) acting by y -> e^s y, the push-forward is
   (a_s)_* m_sigma = e^(-(2 sigma - 1) s) m_sigma, not e^(+(2 sigma - 1) s) (substitute y' = e^s y in
   the integral). Convention-level; "A-conformal of exponent 2 sigma - 1 up to sign" is what is
   used. The Hecke relation T_p nu_y = p^(-1/2)(nu_{py} + p nu_{y/p}) and
   T_p m_sigma = (p^(2 sigma - 1/2) + p^(1/2 - 2 sigma)) m_sigma were re-derived and are correct.
4. Section 6, uniqueness claim labelled PROVED. "The Hecke relations fix the non-constant Fourier
   coefficients up to one scalar" is wrong as stated: T_p does not relate n > 0 to n < 0, so there
   are two scalars (even and odd parts under z -> -conj(z)). The conclusion holds for Im w != 0:
   the odd part is Gamma-invariant with zero constant term, hence an L^2 eigenfunction with
   non-real eigenvalue, hence 0 (argument of G1 (iii)); the even part minus c' E(., w) is
   a y^w + b y^(1-w), hence 0. For real w the argument given does not apply.

## Steps confirmed

- Lemma 1: re-derived (n^(-1/2) d (a/d)^w = (a/d)^(w-1/2)). Holds.
- Lemma 2: the Maass-Selberg formula and the substitution phi(w) = 0 at w = 1 - rho/2
  (xi(2 - rho) != 0) hold. The result did not test it numerically. Referee test (different cases
  from the result's run): direct integration of |Lambda^Y E|^2 over the standard fundamental
  domain (Parseval for y >= 1, 24 x 12 Gauss nodes below y = 1, 9 Fourier modes):

  | w | Y | numeric | formula | Y^(2s-1)/(2s-1) |
  |---|---|---|---|---|
  | 1 - rho_2/2 = 0.75 - 10.5110i | 1.3 | 2.28035085019827 | 2.28035085019828 | 2.28035085019828 |
  | 1 - rho_3/2 = 0.75 - 12.5054i | 1.7 | 2.60768096208105 | 2.60768096208106 | 2.60768096208106 |
  | 0.68 - 4.2i (off resonance, abs(phi) = 0.983) | 1.3 | 0.667299729488734 | 0.667299729488733 | 3.0529 |

  Agreement to 14 digits in all three. The third row also shows that at small |t| and Y the
  off-resonance correction is not small against the main term (0.667 against 3.05); the result's
  phrase "a bounded quantity against the main term Y^(2 sigma - 1)" is correct as Y -> infinity only.
- Check C rerun at other cases (sigma, t, P): (0.6, 12.51): 0.188 at 1e4, 0.179 at 1e6, limit
  0.1667; (0.75, -55.3): 0.360, 0.351, limit 0.3333; (0.9, 3.3): 0.473, 0.463, limit 0.4444.
  Consistent with the result: sigma moves the constant, not the exponent. Convergence is
  logarithmic, as expected from the prime number theorem.
- Proposition 4 (EIS-w passes every step): correct, and immediate from the classical properties of
  E(., w'). It is the decisive point of the lane and it is a classical fact, not a new theorem; the
  result does not present it as one. The window-translate identification
  tau^eps_w = tau_{w - i alpha} for eps(n) = n^(-i alpha) was re-derived.
- Statement 6 is labelled ARGUED/MEASURED; the unfolding identity and the Rankin-Selberg series
  (u + conj(u) = 2 sigma - 1, u - conj(u) = 2it) were re-derived; the vanishing of the residues at
  s = 1 +- 2it at a resonance follows from zeta(2 - 2 conj(w)) = 0 there. Not a proof of the limit,
  as the result says.
- |phi| bounded on sigma >= 1/2 + delta, |t| >= 1: holds (Stirling gives |t|^(-1/2), convexity for
  zeta(2w - 1) gives |t|^(1 - sigma), 1/zeta(2w) bounded).
- Zagier's criterion is recalled correctly and labelled classical.

## Controls (referee's reading)

| control | result's claim | referee |
|---|---|---|
| U, THIN, sign twists | fail at (a) | confirmed, with repair 1 |
| window translate | passes (case of EIS-w) | confirmed |
| DH-type on Gamma_1(5) | fails at (b) | NOT established: object is identically 0 (Error 1) |
| EIS-w | passes every step | confirmed (run at 0.68 - 4.2i: Maass-Selberg, eigen-relations hold) |
| zeta(s+a)zeta(s-a), T-NR, Beurling, backward heat, phase-rotated transfer, theta^w | not run | not run |
| non-arithmetic group | fails at (b) | accepted as stated (no Hecke correspondences); not tested |

No zeta-only mechanism is claimed, so there was no mechanism to test against the controls beyond
the above; the passing control EIS-w is the content of the obstruction.

## Requirement flags (strict)

- R1 false: the joint Hecke relation is a hypothesis; its output is independent of sigma.
- R2 false: a gamma-uniform bound that locates nothing.
- R3 false: EIS-w and the window translate pass; DH is not run (Error 1); five controls not run.
- R4 false: no passage to the line; no sign from entropy.

## What survives

Precise obstruction for the device "joint Hecke recurrence + measure rigidity on Eisenstein
resonance states on PSL_2(Z)\H": (i) truncated mass at a resonance is Y^(2 sigma - 1)/(2 sigma - 1)
(Maass-Selberg, confirmed numerically at two further zeros); (ii) the recurrence inequality of
Lemma 3 (with m counted with Gamma-multiplicity) has P-exponent -1 for every sigma in (1/2, 1);
(iii) E(., w') off resonance satisfies every hypothesis the device reads; (iv) m_sigma is an
N-invariant, A-conformal joint Hecke eigen-measure for every sigma > 1/2; (v) U, THIN and sign
twists fail at Gamma-invariance. Not surviving: the DH row. Statement 6 and item (1) of section 5
remain argued/measured. The pivot is Zagier's criterion (classical).

## Requested corrections to RESULT.md and DEVICE_NODE.json (not applied by the referee)

1. Withdraw Lemma G2 (i) and the DH row; mark DH "not run (complex characters mod 5 are odd; a
   weight-0 object does not exist)". Remove the DH clause from `class_control` in DEVICE_NODE.json.
2. Redefine m in Lemma 3 with Gamma-multiplicity.
3. Fix the sign in Lemma 5; add the one-line extension to Lemma G1; correct the uniqueness proof
   in section 6 (two scalars, odd part killed by the L^2 argument, Im w != 0).
