"""Join the zero census (twins.jsonl) with sigma* (sigma_star.json); regress off-line statistics on |target| and Euler density."""
import json, math
import numpy as np
tw=[json.loads(l) for l in open('twins.jsonl') if l.strip()]
try:
    ss={(t['q'],t['m'],t['omega']):t['sigma_star'] for t in json.load(open('sigma_star.json'))['twins']}
except Exception: ss={}
rows=[]
for t in tw:
    Tm=t['T']; off=t['N_off']; tot=round(t['N_total'])
    # the t-grid ends 0.01 below T; an on-line zero in (T-0.01, T) is in N_total but not in the sign-change count.
    # Verified directly for the two affected runs (q,m,omega) = (29,4,-1), (37,6,-1): Z_F changes sign in (150.29, 150.30).
    if off%2==1: off-=1; t=dict(t); t['N_online']+=1
    rows.append(dict(q=t['q'],m=t['m'],order=t['order'],om=t['omega'],dens=t['euler_density'],tgt=abs(t['target']),absc=t['abs_c'],T=Tm,N=tot,on=t['N_online'],off=off,
        offfrac=off/tot,r75=round(t['N_right_075']),r1=round(t['N_right_1']),r75res=abs(t['N_right_075']-round(t['N_right_075'])),totres=abs(t['N_total']-tot),
        sig=ss.get((t['q'],t['m'],t['omega'])),real=t['reality_defect']))
rows.sort(key=lambda r:(r['q'],r['m'],-r['om']))
print('%3s %3s %4s %3s %6s %6s %6s %5s %5s %4s %7s %4s %4s %7s'%('q','m','ord','om','dens','|tgt|','|c|','N','on','off','offfrac','r75','r1','sigma*'))
for r in rows:
    print('%3d %3d %4d %3d %6.3f %6.3f %6.2f %5d %5d %4d %7.4f %4d %4d %7s'%(r['q'],r['m'],r['order'],r['om'],r['dens'],r['tgt'],r['absc'],r['N'],r['on'],r['off'],r['offfrac'],r['r75'],r['r1'],('%.4f'%r['sig']) if r['sig'] else '-'))
print('max |N_total - int|',max(r['totres'] for r in rows),'max |N_right_075 - int|',max(r['r75res'] for r in rows),'max reality defect',max(r['real'] for r in rows),
      'odd N_off count',sum(1 for r in rows if r['off']%2),'negative N_off',sum(1 for r in rows if r['off']<0))
def reg(y,Xs,names):
    X=np.column_stack([np.ones(len(y))]+Xs); b,res,rk,sv=np.linalg.lstsq(X,y,rcond=None)
    yh=X@b; r2=1-((y-yh)**2).sum()/((y-y.mean())**2).sum()
    n,k=X.shape; s2=((y-yh)**2).sum()/(n-k); cov=s2*np.linalg.inv(X.T@X); se=np.sqrt(np.diag(cov))
    return {'coef':dict(zip(['const']+names,[float(x) for x in b])),'t':dict(zip(['const']+names,[float(x) for x in b/se])),'R2':float(r2),'n':n}
out={'rows':rows}
for label,sel in (('T=600 (q<=19)',[r for r in rows if r['T']>500]),('all',rows)):
    if len(sel)<6: continue
    y=np.array([r['offfrac'] for r in sel]); tg=np.array([r['tgt'] for r in sel]); de=np.array([r['dens'] for r in sel]); lq=np.log([r['q'] for r in sel])
    r75=np.array([r['r75']/r['T'] for r in sel])
    print('---',label,'n=',len(sel))
    print('corr(offfrac,|target|)=%.3f corr(offfrac,dens)=%.3f corr(|target|,dens)=%.3f'%(np.corrcoef(y,tg)[0,1],np.corrcoef(y,de)[0,1],np.corrcoef(tg,de)[0,1]))
    a=reg(y,[tg,de,lq],['abs_target','euler_density','log_q']); print('offfrac ~',a)
    b=reg(r75,[tg,de,lq],['abs_target','euler_density','log_q']); print('N(sigma>0.75)/T ~',b)
    out[label]={'offfrac_reg':a,'r75_reg':b,'corr_off_target':float(np.corrcoef(y,tg)[0,1]),'corr_off_dens':float(np.corrcoef(y,de)[0,1])}
    for d in sorted(set(de)):
        s=[r for r in sel if r['dens']==d]
        print('  dens %.3f n=%2d mean offfrac %.4f  mean N(>0.75)/T %.4f  mean |target| %.3f'%(d,len(s),np.mean([r['offfrac'] for r in s]),np.mean([r['r75']/r['T'] for r in s]),np.mean([r['tgt'] for r in s])))
json.dump(out,open('analyze.json','w'),indent=1)
