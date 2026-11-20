# Pure-python aggregation of out/cell_*.json into tables.txt
import json, glob, math, statistics as st
def Phi(z): return 0.5*math.erfc(z/math.sqrt(2))
cells = sorted((json.load(open(f)) for f in glob.glob('out/cell_*.json')), key=lambda c: (c['t'], c['theta']))
L = []
L.append("| t | theta | P | class | min Re L | frac Re L<0 | frac Re L<-1 | max abs S | N_- | N_+ |")
L.append("|---|---|---|---|---|---|---|---|---|---|")
for c in cells:
    for nm in ['gamma_only', 'zeta_fejer', 'zeta_sharp', 'liouville_fejer', 'dh_fejer']:
        if nm in c['rows']:
            r = c['rows'][nm]
            L.append("| %g | %g | %.3g | %s | %.4f | %.4f | %.4f | %.3g | %.2e | %.2e |" % (c['t'], c['theta'], c['P'], nm, r['minRe'], r['frac_neg'], r['frac_lt_m1'], r['maxAbsS'], r['Nminus'], r['Nplus']))
L.append("")
L.append("Random completely multiplicative signs, 24 seeds, Fejer section (z = Gaussian threshold, pred = Phi(-z)):")
L.append("| t | theta | P | seeds with Re L<0 | frac Re L<0: median [min, max] | pred | min Re L: median [min, max] | N_-: median [min, max] | seeds N_- > 1e-6 | zeta min Re L | zeta N_- |")
L.append("|---|---|---|---|---|---|---|---|---|---|---|")
for c in cells:
    rr = [c['rows'][k] for k in c['rows'] if k.startswith('rand')]
    f = [r['frac_neg'] for r in rr]; m = [r['minRe'] for r in rr]; n = [r['Nminus'] for r in rr]
    z = math.sqrt(24)/2*math.log(c['t']/(2*math.pi))/c['u']
    zr = c['rows']['zeta_fejer']
    L.append("| %g | %g | %.3g | %d/24 | %.4f [%.4f, %.4f] | %.2e | %.3f [%.3f, %.3f] | %.2e [%.2e, %.2e] | %d/24 | %.4f | %.2e |" % (c['t'], c['theta'], c['P'], sum(x > 0 for x in f), st.median(f), min(f), max(f), Phi(z), st.median(m), min(m), max(m), st.median(n), min(n), max(n), sum(x > 1e-6 for x in n), zr['minRe'], zr['Nminus']))
L.append("")
L.append("DH conditioning: l1 = sum abs(coefficients); zeta l1 for comparison")
for c in cells:
    if 'dh_fejer' in c['rows']: L.append("t=%g theta=%g: DH l1 %.4g, zeta l1 %.4g, DH t_min %.2f, gamma5 floor N_- %.2e" % (c['t'], c['theta'], c['rows']['dh_fejer']['l1'], c['rows']['zeta_fejer']['l1'], c['rows']['dh_fejer']['t_min'], c['rows']['gamma5_only']['Nminus']))
open('tables.txt', 'w').write("\n".join(L) + "\n"); print("\n".join(L))
