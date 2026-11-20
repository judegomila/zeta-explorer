#!/usr/bin/env python3
"""cross-machine probe: recompute v4c gap/full bounds on N boxes of an existing certificate; print reprs (and the files opened).
usage: probe.py TMPROOT CERT.json N OUT.json"""
import sys, json, time, math, importlib.util as ilu
import numpy as np
opened = set()
def hook(ev, a):
    if ev == 'open' and isinstance(a[0], str): opened.add(a[0])
sys.addaudithook(hook)
T = sys.argv[1]; cert = json.load(open(sys.argv[2])); N = int(sys.argv[3])
sp = ilu.spec_from_file_location('C7', f'{T}/r7-engine-cert-v4c.py'); C7 = ilu.module_from_spec(sp); sp.loader.exec_module(C7)
L6 = C7.L6
L = json.load(open(f'{T}/r6-fiber-out/p47_hybrid.json'))
ii = cert['idx']; d = L[ii]; E = L6.entry(d['key'], d['file'])
tc = (E['tL'] + E['tR']) / 2; ac = (E['a_lo'] + E['a_hi']) / 2
DT = float(E['tR'] - E['tL']) / 2 * (1 + 1e-12); DA = float(E['a_hi'] - E['a_lo']) / 2 * (1 + 1e-12)
pc = C7.Piece(E, tc, ac, DT, DA)
B = cert['boxes']; S = cert['box_src']; nb = len(B)
pick = [int(round(j * (nb - 1) / (N - 1))) for j in range(N)]
out = []
for n in pick:
    c = np.array(B[n][0], float); dd = np.array(B[n][1], float)
    t0 = time.time(); g, _ = pc.gap_bound(c, dd); tg = time.time() - t0
    t0 = time.time(); f, info = pc.bound(c, dd, reuse5=True); tf = time.time() - t0
    ch = None
    if 'Fconst' in info:
        c2 = c.copy(); d2 = dd.copy(); d2[0] = dd[0] / 2 * (1 + 1e-12); c2[0] = c[0] + dd[0] / 2
        ch, _ = pc.bound(c2, d2, Finh=info['Fconst'])
    out.append(dict(n=n, src=S[n], rec=B[n][2], gap=g, full=f, cheap_child=ch, tg=tg, tf=tf))
    print(n, S[n], repr(B[n][2]), repr(g), repr(f), repr(ch), '%.2f %.2f' % (tg, tf), flush=True)
json.dump(dict(idx=ii, K0=E['K0star'], rows=out, opened=sorted(opened)), open(sys.argv[4], 'w'), indent=1)
