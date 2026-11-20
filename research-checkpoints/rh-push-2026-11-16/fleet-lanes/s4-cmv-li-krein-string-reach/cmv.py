"""Exact-data CMV / Toeplitz run for one object and one anchor.
  python cmv.py CODE a N prec out.json [--planted FILE] [--zeros FILE] [--snap 400,800,...] [--mod FILE]
Outputs: first Levinson index n with E_n <= 0 (section of size n+1 indefinite, |k_n| >= 1), log2 E_n profile,
planted-quadruple detection sizes (finite-rank update, see RESULT.md), eigen-angle counts of the unitary truncation."""
import sys, json, time, math, argparse
from flint import arb, acb, ctx, acb_mat
import core

ap = argparse.ArgumentParser()
ap.add_argument('code'); ap.add_argument('a'); ap.add_argument('N', type=int); ap.add_argument('prec', type=int); ap.add_argument('out')
ap.add_argument('--planted'); ap.add_argument('--zeros'); ap.add_argument('--snap', default='')
ap.add_argument('--tol', default='1e-12'); ap.add_argument('--K', type=int, default=0)
ap.add_argument('--moments'); ap.add_argument('--nostop', action='store_true'); ap.add_argument('--kmin', type=int, default=0)
A = ap.parse_args()
ctx.prec = A.prec
a = arb(A.a); N = A.N
t0 = time.time()
if A.moments:
    c = [arb(x) for x in json.load(open(A.moments))['c']][:N]
else:
    c = core.moments(A.code, a, N)
tm = time.time() - t0
print(A.code, 'a', A.a, 'N', N, 'prec', A.prec, 'moments', round(tm, 1), 's  c0', c[0].str(20), flush=True)
c = [x.mid() for x in c]
I = acb(0, 1)

def cm(x): return acb(x.real.mid(), x.imag.mid())

class Pt:
    """values of Phi_n and Phi*_n at a point z (midpoint acb)"""
    def __init__(s, z): s.z = cm(acb(z)); s.P = acb(1); s.S = acb(1)
    def step(s, k):
        zP = s.z * s.P
        s.P, s.S = cm(zP + k * s.S), cm(s.S + k * zP)

# ---- planted configurations: list of dict(label, terms=[(m, s, t)]) -> Q = sum m conj(psi(s)) psi(t)^T + h.c.
configs = []
if A.planted:
    for cf in json.load(open(A.planted)):
        terms = []
        for kind, d, g in cf['items']:
            d = arb(d); g = arb(g)
            if kind == 'add':            # FE-symmetric quadruple +-d +- i g
                w = acb(d, g); eta = (w - a) / (w + a); m = 4 * a * a / (a * a - w * w)
                terms.append((m, 1 / eta.conjugate(), eta))
                terms.append((m.conjugate(), 1 / eta, eta.conjugate()))
            elif kind == 'del':          # remove the on-line pair +- i g
                w = acb(0, g); z = (w - a) / (w + a); mu = 4 * a * a / (a * a + g * g)
                terms.append((acb(-mu / 2), z, z)); terms.append((acb(-mu / 2), z.conjugate(), z.conjugate()))
        pts = []
        for (m, s, t) in terms: pts += [Pt(s), Pt(t)]
        R = len(pts)
        configs.append(dict(label=cf['label'], gamma=cf.get('gamma'), delta=cf.get('delta'), kind=cf.get('kind'), terms=terms, pts=pts,
                            G=[[acb(0)] * R for _ in range(R)], det_first_neg=None, done=False, lastdet=None))

# ---- eigen-angle check points
zeros = []; snaps = [int(x) for x in A.snap.split(',') if x]
angpts = []
if A.zeros and A.K:
    zs = json.load(open(A.zeros))[A.kmin:A.K]
    tol = arb(A.tol)
    for g in zs:
        g = arb(g); th = arb.pi() - 2 * (g / a).atan()
        angpts.append((th - tol, Pt((I * (th - tol)).exp()), th + tol, Pt((I * (th + tol)).exp())))
snapres = {}

def do_snap(n):
    """unitary truncation of size Nn = n + 1: P(z) = z Phi_n(z) + beta Phi*_n(z), beta = +-1; uses Phi_n at the check points"""
    Nn = n + 1
    res = {}
    for beta, part in ((1, 're'), (-1, 'im')):
        hits = []
        for (t1, p1, t2, p2) in angpts:
            v = []
            for (t, p) in ((t1, p1), (t2, p2)):
                val = (-(I * t * Nn) / 2).exp() * p.z * p.P
                v.append(val.real if part == 're' else val.imag)
            hits.append(1 if (v[0] > 0) != (v[1] > 0) else 0)
        pref = 0
        for h in hits:
            if not h: break
            pref += 1
        res['beta%+d' % beta] = dict(count=sum(hits), prefix=pref + A.kmin, tracked_from=A.kmin + 1, missed_first=[i + 1 + A.kmin for i, h in enumerate(hits) if not h][:10])
    snapres[Nn] = res
    print('   snap size', Nn, json.dumps(res), flush=True)

prof = {}
def track(n, k, E):
    # called with Phi_n available after the update below; first update the points to degree n
    if n > 0:
        for cf in configs:
            if cf['done']: continue
            for p in cf['pts']: p.step(k)
        for (t1, p1, t2, p2) in angpts: p1.step(k); p2.step(k)
    if n % 25 == 0 or n < 40: prof[n] = round(core._l2(E), 2)
    # accumulate G with phi_n = Phi_n/sqrt(E_n); then sections of size n+1
    for cf in configs:
        if cf['done']: continue
        pts = cf['pts']; R = len(pts); G = cf['G']
        iE = 1 / E
        vals = [p.P for p in pts]; cj = [cm(v.conjugate() * iE) for v in vals]
        for p in range(R):
            for q in range(R):
                G[p][q] = cm(G[p][q] + vals[p] * cj[q])
        M = acb_mat(R, R)
        for p in range(R):
            for q in range(R):
                M[p, q] = acb(1) if p == q else acb(0)
        # I + C G, C block diagonal [[0, m], [conj m, 0]] on (2r, 2r+1)
        for r, (m, s, t) in enumerate(cf['terms']):
            for q in range(R):
                M[2 * r, q] = M[2 * r, q] + m * G[2 * r + 1][q]
                M[2 * r + 1, q] = M[2 * r + 1, q] + m.conjugate() * G[2 * r][q]
        d = M.det().real
        cf['lastdet'] = float(d.mid()) if abs(float(d.mid())) < 1e300 else 0.0
        if d < 0:
            cf['det_first_neg'] = n + 1; cf['done'] = True
            print('   planted', cf['label'], 'first indefinite size', n + 1, flush=True)
    if (n + 1) in snaps and angpts: do_snap(n)

t0 = time.time()
r = core.levinson(c, stop=not A.nostop, progress=max(50, N // 20), track=track)
tl = time.time() - t0
n, k, E = r[-1]
first_neg = n if not (E > 0) else None
out = dict(code=A.code, a=A.a, N=N, prec=A.prec, moments_s=round(tm, 1), levinson_s=round(tl, 1), c0=c[0].str(25),
           first_nonpositive_index=first_neg, first_indefinite_size=(first_neg + 1 if first_neg is not None else None),
           last_index=n, last_log2E=core._l2(E), last_k=k.str(12), log2E_profile=prof,
           k_head=[r[i][1].str(12) for i in range(1, min(len(r), 12))],
           min_one_minus_abs_k=min((float((1 - abs(x[1])).mid()), x[0]) for x in r[1:]) if len(r) > 1 else None,
           planted=[dict(label=cf['label'], gamma=cf['gamma'], delta=cf['delta'], kind=cf['kind'], first_indefinite_size=cf['det_first_neg'], lastdet=cf['lastdet']) for cf in configs],
           eigen_angles=snapres)
json.dump(out, open(A.out, 'w'), indent=1)
print('DONE', A.code, 'first index with E<=0:', first_neg, 'last n', n, 'log2E', round(core._l2(E), 1), 'lev s', round(tl, 1), flush=True)
