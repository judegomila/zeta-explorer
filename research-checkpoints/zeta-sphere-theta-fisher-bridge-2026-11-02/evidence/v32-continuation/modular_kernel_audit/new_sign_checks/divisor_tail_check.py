import mpmath as m
iv=m.iv;iv.dps=30;p=iv.pi;q=iv.exp(-2*p)
A=9*p*p/(4*p-5)**2
B=4*p**4/(4*p-9)**2
C=12*p**3*iv.exp(1/(4*p))/(4*p-7)**2
for L,ceiling in [(3,'1.034e-6'),(4,'3.316e-9'),(5,'9.478e-12')]:
 s0=q**L/(1-q)
 s1=q**L*(L/(1-q)+q/(1-q)**2)
 s2=q**L*(L**2/(1-q)+2*L*q/(1-q)**2+q*(1+q)/(1-q)**3)
 bound=(A*s0+B*s2+C*s1)/2
 print('L=',L,'tail <=',bound)
 assert bound < iv.mpf(ceiling)
print('Bounds below are multiplied by a (0 < a <= 1/2):')
Ap=9*p*p/(4*p-5)**3
Bp=4*p**4/(4*p-9)**3
Cp=12*p**3*iv.exp(1/(4*p))/(4*p-7)**3
for L,ceiling in [(3,'7.358e-7'),(4,'1.792e-9'),(5,'4.127e-12')]:
 s0=q**L/(1-q)
 s1=q**L*(L/(1-q)+q/(1-q)**2)
 bound=4*((Ap/L+Cp)*s0+Bp*s1)
 print('L=',L,'tail / a <=',bound)
 assert bound < iv.mpf(ceiling)
