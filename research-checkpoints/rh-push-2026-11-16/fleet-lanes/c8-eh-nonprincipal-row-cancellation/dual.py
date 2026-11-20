"""c8-eh-nonprincipal-row-cancellation: exact dual (Poisson) decomposition of the F_q[T] probe
J(k, N, lam; d; w) = sum_{m monic, deg d} c_k(m) R_{N,lam}(m; w)   (object of ../c7-ff-order2-vertex-exact, section 2)
into rows u (u = sixth-power-free part of the monic dual frequency), from Theorem A / Lemma R / Theorem B of
../r2-ff-tro6-complete, extended to an arbitrary weight W on squarefree A of degree N' = N + lam:

  J = omega * q^d * Gstar * [ Diag + sum_u c_u ],   omega = (-G_1 G_2 / q)^N' (unit), Gstar = G(chi_0^(k-N')) (odd case, |.|^2 = q)
                                                    or 1 (even case, 6 | k - N'),
  c_u = sum over (gamma, g, e, z1) with sixth-power-free part of z1 g^2 e^5 equal to u of
        s_gamma mu(g) mu(e) q^(gamma - deg e) wt(z1) I_W(z1 g^2 e^5; g),
  I_W(y; g) = sum_{c1 monic deg k-gamma} sum_{A' sf monic deg N'-gamma, gcd(c1, A') = 1} mu(A') W(g A') chi_{c1}(y) conj chi_{A'}(y),
  wt(z1): odd case 1 if deg z1 = r' else 0; even case -1 if deg z1 = r', q - 1 if deg z1 < r';  r' = r - 2 gamma + deg e.

All c_u are exact elements of Z[zeta_6] (int64/Python ints, 6-vectors of counts). Real numbers are evaluated from them
only for the printed ratios. Memory: tables PH[n][prime] of q^n bytes, built lazily; planned total printed at start.
"""
import numpy as np, sys, json, math, itertools
from collections import defaultdict

M64 = (1 << 64) - 1
def hash64(x):
    x = (x + 0x9e3779b97f4a7c15) & M64
    x = ((x ^ (x >> 30)) * 0xbf58476d1ce4e5b9) & M64
    x = ((x ^ (x >> 27)) * 0x94d049bb133111eb) & M64
    return x ^ (x >> 31)

class FF:
    def __init__(s, q, D):
        s.q = q; s.D = D
        g = next(g for g in range(2, q) if len({pow(g, e, q) for e in range(q - 1)}) == q - 1)
        s.L6 = np.full(q, 6, dtype=np.int8); x = 1
        for e in range(q - 1):
            s.L6[x] = e % 6; x = x * g % q
        s.LM1 = int(s.L6[q - 1])          # phase of chi_0(-1)
        s.sq = 1 if s.LM1 % 2 == 0 else -1  # chi_quad(-1) = chi_0(-1)^3
        s.s0 = 1 if s.LM1 == 0 else -1      # chi_0(-1) (it is +-1 since (-1)^2 = 1)
        s.PW = [q ** i for i in range(D + 2)]
        s.C = []
        for n in range(D + 1):
            idx = np.arange(s.PW[n], dtype=np.int64)
            M = np.empty((s.PW[n], n + 1), dtype=np.int16)
            for i in range(n): M[:, i] = (idx // s.PW[i]) % q
            M[:, n] = 1
            s.C.append(M)
        s.sieve()
        s.PHc = {}; s.tabc = {}

    def coeffs(s, n, idx):
        return [(idx // s.PW[i]) % s.q for i in range(n)] + [1]

    def mul(s, P, n):
        """indices (degree len(P)-1+n) of P * B for all monic B of degree n (P monic coefficient list)."""
        e = len(P) - 1; B = s.C[n]
        out = np.zeros(B.shape[0], dtype=np.int64)
        for t in range(e + n):              # coefficient of T^t, t < e + n
            col = np.zeros(B.shape[0], dtype=np.int64)
            for i in range(max(0, t - n), min(e, t) + 1):
                if P[i]: col += P[i] * B[:, t - i]
            out += (col % s.q) * s.PW[t]
        return out

    def sieve(s):
        q, D = s.q, s.D
        s.primes = []                       # (deg, idx, coeffs)
        s.pid = {}
        s.lpfp = [np.full(s.PW[n], -1, dtype=np.int32) for n in range(D + 1)]
        s.lpfc = [np.zeros(s.PW[n], dtype=np.int64) for n in range(D + 1)]
        s.mu = [np.zeros(s.PW[n], dtype=np.int8) for n in range(D + 1)]
        s.mu[0][0] = 1
        for n in range(1, D + 1):
            for pid, (e, pidx, P) in enumerate(s.primes):
                if 2 * e > n: break
                idxs = s.mul(P, n - e)
                new = s.lpfp[n][idxs] < 0
                ii = idxs[new]; bb = np.nonzero(new)[0]
                s.lpfp[n][ii] = pid; s.lpfc[n][ii] = bb
                s.mu[n][ii] = -s.mu[n - e][bb] * (s.lpfp[n - e][bb] != pid)
            # remaining: one prime factor of degree > n/2 times a cofactor with all factors of degree >= that; handle by
            # primes of degree e with n/2 < e < n times cofactors of degree n - e < e
            for pid, (e, pidx, P) in enumerate(s.primes):
                if 2 * e <= n: continue
                idxs = s.mul(P, n - e)
                # cofactor B of degree n-e < e: lpf(PB) is lpf(B) (already set above if B has a factor of degree <= n/2).
                new = s.lpfp[n][idxs] < 0
                ii = idxs[new]; bb = np.nonzero(new)[0]
                s.lpfp[n][ii] = pid; s.lpfc[n][ii] = bb
                s.mu[n][ii] = -s.mu[n - e][bb]
            for idx in np.nonzero(s.lpfp[n] < 0)[0]:
                pid = len(s.primes); s.primes.append((n, int(idx), s.coeffs(n, int(idx)))); s.pid[(n, int(idx))] = pid
                s.lpfp[n][idx] = pid; s.lpfc[n][idx] = 0; s.mu[n][idx] = -1
        s.nprimes_by_deg = defaultdict(list)
        for pid, (e, _, _) in enumerate(s.primes): s.nprimes_by_deg[e].append(pid)

    def factor(s, n, idx):
        f = {}
        while n > 0:
            pid = int(s.lpfp[n][idx]); f[pid] = f.get(pid, 0) + 1
            idx = int(s.lpfc[n][idx]); n -= s.primes[pid][0]
        return f

    def tab(s, pid):
        """tab[rho] = phase of chi_0(Res(P, rho)) = chi_0(Norm(rho mod P)), 6 for rho = 0."""
        if pid in s.tabc: return s.tabc[pid]
        q = s.q; e, _, P = s.primes[pid]; n = s.PW[e]
        idx = np.arange(n, dtype=np.int64)
        X = np.stack([(idx // s.PW[i]) % q for i in range(e)], axis=1).astype(np.int64)
        def mulmod(A, B):
            pr = np.zeros((n, 2 * e - 1), dtype=np.int64)
            for i in range(e):
                for j in range(e): pr[:, i + j] += A[:, i] * B[:, j]
            pr %= q
            for t in range(2 * e - 2, e - 1, -1):
                f = pr[:, t].copy()
                for j in range(e): pr[:, t - e + j] = (pr[:, t - e + j] - f * P[j]) % q
            return pr[:, :e]
        E = (n - 1) // (q - 1)
        R = np.zeros((n, e), dtype=np.int64); R[:, 0] = 1; base = X.copy()
        while E:
            if E & 1: R = mulmod(R, base)
            base = mulmod(base, base); E >>= 1
        assert not R[:, 1:].any()
        t = s.L6[R[:, 0]].copy(); t[0] = 6
        assert (t[1:] < 6).all()
        s.tabc[pid] = t; return t

    def PH(s, n, pid):
        """phase array over monic c of degree n of chi_c(P) = chi_0(Res(c, P)); 6 where P | c."""
        key = (n, pid)
        if key in s.PHc: return s.PHc[key]
        q = s.q; e, _, P = s.primes[pid]; t = s.tab(pid)
        A = s.C[n].astype(np.int64).copy()
        for i in range(n, e - 1, -1):
            f = A[:, i].copy()
            for j in range(e + 1): A[:, i - e + j] = (A[:, i - e + j] - f * P[j]) % q
        ridx = np.zeros(A.shape[0], dtype=np.int64)
        for i in range(min(e, n + 1)): ridx += A[:, i] * s.PW[i]
        ph = t[ridx].astype(np.int8)
        ok = ph < 6
        ph[ok] = (ph[ok] + s.LM1 * n * e) % 6       # Res(c,P) = (-1)^(n e) Res(P,c)
        s.PHc[key] = ph; return ph

    def phase(s, n, fac):
        """phase array (int16; >= 6 invalid) of chi_c(y), c monic of degree n, y = prod P^v (fac: pid -> v)."""
        tot = np.zeros(s.PW[n], dtype=np.int16); bad = np.zeros(s.PW[n], dtype=bool)
        for pid, v in fac.items():
            p = s.PH(n, pid); bad |= (p == 6); tot += (v % 6) * p
        tot %= 6; tot[bad] = 6
        return tot

# ---------------- weights
def base_weight(ff, name, n, seed=0):
    """w on monic polynomials of degree n (int array; only squarefree entries are used)."""
    q = ff.q
    def nu(Fidx):
        pid = ff.pid[(3, Fidx)]
        if n == 0: return np.ones(1, dtype=np.int64)
        p = ff.PH(n, pid).astype(np.int64)
        ok = p < 6
        # PH holds chi_0(Res(c, F)) = chi_0((-1)^(3n) Res(F, c)); the target is chi_0^3(Res(F, c))
        ph = (p - ff.LM1 * n * 3) % 6
        return np.where(ok, np.where(ph % 2 == 0, 1, -1), 0)
    Fa = 2; Fb = 8                         # T^3 + 2 ; T^3 + T + 1 (index = sum coef_i q^i), as in ffx: p2 = 2, 8
    if name == 'a': return nu(Fa)
    if name == 'b': return nu(Fb)
    if name == 'dh': return nu(Fa) + nu(Fb)
    if name == 't': return np.ones(ff.PW[n], dtype=np.int64)
    if name == 'mu': return ff.mu[n].astype(np.int64)
    if name == 'lnu': return ff.mu[n].astype(np.int64) * nu(Fa)
    if name in ('n1', 'n2'):
        sd = 21 if name == 'n1' else 22
        return np.array([-1 if (hash64(i * 1000003 + sd) >> 20) & 1 else 1 for i in range(ff.PW[n])], dtype=np.int64)
    if name in ('rm', 'rma', 'thin'):
        # completely multiplicative +-1: rm = random signs on primes; rma = nu_a times random signs; thin = nu_a times
        # eps, eps(P) = -1 on the first floor(q^(0.8 e)/(2e)) primes of each degree e
        sg = {}
        for e, pids in ff.nprimes_by_deg.items():
            cnt = int(q ** (0.8 * e) / (2 * e))
            for j, pid in enumerate(pids):
                if name == 'thin': sg[pid] = -1 if j < cnt else 1
                else: sg[pid] = -1 if (hash64(pid * 7919 + 77) >> 20) & 1 else 1
        w = np.ones(ff.PW[n], dtype=np.int64)
        # multiplicative by lpf recursion (all degrees up to n needed)
        cache = getattr(ff, '_mw_' + name, None)
        if cache is None:
            cache = [np.ones(1, dtype=np.int64)]; setattr(ff, '_mw_' + name, cache)
        while len(cache) <= n:
            m = len(cache); arr = np.ones(ff.PW[m], dtype=np.int64)
            sgn = np.array([sg[p] for p in range(len(ff.primes))], dtype=np.int64)
            p = ff.lpfp[m]; c = ff.lpfc[m]
            degs = np.array([ff.primes[x][0] for x in range(len(ff.primes))])
            for e in range(1, m + 1):
                sel = np.nonzero(degs[p] == e)[0]
                arr[sel] = sgn[p[sel]] * cache[m - e][c[sel]]
            cache.append(arr)
        w = cache[n]
        return w if name == 'rm' else w * nu(Fa)
    raise ValueError(name)

def row_weight(ff, name, N, lam):
    """W on monic polynomials of degree N + lam; zero off squarefree."""
    w = base_weight(ff, name, N) * (ff.mu[N] != 0)
    if lam == 0: return w
    W = np.zeros(ff.PW[N + lam], dtype=np.int64)
    for pid in ff.nprimes_by_deg[lam]:
        idxs = ff.mul(ff.primes[pid][2], N)
        np.add.at(W, idxs, w)
    return W * (ff.mu[N + lam] != 0)

# ---------------- Z[zeta_6] helpers on 6-vectors
def conv6(H, a):
    out = np.zeros(6, dtype=object)
    for s_ in range(6):
        if H[s_] == 0: continue
        for t in range(6):
            if a[t]: out[(s_ + t) % 6] += int(H[s_]) * int(a[t])
    return out
def red(v):
    """6-vector -> (x, y) with value x + y zeta_6 (zeta^2 = zeta - 1, zeta^3 = -1)."""
    v = [int(t) for t in v]
    return (v[0] - v[2] - v[3] + v[5], v[1] + v[2] - v[4] - v[5])
def n2(xy): x, y = xy; return x * x + x * y + y * y

class Pairs:
    def __init__(s, ff): s.ff = ff; s.c = {}
    def get(s, N1, j):
        key = (N1, j)
        if key not in s.c:
            ff = s.ff; hs = []; As = []; sg = []
            for h in np.nonzero(ff.mu[j])[0]:
                idxs = ff.mul(ff.coeffs(j, int(h)), N1 - j)
                ok = ff.mu[N1][idxs] != 0
                As.append(idxs[ok]); hs.append(np.full(ok.sum(), h, dtype=np.int64)); sg.append(np.full(ok.sum(), ff.mu[j][h], dtype=np.int64))
            s.c[key] = (np.concatenate(hs), np.concatenate(As), np.concatenate(sg))
        return s.c[key]

def block(ff, pairs, k, Np, d, Ws):
    """Ws: dict name -> W array on degree Np. Returns per name: dict row-label -> 6-vector, plus diag."""
    q = ff.q; r = k + Np - 1 - d; even = (k - Np) % 6 == 0
    rows = {nm: defaultdict(lambda: np.zeros(6, dtype=object)) for nm in Ws}
    diag = {nm: 0 for nm in Ws}; nfreq = 0
    for gam in range(0, min(k, Np) + 1):
        k1, N1 = k - gam, Np - gam
        sgam = (ff.sq ** ((gam * (gam - 1) // 2 + N1 * (N1 - 1) // 2) % 2)) * (ff.s0 ** ((N1 * (k1 + 1) + gam * k1) % 2))
        for g in np.nonzero(ff.mu[gam])[0]:
            g = int(g); gf = ff.factor(gam, g); gco = ff.coeffs(gam, g); mug = int(ff.mu[gam][g])
            gps = list(gf.keys())
            if k1 == 0 and N1 == 0:
                # diagonal: W(g) mu(g) q^gam sum_{e | g, deg e <= d} mu(e) q^(-deg e), kept as integer * q^(-gam) scale handled below
                for nm, W in Ws.items():
                    tot = 0
                    for sub in itertools.chain.from_iterable(itertools.combinations(gps, t) for t in range(len(gps) + 1)):
                        de = sum(ff.primes[p][0] for p in sub)
                        if de <= d: tot += (-1) ** len(sub) * q ** (gam - de)
                    diag[nm] += sgam * mug * int(W[g]) * tot
                continue
            # W(g A') for A' monic of degree N1
            gA = ff.mul(gco, N1)
            Wg = {nm: W[gA] for nm, W in Ws.items()}
            for sub in itertools.chain.from_iterable(itertools.combinations(gps, t) for t in range(len(gps) + 1)):
                de = sum(ff.primes[p][0] for p in sub)
                if de > d: continue
                rp = r - 2 * gam + de
                if rp < 0: continue
                coef0 = sgam * mug * (-1) ** len(sub) * q ** (gam - de)
                gefac = {p: 2 + (5 if p in sub else 0) for p in gps}
                for j in (range(0, rp + 1) if even else (rp,)):
                    wt = (-1 if j == rp else q - 1) if even else 1
                    for z in range(ff.PW[j]):
                        zf = ff.factor(j, z)
                        fac = dict(gefac)
                        for p, v in zf.items(): fac[p] = fac.get(p, 0) + v
                        label = tuple(sorted((p, v % 6) for p, v in fac.items() if v % 6))
                        nfreq += 1
                        # a_n(y), n = 0..k1
                        a = []
                        phn = {}
                        for n in range(0, max(k1, 0) + 1):
                            phn[n] = ff.phase(n, fac)
                            a.append(np.bincount(phn[n], minlength=7)[:6])
                        phA = phn[N1] if N1 in phn else ff.phase(N1, fac)
                        res = {nm: np.zeros(6, dtype=object) for nm in Ws}
                        for jj in range(0, min(k1, N1) + 1):
                            hs, As, sg = pairs.get(N1, jj)
                            pa = phA[As]; ok = pa < 6
                            if not ok.any(): continue
                            ph = (phn[jj][hs[ok]] - pa[ok]) % 6
                            base = sg[ok] * ff.mu[N1][As[ok]]
                            for nm in Ws:
                                H = np.bincount(ph, weights=(base * Wg[nm][As[ok]]).astype(np.float64), minlength=6)
                                H = [int(round(x)) for x in H]
                                res[nm] += conv6(H, a[k1 - jj])
                        for nm in Ws:
                            if any(res[nm]): rows[nm][label] += coef0 * wt * res[nm]
    return rows, diag, nfreq

def stats(ff, rows, diag, k, Np, d):
    q = ff.q; even = (k - Np) % 6 == 0
    def val(xy): x, y = xy; return complex(x + y / 2, y * math.sqrt(3) / 2)
    princ = red(rows.get((), np.zeros(6, dtype=object)))
    np_ = [0, 0]; T1 = 0.0; S2 = 0; U = 0; mx = 0.0
    for lab, v in rows.items():
        if lab == (): continue
        xy = red(v)
        if xy == (0, 0): continue
        U += 1; np_[0] += xy[0]; np_[1] += xy[1]; a2 = n2(xy); S2 += a2; T1 += math.sqrt(a2); mx = max(mx, math.sqrt(a2))
    tot = (princ[0] + np_[0] + diag, princ[1] + np_[1])
    J2 = q ** (2 * d) * (1 if even else q) * n2(tot)
    return dict(even=even, U=U, NP2=n2(tuple(np_)), T1=T1, S2=S2, max=mx, princ2=n2(princ), diag=diag, tot2=n2(tot), J2=str(J2))
