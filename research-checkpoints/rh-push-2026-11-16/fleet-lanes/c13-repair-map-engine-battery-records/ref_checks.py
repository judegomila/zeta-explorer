"""Author's adversarial checks (not an independent referee). (1) The 17 new HEAT tau = -0.5 pairs evaluated with the quadrature of
c12-control-battery-harness/battery/heatlib.py (Gauss-Legendre in u; a different representation from the Gaussian convolution used
to find them). (2) mpmath (40 digits) values of q_h at the corrected ordinates of the DH window 10000-10008 and of the gamma-only
windows at h = 2, against screen.corrected.json. Usage: python ref_checks.py <battery lane dir> <out.json>"""
import sys, os, json, time
lane = sys.argv[1]; sys.path.insert(0, os.path.join(lane, 'battery'))
out = {}; T0 = time.time()
# ---------- (2) mpmath
from mpmath import mp, mpf, mpc, zeta, loggamma, exp, log, pi, sqrt, re, diff
mp.dps = 40
def gfac(s): return s * (s - 1) * exp(-s / 2 * log(pi) + loggamma(s / 2))
def gam(s): return gfac(s) + gfac(1 - s)
kap = (sqrt(10 - 2 * sqrt(5)) - 2) / (sqrt(5) - 1); chi = [0, 1, mpc(0, 1), mpc(0, -1), -1]
def Lchi(s, conj=False):
    tot = 0
    for a in range(1, 5):
        c = chi[a].conjugate() if conj else chi[a]; tot += c * zeta(s, mpf(a) / 5)
    return tot * mpf(5) ** (-s)
def dh(s):
    f = (1 - 1j * kap) / 2 * Lchi(s) + (1 + 1j * kap) / 2 * Lchi(s, True)
    return exp(s / 2 * log(5 / pi) + loggamma((s + 1) / 2)) * f
def q(X, t, h):
    rho = mpc(0.5, t); d = diff(X, rho, h=mpf(10) ** -15); v = X(rho + h); return -re(d * v) / (abs(d) * abs(v))
R = json.load(open('records_corrected/screen.corrected.json'))
rows = []
w = R['DH']['t10000-10008']
for h, key in (('1', '1.0'), ('0.5', '0.5')):
    vals = [q(dh, mpf(z), mpf(h)) for z in w['ordinates']]
    rows.append(dict(window='DH t10000-10008', h=h, mpmath_min=float(min(vals)), record_min=w['min_q'][key], diff=abs(float(min(vals)) - w['min_q'][key]), fails=sum(1 for v in vals if v < 0), record_fails=w['fails'][key]))
res = max(abs(dh(mpc(0.5, mpf(z))) / diff(dh, mpc(0.5, mpf(z)), h=mpf(10) ** -15)) for z in w['ordinates'])
out['dh_1e4_max_newton_residual_mpmath'] = float(res)
for name in ('t10-200', 't1000-1040', 't10000-10030'):
    w = R['GAM'][name]; vals = [q(gam, mpf(z), mpf(2)) for z in w['ordinates']]
    rows.append(dict(window='GAM ' + name, h='2', mpmath_min=float(min(vals)), record_min=w['min_q']['2.0'], diff=abs(float(min(vals)) - w['min_q']['2.0']), fails=sum(1 for v in vals if v < 0), record_fails=w['fails']['2.0']))
out['mpmath'] = rows
for r in rows: print(r, flush=True)
print('max DH Newton residual at corrected ordinates near 1e4 (mpmath): %.1e; %.0f s' % (out['dh_1e4_max_newton_residual_mpmath'], time.time() - T0), flush=True)
# ---------- (1) heatlib quadrature at the new pairs
from flint import acb, arb, ctx
import heatlib
new = json.load(open('heat_b_-0.5.json'))['new']
hr = []
for tb in (1000.0, 1500.0, 2000.0):
    zs = [q_ for q_ in new if tb - 500 < float(q_[1]) <= tb]
    if not zs: continue
    digits = int(45 + 0.3412 * tb + 0.02 * tb); bits = int((digits + 15) / 0.30103) + 8
    H = heatlib.Heat(bits, tb + 1.0, digits=digits)
    for z in zs:
        f, d = H.F('-0.5', acb(arb(z[0]), arb(z[1])), True)
        r = float((abs(f) / abs(d)).upper())
        hr.append(dict(re=z[0][:24], im=z[1][:26], newton_residual_heatlib=r)); print(hr[-1], '%.0f s' % (time.time() - T0), flush=True)
out['heatlib'] = hr; out['heatlib_max_residual'] = max(x['newton_residual_heatlib'] for x in hr)
json.dump(out, open(sys.argv[2], 'w'), indent=1)
print('done %.0f s; largest heatlib residual %.1e' % (time.time() - T0, out['heatlib_max_residual']))
