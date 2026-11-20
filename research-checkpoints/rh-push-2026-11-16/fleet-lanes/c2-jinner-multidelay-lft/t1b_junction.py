# T1b: exact image-disc distance for the ladder, and the junction x -> +infinity with the gamma term only
import numpy as np, mpmath as mp, json
N = np.array([[-1, -1], [1, 1]], dtype=complex)
def M(Z): return np.eye(2, dtype=complex) + (Z/2)*N
def T(Th, e): return (Th[0, 0]*e + Th[0, 1])/(Th[1, 0]*e + Th[1, 1])
def disc(Th):   # image of unit circle: centre, radius via three points
    z = [T(Th, np.exp(2j*np.pi*k/3)) for k in range(3)]
    a, b, c = z; w = (c - a)/(b - a); cen = a + (b - a)*(w - abs(w)**2)/(2j*w.imag); return cen, abs(a - cen)
out = {'ladder_[phi,Re b,dist(-1,image disc)]': []}
for phi in [0.0, 0.01, 0.1, 1.0, 3.0]:
    for reb in [0.0, 0.01, 0.5]:
        Th0 = M(0.7 + 0.3j)@np.diag([np.exp(1j*phi), 1])@M(reb + 0.2j); cen, r = disc(Th0)
        out['ladder_[phi,Re b,dist(-1,image disc)]'].append([phi, reb, float(abs(-1 - cen) - r)])
mp.mp.dps = 40
Th0 = M(0.5)@np.diag([np.exp(1j*1.0), 1])@M(0.5)        # Theta(0) of the ladder M(.5 Z_2) U_1 M(.5 Z_3), Z_p(0)=1
lim = abs(T(np.linalg.inv(Th0), -1)); out['limit |T_{Theta0^-1}[-1]|'] = float(lim)
rows = []
for ex in [3, 10, 30, 100, 300, 1000, 3000]:
    x = mp.mpf(10)**ex; s = x + mp.mpf(0.5)
    L = 1/s + 1/(s - 1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2       # prime part < 2^{-x}; same leading term for DH
    S = complex((1 - L)/(1 + L)); rows.append([ex, float(L), S.real, float(abs(T(np.linalg.inv(Th0), S)))])
out['[log10 x, L(x) gamma part, S, |S1|] with Theta(x)=Theta0 (error < 2^-x)'] = rows
json.dump(out, open('t1b_junction.json', 'w'), indent=1)
for k, v in out.items(): print(k, v)
