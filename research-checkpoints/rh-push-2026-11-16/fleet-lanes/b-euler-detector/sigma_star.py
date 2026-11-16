"""Right edge sigma* of the zero set of a conjugate-pair twin F = c L(chi) + conj(c) L(chibar)  (Bohr-Kronecker).
Zero at abscissa sigma possible iff dist(T - B(sigma), 2 pi Z) <= Gamma(sigma), where for chi(p)=e^{i phi}, r=p^-sigma
  beta_p = arg(1 - e^{2 i phi} r^2),  gamma_p = arcsin( 2 r |sin phi| / |1 - e^{2 i phi} r^2| ),
B = sum beta_p, Gamma = sum gamma_p, T = arg(-c/conj c).
Run: python -I sigma_star.py"""
import math, cmath, json, sys
import numpy as np
from mpmath import e1

X=int(float(sys.argv[1])) if len(sys.argv)>1 else 10**8
def sieve(n):
    s=np.ones(n+1,bool); s[:2]=False
    for i in range(2,int(n**0.5)+1):
        if s[i]: s[i*i::i]=False
    return np.nonzero(s)[0]
PR=sieve(X); LOGP=np.log(PR.astype(float))

def primroot(q):
    n=q-1; fs=[l for l in range(2,n+1) if n%l==0 and all(l%d for d in range(2,int(l**0.5)+1))]
    g=2
    while any(pow(g,n//l,q)==1 for l in fs): g+=1
    return g

def setup(q,j):
    """chi_j(g)=exp(2 pi i j/(q-1)); returns per-prime phi array, parity a, root number eps, order"""
    g=primroot(q); n=q-1; ind=np.zeros(q,int); x=1
    for k in range(n): ind[x]=k; x=x*g%q
    cls=PR%q
    phi_cls=2*math.pi*((j*ind)%n)/n
    mask=cls!=0
    a=j%2
    tau=sum(cmath.exp(2j*math.pi*j*ind[m]/n)*cmath.exp(2j*math.pi*m/q) for m in range(1,q))
    eps=tau/((1j)**a*math.sqrt(q))
    order=n//math.gcd(n,j)
    avg_abs_sin=sum(abs(math.sin(phi_cls[m])) for m in range(1,q))/n
    return phi_cls[cls],mask,a,eps,order,avg_abs_sin

def BG(sig,phi,mask,avg_abs_sin,Pmin=0):
    m=mask&(PR>Pmin)
    r=np.exp(-sig*LOGP[m]); ph=phi[m]
    z=1-np.exp(2j*ph)*r*r
    B=np.angle(z).sum()
    G=np.arcsin(np.minimum(1.0,2*r*np.abs(np.sin(ph))/np.abs(z))).sum()
    if sig>1: G+=2*avg_abs_sin*float(e1((sig-1)*math.log(X)))      # PNT-in-APs tail p>X
    else: G=float('inf')
    return B,G

def dist(x):
    x=(x+math.pi)%(2*math.pi)-math.pi
    return abs(x)

def sigma_star(T,phi,mask,aas,Pmin=0,lo=1.0+1e-9,hi=4.0):
    g=lambda s:(lambda BGv: BGv[1]-dist(T-BGv[0]))(BG(s,phi,mask,aas,Pmin))
    # largest sigma with g>=0 : scan down
    s=hi; step=0.02
    if g(s)>=0: return None
    while s>lo and g(s)<0: s-=step
    if s<=lo: return lo
    a,b=s,s+step
    for _ in range(40):
        m=(a+b)/2
        if g(m)>=0: a=m
        else: b=m
    return (a+b)/2

out={}
# --- DH ---
kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
phi,mask,a,eps,order,aas=setup(5,1)   # g=2: chi(2)=i
T_dh=math.pi-2*math.atan(kappa)
print('q=5 eps',eps,'arg(-conj eps)',cmath.phase(-eps.conjugate()),'T_dh',T_dh)
s=sigma_star(T_dh,phi,mask,aas)
B,G=BG(s,phi,mask,aas)
out['DH']={'target':T_dh,'sigma_star':s,'B':B,'Gamma':G,'X':X,'kappa':kappa,'eps':[eps.real,eps.imag]}
print('DH sigma* =',s,B,G)
# sensitivity to X: recompute with primes <= X/10 and its tail
Xs=X
for XX in (10**6,10**7):
    if XX<X:
        m=PR<=XX
        def BGx(sig):
            r=np.exp(-sig*LOGP[m&mask]); ph=phi[m&mask]; z=1-np.exp(2j*ph)*r*r
            return np.angle(z).sum(), np.arcsin(2*r*np.abs(np.sin(ph))/np.abs(z)).sum()+2*aas*float(e1((sig-1)*math.log(XX)))
        aa,bb=1.0001,3.0
        for _ in range(50):
            mm=(aa+bb)/2; Bv,Gv=BGx(mm)
            if Gv-dist(T_dh-Bv)>=0: aa=mm
            else: bb=mm
        out['DH']['sigma_star_X%g'%XX]=aa; print('DH sigma* with X=',XX,aa)
# --- conjugate-pair twins: exactly the census list (jobs.txt: q, Conrey number m) ---
tw=[]
for line in open(__file__.replace('sigma_star.py','jobs.txt')):
    q,mc,_=line.split(); q=int(q); mc=int(mc); n=q-1
    g=primroot(q); x=1; j=None
    for k in range(n):
        if x==mc: j=k
        x=x*g%q
    phi,mask,a,eps,order,aas=setup(q,j)
    dens=(2/order) if order%2==0 else (1/order)
    for om in (1,-1):
        T=cmath.phase(-om*eps.conjugate())
        s=sigma_star(T,phi,mask,aas)
        tw.append({'q':q,'m':mc,'j':j,'order':order,'parity':a,'omega':om,'euler_density':dens,'target':T,'abs_target':abs(T),'sigma_star':s})
    print(q,mc,'done',len(tw),flush=True)
out['twins']=tw
json.dump(out,open(__file__.replace('.py','.json'),'w'),indent=1)
# summary: correlation of sigma* with |target| and with euler density
st=np.array([t['sigma_star'] for t in tw]); at=np.array([t['abs_target'] for t in tw]); de=np.array([t['euler_density'] for t in tw])
print('n twins',len(tw),'sigma* range',st.min(),st.max())
print('corr(sigma*,|target|)',np.corrcoef(st,at)[0,1],'corr(sigma*,euler density)',np.corrcoef(st,de)[0,1])
for d in sorted(set(de)): print('density %.4f n=%d mean sigma* %.4f min %.4f max %.4f'%(d,(de==d).sum(),st[de==d].mean(),st[de==d].min(),st[de==d].max()))
