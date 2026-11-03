import mpmath as m
m.mp.dps=50
for r in (m.mpf('1.5'),m.mpf('3')):
 target=512*(4-r*r)/(4+r*r)**4
 print('r',r,'limit',m.nstr(target,20))
 for n in (5,10,20):
  P=m.pi*n*n
  def h(x):
   u=x/(2*P)
   return m.exp(u/2)*(m.exp(4*u)-3*m.exp(2*u)/(2*P))*m.exp(-P*m.expm1(2*u))
  fs=[4/m.mpf(2)**j*m.quad(lambda x:h(x)*x**j*m.cos(r*x/2+j*m.pi/2),[0,1,5,15,40,100]) for j in range(3)]
  val=fs[1]**2-fs[0]*fs[2]
  print(n,m.nstr(val,20),'error',m.nstr(val-target,8))
