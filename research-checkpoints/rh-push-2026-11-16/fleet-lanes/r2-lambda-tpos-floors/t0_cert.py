# Certificate for the t = 0 probe measure in t0_config.json (weights w_i = y*omega_i on symmetric pairs (h_i, +-x_i), each side w_i/2).
# (1) boundary domination r_w(d) >= 0 for all real d, exactly: numerator polynomial over Q has no real root (Sturm chain) and is positive at 0.
# (2) value: E = sum_i w_i (L_lo - own_i) - (1/2) sum_{n<=Nc} Lambda(n) n^{-1/2} |what(n)| - (1/2) sum_i w_i tail_i   (40-digit mpmath, not interval).
import json, sys
from fractions import Fraction as F
from flint import fmpq_poly, fmpq
import mpmath as mp
mp.mp.dps = 40
cfg = json.load(open(sys.argv[1] if len(sys.argv) > 1 else 't0_config.json'))
q = F(cfg['q0']); probes = [(F(h), F(x), F(o)) for h, x, o in cfg['probes']]
def fq(v): return fmpq(v.numerator, v.denominator)
d = fmpq_poly([0, 1])
def P(*c): return fmpq_poly([fq(F(v)) for v in c])
def Ktil(h, shift):
    u = d + P(shift)                      # u = d + shift
    num = (u*u + P(h*h - q))*P(2*h); den = (u*u + P(h*h + q))*(u*u + P(h*h + q)) - P(4*h*h*q)
    return num, den
terms = [(P(4), d*d + P(4*q), F(1))]      # 4/(d^2+4q)   [r_w / y]
for h, x, o in probes:
    for sgn in (1, -1):
        n_, d_ = Ktil(h, sgn*x); terms.append((n_, d_, -o/2))
den_all = fmpq_poly([1])
for _, de, _ in terms: den_all = den_all*de
num = fmpq_poly([0])
for nu, de, co in terms:
    other = fmpq_poly([1])
    for _, de2, _ in terms:
        if de2 is not de: other = other*de2
    num = num + nu*other*P(co)
# all denominators are positive on R (h > y), so sign r_w = sign num
def sturm_count(p):
    seq = [p, p.derivative()]
    while seq[-1].degree() > 0:
        rem = seq[-2] % seq[-1]
        if rem.degree() < 0: break
        seq.append(-rem)
    def sgn_inf(s, plus):
        lc = s.coeffs()[-1]; sg = 1 if lc > 0 else -1
        return sg if (plus or s.degree() % 2 == 0) else -sg
    def changes(v):
        v = [a for a in v if a != 0]; return sum(1 for a, b in zip(v, v[1:]) if a*b < 0)
    gcd_trivial = seq[-1].degree() == 0
    return changes([sgn_inf(s, False) for s in seq]) - changes([sgn_inf(s, True) for s in seq]), gcd_trivial, len(seq)
nroots, sqfree, ln = sturm_count(num)
lead = num.coeffs()[-1]; at0 = num(fmpq(0))
print('numerator degree', num.degree(), ' Sturm chain length', ln, ' squarefree:', sqfree, ' real roots:', nroots, ' leading coeff > 0:', lead > 0, ' value at 0 > 0:', at0 > 0)
ok = (nroots == 0 and sqfree and lead > 0 and at0 > 0)
# far-field and mass
W_over_y = sum(o for _, _, o in probes); mom = sum(o*h for h, _, o in probes)
print('sum omega =', float(W_over_y), ' sum omega h =', float(mom), '(<= 2 required):', mom <= 2)
# (2) value
X = mp.mpf(6000000185827); y = mp.sqrt(mp.mpf(q.numerator)/q.denominator); Llo = mp.log((X - 8)/(4*mp.pi))/4
def K(h, dd, b): return (h-b)/(dd*dd+(h-b)**2) + (h+b)/(dd*dd+(h+b)**2)
Nc = cfg['Nc']; pen = mp.mpf(0); parts = [mp.mpf(0)]*len(probes)
for n in range(2, Nc+1):
    m = n; p = next((dd for dd in range(2, int(n**.5)+1) if n % dd == 0), n)
    while m % p == 0: m //= p
    if m != 1: continue
    ln_ = mp.log(n); lam = mp.log(p)
    cs = [mp.mpf(n)**(-(1+mp.mpf(h.numerator)/h.denominator)/2) for h, _, _ in probes]
    wh = sum(y*mp.mpf(o.numerator)/o.denominator*c*mp.cos(mp.mpf(x.numerator)/x.denominator/2*ln_) for (h, x, o), c in zip(probes, cs))
    pen += lam*abs(wh); parts = [a + lam*c for a, c in zip(parts, cs)]
E = -pen/2; W = mp.mpf(0); own_tot = mp.mpf(0); rows = []
for (h, x, o), part in zip(probes, parts):
    hf = mp.mpf(h.numerator)/h.denominator; xf = mp.mpf(x.numerator)/x.denominator; w = y*mp.mpf(o.numerator)/o.denominator
    sig = (1 + hf)/2; tail = -mp.zeta(sig, derivative=1)/mp.zeta(sig) - part; assert tail > 0
    own = K(hf, xf, y); E += w*(Llo - own) - w*tail/2; W += w; own_tot += w*own
    rows.append((float(hf), float(xf), float(w), float(tail), float(own)))
E -= mp.mpf(10)**-9                      # O(1/x) terms of Re xi'/xi and rounding, see RESULT.md
r0 = 1/y - own_tot
print('W = %.6f  r_w(0) = %.6f  E = %.6f  equivalent rate 2E/y = %.5f  (-y\' >= 1/y + E = %.5f; F2 first substep: 1/y + c0 y/2 = %.5f, c0 = 11.00760)' % (W, r0, E, 2*E/y, 1/y + E, 1/y + mp.mpf('11.007597553858266')*y/2))
print('probes (h, x, w, tail, own):', rows)
json.dump(dict(domination_exact=bool(ok), degree=num.degree(), real_roots=nroots, W=float(W), E=float(E), rate=float(2*E/y), r0=float(r0), y=float(y),
               probes_float=[[r[0], r[1], r[2]] for r in rows]), open('t0_cert.json', 'w'), indent=1)
