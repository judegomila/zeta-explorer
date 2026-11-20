# vertical-statistics checks (pure python, exact rationals where possible)
from fractions import Fraction as F
import math
th = F(7,8); kap = F(13,84)

print("C1  Jensen constant C(theta) = min_x [a(x-1) + kap*(2-x)_+]/ln x,  a = theta-1/2")
for t in [F(7,8), F(4,5), F(3,4), F(3,5), F(11,20)]:
    a = float(t) - 0.5
    best = min(((a*(x-1) + float(kap)*max(0.0, 2-x))/math.log(x), x)
               for x in [1 + i/10000 for i in range(1, 40001)])
    print(f"  theta={float(t):.4f}  C={best[0]:.6f} at x={best[1]:.4f}   a/ln2={a/math.log(2):.6f}")
print("  threshold theta for C < 0.1038:", 0.5 + 0.1038*math.log(2))

print("C2  Ivic Thm 8.4 moment table m(sigma) (recalled) and 1/m convexity through (theta,0)")
def m_ivic(s):
    s = float(s)
    if s <= 5/8: return 4/(3-4*s)
    if s <= 35/54: return 10/(5-6*s)
    if s <= 41/60: return 19/(6-6*s)
    if s <= 3/4: return 2112/(859-948*s)
    if s <= 5/6: return 12408/(4537-4890*s)
    if s <= 7/8: return 4324/(1031-1044*s)
    return 98/(31-32*s)
# best base point: maximise K(s0) = m(s0)*(theta-s0)
grid = [0.5 + i/100000 for i in range(0, 37500)]
K, s0 = max((m_ivic(s)*(0.875-s), s) for s in grid)
print(f"  max K = m(s0)(7/8-s0) = {K:.6f} at s0={s0:.5f};  35/54={35/54:.5f}, exact K(35/54) = {F(9)*(th-F(35,54))}")
Kx = F(49,24)
for s in [0.66, 0.70, 0.75, 0.80, 0.83, 0.86, 0.87]:
    print(f"  sigma={s:.2f}  m_ivic={m_ivic(s):8.3f}  m_ZF=K/(7/8-sigma)={float(Kx)/(0.875-s):8.3f}")

print("C3  Ingham-type density with contour alpha and m(alpha)-th moment: A = 2/[(2-2s) + f*(s-alpha)], f=2m/(m+2)")
def A_ing(s, al, m):
    f = 2*m/(m+2); d = (2-2*s) + f*(s-al)
    return 2/d if d <= 1 else 2.0   # eta>=1 needed
def known(s):
    # recalled: Ingham, Huxley, Guth-Maynard only (no other table entries used)
    c = [3/(2-s), 15/(3+5*s)]
    if s > 1/3: c.append(3/(3*s-1))
    return min(c)
for s in [0.60, 0.65, 0.70, 0.75, 0.78, 0.80, 0.85, 0.87]:
    cand = []
    for i in range(0, 2000):
        al = 0.5 + (s-0.5)*i/2000
        m = max(m_ivic(al), float(Kx)/(0.875-al) if al >= 35/54 else 0)
        cand.append((A_ing(s, al, m), al))
    b = min(cand)
    print(f"  sigma={s:.2f}  best A_ZF-Ingham={b[0]:.4f} at alpha={b[1]:.4f}   Ingham 3/(2-s)={3/(2-s):.4f}   min(Ingham,Huxley,GM) A={known(s):.4f}")
# monotonicity of D(alpha) = 2K(s-al)/(K+2(theta-al)) on the ZF branch: derivative sign = 2s - K' - 2theta with K'=K
print("  dD/dalpha sign on ZF branch = sign(2*sigma - 2*theta - K) < 0 for all sigma<theta: ", all(2*s-2*0.875-float(Kx) < 0 for s in [0.5+i/1000 for i in range(375)]))

print("C4  divisor problem exponents alpha_k: ZF bound 7/8 - 49/(24k) vs recalled tables")
def ak_ivic(k):
    if 4 <= k <= 8: return (3*k-4)/(4*k)
    if k == 9: return 35/54
    if k == 10: return 41/60
    if k == 11: return 7/10
    if 12 <= k <= 25: return (k-2)/(k+2)
    if 26 <= k <= 50: return (k-1)/(k+4)
    if 51 <= k <= 57: return (31*k-98)/(32*k)
    return (7*k-34)/(7*k)
for k in [9, 12, 16, 17, 20, 25, 30, 31, 32, 33, 35, 40, 50, 60, 100, 1000]:
    zf = 7/8 - 49/(24*k)
    print(f"  k={k:5d}  ZF={zf:.5f}  Ivic85={ak_ivic(k):.5f}  1-1.889k^(-2/3)={1-1.889*k**(-2/3):.5f}  BY k>=58: {(1-1.224*(k-2.36)**(-2/3)) if k>=58 else float('nan'):.5f}")

print("C5  mu(sigma) under ZF(7/8): kap*(theta-sigma)/(theta-1/2) vs convexity 2*kap*(1-sigma)")
for s in [F(5,8), F(3,4), F(4,5), F(5,6)]:
    print(f"  sigma={float(s):.4f}  ZF={(kap*(th-s)/(th-F(1,2)))}  conv={2*kap*(1-s)}")
