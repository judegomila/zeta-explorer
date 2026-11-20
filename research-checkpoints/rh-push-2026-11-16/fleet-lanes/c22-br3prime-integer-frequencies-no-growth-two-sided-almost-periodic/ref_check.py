# Referee-pass check of Proposition ART (finite brute force): virtual characters psi = sum n_j chi_j, |n_j| <= 4,
# with psi(g^k) = psi(g)^k for all k >= 1 and |psi(g)| <= 1 at every g, on small groups. Expected: 0 and single linear characters only.
import itertools, cmath, json
def cyc(n):
    w = cmath.exp(2j*cmath.pi/n)
    els = list(range(n)); mul = lambda g, k: (g*k) % n
    chars = [[w**(j*g) for g in els] for j in range(n)]
    return els, mul, chars, [n]*n
def prod2(n1, n2):
    w1, w2 = cmath.exp(2j*cmath.pi/n1), cmath.exp(2j*cmath.pi/n2)
    els = [(a, b) for a in range(n1) for b in range(n2)]
    mul = lambda g, k: ((g[0]*k) % n1, (g[1]*k) % n2)
    chars = [[w1**(i*g[0])*w2**(j*g[1]) for g in els] for i in range(n1) for j in range(n2)]
    return els, mul, chars, None
def s3():
    els = ['e', 't', 'c']            # classes: identity, transposition, 3-cycle
    def mul(g, k):
        if g == 'e': return 'e'
        if g == 't': return 'e' if k % 2 == 0 else 't'
        return 'e' if k % 3 == 0 else 'c'
    chars = [[1, 1, 1], [1, -1, 1], [2, 0, -1]]
    return els, mul, chars, None
out = {}
for name, (els, mul, chars, _) in {'C4': cyc(4), 'C6': cyc(6), 'C2xC2': prod2(2, 2), 'C2xC4': prod2(2, 4), 'S3': s3()}.items():
    idx = {g: i for i, g in enumerate(els)}
    sols = []
    B = 4 if len(chars) <= 6 else 2
    for nv in itertools.product(range(-B, B + 1), repeat=len(chars)):
        psi = [sum(n*c[i] for n, c in zip(nv, chars)) for i in range(len(els))]
        ok = True
        for g in els:
            a = psi[idx[g]]
            if abs(a) > 1 + 1e-9: ok = False; break
            for k in range(2, 13):
                if abs(psi[idx[mul(g, k)]] - a**k) > 1e-9: ok = False; break
            if not ok: break
        if ok: sols.append(nv)
    out[name] = {'box': B, 'n_chars': len(chars), 'solutions': sols}
json.dump(out, open('ref_check.json', 'w'), indent=1)
for k, v in out.items(): print(k, v)
