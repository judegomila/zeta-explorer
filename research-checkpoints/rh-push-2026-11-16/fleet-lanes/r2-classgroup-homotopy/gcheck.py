import numpy as np, math, json
def primes(N):
    sv = np.ones(N + 1, dtype=bool); sv[:2] = False
    for i in range(2, int(N ** .5) + 1):
        if sv[i]: sv[i * i::i] = False
    return np.nonzero(sv)[0]
PR = primes(10 ** 8); P = PR[(PR % 20 == 3) | (PR % 20 == 7)].astype(np.float64); X = 1e8
for sig in (1.13, 1.15, 1.18, 1.2, 1.25):
    g = 2 * math.atan(2 ** -sig) + 4 * float(np.sum(np.arctan(P ** -sig)))
    tail = 4 * X ** (1 - sig) / (sig - 1)     # rigorous: 4 sum_{n>X} n^-sigma <= 4 X^(1-sigma)/(sigma-1)
    print('G_trunc(%.2f)=%.6f  rigorous tail bound %.6f  upper %.6f  (pi=%.6f)' % (sig, g, tail, g + tail, math.pi))
tr = json.load(open('stage5_tracks.json')) if __import__('os').path.exists('stage5_tracks.json') else []
from collections import Counter
print(Counter((t['side'], t['status']) for t in tr))
print('max Re on Z1 side:', max((t['max_re'] for t in tr if t['side'] == 'Z1side'), default=None))
bad = [t for t in tr if t['status'] == 'rejoin' and t['match_err'] > 0.05]; print('rejoin matches with |dt|>0.05:', len(bad), [(round(t['t_leave'], 3), round(t['match_err'], 3)) for t in bad][:10])
