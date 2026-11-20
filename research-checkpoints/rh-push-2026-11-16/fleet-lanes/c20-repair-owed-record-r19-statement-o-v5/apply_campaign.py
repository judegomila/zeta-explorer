#!/usr/bin/env python3
"""Campaign record edits of lane c20-repair-owed-record-r19-statement-o-v5 (owed list of round 19).
campaign/STRATEGY.md: section 3.1 items 59 to 65 (round 19) and heading range; notes on items 54 to 57; one bracket in
the tried list; section 4.0 paragraph "State of the cells after round 19"; one change-log bullet.
campaign/CORRECTIONS_R18.md: new (the 23 sentences to use, with the place where the record carries each).
No rule, weight or allocation is changed. Previous file: before/STRATEGY.md. Each anchor must match exactly once."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
CAMP = os.path.normpath(os.path.join(HERE, '..', '..', 'campaign'))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
R7 = 'c19-referee-r18-independent-sources'
p = os.path.join(CAMP, 'STRATEGY.md'); s = open(p, encoding='utf-8').read()
assert ME not in s, 'already applied'
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:70], s.count(a))
    s = s.replace(a, b)

# ---- heading of section 3.1
rep("54 to 58: round 18, entered by `c19-repair-owed-record-r18-checkpoint-prep` as record items)",
    "54 to 58: round 18, entered by `c19-repair-owed-record-r18-checkpoint-prep` as record items; 59 to 65: round 19, entered by `" + ME + "` as record items)")
# ---- notes on items 54 to 57 (second referees of round 18)
rep("State: closed in the device table on one referee file (one refereed obstruction in the count of this section). [X1; control HQ2]",
    "State: closed in the device table on one referee file (one refereed obstruction in the count of this section). [X1; control HQ2] [round 19: a second referee file holds with corrections (`" + R7 + "`); two referee files; the screen of HQ2 over the device table is item 61]")
rep("State: closed in the device table; the continuation on file is a completion positive by construction with pre-registered mode counts (round-19 lane `c19-rs-real-zero-completion-band-server`). [P58]",
    "State: closed in the device table; the continuation on file is a completion positive by construction with pre-registered mode counts (round-19 lane `c19-rs-real-zero-completion-band-server`). [P58] [round 19: second referee files hold for both lanes (scope: Theorem A; zeta cells); the continuation was run and closed, item 60]")
rep("what remains of the cell is the quadratic / joint-prime-phase read (section 4.0; round-19 lane `c19-u4-joint-prime-phase-quadratic-dp-zeros`). [G44]",
    "what remains of the cell is the quadratic / joint-prime-phase read (section 4.0; round-19 lane `c19-u4-joint-prime-phase-quadratic-dp-zeros`). [G44] [round 19: a second referee file holds with corrections C1 to C4 (`" + R7 + "`); the remaining read is item 59]")
rep("and (K3) not yet a defined statement (round-19 lane `c19-u6c-double-cover-k3-run`). [Z37]",
    "and (K3) not yet a defined statement (round-19 lane `c19-u6c-double-cover-k3-run`). [Z37] [round 19: the double-cover half was run, item 63; this item still rests on one referee file]")
# ---- items 59 to 65
a = "\n\nTried, not closed (one more lane allowed, and it must attack the stated obstruction):"
items = "\n".join([
 "59. Cell U4, quadratic and joint-phase reads: cross-prime positivity of the pair form (candidate (J)) and reads of the phases at several primes jointly. `c19-u4-joint-prime-phase-quadratic-dp-zeros` (one referee: does not hold as worded, holds after E1; second referee owed). Kind: the multiplicative step of (J) is a sign relation between atoms at different primes and is the failing step for non-trivial sign chains (at p q), the Liouville twist (at p q^2, P > 12; the lane had it passing, E1) and T-NR, the first such step on file; but (J) is implied by Lambda >= 0, E_a and DEL pass every step and HQ2 passes at each P (no R3); nothing about zeros follows without the second-order explicit formula with the functional equation, where the read is an identification (Lemma N with Theorem P; Hamburger) or the target in a window (ARGUED). State: closed for the pure cross form and for sign conditions on atoms of Lambda_k (one refereed obstruction); the cell is reduced to one read, a second-order form mixing A_P with the archimedean operator (round-20 lanes `c20-u4-second-order-archimedean-mixed-form`, `c20-mixed-form-control-census-server`). [G45]",
 "60. Band device, continuation: N(theta) completed by a measure positive by construction (sign changes of the Riemann-Siegel main sum), 0.75 <= theta <= 0.85, pre-registered mode counts. `c19-rs-real-zero-completion-band-server` (heavy server lane; one referee: does not hold as written, holds after E1 to E4). Kind: the completion moves all content into the defect E; the one-sided statistic sees an off-line quartet only through the pair form, of size at most u (sinh(u eta)/(u eta) - 1), so at tolerance tau Lg a pair with (u eta)^2 below about 6 tau Lg/u is not excluded at any height (ZQ passes; no R3); no step reads multiplicativity (no R1); the two-sided statement is the target in the window (no R4; ARGUED). The PROVED positivity step (Lemma P applied to the constructed measure) was false as stated and is repaired on the three mode spaces (T_sigma >= -3e-11 Lg; no number changes). State: with item 55 the band device family (N(theta), W, C(theta), linear reflected and Riemann-Siegel sign-change completions) is closed on four refereed lanes; no further attack slot. [P58, round-19 addendum]",
 "61. HQ2 as a screen over the device table (devices reading functional equation + integer frequencies + multiplicativity + positivity). `c19-hq2-screen-fe-int-mult-pos-devices` (one referee, holds with corrections E1 to E7; second referee owed). Kind: twenty device rows; coefficient-level reads reject HQ2 only by the pole clause; the reads that reject it at another step (sign of nu at powers of q; local Euler shape; complete multiplicativity at q) are removed by the new controls HQ3, HQ4 or, for finitely many modified primes with rational local factors, are identifications that select the twins the pole clause already rejects (Lemmas N, S, F, C; elementary, known type; referee E1). State: registered expectation confirmed (no device type); controls HQ3, HQ4 enter the control set (map section 2; engine codes HQ2, HQ3, HQ4). Open as an identification question only: infinitely many modified primes (map section 6, item 23; round-20 lane `c20-euler-shape-rigidity-infinite-modified-primes`). [X2]",
 "62. Zeros of the partial sums D_P as a carrier (the stage-to-line step through the truncation identity). `c19-dp-zero-census-truncation-identity-server` (server lane; one referee, holds; partial result) with items 59 and 55. Kind: at fixed P every height-uniform limit-stable statement on the zero set is shared by all unimodular chains (K1, Bohr equivalence) and by twins that differ above P (K3); every class has zeros of D_P right of the line in every window (completion C1 false); at P = t/2 pi the right zeros satisfy zeta = F chi, so ZQ shares the list; below that length zeta sits inside the Haar ensemble; no survivor statistic. Theorem A with the constant -u is certified to T = 6400 on six series (limit not enclosed; an enclosed tail bound is owed). State: closed as a carrier (two refereed lanes, one referee each); no further attack slot. No map row was proposed by the census lane; the record is in `ROUND_LOG.md` round 19, row G45 and row P58.",
 "63. Cell U6 (c), double-cover half: the test (K3) on genus sums of point values of GL(3) forms at the ternary forms <1,1,d>. `c19-u6c-double-cover-k3-run` (one referee, holds, nine corrections; second referee owed). Kind: global period data without a Hecke relation and without an inequality: the product identity fails for the Eisenstein input (ball arithmetic, 132 of 132) and for one self-dual cusp form (float64, 14 of 14), with both signs; the two inputs are not separated; zeta controls are not formulable on the array. State: closed by the lane and the learn step on one refereed obstruction (with item 57 the two halves of the cell have one refereed obstruction each); the engine state of the cell stays `cell` until a second referee file holds (rule of section 2). [Z37, round-19 addendum]",
 "64. Cell U6 (g) at rank 2, fourth lane: X(d) for every even d. `c19-d10-xd-determinant-pole-term-lemma-q` (one referee: the partial result holds; W-1 to W-5) and the second referee of the round-18 lane (`" + R7 + "`). Kind: X(d) is not proved; it is reduced to NL(d) (d negative squares of a three-term one-variable kernel on the pole line); the pole enters as a rank-2d update; exact at 224 symmetric configurations, d = 6 to 16. A symmetric off-line quartet passes, so the row cannot score. State: still tried, not closed; a model-level open step; record item only (not a closure). [D10, round-19 addendum]",
 "65. Referee and source records of round 19 that change no state. `" + R7 + "` (one referee): round-18 lanes 1, 2, 3, 4, 6 hold with corrections and have two referee files each (a count of files: Theorem Q was confirmed through its conclusion at fresh points, only Theorem A was re-derived for the tz paper lane, only zeta cells were rerun for the tz server lane); 23 sentences to use (`CORRECTIONS_R18.md`); Turan's second main theorem with the factor 2 and the constant 8e is Theorem K.3 of Montgomery-Vaughan, Multiplicative Number Theory III (draft) (row Q31; Ten Lectures not opened); W5c holds with corrections (one referee). `c19-repair-owed-record-r18-checkpoint-prep` (one referee, E1 to E5): `CHECKPOINT_R20_INPUT.md`. Statement O version 5 is on file (`../push/" + ME + "/STATEMENT_O_v5.md`: lines 13, 14, 16, 17 relabelled; line 15 not). Not done: second referees for the round-19 lanes (with `c20-referee-theorem-d-headline-and-r19`); the enclosed tail bound for Theorem A (with `c20-mixed-form-control-census-server`); the checkpoint itself (`CHECKPOINT_R20_DECISION_SHEET.md` lists the evidence per condition and applies nothing).",
])
assert s.count(a) == 1
k = s.index(a)
assert s[:k].rstrip().split('\n')[-1].startswith('58. ')
s = s[:k] + "\n" + items + s[k:]
# ---- tried list bracket
rep("each has one refereed obstruction on its other half and no passing control on the remaining half).",
    "each has one refereed obstruction on its other half and no passing control on the remaining half) [round 19, entered by `" + ME + "`: both remaining halves were run, items 59 and 63, one refereed obstruction each; what stays here is the second-order mixed form of U4 (item 59) and, as a record item, NL(d) for row D10 (item 64)].")
# ---- section 4.0 paragraph
a = "\n\n**Silent cells after round 15** (source:"
assert s.count(a) == 1
para = ("State of the cells after round 19 (entered 2026-11-20 by `" + ME + "`; record only; the tables below are the round-15 state and are kept; no lane passed stage A in round 19 and every requirement flag of the round is false). "
 "Device table: 55 closed, 1 floored (the 7/8 type), 0 open; the band type stays closed and now rests on four refereed lanes (items 55, 60), `exact-relation-rigidity` on two referee files. Round-18 lanes 1, 2, 3, 4, 6 have two referee files each (item 65); every round-19 lane has one. "
 "Cells in the order of the table below: U3 and U2-POS closed (unchanged); "
 "**U4 residual: reduced to the second-order mixed form.** The quadratic / joint-phase read is closed for the pure cross-prime form and for sign conditions on atoms of Lambda_k (row G45, one referee: sign chains fail at p q, the Liouville twist at p q^2 for P > 12, T-NR at a cross atom; E_a and DEL pass every step, HQ2 at each P). "
 "What stays a cell is one read: a second-order form mixing A_P with the archimedean operator (reserve Lg - u), with step F of the second-order explicit formula written out; no passing control is on file for it because no form is on file (round-20 lanes `c20-u4-second-order-archimedean-mixed-form` and `c20-mixed-form-control-census-server`); "
 "**zeros of the partial sums D_P: closed as a carrier** (item 62): at fixed P shared by all unimodular chains (K1) and by twins above P (K3); at P = t/2 pi a function of zeta through the approximate functional equation, so ZQ shares the list; completion C1 false for every class; "
 "U5 beyond a span: read through row Q31; the band device family is closed on four refereed lanes (row P58 with the round-19 addendum); a read class with no candidate device; U6 (a), (b): cells, no candidate on file (round-20 lane `c20-u6ab-rank2-metaplectic-eigenobject-verdict`); "
 "**U6 (c): closed** by the round-19 lane and the learn step (row Z37 with the round-19 addendum; cubic half: a known array; double-cover half: global period data without a Hecke relation and without an inequality, Eisenstein and one self-dual cusp form not separated). Each half has one refereed obstruction and one referee file; "
 "the engine state of the cell stays `cell` until a second referee file holds (rule of section 2: two referee files; owed by `c20-referee-theorem-d-headline-and-r19`); U6 (d): cell, carries no R1; U6 (e), U6 (f): closed (two referees); "
 "U6 (g): tried, not closed after four lanes (row D10; X(d) reduced to NL(d), exact to d = 16; cannot score; item 64); U8: dictionary DU closed as MEASURED (row G43); the class beyond DU is a cell with no candidate. "
 "Cells without a passing control on file after round 19: the second-order mixed form of U4 only (the learn step of round 19 says the same). Cells with no candidate object: U6 (a), (b), (d), U8 beyond DU. "
 "Controls: HQ3 and HQ4 are in the control set (map section 2; engine codes HQ2, HQ3, HQ4 in `../engine/curated/controls.json`); a stage-A table for a device reading the functional equation, integer frequencies, multiplicativity and positivity must list them. "
 "Before / after of the engine and the scoreboard for these edits: `../push/" + ME + "/compare_before_after.md`. Input for the checkpoint after round 20: `CHECKPOINT_R20_INPUT.md` and `CHECKPOINT_R20_DECISION_SHEET.md` (evidence per condition; the checkpoint is not applied there).")
s = s.replace(a, "\n\n" + para + a)
# ---- change log
a = "- Record edits of 2026-11-20, `c19-repair-owed-record-r18-checkpoint-prep` (no version change;"
assert s.count(a) == 1
s = s.replace(a, "- Record edits of 2026-11-20, `" + ME + "` (no version change; no rule, weight or allocation changed). Section 3.1: items 59 to 65 for the round-19 records (heading range extended; each item states its own referee count and state; items 59, 60, 61, 63 rest on one refereed obstruction each, "
              "item 62 on two lanes with one referee each; items 64 and 65 are not closures), bracketed round-19 notes on items 54 to 57, one bracket in the tried list. Section 4.0: the paragraph \"State of the cells after round 19\". New files: `CORRECTIONS_R18.md` (the 23 sentences to use from the second referees of round 18) and "
              "`CHECKPOINT_R20_DECISION_SHEET.md` (evidence per condition of the checkpoint rule and the work the rule assigns to rounds 21 onward, with cost estimates; the checkpoint is not applied and no rule is changed). Engine: control codes HQ2, HQ3, HQ4; device block R19 (no state change). "
              "Previous file: `../push/" + ME + "/before/STRATEGY.md`.\n" + a)
open(p, 'w', encoding='utf-8').write(s); print('STRATEGY.md patched')

# ---------------------------------------------------------------- CORRECTIONS_R18.md
S = [
 ("U4", "Lemma GL (b)", "The inequalities hold for all g >= 0 and all non-negative cosine polynomials if and only if for every atom n the sequence k -> Re Lambda_k(n), extended evenly, is positive definite: Re Lambda_k(n) = integral of cos(k theta) d mu_n, mu_n >= 0.", "row G44 (already in the row in this form, from the first referee's E1; unchanged)"),
 ("U4", "map row and R1 line", "positive definiteness of k -> Re Lambda_k(n) atom by atom; no relation between primes is read.", "row G44 (already present; unchanged); STRATEGY item 56"),
 ("U4", "Lemma V summaries", "a simple zero at distance delta from Re s = 1 can exceed the pole term in the 3-4-1 mechanism only if the mean log-length of the test is below log 2/delta (log(m a_1/a_0)/delta for order m).", "row G44 (sentence replaced by this lane)"),
 ("U4", "Theorem T application (first referee)", "for the triple sigma + ikt, a lower bound with B locally bounded in (sigma, t) on a strip holds if and only if the strip is zero-free.", "row G44 (added by this lane)"),
 ("tz bridge", "display (A) and step (b)", "-2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros beta of D_P of <h, kappa_beta h>, for a_1 = 1 and a_P != 0. D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta), with no further constant.", "row P58 (already present, from the first referee's E1); correction notes of the previous record lane in the lane's RESULT.md"),
 ("tz bridge", "tail", "(u - 2 log abs(a_P))/(pi T) norm(h)^2 (1 + o(1)); the mean of Re beta is log abs(a_P)/u.", "row P58 (tail completed and the mean added by this lane)"),
 ("tz bridge", "share of right zeros", "31 to 33 percent at P = 12 and 37 to 41 percent at P = 20 with certified complete lists (heights to 2400); 27 to 35 percent at P <= 8 (first referee).", "row P58 (added by this lane)"),
 ("tz bridge", "DH row", "holds for every Dirichlet series with a_1 = 1 and a_P != 0, with the constant -u.", "row P58, defeated-by cell (sentence completed by this lane)"),
 ("tz bridge", "check status", "ball arithmetic at P = 12 and 20 with complete certified zero lists; float64 at P = 3 to 8.", "row P58, status cell (added by this lane)"),
 ("tz server", "margins", "On 96 Fourier modes zeta's smallest eigenvalue has median 0.22 to 0.26 Lg at theta = 0.55 and 0.012 to 0.025 Lg at 0.85; on 192 modes with the same centres (8 windows, 1e6 to 1e12) it is 0.28 to 1.0 times the 96-mode value (median 0.75). The margin is a property of the window space and decreases with the number of modes.", "row P58 (added by this lane)"),
 ("tz server", "Form C", "zeta fails Form C at M = 0 and M = 1 in 600 of 600 cells with a reflected atom on 96 modes (certified by the lane); in a 30-cell sample rerun with independent code the smallest eigenvalue is negative at 48, 96 and 192 modes in every cell, between -1.42 and -0.19 times Lg, and more negative with more modes.", "row P58 (added by this lane)"),
 ("tz server", "deviation (iii)", "At (1e10, 0.75) the boundary integer 31622777 is prime and is included (`xtheta` rounds to the nearest integer at every boundary). In Form D its weight is below 1e-7; in Form C it enters with weight log n/sqrt n = 3.1e-3 and changes lam_min by up to 1.4e-3 (6e-5 relative). No sign changes.", "row P58 (short form added by this lane); full sentence here"),
 ("tz server", "row (1e6, 0.85) of the Form C table", "40 of 40 at 96 modes; at 192 modes one of two sampled windows is negative at M = 0.", "row P58 (added by this lane)"),
 ("tz server", "chains (first referee)", "on 96 modes, in a typical window, N(theta) at theta = 0.55 does not distinguish a chain from zeta at M = 0 or M = 1; the distinction appears as m grows and for theta >= 0.75.", "row P58 (already present in substance: stops cell and defeated-by cell; unchanged)"),
 ("D10", "odd number of real zeros", "b = (u - 1) g is the model of M_0 times (-Theta) for odd degree; the model of M_0 Theta is b = u (u - 1) g. One real zero a: b = (u - 1)(u + a): (1, 0) at a = 1/4, (0, 1) at a = 3/4; b = u (u - 1)(u + a): (1, 2) at a = 1/4, (2, 1) at a = 3/4, 11/20, 9/10. The sentence that c17's parity clause fails in the model is withdrawn until rerun with this b.", "row D10 (parity paragraph of the previous record lane; the instances for b = (u - 1)(u + a) added by this lane)"),
 ("D10", "Theorem Q", "computer-assisted; conclusion confirmed by a second implementation at 29 fresh interior points, factorisation at 12 fresh points; the grid computation itself was not repeated.", "row D10 (added by this lane)"),
 ("exact relation", "poles", "a pole of order 4 at s = 1/2, and at every point 1/2 + 2 pi i k/log q where zeta does not vanish.", "control row HQ2 (already present; unchanged)"),
 ("exact relation", "zeros", "for every eps > 0 the factor has no zero on the line; its zeros are at distance (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) from it, inside the open strip when that distance is below 1/2.", "control row HQ2 (added by this lane); `engine/curated/controls.json`, code HQ2"),
 ("exact relation", "headline (first referee)", "HQ2 is a twin with zeta's functional equation that is multiplicative in the ordinary sense. ZQ, NR-q and the Proposition W twin leave the class at integrality or support, before multiplicativity of integer coefficients is defined.", "row X1 (already present; unchanged)"),
 ("exact relation", "Proposition D (c) (first referee)", "(a), (b) PROVED; non-closedness of INT and MULT in T_strip is CLASSICAL on the right half-strip with a target non-vanishing on the whole half-strip, and OPEN inside the functional-equation class.", "row X1 (already present; unchanged); correction note of the previous record lane in the lane's RESULT.md"),
 ("exact relation", "Lemma Q consequence", "equal numbers of zeros and poles of R on the u-sphere; it places neither.", "row X1 (already present; unchanged)"),
 ("sources", "Corollary T' and row Q31", "relative to Turan's second main theorem in the form of Montgomery-Vaughan, Multiplicative Number Theory III (draft), Theorem K.3 (factor 2 and constant 8e as printed there, proof read by a referee; Montgomery's Ten Lectures, chapter 5, not opened).", "row Q31, three places (stops cell, status cell, source note; replaced by this lane)"),
 ("W5c", "the sentence at the end of `REFEREE-W5c-and-TURAN-SOURCE.md`", "(W5c) Pairs x_j +- ib with equal offset b and abscissae separated by at least D (all abscissae carrying a pair, with multiplicity one). For every h in L^2 of an interval of length u (centred without loss, f being translation invariant), sum_j -[f(z_j) + f(conj z_j)] <= 4 pi C(u, D) sinh^2(ub/2) norm(h)^2 with C(u, D) = (2 e^2/pi) max(2/D, u/2); hence the family passes the complete band-u device with tolerance M against any on-line set when 4 pi C(u, D) sinh^2(ub/2) <= 2M, in particular for ub <= 1 and b <= 0.499 sqrt(M) u^(-3/2)/sqrt(max(1, 4/(uD))). One band, equal offsets.", "row Q31 (replaced by this lane); one referee on W5c"),
]
assert len(S) == 23
out = ["# Corrected sentences of round 18 (register)", "",
 "Written 2026-11-20 by lane `" + ME + "` (campaign round 20, repair lane B). Source:",
 "`push/" + R7 + "/RESULT.md` section 3 (23 sentences to use, from the second referees of round-18 lanes 1, 2, 3, 4, 6,",
 "the source search for Turan's theorem and the referee of W5c), with the corrections E1 to E5 of that lane's own referee",
 "(`REFEREE.md`; the count 23 is confirmed there). Nothing here is a statement about zeros of zeta. No verdict of any lane",
 "changes. The sentences are quoted from the source without change; labels are those of the source files.", "",
 "Where the false or superseded sentence stands in a round-18 lane file, that file is not edited by this lane (the previous",
 "record lane entered notes for display (A), Proposition D (c) and the parity clause); the sentence below is the one to quote,",
 "and the last column names the place where the campaign record carries it. Paths are relative to `tmp/research-2026-11-16/`.", "",
 "| # | lane | place | sentence to use | where the record carries it |", "|---|---|---|---|---|"]
for n, (lane, place, sent, where) in enumerate(S, 1):
    for c in (lane, place, sent, where):
        assert ' | ' not in c
    out.append("| %d | %s | %s | \"%s\" | %s |" % (n, lane, place, sent, where))
out += ["", "Notes.", "",
 "- Count by this lane: 8 sentences were already in the map in this form and are unchanged (1, 2, 5, 14, 17, 19, 20, 21); 15 were added or",
 "  completed by `push/" + ME + "/apply_map.py` (3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 22, 23;",
 "  of these 8 and 15 complete a sentence that was present in part).",
 "- Scope of 'two referee files' (referee of the source lane, E5): for the D10 lane the second referee confirmed Theorem Q through",
 "  its conclusion at fresh points; for the tz paper lane only Theorem A was re-derived; for the tz server lane only zeta cells were",
 "  rerun. The map status cells of rows P58 and D10 say so.",
 "- Corrections E2 and E4 of that referee concern two sentences inside the REFEREE2 files (rank n(n-1)/2 only when no root lies on the",
 "  imaginary axis; the sign at 3^2 comes from (-1)^(k+1), both a and b being positive); they are in map section 7.",
 "- Turan: the cited text is a draft (Montgomery-Vaughan, Multiplicative Number Theory III, Theorem K.3, Corollaries K.4, K.5). The label",
 "  of Corollary T' stays 'PROVED relative to' a cited theorem; Turan's own text and Montgomery's Ten Lectures were not opened.", ""]
open(os.path.join(CAMP, 'CORRECTIONS_R18.md'), 'w', encoding='utf-8').write('\n'.join(out)); print('CORRECTIONS_R18.md written')
