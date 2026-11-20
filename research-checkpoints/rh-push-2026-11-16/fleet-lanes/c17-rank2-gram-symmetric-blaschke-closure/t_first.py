# decisive first test (local): T = 0 and a small T grid, zeta vs symmetric insertions, n = 6 and 12, ball-certified inertia.
import random, json, sys
from flint import acb, arb, ctx
import k2
random.seed(17)
def pts_fn(raw): return lambda: [(acb(a.real, a.imag), acb(b.real, b.imag)) for (a, b) in raw]
def quartet(eta, g): 
    return [complex(0.5-eta, g), complex(0.5-eta, -g), complex(0.5+eta, g), complex(0.5+eta, -g)]
cases = {'zeta': [], 'sym(0.3,3)': quartet(0.3, 3), 'sym(0.05,0.5)': quartet(0.05, 0.5), 'sym(0.45,14.2)': quartet(0.45, 14.2),
         'realpair(0.3)': [0.2, 0.8], 'left(0.2+3i)': [complex(0.2, 3), complex(0.2, -3)], 'real1(0.75)': [0.75]}
out = []
for n in (6, 12):
    for rep in range(3):
        raw = [(complex(random.uniform(0.05, 1.5), random.uniform(-6, 6)), complex(random.uniform(0.05, 1.5), random.uniform(-6, 6))) for _ in range(n)]
        for name, zs in cases.items():
            for T in ((0, 0), (0.3, 0), (1, 1)):
                r = k2.certify(pts_fn(raw), lambda: k2.make_M(k2.M_zeta, zs), T)
                r.update(case=name, T=T, rep=rep); out.append(r)
                print(json.dumps(r)); sys.stdout.flush()
json.dump(out, open('t_first.json', 'w'), indent=0)
