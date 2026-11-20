import json
from mpmath import mp, mpf, mpc, zeta, dirichlet, fabs, findroot, re, im
mp.dps = 30
c4 = [0, 1, 0, -1]; c5 = [0, 1, -1, -1, 1]
C = lambda s: zeta(s) + dirichlet(s, c4)*dirichlet(s, c5)
found = []
for t in range(5, 60, 2):
    for sig in (0.3, 0.6, 0.9, 1.2):
        try:
            r = findroot(C, mpc(sig, t), tol=1e-25, maxsteps=80)
        except Exception:
            continue
        if fabs(C(r)) < 1e-22 and 0 < re(r) < 2 and 0 < im(r) < 70 and all(fabs(r - q) > 1e-8 for q in found):
            found.append(r)
found.sort(key=lambda z: im(z))
out = [{"re": str(re(r))[:14], "im": str(im(r))[:14], "absC": str(fabs(C(r)))[:10]} for r in found]
json.dump(out, open("twin_rational.json", "w"), indent=1)
for o in out: print(o)
