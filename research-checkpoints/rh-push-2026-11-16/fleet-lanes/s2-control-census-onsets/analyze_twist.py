# Combination 3 analysis: quadratic-twist families.
import json, math, sys, os, numpy as np, twist
out = {}
def load(fn):
    R = []
    for l in open(fn):
        try: R.append(json.loads(l))
        except Exception: pass
    return R
def base(fam, fn):
    import glob
    R = []
    for f in sorted(glob.glob('tw_%s_s4.jsonl' % fam) + glob.glob('tw_%s_o?.jsonl' % fam)): R += load(f)
    print('files:', sorted(glob.glob('tw_%s_s4.jsonl' % fam) + glob.glob('tw_%s_o?.jsonl' % fam))); err = [r for r in R if 'err' in r]; R = [r for r in R if 'err' not in r]
    ok = [r for r in R if r['wn'] == r['nf']]
    print('%s: %d discriminants (|d| %d..%d), errors %d, winding = zeros found for %d (%.2f%%)' % (fam, len(R), min(abs(r['d']) for r in R), max(abs(r['d']) for r in R), len(err), len(ok), 100*len(ok)/len(R)))
    return R, ok
for fam in ('zeta', 'arm'):
    fn = 'tw_%s_s4.jsonl' % fam
    if not os.path.exists(fn): continue
    R, ok = base(fam, fn)
    non = sum(len(r['on']) for r in ok); noff = sum(len(r['off']) for r in ok); T = np.array([r['P'] - r['S_on'] for r in ok])
    print('   zeros in the box |t| <= 2.5, |Re s - 1/2| <= 1.25: on-line %d, off-line %d; discriminants with an off-line zero: %d' % (non, noff, sum(1 for r in ok if r['off'])))
    print('   balance T(d) = coefficient side - on-line zero sum: max |T| = %.2e, mean %.2e; mean coefficient side %.4f' % (np.abs(T).max(), T.mean(), np.mean([r['P'] for r in ok])))
    out[fam] = dict(n=len(R), closed=len(ok), online=non, offline=noff, maxT=float(np.abs(T).max()))
    if fam == 'zeta':
        # E_a x chi_d = L(s+a, chi_d) L(s-a, chi_d): off-line zeros at 1/2 -+ a + i gamma for every zero gamma of L(s, chi_d)
        low = [(min(abs(t) for t in r['on']) if r['on'] else None, 4*math.pi/math.log(abs(r['d'])) if abs(r['d']) > 1 else None) for r in ok if abs(r['d']) > 20]
        fr = np.mean([1.0 if (g is not None and g <= T0) else 0.0 for g, T0 in low]); g1 = np.array([g for g, T0 in low if g is not None])
        print('   E_a x chi_d: lowest zero of L(s,chi_d) below 4 pi/log|d| for %.2f%% of d (then E_a x chi_d has off-line zeros at that height); lowest zero: median %.3f, max %.3f' % (100*fr, np.median(g1), g1.max()))
        out['Ea'] = dict(frac=float(fr), median_g1=float(np.median(g1)))
fn = 'tw_dh_s4.jsonl'
if os.path.exists(fn):
    R, ok = base('dh', fn)
    for nm, cls in (('FE type, d = +-1 mod 5', (1, 4)), ('no functional equation, d = +-2 mod 5', (2, 3))):
        S = [r for r in ok if r['d'] % 5 in cls]
        if not S: continue
        fe = sum(r['fe'] < 1e-6 for r in S); woff = [r for r in S if r['off']]
        T0s = [4*math.pi/math.log(r['q']) for r in S]
        low = sum(1 for r in S if r.get('n_off_T0', 0) > 0)
        real = sum(1 for r in woff if any(abs(z[0]) < 1e-6 for z in r['off'])); cplx = sum(1 for r in woff if any(abs(z[0]) >= 1e-6 for z in r['off']))
        print('   %s: n=%d; real on the line (FE defect < 1e-6): %d; with an off-line zero in the box: %d (%.2f%%); within |t| <= 4 pi/log q: %d (%.2f%%)' % (nm, len(S), fe, len(woff), 100*len(woff)/len(S), low, 100*low/len(S)))
        print('        of those: with a real off-line zero (height 0) %d, with a complex off-line zero %d; mean zeros per d in box: on-line %.2f, off-line %.2f; d with no on-line zero in box: %d' % (real, cplx, np.mean([len(r['on']) for r in S]), np.mean([len(r['off']) for r in S]), sum(1 for r in S if not r['on'])))
        if cls == (1, 4):
            T = np.array([r['P'] - r['S_on'] for r in S if 'P' in r]); Ta = np.array([r['P'] - r['S_all'] for r in S if 'P' in r])
            print('        balance: max |coefficient side - all zeros| = %.2e; T(d) = coefficient side - on-line zeros: |T| > 1e-2 for %d (%.2f%%), max %.3f' % (np.abs(Ta).max(), (np.abs(T) > 1e-2).sum(), 100*(np.abs(T) > 1e-2).mean(), np.abs(T).max()))
            # fraction against conductor
            for lo, hi in ((0, 1000), (1000, 10000), (10000, 30000), (30000, 100001)):
                SS = [r for r in S if lo <= abs(r['d']) < hi]
                if SS: print('        |d| in [%d,%d): n=%d, with off-line zero in box %.2f%%, real off-line zero %.2f%%' % (lo, hi, len(SS), 100*np.mean([bool(r['off']) for r in SS]), 100*np.mean([any(abs(z[0]) < 1e-6 for z in r['off']) for r in SS])))
            out['dh_fe'] = dict(n=len(S), with_off=len(woff), real=real, cplx=cplx, low=low)
        else:
            dist = [min(abs(z[1]) for z in r['off']) for r in S if r['off']]
            print('        distance of zeros from the line: min over all d %.2e, median of per-d minimum %.3f' % (min(dist), np.median(dist)))
            out['dh_nofe'] = dict(n=len(S), with_off=len(woff), no_online=sum(1 for r in S if not r['on']), min_dist=float(min(dist)))
# T-NR x chi_d: zeta(s)(1 + c 3^{1/2-s} + 3^{1-2s}) twisted: second factor 1 + c chi_d(3) 3^{1/2-s} + chi_d(3)^2 3^{1-2s}
ds = twist.fund_discs(100000); X = twist.kron_table(ds, 3)[:, 3]
r1 = (-2.2 + math.sqrt(2.2**2 - 4))/2
print('T-NR x chi_d (q=3, c=2.2), %d fundamental d: chi_d(3) = -1 for %.2f%% (real off-line zeros at 1/2 +- %.4f, height 0), +1 for %.2f%% (off-line zeros at height pi/log 3 = %.3f), 0 for %.2f%% (factor trivial)' % (len(ds), 100*np.mean(X == -1), abs(math.log(abs(r1)))/math.log(3), 100*np.mean(X == 1), math.pi/math.log(3), 100*np.mean(X == 0)))
out['tnr'] = dict(minus=float(np.mean(X == -1)), plus=float(np.mean(X == 1)))
json.dump(out, open('twist_summary.json', 'w'), indent=1)
