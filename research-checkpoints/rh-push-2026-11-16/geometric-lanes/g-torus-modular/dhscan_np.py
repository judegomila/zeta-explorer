# numpy scan for Davenport-Heilbronn zeros with Re s > 1 (Hurwitz via Euler-Maclaurin, double precision)
import numpy as np, sys, math, time
kap=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
chi={1:1,2:1j,3:-1j,4:-1}
c1=(1-1j*kap)/2; c2=(1+1j*kap)/2
coef={a:c1*chi[a]+c2*np.conj(chi[a]) for a in chi}   # f(s)=5^-s sum coef[a] zeta(s,a/5)
B=[1/6,-1/30,1/42,-1/30,5/66]
def hurw(s,a,N):
    n=np.arange(N)[:,None]+a
    S=np.exp(-s[None,:]*np.log(n)).sum(0)
    x=N+a; lx=math.log(x)
    S+=np.exp((1-s)*lx)/(s-1)+0.5*np.exp(-s*lx)
    term=s*np.exp((-s-1)*lx); fact=2.0
    for k,b in enumerate(B):
        S+=b/fact*term
        term=term*(s+2*k+1)*(s+2*k+2)/x**2; fact*=(2*k+3)*(2*k+4)
    return S
def f(s,N):
    return np.exp(-s*math.log(5))*sum(coef[a]*hurw(s,a/5,N) for a in chi)
if __name__=="__main__":
    sig=float(sys.argv[1]); T0=float(sys.argv[2]); T1=float(sys.argv[3]); dt=0.02
    t0=time.time(); res=[]
    t=T0
    while t<T1:
        tt=np.arange(t,min(t+200,T1),dt); s=sig+1j*tt
        N=int(max(60,(t+200)/3))
        v=np.abs(f(s,N))
        i=np.where((v[1:-1]<v[:-2])&(v[1:-1]<v[2:])&(v[1:-1]<0.06))[0]+1
        res+= [(float(tt[j]),float(v[j])) for j in i]
        t+=200
    res.sort(key=lambda x:x[1])
    for r in res[:30]: print(r)
    print("time",time.time()-t0)
