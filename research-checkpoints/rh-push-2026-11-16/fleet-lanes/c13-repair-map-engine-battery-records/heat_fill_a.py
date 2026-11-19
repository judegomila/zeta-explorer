"""Stage 2a (float64 screen, never a verdict): G(X, t) = F_tau(X + it) e^{pi t/4} from the lattice of heat_grid.py by discrete
convolution with the Gaussian N(0, |tau|/2); on-line sign changes; cell winding numbers; three-sided box counts
N(a, b) = (1/pi) [arg along bottom (0 -> Xmax), right side, top (Xmax -> 0)] = on-line + 2 pairs in [-Xmax, Xmax] x [a, b]
(uses F(-conj z) = conj F(z)).  Usage: python heat_fill_a.py <heat_W.npz> <tau> <zeros_HEAT.json> <out.json>"""
import sys, json, math, numpy as np
d = np.load(sys.argv[1]); W = d['W']; XS = d['X']; T = d['t']; h = float(d['h']); tau = float(sys.argv[2])
old = json.load(open(sys.argv[3]))
s2 = abs(tau) / 2; J = int(round(7.5 / h)); y = h * np.arange(-J, J + 1)
ker = np.exp(-y * y / (2 * s2)) / math.sqrt(2 * math.pi * s2) * h
# F(X + it) = sum_j ker_j F_0(X + i(t + y_j)); F_0(X + iu) = W(u) e^{-pi |u|/4}; G(t) = F e^{pi t/4}  (t + y_j > 0 on the range kept)
n = W.shape[1]; lo = J + int(round(8.5 / h)); idx = np.arange(lo, n - J)       # t >= 0.5 + : all t + y_j > 0
t = T[idx]
G = np.empty((len(XS), len(idx)), dtype=np.complex128)
kk = ker * np.exp(-math.pi * y / 4)
for i in range(len(XS)):
    G[i] = np.correlate(W[i], kk, mode='valid')[lo - J: lo - J + len(idx)]
print('grid', G.shape, 't range', t[0], t[-1], 'max |Im G| / |G| on the axis', np.max(np.abs(G[0].imag) / np.abs(G[0])))
g0 = G[0].real
sc = np.nonzero(g0[:-1] * g0[1:] < 0)[0]
on_new = t[sc] - g0[sc] * h / (g0[sc + 1] - g0[sc])
on_old = np.array([float(x) for x in old['online']])
print('on-line sign changes (step %g) below 2000: %d; table: %d' % (h, int(np.sum(on_new < 2000)), len(on_old)))
# match on-line lists
miss = [x for x in on_old if np.min(np.abs(on_new - x)) > 2e-3]; extra = [x for x in on_new if x < 2000 and np.min(np.abs(on_old - x)) > 2e-3]
print('table on-line zeros without a sign change here:', miss[:10], len(miss), '; sign changes not in the table:', extra[:10], len(extra))
ph = np.angle(G)
def dstep(a): return np.angle(np.exp(1j * a))
# cut heights: rows where every horizontal phase step is small
hstep = np.abs(dstep(np.diff(ph, axis=0)))                       # (60, nt)
rowmax = hstep.max(axis=0)
vstepR = np.abs(dstep(np.diff(ph[-1])))
print('max phase step on the right side X = %g: %.3f rad' % (XS[-1], vstepR.max()))
cuts = []
k0 = int(np.argmin(np.abs(t - 0.6)))
target = 0.0
tgt = [0.6] + [5.0 * m for m in range(1, 401)]
for tg in tgt:
    k = int(np.argmin(np.abs(t - tg)))
    win = np.arange(max(0, k - 30), min(len(t), k + 31))
    kb = win[np.argmin(rowmax[win])]
    cuts.append(int(kb))
cuts = sorted(set(cuts))
print('cut rows: %d, worst horizontal phase step on a cut: %.3f rad' % (len(cuts), max(rowmax[c] for c in cuts)))
argR = np.concatenate([[0.0], np.cumsum(dstep(np.diff(ph[-1])))])       # continuous arg on the right side
def hor(k):                                                                # continuous arg change from X = 0 to Xmax on row k
    return float(np.sum(dstep(np.diff(ph[:, k]))))
off_old = [(float(q[0]), float(q[1])) for q in old['offline']]
boxes = []; tot_def = 0; worst = 0
for a, b in zip(cuts[:-1], cuts[1:]):
    N = (hor(a) + (argR[b] - argR[a]) - hor(b)) / math.pi
    Ni = int(round(N)); worst = max(worst, abs(N - Ni))
    non = int(np.sum((on_new > t[a]) & (on_new < t[b]))); nold = sum(1 for q in off_old if t[a] < q[1] < t[b])
    boxes.append(dict(a=float(t[a]), b=float(t[b]), count=Ni, frac=N - Ni, online=non, pairs_table=nold, deficit=Ni - non - 2 * nold))
print('boxes %d; worst |count - integer| %.2e; total count %d; on-line %d; table pairs %d; sum of deficits %d'
      % (len(boxes), worst, sum(x['count'] for x in boxes), sum(x['online'] for x in boxes), sum(x['pairs_table'] for x in boxes), sum(x['deficit'] for x in boxes)))
bad = [x for x in boxes if x['deficit'] != 0]
print('boxes with deficit != 0:', len(bad), 'odd deficits:', sum(1 for x in bad if x['deficit'] % 2))
# cell windings for X >= XS[1]
dX = dstep(np.diff(ph, axis=0)); dT = dstep(np.diff(ph, axis=1))
wn = (dX[1:, :-1] + dT[2:, :] - dX[1:, 1:] - dT[1:-1, :]) / (2 * math.pi)       # cells i = 1..59
wi = np.rint(wn).astype(int)
cells = np.argwhere(wi != 0)
cand = [[float(XS[i + 1] + 0.025), float(t[k] + h / 2), int(wi[i, k])] for i, k in cells]
print('cells with winding != 0 (X >= %.2f): %d (values %s)' % (XS[1], len(cand), sorted(set(c[2] for c in cand))))
# axis candidates: local minima of |G(0, t)| relative to neighbours without sign change -> possible pairs with Re z < XS[1]
a0 = np.abs(g0); lm = np.nonzero((a0[1:-1] < a0[:-2]) & (a0[1:-1] < a0[2:]) & (g0[:-2] * g0[2:] > 0))[0] + 1
axis = [[0.03, float(t[k]), 0] for k in lm]
print('axis local minima without sign change:', len(axis))
json.dump(dict(tau=tau, h=h, online_new=[float(x) for x in on_new if x < 2000.0], boxes=boxes, cand=cand, axis=axis, t_first=float(t[0]), t_last=float(t[-1])), open(sys.argv[4], 'w'))
