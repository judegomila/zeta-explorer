"""Local (t <= 1e6): Gabcke-corrected half-sum, close pairs, DH off-line zeros. float64 + mpmath checks."""
import numpy as np, math, json, mpmath as mp
from scipy.special import loggamma
from scipy.interpolate import CubicSpline
from rslib import refined_darg, wrap, KAPPA, TWO_PI
out = {}
# ---- Gabcke C0, C1 tables
mp.mp.dps = 40
def Psi(p):
    p = mp.mpf(p); return mp.cos(2 * mp.pi * (p * p - p - mp.mpf(1) / 16)) / mp.cos(2 * mp.pi * p)
pg = np.linspace(0, 1, 2001) + 1.3e-7   # offset avoids the removable points 1/4, 3/4
C0t = np.array([float(Psi(p)) for p in pg]); C1t = np.array([float(-mp.diff(Psi, p, 3) / (96 * mp.pi ** 2)) for p in pg])
C0s, C1s = CubicSpline(pg, C0t), CubicSpline(pg, C1t)
def theta(t): return loggamma(0.25 + 0.5j * t).imag - 0.5 * t * math.log(math.pi)
def halfsum(t, N, lines=(0.0,)):
    ln = np.log(np.arange(1, N + 1)); E = np.exp(-1j * np.outer(t, ln)); c = np.arange(1, N + 1) ** -0.5
    return E @ c, E @ (c * ln)
def R(t, N):
    a = np.sqrt(t / TWO_PI); p = a - N
    return (-1) ** (N - 1) * a ** -0.5 * (C0s(p) + C1s(p) / a)
def fc_fn(N):
    def g(t):
        F, _ = halfsum(t, N); return np.exp(1j * theta(t)) * F + 0.5 * R(t, N)
    return g
def f_fn(N):
    def g(t):
        F, _ = halfsum(t, N); return np.exp(1j * theta(t)) * F
    return g
# check against mpmath siegelz
chk = []
for t in (7005.08, 12345.678, 99999.5, 500000.25):
    N = int(math.sqrt(t / TWO_PI)); tt = np.array([t])
    z0 = 2 * f_fn(N)(tt).real[0]; zc = 2 * fc_fn(N)(tt).real[0]; zt = float(mp.siegelz(t))
    chk.append(dict(t=t, Z=zt, err_main=z0 - zt, err_C0C1=zc - zt))
out['siegelz_check'] = chk; print(chk)
# ---- (c) Gabcke: phase statistics of f and f_c in matched windows
gab = []
for T0, H in ((10000.0, 2000.0), (100000.0, 2000.0), (1000000.0, 2000.0)):
    a = T0; tot = dict(T0=T0, H=H, fracneg_f=0.0, fracneg_fc=0.0, dW=0.0, Wf=0.0, npts=0, unres=0)
    while a < T0 + H - 1e-9:
        N = int(math.sqrt((a + 1e-7) / TWO_PI)); b = min(T0 + H, TWO_PI * (N + 1) ** 2)
        t = np.linspace(a, b - 1e-9, int((b - a) * 24) + 2)
        f = f_fn(N)(t); fc = fc_fn(N)(t)
        F, G = halfsum(t, N); thp = 0.5 * np.log(t / TWO_PI)
        D = thp - (G / F).real
        # corrected derivative: f_c' = i e^{i theta} sum (thp - log n) n^-s + R'/2
        h = 1e-4; Rp = (R(t + h, N) - R(t - h, N)) / (2 * h)
        fcp = 1j * np.exp(1j * theta(t)) * (thp * F - G) + 0.5 * Rp
        Dc = (fcp / fc).imag
        Wf, u1 = refined_darg(t, f, f_fn(N)); Wc, u2 = refined_darg(t, fc, fc_fn(N))
        tot['fracneg_f'] += (D < 0).sum(); tot['fracneg_fc'] += (Dc < 0).sum(); tot['npts'] += t.size
        tot['dW'] += (Wc - Wf); tot['Wf'] += Wf; tot['unres'] += u1 + u2; a = b
    tot['fracneg_f'] /= tot['npts']; tot['fracneg_fc'] /= tot['npts']
    tot['mean_rate_f'] = tot['Wf'] / H; tot['mean_rate_fc'] = (tot['Wf'] + tot['dW']) / H
    tot['change_in_right_count'] = -tot['dW'] / TWO_PI   # zeros of f_c in Im t < 0 (Re s > 1/2) minus those of f, per window (edge terms neglected)
    gab.append(tot); print(tot)
out['gabcke'] = gab
# ---- close pairs of Z below 1e5 (corrected main sum; grid 0.01)
pairs = []
a = 1000.0
while a < 1e5:
    N = int(math.sqrt((a + 1e-7) / TWO_PI)); b = min(1e5, TWO_PI * (N + 1) ** 2)
    t = np.arange(a, b, 0.01); Z = np.empty(t.size)
    for i in range(0, t.size, 200000): Z[i:i + 200000] = 2 * fc_fn(N)(t[i:i + 200000]).real
    zc = np.nonzero(Z[:-1] * Z[1:] < 0)[0]
    z = t[zc] - Z[zc] * 0.01 / (Z[zc + 1] - Z[zc])
    dens = math.log(a / TWO_PI) / TWO_PI
    for g0, g1 in zip(z[:-1], z[1:]):
        if (g1 - g0) * dens < 0.12: pairs.append((float((g1 - g0) * dens), float(g0), float(g1), N))
    # pairs inside one grid cell: local extremum toward zero with no sign change
    i = np.nonzero((np.abs(Z[1:-1]) < np.abs(Z[:-2])) & (np.abs(Z[1:-1]) < np.abs(Z[2:])) & (Z[:-2] * Z[1:-1] > 0) & (Z[1:-1] * Z[2:] > 0) & (np.abs(Z[1:-1]) < 0.02))[0] + 1
    for j in i:
        y0, y1, y2 = Z[j - 1], Z[j], Z[j + 1]; cc = (y0 - 2 * y1 + y2) / 2; bb = (y2 - y0) / 2
        tv = t[j] - 0.01 * bb / (2 * cc); zv = 2 * fc_fn(N)(np.array([tv])).real[0]
        if zv * y1 < 0:
            hw = 0.01 * math.sqrt(abs(zv / cc)) if cc != 0 else 0
            pairs.append((float(2 * hw * dens), float(tv - hw), float(tv + hw), N))
    a = b
pairs.sort(); out['close_pairs'] = pairs[:8]; print('close pairs (normalised gap, g, g\', N):', pairs[:8])
# zeros of F_N near each close pair, by Newton on a local grid
def FN(s, N):
    ln = np.log(np.arange(1, N + 1)); E = np.exp(-np.outer(s, ln)); return E @ np.ones(N), -(E @ ln)
cp_rows = []
for gap, g0, g1, N in pairs[:6]:
    tm = 0.5 * (g0 + g1); L = math.log(N)
    S = np.array([complex(0.5 + x, tm + y) for x in np.linspace(-2.5 / L, 2.5 / L, 21) for y in np.linspace(-1.2, 1.2, 97)])
    for it in range(30):
        F, Fp = FN(S, N); d = F / Fp; big = np.abs(d) > 0.3 / L; d[big] *= 0.3 / L / np.abs(d[big]); S = S - d
    F, Fp = FN(S, N); ok = np.abs(F / Fp) < 1e-11; Z = np.unique(np.round(S[ok], 8))
    Z = Z[(np.abs(Z.imag - tm) < 1.0)]
    tt = np.linspace(g0 - 0.3, g1 + 0.3, 4001); F, G = halfsum(tt, N); thp = 0.5 * np.log(tt / TWO_PI); D = thp - (G / F).real
    h = 1e-4; Rp = (R(tt + h, N) - R(tt - h, N)) / (2 * h); fc = fc_fn(N)(tt)
    Dc = ((1j * np.exp(1j * theta(tt)) * (thp * F - G) + 0.5 * Rp) / fc).imag
    cp_rows.append(dict(g0=g0, g1=g1, norm_gap=gap, N=N, zeros_FN_within_1=[[float(z.real - 0.5), float(z.imag)] for z in Z],
                        n_right=int((Z.real > 0.5).sum()), min_D=float(D.min()), min_Dc=float(Dc.min()),
                        frac_D_neg_local=float((D < 0).mean())))
    print(cp_rows[-1])
out['close_pair_rows'] = cp_rows
# ---- DH: functional equation, RS form, and the Hermite-Biehler inequality at off-line zeros
mp.mp.dps = 30
kap = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
def fdh(s): return 5 ** (-s) * (mp.zeta(s, mp.mpf(1) / 5) + kap * mp.zeta(s, mp.mpf(2) / 5) - kap * mp.zeta(s, mp.mpf(3) / 5) - mp.zeta(s, mp.mpf(4) / 5))
def X(s): return 5 ** (mp.mpf(1) / 2 - s) * 2 * (2 * mp.pi) ** (s - 1) * mp.gamma(1 - s) * mp.cos(mp.pi * s / 2)
s = mp.mpc(0.7, 50.3); out['dh_fe_residual'] = float(abs(fdh(s) - X(s) * fdh(1 - s))); print('DH FE residual', out['dh_fe_residual'])
acoef = [0, 1, kap, -kap, -1]
def FNdh(s, N): return mp.fsum(acoef[n % 5] * mp.mpf(n) ** (-s) for n in range(1, N + 1) if n % 5)
off = json.load(open('../c2-euler-at-zeros/dh_zeros_1000.json'))['offline']
rows = []
for sig, t in off:
    rho = mp.findroot(fdh, mp.mpc(sig, t)); N = int(mp.floor(mp.sqrt(5 * rho.imag / (2 * mp.pi))))
    A = FNdh(rho, N); B = X(rho) * FNdh(1 - rho, N)
    # minimum of |F|/|X F~| on a small disc about rho
    best = (float(abs(A) / abs(B)), 0.0, 0.0)
    for rr in (0.02, 0.05, 0.1):
        for k in range(16):
            z = rho + rr * mp.expjpi(k / 8.0); r = float(abs(FNdh(z, N)) / abs(X(z) * FNdh(1 - z, N)))
            if r < best[0]: best = (r, float(z.real), float(z.imag))
    rows.append(dict(sigma=float(rho.real), t=float(rho.imag), N=N, ratio_at_rho=float(abs(A) / abs(B)), remainder=float(abs(A + B)), absF=float(abs(A)), min_ratio_disc=best))
    print(rows[-1])
out['dh_offline'] = rows
json.dump(out, open('local_extra.json', 'w'), indent=1)
