"""Higher-precision re-check of the infeasibility certificates of c2_margin.py (zeta, real or complex weights).
For the support of a certificate (d+1 constraints in dimension d): each extremum x* is recomputed with mpmath (root of Z', 25 digits; sign of Z''
from mpmath), the signed mode vectors are evaluated in ball arithmetic (python-flint, 256 bits) and the system
   sum_k lam_k g_k = 0, sum_k lam_k = 1
is solved with arb_mat.solve. All lam_k > 0 (as balls) certifies that 0 is an interior point of the simplex of the g_k, hence that
g_k.w > 0 has no solution, for the stated points x*.
Usage: c2_cert.py RESULT.json [N ...]"""
import sys, json, math
import mpmath as mp
from flint import arb, acb, arb_mat, ctx

def run(res, N):
    o = res['onset'].get(str(N))
    if not o: return None
    mode = res['mode']; xs = o['cert_x']; ss = o['cert_s']; d = N * (2 if mode == 'cossin' else 1)
    if len(xs) != d + 1: return dict(N=N, status='support %d != dim+1 = %d; not re-checked' % (len(xs), d + 1))
    mp.mp.dps = 25; ctx.prec = 256
    rows = []; dxm = 0.0; sflip = 0
    for x0, s0 in zip(xs, ss):
        x = mp.findroot(lambda t: mp.siegelz(t, derivative=1), mp.mpf(x0)); s = int(mp.sign(mp.siegelz(x, derivative=2)))
        dxm = max(dxm, abs(float(x - x0))); sflip += (s != int(s0))
        xb = arb(mp.nstr(x, 25)) + arb(0, 1e-22)
        th = acb(arb(1) / 4, xb / 2).lgamma().imag - xb / 2 * arb.pi().log()
        r = []
        for n in range(1, N + 1):
            ph = th - xb * arb(n).log(); r.append(s * ph.cos() / arb(n).sqrt())
        if mode == 'cossin':
            for n in range(1, N + 1):
                ph = th - xb * arb(n).log(); r.append(s * ph.sin() / arb(n).sqrt())
        rows.append(r)
    A = arb_mat(d + 1, d + 1, [rows[k][i] for i in range(d) for k in range(d + 1)] + [arb(1)] * (d + 1))
    b = arb_mat(d + 1, 1, [arb(0)] * d + [arb(1)])
    lam = A.solve(b)
    lo = [float((lam[i, 0]).lower()) if hasattr(lam[i, 0], 'lower') else float(lam[i, 0].mid() - lam[i, 0].rad()) for i in range(d + 1)]
    rad = max(float(lam[i, 0].rad()) for i in range(d + 1))
    ok = all(v > 0 for v in lo)
    return dict(N=N, mode=mode, T0=o['T0'], K0=o['K0'], support=d + 1, max_shift_of_x=dxm, sign_changes_vs_parity=int(sflip), min_lambda_lower=min(lo), max_radius=rad,
                status='CERTIFIED infeasible (0 interior to the simplex)' if ok else 'NOT certified (some barycentric coordinate not positive)')

if __name__ == '__main__':
    res = json.load(open(sys.argv[1])); Ns = [int(v) for v in sys.argv[2:]] or [int(k) for k in res['onset']]
    out = []
    for N in Ns:
        r = run(res, N)
        if r: out.append(r); print(r, flush=True)
    json.dump(out, open(sys.argv[1].replace('.json', '_cert.json'), 'w'))
