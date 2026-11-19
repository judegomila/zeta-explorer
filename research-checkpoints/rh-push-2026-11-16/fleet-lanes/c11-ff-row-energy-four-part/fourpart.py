"""fourpart.py : the registered exact decomposition of the completed-row energy (PREREG section 2), pure python, exact (integers and Fractions).
Completed row, N = 6, row variable m monic of degree d = 2 (49 rows), units G_2^(6+lam)  [c10-ff-completed-rows-692, PREREG section 1 / RESULT section 2]:
    R = X + Tq + Tf,   X = S_6 + Jbar V_1 S_3,   Tq = Jbar^2 Vsq S_0,   Tf = Jbar^2 Vsf S_0,
    V_1(m) = sum_{n linear} c(n) chi_n(m)^3,  Vsq(m) = sum_{l linear, l !| m} c(l^2),  Vsf(m) = sum_{n squarefree of degree 2} c(n) chi_n(m)^3,  c(n) = u(n)^3.
Directions in the row space C^49: v_0 = 1 (principal: read by J_0 = sum_m R_m); w = u(m) made orthogonal to v_0 (own character; absent for `one` and `al`).
Pi = projection on the orthogonal complement of span{v_0, w}.  Parts (all divided by the completed diagonal D_c in the reports):
    A  principal signal            |<R, v_0>|^2 / 49                with its three contributions from X, Tq, Tf listed
    B  own-character signal        |<R, w'>|^2 / |w'|^2
    C  n = l^2 normaliser term     |Tq|^2      (its share along v_0 is inside A, its share along w' inside B, the rest is C_perp = |Pi Tq|^2)
    D  squarefree-n non-principal part   |Pi Tf|^2      (|Tf|^2 is listed beside it)
    G  bulk                        |Pi X|^2
    cross terms                    x_CD = 2 Re<Pi Tq, Pi Tf>,  x_CG = 2 Re<Pi Tq, Pi X>,  x_DG = 2 Re<Pi Tf, Pi X>
Identity (checked exactly for every vector):  E_c = A + B + C_perp + D + G + x_CD + x_CG + x_DG.
Diagonal D_c: rule of c10 (terms grouped by the character they carry; the q terms n = l^2 carry the same character and add before squaring)."""
from fractions import Fraction as Fr
from ffpy import FF, mul, add, norm, conj, ZP
from vecs import uphase, F, q
d = 2; nm = q**d
ms = [F.idx2poly(i, d) for i in range(nm)]
m0 = next(i for i, m in enumerate(ms) if F.irreducible(m))
ns = {j: [F.idx2poly(i, j) for i in range(q**j)] for j in (1, 2)}
SQ = {}
for li, l in enumerate(ns[1]):
    p = F.pmul(l, l); SQ[p[0] + q*p[1]] = li
def _c3(c): return 0 if c is None else (-1 if c & 1 else 1)
CHI3 = {j: [[_c3(F.chi(n, m)) for m in ms] for n in ns[j]] for j in (1, 2)}     # chi_n(m)^3 in {0, 1, -1}
A3 = [F.idx2poly(i, 3) for i in range(q**3)]; SQF3 = [F.gphase(A, 0) is not None for A in A3]; COP3 = [[F.res(A, m) != 0 for m in ms] for A in A3]
def cube_coef(name, j):
    """c(n) = u(n)^3 in {0, 1, -1} for the n of degree j."""
    if name == 'al': return [_c3(F.chi(n, ms[m0])) for n in ns[j]]
    return [0 if e == 100 else (-1 if (3*e) % 6 == 3 else 1) for e in uphase(name, j)]
def supp3(name):
    if name == 'al': return [i for i in range(q**3) if SQF3[i] and COP3[i][m0]]
    u = uphase(name, 3); return [i for i in range(q**3) if SQF3[i] and u[i] != 100]
def Vs(name):
    c1 = cube_coef(name, 1); c2 = cube_coef(name, 2)
    V1 = [sum(c1[i]*CHI3[1][i][mi] for i in range(q)) for mi in range(nm)]
    Vsq = [sum(c2[i]*CHI3[2][i][mi] for i in range(q*q) if i in SQ) for mi in range(nm)]
    Vsf = [sum(c2[i]*CHI3[2][i][mi] for i in range(q*q) if i not in SQ) for mi in range(nm)]
    return V1, Vsq, Vsf
def diag_cube(name, np_):
    """j = 1 and j = 2 parts of the completed diagonal (units q^(6+lam))."""
    c1 = cube_coef(name, 1); c2 = cube_coef(name, 2); sup = supp3(name)
    t1 = sum(sum(1 for mi in range(nm) if COP3[ai][mi] and CHI3[1][i][mi]) for i in range(q) if c1[i] for ai in sup)
    t2 = sum(sum(1 for mi in range(nm) if CHI3[2][i][mi]) for i in range(q*q) if c2[i] and i not in SQ)
    t2 += sum(sum(c2[i] for i in SQ if CHI3[2][i][mi])**2 for mi in range(nm))
    return q*np_*t1, q*q*np_*t2
def own_dir(name):
    """49 w(m) - sum(w) as elements of Z[zeta_6] (None when there is no own direction)."""
    if name in ('one', 'al'): return None
    w = [(0, 0) if e == 100 else ZP[e] for e in uphase(name, d)]; s = (0, 0)
    for x in w: s = add(s, x)
    W = [(nm*x[0] - s[0], nm*x[1] - s[1]) for x in w]
    return W if any(x != (0, 0) for x in W) else None
def inner(X, Y):
    r = (0, 0)
    for x, y in zip(X, Y): r = add(r, mul(x, conj(y)))
    return r
def tot(X):
    r = (0, 0)
    for x in X: r = add(r, x)
    return r
def en(X): return sum(norm(x) for x in X)
def re2(X, Y): return sum(norm(add(x, y)) - norm(x) - norm(y) for x, y in zip(X, Y))
def perp_scaled(Z, W, W2):
    """K * Pi Z with K = 49 |W|^2 (K = 49 when there is no own direction): exact in Z[zeta_6]."""
    s = tot(Z)
    if W is None: return [(nm*z[0] - s[0], nm*z[1] - s[1]) for z in Z], nm
    c = inner(Z, W); out = []
    for z, w in zip(Z, W):
        cw = mul(c, w); out.append((nm*W2*z[0] - W2*s[0] - nm*cw[0], nm*W2*z[1] - W2*s[1] - nm*cw[1]))
    return out, nm*W2
def terms(name, S6, S3, S0):
    V1, Vsq, Vsf = Vs(name); Jb = F.Jb; Jb2 = mul(Jb, Jb)
    X = [add(S6[mi], mul(Jb, mul((V1[mi], 0), S3[mi]))) for mi in range(nm)] if S6 is not None else None
    Tq = [mul(Jb2, mul((Vsq[mi], 0), S0[mi])) for mi in range(nm)]; Tf = [mul(Jb2, mul((Vsf[mi], 0), S0[mi])) for mi in range(nm)]
    return X, Tq, Tf, (V1, Vsq, Vsf)
def decompose(name, S6, S3, S0, np_, diag6):
    """S6, S3: row lists of the vector; S0: companion row (trivial cofactor); diag6 = np * sum_{A' in supp} #{m coprime}.  S6 = None: cube parts only."""
    X, Tq, Tf, (V1, Vsq, Vsf) = terms(name, S6, S3, S0); d1, d2 = diag_cube(name, np_); Dc = diag6 + d1 + d2
    W = own_dir(name); W2 = en(W) if W else 0
    def along(Z):
        a0 = Fr(norm(tot(Z)), nm); aw = Fr(norm(inner(Z, W)), W2) if W else Fr(0); return a0, aw
    pq, K = perp_scaled(Tq, W, W2); pf, _ = perp_scaled(Tf, W, W2); K2 = K*K
    r = {'D_c': Dc, 'diag_parts': [diag6, d1, d2], 'np': np_, 'C_total': en(Tq), 'D_total': en(Tf), 'C_perp': Fr(en(pq), K2), 'D': Fr(en(pf), K2), 'x_CD': Fr(re2(pq, pf), K2),
         'C_along': along(Tq), 'D_along': along(Tf), 'meanVsq2': Fr(sum(v*v for v in Vsq), nm), 'meanVsf2': Fr(sum(v*v for v in Vsf), nm), 'E_S0': en(S0)}
    if X is None: return r
    R = [add(X[mi], add(Tq[mi], Tf[mi])) for mi in range(nm)]; px, _ = perp_scaled(X, W, W2)
    A, B = along(R)
    r.update({'E_c': en(R), 'A': A, 'B': B, 'G': Fr(en(px), K2), 'x_CG': Fr(re2(pq, px), K2), 'x_DG': Fr(re2(pf, px), K2), 'X_along': along(X), 'E_X': en(X), 'E_S6': en(S6), 'rows': R,
              'E_j1': q*sum(V1[mi]**2 * norm(S3[mi]) for mi in range(nm))})
    assert r['E_c'] == A + B + r['C_perp'] + r['D'] + r['G'] + r['x_CD'] + r['x_CG'] + r['x_DG'], ('four-part identity', name)
    r['identity'] = True
    return r
