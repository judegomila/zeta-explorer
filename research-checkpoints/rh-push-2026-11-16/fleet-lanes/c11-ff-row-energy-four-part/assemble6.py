"""assemble6.py : completed marked rows for general N from the exact row files of the kernel (ffw6 enw / ffw enw), q = 7.
    R_m = sum_{j=0..floor(N/3)} Jbar^j V_j(m) S_{N-3j}(m),   V_j(m) = sum_{n monic, deg n = j} c(n) chi_n(m)^3,   units G_2^(N+lam).
c(n) = u(n)^3 for the vectors one, a, b, mu;  al: c(n) = conj(chi_n(m0)^3) = chi_n(m0)^3;  random: a seeded sixth root of unity per n.
Diagonal of the row Gram form (units q^(N+lam)); terms are grouped by the character m -> chi_{P A' n^3}(m) they carry:
  j with n squarefree or A' of positive degree: every (P, A', n) carries a different character:   q^j * np * #{m : (m, A' n) = 1} each;
  n = l^2 (j = 2, 4, ..; here only j = 2 with A' = 1): chi_n^3 = chi_l^6 is the principal character mod l, so the q terms n = l^2 carry the SAME
  character chi_P and add up coherently:   q^2 * np * sum_m | sum_{l linear, l !| m} c(l^2) |^2      ("diagonal for n = l^2 written out").
  The naive value that treats them as q different characters, q^2 * np * sum_l |c(l^2)|^2 #{m : l !| m}, is returned as well.
All arithmetic exact (python integers, Z[zeta_6] pairs)."""
import os, sys, json, random
from fractions import Fraction as Fr
from ffpy import FF, mul, add, norm, conj, ZP
q = 7; F = FF(q)
VEC = {'one': (0, 0, 0, 0), 'a': (0, 3, 2, 3), 'b': (0, 3, 8, 3), 'mu': (4, 0, 0, 0), 'al': (5, 0, 0, 0)}
def load(fn):
    W = []; rows = {}
    for line in open(fn):
        t = line.split()
        if not t: continue
        if t[0] == 'ENW':
            f = [x.strip() for x in line.split('|')]; h = f[0].split()
            W.append({'mode': int(h[5]), 'p': tuple(int(x) for x in h[6:9]), 'np': int(f[1]), 'sumnorm': int(f[2]), 'diag': int(f[3]), 'sW2': int(f[4])})
        elif t[0] == 'ROW': rows.setdefault(int(t[1]), []).append((int(t[3]), int(t[4])))
    for i, w in enumerate(W):
        w['rows'] = rows[i]; assert sum(norm(r) for r in rows[i]) == w['sumnorm']
    return W
def pick(W, name, seed=None):
    """row block of a vector in a result file."""
    for w in W:
        if name == 'r':
            if w['mode'] == 1 and (seed is None or w['p'][0] == seed): return w
        elif w['mode'] == VEC[name][0] and w['p'] == VEC[name][1:]: return w
    raise KeyError((name, seed))
_cache = {}
def geometry(d):
    if d in _cache: return _cache[d]
    ms = [F.idx2poly(i, d) for i in range(q**d)]
    m0 = next(m for m in ms if F.irreducible(m))
    ns = {j: [F.idx2poly(i, j) for i in range(q**j)] for j in (0, 1, 2)}
    lin = ns[1]
    sqof = {tuple(F.pmul(l, l)): li for li, l in enumerate(lin)}
    chi3 = {j: [[(lambda c: 0 if c is None else (-1 if c & 1 else 1))(F.chi(n, m)) for m in ms] for n in ns[j]] for j in (0, 1, 2)}
    A3 = [F.idx2poly(i, 3) for i in range(q**3)]; sqf3 = [F.gphase(A, 0) is not None for A in A3]
    copA3 = [[F.res(A, m) != 0 for m in ms] for A in A3]
    _cache[d] = (ms, m0, ns, sqof, chi3, A3, sqf3, copA3); return _cache[d]
def coef(name, n, m0, phases=None, idx=None):
    """c(n) as an element of Z[zeta_6]."""
    j = len(n) - 1
    if j == 0: return (1, 0)
    if name == 'one': return (1, 0)
    if name in ('a', 'b'):
        Fp = F.idx2poly(VEC[name][2], VEC[name][1]); R = F.res(Fp, n)
        return (0, 0) if R == 0 else ((-1, 0) if (3*F.L6[R]) % 6 == 3 else (1, 0))
    if name == 'mu':
        g = F.gphase(n, 0); return (0, 0) if g is None else ((-1, 0) if (3*j + g) % 6 == 3 else (1, 0))
    if name == 'al':
        c = F.chi(n, m0); return (0, 0) if c is None else ((-1, 0) if c & 1 else (1, 0))
    return ZP[phases[j][idx]]
def supp3(name, d):
    ms, m0, ns, sqof, chi3, A3, sqf3, copA3 = geometry(d)
    if name in ('a', 'b'):
        Fp = F.idx2poly(VEC[name][2], VEC[name][1]); return [i for i in range(len(A3)) if sqf3[i] and F.res(Fp, A3[i]) != 0]
    if name == 'al': return [i for i in range(len(A3)) if sqf3[i] and F.res(A3[i], m0) != 0]
    return [i for i in range(len(A3)) if sqf3[i]]
def completed(N, d, name, S, nseed=20261119):
    """S: dict N' -> row block (from load/pick) for N' = N, N-3, ...  Returns a dict of exact integers and the row list."""
    ms, m0, ns, sqof, chi3, A3, sqf3, copA3 = geometry(d); nm = len(ms); np_ = S[N]['np']; J = N // 3
    assert J <= 2 and (N - 3*J) in S
    rnd = random.Random(nseed); phases = {1: [rnd.randrange(6) for _ in range(q)], 2: [rnd.randrange(6) for _ in range(q*q)]}
    cf = {j: [coef(name, n, m0, phases, i) for i, n in enumerate(ns[j])] for j in range(J+1)}
    V = {j: [(0, 0)]*nm for j in range(J+1)}
    for j in range(J+1):
        V[j] = []
        for mi in range(nm):
            s = (0, 0)
            for i in range(len(ns[j])):
                c = chi3[j][i][mi]
                if c: s = add(s, mul(cf[j][i], (c, 0)))
            V[j].append(s)
    Jp = [(1, 0)]
    for j in range(J): Jp.append(mul(Jp[-1], F.Jb))
    terms = {j: [mul(Jp[j], mul(V[j][mi], S[N-3*j]['rows'][mi])) for mi in range(nm)] for j in range(J+1)}
    rows = []
    for mi in range(nm):
        r = (0, 0)
        for j in range(J+1): r = add(r, terms[j][mi])
        rows.append(r)
    # diagonal
    diag = {0: S[N]['diag']}; naive = dict(diag)
    for j in range(1, J+1):
        Np = N - 3*j
        if Np == 3:
            assert j == 1; sup = supp3(name, d)
            assert np_ * sum(sum(copA3[ai]) for ai in sup) == S[3]['diag'], 'support of the N = 3 block'
            t = 0
            for i, n in enumerate(ns[1]):
                if cf[1][i] == (0, 0): continue
                t += sum(sum(1 for mi in range(nm) if copA3[ai][mi] and chi3[1][i][mi]) for ai in sup)
            diag[j] = q**j * np_ * t; naive[j] = diag[j]
        elif Np == 0:
            assert S[0]['diag'] == np_ * nm, 'diagonal of the N = 0 block'
            t = 0; tn = 0; sqsum = [(0, 0)]*nm
            for i, n in enumerate(ns[j]):
                if cf[j][i] == (0, 0): continue
                cop = [1 if chi3[j][i][mi] else 0 for mi in range(nm)]
                if j == 2 and tuple(n) in sqof:
                    tn += norm(cf[j][i]) * sum(cop)
                    sqsum = [add(sqsum[mi], cf[j][i]) if cop[mi] else sqsum[mi] for mi in range(nm)]
                else: t += sum(cop); tn += sum(cop)
            t += sum(norm(x) for x in sqsum)
            diag[j] = q**j * np_ * t; naive[j] = q**j * np_ * tn
        else: raise ValueError(Np)
    E = sum(norm(r) for r in rows); Ej = {j: sum(norm(x) for x in terms[j]) for j in terms}
    def re2(x, y):  # 2 Re(conj(x) y) as an integer: norm(x + y) - norm(x) - norm(y)
        return norm(add(x, y)) - norm(x) - norm(y)
    cross = {f'{a}{b}': sum(re2(terms[a][mi], terms[b][mi]) for mi in range(nm)) for a in terms for b in terms if a < b}
    assert E == sum(Ej.values()) + sum(cross.values())
    lin = ns[1]; issq = [tuple(m) in sqof for m in ms] if d == 2 else [False]*nm
    tot0 = (0, 0)
    for r in S[N]['rows']: tot0 = add(tot0, r)
    totc = (0, 0)
    for r in rows: totc = add(totc, r)
    return {'np': np_, 'E': E, 'D': sum(diag.values()), 'D_naive': sum(naive.values()), 'diag': diag, 'Ej': Ej, 'cross': cross,
            'E_sq_rows': sum(norm(rows[mi]) for mi in range(nm) if issq[mi]), 'E0_sq_rows': sum(norm(S[N]['rows'][mi]) for mi in range(nm) if issq[mi]),
            'J0sq_sqf': norm(tot0), 'J0sq_completed': norm(totc), 'nm': nm,
            'V2': {j: [V[j][mi] for mi in range(nm)] for j in V}, 'rows': rows}
