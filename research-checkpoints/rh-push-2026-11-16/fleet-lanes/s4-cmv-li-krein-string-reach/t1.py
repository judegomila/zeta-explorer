import sys, time
from flint import arb, acb, ctx
import core
ctx.prec = int(sys.argv[3]) if len(sys.argv) > 3 else 3000
code = sys.argv[1]; N = int(sys.argv[2]); a = 20
t = time.time(); c = core.moments(code, a, N); print('moments', time.time() - t, 'c0', c[0].str(15), 'rad c_last', core._l2r(c[-1]))
t = time.time(); r = core.levinson(c, progress=40); print('lev', time.time() - t)
n, k, E = r[-1]; print(code, 'last n', n, 'sign E', core.sign(E), 'log2|E|', core._l2(E), 'k', k.str(8))
