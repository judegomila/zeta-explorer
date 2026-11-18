"""Legendre x Riesz restricted-level certificate LP (exact objective), text-only inputs.

psi_k(X) = sum_{n<=X} Lambda(n) (X-n)^k / k!.           T_k(y) = sum_{m<=y} log m (y-m)^k / k!.
F_k(z)   = sum_{b<=z} (z-b)^k / k!.
Identity (1*Lambda = log, k-fold integrated):  sum_n Lambda(n) n^k F_k(y/n) = T_k(y)   for every real y.
Certificate c on d <= D:  if  phi(n) := sum_d c_d (dn/X)^k F_k(X/(nd)) >= (1-n/X)^k/k!  for 2 <= n <= X
then psi_k(X)/X^k <= sum_d c_d (d/X)^k T_k(X/d)   (uses Lambda >= 0 only; no knowledge of which n are prime powers).
LP-E: minimise the right side.  Dual: max sum_n y_n (1-n/X)^k/k!, y >= 0, y satisfies the D identities.
half=True (k = 0 only): weights n^{-1/2} (reproduces the referee table of e1-forcing-free-bilinear-split).
"""
import numpy as np, math, time, sys
import scipy.sparse as sp
from scipy.optimize import linprog

FACT = [1, 1, 2, 6]

def sieve_lambda(X):
    lam = np.zeros(X + 1)
    is_p = np.ones(X + 1, dtype=bool); is_p[:2] = False
    for p in range(2, int(X ** 0.5) + 1):
        if is_p[p]: is_p[p * p::p] = False
    for p in np.nonzero(is_p)[0]:
        q = int(p); lp = math.log(q)
        while q <= X:
            lam[q] = lp; q *= int(p)
    return lam

def mobius(X):
    mu = np.ones(X + 1, dtype=np.int64); mu[0] = 0
    is_p = np.ones(X + 1, dtype=bool)
    for p in range(2, X + 1):
        if is_p[p]:
            is_p[2 * p::p] = False
            mu[p::p] *= -1
            if p * p <= X: mu[p * p::p * p] = 0
    return mu

class Sys:
    """integer system: weights w(m) of the 'integers' (default 1) and h(m) = right side (default w log)."""
    def __init__(self, X, k, half=False, w=None, hrhs=None, target=None):
        self.X, self.k, self.half = X, k, half
        m = np.arange(X + 1, dtype=np.float64)
        self.m = m
        if w is None:
            w = np.ones(X + 1); w[0] = 0
            if half: w[1:] = m[1:] ** -0.5
        self.w = w
        lg = np.zeros(X + 1); lg[1:] = np.log(m[1:])
        h = w * lg if hrhs is None else hrhs
        self.W = [np.cumsum(w * m ** j) for j in range(k + 1)]      # sum_{b<=N} w(b) b^j
        self.H = [np.cumsum(h * m ** j) for j in range(k + 1)]      # sum_{m<=N} h(m) m^j
        self.target = target   # optional per-n weight multiplying the rhs (for twisted targets)
    def _riesz(self, C, t, N):
        """t^k * sum_{b<=N} a(b) (1/t - b)^k / k!  from cumulative moment arrays C"""
        k = self.k
        if k == 0: return C[0][N]
        if k == 1: return C[0][N] - t * C[1][N]
        if k == 2: return (C[0][N] - 2 * t * C[1][N] + t * t * C[2][N]) / 2
    def entry(self, n, d):            # (dn/X)^k F_k(X/(nd))   (vectorised over n)
        nd = n * d
        return self._riesz(self.W, nd / self.X, self.X // nd)
    def obj(self, d):                 # (d/X)^k T_k(X/d)
        return self._riesz(self.H, d / self.X, self.X // d)
    def rhs(self, n):
        r = (1 - n / self.X) ** self.k / FACT[self.k]
        if self.half: r = np.ones_like(np.asarray(n, dtype=float))
        return r

def build(sysm, rows, D):
    X = sysm.X
    rows = np.asarray(rows, dtype=np.int64)
    ri, ci, va = [], [], []
    for d in range(1, D + 1):
        cnt = np.searchsorted(rows, X // d, side='right')
        if cnt == 0: break
        ri.append(np.arange(cnt)); ci.append(np.full(cnt, d - 1)); va.append(sysm.entry(rows[:cnt], d))
    ri = np.concatenate(ri); ci = np.concatenate(ci); va = np.concatenate(va)
    return sp.csr_matrix((va, (ri, ci)), shape=(len(rows), D))

def phi_all(sysm, c, D, nmin=2):
    X = sysm.X
    phi = np.zeros(X + 1)
    for d in range(1, D + 1):
        if c[d - 1] == 0.0: continue
        top = X // d
        n = np.arange(1, top + 1, dtype=np.int64)
        phi[1:top + 1] += c[d - 1] * sysm.entry(n, d)
    return phi

def initial_rows(X, k, nmin=2):
    r = int(math.isqrt(X))
    s = set(range(nmin, min(X, 3 * r + 3) + 1))
    for mm in range(1, 2 * r + 2):
        q = X // mm
        for n in (q, q + 1):
            if nmin <= n <= X: s.add(n)
        if k >= 2:
            q2 = X // (mm + 1)
            for f in (0.25, 0.5, 0.75):
                n = int(q2 + f * (q - q2))
                if nmin <= n <= X: s.add(n)
    return np.array(sorted(s), dtype=np.int64)

def solve(sysm, D, nmin=2, tol=1e-9, maxit=40, verbose=False, extra_eq=None, l1=None, objv=None):
    """LP-E.  extra_eq: list of (coef_vector, value) equality constraints on c.
    l1 = (pen vector) adds  sum pen_d |c_d|  to the objective (robust LP)."""
    X, k = sysm.X, sysm.k
    rows = initial_rows(X, k, nmin)
    d = np.arange(1, D + 1, dtype=np.int64)
    obj = sysm.obj(d) if objv is None else objv
    nall = np.arange(X + 1, dtype=np.int64)
    rhs_all = sysm.rhs(nall.astype(np.float64)) * np.ones(X + 1)
    if sysm.target is not None: rhs_all = rhs_all * sysm.target
    it = 0
    while True:
        it += 1
        A = build(sysm, rows, D)
        b = rhs_all[rows]
        if l1 is None:
            Aeq = beq = None
            if extra_eq:
                Aeq = sp.csr_matrix(np.vstack([e[0] for e in extra_eq])); beq = np.array([e[1] for e in extra_eq])
            res = linprog(obj, A_ub=-A, b_ub=-b, A_eq=Aeq, b_eq=beq, bounds=[(None, None)] * D, method='highs')
            if res.status != 0: return dict(status=res.status, msg=res.message)
            c = res.x; y = -res.ineqlin.marginals; val = res.fun
        else:
            # c = p - q, p,q >= 0
            A2 = sp.hstack([A, -A]).tocsr()
            obj2 = np.concatenate([obj + l1, -obj + l1])
            Aeq = beq = None
            if extra_eq:
                E = np.vstack([e[0] for e in extra_eq]); Aeq = sp.csr_matrix(np.hstack([E, -E])); beq = np.array([e[1] for e in extra_eq])
            res = linprog(obj2, A_ub=-A2, b_ub=-b, A_eq=Aeq, b_eq=beq, bounds=[(0, None)] * (2 * D), method='highs')
            if res.status != 0: return dict(status=res.status, msg=res.message)
            c = res.x[:D] - res.x[D:]; y = -res.ineqlin.marginals; val = res.fun
        phi = phi_all(sysm, c, D)
        slack = phi - rhs_all; slack[:nmin] = 0
        worst = slack.min()
        if verbose: print(f"   it {it} rows {len(rows)} val {val:.9g} worst {worst:.3e}", flush=True)
        if worst > -tol * max(1.0, np.abs(c).max()) or it >= maxit: break
        bad = np.nonzero(slack < -tol)[0]
        # local minima of the violation, plus the most violated
        loc = bad[(slack[bad] <= slack[np.maximum(bad - 1, 0)]) & (slack[bad] <= slack[np.minimum(bad + 1, X)])]
        top = bad[np.argsort(slack[bad])[:4000]]
        rows = np.array(sorted(set(rows.tolist()) | set(loc[:20000].tolist()) | set(top.tolist())), dtype=np.int64)
    Y = np.zeros(X + 1); Y[rows] = y
    return dict(status=0, val=val, c=c, y=Y, rows=len(rows), it=it, worst=worst, obj=obj)
