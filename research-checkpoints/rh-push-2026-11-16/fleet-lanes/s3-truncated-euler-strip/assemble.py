# Build RESULT.md from RESULT_head.md and the final h5an JSON. usage: assemble.py h5an.json nprimes "a2 line" "a3 line"
import json,sys,subprocess
r=json.load(open(sys.argv[1])); R=r['real']; C=r['complex']
s=open('RESULT_head.md').read()
tabs=subprocess.run([sys.executable,'h5tables.py',sys.argv[1]],capture_output=True,text=True).stdout
ym='%.4g'%r['Ymax']
s=s.replace('@H5TABLES@',tabs.strip())
s=s.replace('@YMAX@',ym).replace('@NPRIMES@',sys.argv[2]).replace('@NBLK@',str(int(2048*__import__('math').log(r['Ymax']/2))))
s=s.replace('@THIN51@','%.0f'%abs(R['0.51']['THIN_b0.8(all-2S1-E)']['final'])).replace('@THINM@','%.1f'%C['THIN']['final'])
s=s.replace('@A3LINE@',sys.argv[3]).replace('@COUNT13@',sys.argv[4])
open('RESULT.md','w').write(s)
import re
print('placeholders left:',re.findall(r'@[A-Z0-9]+@',s))
print('theta_eff zeta',{k:round(R[k]['zeta']['theta_eff'],3) for k in ('0.51','0.55','0.6','0.75')})
print('theta chi',{n:[round(R[k][n]['theta_eff'],3) for k in ('0.51','0.55','0.6')] for n in ('chi4','chi3','chi5_re','chi5_im')})
print('zeta M',C['zeta']['at_decades'],C['zeta']['sup'],C['zeta']['final'])
print('chi4 M',min(C['chi4']['at_decades'].values()),C['chi4']['sup'],'eps M',C['eps']['sup'],C['eps']['final'])
print('THIN M',C['THIN']['at_decades'],C['THIN']['final'],C['THIN']['t_at_sup'])
print('EA',R['EA']['EA_a0.15_sigma0.6_ownpoles']['sup'])
print('TNR1e6+3 sup',[R[k]['TNR_q1000003_c2.2']['sup'] for k in ('0.51','0.55','0.6','0.75')],[R[k]['zeta']['sup'] for k in ('0.51','0.55','0.6','0.75')])
