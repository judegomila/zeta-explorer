# c22-br3prime-integer-frequencies-no-growth-two-sided-almost-periodic: RESULT

Date 2026-11-20. Round 22, kind: deepen. Scope: this directory only. Server: not used (the decisive first
test is a paper test; the numerics are sanity checks of identities, under 20 s, run locally through
`scripts/memcap.sh 8`, python3.14, mpmath at 40 digits: `checks.py`, `ref_check.py`). Nothing committed or
pushed. No independent referee has read this file (referees = 0; `REFEREE.md` is the author's adversarial
pass and says so). **No statement about zeros of zeta is made. Every result below is an identification
(class U3) or a necessary condition on a twin; score 0.**
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument in this file; author only) / CLASSICAL (recalled; source not opened) /
MEASURED (mpmath, point values) / RELATIVE (to a file on record) / ARGUED / OPEN.

Sources read: `BRIEF.md` to the end; `c21-br0-br3-hamburger-finite-poles-regime3/RESULT.md` (Theorem H,
H', control NWM, BR-3'); `c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md` (Theorems A, B, C);
`OBSTRUCTION_MAP.md` section 2 rows ZQ, NR-q, HQ2, HQ3, HQ4, THIN, DEL; `c21-br2-sparse-pole-lattice-...`
(Theorem W, CYC) and `c21-br2-relative-product-...` (Lemma P0) for their statements;
`c21-c4-r1-flag-test-lemma-e-hq-beurling` for V6 and THIN x V6.

Setting. G(s) = prod over p of (1 - alpha_p p^-s)^-1, abs(alpha_p) <= 1, meromorphic on C,
gam(s) G(s) = gam(1 - s) G(1 - s), gam(s) = pi^(-s/2) Gamma(s/2). H = G/zeta, N = zeta/G = 1/H. In Re s > 1:
H(s) = sum h(n) n^-s, h multiplicative, h(p^k) = alpha_p^(k-1) (alpha_p - 1), abs(h(n)) <= 2^omega(n), absolutely
convergent; H(s) = H(1 - s), so in Re s < 0: H(s) = sum (h(n)/n) n^s. A twin is such a G != zeta.

## 0. Verdict

**BR-3' is not decided. Precise obstruction with five proved partial statements. No twin is displayed and
none is excluded in general. What is left is stated exactly in section 6.**

1. (Lemma L, PROVED, elementary; the assigned first lemma.) If H is analytic and bounded on
   -eps <= Re s <= 1 + eps then H = 1. Proof by Cauchy on rectangles applied to the mean
   (1/2T) int H(sigma + it) n^(sigma + it) dt; no theory of almost periodic functions is needed.
2. (Theorem L+, PROVED.) 'Bounded' can be replaced by: H has finitely many poles in the strip and there are
   heights T_j^+ -> +inf, T_j^- -> +inf with abs(H(sigma + i T_j^+)), abs(H(sigma - i T_j^-)) <= exp(C e^(kappa T))
   on the two horizontal segments, for some kappa < pi/(1 + 2 eps). **The growth bound is needed only on a
   sequence of horizontal crossings, not in the strip.** The same holds for Theorem H of c21 (Theorem H+):
   an ordinary Dirichlet series with zeta's functional equation and finitely many poles is a_1 zeta as soon
   as it is below exp(C e^(kappa abs t)), kappa < pi, on one sequence of crossings above and one below. So a
   twin with finitely many poles of G, or of G/zeta, or of zeta/G, exceeds exp(C e^(kappa T)) on every
   crossing of the strip at height T (or every one at height -T) for all large T, for every kappa < pi and C.
3. (Proposition E, PROVED; the 'entire case'.) If H has no zero and no pole (H = exp(E), E entire), then:
   (a) if the Dirichlet series of E converges everywhere, E = 0 (one line); (b) in general E = 0 unless
   log abs(H) exceeds exp(C e^(kappa T)) somewhere on every disc of radius 1 + 3 eps centred at 1 + eps + iT
   (or every one at 1 + eps - iT), T large: an upper bound on abs(H) alone, of triple exponential size,
   suffices (Borel-Caratheodory, then Theorem L+ for E).
4. (Lemma M, PROVED; exact for each T in Gaussian form.) If on a sequence of crossings the integral of
   abs(H) over the segment is o(T), then for every integer n >= 2
   **h(n) = lim (2 pi/(T_j^+ + T_j^-)) sum over poles rho of H in the rectangle of Res_(s = rho) H(s) n^s**,
   the same limit is 0 for real x > 1 not an integer, and -h(n)/n for n^-s. Gaussian form (M_T), valid for
   every T > 0 when abs(H) is below exp(o(t^2)) on a sequence of crossings: section 4. For H'/H it is
   Landau's formula for G relative to zeta. Consequence: a twin that is tame on a sequence of crossings
   has infinitely many poles of H, and the residue measure has a non-zero mean Fourier coefficient at
   log n for every n with h(n) != 0: at every n composed of primes with alpha_p not in {0, 1}, and at every
   prime with alpha_p != 1. By Theorem A (c20) these primes satisfy sum abs(1 - alpha_p) p^(-1/2) = infinity;
   they are infinitely many, with rationally independent logarithms. HQ1 to HQ4 resonate at one frequency
   (log q); MEASURED: (M_T) holds for HQ3 to 5e-40 at twelve (n, T); the mean formula reproduces h(2), h(4),
   h(8) for HQ1 and HQ3 to 12 digits and gives 0 at n = 3, 6, 12 at rate 1/K.
5. (Proposition ART, PROVED relative to Brauer, Chebotarev and Theorem H; brute-force check on five groups.)
   No twin is a product of integer powers of Artin L-functions times finitely many arbitrary local
   factors: a virtual character psi with psi(g^k) = psi(g)^k and abs(psi(g)) <= 1 on every class is 0 or one
   linear character (orthogonality: (psi, psi) = 1), and then Theorem H gives G = zeta. **This is the one
   step of the lane that reads the geometric local shape at a positive density of primes.** Its
   companion member QUAD = zeta(s) L(s, chi_12) L(s, chi_40)/(L(s, chi_8) L(s, chi_60)) has zeta's functional
   equation exactly (conductors 12 * 40 = 8 * 60, all characters even and real), an Euler product with
   unimodular parameters, finite order, integer frequencies; it is non-geometric at the primes with
   (chi_8, chi_60, chi_12, chi_40) = (1, 1, -1, -1) or (-1, -1, 1, 1) (density 1/4; 569 of 2259 primes below
   20000) and geometric elsewhere, and it has infinitely many poles (zeros of L(chi_8) L(chi_60)). It is
   not an off-line control unless GRH fails for one of the four characters.
6. (The question 'can the poles be those of an infinite product of geometric factors?') Not decided.
   Theorems W and P0 cannot be ported: with abs(alpha_p) <= 1 a set S sparse enough for them
   (sum over S of (log q)^-gamma finite, or sum q^-delta finite for every delta) has sum over S of
   p^(-1/2) finite, so Theorem A already gives G = zeta there; regime 3 begins where S is not sparse. The
   conditions of statement 4 are what a geometric twin with poles must meet; the lane has no construction
   and no contradiction.
7. Nothing raises a requirement score. Lemma L, L+, H+, E, M read the functional equation, the
   frequencies and a growth or pole clause; they hold for any Dirichlet series H = sum h(n) n^-s with
   H(s) = H(1 - s), multiplicative or not, and with any base in place of zeta. Proposition ART reads
   multiplicativity but is an identification inside a countable class.

Registered outcome: 'precise obstruction; identification statements only'.

## 1. Plan; what is new against the record

Plan as assigned: (1) write the two-sided lemma with every hypothesis and check it against HQ1 to HQ4, NWM,
CYC, V6, E_a; (2) decide whether the poles of a twin can come from an infinite product of geometric factors;
(3) the entire case.

Not new: Theorem H, H', NWM (c21); Theorem A, C (b) (c20), of which Lemma L is the form 'two half-planes and
a strip' and Theorem L+ the sharpening; Phragmen-Lindelof, the two-constants estimate, Borel-Caratheodory,
Landau's formula (classical). New against the campaign record: the growth clause reduced to a sequence of
crossings (L+, H+); Proposition E; Lemma M and the Gaussian identity as the link between the pole set of a
twin and its coefficients; Proposition ART and member QUAD; the remark that the sparse natural-boundary
tools lie inside the summable class when abs(alpha_p) <= 1; the two-branch statement of the residue
(section 6). Nothing is claimed new against the literature.

## 2. The lemma

Notation: for c' < 0 < 1 < c the closed strip S = {c' <= Re s <= c}, width w = c - c'. On Re s = c:
abs(H) <= M_c = sum abs(h(n)) n^-c; on Re s = c': abs(H) <= M_(1 - c').

**Lemma L (PROVED).** Let H be analytic on a neighbourhood of S, H(s) = sum h(n) n^-s absolutely convergent
on Re s >= c, H(s) = sum k(n) n^s absolutely convergent on Re s <= c' (for a twin k(n) = h(n)/n), and H
bounded on S. Then h(n) = 0 for n >= 2, k(n) = 0 for n >= 2 and H = h(1) = k(1).
Proof. Fix n >= 2. I(sigma, T) = (1/2T) int_(-T)^T H(sigma + it) n^(sigma + it) dt. On sigma = c:
H(s) n^s = sum h(m) (n/m)^s, uniformly convergent, so I(c, T) -> h(n). On sigma = c':
H(s) n^s = sum k(m) (mn)^s with mn >= 2, so I(c', T) -> 0. By Cauchy on the rectangle,
abs(I(c, T) - I(c', T)) <= (1/2T) 2 w n^c sup_S abs(H) -> 0. Hence h(n) = 0. With n^-s in place of n^s: k(n) = 0.
QED
Hypotheses used: analyticity in the strip; boundedness on horizontal segments (only); the two expansions
with spectra on opposite sides of 0; nothing about multiplicativity, the size of h, or the base zeta.

**Theorem L+ (PROVED).** In Lemma L replace 'analytic and bounded on S' by: H meromorphic on a neighbourhood
of S with finitely many poles there, and for some kappa < pi/w, C, and sequences T_j^+, T_j^- -> +inf:
abs(H(sigma + i T_j^+)) <= exp(C e^(kappa T_j^+)) and abs(H(sigma - i T_j^-)) <= exp(C e^(kappa T_j^-)) for c' <= sigma <= c.
Then the conclusion of Lemma L holds (and H has no pole).
Proof. Let P be the polynomial of the poles, d its degree, F = P H/(s - c' + 1)^d: analytic on S, bounded by
some M on both vertical lines, and below exp(C' e^(kappa T)) on the given crossings. Take kappa < kappa' < pi/w,
sigma_0 = (c + c')/2, v(sigma + it) = cos(kappa' (sigma - sigma_0)) cosh(kappa' t): harmonic, and
v >= delta cosh(kappa' t) on S with delta = cos(kappa' w/2) > 0. For eta > 0 the function
log abs(F) - log M - eta v is subharmonic on the rectangle Q_j = [c', c] x [-T_j^-, T_j^+], is <= 0 on its vertical
sides, and on its horizontal sides is <= C' e^(kappa T) - eta delta cosh(kappa' T) < 0 for j large. So
abs(F) <= M e^(eta v) on Q_j for all large j, hence on S; let eta -> 0: abs(F) <= M on S. So H is bounded on S
outside a compact set. In the proof of Lemma L the rectangle now gives
I(c, T) - I(c', T) = (pi/T)(sum of the finitely many residues of H n^s) + O(1/T) -> 0. Hence H is constant. QED

**Theorem H+ (PROVED relative to Theorem H of c21).** Let G = sum a_n n^-s converge absolutely in Re s > 1,
be meromorphic on C with finitely many poles, with zeta's functional equation, and suppose that for some
delta > 0, kappa < pi/(1 + 2 delta) there are crossings as in L+ of the strip -delta <= Re s <= 1 + delta on
which abs(G) <= exp(C e^(kappa T)). Then G = a_1 zeta. Proof: the argument above with F = P G/(s + 2)^A gives the
polynomial bound of step 1 of Theorem H; steps 2 to 4 are unchanged. QED

**Corollary L1 (PROVED).** Let G be a twin (or any G = sum a_n n^-s != a_1 zeta with zeta's functional
equation; no Euler product is used). For every kappa < pi, every C and every thin enough strip:
(i) if G has finitely many poles, then for one sign and all large T,
    max over the crossing at height +-T of abs(G) > exp(C e^(kappa T));
(ii) if G/zeta has finitely many poles (G vanishes at all but finitely many zeros of zeta, with
    multiplicity), the same for G/zeta;
(iii) if zeta/G has finitely many poles (all but finitely many zeros of G are zeros of zeta with at most
    zeta's multiplicity), the same for zeta/G.
A twin outside (i), (ii), (iii) is one for which G, G/zeta and zeta/G each have infinitely many poles. For
real alpha_p both signs hold (H(conj s) = conj H(s)).

**Proposition E (PROVED; the entire case).** Suppose H has no zero and no pole in C. Then H = exp(E) with E
entire, E(s) = E(1 - s), E(s) = sum over p, k of (alpha_p^k - 1) p^(-ks)/k in Re s > 1.
(a) If that Dirichlet series converges for every s, then E = 0 and G = zeta.
(b) If for some eps > 0, kappa < pi/(1 + 2 eps), C, and sequences T_j^+-,
    log abs(H(s)) <= exp(C e^(kappa T_j)) on the circles abs(s - (1 + eps +- i T_j^+-)) = 1 + 3 eps,
    then E = 0 and G = zeta.
Proof. H -> 1 as sigma -> +inf, so the branch of log H with E -> 0 is the series; E(s) - E(1 - s) is a constant
in 2 pi i Z, zero at s = 1/2. (a) An ordinary Dirichlet series convergent everywhere converges absolutely
everywhere; on the line Re s = 1/2, E(1/2 + it) = sum e(n) n^(-1/2) n^(-it) = sum e(n) n^(-1/2) n^(it), two
absolutely convergent trigonometric series with the same sum; uniqueness of coefficients gives e(n) = 0,
n >= 2. (b) abs(E) <= B = sum over p, k of 2 p^(-k(1 + eps))/k at the centres. Borel-Caratheodory with radii
r = 1 + 2 eps < R = 1 + 3 eps: abs(E) <= (2r/(R - r)) max Re E + ((R + r)/(R - r)) B on the smaller disc, which contains
the crossing of -eps <= Re s <= 1 + eps at height +-T_j. So E meets the hypothesis of Theorem L+ (larger C).
QED
Only an upper bound for abs(G/zeta) is asked. A zero-free, pole-free twin therefore has
log log log abs(G/zeta) >= kappa T at some point of every such disc (one sign, all large T).

## 3. The decisive first test: the lemma against the members on record

Statement tested: Theorem L+ ('H analytic with finitely many poles in the strip, tame on a sequence of
crossings, two expansions with spectra -log n and +log n, same constant term, implies H = 1').

| Member | H = member/zeta | H(s) = H(1 - s) | spectrum in {-log n} right, {+log n} left | finitely many poles in the strip | tame on crossings | Consistent because | Status |
|---|---|---|---|---|---|---|---|
| HQ1, HQ2 | 1 + eps u/(1 - u)^2, 1 + eps u^2/(1 - u)^4, u = q^(1/2 - s) | yes | yes (powers of q) | no: poles of order 2, 4 at 1/2 + 2 pi i k/log q | yes (periodic) | pole clause fails; Lemma M holds with the lattice residues (MEASURED for HQ1: h(2) = 1.414213562, h(4) = 4.0 reproduced at K = 10, 100, 400; n = 3: 0.106, -0.0137, 0.0035) | PROVED; MEASURED |
| HQ3, HQ4 | (1 -+ alpha u + u^2)/(1 - beta u + u^2) | yes | yes | no: simple poles at 1/2 +- b + 2 pi i k/log q | yes | same; (M_T) to 5e-40; h(2), h(4), h(8) = 0.0204247287741, 0.0583258605077, 0.125708739703 reproduced exactly at every K; n = 3, 6, 12: 1.5e-3, -2.0e-4, 2.1e-5, -1.0e-6 at K = 10 .. 10^4 | PROVED; MEASURED |
| NWM | 1 + R(s) | yes | no: continuous spectrum on [0, inf) (Dirichlet integral); R -> 0 on vertical lines, not almost periodic | yes (entire) | no: exp(exp(kappa abs t)/e) on every crossing, with kappa = pi/(width of the strip where R is unbounded) | two clauses fail: integer frequencies and growth; the growth meets the threshold of L+ with equality, so kappa < pi/w is sharp for real frequencies | RELATIVE (c21) |
| ZQ | rational function of s(1 - s) | yes | no: no Dirichlet series (a non-constant function tending to 1 along every vertical line has no trigonometric expansion) | yes (finitely many) | yes | spectrum clause fails | PROVED |
| NR-q | q^(s - 1/2) + c + q^(1/2 - s) | yes | no: frequencies +-log q on both sides, q irrational; unbounded as sigma -> +-inf | yes | yes | the expansions overlap in spectrum; H not bounded on the half-planes | PROVED |
| QUAD (new, section 5) | L(chi_12) L(chi_40)/(L(chi_8) L(chi_60)) | yes (MEASURED 3e-41 at four points) | yes | no: zeros of L(chi_8) L(chi_60) | yes on a sequence (finite order) | pole clause fails | PROVED; MEASURED |
| CYC | 1/(1 - w), w = Q^(1/2 - s) (product over generalised primes Q^(2^k)) | no: 1/(1 - 1/w) = -w/(1 - w) | no (Beurling frequencies) | no | yes | no functional equation, non-integer frequencies | RELATIVE (c21-br2) |
| V6 | (1 - 6^-s)/(1 + 6^-s) | no: H -> 1 right, H -> -1 left | right yes; left expansion -1 + 2 6^s - ... | no: poles on Re s = 0 | yes | not symmetric; note that it does have two one-sided expansions separated by a pole lattice, and Lemma M holds for it in the unsymmetric form, so the mechanism of this lane does not separate V6 from HQ1 to HQ4 | PROVED |
| THIN x V6, THIN, DEL | - | no functional equation; continuation known only to Re s > max(b - eta, b/3) | right only | - | - | no left expansion | RELATIVE (map) |
| E_a = zeta(s + a) zeta(s - a) | zeta(s + a) zeta(s - a)/zeta(s) | no (other gamma factor, degree 2) | right only | no | - | not in the class | CLASSICAL |
| DH | - | other functional equation | - | - | - | not in the class; Lemma L and L+ hold verbatim for H = F/DH with F in DH's class (base-blind) | ARGUED |

Every member is consistent with the lemma. The lemma is not falsified and it rejects each member through
the pole clause, the spectrum clause, the growth clause or the functional equation. No rejection goes
through multiplicativity. The registered expectation ('a twin has poles of H, or unbounded H, inside the
strip') is confirmed and sharpened to 'infinitely many poles of H, or H above exp(C e^(kappa T)) on every
high crossing'.

## 4. Twins with poles: the residue formula

**Lemma M (PROVED).** Let H be meromorphic on a neighbourhood of S with the two expansions of Lemma L, and
let T_j^+-, avoiding poles, satisfy int_(c')^c abs(H(sigma +- i T_j^+-)) d sigma = o(T_j^+ + T_j^-). Let Q_j be the
rectangle. Then for real x > 0, x != 1:
(2 pi/(T_j^+ + T_j^-)) sum over rho in Q_j of Res_(s = rho) (H(s) x^s) -> h(x) - k(1/x),
where h(x) = h(n) if x = n is an integer and 0 otherwise, k(1/x) = k(n) if 1/x = n and 0 otherwise. For x = 1
the limit is h(1) - k(1) (= 0 for a twin).
Proof. The proof of Lemma L, keeping the residues; the horizontal sides contribute
o(T) max(x^c, x^(c')). QED

**Gaussian form (M_T) (PROVED).** If instead sup over the crossing of abs(H) e^(-(1 - d) T_j^2/T^2) -> 0 for
some d > 0, then for that T and every real x > 0
sum over rho of Res_(s = rho) (H(s) x^s e^((s - 1/2)^2/T^2))
   = (T/(2 pi^(1/2))) x^(1/2) sum_m h(m) m^(-1/2) (e^(-T^2 log^2(x/m)/4) - e^(-T^2 log^2(x m)/4)),
the sum over rho taken as the limit over Q_j (for a twin; k(m) = h(m)/m). Proof: shift
(1/(2 pi i)) int H(s) x^s e^((s - 1/2)^2/T^2) ds from Re s = c to Re s = c'; on each line integrate the absolutely
convergent expansion termwise; (1/(2 pi i)) int_(Re s = c) y^s e^((s - 1/2)^2/T^2) ds = (T/(2 pi^(1/2))) y^(1/2) e^(-T^2 log^2 y/4)
for every c. QED. As T -> infinity the right side divided by T/(2 pi^(1/2)) tends to h(n) at x = n >= 2.

Applied to H'/H (same hypotheses for H'/H): with m_rho the order of H at rho (negative at poles),
(2 pi/(T_j^+ + T_j^-)) sum over rho in Q_j of m_rho n^rho -> (1 - alpha_p^k) log p for n = p^k and 0 for other n >= 2;
this is Landau's formula for G minus Landau's formula for zeta.

MEASURED (`checks.py`, `checks.json`; mpmath, 40 digits; q = 2, HQ3 with (a, b) = (0.1, 0.2), HQ1 with eps = 1).
(M_T) for HQ3 at x = 2, 4, 8, 3, 6, 2.5 and T = 1, 3: both sides agree to between 1.6e-40 and 4.7e-40 (for
example x = 2, T = 1: 0.030669211913784705297 on both sides; lattice sum over abs(k) <= 400, coefficient sum
to u^60). Lemma M: table rows of section 3.

**Corollary M1 (PROVED; necessary conditions on a twin that is tame on a sequence of crossings).** Let G be
a twin with the hypothesis of Lemma M. Then (a) H has infinitely many poles; (b) for every n >= 2 with
h(n) != 0, sum over poles in Q_j of abs(Res(H n^s)) >= ((T_j^+ + T_j^-)/(2 pi)) abs(h(n)) (1 - o(1));
in particular the number of poles of H up to height T, weighted by abs(residue) n^(Re rho), grows at least
linearly; (c) the set of n with h(n) != 0 contains every prime with alpha_p != 1 and every integer composed
of primes with alpha_p not in {0, 1}; by Theorem A (c20) sum abs(1 - alpha_p) p^(-1/2) = infinity, so the
residue measure sum Res_rho delta_rho has non-zero mean Fourier coefficients at infinitely many rationally
independent frequencies log p, and vanishing mean coefficient at log x for every non-integer x > 1.
(d) The poles of H are zeros of zeta at which G does not vanish to zeta's order, or poles of G.
HQ1 to HQ4 meet (b) at the single frequency log q and its multiples with a single lattice. QUAD meets it
at every n with coefficient h(n) != 0 through the zeros of two L-functions (not computed).

**On the assigned question (poles from an infinite product of geometric factors).** Not decided.
(i) The sparse tools do not apply: Theorem W needs sum over S of (log q)^-gamma finite and Lemma P0 needs
sum q^-delta finite for all delta > 0; either implies sum over S of q^(-1/2) finite, and with
abs(1 - alpha_p) <= 2 that is hypothesis (H) of Theorem A, which gives G = zeta without any pole analysis. Those
theorems were made for abs(alpha_q) = q^(1/2) (regime 2), where a single factor has its pole lattice on the
line; for abs(alpha_p) <= 1 a single factor has its poles on Re s = log abs(alpha_p)/log p <= 0 and the poles of H in
the strip are not poles of any factor: they are created by the divergence of the product in
1/2 < Re s <= 1. (ii) What a geometric twin must do is Corollary M1 (tame branch) or Corollary L1 (wild
branch). (iii) In the classes where meromorphic continuation of such products is known (Artin
L-functions), Proposition ART shows that no twin exists.

## 5. Proposition ART and member QUAD

**Proposition ART (PROVED relative to: Brauer's theorem that Artin L-functions are meromorphic of finite
order, Chebotarev's density theorem, and Theorem H with Lemma 1 of c21; all CLASSICAL, recalled).** Let K/Q be
a finite Galois extension with group Gamma, psi = sum n_j chi_j a virtual character (n_j integers), R a
finite set of primes containing the ramified ones, and
G(s) = prod over p in R of L_p(p^-s) times prod over p not in R of exp(sum_k psi(Frob_p^k) p^(-ks)/k),
L_p arbitrary rational. Suppose every local factor of G is (1 - alpha_p p^-s)^-1 with abs(alpha_p) <= 1 and G has
zeta's functional equation. Then G = zeta.
Proof. For p not in R the shape gives psi(g^k) = alpha_p^k for all k >= 1, g = Frob_p. Every class is a
Frobenius class of infinitely many p not in R. At g = 1: psi(1) = alpha^k for all k, so psi(1) is 0 or 1.
If psi(1) = 1: psi(g)^(ord g) = 1, so abs(psi(g)) = 1 for all g and (psi, psi) = sum n_j^2 = 1; psi = +-chi_j, and
psi(1) = 1 gives psi = chi linear. If psi(1) = 0: psi(g)^(ord g) = 0, psi = 0. So G is L(s, chi) (a Dirichlet
L-function or zeta) or 1, times finitely many factors (1 - beta_p p^-s)/(1 - alpha_p p^-s) whose poles lie on
Re s = log abs(alpha_p)/log p <= 0. G is of finite order with finitely many poles in Re s >= 1/2; Lemma 1 and
Theorem H of c21 give G = zeta. QED
Check (`ref_check.py`, brute force over integer vectors n_j in a box, groups C4, C6, C2 x C2, C2 x C4, S3):
the solutions of psi(g^k) = psi(g)^k, abs(psi(g)) <= 1 are 0 and the single linear characters, nothing else.

**Member QUAD (PROVED; MEASURED).** chi_D the Kronecker character of the fundamental discriminant D > 0:
even, real, primitive of conductor D, root number 1, (D/pi)^(s/2) Gamma(s/2) L(s, chi_D) symmetric under
s -> 1 - s (CLASSICAL). 12 * 40 = 8 * 60, so R(s) = L(s, chi_12) L(s, chi_40)/(L(s, chi_8) L(s, chi_60)) satisfies
R(s) = R(1 - s), and G = zeta R has zeta's functional equation exactly, integer frequencies, an Euler
product with local factor (1 - y)^-1 (1 - chi_8 y)(1 - chi_60 y)/((1 - chi_12 y)(1 - chi_40 y)), finite order, the
pole at 1 and poles at the zeros of L(chi_8) L(chi_60). chi_8 chi_60 chi_12 chi_40 is principal, so the four
values at p have an even number of -1; the factor is (1 - y)^-1 (alpha_p = 1) for six of the eight patterns
and is (1 - y)/(1 + y)^2 or (1 + y)^2/(1 - y)^3 for (1, 1, -1, -1) and (-1, -1, 1, 1): not geometric on a set of
primes of density 1/4. MEASURED: abs(R(s) - R(1 - s)) <= 3.3e-41 at s = 0.3 + 2.1i, 0.83 + 7.7i, 1.4 - 3.3i,
-0.6 + 11.2i; patterns over primes 7 <= p < 20000: 266 to 287 each of the eight; 569 of 2259 not geometric.
Its zeros and poles are those of zeta and of four Dirichlet L-functions: on the line under GRH. It is a
twin for the clause set {functional equation, integer frequencies, Euler product, unimodular parameters,
finite order, pole at 1}, with the pole clause and the local shape failing; whether the map already holds
a member of this type was checked only by a text search of `OBSTRUCTION_MAP.md` (none found).
For ART: psi = 1 + chi_12 + chi_40 - chi_8 - chi_60 has psi(1) = 1 and (psi, psi) = 5; the shape fails on exactly
the classes where abs(psi(g)) = 5 or 3.

## 6. The exact residue of BR-3'

A twin G (degree-one geometric Euler product, abs(alpha_p) <= 1, meromorphic on C, zeta's functional equation,
G != zeta) satisfies sum abs(1 - alpha_p) p^(-1/2) = infinity (Theorem A), is not of Artin type (ART), and is of
one of two kinds:

**Tame kind.** On some sequence of crossings H is o(T) in mean. Then H has infinitely many poles and
Corollary M1 holds: the residues resonate with log n for every n in the support of h, an infinite set with
infinitely many independent frequencies, and with no non-integer x.
OPEN: existence. Not excluded by anything on file; QUAD shows the conditions are satisfiable when the
shape is dropped at density 1/4 of the primes.

**Wild kind.** On every crossing at height T (one sign, all large T) H exceeds o(T) in mean; and if in
addition G, or G/zeta, or zeta/G has finitely many poles, that function exceeds exp(C e^(kappa T)) on every
such crossing for each kappa < pi (Corollary L1), and if H is zero-free and pole-free it exceeds
exp(exp(C e^(kappa T))) on every disc (Proposition E).
OPEN: existence. For real frequencies NWM is of this kind at the threshold kappa = pi. For integer
frequencies no example and no proof.

Remark (ARGUED; not used; sources recalled, not opened). In the finite-pole case the question is linear
(no Euler product needed): with phi(x) = sum a_n e^(-pi n^2 x) and D(x) = phi(x) - x^(-1/2) phi(1/x) - Q(x), a twin
is a 2i-periodic phi on Re x > 0 with Fourier support on the squares whose period function D under
x -> 1/x is not 0 but has an entire Mellin continuation. The theta group is the free product of
<x -> x + 2i> and <x -> 1/x>, so D is subject to no cocycle relation beyond D(1/x) = -x^(1/2) D(x); the content
of the open question is whether a holomorphic D of this kind with entire Mellin continuation can be the
period function of a series supported on the squares. Without the support condition (frequencies
(1/2) log n) Eichler-cohomology results of Knopp type suggest solutions exist; this was not verified.

## 7. Controls and the score condition

The score condition of the assignment: a step that fails for V6 and for THIN x V6 and for no multiplicative
control, with a defect bound, on a referee file.

| Step | V6 | THIN x V6 | multiplicative controls | Reads multiplicativity | Defect bound |
|---|---|---|---|---|---|
| Lemma L / L+ | not in the class (no symmetry); with its own two expansions the lemma's mechanism applies to it unchanged | not in the class (no left expansion) | HQ1 to HQ4, QUAD rejected at the pole clause; DEL, THIN at the functional equation | no | none |
| Lemma M / (M_T) | holds for V6 in unsymmetric form | not applicable | holds for HQ1 to HQ4 (MEASURED), QUAD | no | exact identity; no bound |
| Proposition E | not zero-free in C minus poles (poles on Re s = 0) | - | - | no | none |
| Proposition ART | not of Artin type | not of Artin type | QUAD rejected at the shape on density 1/4 | yes (orthogonality over Frobenius classes) | (psi, psi) = 1 against 5: an integer gap, not an analytic bound |

Other controls: backward heat, theta^w, phase-rotated transfer operator, T-NR, zeta(s + a) zeta(s - a),
unimodular twist, sign-twisted primes: not ordinary Dirichlet series with zeta's functional equation; they
fail at the symmetry clause (as in c21 section 4). Davenport-Heilbronn: the statements hold with DH as
base (ARGUED). Beurling members (ZQ, NWM, CYC, NR-q): fail at the spectrum clause.
**The score condition is not met by any step.** ART is the only step that reads multiplicativity; it
identifies a function inside the Artin class and does not concern V6 or THIN x V6.

## 8. Requirement flags, with evidence

| Flag | Value | Evidence |
|---|---|---|
| R1 (multiplicativity essential) | false | L, L+, H+, E, M hold for every Dirichlet series H with H(s) = H(1 - s) (section 2 lists what is read). ART reads multiplicativity but is an identification in a countable class; no step on the open part of BR-3' uses it |
| R2 (height-uniform, every window) | false | no window statement about zeta. (Corollary L1 is an every-crossing statement about a hypothetical twin, not about zeta) |
| R3 (every control fails structurally) | false | section 7: rejections go through pole, spectrum, growth or symmetry clauses; base-blind |
| R4 (reaches the line) | false | continuation across 1/2 < Re s <= 1 is a hypothesis; the growth clause is reduced to a sequence of crossings, not removed; integer frequencies are not used a second time |

About zeros of zeta: no.

## 9. Three weakest steps

1. Theorem L+ / H+: the two-constants step (subharmonic comparison with eta cos(kappa'(sigma - sigma_0)) cosh(kappa' t)
   on rectangles whose horizontal sides are the given crossings) is the whole gain over H' of c21; it is
   standard but no independent referee has read it. H+ also inherits weakest step 1 of c21 (Theorem H
   recalled from Titchmarsh 2.13, proof written by the same author line).
2. Proposition ART rests on three recalled classical theorems and on the reduction 'finitely many extra
   local factors with poles on Re s <= 0, then Lemma 1 and Theorem H'; the brute-force check covers five
   small groups and boxes abs(n_j) <= 4 (2 for C2 x C4). QUAD: the functional equation is checked at four
   points; 'not in the map' rests on a text search.
3. The decision asked for (poles from an infinite geometric product) is not reached. Corollary M1 is a
   necessary condition under a tameness hypothesis that a twin need not meet; the section 6 remark on the
   theta group is argued from memory and may be wrong in its last sentence. The measured rows concern HQ1
   and HQ3 at q = 2 only, in mpmath (not ball arithmetic).

## 10. Files

`RESULT.md`, `REFEREE.md` (author's adversarial pass), `MAP_ROW.md`, `lanes.jsonl`, `checks.py`, `checks.json`,
`checks.log`, `ref_check.py`, `ref_check.json`.
