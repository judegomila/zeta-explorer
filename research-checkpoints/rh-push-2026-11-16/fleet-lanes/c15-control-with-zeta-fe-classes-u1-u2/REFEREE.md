# Check of c15-control-with-zeta-fe-classes-u1-u2 (same-lane pass)

Status: this is a re-check by the lane's own agent with a second script (`ref_check.py`), written after
RESULT.md. It is **not** an independent referee: this session had no means to start a separate agent. An
independent referee is owed. The lanes line records referees = 0.

## What was re-derived, by a route different from `checks.py`

| item | route | result |
|---|---|---|
| m symmetric and real | m as a product over the eight zeros and poles in s, not the t^2 form | defects 7.9e-36, 4.4e-36 |
| ZQ has a zero right of the line, zeta has none there | argument principle on the rectangle 0.55 < Re s < 1.5, 7004 < Im s < 7006 (pair 6709, 6710, eta = 0.25) | ZQ: 1; zeta: 0 |
| zero count unchanged | rectangle -0.5 < Re s < 1.5, 7004.9 < Im s < 7005.3 | ZQ: 2 (the two quartet members with this ordinate); zeta: 2 (on the line) |
| 1/m = 1 + sum R_j/(s - rho'_j) | residues R_j = 1/m'(rho'_j) by numerical differentiation | defect 1.1e-32; C_E = 0.5028 as in checks.json |
| sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2 | grid log x <= 200, step 1/500, five parameter sets, including (d, eta) = (0.001, 0.001) and (0.5, 0.45) | holds in all five; ratio sup/bound 0.960, 0.273, 0.016, 0.995, 0.0097 |
| -ZQ'/ZQ = -zeta'/zeta + sum 1/(s - rho) - sum 1/(s - rho') at s = 3 | numerical derivative of the product | defect 2.5e-32 |
| sign-reversed SG density gives a pole | value of the reciprocal multiplier next to 1/2 + b | 3.3e14 at distance 1e-12 |

## Findings against the first draft of RESULT.md (all applied)

1. **Twists (material).** The first draft said ZQ passes rows Z34 and Z36 "as T-NR does". Under the twist
   convention ZQ_chi = L(s, chi) m(s) the multiplier's poles at 1/2 +- i g1, 1/2 +- i g2 are not cancelled by
   L(s, chi), so the twists have poles on the critical line. ZQ is a control for single-object devices only.
   For twist families the control with zeta's functional equation is NR-q (entire multiplier). Section 5,
   section 6 and weakest step 3 were rewritten.
2. **NR-q parameter.** The first run used c = 2.2 with q = 1 + sqrt 2; the zero is then at Re s = 1.0033,
   outside the strip (c must be below q^(1/2) + q^(-1/2) = 2.1974). Rerun at c = 2.1: zero at 0.8573 + 3.5644i.
   Both are in the files; RESULT.md quotes c = 2.1.
3. **DH5e zero list.** The first search returned the trivial zero at -2 as "off-line". The list was
   restricted to 0.501 < Re s < 1, 1 < Im s < 110 and each zero checked with its mirror by winding number.
4. **Defect needed at theta = 0.52:** 0.0019, not 0.0028 (arithmetic).
5. **F7 (products renormalised to conductor 1):** relabelled from PROVED to ARGUED; the growth argument is a
   sketch.

## Points an independent referee should attack first

- Lemma L: the use of Landau's theorem for a measure with possible mass at x = 1, and the exclusion of real
  poles of m (the step "a pole of m at a trivial zero forces a pole of G at 1 + 2n").
- Whether GEOM, SIZE, EP of Statement O may be read on atoms when the coefficient object has an absolutely
  continuous part (weakest step 1). If not, the lane's conclusion becomes: U1 and U2 are inside U3, with ZQ
  as the witness that the identification is carried by INT alone.
- The claim "no absolutely continuous member with entire twists" covers rational m of degree 0 only.
- Open cell: a member with Lambda_G >= 0 (not >= Lambda).

Verdict of this pass: the construction, the closed form of D, the bound, Lemma D and the numerics hold; Lemma L
holds as far as this pass can see; the paper runs against Z34, Z36, P53 are readings.

---

# Independent referee pass (lens: general), 2026-11-19

Separate agent from the lane; own script (kept outside the lane directory at `/tmp/ref_c15_general/rc.py`, run
under `scripts/memcap.sh 8`, mpmath 30 digits, about 2 minutes, no server job). The section above is the lane's
own same-lane pass and is left unchanged.

**Verdict: holds, with five corrections (E1 to E5).** Every step labelled PROVED was re-derived and is confirmed.
One table entry and two consequence sentences are false as written (E1); the headline is conditional on a
reading (E2). Nothing in the file is a statement about zeros of zeta; RH is not assumed; verified height is not
restated; the zeros used (1, 2, 6709, 6710) are on the line by computation.

## 1. Steps re-derived by hand

| step | result |
|---|---|
| Lemma A (G has zeta's FE iff G = zeta m, m(s) = m(1-s)) | confirmed |
| closed form m = 1 + (eta^2+d^2)(2t^2 + 2gbar^2 + eta^2 - d^2)/((t^2-g1^2)(t^2-g2^2)) | confirmed (g1^2+g2^2 = 2gbar^2+2d^2, g1 g2 = gbar^2-d^2) |
| D(x) = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(d L)) from the eight partial fractions | confirmed, sign included |
| sup abs D <= 8e^-2 (eta^2+d^2)/(1/2-eta)^2; abs D <= 8; abs D <= 8 x^(beta-1); integral bound 4(eta^2+d^2)/(sigma-1/2-eta)^3 | confirmed (cosh a - 1 <= a^2 cosh(a)/2, 1 - cos b <= b^2/2, max of L^2 e^(-aL) is 4e^-2/a^2, integral of L^2 e^(-aL) is 2/a^3) |
| m(1) finite and non-zero, m > 0 at the trivial zeros, N(T) unchanged for T > g2 | confirmed |
| density E of 1/ZQ and abs E <= C_E(1 + 1/(1-beta)) | confirmed for Re s > 1. Added: C_E = 2(eta^2+d^2)/eta to leading order (residue (d^2+eta^2)/(2 eta) per quartet point), which reproduces 0.091, 0.503, 470 of the table; so the bound on E is small only when d <= eta roughly, and grows like d^2/eta when eta -> 0 at fixed d |
| Lemma L | confirmed. Real poles of m: only at trivial zeros (zeta has no real zero in [0,1], zeta(0) != 0); G(-2n) != 0 gives a pole of G gam at -2n, hence of G at 1+2n. Real zero of m: -m'/m -> -inf from the right, against >= 0. Landau then gives abscissa -inf; f(sigma) = -f(1-sigma) and f >= 0 give f = 0. Mass of D at x = 1 does not affect the argument. The hypothesis "no pole other than s = 1" is used and is necessary (see E1) |
| Lemma D | confirmed (triangle inequality, monotonicity of l^u + l^-u) |
| forced exponent | confirmed |
| (iii) r(z) = m(2z-1)/m(2z) unimodular on Re z = 1/2 | confirmed; see E5 for the wording about its poles |
| numbers 0.068 (theta = 0.6), 0.0019 (theta = 0.52), 2.053e-3, NR-q zero 0.8573 + 3.5644i, ratio 1.046 | confirmed by hand |

## 2. Numerical rerun on a different case (MEASURED, this referee)

Pair: zeros 298, 299 (540.2132, 540.6314; the closest pair among the first 300), d = 0.20911, eta = 0.07.

| check | value |
|---|---|
| FE defect of ZQ at four points not used by the lane | 2.9e-29 |
| product form of m against the closed form | 3.1e-28 |
| argument principle, rectangle 0.53 < Re s < 1.6 around the pair | ZQ: 1; zeta: 0 |
| argument principle, rectangle -0.4 < Re s < 1.4 | ZQ: 2; zeta: 2 |
| sup abs D on a grid that resolves cos(gbar L) (40 points per period, L <= 80, 275234 points) | 0.200445; proved bound 0.284740; D takes both signs (-0.200445, +0.200444) |
| integral from 0 to 120 of e^(-(s-1)L) D(e^L) dL by quadrature against -m'/m(s), s = 1.3 + 2i | defect 2.6e-31 on a value of size 1.5e-11 (20 digits) |
| integral of abs D at sigma = 1 | 0.8600; proved bound 2.4465 |
| C_E | 1.38937; leading-order formula 2(d^2+eta^2)/eta = 1.38937 |
| abs E(x) at x = 7.5, 300.5, 3000.5 | 0.0219, 0.0256, 0.0562; bound 4.62 |
| SG with zero 5 and b = 0.45: FE defect; abs G(0.95); max D | 2.9e-29; 8.8e-34; -6.7e-3 (D <= 0) |
| NR-q at base (1+sqrt 5)/2, c = 2.05 (c_max = 2.05817): FE defect; zero; rectangle count | 2.9e-29; 0.96371 + 6.52850i; 1. Ratio of Lemma D: 1.00399 |
| Lemma D, 300 random multipliers scaled to mass 0.999, 200 strip points each | min abs m = 2.2e-3 > 0 |
| DH5e, t = 1: FE defect; rectangle counts near 61.17 and 75.40 | 4.3e-30; 1 and 1 |

All agree with the lane's statements.

## 3. Errors and required corrections

**E1 (material; a false sentence under a PROVED lemma). The pole clause of Lemma L is dropped in three places.**
Lemma L as stated (with "no pole other than s = 1") is correct. But:
- table row F2 says "POS: fails";
- section 3, consequence (a) says "No member of the family with exact atoms keeps POS";
- section 6, U2 POS branch says "no member of the family with exact atoms keeps POS (Lemma L)".

Counterexample (this referee, PROVED by the same partial-fraction computation, MEASURED on the pair 298, 299):
m_+(s) = [((t - gbar)^2 + eta^2)((t + gbar)^2 + eta^2)] / (t^2 + b^2)^2 with eta < b < 1/2. Then
G_+ = zeta m_+ has zeta's functional equation exactly, every atom of log zeta, all zeros of zeta, the quartet
1/2 +- eta +- i gbar, and D_+(x) = 4 x^(-1/2)(cosh(b L) - cos(gbar L) cosh(eta L)) >= 0 for all x, so
Lambda_G >= Lambda >= 0: full POS. It has double poles at 1/2 +- b (simple poles with two different b also work).
Measured with b = 0.2, eta = 0.07: min D_+ on the grid 7.6e-11 > 0, FE defect 2.9e-29, Laplace identity defect
5.6e-31, one zero in the rectangle 0.53 < Re s < 0.69 around gbar, abs G_+ = 0 at the quartet point.
Consequence: the identification class of Lemma L is {FE, Lambda_G >= Lambda, **no pole other than s = 1**}; the
pole clause carries it as much as the sign does. For the POS branch of U2: a device that reads FE, POS and the
atoms but not the absence of real poles in (0, 1) has the control G_+ (the analogue, with zeta's own functional
equation, of E_a in line 3 of Statement O, which also lacks only the pole clause of SIZE). The three sentences
must carry the clause "with no pole other than s = 1", and row F2 must read "POS can hold (D >= 0) at the price
of real poles in (0, 1)".

**E2 (scope of the headline). "U1 and the SIZE branch of U2 are not control-free" is conditional on a reading,
and the verdict line states it without the condition.** The checkpoint defines U1 by "complete multiplicativity
or the Hecke eigen-relation with unimodular parameters" of the coefficients. For a coefficient measure with an
absolutely continuous part these have no agreed meaning: "local factor (1 - p^-s)^-1 at every prime" holds for
every function of the form zeta(s) h(s), so "EP and GEOM exact on the atoms" is a statement about the discrete
part of the measure of log G and nothing else. Statement O, A1 admits ordinary series, Beurling series, or a
Mellin transform of a kernel; a sum of an ordinary series and a kernel transform is an extension of A1, not a
case of it. The lane says this in weakest step 1; the verdict (section 8) and outcome line 4 must say it too.
What survives without a reading is the disjunction: either GEOM is read on atoms and ZQ is a control, or GEOM
is read on ordinary coefficients, in which case {FE, GEOM} contains {FE, INT} and U1 is inside U3 by Hamburger
(already noted in STRATEGY section 4.0, caveat for U1 to U3). In both cases U1 is not a separate class on which
R3 "cannot be tested"; that part stands.

**E3 (classical input misnamed).** "Infimum 0" needs pairs of zeros on the line with gap tending to 0. The mean
gap 2 pi/log T of all zeros does not give that by itself; the input is Selberg's N_0(T) >> T log T (a positive
proportion of zeros on the line), which gives consecutive on-line ordinates with gap O(1/log T). Simplicity is
not needed (a multiple zero gives d = 0 with a squared factor). Label stays CLASSICAL with the right citation.

**E4 (scope of Lemma D).** The lemma covers multipliers of the form 1 + sum c_j (l_j^(s-1/2) + l_j^(1/2-s)) with
finite weighted l1 norm. Outcome line 3 ("no discrete control is close to zeta") extends this to all discrete
members; F6 (DH5e) and quotients of such sums are not of this form. Also "off-integer" is not accurate when
l_j is an integer (T-NR at a rational prime q has frequencies log(nq), which are integer frequencies): the
lemma bounds the non-constant part of m, wherever its frequencies lie. Also to be stated next to F3, F4: these
have m unbounded to the right (mass at x = 1/q < 1), so they are outside the hypothesis of Lemma L for that
reason, not through the sign of D.

**E5 (wording).** (a) Section 5 (iii): "its poles lie in Re z < 1/2" is true of M r, not of r; r has four poles
at (1 + rho)/2, Re z = 3/4, which cancel zeros of M. (b) Outcome line 4 says a device escapes ZQ "only" by (a)
or (b); section 5 gives a third way (analyticity of twists), and E1 gives the role of the pole clause. (c) The
table column for ZQ row 1 says "proved bound 8"; fine, but the sharper envelope values quoted in the text are
MEASURED, not proved.

## 4. Controls and the zeta-only claims

The lane has no device, so there is no mechanism to run the battery against. The two zeta-only statements are
identifications: Hamburger (relative, not opened by this referee) and Lemma L. Lemma L was run against the
members of the family: ZQ (D of both signs, measured), SG (D <= 0, real zero), G_+ of E1 (D >= 0, extra poles:
outside the hypothesis), NR-q and T-NR (m unbounded to the right: no representation on [1, inf)), HEAT (none).
No member contradicts the lemma; G_+ shows which hypothesis is doing the work. DH, E_a, backward heat, sign
and unimodular twists, Beurling, theta^w, phase-rotated transfer operator: not in the family (other gamma
factor or conductor, or no functional equation); confirmed by inspection, nothing to compute.

Novelty: multiplying zeta by a symmetric rational function is elementary and is the multiplier orbit of
Lemma M / row G34; the lane presents it as a control, not as a theorem, and labels it PROVED (elementary).
Lemma L is a short corollary of Landau's theorem; not presented as more. Nothing known is presented as new.

Not checked by this referee: the paper runs against rows Z34, Z36, P53 (ARGUED at the level of the rows'
texts; the algebra m(1/2+it)^2 > 0 off the four points is confirmed, and m(1/2+it) itself is negative for
g1 < abs t < g2, which the Z36 paragraph does not need); Hamburger and Kaczorowski-Perelli (relative); the
Hecke G(lambda) remark.

## 5. Requirement flags (set by this referee)

R1 false, R2 false, R3 false, R4 false. The lane builds controls and has no device; nothing reaches the line.

## 6. Surviving claim

No statement about zeros of zeta. ZQ = zeta m (m rational in s(1-s), degree 0) has zeta's functional equation,
pole, order, N(T) and every prime-power atom of log zeta, has zeros at 1/2 +- eta +- i gbar, and its defect is
an absolutely continuous density with sup <= 8e^-2 (eta^2+d^2)/(1/2-eta)^2 (PROVED; MEASURED on pairs 1-2,
6709-6710 and, by this referee, 298-299). If GEOM, SIZE and EP are read on the atoms, ZQ is a control for U1
and for the SIZE branch of U2; if they are read on ordinary coefficients, U1 is inside U3 by Hamburger. Lemma L
(PROVED given Landau): FE, no pole other than s = 1, and Lambda_G >= Lambda force G = c zeta; without the pole
clause it fails (G_+ above has Lambda_G >= Lambda >= 0, zeta's functional equation, exact atoms and off-line
zeros, with real poles in (0, 1)). Lemma D (PROVED) for multipliers 1 + sum c_j (l_j^(s-1/2) + l_j^(1/2-s)) only.
For twist families the control is NR-q. Referees: 1 (this pass).
