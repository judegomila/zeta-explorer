# Checks of the single-scale explicit formula used in RESULT.md section 3 (Test 2).
# P_X(t) = sum_n Lam_F(n) w(n/X) n^{-1/2-it} = - sum_rho X^{rho-1/2-it} W(rho-1/2-it) + pole term + O(1/X)
# (a) zeta: prime side against the zero side with the first 120 zeros.
# (b) DH: peak of |P_X(t)| at the off-line zero 0.8085171825+85.6993484854i, growth X^{0.3085}.
# Planned memory: arrays of length <= 6e4 floats/complex: < 10 MB.
import numpy as np, mpmath as mp, json, math
LOG2=math.log(2.0)
v=np.linspace(-LOG2,LOG2,20001)[1:-1]; dv=v[1]-v[0]
wv=np.exp(-1.0/(1.0-(v/LOG2)**2))
def w(y):
    u=np.log(y)/LOG2; out=np.zeros_like(u); m=np.abs(u)<1
    out[m]=np.exp(-1.0/(1.0-u[m]**2)); return out
def W(z):  # Mellin transform int w(y) y^{z-1} dy = int w(e^v) e^{zv} dv
    return np.sum(wv*np.exp(z*v))*dv
out={}
# ---------- (a) zeta
N=4200
sieve=np.ones(N+1,bool); sieve[:2]=False
for p in range(2,int(N**.5)+1):
    if sieve[p]: sieve[p*p::p]=False
Lam=np.zeros(N+1)
for p in np.nonzero(sieve)[0]:
    q=p
    while q<=N: Lam[q]=math.log(p); q*=p
n=np.arange(1,N+1)
mp.mp.dps=20
gam=[float(mp.im(mp.zetazero(k))) for k in range(1,121)]
rows=[]
for X in (500.0,2000.0):
    for t in (40.0,60.0,77.1448,90.0):
        a=Lam[1:]*w(n/X)/np.sqrt(n)
        prime=np.sum(a*np.exp(-1j*t*np.log(n)))
        zs=0
        for g in gam:
            for gg in (g,-g):
                zs+= -np.exp(1j*(gg-t)*math.log(X))*W(1j*(gg-t))
        pole=X**(0.5-1j*t)*W(0.5-1j*t)
        rows.append(dict(X=X,t=t,prime=[prime.real,prime.imag],zero_side=[(zs+pole).real,(zs+pole).imag],abs_diff=abs(prime-zs-pole)))
out['zeta']=rows
# ---------- (b) DH
kappa=(math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
per=[0.0,1.0,kappa,-kappa,-1.0]
NM=70000
a=np.array([per[k%5] for k in range(NM+1)]); a[0]=0
# Lam_F: a(n) log n = sum_{d|n} Lam_F(d) a(n/d), a(1)=1
LF=np.zeros(NM+1); acc=np.zeros(NM+1)   # acc[n] = sum_{d|n, d<n} LF(d) a(n/d)
logn=np.log(np.maximum(np.arange(NM+1),1))
for d in range(2,NM+1):
    LF[d]=a[d]*logn[d]-acc[d]
    if LF[d]!=0.0:
        m=np.arange(2,NM//d+1)
        acc[d*m]+=LF[d]*a[m]
nn=np.arange(1,NM+1)
out['dh_LamF_first']=[float(x) for x in LF[1:13]]
out['dh_LamF_absmax_over_log_by_range']=[[int(M),float(np.max(np.abs(LF[1:M+1])/np.maximum(logn[1:M+1],1e-9)))] for M in (100,1000,10000,70000)]
g0=85.6993484854; eta=0.8085171825-0.5
ts=np.linspace(g0-6,g0+6,481)
dh=[]
for X in (1000.0,3000.0,10000.0,30000.0):
    aa=LF[1:]*w(nn/X)/np.sqrt(nn); m=aa!=0
    ph=np.exp(-1j*np.outer(ts,np.log(nn[m])))
    P=ph@aa[m]
    k=int(np.argmax(np.abs(P)))
    pred=X**eta*abs(W(eta))
    P0=abs(np.sum(aa[m]*np.exp(-1j*g0*np.log(nn[m]))))
    far=np.abs(ts-g0)>2.5
    dh.append(dict(X=X,peak_t=float(ts[k]),peak_abs=float(abs(P[k])),abs_at_zero=float(P0),predicted_X_eta_W=float(pred),
                   median_abs_far=float(np.median(np.abs(P[far]))),mean_sq_Lam=float(np.sum(aa**2))))
out['dh']=dh
sl=np.polyfit(np.log([r['X'] for r in dh]),np.log([r['abs_at_zero'] for r in dh]),1)[0]
out['dh_slope_abs_at_zero_vs_logX']=float(sl); out['dh_eta']=eta
json.dump(out,open(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'detector.json'),'w'),indent=1)
print(json.dumps(out,indent=1))
