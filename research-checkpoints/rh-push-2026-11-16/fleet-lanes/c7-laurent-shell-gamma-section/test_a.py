# Test A (Laurent / shell class, no gamma term).  Ball arithmetic (python-flint), poles exact.
# Section: h = Herglotz transform of nu = sum_k r_k delta_{gamma_k},
#   gamma_k = (-th_b + 2 pi k)/log pb        (orbit point w_p = p^{-i gamma} on the hyperplane w_pb = e^{i th_b})
#   r_k = (1/log pb) prod_{p in P, p != pb} Poisson_s(-gamma_k log p - th_p)   > 0
# Closed form (Re z > 0): h = (1/2)(1+u pb^-z)/(1-u pb^-z) + sum_{kappa != 0} s^|kappa| e^{-i kappa.th} u^{m} q_kappa^{-z}/(1 - u pb^-z),
#   q_kappa = pb^m prod p^kappa_p in (1, pb): rational, not integral: a Laurent series in w_p = p^-z, not a power series.
# Prediction (Lemma 1): S(delta)/S1(delta) -> F_hat,  S = sum r_k F(1/2+i gamma_k) e^{-delta gamma_k}, S1 = sum r_k e^{-delta gamma_k},
#   zeta: F_hat = E_P(w_hat),  w_hat_pb = e^{i th_b}, w_hat_p = s e^{i th_p};   DH: F_hat = c1 E_P(chi w_hat) + c2 E_P(conj chi w_hat).
# Also summed: the P-part F_P(1/2 + i gamma_k) at the same poles (sampling control), and the twists q^{+-i gamma}.
import sys, json, time, math, os
from multiprocessing import Pool
from flint import acb, arb, ctx, dirichlet_char
ctx.prec = 80
cfg = json.load(open(sys.argv[1])); func = sys.argv[2]
P = cfg['P']; pb = cfg['pb']; th = {int(k): v for k, v in cfg['theta'].items()}; s_num, s_den = cfg['s']
deltas = cfg['deltas_' + func]; t0 = cfg['t0']; q_tw = cfg['twist_' + func]
tmax = 45.0/min(deltas)
W = int(os.environ.get('RH_WORKERS', '1'))
def setup():
    global PI, LOG, TH, S, KAP, C1, C2, CH, CHB, I
    PI = arb.pi(); LOG = {p: arb(p).log() for p in P + [q_tw]}
    TH = {p: arb(int(round(th[p]*1000)))/1000 for p in P}      # angles are exact rationals (3 decimals)
    S = arb(s_num)/s_den; I = acb(0, 1)
    KAP = ((10 - 2*arb(5).sqrt()).sqrt() - 2)/(arb(5).sqrt() - 1)
    C1 = (1 - I*KAP)/2; C2 = (1 + I*KAP)/2
    CH = dirichlet_char(5, 2); CHB = dirichlet_char(5, 3)
def chi5(p): return {0: acb(0), 1: acb(1), 2: acb(0, 1), 3: acb(0, -1), 4: acb(-1)}[p % 5]
def E_at(wdict, tw=None):
    r = acb(1)
    for p in P:
        x = wdict[p] if tw is None else wdict[p]*tw(p)
        r = r/(1 - x/arb(p).sqrt())
    return r
def F_P(wdict):
    if func == 'zeta': return E_at(wdict)
    return C1*E_at(wdict, chi5) + C2*E_at(wdict, lambda p: chi5(p).conjugate())
def F_full(sv):
    if func == 'zeta': return sv.zeta()
    return C1*CH.l(sv) + C2*CHB.l(sv)
def chunk(args):
    k0, k1 = args; setup()
    acc = {d: [acb(0)]*6 for d in deltas}; n = 0
    for k in range(k0, k1):
        g = (2*PI*k - TH[pb])/LOG[pb]
        if not (g > t0): continue
        r = 1/LOG[pb]; wd = {}
        for p in P:
            ang = -g*LOG[p]; wd[p] = (I*ang).exp()
            if p != pb: r = r*(1 - S*S)/(1 - 2*S*(ang - TH[p]).cos() + S*S)
        v = F_full(acb(arb(1)/2, g)); vp = F_P(wd); tw = (I*g*LOG[q_tw]).exp(); n += 1
        for d in deltas:
            w = (-arb(d)*g).exp()*r if False else (-(arb(int(round(d*1e9)))/10**9)*g).exp()*r
            a = acc[d]; acc[d] = [a[0] + w*v, a[1] + w, a[2] + w*vp, a[3] + w*v*tw, a[4] + w*v/tw, a[5] + w*abs(v)]
    # flint objects do not pickle: send enclosing strings (the parse of '[m +/- r]' encloses the printed ball)
    return n, {d: [(x.real.str(45), x.imag.str(45)) for x in acc[d]] for d in deltas}
if __name__ == '__main__':
    setup(); T0 = time.time()
    kmax = int(tmax*math.log(pb)/(2*math.pi)) + 2; step = 2000
    jobs = [(a, min(a + step, kmax)) for a in range(0, kmax, step)]
    print('func', func, 'P', P, 'pb', pb, 'theta(exact /1000)', {p: round(th[p]*1000)/1000 for p in P}, 's', s_num, '/', s_den,
          'tmax', tmax, 'poles<=', kmax, 'workers', W, 'memory: O(1) per worker'); sys.stdout.flush()
    tot = {d: [acb(0)]*6 for d in deltas}; n = 0
    it = Pool(W).imap(chunk, jobs) if W > 1 else map(chunk, jobs)
    for i, (m, part) in enumerate(it):
        n += m
        for d in deltas: tot[d] = [x + acb(arb(y[0]), arb(y[1])) for x, y in zip(tot[d], part[d])]
        if i % 50 == 0: print('chunk', i, '/', len(jobs), 'poles', n, 'sec', round(time.time() - T0)); sys.stdout.flush()
    wh = {p: (I*TH[p]).exp()*(1 if p == pb else S) for p in P}
    pred = F_P(wh); rows = []
    # tail beyond tmax: |F(1/2+it)| <= t for t >= 100 (classical convexity, as in the predecessor lanes), r <= rmax, pole density log(pb)/2pi
    rmax = float(((1 + S)/(1 - S))**(len(P) - 1)/LOG[pb])
    for d in deltas:
        a = tot[d]; tail = rmax*math.log(pb)/(2*math.pi)*(tmax/d + 1/d**2)*math.exp(-d*tmax)*1.01 + rmax*tmax*math.exp(-d*tmax)
        cf = lambda z: [float(z.real.mid()), float(z.imag.mid())]
        row = {'delta': d, 'poles': n, '2pi*delta*S1': float((2*PI*a[1].real).mid())*d,
               'S/S1': cf(a[0]/a[1]), 'pred F_hat': cf(pred), 'S_P/S1 (P-part at the same poles)': cf(a[2]/a[1]),
               '(S-S_P)/S1': cf((a[0] - a[2])/a[1]),
               'twist q^{+i gamma} mean': cf(a[3]/a[1]), 'twist q^{-i gamma} mean': cf(a[4]/a[1]), 'q': q_tw,
               'mean |F|': float((a[5]/a[1]).real.mid()),
               'ball radius of S/S1': float((a[0]/a[1]).real.rad()) + float((a[0]/a[1]).imag.rad()),
               'tail bound / S1': tail/float(a[1].real.mid())}
        rows.append(row); print(json.dumps(row)); sys.stdout.flush()
    json.dump({'cfg': cfg, 'func': func, 'rows': rows, 'seconds': time.time() - T0}, open(sys.argv[3], 'w'), indent=1)
    print('seconds', time.time() - T0)
