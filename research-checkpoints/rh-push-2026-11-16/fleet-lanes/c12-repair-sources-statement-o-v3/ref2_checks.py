# Second-referee checks for the control tables of three round-11 stage-A closures.
# Memory: scalars only (mpmath, 30 digits); largest list has < 200 entries.
from mpmath import mp, mpf, mpc, zeta, gamma, pi, log, acosh, exp, fabs, sqrt, sin, cos, sinh, cosh, arg, conj, re, im
import random, json
mp.dps = 30
I = mpc(0, 1)
out = {}

def chars(p):
    # all characters mod prime p via a primitive root
    g = next(g for g in range(2, p) if len({pow(g, k, p) for k in range(1, p)}) == p - 1)
    ind = {pow(g, k, p): k for k in range(p - 1)}
    return [[0] + [exp(2 * pi * I * j * ind[n] / (p - 1)) for n in range(1, p)] for j in range(p - 1)]

def L(s, ch, p):
    # Dirichlet L-function mod p through Hurwitz zeta (valid for all s != 1)
    return sum(ch[a] * zeta(s, mpf(a) / p) for a in range(1, p)) * mpf(p) ** (-s)

# (A) regular-rep lift of T-NR: zero of chi^-1(p0) p0^(s-1/2) + c + chi(p0) p0^(1/2-s)
res = []
for (q, p0, c) in [(7, 5, mpf('2.3')), (7, 3, mpf('2.2')), (5, 2, mpf('2.5')), (5, 2, mpf('2.1'))]:
    for ch in chars(q)[:3]:
        x = ch[p0 % q]
        th = acosh(c / 2)
        z = mpf(1) / 2 + th / log(p0) + I * (arg(x) - pi) / log(p0)
        val = conj(x) * mpf(p0) ** (z - mpf(1) / 2) + c + x * mpf(p0) ** (mpf(1) / 2 - z)
        res.append([q, p0, float(c), float(z.real), float(z.imag), float(fabs(val))])
out['A_tnr_lift_zero'] = res
out['A_strip_bound_c_max'] = {str(p0): float(sqrt(p0) + 1 / sqrt(mpf(p0))) for p0 in (2, 3, 5)}

# (B) E_a lift: functional equation with root number squared and degree-two gamma factor
def Lam(s, ch, p):
    k = 0 if fabs(ch[p - 1] - 1) < mpf(10) ** -20 else 1
    return (mpf(p) / pi) ** ((s + k) / 2) * gamma((s + k) / 2) * L(s, ch, p), k
def eps(ch, p):
    k = 0 if fabs(ch[p - 1] - 1) < mpf(10) ** -20 else 1
    tau = sum(ch[a] * exp(2 * pi * I * a / p) for a in range(1, p))
    return tau / (I ** k * sqrt(p))
res = []
for p in (7, 11):
    cs = chars(p)
    for j in (1, 2, 3):
        ch = cs[j]; chb = [conj(v) if v != 0 else 0 for v in ch]
        e = eps(ch, p)
        s = mpc('0.37', '2.9'); a = mpf('0.2')
        lhs = Lam(1 - s + a, chb, p)[0] * Lam(1 - s - a, chb, p)[0]
        rhs = e ** -2 * Lam(s + a, ch, p)[0] * Lam(s - a, ch, p)[0]
        one = Lam(1 - s, chb, p)[0] - e ** -1 * Lam(s, ch, p)[0]
        # realness and sign of eps^-1 Lam(1/2+a+it) Lam(1/2-a+it) on the axis
        t = mpf('4.3')
        ax = e ** -1 * Lam(mpf(1) / 2 + a + I * t, ch, p)[0] * Lam(mpf(1) / 2 - a + I * t, ch, p)[0]
        res.append([p, j, float(fabs(one)), float(fabs(lhs - rhs) / fabs(rhs)), float(ax.real), float(fabs(ax.imag))])
out['B_Ea_lift_FE [p, j, FE1 defect, FE(E_a) rel defect, axis value re, |im|]'] = res

# (C) twist-modulus: nine-term identity for the T-NR twin at s = 1/2 + it (algebra), all characters mod p
res = []
for (p, q0, c, s) in [(11, 2, mpf('2.1'), mpc('0.5', '3.0')), (13, 3, mpf('2.2'), mpc('0.5', '7.7')), (11, 2, mpf('2.1'), mpc('0.8', '1.3'))]:
    cs = chars(p)
    Ls = [L(s, ch, p) if j else zeta(s) * (1 - mpf(p) ** (-s)) for j, ch in enumerate(cs)]
    u = [mpf(1), c * mpf(q0) ** (mpf(1) / 2 - s), mpf(q0) ** (1 - 2 * s)]
    qinv = pow(q0, -1, p)
    def M(h):
        return sum(fabs(Ls[j]) ** 2 * cs[j][h % p] for j in range(p - 1))
    worst = mpf(0); big = mpf(0)
    for h in range(1, p):
        lhs = sum(fabs(Ls[j] * (u[0] + u[1] * cs[j][q0] + u[2] * cs[j][q0] ** 2)) ** 2 * cs[j][h] for j in range(p - 1))
        rhs = mpc(0)
        for i in range(3):
            for k in range(3):
                d = i - k
                tw = h * (pow(q0, d, p) if d >= 0 else pow(qinv, -d, p))
                rhs += u[i] * conj(u[k]) * M(tw)
        worst = max(worst, fabs(lhs - rhs)); big = max(big, fabs(lhs))
    th = acosh(c / 2) / log(q0)
    res.append([p, q0, float(c), str(s), float(worst), float(big), float(mpf(1) / 2 + th)])
out['C_nine_term [p, q0, c, s, max defect, max value, Re zero of twin]'] = res

# (D) de Branges family: zeta fails (P) at 1 + 282i (Conrey-Li (3.4)); LAT passes (P) and (N2)
def xi(s):
    return s * (s - 1) / 2 * pi ** (-s / 2) * gamma(s / 2) * zeta(s)
s = mpc(1, 282)
out['D_zeta_P_at_1+282i'] = float((xi(s) / xi(s + 1)).real)
random.seed(12)
mn = mpf(10)
for _ in range(4000):
    Lp = mpf(random.uniform(0.05, 6)); u = mpc(random.uniform(-10, 10), 10 ** random.uniform(-6, 1))
    mn = min(mn, (sin(u) / sin(u + I * Lp)).real)
out['D_LAT_min_Re_sin(u)/sin(u+iL)'] = float(mn)
Lp = mpf('1.7'); n = 5
out['D_LAT_N2 xi\'(rho)/xi(rho+1) = i E\'(w)/E(w+i) and L/sinh L'] = [complex(I * Lp * cos(n * pi) / sin(n * pi + I * Lp)).__repr__(), float(Lp / sinh(Lp))]
print(json.dumps(out, indent=1))
json.dump(out, open(__file__.replace('.py', '.json'), 'w'), indent=1)
