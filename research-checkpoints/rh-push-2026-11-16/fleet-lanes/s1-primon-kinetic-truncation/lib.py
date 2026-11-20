"""Shared loader and reference functions (text/numeric only; no repo imports)."""
import json, struct, numpy as np, mpmath as mp
NCLS, NQ = 6, 8
M64 = (1 << 64) - 1
def splitmix(x):
    x = (x + 0x9E3779B97F4A7C15) & M64
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & M64
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & M64
    return x ^ (x >> 31)
def rsign(p, seed):  # class bit: 1 means eps_p = -1
    return splitmix(p ^ ((seed * 0x1000003) & M64)) & 1

class Run:
    def __init__(self, binf, jsonf):
        self.pts = json.load(open(jsonf)); self.npts = len(self.pts)
        self.tag = {}
        for i, p in enumerate(self.pts):
            for t in p["tags"]: self.tag[t] = i
        with open(binf, "rb") as f:
            npts, ncls, nq, nck = struct.unpack("4q", f.read(32))
            assert npts == self.npts and ncls == NCLS and nq == NQ
            W = npts * ncls * nq * 2
            self.P = np.zeros(nck); self.cnt = np.zeros((nck, ncls), dtype=np.int64)
            self.D = np.zeros((nck, npts, ncls, nq), dtype=np.complex128)
            for k in range(nck):
                self.P[k] = struct.unpack("d", f.read(8))[0]
                self.cnt[k] = np.frombuffer(f.read(8 * ncls), dtype=np.int64)
                hi = np.frombuffer(f.read(8 * W), dtype=np.float64); lo = np.frombuffer(f.read(8 * W), dtype=np.float64)
                v = (hi + lo).reshape(npts, ncls, nq, 2)
                self.D[k] = v[..., 0] + 1j * v[..., 1]
    def s(self, tag):
        p = self.pts[self.tag[tag]]; return complex(p["re"], p["im"])
    def q(self, tag, cls, q):          # array over checkpoints
        return self.D[:, self.tag[tag], cls, q]
    # twisted sums: eps_p = -1 on class I (I=None: untwisted; I=0: all primes)
    def tw(self, tag, I, qplus, qminus, sign_minus):
        a = self.q(tag, 0, qplus)
        if I is None: return a
        return a - self.q(tag, I, qplus) + sign_minus * self.q(tag, I, qminus)
    def F(self, tag, I=None):   # sum eps L x/(1-eps x)
        return self.tw(tag, I, 2, 3, -1)
    def K(self, tag, I=None):   # sum eps L^2 x/(1-eps x)^2
        return self.tw(tag, I, 4, 5, -1)
    def C0(self, tag, I=None):  # sum eps L x (primes only)
        return self.tw(tag, I, 0, 0, -1)
    def C1(self, tag, I=None):
        return self.tw(tag, I, 1, 1, -1)
    def LG(self, tag, I=None):  # sum -log|1 - eps x|
        return self.tw(tag, I, 6, 7, +1).real

def local(p, s, eps=1):
    """exact local terms of one prime (python complex): dict of q0..q7 for eps=+1 / the eps-twisted combos"""
    L = np.log(p); x = p ** (-s)
    return dict(C0=eps * L * x, C1=eps * L * L * x, F=eps * L * x / (1 - eps * x), K=eps * L * L * x / (1 - eps * x) ** 2, LG=-np.log(abs(1 - eps * x)))

# ---- reference functions (mpmath) ----
def A_zeta(s):   # archimedean + pole part of xi'/xi
    s = mp.mpmathify(s); return 1 / s + 1 / (s - 1) - mp.log(mp.pi) / 2 + mp.digamma(s / 2) / 2
def A_chi4(s):
    s = mp.mpmathify(s); return mp.log(4 / mp.pi) / 2 + mp.digamma((s + 1) / 2) / 2
def zlog1(s):   # zeta'/zeta
    s = mp.mpmathify(s); return mp.zeta(s, derivative=1) / mp.zeta(s)
def zlog2(s):   # (log zeta)''
    s = mp.mpmathify(s); z = mp.zeta(s); return mp.zeta(s, derivative=2) / z - (mp.zeta(s, derivative=1) / z) ** 2
CHI4 = [0, 1, 0, -1]
def L4(s): return mp.dirichlet(s, CHI4)
def L4log1(s):
    s = mp.mpmathify(s); return mp.diff(lambda t: mp.log(L4(t)), s)
def L4log2(s):
    s = mp.mpmathify(s); return mp.diff(lambda t: mp.log(L4(t)), s, 2)
def xilog(s): return A_zeta(s) + zlog1(s)
# T-NR: N(s) = 2 cosh((s-1/2) log q) + c, c = 2 cosh(delta log q): zeros at 1/2 +- delta + i pi (2k+1)/log q
NR_Q, NR_DELTA = 2, 0.1
def NR_c(): return 2 * mp.cosh(NR_DELTA * mp.log(NR_Q))
def NRlog1(s):
    s = mp.mpmathify(s); l = mp.log(NR_Q); return 2 * l * mp.sinh((s - 0.5) * l) / (2 * mp.cosh((s - 0.5) * l) + NR_c())
def NRlog2(s):
    s = mp.mpmathify(s); l = mp.log(NR_Q); N = 2 * mp.cosh((s - 0.5) * l) + NR_c()
    return 2 * l * l * mp.cosh((s - 0.5) * l) / N - (2 * l * mp.sinh((s - 0.5) * l) / N) ** 2
def primes_upto(n):
    sv = np.ones(n + 1, dtype=bool); sv[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0]
