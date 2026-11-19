"""msq.py -- mean square over rows m of sextic/cubic character sums with theta (Gauss-sum) column weights.

Stand-alone (numpy + zomega.py copied from tmp/sextic). Reads a table sf_*.npz produced by tmp/sextic/build_table.py
(squarefree primary c coprime to 6 with gamma_1, gamma_2, gamma_3) as data.

For a column length D (table truncated to N(c) <= D), column weight a_c = v_c * V(N(c)/D) / sqrt(N(c)),
V(x) = sin^2(pi x) on (0, 1), and rows m in O with K < N(m) <= 2K, (m, 6) = 1:
    S_a(m) = sum_c a_c chi_c(m)^j     (j = 1 sextic symbol, j = 2 cubic symbol; zero if (c, m) != 1)
    rho_a(K, D) = mean_m |S_a(m)|^2 / sum_c |a_c|^2.
K + D law: rho <= C (1 + D/K).  (KD)^{2/3} law: rho ~ (D^2/K)^{1/3} for D <= K < D^2.
Class split: the same with c restricted to each of the 12 classes mod 4, energies added (denominator unchanged).

Usage: python msq.py table.npz D out.json [R] [seed] [exps comma list]
"""
import sys, os, json, time, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import zomega as Z

def vpow(base, exp, mod):
    base = base.astype(np.uint64) % mod; exp = exp.astype(np.uint64).copy()
    res = np.ones_like(base)
    while np.any(exp):
        odd = (exp & np.uint64(1)).astype(bool)
        res = np.where(odd, (res * base) % mod, res)
        base = (base * base) % mod
        exp >>= np.uint64(1)
    return res

class Tab:
    def __init__(self, path, D):
        d = np.load(path)
        N = d['N']; keep = N <= D
        idx = np.flatnonzero(keep); remap = np.full(len(N), -1, dtype=np.int64); remap[idx] = np.arange(len(idx))
        self.N = N[idx]; self.n = len(idx)
        par = d['parent'][idx]; self.parent = np.where(par >= 0, remap[np.maximum(par, 0)], -1)
        assert (self.parent[1:] >= 0).all()
        self.last = d['last'][idx]; self.depth = d['depth'][idx]
        self.g1 = d['g1'][idx]; self.g2 = d['g2'][idx]; self.g3 = d['g3'][idx]; self.m4 = d['m4'][idx]
        self.mu = d['mu'][idx]
        pq = d['pq']; kp = pq <= D; self.np_ = int(kp.sum())
        assert kp[:self.np_].all() and self.last.max() < self.np_
        self.pa = d['pa'][:self.np_]; self.pb = d['pb'][:self.np_]; self.pp = d['pp'][:self.np_].astype(np.int64)
        self.pq = pq[:self.np_]; self.pinert = d['pinert'][:self.np_]; self.pw = d['pw'][:self.np_]
        self.levels = [np.flatnonzero(self.depth == L) for L in range(1, int(self.depth.max()) + 1)]
        sp = ~self.pinert
        self.sp = np.flatnonzero(sp)
        self.p_s = self.pp[sp].astype(np.uint64); self.w_s = self.pw[sp].astype(np.uint64)
        self.e6 = (self.p_s - np.uint64(1)) // np.uint64(6)
        z = (np.uint64(1) + self.w_s) % self.p_s
        pw6 = [np.ones_like(z)]
        for t in range(5): pw6.append((pw6[-1] * z) % self.p_s)
        self.z6pow = pw6
        self.inert = [(int(i), Z.PrimeO((int(self.pa[i]), int(self.pb[i])), int(self.pp[i]), True)) for i in np.flatnonzero(self.pinert)]
        T = np.zeros((7, 7), dtype=np.uint8)
        for a in range(7):
            for b in range(7):
                T[a, b] = 6 if (a == 6 or b == 6) else (a + b) % 6
        self.T = T

    def chi_primes(self, m):
        """uint8 exponent of chi_pi(m) for every prime (6 if pi | m)."""
        ya, yb = int(m[0]), int(m[1])
        k = np.full(self.np_, 6, dtype=np.uint8)
        p = self.p_s
        a_red = (np.int64(ya) % p.astype(np.int64)).astype(np.uint64)
        b_red = (np.int64(yb) % p.astype(np.int64)).astype(np.uint64)
        r = (a_red + b_red * self.w_s) % p
        val = vpow(r, self.e6, p)
        ks = np.full(len(p), 6, dtype=np.uint8)
        for t in range(6):
            ks[val == self.z6pow[t]] = t
        ks[r == 0] = 6
        k[self.sp] = ks
        for i, P in self.inert:
            c = P.chi((ya, yb)); k[i] = 6 if c is None else c
        return k

    def exps(self, ms):
        """(len(ms), n) uint8 exponents of chi_c(m) (6 if not coprime)."""
        B = len(ms)
        kp = np.stack([self.chi_primes(m) for m in ms])
        e = np.zeros((B, self.n), dtype=np.uint8)
        for lev in self.levels:
            e[:, lev] = self.T[e[:, self.parent[lev]], kp[:, self.last[lev]]]
        return e

def sample_rows(K, R, rng, power=1):
    """R elements m = j^power with K < N(m) <= 2K, (m, 6) = 1; j uniform in the annulus of norms (K^(1/power), (2K)^(1/power)]."""
    lo = K ** (1.0 / power); hi = (2 * K) ** (1.0 / power)
    out = []
    # exhaustive if the annulus is small
    rad = int(math.sqrt(4 * hi / 3)) + 2
    if (2 * rad + 1) ** 2 <= 40 * R:
        for a in range(-rad, rad + 1):
            for b in range(-rad, rad + 1):
                Nn = a * a - a * b + b * b
                if lo < Nn <= hi and Nn % 2 == 1 and Nn % 3 != 0:
                    out.append((a, b))
        if len(out) > R:
            sel = rng.choice(len(out), R, replace=False); out = [out[i] for i in sel]
            exh = False
        else:
            exh = True
    else:
        exh = False
        while len(out) < R:
            a = rng.integers(-rad, rad + 1, size=4 * R); b = rng.integers(-rad, rad + 1, size=4 * R)
            Nn = a * a - a * b + b * b
            ok = (Nn > lo) & (Nn <= hi) & (Nn % 2 == 1) & (Nn % 3 != 0)
            out += list(zip(a[ok].tolist(), b[ok].tolist()))
        out = out[:R]
    ms = []
    for j in out:
        m = (1, 0)
        for _ in range(power): m = Z.mul(m, j)
        ms.append(m)
    return ms, exh

def main():
    path = sys.argv[1]; D = int(float(sys.argv[2])); outp = sys.argv[3]
    R = int(sys.argv[4]) if len(sys.argv) > 4 else 1000
    seed = int(sys.argv[5]) if len(sys.argv) > 5 else 1
    exps = [float(x) for x in sys.argv[6].split(',')] if len(sys.argv) > 6 else [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25]
    Rs = max(100, R // 5)
    nthr = int(os.environ.get('RH_WORKERS', '4'))
    t0 = time.time(); rng = np.random.default_rng(seed)
    T = Tab(path, D)
    print(f"table {path} truncated to D = {D}: nodes {T.n}, primes {T.np_}, levels {len(T.levels)}", flush=True)
    N = T.N.astype(float)
    V = np.where(N < D, np.sin(np.pi * N / D) ** 2, 0.0) / np.sqrt(N)
    # marks
    def mark_weight(P, signs=None):
        ins = ((T.pq > P) & (T.pq <= 2 * P)).astype(float)
        if signs is not None: ins = ins * signs
        cnt = np.zeros(T.n)
        for lev in T.levels:
            cnt[lev] = cnt[T.parent[lev]] + ins[T.last[lev]]
        return cnt, int((T.pq > P).sum() - (T.pq > 2 * P).sum())
    P4 = D ** 0.25; P2 = D ** 0.5 / 2
    om4, nm4 = mark_weight(P4); om2, nm2 = mark_weight(P2)
    sg = rng.choice([-1.0, 1.0], size=T.np_)
    omr, _ = mark_weight(P4, sg)
    rnd = np.exp(2j * np.pi * rng.random(T.n)); rsg = rng.choice([-1.0, 1.0], size=T.n)
    one = np.ones(T.n)
    # (name, symbol power j, vector, class split?)
    W = [('th', 1, T.g2, True), ('thc', 1, np.conj(T.g2), True), ('thm4', 1, T.g2 * om4, True), ('thm2', 1, T.g2 * om2, True),
         ('thr', 1, T.g2 * omr, False), ('s1c', 1, np.conj(T.g1), True), ('s1', 1, T.g1, False), ('one', 1, one, False),
         ('mu', 1, T.mu.astype(float), False), ('rnd', 1, rnd, True), ('rsg', 1, rsg, False),
         ('onem4', 1, om4, False), ('rsgm4', 1, rsg * om4, False),
         ('c2c', 2, np.conj(T.g2), True), ('c2', 2, T.g2, False), ('crnd', 2, rnd, False)]
    meta = {1: [], 2: []}
    for name, j, v, split in W:
        meta[j].append((name, -1))
        if split: meta[j] += [(name, s) for s in range(12)]
    print(f"planned allocation: weight matrices {sum(len(meta[j]) for j in (1, 2)) * T.n * 8 / 1e9:.2f} GB", flush=True)
    Bm = {j: np.zeros((T.n, len(meta[j])), dtype=np.complex64) for j in (1, 2)}
    pos = {1: 0, 2: 0}
    for name, j, v, split in W:
        a = (v * V).astype(np.complex64)
        Bm[j][:, pos[j]] = a; pos[j] += 1
        if split:
            for s in range(12):
                Bm[j][:, pos[j]] = np.where(T.m4 == s, a, 0); pos[j] += 1
    norms = {j: (np.abs(Bm[j]) ** 2).sum(axis=0).astype(float) for j in (1, 2)}
    nbytes = sum(Bm[j].nbytes for j in (1, 2))
    batch = max(1, min(64, int(4e8 // (T.n * 8 * 2 + 1))))
    print(f"columns: {Bm[1].shape[1]} + {Bm[2].shape[1]}; weight matrices {nbytes / 1e9:.2f} GB; batch {batch} rows "
          f"({batch * T.n * 17 / 1e9:.2f} GB phases); marks slot4 ({P4:.1f}, {2 * P4:.1f}] n = {nm4}, slot2 ({P2:.1f}, {2 * P2:.1f}] n = {nm2}", flush=True)
    Z7 = {1: np.concatenate([np.exp(1j * np.pi * np.arange(6) / 3), [0]]).astype(np.complex64),
          2: np.concatenate([np.exp(2j * np.pi * np.arange(6) / 3), [0]]).astype(np.complex64)}
    res = {'D': D, 'n_nodes': T.n, 'R': R, 'seed': seed, 'marks': {'P4': P4, 'n4': nm4, 'P2': P2, 'n2': nm2}, 'runs': []}
    fams = [('gen', 1, R), ('sq', 2, Rs), ('cube', 3, Rs), ('fourth', 4, Rs)]
    for ex in exps:
        K = float(D) ** ex
        for fam, power, Rf in fams:
            if fam != 'gen' and (K ** (1.0 / power) < 30):
                continue
            ms, exh = sample_rows(K, Rf, rng, power)
            if len(ms) == 0: continue
            acc = {j: [np.zeros(Bm[j].shape[1]), np.zeros(Bm[j].shape[1]), np.zeros(Bm[j].shape[1])] for j in (1, 2)}
            for i in range(0, len(ms), batch):
                e = T.exps(ms[i:i + batch])
                for j in (1, 2):
                    S = Z7[j][e] @ Bm[j]
                    p2 = (S.real.astype(float) ** 2 + S.imag.astype(float) ** 2)
                    acc[j][0] += p2.sum(axis=0); acc[j][1] += (p2 ** 2).sum(axis=0); acc[j][2] = np.maximum(acc[j][2], p2.max(axis=0))
            run = {'exp': ex, 'K': K, 'family': fam, 'rows': len(ms), 'exhaustive': exh, 'w': {}}
            for j in (1, 2):
                m2 = acc[j][0] / len(ms); m4 = acc[j][1] / len(ms)
                names = sorted(set(nm for nm, s in meta[j]), key=lambda x: [w[0] for w in W].index(x))
                for nm in names:
                    i0 = meta[j].index((nm, -1)); nrm = norms[j][i0]
                    d = {'norm2': nrm, 'rho': m2[i0] / nrm, 'se': math.sqrt(max(m4[i0] - m2[i0] ** 2, 0) / len(ms)) / nrm,
                         'max': acc[j][2][i0] / nrm}
                    cl = [k for k, (n2, s) in enumerate(meta[j]) if n2 == nm and s >= 0]
                    if cl:
                        d['rho_cls'] = float(m2[cl].sum() / nrm)
                    run['w'][nm] = d
            res['runs'].append(run)
            w = run['w']
            print(f"D=1e{math.log10(D):.2f} K=D^{ex:<5} {fam:6s} rows {len(ms):5d}{'*' if exh else ' '} | " +
                  ' '.join(f"{k}={w[k]['rho']:.3f}" + (f"/{w[k]['rho_cls']:.3f}" if 'rho_cls' in w[k] else '') for k in w) +
                  f" | {time.time() - t0:.0f}s", flush=True)
            json.dump(res, open(outp, 'w'))
    print(f"done {time.time() - t0:.0f}s", flush=True)

if __name__ == '__main__':
    main()
