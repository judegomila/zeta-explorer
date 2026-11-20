#!/usr/bin/env python3
"""recheck.py -- independent re-computation of D_zeta(q; T) = sum_{n<=N} Lambda(n)(1 - log n/log N) n^{-1/2-sqrt(q)/2-iT}
at given T with 128-bit ball arithmetic for the phase T log n (python-flint arb), compared with the stored NUFFT value.
usage: recheck.py N T [T ...]"""
import sys, os, math, json, time
import numpy as np
from flint import arb, ctx
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import desc
ctx.prec = 128
N = int(float(sys.argv[1])); Ts = sys.argv[2:]
n, p, k = desc.terms(N)
lgN = math.log(N); om = np.log(n.astype(float)); lam = np.log(p.astype(float)) * (1 - om / lgN)
twopi = 2 * arb.pi()
for Tstr in Ts:
    t0 = time.time(); T = arb(Tstr)
    fr = np.empty(len(n))
    nl = n.tolist()
    for i, v in enumerate(nl):
        u = T * arb(v).log() / twopi
        fr[i] = float(u - u.floor())
    ph = np.exp(-2j * np.pi * fr)
    out = {}
    for q, sg in zip(desc.QS, desc.SIG):
        d = np.sum(lam * np.exp(-sg * om) * ph)
        out[q] = d
    print(json.dumps(dict(T=Tstr, N=N, secs=round(time.time() - t0), D={str(q): [v.real, v.imag] for q, v in out.items()})), flush=True)
