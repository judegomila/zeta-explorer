# Re-check of selected onsets with a different basis size (N = 110 per sector instead of 170) and the direct cosine path
# (no non-uniform FFT). Local, single process.
import json, math, numpy as np, wf, objs
wf.USE_NUFFT = 0
B = wf.Basis(110); tab = wf.sieve_mangoldt(1200); out = []
S = [('DH', objs.spec_periodic(objs.dh_coeffs(), 5, 1, 1200, 'DH'), 3.0), ('E_a(0.25)', objs.spec_Ea(0.25, 1200, tab), 3.0),
     ('TNR(q=3,c=2.2,own)', objs.spec_tnr(3, 2.2, 1200, 'own', tab), 3.0), ('TNR(q=97,c=2.2,zeta)', objs.spec_tnr(97, 2.2, 1200, 'zeta', tab), 3.0),
     ('SGN-single(13)', objs.spec_signtwist(lambda p: -1 if p == 13 else 1, 1200, 'S', tab), 3.0), ('WT(1.23932)', objs.spec_unimod(1.2393168126993495, 1200, tab), 3.0),
     ('zeta', objs.spec_zeta(1200, tab), 3.4), ('TNR(q=3,c=1,own)', objs.spec_tnr(3, 1.0, 1200, 'own', tab), 3.4)]
for f, am in (((2, 2, 3), 1.3), ((1, 1, 6), 2.3), ((1, 1, 99), 3.5), ((3, 1, 5), 1.3), ((7, 6, 9), 1.3), ((1, 0, 1), 5.0)):
    S.append(('Q%s' % (f,), objs.spec_epstein(f, am, 2e-5), am))
for nm, s, am in S:
    r = B.onset(s, hi=am, tol=0.005); out.append(dict(name=nm, a_pos=r[0], a_neg=r[1], sector=r[2], lam=r[3]))
    print('%-22s N=110: a* in (%s, %s) sector %s' % (nm, r[0], r[1], r[2]), flush=True)
json.dump(out, open('recheck_basis.json', 'w'), indent=1)
