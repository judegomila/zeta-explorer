# Combination 3: passive-normalised endpoint-Hankel norm.
# Source object (imp-33685 / imp-33705): basis phi_j(tau) = (tau/U)^j, j = 0..d,
#   G_sym_jk = int_0^U sinh(a tau) phi_j phi_k dtau,  G_pass = diag(int_0^U cosh(a tau) phi_j^2 dtau),
#   R = G_pass^{-1/2} G_sym G_pass^{-1/2}.   No kernel enters; with x = tau/U it depends on s = aU and d only.
# Variants computed here:
#   (W0)  weight-free, diagonal passive core            -> function of (s, d)
#   (W0f) weight-free, full passive Gram (cosh-Gram)    -> sup of tanh(s x) on the span, < 1 for every s
#   (WA)  lag weight A_F(tau) (autocorrelation of the kernel), diagonal passive core -> kernel enters
#   (WAf) lag weight A_F, full passive Gram             -> <= tanh(a U_F) < 1 whenever A_F >= 0
import sys, json, math
import numpy as np
from glib import KERNELS, ORDER, gl, autocorr

DEG = [4, 8, 16, 32, 64, 100, 150, 200]
A_LIST = [0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0]
out = sys.argv[1] if len(sys.argv) > 1 else 'out/c3.json'
NQ = int(sys.argv[2]) if len(sys.argv) > 2 else 4000


def norms(x, w, sh, ch, dmax):
    """x in [0,1] nodes, w weights (already including any lag weight), sh/ch = sinh/cosh values.
    returns per degree: norm and trace with diagonal core, norm with full core."""
    res = {}
    V = np.vander(x, dmax + 1, increasing=True)                 # monomials
    Dj = (V*V*(w*ch)[:, None]).sum(axis=0)
    Bs = V*np.sqrt(w*sh)[:, None]/np.sqrt(Dj)[None, :]
    # orthogonal basis for the full core: Legendre Vandermonde, QR in the cosh weight
    L = np.polynomial.legendre.legvander(2*x - 1, dmax)
    for d in DEG:
        if d > dmax: continue
        sv = np.linalg.svd(Bs[:, :d + 1], compute_uv=False)
        tr = float((Bs[:, :d + 1]**2).sum())
        Q, _ = np.linalg.qr(L[:, :d + 1]*np.sqrt(w*ch)[:, None])
        M = Q.T @ (Q*(sh/ch)[:, None])
        full = float(np.linalg.eigvalsh((M + M.T)/2)[-1])
        res[d] = (float(sv[0]**2), tr, full)
    return res


print('planned allocations: Vandermonde %d x %d doubles = %.1f MB' % (NQ, 201, NQ*201*8/1e6), flush=True)
R = {'deg': DEG, 'a': A_LIST, 'W0': {}, 'WA': {}}
# (W0): s = aU grid; the source cell (a,U) = (0.5,6) is s = 3
x, w = gl(NQ, 0.0, 1.0)
for s in [0.05, 0.1, 0.3, 0.6, 1.2, 3.0, 6.0, 12.0, 30.0, 60.0, 120.0]:
    r = norms(x, w, np.sinh(s*x)/math.cosh(s), np.cosh(s*x)/math.cosh(s), 200)
    R['W0'][s] = r
    print('W0 s=%6.2f ' % s + ' '.join('d%d: %.4f/%.3f/%.4f' % (d, *r[d]) for d in DEG), flush=True)
# s-only check: (a,U) = (0.5,6), (1,3), (3,1), (0.1,30) by direct quadrature in tau
for (a, U) in [(0.5, 6.0), (1.0, 3.0), (3.0, 1.0), (0.1, 30.0)]:
    t, wt = gl(NQ, 0.0, U)
    V = np.vander(t/U, 5, increasing=True)
    D = (V*V*(wt*np.cosh(a*t))[:, None]).sum(axis=0)
    H = (V*(wt*np.sinh(a*t))[:, None]).T @ V
    Rm = H/np.sqrt(np.outer(D, D))
    ev = np.linalg.eigvalsh(Rm)
    off = math.sqrt(((Rm - np.diag(np.diag(Rm)))**2).sum())
    print('source cell check (a,U)=(%g,%g): ||R|| %.6f  trace %.6f  offdiag Frobenius %.6f  max diag %.6f   [source at (0.5,6): 4.617, 4.85, 4.082]'
          % (a, U, ev[-1], np.trace(Rm), off, np.diag(Rm).max()), flush=True)
# (WA): kernel lag weight
for name in ORDER:
    phi = KERNELS[name]
    gg = np.linspace(0, 6, 6001); AA = autocorr(phi, gg, n=2000)
    UF = float(gg[np.where(AA > 1e-12*AA[0])[0][-1]])
    # nodes on [0, U_F'] with U_F' slightly beyond the 1e-12 support (weight below 1e-30 is dropped)
    U2 = float(gg[np.where(AA > 1e-30*AA[0])[0][-1]])
    t, wt = gl(NQ, 0.0, U2)
    A = autocorr(phi, t, n=2000)
    A = A/A.max()
    R['WA'][name] = {'UF': UF, 'U2': U2, 'minA': float(A.min()), 'rows': {}}
    for a in A_LIST:
        sc = math.cosh(a*U2)
        r = norms(t/U2, wt*np.maximum(A, 0.0), np.sinh(a*t)/sc, np.cosh(a*t)/sc, 200)
        R['WA'][name]['rows'][a] = r
    print('WA %-12s U_F %.3f minA %.1e | ' % (name, UF, A.min()) + ' | '.join(
        'a=%g: ' % a + ' '.join('%.4f' % R['WA'][name]['rows'][a][d][0] for d in (4, 16, 64, 200)) + ' full200 %.4f' % R['WA'][name]['rows'][a][200][2]
        for a in (0.05, 0.5, 2.0, 20.0)), flush=True)
json.dump(R, open(out, 'w'))
