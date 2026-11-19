"""Weight table of the Gauss-sum cocycle on Z/r at a prime p = 1 mod r (uniform normalisation ghat(a) = g(chi^a)/sqrt p,
ghat(0) = -1/sqrt p). chat(a,b) = ghat(a) ghat(b)/ghat(a+b). Prints log_p |chat| and, where the weight is 0, whether
-chat*sqrt(p) is the Jacobi sum J(chi^a,chi^b) (an algebraic integer of norm p)."""
import mpmath as mp
mp.mp.dps = 30
def primroot(p):
    for g in range(2, p):
        if all(pow(g, (p-1)//f, p) != 1 for f in range(2, p) if (p-1) % f == 0 and all(f % d for d in range(2, f))): return g
for r in (2, 3, 4, 6):
    for p in [pp for pp in range(5, 200) if pp % r == 1 and all(pp % d for d in range(2, pp))][:3]:
        g0 = primroot(p); ind = {pow(g0, k, p): k for k in range(p-1)}
        z = mp.exp(2j*mp.pi/r)
        def chi(a, x): return z**(a*ind[x % p]) if x % p else 0
        gs = [sum(chi(a, x)*mp.exp(2j*mp.pi*x/p) for x in range(1, p)) for a in range(r)]
        gh = [v/mp.sqrt(p) for v in gs]
        rows = []
        for a in range(r):
            for b in range(a, r):
                c = gh[a]*gh[b]/gh[(a+b) % r]
                w = mp.log(abs(c))/mp.log(p)
                J = sum(chi(a, x)*chi(b, 1-x) for x in range(2, p)) if a and b else None
                tag = ''
                if a and b and (a+b) % r:
                    tag = ' J-type: |c*sqrt p - J| = %s' % mp.nstr(abs(c*mp.sqrt(p) - J), 3)
                rows.append(f'({a},{b}): w={mp.nstr(w, 4)}{tag}')
        print(f'r={r} p={p}: ' + '; '.join(rows))
