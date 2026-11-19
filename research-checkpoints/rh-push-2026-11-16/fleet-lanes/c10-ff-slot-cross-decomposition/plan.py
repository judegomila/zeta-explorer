"""plan.py : configurations and weights of the pre-registered runs (imported by predict.py, genjobs9.py, analyze.py)."""
def irr(q, k):
    out = []
    for idx in range(q**k):
        c = [(idx // q**a) % q for a in range(k)] + [1]
        if all(sum(c[i]*pow(x, i, q) for i in range(k+1)) % q for x in range(q)):
            if k <= 3: out.append(idx)
            else:
                # degree 4: no roots and not a product of two irreducible quadratics
                ok = True
                for j in range(q*q):
                    b = [j % q, j // q, 1]; a = c[:]
                    for i in range(4, 1, -1):
                        f = a[i]
                        for t in range(3): a[i-2+t] = (a[i-2+t] - f*b[t]) % q
                    if a[0] == 0 and a[1] == 0: ok = False; break
                if ok: out.append(idx)
    return out
def weights(q):
    """name -> (mode, p1, p2, p3).  one: trivial target (pure Moebius vector after unfolding); a, b, c4: quadratic characters of prime conductor
    (the Moebius probe vectors with a Weil target); mu: Liouville-twisted control (unfolded vector identically 1); al: aligned vector; r1: random phases."""
    I3 = irr(q, 3); a = 2 if 2 in I3 else I3[0]
    W = {'one': (0, 0, 0, 0), 'a': (0, 3, a, 3)}
    if q == 7: W['b'] = (0, 3, 8, 3)
    else: W['c4'] = (0, 4, irr(q, 4)[0], 3)
    W.update({'mu': (4, 0, 0, 0), 'al': (5, 0, 0, 0), 'r1': (1, 11, 0, 0)})
    return W
PROBE = {7: ['one', 'a', 'b'], 13: ['one', 'a', 'c4']}
# families: name -> (q, N, d, [lam...]).  All satisfy lam > N, lam > d, the window N - lam < d < N + lam, and rmax = N + lam - 1 - d + floor(d/2) > 3N.
FAM = {
 'A7':  (7, 2, 2, [7, 8, 9, 10, 11, 12, 13]),
 'B7':  (7, 2, 1, [7, 8, 9, 10, 11, 12, 13]),
 'C7':  (7, 2, 3, [8, 9, 10, 11]),
 'D7':  (7, 3, 2, [9, 10, 11, 12]),      # completion non-trivial: needs the companion runs (N = 0)
 'E7':  (7, 3, 1, [9, 10, 11, 12]),
 'A13': (13, 2, 2, [7, 8, 9]),
 'B13': (13, 2, 1, [7, 8, 9, 10]),
 'C13': (13, 2, 3, [8]),
 'E13': (13, 3, 1, [9]),
}
def rmax(N, lam, d): return N + lam - 1 - d + d//2
for f, (q, N, d, lams) in FAM.items():
    for lam in lams: assert lam > N and lam > d and N - lam < d < N + lam and rmax(N, lam, d) > 3*N, (f, lam)
