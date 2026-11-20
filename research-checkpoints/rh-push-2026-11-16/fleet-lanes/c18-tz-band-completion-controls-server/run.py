# run.py: assemble and certify Form D (and Form C) for one height.
# usage: python run.py TAG T0 "file1,file2" [dhfile or -] [zqfile or -] FORMS(D|DC|C) [CFULL]
import sys, os, json, math, time
import numpy as np
from multiprocessing import Pool
from flint import arb, acb, arb_mat, ctx
import tz

ctx.prec = 128
M_MODES = 96
THETAS = [0.55, 0.65, 0.75, 0.85, 0.95, 1.0]
if os.environ.get("TZ_THETAS"):
    THETAS = [float(x) for x in os.environ["TZ_THETAS"].split(",")]
def radfac(X):
    """a-priori relative radius of a moment sum: rounding of block sums (at most min(X/512, 2^21/log X) terms per cell and segment, doubled for the merges), phases, expansion."""
    return 2e-14 + 2.4e-16 * min(X / 512.0 + 1, 1.3 * 2 ** 21 / math.log(max(X, 3.0)))
EA = [0.1, 0.3]
TNR_Q, TNR_C = 3.0, 2.2
ZQ_ETA = [0.25, 0.05]


def xtheta(T0, th):
    if th >= 1.0:
        return int(round(T0))
    x = T0 ** th
    return int(round(x)) if abs(x - round(x)) < 1e-6 * x else int(math.floor(x))


def cell_of(x):
    return int(math.floor(math.log(float(x)) * 512.0))


def cellsum(files, obj, w, Xb):
    cb = cell_of(Xb)
    Qn = files[0].Q
    cover = 0
    for F in sorted(files, key=lambda F: F.XSTART):
        if obj < F.NOBJ and F.XSTART <= cover + 2:
            cover = max(cover, F.XMAX if obj == 0 else min(F.XMAX, F.XCHAIN))
    if cover < Xb - 1:
        return None, None
    Mc = np.zeros((cb + 1, Qn), dtype=np.complex128)
    for F in files:
        if F.XSTART > Xb or obj >= F.NOBJ:
            continue
        F.add_cells(Mc, obj, w, cb + (1 if (Xb not in F.XB and F.XMAX < Xb) else 0))
        if Xb in F.XB:
            e = F.EX[F.XB.index(Xb), obj, w]
            Mc[cb] += e[..., 0] + 1j * e[..., 1]
        elif F.XMAX >= Xb:
            raise RuntimeError("boundary %d not registered in file" % Xb)
    ac = (np.arange(cb + 1) + 0.5) / 512.0
    return Mc, ac


def ball_list(vals, rad):
    return [acb(arb(float(v.real), rad), arb(float(v.imag), rad)) for v in vals]


def sieve_lambda(N):
    lam = np.zeros(N + 1)
    s = np.ones(N + 1, dtype=bool)
    for p in range(2, N + 1):
        if s[p]:
            s[2 * p::p] = False
            pk = p
            while pk <= N:
                lam[pk] = math.log(p)
                pk *= p
    return lam


def theta_fn(t):
    """Riemann-Siegel theta as arb."""
    z = acb(arb(1) / 4, arb(t) / 2)
    return z.lgamma().imag - arb(t) / 2 * arb.pi().log()


def spec_norm(A):
    ev = np.linalg.eigvalsh(tz.to_np(A))
    return float(max(abs(ev[0]), abs(ev[-1])))


def work(args):
    (tag, T0, paths, dhpath, zq, forms, w, cfull) = args
    files = [tz.Moments(p) for p in paths]
    S = files[0].S
    tw = T0 + S * w
    Lg = math.log(tw / (2 * math.pi))
    Lg_arb = (arb(tw) / (2 * arb.pi())).log()
    m = M_MODES
    out = []
    dh = tz.Moments(dhpath) if dhpath else None
    nobj = files[0].NOBJ
    logpi = arb.pi().log()
    for th in THETAS:
        Xb = xtheta(T0, th)
        u = th * math.log(T0)
        u_arb = arb(th) * arb(T0).log()
        base = {"tag": tag, "T0": T0, "w": w, "tw": tw, "theta": th, "Lg": Lg, "u": u}
        if "D" in forms:
            U = u_arb
            D_ = 2 * math.pi / u
            y = (np.arange(m) - (m - 1) / 2) * D_
            Mc0, ac = cellsum(files, 0, w, Xb)
            if Mc0 is None:
                out.append(dict(base, form="D", obj="all", status="not run (n beyond the engine range)"))
            else:
                tau, Darb = tz.nodes(tw, U, m)
                A_arch = tz.arch(tw, U, m, [arb(1) / 4], -logpi)
                A_pole = tz.rank_terms(tw, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
                d0, d1 = tz.Moments.eval(Mc0, ac, y)
                rad = radfac(Xb) * float(sum(F.SABS[0] for F in files))
                A_prime = tz.loewner(m, Darb, U, ball_list(d0, rad), ball_list(d1, rad * (u + 1)), -1)
                Az = tz.add(A_arch, A_pole, A_prime)
                r = tz.certify(Az, encl=True)
                Id = arb_mat(m, m)
                for i in range(m):
                    Id[i, i] = Lg_arb
                r.update(base, form="D", obj="zeta", s=r["lam_min"] / Lg, maxabsD=float(np.max(np.abs(d0))),
                         norm_prime=spec_norm(A_prime) / Lg, norm_pole=spec_norm(A_pole) / Lg,
                         norm_arch_dev=spec_norm(A_arch - Id) / Lg)
                out.append(r)
                # Liouville and chains: zeta's Arch, no pole
                for o in range(1, nobj):
                    Mc, ac2 = cellsum(files, o, w, Xb)
                    name = "liouville" if o == 1 else "chain%02d" % (o - 2)
                    if Mc is None:
                        out.append(dict(base, form="D", obj=name, status="not run (n beyond the chain range)"))
                        continue
                    e0, e1 = tz.Moments.eval(Mc, ac2, y)
                    A = tz.add(A_arch, tz.loewner(m, Darb, U, ball_list(e0, rad), ball_list(e1, rad * (u + 1)), -1))
                    r = tz.certify(A)
                    r.update(base, form="D", obj=name, s=r["lam_min"] / Lg, maxabsD=float(np.max(np.abs(e0))))
                    out.append(r)
                # E_a
                for a in EA:
                    p0, p1 = tz.Moments.eval(Mc0, ac, y + 1j * a)
                    q0, q1 = tz.Moments.eval(Mc0, ac, y - 1j * a)
                    rr = rad * math.exp(a * u)
                    A = tz.add(tz.arch(tw, U, m, [arb(1) / 4 + arb(a) / 2, arb(1) / 4 - arb(a) / 2], -2 * logpi),
                               tz.rank_terms(tw, U, m, [(acb(0, 0.5 + a), 1), (acb(0, -0.5 - a), 1), (acb(0, 0.5 - a), 1), (acb(0, -0.5 + a), 1)]),
                               tz.loewner(m, Darb, U, ball_list(p0 + q0, 2 * rr), ball_list(p1 + q1, 2 * rr * (u + 1)), -1))
                    r = tz.certify(A)
                    r.update(base, form="D", obj="E_a=%g" % a, s=r["lam_min"] / Lg, maxabsD=float(np.max(np.abs(p0 + q0))))
                    out.append(r)
                # T-NR
                Lq = arb(TNR_Q).log()
                rho = (arb(TNR_C) + (arb(TNR_C) ** 2 - 4).sqrt()) / 2
                kmax = int(math.floor(u / math.log(TNR_Q) - 1e-12))
                Fn, F1n = [], []
                for j in range(m):
                    f = acb(0)
                    f1 = acb(0)
                    for k in range(1, kmax + 1):
                        wk = -Lq * (-1) ** k * (rho ** k + rho ** (-k))
                        e = (acb(0, -1) * tau[j] * (k * Lq)).exp()
                        f += wk * e
                        f1 += wk * (k * Lq) * e
                    Fn.append(f)
                    F1n.append(f1)
                Id2 = arb_mat(m, m)
                for i in range(m):
                    Id2[i, i] = 2 * Lq
                A = tz.add(Az, Id2, tz.loewner(m, Darb, U, Fn, F1n, -1))
                r = tz.certify(A)
                r.update(base, form="D", obj="T-NR", s=r["lam_min"] / Lg, maxabsD=float(max(abs(complex(f.real.mid(), f.imag.mid())) for f in Fn)) if kmax > 0 else 0.0)
                out.append(r)
                # ZQ
                if zq is not None and str(w) in zq:
                    g1 = arb(zq[str(w)][0])
                    g2 = arb(zq[str(w)][1])
                    gb = (g1 + g2) / 2
                    for eta in ZQ_ETA:
                        pts = [(acb(g1), -1), (acb(g2), -1), (acb(-g1), -1), (acb(-g2), -1),
                               (acb(gb, eta), 1), (acb(gb, -eta), 1), (acb(-gb, eta), 1), (acb(-gb, -eta), 1)]
                        A = tz.add(Az, tz.rank_terms(tw, U, m, pts))
                        r = tz.certify(A)
                        r.update(base, form="D", obj="ZQ eta=%g" % eta, s=r["lam_min"] / Lg, g1=float(g1.mid()), g2=float(g2.mid()))
                        out.append(r)
            # DH
            if dh is not None:
                Mc, ac3 = cellsum([dh], 0, w, Xb) if dh.XMAX >= Xb else (None, None)
                if Mc is None:
                    out.append(dict(base, form="D", obj="DH", status="not run (X_theta above the DH coefficient range)"))
                else:
                    tau, Darb = tz.nodes(tw, U, m)
                    e0, e1 = tz.Moments.eval(Mc, ac3, y)
                    rr = 2e-11 * float(dh.SABS[0])
                    A = tz.add(tz.arch(tw, U, m, [arb(3) / 4], arb(5).log() - logpi),
                               tz.loewner(m, Darb, U, ball_list(e0, rr), ball_list(e1, rr * (u + 1)), -1))
                    r = tz.certify(A)
                    r.update(base, form="D", obj="DH", s=r["lam_min"] / Lg, maxabsD=float(np.max(np.abs(e0))))
                    out.append(r)
        if "C" in forms and u < Lg:
            U = Lg_arb
            D_ = 2 * math.pi / Lg
            y = (np.arange(m) - (m - 1) / 2) * D_
            tau, Darb = tz.nodes(tw, U, m)
            A_arch = tz.arch(tw, U, m, [arb(1) / 4], -logpi)
            A_pole = tz.rank_terms(tw, U, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
            nmax = int(math.floor(math.exp(Lg - u)))
            lam = sieve_lambda(max(nmax, 2))
            ns = np.array([n for n in range(2, nmax + 1) if lam[n] > 0], dtype=np.int64)
            twotheta = 2 * theta_fn(tw)
            twopi = 2 * arb.pi()
            th2 = float((twotheta - twopi * (twotheta / twopi).floor()).mid())
            # base phases t_w log n mod 2 pi in balls
            bp = np.array([float(((arb(tw) * arb(int(n)).log()) - twopi * ((arb(tw) * arb(int(n)).log()) / twopi).floor()).mid()) for n in ns]) if len(ns) else np.zeros(0)
            logn = np.log(ns.astype(float)) if len(ns) else np.zeros(0)
            objs = list(range(nobj)) if cfull else [0]
            for o in objs:
                Mc, ac = cellsum(files, o, w, Xb)
                name = "zeta" if o == 0 else ("liouville" if o == 1 else "chain%02d" % (o - 2))
                if Mc is None:
                    out.append(dict(base, form="C", obj=name, status="not run"))
                    continue
                d0, d1 = tz.Moments.eval(Mc, ac, y)
                rad = radfac(Xb) * float(sum(F.SABS[0] for F in files))
                A_prime = tz.loewner(m, Darb, U, ball_list(d0, rad), ball_list(d1, rad * (Lg + 1)), -1)
                # reflected atoms
                if len(ns):
                    if o == 0:
                        sg = np.ones(len(ns))
                    else:
                        sg = np.array([chain_coeff_sign(int(n), o) for n in ns])
                    rho_n = sg * lam[ns] / np.sqrt(ns) * (Lg - logn) / logn
                    ph = np.exp(1j * (bp[None, :] + np.outer(y, logn)))          # e^{+i tau_j log n}
                    pre = np.exp(-1j * (th2 + y * Lg))
                    Fv = pre * (ph @ rho_n)
                    F1v = pre * (ph @ (rho_n * (Lg - logn)))
                    rr = 1e-11 * float(np.sum(np.abs(rho_n))) * (Lg + 1)
                    A_ref = tz.loewner(m, Darb, U, ball_list(Fv, rr), ball_list(F1v, rr * Lg), -1)
                else:
                    A_ref = arb_mat(m, m)
                A = tz.add(A_arch, A_prime, A_ref) if o > 0 else tz.add(A_arch, A_pole, A_prime, A_ref)
                r = tz.certify(A)
                r.update(base, form="C", obj=name, s=r["lam_min"] / Lg, n_reflected=int(len(ns)), nmax=nmax,
                         norm_reflected=spec_norm(A_ref) / Lg, norm_prime=spec_norm(A_prime) / Lg)
                # the same band without the reflected part
                A0 = tz.add(A_arch, A_prime) if o > 0 else tz.add(A_arch, A_pole, A_prime)
                r0 = tz.certify(A0)
                r["lam_min_no_reflected"] = r0["lam_min"]
                r["signs_no_reflected"] = r0["signs"]
                out.append(r)
    return out


def splitmix(x):
    M = (1 << 64) - 1
    x = (x + 0x9E3779B97F4A7C15) & M
    x = ((x ^ (x >> 30)) * 0xBF58476D1CE4E5B9) & M
    x = ((x ^ (x >> 27)) * 0x94D049BB133111EB) & M
    return x ^ (x >> 31)


def chain_coeff_sign(n, o):
    """sign of c(n)/Lambda(n) for object o at a prime power n = p^k."""
    p = n
    k = 1
    for q in range(2, int(n ** 0.5) + 2):
        if n % q == 0:
            p = q
            k = 0
            mm = n
            while mm % q == 0:
                mm //= q
                k += 1
            break
    if o == 1:
        e = -1
    else:
        h = splitmix((p * 0x9E3779B97F4A7C15 + 121000 + (o - 2)) & ((1 << 64) - 1))
        e = -1 if (h >> 63) else 1
    return e if (k & 1) else 1


if __name__ == "__main__":
    tag = sys.argv[1]
    T0 = float(sys.argv[2])
    paths = sys.argv[3].split(",")
    dhpath = None if sys.argv[4] == "-" else sys.argv[4]
    zq = None if sys.argv[5] == "-" else json.load(open(sys.argv[5]))
    forms = sys.argv[6]
    cfull = len(sys.argv) > 7 and sys.argv[7] == "CFULL"
    nwin = tz.Moments(paths[0]).NW
    w0, w1 = 0, nwin
    if len(sys.argv) > 9:
        w0, w1 = int(sys.argv[8]), int(sys.argv[9])
    print("planned: matrices %d x %d balls (under 1 MB each); windows %d..%d; moments memory-mapped" % (M_MODES, M_MODES, w0, w1 - 1), flush=True)
    t0 = time.time()
    outp = "res_%s_%s%s_%02d.jsonl" % (tag, forms + ("full" if cfull else ""), os.environ.get("TZ_SUFFIX", ""), w0)
    with open(outp, "w") as f:
        for w in range(w0, w1):
            res = work((tag, T0, paths, dhpath, zq, forms, w, cfull))
            for r_ in res:
                f.write(json.dumps(r_) + "\n")
            f.flush()
            print("window done", w, "t=%.0fs" % (time.time() - t0), flush=True)
    print("finished", outp, flush=True)
