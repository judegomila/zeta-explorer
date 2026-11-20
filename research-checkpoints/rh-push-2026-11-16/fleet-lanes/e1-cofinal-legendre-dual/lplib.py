"""Compact (cumulative) form of the Legendre dual LP, for large x.

Variables: G_i = psi_b(t_i) for t_i in J_x (ascending), u, v.   G nondecreasing, G_1 >= 0.
Row k:  T(k) = sum_{n <= N} G(floor(N/n)),  N = floor(x/k)   (hyperbola grouping, ~2 sqrt(N) terms).
Constraint |T(k) + u/k + v log k / k| <= 1.  Objective: max G(x) - v  (= nu1(x) by LP duality).
Rows: all k <= s, plus the two endpoints of each range I_M = {k : floor(x/k) = M}, M <= mmax;
then all k <= x are re-checked and the worst violated k per range plus neighbours of the critical
point exp(1-u/v) are added (cutting planes).
"""
import numpy as np, math, sys, json, time, resource
import scipy.sparse as sp
from scipy.optimize import linprog

def params(x):
    s = math.isqrt(x)
    while s * (s + 1) > x: s -= 1
    while (s + 1) * (s + 2) <= x: s += 1
    return s, x // (s + 1)

def Jset(x):
    s, mmax = params(x)
    small = np.arange(1, s + 1, dtype=np.int64)
    large = np.array(sorted({x // m for m in range(1, mmax + 1)}), dtype=np.int64)
    return np.concatenate([small, large])

def hyperbola_terms(N):
    """Return (values q, multiplicities w) with sum_{n<=N} G(floor(N/n)) = sum w*G(q)."""
    r = math.isqrt(N)
    n = np.arange(1, r + 1, dtype=np.int64)
    q1 = N // n
    w1 = np.ones(r, dtype=np.int64)
    qmax = N // (r + 1)
    if qmax >= 1:
        q2 = np.arange(1, qmax + 1, dtype=np.int64)
        hi = N // q2
        lo = np.maximum(N // (q2 + 1), r)
        w2 = hi - lo
        keep = w2 > 0
        q = np.concatenate([q1, q2[keep]]); w = np.concatenate([w1, w2[keep]])
    else:
        q, w = q1, w1
    return q, w

RHO = None   # optional scale-dependent bound: constraint |e_k| <= RHO(x, k) (array-valued); None means 1
def _rho(x, k):
    return 1.0 if RHO is None else RHO(x, k)

class Problem:
    def __init__(self, x):
        self.x = x
        self.s, self.mmax = params(x)
        self.J = Jset(x)
        self.nJ = len(self.J)
        # index lookup: values <= s map to value-1; large values via searchsorted
        self._cacheT = {}
    def idx(self, q):
        return np.searchsorted(self.J, q)
    def row(self, k):
        N = self.x // k
        if N not in self._cacheT:
            q, w = hyperbola_terms(N)
            self._cacheT[N] = (self.idx(q), w.astype(float))
        return self._cacheT[N]
    def initial_rows(self):
        x, s, mmax = self.x, self.s, self.mmax
        ks = set(range(1, s + 1))
        for M in range(1, mmax + 1):
            lo = x // (M + 1) + 1; hi = x // M
            if lo <= hi:
                for k in (lo, hi):
                    if k > s: ks.add(k)
        return sorted(ks)
    def Tvals(self, G):
        """T(k) for k <= s and T(M) for M <= mmax (k > s depends on M = floor(x/k) only)."""
        x, s, mmax = self.x, self.s, self.mmax
        Tk = np.zeros(s + 1)
        for k in range(1, s + 1):
            ii, w = self.row(k); Tk[k] = float(np.dot(w, G[ii]))
        TM = np.zeros(mmax + 1)
        for M in range(1, mmax + 1):
            q, w = hyperbola_terms(M); TM[M] = float(np.dot(w.astype(float), G[self.idx(q)]))
        return Tk, TM
    def residuals(self, G, u, v, chunk=10**7):
        """max |e_k| over all k <= x, and the list of (k, e_k) for the worst k per M-range with |e|>1."""
        x, s, mmax = self.x, self.s, self.mmax
        Tk, TM = self.Tvals(G)
        k = np.arange(1, s + 1, dtype=float)
        eh = (Tk[1:] + u / k + v * np.log(k) / k) / _rho(x, k)
        worst = {}
        maxabs = float(np.abs(eh).max())
        viol = [int(kk) for kk in np.nonzero(np.abs(eh) > 1 + 1e-7)[0] + 1]
        for a in range(s + 1, x + 1, chunk):
            b = min(x, a + chunk - 1)
            kk = np.arange(a, b + 1, dtype=np.int64)
            M = x // kk
            kf = kk.astype(float)
            e = (TM[M] + u / kf + v * np.log(kf) / kf) / _rho(x, kf)
            ae = np.abs(e)
            maxabs = max(maxabs, float(ae.max()))
            bad = np.nonzero(ae > 1 + 1e-7)[0]
            for i in bad.tolist():
                Mi = int(M[i])
                if Mi not in worst or ae[i] > worst[Mi][1]:
                    worst[Mi] = (int(kk[i]), float(ae[i]))
        viol += [kv for kv, _ in worst.values()]
        return maxabs, viol, Tk, TM

def solve(x, max_rounds=12, verbose=True, opts=None, signfree=False, obj_t=None, obj_vcoef=1.0):
    """obj_t=None: maximise G(x) - v (the LP of the source). obj_t=t in J_x: maximise G(t) - obj_vcoef*v
    (objective at the smaller scale t of a point feasible at x; obj_vcoef = t/x by the restriction rule)."""
    P = Problem(x)
    ks = P.initial_rows()
    nJ = P.nJ
    t0 = time.time()
    for rnd in range(max_rounds):
        ri, ci, vi = [], [], []
        for r, k in enumerate(ks):
            ii, w = P.row(k)
            ri.append(np.full(len(ii), r)); ci.append(ii); vi.append(w)
        A = sp.csr_matrix((np.concatenate(vi), (np.concatenate(ri), np.concatenate(ci))), shape=(len(ks), nJ))
        kk = np.array(ks, dtype=float)
        Uk = sp.csr_matrix(np.column_stack([1.0 / kk, np.log(kk) / kk]))
        Afull = sp.hstack([A, Uk]).tocsr()
        if RHO is not None:
            Afull = (sp.diags(1.0 / RHO(x, kk)) @ Afull).tocsr()
        # monotonicity: G_i - G_{i+1} <= 0
        mon = sp.csr_matrix((np.concatenate([np.ones(nJ - 1), -np.ones(nJ - 1)]),
                             (np.concatenate([np.arange(nJ - 1), np.arange(nJ - 1)]),
                              np.concatenate([np.arange(nJ - 1), np.arange(1, nJ)]))), shape=(nJ - 1, nJ + 2))
        if signfree:
            A_ub = sp.vstack([Afull, -Afull]).tocsr()
            b_ub = np.ones(2 * len(ks))
            bounds = [(None, None)] * (nJ + 2)
        else:
            A_ub = sp.vstack([Afull, -Afull, mon]).tocsr()
            b_ub = np.concatenate([np.ones(2 * len(ks)), np.zeros(nJ - 1)])
            bounds = [(0, None)] + [(None, None)] * (nJ - 1) + [(None, None), (None, None)]
        cobj = np.zeros(nJ + 2)
        if obj_t is None:
            cobj[nJ - 1] = -1.0; cobj[nJ + 1] = 1.0
        else:
            it = int(np.searchsorted(P.J, obj_t)); assert P.J[it] == obj_t
            cobj[it] = -1.0; cobj[nJ + 1] = obj_vcoef
        r = linprog(cobj, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs', options=opts or {})
        if r.status != 0:
            raise RuntimeError(f"status {r.status}: {r.message}")
        G = r.x[:nJ]; u, v = r.x[nJ], r.x[nJ + 1]
        maxabs, viol, Tk, TM = P.residuals(G, u, v)
        if verbose:
            print(json.dumps(dict(x=x, round=rnd, rows=len(ks), value=-r.fun, maxabs_e=maxabs, nviol=len(viol),
                                  secs=round(time.time() - t0, 1))), flush=True)
        if not viol:
            return dict(P=P, G=G, u=u, v=v, value=-r.fun, maxabs=maxabs, rows=len(ks), rounds=rnd + 1, res=r, A_ub=A_ub)
        add = set(viol) - set(ks)
        if not add and viol:
            # remaining violations are on rows already imposed: solver tolerance, stop
            return dict(P=P, G=G, u=u, v=v, value=-r.fun, maxabs=maxabs, rows=len(ks), rounds=rnd + 1, res=r, A_ub=A_ub)
        if v != 0:
            kst = math.exp(min(700.0, 1 - u / v))
            for kc in (math.floor(kst) - 1, math.floor(kst), math.ceil(kst), math.ceil(kst) + 1):
                if 1 <= kc <= x: add.add(int(kc))
        ks = sorted(set(ks) | add)
    raise RuntimeError("no convergence")

