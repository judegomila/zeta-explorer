"""s4lib.py -- ctypes wrapper of s4.c and shared definitions (lane s4-twin-ladder-alias-shell-packets).
No repository module is imported."""
import ctypes, os, math
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SEED = 20261119
EA_A = 0.25
TNR_C = 2.2
KAPPA = (math.sqrt(10 - 2 * math.sqrt(5)) - 2) / (math.sqrt(5) - 1)
OBJ = ["ZETA", "CHI5", "CHI101", "SGN", "UNI", "EA", "TNR"]
OBJB = ["INT1", "CHI5INT", "DHINT"]
A1 = 2.338107410459767
A2 = 4.087949444130971
dp = ctypes.POINTER(ctypes.c_double); ip = ctypes.POINTER(ctypes.c_int64); up = ctypes.POINTER(ctypes.c_uint64)
_lib = None


def primes_upto(n):
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]:
            s[i * i::i] = False
    return np.nonzero(s)[0].astype(np.int64)


P97 = primes_upto(97); P997 = primes_upto(997)
CUTS97 = (0, 5, 10, 17, 25)


def lib():
    global _lib
    if _lib is None:
        L = ctypes.CDLL(os.path.join(HERE, "libs4.so"))
        L.s4_sgn.restype = ctypes.c_int; L.s4_sgn.argtypes = [ctypes.c_uint64, ctypes.c_uint64]
        L.s4_uni.restype = ctypes.c_double; L.s4_uni.argtypes = [ctypes.c_uint64, ctypes.c_uint64]
        L.s4_init.argtypes = [ctypes.c_uint64]
        L.s4_primes.restype = ctypes.c_int64; L.s4_primes.argtypes = [ctypes.c_uint64, ctypes.c_uint64, up]
        L.s4_legendre.argtypes = [ctypes.c_int64, ip, ctypes.c_int, ip]
        L.s4_smooth_sign.argtypes = [ctypes.c_int64, ip, ctypes.POINTER(ctypes.c_int8), ctypes.c_int, ip]
        L.s4_smooth_uni.argtypes = [ctypes.c_int64, ip, dp, ctypes.c_int, dp]
        L.s4_factor_chunk.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.c_uint64, ctypes.c_uint64, ctypes.c_double,
                                      ctypes.c_int, ip, dp, ctypes.POINTER(ctypes.c_int8)]
        L.s4_prime_chunk.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.c_int, ctypes.POINTER(ctypes.c_int), dp,
                                     ctypes.c_int, dp, ctypes.c_int, dp, ctypes.c_double, ctypes.c_double,
                                     ctypes.c_uint64, ctypes.c_double, ctypes.c_double, dp, dp, dp, dp, up, up, ip]
        L.s4_int_chunk.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.c_int, ctypes.POINTER(ctypes.c_int), dp, dp]
        L.s4_airy_window.argtypes = [ctypes.c_uint64, ctypes.c_uint64, ctypes.c_uint64, ctypes.c_double, ctypes.c_double,
                                     ctypes.c_int, dp, ctypes.c_double, ctypes.c_double, ctypes.c_int, dp, dp,
                                     ctypes.c_uint64, ctypes.c_uint64, ctypes.c_uint64, ctypes.c_double, dp, dp, ip]
        _lib = L
    return _lib


def D(a):
    return a.ctypes.data_as(dp)


def sgn(p, seed=SEED):
    return lib().s4_sgn(int(p), seed)


def uni(p, seed=SEED):
    return lib().s4_uni(int(p), seed)


def primes(lo, hi):
    lib().s4_init(int(math.isqrt(hi)) + 2)
    out = np.zeros(int((hi - lo) // 2 + 16), dtype=np.uint64)
    n = lib().s4_primes(int(lo), int(hi), out.ctypes.data_as(up))
    return out[:n]


def legendre(N, pr):
    pr = np.ascontiguousarray(pr, dtype=np.int64); out = np.zeros(7, dtype=np.int64)
    lib().s4_legendre(int(N), pr.ctypes.data_as(ip), len(pr), out.ctypes.data_as(ip))
    return out


def smooth_sign(N, pr, eps):
    pr = np.ascontiguousarray(pr, dtype=np.int64); eps = np.ascontiguousarray(eps, dtype=np.int8); out = np.zeros(2, dtype=np.int64)
    lib().s4_smooth_sign(int(N), pr.ctypes.data_as(ip), eps.ctypes.data_as(ctypes.POINTER(ctypes.c_int8)), len(pr), out.ctypes.data_as(ip))
    return out


def smooth_uni(N, pr, th):
    pr = np.ascontiguousarray(pr, dtype=np.int64); th = np.ascontiguousarray(th, dtype=np.float64); out = np.zeros(3)
    lib().s4_smooth_uni(int(N), pr.ctypes.data_as(ip), D(th), len(pr), D(out))
    return out[0] + 1j * out[1], int(out[2])


def factor_chunk(lo, hi, seg=1 << 20, doEA=1, want_sign=False, seed=SEED, ea=EA_A):
    nseg = -(-(hi - lo) // seg)
    oi = np.zeros((nseg, 6), dtype=np.int64); od = np.zeros((nseg, 10)); so = None; sp = None
    if want_sign:
        so = np.zeros(hi - lo, dtype=np.int8); sp = so.ctypes.data_as(ctypes.POINTER(ctypes.c_int8))
    r = lib().s4_factor_chunk(int(lo), int(hi), int(seg), seed, ea, doEA, oi.ctypes.data_as(ip), D(od), sp)
    assert r == 0
    return oi, od, so


def prime_chunk(lo, hi, geom, mu, xs=(), Ts=(), s_exp=417 / 500, h_exp=1 / 8, seed=SEED, ea=EA_A, jit=0.9):
    ncfg = len(geom); nx, nT = len(xs), len(Ts)
    g = np.ascontiguousarray(geom, dtype=np.int32); m = np.ascontiguousarray(mu, dtype=np.float64)
    x = np.ascontiguousarray(xs if nx else [0.0], dtype=np.float64); T = np.ascontiguousarray(Ts if nT else [0.0], dtype=np.float64)
    oG = np.zeros((ncfg, 7, 9)); oV = np.zeros((max(nx, 1), max(nT, 1), 7, 5)); oA0 = np.zeros(max(nx, 1)); oD = np.zeros((max(nx, 1), 7))
    first = np.zeros(64, dtype=np.uint64); last = np.zeros(64, dtype=np.uint64); cnt = np.zeros(3, dtype=np.int64)
    r = lib().s4_prime_chunk(int(lo), int(hi), ncfg, g.ctypes.data_as(ctypes.POINTER(ctypes.c_int)), D(m), nx, D(x), nT, D(T),
                             s_exp, h_exp, seed, ea, jit, D(oG), D(oV), D(oA0), D(oD), first.ctypes.data_as(up),
                             last.ctypes.data_as(up), cnt.ctypes.data_as(ip))
    assert r == 0, r
    nf, nl = int(cnt[1]), int(cnt[2])
    fl = first[:nf].copy()
    if nl >= 64:
        k = nl % 64; ll = np.concatenate([last[k:], last[:k]])
    else:
        ll = last[:nl].copy()
    return dict(lo=int(lo), hi=int(hi), G=gsum(oG), V=oV, A0=oA0, D=oD, first=fl, last=ll, npk=int(cnt[0]))


def int_chunk(lo, hi, geom, mu):
    ncfg = len(geom); g = np.ascontiguousarray(geom, dtype=np.int32); m = np.ascontiguousarray(mu, dtype=np.float64)
    oG = np.zeros((ncfg, 3, 9))
    r = lib().s4_int_chunk(int(lo), int(hi), ncfg, g.ctypes.data_as(ctypes.POINTER(ctypes.c_int)), D(m), D(oG))
    assert r == 0
    return dict(lo=int(lo), hi=int(hi), G=gsum(oG))


def gsum(o):
    """summary arrays -> dict of arrays Q (real), cup, c1up, cdn, c1dn (complex), shape [cfg, obj]"""
    return dict(Q=o[..., 0].copy(), cup=o[..., 1] + 1j * o[..., 2], c1up=o[..., 3] + 1j * o[..., 4],
                cdn=o[..., 5] + 1j * o[..., 6], c1dn=o[..., 7] + 1j * o[..., 8])


def upos(geom, n):
    return math.log(n) if geom == 1 else float(n)


def stitch(A, B, LA, LB, mu):
    """A below B, adjacent.  LA, LB, mu arrays over cfg (lengths in u).  Returns summary of the union."""
    fA = np.exp(-mu * LA)[:, None]; fB = np.exp(-mu * LB)[:, None]; m = mu[:, None]; la = LA[:, None]; lb = LB[:, None]
    cross = A["cup"] * np.conj(B["cdn"]) / m + A["c1up"] * np.conj(B["cdn"]) + A["cup"] * np.conj(B["c1dn"])
    return dict(Q=A["Q"] + B["Q"] + 2 * cross.real,
                cup=A["cup"] * fB + B["cup"], c1up=(A["c1up"] + lb * A["cup"]) * fB + B["c1up"],
                cdn=A["cdn"] + fA * B["cdn"], c1dn=A["c1dn"] + fA * (B["c1dn"] + la * B["cdn"]))


def inner(A, B, Dgap, mu):
    """<F_A, F_B> for A below B with gap Dgap (array over cfg) between the upper end of A and the lower end of B."""
    m = mu[:, None]; d = Dgap[:, None]
    return np.exp(-m * d) * (A["cup"] * np.conj(B["cdn"]) * (1 / m + d) + A["c1up"] * np.conj(B["cdn"]) + A["cup"] * np.conj(B["c1dn"]))


def airy_table(xmin=-13.0, xmax=9.0, dx=1.0 / 2048):
    from scipy.special import airy
    nt = int(round((xmax - xmin) / dx)) + 1
    x = xmin + dx * np.arange(nt); a, ap, _, _ = airy(x)
    return xmin, dx, nt, np.ascontiguousarray(a), np.ascontiguousarray(ap)


def airy_window(c, H, cuts, tab, pal, hal, xpost=8.0, seed=SEED, ea=EA_A):
    from fractions import Fraction
    x0, dx, nt, a, ap = tab; cuts = np.ascontiguousarray(cuts, dtype=np.float64); nc = len(cuts)
    cint = int(round(c)); cfrac = float(Fraction(c) - cint)
    lo = max(2, int(math.floor(c - cuts.max() * H)) - 1); hi = int(math.ceil(c + xpost * H)) + 2
    oW = np.zeros((6, nc, 2, 2)); oM = np.zeros((2, nc, 2)); npk = np.zeros(1, dtype=np.int64)
    r = lib().s4_airy_window(lo, hi, cint, cfrac, 1.0 / H, nc, D(cuts), x0, dx, nt, D(a), D(ap), int(pal), int(hal), seed, ea,
                             D(oW), D(oM), npk.ctypes.data_as(ip))
    assert r == 0
    return oW[..., 0] + 1j * oW[..., 1], oM, int(npk[0]), lo, hi


# ---- object amplitudes in Python (for brute-force checks and edge-restricted clusters) --------------------
def chi5(n):
    return [0, 1, 1j, -1j, -1][n % 5]


def leg101(n):
    a = n % 101
    if a == 0:
        return 0
    return 1 if pow(a, 50, 101) == 1 else -1


def eps_obj(o, n):
    """multiplier eps_F(p) at a prime p for object index o (amplitude = log p * eps)"""
    if o == 0: return 1.0
    if o == 1: return chi5(n)
    if o == 2: return float(leg101(n))
    if o == 3: return float(sgn(n))
    if o == 4: return complex(math.cos(2 * math.pi * uni(n)), math.sin(2 * math.pi * uni(n)))
    if o == 5: return n ** EA_A + n ** -EA_A
    if o == 6: return 1.0 + TNR_C * math.sqrt(3) if n == 3 else 1.0


def tnr_sk(k):
    s0, s1 = 2.0, -TNR_C * math.sqrt(3)
    if k == 0: return s0
    for _ in range(k - 1):
        s0, s1 = s1, -TNR_C * math.sqrt(3) * s1 - 3 * s0
    return s1


def dh_coeff(n):
    return [0.0, 1.0, KAPPA, -KAPPA, -1.0][n % 5]
