#!/usr/bin/env python3
"""Jensen polynomials of the Davenport-Heilbronn Xi at large degree: track the root pair attached to the off-line
zero 0.8085171825 + 85.6993484854 i and certify non-hyperbolicity.

  python jensen_track.py <K> <out.jsonl> [shifts, comma list]

Coefficients.  X_DH(z) = 2 int_0^oo Phi(u) cos(zu) du,  Phi(u) = sum_n a_n 2n e^{3u/2} exp(-pi n^2 e^{2u}/5),
m_k = 2 int_0^oo Phi u^{2k} du,  gamma(k) = k! m_k / (2k)!,  J^{d,n}(X) = sum_j C(d,j) gamma(n+j) X^j;
J^{d,n} hyperbolic for all d,n iff all zeros of X_DH are real (false).  The zero rho = 1/2 + b + i g of the DH
function gives the zero w = (b + i g)^2 of F(w) = sum gamma(k) w^k / k!, and J^{d,0}(X/d) -> F(X).

Rigour.  m_k for k <= K (K <= 3000) are Arb enclosures: certified quadrature (acb.integral) of the 40-term kernel
on [0,6], plus explicit radii for u > 6 (<= 4 e^9 6^{2k} exp(-pi e^{12}/5)) and for the terms n > 40 (<= e^{-634},
valid for k <= 3000).  For k > K: m_k <= 2.66 tau^{2k} e^{-2k} Gamma(3/4 + k/tau) (5/pi)^{3/4 + k/tau} for every
tau > 0 (from |Phi| <= 2.66 e^{3u/2} exp(-pi e^{2u}/5) and u <= tau e^{u/tau - 1}).
Certificate at (d,n): interval Newton.  X0 = approximate root, B = disc(X0, R).  With rigorous enclosures of
J(X0), J'(X0) and S2 >= sup_B |J''|:  |J(X0)| / (|J'(X0)| - R S2) < R  and  R < |Im X0|  imply a root of J^{d,n}
in B, hence a non-real root: verdict FAIL (certified).  The tracking itself (which d is the FIRST failing one)
is a search and is not certified: the real side of the threshold is reported as 'root pair real (not certified)'.
"""
import json, math, os, sys, time
import multiprocessing as mp
from flint import arb, acb, ctx
import lylib as L

PREC = 1000
NK = 40
B0, G0 = '0.8085171825', '85.6993484854'


def _kern_setup():
    pi = arb.pi()
    cs = [(L.coef('dh', n), n) for n in range(1, NK + 1)]
    return pi, [(c, n) for c, n in cs if not c.is_zero()]


def moment(k):
    ctx.prec = PREC
    pi, cs = _kern_setup()

    def f(u, _):
        e2 = (2 * u).exp()
        e32 = (u * 3 / 2).exp()
        r = acb(0)
        for c, n in cs:
            r += c * 2 * n * e32 * (-pi * n * n / 5 * e2).exp()
        return 2 * r * u ** (2 * k)
    v = acb.integral(f, 0, 6, rel_tol=arb(2) ** (-PREC + 60)).real
    tail_u = 2 * 4 * arb(9).exp() * arb(6) ** (2 * k) * (-(pi * arb(12).exp()) / 5).exp()
    tail_n = 2 * arb(-634).exp()
    v = v + arb(0, 1) * (tail_u + tail_n)
    return k, v.mid().str(260, radius=False), v.rad().str(10, radius=False)


def mbound_log(k):
    """log of an upper bound for m_k (arb), minimised over a few tau."""
    best = None
    for tau in (2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0):
        t = arb(tau)
        a = arb(3) / 4 + arb(k) / t
        v = arb('2.66').log() + 2 * k * t.log() - 2 * k + a.lgamma() + a * (arb(5) / arb.pi()).log()
        if best is None or v < best:
            best = v
    return best


class Jen:
    def __init__(self, m, K):
        self.K = K
        self.lg = []                                         # gamma(k) = k! m_k/(2k)!
        r = arb(1)
        self.g = []
        for k in range(K + 1):
            if k > 0:
                r = r * k / ((2 * k) * (2 * k - 1))
            self.g.append(m[k] * r)

    def coeffs(self, d, n):
        J = min(d, self.K - n)
        A = [self.g[n]]
        c = arb(1)
        for j in range(1, J + 1):
            c = c * (d - j + 1) / j
            A.append(c * self.g[n + j])
        return A

    @staticmethod
    def ev(A, X, nder=1):
        """value and derivatives (not divided by factorials) at acb X by direct summation."""
        J = len(A) - 1
        p = acb(1)
        pw = [p]
        for j in range(1, J + 1):
            p = p * X
            pw.append(p)
        out = []
        for r in range(nder + 1):
            s = acb(0)
            for j in range(r, J + 1):
                f = 1
                for i in range(r):
                    f *= (j - i)
                s += A[j] * f * pw[j - r]
            out.append(s)
        return out

    def newton(self, d, n, X, iters=80):
        A = self.coeffs(d, n)
        for it in range(iters):
            v, dv = self.ev(A, X)
            step = acb(v.real.mid(), v.imag.mid()) / acb(dv.real.mid(), dv.imag.mid())
            X = acb((X - step).real.mid(), (X - step).imag.mid())
            if abs(step) < abs(X) * arb(2) ** (-400):
                return X, True, it
        return X, False, iters

    def tail_terms(self, d, n, rho, r):
        """upper bound (arb) of sum_{j>J} j(j-1)..(j-r+1) C(d,j) gamma(n+j) rho^j-r  via the moment bound."""
        J = min(d, self.K - n)
        if J >= d:
            return arb(0)
        tot = arb(0)
        lrho = arb(rho).log()
        lc = arb(0)                                          # log C(d,j)
        for j in range(1, d + 1):
            lc = lc + arb(d - j + 1).log() - arb(j).log()
            if j <= J:
                continue
            k = n + j
            lgam = arb(k + 1).lgamma() - arb(2 * k + 1).lgamma() + mbound_log(k)
            f = arb(1)
            for i in range(r):
                f *= (j - i)
            tot += f * (lc + lgam + (j - r) * lrho).exp()
            if d > 200000 and j > J + 50 and (lc + lgam + (j - r) * lrho) < -20000 and j > 3 * J:
                # remaining terms: ratio check (decreasing geometric); add a crude geometric majorant
                tot += (lc + lgam + (j - r) * lrho).exp() * (d - j)
                # only for d > 200000 (start of the tracking, never used for a reported certificate)
                break
        return tot

    def certify(self, d, n, X0):
        A = self.coeffs(d, n)
        v, dv = self.ev(A, X0)
        a0 = abs(X0)
        t0 = self.tail_terms(d, n, a0.upper() if hasattr(a0, 'upper') else a0, 0)
        t1 = self.tail_terms(d, n, a0, 1)
        absv = abs(v) + t0
        R = absv * 1024 / abs(dv)
        R = arb(R.upper()) if hasattr(R, 'upper') else R
        rho = a0 + R
        # S2 >= sup_B |J''|
        J = len(A) - 1
        S2 = arb(0)
        p = arb(1)
        for j in range(2, J + 1):
            S2 += abs(A[j]) * j * (j - 1) * p
            p = p * rho
        S2 += self.tail_terms(d, n, rho, 2)
        low = abs(dv) - t1 - R * S2
        ok1 = bool(low > 0) and bool(absv / low < R)
        ok2 = bool(R < abs(X0.imag))
        return dict(ok=bool(ok1 and ok2), R=R.str(8), absJ=absv.str(8), absJp=abs(dv).str(8), tail0=t0.str(6),
                    imX=X0.imag.str(20), reX=X0.real.str(20), Jterms=J)


def main():
    K = int(sys.argv[1])
    out = sys.argv[2]
    shifts = [int(x) for x in (sys.argv[3] if len(sys.argv) > 3 else '0').split(',')]
    assert K <= 3000
    W = int(os.environ.get('RH_WORKERS', '4'))
    cache = out + '.moments.%d.json' % K
    t0 = time.time()
    if os.path.exists(cache):
        mm = json.load(open(cache))
    else:
        print('[moments] K=%d workers=%d, planned memory < 1 GB total' % (K, W), flush=True)
        with mp.get_context('fork').Pool(W) as pool:
            mm = sorted(pool.imap_unordered(moment, range(K + 1), chunksize=4))
        json.dump(mm, open(cache, 'w'))
    ctx.prec = PREC
    m = [arb(a, b) for _, a, b in mm]
    print('[moments] done %.0fs; m_0=%s m_K relrad=2^%.0f' % (time.time() - t0, m[0].str(20),
          float((m[K].rad() / abs(m[K].mid())).log()) / math.log(2)), flush=True)
    Jn = Jen(m, K)
    f = open(out, 'a')

    def rec(**kw):
        f.write(json.dumps(kw) + '\n')
        f.flush()
        print(json.dumps(kw)[:300], flush=True)

    b, g = arb(B0) - arb(1) / 2, arb(G0)
    w = acb(b, g) ** 2
    d0 = 10 ** 7
    X = w / d0
    Xn = {}
    for n in range(0, max(shifts) + 1):                      # continuation in the shift at d0
        X, conv, it = Jn.newton(d0, n, X)
        Xn[n] = X
        if n in shifts:
            rec(kind='start', n=n, d=d0, conv=conv, reX=X.real.str(20), imX=X.imag.str(20),
                dX_over_w=(X * d0 / w).real.str(12))
    for n in shifts:
        X, d = Xn[n], d0
        path = []
        hi = (d, X)
        lo = None
        while d > 2:
            d2 = max(2, int(d * 0.93))
            X2, conv, it = Jn.newton(d2, n, X * d / d2)
            isreal = bool(abs(X2.imag) < abs(X2) * arb(2) ** (-350))
            path.append([d2, float(X2.real.mid()) * d2, float(X2.imag.mid()) * d2, conv])
            if not conv or isreal:
                lo = d2
                break
            d, X = d2, X2
            hi = (d, X)
        rec(kind='path', n=n, path=path)
        if lo is None:
            rec(kind='threshold', n=n, note='pair still complex at d=2')
            continue
        dh, Xh = hi
        while dh - lo > 1:                                   # bisection: last d with a real pair / first complex
            mid = (dh + lo) // 2
            Xm, conv, it = Jn.newton(mid, n, Xh * dh / mid)
            if conv and not bool(abs(Xm.imag) < abs(Xm) * arb(2) ** (-350)):
                dh, Xh = mid, Xm
            else:
                lo = mid
        rec(kind='threshold', n=n, first_complex_d=dh, last_real_d=lo, reX=Xh.real.str(25), imX=Xh.imag.str(25))
        for dc in sorted(set([dh, dh + 1, dh + 10, int(dh * 1.01) + 1, int(dh * 1.1) + 1, 2 * dh])):
            if dc > 200000:
                continue
            Xc, conv, it = Jn.newton(dc, n, Xh * dh / dc)
            t1 = time.time()
            try:
                c = Jn.certify(dc, n, Xc)
            except Exception as e:                           # noqa
                c = dict(ok=False, why=repr(e))
            rec(kind='certificate', n=n, d=dc, newton_conv=conv, verdict=('FAIL' if c.get('ok') else 'NOT_CERTIFIED'),
                seconds=round(time.time() - t1, 1), **c)
    rec(kind='done', seconds=round(time.time() - t0, 1))


if __name__ == '__main__':
    main()
