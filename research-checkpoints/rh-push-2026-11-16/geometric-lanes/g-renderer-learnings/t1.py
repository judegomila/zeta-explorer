from lib import *
# FE + symmetry check for DH
for s in [mpc(0.3,7.1), mpc(0.8,40.2)]:
    print('FE', abs(xi_dh(s)-xi_dh(1-s))/abs(xi_dh(s)), 'realline', im(xi_dh(mpc(0.5,s.imag))))
seeds=[mpc(0.808517,85.699348), mpc(0.650830,114.163343), mpc(0.574356,166.479306), mpc(0.724258,176.702461)]
for z in seeds:
    try:
        r=findroot(fdh,z); print('offline zero', r, abs(fdh(r)))
    except Exception as e: print('fail',z,e)
print('xi_z(1/2)',xi_z(mpf('0.5')+0j).real,' xi_dh(1/2)',xi_dh(mpf('0.5')+0j))
