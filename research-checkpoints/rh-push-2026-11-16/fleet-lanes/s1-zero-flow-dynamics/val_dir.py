import numpy as np, flint, mpmath as mp, gen_dir as G, math
t=np.array([0.3,5.0,17.3,85.7,300.1,1234.5,2999.9])
zc,zb=G.hardy(t)
flint.ctx.prec=100
chi=flint.dirichlet_char(5,2); chib=flint.dirichlet_char(5,3)
for i,tt in enumerate(t):
    print(tt, zc[i], float(chi.hardy_z(flint.acb(float(tt))).real), '|', zb[i].real, float(chib.hardy_z(flint.acb(float(tt))).real))
# DH off-line zero check
mp.mp.dps=30
s=mp.mpc('0.8085171825','85.6993484854')
a=(1-1j*G.KAPPA)/2
f=a*mp.dirichlet(s,[0,1,1j,-1j,-1])+a.conjugate()*mp.dirichlet(s,[0,1,-1j,1j,-1])
print('|DH(known off-line zero)| =', abs(f))
