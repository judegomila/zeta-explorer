# Combination 4. d(c; sigma, eta, K) = upper bound for
#   min over admissible window modifications W of  sup_t |log R_W(sigma + it)|,   R_W = zeta_W / zeta,
# W: two adjacent on-line zeros 1/2 + i(c -+ g0/2) replaced by the quartet 1/2 +- eta + i(c + delta) (and conjugates),
#    K neighbouring on-line zeros moved along the line by x_j, |x_j| <= (smallest adjacent gap)/4, |delta| <= g0/2;
#    R_W(1) = 1 imposed as a weighted equation (residue and functional equation of zeta are kept exactly by construction).
# Exact model: every factor (s - rho)(s - conj rho) is included. Levenberg-Marquardt in mpmath, penalty continuation.
# Any feasible W gives an upper bound for the minimum; the reported value is the sup of the exact |log R_W| on a fine grid.
# usage: window.py out.json [quick]
import sys, json, math
from mpmath import mp, mpf, mpc, log, matrix, lu_solve, pi, zetazero
mp.dps=70
def build(c,zs,eta,K,bfac=0.25):
    """zs: sorted on-line ordinates around c (mpf). Central pair = the two nearest c on either side."""
    lo=max(i for i,z in enumerate(zs) if z<=c); a,b=lo,lo+1
    idx=[]; l=a-1; r=b+1
    while len(idx)<K:
        idx.append(r); r+=1
        if len(idx)<K: idx.append(l); l-=1
    idx=sorted(idx)
    bounds=[min(zs[i]-zs[i-1],zs[i+1]-zs[i])*bfac for i in idx]
    return dict(c=(zs[a]+zs[b])/2,g0=zs[b]-zs[a],ga=zs[a],gb=zs[b],nb=[zs[i] for i in idx],B=bounds,eta=mpf(eta))
def logR(P,x,s):
    """exact log(zeta_W/zeta)(s); x = [x_1..x_K, delta]"""
    h=mpc(0.5,0)
    f=lambda g: (s-h-1j*g)*(s-h+1j*g)
    eta=P['eta']; cp=P['c']+x[-1]
    q=lambda sg: (s-h-sg*eta-1j*cp)*(s-h-sg*eta+1j*cp)
    v=log(q(1))+log(q(-1))-log(f(P['ga']))-log(f(P['gb']))
    for g,xx in zip(P['nb'],x[:-1]): v+=log(f(g+xx))-log(f(g))
    return v
def jac(P,x,s):
    h=mpc(0.5,0); eta=P['eta']; cp=P['c']+x[-1]; J=[]
    for g,xx in zip(P['nb'],x[:-1]):
        gg=g+xx; J.append(-1j/(s-h-1j*gg)+1j/(s-h+1j*gg))
    d=0
    for sg in (1,-1): d+=-1j/(s-h-sg*eta-1j*cp)+1j/(s-h-sg*eta+1j*cp)
    J.append(d); return J
def solve(P,sigma,verbose=False,warm=None,maxit=120):
    """bounded minimisation with x_j = B_j sin(v_j) (always feasible); Levenberg-Marquardt on the sampled L2 cost.
    warm: dict ordinate -> x from a smaller K (nested start), and 'delta'."""
    from mpmath import sin, cos, asin
    K=len(P['nb']); n=K+1; a=mpf(sigma)-mpf(0.5)
    span=(max(P['nb'])-min(P['nb']))/2 if K else P['g0']
    Hw=span+3*a; M=max(40,6*n)
    pts=[mpc(sigma,P['c']+Hw*(2*mpf(i)/(M-1)-1)) for i in range(M)]
    wts=[mpf(1)]*M+[mpf(1000)]; pts.append(mpc(1,0))
    Bs=P['B']+[P['g0']/2]
    v=[mpf(0)]*n
    if warm:
        for j,g in enumerate(P['nb']):
            if g in warm: v[j]=asin(max(mpf(-1),min(mpf(1),warm[g]/Bs[j])))
        v[-1]=asin(max(mpf(-1),min(mpf(1),warm['delta']/Bs[-1])))
    X=lambda v:[Bs[j]*sin(v[j]) for j in range(n)]
    def resid(v):
        x=X(v); return [w*logR(P,x,s) for w,s in zip(wts,pts)]
    def supnorm(x,fac=1,N=400):
        return max(abs(logR(P,x,mpc(sigma,P['c']+fac*Hw*(2*mpf(i)/(N-1)-1)))) for i in range(N))
    r=resid(v); cost=sum(abs(q)**2 for q in r); lam=None; small=0
    for it in range(maxit):
        x=X(v)
        A=matrix(2*len(pts),n); bvec=matrix(2*len(pts),1)
        for i,(w,s) in enumerate(zip(wts,pts)):
            Jr=jac(P,x,s)
            for j in range(n):
                q=w*Jr[j]*Bs[j]*cos(v[j]); A[2*i,j]=q.real; A[2*i+1,j]=q.imag
            bvec[2*i,0]=r[i].real; bvec[2*i+1,0]=r[i].imag
        N_=A.T*A; rhs=-(A.T*bvec)
        dg=max(N_[j,j] for j in range(n))
        if lam is None: lam=dg*mpf(10)**-3
        improved=False
        for tr in range(12):
            N2=N_.copy()
            for j in range(n): N2[j,j]+=lam
            try: dv=lu_solve(N2,rhs)
            except ZeroDivisionError: lam*=10; continue
            v2=[v[j]+dv[j] for j in range(n)]; r2=resid(v2); c2=sum(abs(q)**2 for q in r2)
            if c2<cost:
                rel=(cost-c2)/cost; v,r,cost=v2,r2,c2; lam/=5; improved=True; break
            lam*=6
        if not improved: break
        small=small+1 if rel<1e-3 else 0
        if verbose and it%5==0: print('   it %d cost %.3e lam %.1e'%(it,float(cost),float(lam)))
        if small>=4: break
    x=X(v); sn=supnorm(x); sn_far=supnorm(x,fac=20,N=1200)
    wd={g:xx for g,xx in zip(P['nb'],x[:-1])}; wd['delta']=x[-1]
    return dict(sup=float(sn),sup_far=float(sn_far),absR1=float(abs(logR(P,x,mpc(1,0)))),maxrel=float(max(abs(x[j]/Bs[j]) for j in range(n))),
                delta=float(x[-1]),sup0=float(supnorm([mpf(0)]*n)),iters=it+1),wd
def lattice(c,nside=40):
    g=2*pi/log(mpf(c)/(2*pi)); return [mpf(c)+(mpf(i)+mpf(0.5))*g for i in range(-nside,nside)],g
def nearest_index(c):
    # index n with gamma_n ~ c : N(T) ~ T/2pi log(T/2pi e) + 7/8
    return int(c/(2*math.pi)*math.log(c/(2*math.pi*math.e))+0.875)
if __name__=='__main__':
    quick=len(sys.argv)>2
    out={'rows':[]}
    sig_list=[2.0,3.0,1.5,1.1]; K_list=[0,2,4,8,16,24]
    cases=[]
    for c in (1e3,1e5):
        n0=nearest_index(c); zs=[zetazero(n).imag for n in range(n0-20,n0+21)]
        cc=(zs[19]+zs[20])/2
        cases.append(('zeta_zeros',float(cc),zs)); print('real zeros near',c,'done',flush=True)
    for c in [1e3,1e6,1e9,1e12,1e20,1e50]:
        zs,g=lattice(c); cases.append(('lattice',c,zs))
    for bfac in (0.25,2.0):
        for kind,c,zs in cases:
            for sigma in sig_list:
                for eta in ([0.1] if (sigma!=2.0 or kind!='lattice') else [0.1,0.02,0.25]):
                    warm=None
                    for K in K_list:
                        if K+4>len(zs)-2: continue
                        P=build(mpf(c),zs,eta,K,bfac)
                        r,warm=solve(P,sigma,warm=warm); r.update(kind=kind,c=c,sigma=sigma,eta=eta,K=K,bfac=bfac,g0=float(P['g0']))
                        out['rows'].append(r); print(json.dumps(r),flush=True)
                        json.dump(out,open(sys.argv[1],'w'),indent=0)
