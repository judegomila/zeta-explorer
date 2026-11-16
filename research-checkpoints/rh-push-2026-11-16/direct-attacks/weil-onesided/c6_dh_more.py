# DH: (a) smallest order M with a negative ideal test V = W(z)(z+a)^-M (W kills on-line zeros below H0);
# (b) (B1) split on that test; (c) heat trace Theta_DH(t) relative to its first-zero term.
import mpmath as mp, json, math, cmath, os
mp.mp.dps = 30
d_ = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "dh_zeros_200.json")))
on = [mp.mpf(g) for g in d_["on"]]; off = [mp.mpc(mp.mpf(r), mp.mpf(i)) for r, i in d_["off"]]
half = mp.mpf(1)/2
for a, H0 in [(2, 200), (20, 200), (60, 200)]:
    a = mp.mpf(a); kill = [g for g in on if g < H0]; d = 2*len(kill)
    W = lambda z: mp.fprod([z*z + g*g for g in kill])
    quart = []
    for r_ in off:
        w = r_ - half; w2 = -mp.conj(w)
        quart.append((complex(mp.log(W(w))), complex(mp.log(w+a)), complex(mp.log(W(w2))), complex(mp.log(w2+a))))
    first = None
    for M in range(d+2, d+6000):
        ref = (quart[0][0] - M*quart[0][1]).real + (quart[0][2] - M*quart[0][3]).real
        neg = []
        for q in quart:
            e = (q[0] - M*q[1]) + (q[2] - M*q[3]).conjugate()
            neg.append(4*math.exp(min(e.real - ref, 700))*math.cos(e.imag))
        r = sum(neg)
        if r < -1e-6:
            # tail check: zeros above 200, envelope with |b| <= 1.5
            V = lambda z: W(z)*(z+a)**(-M)
            nrm = abs(V(off[0]-half))*abs(V(-mp.conj(off[0]-half)))
            env = lambda g: max(abs(V(mp.mpc(bb, g)))**2 for bb in (-1.5, 0, 1.5))
            tail = mp.quad(lambda g: 4*env(g)*mp.log(5*g/(2*mp.pi))/(2*mp.pi), [200, 250, 400, 1000, 10**4, mp.inf])/nrm
            if tail < abs(r)/10:
                w = off[0]-half
                sq = 2*(abs(V(w))**2 + abs(V(-mp.conj(w)))**2)/nrm
                df = 2*abs(V(w) - V(-mp.conj(w)))**2/nrm
                print("a=%s H0=%d deg W=%d: smallest M with negative sum and tail<|sum|/10: M=%d, sum/|VV| = %.6f, quartets %s, tail %s" % (a, H0, d, M, r, ["%.3g" % t for t in neg], mp.nstr(tail, 3)))
                print("    (B1) on the first quartet, normalized: sum|V|^2 = %s , (1/2) sum|V(rho)-V(-conj rho)|^2 = %s , difference = %s" % (mp.nstr(sq, 8), mp.nstr(df, 8), mp.nstr(sq-df, 8)))
                break
# (c) heat trace
g1 = on[0]
def theta_ratio(t):
    pos = sum(2*mp.exp(-(g*g - g1*g1)*t) for g in on)
    neg = sum(4*mp.re(mp.exp(((r-half)**2 + g1*g1)*t)) for r in off)
    return pos, neg
print("Theta_DH(t) / e^{-g1^2 t}: on-line part, off-line quartet part (zeros to 200)")
for t in ['1e-4', '3e-4', '1e-3', '3e-3', '0.01', '0.03', '0.1', '1']:
    p, n = theta_ratio(mp.mpf(t)); print("  t=%s  %s  %s" % (t, mp.nstr(p, 8), mp.nstr(n, 5)))
