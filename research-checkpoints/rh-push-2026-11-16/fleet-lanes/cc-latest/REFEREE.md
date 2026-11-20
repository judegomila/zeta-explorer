# Referee report: cc-latest/RESULT.md

Date: 2026-11-16. Referee verdict: the PROVED claims survive. Errors found are local (two proof-text gaps,
both repaired below; one wrong citation detail; two overstated measurement summaries). Claimed class
"partial-result" is accurate, with the qualification that every proved statement is Euler-blind and
Theorem A/B are reformulations of classical Nevanlinna-Pick facts.

## 1. Theorem A (re-derived)

Identity (D): (XP' + P'X)_ij = (x_i + x_j) P'_ij = l'_i + l'_j. Correct. P' = P - eps S has data l - eps/2. Correct.

Part 1. Re-derived: with 1^T u = 0 and Xu = c - z0 u, u^*(XP'+P'X)u = 0 and equals -2 Re(z0) u^*P'u. Correct.
- GAP: u = (z0 + X)^{-1} c is undefined when z0 = -x_j, which can be a zero of V only if c_j = 0. The text does
  not treat this. Repair: set u_k = c_k/(x_k - x_j) for k != j and u_j = t with t chosen so 1^T u = 0. Then
  Xu = c - z0 u still holds, the same computation gives u^*P'u = 0 (z0 real, nonzero), so u = alpha c, which
  forces c = e_k or c = 0, the same contradiction. Consequence (not in RESULT.md): under simplicity every
  c_j != 0. Numerically confirmed (min |c_j| > 0 in 120 cases).
- The degenerate case c = e_j => l' = 0 => P = eps S => multiplicity N. Correct.

Part 2. Correct.

Part 3. The claim is correct; the written proof of the spectral identification is not. X_H = X - w y^T with
y = X1/(1^T w), not "a large multiple of 1". Direct computation:
det(lambda - X_H) = det(lambda - X) * lambda * (1^T w)^{-1} * sum_j w_j/(lambda - x_j), and with lambda = -z and
1^T c = 0, sum_j w_j/(lambda - x_j) = z V(z). So on C^N the spectrum is {0, 0, -zeros of V}; one 0 is the
quotient C^N/H (1^T X_H = 0), the other is c. Matches #roots = N - 2 in the logs. When N is odd and type II,
V(0) = 0 (observed in every such case), so 0 has higher multiplicity on H; the statement "other eigenvalues"
should say so.

Rerun on different cases (independent code, mpmath 1.4.1, 150-200 digits, polynomial roots and a pencil
solver): 60 random node sets in [0.1, 5] with Gaussian data, N in {2,..,12}, min and max eigenvalue:
120 cases, 0 violations (max |Re z| < 1e-60, (1^T c)(l'^T c) < 1e-60). Both types occur. Interior
eigenvalue: real zero pairs appear, as stated. Euclidean-norm remark: zeros in Re z < 0 whenever eps < 0 in
all 8 cases tried, as stated.

## 2. Theorem B (re-derived)

- Monotone: nested subspaces. Correct.
- Bounded below => RH: prefix Pick matrices of L + C PSD => positive-real interpolants G_N, fixed value at x_1
  => normal family => positive-real G = L + C on the nodes => identity theorem on (Re z > 0) minus poles of L
  (connected) => poles removable. Correct. xi has no real zeros, so the node hypothesis is vacuous for zeta.
- RH => eps_N >= 0: L = sum 2z/(z^2 + gamma^2). Correct.
- lim <= 0: L odd, regular at 0, L(0+) = 0, so L - t is not positive-real for t > 0. Correct.
No step uses RH silently. The statement is a restatement of "Pick positivity of L <=> RH" plus the
observation that a constant shift cannot rescue a pole; it is not a weakening with analytic leverage.

## 3. Theorem C

Stated as PROVED under RH, sketched. The normal-family and uniqueness steps are correct; vague convergence
of Herglotz measures from locally uniform convergence of positive-real functions is standard. The m_inf z
term and mass at infinity do not affect vague convergence on R. Acceptable as labelled. It needs no
simplicity (the extremal interpolant exists whenever P' >= 0 is singular).

## 4. Measurements (rerun with different test cases)

- zeta, 12 random nodes in [0.3, 4]: eps = 2.9e-34, type II, 10 zeros, max |Re|/|z| = 3.6e-160,
  tau_1 = 14.1347257 (err 6e-7), tau_2 = 21.047.
- zeta, 16 equispaced nodes in [2, 7]: eps = 6.4e-30, tau_1 err 4e-11, tau_2 err 4e-5.
- Table entries in RESULT.md section 3 and 4 match run1.log / run2.log line by line.
- OVERSTATED: "gap/eps between 1e3 and 1e5 in every run". The [0.05, 3] runs give 2.6e5 (N=10) and 1.6e6 (N=18).
- UNLOGGED: the arbitrary-data control ("N = 5, 11 type I; N = 8 type II", "1e-108") has no log line except
  the N = 8 lossless check. My randomized rerun supports the qualitative claim (both types occur).
- RESULT.md says mpmath 1.3.0; the interpreter that produced the .pyc (python 3.14) has 1.4.1. No effect.

## 5. DH control

Rerun: DH, 12 equispaced nodes in [1, 8], 60 digits: eps = 1.5e-13 > 0, type II, approximants 5.0941600,
8.9426, all on the line. Consistent with section 4 of RESULT.md. The note claims no statement that
separates zeta from DH: Theorem A holds for any data, Theorem B gives eps_N(DH) -> -infinity (DH has
off-line zeros, hence a pole of L in Re z > 0), Theorem C is conditional. The control is satisfied in the
only available sense: nothing proved here would be false for DH, and nothing proved here has RH content.
Unchecked by the author and by me: real zeros of the completed DH function on the node intervals.

## 6. RH assumptions and verified height

Theorem C is the only RH-conditional statement and is labelled. eps_N > 0 for N <= 26 is not presented as
new; it is implied by verified height via the Pick lane. No violation.

## 7. Survey

Checked against arXiv abstract pages: 2511.22755 (CCM, rank-one perturbation, self-adjointness via
Caratheodory-Fejer, convergence unproved), 2602.04022 (Connes survey; "primes less than 13", 2.6e-55..1e-3;
approximants proved on the line), 2608.24827, 2607.02828, 2609.20367 exist with the stated content.
- ERROR: "Connes-van Suijlekom, CMP 406 (2025)" is not supported. The paper is arXiv:2511.23257 (28 Nov 2025),
  no journal reference listed. It is also missing from the Sources list.
- Theorem numbers (CvS 6.1, CCM 5.10, Cor. 3.8, survey Thm 7.1) were not checked against full texts by the
  author or by me.
- "Nothing published 2024-2026 changes the obstruction" is an assessment from abstracts, not a proved
  statement. It is labelled as such in the body; the headline should carry the same label.

## 8. Is the obstruction real

The ln 2 obstruction concerns the Sonine-compression route. I see one route that does not meet it: the
CvS/CCM extremal-eigenvector route (no Sonine space, no semilocal trace). RESULT.md already takes it and
shows where it stops: simplicity plus a lower bound on eps_N, the latter equivalent to RH (Theorem B) and
Euler-blind in every finite order. So it is a way around the Sonine wall that lands on the same missing
estimate, not an escape. No other way around found.

## Verdict

holds = true. Surviving claim: Theorems A, B as stated (with the two proof repairs above), Theorem C as a
sketched RH-conditional statement, the measurements as MEASURED, and "no 2024-2026 CC result changes the
ln 2 Sonine picture" as an abstract-level survey assessment. No new arithmetic input, no zeta/DH separation.
