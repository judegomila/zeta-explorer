import json, sys
a = json.load(open(sys.argv[1])); b = json.load(open(sys.argv[2]))
c = lambda v: [complex(x, y) for x, y in v]
def R(o, name, i=3):
    return c(o['twists'][name]['S'])[i] / c(o['twists']['1']['S'])[i]
G = {k: complex(v[0], v[1]) for k, v in b['gauss'].items()}; Q = {k: v[2] for k, v in b['gauss'].items()}
print("| index (m1, m2) | exponents mod 3 | abs R, X = 1e5 | abs R, X = 2e5 | R at X = 2e5 | R q^(1/6)/conj gamma(p), 1e5 -> 2e5 |")
print("|---|---|---|---|---|---|")
kap = []; van = []
for name in b['twists']:
    ra, rb = R(a, name), R(b, name)
    cls = "-"; k = ""
    if '*' not in name and name != '1':
        pn, l = name.split('^'); l = eval(l); cls = "(%d,%d)" % (l[0] % 3, l[1] % 3)
        if l[0] % 3 == 1 and l[1] % 3 == 1:
            ka = ra / (G[pn].conjugate() * Q[pn] ** (-1 / 6)); kb = rb / (G[pn].conjugate() * Q[pn] ** (-1 / 6))
            k = "%.4f%+.4fi -> %.4f%+.4fi" % (ka.real, ka.imag, kb.real, kb.imag)
            if l == (1, 1): kap.append(kb.real)
    if abs(rb) < 0.1: van.append(abs(rb))
    print("| %s | %s | %.5f | %.5f | %+.5f%+.5fi | %s |" % (name.replace(', ', ','), cls, abs(ra), abs(rb), rb.real, rb.imag, k))
S1 = c(b['twists']['1']['S']); import math
print()
print("X = 2e5: n =", b['n'], "primes", b['npr'], "seconds", round(b['seconds']), "rec_bad", b['rec_bad'])
print("local exponents of S(X;1,1):", ["%.4f" % (math.log(abs(S1[i + 1] / S1[i])) / math.log(2)) for i in range(3)])
print("kappa(p,p) at 2e5:", ["%.4f" % x for x in kap], " max vanishing-class |R| at 2e5: %.5f" % max(van))
