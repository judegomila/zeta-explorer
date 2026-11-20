#!/usr/bin/env python3
"""Engine edits of lane c18-repair-owed-record-r17-open-device-nodes. Anchored text replacements in
engine/curated/mk_devices.py, engine/build_graph.py, engine/generate.py; writes engine/nodes/nodes-22.json.
Previous files: before/ (mk_devices.py, build_graph.py, generate.py). Each anchor must match exactly once."""
import os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ENG = os.path.normpath(os.path.join(HERE, '..', '..', 'engine'))
def patch(rel, jobs):
    p = os.path.join(ENG, rel); s = open(p, encoding='utf-8').read()
    assert 'c18-repair-owed-record-r17-open-device-nodes' not in s, 'already applied: ' + rel
    for a, b in jobs:
        assert s.count(a) == 1, (rel, a[:70], s.count(a))
        s = s.replace(a, b)
    open(p, 'w', encoding='utf-8').write(s); print('patched', rel, len(jobs))

# ------------------------------------------------------------------ curated/mk_devices.py
MK_HEADER = '''Edited by c18-repair-owed-record-r17-open-device-nodes (round 18): cell states after round 17 (block R17_CELLS: U3 read as an inequality, U6 (e), U6 (f) closed on one referee each; U6 (g) stays tried-not-closed; U8 stays a cell with the DU result). Two PROPOSED device types added as open nodes (block PROPOSED; nodes/nodes-22.json): tz-one-sided-completion-bound-band and exact-relation-rigidity, each with status 'proposed, untested', written entry conditions and the controls that must fail. They are not cells and no cell node is re-entered as a device (asserted below). Previous file scratch/mk_devices.pre-c18-repair.py.
Edit this file, then run it, then build_graph.py."""'''
MK_BLOCK = r'''
# ---- c18-repair-owed-record-r17-open-device-nodes: cell states after round 17 (ROUND_LOG.md, 'Round 17 results').
# id -> (state, text appended to the evidence). One referee each; independent second passes are owed by
# c18-referee-r17-independent-sources. A closed cell node rejects every candidate that contains it.
R17_CELLS = {
 'silent-cell-u3': ('closed', " Round 17: CLOSED for the reading as an inequality (one referee; second pass owed). push/c17-u3-inequality-discontinuity-functional (map row P57): a quantitative identification 'defect delta forces zeros within f(delta), f(0) = 0' is target-level in all three relaxation directions (Proposition TL); Proposition W (zeta times a symmetric T-NR factor at q = 1 + delta: exact functional equation, N >= 0, atoms within delta of log n, zeros at any distance b from the line) and Lemma LR (a local-root bound is the statement about the factor's own zeros) are PROVED; multiplicativity enters no proved step; NR-q is multiplicative on its own semigroup and fails through integrality. The residual is not a cell: exact relations at defect 0 in rigidity form, entered as the proposed device type exact-relation-rigidity."),
 'silent-cell-u6e': ('closed', " Round 17: CLOSED for positivity reads and for the eigenstate class (one referee; second pass owed). push/c17-u6e-bost-connes-non-invariant-state-twin-ladder (map row D8, clause (vi)): positivity of a state is invariant under conjugation by an invertible element (classical), and T-NR in the conjugation form, finite DEL and the gauge twins have this form; mu*-eigenstates exist for every Re s > 0 and on the algebraic Hecke algebra and on absolutely summable elements read zeta only at real part > 1; two eigenstates on Re s = beta/2 are at norm distance exactly 2 for beta <= 1. DEL and E_a pass every step. Residual: states defined by exact relations (proposed device type exact-relation-rigidity) and Weil-form weights (rows P1, G21)."),
 'silent-cell-u6f': ('closed', " Round 17: CLOSED for the three reads norm, Jensen gap, discriminant (one referee; second pass owed). push/c17-u6f-isogenous-points-norm-jensen-gap (map row G33): the norm is theta(x)^(p^2+p)/(theta(x/p^2) theta(p^2 x)), a dilation-module identity (PROVED); the Jensen gap is negative on the whole arc with limit log(p/(p+2)) (PROVED); the discriminant sign is a parity count (classical); Epstein theta(x) theta(nx), n = 5, 6, passes all three at inert primes (PROVED). Residual: symmetric functions of degree at least 3 of the point values, no candidate inequality on file."),
 'silent-cell-u6g': ('tried-not-closed', " Round 17: still TRIED, NOT CLOSED. push/c17-rank2-gram-symmetric-blaschke-closure (one referee; partial result; map row D10, round-17 revision): closure under symmetric Blaschke insertions neither proved nor refuted; Lemma M (reduction to the apex kernel at T = 0 under rank-one positivity) and Theorem T (rational model) PROVED; 1,397,025 + 5,208 certified positive Gram matrices, 0 failures, 47% of the registered plan; ZQ in the rational form passes (3,360 certified matrices; the round-16 table entry 'ZQ fails at S3/S4' is wrong); with the pole-free DH base the form detects neither reflection nor parity defects (referee). Round-18 lane c18-d10-inertia-law-theorem-t-lemma-d."),
 'silent-cell-u8': ('cell', " Round 17: the restricted search on dictionary DU is closed as MEASURED, outcome 'none' (push/c17-u8-restricted-search-lemma-h-gated, one referee; map row G43): 4,360,000 family-nodes with the referee's completion of the cut streams, 0 hold-out survivors, 0 undecided; five two-class passes are identifications. Lemma H holds on two referees and a third derivation. The class beyond DU (orders above 6, more than four parameters, other kernels, the six controls not run) stays a cell."),
 'silent-cell-u4': ('cell', " Round 18: the residual (group-law inequality left of abscissa 1) is the explore slot, lane c18-u4-group-law-left-of-one-torus-orbit (not reported when this entry was written)."),
 'silent-cell-u6c': ('cell', " Round 18: lane c18-u6c-gl3-cover-whittaker-constants-method (not reported when this entry was written)."),
}
assert set(R17_CELLS) <= {c[0] for c in CELLS}
CELLS = [(i, R17_CELLS.get(i, (s,))[0], n, e + (R17_CELLS[i][1] if i in R17_CELLS else ''), nodes) for i, s, n, e, nodes in CELLS]

# ---- c18-repair-owed-record-r17-open-device-nodes: two PROPOSED device types, state 'open', status 'proposed,
# untested'. They exist so that generate.py has an open device node and can rank explore slots (ROUND_LOG.md, round 17,
# 'Lead that looks least blocked', last sentence). A proposed type is a question with entry conditions, not a lead:
# no lane has passed stage A on it. generate.py: it satisfies the R4-device rule and has the open-device weight; the
# three penalty waivers of an open device (reuse of a node of a closed lane, flow-side majority, mean-value majority)
# are NOT applied to it; the rejection exemption 'closed family matched by the device text alone' is kept (it guards
# against a regex match on the device's own description and is not a penalty).
PROPOSED = {
 'tz-one-sided-completion-bound-band': dict(
  status='proposed, untested',
  sources=['push/c17-window-information-law-ctheta-u5 (RESULT.md section 3, bound N(theta); Lemma E; REFEREE.md, one referee)',
           'campaign/ROUND_LOG.md round 17: lesson 5, combinable 2, lead (b)',
           'map row Q31 (one referee)'],
  entryConditions=[
   'E1. One displayed inequality: a one-sided bound for the operator T_Z (equivalently for the logarithmic derivative of the truncated Euler product in the algebra of truncated shifts) on L^2 of an interval of length u = theta log(t/2 pi) with 1/2 < theta <= 1, with an explicit completion term (the reflected half of the approximate functional equation, or the pole term of the explicit formula), stated with its dependence on t.',
   'E2. The inequality is not the exact device above the band u = log(t/2 pi) with tolerance 0 (that is the target restricted to a window, row Q31), is not implied by a mean value (MV-CAP) and is not a restatement of verified height.',
   'E3. The step that uses the completion term reads the coefficients against the functional-equation reserve. The factorisation alone is not that step: the truncated Euler product identity holds exactly for every completely multiplicative chain (Lemma E).',
   'E4. Before any proof attempt the inequality is run on paper against every control below, with the failing step named for each; a control that passes every step closes the type.',
   'E5. A statement uniform in t is required for R2 and a proved passage from the band to the line for R4; a bound at finitely many heights is MEASURED support only.'],
  controlsThatMustFail=[
   'DH (Davenport-Heilbronn): at a named step; zero location alone is not a step',
   'E_a = zeta(s+a) zeta(s-a): its zero set is a row of spacing 2 pi/log(t/2 pi) and passes the complete device for every u <= log(t/2 pi) in the lattice model (referee E1 of the window-law lane), so the bound must fail for it at the completion step',
   'T-NR (passes band devices for P <= q) and T-NR in symmetric form with q -> 1 (Proposition W)',
   'ZQ (rows pass the band device) and SG',
   'sign-twisted primes and random sign chains (they have the factorisation; measured to fail N(theta) at theta >= 1 only)',
   'unimodular twist', 'backward heat', 'NR-q', 'Beurling', 'phase-rotated transfer operator', 'theta^w']),
 'exact-relation-rigidity': dict(
  status='proposed, untested',
  sources=['push/c17-u6e-bost-connes-non-invariant-state-twin-ladder (lane 1 of round 17: twins of the form b xi are rejected only by an exact relation; one referee)',
           'push/c17-u3-inequality-discontinuity-functional (lane 3 of round 17: stability reads the functional equation and integrality; Proposition W, Lemma LR, Proposition TL; one referee)',
           'push/c16-pos-fe-u2-positivity-rigidity (Theorem P; three referee files; map row P56)',
           'campaign/ROUND_LOG.md round 17: lessons 1 and 3, combinable 1'],
  entryConditions=[
   'E1. One displayed exact relation R(F) = 0 that zeta satisfies, on a named class of functions that excludes the Proposition W twins by the support clause and NR-q by integrality.',
   'E2. Rigidity form only. A quantitative conclusion "zeros within f(defect) of the line, f(0) = 0" on a class containing zeta at defect 0 is the target (Proposition TL; map row P57) and does not enter. Admissible: the failure set of the relation is open in a topology in which the zero set moves continuously, or a named control fails the relation at a named step.',
   'E3. The relation is not an identification already on file (Hamburger {FE, INT}; Kaczorowski-Perelli in degree one; Theorem P {FE, pole at 1 only, finite order, N >= 0 on [1, inf)}; Lemma L) and one step of its proof uses multiplicativity (Theorem P uses none).',
   'E4. The relation is not positivity of a state or of a kernel: positivity is invariant under conjugation by an invertible element, so T-NR in the conjugation form, finite DEL and the gauge twins pass (map row D8 (vi)).',
   'E5. The relation has a stated consequence for the zero set; an identification with no consequence for zeros gives a map row, not a score.'],
  controlsThatMustFail=[
   'T-NR in the conjugation form b = D^(1/2) and T-NR in symmetric form with q -> 1 (Proposition W)',
   'finite DEL and the gauge twins (window translate)',
   'NR-q: it is multiplicative on its own semigroup, so its failure can come from integrality only; that gives R3 for this control and not R1',
   'ZQ and SG (fail through integrality: an absolutely continuous signed density)',
   'E_a', 'DH', 'sign-twisted primes', 'unimodular twist', 'backward heat', 'Beurling',
   'phase-rotated transfer operator', 'theta^w', 'Epstein theta(x) theta(nx) at inert primes when the relation is of Hecke type']),
}
D += [
 ('tz-one-sided-completion-bound-band', 'open', 'PROPOSED, UNTESTED: one-sided completion bound in the band 1/2 < theta <= 1 (bound N(theta) on the band operator T_Z with a completion term from the functional equation)',
  "Proposed device type, untested (entered by c18-repair-owed-record-r17-open-device-nodes, round 18). Source: the window information law of push/c17-window-information-law-ctheta-u5 (one referee; map row Q31): band-limited positivity devices are forms of one operator T_Z; the missing input between P = sqrt(t/2 pi) and P = t/2 pi is a one-sided operator bound tied to the functional-equation reserve. No inequality is on file; no lane has passed stage A; lanes c18-tz-one-sided-bound-fe-reserve-bridge and c18-tz-band-completion-controls-server had not reported when this entry was written. Entry conditions and the controls that must fail: fields entryConditions, controlsThatMustFail.",
  ['tz-one-sided-completion-bound-band']),
 ('exact-relation-rigidity', 'open', 'PROPOSED, UNTESTED: exact-relation rigidity (an exact relation at defect 0 with an open failure set, on a class excluding Proposition W twins by support and NR-q by integrality)',
  "Proposed device type, untested (entered by c18-repair-owed-record-r17-open-device-nodes, round 18). Source: round-17 lanes 1 and 3 with Theorem P: twins of the form b xi pass every positivity of a state and can be rejected only by an exact relation; a quantitative identification is target-level; what remains admissible is a rigidity statement. No relation is on file; no lane has passed stage A; lane c18-exact-relation-rigidity-klein-spinor had not reported when this entry was written. Entry conditions and the controls that must fail: fields entryConditions, controlsThatMustFail.",
  ['exact-relation-rigidity']),
]
assert not ({n for d in D for n in d[4]} & {n for c in CELLS for n in c[4]}), 'a cell node re-entered as a device'
'''
patch('curated/mk_devices.py', [
 ('Edit this file, then run it, then build_graph.py."""', MK_HEADER),
 ("out = dict(\n    about=", MK_BLOCK + "out = dict(\n    about="),
 ("devices=[dict(id=i, state=s, name=n, evidence=e, nodes=nodes) for i, s, n, e, nodes in D],",
  "devices=[dict(id=i, state=s, name=n, evidence=e, nodes=nodes, **PROPOSED.get(i, {})) for i, s, n, e, nodes in D],"),
 ("PENDING = [", "PENDING = [\n # c18-repair: the entries of the rank-2 closure and of cell U5 carry their round-17 state in the name text\n"),
 ("measured to pass, not proved (map row D10; cell U6 (g))', lane='c17-rank2-gram-symmetric-blaschke-closure', state='open'),",
  "measured to pass, not proved (map row D10; cell U6 (g)). Round 17 (one referee): partial result; neither proved nor refuted; Lemma M and Theorem T proved; 1,397,025 + 5,208 certified positive matrices, 0 failures; ZQ rational form passes; round-18 lane c18-d10-inertia-law-theorem-t-lemma-d', lane='c17-rank2-gram-symmetric-blaschke-closure', state='tried-not-closed'),"),
 ("every statement found there is F = zeta on the window). No lane; no node', lane=None, state='open'),",
  "every statement found there is F = zeta on the window). Round 17: the window information law (map row Q31, one referee) reads the class as a density condition on a band-u device; the proposed device type tz-one-sided-completion-bound-band carries the one input named there', lane='c17-window-information-law-ctheta-u5', state='open'),"),
])

# ------------------------------------------------------------------ nodes/nodes-22.json
nodes = dict(
 about=("Two proposed, untested device types entered as open device nodes by push/c18-repair-owed-record-r17-open-device-nodes "
        "(campaign round 18) so that generate.py can rank explore slots. Not leads: no lane has passed stage A on either. "
        "Entry conditions and the controls that must fail are in curated/devices.json (fields entryConditions, controlsThatMustFail). "
        "Tags are the reader's: each geometric-program tag is one that the round-18 planner named as a carrier for the type."),
 nodes=[
  dict(id='tz-one-sided-completion-bound-band', type='open-direction',
       name='Proposed device type (untested): one-sided completion bound in the band 1/2 < theta <= 1',
       statement=("Proposed, untested device type. Question: is there a one-sided bound N(theta) for the band operator T_Z (the Weil form on "
                  "tests supported on an interval of length u = theta log(t/2 pi)), 1/2 < theta <= 1, with a completion term taken from the "
                  "reflected half of the approximate functional equation or from the pole term, that zeta satisfies and every control fails at "
                  "a named step. Background (window information law, one referee): band devices are forms of one operator; between "
                  "P = sqrt(t/2 pi) and P = t/2 pi the missing input is this bound; the truncated Euler product identity holds for every "
                  "completely multiplicative chain and is not that input; sign chains fail the bound at theta >= 1 only in measurements. "
                  "Carriers named by the planner: bridge and antibridge Hankel blocks, pole-term Schur complement. No inequality is on file. "
                  "Not a statement about zeros."),
       status='conjectural', usesMultiplicativity='unknown', heightUniform='unknown',
       source='push/c17-window-information-law-ctheta-u5/RESULT.md section 3 and REFEREE.md; campaign/ROUND_LOG.md round 17 (lesson 5, combinable 2) and round 18 allocation (lanes 2, 3); entered by push/c18-repair-owed-record-r17-open-device-nodes',
       tags=['weil', 'toeplitz', 'hankel', 'explicit-formula', 'functional-equation', 'bridge', 'antibridge', 'turan']),
  dict(id='exact-relation-rigidity', type='open-direction',
       name='Proposed device type (untested): exact-relation rigidity',
       statement=("Proposed, untested device type. Question: is there an exact relation that zeta satisfies at defect 0, on a class that excludes "
                  "the symmetric-factor twins by the support clause and the non-rational local factor by integrality, whose failure set is open "
                  "in a topology in which the zero set moves continuously, and which a named control fails for a multiplicative reason. "
                  "Background (round 17, one referee each): positivity of a state is invariant under conjugation by an invertible element, so "
                  "twins of the form b xi are rejected only by an exact relation; a quantitative identification is target-level; stability reads "
                  "the functional equation and integrality. Carriers named by the planner: Klein seam identity, spinor square root S causal, "
                  "Bost-Connes twin ladder. No relation is on file. Not a statement about zeros."),
       status='conjectural', usesMultiplicativity='unknown', heightUniform='unknown',
       source='push/c17-u6e-bost-connes-non-invariant-state-twin-ladder; push/c17-u3-inequality-discontinuity-functional; push/c16-pos-fe-u2-positivity-rigidity (Theorem P); campaign/ROUND_LOG.md round 17 (lessons 1, 3; combinable 1) and round 18 allocation (lane 6); entered by push/c18-repair-owed-record-r17-open-device-nodes',
       tags=['rigidity', 'identification', 'functional-equation', 'klein', 'spinor', 'twin-ladder', 'bost-connes', 'hecke'])])
p = os.path.join(ENG, 'nodes', 'nodes-22.json'); assert not os.path.exists(p)
json.dump(nodes, open(p, 'w', encoding='utf-8'), indent=1, ensure_ascii=False); print('wrote nodes/nodes-22.json')

# ------------------------------------------------------------------ build_graph.py: carry the status of a device
patch('build_graph.py', [
 ("                out[nid] = dict(type=d['id'], state=d['state'], evidence=d.get('evidence', ''))\n    return out\n\n\n# ---- curated cells",
  "                out[nid] = dict(type=d['id'], state=d['state'], evidence=d.get('evidence', ''))\n"
  "                # c18-repair-owed-record-r17-open-device-nodes: a proposed, untested device type carries its status\n"
  "                if d.get('status'):\n"
  "                    out[nid]['status'] = d['status']\n    return out\n\n\n# ---- curated cells")])

# ------------------------------------------------------------------ generate.py
patch('generate.py', [
 ('import argparse',
  'import argparse  # rule note for proposed device types: see PROPOSED_NOTE below'),
 ("DEVICE_TAG = 'crossing-device'",
  "DEVICE_TAG = 'crossing-device'\n"
  "# Rule added by lane c18-repair-owed-record-r17-open-device-nodes (campaign round 18):\n"
  "#   proposed   a device of curated/devices.json with state 'open' and status 'proposed, untested' is an open device for\n"
  "#              the R4-device rule and for the weight deviceOpen, and keeps the rejection exemption 'closed family matched\n"
  "#              by the device text alone'. The three penalty waivers of an open device (reuse of a node of a closed lane,\n"
  "#              flow-side majority, mean-value majority) are NOT applied to it unless --proposed-waivers is given.\n"
  "#              meta.r4Rules reports topWithProposedDevice and the count per proposed node.\n"
  "PROPOSED_NOTE = ('a proposed, untested device type: a question with entry conditions (curated/devices.json), not a lead; '\n"
  "                 'no penalty is waived for it')"),
 ("    ap.add_argument('--no-r4-rules', action='store_true',",
  "    ap.add_argument('--proposed-waivers', action='store_true',\n"
  "                    help='apply the penalty waivers of an open device also to proposed, untested device types (comparison run)')\n"
  "    ap.add_argument('--no-r4-rules', action='store_true',"),
 ("    def cell_state(i):",
  "    def is_proposed(i):\n"
  "        \"\"\"True for a device node whose type is marked 'proposed, untested' (c18-repair).\"\"\"\n"
  "        d = node[i].get('device')\n"
  "        return bool(d and str(d.get('status', '')).startswith('proposed'))\n\n"
  "    def waiver_open(i):\n"
  "        \"\"\"open device that carries the penalty waivers of the open-device rule\"\"\"\n"
  "        return device_kind(i) == 'open' and (args.proposed_waivers or not is_proposed(i))\n\n"
  "    def cell_state(i):"),
 ("        if r4_rules and 2 * len(lam_members) > len(mid) and not any(k == 'open' for _, k in dev):",
  "        if r4_rules and 2 * len(lam_members) > len(mid) and not any(waiver_open(i) for i, _ in dev):"),
 ("        if r4_rules and 2 * len(mv_members) > len(mid) and not any(k == 'open' for _, k in dev):",
  "        if r4_rules and 2 * len(mv_members) > len(mid) and not any(waiver_open(i) for i, _ in dev):"),
 ("                if (on & set(mid)) <= set(open_dev_ids):",
  "                if (on & set(mid)) <= set(i for i in open_dev_ids if waiver_open(i)):"),
 ("        cell_m = [(i, cell_state(i)) for i in mid if cell_state(i)]",
  "        for i in mid:\n"
  "            if is_proposed(i):\n"
  "                notes.append('member ' + i + ' is ' + PROPOSED_NOTE)\n"
  "        cell_m = [(i, cell_state(i)) for i in mid if cell_state(i)]"),
 ("            r4Devices=[dict(id=i, kind=k, type=node[i]['device']['type']) for i, k in dev],",
  "            r4Devices=[dict(id=i, kind=k, type=node[i]['device']['type'], **({'status': node[i]['device']['status']} if is_proposed(i) else {})) for i, k in dev],"),
 ("                               topWithCell=sum(1 for s in top if s['cells']),",
  "                               topWithCell=sum(1 for s in top if s['cells']),\n"
  "                               proposedDeviceNodes=sorted(i for i in DECL if is_proposed(i)),\n"
  "                               proposedWaivers=bool(args.proposed_waivers),\n"
  "                               topWithProposedDevice=sum(1 for s in top if any(d.get('status') for d in s['r4Devices'])),\n"
  "                               topPerProposedNode={i: sum(1 for s in top if any(d['id'] == i for d in s['r4Devices']))\n"
  "                                                   for i in sorted(DECL) if is_proposed(i)},"),
])
