import json, mpmath as mp
mp.mp.dps = 25
d = json.load(open('tmp/research-2026-11-16/pick/zeros_20000.json'))
zs = [e[0] for e in d['enclosures']]
g = [mp.mpf(str(z)) for z in zs]
print("zeros:", len(g), "last", g[-1])
x = mp.mpf(1); s = mp.mpf(1)/2 + x
L = 1/s + 1/(s-1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2 + mp.zeta(s, derivative=1)/mp.zeta(s)
T = g[-1]
tail = (mp.log(T/(2*mp.pi)) + 1) / (mp.pi * T)     # ~ int_T^inf (1/2pi) log(t/2pi) * 2/t^2 dt
R0 = sum(2/(x*x + gg*gg) for gg in g)
print("R_x(0) from 20000 zeros %s + tail est %s = %s ; L(x)/x = %s" % (mp.nstr(R0, 12), mp.nstr(tail, 6), mp.nstr(R0+tail, 12), mp.nstr(L/x, 12)))
for l in (mp.log(2), mp.log(10), mp.log(1000), mp.log(10**6), 30, 60):
    R = sum(2*mp.cos(gg*l)/(x*x + gg*gg) for gg in g)
    print(" l=%s  R_x(l)/R_x(0) (zeros<=T, all on line by verified height) = %s" % (mp.nstr(l, 6), mp.nstr(R/R0, 8)))
# re-reading of euler/RESULT.md section 2.2 'move' table
idx = [1,2,3,5,8,12,20]; Ns = [7,12,15,24,34,49,81]
print("euler table: index n, measured N*, 4n+3:", [(n, N, 4*n+3) for n, N in zip(idx, Ns)])
