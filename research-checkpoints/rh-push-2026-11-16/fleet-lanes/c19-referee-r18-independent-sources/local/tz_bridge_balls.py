# Referee check of Theorem A (lane c18-tz-one-sided-bound-fe-reserve-bridge) in ball arithmetic (python-flint).
# Identity tested, WITHOUT the log|a_P| term:
#   -2 Re <h, A_P h> = -u ||h||^2 + lim_T sum_{|Im beta| < T} <h, kappa_beta h>,   beta zeros of D_P(s) = sum_{n<=P} a_n n^-s.
# h(s) = sin^4(pi s/u) e^{i tau s} = sum_k c_k e^{i mu_k s}; both sides in closed form.  Zero lists certified complete:
# every zero by an interval Newton test, the count by the argument principle on the rectangle [-A, B] x [-T, T].
import sys, json, math, time
import numpy as np
from flint import arb, acb, ctx
ctx.prec = 160
I = acb(0, 1)

def log_coeffs(a, P):
    """Lambda_a(n), n < P, from a_n log n = sum_{d | n, d > 1} Lambda_a(d) a_{n/d}  (a_1 = 1); arb."""
    lam = {}
    for n in range(2, P):
        acc = a[n] * arb(n).log()
        for d in range(2, n):
            if n % d == 0: acc -= lam[d] * a[n // d]
        lam[n] = acc
    return lam

def run(name, P, tau, a_frac, Ts):
    t0 = time.time()
    a = {n: arb(a_frac[n][0]) / a_frac[n][1] for n in range(1, P + 1)}
    af = np.array([a_frac[n][0] / a_frac[n][1] for n in range(1, P + 1)])
    ln = np.log(np.arange(1, P + 1))
    lnb = [arb(n).log() for n in range(1, P + 1)]
    u = arb(P).log(); uf = math.log(P)
    def D(s):
        r = acb(0)
        for n in range(1, P + 1): r += a[n] * (-s * lnb[n - 1]).exp()
        return r
    def dD(s):
        r = acb(0)
        for n in range(2, P + 1): r -= a[n] * lnb[n - 1] * (-s * lnb[n - 1]).exp()
        return r
    # rectangle
    A = 2.0 * P
    while sum(abs(af[n - 1]) * (n / P) ** A for n in range(1, P)) >= 0.5 * abs(af[P - 1]): A += P
    B = 3.0
    while sum(abs(af[n - 1]) * n ** (-B) for n in range(2, P + 1)) >= 0.5: B += 1
    Tmax = max(Ts)
    # float Newton search, Im in [-0.5, Tmax + 0.5], chunks of height 20
    found = {}
    def Df(S): return (af * np.exp(-np.outer(S, ln))).sum(1)
    def dDf(S): return (-ln * af * np.exp(-np.outer(S, ln))).sum(1)
    sig = np.linspace(-A, B, int((A + B) / 1.0) + 1)
    y0 = -0.5
    while y0 < Tmax + 0.5:
        tt = np.arange(y0, y0 + 20.0, 0.04)
        S = (sig[:, None] + 1j * tt[None, :]).ravel()
        for _ in range(60):
            with np.errstate(all="ignore"):
                S = S - Df(S) / dDf(S)
            S = S[np.isfinite(S)]
            S = S[(S.real > -A - 5) & (S.real < B + 5)]
        with np.errstate(all="ignore"):
            S = S[np.abs(Df(S)) < 1e-9 * (1 + np.exp(-S.real * uf))]
        for z in S:
            found[(round(z.real, 6), round(z.imag, 6))] = z
        y0 += 20.0
    cand = sorted(found.values(), key=lambda z: (z.imag, z.real))
    # refine and certify in balls
    zeros = []
    for z in cand:
        zb = acb(float(z.real), float(z.imag))
        for _ in range(8):
            zb = (zb - D(zb) / dD(zb)).mid()
        ball = acb(arb(zb.real.mid(), 1e-25), arb(zb.imag.mid(), 1e-25))
        Nw = zb - D(zb) / dD(ball)
        ok = ball.contains(Nw) and not dD(ball).contains(0)
        if not ok: raise RuntimeError("zero not certified %s" % z)
        zeros.append(zb)
    # distinct: remove duplicates closer than 1e-20
    zeros.sort(key=lambda z: (float(z.imag.mid()), float(z.real.mid())))
    uniq = []
    for z in zeros:
        if uniq and float(abs(z - uniq[-1]).mid()) < 1e-12: continue
        if any(float(abs(z - w).mid()) < 1e-12 for w in uniq[-8:]): continue
        uniq.append(z)
    upper = [z for z in uniq if z.imag > 0]
    real0 = [z for z in uniq if abs(float(z.imag.mid())) < 1e-13]
    allz = upper + [z.conjugate() for z in upper] + real0
    # h = sum c_k e^{i mu_k s}
    cs = [arb(1) / 16, -arb(1) / 4, arb(3) / 8, -arb(1) / 4, arb(1) / 16]
    mus = [arb(tau) + 2 * arb.pi() * k / u for k in (-2, -1, 0, 1, 2)]
    def E(z):
        if z.contains(0): return acb(u)
        return ((z * u).exp() - 1) / z
    def Ea(z, a_):   # int_a^u e^{z s} ds
        if z.contains(0): return acb(u - a_)
        return ((z * u).exp() - (z * a_).exp()) / z
    nrm = u * 35 / 128
    lam = log_coeffs(a, P)
    lhs = arb(0)
    for n in range(2, P):
        a_ = lnb[n - 1]
        ip = acb(0)
        for j in range(5):
            for k in range(5):
                ip += cs[j] * cs[k] * (-I * mus[k] * a_).exp() * Ea(I * (mus[k] - mus[j]), a_)
        lhs += -2 * (lam[n] / arb(n).sqrt() * ip).real
    E0 = [[E(I * (mus[k] - mus[j])) for k in range(5)] for j in range(5)]
    def K(w):
        r = acb(0)
        for j in range(5):
            for k in range(5):
                r += cs[j] * cs[k] * ((E0[j][k] - E(w - I * mus[j])) / (I * mus[k] - w) + (E0[j][k] - E(w + I * mus[k])) / (-I * mus[j] - w))
        return r
    Kv = [(float(abs(z.imag).mid()), K(z - arb(1) / 2)) for z in allz]
    aP = a[P]
    out = dict(name=name, P=P, tau=tau, aP=float(aP.mid()), A=A, B=B, lhs_over_norm=float((lhs / nrm).mid()), rows=[])
    for T in Ts:
        sel = [z for z in allz if abs(z.imag) < T]
        # argument principle count
        def f(z, _): return dD(z) / D(z)
        bot = acb.integral(f, acb(-A, -T), acb(B, -T), rel_tol=arb(2) ** -30)
        top = acb.integral(f, acb(B, T), acb(-A, T), rel_tol=arb(2) ** -30)
        right = D(acb(B, T)).log() - D(acb(B, -T)).log()
        def eps(s): return D(s) / (aP * (-s * u).exp())
        left = 2 * I * u * T + eps(acb(-A, -T)).log() - eps(acb(-A, T)).log()
        cnt = (bot + right + top + left) / (2 * arb.pi() * I)
        cnt_i = int(round(float(cnt.real.mid())))
        okc = (abs(cnt - cnt_i) < arb(0.01)) is True
        rhs = -u * nrm
        s = acb(0)
        for (y, kv) in Kv:
            if y < T: s += kv
        rhs = rhs + s.real
        diff = (lhs - rhs) / nrm
        diff_with_log = (lhs - rhs - aP.abs_lower().log() * nrm) / nrm if float(aP.mid()) != 1 else diff
        tail_pred = (u - 2 * abs(aP).log()) / (arb.pi() * T)
        row = dict(T=T, zeros_certified=len(sel), count_argument_principle=str(cnt.real), count_ok=bool(okc and cnt_i == len(sel)),
                   right_of_line=sum(1 for z in sel if z.real > arb(1) / 2),
                   rhs_over_norm=float((rhs / nrm).mid()), diff=float(diff.mid()), diff_rad=float(diff.rad()), diff_imag_sum=float(abs(s.imag).mid()),
                   diff_times_T=float((diff * T).mid()), tail_pred_times_T=float((tail_pred * T).mid()),
                   diff_minus_tail=float((diff - tail_pred).mid()),
                   diff_if_logaP_term_kept=float(diff_with_log.mid()))
        out["rows"].append(row)
        print(name, json.dumps(row), flush=True)
    # mean real part of the zeros
    selT = [z for z in allz if abs(z.imag) < Tmax]
    out["mean_re_beta"] = float((sum((z.real for z in selT), arb(0)) / len(selT)).mid())
    out["log_aP_over_u"] = float((abs(aP).log() / u).mid())
    out["seconds"] = round(time.time() - t0, 1)
    print(name, "lhs/norm", out["lhs_over_norm"], "mean Re beta", out["mean_re_beta"], "log|a_P|/u", out["log_aP_over_u"], "t", out["seconds"], flush=True)
    return out

if __name__ == "__main__":
    Ts = [150, 600, 2400]
    res = []
    ones = lambda P: {n: (1, 1) for n in range(1, P + 1)}
    res.append(run("zeta P=12", 12, 9, ones(12), Ts))
    res.append(run("zeta P=20", 20, 15, ones(20), Ts))
    a = ones(12); a[12] = (3, 1)
    res.append(run("a_n=1, a_12=3", 12, 9, a, Ts))
    a = ones(12); a[12] = (1, 4); a[5] = (-3, 2); a[6] = (2, 1)
    res.append(run("non-mult, a_12=1/4", 12, 9, a, Ts))
    lio = {n: ((-1) ** sum(1 for _ in __import__('sympy').factorint(n, multiple=True)), 1) for n in range(1, 21)}
    res.append(run("Liouville P=20", 20, 15, lio, Ts))
    json.dump(res, open("tz_bridge_balls.json", "w"), indent=1)
