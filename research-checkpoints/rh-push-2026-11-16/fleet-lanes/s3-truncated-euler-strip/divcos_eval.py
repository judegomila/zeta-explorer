# Evaluation of the divisor-cosine statistic from divcos moments.
# usage: divcos_eval.py dc.bin out.json [nbulk] [tmax] [validate]
import sys, json, math, numpy as np
try:
    import cupy as cp
    cp.get_default_memory_pool().set_limit(size=24*1024**3)
    xp=cp; GPU=True
except Exception:
    xp=np; GPU=False
fn=sys.argv[1]; outfn=sys.argv[2]; nbulk=int(sys.argv[3]) if len(sys.argv)>3 else 100000
tmax=float(sys.argv[4]) if len(sys.argv)>4 else 2000.0; VALID=len(sys.argv)>5
with open(fn,'rb') as f:
    NB,NMOM,NSC,NFAM,BPU,X=[int(v) for v in np.fromfile(f,dtype=np.uint64,count=6)]
    print('planned moment table %.2f GB; device %s'%(NB*NMOM*NSC*NFAM*8/1e9,'gpu' if GPU else 'cpu'))
    M=np.fromfile(f,dtype=np.float64).reshape(NB,NMOM,NSC*NFAM)
LAM=np.array([1.0,2.0,3.0,5.0]); KAP=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
used=np.nonzero(np.abs(M).sum(axis=(1,2))>0)[0]; M=M[used]; cb=(used+0.5)/BPU
print('X',X,'blocks used',len(used))
def load(n,key):
    return np.array([float(v) for v in json.load(open(n))[key]])
zz=load('zeros_ZETA.json','gamma'); zdh=load('zeros_DH.json','online')
try: z4=load('zeros_chi4.json','gamma')
except Exception: z4=np.array([])
zz=zz[zz<=tmax]; zdh=zdh[zdh<=tmax]; z4=z4[z4<=tmax]
rng=np.random.default_rng(20261119); bulk=np.sort(rng.uniform(10.0,tmax,nbulk))
sets={'zeta_zeros':zz,'dh_online_zeros':zdh,'chi4_zeros':z4,'bulk':bulk}
def evalE(t):
    """E[len(t), NSC*NFAM] complex"""
    out=np.empty((len(t),NSC*NFAM),dtype=np.complex128)
    Mx=xp.asarray(M); cbx=xp.asarray(cb); ch=max(1,int(1.5e9/(16*len(cb))))
    fact=[math.factorial(k) for k in range(NMOM)]
    for i in range(0,len(t),ch):
        tt=xp.asarray(t[i:i+ch]); P=xp.exp(-1j*cbx[:,None]*tt[None,:])       # [nb, nt]
        acc=xp.zeros((len(tt),NSC*NFAM),dtype=xp.complex128)
        for k in range(NMOM):
            acc+=((-1j*tt)**k/fact[k])[:,None]*(P.T@Mx[:,k,:].astype(xp.complex128))
        out[i:i+ch]=cp.asnumpy(acc) if GPU else acc
    return out
def remover(t):
    """c[len(t),NSC]: min-norm solution of sum c = 1, sum c lam^-1/2 = 0, sum c lam^(-1/2+it) = 0"""
    A=np.empty((len(t),3,NSC),dtype=np.complex128)
    A[:,0,:]=1; A[:,1,:]=LAM[None,:]**-0.5; A[:,2,:]=LAM[None,:]**-0.5*np.exp(1j*t[:,None]*np.log(LAM)[None,:])
    b=np.zeros((len(t),3),dtype=np.complex128); b[:,0]=1
    c=np.einsum('tij,tj->ti',np.linalg.pinv(A),b)
    return c
def families(t):
    E=evalE(t).reshape(len(t),NSC,NFAM); c=remover(t)
    R=np.einsum('tj,tjf->tf',c,E); raw=E[:,0,:]
    fam=lambda Q:{'zeta':Q[:,0],'chi4':Q[:,1],'chi5':Q[:,2]+1j*Q[:,3],'DH':Q[:,2]+KAP*Q[:,3],'TNR':Q[:,4],'THIN':Q[:,5],'RSGN':Q[:,6]}
    return fam(R),fam(raw),np.linalg.norm(c,axis=1)
res={'X':X,'tmax':tmax,'nbulk':nbulk,'counts':{k:len(v) for k,v in sets.items()},'meansq':{},'meansq_raw':{},'median_abs':{},'max_abs':{}}
vals={}
for sn,t in sets.items():
    if len(t)==0: continue
    F,RAW,cn=families(t); keep=cn<20.0
    res.setdefault('kept_fraction',{})[sn]=float(keep.mean())
    vals[sn]=(t,F,keep)
    for fnm in F:
        v=F[fnm][keep]
        res['meansq'].setdefault(fnm,{})[sn]=float(np.mean(np.abs(v)**2))
        res['median_abs'].setdefault(fnm,{})[sn]=float(np.median(np.abs(v)))
        res['max_abs'].setdefault(fnm,{})[sn]=float(np.max(np.abs(v)))
        res['meansq_raw'].setdefault(fnm,{})[sn]=float(np.mean(np.abs(RAW[fnm])**2))
res['ratio_to_bulk']={f:{sn:res['meansq'][f][sn]/res['meansq'][f]['bulk'] for sn in res['meansq'][f] if sn!='bulk'} for f in res['meansq']}
# split by height: ratio for zeta at zeta zeros in height bands (finite-X error grows with t)
bands=[(10,100),(100,500),(500,1000),(1000,2000)]
res['zeta_bands']=[]
t,F,keep=vals['zeta_zeros']; tb,Fb,kb=vals['bulk']
for lo,hi in bands:
    m=(t>=lo)&(t<hi)&keep; mb=(tb>=lo)&(tb<hi)&kb
    if m.sum()==0 or mb.sum()==0: continue
    row=dict(band=[lo,hi],n_zeros=int(m.sum()))
    for f in ('zeta','TNR','THIN','RSGN','DH','chi4'):
        row[f]=dict(rms_at_zeta_zeros=float(np.sqrt(np.mean(np.abs(F[f][m])**2))),rms_bulk=float(np.sqrt(np.mean(np.abs(Fb[f][mb])**2))))
    res['zeta_bands'].append(row)
if VALID:
    import mpmath as mp
    mp.mp.dps=25
    tv=np.array([15.0,30.3,14.134725141734695,21.022039638771556,77.7,5.094159844571095,8.939914408096523])
    F,RAW,cn=families(tv); chk=[]
    chi=[0,1,1j,-1j,-1]; chib=[0,1,-1j,1j,-1]; c1=(1-1j*KAP)/2
    q=3.0; cc=2.2
    for i,t in enumerate(tv):
        s=mp.mpf(0.5); st=mp.mpc(0.5,t)
        z=mp.zeta(s)*mp.zeta(st)
        l4=mp.dirichlet(s,[0,1,0,-1])*mp.dirichlet(st,[0,1,0,-1])
        l5=mp.dirichlet(s,chi)*mp.dirichlet(st,chi); l5b=mp.dirichlet(s,chib)*mp.dirichlet(st,chib)
        dh=c1*l5+(c1.conjugate())*l5b
        x=q**-0.5; y=complex(mp.exp(-1j*t*mp.log(q)))
        ell=lambda j: x**j*((1-x*y)-y**(j+1)*(1-x))/(1-y)
        tn=complex(z)*(ell(0)+cc*math.sqrt(q)*ell(1)+q*ell(2))
        chk.append(dict(t=float(t),cnorm=float(cn[i]),zeta=[complex(F['zeta'][i]).real,complex(F['zeta'][i]).imag,float(z.real),float(z.imag)],
            chi4=[F['chi4'][i].real,F['chi4'][i].imag,float(l4.real),float(l4.imag)],chi5=[F['chi5'][i].real,F['chi5'][i].imag,float(l5.real),float(l5.imag)],
            DH=[F['DH'][i].real,F['DH'][i].imag,float(dh.real),float(dh.imag)],TNR=[F['TNR'][i].real,F['TNR'][i].imag,tn.real,tn.imag]))
    res['validation_vs_L_values']=chk
    for c in chk: print(json.dumps(c))
json.dump(res,open(outfn,'w'),indent=1)
print(json.dumps({k:res[k] for k in ('counts','kept_fraction','meansq','ratio_to_bulk','median_abs')},indent=0))
print(json.dumps(res['zeta_bands']))
