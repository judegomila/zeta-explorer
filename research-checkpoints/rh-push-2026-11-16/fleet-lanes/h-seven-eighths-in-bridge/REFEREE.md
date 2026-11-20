# REFEREE: h-seven-eighths-in-bridge

Date 2026-11-16. Verdict: the claimed verdict (precise obstruction, no bound moves, 7/8 imported) HOLDS after three
corrections. W1-W4 and the wall arithmetic are confirmed by re-derivation. The Davenport-Heilbronn (DH) measurement
is confirmed by an independent computation. Two statements are overstated (the 1/3 floor; linearity of the probe),
and the dictionary of section 2 is part identity, part analogy. No RH assumption found. No Hecke-operator error
found, because no Hecke operator is used (see H below).

Checker scripts (not kept in the repo): /tmp/ref-h78/v.py (DH), /tmp/ref-h78/ct.py (rerun of cover_tests.py).

## Re-derivations (confirmed)

- W1. Pair-grouped L(z) = sum 1/(z - z_rho) for even F; Re L = sum (x - b_rho)/|z - z_rho|^2 converges absolutely.
  (i)=>(ii) termwise. (ii)=>(iii) Herglotz kernel of G(w) = L(a+w), with z + conj z' - 2a = w + conj w'.
  (iii)=>(i) diagonal gives Re L >= 0, impossible near a pole of positive residue. Confirmed. The remark
  P >= 0 => P^(a) >= 0 holds for complex nodes too: (z + conj w)/(z + conj w - 2a) = 1 + 2a/((z-a) + conj(w-a)).
- W2. 1/(z - z_rho) + 1/(z + z_rho) = 2z/(z^2 - z_rho^2), so M = L/(2z) = sum over pairs 1/(s - z_rho^2). With
  t = Im s = 2 b gamma, Re s = b^2 - t^2/(4 b^2), increasing in b^2. Confirmed for a > 0 (the statement is
  degenerate at a = 0, and the proof needs the case b = 0 separately: s = -gamma^2 <= a^2). The parabola
  t^2 = -4a^2 (Re s - a^2) has focus at s = 0 and focal length a^2: "focal parameter 9/64" is correct.
- W3. |S| < 1 iff Re L > 0 for alpha > 0. (i) confirmed, including the converse (S is regular at zeros of F, where
  S = -1; a Schur bound gives Re L >= 0 near a pole of L). (ii): the quartet identity
  (x-b)/((x-b)^2+t^2) + (x+b)/((x+b)^2+t^2) = 2x(x^2 + t^2 - b^2)/(...) re-derived; Re L < 0 only in the open
  half-disks. (iii) rests on sq-hankel-traces Thm 3 (unrefereed); not re-derived; the lane flags it.
- W4. H_t = exp(-t d_z^2) H_0, s = 1/2 + i z/2, so d_z^2 = -(1/4) d_s^2 and tau = t. Delta = 2 b_0 = 3/4,
  half-width in s = (1/2) sqrt(9/16 - 2 tau) = sqrt(9/64 - tau/2), closing at 9/32. Check: b_0 = 1/2 gives
  Lambda <= 1/2. Confirmed. Lambda <= 2 d^2 confirmed.
- "A Lambda bound gives no wall". Correct as an implication statement. The cited b-escape-law Theorem A is about
  H_{-tau}; to get "real-rooted at time T, no strip at time 0" for arbitrary T > 0 one needs the rescaling
  z -> c z, t -> c^2 t, which the lane does not state. The example is then a member of the abstract class, not xi.
  For xi itself no implication from Lambda to a strip narrower than 1/2 is known. Statement stands.
- Wall arithmetic against the manuscript (paper.txt (12.3), (12.4)): b = 1/8, h = 13/16, l = 1/6, lx = 17/48,
  ly = 23/48, M = 5/6. C(s) = s - 1 + lx/2 + h/6 = s - 11/16 (manuscript C_II) and low exponent
  lx/2 + b/12 = 3/16 (manuscript target). Crossing: sigma_0 = 1 - h/6 + b/12 = 7/8. Part I: s - 2/3, 11/12.
  The two displayed forms of d are algebraically identical. Confirmed.
- T1 (Gauss lemma for the sextic symbol): a^{(N-1)/6} prod R = zeta^{sum e} prod R mod pi. Confirmed; rerun 705/705.
- T2, T3, T4 reproduced bit for bit.
- kappa sensitivity: (0.8748869894 - 0.8748866496)/(0.75 - 0.749773294) = 1.5e-3. Confirmed.

## DH control, independent computation

- DH(s) = 5^{-s}[zeta(s,1/5) + xi zeta(s,2/5) - xi zeta(s,3/5) - zeta(s,4/5)]; functional equation checked at
  s = 0.3 + 7.1i to 24 digits; DH = c L(chi) + conj(c) L(chibar) with c = (1 - i xi)/2 checked.
- Zero rho = 0.8085171825 + 85.6993484854 i, |DH(rho)| = 6e-26.
- DH'(rho) = 1.2323 - 0.2415 i, so the Dirichlet inverse has a simple pole of residue modulus 0.79633 and the
  predicted growth of its partial sum at rho is ln 2/|DH'(rho)| = 0.55198 per doubling. Measured (my own sieve and
  inverse, N = 2e6, Cesaro weights): 9.2863, 9.8375, 10.3896, 10.9423, increments 0.5512, 0.5520, 0.5528.
  Sharp cutoffs: 10.105, 10.649, 11.196, 11.738. Confirmed.
- Moebius twist: c/L(rho, chi) + conj(c)/L(rho, chibar) = 0.7585 - 0.1743 i, modulus 0.778. Measured partial sums
  0.7636, 0.7609, 0.7602, 0.7625 (Cesaro), no growth. Confirmed.
- a(4) - a(2)^2 = -1.0807 confirmed. Dirichlet inverse checked by convolution at n = 12, 360, 1001.

So the measured statement "the Moebius twist has no pole at the DH zero, the Dirichlet inverse has a simple pole
there" is correct.

## Errors and overstatements

E1 (scope error in Lemma 4.1, load-bearing for the named DH failure step). "The probe I_eta is linear in the
   target" is true for the base probe (6.1), which gives 11/12 (Part I). The probe that gives 7/8 is the modified
   probe (12.5):
   sum over prime tuples of (-1)^|J| q^{-3/2} eta(p_{J^c}) I_{eta; p_{J^c}}(X/q, Y/q, Z q).
   It contains the factor eta(p_{J^c}) times a term linear in eta, so as a function of eta it has degree up to
   K + 1. It is linear only after one decides to extend it linearly from characters. For a non-multiplicative
   target f there are two inequivalent extensions: (A) linear extension, signal c_1 H_1/L_1 + c_2 H_2/L_2 as the
   lane says; (B) substitute f for eta, in which case the marked-minus-rescaled compensation at each slot prime
   (which uses eta(p) eta(a) = eta(p a)) no longer cancels the scalar prime contribution. In both cases the
   detector does not see the zeros of the sum, and in both cases the reason is failure of complete
   multiplicativity, so the conclusion survives. The step name must be corrected: for Part I, Lemma 7.1 (local
   identity giving 1/L(x, eta chi(u))); for Part II, additionally the compensation identity (12.5)/section 16.
   Also the auxiliary data (S, b*, xi, Xi) are chosen per target; linearity needs one common choice for eta_1, eta_2.

E2 (DH is not literally a target). The manuscript's targets are Hecke characters of Q(sqrt -3). DH is a Dirichlet
   series over Z. The object the detector can be fed is c_1 eta_1 + c_2 eta_2 with eta_i = chi_i o N, whose
   Dirichlet series is c_1 L(s,chi) L(s,chi chi_{-3}) + c_2 L(s,chibar) L(s,chibar chi_{-3}), not DH. The numerical
   test is over Z with the rational Moebius function: it measures the Dirichlet-inverse lemma on DH, not the
   detector. "MEASURED on DH itself" should read "the lemma measured on DH; the detector statement is by
   linearity/analogue over Z[omega]".

E3 (overstated, already corrected by a referee elsewhere). "No setting of lengths, counts or sieves gets below 1/3
   with a 6-fold deck group", "1/3 is fixed by the deck group", "capped at d = 1/3", and section 5.2 "h <= 1
   because the compensated probe needs lx >= l (manuscript (12.5))". r3-method-limit REFEREE E2 found that
   lx >= l is a modelling hypothesis, not a source constraint (manuscript Def. 10.1 does not impose it; Liu II
   sec. 15.1 relaxes it). The source-grounded form is M >= 2l, under which d >= 1/3 follows from
   d = 1/3 + (M - 2l)/12 only while the polar term b/12 is kept. With the polar term removed (full TRO6) and
   M >= 2l the reduced system has no floor (and returns values below 1/2, so it is then not a valid system:
   r3-method-limit REFEREE E3). Hence also section 5.4 "this would act on the b/(2r) term only (at most 1/96)" is
   not established outside lx >= l. Correct statement: d >= 1/3 for r = 6 under lx >= l (model), or under M >= 2l
   with the polar term kept. The split 3/8 = 1/3 + 1/24 is exact arithmetic; calling the first term "fixed by the
   deck group" is a reading conditional on that hypothesis.

E4 (dictionary: identity versus analogy). Row by row:
   - identities: Aut(C/Z[omega]) = mu_6; T1 (Gauss lemma); Kummer row = isotypic projection; absorption (a).
   - analogy / standard identification not derived here: "Gauss sum = holonomy at the branch divisor";
     "theta coefficients = section on the 3-fold metaplectic cover" (Patterson, recalled); "reflection (R) = Fricke-
     type involution, the same kind of object as the involution of the loaded torus". The table labels the last one
     "PROVED-rel 7/8 Prop 5.1"; Prop 5.1 proves a reflection formula, not this identification. Label should be
     RECALLED/analogy. The lane's own weakest step 1 says so.
   - "mu_2 gives inversion" is a slogan on top of a trivial identity. (a) is g(chi) g(rho) = J(chi, rho) g(chi rho)
     with mu(pi) = -1 written on both sides; the sign exists for every pair of characters (Weil: -J is a
     Groessencharacter). What singles out rho is that g(rho) is sqrt(N pi) times a periodic sign
     (zf-higher-rows Thm 1(b), (e)). In the manuscript the Moebius factor enters through (4.7),
     gamma_2(c) = mu(c) alpha(c) G(c)/gamma_1(c), and the reciprocal 1/L(x, eta chi(u)) through Lemma 7.1, which
     uses eta(p^k) = eta(p)^k. So inversion needs: Weil sign + elementary g(rho) + complete multiplicativity of eta.
     Section 5.1 itself notes that the spin factor alone cannot produce the sign.
   - "Sum over rows keeps sixth powers": the Poisson side keeps all rows u a^6, u sixth-power-free; the rows u != 1
     are bounded, not removed by orthogonality.
   - (D1) "the mismatch is the signal" and "split locus of dimension 1/6 / 1/2" are readings, not statements with
     a proof.

E5 (minor). W2 needs a > 0. W1 residue is the multiplicity, not +1. T3 "r = 2 holonomy constant" is an artefact
   of sampling p = 1 mod 12: for p = 3 mod 4 the normalised quadratic Gauss sum is i. It is a function of p mod 4
   (still a character-type, non-equidistributed value), so the conclusion is unchanged.

## H. Hecke-theoretic check

The lane defines no Hecke operator, weight or level, so there is no normalisation to check. Relevant points:
- The degree-2 theta has weight 1/2; its Hecke algebra is generated by T_{p^2}; its twisted Mellin transforms are
  L(2s, chi). The lane states the last fact correctly and does not use T_p.
- "The family of twisted copies inverts only a simultaneous eigen-object" (section 4) must be read as "a
  completely multiplicative target, i.e. a GL(1) Hecke character". A GL(2) Hecke eigenform (multiplicative, not
  completely multiplicative) is an eigen-object and fails the lemma: its inverse is not mu a. Lemma 4.1 itself is
  stated correctly (completely multiplicative, a(1) = 1).
- Section 5.1 "the loaded torus sits at r = 2, ideal wall distance 0, detector circular" is MODEL: d(r) = 1/2 - 1/r
  is the r = 6 bookkeeping transplanted, and by E3 even at r = 6 the floor is conditional. "The symmetry line is
  at 1/2 because the split locus has dimension 1/2" is an analogy with no derivation.
- Theorem 1.1 of the manuscript covers Dirichlet L-functions (stated there), so "both constituents covered" is
  correct relative to the manuscript.

## Dependence on unrefereed inputs

openai/math manuscript (7/8, Prop 2.1, 5.1, Lemma 7.1, (12.4), (12.5)); sq-hankel-traces Thm 3 for W3(iii);
r3-method-limit and zf-higher-rows in their refereed-corrected forms; r != 6 columns are MODEL.

## Surviving claim

1. PROVED: W1, W2 (a > 0), W3(i),(ii): zeros within distance a of the line iff the shifted bridge kernel is PSD on
   Re z > a iff the poles of M lie in the parabola Re s <= a^2 - (Im s)^2/(4a^2) iff S(a + .) is Schur.
   PROVED-rel 7/8 + de Bruijn: tube half-width sqrt(9/64 - tau/2). These are restatements of the half-plane and
   carry no zero information beyond it. A Lambda bound gives no wall.
2. PROVED-rel 7/8 (arithmetic): d = 1/2 - h/6 + b/12 = 1/3 + (M - 2l)/12 = 3/8 at the manuscript geometry. The
   lower bound d >= 1/3 is conditional (lx >= l, or M >= 2l with the polar term kept).
3. PROVED + MEASURED: a Moebius-twisted sum of a non-multiplicative sequence is not its Dirichlet inverse; on DH
   the inverse has a simple pole at 0.8085 + 85.6993 i (residue modulus 0.7963) and the twist is regular there
   (value modulus 0.778). The 7/8 detector uses complete multiplicativity of the target at Lemma 7.1 and at (12.5);
   the Part II probe is not linear in the target.
4. Dictionary: T1 and the absorption identity are identities; the cover/holonomy/Fricke rows and "mu_2 = inversion,
   mu_3 = automorphy" are standard identifications and readings, not derived.
5. No bound moves. No abscissa below 0.874886647 or 7/8 is obtained.
