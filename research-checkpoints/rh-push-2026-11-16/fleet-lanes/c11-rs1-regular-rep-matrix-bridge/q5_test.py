# q = 5 checks for lane c11-rs1-regular-rep-matrix-bridge. Planned memory: a few 14x14 mpf matrices (< 50 MB).
import sys, json
from mpmath import mp, mpf, mpc, zeta, gamma, pi, sqrt, exp, log, dirichlet, diff, matrix, eigsy, findroot, arg, re, im, tan, fabs
mp.dps = 70
out = {}
I = mpc(0, 1)
chiA = [0, 1, I, -I, -1]      # chi(2) = i, odd
chiB = [0, 1, -I, I, -1]      # conjugate
chi5 = [0, 1, -1, -1, 1]      # real even
q = 5

# 1. entries Z_c(s) = 5^-s zeta(s, c/5): sign at s = 2 and at real s < 1
ent = {}
for s in [mpf(2), mpf('1.05'), mpf('0.95'), mpf('0.5'), mpf('0.25')]:
    ent[str(s)] = [float(q**(-s) * zeta(s, mpf(c) / q)) for c in range(1, 5)]
out['entries_Z_c'] = ent

# 2. in-device control HUR: an off-line zero of the entry Z_1(s) = 5^-s zeta(s, 1/5)
mp.dps = 30
best = []
ts = [mpf(k) / 4 for k in range(4, 240)]
sg = [mpf(k) / 10 for k in range(2, 14)]
grid = {}
for a in sg:
    for t in ts:
        grid[(a, t)] = fabs(zeta(mpc(a, t), mpf(1) / 5))
cands = []
for i, a in enumerate(sg[1:-1], 1):
    for j, t in enumerate(ts[1:-1], 1):
        v = grid[(a, t)]
        if all(v <= grid[(sg[i + di], ts[j + dj])] for di in (-1, 0, 1) for dj in (-1, 0, 1)):
            cands.append((a, t))
zeros = []
for a, t in cands:
    try:
        z = findroot(lambda s: zeta(s, mpf(1) / 5), mpc(a, t))
        if 0 < z.real < 2 and fabs(z.real - mpf(1) / 2) > mpf('1e-6'):
            zeros.append((float(z.real), float(z.imag), float(fabs(zeta(z, mpf(1) / 5)))))
    except Exception as e:
        pass
zeros = sorted(set((round(a, 10), round(b, 10), c) for a, b, c in zeros))
out['hurwitz_1_5_zeros_off_line'] = zeros[:12]
mp.dps = 70

# 3. DH object
kap = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1)
def fDH(s, A=chiA, B=chiB):
    return ((1 - I * kap) * dirichlet(s, A) + (1 + I * kap) * dirichlet(s, B)) / 2
rho = mpc('0.8085171825', '85.6993484854')
vA = fabs(fDH(rho)); vB = fabs(fDH(rho, chiB, chiA))
out['DH_at_known_zero'] = {'chi(2)=i': float(vA), 'chi(2)=-i': float(vB)}
if vB < vA:
    chiA, chiB = chiB, chiA
rho = findroot(lambda s: fDH(s), rho)
out['DH_zero_refined'] = [mp.nstr(rho.real, 15), mp.nstr(rho.imag, 15), float(fabs(fDH(rho)))]
out['DH_nonvanishing'] = {'f(2)': mp.nstr(fDH(mpf(2)), 15), 'f(1/2+85i)': mp.nstr(fDH(mpc(0.5, 85)), 15)}
# DH as the row functional sum_c w_c Z_c
w = [None, mpf(1), kap, -kap, mpf(-1)]
s0 = mpc('1.3', '7.1')
rowform = sum(w[c] * q**(-s0) * zeta(s0, mpf(c) / q) for c in range(1, 5))
out['DH_rowform_minus_def'] = float(fabs(rowform - fDH(s0)))
out['DH_weights_w'] = [float(x) for x in w[1:]]

# 4. completed functions on the line, real-normalised
def xi_line(t):
    s = mpc(0.5, t)
    return (s * (s - 1) / 2 * pi**(-s / 2) * gamma(s / 2) * zeta(s))
def L5_line(t):
    s = mpc(0.5, t)
    return (q / pi)**(s / 2) * gamma(s / 2) * dirichlet(s, chi5)
def LamA(t):
    s = mpc(0.5, t)
    return (q / pi)**((s + 1) / 2) * gamma((s + 1) / 2) * dirichlet(s, chiA)
theta = arg(LamA(mpf(0)))
ph = exp(-I * theta)
out['odd_phase_theta'] = mp.nstr(theta, 15)
out['odd_realness_check'] = float(fabs(im(ph * LamA(mpf('33.3')))) / fabs(LamA(mpf('33.3'))))
fz = lambda t: re(xi_line(t))
f5 = lambda t: re(L5_line(t))
fA = lambda t: re(ph * LamA(t))
fB = lambda t: re(ph * LamA(-t))
def DHc(t):
    s = mpc(0.5, t)
    return (q / pi)**((s + 1) / 2) * gamma((s + 1) / 2) * fDH(s)
tt = mpf('40.7')
ratio = DHc(tt) / (fA(tt) + fB(tt))
ratio2 = DHc(mpf('71.3')) / (fA(mpf('71.3')) + fB(mpf('71.3')))
out['DH_equals_const_times_fA_plus_fB'] = [mp.nstr(ratio, 12), mp.nstr(ratio2, 12)]

alpha = mpf(1)
def jets(f, nodes):
    return [(f(t), diff(f, t, 1), diff(f, t, 2)) for t in nodes]
def K(ja, jb, nodes):
    # symmetrised Wronskian kernel: (fa(t)fb'(s) - fa'(t)fb(s) + fb(t)fa'(s) - fb'(t)fa(s)) / (2 (t - s))
    n = len(nodes); M = matrix(n, n)
    for i in range(n):
        for j in range(n):
            a0, a1, a2 = ja[i]; b0, b1, b2 = jb[i]
            if i == j:
                M[i, j] = (alpha / pi) * (a1 * b1 - (a0 * b2 + b0 * a2) / 2)
            else:
                c0, c1, _ = ja[j]; d0, d1, _ = jb[j]
                M[i, j] = (alpha / pi) * (a0 * d1 - a1 * d0 + b0 * c1 - b1 * c0) / (2 * (nodes[i] - nodes[j]))
    return M
def inertia(M):
    n = M.rows
    d = [sqrt(fabs(M[i, i])) if M[i, i] != 0 else mpf(1) for i in range(n)]
    N = matrix(n, n)
    for i in range(n):
        for j in range(n):
            N[i, j] = (M[i, j] + M[j, i]) / 2 / (d[i] * d[j])
    ev = eigsy(N, eigvals_only=True)
    ev = sorted([e for e in ev])
    tol = mpf(10)**(-45)
    return (sum(1 for e in ev if e > tol), sum(1 for e in ev if e < -tol), sum(1 for e in ev if fabs(e) <= tol)), [mp.nstr(e, 5) for e in ev[:2]] + [mp.nstr(ev[-1], 5)]

res = {}
for label, centre, half, n in [('DHzero_85.70', mpf('85.699348'), mpf(2), 10), ('DHzero_85.70_n6', mpf('85.699348'), mpf(1), 6),
                               ('low_20', mpf(20), mpf(8), 10), ('quiet_100', mpf(100), mpf(2), 10)]:
    nodes = [centre - half + (2 * half) * (mpf(k) + mpf('0.37')) / n for k in range(n)]
    Jz, J5, JA, JB = jets(fz, nodes), jets(f5, nodes), jets(fA, nodes), jets(fB, nodes)
    Cz, C5, CA, CB = K(Jz, Jz, nodes), K(J5, J5, nodes), K(JA, JA, nodes), K(JB, JB, nodes)
    X = 2 * K(JA, JB, nodes)                  # cross term: C[fA+fB] = CA + CB + X
    r = {}
    r['zeta'] = inertia(Cz); r['chi5'] = inertia(C5); r['chiA'] = inertia(CA); r['chiB'] = inertia(CB)
    r['V=e_A+e_B (in C[G])'] = inertia(CA + CB)
    r['V=vv^T (DH) = CA+CB+X'] = inertia(CA + CB + X)
    r['cross X alone'] = inertia(X)
    # scale of zeta kernel against chi5 kernel on the nodes (normalisation dependence of entry statements)
    r['diag ratio C5/Czeta (min,max)'] = [mp.nstr(min(C5[i, i] / Cz[i, i] for i in range(n)), 5), mp.nstr(max(C5[i, i] / Cz[i, i] for i in range(n)), 5)]
    r['cone v=delta_1: Czeta+C5'] = inertia(Cz + C5)
    r['entry c=2: Czeta-C5'] = inertia(Cz - C5)
    # same with the pole factor removed from xi (kernel scaled by |2/(s(s-1))|^2 at nodes is not a congruence of the sum; reported as a second normalisation)
    Dg = [2 / (mpf('0.25') + t * t) for t in nodes]
    Cz2 = matrix(n, n)
    for i in range(n):
        for j in range(n):
            Cz2[i, j] = Cz[i, j] * Dg[i] * Dg[j]
    r['entry c=2, xi rescaled by 2/(1/4+t^2): Cz2-C5'] = inertia(Cz2 - C5)
    res[label] = r
    print(label, json.dumps(r, default=str), flush=True)
out['kernels'] = res
json.dump(out, open(sys.argv[1], 'w'), indent=1, default=str)
print(json.dumps({k: v for k, v in out.items() if k != 'kernels'}, indent=1, default=str))
