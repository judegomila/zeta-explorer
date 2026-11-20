# Trace split of the theta cutoff operator between the two parity sectors (xi, alpha=1 scale; ratios are scale free).
# tr H_pm = (alpha/pi) [ 2 int_0^inf f'^2 dt  -/+  (1/2) int_0^inf (f(0)^2 - f(t)^2)/t^2 dt ],  f(t)=xi(1/2+it)
import mpmath as mp, json
mp.mp.dps = 25
def xi(s): return s*(s-1)/2*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)
f = lambda t: mp.re(xi(mp.mpc(0.5, t)))
f0 = f(0)
fp = lambda t: mp.diff(f, t, h=mp.mpf('1e-8'))
pts = [0, 2, 5, 10, 14, 18, 22, 26, 30, 35, 40, 50, 60]
I1 = mp.quad(lambda t: fp(t)**2, pts, method='gauss-legendre')
I2 = mp.quad(lambda t: (f0**2 - f(t)**2)/t**2 if t > 0 else -f0*mp.diff(f, 0, 2), pts, method='gauss-legendre') + f0**2/60
trm = 2*I1 + I2/2; trp = 2*I1 - I2/2
out = {'f(0)': mp.nstr(f0, 15), 'int f\'^2': mp.nstr(I1, 15), 'int (f0^2-f^2)/t^2': mp.nstr(I2, 15),
       'trH_minus*pi/alpha': mp.nstr(trm, 15), 'trH_plus*pi/alpha': mp.nstr(trp, 15),
       'odd share of trace': mp.nstr(trm/(trm+trp), 12)}
print(json.dumps(out, indent=1)); json.dump(out, open('trace_split.json', 'w'), indent=1)
