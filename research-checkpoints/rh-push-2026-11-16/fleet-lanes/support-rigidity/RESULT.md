# support-rigidity: does exact vanishing of Lambda(n) off prime powers exclude an off-line zero?

Working note, 2026-11-16. Scope: tmp/research-2026-11-16/push/support-rigidity/ only. Nothing committed or pushed.
No RH claim, no new zero-free region. Labels: PROVED (argument given here), CLASSICAL, MEASURED (double precision,
run.py / run.log, not interval-certified), ARGUED (heuristic), OPEN.

**Verdict: precise obstruction.** The support constraints imply zero information in exactly one direction, and it is
the classical one (Cramér; Carneiro-Milinovich-Soundararajan): a prime-power-free window at x longer than about
c sqrt(x) log x forces an off-line zero. Every actual window is shorter than the visibility threshold
3 x^{3/2-beta} log x of a single zero at real part beta unless beta >= 0.975 (Baker-Harman-Pintz). In windows below the
threshold the Weil functional equals an explicit archimedean form which is positive; the off-line term is dominated by
the on-line mass log(1/eta) that the same identity forces. Multi-window ("simultaneous") designs reduce to a bound on a
prime-supported Dirichlet polynomial at one height: the (star_min) / MV-CAP wall of round 1, attempt 1.4.

## 0. Plan (what is new relative to the atlas and the walls)

| Atlas item / wall | Overlap | Difference here |
|---|---|---|
| Atlas 9 (fixed-support form), round-1 1.4 (contradiction from one zero, matched sinh direction) | Same Weil functional, same resonance idea | Tests are restricted to autocorrelations that vanish at every log p^k, so the prime side is eliminated exactly and W equals the archimedean form Q_inf. The atlas does not use the vanishing set as a constraint. |
| Route I (pole-free positivity, 2a <= ln 3) | Archimedean-only positivity at short support | Here the support is long (distance log x between clusters); primes are avoided by placing cross-correlations in prime-power gaps. |
| MV-CAP | Mean-value inputs cannot certify every window | Section 5 shows the multi-window version lands on it. |
| DH control | Required | Sections 1 and 6: DH violates the support condition at n = 6; the one rigorous implication (section 4) is Euler-blind. |
| Verified height, flow-blindness | Not addressed | Not used. |

Angle as assigned: use Lambda(n) = 0 at non-prime-powers, with narrow tests at log n, plus the phases gamma log n, to
contradict an off-line zero. Sections 1-3 treat the linear (narrow-window) version, section 4 the quadratic (Weil)
version, section 5 the simultaneous version (the single pivot).

## 1. What the support condition is (PROVED / CLASSICAL)

**P1.** For a Dirichlet series F = sum a(n) n^{-s}, a(1) = 1, with -F'/F = sum Lambda_F(n) n^{-s}: Lambda_F is supported
on prime powers iff a is multiplicative (log F is supported on prime powers iff F is an Euler product). PROVED, formal.

**P2.** At conductor 1 the condition adds nothing: Hamburger's theorem (CLASSICAL) says a Dirichlet series with zeta's
functional equation is c zeta. The full system of window identities, all n and all widths, with the values log p, is
equivalent to "the zeros are zeta's zeros". Any proof has to use a proper subsystem and add an inequality.

**P3 (DH).** For f_DH = ((1-i k)/2) L(s,chi) + ((1+i k)/2) L(s,chi-bar), chi mod 5, chi(2) = i, k = 0.2840790438:
MEASURED (exact recursion, run.py part A) Lambda_DH(6) = 1.9364, Lambda_DH(12) = -0.7629, Lambda_DH(14) = -2.8520,
Lambda_DH(21) = 3.2902, ... Lambda_DH vanishes at non-prime-powers n <= 60 only for 5 | n and for n = 22, 33, 38, 44,
57, 58. Reason (PROVED): chi(p) is real for p = +-1 mod 5, so both L-functions share the Euler factor at such p and DH
has a genuine Euler factor there; the non-multiplicative part lives on integers composed of primes = +-2 mod 5.
So the support condition is Euler-sensitive, as the angle intended. It fails for DH first at n = 6.

**P4 (support alone is not enough).** G(s) = zeta(s - d) zeta(s + d), 0 < d < 1/2, has Lambda_G(n) = 2 cosh(d log n)
Lambda(n): the same support, hence the same prime-power-free windows as zeta; a functional equation s -> 1 - s
(degree 2); and zeros at 1/2 +- d + i gamma for every critical-line zero of zeta (infinitely many, Hardy). PROVED.
So an argument that uses only where Lambda vanishes, and not the size bound Lambda(n) <= log n (equivalently degree 1),
cannot exclude zeros at offset d. Every statement below about window positions holds for G.

## 2. The linear (narrow-window) version: tail-blindness (PROVED)

Explicit formula (CLASSICAL), f in C_c^infty(1, infty):

  sum_n Lambda(n) f(n) = int f - sum_rho int f(x) x^{rho-1} dx - int f(x) dx / (x^3 - x).

**P5 (domination).** Let f >= 0, int f = 1, supp f in [n-h, n+h], containing no prime power. Then
sum_rho F(rho) = 1 - eps_n with F(rho) = int f x^{rho-1}, 0 < eps_n <= 1/((n-h)^3 - (n-h)), and each zero has
|F(rho)| <= (n-h)^{beta-1} < 1. An off-line quartet contributes at most 4 (n-h)^{beta-1} -> 0, against a right side
-> 1. The identity therefore forces the remaining zeros to carry absolute mass sum |F(rho)| >= 1 - o(1): in the
normalisation where an on-line zero has size n^{-1/2}, at least n^{1/2} of coherent mass from about (n/h) log n zeros
of height up to n/h. The per-zero advantage n^{beta-1/2} of the off-line zero is smaller than this by the factor
n^{1-beta}, for every n, every h, every sequence. PROVED.

**P6 (Cramér V, tail property).** Cramér's function V(z) = sum_{gamma>0} e^{rho z} (Im z > 0) continues
meromorphically across the positive real axis with simple poles exactly at z = log p^k (CLASSICAL, valid without RH).
"Lambda(n) = 0" is analyticity of V at log n. A finite set of zeros contributes an entire function. So the singular
support is unchanged by moving finitely many zeros anywhere. This is the Landau-formula statement
sum_{0<gamma<=T} x^rho = -(T/2pi) Lambda(x) + O_x(log T): a fixed zero contributes x^beta = O(1), inside the error for
every x; with Gonek's uniform error O(x log(2xT) loglog 3x) it is inside the error uniformly, since x^beta < x.
PROVED given the classical formulas.

**P7 (what exact vanishing does give).** For a finite modification the difference of the two prime-side distributions
is a nonzero finite exponential sum in u = log x, real-analytic, so it cannot vanish on any interval. Exact vanishing
on one window therefore excludes every finite twin. This is a uniqueness statement (same content as P2). It does not
locate zeros: to turn it into a contradiction one needs a second, independent evaluation of the zero sum in the window
to absolute accuracy h n^{beta-1}, and the only evaluation available is the identity itself. PROVED (the first
sentence); the second is the obstruction.

## 3. Summary of the linear version

Uniformity in gamma is what fails. A window of x-width h at n weights all zeros to height n/h equally. Shrinking h
moves the constraint further into the tail and lowers the relative weight of any fixed zero. Widening h is limited by
the nearest prime power. The linear constraints have no sign, so no single-term size comparison is available (P5).

## 4. The quadratic (Weil) version: prime side eliminated exactly

Weil functional (CLASSICAL): for phi = g * g~, h(t) = |g^(t)|^2 on the real line,

  W(phi) = sum_rho h((rho - 1/2)/i)
         = h(i/2) + h(-i/2) - sum_n Lambda(n) n^{-1/2} [phi(log n) + phi(-log n)] - phi(0) log pi
           + (1/2pi) int h(t) Re psi(1/4 + it/2) dt.

RH iff W(g * g~) >= 0 for all g. Write Q_inf(phi) for the right side without the prime sum.

**P8 (elimination).** If phi = g * g~ vanishes at every +-log p^k, then W(phi) = Q_inf(phi): an explicit archimedean
quantity with no arithmetic in it. PROVED (immediate). The vanishing set enters as a constraint on g.

**P9 (two-cluster test).** Let q < q' be consecutive prime powers, l = (log q + log q')/2, eta = (1/4) log(q'/q),
b = eta^{-1/2} b_0(u/eta) with b_0 = (2/sqrt 3) cos^2(pi v/2) on [-1, 1], g = b - b(. - l). Then phi is supported in
[-2 eta, 2 eta] and +-l + [-2 eta, 2 eta], which contain no log p^k (2 eta < log 2), and

  W = 4 b^(i/2)^2 (1 - cosh(l/2)) - 2 log pi + (1/2pi) int |b^(t)|^2 (2 - 2 cos t l) Re psi(1/4 + it/2) dt
    = 2 log(1/eta) + O(1) - (16/3) eta cosh(l/2) (1 + O(eta)).

PROVED (substitution; b^_0(0)^2 = 4/3). Consequences:

* (CLASSICAL content, Cramér 1920; optimal constant 22/25 in Carneiro-Milinovich-Soundararajan 2019.) If some
  prime-power gap has g = q' - q > c* sqrt(q) log q then W < 0 and RH is false. MEASURED c* for this (unoptimised)
  bump: 0.753 (x = 1e4), 0.865 (1e6), 0.957 (1e8), 1.027 (1e10). This is the only rigorous implication
  "exact vanishing on a window => off-line zero" found, and it is not new.
* A pair rho = 1/2 +- d + i gamma contributes 2 |b^|^2-type weight times (2 - 2 cos(gamma l) cosh(d l)), at least
  -(8/3) eta x^d (1 + o(1)), x = e^l. It can make W negative only if (8/3) eta x^d > 2 log(1/eta) + O(1), i.e.

    g > 3 x^{1-d} log x (1 + o(1)) = 3 x^{3/2 - beta} log x.       (visibility threshold, PROVED as a necessary condition)

* Actual windows: g <= x^{0.525} for large x (Baker-Harman-Pintz, CLASSICAL). So a single zero is visible to a
  two-cluster test only if beta >= 0.975. Under the 2026 half-plane Re s <= 7/8 (unrefereed input) no zero is visible.
  If Theta = sup beta, then g << x^Theta log^2 x (CLASSICAL), so visibility needs Theta >= 3/4.
* MEASURED (run.log): at all 26 maximal prime-power gaps with q in [13, 2e7], W/2 is positive, from 0.96 (13, 16) to
  10.98 (17051707, 17051887); the pole term is 0.24 or less in absolute value against an archimedean term 2.2 to 12.1.
  max g/(sqrt q log q) = 0.324 at (13, 16), decreasing to 0.0026.

So in every actual window W = Q_inf > 0 is an unconditional explicit fact. The identity then says the zero side is
positive; the possible negative part from off-line zeros is smaller than the on-line mass 2 log(1/eta) by the factor
x^{d} g / (x log x). No contradiction is available. This is the precise cancellation: the pole cross term
e^{l/2} eta that would have to be beaten is itself only made small by the window being short, and the same shortness
suppresses the off-line term by the same factor eta.

## 5. Pivot (one): simultaneous windows

Generalise P9: g = g_0 + g_1(. - l), g_0, g_1 smooth with support in [0, log 2). Self-correlations see no prime power.
The cross-correlation c = g_1 * g_0~ (shifted by l) is supported in l + (-log 2, log 2) and has to vanish at the
J ~ 1.5 x / log x points log p^k with p^k in (x/2, 2x), x = e^l. For fixed g_0 this is J linear conditions on g_1 in an
infinite-dimensional space, so the class is large, and on it W = Q_inf (P8). PROVED.

The cross part of Q_inf is 2 Re int c(u) (e^{u/2} + e^{-u/2}) du minus an archimedean term of size e^{-l/2}. Without the
vanishing conditions it can be as large as x^{1/2} ||g_0|| ||g_1||. RH therefore implies a sampling inequality:

  (S)  c(log p^k) = 0 for all p^k in (x/2, 2x)  =>  |int c(u) e^{u/2} du| <= Q_inf(g_0 * g_0~)^{1/2} Q_inf(g_1 * g_1~)^{1/2} + small.

ARGUED (duality, not written out as a theorem): the supremum of the left side over the constrained class equals the
distance, in the sup norm over t weighted by the archimedean density (about log(2 + |t|)), from the pole symbol
I_x(t) = int_{x/2}^{2x} y^{-1/2+it} dy to the span of the prime characters p^{ikt}, with free coefficients:

  inf_a sup_t | I_x(t) - sum_{x/2 < p^k < 2x} a_{p^k} p^{ikt} | / w(t).

With a = Lambda(n) n^{-1/2} this is a bound, at every single height t, on a von Mangoldt polynomial of length x minus
its pole term. That is (star_min) of round 1 attempt 1.4 and the atlas section 9 / MV-CAP wall, and it is where the
values log p (not just the support) and the phases gamma log p enter. The unweighted sup is ~ x^{1/2} by Kronecker
alignment; alignment heights have log t >~ number of aligned primes, which is why the weight matters. The simultaneous
Diophantine structure of gamma log n is therefore present, but as the known single-height problem.

OPEN (the one item that is not a restatement): in (S) the coefficients a are free. Whether the free-coefficient
approximation problem is strictly weaker than (star_min), i.e. whether some a other than Lambda n^{-1/2} can do the
job at lower cost for a restricted x-range, was not decided.

## 6. DH control and where the Euler product is used

* The support condition itself is Euler-sensitive (P1, P3): DH has Lambda_DH(6) != 0.
* P5-P7 and P9 use only the explicit formula and the functional equation. They hold for DH with "prime power" replaced
  by supp Lambda_DH. Every prime p != 5 is in supp Lambda_DH (Lambda_DH(p) = a(p) log p != 0), so support-free windows
  are no longer than prime gaps; MEASURED for n <= 60 the longest run of zeros is 2 integers (57, 58). The Cramér
  threshold is then not met (ARGUED beyond n <= 60) and the two-cluster test is positive for DH although DH has
  off-line zeros (0.8085 + 85.699 i, value taken from the sibling euler/ note). The one rigorous implication is thus Euler-blind and silent on DH, as required
  of a correct statement and as expected of a useless one.
* P4 shows the same for an Euler product of degree 2 with zeros at offset d.
* A proof along this angle would have to use Lambda(n) <= log n on prime powers at a single height (section 5). No
  step here does that.

## 7. Three weakest steps

1. Section 5 duality is ARGUED. The constrained class is bilinear in (g_0, g_1); the Hahn-Banach step was done only
   for fixed g_0, and the weight w(t) was not derived with constants.
2. P9 asymptotics and the thresholds c* are MEASURED in double precision with one fixed bump; the O(1) constant was not
   bounded rigorously, and the "visibility threshold" is a necessary condition for this two-cluster family, not for
   every test with prime-power-free autocorrelation.
3. P6 uses Gonek's uniform Landau formula from memory of its error terms; the statement used (error >= x^beta in size)
   is robust to the exact form but was not re-derived.

## 8. Status

Nothing new is proved about zeros. New relative to the atlas: the elimination P8 with the explicit two-cluster
computation P9 (the visibility threshold 3 x^{3/2-beta} log x against BHP), the partial Euler structure of DH (P3), and
the reduction of the simultaneous version to a free-coefficient approximation problem (S). Files: run.py, run.log.
