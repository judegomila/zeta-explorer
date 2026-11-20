#!/usr/bin/env python3
"""Corrections E1 to E9 of REFEREE.md of this lane (independent referee: holds with corrections), entered by the lane.
Wording and attribution only; no state, label decision or count changes. Each anchor must match exactly once."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
def patch(rel, edits, line_prefix=None):
    p = os.path.join(ROOT, rel); s = open(p, encoding='utf-8').read()
    for a, b in edits:
        if line_prefix:
            L = s.split('\n'); idx = [k for k, l in enumerate(L) if l.startswith(line_prefix)]
            assert len(idx) == 1, (rel, line_prefix, len(idx))
            assert L[idx[0]].count(a) == 1, (rel, a[:60], L[idx[0]].count(a))
            L[idx[0]] = L[idx[0]].replace(a, b); s = '\n'.join(L)
        else:
            assert s.count(a) == 1, (rel, a[:60], s.count(a))
            s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s); print('patched', rel, line_prefix or '', len(edits))
THREE = ("three refereed lanes of the device type (`c18-tz-one-sided-bound-fe-reserve-bridge` and `c18-tz-band-completion-controls-server`, two referee files each; `c19-rs-real-zero-completion-band-server`, one), "
         "'four refereed lanes' in `ROUND_LOG.md` round 19, which does not name its lanes (the fourth is presumably the window-law lane `c17-window-information-law-ctheta-u5` behind row Q31)")
M = 'push/OBSTRUCTION_MAP.md'
# E1, E5 (P58)
patch(M, [("State: device type closed (`engine/curated/devices.json`): four refereed lanes on record, the two round-18 lanes with two referee files each, and no continuation on file.",
           "State: device type closed (`engine/curated/devices.json`): " + THREE + " (referee E1 of the record lane: the device entry names three lanes); no continuation on file."),
          ("and the runs enclose lambda_min(T_sigma) >= 2.4e-6 Lg per cell, so no number and no control verdict changes.",
           "and the runs enclose lambda_min(T_sigma) >= 2.4e-6 Lg in every zeta cell (2.4e-6, 2.3e-3, 4.5e-3 Lg at the three heights), so no number and no control verdict changes."),
          ("The constant is -u for every a_P != 0:",
           "The constant is -u for every a_P != 0 (D_P'/D_P(s) = -(log P)/2 + lim sum over abs(Im beta) < T of 1/(s - beta), with no further constant):")],
      '| P58 |')
# E2 (Z37)
patch(M, [("the identity fails in 14 of 14 quadruples by 2.6e3 to 5.7e6 error bars and in one new quadruple of the referee (float64, MEASURED;",
           "the identity fails in 14 of 14 quadruples by 2.6e3 to 5.7e6 error bars (the count and the upper figure are the lane's table; the referee confirms the lower margin, 2596 bars, and a new quadruple with Delta non-zero by more than 1e6 spreads; "
           "the Hecke term of the error bar is a heuristic, not a propagated bound, referee correction 8) (float64, MEASURED;")], '| Z37 |')
# E3 (G45)
patch(M, [("one referee pass: does not hold as worded, holds after E1",
           "attribution (referee E3 of the record lane): the entries 'THIN at p q' and 'T-NR at q^2 p (c > 2)', the K2 bound formula and the phrase 'the first such step on file' are the lane's or the round log's; the lane's referee confirmed sign chains at p q, T-NR through the values 4.81, -7.52 and the case c < -2, and K2 by a brute count; "
           "one referee pass: does not hold as worded, holds after E1")], '| G45 |')
# E4 (D10)
patch(M, [("(iv) at symmetric sets these 2d points are null vectors of N exactly when 1 - a_j is a zero;",
           "(iv) at symmetric sets these 2d points are null vectors of N (the direction re-derived by the referee, from g(-1 - u) = g(u)); the lane states it as 'exactly when 1 - a_j is a zero';")], '| D10 |')
# E6 (X2)
patch(M, [("lattice Hecke relations), Bost-Connes state positivity, and each band device", "lattice Hecke relations), Bost-Connes state positivity (ARGUED, device row 12), and each band device"),
          ("Selberg's Euler axiom, the 7/8 size inputs; total positivity is removed by HQ4);", "Selberg's Euler axiom, the 7/8 size inputs (ARGUED, device row 18); total positivity is removed by HQ4);")], '| X2 |')
# section 7 row (E5)
patch(M, [("at most 3e-11 Lg on the mode spaces used and enclosed non-negative per cell;", "at most 3e-11 Lg on the mode spaces used and enclosed non-negative in every zeta cell;")])
# lane note (E5)
patch('push/c19-rs-real-zero-completion-band-server/RESULT.md',
      [("lambda_min(T_sigma) is enclosed per cell at or above 2.4e-6, 2.3e-3, 4.5e-3 Lg", "lambda_min(T_sigma) is enclosed in every zeta cell at or above 2.4e-6, 2.3e-3, 4.5e-3 Lg"),
       ("(and is enclosed non-negative per cell), not on every band.'", "(and is enclosed non-negative in every zeta cell), not on every band.'")])
# STRATEGY (E1)
patch('campaign/STRATEGY.md',
      [("Riemann-Siegel sign-change completions) is closed on four refereed lanes; no further attack slot.",
        "Riemann-Siegel sign-change completions) is closed on " + THREE + "; no further attack slot."),
       ("the band type stays closed and now rests on four refereed lanes (items 55, 60)", "the band type stays closed and now rests on three refereed lanes of the device type, four with the window-law lane behind row Q31 (items 51, 55, 60)"),
       ("the band device family is closed on four refereed lanes (row P58 with the round-19 addendum)", "the band device family is closed on three refereed lanes of the device type, four with the window-law lane (rows Q31 and P58 with the round-19 addendum)")])
patch('campaign/CHECKPOINT_R20_DECISION_SHEET.md',
      [("band device family closed on four refereed lanes |", "band device family closed on three refereed lanes of the device type (four with the window-law lane behind row Q31) |")])
# devices (E1, E5): mk_devices.py
patch('engine/curated/mk_devices.py',
      [("'CLOSED (rounds 18 and 19; four refereed lanes, two referee files on each round-18 lane)'", "'CLOSED (rounds 18 and 19; three refereed lanes of the device type, two referee files on each round-18 lane)'"),
       ("T_sigma >= -3e-11 Lg on the mode spaces m = 96, 192, 384 and enclosed non-negative per cell, not 'on every band';", "T_sigma >= -3e-11 Lg on the mode spaces m = 96, 192, 384 and enclosed non-negative in every zeta cell, not 'on every band';")])
# register (E8)
p = os.path.join(ROOT, 'campaign', 'CORRECTIONS_R18.md'); s = open(p, encoding='utf-8').read()
def rep(a, b):
    global s
    assert s.count(a) == 1, (a[:60], s.count(a)); s = s.replace(a, b)
rep("(2, 1) at a = 3/4, 11/20, 9/10. The sentence that c17's parity clause fails in the model is withdrawn until rerun with this b.\" |",
    "(2, 1) at a = 3/4, 11/20, 9/10.\" The sentence that c17's parity clause fails in the model is withdrawn until rerun with this b. |")
rep("row P58 (already present, from the first referee's E1); correction notes of the previous record lane in the lane's RESULT.md",
    "row P58 (first display already present, from the first referee's E1; the second display added to the row after the referee of this register, E8); correction notes of the previous record lane in the lane's RESULT.md")
rep("row G44 (already in the row in this form, from the first referee's E1; unchanged)", "row G44 (already in the row in substance, from the first referee's E1; unchanged)")
rep("- Count by this lane: 8 sentences were already in the map in this form and are unchanged (1, 2, 5, 14, 17, 19, 20, 21); 15 were added or",
    "- Count by this lane: 8 sentences were already in the map in substance, not word for word, and their text is unchanged (1, 2, 5, 14, 17, 19, 20, 21;\n  for 5 the second display was added afterwards); 15 were added or")
rep("- Corrections E2 and E4 of that referee concern",
    "- Sentence 23 is not quoted in section 3 of the source; its text is taken verbatim from the end of `REFEREE-W5c-and-TURAN-SOURCE.md`, as section 3 directs.\n"
    "  In sentence 15 the last sentence stands outside the quotation in the source, as here (corrected after the referee of this register, E8).\n"
    "- Corrections E2 and E4 of that referee concern")
open(p, 'w', encoding='utf-8').write(s); print('patched campaign/CORRECTIONS_R18.md')
# build script of Statement O (E7)
p = os.path.join(HERE, 'build_statement_o_v5.py'); s = open(p, encoding='utf-8').read()
rep(' "sentence of that file covers the step; the sentence is quoted in the Label bullet, and each quotation was checked by script to\\n"\n "occur in the file (`push/" + ME + "/build_statement_o_v5.py`).',
    ' "sentence of that file covers the step; the sentence is quoted in the Label bullet, and each quotation was checked by script to\\n"\n "occur in the file after removal of markdown markup (backticks, bold) and line breaks; the words are unchanged\\n (`push/" + ME + "/build_statement_o_v5.py`).')
open(p, 'w', encoding='utf-8').write(s); print('patched build_statement_o_v5.py')
