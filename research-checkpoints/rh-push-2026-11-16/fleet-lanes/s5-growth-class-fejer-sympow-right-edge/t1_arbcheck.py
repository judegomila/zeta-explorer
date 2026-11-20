"""s5 combination 1: Arb re-check of kernel entries K_s(x, tau) = [psi_z(x) - (F(z)/F(s)) psi_s(x)]/(z - s) against the float64
evaluator, on random (x, tau) and on the entries where the top singular vectors of the float64 matrix are largest.
Usage: t1_arbcheck.py OBJ c t"""
import sys, math, numpy as np
from flint import acb, arb, ctx
import t1_resolvent as T
ctx.prec = 200
obj, c, t = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
x, cuts, tau, tgrid, Psi, Ps, f, Fs, sig0 = T.build(obj, c)
k = int(np.argmin(np.abs(tgrid - t))); tt = tgrid[k]; sel = np.nonzero(np.abs(tau - tt) <= T.TW)[0]
xw, wx, _ = T.xnodes(1e5); sw = np.sqrt(wx * (1 + xw) ** (-2 - 2 * c))
d = math.sqrt(T.DEL) / (1j * (tau[sel] - tt))
K = (Psi[:, sel] - np.outer(Ps[:, k], f[sel]) / Fs[k]) * d[None, :]
U, S, Vh = np.linalg.svd(K, full_matrices=False)
print('object %s  s = %.3f + %.3f i  abs F(s) = %.4e  N = %.6f  second singular value %.6f' % (obj, sig0, tt, abs(Fs[k]), S[0], S[1]))
def arb_psi(xv, z):
    kind = T.OBJ[obj][0]
    if kind == 'per':
        q, cl = T.OBJ[obj][1], T.OBJ[obj][2]
        if obj == 'DH':
            from t4_fejer import kappa_dh
            kd = kappa_dh(); cl = [(1, arb(1)), (2, kd), (3, -kd), (4, arb(-1))]
        return -sum(arb(cc) * z.zeta((arb(a) + arb(xv)) / q) for a, cc in cl) * (-z * arb(q).log()).exp()
    q, cc = arb(T.OBJ[obj][1]), arb('2.2')
    return -(z.zeta(1 + arb(xv)) + cc * ((arb(1) / 2 - z) * q.log()).exp() * z.zeta(1 + arb(xv) / q) + ((1 - 2 * z) * q.log()).exp() * z.zeta(1 + arb(xv) / (q * q)))
s = acb(arb(sig0), arb(float(tt))); Fs_a = -arb_psi(0.0, s)
rng = np.random.default_rng(7)
iu = np.argsort(-np.abs(U[:, 0]))[:40]; iv = np.argsort(-np.abs(Vh[0]))[:40]
pairs = [(int(rng.integers(len(x))), int(rng.integers(len(sel)))) for _ in range(300)] + [(int(a), int(b)) for a in iu[:15] for b in iv[:15]]
worst = 0; worst_abs = 0
for i, j in pairs:
    z = acb(arb(sig0), arb(float(tau[sel[j]])))
    ka = (arb_psi(float(x[i]), z) - (-arb_psi(0.0, z)) / Fs_a * arb_psi(float(x[i]), s)) / (z - s) * arb(float(sw[i] * math.sqrt(T.DEL)))
    ka = complex(float(ka.real.mid()), float(ka.imag.mid()))
    worst_abs = max(worst_abs, abs(ka - K[i, j])); worst = max(worst, abs(ka - K[i, j]) / max(abs(ka), 1e-300))
print('entries checked %d: worst absolute difference %.3e, worst relative difference %.3e (largest entry of K: %.3e)' % (len(pairs), worst_abs, worst, np.abs(K).max()))
