"""pivot_predict.py : advance prediction for the pivot runs (completed rows, N = 3, dual length at or below 3N).
Cube term of the completed row: Jbar V(m) S_0(m), S_0 = marked row with trivial cofactor (N = 0).  Law for S_0 (round-8 law with the Moebius sum of
the trivial cofactor, S_cop(k) = -pi(lam) q^k):   e_U = (pi(lam)/q^lam) [ wt_0^2 + wt_1^2/(1 - 1/q) [d >= 2] ],  wt_k = wt(r', k), r' = k + lam - 1 - d, class 6 | k - lam.
Predicted cube-term energy in units of the diagonal of the completed row:  Delta = q * mean_m V(m)^2 * e_U * pi(lam) q^d / diag_total,
diag_total = pi(lam) [ D_3 + q D_1 ],  D_3 = sum_{A' sqf deg 3 in the support} #{m : (m,A')=1},  D_1 = sum_{n linear} #{m : (m,n)=1}.
(Assumes |S_0(m)|^2 is spread evenly over m; exact inputs otherwise.)"""
import sys, json
from ffpy import FF
from plan import weights
CFG = {7: [(6, 1), (6, 2), (7, 1), (7, 2), (8, 1), (8, 2)], 13: [(6, 1), (6, 2), (7, 1), (7, 2)]}
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
def wt2(q, r, k, lam):
    if r < 0: return 0
    if (k - lam) % 6 == 0:
        if r == 0: return 1
        w = (q-1)*sum(q**i for i in range((r-1)//6 + 1)) - (q**(r//6) if r % 6 == 0 else 0); return w*w
    return q * q**(r//3) if r % 6 == 0 else 0
def main():
    out = {}
    print('q (N,lam,d) rmax vector | e_U predicted | mean V^2 | Delta predicted (cube-term energy / diagonal)')
    for q, cfgs in CFG.items():
        F = FF(q); Wq = weights(q); lin = [F.idx2poly(i, 1) for i in range(q)]
        As = [F.idx2poly(i, 3) for i in range(q**3)]; sqf = [F.gphase(A, 0) is not None for A in As]
        for lam, d in cfgs:
            ms = [F.idx2poly(i, d) for i in range(q**d)]; np_ = npr(q, lam)
            eU = (np_/q**lam) * (wt2(q, lam-1-d, 0, lam) + (wt2(q, lam-d, 1, lam)/(1-1/q) if d >= 2 else 0))
            for name in ('one', 'a'):
                mode, p1, p2, p3 = Wq[name]
                if name == 'one': u = [1]*q; sup = [i for i in range(len(As)) if sqf[i]]
                else:
                    Fp = F.idx2poly(p2, p1); u = [(-1 if (p3*F.L6[F.res(Fp, n)]) % 6 == 3 else 1) for n in lin]; sup = [i for i in range(len(As)) if sqf[i] and F.res(Fp, As[i]) != 0]
                V = []
                for m in ms:
                    s = 0
                    for i, n in enumerate(lin):
                        c = F.chi(n, m)
                        if c is not None: s += u[i]*(-1 if c & 1 else 1)
                    V.append(s)
                mV = sum(v*v for v in V)/len(V)
                D3 = sum(sum(1 for m in ms if F.res(As[i], m) != 0) for i in sup); D1 = sum(sum(1 for m in ms if F.res(n, m) != 0) for n in lin)
                Delta = q*mV*eU*q**d/(D3 + q*D1)
                out[f'{q} 3 {lam} {d} {name}'] = {'eU': eU, 'mV2': mV, 'Delta': Delta}
                print(f'{q} (3,{lam},{d}) {3+lam-1-d+d//2} {name} | {eU:.4g} | {mV:.4g} | {Delta:.4g}')
    json.dump(out, open('pivot_predictions.json', 'w'), indent=0)

if __name__ == '__main__':
    main()
