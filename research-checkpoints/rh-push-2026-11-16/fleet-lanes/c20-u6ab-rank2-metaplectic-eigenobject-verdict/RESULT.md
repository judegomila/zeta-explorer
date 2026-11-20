# c20-u6ab-rank2-metaplectic-eigenobject-verdict: RESULT

Date 2026-11-20. Round 20, kind: deepen (cells U6 (a) and U6 (b) of `campaign/STRATEGY.md` section 4.0).
Scope: this directory only. The compute server was not used: the decisive test is a paper table and the one
numerical check runs in seconds locally (`checks.py`, mpmath 30 digits, through `scripts/memcap.sh 8`).
Nothing committed or pushed. No statement about zeros of zeta is made. No independent referee has read this
file (referees = 0; `REFEREE.md` is a self-check and says so).
Requirement flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (complete argument here) / PROVED-rel (complete given a named recalled theorem) / CLASSICAL /
RECALLED (source named, not opened) / CHECKED (numeric check of a displayed identity, not ball arithmetic) /
MEASURED (float sample) / ARGUED / OPEN.

## 0. Verdict

**Precise obstruction. No candidate device comes out of either cell; score 0.**

- U6 (a), linear groups: closed. For Eisenstein series on GL(n) induced from a maximal parabolic, zeta at an
  argument of real part in (1/2, 1) is read in exactly two ways: as a numerator zero of an intertwining ratio
  (one exponent of the constant term drops out) and through the pole or residue at 1. No square-integrability,
  unitarity, truncated-norm positivity or Rankin-Selberg exponent count on these objects gives a condition on
  the real part of the zero that is not an identity in the parameter (Lemmas 1 to 5). The controls EIS-w, E_a,
  BLS, T-NR (scattering form) and ZQ (scattering form) pass every formulable step (section 4).
- U6 (a), double cover: closed as ARGUED, not proved. The constant term is the linear constant term at the
  doubled (Shimura) parameter (RECALLED); the Fourier coefficients are family series in quadratic twists, not
  Euler products in the family variable (ARGUED from the rank-one case of row G39).
- U6 (b): no candidate norm. Lemma K (PROVED, elementary): a Hecke-invariant subspace of finite codimension
  contains every Eisenstein series except at most that many parameter pairs, so a space that contains exactly
  the resonance states has infinite codimension and its Hecke spectrum is the zero set by construction. The
  cell is reduced to one named form (section 5); nothing in it is a lead.
- One item is not closed by this lane and is not new: truncated-norm positivity of the degenerate
  P_(2,1) series (object O2) is the wall residue of the rank-2 Gram form of row D10, which is "tried, not
  closed" (section 3.4).

## 1. Plan; what is new against the record

On file: rank one closed for any cover, level, vector (rows G35, G39, G40); Borel data in any rank (G35,
Lemma T of G40); isobaric sums with cuspidal data ARGUED only (G40, referee error 5); rank-2 Borel Gram
positivity D10 (open closure question); norms on resonance states, four families (G37). "No candidate object
in rank >= 2 non-Borel" in both cell entries.

Done here: the first lemma of the assignment (constant term and first coefficient of maximal-parabolic
series as ratios of L-values, section 2), a list of all places where zeta in the strip is read (Lemma 1), and
four tests of conditions at parameter rho (L2: Lemma 2; unitarity: Lemma 3; truncated-norm positivity:
Lemma 4; Rankin-Selberg count: Lemma 5). New to the record: Lemma 4 (the first linear non-Borel object that
reads zeta in the strip, P_(2,2) on GL(4) with datum f x f, has rank-one Maass-Selberg form with scattering
coefficient M_zeta times an inner function, that is, it is a realised member of control BLS); Lemma 5 as a
proved statement for isobaric sums (it replaces the ARGUED clause T4 of G40 for the count); Lemma K for
cell (b). All of it is classical in content.

The geometric reading of the pointer (double cover as the metaplectic cover, twin ladder as the Hecke ladder,
`ramanujan-cube-satake-point`): on every object below the Satake point is a fixed affine function of the
parameter, so "the Satake point lies in the Ramanujan cube" is "the parameter is on the unitary axis"
(Lemma 3). The Hecke relations are satisfied at every parameter.

## 2. First lemma: the objects and their coefficients

Notation: xi*(s) = pi^(-s/2) Gamma(s/2) zeta(s); Lambda(s, .) completed L-functions; f a Hecke-Maass cusp
form of SL_2(Z) (self-dual); rho = beta + i gamma a zero of zeta, 0 < beta < 1.

**O1. P_(2,1) on GL(3), cuspidal datum f.** (RECALLED: Langlands, Euler Products; Shahidi 1981; Goldfeld,
Automorphic forms and L-functions for GL(n,R), section 10.9.) Constant term along P_(2,1): f |det|^z-part;
along P_(1,2): M(z) times the dual datum, M(z) = Lambda(z, f)/Lambda(1 + z, f), unitary axis Re z = 0. Constant
term along the Borel: zero. First Fourier-Whittaker coefficient: product of local Whittaker functions divided
by Lambda(1 + z, f); Hecke eigenvalues are those of the isobaric sum of f and a character,
A(p, 1) = lambda_f(p) p^(-z/3) + p^(2z/3) up to the normalisation of z. No value of zeta occurs. Zeta enters
only through <f, f>, a multiple of the residue of L(s, f x f) at 1 (residue read; closed).

**O2. P_(2,1) on GL(3), trivial datum (degenerate series; Epstein zeta of ternary forms).** PROVED and
CHECKED. For Q = diag(t1, t2, t3), det 1, Lambda_Q(u) = pi^(-u) Gamma(u) sum over v != 0 of Q(v)^(-u):

  Lambda_Q(u) = 2 xi*(2u) t1^(-u) + 2 xi*(2u - 1) t1^(-1/2) t2^(1/2 - u) + 2 xi*(2u - 2) (t1 t2)^(-1/2) t3^(1 - u)
                + terms exponentially small in sqrt(t2/t1), sqrt(t3/t2)

(Poisson summation in one and then two variables). Functional equation u -> 3/2 - u with Q -> Q^(-1).
`checks.py` part A: at t = (1/36, 1, 36) and (1/49, 7/5, 35) the residual is 1e-16 to 5e-13 at six parameters
(sizes of the terms 1e-7 to 1), and the term that should vanish is below 1e-34 at 2u = rho_1, 1 + rho_1,
2 + rho_1, 1 + rho_3. The representation is not generic (induced from a character of P_(2,1); CLASSICAL), so
there is no Fourier-Whittaker coefficient; the degenerate coefficients are divisor sums times Bessel
functions with no zeta factor in this normalisation. In exponent form, with x = (2/3)(Re u - 3/4) and
mu_A = (x - 1/2, x + 1/2, -2x), mu_B = (x - 1/2, -2x, x + 1/2), mu_C = (-2x, x - 1/2, x + 1/2):
coefficients xi*(2u), xi*(2u - 1), xi*(2u - 2) on mu_A, mu_B, mu_C; unitary axis x = 0.

**O3. P_(2,2) on GL(4), datum f x f.** (RECALLED, same sources.) Constant term along P_(2,2):
phi + M(z) w phi, M(z) = Lambda(z, f x f)/Lambda(1 + z, f x f)
= [xi*(z)/xi*(1 + z)] [Lambda(z, Ad f)/Lambda(1 + z, Ad f)]; other constant terms zero. First Fourier-Whittaker
coefficient: normalised by 1/Lambda(1 + z, f x f). This is the lowest-rank linear non-Borel object in which
zeta at an argument in the strip occurs (as the numerator xi*(z)). With datum f x g, g != f: Lambda(z, f x g),
no zeta.

**O4. Double cover of GL(3), maximal parabolic, datum the theta function or a half-integral weight cusp form
on the cover of GL(2).** RECALLED, not opened (Kazhdan-Patterson 1984 for the Borel case: intertwining ratios
zeta(2 s_alpha)/zeta(2 s_alpha + 1) up to finitely many factors; Gao 2018 for general parabolics: the ratio is
L(w, sigma')/L(w + 1, sigma') for the dual-group datum sigma' of the cover). For a cusp datum sigma' is the
Shimura lift F: ratio in L(., F), no zeta. For the theta datum sigma' is the trivial representation of GL(2):
the coefficients are those of O2 at a doubled parameter. Fourier coefficients: ARGUED from the rank-one
formula of row G39 (A(m, s) carries L(2s - 1/2, chi_m)/zeta(4s - 1), and zeta(u)/zeta(2u) on square indices):
family series in quadratic twists; for a cusp datum, sums of half-integral weight coefficients (central
values of twists of F by Waldspurger; positivity at the centre of a self-dual twist, row G32). The Borel
series on the cover has as Whittaker coefficients the quadratic A_2 double Dirichlet series
(RECALLED: Brubaker-Bump-Friedberg), a family sum of L(s, chi_d), not an Euler product in d.

**Lemma 1 (read set; PROVED-rel the formulas above).** On O1 to O3, as functions of the parameter, zeta at an
argument w with 1/2 < Re w < 1 occurs only (i) as a numerator of an intertwining coefficient, so a zero of zeta
removes one exponent from the constant term and changes nothing else; (ii) never as a denominator in the
closed positive chamber (denominators are at real part >= 1; non-vanishing there is the classical Eisenstein
proof of zeta(1 + it) != 0 and its Shahidi form); (iii) through the pole at argument 1 and its residues
(Speh / residual objects; <f, f>). Reads (iii) are closed devices. So a condition "other than through a pole
or residue" can only be a condition on an object with one exponent removed.

## 3. Conditions at parameter rho

### 3.1 Lemma 2 (square-integrability; PROVED for O2, PROVED-rel for O1, O3)

No zero-indexed object among O1 to O3 is square-integrable, for any position of the zero in the open strip.

O2: an exponent mu is square-integrable iff mu_1 < 0 and mu_1 + mu_2 < 0 (Langlands' criterion, CLASSICAL):
A iff x < 0, B iff -1/2 < x < 1/2, C iff x > 0. Three zero cases:
2u = rho: x = beta/3 - 1/2 in (-1/2, -1/6), A removed, C survives and fails.
2u = 1 + rho: x = (beta - 1/2)/3, B removed, A needs x < 0 and C needs x > 0: never both.
2u = 2 + rho: x = beta/3 + 1/6 in (1/6, 1/2), C removed, A survives and fails.
The surviving non-L2 coefficient is xi*(rho - 2) = xi*(3 - rho), xi*(1 + rho) or xi*(2 - rho), xi*(2 + rho):
non-zero by the Euler product. This is the rank-2 form of Proposition E of row G40 ("the single missing
hypothesis is xi(2 - rho) = 0"). `checks.py` part B: 57 cases, none square-integrable.

O1, O3: the single exponent that survives a numerator zero is the identity term with Re z > 0, in the
positive chamber. In general: a square-integrable eigenform generates a unitary representation, so its
parameter is Hermitian (Lemma 3), and for GL(n) the discrete spectrum is cuspidal or Speh (Moeglin-Waldspurger,
RECALLED) with half-integral real shifts, produced by the pole at 1 only.

Same for EIS-w (the same series at a parameter that is not a zero): all exponents present, never L2 off the
real segment. The condition does not read the zero.

### 3.2 Lemma 3 (unitarity / Ramanujan cube; PROVED)

The Satake multiset at p is Hermitian (closed under alpha -> 1/conj(alpha)) for all p:
O1: iff Re z = 0. O3: iff Re z = 0 or z real (f tempered or not). At z = rho: never. No value of beta is singled out.
O2: iff x = 0 or the trivial point. In the three zero cases: 2u = rho and 2u = 2 + rho never;
**2u = 1 + rho: iff beta = 1/2.**
So "the representation generated by Lambda_Q((1 + rho)/2) is Hermitian" is equivalent to beta = 1/2. This is
an identity in the parameter (x = (beta - 1/2)/3), of the same kind as the weight-1/2 object of row G39
(tempered iff beta = 1/2) and the dictionary line of G40. It is a restatement of the target, not a device:
Hermitian parameters are forced only for square-integrable forms (Lemma 2: never), and EIS-w, the series
Lambda_Q((1 + w')/2) at any w' with Re w' != 1/2, is an automorphic form of moderate growth with all Hecke
relations and a non-Hermitian parameter. The only difference at a zero is the missing exponent mu_B.
No theorem on file or recalled turns a missing exponent into a Hermitian form.

### 3.3 Lemma 4 (truncated-norm positivity on O1, O3; PROVED-rel Langlands' inner product formula)

O1 (P_(2,1) and P_(1,2) associate, not self-associate): no cross terms, and
norm^2 of the truncation = <f, f> (T^(2x) - abs(M(z))^2 T^(-2x))/(2x), x = Re z > 0. Positivity for all
admissible T is boundedness of M = Lambda(z, f)/Lambda(1 + z, f) in Re z > 0: M is inner, a Blaschke product
over all zeros of L(., f) in the strip wherever they are. No zeta.

O3 (self-associate, w phi = phi because both factors are f): the formula has the four terms of the SL_2
case with the scalar m(z) = M_zeta(z) Theta_f(z), M_zeta = xi*(z)/xi*(1 + z),
Theta_f = Lambda(z, Ad f)/Lambda(1 + z, Ad f). Theta_f is analytic in Re z > 0 (Lambda(., Ad f) entire by
Gelbart-Jacquet, RECALLED; the denominator is at real part > 1), of modulus 1 on Re z = 0 (functional equation
and real coefficients), bounded by 1 (Phragmen-Lindelof), with no exponential factor (decay x^(-3/2) on the
real axis): a Blaschke product over the zeros of Lambda(., Ad f). So the truncated-norm inequality of O3 is
the rank-one inequality (I) of row D9 for S = T^(-z) M_zeta Theta_f. **O3 is a realised member of control
BLS**, the inserted zeros being those of an L-function.

Content of the inequality for the zeros of zeta: none. M_zeta = [(z + 1)/(z - 1)] B_zeta(z), B_zeta the
Blaschke product over the zeros of zeta (all have Re > 0 in this variable, non-real conjugate pairs).
The base S_0 = T^(-z)(z + 1)/(z - 1) is in the class of Theorem B of D9: z(1 - S_0)/(1 + S_0) is the
logarithmic derivative at the right end of the solution of -u'' = -z^2 u on an interval of length (log T)/2
with the Robin condition u'(0) = -u(0), a Weyl function (CLASSICAL; equal to the constant -1 at T = 1).
By Theorem C of D9 (closure under Blaschke factors over non-real conjugate pairs, and limits) every
S = T^(-z) [(z + 1)/(z - 1)] B, B over any non-real conjugate pairs in Re z > 0, satisfies (I). So (I) for O3
holds for every placement of the zeros of zeta and of the non-real zeros of L(., Ad f).
`checks.py` part C (MEASURED, diagonal of (I), 4000 random points, T in [1, 11]): base min -1e-29 (the
equality case T = 1), base times 1 to 6 random pairs min 4e-6 > 0, sign control -M min -84 (fails, as in D9).
Caveat: if Lambda(., Ad f) has a real zero of odd multiplicity in (0, 1), the base contains a single real
Blaschke factor, which Theorem C does not cover (the sample with one real factor stayed >= 0 on the
diagonal; diagonal only).

A second consequence: any condition on O3 at m(z_0) = 0 is a condition on the zero set of
zeta(s) L(s, Ad f); the object does not separate the two factors.

### 3.4 Truncated-norm positivity on O2: not closed here

O2 is the residue of the Borel series of GL(3) on a wall, so its truncated norm is a wall residue of the
rank-2 Gram form of row D10 (state: tried, not closed; Lemma R reads the functional equation; BLS-sym passes,
MEASURED and exact in the rational model). A limit of non-negative forms is non-negative, so wherever a
control passes D10 on the open chamber it passes here (ARGUED). The two-exponent form at 2u = 1 + rho
(coefficients xi*(1 + rho) and xi*(2 - rho), of equal modulus iff beta = 1/2) was not derived: the
regularised formula for residual data has derivative terms and was not opened. This inherits D10's state and
by the note in D10 cannot score.

### 3.5 Lemma 5 (Rankin-Selberg exponent count on isobaric sums; PROVED-rel Jacquet-Shalika)

Let Pi = sum of pi_i |.|^(w_i), pi_i unitary cuspidal on GL(n_i), with local parameters of pi_i at every place
of exponent at most theta_i. L(s, Pi x conj-dual Pi) = product over (i, j) of L(s + w_i - conj(w_j), pi_i x dual pi_j).
Poles (Jacquet-Shalika, RECALLED): only for pi_i = pi_j up to a unitary twist, at real part
1 - Re(w_i - w_j). Local and gamma poles: at real part at most theta_i + theta_j - Re(w_i - w_j). With
d = max Re(w_j - w_i) over pairs with pi_i = pi_j: rightmost pole P = 1 + d, rightmost local pole
beta_0 <= d' + theta_i + theta_j with d' the maximum over all pairs. For data built from one pi (O3, and O2 /
Borel with pi trivial, theta = 0): P - beta_0 >= 1 - 2 theta, independent of every w_i. The Luo-Rudnick-Sarnak
count therefore returns a bound on theta (the cuspidal datum's own exponent) and no condition on the shifts
w_i, hence none on beta. This is Lemma T of G40 extended from torus parameters to isobaric sums; it replaces
the ARGUED clause there for this count (not for the other eleven catalogue entries).

## 4. Stage A table (decisive test)

Steps: S1 the object exists with the Hecke relations at the parameter; S2 scattering coefficient of modulus 1
on the axis (functional equation); S3 analytic in the open positive chamber except the pole at 1;
S4 truncated-norm inequality (I) (O1, O3); S5 Rankin-Selberg count; S6 a condition that depends on the real
part of the zero. "Scattering form" means the control's completed function inserted in M = F(z)/F(1 + z).

| Control | Form in which it is run | First step it fails | Status |
|---|---|---|---|
| EIS-w (same series, parameter not a zero) | group object | none; S6 does not exist for it or for zeta | PROVED (Lemmas 2, 3, 4) |
| E_a = zeta(s + a) zeta(s - a) | group object: O1 with f replaced by E(., 1/2 + a), that is the Borel series of GL(3) by induction in stages; M has zeros at real part 1/2 +- a | none (S4 is a truncated norm of a group object; row D9 lists E_a as passing as a group object) | PROVED-rel induction in stages |
| BLS | scattering form; realised by O3 itself (Theta_f) | none | PROVED (Lemma 4; D9 Theorem C) |
| T-NR (c > 2, b < 1/2) | scattering form, factor D(z)/D(z + 1) a Blaschke product (section 2 note of the map) | none | PROVED (D9) |
| ZQ | scattering form: M_zeta m(z)/m(z + 1); two on-line Blaschke pairs exchanged for an off-line quartet | none (Lemma 4: base times any non-real pairs) | PROVED-rel D9 Theorem C |
| DEL, THIN, sign twists, U | scattering form | S2 (no functional equation: modulus not 1 on the axis) | PROVED; the step is the functional equation, not multiplicativity |
| HQ2 (HQ family; HQ3, HQ4 are not defined in the map and were not run) | scattering form | S3 (poles of order 4 on Re s = 1/2, in the open chamber) | PROVED; the step is analyticity, the pole clause |
| DH | scattering form | S3 at zeros of DH with real part > 1 (poles of M in 0 < Re z < 0.1204); below height 2000 none was found on the D9 grids | CLASSICAL (existence of such zeros); the step is the Euler product in the denominator, the classical non-vanishing on Re s >= 1 |
| NR-vec, HEAT | not formulable on these objects | - | not run |

Reading: the only structural failure that uses the Euler product (DH at S3) is the classical statement at
real part >= 1. EIS-w, E_a, BLS, T-NR and ZQ pass every step. By the rule of the assignment a control passing
every step closes the cell with a map row (`MAP_ROW.md`).

## 5. Cell U6 (b): norms on resonance states

**Lemma K (PROVED).** Let V be a vector space with commuting operators T_p, and W a subspace invariant under
all T_p with dim V/W = k < infinity. If v in V is a joint eigenvector not in W, its class in V/W is a joint
eigenvector with the same eigencharacter; V/W has at most k eigencharacters. Hence W contains every joint
eigenvector of V except those of at most k eigencharacters. For V containing the Eisenstein family
E*(., w) (eigencharacter p^(w - 1/2) + p^(1/2 - w), which determines {w, 1 - w}): W contains all E*(., w) except
at most k parameter pairs. In particular the kernel of one functional with Hecke-invariant kernel cannot
select the resonance states.

**Lemma K' (PROVED, standard).** If X is a Banach space, T bounded, and w -> F(w) a holomorphic non-vanishing
map of an open set into X with T F(w) = lambda(w) F(w), the spectral radius of T is at least sup abs(lambda(w)).
So if membership of E*(., w) in X is an open condition (any size or growth condition), the Hecke bound on X
is implied by admissibility: EIS-w.

Consequences. A norm device on resonance states needs a space X that meets the Eisenstein family in a
discrete set containing every resonance (so of infinite codimension in any space containing the family,
by Lemma K), defined without reference to the zeros, on which norm(T_p) <= p^theta + p^(-theta) is proved. On
such X the point spectrum of T_p contains the eigenvalue of every resonance by construction, so the bound is
the conclusion unless X embeds isometrically and Hecke-equivariantly in a space Y with known norm; then by
Lemma K' Y excludes E*(., w) for abs(lambda_p(w)) > norm, and admissibility of the resonance state in Y is again
the conclusion. The classes outside G37 that were examined: norms N(D f) with D an invariant differential
operator (scalar on eigenfunctions: same type as N); norms of restrictions to a Hecke-invariant set of
points (solid norms on a Hecke orbit, where the tree's own horocyclic eigenfunctions play the part of EIS-w;
ARGUED; adjacent to row G33); norms defined in the Lax-Phillips model (model-functorial; BLS triple).
The cell is reduced to: "an infinite family of Hecke-covariant linear conditions, not zero-mode asymptotics
(G37 (d), Zagier's criterion), cutting out the resonance states, with a norm bound not derived from the
conditions". No candidate was found. This is a statement about what was examined, not a classification.

## 6. Requirement flags

- R1 false. No displayed inequality has a Hecke relation as its multiplicative step. The Hecke relations hold
  at every parameter (EIS-w); the Euler product is used only in "denominators do not vanish at real part >= 1"
  (classical).
- R2 false. No conclusion; nothing height-uniform is derived.
- R3 false. EIS-w, E_a, BLS, T-NR and ZQ pass every step (section 4).
- R4 false, not addressed. Every read of zeta at real part in (1/2, 1) is a numerator zero whose only effect
  is a missing exponent; no condition on its real part follows.

## 7. Three weakest steps

1. Object O2, truncated-norm positivity (section 3.4): not derived; referred to row D10, which is itself not
   closed. The two-exponent form at 2u = 1 + rho is the one place in this file where a zero of zeta gives an
   object on the unitary axis exactly when beta = 1/2, and its truncated norm was not written down.
2. Double cover (O4): every statement is RECALLED or ARGUED from rank one. The constant-term formula of Gao
   and the Whittaker coefficients of the P_(2,1) series with theta datum on the double cover of GL(3) were
   not opened or derived. The metaplectic half is closed as argued only.
3. Lemma 4 relies on Langlands' inner product formula for cuspidal data and on Theorems B, C of D9 as
   recalled from the map (not re-derived here), the base case by a Sturm-Liouville identification whose sign
   convention was confirmed only by the diagonal sample; a real zero of L(., Ad f) of odd multiplicity is
   outside Theorem C. Cell (b) (section 5) is a reduction plus examined classes, not a classification.

## 8. Files

`checks.py`, `checks.json` (parts A, B, C; part D is a trivial bookkeeping loop and supports nothing),
`REFEREE.md` (self-check), `MAP_ROW.md`, `lanes.jsonl`.
