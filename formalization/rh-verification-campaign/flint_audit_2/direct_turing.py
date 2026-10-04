# Direct-integral Turing certification of N(T1), N(T2) bracketing the window, using ONLY:
#  (i) Trudgian 2011 Thm 2.2: |int_{t1}^{t2} S| <= 2.067 + 0.059 log t2 (t2 > t1 > 168 pi),
#  (ii) S(t) = N(t) - 1 - theta(t)/pi, theta convex (theta'' = -(1/4) Im psi'(1/4+it/2) > 0),
#  (iii) parity: sign Z(T) = (-1)^{N(T)-1}  (Z sign from acb_dirichlet_hardy_z, RS path, independent of the Platt grid),
#  (iv) the dumped isolating intervals (each holds >= 1 zero; certified sign change by the Platt grid).
# No use of FLINT's Gram-block criterion (turing_method_bound / Lehman-Brent Thm 2.1 / Trudgian Cor 2.3).
import sys, subprocess
from fractions import Fraction as Fr
from flint import arb, acb, ctx
ctx.prec = 256
def load(prefix):
    iv = {}
    for line in open(prefix + '.iv.txt'):
        idx, ch, ma, ea, mb, eb = line.split()
        iv[int(idx)] = (Fr(int(ma)) * Fr(2) ** int(ea), Fr(int(mb)) * Fr(2) ** int(eb))
    return iv
def A(q): return arb(q.numerator) / arb(q.denominator)
LOGPI = arb.pi().log()
def theta(t): return acb(arb(1)/4, t/2).lgamma().imag - t/2*LOGPI
def int_theta(x, y, M):            # convexity: midpoint sum <= int <= trapezoid sum
    w = (y - x) / M; lo = arb(0); hi = arb(0); prev = theta(x)
    for j in range(M):
        a = x + j*w; b = a + w
        lo += w*theta(a + w/2); th_b = theta(b); hi += w*(prev + th_b)/2; prev = th_b
    return lo, hi
def bound(t2): return arb('2.067') + arb('0.059')*t2.log()
def zsign(T):
    num, den = T.numerator, T.denominator
    e = den.bit_length() - 1; assert den == 1 << e
    out = subprocess.run(['./zsign', '192'], input=f"x {num} {-e}\n", capture_output=True, text=True).stdout.split()
    return int(out[1]), out[2]
def certify(iv, c, T, H, M=400):
    """claim N(T) = c. Returns (upper-test margin, lower-test margin) for hypotheses N(T)>=c+2 resp. N(T)<=c-2
       (and c+1 / c-1 without parity)."""
    Tq = T; T = A(Tq); Hq = Fr(H); Ha = A(Hq)
    # upper side: zeros i >= c+1 with b_i <= T+H, worst case each zero at b_i
    stepU = sum((Tq + Hq - max(iv[i][1], Tq)) for i in iv if i >= c+1 and iv[i][1] <= Tq + Hq)
    assert all(iv[i][0] >= Tq for i in iv if i >= c+1)
    lo_th, hi_th = int_theta(T, T + Ha, M)
    out = {}
    for extra in (2, 1):
        # int S >= (c+extra-1)*H + stepU - hi_th/pi
        U = (arb(c + extra - 1))*Ha + A(stepU) - hi_th/arb.pi()
        out['up+%d' % extra] = (U - bound(T + Ha)).lower()
    # lower side: zeros i <= c with a_i > T-H; N(t) <= (c-extra) - #{i<=c: a_i > t}
    stepL = sum((min(iv[i][0], Tq) - (Tq - Hq)) for i in iv if i <= c and iv[i][0] > Tq - Hq)
    assert all(iv[i][1] <= Tq for i in iv if i <= c)
    lo_th2, hi_th2 = int_theta(T - Ha, T, M)
    for extra in (2, 1):
        W = arb(c - extra - 1)*Ha - A(stepL) - lo_th2/arb.pi()
        out['low-%d' % extra] = (-bound(T) - W).lower()
    return out
if __name__ == '__main__':
    prefix = sys.argv[1]
    iv = load(prefix)
    xL2 = Fr('15600000002223.2344') / 2; xR2 = Fr('15600000009475.44') / 2
    c1 = max(i for i in iv if iv[i][1] <= xL2)            # last zero entirely below x_L/2
    T1 = iv[c1][1]
    c2 = max(i for i in iv if iv[i][0] < xR2)             # last zero whose interval starts below x_R/2
    T2 = iv[c2][1]
    assert T1 <= xL2 and T2 >= xR2
    print(f"data {prefix}: indices {min(iv)}..{max(iv)}")
    for (c, T, nm) in [(c1, T1, 'T1'), (c2, T2, 'T2')]:
        s, zval = zsign(T)
        par_ok = (s == (1 if (c - 1) % 2 == 0 else -1))
        print(f"{nm} = {float(T):.10f}  claimed N({nm}) = {c}  sign Z({nm}) = {s:+d} (Z = {zval})  parity (-1)^(N-1) consistent: {par_ok}")
        for H in (5, 10, 20, 40, 80):
            m = certify(iv, c, T, H)
            print(f"   H={H:3d}: margins  [refute N>=c+2] {m['up+2'].str(6,radius=False):>10s}  [refute N<=c-2] {m['low-2'].str(6,radius=False):>10s}"
                  f"   (no parity: [N>=c+1] {m['up+1'].str(6,radius=False):>10s}  [N<=c-1] {m['low-1'].str(6,radius=False):>10s})")
