# Referee (lens: logic and hidden assumptions) on c16-pos-fe-u2-positivity-rigidity

Independent pass (separate agent, own code). Object: RESULT.md, claimed verdict "proved-new-result".
Outcome: **Theorem P, the Corollary (POS-FE) and Proposition T hold as proofs. Four corrections are owed
(E1 to E4); none touches the proof.** No statement about zeros of zeta is made, RH is not assumed, verified
height is not used. Flags: R1 = R2 = R3 = R4 = false.

## 1. Re-derivation of the PROVED steps

| step | what was re-derived | result |
|---|---|---|
| 1 | log G(s) - log G(sigma_1) = -c w - integral (1 - e^(-wu)) dPi(u), Pi = e^(-sigma_1 u) d nu~/u on u > 0. Integral of min(1,u) dPi: near 0 it is the nu~-mass (locally finite on the closed half-line), for u >= 1 it is bounded by the transform at sigma_1 (a Lebesgue integral because nu >= 0). exp(-Bernstein) is completely monotone, so G(sigma_1 + w)/G(sigma_1) is the Laplace transform of a probability measure on [0, inf); dN = x^(sigma_1) dP(log x) lives on [1, inf). C = G(sigma_1) may be complex; (H1)-(H3) are homogeneous, so G/C is admissible. The half-plane cannot contain s = 1 (pole of G'/G), so sigma_1 > 1. | holds |
| 2 | Landau for a non-negative measure: abscissa in {1, -inf}. In the second case G is entire and r = 0; Steps 4 to 7 then give N = 0. r = lim (s-1)G(s) from the right is >= 0. | holds |
| 3 | abs(gam(2 - it)/gam(-1 + it)) is of order abs(t)^(3/2); finite order is exactly what Phragmen-Lindelof needs in the strip. | holds |
| 4 | Mellin in y with exponent s/2: Theta(y) = (1/(4 pi i)) integral over Re s = 2 of gam(s)G(s) y^(-s/2) ds. Residue of gam G at 1 is gam(1) r = r, at 0 it is -r (symmetry). The factor 1/2 from d(s/2) gives (r/2) y^(-1/2) - r/2. Shift to Re s = -1 crosses only s = 1, 0. Result Theta(y) + r/2 = y^(-1/2)(Theta(1/y) + r/2); for zeta it is Jacobi's relation. | holds |
| 5 | Pairing mu with g_y = e^(-pi y x^2) gives r/2 + Theta(y); with its transform y^(-1/2)(r/2 + Theta(1/y)). y -> g_y is smooth into Schwartz space, so equality passes to x^(2k) e^(-pi x^2), whose span is the span of the even Hermite functions, dense in even Schwartz space. mu is tempered by N([1,X]) <= X^2 G(2). | holds |
| 6 | f = phi correlated with phi, support in the open (-1,1), f(0) = norm^2, fhat = abs(phihat)^2. Pairing mu with fhat = pairing with f gives (T) with the constants as written. Limit: L^2 convergence on a bounded interval gives L^1 convergence, so phihat_k -> sinc uniformly; Fatou gives integral of sinc^2 dN <= 0. An atom of N at x = 1 is harmless (f(1) = 0, sinc(1) = 0). | holds |
| 7 | A tempered measure on Z has a 1-periodic transform; equal to mu, so the weights are constant: N({n}) = r. | holds |
| Scaled form | f = (1 - abs(x)/a)_+, fhat = a sinc^2(a x): (r/2)(1 - a) = integral of a sinc^2(a x) dN. Correct (f is not smooth; one mollification, not written, is needed). | holds |
| Prop. T | Tonelli replaced by absolute convergence, Fatou by domination: abs(phihat_k)^2 <= min(1, 1/(pi x)^2), integrable against abs N because the transform of abs N converges at s = 2. | holds |
| QF implies RH | zeta is a member with nu >= 0 >= -eps mu for every eps (mu >= 0), so its zeros are within inf f = 0 of the line. Trivial and correct. It says QF is not weaker than RH; it does not say QF is false. | holds |

Hidden assumptions that were looked for and not found: RH (not used: ZQ, G_+ are built on individual zeta
zeros taken as numerical ordinates, and the theorem does not need them); simplicity of zeros (used only in
the controls, for the first few zeros, where it is known); real-valuedness of G (not needed); discreteness of
N (not assumed: densities, atoms off the integers and singular parts are all covered by Step 6).

## 2. Numeric checks rerun with other cases (own code, kept outside the lane directory; mpmath 25 digits and numpy, local, memcap 8 GB)

| check | case (different from the lane's) | value | verdict |
|---|---|---|---|
| theta relation of Step 4 on a signed member | ZQ on the pair 3, 4, eta = 0.25, r = m(1) = 1.0194989626639; y = 0.45, 0.8, 1.3 | defect 0 at 25 digits at all three; with r replaced by 1: 4.8e-3, 1.2e-3, -1.2e-3 | confirms Step 4 constants; check not vacuous |
| sign of the coefficient density of ZQ | same member, 1 <= x < 16 | min -3.72, max +4.05 | ZQ fails N >= 0, as claimed |
| (T) on zeta | phi = (1 - 4u^2)^2 | 0.0609523809523 against 0.0609523809524 | holds |
| general identity with mass below 1 (control T-NR) | q = 2.5 (non-integer), c = 0.7, phi = (1 - 4u^2)^2 | integral of fhat dN = 0.274355770564; (r/2)(norm^2 - mean^2) = 0.177590513501; mass term at x = 0.4, 0.8: 0.096765257063; closes to 2.7e-13 | (T) fails by exactly the mass below 1: support clause is the failing hypothesis |
| self-duality of the Davenport-Heilbronn component at zeta's gamma factor | 5^(s/2) L(s, chi_5): r = 0, atoms chi_5(n) at n/sqrt 5 | term below 1 (n = 1, 2): 0.115756610776; sum of fhat dN: 0.115756610776; defect 4.6e-14 | self-dual, but signed and with mass below 1: outside (H1) on two counts |
| ZQ column of the table in 3.1 | pairs (91,92; eta 0.2), (34,35; eta 0.1), (186,187; eta 0.3), grid step 2e-5 in L | 0.655907, 0.675793, 0.687544 against the table's 0.655832, 0.675680, 0.687518 | table values are low by 4e-5 to 1.7e-4 relative (see E4) |

A first run of the T-NR check gave a false defect of 0.26 from my own quadrature (4000 Gauss nodes used at
frequencies up to 3750); rerun with frequencies capped at 1250 it closes to 2.7e-13. Recorded so that the
number is not picked up from a log.

## 3. Controls

The result claims no zeta-only mechanism about zeros; it is an identification. The controls were run as
"which hypothesis does each neighbour fail" and agree with section 4 of RESULT.md: ZQ (sign; identity (T) and
the theta relation hold), T-NR symmetric (support below 1; non-integer q checked), DH at zeta's gamma factor
(sign and support), G_+ (re-derived: -m'/m of m_+ has density 4 x^(-1/2)(cosh(bL) - cosh(eta L) cos(gL)) >= 0
for b >= eta, so nu >= 0 exactly, and the poles at 1/2 +- b are not cancelled by zeta; pole clause).
Backward heat, sign twists, unimodular twists, Beurling, zeta(s+a)zeta(s-a), theta^w and the phase-rotated
transfer operator do not satisfy (H1)-(H3) and are not informative here. R3 is therefore not established in
the campaign's sense, as RESULT.md says.

## 4. Errors and corrections

- **E1 (wrong remark; not load-bearing).** The remark on Hecke's groups in section 2, and the matching row
  of the in-lane REFEREE.md, have the frequency inverted. With Hecke's normalisation
  (2 pi/lambda)^(-s) Gamma(s) phi(s) and s -> s/2, the term a_n e^(2 pi i n tau/lambda) at tau = iy is
  a_n e^(-pi (2n/lambda) y), so the frequencies are sqrt(2n/lambda), not sqrt(lambda n/2) (lambda = 2 gives
  sqrt n, the theta series). For lambda > 2 the lowest frequency is sqrt(2/lambda) < 1. The scaled form
  (a > 1) therefore does not apply to G(lambda), lambda > 2; those series are outside (H1) for the same reason
  as T-NR (mass below 1), and the sentence "cannot have non-negative coefficients" is not established. The
  scaled form applies to lambda < 2. The scaled form itself is correct.
- **E2 (wording of the screen).** "The MILP optimum is ZQ in 40/40 cells" should read "the MILP incumbent is
  ZQ in 40/40 cells". From `lp2_main.json`: the dual bound is within 0.6 percent of the incumbent in 32 cells;
  in 8 cells the solver stopped at its time limit 3 to 15 percent below (RESULT.md states this in the reading,
  the summary line does not). The cells K = 1600 and K = 2000 are the same problem (same pair 1496, 1497, same
  729 columns, identical LP bounds to 16 digits), so there are 35 distinct cells, 30 of them closed to 0.6
  percent (taking the better of the two duplicate runs). K selects the pair only: each program has at most 82 removable zeros, so "K = 2000" is not a
  program with 2000 poles. The statement "no configuration, integer or not, below 0.79 of ZQ" is conditional
  on the forced quartet having weight exactly 1, further quartets sharing the same eta, weights in [0,1], the
  listed columns, and the window x <= 1e6.
- **E3 (necessity claim is incomplete).** "Each hypothesis is necessary" is shown for three clauses (sign,
  support, pole). Necessity of "finite order" is not addressed; no example is given and none is known to this
  referee, so the clause may be redundant given (H1) and (H3). Necessity of the functional equation is trivial
  (zeta(s)(1 + 2^(-s))) and should be stated for completeness.
- **E4 (precision of the ZQ column).** The "fine grid" (step h/4, about 1e-3 in L at g about 220 to 380)
  under-resolves the peak of cos(g L): the printed six-digit sup values are low by 4e-5 to 1.7e-4 relative.
  The LP/ZQ ratios and all readings are unaffected at the three digits quoted.
- **E5 (verdict label).** "proved-new-result" is accurate only as "new to the campaign record". The measure
  statement (a non-negative tempered measure equal to its Fourier transform, with no mass in 0 < abs x < 1,
  is a multiple of the Dirac comb) is the standard equality argument for the triangle function in the
  one-dimensional linear-programming bound, and the passage from the functional equation to self-duality is
  Bochner's. Related literature that should be opened before any outside statement: Bochner and
  Chandrasekharan (1956) on Riemann's functional equation with general frequencies; Knopp (1994); Cohn and
  Elkies (2003); work on crystalline measures (Lev and Olevskii, Meyer). Not opened by this referee either.
  The map row should read "identification, classical in content".

## 5. Requirement flags (set strictly)

| flag | value | reason |
|---|---|---|
| R1 | false | no multiplicative hypothesis and no multiplicative step; nu enters only through N >= 0 |
| R2 | false | no statement about zeros, in any window |
| R3 | false | no mechanism about zeros for a control to fail; each neighbour is outside a named hypothesis |
| R4 | false | nothing reaches the critical line; QF, the form that would, is at least as strong as RH |

## 6. Verdict

holds = true for: Theorem P, the Corollary POS-FE, the scaled form, Proposition T, "QF implies RH", and the
measured control table. To be carried with the result: E1 (delete or reverse the Hecke remark), E2 (incumbent,
35 distinct cells, 30 closed to 0.6 percent), E3, E4, E5. Score 0 stands. This is one independent referee;
the result makes no statement about zeros of zeta, so the three-referee rule for such statements is not
triggered.
