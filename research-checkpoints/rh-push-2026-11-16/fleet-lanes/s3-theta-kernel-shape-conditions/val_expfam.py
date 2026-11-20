# validation of t_expfam.py against the diagnostic table of PR 41 (x = 0.1, y = 14.1347251417):
# mu 0.0046209243, I 0.0462077560, |phi| 0.0002781754, Re Z 10.0067677, bound -772.7449229
import t_expfam as T, klib3 as K3
from flint import arb
sp = K3.SPEC('zeta')
f = T.Fvals('zeta', sp, '0.1', 192, None)
F = f(0); F0, F1, F2 = F[0].real, F[1].real, F[2].real
mu = F1/F0; I = F2/F0 - mu*mu
G = f('14.1347251417')
phi = (G[0].real**2 + G[0].imag**2).sqrt()/F0
Z = (G[1]/G[0]).real
B = mu - I.sqrt()*(1 - phi*phi).sqrt()/phi
print('mu', mu.str(12), 'I', I.str(12), '|phi|', phi.str(12), 'ReZ', Z.str(12), 'bound', B.str(12))
