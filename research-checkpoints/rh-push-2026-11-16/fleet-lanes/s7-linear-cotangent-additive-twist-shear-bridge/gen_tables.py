# gen_tables.py <fn> <K> <prefix> : w_F on the Farey grid for functions without a C path (U, Ea, liou); numpy.
# also: gen_tables.py leaf <fn> <b> : leaf sums V_F(b,a), a<b
import sys, json, math, numpy as np
from vlib import *
import mpmath as mp
def trig_table(k):  # zeta(2, r/k), r=1..k
    return hurwitz(2.0,np.arange(1,k+1)/k).real
def Ctab(fn,k):
    if fn=='U': return C_table('U',k,tau=1.0)
    if fn=='Ea': return C_table('Ea',k,a=0.25)
    raise ValueError
def V_row(fn,k,hs):
    """V_F(h,k) for h in hs (complex for U)."""
    hs=np.asarray(hs,dtype=np.int64)
    if k==1: return np.zeros(len(hs))
    if fn=='liou':
        r=np.arange(1,k+1,dtype=np.int64); z2=trig_table(k); r2=(r*r)%k
        out=np.zeros(len(hs)); step=max(1,int(4e6//k))
        for i in range(0,len(hs),step):
            ph=(np.outer(hs[i:i+step],r2)%k)*(2*PI/k); out[i:i+step]=(np.sin(ph)@z2)*2/(PI**2*k)
        return out
    return V_all(k,Ctab(fn,k),hs)
if sys.argv[1]=='leaf':
    fn=sys.argv[2]; b=int(sys.argv[3]); va=np.zeros(b,dtype=complex)
    for a in range(2,b):
        if math.gcd(a,b)==1: va[a]=V_row(fn,a,[b%a])[0]
    for part,v in (('re',va.real),('im',va.imag)):
        if part=='im' and fn!='U': continue
        S=v.sum(); A=np.abs(v).sum()
        print(json.dumps({'fn':fn+('_'+part if fn=='U' else ''),'b':b,'S':float(S),'A':float(A),'ratio':float(abs(S)/A),'A_over_b2':float(A/b**2),'M2w':float((v[2:]**2/np.arange(2,b)).sum()/np.arange(2,b).sum())}))
    if fn=='U':
        S=va.sum(); A=np.abs(va).sum(); print(json.dumps({'fn':'U_abs','b':b,'S_abs':float(abs(S)),'A':float(A),'ratio':float(abs(S)/A),'A_over_b2':float(A/b**2)}))
    np.save(f'out/leafgen_{fn}_{b}.npy',va); sys.exit()
fn=sys.argv[1]; K=int(sys.argv[2]); pre=sys.argv[3]
nent=(K-1)*K//2; print('planned allocation: 2 tables of',nent,'complex = %.2f GB'%(nent*32/1e9),file=sys.stderr)
V=np.full(nent,np.nan,dtype=complex); idx=lambda k,h:(k-1)*(k-2)//2+h-1
for k in range(2,K+1):
    hs=np.array([h for h in range(1,k) if math.gcd(h,k)==1]); v=V_row(fn,k,hs); V[idx(k,hs)]=v
W=np.full(nent,np.nan,dtype=complex); xs=[];ks=[];ii=[]
for k in range(2,K+1):
    hs=np.array([h for h in range(1,k) if math.gcd(h,k)==1]); r=k%hs
    v2=np.where(hs==1,0.0,V[idx(hs,np.maximum(r,1))]); W[idx(k,hs)]=(V[idx(k,hs)]+v2)/k
    xs.append(hs/k); ks.append(np.full(len(hs),k,dtype=np.int32)); ii.append(idx(k,hs))
xs=np.concatenate(xs); ks=np.concatenate(ks); ii=np.concatenate(ii); o=np.argsort(xs,kind='stable')
mp.mp.dps=30
def emit(tag,part,terms):
    Wp=W.real if part=='re' else W.imag
    p=f'{pre}_{tag}'; Wp.astype(np.float64).tofile(p+'_w.bin'); xs[o].tofile(p+'_fx.bin'); Wp[ii][o].astype(np.float64).tofile(p+'_fw.bin'); ks[o].tofile(p+'_fk.bin')
    json.dump({'res':0.0,'gF':0.0,'cond':1,'part':part,'terms':terms},open(p+'_meta.json','w'))
if fn=='U':
    tau=1.0; t=[[complex(-mp.zeta(1+1j*tau)/2).real,complex(-mp.zeta(1+1j*tau)/2).imag,0.0,0.0],
               [complex(-mp.zeta(1j*tau)/(1j*tau)).real,complex(-mp.zeta(1j*tau)/(1j*tau)).imag,0.0,tau]]
    emit('U_re','re',t); emit('U_im','im',t)
elif fn=='Ea':
    a=0.25; t=[[float(-mp.zeta(1+a)*mp.zeta(1-a)/2),0.0,0.0,0.0],[float(-mp.zeta(a)*mp.zeta(1-2*a)/a),0.0,a,0.0],[float(mp.zeta(-a)*mp.zeta(1+2*a)/a),0.0,-a,0.0]]
    emit('Ea','re',t)
elif fn=='liou':
    emit('liou','re',[])
