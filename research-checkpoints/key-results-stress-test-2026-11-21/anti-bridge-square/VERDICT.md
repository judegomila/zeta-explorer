# VERDICT: anti-bridge-square

## Statement supported
For F(x)=xi(1/2+x), L=F'/F, P=[(L_i+L_j)/(x_i+x_j)], B=[-(L_i-L_j)/(x_i-x_j)], s=x^2, M(s)=L(x)/(2x):
1. W(v_b +- Jv_c) = b'Pb + c'Pc +- 2b'Bc. Adding the reflected ("antibridge") form removes B and leaves 2(P+P); nothing cancels in the target.
2. P+B and P-B are Loewner matrices of -M and sM in s. The two-sided bound -P <= B <= P at all orders on one interval holds iff M is a Stieltjes function iff all zeros of Xi(s)=xi(1/2+sqrt s) are negative iff RH.
3. At x=0 the jet matrix of P is 2H0 (+) 2H1 with H0=[mu_{i+j}], H1=[mu_{i+j+1}], mu_k = sum lambda^{-k-1} (Stieltjes moment pair).
4. The cutoff energy H_c equals alpha * sum_gamma y_gamma conj(y_{gamma-bar}). It is a sum of squares iff RH; without RH it is an indefinite (Krein-type) form with at most one negative direction per off-line pair.
Hypotheses: F real, even, entire of order <= 1, F(0) != 0. No Euler product is used anywhere. Items 2-4 hold verbatim for Davenport-Heilbronn and for any such F.

## Replay
- Identities 1-3 re-derived by hand; 2 is algebra valid for any L; 3 is a two-line Taylor expansion. Numerical agreement 1e-62 (mpmath 60 digits).
- Arb replay with own code: xi H0,H1 certified positive definite through order 60 (original: 100); real character mod 5 through 40; DH negative pivot at order 75 in both (original: 75, 75); mu_0, mu_1 match to all printed digits.
- Original inertia.py re-run: output identical to the table. Own planted-quartet test in zeta at height 86: exactly one negative eigenvalue for d = 0.01, 0.3, 2.0; none for d = 0 or unmodified zeta.

## Stress
- An added off-line quartet at height 100 (d <= 0.3), 150, 300, 1000 is not detected by H0, H1 through order 60. Detection order grows with zero index and with 1/d. Positivity of xi through order 100 therefore says only that roughly the first 50 zeros are on the line, which is already known.
- A node window at height 30 does not see a planted quartet at height 86. The kernel test is local zero detection.
- Tests separate functions by zero location only. chi5 passes; DH fails because of its off-line zero at 85.70; a planted zeta variant fails the same way.
- No circularity: moments come from Taylor coefficients, not from zeros.
- The internal referee's five corrections to the square-root note stand (extra term on the order-2 control; block-sign overreach; adjoint slip; domain of y_gamma; inertia equality quoted, not proved).
- "Antibridge form" is the lane author's definition. The source (PR 49) defines the antibridge as two points with no quadratic form attached.
- arXiv:2611.06705 is Baldwin-Sivek on 3-manifold decision problems. Neither repository relates it to this result; no relation exists in the material.

## Literature
Item 2 is the Stieltjes-class characterisation (Krein; Loewner) applied to the Laguerre-Polya form of RH. Item 3 at all orders is Grommer's criterion / the Stieltjes moment theorem. Item 4 is positivity of the de Branges kernel of xi + alpha xi' (Lagarias 2006) with the indefinite case covered by Pontryagin-space de Branges theory. Nearest recent paper: Sra, arXiv:2611.02944 (same variable, same order-versus-height limitation; seen by abstract only). Not found: the bookkeeping rule N*_P = min(2K0-1, 2K1) and the DH orders 75/109/110.

## Scores
- Arbitrariness 3: the Stieltjes/Hankel statement is canonical; the "antibridge" form, the anchor, the rule for failure orders and the node families are choices of the lane.
- Importance 2: restatement of classical RH equivalences with a certified table. No consequence for RH or for the de Bruijn-Newman constant. Its use is negative: the bridge/antibridge pair and the square root contain no margin and no arithmetic input.

## Label
Proved in notes, unrefereed externally (with Arb-certified finite tables). Verification: confirmed in the weaker form above; the listed "relation to arXiv 2611.06705" is not supported.
