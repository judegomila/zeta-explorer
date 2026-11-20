# Author's second pass: separate checks (different seed, random instances).
import json, os, random, mpmath as mp
HERE = os.path.dirname(os.path.abspath(__file__)); mp.mp.dps = 30
rnd = random.Random(90917); out = {}
# (1) Theorem E1': random symmetric zero multisets on a grid of real parts; rule vs direct pole search.
def Ra(zs, a, w):
    v = mp.mpf(1)
    for z in zs: v *= (w-a-z)/(w+a-z)
    return v
agree = 0; n = 0; npred = 0; rows = []
for trial in range(400):
    a = rnd.choice([0.05, 0.1, 0.15, 0.2, 0.25])
    ords = [1.0, 2.5]
    mult = {}                      # (beta>=0 in units of 0.05, ordinate) -> multiplicity
    for g in ords:
        for _ in range(rnd.randint(1, 4)):
            b = rnd.randint(0, 9)  # beta = 0.05*b < 0.5
            mult[(b, g)] = mult.get((b, g), 0) + rnd.randint(1, 2)
    m = lambda b, g: mult.get((abs(b), g), 0)
    ka = round(a/0.05)
    pred = all(m(b - 2*ka, g) >= mu_ for (b, g), mu_ in mult.items() if b > ka)
    zs = []
    for (b, g), mu_ in mult.items():
        pts = {mp.mpc(0.05*b, g), mp.mpc(-0.05*b, g), mp.mpc(0.05*b, -g), mp.mpc(-0.05*b, -g)}
        for p in pts: zs += [p]*mu_
    # direct: look for a pole at each candidate w = lambda - a with Re > 0 (ratio blow-up at distance 1e-8)
    pole = False
    for (b, g), mu_ in mult.items():
        if b > ka:
            # pole test by scaling: order-m pole gives ratio 1e6^m between distances 1e-14 and 1e-8
            # (first version used the size test abs > 1e3 at 1e-8 and missed 3 poles with small residue)
            w1 = mp.mpc(0.05*b - a + mp.mpf('1e-8'), g); w2 = mp.mpc(0.05*b - a + mp.mpf('1e-14'), g)
            if abs(Ra(zs, a, w2)) > 1e3*abs(Ra(zs, a, w1)): pole = True
    sup = max(abs(Ra(zs, a, mp.mpc(10**rnd.uniform(-3, 0.7), rnd.uniform(-4, 4)))) for _ in range(150))
    obs = (not pole)
    if (not pole) and sup > 1 + mp.mpf('1e-20'): rows.append(dict(note='no pole but sup>1', sup=float(sup)))
    n += 1; agree += (obs == pred); npred += pred
    if obs != pred: rows.append(dict(a=a, mult={str(k): v for k, v in mult.items()}, pred=pred, pole=pole, sup=float(sup)))
out['E1prime_random'] = dict(trials=n, agree=agree, predicted_schur=npred, disagreements=rows)
print(out['E1prime_random'], flush=True)
# (2) kernel: small-r coefficient and the limit of core/tail bounds at constant amplitude
def omega(r, a, h):
    beta = mp.pi*h/a; q = mp.e**(-mp.pi*r/a)
    return 2*mp.pi*r*mp.sin(beta)/(a*h)*q*(1-q*q)/(1+2*q*mp.cos(beta)+q*q)**2
ker = []
for a, h in ((1.0, 0.5), (0.6, 0.3), (1.0, 0.9), (0.3, 0.03)):
    beta = mp.pi*h/a
    kap = 4*mp.pi**2*mp.sin(beta)/(a*a*h*(2+2*mp.cos(beta))**2)
    for R in (0.2*(a-h), 0.05*(a-h), 0.0125*(a-h)):
        core_max = mp.quad(lambda r: omega(r, a, h), [0, R])/(2*a*R)     # mu = M = pi/(4R)
        tail = mp.quad(lambda r: omega(r, a, h)/(2*a*r), [R, 2*R, a, 6*a, 40*a])
        ker.append(dict(a=a, h=h, R=float(R), omega_over_kappa_r2_at_R=float(omega(R, a, h)/(kap*R*R)),
                        core_max=float(core_max), kappaR2_over_6a=float(kap*R*R/(6*a)), tail=float(tail),
                        core_over_tail=float(core_max/tail)))
        print(ker[-1], flush=True)
out['kernel_small_R'] = ker
# (3) threshold R*/(a-h) at constant amplitude
def g(R, a, h):
    return mp.quad(lambda r: omega(r, a, h), [0, R])/(2*a*R) - mp.quad(lambda r: omega(r, a, h)/(2*a*r), [R, 2*R, 4*R+5*a, 60*a])
thr = []
mp.mp.dps = 15
for x in (0.02, 0.1, 0.3, 0.5, 0.7, 0.9, 0.97, 0.99):
    Rs = mp.findroot(lambda R: g(R, 1, x), (0.3*(1-x)+0.001, 2.0), solver='bisect', tol=1e-9, verify=False)
    thr.append(dict(h_over_a=x, Rstar_over_a=float(Rs), Rstar_over_a_minus_h=float(Rs/(1-x)), max_M_times_a_minus_h=float(mp.pi/(4*Rs)*(1-x))))
    print(thr[-1], flush=True)
out['threshold'] = thr
json.dump(out, open(os.path.join(HERE, 'second_pass.json'), 'w'), indent=1)
