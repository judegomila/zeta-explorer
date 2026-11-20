"""Combination 2, zero side: S2 = (1/N) sum_{gamma, gamma'} r(x - x'), r = (Phi_w / Phi_w(0))^2, x unfolded,
for w* = cos(sqrt2 s) (C* = 1.3274993), the box (4/3) and the J = 4 cosine window used on the prime side.
All pairs at distance < R are summed; the rest is 2 int_R^inf r(x) dx (pair density 1).
Usage: c2_pair.py OUT.json NAME [nmax] [R] [chunks]"""
import sys, math, json, time, numpy as np
import lists, gw
PI = math.pi; B2 = math.sqrt(2)

def phi_star(x):
    a = 2 * PI * x
    with np.errstate(divide='ignore', invalid='ignore'):
        v = np.sin((a + B2) / 2) / (a + B2) + np.sin((a - B2) / 2) / (a - B2)
    return v / (2 * math.sin(B2 / 2) / B2)

def phi_box(x): return np.sinc(x)

def make_phi_J(q):
    J = len(q) - 1
    # w = p^2, p = q0 + 2 sum q_j cos(2 pi j s): w = sum_k W_k e^{2 pi i k s}; Phi_w(x) = sum_k W_k sinc(x - k)
    full = np.concatenate([q[:0:-1], q])
    Wk = np.convolve(full, full)          # index k from -2J..2J
    ks = np.arange(-2 * J, 2 * J + 1)
    def f(x):
        out = np.zeros_like(x)
        for k, c in zip(ks, Wk): out += c * np.sinc(x - k)
        return out / Wk[2 * J]
    return f

def tail(phi, R, upto=2.0e5, h=0.01):
    x = np.arange(R + h / 2, upto, h)
    v = 2 * float((phi(x) ** 2).sum()) * h
    return v, x[-1] + h / 2

def main():
    out, name = sys.argv[1], sys.argv[2]
    nmax = int(float(sys.argv[3])) if len(sys.argv) > 3 else 5_000_000
    R = float(sys.argv[4]) if len(sys.argv) > 4 else 1000.0
    nch = int(sys.argv[5]) if len(sys.argv) > 5 else 20
    d = lists.load(name); x = d['x']; t = d['t']
    if len(x) > nmax: x = x[:nmax]; t = t[:nmax]
    q4, Cw4, Cs = gw.mt_window(4)
    kern = {'star': phi_star, 'box': phi_box}     # the J = 4 kernel (17 sinc terms per pair) is used on the prime side only; C(w_J4) - C* = 2e-5
    tails = {}
    for k, f in kern.items():
        v, up = tail(f, R)
        A2 = {'star': (B2 * math.cos(B2 / 2) / (2 * math.sin(B2 / 2))) ** 2, 'box': 1.0}.get(k, None)
        # beyond 'up': r ~ A^2 sin^2(pi x)/(pi x)^2 -> 2 * A^2 / (2 pi^2 up)
        if A2 is None: A2 = float(np.mean((f(np.arange(up, up + 50, 0.01)) * PI * np.arange(up, up + 50, 0.01)) ** 2)) * 2
        tails[k] = v + A2 / (PI ** 2 * up)
    n = len(x); K = int(R + 60)
    N0 = n - K - 1
    edges = np.linspace(0, N0, nch + 1).astype(int)
    acc = {k: np.zeros(nch) for k in kern}
    t0 = time.time(); maxlagdist = 0.0
    for lag in range(1, K + 1):
        dd = x[lag:lag + N0] - x[:N0]
        m = dd < R
        if lag == K: maxlagdist = float(dd.min())
        if not m.any(): break
        for k, f in kern.items():
            v = np.where(m, f(dd) ** 2, 0.0)
            acc[k] += np.add.reduceat(v, edges[:-1])
    cnt = np.diff(edges)
    res = dict(name=name, n=n, N0=int(N0), R=R, K=K, T_lo=float(t[0]), T_hi=float(t[-1]), L=float(np.log(d['q'] * np.median(t) / (2 * PI))), min_dist_at_last_lag=maxlagdist,
               C_star=Cs, C_J4=Cw4, tails=tails, time_s=time.time() - t0)
    for k in kern:
        per = 1 + 2 * acc[k] / cnt + tails[k]
        tot = 1 + 2 * acc[k].sum() / cnt.sum() + tails[k]
        res[k] = dict(S2=float(tot), err=float(per.std(ddof=1) / math.sqrt(nch)), chunks=per.tolist())
    print(json.dumps({k: res[k] if k not in kern else dict(S2=res[k]['S2'], err=res[k]['err']) for k in res}), flush=True)
    json.dump(res, open(out, 'w'))

if __name__ == '__main__':
    main()
