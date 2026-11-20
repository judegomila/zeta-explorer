import time
from quartet_lib import *
from lib import inertia
t0 = time.time()
H, bad = Hmat(q(1, 16), q(1, 4)+q(1, 16)+q(1), extra_test=[((q(3, 13), q(5, 17)), (q(7, 19), q(2, 23))), ((q(31, 13), q(1, 17)), (q(9, 19), q(40, 23)))])
print('time', time.time()-t0, 'fit failures', bad, 'symmetric', all(H[i, j] == H[j, i] for i in range(m) for j in range(m)), 'inertia', inertia(H))
cp = H.charpoly(); co = cp.coeffs(); print('charpoly low zero coeffs', next(i for i, x in enumerate(co) if x != 0), ' e6 =', co[m-6])
# degree probe of e6 along c and along E by finite differences on integer grids
from flint import fmpq_poly
def e6(E, c): 
    co = Hmat(E, c).charpoly().coeffs(); return co[m-6] if len(co) > m-6 else q(0)
t0 = time.time()
vals = [e6(q(1, 16), q(k)) for k in range(2, 60)]
d = vals; deg = 0
while any(x != 0 for x in d): d = [d[i+1]-d[i] for i in range(len(d)-1)]; deg += 1
print('degree in c of e6 at E = 1/16:', deg-1, 'time', time.time()-t0)
vals = [e6(q(k, 300), q(5)) for k in range(1, 45)]
d = vals; deg = 0
while any(x != 0 for x in d): d = [d[i+1]-d[i] for i in range(len(d)-1)]; deg += 1
print('degree in E of e6 at c = 5:', deg-1)
