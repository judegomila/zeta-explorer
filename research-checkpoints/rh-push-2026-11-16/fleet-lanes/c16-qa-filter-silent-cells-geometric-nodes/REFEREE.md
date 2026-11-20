# Check of c16-qa-filter-silent-cells-geometric-nodes (same-lane second pass)

Status: written by the lane's own agent after RESULT.md, with a second script (`ref_check.py`) that uses routes
different from `checks.py`. This session had no means to start a separate agent, so this is **not an independent
referee**. An independent referee is owed; `lanes.jsonl` records referees = 0. Nothing here is a statement about
zeros of zeta.

## 1. Re-derived by a different route

| item | route | result |
|---|---|---|
| m real, positive at s = 1, 0, 3 and the first five trivial zeros (data d2, d3, d4) | m as a product over its eight points in s (not the t^2 form), pair 100, 101, eta = 0.25 | minimum 1.0000159, imaginary part 2e-33 |
| ZQ has one zero right of the line and the same count across it | argument principle, 1600 boundary points, pair 100, 101 | across: ZQ 2, zeta 2; 0.6 < Re s < 1.3: ZQ 1, zeta 0 |
| Lemma C (ii), heat average with t >= 0 | Gaussian quadrature along the horizontal line for xi and xi m at three (z, t) | differences 2.8e-13, 2.5e-17, 5.2e-10, each below B E abs(F) (5.5e-13, 3.2e-17, 7.5e-9) |
| Section 3.3, Schur property of M_ZQ | Pick matrices at 6 and 9 random nodes (seed 1601), one node placed next to a quartet point | ZQ +2.8e-9, +8.7e-22; zeta +4.0e-10, +5.8e-22; anti-control -1.5, -12.3 |
| Proposition M, eta(eps) | closed form inserted back into the bound | bound returns eps at 1e-6, 1e-4, 1e-2 |
| density D against the bound | `checks.py` block A at three parameter sets; two of them coincide with the independent referee of the ZQ lane (0.200445; 1.971e-3) | bound holds; ratios 0.639, 0.704, 0.960 |
| table counts | `build_table.py` asserts the 71 indices against the node files and recounts | 71; classes 31/18/9/8/5; outcomes 31/5/6/11/3/12/1/1/1 |

## 2. Findings against the first draft of RESULT.md (all applied)

1. **Lemma QA (c) overstated.** The draft said NR-q "has the atoms of L(s, chi) at every power of every rational
   prime". In the functional-equation-centred normalisation m_z is unbounded to the right and there is no
   coefficient measure on [1, inf) (referee E4 of the ZQ lane says the same of F3, F4). Rewritten as a statement
   about the generalised Dirichlet series on the cosets q^j N.
2. **Data (d4) was not well defined** (it referred to an interval depending on the control). Rewritten: count up
   to 1 at all T, and the zeros below a fixed height exactly; the lemma then takes the pair above that height.
3. **Cell count in the outcome paragraph** did not match the cell table (9 / 2 / 5 against 3 / 4 / 4 / 3 / 2).
   Corrected to the table.
4. **Section 7 and 4.3 claimed the Q-A passes lie on classes c and Z only.** Nodes 205 and 342 are class L.
   Also the sentence "none carries a recorded control failure" suggested a test that does not exist: ZQ has no
   recorded run on any node. Both sentences rewritten.
5. **Node 403** was given outcome ZQe although the node does not display its hypothesis. Changed to NR.

## 3. Points an independent referee should attack first

- **Lemma QA is nearly a tautology once "atom-read" is defined; the content is in the reading.** Whether a given
  node or cell is atom-read is decided from a few lines of text. The five ZQa rows (30, 55, 104, 292, 342) and
  the cell U6 (g) should be re-read against their sources, not against the node statements.
- **Corollary K and the compute slot.** The statement is the flow-blindness wall applied to a compact parameter
  set. It does not say that the searches are without value as records; it says a survivor is not a device with
  R3. A search whose aim is to find a pattern that extends to an unbounded family is outside it. The continuity
  in tau of the kernel with polar terms was not checked numerically.
- **Section 3.3.** The Schur property is taken from Theorem E1' of the c15 Klein lane (one referee) with the
  growth hypothesis "as for xi"; it was not re-proved. The Pick eigenvalues are positive but small (down to
  8.7e-22 at 30 digits; the noise level is about 1e-28). Maass-Selberg positivity for ZQ is not proved and was
  not tested, because the normalisation of S in Theorem B was not opened.
- **Lemma C (ii)** defines the flow of the ZQ function by the Gaussian average of the entire function xi m. That
  the certificates in the nodes (computed for zeta with the Polymath error terms) "transfer" means only that
  the certified statement holds for ZQ; no certificate was recomputed.
- **Lemma R** matches one scalar. A device that reads two exact scalars (for example the residue and one
  special value) is not covered.
- **The five NCP rows and their inputs** are judgments. In particular "U6 (c): the TRO6 type of statement" rests
  on the brief's description, not on a source opened here; "U6 (e): ZQ and NR-q have no realisation in the
  Bost-Connes algebra" is a reading of the algebra's definition.
- **Pattern claim (outcome 5).** "Each NCP cell reads the additive structure of the integers through its
  carrier" is READ on five cells; it is not a classification, and the cell list itself is not shown complete
  (STRATEGY 4.0 says so).

## 4. Requirement flags (this pass)

R1 false, R2 false, R3 false, R4 false. RH is not assumed; verified height is not restated (the zeros used, 1, 2,
100, 101, 298 to 301, 6709, 6710, are on the line by computation). No known theorem is presented as new: Corollary K
is labelled as an application of the flow-blindness wall, J3 as row Z36 for all members.

## 5. Verdict of this pass

The numerics hold. Lemma QA, Lemma C (i), (ii), Lemma R, Proposition M and J2, J3 hold as far as this pass can
see; section 3.3 holds given the statement it cites; the table is a reading by one reader with the five
corrections above applied.

---

# Independent referee (lens: general), 2026-11-19

Separate session from the lane. Every PROVED step of RESULT.md was re-derived on paper; one numeric run was made
with cases not used by the lane (local, `scripts/memcap.sh 8`, mpmath 30 digits, 124 s, script kept outside the
repo). Nothing below is a statement about zeros of zeta. The same-lane pass above is left unchanged.

## R1. Verdict

**Holds, with corrections E1 to E7.** No PROVED step failed. The errors found are in two summary sentences
(E1, E2), in labels and citations (E3 to E6) and in one unstated side condition (E7). The verdict
"precise-obstruction, as a filter and a table" stands. The table itself remains a reading by one reader; this
referee re-read 8 node statements, not 71.

## R2. Re-derivations

| step | result |
|---|---|
| m and its zeros | With t^2 = -(s-1/2)^2 and t = gbar - i eta: t^2 + gbar^2 + eta^2 = 2 gbar t, so the numerator vanishes at the quartet. Confirmed. |
| numerator minus denominator | N - Dn = (eta^2 + d^2)(2 t^2 + 2 gbar^2 + eta^2 - d^2). Confirmed by expansion. |
| Lemma QA (a), (d1) to (d3) | m is rational in s(1-s), real, m -> 1; poles cancelled by zeros of zeta (also when a zero is multiple). Confirmed. |
| (d4) | On the real axis t^2 <= 0: both denominator factors negative, numerator a square plus -4 gbar^2 t^2 >= 0 and not 0. Count: 0 below g1, -1 on (g1, gbar), +1 on (gbar, g2), 0 above. Confirmed. |
| (d5), density D | D = sum over removed of x^(rho-1) minus sum over added = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(d L)), valid for Re s > 1/2 + eta. Confirmed, signs included. |
| Lemma QA (b), both bounds | cosh(eta L) - 1 <= (eta L)^2 e^(eta L)/2 and 1 - cos(d L) <= (d L)^2/2 give abs D <= 2 (eta^2 + d^2) L^2 e^(-(1/2 - eta)L); the maximum of L^2 e^(-aL) is 4 e^-2/a^2; the integral of L^2 e^(-bL) is 2/b^3. Both constants confirmed. Needs sigma_0 > 1/2 + eta (true for small eta). |
| Lemma QA (c) | m_z(1-s) = m_(conj z)(s); zeros from y + 1/y = -c with w = z y; abscissae 1/2 +- arccosh(c/2)/log q, inside the strip iff c < q^(1/2) + q^(-1/2) = 2.19737. Cosets N/q, N, qN are disjoint (q and q^2 irrational). Confirmed. |
| Proposition M | First sentence follows from (b) and small gaps. Quantitative form (hypothesis nu_G >= nu_zeta - eps dx, a sup condition): confirmed; eta(eps) solves 8 e^-2 eta^2/(1/2 - eta)^2 = eps. See E1 for the norm p. |
| Lemma C (i) | abs(t^2 - g^2) >= g^2 + y^2 - z^2; 2 y^2/(a + y^2)^2 <= 1/(2a). The "+1" is valid for every d because 0 < 2 gbar^2 + eta^2 - d^2 <= 2 gbar^2 + 1/4 (d < gbar); the proof line does not say this. Confirmed. |
| Lemma C (ii) | E F(z + i sqrt(2t) N) = sum F^(2j)(z)(-t)^j/j! (checked on F = cos(az): both sides e^(a^2 t) cos(az)); shift is horizontal in s; the Gaussian dominates the growth of xi. Confirmed for t >= 0. |
| Lemma R | m(1) formula confirmed; abs(cos(gL) - cos((g - delta)L)) <= delta L gives sup <= 8 delta/e. See E7. |
| Section 3.3 | Cocycle, unitarity on the axis and pole location confirmed. The Schur property was proved here directly, without the cited theorem: see E3. |
| J2, J3, K | J2: log g is quadratic. J3: m_z = c + 2 Re(conj(z) q^(it)) on the line. K: tube lemma on a compact parameter set plus Rodgers-Tao. Confirmed. |

## R3. Numeric run with different cases

| check | case (not used by the lane) | result |
|---|---|---|
| sup abs D against min(8, quadratic bound) | pairs (10, 11) eta 0.2; (34, 35) eta 0.45; (50, 51) eta 0.3; grid step 1e-3 in L up to 60 | 3.389, 1.762, 3.265; all below 8 (quadratic bounds 31.2, 165.0, 58.9) |
| Laplace identity by direct quadrature at s = 1.4 + 3.1i | same three | defects 6e-34, 9e-32, 6e-35 |
| weighted integral, sigma_0 = 1.2 | same three | 3.38, 3.53, 3.76 against 83.0, 97.6, 136.0 |
| m(1) - 1 against the closed form | same three | agree to 8 digits (1.968e-3, 6.135e-5, 2.084e-4) |
| Lemma C (i), 4000 random points per pair, abs y from 1e-2 to 1e4, abs z up to 0.999 g1 | same three | largest ratio abs(m - 1)/B: 0.745, 0.911, 0.856 |
| ZQ at the quartet point and next to a removed zero | same three | 0 to working precision; 1.15, 0.72, 2.83 (zero removed) |
| sup abs M_ZQ on a grid in Re u > 0 | pair (10, 11), eta 0.4 | 0.9788 |
| Pick matrices, 7 and 10 nodes, seed 424242, eigenvalues at 60 digits | same | ZQ +1.5e-4, +2.0e-8; zeta +1.7e-4, +5.7e-9 |
| NR-q zero | c = 2.19, arg z = -2.5 | zero at 0.990724 + 0.727946i, abs m_z = 1e-31; minimum on the line 0.19009 = c - 2 |
| NR-q with c above the stated range | c = 2.3 | zero at Re s = 1.1139: outside the strip, so the upper limit on c is needed, as stated |
| Lemma R | pair (50, 51), eta 0.3, moved zeros 60, 61 | delta = 8.556e-3, compound m(1) - 1 = 4e-31, added sup 0.02455 <= 8 delta/e = 0.02518 |

## R4. Errors and corrections

- **E1 (outcome item 2; Lemma QA (b) against Proposition M).** eta(eps) = (r/2)/(1 + r) is the reach for the sup
  term alone. In the norm p of Lemma QA (b) (sup plus weighted integral) the reach is smaller: at sigma_0 = 1
  the condition p <= eps gives eta = 1.66e-4, 1.65e-3, 1.58e-2 at eps = 1e-6, 1e-4, 1e-2, against 4.80e-4,
  4.76e-3, 4.38e-2; leading order 0.166 sqrt(eps), not 0.48 sqrt(eps), and the constant depends on sigma_0.
  At eta(eps) the bound on p is 8.4e-6 for eps = 1e-6. Item 2 of section 0 ("with a margin eps in the density
  norm ... zeros at distance up to eta(eps)") must either say "sup norm" or use the p-reach. Proposition M's
  quantitative sentence is stated with a sup hypothesis and is correct; the statement of Lemma QA (b) in
  section 2.2 is correct.
- **E2 (outcome item 5 and the verdict sentence "five rows ... each of which reads the integers as an additive
  set").** The cell table gives Q-A = "no" for all four U4 rows and "yes (b)" for U3-4. The pattern claim holds,
  as a reading, for U3-1 to U3-3 and U6 (c), (e), (f) only. The U4 residual is one of the five explore candidates
  of section 5 and does not answer yes to Q-A (a). The entry condition drawn from the pattern (round-17 item 2)
  is therefore not supported for U4 by this table; it is supported there only through Proposition M, which is
  a statement about the ZQ family and says nothing about joint functionals of twists.
- **E3 (section 3.3, label).** The Schur property does not depend on the cited Theorem E1'. Direct proof: for
  g(w) = f(1/2 + w), even, real, order 1, with sum over zeros of abs(lambda)^-2 finite, g(w) = g(0) prod over
  pairs +-lambda of (1 - w^2/lambda^2), so M(u) = prod of ((u - 1/2)^2 - lambda^2)/((u + 1/2)^2 - lambda^2),
  absolutely convergent (each factor is 1 - 2u/((u + 1/2)^2 - lambda^2)). Each factor is
  (u - a)(u - a')/((u + a)(u + a')) with a = 1/2 + lambda, a' = 1/2 - lambda, and over a conjugate quartet it is
  a product of four half-plane Blaschke factors when Re a, Re a' > 0, that is abs(Re lambda) < 1/2. So M is
  Schur for every such f. Two consequences: the label can be PROVED without "given a statement on file"; and
  the property is a fact about any entire f of this type with zeros in the open strip (for f = xi it is a
  standard unconditional fact), so "ZQ is Schur on the scattering carrier" records that the Schur condition at
  shift 1 carries no zero information. It is not a new property of ZQ.
- **E4 (Lemma C (i), classical input).** "Zeros of zeta on the line exist at every height (Hardy)" is not enough:
  the bound tends to 0 only if d/g1 -> 0 along the pairs. The input needed is a zero on the line in every
  interval (T, T + T^a) with a < 1 (Hardy-Littlewood) or Selberg's theorem. Also "holds with strict inequality"
  must mean a condition open in the uniform topology on a neighbourhood of the compact set, with s = 1 excluded
  when values of G are read.
- **E5 (Proposition F4, label).** "PROVED as stated" covers the compilation only. Rows Q-P, Q-B, Q-S are quoted
  (not re-derived by this referee either), and row Q-H rests on Lemma J1', which has one derivation on file.
  The label should read "PROVED given the quoted lemmas".
- **E6 (J2, normalisation).** The brief defines HEAT as e^(tau u^2/16) kappa; J2 uses log g = tau u^2/4 and
  `checks.py` uses the kernel Phi(u) of H_t. The size of the second-derivative shift depends on this; the sign
  and the invariance of orders >= 3 do not. State the variable.
- **E7 (Lemma R, side condition).** "The compound has every property (d1) to (d5)" needs the intervals
  (h3, g3), (h4, g4) disjoint from each other and from [g1, g2]; otherwise the count can differ by 2 and (d4)
  fails. True in the measured case (delta = 4.5e-5) and in mine (8.6e-3); it should be in the statement. The
  existence of delta is by the intermediate value theorem on (0, g3) and needs
  1/m(1) > m_2(1) at delta = g3, which holds in all cases at hand and is not written.

## R5. Other checks

- RH is not assumed anywhere. Zeros used by the lane and by this run are located on the line by computation.
- Verified height is not restated as a result: Lemma C names a control for finite certificates and says so.
- Known results presented as new: none claimed as theorems about zeta. Lemma QA is a verification that ZQ has
  a list of data chosen so that ZQ has them ((d4) is "count up to 1" for that reason); moving finitely many
  zeros by a rational function of s(1-s) is standard. Proposition M is a continuity statement. Corollary K is
  labelled as the flow-blindness wall. With E3, section 3.3 is also a standard fact.
- Zeta-only mechanism: none is claimed, so there is no device to run the control battery against. The control
  constructions themselves (ZQ at four parameter sets, NR-q at two) were run above and behave as stated.
- Table arithmetic recounted from `TABLE.md`: 71 rows, 15 marked 2R; outcomes 31/5/6/11/3/12/1/1/1; classes
  31/18/9/8/5; cells 3 + 4 + 4 + 3 + 2 = 16. Confirmed.
- Node statements re-read (30, 55, 104, 205, 271, 292, 342, 84) from `silent71_text.json`: the readings are
  consistent with the two or three lines available. For 292 and 104 "atoms only" depends on reading c(p^k) as
  atoms of the logarithm and not as ordinary coefficients (referee E2 of the ZQ lane stands). For 342 the term
  beta(H) is not displayed in the node; if it reads anything of G beyond the gamma factor the row is not ZQa.
  For 271 the pass says only that ZQ meets both inputs of a bound for Lambda. These were checked against the
  node text, not against the sources.
- The 15 twice-read rows were not typed blind (stated by the lane). They are a consistency check only.

## R6. Requirement flags (set by this referee)

- R1 false: no argument about zeta; multiplicativity is a property the controls keep.
- R2 false: no statement at height.
- R3 false: the result shows controls passing; no step is shown to fail for every control.
- R4 false: nothing passes to the critical line.

## R7. Surviving claim

Lemma QA (a), (b), (c), Lemma C (i), (ii) for t >= 0, Lemma R (with the side condition of E7), Proposition M in
its sup form, J2, J3, K hold. M_ZQ is Schur unconditionally (E3). The node table (71 rows) and cell table (16
rows) are internally consistent readings by one reader. Not surviving as written: the reach eta(eps) in the
norm p (E1), and the pattern sentence for all five explore candidates (E2; it covers U3-1 to U3-3 and
U6 (c), (e), (f)).
