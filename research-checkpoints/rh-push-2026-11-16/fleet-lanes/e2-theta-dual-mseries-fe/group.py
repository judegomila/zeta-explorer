"""group.py -- exact (integer/Fraction) model of the reflections with the m-reflection K6m added.

Centred low coordinates P = (T, S, V): exponents of q_A, q_s, q_m minus their centres (n1-tube-hull section 2.2).
Maps act on column vectors; a 'functional' is a row vector.
  K6   : S -> -S, V -> V + S                     (sextic Kubota series in s at index m)
  Th3  : T -> -T, V -> V + 2T                    (MS Prop. 5.1, dual length q_m^2 / X)
  Pm   : V -> -V, T -> T + V, S -> S + V         (Poisson in m)
  K6m  : V -> -V, S -> S + V, T -> T + 3V        (Lemma 1: sextic Kubota series in m at index 4^5 s mu^3), in the
         coordinates of the theta-dual chart D = Th3(P).  As a map of P: g = Th3 K6m Th3.
x - 1/2 = X = T + V,  w - 1/2 = S + V,  z - 1/2 = -V.
"""
from fractions import Fraction as Fr
from itertools import product
def mat(rows): return tuple(tuple(Fr(x) for x in r) for r in rows)
def mm(A, B): return tuple(tuple(sum(A[i][k] * B[k][j] for k in range(3)) for j in range(3)) for i in range(3))
def rowm(f, A): return tuple(sum(f[k] * A[k][j] for k in range(3)) for j in range(3))
def app(A, v): return tuple(sum(A[i][k] * v[k] for k in range(3)) for i in range(3))
I = mat([[1,0,0],[0,1,0],[0,0,1]])
K6 = mat([[1,0,0],[0,-1,0],[0,1,1]])
TH = mat([[-1,0,0],[0,1,0],[2,0,1]])
PM = mat([[1,0,1],[0,1,1],[0,0,-1]])
K6M = mat([[1,0,3],[0,1,1],[0,0,-1]])
G = mm(TH, mm(K6M, TH))
AW = mm(PM, mm(K6, PM))
X = (Fr(1), Fr(0), Fr(1))
def order(A, cap=60):
    B = A
    for k in range(1, cap + 1):
        if B == I: return k
        B = mm(B, A)
    return None
print("g = Th3 K6m Th3 =", [[str(x) for x in r] for r in G], " g^2 = I:", mm(G, G) == I)
print("X o g =", [str(x) for x in rowm(X, G)], " (X + 2T + V: x' = x + (2t + v - 1/2) = 3x + z - 3/2 in high coordinates)")
print("orders: K6m*K6 (dual chart):", order(mm(K6M, K6)), "  Th3*K6m:", order(mm(TH, K6M)), "  K6*Th3:", order(mm(K6, TH)),
      "  g*K6:", order(mm(G, K6)), "  g*AW:", order(mm(G, AW)), "  g*Pm:", order(mm(G, PM)))
tr = mm(TH, K6M); print("trace of Th3*K6m =", sum(tr[i][i] for i in range(3)), "(a rank-2 block with trace 4 > 2: hyperbolic, infinite order)")
def closure(gens, cap):
    seen = {I: ''}; frontier = [I]
    while frontier and len(seen) < cap:
        nxt = []
        for A in frontier:
            for nm, B in gens.items():
                C = mm(B, A)
                if C not in seen:
                    seen[C] = nm + seen[A]; nxt.append(C)
        frontier = nxt
    return seen, not frontier
W0, ok0 = closure({'K': K6, 'T': TH, 'P': PM}, 5000); print("order <K6, Th3, Pm> =", len(W0), "closed" if ok0 else "cap")
print("K6m in <K6, Th3, Pm>:", K6M in W0, "   g in <K6, Th3, Pm>:", G in W0)
W1, ok1 = closure({'K': K6, 'T': TH, 'P': PM, 'M': K6M}, 20000); print("order <K6, Th3, Pm, K6m> :", len(W1), "closed" if ok1 else "(cap reached: infinite or large)")
# ---- pieces: apex + rays (in P coordinates)
h = Fr(1, 2)
def piece_low(): return ((h, h, h), [(1,0,0),(0,1,0),(0,0,1)])
def piece_high(theta):   # x > theta, w > 1, z > 1 :  V = 1/2 - z, T = x - 1/2 - V, S = w - 1/2 - V
    def pt(x, w, z):
        V = h - z; return (x - h - V, w - h - V, V)
    a = pt(theta, Fr(1), Fr(1))
    rays = [tuple(p - q for p, q in zip(pt(theta + 1, 1, 1), a)), tuple(p - q for p, q in zip(pt(theta, 2, 1), a)), tuple(p - q for p, q in zip(pt(theta, 1, 2), a))]
    return (a, rays)
def image(A, pc): return (app(A, pc[0]), [app(A, r) for r in pc[1]])
def inf_fun(f, pc):
    if any(sum(a * b for a, b in zip(f, r)) < 0 for r in pc[1]): return None
    return sum(a * b for a, b in zip(f, pc[0]))
# true self-symmetries in the model: K6, AW = Pm K6 Pm (numerator reflection), g.   Base pieces: low, high(theta), Th3(low), g Th3(low).
def scan(theta, maxlen):
    gens = {'K': K6, 'A': AW, 'g': G}
    base = {'low': piece_low(), 'high': piece_high(theta), 'dual': image(TH, piece_low()), 'dual2': image(mm(TH, K6M), piece_low())}
    # words by breadth-first closure on matrices up to length maxlen
    seen = {I: ''}; frontier = [I]; L = 0
    while L < maxlen:
        nxt = []
        for A in frontier:
            for nm, B in gens.items():
                C = mm(B, A)
                if C not in seen: seen[C] = nm + seen[A]; nxt.append(C)
        frontier = nxt; L += 1
    best = None; unb = []
    stats = {}
    for A, wd in seen.items():
        for bn, pc in base.items():
            v = inf_fun(X, image(A, pc))
            if v is None: unb.append((wd, bn)); continue
            xv = v + h
            if bn not in stats or xv < stats[bn][0]: stats[bn] = (xv, wd)
    return len(seen), stats, unb
for theta in (Fr(1), Fr(7, 8), Fr(874886647, 10**9), Fr(1, 2)):
    for ml in (6, 9):
        n, stats, unb = scan(theta, ml)
        print(f"theta = {theta} ({float(theta):.6f}), words up to length {ml} in <K6, AW, g>: {n} elements; inf x over images: " +
              ', '.join(f"{k}: {str(v[0])} [{v[1] or 'e'}]" for k, v in stats.items()) + f"; images with x unbounded below: {len(unb)}" + (f" e.g. {unb[:4]}" if unb else ''))
# orbit of X under <K6, AW, g>
seen = {X: ''}; fr = [X]
for L in range(7):
    nx = []
    for f in fr:
        for nm, B in {'K': K6, 'A': AW, 'g': G}.items():
            f2 = rowm(f, B)
            if f2 not in seen: seen[f2] = seen[f] + nm; nx.append(f2)
    fr = nx
neg = [(f, w) for f, w in seen.items() if any(c < 0 for c in f)]
print(f"orbit of the functional X under <K6, AW, g>, words up to 7: {len(seen)} functionals; with a negative coefficient in (T,S,V): {len(neg)}")
for f, w in sorted(seen.items(), key=lambda t: (len(t[1]), t[1]))[:14]: print("   ", w or 'e', [str(c) for c in f])
if neg: print("   negative examples:", [(w, [str(c) for c in f]) for f, w in neg[:6]])
