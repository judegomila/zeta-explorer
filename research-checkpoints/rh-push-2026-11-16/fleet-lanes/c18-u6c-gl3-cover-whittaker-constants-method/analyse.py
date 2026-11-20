import json, sys, math, cmath
o = json.load(open(sys.argv[1])); Xs = o['Xs']; tw = o['twists']
c = lambda v: [complex(a, b) for a, b in v]
S1 = c(tw['1']['S'])
print("X values", Xs)
print("S(X;1,1):", ["%.5e" % z.real for z in S1], " local exponents:", ["%.4f" % (math.log(abs(S1[i+1]/S1[i]))/math.log(2)) for i in range(3)])
G = {k: complex(v[0], v[1]) for k, v in o['gauss'].items()}; Q = {k: v[2] for k, v in o['gauss'].items()}
print("%-24s %-44s %s" % ("twist", "|R| at X/8, X/4, X/2, X", "R(X)"))
for name, d in tw.items():
    S = c(d['S']); R = [S[i] / S1[i] for i in range(4)]
    extra = ""
    for pn in ('P7b', 'P7', 'P13', 'P19', 'I5'):
        if name.startswith(pn + '^') and '*' not in name:
            l = eval(name[len(pn) + 1:])
            if (l[0] - l[1]) % 3 == 0 and l[0] % 3 == 1:
                kap = [R[i] / (G[pn].conjugate() * Q[pn] ** (-1 / 6)) for i in range(4)]
                extra = "  R q^(1/6)/conj(gam) = " + ", ".join("%.4f%+.4fi" % (k.real, k.imag) for k in kap)
            break
    print("%-24s %-44s %+.5f%+.5fi%s" % (name, " ".join("%.5f" % abs(r) for r in R), R[3].real, R[3].imag, extra))
# multiplicativity on the diagonal
om = cmath.exp(2j * math.pi / 3)
R = lambda n: c(tw[n]['S'])[3] / S1[3]
a, b, ab = R("P7^(1, 1)"), R("P13^(1, 1)"), R("P7^(1,1)*P13^(1,1)")
print("diag multiplicativity: R(P7 P13)/(R(P7) R(P13)) =", ab / (a * b), " w^k candidates:", [om ** k for k in range(3)], " esym(P7,P13) =", o['esym']['P7,P13'])
a, b, ab = R("P7^(1, 1)"), R("P7b^(1,1)"), R("P7^(1,1)*P7b^(1,1)")
print("diag multiplicativity: R(P7 P7b)/(R(P7) R(P7b)) =", ab / (a * b), " esym(P7,P7b) =", o['esym']['P7,P7b'])
g = o['gl2']; g1 = c(g['1'])
print("GL(2) calibration S1(X;1):", ["%.4e" % z.real for z in g1], "exponents", ["%.4f" % (math.log(abs(g1[i+1]/g1[i]))/math.log(2)) for i in range(3)])
for k, v in g.items():
    if k == '1': continue
    v = c(v); pn, l = k.split('^'); r = [v[i] / g1[i] for i in range(4)]
    s = "%-8s |R2| = %s" % (k, " ".join("%.5f" % abs(x) for x in r))
    if l == '1':
        kap = [x / (G[pn].conjugate() * Q[pn] ** (-1 / 6)) for x in r]
        s += "   R2 q^(1/6)/conj(gam) = " + ", ".join("%.4f%+.4fi" % (x.real, x.imag) for x in kap)
    print(s)
print("checks: reciprocity mismatches", o['rec_bad'], " twisted-mult dev", o['tm_dev'], " gauss recheck", o['gauss_recheck'], " seconds", o['seconds'])
