# Referee for W5c (statement of `c17-window-information-law-ctheta-u5/REFEREE2.md`, section 4) and the source of Turan's theorem

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Neither item is a statement about zeros of zeta.

## A. Turan's second main theorem: statement, constant and the factor 2

Montgomery's Ten Lectures (CBMS 84, 1994, chapter 5) was not obtained: the AMS chapter files are not open. **Opened instead: H. L.
Montgomery and R. C. Vaughan, Multiplicative Number Theory III (draft; R. C. Vaughan's page,
https://personal.science.psu.edu/rcv4/Vol3/Vol3.pdf), Appendix K "Notes on Turan's power sum method", section K.2, page 350.**
Text extracted with pdftotext and read:

- Power sums S_h = sum over n <= N of a_n z_n^h (K.1).
- **Theorem K.3 (Turan's Second Main Theorem).** Suppose that 1 = abs(z_1) >= abs(z_2) >= ... >= abs(z_N). Then for any M >= 0 and
  N >= 1 there is an h with M + 1 <= h <= M + N and
  abs(S_h) >= 2 (N/(8e(M + N)))^N min over 1 <= J <= N of abs(a_1 + ... + a_J).
- Corollary K.4: without the normalisation, the same with the factor (max abs z_n)^h. Corollary K.5: for L >= N there is h in
  [L + 1, 2L] with abs(S_h) >= 2 (16e)^-L (max abs z_n)^h min_J abs(a_1 + ... + a_J).
- Proof read (pages 351 to 353). The factor 2 comes from Chebyshev's bound max over an interval of length l of a monic polynomial
  of degree d is at least 2 (l/4)^d, applied to prod (x - abs z_n) on [M/(M+N), 1]; this gives a radius r with
  r^M prod abs(r - abs z_n) > 2 (N/(4e(M + N)))^N; interpolation at the z_n (value z_n^(-M-1) for abs z_n > r, 0 otherwise) gives
  abs(a_1 + ... + a_J) <= (sum abs b_j) max over M+1 <= h <= M+N of abs(S_h) with sum abs b_j < (1/2)(4e(M+N)/N)^N 2^N. The
  steps are consistent and give the stated constant.

Decision. **The factor 2 and the constant 8e are confirmed in a text by Montgomery (with Vaughan), with proof.** The statement used
in c16 Lemma T and c17 Corollary T' (ordering by decreasing modulus, abs z_1 = 1, range M + 1 .. M + N, bound
2 (N/(8e(M+N)))^N min_J abs(b_1 + ... + b_J)) is word for word Theorem K.3. The constant 0.2927 delta of Corollary T' (which uses
the factor 2) stands; 5.845 = (6/5) log(48 e) is unchanged. Remaining qualification: the source is a draft (it has visible
misprints: the extracted display shows the partial sums without modulus bars, and one summation limit reads n - 1 for N - 1), and
the Ten Lectures themselves were not opened. Sentence to use in Corollary T' and row Q31: "relative to Turan's second main theorem
in the form of Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3 (factor 2 and constant 8e as printed there,
proof read by a referee; Montgomery's Ten Lectures, chapter 5, not opened)". This resolves the item "the factor 2 unresolved" of
`c18-referee-r17-independent-sources`: two of the three secondary sources there printed no factor 2; the theorem has it.

## B. W5c

Statement refereed. Pairs x_j +- ib with equal offset b > 0 and abs(x_j - x_k) >= D for j != k. For h in C_c^infinity(I), I an interval
of length u, g(z) = integral of h(s) e^(-isz) ds, f(z) = g(z) conj(g(conj z)). Then (i) -[f(z_j) + f(conj z_j)] <= 2 abs(G(x_j))^2 with
G the transform of h(s) sinh(bs); (ii) sum_j abs(G(x_j))^2 <= C(u, D) integral abs(G)^2, C(u, D) <= (2 e^2/pi) max(2/D, u/2);
(iii) integral abs(G)^2 <= 2 pi sinh^2(ub/2) norm(h)^2; (iv) so the family passes the complete band-u device with tolerance M
against any on-line set when 4 pi C(u, D) sinh^2(ub/2) <= 2M.

Re-derivation.
- (i) f(z_j) + f(conj z_j) = 2 Re(A conj B) with A = g(z_j), B = g(conj z_j), and -2 Re(A conj B) <= (1/2) abs(A - B)^2 is the
  same as abs(A + B)^2 >= 0. g(x + ib) - g(x - ib) = 2 integral h(s) sinh(bs) e^(-isx) ds = 2 G(x). Holds.
- (ii) G is entire, and abs(G)^2 is subharmonic, so abs(G(x_j))^2 <= (1/(pi rho^2)) times the integral of abs(G)^2 over the disc of
  radius rho about x_j. The discs are disjoint for rho <= D/2. For h supported in abs s <= u/2, integral of abs(G(x + iy))^2 dx <=
  e^(u abs y) integral abs(G(x))^2 dx (Plancherel). So the sum is at most (2 e^(u rho)/(pi rho)) integral abs(G)^2, and
  rho = min(D/2, 2/u) gives e^(u rho) <= e^2 and 1/rho = max(2/D, u/2). Holds, with a complete proof: Plancherel-Polya is not needed
  as an outside source.
- (iii) Plancherel and abs(sinh(bs)) <= sinh(ub/2) on abs s <= u/2. Holds.
- (iv) The on-line zeros contribute abs(g(x))^2 >= 0, and <h, T_Z h> is the sum of f over the zeros, so
  <h, (T_Z + 2M) h> >= (2M - 4 pi C sinh^2(ub/2)) norm(h)^2. Holds.

Conditions to state (none changes the result).
1. (ii) and (iii) need the interval centred, I = [-u/2, u/2]. This is no loss: a translation of h by c multiplies g(z) by
   e^(-icz) and leaves f(z) = g(z) conj(g(conj z)) unchanged. On I = [0, u] without this remark the bound in (iii) would be sinh^2(ub).
2. The separation must hold among all abscissae that carry a pair, mirror images -x_j included if the configuration has them;
   a pair of multiplicity k counts k times and is not covered by D > 0.
3. The closing sentence "for b <= c sqrt(M) u^(-3/2) with c depending on uD only" needs ub bounded. With sinh^2(x) <= 1.0862 x^2 for
   x <= 1/2: for ub <= 1 the family passes when b <= 0.499 sqrt(M) u^(-3/2) / sqrt(max(1, 4/(uD))); the condition ub <= 1 holds when
   M <= 4u.
4. Scope as stated there: one band, equal offsets; the height-coupled band and unequal offsets are not covered.

Numeric test (`local/misc_checks.py`, float64): rows of spacing D with (u, D, b) = (8, 0.5, 0.05), (8, 0.2, 0.1), (12, 1, 0.03),
(6, 0.1, 0.3), (10, 2, 0.2), 40 test vectors each (half weighted by sinh(bs)): inequality (i) holds in every case; the sum over the row of -[f(z_j) + f(conj z_j)] is not positive in four of the five
parameter sets and is at most 0.0043 of the bound 4 pi C sinh^2(ub/2) norm(h)^2 in the fifth (D = 2, u = 10). The bound is far from sharp.

**Verdict on W5c: holds with corrections** (conditions 1 to 3 as wording). Label: PROVED (the Plancherel-Polya step is proved
inline). Referees on W5c: 1.
Sentence to use: "(W5c) Pairs x_j +- ib with equal offset b and abscissae separated by at least D (all abscissae carrying a pair,
with multiplicity one). For every h in L^2 of an interval of length u (centred without loss, f being translation invariant),
sum_j -[f(z_j) + f(conj z_j)] <= 4 pi C(u, D) sinh^2(ub/2) norm(h)^2 with C(u, D) = (2 e^2/pi) max(2/D, u/2); hence the family
passes the complete band-u device with tolerance M against any on-line set when 4 pi C(u, D) sinh^2(ub/2) <= 2M, in particular for
ub <= 1 and b <= 0.499 sqrt(M) u^(-3/2)/sqrt(max(1, 4/(uD))). One band, equal offsets."
