"""Q = E[g D] and its per-neighbour profile for an unfolded block x (unit mean density). Flat (1/w) kernel, J neighbours + continuum tail.
p_0 = 2 (mutual term), p_m = E[g (d_m^+ + d_m^-)], d_m^+ = 1/(x_{k+1}-x_{k+1+m}) - 1/(x_k-x_{k+1+m}), d_m^- = 1/(x_{k+1}-x_{k-m}) - 1/(x_k-x_{k-m}).
Q = 2 + sum_m p_m + tail."""
import numpy as np, sys, math, json
LAM = 1.57314
def bmean(v, block=2000):
    m = len(v) // block
    M = v[:m * block].reshape(m, block).mean(1)
    return float(v.mean()), float(M.std(ddof=1) / math.sqrt(m))
def stats(x, L, J=200, MP=40):
    n = len(x); k = np.arange(J, n - 1 - J)
    a = x[k + 1]; b = x[k]; g = a - b
    D = 2.0 / g; prof = []
    for m in range(1, J + 1):
        xr = x[k + 1 + m]; xl = x[k - m]
        d = 1 / (a - xr) - 1 / (b - xr) + 1 / (a - xl) - 1 / (b - xl)
        D += d
        if m <= MP: prof.append(bmean(g * d))
    B = x[k + 1 + J] + 0.5; A = x[k - J] - 0.5
    tail = np.log((B - a) / (B - b)) + np.log((b - A) / (a - A))
    D += tail
    q = g * D
    Q, Qe = bmean(q); V, Ve = bmean((g - g.mean()) ** 2)
    g1 = x[k + 2] - x[k + 1]; g2 = x[k + 3] - x[k + 2]
    inv = 12 * LAM / L ** 2
    out = dict(n=len(g), L=L, inv=inv, meang=float(g.mean()), V=V, Verr=Ve, Q=Q, Qerr=Qe, c=(Q + 1) / inv, cerr=Qe / inv,
               C1=bmean((g - 1) * (g1 - 1)), C2=bmean((g - 1) * (g2 - 1)), g3=bmean(g ** 3), ratio=bmean(g / g1 + g1 / g),
               P02=float((g < 0.2).mean()), tail=bmean(g * tail), prof=prof)
    return out
if __name__ == '__main__':
    for f in sys.argv[1:]:
        d = np.load(f); x = d['x']; T0 = float(d['T0']); x = x / np.mean(np.diff(x))
        Tm = T0 + float(np.median(d['delta'])); L = math.log(Tm / (2 * math.pi))
        s = stats(x, L); s['T'] = Tm; s['file'] = f; s['nz'] = int(d['n']); s['expect'] = float(d['expect']); s['hidden'] = int(d['hidden']); s['tau'] = float(d['tau']) if 'tau' in d else 0.0
        print(json.dumps(s), flush=True)
