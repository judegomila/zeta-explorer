"""fill.json for build_result.py: strings computed from the result files, plus fixed text."""
import json, glob, math, os
O = 'out/'
def J(p): return json.load(open(p))
files = sorted(glob.glob(O + 'server/h_*.json')); have = {(J(p)['obj'], J(p)['T0']) for p in files}
files += [p for p in sorted(glob.glob(O + 'hole_*.json')) if 'v1' not in p and (J(p)['obj'], J(p)['T0']) not in have]
R = [J(p) for p in files]
Lf = [r for r in R if r['obj'] in ('zeta', 'chi4', 'chi5')]; Z = sorted([r for r in R if r['obj'] == 'zeta'], key=lambda r: r['T0'])
C = [r for r in R if r['obj'] in ('chi4', 'chi5')]; D = sorted([r for r in R if r['obj'] == 'DH'], key=lambda r: r['T0'])
big = [r for r in Lf if r['windows17'] >= 5000]
def cert(r, th): return [m for m in r['moll'] if m['theta'] == th][0]
def w(r, ww): return [x for x in r['win'] if x['w'] == ww][0]
f = {}
f['GAPMAX'] = '%.2f' % max(r['gap_max'] for r in Lf)
f['NZEROS'] = '%.1e to %.1e' % (min(r['zeros_with_close_pairs'] for r in big), max(r['zeros_with_close_pairs'] for r in big))
f['CERTMAX'] = '%.1f' % max(cert(r, 0.5)['cert_max_run_m0.0'] for r in Lf)
f['INVMAX'] = '1420'
f['TMAX'] = '%.0e' % max(r['T0'] for r in R)
f['ZE0_1E7'] = 'pinned, 3105 s'
f['DEV1E7'] = 'reached for k = 0 only (X = 1e7, D = 6958, 11593 rows, 3105 s on the server, gap 1.5e-9 sqrt X); the LP-R run at 1e7 was started and stopped unfinished'
f['ZE0ROW'] = '; 1e7: 1.5e-9'
f['ZE0NEW'] = ' and 1e7'
f['ZR1LAST'] = '0.156 sqrt X (3e6)'
zt = '; '.join('T = %.0e: %d windows, %d zeros, largest gap %.2f, max abs Z %.1f, gap law slope %.2f' % (r['T0'], r['windows17'], r['zeros_with_close_pairs'], r['gap_max'], r['max_abs_Z'], (r.get('gap_law_fit_mean_log_maxZ') or {}).get('slope', float('nan'))) for r in Z)
zr = Z[0]; fit = zr['gap_law_fit_mean_log_maxZ']
f['ZETAPREMISE'] = ("Zeta (" + zt + "). The zero count equals the main term of N(T) to within 1 in every block, and no positive minimum with eta >= 0.06 "
 "spacings occurs (table T3). Mean of log max abs Z in a gap of g spacings: %.2f g %+.2f at T = 1e6 (g >= 1.5), the same law at every height (slopes %.2f to %.2f on the blocks of at least 5000 windows). "
 "At g = 3.1 the mean is e^%.2f = %.0f, i.e. %.0f times the rms of Z. Extrapolated, the law gives e^%.1f at g = 7 and e^%.1f at g = 17; the source's factors are 38 = e^3.6 and 8e7 = e^18.2 over the surrounding level "
 "(slope 1.46 per spacing). The direction and the size of the slope agree; holes of 7 spacings do not occur (the largest gap in %.1e zeros is %.2f spacings), so the premise cannot be tested at its own lengths on zeta. "
 "Windows: rho(hole, max abs Z) = %.2f to %.2f and rho(hole, J(1/2)) = %.2f to %.2f (Spearman, 7 to 17 spacings): the longest zero-free stretch of a window is correlated with the size of abs F and of the mollified mean square, "
 "and the median J(1/2) of the windows holding the top one per cent of holes is %.2f against %.2f for all windows (w = 7, T = 1e6; standard deviation of J %.2f): a hole of about 3 spacings moves the window mean square by about two standard deviations. "
 "Certificate: Re(zeta M) > 0 on %.0f %% of the line for theta = 1/2 (%.0f %% for 1/4); the largest certified zero-free stretch is %s spacings for theta = 1/2 and %s for theta = 1/4 at T = %s; "
 "it covers on average %.2f of a gap of 2 to 2.5 spacings and %.2f of a gap of 3 or more.") % (
   fit['slope'], fit['intercept'], min((r['gap_law_fit_mean_log_maxZ'])['slope'] for r in Z if r['windows17'] >= 5000), max((r['gap_law_fit_mean_log_maxZ'])['slope'] for r in Z if r['windows17'] >= 5000),
   [x for x in zr['gap_law'] if abs(x[0] - 3.125) < 1e-9][0][2], math.exp([x for x in zr['gap_law'] if abs(x[0] - 3.125) < 1e-9][0][2]), math.exp([x for x in zr['gap_law'] if abs(x[0] - 3.125) < 1e-9][0][2]) / zr['rms_Z'],
   fit['slope'] * 7 + fit['intercept'], fit['slope'] * 17 + fit['intercept'], sum(r['zeros_with_close_pairs'] for r in Z), max(r['gap_max'] for r in Z),
   min(x['spearman_hole_maxZ'] for r in Z if r['windows17'] >= 5000 for x in r['win']), max(x['spearman_hole_maxZ'] for r in Z if r['windows17'] >= 5000 for x in r['win']),
   min(x['spearman_hole_J_th0.5'] for r in Z if r['windows17'] >= 5000 for x in r['win']), max(x['spearman_hole_J_th0.5'] for r in Z if r['windows17'] >= 5000 for x in r['win']),
   w(zr, 7)['J_median_top1pct_hole_th0.5'], w(zr, 7)['J_median_all_th0.5'], w(zr, 7)['J_sd_th0.5'],
   100 * cert(zr, 0.5)['frac_ReFM_pos'], 100 * cert(zr, 0.25)['frac_ReFM_pos'],
   ', '.join('%.1f' % cert(r, 0.5)['cert_max_run_m0.0'] for r in Z), ', '.join('%.1f' % cert(r, 0.25)['cert_max_run_m0.0'] for r in Z), ', '.join('%.0e' % r['T0'] for r in Z),
   dict((a, e) for a, b, c, e, mn in cert(zr, 0.5)['cert_efficiency_by_gap'])[2.0], dict((a, e) for a, b, c, e, mn in cert(zr, 0.5)['cert_efficiency_by_gap'])[3.0])
f['CHIGAP'] = '%.2f to %.2f spacings' % (min(r['gap_max'] for r in C), max(r['gap_max'] for r in C))
f['CHISLOPE'] = '%.2f to %.2f' % (min(r['gap_law_fit_mean_log_maxZ']['slope'] for r in C if r['windows17'] >= 5000), max(r['gap_law_fit_mean_log_maxZ']['slope'] for r in C if r['windows17'] >= 5000))
f['CHICERT'] = '%.1f' % max(cert(r, 0.5)['cert_max_run_m0.0'] for r in C)
dh = []
for r in D:
    pm = r.get('positive_minima_eta_ge_steps', {}); w7 = w(r, 7); w17 = w(r, 17)
    dh.append("T = %.0e (%d windows): %d real zeros counted against %.0f expected (deficit %.1f %%, about %d off-line pairs), %s positive minima with eta >= 0.1 spacings, largest zero-free stretch %.2f spacings with max abs Z = %.1f inside (rms %.2f)" % (
        r['T0'], r['windows17'], r['zeros_with_close_pairs'], r['expected_main_term'], -100 * r['count_minus_expected'] / r['expected_main_term'], -r['count_minus_expected'] / 2, pm.get('1.0', r['laguerre_violations']), r['gap_max'], r['top_gaps'][0][1], r['rms_Z']))
d0 = D[0]; w7 = w(d0, 7); w17 = w(d0, 17)
def lawv(r, g):
    for a, n, m, lo, hi in r.get('gap_law_viol', []):
        if abs(a - g) < 1e-9: return m, n
    return float('nan'), 0
f['DHPARA'] = "Davenport-Heilbronn. " + '; '.join(dh) + ". " + (
  "Windows of 17 spacings at T = 1e6: %d of %d are clean; the largest hole is %.1f spacings in clean windows and %.1f in the others; %d of the others have a hole of at least 4 spacings, with median max abs Z = %.1f "
  "(median over all windows %.1f). In clean windows the gap statistics are those of the L-functions (table T6). "
  "The certificate reports at most %s spacings (theta = 1/2) at the heights run and covers %.2f of a gap of 3 or more: it does not report the long stretches, which are true zero-free stretches of the line. "
  "It reports nothing that is not there. Every stretch of 4 spacings or more lies in a window that holds a positive minimum or whose count of real zeros is at least 2 short (MEASURED, all heights, w = 7, 12, 17): "
  "the largest hole in a clean window is %.1f spacings, against 3.0 to 3.5 for zeta and the two L-functions. The failure named in the task (a missed true hole in a window without off-line zeros) does not occur. "
  "The share of missing real zeros grows slowly with the height (10.5, 11.1, 11.5, 11.8 per cent).") % (
    w17['clean_windows'], w17['nwin'], w17['hole_max_clean'], w17['hole_max_unclean'], w17.get('unclean_holes_ge4', 0), w17.get('maxZ_median_unclean_holes_ge4', float('nan')), w17['maxZ_median_all'],
    ', '.join('%.1f' % cert(r, 0.5)['cert_max_run_m0.0'] for r in D), dict((a, e) for a, b, c, e, mn in cert(d0, 0.5)['cert_efficiency_by_gap'])[3.0], max(w(r, ww)['hole_max_clean'] for r in D for ww in (7, 12, 17) if w(r, ww).get('hole_max_clean') is not None))
m5, n5 = lawv(d0, 5.125); zfit = Z[0]['gap_law_fit_mean_log_maxZ']
f['DHLAW'] = "for Davenport-Heilbronn at T = 1e6 the %d gaps of 5 to 5.25 spacings that hold a positive minimum have mean log max abs Z = %.2f, against %.1f from zeta's law" % (n5, m5, zfit['slope'] * 5.125 + zfit['intercept'])
f['DHJ'] = '; '.join("y = %d: J(1/2) = %.2f in clean windows and %.2f in the others for Davenport-Heilbronn, %s for the L-functions" % (cert(r, 0.5)['y'], w(r, 7).get('J_mean_clean_th0.5', float('nan')), w(r, 7).get('J_mean_unclean_th0.5', float('nan')),
       ' and '.join('%.2f' % w(c, 7)['J_mean_clean_th0.5'] for c in C if c['T0'] == r['T0']) or 'not run') for r in D) + "; max abs(b_n) = 11.6, 52.2, 267, 1420 for n <= 1e3, 1e4, 1e5, 1e6"
f['T4SIZES'] = '; '.join('%s: %s' % ({'zeta': 'zeta', 'chi4': 'L(chi_-4)', 'chi5': 'L(chi_5)', 'DH': 'DH'}[o], ', '.join('T = %.0e (%d windows)' % (r['T0'], r['windows17']) for r in sorted([x for x in R if x['obj'] == o], key=lambda x: x['T0']))) for o in ('zeta', 'chi4', 'chi5', 'DH'))
f['ZGAPS'] = ', '.join('%.2f' % r['gap_max'] for r in Z) + ' sp. at T = ' + ', '.join('%.0e' % r['T0'] for r in Z)
f['ZCERT'] = '%.1f to %.1f sp. (theta = 1/2)' % (min(cert(r, 0.5)['cert_max_run_m0.0'] for r in Z), max(cert(r, 0.5)['cert_max_run_m0.0'] for r in Z))
f['DHGAPS'] = '%.1f sp.' % max(r['gap_max'] for r in D)
if os.path.exists('fill_manual.json'): f.update(json.load(open('fill_manual.json')))
json.dump(f, open('fill.json', 'w'), indent=1)
print({k: (v[:90] + '...') if len(v) > 90 else v for k, v in f.items()})
