# (a) inputs of PR56 on the DH kernel: positivity, evenness, convexity of V(t) = -log k(sqrt t)
# (b) total-positivity minors (non-principal) of H_-(x_i,x_j) for xi, dh, cx  -- mpmath, non-interval.
import mpmath as mp, itertools, sys, json
mp.mp.dps = 50
kp = (mp.sqrt(10-2*mp.sqrt(5))-2)/(mp.sqrt(5)-1); a = [0, 1, kp, -kp, -1, 0]
def k_xi(u, signed=False):
    if not signed: u = abs(u)
    e = mp.exp(u)
    return mp.fsum(mp.pi*n*n*(2*mp.pi*n*n*e-3)*mp.exp(mp.mpf('1.25')*u-mp.pi*n*n*e) for n in range(1, 12))
def k_dh(u, signed=False):
    if not signed: u = abs(u)
    e = mp.exp(u)
    return mp.sqrt(mp.pi/5)*mp.fsum(a[n % 5]*n*mp.exp(mp.mpf('0.75')*u-mp.pi*n*n*e/5) for n in range(1, 60) if n % 5)
def k_cx(u, signed=False): return (1+u*u/10+u**4/300)*mp.exp(-u*u)
K = {'xi': k_xi, 'dh': k_dh, 'cx': k_cx}
out = {}
# (a)
for name in ['xi', 'dh']:
    k = K[name]
    ev = max(abs(k(-u, True)-k(u, True))/k(u, True) for u in [mp.mpf(j)/4 for j in range(1, 9)])   # FE evenness (signed series, many terms needed for u<0)
    mn = min(k(mp.mpf(j)/50) for j in range(0, 400))
    g = lambda u: mp.log(k(u))
    worst = None
    for j in range(1, 300):
        u = mp.mpf(j)/50
        c = mp.diff(g, u, 1) - u*mp.diff(g, u, 2)      # >0  <=> V''(t)>0
        rel = c/(abs(mp.diff(g, u, 1))+u*abs(mp.diff(g, u, 2)))
        if worst is None or rel < worst[0]: worst = (rel, u)
    print(name, 'evenness defect (u<=2)', mp.nstr(ev, 5), 'min kappa on [0,8]', mp.nstr(mn, 5),
          'min normalised convexity indicator', mp.nstr(worst[0], 8), 'at u', mp.nstr(worst[1], 5), flush=True)
    out[name+'_inputs'] = {'even_defect': mp.nstr(ev, 5), 'convexity_min': mp.nstr(worst[0], 10), 'at': mp.nstr(worst[1], 5)}
# (b)
def H0(k, u, v):
    m = (u+v)/2; d = (u-v)/2; lo = abs(m)
    return 2*mp.quad(lambda t: t*k(t-d)*k(t+d), mp.linspace(lo, lo+10, 21))
nodes = [mp.mpf(j)/4 for j in range(1, 11)]   # 0.25..2.5
for name in ['xi', 'dh', 'cx']:
    k = K[name]; n = len(nodes)
    H = mp.matrix(n, n)
    for i in range(n):
        for j in range(i, n):
            H[i, j] = H[j, i] = H0(k, nodes[i], nodes[j]) - H0(k, nodes[i], -nodes[j])
    res = {}
    for r in [1, 2, 3, 4, 5]:
        neg = 0; tot = 0; worst = None; negprincipal = 0
        combos = list(itertools.combinations(range(n), r))
        for R in combos:
            for C in combos:
                if C < R: continue
                d = mp.det(mp.matrix([[H[i, j] for j in C] for i in R])) if r > 1 else H[R[0], C[0]]
                scale = mp.mpf(1)
                for q in range(r): scale *= mp.sqrt(H[R[q], R[q]]*H[C[q], C[q]])
                tot += 1; v = d/scale
                if d <= 0:
                    neg += 1
                    if R == C: negprincipal += 1
                if worst is None or v < worst[0]: worst = (v, R, C)
        res[r] = {'minors': tot, 'nonpositive': neg, 'nonpositive_principal': negprincipal, 'min_normalised': mp.nstr(worst[0], 8), 'at': [worst[1], worst[2]]}
        print(name, 'order', r, res[r], flush=True)
    out[name+'_tp'] = res
json.dump(out, open('tp.json', 'w'), indent=1)
