# Pivot check: square-class rows of the product-index array. Exact integers; largest array 8*(1e6+1) bytes x 3.
import numpy as np, math, sys
sys.argv=[sys.argv[0]]
NMAX=1_000_000
print("PLAN: recompute c(n), n<=%d (two int64 arrays of 8 MB); relation check over p in {3,5,7,13,17}"%NMAX)
def theta_counts(a,b,c,r,s,t,N):
    H=np.array([[2*a,t,s],[t,2*b,r],[s,r,2*c]],dtype=float); Hi=np.linalg.inv(H)
    Bx,By,Bz=[int(math.sqrt(2*N*Hi[i,i]))+1 for i in range(3)]
    x=np.arange(-Bx,Bx+1,dtype=np.int64)[None,:]; y=np.arange(-By,By+1,dtype=np.int64)[:,None]
    base=a*x*x+b*y*y+t*x*y; cnt=np.zeros(N+1,dtype=np.int64)
    for z in range(0,Bz+1):
        v=base+c*z*z+r*y*z+s*x*z; v=v[v<=N]; bc=np.bincount(v,minlength=N+1); cnt+= bc if z==0 else 2*bc
    return cnt
c=(theta_counts(3,15,15,-14,-2,-2,NMAX)-theta_counts(4,11,12,0,4,0,NMAX))//2
ap={3:-1,5:1,7:-2,13:4,17:-2}
def leg(a,p):
    a%=p
    if a==0: return 0
    return 1 if pow(a,(p-1)//2,p)==1 else -1
# Shimura relation, weight 3/2: c(n p^2) = a_p c(n) - (-n/p) c(n) - p c(n/p^2)
for p,a in ap.items():
    bad=0;tot=0
    for n in range(1,NMAX//(p*p)+1):
        rhs=a*int(c[n])-leg(-n,p)*int(c[n])-(p*int(c[n//(p*p)]) if n%(p*p)==0 else 0)
        tot+=1; bad+= (int(c[n*p*p])!=rhs)
    print("p=%2d: c(n p^2) = (a_p - (-n/p)) c(n) - p c(n/p^2): %d cases, %d mismatches"%(p,tot,bad))
# correlation of row d0 with row d0 k^2 and with unrelated rows, columns m squarefree, coprime to 2*3*5*7*11*d0
def row(d,cols): 
    v=np.array([c[d*m] for m in cols],dtype=float); return v
def corr(u,v):
    den=math.sqrt((u*u).sum()*(v*v).sum()); return float((u*v).sum()/den) if den>0 else float('nan')
for d0 in (3,23,31):
    cols=[m for m in range(1,NMAX//(49*d0)) if math.gcd(m,2*3*5*7*11*d0)==1]
    r0=row(d0,cols)
    print("d0=%d, %d columns: corr(row d0, row 9 d0) %+.3f ; (25 d0) %+.3f ; (49 d0) %+.3f ; unrelated rows 5 d0: %+.3f, 7 d0: %+.3f, 13 d0: %+.3f ; null %.3f"
          %(d0,len(cols),corr(r0,row(9*d0,cols)),corr(r0,row(25*d0,cols)),corr(r0,row(49*d0,cols)),corr(r0,row(5*d0,cols)),corr(r0,row(7*d0,cols)),corr(r0,row(13*d0,cols)),1/math.sqrt(len(cols))))
