"""Euler / ladder Hermite-Biehler truncations.
Phi_{P,N}(s) = A(s) + A(1-s),  A(s) = gamma(s) * E_{P,N}(s),
zeta:  gamma(s) = pi^{-s/2} Gamma(s/2),  E = prod_{p<=P} sum_{k<=N} p^{-ks}
DH:    gamma(s) = (5/pi)^{s/2} Gamma((s+1)/2),
       E = c1 prod_p sum_k (chi(p) p^{-s})^k + c2 prod_p sum_k (conj chi(p) p^{-s})^k
Counts zeros in boxes |sigma-1/2|<W, T_j<t<T_{j+1} by the argument principle and
zeros on the line by sign changes; off-line = total - on-line.
Float64 (numpy/scipy); not interval arithmetic.
"""
import sys, json, math
import numpy as np
from scipy.special import loggamma

PR = [2, 3, 5, 7, 11, 13, 17, 19, 23]
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
C1 = (1 - 1j * KAPPA) / 2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}

def lg(s, kind):
    if kind == 'zeta':
        return loggamma(s / 2) - (s / 2) * math.log(math.pi)
    if kind == 'ea':      # E_a = zeta(s+a) zeta(s-a), a = 0.3
        return lg(s + 0.3, 'zeta') + lg(s - 0.3, 'zeta')
    return loggamma((s + 1) / 2) + (s / 2) * math.log(5 / math.pi)

def E(s, kind, P, N):
    if kind == 'ea':
        return E(s + 0.3, 'zeta', P, N) * E(s - 0.3, 'zeta', P, N)
    if kind == 'zeta':
        out = np.ones_like(s)
        for p in PR:
            if p > P: break
            z = np.exp(-s * math.log(p)); f = np.ones_like(s); zz = np.ones_like(s)
            for k in range(N):
                zz = zz * z; f = f + zz
            out = out * f
        return out
    a = np.ones_like(s); b = np.ones_like(s)
    for p in PR:
        if p > P: break
        if p == 5: continue
        z = np.exp(-s * math.log(p)); c = CHI[p % 5]
        fa = np.ones_like(s); fb = np.ones_like(s); za = np.ones_like(s); zb = np.ones_like(s)
        for k in range(N):
            za = za * (c * z); zb = zb * (np.conj(c) * z); fa = fa + za; fb = fb + zb
        a = a * fa; b = b * fb
    return C1 * a + np.conj(C1) * b

def Phi_scaled(s, kind, P, N):
    a = lg(s, kind); b = lg(1 - s, kind)
    m = np.maximum(a.real, b.real)
    return np.exp(a - m) * E(s, kind, P, N) + np.exp(b - m) * E(1 - s, kind, P, N)

def dphase(vals):
    r = vals[1:] / vals[:-1]
    return np.angle(r)

def online_count(kind, P, N, ta, tb, dt):
    n = int((tb - ta) / dt) + 1
    t = np.linspace(ta, tb, n)
    s = 0.5 + 1j * t
    a = lg(s, kind)
    Z = (np.exp(1j * a.imag) * E(s, kind, P, N)).real
    sg = np.sign(Z)
    return int(np.sum(sg[1:] * sg[:-1] < 0))

def run(kind, P, N, T0, T1, win, W=1.5, dt=0.004):
    edges = np.arange(T0, T1 + 1e-9, win)
    rows = []
    def hor(T):
        x = np.linspace(0.5 - W, 0.5 + W, 6001)
        v = Phi_scaled(x + 1j * T, kind, P, N)
        return float(np.sum(dphase(v)))          # left -> right
    hprev = hor(edges[0])
    for j in range(len(edges) - 1):
        ta, tb = edges[j], edges[j + 1]
        def edge(sig):
            n = int((tb - ta) / dt) + 1
            t = np.linspace(ta, tb, n)
            for it in range(14):
                v = Phi_scaled(sig + 1j * t, kind, P, N)
                d = dphase(v)
                bad = np.where(np.abs(d) > 0.4)[0]
                if len(bad) == 0: break
                ins = np.concatenate([np.linspace(t[i], t[i + 1], 10)[1:-1] for i in bad])
                t = np.sort(np.concatenate([t, ins]))
            return d
        dr = edge(0.5 + W); dl = edge(0.5 - W)
        maxstep = float(max(np.max(np.abs(dr)), np.max(np.abs(dl))))
        hnext = hor(tb)
        wind = (hprev + float(np.sum(dr)) - hnext - float(np.sum(dl))) / (2 * math.pi)
        tot = int(round(wind))
        on = online_count(kind, P, N, ta, tb, dt / 4)
        if tot - on != 0:
            on = online_count(kind, P, N, ta, tb, dt / 80)
        rows.append((float(ta), float(tb), tot, on, tot - on, round(wind - tot, 4), round(maxstep, 3)))
        hprev = hnext
    return rows

def thresholds(P, N):
    """zeta: sup over torus of log|E(1-s)/E(s)| / x on 0<x<=1/2 (strip) and x<=W"""
    xs = np.linspace(1e-4, 1.5, 3000)
    logR = np.zeros_like(xs)
    for p in PR:
        if p > P: break
        th = np.linspace(0, 2 * math.pi, 2001)
        z1 = np.exp(-(0.5 - xs[:, None]) * math.log(p) + 1j * th[None, :])   # p^{-(1-s)} modulus p^{x-1/2}
        z0 = np.exp(-(0.5 + xs[:, None]) * math.log(p) + 1j * th[None, :])
        f1 = sum(z1 ** k for k in range(N + 1)); f0 = sum(z0 ** k for k in range(N + 1))
        logR += np.max(np.log(np.abs(f1) / np.abs(f0)), axis=1)
    q = logR / xs
    strip = xs <= 0.5
    return float(2 * math.pi * math.exp(np.max(q[strip]))), float(2 * math.pi * math.exp(np.max(q)))

if __name__ == '__main__':
    out = {}
    cfg = json.loads(sys.argv[1])
    for (kind, P, N, T0, T1, win, W) in cfg:
        rows = run(kind, P, N, T0, T1, win, W=W)
        tot = sum(r[2] for r in rows); on = sum(r[3] for r in rows); off = tot - on
        offw = [r for r in rows if r[4] != 0]
        last = offw[-1][1] if offw else None
        thr = thresholds(P, N) if kind == 'zeta' else None
        bad = max(abs(r[5]) for r in rows); ms = max(r[6] for r in rows)
        key = f"{kind} P={P} N={N} W={W} t in [{T0},{T1}]"
        out[key] = dict(total=tot, online=on, offline=off, n_windows=len(rows), windows_with_offline=len(offw),
                        last_window_with_offline_end=last, pred_thresholds_strip_W=thr,
                        max_wind_frac=bad, max_phase_step=ms,
                        offline_by_window=[(r[0], r[4]) for r in rows])
        print(key, {k: v for k, v in out[key].items() if k != 'offline_by_window'}, flush=True)
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
