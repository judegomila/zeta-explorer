#!/usr/bin/env python3
"""Mechanical count of referee records behind each labelled map row.
For a row: the lanes named in backticks in its last (source) cell that are directories under push/ or the research
root. Count per lane = the larger of the `referees` field of campaign/lanes.jsonl (when the lane has a line there) and the
number of REFEREE*.md files in its directory (files REFEREE_c1*.md, which a referee lane keeps about other lanes, excluded).
Second passes kept in the directory of a repair lane are counted only where the learn step raised `referees`. Row count = the largest count among its cited lanes (0 if none)."""
import re, json, os, sys, collections
ROOT = sys.argv[1]; out = sys.argv[2]
t = open(os.path.join(ROOT, 'push', 'OBSTRUCTION_MAP.md'), encoding='utf-8').read()
ref = {}
for l in open(os.path.join(ROOT, 'campaign', 'lanes.jsonl'), encoding='utf-8'):
    d = json.loads(l); ref[d['slug']] = max(ref.get(d['slug'], 0), int(d.get('referees') or 0))
def lane_count(slug):
    files = None
    for base in (os.path.join(ROOT, 'push', slug), os.path.join(ROOT, slug)):
        if os.path.isdir(base):
            files = sum(1 for f in os.listdir(base) if f.startswith('REFEREE') and f.endswith('.md') and '_c1' not in f)
            break
    if slug in ref: return max(ref[slug], files or 0), 'max(lanes.jsonl, files)'
    if files is not None: return files, 'files'
    return None, None
rows = []
for m in re.finditer(r'^\| ([PGQSZFTLDO]\d+[a-z]?) \|(.*)$', t, re.M):
    cells = [c.strip() for c in m.group(2).rstrip('|').split(' | ')]
    src = cells[-1]
    slugs = re.findall(r'`([a-z0-9][a-z0-9\-]+)(?:/[^`]*)?`', src)
    per = []
    for s in dict.fromkeys(slugs):
        c, how = lane_count(s)
        if c is not None: per.append((s, c, how))
    rows.append(dict(row=m.group(1), lanes=per, count=max([c for _, c, _ in per], default=0), cited=len(per)))
dist = collections.Counter(min(r['count'], 3) for r in rows)
bysec = collections.defaultdict(collections.Counter)
for r in rows: bysec[r['row'][0]][min(r['count'], 3)] += 1
json.dump(dict(rows=rows, distribution={str(k): v for k, v in sorted(dist.items())},
               bySection={k: {str(a): b for a, b in sorted(v.items())} for k, v in bysec.items()}),
          open(out, 'w'), indent=1)
print(len(rows), dict(sorted(dist.items())))
for k in 'PGQSZFTLDO': print(k, sum(bysec[k].values()), dict(sorted(bysec[k].items())))
print('no lane resolved:', [r['row'] for r in rows if r['cited'] == 0])
print('three or more:', [(r['row'], r['count']) for r in rows if r['count'] >= 3])
