# Lane 5, sign rule (Proposition 3 (iv)) and T-NR Lemma 5: the last block of items35.py, run separately so that
# it does not wait for the remainder integrals of Lemma 1.
import sys, os, json, math, random, time
from fractions import Fraction
from flint import arb, acb, ctx, dirichlet_char

out = {}
ctx.prec = 200
PI = acb.pi()
I = acb(0, 1)

L5 = {}
cf = lambda z: complex(float(z.real.mid()), float(z.imag.mid()))
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
print(json.dumps(L5, indent=1), flush=True)
json.dump(out, open(sys.argv[1], 'w'), indent=1)
