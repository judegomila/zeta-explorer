"""Second pass R-3: formula (U2) against the defining integral in the original coordinates (x, y), mpmath only.
I = int_{y > h_i} int_{|x| < X(y)} (y / (c^2 (x^2 + y^2)))^a  y^(bbar - 2) dx dy,  X^2 = y/(c^2 h_j) - y^2."""
import mpmath as mp, json
mp.mp.dps = 30
def Bq(e, q):
    return mp.quad(lambda t: t ** (e - 1) * (1 - t) ** (-mp.mpf(1) / 2), [q, (1 + q) / 2, 1])
def closed(c, hi, hj, a, bb):
    q = c * c * hi * hj
    return c ** (-2 * a) / (bb - a) * ((c * c * hj) ** (a - bb) * Bq(bb - mp.mpf(1) / 2, q) - hi ** (bb - a) * Bq(a - mp.mpf(1) / 2, q))
def direct(c, hi, hj, a, bb):
    ytop = 1 / (c * c * hj)
    def inner(y):
        X = mp.sqrt(y / (c * c * hj) - y * y)
        return y ** (bb - 2) * 2 * mp.quad(lambda x: (y / (c * c * (x * x + y * y))) ** a, [0, X])
    return mp.quad(inner, [hi, (hi + ytop) / 2, ytop])
out = []
g1 = mp.mpf('14.134725141734693790457251983562')
for (c, hi, hj, sig, t) in [(1, mp.mpf(1) / 2, mp.mpf(1), mp.mpf(1) / 2, g1), (1, mp.mpf(1) / 8, mp.mpf(2), mp.mpf('0.9'), g1), (2, mp.mpf(1) / 8, mp.mpf(1) / 3, mp.mpf(1) / 2, mp.mpf('17.5')), (3, mp.mpf(1) / 32, mp.mpf(1) / 2, mp.mpf('0.95'), mp.mpf('30.4'))]:
    w = mp.mpc(sig, t) / 2
    for a, b in [(w, w), (w, 1 - w), (1 - w, w), (1 - w, 1 - w)]:
        bb = mp.conj(b)
        v1 = closed(c, hi, hj, a, bb); v2 = direct(c, hi, hj, a, bb)
        out.append(dict(c=c, hi=str(hi), hj=str(hj), sigma=str(sig), t=str(t), absdiff=float(abs(v1 - v2)), size=float(abs(v1))))
        print(out[-1])
json.dump(out, open('ref_u2.json', 'w'), indent=1)
print("max rel", max(o['absdiff'] / o['size'] for o in out))
