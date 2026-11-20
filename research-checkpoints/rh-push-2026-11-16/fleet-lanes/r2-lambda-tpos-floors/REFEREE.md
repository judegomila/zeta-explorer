# REFEREE: r2-lambda-tpos-floors/RESULT.md

Date 2026-11-16. Adversarial check of every step labelled PROVED. Own scripts (kept outside the repo, /tmp/ref-r2tpos),
python-flint / mpmath / sympy / numpy. No motherbox access from this session; all reruns local.

Verdict: **holds = true** for the PROVED statements, with the label corrections of section 2. No mathematical error
found. Nothing here gives zero information or moves a Lambda bound; every Lambda number in the result is heuristic and
is labelled so.

## 1. Confirmed

**Theorem C (boundary criterion). CONFIRMED by re-derivation and a new numerical case.**
Transforms: K_h(.,b)^ = 2pi e^{-h|xi|} cosh(b xi); (4y/(d^2+4y^2))^ = 2pi e^{-2y|xi|};
1 + r_w^/2pi = cosh(y xi)[2e^{-y|xi|} - w^]; D^ = (2pi cosh(b xi)/cosh(y xi))(1 + r_w^/2pi). Correct. Both directions of
the equivalence are correct (P_b > 0; b -> y limit, r_w continuous at 0). New test: y = 0.41, five random signed
points, five (d,b): |D - P_b - P_b*r_w/2pi| <= 9e-8 (quadrature error; three of five points at 1e-31).
C1: own-pair identity sum w_i K_{h_i}(-x_i,y) = 1/y - r_w(0) correct; the split of sum_j D into 2 sum' K_y and
sum w_i S_i is legitimate (each pair kernel is O(1/d^2)). C2: integral gives 2pi(1 - sum w_i) >= 0; d^2 r_w ->
4y - 2 sum w_i h_i. Correct.

**C3.** w*^ = e^{-2y|xi|}/cosh(y xi), so r_{w*} = 0: correct. Ladder identity checked at three (d,b) to 30 digits.
Value at y = 3/4: L - sum Lambda(n) n^{-13/8}/(1+n^{-3/4}) = 5.8402 - (tail <= 8e-4) = 5.839. Reproduced.

**C5 (class ceiling). CONFIRMED as a conditional statement.** Lattice sum: sum_j 4y/(j^2a^2+4y^2) = L_c coth(yL_c)
(checked by direct summation: 6.72347 vs 6.72350 with 4e5 terms). Lattice minimum of S: (L_c/2)[tanh(L_c(h-y)/2) +
tanh(L_c(h+y)/2)] (checked by direct summation at h = 1.5443, y = 3/4: 6.6905 vs 6.6909). E-ceiling 5.390 / 2.045,
c = 14.37 at y = 3/4, time log cosh(y0 L)/L^2 = 0.096223. All reproduced. The pair density L/2pi is the right
normalisation (lattice mean of S equals L).

**Lemma A1. CONFIRMED.** 1 - cos 2pi u >= 8||u||^2; weighted-l^2 triangle step gives E_eta = 2 eta^2 sum a_i alpha_i^2;
kappa^2 j^2 <= B/k for j eta <= G1, so the ball radius^2 B(1+1/k) contains every j with Q(j eta) <= B; second-order
Taylor bound with C2 = sum a_i log^2 p_i. The range split at eX (gain 1/4 in L) is correct. The code (`align2.py`,
`enum2.c`) implements this: centre and radius recursion are the standard Fincke-Pohst ones, j is recovered exactly,
phases are 128-bit, the |j| fold is valid for half-cycle shifts.

**Theorem A numbers. CONFIRMED to the extent a floating enumeration can be.**
- All eight reported minimisers (`a30_*`, `a34_*`) and both joint ones (`j30`, `j34`) re-evaluated in 50-60 digit
  mpmath: f, the Taylor bound and min Q agree with the JSON to all printed digits; all lie in range; in every row
  far_bound > listed minimum. Floors 5.089333 / 5.242526 / 5.401999 / 5.622403 and 4 l/h = 13.579 reproduced.
  Constants -zeta'/zeta(sigma), trivial floors, 13.341 reproduced.
- Completeness tested on two NEW cases against a brute-force scan (step 0.01-0.02):
  (i) h = 1.5443, k = 12, gamma in [X/2 - 4, X/2 + 4.5e6]: brute 0.0524527 at 3000002356727.94; enumerator
  min f = 0.0524218 at 3000002356727.93 (B = 0.06, 8.8e8 points).
  (ii) h = 1.7, k = 24, gamma in [1e6, 4e6]: brute 0.271900 at 3898527.96; enumerator 0.271843 at 3898527.9609.
  Same minimiser both times; the enumerator value is lower by the grid offset, as it must be.
- Full rerun, h = 1.6, k = 30: nodes 396275473, Delta = 0.148538100337, identical to `a30_1.6.json`.
- Not done: independent k = 34 enumeration with a second implementation (a same-code rerun at h = 1.5443 was not completed;
  see section 5). A random short-vector hunt for a point below 0.18389 (own lattice, eta = 1/64, 1.7e5 in-range points)
  found nothing below 0.315; this is a weak test.
- Monotonicity check: Delta_34 >= Delta_30 in all four rows, as Def_34 >= Def_30 pointwise requires.

**Section 5 (t = 0 certificate). CONFIRMED independently (sympy, not flint).** Numerator degree 24, leading
coefficient > 0, value at 0 > 0, squarefree, 0 real roots (sympy exact root count); denominator has no real root.
sum omega_i h_i = 1.994168 <= 2, W = 0.924420, r_w(0) = 0.374985. E = 4.516197 (own 40-digit sum over n <= 3000,
zeta'/zeta tails). With Delta_w/2 = 0.010232: E = 4.526429, 2E/y = 12.0705. Without the alignment term the rate is
12.0432; that part does not depend on the enumeration.

## 2. Label corrections (no error in the mathematics)

1. **"PROVED (c.a.)" for Theorem A and for the last 0.027 of the rate 12.07.** The enumeration is double precision
   with slack, single implementation. The honest label is "computer-assisted, floating point, not interval-certified";
   the text says this in section 8 but the verdict lines say PROVED. The fully exact part of the t = 0 statement is
   rate >= 12.043 (Sturm exact; value in 40-digit non-interval arithmetic, margin far above rounding).
2. **Class ceiling, summary wording.** "Floor-only certificates give -y' <= L coth(yL)" omits the hypothesis: the
   floor functional must also hold on the same-height lattice. For the floors in the result this is true and I checked
   it (lattice S >= 6.56 for h - y >= 0.6; signed measures: lattice S is constant to 2L e^{-L(h-y)}, so any bound
   of the form W L - penalty with penalty above that ripple holds). It is a statement about an information class,
   as section 8 item 3 says; the verdict line and "No route below 0.096 exists inside this class" should carry the
   hypothesis each time.
3. **C3 certificate value 5.839.** Theorem C and C1 are stated for finite measures. w* is an infinite Abel-summed
   measure with non-decaying alternating terms (S(x,h) -> growth like (1/4) log(x^2+h^2) in h). The kernel identity is
   fine; the certificate needs a written Abel-summation step (or a finite truncation with a checked r_w >= 0).
   Minor; the number is not used downstream.
4. **Scope of item 4.** The 12.07 is a statement at the single point t = 0, y^2 = 0.5625001. F2's 11.008 is a
   rate valid on a cell. The comparison is fair only as a point comparison; the result says "t = 0 only", keep it.
5. **Controls.** The brief asks for three controls. DH is done and correct. The sign twist is not run: Theorem A and
   section 5 survive Lambda(n) -> eps_n Lambda(n) with eps_n = +-1 (the triangle bound uses |Lambda|, the alignment
   lemma only shifts target phases, same lattice). That is consistent with a result that claims no zero information,
   but it should be stated. Backward heat: not applicable to a t = 0 statement on sigma > 1.

## 3. Remarks that sharpen or limit the result

- **The ceiling 0.0962 is not sharp for the floors in hand.** C5 holds for any lattice density on which the floors
  hold, not only L_c = L. With the proved t = 0 floors (5.0893, 5.2425, 5.4020, 5.6224 at h = 1.5-1.7 and 6.0012 at
  1.88) the sparsest admissible lattice has L_c = 6.008: ceiling c = 12.47 at y = 3/4 (the certified 12.07 is within
  3.2% of it). For any chain whose floors stay <= 6.12 (the F2 sample maximum) L_c is about 6.12-6.2 and the time
  ceiling is 0.103-0.104, not 0.096. The heuristic estimates 0.1085-0.1125 are consistent with this but the remaining
  room inside the class is about 0.005-0.008, not 0.012-0.016. Reaching 0.096 needs floors approaching L at large h
  as well. This should replace "F2 is within 31%-57% of the class ceiling" as the operative comparison.
- **The lattice is an exact solution.** Z_a is invariant under the flow (every zero has the same vertical velocity),
  so C5 does not depend on the single-zero barrier: no multi-zero barrier fed with the same floors can beat it. This
  closes proposal 3 of the predecessor's referee for this information class. It strengthens C5.
- **Way around the ceiling (not an artifact, but not absolute).** Any input that fails on the lattice: (a) a floor at
  small h - y above (L/2)[1 + tanh(L(h-y)/2)] (needs h - y below about 0.3, i.e. inside the strip at t = 0: not
  available); (b) two-sided or variation information on S (the lattice has S constant in x to 1e-2 at h - y >= 0.8;
  an inequality using the measured fluctuation of S, e.g. a lower bound on S at one height in terms of an upper bound
  at another along the same x, is outside the class); (c) larger X (L grows by 1/4 per factor e). None is shown to work.
- **Depth obstruction for Theorem A.** Real, as far as the method goes: the count is governed by the volume of the
  35-dimensional ellipsoid and I see no cheaper complete method. One untried device: enumerate only on [X, X^{1+delta}]
  pieces with the far range paid by L(x) growth at a finer split than e (the gain 1/4 at eX is far above the needed
  Delta/2 = 0.09, so the near range can be cut to [X, e^{0.37} X], reducing the node count by about 2.7x per run, or
  allowing roughly one more prime). Small.
- **t > 0.** (M1)-(M3) are correctly listed as open; the model exceeds certified F2 floors by 0.02-0.34 at the same
  configuration, the same size as the measured gain. The "conservative" row is the only defensible heuristic.

## 4. RH, verified height, DH

- RH is not assumed. Theorem A is an unconditional statement on sigma > 1. Section 5 is a conditional statement about
  a hypothetical simple top zero. Verified height enters only through x* >= X. Nothing restates verified height as new.
- DH: the floors need -zeta'/zeta = sum Lambda(n) n^{-s} with Lambda >= 0 (Euler product); for DH the logarithmic
  derivative has poles in sigma > 1 and there is no floor. Theorem C, C1-C5 are kernel statements, valid for any
  function, and claim nothing about zeros. Correct.

## 5. Status of the k = 34 rerun

A same-code rerun of h = 1.5443, k = 34 was started locally and stopped after 20 minutes wall (machine load about 90,
about 4.6 of an estimated 14 CPU-minutes done). The k = 34 constants are therefore verified at their minimisers and
by the validation of the enumerator on other cases, not by a rerun.

## 6. Surviving claim

Conditional on the unrefereed half-plane and Raymond's chain for anything about Lambda; the statements below are
themselves unconditional or about a hypothetical top zero.
(C) Signed-kernel domination on 0 <= b <= y is equivalent to r_w >= 0 on the line b = y; certificate
-y' >= sum w_i S_i + r_w(0); necessary sum w <= 1, sum w h <= 2y. PROVED.
(C5) Any certificate whose floors also hold on a same-height lattice of pair density L_c/2pi has -y' <= L_c coth(yL_c);
with L_c = L, time >= 0.0962; with the floors actually in hand (<= 6.12) about 0.103-0.104. PROVED as a class statement.
(A) Range-split floor S >= L + zeta'/zeta/2 + Delta/2 with Delta = 0.199 / 0.184 / 0.166 / 0.139: Lemma PROVED;
constants computer-assisted in floating point (minimisers verified at 60 digits, enumerator validated against brute
force on two new cases, k = 30 rerun identical), not interval-certified.
(Sec. 5) t = 0 rate >= 12.043 exact-Sturm plus 40-digit values; 12.070 with the floating-point joint alignment term.
Everything at t > 0 and every Lambda number: MEASURED / HEURISTIC, as labelled. No Lambda bound moves.
