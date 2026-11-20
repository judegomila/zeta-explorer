#!/usr/bin/env python3
"""Engine edits of lane c19-repair-owed-record-r18-checkpoint-prep (owed list of campaign round 18).
1. engine/curated/mk_devices.py: block R18 (both proposed device types open -> closed on their referee files, one
   referee per lane; cell evidence after round 18; pending entry U5). Then run mk_devices.py.
2. engine/nodes/nodes-22.json: name and statement of the two device nodes say what the referee files hold. Tags,
   type and status of the nodes are not changed, so the before/after difference of the generator comes from the
   state change only.
Previous files: before/mk_devices.py, before/devices.json, before/nodes/nodes-22.json."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
p = os.path.join(ENG, 'curated', 'mk_devices.py')
s = open(p, encoding='utf-8').read()
assert 'c19-repair-owed-record-r18-checkpoint-prep' not in s, 'already applied'

hdr_a = "They are not cells and no cell node is re-entered as a device (asserted below). Previous file scratch/mk_devices.pre-c18-repair.py.\n"
hdr_b = hdr_a + ("Edited by c19-repair-owed-record-r18-checkpoint-prep (round 19): block R18. Both proposed device types of round 18 open -> closed on the "
                 "referee files of their lanes, ONE referee per lane (tz-one-sided-completion-bound-band: c18-tz-one-sided-bound-fe-reserve-bridge and "
                 "c18-tz-band-completion-controls-server, map row P58; exact-relation-rigidity: c18-exact-relation-rigidity-klein-spinor, map row X1, "
                 "control HQ2); second referees owed by c19-referee-r18-independent-sources. Cell evidence after round 18 (U4: (iv) closed for "
                 "positivity-derived reads, residual joint / quadratic; U6 (c): cubic half closed, double-cover half a cell; U6 (g): addendum; U3, U6 (e), "
                 "U6 (f): two referees). Device table after the edit: 0 open types. Previous file scratch/mk_devices.pre-c19-repair.py.\n")
assert s.count(hdr_a) == 1; s = s.replace(hdr_a, hdr_b)

anchor = "assert not ({n for d in D for n in d[4]} & {n for c in CELLS for n in c[4]}), 'a cell node re-entered as a device'\n"
assert s.count(anchor) == 1
block = r'''
# ---- c19-repair-owed-record-r18-checkpoint-prep (round 19): owed record of round 18 (ROUND_LOG.md, 'Round 18
# results', line 'Owed'). A state changes on a referee file. Each closure below rests on ONE referee per lane
# (author plus one referee); second referees are owed by c19-referee-r18-independent-sources. If a second referee
# breaks a closure, set the state back to 'open' here and say so in the evidence.
R18_DEVICES = {
 'tz-one-sided-completion-bound-band': dict(
  state='closed',
  name='CLOSED (round 18, one referee per lane): one-sided completion bound in the band 1/2 < theta <= 1 (bound N(theta) on the band operator T_Z with the reflected half of the approximate functional equation as completion)',
  status='closed in round 18 on two lanes with one referee each (map row P58); was: proposed, untested',
  evidence=" Round 18: CLOSED (one referee per lane; second referees owed by c19-referee-r18-independent-sources; map row P58). push/c18-tz-one-sided-bound-fe-reserve-bridge (REFEREE.md: holds with corrections E1 to E7): exact truncation identity -2 Re <h, A_P h> = -u norm(h)^2 + sum over zeros of the partial sum D_P of forms with kernel e^((beta - 1/2) abs(xi)), valid for every Dirichlet series with a_1 = 1 and a_P != 0 (the term log abs(a_P) of the lane's display (A) is spurious); N(theta) below the Nyquist band is a statement about zeros of a partial sum and uses no multiplicativity (fails entry condition E3); the reflected half has frequencies >= u and is not seen by the band; ZQ passes for theta' < 1 in the lattice model (fails E4: a control passes every step); at theta' = 1 the statement is the target in a window (E2). push/c18-tz-band-completion-controls-server (REFEREE.md: holds after corrections E1, E2; heavy server lane; MEASURED, signs certified relative to a hand-derived radius, 96 modes, heights 1e6 to 1e12): the registered linear reflected completion is not a positive extension (zeta fails it in 600 of 600 cells, and for every global phase at 3e6); N(theta) on 96 modes is passed by ZQ (eta = 0.05, M = 1, theta <= 0.75), E_0.1 and DH at low theta, and by multiplicative sign chains at theta = 0.55; the chain passes depend on the number of modes. E_a on its own configuration passes the complete band device for small a (second referee of the window law). Not closed by these files and not this device type: a completion positive by construction (real zeros of the Riemann-Siegel main sum) in 0.75 <= theta <= 0.85 with pre-registered mode counts (lane c19-rs-real-zero-completion-band-server), and reads of the zeros of D_P that are quadratic or joint in the prime phases (lane c19-u4-joint-prime-phase-quadratic-dp-zeros); a round-19 lane that proposes one of these as a device type enters it as a new node with its own entry conditions."),
 'exact-relation-rigidity': dict(
  state='closed',
  name='CLOSED (round 18, one referee): exact-relation rigidity (an exact relation at defect 0 with an open failure set, on a class excluding Proposition W twins by support and NR-q by integrality)',
  status='closed in round 18 on one referee file (map row X1, control HQ2); was: proposed, untested',
  evidence=" Round 18: CLOSED (one referee; second referee owed by c19-referee-r18-independent-sources; map row X1). push/c18-exact-relation-rigidity-klein-spinor (REFEREE.md: holds with corrections E1 to E5): ordinary multiplicativity added to {FE, INT, N >= 0} does not replace the pole clause (control HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s): exact functional equation, integer frequencies, multiplicative coefficients >= 1, four zeros near each pole at distance eps^(1/4)/(sqrt 2 log q)(1 + O(sqrt eps)) from the line, pole of order 4 at 1/2) and added to {INT, N >= 0, POLE} does not replace FE (TN1 = zeta(s)(1 + q^(3/4 - s))); Lemma Q (a pole-free symmetric one-base multiplier is 1; no multiplicativity); Proposition F (members with zeta's coefficients for n < q, exact FE, multiplicative non-negative coefficients, vanishing on Re s = 3/4): nothing about zeros follows from an exact relation at a finite stage; the clause that completes the identification is analyticity on the critical line. Entry condition E3 (one step of the proof uses multiplicativity) has no instance on the lane's reading list; of the relations listed only a(pn) = a(n) (the definition) and J = 1 (the target) exclude every control. Referee restrictions: Proposition D (c) holds only after a repair and on the right half-strip (E1); the passes of ZQ, NR-q and the Proposition W twin at multiplicativity are by convention (E2); 'every exact relation on file' is the lane's reading list, not an enumeration of the graph. HQ2 is a control that must fail for any device reading FE + INT + MULT + N >= 0 without analyticity on the critical line (screen: lane c19-hq2-screen-fe-int-mult-pos-devices)."),
}
assert set(R18_DEVICES) == set(PROPOSED)
D = [(i, R18_DEVICES[i]['state'], R18_DEVICES[i]['name'], e + R18_DEVICES[i]['evidence'], nodes) if i in R18_DEVICES else (i, s, n, e, nodes)
     for i, s, n, e, nodes in D]
for _i in R18_DEVICES:
    PROPOSED[_i] = dict(PROPOSED[_i], status=R18_DEVICES[_i]['status'], closedOn=dict(
        round=18, referees=1, enteredBy='c19-repair-owed-record-r18-checkpoint-prep',
        files={'tz-one-sided-completion-bound-band': ['push/c18-tz-one-sided-bound-fe-reserve-bridge/REFEREE.md', 'push/c18-tz-band-completion-controls-server/REFEREE.md'],
               'exact-relation-rigidity': ['push/c18-exact-relation-rigidity-klein-spinor/REFEREE.md']}[_i],
        mapRow={'tz-one-sided-completion-bound-band': 'P58', 'exact-relation-rigidity': 'X1'}[_i],
        note='one referee per lane; second referee owed (c19-referee-r18-independent-sources)'))
# cells after round 18: id -> (state, text appended to the evidence)
R18_CELLS = {
 'silent-cell-u4': ('cell', " Round 18 result (one referee; map row G44): residual (iv) is CLOSED for the read 'positivity-derived inequality on shifts s + ikt or on powers of a character' (push/c18-u4-group-law-left-of-one-torus-orbit): the group-law step is positive definiteness of k -> Re Lambda_k(n) atom by atom, with no relation between primes; a pointwise bound left of 1 is zero-freeness itself; sign control of the zero terms forces a test at abscissa >= 1. E_a, the G_+ lift, U as a family, THIN, TW+, DEL and the Beurling-rational member pass. What stays a cell, with no passing control on file: inequalities quadratic in the logarithmic derivative, and reads of the phases at different primes jointly (round-19 lane c19-u4-joint-prime-phase-quadratic-dp-zeros)."),
 'silent-cell-u6c': ('cell', " Round 18 result (one referee; map row Z37): the cubic-cover half is CLOSED as a known array (cubic Gauss sums, the array of the rows Z14 / Z15 family; the sign candidate is a residue identity of Patterson's series); multiplicative unimodular twists pass every local relation. What stays a cell, with no passing control on file: the squarefree-class Whittaker constants of a genuine cusp form on the double cover (local Whittaker dimension 4; a method is written and not run; the test (K3) is not yet a defined statement; the Eisenstein twin is recalled, not run; zeta controls are not formulable on the cover). Round-19 lane c19-u6c-double-cover-k3-run."),
 'silent-cell-u6g': ('tried-not-closed', " Round 18: still TRIED, NOT CLOSED (push/c18-d10-inertia-law-theorem-t-lemma-d, one referee; partial result; map row D10, round-18 addendum). A symmetric off-line quartet gives a positive apex kernel of rank 6 in the rational model for all parameters (Theorem Q, exact) and passes on the zeta base (600 of 600); a pole-free base passes every insertion in Re a >= 0 (Theorem H); X(d) for all even d implies positivity of zeta's apex kernel and is proved for d = 2, 4 only. The parity clause of the round-17 inertia law holds in the model with b = u (u - 1) g for an odd number of real zeros (referee E-1; instances). The row cannot score whatever X(d) gives. Round-19 lane c19-d10-xd-determinant-pole-term-lemma-q."),
 'silent-cell-u3': ('closed', " Round 18: second referee pass on file (REFEREE2.md by c18-referee-r17-independent-sources: holds with wording corrections W1, W2); the closure rests on two referee passes. The residual entered as device type exact-relation-rigidity is closed (one referee; map row X1)."),
 'silent-cell-u6e': ('closed', " Round 18: second referee pass on file (REFEREE2.md by c18-referee-r17-independent-sources: holds; the vector with the T-NR coefficients is D xi_s, b = D); the closure rests on two referee passes. The residual 'states defined by exact relations' is closed with device type exact-relation-rigidity (one referee; map row X1)."),
 'silent-cell-u6f': ('closed', " Round 18: second referee pass on file (REFEREE2.md by c18-referee-r17-independent-sources: holds; for the Epstein control the mean A_p vanishes once on the arc and J = -infinity there); the closure rests on two referee passes."),
}
assert set(R18_CELLS) <= {c[0] for c in CELLS}
CELLS = [(i, R18_CELLS.get(i, (s,))[0], n, e + (R18_CELLS[i][1] if i in R18_CELLS else ''), nodes) for i, s, n, e, nodes in CELLS]
_u5 = [k for k, q in enumerate(PENDING) if q['name'].startswith('Cell U5 beyond a span')]
assert len(_u5) == 1
PENDING[_u5[0]] = dict(PENDING[_u5[0]], name=PENDING[_u5[0]]['name'] + '. Round 18: that device type is closed (one referee per lane; map row P58); row Q31 holds on two referees with corrections; the entry stays open as a read class with no candidate device')
assert not [d for d in D if d[1] == 'open'], 'an open device type remains'
'''
s = s.replace(anchor, block.lstrip('\n') + anchor)
open(p, 'w', encoding='utf-8').write(s)
print('patched mk_devices.py')

q = os.path.join(ENG, 'nodes', 'nodes-22.json')
d = json.load(open(q, encoding='utf-8'))
d['about'] += (" Round 19 (push/c19-repair-owed-record-r18-checkpoint-prep): both types are closed in curated/devices.json on the referee files of their "
               "round-18 lanes (one referee per lane); names and statements below say what those files hold. Tags, type and status fields are unchanged.")
upd = {
 'tz-one-sided-completion-bound-band': (
  'Closed device type (round 18, one referee per lane): one-sided completion bound in the band 1/2 < theta <= 1',
  " Outcome, round 18 (map row P58; one referee per lane): closed. N(theta) below the Nyquist band is, by an exact truncation identity valid for every Dirichlet series with a_1 = 1, a statement about the zeros of the partial sum D_P; no step uses multiplicativity; the reflected half is not seen by the band; ZQ passes for theta' < 1 in the lattice model; at theta' = 1 the statement is the target in a window. Measured on 96 modes at heights 1e6 to 1e12: the linear reflected completion is not a positive extension (zeta fails it in 600 of 600 cells); ZQ, E_0.1, DH and multiplicative sign chains pass N(theta) in parts of the band, with a dependence on the number of modes."),
 'exact-relation-rigidity': (
  'Closed device type (round 18, one referee): exact-relation rigidity',
  " Outcome, round 18 (map row X1; one referee): closed. Ordinary multiplicativity replaces no clause of the identifications on file: control HQ2 = zeta(s)(1 + eps u^2/(1 - u)^4), u = q^(1/2 - s), has the exact functional equation, integer frequencies, multiplicative coefficients >= 1 and zeros off the line, with a pole of order 4 at 1/2; TN1 = zeta(s)(1 + q^(3/4 - s)) lacks only the functional equation. The clause that completes the identification is analyticity on the critical line. Of the relations listed only the definition a(pn) = a(n) and the target J = 1 exclude every control."),
}
for n in d['nodes']:
    name, add = upd[n['id']]
    n['name'] = name
    n['statement'] = n['statement'] + add
    n['source'] = n['source'] + '; outcome entered by push/c19-repair-owed-record-r18-checkpoint-prep from push/c18-tz-one-sided-bound-fe-reserve-bridge, push/c18-tz-band-completion-controls-server, push/c18-exact-relation-rigidity-klein-spinor (REFEREE.md each)'
json.dump(d, open(q, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('patched nodes-22.json')
