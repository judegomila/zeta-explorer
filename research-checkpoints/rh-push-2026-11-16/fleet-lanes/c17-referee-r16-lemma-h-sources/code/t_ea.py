import sys, time; sys.argv=['x']; sys.path.insert(0,'code')
import lemh
from flint import arb, acb, ctx
cnt=[0]
u=arb("0.3"); a=arb("0.2")
def f(v, an):
    cnt[0]+=1
    return lemh.phie(v)*lemh.phie(u-v)*(2*a*(2*v-u)).exp()
for kw in (dict(rel_tol=arb(2)**-70), dict(rel_tol=arb(2)**-70, abs_tol=arb(10)**-40)):
    cnt[0]=0; t=time.time()
    try:
        val=acb.integral(f,-1.6,1.6,eval_limit=200000,**kw); print(val, cnt[0], time.time()-t, flush=True)
    except Exception as e: print('err',e,cnt[0])
