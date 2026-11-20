#!/usr/bin/env python3
"""First check of the lane: every source file exists and contains its quote verbatim (whitespace-normalised).
Writes check_sources.json next to itself."""
import os, re, json, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
from sources import S
norm = lambda t: re.sub(r'\s+', ' ', t).strip()
cache, out, bad = {}, [], 0
for s in S:
    p = os.path.join(ROOT, s['file'])
    ex = os.path.exists(p)
    if ex and p not in cache:
        cache[p] = norm(open(p, encoding='utf-8').read())
    ok = ex and norm(s['quote']) in cache[p]
    bad += (not ok)
    out.append(dict(s, exists=ex, quoteFound=bool(ok)))
    if not ok:
        print('FAIL', s['target'], '|', s['file'], '|', s['quote'][:90])
json.dump(dict(entries=len(out), failed=bad, items=out), open(os.path.join(HERE, 'check_sources.json'), 'w'), indent=1)
print('sources: %d entries, %d files, %d failed' % (len(out), len(cache), bad))
sys.exit(1 if bad else 0)
