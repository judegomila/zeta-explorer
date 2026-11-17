# argument-principle count of DH zeros in the box 0.1 < Re z < 3, y0 < Im z < y1  (z = s - 1/2)
import sys, mpmath as mp
from common import *
setup(15)
y0 = mp.mpf(sys.argv[1]); y1 = mp.mpf(sys.argv[2]); eps = mp.mpf('0.1'); X = mp.mpf(3)
_, L = get('DH')
seg = lambda a,b,n: mp.quad(lambda t: L(a+(b-a)*t)*(b-a), mp.linspace(0,1,n+1))
n = int(y1-y0)
tot = seg(mp.mpc(eps,y0), mp.mpc(X,y0), 3) + seg(mp.mpc(X,y0), mp.mpc(X,y1), n) + seg(mp.mpc(X,y1), mp.mpc(eps,y1), 3) + seg(mp.mpc(eps,y1), mp.mpc(eps,y0), 2*n)
print(sys.argv[1], sys.argv[2], mp.nstr(tot/(2j*mp.pi), 8), flush=True)
