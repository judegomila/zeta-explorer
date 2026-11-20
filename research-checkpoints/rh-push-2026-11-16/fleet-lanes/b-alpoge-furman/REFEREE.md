# REFEREE: b-alpoge-furman (Route 16 push)

Date 2026-11-16. Adversarial referee pass on `RESULT.md`. Scratch scripts: `/tmp/af_referee/{t1,t2,t3,t4,dh,audit}.py`
(interpreter `.venv-arb/bin/python`: numpy 2.5.3, scipy 1.18.1, mpmath 1.3.0, python-flint 0.9.0). Nothing else was written.

## Verdict

**The obstruction verdict holds, with five corrections.** Every step labelled PROVED was re-derived and confirmed.
No step assumes RH; verified height is not used. The MEASURED table is wrong in the 5th-6th decimal at N = 14, 16, the
Davenport-Heilbronn section is wrong about where the Euler product enters, and three statements are stated more strongly
than what is established. None of these changes the headline (0.672500704 with the 7/8 input; cap 0.6818287 + stab(r)).

## What was confirmed

1. **Proposition 1 (PROVED): confirmed.**
   - Scaling re-derived independently from Montgomery's form: r = psi_lambda * psi_lambda gives
     r(0) = lambda*int(psi^2), int r|alpha| = lambda^3 * double integral, r-hat(0) = lambda^2 (int psi)^2. Matches R_lambda.
   - Convexity: on mean-zero f the form is (1/lambda) int f^2 - 2 lambda int F^2, Wirtinger constant 1/pi^2 on an interval of
     length 1 with F(+-1/2) = 0. Positive iff lambda < pi/sqrt(2). Correct.
   - Euler-Lagrange: G(u) = psi/lambda + lambda int|u-v|psi is affine after two derivatives; evenness makes it constant, so
     cos(sqrt(2) lambda u) satisfies the integral equation, not only the ODE. mu and int psi as stated. Correct.
   - Numerics at new cases (RESULT used lambda = 0.7): lambda = 0.3, 0.85, 1, 1.6, 2.1: quadrature minus closed form
     <= 6e-26 (25 digits). A parity-free Galerkin minimisation in monomials u^0..u^9 gives values above the closed form by
     5e-21 (lambda = 0.85), 1.2e-18 (1.6): the cosine is the minimiser over non-even windows too.
   - Interval check (mpmath iv, 30 digits): C(1) in [0.672500703679411645734379790802, ...80381];
     C(0.550193964) < 0 and C(0.550193966) > 0 as intervals, so lambda_0 = 0.5501939647... The table C(0.6..1) is correct
     to all printed digits; flat values 2 - 1/lambda - lambda/3 correct; 3 - sqrt(6) correct.
2. **Proposition 2 algebra (DERIVED): confirmed** for the displayed inequality, the criterion (lambda-1)(2lambda-1)/3 and
   the optimum 2/3 + 1/(9C-6) at 1/lambda = 3(C-1)/(3C-2). See error E3 for its range of validity.
3. **Proposition 3 (PROVED given the quoted law): confirmed as an upper bound.** The quotes match
   `dl/LawN256.lean` (rational real positions, marks in {1,2}, |256 S(j) - j| <= 3e-40, |D(1)| <= 0.82395317, p_0 exact
   rational = 0.6818286874638...) and AF section 7.2 (stability constant 2.55e-6, EnclOK outside the kernel, certificate JSON
   not public). The pair amplitude 2cosh(2 pi alpha eta) was re-derived from Weil's bilinear form: with the zero set
   symmetric under rho -> 1 - conj(rho), tr(G^2) is the integral of S(b)S(-b) = |S(b)|^2, and a pair x +- i eta contributes
   2cosh(b eta)e^{ibx}. So (ii) is correct: move doubles to depth eta, form factor moves by O(eta^2), on-line fraction is p_0.
4. **AF quotes:** 0.67250 with the Montgomery-Taylor window, optimal among windows (CCLM17 Cor. 14), ceiling ~0.682,
   Remark 6.1 (R_lambda(psi_0) = 1/lambda + lambda/3 for lambda < 1), CGdL 0.6792 under RH: all present in `af.txt`.
5. **"Off-line pairs never lower the comb ceiling" (MEASURED): survives a stronger test than the one in RESULT.**
   - Independent grid LP with no column generation: N = 3 (step 0.02, depths 0.05..1.5): on-line value 0.7113676 =
     value with pairs; minimum reduced cost over 4500 pair columns against the on-line dual is +0.0152. N = 4 (coarse grid):
     same, minimum pair reduced cost +0.0414.
   - Against RESULT's saved on-line duals, N = 3..8, 10, 12, 16: the second-variation coefficient (reduced-cost change / y^2
     when a support double is split) is positive at every one of 114 support doubles: minimum +6.04, 3.91, 3.01, 2.40, 2.01,
     1.84, 1.46, 1.21, 0.89 (about 14/N: stable per point). 2736 double-to-pair conversion starts (depths 0.03..0.7) and
     2544 random starts over all pair compositions (depth bound 3): zero runs ended at depth > 1e-6.
   - New cases N = 9, 11 (not in RESULT), cold starts, seeds 7 and 11: on 0.685201909 / sym 0.685201910;
     on 0.684075466 / sym 0.684075465; maximum pair depth 0.
   - Continued column generation at N = 16 for 326 rounds with pair-escape pricing: no column with depth > 0 priced.

## Errors

**E1. The table entries at N = 14 and N = 16 are not LP optima (MEASURED numbers wrong from the 5th-6th decimal).**
RESULT's pricing (14 random starts + 0.05 jitter on the support) reported min reduced cost -3.5e-9 at N = 16. Pricing the
same dual from jittered support configurations finds on-line columns with reduced cost -2.1e-5 (N = 16) and -1.6e-5 (N = 14).
Continuing column generation from the saved laws:

| N | RESULT | referee (still an upper bound) | drop |
|---|---|---|---|
| 12 | 0.683679862 | 0.6836798614 | 6e-10 |
| 14 | 0.683167989 | 0.6831608110 | 7.2e-6 |
| 16 | 0.682843501 | 0.6828267200 (326 rounds, 420 s, still moving in the 10th digit) | 1.68e-5 |

Consequences. (a) "the optimum equals the on-line optimum to 1e-8" compares two runs warm-started from the same
under-converged law; the sym runs at N >= 6 stopped after 4-8 rounds. At N = 5 the two printed values differ by 2.1e-8, not
1e-8. (b) The fits move: (12,16) gives 0.681730, (14,16) gives 0.681735, slope 0.28 instead of 0.27. The stated
0.6817 +- 0.0002 still contains these. (c) The N = 16 dual kernel printed in section 4 is the dual of a non-optimal master and
should be treated as approximate. (d) The on-line runs at N = 5, 7, 12 hit the 200-round limit without meeting the script's
own stopping rule. (e) `comb_lp.py` has a comment "neighbours: double <-> pair conversions as extra starts" with no code
behind it; the sym runs never started from a split support double. The referee tests above did, and the finding stands.

**E2. Davenport-Heilbronn control: the Euler product enters at bandwidth one, in step (P), not first in Proposition 2.**
RESULT quotes AF section 1.4 ("inputs ... hold for Davenport-Heilbronn and Epstein") without checking it and concludes that the
mechanism yields a proportion for DH. The prime-side input is Chebyshev-Mertens for sum Lambda(n)^2/n with Lambda supported
on prime powers. For the DH function (mod 5, kappa = 0.284079) the coefficients L(n) of -f'/f were computed to n = 2e5
(`dh.py`):

| X | sum_{n<=X} L(n)^2/n | zeta: sum Lambda(n)^2/n | ratio | max |L(n)|/log n |
|---|---|---|---|---|
| 1e3 | 37.84 | 22.45 | 1.69 | 2.7 |
| 1e4 | 105.12 | 40.92 | 2.57 | 8.1 |
| 1e5 | 310.62 | 64.73 | 4.80 | 30.6 |
| 2e5 | 445.82 | 72.94 | 6.11 | 51.8 |

The diagonal grows like a power of X (as it must: 1/f has poles in Re s > 1), L(n) is nonzero on 49850 non-prime-powers,
and ||G||^2_HS = (R(psi) + o(1))N is not available. So the chain 2 - R(psi) does not transfer to DH by AF's proof. The
correct control statement is: the mechanism fails for DH at (P); the step uses the Euler product as "log-derivative
coefficients supported on prime powers with |Lambda(n)| <= log n". AF's sentence is at best a statement about the zero-side
inputs. This does not affect the ceilings (they prove nothing about zeros), but section 6 as written is wrong, and the last
bullet ("would also hold for DH-type controls with the same form factor") has no known instance.

**E3. Proposition 2: "the zero side holds for every lambda" is not supported for lambda >= 2.**
AF Propositions 4.2-4.3 carry the factor e^{L/2} = X^{1/2} from |Im gamma| < 1/2: errors X^{1/2}L^2 and X^{1/2}/T, which are
o(N) only for lambda < 2. So the optimum 2/3 + 1/(9C-6) at lambda* = (3C-2)/(3(C-1)) is justified only when lambda* < 2,
i.e. C > 4/3; "C = 1: 100%" needs lambda -> infinity and is unproved here (AF state it informally in 7.3). With Theta = 7/8 the
factor is X^{3/8} and the zero side reaches lambda < 8/3. That is the one place where the half-plane changes anything on
the zero side; it is moot without prime-pair input. RESULT lists this under weak step 3 but states the sentence as fact.

**E4. "A half-plane Theta misses the needed variance by x^{2 Theta - 1}" is the wrong measure.**
The half-plane bound h x^{2 Theta} log^2 x beats the Montgomery-Vaughan/trivial bound (F(alpha) << T^{alpha-1}, i.e. variance
<< h^2 x) only when h > x^{2 Theta - 1}, i.e. alpha > 1/(2 - 2 Theta) = 4 at Theta = 7/8. For every bandwidth lambda < 4, and
in particular on the whole range lambda < 8/3 where the zero side is valid (E3), the half-plane estimate is weaker than the
bound RESULT already lists one line above. The actual shortfall near lambda = 1 is the MV one, T^{alpha-1}. The conclusion
(7/8 does not extend the bandwidth) stands and is stronger than stated; the number x^{3/4} should be removed.

**E5. Overstatements in the verdict lines.**
- "the ceiling is the same under RH, any half-plane and any depth bound (PROVED given the law)": what is proved is that the
  same upper bound applies to all these classes. Equality of the suprema is the MEASURED comb-level finding.
- "all linear bandwidth-one certificates are capped at 0.6818287": the cap is 0.6818287 + 2.55e-6(|r'(1)| + int|r''|)
  (+0.824|r(1)|), for r in AF's regularity class. Proposition 3 carries the term; verdict item 2 and the summary drop it.
- "the 0.6725-0.6818 gap is proof-method slack": established only at comb level N <= 16 for N-periodic configurations with
  N points, by local-search pricing. The LP dual at fixed N is not a certificate on general configurations. "Not excluded"
  is the supported wording.
- "By LP duality ... a certificate with value V(N) exists that is valid on all N-periodic on-line configurations": the
  pricing is heuristic on-line as well (E1 shows it missed columns at 1e-5).

## Checks requested by the brief

- RH assumed anywhere: no. Proposition 3(i) uses RH-configurations only as a subclass.
- Verified height restated as new: no.
- Interval rigor: the only certified numbers are closed forms; C(1) and the sign change at lambda_0 were re-enclosed with
  interval arithmetic. All LP numbers are float and labelled MEASURED; no sign decision in a PROVED step depends on them.
- DH control: redone, see E2.
- Different numeric case: lambda = 0.3, 0.85, 1.6, 2.1 (Prop. 1); N = 9, 11, grid LP N = 3, 4, pair-escape pricing N = 3..16.

## Surviving claim

With Re s > 7/8 as an extra input the AF chain gives 0.672500704 simple on-line zeros and no main term changes
(unconditional AF value; the depth bound enters only the X^{1/2} -> X^{3/8} error factors). PROVED: the Gram-window chain
ceiling at bandwidth lambda <= 1 is C(lambda) = 2 - lambda/2 - cot(lambda/sqrt2)/sqrt2 over all real windows, zero at
0.5501939647. DERIVED: bandwidth lambda in (1, 2) beats 2/3 iff int_1^lambda (lambda - alpha)F < (lambda-1)(2lambda-1)/3;
the half-plane gives no bound on F better than Montgomery-Vaughan for lambda < 4. QUOTED + PROVED given the law: every
linear bandwidth-one certificate valid on on-line configurations, hence on any larger class, certifies at most
0.6818287 + stab(r); the same bound holds for certificates of the on-line count at every depth bound delta > 0; no
every-zero upgrade. MEASURED: comb optimum reproduced for N <= 16 with corrected values at N = 14, 16 (0.6831608,
0.6828267), extrapolation 0.68173 (inside 0.6817 +- 0.0002); no off-line column ever prices in. The mechanism fails for
Davenport-Heilbronn at the prime-side second moment (P). RH open.
