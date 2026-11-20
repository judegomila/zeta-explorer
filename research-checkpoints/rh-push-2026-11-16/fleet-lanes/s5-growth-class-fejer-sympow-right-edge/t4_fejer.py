"""s5 combination 4: the Fejer-kernel (de la Vallee Poussin) inequality evaluated on each object at sigma > 1.
   I_P(sigma, t) = sum_{k=0}^{n} a_k Re( -F_k'/F_k (sigma + i k t) ),  P(theta) = sum a_k cos(k theta) >= 0.
   For zeta: I = sum_n Lambda(n) n^{-sigma} P(t log n) >= 0 (uses Lambda >= 0).  F_k = L(s, chi^k) for a character; F_k = F otherwise.
   Modes:
     ladder                          a_1/a_0, R_floor(n) = 1/(2 (1 - sqrt(a_0/a_1))^2), R_plain(n) = (A/2)/(sqrt a_1 - sqrt a_0)^2
     coef OBJ N                      Lambda_F(n), n <= N, from the Dirichlet coefficients: first negative, extreme ratios
     scan OBJ t0 t1 dt sigmas...     min over the grid of I_P/a_0 for the polynomials in POLYS (Arb values, MEASURED)
   Objects: ZETA, L4 (chi_-4), L5 (quadratic chi mod 5), L5C (order-4 character mod 5), EA (a = 1/4), TNR3 (q = 3, c = 2.2),
            TNRQ (q = 1000003, c = 2.2), DH, LIOU (zeta(2s)/zeta(s)), U (unimodular twist e(u_p), truncated Euler product, termwise)."""
import sys, os, json, math
from multiprocessing import Pool
from flint import acb, arb, ctx, acb_series

def fejer_riesz(n):
    c = [math.sin((j + 1) * math.pi / (n + 2)) for j in range(n + 1)]
    a = [sum(c[j] * c[j] for j in range(n + 1))] + [2 * sum(c[j] * c[j + k] for j in range(n + 1 - k)) for k in range(1, n + 1)]
    return a

POLYS = {'341': [3.0, 4.0, 1.0]}
for _n in (2, 4, 8, 16, 32, 64): POLYS['F%d' % _n] = fejer_riesz(_n)

def kappa_dh():
    return ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
def _pw(base, s): return (s * arb(base).log()).exp()

def hur(s, coefs, q):
    tot = 0
    for a, c in coefs:
        tot = tot + c * s.zeta(arb(a) / q)
    return tot * _pw(q, -s)

def F_of(name, k):
    """returns the function s -> F_k(s) (acb_series in, acb_series out)"""
    if name == 'ZETA': return lambda s: s.zeta()
    if name == 'L4':
        return (lambda s: hur(s, [(1, 1), (3, -1)], 4)) if k % 2 else (lambda s: s.zeta() * (1 - _pw(2, -s)))
    if name == 'L5':
        return (lambda s: hur(s, [(1, 1), (2, -1), (3, -1), (4, 1)], 5)) if k % 2 else (lambda s: s.zeta() * (1 - _pw(5, -s)))
    if name == 'L5C':
        i = acb(0, 1); vals = [1, i, -1, -i]      # chi(2) = i: chi(1), chi(2), chi(4), chi(3) = 1, i, -1, -i
        ch = {1: vals[0], 2: vals[k % 4], 4: vals[(2 * k) % 4], 3: vals[(3 * k) % 4]}
        if k % 4 == 0: return lambda s: s.zeta() * (1 - _pw(5, -s))
        return lambda s: hur(s, [(a, ch[a]) for a in (1, 2, 3, 4)], 5)
    if name == 'EA': return lambda s: (s + arb('0.25')).zeta() * (s - arb('0.25')).zeta()
    if name in ('TNR3', 'TNRQ'):
        q = 3 if name == 'TNR3' else 1000003
        return lambda s: s.zeta() * (1 + arb('2.2') * _pw(q, arb(1) / 2 - s) + _pw(q, 1 - 2 * s))
    if name == 'DH':
        kd = kappa_dh(); return lambda s: hur(s, [(1, 1), (2, kd), (3, -kd), (4, -1)], 5)
    if name == 'LIOU': return (lambda s: (2 * s).zeta() / s.zeta()) if k % 2 else (lambda s: s.zeta())
    raise KeyError(name)

def neg_logder(name, k, s):
    if name == 'ZETA' and abs(float(acb(s).imag.mid())) > 1e5:      # Riemann-Siegel values and a central difference (h = 2^-60)
        h = arb(2) ** -60; s = acb(s); f = s.zeta()
        return -((s + h).zeta() - (s - h).zeta()) / (2 * h) / f, f
    x = acb_series([acb(s), 1], prec=2)
    y = F_of(name, k)(x)
    return -y[1] / y[0], y[0]

def I_values(name, sigma, t, kmax):
    """list of Re(-F_k'/F_k)(sigma + i k t), k = 0..kmax (k = 0 on the real axis)"""
    out = []; amin = 1e300
    for k in range(kmax + 1):
        v, f = neg_logder(name, k, acb(arb(sigma), arb(t) * k))
        out.append(float(v.real.mid())); amin = min(amin, float(abs(f).mid()))
    return out, amin

def scan_point(args):
    name, sigma, t = args
    ctx.prec = 128 if t < 1e3 else 320
    vals, amin = I_values(name, sigma, t, 64)
    res = {}
    for pn, a in POLYS.items():
        res[pn] = sum(a[k] * vals[k] for k in range(len(a))) / a[0]
    return (sigma, t, res, vals[0], vals[1], amin)

def run_scan(name, tgrid, sigmas, out):
    jobs = [(name, s, t) for s in sigmas for t in tgrid]
    W = int(os.environ.get('RH_WORKERS', '4'))
    with Pool(W) as pool: rows = pool.map(scan_point, jobs, chunksize=max(1, len(jobs) // (8 * W)))
    summ = {}
    for s in sigmas:
        rs = [r for r in rows if r[0] == s]
        d = {}
        for pn in POLYS:
            vs = [(r[2][pn], r[1]) for r in rs]
            mn = min(vs); neg = [v for v in vs if v[0] < 0]
            d[pn] = {'min': mn[0], 'at_t': mn[1], 'n_negative': len(neg), 'first_negative_t': min((v[1] for v in neg), default=None)}
        summ[str(s)] = d
    json.dump({'object': name, 'sigmas': sigmas, 'n_t': len(tgrid), 't_range': [tgrid[0], tgrid[-1]], 'summary': summ,
               'rows': [[r[0], r[1], r[2]['341'], r[2]['F4'], r[2]['F64'], r[3], r[4], r[5]] for r in rows]}, open(out, 'w'))
    for s in sigmas:
        print(name, 'sigma', s, ' '.join('%s: min %.4g at t=%.6g neg %d first %s' % (pn, summ[str(s)][pn]['min'], summ[str(s)][pn]['at_t'], summ[str(s)][pn]['n_negative'], summ[str(s)][pn]['first_negative_t']) for pn in ('341', 'F4', 'F16', 'F64')), flush=True)

def dirichlet_coeffs(name, N):
    a = [0.0] * (N + 1)
    if name == 'ZETA': a = [0.0] + [1.0] * N
    elif name == 'L4': a = [0.0] + [[0, 1, 0, -1][n % 4] for n in range(1, N + 1)]
    elif name == 'L5': a = [0.0] + [[0, 1, -1, -1, 1][n % 5] for n in range(1, N + 1)]
    elif name == 'DH':
        kd = float(kappa_dh().mid()); a = [0.0] + [[0, 1, kd, -kd, -1][n % 5] for n in range(1, N + 1)]
    elif name in ('TNR3', 'TNRQ'):
        q = 3 if name == 'TNR3' else 1000003
        a = [0.0] + [1.0 + (2.2 * math.sqrt(q) if n % q == 0 else 0) + (q if n % (q * q) == 0 else 0) for n in range(1, N + 1)]
    elif name == 'EA':
        a = [0.0] * (N + 1)
        for d in range(1, N + 1):
            for m in range(d, N + 1, d): a[m] += (d / (m // d)) ** 0.25        # sum_{d e = m} d^a e^{-a}
    elif name == 'LIOU':
        a = [0.0] + [1.0] * N
        for p in range(2, N + 1):
            if all(p % r for r in range(2, int(p ** 0.5) + 1)):
                pk = p
                while pk <= N:
                    for m in range(pk, N + 1, pk): a[m] = -a[m]
                    pk *= p
    return a

def lambda_from_coeffs(a, N):
    """Lambda_F = (a log) * a^{-1} (Dirichlet convolution); a[1] = 1"""
    inv = [0.0] * (N + 1); inv[1] = 1.0
    for n in range(1, N + 1):
        if n > 1:
            pass
        v = inv[n]
        if v != 0.0:
            for m in range(2 * n, N + 1, n): inv[m] -= v * a[m // n]
    lam = [0.0] * (N + 1)
    for d in range(1, N + 1):
        ld = a[d] * math.log(d)
        if ld != 0.0:
            for m in range(d, N + 1, d): lam[m] += ld * inv[m // d]
    return lam

def main():
    mode = sys.argv[1]
    if mode == 'ladder':
        rows = []
        for n in list(range(2, 65)) + [100, 1000]:
            a = fejer_riesz(n); r = a[1] / a[0]; A = sum(a[1:])
            rows.append({'n': n, 'a1/a0': r, '2cos(pi/(n+2))': 2 * math.cos(math.pi / (n + 2)), 'R_floor': 1 / (2 * (1 - r ** -0.5) ** 2), 'R_plain': (A / 2) / (math.sqrt(a[1]) - math.sqrt(a[0])) ** 2 * a[0] / a[0],
                         'min_P_on_grid': min(sum(a[k] * math.cos(k * th * math.pi / 5000) for k in range(n + 1)) for th in range(5001)) / a[0]})
        a = POLYS['341']; rows.append({'n': '3-4-1', 'a1/a0': 4 / 3, 'R_floor': 1 / (2 * (1 - (3 / 4) ** 0.5) ** 2), 'R_plain': 2.5 / (2 - math.sqrt(3)) ** 2})
        lim = 1 / (2 * (1 - 2 ** -0.5) ** 2)
        for L in (28.73, 37.48):
            print('log t = %.2f: width with R = 5.558691: %.4e ; with the Fejer limit %.4f: %.4e ; with 3-4-1 (34.82): %.4e' % (L, 1 / (5.558691 * L), lim, 1 / (lim * L), 1 / (34.821 * L)))
        for r in rows: print(r)
        json.dump({'limit': lim, 'rows': rows}, open(sys.argv[2], 'w'))
    elif mode == 'coef':
        name, N = sys.argv[2], int(float(sys.argv[3]))
        a = dirichlet_coeffs(name, N); lam = lambda_from_coeffs(a, N)
        neg = [n for n in range(2, N + 1) if lam[n] < -1e-9]
        nz = [n for n in range(2, N + 1) if abs(lam[n]) > 1e-9]
        npp = [n for n in nz if len(set(p for p in range(2, int(n ** 0.5) + 2) if n % p == 0 and all(p % r for r in range(2, int(p ** 0.5) + 1)))) > 1 or False]
        def is_pp(n):
            for p in range(2, int(n ** 0.5) + 1):
                if n % p == 0:
                    while n % p == 0: n //= p
                    return n == 1
            return True
        off = [n for n in nz if not is_pp(n)]
        mx = max(range(2, N + 1), key=lambda n: abs(lam[n]) / math.log(n))
        print(json.dumps({'object': name, 'N': N, 'first_negative_n': neg[0] if neg else None, 'n_negative': len(neg), 'first_n_not_prime_power_with_Lambda_nonzero': off[0] if off else None,
                          'n_not_prime_power': len(off), 'max_abs_Lambda_over_log_n': abs(lam[mx]) / math.log(mx), 'at_n': mx, 'Lambda_2..12': [round(lam[n], 6) for n in range(2, 13)]}))
    elif mode == 'scan':
        name = sys.argv[2]; t0, t1, dt = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]); sig = [s for s in sys.argv[6:-1]]
        n = int(round((t1 - t0) / dt)) + 1
        run_scan(name, [t0 + dt * i for i in range(n)], sig, sys.argv[-1])
    elif mode == 'high':      # zeta at t = exp(L) + j, j = 0..4
        Ls = [float(x) for x in sys.argv[2:-1]]
        run_scan('ZETA', [math.exp(L) + j for L in Ls for j in range(5)], ['1.01'], sys.argv[-1])

if __name__ == '__main__': main()
