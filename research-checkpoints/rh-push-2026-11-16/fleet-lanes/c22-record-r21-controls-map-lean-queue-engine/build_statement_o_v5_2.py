"""c22-record-r21-controls-map-lean-queue-engine: Statement O version 5.1 -> 5.2 (campaign/STATEMENT_O.md).
Exact replacements, each asserted to occur once; previous file: before/STATEMENT_O.md in this lane's directory.
Quoted sentences of referee files are checked to occur in those files (markdown markup and line breaks removed)."""
import os, re
B = 'tmp/research-2026-11-16'
LANE = 'c22-record-r21-controls-map-lean-queue-engine'
src = os.path.join(B, 'push', LANE, 'before', 'STATEMENT_O.md')
dst = os.path.join(B, 'campaign', 'STATEMENT_O.md')
s = open(src, encoding='utf-8').read()
assert s.startswith('# Statement O, version 5.1: record of obstructions')
def norm(t):
    return re.sub(r'\s+', ' ', t.replace('`', '').replace('**', ''))
def quoted(path, sentence):
    t = norm(open(os.path.join(B, path), encoding='utf-8').read())
    assert norm(sentence) in t, (path, sentence)
NRQ = 'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/nrq-line15/REFEREE2.md'
L11 = 'push/c21-statement-o-line11-control-table-40-digits-server/REFEREE.md'
Q15 = 'Holds as a statement about the object (PROVED-2)'
Q15b = "The construction holds, with two corrections of wording."
Q11 = "finite-rectangle Cauchy identities; the identity with the sum over all zeros is CLASSICAL for zeta, DH, E_a, T-NR and not established for HEAT"
Q11b = "Holds as a certified conversion, with the corrections E1 to E6 (none changes a cell)."
quoted(NRQ, Q15); quoted(NRQ, Q15b); quoted(L11, Q11); quoted(L11, Q11b)
R = []
def rep(old, new):
    R.append((old, new))
# ---- header
rep('# Statement O, version 5.1: record of obstructions\n',
    '# Statement O, version 5.2: record of obstructions\n\n'
    '**Version 5.2, 2026-11-20 (lane `' + LANE + '`; record lane, no attack).** This file is version 5.1 '
    '(`push/' + LANE + '/before/STATEMENT_O.md`, a copy of the file as found) with four changes, each marked "(version 5.2" in place; '
    'they are the items owed to this file by the round-21 list (`campaign/ROUND_LOG.md`, round 21, "Owed"). '
    '(i) Line 15, relabel ARGUED -> PROVED under the label rule, as a statement about the object NR-q, on the second referee file '
    '`' + NRQ + '`; its two corrections of wording (sign of c; normalisation) are entered in the fields of the line. '
    'The clause "which device reads only this class" stays ARGUED, per device. '
    '(ii) Line 10, the thresholds of the written statement of MV-CAP: for mean-square premises the room needed is 2s + s^2 with s = 2E + E^2 '
    '(the source asks for 3s), sigma\' > sigma strictly for bounds on log F and F\'/F, 2m zeros on the zero side, the factor 2 in the '
    'threshold of item (3), and the two corrections of the source referee that version 5.1 did not carry '
    '(corrections E1 and E2 of the campaign referee of the c21 record lane). The label of line 10 is unchanged (ARGUED). '
    '(iii) Line 11, Label bullet: MEASURED, certified per cell, for the finite-rectangle identities of P8 and P1, with the qualifier that the '
    'general-form cells are Cauchy identities valid for every meromorphic function and that the cited symmetric form separates controls by '
    'evenness and reality, not by zero location; the clauses on L2, D7, Q25 and the passage to all zeros for HEAT stay ARGUED '
    '(lane `c21-statement-o-line11-control-table-40-digits-server` and its independent referee, corrections E1 to E6). '
    '(iv) The two other items of the owed list have no occurrence in this file (checked by search for "sigma_rel", "BR-2" and "infinite at 1/2"): '
    '"E_a has sigma_rel = 1 + a" is a correction to the controls table of `push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md` '
    '(registered in `push/' + LANE + '/CORRECTIONS.md`), and the set condition of BR-2 (correction E3) is repaired in '
    '`engine/curated/mk_devices.py`, `engine/nodes/nodes-23.json` and `campaign/STRATEGY.md` section 4.0. '
    'Count after version 5.2: PROVED 9 (lines 3, 6, 8, 9, 13, 14, 15, 16, 17, each in its narrowed form), PROVED relative to a cited theorem 1 (line 5), '
    'MEASURED 2 (line 2; line 11 for the finite-rectangle cells of P8 and P1 only), ARGUED 5 (lines 1, 4, 7, 10, 12). '
    'Not entered here: the second referee file of the line-4 lane (escape law F1; `push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1/'
    'c20-statement-o-line4-heat-zero-enclosures-server/REFEREE2.md`), which was not in this lane\'s assignment; line 4 stays ARGUED until a record lane reads it against the closing step. '
    '"PROVED" is the label of the rule (two referee files cover the closing step), not a certificate; the second file for line 15 works at 30 digits without ball arithmetic. '
    'No line is added. No line is a statement about zeros of zeta. No line says that no device exists.\n\n'
    '*Header of version 5.1 follows unchanged (its count paragraph describes version 5.1).*\n')
# ---- line 10
rep("  Consequence (the cap). Let P be a premise of one of the forms: a weighted mean square int w(t) abs(A F)(sigma' + it)^2 dt within [main - E_1, main + E_1] with w >= 0, A a Dirichlet polynomial and sigma' >= sigma > 1; a pointwise bound for F, log F or F'/F on Re s >= sigma' with relative room; a bound for N_F(T), for N_F(sigma', T) or for the count of critical zeros with room of 1, 0 and 2 zeros respectively. If zeta satisfies P with relative room above 2E + E^2 (function side) or with the stated room (zero side), then F_c satisfies P as well. A set of such premises therefore does not imply \"no zero off the line in the window\".",
    "  Consequence (the cap). (version 5.2: thresholds restated from Corollary 2 of `b-mvcap-function-side`, per corrections E1 and E2 of the campaign referee of the c21 record lane; version 5.1 gave the single threshold \"relative room above 2E + E^2\" for every function-side premise, which is too small for mean squares.) Write s = 2E + E^2, so that (c) reads sup over Re s >= sigma of abs(F_c/zeta - 1) <= s. Let P be a premise of one of the forms: "
    "(P-i) a weighted mean square int w(t) abs(A F)(sigma' + it)^2 dt within [main - E_1, main + E_1] with w >= 0, A a Dirichlet polynomial and sigma' >= sigma > 1, which zeta satisfies with room at least (2s + s^2) int w abs(A zeta)^2 (with F = zeta (1 + d), abs(d) <= s, the integrand changes by the factor abs(1 + d)^2 - 1, of modulus at most 2s + s^2; the source asks for 3s, which is enough when s <= 1); "
    "(P-ii) a pointwise bound abs(F(sigma' + it)) <= U(t), sigma' >= sigma, which zeta satisfies with relative room above s; "
    "(P-iii) a bound for log F or F'/F on Re s >= sigma' with sigma' > sigma strictly, which zeta satisfies with room above -log(1 - s) for log F and above -log(1 - s)/(sigma' - sigma) for F'/F (Cauchy on discs of radius sigma' - sigma; the source says \"with room\", the two constants are written here from abs(log(1 + d)) <= -log(1 - s)); "
    "(P-iv) a bound for N_F(T) with room 1, for N_F(sigma', T) with room 0, or for the count of critical zeros with room 2m when m gaps tie (m = 1 generically). "
    "If zeta satisfies P with the room stated for its form, then F_c satisfies P as well. A set of such premises therefore does not imply \"no zero off the line in the window\" in the literal form: the off-line pair of the lift sits at a height y(eta) above the line that tends to 0 with the lift parameter, so a premise aimed at \"no zero at distance at least y_0 from the line\" is not capped by Theorem 2 (the mirror instance is MEASURED; map row P29 says \"covers only the literal t = 0 form\").")
rep("(3) A premise that holds at zeta with relative room below about 2.4 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2) is not capped.",
    "(3) A premise that holds at zeta with relative room below about 2 x 2.4 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2) is not capped (version 5.2: the factor 2 is in the source and was missing here; at sigma = 2 this is 8.1e-9 abs(Z(t_m)) at the bottom of the range and 4.3e-12 abs(Z(t_m)) at the top). (3') (version 5.2) The constants (2.44; the source referee's value is 2.4357) are double-precision values on a grid of 6,405 points in (c, h, sigma), not interval-certified between grid points.")
rep("- **Owed.** (version 5.1: the statement is written above) Two referees for that statement; the density half of P50; a version without H_W.",
    "- **Owed.** (version 5.1: the statement is written above; version 5.2: thresholds repaired) Two referees for that statement; interval-certified constants; the density half of P50; a version without H_W.")
# ---- line 11
old11 = s[s.index("- **Label.** ARGUED, relative to `eq48` (P1), `dh-separator` (P8; starred control cells are inferred),"):s.index("- **Owed.** The identity stated per control, with the starred (inferred) cells of P8 checked or named as inferred.")]
assert old11.rstrip().endswith("(I) adds only that no inequality is present.")
new11 = ("- **Label.** (version 5.2) MEASURED, certified per cell, for the identities of P8 (order 1) and P1 (order 2) on finite rectangles; ARGUED for the clauses on L2, D7 and Q25 and for the passage to the sum over all zeros for HEAT. "
  "Source: lane `c21-statement-o-line11-control-table-40-digits-server` (Arb balls, one execution, one derivation) and its independent referee pass (\"" + Q11b + "\"; the Dirichlet-series cells recomputed with separate code, the HEAT cells not recomputed). "
  "What is certified: with the zeros inside a finite rectangle enclosed and counted and the remainder enclosed, the cited forms enclose 0 for zeta, DH, E_a and T-NR (q = 2, c = 17/8; factor zeros at Re s = 1/2 +- 0.5074, outside the closed strip), radius below 1e-47; for HEAT (tau = 1, 0.25) the general residue form encloses 0 and the cited form follows by the evenness and reality argument, not from a computed cell. "
  "The prime side of the order-1 test (zeta, DH, E_a, T-NR) and the Fejer-kernel formula of row P45 (those four, the sign twist and the unimodular twist) enclose 0, radius below 1e-45; these two rows were added by that lane and are not rows of this line. "
  "Qualifier (evenness and reality; referee corrections E3, E4). The general-form cells are, in the words of the referee, \"" + Q11 + "\": they enclose 0 for every meromorphic function with a correct divisor list, so they certify the bookkeeping (equality of the two forms at the tested rates, coefficient and tail terms, completeness of each zero list) and not a property of a control. "
  "The cited symmetric zero-side form V(rho) conj V(-conj rho) = Re L/Re z holds for F even and real (sufficient; not shown necessary); for the sign twist and the unimodular twist it excludes 0 (differences -3.316 - 4.444 i and -4.746 at the tested rates) while the general form (L(conj z) - L(-z))/(2 Re z) holds. "
  "So the symmetric form separates controls by evenness and reality, which DH, E_a, T-NR and HEAT share with zeta, and not by the location of zeros. "
  "The control cells for ZQ, SG, NR-q and HQ1 to HQ4 are inferred by the same argument and were not run.\n"
  "  Label in versions 3 to 5.1 (kept for the record): ARGUED, relative to `eq48` (P1), `dh-separator` (P8; starred control cells are inferred),"
  + old11[len("- **Label.** ARGUED, relative to `eq48` (P1), `dh-separator` (P8; starred control cells are inferred),"):])
rep(old11, new11)
rep("- **Owed.** The identity stated per control, with the starred (inferred) cells of P8 checked or named as inferred.",
    "- **Owed.** (version 5.2: the identity is stated and certified per control for P8 and P1, see Label) The limit C_R -> 0 for HEAT (`c22-w1-u4-windows-del09-heat-limit-ball-server`); a second referee for the cells; the cells for ZQ, SG, NR-q, HQ1 to HQ4 run or kept as inferred; the clauses on L2, D7, Q25.")
# ---- line 15
rep("  power), 2 < abs(c) < q^(1/2) + q^(-1/2) = 2.1974. T-NR at a rational prime",
    "  power), 2 < abs(c) < q^(1/2) + q^(-1/2) = 2.1974 (version 5.2, sign of c, second referee file: for c > 2 the zeros of the factor are at 1/2 +- b + (2k + 1) pi i/log q; for c < -2 they are at 1/2 +- b + 2k pi i/log q, and the one with k = 0 is real, in (1/2, 1); b = arccosh(abs(c)/2)/log q). T-NR at a rational prime")
rep("  of c (at c = 2.1: 0.857311 + 3.564428i, MEASURED).",
    "  of c (at c = +2.1: 0.857311 + 3.564428i; (version 5.2) checked at 30 digits by the second referee, winding number 1, and enclosed in balls by item C of the line-4 lane; at c = -2.1 the lowest zero is real, at 0.857311).")
rep("  those of zeta is not addressed by this line (it is addressed by line 13, whose defect is small and continuous).",
    "  those of zeta is not addressed by this line (it is addressed by line 13, whose defect is small and continuous).\n"
    "  (version 5.2, normalisation, second referee file) NR-q is a generalised Dirichlet series whose lowest frequency is -log q; it has no term normalised to 1 at frequency 0 with all other frequencies positive, and abs(G) grows like q^(sigma - 1/2) to the right. A device step that requires a_1 = 1 with frequencies >= 0, or boundedness to the right, rejects NR-q at that hypothesis; inside that class the controls with zeta's functional equation are HQ1 to HQ4 (pole clause), not NR-q.")
rep("- **Label.** PROVED in the lane, re-derived by the referee; MEASURED at c = 2.1. One referee file: ARGUED under\n  the label rule.\n- **Owed.** Second referee.",
    "- **Label.** (Versions 4 to 5.1: PROVED in the lane, re-derived by the referee; MEASURED at c = 2.1. One referee file: ARGUED under\n  the label rule.)\n"
    "  **(version 5.2) PROVED** under the label rule, as a statement about the object. Second file: `" + NRQ + "` (\"" + Q15b + "\"). It re-derives the functional equation of the multiplier, the absence of a rational power of q (Pell recursion), the disjointness of the three cosets, the integer-frequency part c zeta, the Hecke relation on each coset, the zero lines Re s = 1/2 +- arccosh(abs(c)/2)/log q and the strip condition, and it states the line as: \"A step that reads zeta's functional equation together with (a) the coefficients at integer frequencies only, or (b) Hecke covariance at rational primes only, does not separate zeta from NR-q, which has zeros off the line inside the strip.\" Its verdict on that sentence: \"" + Q15 + "\". First file: the independent pass in `push/c15-control-with-zeta-fe-classes-u1-u2/REFEREE.md` (row F4). Not covered by the label: whether a given device reads only (a) or (b) is decided per device and stays ARGUED. The second file works at 30 digits, not in ball arithmetic.\n"
    "- **Owed.** (version 5.2: second referee done) Nothing for the object. Per device: the classification of the read set.")
for old, new in R:
    assert s.count(old) == 1, (s.count(old), old[:80])
    s = s.replace(old, new)
quoted(NRQ, "A step that reads zeta's functional equation together with (a) the coefficients at integer frequencies only, or (b) Hecke covariance at rational primes only, does not separate zeta from NR-q, which has zeros off the line inside the strip.")
assert open(dst, encoding='utf-8').read() in (open(src, encoding='utf-8').read(), s), 'STATEMENT_O.md changed on disk since the copy was taken'
open(dst, 'w', encoding='utf-8').write(s)
print('written', dst, 'marks:', s.count('(version 5.2'))
