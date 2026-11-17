# scan.py udir Tstart log2M nwin nproc r outdir : worker r of nproc processes windows j=r mod nproc
import sys, os, numpy as np, time, math, mpmath as mp
import engine as E
udir,Tstart,lgM,nwin,nproc,r,outdir=sys.argv[1],int(float(sys.argv[2])),int(sys.argv[3]),int(sys.argv[4]),int(sys.argv[5]),int(sys.argv[6]),sys.argv[7]
os.makedirs(outdir,exist_ok=True)
M=1<<lgM; MARG=400; PAD=MARG+E.W+4; NNB=40
uhi,ulo,logn=E.load_u(udir,copy=False)
th1s=float(mp.siegeltheta(mp.mpf(Tstart),derivative=1)); hs=2*math.pi/(E.OSF*th1s)
L=2*int(math.floor((M/2-PAD)*hs*(1-1e-5)))
def theta(t): return mp.siegeltheta(mp.mpf(t))
BINS=np.arange(0,6.0001,0.002)
REV=len(sys.argv)>8 and sys.argv[8]=='rev'
jl=list(range(r,nwin,nproc))
if REV: jl=jl[::-1]
for j in jl:
    fn=f"{outdir}/w{j:06d}.npz"
    if os.path.exists(fn): continue
    t0=time.time()
    T0=Tstart+j*L
    w=E.Window(T0,M,uhi,ulo,logn); t05=time.time()
    klo=-(L/2)/w.h; khi=(L/2)/w.h
    assert khi+PAD<M/2
    zs,fl,un=w.zeros(klo-MARG,khi+MARG)
    t1=time.time()
    i0=np.searchsorted(zs,klo); i1=np.searchsorted(zs,khi)   # owned zeros i0..i1-1
    nown=i1-i0
    expc=float((theta(T0+L//2)-theta(T0-L//2))/mp.pi)
    d=np.diff(zs)*(2.0/E.OSF)
    dow=d[i0:i1]
    hist=np.histogram(dow,bins=BINS)[0]
    over=int((dow>=6).sum())
    # close pairs
    idx=np.nonzero(dow<0.03)[0]+i0
    recs=[]
    for i in idx:
        a,b=zs[i],zs[i+1]
        nb=zs[i-NNB:i+NNB+2]-0.5*(a+b)
        if len(nb)!=2*NNB+2: continue
        if fl[i]==0:
            za,da=w.Z(a); zb,db=w.Z(b)
            ks=w.droot(a,b,da,db) if da*db<0 else 0.5*(a+b)
            zsv,_=w.Z(ks)
        else:
            da=db=0.0; ks=a; zsv=w.Z(a)[0]
        recs.append(np.concatenate([[j,T0,a,b,d[i],da,db,ks,zsv,fl[i],w.h],nb]))
    recs=np.array(recs) if recs else np.zeros((0,11+2*NNB+2))
    # triples: sum of two consecutive gaps
    s2=dow[:-1]+dow[1:]
    it=np.unique(np.concatenate([np.argsort(s2)[:5],np.nonzero(s2<0.3)[0][:300]]))
    trip=np.array([[j,T0,zs[i0+i],zs[i0+i+1],zs[i0+i+2],s2[i]] for i in it])
    ib=np.unique(np.concatenate([np.argsort(dow)[-5:],np.nonzero(dow>3.3)[0][:300]]))
    big=np.array([[j,T0,zs[i0+i],zs[i0+i+1],dow[i]] for i in ib])
    np.savez(fn,j=j,T0=T0,L=L,h=w.h,nown=nown,expc=expc,hist=hist,over=over,recs=recs,trip=trip,big=big,unres=un,zmax=np.array(w.zmax),nsub=w.nsub,
             s1=dow.sum(),s2=(dow**2).sum(),timing=np.array([w.t_nufft,t05-t0,t1-t05,time.time()-t1]))
    print(j,T0,"nown",nown,"disc",nown-expc,"close",len(recs),"unres",len(un),"min",dow.min(),"max",dow.max(),"t",round(time.time()-t0,1),flush=True)
