# T4: Pick matrices of Theta_X on sets where the diagonal is positive.  T5: off-line zeros of xi_X = E_X + E_X^#.
import mpmath as mp, numpy as np, json, cmath, math, random, sys
from stage import PR, Lam, theta_p, theta_arch, Theta
out={}
# ---------- T4
mp.mp.dps=120
def pick(X,pts):
    th=[Theta(s,X) for s in pts]; n=len(pts)
    M=mp.matrix(n,n)
    for i in range(n):
        for j in range(n):
            M[i,j]=(1-th[i]*mp.conj(th[j]))/(pts[i]+mp.conj(pts[j])-1)
    ev=mp.eigh(M,eigvals_only=True)
    return max(abs(t) for t in th), [mp.nstr(e,5) for e in ev[:4]], sum(1 for e in ev if e<0), mp.nstr(ev[-1],5)
T4=[]
for X,box in ((2,(0.6,0.9,13.0,15.0)),(5,(0.6,0.9,13.5,15.0)),(47,(0.6,0.9,14.2,14.8)),(2,(0.55,0.95,200.0,203.0))):
    for n1,n2 in ((3,3),(4,5),(5,8)):
        pts=[mp.mpc(box[0]+(box[1]-box[0])*i/(n1-1), box[2]+(box[3]-box[2])*j/(n2-1)) for i in range(n1) for j in range(n2)]
        mx,low,neg,top=pick(X,pts)
        T4.append(dict(X=X,box=box,N=n1*n2,max_abs_theta=mp.nstr(mx,6),lowest_eigs=low,n_negative=neg,top_eig=top))
        print(T4[-1],flush=True)
out['T4_pick']=T4
# ---------- T5 grid search for zeros of 1+Theta_X off the line
mp.mp.dps=30
from mpmath import fp
def theta_grid(X,sig,t):
    S,T=np.meshgrid(sig,t,indexing='ij'); s=S+1j*T
    lg=np.vectorize(lambda z: complex(fp.loggamma(complex(z))),otypes=[complex])
    logth=(-(1-s)/2*math.log(math.pi)+lg((1-s)/2))-(-(s)/2*math.log(math.pi)+lg(s/2))
    th=np.exp(logth)
    for p in PR:
        if p>X: break
        th*= (1-p**(-s))/(1-p**(s-1))
    return s,th
T5=[]
sig=np.arange(0.51,1.60,0.01); tt=np.arange(0.05,60.0,0.02)
print('T5 grid',len(sig),'x',len(tt),'complex128 =',len(sig)*len(tt)*16/1e6,'MB',flush=True)
for X in (2,3,5,7,11,13,23,47,101,499):
    s,th=theta_grid(X,sig,tt); a=np.abs(1+th)
    frac_exp=float(np.mean(np.abs(th[(sig<1.0),:])>1))
    cand=[]
    for i in range(1,len(sig)-1):
        row=a[i]
        idx=np.where((row[1:-1]<row[:-2])&(row[1:-1]<row[2:])&(row[1:-1]<a[i-1,1:-1])&(row[1:-1]<a[i+1,1:-1])&(row[1:-1]<0.5))[0]+1
        for j in idx: cand.append(complex(sig[i],tt[j]))
    roots=[]
    for c in cand:
        try:
            r=mp.findroot(lambda z:1+Theta(z,X),mp.mpc(c),tol=1e-20,maxsteps=40)
        except Exception: continue
        if r.real>0.5+1e-6 and 0<r.imag<60 and abs(1+Theta(r,X))<1e-15 and all(abs(r-q)>1e-6 for q in roots): roots.append(r)
    roots.sort(key=lambda z:z.imag)
    T5.append(dict(X=X,frac_strip_grid_with_abs_theta_gt_1=round(frac_exp,4),n_offline_zeros_right_half_t_lt_60=len(roots),
                   zeros=[mp.nstr(r,12) for r in roots[:12]]))
    print(T5[-1],flush=True)
out['T5_offline_zeros']=T5
json.dump(out,open('zeros_pick.json','w'),indent=1)
