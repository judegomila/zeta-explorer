"""c2-repair-owed-passes: independent numeric checks for the four owed referee passes.
Run: scripts/memcap.sh 8 python3 checks.py <thmA|lemma3|ghs|q44|cc>
Planned allocations: all below 10 MB."""
import sys, math, json, itertools, random
from fractions import Fraction
case = sys.argv[1]

if case == 'thmA':
    # Theorem A, new case: b = 2^{-z} (3^{-z} - a)/(1 - a 3^{-z}), h = (1+b)/(1-b). H(0)=1 (b(0)=0).
    # Prediction: (2 pi/T) sum_{1<gamma<=T} r_j zeta(1/2+i gamma_j) -> H(0) + conj h(1/2).
    import mpmath as mp
    mp.mp.dps = 20
    a = 0.4
    l2, l3 = math.log(2), math.log(3)
    def phase(t):  # continuous phase of b(it), decreasing
        # arg((e^{-i x}-a)/(1-a e^{-i x})) = -x - 2 atan2(a sin x, 1 - a cos x)
        x = t * l3
        return -t * l2 - x - 2 * math.atan2(a * math.sin(x), 1 - a * math.cos(x))
    def dphase(t):
        x = t * l3
        return -l2 - l3 * (1 - a * a) / (1 - 2 * a * math.cos(x) + a * a)
    def bval(z):
        w1 = 2 ** (-z); w2 = 3 ** (-z)
        return w1 * (w2 - a) / (1 - a * w2)
    h_half = (1 + bval(0.5)) / (1 - bval(0.5))
    pred = 1 + h_half  # real here
    out = []
    for T in [int(x) for x in sys.argv[2:]] or (1000, 3000, 6000):
        # poles: phase(t) = -2 pi k
        k = 1; s = 0j; mass = 0.0; n = 0
        # phase is monotone decreasing; solve by bisection on brackets
        t_lo = 0.0
        while True:
            target = -2 * math.pi * k
            # bracket: phase slope between -(l2 + l3 (1+a)/(1-a)) and -(l2 + l3 (1-a)/(1+a))
            lo, hi = t_lo, t_lo + 2 * math.pi / (l2 + l3 * (1 - a) / (1 + a)) + 1e-9
            for _ in range(80):
                mid = 0.5 * (lo + hi)
                if phase(mid) > target: lo = mid
                else: hi = mid
            g = 0.5 * (lo + hi); t_lo = g; k += 1
            if g > T: break
            if g <= 1: continue
            r = 2 / abs(dphase(g))
            s += r * complex(mp.zeta(mp.mpc(0.5, g))); mass += r; n += 1
        val = 2 * math.pi * s / T
        print(f"T={T} poles={n} sum r={mass:.3f} (pred T*ReH(0)/pi={T/math.pi:.3f}) mean={val.real:.4f}{val.imag:+.4f}i pred={pred:.4f}", flush=True)
        out.append(dict(T=T, poles=n, mass=mass, mean=[val.real, val.imag], pred=pred))
    json.dump(out, open('thmA_check_%d.json' % out[-1]['T'], 'w'), indent=1)

elif case == 'lemma3':
    # corrected Lemma 3: t_N(z) = 1 - m_S(z) sum_{n in N_S, n<=N} n^{-1/2-z}; size at Re z = 0 and Re z = -1/2 + delta, and at Re z < -1/2
    import cmath
    S = [2, 3, 5]
    def smooth(N):
        xs = [1]
        for p in S:
            new = []
            for x in xs:
                y = x
                while y <= N: new.append(y); y *= p
            xs = new
        return sorted(xs)
    def one_minus_t(z, ns):
        m = 1
        for p in S: m *= (1 - p ** (-0.5 - z))
        return m * sum(n ** (-0.5 - z) for n in ns)
    res = []
    for N in (10**3, 10**6, 10**12, 10**24, 10**48):
        ns = smooth(N)
        row = dict(N=f"1e{len(str(N))-1}", count=len(ns))
        for name, x in (('Re z=0', 0.0), ('Re z=-0.4', -0.4), ('Re z=-0.49', -0.49), ('Re z=-0.6', -0.6)):
            row[name] = max(abs(1 - one_minus_t(complex(x, g), ns)) for g in (14.134725, 21.022040, 85.699348, 1000.3))
        print(row, flush=True); res.append(row)
    json.dump(res, open('lemma3_check.json', 'w'), indent=1)

elif case == 'ghs':
    # GHS with site-dependent fields h_i >= 0 (h_i = 0 allowed: hidden spins): u3(i,j,k) <= 0 for all i,j,k. Brute force.
    random.seed(11)
    def u3_all(n, J, h):
        confs = list(itertools.product((-1, 1), repeat=n))
        w = [math.exp(sum(J[i][j] * s[i] * s[j] for i in range(n) for j in range(i + 1, n)) + sum(h[i] * s[i] for i in range(n))) for s in confs]
        Z = sum(w)
        m1 = [sum(wi * s[i] for wi, s in zip(w, confs)) / Z for i in range(n)]
        worst = -1e9
        for i in range(n):
            for j in range(i, n):
                mij = sum(wi * s[i] * s[j] for wi, s in zip(w, confs)) / Z
                for k in range(j, n):
                    mik = sum(wi * s[i] * s[k] for wi, s in zip(w, confs)) / Z
                    mjk = sum(wi * s[j] * s[k] for wi, s in zip(w, confs)) / Z
                    mijk = sum(wi * s[i] * s[j] * s[k] for wi, s in zip(w, confs)) / Z
                    u3 = mijk - m1[i] * mjk - m1[j] * mik - m1[k] * mij + 2 * m1[i] * m1[j] * m1[k]
                    worst = max(worst, u3)
        return worst
    def trial(sign_field, sign_J):
        n = random.choice((4, 5, 6, 7))
        J = [[0.0] * n for _ in range(n)]
        for i in range(n):
            for j in range(i + 1, n):
                J[i][j] = sign_J * random.choice((0, 0, random.random() * 1.5))
        h = [random.choice((0.0, 0.0, random.random() * 2)) * sign_field for _ in range(n)]
        return u3_all(n, J, h)
    a = max(trial(1, 1) for _ in range(1500))
    b = max(trial(-1, 1) for _ in range(300))
    c = max(trial(1, -1) for _ in range(300))
    print(f"ferromagnet, fields h_i >= 0 with zeros (hidden spins), 1500 systems n=4..7: max u3 = {a:.3e} (GHS: <= 0)")
    print(f"sanity (test can fail): fields <= 0: max u3 = {b:.3e}; antiferromagnetic couplings: max u3 = {c:.3e}")
    json.dump(dict(max_u3_ferro_nonneg_fields=a, max_u3_neg_fields=b, max_u3_antiferro=c), open('ghs_check.json', 'w'), indent=1)

elif case == 'q44':
    # Q_44(w) = (w^2 - (44/23) w + 1)(w+1)^44: coefficients >= 0; third cumulant of k under tilt w = 108/55 (exact)
    from math import comb
    def third(m, c, w):
        co = [Fraction(comb(m, k)) + (Fraction(comb(m, k - 2)) if k >= 2 else 0) - 2 * c * (Fraction(comb(m, k - 1)) if k >= 1 else 0) for k in range(m + 3)]
        for k in range(m + 3):
            if k > m: co[k] = (Fraction(comb(m, k - 2)) if 0 <= k - 2 <= m else 0) - 2 * c * (Fraction(comb(m, k - 1)) if 0 <= k - 1 <= m else 0)
        assert min(co) >= 0, min(co)
        p = [co[k] * w ** k for k in range(m + 3)]; Z = sum(p)
        mu = sum(k * pk for k, pk in enumerate(p)) / Z
        return min(co), sum((k - mu) ** 3 * pk for k, pk in enumerate(p)) / Z
    for m, c, w in ((44, Fraction(22, 23), Fraction(108, 55)), (43, Fraction(43, 45), Fraction(108, 55)), (48, Fraction(24, 25), Fraction(19, 10))):
        mn, k3 = third(m, c, w)
        print(f"m={m} cos={c} w={w}: min coeff={mn}, third cumulant sign={'+' if k3 > 0 else '-'} value={float(k3):.5f}")

elif case == 'cc':
    # Laguerre-Polya closure under exp(-lam D^2) at the Gaussian-decay endpoint: f = (z^2 - x1^2) e^{-a z^2}.
    # exp(-lam D^2) f (z) = E f(z + i sqrt(2 lam) X) = q^{-1/2} e^{-a z^2/q} [z^2/q^2 - 2 lam/q - x1^2], q = 1 - 4 a lam,
    # defined iff q > 0; zeros z = +-q sqrt(x1^2 + 2 lam/q) real. Check the closed form by mpmath quadrature.
    import mpmath as mp
    mp.mp.dps = 30
    worst = mp.mpf(0); cases = 0
    for a in (0.1, 0.5, 1.0, 3.0):
        for frac in (0.1, 0.5, 0.9, 0.99):
            lam = mp.mpf(frac) / (4 * a); q = 1 - 4 * a * lam; s = mp.sqrt(2 * lam)
            for x1 in (0.3, 1.0, 4.0):
                for z in (mp.mpf('0.37'), q * mp.sqrt(x1 * x1 + 2 * lam / q)):
                    f = lambda x: ((z + 1j * s * x) ** 2 - x1 ** 2) * mp.exp(-a * (z + 1j * s * x) ** 2) * mp.exp(-x * x / 2) / mp.sqrt(2 * mp.pi)
                    L = 12 / mp.sqrt(q)
                    val = mp.quad(f, mp.linspace(-L, L, 41))
                    closed = mp.exp(-a * z * z / q) / mp.sqrt(q) * (z * z / q ** 2 - 2 * lam / q - x1 ** 2)
                    scale = mp.exp(-a * z * z / q) / mp.sqrt(q) * (z * z / q ** 2 + 2 * lam / q + x1 ** 2)
                    worst = max(worst, abs(val - closed) / scale); cases += 1
    print(f"cases {cases}: Gaussian average of (z^2-x1^2)e^(-a z^2) equals q^(-1/2) e^(-a z^2/q)[z^2/q^2 - 2 lam/q - x1^2], q = 1-4 a lam in (0,1); max relative difference {mp.nstr(worst, 3)}; zeros +-q sqrt(x1^2+2 lam/q) are real")
