# float sanity checks of the formalized statements (not a certificate)
import itertools, cmath, math, random
random.seed(1)
def stageZ(K,z):
    n=len(z); tot=0
    for r in range(n+1):
        for S in itertools.combinations(range(n),r):
            w=math.exp(sum(K[p][q] for p in S for q in S if p<q)); pr=1
            for p in S: pr*=z[p]
            tot+=w*pr
    return tot
n=4
K=[[0]*n for _ in range(n)]
for p in range(n):
    for q in range(p+1,n): K[p][q]=K[q][p]=random.random()
r=[sum(K[p][q] for q in range(n) if q!=p) for p in range(n)]
l=[random.uniform(.5,2) for _ in range(n)]; a=0.37
kap=[a*l[p]-r[p]/2 for p in range(n)]
def sp(s): return stageZ(K,[cmath.exp(kap[p]-s*l[p]) for p in range(n)])
s=complex(.9,2.3)
print("duality defect",abs(sp(2*a-s)-cmath.exp((s-a)*sum(l))*sp(s)))
# Lee-Yang: random search for minimum modulus inside the polydisc
mn=1e9
for _ in range(20000):
    z=[cmath.rect(random.random()*0.999*math.exp(-r[p]/2),random.uniform(0,2*math.pi)) for p in range(n)]
    mn=min(mn,abs(stageZ(K,z)))
print("min |Z| inside",mn)
# zeros of stage on the line: Newton from random starts
def newton(s):
    for _ in range(80):
        h=1e-6; f=sp(s); d=(sp(s+h)-sp(s-h))/(2*h)
        if d==0: break
        s-=f/d
    return s
dev=0;cnt=0
for _ in range(60):
    s=newton(complex(random.uniform(-1,2),random.uniform(0,30)))
    if abs(sp(s))<1e-9: cnt+=1; dev=max(dev,abs(s.real-a))
print("zeros",cnt,"max dev from line",dev)
# krein: one zero, negative square near rho
rho=complex(1,2)
def L(z): return 1/(z-rho)+1/(z+rho.conjugate())
def Kk(z,w): return (L(z)+L(w).conjugate())/(z+w.conjugate())
print("K(rho-eps),K(rho+eps)",Kk(rho-.1,rho-.1),Kk(rho+.1,rho+.1))
