"""alib.py -- analysis helpers for the sextic/cubic first moments (tables from build_table.py).

Partial sums S(X) = sum_{N(n) <= X} v_n on a geometric grid; main-term fits by weighted least squares on the shell
increments, with the random-phase noise model Var(increment) = #terms in shell (|v_n| = 1):
    dS_k = c (X_k^th - X_{k-1}^th) + eps_k,   E|eps_k|^2 = n_k.
Fixed-exponent fits give c-hat and its standard error; free-exponent fits use the profile chi^2(th) = 2 sum |r_k|^2/n_k
(two real components of variance n_k/2 each) and report th-hat with the Delta chi^2 = 1 interval.
"""
import sys, os, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z

Z6 = Z.ZETA6

class SFTable:
    def __init__(self, path):
        d = np.load(path)
        self.d = d
        for k in ('na', 'nb', 'N', 'g1', 'g2', 'g3', 'mu', 'm4', 'm9', 'parent', 'last', 'depth'):
            setattr(self, k, d[k])
        self.X = int(d['X'])
        self.n = len(self.N)
        self.levels = [np.flatnonzero(self.depth == L) for L in range(1, int(self.depth.max()) + 1)]
        self.order = np.argsort(self.N, kind='stable')
        self.Ns = self.N[self.order]
        # prime arrays
        self.pa = d['pa']; self.pb = d['pb']; self.pp = d['pp']; self.pq = d['pq']; self.pinert = d['pinert']; self.pw = d['pw']
        self.pg = {1: d['pg1'], 2: d['pg2'], 3: d['pg3']}
        self.np_ = len(self.pa)
        # square class (e,f) of each n, and G(n) = conj(chi_n(4)) gamma_3(n)
        self._G = None

    # ------------------------------------------------------------------ symbols
    def chi_primes(self, y):
        """exponent of chi_pi(y) for every prime of the table (-1 if pi | y)."""
        ya, yb = int(y[0]), int(y[1])
        k = np.full(self.np_, -1, dtype=np.int8)
        sp = ~self.pinert
        p = self.pp[sp].astype(np.int64); w = self.pw[sp]
        r = (ya % p + (yb % p) * w) % p
        nz = r != 0
        val = Z._vpow(r[nz], (p[nz] - 1) // 6, p[nz]).astype(np.int64)
        z = (1 + w[nz]) % p[nz]
        cur = np.ones_like(z); kk = np.full(len(z), -1, dtype=np.int8)
        for t in range(6):
            kk[val == cur] = t
            cur = (cur * z) % p[nz]
        assert (kk >= 0).all()
        tmp = np.full(int(sp.sum()), -1, dtype=np.int8); tmp[nz] = kk; k[sp] = tmp
        for idx in np.flatnonzero(self.pinert):
            P = Z.PrimeO((int(self.pa[idx]), int(self.pb[idx])), int(self.pp[idx]), True)
            c = P.chi((ya, yb)); k[idx] = -1 if c is None else c
        return k

    def node_exponents(self, y):
        """exponent of chi_n(y) for every squarefree node n (-1 if (n, y) != 1)."""
        kp = self.chi_primes(y)
        e = np.zeros(self.n, dtype=np.int8)
        for lev in self.levels:
            pe = e[self.parent[lev]]; ke = kp[self.last[lev]]
            bad = (pe < 0) | (ke < 0)
            e[lev] = np.where(bad, -1, (pe.astype(np.int16) + ke) % 6).astype(np.int8)
        return e

    def twist_values(self, y, j=1, base=None):
        """gt_j(y, n) = conj(chi_n(y))^j gamma_j(n) (0 if not coprime); base overrides gamma_j array."""
        e = self.node_exponents(y)
        g = {1: self.g1, 2: self.g2, 3: self.g3}[j] if base is None else base
        ph = np.where(e >= 0, np.conj(Z6[(j * np.maximum(e, 0)) % 6]), 0)
        return ph * g

    def G(self):
        """G(n) = conj(chi_n(4)) gamma_3(n) on all nodes."""
        if self._G is None:
            e4 = self.node_exponents((4, 0))
            self._G = np.conj(Z6[e4 % 6]) * self.g3
        return self._G

    # ------------------------------------------------------------------ partial sums
    def partial(self, vals, grid, mask=None):
        """S(X_k) and counts c(X_k) = #{n in mask : N <= X_k} for the grid."""
        v = vals[self.order]
        nz = (np.abs(v) > 0) if mask is None else (mask[self.order] & (np.abs(v) > 0))
        v = np.where(nz, v, 0)
        cs = np.concatenate([[0], np.cumsum(v)])
        cc = np.concatenate([[0], np.cumsum(nz)])
        pos = np.searchsorted(self.Ns, grid, side='right')
        return cs[pos], cc[pos]

def geom_grid(xmin, xmax, k):
    return np.unique(np.round(np.geomspace(xmin, xmax, k)).astype(np.int64))

# ---------------------------------------------------------------------- fits
def fit_fixed(grid, S, cnt, th, x0=None):
    """WLS on shell increments for S(X) ~ c X^th. Returns (c, se, chi2, dof)."""
    g = grid.astype(float)
    if x0 is not None:
        keep = g >= x0; g = g[keep]; S = S[keep]; cnt = cnt[keep]
    dS = np.diff(S); n = np.diff(cnt).astype(float); a = np.diff(g ** th)
    ok = n > 0; dS, n, a = dS[ok], n[ok], a[ok]
    W = a * a / n
    c = (a * dS / n).sum() / W.sum()
    se = 1.0 / math.sqrt(W.sum())
    r = dS - c * a
    chi2 = 2 * (np.abs(r) ** 2 / n).sum()
    return c, se, chi2, 2 * len(n) - 2

def fit_free(grid, S, cnt, ths=np.linspace(0.3, 1.0, 701), x0=None):
    """profile chi^2 over th; returns (th_hat, lo, hi, c_hat, chi2min, chi2(th) array)."""
    chis = np.array([fit_fixed(grid, S, cnt, t, x0)[2] for t in ths])
    i = int(np.argmin(chis)); cmin = chis[i]
    inside = ths[chis <= cmin + 1.0]
    c = fit_fixed(grid, S, cnt, ths[i], x0)[0]
    return ths[i], inside.min(), inside.max(), c, cmin, chis

def chi2_at(grid, S, cnt, th, x0=None):
    return fit_fixed(grid, S, cnt, th, x0)[2]

def null_phase_sd(tab, mask, grid, th, nsur=40, seed=1):
    """standard deviation of c-hat under random unit phases on the same support (noise calibration)."""
    rng = np.random.default_rng(seed)
    out = []
    for _ in range(nsur):
        v = np.exp(2j * np.pi * rng.random(tab.n)) * mask
        S, cnt = tab.partial(v, grid)
        out.append(fit_fixed(grid, S, cnt, th)[0])
    out = np.array(out)
    return float(np.sqrt(np.mean(np.abs(out) ** 2)))

# ---------------------------------------------------------------------- binned sums (fast per-index evaluation)
class Binner:
    """precomputed shell index of every node for a geometric grid, and class keys; binned(v) -> [shell, key] sums."""
    def __init__(self, tab, grid, key=None, nkeys=1):
        self.grid = grid.astype(np.int64)
        self.shell = np.searchsorted(self.grid, tab.N, side='left')     # node in (grid[s-1], grid[s]] -> s
        self.keep = self.shell < len(self.grid)
        self.nsh = len(self.grid)
        self.key = np.zeros(tab.n, dtype=np.int64) if key is None else key.astype(np.int64)
        self.nkeys = nkeys
        self.flat = (self.shell * nkeys + self.key)[self.keep]

    def binned(self, v):
        vv = v[self.keep]
        L = self.nsh * self.nkeys
        re = np.bincount(self.flat, weights=vv.real, minlength=L)
        im = np.bincount(self.flat, weights=vv.imag, minlength=L)
        cnt = np.bincount(self.flat, weights=(np.abs(vv) > 0).astype(float), minlength=L)
        return (re + 1j * im).reshape(self.nsh, self.nkeys), cnt.reshape(self.nsh, self.nkeys)

def fit_binned(grid, dS, dn, th, s0=1):
    """WLS fit of shell increments dS (shells s0..end) to c*(X_s^th - X_{s-1}^th); returns (c, se, chi2, dof)."""
    g = grid.astype(float)
    a = g[s0:] ** th - g[s0 - 1:-1] ** th
    d = dS[s0:]; n = dn[s0:]
    ok = n > 0
    a, d, n = a[ok], d[ok], n[ok]
    W = (a * a / n).sum()
    c = (a * d / n).sum() / W
    r = d - c * a
    return c, 1 / math.sqrt(W), 2 * (np.abs(r) ** 2 / n).sum(), 2 * len(n) - 2

def fit_binned_free(grid, dS, dn, ths=np.linspace(0.3, 1.0, 701), s0=1):
    chis = np.array([fit_binned(grid, dS, dn, t, s0)[2] for t in ths])
    i = int(np.argmin(chis)); inside = ths[chis <= chis[i] + 1.0]
    return ths[i], inside.min(), inside.max(), fit_binned(grid, dS, dn, ths[i], s0)[0], chis[i], chis

def fit_binned_joint(grid, dS_list, dn_list, ths=np.linspace(0.3, 1.0, 701), s0=1):
    """common exponent, separate constants: profile chi^2 summed over the listed series."""
    chis = np.array([sum(fit_binned(grid, d, n, t, s0)[2] for d, n in zip(dS_list, dn_list)) for t in ths])
    i = int(np.argmin(chis)); inside = ths[chis <= chis[i] + 1.0]
    return ths[i], inside.min(), inside.max(), chis[i], chis
