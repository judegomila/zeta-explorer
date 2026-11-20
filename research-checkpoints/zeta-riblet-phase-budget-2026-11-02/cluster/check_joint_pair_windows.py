"""Exact controls for the disjoint two-zero windows and four-point kernel."""
from decimal import Decimal
from fractions import Fraction as F
from math import ceil, floor
from pathlib import Path
import json

from check_centroid_packing import signed


def projected_integral(left, right, ordinate):
    assert ordinate < left or right < ordinate
    return 1 / (left - ordinate) - 1 / (right - ordinate)


def log_derivative(t, zeros):
    return sum((t - x) / ((t - x)**2 + b**2) for x, b in zeros)


def test_witness_packing():
    # Each adverse source can choose a different worst point in every gap.
    gaps = [(F(-5), F(-2)), (F(-2), F(-1, 8)),
            (F(0), F(2, 5)), (F(2, 5), F(3))]
    cases = 0
    for ordinate in [F(-6), F(-2), F(-1, 16), F(0), F(3)]:
        for b in [F(1, 30), F(1, 4), F(4, 9)]:
            total = 0
            for x, y in gaps:
                worst = 0
                for k in range(65):
                    t = x + (y - x) * k / 64
                    distance = min(t - x, y - t)
                    worst = max(worst, distance**2 * max(0, -signed(t - ordinate, b)))
                total += worst
            assert total <= F(1, 4)
            cases += 1
    return cases


def test_windows():
    step = F(1, 1024)
    clearance = F(1, 4)
    cases = 0
    for x in [F(0), step / 17, step]:
        for width in [clearance, 1 + step / 3, F(64)]:
            y = x + width
            u = (ceil(x / step) - 1) * step
            v = (floor(y / step) + 1) * step
            assert 0 < x - u <= step and 0 < v - y <= step
            assert v - u <= 64 + 2 * step
            left, right = x - 2 * step, y + 2 * step
            for copies in [1, 7, 512]:
                for height_offset in [clearance, F(1, 2), F(3)]:
                    exterior = [(x-height_offset, F(0)),
                                (y+height_offset, F(1, 3)),
                                (y+height_offset, -F(1, 3))]
                    zeros = [(x, F(0)), (y, F(0))]
                    cost = copies * sum(projected_integral(left, right, g) for g, _ in exterior)
                    drop = (log_derivative(u, zeros) - log_derivative(v, zeros)
                            + copies * (log_derivative(u, exterior) - log_derivative(v, exterior)))
                    assert drop <= -2 / step + cost
                    for t in [u, (u+x)/2, (y+v)/2, v]:
                        negative = copies * sum(max(0, -signed(t-g, b)) for g, b in exterior)
                        assert 2 * step * negative <= cost
                        if cost < 1 / step:
                            curvature = (sum(signed(t-g, b) for g, b in zeros)
                                         + copies * sum(signed(t-g, b) for g, b in exterior))
                            assert curvature > 1 / (2 * step**2)
                            assert drop < -1 / step
                    cases += 1
    return cases


def test_exterior_budget():
    step = F(1, 1024)
    distance = F(1, 4) - 2 * step
    centers = [F(-2), F(0), F(3), F(13, 2)]
    intervals = [(x - 2*step, x + F(1, 2) + 2*step) for x in centers]
    ordinates = [F(k, 8) for k in range(-24, 65)]
    for ordinate in ordinates:
        cost = sum(projected_integral(left, right, ordinate) for left, right in intervals
                   if left - ordinate >= distance or ordinate - right >= distance)
        assert cost <= 2 / distance
    return len(ordinates)


def test_four_point_kernel():
    cases = 0
    for h in [F(1, 17), F(1, 2), F(4)]:
        for ratio in [F(0), F(1, 128), F(1, 3), F(1, 2), F(2), F(32)]:
            b = h * ratio
            zeros = [(F(0), b), (F(0), -b)]
            def observed(step):
                return step * (log_derivative(step, zeros) - log_derivative(-step, zeros)) / 2
            q = (4 * observed(h / 2) - observed(h)) / 3
            assert q == 2 / ((1 + 4 * ratio**2) * (1 + ratio**2))
            assert (q > F(4, 5)) == (ratio < F(1, 2))
            cases += 1
        # Exact complex modulus squared, with w=x+ib and |w| >= 2h.
        for x in [F(0), h, 2*h, 4*h]:
            for b in [F(0), h, 2*h, 5*h]:
                norm2 = x*x + b*b
                if norm2 < 4*h*h:
                    continue
                real, imag = x*x-b*b, 2*x*b
                def factor(scale):
                    return (h*h-scale*real)**2 + (scale*imag)**2
                kernel_sq = h**8 / (factor(1) * factor(4))
                assert kernel_sq <= (F(16, 45) * h**4 / norm2**2)**2
                pair = [(x, b), (x, -b)]
                def slope(step):
                    return step * (log_derivative(step, pair) - log_derivative(-step, pair)) / 2
                observed_q = (4*slope(h/2) - slope(h))/3
                # Real part of the reciprocal of the product, summed over the conjugates.
                product_real = (h*h-real)*(h*h-4*real) - 4*imag**2
                assert observed_q == 2*h**4 * product_real / (factor(1)*factor(4))
                cases += 1
    return cases


def test_saved_windows():
    source = Path(__file__).with_name('fixed-window-shear.json')
    rows = json.loads(source.read_text())['windows']
    pairs = [row for row in rows if row['strip_count'] == 2]
    assert [row['interval'] for row in pairs] == [[40, 44], [48, 52], [56, 60]]
    for row in pairs:
        assert Decimal(row['shear_lower']) > 0 > Decimal(row['endpoint_drop_upper'])
    empty, = [row for row in rows if row['strip_count'] == 0]
    assert empty['interval'] == [44, 48] and Decimal(empty['shear_lower']) > 0
    return len(pairs)


if __name__ == '__main__':
    density = (F(18, 100) - F(1, 64) - F(2, 21)) / 2 - F(1, 127)
    assert density > F(1, 40)
    print('Density bound:', density)
    print('Worst-point packing controls:', test_witness_packing())
    print('Padded pair configurations:', test_windows())
    print('Exterior charge controls:', test_exterior_budget())
    print('Four-point kernel controls:', test_four_point_kernel())
    print('Saved two-copy slope reversals:', test_saved_windows())
