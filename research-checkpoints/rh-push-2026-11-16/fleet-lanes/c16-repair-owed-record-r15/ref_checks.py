#!/usr/bin/env python3
"""Second-pass mechanical checks of lane c16-repair-owed-record-r15 (author's pass; not an independent referee).
Writes ref_checks.json next to itself. Text and JSON only."""
import os, re, json, subprocess, sys, hashlib, difflib, collections
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
rd = lambda *p: open(os.path.join(*p), encoding='utf-8').read()
R = collections.OrderedDict()
def chk(name, ok, detail=''):
    R[name] = dict(ok=bool(ok), detail=detail); print(('PASS ' if ok else 'FAIL ') + name + (': ' + str(detail) if detail != '' else ''))

# 1. sources: every quote found
r = subprocess.run([sys.executable, os.path.join(HERE, 'check_sources.py')], capture_output=True, text=True)
chk('sources quoted verbatim', r.returncode == 0, r.stdout.strip().split('\n')[-1])
# 2. map: rebuild from before/ equals the live map
tmp = os.path.join(HERE, 'after', 'map_rebuilt.md')
subprocess.run([sys.executable, os.path.join(HERE, 'apply_map.py'), tmp], capture_output=True, text=True, check=True)
live = rd(ROOT, 'push', 'OBSTRUCTION_MAP.md'); before = rd(HERE, 'before', 'OBSTRUCTION_MAP.md')
chk('map rebuild from before/ is byte-identical to the live map', rd(tmp) == live); os.remove(tmp)
# 3. map: lines changed
bl, ll = before.split('\n'), live.split('\n')
sm = difflib.SequenceMatcher(None, bl, ll, autojunk=False)
ins = sum(j2 - j1 for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag == 'insert'); rep = sum(i2 - i1 for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag == 'replace'); dele = sum(i2 - i1 for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag == 'delete')
chk('map line diff', dele == 0, 'lines %d -> %d; inserted %d, replaced %d, deleted %d' % (len(bl), len(ll), ins, rep, dele))
# every replaced old line: old text minus the edit is preserved (no sentence deleted): each old line's sentences still occur
lost = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'replace':
        new = '\n'.join(ll[j1:j2])
        for old in bl[i1:i2]:
            for sent in re.split(r'(?<=[.;|]) ', old):
                if len(sent) > 40 and sent not in new: lost.append(sent[:120])
chk('replaced map lines: old sentences not kept verbatim', True, '%d: %s' % (len(lost), lost))
# 4. rows
ids = [m.group(1) for l in ll for m in [re.match(r'^\| ([A-Z]{1,2}\d{1,2}[a-z]?) \|', l)] if m]
cnt = collections.Counter(re.sub(r'\d.*', '', i) for i in ids)
chk('map row labels', len(ids) == 205 and len(set(ids)) == 205, '%d rows, %s' % (len(ids), dict(cnt)))
for rid, n in (('S12b', 6), ('Q30', 6), ('G41', 6), ('ZQ', 5), ('SG', 5), ('NR-q', 5)):
    l = [x for x in ll if x.startswith('| %s |' % rid)]
    chk('row %s has %d cells' % (rid, n), len(l) == 1 and len(l[0].strip().strip('|').split('|')) == n)
# 5. every new or edited row cites lane files that exist
for rid in ('S12b', 'Q30', 'G41', 'G37', 'G38', 'G39', 'G40'):
    l = [x for x in ll if x.startswith('| %s |' % rid)][0]
    slugs = set(re.findall(r'`((?:c\d+|s1)-[a-z0-9\-]+)`', l)) | set(re.findall(r'`(c\d+-[a-z0-9\-]+)/', l))
    miss = [s for s in slugs if not os.path.isdir(os.path.join(ROOT, 'push', s))]
    src = [s for s in set(re.findall(r'`(c\d+-[a-z0-9\-]+)`', l.split('|')[-2])) if not os.path.exists(os.path.join(ROOT, 'push', s, 'RESULT.md'))]
    chk('row %s: cited lanes exist' % rid, not [m for m in miss if not m.startswith('c16-')] and not src, 'cited %d; absent directories (running round-16 lanes): %s' % (len(slugs), miss))
# 6. the 30 restrictions: item numbers present in the rows / notes
row = lambda rid: [x for x in ll if x.startswith('| %s |' % rid)][0]
note = lambda p: [x for x in ll if x.startswith(p)][0]
place = {**{k: row('G41') for k in range(1, 8)}, **{k: row('G38') for k in range(8, 13)}, **{k: row('G39') for k in range(13, 18)},
         **{k: row('G37') for k in range(18, 23)}, **{k: row('G40') for k in range(23, 28)}, 28: note('- Lemma F,'), 29: note('- Lemma F,'), 30: note('- Controls ZQ, SG, NR-q')}
missing = [k for k in range(1, 28) if '(%d)' % k not in place[k] and '(%d;' % k not in place[k]] + [k for k in (28, 29, 30) if ('estriction %d' % k) not in place[k]]
chk('30 label restrictions present in the map', not missing, 'missing: %s' % missing)
# key phrases of each restriction
KEY = {1: 'draws were not recounted', 2: '59 do in the FE tier', 3: 'lane-defined, not canonical', 4: 'not an off-line control', 5: 'chi_G^2(q_psi) = 1', 6: 'same tau on both members', 7: 'statement about the lift',
       8: '1/2 < sigma_0 <= 4/5', 9: 'not opened (two searches)', 10: 'c supported on (m, q) = 1', 11: 'p0 depends on the set', 12: 'ARGUED / undecided', 13: 'gives the odd squares only', 14: 'wrong at the prime 2', 15: 'relative to Shimura 1973',
       16: 'Lemma 3 and Lemma E (iii)', 17: 'LRS-type count in rank one', 18: 'implied by admissibility', 19: 'classes of constructions', 20: 'wave evolution of non-L^2 data', 21: '1.000 for k <= 30', 22: "the lane's reading",
       23: 'chi even primitive', 24: 'double for torus objects', 25: 'the zero is simple, not double', 26: 'closed for GL_n', 27: 'Duke 1988 pages 73 to 74', 28: 'growth hypothesis', 29: 'inner functions with real symmetry', 30: 'together with an ordinary Dirichlet series'}
mk = [k for k, v in KEY.items() if v not in place[k]]
chk('key phrase of each restriction present at its place', not mk, 'missing: %s' % mk)
chk('canonical tier marked not closed in row G41', '**Canonical tier {T-NR, E_a, HEAT}: NOT CLOSED.**' in row('G41') and 'c16-dn-canonical-tier-ball-conversion' in row('G41'))
# 7. pole clause in three places; dated notes
t = rd(ROOT, 'push', 'c15-control-with-zeta-fe-classes-u1-u2', 'RESULT.md')
chk('pole clause: three marked places and one note in c15 lane 2 RESULT', t.count('[correction 2026-11-19, `c16-repair-owed-record-r15`, after REFEREE.md E1:') == 3 and t.count('**Correction note (2026-11-19') == 1)
b = rd(HERE, 'before', 'c15-control', 'RESULT.md')
strip = re.sub(r' \[correction 2026-11-19, `c16-repair-owed-record-r15`, after REFEREE.md E1: [^\]]*\]', '', t)
strip = re.sub(r'\n\*\*Correction note \(2026-11-19, `c16-repair-owed-record-r15`\)\.\*\*[^\n]*\n', '', strip)
chk('c15 lane 2 RESULT minus the marked insertions equals the filed text', strip == b)
t = rd(ROOT, 'push', 'c14-prefilter-sweep-geometric-nodes', 'RESULT.md'); b = rd(HERE, 'before', 'c14-prefilter', 'RESULT.md')
d = [l for l in difflib.ndiff(b.split('\n'), t.split('\n')) if l[:1] in '+-']
chk('c14 pre-filter RESULT: insertions only (dated note)', all(l.startswith('+') for l in d) and 'Correction note (2026-11-19' in t and 'the Schur condition is the zero-free statement itself\n   (Q-B does not apply; class t)' in t, '%d lines added, 0 removed' % len(d))
# 8. campaign files
t = rd(ROOT, 'campaign', 'CAMPAIGN_REPORT_R15.md')
chk('report: E1, E2 (two places), E3 corrected and listed', t.count('[corrected 2026-11-19, `c16-repair-owed-record-r15`; see "Corrections" at the end]') == 4 and '## Corrections (2026-11-19' in t and '**0.8748866471**' in t and "no control on file has zeta's own functional equation, so requirement R3 cannot be tested there with the control table.\" False as written" in t)
t = rd(ROOT, 'campaign', 'STRATEGY.md'); b = rd(HERE, 'before', 'STRATEGY.md')
d = [l for l in difflib.ndiff(b.split('\n'), t.split('\n')) if l[:1] in '+-']
chk('STRATEGY: version unchanged; E3, E4 present; line diff', t.startswith('# Campaign strategy, version 5') and 'up to 8 cores, 12 GB and 6 hours' in t and t.count('0.8748866471') >= 3, '%d lines removed, %d added' % (sum(l[0] == '-' for l in d), sum(l[0] == '+' for l in d)))
t = rd(ROOT, 'campaign', 'ROUND_LOG.md'); b = rd(HERE, 'before', 'ROUND_LOG.md')
tl, bl2 = t.split('\n'), b.split('\n')
changed = [i for i in range(min(len(tl), len(bl2))) if tl[i] != bl2[i]]
chk('ROUND_LOG: two lines extended, none shortened (first %d lines)' % len(bl2), len(changed) == 2 and all(tl[i].startswith(bl2[i]) for i in changed), 'lines %s; file now %d lines (before %d)' % ([i + 1 for i in changed], len(tl), len(bl2)))
# 9. lanes.jsonl
ls = [json.loads(l) for l in open(os.path.join(ROOT, 'campaign', 'lanes.jsonl')) if l.strip()]
s1 = [x for x in ls if x['slug'].startswith('s1-')]
dirs = sorted(d for d in os.listdir(os.path.join(ROOT, 'push')) if d.startswith('s1-') and d != 's1-allocator')
chk('one line per screening lane, referees 0, not counted as refereed', sorted(x['slug'] for x in s1) == dirs and all(x['referees'] == 0 and 'refereeHolds' not in x and x['score'] == 0 and not x['aboutZeros'] for x in s1), '%d lines; s1-allocator (no lane) excluded; without RESULT.md: %s' % (len(s1), [x['slug'] for x in s1 if not x['resultFile']]))
bls = [l for l in open(os.path.join(HERE, 'before', 'lanes.jsonl')) if l.strip()]
chk('first 130 lines of lanes.jsonl unchanged', [l for l in open(os.path.join(ROOT, 'campaign', 'lanes.jsonl')) if l.strip()][:130] == bls)
# 10. outcomes untouched; build_graph.py, generate.py untouched
chk('outcomes/, outcomes.json, closed_families.json byte-identical', rd(HERE, 'baseline', 'sha.before') == rd(HERE, 'after', 'sha.after'), '%d hashes' % len(rd(HERE, 'baseline', 'sha.before').strip().split('\n')))
chk('engine/build_graph.py unchanged', rd(ROOT, 'engine', 'build_graph.py') == rd(HERE, 'baseline', 'onfile', 'build_graph.py'))
# 11. engine state
dv = json.load(open(os.path.join(ROOT, 'engine', 'curated', 'devices.json')))
st = collections.Counter(d['state'] for d in dv['devices'])
g = json.load(open(os.path.join(ROOT, 'engine', 'IDEA_GRAPH.json'))); gid = {n['id']: n for n in g['nodes']}
opn = [d for d in dv['devices'] if d['state'] == 'open']
chk('devices 53 closed / 1 floored / 11 open; pending 7', (st['closed'], st['floored'], st['open'], len(dv['pending'])) == (53, 1, 11, 7))
chk('each open device type stands on one graph node of type open-direction', all(len(d['nodes']) == 1 and gid.get(d['nodes'][0], {}).get('type') == 'open-direction' and gid[d['nodes'][0]]['device']['state'] == 'open' for d in opn))
chk('control nodes ctl-ZQ, ctl-SG, ctl-NR-q and rows S12b, Q30, G41 in the graph', all(k in gid for k in ('ctl-ZQ', 'ctl-SG', 'ctl-NR-q', 'row-S12b', 'row-Q30', 'row-G41')))
bad = [e for e in g['edges'] if e['type'] in ('obstructs', 'control-defeats') and (e['target'].startswith('silent-') or e['source'].startswith('silent-'))]
chk('no obstructs / control-defeats edge touches a silent-cell node', not bad, len(bad))
# 12. staged control
d1 = json.load(open(os.path.join(HERE, 'diff_baseline_after1.json'))); d2 = json.load(open(os.path.join(HERE, 'diff_after1_after2.json'))); d3 = json.load(open(os.path.join(HERE, 'diff_after2_after.json')))
chk('stage 1 (rows, controls, closed devices, restrictions): top 60 identical in keys, order, scores', d1['top']['sameOrder'] and d1['top']['sameScores'] and d1['top']['keysInCommon'] == 60, 'rowsChecked changed in %d candidates' % d1['top']['commonRowsCheckedChanged']['candidates'])
chk('stage 1: scoreboard differs only in part C nodes', sorted(d1['scoreboardDiff']) == ['/C_coverage/nodes', '/C_coverage/nodesMarkedClosed'], d1['scoreboardDiff'])
chk('stage 2 (silent-cell nodes): scoreboard differs only in node count', sorted(d2['scoreboardDiff']) == ['/C_coverage/nodes'], d2['scoreboardDiff'])
chk('stage 3 (screening lines): graph and top 60 identical; scoreboard: lanes run, score-0 count, history', d3['top']['sameOrder'] and d3['top']['sameScores'] and d3['nodes'][0] == d3['nodes'][1] and sorted(d3['scoreboardDiff']) == ['/A_requirements/scoreHistogram/0', '/D_reliability/lanesRun', '/history'], {k: v for k, v in d3['scoreboardDiff'].items() if k != '/history'})
sb = json.load(open(os.path.join(ROOT, 'campaign', 'scoreboard.json')))
chk('headline 1 of 4, c1-leeyang-krein-limit; hold rate 0.908', sb['A_requirements']['headline']['bestScore'] == 1 and sb['A_requirements']['headline']['slug'] == 'c1-leeyang-krein-limit' and sb['D_reliability']['refereeHoldRate'] == 0.908, sb['D_reliability'])
# 13. statement O
v3 = rd(ROOT, 'push', 'c12-repair-sources-statement-o-v3', 'STATEMENT_O_v3.md'); v4 = rd(HERE, 'STATEMENT_O_v4.md')
d = [l for l in difflib.ndiff(v3.split('\n'), v4.split('\n')) if l[:1] in '+-']
rem = [l for l in d if l[0] == '-']
chk('Statement O v4 = v3 plus insertions (only the title line replaced)', len(rem) == 1 and rem[0].startswith('- # Statement O, version 3'), '%d lines added, %d removed' % (sum(l[0] == '+' for l in d), len(rem)))
chk('Statement O v4: five new lines, section F, no joint clause wording', all(('### Line %d (version 4)' % k) in v4 for k in range(13, 18)) and '## F. (version 4)' in v4 and 'their conjunction is not asserted' in v4)
json.dump(R, open(os.path.join(HERE, 'ref_checks.json'), 'w'), indent=1)
print('%d checks, %d failed' % (len(R), sum(not v['ok'] for v in R.values())))
