# Test A: partial sums S_chi(x)=sum_{n<=x} chi(n) and M_chi(x)=sum mu(n)chi(n), N=1e6,
# for chi = 1, finite modification (chi(2)=-1), Liouville, U (planted zero at beta0, product measure
# with smooth marginals), 200 Haar-random chi.
import numpy as np, json, sys
N=10**6; rng=np.random.default_rng(20261118)
sieve=np.ones(N+1,bool); sieve[:2]=False
for i in range(2,int(N**.5)+1):
    if sieve[i]: sieve[i*i::i]=False
primes=np.nonzero(sieve)[0]; npr=len(primes)
mu=np.ones(N+1,np.int8)
for p in primes:
    mu[p::p]*=-1
    if p*p<=N: mu[p*p::p*p]=0
mu[0]=0
def planted(beta0):
    # adaptive means a_p in [-1/2,1/2] tracking A(x) = -int_2^x t^(beta0-1)/log t dt ; density 1+2a cos(theta)
    from scipy.special import expi
    A=-(expi(beta0*np.log(primes.astype(float)))-expi(beta0*np.log(2.0)))
    a=np.empty(npr); cum=0.0
    for i in range(npr):
        a[i]=min(0.5,max(-0.5,A[i]-cum)); cum+=a[i]
    th=np.empty(npr)
    for i in range(npr):
        while True:
            t=rng.uniform(0,2*np.pi)
            if rng.uniform()*(1+2*abs(a[i]))<=1+2*a[i]*np.cos(t): th[i]=t; break
    return th, float(np.max(np.abs(np.cumsum(a)-A))), float(np.sum(a*a))
names=['zeta','finmod(chi(2)=-1)','finmod(chi(2)=i,chi(3)=-1)','Liouville']
cols=[np.zeros(npr), np.where(primes==2,np.pi,0.0), np.where(primes==2,np.pi/2,np.where(primes==3,np.pi,0.0)), np.full(npr,np.pi)]
uinfo={}
for b0 in (0.75,0.875):
    th,trk,ssq=planted(b0); names.append('U(beta0=%g)'%b0); cols.append(th); uinfo[b0]=dict(track_err=trk,sum_a2=ssq)
for j in range(200): names.append('rand%03d'%j); cols.append(rng.uniform(0,2*np.pi,npr))
TH=np.array(cols).T  # npr x K
K=TH.shape[1]; B=26
print('planned alloc per batch: theta %d MB, complex %d MB'%(N*B*8/1e6,N*B*16/1e6),flush=True)
xs=np.arange(1,N+1,dtype=float)
dy=[10**3,3*10**3,10**4,3*10**4,10**5,3*10**5,10**6]
def main_coeff(name):
    if name=='zeta': return 1.0
    if name.startswith('finmod(chi(2)=-1'): return (1-.5)/(1+.5)
    if name.startswith('finmod(chi(2)=i'): return (1-.5)/(1-.5j)*(1-1/3)/(1+1/3)
    return 0.0
out=[]
for b in range(0,K,B):
    th=TH[:,b:b+B]; k=th.shape[1]
    theta=np.zeros((N+1,k))
    for i,p in enumerate(primes):
        pk=int(p)
        while pk<=N:
            theta[pk::pk]+=th[i]; pk*=int(p)
    chi=np.exp(1j*theta[1:]); del theta
    S=np.cumsum(chi,axis=0); M=np.cumsum(chi*mu[1:,None],axis=0)
    for j in range(k):
        nm=names[b+j]; c=main_coeff(nm)
        D=S[:,j]-c*xs
        rec=dict(name=nm,c=[c.real,c.imag] if isinstance(c,complex) else [c,0.0])
        aD=np.abs(D); aM=np.abs(M[:,j])
        rec['maxD']=[float(aD[:x].max()) for x in dy]
        rec['maxM']=[float(aM[:x].max()) for x in dy]
        # exponent: slope of log(max over (x/2,x]) between x=1e3 and 1e6, using rms over the block
        def expo(a):
            r1=np.sqrt(np.mean(a[500:1000]**2)); r2=np.sqrt(np.mean(a[500000:1000000]**2))
            return float(np.log(max(r2,1e-300)/max(r1,1e-300))/np.log(1000.0))
        rec['expD']=expo(aD); rec['expM']=expo(aM)
        out.append(rec)
    del chi,S,M
    print('batch',b,'done',flush=True)
json.dump(dict(N=N,dyadic=dy,uinfo=uinfo,rows=out),open('disc_test.json','w'))
print('x grid',dy)
for r in out[:6]:
    print(r['name'],'c=',r['c'],'\n  max|D|',['%.3g'%v for v in r['maxD']],'expD %.3f'%r['expD'],'\n  max|M|',['%.3g'%v for v in r['maxM']],'expM %.3f'%r['expM'])
R=out[6:]
for key in ('expD','expM'):
    v=np.array([r[key] for r in R]); print('random 200',key,'mean %.3f sd %.3f min %.3f max %.3f'%(v.mean(),v.std(),v.min(),v.max()))
for key in ('maxD','maxM'):
    v=np.array([r[key][-1] for r in R])/1000.0; print('random 200',key,'/sqrt(N): mean %.3f min %.3f max %.3f'%(v.mean(),v.min(),v.max()))
print('uinfo',uinfo)
