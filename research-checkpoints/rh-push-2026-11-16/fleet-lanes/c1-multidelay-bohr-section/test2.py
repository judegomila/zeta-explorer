# Check of the weighted first-moment formula (Theorem B) for a genuinely two-delay lossless PR function.
#   b(w1,w2) = (2 w1 w2 - w1 - w2)/(2 - w1 - w2)   rational inner on the bidisc
#   h(z) = (1 + e^{i phi} b)/(1 - e^{i phi} b),  w1 = 2^{-z}, w2 = 3^{-z};  PR on Re z > 0, Re h = 0 a.e. on Re z = 0
# poles i*gamma_j on the axis with residues r_j > 0.  Prediction:
#   sum_{T0 < gamma_j <= T} r_j zeta(1/2 + i gamma_j) = (T - T0)/(2 pi) * ( H(0) + conj(h(1/2)) ) + o(T),
# real part >= Re H(0) (T-T0)/(2 pi) > 0, so the poles cannot all be zeta zeros.
import mpmath as mp, math, cmath, json, sys
mp.mp.dps = 20
PHI = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
TMAX = float(sys.argv[2]) if len(sys.argv) > 2 else 3000.0
l2, l3 = math.log(2), math.log(3)
def b(w1, w2): return (2*w1*w2 - w1 - w2)/(2 - w1 - w2)
def h(z):
    u = cmath.exp(1j*PHI)*b(cmath.exp(-z*l2), cmath.exp(-z*l3)); return (1+u)/(1-u)
def u_t(t): return cmath.exp(1j*PHI)*b(cmath.exp(-1j*t*l2), cmath.exp(-1j*t*l3))
def g(t):   # imaginary part of log u, zero at poles (u = 1)
    return cmath.phase(u_t(t))
def dudz(t, e=1e-6):
    f = lambda z: cmath.exp(1j*PHI)*b(cmath.exp(-z*l2), cmath.exp(-z*l3))
    return (f(1j*t+e)-f(1j*t-e))/(2*e)
H0 = (1+0)/(1-0)   # b(0)=0
pred = H0 + h(0.5).conjugate()
T0 = 1.0; dt = 0.002
S = 0; R = 0; n = 0; t = T0; g0 = g(t); rows = []; marks = [100, 300, 1000, 2000, 3000, 6000, 10000]
maxmod_min = 1e9
while t < TMAX:
    t1 = t+dt; g1 = g(t1)
    if g0*g1 < 0 and abs(g0-g1) < 1.0:       # sign change of phase through 0 (not the branch cut)
        a, c, ga = t, t1, g0
        for _ in range(60):
            m = 0.5*(a+c); gm = g(m)
            if ga*gm <= 0: c = m
            else: a, ga = m, gm
        gam = 0.5*(a+c)
        r = (-2/dudz(gam)).real              # residue of (1+u)/(1-u) at u=1
        zv = complex(mp.zeta(mp.mpc(0.5, gam)))
        S += r*zv; R += r; n += 1
        maxmod_min = min(maxmod_min, abs(zv))
    t, g0 = t1, g1
    if marks and t >= marks[0]:
        m = marks.pop(0)
        rows.append({'T': m, 'poles': n, 'sum_r': R, 'pred_sum_r': (m-T0)*H0/math.pi,
                     'ratio': [ (S/((m-T0)/(2*math.pi))).real, (S/((m-T0)/(2*math.pi))).imag ],
                     'pred': [pred.real, pred.imag], 'min_abs_zeta_at_poles': maxmod_min})
        print(rows[-1]); sys.stdout.flush()
json.dump({'phi': PHI, 'rows': rows}, open('test2_phi%g.json' % PHI, 'w'), indent=1)
