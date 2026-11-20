# DH control near its own off-line zero rho = 0.808517 + 85.699348 i (quartet rho, 1 - rho, conjugates; zeros of M_DH at these points).
# Points: one of z_1, z_2, z_1 + z_2 within 1e-6 .. 1e-1 of a member of the quartet, or cluster around (1 - rho, rho). T = 0 and (0.3, 0.3). Certified inertia.
import random, math, json, sys
from flint import acb, ctx
import k2
rho = complex(0.808517, 85.699348)
S = [rho, complex(1-rho.real, rho.imag), rho.conjugate(), complex(1-rho.real, -rho.imag)]
def gen(n, rng):
    pts = []
    def low(): return complex(rng.uniform(0.02, 1.5), rng.uniform(-6, 6))
    def dl():
        r = 10**rng.uniform(-6, -1); th = rng.uniform(0, 6.2832); return complex(r*math.cos(th), r*math.sin(th))
    while len(pts) < n:
        s = rng.choice(S); pat = rng.randrange(4)
        if pat == 0: z2 = s + dl(); z1 = low()
        elif pat == 1: z1 = s + dl(); z2 = low()
        elif pat == 2: z2 = s + dl(); z1 = 1 - s + dl()
        else: z2 = complex(rng.uniform(0.02, max(0.03, s.real-0.02)), rng.uniform(-6, 6)); z1 = s + dl() - z2
        if z1.real > 1e-9 and z2.real > 1e-9: pts.append((z1, z2))
    return pts
out = []; tot = [0, 0, 0]
for n in (1, 2, 5, 12, 40):
    for seed in range(12 if n < 40 else 6):
        raw = gen(n, random.Random(77*n + seed))
        for T in ((0, 0), (0.3, 0.3)):
            r = k2.certify(lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw], lambda: k2.M_dh, T)
            tot[0] += 1; tot[1] += (r['status'] == 'ok' and r['nneg'] == 0); tot[2] += (r.get('nneg', 0) > 0)
            out.append(dict(n=n, seed=seed, T=T, status=r['status'], npos=r['npos'], nneg=r['nneg'], prec=r['prec']))
print('DH near its off-line zero: matrices', tot[0], 'certified positive', tot[1], 'with a negative pivot', tot[2])
json.dump(out, open('dh_near_zero.json', 'w'))
