"""Check the genus-2 closed form: m1,m2 roots of m^2-(N1+1+u)m+h; I_C = {disc>=0, (sqrt u-1)^2<=m1, m2<=(sqrt u+1)^2}."""
import json, math, sys
for q in (3, 5, 7):
    recs = json.load(open(f"IC_q{q}_g2.json")); bad = 0; multi = []
    for r in recs:
        N1, h = r['N'][0], r['h']
        ud = 2*math.sqrt(h) - N1 - 1
        if 'coll' in r['lot']:
            if abs(r['ulo'] - ud) > 1e-9: bad += 1
        # scan closed form on a grid and compare with components
        for i in range(1, 4000):
            u = i*0.01; D = (N1+1+u)**2 - 4*h
            ok = False
            if D >= 0:
                m1 = (N1+1+u - math.sqrt(D))/2; m2 = (N1+1+u + math.sqrt(D))/2; s = math.sqrt(u)
                ok = (s-1)**2 <= m1 and m2 <= (s+1)**2
            inc = any(a - 1e-9 <= u <= b + 1e-9 for a, b in r['comps'])
            near = any(abs(u - e) < 2e-2 for c in r['comps'] for e in c)
            if ok != inc and not near: bad += 1
        if r['ncomp'] > 1: multi.append(r)
    print(q, "closed-form mismatches:", bad, "multi-component:", [(m['N'], m['h'], m['comps'], m['cnt']) for m in multi])
    z = [(r['N'], r['h'], r['lot'], r['hit'], round(r['ulo'], 6), round(r['uhi'], 6)) for r in recs if min(r['mlo'], r['mhi']) < 1e-9]
    print("  zero-margin:", z)
    odd = [(r['N'], r['h'], r['lot'], r['hit'], round(r['ulo'], 6), round(r['uhi'], 6)) for r in recs if r['lot'] != ['coll'] or r['hit'] != ['cen+']]
    print("  non-typical endpoints:", odd)
