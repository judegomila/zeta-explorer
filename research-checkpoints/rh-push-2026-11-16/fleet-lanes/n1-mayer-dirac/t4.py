# Controls inside the operator class: (a) shifted Bose weight e^{-au}/(e^u-1) <-> zeta(2b+j, x+1+a);
# Maass channel at a=0.  Tracks eigenvalue-1 points b(a) from rho_k/2 and reports the flux functional f(0).
import sys, time
sys.path.insert(0, sys.argv[0].rsplit('/',1)[0])
from common import *
mp.dps = 40
N = 28
print("planned allocation: 3 mp matrices %dx%d per evaluation"%(N, N))
t0 = time.time()
def F(b, a):
    L, xs = mayer(mpmathify_c(b), N, a); A = tonp(L)
    return np.linalg.det(np.eye(N) - A), L
def mpmathify_c(b): return mpc(b.real, b.imag)
def root(b0, a, tol=1e-11):
    b1 = b0 + 0.01*(1+1j); f0, _ = F(b0, a); f1, _ = F(b1, a)
    for it in range(25):
        if f1 == f0: break
        b2 = b1 - f1*(b1-b0)/(f1-f0)
        b0, f0 = b1, f1; b1 = b2; f1, L = F(b1, a)
        if abs(b1-b0) < tol: break
    return b1, abs(f1), L
def flux(L):
    A = tonp(L); ev, evec = np.linalg.eig(A); i = np.argmin(abs(ev-1)); v = evec[:, i]
    xs = nodes(N); V = matrix(N, N)
    for p in range(N):
        for q in range(N): V[p, q] = xs[p]**q
    c = (V**-1)*matrix([mpc(z) for z in v])
    return abs(ev[i]-1), abs(complex(c[0]))/max(abs(v))
# Maass channel (a=0): first even Maass form, s = 1/2 + 13.7797513519 i
b, r, L = root(complex(0.5, 13.7797513519), mpf(0))
d, fl = flux(L)
print("Maass even #1: root b=%.10f%+.10fi |det|=%.2e |lam-1|=%.2e  |f(0)|/sup|f| = %.3e"%(b.real, b.imag, r, d, fl), flush=True)
for k in (1, 2):
    b = complex(zetazero(k)/2)
    for a in ('0', '0.05', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7'):
        if time.time()-t0 > 1020: print("# wall limit"); sys.exit(0)
        b, r, L = root(b, mpf(a)); d, fl = flux(L)
        print("k=%d a=%s: b=%.10f%+.10fi  Re(2b)-1/2=%+.6f |det|=%.2e |lam-1|=%.2e |f(0)|/sup|f|=%.3e"%(k, a, b.real, b.imag, 2*b.real-0.5, r, d, fl), flush=True)
print("# done %.0fs"%(time.time()-t0))
