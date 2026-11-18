# REFEREE (lens: general) for c4-fe-stage-rouche-crossing/RESULT.md

Claimed verdict: precise-obstruction. Referee verdict: **holds, with corrections E1-E7**. Every step labelled PROVED was re-derived and confirmed. Three statements in the summary and verdict are stronger than what the body establishes (E1-E3). No statement about zeros of zeta is made beyond one box below verified height. Nothing assumes RH silently. Flags set by the referee: R1 false, R2 false, R3 false, R4 false.

## 1. Re-derivation of the PROVED / CLASSICAL steps

| Step | Result of re-derivation |
|---|---|
| Lemma 1(a) (Gonek Thm 6.2, Lemma 6.1) | Confirmed against `src_gonek/gonek2012.txt` lines 919-958. G = P + chi conj(P), abs(conj P) = abs(P) != 0, so G = 0 forces abs(chi) = 1. Uses only non-vanishing of P. Not new (stated as CLASSICAL). |
| Lemma 1(b) | Confirmed. On the line 1 - s = conj s, so arg Theta = arg chi - 2 arg P = -F + const; Cauchy-Riemann for log Theta gives d/dsigma log abs(Theta) = d/dt arg Theta = -F'. F' = L - 2 Re sum w Lambda n^(-1/2-it) + O(1/t) confirmed by differentiating Im log P. Trivial sums confirmed: sharp 2 sqrt X; Fejer integral of (1 - log x/log Y) x^(-1/2) = 4 sqrt(Y)/log Y - 4/log Y; trapezoid 2 Fejer(X^2) - Fejer(X) gives 4X/log X. |
| Lemma 1(c) | Confirmed. Residues of -zeta'/zeta(s+z) Y^z/(z^2 log Y): double pole at 0 gives -zeta'/zeta - (zeta'/zeta)'/log Y; zeros give -Y^(rho-s)/((rho-s)^2 log Y); pole gives +Y^(1-s)/((1-s)^2 log Y). Collecting with sum_rho Re 1/(s-rho) = Re zeta'/zeta + L/2 + O(1/t) and (zeta'/zeta)' = -sum 1/(s-rho)^2 + O(1/t^2) gives F' = 2 log Y sum Re kappa - 2 Re pole + O(1/t). Re kappa(iu) = (1 - cos u)/u^2. Numerically rechecked on different cases (section 2). |
| Lemma 2(a) | Confirmed. (1-lambda) zeta + lambda G = 0 on the boundary iff zeta/G = -lambda/(1-lambda) in (-inf, 0] (lambda < 1) or G = 0 (lambda = 1). Homotopy invariance of the winding number; G extends without zeros to B. |
| Lemma 2(b) | Confirmed for Gonek's trapezoid weight (Thm 3.1, lines 310-313, unconditional). abs(arg(1 + Theta^G)) <= arcsin abs(chi) correct. Sufficient pi/2 and necessary 3 pi/2 correct up to the O(X^(-sigma-2)/(tau^2 log^2 X)) factor. See E4 for the weight. |
| Lemma 2(c) | Identity confirmed by subtraction. a_X(n) = 1 for n <= X holds for the sharp log-sum (every prime-power factor of n <= X is <= X). The remark is a tautology (E5). |
| Lemma 2(d) | Confirmed (Gonek (37)). |
| Decisive test step 1 | Confirmed; it is Lemma 2(a). |
| Decisive test step 3 | Logic confirmed given Montgomery 1977 (statement as recalled matches the published form: 1/2 < sigma < 1, any theta, t in [T^((sigma-1/2)/3), T], constant (1/20)(sigma-1/2)^(1/2)). If the box has a zero the inequality fails by Lemma 2(a); if not, the boundary branch equals the horizontal branch, and arg P_X and arg(1+Theta) are bounded for fixed X. Source not opened by the lane or by the referee. |

## 2. Numeric reruns (referee code, different cases; local, `scripts/memcap.sh 8`, `.venv-arb`)

Scratch files in `/tmp/ref-c4fe/` (not part of the lane).

1. Explicit formula for the Fejer weight, low height, 6000 zeros (both signs of gamma), pole and trivial-zero terms included, zeta'/zeta and its derivative from Arb series:
   - s = 1/2 + 50i, Y = 1e6: prime side minus zero side 1.2e-7 (pole term 2.9e-2, so the sign and size of the pole term are tested).
   - s = 1/2 + 33.3i, Y = 1e4: 8.9e-8. s = 0.62 + 77.7i, Y = 3e5 (off the line): 2.2e-8. s = 1/2 + 120.5i, Y = 37: 8.2e-6.
   - kappa form with exact theta'(t): F' - (2 log Y sum kappa - 2 Re pole) = -4.4e-5, -2.6e-4, 1.5e-4 at t = 50, 33.3, 120.5 (allowed O(1/t)).
2. Kappa identity at T = 2.5e5 (lane used 1e6), 900 zeros, 60 random t, Y = 30, 3000, 3e5: max abs(prime side - zero side) = 4.3e-5, 2.5e-5, 5.7e-5; min F' = 6.71, 2.35, 1.16.
3. Ball certificate, different box and stage: X = 100, sigma_0 = 1/2 + 0.75/L = 0.562617, t in [1000031, 1000033]: certified, 344 segments, 708 sub-balls, depth at most 1, no undecided ball, 182 s. `cert.py` was read: the remainder uses the K-th Taylor coefficient enclosed over the segment ball, which is valid for the integral form of the remainder because an acb box is convex; the decision rule (Re > 0 or Im of definite sign) is sound; coverage of the boundary is complete.
4. F_2 asymptotic: F_2(z)/(e^(-2z)/(2 z^2)) = 1.008 + 0.022i at z = -15 + 40i (see E1).
5. DH stage, X = 300 and X = 3000 (lane used 100, 1e3, 1e4): zeros of the two-product stage at 0.769214 + 85.721146i and 0.804310 + 85.708057i, residual 5e-30, with abs of the two products equal (0.73998; 0.69915). Confirms that the DH stage vanishes right of the line.

No zeta-only mechanism is claimed, so no further control run was required. The U row was checked by reasoning: min abs(G^U/P^U) >= 1 - abs(chi) is the triangle inequality and holds for any P.

## 3. Errors and overstatements

- **E1 (constant).** Decisive test step 4 writes F_2(z) about e^(-2z)/(4 z^2) for Re z -> -infinity. The correct leading term is e^(-2z)/(2 z^2) (E_2(z) ~ e^(-z)/z^2, F_2 = 2 E_2(2z) - E_2(z); checked numerically). Summary item 4 has the right constant. No consequence for the conclusion.
- **E2 (overstatement, summary item 4 and verdict: "at any height", "half-plane statement").** Step 4 ignores the pole term of log Z_X, of modulus about X^(2(1-sigma_0))/(2 t^2 log^2 X). It exceeds the allowed 3 pi/2 once X is above about (t log t)^(1/(1-sigma_0)), so the inequality at X = t^A is false for A > 1/(1-sigma_0) regardless of zeros. Within the admissible range the contribution X^(2(beta_1-sigma_0))/(2 v^2 log^2 X) of a zero at vertical distance v is of size one only for v up to about t^((beta_1-sigma_0)/(1-sigma_0))/log t, which is less than t. What step 4 supports is: the inequality on one box depends on zeros right of sigma_0 within a window of length a power of t smaller than t; not "at any height" and not the half-plane. Section 7 item 1 concedes part of this; the summary and verdict do not. Step 4 is also ARGUED for a single off-line zero; cancellation among several is not excluded.
- **E3 (overstatement, step 2 and summary item 4).** Gonek Thm 5.1 assumes RH globally (lines 880-890). (i) "It is implied by the zero-free statement at abscissa sigma_0 - C log log t/log X" is a shifted version that Gonek does not state; it is not CLASSICAL and was not derived here. (ii) "true under RH exactly when X >= (log t)^(C/d)" is not established: Thm 5.1 gives sufficiency for the strict form; for smaller X the lane's own scan finds the degree condition holding at X = 2. The upper side of the "sandwich" is therefore ARGUED. The answer "no" to the decisive test does not need it: by Lemma 2(a) any statement implying the inequality on all boxes at abscissa sigma_0 implies the zero-free half-plane, hence cannot be strictly weaker than that target. That argument is one line and is all that is proved.
- **E4 (weight mismatch).** Lemma 2(b) uses Gonek's Thm 3.1, which holds for the trapezoid weight Lambda_X. The scan and the certificate use the sharp log-sum, for which the zero sum has a different kernel. The qualitative statement (the boundary quantity is log zeta - log P_X - log(1 + Theta)) is weight-independent; the formula with F_2 is not.
- **E5 (AFE remark is not a no-go).** Lemma 2(c) shows that one decomposition through the approximate functional equation returns the same difference P_X - D_N. It does not show that no use of the approximate functional equation can bound the boundary quantity. Label should be "identity + remark", not an obstruction theorem.
- **E6 (novelty).** (ii) the Fejer identity is the classical explicit formula with the kernel Y^z/(z^2 log Y) (the Fejer analogue of Gonek's (44)); the non-negativity of the Fejer kernel on the line and the reading as the Weil functional on g * g~ with g = e^(itx) 1_[0, log Y] are standard. (iii) the degree form of Rouche is the symmetric (Poincare-Bohl) form of the theorem. Both are correct and both are known; they should be labelled CLASSICAL rewriting, not new.
- **E7 (minor).** "Under RH the Fejer stage has monotone phase" is proved as F_Y' >= -2 sqrt(Y)/(t^2 log Y) - O(1/t), not F_Y' > 0; strict positivity needs a lower bound on the kernel sum, not given. "abs(chi) < 1 in the box (Lemma 1(a))": Lemma 6.1 covers 0 <= sigma <= 1 and the box extends to sigma = 2; the fact follows from (37) at t = 1e6 but is not enclosed in balls (the lane notes this in section 7). The statement "without RH positivity of F_Y' on every window is the target" rests on the ARGUED off-line estimate for a single pair.

## 4. Checks requested

- Assumes RH: no. Every conditional statement is marked.
- Restates verified height: the certificate does, and the result says so.
- Known theorem presented as new: partly (E6).
- Controls: no zeta-only mechanism is claimed. DH and T-NR fail at non-vanishing of the stage (DH rechecked); every control with a non-vanishing stage passes the stage lemma. The comparison step fails for E_a at boxes containing zeros, which is the conclusion.

## 5. Requirement flags (referee)

- R1 false: multiplicativity enters only through non-vanishing of the stage; no conclusion about zeros follows; every unimodular twist passes.
- R2 false: fixed X fails at large height (Montgomery, recalled); with X(t) the inequality is known only under RH.
- R3 false: U, Liouville, window translate are not separated.
- R4 false: no passage to the line is obtained.

## 6. Surviving claim

The FE-symmetrised stage P_X + chi conj(P_X) has its zeros on the line for any non-vanishing P_X (Gonek), so the on-line property carries no arithmetic. The degree (Rouche) inequality between zeta and this stage on the boundary of a box implies the box is zero-free; hence no statement strictly weaker than zero-freeness of the boxes implies it. At fixed X it fails at arbitrarily large heights for sigma_0 < 1 (Montgomery, recalled). For the Fejer weight F_Y'(t) = 2 log Y sum_rho Re kappa((rho-s) log Y) - 2 Re[Y^(1-s)/((1-s)^2 log Y)] + O(1/t) exactly (classical explicit formula; checked to 1e-7 with all terms at low height and to 6e-5 at T = 2.5e5), so under RH F_Y' >= -small for Y up to a power of t. One box at T = 1e6 (and a second by the referee) certified in ball arithmetic, below verified height. Not established: the non-locality claim in its "any height / half-plane" form (E2), the shifted form of Gonek Thm 5.1 and the "exactly when" threshold (E3), any no-go for the approximate functional equation beyond the stated decomposition (E5).
