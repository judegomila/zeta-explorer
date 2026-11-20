# Combination 2: explicit-formula amplitudes for the inverse of E_a(s) = zeta(s+a) zeta(s-a):
# sum_{n<=x} b_a(n) ~ sum over zeros rho of zeta of x^(rho+a)/((rho+a) zeta'(rho) zeta(rho+2a)) + (terms of order x^(1/2-a)),
# envelope coefficient A_K(a) = sum_{k<=K} 2/(|rho_k + a| |zeta'(rho_k)| |zeta(rho_k + 2a)|) for |M|/x^(1/2+a).
import json, mpmath as mp
mp.mp.dps = 25
g = json.load(open('../c12-control-battery-harness/tables/zeros_ZETA.json'))['gamma'][:60]
out = {}
for a in (mp.mpf(1)/8, mp.mpf(1)/4):
    terms = []
    for gm in g:
        rho = mp.mpc(0.5, mp.mpf(gm)); terms.append(float(2/(abs(rho + a)*abs(mp.zeta(rho, derivative=1))*abs(mp.zeta(rho + 2*a)))))
    out[float(a)] = dict(first=terms[0], sum10=sum(terms[:10]), sum60=sum(terms))
    print('a = %s: first-zero amplitude %.5f, sum over 10 zeros %.4f, over 60 zeros %.4f' % (a, terms[0], sum(terms[:10]), sum(terms)))
# zeta itself: 2/(|rho| |zeta'(rho)|)
t = [float(2/(abs(mp.mpc(0.5, mp.mpf(gm)))*abs(mp.zeta(mp.mpc(0.5, mp.mpf(gm)), derivative=1)))) for gm in g]
print('zeta: first-zero amplitude %.5f, sum over 60 zeros %.4f' % (t[0], sum(t))); out['zeta'] = dict(first=t[0], sum60=sum(t))
json.dump(out, open('ea_pred.json', 'w'), indent=1)
