"""Rigorous ball-arithmetic obstruction to one proposed theta factorization.

Requires python-flint==0.9.0. This checks one explicit strict inequality,
not global positivity or RH. Finite integral enclosures are interval Riemann
sums; the omitted theta and integration tails are bounded analytically.
"""
import json
from pathlib import Path
from flint import arb, ctx
import flint

ctx.prec = 160
pi = arb.pi()
terms = 8
q = terms + 1
parts = 4096
end = 4
step = arb(end) / parts

# For r >= 0, the omitted positive theta terms obey
# tail_k <= 4*pi^2*q^4*exp(-pi*q^2). Successive majorants have ratio < 1/2.
tail_k = 4*pi**2*q**4*(-pi*q*q).exp()
# At r=0, k_m'' = exp(-A)*(2A^4-14A^3+165A^2/8-75A/16).
# For A>=pi*81, its absolute polynomial value is <3A^4; again ratio <1/2.
tail_k2 = 6*pi**4*q**8*(-pi*q*q).exp()

def kappa_finite(r):
    result = arb(0)
    er = r.exp()
    e9 = (9*r/4).exp()
    e5 = (5*r/4).exp()
    for n in range(1,terms+1):
        a = pi*n*n
        result += (2*a*a*e9-3*a*e5)*(-a*er).exp()
    return result

k0 = kappa_finite(arb(0)) + arb(0,tail_k.upper())
k2 = arb(0)
for n in range(1,terms+1):
    a=pi*n*n
    k2 += (-a).exp()*(2*a**4-14*a**3+arb(165)*a*a/8-arb(75)*a/16)
k2 += arb(0,tail_k2.upper())
assert k0 > 0 and k2 < 0
alpha = -k2/(2*k0)
gaussian00 = k0*k0/(8*alpha)

partial = arb(0)
for j in range(parts):
    r = arb((2*j+1)*end, 0)/(2*parts) + arb(0,step/2)
    k = kappa_finite(r) + arb(0,tail_k.upper())
    partial += step*r*k*k/2

# On r>=4, kappa(r)<=4*pi^2*exp(9r/4-pi*exp(r)). Thus
# (1/2)*integral_4^infty r*kappa(r)^2 dr
# <=8*pi^4*integral r*exp(9r/2-2*pi*exp(r))dr
# <=8*pi^3*exp(-pi*exp(4)), since 9r/2<=pi*exp(r) and r<=exp(r).
integral_tail = 8*pi**3*(-pi*arb(end).exp()).exp()
h00 = partial + arb(0,integral_tail.upper())
residual = h00-gaussian00
assert h00 > arb('0.0099')
assert h00 < arb('0.0102')
assert gaussian00 > arb('0.0106')
assert residual < -arb(1)/2500

def enclosure(x):
    return {'ball':str(x),'lower':str(x.lower()),'upper':str(x.upper())}

record = {
    'status':'certified negative value for the Gaussian comparison remainder at (0,0)',
    'not_claimed':['global kernel positivity','a counterexample to RH','a Lean proof'],
    'arithmetic':{'library':'python-flint','version':flint.__version__,'precision_bits':ctx.prec},
    'theta_terms':terms,'integration_interval':[0,end],'interval_subdivisions':parts,
    'theta_tail_bound':enclosure(tail_k),
    'theta_second_derivative_tail_bound':enclosure(tail_k2),
    'integration_tail_bound':enclosure(integral_tail),
    'kappa0':enclosure(k0),'kappa_second0':enclosure(k2),
    'alpha':enclosure(alpha),'H00':enclosure(h00),
    'gaussian_rank_one00':enclosure(gaussian00),'remainder00':enclosure(residual),
    'strict_rational_verdict':'H(0,0)-kappa(0)^2/(8*alpha) < -1/2500',
}
out=Path(__file__).with_name('GAUSSIAN_OBSTRUCTION_INTERVAL.json')
out.write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps(record,indent=2))
