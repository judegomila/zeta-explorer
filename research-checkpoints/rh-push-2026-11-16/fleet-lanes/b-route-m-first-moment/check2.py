# Route M: first moment, second moment, Frobenius, lam_max checks from the exact Vasyunin table.
import numpy as np, math, sys, json, time
from math import log, pi, gcd
N=int(sys.argv[1]) if len(sys.argv)>1 else 2000
G0=0.5772156649015329; C=(log(2*pi)-G0)/2; K=1.5*C-0.25
t0=time.time()
Vt=[None,np.zeros(1)]  # Vt[b][a] = V(a,b), a=0..b-1
for b in range(2,N+1):
    m=np.arange(1,b,dtype=np.int64)
    cot=1.0/np.tan(pi*m/b)
    a=np.arange(0,b,dtype=np.int64)
    Vt.append((((a[:,None]*m[None,:])%b)/b)@cot)
print("table",time.time()-t0,flush=True)
# Amat[b][a] = A(a/b) for coprime a<b  (I(a,b)/b)
def Arow(b):
    a=np.arange(1,b)
    cop=np.gcd(a,b)==1
    Vab=Vt[b][1:b]
    Vba=np.array([Vt[x][b%x] if x>1 else 0.0 for x in a])
    I=C*(a+b)+0.5*(a-b)*np.log(b/a)-(pi/2)*(Vab+Vba)
    return a,cop,I/b
def omega(n):
    c=0;p=2
    while p*p<=n:
        if n%p==0:
            c+=1
            while n%p==0:n//=p
        p+=1
    return c+(n>1)
s0=None
try:
    s0=float(open('s0.txt').read())
except Exception: pass
print("K=",K,"s0=",s0)
T=0.0; Tlog={}
Arows={}
worstF=0;worstQ=0;minA=1e9
out=[]
for b in range(2,N+1):
    a,cop,A=Arow(b)
    Arows[b]=(cop,A)
    lam=a/b
    # sanity: bounds lam <= A <= lam(2+log 1/lam)
    minA=min(minA,float(np.min((A-lam)[cop])))
    assert np.all(A[cop]<=lam[cop]*(2+np.log(1/lam[cop]))+1e-9)
    ph=int(cop.sum())
    sel=cop&(a>=2)
    F=b*float(A[sel].sum()); Q=float(((A[sel]/lam[sel])**2).sum())
    T+=2*Q/b**2
    if b in (100,200,400,800,1000,1500,2000,2500,3000,4000): Tlog[b]=T
    w=omega(b); l=log(b)
    bF=b*2**w*(3+2*l)+2+l
    rF=abs(F-K*b*ph)/bF; worstF=max(worstF,rF)
    if s0:
        E2=2*(2+l)*(5+3*l)*l+(2+l)**2+2*(2+l)+2
        rQ=abs(Q-s0*ph)/(2**w*E2+(2+l)**2); worstQ=max(worstQ,rQ)
    if b in (30,101,210,601,1201,1999,2310,2311,2999,3001,3989,4001) or b==N:
        out.append((b,ph,F/(b*ph) if ph else 0,Q/ph, abs(F-K*b*ph)/b))
print("min(A-lam) over table",minA)
print("b phi kappa(b) Q/phi |F-K b phi|/b")
for r in out: print(r)
print("worst |F-Kbphi|/bound",worstF,"worst |Q-s0 phi|/bound",worstQ)
ks=sorted(Tlog)
for i in range(1,len(ks)): print("T slope",ks[i-1],ks[i],(Tlog[ks[i]]-Tlog[ks[i-1]])/log(ks[i]/ks[i-1]))
if s0: print("predicted T slope 12 s0/pi^2 =",12*s0/pi**2," Frobenius slope 2 s0=",2*s0, "CS slope 36K^2/pi^2=",36*K*K/pi**2)
# Gram matrix
M=min(N,3000)
Gm=np.zeros((M+1,M+1))
for b in range(2,M+1):
    cop,A=Arows[b]
    a=np.arange(1,b)[cop]; Av=A[cop]
    for g in range(1,M//b+1):
        Gm[g*a,g*b]=Av/(g*a); 
Gm=Gm+Gm.T
for n in range(1,M+1): Gm[n,n]=2*C/n
Gm=Gm[1:,1:]
assert Gm.min()>0
p=1/np.sqrt(np.arange(1,M+1))
for n in [250,500,1000,2000,3000]:
    if n>M: break
    S=Gm[:n,:n]
    lm=np.linalg.eigvalsh(S)[-1]
    fro=np.sum(S*S)
    ray=p[:n]@S@p[:n]/(p[:n]@p[:n])
    schur=np.max((S@p[:n])/p[:n])
    print("N=%d lam_max=%.5f Fro^2=%.4f Rayleigh(n^-1/2)=%.5f Schur rowmax=%.5f"%(n,lm,fro,ray,schur))
# sigma_m: full weighted row sums with tail estimate
Sfull=(Gm@p)/p
r=np.arange(1,M+1)/M
tail=np.sqrt(r)*(np.log(1/r)+2+2*(C+0.5))
for m in [1,2,3,5,10,20,50,100,200,400]:
    if m<=M: print("sigma_m m=%d partial=%.5f +tail est=%.5f"%(m,Sfull[m-1],Sfull[m-1]+tail[m-1]))
mm=np.arange(1,M//20+1)
print("max over m<=M/20 of sigma_m est:",np.max((Sfull+tail)[:M//20]),"argmax",1+int(np.argmax((Sfull+tail)[:M//20])))
print("4 zeta(1/2)^2 =",4*1.4603545088095868**2)
