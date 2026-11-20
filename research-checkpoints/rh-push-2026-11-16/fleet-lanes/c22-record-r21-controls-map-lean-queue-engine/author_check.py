"""Author's check for c22-record-r21-controls-map-lean-queue-engine (not an independent referee).
1. every path cited in LEAN_QUEUE.md, CORRECTIONS.md, controls.json (new entries), MAP_PENDING Part 3 exists;
2. every 'text as it stands' of CORRECTIONS.md occurs in the file named;
3. files modified after the lane's start outside the write set (push/<other>, repo files) : listed;
4. Statement O: marks, counts; LEAN_QUEUE: entries, referee counts against campaign/lanes.jsonl."""
import json, os, re, sys, time
B = 'tmp/research-2026-11-16'
LANE = 'c22-record-r21-controls-map-lean-queue-engine'
Ld = os.path.join(B, 'push', LANE)
out = {}
def paths_in(text):
    ps = set(re.findall(r'`((?:push|campaign|engine)/[^`\s]+?)`', text))
    ps |= set(re.findall(r'(?<![`/\w])((?:push|campaign|engine)/[\w\-./]+\.(?:md|json|py))', text))
    return ps
miss = {}
for name, p in (('LEAN_QUEUE', 'campaign/LEAN_QUEUE.md'), ('CORRECTIONS', 'push/%s/CORRECTIONS.md' % LANE),
                ('MAP_PENDING_R22', 'push/%s/MAP_PENDING_R22_SECTION.md' % LANE), ('controls', 'engine/curated/controls.json')):
    t = open(os.path.join(B, p), encoding='utf-8').read()
    if name == 'controls':
        d = json.load(open(os.path.join(B, p)))
        t = ' '.join(d['controls'][k]['source'] for k in ('V6', 'THINxV6', 'CYC', 'NWM'))
    ps = paths_in(t)
    bad = [x for x in sorted(ps) if not os.path.exists(os.path.join(B, x.rstrip('.,;:)')))
           and not os.path.isdir(os.path.join(B, x.rstrip('.,;:)/')))]
    miss[name] = dict(cited=len(ps), missing=bad)
out['paths'] = miss
# 2. quoted texts
Q = [
 ('push/c4-helson-discrepancy-zerofree/RESULT.md', "A is an ordinary Dirichlet series with coefficients a_n >= 0 (supported on prime powers). This is the only place complete multiplicativity and |chi| = 1 are used, and it is essential: without an Euler product there is no A."),
 ('push/c4-helson-discrepancy-zerofree/REFEREE.md', "- R1 = true, in the restricted sense the RESULT states: step (a) needs the Euler product over all primes with unimodular local factors; without it A does not exist and the Landau step is unavailable (DH stops there). This is established for Theorem 1 as a statement about F relative to zeta. It is not an attack on zeta and uses nothing about the additive structure of the integers."),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "for a pole of the local factor with a parameter of modulus > 1 (HQ1 to HQ4, G_q, E_a), and for a local zero at a negative"),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "Eight on file fail it: HQ1, HQ2, HQ3, HQ4, G_q,"),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "eight multiplicative controls on file fail H(a)"),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "**Theorem 1' (PROVED; the proof of c4 Theorem 1 with one change).**"),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "which contains non-multiplicative members with real zeros in the strip"),
 ('push/c21-c4-r1-flag-test-lemma-e-hq-beurling/RESULT.md', "461 negative a_n, n <= 3000"),
 ('push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md', "no (sigma_rel = 1)"),
 ('push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md', "In Re s > 1 where N != 0 the product of the L_p converges to zeta/N, so G = zeta/N as meromorphic functions on Re s > 1/2."),
 ('push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin/MAP_ROW.md', "the product is 1/(1 - w) (control CYC)"),
 ('push/c21-br2-sparse-pole-lattice-natural-boundary-or-twin/MAP_ROW.md', "(Lemma P, Corollary P1, telescoping example, Theorem W; author only)"),
 ('push/c21-br0-br3-hamburger-finite-poles-regime3/MAP_ROW.md', "zero referees"),
 ('push/c21-br0-br3-hamburger-finite-poles-regime3/MAP_ROW.md', "(+ REFEREE.md, author's pass)"),
 ('push/OBSTRUCTION_MAP.md', "Zeros on Re s = 1/2 +- arccosh(abs(c)/2)/log q (MEASURED at c = 2.1: zero at 0.857311 + 3.564428i, winding 1; at c = 2.2 the zero is at Re s = 1.0033, outside the strip)"),
]
def norm(t): return re.sub(r'\s+', ' ', t)
qres = []
for p, q in Q:
    t = norm(open(os.path.join(B, p), encoding='utf-8').read())
    qres.append(dict(file=p, found=norm(q) in t, text=q[:70]))
out['quotes'] = qres
# 3. files modified since the lane's start
start = os.path.getmtime(os.path.join(Ld, 'logs', 'before.sha'))
changed = []
for root in ('push', 'campaign', 'engine'):
    for dp, dn, fn in os.walk(os.path.join(B, root)):
        if LANE in dp or '__pycache__' in dp:
            continue
        for f in fn:
            fp = os.path.join(dp, f)
            try:
                if os.path.getmtime(fp) >= start:
                    changed.append(os.path.relpath(fp, B))
            except OSError:
                pass
out['modifiedSinceStart_outside_lane_dir'] = sorted(changed)
# 4. Statement O and LEAN_QUEUE
so = open(os.path.join(B, 'campaign/STATEMENT_O.md'), encoding='utf-8').read()
out['statementO'] = dict(title=so.splitlines()[0], marks=so.count('(version 5.2'), lines=so.count('\n'),
                         line_headings=len(re.findall(r'^### Line \d+', so, flags=re.M)))
lq = open(os.path.join(B, 'campaign/LEAN_QUEUE.md'), encoding='utf-8').read()
ents = re.findall(r'^## (Q\d+)\. (.*)$', lq, flags=re.M)
refs = re.findall(r'^\*\*Referees\.\*\* (\d+)\.', lq, flags=re.M)
lanes = {}
for l in open(os.path.join(B, 'campaign/lanes.jsonl')):
    if l.strip():
        d = json.loads(l); lanes[d['slug']] = d
src = {'Q1': 'c21-br2-sparse-pole-lattice-natural-boundary-or-twin', 'Q2': 'c21-twin-screen-ts', 'Q3': 'c21-c4-r1-flag-test-lemma-e-hq-beurling',
       'Q4': 'c21-br2-relative-product-pole-lattice-census-server', 'Q5': 'c20-referee-theorem-d-headline-and-r19',
       'Q6': 'c20-euler-shape-rigidity-infinite-modified-primes', 'Q7': 'c20-euler-shape-rigidity-infinite-modified-primes',
       'Q8': 'c20-euler-shape-rigidity-infinite-modified-primes', 'Q9': 'c20-u4-second-order-archimedean-mixed-form',
       'Q10': 'c21-br0-br3-hamburger-finite-poles-regime3', 'Q11': 'c16-pos-fe-u2-positivity-rigidity'}
out['leanQueue'] = [dict(id=e[0], title=e[1][:60], refereesWritten=int(r), refereesInLanesJsonl=lanes[src[e[0]]].get('referees'),
                         holds=lanes[src[e[0]]].get('refereeHolds'), aboutZeros=lanes[src[e[0]]].get('aboutZeros'))
                    for e, r in zip(ents, refs)]
json.dump(out, open(os.path.join(Ld, 'author_check.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
