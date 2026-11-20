# Lemma M / Theorem 5 numerics. zeta and zeta' on vertical progressions by Euler-Maclaurin
# (sum_{n<=x} n^-s + x^{1-s}/(s-1) - x^-s/2 + s x^{-s-1}/12, x = 4 max|t|), numpy double precision; cross-checked with mpmath.
import numpy as np, mpmath as mp, math
def zeta_and_deriv(s, x):
    n=np.arange(1,x+1,dtype=float); ln=np.log(n)
    z=np.zeros(len(s),complex); zd=np.zeros(len(s),complex)
    for idx in np.array_split(np.arange(len(s)), max(1,len(s)*x//20_000_000+1)):
        E=np.exp(-np.outer(s[idx],ln))
        z[idx]=E.sum(axis=1); zd[idx]=-(E*ln).sum(axis=1)
    lx=math.log(x); xs=np.exp(-s*lx)
    z+= x*xs/(s-1) - xs/2 + s*xs/(12*x)
    zd+= -lx*x*xs/(s-1) - x*xs/(s-1)**2 + lx*xs/2 + xs/(12*x) - s*lx*xs/(12*x)
    return z,zd
def G(s):  # Stirling with 1/s terms; adequate for |t|>=5
    return 1/(2*s)+1/(s-1)+0.5*np.log(s/(2*np.pi))-1/(6*s*s)
# cross-check
mp.mp.dps=20
s=np.array([0.5+1234.5j, 0.2+4000.3j, 0.75+9000j]); z,zd=zeta_and_deriv(s,40000)
for a,b,c in zip(s,z,zd):
    print(" check s=",a," |zeta err|=%.1e |zeta' err|=%.1e |G err|=%.1e"%(abs(b-complex(mp.zeta(a))),abs(c-complex(mp.zeta(a,derivative=1))),
          abs(G(a)-complex(1/mp.mpc(a)+1/(mp.mpc(a)-1)-mp.log(mp.pi)/2+mp.digamma(mp.mpc(a)/2)/2))))
print("== Lemma M: means over k=1..N of zeta(s_0+2 pi i k/tau), zeta' ; Theorem 5 ratio ==")
def run(tau,sig,b,N,m=None):
    k=np.arange(1,N+1); s=sig+1j*(b+2*np.pi*k/tau); x=int(4*abs(s[-1].imag))+10
    z,zd=zeta_and_deriv(s,x); s0=complex(sig,b)
    if m: c=1/(1-m**(-s0)); c1=-math.log(m)*m**(-s0)/(1-m**(-s0))**2
    else: c=1.0; c1=0.0
    SG=(G(s)*z).sum()
    print(f" tau={'log %d'%m if m else tau} sigma0={sig} b={b} N={N}: mean zeta={z.mean():.4f} pred={c:.4f} | mean zeta'={zd.mean():.4f} pred={c1:.4f} | |sum zeta'|/N={abs(zd.sum())/N:.3f} |sum G zeta|/N={abs(SG)/N:.3f} (|c|/2)logN={abs(c)*math.log(N)/2:.3f}")
for N in [500,2000,6000]: run(math.log(2),0.5,0.3,N,2)
run(math.log(3),0.5,1.1,4000,3)
run(math.log(2),0.75,0.0,4000,2)
run(math.log(2),0.2,0.3,4000,2)
run(1.0,0.5,0.3,4000)
run(math.log(6)/2,0.5,0.0,4000)   # tau with no integer resonance below 6: resonant n = 6^j only at even multiples -> m_0=36
print("== Corollary 5.1: growth of sum rho_k zeta(s2_k) vs sum zeta(s1_k), a=0.2, w0=0.1 (sigma1=0.4, sigma2=0.8), tau=log 2 ==")
for N in [1000,4000]:
    k=np.arange(1,N+1); t=0.3+2*np.pi*k/math.log(2); x=int(4*t[-1])+10
    z1,_=zeta_and_deriv(0.4+1j*t,x); z2,_=zeta_and_deriv(0.8+1j*t,x)
    rho=(t/(2*np.pi))**0.2
    print(f" N={N}: |sum zeta(s1_k)|/N={abs(z1.sum())/N:.3f}   |sum (t_k/2pi)^a zeta(s2_k)|/N^(1+a)={abs((rho*z2).sum())/N**1.2:.3f}")
