# Independent check of listed zeros (own Kronecker symbol; flint for search, mpmath for final residuals), plus different cases.
import flint, mpmath as mp, math, numpy as np
from flint import acb
from ref_common import *
FC={}
def fchar(D):
    if D not in FC:
        q=abs(D)
        for n in range(1,q):
            if math.gcd(n,q)!=1: continue
            c=flint.dirichlet_char(q,n)
            if all(abs(complex(c.chi(m) if hasattr(c,'chi') else c(m))-kron(D,m))<1e-9 for m in range(1,q) if math.gcd(m,q)==1):
                FC[D]=c; break
    return FC[D]
def L(D,s): return fchar(D).l(s)
def trace(X):
    Ds=neg_fund(X)
    return (lambda s: sum(((acb(math.sqrt(-D)/2)**s)*L(D,s) for D in Ds),acb(0))), Ds
def gen(D,d1,d2): return lambda s: s.zeta()*L(D,s)+L(d1,s)*L(d2,s)
def newton(f,z):
    for it in range(80):
        s=acb(z.real,z.imag); h=1e-6
        d=complex(f(s))/(complex(f(s+h)-f(s-h))/(2*h)); z=z-d
        if abs(d)<1e-13: break
    return z
def wind(f,c,rad,n=96):
    v=[complex(f(acb(c.real+rad*math.cos(2*math.pi*k/n),c.imag+rad*math.sin(2*math.pi*k/n)))) for k in range(n+1)]
    d=[np.angle(v[k+1]/v[k]) for k in range(n)]
    return round(sum(d)/(2*math.pi),6),round(max(abs(x) for x in d),3)
def mpB(Ds,s):
    return mp.fsum((mp.sqrt(-D)/2)**s*mp.dirichlet(s,chilist(D)) for D in Ds)
B200,Ds=trace(200); print('n_D',len(Ds),flush=True)
mp.mp.dps=20
for i,z in enumerate([(0.656138,21.135778),(0.857125,43.310912),(0.925668,37.759078),(1.178472,25.682320),(1.197421,35.884347),(1.793206,40.600627)]):
    r=newton(B200,complex(*z))
    line=f'listed {z}: root {r.real:.9f}+{r.imag:.9f}i shift {abs(r-complex(*z)):.1e} winding(r=0.03) {wind(B200,r,0.03)}'
    if i in (0,3): line+=f'  mpmath |B(root)|={float(abs(mpB(Ds,mp.mpc(r.real,r.imag)))):.1e}, |B(root+0.01)|={float(abs(mpB(Ds,mp.mpc(r.real+0.01,r.imag)))):.1e}'
    print(line,flush=True)
g15=gen(-15,-3,5)
for z in [(0.800011,12.038599),(0.927461,15.496634)]:
    r=newton(g15,complex(*z)); 
    m=abs(mp.zeta(mp.mpc(r.real,r.imag))*mp.dirichlet(mp.mpc(r.real,r.imag),chilist(-15))+mp.dirichlet(mp.mpc(r.real,r.imag),chilist(-3))*mp.dirichlet(mp.mpc(r.real,r.imag),chilist(5)))
    print('genus -15 listed',z,f'root {r.real:.9f}+{r.imag:.9f}i winding {wind(g15,r,0.03)} mpmath |g|={float(m):.1e}',flush=True)
tot=0.0
for m in range(-300,301):
    for n in range(-300,301):
        if m or n: tot+=(m*m+m*n+4*n*n)**-3.0
print('Epstein (1,1,4) at s=3:',tot,' vs zeta L(-15)+L(-3)L(5):',complex(g15(acb(3))).real)
tot=0.0
for (a,b,c) in [(1,1,6),(2,1,3),(2,-1,3)]:
    for m in range(-300,301):
        for n in range(-300,301):
            if m or n: tot+=(a*m*m+b*m*n+c*n*n)**-3.0
print('sum over Cl(-23) of Epstein at s=3:',tot,' vs 2 zeta(3) L(3,chi_-23):',2*complex(acb(3).zeta()*L(-23,acb(3))).real,flush=True)
def search(f,sig,ts,label):
    V=np.array([[complex(f(acb(float(a),float(t)))) for t in ts] for a in sig]); ph=np.angle(V)
    d=lambda a,b:((b-a)+np.pi)%(2*np.pi)-np.pi
    e=d(ph[:-1,:-1],ph[1:,:-1])+d(ph[1:,:-1],ph[1:,1:])+d(ph[1:,1:],ph[:-1,1:])+d(ph[:-1,1:],ph[:-1,:-1])
    W=np.rint(e/(2*np.pi)).astype(int); out=[]
    for i,j in zip(*np.nonzero(W)):
        r=newton(f,complex((sig[i]+sig[i+1])/2,(ts[j]+ts[j+1])/2))
        if r.real>0.5+1e-7 and all(abs(r-o)>1e-6 for o in out):
            out.append(r); print(label,f'off-line zero {r.real:.8f}+{r.imag:.8f}i |f|={abs(complex(f(acb(r.real,r.imag)))):.1e} winding(r=0.02) {wind(f,r,0.02)}',flush=True)
    print(label,'count off-line:',len(out),flush=True)
for X in (30,150):
    B,DX=trace(X); print('trace |D|<=',X,'n_D',len(DX))
    search(B,np.arange(0.5,2.0001,0.05),np.arange(0.1,40.0001,0.1),f'trace{X}')
search(gen(-35,-7,5),np.arange(0.5,1.5001,0.05),np.arange(0.1,30.0001,0.1),'genus-35 (x^2+xy+9y^2)')
