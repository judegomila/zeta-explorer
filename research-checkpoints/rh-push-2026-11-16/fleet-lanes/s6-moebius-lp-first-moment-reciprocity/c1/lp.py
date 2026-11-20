"""Legendre-Riesz certificate LP for a general object F = sum w(n) n^-s (text-only inputs; no repo data modules).

Lambda_w = w^{-1} * (w log).  u(n) = known phase/sign of Lambda_w(n) (1 for zeta and E_a, chi(n) for L(chi),
lambda(n) for the Liouville twist, n^{-i alpha} for the unimodular twist; 0 = Lambda_w(n) known to vanish, no row).
f_w(t) = sum_{b<=1/t} w(b) (1-bt)^k/k!,  tau(d) = sum_{m<=X/d} w(m) log m (1-md/X)^k/k!,  r(n) = (1-n/X)^k/k!.
Identity: sum_n Lambda_w(n) f_w(nd/X) = tau(d).  For c on d <= D with
        Re[ u(n) (phi_c(n) - r(n)) ] >= 0   for 2 <= n <= X,     phi_c(n) = sum_d c_d f_w(nd/X),
    Re V(c) := Re sum_d c_d tau(d) = Re sum_n Lambda_w(n) phi_c(n) >= Re psi_k^w(X)/X^k     (uses |Lambda_w| u = Lambda_w only).
LP-E minimises Re V(c).  c = w^{-1} gives equality at every n.  Real objects: c real.  Complex w: c = cr + i ci.
LP-R (real objects with bounded sawtooth): objective Main(c) + sum |c_d| pen_d.
"""
import numpy as np, math, time, sys
import scipy.sparse as sp
from scipy.optimize import linprog

FACT = [1, 1, 2, 6]
TIME_LIMIT = 800.0     # seconds per HiGHS call

def primes_upto(X):
    s = np.ones(X + 1, dtype=bool); s[:2] = False
    for p in range(2, int(X ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0]

def lambda_arr(X, coef=None):
    """Lambda(n) * coef(p, j) on prime powers p^j (coef default 1)."""
    lam = np.zeros(X + 1, dtype=np.complex128 if coef is not None and coef[1] else np.float64)
    f = coef[0] if coef is not None else None
    for p in primes_upto(X):
        p = int(p); q = p; j = 1; lp = math.log(p)
        while q <= X:
            lam[q] = lp * (f(p, j) if f else 1.0); q *= p; j += 1
    return lam

def mult_from_primes(X, fpk):
    """multiplicative function with value fpk(p, j) at p^j (vectorised over multiples)."""
    w = np.ones(X + 1, dtype=np.float64); w[0] = 0
    for p in primes_upto(X):
        p = int(p); q = p; j = 1
        vals = []
        while q <= X: vals.append((q, fpk(p, j))); q *= p; j += 1
        # exact power of p dividing n
        for i, (q, v) in enumerate(vals):
            nxt = vals[i + 1][0] if i + 1 < len(vals) else None
            idx = np.arange(q, X + 1, q)
            if nxt is not None: idx = idx[idx % nxt != 0]
            w[idx] *= v
    return w

def dirichlet_inverse(w, X):
    inv = np.zeros(X + 1, dtype=w.dtype); acc = np.zeros(X + 1, dtype=w.dtype)
    for n in range(1, X + 1):
        inv[n] = (1.0 if n == 1 else 0.0) - acc[n]
        top = X // n
        if top >= 2 and inv[n] != 0: acc[2 * n: top * n + 1: n] += inv[n] * w[2: top + 1]
    return inv

def lambda_from_w(w, X):
    inv = dirichlet_inverse(w, X)
    m = np.arange(X + 1, dtype=np.float64); lg = np.zeros(X + 1); lg[1:] = np.log(m[1:]); h = w * lg
    out = np.zeros(X + 1, dtype=w.dtype)
    for d in range(1, X + 1):
        if inv[d] != 0.0: out[d:: d] += inv[d] * h[1: X // d + 1]
    return out, inv

class Sys:
    def __init__(self, X, k, w=None, u=None):
        self.X, self.k = X, k
        m = np.arange(X + 1, dtype=np.float64); self.m = m
        if w is None: w = np.ones(X + 1); w[0] = 0
        self.w = w; self.cplx = np.iscomplexobj(w)
        lg = np.zeros(X + 1); lg[1:] = np.log(m[1:]); h = w * lg
        self.W = [np.cumsum(w * m ** j) for j in range(k + 1)]
        self.H = [np.cumsum(h * m ** j) for j in range(k + 1)]
        if u is None: u = np.ones(X + 1)
        self.u = u
    def _riesz(self, C, t, N):
        k = self.k
        if k == 0: return C[0][N]
        if k == 1: return C[0][N] - t * C[1][N]
        if k == 2: return (C[0][N] - 2 * t * C[1][N] + t * t * C[2][N]) / 2
    def entry(self, n, d):
        nd = n * d
        return self._riesz(self.W, nd / self.X, self.X // nd)
    def obj(self, d):
        return self._riesz(self.H, d / self.X, self.X // d)
    def rhs(self, n):
        return (1 - n / self.X) ** self.k / FACT[self.k]

def build(sysm, rows, D):
    """rows x D matrix of u(n) f_w(nd/X) (complex if needed)."""
    X = sysm.X; rows = np.asarray(rows, dtype=np.int64)
    ri, ci, va = [], [], []
    for d in range(1, D + 1):
        cnt = np.searchsorted(rows, X // d, side='right')
        if cnt == 0: break
        ri.append(np.arange(cnt)); ci.append(np.full(cnt, d - 1)); va.append(sysm.u[rows[:cnt]] * sysm.entry(rows[:cnt], d))
    ri = np.concatenate(ri); ci = np.concatenate(ci); va = np.concatenate(va)
    return sp.csr_matrix((va, (ri, ci)), shape=(len(rows), D))

def phi_all(sysm, c, D):
    X = sysm.X
    phi = np.zeros(X + 1, dtype=np.result_type(c.dtype, sysm.w.dtype))
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

def solve(sysm, D, tol=1e-9, maxit=40, verbose=False, l1=None, objv=None, nmin=2, allrows=False, box=None, ftol=0.0):
    """allrows: every active n as a row from the start (small X).  box: bound |c_d| <= box (keeps the row-relaxed LPs bounded;
    the result is the true optimum only if no bound is active at the end: field 'at_box')."""
    X, k = sysm.X, sysm.k
    active = (sysm.u != 0); active[:nmin] = False
    rows = initial_rows(X, k, nmin) if not allrows else np.arange(nmin, X + 1, dtype=np.int64)
    rows = rows[active[rows]]
    lo, hi = (None, None) if box is None else (-box, box)
    d = np.arange(1, D + 1, dtype=np.int64)
    obj = sysm.obj(d) if objv is None else objv
    nall = np.arange(X + 1, dtype=np.float64)
    rhs_all = sysm.rhs(nall)
    cplx = sysm.cplx
    it = 0
    while True:
        it += 1
        A = build(sysm, rows, D)
        b = (sysm.u[rows] * rhs_all[rows]).real - ftol   # ftol: constraints relaxed by ftol (rigid two-sided systems)
        if cplx:
            A2 = sp.hstack([A.real, -A.imag]).tocsr(); o2 = np.concatenate([obj.real, -obj.imag])
            res = linprog(o2, A_ub=-A2, b_ub=-b, bounds=[(lo, hi)] * (2 * D), method='highs', options=dict(time_limit=TIME_LIMIT))
            if res.status != 0: return dict(status=res.status, msg=res.message)
            c = res.x[:D] + 1j * res.x[D:]; y = -res.ineqlin.marginals; val = res.fun
        elif l1 is None:
            A = A.real if np.iscomplexobj(A) else A
            res = linprog(np.real(obj), A_ub=-A, b_ub=-b, bounds=[(lo, hi)] * D, method='highs', options=dict(time_limit=TIME_LIMIT))
            if res.status != 0: return dict(status=res.status, msg=res.message)
            c = res.x; y = -res.ineqlin.marginals; val = res.fun
        else:
            A = A.real if np.iscomplexobj(A) else A
            A2 = sp.hstack([A, -A]).tocsr(); o2 = np.concatenate([obj + l1, -obj + l1])
            res = linprog(o2, A_ub=-A2, b_ub=-b, bounds=[(0, hi)] * (2 * D), method='highs', options=dict(time_limit=TIME_LIMIT))
            if res.status != 0: return dict(status=res.status, msg=res.message)
            c = res.x[:D] - res.x[D:]; y = -res.ineqlin.marginals; val = res.fun
        phi = phi_all(sysm, c, D)
        slack = (sysm.u * (phi - rhs_all)).real; slack[~active] = 0
        worst = slack.min()
        if verbose: print(f"   it {it} rows {len(rows)} val {val:.9g} worst {worst:.3e}", flush=True)
        scale = max(1.0, np.abs(c).max())
        thr = max(tol * scale, 2 * ftol)
        if worst > -thr or it >= maxit: break
        bad = np.nonzero(slack < -thr)[0]
        loc = bad[(slack[bad] <= slack[np.maximum(bad - 1, 0)]) & (slack[bad] <= slack[np.minimum(bad + 1, X)])]
        top = bad[np.argsort(slack[bad])[:4000]]
        rows = np.array(sorted(set(rows.tolist()) | set(loc[:20000].tolist()) | set(top.tolist())), dtype=np.int64)
    Y = np.zeros(X + 1); Y[rows] = y
    at_box = 0 if box is None else int((np.abs(c.real) > box * (1 - 1e-9)).sum() + (np.abs(np.imag(c)) > box * (1 - 1e-9)).sum())
    return dict(status=0, val=val, c=c, y=Y, rows=len(rows), it=it, worst=worst, obj=obj, at_box=at_box)
