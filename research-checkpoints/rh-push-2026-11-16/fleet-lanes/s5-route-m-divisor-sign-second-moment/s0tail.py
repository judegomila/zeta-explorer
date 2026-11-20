# tail of s0 = (1/(4 pi)) int |zeta(1/2+it)|^4/(1/4+t^2)^2 dt beyond T = 400 (two-sided), up to T2
import sys
from mpmath import mp, mpf, zeta, quad, pi
mp.dps=15
T2=int(sys.argv[1]); f=lambda t: abs(zeta(mpf(1)/2+1j*t))**4/(mpf(1)/4+t*t)**2
acc=mpf(0)
for lo in range(400,T2,100):
    acc+=2*quad(f,[mpf(k) for k in range(lo,lo+101,2)],maxdegree=4)/(4*pi)
    print(lo+100,float(acc),flush=True)
