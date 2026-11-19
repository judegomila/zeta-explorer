# UNIV illustration (MEASURED, float/ball arithmetic at 53 bits; a screen, not a certificate).
# Samples (zeta, L(chi_2), L(chi_3), L(chi_5)) mod 5 at s = 0.75 + it and reports how the value
# vectors fill C^4. Memory: arrays of 4 complex128 x N samples, N <= 40000 -> under 2 MB.
import json, sys, time, cmath, math
from flint import acb, dirichlet_char
SIG=0.75; STEP=0.2; TMAX=float(sys.argv[1]) if len(sys.argv)>1 else 8000.0
N=int((TMAX-10)/STEP); print("planned samples",N,"memory < 2 MB",flush=True)
chs=[dirichlet_char(5,2),dirichlet_char(5,3),dirichlet_char(5,4)]
targets4=[(1,-1,1j,-1j),(0.5,2,-1,1+1j),(-1,-1,-1,-1),(2j,0.3,0.3,-2)]
targets2=[(1,-1),(-2,0.2),(0.1j,3)]
best4=[9e9]*len(targets4); arg4=[0]*len(targets4)
best2=[9e9]*len(targets2); arg2=[0]*len(targets2)
pat=set(); patZre=set(); rmin=9e9; rmax=0; tmin=tmax=0
# cone tests on the value vector Z_c = (1/4) sum_chi conj(chi(c)) L(s,chi), c = 1..4 (chi_0 mod 5: zeta(1-5^-s))
chivals={1:[1,1,1,1],2:[1,1j,-1j,-1],3:[1,-1j,1j,-1],4:[1,-1,-1,1]}
out=[]; cps=[500,1000,2000,4000,8000,16000]; t0=time.time()
for i in range(N+1):
    t=10+i*STEP; s=acb(SIG,t)
    z=complex(s.zeta()); L=[complex(c.l(s)) for c in chs]
    v=(z,L[0],L[1],L[2])
    pat.add(tuple((x.real>0,x.imag>0) for x in v))
    for k,tg in enumerate(targets4):
        d=max(abs(a-b) for a,b in zip(v,tg))
        if d<best4[k]: best4[k]=d; arg4[k]=t
    for k,tg in enumerate(targets2):
        d=max(abs(z-tg[0]),abs(L[2]-tg[1]))
        if d<best2[k]: best2[k]=d; arg2[k]=t
    r=abs(L[2])/abs(z)
    if r<rmin: rmin=r; tmin=t
    if r>rmax: rmax=r; tmax=t
    l0=z*(1-5**(-(SIG+1j*t)))
    Ls={1:l0,2:L[0],3:L[1],4:L[2]}
    Z=[sum(complex(chivals[k][c-1]).conjugate()*Ls[k] for k in (1,2,3,4))/4 for c in (1,2,3,4)]
    patZre.add(tuple(x.real>0 for x in Z))
    if cps and t>=cps[0]-1e-9:
        cp=cps.pop(0)
        rec=dict(T=cp,samples=i+1,sign_patterns_of_256=len(pat),ReZ_sign_patterns_of_16=len(patZre),
                 best4=[round(x,4) for x in best4],at4=[round(x,1) for x in arg4],
                 best2=[round(x,4) for x in best2],at2=[round(x,1) for x in arg2],
                 ratio_min=rmin,ratio_min_t=tmin,ratio_max=rmax,ratio_max_t=tmax,secs=round(time.time()-t0,1))
        out.append(rec); print(json.dumps(rec),flush=True)
        if cp>=TMAX: break
json.dump(dict(sigma=SIG,step=STEP,targets4=[[str(x) for x in t] for t in targets4],targets2=[[str(x) for x in t] for t in targets2],rows=out),open("univ_density.json","w"),indent=1)
