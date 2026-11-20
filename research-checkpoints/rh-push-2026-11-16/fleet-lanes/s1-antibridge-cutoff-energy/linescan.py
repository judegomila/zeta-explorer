"""s1-antibridge-cutoff-energy: exact line scan (python-flint, multiprocessing) of an even completed function F(z), z = s - 1/2.
For t on a grid: L0i = Im (F'/F)(it), R2 = (F''/F)(it) (real), logabs = log|F(it)|, sgn = sign F(it), theta(t) (gamma-factor
phase, where defined), and (F'/F)(h + it) for h in HS.  Output npz (float64 views of balls; radii are not stored; 128 bits for
the closed forms, a height-dependent precision for HEAT).
Usage: linescan.py OBJ T0 T1 dt out.npz"""
import sys, os, math, time
import numpy as np
from flint import acb, arb, ctx
import multiprocessing as mp
import flib
HS = [0.01, 0.05, 0.125]
_H = {}

def theta(obj, t):
    """phase of the gamma factor on the line (continuous branch): F(it) = e^{lambda} e^{i theta} L(1/2+it)"""
    s = acb(0.5, t)
    if obj in ('ZETA', 'TNR'):
        return float(((s / 2).lgamma() - s / 2 * arb.pi().log()).imag)
    q = {'CHI4': 4, 'DH': 5}[obj]
    return float((((s + 1) / 2).lgamma() + (s + 1) / 2 * (arb(q) / arb.pi()).log()).imag)

def heat_obj(t):
    band = int(t // 100)
    if band not in _H:
        tb = (band + 1) * 100.0
        digits = int(50 + 0.3412 * tb + 0.02 * tb)
        bits = int((digits + 15) / 0.30103) + 8
        ctx.prec = bits
        eta = 1.0 / math.ceil((math.pi * tb / 2 + digits * 2.31 + 20) / math.pi ** 2 + 1)     # exp(-pi^2/eta + pi t/2) < 10^-digits
        _H.clear(); _H[band] = (flib.HeatObj('-0.5', arb(1) / int(round(1 / eta)), digits), bits)
    o, bits = _H[band]; ctx.prec = bits
    return o

def work(args):
    obj, ts = args
    out = np.zeros((len(ts), 5 + 2 * len(HS)))
    for i, t in enumerate(ts):
        if obj == 'HEAT': o = heat_obj(t)
        else: o = flib.OBJ[obj]; ctx.prec = 128
        c = o.taylor(acb(0, t), 3)
        f = c[0].real
        L = c[1] / c[0]; R2 = 2 * c[2] / c[0]
        out[i, 0] = float(L.imag); out[i, 1] = float(R2.real)
        out[i, 2] = float(abs(f).log()); out[i, 3] = 1.0 if f > 0 else -1.0
        out[i, 4] = theta(obj, t) if obj in ('ZETA', 'TNR', 'CHI4', 'DH') and t > 0 else 0.0
        for k, h in enumerate(HS):
            c = o.taylor(acb(h, t), 2); L = c[1] / c[0]
            out[i, 5 + 2 * k] = float(L.real); out[i, 6 + 2 * k] = float(L.imag)
    return out

if __name__ == '__main__':
    obj = sys.argv[1]; T0 = float(sys.argv[2]); T1 = float(sys.argv[3]); dt = float(sys.argv[4]); outp = sys.argv[5]
    W = int(os.environ.get('RH_WORKERS', '4'))
    M = int(round((T1 - T0) / dt)) + 1
    t = T0 + dt * np.arange(M)
    print('linescan %s [%g, %g] dt %g points %d workers %d; planned memory: %.2f GB output array' % (obj, T0, T1, dt, M, W, M * 12 * 8 / 1e9), flush=True)
    ch = 200 if obj != 'HEAT' else 50
    tasks = [(obj, t[i:i + ch].tolist()) for i in range(0, M, ch)]
    t0 = time.time(); res = []
    with mp.Pool(W) as pool:
        for i, r in enumerate(pool.imap(work, tasks, chunksize=1)):
            res.append(r)
            if i % max(1, len(tasks) // 20) == 0: print('  chunk %d/%d t %.1f elapsed %.0f s' % (i, len(tasks), tasks[i][1][0], time.time() - t0), flush=True)
    A = np.concatenate(res)
    np.savez(outp, t=t, L0i=A[:, 0], R2=A[:, 1], logabs=A[:, 2], sgn=A[:, 3], theta=A[:, 4], Lh_re=A[:, 5::2], Lh_im=A[:, 6::2], HS=np.array(HS), obj=obj, dt=dt)
    print('done %s %.0f s' % (obj, time.time() - t0), flush=True)
