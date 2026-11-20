"""combination (4): second-line accuracy of the truncated Euler product and the detectable Blaschke swap.
Inputs: echo raw (log zeta, log L(chi4) on Re s = 1.25 from prime powers <= P) and dh raw (DH Dirichlet series on Re s = 1.25).
eps(P, H) = sup over the sampled window of |log|EP_P| - log|F|| (exact F from Arb), with and without the explicit tail term
            T_P(s) = E_1((s-1) log P)  (prime-number-theorem part of sum_{p>P} p^-s; zeta only).
Blaschke configurations of a quadruple {1/2 +- delta +- i gamma}: per conjugate pair the states (L,R) [true], (R,R), (L,L); 9 in all.
They have the same modulus on Re s = 1/2. On Re s = sigma2 the (R,R) state multiplies |F| by |s - rho|/|s - rho'| (rho = 1/2+delta+i gamma, rho' = 1/2-delta+i gamma).
Peak of the log factor at t = gamma: log((u+delta)/(u-delta)), u = sigma2 - 1/2. A wrong upper-pair state is rejected by a tester with
tolerance 2 eps when the peak exceeds 3 eps and can be accepted when it is below eps: delta_min in [u tanh(eps/2), u tanh(3 eps/2)].
A flip of the conjugate pair only (seen from the window at +gamma): factor at distance 2 gamma: u replaced by (u^2 + 4 gamma^2)/u.
usage: c4_an.py <echo_raw.npz> <dh_raw.npz or -> <out.json>"""
import sys, json, math, numpy as np, mpmath as mp
from flint import acb, arb, ctx
import lib
ctx.prec = 100; S2 = 1.25; U = S2 - 0.5
z = np.load(sys.argv[1]); out = dict(sigma2=S2, rows=[], dh=[], swap=[])
Hs = sorted({k.split('|')[0] for k in z.files if '|L4Z|' in k}, key=float)
cks = sorted({float(k.split('|')[2]) for k in z.files if '|L4Z|' in k})
L4 = lib.LCHI4()
for H in Hs:
    t = z['t_' + H]
    ex = np.array([float(abs(acb(S2, arb(float(v))).zeta()).log().mid()) for v in t])
    ex4 = np.array([float(abs(L4.value(acb(S2, arb(float(v))))).log().mid()) for v in t]) if float(H) <= 1e3 else None   # Hurwitz evaluation: low heights only
    for c in cks:
        a = z['%s|L4Z|%g' % (H, c)]; a4 = z['%s|L4C|%g' % (H, c)]
        err = a[:, 0] - ex; lP = math.log(c)
        tail = np.array([float(mp.e1((mp.mpc(S2, float(v)) - 1) * lP).real) for v in t])
        errc = err + tail; err4 = (a4[:, 0] - ex4) if ex4 is not None else np.array([np.nan])
        out['rows'].append(dict(H=float(H), P=c, n=len(t), window=[float(t[0]), float(t[-1])], eps_sup=float(np.abs(err).max()), eps_rms=float(np.sqrt((err ** 2).mean())),
                                eps_sup_tail=float(np.abs(errc).max()), eps_rms_tail=float(np.sqrt((errc ** 2).mean())),
                                eps_sup_chi4=float(np.abs(err4).max()), eps_rms_chi4=float(np.sqrt((err4 ** 2).mean())),
                                tail_bound_abs=float(1.25506 * (S2 / (S2 - 1)) * c ** (1 - S2) / lP)))
        # planted swap at gamma = median sample: compatible configurations for a grid of delta, using the measured error as the data error
        g = float(t[len(t) // 2]); e = errc; eps = float(np.abs(e).max())
        def fac(de, gam):   # log|s - rho| - log|s - rho'| on the window, rho = 1/2 + de + i gam
            return 0.5 * np.log(((U - de) ** 2 + (t - gam) ** 2) / ((U + de) ** 2 + (t - gam) ** 2))
        res = {}
        for de in [1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 0.1, 0.3]:
            comp = 0
            for up in (0, 1, -1):
                for lo in (0, 1, -1):
                    m = up * fac(de, g) + lo * fac(de, -g)       # configuration minus truth, in log modulus on line 2
                    # data = truth + e (truncated primes); tester tolerance 2 eps (eps = realised sup error): compatible iff sup |model_c - data| <= 2 eps
                    if np.abs(m - e).max() <= 2 * eps: comp += 1
            res['%g' % de] = comp
        out['swap'].append(dict(H=float(H), P=c, gamma=g, eps=eps, compatible_configurations=res, delta_min_upper_interval=[U * math.tanh(eps / 2), U * math.tanh(3 * eps / 2)], delta_min_conj_only=min(0.5, (U * U + 4 * g * g) / U * math.tanh(eps / 2))))
if sys.argv[2] != '-':
    d = np.load(sys.argv[2]); o = lib.DH()
    dz = json.load(open('dh_zeros.json'))['offline']
    for H in sorted({k.split('|')[0] for k in d.files if '|L4|' in k}, key=float):
        t = d['t_' + H]
        exv = [o.value(acb(S2, arb(float(v)))) for v in t]
        ex = np.array([float(abs(v).log().mid()) for v in exv])
        for c in sorted({float(k.split('|')[2]) for k in d.files if k.startswith(H + '|L4|')}):
            a = d['%s|L4|%g' % (H, c)]; err = 0.5 * np.log(a[:, 0] ** 2 + a[:, 1] ** 2) - ex
            rec = dict(H=float(H), N=c, window=[float(t[0]), float(t[-1])], eps_sup=float(np.abs(err).max()), eps_rms=float(np.sqrt((err ** 2).mean())), zeros=[])
            eps = rec['eps_sup']
            for b, g, _ in dz:
                de = float(b) - 0.5; g = float(g)
                if not (t[0] + 2 < g < t[-1] - 2): continue
                f = 0.5 * np.log(((U - de) ** 2 + (t - g) ** 2) / ((U + de) ** 2 + (t - g) ** 2))
                comp = sum(1 for up in (0, 1, -1) for lo in (0, 1, -1) if np.abs(up * f - err).max() <= 2 * eps)   # conj-pair factor ~ 1 at this window
                rec['zeros'].append(dict(delta=de, gamma=g, sup_log_factor_on_samples=float(np.abs(f).max()), exact_peak=math.log((U + de) / (U - de)), configurations_compatible_of_9=comp))
            out['dh'].append(rec)
json.dump(out, open(sys.argv[3], 'w'), indent=1)
for r in out['rows']:
    if r['P'] in (1e3, 1e5, 1e7, 1e9): print('H %-8g P %-6g eps_sup %.3e rms %.3e | with tail term %.3e rms %.3e | chi4 %.3e | absolute tail bound %.2e' % (r['H'], r['P'], r['eps_sup'], r['eps_rms'], r['eps_sup_tail'], r['eps_rms_tail'], r['eps_sup_chi4'], r['tail_bound_abs']))
for r in out['swap']:
    if r['P'] == cks[-1]: print('swap H %-8g P %g gamma %.3f eps %.2e delta_min upper in [%.2e, %.2e] conj-only %.2e compatible:' % (r['H'], r['P'], r['gamma'], r['eps'], r['delta_min_upper_interval'][0], r['delta_min_upper_interval'][1], r['delta_min_conj_only']), r['compatible_configurations'])
for r in out['dh']:
    print('DH H %g N %g eps_sup %.2e' % (r['H'], r['N'], r['eps_sup']), [(round(q['delta'], 4), round(q['gamma'], 2), round(q['sup_log_factor_on_samples'], 3), q['configurations_compatible_of_9']) for q in r['zeros']])
