# selftest.py: code controls K1..K4. usage: python selftest.py K1 | K2 k2.bin GAMMA | K3 mom_1e6.bin | K4
import sys, math, json, time
import numpy as np
from flint import arb, acb, arb_mat, ctx
import tz
ctx.prec = 128


def gram(al, be, U):
    d = be - np.conj(al)
    if abs(d) < 1e-14:
        return U + 0j
    return (np.exp(1j * d * U) - 1) / (1j * d)


def k1_case(u, alpha, M, m=96, augmented=True, x_off=0.3, steps=34):
    """largest b with (alpha + 2M) Gram + pair form >= 0 on span(lattice modes [+ v_z, v_conj z])."""
    D = 2 * math.pi / u
    U = arb(u)
    tau = [(j - (m - 1) / 2) * D for j in range(m)]

    def gram_b(al, be):
        d = acb(be) - acb(al).conjugate()
        if abs(complex(float(d.real.mid()), float(d.imag.mid()))) < 1e-14:
            return acb(U)
        return ((acb(0, 1) * d * U).exp() - 1) / (acb(0, 1) * d)

    def psd(b):
        z = acb(x_off * D, b)
        zb = acb(x_off * D, -b)
        if not augmented:
            gz = np.array([gram(t, x_off * D + 1j * b, u) for t in tau])
            gzb = np.array([gram(t, x_off * D - 1j * b, u) for t in tau])
            T = np.outer(gz, np.conj(gzb)) + np.outer(gzb, np.conj(gz))
            return np.linalg.eigvalsh(T.real / u)[0] + alpha + 2 * M >= 0
        vecs = [acb(t) for t in tau] + [z, zb]
        n = len(vecs)
        Gr = [[gram_b(a, c) for c in vecs] for a in vecs]
        gz = [gram_b(a, z) for a in vecs]
        gzb = [gram_b(a, zb) for a in vecs]
        R = arb_mat(2 * n, 2 * n)
        for i in range(n):
            for j in range(n):
                e = (alpha + 2 * M) * Gr[i][j] + gz[i] * gzb[j].conjugate() + gzb[i] * gz[j].conjugate()
                R[i, j] = e.real
                R[n + i, n + j] = e.real
                R[i, n + j] = -e.imag
                R[n + i, j] = e.imag
        return tz.ldl_psd(R)
    lo, hi = 1e-4, 1.5
    for _ in range(steps):
        mid = (lo + hi) / 2
        if psd(mid):
            lo = mid
        else:
            hi = mid
    return lo


def K1():
    T = 1e6
    Lg = math.log(T / (2 * math.pi))
    u1 = 0.5 * math.log(T)
    u2 = 2 * math.log(T)
    a = k1_case(u1, Lg, 0)
    b = k1_case(u2, 0.0, 1)
    print("K1 augmented: theta=1/2, M=0, tight background Lg: threshold %.6f (c17 table: 0.3901)" % a)
    print("K1 augmented: theta=2, M=1, no background: threshold %.6f (c17 table: 0.0236)" % b)
    for m in (96,):
        print("K1 lattice span only, m=%d: theta=1/2: %.6f ; theta=2: %.6f" % (m, k1_case(u1, Lg, 0, m=m, augmented=False), k1_case(u2, 0.0, 1, m=m, augmented=False)))
    # the rank-one code path of tz.py against the numpy pair matrix on the lattice span
    m = 96
    D = 2 * math.pi / u1
    z = 0.3 * D + 0.2j
    tau = [(j - (m - 1) / 2) * D for j in range(m)]
    gz = np.array([gram(t, z, u1) for t in tau])
    gzb = np.array([gram(t, np.conj(z), u1) for t in tau])
    Tn = (np.outer(gz, np.conj(gzb)) + np.outer(gzb, np.conj(gz))) / u1
    A = tz.rank_terms(0, arb(u1), m, [(acb(z.real, z.imag), 1), (acb(z.real, -z.imag), 1)])
    print("K1 rank-one path against numpy pair matrix: max abs difference %.3e (max entry %.3e)" % (np.max(np.abs(tz.to_np(A) - Tn.real)), np.max(np.abs(Tn))))
    ok = abs(a - 0.3901) < 6e-5 and abs(b - 0.0236) < 6e-5
    print("K1", "PASS" if ok else "FAIL")


def K2(path, GAM):
    F = tz.Moments(path)
    T0 = F.T0
    m = 96
    res = []
    for Xb in F.XB:
        u = math.log(Xb) if Xb == int(T0) else None
    for th in (1.0, 0.55):
        Xb = int(round(T0)) if th == 1.0 else int(math.floor(T0 ** th))
        u = th * math.log(T0)
        U = arb(th) * arb(T0).log()
        cb = int(math.floor(math.log(float(Xb)) * 512.0))
        Mc = np.zeros((cb + 1, F.Q), dtype=np.complex128)
        F.add_cells(Mc, 0, 0, cb)
        e = F.EX[F.XB.index(Xb), 0, 0]
        Mc[cb] = e[..., 0] + 1j * e[..., 1]
        ac = (np.arange(cb + 1) + 0.5) / 512.0
        D_ = 2 * math.pi / u
        y = (np.arange(m) - (m - 1) / 2) * D_
        d0, d1 = tz.Moments.eval(Mc, ac, y)
        tau, Darb = tz.nodes(T0, U, m)
        rad = 2e-11 * float(F.SABS[0])
        bl = lambda v, r: [acb(arb(float(x.real), r), arb(float(x.imag), r)) for x in v]
        A = tz.add(tz.arch(T0, U, m, [arb(1) / 4], -arb.pi().log()),
                   tz.rank_terms(T0, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)]),
                   tz.loewner(m, Darb, U, bl(d0, rad), bl(d1, rad * (u + 1)), -1))
        P = tz.to_np(A)
        # zero side
        t0 = time.time()
        nz = int(arb(GAM).zeta_nzeros().unique_fmpz()) if hasattr(arb, "zeta_nzeros") else None
        zs = acb.zeta_zeros(1, nz)
        gam = np.array([float(zz.imag.mid()) for zz in zs])
        tj = T0 + y
        Z = np.zeros((m, m))
        for sgn in (1.0, -1.0):
            gg = sgn * gam
            N = 2 - 2 * np.cos((tj[0] - gg) * u)
            W = 1.0 / (tj[:, None] - gg[None, :])
            Z += (W * N) @ W.T
        # smooth tail beyond GAM (both signs), N averaged to 2
        xg, wg = np.polynomial.legendre.leggauss(400)
        x = (xg + 1) / 2
        w = wg / 2
        gq = GAM / (1 - x)
        jac = GAM / (1 - x) ** 2
        dens = np.log(gq / (2 * math.pi)) / (2 * math.pi)
        for sgn in (1.0, -1.0):
            Wq = 1.0 / (gq[None, :] - sgn * tj[:, None])
            Z += (Wq * (w * jac * dens * 2)) @ Wq.T
        Z /= u
        diff = np.max(np.abs(P - Z))
        print("K2 theta=%.2f T0=%g X=%d zeros below %g: %d ; max abs entry difference %.3e ; diag prime-side %.6f zero-side %.6f ; lam_min prime %.6f zero %.6f (%.0fs)" % (th, T0, Xb, GAM, nz, diff, P[m // 2, m // 2], Z[m // 2, m // 2], np.linalg.eigvalsh(P)[0], np.linalg.eigvalsh(Z)[0], time.time() - t0), flush=True)
        res.append(diff)
    print("K2", "PASS" if max(res) < 1e-3 else "FAIL")


def K3(path):
    F = tz.Moments(path)
    T0 = F.T0
    X = int(round(T0))
    # primes by sieve
    s = np.ones(X + 1, dtype=bool)
    s[:2] = False
    for p in range(2, int(X ** 0.5) + 1):
        if s[p]:
            s[p * p::p] = False
    primes = np.nonzero(s)[0]
    worst = 0.0
    for (w, th, yv) in ((0, 1.0, 3.7), (5, 1.0, -11.2), (0, 0.55, 20.1)):
        Xb = X if th == 1.0 else int(math.floor(T0 ** th))
        tau = arb(T0 + F.S * w) + arb(yv)
        tot = acb(0)
        tot1 = acb(0)
        for p in primes:
            p = int(p)
            if p > Xb:
                break
            lp = arb(p).log()
            pk = p
            k = 1
            while pk <= Xb:
                a = k * lp
                term = lp / arb(pk).sqrt() * (acb(0, -1) * tau * a).exp()
                tot += term
                tot1 += term * a
                pk *= p
                k += 1
        cb = int(math.floor(math.log(float(Xb)) * 512.0))
        Mc = np.zeros((cb + 1, F.Q), dtype=np.complex128)
        F.add_cells(Mc, 0, w, cb)
        e = F.EX[F.XB.index(Xb), 0, w]
        Mc[cb] = e[..., 0] + 1j * e[..., 1]
        ac = (np.arange(cb + 1) + 0.5) / 512.0
        d0, d1 = tz.Moments.eval(Mc, ac, np.array([yv]))
        e0 = abs(complex(float(tot.real.mid()), float(tot.imag.mid())) - d0[0])
        e1 = abs(complex(float(tot1.real.mid()), float(tot1.imag.mid())) - d1[0])
        rad = 2e-11 * float(F.SABS[0])
        print("K3 w=%d theta=%.2f y=%.1f: D ball %s ; engine %.12f%+.12fj ; abs diff D %.2e, D1 %.2e ; radius %.2e (D), %.2e (D1)" % (w, th, yv, tot.str(12), d0[0].real, d0[0].imag, e0, e1, rad, rad * (th * math.log(T0) + 1)), flush=True)
        worst = max(worst, e0 / rad, e1 / (rad * (th * math.log(T0) + 1)))
    print("K3", "PASS" if worst < 1 else "FAIL", "worst ratio to radius %.3f" % worst)
    print("K4 sum abs amplitudes per object:", [float("%.6g" % x) for x in F.SABS])


def K4():
    ctx.prec = 256
    kap = ((10 - 2 * arb(5).sqrt()).sqrt() - 2) / (arb(5).sqrt() - 1)
    a = [arb(1), kap, -kap, arb(-1)]

    def Fv(s):
        tot = acb(0)
        for r in range(1, 5):
            tot += a[r - 1] * acb(s).zeta(arb(r) / 5)
        return tot * (acb(5) ** (-acb(s)))
    h = arb(10) ** (-20)
    val = -(Fv(3 + h) - Fv(3 - h)) / (2 * h) / Fv(arb(3))
    print("K4 DH: -F'/F(3) from the Hurwitz form = %s (compare with the engine line 'DH check')" % val.real.str(18))
    ctx.prec = 128


if __name__ == "__main__":
    k = sys.argv[1]
    if k == "K1":
        K1()
    elif k == "K2":
        K2(sys.argv[2], float(sys.argv[3]))
    elif k == "K3":
        K3(sys.argv[2])
    elif k == "K4":
        K4()
