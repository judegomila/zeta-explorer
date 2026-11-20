# check (Bettin-Conrey): c0(h/k) = (2k/pi^2) * sum_{n>=1} d(n) sin(2 pi n hbar/k)/n, hbar = h^{-1} mod k  (value at s = 1 of the sine Estermann function)
# equivalently V(b,a) = -c0(bbar/a) = -(2a/pi^2) sum d(n) sin(2 pi n b/a)/n.   Smoothed (Cesaro) partial sums, N = 4e6.
import numpy as np, math
N=4_000_000
d=np.zeros(N+1,np.int32)
for i in range(1,N+1): d[i::i]+=1
n=np.arange(1,N+1)
def c0(h,k): return -sum(m/k/math.tan(math.pi*m*h/k) for m in range(1,k))
for (h,k) in [(3,7),(5,12),(2,9),(10,23),(1,5)]:
    hb=pow(h,-1,k); w=(1-n/N)          # Cesaro weight
    s=(2*k/math.pi**2)*float((w*d[1:]*np.sin(2*math.pi*((n*hb)%k)/k)/n).sum())
    print("h/k=%d/%d  c0 = %.6f   series = %.6f"%(h,k,c0(h,k),s))
