# Search for squarefree b = prod_{y <= p <= x} p violating |E1(b)| <= b/4 (float64 screen).
# Squarefree b: E1(b) = mu(b) b [ P (lnA - L/12) + rho ],  P = phi(b)/b, L = sum_{p|b} log p/(p-1),
# rho = sum_{e|b} mu(e) r(e)/e, 0 < rho <= r(1) = 1/4 - lnA.  Violation of the lower side  <=>  P (L/12 - lnA) - rho > 1/4;
# sufficient: P (L/12 - lnA) > 1/2 - lnA.
import numpy as np, math, sys, json
X=int(float(sys.argv[1])) if len(sys.argv)>1 else 150_000_000
lnA=0.2487544770337842625
print('planned memory %.2f GB'%(X/2/1e9+3*8*X/2/1e9/9))
sv=np.ones(X//2+1,dtype=np.uint8); sv[0]=0
for i in range(3,int(X**0.5)+1,2):
    if sv[i//2]: sv[i*i//2::i]=0
pr=np.concatenate(([2],2*np.nonzero(sv)[0]+1)).astype(np.float64); del sv
lp=np.log(pr); cl=np.concatenate(([0],np.cumsum(np.log1p(-1/pr)))); cL=np.concatenate(([0],np.cumsum(lp/(pr-1)))); cth=np.concatenate(([0],np.cumsum(lp)))
n=len(pr); thr=0.5-lnA
# check of the squarefree formula against e1scan dump
try:
    for l in open('loc_e1_3000.txt'):
        if l.startswith('D ') and 'nan' not in l.split()[3]:
            p=l.split(); b=int(p[1]); e1=float(p[2]); P=float(p[4]); L=float(p[5])
            if b in (5005%3001,2310,2730,1001,2999,30,6,35):
                om=sum(1 for q in range(2,b+1) if b%q==0 and all(q%t for t in range(2,int(q**.5)+1)))
                print('check b',b,'mu*E1/b',(-1)**om*e1,'P(lnA-L/12)',P*(lnA-L/12),'difference (=rho)',(-1)**om*e1-P*(lnA-L/12))
except FileNotFoundError: pass
best=None; rows=[]
for iy in list(range(0,2000))+list(range(2000,n,50)):
    # f(iy,ix) = exp(cl[ix]-cl[iy]) * ((cL[ix]-cL[iy])/12 - lnA), ix > iy ; find the first ix with f > thr
    f=np.exp(cl[iy+1:]-cl[iy])*((cL[iy+1:]-cL[iy])/12-lnA)
    k=np.argmax(f>thr)
    if f[k]>thr:
        ix=iy+1+k; rows.append((pr[iy],pr[ix-1],ix-iy,cth[ix]-cth[iy],float(f[k])))
        if best is None or rows[-1][3]<best[3]: best=rows[-1]
    if pr[iy]>30000: break
print('y, x, omega, log b, value (threshold %.10f)'%thr)
for r in rows[::max(1,len(rows)//40)]: print(r)
print('smallest log b on the grid:',best)
bx=min(rows,key=lambda r:r[1]); print('smallest x on the grid:',bx)
f=lambda r:[float(v) for v in r]; json.dump({'thr':thr,'best_logb':f(best),'best_x':f(bx),'rows':[f(r) for r in rows[::max(1,len(rows)//200)]]},open('ceiling_search.json','w'))
