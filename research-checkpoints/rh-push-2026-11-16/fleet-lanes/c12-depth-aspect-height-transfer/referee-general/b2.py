import sys; sys.argv=['x']
exec(open(''+__file__.rsplit('/',1)[0]+'/brute.py').read().split("for p,k,t,r in")[0])
import math
for p,k,t in ((3,8,14.134725),(5,5,14.134725),(3,8,1.0),(3,8,0.1)):
    q,res=run(p,k,t,[5,11,17,31,97,300,900])
    print(f"p={p} k={k} q={q} t={t}: "+"  ".join(f"N={N}:{e:.3f}" for N,e in res))
