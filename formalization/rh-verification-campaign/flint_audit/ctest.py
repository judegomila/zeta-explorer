import subprocess, mpmath as mp
mp.mp.dps=30
def Ctrue(sigma,t0,h,k):
    f=lambda t: (2*mp.pi)**k*abs(mp.gamma((sigma+1j*(t+t0))/2))*mp.e**(mp.pi*(t+t0)/4 - t**2/(2*h**2))*abs(mp.mpf(1)/2+sigma-1j*t)**k
    L=12*h
    return mp.quad(f,mp.linspace(-L,L,49))
print("sigma t0 h k  C_true  C_FLINT(printed A.3)  ratio true/FLINT  ratio vs pi-corrected")
for (s,t0,h,k) in [(3,20,2,0),(3,100,2,0),(3,1000,5,0),(5,1000,5,0),(7,1000,5,0),(9,1000,5,0),(3,1000,5,2),(5,10000,10,1),(25,10000,1.45,0),(25,1e6,1.45,0)]:
    ct=Ctrue(s,t0,h,k)
    cf=mp.mpf(subprocess.check_output(["./cb",str(s),str(t0),str(h),str(k)]).decode().split()[0].strip('[]'))
    print(s,t0,h,k, mp.nstr(ct,8), mp.nstr(cf,8), mp.nstr(ct/cf,6), mp.nstr(ct/(mp.pi*cf),6))
