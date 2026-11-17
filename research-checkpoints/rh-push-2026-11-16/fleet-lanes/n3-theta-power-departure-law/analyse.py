import numpy as np, sys, json
d=np.load(sys.argv[1]); ws=d['ws']; tau=d['tau']; F=d['F']; tr=d['tr']; R=d['R']; xg=d['xg']; Ts=d['Ts']; H=d['H']
eps=float(d['eps'])
def unwrap_change(z):
    a=np.angle(z); da=np.diff(a); da=(da+np.pi)%(2*np.pi)-np.pi
    return da.sum(), np.abs(da).max()
res={}
for j,w in enumerate(ws):
    f=F[:,j]
    sc=np.nonzero(np.sign(f[1:])*np.sign(f[:-1])<0)[0]
    zeros=tau[sc]-f[sc]*(tau[sc+1]-tau[sc])/(f[sc+1]-f[sc])
    # positive local minima / negative local maxima (interior), normalised by e^{eps tau}
    g=f*np.exp(eps*tau)
    i=np.arange(1,len(g)-1)
    ext=i[(np.abs(g[i])<np.abs(g[i-1]))&(np.abs(g[i])<=np.abs(g[i+1]))&(np.sign(g[i-1])==np.sign(g[i+1]))&(np.sign(g[i])==np.sign(g[i-1]))]
    # rectangle counts N(tau0<Im<T): (1/pi)*[bottom 0->B + right tau0->T + top B->0]
    bot,mb=unwrap_change(H[0,:,j])
    aR=np.angle(R[:,j]); dR=np.diff(aR); dR=(dR+np.pi)%(2*np.pi)-np.pi; cR=np.concatenate([[0],np.cumsum(dR)]); mR=np.abs(dR).max()
    Ntot=[];flag=[]
    for k in range(1,len(Ts)):
        top,mt=unwrap_change(H[k,::-1,j])
        ir=np.searchsorted(tr,Ts[k]-1e-9)
        # consistency of right edge value and top edge start
        n=(bot+cR[ir]+top)/np.pi
        Ntot.append(n); flag.append(max(mt,mb))
    Ntot=np.array(Ntot); flag=np.array(flag)
    Non=np.array([np.sum(zeros<T) for T in Ts[1:]])
    res[float(w)]=dict(zeros=zeros,ext_tau=tau[ext],ext_val=g[ext],Ntot=Ntot,Non=Non,flag=flag,mR=mR)
import pickle
pickle.dump(dict(res=res,Ts=Ts),open(sys.argv[1].replace('.npz','.pkl'),'wb'))
for w in sorted(res):
    r=res[w]; Nt=np.rint(r['Ntot']).astype(int); off=Nt-r['Non']
    bad=np.abs(r['Ntot']-Nt).max()
    first=np.nonzero(off!=0)[0]
    T1=Ts[1:][first[0]] if len(first) else None
    def at(T):
        k=np.searchsorted(Ts[1:],T-1e-9); return (int(Nt[k]),int(r['Non'][k])) if k<len(Nt) else None
    print(f"w={w:.3f} (Ntot,Non)@160={at(160)} @400={at(400)} first deficit T<={T1} nonint={bad:.1e} maxstep top={r['flag'].max():.2f} right={r['mR']:.2f} nposmin={len(r['ext_tau'])} first posmin={r['ext_tau'][:3]}")
