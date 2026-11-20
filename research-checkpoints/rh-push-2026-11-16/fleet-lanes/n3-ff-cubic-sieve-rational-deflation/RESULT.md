# n3-ff-cubic-sieve-rational-deflation: the cubic large sieve over F_q[T] with the Gauss-sum family removed

Internal working note, 2026-11-17. Slug `n3-ff-cubic-sieve-rational-deflation`. Not refereed. Nothing committed, pushed or posted.
No ssh. Every run went through `scripts/memcap.sh 8`, single process; longest run 203 s. One run (direct m = n = 5) was
killed by the cap (9 GB, in an optional check); the check was dropped for that size and the run repeated at 57 s. The cap was not raised.

Scope: an operator-norm (mean-value) statement inside the zero-free machinery (low side of the 7/8 architecture). No
statement about zeros. RH open. NO QED.

Labels: PROVED (derivation in this note) / CLASSICAL (cited, not re-read for this note) / MEASURED / ARGUED / MODEL / OPEN.

**Verdict: precise obstruction; the kill criterion is met.** Over F_7[T] the excess of the cubic large sieve over the flat
level is an explicit finite sum of rank-one terms on twisted Gauss-sum vectors g~(r, .) with deg r <= 2m - 1 - n
(m = modulus degree, n = argument degree). Removing all of them gives the flat constant, exactly 1 for prime moduli.
Removing those of conductor degree <= k < 2m - 2 - n leaves a norm that follows the same law as the undeflated one with
k0 = 2m - 2 - n replaced by k0 - k - 1: the gain is conductor^(-1/3) and nothing more. The exact identity is the
functional equation of L(u, chi); it is self-dual (flat sieve for a vector <=> flat Gauss-twisted dual sieve for the same
vector), so it prices the deflated sieve and supplies no bound for particular coefficients. No abscissa moves.

---

## 1. Plan

Read: BRIEF (all notices), OBSTRUCTION_MAP rows T1, Z5, Z7, Z12, Z15 and section 6 items 2-4, n2-cubic-sieve-spike-deflation,
r2-ff-tro6-complete (its `ff.py` is imported read-only for resultants).

New relative to n2: n2 measured over Q that the spikes of the cubic-symbol matrix are an unbounded family (Gauss vectors
twisted by cubic characters of small conductor) and read Dunn-Radziwill (1.13) in that sense. This note works in F_q[T],
where L(u, chi) is a polynomial and the Kubota series is rational, and asks for exact statements: (i) the degree bound
for the Kubota series; (ii) the exact form of the sieve with the family removed and the level at which it is flat;
(iii) the true constant when only conductors of degree <= k are removed.

Objects (q = 7; monic polynomials; chi_c(x) = chi0(Res(c, x)), chi0 the cubic character of F_7; e(y/c) = exp(2 pi i t/7),
t the coefficient of T^(deg c - 1) in y mod c):
- g(r, c) = sum_{x mod c} chi_c(x) e(r x / c), g~ = g / q^(deg c / 2); psi(r, u) = sum_{c monic} g(r, c) u^(deg c);
  S_n(r) = sum_{deg c = n} g(r, c).
- C[c, d] = chi_c(d), rows c squarefree (or prime) monic of degree m, columns d all monic of degree n; G = C C^*.
  phi = trace(G)/rows (mean eigenvalue; about q^n (1 - 1/q)(1 + ...)).
- k0 = 2m - 2 - n.

Decision rule fixed before the runs (assignment): if below level the deflated norm ratio grows at the same rate as the
undeflated one, the idea is dead.

---

## 2. First test, part 1: the degree bound for the Kubota series [MEASURED; statement CLASSICAL]

`kubota.py`, `kubota_report.py`. All monic c with deg c <= 6 (117649 of degree 6, handled through the 16807 shift
representatives with T^5-coefficient 0 and the substitution T -> T + a), all 2801 monic r with deg r <= 4. Gauss sums from
the definition: symbol table over all residues, then a deg c-dimensional DFT (agreement with `ff.py` for deg c <= 3 and a
sample at degree 4: exact). Planned allocations printed (1.9 MB per modulus in memory; stored Gauss sums about 0.4 GB on disk).

Result. With p_n(r) = S_n(r) - q^4 S_{n-3}(r):

    max |p_n| / q^(3n/2) by deg r      n=2        n=3        n=4        n=5        n=6
    deg r = 0                          0          5.4e-2     5.4e-2     0          2.6e-17
    deg r = 1                          3.8e-1     5.4e-2     5.6e-9     2.0e-2     2.6e-17
    deg r = 2                          3.8e-1     4.3e-1     2.0e-2     2.0e-2     2.0e-2
    deg r = 3                          7.8e-9     5.7e-1     8.1e-2     2.8e-9     2.8e-2
    deg r = 4                          3.2e-1     5.7e-1     3.4e-1     3.1e-2     2.8e-2

So (1 - q^4 u^3) psi(r, u) is not of degree <= deg r + 1: for r = 1 it has degree 4. The correct statement, verified for
every r and every n <= 6 (float64, deviations <= 1.7e-8 q^(3n/2)):

    (1 - q^4 u^3) psi(r, u) = (1 - q^3 u^3) P_r(u),   deg P_r <= deg r + 1.

Coefficients a_n of P_r vanish for n > deg r + 1 in all 5 x 2801 cases reachable (n <= 6). For r = 1:
psi(1, u) = (1 + q G_1 u)(1 - q^3 u^3)/(1 - q^4 u^3), G_1 the Gauss sum of chi0. Equivalent residue form, checked to 6e-8:
for n > deg r + 1, S_n(r) = (1 - 1/q) sum_{j >= 1} q^(4j) a_{n-3j}(r). The assignment's statement holds in this form
(the theta term is exact for n > deg r + 1); the recursion S_n = q^4 S_{n-3} needs n > deg r + 4. The factor
(1 - q^3 u^3) is the zeta normalisation of the Kubota series; Hoffstein and Patterson are cited from memory.

---

## 3. The exact sieve identity [PROVED from the functional equation; MEASURED to 1e-8]

**Lemma A.** Let c != c' be coprime squarefree monic of degree m, chi = chi_c conj(chi_c'). Then for 0 <= n <= 2m - 1

    sum_{deg d = n} chi_c(d) conj chi_c'(d)
      = q^(n-m) [ (q-1) sum_{deg r <= 2m-2-n} g~(r,c) conj g~(r,c')  -  sum_{deg r = 2m-1-n} g~(r,c) conj g~(r,c') ],

and the left side is 0 for n >= 2m. (Sums over monic r; g~(r, c) = g~(1, c) conj chi_c(r).)

Proof. chi is primitive of conductor cc' (degree 2m) and trivial on F_q^*, so L(u, chi) = (1 - u) L*(u), deg L* = 2m - 2.
With b_j = sum_{deg d <= j} chi(d): b_j = eps q^(j - m + 1) conj b_{2m-2-j}, and splitting the Gauss sum tau(chi) by
leading coefficient gives tau(chi) = q b_{2m-2}, so eps = tau(chi) q^(-m). By cubic reciprocity (q = 1 mod 6, monic
arguments: chi_c(c') = chi_c'(c)), tau(chi) = g(1, c) conj g(1, c'). The coefficient is a_n = b_n - b_{n-1}; insert
eps conj b_i = sum_{deg r <= i} g~(r, c) conj g~(r, c'). CLASSICAL ingredients only (polynomial L-function and its
functional equation; the Weil bound is not used).

**Lemma B (exact weighted large sieve, prime moduli).** For alpha supported on monic primes pi of degree m and
k0 = 2m - 2 - n with -1 <= k0 <= m - 2:

    sum_{deg d = n} | sum_pi alpha_pi chi_pi(d) |^2
      = q^n |alpha|^2 + q^(n-m) [ (q-1) sum_{deg r <= k0} |<alpha, g~(r,.)>|^2 - sum_{deg r = k0+1} |<alpha, g~(r,.)>|^2 ].

(The diagonal is q^n - q^(n-m) on the left and -q^(n-m) in the bracket.) Hence if alpha is orthogonal to g~(r, .) for all
monic r of degree <= k0, the left side is <= q^n |alpha|^2: the flat bound with constant exactly 1. For n >= 2m - 1
(k0 <= -1) the bound holds for all alpha.

Check (`exact_check.py`; rows = primes of degree m; all 7^n columns):

    (m,n)   k0   max |G - F| off-diagonal   diag(G - F)        lam_max / q^n: undeflated -> deg r <= k0 removed [rank]
    (3,3)   1    1.9e-6                     343.00 = q^n       2.9523 -> 1.000000 [8]
    (3,4)   0    3.1e-6                     2401.00            2.9585 -> 1.000000 [1]
    (4,5)   1    2.9e-5                     16807.00           2.4672 -> 1.000000 [8]
    (4,4)   2    1.5e-5                     2401.00            2.8309 -> 1.000000 [57]
    (4,3)   3    5.8e-6                     343.00             12.393 -> 0 [330; rank G <= 343]

**Squarefree moduli.** For pairs with gcd(c, c') = g != 1 the character is imprimitive and the same computation gives
further rank-one terms on the vectors 1[g | c] g~(d' e^2, c/g), e | g, deg d' <= k0 - 2 deg g + deg e [ARGUED: the
family is derived, the coefficients and signs were not written out]. MEASURED: (4,4), squarefree rows: undeflated
6.5365 phi; main family (57 vectors) removed: 4.9998 phi; main plus 105 divisor-family vectors: 1.1461 phi, the flat
level (max_c #{d coprime to c} = 1.1457 phi). At k0 <= 1 the main family alone is enough: (3,3) 6.39 -> 1.1433 phi [8],
(3,4) 6.32 -> 1.1433 [1], (4,5) 6.31 -> 1.1461 [8], (4,6) 6.31 -> 1.1461 [1]; (2,4), (3,5) (k0 < 0): 1.143 phi with
nothing removed.

**Corrected form of FF-WLS.** The level condition is on k against k0, not n against k: the sieve with the vectors of
conductor degree <= k removed is flat if and only if k >= k0 = 2m - 2 - n, i.e. conductor up to K^2/(q^2 D) in the
notation K = q^m (moduli), D = q^n (arguments). The number of vectors removed is (q^(k0+1) - 1)/(q - 1), about K^2/(qD):
the family grows; this is the count (KD)^2/(K + D)^3 measured in n2.

Lemma B is self-dual: its right side is the same sieve with the roles exchanged (rows r of degree <= k0, Gauss
weights). It is Heath-Brown's recursion with no loss. It states the hypothesis under which the sieve is flat; it gives
no reason for a particular alpha to satisfy it.

---

## 4. The true constant when only conductors <= k are removed [ARGUED structure; MEASURED]

Positive part of the excess: (q-1) q^(n-m) W W^*, W[c, r] = g~(r, c), deg r <= k0. Its non-zero spectrum is that of
(q-1) q^(n-m) K, K[r, r'] = sum_c chi_c(r') conj chi_c(r) (`dual.py`; size <= 2801, rows up to m = 7, 705894 squarefree
moduli). Removing deg r <= k on the row side is the Schur complement of K. Define
E(m, k0; k) = (excess top eigenvalue)/q^n = (q-1) lam_max(Schur_k K)/q^m.

Structure: chi_c(r' r^2) is trivial when r/r' is a cube, so K is close to block-diagonal over cube classes
{r0 e^3}; the other entries are character sums over c of conductor degree <= 2 k0, which vanish for complete sums when
m >= 2 k0 (squarefree or prime restriction leaves lower-order terms). The class of r0 = 1 with members 1, (T - a)^3 has
Gram matrix N [[1, b], [b, b^2 J + (b - b^2) I]], b = q/(q+1), top eigenvalue 6.4518 N, predicted
E = (q-1)(1 - 1/q) 6.4518 = 33.181.

    E(m, k0; k)      k = -1 (none)   k = 0     k = 1     k = 2     k = 3
    m=7  k0=1        5.1429          4.5000
    m=7  k0=2        5.1429          5.0433    5.0433
    m=7  k0=3        33.1809         5.1666    5.1666    5.1664
    m=7  k0=4        33.1811         30.0174   5.3319    5.3319    5.3244
    m=6  k0=3        33.1796         5.2361    5.2361    5.2354
    m=6  k0=4        33.1832         33.0780   33.0777   33.0768   5.4382
    m=5  k0=3        33.1903         5.4129    5.4129    5.4129
    m=5  k0=4        33.8645         33.8645   33.8590   30.9313   6.0000
    m=4  k0=3        33.5625         33.5367   33.5367   6.0000
    (spectrum m=7, k0=4: 33.18, 30.02 x7, then 5.33, 5.28, ...; 2751 eigenvalues above 0.5)

Reading (m = 7, the range m >= 2 k0 - 1):
- Every vector of the family is a spike of size about (q-1)(1 - 1/q) = 5.14 q^n; a cube class with M members has
  size about 5.14 M q^n. Undeflated top: the class of 1, M = #{e : 3 deg e <= k0}. This is the (KD)^(2/3) law as a
  staircase q^floor(k0/3).
- Removing conductor degree <= k removes the classes of degree <= k and leaves the classes of degree k + 1 with
  #{e : 3 deg e <= k0 - k - 1} members: 33.18 -> 30.02 (k = 0, classes of linear r0) -> 5.33 (k = 1) at k0 = 4.
  The deflated top is E(k0 - k - 1), the undeflated law shifted by k + 1: norm about D + (KD)^(2/3) R^(-1/3) for
  removed conductor R = q^(k+1) <= K^2/D. The strength law N(r)^(-1/3) of n2 is exact here.
- Even at multiplicity one the remaining spikes are a factor q - 1 above flat until k = k0.
- Outside that range (m < 2 k0 - 1: rows m = 4, 5, 6 with k0 = 3, 4) there are further large eigenvalues which are
  not removed until k is within one or two of k0 (m = 6, k0 = 4: 33.08 until k = 3). These are the next level of the
  recursion: the vectors c -> chi_c(s), from columns d = s e^3 (n = 6: the 49 cubes), contained in the span of the
  family but not in its low-conductor part. MEASURED, not analysed further.

Direct runs (`sieve.py`, squarefree rows, all columns; lam_top/phi after removing g~(r, .), deg r <= k):

    (m,n)  k0   none      k=0       k=1       k=2       k=3
    (3,3)  1    6.3934    5.9557    1.1433
    (4,5)  1    6.3148    5.7599    1.1461
    (4,4)  2    6.5365    6.5365    6.5360    4.9998 (1.1461 with divisor families)
    (5,5)  3    38.7563   6.7214    6.7213    6.7155    5.0417 (divisor families not removed)
    (4,3)  3    39.6885   37.8013   37.8013   9.9877    5.7643
    lam_max/trace, undeflated: (3,3) 2.2e-2; (4,4) 3.2e-3; (4,5) 3.1e-3; (4,6) 3.1e-3; (5,5) 2.7e-3.

The conjugate families (conj g~ with either twist) and g~ with the opposite twist do not remove the spikes
(e.g. (4,5): 6.31 unchanged at k <= 1). Squarefree columns only (`sieve.py m n sf`, the Heath-Brown form without
complete sums): same picture, (4,6) 6.36 -> 1.19 [1], (4,5) 6.56 -> 5.31 -> 1.316 [8], (3,4) 6.50 -> 1.31 [1],
(4,4) 7.31 -> 7.31 -> 7.31 -> 5.02; the bulk edge is no longer exactly degenerate.

**Kill criterion.** Met. For fixed k the deflated ratio grows with k0 = 2m - 2 - n at the same rate as the undeflated
one (same staircase, shifted). Bounded-rank and bounded-conductor deflation are dead over F_q[T] as an exact statement,
which confirms n2. Reach of the measurement: k0 <= 4, one step of the staircase; the general law rests on the
cube-class structure above.

---

## 5. The Kubota side [MEASURED]

The assignment's mechanism acts on the argument side: v[d] = conj g(1, d), and (C v)[c] = conj sum_{(d,c)=1} g(c, d).

- `kubota_link.py`: C v against conj S_n(c): correlation 0.9935 and relative difference 0.173 at (4,6) (n > m + 1,
  theta term exact for S_n); 0.9930 / 0.174 at (4,5); 0.9913 / 0.195 at (3,4). The difference is the non-coprime d.
  At (3,5) and (2,6) both vanish (S_n(c) = 0 there and G is flat).
- C v is the top left singular vector (overlap 0.9999 at (4,6), 0.998 at (5,5)), and the top left vector is g~(1, .)
  (overlap 0.993). But v is not the right singular vector: overlap 0.86 to 0.89 for all columns, 0.92 to 0.93 for
  squarefree columns, 0.943 at (5,5). Removing v on the column side leaves lam_1 sin^2(theta): (4,6): 1.652 phi against
  flat 1.146 phi (6.31 x (1 - 0.8595^2) = 1.65); (3,4): 1.59 phi; (4,5) with deg r <= 1: 1.62 phi. For squarefree
  columns the remainder is below the bulk edge at these sizes ((4,6): 1.191 phi).
- So exactness of the theta term gives the Rayleigh quotient of the Gauss vector exactly (4.66 phi at (4,6) against
  lam_1 = 6.31 phi), not the singular vector. The exact removal is on the modulus side (Lemma B), where the
  functional equation of L(u, chi) does the work and Kubota's series enters only through the cube classes.
  Whether the column-side overlap tends to 1 with the size is OPEN (three sizes, no trend).

---

## 6. Model abscissa and the statement over Q

- Pricing [MODEL, imported]: n2 section 4.4 used a third entry 2(1 + Y)/3 - rho/3 for removed conductor U^rho, giving
  the critical-class exponent 1 - delta(1 + rho)/2 (0.765328 at rho = 0; 0.590332 needs rho >= 0.7457; 0.530655 at
  rho = 1). Section 4 confirms the entry as the exact law D + (KD)^(2/3) R^(-1/3) in F_q[T]. n1's LP: marked-row norm
  flat (K-loss removed) gives 13/15 -> 31/36 = 0.8611, a threshold effect. Both need the hypothesis of Lemma B for the
  manuscript's rows: sum_{N(r) <= K^2/D} |<alpha, g~(r, .)>|^2 << |alpha|^2 K / q. That is a mean-square bound for
  correlations of the row coefficients with twisted cubic Gauss sums over conductors up to a power of the family
  size: the Type II Gauss-sum problem of Z5/Z6 and n1's (L*). OPEN. Limit of the line: 31/36, not 1/2, and above 5/6.
- No abscissa moves. Model low side 13/15; 7/8 (unrefereed) stands.
- Over Q: (i) the spike family of n2 is exactly {g~(r, .) : N(r) <= K^2/D} with strengths from cube multiples; the
  reading of Dunn-Radziwill (1.13) in n2 section 2.1 agrees with the exact model. (ii) Rationality removes error terms
  (constant exactly 1, exact level k0), not the family. A deflated cubic large sieve over Q with a power saving
  is therefore equivalent to its own hypothesis in dual form; for arbitrary coefficients it is false, and for
  special coefficients it is the Type II problem. (iii) The row-side family is g~(r, c) on the moduli; the argument-side
  Gauss vector is only an approximate singular vector, which matches the overlaps 0.90 to 0.97 measured in n2.

---

## 7. Controls

The statement is an operator-norm identity for arbitrary coefficient vectors (Euler-blind; MV-CAP applies; admissible
only on the low side of the 7/8 architecture). No zero statement is made, so none of the three controls is engaged, and
none was run numerically. Where each would enter:
- Davenport-Heilbronn: at the detector (the 1/L step), not here. Lemma B holds for every alpha.
- Sign twist: a unimodular twist on the argument side leaves G = C C^* unchanged; a twist on the modulus side changes
  the correlations <alpha, g~(r, .)> and the twisted Gauss sums have no Kubota functional equation, so section 2 fails
  for them. Not tested.
- E_a: at the normalisation of the detector. Not tested.
- Internal controls: reciprocity table check (0 mismatches); symmetry of the identity under the direct/dual
  computations (direct (5,5): 38.76 phi; dual: 33.19 q^n + flat = about 39.2 phi); random-vector baseline is the
  exactly degenerate flat level 1.143 to 1.146 phi.

## 8. Three weakest steps

1. **Range.** q = 7 only; k0 <= 4, so one step of the cube-class staircase (multiplicity 1 -> 8) is observed. The law
   q^floor((k0-k-1)/3) for larger k0 is derived from the block structure of K, whose off-diagonal vanishing is argued
   (complete sums; the squarefree and prime restrictions were not bounded) and supported by 33.1809 against 33.181.
   The second-level eigenvalues at m < 2 k0 - 1 are measured, not explained in detail.
2. **Sources and arithmetic.** Lemma A is derived in this note and checked numerically to 1e-8 relative in float64,
   not in exact arithmetic and not against a reference. The Hoffstein-Patterson statement is cited from memory and
   needed the factor (1 - q^3 u^3). The divisor families for squarefree moduli are verified at one non-trivial size
   ((4,4)); their coefficients were not derived. Direct (5,6) and (6,6) were not run (memory/time).
3. **Transfer.** The manuscript's rows are sextic, weighted, cube-completed and carry the quadratic twist; none of
   that is modelled. The abscissa numbers are imported from n1 and n2. The column-side overlap (section 5) has no
   size trend. The equivalence "deflated sieve over Q <=> Type II Gauss-sum bound" is an analogy from the exact
   model, with smooth weights and (KD)^eps losses not worked out.

## 9. Verdict

Precise obstruction. PROVED here: Lemma A and Lemma B (exact cubic large sieve over F_q[T] for prime moduli with the
Gauss-sum family of conductor degree <= 2m - 2 - n removed; flat constant 1). MEASURED: the Kubota degree bound in the
corrected form (1 - q^4 u^3) psi = (1 - q^3 u^3) P_r, deg P_r <= deg r + 1, for q = 7, deg r <= 4, deg c <= 6; the
deflated constants of section 4. The stated lemma FF-WLS (flat whenever n > k + 1) is false as indexed; the true level
is k >= 2m - 2 - n, the removed rank is about K^2/(qD), and below it the deflated norm follows the undeflated law with
gain conductor^(-1/3). The idea is dead by its own kill criterion. No pivot was taken: the adjacent idea (use Lemma B
for the marked rows) is n1's (L*), already listed as OPEN. Nothing about zeros. 7/8 (unrefereed) stands. RH open.

Files: `common.py`, `kubota.py`, `kubota_report.py`, `kubota_report.txt`, `kubota_link.py`, `kubota_link.log`,
`sieve.py`, `sieve_*.log`, `sieve_*.json`, `dual.py`, `dual_*.log`, `dual_*.json`, `exact_check.py`, `exact_*.log`,
`S.npy`, `R.npy`, `G_deg1..4.npy`, `g1_deg6_reps.npy`, `reps6.npy` (`G_deg5.npy`, 376 MB, deleted; `kubota.py` regenerates it; `sieve.py` with m or n = 5 needs it).
