# Referee checks (author's own pass). Ball arithmetic (python-flint, 200 bits) for the zeros; numpy for the cone.
import itertools, random, math
from flint import acb, arb, ctx
ctx.prec=200
def D(s,b):
    five=acb(5); r5=arb(5).sqrt()
    hz=lambda a: s.zeta(acb(a)/5)
    return five**(-s)*((1+r5)*s.zeta() + (1+b)*(hz(1)+hz(4)) + (1-b)*(hz(2)+hz(3)))
zs={1:[("0.77955720477142","61.168516694058"),("0.64175731846256","75.399476729498"),("0.80864531659783","110.62267403368")],
   -1:[("0.8489474419559","23.704150225033"),("0.82447176687542","57.108111490387"),("0.90941525726984","85.651691851739")]}
for b,l in zs.items():
    for re,im in l:
        s=acb(arb(re),arb(im)); v=D(s,b)
        # derivative by central difference to estimate distance to the true zero
        h=acb(arb("1e-20")); dv=(D(s+h,b)-D(s-h,b))/(2*h)
        print("b=%d s=%s+%si |D| <= %s  |D'| ~ %s  est. distance %s"%(b,re,im,abs(v).upper().str(5),abs(dv).mid().str(5),(abs(v)/abs(dv)).upper().str(3)))
# argument principle on a small square around the first zero of D_1 (ball arithmetic along the boundary, 400 points)
import cmath
def winding(c,rad,b,n=400):
    pts=[]
    for k in range(n):
        u=4*k/n
        if u<1: z=complex(-rad+2*rad*u,-rad)
        elif u<2: z=complex(rad,-rad+2*rad*(u-1))
        elif u<3: z=complex(rad-2*rad*(u-2),rad)
        else: z=complex(-rad,rad-2*rad*(u-3))
        pts.append(complex(D(acb(c.real+z.real,c.imag+z.imag),b)))
    tot=0; mn=min(abs(p) for p in pts)
    for k in range(n):
        tot+=cmath.phase(pts[(k+1)%n]/pts[k])
    return tot/(2*math.pi), mn
for b,c in ((1,complex(0.77955720477142,61.168516694058)),(-1,complex(0.8489474419559,23.704150225033))):
    w,mn=winding(c,0.05,b); print("b=%d winding number on square of half-side 0.05: %.6f, min |D| on boundary %.4f"%(b,w,mn))
# cone check: random points of K_F (q=5, even coordinates) are non-negative combinations of the four rays
import numpy as np
c1=math.cos(2*math.pi/5); c2=math.cos(4*math.pi/5); r5=math.sqrt(5)
Fe=np.array([[1,2,2],[1,2*c1,2*c2],[1,2*c2,2*c1]])/r5
rays=np.array([[1,0,0],[1,1,1],[1+r5,2,0],[1+r5,0,2]],float)
print("F rays:",np.round(Fe@rays.T,6).T.tolist())
# facets of cone(rays): normals from pairs of rays with all rays on one side
fac=[]
for i,j in itertools.combinations(range(4),2):
    n=np.cross(rays[i],rays[j])
    for sg in (1,-1):
        if np.all(rays@(sg*n)>-1e-12): fac.append(sg*n/np.linalg.norm(n))
print("facets of cone(rays):",len(fac))
random.seed(1); bad=0; inside=0
for _ in range(200000):
    v=np.array([random.random(),random.random(),random.random()])
    if np.all(Fe@v>=0):
        inside+=1
        if not all(f@v>-1e-12 for f in fac): bad+=1
    else:
        if all(f@v>1e-12 for f in fac): bad+=1
print("random v>=0: in K_F",inside,"of 200000; disagreements with cone(rays):",bad)
