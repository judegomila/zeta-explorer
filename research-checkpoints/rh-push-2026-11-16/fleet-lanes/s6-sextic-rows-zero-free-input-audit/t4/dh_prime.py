#!/usr/bin/env python3
"""dh_prime.py -- prime-side statistic for Davenport-Heilbronn: D(q; T) = sum_{n<=N} Lambda_DH(n) (1 - log n/log N) n^{-s}
(Lambda_DH = coefficients of -F'/F, supported on all n coprime to 5), with zeta's sum at the same N as reference.
P_w = (1/2) log(cond T/2 pi) - Re D.   usage: dh_prime.py N outdir Tc"""
import sys, os, math, json, time
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import desc as Dm
QS, SIG, M, MR, MSP, DELTA, TAU, H = Dm.QS, Dm.SIG, Dm.M, Dm.MR, Dm.MSP, Dm.DELTA, Dm.TAU, Dm.H
N = int(float(sys.argv[1])); outdir = sys.argv[2]; Tc = float(sys.argv[3]); os.makedirs(outdir, exist_ok=True); t0 = time.time()
K = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
n = np.arange(N + 1); a = np.array([0.0, 1.0, K, -K, -1.0])[n % 5]
c = a * np.log(np.maximum(n, 1))
for d in range(2, N // 2 + 1):
    if c[d] != 0.0: c[2 * d::d] -= c[d] * a[2:N // d + 1]
nz, pz, kz = Dm.terms(N); lamz = np.zeros(N + 1); lamz[nz] = np.log(pz.astype(float))
print(f"coefficients to {N}: {time.time() - t0:.0f}s", flush=True)
nch = 2 * len(SIG); chunk = 1 << 19
grid = np.zeros((nch, MR + 4 * MSP + 8), complex); OFF = 2 * MSP + 4
twopi = 2 * np.arctan2(np.longdouble(0), np.longdouble(-1))
for s in range(2, N + 1, chunk):
    nn = np.arange(s, min(s + chunk, N + 1))
    om_l = np.log(nn.astype(np.longdouble)); u = np.longdouble(Tc) * om_l / twopi
    fr = (u - np.floor(u)).astype(float); om = om_l.astype(float)
    base = (1 - om / math.log(N)) * np.exp(-2j * np.pi * fr)
    x = DELTA * om; j0 = np.rint(x / H).astype(np.int64); d = x - j0 * H
    W = np.empty((nch, len(nn)), complex)
    for i, sg in enumerate(SIG):
        sq = base * np.exp(-sg * om); W[2 * i] = sq * c[nn]; W[2 * i + 1] = sq * lamz[nn]
    chg = np.flatnonzero(np.diff(j0) != 0); ends = np.concatenate([chg, [len(nn) - 1]]); cells = j0[ends]
    for o in range(-MSP, MSP + 1):
        C = np.cumsum(W * np.exp(-(d - o * H) ** 2 / (4 * TAU)), axis=1); S_ = C[:, ends]; S_[:, 1:] -= C[:, ends[:-1]]
        grid[:, cells + o + OFF] += S_
g = grid[:, OFF:OFF + MR]
Fk = np.fft.fft(g, axis=1); kk = np.concatenate([np.arange(0, M // 2), np.arange(-M // 2, 0)])
D = Fk[:, kk % MR] * (np.exp(kk.astype(float) ** 2 * TAU) * (H / math.sqrt(4 * math.pi * TAU)))
o = np.argsort(kk); D = D[:, o]; kk = kk[o]; T = Tc + DELTA * kk
ok = T > 3; T = T[ok]; D = D[:, ok]
res = {'N': N, 'Tc': Tc, 'rows': {}}
for i, q in enumerate(QS):
    for nm, ch, cond in (('DHprime', 2 * i, 5), ('zeta', 2 * i + 1, 1)):
        Pw = 0.5 * np.log(cond * T / (2 * math.pi)) - D[ch].real; i0 = int(np.argmin(Pw))
        neg = np.flatnonzero(Pw < 0)
        res['rows'][f"{nm}|{q}"] = dict(minP=float(Pw[i0]), T_minP=float(T[i0]), fracP_lt0=float(np.mean(Pw < 0)), first_T_neg=float(T[neg[0]]) if len(neg) else None,
            supAbs=float(np.abs(D[ch]).max()), rms=float(np.sqrt(np.mean(np.abs(D[ch]) ** 2))),
            minP_below80=float(Pw[T < 80].min()) if (T < 80).any() else None, fracneg_below80=float(np.mean(Pw[T < 80] < 0)) if (T < 80).any() else None)
json.dump(res, open(os.path.join(outdir, f"dhprime_{N:.0e}_{Tc:g}.json"), 'w'), indent=0)
for q in (QS[0], QS[3], QS[-1]):
    r = res['rows'][f"DHprime|{q}"]; z = res['rows'][f"zeta|{q}"]
    print(f"q = {q}: DH prime side minP {r['minP']:.2f} at {r['T_minP']:.2f}, frac<0 {r['fracP_lt0']:.4f}, first T with P<0 {r['first_T_neg']}, sup|D| {r['supAbs']:.1f}, rms {r['rms']:.2f}, below 80: min {r['minP_below80']}, frac {r['fracneg_below80']} | zeta minP {z['minP']:.2f}, frac<0 {z['fracP_lt0']:.4f}, sup|D| {z['supAbs']:.1f}, rms {z['rms']:.2f}", flush=True)
print(f"done {time.time() - t0:.0f}s")
