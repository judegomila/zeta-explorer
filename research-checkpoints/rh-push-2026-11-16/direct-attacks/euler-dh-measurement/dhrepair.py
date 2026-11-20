import mpmath as mp, sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick import L_dh, nodes, ldl_min
from twin2 import quad
mp.mp.dps=40
rho = mp.mpc('0.8085171824566373855533519606068441278507','85.69934848537759217192926770894172903799')
def L_rep(x):
    d = mp.re(rho)-mp.mpf(1)/2; g = mp.im(rho)
    return L_dh(x) - quad(x,g,d) + 2*x/(x**2+g**2)
for N in (12,14,16,18,20,24):
    mp.mp.dps = 40+8*N
    f1,p1 = ldl_min(nodes(N,mp.mpf('0.01'),mp.mpf('0.5')), L_dh)
    f2,p2 = ldl_min(nodes(N,mp.mpf('0.01'),mp.mpf('0.5')), L_rep)
    print(N, "DH:", f1, mp.nstr(min(p1),4), " DH-with-85.7-quadruple-moved-to-line:", f2, mp.nstr(min(p2),4), flush=True)
