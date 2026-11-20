# Reader for h5sieve output and reconstruction of prime sums.
import numpy as np
RS=[0.45,0.51,0.55,0.60,0.75]; FAM=['all','chi4','chi3','m5_1','m5_2','m5_3','m5_4','eps','S1','S2']
KS=[0.55,0.70,0.90]; KF=['all','chi4','eps','S1','S2']; NM=6; BPU=2048; THIN_B=0.8
def load(fn):
    with open(fn,'rb') as f:
        NB,NCOL,ldsz,X=np.fromfile(f,dtype=np.uint64,count=4)
        NB=int(NB); NCOL=int(NCOL)
        B=np.fromfile(f,dtype=np.uint64,count=NB+1)
        C=np.fromfile(f,dtype=np.uint64,count=NB)
        dt=np.longdouble if int(ldsz)==np.dtype(np.longdouble).itemsize else np.float64
        assert int(ldsz)==np.dtype(dt).itemsize, (ldsz,)
        G=np.fromfile(f,dtype=dt,count=NB*NCOL).reshape(NB,NCOL)
    return dict(NB=NB,X=int(X),B=B,C=C,G=G)
def real_col(d,si,fi): return d['G'][:,si*len(FAM)+fi]
def mom(d,ksi,kfi): 
    o=len(RS)*len(FAM)+(ksi*len(KF)+kfi)*NM
    return d['G'][:,o:o+NM].astype(np.float64)
def block_sums(d,ksi,kfi,t):
    """array [nblk, nt] of sum over block of a_p p^-(sigma+it), float64 complex"""
    M=mom(d,ksi,kfi); t=np.asarray(t,dtype=np.float64)
    cj=(np.arange(d['NB'])+0.5)/BPU
    out=np.zeros((d['NB'],len(t)),dtype=np.complex128); fac=1.0
    for k in range(NM):
        if k>0: fac*=k
        out+=M[:,k][:,None]*((-1j*t)**k/fac)[None,:]
    out*=np.exp(-1j*cj[:,None]*t[None,:])
    return out
def smix(x):
    x=np.asarray(x,dtype=np.uint64)
    with np.errstate(over='ignore'):
        x=x+np.uint64(0x9E3779B97F4A7C15); x=(x^(x>>np.uint64(30)))*np.uint64(0xBF58476D1CE4E5B9); x=(x^(x>>np.uint64(27)))*np.uint64(0x94D049BB133111EB)
    return x^(x>>np.uint64(31))
def families(p):
    """dict of coefficient arrays for primes p (numpy uint64), same rules as the C code"""
    p=np.asarray(p,dtype=np.uint64); pi=p.astype(np.int64)
    f={}
    f['all']=np.ones(len(p))
    f['chi4']=np.where(pi%2==1,np.where(pi%4==1,1.0,-1.0),0.0)
    r3=pi%3; f['chi3']=np.where(r3==1,1.0,np.where(r3==2,-1.0,0.0))
    r5=pi%5
    for k in range(1,5): f['m5_%d'%k]=(r5==k).astype(float)
    h=smix(p); f['eps']=np.where((h>>np.uint64(63))==1,-1.0,1.0)
    u=(h&np.uint64((1<<53)-1)).astype(np.float64)/9007199254740992.0
    thr=p.astype(np.float64)**(THIN_B-1.0)
    f['S2']=(u<thr).astype(float); f['S1']=(u<0.5*thr).astype(float)
    return f
def primes_upto(n):
    s=np.ones(n+1,dtype=bool); s[:2]=False
    for i in range(2,int(n**0.5)+1):
        if s[i]: s[i*i::i]=False
    return np.nonzero(s)[0].astype(np.uint64)

def load_multi(fns):
    """signed sum of block tables of runs over prime ranges; a name with prefix '-' is subtracted (used to remove
    an interval that two runs both covered). X = largest header X among the added files."""
    d=None
    for fn in fns:
        sgn=-1 if fn.startswith('-') else 1
        e=load(fn[1:] if sgn<0 else fn)
        if d is None:
            assert sgn>0; d=e; continue
        if e['NB']>d['NB']:
            G=np.zeros_like(e['G']); G[:d['NB']]=d['G']; C=np.zeros(e['NB'],dtype=np.int64); C[:d['NB']]=d['C']
            d=dict(NB=e['NB'],X=d['X'],B=e['B'],C=C,G=G)
        nb=e['NB']
        d['C']=d['C'].astype(np.int64); d['C'][:nb]+=sgn*e['C'].astype(np.int64); d['G'][:nb]+=sgn*e['G']
        if sgn>0: d['X']=max(d['X'],e['X'])
    return d
