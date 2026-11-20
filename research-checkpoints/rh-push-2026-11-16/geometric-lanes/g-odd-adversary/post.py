import json, numpy as np, math
b = json.load(open('nys_xi_220_0_170.json')); a = json.load(open('nys_xi_90_0_70.json'))
ev = [float(x) for x in b['eig'][:80]]
print('n, lambda_n (N=220,T=170), ratio lambda_n/lambda_{n-1}, rel diff vs (90,70)')
for i in range(60):
    e2 = float(a['eig'][i])
    print(i+1, '%.10e' % ev[i], '%.3e' % (ev[i]/ev[i-1] if i else 1), '%.1e' % (abs(e2-ev[i])/ev[i]))
# zeros gamma_n: compare log lambda_n with -pi*gamma_n/2
import mpmath as mp
g = [float(mp.zetazero(n).imag) for n in range(1, 41)]
print('n, gamma_n, log10 lambda_n, log10 lambda_n + (pi gamma_n/2)/ln10')
for i in range(40): print(i+1, round(g[i], 3), round(math.log10(ev[i]), 3), round(math.log10(ev[i])+math.pi*g[i]/2/math.log(10), 3))
# x-space sign changes of eigenfunctions via sine transform
N = b['N']; t = np.array(b['nodes']); gx, gw = np.polynomial.legendre.leggauss(N); w = gw*170/2
x = np.linspace(1e-3, 12, 6000)
S = np.sin(np.outer(x, t)/2)
for r, v in enumerate(b['topvecs']):
    ax = S @ (w*np.array(v)); mx = np.abs(ax).max()
    for thr in (1e-3, 1e-6):
        s = ax[np.abs(ax) > thr*mx]
        print('eigfn', r+1, 'thr', thr, 'x-space sign changes', int(np.sum(s[:-1]*s[1:] < 0)), 'x extent (|a|>thr*max):', round(float(x[np.abs(ax) > thr*mx].max()), 2), 'argmax', round(float(x[np.argmax(np.abs(ax))]), 3))
