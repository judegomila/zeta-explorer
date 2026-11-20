"""predict.py : advance predictions from the coherent law of round 8 (c8 section 5), exact inputs from `ffx sc` and `ffx en` (lam = 0).
B_coh = sum_{k <= d/2} wt(r, k)^2 q^(2d) S_cop(k)^2 / (||c_k||^2 q^(N+lam) diagsum),  r = k + N + lam - 1 - d,
||c_0||^2 = q^d, ||c_k||^2 = q^(d+2k)(1 - 1/q);  diagsum = pi(lam) D_N,  D_N = sum_{A' in the support} #{m : (m, A') = 1}.
wt: class 6 | k - N - lam: 1 (r = 0), (q-1)(1 + q + .. + q^floor((r-1)/6)) - [6 | r] q^(r/6) (r >= 1); other classes: sqrt(q) q^(r/6) if 6 | r, else 0."""
import subprocess, sys, json
from fractions import Fraction as Fr
from plan import *
def run(args): return subprocess.run(['./ffx'] + [str(x) for x in args], capture_output=True, text=True).stdout
def npr(q, lam):
    def mu(n):
        m = 1; p = 2
        while p <= n:
            if n % p == 0:
                n //= p
                if n % p == 0: return 0
                m = -m
            p += 1
        return m
    return sum(mu(e)*q**(lam//e) for e in range(1, lam+1) if lam % e == 0)//lam
def wt2(q, r, k, N, lam):
    if (k - N - lam) % 6 == 0:
        if r == 0: return Fr(1)
        w = (q-1)*sum(q**i for i in range((r-1)//6 + 1)) - (q**(r//6) if r % 6 == 0 else 0)
        return Fr(w*w)
    return Fr(q * q**(r//3)) if r % 6 == 0 else Fr(0)
out = {}
for fam, (q, N, d, lams) in FAM.items():
    W = weights(q)
    for name in ['one', PROBE[q][1], PROBE[q][2], 'mu']:
        w = W[name]
        D = int(run(['en', q, d, N, 0, w[0], w[1], w[2], w[3], 0]).split('|')[3])
        for lam in lams:
            S = [int(x) for x in run(['sc', q, d, N, lam, w[0], w[1], w[2], w[3], 0]).split('|')[1].split()]
            diagsum = npr(q, lam)*D; B = Fr(0); act = []
            for k in range(d//2 + 1):
                r = k + N + lam - 1 - d; w2 = wt2(q, r, k, N, lam)
                nck = Fr(q**d) if k == 0 else Fr(q**(d+2*k))*(1 - Fr(1, q))
                t = w2 * q**(2*d) * S[k]**2 / (nck * q**(N+lam) * diagsum); B += t
                if t: act.append((k, r, 'principal' if (k-N-lam) % 6 == 0 else 'other', float(t)))
            lo = float(B)*(1 - 1/q)**2; hi = float(B) + 1.1
            out[f'{q} {N} {lam} {d} {name}'] = {'fam': fam, 'S_cop': S, 'D_N': D, 'B_coh': float(B), 'active': act, 'e_pred': [lo, hi]}
json.dump(out, open('predictions.json', 'w'), indent=0)
print('family q (N,lam,d) rmax weight | B_coh | active (k, r, class) | predicted e = energy/diagonal in [(1-1/q)^2 B_coh, B_coh + 1.1]')
for key, v in out.items():
    q, N, lam, d, name = key.split(); 
    print(v['fam'], q, f'({N},{lam},{d})', rmax(int(N), int(lam), int(d)), name, '|', f"{v['B_coh']:.4g}", '|', [(k, r, c) for k, r, c, t in v['active']], '|', f"[{v['e_pred'][0]:.3g}, {v['e_pred'][1]:.3g}]")
