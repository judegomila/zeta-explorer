"""s5 combination 2, Hagedorn boundary: U(beta) = -(log F)'(beta), C_v = beta^2 (log F)''(beta) at beta = b0 + v, v -> 0+,
b0 = 1 (b0 = 5/4 for E_a, a = 1/4).  Arb jets (t4_fejer.F_of)."""
import json, sys
from flint import acb, arb, ctx, acb_series
import t4_fejer as T
ctx.prec = 200
out = {}
for name in ['ZETA', 'L4', 'L5', 'DH', 'TNR3', 'TNRQ', 'EA', 'LIOU']:
    b0 = arb('1.25') if name == 'EA' else arb(1); rows = []
    for v in ['0.1', '0.01', '0.001', '0.0001']:
        b = b0 + arb(v); x = acb_series([acb(b), 1], prec=3); y = T.F_of(name, 1)(x)
        l1 = y[1] / y[0]; l2 = 2 * y[2] / y[0] - l1 * l1
        U = float((-l1).real.mid()); Cv = float((b * b * l2).real.mid()); vv = float(v)
        rows.append({'v': vv, 'U': U, 'v*U': vv * U, 'Cv': Cv, 'v^2*Cv': vv * vv * Cv, 'F': float(abs(y[0]).mid())})
    out[name] = rows
    print('%-5s' % name, ' | '.join('v=%g: vU=%+.5f v^2Cv=%+.5f U=%+.4g' % (r['v'], r['v*U'], r['v^2*Cv'], r['U']) for r in rows))
json.dump(out, open(sys.argv[1], 'w'), indent=1)
