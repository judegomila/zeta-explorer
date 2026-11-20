# MEASURED (float64, grid): log-concavity of kappa_q(u) = kappa(u - log q) + kappa(u + log q), the kernel of F_DH E_q.
import math, json, os
k0 = (math.sqrt(10 - 2*math.sqrt(5)) - 2)/(math.sqrt(5) - 1); A = [0, 1, k0, -k0, -1]
def lk(u):   # log kappa, even
    u = abs(u); x = math.exp(u)
    s = sum(A[n % 5]*n*math.exp(-math.pi*(n*n - 1)*x/5) for n in range(1, 40) if n % 5)
    return 0.75*u - math.pi*x/5 + math.log(s)
def lkq(u, Q):
    shifts = [0.0]
    for q in Q: shifts = [s + e*math.log(q) for s in shifts for e in (1, -1)]
    vals = [lk(u - s) for s in shifts]; m = max(vals)
    return m + math.log(sum(math.exp(v - m) for v in vals))
out = {}
h = 1e-3
for Q in [(2,), (3,), (4,), (6,), (2, 3), (2, 3, 4, 9), (2, 2), (2, 2, 2, 2), (2,)*8, (2,)*12]:
    worst = -1e9; where = None
    for i in range(0, 2401):
        u = i*0.005
        d2 = (lkq(u + h, Q) - 2*lkq(u, Q) + lkq(u - h, Q))/h**2
        if d2 > worst: worst, where = d2, u
    out[str(Q)] = {'max_second_difference_of_log_kernel_on_[0,12]': worst, 'at_u': where, 'log_concave_on_grid': worst < 0}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'part3_kernel_shift.json'), 'w'), indent=1)
for k, v in out.items(): print(k, v)
