#!/usr/bin/env python3
"""Finite interval audit of fixed-window averaging; no infinite-tail claim.

Uses the previous prime-power certificate for nonnegativity of Psi and checks
its hash. Reconstructs prime moments independently from each (n,p) event.
The fixed-window formula is checked against split, eventwise integration.
"""
import csv
import hashlib
import json
from bisect import bisect_right
from pathlib import Path
from verify_reserve import I, D, DN, UP, constants, arch_interval

ROOT = Path(__file__).resolve().parent


class WindowLab:
    def __init__(self):
        self.c = constants()
        self.cert = json.loads((ROOT/'certificate/certificate.json').read_text())
        path = ROOT/'certificate/reserve_leaves.csv'
        self.input_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        assert self.input_hash == self.cert['leaf_sha256']
        self.n, self.log_lo, self.log_hi = [], [], []
        self.moments = [(I(0), I(0), I(0))]
        self.events = []
        self.event_max = D(0)
        lp_cache = {}
        with path.open(newline='') as stream:
            for row in csv.DictReader(stream):
                n, p = int(row['prime_power']), int(row['prime'])
                t = I(n).ln()
                if p not in lp_cache:
                    lp_cache[p] = I(p).ln()
                q = lp_cache[p]/I(n).sqrt()
                s, m, u = self.moments[-1]
                self.moments.append((s+q, m+q*t, u+q*t*t))
                self.n.append(n)
                self.log_lo.append(t.lo)
                self.log_hi.append(t.hi)
                self.events.append((t, q))
                self.event_max = max(self.event_max, D(row['psi_hi']))
                assert D(row['reserve_lower']) > 0
        assert len(self.events) == self.cert['prime_power_events']
        # At zero, integral comparison encloses the positive J3 tail.
        kmax = 10000
        partial = I(0)
        for k in range(kmax):
            lam = I(2*k)+I('0.5')
            partial = partial+1/lam**3
        lam = I(2*kmax)+I('0.5')
        tail_low = 1/(4*lam*lam)
        tail_high = tail_low+1/lam**3
        self.j3_zero = partial+I(tail_low.lo, tail_high.hi)
        self.arch_cache = {}

    def index(self, x):
        left = bisect_right(self.log_hi, x.lo)
        right = bisect_right(self.log_lo, x.hi)
        if left != right:
            raise ArithmeticError('event membership requires interval splitting')
        return left

    def arch(self, t):
        key = (t.lo, t.hi)
        if key in self.arch_cache:
            return self.arch_cache[key]
        if t.lo == t.hi == 0:
            # A(0)=0 exactly; A' has a logarithmic singularity here.
            value = (I(0), None, self.j3_zero)
        else:
            root = (t/2).exp()
            ratio = (-2*t).exp()
            power = 1/root
            j1, j2, j3 = I(0), I(0), I(0)
            k = 0
            while True:
                lam = I(2*k)+I('0.5')
                tail1 = power/(lam*(1-ratio))
                tail2, tail3 = tail1/lam, tail1/(lam*lam)
                if max(tail1.hi, tail2.hi, tail3.hi) < D('1e-29'):
                    j1, j2, j3 = (j1+I(0, tail1.hi), j2+I(0, tail2.hi),
                                  j3+I(0, tail3.hi))
                    break
                j1, j2, j3 = (j1+power/lam, j2+power/(lam*lam),
                              j3+power/lam**3)
                power = power*ratio
                k += 1
                if k > 100000:
                    raise RuntimeError('series did not converge')
            a = 4*(root+1/root-2)+self.c['c']*t+self.c['C']-j2
            ap = 2*(root-1/root)+self.c['c']+j1
            primitive = (8*root-8/root+(self.c['C']-8)*t
                         +self.c['c']*t*t/2+j3)
            value = (a, ap, primitive)
        self.arch_cache[key] = value
        return value

    def psi(self, t):
        s, m, _ = self.moments[self.index(t)]
        return self.arch(t)[0]-t*s+m

    def p2(self, t):
        s, m, u = self.moments[self.index(t)]
        return t*t*s-2*t*m+u

    def window(self, t, h):
        end = t+h
        arch_mean = (self.arch(end)[2]-self.arch(t)[2])/h
        return arch_mean-(self.p2(end)-self.p2(t))/(2*h)

    def window_piecewise(self, t, h):
        """Separate check: integrate A(u)-u*S+T on each event interval."""
        end = t+h
        start_index, end_index = self.index(t), self.index(end)
        left, total = t, I(0)
        for j in range(start_index, end_index+1):
            right = self.events[j][0] if j < end_index else end
            s, m, _ = self.moments[j]
            total = total+(self.arch(right)[2]-self.arch(left)[2]
                           -s*(right*right-left*left)/2+m*(right-left))
            left = right
        return total/h

    def decomposition(self, t, h):
        end = t+h
        i, j = self.index(t), self.index(end)
        s0, m0, u0 = self.moments[i]
        s1, m1, u1 = self.moments[j]
        arch, ap, primitive = self.arch(t)
        psi = arch-t*s0+m0
        slope = ap-s0
        inherited = psi+h*slope/2
        recovery = (self.arch(end)[2]-primitive)/h-arch-h*ap/2
        charge = (end*end*(s1-s0)-2*end*(m1-m0)+(u1-u0))/(2*h)
        value = self.window(t, h)
        residual = inherited+recovery-charge-value
        assert residual.lo <= 0 <= residual.hi
        return {'t': t.strings(), 'prime_power_events_in_window': j-i,
                'psi': psi.strings(), 'slope': slope.strings(),
                'inherited_state': inherited.strings(),
                'smooth_recovery': recovery.strings(),
                'new_prime_charge': charge.strings(),
                'window_value': value.strings(),
                'identity_residual': residual.strings()}

    def psi_upper_bound(self):
        # c<0; C-J2 and cosh increase on [0,0.1].
        b = I('0.1')
        near_zero = self.arch(b)[0]-self.c['c']*b
        upper = max(near_zero.hi, self.event_max)
        for box in self.cert['initial_segment']['positive_boxes']:
            upper = max(upper, arch_interval(I(box['left'], box['right']), self.c).hi)
        end = I(self.cert['integer_cutoff']).ln()
        upper = max(upper, self.psi(end).hi)
        # On every later event gap Psi is convex, so endpoints bound its maximum.
        return upper


def run():
    lab = WindowLab()
    h, step = I(1), D('0.01')
    domain_end = I(lab.cert['integer_cutoff']).ln()-h
    points = [D(k)*step for k in range(int(domain_end.lo/step)+1)]
    if points[-1] < domain_end.lo:
        points.append(domain_end.lo)
    rows = []
    outcsv = ROOT/'window_values.csv'
    with outcsv.open('w', newline='') as stream:
        writer = csv.writer(stream)
        writer.writerow(['t','psi_lo','psi_hi','window_lo','window_hi'])
        for t in points:
            raw, averaged = lab.psi(I(t)), lab.window(I(t), h)
            writer.writerow([str(t), *raw.strings(), *averaged.strings()])
            rows.append((averaged.lo, t, averaged.hi))
    upper = lab.psi_upper_bound()
    lipschitz = (I(upper)/h).hi  # W'=(Psi(t+h)-Psi(t))/h; both in [0,upper].
    radius = UP.add(step/2, UP.subtract(domain_end.hi, domain_end.lo))
    correction = UP.multiply(lipschitz, radius)
    grid_min = min(rows)
    continuous_lower = DN.subtract(grid_min[0], correction)
    assert continuous_lower > 0
    worst_after_initial = sorted(r for r in rows if r[1] >= I(2).ln().hi)[:5]
    blocks = [lab.decomposition(I(t), h) for _, t, _ in worst_after_initial]
    blocks.append(lab.decomposition(I(domain_end.lo), h))
    checks = []
    for t in ('0','0.1','1','3'):
        direct = lab.window(I(t), h)
        segmented = lab.window_piecewise(I(t), h)
        assert max(direct.lo,segmented.lo) <= min(direct.hi,segmented.hi)
        checks.append({'t':t, 'direct':direct.strings(),
                       'eventwise_integration':segmented.strings()})
    result = {
        'status':'finite_fixed_window_margin_certified',
        'infinite_tail_status':'UNPROVED',
        'input_leaf_sha256':lab.input_hash,
        'window_h':'1', 'integer_cutoff':lab.cert['integer_cutoff'],
        'domain':'0 <= t <= log(1000000)-1',
        'domain_end_enclosure':domain_end.strings(),
        'grid_points':len(points), 'maximum_grid_step':str(step),
        'psi_global_upper':str(upper), 'window_lipschitz_upper':str(lipschitz),
        'continuum_correction':str(correction),
        'grid_minimum_lower':str(grid_min[0]), 'grid_minimum_t':str(grid_min[1]),
        'continuum_window_lower':str(continuous_lower),
        'selected_blocks':blocks, 'independent_integration_checks':checks,
        'adaptive_smoothing_counterexample':{
            'signal':'f(t)=1+exp(t/10)*cos(100*t)',
            'fixed_box_width':1,
            'variable_iteration_count':'r(t)=ceil(t/10)+1',
            'bound':'B_1^{r(t)}f(t) >= 1-exp(-1) > 1/2',
            'reason':'|M_1(1/10+100i)| < 4/100 < exp(-1)',
            'scope':'Analytic counterexample to a variable-filter inference; not a zeta counterexample.'},
        'not_claimed':['a new zero-free region','RH','an extended raw positivity cutoff',
                       'novelty of fixed-window RH criteria']}
    (ROOT/'window_audit.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ('status','domain','grid_points',
                     'psi_global_upper','grid_minimum_lower','grid_minimum_t',
                     'continuum_window_lower','selected_blocks')},indent=2))


if __name__ == '__main__':
    run()
