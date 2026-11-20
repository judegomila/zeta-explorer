# Combination 1 analysis: Epstein census onsets against the route-44 zero-side law.
import json, math, sys, numpy as np, collections
CO = (-0.748, 0.387, -0.278, 0.278); RMS = 0.139
def load(fn):
    out = {}
    for l in open(fn):
        try: r = json.loads(l); out[tuple(r['form'])] = r
        except Exception: pass
    return out
import glob, os
C = {}; Z = {}
for fn in sorted(glob.glob('census*.jsonl')):
    (Z if 'zeros' in fn else C).update(load(fn))
out = {}
print('forms with onset record: %d; with zero record: %d; onset errors: %d; zero errors: %d' % (len(C), len(Z), sum('err_onset' in r for r in C.values()), sum('err_zeros' in r for r in Z.values())))
h1 = [r for r in C.values() if r['h'] == 1]
print('class number one (Euler products): %d forms; Weil-negative below a = 6.4: %s; min lambda at a = 6.4: %.2e' % (len(h1), [r['form'] for r in h1 if r.get('a_neg') is not None], min(min(r['lam']) for r in h1)))
NE = [r for r in C.values() if r['h'] > 1 and 'err_onset' not in r]
neg = [r for r in NE if r.get('a_neg') is not None]; cens = [r for r in NE if r.get('a_neg') is None]
print('class number > 1: %d forms; Weil-negative found: %d; not negative up to a = 6.4: %d %s' % (len(NE), len(neg), len(cens), [r['form'] for r in cens][:8]))
am = np.array([0.5*(r['a_pos'] + r['a_neg']) if r['a_pos'] is not None else r['a_neg'] for r in neg])
print('onset a* (double precision): min %.3f  5%% %.3f  median %.3f  95%% %.3f  max %.3f' % (am.min(), *np.percentile(am, [5, 50, 95]), am.max()))
sec = collections.Counter(r['sector'] for r in neg); print('first-failure sector: even %d, odd %d' % (sec[0], sec[1]))
# information floor: no atom below log(first ratio): a* >= log(first_ratio)/2 for non-principal forms
fl = np.array([math.log(r['info']['first_ratio'])/2 for r in neg]); print('onset minus information floor log(m1/amin)/2: min %.3f median %.3f' % ((am - fl).min(), np.median(am - fl)))
out['n_forms'] = len(C); out['h1'] = len(h1); out['nonEuler'] = len(NE); out['negative'] = len(neg)
rows = []
for r in neg:
    z = Z.get(tuple(r['form']))
    if not z or 'zeros' not in z: continue
    zz = z['zeros']; D = abs(r['D']); a = 0.5*(r['a_pos'] + r['a_neg']) if r['a_pos'] is not None else r['a_neg']
    real = zz.get('real') or []; cz = [(b, g) for b, g, *_ in zz['zeros'] if b > 0.5]
    pred = min((CO[0] + CO[1]*math.log(g) + CO[2]*math.log(b - .5) + CO[3]*math.log(D) for b, g in cz), default=None)
    bind = min(cz, key=lambda bg: CO[1]*math.log(bg[1]) + CO[2]*math.log(bg[0] - .5)) if cz else None
    rows.append(dict(form=r['form'], D=D, a=a, real=real, cz=cz, pred=pred, bind=bind, floor=math.log(r['info']['first_ratio'])/2, principal=r['form'][0] == 1, sector=r['sector'], T=zz.get('T_scanned'), warn=zz.get('warn')))
print('forms with onset and zero data: %d (zero-finder warnings: %d)' % (len(rows), sum(1 for x in rows if x['warn'])))
RZ = [x for x in rows if x['real']]; NR = [x for x in rows if not x['real']]
print('with a real zero in (1/2,1): %d; without: %d; of those, complex off-line zero found below the scan height: %d' % (len(RZ), len(NR), sum(1 for x in NR if x['cz'])))
if RZ:
    a_ = np.array([x['a'] for x in RZ]); b_ = np.array([max(x['real']) for x in RZ]); D_ = np.array([x['D'] for x in RZ])
    X = np.column_stack([np.ones(len(a_)), np.log(b_ - 0.5), np.log(D_)]); co, *_ = np.linalg.lstsq(X, a_, rcond=None); rr = a_ - X @ co
    print('  real-zero class: a* range %.3f..%.3f; odd-sector first failures %d/%d; fit a* = %.3f %+.3f log(beta-1/2) %+.3f log|D|, rms %.3f' % (a_.min(), a_.max(), sum(x['sector'] == 1 for x in RZ), len(RZ), *co, np.sqrt((rr**2).mean())))
    out['realzero'] = dict(n=len(RZ), amin=float(a_.min()), amax=float(a_.max()), fit=co.tolist(), rms=float(np.sqrt((rr**2).mean())))
W = [x for x in NR if x['cz']]
res = np.array([x['a'] - max(x['pred'], x['floor']) for x in W]); res0 = np.array([x['a'] - x['pred'] for x in W])
def desc(v): return 'n=%d mean %.3f sd %.3f rms %.3f min %.3f 1%% %.3f 5%% %.3f median %.3f 95%% %.3f max %.3f' % (len(v), v.mean(), v.std(), np.sqrt((v**2).mean()), v.min(), *np.percentile(v, [1, 5, 50, 95]), v.max())
print('law residual a*_measured - a*_predicted (route-44 coefficients, q = |D|), forms without real zero:')
print('   all: ' + desc(res0)); print('   with information floor applied to the prediction: ' + desc(res))
for nm, sel in (('principal', [i for i, x in enumerate(W) if x['principal']]), ('non-principal', [i for i, x in enumerate(W) if not x['principal']])):
    if sel: print('   %s: ' % nm + desc(res0[sel]))
print('   below -5 rms (%.3f): %d of %d (%.1f%%); above +5 rms: %d' % (-5*RMS, (res0 < -5*RMS).sum(), len(res0), 100*(res0 < -5*RMS).mean(), (res0 > 5*RMS).sum()))
print('   every non-Euler form below -5 rms: %s' % bool((res0 < -5*RMS).all()))
# refit on the Epstein population
X = np.array([[1, math.log(x['bind'][1]), math.log(x['bind'][0] - .5), math.log(x['D'])] for x in W]); y = np.array([x['a'] for x in W])
co, *_ = np.linalg.lstsq(X, y, rcond=None); rr = y - X @ co
print('   refit on Epstein forms: a* = %.3f %+.3f log gamma %+.3f log(beta-1/2) %+.3f log|D|; rms %.3f, R^2 %.3f' % (*co, np.sqrt((rr**2).mean()), 1 - rr.var()/y.var()))
low = sorted(zip(res0, W), key=lambda t: t[0])[:12]
print('   lowest residuals: ' + '; '.join('%s D=-%d a*=%.3f pred=%.3f zero=(%.3f,%.3f) floor=%.3f' % (tuple(x['form']), x['D'], x['a'], x['pred'], x['bind'][0], x['bind'][1], x['floor']) for r_, x in low))
right = [x for x in W if x['bind'][0] > 1]
print('   forms whose binding zero has Re > 1: %d; their residuals: %s' % (len(right), desc(np.array([x['a'] - x['pred'] for x in right])) if right else '-'))
# class refits: binding zero to the right of 1 / inside the strip
for nm, sel in (('binding zero with Re > 1', [x for x in W if x['bind'][0] > 1]), ('binding zero with 1/2 < Re <= 1, non-principal', [x for x in W if x['bind'][0] <= 1 and not x['principal']]), ('principal, no real zero', [x for x in W if x['principal']])):
    if len(sel) < 10: continue
    Xc = np.array([[1, math.log(x['bind'][1]), math.log(x['bind'][0] - .5), math.log(x['D'])] for x in sel]); yc = np.array([x['a'] for x in sel])
    cc, *_ = np.linalg.lstsq(Xc, yc, rcond=None); rc = yc - Xc @ cc
    r0 = np.array([x['a'] - x['pred'] for x in sel])
    print('   class [%s]: n=%d; residual to the twin law: mean %.3f sd %.3f; own fit a* = %.3f %+.3f log gamma %+.3f log(beta-1/2) %+.3f log|D|, rms %.3f, R^2 %.3f' % (nm, len(sel), r0.mean(), r0.std(), *cc, np.sqrt((rc**2).mean()), 1 - rc.var()/yc.var()))
    out.setdefault('classfit', {})[nm] = dict(n=len(sel), mean=float(r0.mean()), sd=float(r0.std()), coef=cc.tolist(), rms=float(np.sqrt((rc**2).mean())))
nz = [x for x in NR if not x['cz']]
print('   forms with a Weil onset, no real zero and no off-line zero with Re > 0.52 found below the scan height: %d; their onsets: min %.3f median %.3f max %.3f; scan heights %.0f..%.0f' % (len(nz), min(x['a'] for x in nz), np.median([x['a'] for x in nz]), max(x['a'] for x in nz), min(x['T'] for x in nz), max(x['T'] for x in nz)))
cz_ = []
for r in cens:
    z = Z.get(tuple(r['form']))
    if z and 'zeros' in z: cz_.append((r['form'], r['D'], z['zeros'].get('real'), [(round(b, 3), round(g, 2)) for b, g, *_ in z['zeros']['zeros']][:2], z['zeros'].get('T_scanned')))
print('   Weil-blind forms (no negative value up to a = 6.4, h > 1): %d; zero data: %s' % (len(cens), cz_[:40]))
out['blind'] = [dict(form=f, D=D, real=rl, zeros=zz, T=T) for f, D, rl, zz, T in cz_]
# zero resolution: a* x gamma (number of oscillations of the binding frequency across the support)
ag = np.array([x['a']*x['bind'][1] for x in W]); print('   a* x gamma_binding: min %.1f median %.1f max %.1f (2N = 340 polynomial degrees in the basis)' % (ag.min(), np.median(ag), ag.max()))
out['law'] = dict(n=len(res0), mean=float(res0.mean()), rms=float(np.sqrt((res0**2).mean())), min=float(res0.min()), max=float(res0.max()), below5=int((res0 < -5*RMS).sum()), refit=co.tolist(), refit_rms=float(np.sqrt((rr**2).mean())))
# finite-support detector (integrality I / multiplicativity E1) against the zero-side prediction and the measured Weil onset
DT = json.load(open('detector_epstein.json'))
def dsup(x):
    v = DT['%d,%d,%d' % tuple(x['form'])]; return min(t for t in (v['I'], v['E1']) if t is not None)
gap = np.array([dsup(x)/2 - x['pred'] for x in W]); gapm = np.array([dsup(x)/2 - x['a'] for x in W])
print('detector (I or E1) onset in a-units (support/2) minus law prediction: ' + desc(gap))
print('   below -5 rms: %d of %d (%.1f%%); detector onset minus measured Weil onset: ' % ((gap < -5*RMS).sum(), len(gap), 100*(gap < -5*RMS).mean()) + desc(gapm))
allneg = [(DT['%d,%d,%d' % tuple(r['form'])], 0.5*(r['a_pos'] + r['a_neg']) if r['a_pos'] is not None else r['a_neg']) for r in neg]
gm = np.array([min(t for t in (v['I'], v['E1']) if t is not None)/2 - a for v, a in allneg])
print('   all %d Weil-negative forms: detector onset earlier than the Weil onset for %d (%.1f%%); later for %d' % (len(gm), (gm < 0).sum(), 100*(gm < 0).mean(), (gm >= 0).sum()))
out['detector'] = dict(n=len(gap), below5=int((gap < -5*RMS).sum()), earlier_than_weil=int((gm < 0).sum()), n_all=len(gm))
json.dump(out, open('census_summary.json', 'w'), indent=1)
