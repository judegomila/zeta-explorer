# Second-referee numeric check of the thin prime deletion control DEL_b (lane c10-thin-deletion-zero-mode-control).
# Independent code: numpy sieve, float64 Ei by power series (floor decisions near an integer re-decided with
# mpmath at 40 digits), no import from del_control.py. New cases b = 0.6 and b = 0.85, X = 2e7.
# Planned memory: sieve bool array of 2e7+1 bytes (20 MB), prime array 1.27e6 int64 (10 MB), a few float64
# arrays of the same length (< 100 MB in total).
# Usage: python ref2_del.py <absolute output json>
import sys, json, math, cmath
import numpy as np
import mpmath as mp

OUT = sys.argv[1]
X = 20_000_000
MARKS = [10**5, 10**6, 10**7, X]
GAMMA = 0.5772156649015329


def primes_upto(n):
    print(f"planned allocation: bool sieve {n+1} bytes", flush=True)
    s = np.ones(n + 1, dtype=bool); s[:2] = False
    for i in range(2, int(n**0.5) + 1):
        if s[i]:
            s[i*i::i] = False
    return np.flatnonzero(s)


def Ei_series(t):
    # Ei(t) = gamma + log t + sum_{k>=1} t^k/(k k!), t > 0, all terms positive (no cancellation); t <= 15 here
    t = np.asarray(t, dtype=np.float64)
    tot = np.zeros_like(t); term = np.ones_like(t)
    for k in range(1, 140):
        term = term * t / k
        tot += term / k
    return GAMMA + np.log(t) + tot


def Ein(z, K=160):
    # Ein(z) = sum_{k>=1} (-1)^(k+1) z^k/(k k!), entire; |z| <= 4 here
    z = complex(z); tot = 0j; term = 1 + 0j
    for k in range(1, K + 1):
        term = term * z / k
        tot += term / k if k % 2 else -term / k
    return tot


def build(P, b, m):
    L = m * (Ei_series(b * np.log(P)) - Ei_series(np.array([b * math.log(2)]))[0])
    L[0] = 0.0
    fl = np.floor(L)
    # re-decide floors within 1e-6 of an integer with mpmath (40 digits)
    near = np.flatnonzero(np.minimum(L - fl, fl + 1 - L) < 1e-6)
    mp.mp.dps = 40
    e2 = mp.ei(mp.mpf(b) * mp.log(2))
    redecided = 0
    for i in near:
        if i == 0:
            continue
        v = mp.mpf(m) * (mp.ei(mp.mpf(b) * mp.log(int(P[i]))) - e2)
        fl[i] = float(mp.floor(v)); redecided += 1
    fl = fl.astype(np.int64)
    inS = np.zeros(len(P), dtype=bool)
    c = 0
    cs = np.zeros(len(P), dtype=np.int64)
    for n in range(len(P)):
        f = fl[n]
        if c + 1 <= f:
            c += 1; inS[n] = True
        cs[n] = c
    D_at = cs - L                       # D at primes
    D_left = np.empty(len(P)); D_left[0] = 0.0
    D_left[1:] = cs[:-1] - L[1:]        # left limit of D at the next prime = infimum on the gap
    assert D_at.max() <= 1e-9, "D > 0 found"
    return inS, cs, L, D_at, D_left, redecided


def run(b, m, P, logP):
    inS, cs, L, D_at, D_left, redec = build(P, b, m)
    S = P[inS]; lS = logP[inS]
    out = dict(b=b, m=m, X=X, n_primes=int(len(P)), size_S=int(len(S)), first_S=[int(v) for v in S[:10]],
               floors_redecided_mpmath=redec, max_D=float(D_at.max()), inf_D=float(D_left.min()))
    # D by decade (Lemma 0: bounded below by C x^(b-eta); observed size)
    out["inf_D_by_range"] = {}
    lo = 2
    for hi in (10**3, 10**4, 10**5, 10**6, 10**7, X):
        sel = (P > lo) & (P <= hi)
        out["inf_D_by_range"][f"({lo},{hi}]"] = float(D_left[sel].min())
        lo = hi
    l2 = math.log(2.0)
    pref = (l2 * math.exp(GAMMA)) ** m

    def WX(s, Xm):
        # W_X(s) = pref * exp(-m Ein((s-b) log 2) - A_X(s) + T_X(s)), tail R_X dropped; entire formula in s
        k = int(np.searchsorted(S, Xm, side="right"))
        pw = np.exp(-s * lS[:k])
        Psum = pw.sum()
        T = (np.log1p(-pw) + pw).sum()
        lX = math.log(Xm)
        I = m * (math.log(lX / l2) - Ein((s - b) * lX) + Ein((s - b) * l2))
        DX = k - m * (float(mp.ei(b * lX)) - float(mp.ei(b * l2)))
        A = Psum - I - DX * cmath.exp(-s * lX)
        return pref * cmath.exp(-m * Ein((s - b) * l2) - A + T), k, DX

    # (1) not identically zero / exponent at b from the X-direction
    stab = {}
    for Xm in MARKS:
        W, k, DX = WX(complex(b), Xm)
        logG = float(np.log1p(-np.exp(-b * lS[:k])).sum())
        stab[Xm] = dict(size_S=k, D_X=DX, logG_X_b=logG, W_X_b=W.real)
    out["at_b"] = stab
    a, z = stab[MARKS[0]], stab[MARKS[-1]]
    out["exponent_X_direction"] = -(z["logG_X_b"] - a["logG_X_b"]) / (math.log(math.log(MARKS[-1])) - math.log(math.log(MARKS[0])))
    # (2) exponent from the s-direction: G(b+d) for d -> 0+, direct product to X with the tail main term
    #     G(s) = G_X(s) exp(-m E_1((s-b) log X) + [D(X) X^-s - R_X(s)] + (T - T_X)); the bracket and T - T_X are
    #     dropped: |D(X)| X^-s <= 4 X^-b, |T - T_X| <= tau_X (lane 2.2), R_X(s) in [-|R|, 0].
    sdir = []
    lX = math.log(X)
    for d in (0.4, 0.2, 0.1, 0.05, 0.025, 0.0125):
        s = b + d
        logGX = float(np.log1p(-np.exp(-s * lS)).sum())
        tail = m * float(mp.e1(d * lX))
        logG = logGX - tail
        sdir.append(dict(d=d, logG=logG, G=math.exp(logG), G_over_d_pow_m=math.exp(logG) / d**m,
                         G_over_d=math.exp(logG) / d))
    for i in range(1, len(sdir)):
        sdir[i]["local_exponent"] = (sdir[i]["logG"] - sdir[i-1]["logG"]) / (math.log(sdir[i]["d"]) - math.log(sdir[i-1]["d"]))
    out["s_direction"] = sdir
    # (3) values right of b: G(1) (residue of F at 1) and G(2): positive, enclosure of G(1) from D <= 0 only
    for u in (1.0, 2.0):
        logGX = float(np.log1p(-np.exp(-u * lS)).sum())
        DX = stab[X]["D_X"]
        tail_hi = -DX * X ** (-u) + m * float(mp.e1((u - b) * lX))          # >= sum_{p in S, p > X} p^-u  (D <= 0)
        t2 = -DX * X ** (-2 * u) + m * float(mp.e1((2 * u - b) * lX))
        lo_ = math.exp(logGX - tail_hi - t2 / (2 * (1 - X ** (-u))))
        out[f"G({u})_in"] = [lo_, math.exp(logGX)]
    # (4) MEASURED continuation left of b: stability of W_X(s) in X at points with Re s < b (formula is entire in s;
    #     the dropped tail is s int_X^inf D x^(-s-1) dx, small iff D stays small beyond X)
    left = {}
    pts = [complex(b - 0.05), complex(b - 0.1), complex(b - 0.05, 2.0), complex(b + 0.05)]
    for s in pts:
        row = {}
        for Xm in MARKS:
            W, _, _ = WX(s, Xm)
            row[Xm] = [W.real, W.imag]
        left[f"{s.real:.3f}{s.imag:+.1f}i"] = row
    out["W_X_left_of_b"] = left
    if m == 1:
        zl = complex(mp.zeta(b - 0.05)); zr = complex(mp.zeta(b + 0.05))
        Wl = left[f"{b-0.05:.3f}+0.0i"][X][0]; Wr = left[f"{b+0.05:.3f}+0.0i"][X][0]
        out["F_continued_at_b-0.05_and_b+0.05"] = [zl.real * (-0.05) * Wl, zr.real * 0.05 * Wr]
    return out


def tierE(b, WXb, DX):
    mp.mp.dps = 30
    Y = mp.mpf("1.4e25"); cb = 2 ** (2 - mp.mpf(b))
    J1 = ((mp.log(X) + 2) / mp.sqrt(X) - (mp.log(Y) + 2) / mp.sqrt(Y)) / (4 * mp.pi)
    v0 = mp.sqrt(mp.log(Y) / mp.mpf("6.455"))
    J2 = mp.mpf("0.2795") * 2 * mp.mpf("6.455") ** 0.25 * mp.gammainc(0.5, v0)
    J2q = mp.quad(lambda u: mp.mpf("0.2795") * u ** (-0.75) * mp.exp(-mp.sqrt(u / mp.mpf("6.455"))), [mp.log(Y), 400, mp.inf])
    # sensitivity: Fiori-Kadiri-Swidinsky form 9.2211 x sqrt(log x) exp(-0.8476 sqrt(log x)), x >= 2
    J2fks = mp.quad(lambda u: mp.mpf("9.2211") * mp.sqrt(u) * mp.exp(-mp.mpf("0.8476") * mp.sqrt(u)), [mp.log(Y), 400, 4000, mp.inf])
    R = X ** (-mp.mpf(b)) + b * cb * (J1 + J2)
    Rf = X ** (-mp.mpf(b)) + b * cb * (J1 + J2fks)
    # far-case conditions at y = 2X (Buthe) and y = Y (Trudgian): 4 e(y) log y / y < 1 - X^(b-1)
    condB = float(mp.log(2 * X) ** 2 / (2 * mp.pi * mp.sqrt(2 * X)))
    condT = float(4 * mp.mpf("0.2795") * mp.log(Y) ** 0.25 * mp.exp(-v0))
    eB_Y = float(mp.sqrt(Y) * mp.log(Y) / (8 * mp.pi)); eT_Y = float(mp.mpf("0.2795") * Y * mp.log(Y) ** (-0.75) * mp.exp(-v0))
    return dict(J1=float(J1), J2_closed=float(J2), J2_quad=float(J2q), J2_FKS=float(J2fks), R_bound=float(R),
                R_bound_FKS=float(Rf), W_b_in=[WXb, WXb * float(mp.exp(R))], W_b_in_FKS=[WXb, WXb * float(mp.exp(Rf))],
                cond_far_Buthe=[condB, 1 - X ** (b - 1)], cond_far_Trudgian=[condT, 1 - X ** (b - 1)],
                eB_at_Y=eB_Y, eT_at_Y=eT_Y, majorant_monotone_at_Y=bool(eB_Y <= eT_Y), D_X=DX, D_X_ge_minus_1=bool(DX >= -1))


if __name__ == "__main__":
    P = primes_upto(X)
    logP = np.log(P.astype(np.float64))
    res = {}
    for b in (0.6, 0.85):
        for m in (1.0, 0.5):
            key = f"b={b},m={m}"
            res[key] = run(b, m, P, logP)
            print(key, json.dumps({k: res[key][k] for k in ("size_S", "inf_D", "exponent_X_direction")}), flush=True)
        r = res[f"b={b},m=1.0"]
        res[f"tierE_b={b}"] = tierE(b, r["at_b"][X]["W_X_b"], r["at_b"][X]["D_X"])
    json.dump(res, open(OUT, "w"), indent=1)
    print(json.dumps(res, indent=1))
