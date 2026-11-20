# locate the DH zero near the outlier height of the main run (float64 Newton; MEASURED). Memory: 2 arrays of 1e7 (240 MB).
import numpy as np
N = 10**7
xi = (np.sqrt(10-2*np.sqrt(5.0))-2)/(np.sqrt(5.0)-1); per = np.array([0.0, 1.0, xi, -xi, -1.0])
n = np.arange(1, N); a = per[n % 5]; ln = np.log(n.astype(float)); nz = a != 0; a = a[nz]; ln = ln[nz]
def f(s):
    head = np.sum(a*np.exp(-s*ln)); tail = 0j
    for r in range(1, 5):
        x0 = float(N + r)
        tail += per[r]*(x0**(1-s)/(5*(s-1)) + 0.5*x0**(-s) + (5/12.0)*s*x0**(-s-1) - (125/720.0)*s*(s+1)*(s+2)*x0**(-s-3))
    return head + tail
s = complex(0.85, 1e3*10**(3*27/39))
print("start", s, abs(f(s)))
for k in range(12):
    h = 1e-5; fs = f(s); d = (f(s+h)-f(s-h))/(2*h); s = s - fs/d
    print(k, s, abs(f(s)))
