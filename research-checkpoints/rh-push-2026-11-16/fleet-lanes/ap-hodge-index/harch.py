# Archimedean term by the trapezoidal rule on the Fourier side (arb arithmetic):
#   A_z(d; v) = (1/2pi) int h(t) Re psi(z + i t/2) dt,   h(t) = amp*sqrt(2 pi v) e^{-v t^2/2} e^{i t d}
#             = amp*sqrt(2 pi v) * sum_k W_k cos(t_k d),  t_k = k*dt.
# Trapezoid error ~ exp(-2 z (2 pi/dt - d)) (nearest poles of psi(z+it/2) at t = +-2 i z); dt chosen for 10^-(dps+10).
import mpmath as mp
from flint import arb, acb, ctx

def weights(z, v, dmax, dps):
    ctx.prec = int((dps+30)*3.3220)+32
    zf = float(z); vf = float(v)
    D = (dps+10)*2.302585
    dt = 2*3.141592653589793/(float(dmax) + D/(2*zf) + 2)
    tmax = (2*D/vf)**0.5 + 1
    K = int(tmax/dt)+1
    dt_a = arb(mp.nstr(mp.mpf(dt), 25))        # exact decimal of a double; any dt works
    za = arb(mp.nstr(z, dps+20)); va = arb(mp.nstr(v, dps+20))
    pi = arb.pi()
    ts = []; W = []
    for k in range(K+1):
        t = dt_a*k
        w = (-(va*t*t)/2).exp()*acb(za, t/2).digamma().real*dt_a/pi
        if k == 0: w = w/2
        ts.append(t); W.append(w)
    return ts, W

def table_uniform(z, v, h, n, dps):
    """A_z(j*h; v)/ (amp*sqrt(2 pi v)) for j = 0..n-1, as mp numbers."""
    ts, W = weights(z, v, h*(n-1), dps)
    ha = arb(mp.nstr(h, dps+20))
    acc = [arb(0)]*n
    for t, w in zip(ts, W):
        c1 = (t*ha).cos(); two = 2*c1
        cm, c = arb(1), c1
        acc[0] = acc[0] + w
        if n > 1: acc[1] = acc[1] + w*c
        for j in range(2, n):
            cm, c = c, two*c - cm
            acc[j] = acc[j] + w*c
    return [mp.mpf(a.mid().str(dps+15, radius=False)) for a in acc]

def table_points(z, v, ds, dps):
    ts, W = weights(z, v, max(ds), dps)
    out = []
    for d in ds:
        da = arb(mp.nstr(d, dps+20)); a = arb(0)
        for t, w in zip(ts, W): a = a + w*(t*da).cos()
        out.append(mp.mpf(a.mid().str(dps+15, radius=False)))
    return out
