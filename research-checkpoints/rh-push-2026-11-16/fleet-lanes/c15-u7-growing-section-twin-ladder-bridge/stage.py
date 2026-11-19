# Windowed anticausal block of prime-chain sections with P = t^theta. float64; MEASURED only.
# usage: python stage.py <t> <theta> [dh]
import sys, json, time, os
import numpy as np
from scipy.special import digamma
T0 = float(sys.argv[1]); TH = float(sys.argv[2]); DO_DH = (len(sys.argv) > 3 and sys.argv[3] == 'dh')
WIN = 200.0; DT = float(os.environ.get('DT', 0.02)); HW = float(os.environ.get('HW', 15.0)); R0 = 0.4; MH = int(os.environ.get('MH', 600)); TAG = os.environ.get('TAG', ''); NSEED = 24; CH = int(os.environ.get("CH", 1000))
P = T0 ** TH; u = np.log(P)
t = T0 - WIN/2 + DT*np.arange(int(round(WIN/DT))); NT = len(t)
s = 0.5 + 1j*t
def K(w): return 1/w - (1 - np.exp(-u*w))/(u*w*w)
def trig(z): return 1/z + 1/(2*z**2) + 1/(6*z**3) - 1/(30*z**5)   # psi'(z), |z| >= 400
g = 0.5*digamma(s/2) - 0.5*np.log(np.pi); gp = 0.25*trig(s/2)
gamF = K(s) + K(s-1) + g + gp/u - np.exp(-u*s)/(u*s*s)
gamS = 1/s + 1/(s-1) + g + np.exp(u*(1-s))/(1-s)
# prime powers <= P
N = int(np.floor(P + 1e-9))
print("planned: sieve %d bytes; chunk matrix %d bytes" % (N+1, CH*NT*16), flush=True)
sv = np.ones(N+1, dtype=bool); sv[:2] = False
for i in range(2, int(N**0.5)+1):
    if sv[i]: sv[i*i::i] = False
pr = np.nonzero(sv)[0]; del sv
rng = [np.random.default_rng(1000+k) for k in range(NSEED)]
eps = np.stack([r.integers(0, 2, size=len(pr))*2 - 1 for r in rng]).astype(np.float64) if len(pr) else np.zeros((NSEED, 0))
# rows: 0 zeta Fejer, 1 Liouville Fejer, 2..25 random Fejer, 26 zeta sharp
NR = NSEED + 3
acc = np.zeros((NR, NT), dtype=np.complex128)
labs = np.zeros(NR)
def add(logn, lam, sign_rows, k):
    w = np.clip(1 - logn/u, 0, None)
    base = lam*np.exp(-0.5*logn)
    C = np.empty((NR, len(logn)))
    C[0] = base*w; C[1] = base*w*((-1.0)**k); C[2:2+NSEED] = base*w*sign_rows; C[26] = base
    E = np.exp(-1j*np.outer(logn, t))
    acc[:] += C @ E
    labs[:] += np.abs(C).sum(axis=1)
t0 = time.time()
k = 1
while True:
    q = pr.astype(np.float64)**k
    m = q <= P*(1+1e-12)
    if not m.any(): break
    idx = np.nonzero(m)[0]
    for a in range(0, len(idx), CH):
        ii = idx[a:a+CH]
        lp = np.log(pr[ii].astype(np.float64))
        add(k*lp, lp, eps[:, ii]**k, k)
    k += 1
print("prime sums done %.1fs, primes %d" % (time.time()-t0, len(pr)), flush=True)
L = np.empty((NR+1, NT), dtype=np.complex128)
L[:26] = gamF[None, :] - acc[:26]; L[26] = gamS - acc[26]; L[27] = gamF   # row 27: gamma one-port only (floor)
names = ['zeta_fejer', 'liouville_fejer'] + ['rand%02d' % k for k in range(NSEED)] + ['zeta_sharp', 'gamma_only']
labs = list(labs) + [0.0]
if DO_DH:
    import numba
    xi = (np.sqrt(10-2*np.sqrt(5.0))-2)/(np.sqrt(5.0)-1); per = np.array([0.0, 1.0, xi, -xi, -1.0])
    n = np.arange(N+1); a = per[n % 5]; logn = np.zeros(N+1); logn[1:] = np.log(n[1:].astype(float))
    @numba.njit(cache=False)
    def inv(a, logn, N):
        acc = np.zeros(N+1)
        for d in range(2, N//2+1):
            ld = a[d]*logn[d] - acc[d]
            if ld != 0.0:
                for m in range(2, N//d+1): acc[d*m] += ld*a[m]
        return a*logn - acc
    lam = inv(a, logn, N)
    accD = np.zeros(NT, dtype=np.complex128); la = 0.0
    for a0 in range(2, N+1, CH):
        ln = logn[a0:min(a0+CH, N+1)]; c = lam[a0:min(a0+CH, N+1)]*np.exp(-0.5*ln)*np.clip(1-ln/u, 0, None)
        accD += c @ np.exp(-1j*np.outer(ln, t)); la += np.abs(c).sum()
    g5 = 0.5*digamma((s+1)/2) + 0.5*np.log(5/np.pi); g5p = 0.25*trig((s+1)/2)
    LD = g5 + g5p/u - accD
    L = np.vstack([L, LD[None, :], (g5 + g5p/u)[None, :]]); names += ['dh_fejer', 'gamma5_only']; labs += [la, 0.0]
    print("DH done %.1fs" % (time.time()-t0), flush=True)
W = np.exp(-0.5*((t - T0)/HW)**2)
dr = 2*np.pi/(NT*DT)
ia = np.arange(MH); jj = ia[:, None] + ia[None, :] + 1 + int(round(R0/dr))
out = dict(t=T0, theta=TH, P=P, u=u, primes=int(len(pr)), window=WIN, dt=DT, HW=HW, r0=R0, MH=MH, rows={})
for r, nm in enumerate(names):
    Lr = L[r]; S = (1 - Lr)/(1 + Lr)
    mfull = np.fft.ifft(W*S)*NT*DT/(2*np.pi)          # m(r_k), r_k = k dr (signed), up to a unimodular phase e^{i t_0 r}
    Hm = mfull[(-jj) % NT]*dr; Hp = mfull[jj % NT]*dr
    nm_ = float(np.linalg.norm(Hm, 2)); np_ = float(np.linalg.norm(Hp, 2))
    re = Lr.real; i0 = int(np.argmin(re))
    out['rows'][nm] = dict(minRe=float(re.min()), t_min=float(t[i0]), frac_neg=float((re < 0).mean()), frac_lt_m1=float((re < -1).mean()),
                           meanRe=float(re.mean()), maxRe=float(re.max()), maxAbsS=float(np.abs(S).max()), Nminus=nm_, Nplus=np_,
                           l1=float(labs[r]))
    print("%-16s minRe %10.4f frac_neg %.4f maxS %9.3g N- %.3e N+ %.3e l1 %.3g" % (nm, re.min(), (re < 0).mean(), np.abs(S).max(), nm_, np_, labs[r]), flush=True)
os.makedirs('out', exist_ok=True)
json.dump(out, open('out/cell%s_t%g_th%g.json' % (TAG, T0, TH), 'w'))
print("done %.1fs" % (time.time()-t0))
