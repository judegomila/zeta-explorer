"""Seeds for the off-line zeros of the Davenport-Heilbronn function below TMAX from the complex continuation of the
windowed-sinc interpolant of Z_DH(t) = Z_chi + Z_chibar (samples of lane s1-zero-flow-dynamics, read as data).
A zero of Z at t = gamma - i x corresponds to s = 1/2 + x + i gamma.  float64; seeds only (refined in balls by run.py).
Usage: dh_seeds.py SAMPLES.npz ONLINE.npy TMAX OUT.npz"""
import sys, math, json, numpy as np
import mpmath
smp = np.load(sys.argv[1]); on = np.load(sys.argv[2]); TMAX = float(sys.argv[3])
h = float(smp['h']); S = smp['Z1'] + smp['Z2'] if bool(smp['dh_plus']) else smp['Z1'] - smp['Z2']
OS = 4; W = 20; b = 0.5 * (1 - 1 / OS); s2 = W / (2 * math.pi * b); k = np.arange(-W + 1, W + 1)
def interp(t):                      # t complex, coarse-index units
    i0 = np.floor(t.real).astype(np.int64); fr = t - i0
    u = fr[:, None] - k[None, :]
    w = np.sinc(u) * np.exp(-u * u / (2 * s2))
    return (S[i0[:, None] + k[None, :]] * w).sum(1)
on = on[on < TMAX]
mid = (on[1:] + on[:-1]) / 2
tgrid = np.arange(W + 2, int(TMAX / h) - 1, 0.5) * h
starts = []
for y0 in (0.06, 0.2, 0.4, 0.62):
    starts.append(tgrid - 1j * y0)
z = np.concatenate(starts) / h
print('starts', len(z), 'planned memory %.2f GB' % (len(z) * 40 * 16 * 3 / 1e9 / 8), flush=True)
out = []
CH = 400000
for a in range(0, len(z), CH):
    zz = z[a:a + CH].copy(); alive = np.ones(len(zz), bool)
    for it in range(40):
        f0 = interp(zz); e = 1e-5
        d = (interp(zz + e) - interp(zz - e)) / (2 * e)
        st = f0 / d
        big = np.abs(st) > 1.5
        st[big] = st[big] / np.abs(st[big]) * 1.5
        zz = zz - st
        bad = (zz.real < W + 2) | (zz.real > len(S) - W - 2) | (np.abs(zz.imag) * h > 1.2)
        zz[bad] = W + 5 + 0j
    f0 = interp(zz); d = (interp(zz + 1e-5) - interp(zz - 1e-5)) / 2e-5
    good = (np.abs(f0 / d) < 1e-9) & (np.abs(zz.imag) * h > 2e-4) & (zz.real > W + 5.5)
    out.append(zz[good] * h)
r = np.concatenate(out); r = r.real + 1j * np.abs(r.imag)
o = np.argsort(r.real); r = r[o]
keep = [0] if len(r) else []
for i in range(1, len(r)):
    if abs(r[i] - r[keep[-1]]) > 1e-6: keep.append(i)
r = r[keep]; r = r[r.real < TMAX]
x = r.imag; g = r.real
print('off-line pairs found below %g: %d ; x range %.4f .. %.4f' % (TMAX, len(r), x.min(), x.max()))
# count check from the phase: N(T) = theta(T)/pi + 1/2-type constant; compare windows
def vartheta(t): return 0.5 * t * math.log(5 / math.pi) + float(mpmath.loggamma(mpmath.mpc(0.75, 0.5 * t)).imag)
edges = np.linspace(on[0] - 0.01, TMAX, 41)
tot = 0
for a, b_ in zip(edges[:-1], edges[1:]):
    ex = (vartheta(b_) - vartheta(a)) / math.pi
    n_on = ((on >= a) & (on < b_)).sum(); n_off = ((g >= a) & (g < b_)).sum()
    tot += ex - n_on - 2 * n_off
    print('  [%9.1f, %9.1f) phase count %9.2f  on %6d  off pairs %5d  phase - on - 2 off = %+6.2f' % (a, b_, ex, n_on, n_off, ex - n_on - 2 * n_off))
print('total difference %.2f' % tot)
np.savez(sys.argv[4], x=x, g=g, on=on)
try:
    d = json.load(open('../c12-control-battery-harness/tables/zeros_DH.json'))
    tab = np.array([[float(a) - 0.5, float(b_)] for a, b_, _ in d['offline']])
    m = g < 2000
    print('battery table: %d pairs below 2000 ; found here %d ; max difference in (x, gamma): %.2e %.2e' % (len(tab), m.sum(), np.abs(np.sort(tab[:, 1]) - g[m]).max() if m.sum() == len(tab) else float('nan'), np.abs(tab[np.argsort(tab[:, 1]), 0] - x[m]).max() if m.sum() == len(tab) else float('nan')))
except Exception as e: print('table check skipped', e)
