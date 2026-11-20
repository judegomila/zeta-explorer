# summ3.py : summary of test 3 (twisted reflection-odd moments) from srv/t3_*.json, plus the T-NR combination from zeta rows
import json, glob, math, numpy as np, sys
D='srv'
res={}
for f in sorted(glob.glob(f'{D}/t3_*.json')):
    d=json.load(open(f)); res[(d['fn'],d['T'])]=d
def band(th): return '1/4' if th<0.38 else ('1/2' if th<0.75 else '1')
summ=[]
for (fn,T),d in sorted(res.items(),key=lambda kv:(kv[0][1],kv[0][0])):
    full=any('pred' in r for r in d['rows'])
    row={'fn':fn,'T':T,'range':d['range'],'blocks':d['blocks'],'fe_rel_l2':d['fe_rel_l2'],'mean_abs2_over_T':d['mean_abs2_over_T']}
    if full:
        for bnd in ['1/4','1/2','1']:
            for key in ['rem_plus','rem_minus','rem_O']:
                for xi,x in enumerate(d['xs']):
                    v=[r['pred'][xi][key] for r in d['rows'] if 'pred' in r and band(r['theta'])==bnd and r['k']>1 and r['h']<r['k']]
                    if v: row[f'{key}|theta={bnd}|x={x}']=[float(np.median(v)),float(np.max(v)),len(v)]
        # crest fractions
        for (h,k) in [(1,5),(1,6),(1,7),(1,2)]:
            for r in d['rows']:
                if (r['h'],r['k'])==(h,k) and 'pred' in r: row[f'crest {h}/{k}']=[[p['x'],p['rem_plus'],p['rem_O'],p['relrem_O']] for p in r['pred']]
    summ.append(row)
# T-NR (q=101, c=2.2) from zeta rows
q=101; c=2.2; p={-1:1.0,0:c,1:1.0}
nr=[]
for (fn,T),d in res.items():
    if fn!='zeta': continue
    rows={(r['h'],r['k']):r for r in d['rows']}
    for (h,k),r in rows.items():
        if 'pred' not in r or h>=k and (h,k)!=(1,1): continue
        ok=True; tot={}
        for xi,x in enumerate(d['xs']):
            remp=0j; remm=0j; Ip=0j; Dp=0.0
            for i in (-1,0,1):
                for j in (-1,0,1):
                    dd=i-j; hh=h*q**max(dd,0); kk=k*q**max(-dd,0); g=math.gcd(hh,kk); key=(hh//g,kk//g)
                    if key not in rows or 'pred' not in rows[key]: ok=False; break
                    rr=rows[key]; pr=rr['pred'][xi]
                    I1=complex(*rr['I'][xi]); I2=complex(*rr['I'][3+xi])
                    remp+=p[i]*p[j]*q**((i+j)*x)*(I1-pr['D_plus']); remm+=p[i]*p[j]*q**(-(i+j)*x)*(I2-pr['D_minus'])
                    Ip+=p[i]*p[j]*q**((i+j)*x)*I1; Dp+=p[i]*p[j]*q**((i+j)*x)*pr['D_plus']
                if not ok: break
            if not ok: break
            nrm=T/math.sqrt(h*k); tot[x]=[abs(remp)/nrm,abs(remm)/nrm,abs(remp)/abs(Dp) if Dp else None, r['pred'][xi]['rem_plus'], r['pred'][xi]['rem_minus']]
        if ok: nr.append({'T':T,'h':h,'k':k,'theta':r['theta'],'x: [NR rem+, NR rem-, NR relrem+, zeta rem+, zeta rem-]':tot})
json.dump({'summary':summ,'tnr':nr},open('out/summ3.json','w'),indent=1)
for r in summ:
    print(r['fn'],'T=%g'%r['T'],'blocks',r['blocks'],'FE',['%.1e'%v for v in r['fe_rel_l2']])
    for k,v in r.items():
        if k.startswith('rem_') and 'x=0.1' in k: print('    ',k,'median %.3e max %.3e n=%d'%tuple(v))
    for k,v in r.items():
        if k.startswith('crest'): print('    ',k,[['%.2g'%a for a in vv] for vv in v])
for r in nr: print('TNR',r['T'],r['h'],r['k'],{x:['%.2e'%a for a in v] for x,v in r['x: [NR rem+, NR rem-, NR relrem+, zeta rem+, zeta rem-]'].items()})
