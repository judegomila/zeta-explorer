# Part 1: independent check of Theorem F and the DH / T-NR table. mpmath only, own formulas.
import mpmath as mp, json
mp.mp.dps=30
half=mp.mpf(1)/2
I=mp.mpc(0,1)
# ---- zeta
def Lz(x):
    s=half+x
    return 1/s+1/(s-1)-mp.log(mp.pi)/2+mp.digamma(s/2)/2+mp.zeta(s,derivative=1)/mp.zeta(s)
NZ=150
gz=[mp.im(mp.zetazero(n)) for n in range(1,NZ+1)]
# ---- DH (own L from mp.dirichlet; zero list from weil-onesided json, validated below by Pick-vs-zero-sum)
chi=[0,1,I,-I,-1]; chib=[mp.conj(c) for c in chi]
kap=(mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1)
def fdh(s,d=0): return ((1-I*kap)/2)*mp.dirichlet(s,chi,d)+((1+I*kap)/2)*mp.dirichlet(s,chib,d)
def Ld(x):
    s=half+x
    return mp.re(mp.log(5/mp.pi)/2+mp.digamma((s+1)/2)/2+fdh(s,1)/fdh(s))
Z=json.load(open('../weil-onesided/dh_zeros_200.json'))
gd=[mp.mpf(g) for g in Z['on']]; od=[(mp.mpf(b)-half,mp.mpf(g)) for b,g in Z['off']]
# ---- T-NR: xi(s)(2cosh((s-1/2)log q)+c)
def Lt(x,q,c):
    lq=mp.log(q); return Lz(x)+2*lq*mp.sinh(x*lq)/(2*mp.cosh(x*lq)+c)
def tnr_zeros(q,c,K=60):
    lq=mp.log(q); d=mp.acosh(abs(c)/2)/lq
    if c>0: return d,[(2*k+1)*mp.pi/lq for k in range(K)],False
    return d,[2*k*mp.pi/lq for k in range(1,K)],True
def pick(L,a,b): 
    Lv=[L(x) for x in a]; n=len(a)
    return sum(b[i]*b[j]*(Lv[i]+Lv[j])/(a[i]+a[j]) for i in range(n) for j in range(n))
def dd(a): return [1/mp.fprod([a[k]-a[j] for k in range(len(a)) if k!=j]) for j in range(len(a))]
a=[mp.mpf('0.7'),mp.mpf('1.3'),mp.mpf('2.9')]; b=dd(a)
H=lambda w: 1/mp.fprod([x*x-w*w for x in a])
print("== case V=1/((z+.7)(z+1.3)(z+2.9)) ==")
qp=pick(Lz,a,b); qs=sum(2*mp.re(H(I*g)) for g in gz)
tail=2*mp.quad(lambda t: mp.log(t/(2*mp.pi))/(2*mp.pi)*t**-6,[gz[-1],mp.inf])
print("zeta: Pick form",mp.nstr(qp,15),"zero sum(%d)"%NZ,mp.nstr(qs,15),"tail est",mp.nstr(tail,3),"ratio to 2|V(i g1)|^2:",mp.nstr(qp/(2*H(I*gz[0])),12))
qp=pick(Ld,a,b); qs=sum(2*mp.re(H(I*g)) for g in gd)+sum(4*mp.re(H(mp.mpc(bb,g))) for bb,g in od)
print("DH  : Pick form",mp.nstr(qp,15),"zero sum(T=200)",mp.nstr(qs,15),"ratio to first-zero term:",mp.nstr(qp/(2*H(I*gd[0])),12))
for q,c in [(2,mp.mpf('2.1')),(2,mp.mpf('-2.1')),(3,mp.mpf('2.3'))]:
    d,gs,real=tnr_zeros(q,c)
    qp=pick(lambda x:Lt(x,q,c),a,b)
    qs=sum(2*mp.re(H(I*g)) for g in gz)+sum(4*mp.re(H(mp.mpc(d,g))) for g in gs)+(2*H(d) if real else 0)
    print("T-NR q=%d c=%s: delta=%s lowest height %s | Pick form %s zero sum %s"%(q,c,mp.nstr(d,8),mp.nstr(gs[0],8),mp.nstr(qp,15),mp.nstr(qs,15)))
# ---- Theta(t)
def Th_z(t): return sum(2*mp.exp(-g*g*t) for g in gz)
def Th_d(t): return sum(2*mp.exp(-g*g*t) for g in gd)+sum(4*mp.exp((bb*bb-g*g)*t)*mp.cos(2*bb*g*t) for bb,g in od)
def Th_t(t,q,c):
    d,gs,real=tnr_zeros(q,c)
    return Th_z(t)+sum(4*mp.exp((d*d-g*g)*t)*mp.cos(2*d*g*t) for g in gs)+(2*mp.exp(d*d*t) if real else 0)
print("== Theta(t) (zeros below the cut only; t large enough that the cut is immaterial) ==")
print("t, zeta, DH, DH offline part, TNR(2,2.1), TNR(2,-2.1), TNR(3,2.3)")
for t in ['0.01','0.05','0.2','0.5','0.763','1.0','1.5','2.3','3.0']:
    t=mp.mpf(t)
    offp=sum(4*mp.exp((bb*bb-g*g)*t)*mp.cos(2*bb*g*t) for bb,g in od)
    print(mp.nstr(t,4),mp.nstr(Th_z(t),5),mp.nstr(Th_d(t),5),mp.nstr(offp,3),mp.nstr(Th_t(t,2,mp.mpf('2.1')),5),mp.nstr(Th_t(t,2,mp.mpf('-2.1')),5),mp.nstr(Th_t(t,3,mp.mpf('2.3')),5))
# ---- F2 product tests on T-NR: confluent node a, order M: Q = sum_rho (a^2-rho^2)^-M ; and distinct nodes
print("== Theorem F product tests V=(z+a)^-M, sign of Q ==")
for (q,c) in [(2,mp.mpf('2.1')),(3,mp.mpf('2.3'))]:
    d,gs,real=tnr_zeros(q,c)
    for av in ['0.6','1','3']:
        av=mp.mpf(av); first=None
        for M in range(1,80):
            Q=sum(2*(av*av+g*g)**(-M) for g in gz)+sum(4*mp.re((av*av-mp.mpc(d,g)**2)**(-M)) for g in gs)
            if Q<0: first=(M,Q); break
        print("T-NR q=%d c=%s a=%s: first M with Q<0:"%(q,c,av), first and (first[0],mp.nstr(first[1],5)))
# distinct-node confirmation through the Pick form itself (no zero list): Chebyshev nodes in [0.6,1.6]
mp.mp.dps=120
for M in (10,12,14):
    a=[mp.mpf('1.1')+mp.mpf('0.5')*mp.cos((2*j+1)*mp.pi/(2*M)) for j in range(M)]; b=dd(a)
    print("distinct nodes in [0.6,1.6], M=%d: T-NR(2,2.1) Pick form on divided-difference vector = %s ; zeta = %s ; DH = %s"%(M,mp.nstr(pick(lambda x:Lt(x,2,mp.mpf('2.1')),a,b),8),mp.nstr(pick(Lz,a,b),8),mp.nstr(pick(Ld,a,b),8)))
# order-2 Pick failure for c<-2 (real zero at delta)
mp.mp.dps=30
q,c=2,mp.mpf('-2.1'); a=[mp.mpf('0.55'),mp.mpf('0.6')]
Lv=[Lt(x,q,c) for x in a]
det=Lv[0]/a[0]*Lv[1]/a[1]-((Lv[0]+Lv[1])/(a[0]+a[1]))**2
print("T-NR(2,-2.1) 2x2 Pick det at nodes 0.55,0.6:",mp.nstr(det,8))
a=[mp.mpf('0.6'),mp.mpf('6')]
for nm,L in (("zeta",Lz),("DH",Ld)):
    Lv=[L(x) for x in a]; print(nm,"2x2 Pick det nodes .6,6:",mp.nstr(Lv[0]/a[0]*Lv[1]/a[1]-((Lv[0]+Lv[1])/(a[0]+a[1]))**2,8))
# order-1 complex test Re L(z)/Re z at Re z=1/2 for T-NR (should be >=0) and sign of Lambda_F
for q,c in [(2,mp.mpf('2.1')),(2,mp.mpf('-2.1'))]:
    lq=mp.log(q)
    mn=min(mp.re(2*lq*mp.sinh(z*lq)/(2*mp.cosh(z*lq)+c)) for z in [mp.mpc(0.5,k*0.01) for k in range(0,1000)])
    al=[r for r in mp.polyroots([1,c*mp.sqrt(q),q])]
    print("T-NR q=%d c=%s: min over Re z=1/2 of Re(local factor log-derivative) = %s ; Lambda_F(q^k)/log q, k=1,2: %s %s"%(q,c,mp.nstr(mn,6),mp.nstr(mp.re(1-al[0]-al[1]),6),mp.nstr(mp.re(1-al[0]**2-al[1]**2),6)))
