"""R5: shared-row (i in S) global debit from (124) and the hybrid-plan envelope, own Fractions; compare with parent source."""
import sys, json
from fractions import Fraction as F
I = sys.argv[1]
ld = lambda p: json.load(open(p if p.startswith(I) else p.replace('/workspace', I, 1)))
cp = ld(I + '/lambda_round13/flow/PHYSICAL_REFINEMENT_CERTIFICATE.json'); PHc = cp['inputs']
nat = ld(PHc['native_primitives']['path'])['blocks']; act = ld(PHc['activation']['path'])['blocks']; orig = ld(PHc['parent_source']['path'])['records']
hyb = ld(I + '/attack/latest_lambda_reconstructed/workspace/continuation_20261022e/probe_optimisation/SHARED_HYBRID_PLAN.json')['rows']
e0 = F(1, 2000000); e1 = F(1, 20000)
res = []
for i in range(67):
    if orig[i]['mode'] == 'retained': continue
    nr = {F(x['height']): x for x in nat[i]['height_records']}; ar = {F(x['height']): x for x in act[i]['heights']}
    def cap(h):
        n = nr[h]; A, B, P, P1, DU, DM, Z, T = (F(n[k]) for k in ('prefix_A_upper', 'prefix_B_upper', 'Euler_norm_upper', 'Euler_log_moment_upper', 'D_upper', 'D_match_lower', 'overlap_Z_match_lower', 'Euler_tail_upper'))
        a = P * F(ar[h]['Aact_upper']); b = 2 * P * F(ar[h]['Dact_upper']) + P1 * F(ar[h]['Aact_upper']); g = 1 - A - a; r0 = e0 * P; r1 = e1 * P + e0 * P1 / 2
        R = B - (1 - A) * DM - 2 * Z; assert R >= 0 and g > r0 > 0
        return (R + b + a * DU) / (2 * g) + T / 2, r1 / (g - r0) + (B + b) * r0 / (2 * g * (g - r0)) + F(2, 10 ** 12)
    env = [(F(e['height']), F(e['weight'])) for e in hyb[i]['envelope']]; nodes = [(F(n['height']), F(n['weight'])) for n in hyb[i]['nodes']]
    ok_h = all(h in nr for h, c in env) and all(h in nr for h, w in nodes) and all(c >= 0 for h, c in env)
    D = sum(c * cap(h)[0] for h, c in env) + sum(abs(w) * cap(h)[1] for h, w in nodes) + sum(abs(w) for h, w in nodes) / 125000000000
    res.append((i, ok_h, D == F(orig[i]['native_debit']), float(D), float(F(orig[i]['native_debit'])), float(sum(abs(w) for h, w in nodes))))
for r in res: print(r)
print('all shared rows: envelope/node heights native and c>=0:', all(r[1] for r in res), '; debit identity exact:', all(r[2] for r in res), '; rows', len(res))
