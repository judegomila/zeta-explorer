"""Referee checks: Lemma J1', U8 heat inheritance (four-case sign rule), lanes 1, 3, 4, 6. Own code. mpmath + numpy; < 200 MB."""
import sys, json, math, cmath, random, numpy as np, mpmath as mp
OUT = sys.argv[1]; R = {}; rng = random.Random(161803)
mp.mp.dps = 40
# ---------- kernels (own implementation, mpmath, converged sums)
def Phi(u):
    u = abs(mp.mpf(u)); s = mp.mpf(0)          # Phi is even (theta functional equation); the series at u < 0 cancels catastrophically
    for n in range(1, 60):
        t = (2 * mp.pi ** 2 * n ** 4 * mp.exp(mp.mpf(9) * u / 2) - 3 * mp.pi * n * n * mp.exp(mp.mpf(5) * u / 2)) * mp.exp(-mp.pi * n * n * mp.exp(2 * u)); s += t
        if n > 3 and abs(t) < mp.mpf(10) ** -60 * abs(s): break
    return s
w3 = cmath.exp(2j * math.pi / 3)
chi7 = {0: 0}                                    # odd character mod 7 of order 6: chi(3) = e^(2 pi i/6)
gpow = 1
for k in range(6): chi7[gpow] = mp.exp(2j * mp.pi * k / 6); gpow = gpow * 3 % 7
def Kchi(u, ch, dpar, q=7):
    u = mp.mpf(u); s = mp.mpc(0)
    for n in range(1, 400):
        c = ch(n)
        if c == 0: continue
        t = c * n ** dpar * mp.exp(-mp.pi * n * n * mp.exp(2 * u) / q); s += t
        if n > 8 and abs(t) < mp.mpf(10) ** -55 * (abs(s) + mp.mpf(10) ** -300): break
    return mp.exp((mp.mpf(1) / 2 + dpar) * u) * s
chA = lambda n: chi7[n % 7]; chB = lambda n: chi7[n % 7] ** 2 if n % 7 else 0     # chi (odd, d=1), chi^2 (even, d=0)
KA = Phi; KB = lambda u: Kchi(u, chA, 1); KC = lambda u: Kchi(u, chB, 0)
g = lambda u, tau: mp.exp(mp.mpf(tau) * mp.mpf(u) ** 2 / 4)
# non-vanishing on the window (control-object lemma => numeric non-vanishing check)
us = [mp.mpf(k) / 20 for k in range(-52, 53)]
R["J1' non-vanishing: min Phi on [-2.6,2.6] (attained at abs u = 2.6; positive)"] = mp.nstr(min(Phi(u) for u in us), 5)
us1 = [mp.mpf(k) / 40 for k in range(0, 105)]      # abs K(-u) = abs K(u) (functional equation of the twisted theta series); u >= 0 only
R["J1' non-vanishing: min abs K_chi, min abs K_chi^2 on [-2.6,2.6] relative to max"] = [mp.nstr(min(abs(KB(u)) for u in us1) / max(abs(KB(u)) for u in us1), 5), mp.nstr(min(abs(KC(u)) for u in us1) / max(abs(KC(u)) for u in us1), 5)]
R["J1' non-vanishing on [-1,1]: min abs K_chi / max, min abs K_chi^2 / max"] = [mp.nstr(min(abs(KB(u)) for u in us1 if abs(u) <= 1) / max(abs(KB(u)) for u in us1), 5), mp.nstr(min(abs(KC(u)) for u in us1 if abs(u) <= 1) / max(abs(KC(u)) for u in us1), 5)]
# J1': the HEAT member built on the function side and brought back, against g*K (not a tautology):
# Xi_tau(z) = int g(u) Phi(u) e^{izu} du must equal sum_k (-tau/4)^k/k! Xi^(2k)(z)  (multiplier <-> differential operator)
tau = mp.mpf("-0.3"); z0 = mp.mpf("3.7")
Xi = lambda z: mp.quad(lambda u: Phi(u) * mp.cos(z * u), mp.linspace(-3, 3, 25))
lhs = mp.quad(lambda u: g(u, tau) * Phi(u) * mp.cos(z0 * u), mp.linspace(-3, 3, 25))
mom = lambda k: mp.quad(lambda u: Phi(u) * u ** (2 * k) * mp.cos(z0 * u), mp.linspace(-3, 3, 25))     # (-1)^k Xi^(2k)(z0)
rhs = sum((tau / 4) ** k / mp.factorial(k) * mom(k) for k in range(0, 40))
R["J1' HEAT member = pointwise Gaussian multiplier: function-side operator series vs transform of g*Phi (tau=-0.3, z=3.7)"] = [mp.nstr(lhs, 20), mp.nstr(rhs, 20), mp.nstr(abs(lhs - rhs) / abs(lhs), 3)]
# J1' instances and non-instances: values on the positive pair against the HEAT pair computed from independently evaluated members
worst = {"quot": 0, "cross": 0, "triple": 0, "two-point quotient (non-instance)": 0, "log of one member (non-instance)": 0, "unequal tau quotient (non-instance)": 0}
mp.mp.dps = 30
for _ in range(60):
    tau = -10 ** rng.uniform(-1.7, 0.3); u = rng.uniform(-1, 1); v = rng.uniform(-1, 1)
    hA = lambda x: mp.exp(mp.mpf(tau) * mp.mpf(x) ** 2 / 4 + mp.log(KA(x)))           # members of the HEAT pair, built separately
    hB = lambda x: KB(x) * mp.exp(mp.mpf(tau) / 4 * mp.mpf(x) * mp.mpf(x)); hC = lambda x: KC(x) * mp.exp(mp.mpf(tau) / 4 * mp.mpf(x) * mp.mpf(x))
    rel = lambda a, b: float(abs(a - b) / abs(a))
    worst["quot"] = max(worst["quot"], rel(KB(u) / KA(u), hB(u) / hA(u)))
    worst["cross"] = max(worst["cross"], rel(KA(u) * KB(v) / (KA(v) * KB(u)), hA(u) * hB(v) / (hA(v) * hB(u))))
    worst["triple"] = max(worst["triple"], rel(KB(u) ** 2 / (KA(u) * KC(u)), hB(u) ** 2 / (hA(u) * hC(u))))
    worst["two-point quotient (non-instance)"] = max(worst["two-point quotient (non-instance)"], rel(KB(u) / KA(v), hB(u) / hA(v)))
    worst["log of one member (non-instance)"] = max(worst["log of one member (non-instance)"], float(abs(mp.log(hA(u)) - mp.log(KA(u)))))
    worst["unequal tau quotient (non-instance)"] = max(worst["unequal tau quotient (non-instance)"], rel(KB(u) / KA(u), KB(u) * mp.exp(mp.mpf(tau) / 8 * mp.mpf(u) ** 2) / hA(u)))
R["J1' max relative change, HEAT pair vs positive pair (60 draws)"] = worst
# ---------- U8: monomial inequalities under backward heat; four-case rule  M <= lam inherited for all tau<0  iff  lam * S >= 0, S = sum e_i u_i^2
cases = {"upper bound, lam*S>=0: violations": 0, "upper bound, lam*S<0: violated for some tau": 0, "upper lam*S<0 total": 0, "upper lam*S>=0 total": 0,
         "lower bound, lam*S<=0: violations": 0, "lower bound, lam*S>0: violated for some tau": 0, "lower lam*S>0 total": 0, "lower lam*S<=0 total": 0}
for _ in range(4000):
    k = rng.choice([2, 3, 4]); u = [rng.uniform(-1.2, 1.2) for _ in range(k)]; e = [rng.choice([-3, -2, -1, 1, 2, 3]) for _ in range(k)]
    S = sum(ei * ui * ui for ei, ui in zip(e, u)); M = mp.mpf(1)
    for ei, ui in zip(e, u): M *= Phi(ui) ** ei
    sgn = rng.choice([1, -1]); M = sgn * M                          # also negative monomials (sign carried by a constant factor)
    for typ in ("upper", "lower"):
        slack = mp.mpf(10) ** rng.uniform(-3, 0.5)
        lam = M + abs(M) * slack if typ == "upper" else M - abs(M) * slack          # zeta satisfies the bound with relative slack
        if rng.random() < 0.3: lam = lam if (lam > 0) == (rng.random() < 0.5) else -lam
        ok0 = (M <= lam) if typ == "upper" else (M >= lam)
        if not ok0: continue
        viol = False
        for tau in (-0.02, -0.1, -0.5, -2.0, -8.0, -40.0):
            Mt = M * mp.exp(mp.mpf(tau) * S / 4)
            if (typ == "upper" and Mt > lam) or (typ == "lower" and Mt < lam): viol = True
        prod = float(lam) * S
        if typ == "upper":
            if prod >= 0: cases["upper lam*S>=0 total"] += 1; cases["upper bound, lam*S>=0: violations"] += viol
            else: cases["upper lam*S<0 total"] += 1; cases["upper bound, lam*S<0: violated for some tau"] += viol
        else:
            if prod <= 0: cases["lower lam*S<=0 total"] += 1; cases["lower bound, lam*S<=0: violations"] += viol
            else: cases["lower lam*S>0 total"] += 1; cases["lower bound, lam*S>0: violated for some tau"] += viol
R["U8 four-case rule on Phi, 4000 random monomials, tau in {-0.02..-40}"] = cases
# Turan ratio e=(1,1,-2) and the reverse ratio
u0, h = 0.3, 0.4; T0 = Phi(u0 - h) * Phi(u0 + h) / Phi(u0) ** 2
R["U8 Turan ratio at u=0.3,h=0.4: zeta, HEAT tau=-0.5 (factor exp(tau h^2/2))"] = [mp.nstr(T0, 12), mp.nstr(T0 * mp.exp(mp.mpf(-0.5) * h * h / 2), 12), mp.nstr(g(u0 - h, -0.5) * Phi(u0 - h) * g(u0 + h, -0.5) * Phi(u0 + h) / (g(u0, -0.5) * Phi(u0)) ** 2, 12)]
R["U8 threshold: reverse Turan bound 1/T <= lam, lam = (1+m)/T0 rejects HEAT(tau) iff abs(tau) h^2/2 > log(1+m); tau=-0.02,h=0.4 needs m <"] = math.expm1(0.02 * h * h / 2)
mp.mp.dps = 25
# ---------- lane 1: Proposition A (c): maximal gain <= N^delta ; M and the n = 1 term of L at zero 1
gam1 = mp.zetazero(1).imag; res = {}
for (delta, N) in ((0.5, 8), (0.5, 32), (0.03, 32)):
    mu0 = mp.mpc(delta / 2, -gam1 / 2)
    div = lambda m: [(a, m // a) for a in range(1, m + 1) if m % a == 0]
    K = mp.zeros(N, N); lam = mp.zeros(N, 1)
    for m in range(1, N + 1):
        lam[m - 1] = sum((mp.mpf(a) / d) ** mu0 for a, d in div(m))
        for n in range(1, N + 1):
            K[m - 1, n - 1] = sum((mp.mpf(a) / d) ** mu0 * mp.conj((mp.mpf(a2) / d2) ** mu0) * min(mp.mpf(d) / a, mp.mpf(d2) / a2) ** delta for a, d in div(m) for a2, d2 in div(n))
    # gain(x) = |sum x_m lam_m|^2 / x*Kx ; with the lane's convention the maximum is lam^H K^{-1} lam (K Hermitian positive)
    Kc = K.H if False else K
    y = mp.lu_solve(Kc.T, lam.apply(mp.conj)) if False else None
    Kn = np.array([[complex(K[i, j]) for j in range(N)] for i in range(N)]); ln = np.array([complex(lam[i]) for i in range(N)])
    ev = np.linalg.eigvalsh((Kn + Kn.conj().T) / 2)
    G1 = float(np.real(ln.conj() @ np.linalg.solve(Kn, ln))); G2 = float(np.real(ln @ np.linalg.solve(Kn, ln.conj())))
    res["delta=%g N=%d" % (delta, N)] = {"max gain (two index conventions)": [G1, G2], "N^delta": N ** delta, "min eig K": float(ev[0]), "hermitian defect": float(np.abs(Kn - Kn.conj().T).max())}
R["lane1 Prop A (claims: 2.7098 at N=8, 5.4586 at N=32 for delta=0.5; 1.10846 vs 1.10957 is zero 5)"] = res
rho = mp.mpc(0.5, gam1); xi = lambda s: mp.pi ** (-s / 2) * mp.gamma(s / 2) * mp.zeta(s)
Mv = mp.exp(mp.pi * gam1 / 2) * abs(xi(2 - rho)) ** 2 / mp.mpf("0.5"); nu = (rho - 1) / 2
J = mp.quad(lambda x: abs(mp.besselk(nu, x)) ** 2 / x, [2 * mp.pi, 8, 12, 20, 40])
R["lane1 Lemma 1 at zero 1: M (claim 1.77754), n=1 term of L (claim 1.20858), M - term > 0"] = [mp.nstr(Mv, 8), mp.nstr(8 * mp.exp(mp.pi * gam1 / 2) * J, 8)]
# ---------- lane 3: span law; combination zero
def Psi(t, al): return 2 * mp.siegeltheta(t + al) - 2 * mp.siegeltheta(t)
def defect_span(a, L):
    b = a + L; al = mp.findroot(lambda x: Psi(a, x) + Psi(b, x) - 4 * mp.pi, 2 * mp.pi / mp.log(a / (2 * mp.pi)))
    return 2 * abs(mp.sin((Psi(b, al) - 2 * mp.pi) / 2)), al
mp.mp.dps = 40; out = {}
for (T, eta) in ((1e6, 1e-6), (1e6, 1e-5), (1e8, 1e-6), (1e5, 1e-4)):
    lo, hi = 0, 1
    while defect_span(mp.mpf(T), hi)[0] <= eta: hi *= 2
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if defect_span(mp.mpf(T), mid)[0] <= eta: lo = mid
        else: hi = mid
    out["T=%g eta=%g" % (T, eta)] = [lo, eta * T * math.log(T / (2 * math.pi)) / math.pi]
R["lane3 K_tr largest span (claims 3 / 38 / 533 / 30; formula)"] = out
mp.mp.dps = 30
al = mp.mpf("0.8515322655932238"); s0 = mp.mpc("0.8947065986189371", "10084.778352651363")
F = lambda s: (mp.zeta(s) - mp.zeta(s + 1j * al)) / 2
z = mp.findroot(F, s0); R["lane3 combination (zeta(s)-zeta(s+i alpha))/2 zero near 0.8947+10084.778i: root, abs F, abs zeta(s) there (non-vanishing of the parts)"] = [mp.nstr(z, 15), mp.nstr(abs(F(z)), 3), mp.nstr(abs(mp.zeta(z)), 8)]
t = mp.mpf(10050); s = mp.mpc(0.5, t); chi = lambda s: mp.pi ** (s - mp.mpf(1) / 2) * mp.gamma((1 - s) / 2) / mp.gamma(s / 2)
lhs = mp.zeta(s + 1j * al) - chi(s) * mp.conj(mp.zeta(s + 1j * al)); rhs = mp.zeta(s + 1j * al) * (1 - mp.exp(1j * Psi(t, al)))
R["lane3 translate identity defect at t=10050"] = mp.nstr(abs(lhs - rhs), 3)
# ---------- lane 4: Fejer section, own prime side
def LF_scan(t0, t1, dt, P, twist=None):
    u = math.log(P); N = int(P); lamv = np.zeros(N + 1); sgn = np.ones(N + 1)
    sieve = np.ones(N + 1, dtype=bool); sieve[:2] = False
    for i in range(2, int(N ** 0.5) + 1):
        if sieve[i]: sieve[i * i::i] = False
    for p in np.nonzero(sieve)[0]:
        q = p; k = 1
        while q <= N:
            lamv[q] = math.log(p); sgn[q] = (-1) ** k if twist == "liouville" else 1; q *= p; k += 1
    n = np.nonzero(lamv)[0]; wts = lamv[n] * sgn[n] * (1 - np.log(n) / u) / np.sqrt(n); ts = np.arange(t0, t1, dt); out = []
    Ku = lambda w: 1 / w - (1 - cmath.exp(-u * w)) / (u * w * w)
    for t in ts:
        s = complex(0.5, t); gs = complex(mp.digamma(mp.mpc(s) / 2)) / 2 - math.log(math.pi) / 2; gp = complex(mp.polygamma(1, mp.mpc(s) / 2)) / 4
        prime = np.sum(wts * np.exp(-1j * t * np.log(n)))
        out.append((Ku(s) + Ku(s - 1) + gs + gp / u - prime - P ** (-s) / (u * s * s)).real)
    return np.array(out)
mp.mp.dps = 15
a = LF_scan(2000, 2100, 0.02, 2000.0); b = LF_scan(2000, 2100, 0.02, 2000.0, "liouville"); c = LF_scan(2000, 2100, 0.02, 2000.0 ** 0.5)
R["lane4 Re L_F on [2000,2100], P=t^1=2000: zeta min, frac<0; Liouville min, frac<0; zeta at P=44.7 min"] = [float(a.min()), float((a < 0).mean()), float(b.min()), float((b < 0).mean()), float(c.min())]
xs = np.linspace(0, 5, 26); ys = np.linspace(0.01, 200, 4000); mn = 1e9
for uu in (0.3, 1.9, 6.0, 13.8):
    for x in xs:
        w = x + 1j * ys; mn = min(mn, float((1 / w - (1 - np.exp(-uu * w)) / (uu * w * w)).real.min()))
R["lane4 Lemma 2: min Re K_u(w) on a grid of Re w >= 0"] = mn
# ---------- lane 6: Theorem E1' (iv) and a failing case; W1 number
def Ra(w, a, zeros):
    num = 1; den = 1
    for l in zeros: num *= (w - a - l); den *= (w + a - l)
    return num / den
zs_ok = [sx * 0.35 + sy * 3j for sx in (1, -1) for sy in (1, -1)] + [sx * 0.15 + sy * 3j for sx in (1, -1) for sy in (1, -1)]
zs_bad = [sx * 0.35 + sy * 3j for sx in (1, -1) for sy in (1, -1)] + [sx * 0.10 + sy * 3j for sx in (1, -1) for sy in (1, -1)]
W = np.array([complex(10 ** rng.uniform(-4, 1), rng.uniform(-8, 8)) for _ in range(200000)] + [complex(x, 3 + y) for x in np.linspace(1e-4, 0.3, 300) for y in np.linspace(-0.2, 0.2, 201)])
R["lane6 E1' (iv): sup abs R_a on Re w > 0, a=1/4: companion present (Schur predicted) / companion moved to 0.10 (not Schur)"] = [float(np.abs(Ra(W, 0.25, zs_ok)).max()), float(np.abs(Ra(W, 0.25, zs_bad)).max())]
A_, C_ = 4 / 3, 10.8
R["lane6 W1 delta(T) at 3e12, 1e30 (claims 0.4499, 0.4109)"] = [(1 + math.log(C_ * math.log(T)) / math.log(T)) / (2 * A_) for T in (3e12, 1e30)]
R["lane6 T-NR b for q=2, c=2.0506 (claim 0.3238)"] = math.acosh(2.0506 / 2) / math.log(2)
json.dump(R, open(OUT, "w"), indent=1); print(json.dumps(R, indent=1))
