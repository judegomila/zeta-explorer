# consts_fix.py: two corrections to consts.json for the T-NR family (found by the quadrature cross-check and by d_N^2 < floor):
#  (1) kappa_d for d>0 lacked the factor 1/q^d:  int_0^1 A(lambda q^d) d lambda = q^-d int_0^inf {t} Phi(q^d t) t^-3 dt
#  (2) F has a pole at 1, so the vectors lie in (s/(s-1)) H^2 and the floor is 1 - |B(1)|^2 - |B'(1)|^2  (entire F: 1 - |B(1)|^2)
import json, mpmath as mp
mp.mp.dps = 30
C = json.load(open('consts.json'))
for t in ['tnr2', 'tnr3', 'tnr101']:
    q = C[t]['q']; c = mp.mpf(str(C[t]['c'])); w = {-2: 1, -1: 2*c, 0: c*c+2, 1: 2*c, 2: 1}
    kd = {int(k): mp.mpf(v) for k, v in C[t]['kappa_d'].items()}
    if 'kappa_d_uncorrected' not in C[t]:
        C[t]['kappa_d_uncorrected'] = dict(C[t]['kappa_d'])
        for dd in (1, 2): kd[dd] = kd[dd]/mp.mpf(q)**dd
        C[t]['kappa_d'] = {str(k): mp.nstr(v, 18) for k, v in kd.items()}
    kap = sum(w[dd]*mp.mpf(q)**(-mp.mpf(dd)/2)*kd[dd] for dd in kd)
    L = mp.log(q); de = mp.acosh(c/2)/L; a = (mp.mpf(1)/2-de); b = (mp.mpf(1)/2+de)
    B2 = (mp.cosh(a*L/2)/mp.cosh(b*L/2))**2
    dlog = (L/2)*(mp.tanh(a*L/2)-mp.tanh(b*L/2))      # B'(1)/B(1)
    C[t].update({'kappa': mp.nstr(kap, 18), 'B1_sq': mp.nstr(B2, 15), 'Bprime_over_B_at_1': mp.nstr(dlog, 15),
                 'floor_entire_formula': mp.nstr(1-B2, 12), 'floor': mp.nstr(1-B2*(1+dlog**2), 12)})
    print(t, 'kappa', C[t]['kappa'], 'quad', C[t]['kappa_quad_T150'], 'floor', C[t]['floor'])
json.dump(C, open('consts.json', 'w'), indent=1)
