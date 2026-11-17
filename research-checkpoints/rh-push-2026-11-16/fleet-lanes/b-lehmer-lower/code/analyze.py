# analyze.py agg.npz [polish.npy] : tables of extremes + GUE / prime-phase comparisons. Prints a text report and writes json.
import sys, json, numpy as np, math, mpmath as mp
mp.mp.dps=40
agg=np.load(sys.argv[1]); pol=np.load(sys.argv[2]) if len(sys.argv)>2 and sys.argv[2]!="-" else None
tag=sys.argv[3] if len(sys.argv)>3 else "run"
OSF=8; NNB=40
JT={int(j):int(t) for j,t in zip(agg['j'],agg['T0'])}
JH={int(j):float(h) for j,h in zip(agg['j'],agg['h'])}
HMAP={int(t):float(h) for t,h in zip(agg['T0'],agg['h'])}
def hof(jcol): return np.array([JH[int(j)] for j in jcol])
def exactT(jcol): return np.array([JT[int(j)] for j in jcol],dtype=object)
recs=agg["recs"]; hist=agg["hist"]; nown=agg["nown"]; expc=agg["expc"]; T0s=agg["T0"]; js=agg["j"]
N=int(nown.sum()); Tmid=float(T0s.mean()); L=math.log(Tmid/(2*math.pi)); h0=float(agg["h"][0])
out={"tag":tag,"N":N,"T_first":int(T0s.min()),"T_last":int(T0s.max()),"L=log(T/2pi)":L,"windows":len(js)}
disc=nown-expc
out["count_check"]={"sum_disc":float(disc.sum()),"mean_disc":float(disc.mean()),"sd_disc":float(disc.std()),"min_disc":float(disc.min()),"max_disc":float(disc.max()),
  "unresolved":int(len(agg["unres"])),"gaps_ge_6":int(agg["over"].sum())}
print(json.dumps(out,indent=1))
# --- small gaps vs GUE
LBK=1.57314
def cdf_gue(x): return (math.pi**2/9)*x**3-(2*math.pi**4/225)*x**5+(math.pi**6/2205)*x**7
print("\nSMALL GAPS  x, observed #(delta<x), GUE expected, ratio, 1-12*Lbk/L^2 =",1-12*LBK/L**2)
sg=[]
d=recs[:,4]
for x in (0.001,0.002,0.003,0.005,0.01,0.015,0.02,0.03):
    o=int((d<x).sum()); e=N*cdf_gue(x)
    sg.append([x,o,e,o/e,1/math.sqrt(max(o,1))]); print(f"{x:6.3f} {o:9d} {e:12.2f} ratio {o/e:7.4f} +- {1/math.sqrt(max(o,1)):.4f}")
out["small_gaps"]=sg
cum=np.cumsum(hist); edges=np.arange(1,len(hist)+1)*0.002
for x in (0.05,0.1,0.2):
    i=int(round(x/0.002))-1; print(f"{x:6.3f} {int(cum[i]):12d}  (histogram; GUE series not valid)")
# --- running record
order=np.argsort(js); 
jr=recs[:,0].astype(int)
cumN=np.cumsum(nown[order]); jsorted=js[order]
rr=[]
for tgt in (1e7,3e7,1e8,3e8,1e9,3e9,1e10,3e10):
    k=np.searchsorted(cumN,tgt)
    if k>=len(cumN):
        if tgt>cumN[-1]*1.5: continue
        k=len(cumN)-1
    sel=np.isin(jr,jsorted[:k+1]); Nn=int(cumN[k]); dm=float(d[sel].min()); pred=(9/(math.pi**2*Nn))**(1/3)
    rr.append([Nn,dm,pred,dm/pred]); print(f"N={Nn:.3e} delta_min={dm:.6f} GUE scale (9/pi^2N)^(1/3)={pred:.6f} ratio {dm/pred:.3f}")
out["running_min"]=rr
# --- top pairs with CSV bound
def csv_lambda(r,a=None,b=None):
    h=r[10]; nb=r[11:].copy(); mid=0.5*(r[2]+r[3])
    A=nb[NNB] if a is None else a; B=nb[NNB+1] if b is None else b   # kappa rel. to mid
    oth=np.concatenate([nb[:NNB],nb[NNB+2:]])
    g=(1/(A-oth)**2+1/(B-oth)**2).sum()
    rho=2.0/OSF
    DL=(A-nb[0])+0.5/rho; DR=(nb[-1]-B)+0.5/rho
    g+=2*rho*(1/DL+1/DR)
    gx=g/(4*h*h); Dx=2*h*(B-A)
    q=1.25*Dx*Dx*gx
    lam=((1-q)**0.8-1)/(8*gx) if q<0.8 else float("nan")
    return Dx,gx,q,lam
top=np.argsort(d)[:40]
polmap={}
if pol is not None:
    for p in pol:
        if p[10]==1: polmap[int(p[0])]=p
print("\nTOP PAIRS: rank, t (T0+tau), delta (nufft), delta (direct), gamma-gap, Z*, Z'a, Z'b, Delta^2 g, lambda_CSV, -Delta^2/8")
tp=[]
for rk,i in enumerate(top):
    r=recs[i]; h=r[10]; T0=JT[int(r[0])]; mid=0.5*(r[2]+r[3])*h
    th1=math.pi/(OSF*h)*2  # theta' = 2pi/(OSF h)
    if i in polmap:
        p=polmap[i]; gap=p[4]; dd=gap*(2*math.pi/(OSF*h))/math.pi; zst=p[8]; da,db=p[5],p[6]
        sh=int(round(mid)); T1=T0+sh; loc=f"{T1}+{p[7]:.9f}"
        a=-0.5*gap/h; b=0.5*gap/h
        Dx,gx,q,lam=csv_lambda(r,a,b)
    else:
        gap=(r[3]-r[2])*h; dd=float("nan"); zst=r[8]; da,db=r[5]/h,r[6]/h; loc=f"{T0}+{mid:.6f}"
        Dx,gx,q,lam=csv_lambda(r)
    tp.append(dict(rank=rk+1,loc=loc,delta_nufft=float(r[4]),delta_direct=float(dd),gap=float(gap),Zstar=float(zst),dZa=float(da),dZb=float(db),D2g=float(q/1.25),lam=float(lam),approx=float(-Dx*Dx/8),flag=int(r[9])))
    if rk<25: print(f"{rk+1:3d} {loc:32s} {r[4]:.7f} {dd:.7f} {gap:.4e} Z*={zst:+.3e} {da:+.3e} {db:+.3e} D2g={q/1.25:.3e} lam={lam:.4e} {-Dx*Dx/8:.4e}")
out["top_pairs"]=tp
# all-record CSV lambda (nufft accuracy) -> best
lams=np.array([csv_lambda(r)[3] for r in recs[np.argsort(d)[:3000]]])
out["lambda_best_nufft"]=float(np.nanmax(lams)); print("best (largest) CSV lambda over top-3000 pairs (nufft accuracy):",np.nanmax(lams))
# --- triples
trip=agg["trip"]; s2=trip[:,5]; it=np.argsort(s2)[:10]
print("\nTRIPLES (three consecutive zeros, span s2 in mean spacings)")
def R3(y1,y2):
    S=lambda x: mp.sinc(mp.pi*x)
    Mx=mp.matrix([[1,S(y1),S(y2)],[S(y1),1,S(y2-y1)],[S(y2),S(y2-y1),1]]); return mp.det(Mx)
def trip_expect(x):
    f=lambda y2: mp.quad(lambda y1: R3(y1,y2),[0,y2])
    return float(mp.quad(f,[0,x]))
c3=float(R3(mp.mpf("0.01"),mp.mpf("0.023"))/(mp.pi**6*(mp.mpf("0.01")*mp.mpf("0.023")*mp.mpf("0.013"))**2))
print("sine-kernel R3 ~ c3 pi^6 (y1 y2 (y2-y1))^2, c3 =",c3,"(4/135 =",4/135,")")
tl=[]
for i in it:
    T0=JT[int(trip[i,0])]
    tl.append([T0,float(trip[i,3]*HMAP[T0]),float(s2[i])]); print(f"  t={T0}+{trip[i,3]*HMAP[T0]:.4f} s2={s2[i]:.5f}")
tc=[]
for x in (0.15,0.2,0.25,0.3):
    o=int((s2<x).sum()); e=N*trip_expect(x); tc.append([x,o,e]); print(f"  s2<{x}: observed {o} expected GUE {e:.2f} ratio {o/e if e>0 else float('nan'):.3f} +- {1/math.sqrt(max(o,1)):.3f}   CUE(N_eff) factor (1-1/N^2)^2(1-4/N^2) = {(1-12*LBK/L**2)**2*(1-48*LBK/L**2):.3f}")
out["triples"]={"top":tl,"counts":tc,"c3":c3}
# --- largest gaps, max |Z|
big=agg["big"]; ib=np.argsort(big[:,4])[-10:][::-1]
print("\nLARGEST GAPS"); bl=[]
for i in ib:
    Tb=JT[int(big[i,0])]; bl.append([Tb,float(big[i,2]*HMAP[Tb]),float(big[i,4])]); print(f"  t={Tb}+{big[i,2]*HMAP[Tb]:.3f} delta={big[i,4]:.5f}")
print("  GUE-scale sqrt(8 ln N)/pi =",math.sqrt(8*math.log(N))/math.pi)
out["largest_gaps"]=bl
iz=np.argsort(agg["zmax"])[-5:][::-1]
print("\nMAX |Z| on grid"); zl=[]
for i in iz:
    zl.append([int(T0s[i]),float(agg["zmaxk"][i]*agg["h"][i]),float(agg["zmax"][i])]); print(f"  T0={int(T0s[i])} tau={agg['zmaxk'][i]*agg['h'][i]:.3f} |Z|={agg['zmax'][i]:.2f}")
out["max_Z"]=zl
# --- environment of close pairs: density of other zeros at distance y (mean spacings) from pair midpoint
print("\nENVIRONMENT: density of other zeros at distance y from a close pair (delta<0.01), vs GUE rho_c(y)=1-S^2-(3/pi^2)S'^2")
sel=recs[d<0.01]
nb=np.concatenate([sel[:,11:11+NNB],sel[:,11+NNB+2:]],axis=1)*(2.0/OSF)
yb=np.arange(0,4.0001,0.2); hh=np.histogram(np.abs(nb).ravel(),bins=yb)[0]/(2*len(sel)*0.2)
def rhoc(y):
    S=np.sinc(y); Sp=(np.cos(np.pi*y)*np.pi*y-np.sin(np.pi*y))/(np.pi*y*y)
    return 1-S*S-(3/np.pi**2)*Sp*Sp
env=[]
for k in range(len(hh)):
    ys=np.linspace(yb[k],yb[k+1],201)[1:]; pr=float(rhoc(ys).mean()); err=math.sqrt(max(hh[k]*2*len(sel)*0.2,1))/(2*len(sel)*0.2)
    env.append([float(yb[k]),float(yb[k+1]),float(hh[k]),pr,err]); print(f"  y in [{yb[k]:.1f},{yb[k+1]:.1f}): obs {hh[k]:.4f} +- {err:.4f}   GUE {pr:.4f}")
out["environment"]={"npairs":int(len(sel)),"bins":env}
adjL=(sel[:,11+NNB]-sel[:,11+NNB-1])*(2.0/OSF); adjR=(sel[:,11+NNB+2]-sel[:,11+NNB+1])*(2.0/OSF)
print("  mean adjacent gap left/right:",adjL.mean(),adjR.mean(),"  min of the two (mean):",np.minimum(adjL,adjR).mean())
out["environment"]["adj_mean"]=[float(adjL.mean()),float(adjR.mean())]
# --- prime phases
print("\nPRIME PHASES: mean cos(t log p), sin(t log p) over pair midpoints; Landau baseline a_p=-log p/(sqrt p L); local-density prediction 4 a_p")
primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,4,8,9,25,27,6,10,15]
LAM={4:(2,2),8:(2,3),9:(3,2),25:(5,2),27:(3,3)}
def a_of(n):
    if n in LAM: p,k=LAM[n]; return -math.log(p)/(math.sqrt(n)*L)
    if n in (6,10,15): return 0.0
    return -math.log(n)/(math.sqrt(n)*L)
SECOND={6:(2,3),10:(2,5),15:(3,5)}
ph0={}
for p in primes:
    lp=mp.log(p); ph0[p]={j:float(mp.fmod(mp.mpf(T)*lp,2*mp.pi)) for j,T in JT.items()}
def phase_stats(R,tcol_kappa,label,pred_mult=None):
    res=[]
    T=R[:,0].astype(np.int64); tau=tcol_kappa
    for p in primes:
        ph=np.array([ph0[p][int(t)] for t in T])+tau*math.log(p)
        c=np.cos(ph); s=np.sin(ph); a=a_of(p)
        res.append([p,float(c.mean()),float(s.mean()),float(1/math.sqrt(2*len(R))),a])
        print(f"  {label} n={p:2d} <cos>={c.mean():+.4f} <sin>={s.mean():+.4f} +-{1/math.sqrt(2*len(R)):.4f}  a_n={a:+.4f}  ratio={(c.mean()/a if a!=0 else float('nan')):6.2f}"+(f"  second-order pred 12 a_p a_q={12*a_of(SECOND[p][0])*a_of(SECOND[p][1]):+.4f}" if p in SECOND else ""))
    return res
for thr in (0.03,0.01):
    R=recs[d<thr]
    out[f"prime_phase_pairs_{thr}"]=phase_stats(R,0.5*(R[:,2]+R[:,3])*R[:,10],f"pairs d<{thr} (n={len(R)})")
# weighted fit of ratio
R=recs[d<0.03]
num=0; den=0
for p,c,s,e,a in out["prime_phase_pairs_0.03"]:
    num+=c*a; den+=a*a
# per-prime drift: fit ratio = m0*(1 - kappa*(log p/L)^2) over primes
xs=np.array([(math.log(p)/L)**2 for p,c,s,e,a in out["prime_phase_pairs_0.03"] if p not in LAM and p not in SECOND]); ys=np.array([c/a for p,c,s,e,a in out["prime_phase_pairs_0.03"] if p not in LAM and p not in SECOND]); ws=np.array([(a/e)**2 for p,c,s,e,a in out["prime_phase_pairs_0.03"] if p not in LAM and p not in SECOND])
A=np.vstack([np.ones_like(xs),xs]).T; cov=np.linalg.inv(A.T@(A*ws[:,None])); coef=cov@(A.T@(ws*ys))
print("  drift fit ratio(p) = c0 + c1*(log p/L)^2: c0=%.3f+-%.3f c1=%.1f+-%.1f"%(coef[0],math.sqrt(cov[0,0]),coef[1],math.sqrt(cov[1,1])))
out["pair_drift_fit"]=[float(coef[0]),float(math.sqrt(cov[0,0])),float(coef[1]),float(math.sqrt(cov[1,1]))]
print("  least-squares multiplier m in <cos> = m a_p (pairs d<0.03):",num/den,"+-",out["prime_phase_pairs_0.03"][0][3]/math.sqrt(den))
out["pair_multiplier"]=[num/den,out["prime_phase_pairs_0.03"][0][3]/math.sqrt(den)]
# big gaps
B=big[big[:,4]>3.4]
if len(B)>20:
    sm=float(B[:,4].mean())
    print(f"  big gaps (delta>3.4, n={len(B)}, mean delta {sm:.3f}); local-density prediction multiplier ~ 1-pi^2 s^2/4 = {1-math.pi**2*sm**2/4:.1f}")
    out["prime_phase_biggaps"]=phase_stats(B,0.5*(B[:,2]+B[:,3])*hof(B[:,0]),"big gaps"); out["biggaps_mean_delta"]=sm; out["biggaps_n"]=int(len(B))
Tt=trip[trip[:,5]<0.3]
if len(Tt)>20:
    print(f"  triples (s2<0.3, n={len(Tt)}); local-density prediction multiplier 9")
    out["prime_phase_triples"]=phase_stats(Tt,Tt[:,3]*hof(Tt[:,0]),"triples")
    num=sum(c*a for p,c,s_,e,a in out["prime_phase_triples"]); den=sum(a*a for p,c,s_,e,a in out["prime_phase_triples"])
    print("  least-squares multiplier (triples):",num/den,"+-",out["prime_phase_triples"][0][3]/math.sqrt(den)); out["triple_multiplier"]=[num/den,out["prime_phase_triples"][0][3]/math.sqrt(den)]
json.dump(out,open(tag+"_analysis.json","w"),indent=1)
