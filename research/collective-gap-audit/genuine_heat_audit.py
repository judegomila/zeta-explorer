#!/usr/bin/env python3
"""Numerical audit of genuine xi heat-flow gaps (NOT a rigorous interval certificate).

H_t(x)=integral_0^infinity exp(t*u*u) Phi(u) cos(x*u) du,
H_0(x)=xi(1/2+i*x/2)/8. A simple root moves with x'=H''/H'.
No truncated zero interaction is used in the reported qdot.
"""
import argparse
import csv
from pathlib import Path
import mpmath as mp

def phi(u, nmax):
    return sum((2*mp.pi**2*n**4*mp.exp(9*u)-3*mp.pi*n*n*mp.exp(5*u))
               *mp.exp(-mp.pi*n*n*mp.exp(4*u)) for n in range(1,nmax+1))

def H(t,x,k,nmax,umax):
    cuts=sorted(set(c for c in [mp.mpf(0),mp.mpf('.25'),mp.mpf('.5'),mp.mpf('.75'),mp.mpf(1),umax] if c<=umax))
    return mp.quad(lambda u: mp.exp(t*u*u)*phi(u,nmax)*u**k*
                   mp.cos(x*u+k*mp.pi/2),cuts)

def audit(times,pairs,nmax,umax):
    starts=[2*mp.im(mp.zetazero(j)) for j in range(1,pairs+2)]
    rows=[]
    for t in times:
        roots=[]; velocities=[]; residuals=[]
        for start in starts:
            x=mp.mpf(start)
            for _ in range(10):
                step=H(t,x,0,nmax,umax)/H(t,x,1,nmax,umax)
                x-=step
                if abs(step)<mp.mpf('1e-24'):break
            roots.append(x)
            velocities.append(H(t,x,2,nmax,umax)/H(t,x,1,nmax,umax))
            residuals.append(abs(H(t,x,0,nmax,umax)))
        assert all(a<b for a,b in zip(roots,roots[1:])), 'root ordering changed'
        for j in range(pairs):
            gap=roots[j+1]-roots[j]
            qdot=2*gap*(velocities[j+1]-velocities[j])
            rows.append([mp.nstr(t,10),j+1,mp.nstr(roots[j],20),
                mp.nstr(roots[j+1],20),mp.nstr(gap,18),
                mp.nstr(qdot,18),mp.nstr(1-qdot/8,18),
                mp.nstr(max(residuals[j:j+2]),5),
                nmax,mp.nstr(umax,5),'NUMERICAL_NOT_CERTIFIED'])
        starts=roots
    return rows

def selftest():
    for t in [mp.mpf(0),mp.mpf('.03')]:
        a=mp.sqrt(1+6*t)
        roots=[-a,mp.mpf(0),a]
        v=[6*x/(3*x*x-1-6*t) for x in roots]
        for j in (0,1):
            assert abs(2*(roots[j+1]-roots[j])*(v[j+1]-v[j])-6)<mp.mpf('1e-25')
    s=mp.mpf('.5')
    xi=s*(s-1)*mp.pi**(-s/2)*mp.gamma(s/2)*mp.zeta(s)/2
    assert abs(H(0,0,0,7,mp.mpf('1.4'))-xi/8)<mp.mpf('1e-25')

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--times',default='0,0.02')
    p.add_argument('--pairs',type=int,default=2)
    p.add_argument('--terms',type=int,default=7)
    p.add_argument('--umax',default='1.4')
    p.add_argument('--dps',type=int,default=35)
    p.add_argument('--output',default='genuine_heat_snapshot.csv')
    a=p.parse_args()
    mp.mp.dps=a.dps
    selftest()
    rows=audit([mp.mpf(s) for s in a.times.split(',')],a.pairs,a.terms,mp.mpf(a.umax))
    out=Path(a.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    with out.open('w',newline='') as f:
        w=csv.writer(f)
        w.writerow(['heat_time','pair_index','root_lower_z','root_upper_z','gap_z',
                    'qdot_from_genuine_H','R_effective_from_H','max_root_residual',
                    'theta_terms','integration_upper','status'])
        w.writerows(rows)
    print('PASS polynomial and theta normalization checks')
    for r in rows:print('t=%s pair=%s gap=%s qdot=%s R_eff=%s'% (r[0],r[1],r[4],r[5],r[6]))
    print('NOT CERTIFIED: truncation/quadrature convergence is empirical')

if __name__=='__main__':main()
