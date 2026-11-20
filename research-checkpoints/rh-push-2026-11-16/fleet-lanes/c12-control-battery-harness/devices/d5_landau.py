"""D5: P46 Landau step with DEL (push/c10-thin-deletion-zero-mode-control records del_b*_m1_X1e+07.json; c11-del-device-read-confirm cell (b)).
Battery inputs: DEL sets, coefficient tables, stage objects. argv: tables dir, record dir."""
import sys, os, json, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'battery'))
from flint import acb, arb, ctx
import core, coeffs as C, sets
tables, recdir = sys.argv[1], sys.argv[2]
N = 10 ** 7
spf = C.spf_sieve(N); primes = C.primes_of(spf)
out = {}; checks = []
def chk(name, ok, got, want): checks.append(dict(check=name, ok=bool(ok), got=got, recorded=want))
for b, recfile in (('0.75', 'del_b0.75_m1_X1e+07.json'), ('0.9', 'del_b0.9_m1_X1e+07.json')):
    rec = json.load(open(os.path.join(recdir, recfile)))
    fS = os.path.join(tables, 'set_DEL-%s.npy' % b)
    S = np.load(fS) if os.path.exists(fS) else sets.build(primes, b, '1')[0]
    fa = os.path.join(tables, 'coef_DEL-%s.npy' % b)
    a = np.load(fa) if os.path.exists(fa) else C.coef_DEL(spf, primes, S)
    ctx.prec = 128
    r = {}; tag = 'DEL-%s: ' % b
    r['sizeS'] = int(len(S)); chk(tag + '|S| exact', r['sizeS'] == rec['build']['sizeS'], r['sizeS'], rec['build']['sizeS'])
    # coefficients of A in H = F F*/zeta^2 = exp(-2A): (1 - Re chi(p)^k)/k, chi(p) = a(p) in {0, 1}
    chi_p = a[primes].astype(np.int64)
    coefA_min = None; npp = 0
    for k in range(1, 24):
        pk = primes[primes.astype(np.float64) ** k <= N + 0.5]
        if len(pk) == 0: break
        v = (1 - a[pk].astype(np.float64) ** k) / k
        coefA_min = float(v.min()) if coefA_min is None else min(coefA_min, float(v.min())); npp += len(pk)
    r['A_coefficients_min'] = coefA_min; r['prime_powers_checked'] = npp
    chk(tag + 'coefficients of A >= 0 at every prime power <= 1e7', coefA_min >= 0, coefA_min, '>= 0')
    chk(tag + 'a(p) = 0 exactly on S, 1 off S', bool(np.array_equal(primes[chi_p == 0], S)), int((chi_p == 0).sum()), int(len(S)))
    # complete multiplicativity of the table on a sample
    rng = np.random.Generator(np.random.PCG64(7)); m1 = rng.integers(2, 3000, 20000); m2 = rng.integers(2, 3000, 20000)
    chk(tag + 'table completely multiplicative (20000 random products)', bool(np.all(a[m1 * m2] == a[m1] * a[m2])), 'all equal', 'all equal')
    # record numbers
    bb = arb(b); logs = [arb(int(p)).log() for p in S]
    def logG(X): return sum(((1 - (-bb * lp).exp()).log() for p, lp in zip(S, logs) if p <= X), arb(0))
    lg7 = logG(10 ** 7); lg5 = logG(10 ** 5)
    r['logG_X_at_b'] = float(lg7.mid()); want = rec['stability_at_b']['10000000']['logG_X_at_b']
    chk(tag + 'log G_X(b), abs 1e-10', abs(r['logG_X_at_b'] - want) < 1e-10, r['logG_X_at_b'], want)
    DX = arb(len(S)) - sets.Lball(10 ** 7, b, '1'); r['D_X'] = float(DX.mid()); want = rec['stability_at_b']['10000000']['D_X']
    chk(tag + 'D(1e7), abs 1e-9', abs(r['D_X'] - want) < 1e-9, r['D_X'], want)
    r['exponent_estimate'] = float((-(lg7 - lg5) / (arb(10 ** 7).log().log() - arb(10 ** 5).log().log())).mid()); want = rec['exponent_estimate']
    chk(tag + 'exponent estimate (order of the zero at b), abs 1e-9', abs(r['exponent_estimate'] - want) < 1e-9, r['exponent_estimate'], want)
    # (i) stage identity (zeta G_X)^2 / zeta^2 = exp(-2 A_X)
    st = core.Stage('DEL-' + b, 'del', b, [int(p) for p in S])
    worst = 0.0
    for s in (acb('1.5'), acb(2), acb('1.5', 10)):
        z = s.zeta(); F = st.value(s); Hh = F * F / (z * z)
        A = acb(0)
        for lp in logs:
            u = (-s * lp).exp(); A += -(1 - u).log()          # sum_k p^(-ks)/k
        worst = max(worst, float(abs(Hh / (-2 * A).exp() - 1).upper()))
    r['stage_identity_max_rel'] = worst; chk(tag + 'stage identity H = exp(-2A), rel 1e-25', worst < 1e-25, worst, '< 1e-25')
    # (ii) coefficient table against the stage
    af = a.astype(np.float64); r['table_vs_stage'] = []
    for s, bound in ((2, 1e-7), (3, 5e-15), (2 + 10j, 1e-7)):
        dsum = C.dirichlet_sum(af, s); v = st.value(acb(s.real, s.imag) if isinstance(s, complex) else acb(s))
        diff = abs(dsum - complex(float(v.real.mid()), float(v.imag.mid())))
        r['table_vs_stage'].append(dict(s=str(s), diff=diff, tail_bound=bound))
        chk(tag + 'Dirichlet sum to 1e7 against zeta G_X at s = %s, within tail bound + 1e-12' % s, diff <= bound + 1e-12, diff, bound)
    # Landau reading: A has coefficients >= 0, so its abscissa is a real singularity; the data: A_X(sigma) at sigma -> b+
    r['A_X_real'] = {x: float((-(sum(((1 - (-arb(x) * lp).exp()).log() for lp in logs), arb(0)))).mid()) for x in (str(float(b) + 0.2), str(float(b) + 0.05), str(float(b) + 0.01), b)}
    out['DEL-' + b] = r
out['checks'] = checks; out['reproduced'] = all(c['ok'] for c in checks)
out['verdict'] = 'DEL passes the Landau step of P46 (A has non-negative coefficients; identity holds; set and abscissa data as recorded)' if out['reproduced'] else 'MISMATCH'
json.dump(out, open(os.path.join(tables, 'device_D5.json'), 'w'), indent=1)
for c in checks: print(('ok   ' if c['ok'] else 'FAIL ') + c['check'], '| got', c['got'], '| recorded', c['recorded'])
print('D5 reproduced:', out['reproduced'])
