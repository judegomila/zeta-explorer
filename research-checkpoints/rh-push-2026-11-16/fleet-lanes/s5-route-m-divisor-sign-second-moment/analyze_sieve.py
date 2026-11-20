# Combination 3: Mertens-type prime sums to X. Input: table from sieve_mertens (x, 12 sums).
import sys, json, math
from mpmath import mp, mpf, log, sqrt, euler, exp, zeta, glaisher, mpc, nstr
mp.dps=30
rows=[]
for l in open(sys.argv[1]):
    p=l.split(); rows.append((int(p[0]),[mpf(v) for v in p[1:]]))
# small-x table (x < first sieve checkpoint) in float64, same 12 sums
import numpy as _np
def small_table(XS):
    sv=_np.ones(XS+1,dtype=bool); sv[:2]=False
    for i in range(2,int(XS**.5)+1):
        if sv[i]: sv[i*i::i]=False
    p=_np.nonzero(sv)[0].astype(_np.float64); l=_np.log(p); pi_=p.astype(_np.int64)
    c4=_np.array([0,1,0,-1])[pi_%4]; c5=_np.array([0,1,-1,-1,1])[pi_%5]
    def rs(v):
        v=v.astype(_np.uint64); v^=v>>_np.uint64(33); v*=_np.uint64(0xff51afd7ed558ccd); v^=v>>_np.uint64(33); v*=_np.uint64(0xc4ceb9fe1a85ec53); v^=v>>_np.uint64(33); return _np.where(v&_np.uint64(1),1.0,-1.0)
    e=rs(pi_); u=_np.exp(-1j*l); tw=l*u/(p-u)
    cols=[l/(p-1),_np.log1p(-1/p),_np.where(c4!=0,c4*l/(p-c4),0),_np.where(c5!=0,c5*l/(p-c5),0),l/(p**0.75-1),l/(p**1.25-1),e*l/(p-e),tw.real,tw.imag,l/(p+1),l,_np.ones_like(p)]
    cs=[_np.cumsum(c) for c in cols]; out=[]; x=100.0
    while x<XS:
        k=_np.searchsorted(p,int(x),side='right')-1; out.append((int(x),[mpf(float(c[k])) for c in cs])); x*=1.01
    return out
if rows[0][0]>200: rows=small_table(min(rows[0][0],rows[1][0]-1 if len(rows)>1 else rows[0][0]))+rows
g=euler; lnA=log(glaisher); Binf=lnA+g/12
Lc4=mpf('0.245609584777057588984090664128'); Lc5=mpf('0.827679476714427033141723193505')
zt1=mpc('-0.529626211141003225440705855401','-0.825898467239620637250703281166')
z34=mpf('-4.62758246935942716013102759741'); z54=mpf('3.46665448124476248077921523264')
C2=-2*zeta(2,derivative=1)/zeta(2)
xl,last=rows[-1]; rlim=last[6]
out=[]; 
def corr(x): return 1+x**(-mpf(1)/6)/2+x**(-mpf(1)/4)/3+x**(-mpf(3)/10)/4
for x,s in rows:
    X=mpf(x); rx=sqrt(X); M=log(X)-s[0]; d={'x':x,'pi':int(s[11])}
    d['M_minus_gamma']=float(M-g); d['bracket']=nstr(lnA+M/12,14); d['Binf_minus_bracket']=float((g-M)/12)
    d['zeta_Dsqrt']=float((M-g)*rx); d['zeta_W']=float((M-g)*rx+corr(X))
    Pi=exp(s[1]); S=Pi*(lnA-s[0]/12); gap=S+exp(-g)/12; d['gap']=float(gap); d['gap_ratio']=float(gap*log(X)/(exp(-g)*Binf)); d['mertens3_eps']=float(Pi*log(X)*exp(g)-1)
    d['chi4_Dsqrt']=float((s[2]+Lc4)*rx); d['chi4_W']=float((s[2]+Lc4)*rx-1-X**(-mpf(1)/4)/3)
    d['chi5_Dsqrt']=float((s[3]+Lc5)*rx); d['chi5_W']=float((s[3]+Lc5)*rx-1-X**(-mpf(1)/4)/3)
    Da=s[4]-(4*X**mpf('0.25')+z34); d['Ea_minus_D']=float(Da); d['Ea_minus_Dsqrt']=float(Da*rx); d['Ea_minus_Dx14']=float(Da*X**mpf('0.25'))
    d['Ea_plus_Dx34']=float((s[5]-z54)*X**mpf('0.75'))
    d['rand_Dsqrt_over_sqrtlog']=float((s[6]-rlim)*rx/sqrt(log(X)))
    Dt=mpc(s[7],s[8])-zt1-1j*exp(-1j*log(X)); W=Dt*rx-exp(-1j*log(X))/(1+2j); d['twist_absDsqrt']=float(abs(Dt)*rx); d['twist_absW']=float(abs(W))
    d['liou_Dsqrt']=float((s[9]-(log(X)-g-C2))*rx)
    d['theta_err_over_sqrt']=float((s[10]-X)/rx)
    out.append(d)
json.dump(out,open(sys.argv[2],'w'))
def pick(t): return min(out,key=lambda d:abs(math.log(d['x']/t)))
print('x | M-gamma | (M-gamma)sqrt x | zeta W | chi4 W | chi5 W | twist |W| | Liouville D sqrt x | E_a D x^(1/4) | E_a D sqrt x | random D sqrt(x/log x) | Binf-bracket | gap ratio | mertens eps')
for t in (1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12):
    d=pick(t)
    if abs(math.log(d['x']/t))>0.05: continue
    print('%.4g | %.4e | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %.2f | %.3f | %.4e | %.10f | %.3e'%(d['x'],d['M_minus_gamma'],d['zeta_Dsqrt'],d['zeta_W'],d['chi4_W'],d['chi5_W'],d['twist_absW'],d['liou_Dsqrt'],d['Ea_minus_Dx14'],d['Ea_minus_Dsqrt'],d['rand_Dsqrt_over_sqrtlog'],d['Binf_minus_bracket'],d['gap_ratio'],d['mertens3_eps']))
# sup over decades and exponent fits on [1e6, X]
import numpy as np
xs=np.array([d['x'] for d in out],dtype=float)
def sup(key,lo,hi,ab=True):
    v=np.array([d[key] for d in out])[(xs>=lo)&(xs<=hi)]
    return float(np.max(np.abs(v))) if len(v) else float('nan')
print('sup over decades of |W| or |D| sqrt x:')
for lo in (1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11):
    hi=lo*10
    if xs.max()<hi*0.99: break
    print('[%.0e,%.0e]'%(lo,hi),' '.join('%s=%.4f'%(k,sup(k,lo,hi)) for k in ('zeta_W','chi4_W','chi5_W','twist_absW','liou_Dsqrt','rand_Dsqrt_over_sqrtlog','Ea_minus_Dsqrt','theta_err_over_sqrt')))
def expo(key):
    m=(xs>=1e6); v=np.abs(np.array([d[key] for d in out]))[m]; lx=np.log(xs[m]); ok=v>0
    # envelope fit: maxima over bins of width 1 in log x
    bins=np.floor(lx[ok]).astype(int); mx={}
    for b_,val in zip(bins,v[ok]): mx[b_]=max(mx.get(b_,0),val)
    kx=np.array(sorted(mx)); ky=np.log(np.array([mx[k] for k in kx])); 
    return float(np.polyfit(kx+0.5,ky,1)[0])
print('envelope exponents of |D(x)| (D sqrt x fitted, minus 1/2):')
for k,lab in (('zeta_Dsqrt','zeta'),('chi4_Dsqrt','chi_-4'),('chi5_Dsqrt','chi_5'),('twist_absDsqrt','twist'),('liou_Dsqrt','Liouville'),('Ea_minus_Dsqrt','E_a (s-a part)')):
    print(lab,'%.3f'%(expo(k)-0.5))
