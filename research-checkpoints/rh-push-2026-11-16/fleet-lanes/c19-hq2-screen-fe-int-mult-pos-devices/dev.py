# dev.py: band device N(theta) (Form D of c18-tz-band-completion-controls-server; at theta = 1 it is the s3 matrix W with X = T)
# on zeta, HQ2(q, eps), the HQ2 numerator, ZQ, T-NR. python-flint balls throughout (prime sums are ball sums; no a-priori radius).
# usage: python dev.py OUT.jsonl "T0,T0,..." NW "theta,theta,..." [M_MODES=192]
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, arb_mat, ctx
import tz, hq2

ctx.prec = 128
MBIG = int(sys.argv[5]) if len(sys.argv) > 5 else 192
HQ = [(2, "1e-8"), (2, "1e-6"), (2, "1e-4"), (2, "1e-3"), (2, "1e-2"), (2, "1e-1"), (3, "1e-4"), (3, "1e-2"), (101, "1e-2")]
TNR_Q, TNR_C = 3, 2.2
ZQ_ETA = ["0.0322609858", "0.1020564026", "0.3239252271", "0.05", "0.25"]   # first three: offsets of HQ2(2, 1e-6), (2, 1e-4), (2, 1e-2)
SPACING = 128.0
I = acb(0, 1)


def prime_powers(X):
    s = np.ones(X + 1, dtype=bool); s[:2] = False
    for i in range(2, int(X ** 0.5) + 1):
        if s[i]: s[i * i::i] = False
    out = []
    for p in np.nonzero(s)[0].tolist():
        pk = p
        while pk <= X:
            out.append((pk, p)); pk *= p
    out.sort()
    return out


def prime_sum(tw, U, m, X):
    """F(tau_j) = sum_{n <= X, log n < U} Lambda(n) n^(-1/2) e^(-i tau_j log n), F1 with the extra factor log n. Ball sums."""
    tau, D = tz.nodes(tw, U, m)
    F = [acb(0)] * m; F1 = [acb(0)] * m
    sabs = arb(0); cnt = 0
    for (n, p) in prime_powers(X):
        a = arb(n).log()
        if not (a < U):
            continue
        mass = arb(p).log() / arb(n).sqrt()
        st = (-I * D * a).exp()
        for j in range(m):
            if j % 8 == 0:                      # restart from a direct exponential: repeated ball products inflate the radius
                e = (-I * tau[j] * a).exp() * mass
                e1 = e * a
            F[j] = F[j] + e
            F1[j] = F1[j] + e1
            e = e * st; e1 = e1 * st
        sabs += mass; cnt += 1
    return F, F1, float(sabs.mid()), cnt


def atoms(tau, v, masses, U):
    m = len(tau); F = []; F1 = []
    ks = [(k, mu) for k, mu in enumerate(masses, start=1) if (k * v < U)]
    for j in range(m):
        f = acb(0); f1 = acb(0)
        for k, mu in ks:
            e = (-I * tau[j] * (k * v)).exp()
            f += mu * e; f1 += mu * (k * v) * e
        F.append(f); F1.append(f1)
    return F, F1, len(ks)


def ident(m, c):
    A = arb_mat(m, m)
    for i in range(m): A[i, i] = c
    return A


def sub(A, lo, hi):
    n = hi - lo
    return arb_mat(n, n, [A[i, j] for i in range(lo, hi) for j in range(lo, hi)])


def certify(A, Ms=(0, 1)):
    """lambda_min(A) + 2M: 'pos' if V^T (A + 2M) V is strictly diagonally dominant with positive diagonal in balls (V = float
    eigenvectors, V^T V certified invertible the same way); 'neg' if the ball Rayleigh quotient of the lowest float eigenvector is < 0."""
    m = A.nrows()
    An = tz.to_np(A)
    ev, V = np.linalg.eigh(An)
    Va = arb_mat(m, m, [arb(float(x)) for x in V.reshape(-1)])
    Vt = Va.transpose()
    B = Vt * A * Va
    G = Vt * Va
    def gersh(C):
        g = None
        for i in range(m):
            s = C[i, i]
            for j in range(m):
                if j != i: s = s - abs(C[i, j])
            if not (s > 0): return False
        return True
    inv_ok = gersh(G)
    out = {"lam_min": float(ev[0]), "lam_max": float(ev[-1]), "lam_2": float(ev[1]), "n_neg_float": int((ev < 0).sum()), "signs": {}}
    q0 = B[0, 0] / G[0, 0]
    for M in Ms:
        if ev[0] + 2 * M < 0:
            out["signs"][str(M)] = "neg" if (q0 + 2 * M) < 0 else "undecided"
        else:
            out["signs"][str(M)] = "pos" if (inv_ok and gersh(B + G * arb(2 * M))) else "undecided"
    return out


def zeta_pair(tw):
    z = acb(arb(1) / 4, arb(tw) / 2)
    th = z.lgamma().imag - arb(tw) / 2 * arb.pi().log()
    n0 = int((th / arb.pi()).mid().floor().unique_fmpz()) + 1
    zs = acb.zeta_zeros(n0, 2)
    return zs[0].imag, zs[1].imag


def work(task):
    T0, w, th = task
    t_start = time.time()
    tw = T0 + SPACING * w
    X = int(round(T0 ** th)) if abs(T0 ** th - round(T0 ** th)) < 1e-6 * T0 ** th else int(math.floor(T0 ** th))
    U = arb(th) * arb(int(T0)).log()
    u = float(U.mid())
    Lg = math.log(tw / (2 * math.pi))
    m = MBIG
    lo, hi = m // 4, m // 4 + m // 2          # central m/2 consecutive modes = the m/2-mode window space at the same centre
    tau, D = tz.nodes(tw, U, m)
    A_arch = tz.arch(tw, U, m, [arb(1) / 4], -arb.pi().log())
    A_pole = tz.rank_terms(tw, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
    F, F1, sabs, cnt = prime_sum(tw, U, m, X)
    Az = tz.add(A_arch, A_pole, tz.loewner(m, D, U, F, F1, -1))
    t_build = time.time() - t_start
    base = {"T0": T0, "w": w, "tw": tw, "theta": th, "u": u, "Lg": Lg, "X": X, "n_terms": cnt, "sum_abs": sabs}
    res = []

    def rec(name, A, **kw):
        for (mm, B) in ((m, A), (m // 2, sub(A, lo, hi))):
            r = certify(B)
            r.update(base, obj=name, m=mm, s=r["lam_min"] / Lg, **kw)
            res.append(r)

    rec("zeta", Az)
    for (q, eps) in HQ:
        v = arb(q).log()
        K = int(u / math.log(q)) + 2
        S = hq2.power_sums(arb(eps), K)
        Fa, F1a, nk = atoms(tau, v, [v * (4 - S[k]) for k in range(1, K + 1)], U)
        A_asw = tz.add(Az, tz.loewner(m, D, U, Fa, F1a, -1))
        Fo, F1o, _ = atoms(tau, v, [v * S[k] for k in range(1, K + 1)], U)
        A_num = tz.add(Az, tz.loewner(m, D, U, Fo, F1o, +1))
        A_own = tz.add(A_num, ident(m, 4 * v))
        kw = dict(q=q, eps=eps, n_atoms=nk, max_atom=float(max([abs((v * (4 - S[k])).mid()) for k in range(1, nk + 1)] + [0.0])))
        rec("HQ2 as written", A_asw, **kw)
        rec("HQ2 own poles added", A_own, **kw)
        rec("HQ2 numerator, zeta's Arch", A_num, **kw)
    for q in (2, 3, 101):
        v = arb(q).log()
        K = int(u / math.log(q)) + 2
        Fp, F1p, nk = atoms(tau, v, [4 * v] * K, U)
        A_P = tz.add(ident(m, 4 * v), tz.loewner(m, D, U, Fp, F1p, +1))
        rec("pole lattice alone (4 x rank terms)", A_P, q=q, n_atoms=nk)
    Lq = arb(TNR_Q).log()
    rho = (arb(TNR_C) + (arb(TNR_C) ** 2 - 4).sqrt()) / 2
    K = int(u / math.log(TNR_Q)) + 2
    Ft, F1t, nk = atoms(tau, Lq, [-Lq * (-1) ** k * (rho ** k + rho ** (-k)) for k in range(1, K + 1)], U)
    A_t = tz.add(Az, tz.loewner(m, D, U, Ft, F1t, -1))
    rec("T-NR (3, 2.2), zeta's Arch", A_t, n_atoms=nk)
    rec("T-NR (3, 2.2), own conductor term", tz.add(A_t, ident(m, 2 * Lq)), n_atoms=nk)
    g1, g2 = zeta_pair(tw)
    gb = (g1 + g2) / 2
    for eta in ZQ_ETA:
        e = arb(eta)
        pts = [(acb(g1), -1), (acb(g2), -1), (acb(-g1), -1), (acb(-g2), -1),
               (acb(gb, e), 1), (acb(gb, -e), 1), (acb(-gb, e), 1), (acb(-gb, -e), 1)]
        rec("ZQ", tz.add(Az, tz.rank_terms(tw, U, m, pts)), eta=eta, g1=float(g1.mid()), g2=float(g2.mid()))
    for r in res:
        r["t_build"] = t_build; r["t_cell"] = time.time() - t_start
    return res


if __name__ == "__main__":
    out = sys.argv[1]
    T0s = [float(x) for x in sys.argv[2].split(",")]
    NW = int(sys.argv[3])
    ths = [float(x) for x in sys.argv[4].split(",")]
    tasks = [(T0, w, th) for T0 in T0s for w in range(NW) for th in ths]
    tasks.sort(key=lambda t: -(t[0] ** t[2]))
    nproc = int(os.environ.get("RH_WORKERS", "4"))
    print("tasks %d, workers %d, modes %d; planned memory: matrices %d x %d balls (under 50 MB per worker), sieve at most %d bytes" % (len(tasks), nproc, MBIG, MBIG, MBIG, int(max(T0s)) + 1), flush=True)
    t0 = time.time()
    done = 0
    with Pool(nproc) as pool, open(out, "a") as f:
        for res in pool.imap_unordered(work, tasks, chunksize=1):
            for r in res:
                f.write(json.dumps(r) + "\n")
            f.flush()
            done += 1
            z = [r for r in res if r["obj"] == "zeta"]
            print("done %d/%d  T0=%g w=%d th=%g  zeta s=%.4f %s  cell %.0fs  elapsed %.0fs" % (done, len(tasks), z[0]["T0"], z[0]["w"], z[0]["theta"], z[0]["s"], z[0]["signs"], z[0]["t_cell"], time.time() - t0), flush=True)
