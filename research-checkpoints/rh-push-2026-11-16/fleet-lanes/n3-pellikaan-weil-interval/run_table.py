import sys, json, math, statistics as st
import numpy as np
from pell import *
rows = []
for fn in sys.argv[1:]:
    d = json.load(open(fn)); q, g = d['q'], d['g']
    recs = []
    items = sorted(d['tuples'].items())
    import os, random
    if os.environ.get('SAMPLE') and len(items) > int(os.environ['SAMPLE']):
        random.seed(7); items = random.sample(items, int(os.environ['SAMPLE'])); print('SAMPLED', len(items), 'of', len(d['tuples']))
    for key, cnt in items:
        N = [int(x) for x in key.split(',')]
        P, h, b, L = pellikaan_P(q, g, N)
        comps, Gy, crit = I_C(P, g)
        s0 = math.sqrt(q)
        iso = list(I_C.iso); undet = I_C.undet
        hit = [c for c in comps if c[0][0] <= s0 <= c[1][0]]
        if not hit:
            assert any(abs(u0 - q) < 1e-12 for u0, _ in iso), (q, g, N, comps, iso)
            nm = [nm for u0, nm in iso if abs(u0 - q) < 1e-12][0]
            hit = [((s0, nm), (s0, nm))]
        assert len(hit) == 1, (q, g, N, comps)
        (lo, lot), (hi, hit_t) = hit[0]
        # Frobenius angles at u=q
        al = np.roots(L[::-1]); ang = np.sort(np.abs(np.angle(1/al)))[::2] if g > 0 else []
        ang = sorted(set(round(float(a), 12) for a in np.abs(np.angle(al))))
        gaps = [b_ - a_ for a_, b_ in zip([0.0]+ang, ang+[math.pi])]
        recs.append(dict(N=N, h=h, cnt=cnt, ncomp=len(comps)+len(iso), iso=[i[0] for i in iso], undet=undet, comps=[[c[0][0]**2, c[1][0]**2] for c in comps],
                         ulo=lo**2, uhi=hi**2, lot=sorted(lot), hit=sorted(hit_t),
                         mlo=math.log(q) - (2*math.log(lo) if lo > 0 else -math.inf), mhi=2*math.log(hi) - math.log(q),
                         mingap=min(b_ - a_ for a_, b_ in zip(ang, ang[1:])) if len(ang) > 1 else None,
                         edge=min(ang[0], math.pi-ang[-1]), ndist=len(ang)))
    json.dump(recs, open(f"IC_q{q}_g{g}.json", "w"))
    nint = sum(r['ncomp'] == 1 for r in recs)
    from collections import Counter
    lot = Counter('/'.join(r['lot']) for r in recs); hit = Counter('/'.join(r['hit']) for r in recs)
    fin = [r for r in recs if r['mlo'] < math.inf]
    ln = [r['mlo'] + r['mhi'] for r in fin]; mn = [min(r['mlo'], r['mhi']) for r in recs]
    print(f"\n== g={g} q={q}: tuples={len(recs)} single-interval={nint} max#components={max(r['ncomp'] for r in recs)}")
    print("  tuples with isolated points:", sum(bool(r['iso']) for r in recs), " I_C={q}:", sum(r['ulo']==r['uhi'] for r in recs), " undetermined isolated candidates:", sum(r['undet'] for r in recs))
    print("  lower endpoint types:", dict(lot)); print("  upper endpoint types:", dict(hit))
    f = lambda v: f"min {min(v):.4g} med {st.median(v):.4g} max {max(v):.4g}"
    print("  log-length of component containing q (finite ones, n=%d): %s" % (len(ln), f(ln)))
    print("  margin min(log q/u-, log u+/q):", f(mn), " #zero-margin:", sum(m < 1e-9 for m in mn))
    print("  lower margin log(q/u-):", f([r['mlo'] for r in fin]), "| upper margin log(u+/q):", f([r['mhi'] for r in recs]))
    print("  sqrt(q)*median length: %.4g ; q*median lower margin: %.4g" % (math.sqrt(q)*st.median(ln), q*st.median([r['mlo'] for r in fin])))
