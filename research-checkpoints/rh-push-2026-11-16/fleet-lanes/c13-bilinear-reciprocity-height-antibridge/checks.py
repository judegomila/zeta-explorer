# c13-bilinear-reciprocity-height-antibridge: numeric checks (mpmath, single process, small memory).
# Planned allocations: lists of at most ~2e4 mpf numbers (< 50 MB). No dense matrix above 6 x 6.
# Run: scripts/memcap.sh 8 .venv-arb/bin/python -u <this file> [A B C D E]
import sys, time
import numpy as np
from mpmath import mp, mpf, mpc, zeta, gamma, pi, exp, log, sin, cos, sqrt, rf, factorial, fabs, re, im, conj, nstr, arg

mp.dps = 34
I = mpc(0, 1)
parts = sys.argv[1:] or list("ABCDE")
t0 = time.time()

def e(x):
    return exp(2 * pi * I * x)

def hz(u, r, k):
    return zeta(u, mpf(r) / k)

def estermann(u, w, h, k):
    """D(u,w;h/k) = sum sigma_w(n) e(nh/k) n^-u, continued through Hurwitz zeta."""
    A = [hz(u, r, k) for r in range(1, k + 1)]
    B = [hz(u - w, l, k) for l in range(1, k + 1)]
    tot = mpc(0)
    for r in range(1, k + 1):
        for l in range(1, k + 1):
            tot += e(mpf((r * l * h) % k) / k) * A[r - 1] * B[l - 1]
    return mpf(k) ** (w - 2 * u) * tot

def primroot(q):
    for g in range(2, q):
        seen, x = set(), 1
        for _ in range(q - 1):
            x = x * g % q; seen.add(x)
        if len(seen) == q - 1:
            return g

def chars(q):
    """list of dicts r -> chi_k(r), k = 0..q-2 (q prime); chi_k(g^m) = e(km/(q-1))"""
    g = primroot(q); ind = {}; x = 1
    for m in range(q - 1):
        ind[x] = m; x = x * g % q
    return [{r: e(mpf(k * ind[r]) / (q - 1)) for r in range(1, q)} for k in range(q - 1)]

def Lval(s, chi, q):
    return mpf(q) ** (-s) * sum(chi[r] * zeta(s, mpf(r) / q) for r in range(1, q))

def chi_fe(u):  # zeta(u) = chi_fe(u) zeta(1-u)
    return 2 ** u * pi ** (u - 1) * sin(pi * u / 2) * gamma(1 - u)

def Q2j(j, s):
    p = mpf(1)
    for l in range(j):
        p *= (mpf(1) / 2 + l) ** 2 - s ** 2
    return p

# ---------------------------------------------------------------- part A
def Mstar(s, a, q, CH):
    """Bettin Thm 5 object at z = 0: q^s/phi(q) sum*_chi chi(a) L(s,chi) L(s,chibar) + (q^(1-s)+q^s-2) zeta(s)^2/phi(q)."""
    tot = mpc(0)
    for k in range(1, q - 1):
        chi = CH[k]; chib = CH[(q - 1 - k) % (q - 1)]
        tot += chi[a % q] * Lval(s, chi, q) * Lval(s, chib, q)
    zz = zeta(s) ** 2
    return mpf(q) ** s / (q - 1) * tot + (mpf(q) ** (1 - s) + mpf(q) ** s - 2) * zz / (q - 1), tot, zz

if "A" in parts:
    print("== A. Moment <-> Estermann (Bettin Thm 5 at z = 0): bilinear pair at s")
    for (a, q) in [(2, 5), (3, 7)]:
        CH = chars(q)
        for s in [mpc(0.5, 2.5), mpc(0.5, 10), mpc(0.3, 1.7)]:
            Mp, nonpr, zz = Mstar(s, a, q, CH)
            Mm, _, _ = Mstar(s, q - a, q, CH)
            rhs = (2 * pi) ** (-s) * gamma(s) * (exp(pi * I * s / 2) * Mp + exp(-pi * I * s / 2) * Mm)
            lhs = estermann(s, 2 * s - 1, a, q)
            print(f" a={a} q={q} s={nstr(s,6)}: D={nstr(lhs,12)}  |D-rhs|={nstr(fabs(lhs-rhs),3)}  "
                  f"zeta(s)^2={nstr(zz,8)}  zeta part of M*={nstr((mpf(q)**(1-s)+mpf(q)**s-2)*zz/(q-1),8)}  nonprincipal part={nstr(mpf(q)**s/(q-1)*nonpr,8)}")
    print(f"   [t={time.time()-t0:.1f}s]")

# ---------------------------------------------------------------- part B
def H_kernel(w, s):
    return (2 * pi) ** (2 * w) * gamma(-w) / (chi_fe(mpf(1) / 2 + w - s) * chi_fe(mpf(1) / 2 + w + s))

def remainder(s, x, J, V, c=mpf(-3) / 4, vmin=None, nodes=40, step=1.0):
    """E_J(s,x) = (1/2 pi i) int_(c) [H(w,s) - sum_{j<=J} (-1)^j Q_2j Gamma(w-j)/j!] zeta(1/2+w-s) zeta(1/2+w+s) (2 pi i/x)^(-w) dw"""
    xs, ws = np.polynomial.legendre.leggauss(nodes)
    coef = [(-1) ** j * Q2j(j, s) / factorial(j) for j in range(J + 1)]
    lg = log(2 * pi / x) + I * pi / 2
    def f(v):
        w = c + I * v
        g = gamma(w); T = mpc(0); gj = g
        for j in range(J + 1):
            if j > 0:
                gj = gj / (w - j)
            T += coef[j] * gj
        G = H_kernel(w, s) - T
        return G * zeta(mpf(1) / 2 + w - s) * zeta(mpf(1) / 2 + w + s) * exp(-w * lg)
    if vmin is None:
        vmin = -40 - abs(float(im(s)))
    tot = mpc(0); v = vmin; nev = 0; last = None
    while v < V:
        h = step
        for xi, wi in zip(xs, ws):
            val = f(mpf(v + h / 2 * (xi + 1)))
            tot += mpf(wi * h / 2) * val; nev += 1
        v += h
    tail = fabs(f(mpf(V)))
    return tot / (2 * pi), tail, nev

def recip_rhs(s, a, q, J):
    x = mpf(a) / q
    y = x / (2 * pi * I)
    tot = mpc(0); rows = []
    for j in range(J + 1):
        cj = (-1) ** j * Q2j(j, s) / factorial(j)
        Dj = estermann(mpf(1) / 2 + s + j, 2 * s, (-q) % a if a > 1 else 0, a)
        zsum = sum((-1) ** (j - l) / factorial(j - l) * zeta(mpf(1) / 2 + l + s) * zeta(mpf(1) / 2 + l - s) * y ** l for l in range(j + 1))
        pol = (gamma(mpf(1) / 2 + s - j) * zeta(1 + 2 * s) * (2 * pi / x) ** (-(mpf(1) / 2 + s)) * exp(-(mpf(1) / 2 + s) * pi * I / 2)
               + gamma(mpf(1) / 2 - s - j) * zeta(1 - 2 * s) * (2 * pi / x) ** (-(mpf(1) / 2 - s)) * exp(-(mpf(1) / 2 - s) * pi * I / 2))
        rows.append((j, cj * y ** j * Dj, -cj * zsum, -cj * pol))
        tot += cj * (y ** j * Dj - zsum - pol)
    return tot, rows

if "B" in parts:
    print("== B. Reciprocity a/q <-> -q/a for D(1/2+s, 2s; a/q) (Bettin Prop. after Lemma 8, truncated at J with explicit remainder)")
    cases = [(2, 5, mpc(0, 2.5), 6, 260.0), (3, 7, mpc(0, 2.5), 6, 260.0), (1, 5, mpc(0, 2.5), 6, 260.0),
             (2, 5, mpc(0, 10), 9, 500.0), (3, 7, mpc(0, 10), 9, 500.0), (2, 5, mpc(0.2, 1.5), 6, 260.0)]
    for (a, q, s, J, V) in cases:
        x = mpf(a) / q
        lhs = estermann(mpf(1) / 2 + s, 2 * s, a, q)
        rhs, rows = recip_rhs(s, a, q, J)
        c = mpf(-3) / 4 if abs(re(s)) < 0.2 else mpf(-0.85)
        EJ, tail, nev = remainder(s, x, J, V, c=c)
        print(f" a={a} q={q} s_B={nstr(s,5)} J={J} V={V}: LHS D_0(a/q)={nstr(lhs,12)}")
        print(f"    sum_j main={nstr(rhs,12)}  remainder E_J={nstr(EJ,12)}  |LHS-(main+E_J)|={nstr(fabs(lhs-rhs-EJ),3)}  (integrand at V: {nstr(tail,3)}, {nev} nodes)")
        j, dterm, zterm, pterm = rows[0]
        print(f"    j=0: dual Estermann D_0(-q/a)={nstr(dterm,10)}  zeta term -zeta(1/2+s)zeta(1/2-s)={nstr(zterm,10)}  polar term={nstr(pterm,10)}")
        print(f"    j=1: dual={nstr(rows[1][1],8)} zeta={nstr(rows[1][2],8)} polar={nstr(rows[1][3],8)}; without the dual terms |LHS-rest|={nstr(fabs(lhs-rhs-EJ+sum(r[1] for r in rows)),6)}")
        print(f"   [t={time.time()-t0:.1f}s]", flush=True)

# ---------------------------------------------------------------- part C
def Lam(s, chi, q, kap):
    return (mpf(q) / pi) ** ((s + kap) / 2) * gamma((s + kap) / 2) * Lval(s, chi, q)

def parity(chi, q):
    return 0 if abs(chi[q - 1] - 1) < 1e-10 else 1

def Rpair(t, k, q, CH):
    """Rotated entries of Bettin's M*(s,0;.,q) at s = 1/2 + it (common factor pi^-s, Hardy phase of the parity class):
    k != 0: R_chi = pi^-s Gamma((s+kap)/2)^2 q^s L(s,chi) L(s,chibar) / |Gamma((s+kap)/2)|^2   (= Z_chi(t) Z_chi(-t) up to a positive constant)
    k == 0: R_0   = pi^-s Gamma(s/2)^2 zeta(s)^2 (q^s + q^(1-s) - 2) / |Gamma(s/2)|^2          (= (2 sqrt(q) cos(t log q) - 2) Z(t)^2 pi^-1/2)"""
    s = mpc(0.5, t); chi = CH[k]; chib = CH[(q - 1 - k) % (q - 1)]; kap = parity(chi, q)
    if k == 0:
        return pi ** (-s) * gamma(s / 2) ** 2 * zeta(s) ** 2 * (mpf(q) ** s + mpf(q) ** (1 - s) - 2) / fabs(gamma(s / 2)) ** 2
    return pi ** (-s) * gamma((s + kap) / 2) ** 2 * mpf(q) ** s * Lval(s, chi, q) * Lval(s, chib, q) / fabs(gamma((s + kap) / 2)) ** 2

if "C" in parts:
    mp.dps = 20
    print("== C. J-form over characters: R_chi(t) = Z_chi(t) Z_chi(-t) (rotated bilinear pair), reality, sign changes, inertia")
    for q in [5, 7]:
        CH = chars(q); n = q - 1
        grid = [mpf(i) / 10 for i in range(0, 401)]
        tab = {k: [] for k in range(n)}; maxim = mpf(0)
        for t in grid:
            for k in range(n):
                v = Rpair(t, k, q, CH); maxim = max(maxim, fabs(im(v))); tab[k].append(float(re(v)))
        print(f" q={q}: max |Im R_chi(t)| over 401 heights x {n} characters = {nstr(maxim,3)}")
        for k in range(n):
            arr = np.array(tab[k]); sc = int(np.sum(arr[1:] * arr[:-1] < 0))
            kind = "zeta entry of M*" if k == 0 else ("real" if 2 * k == n else f"complex, pair with k={n-k}")
            print(f"   k={k} [{kind}]: R(0)={arr[0]:.6f} min={arr.min():.6f} max={arr.max():.6f} sign changes on (0,40]={sc}  fraction of heights with R<0: {np.mean(arr<0):.3f}")
        # inertia of the group matrix K_t[a,b] = sum_chi chi(a b^-1) R_chi(t)
        for t in [mpf(3), mpf(9.3), mpf(21.7)]:
            R = [Rpair(t, k, q, CH) for k in range(n)]
            K = np.zeros((n, n), dtype=complex)
            for a in range(1, q):
                for b in range(1, q):
                    binv = pow(b, q - 2, q)
                    K[a - 1, b - 1] = complex(sum(CH[k][a * binv % q] * R[k] for k in range(n)))
            asym = np.max(np.abs(K - K.T)); imx = np.max(np.abs(K.imag))
            ev = np.linalg.eigvalsh(K.real)
            negpairs = sum(1 for k in range(1, n) if 2 * k < n and re(R[k]) < 0); z0 = "neg" if re(R[0]) < 0 else "pos"
            print(f"   t={nstr(t,4)}: K_t real symmetric (max|Im|={imx:.1e}, asym={asym:.1e}); inertia (+,-)=({int(np.sum(ev>0))},{int(np.sum(ev<0))}); 2 x #(complex pairs with R<0) = {2*negpairs}, zeta entry {z0} (sign of cos(t log q) - q^-1/2: {nstr(cos(t*log(q))-mpf(q)**-0.5,3)}); trace/n = {float(np.trace(K.real))/n:.6f} = sum_chi R_chi = {float(re(sum(R))):.6f}")
        # cone functional: principal + lambda * (complex pair)
        a0 = np.array(tab[n // 2]); a1 = np.array(tab[1])
        for lam in [0.05, 1.0, -0.05, -1.0]:
            f = a0 + 2 * lam * a1
            print(f"   weight real character: 1, pair k=1: {lam:+}: min over grid of R_real + 2 lam R_1 = {f.min():.5f} at t={float(grid[int(f.argmin())]):.1f}")
    # values of the pair term at ordinates of zeta zeros (principal term vanishes there)
    from mpmath import zetazero
    CH = chars(5)
    vals = [float(re(Rpair(im(zetazero(n_)), 1, 5, CH))) for n_ in range(1, 13)]
    print("   q=5, pair k=1 at the first 12 zeta ordinates (zeta entry = 0 there):", " ".join(f"{v:+.3f}" for v in vals))
    mp.dps = 34
    print(f"   [t={time.time()-t0:.1f}s]", flush=True)

# ---------------------------------------------------------------- part D
if "D" in parts:
    mp.dps = 20
    print("== D. T-NR twin at q0 = 2, c = 2.1: pair term = mu_chi mu_chibar x (zeta-family pair term)")
    q0, c, q = 2, mpf("2.1"), 5
    CH = chars(q); n = q - 1
    mn, mx, worst = mpf(10), mpf(0), mpf(0)
    for i in range(0, 200):
        t = mpf(i) / 5 + mpf("0.07"); s = mpc(0.5, t); y = mpf(q0) ** (mpf(1) / 2 - s)
        for k in range(1, n):
            chi = CH[k]; chib = CH[(n - k) % n]
            Fk = Lval(s, chi, q) * (conj(chi[q0]) / y + c + chi[q0] * y)
            Fb = Lval(s, chib, q) * (conj(chib[q0]) / y + c + chib[q0] * y)
            base = Lval(s, chi, q) * Lval(s, chib, q)
            ratio = Fk * Fb / base
            mu = (c + 2 * re(chi[q0] * y)) * (c + 2 * re(chib[q0] * y))
            worst = max(worst, fabs(ratio - mu)); mn = min(mn, mu); mx = max(mx, mu)
    print(f"   over 200 heights x 3 characters mod 5: max |twin pair/zeta pair - mu_chi mu_chibar| = {nstr(worst,3)}; mu product in [{nstr(mn,6)}, {nstr(mx,6)}]; bounds (c-2)^2={nstr((c-2)**2,4)}, (c+2)^2={nstr((c+2)**2,5)}")
    from mpmath import acosh
    print(f"   twin zeros (principal character): Re s = 1/2 +- {nstr(acosh(c/2)/log(q0),8)} (inside the strip), ordinates (2m+1) pi/log 2")
    r = (-c + sqrt(c * c - 4)) / 2
    s0 = mpf(1) / 2 - log(-r) / log(q0) + I * pi / log(q0)
    print(f"   check: 2cosh((s0-1/2)log 2)+c at s0={nstr(s0,10)}: {nstr(fabs(mpf(q0)**(s0-0.5)+mpf(q0)**(0.5-s0)+c),3)}")
    mp.dps = 34

# ---------------------------------------------------------------- part E
if "E" in parts:
    mp.dps = 20
    print("== E. E_a control (real a): bilinear pair of E_a(s,chi) = L(s+a,chi)L(s-a,chi) is a Hermitian square on Re s = 1/2")
    q = 5; CH = chars(q); n = q - 1; worst = mpf(0); mnv = mpf(10) ** 9
    for a in [mpf("0.1"), mpf("0.3")]:
        for i in range(0, 60):
            t = mpf(i) / 2 + mpf("0.13"); s = mpc(0.5, t)
            for k in range(1, n):
                chi = CH[k]; chib = CH[(n - k) % n]; kap = parity(chi, q)
                b1 = Lam(s + a, chi, q, kap) * Lam(s - a, chib, q, kap)
                b2 = Lam(s - a, chi, q, kap) * Lam(s + a, chib, q, kap)
                pair = b1 * b2
                worst = max(worst, fabs(pair - fabs(b1) ** 2) / fabs(pair)); mnv = min(mnv, re(pair) / fabs(pair))
    print(f"   max relative |pair - |Lam(s+a,chi)Lam(s-a,chibar)|^2| = {nstr(worst,3)}; min of pair/|pair| = {nstr(mnv,8)} (always +1: no sign change)")
    mp.dps = 34
print(f"done [t={time.time()-t0:.1f}s]")
