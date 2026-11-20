#!/usr/bin/env python3
"""independent re-check of a collect dir: for every assembled certificate recompute m = max box bound - K0* (K0* from the r2 batch record),
and verify the admission shift in merge/certfile_fullref.json is <= 23/10000 - m - 1e-9 in exact rationals (float m converted exactly).
usage: check_certfile.py COLLECTDIR"""
import sys, json, glob, os, re
from fractions import Fraction as F
T = 'tmp/'; O = sys.argv[1]
H = json.load(open(T + 'r6-fiber-out/p47_hybrid.json')); cf = json.load(open(O + '/merge/certfile_fullref.json')); base = json.load(open(T + 'r6-suffix-out/final/cert_r6.json'))
rec = {}; bad = []; n = inc = 0; worst = None; nonbase = 0
for fn in sorted(glob.glob(O + '/assembled/cert_*.json')):
    i = int(re.search(r'cert_(\d+)\.json', fn).group(1)); c = json.load(open(fn)); d = H[i]
    f = T + d['file']
    if f not in rec: rec[f] = json.load(open(f))
    K0 = rec[f][d['key']]['K0star']; assert c['K0star'] == K0 == d['K0star']
    ub = max(b[2] for b in c['boxes']); assert ub == ub and ub < 1e9
    m = F(ub) - F(K0); tag = d['key'] + '@' + d['file']; s = F(cf[tag]); lim = F(23, 10000) - m - F(1, 10 ** 9)
    n += 1; inc += (not c['stats'].get('complete', True))
    if tag in base and F(base[tag]) == s and s > lim: continue_ok = True     # r6 base shift kept (larger shift from the r6 admission): licensed by r6, not by this cert
    else: continue_ok = False
    if s > lim and not continue_ok: bad.append((i, float(s), float(lim)))
    if s > lim: nonbase += 1
    sl = lim - s
    if not continue_ok and (worst is None or sl < worst[0]): worst = (sl, i)
print(dict(certs=n, incomplete=inc, bad=bad, kept_r6_base_shift=nonbase, min_slack=float(worst[0]), min_slack_idx=worst[1], entries=len(cf), base_entries=len(base)))
