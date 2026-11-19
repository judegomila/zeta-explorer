"""fe_check.py q d Nmax : unmarked rows with trivial weight, exact in Z[zeta_6].
R_N(m) = sum_{c monic squarefree, deg c = N} g_3(1,c) chi_c(m) = G_2^N (a + b zeta_6)   (ffx row, lam = 0).
Completed row (model form of T = L_0 D, manuscript Prop. 5.1, alpha = 1, sharp degrees):
   C_N(m) = sum_j Jbar^j V_j(m) R_{N-3j}(m)   in units G_2^N,   V_j(m) = sum_{n monic, deg n = j} chi_n(m)^3,   Jbar = q^2 / G_2^3 = conj J(chi_0^2, chi_0^2).
Prints, for every N, the number of m with R_N(m) != 0 and with C_N(m) != 0, for both choices Jbar / J, and sum_m |.|^2."""
import sys, subprocess, itertools
q = int(sys.argv[1]); d = int(sys.argv[2]); Nmax = int(sys.argv[3])
# Z[zeta6]: pairs (a, b) = a + b z, z^2 = z - 1
def mul(x, y): return (x[0]*y[0] - x[1]*y[1], x[0]*y[1] + x[1]*y[0] + x[1]*y[1])
def add(x, y): return (x[0]+y[0], x[1]+y[1])
def conj(x): return (x[0]+x[1], -x[1])            # conj z = 1 - z
def norm(x): return x[0]*x[0] + x[0]*x[1] + x[1]*x[1]
ZP = [(1,0),(0,1),(-1,1),(-1,0),(0,-1),(1,-1)]
g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q-1)}) == q-1)
L6 = {pow(g, e, q): e % 6 for e in range(q-1)}
J = (0, 0)
for x in range(2, q): J = add(J, ZP[(2*L6[x] + 2*L6[(1-x) % q]) % 6])
assert norm(J) == q
Jb = conj(J)
def polys(k):
    for t in itertools.product(range(q), repeat=k): yield list(t[::-1]) + [1]      # low -> high, index order of ffx (idx2poly)
def idx2poly(i, k): return [(i // q**a) % q for a in range(k)] + [1]
def pmod(a, b):
    a = a[:]; db = len(b) - 1; ib = pow(b[-1], q-2, q)
    for i in range(len(a)-1, db-1, -1):
        f = a[i]*ib % q
        if f:
            for j in range(db+1): a[i-db+j] = (a[i-db+j] - f*b[j]) % q
    a = a[:db]
    while a and a[-1] == 0: a.pop()
    return a
def res(a, b):
    """Res(a, b) = lc(a)^deg b prod_{a(t)=0} b(t)."""
    a = a[:]; b = b[:]
    while a and a[-1] == 0: a.pop()
    while b and b[-1] == 0: b.pop()
    if not a or not b: return 0
    da, db = len(a)-1, len(b)-1
    if db == 0: return pow(b[0], da, q)
    if da == 0: return pow(a[0], db, q)
    if da < db: return (-1)**(da*db) * res(b, a) % q
    r = pmod(a, b)
    if not r: return 0
    # Res(a,b) = (-1)^(da db) Res(b,a) = (-1)^(da db) lc(b)^(da - deg r) Res(b, r)
    return (-1)**(da*db) * pow(b[-1], da-(len(r)-1), q) * res(b, r) % q
nm = q**d
ms = [idx2poly(i, d) for i in range(nm)]
def V(j, m):
    s = 0
    for i in range(q**j):
        n = idx2poly(i, j); R = res(n, m)
        if R: s += -1 if (L6[R] & 1) else 1
    return s
rows = {}
for N in range(Nmax+1):
    out = subprocess.run(['./ffx', 'row', str(q), str(d), str(N), '0', '0', '0', '0', '0', '0'], capture_output=True, text=True).stdout.split('\n')
    R = []
    for line in out:
        t = line.split()
        if len(t) != 7: continue
        H = [int(x) for x in t[1:]]
        R.append((H[0]-H[2]-H[3]+H[5], H[1]+H[2]-H[4]-H[5]))
    assert len(R) == nm
    rows[N] = R
Vt = {j: [V(j, m) for m in ms] for j in range(Nmax//3 + 1)}
print(f'q={q} d={d}: J = {J}, norm {norm(J)}')
print('N | #m with R_N != 0 | sum|R_N|^2 | #m with C_N != 0 (Jbar) | sum|C_N|^2 (Jbar) | #m with C_N != 0 (J) | sum|C_N|^2 (J)')
for N in range(Nmax+1):
    res_ = []
    for JJ in (Jb, J):
        C = []
        for mi in range(nm):
            c = (0, 0); f = (1, 0)
            for j in range(N//3 + 1):
                c = add(c, mul(mul(f, (Vt[j][mi], 0)), rows[N-3*j][mi])); f = mul(f, JJ)
            C.append(c)
        res_.append((sum(1 for c in C if c != (0, 0)), sum(norm(c) for c in C)))
    print(N, '|', sum(1 for r in rows[N] if r != (0, 0)), '|', sum(norm(r) for r in rows[N]), '|', res_[0][0], '|', res_[0][1], '|', res_[1][0], '|', res_[1][1])
