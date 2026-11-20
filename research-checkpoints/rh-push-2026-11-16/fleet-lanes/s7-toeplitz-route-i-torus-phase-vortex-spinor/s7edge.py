"""Combination 4 (lane s7): lower-edge law of the cell sections of the truncated Weil symbol w_P (coefficients n <= P), and crossings.
usage: s7edge.py mode out.json   (mode: validate | edge | cross)   env: OBJS, PLIST, MMAX"""
import sys, os, json, time, math
import numpy as np, scipy.linalg as sla
from s7cell import *
MODE = sys.argv[1]; OUT = sys.argv[2]
OBJS = os.environ.get('OBJS', 'zeta,chim4,chi5,tnr-101-2.1,dh,liou,uni,ea0.2').split(',')
PLIST = [int(float(x)) for x in os.environ.get('PLIST', '2,5,31,101,1009,10007').split(',')]
MMAX = int(os.environ.get('MMAX', '12000'))
X = max(PLIST) + 200
t0 = time.time()

def low(q, m, k=8):
    T = toep(q, m)
    print('  allocation %d x %d %s = %.2f GB' % (m, m, T.dtype, T.nbytes / 2 ** 30), flush=True)
    return sla.eigh(T, eigvals_only=True, subset_by_index=[0, min(k, m) - 1], overwrite_a=True, check_finite=False)

def symbol_min(q, h):
    """global minimum of the lattice symbol on [0, pi] (real symmetric q) or [-pi, pi] (complex), refined by Newton"""
    L = 1 << int(math.ceil(math.log2(16 * len(q))))
    two = np.zeros(L, dtype=complex); two[:len(q)] = q; two[-(len(q) - 1):] = np.conj(q[1:][::-1])
    f = np.fft.fft(two).real                      # f(phi_k) = sum_d q_d e^{-i d phi_k}
    k = int(np.argmin(f)); phi = 2 * math.pi * k / L
    if phi > math.pi: phi -= 2 * math.pi
    for it in range(20):
        v, d1, d2 = lattice_symbol(q, phi)
        if d2[0] <= 0: break
        step = d1[0] / d2[0]; phi -= step
        if abs(step) < 1e-15: break
    v, d1, d2 = lattice_symbol(q, phi)
    return dict(phi0=float(phi), t0=float(phi / h), fmin=float(v[0]), curv=float(d2[0]), grid_min=float(f.min()), fmax=float(f.max()))

res = []
if MODE == 'validate':
    # 1. cell matrices of zeta against lane s2 / s4 (k = 4: m = 32, 64, 256 -> 3.077886e-3, 7.896351e-4, 2.096345e-5)
    o = obj('zeta', 2000); h = math.log(2) / 16
    q = q_sym(o, h, 300)
    for m in (32, 64, 256): print('validate zeta k=4 m=%d lambda_min = %.6e' % (m, low(q, m, 1)[0]))
    # 2. Kac-Murdock-Szego: tridiagonal symbol 2 - 2 cos phi, lambda_j = 4 sin^2(j pi / (2(m+1)))
    qq = np.zeros(50); qq[0] = 2; qq[1] = -1
    ev = low(qq, 40, 3); print('validate KMS', ev, [4 * math.sin(j * math.pi / 82) ** 2 for j in (1, 2, 3)])
    print('symbol_min of 2 - 2cos:', symbol_min(qq, 1.0))
    sys.exit()

for nm in OBJS:
    o = obj(nm, X)
    cplx = np.iscomplexobj(o['c'])
    for P in PLIST:
        if nm.startswith('tnr') and P < int(nm.split('-')[1]): continue
        nxt = o['n'][o['n'] > P]
        Pplus = int(nxt[0]) if len(nxt) else None
        if Pplus is None: continue
        LP = math.log(Pplus)
        if MODE == 'edge':
            fac = [0.5, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0]
            wmax = fac[-1] * LP
            h = wmax / MMAX
            Mq = MMAX + int(90 / h) + 2
            for variant in ('sym', 'full'):
                if variant == 'full' and not o['poles']: continue
                q = q_sym(o, h, Mq, P=P, pole=False)            # symbol sequence (long: archimedean tail decays like e^{-2 z d h})
                sm = symbol_min(q, h)
                qm = q[:MMAX + 1] + (pole_q(MMAX + 1, h, o['poles']) if variant == 'full' else 0)
                rows = []
                for fc in fac:
                    m = int(round(fc * LP / h))
                    if variant == 'full' and fc > 1.0: continue                  # beyond log(P+) the pole term is not balanced by the truncated prime sum
                    ev = low(qm, m)
                    j = np.arange(1, len(ev) + 1)
                    jj = (j + 1) // 2 if (not cplx and abs(sm['phi0']) > 1e-9) else j        # minima at +-phi0: twin ladder
                    pred = sm['fmin'] + 0.5 * sm['curv'] * (jj * math.pi / (m + 1)) ** 2
                    rows.append(dict(fac=fc, m=m, twoa=m * h, ev=[float(x) for x in ev], pred=[float(x) for x in pred]))
                    print(nm, P, variant, 'fac %.1f m %d 2a %.3f ev %s pred %s  %.0fs' % (fc, m, m * h, np.array2string(ev[:4], precision=5), np.array2string(pred[:4], precision=5), time.time() - t0), flush=True)
                res.append(dict(obj=nm, P=P, Pplus=Pplus, h=h, variant=variant, symbol=sm, rows=rows))
                json.dump(res, open(OUT, 'w'))
        else:                                                    # crossing of the full form (own poles) with coefficients n <= P
            mcap = int(os.environ.get('MCROSS', '3000'))
            wmax = LP + min(1.0, 0.5 * LP)
            h = wmax / mcap; TOL = 1e-9
            q = q_sym(o, h, mcap + 2, P=P, pole=True)
            lam = lambda m: float(low(q, m, 1)[0])
            l_at = lam(int(LP / h))                              # last section inside log(P+)
            l_end = lam(mcap)
            rec = dict(obj=nm, P=P, Pplus=Pplus, logPplus=LP, h=h, lam_inside=l_at, lam_end=l_end)
            if l_end >= -TOL: rec['crossing'] = None
            else:
                lo, hi = 1, mcap
                if lam(lo) < -TOL: hi = lo
                while hi - lo > 1:
                    mid = (lo + hi) // 2
                    if lam(mid) < -TOL: hi = mid
                    else: lo = mid
                rec['crossing'] = [lo * h, hi * h]; rec['offset_from_logPplus'] = [lo * h - LP, hi * h - LP]
            res.append(rec); print(json.dumps(rec), '%.0fs' % (time.time() - t0), flush=True)
            json.dump(res, open(OUT, 'w'))
