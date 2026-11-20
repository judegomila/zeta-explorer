# |log zeta(s) - log P_Y(s)| from eptail output; reference zeta(s) by mpmath (30 digits).
import sys, json, cmath
import mpmath as mp
mp.mp.dps=30
rows={}
for line in open(sys.argv[1]):
    c,sg,Y,re,im=line.split(); rows.setdefault((float(c),float(sg)),[]).append((int(Y),complex(float(re),float(im))))
out=[]
for (c,sg),lst in sorted(rows.items()):
    z=mp.zeta(mp.mpc(sg,mp.mpf(c)))
    for Y,S in lst:
        q=z*mp.exp(-mp.mpc(S.real,S.imag)); out.append(dict(c=c,sigma=sg,Y=Y,abs_log_ratio=float(abs(mp.log(q)))))
json.dump(out,open(sys.argv[2],'w'),indent=0)
for r in out:
    if r['Y'] in (100,10000,10**6,10**8,10**9): print(r)
