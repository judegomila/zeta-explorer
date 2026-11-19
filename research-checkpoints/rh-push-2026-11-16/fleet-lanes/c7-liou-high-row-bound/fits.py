import json, numpy as np
r = json.load(open('check2.json'))
lg = np.array([x['log2X'] for x in r])
def col(f): return np.array([f(x) for x in r])
D = col(lambda x: x['D']); P = col(lambda x: x['P']['liou']); N = col(lambda x: x['N']['liou']); R = N - D - P
for name, y in (('D', D), ('P_liou', P), ('|R_liou|', -R), ('N_liou', N), ('N_liou - D', N - D)):
    print('%-11s exponent in Z on 2^8..2^14: %.3f   on 2^11..2^14: %.3f' % (name, np.polyfit(lg[lg >= 8], np.log2(y[lg >= 8]), 1)[0], np.polyfit(lg[lg >= 11], np.log2(y[lg >= 11]), 1)[0]))
print('log2Z  P/Z^(7/6)  R/Z      R/(Z ln Z)  R/P     P_nm50/P_liou (m_nm50/m_liou)^2  P_tw/P_liou (m_tw/m_liou)^2  P_one/P_liou')
for x in r:
    Z = 2.0 ** x['log2X']; me = {k: a * a + b * b for k, a, b in x['mert']}
    Rl = x['N']['liou'] - x['D'] - x['P']['liou']
    print('%5.1f  %.5f   %+.5f  %+.6f  %+.3f   %.4f  %.4f          %.4f  %.4f        %+.4f' % (x['log2X'], x['P']['liou'] / Z ** (7 / 6), Rl / Z, Rl / (Z * np.log(Z)), Rl / x['P']['liou'],
          x['P']['nm50'] / x['P']['liou'], me['nm50'] / me['liou'], x['P']['tw_liou'] / x['P']['liou'], me['tw_liou'] / me['liou'], x['P']['one'] / x['P']['liou']))
