import numpy as np, wf, objs, time
B = wf.Basis(170, cache='.')
for form, amax in [((16, 15, 20), 1.3), ((3, 2, 46), 3.5), ((7, 6, 9), 1.3)]:
    s = objs.spec_epstein(form, amax, 2e-5)
    for a in (0.6*amax, amax):
        wf.USE_NUFFT = 0; t0 = time.time(); M0 = B.atom_moments(s['x'], s['w'], a); l0 = B.lam(s, a); t1 = time.time()
        wf.USE_NUFFT = 1; M1 = B.atom_moments(s['x'], s['w'], a); l1 = B.lam(s, a); t2 = time.time()
        print(form, 'a=%.2f atoms %d: max|M_direct - M_nufft| = %.2e (max|M| %.2e); lam direct %s nufft %s; time %.2fs vs %.2fs' % (a, len(s['x']), np.abs(M0 - M1).max(), np.abs(M0).max(), ['%.6e' % v for v in l0], ['%.6e' % v for v in l1], t1 - t0, t2 - t1), flush=True)
