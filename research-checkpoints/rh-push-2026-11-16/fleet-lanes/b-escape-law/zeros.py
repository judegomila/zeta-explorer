"""Zeros of H_{-tau} in the box x in [x0, x0+W], depth eta in [e1, e2] (z = x - i eta; mirror zeros at +eta).
Direct method: H_{-tau}(z) = int H_0(t - i kappa) G_tau(z - t + i kappa) dt, H_0 = xi((1+iw)/2)/8 from Arb zeta
(python-flint), trapezoid step h on the line Im w = -kappa (kappa = saddle value for the box centre).
Zeros: winding number on grid cells, Newton refinement, total boundary winding as a count check.
Usage: zeros.py tau x0 W e1 e2 [h=0.1] [grid=0.02] [procs=8] [nverify=3]"""
import sys, math, json, time, numpy as np
from multiprocessing import Pool
from flint import acb, ctx
import esc
from esc import c128, log_gamma_factor, model_parts

def _sample(a):
    sigc, tj, XC, REF = a
    ctx.prec = 120
    s = acb(sigc, 0) + acb(0, 1)*(acb(XC) + acb(tj))/2
    v = (log_gamma_factor(s) - acb(REF)).exp()*s.zeta()     # xi/8 / e^REF, formed in Arb (Im log Gamma ~ 1e15 is not a double)
    return (float(v.real.mid()), float(v.imag.mid()))

def _verify(a):
    """independent: acb trapezoid on the horizontal line through z (no contour shift), step 0.1; returns |F|/|Tsharp|."""
    x, eta, tau, XC = a
    ctx.prec = 160
    h = 0.1; M = int(9*math.sqrt(2*tau)/h) + 5
    tot = acb(0); ref = None
    for j in range(-M, M+1):
        u = j*h
        s = acb((1+eta)/2, 0) + acb(0, 1)*(acb(XC) + acb(x) - acb(u))/2
        v = (log_gamma_factor(s) + s.zeta().log() - acb(u*u/(4*tau))).exp()
        tot += v
    tot = tot*h/math.sqrt(4*math.pi*tau)
    lT, se = model_parts(XC, eta, tau, x)
    r = tot/lT.exp()
    return (x, eta, float(abs(r).mid()))

if __name__ == '__main__':
    tau, x0, W, e1, e2 = [float(v) for v in sys.argv[1:6]]
    h = float(sys.argv[6]) if len(sys.argv) > 6 else 0.1
    gs = float(sys.argv[7]) if len(sys.argv) > 7 else 0.02
    procs = int(sys.argv[8]) if len(sys.argv) > 8 else 8
    nver = int(sys.argv[9]) if len(sys.argv) > 9 else 3
    t0 = time.time()
    L = math.log((x0+W/2)/(4*math.pi)); em = (e1+e2)/2
    kappa = em - tau*L/2; sigc = (1+kappa)/2
    pad = 8*math.sqrt(2*tau) + 1
    M = int(math.ceil((W/2+pad)/h)); xc = x0 + W/2
    tt = h*np.arange(-M, M+1)   # offsets from xc
    ctx.prec = 120
    ref = float(log_gamma_factor(acb(sigc, 0) + acb(0, 1)*acb(xc)/2).real.mid())
    with Pool(procs) as p:
        res = p.map(_sample, [(sigc, float(t), xc, ref) for t in tt], chunksize=1)
    res = np.array(res)
    xi = res[:, 0] + 1j*res[:, 1]
    tsamp = time.time()-t0
    w = tt - 1j*kappa
    def F(x, eta):
        z = np.asarray(x, float) - 1j*np.asarray(eta, float); d = z[..., None] - w
        return (xi*np.exp(-d*d/(4*tau))).sum(-1)*h/math.sqrt(4*math.pi*tau)
    def dF(x, eta):
        z = np.asarray(x, float) - 1j*np.asarray(eta, float); d = z[..., None] - w
        return (xi*(-d/(2*tau))*np.exp(-d*d/(4*tau))).sum(-1)*h/math.sqrt(4*math.pi*tau)
    xs = -W/2 + gs*np.arange(int(round(W/gs))+1)   # offsets from xc
    es = e1 + gs*np.arange(int(round((e2-e1)/gs))+1)
    V = np.empty((len(xs), len(es)), complex)
    for i0 in range(0, len(xs), 50):
        V[i0:i0+50] = F(xs[i0:i0+50, None], es[None, :])
    A = np.angle(V)
    def dd(a, b):
        d = b - a
        return (d + np.pi) % (2*np.pi) - np.pi
    # cell winding: corners (i,j)->(i+1,j)->(i+1,j+1)->(i,j+1)
    wn = (dd(A[:-1, :-1], A[1:, :-1]) + dd(A[1:, :-1], A[1:, 1:]) + dd(A[1:, 1:], A[:-1, 1:]) + dd(A[:-1, 1:], A[:-1, :-1]))/(2*np.pi)
    cells = np.argwhere(np.abs(wn) > 0.5)
    # boundary winding of the whole box
    bw = (dd(A[:-1, 0], A[1:, 0]).sum() + dd(A[-1, :-1], A[-1, 1:]).sum() + dd(A[1:, -1], A[:-1, -1]).sum() + dd(A[0, 1:], A[0, :-1]).sum())/(2*np.pi)
    maxstep = max(np.abs(dd(A[:-1, :], A[1:, :])).max(), np.abs(dd(A[:, :-1], A[:, 1:])).max())
    roots = []
    for (i, j) in cells:
        z = complex(xs[i]+gs/2, -(es[j]+gs/2))
        for _ in range(30):
            f = complex(F(z.real, -z.imag)); df = complex(dF(z.real, -z.imag))
            z = z - f/df
        f = complex(F(z.real, -z.imag))
        lT, se = model_parts(xc, -z.imag, tau, z.real)
        G = abs(f)/abs(c128((lT-ref).exp()))
        sef = c128(se)
        roots.append(dict(dx=z.real, x=xc+z.real, eta=-z.imag, absG=G, s_eff=[sef.real, sef.imag], cell_wn=float(wn[i, j])))
    roots.sort(key=lambda r: r['dx'])
    reach = tau*L/2
    area = W*max(0.0, min(e2, reach) - e1)
    out = dict(tau=tau, x0=x0, xc=xc, W=W, e1=e1, e2=e2, h=h, grid=gs, L=L, kappa=kappa, sigc=sigc, nsamples=len(tt), t_sample_s=tsamp,
               boundary_winding=float(bw), max_phase_step=float(maxstep), n_cells=len(cells), reach_tauL_over_2=reach,
               predicted_count_density_law=area/(4*math.pi*tau), roots=roots)
    if nver > 0 and roots:
        pick = sorted(roots, key=lambda r: -r['eta'])[:nver]
        with Pool(min(procs, nver)) as p:
            out['verify_independent_acb'] = p.map(_verify, [(r['dx'], r['eta'], tau, xc) for r in pick])
        # control: a non-root point shifted by 0.3 in x
        out['verify_control_nonroot'] = _verify((pick[0]['dx']+0.3, pick[0]['eta'], tau, xc))
    out['t_total_s'] = time.time()-t0
    name = 'zeros_tau%g_x%.3g.json' % (tau, x0)
    json.dump(out, open(name, 'w'), indent=1)
    print(json.dumps({k: v for k, v in out.items() if k != 'roots'}))
    for r in roots: print('  root x=xc%+.6f eta=%.6f |G|=%.2e sig_eff=%.4f' % (r['dx'], r['eta'], r['absG'], r['s_eff'][0]))
