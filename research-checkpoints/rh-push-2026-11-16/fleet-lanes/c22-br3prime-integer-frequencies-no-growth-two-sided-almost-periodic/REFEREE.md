# REFEREE.md (author's adversarial pass; NOT an independent referee; referees = 0)

Lane `c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic`. This pass was written by the
author of RESULT.md after the result, attacking each statement. It does not count as a referee.

## Attacks and outcomes

A1. Lemma L: is uniform convergence on the vertical lines enough to take the mean termwise? Yes: the
expansions are absolutely convergent at Re s = c and Re s = c', so sum abs(h(m)) (n/m)^c is finite and the mean
of each term is 0 or the coefficient. Is the hypothesis c' < 0 < 1 < c needed? Only that both expansions
converge absolutely on the two lines. HOLDS.

A2. Theorem L+: the comparison function. v = Re cos(kappa'((sigma - sigma_0) + it)) is harmonic;
cos(kappa'(sigma - sigma_0)) >= cos(kappa' w/2) > 0 needs kappa' w/2 < pi/2. log abs(F) is subharmonic (F analytic on the
closed rectangle). On the horizontal sides the hypothesis bounds abs(H); abs(F) <= abs(P) abs(H) adds a
polynomial factor, absorbed in C'. The maximum principle is applied on each closed rectangle Q_j, and every
point of S lies in Q_j for j large. HOLDS. Gap noted: the two sequences are both required. With a bound on
upper crossings only nothing follows (the rectangle has no bottom); RESULT.md states 'one sign' in the
negation correctly.

A3. Theorem H+: relies on Theorem H of c21 (zero referees there). Inherited, flagged in weakest step 1.

A4. Proposition E (b): Borel-Caratheodory needs E analytic on the closed disc of radius R: true (E entire).
The centre value is bounded by B. The bound gives abs(E) <= 2(1 + 2 eps)/eps exp(C e^(kappa T)) + const on the
crossing, of the form required by L+ with a larger C. E has no constant term on either side, so L+ gives
E = 0. HOLDS. The statement needs H zero-free and pole-free on C (so that E(s) - E(1 - s) is defined on a
connected set containing s = 1/2); for H zero-free only in the strip the same proof works on the strip
union the two half-planes, which is C. HOLDS.

A5. Lemma M: orientation and normalisation were checked numerically (HQ1, HQ3: (pi/T) sum of residues
reproduces h(2), h(4), h(8) to 12 digits; for HQ3 the lattice sum is exact at every K because the
geometric sum has ratio 1). For non-integer x and for integers outside the powers of q the mean decays
like 1/K (measured). The Gaussian identity was checked at non-integer x = 2.5 as well. HOLDS at the
measured points; the proof is a contour shift with absolutely convergent expansions.

A6. Corollary M1 (b) is stated loosely for unequal T_j^+, T_j^-; the precise form is with (T_j^+ + T_j^-)/(2 pi)
in place of T/pi. EDITORIAL.

A7. Proposition ART: (i) the local factor at an unramified prime of a product of Artin L-functions with
integer exponents is exp(sum_k psi(Frob^k) y^k/k): yes (log det(1 - rho(g) y)^-1 = sum tr rho(g^k) y^k/k).
(ii) 'abs(alpha_p) <= 1' is used at g = 1 only through alpha = alpha^2; in fact psi(1) = alpha^k for all k forces
alpha in {0, 1} without the size bound. (iii) After the reduction the finitely many modified factors have
poles on Re s = log abs(alpha_p)/log p <= 0, so Lemma 1 of c21 applies; here the size bound IS used (a factor
with abs(alpha_p) > p^(1/2) would put a pole lattice in Re s > 1/2). (iv) The brute-force check found only 0 and
the linear characters on C4, C6, C2 x C2, C2 x C4, S3. HOLDS relative to the recalled theorems.
Limit of the statement: it covers a countable class; it says nothing about the open part of BR-3'.

A8. QUAD: are chi_12, chi_40, chi_8, chi_60 primitive and even with root number 1? 8, 12, 40, 60 are positive
fundamental discriminants (8 = 4 * 2, 12 = 4 * 3, 40 = 4 * 10, 60 = 4 * 15 with 2, 3, 10, 15 = 2 or 3 mod 4 and
squarefree). Evenness and sum 0 were checked on the tables; the symmetry of R was measured at four points
to 3e-41, which also tests the conductor identity. The local factor at 2, 3, 5 (ramified) was not examined;
the member is used only as an example of the pole clause and shape failing together. HOLDS.
Not checked: whether a member of this type is already in the map under another name.

A9. Section 4 (i): 'sum over S of (log q)^-gamma finite implies sum q^(-1/2) finite' is immediate
(q^(-1/2) <= (log q)^-gamma for large q). HOLDS.

A10. Section 6 remark (theta group, Knopp): from memory; not verified; marked ARGUED and not used. The
sentence that solutions exist for frequencies (1/2) log n is a conjecture of this pass, not a result.
WEAK; must not be quoted as established.

A11. Does anything here concern zeros of zeta? No. Corollary M1 (d) mentions zeros of zeta only as the
possible location of poles of H for a hypothetical twin.

## Verdict of the pass

Statements 1 to 5 of RESULT.md section 0 hold on this pass at the stated labels. BR-3' is not decided.
Flags R1 to R4 false. One editorial point (A6). The lane needs an independent referee for L+ (A2), for
ART (A7) and for the source of Theorem H (A3).

---

# Independent referee pass (lens: general), 2026-11-20

Separate process from the author. The author's pass above is left as written. No file other than this one
was added to the lane; the check script was run from a scratch location (local, `scripts/memcap.sh 8`,
python3.14, mpmath 40 digits, under 30 s; server not used) and its output is copied in R.3. Sources opened:
`BRIEF.md` to the end, `RESULT.md`, the author's pass, `checks.py`, `ref_check.py`, `MAP_ROW.md`; c21-br0
`RESULT.md` section 2 (Lemma 1, Theorem H, Theorem H') and its referee correction E1; c20 Theorem A
(statement and hypothesis (H)); statements of Theorem W and Lemma P0; a text search of `OBSTRUCTION_MAP.md`.

## R.1 Verdict

**Holds as a precise obstruction with identification statements only (score 0). Every PROVED step was
re-derived and confirmed. Six corrections (G1 to G6): none changes a proved statement; G1 and G4 change
labels or wording that a reader of the map could misread.** No statement about zeros of zeta is made, RH
is not assumed anywhere (the one GRH remark, on QUAD, is marked as conditional), verified height is not
used. BR-3' stays open. This pass counts as one referee for Lemma L, Theorem L+, Proposition E, Lemma M,
(M_T), Corollary L1, Corollary M1, Proposition ART (relative to the recalled classical inputs) and member
QUAD; Theorem H+ is confirmed relative to Theorem H of c21 (one referee there).

## R.2 Re-derivations

Lemma L. On Re s = c, H n^s = sum h(m) (n/m)^s converges uniformly; the mean over [-T, T] of (n/m)^(it) tends
to 0 for m != n; limit h(n). On Re s = c', sum k(m) (mn)^s, mn >= 2; limit 0. Cauchy: the two vertical
integrals differ by the horizontal ones, at most 2 w n^c sup abs(H); divided by 2T. Same with n^-s.
CONFIRMED. See G1.

Theorem L+. F = P H/(s - c' + 1)^d is analytic on S; abs(P)/abs(s - c' + 1)^d is bounded on S (Re(s - c' + 1) >= 1),
so F is bounded on the vertical lines and at most exp(C' e^(kappa T)) on the crossings.
v = Re cos(kappa'(s - sigma_0)) is harmonic, v >= cos(kappa' w/2) cosh(kappa' t) > 0 on S because kappa' w/2 < pi/2.
log abs(F) - log M - eta v is subharmonic on the open rectangle and upper semicontinuous on its closure;
<= 0 on the vertical sides; on the horizontal sides C' e^(kappa T) - eta delta cosh(kappa' T) -> -infinity because
kappa' > kappa and both T_j^+ and T_j^- tend to infinity. Each point of S lies in Q_j for j large, eta -> 0:
abs(F) <= M on S. Then H is bounded on S outside a compact set and the mean argument with finitely many
residues gives h(n) = k(n) = 0, n >= 2. CONFIRMED. No pole can lie on Re s = c or c' (absolute convergence
on the closed half-planes), so the rectangle is admissible.

Theorem H+. F = P G/(s + 2)^A with A >= deg P + 1/2 + delta: bounded on Re s = 1 + delta (absolute convergence)
and on Re s = -delta (abs chi(s) is of size abs(t)^(1/2 + delta)). The comparison above gives the polynomial
bound on the strip, which is step 1 of Theorem H in the form used by H' (steps 2 to 4 with c = 1 + delta).
CONFIRMED relative to c21. The wording respects correction E1 of the c21 referee (strip
-delta <= Re s <= 1 + delta, not 0 <= Re s <= 1).

Corollary L1. Negation of 'both sequences exist' is 'for one sign the bound fails for all large T'.
The sign can be taken independent of (kappa, C): the set of (kappa, C) for which a sequence exists on a given
side is upward closed, so if each side had a sequence for some pair, both would for the larger pair.
(ii), (iii): H and N = 1/H both have the two expansions (1/G = prod (1 - alpha_p p^-s) converges absolutely
for Re s > 1). Real alpha_p: abs(H(conj s)) = abs(H(s)), both signs. CONFIRMED.

Proposition E. E(s) - E(1 - s) is a constant in 2 pi i Z, zero at s = 1/2. (a) convergence everywhere gives
absolute convergence everywhere; the two absolutely convergent trigonometric series on Re s = 1/2 have
frequencies -log n and +log n, common only at 0; coefficients vanish. (Shorter: E is then bounded on every
right half-plane, by symmetry on C, so constant.) (b) Borel-Caratheodory with centre 1 + eps + iT, r = 1 + 2 eps,
R = 1 + 3 eps: the closed small disc contains the crossing (distance from the centre to -eps + iT is exactly
r); abs(E(centre)) <= B; max over the circle of Re E = log abs(H) is the hypothesis. The bound has the form
needed in L+ (width 1 + 2 eps, kappa < pi/(1 + 2 eps)), and E has both expansions with zero constant term.
CONFIRMED.

Lemma M. Asymmetric rectangle: the mean of e^(i lambda t) over [-T^-, T^+] is at most 2/(abs(lambda)(T^+ + T^-));
termwise limit by dominated convergence. Right side gives h(x), left side k(1/x); orientation gives
(2 pi/(T^+ + T^-)) sum Res -> h(x) - k(1/x). CONFIRMED. The H'/H form: coefficient of p^(-ks) in H'/H is
-(alpha_p^k - 1) log p, residue of H'/H at rho is m_rho, left expansion contributes nothing at x = n >= 2; the
limit (1 - alpha_p^k) log p is right, and for G = 1 (alpha = 0, poles of H at zeros of zeta, m = -1) it is the
two-sided Landau formula with the correct sign. CONFIRMED.

(M_T). (1/(2 pi i)) int y^s e^((s - 1/2)^2/T^2) ds = y^(1/2) (1/(2 pi)) int y^(iu) e^(-u^2/T^2) du
= (T/(2 pi^(1/2))) y^(1/2) e^(-T^2 log^2 y/4). Right line: y = x/m with h(m); left line: y = xm with
k(m) = h(m)/m, giving h(m) m^(-1/2) x^(1/2). Horizontal sides: abs(e^((s - 1/2)^2/T^2)) <= const e^(-T_j^2/T^2).
CONFIRMED.

Corollary M1. (a) a twin has h(n) != 0 for some n >= 2, so the residue sum grows linearly. (c)
h(p^k) = alpha_p^(k - 1)(alpha_p - 1). Theorem A of c20 applies: for n_p(y) = (1 - alpha_p y)/(1 - y),
delta_p <= abs(1 - alpha_p) p^(-1/2)/(1 - p^(-1/2)), so sum abs(1 - alpha_p) p^(-1/2) finite is hypothesis (H).
CONFIRMED relative to c20 Theorem A (one referee there). See G3, G4.

Proposition ART. exp(sum psi(g^k) y^k/k) = (1 - alpha y)^-1 iff psi(g^k) = alpha^k for all k. g = 1 gives
alpha = alpha^2. psi(1) = 1: psi(g)^(ord g) = 1, abs(psi) = 1 on Gamma, (psi, psi) = sum n_j^2 = 1, psi = +-chi_j,
psi(1) = 1 forces a linear character. psi(1) = 0: psi = 0. Then G = L(s, chi) (or 1) times finitely many
factors (1 - chi(p) p^-s)/(1 - alpha_p p^-s), whose poles lie on Re s <= 0; Lemma 1 of c21 needs only 'finitely
many poles in Re s >= 1/2' and Theorem H then gives G = zeta. CONFIRMED relative to Chebotarev, to
'a linear character of Gal(K/Q) is a Dirichlet character' and to Theorem H. See G5.

QUAD. 8, 12, 40, 60 are positive fundamental discriminants; the completed functions have the same gamma
factor and 12 * 40 = 8 * 60, so R(s) = R(1 - s). The product of the four characters is (480^2/.), principal;
(2/.), (3/.), (15/.) are independent, so each of the eight sign patterns has density 1/8 and the two
non-geometric patterns have density 1/4. Infinitely many poles of G = zeta R: otherwise Theorem H would
give G = zeta. CONFIRMED. Ramified primes (not examined by the author): at 2 the factor is (1 - y)^-1; at 3
it is (1 + y)/(1 - y)^2, not geometric; at 5 it is (1 - y)^-1.

Statement 6 (i). sum over S of (log q)^-gamma finite, or sum q^-delta finite for all delta, implies
sum over S of q^(-1/2) finite; with abs(alpha_p) <= 1 this is the summable class of Theorem A. Matches the
hypotheses of Theorem W and Lemma P0 as written in their files. CONFIRMED.

## R.3 Numeric checks rerun with different cases

All cases differ from the author's (q = 3 in place of 2; other parameters; residues taken by a contour
circle, not by the closed form; an asymmetric rectangle; other groups; other points).

- (M_T), HQ3 with q = 3, (a, b) = (0.15, 0.3), T = 2, lattice sum abs(k) <= 200, coefficients to u^80:
  x = 3: 0.132906150562901146 on both sides, difference 6.3e-41; x = 9: 0.485633176432615146, 1.6e-40;
  x = 2: 0.0677895979904442895, 4.4e-41; x = 3.7: 0.176871012345265576, 6.9e-41.
- Lemma M, HQ1 with q = 3, eps = 0.7, asymmetric rectangles of (K1, K2) = (5, 20), (40, 160), (100, 400)
  lattice periods below and above, normalised by 2 pi/(T^+ + T^-): n = 3: 1.212435565 = 0.7 * 3^(1/2) at all
  three; n = 9: 4.2 = 0.7 * 2 * 3 at all three; n = 2: modulus 2.5e-2, 1.8e-3, 4.0e-4; n = 6: 1.1e-1, 8.3e-3,
  1.8e-3 (decay like 1/K). The asymmetric normalisation of the author's attack A6 is the right one.
- QUAD functional equation at three further points, 0.41 + 5.3i, -1.3 + 0.7i, 0.5 + 14.134725i:
  abs(R(s) - R(1 - s)) = 4.6e-41, 4.3e-42, 1.0e-40. Non-geometric primes 7 <= p < 20000: 569 of 2259
  (reproduced).
- A second member of the same type, with three characters: Q3 = L(s, chi_5) L(s, chi_8)/L(s, chi_40)
  (5 * 8 = 40, one gamma factor net): relative defect of gam(s) Q3(s) = gam(1 - s) Q3(1 - s) at the same three
  points 3.7e-41, 3.6e-41, 8.6e-42. Local factor (1 - chi_40 y)/((1 - chi_5 y)(1 - chi_8 y)): geometric with
  alpha_p = 1 unless chi_5 = chi_8 = -1, where it is (1 - y)/(1 + y)^2; 568 of 2259 primes. It has zeta's
  functional equation and no pole at 1.
- ART brute force on three groups outside the author's list (non-abelian, with characters of degree 2
  and 3): D4, Q8, A4, integer vectors with abs(n_j) <= 4: the solutions are 0 and the single linear
  characters only (D4, Q8: four linear characters; A4: three).

## R.4 Corrections

G1 (label). Lemma L is Liouville's theorem and Theorem L+ is Phragmen-Lindelof on rectangles followed by
Liouville: H is bounded on Re s >= c and on Re s <= c' by the two expansions, so 'bounded on S' makes H a
bounded entire function; under L+, H is meromorphic on C with finitely many poles and bounded near
infinity, hence rational, and H - h(1) = O(2^-sigma) as sigma -> +infinity forces H = h(1). The mean
computation is correct but is not needed. The proof of Phragmen-Lindelof with the growth bound on a
sequence of crossings is the textbook proof. These statements should carry CLASSICAL for content; the
file already says nothing is new against the literature, and the map row should not present the
'sequence of crossings' form as a new theorem.

G2 (inexact sentence, section 4 (i)). 'For abs(alpha_p) <= 1 ... the poles of H in the strip are not poles of
any factor' is wrong when abs(alpha_p) = 1, alpha_p != 1: that factor has its pole lattice on Re s = 0, inside
the closed strip -eps <= Re s <= 1 + eps. Also the poles of H may lie anywhere in 0 <= Re s <= 1, not only where
'the product diverges in 1/2 < Re s <= 1'. The conclusion drawn (the sparse tools do not apply) does not
depend on the sentence.

G3 (wording, Corollary M1 (b)). For a pole of order above 1 the residue of H n^s contains powers of
log n; 'weighted by abs(residue) n^(Re rho)' is exact only for simple poles. The inequality with
abs(Res(H n^s)) is right as written.

G4 (three different notions of 'tame'). L+ reads abs(H) <= exp(C e^(kappa T)) on the crossings; (M_T) reads
exp(o(T^2)); Lemma M reads integral of abs(H) over the crossing = o(T). Section 6 defines the tame kind by
the third, the narrowest. Consequences: (i) 'infinitely many poles of H' already follows from the first
(Theorem L+), so the dichotomy 'tame or wild' holds in the stronger form: a twin has infinitely many
poles of H, or exceeds exp(C e^(kappa T)) on every high crossing (one sign); (ii) the 'wild kind' of
section 6 without a finite-pole clause only says that the integral of abs(H) over each high crossing is at
least cT, a linear bound; the phrase 'wild on every high crossing' in the claim line must not be read
as the double exponential; (iii) for QUAD the hypothesis of Lemma M is not established: the unconditional
bound for 1/L on well-chosen heights is a power of T, not o(T) in mean, so 'QUAD meets (b)' holds
through (M_T) (Gaussian weights), not through Lemma M, unless a hypothesis of Lindelof type for 1/L is
added. The table entry 'tame: yes on a sequence (finite order)' is right only for the first two notions.

G5 (ART, sources). Brauer's theorem is listed as an input but is not used: after the character
computation G is a Dirichlet L-function times finitely many factors, and meromorphy of G is part of the
setting. The inputs actually used are Chebotarev, the identification of a linear character of Gal(K/Q)
with a Dirichlet character, Lemma 1 and Theorem H. The proposition is an instance of the known fact that
degree-one objects in the Artin class are Dirichlet L-functions; it is not new and is not presented as
new against the literature.

G6 (QUAD 'new member'). New only against a text search of the map (confirmed by a second search here:
no row with a quotient of Dirichlet L-functions of balanced conductor). The simpler member Q3 of R.3
shows the type is a family (any multiset identity of fundamental discriminants with equal conductor
product and equal count of gamma factors net of one); the map row should describe the family, not one
instance. Neither is an off-line control without a failure of GRH; the file says so.

## R.5 Controls

No zeta-only mechanism is claimed, so there is no mechanism to break with a control. Checked instead that
the file's own statement 'base-blind, not through multiplicativity' is right: Lemma L, L+, E, M use only
the two expansions and a growth or pole clause, and hold verbatim for a quotient F/DH with F in the
Davenport-Heilbronn class and for V6 with its two unsymmetric expansions (for V6 at x = 1: residues
2/log 6 at the poles i pi (2k + 1)/log 6, mean 2 = h(1) - k(1); verified by hand). Backward heat, theta^w,
T-NR, zeta(s + a) zeta(s - a), sign twist, unimodular twist: not in the class (symmetry clause), as stated.
ART is the only step reading multiplicativity and it is an identification inside a countable class.

## R.6 Requirement flags set by this pass

| Flag | Value | Reason |
|---|---|---|
| R1 | false | L, L+, H+, E, M hold for any Dirichlet series with the symmetry; ART uses multiplicativity only to identify members of the Artin class |
| R2 | false | no statement about zeta in any window; the every-crossing statements concern a hypothetical twin |
| R3 | false | every rejection is by pole, spectrum, growth or symmetry clause; the statements hold at the DH base and for V6 in unsymmetric form |
| R4 | false | continuation across the strip is a hypothesis throughout |

Statement about zeros of zeta: none. Referee count for this lane after this pass: 1.
