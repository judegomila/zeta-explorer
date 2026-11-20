"""ek_common.py -- shared loader for the (E-K) screen. Reads the squarefree table of tmp/sextic (data only)."""
import os, sys, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import zomega as Zm
TABLE = os.environ.get("EK_TABLE", os.path.join(HERE, "..", "..", "..", "sextic", "data", "sf_1e6.npz"))
SQ3 = math.sqrt(3.0)
KAP = 2 * math.pi / SQ3          # Gaussian row weight g_X(m) = exp(-KAP q_m / X); g~(y) = X exp(-KAP X |y|^2)

class Tab:
    def __init__(self, Cmax, pmax=None):
        d = np.load(TABLE)
        N = d['N']
        ok = N <= Cmax
        if pmax is not None:      # keep only moduli whose largest prime factor has norm <= pmax ('last' = largest prime)
            lq = np.where(d['last'] >= 0, d['pq'][np.maximum(d['last'], 0)], 1)
            ok &= lq <= pmax
        sel = np.flatnonzero(ok)
        new = -np.ones(len(N), dtype=np.int64); new[sel] = np.arange(len(sel))
        self.N = N[sel].astype(np.float64); self.na = d['na'][sel]; self.nb = d['nb'][sel]
        par = d['parent'][sel]; self.parent = np.where(par >= 0, new[np.maximum(par, 0)], -1)
        self.last = d['last'][sel]; self.depth = d['depth'][sel]; self.mu = d['mu'][sel].astype(np.float64)
        self.g1 = d['g1'][sel]; self.g2 = d['g2'][sel]; self.g3 = d['g3'][sel]
        self.n = len(sel)
        self.alpha = (self.na - self.nb / 2.0 + 1j * self.nb * SQ3 / 2.0) / np.sqrt(self.N)
        self.tau = self.g2 * np.conj(self.alpha)                  # theta row coefficient gamma_2(c) conj(alpha(c))
        self.G = self.g1 * self.g2 * self.mu * np.conj(self.alpha)  # G(c) from (4.7): gamma_1 gamma_2 = mu alpha G
        self.levels = [np.flatnonzero(self.depth == L) for L in range(1, int(self.depth.max()) + 1)]
        used = np.unique(self.last[self.last >= 0])
        self.pidx = used
        self.pa = d['pa'][used]; self.pb = d['pb'][used]; self.pp = d['pp'][used]; self.pq = d['pq'][used]
        self.pinert = d['pinert'][used]; self.pw = d['pw'][used]
        pos = -np.ones(int(d['pa'].shape[0]), dtype=np.int64); pos[used] = np.arange(len(used))
        self.lastpos = np.where(self.last >= 0, pos[np.maximum(self.last, 0)], -1)
        self.tabs = [self._ptab(j) for j in range(len(used))]

    def _ptab(self, j):
        """exponent table of chi_pi on residues (64 = zero)."""
        p = int(self.pp[j])
        if not self.pinert[j]:
            w = int(self.pw[j]); r = np.arange(p, dtype=np.uint64)
            val = Zm._vpow(r, np.full(p, (p - 1) // 6, dtype=np.uint64), np.full(p, p, dtype=np.uint64)).astype(np.int64)
            z = (1 + w) % p; cur = 1; out = np.full(p, 64, dtype=np.int8)
            for t in range(6):
                out[val == cur] = t; cur = (cur * z) % p
            out[0] = 64
            assert (out[1:] < 6).all()
            return out
        P = Zm.PrimeO((int(self.pa[j]), int(self.pb[j])), p, True)
        out = np.full(p * p, 64, dtype=np.int8)
        for x in range(p):
            for y in range(p):
                c = P.chi((x, y))
                if c is not None: out[x * p + y] = c
        return out

    def prime_exps(self, ma, mb):
        """KP[j, i] = exponent of chi_{pi_j}(m_i) (64 if pi_j | m_i)."""
        KP = np.empty((len(self.pp), len(ma)), dtype=np.int16)
        for j in range(len(self.pp)):
            p = int(self.pp[j])
            if not self.pinert[j]:
                KP[j] = self.tabs[j][(ma + mb * int(self.pw[j])) % p]
            else:
                KP[j] = self.tabs[j][(ma % p) * p + (mb % p)]
        return KP

    def node_exps(self, KP):
        """E[c, i]: exponent sum (>= 64 means not coprime)."""
        E = np.zeros((self.n, KP.shape[1]), dtype=np.int16)
        for lev in self.levels:
            E[lev] = E[self.parent[lev]] + KP[self.lastpos[lev]]
        return E

    def factors(self, c):
        out = []; t = c
        while t > 0:
            out.append(int(self.lastpos[t])); t = int(self.parent[t])
        return out

def elements(Mmax):
    """all nonzero m = a + b w with a^2 - ab + b^2 <= Mmax."""
    R = int(math.sqrt(4 * Mmax / 3.0)) + 2
    a = np.arange(-R, R + 1, dtype=np.int64)
    A, B = np.meshgrid(a, a, indexing='ij')
    q = A * A - A * B + B * B
    ok = (q <= Mmax) & (q > 0)
    return A[ok], B[ok], q[ok].astype(np.float64)
Z6 = np.exp(1j * np.pi * np.arange(6) / 3.0)
