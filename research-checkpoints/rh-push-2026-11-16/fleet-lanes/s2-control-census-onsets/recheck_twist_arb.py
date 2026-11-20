# Higher-precision re-check (python-flint, 200 bits) of off-line zeros of DH x chi_d reported by twist.py for FE-type twists (d = +-1 mod 5):
# F_d(s) = (1/2)[c0 L(s, chi5 chi_d) + conj(c0) L(s, conj(chi5) chi_d)] evaluated with Arb Dirichlet L-functions; Newton refinement from the float zero.
import json, math, sys, twist
from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 200
KAP = ((10 - 2*arb(5).sqrt()).sqrt() - 2)/(arb(5).sqrt() - 1); C0 = acb(1, -KAP)
def find_char(q, vals):
    for m in range(1, q):
        if math.gcd(m, q) != 1: continue
        ch = dirichlet_char(q, m)
        if all(abs(complex(ch(n)) - vals(n)) < 1e-9 for n in range(1, 80)): return ch
    raise ValueError
def Fd(d, X):
    q = 5*abs(d)
    ch = find_char(q, lambda n: complex(X[n])*twist.CHI5[n % 5]); chb = find_char(q, lambda n: complex(X[n])*twist.CHI5[n % 5].conjugate())
    return lambda s: (C0*ch.l(s) + C0.conjugate()*chb.l(s))/2
rows = [json.loads(l) for l in open(sys.argv[1])]
rows = [r for r in rows if 'err' not in r and r['fe'] < 1e-6 and r['off'] and abs(r['d']) <= int(sys.argv[2])]
rows.sort(key=lambda r: abs(r['d'])); out = []
for r in rows[:int(sys.argv[3])]:
    d = r['d']; X = twist.kron_table([d], 100)[0]; F = Fd(d, X)
    zf = max(r['off'], key=lambda z: z[1])            # z = t - i(beta - 1/2); Im z > 0 means beta < 1/2; take one of the pair
    s = acb(0.5 - zf[1], zf[0]) if True else None
    for _ in range(8):
        h = acb(arb(2)**(-60)); f0 = F(s); dv = (F(s + h) - F(s - h))/(2*h); s = acb((s - f0/dv).real.mid(), (s - f0/dv).imag.mid())
    f0 = F(s); dv = (F(s + h) - F(s - h))/(2*h)
    rad = abs(f0/dv)                                   # distance to the true zero <= ~|F/F'|
    rec = dict(d=d, q=5*abs(d), float_zero=[0.5 - zf[1], zf[0]], beta=float(s.real.mid()), gamma=float(s.imag.mid()), abs_F=float(abs(f0).upper()), newton_step=float(rad.upper()), dist_from_line=float(abs(s.real.mid() - 0.5)))
    out.append(rec); print(rec, flush=True)
json.dump(out, open('recheck_twist_arb.json', 'w'), indent=1)
