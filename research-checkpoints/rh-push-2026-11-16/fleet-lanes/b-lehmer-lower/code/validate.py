import sys, numpy as np, time, math
import engine as E
d=sys.argv[1]
uhi,ulo,logn=E.load_u(d)
# Odlyzko zeros3: gamma - 267653395647 for zeros 1e12+1..1e12+1e4
ref=[]
for line in open(sys.argv[2]):
    s=line.strip()
    try: ref.append(float(s))
    except: pass
ref=np.array(ref); print(len(ref),ref[:3],ref[-1])
T0=267653395647+1200
M=1<<17
w=E.Window(T0,M,uhi,ulo,logn)
print("h",w.h,"Kc",w.Kc,"nufft",w.t_nufft)
klo=-M/2+300; khi=M/2-300
t0=time.time(); zs,fl,un=w.zeros(klo,khi); print("zeros",len(zs),time.time()-t0,"unres",len(un))
g=1200+zs*w.h
a=np.searchsorted(g,ref[0]-1e-4); g=g[a:a+len(ref)]; r=ref; n=len(ref)
df=g[:n]-r[:n]
print("matched",n,"max|diff|",np.abs(df).max(),"rms",df.std(), "first",g[:3],r[:3])
