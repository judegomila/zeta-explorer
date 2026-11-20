import sys, json; sys.path.insert(0,'code'); sys.argv=['x']
import lemh
from flint import arb, acb, ctx
ctx.prec=128
f=lambda u: lemh.phie(arb(u))
print('turan (u=0.3,h=0.4), my normalisation Phi(u):', (f("-0.1")*f("0.7")/f("0.3")**2).str(12))
g=lambda u: lemh.phie(arb(u)/2)
print('turan, Phi(u/2):', (g("-0.1")*g("0.7")/g("0.3")**2).str(12))
# sinc^2 minimum of the real part on |w|<=1/2
import cmath, math
m=min(((cmath.sin(w)/w)**2).real for w in (0.5*cmath.exp(1j*math.pi*k/2000) for k in range(4000)))
print('min Re sinc^2 on |w|=1/2:', m, ' 2*m/(2pi)=', 2*m/(2*math.pi), ' 2*0.91/(2pi)=', 2*0.91/(2*math.pi))
d=json.load(open('dn_out_feas500.json'))
rows=d['rows']; print(d['counts'], d['seconds'])
import collections
print('nb', collections.Counter(r['nb'] for r in rows), 'maxprec', collections.Counter(r['maxprec'] for r in rows), 'nleft', collections.Counter(r['nleft'] for r in rows))
print('rejectable', collections.Counter(tuple(r['rejectable']) for r in rows))
ref=json.load(open('../c16-dn-canonical-tier-ball-conversion/out/feas.json'))
R={(r['fam'],r['node']):r for r in ref['rows']}
print('lane rows', len(R), collections.Counter((r['fam'],r['res'],r['nb']>0) for r in ref['rows']))
mx=0; nint=0; bad=0
for r in rows:
    q=R[(r['fam'],r['node'])]
    a=r.get('ints',[]); b=q.get('ints',[])
    if len(a)!=len(b): bad+=1; continue
    for x,y in zip(a,b):
        nint+=1
        if x[0]!=y[0]: bad+=1
        for i in (1,2):
            if x[i]==y[i]: continue
            den=max(abs(x[i]),abs(y[i]))
            mx=max(mx,abs(x[i]-y[i])/den if den and abs(den)!=float('inf') else float('inf'))
print('intervals compared', nint, 'structure mismatches', bad, 'max rel diff of interval ends ball vs lane float64', mx)
us=[abs(r['u']) for r in rows]; print('abs u range', min(us), max(us))
fl=[k for k,q in R.items() if q.get('secondary',{}).get('any')]
print('flagged in lane', len(fl), 'of which in my sample', sum(1 for r in rows if (r['fam'],r['node']) in set(fl)))
