# Combination 1 (screen, float64): norm of (Vf)(t) = int_0^t Phi(t)Phi(s) sinh(a(t-s)) f(s) ds on L^2(0, U_F)
# by Nystrom on composite Gauss-Legendre nodes; top singular value by power iteration on the GPU (cupy) or numpy.
# Kernel values come from slib (ball arithmetic at 96 bits, converted to log|K| and sign).
# usage: python c1_gpu.py out.json NMAX [keys]
import sys, os, json, math, time
import numpy as np
from flint import arb, ctx
import slib, keys as KK

try:
    import cupy as xp
    xp.get_default_memory_pool().set_limit(size=24*1024**3)
    GPU = True
except Exception as e:                                   # numpy fallback
    xp = np; GPU = False

AGRID = sorted(set([1e-3, 3e-3, 1e-2, 3e-2, 0.1, 0.2, 0.5] + [float(x) for x in range(1, 61)]))
AEXP = [0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 30.0, 40.0, 60.0]


def nodes(key, n):
    """composite GL nodes (float64), weights, log|K|, sign(K) on the window of key; about n nodes."""
    fn, panels, note = slib.kernel_spec(key)
    m = max(4, n//len(panels))
    x, w = np.polynomial.legendre.leggauss(m)
    T = np.concatenate([0.5*(hi - lo)*x + 0.5*(hi + lo) for lo, hi in panels])
    W = np.concatenate([0.5*(hi - lo)*w for lo, hi in panels])
    slib.setprec(96)
    if fn is None:
        K = slib.conv_table(float(key[4:]), [arb(float(t)) for t in T], 22)
    else:
        K = [fn(arb(float(t))) for t in T]
    lk = np.array([slib.log10abs(k)*math.log(10) if k.mid() != 0 else -1e300 for k in K])
    sg = np.array([float(slib.sgn(k.mid())) for k in K])
    return T, W, lk, sg


class Op:
    def __init__(self, key, n):
        self.T, self.W, self.lk, self.sg = nodes(key, n)
        self.n = len(self.T)
        if self.n*self.n*8*5 > 22*1024**3:
            raise MemoryError('planned %d GB' % (self.n*self.n*8*5 >> 30))
        t = xp.asarray(self.T)
        self.D = t[:, None] - t[None, :]                       # n^2 * 8 bytes
        self.dmax = float(self.T.max() - self.T.min())
        self.row = xp.asarray(self.lk + 0.5*np.log(self.W)); self.sgx = xp.asarray(self.sg)
        self.mask = xp.triu(xp.full((self.n, self.n), -xp.inf))

    def matrix(self, a):
        """returns (M, shift): M e^{shift} has entries K_i K_j sinh(a(t_i-t_j)) sqrt(w_i w_j), j < i."""
        M = a*self.D
        M += self.row[:, None]; M += self.row[None, :]
        M += self.mask                                         # -inf on and above the diagonal
        shift = float(M.max())
        M -= shift
        xp.exp(M, out=M)
        E = xp.exp(-2*a*xp.abs(self.D))                        # third n^2 array
        E = 0.5*(1 - E)
        M *= E
        del E
        M *= self.sgx[:, None]; M *= self.sgx[None, :]
        return M, shift

    def lognorm(self, a, full=False):
        M, shift = self.matrix(a)
        fro = float(xp.linalg.norm(M))
        if fro == 0.0:
            return None
        v = xp.ones(self.n)/math.sqrt(self.n)
        s_old = 0.0
        for it in range(3000):
            u = M @ v
            v = M.T @ u
            nv = float(xp.linalg.norm(v))
            if nv == 0: break
            v /= nv
            s = math.sqrt(nv)                                   # sigma^2 = |M^T M v| at convergence
            if it > 5 and abs(s - s_old) <= 2e-15*s:
                break
            s_old = s
        s = float(xp.linalg.norm(M @ v))
        out = {'lognorm': math.log(s) + shift, 'logG': math.log(fro) + shift, 'ratio_norm_G': s/fro, 'iters': it}
        if full:
            sv = xp.linalg.svd(M, compute_uv=False)
            sv = xp.asnumpy(sv) if GPU else sv
            out['sv_top5_rel'] = [float(z/sv[0]) for z in sv[:5]]
        del M
        return out


def astar(op, lo=1e-4, hi=400.0, steps=44, bracket=None):
    f = lambda a: op.lognorm(a)['lognorm']
    if bracket: lo, hi = bracket
    flo, fhi = f(lo), f(hi)
    if not (flo < 0 < fhi):
        return None
    for _ in range(steps):
        mid = 0.5*(lo + hi)
        if f(mid) < 0: lo = mid
        else: hi = mid
        if hi - lo < 1e-11*hi: break
    return 0.5*(lo + hi)


def run(key, nmax):
    t0 = time.time()
    rec = {'key': key, 'gpu': GPU, 'sizes': {}}
    sizes = [n for n in (1024, 2048, 4096, 8192, 16384) if n <= nmax]
    a_prev = None
    for n in sizes:
        op = Op(key, n)
        if a_prev is None:
            a_s = astar(op)
        else:
            a_s = astar(op, bracket=(a_prev*(1 - 3e-3), a_prev*(1 + 3e-3)), steps=30) or astar(op)
        r = {'n': op.n, 'window': [float(op.T.min()), float(op.T.max())], 'a_star': a_s}
        if a_s:
            r['at_a_star'] = op.lognorm(a_s)
        if n == sizes[-1] or n == 4096:
            r['grid'] = {repr(a): op.lognorm(a) for a in AGRID}
            r['exponent'] = {}
            for a in AEXP:
                h = 1e-3*a
                r['exponent'][repr(a)] = (op.lognorm(a + h)['lognorm'] - op.lognorm(a - h)['lognorm'])/(2*h)
        if n == 2048:
            r['full_svd'] = {repr(a): op.lognorm(a, full=True).get('sv_top5_rel') for a in (0.01, 1.0, 10.0, 30.0)}
        a_prev = a_s or a_prev
        rec['sizes'][n] = r
        del op
        if GPU: xp.get_default_memory_pool().free_all_blocks()
        sys.stderr.write('%s n=%d a*=%s  %.0fs\n' % (key, n, a_s, time.time() - t0)); sys.stderr.flush()
    rec['sec'] = time.time() - t0
    return rec


def unimodular_check(n=600):
    """V for the complex kernel Phi(u) e^{2iu} (both conventions) against zeta's, numpy."""
    T, W, lk, sg = nodes('zeta', n)
    K = np.exp(lk)*sg; a = 5.0
    D = T[:, None] - T[None, :]
    base = np.tril(np.sinh(a*D), -1)*np.sqrt(W)[:, None]*np.sqrt(W)[None, :]
    s0 = np.linalg.svd(base*K[:, None]*K[None, :], compute_uv=False)[0]
    Kc = K*np.exp(2j*T)
    s1 = np.linalg.svd(base*Kc[:, None]*np.conj(Kc)[None, :], compute_uv=False)[0]
    s2 = np.linalg.svd(base*Kc[:, None]*Kc[None, :], compute_uv=False)[0]
    return {'zeta': float(s0), 'twist_conj': float(s1), 'twist_bilinear': float(s2)}


if __name__ == '__main__':
    out = sys.argv[1]; nmax = int(sys.argv[2])
    ks = sys.argv[3].split(';') if len(sys.argv) > 3 else KK.MAIN
    print('GPU', GPU, 'planned largest allocation: 5 arrays of n^2 doubles = %.1f GB at n = %d' % (5*nmax*nmax*8/2**30, nmax)); sys.stdout.flush()
    res = {'unimodular': unimodular_check(), 'recs': []}
    for k in ks:
        try:
            res['recs'].append(run(k, nmax))
        except Exception as e:
            res['recs'].append({'key': k, 'error': repr(e)})
        json.dump(res, open(out, 'w'))
    print('wrote', out)
