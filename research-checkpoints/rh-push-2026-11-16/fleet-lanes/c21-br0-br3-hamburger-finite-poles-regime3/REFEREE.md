# REFEREE.md: c21-br0-br3-hamburger-finite-poles-regime3

**Status of this file: author's adversarial pass, not an independent referee.** This lane had no means to
start a separate referee process. referees = 0 stands and an independent pass is owed. What follows:
re-derivations, a rerun on other members, the corrections the pass forced, and the points to attack first.

## 1. Re-derivations

1. Constants of (T) and (R) on zeta in closed form. phi = (theta - 1)/2, Q = (x^(-1/2) - 1)/2;
   A = coth(pi t)/(2t) - 1/(2 pi t^2); B = 1/(t(e^(2 pi t) - 1)); H = 1/(2t) - 1/(2 pi t^2); A - B - H =
   (coth(pi t) - 1 - 2/(e^(2 pi t) - 1))/(2t) = 0. U(t) = t(A - H) = (coth(pi t) - 1)/2, period i, residue 1/(2 pi) at
   every i n. Agrees with step 4. Numerically (T) for zeta with the circle-rule residues: 1.3e-51.
2. Mellin normalisation. int_0^inf phi(x) x^(s/2) dx/x = Lam(s), so inversion is in the variable s/2 and the
   residue sum carries the factor 1/2. The first numerical run omitted it (correction C1); the zeta row
   then showed a miss of 0.0615 = abs(x^(-1/2) - 1)/2 at x = 1.3, which located the error.
3. Lemma 1. chi(s) = pi^(s - 1/2) Gamma((1 - s)/2)/Gamma(s/2): poles only at s = 1, 3, 5, ..., zeros at 0, -2, ....
   For Re s < 1/2 no pole of chi; so poles of G there are reflections. Checked on HQ3: poles at 1/2 + b + lattice
   reflect to 1/2 - b + lattice.
4. Step 4, domain. Both U(t) and U(t + i) are meromorphic on C minus the two half-lines (-inf, 0] and
   (-inf, 0] - i. That set is connected, contains Re t > 0 and each point i n, n >= 1. The identity theorem
   applies. At t = 0 nothing is claimed.
5. 'Meromorphic of finite order with finitely many poles' gives P G entire of finite order
   (T(r, PG) <= T(r, G) + O(log r); log M(r) <= 3 T(2r) for entire functions). Used in step 1 only.
6. Theorem H' strip: edges Re s = 1 + delta (bounded) and Re s = -delta (abs(chi) of size abs(t)^(1/2 + delta));
   width 1 + 2 delta; Phragmen-Lindelof admits exp(C e^(k abs(t))) for k < pi/(1 + 2 delta). Then the Mellin line
   is moved from 1 + delta to -delta; the reflected line is Re s = 1 + delta where the series converges
   absolutely. Checked.
7. NWM. On t = i r: zt = i r (x + i y) = -r y + i r x; t^-t = exp(-i r (log r + i pi/2)) = e^(pi r/2) e^(-i r log r).
   Modulus e^(-r (y - pi/2)). With z = -i kappa (s - 1/2): y = -kappa (sigma - 1/2), so for sigma large g(z) uses
   t = -i r and g(-z) uses t = i r; the two integrands are conjugate-type and add to
   2 sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r). The 50-digit agreement of the two forms (3e-49) confirms signs.

## 2. Rerun on other members (`ref_check.py` -> `ref_check.json`; q = 3, x = 0.8, 40 digits, 96-point rule, radius 0.07)

| Member | a(q), a(q^2), a(q)^2 | miss with residues at 0, 1 only | then abs(k) <= K, K = 0, 2, 4, 6, 8 |
|---|---|---|---|
| HQ2 (q = 3, eps = 0.2) | 1, 1.6, 1 | 0.1233 | 1.4e-4, 4.7e-8, 3.5e-12, 7.6e-16, 5.3e-20 |
| HQ3 (q = 3; 0.07, 0.31) | 1.19260, 1.89884, 1.42229 | 0.03413 | 3.9e-4, 2.1e-7, 2.0e-12, 4.0e-15, 2.3e-19 |

Same reading as section 3 of RESULT.md: a non-zero miss for every finite K, decreasing at about
e^(-(pi/4)(2 pi/log 3)) = e^(-4.5) per step with fluctuations from the values of zeta at the lattice points.

## 3. Corrections made during the pass

C1. Residue sum lacked the factor 1/2 (item 2 above). Fixed; all tables in RESULT.md are from the fixed run.
C2. The first draft wrote (R) as A = 2B + H. The closed form on zeta gives A = B + H. Fixed.
C3. The first run's values of R on Re s = 1 at t = 2, 4 (1e166, 1e583) are artefacts of the real-line integral
    for g at Re z = 8, 16; they contradict the proved bound 4.66 and were replaced by Laplace-form values
    (`check_newman.py`). RESULT.md says so.
C4. The first run was killed by the 8 GB cap in the NWM block (mpmath quadrature cache over a grid that
    moved with z). Rewritten on a fixed rule; the cap was not raised. One output file (`checks.json`) was
    written to the repository root by a relative path and moved into the lane directory; the script now
    writes next to itself. No other file outside the lane directory was touched.
C5. First draft of section 3 said the HQ poles are poles of G 'at every lattice point'. zeta may vanish at
    some lattice points; the statement was reduced to 'infinitely many' with the two classical inputs named.

C6. The first version of `check_newman.py` (801 grid points on Re s = 1.25) was stopped by the author at
    14 minutes (own process, by process id) and replaced by an 81-point grid (96 s). The Laplace form
    truncated at r = 40 confirms the off-line zeros only to the size of its tail (1e-4, 3e-3); RESULT.md
    states this.

## 4. Points for an independent referee

P1. Open Titchmarsh 2.13 (or Hamburger 1921, Siegel 1922, Bochner-Chandrasekharan 1956) and compare the
    statement, in particular that the polynomial P is arbitrary (poles anywhere) and that the dual series
    is an ordinary Dirichlet series.
P2. Step 4: the claim that H continues to C minus (-inf, 0] when Q is a finite sum. Terms are
    Gamma(1 - s_v/2) (pi t^2)^(s_v/2 - 1) and their s-derivatives; Re s_v <= 1.
P3. Section 3: Putnam's theorem is quoted for 'no infinite arithmetic progression d n of zeros'; the use
    here needs it for the progression 2 pi k/log q with finitely many exceptions (pass to a multiple of d).
    If a referee does not accept the recall, the measured residues give only finitely many poles and the
    statement 'HQ1, HQ2 fail the finite-pole clause' would rest on the periodicity of m plus that recall.
    For HQ3, HQ4 the zero-density input is weaker and standard.
P4. The DH row of the control table (conductor 5: period 5, one-dimensional space) is argued, not written.
    It carries the sentence 'base-blind' and with it R3 = false. R3 = false also follows without it (no
    control fails through multiplicativity), so the flag does not depend on P4.
P5. NWM zeros are not enclosed. A referee could run an argument-principle count on a rectangle around
    0.9477 - 0.7847i with the Laplace form (valid for sigma > 0.8927).
P6. BR-3' (integer frequencies, no growth clause) is stated as OPEN. The lane did not search the literature
    for a version of Hamburger's theorem without an order hypothesis.
P7. Framing: nothing in RESULT.md should read as progress on R4. The continuation and growth across the
    strip are hypotheses of BR-3. Check sections 0 and 6 for any sentence that suggests otherwise.

## 5. Verdict of the pass

Theorem H, Lemma 1, Corollary H1 (a), Theorem H' and the NWM construction survived the re-derivations with
C1 to C5 entered. Corollary H1 (b) is relative to c20 Theorem C (c). Outcome: identification, class U3; the
lead BR-3 is closed in its stated form; flags R1 = R2 = R3 = R4 = false; no statement about zeros of zeta.
Independent referee: owed.

---

# Independent referee pass (lens: general), 2026-11-20

Separate process from the author. The author's pass above is left as written. Files added by this pass:
`ref2_check.py`, `ref2_check.json`, `ref2_check_b.py`, `ref2_check_b.json` (local, `scripts/memcap.sh 8`,
python3.14, mpmath 30 digits, 8 s and under 10 s; server not used). Sources opened: `RESULT.md`, the
author's pass, `checks.py`, `check_newman.py`, `ref_check.py`, `MAP_ROW.md`, `STRATEGY.md` 4.0 (BR-0, BR-2,
BR-3 as registered), c20 headings. Titchmarsh 2.13 not opened (no copy at hand); recalled independently
and the recall agrees with the statement quoted in section 2.

## R.1 Verdict

**Holds, with four corrections (E1 to E4), none of which touches Theorem H, Lemma 1, Corollary H1 (a) or
the answer to BR-0 / BR-3.** The result is an identification by a classical theorem and is presented as
such. No statement about zeros of zeta. Nothing assumes RH. Nothing restates verified height. No known
theorem is presented as new (Hamburger, Phragmen-Lindelof and Newman's function are named as classical).
Flags set by this pass: R1 = false, R2 = false, R3 = false, R4 = false.

## R.2 Re-derivation of the PROVED steps

Lemma 1. chi(s) = pi^(s - 1/2) Gamma((1 - s)/2)/Gamma(s/2) has poles only at s = 1, 3, 5, ...; none in
Re s < 1/2. So a pole of G in Re s < 1/2 is the reflection of a pole in Re s > 1/2; G(1 - s) is analytic
for Re s < 0; chi(-2j) = 0 and G(1 + 2j) is finite. Confirmed. The hypothesis of BR-3 as registered
('(s - 1) G(s) analytic near Re s >= 1/2 apart from finitely many poles') is the hypothesis of Lemma 1.

Theorem H, step by step.
- Step 1: P G entire of finite order, polynomially bounded on Re s = 2 and on Re s = -1 (chi is of size
  abs(t)^(3/2) there, G(1 - s) bounded). Phragmen-Lindelof in the strip applies to finite order. Confirmed.
- Step 2: int_0^inf phi(x) x^(s/2) dx/x = Lam(s) for Re s > 1; inversion in w = s/2 gives the factor
  1/(4 pi i) in s; the residue sum carries 1/2; on Re s = -1 the substitution s -> 1 - s gives
  x^(-1/2) phi(1/x). Poles crossed: poles of G (in 0 <= Re s <= 1) and s = 0; s = -2 is outside the strip
  (-1, 2). Confirmed. On zeta: Q = (x^(-1/2) - 1)/2. Confirmed by hand.
- Step 3: int_0^inf phi(x) e^(-pi t^2 x) dx = sum a_n/(pi (n^2 + t^2)); the dual term is
  (1/t) sum a_n e^(-2 pi n t) by the stated integral. Interchange: sum abs(a_n) n^-2 is finite and
  phi(x) = O(x^(-(1 + eps)/2)) at 0. H is a finite combination of Gamma(1 - s_v/2) pi^(s_v/2 - 1) t^(s_v - 2) and
  log-derivatives, Re s_v <= 1; analytic on C minus (-inf, 0]. Confirmed.
- Step 4: residue of t a_n/(pi (t - i n)(t + i n)) at t = i n is a_n/(2 pi). U(t) and U(t + i) agree on
  Re t > 0 and are both meromorphic on C minus ((-inf, 0] union ((-inf, 0] - i)), which is connected and
  contains a neighbourhood of i n for each n >= 1. Residues give a_n = a_(n+1). Confirmed.
This is the standard (Siegel-type) proof. The statement is Titchmarsh 2.13 with g = f.

BR-3. With G = zeta forced, alpha_p = 1 and the divergence clause cannot hold: the hypotheses of BR-3
are never jointly satisfied. RESULT.md says this ('the divergence clause of BR-3 is never met'). The
sentence 'BR-3 as stated is true' means: true with an empty hypothesis set. Correct as written.
Regime 2 remark: for abs(alpha_p) = p^(1/2) on S with sum over S of p^-sigma finite for sigma > 1/2 the
series converges absolutely for Re s > 1 (sum over S and k of p^(k (1/2 - sigma))). Confirmed.

Corollary H1 (a). Follows from Theorem H and Lemma 1 (the part of Lemma 1 that locates poles does not use
finiteness). Confirmed. H1 (b) is relative to c20 Theorem C (c), which this pass did not re-derive.

Theorem H'. Edges: Re s = 1 + delta (bounded), Re s = -delta (size abs(t)^(1/2 + delta)); width 1 + 2 delta;
Phragmen-Lindelof admits exp(C e^(k abs(t))) for k < pi/(1 + 2 delta). Steps 2 to 4 with c = 1 + delta;
s = -2 stays outside for delta < 2. Confirmed in the form stated (bound assumed on the closed strip
-delta <= Re s <= 1 + delta). See E1 for the sentence that follows it.

NWM. Turned path t = i r: Re(zt - t log t) = -r (y - pi/2). Arc at radius rho, angle theta in [0, pi/2]:
exponent -rho (cos(theta)(log rho - x) + sin(theta)(y - theta)), at most -rho min(log rho - x, y - pi/2).
Confirmed. Sum of the two turned paths for sigma > 1/2 + pi/(2 kappa):
g(z) + g(-z) = 2 int_0^inf sin(r log r) e^(pi r/2) e^(-kappa (s - 1/2) r) dr. Re-derived with signs; confirmed
numerically (R.3). R(s) = R(1 - s) since s -> 1 - s is z -> -z. Added observation: on Re s = 1/2 the
variable z is real and R = g(x) + g(-x) > 0, so 1 + R > 1 on the line. **Every zero of 1 + R is off the
line**, for every kappa. This is exact and stronger than the measured statement.

## R.3 Reruns on different cases

Theta-relation defect (own coefficient formulas, 80-point midpoint circle rule of radius 0.08):

| Member (not in the author's runs) | a(q), a(q^2) | series against closed form at s = 5 | miss with residues at 0, 1 only | then abs(k) <= K |
|---|---|---|---|---|
| HQ1, q = 5, eps = 0.3, x = 0.7 | 1.67082, 4.67082 | 4.6e-15 | 0.0429 | K = 0: 2.0e-3; K = 2: 2.0e-5; K = 5: 1.1e-10; K = 8: 2.4e-15; K = 12: 1.1e-19 |
| HQ4, q = 3, (a, b) = (0.15, 0.35), x = 1.9 | 8.23460, 35.1716 | 5.0e-14 | 3.59 | K = 0: 2.7e-2; K = 3: 2.9e-8; K = 6: 1.7e-14; K = 9: 3.0e-20 |

Non-zero for every K run; decay about e^(-(pi/4)(2 pi/log q)) per step with fluctuation. Same reading as
section 3 of RESULT.md.

NWM:
- kappa = 4, s0 = 0.0523313279723755 + 0.7846755606466836i, own quadrature of g: abs(1 + R(s0)) = 2.2e-15
  (the 16 digits copied). Winding number of 1 + R on the circle abs(s - s0) = 0.02, 48 points: 1.0000000000
  (largest phase step 0.18 rad, minimum modulus on the circle 0.552). zeta(s0) = -0.1197 - 0.4546i. One
  zero of G_NWM inside the circle, in 0 < Re s < 1, off the line. This is an argument-principle count in
  floating point, not a ball enclosure.
- Entire form against Laplace form at points not used by the author: kappa = 4, s = 1.6 - 0.4i:
  both -0.15268498460073133925 - 0.069523511379597747912i, difference 1.2e-32, proved bound 0.707.
  kappa = pi, s = 1.45 + 0.3i: both -0.26069647482013642347 - 0.054187262705389372032i, difference 5.8e-32,
  bound 1.415.
- `ref2_check.json` also holds a value 1.05e8 for the entire form at 1.6 - 1.3i (kappa = 4). That is the
  artefact the author describes (real-line integral for g at Re z = 5.2); it is not a counterexample to
  the bound and is superseded by `ref2_check_b.json`.
- kappa = pi: 1 + R(1/2 + it) = 4.99, 7.88, 44.6 at t = 0, 0.3, 0.6. Newton from five starts inside the strip
  returned only zeros outside it: -0.0699894561646475 + 0.999079953602592i,
  -0.184532037804542 + 0.506846853417662i (and its reflection 1.1845 + 0.5068i), -0.046296858893498 +
  1.17642181810849i. So at the 'sharp' value kappa = pi the off-line zeros found lie in Re s < 0 or
  Re s > 1; a zero inside the open strip at kappa = pi was not found (five starts; not a search).
  RESULT.md claims strip zeros at kappa = 4 only, so nothing is contradicted; the map row should not be
  read as 'zeros in the strip for every kappa'.

Controls. The result claims no zeta-only mechanism, so there is no mechanism to run controls against. The
control table was checked by hand: HQ1 to HQ4 satisfy m(u) = m(1/u) and expand in u for Re s > 1/2 (HQ3,
HQ4 need b < 1/2); DH: the odd 5-periodic sequences are spanned by the two odd characters mod 5, and the
self-dual functional equation with a fixed sign leaves one dimension (c' = eps c with eps the root
number). The DH row stays ARGUED: the four steps at conductor 5 are not written.

## R.4 Errors and corrections

E1 (overstatement, section 2 after Theorem H' and verdict item 5 (a)). 'So a twin with finitely many poles
satisfies: for every k < pi, log log max over the strip 0 <= sigma <= 1 ... exceeds k T' does not follow
from Theorem H' as proved. H' needs the bound on -delta <= Re s <= 1 + delta. The piece -delta <= sigma <= 0
follows from the piece 1 <= sigma <= 1 + delta by the functional equation, but in 1 < sigma <= 1 + delta the
only bound available is sum abs(a_n) n^-sigma, which is not uniform as sigma -> 1+, and Phragmen-Lindelof
needs an a priori bound on the whole strip. What is proved: for every delta > 0 and every
k < pi/(1 + 2 delta), the bound exp(C e^(k abs(t))) fails on the strip -delta <= Re s <= 1 + delta. The form on
0 <= sigma <= 1 is likely true (a two-constants argument on a domain straddling Re s = 1 would be needed)
but it is not in the file; label it ARGUED or restate with the wider strip. `MAP_ROW.md` ('k < pi, in the
strip') carries the same wording.

E2 (ill-posed sentence, verdict item 5 (b), section 5.2 and the claim line 'that clause is necessary and
sharp outside integer frequencies'). Outside integer frequencies the conclusion of Theorem H and H' is
false with the growth clause in force: ZQ and Proposition W (the lane's own control table) have zeta's
functional equation, finite order, the pole at 1 only, and are not zeta. A clause cannot be 'necessary'
or its constant 'sharp' for a conclusion that fails with the clause. What NWM does establish: (i) for
real frequencies the functional equation, a single pole and absolute convergence in Re s > 1 imply no
growth bound in the strip (so step 1 is not automatic, and a proof of BR-3' must get growth from
integrality or avoid step 1); (ii) the Phragmen-Lindelof threshold of step 1, and of c20 Lemma A0 /
Theorem C (b), is attained by a symmetric entire Dirichlet integral (growth exponent kappa against strip
width pi/kappa). (ii) is the classical sharpness of Phragmen-Lindelof realised inside the Dirichlet-
integral class. Reword accordingly. The inference in 5.3 ('integer frequencies must be used a second
time') survives in form (i).

E3 (redundant inputs, section 3 and weakest step 2; not an error). 'Infinitely many lattice points are
poles of G' does not need Putnam or Carlson. Each HQ member is an ordinary Dirichlet series, absolutely
convergent in Re s > 1, of finite order, with zeta's functional equation and a(q) != 1 or a(q^2) != a(q);
if it had finitely many poles Theorem H would give G = a_1 zeta. So Corollary H1 (a) already gives
infinitely many poles, and since the only candidates are the lattice points and s = 1, infinitely many
lattice points are poles. Weakest step 2 can be removed. Side product, unconditional and classical in
kind: zeta does not vanish to order 2 (HQ1) at all but finitely many points 1/2 + 2 pi i k/log q.

E4 (wording, verdict item 4 (b)). 'They are all on the critical line' should read 'all except possibly
s = 1'. Section 2 has it right.

E5 (literature, not checked by the lane). Corollary H1 (a) and the HQ family are the known phenomenon
that Hamburger's theorem fails when infinitely many poles are allowed: M. Knopp, 'On Dirichlet series
satisfying Riemann's functional equation', Invent. Math. 117 (1994), recalled by this referee, not
opened, gives infinitely many linearly independent solutions in that setting. If the recall is right,
Q-inf 'with infinitely many poles' without the Euler-product clause is answered in the literature and
only the version with an Euler product is open; the lane should open that paper before Q-inf is
re-registered. BR-3' (no order clause): this pass also did not find or recall a reference.

E6 (scope of 'measured'). The NWM zeros are not enclosed; the winding number above is floating point.
The exact statement available without any numerics is the one in R.2: 1 + R > 1 on the line, so any zero
of 1 + R is off the line; existence of a zero then needs only that 1 + R vanishes somewhere, which is
what the measured roots show.

## R.5 Requirement flags (set by this pass)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Theorem H holds for every ordinary Dirichlet series; the Euler product is not read |
| R2 | false | identification; no window or height statement |
| R3 | false | controls fail at pole count, integrality or growth; the theorem holds at the DH base (argued) |
| R4 | false | continuation, growth and pole count in the strip are hypotheses |

## R.6 What survives

Hamburger's theorem with finitely many poles (classical; proof in the lane confirmed) gives G = a_1 zeta;
the BR-0 space is C zeta; BR-3 as registered has an empty hypothesis set and is closed as a lead.
HQ1 to HQ4 are outside the space because they have infinitely many poles (by Theorem H itself). A
finite-order twin has infinitely many poles in 1/2 <= Re s <= 1. Theorem H' holds with the bound on
-delta <= Re s <= 1 + delta. NWM is a valid control for general frequencies (zeta's functional equation,
pole at 1 only, infinite order, every zero of 1 + R off the line, one strip zero counted at kappa = 4).
Open: BR-3' and Q-inf with an Euler product. Referee count for this file: 1 (this pass).
