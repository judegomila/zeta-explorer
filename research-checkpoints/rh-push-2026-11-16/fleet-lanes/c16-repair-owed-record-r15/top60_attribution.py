#!/usr/bin/env python3
"""Attribution of the top-60 change to the silent-cell nodes. Reads after/all_scored.json (generate.py --dump-all,
deleted after the run: 88 MB), baseline/CANDIDATES.json, after/CANDIDATES.json; writes after/top60_attribution.json."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ids = lambda c: tuple(sorted(n['id'] if isinstance(n, dict) else n for n in c['nodes']))
al = json.load(open(os.path.join(HERE, 'after', 'all_scored.json')))
al = al['candidates'] if isinstance(al, dict) else al
idx = {}
for c in al: idx.setdefault(ids(c), []).append(c)
base = json.load(open(os.path.join(HERE, 'baseline', 'CANDIDATES.json')))['candidates']
top = json.load(open(os.path.join(HERE, 'after', 'CANDIDATES.json')))['candidates']
same = diff = miss = 0; rows = []
for c in base:
    m = [x for x in idx.get(ids(c), []) if x.get('move') == c.get('move')]
    if not m: miss += 1; rows.append([c['rank'], 'missing']); continue
    if abs(m[0]['score'] - c['score']) < 1e-9: same += 1
    else: diff += 1; rows.append([c['rank'], c['score'], m[0]['score'], ' x '.join(ids(c))])
sil = lambda c: any(i.startswith('silent-') for i in ids(c))
non = sorted([c for c in al if not sil(c)], key=lambda c: -c['score'])
res = dict(scoredAfter=len(al), scoredWithSilentNode=sum(1 for c in al if sil(c)), scoredWithout=sum(1 for c in al if not sil(c)),
           baselineTop60InAfterScoredSet=dict(sameScore=same, differentScore=diff, missing=miss, detail=rows),
           bestNonSilentAfter=[non[0]['score'], ' x '.join(ids(non[0]))],
           top60After=dict(minScore=top[-1]['score'], withSilentNode=sum(1 for c in top if sil(c)),
                           withoutSilentNode=[[c['rank'], c['score'], ' x '.join(ids(c))] for c in top if not sil(c)],
                           perSilentNode={k: sum(1 for c in top if k in ids(c)) for k in sorted({i for c in al for i in ids(c) if i.startswith('silent-')})}),
           baselineTop60WithScoreAtLeastAfterMin=sum(1 for c in base if c['score'] >= top[-1]['score']))
# slim index of the full scored set (kept; the 88 MB dump is deleted)
json.dump([[c.get('move'), c['score'], list(ids(c))] for c in al], open(os.path.join(HERE, 'after', 'all_scored_slim.json'), 'w'))
# why baseline candidates are missing: same node set under another move, or an edge among the members removed
rem = set()
for e in json.load(open(os.path.join(HERE, 'diff_after1_after2.json')))['edgesRemoved']:
    x, rest = e.split(' -> '); y = rest.split(' [')[0]; rem.add(frozenset((x, y)))
why = []
for c in base:
    k = ids(c)
    if [x for x in idx.get(k, []) if x.get('move') == c.get('move')]: continue
    other = [x.get('move') for x in idx.get(k, [])]
    lost = sorted(' - '.join(sorted(p)) for p in rem if p <= set(k))
    why.append(dict(rank=c['rank'], score=c['score'], move=c.get('move'), key=' x '.join(k), sameNodesOtherMove=other, removedEdgesAmongMembers=lost))
res['baselineTop60Missing'] = why
json.dump(res, open(os.path.join(HERE, 'after', 'top60_attribution.json'), 'w'), indent=1)
print(json.dumps(res['baselineTop60Missing'], indent=1))
