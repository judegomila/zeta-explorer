#!/usr/bin/env python3
"""Engine edits of lane c21-record-engine-states-statement-o-v5-br-nodes (round 21, record lane B).
1. previous files -> engine/scratch/*.pre-c21-record.*
2. engine/nodes/nodes-23.json: three nodes (BR-2, BR-3, twin screen TS)
3. engine/curated/mk_devices.py: block R21 (two proposed, untested device types; cell U6 (c) -> closed if its second
   referee file is on disk; U4, U6 (a), U6 (b) -> closed only if a second referee file for each is on disk).
Text only; no data module is imported. Run once; anchors must match exactly once."""
import json, os, shutil, glob, sys
B = 'tmp/research-2026-11-16'
ENG = os.path.join(B, 'engine'); SCR = os.path.join(ENG, 'scratch'); SLUG = 'c21-record-engine-states-statement-o-v5-br-nodes'
MK = os.path.join(ENG, 'curated', 'mk_devices.py'); DJ = os.path.join(ENG, 'curated', 'devices.json')
N23 = os.path.join(ENG, 'nodes', 'nodes-23.json')
assert not os.path.exists(N23), 'nodes-23.json exists'
src = open(MK, encoding='utf-8').read()
assert 'R21' not in src
shutil.copy2(MK, os.path.join(SCR, 'mk_devices.pre-c21-record.py'))
shutil.copy2(DJ, os.path.join(SCR, 'devices.pre-c21-record.json'))

# ---- referee files on disk at the time of the edit
U6C_2 = 'push/c20-referee-theorem-d-headline-and-r19/REFEREE2-c19-u6c-double-cover-k3-run.md'
REFDIR = 'push/c21-referee-r20-theorems-a-c-u4-u6-nrq-f1'
have_u6c = os.path.exists(os.path.join(B, U6C_2))
refdir_files = sorted(os.path.basename(p) for p in glob.glob(os.path.join(B, REFDIR, '*'))) if os.path.isdir(os.path.join(B, REFDIR)) else None
def second(keys):
    if not refdir_files: return None
    c = [f for f in refdir_files if f.upper().startswith('REFEREE') and any(k in f.lower() for k in keys)]
    return c[0] if c else None
f_u4 = second(['u4']); f_u6ab = second(['u6ab', 'u6a', 'rank2'])
report = dict(time=__import__('datetime').datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ'), u6c_second_file=U6C_2, u6c_exists=have_u6c,
              referee_dir=REFDIR, referee_dir_exists=refdir_files is not None, referee_dir_files=refdir_files,
              u4_second_file=f_u4, u6ab_second_file=f_u6ab)
print(json.dumps(report, indent=1))
assert have_u6c
states = {'silent-cell-u6c': 'closed'}
if f_u4: states['silent-cell-u4'] = 'closed'
if f_u6ab: states['silent-cell-u6a'] = 'closed'; states['silent-cell-u6b'] = 'closed'
report['statesSet'] = states
json.dump(report, open(os.path.join(B, 'push', SLUG, 'logs', 'edit_engine_referee_files.json'), 'w'), indent=1)

EV = {
 'silent-cell-u6c': (" Round 21 (record lane c21-record-engine-states-statement-o-v5-br-nodes): state set to CLOSED. A second referee file is on disk: "
   + U6C_2 + " (holds, one wording point). Scope of that file, as it states: only Lemma Q (the interchange lemma: at every place the unordered pair of local "
   "similarity classes of (G_1, G_pq) equals that of (G_p, G_q)) was refereed; Lemma T, Lemma E, the Eisenstein values (132 of 132, ball arithmetic) and the "
   "cusp-form run (14 of 14, float64) have the first referee file as their only referee record. The cubic-cover half is map row Z37 (round 18, one referee). "
   "The closure is of the class as a read with a candidate object; it is not a statement about zeros of zeta."),
 'silent-cell-u4': (" Round 21 (c21-record-engine-states-statement-o-v5-br-nodes): %s"),
 'silent-cell-u6a': (" Round 21 (c21-record-engine-states-statement-o-v5-br-nodes): %s"),
 'silent-cell-u6b': (" Round 21 (c21-record-engine-states-statement-o-v5-br-nodes): %s"),
}
unchanged_note = ("state unchanged (cell). Closed by its round-20 lane on one referee file (ROUND_LOG.md round 20; STRATEGY.md section 3.1); the second referee "
                  "file is owed by " + REFDIR + ", which was not on disk when this block was written (%s). Set the state here when that file holds." % report['time'])
closed_note = "state set to CLOSED on the second referee file %s/%s."
ev = {'silent-cell-u6c': EV['silent-cell-u6c']}
ev['silent-cell-u4'] = EV['silent-cell-u4'] % ((closed_note % (REFDIR, f_u4)) if f_u4 else unchanged_note)
for k in ('silent-cell-u6a', 'silent-cell-u6b'):
    ev[k] = EV[k] % ((closed_note % (REFDIR, f_u6ab)) if f_u6ab else unchanged_note)

BR_SRC = ['push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md sections 0 and 3 (Theorems A, B, C; regimes by sigma_rel) and REFEREE.md (one independent referee, holds); second referee owed by ' + REFDIR,
          'campaign/STRATEGY.md section 4.0 (version 6): lead BR, items BR-0, BR-2, BR-3; section 2: three-lane rule and stopping rule for the lead',
          'campaign/ROUND_LOG.md round 20 (lesson: least blocked) and round 21 allocation (lanes 1 to 3)']
BR_CONTROLS = ['a named non-multiplicative control at the marked step (R1 test of STRATEGY section 2): DH; the Theorem C product of the line-2 lane (f_DH times on-line Dirichlet polynomial factors); zero-free exponential stages (Lemma E)',
               'THIN and DEL with b in (1/2, 1): Euler products without the functional equation whose continued relative product vanishes in 1/2 < Re s <= sigma_rel',
               'HQ1, HQ2, HQ3, HQ4 (zeta\'s functional equation, one modified prime, not geometric): they must be excluded by the local shape at a named step and not by the pole clause alone',
               'E_a, sign-twisted primes, unimodular twist (U), Beurling member, T-NR, NR-q, ZQ, SG, backward heat, phase-rotated transfer operator, theta^w: each with the failing hypothesis named']
PROP = {
 'br3-euler-shape-rigidity-regime3': dict(
  status='proposed, untested (lead BR of STRATEGY version 6; an identification question, cannot score by itself; lanes of round 21 had not reported when this entry was written)',
  sources=BR_SRC,
  entryConditions=[
   'E1. Statement BR-3 as written in STRATEGY section 4.0: abs(alpha_p) <= 1, G(s) = prod (1 - alpha_p p^-s)^-1 for Re s > 1, meromorphic of finite order on C with (s - 1) G(s) analytic near Re s >= 1/2 apart from finitely many poles, zeta\'s functional equation, and sum over p of abs(1 - alpha_p) p^-sigma divergent for some sigma > 1/2. Outcome is one of: G = zeta; or an explicit G != zeta with these properties.',
   'E2. BR-0 first (paper): if a Hamburger-type theorem with finitely many poles (map rows P56, P57, X1) places G in a finite-dimensional space containing no geometric degree-one Euler product other than zeta, BR-3 is decided from rows on file as an identification and this type is closed without a lane.',
   'E3. An identification (G = zeta) is a map row of class U3 with score 0. A displayed twin with an off-line zero is a new control with an Euler product and zeta\'s functional equation, score 0.',
   'E4. A score needs a step in 1/2 < Re s <= sigma_rel that reads the functional equation and the local shape jointly, fails for a named non-multiplicative control and for no multiplicative one, with a defect bound in the manner of Corollary A2. No such step and no method for it is on file: the proof of Theorem A has no input in that strip.',
   'E5. Limit, stated before work: BR is a statement about which functions share zeta\'s functional equation and local shape. It is not a statement about zeros of zeta and no route from it to one is registered. R4 is posed here only in relative form (continuation of zeta/G to the line).',
   'E6. Stopping rule: two refereed obstructions of the same kind close the regime (STRATEGY sections 2 and 3).'],
  controlsThatMustFail=BR_CONTROLS),
 'br2-sparse-pole-lattice-regime-k': dict(
  status='proposed, untested (lead BR of STRATEGY version 6, regime 2 = (K); an identification question, cannot score by itself; lanes of round 21 had not reported when this entry was written)',
  sources=BR_SRC + ['campaign/ROUND_LOG.md round 21 allocation, lane 2: the planner\'s first lemma (cofactor bound 2^(-N_S) > delta^(1-c) at distance delta to the right of a local pole) is a sketch, OPEN until a lane proves it'],
  entryConditions=[
   'E1. Statement BR-2 as written in STRATEGY section 4.0: abs(alpha_p) = p^(1/2) on a set S of primes with sum over S of p^-sigma finite for every sigma > 1/2 and infinite at 1/2, alpha_p = 1 off S (this drops abs(alpha_p) <= 1). Outcome is one of: the product has Re s = 1/2 as a natural boundary; or a twin is constructed.',
   'E2. Known before work (Theorem C of the source lane, one referee): a twin in regime (K) has no zero off the line beyond zeta\'s, and a twin of finite order has a zero of G/zeta on the line. A twin here is therefore an on-line control and cannot serve as an off-line control.',
   'E3. A natural-boundary proof is an identification-type row (score 0) and closes regime (K) for the sparse subclass only; the subclass is stated with its counting-function condition.',
   'E4. The numerical test (partial relative products in ball arithmetic on sparse and less sparse S; statistic: radial growth exponent at local pole points 1/2 + 2 pi i k/log p and at generic points of the line; rows DEL, THIN, HQ1) is MEASURED support only and is pre-registered.',
   'E5. Limit, stated before work: as for BR-3; nothing about zeros of zeta follows from either outcome.',
   'E6. Stopping rule: two refereed obstructions of the same kind close the regime.'],
  controlsThatMustFail=BR_CONTROLS),
}
NAMES = {
 'br3-euler-shape-rigidity-regime3': ('PROPOSED, UNTESTED: BR-3, Euler-shape rigidity in regime 3 (relative abscissa sigma_rel > 1/2): G with geometric degree-one local factors, finite order, finitely many poles and zeta\'s functional equation is zeta, or a twin is displayed',
   "Proposed device type, untested (entered by c21-record-engine-states-statement-o-v5-br-nodes, round 21, on the planner's request in STRATEGY version 6, section 1, lane B). Registered as a device type only so that generate.py can rank it: it is the one place on file where the passage to the critical line is posed, in relative form (zeta/G continued from Re s > sigma_rel to the line), with a proof method on file for regime 1. Source lane: Theorem A (regime 1: G = zeta; no multiplicativity used; any base in place of zeta), one referee. No statement in regime 3 is on file; THIN and DEL show that without the functional equation the continued relative product can vanish in 1/2 < Re s <= sigma_rel. Not a lead with a score: an identification gives a map row. Entry conditions and the controls that must fail: fields entryConditions, controlsThatMustFail."),
 'br2-sparse-pole-lattice-regime-k': ('PROPOSED, UNTESTED: BR-2, regime (K) of Euler-shape rigidity on sparse prime sets with abs(alpha_p) = p^(1/2): natural boundary on Re s = 1/2 (local pole lattices 1/2 + 2 pi i k/log p) or a twin',
   "Proposed device type, untested (entered by c21-record-engine-states-statement-o-v5-br-nodes, round 21, on the planner's request in STRATEGY version 6, section 1, lane B). Registered as a device type only so that generate.py can rank it. Source lane: Theorem C (a twin in regime (K) has no off-line zero beyond zeta's; a twin of finite order has a zero of G/zeta on the line), one referee; the lane argues a natural boundary and does not prove it. The geometric program enters as the reading of the prime torus / zero channels as the pole lattices of the local factors. Not a lead with a score. Entry conditions and the controls that must fail: fields entryConditions, controlsThatMustFail."),
}
block = '''
# ---- c21-record-engine-states-statement-o-v5-br-nodes (round 21, record lane B). Previous file:
# scratch/mk_devices.pre-c21-record.py. (1) Cell states: a cell goes to 'closed' only if a second referee file was on
# disk when this block was written (%(time)s). U6 (c): %(u6c)s. U4, U6 (a), U6 (b): second files owed by
# %(refdir)s; directory on disk: %(refdir_exists)s; files matched: U4 %(f_u4)s, U6 (a),(b) %(f_u6ab)s.
# (2) Two PROPOSED device types for the lead BR (STRATEGY version 6, section 4.0), state 'open', status 'proposed,
# untested': a question with entry conditions, not a lead with a score; generate.py applies no penalty waiver to them.
R21_CELL_STATES = %(states)r
R21_CELL_EVIDENCE = %(ev)r
assert set(R21_CELL_EVIDENCE) <= {c[0] for c in CELLS}
for _f in %(needed)r:
    assert os.path.exists(os.path.join(HERE, '..', '..', _f)), 'referee file missing: ' + _f
CELLS = [(i, R21_CELL_STATES.get(i, s), n, e + R21_CELL_EVIDENCE.get(i, ''), nodes) for i, s, n, e, nodes in CELLS]
R21_PROPOSED = %(prop)r
R21_NAMES = %(names)r
assert not (set(R21_PROPOSED) & {d[0] for d in D})
PROPOSED.update(R21_PROPOSED)
D += [(i, 'open', R21_NAMES[i][0], R21_NAMES[i][1], [i]) for i in sorted(R21_PROPOSED)]
''' % dict(time=report['time'], u6c=U6C_2, refdir=REFDIR, refdir_exists=refdir_files is not None, f_u4=f_u4, f_u6ab=f_u6ab,
           states=states, ev=ev, needed=[U6C_2] + ([REFDIR + '/' + f_u4] if f_u4 else []) + ([REFDIR + '/' + f_u6ab] if f_u6ab else []),
           prop=PROP, names=NAMES)
anchor = '# Scoped after referee E2 of c19-repair-owed-record-r18-checkpoint-prep'
assert src.count(anchor) == 1
src = src.replace(anchor, block.lstrip('\n') + anchor)
hdr_anchor = '\nHERE = os.path.dirname(os.path.abspath(__file__))\n'
assert src.count(hdr_anchor) == 1
i = src.index(hdr_anchor); j = src.rfind('"""', 0, i)
assert j > 0
src = src[:j] + "Edited by c21-record-engine-states-statement-o-v5-br-nodes (round 21): block R21. Cell U6 (c) cell -> closed on its second referee file (scope: Lemma Q only); U4, U6 (a), U6 (b) " + ('set closed where a second file was on disk' if (f_u4 or f_u6ab) else 'unchanged (second referee files not on disk)') + "; two proposed, untested device types for the lead BR (br2-sparse-pole-lattice-regime-k, br3-euler-shape-rigidity-regime3), state open (previous file scratch/mk_devices.pre-c21-record.py).\n" + src[j:]
open(MK, 'w', encoding='utf-8').write(src)

def node(i, name, statement, tags, typ='open-direction', mult='unknown'):
    return dict(id=i, type=typ, name=name, statement=statement, status='conjectural', usesMultiplicativity=mult, heightUniform='unknown',
                source='campaign/STRATEGY.md section 4.0 (version 6) and section 1; campaign/ROUND_LOG.md round 20 (lessons) and round 21 allocation; push/c20-euler-shape-rigidity-infinite-modified-primes (RESULT.md, REFEREE.md, one referee); entered by push/' + SLUG,
                tags=tags)
nodes = [
 node('br3-euler-shape-rigidity-regime3', 'Proposed, untested: BR-3, Euler-shape rigidity in regime 3 (relative abscissa above 1/2)',
      "Proposed, untested device type; an identification question. Let abs(alpha_p) <= 1 for every prime p and G(s) = prod over p of (1 - alpha_p p^-s)^-1 for Re s > 1. Suppose G extends to a meromorphic function on C of finite order with (s - 1) G(s) analytic near Re s >= 1/2 apart from finitely many poles, and G satisfies the functional equation of zeta. Suppose sum over p of abs(1 - alpha_p) p^-sigma diverges for some sigma > 1/2 (regime 3: the relative product zeta/G has abscissa of absolute convergence sigma_rel > 1/2). Question: is G = zeta, or is there an explicit G != zeta with these properties. On file (one referee): regime 1 (the sum converges at 1/2) gives G = zeta (Theorem A; the proof uses reflection and Liouville's theorem, no multiplicativity, and holds with any base in place of zeta); the proof has no input in 1/2 < Re s <= sigma_rel; THIN and DEL show that without the functional equation the continued relative product can vanish there. BR-0 (paper, first): whether Hamburger-type theorems with finitely many poles (rows P56, P57, X1) already decide the question. An identification scores 0 and enters class U3; a twin with an off-line zero would be a control with an Euler product and zeta's functional equation. Not a statement about zeros of zeta; no route from it to one is registered.",
      ['euler-product', 'functional-equation', 'rigidity', 'identification', 'local-euler-shape', 'hamburger', 'pole-clause', 'twin-ladder'], mult='unknown'),
 node('br2-sparse-pole-lattice-regime-k', 'Proposed, untested: BR-2, regime (K) on sparse prime sets: natural boundary on the critical line or a twin',
      "Proposed, untested device type; an identification question. For abs(alpha_p) = p^(1/2) on a set S of primes with sum over S of p^-sigma finite for every sigma > 1/2 and infinite at 1/2, and alpha_p = 1 off S: either the product G has the line Re s = 1/2 as a natural boundary, or a twin (G != zeta with zeta's functional equation) is constructed. The local factor at p in S has poles on the lattice 1/2 + 2 pi i k/log p (the reading of the prime torus and of the zero channels in the geometric program). On file (one referee): Theorem C: a twin in regime (K) has no zero off the line beyond zeta's, and a twin of finite order has a zero of G/zeta on the line. The planner's first lemma (cofactor of the factor at p at distance delta to the right of a local pole at least 2^(-N_S) > delta^(1-c) on super-sparse S, so abs(G) >= delta^(-c)/log p at a dense set of the line) is a sketch, OPEN. A natural-boundary proof is an identification-type row (score 0) for the sparse subclass; a twin is an on-line control. Not a statement about zeros of zeta.",
      ['euler-product', 'functional-equation', 'rigidity', 'identification', 'local-euler-shape', 'prime-torus', 'torus', 'zero-channel', 'pole-clause']),
 node('twin-screen-ts', 'Twin screen TS: three structural reasons applied to a device, statistic or combination before a lane is launched',
      "A filter, not a device and not a lead. Written by lane c21-twin-screen-ts (round 21; not on disk as a refereed file when this node was entered). A row of TS states for a device type, a pending item or an object of the geometric program (twin ladder, bridge, bridge shear, antibridge, torus, Klein, spinor, twistor, zero channels, vortex) which of three reasons applies, or that none does. Reason 1, window scalar (Lemma S): on window vectors at height t the archimedean side is a scalar up to log t / t, so a form pairing the prime side below P with the gamma side is the first-order band form times a scalar. Reason 2, twin invisibility at a stage (K3-M with Theorem A): every form reading Lambda(n), n < P, with the gamma side takes the same value for zeta and for twins modified at a prime q >= P (HQ1, HQ3, HQ4 at q >= P; HQ2 at q^2 >= P). Reason 3, stage-level tests are not arithmetic (Lemma E; Theorem C of the line-2 lane): zero-free finite stages exist for Davenport-Heilbronn, and a non-Euler series with off-line zeros passes Pick positivity to any order on bounded node ranges. Rule (STRATEGY version 6, section 2): from round 22 no lane is launched before its row of TS exists; a row to which one of the three reasons applies is not launched; a row marked 'none of the three' is a candidate of the inverse-explore slot. Each reason has one referee file. Not a statement about zeros of zeta.",
      ['prefilter', 'filter', 'screen', 'control', 'twin-ladder', 'finite-stage', 'bridge', 'antibridge', 'pick', 'euler-product'], typ='tool'),
]
json.dump(dict(about='Nodes for the lead BR (BR-2, BR-3) and the twin screen TS; curated; entered by push/' + SLUG + ' (round 21). BR-2 and BR-3 are proposed, untested device types of curated/devices.json; TS is a filter (type tool).', nodes=nodes),
          open(N23, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('written', N23, 'and', MK)
