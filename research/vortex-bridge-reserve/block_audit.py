#!/usr/bin/env python3
"""Finite interval block scan; no asymptotic estimate is inferred."""
import json
from window_audit import WindowLab, I, D, DN, UP, ROOT

def run():
    lab = WindowLab()
    upper = lab.psi_upper_bound()
    output = {'scope': 'Finite logarithmic delay, not zero height',
              'input_sha256': lab.input_hash, 'step': '0.02', 'blocks': []}
    for hs in ('0.25', '0.5', '1', '2', '4'):
        h = I(hs)
        end = I(1000000).ln()-h
        # Begin at 0.70 to avoid the singular derivative at zero.
        points = [D('0.70')+D(k)*D('0.02')
                  for k in range(int((end.lo-D('0.70'))/D('0.02'))+1)]
        if points[-1] < end.lo:
            points.append(end.lo)
        low, excessive_charge, slope_drop = None, None, None
        max_residual = D(0)
        for t in points:
            ti = I(t)
            data = lab.decomposition(ti, h)
            value = D(data['window_value'][0])
            net = I(*data['new_prime_charge'])-I(*data['smooth_recovery'])
            i, j = lab.index(ti), lab.index(ti+h)
            d0 = lab.moments[j][0]-lab.moments[i][0]-(lab.arch(ti+h)[1]-lab.arch(ti)[1])
            # D0=v(t)-v(t+h). D1 is the time-integrated charge discrepancy.
            v0 = I(*data['slope'])
            d1 = lab.psi(ti)+h*v0-lab.psi(ti+h)
            ds = lab.moments[j][0]-lab.moments[i][0]
            dm = lab.moments[j][1]-lab.moments[i][1]
            d1_direct = (ti+h)*ds-dm-(lab.arch(ti+h)[0]-lab.arch(ti)[0]-h*lab.arch(ti)[1])
            assert max(d1.lo,d1_direct.lo) <= min(d1.hi,d1_direct.hi)
            data.update(h=hs, D0=d0.strings(), D1=d1.strings(),
                        charge_minus_recovery=net.strings())
            for key in ('identity_residual',):
                max_residual = max(max_residual, *(abs(D(x)) for x in data[key]))
            if low is None or value < D(low['window_value'][0]): low = data
            if excessive_charge is None or net.lo > D(excessive_charge['charge_minus_recovery'][0]): excessive_charge = data
            if slope_drop is None or d0.lo > D(slope_drop['D0'][0]): slope_drop = data
        radius = UP.add(D('0.01'), UP.subtract(end.hi,end.lo))
        correction = UP.multiply((I(upper)/h).hi, radius)
        output['blocks'].append({'h':hs, 'grid_points':len(points),
            'domain':['0.70',end.strings()],
            'continuous_window_lower':str(DN.subtract(D(low['window_value'][0]),correction)),
            'minimum_window_grid':low, 'maximum_local_charge_excess_grid':excessive_charge,
            'maximum_slope_drop_grid':slope_drop, 'identity_residual_absolute_upper':str(max_residual)})
        print(hs, low['t'][0], low['window_value'][0], flush=True)
    # Exact rational control: equal block mass, different timing, secular drift.
    from fractions import Fraction as F
    controls=[]
    for r in (F(1,4),F(1,2),F(3,4)):
        d0=F(0); d1=F(1,2)-r
        assert d0 == 0
        controls.append({'unit_impulse_time':str(r),'D0':str(d0),'D1':str(d1),
                         'displacement_per_block':str(-d1),'slope_at_block_end':'0'})
    output['synthetic_constant_curvature_controls']=controls
    # Exponentially growing recovery, K_j >= exp(2j) equally weighted
    # impulses in [j+1/4,j+1/3]. These are synthetic, not prime powers.
    qfactor=2*((I('0.5')).exp()-1)
    diagonal_bound=qfactor*qfactor/(2*(1-I('-1.5').exp()))
    output['synthetic_exponential_control']={
        'curvature':'exp(t/2)', 'events_per_block':'ceil(exp(2*j))',
        'event_locations':'j+1/4+l/(12*(K_j+1)), l=1,...,K_j',
        'each_jump':'2*(exp(1/2)-1)*exp(j/2)/K_j',
        'D0':'0 exactly', 'D1_lower':'Q_j/6',
        'diagonal_sum_upper':str(diagonal_bound.hi),
        'endpoint_upper':'Psi(0)-(exp(m/2)-1)/3',
        'interpretation':'Disproves inference from positive curvature, balanced mass and finite diagonal loss alone.'}
    (ROOT/'block_audit.json').write_text(json.dumps(output,indent=2)+'\n')

if __name__ == '__main__': run()
