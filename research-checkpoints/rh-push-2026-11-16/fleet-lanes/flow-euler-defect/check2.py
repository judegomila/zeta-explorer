# Convergence of the twisted-Dirichlet series for t<0 (RESULT.md Prop. 1).
import sys; sys.argv=[sys.argv[0]]
exec(open(__file__.replace('check2.py','check.py')).read().split('print("evenness')[0])
mp.dps = 20
for t, Ns in ((mpf(-1), (10, 40, 150)), (mpf('-0.3'), (60, 400, 2000))):
    for z in (mpf(2), mpc(5, 0.7), mpf(14)):
        a = H_direct(t, z)
        for N in Ns:
            b = H_series(t, z, N)
            print("t=%s z=%s N=%d relerr=%s" % (t, mp.nstr(z,3), N, mp.nstr(abs(a-b)/abs(a), 3)), flush=True)
