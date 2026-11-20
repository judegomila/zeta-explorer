"""Combination (3): r(a, T) = -lambda_min(K0^{-1/2} (D_R + K^S) K0^{-1/2}) = 1 - mu_min, mu_min the least eigenvalue of the
pencil (K_a, K_{a,0}); K_{a,0} from Phi (formula in k0.py), K_a from the values of the completed function.
Objects with an explicit Phi:  ZETA; TNR (Phi_TNR(u) = c Phi(u) + Phi(u + l/2) + Phi(u - l/2), l = log q);
DH (Phi_DH(u) = e^{3u} sum a(n) n exp(-pi n^2 e^{4u}/5)).   usage: c3r.py CODE a T0 T n bits OUT"""
import sys, json, math, time
from flint import acb, arb, ctx
import mpmath as mp
import objs, pick

def phi_zeta(u):
    u = abs(u) if isinstance(u, float) else (u if u > 0 else -u)
    e4 = (4 * u).exp(); e5 = (5 * u).exp(); e9 = (9 * u).exp(); s = arb(0); pi = arb.pi(); n = 1
    lim = ctx.prec * 0.7 + 40
    while True:
        ex = pi * n * n * e4
        if float(ex.mid()) > lim and n > 1: break
        s += (2 * pi * pi * n ** 4 * e9 - 3 * pi * n * n * e5) * (-ex).exp(); n += 1
    return s

def make_phi(code):
    if code == 'ZETA': return phi_zeta, 0.0
    if code in ('TNR', 'TNRQ'):
        q = 3 if code == 'TNR' else 1000003; l2 = arb(q).log() / 2; c = arb('2.2')
        return (lambda u: c * phi_zeta(u) + phi_zeta(u + l2) + phi_zeta(u - l2)), float(l2)
    if code == 'DH':
        k = objs.core.kappa(); co = (arb(1), k, -k, arb(-1), arb(0))
        def f(u):
            e4 = (4 * u).exp() * arb.pi() / 5; s = arb(0); n = 1; lim = ctx.prec * 0.7 + 40
            while True:
                ex = n * n * e4
                if float(ex.mid()) > lim and n > 1: break
                s += co[(n - 1) % 5] * n * (-ex).exp(); n += 1
            return s * (3 * u).exp()
        return (lambda u: f(u if u > 0 else -u)), 0.0
    raise KeyError(code)

def gl(lo, hi, panels, m):
    base = [arb.legendre_p_root(m, k, weight=True) for k in range(m)]
    h = (hi - lo) / panels / 2; xs = []; ws = []
    for p in range(panels):
        c = lo + (2 * p + 1) * h
        for x, w in base: xs.append(c + h * x); ws.append(h * w)
    return xs, ws

def main():
    code, a, T0, T, n, bits, out = sys.argv[1:8]; n = int(n); bits = int(bits); T0 = float(T0); T = float(T)
    ctx.prec = bits; t0 = time.time()
    phi, shift = make_phi(code); a_ = arb(a)
    U = math.log((bits * 0.7 + 60) / math.pi) / 4 + 0.05 + shift
    freq = 2 * (T - T0) + 4
    panels = max(8, int(U / 0.1)); m = int(max(40, bits * 0.30103 / 2.4, math.e * freq * (U / panels) / 2 * 1.5 + bits * 0.05))
    taus, wts = gl(arb(0), arb(U), panels, m)
    print('c3r %s a=%s T=[%g,%g] n=%d bits=%d: tau nodes %d (panels %d x %d), U=%.3f' % (code, a, T0, T, n, bits, len(taus), panels, m, U), flush=True)
    # evenness / positivity of Phi (checked on a grid) and normalisation 8 int Phi = X(0)
    xs, ws = gl(arb(0), arb(U), panels, 60)
    X0 = 8 * sum((phi(x) * w for x, w in zip(xs, ws)), arb(0)); o = objs.get(code)
    norm = X0 / objs.X(o, acb(0)).real
    lam = arb(3)
    chk = 8 * sum((phi(x) * w * (2 * lam * x).cos() for x, w in zip(xs, ws)), arb(0)) / (norm * objs.X(o, acb(0, 3)).real)
    phimin = min(float(phi(arb(k) * U / 400).mid()) for k in range(1, 400))
    print('norm', norm.str(12), 'transform check at lambda=3 (should be 1):', chk.str(25), 'min Phi on grid', phimin, flush=True)
    M = []
    for tau in taus:
        hi = 2 * tau if float((2 * tau).mid()) < U else arb(U)
        us, wu = gl(tau, hi, 3, 48)
        c = sum((phi(u) * phi(2 * tau - u) * w for u, w in zip(us, wu)), arb(0))
        M.append(32 * (4 * a_ * tau).sinh() * 4 * c)
    Mw = [mm * w for mm, w in zip(M, wts)]
    print('M(tau) done %.1f s; min M %.3e' % (time.time() - t0, min(float(x.mid()) for x in M)), flush=True)
    nd = pick.nodes(0.1, 0.6, T0, T, n)          # (y, t): z = t + i y
    Z = [acb(arb(t), arb(y)) for y, t in nd]
    W = [acb(arb(y), -arb(t)) for y, t in nd]    # w = -i z
    E = [norm * objs.X(o, w + a_) for w in W]; Es = [norm * objs.X(o, w - a_) for w in W]
    absS = [float((abs(Es[i]) / abs(E[i])).mid()) for i in range(n)]
    K0 = [[None] * n for _ in range(n)]; Ka = [[None] * n for _ in range(n)]
    pi = arb.pi(); I = acb(0, 1)
    for i in range(n):
        for j in range(i + 1):
            d = Z[i] - Z[j].conjugate()
            s = acb(0)
            for tk, mw in zip(taus, Mw): s += mw * (2 * d * tk).sin()
            K0[i][j] = s / (pi * d)
            Ka[i][j] = (E[i] * E[j].conjugate() - Es[i] * Es[j].conjugate()) * I / (2 * pi * d)
    print('matrices done %.1f s' % (time.time() - t0), flush=True)
    mp.mp.prec = bits
    def tomp(A):
        Mx = mp.zeros(n, n)
        for i in range(n):
            for j in range(i + 1):
                v = mp.mpc(mp.mpf(A[i][j].real.mid().str(int(bits * 0.31), radius=False)), mp.mpf(A[i][j].imag.mid().str(int(bits * 0.31), radius=False)))
                Mx[i, j] = v; Mx[j, i] = mp.conj(v)
        return Mx
    res = dict(code=code, a=a, T0=T0, T=T, n=n, bits=bits, max_abs_S=max(absS), rows=[])
    K0m = tomp(K0); Kam = tomp(Ka)
    for k in sorted(set([m_ for m_ in (4, 8, 12, 16, 24, 32, 40, 50, 64, 80, 100) if m_ <= n] + [n])):
        try:
            L = mp.cholesky(K0m[:k, :k]); Li = mp.inverse(L); C = Li * Kam[:k, :k] * Li.H
            ev = mp.eigh(C, eigvals_only=True); mu = min(ev)
            e0 = mp.eigh(K0m[:k, :k], eigvals_only=True)
            row = dict(n=k, mu_min=mp.nstr(mu, 12), r_minus_1=mp.nstr(-mu, 12), n_negative=sum(1 for e in ev if e < 0),
                       log10_K0_min_eig=float(mp.log10(min(e0))), tmax=max(t for y, t in nd[:k]))
        except Exception as ex:
            row = dict(n=k, error=repr(ex)[:200])
        res['rows'].append(row); print(row, flush=True)
        json.dump(res, open(out, 'w'), indent=1)
    print('done %.1f s' % (time.time() - t0))

if __name__ == '__main__':
    main()
