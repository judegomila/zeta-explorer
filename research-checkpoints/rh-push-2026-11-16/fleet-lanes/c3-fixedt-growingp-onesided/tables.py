import json, numpy as np
o = json.load(open('onesided_test.json'))
print("## zeta: per sigma, summary over 40 heights (P in [1e3,1e7])")
for sig in o['meta']['sig']:
    r = [x for x in o['zeta'] if x['sigma']==sig]
    print("sigma=%.2f: log|zeta| in [%.3f, %.3f]; sup_P ReG - target in [%.4f, %.4f]; inf_P ReG - target in [%.4f, %.4f]; max sup_P D=%.4f min inf_P D=%.4f; D over P>=1e5: [%.4f, %.4f]; |D(1e7)| max %.2e; max scaled |D| P^(sig-1/2) logP = %.3f; trivial sum=%.1f; rawS sup max=%.3f inf min=%.3f" % (
      sig, min(x['log_abs_zeta'] for x in r), max(x['log_abs_zeta'] for x in r),
      min(x['G']['sup']-x['target_G'] for x in r), max(x['G']['sup']-x['target_G'] for x in r),
      min(x['G']['inf']-x['target_G'] for x in r), max(x['G']['inf']-x['target_G'] for x in r),
      max(x['D']['sup'] for x in r), min(x['D']['inf'] for x in r),
      min(x['D_1e5']['inf'] for x in r), max(x['D_1e5']['sup'] for x in r),
      max(abs(x['D']['last']) for x in r), max(x['scaled_sup_absD'] for x in r), r[0]['trivial'],
      max(x['rawS']['sup'] for x in r), min(x['rawS']['inf'] for x in r)))
print("\n## zeta rows (every 4th height)")
print("| t | sigma | log abs zeta | sup_P Re G | inf_P Re G | target | sup D | inf D | D(P=t) | D(1e7) |")
for x in o['zeta'][::12]+o['zeta'][1::12]+o['zeta'][2::12]:
    print("| %.4g | %.2f | %.4f | %.4f | %.4f | %.4f | %.4f | %.4f | %s | %.1e |" % (x['t'], x['sigma'], x['log_abs_zeta'], x['G']['sup'], x['G']['inf'], x['target_G'], x['D']['sup'], x['D']['inf'], ('%.4f' % x['D_at_P_eq_t']) if x['D_at_P_eq_t'] is not None else '-', x['D']['last']))
print("\n## U near (zero at 0.8 + i t0)")
print("| sigma | t - t0 | sup_P Re G | P_sup | inf_P Re G | P_inf | pred amp | renorm range P>=1e5 |")
for x in o['U_near']:
    print("| %.2f | %.2f | %.3f | %.3g | %.3f | %.3g | %.3f | [%.4f, %.4f] |" % (x['sigma'], x['t_minus_t0'], x['G']['sup'], x['G']['P_sup'], x['G']['inf'], x['G']['P_inf'], x['pred_amp'], x['renorm_1e5']['inf'], x['renorm_1e5']['sup']))
print("\n## U far (t0 = 20), summary")
for sig in o['meta']['sig']:
    r = [x for x in o['U_far'] if x['sigma']==sig]
    print("sigma=%.2f: sup_P ReG in [%.3f, %.3f]; inf_P ReG in [%.3f, %.3f]; osc of logE over P>=1e5 max %.4f; pred_amp max %.4f; renorm osc P>=1e3 max %.4f" % (sig,
      min(x['G']['sup'] for x in r), max(x['G']['sup'] for x in r), min(x['G']['inf'] for x in r), max(x['G']['inf'] for x in r),
      max(x['logE_1e5']['sup']-x['logE_1e5']['inf'] for x in r), max(x['pred_amp'] for x in r), max(x['renorm']['sup']-x['renorm']['inf'] for x in r)))
print("\n## RZ near")
print("| sigma | t | target | sup_P Re logE | inf_P | pred amp | D_raw [inf,sup] | D_renorm [inf,sup] |")
for x in o['RZ_near']:
    print("| %.2f | %.2f | %.3f | %.3f | %.3f | %.3f | [%.3f, %.3f] | [%.4f, %.4f] |" % (x['sigma'], x['t'], x['target'], x['logE']['sup'], x['logE']['inf'], x['pred_amp'], x['D_raw']['inf'], x['D_raw']['sup'], x['D_renorm']['inf'], x['D_renorm']['sup']))
print("\n## RZ at the 40 heights, summary")
for sig in o['meta']['sig']:
    r = [x for x in o['RZ'] if x['sigma']==sig]
    print("sigma=%.2f: D_raw in [%.4f, %.4f]; D_renorm in [%.4f, %.4f]; pred_amp max %.4f; target in [%.3f, %.3f]" % (sig, min(x['D_raw']['inf'] for x in r), max(x['D_raw']['sup'] for x in r), min(x['D_renorm']['inf'] for x in r), max(x['D_renorm']['sup'] for x in r), max(x['pred_amp'] for x in r), min(x['target'] for x in r), max(x['target'] for x in r)))
print("\n## DH summary")
for sig in o['meta']['sig']:
    r = [x for x in o['DH'] if x['sigma']==sig]
    print("sigma=%.2f: log|f| in [%.3f, %.3f]; sup_P in [%.1f, %.1f] median %.1f; inf_P in [%.1f, %.1f] median %.1f; median |G| at 1e3..1e7: %s" % (sig, min(x['log_abs_f'] for x in r), max(x['log_abs_f'] for x in r),
      min(x['sup'] for x in r), max(x['sup'] for x in r), np.median([x['sup'] for x in r]), min(x['inf'] for x in r), max(x['inf'] for x in r), np.median([x['inf'] for x in r]),
      ['%.1f' % np.median([abs(x['at'][k]) for x in r]) for k in ['1000','10000','100000','1e+06','1e+07']]))
    sp = [np.median([max(x['sup'], -x['inf']) for x in r])]
print("| t | sigma | log abs f | sup_P | P_sup | inf_P | P_inf |")
for x in o['DH'][::15]:
    print("| %.4g | %.2f | %.3f | %.2f | %.3g | %.2f | %.3g |" % (x['t'], x['sigma'], x['log_abs_f'], x['sup'], x['P_sup'], x['inf'], x['P_inf']))
