# analysis of rmc outputs. usage: analyze.py <outdir> <B for mode A> [prefix of mode A file]
import numpy as np, math, sys, json, os, subprocess, glob
import mpmath as mp
od=sys.argv[1]; B=int(sys.argv[2]); pre=sys.argv[3] if len(sys.argv)>3 else "z"
RMC=os.environ.get("RMC","./rmc_local")
EG=0.57721566490153286061; C=(math.log(2*math.pi)-EG)/2; K=1.5*C-0.25; KA=1.5*C-0.375; R={}
ar=np.load("cert_arith.npz"); mu=ar["mu"]; om=ar["om"]; phi=ar["phi"]; Farith=ar["Farith"]
def P(*a):
    print(*a); sys.stdout.flush()
# ---------------- mode A ----------------
f=os.path.join(od,pre+"_all.bin")
if os.path.exists(f):
    S,Sa,Q,M=np.fromfile(f).reshape(4,B+1)
    bb=np.arange(B+1); b=bb.astype(float)
    out=subprocess.run([RMC,"X"],input="".join("1 %d\n"%k for k in range(2,B+1)),capture_output=True,text=True).stdout.split("\n")
    V1=np.zeros(B+1); V1[2:]=[-float(l.split()[0]) for l in out[:B-1]]          # V(1,b) = -c0(1/b)
    ph=phi[:B+1].astype(float); F=Farith[:B+1]-(math.pi/2)*(S-V1)                 # F(b) = sum_{a=2}^{b-1} I(a,b)
    m=bb>=3; kap=np.zeros(B+1); kap[m]=F[m]/(ph[m]*b[m])
    P("== combination 1: kappa(b) = F(b)/(phi(b) b), all 3 <= b <= %d"%B)
    P("   K = %.10f; kappa(B) = %.10f; min kappa = %.6f at b = %d"%(K,kap[B],kap[m].min(),bb[m][kap[m].argmin()]))
    below=bb[m&(kap<0.69)]; P("   b with kappa(b) < 0.69: %d values, largest %d"%(len(below),below.max()))
    R["kappaBelow069"]={"count":int(len(below)),"largest":int(below.max()),"list_tail":below[-12:].tolist()}
    for lo in (10,100,1000,10**4,10**5,10**6):
        if lo<B:
            mm=bb>=lo; i=bb[mm][kap[mm].argmin()]; j=bb[mm][kap[mm].argmax()]
            P("   b >= %-8d inf kappa = %.8f (b=%d, omega=%d)   sup = %.8f (b=%d)"%(lo,kap[i],i,om[i],kap[j],j)); R["kappaRange_%d"%lo]=[float(kap[i]),int(i),float(kap[j]),int(j)]
    E=b*np.exp2(om[:B+1].astype(float))*(3+2*np.log(np.maximum(b,1)))+2+np.log(np.maximum(b,1))
    rat=np.abs(F-K*b*ph)[m]/E[m]; P("   |F - K b phi| / E(b): max %.4f (bound of Theorem 1(ii) needs <= 1)"%rat.max()); R["thm1RatioMax"]=float(rat.max())
    mm=bb>=B//2; P("   mean |kappa-K| on b >= B/2: %.3e"%np.abs(kap[mm]-K).mean())
    # residual sign law of s2: sign(kappa(b)-K) = -mu(b)*sign(eps), eps_zeta<0 -> sign = mu... report agreement on squarefree
    sq=m&(mu[:B+1]!=0)&(bb>=200); sg=np.sign(kap-K); P("   sign(kappa(b)-K) = -mu(b) on squarefree b >= 200: %d of %d"%((sg[sq]==-mu[:B+1][sq]).sum(),sq.sum()))
    R["residualSign"]=[int((sg[sq]==-mu[:B+1][sq]).sum()),int(sq.sum())]
    P("== combination 4: S(b) = sum_{a=2,(a,b)=1}^{b-1} V(b,a)")
    m4=bb>=4; lm=np.zeros(B+1); lm[m4]=S[m4]/(b[m4]*ph[m4])
    pos=bb[m4&(S>=0)]; P("   S(b) >= 0 for %d values of b in [4,%d] %s; S(3) = %.2e"%(len(pos),B,pos[:10].tolist(),S[3]))
    P("   max S(b)/(b phi(b)) over b>=4: %.6f at b=%d; -1/(4 pi) = %.8f; S(B)/(B phi(B)) = %.8f"%(lm[m4].max(),bb[m4][lm[m4].argmax()],-1/(4*math.pi),lm[B]))
    for lo in (100,10**4,10**5,10**6):
        if lo<B: mm=bb>=lo; P("   b >= %-8d leaf mean in [%.8f, %.8f]"%(lo,lm[mm].min(),lm[mm].max())); R["leafMean_%d"%lo]=[float(lm[mm].min()),float(lm[mm].max())]
    exS=np.load("cert_exS.npy"); exS=exS[exS<=B]; P("   certificate exceptions (%d values, largest %d) all computed here: max S/(b phi) among them (b>=4) = %.6f"%(len(exS),exS.max(),lm[exS[exS>=4]].max()))
    R["signLaw"]={"B":B,"nonneg":pos.tolist(),"maxLeafMean":float(lm[m4].max()),"exceptionsChecked":int(len(exS))}
    P("== combination 3: M2w(b) = (sum_a c0(h_a/a)^2/a)/(sum_a a), c1(b), DIAG/OFFDIAG, Rw")
    sA=b*ph/2-1; m3=bb>=5; M2=np.zeros(B+1); M2[m3]=Q[m3]/sA[m3]; c1=np.zeros(B+1); c1[m3]=Sa[m3]/sA[m3]
    i=bb[m3][M2[m3].argmax()]; P("   max M2w = %.6f at b = %d (target 0.32546); max c1 = %.6f (target 0.5705)"%(M2[i],i,c1[m3].max()))
    for lo in (100,10**4,10**5,10**6):
        if lo<B: mm=bb>=lo; P("   b >= %-8d M2w in [%.6f, %.6f] mean %.6f; c1 in [%.6f, %.6f]; c1^2/M2w mean %.4f"%(lo,M2[mm].min(),M2[mm].max(),M2[mm].mean(),c1[mm].min(),c1[mm].max(),(c1[mm]**2/M2[mm]).mean()))
    R["M2w"]={"max":float(M2[i]),"argmax":int(i),"meanTopHalf":float(M2[bb>=B//2].mean()),"minTopHalf":float(M2[bb>=B//2].min()),"maxTopHalf":float(M2[bb>=B//2].max())}
    Eh=np.zeros(B+1); ma=(bb>=3)&(bb<B); Eh[ma]=M[ma]/(ph[ma]*b[ma]**2)        # E_h[(c0(h/a)/a)^2] over reduced residues
    for a in (101,401,2003,10007,100003,1000003):
        if a<B: P("   E_h[(c0/a)^2] at a = %d: %.6f"%(a,Eh[a]))
    P("   E_h[(c0/a)^2]: mean over a in [B/2,B) = %.6f, min %.6f max %.6f"%(Eh[B//2:B].mean(),Eh[B//2:B].min(),Eh[B//2:B].max()))
    rows=[]
    samp=[101,401,1201,8009,30030,64001,100003,200003,510510,B//2+1,B-1,B]
    rng=np.random.default_rng(5); samp+=rng.integers(B//2,B,6).tolist()
    for bq in sorted(set(s for s in samp if 5<=s<=B)):
        a=np.arange(3,bq); cp=np.gcd(a,bq)==1; a=a[cp]
        DIAG=(M[a]/a.astype(float)**2).sum(); Mbar=(Eh[a]*a).sum()/sA[bq]
        rows.append((bq,M2[bq],DIAG/sA[bq],(Q[bq]-DIAG)/DIAG,Mbar,M2[bq]/Mbar))
        P("   b=%-8d M2w=%.5f DIAG/Za=%.5f OFFDIAG/DIAG=%.4f Mbar=%.5f Rw=M2w/Mbar=%.4f"%rows[-1])
    R["diagRows"]=rows
    isp=(om[:B+1]==1)&(mu[:B+1]==-1); pre_=np.cumsum(np.where(bb>=3,M/np.maximum(b,1)**2,0.0)); DIAGp=np.zeros(B+1); DIAGp[1:]=pre_[:-1]   # prime b: all a < b coprime
    for lo,hi in ((1000,8000),(8000,B//2),(B//2,B+1)):
        mm=isp&(bb>=lo)&(bb<hi)
        if mm.sum()==0: continue
        od_=Q[mm]/DIAGp[mm]-1; P("   prime b in [%d,%d): OFFDIAG/DIAG mean %.5f [%.5f, %.5f] (%d primes)"%(lo,hi,od_.mean(),od_.min(),od_.max(),mm.sum())); R["offdiagPrimes_%d"%lo]=[float(od_.mean()),float(od_.min()),float(od_.max())]
# ---------------- zeta list ----------------
f=os.path.join(od,"zlist.txt")
if os.path.exists(f):
    P("== primorial-type and large b (mode L): b, phi, kappa, leaf mean S/(b phi), M2w, c1")
    rows=[]
    for l in open(f):
        v=l.split(); bq=int(v[0]); n,S_,Sa_,Q_,sA_,F_,Fa_,SV_,I1=map(float,v[1:]); ph_=n+1
        rows.append((bq,int(ph_),F_/(ph_*bq),S_/(ph_*bq),Q_/sA_,Sa_/sA_))
        P("   b=%-11d phi=%-11d kappa=%.10f leaf=%.10f M2w=%.6f c1=%.6f"%rows[-1])
    R["zlist"]=rows
# ---------------- zeta profile ----------------
fs=sorted(glob.glob(os.path.join(od,"zprof_b*.txt")),key=lambda s:int(s.split("_b")[-1][:-4]))
if fs:
    P("== combination 2: bulk profile A(x) = I(xb,b)/b on all a; crests of d = (I - I_lin)/I; Mellin transform")
    mp.mp.dps=20; prof={}; c1_=C+0.5
    def closed(w): return 0.5/(1-w)**2+c1_/(1-w)+0.5/w**2+c1_/w        # Int_0^1 A_lin(x)(x^{-w-1}+x^{w-2}) dx
    for fn in fs:
        bq=int(fn.split("_b")[-1][:-4]); bins=np.zeros(2048); cnt=np.zeros(2048); cr={0:{},1:{}}; mel=[]
        for l in open(fn):
            v=l.split()
            if v[0]=="BIN": bins[int(v[1])]=float(v[2]); cnt[int(v[1])]=float(v[3])
            elif v[0]=="CREST": cr[int(v[1])][int(v[2])]=float(v[3])
            elif v[0]=="MELLIN": mel.append((float(v[2]),float(v[3]),complex(float(v[4]),float(v[5]))))
        prof[bq]=bins/np.maximum(cnt,1)
        for c,x0 in ((0,1/6),(1,0.2)):
            ks=sorted(cr[c]); vals=np.array([cr[c][k] for k in ks]); k=ks[int(vals.argmax())]
            P("   b=%-11d crest near %.5f: max d = %.6f%% in bin centred x = %.6f (bin width 1e-5)"%(bq,x0,100*vals.max(),x0-0.004+(k+0.5)*1e-5))
            R["crest_%d_%d"%(bq,c)]=[float(vals.max()),x0-0.004+(k+0.5)*1e-5]
        for (re,im,z) in mel:
            w=mp.mpc(re,im); ex=mp.zeta(w)*mp.zeta(1-w)/(w*(1-w)); tot=z+complex(closed(complex(re,im)))
            P("   b=%-11d Mellin at w=%.4f+%.6fi: sum = %+.3e%+.3ei  exact zeta(w)zeta(1-w)/(w(1-w)) = %+.3e%+.3ei  |diff| = %.2e"%(bq,re,im,tot.real,tot.imag,float(ex.real),float(ex.imag),abs(tot-complex(ex))))
            R["mellin_%d_%.4f_%.4f"%(bq,re,im)]=[tot.real,tot.imag,float(ex.real),float(ex.imag)]
    ks=sorted(prof)
    for i in range(len(ks)-1):
        d=np.abs(prof[ks[i]]-prof[ks[-1]]); P("   sup over 2048 bins of |profile(b=%d) - profile(b=%d)| = %.3e (bin 0: %.3e; bins >= 8: %.3e)"%(ks[i],ks[-1],d.max(),d[0],d[8:].max()))
        R["profDiff_%d"%ks[i]]=[float(d.max()),float(d[8:].max())]
    P("   int_0^1 profile (b=%d) = %.10f ; K = %.10f"%(ks[-1],prof[ks[-1]].mean(),K))
# ---------------- T-NR ----------------
for tag,kF in (("tnr2",11.2154610393),("tnr3",11.2552610724),("tnr101",6.9326720153)):
    f=os.path.join(od,tag+"_sums.txt")
    if os.path.exists(f):
        for l in open(f):
            v=l.split(); bq=int(v[0]); n=float(v[1]); F_=float(v[6]); P("== T-NR %s b=%d kappa_F(b) = %.8f  (limit %.10f, s2)"%(tag,bq,F_/((n+1)*bq),kF)); R["%s_%d"%(tag,bq)]=F_/((n+1)*bq)
# ---------------- periodic ----------------
XI=0.28407904384041227
coef={"DH":[1,XI,-XI,-1,0],"chi5":[1,-1,-1,1,0],"chim3":[1,-1,0]}
kapF={"DH":0.4069850721,"chi5":0.1120952747,"chim3":0.1593725896}
def Fval(c,s):
    q=len(c); return sum(c[r-1]*mp.zeta(s,mp.mpf(r)/q) for r in range(1,q+1) if c[r-1]!=0)*mp.power(q,-s)
for tag in coef:
    f=os.path.join(od,tag+"_P.txt")
    if os.path.exists(f):
        d=np.loadtxt(f); bq=d[:,0]; n=d[:,1]; ph_=n+1; sD,sF,sL,sAL,Ql,sA,I1,DG=[d[:,i] for i in range(2,10)]
        N=int(bq[-1]); m=bq>=200; lm=sL/(ph_*bq); kap=(sD+sF+sL)/(ph_*bq)
        P("== periodic %s, all b <= %d (mode P)"%(tag,N))
        P("   kappa_F(b): b>=200 range [%.6f, %.6f], at b=N %.7f (limit %.10f); min over all b>=3: %.4f"%(kap[m].min(),kap[m].max(),kap[-1],kapF[tag],kap[bq>=3].min()))
        P("   leaf sum sign changes for b >= 200: %d negative of %d; leaf mean top 10%%: %.5f [%.5f, %.5f]; fixed-modulus mean top 10%%: %.5f"%((sL[m]<0).sum(),m.sum(),lm[bq>=0.9*N].mean(),lm[bq>=0.9*N].min(),lm[bq>=0.9*N].max(),(sF/(ph_*bq))[bq>=0.9*N].mean()))
        M2=Ql/np.maximum(sA,1); c1=sAL/np.maximum(sA,1)
        for lo,hi in ((200,1000),(1000,N//2),(N//2,N+1)):
            mm=(bq>=lo)&(bq<hi)
            if mm.sum()==0: continue
            P("   b in [%d,%d): M2w_F mean %.5f [%.5f, %.5f]; c1_F mean %.5f; c1^2/M2w %.4f; OFFDIAG/DIAG mean %.4f [%.4f, %.4f]"%(lo,hi,M2[mm].mean(),M2[mm].min(),M2[mm].max(),c1[mm].mean(),(c1[mm]**2/M2[mm]).mean(),((Ql-DG)/DG)[mm].mean(),((Ql-DG)/DG)[mm].min(),((Ql-DG)/DG)[mm].max()))
        sv=np.ones(N+1,bool); sv[:2]=False
        for p_ in range(2,int(N**0.5)+1):
            if sv[p_]: sv[p_*p_::p_]=False
        ispb=sv[bq.astype(int)]
        for lo,hi in ((1000,N//2),(N//2,N+1)):
            mm=ispb&(bq>=lo)&(bq<hi); od_=(Ql/DG-1)[mm]; P("   prime b in [%d,%d): OFFDIAG/DIAG mean %.5f [%.5f, %.5f]; M2w_F mean %.5f"%(lo,hi,od_.mean(),od_.min(),od_.max(),M2[mm].mean()))
        mm=ispb&(bq>=N//2); R["perOffdiagPrimes_"+tag]=[float((Ql/DG-1)[mm].mean()),float((Ql/DG-1)[mm].min()),float((Ql/DG-1)[mm].max())]
        mm=bq>=N//2; R["per_"+tag]={"N":N,"kappaTop":float(kap[-1]),"leafNeg":int((sL[m]<0).sum()),"leafMean":float(lm[bq>=0.9*N].mean()),"M2w":float(M2[mm].mean()),"M2wRange":[float(M2[mm].min()),float(M2[mm].max())],"c1":float(c1[mm].mean()),"offdiag":float(((Ql-DG)/DG)[mm].mean())}
    fs=sorted(glob.glob(os.path.join(od,tag+"_b*.txt")),key=lambda s:int(s.split("_b")[-1][:-4])); prof={}
    for fn in fs:
        bq=int(fn.split("_b")[-1][:-4]); bins=np.zeros(2048); cnt=np.zeros(2048); mel=[]
        for l in open(fn):
            v=l.split()
            if v[0]=="SUMS": n,sD,sF,sL,sAL,Ql,sA,I1=map(float,v[2:])
            elif v[0]=="BIN": bins[int(v[1])]=float(v[2]); cnt[int(v[1])]=float(v[3])
            elif v[0]=="MELLIN": mel.append((float(v[2]),float(v[3]),complex(float(v[4]),float(v[5]))))
        prof[bq]=(bins/np.maximum(cnt,1),cnt>0)
        P("== periodic %s b=%d: kappa_F(b)=%.8f (limit %.10f) leaf mean=%.6f fixed mean=%.6f M2w_F=%.5f c1_F=%.5f"%(tag,bq,(sD+sF+sL)/((n+1)*bq),kapF[tag],sL/((n+1)*bq),sF/((n+1)*bq),Ql/sA,sAL/sA))
        R["perb_%s_%d"%(tag,bq)]={"kappa":(sD+sF+sL)/((n+1)*bq),"leaf":sL/((n+1)*bq),"M2w":Ql/sA,"c1":sAL/sA}
        mp.mp.dps=20
        for (re,im,z) in mel:
            w=mp.mpc(re,im); ex=Fval(coef[tag],w)*Fval(coef[tag],1-w)/(w*(1-w))
            P("   Mellin at w=%.4f+%.6fi: raw sum over coprime a = %+.3e%+.3ei  exact F(w)F(1-w)/(w(1-w)) = %+.3e%+.3ei"%(re,im,z.real,z.imag,float(ex.real),float(ex.imag)))
            R["permellin_%s_%d_%.4f_%.4f"%(tag,bq,re,im)]=[z.real,z.imag,float(ex.real),float(ex.imag)]
    ks=sorted(prof)
    for i in range(len(ks)-1):
        ok=prof[ks[i]][1]&prof[ks[-1]][1]; ok[:8]=False; d=np.abs(prof[ks[i]][0]-prof[ks[-1]][0])[ok]
        P("   %s: sup over bins >= 8 of |profile(b=%d) - profile(b=%d)| = %.3e"%(tag,ks[i],ks[-1],d.max())); R["perProfDiff_%s_%d"%(tag,ks[i])]=float(d.max())
json.dump(R,open(os.path.join(od,"analysis_%s.json"%pre),"w"),indent=1,default=str)
