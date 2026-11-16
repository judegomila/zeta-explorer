"""Even Taylor data of kappa at 0 <-> even moments m_j = int t^{2j} xi(1/2+it) dt (up to positive constants):
kappa^{(2j)}(0) = (-1)^j * const * m_j / 4^j.  Hankel determinants of (m_j) decide the local PF order of kappa at u=0."""
from flint import arb, arb_series, arb_mat, ctx
ctx.prec = 600; ctx.cap = 14
PI = arb.pi()
x = arb_series([0, 1])
e = x.exp()
s = arb_series([0])
for k in range(1, 12):
    s += PI*k*k*(2*PI*k*k*e-3)*(arb('1.25')*x).exp()*(-(PI*k*k)*e).exp()
fact = [arb(1)]
for i in range(1, 14): fact.append(fact[-1]*i)
d = [s[i]*fact[i] for i in range(13)]   # kappa^{(i)}(0)
print('odd derivatives ~0:', [d[i].mid().str(5) for i in (1, 3, 5)])
m = [((-1)**j)*d[2*j] for j in range(7)]   # proportional to 4^-j m_j
print('signs of m_j:', ['+' if v > 0 else '-' for v in m])
for k in range(1, 5):
    A = arb_mat([[m[a+b] for b in range(k)] for a in range(k)]).det()
    B = arb_mat([[m[a+b+1] for b in range(k)] for a in range(k)]).det() if 2*k <= 6 else None
    print('k=%d  det[m_{a+b}] = %s   det[m_{a+b+1}] = %s' % (k, A.mid().str(8), B.mid().str(8) if B is not None else 'n/a'))
for k in range(2, 8):
    D = arb_mat([[d[a+b] for b in range(k)] for a in range(k)]).det()
    sg = (-1)**(k*(k-1)//2)
    print('order %d: (-1)^{k(k-1)/2} det[kappa^{(i+j)}(0)] = %s  -> local PF_%d at 0: %s' % (k, (sg*D).mid().str(8), k, 'yes' if sg*D > 0 else 'NO'))
