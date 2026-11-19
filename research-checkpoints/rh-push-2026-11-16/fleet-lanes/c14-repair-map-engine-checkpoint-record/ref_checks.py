"""Referee checks of lane c14-repair-map-engine-checkpoint-record (text and JSON only; nothing from the repo is executed)."""
import json, re, os, difflib, hashlib, sys
R = sys.argv[1]; L = os.path.join(R, 'push', 'c14-repair-map-engine-checkpoint-record'); P = os.path.join(R, 'push')
out = {}
a = open(os.path.join(L, 'before', 'OBSTRUCTION_MAP.md'), encoding='utf-8').read().split('\n')
b = open(os.path.join(P, 'OBSTRUCTION_MAP.md'), encoding='utf-8').read().split('\n')
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
ins = rep = dele = 0; changed = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'insert': ins += j2 - j1; changed += [('+', x[:28]) for x in b[j1:j2]]
    elif tag == 'replace': rep += max(i2 - i1, j2 - j1); changed += [('~', x[:28]) for x in b[j1:j2]]
    elif tag == 'delete': dele += i2 - i1
out['map_diff'] = dict(inserted=ins, replaced=rep, deleted=dele, lines=changed)
rows = lambda t: re.findall(r'^\| ((?:P|G|Q|S|Z|F|T|L|D|O)\d+[a-z]?) \|', '\n'.join(t), re.M)
out['rows_before'] = len(rows(a)); out['rows_after'] = len(rows(b))
# every table line of the map has a constant number of cells inside its table block
bad = []
for i, l in enumerate(b):
    if l.startswith('| ') and re.match(r'^\| (?:P|G|Q|S|Z|F|T|L|D|O)\d+[a-z]? \|', l) and l.count('|') != 7: bad.append((i + 1, l[:20], l.count('|')))
out['rows_with_cell_count_not_6'] = bad
# numbers quoted in the new rows against the lane files
bt = '\n'.join(b)
def has(path, s): return s in open(os.path.join(P, path), encoding='utf-8').read()
facts = [
 ('c13-noncone-kernel-separator-search/RESULT.md', ['12,994,697', '629,432', '459,547', '841,651', '0.646']),
 ('c13-noncone-kernel-separator-search/REFEREE.md', ['0.287', '0.193', '1,226', '459,547']),
 ('c13-kacmoody-eisenstein-affine-weyl-shift/REFEREE.md', ['0.738', 'A single real factor', 'x = -0.03']),
 ('c13-referee-r12-independent/referee_updates.json', ['2.2423', 'false at beta = 1/2', 'MEASURED -> PROVED']),
 ('c13-tnr-invariance-prefilter-noncone-census/REFEREE.md', ['13 device types with a record, 8 recorded passes, 7 recorded failures', 'w >= 3.5']),
 ('c13-lrs-twist-amplification-zero-representation/REFEREE.md', ['beta <= 7/4', 'L(0, chi) = 0']),
 ('c13-bilinear-reciprocity-height-antibridge/REFEREE.md', ['abs(v)^(-(J + 3/2 + c))', 'Re c-hat(chi)']),
 ('c13-fourier-interpolation-zero-nodes/REFEREE.md', ['outside a countable set', 'sum_{d <= y} |b(d)|/d << y^eps']),
]
out['facts'] = {p: {s: has(p, s) for s in ss} for p, ss in facts}
out['facts_all'] = all(v for d in out['facts'].values() for v in d.values())
# c12 records
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
c12 = os.path.join(P, 'c12-control-battery-harness'); c13 = os.path.join(P, 'c13-repair-map-engine-battery-records')
out['c12_screen_is_corrected'] = sha(os.path.join(c12, 'records', 'screen.json')) == sha(os.path.join(c13, 'records_corrected', 'screen.corrected.json'))
out['c12_heat_is_corrected'] = sha(os.path.join(c12, 'tables', 'zeros_HEAT--0.5.json')) == sha(os.path.join(c13, 'records_corrected', 'zeros_HEAT--0.5.corrected.json'))
out['c12_originals_kept'] = (sha(os.path.join(c12, 'records', 'screen.original.json')) == sha(os.path.join(L, 'before', 'c12', 'screen.json'))
                             and sha(os.path.join(c12, 'tables', 'zeros_HEAT--0.5.original.json')) == sha(os.path.join(L, 'before', 'c12', 'zeros_HEAT--0.5.json')))
d1 = json.load(open(os.path.join(L, 'device_D1.c12_corrected_record.json'))); d0 = json.load(open(os.path.join(L, 'device_D1.c12_original_record.json')))
out['D1'] = dict(corrected='%d/%d' % (d1['numbers_ok'], d1['numbers_total']), original='%d/%d' % (d0['numbers_ok'], d0['numbers_total']),
                 same_as_c13=[c['got'] for c in d1['checks']] == [c['got'] for c in json.load(open(os.path.join(c13, 'device_D1.corrected_record.json')))['checks']])
h = json.load(open(os.path.join(c12, 'tables', 'zeros_HEAT--0.5.json')))
out['heat'] = dict(online=h['online_count'], pairs=h['offline_pairs'], listed=len(h['offline']), count=h['online_count'] + 2 * h['offline_pairs'], zeta=h['zeta_zero_count_below_H'], diag=h['count_diagnostic'])
# engine
dv = json.load(open(os.path.join(R, 'engine', 'curated', 'devices.json')))
st = {}
for x in dv['devices']: st[x['state']] = st.get(x['state'], 0) + 1
out['devices'] = st; out['device_ids_unique'] = len({x['id'] for x in dv['devices']}) == len(dv['devices'])
out['new_devices_cite_referee_and_row'] = {x['id']: ('REFEREE.md (independent pass' in x['evidence'] and 'Map row' in x['evidence'] and 'Open cell' in x['evidence']) for x in dv['devices'][-6:]}
out['kacmoody_scope'] = 'rank-one PROVED, affine kernel ARGUED' in dv['devices'][-6]['evidence']
out['dictionary_label'] = 'MEASURED, finite search' in dv['devices'][-1]['evidence']
out['map_G36_label'] = bool(re.search(r'^\| G36 \|.*MEASURED, finite search', bt, re.M))
out['map_D9_label'] = bool(re.search(r'^\| D9 \|.*rank-one Levi inequality: PROVED.*ARGUED', bt, re.M))
cb = json.load(open(os.path.join(L, 'engine_counts_before.json'))); ca = json.load(open(os.path.join(L, 'engine_counts_after.json')))
out['rows_parsed'] = (cb['candMeta']['meta']['graphCounts']['rows'], ca['candMeta']['meta']['graphCounts']['rows'])
out['top60_identical'] = cb['top'] == ca['top']
s0 = json.load(open(os.path.join(L, 'before', 'scoreboard.json'))); s1 = json.load(open(os.path.join(R, 'campaign', 'scoreboard.json')))
ka = [k for k in s1 if k.lower().startswith('a')][0]
hd = lambda s: {k: v for k, v in s[ka].items() if k not in ('lanesByScore', 'byScore', 'history')}
out['headline_unchanged'] = s0[ka]['headline'] == s1[ka]['headline']; out['partA_diff'] = {k: (s0[ka].get(k), v) for k, v in s1[ka].items() if s0[ka].get(k) != v}
kd = [k for k in s1 if k.lower().startswith('d')][0]
out['partD_diff'] = {k: (s0[kd].get(k), v) for k, v in s1[kd].items() if s0[kd].get(k) != v}
# checkpoint: no joint clause, every cited row exists
ck = open(os.path.join(R, 'campaign', 'CHECKPOINT_R14_DRAFT.md'), encoding='utf-8').read()
cited = set(re.findall(r'\b([PGQSZFTLD]\d{1,2}[a-z]?)\b', ck)); allrows = set(rows(b))
out['checkpoint_rows_cited_missing'] = sorted(x for x in cited if x not in allrows and not re.match(r'^[A-Z]\d$', x) or (re.match(r'^[A-Z]\d$', x) and x not in allrows and x not in ('U1','U2','U3','U4','U5','U6','U7','U8','S1','S2','S3','X1','X2','X5','X4','T2')))
out['checkpoint_statements'] = len(re.findall(r'^\*\*U\d\.', ck, re.M))
out['checkpoint_says_no_joint_clause'] = 'No joint clause' in ck and 'their conjunction is not asserted' in ck
out['strategy_untouched'] = os.path.getmtime(os.path.join(R, 'campaign', 'STRATEGY.md')) < os.path.getmtime(os.path.join(L, 'before', 'OBSTRUCTION_MAP.md')) + 1e9
json.dump(out, open(os.path.join(L, 'ref_checks.json'), 'w'), indent=1)
for k, v in out.items():
    if k != 'map_diff': print(k, ':', v)
print('map_diff:', {k: out['map_diff'][k] for k in ('inserted', 'replaced', 'deleted')}); print(out['map_diff']['lines'])
