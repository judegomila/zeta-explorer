import sys
from plan import weights
q = int(sys.argv[1]); W = weights(q); ws = ' '.join(f'{w[0]} {w[1]} {w[2]} {w[3]} 0' for w in W.values())
for spec in sys.argv[2:]:
    lam, d = spec.split(','); print(f'{q} {d} 0 {lam} 0 0 0 0 0 5 0 0 0 0 1 12 0 0 0'); print(f'{q} {d} 3 {lam} {ws}')
