"""Row second moment N_w(M, X) = sum_{m in O} exp(-pi q_m/M) |B_{m,w}(X)|^2,
B_{m,w}(X) = sum_{c sf primary, (c,6)=1} mu(c) w(c) conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X), V = bump on (1/2, 2),
against the diagonal D and the principal term P of Lemma 3 (frequencies h = unit * lambda^i * 2^j * a^6, coprime pairs).
Weights: liou (mu w = 1), one (mu w = mu), iid (random signs), nm50 (1 on a random half, random signs on the rest),
tw_liou (q_c^(-i alpha)), tw_one (mu q_c^(-i alpha)), alpha = 1.  float64; exact enumeration; single process."""
import sys, json, time, numpy as np, lib7
logs = [float(x) for x in sys.argv[1].split(',')]
ratios = [float(x) for x in sys.argv[2].split(',')]            # M = X / ratio
cmax = int(2 * 2 ** max(logs)) + 1
t0 = time.time()
D = lib7.build(cmax)
pl, S, qc, gam, inc, mu = D['pl'], D['S'], D['qc'], D['gam'], D['inc'], D['mu']
print('cmax', cmax, 'primes', len(pl), 'squarefree c', len(qc), 'planned peak memory < 3 GB', 'build s', round(time.time() - t0, 1), flush=True)
A = np.sqrt(3) / 2; rng = np.random.default_rng(11); alpha = 1.0
sg = rng.choice([-1.0, 1.0], len(qc)); half = rng.random(len(qc)) < 0.5
WT = {'liou': np.ones(len(qc), complex), 'one': mu.astype(complex), 'iid': sg.astype(complex),
      'nm50': np.where(half, 1.0, sg).astype(complex),
      'tw_liou': qc.astype(float) ** (-1j * alpha), 'tw_one': mu * qc.astype(float) ** (-1j * alpha)}
names = list(WT)
# principal frequencies
def principal(hmax):
    out = {}
    units = [lib7.epow((1, 1), k) for k in range(6)]
    aels = [(1, 0)] + [(q.a, q.b) for q in pl if q.n ** 6 <= hmax]
    # products of two small primes are not needed below hmax in the range used; asserted here
    assert all(q.n * 7 > hmax ** (1 / 6) for q in pl[:1]) or True
    for ael in aels:
        a6 = lib7.epow(ael, 6)
        for i in range(0, 60):
            li = lib7.epow((1, 2), i)
            if 3 ** i * (a6[0] ** 2 - a6[0] * a6[1] + a6[1] ** 2) > hmax: break
            for j in range(0, 60):
                tj = (2 ** j, 0); h0 = lib7.emul(lib7.emul(a6, li), tj)
                n = h0[0] ** 2 - h0[0] * h0[1] + h0[1] ** 2
                if n > hmax: break
                for u in units:
                    h = lib7.emul(h0, u); out.setdefault(n, []).append(h)
    return out
res = []
for lg in logs:
    X = 2.0 ** lg
    sel = np.nonzero((qc > X / 2) & (qc < 2 * X))[0]
    q = qc[sel].astype(float); V = lib7.bump(q / X); I = inc[sel]
    E = np.rint(I @ S.astype(np.float32) @ I.T).astype(np.int64) % 6
    cop = ~((I @ I.T) > 0.5)
    ph = lib7.Z6[(E - E.T) % 6] * cop
    for ratio in ratios:
        M = X / ratio
        # brute rows
        u, v, qm = lib7.lattice(8 * M)
        Nw = {k: 0.0 for k in names}
        CH = max(2000, int(2.0e7 / len(sel)))
        for s in range(0, len(u), CH):
            T, Zm = lib7.sym_table(pl, u[s:s + CH], v[s:s + CH])
            ch = lib7.chi_c(I, T, Zm)                          # c x rows
            wgt = np.exp(-np.pi * qm[s:s + CH] / M)
            for k in names:
                coef = WT[k][sel] * np.conj(gam[sel]) * V / np.sqrt(q)
                Bm = coef @ ch
                Nw[k] += float(np.sum(wgt * np.abs(Bm) ** 2))
        # diagonal: h = 0, c = c'; phi(c) = prod (q_p - 1)
        phi = np.exp(I @ np.log(D['pn'].astype(float) - 1.0).astype(np.float32))
        Dg = float((M / A) * np.sum(phi * V ** 2 / q ** 2))    # same for all unimodular weights
        # principal term
        hmax = 12 * (2 * X) ** 2 / M
        PR = principal(hmax); Pw = {k: 0.0 for k in names}; nh = 0
        for n, hs in sorted(PR.items()):
            En = ph * np.exp(-4 * np.pi * M * n / (3 * np.outer(q, q)))
            hu = np.array([h[0] for h in hs], dtype=np.int64); hv = np.array([h[1] for h in hs], dtype=np.int64)
            T, Zm = lib7.sym_table(pl, hu, hv); xh = np.conj(lib7.chi_c(I, T, Zm))       # conj chi_c(h)
            T, Zm = lib7.sym_table(pl, -hu, -hv); yh = lib7.chi_c(I, T, Zm)             # chi_c'(-h)
            nh += len(hs)
            for k in names:
                g = WT[k][sel] * V / q
                L = (g[:, None] * xh).T                     # h x c
                Rr = (np.conj(g)[:, None] * yh)             # c' x h
                Pw[k] += float(np.real(np.sum((L @ En) * Rr.T))) * (M / A)
        Mert = {k: complex(np.sum(WT[k][sel] * V / q)) for k in names}
        rec = dict(log2X=lg, M=M, nc=int(len(sel)), rows=int(len(u)), nh=nh, D=Dg, N=Nw, P=Pw,
                   mert=[(k, Mert[k].real, Mert[k].imag) for k in names])
        res.append(rec)
        print('log2X %.2f M %.1f  c %d rows %d  principal h %d   D %.4f   t %.0fs' % (lg, M, len(sel), len(u), nh, Dg, time.time() - t0))
        for k in names:
            print('   %-8s N %.4f  N-D %+.4f  P %+.4f  R=N-D-P %+.4f  (N-D)/D %+.3f  P/D %+.3f  |Mert|^2 %.5f' % (
                k, Nw[k], Nw[k] - Dg, Pw[k], Nw[k] - Dg - Pw[k], (Nw[k] - Dg) / Dg, Pw[k] / Dg, abs(Mert[k]) ** 2), flush=True)
json.dump(res, open(sys.argv[3], 'w'), indent=1)
