# Check of Theorem A's functional: L(F) = (1/2pi) int F(s) K(s) dt on Re s = sigma0,
# K(s) = M^s Gamma(s) cos(pi s/2) r(s), r(s) = s^2/((s-rho)(s-a)^5), M = N/(2 pi).
# Claims: L(zeta(s) n^-s / s) = 0 for n <= N, != 0 for n > N;
#         L(1/s) = M^rho Gamma(rho) cos(pi rho/2) Res_rho(r)/rho + sum_{k>=1} residues at s=-2k.
import sys, numpy as np
from flint import acb, arb, ctx
ctx.prec = 140
sigma0 = float(sys.argv[1]) if len(sys.argv)>1 else 0.75
N = int(sys.argv[2]) if len(sys.argv)>2 else 10
T = 400; h = 0.25
rho = acb(0.5, arb("14.134725141734693790457251983562470270784257115699"))
a = acb(2); pi = acb.pi(); M = acb(N)/(2*pi)
gx, gw = np.polynomial.legendre.leggauss(24)   # float64 nodes: quadrature accuracy ~1e-15 relative
def r(s): return s*s/((s-rho)*(s-a)**5)
def Kc(s): return (M**s)*s.gamma()*(pi*s/2).cos()*r(s)
ts=[]; wts=[]
for k in range(-int(T/h), int(T/h)):
    lo=k*h
    ts.extend(lo+(gx+1)*h/2); wts.extend(gw*h/2)
ts=np.array(ts); wts=np.array(wts)
base=np.empty(len(ts),complex); zs=np.empty(len(ts),complex)
for i,t in enumerate(ts):
    s=acb(sigma0,float(t))
    base[i]=complex(Kc(s)/s); zs[i]=complex(s.zeta())
L1=np.sum(wts*base)/(2*np.pi)
pred=complex((M**rho)*rho.gamma()*(pi*rho/2).cos()*(rho*rho/(rho-a)**5)/rho)
import math
tail=sum(float(N/(2*math.pi))**(-2*k)*(-1)**k/math.factorial(2*k)*complex(r(acb(-2*k)))/(-2*k) for k in range(1,30))
print("sigma0",sigma0,"N",N,"M=N/2pi  nodes",len(ts))
print("L(1/s) quadrature       ",L1)
print("residue at rho          ",pred)
print("rho + trivial residues  ",pred+tail,"  |diff| %.3e"%abs(L1-pred-tail))
for n in list(range(1,N+1))+[N+1,N+2,2*N,5*N]:
    Ln=np.sum(wts*base*zs*np.exp(-(sigma0+1j*ts)*math.log(n)))/(2*np.pi)
    print("n=%3d |L(zeta n^-s/s)| = %.3e"%(n,abs(Ln)),"  (n<=N: expect 0)" if n<=N else "  (n>N)")
