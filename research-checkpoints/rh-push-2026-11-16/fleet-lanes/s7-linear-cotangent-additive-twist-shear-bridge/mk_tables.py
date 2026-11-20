# mk_tables.py : markdown tables for RESULT.md from srv/ (server) and locK/ (local fallback)
import json, os, glob, math
def L(p):
    try: return json.load(open(p))
    except Exception: return None
names=[('zeta','zeta'),('chi4','L(chi_-4)'),('chi5','L(chi_5)'),('dh','DH'),('nr_101_2.2','T-NR q=101 (integer form)'),('nr_1000003_2.2','T-NR q=1000003 (integer form)'),
       ('g_liou','Liouville'),('g_U_re','U=zeta(s+i), Re'),('g_U_im','U=zeta(s+i), Im'),('g_Ea','E_a, a=1/4')]
print('### T1 table\n')
print('| function | K | fractions | L2 Holder exp (1e-7..1e-2) | max abs jump at q<=13 | jump-law error | wobble sd/x0^2 at x0=0.1, 0.01, 0.001 | wobble sd/x0 at 0.1, 0.01 | orbit resid RMS step 0, 3 | capture ratio | xi* |')
print('|---|---|---|---|---|---|---|---|---|---|---|')
for tag,nm in names:
    for D in ('srv','locK'):
        d=L(f'{D}/an1_{tag}.json')
        if d is None: continue
        wb={w[0]:w for w in d['cusp_wobble_x0_n_sd_sd/x0^2_sd/x0']}
        g=lambda x,i: ('%.3g'%wb[x][i]) if x in wb else '-'
        ob=d['gauss_orbit_step_n_rmspsi_rmsresid_rms(resid/x^2)']; t=d['toeplitz']
        je=d.get('jump_pred_max_err')
        print(f"| {nm} ({'server' if D=='srv' else 'local'}) | {d['K']} | {d['count_used']} | {d['holder_L2_exponent_1e-7_1e-2']:.3f} | {d['jump_max_abs']:.2e} | {('%.1e'%je) if je is not None else '-'} | {g(0.1,3)}, {g(0.01,3)}, {g(0.001,3)} | {g(0.1,4)}, {g(0.01,4)} | {ob[0][3]:.4f}, {ob[min(3,len(ob)-1)][3]:.4f} | {t['capture_ratio']:.3f} | {t['xi_star']:.2f} |")
print('\n### T1 symbol check: Re X_F(xi) recovered from the Farey table (tail-extended) against mpmath\n')
ref=L('out/symbol_ref.json')
for tag in ['zeta','chi4','chi5','dh']:
    for D in ('srv','locK'):
        d=L(f'{D}/an1_{tag}.json')
        if d is None: continue
        rec=dict((round(a,3),b) for a,b in d['toeplitz']['ReX_tail_extended']); rr=dict((round(a,3),b) for a,b in ref[tag])
        print(tag,D,'K',d['K'],' '.join('xi=%g: %.4f / %.4f;'%(x,rec[x],rr[x]) for x in [0,1,2,3,5,8,10,14.135]))
        break
print('\n### T1 jump law (first rows)\n')
for tag in ['chi4','chi5','dh']:
    for D in ('srv','locK'):
        d=L(f'{D}/an1_{tag}.json')
        if d is None: continue
        print(tag,D,'K',d['K'],'; '.join('%d/%d: %.5f (pred %.5f)'%(j[0],j[1],j[2],j[3]) for j in d['jumps'][:9])); break
print('\n### T2 leaf table\n')
rows=[]
for D,f in (('srv','srv/leaf.jsonl'),('srv','srv/leafgen.jsonl'),('locK','locK/leaf.jsonl')):
    if os.path.exists(f):
        for ln in open(f):
            try: r=json.loads(ln); r['src']=D; rows.append(r)
            except Exception: pass
seen=set()
print('| function | b | ratio abs(S)/A | A/b^2 | M2w | source |'); print('|---|---|---|---|---|---|')
for r in sorted(rows,key=lambda r:(r['fn'],r['b'],r['src']!='srv')):
    if (r['fn'],r['b']) in seen: continue
    seen.add((r['fn'],r['b']))
    print(f"| {r['fn']} | {r['b']} | {r['ratio']:.6f} | {r['A_over_b2']:.6f} | {r.get('M2w',float('nan')):.6f} | {r['src']} |")
a2=L('srv/analyze2.json')
if a2:
    print('\n### T2 OFFDIAG/DIAG\n'); 
    for r in a2: print(f"{r['fn']} b={r['b']} OFFDIAG/DIAG={r['OFFDIAG_over_DIAG']:.4f}")
