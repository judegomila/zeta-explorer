# sq-causal-cascade numerics (mpmath/numpy; MEASURED, not interval-certified)
import mpmath as mp, numpy as np, math
mp.mp.dps = 25
def primes(Q):
    s=np.ones(Q+1,bool); s[:2]=False
    for i in range(2,int(Q**0.5)+1):
        if s[i]: s[i*i::i]=False
    return np.nonzero(s)[0]
def G(s): return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2
def xilog(s): return G(s)+mp.zeta(s,derivative=1)/mp.zeta(s)

print("== 1. composition identity ==")
alpha=mp.mpf(1); s=mp.mpc(2,3)
def M(Z): return mp.matrix([[1-Z/2,-Z/2],[Z/2,1+Z/2]])
P=primes(200000)
Zsum=sum(-mp.log(int(p))/(mp.mpf(int(p))**s-1) for p in P)
Mtot=M(alpha*G(s))*M(alpha*Zsum)   # product of commuting sections = M(sum)
# explicit ordered product over first 30 primes to test the group law
Mp=mp.eye(2)
for p in P[:30]: Mp=Mp*M(-alpha*mp.log(int(p))/(mp.mpf(int(p))**s-1))
Zs30=sum(-mp.log(int(p))/(mp.mpf(int(p))**s-1) for p in P[:30])
print(" group law err (30 primes):", mp.norm(Mp-M(alpha*Zs30)))
Schain=(Mtot[0,0]*1+Mtot[0,1])/(Mtot[1,0]*1+Mtot[1,1])
L=xilog(s); Sdir=(1-alpha*L)/(1+alpha*L)
print(" S chain vs direct:", abs(Schain-Sdir), " (tail of primes > 2e5 ~ 5e-6)")
J=mp.matrix([[1,0],[0,-1]]); Z=mp.mpc('0.37','-1.2'); Mz=M(Z)
print(" J - M*JM - ReZ*E err:", mp.norm(J-Mz.H*J*Mz-Z.real*mp.matrix([[1,1],[1,1]])))
print(" 1-|S|^2 - 4a ReL/|1+aL|^2:", abs(1-abs(Sdir)**2-4*alpha*L.real/abs(1+alpha*L)**2))

print("== 3. reserve bound and draw ==")
mp.mp.dps=20
worst=1e9
for sig in [0.5,0.6,0.75,1.0,1.5,2,3,5,10,50]:
    for t in [1,1.5,2,3,5,8,14,30,100,1e3,1e4,1e6,1e9]:
        d=float(G(mp.mpc(sig,t)).real-(mp.log(t/(2*mp.pi))/2-1/(3*mp.mpf(t))-1/(2*mp.mpf(t)**2)))
        worst=min(worst,d)
print(" min over grid of ReG - [0.5 log(t/2pi) - 1/(3t) - 1/(2t^2)] =",worst)
P=primes(2000000).astype(float)
dr=np.log(P)/(np.sqrt(P)-1); D=np.cumsum(dr)
def Dbound(Q): return 1.01624*(2/(2**.5-1)+2*Q**.5-2*2**.5+2*math.log((Q**.5-1)/(2**.5-1)))
for Q in [3,37,1000,100000,2000000]:
    i=np.searchsorted(P,Q,side='right')-1
    print(f" Q={Q}: D(Q)={D[i]:.4f}  2sqrtQ={2*Q**.5:.3f}  RS upper bound={Dbound(Q):.3f}")
for t in [1e2,1e4,1e6,1e9,1e12,1e15,1e20,1e30,1e100,1e300]:
    R=0.5*math.log(t/(2*math.pi))-1/(3*t)-1/(2*t*t)
    i=np.searchsorted(D,R,side='right')-1
    Qs=int(P[i]) if i>=0 else None
    print(f" t={t:.0e}: R(t)={R:.4f}  Q*={Qs}  (log(t/2pi))^2/16={(math.log(t/(2*math.pi)))**2/16:.1f}")

print("== 4. worst case on the torus vs the actual line; mean square ==")
def draw_line(Q,T,npts=400000):
    p=primes(Q).astype(float); lp=np.log(p)
    out_max=-1e9; out_min=1e9; ms=0.0; cnt=0
    for chunk in np.array_split(np.linspace(T,2*T,npts),40):
        w=np.exp(-1j*np.outer(chunk,lp))/np.sqrt(p)
        u=(lp*(w/(1-w))).real.sum(axis=1)
        out_max=max(out_max,u.max()); out_min=min(out_min,u.min()); ms+=(u**2).sum(); cnt+=len(u)
    return out_max,out_min,ms/cnt
for T in [1e4,1e6]:
    R=0.5*math.log(T/(2*math.pi))
    for Q in [3,7,17,37,100,1000,10000]:
        p=primes(Q).astype(float); Dq=(np.log(p)/(np.sqrt(p)-1)).sum(); V=(np.log(p)**2/(2*(p-1))).sum()
        mx,mn,ms=draw_line(Q,T, 400000 if Q<=1000 else 100000)
        print(f" T={T:.0e} Q={Q}: torus sup D(Q)={Dq:.3f} | line max on [T,2T]={mx:.3f} | reserve at T={R:.3f} | rms line={ms**.5:.3f} torus rms={V**.5:.3f}")
print(" rms coverage: torus variance of Re draw = sum log^2 p/(2(p-1)); compare (0.5 log(t/2pi))^2")
for t in [1e4,1e6]:
    V=np.cumsum(np.log(P)**2/(2*(P-1))); R=0.5*math.log(t/(2*math.pi))
    i=np.searchsorted(V,R*R); print(f"  t={t:.0e}: first Q with rms draw >= reserve: {int(P[i]) if i<len(P) else '>2e6'}; t/2pi={t/(2*math.pi):.0f}")

print("== 5. sign-twist control ==")
for t0 in [1e4,1e6,1e9,1e12]:
    R=0.5*math.log(t0/(2*math.pi)); p=P[:20000]; lp=np.log(p)
    th=np.mod(t0*lp,2*np.pi)
    tw=np.zeros(len(p))
    for k in range(1,60): tw+=lp*p**(-k/2.0)*np.abs(np.cos(k*th))
    c=np.cumsum(tw); i=np.searchsorted(c,R); 
    i2=np.searchsorted(D,R,side='right')-1
    print(f" t0={t0:.0e}: twisted draw first exceeds reserve at Q={int(p[i])}; Q*={int(P[i2]) if i2>=0 else None}")

print("== 6. backward-heat control: term formula ==")
mp.mp.dps=20
def phi(n,u): return (2*mp.pi**2*n**4*mp.exp(9*u)-3*mp.pi*n**2*mp.exp(5*u))*mp.exp(-mp.pi*n**2*mp.exp(4*u))
tau=mp.mpf('-0.05'); z=mp.mpc('1.3','0.4'); n=3; l=mp.log(n)
lhs=mp.quad(lambda u: mp.exp(tau*u*u)*phi(n,u)*mp.exp(1j*z*u),[-6,-2,-1,0,1,2])
g=lambda zz: mp.quad(lambda v: mp.exp(tau*v*v)*phi(1,v)*mp.exp(1j*zz*v),[-6,-2,-1,0,1,2])
rhs=n**(-(1+1j*z)/2)*mp.exp(tau*l*l/4)*g(z+1j*tau*l)
print(" |lhs-rhs| =",abs(lhs-rhs)," |lhs| =",abs(lhs))
print(" weight e^{tau log^2 n/4}: w(6)/(w(2)w(3)) =", mp.exp(tau*(mp.log(6)**2-mp.log(2)**2-mp.log(3)**2)/4), "(=1 iff multiplicative)")
