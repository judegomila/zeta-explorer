# c8-single-row-bridge-crossing: the bridge of a single completed probe row

Internal working note, 2026-11-18. Slug `c8-single-row-bridge-crossing`. Kind: combine (R4 lane). Not refereed.
Nothing committed, pushed or posted. Files: `row_zero_test.py`, `row_zero_test.log` (one local run through
`scripts/memcap.sh 8`, float64 + mpmath, about 2 minutes, 135 MB planned arrays; reads only the arrays `N`, `g2` of
`tmp/sextic/data/sf_1e7.npz`). The compute server was not used.

No statement about a zero of zeta or of any L-function is made beyond classical facts (no zeros on Re w >= 1) and
the numerical positions of five known low zeros. 7/8 (unrefereed) stands as imported; RH open. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel MS (relative to the unrefereed openai/math manuscript,
`~/lean-deps/qrh-verify/paper.txt`, statement of Prop. 5.1 as printed) / CLASSICAL / RECALLED (literature not
opened) / ARGUED / MEASURED / OPEN.

## Verdict

**Precise obstruction. The lane closes at the decisive test; the one pivot gives an identity with no sign.**

1. A single row is the series T(s, Psi) = L0(s, Psi) D(s, Psi), with L0(s, Psi) = L(3s - 1/2, psi), psi the cube of
   the row character (target eta included), and D the Gauss-sum series on squarefree indices. The target enters D
   only as a unimodular twist of coefficients. The only Euler product inside a row is L0, and it is the L-function
   of eta^3 (times a quadratic symbol in m, and an angular weight in the manuscript's version), read at 3s - 1/2.
   The target L(s, eta) itself is not a factor of any single row; it appears only after the sum over rows m
   (Poisson in m, sixth powers).
2. **Two axes (Lemma 2).** The row's functional equation (cubic theta, Prop. 5.1) has axis Re s = 1/2. The Euler
   factor L0 has axis Re s = 1/3. They are 1/6 apart. In the variable w = 3s - 1/2 of L0, the row's axis is
   Re w = 1: the edge of absolute convergence of the Euler factor.
3. **The bridge of the row T about its own axis does not read the zeros of L0.** S_T = T^#/T has an anticausal
   pole only at a zero of T in Re s > 1/2. Zeros of L0 lie at Re s = (beta + 1/2)/3 < 1/2 (classical: beta < 1), so
   L0 contributes none. rank Gamma_-(S_T) counts zeros of D in Re s > 1/2: the row's own zeros.
4. **The zeros of L0 are not zeros of T (MEASURED, five zeros).** For the unweighted row with mask at 2 and
   eta = 1, m = 1 (L0 = zeta_F(3s - 1/2) up to two Euler factors): |T(s_rho)| = 2.21, 5.89, 3.39, 3.50, 3.67 at
   s_rho = (rho + 1/2)/3 for the first three zeros of L(., chi_-3) and the first two of zeta (fit spread at most
   0.03, 0.01, 0.03, 0.04, 0.09). So D has a pole at each s_rho. The target-family zero enters the row as a pole of
   the quotient D = T/L0, not as a zero of the row.
5. **Reading through D (the "bridge reads it" branch) is an identity, not a sign statement.** S_D = D^#/D (reflection
   about Re s = 1/2) has an anticausal pole at 1 - conj(s_rho) for every zero rho, at distance (1 - beta)/3 from the
   axis, at every height, in every row whose cube character is the given one (one m suffices). The rank counts all
   zeros, on the line or not. RH for L0 is "these poles lie on Re s = 2/3", which is not a condition on rank or
   sign of Gamma_-. About the axis Re s = 1/3 of L0 the zeros cancel from the quotient (functional equation of L0),
   and the Cayley form splits as H(D) = H(T) - H(L0): the bridge of L0 minus a form of T that has no symmetry about
   Re s = 1/3.
6. Controls: the T-bridge (items 2, 3) passes DH-type targets, theta^w, backward heat and height translation
   unchanged; THIN, Liouville and non-periodic U fail at the first lemma (no continuation to the axis without
   periodicity). The THIN failure is a failure of existence of the object, not of a sign statement about the target.

Score for the campaign metric: 0 new requirements. The item left open by c7 (weakest step 2, section 11) is closed:
the completed row series has an axis of unimodularity (Re s = 1/2), and it is the wrong axis by 1/6.

---

## 0. Plan; relation to closed rows

Read: BRIEF to the end; OBSTRUCTION_MAP section 2 (controls) and rows G10, G20, Z15, Z15c, Z24, Z25, P44;
`g-spinor-square-root` (brief summary: S = N/D, Gamma_+-, H_c); `c7-bridge-seven-eighths-krein-index` sections
9 to 11; `c7-probe-format-h-cap` verdict and section 1; `h-seven-eighths-in-bridge` section 2; MS section 5.1
(statement of Prop. 5.1, lines 1377 to 1560 of paper.txt) and 6.1 (row definition, lines 2675 to 2760).

Not repeated: family sums and indices (c7), the wall dictionary (h-seven-eighths), format caps (c7-probe-format).

Sides stated in advance by the assignment: row supplies R1 and R3, bridge supplies R2 and the R4 candidate.
Decisive test: does a target zero enter S_m as an off-axis pole.

## 1. First lemma: the row series, its functional equation, its axis

**Row [PROVED-rel MS, read from the text].** For a finite ray character Psi on primary elements (zero off units),

    D(s, Psi)  = sum_{n squarefree, n = 1 (3)} gamma_2(n) conj(alpha(n)) Psi(n) q_n^{-s},
    L0(s, Psi) = sum_{b = 1 (3)} conj(alpha(b))^3 Psi(b)^3 q_b^{-3s + 1/2},        T = L0 D   (Re s > 1).

alpha(a) = a/|a|, gamma_2 the normalised Gauss sum of the cubic symbol (MS (4.7), (5.10)). The factorisation holds
because the cubic theta coefficient at n b^3 is |b| times the coefficient at n, with no coprimality condition
(MS (5.9)), and Psi is completely multiplicative. The row of the probe (MS 6.1) is T at
Psi = eta Xi^{-1} R(., s) chi_.(m) times a fixed finite character. So

    L0(s, Psi) = L(3s - 1/2, psi),   psi = (conj(alpha) Psi)^3 = conj(alpha)^3 eta^3 (fixed)^3 (quadratic symbol of m).

**Functional equation [PROVED-rel MS for the smoothed identity (5.1); the Mellin form below is ARGUED by Mellin
inversion of (5.1)].** T is entire. With R(t) = prod_{+-} Gamma(1 + t +- 1/6)/Gamma(1 - t +- 1/6), K = (2 pi)^4/27,

    T(s, Psi) = R(s - 1/2)^{-1} sum_j zeta_j (K/q_{c_j}^2)^{s - 1/2} E_j(1 - s),
    E_j(u) = sum_mu d_j(mu) alpha(mu) theta_j(lambda^4 mu) prod_p B_p(lambda^4 mu) q_mu^{-u},

a finite sum over cusp sectors j (h_0 mod L, active set), d_j one of three cusp coefficient functions.

**Axis.** |R(it)| = 1 for real t, so the axis of the reflection is Re s = 1/2 (s <-> 1 - s).

**The row is not self-dual [PROVED-rel MS, item 2 of Prop. 5.1].** The local column type changes as
chi_p^{j} -> chi_p^{-j-2}: j -> -j-2 mod 6 exchanges 1 <-> 3 and 0 <-> 4 and fixes 2 and 5. A row with sextic
type j = 1 at the primes of m reflects to a combination of quadratic-type series at other cusps with additive
characters. Hence:

- The Cayley symbol of the square-root lane, S = (F - a F')/(F + a F'), needs F'/F imaginary on the axis; this
  holds for a self-dual F. For a single row it does not hold. Self-dual scalars are the eigen-combinations
  T +- eps T^dual of two series with different coefficient systems; these are DH-type combinations by construction.
- The reflection quotient S_m := T_m^#/T_m, T^#(s) = conj(T(1 - conj s)), is unimodular on Re s = 1/2 for every
  function T (no functional equation needed; same object as row G10's Theta_X). The functional equation gives
  T^# explicitly as R^{-1} times the dual cusp series, so S_m is a ratio of the dual-cusp series to the row.
  Bridge form: H_c(m) = A* M_c A with symbol S_m; rank Gamma_-(m) = number of poles of S_m in Re s > 1/2 =
  number of zeros of T_m in Re s > 1/2 not cancelled by reflected zeros (g-spinor Theorem, used as stated).

This answers c7's open item: the completed row series has an axis of unimodularity, Re s = 1/2.

## 2. Decisive test: how a zero of the target enters

**Lemma 2 (two axes) [PROVED-rel MS + CLASSICAL].** Let rho = beta + i gamma be a zero of L(w, psi), 0 < beta < 1,
and s_rho = (rho + 1/2)/3.

(a) Re s_rho = (beta + 1/2)/3 < 1/2, with 1/2 - Re s_rho = (1 - beta)/3. L0 has no zero in Re s >= 1/2 (no zero of
    L(w, psi) on Re w >= 1). So every anticausal pole of S_m comes from a zero of D in Re s > 1/2 (D is analytic
    there because T is entire and L0 does not vanish). rank Gamma_-(m) is blind to the zeros of L0.
(b) The completed L(w, psi) has axis Re w = 1/2, that is Re s = 1/3. Distance between the two axes: 1/6. The row
    axis is Re w = 1.
(c) At s_rho exactly one of two cases holds: T(s_rho) = 0 (then S_m has a zero at 1 - conj(s_rho) in Re s > 1/2: a
    Blaschke factor on the causal side, no contribution to Gamma_-), or T(s_rho) != 0 (then rho is not a zero of the
    row; D = T/L0 has a pole at s_rho).

Proof: (a) and (b) are the change of variable w = 3s - 1/2 and the classical non-vanishing on Re w >= 1; (c) is the
identity T = L0 D continued. QED

**Which case: MEASURED, T(s_rho) != 0.** Row: eta = 1, m = 1, mask at the prime 2, no angular weight (the Mellin
transform of the masked theta function along the height axis, which is the manuscript's row without alpha):
T(s) = sum gamma_2(n) q_n^{-s} q_b^{1/2 - 3s} over primary n squarefree, b, both prime to 2;
L0(s) = zeta_F(w)(1 - 3^{-w})(1 - 4^{-w}), w = 3s - 1/2, F = Q(sqrt -3). Method: smoothed sums
G(X) = sum a(mu) q_mu^{-s} exp(-(q_mu/X)^k), q_mu <= 1e7 (2,822,619 squarefree n; 30 norms of b), fitted by complex
least squares to T + c1 X^{5/6 - s} + c2 X^{1/6 - s} (poles of T only at 5/6 and 1/6, from the constant term
v^{2/3} of the cubic theta function at the two ends; RECALLED). Three configurations: k = 4 on X in [3e5, 3.5e6],
k = 2 on [3e5, 1.4e6], k = 4 on [6e5, 3.5e6].

Validity of the model (`row_zero_test.log` part A): at s = 1/3 + 2i the residual is 2.0e-3 (k = 2) against
max|G| = 85 for gamma_2 coefficients, and 1.9 against max|G| = 7 for random unimodular phases on the same support.
The fitted T agrees between k = 2 and k = 4 to 1e-2 at s = 1/3 + 2i, 1e-3 at 1/2 + 3i, 2e-4 at 0.7 + i.

| zero rho of zeta_F | s_rho | |L0(s_rho)| | |T(s_rho)|, three fits | |T| at s_rho +- 0.15i |
|---|---|---|---|---|
| L(chi_-3), 8.0397 | 1/3 + 2.67991i | 4e-16 | 2.204, 2.209, 2.215 | 1.03, 2.77 |
| L(chi_-3), 11.2492 | 1/3 + 3.74974i | 9e-16 | 5.888, 5.895, 5.893 | 6.03, 4.92 |
| zeta, 14.1347 | 1/3 + 4.71158i | 2e-15 | 3.416, 3.386, 3.382 | 3.66, 2.81 |
| L(chi_-3), 15.7046 | 1/3 + 5.23487i | 3e-15 | 3.502, 3.500, 3.462 | 1.95, 4.14 |
| zeta, 21.0220 | 1/3 + 7.00735i | 3e-15 | 3.627, 3.668, 3.719 | 2.6, 5.1 |

|T| at the five points is between 2.2 and 5.9, of the same size as at neighbouring points of the line, and 40 to
800 times the spread between fits. |D| = |T/L0| on a grid t = 2.0 ... 5.6 (part C) peaks next to each zero (4.25 at
t = 2.6, 26.2 at t = 3.8, 4.6 at t = 4.6 and 4.8, 7.95 at t = 5.2). This agrees with the classical normalisation
of the Kubota-Patterson series (the Gauss-sum series is completed by zeta_F(3s - 2) in the unnormalised variable;
RECALLED, not opened).

**Outcome of the decisive test.**

- For the row T_m: a zero of the cube-part L-function is neither a zero nor a pole of T_m; the target enters T_m
  only through the unimodular twist of the coefficients. The bridge of T_m reads the zeros of the Gauss-sum series
  D in Re s > 1/2. Branch "only through coefficients": the lane closes.
- The target L(s, eta) is not L0 unless eta^3 times the quadratic symbol of m equals eta (for example eta = 1 and
  m a square up to S-units, unweighted row; eta quadratic equal to the symbol of m). In the manuscript's weighted
  row psi carries conj(alpha)^3 and is of infinite order: L0 is never a finite-order target.

## 3. Pivot (once): the bridge of the quotient D = T/L0

Strongest adjacent object: D, which does carry every zero of L0 as a pole.

**Proposition 3 [PROVED-rel Lemma 2 and T(s_rho) != 0].**
(a) About Re s = 1/2: S_D = D^#/D has a pole at 1 - conj(s_rho), real part (5/2 - beta)/3 in (1/2, 5/6), for every
    zero rho with T(s_rho) != 0, plus poles at the zeros of D in Re s > 1/2. rank Gamma_-(S_D) >= number of such
    rho in any height window; the reading holds at every height and in every row with cube character psi. It does
    not depend on whether beta = 1/2. The location of the pole encodes beta: RH for L(w, psi) is "these poles lie
    on Re s = 2/3". A zero-free region Re w > 1 - delta is "they keep distance delta/3 from the axis"
    (7/8 imported: distance >= 1/24). Both are statements about pole positions, restating the zero positions
    under an affine map; neither is a sign or rank condition.
(b) About Re s = 1/3 (the axis of L0): D^{#'}/D = (T^{#'}/T)(L0/L0^{#'}), and L0/L0^{#'} is the gamma ratio of
    L(w, psi) times a constant: the zeros of L0 cancel identically. The quotient reads zeros of T in Re s > 1/3.
(c) Log-derivative (Cayley) form about Re s = 1/3: D'/D = T'/T - L0'/L0, so H(D) = H(T) - H(L0) (additivity,
    c7 Theorem C). H(L0) is the square-root-lane bridge of L(w, psi) in the variable w/3. H(L0) >= 0 iff RH for
    L(w, psi). The row gives H(L0) = H(T) - H(D), where neither term has a symmetry about Re s = 1/3 (T's symmetry
    is about 1/2; D has none). No inequality between H(T) and H(D) follows from the functional equation of T.

So the pivot expresses the bridge of a (cube-twisted) L-function as a difference of two forms without sign. An
R4 statement would need a sign for H(T) - H(D) about Re s = 1/3; the theta functional equation acts about
Re s = 1/2 and maps Re s = 1/3 to Re s = 2/3. Composing the two reflections gives the translation s -> s + 1/3,
not a reflection: no third axis exists. Stopped here.

Adjacent known method [RECALLED, not opened]: regularity of an Eisenstein coefficient of the form T/L0 on the
unitary axis is the Eisenstein-series proof of non-vanishing on Re w = 1 (Sarnak 2004; Gelbart-Lapid 2006), with
classical-shape regions only. The row axis Re s = 1/2 = {Re w = 1} is that setting. The single-row bridge is
therefore on the "right of 1" side of the R4 wall, by exactly the 1/6 of item (b).

## 4. Controls

| Control | Step that fails, or passes | Label |
|---|---|---|
| DH-type target (c1 eta1 + c2 eta2) | First lemma passes (T is linear in Psi; functional equation and S_T unchanged). Lemma 2 and the bridge of T pass unchanged: the T-bridge is blind to the change. Factorisation T = L0 D fails (needs Psi(n b^3) = Psi(n) Psi(b)^3): the D-reading of section 3 does not exist | PROVED-rel MS |
| THIN | Fails at the first lemma: eps is not periodic, so the twisted theta function has no automorphy and T_eps has no known continuation to Re s = 1/2; S_T is not defined. In Re s > 1 the factorisation holds with L0 = F_eps(3s - 1/2) (eps^3 = eps), whose zero at w = b is at s = (b + 1/2)/3 < 1/2, outside the domain. Structural reason: periodicity. It is a failure of existence, not of a sign statement about a zero | ARGUED (no proof that no continuation exists) |
| U (height translate n^{-i tau}) | Passes every step: T(s + i tau); axis, S_T, Lemma 2 translate | PROVED |
| U (generic non-periodic unimodular, completely multiplicative) | As THIN | ARGUED |
| Liouville twist | As THIN at the first lemma. In Re s > 1: L0 = zeta_F(2w)/zeta_F(w)-type, zeros of the target become poles of L0 | ARGUED |
| theta^w (another automorphic form with the same multiplier, coefficients without the b^3 rule) | First lemma and T-bridge pass; factorisation T = L0 D fails. So items 2, 3 of the verdict use only automorphy | ARGUED |
| Backward heat on the row | Axis and S_T persist under an even multiplier in s - 1/2; rank Gamma_- changes with the row's own zeros; the factorisation is lost (not a Dirichlet series). The T-bridge statement (blind to L0) passes | ARGUED |

No conclusion of this lane is a statement that should fail on the controls: the positive statements are identities
(Lemma 2, Prop. 3) and a measurement. The T-bridge is control-blind (DH, theta^w, heat pass). The D-reading uses
complete multiplicativity (b^3 rule) and periodicity, and it is an identity.

## 5. Requirement flags

| Flag | Value | Evidence |
|---|---|---|
| R1 multiplicativity essential | not established | Multiplicativity enters only in T = L0 D (Psi completely multiplicative, b^3 rule). It produces the pole reading of Prop. 3(a), an identity. No conclusion with content uses it |
| R2 height-uniform, every window | not established for a conclusion | The pole reading of Prop. 3(a) is exact at every height, and it is the zero set restated under s = (rho + 1/2)/3. No inequality |
| R3 fails for every control at a structural step | not established | Section 4: the T-bridge passes DH, theta^w, heat; THIN fails only by non-existence of the continuation |
| R4 passage to the critical line | not established; obstruction named | The row axis is Re w = 1 for its Euler factor (Lemma 2(b)); about Re w = 1/2 the form is H(T) - H(D) with no sign (Prop. 3(c)) |

## 6. Three weakest steps

1. **Functional equation read, not re-derived.** The Mellin form of (5.1), the involution j -> -j-2 and the
   non-self-duality are read from the printed statement of Prop. 5.1 of an unrefereed manuscript (text extraction);
   the proof was not followed. The unweighted row used in the numerics (no alpha) is not the manuscript's row; its
   continuation with poles only at 5/6 and 1/6 is RECALLED from the Patterson theta function and supported only by
   the fit (residual 2e-3 against 1.9 for random phases).
2. **Numerics are a fit.** float64 smoothed sums to norm 1e7, three-term least squares, no interval arithmetic, no
   use of the functional equation as a check. Residuals grow with height (k = 4: 0.05 at t = 2 to 0.7 at t = 7).
   T(s_rho) != 0 is measured at five zeros of one row; "D has a pole at every s_rho" for other rows, other m and
   the weighted row is not tested. If T vanished at some s_rho, Lemma 2(c) first case applies and the conclusion
   (no contribution to Gamma_-) is unchanged.
3. **Absence statements.** "H(T) and H(D) have no symmetry about Re s = 1/3" and "THIN has no continuation" are
   absences of a known structure, not theorems. Prop. 3(c) uses additivity from c7 Theorem C (unrefereed) for
   meromorphic factors with poles, where the form of D has negative squares from poles as well as from zeros; the
   bookkeeping of signs for poles was not written out. The identification with the Sarnak / Gelbart-Lapid setting
   is RECALLED.

## 7. Proposed map row (for the repair lane; not applied here)

Single probe row with the bridge: T_m = L0 D, L0 = L(3s - 1/2, psi); row axis Re s = 1/2 = {Re w = 1}; L0 axis
Re s = 1/3; gap 1/6. Gamma_-(T_m) is blind to L0 (classical non-vanishing on Re w >= 1); zeros of L0 are poles of D
(measured, five zeros), read by Gamma_-(D) at every height as an identity; about Re w = 1/2 the form is
H(T) - H(D), no sign. Controls: T-bridge passes DH, theta^w, heat; THIN fails by non-existence.

## 8. Next step

None on this object. A lane that wants the zeros of an L-function as poles on the correct axis would need an
automorphic object whose unitary axis is Re w = 1/2 for the Euler factor in its coefficients; for coefficients of
Eisenstein or theta type the factor is always read at the edge (constant-term normalisers are evaluated at
Re w = 1 on the unitary axis). That is the Langlands-Shahidi setting and is a known wall, not a new candidate.
