import sys, numpy as np, math, time
import engine as E
from numba import njit
@njit(cache=True)
def diag(G,Gp,wtab,par,xphi,jlo,jhi,out):
    Mh=par[0]; n=0; n3=0
    za,da=E.evalZ(jlo-Mh,G,Gp,wtab,par,xphi)
    for j in range(jlo,jhi):
        ka=j-Mh
        zb,db=E.evalZ(ka+1.0,G,Gp,wtab,par,xphi)
        simple=(za*zb>0) and ((za>0 and da<0 and db>0) or (za<0 and da>0 and db<0))
        if not simple:
            # brute subdivide 16 and count sign changes
            prev=za; cnt=0
            for s in range(1,17):
                z=zb if s==16 else E.evalZ(ka+s/16.0,G,Gp,wtab,par,xphi)[0]
                if z*prev<0: cnt+=1
                prev=z
            exp=1 if za*zb<0 else 0
            if cnt!=exp and n<out.shape[0]:
                out[n,0]=ka; out[n,1]=za; out[n,2]=zb; out[n,3]=da; out[n,4]=db; out[n,5]=cnt; n+=1
        za=zb; da=db
    return n
uhi,ulo,logn=E.load_u(sys.argv[1])
M=1<<25
w=E.Window(10**15,M,uhi,ulo,logn)
out=np.zeros((200,6))
t0=time.time(); n=diag(w.G,w.Gp,E.WTAB,w.par,w.xphi,430,M-430,out); print(n,time.time()-t0)
np.set_printoptions(linewidth=200); print(out[:n])
