# mk_result.py : fills RESULT.tmpl.md with tables computed from srv/ (server), locK/ (local) and out/
import json, os, glob, math, io, contextlib, numpy as np
def L(p):
    try: return json.load(open(p))
    except Exception: return None
names=[('zeta','zeta'),('chi4','L(chi_-4)'),('chi5','L(chi_5)'),('dh','Davenport-Heilbronn'),('nr_101_2.2','T-NR q=101, integer form'),('nr_1000003_2.2','T-NR q=1000003, integer form'),
       ('g_liou','Liouville (sign twist)'),('g_U_re','U = zeta(s+i), real part'),('g_U_im','U = zeta(s+i), imaginary part'),('g_Ea','E_a, a = 1/4')]
def best(tag):
    for D in ('srv','locK'):
        d=L(f'{D}/an1_{tag}.json')
        if d is not None: return d,('server' if D=='srv' else 'local')
    return None,None
def T1():
    o=[]
    o.append('| function | K (machine) | fractions used | L2 Holder exponent, gaps 1e-7..1e-2 | largest jump at denominators <= 13 | jump-law error | cusp wobble sd/x0^2 at x0 = 0.1, 0.01, 0.001 | orbit residual RMS, steps 0 and 3 | capture ratio (xi*) |')
    o.append('|---|---|---|---|---|---|---|---|---|')
    for tag,nm in names:
        d,m=best(tag)
        if d is None: o.append(f'| {nm} | NOT RUN | | | | | | | |'); continue
        wb={w[0]:w for w in d['cusp_wobble_x0_n_sd_sd/x0^2_sd/x0']}
        g=lambda x,i: ('%.3g'%wb[x][i]) if x in wb else 'n/a'
        ob=d['gauss_orbit_step_n_rmspsi_rmsresid_rms(resid/x^2)']; t=d['toeplitz']; je=d.get('jump_pred_max_err')
        jes=('%.1e'%je) if (je is not None and tag in ('chi4','chi5','dh')) else ('continuous (law predicts 0)' if tag=='zeta' else 'no finite law')
        o.append(f"| {nm} | {d['K']} ({m}) | {d['count_used']} | {d['holder_L2_exponent_1e-7_1e-2']:.3f} | {d['jump_max_abs']:.2e} | {jes} | {g(0.1,3)}, {g(0.01,3)}, {g(0.001,3)} | {ob[0][3]:.4f}, {ob[min(3,len(ob)-1)][3]:.4f} | {t['capture_ratio']:.3f} ({t['xi_star']:.2f}) |")
    return '\n'.join(o)
def T1sym():
    ref=L('out/symbol_ref.json'); o=['| function | K | xi = 0 | 1 | 2 | 5 | 8 | 10 | 14.1347 |','|---|---|---|---|---|---|---|---|---|']
    for tag in ['zeta','chi4','chi5','dh']:
        d,m=best(tag)
        if d is None: continue
        rec=dict((round(a,3),b) for a,b in d['toeplitz']['ReX_tail_extended']); rr=dict((round(a,3),b) for a,b in ref[tag])
        o.append(f"| {tag} | {d['K']} | "+' | '.join('%.4f / %.4f'%(rec[x],rr[x]) for x in [0,1,2,5,8,10,14.135])+' |')
    return '\n'.join(o)
def T1jump():
    o=['| function | K | measured jump (predicted) at p/q |','|---|---|---|']
    for tag in ['chi4','chi5','dh']:
        d,m=best(tag)
        if d is None: continue
        o.append(f"| {tag} | {d['K']} | "+'; '.join('%d/%d: %.5f (%.5f)'%(j[0],j[1],j[2],j[3]) for j in d['jumps'][:8])+' |')
    return '\n'.join(o)
def T2():
    rows=[]
    for D,f in (('server','srv/leaf.jsonl'),('server','srv/leafgen.jsonl'),('local','locK/leaf.jsonl')):
        if os.path.exists(f):
            for ln in open(f):
                try: r=json.loads(ln); r['src']=D; rows.append(r)
                except Exception: pass
    seen={}; 
    for r in sorted(rows,key=lambda r:(r['fn'],r['b'],r['src']!='server')):
        seen.setdefault(r['fn'],{}).setdefault(r['b'],r)
    o=['| function | ratio abs(S)/A at each prime b reached | A/b^2 at the largest b | largest b (machine) |','|---|---|---|---|']
    order=['zeta','nr:1000003:2.2','nr:101:2.2','chi4','chi5','dh','liou','U_re','U_im','U_abs','Ea']
    for fn in order+[f for f in seen if f not in order]:
        if fn not in seen: continue
        bs=sorted(seen[fn]); last=seen[fn][bs[-1]]
        o.append(f"| {fn} | "+', '.join('%d: %.5f'%(b,seen[fn][b]['ratio']) for b in bs)+f" | {last['A_over_b2']:.6f} | {bs[-1]} ({last['src']}) |")
    return '\n'.join(o)
def T2off():
    a2=L('srv/analyze2.json')
    if not a2: return 'NOT RUN (the server table step did not finish).'
    o=['| function | b | OFFDIAG/DIAG |','|---|---|---|']
    for r in a2: o.append(f"| {r['fn']} | {r['b']} | {r['OFFDIAG_over_DIAG']:.4f} |")
    return '\n'.join(o)
def T3():
    res={}
    files=sorted(glob.glob('srv/t3_*.json'))
    z8=L('srv/t3_zeta_1e+08.json')
    if z8 is None or z8['blocks']<40: files=[f for f in files if '1e+08' not in f]+['out/t3_zeta_1e+08_2blocks.json']
    files+=['out/t3_dh_1e+08_1block.json']
    for f in files:
        d=L(f)
        if d is None: continue
        res.setdefault(d['T'],{})[(d['fn'],d['range'][1])]=d
    def band(th): return '1/4' if th<0.38 else ('1/2' if th<0.75 else '1')
    o=['| T | function | range | reflection mismatch (rel. L2), x = 0.02, 0.1, 0.25 | median remainder of M, x = 0.1, theta = 1/4, 1/2, 1 (fractions common to all functions at this T) | median remainder of O, x = 0.1, same fractions | remainder of O at 1/7, x = 0.1 |','|---|---|---|---|---|---|---|']
    for T in sorted(res):
        ds=res[T]; sets=[set((r['h'],r['k']) for r in d['rows'] if 'pred' in r and r['k']>1 and r['h']<r['k']) for d in ds.values()]
        common=set.intersection(*sets) if sets else set()
        for key in sorted(ds):
            d=ds[key]; cells=[]
            for kk in ('rem_plus','rem_O'):
                c=[]
                for bnd in ('1/4','1/2','1'):
                    v=[r['pred'][1][kk] for r in d['rows'] if 'pred' in r and (r['h'],r['k']) in common and band(r['theta'])==bnd]
                    c.append('%.2e (n=%d)'%(float(np.median(v)),len(v)) if v else '-')
                cells.append(', '.join(c))
            v=[r['pred'][1]['rem_O'] for r in d['rows'] if 'pred' in r and (r['h'],r['k'])==(1,7)]
            o.append(f"| {d['T']:.0e} | {d['fn']} | [{d['range'][0]:.3g}, {d['range'][1]:.4g}] | "+', '.join('%.0e'%v for v in d['fe_rel_l2'])+f" | {cells[0]} | {cells[1]} | {('%.2e'%v[0]) if v else '-'} |")
    return '\n'.join(o)
def T3nr():
    s=L('out/summ3.json')
    if not s: return ''
    o=['| T | h/k | T-NR remainder of M (x = 0.1) | zeta remainder of M (x = 0.1) | ratio |','|---|---|---|---|---|']
    for r in s['tnr']:
        v=r['x: [NR rem+, NR rem-, NR relrem+, zeta rem+, zeta rem-]'].get('0.1')
        if v and r['k']<1e4: o.append(f"| {r['T']:.0e} | {r['h']}/{r['k']} | {v[0]:.2e} | {v[3]:.2e} | {v[0]/v[3]:.1f} |")
    return '\n'.join(o)
def T4():
    d=L('out/test4.json'); o=['| object | zeros used | m | support | error of pole order, all zeros | error, on-line zeros only | off-line pair term | c(2) error, all | c(2) error, on-line only |','|---|---|---|---|---|---|---|---|---|']
    lab={'zeta_1e6':('zeta','1,000,000 (height 600,269)'),'chi4_3615':('L(chi_-4)','3,615 (height 3,400)'),'dh_H2000':('Davenport-Heilbronn','1,861 on-line + 84 off-line pairs (height 2,000)'),
         'nr101_1e6':('T-NR q=101','999,508 on-line + 440,712 off-line pairs (height 600,269)'),'Ea_0.25_1e6':('E_a, a=1/4','1,000,000 shifted quartets, none on the line')}
    for k,(nm,zz) in lab.items():
        for r in d['explicit'].get(k,[]):
            if (r['m'],r['support']) in ((4,0.65),(4,1.093),(1,0.65)):
                o.append(f"| {nm} | {zz} | {r['m']} | {r['support']} | {r['A_all_err']:.1e} | {r['A_online_err']:.1e} | {('%.1e'%r['pair_term/pole']) if 'pair_term/pole' in r else '-'} | "+(('%.1e'%r['c2_all_err']) if 'c2_all_err' in r else '-')+' | '+(('%.1e'%r['c2_online_err']) if 'c2_online_err' in r else '-')+' |')
    o.append(''); o.append('| object | H | on-line zeros | off-line pairs | Laurent constant error, all zeros | on-line only | off-line pairs moved to the line |'); o.append('|---|---|---|---|---|---|---|')
    for k,nm in (('zeta','zeta'),('chi4','L(chi_-4)'),('dh','Davenport-Heilbronn'),('nr101','T-NR q=101')):
        for r in d['hadamard'][k]:
            if r['H'] in (100,500,2000,3400,100000,600000): o.append(f"| {nm} | {r['H']} | {r['n_on']} | {r['n_off_pairs']} | {r['err_all']:.1e} | {r['err_online']:.1e} | {r['err_projected']:.1e} |")
    return '\n'.join(o)
t=open('RESULT.tmpl.md').read()
for key,fnc in (('{{T1}}',T1),('{{T1SYM}}',T1sym),('{{T1JUMP}}',T1jump),('{{T2}}',T2),('{{T2OFF}}',T2off),('{{T3}}',T3),('{{T3NR}}',T3nr),('{{T4}}',T4)):
    if key in t: t=t.replace(key,fnc())
open('RESULT.md','w').write(t); print('RESULT.md written',len(t))
