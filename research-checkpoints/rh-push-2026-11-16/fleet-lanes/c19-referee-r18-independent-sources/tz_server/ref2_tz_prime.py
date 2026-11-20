# Independent prime-side moments for the referee rerun of Form C / Form D (lane c18-tz-band-completion-controls-server).
# Own code: numpy segmented sieve, long double (80-bit) phases t_w log n, moments on cells of width 1/512 in log n.
# usage: python ref2_tz_prime.py T0 LO HI OUT WINDOWS(comma list)     primes p with LO <= p < HI; prime powers when LO == 0
import sys, math, time
import numpy as np
LD = np.longdouble
assert np.finfo(LD).eps < 2e-19, "needs 80-bit long double"
T0 = float(sys.argv[1]); LO = int(sys.argv[2]); HI = int(sys.argv[3]); OUT = sys.argv[4]
WINS = [int(x) for x in sys.argv[5].split(",")]
THETAS = [0.55, 0.65, 0.75, 0.85]
XS = np.array([int(math.floor(T0 ** th + 1e-9)) for th in THETAS], dtype=np.int64)
XMAX = int(XS[-1]); HI = min(HI, XMAX + 1)
NQ = 12; CELLW = 512
NCELL = int(math.floor(math.log(XMAX) * CELLW)) + 2
PI2 = LD(8) * np.arctan(LD(1))
TW = [LD(int(T0)) + LD(128 * w) for w in WINS]
print("planned allocation: moments %d stages x %d windows x %d cells x %d x 16 B = %.1f MB; segment 2^23 bytes" %
      (4, len(WINS), NCELL, NQ, 4 * len(WINS) * NCELL * NQ * 16 / 1e6), flush=True)
MOM = np.zeros((4, len(WINS), NCELL, NQ), dtype=np.complex128)
SABS = np.zeros(4)
NTERM = np.zeros(4, dtype=np.int64)

def accumulate(n, lam):
    """n: int64 array of prime powers, lam: float64 array log p."""
    st = np.searchsorted(XS, n, side="left")
    keep = st < 4
    n = n[keep]; lam = lam[keep]; st = st[keep]
    if len(n) == 0: return
    L = np.log(n.astype(LD))
    cell = np.floor(L * CELLW).astype(np.int64)
    d = (L - (cell.astype(LD) + LD(0.5)) / CELLW).astype(np.float64)
    amp = lam / np.sqrt(n.astype(np.float64))
    idx = st * NCELL + cell
    np.add.at(SABS, st, amp); np.add.at(NTERM, st, 1)
    for wi, tw in enumerate(TW):
        ph = tw * L
        ph = ph - PI2 * np.rint(ph / PI2)
        ph = ph.astype(np.float64)
        zr = amp * np.cos(ph); zi = -amp * np.sin(ph)
        pw = np.ones_like(d)
        for q in range(NQ):
            a = np.bincount(idx, weights=zr * pw, minlength=4 * NCELL)
            b = np.bincount(idx, weights=zi * pw, minlength=4 * NCELL)
            MOM[:, wi, :, q] += (a + 1j * b).reshape(4, NCELL)
            pw = pw * d

def small_primes(N):
    s = np.ones(N + 1, dtype=bool); s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]: s[p * p::p] = False
    return np.nonzero(s)[0].astype(np.int64)

t0 = time.time()
base = small_primes(int(math.isqrt(XMAX)) + 2)
if LO == 0:
    # prime powers p^k, k >= 2
    ns, ls = [], []
    for p in base:
        pk = int(p) * int(p)
        while pk <= XMAX:
            ns.append(pk); ls.append(math.log(int(p))); pk *= int(p)
    if ns: accumulate(np.array(ns, dtype=np.int64), np.array(ls))
    print("prime powers k>=2:", len(ns), flush=True)
    LO = 2
SEG = 1 << 23
lo = LO
nseg = 0
while lo < HI:
    hi = min(lo + SEG, HI)
    arr = np.ones(hi - lo, dtype=bool)
    for p in base:
        p = int(p)
        if p * p >= hi: break
        start = max(p * p, ((lo + p - 1) // p) * p)
        arr[start - lo::p] = False
    pr = np.nonzero(arr)[0].astype(np.int64) + lo
    pr = pr[pr >= 2]
    if len(pr): accumulate(pr, np.log(pr.astype(np.float64)))
    lo = hi; nseg += 1
    if nseg % 50 == 0: print("seg", nseg, "at", lo, "t=%.0fs" % (time.time() - t0), flush=True)
np.savez(OUT, MOM=MOM, SABS=SABS, NTERM=NTERM, XS=XS, WINS=np.array(WINS), T0=T0, LO=LO, HI=HI)
print("done", OUT, "terms per stage", NTERM.tolist(), "sum|c|n^-1/2", SABS.tolist(), "t=%.0fs" % (time.time() - t0), flush=True)
