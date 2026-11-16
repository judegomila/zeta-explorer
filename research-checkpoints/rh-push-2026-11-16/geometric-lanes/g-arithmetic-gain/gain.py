# Independent check of the PR 39 arithmetic-gain quantities, zeta and Davenport-Heilbronn.
import sys, json, numpy as np, mpmath as mp
mp.mp.dps = 20
SQ5 = mp.sqrt(5); TAU = (mp.sqrt(10-2*SQ5)-2)/(SQ5-1)
def dh(s):
    return mp.power(5,-s)*(mp.hurwitz(s,mp.mpf(1)/5)+TAU*mp.hurwitz(s,mp.mpf(2)/5)-TAU*mp.hurwitz(s,mp.mpf(3)/5)-mp.hurwitz(s,mp.mpf(4)/5))
def sample(F, c, T, h):
    u = np.arange(-T, T+h/2, h)
    vals = np.array([complex(F(mp.mpc(0.5, c+float(x)))) for x in u])
    return u, vals
def K(d,u): return 16*d**5/(np.pi*(d*d+u*u)**3)
def ell(F, d, c):
    # closed form of int K_d(t-c) v(1/2+it) dt = 6v - 6d v' + 2d^2 v'' at s0=1/2+d+ic
    s0 = mp.mpc(0.5+d, c)
    return complex(6*F(s0) - 6*d*mp.diff(F, s0, 1) + 2*d*d*mp.diff(F, s0, 2))
def eN(u, vals, d, c, N, pole):
    t = c+u; w = np.sqrt(K(d,u)*(u[1]-u[0]))
    ns = range(2,N+1) if pole else range(1,N+1)
    cols = []
    for n in ns:
        Dn = n**-0.5*np.exp(-1j*t*np.log(n)) - ((1.0/n) if pole else 0.0)
        cols.append(w*vals*Dn)
    A = np.array(cols).T; b = w.astype(complex)
    x, *_ = np.linalg.lstsq(A, b, rcond=1e-13)
    r = b - A@x
    return float(np.vdot(r,r).real), x
if __name__ == "__main__":
    which = sys.argv[1]; d = float(sys.argv[2]); c = float(sys.argv[3]); Nmax = int(sys.argv[4])
    T = float(sys.argv[5]) if len(sys.argv)>5 else 60.0
    F = mp.zeta if which=="zeta" else dh
    u, vals = sample(F, c, T, 1/64)
    mass = float(np.sum(K(d,u))*(u[1]-u[0]))
    out = {"fn":which,"d":d,"c":c,"mass":mass,"e":{}}
    for N in ([2,3,4,6,8,12,16,24,32,48] if which=="zeta" else [1,2,3,4,6,8,12,16,24,32,48]):
        if N>Nmax: break
        e, x = eN(u, vals, d, c, N, which=="zeta")
        out["e"][N] = e
        print(which, d, c, "N=",N, "e_N=%.6f"%e, "coefmax=%.3g"%np.abs(x).max(), flush=True)
    json.dump(out, open("out_%s_%g_%g.json"%(which,d,c),"w"))
