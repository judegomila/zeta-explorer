# analyze1.py <fn> <K> <prefix>   statistics of w_F on the Farey grid (test 1)
import sys, json, math, numpy as np
fn=sys.argv[1]; K=int(sys.argv[2]); pre=sys.argv[3]
PI=math.pi; EG=0.5772156649015329
def digam(x):
    s=0.0
    while x<12: s-=1/x; x+=1
    i=1/x; i2=i*i
    return s+math.log(x)-0.5*i-i2*(1/12-i2*(1/120-i2*(1/252-i2*(1/240-i2/132))))
PER={'chi4':[0,1,0,-1],'chi5':[0,1,-1,-1,1],'dh':[0,1,0.28407904384024578,-0.28407904384024578,-1]}
cond=1; res=0.0; gF=0.0; Jfun=None; meta={}
if fn=='zeta': res=1.0; gF=EG
elif fn in PER:
    c=PER[fn]; cond=len(c)
    def J(m,c=c,q=cond): return -sum(c[(m*r)%q]*digam(r/q) for r in range(1,q+1))/q   # sum_j c(mj)/j
    gF=J(1); Jfun=J
elif fn.startswith('nr:'):
    _,q,cc=fn.split(':'); q=int(q); cc=float(cc); cond=q
    P0=1+cc/math.sqrt(q)+1/q; P1=(cc/math.sqrt(q)+2/q)*math.log(q); res=P0; gF=EG*P0-P1
elif fn.startswith('gen:'):   # generic table produced by gen_tables.py: residue, constant passed in a json
    meta=json.load(open(pre+'_meta.json')); res=meta['res']; gF=meta['gF']; cond=meta.get('cond',1)
def Efun(x):
    x=np.asarray(x,dtype=float)
    if meta.get('terms') is not None and fn.startswith('gen:'):
        R=np.zeros(len(x),dtype=complex); Ri=np.zeros(len(x),dtype=complex)
        for cr,ci,pr,pi_ in meta['terms']:
            R+=(cr+1j*ci)*x**(pr+1j*pi_); Ri+=(cr+1j*ci)*x**(-(pr+1j*pi_))
        E=R+x*Ri
        return E.real if meta.get('part','re')=='re' else E.imag
    return (1+x)*(-gF/2+res/2*math.log(2*PI))+res/2*(1-x)*np.log(x)
fx=np.memmap(pre+'_fx.bin',dtype=np.float64,mode='r'); fw=np.memmap(pre+'_fw.bin',dtype=np.float64,mode='r'); fk=np.memmap(pre+'_fk.bin',dtype=np.int32,mode='r')
n=len(fx); out={'fn':fn,'K':K,'farey_count':int(n),'res':res,'gF':gF}
print('planned allocation: psi array %.2f GB (+ masked copies of x,k when conductor > 1)'%(n*8/1e9),file=sys.stderr)
psi=np.empty(n); CHK=20_000_000
for i0 in range(0,n,CHK): psi[i0:i0+CHK]=fw[i0:i0+CHK]+(2/PI)*Efun(np.asarray(fx[i0:i0+CHK]))
if cond>1:
    good=np.empty(n,dtype=bool)
    for i0 in range(0,n,CHK):
        kc=np.asarray(fk[i0:i0+CHK]); good[i0:i0+CHK]=np.isfinite(psi[i0:i0+CHK])&((kc%cond!=0) if fn.startswith('nr:') else (np.gcd(kc,cond)==1))
    x=np.asarray(fx)[good]; p=psi[good]; kk=np.asarray(fk)[good]; del psi,good
else:
    x=fx; p=psi; kk=fk
out['count_used']=int(len(x))
out['psi_rms']=float(np.sqrt(np.mean(p[::7]**2))); out['psi_min']=float(p.min()); out['psi_max']=float(p.max())
# (a) structure function over Farey-neighbour lags
edges=np.arange(-10.0,0.01,0.5); S2=np.zeros(len(edges)-1); S1=np.zeros(len(edges)-1); CN=np.zeros(len(edges)-1)
L=1
while L<len(x)//4:
    stride=max(1,(len(x)-L)//4000000)
    d=x[L::stride][:]-x[:-L:stride][:len(x[L::stride])]; D=p[L::stride]-p[:-L:stride][:len(p[L::stride])]
    b=np.digitize(np.log10(d),edges)-1; ok=(b>=0)&(b<len(S2))
    S2+=np.bincount(b[ok],weights=D[ok]**2,minlength=len(S2)); S1+=np.bincount(b[ok],weights=np.abs(D[ok]),minlength=len(S2)); CN+=np.bincount(b[ok],minlength=len(S2))
    L*=2
sf=[]
for i in range(len(S2)):
    if CN[i]>200: sf.append([float(edges[i]+0.25),float(S2[i]/CN[i]),float(S1[i]/CN[i]),int(CN[i])])
out['structure']=sf
def slope(lo,hi):
    pts=[(a,math.log10(b)) for a,b,_,_ in sf if lo<=a<=hi and b>0]
    if len(pts)<3: return None
    A=np.array(pts); return float(np.polyfit(A[:,0],A[:,1],1)[0]/2)
out['holder_L2_exponent_1e-7_1e-2']=slope(-7,-2); out['holder_L2_exponent_1e-8_1e-5']=slope(-8.3,-5); out['holder_L2_exponent_1e-4_1e-1']=slope(-4,-1)
# (b) jumps at small rationals
jl=[]
for qq in range(2,14):
    if cond>1 and math.gcd(qq,cond)>1: continue
    for pp in range(1,qq):
        if math.gcd(pp,qq)>1 or (cond>1 and math.gcd(pp,cond)>1): continue
        x0=pp/qq; i=np.searchsorted(x,x0-1e-15); 
        hit=(i<len(x) and abs(x[i]-x0)<1e-13)
        nn=min(400,len(x)//50); lo=p[max(0,i-nn):i]; hi=p[i+(1 if hit else 0):i+(1 if hit else 0)+nn]
        # nearest neighbours: use points within the closest nn on each side
        jump=float(hi[:nn//4].mean()-lo[-nn//4:].mean()); mid=float(p[i]) if hit else None
        pred=None
        if Jfun is not None: pred=-(2/PI)*(Jfun(pp)-Jfun(qq))/qq
        elif fn=='zeta': pred=0.0
        jl.append([pp,qq,jump,pred,mid,float(0.5*(hi[:nn//4].mean()+lo[-nn//4:].mean()))])
out['jumps']=jl
if jl and jl[0][3] is not None:
    out['jump_max_abs']=float(max(abs(j[2]) for j in jl)); out['jump_pred_max_err']=float(max(abs(j[2]-j[3]) for j in jl))
else: out['jump_max_abs']=float(max(abs(j[2]) for j in jl)) if jl else None
# (c) cusp wobble: bands around x0, denominators >= 200, local linear detrend, normalised by x0^2 and by x0
wb=[]
for x0 in [0.2,0.1,0.05,0.02,0.01,0.005,0.002,0.001]:
    m=(x>x0*0.98)&(x<x0*1.02)&(kk>=200)
    if m.sum()<200: continue
    xs=x[m]; ps=p[m]; A=np.vstack([np.ones_like(xs),xs-x0]).T; co=np.linalg.lstsq(A,ps,rcond=None)[0]; r=ps-A@co
    wb.append([x0,int(m.sum()),float(r.std()),float(r.std()/x0**2),float(r.std()/x0)])
out['cusp_wobble_x0_n_sd_sd/x0^2_sd/x0']=wb
# (d) Gauss-map orbits through the triangular table
W=np.memmap(pre+'_w.bin',dtype=np.float64,mode='r')
rng=np.random.default_rng(1); ns=200000
ks=rng.integers(K//2,K+1,size=4*ns); hs=(rng.random(4*ns)*ks).astype(np.int64)+1; hs=np.minimum(hs,ks-1)
okm=(np.gcd(hs,ks)==1)&(hs>=1); 
if cond>1: okm&=(np.gcd(ks,cond)==1)
ks=ks[okm][:ns]; hs=hs[okm][:ns]
# global smooth fit of psi (subsample)
st=max(1,len(x)//2000000); xs=x[::st]; ps=p[::st]
def basis(t): 
    lt=np.log(t); return np.vstack([np.ones_like(t),t,t*lt,t*t,t*t*lt,t**3]).T
co=np.linalg.lstsq(basis(xs),ps,rcond=None)[0]; out['smooth_fit_coef']=[float(v) for v in co]; out['smooth_fit_resid_rms']=float(np.std(ps-basis(xs)@co))
orb=[]; h=hs.copy(); k=ks.copy(); alive=np.ones(len(h),bool)
for step in range(8):
    idx=(k-1)*(k-2)//2+h-1; xv=h/k; wv=np.array(W[idx[alive]]); pv=wv+(2/PI)*Efun(xv[alive])
    okk=np.isfinite(pv)
    if cond>1: okk&=(np.gcd(k[alive],cond)==1)&(np.gcd(h[alive],cond)==1)
    r=pv[okk]-basis(xv[alive][okk])@co
    orb.append([step,int(okk.sum()),float(np.sqrt(np.mean(pv[okk]**2))),float(np.sqrt(np.mean(r**2))),float(np.sqrt(np.mean((r/np.maximum(xv[alive][okk],1e-9)**2)**2))) ])
    h2=k%h; k=h.copy(); h=h2; alive&=(h>=1)&(k>=2); h=np.where(alive,h,1); k=np.where(alive,k,2)
    if alive.sum()<1000: break
out['gauss_orbit_step_n_rmspsi_rmsresid_rms(resid/x^2)']=orb
# (e) skew-Toeplitz on a log grid: K_F(u) = psi(e^-u) pi^2/(4 e^{-u/2})
Dl=0.05; M=int(min(9.0,math.log(K)-0.6)/Dl); um=np.arange(M+1)*Dl; xm=np.exp(-um); xm[0]=1.0
ii=np.clip(np.searchsorted(x,xm),1,len(x)-1); ii=np.where(np.abs(x[ii-1]-xm)<np.abs(x[ii]-xm),ii-1,ii)
Km=p[ii]*PI**2/(4*np.sqrt(x[ii]))
# value at u=0 (x=1): limit from below
Km[0]=p[-1]*PI**2/4
xi=np.arange(0,60.0001,0.02); mm=np.arange(1,M+1)
wgt=np.ones(M); wgt[-1]=0.5
sym=Dl*(Km[0]+2*(np.cos(np.outer(xi,um[1:]))*(Km[1:]*wgt)).sum(1))      # ~ pi * Re X_F(xi)
dsym=-2*Dl*(np.sin(np.outer(xi,um[1:]))*(um[1:]*Km[1:]*wgt)).sum(1)
T=np.subtract.outer(um,um); idxm=np.abs(np.subtract.outer(np.arange(M+1),np.arange(M+1)))
Tm=T*Km[idxm]*Dl; ev=np.linalg.eigvalsh(1j*Tm); nrm=float(np.abs(ev).max()); sup=float(np.abs(dsym).max())
# tail model K(u) ~ e^{-u/2}(al + be u) fitted on the last 40 lags, extended to u = 60 for the symbol only
sel=slice(M-40,M+1); AA=np.vstack([np.exp(-um[sel]/2),um[sel]*np.exp(-um[sel]/2)]).T; tco=np.linalg.lstsq(AA,Km[sel],rcond=None)[0]
ut=np.arange(M+1,int(60/Dl)+1)*Dl; Kt=np.exp(-ut/2)*(tco[0]+tco[1]*ut)
xis=np.array([0,1,2,3,5,8,10,14.134725,17,21.022,25,30,40])
symt=Dl*(Km[0]+2*(np.cos(np.outer(xis,um[1:]))*Km[1:]).sum(1)+2*(np.cos(np.outer(xis,ut))*Kt).sum(1))/PI
out['toeplitz']={'Delta':Dl,'M':M,'norm_skew':nrm,'sup_slope_symbol':sup,'capture_ratio':nrm/sup,'xi_star':float(xi[np.abs(dsym).argmax()]),
   'ReX_at_xi':[[float(t),float(sym[int(round(t/0.02))]/PI)] for t in [0,1,2,3,5,8,10,14.134725,17,21.022,25,30,40]],
   'ReX_tail_extended':[[float(a),float(b)] for a,b in zip(xis,symt)],'K_u':[[float(um[j]),float(Km[j])] for j in range(0,M+1,10)]}
print(json.dumps(out))
