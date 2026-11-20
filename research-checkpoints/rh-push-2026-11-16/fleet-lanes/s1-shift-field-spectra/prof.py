import time, sfs, cupy as cp, math
xp = cp
def sync(): cp.cuda.Stream.null.synchronize()
for T, K in ((1e8, 30000), (1e10, 3000), (1e10, 9000)):
    eng = sfs.ZetaRS(T, 2000.0, xp)
    eng.add_columns('ZETA:mu', sfs.mollifiers('ZETA', int(math.sqrt(T / 6.283)))['mu'])
    u = xp.arange(K) * 0.02
    for rep in range(2):
        sync(); t0 = time.time()
        t, F, dF, psis = eng.block(u); sync(); t1 = time.time()
        N = eng.nmax - 1
        P = eng.phi[None, :N] + u[:, None] * eng.logn[None, :N]; sync(); t2 = time.time()
        C = xp.cos(P); S = xp.sin(P); sync(); t3 = time.time()
        R = C @ eng.W[:N]; sync(); t4 = time.time()
        acc = sfs.Acc('ZETA', T, 0.02, 100, sfs.band_L('zeta', T))
        sfs.feed_std(acc, xp, t, F, dF, 'zeta', psis, slice(0, K)); sync(); t5 = time.time()
        acc2 = sfs.Acc('H', T, 0.02, 100, sfs.band_L('zeta', T))
        sfs.feed_heat(acc2, xp, t, F, dF, -0.5, psis, slice(0, K), 0.02); sync(); t6 = time.time()
        print(T, K, 'block %.3f  phase %.3f cos/sin %.3f matmul1 %.3f feed_std %.3f feed_heat %.3f' % (t1 - t0, t2 - t1, t3 - t2, t4 - t3, t5 - t4, t6 - t5), flush=True)
        del P, C, S, R
