import sys, time, math, numpy as np, wf, objs
N = int(sys.argv[1]) if len(sys.argv) > 1 else 60
t0 = time.time(); B = wf.Basis(N); print('basis N=%d K=%d built in %.1fs' % (N, B.K, time.time() - t0), flush=True)
tab = wf.sieve_mangoldt(2000)
z = objs.spec_zeta(2000, tab)
for a in (0.3, 0.5493, 1.0, 1.5, 2.0, 3.0): print('zeta a=%.4f lam(even,odd)=' % a, B.lam(z, a), flush=True)
dh = objs.spec_periodic(objs.dh_coeffs(), 5, 1, 2000, 'DH')
print('DH c2,c4,c6', dh['c'][2], dh['c'][4], dh['c'][6], '(route 30: 0.19690858829, -1.44223196, 1.9363560766)')
print('DH lam at ln3/2 (route 44: 0.2103):', B.lam(dh, math.log(3)/2))
t0 = time.time(); print('DH onset (route 44: <=1.74, tlb 1.72):', B.onset(dh, hi=3.0), '%.1fs' % (time.time() - t0), flush=True)
for form, D, ref in [((1, 0, 5), -20, 'r15 (1,0,5)'), ((2, 2, 3), -20, 'r15 cert<=0.417'), ((1, 1, 6), -23, 'r15 even (1.679,1.689], odd 1.662')]:
    t0 = time.time(); s = objs.spec_epstein(form, 2.2); t1 = time.time()
    lo, hi, sec, l = B.onset(s, hi=2.2)
    print(form, 'grid onset', (lo, hi, sec), s['info'], ref, 'atoms %.1fs onset %.1fs' % (t1 - t0, time.time() - t1), flush=True)
    for par in (0, 1):   # sector-wise onsets
        a0, a1 = 0.15, 2.2
        while a1 - a0 > 0.005:
            mid = (a0 + a1)/2
            if B.lam(s, mid)[par] < -1e-9: a1 = mid
            else: a0 = mid
        print('   sector', par, 'onset', (round(a0, 4), round(a1, 4)))
    if form[0] == 1:
        se = objs.spec_epstein_exact_principal(D, 2.2)
        print('   exact-atom onset', B.onset(se, hi=2.2)[:3], 'lam diff at 1.4:', np.array(B.lam(se, 1.4)) - np.array(B.lam(s, 1.4)))
