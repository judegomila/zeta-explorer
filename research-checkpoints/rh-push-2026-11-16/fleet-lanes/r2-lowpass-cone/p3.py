# Part 3: position of the order-149 DH failure vector (a=1) relative to the cones.
# V(z)=W(zeta(z))/(z+1), zeta=(z-1)/(z+1), W(x)=sum w_k x^k ; H(z)=V(z)V(-z)=W(zeta)W(1/zeta)/(1-z^2);
# w^T T_149 w = a * sum_rho H(rho)  (a=1).
import json, mpmath as mp, sys
mp.mp.dps=3700
D=json.load(open('w149.json'))
w=[mp.mpf(x) for x in D['w']]
n=len(w)-1
print("order",n+1,"| DH q =",D['dh_q'],"| zeta q =",D['zeta_q'])
print("log10 max|w| =",mp.nstr(mp.log10(max(abs(x) for x in w)),6)," W(1) =",mp.nstr(sum(w),10)," W(-1) =",mp.nstr(sum(w[k]*(-1)**k for k in range(n+1)),10))
# autocorrelation r_k and H in the variable y=1/(1+u'), u'=-z^2: W(zeta)W(1/zeta)=r_0+sum_k r_k(zeta^k+zeta^-k)=r_0+2 sum r_k T_k(1-2y)
r=[sum(w[i]*w[i+k] for i in range(n+1-k)) for k in range(n+1)]
def Hval(z):
    ze=(z-1)/(z+1)
    Wz=mp.polyval(w[::-1],ze); Wi=mp.polyval(w[::-1],1/ze)
    return Wz*Wi/(1-z*z)
# zeros of W
mp.mp.dps=3700
roots=None
if roots:
    mods=sorted(abs(x) for x in roots)
    print("W zeros: min |zeta| %s max |zeta| %s ; count |zeta|>1: %d ; real zeros in (-1,0): %d"%(mp.nstr(mods[0],8),mp.nstr(mods[-1],12),sum(1 for m in mods if m>1),sum(1 for x in roots if abs(mp.im(x))<mp.mpf(10)**-50 and -1<mp.re(x)<0)))
    # zeros of V in z: z=(1+zeta)/(1-zeta)
    zs=sorted(((1+x)/(1-x) for x in roots),key=lambda z: mp.im(z))
    up=[z for z in zs if mp.im(z)>0]
    print("zeros of V in the upper half-plane: %d. (Re, Im) list:"%len(up))
    print("  "+" ".join("(%s,%s)"%(mp.nstr(mp.re(z),3),mp.nstr(mp.im(z),6)) for z in up))
    json.dump([[mp.nstr(mp.re(z),30),mp.nstr(mp.im(z),30)] for z in zs],open('Vzeros149.json','w'))
# sign map of Re H on the strip
mp.mp.dps=600
w=[+x for x in w]
print("sign map: for each beta, gamma-intervals (grid 0.05, 0<gamma<=400) with Re H(beta+i gamma)<0, and min of cos(arg H)")
res={}
for beta in ('0.5','0.4','0.3085','0.2','0.1','0.05','0.01'):
    b=mp.mpf(beta); neg=[]; mn=(2,None)
    g=mp.mpf('0.05')
    while g<=400:
        h=Hval(mp.mpc(b,g)); c=mp.re(h)/abs(h)
        if c<0: neg.append(float(g))
        if c<mn[0]: mn=(c,float(g))
        g+=mp.mpf('0.05') if g<200 else mp.mpf('0.25')
    iv=[]
    for x in neg:
        if iv and x-iv[-1][1]<0.2501: iv[-1][1]=x
        else: iv.append([x,x])
    res[beta]=iv
    print(" beta=%s: min cos = %s at gamma=%s ; negative intervals: %s"%(beta,mp.nstr(mn[0],5),mn[1]," ".join("[%.2f,%.2f]"%tuple(i) for i in iv)),flush=True)
json.dump(res,open('signmap149.json','w'))
# large gamma check
for g in (500,1000,1e4,1e6,3e12):
    h=Hval(mp.mpc(0.5,g)); print(" gamma=%g beta=.5 cos(arg H)=%s"%(g,mp.nstr(mp.re(h)/abs(h),8)))
# DH zero sum check (zeros to 200) and decomposition
Z=json.load(open('../weil-onesided/dh_zeros_200.json'))
on=[mp.mpf(g) for g in Z['on']]; off=[(mp.mpf(bb)-mp.mpf(1)/2,mp.mpf(g)) for bb,g in Z['off']]
pos=[2*mp.re(Hval(mp.mpc(0,g))) for g in on]
q4=[4*mp.re(Hval(mp.mpc(bb,g))) for bb,g in off]
print("DH zero side (25-digit zeros, heights<=200): on-line sum = %s ; quartets: %s"%(mp.nstr(sum(pos),6)," ".join(mp.nstr(x,6) for x in q4)))
print("  largest on-line terms:",sorted([(mp.nstr(p,3),mp.nstr(g,6)) for p,g in zip(pos,on)],key=lambda x:-float(x[0]))[:5])
h0=Hval(mp.mpc(off[0][0],off[0][1])); print("  at the DH quartet 0.3085+85.699i: cos(arg H) =",mp.nstr(mp.re(h0)/abs(h0),8)," |H| =",mp.nstr(abs(h0),6))
# zeta zero side
gz=[mp.im(z) for z in [mp.zetazero(k) for k in range(1,81)]] if False else None
mp.mp.dps=3700
w=[mp.mpf(x) for x in D['w']]
# K_F: E(t)=e^{-t} sum_k p_k t^k/k!, H=sum_k p_k y^{k+1}, y=1/(1-z^2)
# coefficients of r_0+2 sum r_k T_k(1-2y) in y
T0=[mp.mpf(1)]; T1=[mp.mpf(1),mp.mpf(-2)]
poly=[r[0]]+[mp.mpf(0)]*n
poly[0]+=2*r[1]*T1[0]; poly[1]+=2*r[1]*T1[1]
for k in range(2,n+1):
    # T_k = 2x T_{k-1} - T_{k-2}, x=1-2y
    T2=[mp.mpf(0)]*(k+1)
    for i,cf in enumerate(T1):
        T2[i]+=2*cf; T2[i+1]+=-4*cf
    for i,cf in enumerate(T0): T2[i]-=cf
    for i,cf in enumerate(T2): poly[i]+=2*r[k]*cf
    T0,T1=T1,T2
# check against direct H
z=mp.mpc('0.3','7.7'); y=1/(1-z*z)
print("poly check rel err:",mp.nstr(abs(sum(poly[k]*y**(k+1) for k in range(n+1))-Hval(z))/abs(Hval(z)),5))
fact=[mp.mpf(1)]
for k in range(1,n+1): fact.append(fact[-1]*k)
def E(t): return mp.exp(-t)*sum(poly[k]*t**k/fact[k] for k in range(n+1))
ts=[mp.mpf(k)/50 for k in range(1,50*400+1)]
vals=[E(t) for t in ts]
negm=sum(-v for v in vals if v<0)/50; posm=sum(v for v in vals if v>0)/50
sc=sum(1 for i in range(len(vals)-1) if (vals[i]>0)!=(vals[i+1]>0))
print("K_F test: E(t)=inverse Laplace of H in u': sign changes on (0,400]: %d ; negative mass / positive mass = %s ; H(0)=int E = %s"%(sc,mp.nstr(negm/posm,10),mp.nstr(Hval(mp.mpf(0)),6)))
print("  min E/max|E| =",mp.nstr(min(vals)/max(abs(v) for v in vals),8))
