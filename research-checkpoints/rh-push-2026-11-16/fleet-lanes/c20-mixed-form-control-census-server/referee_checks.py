# Referee checks for Part 1 (run after tailA): (1) q^(k)(u) = 0 for k <= 8 and != 0 at k = 9; (2) the per-point remainder bound
# abs(Phi(w) - sum_{k<6} (-1)^(k+1) q_k w^-(k+1)) <= K6 abs(w)^-6 at sample points w with Re w <= sigma_R - 1/2;
# (3) an elementary zero-count bound per unit height from Jensen's inequality (no recalled theorem), and the tail bound it gives.
import json, math, glob, random
import flint
from flint import arb, acb
import runA_c19 as A, tailA
flint.ctx.prec = 256
out = {}
for f in sorted(glob.glob('tailA_*.json')):
    res = json.load(open(f)); name = res['name']
    D = A.DP(A.series(name)); u = D.u; P = D.P; I = acb(0, 1)
    sL, sR = res['sigma_L'], res['sigma_R']
    rec = {'P': P, 'sigma_L': sL, 'sigma_R': sR}
    # (3) Jensen: boxes [sL, sR] x [y, y+1] inside the disc centre s0 = sig0 + i(y + 1/2), radius r; zeros <= log(M(rho)/abs(D(s0)))/log(rho/r)
    best = None
    for ds in (0.5, 1.0, 1.5, 2.0, 3.0):
        sig0 = sR + ds
        lowD = 1 - sum(abs(a) * (-arb(sig0) * L).exp() for a, L in zip(D.a[1:], D.L[1:]))
        if not (lowD > 0): continue
        r = (arb(max(sig0 - sL, ds)) ** 2 + arb(1) / 4).sqrt()
        for fac in (1.5, 2.0, 3.0, 4.0):
            rho = fac * r
            M = sum(abs(a) * ((rho - sig0) * L).exp() for a, L in zip(D.a, D.L))
            nb = (M / lowD).log() / arb(fac).log()
            v = float(nb.upper())
            if best is None or v < best[0]: best = (v, ds, fac)
    NJ = math.floor(best[0]); rec['jensen_zeros_per_unit_height_box'] = NJ; rec['jensen_params'] = best[1:]
    rec['density_u_over_2pi'] = float(u / (2 * arb.pi()))
    rows = []
    for tau in (0.0, 7.3):
        n2, n2p, shift, kap = A.forms(D, tau)
        ct = tailA.cterms(u, tau)
        def dq(k, x):
            s = acb(0)
            for al, be, nu in ct:
                s += ((al + be * x) * (I * nu) ** k + (k * be * (I * nu) ** (k - 1) if k > 0 else 0)) * (I * nu * x).exp()
            return 2 * s.real
        qu = [dq(k, u) for k in range(10)]
        rec['q_at_u_tau%g' % tau] = {'max_abs_k_le_8': float(max(abs(x).upper() for x in qu[:9])), 'contains_zero_k_le_8': all(x.contains(0) for x in qu[:9]), 'k9': float(qu[9].mid())}
        q0 = [dq(k, arb(0)) for k in range(6)]
        sup6 = arb(0)
        for al, be, nu in ct: sup6 += 2 * ((abs(al) + abs(be) * u) * abs(nu) ** 6 + 6 * abs(be) * abs(nu) ** 5)
        K6 = (((arb(sR) - arb(0.5)) * u).exp() if sR > 0.5 else arb(1)) * u * sup6
        random.seed(5); worst = 0.0; okall = True
        for _ in range(200):
            w = acb(random.uniform(sL - 0.5, sR - 0.5), random.choice([-1, 1]) * 10 ** random.uniform(0.5, 4))
            remv = kap(w) - sum((-1) ** (k + 1) * q0[k] / w ** (k + 1) for k in range(6))
            ratio = abs(remv) * abs(w) ** 6 / K6
            okall = okall and bool(ratio <= 1); worst = max(worst, float(ratio.upper()))
        rec['pointwise_bound_tau%g' % tau] = {'all_hold': okall, 'max_ratio': worst}
        for row in res['rows']:
            if row['tau'] != tau: continue
            T = arb(row['T'])
            tailJ = K6 * 2 * NJ * (T ** -6 + T ** -5 / 5) / n2
            rows.append({'tau': tau, 'T': row['T'], 'abs_diff': abs(row['diff_over_n2']), 'bound_classical_count': row['tail_bound_over_n2'],
                         'bound_jensen_count': float(tailJ.upper()), 'enclosed_jensen': bool(abs(arb(row['diff_over_n2'])) + arb(row['diff_rad_over_n2']) <= tailJ)})
    rec['rows'] = rows
    out[name] = rec
    print(name, json.dumps({k: v for k, v in rec.items() if k != 'rows'}))
    for r in rows: print('   ', json.dumps(r))
json.dump(out, open('referee_checks.json', 'w'), indent=1)
