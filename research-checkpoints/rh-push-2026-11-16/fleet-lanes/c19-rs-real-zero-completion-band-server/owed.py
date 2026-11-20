# owed.py: items 1, 4, 5 of FOR_NUMERICS_LANE.md (c18-tz-one-sided-bound-fe-reserve-bridge).
# usage: python owed.py i1|i4|i5 TAG T0 [extra]
import sys, os, json, math, time
import numpy as np
from flint import arb, acb, arb_mat, ctx
import tz
from rsc import *
from comp import files_for, C18

ctx.prec = 128
WINS8 = [0, 5, 10, 15, 20, 25, 30, 35]
MODES = [int(x) for x in os.environ.get("RS_MODES", "96,192,384").split(",")]


def pair_np(dgb, eta, yf, U):
    zc = dgb + 1j * eta
    N = 2 - 2 * np.cos((yf[0] - zc) * U)
    inv = 1.0 / (yf - zc)
    return 2 * np.real(N * np.outer(inv, inv)) / U


def lattice_root(u, Lg, thp):
    rhs = Lg * (1 - thp - math.sin(math.pi * thp) / math.pi)
    lo, hi = 1e-9, 50.0
    for _ in range(200):
        x = 0.5 * (lo + hi)
        if u * (math.sinh(x) / x - 1) < rhs:
            lo = x
        else:
            hi = x
    return lo / u


def true_pair_near(tw, r1, r2):
    """Arb zeros of zeta nearest the two points t_w + r1, t_w + r2."""
    t = arb(tw) + arb(float(r1))
    th = acb(arb(1) / 4, t / 2).lgamma().imag - t / 2 * LOGPI
    n0 = int((th / PI).mid().floor().unique_fmpz()) + 1
    zz = acb.zeta_zeros(max(1, n0 - 6), 14)
    im = [z.imag for z in zz]
    off = np.array([float((x - arb(tw)).mid()) for x in im])
    i1 = int(np.argmin(np.abs(off - r1)))
    i2 = int(np.argmin(np.abs(off - r2)))
    return im[i1], im[i2], float(off[i1] - r1), float(off[i2] - r2), i2 - i1


def item1(tag, T0):
    cfg = json.load(open("bounds.json"))[tag]
    main, bnd = files_for(tag)
    ext = load_files(["ext_1e12_*.bin"]) if tag == "1e12" else []
    zqp = "zq_%s.json" % tag if os.path.exists("zq_%s.json" % tag) else C18 + "zq_%s.json" % tag
    zq = json.load(open(zqp))
    fout = open("owed1_%s.jsonl" % tag, "w")
    t00 = time.time()
    for thp in (0.6, 0.8, 0.95):
        Xb = cfg["thetap"][str(thp)]
        u_arb = arb(thp) * (arb(T0) / (2 * PI)).log()
        u = float(u_arb.mid())
        mm = main + ext if (tag == "1e12" and thp == 0.95) else main
        for w in WINS8:
            tw = T0 + S_WIN * w
            Lg = math.log(tw / (2 * math.pi))
            base = {"item": 1, "tag": tag, "w": w, "tw": tw, "thetap": thp, "u": u, "Lg": Lg, "Xb": Xb}
            Mc0, ac = cellsum(mm, bnd, 0, w, Xb)
            if Mc0 is None or (tag == "1e12" and thp == 0.95 and len(ext) < 8):
                fout.write(json.dumps(dict(base, status="not run (primes beyond the engine range)")) + "\n")
                continue
            G0 = np.sort(np.load("zeros_%s_w%02d.npz" % (tag, w))["o0"])
            pairs = []
            g1, g2 = arb(zq[str(w)][0]), arb(zq[str(w)][1])
            pairs.append(("centre", g1, g2, None))
            gaps = np.diff(G0)
            idx = np.nonzero(gaps > 2 * math.pi / u)[0]
            idx = idx[(idx + 2 < len(G0))]
            if len(idx):
                i = idx[np.argmin(np.abs(0.5 * (G0[idx] + G0[idx + 1])))]
                a1, a2, e1, e2, di = true_pair_near(tw, G0[i + 1], G0[i + 2])
                if di == 1 and abs(e1) < 0.2 and abs(e2) < 0.2:
                    pairs.append(("after-long-gap", a1, a2, float(gaps[i])))
            for m in MODES:
                yu, Du = nodes_off(u_arb, m)
                yuf = np.array([float(y.mid()) for y in yu])
                arch = tz.arch(tw, u_arb, m, [arb(1) / 4], -LOGPI)
                pole = tz.rank_terms(tw, u_arb, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
                Ap, _ = prime_form(m, Du, u_arb, Mc0, ac, yuf, Xb)
                QD = madd(arch, pole, Ap)
                sq = spec(QD, Lg)
                for (kind, g1, g2, gap) in pairs:
                    gb = (g1 + g2) / 2
                    dgb = float((gb - arb(tw)).mid())
                    B = madd(QD, tz.rank_terms(tw, u_arb, m, [(acb(g1), -1), (acb(g2), -1), (acb(-g1), -1), (acb(-g2), -1)]))
                    Bn = tz.to_np(B)
                    Bn = (Bn + Bn.T) / 2

                    def f(eta):
                        return float(np.linalg.eigvalsh(Bn + pair_np(dgb, eta, yuf, u))[0])
                    rec = dict(base, m=m, pair=kind, gap=gap, pair_gap=float((g2 - g1).mid()), dgb=dgb, sD_min=sq["min"],
                               base_min=float(np.linalg.eigvalsh(Bn)[0]) / Lg, lattice_root=lattice_root(u, Lg, thp), f0=f(1e-5) / Lg)
                    if f(1e-5) < 0:
                        rec["eta_star"] = 0.0
                    else:
                        hi = 0.01
                        while f(hi) >= 0 and hi < 3:
                            hi *= 2
                        lo = hi / 2 if hi > 0.01 else 1e-5
                        if f(hi) >= 0:
                            rec["eta_star"] = None
                        else:
                            for _ in range(40):
                                md = 0.5 * (lo + hi)
                                if f(md) >= 0:
                                    lo = md
                                else:
                                    hi = md
                            es = 0.5 * (lo + hi)
                            rec["eta_star"] = es
                            cert = []
                            for e_ in (es * 0.99, es * 1.01):
                                Rp = tz.rank_terms(tw, u_arb, m, [(acb(gb, e_), 1), (acb(gb, -e_), 1), (acb(-gb, e_), 1), (acb(-gb, -e_), 1)])
                                s = spec(madd(B, Rp), Lg)
                                cert.append([s["min_lo"], s["min_hi"]])
                            rec["cert_lo_hi_at_0.99_1.01"] = cert
                            rec["certified"] = bool(cert[0][0] is not None and cert[0][0] > 0 and cert[1][1] < 0)
                    fout.write(json.dumps(rec) + "\n")
                    fout.flush()
            print("item1", tag, thp, w, "t=%.0fs" % (time.time() - t00), flush=True)
    print("OWED1 DONE", tag, flush=True)


def item4(tag, T0):
    cfg = json.load(open("bounds.json"))[tag]
    main, bnd = files_for(tag)
    fout = open("owed4_%s.jsonl" % tag, "w")
    y = np.arange(-60.0, 60.0001, 0.01)
    for thp in (0.5, 0.75, 1.0):
        Xb = cfg["thetap"][str(thp)]
        u = thp * math.log(T0 / (2 * math.pi))
        for a in (0.1, 0.3):
            for w in WINS8:
                tw = T0 + S_WIN * w
                Lg = math.log(tw / (2 * math.pi))
                Mc0, ac = cellsum(main, bnd, 0, w, Xb)
                p0, p1 = meval(Mc0, ac, y + 1j * a)
                q0, q1 = meval(Mc0, ac, y - 1j * a)
                fej = 2 * np.real(p0 + q0) - 2 * np.real(p1 + q1) / u
                val = 2 * Lg - fej
                rad = 2 * prime_rad(Xb, 60.0, a) * (2 + 2 * (math.log(Xb) + 1) / u)
                i = int(np.argmin(val))
                rec = {"item": 4, "tag": tag, "w": w, "thetap": thp, "a": a, "P": Xb, "u": u, "Lg": Lg, "min_value": float(val[i]), "min_over_Lg": float(val[i]) / Lg,
                       "argmin_offset": float(y[i]), "radius": rad, "certified_negative": bool(val[i] + rad < 0), "frac_negative": float(np.mean(val < 0)),
                       "predicted_size": Xb ** a / (a * a * u), "rms_fejer": float(np.sqrt(np.mean(fej ** 2))), "median_value": float(np.median(val))}
                fout.write(json.dumps(rec) + "\n")
                fout.flush()
    print("OWED4 DONE", tag, flush=True)


def item5(tag, T0, part):
    cfg = json.load(open("bounds.json"))[tag]
    main, bnd = files_for(tag)
    fout = open("owed5_%s_%s.jsonl" % (tag, part), "w")
    y = np.arange(-60.0, 60.0001, 0.01)
    t00 = time.time()
    modes = [96] if part == "m96" else [int(part[1:])]
    wins = list(range(40)) if part == "m96" else WINS8
    for thp in (0.6, 0.8, 1.0):
        Xb = cfg["thetap"][str(thp)]
        u_arb = arb(thp) * (arb(T0) / (2 * PI)).log()
        u = float(u_arb.mid())
        for w in wins:
            tw = T0 + S_WIN * w
            Lg = math.log(tw / (2 * math.pi))
            Lg_arb = (arb(tw) / (2 * PI)).log()
            for o in range(0, 26):
                name = "zeta" if o == 0 else ("liouville" if o == 1 else "chain%02d" % (o - 2))
                base = {"item": 5, "tag": tag, "w": w, "thetap": thp, "obj": name, "u": u, "Lg": Lg, "Xb": Xb}
                Mc, ac = cellsum(main, bnd, o, w, Xb)
                if Mc is None:
                    fout.write(json.dumps(dict(base, status="not run (chain sums beyond the engine range)")) + "\n")
                    continue
                for m in modes:
                    yu, Du = nodes_off(u_arb, m)
                    yuf = np.array([float(v.mid()) for v in yu])
                    Ao, _ = prime_form(m, Du, u_arb, Mc, ac, yuf, Xb)
                    s = spec(madd(ident(m, Lg_arb), Ao), 1.0)
                    rec = dict(base, m=m, lam_min=s["min"], lo=s["min_lo"], hi=s["min_hi"], s=s["min"] / Lg,
                               viol_M0=bool(s["min_hi"] < 0), viol_M1=bool(s["min_hi"] + 2 < 0),
                               hold_M0=bool(s["min_lo"] is not None and s["min_lo"] > 0), hold_M1=bool(s["min_lo"] is not None and s["min_lo"] + 2 > 0))
                    fout.write(json.dumps(rec) + "\n")
                if part == "m96" and w in WINS8:
                    d0, d1 = meval(Mc, ac, y)
                    val = Lg - (2 * np.real(d0) - 2 * np.real(d1) / u)
                    fout.write(json.dumps(dict(base, fejer=True, frac_M0=float(np.mean(val < 0)), frac_M1=float(np.mean(val < -2)), min_over_Lg=float(val.min()) / Lg,
                                               std_fejer_over_u=float(np.std(Lg - val)) / u)) + "\n")
                fout.flush()
            print("item5", tag, part, thp, w, "t=%.0fs" % (time.time() - t00), flush=True)
    print("OWED5 DONE", tag, part, flush=True)


if __name__ == "__main__":
    mode, tag, T0 = sys.argv[1], sys.argv[2], float(sys.argv[3])
    if mode == "i1":
        item1(tag, T0)
    elif mode == "i4":
        item4(tag, T0)
    else:
        item5(tag, T0, sys.argv[4])
