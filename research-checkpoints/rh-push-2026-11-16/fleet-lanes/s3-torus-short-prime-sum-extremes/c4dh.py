"""Combination 4, Davenport-Heilbronn with its full log-derivative coefficients, and two known-answer checks.

(a) zeta, P <= Pz: V(phi) = Re R - Re Pole - beta against -(L/2) sum_gamma sinc^2((gamma - phi) L / 2) from mpmath zeros.
(b) DH: V_DH(phi; P) = Re sum_{n<=P} Lambda_DH(n) n^(-1/2) (1 - log n / L) e^{-i phi log n} - beta_chi(phi) on phi in [0, phimax];
    predicted contribution of each off-line pair 1/2 +- d + i g:  -Re[L h((d + i(g - phi)) L)] - Re[L h((-d + i(g - phi)) L)].
    Reported: where V_DH > 0, the distance to the nearest off-line zero, and the residual V_DH - (off-line prediction) <= 0.
"""
import sys, math, json, time, argparse, os
import numpy as np, mpmath as mp
import torus as T, s3lib as S
from torus import xp, GPU, asnp

ap = argparse.ArgumentParser()
ap.add_argument('--N', type=float, default=1e6)
ap.add_argument('--checks', default='1e3,1e4,1e5,1e6')
ap.add_argument('--phimax', type=float, default=400)
ap.add_argument('--dphi', type=float, default=0.01)
ap.add_argument('--zeros', default='dh_offline_zeros.json')
ap.add_argument('--nzeta', type=int, default=120)
ap.add_argument('--out', default='c4dh.json')
a = ap.parse_args()
t00 = time.time()
N = int(a.N); CH = [int(float(x)) for x in a.checks.split(',')]
M = 2 * int(round(a.phimax / a.dphi)); nf = 1 << int(math.ceil(math.log2(3 * M)))
kpos = np.arange(M // 2, M)
phi = np.arange(0, M // 2) * a.dphi


def hL(z, L):
    return (np.exp(z * L) - 1 - z * L) / (z * z * L)


def beta(phi, L, kind):
    from scipy.special import digamma, polygamma
    z = (0.5 + 1j * phi) / 2 + 1 if kind == 'zeta' else (0.5 + 1j * phi + 1) / 2
    c = -0.5 * math.log(math.pi) if kind == 'zeta' else 0.5 * math.log(5 / math.pi)
    # psi' for complex argument: asymptotic after shift
    acc1 = np.zeros_like(z); zz = z.copy()
    for _ in range(8):
        acc1 += 1 / (zz * zz); zz = zz + 1
    zi = 1 / zz
    psi1 = zi + zi ** 2 / 2 + zi ** 3 / 6 - zi ** 5 / 30 + acc1
    return digamma(z).real / 2 + c + psi1.real / (4 * L)


def fejer_sum(lam, P):
    """R(phi; P) on the phi grid for coefficients lam[n] (real, n <= P)."""
    L = math.log(P)
    n = np.nonzero(lam[:P + 1])[0]
    n = n[n >= 2]
    ln = np.log(n)
    c = lam[n] * n ** -0.5
    SP = S.Spreader(2, nf, M, w=12)
    for i in range(0, len(n), 5_000_000):
        sl = slice(i, i + 5_000_000)
        SP.add(xp.asarray(ln[sl] * a.dphi), xp.asarray(np.stack([c[sl], c[sl] * ln[sl]])))
    R = asnp(SP.transform(0))[kpos] - asnp(SP.transform(1))[kpos] / L
    return R, L


res = dict(meta=dict(vars(a)))
# (a) zeta check
mp.mp.dps = 20
Pz = min(N, 10 ** 6)
lam = T.mangoldt(Pz)
R, L = fejer_sum(lam, Pz)
V = R.real - hL(0.5 - 1j * phi, L).real - beta(phi, L, 'zeta')
gam = np.array([float(mp.im(mp.zetazero(k))) for k in range(1, a.nzeta + 1)])
sel = (phi > 1) & (phi < gam[-1] * 0.5)
pred = np.zeros(len(phi))
for g in np.concatenate([gam, -gam]):
    x = (g - phi) * L / 2
    pred -= (L / 2) * np.sinc(x / math.pi) ** 2
res['zeta_check'] = dict(P=Pz, zeros=a.nzeta, phi_range=[1, float(gam[-1] * 0.5)], max_abs_diff=float(np.abs(V - pred)[sel].max()), maxV=float(V[sel].max()), minV=float(V[sel].min()),
                         trough_at_first_zero=float(V[int(round(gam[0] / a.dphi))]), half_L=L / 2)
print('zeta check', res['zeta_check'], flush=True)
# (b) DH
lamD = T.log_derivative_coeffs(T.dh_coeffs(N).astype(float))
print(f'DH coefficients to {N}: {time.time() - t00:.0f}s; max |Lambda_DH(n)| n^-1/2 = {np.abs(lamD[2:] * np.arange(2, N + 1) ** -0.5).max():.3f}', flush=True)
Z = json.load(open(a.zeros)); Z = [(z['beta'] - 0.5, z['gamma']) for z in Z if z['beta']]
gz = np.array([g for d, g in Z])
res['offline'] = Z
rows = []
for P in CH:
    R, L = fejer_sum(lamD, P)
    V = R.real - beta(phi, L, 'chi')
    leak = np.zeros(len(phi))
    for d, g in Z:
        for dd in (d, -d):
            leak -= hL(dd + 1j * (g - phi), L).real
    ok = (phi > 0.5) & (phi < gz[-1] - 20)
    dist = np.min(np.abs(phi[:, None] - gz[None, :]), axis=1)
    pos = ok & (V > 0)
    resid = V - leak
    low = (phi > 0.5) & (phi <= gz[0] / 4)
    row = dict(P=P, L=L, maxV=float(V[ok].max()), argmax=float(phi[ok][V[ok].argmax()]), frac_pos=float(pos.sum() / ok.sum()),
               max_dist_of_violation=float(dist[pos].max()) if pos.any() else None,
               maxV_low=float(V[low].max()), low_window=[0.5, float(gz[0] / 4)], violations_low=int((V[low] > 0).sum()),
               max_resid=float(resid[ok].max()), max_leak=float(leak[ok].max()), leak_max_low=float(np.abs(leak[low]).max()),
               pred_first=float(math.exp(Z[0][0] * L) / ((Z[0][0] ** 2 + (gz[0] * 0.75) ** 2) * L)))
    rows.append(row)
    print(json.dumps({k: (round(v, 5) if isinstance(v, float) else v) for k, v in row.items()}), flush=True)
res['dh'] = rows
json.dump(res, open(a.out, 'w'), indent=1)
print('done', f'{time.time() - t00:.0f}s')
