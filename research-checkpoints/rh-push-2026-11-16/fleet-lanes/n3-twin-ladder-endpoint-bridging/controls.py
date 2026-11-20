"""Controls. (1) multiplicativity defect of theta^w coefficients (exact, rational polynomials in w).
(2) DH kernel: interior zeros in the upper half-plane (no eta-quotient / no w=0 Dirichlet endpoint).
(3) theta_3: no interior zero found by the same search (control of the search)."""
from fractions import Fraction as Fr
import cmath, math, random
# ---------- (1) exact coefficients of theta^w as polynomials in w
N = 30
def pmul(a,b):
    r=[Fr(0)]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        if x:
            for j,y in enumerate(b): r[i+j]+=x*y
    return r
def padd(a,b):
    n=max(len(a),len(b)); return [(a[i] if i<len(a) else 0)+(b[i] if i<len(b) else 0) for i in range(n)]
def pscale(a,c): return [x*c for x in a]
th=[Fr(0)]*(N+1); th[0]=Fr(1)
k=1
while k*k<=N: th[k*k]=Fr(2); k+=1
# f = theta^w: n f_n = sum_{k=1..n} (w k - (n-k)) th_k f_{n-k}
f=[[Fr(1)]]
for n in range(1,N+1):
    acc=[Fr(0)]
    for k in range(1,n+1):
        if th[k]:
            acc=padd(acc, pmul([Fr(-(n-k))*th[k], Fr(k)*th[k]], f[n-k]))
    f.append(pscale(acc, Fr(1,n)))
def ev(p,w): return sum(c*w**i for i,c in enumerate(p))
print("r_w(1..6) at w=1:", [ev(f[n],Fr(1)) for n in range(1,7)], " at w=2:", [ev(f[n],Fr(2)) for n in range(1,7)])
# normalised a(n) = r_w(n)/(2w): defect D_{m,n}(w) = 2w r_w(mn) - r_w(m) r_w(n)  (polynomial; zero iff a(mn)=a(m)a(n))
def defect(m,n): return padd(pmul([Fr(0),Fr(2)], f[m*n]), pscale(pmul(f[m],f[n]),Fr(-1)))
def roots_int(p): return [w for w in range(-2,30) if ev(p,Fr(w))==0]
import numpy as np
for (m,n) in [(2,3),(2,5),(3,5),(2,7),(3,4)]:
    D=defect(m,n)
    rr=np.roots([float(c) for c in D[::-1]])
    print(f"defect({m},{n}) degree {len(D)-1}; integer roots {roots_int(D)}; real roots", sorted(round(x.real,6) for x in rr if abs(x.imag)<1e-7))
# generator coefficients c(m) = d/dw r_w(m) at w=0 and the claimed formula
def cform(m):
    s=Fr(0)
    for k in range(1,m+1):
        if m%k==0:
            d=m//k
            s+= Fr(-1,k) if d%2==0 else Fr(2*(-1)**(k+1),k)
    return s
print("c(m)=d/dw r_w(m)|0 matches triple-product formula for m<=30:", all(f[m][1]==cform(m) for m in range(1,N+1)))
# ---------- (2) DH kernel zeros in upper half-plane
s5=math.sqrt(5); xi=(math.sqrt(10-2*s5)-2)/(s5-1)
a=[0,1,xi,-xi,-1]
def phiDH(tau, d=False):
    v=0; dv=0
    y=tau.imag; nmax=int(math.sqrt(5*40/(math.pi*y)))+10
    for n in range(1,nmax):
        c=a[n%5]
        if c:
            e=c*n*cmath.exp(1j*math.pi*n*n*tau/5); v+=e; dv+=e*1j*math.pi*n*n/5
    return (v,dv) if d else v
def th3(tau, d=False):
    v=1; dv=0
    y=tau.imag; nmax=int(math.sqrt(40/(math.pi*y)))+10
    for n in range(1,nmax):
        e=2*cmath.exp(1j*math.pi*n*n*tau); v+=e; dv+=e*1j*math.pi*n*n
    return (v,dv) if d else v
def argcount(fn, x0,x1,y0,y1, M=4000):
    pts=[complex(x0+(x1-x0)*i/M,y0) for i in range(M)]+[complex(x1,y0+(y1-y0)*i/M) for i in range(M)]+\
        [complex(x1-(x1-x0)*i/M,y1) for i in range(M)]+[complex(x0,y1-(y1-y0)*i/M) for i in range(M)]
    tot=0; prev=fn(pts[0]); first=prev
    for p in pts[1:]+[pts[0]]:
        v=fn(p); tot+=cmath.phase(v/prev); prev=v
    return tot/(2*math.pi)
print("DH kernel positive on the imaginary axis tau=iy (y=t^2), min over y in [0.05,20] of phi*exp(pi y/5):",
      min((phiDH(1j*y).real*math.exp(math.pi*y/5)) for y in [0.05+0.01*i for i in range(2000)]))
print("zeros of DH kernel in box Re tau in [0,10] (one period), Im tau in [0.08,3]:", round(argcount(phiDH,0,10,0.08,3,20000),6))
print("zeros of theta_3 in box Re tau in [0,2] (one period), Im tau in [0.08,3]:", round(argcount(th3,0,2,0.08,3,20000),6))
random.seed(1); found=[]
for trial in range(400):
    z=complex(random.uniform(0,10), random.uniform(0.1,1.2))
    for it in range(60):
        v,dv=phiDH(z,True)
        if dv==0: break
        z2=z-v/dv
        if z2.imag<0.06 or z2.imag>5: break
        if abs(z2-z)<1e-14: z=z2; break
        z=z2
    else: continue
    if abs(phiDH(z))<1e-10 and 0.06<z.imag<5:
        zr=complex(z.real%10, z.imag)
        if all(abs(zr-u)>1e-6 for u in found): found.append(zr)
found.sort(key=lambda u:-u.imag)
print("interior zeros of the DH kernel found (tau mod 10), top by Im:", [(round(u.real,10),round(u.imag,10)) for u in found[:8]], "count", len(found))
# exact factorisation check of defect(2,3)
D=defect(2,3)
P=[Fr(1)]
for r in (0,0,0,1,2,4,8): P=pmul(P,[Fr(-r),Fr(1)])
lead=D[-1]
print("defect(2,3) == lead * w^3 (w-1)(w-2)(w-4)(w-8) exactly:", all(D[i]==lead*P[i] for i in range(len(D))) and len(D)==len(P), " lead =", lead)
