# For each window, alpha and hypothetical off-line distance beta: the pole depth x and quantum q of the sea model
# (exact root, local density Lam = 0.5 log(T/2pi)), against the smallest Poisson-L1 average at depth x over the
# window of |S - h| for the candidates h that are certified in H^inf (given Re s > 7/8 zero-free). MEASURED.
import sys, numpy as np, mpmath as mp
from multiprocessing import Pool
from scipy.optimize import brentq
from common import Gfun
mp.mp.dps = 20
def point(t):
    out = []
    for sg in (0.0, 0.375, 0.5):
        s2 = mp.mpc(0.5+sg, t)
        out.append(complex(Gfun(s2) + mp.zeta(s2, derivative=1)/mp.zeta(s2)))
    out.append(complex(Gfun(mp.mpc(0.5, t))))
    return out
def sea_q(alpha, beta, Lam):
    L  = lambda x: Lam*np.tanh(Lam*x) + 2*x/(x*x-beta*beta)
    Lp = lambda x: Lam**2/np.cosh(min(Lam*x, 300.0))**2 - 2*(x*x+beta*beta)/(x*x-beta*beta)**2
    x = brentq(lambda x: 1+alpha*L(x), beta*1e-14, beta*(1-1e-14), xtol=1e-16, rtol=1e-15, maxiter=500)
    return x, 1.0/(alpha*x*abs(Lp(x)))
def primes_upto(n):
    s = np.ones(n+1, bool); s[:2] = False
    for i in range(2, int(n**0.5)+1):
        if s[i]: s[i*i::i] = False
    return np.nonzero(s)[0]
def Dq(Q): return sum(np.log(p)/(np.sqrt(p)-1) for p in primes_upto(max(Q, 2)) if p <= Q)
def Rt(t): return 0.5*np.log(t/(2*np.pi)) - 1/(3*t) - 1/(2*t*t)
if __name__ == "__main__":
    with Pool(8) as pool:
        for T, W, step in ((10000, 12, 0.002), (1000000, 12, 0.002), (100000000, 8, 0.002)):
            ts = np.arange(T, T+W+step/2, step)
            D = np.array(pool.map(point, [float(t) for t in ts], chunksize=32))
            Lam = 0.5*np.log((T+W/2)/(2*np.pi)); s = 0.5+1j*ts
            Qc = max([Q for Q in range(1, 400) if Dq(Q) <= Rt(T)] or [1])
            LQ = D[:, 3] - sum(np.log(p)/(p**s-1) for p in primes_upto(Qc))
            print(f"== window [{T},{T+W}] step {step}  Lam={Lam:.4f}  certified chain Q={Qc}")
            print("   alpha*Lam  beta    beta*Lam  x_pole    quantum q   | min_y Poisson-L1(x_pole) of |S-h|:  h=0     h=-1    chain   S(z+1/2) S(z+3/8) | min best/q | max_y: same five | min over h of max_y / q")
            inner = np.nonzero((ts >= T+W/3) & (ts <= T+2*W/3))[0][::5]
            for aL in (0.3, 1.0, 3.0, 10.0, 100.0):
                alpha = aL/Lam
                cay = lambda L: (1-alpha*L)/(1+alpha*L)
                S = cay(D[:, 0])
                errs = [np.abs(S), np.abs(S+1), np.abs(S-cay(LQ)), np.abs(S-cay(D[:, 2])), np.abs(S-cay(D[:, 1]))]
                for beta in (0.375, 0.2, 0.1, 0.05):
                    x, q = sea_q(alpha, beta, Lam)
                    mins = []; maxs = []
                    for e in errs:
                        pa = []
                        for i in inner:
                            k = (x/np.pi)/((ts-ts[i])**2+x*x); pa.append((e*k).sum()/k.sum())
                        mins.append(min(pa)); maxs.append(max(pa))
                    print(f"   {aL:<9} {beta:<7} {beta*Lam:<8.3f} {x:<9.5f} {q:<11.5e} |  " + "  ".join(f"{m:.4f}" for m in mins) + f"  | {min(mins)/q:<8.3f} | " + "  ".join(f"{m:.4f}" for m in maxs) + f" | {min(maxs)/q:.3f}")
                sys.stdout.flush()
