# Check of Theorem A on a finite model with a MULTIPLE off-axis zero.
# L(z) = sum m_rho/(z-rho); kernel K(z,w) = (L(z)+conj L(w))/(z+conj w) on Re z>0.
# Prediction: negative squares = number of DISTINCT zeros in Re z>0 = number of zeros of 1+alpha L in Re z>0 (with mult).
import mpmath as mp, random
mp.mp.dps = 120
axis = [mp.mpc(0,g) for g in (1,-1,2.5,-2.5,4,-4,6,-6)]
quart = lambda r: [r, r.conjugate(), -r, -r.conjugate()]
zs = [(r,1) for r in axis] + [(r,1) for r in quart(mp.mpc('0.7','3'))] + [(r,2) for r in quart(mp.mpc('0.4','5'))] + [(r,3) for r in quart(mp.mpc('1.1','0.8'))]
distinct_rhp = sum(1 for r,m in zs if r.real>0); mult_rhp = sum(m for r,m in zs if r.real>0)
print("distinct RHP zeros:", distinct_rhp, " with multiplicity:", mult_rhp)
L = lambda z: sum(m/(z-r) for r,m in zs)
# zeros of 1+alpha L: numerator polynomial  prod(z-r) + alpha * sum m prod_{others}
def polymul(a,b):
    c=[mp.mpc(0)]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b): c[i+j]+=x*y
    return c
def numer(alpha):
    full=[mp.mpc(1)]
    for r,m in zs: full=polymul(full,[1,-r])
    tot=full[:]
    for k,(r,m) in enumerate(zs):
        p=[mp.mpc(1)]
        for j,(r2,m2) in enumerate(zs):
            if j!=k: p=polymul(p,[1,-r2])
        p=[mp.mpc(0)]+p
        tot=[tot[i]+alpha*m*p[i] for i in range(len(tot))]
    return tot
for alpha in ('0.01','0.3','1','7','300'):
    r = mp.polyroots(numer(mp.mpf(alpha)), maxsteps=2000, extraprec=600)
    print(" alpha=%-5s zeros of 1+alpha L: RHP %d  LHP %d  on-axis(|Re|<1e-30) %d" % (alpha, sum(1 for x in r if x.real>mp.mpf(10)**-30), sum(1 for x in r if x.real<-mp.mpf(10)**-30), sum(1 for x in r if abs(x.real)<=mp.mpf(10)**-30)))
random.seed(7)
for n in (16, 24, 30):
    pts=[mp.mpc(random.uniform(0.05,2.5), random.uniform(-8,8)) for _ in range(n)]
    Lv=[L(z) for z in pts]
    M=mp.matrix(n,n)
    for i in range(n):
        for j in range(n): M[i,j]=(Lv[i]+Lv[j].conjugate())/(pts[i]+pts[j].conjugate())
    ev=mp.eigh(M, eigvals_only=True); top=max(abs(e) for e in ev)
    tol=mp.mpf(10)**-70
    print(" n=%d Gram of K_L: pos %d neg %d (|ev|<tol: %d)  most negative/top %s  smallest |neg|/top %s" % (n, sum(1 for e in ev if e>tol*top), sum(1 for e in ev if e<-tol*top), sum(1 for e in ev if abs(e)<=tol*top), mp.nstr(min(ev)/top,5), mp.nstr(max([e for e in ev if e<-tol*top])/top,5)))
# single-pair model: Hankel norm alpha/sqrt(alpha^2+sigma^2) = |Res_b S|/(2 Re b)
for al,sg in (('1','0.5'),('0.2','0.05'),('3','0.01')):
    al=mp.mpf(al); sg=mp.mpf(sg); rho=mp.mpc(sg,2)
    Lp=lambda z: 1/(z-rho)+1/(z+rho.conjugate())
    b=mp.findroot(lambda z: 1+al*Lp(z), mp.mpc(sg*sg/(2*al),2))
    res=2/(al*mp.diff(Lp,b))
    print(" pair model alpha=%s sigma=%s: |Res|/(2Re b) = %s   alpha/sqrt(alpha^2+sigma^2) = %s" % (al,sg, mp.nstr(abs(res)/(2*b.real),15), mp.nstr(al/mp.sqrt(al*al+sg*sg),15)))
