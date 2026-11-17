#!/usr/bin/env python3
"""recert_consume: route-P consumer (tmp/r3-outer-mixed.py, unchanged, exact rationals) on certfiles built from the collect7
`fullref` margins with selected floors changed.  Certfile rule copied from tmp/routes-b1-r1-merge.py (sh, build; base = r6 admission
tmp/r6-suffix-out/final/cert_r6.json, larger shift wins).  Conditional on the route-P ledger; internal; not a theorem.
usage: recert_consume.py NAME [idx=margin ...] [drop=idx,idx,...] [scale36=f]"""
import sys, os, json, math, subprocess, hashlib
from fractions import Fraction as F
ROOT = ''; T = ROOT + 'tmp/'
HERE = os.path.dirname(os.path.abspath(__file__)); C7 = HERE + '/../b-route-p-motherbox/collect7/'
G = T + 'r2-refF-out/corrected_m0023/batch_*.json,' + T + 'r2-refF-out/corrected_m0023/adapt*/batch_P*.json'
H = json.load(open(T + 'r6-fiber-out/p47_hybrid.json')); BASE = T + 'r6-suffix-out/final/cert_r6.json'
M = {int(k): v for k, v in json.load(open(C7 + 'merge/values.json'))['fullref']['margins'].items()}
INC = [int(k) for k in json.load(open(HERE + '/floors36.json'))]
name = sys.argv[1]; chg = {}
for a in sys.argv[2:]:
    k, v = a.split('=')
    if k == 'drop':
        for i in v.split(','): chg[int(i)] = None; del M[int(i)]
    elif k == 'scale36':
        for i in INC: chg[i] = M[i] * float(v); M[i] = chg[i]
    else:
        assert float(v) >= M[int(k)], 'only weakening allowed'; chg[int(k)] = float(v); M[int(k)] = float(v)


def sh(m): return F(math.floor((0.0023 - m * (1 + 1e-12)) * 1e13) - 1, 10 ** 13)


base = json.load(open(BASE)); c = dict(base); new = rep = 0; won = {}
for i, m in M.items():
    t = H[i]['key'] + '@' + H[i]['file']; s_ = sh(m + 1e-9)
    assert s_ <= F(23, 10000) - F(m) - F(1, 10 ** 9) + F(1, 10 ** 12)
    if t not in c: c[t] = str(s_); new += 1
    elif F(c[t]) < s_: c[t] = str(s_); rep += 1
    elif i in chg: won[i] = 'r6 base shift %s kept (>= shift %s of the changed margin)' % (c[t], s_)
os.makedirs(HERE + '/consume', exist_ok=True); fn = HERE + '/consume/certfile_%s.json' % name
json.dump(c, open(fn, 'w'), sort_keys=True)
p = subprocess.run([sys.executable, T + 'r3-outer-mixed.py', G, '--cert', fn], capture_output=True, text=True, cwd=ROOT)
open(HERE + '/consume/cons_%s.txt' % name, 'w').write(p.stdout + p.stderr)
last = p.stdout.strip().split('\n')[-1].split()
U = F(last[1]); r = dict(name=name, U=last[1], dec=last[2], below_0145=bool(U < F(145, 1000)), gap_to_0145=float(F(145, 1000) - U), floors=len(M), new=new,
                         replaced=rep, changed={str(k): v for k, v in chg.items()}, base_kept=won, sha256=hashlib.sha256(open(fn, 'rb').read()).hexdigest(),
                         last_line=' '.join(last))
json.dump(r, open(HERE + '/consume/value_%s.json' % name, 'w'), indent=1); print(json.dumps(r))
