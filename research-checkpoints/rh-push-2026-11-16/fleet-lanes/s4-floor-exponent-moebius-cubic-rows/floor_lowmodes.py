# Combination 1: with n basis functions per sector fixed (n = 2, 4, 8, 16, 32), the X at which DH's form turns negative.
# Prediction if the failure is the off-line zero rho = 0.8085 + 85.70 i seen at low frequency: X^(beta-1/2)/gamma of order 1.
import sys, json, math, numpy as np
import wf, objs
NB = 32; Bs = wf.Basis(NB); XMAX = 1e7; NM = int(XMAX) + 3
s = objs.spec_periodic(objs.dh_coeffs(), 5, 1, NM, 'DH'); z = objs.spec_zeta(NM)
XS = np.exp(np.linspace(math.log(20), math.log(XMAX), 54)); out = dict(X=XS.tolist(), DH={}, zeta={})
for nm, sp in (('DH', s), ('zeta', z)):
    for X in XS:
        Qs = Bs.forms(sp, 0.5*math.log(X))
        for n in (2, 4, 8, 16, 32): out[nm].setdefault(str(n), []).append(min(float(np.linalg.eigvalsh(Q[:n, :n])[0]) for Q in Qs))
for n in (2, 4, 8, 16, 32):
    v = np.array(out['DH'][str(n)]); neg = np.flatnonzero(v < -1e-8)
    print('n = %2d per sector: DH first negative at X = %s (previous grid point %s); zeta min over grid % .2e' % (n, '%.3g' % XS[neg[0]] if len(neg) else 'none up to 1e7', '%.3g' % XS[neg[0]-1] if len(neg) and neg[0] > 0 else '-', min(out['zeta'][str(n)])), flush=True)
print('gamma^(1/(beta-1/2)) = %.3g' % (85.699**(1/0.3085)))
json.dump(out, open(sys.argv[1], 'w'))
