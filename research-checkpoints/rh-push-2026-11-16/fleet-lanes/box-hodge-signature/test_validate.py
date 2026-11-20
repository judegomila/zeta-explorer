# validation: P - I (prime side, bh.py) against the zero sum for zeta; and against the sibling numbers
import sys, time, mpmath as mp
from bh import *
dps = 30
setprec(dps); mp.mp.dps = 40
o = make_obj('zeta')
t0 = time.time()
T = lag_table(o, '0.5', '0.5', 6, dps, log=print)
zs = [mp.im(mp.zetazero(k)) for k in range(1, 12)]
v = mp.mpf(2)*mp.mpf('0.25')**2; c0 = 2*mp.pi*mp.mpf('0.25')**2
for j in range(6):
    d = mp.mpf('0.5')*j
    Z = sum(2*c0*mp.exp(-v*g*g/2)*mp.cos(g*d) for g in zs)
    mz = T['mZ'][j]
    print(j, 'zero side', mp.nstr(Z, 22), ' prime side', (-mz).str(25), ' contains:', (-mz).contains(arb(mp.nstr(Z, 35))) or abs(float((-mz).mid()) - float(Z)) < 1e-25)
print('time', time.time()-t0)
# sibling T2: h=0.03, r=0.75, K(0) = -0.03807 for zeta; DH K(0) = -0.1038
T = lag_table(o, '0.03', '0.75', 8, 40, log=print)
print('zeta I(0)', T['I'][0].str(12), 'I(1)', T['I'][1].str(12))
p = levinson_pivots(T['mZ']); print('levinson', [x.str(8) for x in p])
M = [[T['mZ'][abs(i-j)] for j in range(8)] for i in range(8)]
p = ldl_pivots(M); print('ldl     ', [x.str(8) for x in p])
o = make_obj('DH')
T = lag_table(o, '0.03', '0.75', 8, 40, log=print)
print('DH I(0)', T['I'][0].str(12))
o = make_obj('EA_0.2')
T = lag_table(o, '0.5', '0.5', 4, 30, log=print)
a = mp.mpf('0.2')
for j in range(4):
    d = mp.mpf('0.5')*j; Z = 0
    for g in zs:
        for sg in (1, -1):
            for sa in (1, -1):
                t = sg*g + sa*1j*a
                Z += c0*mp.exp(-v*t*t/2)*mp.exp(1j*t*d)
    print('EA', j, mp.nstr(Z.real, 20), (-T['mZ'][j]).str(22))
