import numpy as np, gram as Gm, gramcpu as Gc, os, tempfile
if __name__ == '__main__':
    N = 120; names = list(Gm.VECS)
    Gs = Gm.periodic_gram(N, names, 0.5)
    d = tempfile.mkdtemp(); f = Gc.periodic_gram_cpu(N, names, d)
    print('periodic cpu vs reference max diff', max(np.abs(np.load(f[v]) - Gs[v]).max() for v in names))
    print('zeta cpu vs reference max diff', np.abs(Gc.zeta_gram_cpu(N) - Gm.zeta_gram(N)).max())
    r = Gm.ladder(Gm.zeta_gram(250), Gm.zeta_target(250), [250], 'ZETA')
