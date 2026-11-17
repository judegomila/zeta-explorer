"""Zeros of zeta on the critical line in a window just above the Platt-Trudgian height 3.000175e12.
Riemann-Siegel main sum + C0 term, float64 with phases t0*log n reduced mod 2pi in mpmath.
MEASURED (float): sign changes of Z on a 0.01 grid, refined by Illinois iteration. Not a Turing-certified count."""
import numpy as np, mpmath as mp, json, sys, time
mp.mp.dps = 45
M = 691010
t0 = 2*mp.pi*(mp.mpf(M)+mp.mpf('0.5'))**2          # sqrt(t0/2pi) = M + 0.5
W = float(sys.argv[1]) if len(sys.argv) > 1 else 130.0
H = 0.01
tic = time.time()
twopi = 2*mp.pi
a = np.empty(M); 
for n in range(1, M+1):
    a[n-1] = float(mp.fmod(t0*mp.log(n), twopi))
logn = np.log(np.arange(1, M+1)); amp = 1/np.sqrt(np.arange(1, M+1))
th0 = float(mp.fmod(mp.siegeltheta(t0), twopi))
t0f = float(t0)
th1 = float(mp.log(t0/twopi)/2 - 1/(48*t0**2)); th2 = 1/(2*t0f); th3 = -1/(2*t0f**2)
print('setup', time.time()-tic, 't0', mp.nstr(t0, 20), 'theta1', th1, flush=True)
def Z(tau):
    tau = np.atleast_1d(np.asarray(tau, float)); out = np.empty(len(tau))
    for i in range(0, len(tau), 40):
        tt = tau[i:i+40, None]
        th = th0 + tt*th1 + tt**2*th2/2 + tt**3*th3/6
        s = 2*(np.cos(th - a[None, :] - tt*logn[None, :]) @ amp)
        x = np.sqrt((t0f + tau[i:i+40])/(2*np.pi)); p = x - np.floor(x); assert np.all(np.floor(x) == M)
        c0 = np.cos(2*np.pi*(p*p - p - 1/16))/np.cos(2*np.pi*p)
        out[i:i+40] = s + (-1)**(M-1)*x**-0.5*c0
    return out
if __name__ == '__main__':
    grid = np.arange(-W, W+H/2, H); z = Z(grid)
    print('grid done', time.time()-tic, flush=True)
    idx = np.where(z[:-1]*z[1:] < 0)[0]
    lo, hi = grid[idx].copy(), grid[idx+1].copy(); flo, fhi = z[idx].copy(), z[idx+1].copy()
    for it in range(14):                                  # Illinois regula falsi, vectorised
        x = hi - fhi*(hi-lo)/(fhi-flo); fx = Z(x)
        same = fx*fhi > 0
        # if same sign as hi: hi <- x, halve flo ; else lo <- hi, hi <- x
        lo2 = np.where(same, lo, hi); flo2 = np.where(same, flo/2, fhi)
        lo, flo, hi, fhi = lo2, flo2, x, fx
    zeros = np.sort(hi); res = np.abs(fhi).max()
    exp = 2*W*th1/np.pi
    print('zeros', len(zeros), 'expected', exp, 'max|Z| at zeros', res, 'min gap', np.diff(zeros).min(), time.time()-tic)
    json.dump(dict(M=M, t0=mp.nstr(t0, 30), W=W, theta1=th1, zeros_tau=zeros.tolist(), grid_h=H,
                   maxres=float(res), expected=float(exp), Zgrid_absmin_same_sign=None), open('zeros_3e12.json', 'w'))
    np.save('zgrid.npy', np.vstack([grid, z]))
