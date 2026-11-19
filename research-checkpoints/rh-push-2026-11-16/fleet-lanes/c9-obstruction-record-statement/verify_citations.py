# Checks every citation of STATEMENT_O.md against the files on disk (text only; no repo module is imported).
# 1. every map row id cited exists in push/OBSTRUCTION_MAP.md, or is a pending/proposed id with text on file;
# 2. every lane slug cited exists; its REFEREE*.md files are counted;
# 3. every "`slug` n ref" claim in section B equals the count on disk.
import os, re, json, glob
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.abspath(os.path.join(here, '..', '..'))
push = os.path.join(root, 'push'); camp = os.path.join(root, 'campaign')
st = open(os.path.join(here, 'STATEMENT_O.md')).read()
mp_ = open(os.path.join(push, 'OBSTRUCTION_MAP.md')).read()
pend = open(os.path.join(camp, 'MAP_PENDING.md')).read()
prop = open(os.path.join(here, 'MAP_ROWS_PROPOSED.md')).read()
ids = lambda t: set(re.findall(r'^>? ?\| ([A-Z]\d+[a-z]?) \|', t, re.M))
map_ids, pend_ids, prop_ids = ids(mp_), ids(pend), ids(prop)
cited = set(re.findall(r'(?<![A-Za-z0-9_\-/.(])([PGQSZFTLD]\d{1,2}[bc]?)(?![A-Za-z0-9_\-])', st))
NOT_ROWS = {'L0': 'the L-function L0 of section D', 'T4': 'theorem T4 of twist-rigidity (line 1)'}
cited -= set(NOT_ROWS)
rows = {}
for r in sorted(cited, key=lambda x: (x[0], int(re.sub(r'\D', '', x)), x)):
    rows[r] = 'map' if r in map_ids else 'pending (MAP_PENDING Part 2)' if r in pend_ids else 'proposed (MAP_ROWS_PROPOSED)' if r in prop_ids else 'MISSING'
lanes = {}
NOT_LANES = {'ctrl-rz-reciprocal-shift': 'engine node id'}
for slug in sorted(set(re.findall(r'`([a-z0-9]+(?:-[a-z0-9]+)*)`', st))):
    d = os.path.join(push, slug)
    if slug in NOT_LANES or ('-' not in slug and not os.path.isdir(d)):
        continue
    if os.path.isdir(d):
        lanes[slug] = {'refereeFiles': sorted(os.path.basename(f) for f in glob.glob(os.path.join(d, 'REFEREE*.md'))),
                       'result': os.path.exists(os.path.join(d, 'RESULT.md'))}
    else:
        lanes[slug] = None
outside = {k: sorted(os.path.basename(f) for f in glob.glob(os.path.join(root, k, 'REFEREE*.md'))) for k in ('eq48', 'pick')}
claims = []
secB = st.split('## B. Lines 1 to 12')[1].split('## C. The clause')[0]
for slug, n in re.findall(r'`([a-z0-9\-]+)`(?: \([^)]*\))? (\d) ref', secB):
    have = len(lanes[slug]['refereeFiles']) if lanes.get(slug) else None
    claims.append({'slug': slug, 'claimed': int(n), 'onDisk': have, 'ok': have == int(n)})
labels = re.findall(r'^### Line (\d+)\..*?^- \*\*Label\.\*\* (\w+)', secB, re.M | re.S)
out = {'excludedTokens': {**NOT_ROWS, **NOT_LANES}, 'rows': rows, 'rowsMissing': [r for r, v in rows.items() if v == 'MISSING'],
       'lanes': lanes, 'lanesMissing': [k for k, v in lanes.items() if v is None],
       'outsidePush': outside, 'refClaims': claims, 'refClaimsWrong': [c for c in claims if not c['ok']],
       'lineLabels': dict(labels), 'labelCounts': {l: sum(1 for _, x in labels if x == l) for l in ('PROVED', 'ARGUED', 'MEASURED')}}
json.dump(out, open(os.path.join(here, 'verify_citations.json'), 'w'), indent=1)
print('rows cited', len(rows), 'missing', out['rowsMissing'])
print('pending/proposed', {r: v for r, v in rows.items() if v != 'map'})
print('lanes cited', len(lanes), 'missing', out['lanesMissing'])
print('ref claims', len(claims), 'wrong', out['refClaimsWrong'])
print('labels', out['lineLabels'], out['labelCounts'])
