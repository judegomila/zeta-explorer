import sys, time
from flint import arb, arb_mat, acb_mat, ctx
from screw import run, eigs_sym
kind = sys.argv[1]; Ns = [int(x) for x in sys.argv[2].split(',')]; Ts = [float(x) for x in sys.argv[3].split(',')]
atoms = tuple(int(x) for x in sys.argv[4].split(',') if x) if len(sys.argv) > 4 else ()
pf = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
for T in Ts:
    for N in Ns:
        t0 = time.time()
        r = run(kind, T, N, prec_digits=int(pf*(80+2.8*N)), atoms=tuple(a for a in atoms if a <= 2.718281828**T))
        ev = eigs_sym(r['Q'])
        line = '%s T=%.3f N=%d lam1=%.4e lam2=%.4e lam3=%.4e max=%.3f' % (kind, T, N, float(ev[0]), float(ev[1]), float(ev[2]), float(ev[-1]))
        for a in atoms:
            if 'P%d' % a in r:
                X = r['Q'].solve(2*r['P%d' % a])
                mu = sorted(float(e.real) for e in acb_mat(X).eig(algorithm='approx'))
                line += ' | n=%d eps+=%.3e eps-=%.3e' % (a, 1/mu[-1], -1/mu[0])
        print(line, '(%.0fs)' % (time.time()-t0), flush=True)
