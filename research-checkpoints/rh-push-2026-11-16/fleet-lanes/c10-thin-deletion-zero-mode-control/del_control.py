# Thin prime deletion control DEL_b: S = greedy floor set for L(x) = m (Ei(b log x) - Ei(b log 2)),
# F(s) = prod_{p not in S} (1 - p^-s)^-1 = zeta(s) G(s), G(s) = prod_{p in S} (1 - p^-s).
# Ball arithmetic (python-flint arb/acb). Planned memory: sieve bytearray of X+1 = 1e7 bytes (10 MB);
# list of |S| <= 2e6 Python ints (< 100 MB). No other large allocation.
import sys, json, math
from flint import arb, acb, ctx
ctx.prec = 128

def sieve(n):
    print(f"planned allocation: bytearray of {n+1} bytes", flush=True)
    s = bytearray([1]) * (n + 1); s[0] = s[1] = 0
    for i in range(2, int(n ** 0.5) + 1):
        if s[i]: s[i * i::i] = bytearray(len(range(i * i, n + 1, i)))
    return s

def Lball(x, b, m, prec=None):
    return m * ((b * arb(x).log()).ei() - (b * arb(2).log()).ei())

def floorL(p, b, m):
    if p == 2: return 0, 64      # L(2) = 0 exactly
    for pr in (64, 128, 256, 512):
        ctx.prec = pr
        f = Lball(p, b, m).floor().unique_fmpz()
        if f is not None:
            ctx.prec = 128
            return int(f), pr
    raise RuntimeError("floor undecided at 512 bits for p=%d" % p)

def build(X, b, m, marks):
    """greedy floor rule: c_n = min(c_{n-1}+1, floor(L(p_n))). Returns S list and statistics.
    D at primes: c_n - L(p_n); infimum of D on [p_n, p_{n+1}) is c_n - L(p_{n+1})."""
    sv = sieve(X)
    S = []; c = 0; n = 0; maxprec = 64
    minD_at = 0.0; maxD_at = -9.0; infD = 0.0; infD_hi = 0.0; prevc = 0
    snap = {}
    mk = sorted(marks); mi = 0
    for p in range(2, X + 1):
        if not sv[p]: continue
        while mi < len(mk) and mk[mi] < p:
            snap[mk[mi]] = (len(S), c); mi += 1
        n += 1
        f, pr = floorL(p, b, m); maxprec = max(maxprec, pr)
        Lp = float(Lball(p, b, m).mid())
        infD = min(infD, prevc - Lp)          # left limit of D at p
        if p > 10 ** 5: infD_hi = min(infD_hi, prevc - Lp)
        cn = min(c + 1, f)
        if cn > c: S.append(p)
        c = cn; prevc = c
        d = c - Lp
        minD_at = min(minD_at, d); maxD_at = max(maxD_at, d)
    while mi < len(mk):
        snap[mk[mi]] = (len(S), c); mi += 1
    return S, dict(nprimes=n, sizeS=len(S), minD_at_primes=minD_at, maxD_at_primes=maxD_at,
                   infD_all_x=infD, infD_x_above_1e5=infD_hi, max_prec_for_floor=maxprec), snap

EULER = arb.const_euler()

def Ein(z, K=120):
    # Ein(z) = sum_{k>=1} (-1)^(k+1) z^k / (k k!), entire. Tail bound geometric.
    z = acb(z); tot = acb(0); term = acb(1)   # term = z^k/k!
    for k in range(1, K + 1):
        term = term * z / k
        tot += (term / k) if k % 2 == 1 else -(term / k)
    az = abs(z).upper()
    tail = abs(term).upper() * az / (K + 1) / (K + 1)
    r = az / (K + 2)
    assert float(r) < 0.5
    tail = tail / (1 - r)
    return tot + acb(arb(0, float(tail)), arb(0, float(tail)))

def pieces(S_X, X, piS_X, b, m, s):
    """returns A_X(s), T_X(s), bound on |T - T_X| (valid with D <= 0), D(X)"""
    s = acb(s); b_ = arb(b)
    P = acb(0); T = acb(0)
    for p in S_X:
        u = acb(p) ** (-s)
        P += u
        T += (1 - u).log() + u
    lX = arb(X).log(); l2 = arb(2).log()
    I = m * ((lX / l2).log() - Ein((s - b_) * lX) + Ein((s - b_) * l2))
    DX = arb(piS_X) - Lball(X, b, m)
    A = P - I - DX * acb(X) ** (-s)
    sig2 = 2 * s.real
    assert (sig2 - b_ > 0)
    # sum_{p in S, p > X} p^-sig2 <= -D(X) X^-sig2 + m E_1((sig2 - b) log X)   (uses D <= 0)
    tailsum = (-DX) * arb(X) ** (-sig2) + m * ((sig2 - b_) * lX).expint(1)
    uX = arb(X) ** (-s.real)
    Tb = tailsum / (2 * (1 - uX))
    return A, T, Tb, DX

def run(b, m, X, marks):
    S, st, snap = build(X, b, m, marks)
    out = dict(b=str(b), m=str(m), X=X, build=st)
    print(json.dumps(out), flush=True)
    b_ = arb(b)
    l2 = arb(2).log()
    # --- X-stability at s = b, tail R_X dropped (R_X <= 0 is proved: this is a LOWER bound for W) ---
    stab = {}
    for Xm in marks:
        k, c = snap[Xm]
        A, T, Tb, DX = pieces(S[:k], Xm, c, b, m, b_)
        logGX = sum(((1 - arb(p) ** (-b_)).log() for p in S[:k]), arb(0))
        # W_X(b) = (log 2 e^gamma)^m exp(-A_X + T_X); T in [T_X - Tb, T_X]
        Wx_hi = (l2 * EULER.exp()) ** m * (-A.real + T.real).exp()
        Wx_lo = (l2 * EULER.exp()) ** m * (-A.real + T.real - Tb).exp()
        stab[Xm] = dict(sizeS=k, D_X=float(DX.mid()), A_X=float(A.real.mid()), T_X=float(T.real.mid()),
                        T_tail_bound=float(Tb.upper()), logG_X_at_b=float(logGX.mid()),
                        W_X_b_T_lo=float(Wx_lo.lower()), W_X_b_T_hi=float(Wx_hi.upper()))
    out["stability_at_b"] = stab
    ms = sorted(marks)
    a, z = stab[ms[0]], stab[ms[-1]]
    out["exponent_estimate"] = -(z["logG_X_at_b"] - a["logG_X_at_b"]) / (math.log(math.log(ms[-1])) - math.log(math.log(ms[0])))
    if m != 1:
        return out
    # --- tiers at s = b, X = top mark ---
    A, T, Tb, DX = pieces(S, X, len(S), b, m, b_)
    pref = l2 * EULER.exp()
    core_hi = pref * (-A.real + T.real).exp()            # with T upper = T_X
    core_lo = pref * (-A.real + T.real - Tb).exp()
    zb = b_.zeta()
    out["zeta_b"] = float(zb.mid())
    # Tier 0 (proved: D <= 0, so R_X <= 0): W(b) >= core_lo
    out["tier0_W_b_lower"] = float(core_lo.lower())
    # Tier E: explicit bounds on pi(x) - li(x) (RECALLED): Buthe on [2657, Y], Trudgian on [229, inf)
    Y = arb("1.4e25"); cb = arb(2) ** (2 - b_)
    J1 = ((arb(X).log() + 2) / arb(X).sqrt() - (Y.log() + 2) / Y.sqrt()) / (4 * arb.pi())
    v0 = (Y.log() / arb("6.455")).sqrt()
    J2 = arb("0.2795") * 2 * arb("6.455") ** arb("0.25") * v0.gamma_upper(arb("0.5"))   # Gamma(1/2, v0); python-flint: z.gamma_upper(s)
    # conditions C(y) for the far case x < y/2
    condB = float((arb(2 * X).log() ** 2 / arb(2 * X).sqrt()).upper()), float((2 * arb.pi() * (1 - arb(X) ** (b_ - 1))).lower())
    uY = Y.log()
    condT = float((arb("1.118") * uY ** arb("0.25") * (-(uY / arb("6.455")).sqrt()).exp()).upper()), float((1 - arb(X) ** (b_ - 1)).lower())
    eB_Y = float((Y.sqrt() * Y.log() / (8 * arb.pi())).upper())
    eT_Y = float((arb("0.2795") * Y * uY ** arb("-0.75") * (-(uY / arb("6.455")).sqrt()).exp()).lower())
    Rbound = arb(X) ** (-b_) + b_ * cb * (J1 + J2)      # 0 >= R_X(b) >= -Rbound
    WE_lo = core_lo; WE_hi = core_hi * Rbound.exp()
    out["tierE"] = dict(J1=float(J1.upper()), J2=float(J2.upper()), R_bound=float(Rbound.upper()),
                        cond_Buthe_lhs_rhs=condB, cond_Trudgian_lhs_rhs=condT, eB_Y=eB_Y, eT_Y=eT_Y,
                        D_X_ge_minus1=bool(DX > -1),
                        W_b_lo=float(WE_lo.lower()), W_b_hi=float(WE_hi.upper()),
                        Fprime_b_lo=float((zb * WE_hi).lower()), Fprime_b_hi=float((zb * WE_lo).upper()))
    # Tier M (hypothesis, not proved: D(x) >= -4 for all x >= X; observed inf up to X is in the build record)
    RM = 4 * arb(X) ** (-b_)
    out["tierM_W_b"] = [float((core_lo * (-RM).exp()).lower()), float((core_hi * RM.exp()).upper())]
    # --- algebra check at s = b + 0.1: direct product against the factored formula (both with tier E tail) ---
    s1 = b_ + arb("0.1")
    A1, T1, Tb1, _ = pieces(S, X, len(S), b, m, s1)
    logGX1 = sum(((1 - arb(p) ** (-s1)).log() for p in S), arb(0))
    tail_main = (-DX) * arb(X) ** (-s1) + ((s1 - b_) * arb(X).log()).expint(1)   # arb E_1, independent of Ein
    R1b = arb(X) ** (-s1) + s1 * cb * (J1 + J2)
    direct_hi = (logGX1 - tail_main + R1b).exp()      # log G = log G_X - sum_{p>X,S} p^-s + (T - T_X), R in [-R1b, 0]
    direct_lo = (logGX1 - tail_main - Tb1).exp()
    form_hi = (s1 - b_) * pref * (-Ein((s1 - b_) * l2).real - A1.real + T1.real + R1b).exp()
    form_lo = (s1 - b_) * pref * (-Ein((s1 - b_) * l2).real - A1.real + T1.real - Tb1).exp()
    out["algebra_check_s_b_plus_0.1"] = dict(direct=[float(direct_lo.lower()), float(direct_hi.upper())],
                                             formula=[float(form_lo.lower()), float(form_hi.upper())],
                                             G_X_upper=float(logGX1.exp().upper()))
    # --- Tier M: W on the circle |s - b| = 0.05 (16 points) and on the real points b -+ 0.05 ---
    circ = []
    for j in range(16):
        th = 2 * arb.pi() * j / 16
        s = acb(b_ + arb("0.05") * th.cos(), arb("0.05") * th.sin())
        Aj, Tj, Tbj, _ = pieces(S, X, len(S), b, m, s)
        sig = s.real
        RMj = 4 * abs(s) * arb(X) ** (-sig) / sig
        W = pref * (-Ein((s - b_) * l2) - Aj + Tj).exp()
        err = float((RMj + Tbj).upper())
        circ.append(dict(re=float(s.real.mid()), im=float(s.imag.mid()), absW=float(abs(W).mid()),
                         argW=float(W.arg().mid()), log_err=err))
    out["tierM_circle"] = circ
    return out

if __name__ == "__main__":
    b = arb(sys.argv[1]); m = arb(sys.argv[2]); X = int(float(sys.argv[3]))
    marks = [10 ** 5, 10 ** 6, X] if X > 10 ** 6 else [10 ** 3, 10 ** 4, X]
    marks = sorted(set(marks))
    o = run(b, m, X, marks)
    fn = f"del_b{sys.argv[1]}_m{sys.argv[2]}_X{X:.0e}.json"
    json.dump(o, open(fn, "w"), indent=1)
    print(json.dumps(o, indent=1))
