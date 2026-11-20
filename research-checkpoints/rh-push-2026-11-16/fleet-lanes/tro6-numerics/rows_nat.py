#!/usr/bin/env python3
"""rows_nat.py -- rows m of the 7/8 low side with the COMPLETE sextic theta coefficient (proof note (3.9)).

For each nonzero m in O (sorted by norm, index range [i0, i1) of the list with N(m) <= Qmax):
  rho_str[sigma]  stripped class-sigma coefficient at y = -e0 m (squarefree moduli prime to 6y), X^{2/3} WLS constant
  rho_cor[sigma]  sum over powerful c1 != 1 supported on primes p | m with N(p) <= PC of
                  gt(y, c1) N(c1)^{-2/3} R(sigma c1^{-1}, c1) rho_str_{sigma c1^{-1}}(y c1^4)       (proof note (3.9))
                  rho_nat = rho_str + rho_cor   (complete w.r.t. S0 = {2, lambda}; truncation: primes N(p) > PC)
  se[sigma]       model standard error of rho_str
  B[key]          toy completed cubic rows as in tmp/sextic/conj_rows.py (psi in {alpha G, alpha, 1}, R in {1e4,1e5,1e6})
usage: rows_nat.py Qmax i0 i1 out_prefix [--selftest]
"""
import sys, os, math, time, itertools
import numpy as np
SX = 'tmp/sextic'
sys.path.insert(0, SX)
import alib as A, zomega as Z
Z6 = Z.ZETA6
PC = 300

def m4mul_tables():
    reps = Z.MOD4_REPS
    mul = np.zeros((12, 12), int)
    for i, a in enumerate(reps):
        for j, b in enumerate(reps):
            mul[i, j] = Z.mod4_index(Z.mul(a, b))
    return reps, mul

class Ctx:
    def __init__(self, Qmax):
        self.T = T = A.SFTable(SX + '/data/sf_1e7.npz')
        self.grid = A.geom_grid(1000, T.X, 90)
        self.B4 = A.Binner(T, self.grid, T.m4, 12)
        self.ne0 = Z.mul((2, 0), Z.power(Z.LAM, 5))
        self.e_ne0 = T.node_exponents(self.ne0).astype(np.int16)
        self.reps, self.m4mul = m4mul_tables()
        self.gp = [(k, (int(T.pa[k]), int(T.pb[k]))) for k in range(T.np_) if T.pq[k] <= Qmax]
        self.pobj = {}
        self.ecache = {}
    def prime(self, k):
        if k not in self.pobj:
            T = self.T
            self.pobj[k] = Z.PrimeO((int(T.pa[k]), int(T.pb[k])), int(T.pp[k]), bool(T.pinert[k]))
        return self.pobj[k]
    def eprime(self, k):
        if k not in self.ecache:
            P = self.prime(k)
            self.ecache[k] = self.T.node_exponents(P.pi).astype(np.int16)
        return self.ecache[k]
    def factor(self, m):
        x = m; a = 0
        while Z.divides(Z.LAM, x): x = Z.exact_div(x, Z.LAM); a += 1
        b = 0
        while Z.divides((2, 0), x): x = Z.exact_div(x, (-2, 0)); b += 1
        fac = []
        for k, pi in self.gp:
            if Z.norm(x) == 1: break
            e = 0
            while Z.divides(pi, x):
                x = Z.exact_div(x, pi); e += 1
            if e: fac.append((k, e))
        assert Z.norm(x) == 1, (m, x)
        return a, b, Z.unit_index(x), fac
    def gamma(self, k, j):
        """gamma_j(p) for j = 1..5: gamma_{6-j} = chi_p(-1)^j conj(gamma_j)."""
        T = self.T
        if j in (1, 2, 3): return complex(T.pg[j][k])
        P = self.prime(k)
        s = Z6[(3 * P.chi((-1, 0))) % 6] if j == 5 else 1.0     # chi_p(-1) = +-1; exponent of chi(-1) is 0 or 3
        if j == 5:
            s = Z6[P.chi((-1, 0))]
        return complex(s * np.conj(T.pg[6 - j][k]))
    def gt_pp(self, y, k, j):
        """gt(y, p^{j+1}) for j = v_p(y) >= 1, j + 1 not divisible by 6 (Lemma A.1(b))."""
        P = self.prime(k); kk = j + 1
        assert kk % 6 != 0
        yp = y
        for _ in range(j): yp = Z.exact_div(yp, P.pi)
        c = P.chi(yp); assert c is not None
        return float(P.q) ** (j / 2.0) * self.gamma(k, kk) * np.conj(Z6[(c * kk) % 6])
    def gt_c1(self, y, sub):
        """gt(y, c1), c1 = prod p^{j_p+1} over sub = [(k, j)], and the element c1; Lemma A.1(e)."""
        val = 1.0 + 0j; c1 = (1, 0); facs = []
        for k, j in sub:
            P = self.prime(k); kk = j + 1
            g = self.gt_pp(y, k, j)
            pk = Z.power(P.pi, kk)
            if facs:
                # chi_{c1}(p^kk) chi_{p^kk}(c1)
                ex = 0
                for (k2, kk2) in facs:
                    ex += kk2 * self.prime(k2).chi(pk)
                ex += kk * P.chi(c1)
                val = val * Z6[ex % 6] * g
            else:
                val = g
            c1 = Z.mul(c1, pk); facs.append((k, kk))
        return val, c1, facs
    def row(self, m):
        T = self.T
        a, b, u, fac = self.factor(m)
        y = Z.mul(self.ne0, m)
        em = T.node_exponents(m).astype(np.int16)
        ey = np.where(em < 0, -1, (em + self.e_ne0) % 6)
        ok = ey >= 0
        def fit(e):
            v6 = np.where(ok, np.conj(Z6[np.maximum(e, 0)]), 0) * T.g1
            dS, dn = self.B4.binned(v6)
            out = np.zeros(12, complex); sd = np.zeros(12)
            for s in range(12):
                c, d_, _, _ = A.fit_binned(self.grid, dS[:, s], dn[:, s], 2 / 3)
                out[s] = c; sd[s] = d_
            return out, sd
        rho_str, se = fit(ey)
        rho_cor = np.zeros(12, complex); nterms = 0
        small = [(k, j) for (k, j) in fac if T.pq[k] <= PC and (j + 1) % 6 != 0]
        for r in range(1, len(small) + 1):
            for sub in itertools.combinations(small, r):
                g, c1, facs = self.gt_c1(y, list(sub))
                e1 = np.zeros(T.n, np.int16)
                for (k, kk) in facs:
                    e1 += kk * self.eprime(k)
                eY = (ey + 4 * e1) % 6
                rs, _ = fit(eY)
                w = g * float(Z.norm(c1)) ** (-2.0 / 3.0)
                ic1 = Z.mod4_index(c1)
                for sp in range(12):                       # sp = class of c2
                    s = self.m4mul[sp, ic1]
                    rho_cor[s] += w * Z.Rrec(self.reps[sp], c1) * rs[sp]
                nterms += 1
        return dict(rho_str=rho_str, rho_cor=rho_cor, se=se, em=em, fl=(a, b, u, len(fac), max([j for _, j in fac], default=0), nterms),
                    exps=[j for _, j in fac])

def selftest(C):
    """node-level check of the complete Gauss sum formula against brute force (proof_checks.gt_vec)."""
    import proof_checks as PCk
    T = C.T; rng = np.random.default_rng(3)
    kidx = {int(T.pq[k]): k for k in range(T.np_) if not T.pinert[k]}   # one prime per norm (last wins)
    def kof(p, which=0):
        ks = [k for k in range(200) if T.pq[k] == p and not T.pinert[k]]
        return ks[which]
    worst = 0; n = 0
    cases = [([(kof(7), 1)], (1, 0)), ([(kof(7, 1), 2)], (1, 0)), ([(kof(7), 1), (kof(13), 1)], (1, 0)), ([(kof(13, 1), 1)], (0, 1)),
             ([(kof(7), 3)], (1, 1)), ([(kof(7), 4)], (1, 0)), ([(kof(7), 1), (kof(7, 1), 1)], (1, 0)), ([(kof(19), 2)], (1, 0))]
    for fac, unit in cases:
        m = unit
        for k, j in fac: m = Z.mul(m, Z.power(C.prime(k).pi, j))
        y = Z.mul(C.ne0, m)
        g, c1, facs = C.gt_c1(y, fac)
        c1f = []
        for (k, kk) in facs: c1f += [PCk.Z.PrimeO(C.prime(k).pi, C.prime(k).p, False)] * kk
        if Z.norm(c1) <= 900000:
            direct = PCk.gt_vec(y, c1f)
            worst = max(worst, abs(direct - g)); n += 1
            print(f"  gt(y,c1): N(m)={Z.norm(m)} N(c1)={Z.norm(c1)} formula {g:.6f} brute {direct:.6f}")
        # full modulus c1 c2 with c2 a small node coprime to y
        em = T.node_exponents(m).astype(np.int16); ey = np.where(em < 0, -1, (em + C.e_ne0) % 6)
        e1 = np.zeros(T.n, np.int16)
        for (k, kk) in facs: e1 += kk * C.eprime(k)
        eY = (ey + 4 * e1) % 6
        cand = np.flatnonzero((T.N > 1) & (T.N * Z.norm(c1) <= 600000) & (ey >= 0))
        for node in rng.choice(cand, size=min(4, len(cand)), replace=False) if len(cand) else []:
            # factor node
            f2 = []; nd = int(node)
            while nd > 0:
                k = int(T.last[nd]); f2.append(k); nd = int(T.parent[nd])
            if any(T.pinert[k] for k in f2): continue
            c2 = (int(T.na[node]), int(T.nb[node]))
            pipeline = g * Z.Rrec(c2, c1) * np.conj(Z6[eY[node]]) * T.g1[node]
            direct = PCk.gt_vec(y, c1f + [C.prime(k) for k in f2])
            worst = max(worst, abs(direct - pipeline)); n += 1
            print(f"  gt(y,c1c2): N(c1)={Z.norm(c1)} N(c2)={int(T.N[node])} pipeline {pipeline:.6f} brute {direct:.6f}")
    # class bookkeeping: m4mul against table m4
    print(f"selftest: {n} comparisons, max |diff| = {worst:.2e}")
    return worst

def main():
    Qmax, i0, i1, pref = int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    t0 = time.time()
    C = Ctx(Qmax); T = C.T
    if '--selftest' in sys.argv:
        selftest(C); return
    Nf = T.N.astype(float)
    alpha = ((T.na - T.nb / 2.0) + 1j * (T.nb * math.sqrt(3) / 2.0)) / np.sqrt(Nf)
    Gc = T.G()
    psis = {'aG': alpha * Gc, 'a': alpha, '1': np.ones(T.n, complex)}
    coef = {}
    for R in (10 ** 4, 10 ** 5, 10 ** 6):
        lx = np.log(Nf / R); idx = np.flatnonzero(np.abs(lx) <= 2.2)
        w = np.exp(-2 * lx[idx] ** 2) / np.sqrt(Nf[idx])
        for name, ps in psis.items():
            coef[(name, R)] = (idx, T.g2[idx] * ps[idx] * w)
    keys = list(coef.keys())
    Rr = int(math.isqrt(4 * Qmax // 3)) + 2
    ms = sorted([(a, b) for a in range(-Rr, Rr + 1) for b in range(-Rr, Rr + 1) if (a, b) != (0, 0) and Z.norm((a, b)) <= Qmax],
                key=lambda t: (Z.norm(t), t))
    i1 = min(i1, len(ms)); ms = ms[i0:i1]; n = len(ms)
    print(f"rows total range [{i0},{i1}) n={n}; setup {time.time()-t0:.1f}s", flush=True)
    rs = np.zeros((n, 12), complex); rc = np.zeros((n, 12), complex); se = np.zeros((n, 12)); Bv = np.zeros((n, len(keys)), complex)
    Nm = np.zeros(n, np.int64); fl = np.zeros((n, 6), np.int16); sqf = np.zeros(n, bool); sq = np.zeros(n, bool); six = np.zeros(n, bool)
    for i, m in enumerate(ms):
        d = C.row(m)
        rs[i] = d['rho_str']; rc[i] = d['rho_cor']; se[i] = d['se']; fl[i] = d['fl']; Nm[i] = Z.norm(m)
        ex = d['exps']; sqf[i] = all(e == 1 for e in ex); sq[i] = all(e % 2 == 0 for e in ex); six[i] = all(e % 6 == 0 for e in ex)
        em = d['em']
        for j, k in enumerate(keys):
            idx, cf = coef[k]; e = em[idx]
            Bv[i, j] = (cf * np.where(e >= 0, Z6[np.maximum(e, 0)], 0)).sum()
        if (i + 1) % 200 == 0 or i + 1 == n:
            print(f"  {i+1}/{n} (N <= {Nm[i]}), {time.time()-t0:.0f}s", flush=True)
    np.savez(pref + '.npz', ms=np.array(ms), Nm=Nm, rho_str=rs, rho_cor=rc, se=se, B=Bv, flags=fl, sqf=sqf, sq=sq, six=six,
             keys=np.array([f"{k[0]}|{k[1]}" for k in keys]))
    print(f"done {time.time()-t0:.1f}s", flush=True)

if __name__ == '__main__':
    main()
