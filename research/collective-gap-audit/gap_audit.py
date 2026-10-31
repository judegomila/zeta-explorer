#!/usr/bin/env python3
"""Exploratory collective gap audit for the xi heat-flow zero equation.

Only the polynomial self-tests are exact. The zeta sample uses a finite list of
known critical-line zeros and omits the rest (including hypothetical off-line
zeros); it must not be described as a certified heat-flow derivative.
"""
import argparse
import csv
from pathlib import Path
import mpmath as mp

def metrics(roots, j):
    a, b = roots[j:j+2]
    g = b-a
    S = sum(1/((b-z)*(a-z)) for k,z in enumerate(roots) if k not in (j,j+1))
    return float(g), float(S), float(g*g*S/2), float(8-4*g*g*S)

def tests():
    # P_t(z) = z(z^2-1-6t), solving dP/dt=-P''.
    for t in ('0', '0.1', '0.5'):
        a = mp.sqrt(1+6*mp.mpf(t))
        for j in (0, 1):
            _, _, R, qdot = metrics([-a, mp.mpf(0), a], j)
            assert abs(qdot-6) < 1e-12
            assert abs(R-0.25) < 1e-12
    # Symmetric truncation of unit lattice: R=M/(M+1), tends to 1.
    for M in (1, 2, 5, 20):
        _, _, R, _ = metrics([mp.mpf(k) for k in range(-M,M+2)], M)
        assert abs(R-M/(M+1)) < 1e-12

def xi(s):
    return s*(s-1)*mp.power(mp.pi,-s/2)*mp.gamma(s/2)*mp.zeta(s)/2

def actual_velocity(gamma):
    # z=2*gamma; H_t(z)=xi(1/2+i*z/2)/8 at t=0.
    s=mp.mpf('0.5')+1j*gamma
    v=(1j/2)*mp.diff(xi,s,2)/mp.diff(xi,s)
    return mp.re(v), abs(mp.im(v))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--zeros',type=int,default=80)
    ap.add_argument('--exact-pairs',type=int,default=3,
                    help='Number of pairs with independently differentiated xi velocities')
    ap.add_argument('--output',default='gap_snapshot.csv')
    args=ap.parse_args()
    if args.zeros < 3 or args.exact_pairs < 0 or args.exact_pairs >= args.zeros:
        ap.error('Need zeros >=3 and 0 <= exact-pairs < zeros')
    mp.mp.dps=40
    tests()
    gammas=[mp.im(mp.zetazero(k)) for k in range(1,args.zeros+1)]
    velocities=[actual_velocity(g) for g in gammas[:args.exact_pairs+1]]
    out=Path(args.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    with out.open('w',newline='') as f:
        writer=csv.writer(f)
        writer.writerow(['pair_index','gamma_lower','gamma_upper','gap_gamma',
                         'R_truncated','qdot_truncated','qdot_exact_from_xi',
                         'missing_contribution','zeros_used','status'])
        for j in range(args.zeros-1):
            gap, S, R, qdot=metrics(gammas,j)
            actual=''
            missing=''
            if j < args.exact_pairs:
                # q=(z_{j+1}-z_j)^2=4*(gamma_{j+1}-gamma_j)^2.
                # qdot=2*(2gap)*(v_{j+1}-v_j)=4gap*dv.
                actual=float(4*(gammas[j+1]-gammas[j])*(velocities[j+1][0]-velocities[j][0]))
                missing=actual-qdot
            writer.writerow([j+1,mp.nstr(gammas[j],17),mp.nstr(gammas[j+1],17),
                             gap,R,qdot,actual,missing,args.zeros,'EXPLORATORY'])
    print('PASS polynomial and lattice identities')
    print('Saved',out)
    for j in range(args.exact_pairs):
        print('pair',j+1,'truncated qdot',end=' ')
        print(metrics(gammas,j)[3],'exact qdot',
              float(4*(gammas[j+1]-gammas[j])*(velocities[j+1][0]-velocities[j][0])))

if __name__=='__main__':
    main()
