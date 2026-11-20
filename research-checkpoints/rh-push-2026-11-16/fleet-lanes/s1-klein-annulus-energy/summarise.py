"""s1-klein-annulus-energy: tables from out/*.json and out/li_*.npz (text + numpy only).  usage: summarise.py > out/SUMMARY.txt"""
import json, glob, math, os, sys
import numpy as np

def nz(code, T0, ell):
    """smooth zero count of the window from the gamma factor (conductor q, degree d)"""
    def N(t, q):
        return t / (2 * math.pi) * math.log(q * t / (2 * math.pi * math.e)) if t > 3 else 0.0
    q, d, extra = 1, 1, 0.0
    if code == 'DH': q = 5
    if code == 'LCHI3': q = 3
    if code.startswith('EA'): d = 2
    if code.startswith('TNR'): extra = ell * 2 * math.log(3) / (2 * math.pi)
    return d * (N(T0 + ell, q) - N(T0, q)) + extra

def offline(code, T0, ell):
    """list of x0 of off-line zeros (Re z > 0) with ordinate in the window"""
    if code == 'DH':
        z = json.load(open('tables/zeros_DH.json'))['offline']
        return [float(b) - 0.5 for b, g, _ in z if T0 <= float(g) <= T0 + ell]
    if code.startswith('HEAT'):
        z = json.load(open('tables/zeros_HEAT--0.5.json'))['offline']
        return [float(v[0]) for v in z if T0 <= float(v[1]) <= T0 + ell]
    if code.startswith('EA'):
        a = eval(code.split(':')[1]); return [a] * int(round(nz('ZETA', T0, ell)))
    if code.startswith('TNR'):
        return [0.40358] * int(round(ell * math.log(3) / (2 * math.pi)))
    return []

files = sorted(glob.glob('out/*.json'))
D = {}
for f in files:
    b = os.path.basename(f)[:-5]
    if b in ('li_damped', 'c4_fixed') or b.startswith('li_'): continue
    j = json.load(open(f))
    if isinstance(j, dict) and 'combo1' in j: D[b] = j

print('=== combination (1): Toeplitz first-negative order N* (None = positive semidefinite to order 4096) ===')
print('columns: dataset | zeros in window (smooth count) | off-line zeros in window: count, x0 min..max | ell/(2 pi x0max) | alpha b | -theta\': min, N* | u_b: min, negfrac, N* | D = -theta\' - T_b (masked near-line singularities): min, mean, N*, [flags, masked fraction, unmasked min]')
for k, d in D.items():
    off = offline(d['code'], d['T0'], d['ell']); n0 = nz(d['code'], d['T0'], d['ell'])
    for r in d['combo1']:
        print('%-14s | %7.1f | %4d %s | %s | al=%g b=%g | %.3g %s | %.3g %.4f %s | %.3g %.3g %s [%d %.3f %.3g]' % (
            k, n0, len(off), ('%.3f..%.3f' % (min(off), max(off))) if off else '-', ('%.0f' % (d['ell'] / (2 * math.pi * max(off)))) if off else '-',
            r['alpha'], r['b'], r['mtheta_min'], r['mtheta_Nstar'], r['u_min'], r['u_negfrac'], r['u_Nstar'], r['D_min'], r['D_mean'], r['D_Nstar'], r['D_flags'], r['D_maskfrac'], r['D_raw_min']))
print()
print('=== combination (1): lowest modes (alpha = 1): n, Re u_n, Re (-theta\')_n, Re D_n, strip energy (ell/2) kappa coth(kappa b) |u_n|^2 ===')
for k, d in D.items():
    for r in d['combo1']:
        if r['alpha'] != 1.0: continue
        print('%-14s b=%g ' % (k, r['b']) + ' ; '.join('n=%d u %.4g mth %.4g D %.3g E %.3g' % (m['n'], m['u'][0], m['mtheta'][0], m['D'][0], m['strip_energy']) for m in r['low_modes'][:4]))
print()
print('=== combination (3): certificate of the Klein phase transport (fires = main > tail for some admissible R) ===')
print('columns: dataset | a h | sampled t | hypothesis admissible | fires (fraction) | violations | W_h < 0 count | identity max dev / int omega |C| | min relative slack')
for k, d in D.items():
    for r in d['combo3']:
        print('%-14s | a=%g h=%g | %d | %d | %d (%.4f) | %d | %d | %.1e | %.3g' % (k, r['a'], r['h'], r['n_t'], r['n_valid'], r['n_fire'], r['frac_fire'], r['n_violation'], r['n_lhs_negative'], r.get('identity_max_dev_over_abs_integral', float('nan')), r['min_rel_slack']))
print()
print('=== combination (4): S^4 two-point function of the phase curve of R_a (lags in units of the mean turn spacing) ===')
for k, d in D.items():
    n0 = nz(d['code'], d['T0'], d['ell'])
    for r in d['combo4']:
        print('%-14s | a=%g | turns %.2f (smooth zero count %.1f, deficit %.2f) | min theta_a\' %.3g | G: %s' % (k, r['a'], r['turns'], n0, n0 - r['turns'], r['theta_prime_min'],
              ' '.join('%s:%.4f' % (kk, v) if v is not None else kk + ':-' for kk, v in r['G'].items())))
print()
print('=== combination (2): circle FFT ===')
LI = []
for f in sorted(glob.glob('out/li_*.npz')):
    z = np.load(f); lam = z['lam']; n = np.arange(1, len(lam) + 1)
    fn = int(z['first_neg'])
    rec = dict(file=os.path.basename(f), H=float(z['H']), log2N=int(z['log2N']), nmax=int(z['nmax']), c0=float(z['c0'].real), first_negative_n=fn if fn > 0 else None,
               E_minus_over_E_plus=float(z['Eminus']) / float(z['Eplus']), max_abs_power_sum=float(np.abs(z['pneg']).max()),
               lam_samples={str(m): float(lam[m - 1]) for m in (1, 2, 3, 10, 100, 300, 1000, 10000, 100000, 300000, 1000000) if m <= len(lam)},
               n_negative=int((lam < 0).sum()),
               power_sums_first={str(m): [float(z['pneg'][m - 1].real), float(z['pneg'][m - 1].imag)] for m in (1, 2, 3, 10, 100)})
    if fn > 0: rec['lam_near_first_negative'] = {str(m): float(lam[m - 1]) for m in range(max(1, fn - 3), min(len(lam), fn + 3) + 1)}
    LI.append(rec)
    print('%-22s H=%g N=2^%d nmax=%d | c_0 (zeros inside) = %.4f | first negative n: %s | E-/E+ = %.3e | max |sum w_k^n| = %.3e | lambda_n at n=1,10,100,1000,..: %s' % (
        os.path.basename(f)[:-4], float(z['H']), int(z['log2N']), int(z['nmax']), z['c0'].real, fn if fn > 0 else None, float(z['Eminus']) / float(z['Eplus']), float(np.abs(z['pneg']).max()),
        ' '.join('%.6g' % lam[m - 1] for m in (1, 10, 100, 1000, 10000, 100000, 1000000, 2000000) if m <= len(lam))))
json.dump(LI, open('out/li_summary.json', 'w'), indent=1)
if os.path.exists('out/li_damped.json'):
    print()
    print('=== combination (2): damped sums D_n(S) from the zero tables ===')
    for r in json.load(open('out/li_damped.json')):
        o = r['offline'][0] if r['offline'] else None
        print('%-10s S=%g | on-line %d, off-line pairs %d | first negative n: %s (searched to %d) | %s' % (r['code'], r['S'], r['n_online'], r['n_offline_pairs'], r['first_negative_n'], r['searched_to'],
              ('controlling zero beta %.4f gamma %.2f h %.3g: 1/(1-|w|) = %.0f; ratio n*/that = %.2f' % (o['beta'], o['gamma'], o['h'], o['inv_1_minus_absw'], (r['first_negative_n'] or float('nan')) / o['inv_1_minus_absw'])) if o else ''))
