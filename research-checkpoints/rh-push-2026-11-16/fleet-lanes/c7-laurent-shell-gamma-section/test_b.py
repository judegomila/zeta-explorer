# Test B (gamma-coupled Laurent sections).  Poles: solutions of U(t) = X_F(1/2+it) m(p^{-it}) = 1, t0 < t < tmax,
# X_F = gamma ratio of the functional equation (zeta: chi; DH conductor 5: 5^{1/2-s} X_c), m unimodular on the torus T^P.
# nu = sum_j r_j delta_{gamma_j}, r_j = 2/|d arg U/dt| (boundary measure of (1+U)/(1-U) where that is positive-real).
# Prediction (Lemma 2):  S/S1 -> 1 + conj( int_{T^P} F_P m dHaar ),  S = sum r_j F(1/2+i gamma_j) e^{-delta gamma_j}.
#   m = -conj(F_P)/|F_P| : 1 - ||F_P||_1 < 0;   m = -conj(F_P)/F_P (reflected stage) : 0;   m = 1 (Gram type) : 2.
# Twists: mean of F q^{+i gamma} -> f_q q^{-1/2} (q prime outside P).
# Pole location is float64 (not certified); F at the located points is evaluated in ball arithmetic.  Status: MEASURED.
import sys, json, time, math, os
import numpy as np
from scipy.special import loggamma
from multiprocessing import Pool
func = sys.argv[1]; P = json.loads(sys.argv[2]); t0 = float(sys.argv[3]); deltas = json.loads(sys.argv[4]); mlist = sys.argv[5].split(','); outf = sys.argv[6]
q_tw = int(sys.argv[7]) if len(sys.argv) > 7 else 5
tmax = t0 + 30.0/min(deltas); W = int(os.environ.get('RH_WORKERS', '1'))
kap = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1); c1, c2 = (1 - 1j*kap)/2, (1 + 1j*kap)/2
CHI = {1: 1, 2: 1j, 3: -1j, 4: -1, 0: 0}
def FP_w(w):                                  # w: list of arrays, one per prime
    def E(tw):
        r = 1
        for i, p in enumerate(P): r = r/(1 - p**-0.5*w[i]*tw[i])
        return r
    if func == 'zeta': return E([1]*len(P))
    ch = [CHI[p % 5] for p in P]; return c1*E(ch) + c2*E([np.conj(x) for x in ch])
def mfun(name, F):
    if name == 'neg': return -np.conj(F)/np.abs(F)
    if name == 'rot': return np.exp(1j)*(-np.conj(F)/np.abs(F))
    if name == 'refl': return -np.conj(F)/F
    if name == 'one': return np.ones_like(F)
def phaseX(t):
    b = t*math.log(2*math.pi) + loggamma(0.5 - 1j*t).imag
    return b + math.pi/4 if func == 'zeta' else b - t*math.log(5) - math.pi/4
def U(name, t):
    F = FP_w([np.exp(-1j*t*math.log(p)) for p in P]); return np.exp(1j*phaseX(t))*mfun(name, F)
def dphase(name, t, e=1e-4): return np.angle(U(name, t + e)*np.conj(U(name, t - e)))/(2*e)
def poles(name):
    h = 0.004; n = 1000000; g = []; rr = []; bad = 0; a = t0
    while a < tmax:
        t = a + h*np.arange(n + 1); t = t[t <= tmax + h]; u = U(name, t)
        s0, s1 = u.imag[:-1], u.imag[1:]
        idx = np.where((s0*s1 < 0) & (u.real[:-1] > 0) & (u.real[1:] > 0))[0]
        x = t[idx] + h*s0[idx]/(s0[idx] - s1[idx])
        for _ in range(4): x = x - np.angle(U(name, x))/dphase(name, x)
        d = dphase(name, x); bad += int((d > 0).sum()); g.append(x); rr.append(2/np.abs(d)); a = t[-1]
    return np.concatenate(g), np.concatenate(rr), bad
def ev(args):
    from flint import acb, ctx, dirichlet_char
    ctx.prec = 64; out = []
    if func == 'dh':
        CH = dirichlet_char(5, 2); CHB = dirichlet_char(5, 3); C1 = acb(0.5, -kap/2); C2 = acb(0.5, kap/2)
    for x in args:
        sv = acb(0.5, float(x))
        v = sv.zeta() if func == 'zeta' else C1*CH.l(sv) + C2*CHB.l(sv)
        out.append(complex(float(v.real.mid()), float(v.imag.mid())))
    return out
if __name__ == '__main__':
    T0 = time.time(); n = 400 if len(P) <= 2 else 120
    print('func', func, 'P', P, 't0', t0, 'tmax', tmax, 'workers', W, 'planned: grid chunks of 1e6 complex128 (~0.1 GB), torus grid %d^%d' % (n, len(P))); sys.stdout.flush()
    th = 2*np.pi*np.arange(n)/n; G = np.meshgrid(*([th]*len(P)), indexing='ij'); Ft = FP_w([np.exp(1j*g) for g in G])
    res = {'func': func, 'P': P, 't0': t0, 'tmax': tmax, 'min_abs_FP_on_grid': float(np.abs(Ft).min()), 'L1_FP': float(np.abs(Ft).mean()), 'cases': {}}
    fq = 1.0 if func == 'zeta' else complex(c1*CHI[q_tw % 5] + c2*np.conj(CHI[q_tw % 5]))
    pool = Pool(W) if W > 1 else None
    for name in mlist:
        pred = 1 + np.conj((Ft*mfun(name, Ft)).mean()); g, r, bad = poles(name)
        print(name, 'poles', len(g), 'wrong-orientation crossings', bad, 'pred', pred, 'sec', round(time.time() - T0)); sys.stdout.flush()
        parts = [g[i:i + 500] for i in range(0, len(g), 500)]
        vals = np.array(sum((pool.map(ev, parts) if pool else list(map(ev, parts))), []))
        rows = []
        for d in deltas:
            w = r*np.exp(-d*(g - t0)); S1 = w.sum(); m = (w*vals).sum()/S1
            tp = (w*vals*np.exp(1j*g*math.log(q_tw))).sum()/S1; tm = (w*vals*np.exp(-1j*g*math.log(q_tw))).sum()/S1
            neff = S1**2/(w*w).sum()
            row = {'delta': d, 'S/S1': [m.real, m.imag], 'pred': [pred.real, pred.imag], 'twist q^{+i gamma}': [tp.real, tp.imag],
                   'pred twist+ f_q q^-1/2': [(fq*q_tw**-0.5).real if func == 'dh' else q_tw**-0.5, (fq*q_tw**-0.5).imag if func == 'dh' else 0.0],
                   'twist q^{-i gamma}': [tm.real, tm.imag], 'pred twist- f_q q^-1/2 (pred-1) [zeta, or chi(q)=1]': [((pred - 1)*q_tw**-0.5).real, ((pred - 1)*q_tw**-0.5).imag], 'q': q_tw, 'mean |F|^2': float((w*np.abs(vals)**2).sum()/S1),
                   'noise scale sqrt(mean|F|^2/neff)': float(math.sqrt((w*np.abs(vals)**2).sum()/S1/neff)), 'pi*delta*S1': float(math.pi*d*S1)}
            rows.append(row); print(name, json.dumps(row)); sys.stdout.flush()
        res['cases'][name] = {'poles': int(len(g)), 'wrong_orientation': bad, 'rows': rows}
        json.dump(res, open(outf, 'w'), indent=1)
    print('seconds', time.time() - T0)
