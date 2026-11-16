"""Theorem B: exact dual formula for the full block B(k,N;d;nu) = sum_{deg m=d} c_k(m) R_N(m;nu), all moduli,
all parities, all ranges; compared with the brute-force block.  Also prints the principal / non-principal split,
norms, and the conjugated-row control."""
import sys, numpy as np, itertools, pickle
from ff import FF
q = int(sys.argv[1]); cases = eval(sys.argv[2]); nus = eval(sys.argv[3]); SFC = len(sys.argv) > 4 and sys.argv[4] == 'sfc'
F = FF(q); PSI = F.PSI; one = np.array([[1]])
def mu_sf(A):
    N = len(A) - 1
    if N == 0: return 1
    D = int(F.res_table(A[:-1], np.array([list(F.deriv(A)) + [0] * (N - len(F.deriv(A)))]))[0])
    disc = D * (-1) ** (N * (N - 1) // 2) % q
    return (-1) ** N * (1 if pow(disc, (q - 1) // 2, q) == 1 else -1)
def nu_val(nu, P):     # P (n, L) coefficient rows; nu = None or (Lpoly monic tuple, j): nu(A) = chi_L(A)^j
    if nu is None: return np.ones(np.atleast_2d(P).shape[0], dtype=complex)
    return F.chi_at(nu[0][:-1], P, nu[1])
class Deg:
    def __init__(s, n):
        s.n = n; s.all = F.monic(n); s.tup = [tuple(int(x) for x in r) for r in s.all]
        s.sf = np.array([F.sqfree(t) for t in s.tup]); s.mu = np.array([mu_sf(t) if f else 0 for t, f in zip(s.tup, s.sf)])
        s.index = {t: i for i, t in enumerate(s.tup)}
_D = {}
def deg(n):
    if n not in _D: _D[n] = Deg(n)
    return _D[n]
def kappa(n):
    if n == 0: return 1.0
    D = deg(n); i = int(np.nonzero(D.sf)[0][0]); A = D.tup[i]
    return F.gauss(A[:-1], one)[0] * F.gauss(A[:-1], one, 2)[0] / (q ** n * D.mu[i])
def cop_matrix(k, N):
    """Cop[c, A] = 1 iff gcd = 1 (all monic c of deg k, all monic A of deg N)."""
    Dk, DN = deg(k), deg(N)
    if k == 0 or N == 0: return np.ones((q ** k, q ** N), dtype=np.int8)
    C = np.zeros((q ** k, q ** N), dtype=np.int8)
    for i, c in enumerate(Dk.tup):
        C[i] = F.chilog(c[:-1])[F.redidx(c[:-1], DN.all)] >= 0
    return C
_C = {}
def cop(k, N):
    if (k, N) not in _C: _C[(k, N)] = cop_matrix(k, N)
    return _C[(k, N)]
_CHL = {}; _RED = {}
def chl(n):
    if n not in _CHL: _CHL[n] = np.stack([F.chilog(c[:-1]) for c in deg(n).tup])
    return _CHL[n]
def redc(n, L):
    if (n, L) not in _RED: _RED[(n, L)] = np.stack([F.tops(c[:-1], L) for c in deg(n).tup])
    return _RED[(n, L)]
def chi_all_at(n, y):
    """vector over all monic c of degree n of chi_c(y) = chi_0(Res(c, y)), y any nonzero poly tuple."""
    y = np.array(F.trim(y), dtype=np.int64)
    if n == 0: return np.ones(1, dtype=complex)
    L = max(len(y), 1); Lc = ((L + 7) // 8) * 8
    red = redc(n, Lc)[:, :L, :]
    idx = (np.einsum('i,cij->cj', y, red) % q) @ (q ** np.arange(n))
    lg = chl(n)[np.arange(q ** n), idx]
    return np.where(lg >= 0, F.Z6[lg % 6], 0)
def I_sum(y, kp, Np, nu):
    a = chi_all_at(kp, y)
    if SFC: a = a * deg(kp).sf
    DN = deg(Np)
    b = DN.mu * nu_val(nu, DN.all) * np.conj(chi_all_at(Np, y))
    return a @ (cop(kp, Np) @ b)
def block_direct(k, N, d, nu, conj_row=False):
    M = F.monic(d); Dk, DN = deg(k), deg(N)
    ck = np.zeros(q ** d, dtype=complex)
    for c, f in zip(Dk.tup, Dk.sf):
        if SFC and not f: continue
        ck += F.gauss(c[:-1], M)
    R = np.zeros(q ** d, dtype=complex); nv = nu_val(nu, DN.all)
    for i, A in enumerate(DN.tup):
        if not DN.sf[i]: continue
        g3 = F.gauss(A[:-1], one, 2)[0]
        if conj_row: g3 = np.conj(g3)
        R += g3 * nv[i] * F.chi_at(A[:-1], M)
    return (ck * R).sum(), np.linalg.norm(ck), np.linalg.norm(R)
def is_sixth(z1):
    """monic z1 a sixth power?"""
    n = len(z1) - 1
    if n % 6: return False
    return any(pw6(t) == tuple(z1) for t in F.monics(n // 6))
def pw6(t):
    r = (1,)
    for _ in range(6): r = F.pmul(r, t)
    return r
def block_formula(k, N, d, nu):
    r = k + N - 1 - d; tot = 0; princ = 0; diag = 0
    for gam in range(0, min(k, N) + 1):
        kp, Np = k - gam, N - gam
        sig = kappa(gam) * kappa(Np) * F.chim1 ** (Np * (kp + 1) + gam * kp)
        Dg = deg(gam); nvg = nu_val(nu, Dg.all)
        for ig, g in enumerate(Dg.tup):
            if not Dg.sf[ig] or nvg[ig] == 0: continue
            for e in F.divisors(g, maxdeg=d):
                ee = len(e) - 1
                mue = mu_sf(e)
                wgt = sig * Dg.mu[ig] * mue * nvg[ig] * q ** (gam - ee)
                if kp == 0 and Np == 0:
                    tot += wgt; diag += wgt; continue
                rp = r - 2 * gam + ee
                if rp < 0: continue
                w = F.pmul(F.pmul(g, g), pw5(e))
                for zc in F.allc(rp + 1):
                    z = F.trim(zc)
                    if not z: continue
                    y = F.pmul(z, w)
                    v = wgt * PSI[zc[rp]] * I_sum(y, kp, Np, nu)
                    tot += v
                    y1 = tuple(x * int(F.INV[y[-1]]) % q for x in y)
                    if is_sixth(y1): princ += v
    return q ** d * tot, q ** d * princ, q ** d * diag
def pw5(t):
    r = (1,)
    for _ in range(5): r = F.pmul(r, t)
    return r
out = []
for (k, N, d) in cases:
    for name, nu in nus:
        Bd, nc, nR = block_direct(k, N, d, nu)
        Bf, Bp, Bdiag = block_formula(k, N, d, nu)
        Bc, _, nRc = block_direct(k, N, d, nu, conj_row=True)
        cs = nc * nR; null = q ** (-d / 2)
        rec = dict(q=q, k=k, N=N, d=d, r=k + N - 1 - d, nu=name, B=Bd, formula=Bf, err=abs(Bd - Bf), cs=cs, ratio=abs(Bd) / cs if cs else 0,
                   null=null, principal=abs(Bp) / cs if cs else 0, diag=abs(Bdiag) / cs if cs else 0, nonprincipal=abs(Bf - Bp - Bdiag) / cs if cs else 0,
                   conj_ratio=abs(Bc) / (nc * nRc) if nc * nRc else 0, normc=nc / q ** (d / 2 + k), normR=nR / q ** (d / 2 + N), sfc=SFC)
        out.append(rec)
        print(f"q={q} sfc={int(SFC)} (k,N,d)=({k},{N},{d}) r={rec['r']:2d} nu={name:8s} |B|={abs(Bd):.6e} err={rec['err']:.1e} ratio={rec['ratio']:.4f} "
              f"(x null {rec['ratio']/null:.2f}) princ={rec['principal']:.4f} diag={rec['diag']:.4f} nonpr={rec['nonprincipal']:.4f} conjrow={rec['conj_ratio']:.3f} "
              f"|c|/q^(d/2+k)={rec['normc']:.3f} |R|/q^(d/2+N)={rec['normR']:.3f}", flush=True)
pickle.dump(out, open(sys.argv[5] if len(sys.argv) > 5 else f'v2_q{q}.pkl', 'wb'))
