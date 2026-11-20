# Count DH zeros to the right of sigma0 by rectangle winding numbers (double precision, MEASURED).
import numpy as np, sys, math, time
kap = (math.sqrt(10-2*math.sqrt(5))-2)/(math.sqrt(5)-1)
# real coefficients a_n = Re chi(n) + kap*Im chi(n), chi(2)=i: residues 1..4 -> 1, kap, -kap, -1
C = np.array([1.0, kap, -kap, -1.0])
B = [1/6, -1/30, 1/42, -1/30, 5/66, -691/2730, 7/6]
def f_vec(s, M):
    """s: complex array. f(s)=5^{-s} sum_a c_a zeta(s,a/5), Hurwitz by Euler-Maclaurin with M terms."""
    s = np.asarray(s, dtype=complex)
    out = np.zeros(s.shape, dtype=complex)
    k = np.arange(M)
    for a_i, c in zip((1,2,3,4), C):
        a = a_i/5.0
        lg = np.log(k + a)
        acc = np.zeros(s.shape, dtype=complex)
        for i0 in range(0, s.size, 256):
            ss = s.flat[i0:i0+256]
            acc.flat[i0:i0+256] = np.exp(-np.outer(ss, lg)).sum(axis=1)
        N = M + a
        NL = np.exp(-s*math.log(N))
        acc += NL*N/(s-1) + NL/2
        term = s*NL/N
        fact = 2.0
        for j, b in enumerate(B):
            acc += b/fact*term
            # next: multiply by (s+2j+1)(s+2j+2)/N^2, factorial (2j+4)!/(2j+2)!
            term = term*(s+2*j+1)*(s+2*j+2)/N**2
            fact *= (2*j+3)*(2*j+4)
        out += c*acc
    return out*np.exp(-s*math.log(5.0))
def winding(vals):
    d = np.angle(vals[1:]/vals[:-1])
    return d.sum()/(2*math.pi), np.abs(d).max()
if __name__ == "__main__":
    T0, T1, H, dt = float(sys.argv[1]), float(sys.argv[2]), 10.0, 0.04
    sig = [float(x) for x in sys.argv[3].split(",")]
    sr = 3.0
    t = T0
    # test
    print("check f(0.808517+85.699348i)=", f_vec(np.array([0.808517+85.699348j]), 400)[0], flush=True)
    start=time.time()
    while t < T1:
        M = int(1.2*(t+H)) + 50
        res = []
        for s0 in sig:
            d, nh = dt, 200
            while True:
                tt = np.arange(0, H+d/2, d) + t
                right = f_vec(sr + 1j*tt, M)
                left = f_vec(s0 + 1j*tt, M)
                xs = np.linspace(s0, sr, nh)
                bot = f_vec(xs + 1j*t, M); top = f_vec(xs + 1j*(t+H), M)
                path = np.concatenate([bot, right, top[::-1], left[::-1]])
                w, mx = winding(path)
                if mx < 1.0 or d < 0.0007: break
                d /= 4; nh *= 4
            res.append((s0, round(w), round(float(mx),3)))
        if any(r[1] != 0 or r[2] > 1.0 for r in res):
            print("t=[%g,%g]"%(t,t+H), res, flush=True)
        t += H
    print("done", T0, T1, "sec", time.time()-start)
