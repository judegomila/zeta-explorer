"""s4 combination (2): shift difference against the logarithmic derivative.
X(w) = F(1/2 + w) completed. For a > 0 and Re w = x > 0:
   B_a(w) = (|X(w+a)|^2 - |X(w-a)|^2)/(|X(w+a)|^2 + |X(w-a)|^2) = tanh(log|X(w+a)| - log|X(w-a)|),
   statistic rho_a(w) = [B_a/(2a)] / Re(F'/F)(w)      (simple-zero model: B_a/(2a) = x/(x^2+a^2), Re F'/F = 1/x).
usage: c2_shift.py <out.npz> <code> <t0> <dt> <nt> [bits=96]
Output arrays (nt x nx): LD = Re F'/F, and for each a: Lr_a = log|X(w+a)| - log|X(w-a)| (float mid), plus the max ball radius.
"""
import sys, os, time, numpy as np
from multiprocessing import Pool
from flint import acb, arb, ctx
import lib
XG = [0.01, 0.02, 0.03, 0.05, 0.07, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5]
AG = [0.02, 0.1, 0.25]
EVEN = lambda code: not (code.startswith('LIOU') or code.startswith('WT'))

def work(args):
    code, t, bits = args
    ctx.prec = bits
    o = lib.get(code); ev = EVEN(code)
    cache = {}
    def la(u100):          # log|X(u + i t)|, u in hundredths
        k = abs(u100) if ev else u100
        if k not in cache:
            v = lib.val(o, acb(arb(k) / 100, arb(t)))
            cache[k] = abs(v).log()
        return cache[k]
    ld = []; lr = []; rad = 0.0
    for x in XG:
        x100 = int(round(100 * x))
        d = lib.logder(o, acb(arb(x100) / 100, arb(t))).real
        ld.append(float(d.mid())); rad = max(rad, float(d.rad()))
        row = []
        for a in AG:
            a100 = int(round(100 * a))
            v = la(x100 + a100) - la(x100 - a100)
            row.append(float(v.mid())); rad = max(rad, float(v.rad())) if v.is_finite() else float('inf')
        lr.append(row)
    return t, ld, lr, rad

def main():
    out, code, t0, dt, nt = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5])
    bits = int(sys.argv[6]) if len(sys.argv) > 6 else 96
    ts = [t0 + dt * j for j in range(nt)]
    T0 = time.time()
    with Pool(int(os.environ.get('RH_WORKERS', '4'))) as pool:
        res = pool.map(work, [(code, t, bits) for t in ts], chunksize=max(1, nt // 400))
    res.sort()
    LD = np.array([r[1] for r in res]); LR = np.array([r[2] for r in res]); rad = np.array([r[3] for r in res])
    np.savez_compressed(out, t=np.array(ts), x=np.array(XG), a=np.array(AG), LD=LD, LR=LR, rad=rad, code=code, bits=bits)
    B = np.tanh(LR) / (2 * np.array(AG))[None, None, :]
    with np.errstate(divide='ignore', invalid='ignore'):
        rho = B / LD[:, :, None]
    print(code, 't0', t0, 'dt', dt, 'nt', nt, 'bits', bits, 'sec', round(time.time() - T0, 1), 'max ball radius', rad.max(),
          '| neg LD', int((LD <= 0).sum()), '| per a: neg B', [(int((B[:, :, k] <= 0).sum())) for k in range(3)],
          'min B', [float(B[:, :, k].min()) for k in range(3)], 'min rho', [float(np.nanmin(rho[:, :, k])) for k in range(3)], flush=True)

if __name__ == '__main__':
    main()
