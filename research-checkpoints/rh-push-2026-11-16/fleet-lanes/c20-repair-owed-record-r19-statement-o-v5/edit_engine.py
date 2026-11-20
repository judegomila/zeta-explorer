#!/usr/bin/env python3
"""Engine edits of lane c20-repair-owed-record-r19-statement-o-v5 (owed list of campaign round 19).
(1) engine/curated/controls.json: codes HQ2, HQ3, HQ4. (2) engine/build_graph.py: the three codes in CONTROL_CODE_RE,
so that map cells "Defeated by" and lane records naming them give control-defeats edges that generate.py reads.
(3) engine/curated/mk_devices.py: block R19 (band device: state stays closed, closedOn updated to the files on record
after round 19; cells U4, U6 (c), U6 (g): evidence extended, states unchanged); the assertion on open device types is
scoped to the ids closed in blocks R18 and R19 (referee E2 of the previous record lane).
Previous files: before/. Each anchor must match exactly once."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
SRC = ('push/c19-hq2-screen-fe-int-mult-pos-devices/RESULT.md section 2 and MAP_ROW.md, with the corrections of REFEREE.md (one referee, E1 to E7); '
       'map section 2 table rows HQ2, HQ3, HQ4 and row X2. Entered by ' + ME)

# ---------------------------------------------------------------- (1) controls.json
p = os.path.join(ENG, 'curated', 'controls.json')
d = json.load(open(p, encoding='utf-8'))
assert not ({'HQ2', 'HQ3', 'HQ4'} & set(d['controls'])), 'already applied'
d['about'] += ' HQ2, HQ3, HQ4 added by ' + ME + ' (round 20; owed list of round 19); the three codes are in CONTROL_CODE_RE of build_graph.py from that lane on.'
d['controls']['HQ2'] = dict(
    name='HQ2: pole-clause twin zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), q prime, eps > 0',
    has="zeta's functional equation exactly; ordinary Dirichlet series with integer frequencies; multiplicative coefficients a(n) >= 1 (equal to 1 unless q^2 divides n); Euler product; finite order; the pole of zeta at 1; on-line zeros exactly zeta's",
    lacks='the pole clause (pole of order 4 at s = 1/2 and at each 1/2 + 2 pi i k/log q where zeta does not vanish); log-level positivity (nu(q^k) is signed for every eps > 0; first negative k = 13, 22, 38, 67, 212, 669 at q = 2 for eps = 1e-1 to 1e-8); geometric local factor at q; complete multiplicativity at q^2; Ramanujan size at q. Four zeros near each pole at distance (2/log q) Re asinh((eps^(1/4)/2) e^(i pi/4)) from the line',
    kills='kills steps that read the functional equation, integer frequencies, multiplicativity and coefficient positivity together without reading analyticity on the critical line or the local Euler shape at every prime',
    kw=r'\bHQ2\b|pole-clause twin',
    status='proved (re-derived by two referees for the construction, one for the round-19 addendum); ball enclosures of eight off-line zeros',
    source='push/c18-exact-relation-rigidity-klein-spinor/RESULT.md with REFEREE.md (E1 to E5) and push/c19-referee-r18-independent-sources/REFEREE2-c18-exact-relation-rigidity-klein-spinor.md; ' + SRC,
    scope='single-object devices reading coefficients; not a screen for devices that read the local Euler shape at q (map row X2)')
d['controls']['HQ3'] = dict(
    name='HQ3: log-positive pole-clause twin zeta(s)(1 - alpha u + u^2)/(1 - beta u + u^2), u = q^(1/2 - s), alpha = q^a + q^-a, beta = q^b + q^-b, 0 < a < b < 1/2',
    has="zeta's functional equation exactly; ordinary Dirichlet series with integer frequencies; Euler product; nu >= Lambda >= 0 on prime powers; a(n) >= 1; zeros of the factor at 1/2 +- a + 2 pi i k/log q",
    lacks='the pole clause (simple poles at 1/2 +- b + 2 pi i k/log q; the one with k = 0 is real, in (1/2, 1)); geometric local factor at q',
    kills='kills steps that read the functional equation, integer frequencies, multiplicativity and log-level positivity (nu >= 0 or nu >= Lambda) without the pole clause or the local shape at every prime',
    kw=r'\bHQ3\b|log-positive pole-clause twin',
    status='proved (elementary; re-derived by one referee; checked to 1e-60 on the member (5; 0.07, 0.31))',
    source=SRC, scope='integer-frequency, multiplicative form of G_+ (referee of c15-control-with-zeta-fe-classes-u1-u2); removes the sign of nu at powers of q as a separator from HQ2-type twins')
d['controls']['HQ4'] = dict(
    name='HQ4: totally positive pole-clause twin zeta(s)(1 + alpha u + u^2)/(1 - beta u + u^2), same parameters as HQ3',
    has="as HQ3 (functional equation, integer frequencies, Euler product, nu >= Lambda >= 0, a(n) >= 1); zeros of the factor at 1/2 +- a + (2k + 1) pi i/log q; local coefficient sequence at q totally positive (Edrei-Thoma form: negative real zeros, positive real poles)",
    lacks='the pole clause (simple poles at 1/2 +- b + 2 pi i k/log q); geometric local factor at q',
    kills='as HQ3, and in addition kills local total positivity of the Euler factor as a separator',
    kw=r'\bHQ4\b|totally positive pole-clause twin',
    status="proved (elementary; re-derived by one referee; Edrei's theorem classical, not opened; 24309 minors of order <= 4 non-negative on the member (5; 0.07, 0.31))",
    source=SRC, scope='companion of HQ3')
json.dump(d, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('controls.json:', list(d['controls']))

# ---------------------------------------------------------------- (2) build_graph.py
p = os.path.join(ENG, 'build_graph.py'); s = open(p, encoding='utf-8').read()
a = "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|NR-q|ZQ|SG|BLS|UNIV|DH|"
assert s.count(a) == 1
s = s.replace(a, "# HQ2, HQ3, HQ4 added by " + ME + " (curated/controls.json; map section 2).\n"
              "CONTROL_CODE_RE = re.compile(r'(?<![A-Za-z])(NR-vec|NR-q|ZQ|SG|BLS|UNIV|HQ2|HQ3|HQ4|DH|")
open(p, 'w', encoding='utf-8').write(s); print('build_graph.py: CONTROL_CODE_RE extended')

# ---------------------------------------------------------------- (3) mk_devices.py
p = os.path.join(ENG, 'curated', 'mk_devices.py'); s = open(p, encoding='utf-8').read()
assert ME not in s, 'already applied'
a = "Edit this file, then run it, then build_graph.py.\"\"\""
assert s.count(a) == 1
s = s.replace(a, "Edited by " + ME + " (round 20): block R19 (owed list of round 19). tz-one-sided-completion-bound-band stays closed; closedOn now names the files on record after round 19 "
              "(two referee files for each round-18 lane; the round-19 continuation lane with one referee, whose referee repaired Lemma P). Cells U4, U6 (c), U6 (g): evidence extended, states unchanged "
              "(U6 (c): closed by its round-19 lane on ONE referee file; the engine state stays 'cell' until a second referee file holds, rule of STRATEGY section 2). "
              "The assertion on open device types is scoped to the ids closed in blocks R18 and R19 (referee E2 of the previous record lane): a new proposed type may be registered as open.\n" + a)
a = "assert not [d for d in D if d[1] == 'open'], 'an open device type remains'\n"
assert s.count(a) == 1
R19 = r'''# ---- c20-repair-owed-record-r19-statement-o-v5 (round 20): owed record of round 19 (ROUND_LOG.md, 'Round 19
# results', line 'Owed'). No state changes in this block. Device: the band type stays closed and its closedOn entry
# is rewritten for the files on record. Cells: evidence only.
R19_BAND = 'tz-one-sided-completion-bound-band'
R19_BAND_EVIDENCE = (" Round 19: stays CLOSED; the continuation on file was run and closed. Second referee files for both round-18 lanes "
  "(push/c19-referee-r18-independent-sources/REFEREE2-c18-tz-one-sided-bound-fe-reserve-bridge.md: the truncation identity holds with constant -u and no log abs(a_P) term, ball arithmetic at P = 12, 20 with certified complete zero lists; scope Theorem A only. "
  "REFEREE2-c18-tz-band-completion-controls-server.md: 30-cell independent rerun at 48, 96, 192 modes; Form C negative at every mode count; zeta's Form D margin at 192 modes is 0.28 to 1.0 of the 96-mode value; scope zeta cells only). "
  "push/c19-rs-real-zero-completion-band-server (heavy server lane; REFEREE.md: does not hold as written, holds after E1 to E4; obstruction verdict stands): the completion by the sign changes of the Riemann-Siegel main sum gives only N(theta) with a tolerance equal to the defect "
  "(zeta: 0.036 to 0.137, 0.008 to 0.020, 0.0016 to 0.0052 Lg at 1e6, 1e9, 1e12); Lemma P as repaired by the referee: the constructed measure is signed (Arch density negative for abs(x) < 6.29, mass 2.2479), T_sigma >= -3e-11 Lg on the mode spaces m = 96, 192, 384 and enclosed non-negative per cell, not 'on every band'; "
  "the one-sided statistic changes under a ZQ exchange only by the pair form, so at tolerance tau Lg an off-line pair with (u eta)^2 below about 6 tau Lg/u is not excluded, at every height (fails entry condition E4: a control passes); no step reads multiplicativity (E3); the two-sided statement is the target in the window (E2). "
  "Map row P58 with the round-19 addendum. No continuation is on file. Entered by c20-repair-owed-record-r19-statement-o-v5.")
D = [(i, s, n.replace('CLOSED (round 18, one referee per lane)', 'CLOSED (rounds 18 and 19; four refereed lanes, two referee files on each round-18 lane)') if i == R19_BAND else n,
      e + (R19_BAND_EVIDENCE if i == R19_BAND else ''), nodes) for i, s, n, e, nodes in D]
assert [d for d in D if d[0] == R19_BAND][0][1] == 'closed' and 'rounds 18 and 19' in [d for d in D if d[0] == R19_BAND][0][2]
PROPOSED[R19_BAND] = dict(PROPOSED[R19_BAND],
    status='closed: round 18 on two lanes (two referee files each after round 19) and round 19 on the continuation lane (one referee); map row P58; was: proposed, untested',
    closedOn=dict(round=19, referees=2, enteredBy='c20-repair-owed-record-r19-statement-o-v5', mapRow='P58',
        files=['push/c18-tz-one-sided-bound-fe-reserve-bridge/REFEREE.md', 'push/c18-tz-band-completion-controls-server/REFEREE.md',
               'push/c19-referee-r18-independent-sources/REFEREE2-c18-tz-one-sided-bound-fe-reserve-bridge.md',
               'push/c19-referee-r18-independent-sources/REFEREE2-c18-tz-band-completion-controls-server.md',
               'push/c19-rs-real-zero-completion-band-server/REFEREE.md'],
        note='referees = 2 is the number of referee files on each round-18 lane (scope of the second files: Theorem A; zeta cells); the round-19 continuation lane has one referee, and its PROVED Lemma P stands only in the repaired form (mode spaces, bound -3e-11 Lg); a second referee for that lane is not on file'))
PROPOSED['exact-relation-rigidity'] = dict(PROPOSED['exact-relation-rigidity'], closedOn=dict(PROPOSED['exact-relation-rigidity']['closedOn'], referees=2,
    files=PROPOSED['exact-relation-rigidity']['closedOn']['files'] + ['push/c19-referee-r18-independent-sources/REFEREE2-c18-exact-relation-rigidity-klein-spinor.md'],
    note='two referee files after round 19 (the second: HQ2, Lemma Q, Proposition F re-derived, ball arithmetic); screen of HQ2 over the device table: map row X2'))
R19_CELLS = {
 'silent-cell-u4': " Round 19 (push/c19-u4-joint-prime-phase-quadratic-dp-zeros, one referee: does not hold as worded, holds after E1; map row G45): the quadratic / joint-phase read is closed for the pure cross-prime form and for sign conditions on atoms of Lambda_k. Cross-prime positivity (J) fails for sign chains at p q, for the Liouville twist at p q^2 (P > 12; E1: the lane had it passing) and for T-NR, but E_a and DEL pass every step and HQ2 passes at each P. Zeros of the partial sums D_P are closed as a carrier: at fixed P every height-uniform limit-stable statement is shared by all unimodular chains (K1) and by twins that differ above P (K3); at P = t/2 pi the right zeros satisfy zeta = F chi, so ZQ shares the list, and every class has zeros of D_P right of the line in every window (push/c19-dp-zero-census-truncation-identity-server, one referee). What stays a cell: one read, a second-order form mixing A_P with the archimedean operator (round-20 lanes c20-u4-second-order-archimedean-mixed-form and c20-mixed-form-control-census-server). State unchanged: cell.",
 'silent-cell-u6c': " Round 19 (push/c19-u6c-double-cover-k3-run, one referee: holds, nine corrections; map row Z37, round-19 addendum): the double-cover half was run. (K3) as a 2 x 2 product test on genus sums of <1,1,d>: the product identity fails for the Eisenstein input (ball arithmetic, 132 of 132) and for one self-dual cusp form (float64, 14 of 14, and one quadruple of the referee), with both signs; the two inputs are not separated; no Hecke relation and no one-sided inequality for the tested functional. The lane and the learn step record the cell as closed. Engine state unchanged: cell, because the rule of STRATEGY section 2 asks for two referee files and one is on file (second owed by c20-referee-theorem-d-headline-and-r19); set to 'closed' in this block when that file holds.",
 'silent-cell-u6g': " Round 19: still TRIED, NOT CLOSED (push/c19-d10-xd-determinant-pole-term-lemma-q, one referee: the partial result holds; map row D10, round-19 addendum). X(d) is reduced to NL(d) (d negative squares of a three-term one-variable kernel on the pole line); exact at 224 symmetric configurations, d = 6 to 16; open for general d. The second referee of the round-18 lane holds (Theorem Q confirmed through its conclusion at fresh points). The row cannot score.",
}
assert set(R19_CELLS) <= {c[0] for c in CELLS}
CELLS = [(i, s, n, e + R19_CELLS.get(i, ''), nodes) for i, s, n, e, nodes in CELLS]
PENDING[_u5[0]] = dict(PENDING[_u5[0]], name=PENDING[_u5[0]]['name'] + '. Round 19: the continuation of that device type (Riemann-Siegel sign-change completion) is closed as well (one referee; map row P58, round-19 addendum); no candidate device')
# Scoped after referee E2 of c19-repair-owed-record-r18-checkpoint-prep: only the types closed in blocks R18 and R19 are asserted.
assert not [d for d in D if d[1] == 'open' and d[0] in R18_DEVICES], 'a type closed in block R18 / R19 is open again: say so in the evidence and remove it from this assertion'
'''
s = s.replace(a, R19)
open(p, 'w', encoding='utf-8').write(s); print('mk_devices.py: block R19 added')
