"""(i) functional equation at complex s; (ii) Euler-side check of the exceptional zero: Psi_chi(x) against x^{s0}/s0;
(iii) zeros on Re s = 1/2 (Hardy-type real function) for one RH-false and one RH-true character."""
import sys, time, json, math, cmath
import numpy as np, mpmath as mp
sys.path.insert(0, 'tmp/research-2026-11-16/push/e1-selberg-twist-control')
from sel import *
out = {}; t0 = time.time()
def alphas(a, b): return [x % 1.0 for x in (a, b, a - b)]
def tanint(w):
    w = mp.mpmathify(w)
    return complex(mp.quad(lambda u: (u * w) * mp.tan(mp.pi * u * w) * w, [0, 0.25, 0.5, 0.75, 1]))
def kappa(a, b): return 2 * sum(math.log(2 * math.sin(math.pi * x)) for x in alphas(a, b))
def Psi_fe(s, a, b):
    w = complex(s) - 0.5
    return cmath.exp(2 * math.pi * tanint(w) + kappa(a, b) * w)
fe = []
for (a, b) in [(0.03, 0.05), (0.10, 0.25), (0.01, 0.02)]:
    for s in [0.7, complex(0.7, 1.0), complex(0.8, 3.0), complex(0.55, 6.0), complex(0.95, 0.4)]:
        r = Ztw(s, a, b, K=36) / Ztw(1 - s, a, b, K=36)
        e = abs(r / Psi_fe(s, a, b) - 1)
        fe.append({'a': a, 'b': b, 's': str(s), 'relerr': e}); print('FE', a, b, s, e, round(time.time() - t0, 1), flush=True)
out['fe'] = fe

# (ii) Euler side
def psi_table(a, b, tmax, xs):
    X = np.linalg.inv(rho(T, a, b)); Y = np.linalg.inv(rho(L, a, b))
    thx, Vx, Vxi = eig_unitary(X); thy, Vy, Vyi = eig_unitary(Y)
    powm = lambda th, V, Vi, n: (V * np.exp(2j * math.pi * th * n)) @ Vi
    px = {}; py = {}; ev = []
    stack = [((1, 0, 0, 1), np.eye(6, dtype=complex), 0)]
    while stack:
        (p, q, r, t), W, k = stack.pop()
        n = 1
        while True:
            p1, q1, r1, t1 = p, q + n * p, r, t + n * r
            m = 1; ok = False
            while True:
                p2, q2, r2, t2 = p1 + m * q1, q1, r1 + m * t1, t1
                tr = p2 + t2
                if tr > tmax: break
                ok = True
                if n not in px: px[n] = powm(thx, Vx, Vxi, n)
                if m not in py: py[m] = powm(thy, Vy, Vyi, m)
                W2 = W @ px[n] @ py[m]
                N = ((tr + math.sqrt(tr * tr - 4)) / 2) ** 2
                ev.append((N, math.log(N) / (k + 1) * np.trace(W2).real, math.log(N) / (k + 1) * 6))
                stack.append(((p2, q2, r2, t2), W2, k + 1)); m += 1
            if not ok: break
            n += 1
    ev.sort()
    Ns = np.array([e[0] for e in ev]); c1 = np.cumsum([e[1] for e in ev]); c0 = np.cumsum([e[2] for e in ev])
    res = []
    for x in xs:
        i = np.searchsorted(Ns, x, side='right') - 1
        res.append((x, float(c1[i]), float(c0[i])))
    return res, len(ev)
tmax = 1000; xs = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 9.9e5]
ps = []
for (a, b, s0) in [(0.01, 0.02, 0.9503290738922601), (0.03, 0.05, 0.8398960900348281), (0.10, 0.25, None), (1/3, 2/3, None)]:
    res, cnt = psi_table(a, b, tmax, xs)
    for (x, c1, c0) in res:
        row = {'a': a, 'b': b, 'x': x, 'Psi_chi': c1, 'Psi_chi_over_sqrt_x': c1 / math.sqrt(x), 'Psi_regular_rep_over_6x': c0 / (6 * x)}
        if s0: row['Psi_chi_over_x^s0/s0'] = c1 / (x ** s0 / s0); row['Psi_chi_over_x'] = c1 / x
        ps.append(row); print('PSI', json.dumps(row), flush=True)
    print('words', cnt, round(time.time() - t0, 1), flush=True)
out['psi'] = ps

# (iii) zeros on the line: Z(1/2+it) Psi(1/2+it)^(-1/2) is real
line = []
for (a, b) in [(0.03, 0.05), (0.10, 0.25)]:
    prev = None; zs = []; ph_prev = None; vals = []
    for i in range(1, 91):
        t = 0.1 * i
        z = Ztw(complex(0.5, t), a, b, K=30)
        Ps = Psi_fe(complex(0.5, t), a, b)   # |Psi| = 1 on the line
        vals.append((t, abs(abs(Ps) - 1), z))
    # continuous square root of Psi along the line
    ang = np.unwrap([cmath.phase(Psi_fe(complex(0.5, v[0]), a, b)) for v in vals])
    H = [ (v[2] * cmath.exp(-0.5j * ang[i])) for i, v in enumerate(vals)]
    imax = max(abs(h.imag) / (abs(h) + 1e-300) for h in H)
    sc = [vals[i][0] for i in range(1, len(H)) if H[i].real * H[i - 1].real < 0]
    line.append({'a': a, 'b': b, 'max_|Psi|-1': max(v[1] for v in vals), 'max_rel_imag_of_H': imax, 'sign_changes_t': sc,
                 'weyl_N(9)': 2 * math.pi / (4 * math.pi) * 81})
    print('LINE', json.dumps(line[-1]), round(time.time() - t0, 1), flush=True)
out['line'] = line
json.dump(out, open('tmp/research-2026-11-16/push/e1-selberg-twist-control/t2_fe_psi.json', 'w'), indent=1, default=str)
