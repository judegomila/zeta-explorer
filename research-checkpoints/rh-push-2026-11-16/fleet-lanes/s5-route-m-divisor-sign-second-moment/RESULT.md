# s5-route-m-divisor-sign-second-moment: Route M divisor sign law, quarter ceiling, second moment, Mertens bracket, inverse-line mean

Date 2026-11-20. Screening lane, four combinations. Grades: PROVED / CLASSICAL / CERTIFIED (ball arithmetic) /
MEASURED / NOT RUN.

## Verdict

Four combinations tested, no survivor. None of the four statistics separates the controls from zeta in a
way that is not either a statement about coefficients (at s = 1 or on the line) or a resolution of the
control's zeros at the scale their position predicts.

Three results came out of the screening that change the record of the source nodes:

1. **The sign law T(b) < 0 holds for every squarefree b >= 2 (PROVED, section 3.1).** Node
   `rm-sign-law-t-negative` lists it as open beyond omega = 4. The proof is five lines: T(b) is
   (phi(b)/b - 1)/12 plus terms that are smaller than 1/(12 p1) (p1 = smallest prime factor). It uses
   mu(p) = -1 and abs(mu) <= 1 only.
2. **The quarter ceiling abs(E1(b)) <= b/4 is false (CERTIFIED, section 3.2).** For squarefree b,
   E1(b) = mu(b) b [ P (ln A - L/12) + rho ] exactly, with P = phi(b)/b, L = sum_{p|b} log p/(p-1),
   0 < rho <= 1/4 - ln A. The product P L is unbounded (Mertens). The squarefree number
   b = product of the 2,493,025 primes in [1429, 41043647] (log10 b = 17,822,308.9) has
   mu(b) E1(b) <= -1.0000000164 b/4, certified in 200-bit ball arithmetic. The ceiling is PROVED for every
   b with omega(b) <= 121, hence for every b < p_122# = 8.7e280; it holds on every b <= 1e9 and on every
   squarefree b with prime factors below 200 and omega <= 12 (computed). sup abs(E1(b))/b is infinite; the
   statement "abs(E1(b)) = O(b)" of imp-97224 is false as a uniform bound, the true order being b log log b.
3. **Q(b) < s0 phi(b) for every 3 <= b <= 1e6 (MEASURED, section 4)**, s0 = 2.91930299, with
   s0 phi(b) - Q(b) = 0.376 log^2 b + 2.14 log b + 1.4 on primes (checked to b = 1e8 + 7 within 0.11). The "source slope 1.76 to 1.79" is the mean
   of Q(b)/b, equal to 6 s0/pi^2 = 1.7747; sup Q(b)/b = s0. The envelope constant is
   sup I(a,b)/(a(1 + log(b/a))) = log 2 pi - gamma = 1.2606614 (approached as a/b -> 1).

RH content: none. No bound moves.

## 1. Sizes reached

Server = Linux box through rhrun (8 cores requested in total; load average 45 to 105 on 48 threads during
the runs, so the units received 25 % to 90 % of the requested cores). Local = Mac, one core, through
scripts/memcap.sh 8.

| object | size | where |
|---|---|---|
| E1(b), T(b), every b | all b <= 1e9 (607,927,123 squarefree), closed divisor formula, float64 | server, 2 cores, 2 min |
| E1, T, squarefree b with prime factors < 200 | all 57,754,842,070 subsets with omega = 2..12 (57,754,662,670 with omega = 5..12), float64 with enclosure radius 4.9e-6 | local 10 min and server (identical output) |
| E1, T at 210 digits from the divisor sums | 336 sets (extremal and random, omega = 5..12) | local |
| E1 from the definition (sum over a) | every b < 400 and 8 further b <= 3000 at 40 digits; b = 223092870 with 80-bit accumulation | local; server |
| ceiling counterexample | products of primes in [Y, X], X up to 1.5e8 (float64 search); 4 ball-arithmetic certificates | local; server |
| inverse coefficients of the controls in T and E1 | every b <= 2e5, 12 coefficient sequences; T-NR q = 1000003 at 9 moduli (40 digits) | local |
| Q(b), envelope, F(b), every b | all b <= 1e6: 303,962,552,392 coprime pairs 2 <= a < b (= sum of phi(b) - 1; 620,458,557,413 tree nodes over the six slices); independently all b <= 3e5 (27,356,448,484 pairs) | server, 6 single-thread slices, 3 h 13 min; local 13 min |
| Q(b) single b | b = 1000003, 9699690, 10000019, 100000007 | server |
| Q_F(b), periodic F (L(chi_-4), L(chi_5), Davenport-Heilbronn) | every b <= 5000; single b = 30030, 100003 | server |
| Q_F(b), T-NR q = 2, 3, 101 | b = 251, 1000003, 9699690 | server |
| Q_F(b), T-NR q = 1000003 | b = 127, 251 (b < q; larger b needs moduli above 2^63) | server |
| prime sums (12 sums, see section 5) | all 37,607,912,018 primes <= 1e12 | server, 2 cores, 37 min |
| coefficients of -F'/F, F = DH, L(chi_5), L(chi_-4) | n <= 1e8 | server |
| A(b) = sum abs(c0(h_a/a)), every b | all b <= 3e5 (file of `s4-route-m-cotangent-first-moment`), all b <= 1e6 (numbers of `s4`) | local; cited |
| A(b), prime b | 6762 primes of a fixed shuffled list of 10000 (1700 in [1e5,1e6), 6000 in [1e6,1e7), 2000 in [1e7,1e8) log-uniform, 300 just below 1e8): 1198 + 4020 + 1544 done, 8.9e10 moduli a; the last unit was stopped when the Q run ended | server; local |
| small-inverse counts and divisor bound | b = 1000003, 9699690, 10000019, 99999989, 1e8, 223092870, H <= 1000 | server; local |

Planned and not reached. (i) Q(b) for every b <= 2e6: the b <= 1e6 run took 3 h 13 min of wall time in each
of six slices (2 h 10 min of CPU each; 110 ns per node on the loaded server against 24 to 32 ns in a short probe
and 14.5 ns locally: the four per-b arrays, 32 MB, are hit at random); 2e6 costs four times as much. The range (1e6, 1e8] is covered by four single moduli. (ii) "GPU
cotangent sums": not used. The cotangent sums are evaluated by Bettin-Conrey reciprocity in O(log b) per pair
on CPU, which is faster than a direct GPU sum by a factor of order b/log b. Every number in this file is
CPU float64, 80-bit, 40- to 210-digit or ball arithmetic, as stated. (iii) "interval recheck of the 1e5
smallest margins of the ceiling": replaced by the exact formula. The margin b/4 - abs(E1(b)) is at least
0.3069 (b = 2) for every b <= 1e9 and equals ln A + (log p)/12 + r(p) at a prime p; the float64 error is
below 1e-6 of the margin. (iv) The exhaustive scan over omega = 9..12 uses the closed formula with a rigorous
remainder (radius 4.9e-6), not the 2^omega-term divisor sum in 200-digit arithmetic (8e13 high-precision
terms); the 210-digit divisor sums were evaluated on 336 sets.

## 2. Code and checks

`s5.c` is `rmc.c` of `s4-route-m-cotangent-first-moment` (reciprocity engine for c0(h/k), table of the
Bettin-Conrey function, checked there against 30-digit sums) with three additions.

- Mode QT (new): Q(b) for all b <= B by a double-chain traversal of the Euclid tree. A node h/k =
  [0; q_n, ..., q_1] carries c0(h/k) and c0(h2/k2) for h2/k2 = [0; q_n, ..., q_2]; k2 is the penultimate
  convergent denominator of h/k, k2/k = [0; q_1, ..., q_n], h k2 = (-1)^(n-1) mod k and
  k h2 = (-1)^n mod k2, hence for the pair (a,b) = (k2,k):
  V(a,b) + V(b,a) = (-1)^n (c0(h/k) - c0(h2/k2)), and I(a,b) follows from Vasyunin's formula. Each
  coprime pair 2 <= a < b appears once among the nodes whose top quotient is >= 2. Cost: two reciprocity
  steps per node, no scatter, no integer division.
- Mode AB (new): A(b) with one Euclid pass per modulus a (the inverse h_a and the Euclid sequence of
  (a, h_a) are read off the convergent denominators of (b mod a)/a).
- Modes P, PO, O extended by sum I_F^2/a^2 and the envelope maxima.

Checks.
1. QT against direct evaluation of every pair, all b <= 400: relative difference <= 2.5e-15 in Q(b),
   1.5e-15 in F(b). T(250) = 11.757622133 (checkpoint 11.757622). Three slices against one: 1.2e-14.
   The runs at B = 1e6 and B = 3e5 reproduce the first-moment table of `s4` from the same traversal
   (F(b)/(phi(b) b) on b >= 1e5: minimum 0.69549452 at b = 100102, maximum 0.69549754 at b = 100858, as
   there). Server run (B = 1e6, six slices, gcc) against the local run (B = 3e5, one slice, clang) on every
   b <= 3e5: relative difference <= 4.3e-14 in Q(b), envelope maxima identical. The pair count of the six
   slices equals sum_{3<=b<=1e6} (phi(b) - 1) exactly.
   Single-b evaluation by mode L (two separate c0 evaluations per pair) against the QT value at b = 127, 251,
   30030, 100003, 299993: relative difference <= 2e-14 in Q(b), envelope and minimum identical to 15 digits.
   Server timing probe (B = 1e5, 3e5, one slice): 24 and 32 ns per node; local 14.5 ns.
2. E1 closed formula against the definition sum_{(a,b)=1} a log a at 40 digits: max difference of E1(b)/b
   1.1e-16 (every b < 400 and b = 1024, 1155, 2187, 2310, 2311, 2730, 2999, 3000); T(b) against the
   40-digit divisor sum: 8e-17. b = 223092870 from the definition (80-bit): E1/b = -0.002098461072; formula
   -0.002098461048.
3. 210-digit divisor sums of T(b) and E1(b) on 336 sets against the float64 formula: agreement inside the
   stated enclosure; the extreme of the exhaustive scan at omega = 5 (-12 T/(1-P) = 1.00529550231 at
   181 191 193 197 199) is reproduced.
4. Sieve: pi(1e12) = 37,607,912,018 and theta(1e12) = 999,999,030,333.096 (known values). Prime sums in
   80-bit accumulation, per-prime terms in float64 (absolute error of the sums below 1e-14).
5. -F'/F coefficients: for chi_5 the routine returns chi(n) Lambda(n) (max abs(Lambda_F(n))/log n = 1) and
   the partial sums tend to -L'/L(1, chi_5) = -0.8276794767 (mpmath, Hurwitz zeta).
6. Mode AB against the two-pass routine of `s4`: S(b) and A(b) identical to 15 digits at b = 97, 2310, 30031,
   1000003, 10000019; every 7th modulus compared term by term (value and inverse), no mismatch. Small-inverse
   counts against an independent factorisation of b h - 1: identical at b = 1000003 and 10000019 (8 values
   of H each).
7. Periodic modes: new fields against direct pair values at b = 299 (DH), 16 digits.

## 3. Combination 1: sign law and quarter ceiling

Definitions (imp-97265, imp-97309, imp-97333). L1(b) = sum_{1<=a<b,(a,b)=1} a log a,
E1(b) = L1(b) - phi(b) b ((1/2) log b - 1/4). G(n) = sum_{k<=n} k log k =
(n^2/2 + n/2 + 1/12) log n - n^2/4 + ln A + r(n), ln A = 0.24875447703378426 (Glaisher-Kinkelin),
0 < r(n) <= 1/(720 n^2) (CLASSICAL, enveloping Euler-Maclaurin series; checked at 60 digits for n <= 400),
r(1) = 1/4 - ln A = 0.0012455. J(n) = log n! - (n + 1/2) log n + n - (1/2) log 2 pi,
1/(12n) - 1/(360 n^3) < J(n) < 1/(12n) (CLASSICAL). T(b) = sum_{e|b, e>=2} mu(e) J(e-1).

### 3.1 Sign law (PROVED for every squarefree b >= 2)

Let p1 be the smallest prime factor of b and P = phi(b)/b = sum_{e|b} mu(e)/e.

    12 T(b) <= sum_{e|b,e>=2} mu(e)/(e-1) + (1/30) sum_{e|b, mu(e)=-1} (e-1)^-3
            =  (P - 1) + sum_{e|b,e>=2} mu(e)/(e(e-1)) + (1/30) sum_{mu(e)=-1} (e-1)^-3.

(a) P - 1 <= -1/p1, since P <= 1 - 1/p1. (b) In the middle sum the negative terms are dropped; the positive
terms belong to distinct integers e >= p1 p2 >= p1(p1+1), so the sum is at most
sum_{n >= p1(p1+1)} 1/(n(n-1)) = 1/(p1^2 + p1 - 1). (c) The last sum is at most
(1/30) sum_{n >= p1-1} n^-3, which is zeta(3)/30 = 0.0401 for p1 = 2 and at most
(1/30)((p1-1)^-3 + (1/2)(p1-1)^-2) for p1 >= 3. Hence

    12 T(b) <= -1/p1 + 1/(p1^2 + p1 - 1) + (1/30) sum_{n >= p1-1} n^-3 < 0:

p1 = 2: -0.5 + 0.2 + 0.0401; p1 = 3: -0.3333 + 0.0909 + 0.0083; p1 >= 5: the two positive terms are below
1/(p1^2) + 1/(20 (p1-1)^2) < 1/p1. So T(b) < 0, i.e. sign R(b) = (-1)^(omega(b)-1). The inter-level
cancellation named in imp-97333 (IMP97333_SIGN_TAIL_SUBGAP) is the identity sum_{e|b} mu(e)/e = phi(b)/b; the
level sums diverge, their alternating sum is P - 1 in (-1, 0).

MEASURED, consistent with the proof: T(b) < 0 on all 607,927,123 squarefree b <= 1e9; on all subsets of the
primes below 200 with omega <= 12 the upper bound of T(b)/((1-P)/12) is at most -1.0051 (so
T(b) <= -(1-P)/12 there; this stronger inequality also holds on b <= 1e9 for omega >= 2, minimum of
-12 T/(1-P) = 1.0000316, and for primes by the formula 12 p J(p-1) > 1; it is not proved in general).

Which property of mu the sign uses: the value mu(p) = -1 at primes (through prod (1 - 1/p) < 1, a statement
about the partial Euler product of 1/zeta at s = 1) and abs(mu(e)) <= 1. The support on squarefree numbers
is not used: Liouville's function gives no violation on any b <= 2e5 (MEASURED; for squarefree b it is the
same sum).

Controls (c = inverse Dirichlet coefficients; every b <= 2e5; T_c(b) = sum_{e|b,e>=2} c(e) J(e-1)):

| object | c | first b with T_c(b) >= 0 | violations among b <= 2e5 | first b with abs(E1_c(b)) > b/4 |
|---|---|---|---|---|
| zeta | mu | none | 0 | none (but see 3.2) |
| Liouville | lambda | none | 0 | none |
| L(chi_-4) (comparison) | mu chi | 3 | 129,603 | 3 |
| L(chi_5) (comparison) | mu chi | 2 | 171,690 | 2 |
| zeta(s+a) zeta(s-a), a = 1/4 | c(p) = -(p^a + p^-a), c(p^2) = 1 | none | 0 | 2 |
| T-NR q = 2 (c = 2.1), 3, 101 (c = 2.2) | mu * (1 + c q^(1/2) q^-s + q q^-2s)^-1 | none | 0 | q |
| T-NR q = 1000003, c = 2.2 | same | none at b = q m, q^2 m, q^3 (m = 1, 2, 6, 30, 210; 40 digits) | 0 of 9 | q (c(q) = -2201) |
| Davenport-Heilbronn | Dirichlet inverse (c(3) = +0.284) | 3 | 102,810 | 4 |
| sign twist eps_p = -1 (zeta(2s)/zeta(s)) | abs(mu) | 2 | all | 2 |
| random sign twist | mu(n) prod eps_p | 7 (first prime with eps_p = -1) | 31,225 | 7 |
| unimodular twist zeta(s+i) | mu(n) n^-i (real part) | 5 | 48,624 | 5 |
| backward heat | no Dirichlet series | not formulable | | |

The object enters through the signs and sizes of its inverse coefficients at primes (value of a local factor
at s = 1), not through its zeros. The two comparison L-functions fail at b = 2 or 3. The two controls with
zeros off the line and coefficients of zeta type at primes (T-NR, zeta(s+a)zeta(s-a)) pass at every b. So the
statistic sorts functions by a property unrelated to the location of zeros. Every onset is at b <= 7; the
off-line zeros of the controls are at heights 0.2 to 86.

### 3.2 Quarter ceiling

**Exact formula (PROVED).** Coprimality by Moebius inversion and the Glaisher-Kinkelin expansion give, for
every b >= 2, with g(m) = ln A + (1/12) log m + r(m) (so g(1) = 1/4):

    E1(b) = sum_{d | b} mu(d) d g(b/d).

For squarefree b this is E1(b) = mu(b) b [ 1/4 + sum_{e|b,e>1} mu(e) g(e)/e ], and with
sum_{e|b} mu(e)/e = P, sum_{e|b} mu(e) log e / e = -P L, L = sum_{p|b} log p/(p-1):

    E1(b) = mu(b) b [ P (ln A - L/12) + rho(b) ],    rho(b) = sum_{e|b} mu(e) r(e)/e,   0 < rho(b) <= r(1).

(rho <= r(1): the sum over e > 1 is at most -r(p1)/p1 + sum_{n >= p1^2+p1} r(n)/n < 0. rho > 0:
r(1) - sum_{n>=2} r(n)/n >= 0.00124 - (zeta(3)-1)/720.) For general b with R = rad(b), c = b/R:
E1(b)/b = (mu(R) P / c) [ ln A + (log c - L)/12 ] + sum_{d|R} mu(d) r(b/d)/(b/d).

The ceiling for squarefree b is the pair of inequalities -1/4 <= P (ln A - L/12) + rho <= 1/4.

- Upper side: PROVED for every squarefree b. P (ln A - L/12) + rho < ln A + r(1) = 1/4.
- Lower side: equivalent to P (L/12 - ln A) - rho <= 1/4. It fails as soon as
  P (L/12 - ln A) > 1/2 - ln A = 0.2512455.

**The ceiling holds for omega(b) <= 121 (PROVED).** A violation of the lower side needs
L > 3 + 12 ln A = 5.98505 (as P < 1, rho > 0). L(b) <= sum over the first omega(b) primes of log p/(p-1),
which is 5.98076 for the first 121 primes and 5.99045 for the first 122 (p_122 = 673). For non-squarefree b
with L <= 5.98505: abs(E1(b))/b <= max((ln A + (log c)/12)/c, 1/(4c)) + (zeta(3)-1)/720 <= 0.1536. Hence
abs(E1(b)) < b/4 for every b with omega(b) <= 121, in particular for every b < p_122# (log10 = 280.94).

**The ceiling is false (CERTIFIED).** For b = product of the primes in [Y, X], P is about log Y/log X and L
about log(X/Y), so P L is about (1 - theta) log Y with theta = log Y/log X: unbounded. Float64 search over
Y <= 30000 (every prime Y <= 17389), X <= 1.5e8: the first X at which the lower side fails is smallest for
Y = 1429, X = 41043647. Ball arithmetic (python-flint arb, 200 bits, every prime of the interval):

| Y | X | omega(b) | log10 b | P | L | P (L/12 - ln A) - (1/2 - ln A) | mu(b) E1(b)/(b/4) <= |
|---|---|---|---|---|---|---|---|
| 1429 | 41043647 | 2,493,025 | 17,822,308.93 | 0.41503113 | 10.24943966 | +4.1063e-9 (certified > 0) | -1.0000000164 |
| 1429 | 41043641 | 2,493,024 | 17,822,301.32 | 0.41503114 | 10.24943924 | -4.5442e-9 (no violation certified) | -0.9999999818 |
| 1429 | 41999987 | 2,547,395 | 18,236,513.78 | 0.41448800 | 10.27241059 | +4.6464e-4 | -1.00185857 |
| 1009 | 99999989 | 5,761,287 | 43,423,704.11 | 0.37645430 | 11.47966283 | +1.5240e-2 | -1.06096195 |

So abs(E1(b)) > b/4 for the first, third and fourth b. With Y = sqrt(X) one gets
abs(E1(b))/b ~ (1/48) log log b: sup abs(E1(b))/b = infinity (PROVED from Mertens' theorems; the constant 1/48
is the heuristic optimum, not proved).

Whether a smaller counterexample exists outside the interval family is not decided. A first-order argument
(adding a prime p to a set S raises P (L - 12 ln A) exactly when log p > L(S) - 12 ln A) says that the optimal
set with largest prime <= X is a threshold set {p > Y}, which is the family searched; this is not written as
a proof. What is proved is the range omega(b) <= 121.

MEASURED, consistent: on every b <= 1e9, max 4 abs(E1(b))/b = 0.99999999210 (prime 999999883); over
non-primes 0.99971863 (b = 999992813 = 31477 x 31769, two close primes); min of the margin
b/4 - abs(E1(b)) = 0.30685 at b = 2; on squarefree b the quantity x(b) = mu(b) E1(b)/(b/4) lies in
[0.0083938 (b = 223092870), 1). On the subsets of primes below 200: x(b) in [-0.0086074, 0.9297] for
omega = 5..12; the minimum at each omega is the primorial, with the sign change at omega = 11 (the point
where the MCM hypothesis fails, imp-97432); the lower bound -1 is not approached in any computed range.

Controls for the ceiling: last column of the table in 3.1. The ceiling uses abs(c(p)) <= 1 at primes (the
leading term is c(b) b/4 at a prime); every control whose inverse coefficient exceeds 1 in modulus or has the
other sign fails at its first such prime. Coefficients, not zeros.

Classification: CLOSED. The sign law is a theorem about the partial Euler product of 1/zeta at s = 1; the
ceiling is false for mu itself at b near 10^(1.78e7). Controls with off-line zeros pass the sign law,
comparison L-functions fail it.

## 4. Combination 2: second moment Q(b), envelope, T(M)

Statistic: Q(b) = sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2; envelope K(b) = max_a I(a,b)/(a(1 + log(b/a)));
T(M) = 2 sum_{3<=b<=M} Q(b)/b^2.

What is already proved (`b-route-m-first-moment`): I(a,b) = b A(a/b), lambda <= A(lambda) <=
lambda(2 + log(1/lambda)) (L2), so K(b) <= 2 and Q(b) <= 10 b for every b (the open lemma of node
`cotangent-second-moment-upper-lemma` with s0* = 10); Theorem 2 there:
abs(Q(b) - s0 phi(b)) <= 2^omega(b) E2(b) + (2 + log b)^2, s0 = (1/(4 pi)) int abs(zeta(1/2+it))^4/(1/4+t^2)^2 dt.
So the normalisation is phi(b), sup Q(b)/b = s0, and the source band 1.76 to 1.79 is the average of
Q(b)/b = s0 phi(b)/b, i.e. 6 s0/pi^2 = 1.7747.

Zeta, every 3 <= b <= 1e6 (MEASURED; s0 = 2.9193029855: quadrature to T = 400 gives 2.9193028619, the part
400 <= abs(t) <= 3000 adds 1.2360e-7, the rest is below 1e-9; not interval-certified):

| range of b | sup Q(b)/phi(b) (at b) | min of s0 phi(b) - Q(b) (at b) | max of s0 phi(b) - Q(b) (at b) | K(b): range |
|---|---|---|---|---|
| 3 <= b < 100 | 2.745156 (91) | 4.087 (3) | 19.09 (97) | [0.941546, 1.232441] |
| 100 <= b < 1e3 | 2.893888 (989) | 11.942 (102) | 34.22 (997) | [1.232672, 1.256704] |
| 1e3 <= b < 1e4 | 2.915432 (9983) | 20.969 (1034) | 53.00 (9967) | [1.256708, 1.260151] |
| 1e4 <= b < 1e5 | 2.918787 (99499) | 32.405 (10045) | 75.90 (99929) | [1.260151, 1.260599] |
| 1e5 <= b < 3e5 | 2.919108 (299423) | 46.525 (100529) | 88.20 (299317) | [1.260599, 1.260639] |
| 3e5 <= b <= 1e6 | 2.919236 (999203) | 54.440 (301223) | 102.71 (999269) | [1.260639, 1.260654] |

Q(b) < s0 phi(b) for every b in the range, without exception; the smallest margin is 4.09 at b = 3. The deficit
is of size log^2 b for every b, not only for primes: for b >= 1000, (s0 phi(b) - Q(b))/log^2 b lies in
[0.360, 0.715] (omega = 1), [0.340, 0.498] (omega = 2), [0.336, 0.449] (3), [0.333, 0.443] (4),
[0.335, 0.421] (5), [0.334, 0.368] (6), [0.341, 0.347] (7). On primes 1000 <= b <= 1e6:
s0 phi - Q = 0.37531 log^2 b + 2.14691 log b + 1.38428 with rms residual 0.030 (the leading coefficient is
close to 3/8; the excluded term a = 1 alone is I(1,b)^2 = ((1/2) log b + C + 1/2 + o(1))^2; not derived here). Mean of Q(b)/b on
(5e5, 1e6]: 1.774629; 6 s0/pi^2 = 1.774723. min over a and b of I(a,b)/a = 1.214245856.
T(M) = 11.757622, 16.558568, 24.680798, 32.846308, 41.018181 at M = 250, 1e3, 1e4, 1e5, 1e6; slopes between
consecutive checkpoints 3.4632, 3.5274, 3.5462, 3.5490; 12 s0/pi^2 = 3.5494.

Single moduli: Q(b)/phi(b) = 2.9192003 (b = 1000003), 2.9192527 (9699690), 2.9192896 (10000019),
2.9193013 (100000007); s0 phi(b) - Q(b) = 102.65, 133.47, 168.18 at the three primes (the fit to the primes
below 1e6 given above predicts 102.68, 133.49, 168.28) and 83.43 at 9699690. Envelope: K(b) = 1.2606540, 1.2606605, 1.2606605, 1.2606613 at the same
four b; log 2 pi - gamma = 1.2606614. min_a I(a,b)/a = 1.2142458562 at all four (the minimum of
A(lambda)/lambda on (0, 1], against the proved lower bound 1).

Controls and comparison (MEASURED; s0_F = (1/(4 pi)) int abs(F(1/2+it))^4/(1/4+t^2)^2 dt by quadrature to
T = 400):

| F | s0_F (quadrature) | Q_F(b)/phi(b) measured | sup abs(I_F(a,b))/a | sup abs(I_F)/(a(1+log(b/a))) | off-line zeros |
|---|---|---|---|---|---|
| zeta | 2.919303 | see above | unbounded (log b) | 1.2606614 | none known |
| L(chi_-4) | 0.2608753 | 0.260864 (b = 30030), 0.260873 (100003); [0.25996, 0.26098] on 1000 <= b <= 5000 | 0.78537 (-> pi/4 = A_F(1)) | 0.78536 | none known |
| L(chi_5) | 0.0772737 | 0.077291 (30030), 0.077272 (100003); [0.07704, 0.07749] on 1000 <= b <= 5000 | 0.66060 | 0.66060 | none known |
| Davenport-Heilbronn | 0.5661151 | 0.566038 (30030), 0.566110 (100003); [0.56397, 0.56613] on 1000 <= b <= 5000 | 0.99725 | 0.99724 | 0.8085 + 85.70 i, ... |
| T-NR q = 2, c = 2.1 | 804.510 | 774.8 (b = 251), 804.478 (1000003), 804.494 (9699690) | | 18.94, 19.11, 19.11 | 0.954 + 4.53 i |
| T-NR q = 3, c = 2.2 | 857.551 | 821.7 (251), 857.511 (1000003), 857.531 (9699690) | | 18.73, 18.88, 18.88 | 0.904 + 2.86 i |
| T-NR q = 101, c = 2.2 | 538.240 | 419.0 (251), 537.488 (1000003), 537.821 (9699690) | | 14.68, 42.92, 42.49 | 0.596 + 0.68 i |
| T-NR q = 1000003, c = 2.2 | not computed | 133.88 (b = 127), 137.78 (251); zeta x 48.58, 48.85 | | 8.54, 8.60 | 0.532 + 0.227 i |
| zeta(s+a)zeta(s-a), unimodular twist | finite (Lemma 1 of `s2`); no finite formula for I_F | NOT RUN | | | |
| backward heat, sign twist | not formulable (`s2`, section 6) | | | | |

Reading.
- Every F has Q_F(b) = s0_F phi(b) + lower order, the constant being a fourth moment of abs(F) on the line.
  The periodic functions are entire, I_F(a,b) = O(a) without the logarithm, and the lower-order term is bounded
  instead of log^2 b (every 1000 <= b <= 5000: Q_F - s0_F phi in [-0.40, 0.06] for chi_-4, [-0.17, 0.17] for chi_5, [-0.70, 0.02] for Davenport-Heilbronn, against -30 to -45 for zeta in that range). That separates functions with a pole at 1 from entire ones.
  Davenport-Heilbronn has the same form as the two L-functions, with a constant between zeta's and theirs.
- T-NR: for b below q the Gram entries are those of zeta times (c^2+2) up to O(q^(-1/2) log q) (measured
  factor 48.6 to 48.9 in Q against (c^2+2)^2 = 46.8), and the envelope constant is 8.5. The constants move to
  their limits (s0_F, and an envelope constant of order q: 42.9 for q = 101) when b passes q and q^2. The
  zeros of T-NR form a lattice of spacing 2 pi/log q in height; a window of length log b in the logarithmic
  variable resolves it when log b reaches log q to 2 log q. The onset b ~ q .. q^2 is that resolution scale.
- By Lemma 2 of `s2-vasyunin-cotangent-controls` (a function with an inserted off-line zero pair and the same
  modulus on the line has the same Gram matrix) no statistic of this combination can fail for such a control.

Classification: CLOSED, as expected (Gram-only statistic). Same form for every F, other constants; the only
b-dependence that distinguishes T-NR is at its own lattice scale.

## 5. Combination 3: MCM bracket, Mertens remainder to 1e12

Objects (imp-97619). Sigma(x) = sum_{p<=x} log p/(p-1), M(x) = log x - Sigma(x) -> gamma,
bracket = ln A + M/12 -> B_inf = ln A + gamma/12 = 0.29685578244224533,
gap = Pi(x) (ln A - Sigma(x)/12) + e^-gamma/12, Pi(x) = prod_{p<=x}(1 - 1/p); gap law
gap ~ e^-gamma B_inf/log x. ln A to 30 digits throughout.

**Structure of the remainder (PROVED identity + CLASSICAL explicit formula).**
Sigma(x) = sum_{n<=x} Lambda(n)/n + sum_{k>=2} sum_{x^(1/k) < p <= x} (log p)/p^k. The second part is
x^(-1/2) + (1/2) x^(-2/3) + (1/3) x^(-3/4) + ... up to O(x^(-3/4)) errors; the first is
log x - gamma + Z(x), Z(x) = -sum_rho x^(rho-1)/(rho-1) + O(1/x). Hence

    (M(x) - gamma) sqrt x = -1 - (1/2) x^(-1/6) - (1/3) x^(-1/4) - ... + W(x),   W(x) = -Z(x) sqrt x,

so the bracket approaches B_inf from below with B_inf - bracket = (1 - W(x) + o(1))/(12 sqrt x): the leading
term 1/(12 sqrt p) is elementary (prime squares), and W is the sum over the zeros.

Zeta (MEASURED, all primes to 1e12):

| x | pi(x) | bracket | B_inf - bracket | 12 sqrt x (B_inf - bracket) | W(x) | gap log x/(e^-gamma B_inf) | Mertens eps = Pi log x e^gamma - 1 |
|---|---|---|---|---|---|---|---|
| 1.005e3 | 168 | 0.29449256640 | 2.3632e-3 | 0.8990 | +0.350 | 0.9950250143 | -3.148e-3 |
| 1.002e4 | 1231 | 0.29576839641 | 1.0874e-3 | 1.3060 | -0.149 | 0.9983000530 | -1.235e-3 |
| 9.978e4 | 9572 | 0.29653335525 | 3.2243e-4 | 1.2222 | -0.122 | 0.9995787721 | -2.979e-4 |
| 1.004e6 | 78778 | 0.29678472731 | 7.1055e-5 | 0.8542 | +0.210 | 0.9999137233 | -5.316e-5 |
| 1.007e8 | 5797406 | 0.29684959809 | 6.1844e-6 | 0.7446 | +0.283 | 0.9999938801 | -3.526e-6 |
| 9.982e8 | 50762865 | 0.29685290911 | 2.8733e-6 | 1.0894 | -0.071 | 0.9999977217 | -1.536e-6 |
| 1.002e10 | 455748040 | 0.29685443772 | 1.3447e-6 | 1.6150 | -0.603 | 0.9999991210 | -6.681e-7 |
| 9.974e10 | 4107809676 | 0.29685549088 | 2.9156e-7 | 1.1050 | -0.097 | 0.9999998092 | -1.295e-7 |
| 1e12 | 37607912018 | 0.29685569470 | 8.7746e-8 | 1.0530 | -0.048 | 0.9999999463 | -3.580e-8 |

sup abs(W) over each decade from 1e4 to 1e12 (grid of ratio 1.01): 0.660, 0.572, 0.556, 0.368, 0.614, 0.623,
0.603, 0.638; mean of W on x >= 1e4: +0.008. Envelope exponent of abs(M - gamma) on [1e6, 1e12]: -0.498.
The gap follows e^-gamma B_inf/log x with a relative correction equal to the Mertens error eps (last two
columns: 1 - ratio = 1.5 abs(eps)), also of order x^(-1/2). The reading of imp-97619 ("next order is the PNT
error, not an elementary term") is refined: the leading correction of the bracket is the elementary
1/(12 sqrt x), and the zero sum W is of the same order with mean 0.

Comparison and controls. Same prime sums with the local factors of each object; D(x) = partial sum minus
limit (limits: -L'/L(1, chi_-4) = -0.2456095848, -L'/L(1, chi_5) = -0.8276794767,
-zeta'/zeta(1+i) = -0.5296262 - 0.8258985 i with the pole term i x^-i removed, 4 x^(1/4) - zeta'/zeta(3/4)
for the s-a factor of zeta(s+a)zeta(s-a)); W = D sqrt x minus the prime-square term.

| object | statistic | 1e6 | 1e8 | 1e10 | 1e12 | sup over [1e11, 1e12] | envelope exponent of abs(D), [1e6, 1e12] |
|---|---|---|---|---|---|---|---|
| zeta | W | +0.210 | +0.283 | -0.603 | -0.048 | 0.638 | -0.498 |
| L(chi_-4) | W | -0.783 | +0.322 | -0.182 | -0.700 | 0.935 | -0.487 |
| L(chi_5) | W | +0.155 | -0.134 | -0.384 | -0.075 | 1.022 | -0.489 |
| unimodular twist zeta(s+i) | abs(W) | 0.181 | 0.273 | 0.608 | 0.049 | 0.637 | -0.496 |
| Liouville sign twist (eps_p = -1) | D sqrt x | 0.856 | 0.745 | 1.615 | 1.053 | 1.566 | -0.498 |
| random sign twist | D sqrt(x/log x) (limit taken at 1e12) | -1.95 | -2.12 | -0.16 | 0 | 1.749 | -0.5 (by construction of the random model) |
| zeta(s+a)zeta(s-a), a = 1/4 | D x^(1/4) | 1.821 | 1.742 | 2.614 | 2.052 | D sqrt x = 2309 | -0.249 |
| T-NR, any q (local factor at q) | identical to zeta for x < q; for x >= q zeta plus a constant | | | | | | -0.498 |
| Davenport-Heilbronn (no Euler product; sum_{n<=x} Lambda_F(n)/n, Lambda_F from -F'/F) | sup over [x/10, x] of abs(D) sqrt x | 3.21 | 16.67 | n <= 1e8 only | | | -0.230 on [1e3, 1e8] |
| L(chi_5), L(chi_-4) in the same n-sum form | same | 1.04, 1.16 | 1.07, 1.00 | | | | -0.478, -0.475 |
| backward heat | no Dirichlet series | not formulable | | | | | |

Reading.
- Every object with an Euler product over all primes and zeros on (or, for the random model, no zeros off)
  the line shows square-root cancellation with W = O(1): zeta, both L-functions, the unimodular twist, the
  Liouville twist (its sum differs from zeta's by 2 sum_{p>x} log p/(p^2-1) = O(1/x)), the random twist.
- T-NR does not fail at all in this statistic: its prime sum is zeta's for x < q and zeta's plus the constant
  -log q sum_k (alpha^k + beta^k) q^-k for x >= q. The partial sums over n <= x instead of p <= x show a
  sawtooth of height (c log q) 1.558^k/q^(k/2) at x = q^k, which is the sum of the explicit-formula terms of
  its zero lattice.
- zeta(s+a)zeta(s-a) fails at every x: exponent -1/4. Its zeros sit on Re s = 1/2 +- a and the coefficients
  carry the weight n^a; D x^(1/4) -> 2 + bounded oscillation, the 2 being the prime-square term. This is a
  shift of the critical line read off the coefficient sizes, not a hidden zero.
- Davenport-Heilbronn: sup abs(D) sqrt x per decade is 0.89, 1.31, 1.38, 2.36, 3.21, 8.37, 16.67 at
  x = 1e2 .. 1e8, against 0.9 to 1.2 for the two L-functions at every decade. The departure starts between
  1e4 and 1e5. A least-squares fit of the terms x^(rho-1) for the off-line zeros gives amplitudes
  0.02304 (rho = 0.8085 + 85.70 i; explicit formula 2/abs(rho-1) = 0.02334), 0.01097 (0.7243 + 176.70 i;
  0.01132), 0.00809 (0.8695 + 240.40 i; 0.00832); the 28 off-line pairs below height 1000 explain 71 % of the
  variance of D on [1e4, 1e8]. The first term alone reaches x^(-1/2) at x = (1/0.0233)^(1/0.3085) = 1.9e5.
  The onset is the explicit-formula envelope of the off-line zero at height 85.7: resolution of that zero, at
  the scale its position predicts, not earlier.
- The pass of zeta at every x <= 1e12 is itself implied by the verified height: with RH checked to height
  3e12 the bound abs(psi(x) - x) < sqrt x log^2 x/(8 pi) holds for every x with 4.92 sqrt(x/log x) <= 3e12
  (CLASSICAL, Buethe 2016, quoted from memory), i.e. far beyond 1e12.

Classification: CLOSED (pattern "prime sums separate the controls at the explicit-formula envelope of their
off-line zeros"). The object enters through its zeros. Onsets: DH 1e5 (zero at height 85.7,
beta - 1/2 = 0.31); zeta(s+a)zeta(s-a) at once (zeros at distance a = 1/4 from the line, height 14.1); T-NR
none in the local-factor form.

## 6. Combination 4: inverse-line absolute mean, small inverses

Statistic: A(b) = sum_{a=2,(a,b)=1}^{b-1} abs(c0(h_a/a)), h_a = b^-1 mod a (= sum abs(V(b,a))), against
c phi(b) b with c < kappa_arith = 0.5705; count N_H(b) = #{a < b, (a,b) = 1 : h_a <= H}.

Zeta (MEASURED).

| range | sup A(b)/(phi(b) b) | inf | source |
|---|---|---|---|
| every 3 <= b <= 3e5 | 0.150102 (b = 570) | 0 (b = 3) | file of `s4`, recomputed here |
| b >= 1e3 | 0.149999 (b = 1110) | 0.143931 (b = 1009) | same |
| b >= 1e4 | 0.148045 (b = 10260) | 0.146623 (b = 11970) | same |
| b >= 1e5, b <= 3e5 | 0.147480 (b = 103530) | 0.147190 (b = 104286) | same |
| every 1e5 <= b <= 1e6 | 0.147481 | 0.147189 | `s4` (c1(b) in [0.294379, 0.294961], A/(phi b) = c1 (1/2 - 1/(b phi))) |
| 1198 primes in [1e5, 1e6) | 0.1473745 (b = 110681) | 0.1472717 | server + local, this lane |
| 4020 primes in [1e6, 1e7) | 0.1473600 (b = 1046519) | 0.1473397 | same |
| 1544 primes in [1e7, 1e8), of which 184 above 9.99e7 | 0.1473518 (b = 12565799) | 0.1473494 | same |
| composite b = 9699690, 1e8, 223092870 | 0.147351 each | | server |

So c = 0.1501 covers every b <= 1e6 and the prime sample (26 % of the threshold 0.5705); the ratio tends to
0.14735 (c1/2 of `s4`); the signed mean S(b)/(phi(b) b) tends to -1/(4 pi) = -0.0795775.

Small inverses. h_a = h exactly when a divides b h - 1 and a > h, so N_H(b) = sum_{h<=H} #{a | bh - 1 :
h < a < b} <= sum_{h<=H} d(bh - 1) (PROVED, elementary; this is the node's inequality: the bound counts every
divisor of bh - 1, the count only those in (h, b)).

| b | H = 1 | 10 | 100 | 1000 | bound sum d(bh-1): 1, 10, 100, 1000 |
|---|---|---|---|---|---|
| 1000003 | 7 | 177 | 1011 | 7865 | 8, 218, 1850, 20764 |
| 9699690 | 7 | 23 | 213 | 1739 | 8, 42, 442, 4900 |
| 10000019 | 23 | 121 | 1135 | 10179 | 24, 158, 1980, 23150 |
| 99999989 | 11 | 167 | 1357 | 12009 | 12, 206, 2188, 24944 |
| 100000000 | 47 | 143 | 659 | 5267 | 48, 170, 1096, 11356 |
| 223092870 | 7 | 17 | 219 | 2163 | 8, 36, 444, 5242 |

Distribution of the inverse (MEASURED). The six moduli above: the histogram of h_a/a in 20 bins is flat to
five digits (share 0.05000 in every bin), and the share of sum_a abs(c0(h_a/a))/a carried by each bin is flat
as well (0.0998 to 0.1002 in the two end bins together, 0.5000 to 0.5011 in the ten middle bins): the mass of
A(b) is not carried by small inverses. On the 6762 primes, N_H(b)/(H (log(b/H) + 1)) has mean 0.993, 0.999,
0.997, 1.000 for H = 10, 30, 100, 1000 (maximum 2.90, 1.92, 1.46, 1.10); for H = 1 the mean is 1.73 and the
maximum 21.1 (N_1(b) = d(b-1) - 1 fluctuates like a divisor function). The largest single term of A(b) is
at most 3.3e-5 phi(b) b at b >= 1e5 and 5.5e-8 at b near 1e8.

Comparison and controls (periodic leaf sums, MEASURED; A_F(b) = sum over a of the absolute value of the
varying-modulus half -T(b,a)/q of I_F(a,b)):

| F | A_F(b)/(phi(b) b), b = 30030 | b = 100003 | every 1000 <= b <= 5000: range (maximum at) | abs(leaf sum)/A_F |
|---|---|---|---|---|
| zeta | 0.14749 | 0.14735 | [0.14393, 0.15000] (b = 1110) | 0.5402 (`s2`) |
| L(chi_-4) | 0.52769 | 0.52757 | [0.52395, 0.53145] (b = 1040) | 0.9568 |
| L(chi_5) | 0.70473 | 0.70469 | [0.69480, 0.71293] (b = 1302) | 0.7784 |
| Davenport-Heilbronn | 0.59902 | 0.59899 | [0.59656, 0.60250] (b = 1210) | 0.9855 |
| T-NR | the single leaf is not defined (`s4`, section 5) | NOT RUN | | |
| zeta(s+a)zeta(s-a), unimodular twist, heat, sign twist | no finite formula or not formulable | NOT RUN | | |

The threshold 0.5705 = (3/2)C - 3/8 is the arithmetic part of zeta's first moment; the periodic functions
have no arithmetic part and their leaf is in other units, so "above 0.5705" has no meaning for them: read
literally, L(chi_5) (0.705) and Davenport-Heilbronn (0.599) are above, L(chi_-4) (0.528) is below. The ratio
converges to a constant for each F; Davenport-Heilbronn lies between the two L-functions.

The object: V(b,a) = -(2a/pi^2) sum_n d(n) sin(2 pi n b/a)/n (values at s = 1 of the Estermann function,
`s4` section 5), and A(b) is a first absolute moment of these over a < b. It enters through coefficient
correlations at s = 1, not through zeros. By Cauchy-Schwarz with weights a,
A(b) <= (sum_a V(b,a)^2/a)^(1/2) (sum_a a)^(1/2) = (1/2) M2w(b)^(1/2) phi(b) b with the second moment M2w of
`s4`; in the limit this is 0.2086 phi(b) b. The bound A(b) <= 0.5705 phi(b) b follows from M2w(b) <= 1.30,
a mean-value statement on the line Re s = 1 (MEASURED 0.17412 in the limit, maximum 0.1754 on b >= 100;
not proved here).

Classification: CLOSED. Zeta: c = 0.150 at every size; controls: other constants, no b-dependence that
separates Davenport-Heilbronn from the L-functions.

## 7. Table

| combination | statistic | sizes reached | zeta | L(chi_-4), L(chi_5) | zeta(s+a)zeta(s-a) | T-NR | Davenport-Heilbronn | heat, sign twist, unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|
| 1 sign law | T_c(b) < 0 | b <= 1e9; 5.8e10 subsets; controls b <= 2e5 | PROVED for all squarefree b | fail at b = 3, 2 | pass | pass (q = 2, 3, 101, 1000003) | fail at b = 3 | heat not formulable; eps = -1 fails at 2; random at 7; twist at 5 | CLOSED: sign and size of inverse coefficients at primes; controls with off-line zeros pass |
| 1 ceiling | abs(E1_c(b)) <= b/4 | same; certificates to log10 b = 4.3e7 | holds for omega(b) <= 121 (PROVED), false at b = prod_{1429<=p<=41043647} p (CERTIFIED) | fail at 3, 2 | fail at 2 | fail at q | fail at 4 | fail at 2, 7, 5 | CLOSED: false for zeta |
| 2 second moment | Q(b)/phi(b), envelope, T(M) | every b <= 1e6; 4 moduli to 1e8; periodic b <= 5000 and 100003 | Q < s0 phi, s0 = 2.919303; K = 1.26066 | s0_F = 0.26088, 0.07727; K_F = 0.785, 0.661 | NOT RUN | s0_F = 804.5, 857.6, 538.2; constants move at b ~ q..q^2 | s0_F = 0.56612; K_F = 0.997 | not formulable / NOT RUN | CLOSED: Gram-only, fourth moment on the line |
| 3 MCM bracket | (M - gamma) sqrt x, W(x) | primes to 1e12; n <= 1e8 for -F'/F | abs(W) <= 0.66, exponent -0.498 | abs(W) <= 1.47, 1.15; exponent -0.49 | exponent -0.249 at every x | identical to zeta (local-factor form) | exponent -0.23; departs at x ~ 1e5 = envelope of the zero at height 85.7 | Liouville and random twist pass; twist passes; heat not formulable | CLOSED: zeros enter by the explicit formula, onset at the envelope |
| 4 inverse line | A(b)/(phi(b) b), small inverses | every b <= 1e6; 6762 primes to 1e8 | sup 0.1501 (b = 570), limit 0.14735 | 0.528, 0.705 | NOT RUN | not defined | 0.599 | NOT RUN | CLOSED: mean value at s = 1, constants only |

## 8. Three weakest steps

1. Section 3.2: the minimality of the counterexample is not proved (interval family only, float64 search),
   and the bound 0 < r(n) <= 1/(720 n^2) for the Glaisher-Kinkelin remainder is taken as classical (checked
   numerically for n <= 400 at 60 digits); the certificate needs only rho <= r(1) + 2e-16, i.e. 0 <= r(n) <= 1/(720 n^2) for n >= 1429^2, against
   a certified margin 4.1e-9. The certificate itself is ball arithmetic on 2.5 million primes produced by
   a numpy sieve; the sieve is not independently certified (the prime count of the 1e12 sieve is checked, this
   one is checked only through pi(X) implicitly).
2. Section 4: s0 comes from a non-certified quadrature (to T = 3000; agreement with the deficit law at
   b = 1e8 + 7 to 1.1e-9); the statement Q(b) < s0 phi(b) has margin >= 4 at every b <= 1e6 and about 100
   near 1e6, so it does not depend on the last digits, but the one-sided inequality is MEASURED, not proved. The periodic tables stop at b = 5000.
3. Section 5: the Davenport-Heilbronn series -F'/F is used to n = 1e8 with float64 coefficients that grow
   (max abs(Lambda_F(n))/log n = 3980 there); the fit of the zero terms is least squares on a grid of ratio
   1.01 and is ill-conditioned for the zeros with beta near 1/2 (only the amplitudes of the zeros with
   beta > 0.7 are quoted). The limit of the random-twist sum is taken as its value at 1e12.

## Files

`s5.c`, `gtab.h` (engine; modes QT, AB new), `e1scan.c`, `dfs.c`, `tabs.h` (E1 and T), `mp200.py`,
`controls1.py`, `controls1.json`, `ceiling_search.py`, `ceiling_cert.py`, `out/cert_*.txt`,
`sieve_mertens.c`, `analyze_sieve.py`, `out/sieve_1000000000000.txt`, `out/sieve_analysis.json`, `dhlog.c`,
`analyze_dh.py`, `out/dhlog_*_1e8.txt`, `out/dh_analysis.txt`, `consts2.py`, `consts2.json`,
`analyze_qt.py`, `analyze_ab.py`, `analyze_per.py`, `divbound.py`, `divbound.json`, `ab_3e5.json`,
`run_*.sh`, `chain_*.sh` (server units), `out/` (server results), `dfs_200_12.txt`, `out/e1scan_1e9.txt`.
