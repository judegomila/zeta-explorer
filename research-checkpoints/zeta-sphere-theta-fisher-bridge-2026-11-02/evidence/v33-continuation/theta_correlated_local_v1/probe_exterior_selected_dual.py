"""UNCERTIFIED exterior-shift falsification probe, not a theorem or certificate."""
exec(open('/workspace/shared/zeta_sphere_campaign/theta_correlated_local_v1/probe_selected_canonical_remainder_next_test.py').read().split('polys=[]')[0])
import numpy as np
from scipy.optimize import linprog
nodes,qweights=np.polynomial.legendre.leggauss(180)
qu=[mp.mpf(str((x+1)*mp.mpf('1.5'))) for x in nodes]
qw=[mp.mpf(str(w))*mp.mpf('1.5') for w in qweights]
points=[mp.mpf(0)]+[(mp.mpf(k)+mp.mpf('.5'))/100 for k in range(180)]
def bw(u):
 z=mp.pi*mp.exp(2*u)
 psi=4*mp.exp(u/2)*sum((2*(n*n*z)**2-3*n*n*z)*mp.exp(-n*n*z) for n in range(1,9))
 return 2*u*u*psi*psi
qg=[gs(u) for u in qu];gg=[gs(u) for u in points]
qb=[bw(u)*w for u,w in zip(qu,qw)];pb=[mp.mpf('1e-5')]+[bw(u)/100 for u in points[1:]]
for aa in [mp.mpf('.5'),mp.mpf(1),mp.mpf(2),mp.mpf(4),mp.mpf(8),mp.mpf(16)]:
 def sc(u):return mp.sinh(2*aa*u)/(2*aa*u) if u else mp.mpf(1)
 weights=[w*sc(u) for w,u in zip(qb,qu)];mass=sum(weights)
 mm=[sum(w*g[j] for w,g in zip(weights,qg))/mass for j in range(20)]
 for n in [15,19,20]:
  N=n//2;ep=n%2
  A=mp.matrix([[mm[ep+i+j] for j in range(N)] for i in range(N)])
  b=mp.matrix([mm[ep+N+i] for i in range(N)])
  c=list(-mp.lu_solve(A,b))+[mp.mpf(1)]
  ZZ=[[sum(c[i]*g[ep+i+k] for i in range(N+1)) for k in range(N)] for g in gg]
  FF=[sum(c[i]*c[j]*g[ep+i+j] for i in range(N+1) for j in range(N+1)) for g in gg]
  ww=[w*sc(u)/mass for w,u in zip(pb,points)]
  C=mp.matrix([[sum(w*r[i]*r[j] for w,r in zip(ww,ZZ)) for j in range(N)] for i in range(N)])
  Wh=mp.inverse(mp.cholesky(C))
  Z=np.array([[float(sum(Wh[k,j]*ZZ[i][j] for j in range(N))*ww[i]) for i in range(len(points))] for k in range(N)])
  fw=np.array([float(f*w) for f,w in zip(FF,ww)]);wv=np.array(list(map(float,ww)))
  res=linprog(fw/max(abs(fw)),A_eq=np.vstack([wv,Z]),b_eq=np.r_[1,np.zeros(N)],bounds=(0,None),method='highs',options={'dual_feasibility_tolerance':1e-9,'primal_feasibility_tolerance':1e-9})
  print('UNCERTIFIED',str(aa),n,res.success,'localmin',mp.nstr(min(FF),12),end=' ')
  if res.success:
   masses=res.x*wv;ids=np.where(masses>1e-30)[0]
   print('dual',float(fw@res.x),'atoms',len(ids),'resid',max(abs(Z@res.x)),flush=True)
   if len(ids)==N+1:
    exact=mp.lu_solve(mp.matrix([[1 for i in ids]]+[[ZZ[i][j] for i in ids] for j in range(N)]),mp.matrix([1]+[0]*N))
    obj=sum(exact[k]*FF[i] for k,i in enumerate(ids))
    if obj<0 and min(exact)>0:print('NEGATIVE_CANDIDATE',str(aa),n,[(str(points[i]),mp.nstr(exact[k],30)) for k,i in enumerate(ids)],mp.nstr(obj,40),flush=True)
  else:print(res.message,flush=True)
