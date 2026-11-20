import flint,time,math
from flint import acb,arb,dirichlet_char,ctx
print(acb.zeta_zeros.__doc__); print(arb.zeta_nzeros.__doc__); print(dirichlet_char.l.__doc__)
ctx.prec=64
for T in (1e3,1e4,1e5,1e6):
    n=int(arb(T).zeta_nzeros().mid().floor().str(30).split('.')[0]) if False else int(float(arb(T).zeta_nzeros().mid()))
    t=time.time(); z=acb.zeta_zeros(n+1,200); print(T,n,z[0],z[-1],time.time()-t,flush=True)
chi=dirichlet_char(5,2); print(chi(2),chi(3))
for t0 in (10.,1e3,1e4):
    t=time.time()
    for k in range(200): v=chi.l(acb(0.5,t0+k*0.01))
    print(t0,v,(time.time()-t)/200,flush=True)
