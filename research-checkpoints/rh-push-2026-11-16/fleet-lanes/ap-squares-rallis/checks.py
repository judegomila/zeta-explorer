# Checks for ap-squares-rallis. Single process, small memory (arrays <= 2e5 doubles ~ 1.6 MB).
import mpmath as mp, math, json, time
mp.mp.dps = 30
t0=time.time()
b=[mp.mpf(3),mp.mpf(-5)]; x=[mp.mpf(1),mp.mpf(2)]   # V(z)=3/(z+1)-5/(z+2), V(1/2)=0
def V(z): return sum(bj/(z+xj) for bj,xj in zip(b,x))
def xi(s): return mp.mpf(1)/2*s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
def L(w): return mp.diff(lambda u: mp.log(xi(mp.mpf(1)/2+u)), w)
# 1. Pick form vs zero sum
Lx=[L(xx) for xx in x]
QL=sum(b[i]*b[j]*(Lx[i]+Lx[j])/(x[i]+x[j]) for i in range(2) for j in range(2))
NZ=150
print("planned: %d zeros (list of floats)"%NZ)
gam=[mp.im(mp.zetazero(n)) for n in range(1,NZ+1)]
absV2=lambda g: abs(V(1j*g))**2
S=2*sum(absV2(g) for g in gam)
G=gam[-1]
# tail: sum_{gamma>G} 2*|V|^2 ~ 2*int_G^inf (1/2pi) log(t/2pi) * 4/t^2 dt
tail=2*(4/(2*mp.pi))*(mp.log(G/(2*mp.pi))+1)/G
print("Q_L Pick formula      =",mp.nstr(QL,15))
print("zero sum (NZ)        =",mp.nstr(S,15)," + tail est",mp.nstr(tail,6)," =",mp.nstr(S+tail,12))
# 2. Tate norm: time domain
N=50000
A=mp.mpf(0);B=mp.mpf(0);tot=mp.mpf(0)
for n in range(1,N+1):
    A+=mp.sqrt(n);B+=mp.mpf(n)**1.5
    a1=mp.mpf(n);a2=mp.mpf(n+1)
    I2=(a1**-2-a2**-2)/2;I3=(a1**-3-a2**-3)/3;I4=(a1**-4-a2**-4)/4
    tot+=9*A*A*I2-30*A*B*I3+25*B*B*I4
# tail estimate: |Ev|^2 ~ c e^{-t}; use last-decade average
print("time-domain ||Ev||^2 up to log N, N=%d: %s"%(N,mp.nstr(tot,12)))
# spectral side
T0=600.0;h=0.02;M=int(T0/h)
print("planned: %d siegelz evaluations"%(M+1))
def w2(t): return (1+4*t*t)/((1+t*t)*(4+t*t))
mp.mp.dps=15
vals=[float(mp.siegelz(k*h))**2*w2(k*h) for k in range(M+1)]
def simpson(f):
    s=f[0]+f[-1]+4*sum(f[1:-1:2])+2*sum(f[2:-1:2]); return s*h/3
spec=simpson(vals)/math.pi
eg=0.5772156649
tailS=(4/math.pi)*(math.log(T0/(2*math.pi))+2*eg+1)/T0
print("spectral (1/pi)int_0^T0 =",spec," tail est",tailS," total",spec+tailS)
# 3. shift correlations
res=[]
for a in [0,1,2,5,10,20,40,80]:
    cq=2*sum(float(absV2(g))*math.cos(a*float(g)) for g in gam)
    ct=simpson([vals[k]*math.cos(a*k*h) for k in range(M+1)])/math.pi
    res.append((a,cq,ct)); print("a=%3d  zero-side C_Q(a)=% .6f   theta-norm C_T(a)=% .6f"%(a,cq,ct))
json.dump({"QL_pick":float(QL),"zero_sum_NZ":float(S),"tail":float(tail),"time_norm":float(tot),"spec":spec,"spec_tail":tailS,"corr":res},open("tmp/research-2026-11-16/push/ap-squares-rallis/checks.json","w"),indent=1)
print("elapsed",time.time()-t0)
