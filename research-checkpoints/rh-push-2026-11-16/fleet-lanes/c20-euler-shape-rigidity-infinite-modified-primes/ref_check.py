# Second, independent pass (mpmath, 40 digits; different code path from checks.py).
# (1) FE defect D(t) = N(1/2+it) - N(1/2-it) at fixed t for S = {nextprime(10^j)}, j <= 12 and j <= 20:
#     the difference between the two truncations is inside the tail bound, and |D| is far above it.
# (2) Bohr mean by Gauss-free trapezoid in mpmath on a short range for one frequency (order-of-magnitude re-check).
# (3) One-prime Lemma C instance with a pole of G on Re s = 1 (alpha = q): defect on the line.
import json, mpmath as mp
mp.mp.dps = 40
def is_prime(n):
    if n < 2: return False
    for p in (2,3,5,7,11,13,17,19,23,29,31,37):
        if n % p == 0: return n == p
    d, s = n-1, 0
    while d % 2 == 0: d //= 2; s += 1
    for a in (2,3,5,7,11,13,17,19,23,29,31,37):
        x = pow(a, d, n)
        if x in (1, n-1): continue
        for _ in range(s-1):
            x = x*x % n
            if x == n-1: break
        else: return False
    return True
def nextprime(n):
    n += 1
    while not is_prime(n): n += 1
    return n
S20 = [nextprime(10**j) for j in range(1, 21)]
def N(s, S, alpha):
    r = mp.mpf(1)
    for p in S:
        y = mp.power(p, -s)
        r *= (1-alpha*y)/(1-y)
    return r
out = {}
for name, alpha in (('THIN-sparse', -1), ('DEL-sparse', 0), ('alpha=2.5', mp.mpf('2.5'))):
    rec = {}
    for t in ('1.0', '7.3', '100.25'):
        s = mp.mpc('0.5', t)
        D12 = N(s, S20[:12], alpha) - N(1-s, S20[:12], alpha)
        D20 = N(s, S20, alpha) - N(1-s, S20, alpha)
        rec[t] = {'|D| 12 primes': mp.nstr(abs(D12), 15), '|D| 20 primes': mp.nstr(abs(D20), 15),
                  '|D20 - D12|': mp.nstr(abs(D20-D12), 5)}
    out[name] = rec
# (2) mean over [0, T] of N(1/2+it) 11^{it} for THIN-sparse, 12 primes, T = 2000, step 0.02
T = 2000; h = mp.mpf('0.02'); acc = mp.mpc(0); n = int(T/h)
l11 = mp.log(11)
for k in range(n):
    t = (k+mp.mpf('0.5'))*h
    acc += N(mp.mpc(0.5, t), S20[:6], -1)*mp.expj(t*l11)
out['Bohr mean (6 primes, T=2000) at n=11'] = mp.nstr(acc/n, 8)
out['predicted 2/sqrt(11)'] = mp.nstr(2/mp.sqrt(11), 8)
# (3) one prime q = 2, alpha = 2: G = zeta (1-2^-s)/(1-2^{1-s}); defect on the line
rec = {}
for t in ('1.0', '3.0'):
    s = mp.mpc('0.5', t)
    f = lambda z: (1-2*mp.power(2, -z))/(1-mp.power(2, -z))
    rec[t] = mp.nstr(abs(f(s)-f(1-s)), 12)
out['one prime q=2, alpha=2: |N(s)-N(1-s)|'] = rec
out['bound |1-alpha| q^-1/2 (lower bound for the sup)'] = mp.nstr(1/mp.sqrt(2), 12)
json.dump(out, open('ref_check.json', 'w'), indent=1); print(json.dumps(out, indent=1))
