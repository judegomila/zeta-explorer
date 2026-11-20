# smallest gaps between consecutive zeta zeros with ordinate in [330, 1610] (mpmath zetazero), to compare with the
# abscissas where D_tau < 0 for the heat controls (isolated-pair estimate: a gap g in x = 2*height closes at t = -g^2/8).
import mpmath as mp, json
mp.mp.dps = 15
out = []
prev = None
n = 140
while True:
    g = float(mp.zetazero(n).imag)
    if g > 1612: break
    if prev is not None:
        out.append((g - prev, prev, g, n - 1))
    prev = g; n += 1
out.sort()
rows = [{'gap_height': round(a, 5), 'gamma_lo': round(b, 4), 'gamma_hi': round(c, 4), 'index': k, 'x_mid': round(b + c, 3), 'isolated_pair_time': round(-(2*a)**2/8, 5)} for a, b, c, k in out[:14]]
for r in rows: print(r)
json.dump(rows, open('out/gaps.json', 'w'), indent=0)
