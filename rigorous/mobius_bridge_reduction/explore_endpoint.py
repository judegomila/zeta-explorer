"""Exploratory optimization only; no floating-point value is a certificate."""
import json
import numpy as np
from scipy.optimize import minimize, minimize_scalar, root

KAPPA=29991/40000

def endpoint(delta,x,b,ell,kappa=KAPPA):
    c=1/(3*kappa)
    h=(1+b+3*ell)/2
    ly=(1+b-ell)/2
    D=3-(1+2*c)*x
    P=(2-2*c*x)*(1-x)
    J=(5/6-delta)*D+delta*P
    R=1-delta+(5/6-delta)*delta*P/(2*J)
    C0=-1/4+b/6+5*ell/4
    return C0+delta/2+delta*x*(ell+c*(h/4-ly/2))-3*h/4*(1-R)

def max_endpoint(b,ell,kappa=KAPPA):
    result=minimize_scalar(lambda d:-endpoint(d,.5,b,ell,kappa),bounds=(1/8,5/6),method='bounded',options={'xatol':1e-14})
    return -result.fun,result.x

def solve(kappa):
    def con(v):
        b,ell=v
        return -max_endpoint(b,ell,kappa)[0]
    r=minimize(lambda v:-v[1],[.086535,1253399/7500000],method='SLSQP',bounds=[(.05,.15),(1/6,.17)],constraints=[{'type':'ineq','fun':con}],options={'ftol':1e-14,'maxiter':200})
    b,ell=r.x
    ds=np.linspace(1/8,5/6,1001); xs=np.linspace(0,.5,501)
    vals=endpoint(ds[:,None],xs[None,:],b,ell,kappa)
    ix=np.unravel_index(np.argmax(vals),vals.shape)
    return {'kappa':kappa,'b':b,'ell':ell,'B':11/12-ell/4,'max_endpoint_xhalf':max_endpoint(b,ell,kappa),'mesh_max':float(vals[ix]),'mesh_location':[float(ds[ix[0]]),float(xs[ix[1]])],'success':bool(r.success)}

if __name__=='__main__':
    results=[]
    for kap in [.75,KAPPA,2*.8748867-1]:
        results.append(solve(kap))
    print(json.dumps(results,indent=2))
    print('published',max_endpoint(17307/200000,1253399/7500000))
