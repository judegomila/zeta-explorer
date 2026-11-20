"""Zeta zeros in [Ta, Tb) (absolute float64), split over NP worker processes that share one GPU.
usage: gen_seg.py Ta Tb NP OUTDIR        (driver)      gen_seg.py worker Ta Tb OUT.npy"""
import sys, math, os, subprocess, numpy as np
BL = int(os.environ.get('RH_BLOCK', '200000'))
if sys.argv[1] == 'worker':
    import zl
    Ta = int(sys.argv[2]); Tb = int(sys.argv[3]); out = sys.argv[4]
    parts = []; hid = 0; ex_t = 0.0; worst = 0.0
    for a in range(Ta, Tb, BL):
        b = min(Tb, a + BL)
        g, nh, bad, ex = zl.zeta_block(a, b, 0.0, budget=float(os.environ.get('RH_BUDGET', '1e8')))
        parts.append(g); hid += nh; ex_t += ex; worst = max(worst, abs(len(g) - ex))
        if bad or abs(len(g) - ex) > 3: zl.log('block [%d,%d) zeros %d expected %.2f hidden %d orderviol %d' % (a, b, len(g), ex, nh, bad))
        if len(parts) % 20 == 0: zl.log('worker', Ta, 'at', b, 'zeros', sum(map(len, parts)), 'expected %.1f' % ex_t)
    g = np.concatenate(parts); np.save(out, g)
    zl.log('DONE [%d,%d) zeros %d expected %.2f diff %+.2f hidden %d worst block %.2f monotone %s gpu %s' % (Ta, Tb, len(g), ex_t, len(g) - ex_t, hid, worst, bool((np.diff(g) > 0).all()), zl.GPU))
else:
    Ta = int(float(sys.argv[1])); Tb = int(float(sys.argv[2])); NP = int(sys.argv[3]); od = sys.argv[4]
    os.makedirs(od, exist_ok=True)
    cuts = [Ta + (Tb - Ta) * i // NP for i in range(NP + 1)]
    cuts = [Ta] + [c // BL * BL for c in cuts[1:-1]] + [Tb]
    ps = [subprocess.Popen([sys.executable, __file__, 'worker', str(cuts[i]), str(cuts[i + 1]), os.path.join(od, 'seg_%02d.npy' % i)]) for i in range(NP)]
    print('exit codes', [p.wait() for p in ps], flush=True)
