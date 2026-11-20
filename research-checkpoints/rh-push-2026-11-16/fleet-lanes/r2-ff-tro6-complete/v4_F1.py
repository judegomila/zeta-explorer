"""(a) d = 0 closed form of c_k(1) (proved from Theorem A); (b) Lemma H: sums of c_k(m) over m with prescribed top J
coefficients are independent of the prescription for J <= (d+1)/2.  Uses the predecessor's c_k tables (q = 7,
prime-power Gauss-sum formulas, k <= 7) and, independently, brute-force tables from ff.py for small k (q = 7, 13)."""
import pickle, numpy as np, sys
from ff import FF
res = pickle.load(open('../tro6-functionfield/ck_n6.pkl', 'rb'))
q = 7; F = FF(7); G = F.G(1)
# predecessor's chi_0 uses generator 3 with chi_0(3^e) = zeta6^e; FF picks the least primitive root (3 for q=7): same character.
exp = {0: 1, 1: q * G, 2: 0, 3: 0, 4: 0, 5: 0, 6: (1 - 1 / q) * q ** 7, 7: G * (1 - 1 / q) * q ** 8}
print('(a) d=0:', {k: float('%.2g' % abs(res[(0, k)][0] - exp[k])) for k in exp if (0, k) in res}, ' |c_7(1)| =', abs(res[(0, 7)][0]) if (0, 7) in res else None)
print('(b) Lemma H, predecessor tables q=7: max over k of (spread of class sums)/(max |class sum| or rms scale)')
for d in (2, 3, 4):
    for J in range(1, d + 1):
        worst = 0; ks = []
        for k in range(0, 8):
            if (d, k) not in res: continue
            a = res[(d, k)]
            if np.linalg.norm(a) < 1e-6 * q ** (d / 2 + k): continue      # c_k identically 0 (rounding noise)
            # index = sum c_i 7^i  (low coefficients)
            cls = a.reshape(q ** J, q ** (d - J)).sum(axis=1)     # top J coefficients <-> idx // 7^(d-J)
            scale = np.sqrt((abs(a) ** 2).sum() * q ** (d - J)) + 1e-300
            worst = max(worst, abs(cls - cls.mean()).max() / scale); ks.append(k)
        print(f"  d={d} J={J} (J <= (d+1)/2: {2*J <= d+1}) k in {ks[0]}..{ks[-1]}: {worst:.2e}")
for qq, dk in ((7, [(2, 1), (2, 2), (2, 3), (3, 2), (3, 3)]), (13, [(1, 1), (1, 2), (2, 1), (2, 2), (3, 2)])):
    F = FF(qq)
    for d, k in dk:
        M = F.monic(d); ck = np.zeros(qq ** d, dtype=complex)
        for c in F.monic(k):
            ck += F.gauss(c[:-1], M)
        out = []
        if np.linalg.norm(ck) < 1e-6 * qq ** (d / 2 + k):
            print(f'  brute q={qq} d={d} k={k}: c_k identically 0'); continue
        for J in range(1, d + 1):
            cls = ck.reshape(qq ** J, qq ** (d - J)).sum(axis=1)
            out.append((J, 2 * J <= d + 1, float('%.1e' % (abs(cls - cls.mean()).max() / (np.sqrt((abs(ck) ** 2).sum() * qq ** (d - J)) + 1e-300)))))
        print(f"  brute q={qq} d={d} k={k} |c_k|={np.linalg.norm(ck):.3g}: (J, J<=(d+1)/2, spread) = {out}")
