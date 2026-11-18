# Supplementary: DH log-coefficient partial sums near its known off-line zeros, and the outlier height of the main run.
# Planned memory: 3 float64 arrays of 1e7 (240 MB) + 2 complex (320 MB).
import numpy as np, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
o = json.load(open('onesided_test.json'))
r = sorted(o['DH'], key=lambda x: -max(abs(x['sup']), abs(x['inf'])))[:6]
for x in r: print("outlier: t=%.6f sigma=%.2f log|f|=%.3f sup=%.2f (P=%.3g) inf=%.2f (P=%.3g) at=%s" % (x['t'], x['sigma'], x['log_abs_f'], x['sup'], x['P_sup'], x['inf'], x['P_inf'], x['at']))
N = 10**7
xi = (np.sqrt(10-2*np.sqrt(5.0))-2)/(np.sqrt(5.0)-1); per = np.array([0.0, 1.0, xi, -xi, -1.0])
n = np.arange(N+1); a = per[n % 5]; logn = np.zeros(N+1); logn[1:] = np.log(n[1:].astype(float))
acc = np.zeros(N+1)
for d in range(2, N//2+1):
    ld = a[d]*logn[d] - acc[d]
    if ld != 0.0: acc[2*d::d] += ld*a[2:N//d+1]
lam = a*logn - acc; bb = lam[2:]/logn[2:]; lnn = logn[2:]; del acc
print("sum |b(n)| n^-sigma over n<=1e7: " + ", ".join("%.2f: %.1f" % (s, float(np.sum(np.abs(bb)*np.exp(-s*lnn)))) for s in [0.6, 0.75, 0.9, 1.0, 1.2]))
print("mean |b(n)| over (N/2,N] for N=1e3..1e7: " + ", ".join("%.3f" % float(np.mean(np.abs(bb[int(10**k)//2-2:int(10**k)-1]))) for k in range(3, 8)))
res = []
ZER = [(0.8085171825, 85.6993484854), (0.6508300806, 114.1633427308)]
print("| zero | sigma | t - gamma | G(1e3) | G(1e4) | G(1e5) | G(1e6) | G(1e7) | sup_P | inf_P | pred amp at 1e7 |")
for (be, ga) in ZER:
    for sig in [0.6, 0.75]:
        for dt in [0.0, 0.25, -0.25, 3.0]:
            s = complex(sig, ga+dt)
            G = np.cumsum(bb*np.exp(-s*lnn)).real
            v = [float(G[int(P)-2]) for P in [1e3, 1e4, 1e5, 1e6, 1e7]]
            pa = N**(be-sig)/(abs(complex(sig-be, dt))*np.log(N)) if (be > sig or dt != 0) else float('nan')
            print("| %.4f+%.4fi | %.2f | %.2f | %s | %.3f | %.3f | %.3f |" % (be, ga, sig, dt, " | ".join("%.3f" % q for q in v), G[998:].max(), G[998:].min(), pa))
            res.append(dict(beta=be, gamma=ga, sigma=sig, dt=dt, at=v, sup=float(G[998:].max()), inf=float(G[998:].min()), pred=float(pa)))
json.dump(res, open('dh_near.json', 'w'))
