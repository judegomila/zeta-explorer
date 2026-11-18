# Finite computation for the decisive test 2 pi^2 c > C.
import math, json
from mpmath import mp, zeta, mpf, findroot, diff, log
mp.dps = 25
pi2 = math.pi**2
out = {}
# required exponents
out['c_required'] = {'(i) C=2 (Re s = 1)': 2/(2*pi2), '(ii) C=3/2 (Re s = 7/8)': 1.5/(2*pi2),
                     'C=4.9 (first-term dominance)': 4.9/(2*pi2), 'XuSang C=4(0.874886647-1/2)': 4*(0.874886647-0.5)/(2*pi2)}
# Polymath-type precision eps = 2^{-(1/2 + kappa/4)}: exponent c*L = (1/2 + C/4) log 2; pass iff L < L_max
out['first_term_anchor_Lmax'] = {C: 2*pi2*math.log(2)*(0.5 + C/4)/C for C in (1.5, 2, 4.9)}
# actual deficit 1 - q = (2 pi^2 / L^2) a : c_eff = (2 log L - log(2 pi^2 a))/L ; pass iff 2 log L - log(2 pi^2 a) > C L / (2 pi^2)
def g(s):  # (zeta'/zeta)'(s) = sum Lambda(n) log n n^{-s}
    return float(diff(lambda u: zeta(u, derivative=1)/zeta(u), s))
def L0(C, a):
    f = lambda L: 2*math.log(L) - math.log(2*pi2*a) - C*L/(2*pi2)
    lo = max(math.sqrt(2*pi2*a)*1.0001, 2.0)
    # largest root
    hi = 5000.0
    if f(lo) < 0 and max(f(lo + k) for k in range(0, 400)) < 0: return None
    L = hi
    while f(L) < 0: L -= 0.01
    return L
tab = []
for eta in (0.5, 0.25, 0.1, 0.05):
    sig = 1 + eta
    a_first = 0.5*math.log(2)**2*2**(-sig)          # guaranteed negative excursion (half the n = 2 coefficient)
    a_sup = g(sig) - 4*g(2*sig)                      # all p^{-i tau} = -1 (Kronecker supremum)
    C = 2 + 4*eta
    tab.append(dict(eta=eta, C=C, c_required=C/(2*pi2), a_first=a_first, a_sup=a_sup,
                    L0_first=L0(C, a_first), L0_sup=L0(C, a_sup)))
out['anchor_i_table'] = tab
# c_eff at sample heights for a = 0.5
out['c_eff_a0.5'] = {L: (2*math.log(L) - math.log(2*pi2*0.5))/L for L in (6, 10, 14, 18, 26.89, 50, 100, 230)}
# bootstrap reach (leading order): anchor Re s = B + eta, worst-case deficit, certified depth in delta = (pi^2/2L) log(1/deficit)
#  (i) deficit = 2 pi^2/(eta L)^2 : reach(eta) = 1 + eta - (pi^2/2L) log((eta L)^2/(2 pi^2)), minimised at eta = pi^2/L
out['reach_i'] = {'eta_opt_times_L': pi2, 'reach_minus_1_times_L': pi2*(1 - 0.5*math.log(pi2/2))}
#  (ii) deficit <= pi^2/(eta L) (zero-sum bound under ZF(7/8)); certified depth is 0 while this bound is >= 1 (eta <= pi^2/L);
#       for eta >= pi^2/L reach(eta) = 7/8 + eta - (pi^2/2L) log(eta L/pi^2) is increasing, so min reach = 7/8 + eta for eta -> 0.
out['reach_ii'] = {'reach_minus_7_8_times_L_at_eta_pi2_over_L': pi2, 'infimum': '7/8 (eta -> 0, certified depth 0)'}
out['reach_i']['infimum'] = '1 (eta -> 0, certified depth 0); interior minimum 1 + 1.992/L'
json.dump(out, open(__file__.rsplit('/',1)[0] + '/thresholds.json', 'w'), indent=1)
print(json.dumps(out, indent=1))
