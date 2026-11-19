# Independent referee checks for round-13 lanes 3 (multiplier orbit, T-NR) and 5 (Bettin reciprocity Lemma 1, sign rule).
import sys, os, json, math, random, time
from fractions import Fraction
from flint import arb, acb, ctx, dirichlet_char

out = {}
ctx.prec = 200
PI = acb.pi()
I = acb(0, 1)

# ------------------------------------------------------------------ lane 3
L3 = {}
for q, c in ((2, Fraction(205, 100)), (3, Fraction(22, 10)), (5, Fraction(-22, 10))):
    cc = arb(c.numerator) / c.denominator
    l = arb(q).log()
    P = lambda w: 2 * ((acb(w) - acb(1) / 2) * l).cosh() + cc
    a = (abs(cc) / 2).acosh() / l
    # 1/P(w) = sum g_j q^(-(j+1)(w-1/2))
    g = [Fraction(1), -c]
    for j in range(2, 400):
        g.append(-c * g[-1] - g[-2])
    w = acb(1.3, 0.7)
    x = (-(w - acb(1) / 2) * l).exp()
    ser = sum((arb(g[j].numerator) / g[j].denominator) * x ** (j + 1) for j in range(400))
    s1 = acb(0.3, 2.1)
    sym_w = abs(P(s1) / P(w) - P(s1) / P(1 - w)).abs_upper()
    sym_s = abs(P(s1) / P(w) - P(1 - s1) / P(w)).abs_upper()
    # coefficient form of P x (1/P) = 1 on frequencies m = q^(2k): delta
    # (1/P) has coefficient g_j at exponent j+1; P = x^-1 + c + x: product coefficient at exponent e: g_e + c g_(e-1) + g_(e-2)
    gg = lambda j: g[j] if j >= 0 else Fraction(0)
    prodc = [gg(e) + c * gg(e - 1) + gg(e - 2) for e in range(0, 12)]
    L3['q=%d c=%s' % (q, float(c))] = dict(a=float(a.mid()), a_lt_half=bool(a < 0.5), series_times_P_minus_1=float(abs(ser * P(w) - 1).abs_upper()),
                                           multiplier_symmetry_w=float(sym_w), multiplier_symmetry_s=float(sym_s), value_G_s_over_G_w=str(complex(float((P(s1) / P(w)).real.mid()), float((P(s1) / P(w)).imag.mid()))),
                                           P_times_inverse_coefficients=[str(v) for v in prodc],
                                           P_on_line_range=[float(min(float((2 * arb(t / 10).cos() + cc).mid()) for t in range(0, 700))), float(max(float((2 * arb(t / 10).cos() + cc).mid()) for t in range(0, 700)))])
L3['note_alpha1'] = 'BRS (4.4): A^+_(1/2)(w,0) = -pi^-w Gamma(w) sum r_1(n) n^-w, so alpha^+_(1,1/2)(0) = -r_1(1) = -2: the term subtracted in BRS (4.6) for H_+ is not identically zero'
out['lane3'] = L3
print(json.dumps(L3, indent=1), flush=True)

# ------------------------------------------------------------------ lane 5
L5 = {}


def hz(s, a):
    return acb(s).zeta(a)


def estermann(u, w, h, k):
    """D(u, w; h/k) = sum sigma_w(n) e(nh/k) n^-u = k^(w-2u) sum_{m,n=1..k} e(mnh/k) zeta(u-w, m/k) zeta(u, n/k)."""
    u, w = acb(u), acb(w)
    h = h % k
    z1 = [hz(u - w, arb(m) / k) for m in range(1, k + 1)]
    z2 = [hz(u, arb(n) / k) for n in range(1, k + 1)]
    tot = acb(0)
    for m in range(1, k + 1):
        for n in range(1, k + 1):
            tot += (2 * PI * I * ((m * n * h) % k) / k).exp() * z1[m - 1] * z2[n - 1]
    return acb(k) ** (w - 2 * u) * tot


# sanity of the Estermann routine against the defining series in the region of convergence
u0, w0 = acb(3.2, 0.4), acb(0.3, 0.2)
ser = acb(0)
for n in range(1, 4000):
    sg = sum((acb(d) ** w0 for d in range(1, n + 1) if n % d == 0), acb(0))
    ser += sg * (2 * PI * I * ((n * 3) % 8) / 8).exp() * acb(n) ** (-u0)
L5['estermann_vs_series(3/8; tail ~1e-6)'] = float(abs(estermann(u0, w0, 3, 8) - ser).abs_upper())


# (T5) for q = 7, a = 3
def Mstar(s, a, q):
    s = acb(s)
    tot = acb(0)
    for n in range(2, q):
        chi = dirichlet_char(q, n)
        chib = dirichlet_char(q, pow(n, -1, q))
        tot += chi(a % q) * chi.l(s) * chib.l(s)
    return acb(q) ** s / (q - 1) * tot + (acb(q) ** s + acb(q) ** (1 - s) - 2) * s.zeta() ** 2 / (q - 1)


t5 = {}
for (a, q, s) in ((3, 7, acb(0.5, 2.5)), (2, 5, acb(0.5, 10)), (4, 11, acb(0.3, 1.7))):
    lhs = estermann(s, 2 * s - 1, a, q)
    rhs = (2 * PI) ** (-s) * s.gamma() * ((PI * I * s / 2).exp() * Mstar(s, a, q) + (-PI * I * s / 2).exp() * Mstar(s, -a, q))
    t5['a/q=%d/%d s=%s' % (a, q, complex(float(s.real.mid()), float(s.imag.mid())))] = dict(D=str(complex(float(lhs.real.mid()), float(lhs.imag.mid()))), defect=float(abs(lhs - rhs).abs_upper()))
L5['T5'] = t5
print(json.dumps(L5, indent=1), flush=True)


# Lemma 1 (finite J with remainder integral), coded from the display in the lane's RESULT.md section 1
def Xf(u):
    u = acb(u)
    return acb(2) ** u * PI ** (u - 1) * (PI * u / 2).sin() * (1 - u).gamma()


def Q2j(b, j):
    v = acb(1)
    for l in range(j):
        v *= (arb(2 * l + 1) / 2) ** 2 - b * b
    return v


def lemma1(a, q, b, J, c, V, V1):
    b = acb(b)
    x = arb(a) / q
    D0 = estermann(acb(1) / 2 + b, 2 * b, a, q)
    lg = (2 * PI / x).log()
    main = acb(0)
    dual0 = None
    for j in range(J + 1):
        pref = (-1) ** j * Q2j(b, j) / math.factorial(j)
        Dj = estermann(acb(1) / 2 + b + j, 2 * b, -q, a)
        if j == 0:
            dual0 = Dj
        br = (x / (2 * PI * I)) ** j * Dj
        for l in range(j + 1):
            br -= acb((-1) ** (j - l)) / math.factorial(j - l) * (acb(1) / 2 + l + b).zeta() * (acb(1) / 2 + l - b).zeta() * (x / (2 * PI * I)) ** l
        br -= (acb(1) / 2 + b - j).gamma() * (1 + 2 * b).zeta() * (-(acb(1) / 2 + b) * lg).exp() * (-(acb(1) / 2 + b) * PI * I / 2).exp()
        br -= (acb(1) / 2 - b - j).gamma() * (1 - 2 * b).zeta() * (-(acb(1) / 2 - b) * lg).exp() * (-(acb(1) / 2 - b) * PI * I / 2).exp()
        main += pref * br
    coefs = [(-1) ** j * Q2j(b, j) / math.factorial(j) for j in range(J + 1)]
    lg2 = lg + PI * I / 2
    half = acb(1) / 2

    def integrand(v, analytic):
        w = acb(c) + I * v
        H = (2 * PI) ** (2 * w) * (-w).gamma() / (Xf(half + w - b) * Xf(half + w + b))
        sub = acb(0)
        for j in range(J + 1):
            sub += coefs[j] * (w - j).gamma()
        return (H - sub) * (half + w - b).zeta() * (half + w + b).zeta() * (-w * lg2).exp()
    tot = acb(0)
    edges = [-V1]
    while edges[-1] < V:
        step = 2.0 if abs(edges[-1]) < 60 else (10.0 if edges[-1] < 300 else 50.0)
        edges.append(min(V, edges[-1] + step))
    for e0, e1 in zip(edges[:-1], edges[1:]):
        tot += acb.integral(integrand, acb(e0), acb(e1), rel_tol=arb(2) ** -90, abs_tol=arb(2) ** -110)
    EJ = tot / (2 * PI)
    # size of the integrand at the upper end (tail indicator)
    tail = abs(integrand(acb(V), False))
    return D0, main, EJ, dual0, tail


cf = lambda z: complex(float(z.real.mid()), float(z.imag.mid()))
lem = {}
for (a, q, b, J, c, V) in ((3, 8, acb(0, 1.9), 8, -0.75, 400.0), (2, 5, acb(0, 2.5), 6, -0.75, 1500.0), (4, 9, acb(0.15, 1.2), 7, -0.8, 500.0)):
    ctx.prec = 260
    t0 = time.time()
    D0, main, EJ, dual0, tail = lemma1(a, q, b, J, c, V, 45.0 + 3)
    lem['a/q=%d/%d b=%s J=%d c=%g V=%g' % (a, q, cf(b), J, c, V)] = dict(D0=str(cf(D0)), main=str(cf(main)), E_J=str(cf(EJ)), defect=float(abs(D0 - main - EJ).abs_upper()),
                                                                            defect_without_E_J=float(abs(D0 - main).mid()), dual_j0=str(cf(dual0)), abs_integrand_at_V=float(tail.mid()), seconds=round(time.time() - t0, 1))
    print(json.dumps(lem, indent=1), flush=True)
L5['lemma1'] = lem
L5['lemma1_lane_reference'] = 'lane table: a/q = 2/5, b = 2.5i: D_0 = -1.617284518, dual j=0 -0.6803594296'

# sign rule (Proposition 3 (iv)) and reality, complex characters mod 5, 7, 11
ctx.prec = 128
sr = {}
for (q, n) in ((5, 2), (7, 3), (7, 2), (11, 2)):
    chi = dirichlet_char(q, n)
    chib = dirichlet_char(q, pow(n, -1, q))
    k = chi.parity()

    def R(t):
        s = acb(0.5, t)
        gm = ((s + k) / 2).gamma()
        return PI ** (-s) * gm * gm * acb(q) ** s * chi.l(s) * chib.l(s) / abs(gm) ** 2
    # zeros of L(s, chi) on the line in (-T, T): sign changes of the Hardy function on a fine grid
    T = 40.0
    N = 8000
    grid = [-T + 2 * T * i / N for i in range(N + 1)]
    zv = [chi.hardy_z(acb(t)).real for t in grid]
    zeros = [0.5 * (grid[i] + grid[i + 1]) for i in range(N) if (zv[i] > 0 and zv[i + 1] < 0) or (zv[i] < 0 and zv[i + 1] > 0)]
    ok = 0
    bad = 0
    maxim = 0.0
    minabs = 1e9
    nneg = 0
    tests = [0.37 + 39.5 * i / 60 for i in range(61)]
    for t in tests:
        r = R(t)
        maxim = max(maxim, float(abs(r.imag).upper() / abs(r).lower()))
        cnt = sum(1 for g in zeros if -t < g < t)
        sgn = 1 if r.real > 0 else -1
        nneg += sgn < 0
        if sgn == (-1) ** cnt:
            ok += 1
        else:
            bad += 1
        minabs = min(minabs, float(abs(r).lower()))
        # modulus check |R| = sqrt(q/pi) |L|^2
    r0 = R(0.0)
    sr['chi%d.%d' % (q, n)] = dict(parity=k, R_at_0=float(r0.real.mid()), zeros_found_below_40_in_abs=len(zeros), heights_tested=len(tests), sign_rule_holds=ok, sign_rule_fails=bad, negative_entries=int(nneg),
                                   max_rel_imag=maxim, min_abs_R=minabs, modulus_defect=float(abs(abs(R(3.3)) - (arb(q) / arb.pi()).sqrt() * abs(chi.l(acb(0.5, 3.3))) ** 2).upper()))
L5['sign_rule'] = sr
# T-NR Lemma 5: entries multiplied by mu_chi mu_chibar in [(c-2)^2, (c+2)^2]
q0, c = 2, arb(21) / 10
q, n = 7, 3
chi = dirichlet_char(q, n)
chib = dirichlet_char(q, pow(n, -1, q))
mn, mxv, dev = 1e9, 0.0, 0.0
for i in range(200):
    t = 0.1 + 0.37 * i
    s = acb(0.5, t)
    y = acb(q0) ** (acb(0.5) - s)
    F1 = chi.l(s) * (1 + c * chi(q0) * y + chi(q0) ** 2 * y * y)
    F2 = chib.l(s) * (1 + c * chib(q0) * y + chib(q0) ** 2 * y * y)
    ratio = F1 * F2 / (y * y * chi.l(s) * chib.l(s))
    mu1 = c + 2 * (chi(q0) * acb(q0) ** (-I * t)).real
    mu2 = c + 2 * (chib(q0) * acb(q0) ** (-I * t)).real
    dev = max(dev, float(abs(ratio - mu1 * mu2).abs_upper()))
    v = float((mu1 * mu2).mid())
    mn, mxv = min(mn, v), max(mxv, v)
L5['TNR_lemma5'] = dict(max_abs_ratio_minus_mumu=dev, mumu_min=mn, mumu_max=mxv, bounds=[0.01, 16.81], twin_zero_real_parts=[0.5 + math.acosh(1.05) / math.log(2), 0.5 - math.acosh(1.05) / math.log(2)])
out['lane5'] = L5
print(json.dumps({k: v for k, v in L5.items() if k != 'lemma1'}, indent=1), flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
