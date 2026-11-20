import numpy as np, math
from cm import *
from numpy.polynomial.hermite import hermgauss
# (A) Hermite self-similar solution
for N in (4,8,16,32,64):
    z,_=hermgauss(N); z=np.sort(z)
    # check sum_{j!=k} 1/(z_k-z_j) = z_k
    d=z[:,None]-z[None,:]; np.fill_diagonal(d,np.inf); res=np.max(np.abs((1/d).sum(1)-z))
    th=thetas(z); g=np.diff(z)
    i=int(np.argmin(g))
    print("N",N,"resid",res,"max|Theta_i-(1-g_i^2/2)|",np.max(np.abs(th-(1-g*g/2))),"Theta_min",th[i],"1-pi^2/4N",1-math.pi**2/(4*N),"tc/m^2=",0.25/g[i]**2,"N/2pi^2",N/(2*math.pi**2),"rho",rho(z,i))
print("c* =",math.sqrt(2+math.sqrt(3))-1)
z,_=hermgauss(8); rec=run(np.sort(z),floor=1e-2)
print("Hermite-8 run: Theta_min first/last",rec[0][2],rec[-1][2],"s_end",rec[-1][0],"pred",0.25*(1-1e-4), "idx set",sorted(set(r[1] for r in rec)))
