"""Shared code, lane s4-weil-sector-split-pole-schur. Parity-sector Legendre-Galerkin matrices of Weil forms.
Uses wlib.py (copied unchanged from s2-weil-coefficient-rigidity) for Legendre rows, coefficients and helpers.

Weil form of an object F (completed Q^s prod_j pi^{-s/2} Gamma((s+kappa_j)/2) F(s), poles of F at 1/2 +- p), real g on (-a,a):
  W_F(g) = sum_p 2 ghat(ip) ghat(-ip) + (1/2pi) int w_arch |ghat|^2 - sum_n n^{-1/2} Re c(n) (h(log n) + h(-log n)),
  ghat(ip) ghat(-ip) = (int g cosh(px))^2 - (int g sinh(px))^2      [h = g * g~, hhat(ip) = ghat(ip) ghat(-ip)].
So the pole term is +2 (int g cosh)^2 on even g and -2 (int g sinh)^2 on odd g (node odd-sector-pole-term).
Basis phi_i = sqrt((2i+1)/(2a)) P_i(x/a); even sector = even i, odd sector = odd i; S(v) = C(v) + C(v)^T is block diagonal.
"""
import math, time
import numpy as np
from wlib import *
from flint import arb, acb, arb_mat, ctx, arf


def par_idx(N, par): return [i for i in range(N) if i % 2 == par]


def sblocks(v, N):
    """(S_even, S_odd) at shift v in [0,2):  S = C + C^T restricted to the parity blocks."""
    v = arb(v)
    G = gl(N + 1)
    half = (2 - v) / 2; mid = v / 2
    xs = [mid + half * x for x, w in G]
    A = legrows(xs, N)
    B = legrows([x - v for x in xs], N)
    ws = [w * half / 2 for x, w in G]
    out = []
    for par in (0, 1):
        idx = par_idx(N, par)
        Am = arb_mat([[A[k][i] for i in idx] for k in range(len(G))])
        Bm = arb_mat([[B[k][j] * ws[k] for j in idx] for k in range(len(G))])
        C = Am.transpose() * Bm
        out.append(C + C.transpose())
    return out


def rho_bernstein(a):
    """Bernstein parameter of the nearest singularity u = +- i pi of r_z for one Gauss panel u in [0, 2a]."""
    z = complex(-1.0, math.pi / a)
    s = (z * z - 1) ** 0.5
    return max(abs(z + s), abs(z - s))


def extra_nodes(amax, digits):
    return int(math.ceil(digits * math.log(10) / (2 * math.log(rho_bernstein(amax))))) + 8


def ser(M): return [[tuple(int(t) for t in M[i, j].mid().man_exp()) for j in range(M.ncols())] for i in range(M.nrows())]
def des(L): return arb_mat([[arb(arf(t)) for t in row] for row in L])


def stage1_nodes(N, Q, nodes, supports, zkeys):
    """accumulate over Gauss nodes (single panel v = 1 + x on [0,2]).
    returns Alog[par], T[(s,z)][par]  (arb_mat)"""
    G = gl(Q)
    d = [len(par_idx(N, 0)), len(par_idx(N, 1))]
    Alog = [arb_mat(d[0], d[0]), arb_mat(d[1], d[1])]
    T = {(s, z): [arb_mat(d[0], d[0]), arb_mat(d[1], d[1])] for s in supports for z in zkeys}
    I2 = [eye(d[0]) * 2, eye(d[1]) * 2]
    for k in nodes:
        x, w = G[k]
        v = 1 + x; wv = w
        S = sblocks(v, N)
        for par in (0, 1):
            Alog[par] = Alog[par] + (I2[par] - S[par]) * (wv / (2 * v))
        for s in supports:
            a = arb(s) / 2
            for z in zkeys:
                cf = r_z(arb(z), a * v) * a * wv
                for par in (0, 1):
                    T[(s, z)][par] = T[(s, z)][par] + S[par] * cf
    return Alog, T


def arch_block(d, a, zs, Alog, Ts, shift):
    """Alog, Ts: parity blocks; zs list of z keys; shift = 2 log Q (arb)"""
    a = arb(a)
    const = len(zs) * (arb.const_euler() + (4 * a).log() + arb.pi().log()) - arb(shift)
    M = Alog * len(zs) - eye(d) * const
    for T in Ts: M = M - T
    return M


def pole_vectors(N, a, p):
    """(cosh vector on even indices, sinh vector on odd indices): int phi_i cosh(px), int phi_i sinh(px)"""
    vp = pole_vec(N, a, p, 1); vm = pole_vec(N, a, p, -1)
    ce = [(vp[i] + vm[i]) / 2 for i in par_idx(N, 0)]
    so = [(vp[i] - vm[i]) / 2 for i in par_idx(N, 1)]
    return ce, so


def xsinh_vector(N, a, p='0.5'):
    """int phi_i(x) x sinh(px) dx on even indices"""
    a = arb(a); p = arb(p)
    G = gl(N + 48)
    rows = legrows([x for x, w in G], N)
    out = []
    for i in par_idx(N, 0):
        s = arb(0)
        for k, (x, w) in enumerate(G):
            s += w * rows[k][i] * (a * x) * (p * a * x).sinh()
        out.append(s * (a / 2).sqrt())
    return out


def outer(col, scale):
    cm = arb_mat([[x] for x in col])
    return cm * cm.transpose() * scale


# ---------------- eigenvalues ----------------
def ldl_inertia(M, sigma=0):
    """number of negative pivots of mid(M) - sigma I; None if a pivot is not sign definite"""
    d = M.nrows()
    sg = arb(sigma)
    B = [[arb(M[i, j].mid()) - (sg if i == j else 0) for j in range(d)] for i in range(d)]
    neg = 0
    for k in range(d):
        dk = B[k][k]
        if dk < 0: neg += 1
        elif not (dk > 0): return None
        rk = B[k]
        for i in range(k + 1, d):
            ri = B[i]
            f = arb((ri[k] / dk).mid())
            if f == 0: continue
            ri[k + 1:] = [arb((x - f * y).mid()) for x, y in zip(ri[k + 1:], rk[k + 1:])]
    return neg


def _rq(M, x):
    Mx = M * x
    return (x.transpose() * Mx)[0, 0] / (x.transpose() * x)[0, 0]


def _inv_iter(M, sigma, x, iters=40, tol=1e-25):
    d = M.nrows()
    A = M - eye(d) * arb(sigma)
    try:
        Ainv = midmat(A.inv())
    except Exception:
        return None, x
    lam = None
    for it in range(iters):
        y = Ainv * x
        nr = sum((y[i, 0] * y[i, 0] for i in range(d)), arb(0)).sqrt()
        if not nr.is_finite() or not (nr > 0): return None, x
        x = midmat(y * (1 / nr))
        new = arb(_rq(M, x).mid())
        if lam is not None:
            dl = abs(float((new - lam).mid())); sc = abs(float(new.mid()))
            if dl <= tol * sc: lam = new; break
        lam = new
    return lam, x


def lowest(M, small=1e-7):
    """lowest eigenvalue of the symmetric ball matrix M.
    float64 eigh when |lambda_min| > small; else exact inertia at 0 (LDL on midpoints), then inverse iteration.
    returns dict(lam, how, neg0) ; neg0 = number of negative eigenvalues (float count or LDL inertia)."""
    d = M.nrows()
    Mf = tofloat(M)
    w, V = np.linalg.eigh((Mf + Mf.T) / 2)
    if abs(w[0]) > small:
        return dict(lam=float(w[0]), how='f64', neg0=int(np.sum(w < 0)), lam2=float(w[1]) if d > 1 else None)
    Mm = midmat(M)
    neg0 = ldl_inertia(Mm, 0)
    rng = np.random.Generator(np.random.PCG64(7))
    x = arb_mat([[arb(float(V[i, 0]) + 1e-3 * float(rng.standard_normal()))] for i in range(d)])
    if neg0 == 0:
        lam, x = _inv_iter(Mm, 0, x)
        if lam is None: return dict(lam=float('nan'), how='inv-fail', neg0=0)
        return dict(lam=float(lam.mid()), lam_str=lam.mid().str(20, radius=False), how='ldl+inv', neg0=0)
    # negative eigenvalue(s) of size < small: bracket the lowest one by inertia, then shifted inverse iteration
    lo_e, hi_e = -math.log10(small) - 1, None      # lambda_min >= -10^{-lo_e}?  find exponent e with inertia(-10^-e) = 0
    e = lo_e
    nb = ldl_inertia(Mm, -arb(10) ** (-int(e)))
    if nb is None or nb > 0:
        return dict(lam=float(w[0]), how='f64-neg', neg0=neg0)
    lo = int(e); hi = int(ctx.prec * 0.28)
    while hi - lo > 1:
        mid = (lo + hi) // 2
        nb = ldl_inertia(Mm, -arb(10) ** (-mid))
        if nb == 0: lo = mid
        else: hi = mid
    sigma = -arb(10) ** (-lo)
    lam, x = _inv_iter(Mm, sigma, x)
    if lam is None: return dict(lam=-10.0 ** (-hi), how='bracket', neg0=neg0)
    return dict(lam=float(lam.mid()), lam_str=lam.mid().str(20, radius=False), how='ldl+bracket+inv', neg0=neg0)


def schur(M, cols):
    """M symmetric (d x d ball matrix), cols: list of vectors spanning the block U.
    Z = orthonormal complement. returns dict with D = Z^T M Z (matrix), E (r x r), S = E - B^T D^{-1} B (r x r floats),
    all with respect to an orthonormal basis of span(cols)."""
    d = M.nrows(); r = len(cols)
    # orthonormalise the block (Gram-Schmidt)
    U = []
    for c in cols:
        c = list(c)
        for rep in range(2):
            for q in U:
                dot = sum((x * y for x, y in zip(c, q)), arb(0))
                c = [x - dot * y for x, y in zip(c, q)]
        nr = sum((x * x for x in c), arb(0)).sqrt()
        U.append([arb((x / nr).mid()) for x in c])
    Z = complement(U, d)
    Um = arb_mat([[U[j][i] for j in range(r)] for i in range(d)])
    MZ = M * Z
    D = midmat(Z.transpose() * MZ)
    B = midmat(MZ.transpose() * Um)          # (d-r) x r
    E = midmat(Um.transpose() * (M * Um))
    return dict(D=D, B=B, E=E, Z=Z, U=Um)


def schur_complement(D, B, E):
    X = D.solve(B)
    S = E - B.transpose() * X
    r = E.nrows()
    return [[S[i, j] for j in range(r)] for i in range(r)]


def sym2_eigs(S):
    """eigenvalues (arb mid floats, strings) of a 1x1 or 2x2 symmetric arb list-matrix, lowest first"""
    if len(S) == 1: return [S[0][0]]
    a, b, c = S[0][0], (S[0][1] + S[1][0]) / 2, S[1][1]
    tr = a + c; disc = ((a - c) * (a - c) + 4 * b * b).sqrt()
    hi = (tr + disc) / 2 if float(tr.mid()) >= 0 else (tr - disc) / 2
    det = a * c - b * b
    other = det / hi
    lo_, hi_ = (other, hi) if float(other.mid()) <= float(hi.mid()) else (hi, other)
    return [lo_, hi_]


def fstr(x, n=12):
    return arb(x).mid().str(n, radius=False)


# =====================================================================================================================
# Midpoint LDL^T (no pivoting) and everything derived from it. Ball solves (arb_mat.solve / inv) are NOT used for the
# ill-conditioned blocks: their radii grow by about three times the digits of the condition number and the midpoints
# become meaningless (measured: N = 128, 2a = 3.2, 640 bits gave 1.8e-22 for an eigenvalue equal to 1.48e-64).
# =====================================================================================================================
def _mid(x): return arb(x.mid())


def ldl_factor(M, sigma=None):
    """mid(M) - sigma I = L D L^T, unit lower L (stored as scaled upper rows). returns (U_rows, D, neg) or None"""
    d = M.nrows()
    B = [[_mid(M[i, j]) for j in range(d)] for i in range(d)]
    if sigma is not None:
        sg = arb(sigma)
        for i in range(d): B[i][i] = _mid(B[i][i] - sg)
    D = []; neg = 0
    for k in range(d):
        dk = B[k][k]
        if dk < 0: neg += 1
        elif not (dk > 0): return None
        D.append(dk)
        rk = B[k]
        for i in range(k + 1, d):
            f = _mid(rk[i] / dk)
            if f == 0: continue
            ri = B[i]
            ri[i:] = [_mid(x - f * y) for x, y in zip(ri[i:], rk[i:])]
        inv = 1 / dk
        rk[k + 1:] = [_mid(x * inv) for x in rk[k + 1:]]          # row k now holds L[i][k], i > k
    return B, D, neg


def ldl_solve(F, b):
    B, D, neg = F
    d = len(D)
    y = [_mid(x) for x in b]
    for k in range(d):
        yk = y[k]
        if yk == 0: continue
        rk = B[k]
        y[k + 1:] = [_mid(x - l * yk) for x, l in zip(y[k + 1:], rk[k + 1:])]
    y = [_mid(y[k] / D[k]) for k in range(d)]
    for k in range(d - 1, -1, -1):
        rk = B[k]
        s = arb(0)
        for l, x in zip(rk[k + 1:], y[k + 1:]): s += l * x
        y[k] = _mid(y[k] - s)
    return y


def vdot(x, y):
    s = arb(0)
    for a_, b_ in zip(x, y): s += a_ * b_
    return _mid(s)


def matvec(M, x):
    xm = arb_mat([[v] for v in x])
    y = M * xm
    return [_mid(y[i, 0]) for i in range(len(x))]


def orthonormalise(cols):
    U = []
    for c in cols:
        c = [_mid(x) for x in c]
        for rep in range(2):
            for q in U:
                dot = vdot(c, q)
                c = [_mid(x - dot * y) for x, y in zip(c, q)]
        nr = vdot(c, c).sqrt()
        U.append([_mid(x / nr) for x in c])
    return U


def small_inv(Tm):
    r = len(Tm)
    if r == 1: return [[1 / Tm[0][0]]]
    a, b, c, d = Tm[0][0], Tm[0][1], Tm[1][0], Tm[1][1]
    det = a * d - b * c
    return [[d / det, -b / det], [-c / det, a / det]]


def small_pos(Tm):
    """number of positive eigenvalues of a symmetric 1x1 / 2x2 arb list-matrix"""
    ev = sym2_eigs(Tm)
    return sum(1 for e in ev if float(e.mid()) > 0) if all(e.is_finite() for e in ev) else None


def _iterate(solve, rq, x, iters=60, tol=1e-22):
    lam = None
    for it in range(iters):
        y = solve(x)
        nr = vdot(y, y).sqrt()
        if not nr.is_finite() or not (nr > 0): return None
        x = [_mid(v / nr) for v in y]
        new = rq(x)
        if lam is not None and abs(float((new - lam).mid())) <= tol * abs(float(new.mid())): return new
        lam = new
    return lam


def lowest_gen(fac, rq, x0, wfloat, small=1e-7):
    """fac(sigma) -> (number of eigenvalues below sigma, solver for (X - sigma)) ; rq = Rayleigh quotient of X."""
    r0 = fac(None)
    if r0 is None or r0[0] is None: return dict(lam=float(wfloat), how='factor-fail', neg0=None)
    neg0, solve0 = r0
    if neg0 == 0:
        lam = _iterate(solve0, rq, x0)
        if lam is None: return dict(lam=float('nan'), how='iter-fail', neg0=0)
        return dict(lam=float(lam.mid()), lam_str=lam.mid().str(20, radius=False), how='ldl+inv', neg0=0)
    lo = int(round(-math.log10(small)))
    r = fac(-arb(10) ** (-lo))
    if r is None or r[0] is None or r[0] > 0:
        return dict(lam=float(wfloat), how='f64-neg', neg0=neg0)
    hi = int(ctx.prec * 0.25)
    best = r
    while hi - lo > 1:
        mid = (lo + hi) // 2
        r = fac(-arb(10) ** (-mid))
        if r is not None and r[0] == 0: lo = mid; best = r
        else: hi = mid
    lam = _iterate(best[1], rq, x0)
    if lam is None: return dict(lam=-10.0 ** (-hi), how='bracket', neg0=neg0)
    return dict(lam=float(lam.mid()), lam_str=lam.mid().str(20, radius=False), how='ldl+bracket+inv', neg0=neg0)


def analyse(A, pole_cols, sigma, blocks, small=1e-7):
    """A: pole-less sector block (arch - primes). Form M = A + sum_c 2 sigma c c^T (sigma = +1 even, -1 odd).
    blocks: dict name -> list of column vectors spanning the block U (each block contains every pole vector).
    For each block: D = restriction of M (= of A) to the complement of U, S = Schur complement of U in M = (U^T M^-1 U)^-1.
    Identities used (A = mid matrix, T = U^T A^-1 U, K = sum_c 2 sigma (U^T c)(U^T c)^T):
       S = T^-1 + K ;  D^-1 b = y - (A^-1 U) T^-1 U^T y, y = A^-1 b (b orthogonal to U) ;  neg(D) = neg(A) + pos(T) - r."""
    d = A.nrows()
    A = midmat(A)
    M = A
    for c in pole_cols: M = M + outer(c, arb(2 * sigma))
    M = midmat(M)
    Af = tofloat(A); Af = (Af + Af.T) / 2
    Mf = tofloat(M); Mf = (Mf + Mf.T) / 2
    wM, VM = np.linalg.eigh(Mf)
    out = {}
    rng = np.random.Generator(np.random.PCG64(11))
    fl = {}
    need_hp = abs(wM[0]) <= small
    for bn, cols in blocks.items():
        Uf = np.linalg.qr(np.array([[float(x.mid()) for x in c] for c in cols]).T, mode='complete')[0]
        r = len(cols); Zf = Uf[:, r:]; Uq = Uf[:, :r]
        wD, VD = np.linalg.eigh(Zf.T @ Af @ Zf)
        fl[bn] = (wD, Zf @ VD[:, 0], Uq)
        if abs(wD[0]) <= small: need_hp = True
    if not need_hp:
        out['full'] = dict(lam=float(wM[0]), how='f64', neg0=int(np.sum(wM < 0)))
        Minv = np.linalg.inv(Mf)
        for bn, cols in blocks.items():
            wD, vD, Uq = fl[bn]
            S = np.linalg.inv(Uq.T @ Minv @ Uq); E = Uq.T @ Mf @ Uq
            out[bn] = dict(pf=dict(lam=float(wD[0]), how='f64', neg0=int(np.sum(wD < 0))),
                           S=[[repr(float(x)) for x in row] for row in S], S_eigs=[float(x) for x in np.linalg.eigvalsh((S + S.T) / 2)],
                           E_eigs=[float(x) for x in np.linalg.eigvalsh((E + E.T) / 2)], how='f64')
        return out
    # ---- high precision path
    def facM(sg):
        F = ldl_factor(M, sg)
        if F is None: return None
        return F[2], (lambda b, F=F: ldl_solve(F, b))
    x0 = [arb(float(VM[i, 0]) + 1e-3 * float(rng.standard_normal())) for i in range(d)]
    out['full'] = lowest_gen(facM, lambda x: _mid(vdot(x, matvec(M, x)) / vdot(x, x)), x0, wM[0], small)
    Fcache = {}
    def FA(sg):
        key = None if sg is None else sg.str(30)
        if key not in Fcache: Fcache[key] = ldl_factor(A, sg)
        return Fcache[key]
    for bn, cols in blocks.items():
        U = orthonormalise(cols); r = len(U)
        Kc = [[arb(0)] * r for _ in range(r)]
        for c in pole_cols:
            pc = [vdot(u, c) for u in U]
            for i in range(r):
                for j in range(r): Kc[i][j] = Kc[i][j] + 2 * sigma * pc[i] * pc[j]
        def facD(sg, U=U, r=r):
            F = FA(sg)
            if F is None: return None
            Zu = [ldl_solve(F, u) for u in U]
            Tm = [[vdot(U[i], Zu[j]) for j in range(r)] for i in range(r)]
            pos = small_pos(Tm)
            if pos is None: return None
            Ti = small_inv(Tm)
            def solve(b):
                y = ldl_solve(F, b)
                uy = [vdot(u, y) for u in U]
                co = [sum((Ti[i][j] * uy[j] for j in range(r)), arb(0)) for i in range(r)]
                x = y
                for i in range(r): x = [_mid(xv - co[i] * zv) for xv, zv in zip(x, Zu[i])]
                for rep in range(1):                    # re-project on the complement of U
                    for u in U:
                        dot = vdot(u, x); x = [_mid(xv - dot * uv) for xv, uv in zip(x, u)]
                return x
            return F[2] + pos - r, solve, Tm, Ti
        r0 = facD(None)
        wD, vD, Uq = fl[bn]
        rec = {}
        if r0 is None:
            rec['pf'] = dict(lam=float(wD[0]), how='factor-fail', neg0=None); rec['S_eigs'] = None
        else:
            S = [[r0[3][i][j] + Kc[i][j] for j in range(r)] for i in range(r)]
            ev = sym2_eigs(S)
            MU = [matvec(M, u) for u in U]
            E = [[vdot(U[i], MU[j]) for j in range(r)] for i in range(r)]
            rec['S'] = [[fstr(x) for x in row] for row in S]; rec['S_eigs'] = [float(e.mid()) for e in ev]
            rec['E_eigs'] = [float(e.mid()) for e in sym2_eigs(E)]
            x0 = [arb(float(v) + 1e-3 * float(rng.standard_normal())) for v in vD]
            for u in U:
                dot = vdot(u, x0); x0 = [_mid(xv - dot * uv) for xv, uv in zip(x0, u)]
            rec['pf'] = lowest_gen(lambda sg: (lambda q: None if q is None else (q[0], q[1]))(facD(sg)),
                                   lambda x: _mid(vdot(x, matvec(A, x)) / vdot(x, x)), x0, wD[0], small)
        rec['how'] = 'ldl'
        out[bn] = rec
    return out
