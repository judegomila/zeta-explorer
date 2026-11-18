# c2-euler-at-zeros-scale: shared routines (written independently for this lane)
import os, math, numpy as np
NW = int(os.environ.get('RH_WORKERS', '4'))
CPS = [10, 100, 1000, 10000, 100000]
KSH = 16  # shifts k/16 of the local mean spacing, k = 0 is the zero itself

def sieve(P):
    s = np.ones(P + 1, dtype=bool); s[:2] = False
    for i in range(2, int(P ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.float64)

PR = sieve(CPS[-1])
CPI = [int(np.searchsorted(PR, P, side='right')) for P in CPS]  # prime counts at checkpoints

def cumlog(sig, t, eps, chunk=128):
    """complex log prod_{p<=P} (1 - eps_p p^{-(sig+it)})^{-1} at the checkpoints; sig scalar or array, t array.
    returns complex array (len(CPS), N)"""
    N = len(t); out = np.zeros((len(CPS), N), dtype=np.complex128); acc = np.zeros(N, dtype=np.complex128)
    sig = np.broadcast_to(np.asarray(sig, dtype=np.float64), (N,))
    a = 0
    for ci, b in enumerate(CPI):
        while a < b:
            e = min(a + chunk, b); lp = np.log(PR[a:e])
            ph = np.exp(-np.outer(sig, lp) - 1j * np.outer(t, lp)) * eps[a:e][None, :]
            acc -= np.log1p(-ph).sum(axis=1); a = e
        out[ci] = acc
    return out

def shifts_spacing(gam, q=1.0):
    return 2 * math.pi / np.log(q * gam / (2 * math.pi))

def win_stats(X, LA, gam, wsize, pred_fn, Mref):
    """X: (KSH, N) values |.|^2 ; LA: log values; windows of wsize zeros. returns dict of per-window arrays"""
    N = X.shape[1]; nw = N // wsize; rows = []
    for w in range(nw):
        sl = slice(w * wsize, (w + 1) * wsize)
        A = X[:, sl].sum(axis=1); U = A.mean(); g = gam[sl]
        hw = np.sin(math.pi * (np.arange(wsize) + 0.5) / wsize) ** 2
        Ah = (X[:, sl] * hw[None, :]).sum(axis=1)
        Tm = 0.5 * (g[0] + g[-1])
        rows.append(dict(T0=float(g[0]), T1=float(g[-1]), RU=float(A[0] / U), Rhalf=float(A[0] / A[KSH // 2]),
                         Rref=float(A[0] / (wsize * Mref)) if Mref else None, Uref=float(U / (wsize * Mref)) if Mref else None,
                         RUhann=float(Ah[0] / Ah.mean()),
                         G=float(LA[0, sl].mean() - LA[:, sl].mean()),
                         pred=pred_fn(Tm) if pred_fn else None))
    return rows

def summarize(rows, key):
    v = np.array([r[key] for r in rows if r[key] is not None], dtype=float)
    if len(v) == 0: return None
    return dict(n=len(v), mean=float(v.mean()), min=float(v.min()), max=float(v.max()), sd=float(v.std(ddof=1)) if len(v) > 1 else 0.0)
