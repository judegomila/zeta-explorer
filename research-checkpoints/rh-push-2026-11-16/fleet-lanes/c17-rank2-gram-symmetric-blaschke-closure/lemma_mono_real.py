# Lemma M premise for distinct real zeros (not covered by Theorem C of row D9): certified inertia of the derivative Gram matrices
# d/dtau_i K_T (rank-one Gram at height t_j/2) for real pairs 1/2 -+ eta and for mixed sets, n = 12 and 24. MEASURED.
import random, json
from flint import acb, ctx
import k2, search
def dgram(pts, M, T, which):
    tau = k2.tau_of(T); orbs = [k2.orbit(p, M, tau) for p in pts]; n = len(pts)
    G = [[None]*n for _ in range(n)]
    for i in range(n):
        for j in range(i, n):
            s = acb(0)
            for (a, b, c) in orbs[i]:
                for (a2, b2, c2) in orbs[j]:
                    s += c*c2.conjugate()/((a+a2.conjugate()) if which == 2 else (b+b2.conjugate()))
            G[i][j] = s; G[j][i] = s.conjugate()
        G[i][i] = acb(G[i][i].real)
    return G
tot = [0, 0, 0]; out = []
for eta in (0.01, 0.1, 0.3, 0.45):
    cfg = dict(name='rp', base='zeta', zeros=[('rp', eta)], kind='sym', order=2)
    for fam in ('low', 'realish', 'special', 'wall'):
        for n in (12, 24):
            for T in ((0, 0), (0.3, 0), (0, 1)):
                raw = search.gen_points(fam, n, cfg, random.Random(int(1000*eta) + n))
                for which in (1, 2):
                    st = None
                    for p in (256, 1024, 4096):
                        ctx.prec = p
                        pts = [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw]
                        st = k2.ldl_inertia(dgram(pts, k2.make_M(k2.M_zeta, cfg['zeros']), T, which))
                        if st[0] == 'ok': break
                    tot[0] += 1; tot[1] += (st[0] == 'ok' and st[2] == 0); tot[2] += (st[2] > 0)
                    out.append(dict(eta=eta, family=fam, n=n, T=T, d_tau=which, status=st[0], npos=st[1], nneg=st[2]))
print('derivative Gram matrices for real pairs:', tot[0], 'certified positive', tot[1], 'with a negative pivot', tot[2])
json.dump(out, open('lemma_mono_real.json', 'w'))
