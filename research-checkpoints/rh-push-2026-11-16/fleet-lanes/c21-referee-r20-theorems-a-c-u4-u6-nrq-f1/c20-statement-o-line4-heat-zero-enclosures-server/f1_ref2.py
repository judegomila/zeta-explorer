# Second referee, escape law F1 (Theorem A of b-escape-law): numerical test of Lemma R at certified zeros of H_{-tau}.
# mpmath 40 digits, trapezoid rule (not ball arithmetic). Written from the RESULT.md files only.
import json, os, sys, time
import mpmath as mp
mp.mp.dps = 40
HERE = os.path.dirname(os.path.abspath(__file__))
def s_of(w): return (1 + mp.j*w)/2
def J0(w):
    s = s_of(w); return s*(s - 1)*mp.pi**(-s/2)*mp.gamma(s/2)/16
def H0(w): return J0(w)*mp.zeta(s_of(w))
def gp(w):
    s = s_of(w); return (mp.j/2)*(1/s + 1/(s - 1) - mp.log(mp.pi)/2 + mp.digamma(s/2)/2)
def s_eff(z, tau): return s_of(z) + mp.j*tau*gp(z)
def Dhat(s, tau, h=mp.mpf('0.05')):          # E zeta(s + iV), V ~ N(0, tau/2), trapezoid
    sd = mp.sqrt(tau/2); n = int(mp.ceil(10*sd/h)); tot = mp.mpc(0)
    for k in range(-n, n + 1):
        v = k*h; tot += mp.zeta(s + mp.j*v)*mp.exp(-v*v/tau)
    return tot*h/mp.sqrt(mp.pi*tau)
def F_over_Tsharp(z, tau, h=mp.mpf('0.05')):  # direct Gaussian convolution of H_0 on the horizontal line through z, divided by T#
    sd = mp.sqrt(2*tau); n = int(mp.ceil(11*sd/h)); tot = mp.mpc(0)
    ref = J0(z)
    for k in range(-n, n + 1):
        u = k*h; tot += (H0(z - u)/ref)*mp.exp(-u*u/(4*tau))
    F_rel = tot*h/mp.sqrt(4*mp.pi*tau)        # F(z)/J_0(z)
    return F_rel/mp.exp(tau*gp(z)**2)
cases = [(mp.mpf(1), mp.mpc('5001.646847849111', '-1.635148075297')),
         (mp.mpf('0.25'), mp.mpc('1000006.298867790512', '-1.345582919615')),
         (mp.mpf('0.25'), mp.mpc('1000020.455262144711', '-0.952082371855'))]
if len(sys.argv) > 1: cases = cases[:int(sys.argv[1])]
out = []
for tau, z in cases:
    t0 = time.time(); rec = {'tau': str(tau), 'zero z (centre of the certified square, half-width 1e-6)': mp.nstr(z, 22)}
    x = z.real; L = mp.log(x/(4*mp.pi))
    se = s_eff(z, tau)
    rec['s_eff(z)'] = mp.nstr(se, 15); rec['near-affine formula (1+eta)/2 - tau L/4 + i(x/2 - pi tau/8)'] = mp.nstr(mp.mpc((1 - z.imag)/2 - tau*L/4, x/2 - mp.pi*tau/8), 15)
    rec['Re g\'(z) (claimed -pi/8 + o(1))'] = mp.nstr(gp(z).real, 10); rec['Im g\'(z) - L/4'] = mp.nstr(gp(z).imag - L/4, 6)
    d0 = Dhat(se, tau); f0 = F_over_Tsharp(z, tau)
    rec['|F/T#| at the zero'] = mp.nstr(abs(f0), 6); rec['|D_tau(s_eff)| at the zero (Gaussian mean of zeta)'] = mp.nstr(abs(d0), 6)
    rec['log^2|z|/|z|'] = mp.nstr(mp.log(abs(z))**2/abs(z), 6)
    for dz in (mp.mpc('0.3', '0'), mp.mpc('0', '-0.4')):
        zc = z + dz; sc = s_eff(zc, tau); dc = Dhat(sc, tau); fc = F_over_Tsharp(zc, tau)
        rec[f'control z + ({mp.nstr(dz, 3)})'] = {'|F/T#|': mp.nstr(abs(fc), 10), '|D_tau(s_eff)|': mp.nstr(abs(dc), 10), '|F/T# - D|': mp.nstr(abs(fc - dc), 6),
                                                   '|F/T# - D| / (log^2|z|/|z|)': mp.nstr(abs(fc - dc)/(mp.log(abs(zc))**2/abs(zc)), 6)}
    # step-halving check of the trapezoid sums at the first control
    zc = z + mp.mpc('0.3', '0')
    rec['trapezoid step check (h = 0.05 vs 0.1): |dF|, |dD|'] = [mp.nstr(abs(F_over_Tsharp(zc, tau) - F_over_Tsharp(zc, tau, mp.mpf('0.1'))), 5), mp.nstr(abs(Dhat(s_eff(zc, tau), tau) - Dhat(s_eff(zc, tau), tau, mp.mpf('0.1'))), 5)]
    rec['seconds'] = time.time() - t0
    out.append(rec); print(json.dumps(rec, indent=1), flush=True)
    json.dump(out, open(os.path.join(HERE, 'f1_ref2.json'), 'w'), indent=1)
# Lemma D (b),(e) spot checks: b_4 != b_2^2; D_tau(sigma) -> 1
tau = mp.mpf(1)
bn = lambda n: mp.exp(-(tau/4)*mp.log(n)**2)
out.append({'b_4 - b_2^2 (tau = 1)': mp.nstr(bn(4) - bn(2)**2, 12), 'sigma_1(1): sum_{n>=2} b_n n^-sigma = 1 at sigma =': mp.nstr(mp.findroot(lambda sg: mp.nsum(lambda n: bn(n)*n**(-sg), [2, mp.inf]) - 1, 1.0), 10)})
json.dump(out, open(os.path.join(HERE, 'f1_ref2.json'), 'w'), indent=1)
print(json.dumps(out[-1]))
