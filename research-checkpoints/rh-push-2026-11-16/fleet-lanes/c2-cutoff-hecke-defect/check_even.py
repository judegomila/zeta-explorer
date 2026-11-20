# validation: kappa(-x) = kappa(x) for zeta and DH kernels (functional equation), so constants are right
import sys; sys.argv=['x','--dps','40']
exec(open('defect_gram.py').read().split("kap = make_kernel")[0])
for x in ['0.3','1.1','2.0']:
    xa=arb(x)
    print('zeta',x,kappa_zeta(xa).str(25),kappa_zeta(-xa).str(25))
    print('dh  ',x,kappa_dh(xa).str(25),kappa_dh(-xa).str(25))
