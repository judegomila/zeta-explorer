"""c12-x04-oval-hecke-fricke-loading: numerical checks. mpmath 30 digits (+ python-flint via h-klein-fricke/epstein.py).
Arc convention: tau = i x/2, theta(tau) = sum_n e(n^2 tau) = sum_n exp(-pi n^2 x).  Planned memory: < 200 MB (no arrays)."""
import sys, os, json, math
import mpmath as mp
mp.mp.dps = 30
pi = mp.pi
def e(t): return mp.exp(2j * pi * t)
out = {}

def th(x, num=0, den=1):
    """sum_n e(num n^2/den) exp(-pi n^2 x), x > 0 (direct sum)."""
    N = int(mp.sqrt(mp.mp.dps * 2.4 / (pi * x))) + 3
    ph = [e(mp.mpf(num * r * r % den) / den) for r in range(den)]
    s = mp.mpc(1)
    for n in range(1, N + 1):
        s += 2 * ph[n % den] * mp.exp(-pi * n * n * x)
    return s
def theta(x): return th(x).real
def leg(a, p):
    a %= p
    if a == 0: return 0
    return 1 if pow(a, (p - 1) // 2, p) == 1 else -1

# ---- A. T_{p^2} on theta restricted to the arc: real points, complex points
A = []
for p in (3, 5, 7):
    for x in (mp.mpf('0.05'), mp.mpf('0.37'), mp.mpf('1.3')):
        # U_{p^2}: points (tau+b)/p^2 -> x/p^2 with phase e(b n^2/p^2)
        pts = [th(x / p**2, b, p * p) for b in range(p * p)]
        U = sum(pts) / p**2
        G = sum(leg(b, p) * e(mp.mpf(b) / p) for b in range(p))
        mid_pts = [th(x, b, p) for b in range(p)]
        mid = sum(leg(b, p) * mid_pts[b] for b in range(p)) / G
        V = theta(p * p * x)
        T = U + mid / p + V / p
        real_part = pts[0] / p**2 + V / p                       # the two points on the arc
        cplx_part = sum(pts[1:]) / p**2 + mid / p               # p^2-1 and p-1 points off the real locus
        pred_cplx = theta(x) - theta(x / p**2) / p**2 + (theta(x) - V) / p
        A.append(dict(p=p, x=float(x),
                      U_minus_theta=float(abs(U - theta(x))),
                      twist_minus=float(abs(mid - (theta(x) - V))),
                      T_minus_eig=float(abs(T - (1 + mp.mpf(1) / p) * theta(x))),
                      cplx_minus_dilates=float(abs(cplx_part - pred_cplx)),
                      max_imag_single_pt=float(max(abs(z.imag) for z in pts[1:])),
                      real_part=float(real_part.real), cplx_part=float(cplx_part.real)))
out['A_Tp2_on_arc'] = A

# Mellin: int_0^inf (theta(lam x)-1)/2 x^{s/2} dx/x = lam^{-s/2} Lambda(s), Re s > 1
def Lam(s): return pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
def psi(x):
    return (theta(x) - 1) / 2 if x >= 1 else (theta(1 / x) / mp.sqrt(x) - 1) / 2
s0 = mp.mpc('2.3', '1.1'); lam = 9
mp.mp.dps = 20
I = mp.quad(lambda x: psi(lam * x) * x ** (s0 / 2 - 1), [0, mp.mpf(1) / lam / 4, mp.mpf(1) / lam, 1, 4, mp.inf])
mp.mp.dps = 30
out['A_mellin_dilation'] = dict(s=str(s0), lam=lam, relerr=float(abs(I / (lam ** (-s0 / 2) * Lam(s0)) - 1)))
# multipliers on the line
M = []
for p in (2, 3, 5, 7, 101):
    cmin = 1 + 1 / p - 2 * p ** -1.5
    off = math.acosh((p ** 1.5 + p ** 0.5) / 2) / math.log(p)
    M.append(dict(p=p, C_min_on_line=cmin, C_zero_Re_s=[0.5 + off, 0.5 - off]))
out['A_multipliers'] = M

# ---- B. p = 2, U_2, U_4, w_4 on the arc
B = []
for x in (mp.mpf('0.37'), mp.mpf('1.3')):
    th4 = th(x / 2, 1, 2).real            # theta((tau+1)/2): the point on the arc Re tau = 1/2
    U2 = (theta(x / 2) + th4) / 2
    U4 = sum(th(x / 4, b, 4) for b in range(4)) / 4
    W = lambda f, x: f(1 / x) / mp.sqrt(x)
    comm = W(lambda y: theta(2 * y), x) - theta(2 * x)       # (W D_2 - D_2 W) theta
    B.append(dict(x=float(x), theta4_minus=float(abs(th4 - (2 * theta(2 * x) - theta(x / 2)))),
                  U2_minus_V2=float(abs(U2 - theta(2 * x))), U4_minus_theta=float(abs(U4 - theta(x))),
                  W_theta_minus_theta=float(abs(W(theta, x) - theta(x))),
                  commutator_on_theta=float(comm),
                  commutator_pred=float(theta(x / 2) / mp.sqrt(2) - theta(2 * x))))
out['B_p2'] = B

# ---- C. one complex isogenous point: theta(tau + b/p)
C = {}
s = mp.mpc('2.3', '1.1'); p = 5
chi5 = [0, 1, -1, -1, 1]
L5 = lambda s: mp.dirichlet(s, chi5)
rows = []
for b in (1, 2):
    direct = mp.mpf(5) ** (-s) * sum(e(mp.mpf(b * r * r % 5) / 5) * mp.zeta(s, mp.mpf(r) / 5) for r in range(1, 6))
    c, sn = mp.cos(2 * pi * b / 5), mp.sin(2 * pi * b / 5)
    form = (mp.mpf(5) ** (-s) + c * (1 - mp.mpf(5) ** (-s))) * mp.zeta(s) + 1j * sn * L5(s)
    rows.append(dict(b=b, diff=float(abs(direct - form)),
                     re_theta_x1e_4=float(th(mp.mpf('1e-4'), b, 5).real), pred=float(leg(b, 5) / mp.sqrt(5) * 100)))
C['p5_dirichlet_identity'] = rows
c = mp.cos(2 * pi / 5)
C['p5_b1_real_part_local_zero_Re_s'] = float(-mp.log(c / (1 - c)) / mp.log(5))
def f1(s):
    c, sn = mp.cos(2 * pi / 5), mp.sin(2 * pi / 5)
    return (mp.mpf(5) ** (-s) + c * (1 - mp.mpf(5) ** (-s))) * mp.zeta(s) + 1j * sn * L5(s)
mp.mp.dps = 15
best = []
for it in range(20, 800):
    t = it * 0.05
    for isg in range(0, 12):
        sg = 0.3 + isg * 0.07
        best.append((abs(f1(mp.mpc(sg, t))), sg, t))
best.sort()
mp.mp.dps = 30
zs = []
for v, sg, t in best[:40]:
    try:
        z = mp.findroot(f1, mp.mpc(sg, t))
        if abs(f1(z)) < 1e-20 and 0 < z.real < 1 and all(abs(z - w) > 1e-6 for w in zs):
            zs.append(z)
    except Exception:
        pass
C['p5_b1_zeros_found'] = [dict(re=mp.nstr(z.real, 12), im=mp.nstr(z.imag, 12), res=float(abs(f1(z)))) for z in sorted(zs, key=lambda z: z.imag)[:8]]
tri = []
x = mp.mpf('1e-5')
for p in (3, 5, 7, 11, 13):
    pts = [th(x, b, p) for b in range(1, p)]
    tri.append(dict(p=p, sum_abs=float(sum(abs(z) for z in pts)), abs_sum=float(abs(sum(pts))),
                    exact=float(p * theta(p * p * x) - theta(x))))
C['triangle_loss_x1e-5'] = tri
out['C_single_complex_point'] = C

# ---- D. second moment over the complex points = sublattices of Z^2
D = []
def th2(form, x, R=40):
    a, b, c = form; s = mp.mpf(0)
    for m in range(-R, R + 1):
        for n in range(-R, R + 1):
            q = a * m * m + b * m * n + c * n * n
            if q * x < 40: s += mp.exp(-pi * q * x)
    return s
for p in (3, 5):
    x = mp.mpf('0.3')
    lhs = sum(abs(th(x, b, p)) ** 2 for b in range(p)) / p
    R = 30; Lp = mp.mpf(0); Lm = mp.mpf(0)
    for m in range(-R, R + 1):
        for n in range(-R, R + 1):
            w = mp.exp(-pi * (m * m + n * n) * x)
            if (n - m) % p == 0: Lp += w
            if (n + m) % p == 0: Lm += w
    rhs = Lp + Lm - theta(p * p * x) ** 2
    D.append(dict(p=p, second_moment_minus_lattices=float(abs(lhs - rhs)),
                  Lplus_minus_form=float(abs(Lp - th2((2, 2, (p * p + 1) // 2), x))), form=[2, 2, (p * p + 1) // 2]))
out['D_second_moment'] = D

# ---- E. Epstein controls: T_p on Theta_Q along the arc
def ThQ(form, x, num=0, den=1, R=None):
    a, b, c = form
    R = R or int(mp.sqrt(34 / (pi * x * min(a, c - b * b / (4.0 * a))))) + 4
    s = mp.mpc(0)
    for m in range(-R, R + 1):
        for n in range(-R, R + 1):
            q = a * m * m + b * m * n + c * n * n
            s += e(mp.mpf(num * q % den) / den) * mp.exp(-pi * q * x)
    return s
E = []
for (Q0, Q1, p, label) in (((1, 0, 5), (2, 2, 3), 3, 'n=5 h=2'), ((1, 0, 6), (2, 0, 3), 5, 'n=6 h=2'),
                           ((1, 0, 1), (1, 0, 1), 5, 'n=1 h=1'), ((1, 0, 7), (1, 0, 7), 11, 'n=7 h=1'),
                           ((1, 0, 5), (1, 0, 5), 29, 'n=5, p=29 principal')):
    x = mp.mpf('0.6')
    pts = [ThQ(Q0, x / p, b, p) for b in range(p)]
    T = sum(pts) / p + ThQ(Q0, p * x).real
    E.append(dict(case=label, p=p, T_minus_2ThetaQ1=float(abs(T - 2 * ThQ(Q1, x).real)),
                  T_minus_2ThetaQ0=float(abs(T - 2 * ThQ(Q0, x).real)),
                  positive=bool(ThQ(Q0, x).real > 0),
                  fricke=float(abs(ThQ(Q0, 1 / (Q0[2] * x)).real - mp.sqrt(Q0[2]) * x * ThQ(Q0, x).real))))
out['E_epstein_hecke'] = E

# DH coefficients: c(pn) = lam c(n)?
xi = (mp.sqrt(10 - 2 * mp.sqrt(5)) - 2) / (mp.sqrt(5) - 1)
a5 = [0, 1, xi, -xi, -1]
dh = []
for p in (2, 3, 7, 11, 19):
    ratios = [a5[(p * n) % 5] / a5[n] for n in (1, 2, 3, 4)]
    dh.append(dict(p=p, ratios=[float(r) for r in ratios], eigen=bool(max(ratios) - min(ratios) < 1e-20)))
out['E_DH_coeff'] = dh

# ---- F. E_a and Epstein zeros via the flint Chowla-Selberg code of h-klein-fricke
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'h-klein-fricke'))
from epstein import Estar
from flint import acb
def Em(x, y, s):
    v = Estar(float(x), float(y), acb(float(s.real), float(s.imag)))
    return mp.mpc(float(v.real.mid()), float(v.imag.mid()))
F = {}
w = mp.mpc(0.7); p = 3; y = 1.3
lhs = (sum(Em(b / p, y / p, w) for b in range(p)) + Em(0, p * y, w)) / mp.sqrt(p)
rhs = (p ** (w - 0.5) + p ** (0.5 - w)) * Em(0, y, w)
F['Ea_hecke_relerr'] = float(abs(lhs / rhs - 1))
F['Ea_fricke'] = float(abs(Em(0, 1 / y, w) - Em(0, y, w)))
def offzero(x, y, guess):
    g = lambda s: Em(x, y, s) * mp.exp(pi * s.imag / 2)
    mp.mp.dps = 15
    z = mp.findroot(g, guess, tol=1e-10, solver='muller')
    r = abs(g(z)); mp.mp.dps = 30
    return dict(re=float(z.real), im=float(z.imag), res=float(r), nearby=float(abs(g(z + 0.05))))
F['zero_n5'] = offzero(0, math.sqrt(5), mp.mpc(0.93297, 15.66825))
F['zero_n6'] = offzero(0, math.sqrt(6), mp.mpc(0.80375, 15.11758))
# form [2,2,5] (D=-36, the lattice L_+ for p=3): z = -1/2 + 3i/2 ; scan for an off-line zero
mp.mp.dps = 15
cand = []
for it in range(100, 800):
    t = it * 0.05
    for isg in range(1, 18):
        sg = 0.5 + isg * 0.06
        cand.append((abs(Em(-0.5, 1.5, mp.mpc(sg, t))) * math.exp(math.pi * t / 2), sg, t))
cand.sort()
found = []
for v, sg, t in cand[:25]:
    try:
        g = lambda s: Em(-0.5, 1.5, s) * mp.exp(pi * s.imag / 2)
        z = mp.findroot(g, mp.mpc(sg, t), tol=1e-10, solver='muller')
        if z.real > 0.52 and abs(g(z)) < 1e-8 and all(abs(z - u) > 1e-4 for u in found):
            found.append(z)
    except Exception:
        pass
mp.mp.dps = 30
F['zeros_form_2_2_5_offline'] = [dict(re=float(z.real), im=float(z.imag)) for z in sorted(found, key=lambda z: z.imag)[:6]]
out['F_Ea_and_zeros'] = F
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'checks.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
