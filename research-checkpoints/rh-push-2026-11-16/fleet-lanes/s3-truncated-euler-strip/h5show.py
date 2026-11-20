import json,sys
r=json.load(open(sys.argv[1])); print('X',r['X'],'Ymax %.6g'%r['Ymax'])
for s in r['real']:
    for n,v in r['real'][s].items():
        d=v['at_decades']; ks=[k for k in ('1e4','1e6','1e8','1e10','1e11','1e12','1e13') if k in d]
        print('%-5s %-48s final %9.5f sup %9.5f @%.3g inf %10.5f @%.3g theta %s | %s'%(s,n,v['final'],v['sup'],v['Y_at_sup'],v['inf'],v['Y_at_inf'],('%.3f'%v['theta_eff']) if 'theta_eff' in v else '-',' '.join('%s:%.5g'%(k,d[k]) for k in ks)))
for n,v in r['complex'].items():
    d=v['at_decades']; print('K  %-12s final %.4f sup %.4f @Y=%.3g (sigma %s t %s) per-sigma sup %s final %s | %s'%(n,v['final'],v['sup'],v['Y_at_sup'],v['sigma_at_sup'],v['t_at_sup'],{k:round(x,3) for k,x in v['per_sigma_sup'].items()},{k:round(x,3) for k,x in v['per_sigma_final_max'].items()},' '.join('%s:%.4g'%(k,d[k]) for k in d if k in ('1e2','1e4','1e6','1e8','1e10','1e12','1e13'))))
