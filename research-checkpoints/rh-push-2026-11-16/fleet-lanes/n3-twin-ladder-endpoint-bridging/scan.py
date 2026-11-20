"""Line scan: sign changes of H(w,t)=F(w,w/2+it) for t in (0,TMAX], for a list of w. Output JSON lines."""
import sys, json, time
from zf import *
from flint import acb, arb, ctx
def scan(Z, w, tmax=216.0, dt=0.04):
    Z.setw(w); ww = Z._w
    n = int(round(tmax/dt))
    h = arb(dt)
    step = [(acb(0,1)*h*l).exp() for l in Z.ell]
    p = [(ww/2*l).exp()*a for l,a in zip(Z.ell, Z.A)]   # A_j e^{(w/2) l_j}
    ip = Z.iphi; N = Z.N
    vals = []
    for k in range(1, n+1):
        tot = acb(0)
        for j in range(N):
            pj = p[j]*step[j]; p[j] = pj; tot += pj
        t = h*k; s = acb(ww/2, t)
        cs = (s*ip).exp()
        if ww.is_zero(): pol = (cs*(1/(s*s) - ip/s)).real   # G: pol + conj-part handled below
        else: pol = -2*(cs/s).real/ww
        if ww.is_zero():
            # second term is conj of first only when s2 = -s -> conj; F(0,s) on line s=it: tot + conj(tot) + pol_full(real part*?) 
            v = 2*tot.real + 2*pol   # cs*(1/s^2 - ip/s) + conj = 2 Re
        else:
            v = 2*tot.real + pol
        vals.append(float(v*(arb.pi()*t/4).exp()))
    zs = []
    for k in range(1, n):
        a, b = vals[k-1], vals[k]
        if a == 0.0 or a*b < 0:
            zs.append(round(dt*(k + a/(a-b)), 5))
    return zs, vals
if __name__ == "__main__":
    w0, w1, dw, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
    Z = ZF()
    k = 0
    with open(out, "a") as f:
        while w0 + k*dw <= w1 + 1e-12:
            w = round(w0 + k*dw, 6); t0 = time.time()
            zs, vals = scan(Z, w)
            f.write(json.dumps({"w": w, "n": len(zs), "zeros": zs, "vals_sample": vals[::20]})+"\n"); f.flush()
            print(w, len(zs), round(time.time()-t0,1), flush=True); k += 1
