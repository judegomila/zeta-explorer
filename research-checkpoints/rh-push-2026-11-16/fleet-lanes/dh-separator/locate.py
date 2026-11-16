import sys, os, importlib.util, numpy as np, mpmath as mp
d=os.path.dirname(os.path.abspath(__file__))
def load(n):
    spec=importlib.util.spec_from_file_location(n, os.path.join(d,n+".py")); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
scan=load("scan"); dhf=load("dhf")
from flint import acb, ctx
ctx.prec=120; mp.mp.dps=30
def F(s):
    s=mp.mpc(s); v=dhf.f(acb(mp.nstr(s.real,35),mp.nstr(s.imag,35))); return mp.mpc(v.real.mid().str(35,radius=False), v.imag.mid().str(35,radius=False))
t0,t1,s0=float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3])
M=int(1.2*t1)+50
ss=np.arange(s0,1.6,0.01); tt=np.arange(t0,t1,0.01)
best=[]
for s in ss:
    v=np.abs(scan.f_vec(s+1j*tt,M)); 
    for i in np.argsort(v)[:3]: best.append((v[i],s,tt[i]))
best.sort(); found=[]
for v,s,t in best[:12]:
    try: r=mp.findroot(F, mp.mpc(s,t), tol=1e-22)
    except Exception as e:
        print("fail",s,t,repr(e)[:200]); continue
    if all(abs(r-q)>1e-6 for q in found) and t0-1<mp.im(r)<t1+1 and mp.re(r)>0.5+1e-6: found.append(r)
for r in found: print("DH zero:", mp.nstr(r,22), "|f|=", mp.nstr(abs(F(r)),3))
