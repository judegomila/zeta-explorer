# Radial growth of m = G/zeta = prod_{q in S} (1 - q^-s)/(1 - alpha_q q^-s), |alpha_q| = q^(1/2),
# at pole points s = 1/2 + delta + i t, t = (theta_p + 2 pi n)/log p, and at generic points.
# mpmath, 70 digits working precision (results quoted to <= 12 digits; 40-digit claims not needed).
# Memory: lists of at most ~5e4 mpf per point: < 50 MB.
import json, sys, random
from mpmath import mp, mpf, exp, log, cos, pi, floor, sqrt, e as E
mp.dps = 70

def is_pp(n):
    if n < 2: return False
    for p in (2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97):
        if n % p == 0: return n == p
    d, r = n-1, 0
    while d % 2 == 0: d //= 2; r += 1
    for a in (2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71):
        x = pow(a, d, n)
        if x in (1, n-1): continue
        for _ in range(r-1):
            x = x*x % n
            if x == n-1: break
        else: return False
    return True
def nextprime(n):
    n = int(n)
    while not is_pp(n): n += 1
    return n

def lam_seq(kind, lam_max):
    """log q_k. Exact primes (20-base Miller-Rabin; probable above 3.3e24) while f(k) <= 150; f(k) itself above
    (the prime nearest exp(f) has log within exp(-0.4 f) of f: below 1e-26 for f >= 150)."""
    out, exact, k, seen = [], [], 1, set()
    while True:
        f = {'ek': lambda k: exp(mpf(k)), 'k3': lambda k: mpf(k)**3, 'ek2': lambda k: exp(mpf(k)/2),
             'cyc': lambda k: log(mpf(3))*2**(k-1)}[kind](k)
        if f > lam_max: break
        if kind == 'cyc':
            out.append(f); exact.append(None)
        elif f <= 150:
            q = nextprime(floor(exp(f)))
            while q in seen: q = nextprime(q+1)
            seen.add(q); out.append(log(mpf(q))); exact.append(q)
        else:
            out.append(f); exact.append(None)
        k += 1
    return out, exact

def theta(kind_theta, k):
    if kind_theta == 'zero': return mpf(0)
    if kind_theta == 'pi': return pi
    return 2*pi*((k*(sqrt(mpf(5))-1)/2) % 1)        # 'rot': golden rotation

def y_point(lams, thetas, t, deltas, skip=None):
    """log|m(1/2+delta+it)| for each delta. skip = index whose denominator is evaluated with cos = 1."""
    cph = []
    cnum = []
    for i, L in enumerate(lams):
        cph.append(mpf(1) if i == skip else cos(thetas[i] - t*L))
        cnum.append(cos(t*L) if L < 400 else None)
    ys = []
    for d in deltas:
        y = mpf(0)
        for i, L in enumerate(lams):
            x = L*d
            if x > 170: break
            r = exp(-x)
            y -= log(1 - 2*r*cph[i] + r*r)/2
            if cnum[i] is not None:
                rn = exp(-L*(mpf(1)/2 + d))
                y += log(1 - 2*rn*cnum[i] + rn*rn)/2
        ys.append(y)
    return ys

def Lsum(lams, d, skip):
    return sum(log(1+exp(-L*d)) for i, L in enumerate(lams) if i != skip and L*d < 170)

def run(kind, kind_theta, jmax):
    deltas = [mpf(10)**(-j) for j in range(1, jmax+1)]
    lams, exact = lam_seq(kind, 170/deltas[-1])
    thetas = [theta(kind_theta, k+1) for k in range(len(lams))]
    cS = sum(log(1-exp(-L/2)) for L in lams if L < 400)
    rows = []
    pts = [(j, n) for j in range(5) for n in (1, 2, 3, 5)]
    for (j, n) in pts:
        t = (thetas[j] + 2*pi*n)/lams[j]
        ys = y_point(lams, thetas, t, deltas, skip=j)
        lb = [cS - Lsum(lams, d, j) - log(1-exp(-lams[j]*d)) for d in deltas]
        viol = max(float(b - y) for b, y in zip(lb, ys))
        rows.append(dict(type='pole', k=j+1, n=n, t=float(t), y=[float(v) for v in ys],
                         lower=[float(v) for v in lb], max_lower_minus_y=viol))
    rnd = random.Random(20261120)
    for g in range(5):
        t = mpf(rnd.getrandbits(53))/2**53*100
        ys = y_point(lams, thetas, t, deltas)
        rows.append(dict(type='generic', t=float(t), y=[float(v) for v in ys]))
    Lr = [float(Lsum(lams, d, None)/log(1/d)) for d in deltas]
    return dict(kind=kind, theta=kind_theta, n_factors=len(lams), log10_delta=[-j for j in range(1, jmax+1)],
                exact_primes=[str(q) for q in exact if q], L_over_log=Lr, logcS=float(cS), rows=rows)

if __name__ == '__main__':
    print('planned allocation: at most 6e4 mpf per list, < 0.1 GB', flush=True)
    res = []
    for kind, th, jmax in (('ek', 'zero', 30), ('ek', 'rot', 30), ('k3', 'zero', 11), ('k3', 'rot', 11),
                           ('ek2', 'rot', 30), ('cyc', 'pi', 30)):
        r = run(kind, th, jmax); res.append(r)
        print(kind, th, 'factors', r['n_factors'], 'L/log(1/delta) at ends', r['L_over_log'][0], r['L_over_log'][-1], flush=True)
        for row in r['rows']:
            y = row['y']; jm = len(y)
            sl = (y[-1]-y[jm//2])/((jm-1-jm//2)*2.302585092994046)
            print('  ', row['type'], row.get('k'), row.get('n'), 't=%.6g' % row['t'],
                  'y(first,mid,last)= %.3f %.3f %.3f' % (y[0], y[jm//2], y[-1]), 'slope_upper_half= %.3f' % sl,
                  ('lb_viol= %.2e' % row['max_lower_minus_y']) if 'lower' in row else '', flush=True)
    json.dump(res, open(__file__.replace('radial.py', 'radial.json'), 'w'), indent=1)
