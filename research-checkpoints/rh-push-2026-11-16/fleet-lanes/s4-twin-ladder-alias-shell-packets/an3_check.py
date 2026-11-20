"""check of the cap normalisation used in an3.py: corr of two clusters by direct quadrature against the closed form"""
import math, json
import numpy as np
from scipy.integrate import quad
mu = 0.2320723
def corr_quad(ua, aa, ub, ab):
    F = lambda x: sum(a * math.exp(-mu * abs(x - u)) for a, u in zip(aa, ua)); G = lambda x: sum(a * math.exp(-mu * abs(x - u)) for a, u in zip(ab, ub))
    pts = sorted(ua + ub); lo, hi = pts[0] - 200, pts[-1] + 200
    I = lambda f: quad(f, lo, hi, points=pts, limit=2000, epsabs=1e-13, epsrel=1e-13)[0]
    return I(lambda x: F(x) * G(x)) / math.sqrt(I(lambda x: F(x) ** 2) * I(lambda x: G(x) ** 2))
def corr_closed(ua, aa, ub, ab, U, V):
    al = np.array([U - u for u in ua]); be = np.array([u - V for u in ub]); a = np.array(aa); b = np.array(ab); D = V - U; s = al[:, None] + be[None, :]
    num = (a[:, None] * b[None, :] * np.exp(-mu * s) * (1 / mu + D + s)).sum(); da = np.abs(al[:, None] - al[None, :]); db = np.abs(be[:, None] - be[None, :])
    na = (a[:, None] * a[None, :] * (1 / mu + da) * np.exp(-mu * da)).sum(); nb = (b[:, None] * b[None, :] * (1 / mu + db) * np.exp(-mu * db)).sum()
    return num / (math.sqrt(na * nb) * (1 + mu * D))       # corr / cap
cap = lambda D: (1 + mu * D) * math.exp(-mu * D)
r1 = corr_closed([8.0], [1.0], [16.0], [1.0], 8, 16)                                   # packets at the edges: ratio 1
c2 = corr_quad([5.0, 7.0], [math.log(5), -math.log(7)], [17.0, 19.0], [math.log(17), math.log(19)])
r2 = corr_closed([5.0, 7.0], [math.log(5), -math.log(7)], [17.0, 19.0], [math.log(17), math.log(19)], 8, 16)
res = dict(edge_packets_ratio=r1, quad_over_cap=c2 / cap(8.0), closed_ratio=r2, diff=abs(c2 / cap(8.0) - r2))
print("V6", json.dumps(res))
json.dump(res, open("validate_cap.json", "w"))
