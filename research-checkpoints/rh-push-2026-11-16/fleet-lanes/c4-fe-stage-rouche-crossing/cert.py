# Ball-arithmetic certificate (python-flint / Arb) of the degree inequality
#   zeta(s)/G_X(s) not in (-inf, 0]  for every s on the boundary of B = [sigma0, 2] x [t1, t2],
# G_X(s) = P_X(s) + chi(s) conj(P_X(s)),  log P_X(s) = sum_{n <= X} Lambda(n) n^{-s} / log n.
# zeta on a segment: Taylor polynomial at the segment centre (exact-centre series) plus the
# Lagrange remainder delta^K * c_K(segment ball), c_K from the series evaluated on the ball.
import sys, json, math, time, os
from flint import acb, arb, acb_series, ctx
ctx.prec = 100
OUT = os.path.dirname(os.path.abspath(__file__))
T1 = float(sys.argv[1]); T2 = float(sys.argv[2]); X = int(sys.argv[3]); dL = float(sys.argv[4])
L = math.log(1e6/(2*math.pi)) if len(sys.argv) < 6 else float(sys.argv[5])
sigma0 = 0.5 + dL/L
K = 12; h = 0.01
pp = []
for p in range(2, X+1):
    if all(p % q for q in range(2, int(p**0.5)+1)):
        q = p; k = 1
        while q <= X:
            pp.append((q, 1.0/k)); q *= p; k += 1   # Lambda(n)/log n = 1/k
def logP(s):
    tot = acb(0)
    for n, w in pp: tot += (acb(n)**(-s)) / int(round(1/w))
    return tot
def chi(s):
    return acb.pi()**(s - acb(0.5)) * (((acb(1) - s)/2).lgamma() - (s/2).lgamma()).exp()
def W_on(s_ball, zval):
    P = logP(s_ball).exp()
    G = P + chi(s_ball)*P.conjugate()      # conj of the ball encloses conj(P(s)) for s in the ball
    return zval/G
stats = {"segments": 0, "subballs": 0, "max_depth": 0, "max_abs_arg_mid": 0.0, "fail": []}
def decided(Wb):
    re, im = Wb.real, Wb.imag
    if re > 0: return True
    if im > 0 or im < 0: return True
    return False
def segment(sc_sig, sc_t, vertical):
    # centre (sc_sig, sc_t), half-length h along t (vertical) or sigma (horizontal)
    stats["segments"] += 1
    s0 = acb(arb(sc_sig), arb(sc_t))
    sb = acb(arb(sc_sig, 0 if vertical else h + 1e-6), arb(sc_t, h + 1e-6 if vertical else 0))   # encloses every inflated sub-ball
    c = acb_series([s0, 1], prec=K).zeta()
    cK = acb_series([sb, 1], prec=K+1).zeta()[K]
    def zeta_at(dm, dr):
        d = acb(arb(0, 0), arb(dm, dr)) if vertical else acb(arb(dm, dr), arb(0, 0))
        v = acb(0)
        for k in range(K-1, -1, -1): v = v*d + c[k]
        return v + cK*d**K
    stack = [(-h/2, h/2, 0), (h/2, h/2, 0)]
    while stack:
        dm, dr, depth = stack.pop()
        dr_cov = dr + 1e-8   # absolute overlap: float spacing of t near 1e6 is 1.2e-10
        s_ball = acb(arb(sc_sig), arb(sc_t) + arb(dm, dr_cov)) if vertical else acb(arb(sc_sig) + arb(dm, dr_cov), arb(sc_t))
        Wb = W_on(s_ball, zeta_at(dm, dr_cov))
        if Wb.is_finite() and decided(Wb):
            stats["subballs"] += 1; stats["max_depth"] = max(stats["max_depth"], depth)
            z = complex(float(Wb.real.mid()), float(Wb.imag.mid()))
            stats["max_abs_arg_mid"] = max(stats["max_abs_arg_mid"], abs(math.atan2(z.imag, z.real)))
        elif depth >= 14:
            stats["fail"].append([sc_sig, sc_t, dm, dr]); return False
        else:
            stack.append((dm - dr/2, dr/2, depth+1)); stack.append((dm + dr/2, dr/2, depth+1))
    return True
t0 = time.time(); ok = True
print("box sigma in [%.6f, 2], t in [%r, %r], X = %d (%d prime powers), K = %d, h = %g" % (sigma0, T1, T2, X, len(pp), K, h), flush=True)
nv = int(math.ceil((T2 - T1)/(2*h)))
for j in range(nv):                                   # left and right vertical edges
    tc = T1 + (2*j + 1)*h
    ok &= segment(sigma0, tc, True); ok &= segment(2.0, tc, True)
    if j % 200 == 0: print("vertical", j, nv, time.time()-t0, stats["subballs"], flush=True)
nh = int(math.ceil((2.0 - sigma0)/(2*h)))
for j in range(nh):                                   # bottom and top edges (covering slightly past sigma = 2)
    sc = sigma0 + (2*j + 1)*h
    ok &= segment(sc, T1, False); ok &= segment(sc, T1 + 2*h*nv, False)
stats.update({"certified": bool(ok), "sigma0": sigma0, "t1": T1, "t2": T1 + 2*h*nv, "X": X, "K": K, "h": h, "prec": ctx.prec, "seconds": time.time()-t0})
print(json.dumps(stats, indent=1))
json.dump(stats, open(os.path.join(OUT, "cert_X%d_d%s_%d_%d.json" % (X, sys.argv[4], int(T1), int(T2))), "w"), indent=1)
