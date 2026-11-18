# Second referee pass on Theorem A' (c2-jinner-multidelay-lft): ball-arithmetic check, zeta and DH.
# h(z) = sum_{p in P} c_p (1 + u_p p^-z)/(1 - u_p p^-z), u_p = exp(i phi_p): PR on the polydisc, lossless,
# poles i*gamma, gamma = (phi_p + 2 pi k)/log p, residue 2 c_p/log p.  a_1 = sum c_p.
# S(delta) = sum_{gamma > t0} r F(1/2 + i gamma) exp(-delta gamma), F = zeta or DH.
# Prediction: S = M/(2 pi delta) + Sec(delta) + C + o(1), M the bracket of Theorem A' (zeta) / Section 5 (DH),
# Sec = residues of step (4) on Re w = 1/2 (order delta^-1/2), C independent of delta.
# All sums are acb balls (python-flint); truncation tail bounded with |F(1/2+it)| <= t (t >= 100) and added to the radius.
import sys, json, math, time
from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 100
PI = arb.pi(); I = acb(0, 1)
def e2pi(x): return (2*PI*I*x).exp()
kap = ((10 - 2*arb(5).sqrt()).sqrt() - 2)/(arb(5).sqrt() - 1)
c1 = (1 - I*kap)/2; c2 = (1 + I*kap)/2
CH = {n: dirichlet_char(5, n) for n in (1, 2, 3, 4)}       # Conrey labels; label 2 has chi(2) = i, label 3 = conj
def L(n, w):
    if n == 1: return w.zeta()*(1 - acb(5)**(-w))
    return CH[n].l(w)
def chival(n, m): return CH[n](m) if m % 5 else acb(0)
def tau(n): return sum((chival(n, a)*e2pi(arb(a)/5) for a in range(1, 5)), acb(0))
def fDH(s): return c1*L(2, s) + c2*L(3, s)
def fz(s): return s.zeta()
inv = {1: 1, 2: 3, 3: 2, 4: 4}

def run(name, P, cp, phi, deltas, which, t0=1.0, cut=45.0):
    t_start = time.time()
    dmin = min(deltas); tmax = cut/dmin
    F = fz if which == 'zeta' else fDH
    S = {d: acb(0) for d in deltas}; n = 0
    for p in P:
        lp = arb(p).log(); r = 2*cp[p]/lp
        k = int(math.floor((t0*math.log(p) - phi[p])/(2*math.pi))) - 1
        while True:
            k += 1
            g = (arb(phi[p]) + 2*PI*k)/lp
            if not (g > t0):
                if g < t0: continue
                raise SystemExit('pole height not separated from t0')
            if g > tmax: break
            v = F(acb(arb(1)/2, g)); n += 1
            for d in deltas: S[d] += r*v*(-arb(d)*g).exp()
    a1 = sum(cp[p] for p in P)
    # tail bound: weighted pole density a1/pi per unit height (plus one period per prime), |F| <= t
    tail = {d: (a1/math.pi + sum(2*cp[p]/math.log(p) for p in P))*(tmax/d + 1/d**2 + tmax)*math.exp(-d*tmax) for d in deltas}
    u = {p: (I*arb(phi[p])).exp() for p in P}
    def hstar_tw(n_, z):      # sum conj(a_m) psi(m) m^-z, psi = label n_ (n_ = 0: no twist)
        tot = acb(0)
        for p in P:
            x = u[p].conjugate()*(chival(n_, p) if n_ else 1)*acb(p)**(-z)
            tot += cp[p]*(1 + x)/(1 - x)
        return tot
    half = acb(arb(1)/2)
    rows = []
    for d in deltas:
        da = arb(d); eta = I*(1 - (I*da).exp())
        if which == 'zeta':
            M = a1 + hstar_tw(0, half)
            main_exact = (I*da/2).exp()*hstar_tw(0, half)/(2*PI*eta)       # residue at w = 1, exact
            sec = acb(0)
            for p in P:
                lp = arb(p).log(); r = 2*cp[p]/lp
                K = int(60*math.log(p)/(2*math.pi)) + 2
                for k in range(-K, K + 1):
                    th = (-arb(phi[p]) + 2*PI*k)/lp
                    w = acb(arb(1)/2, th)
                    sec += r*w.gamma()*(2*PI*eta)**(-w)*w.zeta()
            sec *= (I*da/2).exp()
        else:
            M = a1 + c1*hstar_tw(2, half) + c2*hstar_tw(3, half)
            pref = -I*(I*da/2).exp()/arb(5).sqrt()
            main_exact = pref*(c1*tau(2)*hstar_tw(3, half) + c2*tau(3)*hstar_tw(2, half))/5/(2*PI*eta/5)
            sec = acb(0)
            for nps in (1, 2, 3, 4):
                tg = tau(inv[nps])/4
                for p in P:
                    lp = arb(p).log(); r = 2*cp[p]/lp
                    ang = chival(nps, p).arg()
                    K = int(60*math.log(p)/(2*math.pi)) + 2
                    for k in range(-K, K + 1):
                        th = (ang - arb(phi[p]) + 2*PI*k)/lp
                        w = acb(arb(1)/2, th)
                        sec += tg*r*w.gamma()*(2*PI*eta/5)**(-w)*(c1*L((2*nps) % 5, w) + c2*L((3*nps) % 5, w))
            sec *= pref
        Sd = S[d]
        lead = M/(2*PI*da)
        D = Sd - lead - sec
        rows.append({'delta': d, 'poles_summed': n, 'tail_bound': tail[d],
                     'S': str(Sd), '2pi_delta_S': str(2*PI*da*Sd), 'M_pred': str(M),
                     'M_from_residue(=2 pi delta*(main_exact) + a1)': str(2*PI*da*main_exact + a1),
                     'Sec': str(sec), 'D=S-M/(2pi delta)-Sec': str(D),
                     'rel_gap_main_only': float(abs(2*PI*da*Sd - M).abs_upper())/float(abs(M).abs_lower()),
                     'D_mid': [float(D.real.mid()), float(D.imag.mid())], 'S_rad': float(max(Sd.real.rad(), Sd.imag.rad()))})
        print(name, json.dumps(rows[-1])); sys.stdout.flush()
    print(name, 'seconds', round(time.time() - t_start, 1)); sys.stdout.flush()
    return rows

out = {}
# functional equation of DH (ball check): f(s) = 5^(1/2-s) 2 (2 pi)^(s-1) Gamma(1-s) cos(pi s/2) f(1-s)
s = acb(arb(3)/10, arb(7)/3)
X = acb(5)**(arb(1)/2 - s)*2*(2*PI)**(s - 1)*(1 - s).gamma()*(PI*s/2).cos()
out['DH_FE_residual'] = str(fDH(s) - X*fDH(1 - s)); print('DH FE residual', out['DH_FE_residual'])
out['eps_chi*c1-c2'] = str(tau(2)/(I*arb(5).sqrt())*c1 - c2); print('eps(chi) c1 - c2', out['eps_chi*c1-c2'])
out['kappa'] = str(kap)
mode = sys.argv[1]
P = [2, 3, 7, 11]; cp = {p: 1.0 for p in P}
ph0 = {p: 0.0 for p in P}
ph1 = {2: 1.0, 3: 2.0, 7: 0.5, 11: 4.0}
if mode == 'author':     # the lane's own DH and zeta table entries (separable, no phases), delta = 0.04, 0.02
    out['DH_author_table'] = run('DH_sep_nophase', P, cp, ph0, [0.04, 0.02], 'dh')
    out['zeta_author_table'] = run('zeta_sep_nophase', P, cp, ph0, [0.04, 0.02], 'zeta')
if mode == 'zeta':
    out['zeta_phased'] = run('zeta_sep_phased', P, cp, ph1, [0.04, 0.02, 0.01, 0.005, 0.0025], 'zeta')
if mode == 'dh':
    out['DH_phased'] = run('DH_sep_phased', P, cp, ph1, [0.04, 0.02, 0.01, 0.005, 0.0025], 'dh')
json.dump(out, open('ref2_abel_%s.json' % mode, 'w'), indent=1)
