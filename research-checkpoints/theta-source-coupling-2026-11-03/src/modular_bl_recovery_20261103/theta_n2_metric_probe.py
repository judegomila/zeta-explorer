exec(open('/tmp/theta_bl_probe.py').read().split('I=')[0]);P=integ(lambda h:vals(h)[0]**2);I=integ(lambda h:h*h*vals(h)[0]**2);K=integ(lambda h:h*h*vals(h)[1]**2);s0=4*I;s1=4*K-2*P;alpha=s1/s0
H=lambda h:vals(h)[2]+alpha*vals(h)[0]
s2=4*integ(lambda h:h*h*H(h)**2)+8*integ(lambda h:h*H(h)*vals(h)[1])
print('alpha',alpha,'s0',s0,'s1',s1,'s2',s2,'s2/s0',s2/s0)
def fun(h):
 p,q,r=vals(h);return m.log(h)+m.log(p*p/s0+q*q/s1+(r+alpha*p)**2/s2)
for k in range(1,81):
 h=m.mpf(k)/100;v=m.diff(fun,h,2)
 if v>0: print('positive',float(h),float(v));break
else:print('no positive sample')
