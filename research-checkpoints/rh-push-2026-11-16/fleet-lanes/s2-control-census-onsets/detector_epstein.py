# Finite-support Euler/integrality detector on the Epstein census (combination 1 / 2): for each form the smallest support
# log q at which the normalised series amin^s Z_Q(s)/r(amin) = 1 + sum b_q q^{-s} shows (I) a frequency q that is not an integer, or
# (E1) a non-prime-power integer q with c(q) != 0 (c = coefficients of -d/ds log). Class-number-one forms must show neither.
import json, math, numpy as np, objs, wf
from fractions import Fraction
def detector(form, D, reach=40.0):
    a = form[0]; M = int(a*reach) + 1; r = objs.rep_counts(form, M); m = np.nonzero(r)[0]; m = m[m > a]
    nonint = next((int(v) for v in m if v % a), None)
    I = math.log(nonint/a) if nonint else None
    # E1 on the integer-indexed part (exact while all frequencies below the first non-integer one are integers)
    lim = int(nonint/a) if nonint else int(reach)
    E1 = None
    if lim >= 6:
        A = np.zeros(lim + 1); A[1] = 1.0
        for v in m:
            if v % a == 0 and v//a <= lim: A[v//a] = r[v]/r[a]
        c = wf.logderiv_general(A, lim)
        npp = [q for q in range(2, lim + 1) if abs(c[q]) > 1e-9 and not objs._is_pp(q)]
        E1 = math.log(npp[0]) if npp else None
    return I, E1
if __name__ == '__main__':
    out = {}
    for D in range(-3, -2001, -1):
        if D % 4 not in (0, 1): continue
        fs = objs.reduced_forms(D)
        if not fs: continue
        h = objs.class_number(D)
        for f in fs:
            I, E1 = detector(f, D, reach=(2500.0 if h == 1 else 2.0*abs(D) + 60) if f[0] == 1 else abs(D)/float(f[0]*f[0]) + 60.0)
            out['%d,%d,%d' % f] = dict(D=D, h=h, I=I, E1=E1)
    json.dump(out, open('detector_epstein.json', 'w'))
    h1 = [v for v in out.values() if v['h'] == 1]; ne = [v for v in out.values() if v['h'] > 1]
    print('h=1 forms: %d; flagged (I or E1) below support log 2500: %d' % (len(h1), sum(1 for v in h1 if v['I'] or v['E1'])))
    on = [min(x for x in (v['I'], v['E1']) if x is not None) for v in ne if v['I'] is not None or v['E1'] is not None]
    print('h>1 forms: %d; flagged: %d; detector onset support: min %.3f median %.3f max %.3f' % (len(ne), len(on), min(on), np.median(on), max(on)))
    print('h>1 not flagged within reach:', [(k, v) for k, v in out.items() if v['h'] > 1 and v['I'] is None and v['E1'] is None][:10])
