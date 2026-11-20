"""Test 1: truncation ladder of the signed real-rootedness time T_N(F).
T_N(F) = last landing time of an off-line pair in the heat flow (d_t H = -H_zz, z = 2 gamma, Lambda units) of the polynomial whose
zeros are the first N zeros of F with positive ordinate and their mirrors (bare: no tail), or -4 t_c(N) (backward collision time in
gamma units, from the real ladders) when the first N zeros are all real.
Usage: t1.py OBJ MODE N1,N2,...  [M0]
  OBJ: DH, HEAT--0.1, HEAT--0.5, EA-<a>, TNR-<q>-<c>, WIT-<c>-<Y>   MODE: bare | tail
  M0 (optional): only the M0 lowest zeros move (M0 > 0) or the |M0| highest below the cut (M0 < 0); the others are frozen at their t = 0 positions
      and only the pairs in the outer half of the moving set are read.
Output: out/t1_<OBJ>_<MODE>[_M0].json"""
import sys, os, json, math, numpy as np, bl, hl
obj, mode, Ns = sys.argv[1], sys.argv[2], [int(float(v)) for v in sys.argv[3].split(',')]
M0 = int(float(sys.argv[4])) if len(sys.argv) > 4 else None
rows = []
if obj.startswith('WIT-'):
    _, c, Y = obj.split('-'); c = float(c); Y = float(Y)
    lam = (math.sqrt(1 + 4 * c * c * Y * Y) - 1) / (4 * c * c)       # exact Lambda of (z^2 + Y^2) cos(c z)
    for N in Ns:
        k = np.arange(N // 2); r = (k + 0.5) * math.pi / c; r = np.concatenate([-r[::-1], r])
        tail = ('const', c / math.pi, float(r[-1] + 0.5 * math.pi / c)) if mode == 'tail' else None
        fl = bl.FlowX(r, np.zeros(1), np.array([-4 * Y * Y]), mirror=False, tail=tail)
        fl.run(Y * Y / 2 * 1.001 + 1e-9, rtol=1e-11, atol=1e-13, verbose=False)
        T = float(fl.land[0]); D = abs(lam - T)
        rows.append(dict(N=N + 2, T_N=T, Lambda=lam, D=D, least_CC=bl.least_CC(D, N + 2), evals=fl.nev, **{k_: v for k_, v in bl.surrogate(N + 2).items() if k_ != 'T0'}))
        hl.log(obj, mode, 'N=%d T_N=%.12f Lambda=%.12f D=%.3e' % (N + 2, T, lam, D))
    res = dict(obj=obj, mode=mode, Lambda_exact=lam, rows=rows)
else:
    Hmax = float(os.environ.get('RH_HMAX', 2000))
    on, og, ox, tail = bl.control(obj, Hmax)
    tot = len(on) + 2 * len(og)
    hl.log('%s: %d on-line, %d pairs below %g (%d zeros)' % (obj, len(on), len(og), Hmax, tot))
    for N in Ns:
        if N > tot: hl.log('N=%d exceeds the list' % N); continue
        on_, og_, ox_, hc, Nact = bl.first_N(on, og, ox, N)
        if len(og_) == 0:
            rows.append(dict(N=Nact, cut=hc, n_pairs=0, T_N=None, note='all real: T_N = -4 t_c(N) from the real ladder')); continue
        X = 2 * og_; Y0 = 2 * ox_
        ext = None; r_mov = 2 * on_; Xm = X; Ym = Y0
        if M0 and Nact > abs(M0):
            if M0 > 0:                                   # the M0 lowest zeros move, the rest is frozen
                on_m, og_m, ox_m, hm, _ = bl.first_N(on_, og_, ox_, M0); fr_on = on_ >= hm; fr_og = og_ >= hm
            else:                                        # the |M0| highest zeros below the cut move, the rest is frozen
                _, _, _, hm, _ = bl.first_N(on_, og_, ox_, Nact + M0); fr_on = on_ < hm; fr_og = og_ < hm
                on_m, og_m, ox_m = on_[~fr_on], og_[~fr_og], ox_[~fr_og]
            fx = np.concatenate([2 * on_[fr_on], 2 * og_[fr_og], 2 * og_[fr_og]]); fy = np.concatenate([0 * on_[fr_on], 2 * ox_[fr_og], -2 * ox_[fr_og]])
            ext = (bl.ca(fx), bl.ca(fy)); r_mov = 2 * on_m; Xm = 2 * og_m; Ym = 2 * ox_m
        M = len(r_mov) + 2 * len(Xm)
        hl.log('N=%d (cut %.4f): %d moving (%d pairs), %d frozen; pair terms per evaluation %.2e; arrays %.1f MB' % (Nact, hc, M, len(Xm), 0 if ext is None else len(ext[0]), 2.0 * M * (M + (0 if ext is None else len(ext[0]))), 8e-6 * 14 * (M + (0 if ext is None else len(ext[0])))))
        fl = bl.FlowX(r_mov, Xm, -4 * Ym ** 2, mirror=True, tail=(tail + (2 * hc,)) if mode == 'tail' else None); fl.ext = ext
        tend = 0.5 * float(Ym.max()) ** 2 * 1.0001 + 1e-6
        # when part of the set is frozen only the pairs in the lower half of the moving set are read
        fl.run(tend, rtol=1e-9, atol=1e-10, verbose=False, dt0=min(1e-7, tend / 100))
        land = fl.land; good = np.ones(len(Xm), bool) if ext is None else ((Xm < 0.5 * (Xm.max() + Xm.min())) if M0 > 0 else (Xm > 0.5 * (Xm.max() + Xm.min())))
        if mode == 'tail' and ext is None: good = Xm < 0.8 * 2 * hc          # with a tail the pairs in the top 20 % feel the cut and are not read (as in lane s5)
        i = int(np.nanargmax(np.where(good, land, -1)))
        top = np.argsort(-np.where(good & ~np.isnan(land), land, -1))[:5]
        row = dict(N=Nact, cut=hc, n_real=len(on_), n_pairs=len(og_), moving=M, T_N=float(land[i]), argmax_gamma=float(Xm[i] / 2), argmax_x=float(Ym[i] / 2), debruijn=float(Ym[i] ** 2 / 2),
                   unlanded=int(np.isnan(land).sum()), land_x=float(fl.landx[i]), evals=fl.nev, steps=fl.steps, top5=[(float(Xm[j] / 2), float(Ym[j] / 2), float(land[j])) for j in top],
                   first_pair=(float(Xm[0] / 2), float(Ym[0] / 2), float(land[0])))
        rows.append(row); hl.log('N=%d T_N=%.9f at gamma=%.3f x=%.4f (de Bruijn %.6f) evals %d unlanded %d' % (Nact, row['T_N'], row['argmax_gamma'], row['argmax_x'], row['debruijn'], fl.nev, row['unlanded']))
        bl.jdump(dict(obj=obj, mode=mode, M0=M0, Hmax=Hmax, rows=rows), 'out/t1_%s_%s%s.partial.json' % (obj, mode, ('_M%d' % M0 if M0 > 0 else '_top%d' % -M0) if M0 else ''))
    res = dict(obj=obj, mode=mode, M0=M0, Hmax=Hmax, rows=rows)
fn = 'out/t1_%s_%s%s.json' % (obj, mode, ('_M%d' % M0 if M0 > 0 else '_top%d' % -M0) if M0 else ''); bl.jdump(res, fn)
if os.path.exists(fn.replace('.json', '.partial.json')): os.remove(fn.replace('.json', '.partial.json'))
print('WROTE', fn)
