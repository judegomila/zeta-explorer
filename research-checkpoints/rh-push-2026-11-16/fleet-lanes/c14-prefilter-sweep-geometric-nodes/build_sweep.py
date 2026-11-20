# Assembles sweep.json and SWEEP_TABLE.md from the hand-written verdict files v_*.txt (one line per node, written
# after reading the node statement) and runs the control check and a keyword cross-check. Text only.
import json, glob, collections, re
D = 'tmp/research-2026-11-16/push/c14-prefilter-sweep-geometric-nodes/'
G = {'twin-ladder','bridge','shear','antibridge','torus','klein','spinor','twistor','zero-channel','vortex','bridge-square','prime-torus'}
nodes = json.load(open(D + 'selected_nodes.json'))
rows = {}
for f in sorted(glob.glob(D + 'v_*.txt')):
    for line in open(f):
        line = line.strip()
        if not line: continue
        i, steps, qp, qb, qs, v, code = line.split(';')
        assert int(i) not in rows; rows[int(i)] = (steps, qp, qb, qs, v, code)
assert sorted(rows) == list(range(len(nodes))), 'verdict lines do not cover the selection'
NF = {'n1': 'numerical record or constant of zeta\'s own data; no hypothesis on a class of functions',
      'n2': 'finite-N particle system, random-matrix or model function outside the gamma class of zeta',
      'n3': 'proof tool or bookkeeping (alias, seam, pencil, elasticities, display chart) with no condition on F',
      'n4': 'statement about a control or about another object (function field, other L-function, Catalan)',
      'n5': 'open direction or need statement with no displayed condition',
      'n6': 'conjectural operator or model with no object attached to zeta'}
NEED = {'t': 'X3: the displayed condition is the target, an all-order criterion or a zero-location input. To become a device it needs a proof step of type X1 or X2 at every prime inside the same inequality as s <-> 1-s.',
        'c': 'X3: finite certificate (verified height, a box, a zero table). No arithmetic input turns it into a statement at all heights; it needs an X1 or X2 step that is uniform in height, with the functional equation.',
        'L': 'X1 present (Lambda_F, Weil or Pick form, coefficients of 1/F), but the functional equation enters only through the archimedean term, a finite support or a mean value. Needs s <-> 1-s inside the same inequality in every window.',
        'Z': 'X1 size or X2 exact local form present, used right of Re s = 1 or at single primes. Needs the functional equation in the same step (acting left of Re s = 1).',
        'K': 'X5: kernel-shape condition that backward heat or Davenport-Heilbronn also satisfy. Needs an X1 or X2 step (unimodular local parameters at every prime) coupled to it.'}
VERD = {'P': 'PASS', 'S': 'silent', 'N': 'not formulable'}
out = []
for i, n in enumerate(nodes):
    steps, qp, qb, qs, v, code = rows[i]
    star = code.endswith('*'); code = code.rstrip('*')
    decl = sorted(set(n['tags']) & G); inf = sorted((set(n['tagsInferred']) & G) - set(decl))
    r = {'idx': i, 'id': n['id'], 'type': n['type'], 'status': n['status'], 'geomTags': decl, 'geomTagsInferred': inf,
         'stepsRead': [] if steps == '-' else steps.split(','), 'QP': qp, 'QB': qb, 'QS': qs, 'verdict': VERD[v]}
    if v == 'P': r['passedBy'] = [{'p': 'T-NR (Q-P)', 'b': 'BLS (Q-B)', 's': 'symmetric multiplier (Q-S)'}[c] for c in code]
    if v == 'S': r['class'] = code; r['arithmeticInputNeeded'] = NEED[code]; r['coveredByExistingLane'] = star
    if v == 'N': r['reason'] = NF[code]
    out.append(r)
# ---- pending proposals (devices.json, 9 entries), typed by reading the entry and the lane named in it
pending = [
 ('RS-1 (functional equation with periodicity of twists)', 'S1,S3,S2a', 'Y', '-', 'Y', 'PASS', 'both lanes run (device types twist-modulus-reciprocity, regular-rep-matrix-bridge) read identities and entrywise cones; an RS-1 candidate must add an X1 or X2 step'),
 ('RS-2 (attached object with non-algebraic positivity)', '-', '-', '-', '-', 'not formulable', 'no candidate object and no hypothesis list'),
 ('RS-3 (gamma side with Euler product in one positivity step)', 'X5,X3', 'N', 'N', 'N', 'silent', 'lane run (de-branges-positivity-family): closed; the E-function quotient carries strip zeros as poles, so Q-B does not apply'),
 ('Density quadratic forms with automorphic companions', 'S2f,S2a', 'Y', '-', 'N', 'PASS', 'coefficient-level squares and mean values; log-level squares (X1) are outside and fall under MV-CAP'),
 ('Global Whittaker constants on the double cover of GL(3)', 'X2', 'N', '-', '-', 'silent', 'local data at every prime (X2); no inequality displayed; needs the functional equation of the target in the same step'),
 ('Rank >= 2 compact-at-infinity squares without a Hecke rule', 'S2a', 'Y', '-', 'N', 'PASS', 'modulus squares (cone)'),
 ('Model vertices 1 < h <= 3 in the order-2 ledger', 'S1,S2f,X1', 'N', '-', 'N', 'silent', 'every step except the size step abs(eta(p)) = 1 is S1/S2f (T-NR passes those); silent at the size step only, as for device type coherent-set-large-sieve'),
 ('Lax-Phillips Hecke norms outside the weighted-L2 family', 'S1,X2', 'N', 'Y', 'N', 'PASS', 'new against round 13: any norm condition expressed through the scattering coefficient (unitarity, inner property, truncated-norm positivity) is closed under Blaschke multiplication (Q-B), zeros of phi at (1+rho)/2 being zeros in Re s > 1/2; silent (X2) only for a norm that reads the T_p action on a component not determined by phi'),
 ('Non-locality step 4 of the Rouche lane (row P44, any-height form)', 'S1,X2', 'N', '-', 'N', 'silent', 'functional equation with the exact stage at every prime: already of the required input type; no displayed inequality on file'),
]
pend = [dict(zip(('name', 'steps', 'QP', 'QB', 'QS', 'verdict', 'note'), p)) for p in pending]
# ---- control check: device types with a T-NR record. Step groups: (label, types, QB, QS, record, byName)
S_OK = re.compile(r'^S[123][a-f]?$')
ctl = [
 (1, 'mean-value-convexity', [('plain mean values, convexity', 'S2f,S1', '-', 'N', None, True), ('mollified density estimate', 'X1', '-', 'N', 'fail', True), ('log F positive definite', 'X1', '-', 'N', 'fail', True)]),
 (2, 'exact-uniqueness', [('Theorem R, zero tolerance per prime weight', 'X4,X1', '-', 'N', 'fail', True)]),
 (3, 'residue-explicit-formula', [('identities', 'S1', '-', 'Y', 'pass', True)]),
 (4, 'positive-kernel-transport', [('finite Pick orders', 'X1,X3', 'N', 'N', 'fail', True), ('seam invariants', 'S1', '-', 'N', None, True)]),
 (13, 'section-extraction', [('no-go Lemma R from gamma growth', 'S1', '-', 'N', 'pass', True)]),
 (14, 'test-restriction-commutator', [('orthogonalisation', 'S1', '-', 'N', 'pass', True), ('sign of the Weil form', 'X3', '-', 'N', 'fail', True)]),
 (15, 'finite-support-positivity', [('prime-side positivity, zero tolerance', 'X1', '-', 'N', 'fail', True)]),
 (20, 'frequency-only', [('coefficient-blind', 'S1', '-', 'Y', 'pass', False)]),
 (22, 'tensor-squeeze', [('size of local parameters', 'X1', '-', 'N', 'fail', True)]),
 (23, 'strip-dtn-identity', [('identity', 'S1', '-', 'N', 'pass', True)]),
 (26, 'coherent-set-large-sieve', [('reflection, Cauchy-Schwarz, large sieves', 'S1,S2f', '-', 'N', 'pass', True), ('abs(eta(p)) = 1', 'X1', '-', 'N', 'fail', True)]),
 (35, 'twist-modulus-reciprocity', [('reciprocity identity at twists prime to p0', 'S1,S3', '-', 'Y', 'pass', True)]),
 (36, 'regular-rep-matrix-bridge', [('entrywise cone, FE, periodicity', 'S2a,S1', '-', 'N', 'pass', True)]),
 (37, 'de-branges-positivity-family', [('shift positivity of Hermite-Biehler type', 'X5,X3', 'N', 'N', 'fail', True)]),
 (38, 'bost-connes-crossed-product-positivity', [('state positivity, D >= 1 in the centraliser (c > 2)', 'S2a', '-', 'N', 'pass', True)]),
 (40, 'x04-oval-hecke-fricke-loading', [('linear forms in Hecke images of theta; device twin has c < 0', 'outside-P', '-', 'Y', 'pass', True)]),
 (41, 'kacmoody-eisenstein (row D9; not in devices.json)', [('cocycle, holomorphy in the chamber', 'S1', 'Y', 'N', 'pass', True), ('Maass-Selberg positivity (Nevanlinna in the coefficient)', 'X5', 'Y', 'N', 'pass', True)]),
 (42, 'fourier-interpolation-zero-nodes (row G34; not in devices.json)', [('kernel F*(s)/F*(w) x A_k, edge of absolute convergence of 1/F', 'X1', '-', 'Y', 'pass', True)]),
]
cc = []; dis = 0; unresolved_P = 0; unresolved_3 = 0
for num, name, groups in ctl:
    for label, types, qb, qs, rec, byname in groups:
        qp = all(S_OK.match(t) for t in types.split(','))
        pred_P = 'PASS' if qp else 'silent'
        pred_3 = 'PASS' if (qp or qb == 'Y' or qs == 'Y') else 'silent'
        st = 'no record'
        if rec == 'fail': st = 'DISAGREE' if pred_3 == 'PASS' else 'agree'
        if rec == 'pass': st = 'agree' if pred_3 == 'PASS' else 'unresolved (filter silent, record passes)'
        if st == 'DISAGREE': dis += 1
        if rec == 'pass' and pred_P != 'PASS': unresolved_P += 1
        if rec == 'pass' and pred_3 != 'PASS': unresolved_3 += 1
        cc.append({'device': num, 'name': name, 'stepGroup': label, 'types': types, 'QP': 'Y' if qp else 'N', 'QB': qb, 'QS': qs,
                   'predictedLemmaPOnly': pred_P, 'predictedThreeQuestions': pred_3, 'recordTNR': rec, 'recordByName': byname, 'compare': st})
r13 = [c for c in cc if c['device'] <= 37 and c['recordTNR']]
summary_ctl = {'deviceTypesRound13WithRecord': len({c['device'] for c in r13}), 'ofWhichByName': len({c['device'] for c in r13 if c['recordByName']}),
               'recordedCells': len([c for c in cc if c['recordTNR']]), 'disagreements': dis,
               'recordedPassesSilentUnderLemmaPOnly': unresolved_P, 'recordedPassesSilentUnderThreeQuestions': unresolved_3,
               'devicesAddedSinceRound13': [38, 40, 41, 42]}
# ---- keyword cross-check of the node verdicts (second pass by rule; flags only)
flags = []
for r, n in zip(out, nodes):
    s = n['statement']
    eq = bool(re.search(r'\bRH iff\b|iff RH|RH-equivalent|[Ee]quivalent to RH|is RH\b|reformulation of RH', s))
    if eq and r['verdict'] == 'not formulable': flags.append((r['idx'], r['id'], 'RH-equivalence in the text but typed not formulable'))
    if n['type'] in ('open-lemma', 'conjecture') and eq and r['verdict'] == 'PASS': flags.append((r['idx'], r['id'], 'open RH-equivalent condition typed PASS'))
    if n['type'] == 'measured-phenomenon' and r['verdict'] == 'PASS' and r['stepsRead'] == ['S1']: flags.append((r['idx'], r['id'], 'measured record typed as an identity'))
    if r['verdict'] == 'PASS' and re.search(r'Lambda\(n\)|Pick|Weil', s) and 'X1' not in r['stepsRead']: flags.append((r['idx'], r['id'], 'log-level object named, no X1 step typed'))
    if r['QB'] == 'Y' and not re.search(r'phi|inner|scattering|B\(w\)', s): flags.append((r['idx'], r['id'], 'Q-B yes without a scattering coefficient in the text'))
cnt = collections.Counter(r['verdict'] for r in out)
cls = collections.Counter(r.get('class') for r in out if r['verdict'] == 'silent')
nfr = collections.Counter(r['reason'][:40] for r in out if r['verdict'] == 'not formulable')
bytag = {t: dict(collections.Counter(r['verdict'] for r in out if t in r['geomTags'] + r['geomTagsInferred'])) for t in sorted(G)}
pb = collections.Counter(p for r in out if r['verdict'] == 'PASS' for p in r['passedBy'])
qcount = {q: dict(collections.Counter(r[q] for r in out)) for q in ('QP', 'QB', 'QS')}
sil_disp = [r for r in out if r['verdict'] == 'silent']
proposals = [
 {'idx': 142, 'id': nodes[142]['id'], 'why': 'displayed inequality W_h(t)/h >= positive core - negative tail under a window hypothesis 0 < mu <= theta_a\' <= M; no map row by name. Stage A question: does a step of type X1 or X2 supply the phase-derivative hypothesis in every window, and does the hypothesis hold for backward heat (rows G5, G8 suggest yes).'},
 {'idx': 157, 'id': nodes[157]['id'], 'why': 'displayed inequality sum_{0<gamma<=T} T^(2A abs(beta-1/2)) <= C T log T with A > 1 (zero density with slope 2A > 2); not RH-equivalent; T-NR, DH, E_a and backward heat fail the inequality itself, so it is a target, and the step that would prove it is a mollified mean value (X1). Stage A question: which mean value reads s <-> 1-s and the coefficients of 1/F together with slope above 2.'},
]
sweep = {'lane': 'c14-prefilter-sweep-geometric-nodes', 'date': '2026-11-19', 'selection': {'rule': "live = no role 'wall' and origin in (corpus, map); tag in the geometric set, declared or inferred", 'tags': sorted(G), 'declared': sum(1 for r in out if r['geomTags']), 'inferredOnly': sum(1 for r in out if not r['geomTags']), 'total': len(out)},
         'counts': dict(cnt), 'silentByClass': dict(cls), 'notFormulableByReason': dict(nfr), 'passedBy': dict(pb), 'answers': qcount, 'byTag': bytag,
         'legendNeed': NEED, 'legendNotFormulable': NF, 'nodes': out, 'pending': pend, 'controlCheck': {'summary': summary_ctl, 'cells': cc},
         'crossCheckFlags': [{'idx': a, 'id': b, 'flag': c} for a, b, c in flags], 'round15Proposals': proposals}
json.dump(sweep, open(D + 'sweep.json', 'w'), indent=1)
with open(D + 'SWEEP_TABLE.md', 'w') as f:
    f.write('# Sweep table: 443 live nodes of the user geometric program against the three-question pre-filter\n\n')
    f.write('Columns: index, node id, type/status, geometric tags (i: = inferred only), steps read, Q-P, Q-B, Q-S, verdict, note. Y = the question answers yes (the control passes); N = asked, answer no (an excluded step, a pole-type coefficient, or a non-covariant entry); - = the question cannot be posed. Legends in RESULT.md section 3.2.\n\n')
    f.write('| # | node id | type / status | tags | steps | Q-P | Q-B | Q-S | verdict | note |\n|---|---|---|---|---|---|---|---|---|---|\n')
    for r in out:
        note = ', '.join(r['passedBy']) if r['verdict'] == 'PASS' else (('class ' + r['class'] + (' (lane already run)' if r['coveredByExistingLane'] else '')) if r['verdict'] == 'silent' else r['reason'].split(';')[0][:60])
        tags = ','.join(r['geomTags']) + ((' i:' + ','.join(r['geomTagsInferred'])) if r['geomTagsInferred'] else '')
        f.write(f"| {r['idx']} | {r['id']} | {r['type']} / {r['status']} | {tags} | {','.join(r['stepsRead']) or '-'} | {r['QP']} | {r['QB']} | {r['QS']} | {r['verdict']} | {note} |\n")
print(json.dumps({'counts': cnt, 'silentByClass': cls, 'passedBy': pb, 'answers': qcount, 'ctl': summary_ctl, 'nflags': len(flags)}, indent=1, default=dict))
print(json.dumps(bytag))
for a in flags: print(a)
print([ (c['device'], c['stepGroup'][:30], c['compare']) for c in cc if c['compare'] not in ('agree','no record')])
print('NF reasons', collections.Counter(rows[i][5] for i in rows if rows[i][4]=='N'))
