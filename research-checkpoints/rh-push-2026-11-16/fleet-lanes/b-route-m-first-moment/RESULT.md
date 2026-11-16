# b-route-m-first-moment: the Route M first moment, second moment and lam_max, closed

Date 2026-11-16. Scope: sub-gap `imp-97071-first-moment-lower-bound-kappa-positive` and its descendants
(imp-97097, imp-97116, imp-97541, imp-124855). Grades: PROVED / CLASSICAL / MEASURED / OPEN.

## Verdict

kappa > 0 is PROVED, with the exact constant. For every b >= 3

    kappa(b) = F(b)/(phi(b) b) >= 1/2 - 1/(b phi(b))                                   (floor, all b)
    | F(b) - K b phi(b) | <= b 2^{omega(b)} (3 + 2 log b) + 2 + log b                   (asymptotic, explicit)
    K = (3/4)(log 2pi - gamma) - 1/4 = 0.6954960511...

so kappa(b) -> K, which is the value conjectured in imp-97541 (kappa_arith + 1/8). No Bettin-Conrey
reciprocity, Kloosterman input or cotangent mean value is needed. The step the earlier tickets missed:
Vasyunin's closed form I(a,b) is the value of a positive integral, I(a,b) = b A(a/b), where
A(lambda) = int_0^inf {t}{lambda t} t^-2 dt is a continuous function of the real variable lambda. Every
Route M moment is therefore a Riemann sum of an explicit continuous function over reduced fractions.

The same identity gives more than was asked (sections 4-6): the second moment Q(b) ~ s0 phi(b), the exact
slopes of T(M) and ||G_N||_F^2, and a uniform bound lam_max(G_N) <= 18 for all N (the measured
"lam_max ~ 0.35 log N" law is a transient, not growth).

RH content: none. These are Euler-blind mean-value statements about the Nyman-Beurling Gram matrix
(section 7). Lambda <= 0.2 (Platt-Trudgian) is unchanged. RH open. No QED on anything beyond the
statements labelled PROVED below.

## 0. What is new relative to the atlas, the walls and the repo

- Not a route to RH and not claimed as one. Route M (Nyman-Beurling / Vasyunin Gram) is not one of the fifty
  routes of `formalization/routes/fifty-routes-synthesis-2026-10-15.md`; it is an imp-ticket thread.
- New relative to the repo: every Route M module treats the cotangent part of I(a,b) as an arithmetic object
  needing reciprocity or equidistribution of modular inverses (imp-97097 "period-function average",
  imp-97116 "frequency of small modular inverses"). None uses I(a,b) = b A(a/b) with A continuous.
- Not new mathematics in the literature sense: A is the multiplicative autocorrelation function of the
  fractional part studied by Baez-Duarte, Balazard, Landreau, Saias (2005); the Mellin form of the Gram
  matrix is standard. The specific corollaries below (exact kappa, s0 as a weighted fourth moment,
  lam_max <= 18) I did not find stated in the repo; I have not searched the literature for them.

## 1. Setup and the identity

Notation of imp-97071. C = (log 2pi - gamma)/2, V(a,q) = sum_{m=1}^{q-1} {ma/q} cot(pi m/q),

    I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),      (a,b) = 1,
    F(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b),     Q(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2.

Define for real lambda > 0

    A(lambda) = int_0^inf {t} {lambda t} dt/t^2.

**L1 (CLASSICAL: Vasyunin 1995; BBLS 2005).** For coprime a,b >= 1:
I(a,b) = a b int_0^inf {t/a}{t/b} dt/t^2. Substituting t -> t a: **I(a,b) = b A(a/b) = a A(b/a)**, and
A(lambda) = lambda A(1/lambda). The Gram entry is G(m,n) = int {t/m}{t/n} dt/t^2 = A(m/n)/m for all m,n.
Checked here numerically (check1.py: 8 pairs, Vasyunin form vs piecewise-exact integration, agreement
1e-8). Not re-derived.

**L2 (PROVED).** For 0 < lambda <= 1: lambda <= A(lambda) <= lambda (2 + log(1/lambda)).
Proof. Lower: on t < 1, {t}{lambda t} = lambda t^2, contributing lambda; the rest is >= 0. Upper:
{t} <= min(t,1), {lambda t} <= min(lambda t, 1); integrate over [0,1], [1,1/lambda], [1/lambda,inf).
Consequence: **I(a,b) >= min(a,b)** for all coprime a,b.

**L3 (PROVED, modulus of continuity).** For 0 <= lambda < mu <= 1, h = mu - lambda:
|A(mu) - A(lambda)| <= h (3 + 2 log(1/h)).
Proof. |{mu t} - {lambda t}| <= 1 always, and = h t when no integer lies in (lambda t, mu t]. Take T = 1/h.
Good part of [0,T]: <= h int_0^T {t} dt/t <= h(1 + log T). Bad part: t in [n/mu, n/lambda) with
n <= mu T; each contributes <= int_{n/mu}^{n/lambda} dt/t^2 = h/n; total <= h(1 + log(mu T)) <= h(1 + log(1/h)).
Tail t > T: <= 1/T = h.

**L4 (PROVED, Riemann sum + Moebius).** Let R_n = sum_{j=1}^n A(j/n) and K = int_0^1 A. Then
|R_n - nK| <= 3 + 2 log n (L3 on each cell; h(3+2log(1/h)) is increasing for h <= 1). For b >= 2,
sum_{1<=a<=b,(a,b)=1} A(a/b) = sum_{d|b} mu(d) R_{b/d}, hence

    | sum_{(a,b)=1, a<b} A(a/b) - phi(b) K | <= 2^{omega(b)} (3 + 2 log b).

**L5 (PROVED, closed form of K).** K = int_0^1 A = int_0^inf {t} t^-3 (int_0^t {v} dv) dt, and
int_0^t {v} dv = ([t] + {t}^2)/2. The range t < 1 gives 1/2. For t > 1 write [t] = t - {t}:
K = 1/2 + J1/2 - J2/2 + J3/2 with J1 = int_1^inf {t} t^-2 = 1 - gamma,
J2 = int_1^inf {t}^2 t^-3 = sum_n [log(1+1/n) - 1/(n+1) - 1/(2(n+1)^2)] = 3/2 - gamma - pi^2/12,
J3 = int_1^inf {t}^3 t^-3 = sum_n [3 - 3n log(1+1/n) - 3/(2(n+1)) - 1/(2(n+1)^2)]
   = (3/2)(log 2pi - gamma) - 1 - pi^2/12   (Stirling for sum n log(1+1/n) = N log(N+1) - log N!).
Sum: **K = (3/4)(log 2pi - gamma) - 1/4 = (3/2)C - 1/4**. Quadrature check (check1.py):
0.69549605113085946721 both ways.

## 2. Theorem 1 (first moment). PROVED

F(b) = b ( sum_{(a,b)=1, a<b} A(a/b) - A(1/b) ). By L2, L4:

    (i)   F(b) >= b sum_{a=2,(a,b)=1}^{b-1} a/b = b phi(b)/2 - 1                 for all b >= 3,
    (ii)  | F(b) - K b phi(b) | <= b 2^{omega(b)} (3 + 2 log b) + 2 + log b       for all b >= 2.

So kappa(b) >= 1/2 - 1/(b phi(b)) >= 1/3 for every b >= 3, and kappa(b) = K + O(2^{omega(b)} log b / phi(b)).
Numerics (check2.py, all b <= 3000): kappa(2999) = 0.6955171, kappa(2310) = 0.6954660,
kappa(3000) = 0.6954938; the bound (ii) holds everywhere with observed ratio <= 0.069.

**Corollary 1 (PROVED; the imp-97541 conjecture).**
sum_{a=2,(a,b)=1}^{b-1} V(b,a) = -(1/(4 pi)) b phi(b) + O(2^{omega(b)} b log b), i.e. kappa_cot -> 1/8.
Proof. The arithmetic part is b sum f(a/b) with f(u) = C(1+u) + (1/2)(1-u) log u increasing on (0,1],
int_0^1 f = (3/2)C - 3/8; monotone Riemann sums with an integrable log endpoint have error O(log n); Moebius
as in L4. imp-97097 gives sum_{a>=2} V(a,b) = -V(1,b) = O(b log b). Subtract from Theorem 1(ii).
This also closes the imp-97096 remainder sub-gap up to an explicit O-constant not written out here.

## 3. What follows for the project (the requested Int(N) bound). PROVED

With the imp-97071 chain (CS: Q >= F^2/S(b); T(M) = 2 sum Q(b)/b^2; imp-96708 sandwich Int(N) >= T(N)):
Int(N) >= T(N) >= (36 K^2/pi^2) log N - O(1), slope 36K^2/pi^2 = 1.76438. The concave turnover of
||G||_F^2 is rejected.

The Cauchy-Schwarz detour is not needed. L2 gives I(a,b)/a >= 1 termwise, so **Q(b) >= phi(b) - 1** for
every b and T(M) >= 2 sum_{b<=M} (phi(b)-1)/b^2 = (12/pi^2) log M - O(1) with no computation at all.

Correction to the ticket statement: "Q(b) >= s0_lo b - O(1)" is false as written with any s0_lo above
s0 phi(b)/b; on primorials Q(b)/b -> 0. The correct normalisation is phi(b) (Theorem 2).

## 4. Theorem 2 (second moment, exact slope). PROVED up to the numerical value of s0

Q(b) = sum_{a=2,(a,b)=1}^{b-1} H(a/b), H(lambda) = (A(lambda)/lambda)^2 = A(1/lambda)^2, and by L2
1 <= A(lambda)/lambda <= 2 + log(1/lambda). From L2, L3, for (j-1)/n <= lambda <= mu = j/n, j >= 2:
|H(mu) - H(lambda)| <= 2(2+log n)(5+3 log n)/j; the first cell is handled by
int_0^x (2+log(1/u))^2 du = x[(2+L)^2 + 2(2+L) + 2], L = log(1/x). Hence with l = log b,
E2(b) = 2(2+l)(5+3l) l + (2+l)^2 + 2(2+l) + 2:

    | Q(b) - s0 phi(b) | <= 2^{omega(b)} E2(b) + (2+l)^2,      s0 = int_0^1 (A(lambda)/lambda)^2 d lambda.

**Mellin form (CLASSICAL ingredients).** For 0 < Re w < 1,
int_0^inf A(lambda) lambda^{-w-1} d lambda = zeta(w) zeta(1-w)/(w(1-w)); with A(lambda) = lambda A(1/lambda)
and Plancherel on Re w = 1/2:

    s0 = (1/(4 pi)) int_{-inf}^{inf} |zeta(1/2+it)|^4 / (1/4 + t^2)^2 dt = 2.9193   (MEASURED value: mpmath
    quadrature to T = 400, tail <= 4e-5; not interval-certified).

Consequences (PROVED given the above; sum 2^{omega(b)} log^3 b / b^2 converges):

    T(M)        = (12 s0/pi^2) log M + O(1),     slope 3.5494   (measured increments 3.495 -> 3.530, rising),
    ||G_N||_F^2 = 2 s0 log N + O(1),             slope 5.8386   (measured 5.82 on [2000,3000]; imp-96667 5.66).

Numerics: Q(b)/phi(b) = 2.8898 (b=1201), 2.9051 (b=2999), 2.8666 (b=2310); the explicit bound holds for all
b <= 3000 with ratio <= 0.033. This settles imp-96708's residual ("slope constant not reduced to closed
form") and both companions of imp-96750/imp-97054.

## 5. Theorem 3 (lam_max is bounded). PROVED

G_N is symmetric with strictly positive entries G(m,n) = A(m/n)/m. Schur test with p_n = n^{-1/2}:
lam_max(G_N) <= max_m sigma_m, sigma_m = sum_{n>=1} k(m/n)/n, k(lambda) = A(lambda) lambda^{-1/2}.
By L2 and A(lambda) = lambda A(1/lambda), k(e^u) <= e^{-|u|/2}(2+|u|), and x -> k-envelope(m/x)/x is
decreasing on (0,inf), so sigma_m <= m^{-1/2}(2 + log m) + 2 int_0^inf e^{-u/2}(2+u) du <= 2 + 16.

    **lam_max(G_N) <= 18 for every N.**

Lower side (PROVED at sketch level: Riemann-sum convergence of the weighted row sums via L3, error
O(log m / sqrt m), then Rayleigh quotient with c_n = n^{-1/2}): lam_max(G_N) is increasing in N and
lim lam_max(G_N) >= int_0^inf k(lambda) d lambda/lambda = 4 zeta(1/2)^2 = 8.5305.

MEASURED: lam_max = 4.930, 5.229, 5.496, 5.734, 5.862 at N = 250, 500, 1000, 2000, 3000; the weighted row
sums sigma_m increase with m toward 8.53 from below (5.10, 6.88, 7.83, 8.13 at m = 1, 10, 100, 400).
OPEN (conjecture): sup_m sigma_m = 4 zeta(1/2)^2, which would give lam_max(G_N) < 4 zeta(1/2)^2 = 8.5305
with equality in the limit; approach rate ~ c/log N.

Effect on existing modules: the log-linear lam_max fits (imp-96443 slope 0.3526, imp-96636, imp-96648
Frobenius majorant, the 3.75e7 / 4.11e7 conditioning ceilings) extrapolate a quantity that is bounded by 18.
The Frobenius majorant sqrt(2 s0 log N) is unbounded and crosses 18 only at log N ~ 55; the constant bound
is the sharper statement beyond that, and the conjectured 8.53 is sharper from log N ~ 13.

## 6. What this does not do

- No statement about d_N (the Nyman-Beurling distance), lam_min, or zeros. lam_min -> 0 is where RH lives
  (Baez-Duarte); nothing here touches it.
- No Lambda bound moves. No lever for the campaign's stated walls.

## 7. Davenport-Heilbronn control

Every step uses only: (a) {t} >= 0 and its integral, (b) continuity of A, (c) equidistribution of reduced
fractions, (d) the weighted fourth moment of |zeta(1/2+it)|. No step uses Lambda(n) >= 0, multiplicativity
or Hecke structure. The same proofs run for the Gram matrix built from any Dirichlet series with a
functional equation in place of zeta (replace |zeta|^2/(1/4+t^2) by the corresponding weight), including
the DH function. So the results pass the DH control in the only admissible way: they are true for DH too,
and therefore carry no RH information (MV-CAP class). This is the reason section 6 holds.

## 8. Three weakest steps

1. L1 is taken as classical (Vasyunin / BBLS) and verified numerically at 8 pairs to 1e-8; the whole note
   rests on the project's I(a,b) being that integral. I did not re-derive the cotangent formula.
2. s0 = 2.9193 is a floating-point quadrature of |zeta|^4/(1/4+t^2)^2, not an Arb enclosure; the Mellin /
   Plancherel step is stated, not written in full (needs A(lambda)/lambda in L^2(d lambda), which L2 gives).
3. The lower limit lim lam_max >= 4 zeta(1/2)^2 is a sketch, and sup_m sigma_m = 4 zeta(1/2)^2 is measured
   only. The proved two-sided statement is 8.5305 <= lim lam_max(G_N) <= 18.

Also: O-constants in Corollary 1 are not explicit; Theorem 1 and Theorem 2 constants are explicit but not
optimised (observed errors are 15x-30x below the bounds).

## 9. Files

- check1.py: identity L1 and closed form K.
- s0.py, s0.txt: s0 by quadrature; W(0) = 4 zeta(1/2)^2.
- check2.py (run with N = 3000, ~2.5 min): exact Vasyunin table; kappa(b), Q(b)/phi(b), explicit-bound
  ratios for all b <= 3000, T slopes, lam_max, Frobenius, Rayleigh and Schur row sums.

## 10. Next step (if anyone continues Route M)

Prove sup_m sigma_m = 4 zeta(1/2)^2 (sharp lam_max), and replace the fitted lam_max laws in the Route M
modules by the constant. The first-moment, second-moment and turnover sub-gaps can be closed in the queue.
