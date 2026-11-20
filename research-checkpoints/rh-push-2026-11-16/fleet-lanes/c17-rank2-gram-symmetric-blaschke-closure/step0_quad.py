# Step 0: independent quadrature check of the 36-term formula for M = 1 and M = -1.
# Claim checked: sum_{w,w'} c c' e^{<nu,T>}/(nu_1 nu_2)  ==  integral over the kite
#   {h: h_1 <= tau_1, h_2 <= tau_2, 2h_1 - h_2 >= 0, 2h_2 - h_1 >= 0} of F_lam(h) conj(F_mu(h)) dh_1 dh_2,
#   F_lam(h) = sum_w c(w) e^{(w lam)_1 h_1 + (w lam)_2 h_2},  c(w) = 1 (M = 1) or (-1)^{l(w)} (M = -1).
# Coordinates h_i = varpi_i(H) (not the alpha-coordinates used by the c16 lane and its referee); iterated Gauss-Legendre in mpmath.
import mpmath as mp, json
mp.mp.dps = 30
def orb(lam, sgn):
    z1, z2 = lam
    return [((z1, z2), 1), ((-z1, z1+z2), sgn), ((z1+z2, -z2), sgn), ((z2, -z1-z2), 1), ((-z1-z2, z1), 1), ((-z2, -z1), sgn)]
def formula(lam, mu, T, sgn):
    t1, t2 = T; tau1 = (2*t1+t2)/mp.mpf(3); tau2 = (t1+2*t2)/mp.mpf(3)
    s = 0
    for (nu, c) in orb(lam, sgn):
        for (nv, d) in orb(mu, sgn):
            a = nu[0]+mp.conj(nv[0]); b = nu[1]+mp.conj(nv[1])
            s += c*d*mp.exp(a*tau1+b*tau2)/(a*b)
    return s
def F(lam, sgn, h1, h2):
    return sum(c*mp.exp(nu[0]*h1+nu[1]*h2) for (nu, c) in orb(lam, sgn))
def kite(lam, mu, T, sgn):
    t1, t2 = T; tau1 = (2*t1+t2)/mp.mpf(3); tau2 = (t1+2*t2)/mp.mpf(3)
    def inner(h1):
        lo = h1/2; hi = min(2*h1, tau2)
        return mp.quad(lambda h2: F(lam, sgn, h1, h2)*mp.conj(F(mu, sgn, h1, h2)), [lo, hi])
    return mp.quad(inner, [0, tau2/2, tau1])
out = []
cases = [((mp.mpc(0.7, 1.3), mp.mpc(0.4, -2.1)), (mp.mpc(1.1, 0.6), mp.mpc(0.25, 0.9)), (0.8, 0.3)),
         ((mp.mpc(0.3, 4.0), mp.mpc(0.9, 0.2)), (mp.mpc(0.3, 4.0), mp.mpc(0.9, 0.2)), (0.0, 1.5)),
         ((mp.mpc(0.05, -0.7), mp.mpc(1.6, 2.2)), (mp.mpc(0.6, 0.1), mp.mpc(0.6, -3.0)), (2.0, 1.0)),
         ((mp.mpc(0.7, 1.3), mp.mpc(0.4, -2.1)), (mp.mpc(1.1, 0.6), mp.mpc(0.25, 0.9)), (0.0, 0.0))]
for sgn in (1, -1):
    for (lam, mu, T) in cases:
        a = formula(lam, mu, T, sgn); b = kite(lam, mu, T, sgn)
        d = abs(a-b)/max(abs(a), mp.mpf(10)**-25)
        rec = dict(M=sgn, T=T, formula=mp.nstr(a, 15), quad=mp.nstr(b, 15), rel_defect=mp.nstr(d, 3) if a != 0 else mp.nstr(abs(a-b), 3))
        print(rec); out.append(rec)
json.dump(out, open('step0_quad.json', 'w'), indent=1)
