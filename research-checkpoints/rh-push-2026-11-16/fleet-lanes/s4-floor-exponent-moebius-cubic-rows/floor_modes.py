# Combination 1: number of basis functions per sector needed before the control's form turns negative at a given support.
# Leading principal blocks of Q (the basis is nested): n*(a) = smallest n with lambda_min(Q[:n,:n]) < -1e-8.
import sys, json, math, numpy as np
import wf, objs
NB = 260; Bs = wf.Basis(NB); out = {}
AG = [1.9, 2.2, 2.6, 3.0, 3.5, 4.0, 4.5]
NM = int(math.exp(2*AG[-1])) + 3; TAB = wf.sieve_mangoldt(NM)
specs = {'DH': objs.spec_periodic(objs.dh_coeffs(), 5, 1, NM, 'DH'), 'EA0.125': objs.spec_Ea(0.125, NM, TAB), 'TNR3_2.2': objs.spec_tnr(3, 2.2, NM, 'own', TAB), 'SGN-LIOU': objs.spec_signtwist(lambda p: -1, NM, 'L', TAB)}
for nm, s in specs.items():
    out[nm] = []
    for a in AG:
        Qs = Bs.forms(s, a); nst = []
        for Q in Qs:
            lo, hi = 1, NB
            if np.linalg.eigvalsh(Q)[0] >= -1e-8: nst.append(None); continue
            while hi - lo > 1:
                mid = (lo + hi)//2
                if np.linalg.eigvalsh(Q[:mid, :mid])[0] < -1e-8: hi = mid
                else: lo = mid
            nst.append(hi)
        out[nm].append(dict(a=a, nstar=nst)); print(nm, 'a=%.1f' % a, 'n* (even, odd) =', nst, ' 2 a gamma/pi for gamma = 85.70: %.0f (degree = 2 n*)' % (2*a*85.699/math.pi) if nm == 'DH' else '', flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
