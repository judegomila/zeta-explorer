import json, glob, os, math
def load(pat):
    out = {}
    for f in sorted(glob.glob(pat)):
        r = json.load(open(f)); out[(r['config'], r['delta'])] = (r, f)
    return out
srv = load('out/spec_*.json'); loc = load('out_local/spec_*.json')
lines = []
P = lines.append
P('## T1. Spectrum of A = P_1 F_S P_1 with swapped local factors (FFT-Mellin, Lanczos)\n')
P('Columns: largest three values (signed eigenvalues; for the complex unimodular twist the singular values), 1 - max modulus, at each grid step delta (number of grid points L = 64/delta). "srv" = compute server, "loc" = local.\n')
P('| S and factors | delta (where) | lambda_0 | lambda_1 | lambda_2 | 1 - max abs | max residual of top 3 |')
P('|---|---|---|---|---|---|---|')
order = []
for d in (srv, loc):
    for k in d:
        if k[0] not in order: order.append(k[0])
def keyf(c):
    return (c.count('+'), c)
for c in sorted(order, key=keyf):
    for dl in (2e-5, 1e-5, 5e-6):
        for nm, d in (('srv', srv), ('loc', loc)):
            if (c, dl) in d:
                r = d[(c, dl)][0]; v = r['values']
                P(f"| {c} | {dl:g} ({nm}) | {v[0]:+.8f} | {v[1]:+.8f} | {v[2]:+.8f} | {1-max(abs(x) for x in v):.3e} | {max(r['res'][:3]):.1e} |")
P('')
# server/local agreement and delta convergence
P('Agreement of the same configuration at the same delta on the two machines, and change of lambda_0 between grid steps:\n')
P('| config | abs(lambda_0 srv - loc) at 1e-5 | lambda_0(2e-5) - lambda_0(1e-5) | lambda_0(1e-5) - lambda_0(5e-6) |')
P('|---|---|---|---|')
for c in sorted(order, key=keyf):
    a = srv.get((c, 1e-5)); b = loc.get((c, 1e-5)); c2 = loc.get((c, 2e-5)); c5 = loc.get((c, 5e-6))
    l1 = (b or a)
    s1 = f"{abs(a[0]['values'][0]-b[0]['values'][0]):.1e}" if a and b else '-'
    s2 = f"{c2[0]['values'][0]-l1[0]['values'][0]:+.1e}" if c2 and l1 else '-'
    s3 = f"{l1[0]['values'][0]-c5[0]['values'][0]:+.1e}" if c5 and l1 else '-'
    if (s1, s2, s3) != ('-', '-', '-'): P(f'| {c} | {s1} | {s2} | {s3} |')
P('')
P('## T2. Trace-side symbol Lhat_S(t) = 2 theta\'(t) + 2 Re (L_p\'/L_p)(1/2+it) + deltahat_S(t), S = {inf, p}\n')
P('Exact-offset quadrature (symbol2.py): spikes k <= KMAX, Gauss-Legendre order g on geometric cells around each spike (ratio 2 and depth 42 for g = 12, ratio 1.5 and depth 70 for g = 16, relative to the core width p^-k). "tail" = geometric estimate of the omitted spikes (added to nothing; shown as an error scale).\n')
P('| factor | p | KMAX, g | Lhat(0) | min over [0,60] | at t | deltahat(0) | 2 Re L\'/L (0) | tail |')
P('|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out_local/symbol2_*.json')):
    r = json.load(open(f))
    P(f"| {r['name']} | {r['p']} | {r['KMAX']}, {r['GLN']} | {r['L0']:+.6f} | {r['minL']:+.6f} | {r['argmin']:.2f} | {r['hat0']:.6f} | {r['ld0']:+.6f} | {r['tail']:.1e} |")
P('')
P('## T3. Cusp out-fraction at rho = p^k, one prime (Aitken over the last three steps of log_p(1/eps))\n')
P('| factor | p | k | f_out (Aitken) | 1 - 1/rho | deviation | 1 - (abs(alpha)^2/p)^k | deviation from it | cusp increment of delta_S per step |')
P('|---|---|---|---|---|---|---|---|---|')
for f in sorted(glob.glob('out/cusp_p*.json')):
    for r in json.load(open(f)):
        P(f"| {r['name']} | {r['p']} | {r['k']} | {r['f_aitken']:.9f} | {r['law']:.9f} | {r['dev']:+.2e} | {r['pred_alpha']:.9f} | {r['dev_pred']:+.2e} | {r['incS_last']:+.4e} |")
P('')
P('## T4. log^2-cusp out-fraction at the 66 S-units 2^a 3^b <= 1e4, S = {inf,2,3} (fit of the resonant sums over eps in [1e-150, 1e-8])\n')
P('| factors (2, 3) | S-units | max abs deviation of the log^2-coefficient fraction from 1 - 1/rho | mean abs deviation | max abs deviation of the increment ratio at eps = 1e-150 | mean |')
P('|---|---|---|---|---|---|')
rows = json.load(open('out/cusp23.json'))
for tag in ('zeta', 'chi5', 'chi13/sign2', 'ntp@2', 'E_0.2'):
    rr = [r for r in rows if r['tag'] == tag]
    P(f"| {tag} | {len(rr)} | {max(abs(r['dev']) for r in rr):.2e} | {sum(abs(r['dev']) for r in rr)/len(rr):.2e} | {max(abs(r['dev_naive']) for r in rr):.2e} | {sum(abs(r['dev_naive']) for r in rr)/len(rr):.2e} |")
P('')
chk = json.load(open('out/cusp23_fullcheck.json'))
P('Full quadruple-sum check (zeta factors) that the non-resonant part has no cusp: largest non-resonant increment per two steps of log_2(1/eps) at j = 22: ' + ', '.join(f"rho0 = 2^{a}3^{b}: {max(abs(r['incr_nonres_S']), abs(r['incr_nonres_in'])):.1e}" for (a, b) in ((1, 0), (0, 1), (1, 1), (2, 1)) for r in chk if r['a'] == a and r['b'] == b and r['j'] == 22) + '.\n')
P('## T5. Admissible coefficient at 2 (Weil form with zeta\'s gamma factor; Legendre Galerkin N = 256)\n')
P('| 2a | pole-free subspace: x- | x+ | lmin at x = 1 | full space with pole term: x- - 1 | x+ - 1 | lmin at x = 1 |')
P('|---|---|---|---|---|---|---|')
for r in json.load(open('out/pencil_xint_N256.json')):
    if r['twoa'] < 0.699: continue
    fm = f"{r['full_xminus']-1:+.3e}" if r['full_xminus'] is not None else 'x = 1 not admissible'
    fp = f"{r['full_xplus']-1:+.3e}" if r['full_xplus'] is not None else ''
    P(f"| {r['twoa']:.4f} | {r['xminus']:.5f} | {r['xplus']:.6f} | {r['lmin_x1']:+.3e} | {fm} | {fp} | {r['lmin_full_x1']:+.3e} |")
P('')
P('N-convergence at 2a = ln 3 (pole-free): ' + '; '.join(f"N = {N}: [{r['xminus']:.5f}, {r['xplus']:.6f}]" for N in (64, 128, 256) for r in json.load(open(f'out/pencil_xint_N{N}.json')) if abs(r['twoa'] - math.log(3)) < 1e-6) + '.\n')
P('## T6. Smallest eigenvalue of each control\'s own Weil form on L^2(-a,a) (N = 192; "pf" = pole-free subspace, "full" = whole space)\n')
keys = ['zeta_pf', 'zeta_full', 'chi5_full', 'chim4_full', 'dh_full', 'sign2_pf', 'sign23_pf', 'tnr2_pf', 'tnr3_pf', 'ea0.1_full', 'ea0.2_full', 'ea0.4_full']
P('| 2a | ' + ' | '.join(keys) + ' | unimodular twist at 2, phase 0.5 / 1.5 / 2.5 (pf) |')
P('|---|' + '---|' * (len(keys) + 1))
for r in json.load(open('out/pencil_controls_N192.json')):
    u = r['uni2_pf_by_phi']
    P(f"| {r['twoa']:.4f} | " + ' | '.join(f"{r[k]:+.2e}" for k in keys) + f" | {u['0.50']:+.2e} / {u['1.50']:+.2e} / {u['2.50']:+.2e} |")
P('')
P('## T7. Admissible ranges of the coefficients at 2, 3, 4 around (1,1,1) (pole-free, N = 192)\n')
P('| 2a | lmin at (1,1,1) | x2 - 1 | x3 - 1 | x4 - 1 |')
P('|---|---|---|---|---|')
for r in json.load(open('out/pencil_joint_N192.json')):
    def iv(k):
        if r[k] is None: return 'none'
        if r[k][0] < -50: return 'unconstrained (support below ln 4)'
        return f"[{r[k][0]-1:+.2e}, {r[k][1]-1:+.2e}]"
    P(f"| {r['twoa']:.4f} | {r['lmin_111']:.3e} | {iv('x2')} | {iv('x3')} | {iv('x4')} |")
open('tables.md', 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines[:12]))
