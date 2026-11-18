# e2-gl3-cover-cuspidal-rows, first decisive test. Single process. numpy only. Run through scripts/memcap.sh 8.
# Objects: E = 11a (eta(z)^2 eta(11z)^2), g = (theta_Q2 - theta_Q1)/2 of weight 3/2 (Gross 1987 construction; forms
# found by find_form.py), central values L(E_d, 1) by the approximate functional equation.
import numpy as np, math, json, sys, time
t0=time.time()
NMAX = 1_000_000     # range of c(n)
DMAX = 10_000        # |d| range for the approximate functional equation
out = {}
def log(*a):
    print(*a); sys.stdout.flush()

# ---------- planned cost / memory
log("PLAN: theta counts to NMAX=%d: per z-slab array <= (2*Bx+1)*(2*By+1) int64; printed below; AFE: sum_d 15|d| terms" % NMAX)

# ---------- 1. ternary theta series, exact counts
def theta_counts(a,b,c,r,s,t,N):
    H = np.array([[2*a,t,s],[t,2*b,r],[s,r,2*c]],dtype=float)
    Hi = np.linalg.inv(H)
    Bx,By,Bz = [int(math.sqrt(2*N*Hi[i,i]))+1 for i in range(3)]
    log("  form",(a,b,c,r,s,t),"box",Bx,By,Bz,"slab bytes",8*(2*Bx+1)*(2*By+1))
    x = np.arange(-Bx,Bx+1,dtype=np.int64)[None,:]
    y = np.arange(-By,By+1,dtype=np.int64)[:,None]
    base = a*x*x + b*y*y + t*x*y
    cnt = np.zeros(N+1,dtype=np.int64)
    for z in range(0,Bz+1):       # z and -z give the same counts (v -> -v symmetry): weight 2 for z>0
        v = base + c*z*z + r*y*z + s*x*z
        v = v[(v<=N)]
        bc = np.bincount(v,minlength=N+1)
        cnt += bc if z==0 else 2*bc
    return cnt
th1 = theta_counts(4,11,12,0,4,0,NMAX)
th2 = theta_counts(3,15,15,-14,-2,-2,NMAX)
diff = th2-th1
assert np.all(diff%2==0) and diff[0]==0
c = diff//2
log("g = sum c(n) q^n, first terms:", [(n,int(c[n])) for n in range(1,40) if c[n]])
assert np.all(c[np.arange(NMAX+1)%4==1]==0) and np.all(c[np.arange(NMAX+1)%4==2]==0)
log("plus-space support (c(n)=0 for n=1,2 mod 4): holds to", NMAX, " time %.1fs"%(time.time()-t0))

# ---------- 2. a_n of 11a
NA = 15*DMAX+10
def pent(N):
    P = np.zeros(N+1,dtype=np.int64); k=0
    while True:
        e1=k*(3*k-1)//2; e2=k*(3*k+1)//2
        if e1>N: break
        P[e1]+= (-1)**k
        if k>0 and e2<=N: P[e2]+=(-1)**k
        k+=1
    return P
P = pent(NA)
def mul(A,B,N):
    R = np.zeros(N+1,dtype=np.int64)
    for i in np.nonzero(B)[0]:
        R[i:] += B[i]*A[:N+1-i]
    return R
P2 = mul(P,P,NA)
P11 = np.zeros(NA+1,dtype=np.int64); P11[::11] = P2[:len(P11[::11])]
F = mul(P2,P11,NA)
a = np.zeros(NA+2,dtype=np.int64); a[1:] = F[:NA+1]     # a_n = coefficient of q^n in q*prod
log("a_n(11a):", a[1:14].tolist(), " (expect 1,-2,-1,2,1,2,-2,0,-2,-2,1,-2,4)")

# ---------- 3. fundamental discriminants, Kronecker symbols, AFE
def kron(d,n):   # Kronecker symbol (d/n), n>=0, d fundamental discriminant
    if n==0: return 1 if abs(d)==1 else 0
    res=1
    v=0
    while n%2==0: n//=2; v+=1
    if v:
        if d%2==0: return 0
        if v%2 and d%8 in (3,5): res=-res
    # Jacobi (d/n), n odd positive
    aa=d%n; m=n
    while aa:
        while aa%2==0:
            aa//=2
            if m%8 in (3,5): res=-res
        aa,m=m,aa
        if aa%4==3 and m%4==3: res=-res
        aa%=m
    return res if m==1 else 0
def squarefree_sieve(N):
    sf = np.ones(N+1,dtype=bool); mu = np.ones(N+1,dtype=np.int64)
    isp = np.ones(N+1,dtype=bool); isp[:2]=False
    for p in range(2,N+1):
        if isp[p]:
            isp[2*p::p]=False
            mu[p::p]*=-1
            if p*p<=N: mu[p*p::p*p]=0
    return mu,isp
mu,isp = squarefree_sieve(NMAX)
def is_fund(d):
    D=abs(d)
    if d%4==1: return mu[D]!=0
    if d%4==0:
        m=d//4
        return (m%4 in (2,3)) and mu[abs(m)]!=0
    return False
funds=[d for d in range(-DMAX,DMAX+1) if d not in (0,) and is_fund(d) and d%11!=0]
cost=sum(15*abs(d) for d in funds)
log("AFE PLAN: %d fundamental d, |d|<=%d, 11 not | d; total terms %d (float64), chi tables sum|d| = %d python Kronecker calls" % (len(funds),DMAX,cost,sum(abs(d) for d in funds)))
sq11=math.sqrt(11.0)
Lval={}; wsign={}
inv_n = 1.0/np.arange(1,NA+1)
for d in funds:
    D=abs(d)
    w = kron(d,11)*(1 if d>0 else -1)      # root number of E x chi_d: w_E chi_d(-11), w_E=+1
    wsign[d]=w
    if w==-1: Lval[d]=0.0; continue
    tab=np.array([kron(d,n) for n in range(D)],dtype=np.float64)
    M=15*D
    n=np.arange(1,M+1)
    chi=tab[n%D]
    Lval[d]=2.0*float(np.sum(a[1:M+1]*chi*inv_n[:M]*np.exp(-2*math.pi*n/(D*sq11))))
log("L(E,1) =", Lval[1], "(reference 0.2538418608559...)  time %.1fs"%(time.time()-t0))
out["L_E_1"]=Lval[1]

# ---------- 4. Waldspurger / Gross check: L(E_d,1) sqrt|d| / c(|d|)^2 constant for d<0, w=+1
rat=[]; zero_ok=0; zero_tot=0; vanish_L=0
for d in funds:
    if d>0: continue
    D=-d
    if wsign[d]==-1:
        zero_tot+=1; zero_ok+= (c[D]==0)
    else:
        if c[D]!=0: rat.append(Lval[d]*math.sqrt(D)/float(c[D])**2)
        else:
            vanish_L+=1
            if abs(Lval[d])>1e-6: log("  MISMATCH c=0 but L!=0 at d",d,Lval[d])
rat=np.array(rat)
log("Waldspurger check, d<0, w=+1: n=%d, ratio L sqrt|d|/c^2: min %.12f max %.12f ; c(|d|)=0 with L=0 numerically: %d ; w=-1: c(|d|)=0 in %d of %d" % (len(rat),rat.min(),rat.max(),vanish_L,zero_ok,zero_tot))
out["waldspurger"]={"n":len(rat),"ratio_min":float(rat.min()),"ratio_max":float(rat.max()),"c0_L0":vanish_L,"wminus_c0":[int(zero_ok),zero_tot]}
kappa=float(np.median(rat))
neg=[d for d in funds if Lval[d]< -1e-8]
log("negative central values: %d of %d (min %.3e)"%(len(neg),len(funds),min(Lval.values())))

rng=np.random.default_rng(20261118)
# ---------- 5. correlation with mu(d) chi_d(m)
def fund_neg_list(N):
    res=[]
    for D in range(3,N+1):
        if is_fund(-D) and D%11!=0: res.append(D)
    return res
Dl=np.array(fund_neg_list(NMAX))
kr11=np.array([kron(-int(D),11) for D in Dl])
Dl=Dl[kr11==-1]                                   # family where w=+1 (c may be nonzero)
ct=c[Dl]/Dl**0.25
muD=np.where(Dl%4==0, mu[Dl//4]*0+0, 0)
muD=np.array([mu[D] if D%4 else -mu[D//4] if (D//4)%2==0 else mu[D//4] for D in Dl])   # mu of the squarefree kernel (for 4|D: kernel D/4 if odd, D/4 has one factor 2 otherwise -> mu(D/4))
muD=np.array([mu[D] if D%4 else mu[D//4] for D in Dl])
log("family: %d discriminants -D, D<=%d, chi_{-D}(11)=-1; c(D)=0 for %d; mean c~^2 = %.4f; mean c~ = %.5f" % (len(Dl),NMAX,int(np.sum(ct==0)),float(np.mean(ct**2)),float(np.mean(ct))))
ms=[m for m in range(1,60) if math.gcd(m,22)==1]
def zs(vec, weight):
    # z-score of sum vec*weight against independent random signs on vec
    return float(np.sum(vec*weight)/math.sqrt(np.sum((vec*weight)**2)+1e-300))
rows=[]
for XX in (10_000,100_000,NMAX):
    sel=Dl<=XX
    zc=[];zl=[];zr=[];zplain=[];zsgn=[]
    eps=rng.choice([-1.0,1.0],size=int(sel.sum()))
    for m in ms:
        chi=np.array([kron(-int(D),m) for D in Dl[sel]],dtype=float) if XX<=100_000 or m<=13 else None
        if chi is None: continue
        zc.append(zs(ct[sel], muD[sel]*chi))            # signed c~(D) against mu chi
        zplain.append(zs(ct[sel], chi))                 # signed c~(D) against chi alone
        zsgn.append(zs(np.sign(ct[sel]), muD[sel]*chi))
        zl.append(zs(ct[sel]**2 - np.mean(ct[sel]**2), muD[sel]*chi))   # central values (unsigned) against mu chi
        zr.append(zs(eps*np.abs(ct[sel]), muD[sel]*chi))   # control: random signs
    f=lambda z:(float(np.max(np.abs(z))),float(np.sqrt(np.mean(np.array(z)**2))))
    log("D<=%7d (n=%6d, %2d columns m): z-scores max|z| / rms : c~ vs mu*chi %.2f/%.2f | c~ vs chi %.2f/%.2f | sign(c) vs mu*chi %.2f/%.2f | L-value vs mu*chi %.2f/%.2f | random signs %.2f/%.2f"
        % ((XX,int(sel.sum()),len(zc))+f(zc)+f(zplain)+f(zsgn)+f(zl)+f(zr)))
    rows.append({"X":XX,"n":int(sel.sum()),"cols":len(zc),"c_mu_chi":f(zc),"c_chi":f(zplain),"sign_mu_chi":f(zsgn),"L_mu_chi":f(zl),"random":f(zr)})
    # normalised correlation coefficient for m=1
    cc=float(np.sum(ct[sel]*muD[sel])/math.sqrt(np.sum(ct[sel]**2)*sel.sum()))
    log("     correlation coefficient of c~(D) with mu(D) (m=1): %.5f ; 1/sqrt(n) = %.5f" % (cc,1/math.sqrt(sel.sum())))
out["corr"]=rows

# ---------- 6. absorption statistic: does p -> c(D0 p) carry -chi_{-D0}(p) c(D0)?
primes=[p for p in range(3,NMAX) if isp[p] and p!=11]
ab=[]
for D0 in [3,4,15,20,23,31,47,56,59,67,71]:
    if c[D0]==0: continue
    ps=[p for p in primes if D0*p<=NMAX and D0%p and is_fund(-D0*p if ((D0*p)%4==3 or (D0*p)%4==0) else D0*p) ]
    # -D0 p must be a negative fundamental discriminant: need D0*p = 0,3 mod 4 and fundamental
    ps=[p for p in ps if is_fund(-D0*p)]
    v=np.array([c[D0*p]/(D0*p)**0.25 for p in ps]); chi=np.array([kron(-D0,p) for p in ps],dtype=float)
    nz=float(np.mean(v!=0))
    rho=float(np.sum(v*chi)/math.sqrt(len(ps)*np.sum(v*v)))
    rho1=float(np.sum(v)/math.sqrt(len(ps)*np.sum(v*v)))
    ab.append({"D0":D0,"c":int(c[D0]),"primes":len(ps),"rho_chi":rho,"rho_1":rho1,"null":1/math.sqrt(len(ps)),"frac_nonzero":nz})
    log("D0=%3d c(D0)=%3d primes p (D0 p<=NMAX, -D0 p fundamental): %6d ; corr of c~(D0 p) with chi_{-D0}(p): %+.4f ; with 1: %+.4f ; null 1/sqrt(n) %.4f ; nonzero fraction %.3f (absorption needs -1)"%(D0,int(c[D0]),len(ps),rho,rho1,1/math.sqrt(len(ps)),nz))
out["absorption"]=ab

# ---------- 7. Gram spectra
def spec(A,name):
    A=A.astype(float)
    nr=np.sqrt((A*A).sum(1)); keep=nr>0; A=A[keep]/nr[keep][:,None]
    G=A@A.T
    sv=np.linalg.svd(A,compute_uv=False)
    off=G[~np.eye(len(G),dtype=bool)]
    r={"name":name,"rows":int(A.shape[0]),"cols":int(A.shape[1]),"sv":[float(x) for x in sv[:4]],"sv1sq_over_rows":float(sv[0]**2/A.shape[0]),
       "off_rms":float(np.sqrt(np.mean(off**2))),"off_max":float(np.max(np.abs(off))),"pairs_gt_0.5":int(np.sum(np.abs(off)>0.5)//2)}
    log("  %-46s rows %4d cols %4d sv %.3f %.3f %.3f %.3f  sv1^2/rows %.4f  off rms/max %.3f/%.3f  pairs>0.5 %d"%(name,r["rows"],r["cols"],*r["sv"],r["sv1sq_over_rows"],r["off_rms"],r["off_max"],r["pairs_gt_0.5"]))
    return r
gram=[]
# (A) product-index rows  a(d,m) = c~(d m),  d,m squarefree odd, coprime to 11
RD=[d for d in range(1,500) if mu[d]!=0 and d%2 and d%11]
CM=[m for m in range(1,2000) if mu[m]!=0 and m%2 and m%11]
log("Gram PLAN: product-index matrix %d x %d float64 = %.1f MB" % (len(RD),len(CM),8*len(RD)*len(CM)/1e6))
idx=np.outer(RD,CM)
g2=np.gcd.outer(np.array(RD),np.array(CM))
cn=c/np.maximum(np.arange(NMAX+1),1)**0.25
A=np.where(g2==1,cn[idx],0.0)
gram.append(spec(A,"product-index rows c~(dm), (d,m)=1"))
epsn=rng.choice([-1.0,1.0],size=NMAX+1)
gram.append(spec(np.where(g2==1,(epsn*np.abs(cn))[idx],0.0),"control: random signs eps_n |c~(n)| at n=dm"))
gram.append(spec(np.where(g2==1,np.abs(cn)[idx],0.0),"control: |c~(dm)| (signs removed)"))
symb=np.array([[kron(-d if d%4==3 else -4*d, m) for m in CM] for d in RD],dtype=float)
gram.append(spec(A*symb,"c~(dm) times symbol (D_d/m)"))
mum=np.array([mu[m] for m in CM],dtype=float)
gram.append(spec(A*mum[None,:],"c~(dm) mu(m) (column signs; Gram identical)"))
gram.append(spec(rng.choice([-1.0,1.0],size=A.shape),"random signs"))
# (B) central-value rows: a(d,m) = L(1/2, E x chi_d)^(1/2)-scaled symbol table and coefficient rows a_m chi_d(m)
FD=[d for d in funds if wsign[d]==1 and Lval[d]>1e-9 and abs(d)<=3000]
CM2=[m for m in range(1,2001)]
log("Gram PLAN: symbol matrix %d x %d float64 = %.1f MB" % (len(FD),len(CM2),8*len(FD)*len(CM2)/1e6))
S=np.array([[kron(d,m) for m in CM2] for d in FD],dtype=float)
lam=a[1:2001]/np.sqrt(np.arange(1,2001))
Lrow=np.array([Lval[d] for d in FD])
gram.append(spec(S,"symbol table chi_d(m)"))
gram.append(spec(S*Lrow[:,None],"L(1/2,E x chi_d) chi_d(m) (row scaling; same after normalisation)"))
gram.append(spec(S*lam[None,:],"lambda_E(m) chi_d(m) (coefficients of L(s,E x chi_d))"))
gram.append(spec(S*np.abs(lam)[None,:],"control: |lambda_E(m)| chi_d(m)"))
# unnormalised: correlation of column m of the central-value array with mu(d) chi_d(m)
FDall=[d for d in funds if wsign[d]==1]
Lr=np.array([Lval[d] for d in FDall]); Lr0=Lr-Lr.mean()
mud=np.array([mu[abs(d)] if d%4 else mu[abs(d)//4] for d in FDall],dtype=float)
zz=[]
for m in ms:
    chi=np.array([kron(d,m) for d in FDall],dtype=float)
    zz.append(zs(Lr0,mud*chi))
log("AFE central values, %d fundamental d (both signs, w=+1, |d|<=%d): z-scores of sum_d (L_d - mean) mu(d) chi_d(m), %d columns: max|z| %.2f rms %.2f; mean L %.4f" % (len(FDall),DMAX,len(ms),max(abs(z) for z in zz),math.sqrt(np.mean(np.array(zz)**2)),Lr.mean()))
out["afe_mu_chi"]={"n":len(FDall),"max":max(abs(z) for z in zz),"rms":math.sqrt(float(np.mean(np.array(zz)**2)))}
out["gram"]=gram
json.dump(out,open("test1.json","w"),indent=1)
log("done, total time %.1fs"%(time.time()-t0))
