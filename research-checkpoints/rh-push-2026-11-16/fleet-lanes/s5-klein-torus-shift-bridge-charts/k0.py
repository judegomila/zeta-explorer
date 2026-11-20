"""Combination (3): the split K_a = K_{a,0} + D_{a,R} + K_a^(S) built from Phi, by tensor Gauss-Legendre quadrature (mpmath).

With d = z - conj(w), p = z + conj(w), tau = (u+v)/2, s = u - v, over the quadrant u, v >= 0:
  pi d K_a(z,w) = B_a(z) A_a(conj w) - A_a(z) B_a(conj w)
                = 32 int int Phi(u) Phi(v) [ sinh(4 a tau) sin(2 d tau) cos(p s) + sinh(2 a s) cos(2 p tau) sin(d s) ] du dv
  K_{a,0}  : the first term with cos(p s) replaced by 1  (a positive mixture of Paley-Wiener kernels sin(2 d tau)/(pi d))
  D_{a,R}  : the first term with cos(p s) - 1
  K_a^(S)  : the second term
(the odd-in-s parts sin(2 d tau)->cos(2 d tau) sin(p s) and sin(2 p tau) cos(d s) integrate to zero).
Check 1: K_{a,0} + D_{a,R} + K_a^(S) = [E(z) conj E(w) - E#(z) conj E#(w)] i/(2 pi d) with E(z) = Xi(z + i a) from zeta.
Check 2: the recorded certificate a = 1/4, z = (-1/2, 0, 1/2) + i/5: beta_R > 1.027286016, beta_S > 0.42200180358,
         beta = -lambda_min(G_0^{-1/2} G G_0^{-1/2})."""
import sys, json
import mpmath as mp
mp.mp.dps = 40

def Phi(u):
    s = mp.mpf(0); e4 = mp.exp(4 * u); e5 = mp.exp(5 * u); e9 = mp.exp(9 * u)
    for n in range(1, 30):
        ex = mp.pi * n * n * e4
        if ex > 200 and n > 1: break
        s += (2 * mp.pi ** 2 * n ** 4 * e9 - 3 * mp.pi * n * n * e5) * mp.exp(-ex)
    return s

def quad_nodes(U=1.15, panels=8, m=24):
    xs, ws = [], []
    base = mp.calculus.quadrature.GaussLegendre(mp.mp)
    nodes = base.calc_nodes(5, mp.mp.prec)       # degree-5 rule: 3*2^4 = 48 nodes on [-1,1]
    h = mp.mpf(U) / panels / 2
    for pnl in range(panels):
        c = (2 * pnl + 1) * h
        for x, w in nodes:
            xs.append(c + h * x); ws.append(h * w)
    return xs, ws

def channels(a, zs, U=1.15):
    xs, ws = quad_nodes(U)
    ph = [Phi(x) * w for x, w in zip(xs, ws)]
    n = len(zs); N = len(xs)
    G0 = mp.zeros(n, n); GR = mp.zeros(n, n); GS = mp.zeros(n, n)
    for i in range(n):
        for j in range(i, n):
            d = zs[i] - mp.conj(zs[j]); p = zs[i] + mp.conj(zs[j])
            k0 = mp.mpc(0); kr = mp.mpc(0); ks = mp.mpc(0)
            for iu in range(N):
                u = xs[iu]; pu = ph[iu]
                for iv in range(N):
                    v = xs[iv]; wgt = pu * ph[iv]
                    if abs(wgt) < mp.mpf(10) ** (-45): continue
                    tau = (u + v) / 2; s = u - v
                    f = mp.sinh(4 * a * tau) * mp.sin(2 * d * tau)
                    c = mp.cos(p * s)
                    k0 += wgt * f; kr += wgt * f * (c - 1)
                    ks += wgt * mp.sinh(2 * a * s) * mp.cos(2 * p * tau) * mp.sin(d * s)
            fac = 32 / (mp.pi * d)
            G0[i, j] = k0 * fac; GR[i, j] = kr * fac; GS[i, j] = ks * fac
            G0[j, i] = mp.conj(G0[i, j]); GR[j, i] = mp.conj(GR[i, j]); GS[j, i] = mp.conj(GS[i, j])
    return G0, GR, GS

def Xi(lam):
    s = mp.mpf(1) / 2 + 1j * lam
    return s * (s - 1) / 2 * mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)

def Kdirect(a, zs, norm):
    n = len(zs); K = mp.zeros(n, n)
    for i in range(n):
        for j in range(n):
            z = zs[i]; w = zs[j]
            E = lambda x: norm * Xi(x + 1j * a); Es = lambda x: norm * Xi(x - 1j * a)
            K[i, j] = (E(z) * mp.conj(E(w)) - Es(z) * mp.conj(Es(w))) * 1j / (2 * mp.pi * (z - mp.conj(w)))
    return K

def beta(G0, G):
    L = mp.cholesky(G0); Li = mp.inverse(L)
    C = Li * G * Li.H
    ev = mp.eigh(C, eigvals_only=True)
    return -min(ev), ev

if __name__ == '__main__':
    out = {}
    zs = [mp.mpc(-0.5, 0.2), mp.mpc(0, 0.2), mp.mpc(0.5, 0.2)]
    # normalisation of Xi against 8 int Phi cos(2 lam u)
    xs, ws = quad_nodes()
    X0 = 8 * sum(Phi(x) * w for x, w in zip(xs, ws)); norm = X0 / Xi(mp.mpf(0))
    out['norm_8intPhi_over_xi_half'] = mp.nstr(norm, 20)
    for a in (mp.mpf(1) / 4, mp.mpf(1) / 8, mp.mpf(1) / 2):
        G0, GR, GS = channels(a, zs)
        K = Kdirect(a, zs, norm)
        dev = max(abs((G0 + GR + GS - K)[i, j]) for i in range(3) for j in range(3)) / abs(K[1, 1])
        bR, evR = beta(G0, GR); bS, evS = beta(G0, GS); bT, evT = beta(G0, GR + GS)
        e0 = mp.eigh(G0, eigvals_only=True)
        out[mp.nstr(a, 5)] = dict(split_identity_rel_dev=mp.nstr(dev, 5), beta_R=mp.nstr(bR, 14), beta_S=mp.nstr(bS, 14),
                                  r=mp.nstr(bT, 20), one_minus_r=mp.nstr(1 - bT, 10), G0_eigs=[mp.nstr(x, 8) for x in e0],
                                  vR=mp.nstr(min(mp.eigh(GR + G0, eigvals_only=True)), 10))
        print(a, out[mp.nstr(a, 5)], flush=True)
    json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'out/k0_validation.json', 'w'), indent=1)
