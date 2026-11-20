# comp.py: data form Q_D, completion T_sigma, defect E, hybrid Q_C for one height and a list of windows.
# usage: python comp.py TAG T0 W1,W2,..   |   python comp.py selftest
import sys, os, json, math, time
import numpy as np
from flint import arb, acb, arb_mat, ctx
import tz
from rsc import *

ctx.prec = 128
MODES = [int(x) for x in os.environ.get("RS_MODES", "96,192,384").split(",")]
THETAS = [float(x) for x in os.environ.get("RS_THETAS", "0.75,0.8,0.85").split(",")]
HYB = int(os.environ.get("RS_HYB", "26"))       # number of objects in the hybrid form
EA = [0.1, 0.3]
TNR_Q, TNR_C = 3.0, 2.2
ZQ_ETA = [0.25, 0.05, 0.01]
C18 = os.path.expanduser("~/rh-push/c18-tz-band-completion-controls-server/")


def files_for(tag):
    if tag == "1e12":
        return load_files([C18 + "mom_e12a_*.bin"]), load_files(["bnd_1e12_*.bin"])
    return load_files(["mom_%s.bin" % tag]), []


def pick(sp, pre):
    return {pre + k: v for k, v in sp.items()}


def work(tag, T0, w, cfg, main, bnd, dh, zq, fout):
    t00 = time.time()
    tw = T0 + S_WIN * w
    Lg = math.log(tw / (2 * math.pi))
    Lg_arb = (arb(tw) / (2 * PI)).log()
    zs = np.load("zeros_%s_w%02d.npz" % (tag, w))
    G = [zs["o%d" % o] for o in range(26)]
    G1 = zs["rs1"]
    Gd = zs["dh"] if "dh" in zs.files else None
    r0, r1 = rho_chord(tw, "zeta")
    nobj = main[0].NOBJ

    def emit(rec):
        fout.write(json.dumps(rec) + "\n")
        fout.flush()
    for m in MODES:
        # ----- U = Lg: completion on the full band (independent of theta)
        yL, DL = nodes_off(Lg_arb, m)
        yLf = np.array([float(y.mid()) for y in yL])
        archL = tz.arch(tw, Lg_arb, m, [arb(1) / 4], -LOGPI)
        rhoLL = rhoacc(yL, Lg_arb, Lg_arb, r0, r1)
        TL = {}
        for o in range(HYB):
            TL[o] = madd(archL, assemble(m, DL, Lg_arb, *sub_acc(zacc(yL, Lg_arb, Lg_arb, G[o], True), rhoLL)))
        print("m", m, "full-band completions done t=%.0fs" % (time.time() - t00), flush=True)
        for th in THETAS:
            Xb = cfg["theta"][str(th)]
            u = th * math.log(T0)
            u_arb = arb(th) * arb(T0).log()
            base = {"tag": tag, "T0": T0, "w": w, "tw": tw, "theta": th, "m": m, "Lg": Lg, "u": u, "Xb": Xb}
            yu, Du = nodes_off(u_arb, m)
            yuf = np.array([float(y.mid()) for y in yu])
            tau = [arb(tw) + y for y in yu]
            arch = tz.arch(tw, u_arb, m, [arb(1) / 4], -LOGPI)
            pole = tz.rank_terms(tw, u_arb, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
            rho_uu = rhoacc(yu, u_arb, u_arb, r0, r1)
            Mc0, ac = cellsum(main, bnd, 0, w, Xb)
            Ap, mx = prime_form(m, Du, u_arb, Mc0, ac, yuf, Xb)
            P0 = madd(pole, Ap)
            QD = madd(arch, P0)
            z0 = zacc(yu, u_arb, u_arb, G[0], True)
            Zu0 = assemble(m, Du, u_arb, *sub_acc(z0, rho_uu))
            E0 = P0 - Zu0
            rec = dict(base, obj="zeta", nG=len(G[0]))
            rec.update(pick(spec(QD, Lg), "sD_"))
            rec.update(pick(spec(E0, Lg), "e_"))
            rec.update(pick(spec(madd(arch, Zu0), Lg), "t_"))
            rec["norm_prime"] = max(abs(v) for v in (lambda s: (s["min"], s["max"]))(spec(Ap, Lg)))
            emit(rec)
            # RS1
            Zu1 = assemble(m, Du, u_arb, *sub_acc(zacc(yu, u_arb, u_arb, G1, True), rho_uu))
            rec = dict(base, obj="zeta-rs1", nG=len(G1))
            rec.update(pick(spec(P0 - Zu1, Lg), "e_"))
            emit(rec)
            # chains
            for o in range(1, nobj):
                name = "liouville" if o == 1 else "chain%02d" % (o - 2)
                Mc, ac2 = cellsum(main, bnd, o, w, Xb)
                if Mc is None:
                    emit(dict(base, obj=name, status="not run (chain sums beyond the engine range)"))
                    continue
                Ao, _ = prime_form(m, Du, u_arb, Mc, ac2, yuf, Xb)
                Zo = assemble(m, Du, u_arb, *sub_acc(zacc(yu, u_arb, u_arb, G[o], True), rho_uu))
                rec = dict(base, obj=name, nG=len(G[o]))
                rec.update(pick(spec(madd(arch, Ao), Lg), "sD_"))
                rec.update(pick(spec(Ao - Zo, Lg), "e_"))
                emit(rec)
            # ZQ
            if zq is not None and str(w) in zq:
                g1 = arb(zq[str(w)][0])
                g2 = arb(zq[str(w)][1])
                gb = (g1 + g2) / 2
                d1, d2 = float((g1 - arb(tw)).mid()), float((g2 - arb(tw)).mid())
                rr1 = G[0][np.argmin(np.abs(G[0] - d1))]
                rr2 = G[0][np.argmin(np.abs(G[0] - d2))]
                Zsw = assemble(m, Du, u_arb, *zacc(yu, u_arb, u_arb, [rr1, rr2], True))
                for eta in ZQ_ETA:
                    pair = [(acb(gb, eta), 1), (acb(gb, -eta), 1), (acb(-gb, eta), 1), (acb(-gb, -eta), 1)]
                    rem = [(acb(g1), -1), (acb(g2), -1), (acb(-g1), -1), (acb(-g2), -1)]
                    Rp = tz.rank_terms(tw, u_arb, m, pair)
                    Rr = tz.rank_terms(tw, u_arb, m, rem)
                    rec = dict(base, obj="ZQ eta=%g" % eta, eta=eta, rs_minus_true=[rr1 - d1, rr2 - d2],
                               mu_formula=u * (math.sinh(u * eta) / (u * eta) - 1) / Lg)
                    rec.update(pick(spec(madd(QD, Rp, Rr), Lg), "sD_"))
                    rec.update(pick(spec(madd(E0, Rp, Rr, Zsw), Lg), "e_"))
                    rec.update(pick(spec(Rp, Lg), "pair_"))
                    emit(rec)
            # E_a (empty completion)
            for a in EA:
                Aa, _ = prime_form(m, Du, u_arb, Mc0, ac, yuf, Xb, a=a)
                Q = madd(tz.arch(tw, u_arb, m, [arb(1) / 4 + arb(a) / 2, arb(1) / 4 - arb(a) / 2], -2 * LOGPI),
                         tz.rank_terms(tw, u_arb, m, [(acb(0, 0.5 + a), 1), (acb(0, -0.5 - a), 1), (acb(0, 0.5 - a), 1), (acb(0, -0.5 + a), 1)]), Aa)
                rec = dict(base, obj="E_a=%g" % a)
                rec.update(pick(spec(Q, Lg), "sD_"))
                emit(rec)
            # T-NR
            Lq = arb(TNR_Q).log()
            rho_ = (arb(TNR_C) + (arb(TNR_C) ** 2 - 4).sqrt()) / 2
            kmax = int(math.floor(u / math.log(TNR_Q) - 1e-12))
            wts = [arb(0)] + [-Lq * (-1) ** k * (rho_ ** k + rho_ ** (-k)) for k in range(1, kmax + 1)]
            row = madd(ident(m, 2 * Lq), row_form(m, Du, u_arb, tau, wts, Lq))
            rec = dict(base, obj="T-NR")
            rec.update(pick(spec(madd(QD, row), Lg), "sD_"))
            rec.update(pick(spec(madd(E0, row), Lg), "e_"))
            emit(rec)
            # HQ2 truncation
            L2 = arb(2).log()
            kmax = int(math.floor(u / math.log(2.0) - 1e-12))
            rowh = row_form(m, Du, u_arb, tau, hq2_weights(kmax), L2)
            rec = dict(base, obj="HQ2")
            rec.update(pick(spec(madd(QD, rowh), Lg), "sD_"))
            rec.update(pick(spec(madd(E0, rowh), Lg), "e_"))
            emit(rec)
            # DH
            if dh is not None and Gd is not None:
                q0, q1 = rho_chord(tw, "dh")
                Mc, ac3 = cellsum([dh], [], 0, w, Xb)
                Ad, _ = prime_form(m, Du, u_arb, Mc, ac3, yuf, Xb, sabs=float(dh.SABS[0]))
                archd = tz.arch(tw, u_arb, m, [arb(3) / 4], arb(5).log() - LOGPI)
                Zd = assemble(m, Du, u_arb, *sub_acc(zacc(yu, u_arb, u_arb, Gd, True), rhoacc(yu, u_arb, u_arb, q0, q1)))
                rec = dict(base, obj="DH", nG=len(Gd))
                rec.update(pick(spec(madd(archd, Ad), Lg), "sD_"))
                rec.update(pick(spec(Ad - Zd, Lg), "e_"))
                emit(rec)
            # ----- hybrid on U = Lg
            if u < Lg:
                rho_Lu = rhoacc(yL, Lg_arb, u_arb, r0, r1)
                for o in range(HYB):
                    name = "zeta" if o == 0 else ("liouville" if o == 1 else "chain%02d" % (o - 2))
                    Mc, ac2 = cellsum(main, bnd, o, w, Xb)
                    if Mc is None:
                        continue
                    Ao, _ = prime_form(m, DL, Lg_arb, Mc, ac2, yLf, Xb)
                    Zb = assemble(m, DL, Lg_arb, *sub_acc(zacc(yL, Lg_arb, u_arb, G[o], False), rho_Lu))
                    Eu = Ao - Zb
                    rec = dict(base, obj=name, form="hybrid")
                    rec.update(pick(spec(madd(TL[o], Eu), Lg), "sC_"))
                    rec.update(pick(spec(Eu, Lg), "f_"))
                    rec.update(pick(spec(TL[o], Lg), "t_"))
                    emit(rec)
            print("w", w, "m", m, "theta", th, "done t=%.0fs" % (time.time() - t00), flush=True)


def selftest():
    """E(u) with G = Arb zeros of zeta (not the Riemann-Siegel points) must be the tail error only; direct ball prime sums."""
    T0 = 20000.0
    tw = T0
    th = 0.8
    m = 96
    u_arb = arb(th) * arb(T0).log()
    u = float(u_arb.mid())
    Xb = int(math.floor(T0 ** th))
    Lg = math.log(tw / (2 * math.pi))
    z = acb(arb(1) / 4, arb(tw - LW) / 2)
    n0 = int((((z.lgamma().imag - arb(tw - LW) / 2 * LOGPI) / PI).mid()).floor().unique_fmpz()) - 3
    zz = acb.zeta_zeros(max(n0, 1), 2000)
    dg = np.array([float((x.imag - arb(tw)).mid()) for x in zz])
    dg = dg[np.abs(dg) <= LW]
    print("selftest: zeros in J", len(dg), "X", Xb, flush=True)
    yu, Du = nodes_off(u_arb, m)
    tau = [arb(tw) + y for y in yu]
    # direct prime sums
    lam = {}
    sv = [True] * (Xb + 1)
    for p in range(2, Xb + 1):
        if sv[p]:
            for q in range(2 * p, Xb + 1, p):
                sv[q] = False
            pk = p
            while pk <= Xb:
                lam[pk] = arb(p).log()
                pk *= p
    F, F1 = [], []
    for j in range(m):
        f = acb(0)
        f1 = acb(0)
        for n, l in lam.items():
            ln = arb(n).log()
            e = (acb(0, -1) * tau[j] * ln).exp() * l / arb(n).sqrt()
            f += e
            f1 += e * ln
        F.append(f)
        F1.append(f1)
    Ap = tz.loewner(m, Du, u_arb, F, F1, -1)
    arch = tz.arch(tw, u_arb, m, [arb(1) / 4], -LOGPI)
    pole = tz.rank_terms(tw, u_arb, m, [(acb(0, 0.5), 1), (acb(0, -0.5), 1)])
    QD = madd(arch, pole, Ap)
    r0, r1 = rho_chord(tw, "zeta")
    Zu = assemble(m, Du, u_arb, *sub_acc(zacc(yu, u_arb, u_arb, dg, True), rhoacc(yu, u_arb, u_arb, r0, r1)))
    E = madd(pole, Ap) - Zu
    print("selftest s_D", json.dumps(spec(QD, Lg)))
    print("selftest E (should be the tail error, about 1e-3 or below)", json.dumps(spec(E, Lg)))
    print("selftest T_sigma", json.dumps(spec(madd(arch, Zu), Lg)))
    # consistency of the band-limited accumulators: b = U through the general branch, and (Lg, u) + check of rank_terms against zacc
    a1 = zacc(yu, u_arb, u_arb, dg[:50], True)
    a2 = zacc(yu, u_arb, u_arb * (1 - arb(2) ** -100), dg[:50], False)
    print("selftest zacc branches", max(abs(float((x - y).mid())) for x, y in zip(a1[1], a2[1])), max(abs(float((x - y).mid())) for x, y in zip(a1[0], a2[0])))
    R1 = tz.rank_terms(tw, u_arb, m, [(acb(arb(tw) + arb(float(g))), 1) for g in dg[:5]])
    R2 = assemble(m, Du, u_arb, *zacc(yu, u_arb, u_arb, dg[:5], True))
    print("selftest rank_terms vs zacc", max(abs(float((R1[i, j] - R2[i, j]).mid())) for i in range(m) for j in range(m)))
    # density interval against a fine point set: rho on J versus Riemann sum
    hq = hq2_weights(12)
    print("selftest hq2 a_k/log2", [float((x / arb(2).log()).mid()) for x in hq[:8]])
    print("SELFTEST DONE", flush=True)


if __name__ == "__main__":
    if sys.argv[1] == "selftest":
        selftest()
        sys.exit(0)
    tag = sys.argv[1]
    T0 = float(sys.argv[2])
    wins = [int(x) for x in sys.argv[3].split(",")]
    cfg = json.load(open("bounds.json"))[tag]
    main, bnd = files_for(tag)
    dh = tz.Moments("dh_%s.bin" % tag) if os.path.exists("dh_%s.bin" % tag) else None
    zqp = "zq_%s.json" % tag if os.path.exists("zq_%s.json" % tag) else C18 + "zq_%s.json" % tag
    zq = json.load(open(zqp)) if os.path.exists(zqp) else None
    print("planned: matrices up to %d x %d balls (about %d MB each); moments memory-mapped; zero lists below 1 MB" % (max(MODES), max(MODES), max(MODES) ** 2 * 100 // 10 ** 6), flush=True)
    for w in wins:
        with open("res_%s_w%02d%s.jsonl" % (tag, w, os.environ.get("RS_SUFFIX", "")), "w") as f:
            work(tag, T0, w, cfg, main, bnd, dh, zq, f)
    print("COMP DONE", tag, wins, flush=True)
