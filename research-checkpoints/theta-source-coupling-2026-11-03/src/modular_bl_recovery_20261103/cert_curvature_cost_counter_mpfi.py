exec(open('/workspace/shared/modular_bl_recovery_20261103/check_midpoint_mpfi.py').read().split('pi=I()')[0])
two=I(2); total=I(0);step=I('.001')
for j in range(150):
 lo=math.nextafter((350+j)/1000,-math.inf);hi=math.nextafter((351+j)/1000,math.inf);t=inter(lo,hi);t2=t*t;t4=t2*t2;g=t2.unary('neg').unary('exp');h=(I(-10)*t2).unary('exp');F=g+h;F1=I(-2)*t*g-I(20)*t*h;F2=(I(4)*t2-I(2))*g+(I(400)*t2-I(20))*h;F4=(I(16)*t4-I(48)*t2+I(12))*g+(I(160000)*t4-I(48000)*t2+I(1200))*h;lam=two*(F1*F1-F*F2);ll=two*(F2*F2-F*F4)
 assert lam.hi()<0 and ll.lo()>0,(j,lam.hi(),ll.lo())
 total=total+two*t2*ll*step
print('R lower',total.lo(),'R upper',total.hi(),flush=True);assert total.lo()>29
