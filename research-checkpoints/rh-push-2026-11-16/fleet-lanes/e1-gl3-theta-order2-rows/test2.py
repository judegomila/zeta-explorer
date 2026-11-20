# test2: candidate rows with non-symbol data (pivot). Exact integer q-expansions; SVD in float64 (MEASURED).
# delta = Kohnen's weight 13/2 form on Gamma_0(4) (plus space), Shimura lift Delta:
#   delta = (1/2) E_4(4z) D theta - 60 (D G)(4z) theta,  D = q d/dq, theta = sum_{n in Z} q^{n^2},
#   E_4 = 1 + 240 sum sigma_3(n) q^n, (D G) = sum n sigma_3(n) q^n.
import numpy as np, json, math, sys
NQ = 400000
print("planned allocation: object arrays of length %d (python ints), about 4 arrays x 400001 x ~40 B = 64 MB;"
      " dense float matrices at most 310 x 2000 x 8 B = 5 MB each" % NQ)
out = {}
J = NQ//4
sig3 = np.zeros(J+1, dtype=object); sig3[:] = 0
for d in range(1, J+1):
    sig3[d::d] += d**3
E4 = np.zeros(NQ+1, dtype=object); E4[:] = 0; E4[0] = 1
DG = np.zeros(NQ+1, dtype=object); DG[:] = 0
idx = np.arange(1, J+1)
E4[4*idx] = 240*sig3[1:]
DG[4*idx] = np.array([int(j) for j in idx], dtype=object)*sig3[1:]
c = np.zeros(NQ+1, dtype=object); c[:] = 0
c -= 60*DG                                   # n = 0 term of theta
n = 1
while n*n <= NQ:
    L = NQ + 1 - n*n
    c[n*n:] += (n*n)*E4[:L] - 120*DG[:L]     # n and -n
    n += 1
c = [int(v) for v in c]
print("delta = ", " ".join("%+d q^%d" % (c[k], k) for k in range(1, 21) if c[k]))
out['delta_first'] = {k: c[k] for k in range(1, 30) if c[k]}
plus = all(c[k] == 0 for k in range(1, NQ+1) if k % 4 in (2, 3))
print("plus space (c(n) = 0 for n = 2, 3 mod 4), n <= %d: %s" % (NQ, plus)); out['plus_space'] = plus

# tau(m), m <= 2000, exact
MT = 2000
e3 = [0]*(MT+1); k = 0
while k*(k+1)//2 <= MT:
    e3[k*(k+1)//2] = (-1)**k*(2*k+1); k += 1
def mul(a, b):
    r = [0]*(MT+1)
    for i, ai in enumerate(a):
        if ai:
            for j in range(0, MT+1-i):
                if b[j]: r[i+j] += ai*b[j]
    return r
e6 = mul(e3, e3); e12 = mul(e6, e6); e24 = mul(e12, e12)
tau = [0] + e24[:MT]                         # tau(m) = coefficient of q^(m-1) in eta^24/q
assert tau[1:8] == [1, -24, 252, -1472, 4830, -6048, -16744]

def kron(D, m):                              # Kronecker symbol (D/m), D = 0,1 mod 4, m >= 1
    r = 1
    while m % 2 == 0:
        m //= 2
        r *= 0 if D % 2 == 0 else (1 if D % 8 in (1, 7) else -1)
    if r == 0: return 0
    a = D % m if m > 1 else 0
    if m == 1: return r
    # Jacobi (a/m), m odd
    j = 1; nn = m
    while a:
        while a % 2 == 0:
            a //= 2
            if nn % 8 in (3, 5): j = -j
        a, nn = nn, a
        if a % 4 == 3 and nn % 4 == 3: j = -j
        a %= nn
    return r*j if nn == 1 else 0
def sqf(n):
    q = 2
    while q*q <= n:
        if n % (q*q) == 0: return False
        q += 1
    return True
def fund(D): return D > 1 and ((D % 4 == 1 and sqf(D)) or (D % 4 == 0 and (D//4) % 4 in (2, 3) and sqf(D//4)))
mu = [1]*(MT+1); mu[0] = 0
pr = [q for q in range(2, MT+1) if all(q % r for r in range(2, int(q**.5)+1))]
for q in pr:
    for k in range(q, MT+1, q): mu[k] = -mu[k]
    for k in range(q*q, MT+1, q*q): mu[k] = 0
divs = [[] for _ in range(MT+1)]
for d in range(1, MT+1):
    for k in range(d, MT+1, d): divs[k].append(d)

DS = [D for D in range(2, 2001) if fund(D)]
zero = [D for D in DS if c[D] == 0]
DS = [D for D in DS if c[D] != 0]
print("fundamental discriminants 1 < D <= 2000: %d with c(D) != 0, %d with c(D) = 0" % (len(DS), len(zero)))
out['n_rows'] = len(DS); out['c_zero'] = zero
print("sample c(D):", [(D, c[D]) for D in DS[:12]])

# (1) Kohnen's formula  c(D m^2) = c(D) sum_{e | m} mu(e) (D/e) e^5 tau(m/e), exact, all D m^2 <= NQ, m >= 2
bad = 0; cnt = 0
for D in DS:
    m = 2
    while D*m*m <= NQ:
        rhs = c[D]*sum(mu[e]*kron(D, e)*e**5*tau[m//e] for e in divs[m] if mu[e])
        cnt += 1; bad += (rhs != c[D*m*m]); m += 1
print("(1) Kohnen-Shimura relation: %d cases, %d mismatches" % (cnt, bad)); out['kohnen_cases'] = cnt; out['kohnen_bad'] = bad

# (2) classification test on raw coefficients: column m = p as a function of the row D
print("(2) c(D p^2)/c(D) over rows D (raw q-expansion): values by (D/p), and the two parameters")
cls = {}
for q in (3, 5, 7, 11, 13):
    vals = {}
    for D in DS:
        assert c[D*q*q] % c[D] == 0
        vals.setdefault(kron(D, q), set()).add(c[D*q*q]//c[D])
    ok = all(len(v) == 1 for v in vals.values())
    v = {k: next(iter(s)) for k, s in vals.items()}
    f0 = v[0]; flat = (v[-1] - v[1])//2
    print("   p=%2d single value per symbol class: %s  values %s  frequency-0 part = %d (tau(p) = %d)  symbol part = -(D/p) * %d (p^5 = %d)"
          % (q, ok, v, f0, tau[q], flat, q**5))
    cls[q] = {'ok': ok, 'tau': tau[q], 'freq0': f0, 'flat': flat, 'ratio_flat_to_p^(11/2)': flat/q**5.5, 'freq0_norm': f0/q**5.5}
out['classification'] = cls

# (3) row matrices, rows D in DS, columns m <= 2000
R = len(DS); M = MT
ms = np.arange(1, M+1)
S = np.array([[kron(D, m) for m in range(1, M+1)] for D in DS], dtype=float)           # symbol table
taun = np.array([tau[m]/m**5.5 for m in range(1, M+1)])
SH = np.zeros((R, M))                                                                   # Shimura rows c(D m^2)/(c(D) m^(11/2))
for i, D in enumerate(DS):
    for m in range(1, M+1):
        SH[i, m-1] = sum(mu[e]*S[i, e-1]*e**-0.5*taun[m//e-1] for e in divs[m] if mu[e])
cn = np.array([c[m]/m**2.75 for m in range(1, M+1)])                                    # normalised delta coefficients
MP = S*cn[None, :]                                                                      # model maximal-parabolic rows chi_D(m) c(m)
nsq = int(math.isqrt(M))
TH = S[:, :nsq]                                                                         # theta rows chi_D(n) on m = n^2
rng = np.random.default_rng(1)
def spec(A, name, extra=""):
    A = A/np.sqrt((A**2).sum(1).mean())            # mean row norm 1
    sv = np.linalg.svd(A, compute_uv=False)
    G = A@A.T; dg = np.sqrt(np.diag(G)); C = G/np.outer(dg, dg); off = C[~np.eye(len(C), dtype=bool)]
    r = {'sv_top': [float(v) for v in sv[:4]], 'sv_top_sq_over_rows': float(sv[0]**2/A.shape[0]),
         'offdiag_rms': float(np.sqrt((off**2).mean())), 'offdiag_max': float(np.abs(off).max()),
         'pairs_abs_corr_gt_0.5': int((np.abs(off) > .5).sum()//2)}
    print("   %-34s sv1..4 = %7.3f %7.3f %7.3f %7.3f   sv1^2/rows = %.4f   off-diag corr rms %.4f max %.4f  pairs>0.5: %d %s"
          % (name, *sv[:4], r['sv_top_sq_over_rows'], r['offdiag_rms'], r['offdiag_max'], r['pairs_abs_corr_gt_0.5'], extra))
    return r
print("(3) row matrices %d x %d (theta rows %d x %d); rows scaled to mean norm 1" % (R, M, R, nsq))
g = {}
g['symbol'] = spec(S, "symbol table (D/m)")
g['theta'] = spec(TH, "theta rows (D/n), m = n^2")
g['shimura'] = spec(SH, "Shimura rows c(Dm^2)/c(D)")
SHc = SH - taun[None, :]
g['shimura_minus_common'] = spec(SHc, "Shimura rows minus tau~(m)")
w = np.array([sum(1.0/e for e in divs[m] if mu[e]) for m in range(1, M+1)])
g['mp'] = spec(MP, "max-parabolic model (D/m) c~(m)")
eps = rng.choice([-1.0, 1.0], size=M)
g['mp_signs'] = spec(S*(np.abs(cn)*eps)[None, :], "same with random column signs")
gd = np.abs((MP@MP.T) - ((S*np.abs(cn)[None, :])@(S*np.abs(cn)[None, :]).T)).max()
print("   max |Gram(MP) - Gram(symbol table with weights |c~(m)|)| = %.2e (the Gram matrix depends on c only through |c(m)|^2)" % gd)
out['gram_sign_blind_maxdiff'] = float(gd)
g['random'] = spec(rng.choice([-1.0, 1.0], size=(R, M)), "random signs (control)")
# controls on the Shimura rows
def shim(hecke, twist=None, sign=None):
    A = np.zeros((R, M))
    for i, D in enumerate(DS):
        for m in range(1, M+1):
            s = 0.0
            for e in divs[m]:
                if mu[e]:
                    x = mu[e]*S[i, e-1]*e**-0.5
                    if twist is not None: x *= twist[e-1]
                    if sign is not None: x *= sign[e-1]
                    s += x*hecke[m//e-1]
            A[i, m-1] = s
    return A
a = 0.3
ea = np.array([sum(d**a*(m//d)**-a for d in divs[m]) for m in range(1, M+1)])          # E_a: coefficients of zeta(s+a) zeta(s-a)
g['ctl_Ea'] = spec(shim(ea), "control E_a Hecke part, a = 0.3")
g['ctl_Ea_minus_common'] = spec(shim(ea) - ea[None, :], "  minus common part")
chi5 = np.array([kron(5, m) for m in range(1, M+1)], dtype=float)
g['ctl_twist5_minus_common'] = spec(shim(taun, twist=chi5) - taun[None, :], "control: (5/e) inserted, minus common")
cm = np.ones(M)                                                                         # completely multiplicative random signs
sp_ = {q: rng.choice([-1.0, 1.0]) for q in pr}
for m in range(2, M+1):
    t = m; v = 1.0
    for q in pr:
        if q*q > t: break
        while t % q == 0: t //= q; v *= sp_[q]
    if t > 1: v *= sp_[t]
    cm[m-1] = v
g['ctl_signtwist_minus_common'] = spec(shim(taun, sign=cm) - taun[None, :], "control: random mult. signs on e, minus common")
out['gram'] = g
# coherent pairs for the symbol part of the Shimura rows: weighted Gram sum_e mu^2(e) (DD'/e)/e over squarefree e
Gs = SHc@SHc.T; dgs = np.sqrt(np.diag(Gs)); Cs = Gs/np.outer(dgs, dgs)
i, j = np.unravel_index(np.argmax(np.abs(Cs - np.eye(R))), Cs.shape)
print("   largest off-diagonal correlation of the symbol part: D = %d, D' = %d, corr = %.3f" % (DS[i], DS[j], Cs[i, j]))
out['largest_offdiag_pair'] = [DS[i], DS[j], float(Cs[i, j])]
json.dump(out, open(sys.argv[1], 'w'), indent=1)
