"""validation of the float64 engines against python-flint balls, and of the statistics on cases with known answers."""
import sys, math, json
import numpy as np
import sfs
from flint import acb, arb, acb_series, ctx

out = {}
rng = np.random.default_rng(1)
# 1. Riemann-Siegel engine against acb.zeta (value and derivative)
for T0 in [1e5, 1e6, 1e8]:
    eng = sfs.ZetaRS(T0, 2000.0, np)
    u = np.sort(rng.uniform(0, 2000.0, 40))
    t, F, dF, _ = eng.block(u)
    ctx.prec = 100
    errF = np.zeros(sfs.NS); errD = np.zeros(sfs.NS)
    for i in range(len(u)):
        for j, sg in enumerate(sfs.SIG):
            y = acb_series([acb(arb(sg), arb(T0) + arb(float(u[i]))), 1], prec=2).zeta()
            errF[j] = max(errF[j], abs(complex(y[0]) - F[i, j])); errD[j] = max(errD[j], abs(complex(y[1]) - dF[i, j]))
    out['rs_T0=%g' % T0] = dict(max_abs_err_F=errF.tolist(), max_abs_err_dF=errD.tolist(), predicted_scale=T0 ** -0.75)
    print('RS', T0, 'errF', errF.max(), 'errdF', errD.max(), flush=True)
# 2. periodic engine against Hurwitz balls
cache = {}
for tc in [50.0, 700.0, 5000.0]:
    t = tc + np.sort(rng.uniform(0, 5, 6))
    vals = sfs.per_block(np, t, tc * 1.02 + 20, cache)
    ref = sfs._arb_chunk((list(map(float, t)), ['LCHI', 'DH']))
    for o in ('LCHI', 'DH'):
        e0 = np.abs(vals[o][0] - ref[o][0]).max(); e1 = np.abs(vals[o][1] - ref[o][1]).max()
        out['per_%s_t=%g' % (o, tc)] = dict(max_abs_err_F=float(e0), max_abs_err_dF=float(e1))
        print('PER', o, tc, e0, e1, flush=True)
# 3. gamma factors against balls; functional equation of the completed functions (|F(1/2+a+it)| = |F(1/2-a+it)|)
s = np.array([complex(0.7, 33.3), complex(0.5, 1234.5)])
for kind, fn in (('zeta', lambda x: (x * (x - 1)).log() - x / 2 * arb.pi().log() + (x / 2).lgamma()),
                 ('odd5', lambda x: x / 2 * (arb(5) / arb.pi()).log() + ((x + 1) / 2).lgamma())):
    lg, gl = sfs.gamma_info(kind, s, np)
    for k in range(2):
        y = fn(acb_series([acb(s[k].real, s[k].imag), 1], prec=2))
        out['gamma_%s_%d' % (kind, k)] = [abs(complex(y[0]).real - lg[k].real), abs(complex(y[1]) - gl[k])]
        print('gamma', kind, out['gamma_%s_%d' % (kind, k)])
# 4. DH: first off-line zero 0.80851718 + 85.69934849 i (battery table): Re(completed log-derivative) < 0 just left of it
t = np.array([85.6993485]); ref = sfs._arb_chunk(([85.6993485], ['DH']))
F, dF = ref['DH']
sg = np.asarray(sfs.SIG)[None, :] + 1j * t[:, None]
lg, gl = sfs.gamma_info('odd5', sg, np)
out['dh_first_zero_Re_logder_on_lines'] = (dF / F + gl).real[0].tolist()
print('DH Re logder at t=85.6993485 on SIG:', out['dh_first_zero_Re_logder_on_lines'])
# 5. heat convolution at tau -> small must reproduce xi: compare F_tau with tau = -1e-4... (kernel narrower than the grid is not valid);
#    instead check the semigroup identity at one point by direct quadrature in balls: F_tau(sigma+it) = E xi(sigma + i(t+Y))
ctx.prec = 120
def xi(sg, t):
    x = acb(sg, t)
    return x * (x - 1) * (arb.pi() ** (-x / 2)) * (x / 2).gamma() * x.zeta()
tau = -0.5; v = abs(tau) / 2; tc = 60.0; sgm = 0.6
ys = np.arange(-4.0, 4.0001, 0.02)
num = sum(complex(xi(sgm, tc + float(y))) * math.exp(-y * y / (2 * v)) for y in ys) * 0.02 / math.sqrt(2 * math.pi * v)
dt = 0.02
tt = tc + dt * np.arange(-600, 601)
ref = sfs._arb_chunk((list(map(float, tt)), ['ZETA']))
class Dummy(sfs.Acc):
    def update(self, xp, t, F, ld, cd, cla, V0, F0, psis):
        self.keep = (t, F, cd, cla)
acc = Dummy('HEAT-0.5', tc, dt, 5, sfs.band_L('zeta', tc))
sfs.feed_heat(acc, np, tt, ref['ZETA'][0], ref['ZETA'][1], tau, {}, slice(300, 901), dt)
t_, raw, cd, cla = acc.keep
k = 300; j = sfs.SIG.index(0.6)
lgz, _ = sfs.gamma_info('zeta', np.array([complex(sgm, tc)]), np)
val = raw[k, j] * np.exp(lgz[0])
out['heat_check'] = dict(direct=[num.real, num.imag], conv=[val.real, val.imag], rel=abs(val - num) / abs(num))
print('heat', out['heat_check'])
json.dump(out, open(sys.argv[1] if len(sys.argv) > 1 else 'validate.json', 'w'), indent=1)
