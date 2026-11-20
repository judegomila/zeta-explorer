import table11 as T
from flint import arb, acb, ctx
ctx.prec = T.P_45
c = T.ctrl('zeta'); lY = T.YF.log(); s = acb(arb(1)/2, 20); cc = T.SIGR - s.real
T1p = arb('-31.6875') - 20; T2p = arb('31.6875') - 20
lam = c.lam(4096)
worst = []
for n_, v in lam.items():
    ln = arb(n_).log(); ns = (-s*ln).exp(); u = T.Un(lY - ln, cc, T1p, T2p, lY); t = v*ns*u
    worst.append((float(t.rad()), n_, float(abs(t).mid()), float(u.rad()), float(abs(u).mid())))
worst.sort(reverse=True)
for w in worst[:4]: print(w)
import time
for nm in ('DH','NR','EA','UT','TW'):
    t0=time.time(); cc_=T.ctrl(nm); L=cc_.lam(4096); print(nm, len(L), [ (k, str(L[k])[:50]) for k in sorted(L)[:6]], float(cc_.lamtail(4096, arb(24)).upper()), time.time()-t0)
