"""Fill the pending rows of RESULT.md from c1_table.json. Usage: fill_result.py 'text for PENDINGC2' 'text for PEND100' 'short'"""
import json, sys
o = json.load(open('c1_table.json')); s = open('RESULT.md').read()
F = ('ZETA', 'LCHI', 'DH', 'TNR', 'EA', 'LIOU')
def row(T): return ' | '.join('%.4f [%.4f, %.4f]' % tuple(o[T]['%s|4/7' % f]['gap']) for f in F)
def krow(T):
    w = o[T]['windows']
    return '%.3f [%.3f, %.3f] | %.3f [%.3f, %.3f] | ' % (tuple(o[T]['ZETA|4/7']['kJ']) + tuple(o[T]['LCHI|4/7']['kJ'])) + ' | '.join('%d/%d; %.4f' % (o[T]['%s|4/7' % f]['windows_above_all_zeta_lchi'], w, o[T]['%s|4/7' % f]['min_excess_same_window']) for f in ('DH', 'TNR', 'EA', 'LIOU'))
s = s.replace('ROW1E9', row('1e+09')).replace('ROW1E10', row('1e+10')).replace('KROW1E9', krow('1e+09')).replace('KROW1E10', krow('1e+10'))
s = s.replace('NWIN10', str(o['1e+10']['windows'])).replace('MINKJ10', '%.3f' % o['1e+10']['ZETA|4/7']['kJ'][1]).replace('LIOU10A', '%.4f at 1e8, 1e9, 1e10' % o['1e+10']['LIOU|4/7']['max_excess_same_window'])
s = s.replace('PENDINGC2', sys.argv[1]).replace('PEND100SHORT', sys.argv[3]).replace('PEND100', sys.argv[2])
open('RESULT.md', 'w').write(s)
print('missing windows at 1e10:', o['1e+10']['missing'], 'count', o['1e+10']['windows'])
for th in ('1/2', '4/7'):
    for T in o: print(T, th, {f: [round(x, 4) for x in o[T]['%s|%s' % (f, th)]['gap']] for f in F})
