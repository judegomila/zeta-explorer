"""E_a = zeta(s+a) zeta(s-a) on the critical line (float64, CPU).  F(1/2+it) = chi(1/2-a+it) |zeta(1/2+a+it)|^2,
zeta(1/2+a+it) = S1 + chi(1/2+a+it) conj(S2), S1 = sum n^(-1/2-a-it) V, S2 = sum n^(-1/2+a-it) V (same smoothed cutoff V as hole.py),
chi(1/2+-a+it) = (t/2pi)^(-+a) e^(-2 i theta(t)) (1 + O(1/t)).  Mollifier M = M_y(s+a) M_y(s-a), M_y = sum mu(n)(1-log n/log y) n^-s.
usage: ea_line.py a T0 NWIN out.json"""
import sys, math, json, os, numpy as np, mpmath as mp
os.environ['HOLE_GPU'] = '0'
import hole
from scipy.special import erfc
a = float(sys.argv[1]); T0s = sys.argv[2]; nwin = int(sys.argv[3]); out = sys.argv[4]
T0 = float(T0s); A = 0.01; pps = 10; q = 1
d, hs, npw = hole.grid(T0, nwin, q, pps)
Lmax = 2 * math.sqrt(A) * 4.6; ncut = int(math.sqrt((T0 + d[-1]) / (2 * math.pi)) * math.exp(Lmax)) + 2
ys = [int(round(T0 ** th)) for th in (0.25, 0.5)]; nmax = max(ncut, max(ys))
print(f"# E_a a={a} T0={T0:.1e} windows={nwin} points={len(d)} nmax={nmax}; planned chunk memory {3*8*200*nmax/1e6:.0f} MB", flush=True)
ph, spf = hole.phase_table(T0s, nmax); th0 = hole.theta0(T0s, 1, 0)
n = np.arange(1, nmax + 1, dtype=np.float64); logn = np.log(n); mu = hole.inverse_coeffs(np.array([1.0]), nmax)[1:]
W = np.zeros((nmax, 4))
for i, y in enumerate(ys):
    w = mu[:y] * (1 - logn[:y] / math.log(y))
    W[:y, 2 * i] = w * n[:y] ** (-0.5 - a); W[:y, 2 * i + 1] = w * n[:y] ** (-0.5 + a)
Zp = np.empty(len(d)); FM = np.empty((len(d), 2), dtype=np.complex128); zc = np.empty(len(d), dtype=np.complex128)
ch = 200
for i0 in range(0, len(d), ch):
    dd = d[i0:i0 + ch]; t = T0 + dd
    P = (-dd)[:, None] * logn[None, :ncut] + ph[None, 1:ncut + 1]; E = np.cos(P) + 1j * np.sin(P)
    V = 0.5 * erfc((logn[:ncut] - 0.5 * math.log(t.mean() / (2 * math.pi))) / (2 * math.sqrt(A)))
    S1 = E @ (V * n[:ncut] ** (-0.5 - a)); S2 = E @ (V * n[:ncut] ** (-0.5 + a))
    th = th0 + hole.dtheta(T0, dd, 1); e2 = np.exp(-2j * th); ta = (t / (2 * math.pi)) ** a
    z = S1 + e2 / ta * np.conj(S2)                    # zeta(1/2+a+it)
    zc[i0:i0 + ch] = z; Zp[i0:i0 + ch] = ta * np.abs(z) ** 2
    zm = ta * e2 * np.conj(z)                          # zeta(1/2-a+it)
    Pm = (-dd)[:, None] * logn[None, :] + ph[None, 1:]; Em = np.cos(Pm) + 1j * np.sin(Pm); Mv = Em @ W
    for j in range(2): FM[i0:i0 + ch, j] = z * Mv[:, 2 * j] * zm * Mv[:, 2 * j + 1]
# check against mpmath
mp.mp.dps = 25; errs = []
for i in np.linspace(0, len(d) - 1, 9).astype(int):
    ex = complex(mp.zeta(mp.mpf(0.5) + a + 1j * (mp.mpf(T0s) + mp.mpf(float(d[i]))))); errs.append(abs(ex - zc[i]))
res = dict(a=a, T0=T0, windows=nwin, points=len(d), max_err_zeta_offline=float(max(errs)), min_absF=float(Zp.min()), rms_absF=float(math.sqrt((Zp ** 2).mean())), mean_absF=float(Zp.mean()), max_absF=float(Zp.max()))
i = np.arange(1, len(d) - 1); lm = i[(Zp[i] < Zp[i - 1]) & (Zp[i] < Zp[i + 1])]
res.update(sign_changes=0, local_minima=int(len(lm)), local_minima_per_spacing=len(lm) / (len(d) / pps), median_minimum_over_mean=float(np.median(Zp[lm]) / Zp.mean()),
           min_minimum_over_mean=float(Zp[lm].min() / Zp.mean()))
def longest(mask):
    dm = np.diff(np.r_[0, mask.astype(np.int8), 0]); s = np.nonzero(dm == 1)[0]; e = np.nonzero(dm == -1)[0]
    return (e - s).max() / pps if len(s) else 0.0
mo = []
for j, th in enumerate((0.25, 0.5)):
    re = FM[:, j].real
    mo.append(dict(theta=th, y=ys[j], mean_absFM2=float((np.abs(FM[:, j]) ** 2).mean()), frac_ReFM_pos=float((re > 0).mean()), longest_run_ReFM_pos_spacings=float(longest(re > 0))))
res['moll'] = mo
m = 7 * pps; nw = len(d) // m; Zw = Zp[:nw * m].reshape(nw, m)
res['win7_max_over_rms_median'] = float(np.median(Zw.max(1)) / res['rms_absF']); res['win7_max_over_rms_max'] = float(Zw.max() / res['rms_absF'])
json.dump(res, open(out, 'w'), indent=1); print(json.dumps(res))
