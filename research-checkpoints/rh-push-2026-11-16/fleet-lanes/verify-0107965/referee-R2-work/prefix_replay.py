# Own replay of the 4N prefix inequalities (20) and guards (19). python-flint arb, 192 bits.
# Not the author's code: phases reduced as (X/2 + pi t_j/8) * log n - const_j, prefix kept as ball.
import sys, json, time
from flint import arb, acb, ctx
ctx.prec = 192
X = 6000000185827; N = 690988
x = arb(X); pi = arb.pi()
L = (x/(4*pi)).log()
out = {}
out['guard_sqrt_ge_N'] = bool((x/(4*pi)).sqrt() >= N)
out['guard_sqrt_plus_lt_N1'] = bool((x/(4*pi) + arb(41)/250/16).sqrt() < N+1)
out['guard_logN_lt_L2'] = bool(arb(N).log() < L/2)
out['sqrt_X_4pi'] = (x/(4*pi)).sqrt().str(20)
out['L'] = L.str(20)
# theta0 from log M0 formula (different route from the author's factorised product)
s = acb(arb(1)/2, x/2)
logM0 = s.log() + (s-1).log() - (s/2)*pi.log() + ((2*pi).sqrt()/16).log() + (s/2 - arb(1)/2)*(s/2).log() - s/2
im2 = 2*logM0.imag          # arg M0(s)/conj M0(s) mod 2pi
k = (im2/(2*pi)).mid().floor() if hasattr(im2.mid(),'floor') else None
two_pi = 2*pi
q = (im2/two_pi)
qf = arb(int(q.mid().floor().fmpz()) if hasattr(q.mid().floor(),'fmpz') else int(float(q.mid().floor().str(40,radius=False))))
theta = im2 - two_pi*qf
if theta > pi: theta = theta - two_pi
out['theta0'] = theta.str(25)
out['theta0_in_branch'] = bool(theta > arb(-11)/10) and bool(theta < -1)
tj = [arb(41*(2*j+1))/2000 for j in range(4)]
r = arb(41)/2000
freq = [x/2 + pi*tj[j]/8 for j in range(4)]
const = [theta/2 + pi*tj[j]*L/16 for j in range(4)]
sums = [arb(0)]*4; lip = arb(0)
floor_ = arb(79)/100
minlow = [None]*4; minn = [0]*4; fails = 0; undecided = 0
t0 = time.time()
for n in range(1, N+1):
    an = arb(n); v = an.log(); w = 1/an.sqrt()
    lip += pi*(L-2*v)/16*w
    for j in range(4):
        sums[j] = sums[j] + w*(freq[j]*v - const[j]).cos()
        low = sums[j] - r*lip
        if low > floor_:
            pass
        elif low < floor_ or low == floor_:
            fails += 1
        else:
            undecided += 1
        m = float(low.lower().str(20, radius=False)) if False else None
        lo = low.lower()
        if minlow[j] is None or lo < minlow[j]:
            minlow[j] = lo; minn[j] = n
out['fails'] = fails; out['undecided'] = undecided; out['tests'] = 4*N
out['min_margin_over_79_100'] = [(minlow[j]-floor_).str(15) for j in range(4)]
out['min_at_n'] = minn
out['final_prefix_sums_C_N(t_j)'] = [sums[j].str(15) for j in range(4)]
out['final_lipschitz_times_r'] = (r*lip).str(15)
out['max_radius_final'] = [sums[j].rad().str(5) for j in range(4)]
out['seconds'] = time.time()-t0
json.dump(out, open(sys.argv[1],'w'), indent=1)
print(json.dumps(out, indent=1))
