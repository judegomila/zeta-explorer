"""HEAT control: F_tau(z) = int e^{tau u^2/16} kappa(u) e^{zu/2} du, s = 1/2 + z, tau in TAUS (backward heat, tau < 0).
Usage: python heat.py <tables> <tmax> [scan_step] [grid_step]
Produces values_HEAT-<tau>.npz (grid, scaled double-double with a decimal exponent), zeros_HEAT-<tau>.json.
Quadrature: composite Gauss-Legendre of heatlib.Heat (python-flint balls as multiprecision floats; the truncation error of the
quadrature is not enclosed: MEASURED). Precision is chosen per height band from |F| ~ exp(-pi t/4).
On-line zeros: sign changes of the real function F_tau(it) on a scan of step scan_step, refined by Newton.
Off-line zeros: Newton from points above local minima of |F_tau(it)| without a sign change (a pair that has left the line nearby).
Count diagnostic: on-line + 2 * off-line pairs against the number of zeta zeros below tmax (zeros move continuously under the flow;
agreement up to boundary effects is expected, a deficit means off-line pairs not found by the local-minimum rule)."""
import os, sys, math, time, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from flint import arb, acb, ctx, arb_mat
import core, heatlib
import multiprocessing as mp

TAUS = ['-0.1', '-0.5']
SIG = core.SIGMAS
W = int(os.environ.get('RH_WORKERS', '4'))
_H = None; _band = None; _M = None


def band_edges(tmax):
    e = [0.0]
    for b in (250.0, 500.0, 1000.0, 1500.0, 2000.0):
        if b < tmax: e.append(b)
    e.append(tmax)
    return [(e[i], e[i + 1]) for i in range(len(e) - 1)]


def band_params(tb):
    digits = int(45 + 0.3412 * tb + 0.02 * tb)      # |xi(1/2+it)| ~ 10^(-0.3411 t); margin for cancellation
    bits = int((digits + 15) / 0.30103) + 8
    return bits, digits


def init_band(tb, need_matrix):
    global _H, _band, _M
    bits, digits = band_params(tb)
    _H = heatlib.Heat(bits, tb + 1.0, digits=digits); _band = tb
    for tau in TAUS: _H.weights(tau)
    if need_matrix:
        rowsC = []; rowsS = []          # one single-row arb_mat per (tau, sigma): no second copy of the table is held
        for tau in TAUS:
            g = _H.weights(tau)
            for sg in SIG:
                a = arb(sg) - arb(1) / 2
                rc = []; rs = []
                for gk, u in zip(g, _H.u):
                    sh, ch = (a * u / 2).sinh_cosh(); rc.append(gk * ch); rs.append(gk * sh)
                rowsC.append(arb_mat([rc])); rowsS.append(arb_mat([rs]))
        _M = (rowsC, rowsS)
    else:
        _M = arb_mat([_H.weights(tau) for tau in TAUS]), arb_mat([[gk * u / 2 for gk, u in zip(_H.weights(tau), _H.u)] for tau in TAUS])


def _cs(t):
    th = arb(t) / 2
    sc = [(th * u).sin_cos() for u in _H.u]
    return arb_mat([[x[1]] for x in sc]), arb_mat([[x[0]] for x in sc])


def F_line(t):
    """(F_tau(it), d/dt F_tau(it)) for tau in TAUS; real"""
    c, s = _cs(t)
    f = _M[0] * c; d = _M[1] * s
    return [f[i, 0] for i in range(len(TAUS))], [-d[i, 0] for i in range(len(TAUS))]


def scan_chunk(ts):
    out = []
    for t in ts:
        f, _ = F_line(t)
        out.append([(1 if x > 0 else (-1 if x < 0 else 0), float(abs(x).log().mid()) / math.log(10) if x != 0 else -1e9, int(x.rel_accuracy_bits())) for x in f])
    return ts, out


def refine(args):
    ti, a, b, sa = args          # tau index, bracket, sign at a
    t = arb((a + b) / 2)
    lo, hi = arb(a), arb(b)
    for it in range(60):
        f, d = F_line(t)
        fx, dx = f[ti], d[ti]
        if (fx > 0) == (sa > 0): lo = t
        else: hi = t
        step = fx / dx
        tn = arb((t - step).mid())
        if not (tn > lo and tn < hi): tn = arb(((lo + hi) / 2).mid())
        if float(abs(tn - t).upper()) < 1e-31 * max(1.0, float(t.mid())):
            t = tn; break
        t = tn
    f, _ = F_line(t)
    return ti, t.str(32, radius=False), it


def newton_off(args):
    ti, tc = args
    tau = TAUS[ti]
    for x0 in (0.05, 0.3, 0.8):
        z = acb(x0, tc); ok = False
        for it in range(20):
            f, d = _H.F(tau, z, True)
            if d == 0: break
            dz = f / d
            z = acb(z.real.mid(), z.imag.mid()) - acb(dz.real.mid(), dz.imag.mid())
            if abs(float(z.imag.mid()) - tc) > 3 or abs(float(z.real.mid())) > 4: break
            if float(abs(dz).upper()) < 1e-30: ok = True; break
        if ok and abs(float(z.real.mid())) > 1e-12:
            f, d = _H.F(tau, z, True)
            return ti, z.real.str(32, radius=False), z.imag.str(32, radius=False), float((abs(f) / abs(d)).upper())
    return None


def grid_row(t):
    c, s = _cs(t)
    ns = len(SIG); out = np.zeros((len(TAUS), 6, ns))
    for i in range(len(TAUS)):
        for j in range(ns):
            x = (_M[0][i * ns + j] * c)[0, 0]; y = (_M[1][i * ns + j] * s)[0, 0]
            ax = abs(x); ay = abs(y); mm = ax if ax > ay else ay      # arb comparison: no float underflow (values reach 1e-682)
            e = int(math.floor(float(mm.log().mid()) / math.log(10))) if mm > 0 else 0
            sc = arb(10) ** (-e)
            out[i, 0, j], out[i, 1, j] = core.dd_split(x * sc); out[i, 2, j], out[i, 3, j] = core.dd_split(y * sc)
            out[i, 4, j] = e
            out[i, 5, j] = min(int(x.rel_accuracy_bits()), int(y.rel_accuracy_bits()) if t != 0 else 10 ** 6)
    return out


def main():
    tables = sys.argv[1]; tmax = float(sys.argv[2])
    sstep = float(sys.argv[3]) if len(sys.argv) > 3 else 0.05
    gstep = float(sys.argv[4]) if len(sys.argv) > 4 else core.T_STEP
    do = sys.argv[5] if len(sys.argv) > 5 else 'zeros,grid'
    T0 = time.time()
    P = mp.get_context('fork').Pool
    # normalisation: F_0(z) against xi(1/2+z) (heatlib.xi has the factor 1/2)
    ctx.prec = 200
    Hc = heatlib.Heat(200, 40.0, digits=30)
    ratio = Hc.F('0', acb(0.3, 20)) / heatlib.xi(acb(0.3, 20))
    print('normalisation F_0(z)/xi_half(1/2+z) at z = 0.3+20i:', ratio.str(20), flush=True)
    scan = {}; zeros_on = {i: [] for i in range(len(TAUS))}; zeros_off = {i: [] for i in range(len(TAUS))}; acc_min = 10 ** 9
    grid = {}
    for (ta, tb) in band_edges(tmax):
        bits, digits = band_params(tb)
        if 'zeros' in do:
            n = int(round((tb - ta) / sstep))
            ts = [ta + (tb - ta) * k / n for k in range(n + 1)]
            if ta == 0.0: ts[0] = 1e-3
            chunks = [ts[i:i + 20] for i in range(0, len(ts), 20)]
            with P(W, initializer=init_band, initargs=(tb, False)) as p:
                res = p.map(scan_chunk, chunks, chunksize=1)
                tt = [t for r in res for t in r[0]]; vv = [v for r in res for v in r[1]]
                tasks = []; cand = []
                for i in range(len(TAUS)):
                    for k in range(1, len(tt)):
                        s0, s1 = vv[k - 1][i][0], vv[k][i][0]
                        acc_min = min(acc_min, vv[k][i][2])
                        if s0 * s1 < 0: tasks.append((i, tt[k - 1], tt[k], s0))
                    for k in range(1, len(tt) - 1):
                        if vv[k - 1][i][0] == vv[k][i][0] == vv[k + 1][i][0] and vv[k][i][1] < vv[k - 1][i][1] and vv[k][i][1] < vv[k + 1][i][1]:
                            cand.append((i, tt[k]))
                print('band [%g, %g]: bits %d, scan %d points, %d sign changes, %d local-minimum candidates, %.0f s' % (ta, tb, bits, len(tt), len(tasks), len(cand), time.time() - T0), flush=True)
                for r in p.map(refine, tasks, chunksize=2): zeros_on[r[0]].append(r[1])
                offt = cand
                for r in p.map(newton_off, offt, chunksize=1):
                    if r is None: continue
                    i, re_, im_, res_ = r
                    if abs(float(re_)) < 1e-12 or not (ta - 1e-9 < float(im_) <= tb): continue
                    if float(re_) < 0: re_ = re_.lstrip('-')
                    if all(abs(float(re_) - float(q[0])) + abs(float(im_) - float(q[1])) > 1e-9 for q in zeros_off[i]): zeros_off[i].append([re_, im_, res_])
            print('band [%g, %g]: zeros done, on-line %s, off-line pairs %s, %.0f s' % (ta, tb, [len(zeros_on[i]) for i in zeros_on], [len(zeros_off[i]) for i in zeros_off], time.time() - T0), flush=True)
        if 'grid' in do:
            n0 = int(math.ceil(ta / gstep - 1e-9)); n1 = int(math.floor(tb / gstep + 1e-9))
            ts = [k * gstep for k in range(n0, n1 + 1) if (k * gstep > ta or ta == 0.0)]
            print('planned allocation per worker (band to %g): 2 matrices %d x nodes of %d-bit balls' % (tb, 2 * len(SIG), bits), flush=True)
            with P(W, initializer=init_band, initargs=(tb, True)) as p:
                rows = p.map(grid_row, ts, chunksize=4)
            for t, r in zip(ts, rows): grid[t] = r
            print('band [%g, %g]: grid %d rows, %.0f s' % (ta, tb, len(ts), time.time() - T0), flush=True)
    zz = None
    fz = os.path.join(tables, 'zeros_ZETA.json')
    if os.path.exists(fz): zz = sum(1 for g in json.load(open(fz))['gamma'] if float(g) <= tmax)
    for i, tau in enumerate(TAUS):
        if 'zeros' in do:
            on = sorted(zeros_on[i], key=float); off = sorted(zeros_off[i], key=lambda q: float(q[1]))
            json.dump(dict(object='HEAT-' + tau, H=tmax, variable='s = 1/2 + z; on-line zeros listed by ordinate; off-line pairs by [Re z > 0, Im z, Newton residual |F/F\'|]',
                           online_count=len(on), offline_pairs=len(off), zeta_zero_count_below_H=zz,
                           count_diagnostic=(None if zz is None else zz - len(on) - 2 * len(off)),
                           scan_step=sstep, min_rel_accuracy_bits_in_scan=acc_min,
                           method='sign changes + Newton; off-line by Newton above local minima of |F| on the line; MEASURED; off-line list not certified complete',
                           online=on, offline=off), open(os.path.join(tables, 'zeros_HEAT-%s.json' % tau), 'w'))
        if 'grid' in do:
            ts = sorted(grid); A = np.stack([grid[t][i] for t in ts], axis=2)
            np.savez_compressed(os.path.join(tables, 'values_HEAT-%s.npz' % tau), sigmas=np.array(SIG), t=np.array(ts), re_hi=A[0], re_lo=A[1], im_hi=A[2], im_lo=A[3],
                                exp10=A[4].astype(np.int32), rel_accuracy_bits=A[5].astype(np.int32),
                                meta=json.dumps(dict(code='HEAT-' + tau, kind='kernel', real_coeffs=True, tau=tau,
                                                     note='value = (re_hi + re_lo + i (im_hi + im_lo)) * 10^exp10 = F_tau(z), z = s - 1/2; F_0(z) = xi(s)/2 with xi(s) = s(s-1) pi^(-s/2) Gamma(s/2) zeta(s) '
                                                          '(ratio printed in the log). rel_accuracy_bits is the ball accuracy (rounding only; quadrature truncation not enclosed).',
                                                     fe=dict(symmetry='z <-> -z (even), real on the imaginary axis'), local=None)))
    print('HEAT done %.0f s' % (time.time() - T0), flush=True)


if __name__ == '__main__':
    main()
