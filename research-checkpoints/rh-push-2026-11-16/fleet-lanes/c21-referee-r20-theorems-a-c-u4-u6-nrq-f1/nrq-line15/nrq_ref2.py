# Second referee, NR-q construction (Statement O line 15). mpmath 30 digits; argument principle by quadrature (not ball arithmetic).
import json, os
import mpmath as mp
mp.mp.dps = 30
HERE = os.path.dirname(os.path.abspath(__file__))
q = 1 + mp.sqrt(2); lq = mp.log(q)
def gam(s): return mp.pi**(-s/2)*mp.gamma(s/2)
out = {'q': mp.nstr(q, 25), 'q^(1/2)+q^(-1/2)': mp.nstr(mp.sqrt(q) + 1/mp.sqrt(q), 20)}
# q^k = a_k + b_k sqrt2 with integers a_k, b_k; b_k != 0 for k != 0 (b_k > 0 increasing for k >= 1)
a_, b_ = 1, 0; bs = []
for k in range(1, 13):
    a_, b_ = a_ + 2*b_, a_ + b_; bs.append(b_)
out['b_k of q^k = a_k + b_k sqrt2, k = 1..12 (positive, increasing: no rational power)'] = bs
for c in (mp.mpf('2.1'), mp.mpf('2.05'), mp.mpf('2.2'), mp.mpf('-2.1')):
    m = lambda s: q**(s - mp.mpf(1)/2) + c + q**(mp.mpf(1)/2 - s)
    Gf = lambda s: mp.zeta(s)*m(s)
    rec = {}
    for s0 in (mp.mpc('0.3', '4.7'), mp.mpc('0.9', '21.5')):
        lhs = gam(s0)*Gf(s0); rhs = gam(1 - s0)*Gf(1 - s0)
        rec[f'FE defect rel at {s0}'] = mp.nstr(abs(lhs - rhs)/abs(lhs), 5); rec[f'|G| at {s0}'] = mp.nstr(abs(Gf(s0)), 10)
    bb = mp.acosh(abs(c)/2)/lq
    z0 = mp.mpf(1)/2 + bb + (mp.j*mp.pi/lq if c > 0 else 0)
    rec['b = arccosh(|c|/2)/log q'] = mp.nstr(bb, 20); rec['zero (closed form)'] = mp.nstr(z0, 25)
    rec['|G(zero)|'] = mp.nstr(abs(Gf(z0)), 5); rec['|zeta(zero)|'] = mp.nstr(abs(mp.zeta(z0)), 10); rec['|m\'(zero)|'] = mp.nstr(abs(mp.diff(m, z0)), 10)
    rec['inside the open strip'] = bool(bb < 0.5)
    if not (c < 0):
        # winding number of G on the circle of radius 0.05 about the zero: (1/2 pi i) int G'/G
        def integrand(th):
            s = z0 + mp.mpf('0.05')*mp.expj(th)
            return mp.diff(Gf, s)/Gf(s)*mp.mpf('0.05')*mp.j*mp.expj(th)
        w = mp.quad(integrand, mp.linspace(0, 2*mp.pi, 9))/(2*mp.pi*mp.j)
        wz = mp.quad(lambda th: mp.diff(mp.zeta, z0 + mp.mpf('0.05')*mp.expj(th))/mp.zeta(z0 + mp.mpf('0.05')*mp.expj(th))*mp.mpf('0.05')*mp.j*mp.expj(th), mp.linspace(0, 2*mp.pi, 9))/(2*mp.pi*mp.j)
        rec['winding of G, radius 0.05'] = mp.nstr(w, 12); rec['winding of zeta, same circle'] = mp.nstr(wz, 5)
    # the three cosets at s = 3: sum_n q^(-1/2) (n/q)^-s + c n^-s + q^(1/2) (n q)^-s
    s3 = mp.mpf(3)
    ser = (q**-0.5*q**s3 + c + q**0.5*q**-s3)*mp.zeta(s3)
    direct = mp.nsum(lambda n: q**-0.5*(n/q)**-s3 + c*n**-s3 + q**0.5*(n*q)**-s3, [1, mp.inf])
    rec['generalised series vs product at s = 3'] = mp.nstr(abs(direct - Gf(s3)), 5)
    # parameter of the added generalised prime: 1 + c y + y^2 = (1 - A y)(1 - y/A), y = q^(1/2 - s); in q^-s: A q^(1/2)
    A = (-c - mp.sign(c)*mp.sqrt(c*c - 4))/2
    rec['local parameter modulus |A| q^(1/2)'] = mp.nstr(abs(A)*mp.sqrt(q), 10); rec['q^(1/2)'] = mp.nstr(mp.sqrt(q), 10)
    rec['Re of the zero = 1/2 + log|A| / log q'] = mp.nstr(mp.mpf(1)/2 + mp.log(abs(A))/lq, 15)
    rec['Lemma D ratio (q^(1/2)+q^(-1/2))/|c|'] = mp.nstr((mp.sqrt(q) + 1/mp.sqrt(q))/abs(c), 8)
    rec['residue factor m(1)'] = mp.nstr(m(mp.mpf(1)), 10)
    out[f'c = {c}'] = rec
json.dump(out, open(os.path.join(HERE, 'nrq_ref2.json'), 'w'), indent=1)
print(json.dumps(out, indent=1))
