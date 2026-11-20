# Referee-pass rerun on different members: q = 3, x = 0.8, 40 digits; residues by a 96-point circle rule
# of radius 0.07 (different from checks.py). Planned memory: a few MB.
import json, os
from mpmath import mp, mpf, mpc, pi, exp, log, gamma, zeta, sqrt, nstr
mp.dps = 40
q = mpf(3); L = log(q); x = mpf('0.8')
a_, b_ = mpf('0.07'), mpf('0.31')
al = q**a_ + q**-a_; be = q**b_ + q**-b_
e2 = mpf('0.2')
mem = {
 'HQ2(q=3,eps=0.2)': (lambda u: 1 + e2*u**2/(1-u)**4, [mpf(1)/2], [1, -4, 6+e2, -4, 1], [1, -4, 6, -4, 1]),
 'HQ3(q=3;0.07,0.31)': (lambda u: (1-al*u+u*u)/(1-be*u+u*u), [mpf(1)/2+b_, mpf(1)/2-b_], [1, -al, 1], [1, -be, 1]),
}
def loc(num, den, K):
    r = sqrt(q)
    n = [mpf(c)*r**i for i, c in enumerate(num)] + [mpf(0)]*(K+1)
    d = [mpf(c)*r**i for i, c in enumerate(den)]
    d2 = [mpf(0)]*(len(d)+1)
    for i, c in enumerate(d):
        d2[i] += c; d2[i+1] -= c
    a = []
    for k in range(K+1):
        s = n[k]
        for j in range(1, min(k, len(d2)-1)+1): s -= d2[j]*a[k-j]
        a.append(s)
    return a
def res(s0, m):
    Mn = 96; r = mpf('0.07'); tot = mpc(0)
    for j in range(Mn):
        w = r*exp(2j*pi*j/Mn); s = s0 + w
        tot += pi**(-s/2)*gamma(s/2)*zeta(s)*m(q**(mpf(1)/2-s))*x**(-s/2)*w
    return tot/Mn/2
out = {}
for name, (m, poles, num, den) in mem.items():
    aa = loc(num, den, 4)
    def v3(n):
        v = 0
        while n % 3 == 0: n //= 3; v += 1
        return v
    phi = lambda xx: sum(aa[v3(n)]*exp(-pi*n*n*xx) for n in range(1, 15))
    acc = phi(x) - phi(1/x)/sqrt(x) - res(mpf(1), m) - res(mpf(0), m)
    seq = [nstr(abs(acc), 6)]
    for K in range(0, 9):
        for sg in ([0] if K == 0 else [K, -K]):
            for p0 in poles: acc -= res(p0 + 2j*pi*sg/L, m)
        seq.append(nstr(abs(acc), 6))
    out[name] = {'a(q), a(q^2), a(q)^2': [nstr(aa[1], 20), nstr(aa[2], 20), nstr(aa[1]**2, 20)],
                 'defect: residues at 0,1 only; then lattice |k|<=K, K=0..8': seq}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ref_check.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
