"""check_slot_ff.py q d N lam [completed] : independent brute force (python, exact Z[zeta_6]) of the slot split, against `ffs ens`.
From the definitions only: g_3 phase of the product polynomial P A' (ffpy.gphase), chi by resultants of the product, no factorised formula.
  R^P(m) = sum_{A'} zeta^g(P A') u(A') chi_{P A'}(m)   [+ Jbar sum_{n linear} u(n) chi_n(m)^3 zeta^g(P) chi_P(m)   if completed, N = 3]
  E = sum_m |sum_P R^P(m)|^2,  D = diagonal,  SD = sum_P sum_m |R^P(m)|^2,
  CR = sum_{P != P'} sum_m R^P(m) conj(R^P'(m))  (explicit double sum; must be a rational integer and equal E - SD),
  J_k = <v_k, R>,  J_k^P = <v_k, R^P>,  v_0 = 1, v_1(m) = sum_a chi_0(m(a)).
Also checks c_1(m) = sum_{deg c = 1} g_6(m, c) = G_1 conj(v_1(m)) against `ffx bfck` (definition of g_6, exact histograms) when d <= 2.
Weights checked: one, a, b, mu, aligned, random phases (seed 11), a and mu with slot signs (seed 5)."""
import sys, subprocess
from ffpy import *
q, d, N, lam = [int(x) for x in sys.argv[1:5]]; comp = len(sys.argv) > 5 and sys.argv[5] == '1'
F = FF(q); M64 = (1 << 64) - 1
def hash64(x):
    x = (x + 0x9e3779b97f4a7c15) & M64; x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & M64; x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & M64; return x ^ (x >> 31)
def rnd6(hh0, i):
    z = (hh0 + 0x9e3779b97f4a7c15 * (i + 1)) & M64; z ^= z >> 31; z = (z * 0xbf58476d1ce4e5b9) & M64; z ^= z >> 29; return ((z >> 32) * 6) >> 32
ms = [F.idx2poly(i, d) for i in range(q**d)]; As = [F.idx2poly(i, N) for i in range(q**N)]; lin = [F.idx2poly(i, 1) for i in range(q)]
primes = [(i, P) for i, P in ((i, F.idx2poly(i, lam)) for i in range(q**lam)) if F.irreducible(P)]
m0 = next(m for m in ms if F.irreducible(m))
def zpow(k): return ZP[k % 6]
def reduce_add(L):
    s = (0, 0)
    for x in L: s = add(s, x)
    return s
def ev(m, a): return sum(c * pow(a, i, q) for i, c in enumerate(m)) % q
v1 = []
for m in ms:
    s = (0, 0)
    for a in range(q):
        val = ev(m, a)
        if val: s = add(s, ZP[F.L6[val]])
    v1.append(s)
def mu(A):
    g = F.gphase(A, 0); return 0 if g is None else (-1 if (3*(len(A)-1) + g) % 6 == 3 else 1)
def target(idx, f):
    Fp = F.idx2poly(idx, f)
    def u(A):
        if F.gphase(A, 0) is None: return 0
        R = F.res(Fp, A); return 0 if R == 0 else (-1 if (3*F.L6[R]) % 6 == 3 else 1)
    return u
def one(A): return 0 if F.gphase(A, 0) is None else 1
WS = [('0 0 0 0 0', one, 0), ('0 3 2 3 0', target(2, 3), 0), ('0 3 8 3 0', target(8, 3), 0), ('4 0 0 0 0', mu, 0), ('5 0 0 0 0', 'al', 0), ('1 11 0 0 0', 'rnd', 11),
      ('0 3 2 3 5', target(2, 3), 5), ('4 0 0 0 5', mu, 5)]
def chi3(n, m):
    c = F.chi(n, m); return 0 if c is None else (-1 if c & 1 else 1)
out = []
for spec, u, seed in WS:
    rows = []; D = 0
    for pidx, P in primes:
        gP = F.gphase(P, 2); cP = [F.chi(P, m) for m in ms]; r = [(0, 0)] * len(ms)
        ss = 0; hh0 = 0
        if callable(u) and seed: ss = 3 * ((hash64((pidx * 0x9E3779B97F4A7C15 + seed * 0xD6E8FEB86659FD93) & M64) >> 33) & 1)
        if u == 'rnd': hh0 = hash64((pidx * 1000003 + seed) & M64)
        for ai, A in enumerate(As):
            PA = F.pmul(P, A); g = F.gphase(PA, 2)
            if g is None: continue
            if callable(u):
                ua = u(A)
                if ua == 0: continue
                ph0 = g + (3 if ua < 0 else 0) + ss
            elif u == 'al':
                c0 = F.chi(PA, m0)
                if c0 is None: continue
                ph0 = -c0
            else: ph0 = rnd6(hh0, ai)
            for mi, m in enumerate(ms):
                c = F.chi(PA, m)
                if c is None: continue
                D += 1; r[mi] = add(r[mi], zpow(ph0 + c))
        if comp:
            for ni, n in enumerate(lin):
                if callable(u):
                    un = u(n)
                    if un == 0: continue
                    ph0 = gP + (3 if un < 0 else 0) + ss; pre = None
                elif u == 'al':
                    c3 = chi3(n, m0)
                    if c3 == 0: continue
                    ph0 = -F.chi(P, m0) + (3 if c3 < 0 else 0)
                else: ph0 = rnd6(hh0, len(As) + ni)
                for mi, m in enumerate(ms):
                    c3 = chi3(n, m)
                    if c3 == 0 or cP[mi] is None: continue
                    D += q; r[mi] = add(r[mi], mul(F.Jb, zpow(ph0 + cP[mi] + (3 if c3 < 0 else 0))))
        rows.append(r)
    nm = len(ms); tot = [(0, 0)] * nm
    for r in rows: tot = [add(x, y) for x, y in zip(tot, r)]
    E = sum(norm(x) for x in tot); SD = sum(norm(x) for r in rows for x in r)
    # explicit cross term over pairs of distinct primes
    cr = (0, 0)
    for mi in range(nm):
        col = [r[mi] for r in rows]; s = (0, 0); sn = 0
        for x in col: s = add(s, x); sn += norm(x)
        # sum_{P != P'} x_P conj(x_P') computed pair by pair
        acc = (0, 0)
        for i, x in enumerate(col):
            if x == (0, 0): continue
            for j, y in enumerate(col):
                if i != j and y != (0, 0): acc = add(acc, mul(x, conj(y)))
        cr = add(cr, acc)
    assert cr[1] == 0, 'cross term not rational'
    def proj(rr, k):
        s = (0, 0)
        for mi in range(nm): s = add(s, rr[mi] if k == 0 else mul(conj(v1[mi]), rr[mi]))
        return s
    N0 = norm(proj(tot, 0)); N1 = norm(proj(tot, 1)); SB0 = sum(norm(proj(r, 0)) for r in rows); SB1 = sum(norm(proj(r, 1)) for r in rows)
    # general projections: vectors v_0, v_1 (variant 0) and also V v_0, V v_1 (variant 1); J_i = <v_i, R>, M_ij = sum_P J_i^P conj(J_j^P)
    if callable(u): Vm = [sum(u(n) * chi3(n, m) for n in lin) for m in ms]
    elif u == 'al': Vm = [sum(chi3(n, m0) * chi3(n, m) for n in lin) for m in ms]
    else: Vm = [0] * nm
    vecs = [[(1, 0)] * nm, v1] + ([[(Vm[i], 0) for i in range(nm)], [mul((Vm[i], 0), v1[i]) for i in range(nm)]] if comp else [])
    K = len(vecs)
    def Jv(rr): return [reduce_add([mul(conj(vecs[k][mi]), rr[mi]) for mi in range(nm)]) for k in range(K)]
    Jt = Jv(tot); Mm = [[(0, 0)] * K for _ in range(K)]
    for r in rows:
        jp = Jv(r)
        for i in range(K):
            for j in range(K): Mm[i][j] = add(Mm[i][j], mul(jp[i], conj(jp[j])))
    G = [[reduce_add([mul(conj(vecs[i][mi]), vecs[j][mi]) for mi in range(nm)]) for j in range(K)] for i in range(K)]
    prj = [x for i in range(K) for j in range(K) for x in G[i][j]] + [x for i in range(K) for x in Jt[i]] + [x for i in range(K) for j in range(K) for x in Mm[i][j]]
    out.append((spec, len(primes), E, D, SD, N0, N1, SB0, SB1, nm, sum(norm(x) for x in v1), cr[0], prj))
    print(f"BF {q} {d} {N} {lam} {spec} var={int(comp)} | np {len(primes)} | E {E} | D {D} | SD {SD} | explicit CR {cr[0]} | E - SD - CR = {E - SD - cr[0]} | N0 {N0} N1 {N1} SB0 {SB0} SB1 {SB1}", flush=True)
# kernel
args = ['./ffs', 'ens', str(q), str(d), str(N), str(lam), '1' if comp else '0'] + ' '.join(w[0] for w in WS).split()
res = subprocess.run(args, capture_output=True, text=True).stdout
ok = True; var = '1' if comp else '0'; k = 0; kp = 0
for line in res.splitlines():
    if line.startswith('PRJ') and line.split()[2] == var:
        got = [int(x) for x in line.replace('|', ' ').split()[4:]]; same = got == out[kp][12]
        print(f"weight {out[kp][0]}: kernel == brute force on the projection data (Gram, J, M; {len(got)} integers): {same}"); ok &= same; kp += 1
    if not line.startswith('ENS'): continue
    f = [x.strip() for x in line.split('|')]
    if f[0].split()[-1] != var: continue
    got = tuple(int(x) for x in f[1:10]); exp = out[k][1:10]; same = got == tuple(exp) and out[k][2] - out[k][4] == out[k][11]
    print(f"weight {out[k][0]}: kernel == brute force on (np, E, D, SD, N0, N1, SB0, SB1, |v0|^2): {got == tuple(exp)}; E = SD + explicit CR: {out[k][2] - out[k][4] == out[k][11]}")
    ok &= same; k += 1
print('ALL EQUAL' if ok and k == len(WS) and kp == len(WS) else 'MISMATCH')
# c_1 = G_1 conj(v_1) against the definition of g_6 (ffx bfck)
if d <= 2 and not comp:
    bf = subprocess.run(['./ffx', 'bfck', str(q), str(d), '1'], capture_output=True, text=True).stdout.split('\n'); good = 0
    for line in bf:
        t = line.split()
        if not t: continue
        mi = int(t[0]); cnt = [int(x) for x in t[1:]]; exp = [0] * (6 * q); m = ms[mi]
        for a in range(q):
            val = ev(m, a)
            for x in range(1, q): exp[F.L6[x] * q + (x * val) % q] += 1      # val = 0 (T - a divides m): every sixth root once, value 0
        good += cnt == exp
    print(f'c_1(m) = sum_a sum_x chi_0(x) psi(x m(a)) = G_1 conj(v_1(m)) as exact histograms (ffx bfck, definition of g_6): {good} of {q**d} rows equal')
