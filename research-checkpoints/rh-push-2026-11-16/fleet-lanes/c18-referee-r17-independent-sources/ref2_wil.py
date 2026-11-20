"""Second referee, independent rerun of two c17-window-information-law table entries (one pair at an ordinate).
Own derivation: T = T0' + sum_zeros |v><v| - sum_lat |v><v| + |v_z><v_zbar| + |v_zbar><v_z| on L^2[-u/2,u/2].
Inertia identity on B = [[T0', V],[V*, -K]] (K = K^-1): neg(T) = pos(K + Q) - pos(K), Q = V* T0'^-1 V.
Verdict pass iff pos(K+Q) = n_zeros + 1, certified by ball signs. Not the lane's R K R + R test and none of its code."""
import json, math, sys, time, os
from flint import arb, acb, arb_mat, acb_mat, ctx
ctx.prec = int(os.environ.get('PREC', '1024'))
T = 1e6; H = 45.0
theta = float(sys.argv[1]); M = arb(sys.argv[2]); x0 = float(sys.argv[3]); claimed = float(sys.argv[4])
Tb = arb(T); Lg = (Tb / (2 * arb.pi())).log(); u = arb(theta) * Tb.log(); half = u / 2
zs = [g for g in json.load(open('zeros_1e+06.json'))['zeros_minus_T'] if abs(g) <= H]
d = 2 * arb.pi() / Lg; jmax = int(H / float(d))
lat = [d * j for j in range(-jmax, jmax + 1)]
print("theta", theta, "M", M, "u", float(u), "Lg", float(Lg), "zeros", len(zs), "lattice removed", len(lat), "prec", ctx.prec, flush=True)
uf, Lf = float(u), float(Lg)
# segments of [-u/2,u/2] on which the fibre {s - m Lg in I} is constant
bp = [(-uf / 2, -half), (uf / 2, half)]
j = 1
while j * Lf < uf:
    bp.append((uf / 2 - j * Lf, half - j * Lg)); bp.append((-uf / 2 + j * Lf, -half + j * Lg)); j += 1
bp.sort(key=lambda t: t[0])
segs = []
for (f1, s1), (f2, s2) in zip(bp[:-1], bp[1:]):
    mid = (f1 + f2) / 2
    ms = [m for m in range(-j - 2, j + 3) if -uf / 2 < mid - m * Lf < uf / 2]
    segs.append((s1, s2, ms))
print("segments", [(round(float(a), 4), round(float(b), 4), ms) for a, b, ms in segs], flush=True)
I1 = acb(0, 1)
def seg_int(zeta, s1, s2):
    return (s2 - s1) * (I1 * zeta * (s1 + s2) / 2).exp() * (zeta * (s2 - s1) / 2).sinc()
def Q(a, b):
    """<v_a, T0'^-1 v_b>, a, b acb."""
    zeta = b - a.conjugate()
    if len(segs) == 1:
        return seg_int(zeta, -half, half) / (Lg + 2 * M)
    tot = acb(0)
    for s1, s2, ms in segs:
        k = len(ms)
        base = seg_int(zeta, s1, s2)
        ck = Lg / (2 * M * (2 * M + k * Lg))
        ph = acb(0)
        for m in ms:
            ph += (-I1 * b * m * Lg).exp()
        tot += base * (1 / (2 * M) - ck * ph)
    return tot
on = [acb(arb(z)) for z in zs] + [acb(p) for p in lat]
Ko = [1] * len(zs) + [-1] * len(lat)
n = len(on)
print("planned: %d x %d arb matrix, about %.3f GB" % (n, n, n * n * (ctx.prec / 8 + 64) * 3 / 1e9), flush=True)
t0 = time.time()
O = [[None] * n for _ in range(n)]
maxim = 0.0
for i in range(n):
    for jx in range(i, n):
        q = Q(on[i], on[jx])
        maxim = max(maxim, abs(float(q.imag.mid())) + float(q.imag.rad()))
        O[i][jx] = q.real; O[jx][i] = q.real
    O[i][i] = O[i][i] + Ko[i]
print("on-line block built", round(time.time() - t0, 1), "s; max |imag| of entries", maxim, flush=True)
# inertia of O by LDL (zeros first: leading block I + Q_zz > 0)
A = [r[:] for r in O]
pos = neg = 0
for k in range(n):
    p = A[k][k]
    if p > 0: pos += 1
    elif p < 0: neg += 1
    else: print("UNDECIDED pivot", k, p); sys.exit(1)
    inv = 1 / p
    rk = A[k]
    for i in range(k + 1, n):
        f = A[i][k] * inv
        ri = A[i]
        for jx in range(i, n):
            ri[jx] = ri[jx] - f * rk[jx]
    for i in range(k + 1, n):
        for jx in range(i + 1, n):
            A[jx][i] = A[i][jx]
print("inertia of on-line block: pos", pos, "neg", neg, "(background T0 >= 0 iff pos == n_zeros = %d)" % len(zs), round(time.time() - t0, 1), "s", flush=True)
Om = arb_mat(O)
Oinv = acb_mat(Om.inv())
def test(b):
    z = acb(arb(x0), arb(b)); zb = z.conjugate()
    pts = [z, zb]
    C = acb_mat([[Q(pts[i], pts[jx]) for jx in range(2)] for i in range(2)])
    C = C + acb_mat([[0, 1], [1, 0]])
    R = acb_mat([[Q(p, o) for o in on] for p in pts])          # 2 x n : <v_p, W v_o>
    S = C - R * Oinv * R.conjugate().transpose()
    s00, s11 = S[0, 0].real, S[1, 1].real
    det = s00 * s11 - (S[0, 1] * S[1, 0]).real
    herm = abs(float((S[0, 1] - S[1, 0].conjugate()).abs_upper()))
    tr = s00 + s11
    if det < 0: v = 'pass' if pos == len(zs) else 'fail'      # S has signature (1,1): pos(K+Q) = pos + 1
    elif det > 0 and tr > 0: v = 'fail'                        # two positive: one negative direction of T
    elif det > 0 and tr < 0: v = 'impossible'
    else: v = 'undecided'
    return v, float(det.mid()), herm
def threshold(lo, hi, steps):
    v = test(hi)
    print("b", hi, v, flush=True)
    if v[0] == 'pass': return hi
    v = test(lo); print("b", lo, v, flush=True)
    if v[0] != 'pass': return None
    for _ in range(steps):
        mid = (lo + hi) / 2
        v = test(mid); print("b", mid, v, flush=True)
        if v[0] == 'pass': lo = mid
        else: hi = mid
    return lo
b = threshold(1e-4, 0.4999, 11)
print(json.dumps(dict(T=T, theta=theta, M=float(M.mid()), x=x0, b_referee2=b, b_lane=claimed, equal=(b == claimed), bracket_width=(0.4999 - 1e-4) / 2 ** 11)), flush=True)
