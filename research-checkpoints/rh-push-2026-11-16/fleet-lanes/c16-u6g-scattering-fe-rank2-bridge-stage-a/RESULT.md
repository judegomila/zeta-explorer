# c16-u6g-scattering-fe-rank2-bridge-stage-a: rank-2 Eisenstein Gram positivity as a device for cell U6 (g)

Internal working note, 2026-11-19, round 16, explore lane (R4 direct). Stage A on paper, then local numerics only,
through `scripts/memcap.sh 8` (mpmath, 30 to 50 digits, four runs, each under 15 minutes and under 200 MB).
The server was not contacted. RH is open. No statement about zeros of zeta is made. NO QED.

Labels: PROVED (complete argument here, given the stated formula) / PROVED-rel X / CLASSICAL / MEASURED / ARGUED / OPEN.

**Verdict: precise obstruction. The lane ends at the control table with a device row. Score 0; all four flags false.**

1. The candidate inequality (I2), positivity of the Langlands inner product of truncated minimal-parabolic SL_3
   Eisenstein series, is not closed under Blaschke insertion in general (Lemma R, PROVED-rel the inner product
   formula; checked to 1e-10): a zero a of the scattering coefficient with 0 < Re a < 1/2 forces a zero at 1 - a.
   Rank one does not see this (map row D9, Theorem C). So rank 2 reads one half of the symmetry f(z) = f(1 - z).
2. Two forms of the control BLS survive Lemma R and pass (I2) at every T >= 0 in every test run (MEASURED, about
   4,700 Gram matrices of order 1 to 5, random and locally optimised, plus 5,600 descent evaluations; no negative value): BLS-sym (zero set closed
   under a -> 1 - conj a; this is zeta times a symmetric polynomial, so it has f(z) = f(1 - z), Lemma S; T-NR
   with c > 2 is the infinite case) and BLS-right (unpaired zeros with Re a > 1/2). Both have zeros off the line.
   Closure of (I2) under these two insertions is not proved.
3. First lemma. At a hypothetical off-line pair 1/2 +- eta + i g the Gram form at the one point where every
   coefficient is known, lambda = (rho, 2 eta), is an explicit function Q(eta, t_2) of M on the real segment
   (0, 1) only (form (*), section 4; checked against the 36-term formula to 1e-13). It does not depend on g. It is
   strict (Q about 4.18 eta^2 at t_2 = 0, positive on the grid for t_2 >= 0), not an identity, and it gives no
   contradiction for any eta: the inequality holds whether or not the pair exists.
4. Exact normalisation does not separate. Zeta's form is positive on the closed chamber T >= 0 and negative at
   T = (-0.05, -0.05) (MEASURED); at T = 0 its smallest normalised Gram eigenvalue is 1e-10 to 1e-12. The
   low-height BLS-sym forms have margin 1e-3 at T = 0 and stay positive at T = (-0.05, -0.05): the control has
   more room than zeta, not less.

---

## 1. Plan, sources, entry test

Read: BRIEF to the end; STRATEGY sections 1 and 4.0; CHECKPOINT_R15_REFEREED (U6 (g)); map section 2 (controls,
Lemmas P, F) and rows D9, G37 to G40, Q25, P45; lanes `c13-kacmoody-eisenstein-affine-weyl-shift`,
`c14-laxphillips-hecke-norm-outside-l2`, `c15-edge-argument-strip-width-hecke-amplified` (headers), `g-spinor-square-root` (brief summary).
Not opened: Langlands' inner product formula (Langlands 1976, Arthur 1980) and the range of T for which the
truncation operator of SL_3(Z) is an orthogonal projection. Everything below is relative to the formula of 2.1.

New relative to the record: row D9 closes the rank-one inequality (Theorem C) and leaves "rank above one" and the
affine kernel as ARGUED or OPEN. Not on file: Lemma R (a rank-2 necessary condition that Theorem C does not
have), Lemma S (BLS with a symmetric zero set has f(z) = f(1 - z)), Lemma D (BLS in any rank is a
constant-coefficient differential operator on the constant term), form (*), and a numerical run of the rank-2 form.

Entry test (before stage A).
- Q-P (T-NR, Lemma P). The decisive step is not linear and not a cone condition in f; Lemma P does not apply
  directly. On this carrier T-NR with c > 2, b < 1/2 is a case of BLS (map section 2 note), so Q-P reduces to Q-B.
- Q-B (Blaschke multiplication of a coefficient carrying strip zeros as zeros). This is the question of the lane.
  Rank one: closed (D9). Rank 2: not closed in general (Lemma R), open for symmetric and right-unpaired factors.
- Q-S (symmetric multipliers). A symmetric polynomial multiplier of xi is a symmetric Blaschke factor of M (Lemma S).
- Q-A. The step does not read absence of coefficient mass off log N and does not read the sign of Lambda against
  a density. By the rule of STRATEGY section 1, ZQ is then expected to pass for a single object. It does, in its
  polynomial form (section 5).

Requirements as planned: R1 Gindikin-Karpelevich (the cocycle is a product over all primes of local factors, at
three linear forms); R2 the inequality holds at every height with one truncation parameter; R3 by the table;
R4 the hope was that the pole of M at 1 combined with the third linear form z_1 + z_2 carries information from
Re > 1 to numerator zeros in the strip.

## 2. Stage A (i): the candidate inequality

### 2.1 Formula (PROVED-rel Langlands' inner product formula, recalled; conventions fixed by the checks of 2.2)

Coordinates: lambda = (z_1, z_2), z_i = <lambda, alpha_i^vee>; third form z_1 + z_2. M(u) = xi(u)/xi(u+1),
xi(u) = pi^(-u/2) Gamma(u/2) zeta(u); M(u) M(-u) = 1; simple pole at u = 1 with residue r = 1/xi(2) = 6/pi.
Weyl orbit and cocycle c(w, lambda) = product over alpha > 0, w alpha < 0 of M(<lambda, alpha^vee>):

    e:     (z_1, z_2)            1
    s1:    (-z_1, z_1 + z_2)     M(z_1)
    s2:    (z_1 + z_2, -z_2)     M(z_2)
    s2s1:  (z_2, -z_1 - z_2)     M(z_1) M(z_1 + z_2)
    s1s2:  (-z_1 - z_2, z_1)     M(z_2) M(z_1 + z_2)
    w0:    (-z_2, -z_1)          M(z_1) M(z_2) M(z_1 + z_2)

With T = t_1 varpi_1^vee + t_2 varpi_2^vee and <nu, T> = (2 nu_1 t_1 + nu_1 t_2 + nu_2 t_1 + 2 nu_2 t_2)/3:

    (I2)   K_T(lambda, mu) = sum over w, w' of c(w, lambda) conj(c(w', mu)) e^{<nu, T>} / (nu_1 nu_2),   nu = w lambda + conj(w' mu),

    is a positive kernel on the domain of holomorphy, for every T in the closed chamber t_1, t_2 >= 0.

It is not an identity: it is the statement that K_T is the Gram form of the vectors Lambda^T E(lambda).
It is the regularised integral of F_lambda conj(F_mu) over the obtuse cone T - cone(alpha_1^vee, alpha_2^vee),
F_lambda(H) = sum over w of c(w, lambda) e^{<w lambda, H>}.

### 2.2 Checks of the formula (MEASURED)

- M = 1: K_T equals the integral of F_lambda conj(F_mu) over the kite {alpha_i(H) >= 0, varpi_i(H) <= varpi_i(T)}
  (two-dimensional quadrature): defect 0 and 1.6e-30 at two (lambda, mu, T). `test0.py`.
- zeta: all 12 + 10 random 5-point Gram matrices and all 300 + 200 diagonal values are positive at
  T = (t, t), t = 0, 0.5, 1, 2; at T = (-0.05, -0.05) all 200 diagonal values are negative. `run1.log`, `run2.log`.
- A shift of T by t rho^vee equals M -> e^{-tu} M up to a rank-one factor (defect 3.5e-40): the threshold in T
  is the exponential normalisation of M. This is the sense in which (I2) "reads an exact normalisation".

## 3. Stage A (ii): marked steps

- S0. The datum is one meromorphic function M, entering at the three linear forms z_1, z_2, z_1 + z_2.
- S1 (multiplicativity; all primes together). Gindikin-Karpelevich: M is the product over p of
  zeta_p(u)/zeta_p(u+1) times the archimedean factor, and the same M appears at the three forms because the
  local intertwining operators factor over the positive roots. An identity; convergent for Re u > 1 only.
- S2 (functional equation). M(u) M(-u) = 1 with real symmetry, which is xi(u) = xi(1 - u); it makes c a cocycle,
  so that K_T(w lambda, mu) = c(w, lambda)^(-1) K_T(lambda, mu).
- S3. Pole of M at u = 1 with positive residue; no other pole in Re u > 0 (zeta has no zero with Re >= 1).
- S4. The inequality (I2) for every T >= 0.
- S5. A consequence for the zeros of M in 0 < Re u < 1 (numerator zeros of xi).

S1 and S2 are identities. The only inequality is S4. The lane tests whether S4 forces S5.

## 4. Lemmas

**Lemma R (reflection; PROVED-rel 2.1).** Let M be meromorphic with M(u) M(-u) = 1 and a simple pole at a real
p > 0 with residue r > 0. Let M(a) = 0 with Re a = A > 0, and let M be regular at p - a. Then, with
lambda = (p - a + eps, a),

    lim |eps|^2 K_T(lambda, lambda) = r |M(p - a)|^2 e^{<(2A - p, 0), T>} [ 1/(2A - p) - r e^{-p t_2}/(4 A p) ]      (eps -> 0, eps not real).

Proof. At z_2 = a the coefficients of s2, s1s2, w0 vanish. The coefficient of s2s1 is M(z_1) r/eps + O(1), with
exponent nu = (a, -p - eps). Its diagonal term has denominator (2A)(-2p - 2 Re eps). The only other terms of
order |eps|^(-2) are the cross terms with s1, exponent nu' = (a - p - eps, p + eps): nu_1 + conj(nu'_1) -> 2A - p,
nu_2 + conj(nu'_2) = -2i Im eps, and 2 Re[ i conj(eps) / (2 |eps|^2 Im eps) ] = 1/|eps|^2, independent of the
direction of eps. The two exponents differ by <(p, -2p), T> = -p t_2. QED (given 2.1).

Consequences. (a) If 2A < p the bracket is negative for every T: (I2) forces M(p - a) = 0. For zeta's pole p = 1:
every zero of M with 0 < Re a < 1/2 has a partner zero at 1 - a. (b) If 2A > p the bracket is positive when
4Ap/(2A - p) >= r e^{-p t_2}; for p = 1, r = 6/pi and t_2 >= 0 this holds for every A > 1/2 (4A/(2A-1) > 2 > 6/pi):
no condition on zeros with Re a > 1/2. (c) For zeta itself (a) is the functional equation: M(1 - rho) = xi(rho)/xi(2 - rho) = 0.
Numerical check with the control's own residue r Theta(1), at four a and two T: relative defect 1e-10 to 7e-10
(`ref_checks.json`, C1). The first prediction of the lane omitted the cross term and the factor Theta(1); the run found it.

**Lemma S (symmetric multipliers; PROVED, elementary).** Let P be a real polynomial with P(s) = P(1 - s) and all
zeros in 0 < Re s < 1. Then P(u)/P(u + 1) = product over zeros a of (u - a)/(u + conj a'), a' = 1 - conj a
running over the same zero set: a finite Blaschke product of the right half-plane, of modulus 1 on Re u = 0.
So f = xi P has f(z) = f(1 - z), M_f = f(u)/f(u+1) = M Theta_P, and M_f is a case of BLS. Check: 7e-42 (C4).
Correction to the record: the control row BLS lists "the relation f(z) = f(1 - z) for a function f with
M = f(z)/f(z+1)" under "lacks". That holds only for zero sets that are not closed under a -> 1 - conj a.
A device that reads f(z) = f(1 - z) on a scattering carrier is not outside BLS for that reason.

**Lemma D (differential-operator form; PROVED, elementary).** For Theta(u) = g(-u)/g(u) up to sign,
g(u) = product of (u + conj a_j), the cocycle of M Theta is c(w, lambda) ctilde(w lambda)/ctilde(lambda),
ctilde(nu) = product over alpha > 0 of g(<nu, alpha^vee>). Hence

    F^{M Theta}_lambda = ctilde(lambda)^(-1) D_g F^M_lambda,    D_g = product over alpha > 0 of g(d/d alpha^vee),

in any rank and for the affine root system as well (formal product over positive real roots). Check: 8e-42 (C3).
BLS is the action of a constant-coefficient differential operator, not Weyl-invariant, on the constant term. The
real factor (u - 1)/(u + 1) is realised by a group vector: the K-type of dimension 7 of SO(3) has a one-dimensional
space of M-invariants (the cubic xyz), of weight 2 for each of the three coordinate rotations, and the rank-one
intertwining operator acts on weight 2 by (u - 1)/(u + 1) (ARGUED, not computed). Non-real a has no such realisation on file.

**Form (*) (first lemma; PROVED-rel 2.1).** Suppose M(a) = M(b) = 0 with a = 1/2 - eta + i g, b = 1 - conj a.
At lambda = (a, x), x = b - a = 2 eta, only e and s2 survive, with exponents (a, x) and (b, -x), and

    K_T(lambda, lambda) = E_0 Q,    E_0 = e^{(2t_1 + t_2)/3},
    Q(eta, t_2) = e^{2 eta t_2}/(4 eta (1 - 2 eta)) - M(2 eta)^2 e^{-2 eta t_2}/(4 eta (1 + 2 eta)) - M'(2 eta) + (1 + t_2) M(2 eta).

Check against the 36-term formula for controls with such a pair (three eta, two T): 3e-15 to 3e-13 (C2).
Q depends on eta and t_2 and on the values of M and M' at the real point 2 eta. It does not depend on g.
With zeta's M (`star.py`, MEASURED): Q > 0 for eta in {0.001, ..., 0.49} and t_2 in {-0.5, 0, 0.5, 1, 2};
Q < 0 at t_2 = -1; Q/eta^2 -> 4.18 (t_2 = 0), 6.76 (t_2 = 1) as eta -> 0 (at eta = 0 the point lies on the wall
z_2 = 0 where E vanishes). Up to the weights 1/(1 -+ 2 eta) in place of e^{+-2 eta}, 2Q is the rank-one
Maass-Selberg diagonal value at the real point 2 eta and height t_2 + 1.
Answer to the first lemma: strict, with margin of order eta^2, uniform in the height g, and without content for
the zero: the left side is a fixed positive function of eta. The hypothetical zero removes terms from the Gram
form and leaves a positive remainder. This is a "truncated norm at a zero" in the sense already closed (BLS, EIS-w).

## 5. Stage A (iii): control table (first failing step)

| Control | First failing step | Status |
|---|---|---|
| ZQ (record form: rational symmetric multiplier) | S3/S4: the poles of the multiplier are non-real poles of M in Re u > 0; the diagonal of (I2) tends to minus infinity there (rank-one argument) | ARGUED [Correction entered 2026-11-19 by lane c18-repair-owed-record-r17-open-device-nodes: this entry is wrong. ZQ in the rational form passes (MEASURED: 3,360 certified positive Gram matrices, push/c17-rank2-gram-symmetric-blaschke-closure sections 5.2 and 5.5; held by that lane's referee). It does not fail at S3/S4. Map row D10 and map section 7.] |
| ZQ (polynomial symmetric multiplier) = BLS-sym | **none found**: Lemma S; S4 holds in every test | MEASURED |
| NR-q (twist family) | not a single-M object; each member is M_chi times a symmetric Blaschke factor, as T-NR | ARGUED |
| DEL | S2: no functional equation, c is not a cocycle | not formulable |
| THIN | S2 | not formulable |
| U | S2 | not formulable |
| DH | S3/S4: zeros right of 1 are non-real poles of M in Re u > 0 (as in D9); Lemma R is passed (symmetric zeros) | ARGUED, not run |
| E_a | S4 through Lemma R with p = 1 +- a: the zero rho - a has 2A < p and M(p - (rho - a)) != 0. Run: 12 of 12 Gram matrices negative at t = 0, 0.5, 1; 11 of 12 at t = 2 | PROVED-rel 2.1 (Lemma R), MEASURED |
| T-NR (c > 2, b < 1/2) | **none found**: infinite case of BLS-sym; S1 fails only as "not a group vector at p0" | ARGUED from the finite case (infinite product not run) |
| EIS-w | **none**: (I2) holds at every parameter and does not read phi(w) = 0 | by construction |
| BLS, zeros with Re a < 1/2 without partner | S4, by Lemma R (a); run: negative at t <= 1 on random data and at the predicted point for every T | PROVED-rel 2.1, MEASURED |
| BLS-sym (zero set closed under a -> 1 - conj a) | **none found** | MEASURED |
| BLS-right (unpaired zeros, Re a > 1/2, including Re a > 1) | **none found**; Lemma R (b) gives no condition | MEASURED |
| window translate | S2: M(u + i alpha) M(-u + i alpha) != 1 | not formulable |
| interpolation twin | S1, S2 | not formulable |
| backward heat | S3/S4 as DH: zeros leave every strip, so M has non-real poles in Re u > 0 | ARGUED from the record, not run |
| sign twist | S2 | not formulable |

Controls passing every step: BLS-sym (with ZQ in polynomial form and T-NR as cases), BLS-right, EIS-w.
By the rule of STRATEGY section 1 the lane ends here with a device row. "Not formulable" is not a quantitative handle.

## 6. Numerical check of the Gram form (stage B, local)

All runs: `gram.py` (36-term formula), mpmath, single process. Normalised Gram matrix G_ij/sqrt(G_ii G_jj);
"min" is its smallest eigenvalue. Points have Re z_i > 0. MEASURED; no interval arithmetic.

- `run1` (50 digits; 12 random 5-point sets and 300 diagonal points per case, T = (t, t)):

  | case | t = 0 | 0.5 | 1 | 2 |
  |---|---|---|---|---|
  | zeta | 7.3e-12 | 1.3e-6 | 1.7e-3 | 3.2e-2 |
  | BLS-sym, a = 0.3 + 3i | 2.4e-3 | 2.2e-2 | 4.1e-2 | 4.4e-2 |
  | BLS-sym, a = 0.1 + i | 6.1e-3 | 1.3e-2 | 2.7e-2 | 4.0e-2 |
  | BLS-right, a = 0.8 + 3i | 2.9e-4 | 1.2e-2 | 3.2e-2 | 4.5e-2 |
  | BLS-left, a = 0.2 + 3i | -22 (12/12 negative) | -1.5 (3/12) | positive; 1 diagonal negative | positive |
  | E_a, a = 0.2 | -0.88 (12/12) | -3.5e3 (12/12) | -1.4e4 (12/12) | -7.3e3 (11/12) |
  | Theta alone (no zeta) | 0 to 50 digits | 2.1e-3 | 1.1e-2 | 4.7e-2 |

- `run2` (threshold; 10 sets, 200 diagonal points). zeta along (t, t): positive at 0, negative at -0.05
  (200 of 200 diagonals), -0.1, -0.2, -0.35; along (t, 0) and (0, t): negative from -0.05. BLS-sym a = 0.3 + 3i,
  0.1 + i, 0.45 + 2i: positive at 0 and at -0.05 in all three directions, negative from -0.1. BLS-sym at
  a = 0.3 + 40i follows zeta to three digits.
- `run3` (30 digits; adversarial: per case and T, 160 sets of 1 to 3 points drawn near the special loci (zeros,
  1 - zeros, differences of zeros, the lines z_1 + z_2 = special), then 40 descent steps on the five lowest;
  T = (0,0), (0.3,0), (0,0.3), (1,1)). zeta, BLS-sym at 0.3 + 3i, 0.45 + 2i, 0.05 + 0.5i, BLS-right at 0.8 + 3i,
  0.55 + i, 1.6 + 2i: 0 negative values in 28 cells of 160. Lowest after descent: zeta 2.8e-12; controls 3.6e-7 to 2.3e-2.

Planned memory: matrices of order at most 5; no allocation above 1 MB.

## 7. What the result says about cell U6 (g)

- "Rank above one" changes the answer of row D9 in one respect: (I2) is not closed under arbitrary Blaschke
  insertion. What it adds is the reflection rule of Lemma R, which is the functional equation of the zero set,
  and it adds it only on the left half of the strip.
- "Reads f(z) = f(1 - z)": the symmetric control has it (Lemma S).
- "Reads an exact normalisation": the threshold of T is the normalisation; the control is positive on a larger set of T.
- "Reads the archimedean factor": a Blaschke factor is a change of the archimedean factor by a polynomial ratio
  (Lemma D); for the real zero u = 1 it is a change of K-type. No step of (I2) fixes the K-type to the spherical one
  other than S0.
- The bridge square root S = N/D and its block Gamma_- were not joined to (I2) by any step: at the one computable
  point the Gram value (*) is independent of the height of the pair, while rank Gamma_- counts pairs. No relation found.
- The two-variable affine kernel of row D9: Lemma D applies verbatim (ARGUED): the control acts by a differential
  operator on the affine constant term. Whether the affine Gram form is closed under symmetric insertion is OPEN and was not run.

No pivot was made: the adjacent candidates (affine kernel, K-type vectors) meet the same control by Lemma D.

## 8. Requirement flags

- R1 false. Multiplicativity enters at S1 as an identity. The controls that pass keep every p-adic factor; the
  step that would have to fail for them (S4) holds in every test.
- R2 false. (I2) holds at every height with one parameter T, and (*) is height-independent, but neither is a
  conclusion about zeros.
- R3 false. BLS-sym, BLS-right and EIS-w pass every step (the first two MEASURED).
- R4 false. No limit step was reached; (I2) is already at the line and carries no constraint there beyond Lemma R (a).

## 9. Three weakest steps

1. "BLS-sym and BLS-right pass" is MEASURED on about 4,700 matrices of order at most 5, with zeros of height at
   most 40 and points of height at most 6. No proof of closure in rank 2 exists here; Theorem C is rank one.
   A violation on configurations not sampled (many points, large heights, points near Re z_i = 0) is not excluded.
   If one exists, (I2) would separate zeta from every control on file except EIS-w, and the lane would reopen.
2. The inner product formula and the range of T are recalled, not opened. The conventions were fixed by two checks
   (M = 1 against a direct integral; zeta positive for T >= 0 and negative at -0.05). That the closed chamber is the
   exact range for SL_3(Z) is MEASURED, not derived.
3. Table rows marked ARGUED or "not formulable" (ZQ rational form, NR-q, DH, backward heat, T-NR as an infinite
   product, DEL, THIN, U, window translate, twin, sign twist) were not run. The K-type realisation of
   (u - 1)/(u + 1) is ARGUED. Lemma R assumes a simple pole and M regular at p - a.

## 10. Proposed rows (not entered)

Device row: "Gram positivity of truncated minimal-parabolic SL_3 Eisenstein series (rank-2 Langlands inner
product; one function M at z_1, z_2, z_1 + z_2). Not closed under Blaschke insertion: a zero with 0 < Re a < 1/2
needs the partner 1 - a (Lemma R, PROVED-rel the formula). Symmetric and right-unpaired insertions pass at every
T >= 0 (MEASURED). At a hypothetical off-line pair the form at the computable point is strict, height-independent
and without content (form (*)). Closed as measured; closure in rank 2 not proved."
Control note: BLS has f(z) = f(1 - z) when its zero set is closed under a -> 1 - conj a (Lemma S); status in rank 2:
left-unpaired fails (proved), symmetric and right-unpaired pass (measured).

Files: `gram.py`, `test0.py`, `star.py`, `run1.py/.log/.json`, `run2.py/.log/.json`, `run3.py/.log/.json`,
`ref_checks.py/.log/.json`, `REFEREE.md`, `lanes.jsonl`.
