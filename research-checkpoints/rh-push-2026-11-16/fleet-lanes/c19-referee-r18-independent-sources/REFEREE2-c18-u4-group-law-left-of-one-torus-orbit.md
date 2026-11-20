# REFEREE2 (second, independent) for c18-u4-group-law-left-of-one-torus-orbit/RESULT.md

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Written from RESULT.md and the lane's scripts; the first
referee file was opened only after sections 1 to 3 were fixed (section 4). No statement about zeros of zeta is made by the lane or here.

**Verdict: holds with corrections.** The obstruction stands. One PROVED sentence is wrong as an equivalence (Lemma GL (b)); the
direction that the lane uses is correct. Flags set by this referee: R1 false, R2 false, R3 false, R4 false.

## 1. Required check: is the group-law step atom by atom, and does any displayed inequality use a cross-prime relation?

Every displayed inequality of the lane was read for the place where two different primes could interact.

| Displayed inequality | What it uses | Cross-prime relation |
|---|---|---|
| (C-F): T(sigma, t; U) >= 0 | T = sum over n of Lambda(n) n^-sigma v_U(log n) 2 (1 + cos(t log n))^2; each term is >= 0 by itself | none |
| T_v(sigma, t) >= 0 (section 2.4) | the same with a general weight v >= 0 | none |
| Lemma GL (b), family version | for each n separately: sum_k a_k Re Lambda_k(n) >= 0 for non-negative cosine polynomials | none |
| Lemma S: v(u) <= v(0+) e^(-au) | Bochner applied to the weight v; no arithmetic | none |
| Lemma V: M(1 - sigma)/M(beta_0 - sigma) >= exp((1 - beta_0) ubar) | log-convexity of the Laplace transform of v >= 0; a_1 < 2 a_0 (Fejer) | none |
| Theorem T | local behaviour of -zeta'/zeta and log abs(zeta) at a zero | none |
| control rows (T-NR, NR-q, HEAT at n = 6, ZQ, SG, BLS, DH) | sign of one coefficient or of a density on a gap | none |

The only relation between atoms that is true for zeta and present in the setting is t log(p^k) = k (t log p) (powers of one prime) and
log(mn) = log m + log n. The inequality does not use either: the atom n enters with its own angle t log n and is non-negative alone.
The identity side (Identity E) uses the Euler product only through -zeta'/zeta = sum Lambda(n) n^-s, that is, through the sign and
support of Lambda. So the required check gives: **the group-law step is positivity atom by atom; no displayed inequality uses a
cross-prime relation.** R1 false is established for this read.

Precise form of the atom-by-atom statement (this is the correction C1): the family of inequalities
sum_n g(n) sum_k a_k Re Lambda_k(n) >= 0 (all g >= 0, all non-negative cosine polynomials sum a_k cos(k theta)) holds if and only if,
for every atom n, the even real sequence k -> Re Lambda_k(n) is positive definite, Re Lambda_k(n) = integral cos(k theta) d mu_n,
mu_n >= 0. The lane writes "k -> Lambda_k(n) is positive definite". Counterexample to that "only if": Lambda_0 = 1, Lambda_1 = i,
Lambda_k = 0 for k >= 2: every inequality holds (it reads a_0 >= 0), and the Hermitian sequence has symbol 1 - 2 sin(theta), minimum -1
(`local/misc_checks.json`). The "if" direction is the one used in section 3 and is correct.

## 2. Re-derivations

- M_U(z) = (X^z - 1 - zU)/(z^2 U): confirmed by integration.
- Identity E: confirmed by residues (double pole at z = 0 gives -zeta'/zeta(s) - (zeta'/zeta)'(s)/U; pole of zeta gives
  + X^(1-s)/((1-s)^2 U); zeros give - X^(rho-s)/((rho-s)^2 U); the part -1/(z^2 U) - 1/z moved right gives 0). The rewriting
  "first three terms = M_U(1-s) + L*(s) + L*'(s)/U" confirmed term by term.
  Numeric (mpmath 30 digits, 400 zeros and conjugates, own code, points not in the lane): defect 2.4e-5 at (0.7, 21.3, X = 25, a prime
  power), 1.5e-6 at (0.85, 3.0, X = 40), 4.2e-6 at (0.6, 30.4249, X = 30); all inside the truncation scale. The three-point form
  3 S + 4 Re S + Re S equals the termwise form to 5e-15.
- Bounds in (C-F): abs(4 Re M_U + Re M_U) <= 5 ((X^(1-sigma) + 1)/(t^2 U) + 1/t) holds (abs z >= t and >= 2t); the gamma-term bound
  holds for X >= 1.3.
- Table row check by hand: at sigma = 0.75, t = gamma_1 the on-line zero at member k = 1 gives -4 X^(-1/4)/(U/16) = -8.04 (lane: -8.0283
  for the whole zero sum).
- Theorem T: confirmed for fixed translates with positive weights and no pole in Omega + i tau_j.
- Lemma S: Re M(a + iy) is half the transform of f_a(u) = v(abs u) e^(a abs u); non-negative transform and continuity at 0 from the
  right give abs(f_a) <= f_a(0) almost everywhere; (i) by multiplication with the positive-definite function e^(-c abs u). Confirmed.
- Lemma V: confirmed (convexity of log M; for order m the bound is log(m a_1/a_0)).
- integral of M(a + iy) dy = pi v(0+): confirmed. sup of x (2 - 3 g(x)) = 0.1117 at x = 0.42: confirmed by hand.
- T-NR (3, 2.2): from the printed values, Lambda_F(3^k)/log 3 = 1 + (-1)^(k+1)(a^k + b^k) with a + b = 2.2 sqrt 3 = 3.8105 and ab = 3
  reproduces 4.81, -7.52, 22.03 (k = 1, 2, 3): the sign at 3^2 is negative because both roots are negative. Confirmed.

## 3. Corrections (sentence to use)

| # | Where | Status | Sentence to use |
|---|---|---|---|
| C1 | Lemma GL (b) | ERROR in one direction of the "iff" | "The inequalities hold for all g >= 0 and all non-negative cosine polynomials if and only if for every atom n the sequence k -> Re Lambda_k(n), extended evenly, is positive definite: Re Lambda_k(n) = integral of cos(k theta) d mu_n with mu_n >= 0. For (zeta, L(chi), L(chi^2), ...) at the points s + ikt, mu_n = Lambda(n) times the unit mass at arg(chi(n) n^-it)." |
| C2 | Section 4, R1; proposed map row | wording | "Lemma GL: the family of all such inequalities is the positivity of Lambda (shifts) or positive definiteness of k -> Re Lambda_k(n) atom by atom (characters); no relation between primes is read." |
| C3 | Lemma V, summary sentences | restriction | "A simple zero at distance delta from Re s = 1 can exceed the pole term in the 3-4-1 mechanism only if the mean log-length of the test is below log 2/delta (log(m a_1/a_0)/delta for order m)." |
| C4 | Section 2.3, application paragraph | scope (found by the first referee; checked and agreed here) | "For the triple sigma + ikt, k = 0, 1, 2, the same local computation gives: a lower bound with B locally bounded in (sigma, t) on a strip holds if and only if the strip is zero-free (member 0 is finite because zeta has no zero on (1/2, 1))." |

Not re-derived by this referee: the continuation of DEL and THIN (map rows), the functional equation of the lifted G_+ members, the
server table (float64 record; the lane says it decides nothing).

## 4. Comparison with the first referee (opened after sections 1 to 3)

Same verdict. C1 here is its E1 (same counterexample, found independently). Its E2 (Theorem T does not literally cover the triple
because member 0 does not move and member 2 moves at double speed) was not found by this pass; checked and agreed (C4). Its E3
(local boundedness in Lemma S), E5 (C3 here), E6 and E7 are agreed. Nothing in this pass contradicts the first referee.

## 5. Flags

R1 false (section 1). R2 false: (C-F) holds at every t and concludes nothing about zeros. R3 false: E_a and the G_+ lift pass steps
(1) to (3) (E_a re-derived: Lambda_k(n) = chi^k(n) Lambda(n)(n^a + n^-a), real parts positive definite in k). R4 false: no
continuation step. Referees on this lane after this file: 2, both hold with corrections. PROVED labels broken: 1 (Lemma GL (b), one
direction; not used by the verdict).
