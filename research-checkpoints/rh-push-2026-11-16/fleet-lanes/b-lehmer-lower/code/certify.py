# certify.py polish.npy ntop out.json : Arb (ball arithmetic) sign certificates for the closest pairs.
# For each pair: rigorous signs of Hardy Z at ra-w, ra+w, rb-w, rb+w  (w = 1e-3*gap) => two zeros of Z, gap in (gap-2w, gap+2w); plus Z at the extremum.
import sys, json, numpy as np, flint, time
flint.ctx.prec=220
pol=np.load(sys.argv[1]); ntop=int(sys.argv[2])
import os
T1X=json.load(open(sys.argv[1]+'.T1.json')) if os.path.exists(sys.argv[1]+'.T1.json') else {}
SKIP=int(sys.argv[4]) if len(sys.argv)>4 else 0
pol=pol[pol[:,10]==1]; pol=pol[np.argsort(pol[:,4])][SKIP:ntop]
def Z(T1,tau):
    t=flint.arb(int(T1))+flint.arb(float(tau))      # exact dyadic
    s=flint.acb(flint.arb(0.5),t)
    th=flint.acb(flint.arb(0.25),t/2).lgamma().imag-t/2*flint.arb.pi().log()
    z=s.zeta()*flint.acb(0,th).exp()
    return z.real, z.imag
out=[]
for p in pol:
    T1=int(T1X.get(str(int(p[0])),int(p[1]))); ra,rb,gap,tm=float(p[2]),float(p[3]),float(p[4]),float(p[7])
    w=max(gap*1e-3,1e-9)
    t0=time.time()
    vals=[Z(T1,x) for x in (ra-w,ra+w,rb-w,rb+w,tm)]
    re=[v[0] for v in vals]
    sg=[1 if v>0 else (-1 if v<0 else 0) for v in re]
    ok=(sg[0]*sg[1]==-1) and (sg[2]*sg[3]==-1) and (sg[1]*sg[2]==1) and all(v[1].contains(0) for v in vals)
    rec=dict(T1=T1,tau_a=ra,tau_b=rb,gap=gap,gap_lo=gap-2*w,gap_hi=gap+2*w,signs=sg,certified=bool(ok),Zstar_arb=str(re[4]),Zstar_double=float(p[8]),
             Z_pts=[str(v) for v in re[:4]],sec=time.time()-t0)
    out.append(rec); print(json.dumps(rec),flush=True)
json.dump(out,open(sys.argv[3],"w"),indent=1)
