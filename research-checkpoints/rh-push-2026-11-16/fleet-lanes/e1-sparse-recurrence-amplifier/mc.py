"""Haar (Bohr-torus) prediction: random model f(s,w)=c L(s,chi w)+cbar L(s,chibar w), w_p iid uniform on the circle.
Primes <=P exact; primes in (P,2e6] replaced by 4 independent circular Gaussian analytic functions (one per class mod 5)."""
import numpy as np, json, sys, mpmath as mp
from lib import *
rng=np.random.default_rng(1)
NS=int(float(sys.argv[1])); P=500; X=2_000_000; J=48
sv=np.ones(X+1,bool); sv[:2]=False
for i in range(2,int(X**.5)+1):
    if sv[i]: sv[i*i::i]=False
pr=np.nonzero(sv)[0]; chi={0:0,1:1,2:1j,3:-1j,4:-1}
c=(1-1j*XI)/2
out={'NS':NS,'P':P,'X':X}
for r in (0.1,0.05):
    sj=RHO0+r*np.exp(2j*np.pi*np.arange(J)/J)
    f0=point(DH,sj); mmin=float(np.min(np.abs(point(DH,RHO0+r*np.exp(2j*np.pi*np.arange(2000)/2000)))))
    small=pr[(pr<=P)&(pr!=5)]; chs=np.array([chi[p%5] for p in small])
    A=np.exp(-np.outer(np.log(small),sj))            # (np,J) p^{-s_j}
    Ls={}
    for a in (1,2,3,4):
        q=pr[(pr>P)&(pr%5==a)].astype(float)
        V=np.exp(-np.outer(sj,np.log(q)))            # (J,nq)
        K=V@V.conj().T
        w,U=np.linalg.eigh(K); Ls[a]=U*np.sqrt(np.maximum(w,0))
    nret=0;nret9=0;nzero=0;B=20000;done=0
    while done<NS:
        ph=np.exp(2j*np.pi*rng.random((B,len(small))))
        l1=np.zeros((B,J),complex); l2=np.zeros((B,J),complex)
        for k in range(len(small)):
            u=ph[:,k][:,None]*A[k][None,:]
            l1-=np.log(1-chs[k]*u); l2-=np.log(1-np.conj(chs[k])*u)
        for a in (1,2,3,4):
            z=(rng.standard_normal((B,J))+1j*rng.standard_normal((B,J)))/np.sqrt(2)
            G=z@Ls[a].T
            l1+=chi[a]*G; l2+=np.conj(chi[a])*G
        f=c*np.exp(l1)+np.conj(c)*np.exp(l2)
        d=np.max(np.abs(f-f0[None,:]),axis=1)
        nret+=int((d<mmin).sum()); nret9+=int((d<0.9*mmin).sum())
        fw=np.concatenate([f,f[:,:1]],axis=1)
        wind=np.rint(np.angle(fw[:,1:]/fw[:,:-1]).sum(axis=1)/(2*np.pi))
        nzero+=int((wind!=0).sum()); done+=B
    out[f'r{r}']={'P_return':nret/done,'P_return_eta0.9':nret9/done,'P_zero_in_disc':nzero/done,'counts':[nret,nret9,nzero,done]}
    print(r,out[f'r{r}'],flush=True)
# zeta at 0.6: P(|zeta(0.6,w)|<delta), tail variance to infinity
sg=0.6; small=pr[pr<=P]; q=pr[pr>P].astype(float)
var=float((q**(-2*sg)).sum())+float(mp.e1((2*sg-1)*mp.log(X)))
NZ=4_000_000; cnt={d:0 for d in (0.5,0.3,0.2,0.1,0.05)}; mn=9; done=0
while done<NZ:
    ph=np.exp(2j*np.pi*rng.random((200000,len(small))))
    l=-np.log(1-ph*(small**(-sg))[None,:]).sum(axis=1)
    l+=np.sqrt(var/2)*(rng.standard_normal(200000)+1j*rng.standard_normal(200000))
    a=np.exp(l.real); mn=min(mn,float(a.min()))
    for d in cnt: cnt[d]+=int((a<d).sum())
    done+=200000
out['zeta_0.6_model']={'tail_var':var,'P_below':{str(d):cnt[d]/done for d in cnt},'min':mn,'NZ':NZ}
print(out['zeta_0.6_model'])
json.dump(out,open('mc.json','w'),indent=1)
