"""Referee check for item A, independent code path: mpmath only (no Arb, no shared code with heat_encl.py), the defining
integral on the UNSHIFTED line  F(z) = int_R H_0(z - u) G_tau(u) du  (Im(z-u) = Im z), plain trapezoid step 0.05,
|u| <= 12 sqrt(tau) + 4, 30 digits. Not rigorous. Compares (i) the scaled centre value with the ball value of the certified
run, (ii) the winding number on the half-width-0.05 square from 16 boundary samples, (iii) |F| at the Newton root.
usage: referee_check.py out_<tag>_A_p128.json
"""
import sys, json, re
import mpmath as mp
mp.mp.dps = 30
d = json.load(open(sys.argv[1])); c = d['config']
tau = mp.mpf(c['tau']); XC = mp.mpf(c['XC'])
def num(sv): return mp.mpf(re.match(r'\[?([-+0-9.e]+)', sv).group(1))
REF = num(d['REF'])
def H0s(w):
    s = (1 + 1j*w)/2
    return mp.exp(mp.log(s) + mp.log(s - 1) - mp.log(16) - s*mp.log(mp.pi)/2 + mp.loggamma(s/2) - REF)*mp.zeta(s)
hstep = mp.mpf('0.05'); UU = 12*mp.sqrt(tau) + 4; n = int(UU/hstep)
def F(z):
    tot = mp.mpc(0)
    for j in range(-n, n + 1):
        u = j*hstep
        tot += H0s(z - u)*mp.exp(-u*u/(4*tau))
    return tot*hstep/mp.sqrt(4*mp.pi*tau)
out = dict(file=sys.argv[1], nodes=2*n + 1, dps=30)
r = d['rects'][0]
zc = XC + mp.mpf(r['centre_dx']) + 1j*mp.mpf(r['centre_y'])
fc = F(zc); ball = mp.mpc(num(r['centre_value_scaled'][0]), num(r['centre_value_scaled'][1]))
out['centre_value_mpmath'] = [mp.nstr(fc.real, 25), mp.nstr(fc.imag, 25)]; out['centre_value_ball_mid'] = [mp.nstr(ball.real, 25), mp.nstr(ball.imag, 25)]
out['centre_rel_diff'] = mp.nstr(abs(fc - ball)/abs(ball), 5)
h = mp.mpf(r['half_width']); pts = []
K = 4
for k in range(K): pts.append(zc + h*(-1 + 2*mp.mpf(k)/K) - 1j*h)
for k in range(K): pts.append(zc + h + 1j*h*(-1 + 2*mp.mpf(k)/K))
for k in range(K): pts.append(zc + h*(1 - 2*mp.mpf(k)/K) + 1j*h)
for k in range(K): pts.append(zc - h + 1j*h*(1 - 2*mp.mpf(k)/K))
vals = [F(p) for p in pts]
tot = mp.mpf(0); mx = 0
for k in range(len(vals)):
    a = mp.arg(vals[(k + 1) % len(vals)]/vals[k]); tot += a; mx = max(mx, abs(a))
out['winding_16_samples'] = mp.nstr(tot/(2*mp.pi), 20); out['max_phase_step'] = mp.nstr(mx, 6)
nr = d['newton_root_nonrigorous']; zr = XC + num(nr['dx']) + 1j*num(nr['y'])
out['abs_F_at_newton_root'] = mp.nstr(abs(F(zr)), 5); out['abs_F_at_centre'] = mp.nstr(abs(fc), 5)
print(json.dumps(out, indent=1))
json.dump(out, open(sys.argv[1].replace('out_', 'referee_').replace('_A_p128', ''), 'w'), indent=1)
