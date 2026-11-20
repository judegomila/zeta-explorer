# c19-hq2-screen-fe-int-mult-pos-devices: RESULT

Date 2026-11-20. Round 19, kind: combine (combinable 2 of round 18). Scope: this directory only. Server use:
three units through `rhrun` (`rh-c19hq2-cth-1120063544`, 2 cores; `rh-c19hq2-dev2-1120064026`, 8 cores;
`rh-c19hq2-dev3-1120064547`, 4 cores; all python-flint 0.9.0, 128-bit balls; all ended on their own; a first
unit `rh-c19hq2-dev-1120063544` was stopped by me after 2 minutes and its output deleted, see section 5.0).
Local runs through `scripts/memcap.sh 8`. Nothing committed or pushed. No independent referee has read this
file (referees = 0). **No statement about zeros of zeta is made.** Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument in this file, elementary; author only) / CLASSICAL (recalled, not opened) /
RELATIVE (to a lane on file) / CERTIFIED (python-flint balls; the sign is decided by a ball that excludes 0) /
MEASURED (float64, or a grid statement) / ARGUED / OPEN / NOT RUN.

Sources read: `BRIEF.md`; `c18-exact-relation-rigidity-klein-spinor` (RESULT.md sections 0 to 6, REFEREE.md
verdict and re-derivations); `c18-tz-band-completion-controls-server` (RESULT.md sections 0 to 3, PREREG.md,
`tz.py`, `run.py`); `s3-prime-side-zero-statistics` (RESULT.md sections 0, 1, 3; `w3.py`);
`c15-u7-growing-section-twin-ladder-bridge` (Lemma 1, 2, Theorem 1, `stage.py`); `c16-ctheta-proposition5-power-sum`
(section 0, Lemma A, Theorem B); map section 2 (controls) and rows P45, P56, Q19, Q21, Q30, Q31, D8, D10;
`engine/curated/devices.json` (56 devices, 11 cells).

## 0. Verdict

**Precise obstruction, with a non-empty class (iii) list at one named step.** HQ2 is a valid screen for every
device on file whose decisive step reads the functional equation, integer frequencies, prime-power support of
the log-derivative and the sign of the *coefficients*: on those it fails the pole clause and nothing else,
and on the three numerical devices it does so in certified cells. It is not a screen for devices that read
the *shape of the local Euler factor* (complete multiplicativity, a geometric local factor, a size bound on
local parameters, local zero-freeness): there HQ2 fails at the prime q, before the pole clause is met, and no
twin built from finitely many primes with rational local factors can pass (Lemmas S, F, C below). Seven statements:

1. (First lemma, CERTIFIED.) HQ2(q, eps) restated with coefficients, pole data and off-line zeros in balls for
   five members; zeta is certified non-zero at the listed zeros (the zeros are simple and belong to the
   factor) and at the listed pole points (the poles have order exactly 4, including the one at s = 1/2).
   New data on HQ2: its coefficient measure is >= 1 but its log-derivative coefficients are signed; the first
   negative one is at n = q^22 for eps = 1e-2 and at q^669 for eps = 1e-8 (section 2).
2. (Classification, section 3.) 20 device rows. Class (i), pole clause: Hamburger, Theorem P, the trace
   identity / theta relation, the three band devices (W, C(theta), N(theta)) in the limit, Weil-type explicit
   formula positivity, the spinor causal S, the rank-2 apex kernel D10 (ARGUED, not run). Class (ii), passes
   every step: the identities (seam identity, Krein factorisation, lattice Hecke relations), state
   positivity in the Bost-Connes system, and every band device at a fixed finite stage for eps below a
   measured threshold. Class (iii), another step: (iii-a) sign of the log-derivative coefficients at powers
   of q (POS-FE form of Theorem P, Lemma L); (iii-b) shape of the local factor at q (Lee-Yang stage
   property, Edrei-Thoma total positivity, size of local parameters / tensor squeeze, Selberg's Euler axiom,
   the coefficient bounds used by the 7/8 architecture); (iii-c) complete multiplicativity at q (Bost-Connes
   eigenstates, Hecke eigen-relations of step type X2, Helson-type discrepancy classes).
3. (Siblings, PROVED, CERTIFIED checks.) Two new members of the same family remove (iii-a) and part of
   (iii-b): HQ3(q, a, b) = zeta(s)(1 - alpha u + u^2)/(1 - beta u + u^2) has log-derivative coefficients
   >= Lambda(n) >= 0; HQ4(q, a, b) = zeta(s)(1 + alpha u + u^2)/(1 - beta u + u^2) has in addition a totally
   positive local factor at q (Edrei-Thoma form). Both have zeta's functional equation, integer
   frequencies, an Euler product, zeros off the line at real part 1/2 +- a, and fail only the pole clause,
   with simple poles at real part 1/2 +- b, b > a, the first one on the real axis. So (iii-a) and the
   Edrei-Thoma row reduce to class (i).
4. (Lemma N, PROVED; local Landau.) In a one-prime twin with non-negative log-derivative coefficients, an
   off-line zero of the factor forces a pole of the factor on the real axis at real part >= that of every
   zero of the factor. So with log-level positivity the pole clause cannot be moved onto the critical line:
   HQ3 is the only shape available, and "no pole on the real segment (1/2, 1)" replaces the full pole clause
   inside the one-prime class.
5. (Lemmas S, F, C, PROVED; the forced part of class (iii).) A twin zeta(s) prod over p in S of R_p, S finite,
   R_p rational in p^-s, with zeta's functional equation, is a product of one-prime factors, each symmetric up to a sign
   (Lemma F); a one-prime symmetric factor whose local Euler factor has neither zero nor pole in
   Re s >= 1/2 is 1 (Lemma S); if every local factor is of the geometric form prod_j (1 - alpha_j p^-s)^-1
   (any degree, any complex alpha_j; complete multiplicativity is degree 1) and all but finitely many are
   zeta's, then the function is zeta (Lemma C). No pole clause, no order clause and no positivity is used.
   The local-shape step therefore reads multiplicativity jointly with the functional equation and replaces
   the pole clause, for finitely many modified primes. For infinitely many modified primes the question is
   OPEN (section 4.5). The conclusion is an identification: it locates no zero.
6. (Decisive numerical test, CERTIFIED; section 5.) The band device N(theta) (at theta = 1 it is the matrix
   W of s3 with X = T) on 96 and 192 modes and C(theta), heights 1e4, 1e5, 1e6: the prime-side form of HQ2
   "as written" (zeta's pole term) equals zeta's form plus the off-line quartets minus 4 times the pole
   lattice on the line (identity checked to 1e-7 and 1e-11); the form with HQ2's own pole terms added equals
   the form of the zeros alone. Both are finite sums of atoms at k log q. 48960 sign decisions, 2046
   undecided. zeta: never negative; positive at M = 0 in all 288 object-cells with theta <= 0.75. HQ2 with
   zeros at distance 0.01, 0.03, 0.10 from the line passes N(theta) at M = 1 in 384 of 384 object-cells with
   theta <= 0.85. In 801 certified pairs at M = 0 (455 at M = 1; 75 for C(theta)) HQ2 as written is negative
   while the form of its zeros alone is positive: the device rejects it through the pole lattice only. The
   table separates "pole" from "zeros"; it does not separate HQ2 from ZQ or T-NR by anything but the
   distance of the off-line zeros (section 5.3).
7. Registered outcome: the class (iii) list is **not empty**. Entries whose failing step reads
   multiplicativity jointly with the functional equation: (iii-b) local shape and (iii-c) complete
   multiplicativity. They are proposed to the planner as one explore candidate (section 8). By the
   registered rule the lane does not score 0, but nothing is claimed for R1 or R3: the joint read is proved
   for finitely many primes only and its conclusion is an identification.

## 1. Plan; what is new against the record

Plan as assigned: first lemma; device list with the failing step of HQ2; decisive numerical test on the
server with ZQ and T-NR beside HQ2; registered outcome.

New here: the sign pattern of the log-derivative coefficients of HQ2; the siblings HQ3 and HQ4; Lemma N;
Lemmas S, F, C; the finite atom form of HQ2 on the band devices (as written, own poles, pole lattice alone)
with the Poisson identity for the pole lattice; the certified cells. Not new: HQ2 itself, Lemma Q (c18);
the band devices and their code (`tz.py` is copied unchanged from c18-tz; C(theta) follows `stage.py` of
c15-u7); G_+ of the c15 referee (log-derivative coefficients >= Lambda, double real poles at 1/2 +- b): HQ3
is its integer-frequency, multiplicative form.

Notation. u = q^(1/2 - s), y = q^-s = q^(-1/2) u, v = log q. m is a one-prime multiplier (a function of u),
G = zeta m. FE: G gam is invariant under s -> 1 - s, gam(s) = pi^(-s/2) Gamma(s/2); for a function of u this is
m(u) = m(1/u). nu: coefficients of -G'/G. N: coefficients of G. Local factor at q: (1 - y)^-1 m.

## 2. First lemma: HQ2 restated (CERTIFIED where marked; `lemma1.py`, `lemma1.json`, 200-bit balls)

HQ2(q, eps) = zeta(s) (1 + eps u^2/(1 - u)^4), q prime, eps > 0.

- Functional equation: u^2/(1 - u)^4 is invariant under u -> 1/u (PROVED, c18). CERTIFIED at three points per
  member: the two sides overlap and agree to relative width below 1e-40.
- Coefficients: a(n) = 1 + eps sum_{2 <= j <= v_q(n)} C(j+1, 3) q^(j/2) >= 1; a(n) depends on v_q(n) only, so
  a is multiplicative; a(q) = 1, a(q^2) = 1 + eps q (not completely multiplicative). Size: a(q^j) is of
  order eps j^3 q^(j/2): the Ramanujan bound a(n) << n^delta fails at powers of q.
- Log-derivative: -G'/G = -zeta'/zeta + v sum_{k >= 1} (4 - S_k) u^k, S_k = sum of the k-th powers of the four
  roots of (1 - u)^4 + eps u^2 = 2 Re(e^(kw) + e^(-kw)), sinh(w/2) = (eps^(1/4)/2) e^(i pi/4). So
  nu(q^k) = v (1 + q^(k/2)(4 - S_k)). The closed form and Newton's identities agree to 4e-32 for k <= 40.
  **nu is signed for every eps > 0** (PROVED by Lemma N; the oscillating term has modulus
  e^(k Re w)). First k with nu(q^k) < 0 (CERTIFIED, `lemma2.py`):

  | q | eps | first k | n = q^k |
  |---|---|---|---|
  | 2 | 1e-1 | 13 | 8192 |
  | 2 | 1e-2 | 22 | 4.2e6 |
  | 2 | 1e-3 | 38 | 2.7e11 |
  | 2 | 1e-4 | 67 | 1.5e20 |
  | 2 | 1e-6 | 212 | 6.6e63 |
  | 2 | 1e-8 | 669 | 2.4e201 |
  | 3 | 1e-2, 1e-4 | 22, 67 | 3.1e10, 9.3e31 |
  | 101 | 1e-2 | 22 | 1.2e44 |

  For n below these values every nu(n) is >= Lambda(n) or positive: at the heights of section 5 (n <= 1e6)
  the member (2, 1e-2) has a non-negative log-derivative on the whole range read by the devices.
- Poles: s = 1 (simple, residue 1 + eps q/(1 - sqrt q)^4) and s = 1/2 + 2 pi i k/v, k in Z, of order 4 with
  leading coefficient eps/v^4 times zeta there. CERTIFIED: abs zeta > 0 at k = 0..5, 50, 1000, 100000 for
  each member (so the order is exactly 4 there; this is the referee's item E3 of c18 for these k).
- Zeros of the factor: s = 1/2 + (+-w or +-conj w)/v + 2 pi i k/v. Offsets (Re, Im) of w/v:

  | q | eps | Re (distance from the line) | Im |
  |---|---|---|---|
  | 2 | 1e-2 | 0.32392522713068806 | 0.32123737355539789 |
  | 2 | 1e-4 | 0.10205640257987927 | 0.10197139110164765 |
  | 2 | 1e-6 | 0.032260985822798634 | 0.032258297519358448 |
  | 3 | 1e-2 | 0.20437406372914340 | 0.20267821693524941 |
  | 101 | 1e-2 | 0.048650486391100919 | 0.048246796363793570 |

  Zeros right of the line, located in balls (each: the factor's ball contains 0 with radius below 2e-57;
  abs zeta > 0 CERTIFIED, so the zero is a zero of G and not cancelled; the derivative of the factor is
  CERTIFIED non-zero, so the zero is simple; Re s - 1/2 > 0 CERTIFIED). Member (2, 1e-2):
  0.82392522713068806 +- 0.32123737355539789 i (abs zeta >= 2.48),
  0.82392522713068806 + 9.3859576572097855 i (abs zeta >= 1.41),
  0.82392522713068806 + 8.7434829100989897 i (abs zeta >= 1.35); also k = 2, 50, 1000 and the other four
  members (40 zeros in `lemma1.json`). All five members lie in the open strip.
- On the critical line the factor equals 1 + eps/(16 sin^4(t v/2)) >= 1 + eps/16 (PROVED, c18 referee;
  sampled lower bound 1.000625 for eps = 1e-2). So the on-line zeros of HQ2 are exactly zeta's, and the
  count of zeros minus poles in a period is 0: HQ2 has zeta's N(T) with the poles counted negatively.

Attribute sheet used in section 3: FE yes; INT yes; MULT (nu on prime powers) yes; N >= 1 yes; nu >= 0 no;
complete multiplicativity no (at q^2); local factor at q of geometric form no; Ramanujan size no (at q);
(s - 1) G entire no (order-4 poles on the line); order 1; even completed field yes (meromorphic).

## 3. Device list and the step HQ2 fails

Devices from `OBSTRUCTION_MAP.md` and `engine/curated/devices.json` whose decisive step reads a subset of
{FE, INT, MULT, POS}. POS is split into N >= 0 (coefficients) and nu >= 0 (log level); MULT into prime-power
support of nu, local shape at each prime, and complete multiplicativity. Class: (i) pole clause; (ii) passes
every step; (iii) another step, named. "Sibling" = the member of the same one-prime family that removes the
named step. Status of each cell in the last column.

| # | Device (row; device id) | Decisive step reads | HQ2: failing step | Class | Sibling / forced | Status |
|---|---|---|---|---|---|---|
| 1 | Hamburger (rows L2, P6; exact-uniqueness; c18 E4) | FE, INT, finitely many poles | infinitely many poles | (i) | - | PROVED (c18) |
| 2 | Theorem P (row P56; cell U2-POS) | FE, N >= 0, support >= 1, (s - 1) G entire of finite order | residues at 1/2 + 2 pi i k/v in the theta relation (step 4 of the proof, as for G_+) | (i) | - | RELATIVE (c16), hypotheses CERTIFIED here |
| 3 | POS-FE form of Theorem P; Lemma L of c15 (sign of nu - Lambda with the pole clause) | FE, nu >= 0, pole clause | nu(q^k) < 0 (first k in section 2) | (iii-a) | HQ3 passes nu >= Lambda and fails the pole clause: (i). Forced: Lemma N | PROVED here |
| 4 | Trace identity (T), theta relation, self-dual measure (c18 E5) | as 2 | as 2 | (i) | - | RELATIVE |
| 5 | Lee-Yang stages, Krein-space limit (rows Q19, Q21; stage-limit; `c1-leeyang-krein-limit`) | MULT (Euler stages), stability of the stage polynomial, gamma and pole renormalisation | the stage at P >= q is not the reciprocal of a stable polynomial: the local factor has zeros with abs(q^-s) < q^(-1/2) and poles with abs(q^-s) = q^(-1/2) | (iii-b) | forced for finitely many primes (Lemmas S, F) | PROVED (the local statement); the device was not run on HQ2 |
| 6 | Pick / Loewner prime-side matrix W (s3, combination 3; finite-support-positivity; rows P2, P3) | FE through the explicit formula with zeta's gamma term and the pole at 1; c(n), n <= X | at fixed X: none for eps below the threshold of section 5; above it the pole lattice term and the quartets | (ii) at a finite stage; (i) and the target in the limit | - | CERTIFIED cells (theta = 1 columns of section 5) |
| 7 | C(theta) Fejer section (row Q30, P45; fejer-section-prime-chain-growing-p) | as 6 with the Fejer weight | as 6 | (ii) / (i) | - | CERTIFIED at the grid minimum; grid MEASURED |
| 8 | Band device N(theta) (row Q31; tz-one-sided-completion-bound-band) | as 6 on [0, theta log t] | as 6 | (ii) / (i) | - | CERTIFIED cells |
| 9 | Weil positivity on finite tests; explicit formula (rows P1, P8, P10; residue-explicit-formula) | FE, zero and pole set | W_HQ2(g * g~) = sum over zeros of abs(ghat)^2 - 4 sum over line poles of abs(ghat)^2: the pole term is <= 0 for every test | (i) | - | PROVED (explicit formula; identity checked in section 5.1) |
| 10 | Spinor causal S, bridge energy H_c (g-spinor-square-root; rows Q1 ff.; c18 E12, E13) | evenness of F (FE), analyticity of F on Re z >= 0 | F'/F = sum over zeros - 4 sum over poles i y_k; near each pole D = F + alpha F' has a zero in Re z > 0 for small alpha: S is not causal through the poles alone (HQ1 with 0 < eps <= 4 has every zero on the line and fails the same way) | (i) | - | ARGUED (local expansion at a pole; not run) |
| 11 | Rank-2 apex kernel D10 (Gram positivity of truncated SL_3 Eisenstein data read off M(u) = xi(u)/xi(u+1)) | FE as M(u) M(-u) = 1, zero set of M, analyticity of M in Re u > 0 apart from u = 1 | M times m(u)/m(u+1) has order-4 poles on Re u = 1/2 (ZQ in rational form has none: its multiplier poles are cancelled by zeros of zeta); the left zeros are reflection-paired, so Lemma R is passed | (i) | - | ARGUED; the Gram form with these poles NOT RUN |
| 12 | Bost-Connes state positivity (row D8 (i) to (vi); bost-connes-crossed-product-positivity; cell U6 (e)) | positivity of a state; mu_n covariance | state positivity: none. The vector of HQ2 at s is D_s xi_s with D_s = m_q(q^-s mu_q), a norm-convergent series for Re s > 1/2, invertible for Re s > 1/2 + Re w/v (no zero of the local series in the closed disc); the state x -> <D xi, x D xi>/norm(D xi)^2 is positive wherever the vector is non-zero. Lemma G of c17-u6e covers the range where D_s is invertible | (ii) | - | ARGUED |
| 13 | Bost-Connes mu*-eigenstates (Lemma E of c17-u6e); exact relation E7, E8 of c18 | complete multiplicativity | a(q^2) != a(q)^2 | (iii-c) | forced: Lemma C | PROVED |
| 14 | Hecke eigen-relation at every prime (step type X2 of Lemma P; catalogued-x2-inequality; spherical vector) | complete multiplicativity or a degree-1 local factor | as 13 | (iii-c) | forced: Lemma C | PROVED for the relation; devices not run |
| 15 | Helson and twisted discrepancy (helson-discrepancy, twisted-discrepancy) | completely multiplicative unimodular coefficients | not in the class (a(n) >= 1, growing at q) | (iii-c) | forced: Lemma C | PROVED (class membership) |
| 16 | Edrei-Thoma local total positivity (edrei-thoma-local-total-positivity) | local factor of the form prod(1 + b_j y)/prod(1 - a_j y), a_j, b_j >= 0 | the numerator of the local factor has non-real roots | (iii-b) | HQ4 passes (roots negative, poles positive) and fails the pole clause: (i) | PROVED (Edrei's theorem CLASSICAL); minors CERTIFIED for HQ4 |
| 17 | Size of local parameters: tensor squeeze, Ramanujan bound, Selberg's Euler axiom b(p^k) << p^(k theta), theta < 1/2 (tensor-squeeze; control note SIZE) | local shape | a(q^j) of order q^(j/2); b(q^k) of order q^(k(1/2 + Re w/v)) | (iii-b) | forced: Lemma S | PROVED |
| 18 | Coherent set with large sieve, 7/8 architecture (coherent-set-large-sieve; rows Z15, Z16) | Lambda and mu with their sizes, all primes | the coefficients of 1/G and G'/G at powers of q grow like q^(k(1/2 + Re w/v)): the size inputs fail at q | (iii-b) | forced: Lemma S | ARGUED (the proof was not traced step by step) |
| 19 | Seam identity (g-klein-bottle-seam; c18 E11); Krein factorisation (E12); lattice Hecke relations (E9, rows G16, G42) | FE, reality | none (identities; hold with poles counted negatively) | (ii) | - | RELATIVE (c18 section 6) |
| 20 | Local conditions at single primes (map section 3.8) | local shape at one prime | fails at q | (iii-b) | forced: Lemma S | PROVED |

Devices of `devices.json` not in the list: their decisive step reads something outside the four inputs (a
zero-location input or certificate, a family or conductor aspect, frequencies only, special values, geometric
positivity, a flow). For those HQ2 is not the relevant screen and no cell is claimed.

Reading.
- Coefficient-level reads (rows 1, 2, 4, 6 to 11, 19): class (i) or (ii). HQ2 is a screen: an argument built
  from these inputs must contain the pole clause, and the pole clause is the only one stated inside the strip.
- Log-level sign (row 3): HQ2 itself fails earlier, HQ3 does not. Lemma N shows the price: the poles move off
  the line onto the real axis, right of the zeros.
- Local shape and complete multiplicativity (rows 5, 13 to 18, 20): HQ2 fails at q and so does every twin
  with finitely many modified primes. This is the registered class (iii) outcome.

## 4. Lemmas

### 4.1 Siblings HQ3 and HQ4 (PROVED; checks CERTIFIED in `lemma2.json`, `lemma3.json`)

Let 0 < a < b < 1/2, A = a v, B = b v, alpha = 2 cosh A, beta = 2 cosh B.

HQ3 = zeta(s) (1 - alpha u + u^2)/(1 - beta u + u^2). HQ4 = zeta(s) (1 + alpha u + u^2)/(1 - beta u + u^2).

- Both factors are invariant under u -> 1/u: zeta's functional equation holds exactly (CERTIFIED at three
  points, relative width below 1e-40).
- Zeros of the factor: HQ3 at u = e^(+-A), s = 1/2 +- a + 2 pi i k/v; HQ4 at u = -e^(+-A),
  s = 1/2 +- a + (2k+1) pi i/v. Poles of both: u = e^(+-B), s = 1/2 +- b + 2 pi i k/v, simple where zeta does
  not vanish; the pole with k = 0 is real, in (1/2, 1).
- Log-derivative: nu(q^k) = v (1 + 2 q^(k/2)(cosh kB - cosh kA)) for HQ3 and
  v (1 + 2 q^(k/2)(cosh kB - (-1)^k cosh kA)) for HQ4; both exceed v = Lambda(q^k) because B > A. So
  nu >= Lambda >= 0, hence N >= 0, and a(n) >= 1 (exponential of a measure dominating that of zeta).
- The Dirichlet series converges absolutely for Re s > 1 (the factor's series in u converges for
  abs u < e^(-B), that is Re s > 1/2 + b).
- HQ4, local factor: sum_j a(q^j) y^j = (1 + alpha u + u^2)/((1 - beta u + u^2)(1 - y)) with u = sqrt(q) y has
  negative real zeros and positive real poles; by Edrei's theorem (CLASSICAL) the sequence a(q^j) is totally
  positive. Check: 3984 Toeplitz minors of order <= 3 per member, none negative.
- Members checked: HQ3 (2; 0.1, 0.2), (2; 0.3239252271, 0.4), (2; 0.03, 0.06), (3; 0.2, 0.3); HQ4 (2; 0.1, 0.2),
  (2; 0.3, 0.4), (3; 0.2, 0.3).

So {FE, INT, MULT, N >= 0, nu >= 0, local total positivity at every prime} has members with zeros off the
line. The only clause of Theorem P, of POS-FE and of Hamburger that they fail is the pole clause.

### 4.2 Lemma N (local Landau). PROVED.

Let m = R(u) be rational with R(0) = 1 and let G = zeta m have nu >= 0 at the powers of q. If R has a zero
in abs u < 1 (a zero of G right of the line coming from the factor), then R has a pole at a real point
u = r in (0, 1) with r <= abs z for every zero z of R. In s: a pole of G on the real axis at
1/2 + log(1/r)/v, at real part >= that of every zero of the factor.

Proof. -m'/m = v sum c_k u^k with c_k = sum over poles p of p^-k - sum over zeros z of z^-k (multiplicities
counted), and nu(q^k) = v (1 + q^(k/2) c_k). So c_k + q^(-k/2) >= 0. The series sum (c_k + q^(-k/2)) x^k has
non-negative coefficients; by Pringsheim's theorem its radius of convergence r is a singular point. The part
sum q^(-k/2) x^k is regular in abs x < sqrt q, and sum c_k x^k is singular exactly at the zeros and poles of
R; the smallest modulus of a zero is below 1 by hypothesis, so r < 1 and x = r is a zero or a pole of R, of
smallest modulus among them. Let the points of modulus r be the poles r e^(i phi_j) and the zeros
r e^(i theta_i). Then r^k (c_k + q^(-k/2)) = sum_j e^(-i k phi_j) - sum_i e^(-i k theta_i) + o(1) >= 0. The mean over k
of the trigonometric sum is (number of poles at angle 0) - (number of zeros at angle 0). A zero and a pole
cannot both sit at x = r. If x = r were a zero the mean would be negative, which contradicts
non-negativity up to o(1). So x = r is a pole. QED.

Consequences. (a) HQ2-type twins, with all poles of the factor on the critical line (abs u = 1), have signed
nu whenever the factor has an off-line zero: section 2 is an instance. (b) In the one-prime class,
{FE, INT, nu >= 0, no pole of G on the real segment (1/2, +inf) other than a simple pole at 1} implies that
every zero of the factor is on the line. The factor need not be 1: HQ1(q, eps), 0 < eps <= 4, has
c_k = 2 - 2 cos(k theta) >= 0, zeros on the line and double poles on the line (checked, `lemma3.json`). (c) The
lemma is Landau's theorem applied to the local Euler factor at q. It uses multiplicativity (the local factor
exists) and log-level positivity; the functional equation enters only to make the factor rational. It says
nothing about zeta, whose local factors have no zeros.

### 4.3 Lemma S (one prime: local zero-freeness). PROVED.

If m = R(u) is a one-prime symmetric multiplier (R(u) = R(1/u), R(0) = 1; rational by Lemma Q of c18) and R has
neither zero nor pole in abs u <= 1, then R = 1. In particular this holds if the local factor (1 - y)^-1 m has
log-coefficients b(q^k) << q^(k theta) with theta < 1/2 (Selberg's Euler-product axiom at q).

Proof. The zero and pole sets are invariant under u -> 1/u, so R has no zero or pole on the sphere; R is
constant, equal to R(0) = 1. Under the axiom, log R = sum d_k u^k with d_k = b'(q^k) q^(-k/2) << q^(k(theta - 1/2)),
which converges on abs u < q^(1/2 - theta), a disc containing abs u <= 1. QED.

Reading: in a one-prime twin the off-line zeros and the extra poles are zeros and poles of one local Euler
factor in Re s >= 1/2. A device that reads "each local factor is zero-free and pole-free in Re s >= 1/2"
(true for zeta, where the local poles are on Re s = 0) rejects every one-prime twin at a local step. That
step does not involve the strip for the global function.

### 4.4 Lemma F (finite prime sets, rational local factors) and Lemma C (geometric local factors). PROVED.

Lemma F. Let S be a finite set of primes, R_p rational with R_p(0) = 1 for p in S, m(s) = prod over p in S of
R_p(p^(1/2 - s)), and suppose m(s) = m(1 - s). Then each R_p satisfies R_p(u) = c_p R_p(1/u) with c_p = +-1 and
prod c_p = 1.

Proof. A root or pole u_0 of R_p gives the lattice of zeros or poles s = 1/2 - (log u_0 + 2 pi i k)/log p, on
one vertical line with spacing 2 pi/log p. Two such lattices belonging to different primes meet in at most
one point, because log p/log p' is irrational. The divisor of m is invariant under s -> 1 - s. The image of a
lattice of p is a lattice with the same spacing; apart from finitely many points it can only be matched by
lattices of the same prime. So for each p the divisor of R_p in u is invariant under u -> 1/u apart from
finitely many points of the lattices, hence exactly (a lattice is matched entirely or in at most finitely
many points). So R_p(u)/R_p(1/u) is a rational function without zeros or poles in C minus {0}: c_p u^(k_p). Then
prod c_p p^(k_p (1/2 - s)) = 1 for all s, so every k_p = 0 and prod c_p = 1; applying the relation twice,
c_p^2 = 1. QED.

Lemma C. Let G(s) = prod over p of L_p(p^-s) with L_p(y) = (1 - y)^-1 for p outside a finite set S and
L_p(y) = prod_{j <= d_p} (1 - alpha_(p,j) y)^-1 for p in S (any d_p >= 0, any complex alpha_(p,j) != 0; d_p = 1 for
all p is complete multiplicativity). If G has zeta's functional equation, then G = zeta.

Proof. m = G/zeta = prod over p in S of (1 - y_p)/prod_j (1 - alpha_(p,j) y_p) is meromorphic on C and
m(s) = m(1 - s). If for some p no alpha_(p,j) equals 1, the factor 1 - y_p vanishes on the lattice 2 pi i k/log p
of the line Re s = 0; poles of the same prime are at y_p = 1/alpha_(p,j) != 1 and poles of other primes meet that
lattice in at most one point each, so m has infinitely many zeros on Re s = 0. All zeros of m come from the
factors 1 - y_p' and lie on Re s = 0; none lies on Re s = 1. This contradicts the symmetry. So for every p in S
some alpha_(p,j) equals 1, and m = prod over p in S of prod' (1 - alpha_(p,j) y_p)^-1 over the remaining d_p - 1
factors. If one factor remains, abs m(sigma + it) tends to 0 as sigma -> -inf uniformly in t (abs y_p = p^-sigma -> inf),
while m(sigma + it) = m(1 - sigma - it) -> 1. So no factor remains and m = 1. QED.

What the three lemmas give together. For twins with finitely many modified primes and rational local
factors: (1) the multiplier splits into one-prime factors symmetric up to sign (a factor with c_p = -1 has a zero or a pole at u = 1, on the line); (2) each of these has its zeros and
poles as local data in Re s >= 1/2; (3) with geometric local factors there is no twin. No clause inside the
strip is used: no pole clause, no order clause, no positivity. Each hypothesis is needed: without the
functional equation the gauge twins U, WT, THIN, the sign chains, Dirichlet L-functions and finite DEL have
geometric local factors; without the geometric shape HQ1 to HQ4 have the functional equation; without
integer frequencies ZQ keeps every atom of log zeta (in the reading "on the atoms") and the functional
equation.

### 4.5 What is open

Q-inf. Is zeta the only Dirichlet series with zeta's functional equation (meromorphic on C, poles
unrestricted) and an Euler product whose local factors all have the geometric form (or: are all zero-free
and pole-free in Re s >= 1/2)? Lemma C answers yes when all but finitely many local factors are zeta's. The
proofs above use the lattice structure of the divisor of a finite product; for infinitely many modified
primes the product converges only in a right half-plane and the divisor in the strip is not a union of
lattices. Known theorems of this type (Hamburger; the degree-1 classification of the Selberg class,
Kaczorowski-Perelli, CLASSICAL, recalled) assume the pole clause. Proposition D of c18 (the hold set of
complete multiplicativity is not closed under locally uniform limits in the right half-strip) blocks the
passage from finite S to infinite S by a limit. A positive answer would be an identification theorem with
every hypothesis stated in Re s > 1 or at the level of the functional equation; like every identification it
would locate no zero of zeta.

## 5. Decisive numerical test

### 5.0 Method

Devices. (D) The band form N(theta) of c18-tz on m consecutive Fourier modes of [0, U], U = theta log T0, with
nodes tau_j = t_w + (j - (m-1)/2) 2 pi/U: Q/U = Arch + Pole - 2 Re A_prime, statistic s = lambda_min(Q/U)/Lg,
Lg = log(t_w/2 pi), pass at tolerance M iff lambda_min + 2M >= 0. m = 192, and m = 96 as the central
principal submatrix (the 96-mode space with the same centre). By Lemma L of c18-tz this is a Loewner matrix on
the nodes; at theta = 1 it is the matrix W of s3 combination 3 with X = T0 (same span, same nodes up to the
shift of the interval). (C) C(theta) of c15-u7: G(t) = Re L_F(1/2 + it; P = T0^theta), the gamma one-port and
Fejer-weighted prime sum of `stage.py`; statement: G >= -M.

Objects. For a one-prime factor with roots z_i and poles p_j in u, the prime side adds atoms at k v,
k v < U. With S_k = sum z_i^k (inverse-closed sets):
- HQ2 as written (zeta's Arch and zeta's pole term at s = 1): Q_zeta - 2 Re A[v (4 - S_k)].
- HQ2 with its own pole terms added (the form of the zeros alone; this is also the form of the entire
  function zeta(s)((1 - u)^4 + eps u^2)/u^2 with its conductor term): Q_zeta + 4 v Id + 2 Re A[v S_k].
- Pole lattice alone: 4 sum over k of the rank-one terms at 2 pi k/v = 4 v Id + 2 Re A[4 v] (Poisson
  summation; PROVED from the explicit formula for (1 - u)^4; positive semidefinite).
- HQ3 as written and with own poles added: atoms 2 v (cosh kB - cosh kA) and conductor term 2 v with atoms
  -2 v cosh kA.
- ZQ: zeta's form with the two zeros nearest t_w exchanged for 1/2 +- eta + i gbar (rank-one terms, as c18-tz),
  eta = the three offsets of HQ2 (2; 1e-6, 1e-4, 1e-2) and 0.05, 0.25.
- T-NR (3, 2.2): as c18-tz, with zeta's Arch and with its own conductor term 2 log 3.
For C(theta) the same atoms with the Fejer weight (1 - k v/U) and half the conductor terms.

Identity checks (`check_ident.py`, float64, four parameter sets, lattice sums over 400001 periods): pole
lattice against its atom form 9e-8 to 4e-7 (truncation of the lattice sum); zeros against atoms the same;
quartets minus 4 poles against the atoms v (4 - S_k): 3e-12 to 1e-10; C(theta) forms 4e-8 to 2e-7.

Arithmetic. Every prime sum is a ball sum over all prime powers n <= X = T0^theta at 128 bits (no a-priori
radius). Arch and pole terms: `tz.py` of c18-tz unchanged. Sign of lambda_min + 2M: "pos" if V^T (A + 2M) V
is strictly diagonally dominant with positive diagonal in balls, V the float eigenvector matrix and V^T V
certified invertible the same way; "neg" if the ball Rayleigh quotient of the lowest float eigenvector is
negative; otherwise "undecided". C(theta): float64 on a grid of step 0.004 over t_w +- 20, then the value at
each object's grid minimum recomputed in balls (radius at most 4.4e-14; float and ball values agree to 1e-7).
A negative ball value is a certified failure at that t; "passes" is a statement about the grid.

Check against the record: zeta at T0 = 1e6, m = 96, on the windows shared with c18-tz (t_w = 1e6 + 128 w):
lambda_min agrees with c18-tz in 96 of 96 cells to 6.6e-14 (their prime sums come from a moment engine in C;
these are direct ball sums).

Discarded run. The first unit multiplied a complex ball by a unit ball 191 times per prime power; the radii
grew by a factor 1.4 per step (wrapping), reached 0.03, and the midpoints drifted by 1e-8. It was stopped
after 2 minutes and its file deleted. The sums now restart from a direct exponential every 8 nodes (largest
entry radius 1e-28).

Sizes: heights T0 = 1e4, 1e5, 1e6; windows t_w = T0 + 128 w; theta in {0.55, 0.65, 0.75, 0.85, 0.95, 1.0} for (D)
and {0.5, 0.75, 1.0} for (C). Cells and counts: section 5.2.

### 5.1 What the device computes on HQ2 (PROVED; identity checks MEASURED)

For every band form the explicit formula gives, with P_q = 4 x (sum of the rank-one terms of the points
2 pi k/v on the line) >= 0 and Z_q = sum of the rank-one terms of the four zeros per period:

    Q(HQ2 as written) = Q(zeta) + Z_q - P_q,      Q(HQ2, own poles added) = Q(zeta) + Z_q.

So "as written" <= "own poles added" in the Loewner order, in every cell. The device reads HQ2 through two
terms: the off-line quartets (the target, as for ZQ) and the pole lattice, which enters with a negative
sign and is the pole clause in the device's own terms. For eps -> 0 at a fixed stage Z_q - P_q -> 0 (the
quartet collapses onto the pole): the atoms v (4 - S_k) are 2 eps v at k = 2 and stay below 1 until
k is of order eps^(-1/4), then grow like e^(k Re w). No other term occurs; in particular no step of a band
device reads the coefficient sign, the Euler product or integrality of HQ2 beyond the positions k v of the
atoms.

The matrix W of s3: `check_w3.py` compares `w3.build_box` (float64, family ZETA, X = T0) with U times the band
form of `dev.py` at theta = 1 on the same nodes: equal after conjugation by diag((-1)^a), largest entry
difference 3.3e-10, 3.8e-10, 6.0e-9 (entries up to 182) in three cases. The theta = 1 columns below are the W
device.

### 5.2 Counts (CERTIFIED signs)

Band device: 288 cells (3 heights x 16 windows x 6 theta), each at m = 192 and m = 96, 38 objects: 21888
object-cells; HQ3 run: 144 cells (8 windows), 9 objects: 2592 object-cells. 48960 sign decisions (M = 0 and
M = 1), 2046 undecided, every one with abs(lambda_min) <= 9e-15 Lg: 1712 are the pole lattice alone at M = 0
(exact null directions), 268 are zeta at M = 0 with theta >= 0.85 (178 in the main run, 90 in the HQ3 run; the
smallest eigenvalue is 0 to float precision because the node count exceeds the number of zeros in the
window), 66 are HQ2 as written at M = 0.
C(theta): 72 cells (3 heights x 8 windows x 3 theta), 35 objects: 2520 records, each with a ball value at
the grid minimum.

zeta: 576 object-cells; M = 1: 576 certified positive; M = 0: 398 certified positive, 178 undecided, 0
negative; all 288 object-cells with theta <= 0.75 certified positive at M = 0. C(theta): grid minimum positive
in 72 of 72 cells (medians at 1e6: 2.19, 0.34 at theta = 0.5, 1.0).

Pole lattice alone (P_q, q = 2, 3, 101; 1728 object-cells): smallest eigenvalue between -9e-15 Lg and
+1.3e-10 Lg (float); never certified negative; 16 certified positive and 1712 undecided at M = 0; certified
positive at M = 1 in every cell. This is the Poisson identity of section 5.0
in the certified data.

HQ2 as written against HQ2 with own poles added, all 9 members, both mode counts (5184 pairs per M):

| M | both positive | as written negative, own poles positive | both negative | as written undecided, own positive | as written positive, own negative |
|---|---|---|---|---|---|
| 0 | 2075 | 801 | 2242 | 66 | 0 |
| 1 | 3370 | 455 | 1359 | 0 | 0 |

The middle column is the pole clause acting alone: in 801 (M = 0) and 455 (M = 1) certified pairs the form of
the zeros of HQ2 is positive (the off-line zeros are not seen at that stage) and the device rejects HQ2
only through the term -P_q. The last column is empty, as the Loewner order requires.

By eps (q = 2, theta <= 0.85, 384 pairs each; M = 0 / M = 1):

| eps | distance of the zeros from the line | both positive | as written negative only | both negative |
|---|---|---|---|---|
| 1e-8 | 0.0102 | 365 / 384 | 19 / 0 | 0 / 0 |
| 1e-6 | 0.0323 | 357 / 384 | 27 / 0 | 0 / 0 |
| 1e-4 | 0.1021 | 308 / 384 | 76 / 0 | 0 / 0 |
| 1e-3 | 0.1816 | 173 / 287 | 133 / 67 | 78 / 30 |
| 1e-2 | 0.3239 | 6 / 32 | 93 / 114 | 285 / 238 |
| 1e-1 | 0.5809 | 0 / 0 | 0 / 0 | 384 / 384 |

(The member eps = 1e-1 has its zeros at real part 1.081, outside the strip; it is listed as the large-eps end
of the family only.) HQ2 with zeros at distance 0.10 from the line passes N(theta) at M = 1 in every window
at every height and theta <= 0.85, on 96 and on 192 modes; at distance 0.18 it passes in 287 of 384.

Thresholds per cell type: `summary_tables.md`, last table. Extract at T0 = 1e6, m = 192, 16 windows (windows
certified positive at M = 0 / at M = 1):

| object | theta = 0.55 | 0.65 | 0.75 | 0.85 | 0.95 | 1.0 (W) |
|---|---|---|---|---|---|---|
| zeta (M = 0; rest undecided) | 16 | 16 | 16 | 16 | 0 | 0 |
| HQ2 (2, 1e-6) as written | 16/16 | 16/16 | 16/16 | 16/16 | 0/16 | 0/16 |
| HQ2 (2, 1e-4) as written | 16/16 | 16/16 | 16/16 | 2/16 | 0/14 | 0/2 |
| HQ2 (2, 1e-4) own poles | 16/16 | 16/16 | 16/16 | 16/16 | 0/16 | 0/16 |
| HQ2 (2, 1e-3) as written | 16/16 | 4/16 | 0/0 | 0/0 | 0/0 | 0/0 |
| HQ2 (2, 1e-3) own poles | 16/16 | 16/16 | 10/16 | 0/0 | 0/0 | 0/0 |
| HQ2 (2, 1e-2) as written | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| HQ2 (2, 1e-2) own poles | 1/10 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| HQ2 (3, 1e-2) as written | 16/16 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| HQ2 (3, 1e-2) own poles | 16/16 | 16/16 | 1/8 | 0/0 | 0/0 | 0/0 |
| HQ2 (101, 1e-2) as written | 16/16 | 16/16 | 16/16 | 16/16 | 0/16 | 0/16 |
| ZQ eta = 0.032 | 16/16 | 16/16 | 16/16 | 4/16 | 0/16 | 0/16 |
| ZQ eta = 0.102 | 16/16 | 14/16 | 7/16 | 0/11 | 0/3 | 0/0 |
| ZQ eta = 0.25 | 10/15 | 1/2 | 0/0 | 0/0 | 0/0 | 0/0 |
| T-NR (3, 2.2), own conductor term | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |

HQ3 (`dev3.py`, 8 windows, T0 = 1e6, m = 192; windows certified positive at M = 0 / M = 1):

| member (q; a, b) | form | theta = 0.55 | 0.65 | 0.75 | 0.85 | 0.95 | 1.0 |
|---|---|---|---|---|---|---|---|
| (2; 0.03, 0.06) | as written | 8/8 | 8/8 | 8/8 | 4/8 | 0/8 | 0/8 |
| (2; 0.03, 0.06) | own poles added | 8/8 | 8/8 | 8/8 | 8/8 | 0/8 | 0/8 |
| (2; 0.1, 0.2) | as written | 6/8 | 0/5 | 0/0 | 0/0 | 0/0 | 0/0 |
| (2; 0.1, 0.2) | own poles added | 8/8 | 8/8 | 5/8 | 0/7 | 0/1 | 0/1 |
| (3; 0.2, 0.3) | as written | 0/3 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |
| (3; 0.2, 0.3) | own poles added | 8/8 | 0/4 | 0/0 | 0/0 | 0/0 | 0/0 |
| (2; 0.324, 0.4) | both forms | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 | 0/0 |

Poles off the line at distance b enter with atoms of size e^(k b v) and are seen earlier than the zeros at
the smaller distance a. The log-level positive sibling passes finite stages in the same way as HQ2. Full
table: `dev3_table.md`.

C(theta), T0 = 1e6, 8 windows (median of the grid minimum; windows with certified negative value / value < -1):

| object | theta = 0.5 | theta = 1.0 |
|---|---|---|
| zeta | 2.19 [0/0] | 0.34 [0/0] |
| HQ2 (2, 1e-6) as written | 2.19 [0/0] | 0.34 [0/0] |
| HQ2 (2, 1e-4) as written | 2.19 [0/0] | -0.23 [8/0] |
| HQ2 (2, 1e-4) own poles | 2.88 [0/0] | 0.48 [0/0] |
| HQ2 (2, 1e-3) as written | 2.18 [0/0] | -10.4 [8/8] |
| HQ2 (2, 1e-3) own poles | 2.82 [0/0] | -2.94 [8/8] |
| HQ2 (2, 1e-2) as written | -0.07 [4/1] | -85.2 [8/8] |
| HQ2 (2, 1e-2) own poles | 2.56 [0/0] | -57.5 [8/8] |
| HQ2 (3, 1e-2) as written | 1.97 [0/0] | -17.4 [8/8] |
| ZQ eta = 0.032 | 2.15 [0/0] | 0.34 [0/0] |
| ZQ eta = 0.102 | 2.14 [0/0] | -0.50 [8/0] |
| ZQ eta = 0.324 | 1.65 [0/0] | -29.0 [8/8] |
| T-NR (3, 2.2), own conductor term | 0.90 [1/0] | -72.2 [8/8] |

Over all C(theta) pairs (648): both positive on the grid 434; as written certified negative with own-pole form
positive on the grid 75; both certified negative 139; the reverse 0. Tables for 1e4 and 1e5:
`summary_tables.md`, `cth_table.md`.

### 5.3 Reading of the test

- Finite stages are passed. At every height and every theta <= 0.85 run, members of HQ2 with zeros at
  distance 0.03 to 0.10 from the line pass N(theta) at M = 1 in every window, and at M = 0 in most windows
  (365, 357, 308 of 384 for eps = 1e-8, 1e-6, 1e-4); at theta = 1 (the W device) zeta has no margin and HQ2
  passes at M = 1 up to eps = 1e-6 (1e6) or 1e-4 (1e4, 1e5). This is Proposition F of c18 in measured form
  (R4): exact functional equation, multiplicativity and coefficients >= 1 do not make the off-line zeros
  visible at a finite stage.
- The two columns separate "pole" from "zeros". 801 certified pairs at M = 0 (455 at M = 1, 75 for C(theta))
  fail only through the pole lattice. With the pole lattice compensated, HQ2 is read like ZQ, through the
  distance of the off-line zeros: at 1e6 on 192 modes, (2, 1e-4) (distance 0.102) with own poles is positive
  in more cells than ZQ at eta = 0.102 (table above). ZQ exchanges two on-line zeros for one pair; HQ2 adds
  two pairs per period and removes nothing, so the comparison is of order of magnitude only.
- The table does not separate "multiplicativity". T-NR (multiplicative, integer frequencies, no functional
  equation, off-line zeros at distance 0.40) with its own conductor term is certified positive only at
  (1e4, theta = 0.55) at M = 1 (32 of 32 object-cells; 0 at M = 0). HQ2 (2, 1e-2) as written (distance 0.32;
  multiplicative with the functional equation) is certified positive only at the same place (6 of 32 at
  M = 0, 32 at M = 1). ZQ at eta = 0.25 and 0.324 (functional equation, not multiplicative) is positive in
  part of the cells with theta <= 0.75 and in none above. The devices order the controls by the distance
  of the off-line zeros and by the pole lattice, not by any of FE, INT, MULT, N >= 0.
- No cell contradicts the classification of rows 6 to 8: class (ii) below the threshold, pole clause and
  target above it. No class (iii) entry arises from the numerical devices.

## 6. Controls (walls of the brief)

This lane proposes no argument for RH; the controls enter as columns of the tables.
- DH: not run here (it lacks zeta's functional equation; c18-tz has it on the same device).
- Backward heat: no Dirichlet series; not formulable on a prime-side device (c18-tz, "not run").
- Sign twist, unimodular twist: c18-tz ran 24 chains and the Liouville twist on N(theta); not repeated.
- ZQ, T-NR, HQ2, HQ3: section 5. E_a: c18-tz.
- Against Lemma C (the only statement here with a conclusion): DH fails the Euler product; sign and
  unimodular twists, Dirichlet characters, finite DEL, T-NR and E_a fail the functional equation; HQ1 to HQ4
  and T-NR fail the geometric local shape; ZQ and backward heat are not ordinary Dirichlet series; Beurling
  systems fail integer frequencies. Each control fails a hypothesis. This is what an identification does
  and is not counted as R3.

## 7. Requirement flags and evidence

- R1 (all primes together, multiplicativity essential): **false**. Lemma C uses the Euler-product shape
  essentially (HQ2 shows the conclusion fails without it), but for finitely many modified primes only, and
  it is an identification. Lemma N uses one local factor.
- R2 (height-uniform, every window): **false**. The lemmas have no height. The numerical cells are finite.
- R3 (fails for every control at a structural step): **false**. No argument with a conclusion about zeros
  is proposed. On the band devices HQ2 passes at small eps (class (ii) at finite stages).
- R4 (reaches the critical line): **false**. Lemmas S, F, C use no clause inside the strip, and their
  conclusion is G = zeta.

## 8. Registered outcome and the candidate for the planner

Class (iii) list (the step HQ2 fails is not the pole clause and HQ2 does not pass):
- (iii-a) rows 3: sign of nu at powers of q. Removed by the sibling HQ3; reduces to class (i). Not a new
  device type.
- (iii-b) rows 5, 16, 17, 18, 20: local shape at q. Row 16 is removed by HQ4. Rows 5, 17, 18, 20 are forced
  for finitely many primes (Lemma S with Lemma F).
- (iii-c) rows 13, 14, 15: complete multiplicativity at q. Forced for finitely many primes (Lemma C).

Candidate (explore): **Euler-shape rigidity without the pole clause.** Statement to decide: question Q-inf of
section 4.5. First lemma: extend Lemma F from finite S to a set S with sum over p in S of p^(-1/2) finite
(then the product of the local factors converges on Re s > 1/2 and the divisor in the open right half of
the strip is still a union of lattices; the left half follows by the symmetry). Kill test: a twin with
infinitely many modified primes, geometric local factors and zeta's functional equation; a search space is
products of the gauge type prod (1 - p^-s)/(1 - alpha_p p^-s) with abs alpha_p = 1 and alpha_p -> 1 fast. Caution
for the planner: the conclusion is an identification (device type exact-uniqueness, rows L2, P6, closed as a
route to zeros); its use would be as a screen statement: "no control with zeta's functional equation and an
Euler product of geometric shape exists", which would change the pre-filter for devices reading local
shape (rows 5, 13 to 18), not locate a zero.

Second item for the record lane: HQ3 and HQ4 as control codes beside HQ2 (HQ3: log-level positive; HQ4:
log-level positive with totally positive local factor).

## 9. Three weakest steps

1. Device table, rows 10, 11, 12, 18 (spinor causal S, rank-2 apex kernel D10, Bost-Connes state positivity,
   7/8 architecture) are ARGUED from the recorded decisive step; none of the four devices was run on HQ2.
   For D10 the Gram form with order-4 poles of the inserted coefficient on Re u = 1/2 was not computed; if it
   turns out positive the row moves from class (i) to class (ii), not to class (iii). For row 18 the proof of
   the 7/8 theorem was not traced; "the size inputs fail at q" is the first hypothesis HQ2 violates, not a
   located step. The list of 20 rows is a selection by the author from 56 devices; a device reading the
   four inputs may have been left out.
2. Lemmas F and C cover finitely many modified primes with rational local factors, and are author-only.
   The statement "class (iii-b), (iii-c) is forced" rests on them and says nothing for infinitely many
   modified primes (question Q-inf). The reading "the local-shape step reads multiplicativity jointly with
   the functional equation" is the author's; its content is an identification, and section 8 says so.
   Lemma N is proved for rational one-prime factors only.
3. Numerics. "Passes" for C(theta) is a statement on a grid of step 0.004 (only the value at the grid minimum
   is a ball). 2046 of 48960 sign decisions are undecided, among them every zeta cell at theta >= 0.95 on 192
   modes at M = 0. Arch and pole terms come from `tz.py` of c18-tz (one referee) and are checked here only
   through agreement with c18-tz (96 cells, 7e-14), with s3's W (6e-9) and through the certified
   positivity of zeta; the atom identities are proved by hand and checked in float64 to 1e-7. The
   comparison with ZQ is not matched (one exchanged pair against a lattice of quartets), the eps list is
   coarse (decades), q is 2, 3, 101 only, and the heights stop at 1e6: the thresholds are descriptive.

## 10. Files

`hq2.py` (roots, power sums, coefficients), `lemma1.py`/`.json` (first lemma), `lemma2.py`/`.json` (sign of nu
for HQ2; HQ3), `lemma3.py`/`.json` (HQ4, HQ1), `check_ident.py`/`.json` (atom identities), `check_w3.py`/`.json` (s3 matrix W against the band form), `counts.py`/`counts.json` (pair counts of section 5.2), `tz.py` (copy from
c18-tz), `dev.py` (band device; server), `dev3.py` (HQ3 on the band device; server), `cth.py` (C(theta);
server), `dev.jsonl`, `dev3.jsonl`, `cth.jsonl` (one record per object and cell), `agg_dev.py`, `agg_cth.py`,
`summary.py`, `dev_table.md`/`.json`, `dev3_table.md`/`.json`, `cth_table.md`/`.json`, `summary_tables.md`,
`MAP_ROW.md`, `lanes.jsonl`.
