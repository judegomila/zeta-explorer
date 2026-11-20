"""Combination 1 on controls that have zeros off the line (zero side).  Lists: on (on-line ordinates), offg, offx (ordinate and |beta - 1/2| of
each off-line pair {beta + i gamma, 1 - beta + i gamma}; conjugates are added here).
Table = the on-line zeros below Htab.  Omitted = on-line zeros above Htab (exact from the list, density above the list), all mirror zeros,
and the off-line zeros (all heights in the list).   K(a) = full omitted sum (signed, real);  K(b) = density alone above Tb = Htab (full density of
the object) + mirror density.   r = K(a)/K(b).   dist = distance from the pair to the nearest off-line ordinate, in mean spacings.
Usage: t1_ctl.py NAME OFF.npz Q PAR OUT.json   [zeta-list for the reference range of r at the same depths]"""
import sys, math, numpy as np, fk
name, fn, Q, par, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
d = np.load(fn); on = np.array(d['on'], np.float64); offg = np.array(d['offg'], np.float64); offx = np.abs(np.array(d['offx'], np.float64))
o = np.argsort(offg); offg = offg[o]; offx = offx[o]
Hl = float(on[-1]); TM = Hl + 0.5 / float(fk.dens(Hl, Q, par)); y0 = max(1.0, 0.6 * on[0])
zoff = np.concatenate([offg + 1j * offx, offg - 1j * offx, -offg + 1j * offx, -offg - 1j * offx])
res = dict(name=name, online=len(on), offline_pairs=len(offg), first_offline_height=float(offg[0]), list_height=Hl, rows=[])
def Koff(a, b, zz):
    S = np.zeros(len(a)); A = np.zeros(len(a))
    for s0 in range(0, len(zz), 4000):
        z = zz[None, s0:s0 + 4000]; t = 1 / ((a[:, None] - z) * (b[:, None] - z)); S += t.real.sum(1); A += np.abs(t).sum(1)
    return 2 * S, 2 * A
tabs = [float(offg[0]) - 0.5] + [float(offg[0]) + v for v in (5.0, 15.0, 35.0, 65.0)] + [h for h in (300.0, 1000.0, 3000.0, 1e4, 3e4, 1e5) if h < Hl * 0.999] + [Hl * 0.9]
for Htab in sorted(set(tabs)):
    N = int(np.searchsorted(on, Htab)); x = on[:N]
    if N < 12: continue
    l = np.arange(2, N - 1) if N <= 6000 else np.unique(np.concatenate([np.arange(N - 2001, N - 1), np.random.default_rng(2).choice(np.arange(2, N - 2001), 4000, replace=False)]))
    a = x[l]; b = x[l + 1]
    S, Sm = fk.pairsum(on, a, b, np.zeros(len(l), np.int64), np.full(len(l), N, np.int64))
    Kon = 2 * (S + Sm + fk.tail_int(TM, a, b, Q, par) + fk.tail_int(TM, -b, -a, Q, par))
    Ks, Ka_abs = Koff(a, b, zoff)
    Tb = float(x[-1] + 0.5 / fk.dens(x[-1], Q, par))
    Kb = 2 * (fk.tail_int(Tb, a, b, Q, par) + fk.tail_int(y0, -b, -a, Q, par))
    r = (Kon + Ks) / Kb; r_on = Kon / Kb
    mid = 0.5 * (a + b); j = np.clip(np.searchsorted(offg, mid), 1, len(offg) - 1)
    dist = np.minimum(np.abs(offg[j] - mid), np.abs(offg[j - 1] - mid)) * fk.dens(mid, Q, par)
    depth = N - 2 - l; off_below = int((offg < x[-1]).sum())
    row = dict(Htab=Htab, N=N, offline_pairs_below_table_top=off_below, pairs=len(l), bands=[])
    for nm, m in (('all', np.ones(len(l), bool)), ('dist>10', dist > 10), ('dist>10, depth>=100', (dist > 10) & (depth >= 100)), ('dist>30', dist > 30), ('depth<16', depth < 16), ('below first off-line', b < offg[0])):
        if not m.any(): continue
        row['bands'].append(dict(subset=nm, n=int(m.sum()), r=[float(np.quantile(r[m], q)) for q in (0, 0.1, 0.5, 0.9, 1)], r_online_only=[float(np.quantile(r_on[m], q)) for q in (0, 0.5, 1)],
                                 K_offline_signed=[float(np.quantile(Ks[m], q)) for q in (0, 0.5, 1)], K_offline_abs_median=float(np.median(Ka_abs[m])), K_dens_median=float(np.median(Kb[m])),
                                 frac_r_outside_0p9_1p1=float(((r[m] < 0.9) | (r[m] > 1.1)).mean())))
    res['rows'].append(row); fk.log(name, 'Htab', Htab, 'N', N, 'off-line pairs below', off_below)
    for bd in row['bands']: fk.log('    ', bd['subset'], bd['n'], 'r', ['%.4g' % v for v in bd['r']], 'r(on-line only)', ['%.4g' % v for v in bd['r_online_only']], 'K_off', ['%.3g' % v for v in bd['K_offline_signed']], 'K_dens med %.3g' % bd['K_dens_median'], 'outside %.3f' % bd['frac_r_outside_0p9_1p1'])
fk.jdump(res, out)
