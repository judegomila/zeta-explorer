"""Referee recount on the mirrored grid sign matrices of c14-joint-zeta-twist-noncone-search:
leave-one-class-out and canonical-lift-only tiers. Read-only on the lane's out/ directory."""
import json, os, sys, itertools
import numpy as np
SRC='tmp/research-2026-11-16/push/c14-joint-zeta-twist-noncone-search'
sys.path.insert(0, SRC)
OUT=os.path.join(SRC,'out')
NAMES={1:'DH',2:'T-NR',3:'E_a',4:'HEAT',5:'theta^w',6:'U',7:'THIN',8:'BLS',9:'BEU'}
NEED=23
def gidx(g):
    d={'P':np.nonzero(g=='P')[0],'PX':np.nonzero(g=='PX')[0],'PH':np.nonzero(g=='PH')[0]}
    for k in range(1,10):
        d['C%d'%k]=np.nonzero(g=='C%d'%k)[0]; d['H%d'%k]=np.nonzero(g=='H%d'%k)[0]
    return d
fams=[a+'-'+b for a in ('JA','JB1','JB2','JC1','JC2') for b in ('with','without')]
tiers={'all9':list(range(1,10)),'FE4':[2,3,4,8],'canon3(T-NR,E_a,HEAT)':[2,3,4],'canon+DH(1,2,3,4)':[1,2,3,4],'none':[]}
for k in range(1,10): tiers['all9 minus %s'%NAMES[k]]=[j for j in range(1,10) if j!=k]
for k in (2,3,4,8): tiers['FE4 minus %s'%NAMES[k]]=[j for j in (2,3,4,8) if j!=k]
res={}
for fam in fams:
    ob=json.load(open(os.path.join(OUT,'objects.json'))); g=np.array(ob['groups'])
    s1=np.load(os.path.join(OUT,fam+'_s1.npy')); idx2=np.load(os.path.join(OUT,fam+'_idx2.npy')); s2=np.load(os.path.join(OUT,fam+'_s2.npy'))
    print(fam,'planned concat bytes',s1[idx2].nbytes+s2.nbytes,flush=True)
    S=np.concatenate((s1[idx2],s2),axis=1); d=gidx(g)
    for pset in ('PA','PZ'):
        cols=np.concatenate((d['P'],d['PX'])) if pset=='PA' else d['P']
        X=S[:,cols]; n=len(cols)
        s=np.where((X==1).sum(1)==n,1,np.where((X==-1).sum(1)==n,-1,0)).astype(np.int8); one=s!=0
        tr={};hf={}
        for k in range(1,10):
            tr[k]=(S[:,d['C%d'%k]]==-s[:,None]).any(1)&one
            hf[k]=np.where(one,(S[:,d['H%d'%k]]==-s[:,None]).sum(1),0)
        ph=(S[:,d['PH']]==s[:,None]).sum(1)
        for t,cl in tiers.items():
            tt=one.copy(); fu=one&(ph>=NEED)
            for k in cl: tt&=tr[k]; fu&=tr[k]&(hf[k]>=NEED)
            # best min heldout among ttrain rows with ph>=NEED
            r=res.setdefault(pset,{}).setdefault(t,{'ttrain':0,'full':0,'ttrain_ph23':0})
            r['ttrain']+=int(tt.sum()); r['full']+=int(fu.sum()); r['ttrain_ph23']+=int((tt&(ph>=NEED)).sum())
        r=res[pset].setdefault('_one',{'one':0,'one_ph23':0}); r['one']+=int(one.sum()); r['one_ph23']+=int((one&(ph>=NEED)).sum())
json.dump(res,open('tmp/research-2026-11-16/push/c15-referee-r14-independent-checkpoint/lift_loo.json','w'),indent=1)
for p in res:
    print('==',p,res[p]['_one'])
    for t in tiers: print('  %-28s'%t,res[p][t])
